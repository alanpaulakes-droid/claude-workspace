/** Convierte texto con formato chileno ("1.234,5", "2,5", "1234.5") a número. Vacío o inválido → 0. */
export function parseNum(v: unknown): number {
  if (typeof v === "number") return v;
  let s = String(v ?? "")
    .trim()
    .replace(/\s/g, "");
  if (!s) return 0;
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  const x = parseFloat(s);
  return isFinite(x) ? x : 0;
}
