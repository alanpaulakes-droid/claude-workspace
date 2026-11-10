/* ============ PÁGINAS Y NAVEGACIÓN ============ */
const GROUPS = { malla:"Mi malla (UNAB)", carrera:"Carrera y trabajo", eco:"Economía y finanzas", ops:"Producción y logística", trab:"Estudio del trabajo", cal:"Calidad y estadística", io:"Investigación de operaciones", seg:"Seguridad y ambiente", ges:"Gestión y mejora", inf:"Informes", rep:"Reportes", ind:"Industrias", sab:"Saberes de otras disciplinas", des:"Desarrollo personal y profesional", ofi:"Excel y Word", learn:"Aprender", sim:"Simuladores de software" };
const indId = x => "ind-" + x[0].normalize("NFD").replace(/[̀-ͯ]/g, "");
const STATIC = [
  ["mi-malla", "malla", "Malla por trimestre", "Todos los ramos de tu programa y tu avance", "Map", pgMalla],
  ["areas", "carrera", "Áreas de desempeño", "Cargos, KPI y herramientas por área", "Área", pgAreas], ["competencias", "carrera", "Competencias y certificaciones", "Qué aprender y en qué orden", "Cert", pgCompetencias], ["practica-titulo", "carrera", "Práctica y memoria de título", "Plan de práctica, tema, estructura y defensa", "Tít", pgPractica], ["empleabilidad", "carrera", "CV, entrevistas y primer trabajo", "STAR, casos, 90 días y contrato", "CV", pgEmpleo], ["software", "carrera", "Software del ingeniero", "Excel, BI, SQL, Python, simulación, ERP", "SW", pgSoftware],
  ["lean", "ges", "Lean y mejora continua", "Desperdicios, 5S, SMED, kanban, TPM", "Lean", pgLean], ["mejora-continua", "ges", "PDCA, DMAIC, 8D y A3", "Metodologías de solución de problemas", "PDCA", pgMejora], ["calidad-7", "ges", "7 herramientas de la calidad", "Y costos de la calidad", "7Q", pgCalidad7], ["gestion-proyectos", "ges", "Gestión de proyectos", "Fases, valor ganado, ágil y riesgos", "PM", pgProyectos], ["kpis", "ges", "Biblioteca de KPI", "Indicadores por área con fórmula y meta", "KPI", pgKpis],
  ["estructura-informe", "inf", "Estructura del informe técnico", "Secciones, objetivos, tablas, unidades", "Est", pgEstructura], ["redaccion", "inf", "Redacción y presentaciones", "Escribir claro y exponer", "Red", pgRedaccion], ["plantillas", "inf", "Plantillas de documentos", "Informes, actas, POE, A3, accidentes", "Tpl", pgPlantillas],
  ["industrias", "ind", "Todas las industrias", "Cómo funciona cada sector y qué hace un ingeniero en él", "Ind", pgIndustrias],
  ["fundamentos", "learn", "Fundamentos por área", "Resumen de cada área de la carrera", "Fun", pgFund], ["historia", "learn", "Historia de la ingeniería industrial", "De Taylor a la industria 4.0", "Hist", pgHistoria], ["pensadores", "learn", "Grandes pensadores", "Quiénes crearon cada idea y qué leer", "Aut", pgPensadores], ["bibliografia", "learn", "Bibliografía esencial", "Libros y fuentes en formato APA", "Bib", pgBiblio], ["formulario", "learn", "Formulario", "Fórmulas clave agrupadas", "f(x)", pgFormulario], ["glosario", "learn", "Glosario", "Términos y conceptos", "A–Z", pgGlosario], ["siglas", "learn", "Siglas y abreviaturas", "Qué significa cada sigla de la ingeniería", "ABC", pgSiglas], ["tablas", "learn", "Tablas de referencia", "Normal, t, constantes, factores de interés", "Tbl", pgTablas], ["normativa", "learn", "Normativa y estándares", "Leyes chilenas e ISO", "Ley", pgNormativa], ["quiz", "learn", "Quiz de autoevaluación", "Preguntas con explicación", "?", pgQuiz]
];
COURSES.forEach(c => STATIC.push([c.id, "malla", c.t, c.d, "T" + c.tri, () => pgRamo(c.id), c.tri]));
SAB.filter(x => x.g !== "learn" && x.g !== "ofi").concat(SAB.filter(x => x.g === "ofi").sort((a, b) => a.n - b.n)).forEach(x => STATIC.push([x.id, x.g || "sab", x.ey, x.t, x.g === "ofi" ? (x.ey.startsWith("Excel") || x.ey.includes("Excel") ? "XL" : "W") : x.ey.slice(0, 3), () => pgSaber(x.id)]));
{ const fi = STATIC.findIndex(s => s[0] === "fundamentos"); STATIC.splice(fi + 1, 0, ...SAB.filter(x => x.g === "learn").sort((a, b) => a.n - b.n).map(x => [x.id, "learn", (x.n ? x.n + ". " : "") + x.ey, x.lead.split(".")[0], x.n ? "L" + x.n : "▶", () => pgSaber(x.id)])); const ea = STATIC.findIndex(s => s[0] === "empieza-aqui"); STATIC.splice(fi, 0, STATIC.splice(ea, 1)[0]); }
SIMS.forEach(x => STATIC.push([x.id, "sim", x.t, x.d, x.ico, () => pgSim(x.id)]));
IND.forEach(x => STATIC.push([indId(x), "ind", x[1], x[2].split(".")[0], x[1].slice(0, 3), () => pgIndustria(indId(x))]));
const ORDER = { eco:["van-tir", "flujo-caja", "equivalencias", "tasas", "amortizacion", "depreciacion", "equilibrio", "costeo", "caue", "vida-economica", "wacc", "ratios"], ops:["pronosticos", "eoq", "stock-seguridad", "abc", "mrp", "balanceo", "oee", "smed", "vsm", "secuenciacion", "johnson", "colas"], trab:["tiempo-estandar", "muestreo", "aprendizaje", "productividad"], cal:["descriptiva", "control-xr", "control-p", "capacidad", "sigma", "pareto", "amef", "muestra", "regresion"], io:["programacion-lineal", "transporte", "asignacion", "cpm", "decisiones", "ruta-corta", "localizacion", "factores", "simulacion-mc"], seg:["iper", "accidentabilidad", "niosh", "ruido", "huella"], ges:["foda", "ishikawa", "porques", "sipoc", "canvas", "raci"], inf:["generador-informe", "citas-apa"], learn:["conversor"] };
const HUBS = { simuladores:["Simuladores de software", "▶", ["sim"], "Programas de práctica que funcionan como el software profesional del ingeniero industrial: proyectos (tipo MS Project), estadística (tipo Minitab), simulación de procesos (tipo Arena), ERP (tipo SAP), optimización (tipo LINGO), inteligencia de negocios (tipo Power BI), bases de datos SQL y layout de planta (tipo AutoCAD). Cada uno trae datos de ejemplo e instructivo."], herramientas:["Herramientas de cálculo", "ƒ", ["eco", "ops", "trab", "cal", "io", "seg"], "Calculadoras con desarrollo paso a paso y una guía de estudio desplegable: qué es, historia, cómo funciona, cómo aplicarlo, ejemplo, errores frecuentes y fuentes."], carrera:["Carrera y trabajo", "▣", ["carrera", "sim", "ind"], "Áreas de desempeño, industrias, certificaciones, práctica, empleabilidad y software."], gestion:["Gestión y mejora", "◫", ["ges"], "Herramientas de diagnóstico y mejora continua, metodologías y biblioteca de indicadores."], informes:["Informes y reportes", "✎", ["inf", "rep"], "Estructura, redacción, plantillas, generador de informes con descarga en Word y PDF, citas APA y memoria de cálculo."], saberes:["Saberes de otras disciplinas", "⚙", ["sab"], "Electricidad, mecánica, hidráulica, automatización, mantenimiento, comercial, negociación, agroindustria, comercio exterior, datos e IA, finanzas personales, cultura general, mentalidad experta, Excel, casos integrados y una ruta de 12 meses: lo que un ingeniero industrial debe saber de las otras áreas, con fórmulas, esquemas, ejemplos y tips."], ofimatica:["Excel y Word profesional", "▦", ["ofi"], "Cursos de Excel y Word en tres niveles (básico, avanzado y profesional), con ilustraciones, tablas, una hoja de cálculo interactiva donde escribes y compruebas fórmulas, un editor de documentos para practicar estilos, tablas y tabla de contenido, y un editor de ecuaciones."], desarrollo:["Desarrollo personal y profesional", "◎", ["des"], "Habilidades blandas, psicología humana, influencia y persuasión, oratoria, resúmenes de libros, experiencias y lecciones de la industria, y marca personal: lo que separa a un buen técnico de un profesional que lidera."], aprender:["Aprender", "§", ["learn"], "Empieza aquí: once lecciones completas desde cero (economía, costos, estadística, operaciones, calidad, estudio del trabajo, logística, investigación de operaciones, proyectos, seguridad y estrategia), más fundamentos, historia, pensadores, bibliografía, formulario, glosario, tablas, normativa y quiz."] };
const PAGES = [{ id:"inicio", g:"", t:"Inicio", r:pgHome }];
Object.keys(HUBS).forEach(h => PAGES.push({ id:h, g:"hub", t:HUBS[h][0], r:() => pgHub(h) }));
Object.keys(GROUPS).forEach(g => {
  (ORDER[g] || []).forEach(id => PAGES.push({ id, g, t:C[id].t, d:C[id].d, ico:C[id].ico, r:() => calcPage(id), calc:true }));
  STATIC.filter(s => s[1] === g).forEach(s => PAGES.push({ id:s[0], g, t:s[2], d:s[3], ico:s[4], r:s[5], tri:s[6] }));
});
PAGES.push({ id:"reportes", g:"rep", t:"Memoria de cálculo", d:"Todos tus resultados en un documento descargable", ico:"⎙", r:pgReportes });
Object.keys(C).forEach(id => { if (!PAGES.find(p => p.id === id)) PAGES.push({ id, g:C[id].g, t:C[id].t, d:C[id].d, ico:C[id].ico, r:() => calcPage(id), calc:true }); });
if (typeof areaPages === "function") areaPages(PAGES);
if (typeof extraPages === "function") extraPages(PAGES);
const pageOf = id => PAGES.find(p => p.id === id) || PAGES[0];
const PARENT = { malla:"mi-malla", carrera:"carrera", ind:"industrias", eco:"herramientas", ops:"herramientas", trab:"herramientas", cal:"herramientas", io:"herramientas", seg:"herramientas", ges:"gestion", inf:"informes", learn:"aprender", sab:"saberes", des:"desarrollo", ofi:"ofimatica", rep:"informes", hub:"inicio", sim:"simuladores", area:"por-area" };
const TABS = [["inicio", "inicio", "Inicio"], ["por-area", "temas", "Temas"], ["herramientas", "calcular", "Calcular"], ["mi-malla", "malla", "Malla"], ["_more", "mas", "Más"]];
/* Barra inferior: 5 destinos. «Más» abre el panel con todas las secciones (informes, carrera, simuladores, ajustes). */
const tabOf = id => { const p = pageOf(id), g = p.g;
  if (id === "inicio") return "inicio";
  if (g === "malla" || id === "mi-malla" || id === "por-trimestre") return "mi-malla";
  if (p.calc || ["eco", "ops", "trab", "cal", "io", "seg", "ges"].includes(g) || ["herramientas", "gestion"].includes(id)) return "herramientas";
  if (["area", "learn", "sab", "des", "ofi"].includes(g) || ["por-area", "aprender", "saberes", "desarrollo", "ofimatica", "favoritos"].includes(id)) return "por-area";
  return "_more"; };

/* Mosaico de una página: ícono y color del área a la que pertenece */
function tile(p){ const a = typeof areaOf === "function" ? areaOf(p.id) : null, k = a ? a[0] : "ref";
  return '<button class="tile' + (S.done[p.id] ? " done" : "") + '" type="button" data-go="' + p.id + '" style="--ac:var(--a-' + k + ')"><span class="ti">' + icoUse(S.done[p.id] ? "check" : "a-" + k) + '</span><span class="tt">' + p.t + '</span><span class="td">' + (p.d || "") + (S.done[p.id] ? ' <span class="pill ok">Usada</span>' : "") + "</span></button>"; }
function pgHub(h){
  const H = HUBS[h];
  return '<p class="eyebrow">Biblia del Ingeniero Industrial</p><h1>' + H[0] + '</h1><p class="lead">' + H[3] + "</p>" + H[2].map(g => (H[2].length > 1 ? '<h2 class="sh">' + GROUPS[g] + "</h2>" : "") + '<div class="tiles">' + PAGES.filter(p => p.g === g).map(tile).join("") + "</div>").join("");
}
function pgHome(){
  const lp = S.last && PAGES.find(p => p.id === S.last && p.g !== "hub" && p.id !== "inicio");
  const nCalc = Object.keys(C).length, nDone = Object.keys(S.done).filter(k => C[k]).length, nOk = COURSES.filter(c => S.malla && S.malla[c.id]).length;
  const M = [["por-area", "◫", "Estudiar por área", "10 áreas de la carrera + carrera y habilidades + referencia"], ["por-trimestre", "★", "Estudiar por trimestre", "Ramos de cada trimestre con sus calculadoras y áreas"]].concat(S.fav && S.fav.length ? [["favoritos", "★", "Mis favoritos", S.fav.length + " página" + (S.fav.length === 1 ? "" : "s") + " guardada" + (S.fav.length === 1 ? "" : "s")]] : []).concat([["mi-malla", "★", "Mi malla UNAB", COURSES.length + " ramos con apuntes por unidad · " + nOk + " aprobados"], ["herramientas", "ƒ", "Herramientas de cálculo", nCalc + " calculadoras con guía de estudio completa"], ["gestion", "◫", "Gestión y mejora", "FODA, Ishikawa, SIPOC, RACI, Lean, DMAIC, KPI"], ["informes", "✎", "Informes en Word y PDF", "Generador, plantillas, APA y memoria de cálculo" + (nDone ? " (" + nDone + " resultados)" : "")], ["industrias", "▣", "Industrias", "Minería, banca, retail, manufactura, alimentos, energía y más"], ["ofimatica", "▦", "Excel y Word profesional", "Cursos básico, avanzado y profesional con ejercicios interactivos"], ["simuladores", "▶", "Simuladores de software", "Proyectos, estadística, procesos, ERP, optimización, BI, SQL y layout, con instructivo"], ["desarrollo", "◎", "Desarrollo personal y profesional", "Vida cotidiana, hábitos, relaciones, bienestar, habilidades blandas, oratoria, libros y experiencias"], ["saberes", "⚙", "Saberes de otras áreas", "Electricidad, mecánica, mantenimiento, comercio exterior, datos e IA, casos integrados, ruta pro"], ["aprender", "§", "Aprender desde cero", "11 lecciones desde cero, historia, pensadores, formulario, glosario, tablas, normas, quiz"]]);
  const top = ["van-tir", "flujo-caja", "eoq", "pronosticos", "control-xr", "capacidad", "programacion-lineal", "cpm", "balanceo", "smed", "iper", "pareto"];
  const flow = [["sipoc", "Definir"], ["descriptiva", "Medir"], ["pareto", "Priorizar"], ["ishikawa", "Analizar causas"], ["smed", "Mejorar"], ["flujo-caja", "Evaluar"], ["generador-informe", "Informar"]];
  const seen = S.seen || {}, bar = (n, t, lab) => '<span class="bar" role="progressbar" aria-label="' + esc(lab) + '" aria-valuemin="0" aria-valuemax="' + t + '" aria-valuenow="' + n + '"><i style="width:' + (t ? Math.round(n / t * 100) : 0) + '%"></i></span>';
  const rec = (S.recent || []).map(id => PAGES.find(p => p.id === id)).filter(p => p && p.id !== "inicio" && p.g !== "hub").slice(0, 4);
  const fav = (S.fav || []).map(id => PAGES.find(p => p.id === id)).filter(Boolean);
  const ar = CAREAS.map(a => { const ids = a[3].filter(id => PAGES.some(p => p.id === id)); return [a, ids.filter(id => seen[id]).length, ids.length]; });
  const row = p => '<button class="lrow" type="button" data-go="' + p.id + '"><span class="lrow-t">' + esc(p.t) + '</span><small class="lrow-d">' + esc(GROUPS[p.g] || "") + "</small>" + icoUse("chev-r") + "</button>";
  return '<header class="home-h"><p class="eyebrow">Ingeniería Industrial · Chile</p><h1>Biblia del Ingeniero Industrial</h1><p class="lead">Estudiar, calcular, decidir y documentar en un solo lugar: tu malla con apuntes por ramo, herramientas con desarrollo paso a paso y guías de estudio, métodos de gestión, informes descargables en Word y PDF, y el conocimiento de cada industria.</p></header>' +
    '<div class="mob-search gsw"><input type="search" id="gsearch2" placeholder="Buscar ramo, herramienta, tema o término…" aria-label="Buscar en la app" autocomplete="off"><div id="gsres2" class="hits"></div></div>' +
    '<div class="home-grid">' +
      '<section class="panel" aria-labelledby="h-cont"><h2 class="panel-h" id="h-cont">' + icoUse("reloj") + 'Continuar</h2>' +
        ((typeof resumeHTML === "function" ? resumeHTML() : "") || '<p class="hint">Todavía no abres ningún tema. Un buen comienzo: <button class="linkb" type="button" data-go="empieza-aqui">la ruta de aprendizaje</button>.</p>') +
        (rec.length ? '<div class="lrows">' + rec.map(row).join("") + "</div>" : "") + "</section>" +
      '<section class="panel" aria-labelledby="h-prog"><h2 class="panel-h" id="h-prog">' + icoUse("a-eco") + 'Tu progreso</h2>' +
        '<div class="prog"><div class="prog-r"><button class="linkb" type="button" data-go="mi-malla">Ramos aprobados</button><b>' + nOk + " de " + COURSES.length + "</b></div>" + bar(nOk, COURSES.length, "Ramos aprobados") + "</div>" +
        '<div class="prog"><div class="prog-r"><button class="linkb" type="button" data-go="herramientas">Calculadoras usadas</button><b>' + nDone + " de " + nCalc + "</b></div>" + bar(nDone, nCalc, "Calculadoras usadas") + "</div>" +
        '<h3 class="panel-sub">Temas vistos por área</h3><div class="aprog">' + ar.map(x => '<button class="aprog-r" type="button" data-go="' + AREA_ID(x[0]) + '" style="--ac:var(--a-' + x[0][0] + ')"><span class="aprog-i">' + icoUse("a-" + x[0][0]) + '</span><span class="aprog-t">' + esc(x[0][1]) + '</span><span class="aprog-n">' + x[1] + "/" + x[2] + "</span>" + bar(x[1], x[2], x[0][1] + ": temas vistos") + "</button>").join("") + "</div></section>" +
    "</div>" +
    (fav.length ? '<section aria-labelledby="h-fav"><h2 class="sh" id="h-fav">Favoritos</h2><div class="quick">' + fav.map(p => '<button class="chip" type="button" data-go="' + p.id + '">' + icoUse("estrella-on") + " " + esc(p.t) + "</button>").join("") + "</div></section>" : "") +
    '<section aria-labelledby="h-top"><h2 class="sh" id="h-top">Calculadoras más usadas</h2><div class="tiles">' + top.map(id => tile(pageOf(id))).join("") + "</div></section>" +
    '<section aria-labelledby="h-exp"><h2 class="sh" id="h-exp">Explorar</h2><div class="mods">' + M.map(m => '<button class="mod" type="button" data-go="' + m[0] + '"><span class="mi">' + (svgIco(m[0]) || icoUse("temas")) + '</span><span class="mt">' + m[2] + '</span><span class="md">' + m[3] + "</span></button>").join("") + "</div></section>" +
    '<section aria-labelledby="h-flow"><h2 class="sh" id="h-flow">Flujo de un proyecto de mejora</h2><ol class="flow">' + flow.map((f, i) => '<li><button type="button" data-go="' + f[0] + '"><span>' + (i + 1) + "</span>" + f[1] + "</button></li>").join("") + "</ol></section>" +
    note("Cada herramienta abre con un ejemplo resuelto y una guía de estudio desplegable. Reemplaza los datos por los tuyos y presiona <b>Calcular</b>; los resultados se guardan en este navegador y se pueden descargar en Word o PDF.", "info");
}

/* ============ PÁGINA DE HERRAMIENTA ============ */
function vals(id, raw){ const c = C[id], v = {}; c.f.forEach(f => { if (typeof f.o !== "function") v[f.k] = f.d; }); c.f.forEach(f => { if (typeof f.o === "function") v[f.k] = f.d; }); Object.assign(v, S.v[id] || {}); return raw || typeof uApply !== "function" ? v : uApply(id, v); }
function calcOpts(){ const ids = PAGES.filter(p => p.calc && S.done[p.id] && !["generador-informe", "citas-apa", "conversor"].includes(p.id)).map(p => p.id); if (!ids.includes("smed")) ids.push("smed"); return ids.map(id => [id, C[id].t]); }
function fieldHTML(id, f, v){
  const fid = "f-" + id + "-" + f.k, val = v[f.k] == null ? "" : v[f.k], us = typeof uSelHTML === "function" ? uSelHTML(id, f) : "", lab = (us ? '<div class="flab-row">' : "") + '<label for="' + fid + '">' + f.l + (f.u && !us ? ' <span class="unit">(' + f.u + ")</span>" : "") + "</label>" + (us ? us + "</div>" : ""), hx = typeof autoHelp === "function" ? autoHelp(f) : f.h, help = hx ? "<small>" + hx + "</small>" : "", da = ' data-c="' + id + '" data-k="' + f.k + '"';
  if (f.t === "calcs") { const sel = String(val).split(",").filter(Boolean); return '<div class="field wide"><span class="flab">' + f.l + '</span><div class="cbx" id="' + fid + '">' + calcOpts().map(o => '<label class="chk"><input type="checkbox" value="' + o[0] + '"' + da + (sel.includes(o[0]) ? " checked" : "") + "> " + esc(o[1]) + "</label>").join("") + "</div>" + help + "</div>"; }
  if (f.t === "sel") { let o = typeof f.o === "function" ? f.o(v) : f.o; if (!o.some(x => String(x[0]) === String(val)) && o.length) v[f.k] = o[0][0];
    return '<div class="field">' + lab + '<select id="' + fid + '"' + da + (f.re ? ' data-re="1"' : "") + ">" + o.map(x => '<option value="' + esc(x[0]) + '"' + (String(x[0]) === String(v[f.k]) ? " selected" : "") + ">" + esc(x[1]) + "</option>").join("") + "</select>" + help + "</div>"; }
  if (f.t === "list" || f.t === "mat" || f.t === "area") { const nl = String(val).split("\n").length; const r = f.t === "list" ? Math.max(2, Math.min(5, Math.ceil(String(val).length / 70))) : f.t === "area" ? Math.max(3, Math.min(10, Math.ceil(String(val).length / 90) + nl - 1)) : Math.max(3, Math.min(14, nl + 1));
    return '<div class="field' + (f.t !== "area" || f.w ? " wide" : "") + '">' + lab + '<textarea id="' + fid + '"' + da + ' rows="' + r + '"' + (f.t === "area" ? ' class="prose"' : ' spellcheck="false"') + ">" + esc(val) + "</textarea>" + help + "</div>"; }
  return '<div class="field' + (f.t === "txt" && String(val).length > 30 ? " wide" : "") + '">' + lab + '<input id="' + fid + '"' + da + ' type="text"' + (f.t === "num" ? ' inputmode="decimal"' : "") + ' value="' + esc(val) + '" autocomplete="off">' + help + "</div>";
}
function safeCalc(id){ try { return C[id].c(vals(id)); } catch (e) { return note("<b>No se pudo calcular:</b> " + esc(e.message), "bad"); } }
function inputSummary(id){
  const v = vals(id); return table(["Dato", "Valor"], C[id].f.filter(f => f.t !== "calcs").map(f => { let x = v[f.k]; if (f.t === "sel") { const o = typeof f.o === "function" ? f.o(v) : f.o, m = o.find(q => String(q[0]) === String(x)); x = m ? m[1] : x; } x = String(x == null ? "" : x); return [f.l + (f.u ? " (" + f.u + ")" : ""), x.includes("\n") ? '<span class="mono" style="white-space:pre-wrap;font-size:12.5px">' + esc(x.length > 800 ? x.slice(0, 800) + "…" : x) + "</span>" : esc(x)]; }), { cls:"ftab" });
}
const GSEC = [["que", "¿Qué es y para qué sirve?"], ["hist", "Historia y origen"], ["como", "Cómo funciona"], ["pasos", "Cómo aplicarlo paso a paso"], ["caso", "Ejemplo aplicado"], ["err", "Errores frecuentes y limitaciones"]];
function guideBody(id, open){
  const g = GUIDE[id] || {}, x = GX[id] || {}, c = C[id], S2 = [];
  const add = (t, h) => { if (h) S2.push([t, h]); };
  if (typeof BG !== "undefined" && BG[id]) add("Explicación desde cero: empieza aquí", bgHTML(BG[id]));
  add("¿Qué es y para qué sirve?", g.que); add("Historia y origen", g.hist);
  add("Cómo funciona", (g.como || "") + (c.learn ? "<h4>Notas prácticas</h4>" + c.learn : ""));
  if (x.fx) add("Fórmulas explicadas", '<div class="fxl">' + x.fx.map(f => "<h4>" + f[0] + "</h4>" + M(f[1]) + (f[2] || "")).join("") + "</div>");
  if (x.fig) add("Esquema visual", x.fig.map(f => { try { return f(); } catch (e) { return ""; } }).join(""));
  add("Cómo aplicarlo paso a paso", g.pasos);
  if (x.ej) add("Ejemplo resuelto paso a paso", '<div class="ejr">' + x.ej + "</div>");
  add("Ejemplo aplicado en la industria", g.caso);
  if (x.cmp) add("Comparación con otros métodos", table(x.cmp[0], x.cmp[1]));
  if (x.tips) add("Tips del experto", '<ul class="tips">' + x.tips.map(t => "<li>" + t + "</li>").join("") + "</ul>");
  add("Errores frecuentes y limitaciones", g.err);
  if (x.cita) add("Para recordar", '<blockquote class="cita">«' + x.cita[0] + '»<footer>' + x.cita[1] + "</footer></blockquote>");
  if (g.src) add("Fuentes y lecturas recomendadas", "<ul>" + g.src.map(s => '<li style="list-style:none;padding-left:1.5em;text-indent:-1.5em">' + s + "</li>").join("") + "</ul>");
  return S2.map((s, i) => '<details class="item"' + (open || i === 0 ? " open" : "") + "><summary>" + s[0] + '</summary><div class="body prose">' + mFill(s[1]) + "</div></details>").join("");
}
function calcPage(id){
  const c = C[id], v = vals(id, true), isEx = !S.v[id], done = !!S.done[id], hasG = !!(GUIDE[id] || c.learn || (typeof BG !== "undefined" && BG[id]));
  let h = '<p class="eyebrow">' + c.ey + "</p><h1>" + c.t + '</h1><p class="lead">' + c.lead + (hasG ? ' <button class="linkb" type="button" data-act="toguide">Ver guía de estudio ↓</button>' : "") + "</p>";
  const LES = { eco:"fund-economia", ops:"fund-operaciones", trab:"fund-trabajo", cal:"fund-calidad", io:"fund-io", seg:"fund-seguridad", ges:"fund-estrategia" }[c.g];
  if (LES && SAB.find(x => x.id === LES)) h += '<p class="hint" style="margin:-4px 0 14px">¿Partes de cero en este tema? <button class="linkb" type="button" data-go="' + LES + '">Lee primero la lección «' + SAB.find(x => x.id === LES).t + '»</button></p>';
  h += '<section class="card form"><div class="sechead"><span class="tag">Datos</span><h2>' + (isEx ? "Datos de entrada · ejemplo" : "Datos de entrada") + '</h2></div>' + (typeof howHTML === "function" ? howHTML(id) : "") + '<div class="grid">' + c.f.map(f => fieldHTML(id, f, v)).join("") + "</div>" +
    '<div class="actions"><button class="btn calc" type="button" data-act="calc" data-c="' + id + '">' + (c.btn || "Calcular") + '</button><button class="btn ghost" type="button" data-act="ex" data-c="' + id + '">Cargar ejemplo</button><button class="btn ghost" type="button" data-act="clr" data-c="' + id + '">Limpiar</button>' + (done && !["generador-informe", "citas-apa", "conversor"].includes(id) ? '<span class="hint">✓ Incluido en la memoria de cálculo</span>' : "") + "</div></section>";
  if (isEx || done) {
    const stale = done && S.snap[id] && S.snap[id] !== JSON.stringify(S.v[id] || {});
    const exp = ["generador-informe", "citas-apa", "conversor"].includes(id) ? "" : '<div class="actions no-print" style="border:0;margin-top:0;padding-top:0">' + expBtns("calc", ' data-c="' + id + '"') + '<button class="btn ghost small" type="button" data-act="copyres" data-c="' + id + '">Copiar resultado</button></div>';
    h += '<section class="card result" id="res"><div class="sechead"><span class="tag">Resultado</span><h2>' + (isEx ? "Resultado del ejemplo" : "Resultado") + "</h2></div>" + exp +
      (isEx ? note("Resultado calculado con los datos de ejemplo. Reemplázalos por los tuyos y presiona <b>" + (c.btn || "Calcular") + "</b>.", "info exnote") : "") + '<details class="item usados"><summary>Datos usados en este cálculo (revísalos antes de interpretar)</summary><div class="body">' + inputSummary(id) + "</div></details>" +
      (stale ? '<div class="note stale"><span>Cambiaste datos después de calcular: este resultado ya no corresponde.</span><button class="btn small" type="button" data-act="calc" data-c="' + id + '">Recalcular</button></div>' : "") + safeCalc(id) + "</section>";
  } else h += '<section class="card result" id="res"><div class="empty">Ingresa los datos y presiona <b>' + (c.btn || "Calcular") + "</b>.</div></section>";
  if (hasG) h += '<section class="guide" id="guia"><div class="sechead"><span class="tag">Guía de estudio</span><h2>' + c.t + '</h2></div><p class="hint">Abre cada sección para estudiar el método en profundidad.</p>' + guideBody(id) + '<div class="actions no-print" style="border:0">' + expBtns("guia", ' data-c="' + id + '"') + "</div></section>";
  const rel = (c.rel || []).filter(r => PAGES.find(p => p.id === r));
  if (rel.length) h += '<h3 style="margin-top:20px">Relacionado</h3><div class="quick">' + rel.map(r => '<button class="chip" type="button" data-go="' + r + '">' + pageOf(r).t + "</button>").join("") + "</div>";
  const ps = PAGES.filter(p => p.g === c.g), i = ps.findIndex(p => p.id === id), pr = ps[i - 1], nx = ps[i + 1];
  h += '<div class="pager">' + (pr ? '<button class="btn ghost" type="button" data-go="' + pr.id + '">← ' + pr.t + "</button>" : "<span></span>") + (nx ? '<button class="btn ghost" type="button" data-go="' + nx.id + '">' + nx.t + " →</button>" : "") + "</div>";
  return h;
}

/* ============ REPORTES ============ */
const repIds = () => PAGES.filter(p => p.calc && S.done[p.id] && !["generador-informe", "citas-apa", "conversor"].includes(p.id)).map(p => p.id);
function pgReportes(){
  const ids = repIds(), P = S.proj;
  let h = '<p class="eyebrow">Reportes · Documentación</p><h1>Memoria de cálculo</h1><p class="lead">Reúne en un solo documento los datos y resultados de las herramientas que calculaste, y descárgalo en Word o PDF.</p>';
  h += '<section class="card form no-print"><div class="sechead"><span class="tag">Encabezado</span><h2>Datos del proyecto</h2></div><div class="grid">' + [["nombre", "Proyecto", "Ej.: Mejora de la línea 3"], ["autor", "Autor", "Nombre y cargo"], ["empresa", "Empresa o curso", ""], ["fecha", "Fecha", "Octubre de 2026"]].map(f => '<div class="field"><label for="pj-' + f[0] + '">' + f[1] + '</label><input id="pj-' + f[0] + '" data-pj="' + f[0] + '" type="text" value="' + esc(P[f[0]] || "") + '" placeholder="' + esc(f[2]) + '"></div>').join("") + "</div></section>";
  if (!ids.length) return h + '<div class="empty">Aún no tienes resultados guardados. Abre cualquier ' + lk("herramientas", "herramienta de cálculo") + ", ingresa tus datos y presiona <b>Calcular</b>.</div>";
  h += '<div class="actions no-print" style="border:0;margin-top:0;padding-top:0">' + expBtns("memoria") + '<button class="btn ghost small" type="button" data-act="copyrich" data-t="repdoc">Copiar con formato</button><button class="btn danger small" type="button" data-act="clrall">Quitar todos los resultados</button></div>';
  h += '<div class="doc" id="repdoc" style="max-width:none"><div class="noexp"><p class="eyebrow">Memoria de cálculo</p><h1>' + esc(P.nombre || "Proyecto sin nombre") + '</h1><p class="meta">' + [P.autor, P.empresa, P.fecha].filter(Boolean).map(esc).join(" · ") + "</p></div>";
  h += ids.map((id, i) => '<div class="rep-s"><h2>' + (i + 1) + ". " + C[id].t + '</h2><button class="btn ghost small no-print" type="button" data-act="undone" data-c="' + id + '">Quitar de la memoria</button><p class="hint">' + C[id].ey + "</p><h3>" + (i + 1) + ".1 Datos de entrada</h3>" + inputSummary(id) + "<h3>" + (i + 1) + ".2 Resultados y desarrollo</h3>" + demote(safeCalc(id)) + "</div>").join("") + "</div>";
  return h;
}

/* ============ EXPORTACIÓN: QUÉ SE EXPORTA ============ */
function tmpEl(html){ const d = document.createElement("div"); d.className = "doc"; d.style.cssText = "position:absolute;left:-10000px;top:0;width:900px"; d.innerHTML = html; document.body.appendChild(d); return d; }
async function doExport(kind, fmt, id){
  const P = S.proj, who = [["Autor", P.autor], ["Organización", P.empresa], ["Fecha", P.fecha]].filter(x => x[1]);
  if (kind === "formulario" || kind === "glosario") return exportRef(kind, fmt);
  if ((kind === "pagina" || kind === "ramo" || kind === "saber" || kind === "guia") && id === cur && document.querySelector("#app .t8")) return exportPage(fmt, id);
  if (kind === "calc") { const el = tmpEl("<h2>1. Datos de entrada</h2>" + inputSummary(id) + "<h2>2. Resultados y desarrollo</h2>" + demote(safeCalc(id)));
    try { await exportDoc(fmt, { kind:"Memoria de cálculo", title:C[id].t, subtitle:(P.nombre ? P.nombre + " · " : "") + C[id].ey, lines:who, author:P.autor, toc:false }, el); } finally { el.remove(); } }
  else if (kind === "guia") { const c = C[id]; const tmp = document.createElement("div"); tmp.innerHTML = guideBody(id, true); let html = "", n = 0; tmp.querySelectorAll(":scope > details").forEach(d => { const t = d.querySelector("summary").textContent; html += "<h2>" + (t.startsWith("Fuentes") ? "Referencias" : (++n) + ". " + t) + "</h2>" + d.querySelector(".body").innerHTML; });
    const el = tmpEl(html); try { await exportDoc(fmt, { kind:"Guía de estudio", title:c.t, subtitle:c.ey, lines:[["Fuente", "Biblia del Ingeniero Industrial"]], toc:true }, el); } finally { el.remove(); } }
  else if (kind === "ramo") { const c = COURSES.find(x => x.id === id); let html = mFill("<h2>Por qué es importante</h2><p>" + c.why + "</p>" + crsFigs(c.id) + unitsOf(c).map(u => "<h2>" + u[0] + "</h2>" + u[1]).join("") + (CX[c.id] ? crsSecs(c.id).map(s => "<h2>" + s[0] + "</h2>" + s[1]).join("") : "")) + "<h2>Bibliografía recomendada</h2>" + c.src.map(s => "<p>" + s + "</p>").join("");
    const el = tmpEl(html); try { await exportDoc(fmt, { kind:"Apuntes de estudio · " + c.tri + "° trimestre", title:c.t, subtitle:c.d, lines:[["Programa", "Ingeniería Industrial Advance"]], toc:true }, el); } finally { el.remove(); } }
  else if (kind === "ind") { const x = IND.find(i => indId(i) === id), el = tmpEl(mFill("<h2>1. Cómo funciona el sector</h2>" + x[3] + indFigs(x[0]) + indSecs(x).map((s, i) => "<h2>" + (i + 2) + ". " + s[0] + "</h2>" + s[1]).join("")));
    try { await exportDoc(fmt, { kind:"Ficha de industria", title:x[1], subtitle:x[2], toc:false }, el); } finally { el.remove(); } }
  else if (kind === "saber") { const x = SAB.find(s => s.id === id), tmp = document.createElement("div"); tmp.innerHTML = mFill(typeof expandHTML === "function" ? expandHTML(id, pgSaber(id)) : pgSaber(id)); let html = "", n = 0; const fg = tmp.querySelectorAll("#sabdoc > figure"); if (fg.length) { html = "<h2>" + (++n) + ". Esquemas visuales</h2>"; fg.forEach(f => html += f.outerHTML); } tmp.querySelectorAll("#sabdoc > details").forEach(d => { const t = d.querySelector("summary").textContent; html += "<h2>" + (t.startsWith("Fuentes") ? "Referencias" : (++n) + ". " + t.replace(/^\d+\.\s*/, "")) + "</h2>" + d.querySelector(".body").innerHTML; });
    const el = tmpEl(html); try { await exportDoc(fmt, { kind:"Apuntes · " + x.ey, title:x.t, subtitle:x.lead, lines:[["Fuente", "Biblia del Ingeniero Industrial"]], toc:true }, el); } finally { el.remove(); } }
  else if (kind === "informe") { const v = vals("generador-informe"), tipo = { tec:"Informe técnico", prac:"Informe de práctica profesional", eje:"Informe ejecutivo", av:"Informe de avance" }[v.tipo];
    await exportDoc(fmt, { kind:tipo, title:v.tit || "Informe", subtitle:v.org || "", lines:[["Autor", v.aut], ["Organización", v.org], ["Dirigido a", v.dest], ["Fecha", v.fec]].filter(x => x[1]), author:v.aut, toc:true }, document.getElementById("docout")); }
  else if (kind === "memoria") await exportDoc(fmt, { kind:"Memoria de cálculo", title:P.nombre || "Memoria de cálculo", lines:who, author:P.autor, toc:true }, document.getElementById("repdoc"));
}

/* ============ RENDER ============ */
let cur = "inicio";
function searchHits(q){
  const nz = t => String(t || "").replace(/<[^>]+>/g, "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); q = nz(q).trim(); if (q.length < 2) return [];
  const H = []; PAGES.forEach(p => { if (p.id !== "inicio" && nz(p.t + " " + (p.d || "") + " " + (C[p.id] ? C[p.id].ey : "")).includes(q)) H.push({ go:p.id, t:p.t, k:GROUPS[p.g] || "Sección" }); });
  COURSES.forEach(c => c.u.forEach(u => { if (nz(u[0]).includes(q) || (q.length > 3 && nz(u[1]).includes(q))) H.push({ go:c.id, t:c.t + " · " + u[0].replace(/^\d+\.\s*/, ""), k:"Ramo" }); }));
  Object.keys(GUIDE).forEach(id => { if (q.length > 3 && GSEC.some(s => nz(GUIDE[id][s[0]]).includes(q)) && !H.some(x => x.go === id)) H.push({ go:id, t:C[id].t + " (guía)", k:"Guía de estudio" }); });
  Object.keys(GLOS).forEach(g => { if (nz(g + " " + GLOS[g]).includes(q)) H.push({ go:"glosario", t:g + ": " + GLOS[g].slice(0, 50) + "…", k:"Glosario" }); });
  if (!searchHits.ix) searchHits.ix = SAB.flatMap(x => x.secs.filter(s => Array.isArray(s)).map(s => [x.id, x.ey, String(s[0]).replace(/<[^>]+>/g, "").replace(/^\d+\.\s*/, ""), nz(s[0]), nz(s[1])]));
  const kx = { des:"Desarrollo", learn:"Lección", ofi:"Excel y Word" }, gx = id => (SAB.find(x => x.id === id) || {}).g;
  searchHits.ix.forEach(e => { if (H.length < 24 && e[3].includes(q)) H.push({ go:e[0], t:e[1] + " · " + e[2], k:kx[gx(e[0])] || "Saberes" }); });
  if (q.length > 3) searchHits.ix.forEach(e => { if (H.length < 24 && !e[3].includes(q) && e[4].includes(q) && !H.some(h => h.go === e[0] && h.t.endsWith(e[2]))) H.push({ go:e[0], t:e[1] + " · " + e[2], k:(kx[gx(e[0])] || "Saberes") + " (en el texto)" }); });
  return H.slice(0, 24);
}
const hitsHTML = (H, q) => H.map(x => '<button type="button" class="hit" data-go="' + x.go + '"><span class="hit-t">' + esc(x.t) + '</span><small class="hit-k">' + esc(x.k) + "</small>" + icoUse("chev-r") + "</button>").join("") || (q.trim().length >= 2 ? '<p class="hint" style="padding:4px 8px;margin:0">Sin resultados</p>' : "");
function renderSide(){
  let closed = null; try { closed = JSON.parse(localStorage.getItem(KEY + "-side2") || "null"); } catch (e) {}
  if (!closed) closed = Object.keys(GROUPS).filter(g => g !== "malla");
  const cg = pageOf(cur).g;
  let h = '<div class="gsw"><input type="search" id="gsearch" placeholder="Buscar ramo, herramienta o término…" aria-label="Buscar en la app" autocomplete="off"><div id="gsres"></div></div><button type="button" data-go="inicio" aria-current="' + (cur === "inicio") + '"><span class="k">' + icoUse("inicio") + "</span>Inicio</button>" + (typeof sideTopHTML === "function" ? sideTopHTML() : "");
  Object.keys(GROUPS).forEach(g => { const ps = PAGES.filter(p => p.g === g); const op = g === cg || !closed.includes(g);
    h += '<details class="sgp" data-sgp="' + g + '"' + (op ? " open" : "") + "><summary>" + GROUPS[g] + "</summary>" + ps.map(p => '<button type="button" data-go="' + p.id + '" aria-current="' + (p.id === cur) + '"><span class="k">' + (p.tri ? "T" + p.tri : "") + "</span>" + p.t + (S.done[p.id] || (S.malla && S.malla[p.id]) ? '<span class="done" aria-label="completado">' + icoUse("check") + "</span>" : "") + "</button>").join("") + "</details>"; });
  document.getElementById("side").innerHTML = h;
  const p = pageOf(cur);
  document.getElementById("crumb").innerHTML = cur === "inicio" ? "" : typeof crumbHTML === "function" ? crumbHTML(cur) : esc((GROUPS[p.g] ? GROUPS[p.g] + " › " : "") + p.t);
  document.getElementById("backBtn").hidden = cur === "inicio" && !NAV.length;
  const tb = tabOf(cur);
  document.getElementById("tabbar").innerHTML = TABS.map(t => '<button type="button" ' + (t[0] === "_more" ? 'data-more="1" aria-haspopup="dialog"' : 'data-go="' + t[0] + '"') + ' aria-current="' + (t[0] === tb) + '"><span class="ic">' + icoUse(t[1]) + "</span><span>" + t[2] + "</span></button>").join("");
}
function goBack(){
  const sn = NAV.pop();
  if (!sn) { const p = pageOf(cur); cur = p.g === "hub" ? "inicio" : PARENT[p.g] === cur ? "inicio" : PARENT[p.g] || "inicio"; }
  else cur = sn.id;
  try { history.replaceState(null, "", "#" + cur); } catch (e) {}
  render();
  if (sn) { const ds = document.querySelectorAll("#app details"); sn.open.forEach((o, i) => { if (ds[i]) ds[i].open = o; }); requestAnimationFrame(() => window.scrollTo(0, sn.y)); }
}
function render(keepScroll){
  const p = pageOf(cur); let html;
  try { html = p.r(); } catch (e) { html = note("Error al mostrar esta sección: " + esc(e.message), "bad"); }
  try { if (typeof expandHTML === "function") html = expandHTML(cur, html); } catch (e) { console.error(e); }
  try { if (typeof tpl8HTML === "function") html = tpl8HTML(cur, html); } catch (e) { console.error(e); }
  const tp = NAV[NAV.length - 1]; if (tp && tp.c && tp.id !== cur) html = '<button class="retbar no-print" type="button" data-act="back">← Volver a «' + esc(pageOf(tp.id).t) + '»</button>' + html;
  document.getElementById("app").innerHTML = mFill(html);
  try { abbrify(document.getElementById("app")); } catch (e) {}
  try { if (typeof afterRender === "function") afterRender(document.getElementById("app")); } catch (e) { console.error(e); }
  renderSide();
  if (cur === "tablas") tfTable();
  document.title = (cur === "inicio" ? "" : p.t + " · ") + "Biblia del Ingeniero Industrial";
  if (!keepScroll) window.scrollTo(0, 0);
}
const NAV = [];
function navSnap(fromApp){ const app = document.getElementById("app"); return { id:cur, y:window.scrollY, c:!!fromApp, open:app ? [...app.querySelectorAll("details")].map(d => d.open) : [] }; }
function go(id, fromApp){
  if (!PAGES.find(p => p.id === id)) id = "inicio";
  if (id !== cur) { NAV.push(navSnap(fromApp)); if (NAV.length > 60) NAV.shift(); }
  cur = id; if (pageOf(id).g !== "hub" && id !== "inicio") { S.last = id; S.seen = S.seen || {}; S.seen[id] = 1; S.recent = [id].concat((S.recent || []).filter(x => x !== id)).slice(0, 6); save(); }
  try { if (location.hash.slice(1) !== id) history.replaceState(null, "", "#" + id); } catch (e) {}
  render();
}
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h && h !== cur && PAGES.find(p => p.id === h)) { cur = h; render(); } });

/* ============ EVENTOS ============ */
function toast(m){ const t = document.getElementById("toast"); t.textContent = m; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2600); }
function collect(id){ const o = {}; C[id].f.forEach(f => { if (f.t === "calcs") { const box = document.getElementById("f-" + id + "-" + f.k); if (box) o[f.k] = [...box.querySelectorAll("input:checked")].map(x => x.value).join(","); return; } const el = document.getElementById("f-" + id + "-" + f.k); if (el) o[f.k] = el.value; }); return o; }
function selectEl(el){ try { const r = document.createRange(); r.selectNodeContents(el); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) {} }
function copyText(el){ const t = el.innerText; const fb = () => { selectEl(el); toast("Texto seleccionado: cópialo con Ctrl+C"); };
  try { navigator.clipboard.writeText(t).then(() => toast("Copiado"), fb); } catch (e) { fb(); } }
function copyRich(el){ const html = '<div style="font-family:Calibri,Arial,sans-serif">' + el.innerHTML.replace(/<button[^>]*>.*?<\/button>/g, "") + "</div>", t = el.innerText;
  try { if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) { navigator.clipboard.write([new ClipboardItem({ "text/html":new Blob([html], { type:"text/html" }), "text/plain":new Blob([t], { type:"text/plain" }) })]).then(() => toast("Copiado con formato"), () => copyText(el)); return; } } catch (e) {}
  copyText(el); }
let busy = false;
document.addEventListener("click", async e => {
  const ab = e.target.closest ? e.target.closest("abbr.ab") : null; if (ab) { showAbbr(ab.dataset.ab); return; }
  const t = e.target.closest ? e.target.closest("[data-go],[data-act],[data-qz]") : null; if (!t) return;
  if (t.dataset.act === "tipclose") { document.getElementById("tip").hidden = true; return; }
  if (t.dataset.go) { e.preventDefault(); go(t.dataset.go, !!t.closest("#app")); return; }
  if (t.dataset.qz != null) { const i = +t.dataset.qz, j = +t.dataset.op; S.quiz = S.quiz || {}; S.quizSel = S.quizSel || {}; if (S.quiz[i] === undefined) { S.quiz[i] = j === QZ[i][3]; S.quizSel[i] = j; save(); render(true); } return; }
  const a = t.dataset.act, id = t.dataset.c;
  if (a === "calc") { S.v[id] = collect(id); S.done[id] = Date.now(); S.snap[id] = JSON.stringify(S.v[id]); save(); render(true); const r = document.getElementById("res"); if (r) r.scrollIntoView({ behavior:"smooth", block:"start" }); }
  else if (a === "ex") { delete S.v[id]; delete S.done[id]; delete S.snap[id]; save(); render(true); toast("Ejemplo cargado"); }
  else if (a === "clr") { const o = {}; C[id].f.forEach(f => o[f.k] = f.t === "sel" ? (typeof f.o === "function" ? "" : f.o[0][0]) : ""); S.v[id] = o; delete S.done[id]; delete S.snap[id]; save(); render(true); }
  else if (a === "undone") { delete S.done[id]; save(); render(true); }
  else if (a === "clrall") { if (t.dataset.sure) { S.done = {}; save(); render(); toast("Resultados quitados"); } else { t.dataset.sure = "1"; t.textContent = "Confirmar: quitar todo"; } }
  else if (a === "copytext") { const el = document.getElementById(t.dataset.t); if (el) copyText(el); }
  else if (a === "copyrich") { const el = document.getElementById(t.dataset.t); if (el) copyRich(el); }
  else if (a === "quizreset") { S.quiz = {}; S.quizSel = {}; save(); render(true); }
  else if (a === "back") goBack();
  else if (a === "toguide") { const g = document.getElementById("guia"); if (g) { g.querySelector("details").open = true; g.scrollIntoView({ behavior:"smooth", block:"start" }); } }
  else if (a === "print") printPage();
  else if (a === "exp") { if (busy) return; busy = true; t.disabled = true; try { await doExport(t.dataset.kind, t.dataset.fmt, id); } finally { busy = false; t.disabled = false; } }
});
document.addEventListener("input", e => {
  const el = e.target;
  if (el.id === "gsearch" || el.id === "gsearch2" || el.id === "gsearch3") { const box = document.getElementById({ gsearch:"gsres", gsearch2:"gsres2", gsearch3:"gsres3" }[el.id]); if (box) box.innerHTML = hitsHTML(searchHits(el.value), el.value); return; }
  if (el.id === "glf") { const q = el.value.toLowerCase().trim(); document.querySelectorAll("#gll dt,#gll dd").forEach(x => { const k = x.dataset.k, dd = x.tagName === "DD" ? x.textContent.toLowerCase() : (x.nextElementSibling ? x.nextElementSibling.textContent.toLowerCase() : ""); x.hidden = q && !(k.includes(q) || dd.includes(q)); }); return; }
  if (el.id === "tfi" || el.id === "tfn") { tfTable(); return; }
  if (el.dataset.malla) return;
  if (el.dataset.pj) { S.proj[el.dataset.pj] = el.value; save(); const d = document.querySelector("#repdoc h1"); if (d && el.dataset.pj === "nombre") d.textContent = el.value || "Proyecto sin nombre"; return; }
  if (el.dataset.c && el.dataset.k) { const id = el.dataset.c; S.v[id] = collect(id); save();
    if (S.done[id] && !document.querySelector("#res .stale")) { const r = document.getElementById("res"); if (r) { const d = document.createElement("div"); d.className = "note stale"; d.innerHTML = '<span>Cambiaste datos después de calcular: este resultado ya no corresponde.</span><button class="btn small" type="button" data-act="calc" data-c="' + id + '">Recalcular</button>'; const sh = r.querySelector(".sechead"); sh.parentNode.insertBefore(d, sh.nextSibling); } } }
});
document.addEventListener("change", e => { const el = e.target;
  if (el.dataset && el.dataset.malla) { S.malla = S.malla || {}; if (el.checked) S.malla[el.dataset.malla] = 1; else delete S.malla[el.dataset.malla]; save(); render(true); return; }
  if (el.dataset && el.dataset.re && el.dataset.c) { const id = el.dataset.c; S.v[id] = collect(id); save(); render(true); } });
document.addEventListener("toggle", e => { const d = e.target; if (!d.dataset || !d.dataset.sgp) return; let closed = null; try { closed = JSON.parse(localStorage.getItem(KEY + "-side2") || "null"); } catch (er) {} if (!closed) closed = Object.keys(GROUPS).filter(g => g !== "malla"); closed = closed.filter(x => x !== d.dataset.sgp); if (!d.open) closed.push(d.dataset.sgp); try { localStorage.setItem(KEY + "-side2", JSON.stringify(closed)); } catch (er) {} }, true);
document.getElementById("backBtn").addEventListener("click", goBack);

/* ============ INICIO ============ */
(function(){ try { icoSprite(); } catch (e) {} const h = location.hash.slice(1); cur = h && PAGES.find(p => p.id === h) ? h : "inicio"; render(); })();
})();
</script>
