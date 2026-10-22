/*
  Reads a .json or .csv file and turns it into clean records for one
  dashboard list (projects or press).

  JSON: either a list of records, or one object holding several lists,
        e.g. { "projects": [...], "press": [...] }. Each screen takes its own list.
  CSV:  first row holds the field names (title, category, year, ...),
        one record per row. Excel's "CSV UTF-8" export works.
*/

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"' && cell === "") quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  const filled = rows.filter((r) => r.some((c) => c.trim() !== ""));
  if (filled.length < 2) return [];
  const head = filled[0].map((h) => h.trim());
  return filled.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}

// Accepts 2025-09-15, 15/09/2025 or 15-09-2025. Anything else is left blank.
export function normalizeDate(value) {
  const v = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const m = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  return "";
}

export async function readImportFile(file, name) {
  const text = await file.text();
  let records;
  if (/\.csv$/i.test(file.name)) {
    records = parseCsv(text);
  } else {
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("That file is not valid JSON.");
    }
    records = Array.isArray(data) ? data : data[name];
  }
  if (!Array.isArray(records)) throw new Error(`No "${name}" list found in that file.`);
  return records;
}

// Keep only the fields this screen knows, trimmed to their maximum length.
export function cleanRecords(records, fields) {
  const keys = fields.filter((f) => f.type !== "image");
  return records
    .filter((r) => r && typeof r === "object")
    .map((r) => {
      const out = {};
      keys.forEach((f) => {
        let v = r[f.key] == null ? "" : String(r[f.key]).trim();
        if (f.type === "date") v = normalizeDate(v);
        if (f.max) v = v.slice(0, f.max);
        out[f.key] = v || (f.default ?? "");
      });
      return out;
    })
    .filter((r) => fields.every((f) => !f.required || r[f.key]));
}

export function csvTemplate(fields) {
  const keys = fields.filter((f) => f.type !== "image").map((f) => f.key);
  return `${keys.join(",")}\n`;
}
