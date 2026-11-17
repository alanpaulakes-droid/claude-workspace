/* ============ FASE 5: IMPRESIÓN Y EXPORTACIÓN DE FICHAS, FORMULARIO Y GLOSARIO ============ */
const prnBtn = '<button class="btn small ghost" type="button" data-act="print">Imprimir</button>';
const expBar = (kind, id) => '<div class="actions no-print t8-exp">' + expBtns(kind, id ? ' data-c="' + id + '"' : "") + prnBtn + "</div>";

/* Ficha completa del tema: los 8 bloques en el orden de la plantilla, con fórmulas, diagramas y ejercicios */
async function exportPage(fmt, id){
  const app = document.getElementById("app"), src = app.querySelector(".t8"); if (!src) return;
  const cl = s => { const x = app.querySelector(s); if (!x) return ""; const c = x.cloneNode(true); c.querySelectorAll("button,.no-print,.favb,a").forEach(z => z.remove()); return c.textContent.replace(/\s+/g, " ").trim(); };
  const h1 = cl("h1"), ey = cl(".eyebrow"), ld = cl(".lead");
  const el = tmpEl(""); el.appendChild(src.cloneNode(true));
  el.querySelectorAll(".t8-nav,.t8-refs,.t8-pend,.actions,.no-print").forEach(x => x.remove());
  el.querySelectorAll(".t8-b").forEach(s => { if (!s.querySelector("details,div,p,figure,table,ul,ol")) s.remove(); });
  try { await exportDoc(fmt, { kind:"Ficha de estudio" + (ey ? " · " + ey : ""), title:h1 || pageOf(id).t || "Ficha", subtitle:ld, lines:[["Fuente", "Biblia del Ingeniero Industrial"]], toc:true }, el); }
  finally { el.remove(); }
}

/* Fórmulas de las lecciones (registro T2), agrupadas por grupo de navegación y tema */
function t2Formulas(){
  const out = {};
  Object.keys(typeof T2 !== "undefined" ? T2 : {}).forEach(id => { const fx = T2[id].fx || []; if (!fx.length) return; const p = PAGES.find(x => x.id === id); if (!p) return;
    const g = GROUPS[p.g] || "Otros"; (out[g] = out[g] || []).push({ id, t:p.t, fx }); });
  return out;
}
const fxCard = f => UI.formula(f[0], f[1], f[2], f[3], f[4]);
function formularioT2HTML(){
  const G = t2Formulas(), ks = Object.keys(G);
  if (!ks.length) return "";
  return '<h2 class="sh">Fórmulas de las lecciones por tema</h2><p class="hint">Las mismas fórmulas del bloque 3 de cada tema, reunidas aquí con sus variables. Abre un grupo para verlas; el botón lleva al tema completo.</p>' +
    acc(ks.map(g => { const n = G[g].reduce((a, x) => a + x.fx.length, 0);
      return [g + " (" + n + ")", G[g].map(x => '<h3>' + esc(x.t) + ' <button class="chip no-print" type="button" data-go="' + x.id + '">Ir al tema</button></h3><div class="fgrid">' + x.fx.map(fxCard).join("") + "</div>").join("")]; }));
}

async function exportRef(kind, fmt){
  ensureContent();
  let html = "", meta;
  if (kind === "formulario") {
    const ar = [...new Set(FORM.map(f => f[0]))];
    html = "<h2>Formulario general</h2>" + ar.map(a => "<h3>" + esc(a) + "</h3>" + FORM.filter(f => f[0] === a).map(f => { const e = (typeof FEXP !== "undefined" && FEXP[f[1]]) || null;
      return "<p><b>" + f[1] + "</b>" + (e ? ": " + e[0] : "") + "</p>" + M(f[2].replace(/(\S)·(\S)/g, "$1 × $2").replace(/\s*\/\s*/g, " ÷ ")) + (e ? "<p>" + e[1] + "</p>" : ""); }).join("")).join("");
    const G = t2Formulas();
    Object.keys(G).forEach(g => { html += "<h2>" + esc(g) + "</h2>" + G[g].map(x => "<h3>" + esc(x.t) + "</h3>" + x.fx.map(f => "<p><b>" + f[0] + "</b></p>" + TX(f[1], f[2], true) +
      (f[3] && f[3].length ? "<dl>" + f[3].map(v => "<dt>" + v[0] + "</dt><dd>" + v[1] + "</dd>").join("") + "</dl>" : "") + (f[4] ? "<p><i>Por qué funciona:</i> " + f[4] + "</p>" : "")).join("")).join(""); });
    meta = { kind:"Formulario consolidado", title:"Formulario del Ingeniero Industrial", subtitle:"Fórmulas generales y fórmulas de cada tema, con el significado de sus variables", lines:[["Fuente", "Biblia del Ingeniero Industrial"]], toc:true };
  } else {
    const ks = Object.keys(GLOS).sort((a, b) => a.localeCompare(b, "es")), L = {};
    ks.forEach(k => { const l = /\d/.test(k[0]) ? "0–9" : k.normalize("NFD")[0].toUpperCase(); (L[l] = L[l] || []).push(k); });
    html = Object.keys(L).sort((a, b) => a.localeCompare(b, "es")).map(l => "<h2>" + esc(l) + "</h2><dl>" + L[l].map(k => "<dt>" + esc(k) + "</dt><dd>" + esc(GLOS[k]) + "</dd>").join("") + "</dl>").join("");
    meta = { kind:"Glosario", title:"Glosario del Ingeniero Industrial", subtitle:ks.length + " términos y siglas", lines:[["Fuente", "Biblia del Ingeniero Industrial"]], toc:false };
  }
  const el = tmpEl(mFill(html)); try { await exportDoc(fmt, meta, el); } finally { el.remove(); }
}

/* Impresión: abre todas las secciones antes de imprimir y las restaura después */
let PRN = null;
function prnOpen(){ const app = document.getElementById("app"); if (!app || PRN) return; const ds = [...app.querySelectorAll("details")]; PRN = ds.map(d => [d, d.open]); ds.forEach(d => d.open = true); try { katexRender(app); } catch (e) {} }
function prnClose(){ if (!PRN) return; PRN.forEach(([d, o]) => d.open = o); PRN = null; }
function printPage(){ prnOpen(); setTimeout(() => { try { window.print(); } catch (e) { toast("Usa el menú del navegador para imprimir"); } }, 150); }
window.addEventListener("beforeprint", prnOpen);
window.addEventListener("afterprint", prnClose);

/* Accesibilidad: toda zona con desplazamiento propio debe poder enfocarse con el teclado (WCAG 2.1.1) */
function a11yScroll(root){ if (!root || !root.querySelectorAll) return;
  root.querySelectorAll(".tall,.mblk,.sv,.tw,.tblw,.tbl-wrap,pre,.tx-b,.wide").forEach(el => { if (el.hasAttribute("tabindex")) return; const cs = getComputedStyle(el);
    if (!/auto|scroll/.test(cs.overflowX + cs.overflowY)) return; if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) { el.tabIndex = 0; if (!el.getAttribute("role")) el.setAttribute("role", "region"); if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", "Contenido desplazable"); } }); }
document.addEventListener("toggle", e => { if (e.target && e.target.tagName === "DETAILS" && e.target.open) a11yScroll(e.target); }, true);
window.addEventListener("resize", () => { clearTimeout(a11yScroll.t); a11yScroll.t = setTimeout(() => a11yScroll(document.getElementById("app")), 300); });
try { const A = document.getElementById("app"); if (A && window.MutationObserver) new MutationObserver(() => { clearTimeout(a11yScroll.m); a11yScroll.m = setTimeout(() => { a11yScroll(A); try { svgA11y(A); } catch (e) {} }, 250); }).observe(A, { childList:true, subtree:true }); } catch (e) {}
