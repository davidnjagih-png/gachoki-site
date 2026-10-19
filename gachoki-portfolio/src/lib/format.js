export function formatDate(iso) {
  const d = iso ? new Date(`${iso}T00:00:00`) : null;
  if (!d || Number.isNaN(d.getTime())) return "[Date]";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
