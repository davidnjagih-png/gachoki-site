import { useState } from "react";
import { useContent } from "../../lib/contentContext";
import { importItems, removeItem, saveItem, saveOrder, seedSamples } from "../../lib/store";
import { cleanRecords, csvTemplate, readImportFile } from "../../lib/importer";
import ImageField from "./ImageField";
import { compressImage } from "../../lib/image";

/*
  A generic add / edit / delete / reorder screen, used for achievements,
  news, events and the gallery. Each screen only describes its fields.
*/
function Crud({ name, title, intro, fields, describe, sortable = false, samples = [], singular = "item", bulk = null, importable = false }) {
  const content = useContent();
  const items = content[name];
  const [editing, setEditing] = useState(null); // null | item object (id may be undefined)
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  const blank = () => Object.fromEntries(fields.map((f) => [f.key, f.default ?? ""]));

  async function onSave(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const item = { ...editing };
      if (!item.id && sortable) {
        const lowest = Math.min(0, ...items.map((i) => i.order ?? 0));
        item.order = lowest - 1; // new items go to the top
      }
      await saveItem(name, item);
      setEditing(null);
    } catch {
      setError("Could not save. Check your connection and that you are signed in as an administrator.");
    }
    setBusy(false);
  }

  async function onDelete(item) {
    if (!window.confirm(`Delete this ${singular}? This cannot be undone.`)) return;
    try {
      await removeItem(name, item.id);
    } catch {
      setError("Could not delete.");
    }
  }

  async function move(index, dir) {
    const ids = items.map((i) => i.id);
    const j = index + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    try {
      await saveOrder(name, ids);
    } catch {
      setError("Could not reorder.");
    }
  }

  // Bulk upload: pick many photos at once; each becomes its own record.
  async function onBulk(e) {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setError("");
    let done = 0;
    try {
      const lowest = Math.min(0, ...items.map((i) => i.order ?? 0));
      for (let n = 0; n < files.length; n++) {
        const image = await compressImage(files[n], bulk.maxSide || 1400);
        await saveItem(name, { image, caption: "", category: bulk.category || "", order: lowest - files.length + n });
        done++;
        setProgress(`Uploaded ${done} of ${files.length}`);
      }
      setProgress(`Added ${done} photo${done === 1 ? "" : "s"}. Open each to add a caption.`);
    } catch (err) {
      setError(`Stopped after ${done} of ${files.length}: ${err.message || "could not save"}`);
    }
    setBusy(false);
  }

  // Import: load many records from a .json or .csv file. Titles already listed are skipped.
  async function onImport(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setProgress("");
    try {
      const records = cleanRecords(await readImportFile(file, name), fields);
      const seen = new Set(items.map((i) => String(i.title || "").trim().toLowerCase()));
      const fresh = records.filter((r) => {
        const key = r.title.trim().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      const skipped = records.length - fresh.length;
      if (!fresh.length) {
        setProgress(records.length ? `Nothing new: all ${records.length} are already listed.` : "No usable records found in that file.");
        return;
      }
      const note = skipped ? ` (${skipped} already listed will be skipped)` : "";
      if (!window.confirm(`Add ${fresh.length} ${singular}${fresh.length === 1 ? "" : "s"} from ${file.name}${note}?`)) return;
      setBusy(true);
      const start = Math.max(-1, ...items.map((i) => i.order ?? 0)) + 1;
      await importItems(name, fresh, start);
      setProgress(`Added ${fresh.length} ${singular}${fresh.length === 1 ? "" : "s"}. Open each one to add a photo.`);
    } catch (err) {
      setError(err.message || "Could not import that file.");
    }
    setBusy(false);
  }

  function downloadTemplate() {
    const url = URL.createObjectURL(new Blob([csvTemplate(fields)], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const set = (key, value) => setEditing((cur) => ({ ...cur, [key]: value }));

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1>{title}</h1>
          {intro && <p className="admin-small">{intro}</p>}
        </div>
        {!editing && (
          <div className="admin-actions">
            {bulk && (
              <label className={`admin-btn ${busy ? "" : "primary"}`} aria-disabled={busy}>
                {busy ? "Uploading..." : "Upload several photos"}
                <input type="file" accept="image/*" multiple hidden disabled={busy} onChange={onBulk} />
              </label>
            )}
            {importable && (
              <>
                <label className="admin-btn" aria-disabled={busy}>
                  {busy ? "Importing..." : "Import from file"}
                  <input type="file" accept=".json,.csv,application/json,text/csv" hidden disabled={busy} onChange={onImport} />
                </label>
                <button className="admin-btn" type="button" onClick={downloadTemplate}>CSV template</button>
              </>
            )}
            <button className="admin-btn" onClick={() => setEditing(blank())}>+ Add {singular}</button>
          </div>
        )}
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {progress && !error && <p className="admin-ok" role="status">{progress}</p>}

      {editing && (
        <form className="admin-panel" onSubmit={onSave}>
          <h2>{editing.id ? `Edit ${singular}` : `New ${singular}`}</h2>
          <div className="admin-grid">
            {fields.map((f) => {
              if (f.type === "image") {
                return <ImageField key={f.key} label={f.label} value={editing[f.key]} onChange={(v) => set(f.key, v)} maxSide={f.maxSide} />;
              }
              return (
                <label key={f.key} className={`admin-field ${f.wide ? "wide" : ""}`}>
                  <span className="admin-label">{f.label}{f.required && " *"}</span>
                  {f.type === "textarea" ? (
                    <textarea rows={4} value={editing[f.key] ?? ""} required={f.required} maxLength={f.max || 2000} onChange={(e) => set(f.key, e.target.value)} />
                  ) : f.type === "select" ? (
                    <select value={editing[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}>
                      {f.options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : f.type === "combo" ? (
                    <>
                      <input list={`opts-${f.key}`} value={editing[f.key] ?? ""} required={f.required} maxLength={f.max || 60} onChange={(e) => set(f.key, e.target.value)} />
                      <datalist id={`opts-${f.key}`}>{f.options.map((o) => <option key={o} value={o} />)}</datalist>
                    </>
                  ) : (
                    <input type={f.type || "text"} value={editing[f.key] ?? ""} required={f.required} maxLength={f.max || 200} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} />
                  )}
                  {f.hint && <span className="admin-small">{f.hint}</span>}
                </label>
              );
            })}
          </div>
          <div className="admin-actions">
            <button className="admin-btn primary" type="submit" disabled={busy}>{busy ? "Saving..." : "Save"}</button>
            <button className="admin-btn" type="button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 && !editing && (
        <div className="admin-empty">
          <p>Nothing here yet.</p>
          {samples.length > 0 && (
            <button className="admin-btn" onClick={() => seedSamples(name, samples)}>Load sample placeholders</button>
          )}
        </div>
      )}

      <ul className="admin-list">
        {items.map((item, i) => {
          const { title: t, sub, image } = describe(item);
          return (
            <li key={item.id} className="admin-row">
              {image ? <img src={image} alt="" /> : <div className="row-thumb" />}
              <div className="row-main">
                <strong>{t}</strong>
                <span className="admin-small">{sub}</span>
              </div>
              <div className="row-actions">
                {sortable && (
                  <>
                    <button className="admin-btn icon" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>&uarr;</button>
                    <button className="admin-btn icon" aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>&darr;</button>
                  </>
                )}
                <button className="admin-btn" onClick={() => setEditing(item)}>Edit</button>
                <button className="admin-btn danger" onClick={() => onDelete(item)}>Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Crud;
