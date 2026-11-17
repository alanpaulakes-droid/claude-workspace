/* ============ ENTRADA DE DATOS: UNIDADES, VALIDACIÓN EN VIVO Y AYUDAS ============ */
S.unit = S.unit || {};
/* Cada grupo: unidad base (la que usa el cálculo) y factor para pasar de esa unidad a la base */
const UNITS = {
  "cm":[["cm", 1, "centímetros"], ["mm", 0.1, "milímetros"], ["m", 100, "metros"], ["in", 2.54, "pulgadas"], ["ft", 30.48, "pies"]],
  "kg":[["kg", 1, "kilogramos"], ["g", 0.001, "gramos"], ["lb", 0.45359237, "libras"]],
  "min":[["min", 1, "minutos"], ["s", 1 / 60, "segundos"], ["h", 60, "horas"]],
  "s":[["s", 1, "segundos"], ["min", 60, "minutos"], ["cmin", 0.6, "centiminutos"]],
  "min/unidad":[["min/unidad", 1, "minutos por unidad"], ["s/unidad", 1 / 60, "segundos por unidad"]]
};
const uKey = (id, k) => id + "." + k;
const uFactor = (id, f) => { const G = UNITS[f.u]; if (!G) return 1; const s = S.unit[uKey(id, f.k)], m = G.find(x => x[0] === s); return m ? m[1] : 1; };
const uRound = x => fin(x) ? +x.toPrecision(6) : x;
function uConvStr(raw, fac, isList){
  if (fac === 1 || raw == null || raw === "") return raw;
  if (!isList) { const x = num(raw); return fin(x) ? String(uRound(x * fac)) : raw; }
  return String(raw).split(/([\s;]+)/).map(t => { if (!t.trim() || /^[\s;]+$/.test(t)) return t; const x = num(t.replace(/,$/, "")); return fin(x) ? String(uRound(x * fac)) : t; }).join("");
}
/* Pasa los valores escritos en la unidad elegida a la unidad base del cálculo */
function uApply(id, v){ const c = C[id]; if (!c) return v; c.f.forEach(f => { if ((f.t === "num" || f.t === "list") && UNITS[f.u]) { const fac = uFactor(id, f); if (fac !== 1) v[f.k] = uConvStr(v[f.k], fac, f.t === "list"); } }); return v; }
function uSelHTML(id, f){ const G = UNITS[f.u]; if (!G || !(f.t === "num" || f.t === "list")) return ""; const s = S.unit[uKey(id, f.k)] || G[0][0];
  return '<select class="usel" data-u="' + id + '" data-uk="' + f.k + '" aria-label="Unidad de ' + esc(f.l) + '" title="Cambia la unidad: el valor se convierte solo">' + G.map(x => '<option value="' + x[0] + '"' + (x[0] === s ? " selected" : "") + ">" + x[0] + "</option>").join("") + "</select>"; }
const uLabel = (id, f) => { const G = UNITS[f.u]; if (!G) return f.u; const s = S.unit[uKey(id, f.k)]; return s || f.u; };

/* Micro-copy por defecto según la unidad, para los campos que no traen ayuda propia */
function autoHelp(f){
  if (f.h) return f.h;
  const u = f.u || "";
  if (f.t === "list") return "Escribe un valor por dato, separados por espacio, punto y coma o salto de línea. Decimales con coma o punto.";
  if (f.t === "mat") return "Una fila por línea. Separa las columnas con punto y coma (;) o tabulación. Puedes pegar directo desde Excel.";
  if (f.t !== "num") return "";
  if (u === "MM$") return "En millones de pesos: 250 equivale a $250.000.000.";
  if (/^\$/.test(u)) return "Monto en pesos, sin signo: 1500000 o 1.500.000 (con puntos de miles).";
  if (/^%|^puntos %/.test(u)) return "Escribe solo el número: 12 significa 12 % (no 0,12).";
  if (/unid|clientes|levant/.test(u)) return "Cantidad en " + u + ". Solo números, sin texto.";
  if (/años|meses|días|períodos/.test(u)) return "Número de " + u + ". Debe ser positivo.";
  return "";
}

/* Reglas de validación inferidas del tipo y la unidad */
const NONNEG = /^(cm|kg|min|s|h|unidades|días|años|meses|períodos|unid\/día|unid\/turno|clientes\/hora|min\/unidad|s\/día|levantamientos\/min|\$\/hora|\$\/h)$/;
function vCheck(f, raw){
  const s = String(raw == null ? "" : raw).trim();
  if (f.t === "num") {
    if (!s) return { c:"warn", m:"Falta este dato." };
    if (/\d\s*[.,]\s*$/.test(s)) return { c:"warn", m:"Terminaste en separador decimal: completa el número." };
    const x = num(s);
    if (!fin(x)) return { c:"bad", m:"«" + esc(s.slice(0, 20)) + "» no es un número. Usa solo dígitos, coma o punto decimal." };
    if (f.u && NONNEG.test(f.u) && x < 0) return { c:"bad", m:"Este valor no puede ser negativo." };
    if (f.u && /^%/.test(f.u) && (x > 100 || x < -100)) return { c:"warn", m:"Más de 100 %: revisa si corresponde." };
    if (f.u && /^%/.test(f.u) && x > 0 && x < 1 && !/tasa|inter|crec|infl/i.test(f.l)) return { c:"warn", m:"¿Quisiste decir " + uRound(x * 100) + " %? Aquí se escribe el porcentaje, no la fracción." };
    return { c:"ok", m:"" };
  }
  if (f.t === "list") {
    const t = s.split(/[\s;]+/).filter(Boolean); if (!t.length) return { c:"warn", m:"Falta ingresar los valores." };
    const bad = t.filter(x => !fin(num(x.replace(/,$/, ""))));
    if (bad.length) return { c:"bad", m:bad.length + (bad.length === 1 ? " valor no es número: «" : " valores no son números, p. ej. «") + esc(bad[0].slice(0, 15)) + "»." };
    if (f.u && NONNEG.test(f.u) && t.some(x => num(x) < 0)) return { c:"bad", m:"Hay valores negativos y esta medición no puede serlo." };
    return { c:"ok", m:t.length + " valor" + (t.length === 1 ? "" : "es") + " leído" + (t.length === 1 ? "" : "s") + "." };
  }
  if (f.t === "mat") {
    const r = rows(s); if (!r.length) return { c:"warn", m:"Falta ingresar la tabla." };
    const nc = r.map(x => x.length), mx = Math.max.apply(null, nc), mn = Math.min.apply(null, nc);
    return mx !== mn ? { c:"warn", m:r.length + " filas leídas; no todas tienen " + mx + " columnas. Revisa los separadores." } : { c:"ok", m:r.length + " fila" + (r.length === 1 ? "" : "s") + " × " + mx + " columna" + (mx === 1 ? "" : "s") + "." };
  }
  return { c:"ok", m:"" };
}
function vPaint(el){
  const id = el.dataset.c, k = el.dataset.k; if (!C[id]) return null; const f = C[id].f.find(x => x.k === k); if (!f || !/^(num|list|mat)$/.test(f.t)) return null;
  const box = el.closest(".field"); if (!box) return null;
  let r = vCheck(f, el.value); if (r.c !== "bad" && f.t === "num" && typeof RULES !== "undefined" && RULES[id] && RULES[id][f.k]) { const x = num(el.value); if (fin(x)) { const mm = ruleMsg(f, x, RULES[id][f.k]); if (mm) r = { c:"bad", m:mm }; } } let m = box.querySelector(".vmsg");
  if (!m) { m = document.createElement("span"); m.className = "vmsg"; m.setAttribute("aria-live", "polite"); m.id = el.id + "-v"; const sm = box.querySelector(":scope > small"); box.insertBefore(m, sm || null); el.setAttribute("aria-describedby", m.id); }
  box.classList.toggle("v-bad", r.c === "bad"); box.classList.toggle("v-warn", r.c === "warn" && box.dataset.touched === "1"); box.classList.toggle("v-ok", r.c === "ok" && !!r.m);
  el.setAttribute("aria-invalid", r.c === "bad" ? "true" : "false");
  m.innerHTML = r.m && (r.c !== "warn" || box.dataset.touched === "1") ? r.m : ""; return r;
}
document.addEventListener("input", e => { const el = e.target; if (el.dataset && el.dataset.c && el.dataset.k) { const b = el.closest(".field"); if (b) b.dataset.touched = "1"; vPaint(el); } }, true);
document.addEventListener("focusout", e => { const el = e.target; if (el.dataset && el.dataset.c && el.dataset.k) { const b = el.closest(".field"); if (b) b.dataset.touched = "1"; vPaint(el); } });

/* Antes de calcular: si hay errores, se marca el primero y no se calcula */
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest('[data-act="calc"],[data-act="ex"],[data-act="clr"]'); if (!b) return; const id = b.dataset.c;
  if (b.dataset.act !== "calc") { Object.keys(S.unit).forEach(k => { if (k.startsWith(id + ".")) delete S.unit[k]; }); return; }
  const els = [...document.querySelectorAll('[data-c="' + id + '"][data-k]')].filter(x => x.id && x.id.startsWith("f-"));
  let first = null, n = 0; els.forEach(x => { const bx = x.closest(".field"); if (bx) bx.dataset.touched = "1"; const r = vPaint(x); if (r && r.c === "bad") { n++; first = first || x; } });
  if (first) { e.stopPropagation(); e.preventDefault(); const vis = first.closest(".field").querySelector("input,textarea:not([hidden]),select") || first; first.closest(".field").scrollIntoView({ behavior:"smooth", block:"center" }); try { vis.focus({ preventScroll:true }); } catch (er) {} toast(n === 1 ? "Corrige el dato marcado en rojo antes de calcular" : "Hay " + n + " datos marcados en rojo: corrígelos antes de calcular"); }
}, true);

/* Cambio de unidad: convierte el valor escrito para que la magnitud no cambie */
document.addEventListener("change", e => { const s = e.target; if (!s.classList || !s.classList.contains("usel")) return; const id = s.dataset.u, k = s.dataset.uk, f = C[id].f.find(x => x.k === k), G = UNITS[f.u];
  const old = uFactor(id, f), nw = (G.find(x => x[0] === s.value) || G[0])[1]; S.unit[uKey(id, k)] = s.value;
  const el = document.getElementById("f-" + id + "-" + k);
  if (el) { el.value = uConvStr(uConvStr(el.value, old, f.t === "list"), 1 / nw, f.t === "list"); el.dispatchEvent(new Event("input", { bubbles:true })); }
  const g = el && el.closest(".field").querySelector(".gd"); if (g && f.t === "list") { render(true); return; }
  save(); toast("Unidad: " + (G.find(x => x[0] === s.value) || [, , s.value])[2]); });

/* ============ ÍNDICE Y RESUMEN EJECUTIVO EN PÁGINAS LARGAS ============ */
function pageIndex(root){
  const host = root.querySelector("#sabdoc") || root, ds = [...host.querySelectorAll(":scope > details.item, :scope > section > details.item")].filter(d => !d.closest(".form,.result"));
  if (ds.length < 5 || root.querySelector(".pidx") || root.querySelector(".t8")) return;
  const words = (host.textContent || "").split(/\s+/).length, min = Math.max(1, Math.round(words / 200));
  ds.forEach((d, i) => { d.id = d.id || "sec-" + (i + 1); });
  const nav = document.createElement("nav"); nav.className = "pidx no-print"; nav.setAttribute("aria-label", "Contenido de esta página");
  nav.innerHTML = '<div class="pidx-h"><span class="tag">Resumen</span><span>' + ds.length + " secciones · lectura aprox. " + min + " min</span>" +
    '<span class="pidx-a"><button class="linkb" type="button" data-pidx="open">Abrir todo</button> · <button class="linkb" type="button" data-pidx="close">Cerrar todo</button></span></div><ol>' +
    ds.map(d => '<li><button type="button" data-pidx="' + d.id + '">' + esc(d.querySelector(":scope > summary").textContent.replace(/^\d+\.\s*/, "")) + "</button></li>").join("") + "</ol>";
  const lead = host.querySelector(":scope > .lead"); const anchor = lead || host.querySelector(":scope > h1");
  if (anchor) anchor.after(nav); else host.prepend(nav);
}
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-pidx]"); if (!b) return; const v = b.dataset.pidx, ds = document.querySelectorAll("#app details.item");
  if (v === "open") ds.forEach(d => d.open = true); else if (v === "close") ds.forEach(d => d.open = false);
  else { const d = document.getElementById(v); if (d) { d.open = true; d.scrollIntoView({ behavior:"smooth", block:"start" }); } } });

function w6Init(root){
  root.querySelectorAll("[data-c][data-k]").forEach(el => { if (el.id && el.id.startsWith("f-") && String(el.value).trim()) vPaint(el); });
  try { pageIndex(root); } catch (e) { console.error(e); }
}
