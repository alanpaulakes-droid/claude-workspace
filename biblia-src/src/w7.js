/* ============ FASE 1A: NAVEGACIÓN POR ÁREA Y TRIMESTRE, FAVORITOS, TEMA, KATEX Y COMPONENTES ============ */
S.fav = Array.isArray(S.fav) ? S.fav : []; S.lastSec = S.lastSec || null;

/* ---------- Áreas de la carrera: cada página queda en al menos un área (la primera es su área principal) ---------- */
const CAREAS = [
  ["mat", "Matemáticas y ciencias básicas", "Álgebra, funciones, matrices, cálculo, física, mecánica y química: la base de todos los modelos de la carrera.",
    ["ramo-nivelacion-matematica", "ramo-fundamentos-matematicas", "ramo-calculo", "ramo-fisica-medicion", "ramo-mecanica", "ramo-quimica-ambiente", "conversor"]],
  ["est", "Probabilidad y estadística", "Describir datos, estimar con muestras, relacionar variables y extraer conocimiento de los datos.",
    ["fund-estadistica", "descriptiva", "muestra", "regresion", "ramo-metodos-cuantitativos", "ramo-mineria-datos", "sim-estadistica", "simulacion-mc"]],
  ["io", "Investigación de operaciones", "Modelos para decidir lo mejor: programación lineal, transporte, asignación, redes, proyectos, colas, simulación e inventarios.",
    ["fund-io", "programacion-lineal", "transporte", "asignacion", "ruta-corta", "cpm", "decisiones", "colas", "simulacion-mc", "eoq", "stock-seguridad", "ramo-intro-optimizacion", "ramo-investigacion-operativa", "sim-optimizacion"]],
  ["prod", "Producción y procesos", "Cómo se diseña, mide y mejora un proceso: métodos y tiempos, balance de líneas, capacidad, MRP, Lean y mantenimiento.",
    ["fund-operaciones", "fund-trabajo", "ramo-analisis-procesos", "ramo-procesos-industriales", "ramo-sistemas-productivos", "ramo-modelamiento-procesos", "ramo-planificacion-mejora", "sipoc", "vsm", "tiempo-estandar", "muestreo", "aprendizaje", "productividad", "balanceo", "oee", "smed", "mrp", "secuenciacion", "johnson", "lean", "mejora-continua", "sim-procesos", "sim-layout", "mantenimiento", "mecatronica", "mecanica", "electricidad", "hidraulica"]],
  ["cal", "Calidad", "Herramientas básicas, control estadístico de procesos, capacidad, Six Sigma, AMEF y sistemas de gestión de la calidad.",
    ["fund-calidad", "calidad-7", "pareto", "ishikawa", "porques", "control-xr", "control-p", "capacidad", "sigma", "amef", "mejora-continua"]],
  ["log", "Logística y cadena de suministro", "Pronósticos, clasificación ABC, inventarios, localización, distribución y comercio exterior.",
    ["fund-logistica", "ramo-logistica", "pronosticos", "abc", "eoq", "stock-seguridad", "localizacion", "factores", "ruta-corta", "transporte", "comercio-exterior", "agro", "sim-erp"]],
  ["eco", "Economía y finanzas", "Valor del dinero en el tiempo, costos, presupuestos y evaluación de proyectos.",
    ["fund-economia", "fund-costos", "ramo-costos-presupuestos", "ramo-ingenieria-economica", "ramo-evaluacion-proyectos", "van-tir", "flujo-caja", "equivalencias", "tasas", "amortizacion", "depreciacion", "equilibrio", "costeo", "caue", "vida-economica", "wacc", "ratios", "finanzas-personales", "cultura"]],
  ["ges", "Gestión, estrategia e innovación", "Estrategia, modelos de negocio, proyectos, indicadores, innovación, personas y transformación digital.",
    ["fund-estrategia", "fund-proyectos", "foda", "canvas", "raci", "gestion-proyectos", "kpis", "ramo-innovacion-1", "ramo-innovacion-2", "ramo-portafolio-proyectos", "ramo-transformacion-digital", "ramo-topicos-ingenieria", "ramo-topicos-especialidad", "ramo-integrador-1", "ramo-integrador-2", "sim-proyectos", "sim-bi", "comercial", "negociacion", "mentalidad", "casos-integrados"]],
  ["prog", "Programación, datos y ofimática", "Algoritmos, Python, bases de datos y SQL, análisis de datos, Excel y Word.",
    ["ramo-intro-programacion", "ramo-base-datos", "datos-ia", "sim-sql", "excel-pro", "excel-basico", "excel-avanzado", "excel-profesional", "excel-ejercicios", "excel-lab", "word-basico", "word-avanzado", "word-pro", "word-ejercicios", "software"]],
  ["seg", "Seguridad, ergonomía y sostenibilidad", "Prevención de riesgos, ergonomía, higiene industrial, ambiente y responsabilidad social.",
    ["fund-seguridad", "iper", "accidentabilidad", "niosh", "ruido", "huella", "ramo-quimica-ambiente", "ramo-responsabilidad-social"]],
  ["car", "Carrera y habilidades", "Industrias, práctica y título, empleabilidad, informes, inglés técnico y desarrollo personal y profesional.",
    ["areas", "competencias", "practica-titulo", "empleabilidad", "ruta-pro", "ramo-ingles", "generador-informe", "citas-apa", "estructura-informe", "redaccion", "plantillas", "reportes", "industrias", "vida-cotidiana", "bienestar", "relaciones", "aprender-a-aprender", "habilidades-blandas", "psicologia", "influencia", "oratoria", "libros", "experiencias", "marca-personal"]],
  ["ref", "Referencia y consulta", "Para empezar y para consultar rápido: formulario, glosario, siglas, tablas, normativa, bibliografía, historia y autoevaluación.",
    ["empieza-aqui", "fundamentos", "formulario", "glosario", "siglas", "tablas", "normativa", "bibliografia", "historia", "pensadores", "quiz", "componentes", "pruebas-calculadoras"]]
];
const AREA_ID = a => "area-" + a[0];
/* Agrega las industrias al área de carrera y crea las páginas de área, trimestre y componentes */
function areaPages(P){
  const car = CAREAS.find(a => a[0] === "car"); P.filter(p => p.g === "ind" && p.id !== "industrias").forEach(p => { if (!car[3].includes(p.id)) car[3].push(p.id); });
  P.push({ id:"por-area", g:"hub", t:"Estudiar por área", r:pgPorArea });
  P.push({ id:"por-trimestre", g:"hub", t:"Estudiar por trimestre", r:pgPorTrimestre });
  P.push({ id:"favoritos", g:"hub", t:"Mis favoritos", r:pgFavoritos });
  CAREAS.forEach(a => P.push({ id:AREA_ID(a), g:"area", t:a[1], d:a[2], r:() => pgArea(a[0]) }));
  P.push({ id:"pruebas-calculadoras", g:"learn", t:"Pruebas de las calculadoras", d:"Verificación automática contra resultados conocidos", ico:"✓", r:() => pgPruebas() });
  P.push({ id:"componentes", g:"learn", t:"Guía de componentes", d:"Cómo se ven fórmulas, ejemplos, errores comunes y pistas", ico:"UI", r:pgComponentes });
}
const areaOf = id => CAREAS.find(a => a[3].includes(id)) || null;
const areasOf = id => CAREAS.filter(a => a[3].includes(id));
function kindOf(p){ if (!p) return "otro"; if (p.g === "malla" && p.id !== "mi-malla") return "ramo"; if (p.calc) return "calc"; if (p.g === "sim") return "sim"; if (p.g === "ind") return "ind"; return "teo"; }
const KINDS = [["ramo", "Ramos de tu malla"], ["teo", "Teoría, lecciones y métodos"], ["calc", "Calculadoras"], ["sim", "Simuladores"], ["ind", "Industrias"]];

function areaTiles(ids){ const ps = ids.map(id => PAGES.find(p => p.id === id)).filter(Boolean);
  return KINDS.map(k => { const g = ps.filter(p => kindOf(p) === k[0]); return g.length ? '<h2 class="sh">' + k[1] + ' <span class="cnt">' + g.length + "</span></h2>" + '<div class="tiles">' + g.map(tile).join("") + "</div>" : ""; }).join(""); }
function pgArea(k){ const a = CAREAS.find(x => x[0] === k), i = CAREAS.indexOf(a), pr = CAREAS[i - 1], nx = CAREAS[i + 1];
  return '<p class="eyebrow">Estudiar por área · ' + (i + 1) + " de " + CAREAS.length + "</p><h1>" + a[1] + '</h1><p class="lead">' + a[2] + "</p>" + areaTiles(a[3]) +
    '<div class="pager">' + (pr ? '<button class="btn ghost" type="button" data-go="' + AREA_ID(pr) + '">← ' + pr[1] + "</button>" : "<span></span>") + (nx ? '<button class="btn ghost" type="button" data-go="' + AREA_ID(nx) + '">' + nx[1] + " →</button>" : "") + "</div>"; }
function pgPorArea(){
  return '<p class="eyebrow">Navegación</p><h1>Estudiar por área</h1><p class="lead">Cada área reúne los ramos de tu malla, la teoría, las calculadoras y los simuladores del mismo tema. Un tema puede aparecer en más de un área cuando se usa en ambas.</p>' +
    '<div class="areas">' + CAREAS.map((a, i) => { const ps = a[3].map(id => PAGES.find(p => p.id === id)).filter(Boolean), c = k => ps.filter(p => kindOf(p) === k).length;
      return '<button class="area-c" type="button" data-go="' + AREA_ID(a) + '"><span class="area-n">' + String.fromCharCode(97 + i) + '</span><span class="area-t">' + a[1] + '</span><span class="area-d">' + a[2] + '</span><span class="area-m">' + [[c("ramo"), "ramos"], [c("teo"), "temas"], [c("calc"), "calculadoras"], [c("sim"), "simuladores"]].filter(x => x[0]).map(x => x[0] + " " + x[1]).join(" · ") + "</span></button>"; }).join("") + "</div>"; }
function pgPorTrimestre(){
  S.malla = S.malla || {}; let t = +(S.triSel || 1); if (!(t >= 1 && t <= 8)) t = 1;
  const cs = COURSES.filter(c => inTri(c, t));
  return '<p class="eyebrow">Navegación</p><h1>Estudiar por trimestre</h1><p class="lead">Elige el trimestre que estás cursando: verás sus ramos y, para cada uno, las calculadoras y las áreas donde se profundiza.</p>' +
    '<div class="quick" role="tablist" aria-label="Trimestre">' + [1, 2, 3, 4, 5, 6, 7, 8].map(n => '<button class="chip" type="button" role="tab" data-tri="' + n + '" aria-selected="' + (n === t) + '">' + n + "° <span>" + COURSES.filter(c => inTri(c, n)).length + "</span></button>").join("") + "</div>" +
    cs.map(c => { const ar = areasOf(c.id); return '<section class="card tri-c"><div class="tri-h"><button class="linkb tri-t" type="button" data-go="' + c.id + '">' + triName(c, t) + "</button>" + (S.malla[c.id] ? '<span class="pill ok">Aprobado</span>' : "") + '</div><p class="hint" style="margin:2px 0 10px">' + c.d + "</p>" +
      ((c.tools || []).length ? '<div class="quick"><span class="qlab">Practica con</span>' + c.tools.filter(x => PAGES.find(p => p.id === x)).map(x => '<button class="chip" type="button" data-go="' + x + '">' + pageOf(x).t + "</button>").join("") + "</div>" : "") +
      (ar.length ? '<div class="quick"><span class="qlab">Área</span>' + ar.map(a => '<button class="chip" type="button" data-go="' + AREA_ID(a) + '">' + a[1] + "</button>").join("") + "</div>" : "") + "</section>"; }).join("") +
    '<p class="hint">Para marcar ramos aprobados usa ' + '<button class="linkb" type="button" data-go="mi-malla">Mi malla</button>.</p>'; }
function pgFavoritos(){
  const ps = S.fav.map(id => PAGES.find(p => p.id === id)).filter(Boolean);
  return '<p class="eyebrow">Mis cosas</p><h1>Mis favoritos</h1><p class="lead">Marca cualquier página con la estrella junto a su título para tenerla aquí y en el menú.</p>' +
    (ps.length ? '<div class="tiles">' + ps.map(tile).join("") + "</div>" : '<div class="empty">Aún no tienes favoritos. Abre una página y toca la estrella junto al título.</div>'); }

/* ---------- Migas de pan ---------- */
function crumbs(id){
  const p = pageOf(id), L = [["inicio", "Inicio"]];
  if (id === "inicio") return L;
  if (p.g === "area") L.push(["por-area", "Por área"]);
  else if (p.g === "malla" && id !== "mi-malla") { L.push(["por-trimestre", "Trimestre " + (p.tri || "")]); }
  else if (p.g !== "hub") { const a = areaOf(id); if (a) { L.push(["por-area", "Por área"]); L.push([AREA_ID(a), a[1]]); } }
  L.push([id, p.t]); return L;
}
const crumbHTML = id => crumbs(id).map((c, i, A) => i === A.length - 1 ? '<span aria-current="page">' + esc(c[1]) + "</span>" : '<button type="button" data-go="' + c[0] + '">' + esc(c[1]) + "</button>").join('<span class="sep" aria-hidden="true">›</span>');

/* ---------- Enlaces cruzados al pie de cada página ---------- */
function crossHTML(id){
  const p = pageOf(id); if (!p || ["hub", "area"].includes(p.g) || id === "inicio") return "";
  const ar = areasOf(id); if (!ar.length) return "";
  const main = ar[0], others = main[3].filter(x => x !== id && PAGES.find(q => q.id === x)), own = kindOf(p);
  const pick = others.filter(x => kindOf(pageOf(x)) !== own).slice(0, 6).concat(others.filter(x => kindOf(pageOf(x)) === own).slice(0, 4));
  return '<section class="xlinks no-print" aria-label="Enlaces relacionados"><h3>Más sobre ' + esc(main[1]) + '</h3><div class="quick">' + pick.map(x => '<button class="chip" type="button" data-go="' + x + '"><span class="kd">' + { ramo:"Ramo", teo:"Tema", calc:"Calculadora", sim:"Simulador", ind:"Industria" }[kindOf(pageOf(x))] + "</span> " + pageOf(x).t + "</button>").join("") + "</div>" +
    '<p class="hint" style="margin:6px 0 0">' + ar.map((a, i) => (i ? " · " : "Áreas: ") + '<button class="linkb" type="button" data-go="' + AREA_ID(a) + '">' + a[1] + "</button>").join("") + "</p></section>"; }

/* ---------- Favoritos y «seguir donde quedé» ---------- */
function favBtn(id){ const on = S.fav.includes(id); return '<button class="favb no-print" type="button" data-fav="' + id + '" aria-pressed="' + on + '" title="' + (on ? "Quitar de favoritos" : "Agregar a favoritos") + '" aria-label="' + (on ? "Quitar de favoritos" : "Agregar a favoritos") + '">' + svgIco(on ? "estrella-on" : "estrella") + "</button>"; }
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-fav]"); if (!b) return; const id = b.dataset.fav, i = S.fav.indexOf(id);
  if (i >= 0) S.fav.splice(i, 1); else S.fav.unshift(id); save(); const on = i < 0; b.setAttribute("aria-pressed", on); b.innerHTML = svgIco(on ? "estrella-on" : "estrella"); b.title = on ? "Quitar de favoritos" : "Agregar a favoritos"; b.setAttribute("aria-label", b.title); toast(on ? "Agregado a favoritos" : "Quitado de favoritos"); try { renderSide(); } catch (er) {} });
document.addEventListener("toggle", e => { const d = e.target; if (!d.matches || !d.matches("#app details.item, #app details.learn") || !d.open) return; const s = d.querySelector(":scope > summary"); if (!s) return;
  S.lastSec = { id:cur, s:s.textContent.trim().slice(0, 160) }; save(); }, true);
function resumeHTML(){
  const ls = S.lastSec && PAGES.find(p => p.id === S.lastSec.id), lp = S.last && PAGES.find(p => p.id === S.last && !["hub", "area"].includes(p.g) && p.id !== "inicio");
  if (ls && (!lp || lp.id === ls.id)) return '<button class="resume" type="button" data-resume="1"><span aria-hidden="true">↻</span> Seguir donde quedé: <b>' + esc(ls.t) + '</b><span class="rs"> › ' + esc(S.lastSec.s.replace(/^\d+\.\s*/, "")) + "</span></button>";
  return lp ? '<button class="resume" type="button" data-go="' + lp.id + '"><span aria-hidden="true">↻</span> Seguir donde quedé: <b>' + esc(lp.t) + "</b></button>" : ""; }
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-resume]"); if (!b || !S.lastSec) return; const sec = S.lastSec.s; go(S.lastSec.id, true);
  setTimeout(() => { const d = [...document.querySelectorAll("#app details")].find(x => { const s = x.querySelector(":scope > summary"); return s && s.textContent.trim().slice(0, 160) === sec; }); if (d) { let p = d; while (p) { if (p.tagName === "DETAILS") p.open = true; p = p.parentElement; } d.scrollIntoView({ block:"start" }); } }, 60); });

/* ---------- Trimestre: selector ---------- */
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-tri]"); if (!b) return; S.triSel = +b.dataset.tri; save(); render(true); });

/* ---------- Tema claro / oscuro / automático ---------- */
const THEMES = [["auto", "Tema automático (según el sistema)", "auto"], ["light", "Tema claro", "sol"], ["dark", "Tema oscuro", "luna"]];
function themeGet(){ try { return localStorage.getItem(KEY + "-theme") || "auto"; } catch (e) { return "auto"; } }
function themeApply(t){ const r = document.documentElement; if (t === "light" || t === "dark") r.setAttribute("data-theme", t); else r.removeAttribute("data-theme");
  const b = document.getElementById("themeBtn"), m = THEMES.find(x => x[0] === t) || THEMES[0]; if (b) { b.innerHTML = svgIco(m[2]); b.title = m[1] + " · tocar para cambiar"; b.setAttribute("aria-label", m[1] + ". Tocar para cambiar"); } }
document.addEventListener("click", e => { if (!e.target.closest || !e.target.closest("#themeBtn")) return; const i = THEMES.findIndex(x => x[0] === themeGet()), n = THEMES[(i + 1) % THEMES.length][0];
  try { localStorage.setItem(KEY + "-theme", n); } catch (er) {} themeApply(n); toast(THEMES.find(x => x[0] === n)[1]); });

/* ---------- Menú lateral colapsable en móvil ---------- */
function navOpen(on){ document.body.classList.toggle("nav-open", on); const b = document.getElementById("menuBtn"); if (b) b.setAttribute("aria-expanded", on); if (on) { const s = document.querySelector("#side input, #side button"); if (s) try { s.focus({ preventScroll:true }); } catch (e) {} } }
document.addEventListener("click", e => { if (!e.target.closest) return;
  if (e.target.closest("#menuBtn")) { navOpen(!document.body.classList.contains("nav-open")); return; }
  if (e.target.closest("#navScrim")) { navOpen(false); return; }
  if (document.body.classList.contains("nav-open") && e.target.closest("#side [data-go]")) navOpen(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && document.body.classList.contains("nav-open")) { navOpen(false); const b = document.getElementById("menuBtn"); if (b) b.focus(); } });

/* ---------- Bloque superior del menú lateral: favoritos, áreas y trimestres ---------- */
function sideTopHTML(){
  const fav = S.fav.map(id => PAGES.find(p => p.id === id)).filter(Boolean), ca = areaOf(cur), cp = pageOf(cur);
  let h = "";
  if (fav.length) h += '<details class="sgp" data-sgp="_fav" open><summary>Favoritos</summary>' + fav.map(p => '<button type="button" data-go="' + p.id + '" aria-current="' + (p.id === cur) + '"><span class="k">★</span>' + p.t + "</button>").join("") + "</details>";
  h += '<details class="sgp" data-sgp="_area"' + (sideOpen("_area") ? " open" : "") + '><summary>Por área</summary>' + CAREAS.map((a, i) => '<button type="button" data-go="' + AREA_ID(a) + '" aria-current="' + (cur === AREA_ID(a) || (ca === a && cp.g !== "area")) + '"><span class="k">' + String.fromCharCode(97 + i) + "</span>" + a[1] + "</button>").join("") + "</details>";
  h += '<details class="sgp" data-sgp="_tri"' + (sideOpen("_tri") ? " open" : "") + '><summary>Por trimestre</summary><div class="tri-row">' + [1, 2, 3, 4, 5, 6, 7, 8].map(n => '<button type="button" data-go="por-trimestre" data-tri="' + n + '" aria-current="' + (cur === "por-trimestre" && +(S.triSel || 1) === n || (cp.g === "malla" && cp.tri === n)) + '">' + n + "°</button>").join("") + "</div></details>";
  return h; }
function sideOpen(k){ try { const c = JSON.parse(localStorage.getItem(KEY + "-side2") || "null"); return !c || !c.includes(k); } catch (e) { return true; } }

/* ---------- Fórmulas: motor propio M() (sin descargas, funciona sin conexión) ----------
   KaTeX ya no se carga desde internet. Si la página tuviera window.katex (por ejemplo, en pruebas),
   se usa; si no, cada fórmula muestra su versión del motor propio, que ya viene en el HTML. */
let KX = null;
function katexLoad(){ if (window.katex) return Promise.resolve(window.katex); return KX || (KX = Promise.resolve(null)); }
/* TX(tex, alt, bloque): tex en LaTeX; alt en la notación del motor propio (M) para el respaldo */
function TX(tex, alt, blk){ if (blk && /\\qquad/.test(tex)) { const parts = tex.split(/,?\s*\\qquad\s*/).filter(x => x.trim()); if (parts.length > 1) return '<div class="tx tx-b tx-multi" data-tex="' + esc(tex) + '"' + (alt ? ' data-alt="' + esc(alt) + '"' : "") + ' data-parts="' + esc(JSON.stringify(parts)) + '">' + (alt ? M(alt) : "<code>" + esc(tex) + "</code>") + "</div>"; } return (blk ? '<div class="tx tx-b"' : '<span class="tx"') + ' data-tex="' + esc(tex) + '"' + (alt ? ' data-alt="' + esc(alt) + '"' : "") + '>' + (alt ? (blk ? M(alt) : '<span class="mx">' + esc(alt) + "</span>") : '<code>' + esc(tex) + "</code>") + (blk ? "</div>" : "</span>"); }
function katexRender(root){ const els = root.querySelectorAll(".tx[data-tex]:not([data-ok])"); if (!els.length) return;
  katexLoad().then(k => { if (!k) { els.forEach(e => e.classList.add("tx-fb")); return; }
    els.forEach(e => { try { const o = { displayMode:e.classList.contains("tx-b"), output:"mathml", throwOnError:true, strict:false }; e.innerHTML = e.dataset.parts ? JSON.parse(e.dataset.parts).map(p => '<div class="tx-part">' + k.renderToString(p, o) + "</div>").join("") : k.renderToString(e.dataset.tex, o); e.dataset.ok = "1"; } catch (er) { e.classList.add("tx-fb"); } }); }); }

/* ---------- Componentes reutilizables (los usa la plantilla de 8 bloques en la F1b) ---------- */
const UI = {
  formula:(t, tex, alt, vars, why) => '<div class="c-fx"><div class="c-h">' + t + "</div>" + TX(tex, alt, true) + (vars && vars.length ? '<dl class="c-vars">' + vars.map(v => "<dt>" + v[0] + "</dt><dd>" + v[1] + "</dd>").join("") + "</dl>" : "") + (why ? '<details class="c-why"><summary>¿Por qué funciona?</summary><div>' + why + "</div></details>" : "") + "</div>",
  ejemplo:(t, html) => '<div class="c-ex"><div class="c-h">Ejemplo resuelto' + (t ? " · " + t : "") + "</div>" + html + "</div>",
  error:(t, html) => '<div class="c-err" role="note"><div class="c-h">Error común' + (t ? ": " + t : "") + "</div>" + html + "</div>",
  ejercicio:(enun, pistas, sol) => '<div class="c-ej"><div class="c-h">Ejercicio</div>' + enun + pistas.map((p, i) => '<details class="c-hint"><summary>Pista ' + (i + 1) + "</summary><div>" + p + "</div></details>").join("") + '<details class="c-hint c-sol"><summary>Ver solución</summary><div>' + sol + "</div></details></div>",
  ficha:items => '<div class="c-card"><div class="c-h">Ficha resumen</div><ul>' + items.map(x => "<li>" + x + "</li>").join("") + "</ul></div>"
};
const TPL8 = ["Definición", "Conceptos clave", "Fórmulas", "Método paso a paso", "Ejemplo resuelto", "Errores comunes", "Ejercicio con pistas", "Ficha resumen"];
function pgComponentes(){
  return '<p class="eyebrow">Referencia · Sistema de diseño</p><h1>Guía de componentes</h1><p class="lead">Así se presentará cada tema con la plantilla fija. Esta página muestra los componentes con un ejemplo real (lote económico de pedido) para que revises cómo se ven en tu equipo.</p>' +
    '<h2 class="sh">Orden de la plantilla</h2><ol class="tpl8">' + TPL8.map(x => "<li>" + x + "</li>").join("") + "</ol>" +
    '<h2 class="sh">Tarjeta de fórmula</h2>' + UI.formula("Lote económico de pedido (EOQ)", "Q^{*}=\\sqrt{\\dfrac{2\\,D\\,S}{H}}", "Q* = √(2·D·S ÷ H)", [["Q*", "cantidad óptima por pedido (unidades)"], ["D", "demanda anual (unidades/año)"], ["S", "costo de emitir un pedido ($/pedido)"], ["H", "costo de mantener una unidad un año ($/unidad·año)"]],
      "<p>El costo anual de pedir, D·S/Q, baja cuando Q sube; el de mantener, H·Q/2, sube con Q. El total es mínimo donde ambos son iguales: D·S/Q = H·Q/2. Despejando Q se obtiene la fórmula.</p>") +
    '<h2 class="sh">Caja de ejemplo</h2>' + UI.ejemplo("caso de libro", "<p>D = 1.000 unidades/año, S = $10 por pedido y H = $0,50 por unidad al año.</p>" + TX("Q^{*}=\\sqrt{\\dfrac{2\\cdot 1000\\cdot 10}{0{,}5}}=\\sqrt{40000}=200", "Q* = √(2·1000·10 ÷ 0,5) = √40000 = 200", true) + "<p><b>Resultado:</b> pedir 200 unidades cada vez, 5 pedidos al año. Comprobado con la calculadora EOQ.</p>") +
    '<h2 class="sh">Alerta de error común</h2>' + UI.error("unidades distintas", "<p>Usar la demanda mensual con un costo de mantener anual. D y H deben estar en el mismo período: si D es anual, H también.</p>") +
    '<h2 class="sh">Ejercicio con pistas</h2>' + UI.ejercicio("<p>Una ferretería vende 2.400 sacos de cemento al año. Pedir cuesta $12.000 y mantener un saco un año cuesta $1.600. ¿Cuántos sacos debe pedir cada vez?</p>", ["Identifica D, S y H con sus unidades.", "Reemplaza en Q* = √(2·D·S ÷ H): 2·2.400·12.000 = 57.600.000."], "<p>Q* = √(57.600.000 ÷ 1.600) = √36.000 ≈ 189,7 → <b>190 sacos</b> por pedido (unos 12,6 pedidos al año).</p>") +
    '<h2 class="sh">Ficha resumen</h2>' + UI.ficha(["EOQ equilibra el costo de pedir con el de mantener.", "Supone demanda constante y reposición instantánea.", "Pequeños errores en S o H cambian poco el costo total (curva plana cerca del óptimo)."]) +
    '<h2 class="sh">Fórmula en línea</h2><p>La utilización de una cola M/M/1 es ' + TX("\\rho=\\lambda/\\mu", "ρ = λ/μ") + " y debe ser menor que 1.</p>" +
    note("Las fórmulas se dibujan con el motor propio de la app, incluido en el archivo: funcionan sin conexión.", "info"); }

/* ---------- Tablas anchas: siempre dentro de un contenedor con desplazamiento propio ---------- */
function wrapWide(root){ root.querySelectorAll("table").forEach(t => { if (t.closest(".tbl-wrap,.gd-wrap,.xl-wrap,.sw-tbl,.sw-scroll,.wd-page,.malla")) return; const w = document.createElement("div"); w.className = "tbl-wrap"; t.parentNode.insertBefore(w, t); w.appendChild(t); }); }

/* ---------- Se ejecuta después de cada render ---------- */
function w7Init(root){
  try { wrapWide(root); } catch (e) {}
  try { const h1 = root.querySelector("h1"); if (h1 && !["inicio"].includes(cur) && !["hub", "area"].includes(pageOf(cur).g) && !h1.querySelector(".favb")) h1.insertAdjacentHTML("beforeend", " " + favBtn(cur)); } catch (e) {}
  try { if (cur !== "inicio") { root.insertAdjacentHTML("afterbegin", '<nav class="bcrumb no-print" aria-label="Ruta">' + crumbHTML(cur) + "</nav>"); root.insertAdjacentHTML("beforeend", crossHTML(cur)); } } catch (e) {}
  try { katexRender(root); } catch (e) {}
  try { if (typeof katexMotor === "function") katexMotor(root); } catch (e) {}
}
themeApply(themeGet());
