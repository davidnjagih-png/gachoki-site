import { useState } from "react";
import { useContent } from "../../lib/contentContext";
import { saveSettings } from "../../lib/store";
import ImageField from "./ImageField";

const lines = (text) => text.split("\n").map((s) => s.trim()).filter(Boolean);

function Field({ label, hint, wide, children }) {
  return (
    <label className={`admin-field ${wide ? "wide" : ""}`}>
      <span className="admin-label">{label}</span>
      {children}
      {hint && <span className="admin-small">{hint}</span>}
    </label>
  );
}

function Editor({ initial }) {
  const [s, setS] = useState(() => structuredClone(initial));
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key, value) => setS((cur) => ({ ...cur, [key]: value }));
  const setIn = (group, key, value) => setS((cur) => ({ ...cur, [group]: { ...cur[group], [key]: value } }));
  const setItem = (group, i, key, value) =>
    setS((cur) => ({ ...cur, [group]: cur[group].map((it, n) => (n === i ? { ...it, [key]: value } : it)) }));
  const addItem = (group, blank) => setS((cur) => ({ ...cur, [group]: [...cur[group], blank] }));
  const removeItem = (group, i) => setS((cur) => ({ ...cur, [group]: cur[group].filter((_, n) => n !== i) }));
  const moveItem = (group, i, d) =>
    setS((cur) => {
      const list = [...cur[group]];
      const j = i + d;
      if (j < 0 || j >= list.length) return cur;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...cur, [group]: list };
    });

  async function onSave(e) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      await saveSettings(s);
      setStatus("Saved. The public site is updated.");
    } catch {
      setStatus("Could not save. Check your connection and sign-in. Very large photos can also be too big: try a smaller one.");
    }
    setBusy(false);
  }

  const ItemTools = ({ group, i }) => (
    <div className="admin-actions">
      <button type="button" className="admin-btn icon" aria-label="Move up" disabled={i === 0} onClick={() => moveItem(group, i, -1)}>&uarr;</button>
      <button type="button" className="admin-btn icon" aria-label="Move down" disabled={i === s[group].length - 1} onClick={() => moveItem(group, i, 1)}>&darr;</button>
      <button type="button" className="admin-btn danger" onClick={() => removeItem(group, i)}>Remove</button>
    </div>
  );

  return (
    <form onSubmit={onSave}>
      <div className="admin-head sticky">
        <div><h1>Profile and career</h1><p className="admin-small">Press Save all changes when you finish.</p></div>
        <div className="admin-actions">
          {status && <span className="admin-ok" role="status">{status}</span>}
          <button className="admin-btn primary" type="submit" disabled={busy}>{busy ? "Saving..." : "Save all changes"}</button>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Profile</h2>
        <div className="admin-grid">
          <Field label="Name"><input value={s.name} onChange={(e) => set("name", e.target.value)} maxLength={80} /></Field>
          <Field label="Title" hint='For example "Hon." or "Eng.".'><input value={s.title} onChange={(e) => set("title", e.target.value)} maxLength={20} /></Field>
          <Field label="Current position" hint="Change this when the position changes."><input value={s.role} onChange={(e) => set("role", e.target.value)} maxLength={80} /></Field>
          <Field label="Area served"><input value={s.area} onChange={(e) => set("area", e.target.value)} maxLength={60} /></Field>
          <Field label="Party"><input value={s.party} onChange={(e) => set("party", e.target.value)} maxLength={40} /></Field>
          <Field label="Based in"><input value={s.basedIn} onChange={(e) => set("basedIn", e.target.value)} maxLength={60} /></Field>
          <Field label="Opening sentence" wide hint="Shown under his name on the Profile page and in Google results."><textarea rows={3} value={s.intro} onChange={(e) => set("intro", e.target.value)} maxLength={300} /></Field>
          <Field label="Focus areas" wide hint="One per line."><textarea rows={3} value={s.focus.join("\n")} onChange={(e) => set("focus", lines(e.target.value))} /></Field>
          <ImageField label="Portrait" value={s.heroImage} onChange={(v) => set("heroImage", v)} maxSide={1000} />
          <ImageField label="Wide photo behind the quote" value={s.wideImage} onChange={(v) => set("wideImage", v)} maxSide={1500} />
          <Field label="Quote on the wide photo" wide><textarea rows={2} value={s.wideQuote} onChange={(e) => set("wideQuote", e.target.value)} maxLength={200} /></Field>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Headline numbers</h2>
        <div className="admin-grid">
          {s.stats.map((st, i) => (
            <div className="admin-pair" key={i}>
              <Field label={`Number ${i + 1}`}><input value={st.value} onChange={(e) => setItem("stats", i, "value", e.target.value)} maxLength={20} /></Field>
              <Field label="Label"><input value={st.label} onChange={(e) => setItem("stats", i, "label", e.target.value)} maxLength={60} /></Field>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-panel">
        <h2>Career</h2>
        <div className="admin-grid">
          <Field label="Line under the Career heading" wide><input value={s.careerIntro} onChange={(e) => set("careerIntro", e.target.value)} maxLength={160} /></Field>
        </div>
        {s.career.map((c, i) => (
          <fieldset className="admin-fieldset" key={i}>
            <legend>Role {i + 1}</legend>
            <div className="admin-grid">
              <Field label="Years"><input value={c.years} onChange={(e) => setItem("career", i, "years", e.target.value)} maxLength={30} placeholder="2022 – Present" /></Field>
              <Field label="Position"><input value={c.role} onChange={(e) => setItem("career", i, "role", e.target.value)} maxLength={80} /></Field>
              <Field label="Organisation" wide><input value={c.org} onChange={(e) => setItem("career", i, "org", e.target.value)} maxLength={120} /></Field>
              <Field label="One line on the role (optional)" wide><input value={c.note} onChange={(e) => setItem("career", i, "note", e.target.value)} maxLength={240} /></Field>
            </div>
            <ItemTools group="career" i={i} />
          </fieldset>
        ))}
        <button type="button" className="admin-btn" onClick={() => addItem("career", { years: "", role: "", org: "", note: "" })}>+ Add a role</button>
        <p className="admin-small">Newest first. The top four show on the Profile page.</p>

        <h3 className="admin-sub">Education</h3>
        {s.education.map((e, i) => (
          <fieldset className="admin-fieldset" key={i}>
            <div className="admin-grid">
              <Field label="Years"><input value={e.years} onChange={(ev) => setItem("education", i, "years", ev.target.value)} maxLength={30} /></Field>
              <Field label="Qualification"><input value={e.what} onChange={(ev) => setItem("education", i, "what", ev.target.value)} maxLength={80} /></Field>
              <Field label="Institution" wide><input value={e.where} onChange={(ev) => setItem("education", i, "where", ev.target.value)} maxLength={120} /></Field>
            </div>
            <ItemTools group="education" i={i} />
          </fieldset>
        ))}
        <button type="button" className="admin-btn" onClick={() => addItem("education", { years: "", what: "", where: "" })}>+ Add education</button>

        <div className="admin-grid">
          <Field label="Committees" wide hint="One per line."><textarea rows={5} value={s.committees.join("\n")} onChange={(e) => set("committees", lines(e.target.value))} /></Field>
          <Field label="Professional bodies" wide hint="One per line."><textarea rows={3} value={s.affiliations.join("\n")} onChange={(e) => set("affiliations", lines(e.target.value))} /></Field>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Vision</h2>
        <div className="admin-grid">
          <Field label="Opening lines" wide><textarea rows={2} value={s.visionIntro} onChange={(e) => set("visionIntro", e.target.value)} maxLength={300} /></Field>
        </div>
        {s.pillars.map((p, i) => (
          <fieldset className="admin-fieldset" key={i}>
            <legend>Priority {i + 1}</legend>
            <div className="admin-grid">
              <Field label="Title" wide><input value={p.title} onChange={(e) => setItem("pillars", i, "title", e.target.value)} maxLength={80} /></Field>
              <Field label="Description" wide><textarea rows={3} value={p.text} onChange={(e) => setItem("pillars", i, "text", e.target.value)} maxLength={600} /></Field>
              <Field label="Commitments" wide hint="One per line."><textarea rows={4} value={(p.commitments || []).join("\n")} onChange={(e) => setItem("pillars", i, "commitments", lines(e.target.value))} /></Field>
            </div>
            <ItemTools group="pillars" i={i} />
          </fieldset>
        ))}
        {s.pillars.length < 6 && <button type="button" className="admin-btn" onClick={() => addItem("pillars", { title: "", text: "", commitments: [] })}>+ Add priority</button>}
        <div className="admin-grid">
          <Field label="Closing pledge" wide><input value={s.pledge} onChange={(e) => set("pledge", e.target.value)} maxLength={200} /></Field>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Contact and social links</h2>
        <div className="admin-grid">
          <Field label="Office address" wide><input value={s.contact.address} onChange={(e) => setIn("contact", "address", e.target.value)} maxLength={160} /></Field>
          <Field label="Phone"><input value={s.contact.phone} onChange={(e) => setIn("contact", "phone", e.target.value)} maxLength={40} /></Field>
          <Field label="Email"><input type="email" value={s.contact.email} onChange={(e) => setIn("contact", "email", e.target.value)} maxLength={120} /></Field>
          <Field label="Opening hours" wide><input value={s.contact.hours} onChange={(e) => setIn("contact", "hours", e.target.value)} maxLength={120} /></Field>
          {["facebook", "x", "instagram", "youtube"].map((k) => (
            <Field key={k} label={`${k === "x" ? "X" : k[0].toUpperCase() + k.slice(1)} link`} hint="Leave empty to hide the icon.">
              <input type="url" value={s.socials[k]} onChange={(e) => setIn("socials", k, e.target.value)} />
            </Field>
          ))}
        </div>
      </div>

      <div className="admin-panel">
        <h2>Look</h2>
        <p className="admin-small">Main colour should be dark so white text stays readable.</p>
        <div className="admin-grid">
          <Field label="Main colour"><input type="color" value={s.theme.primary} onChange={(e) => setIn("theme", "primary", e.target.value)} className="color-input" /></Field>
          <Field label="Accent colour (lines and buttons)"><input type="color" value={s.theme.accent} onChange={(e) => setIn("theme", "accent", e.target.value)} className="color-input" /></Field>
        </div>
      </div>
    </form>
  );
}

function SiteEditor() {
  const { settings, ready } = useContent();
  if (!ready) return <p className="admin-small">Loading...</p>;
  return <Editor initial={settings} />;
}

export default SiteEditor;
