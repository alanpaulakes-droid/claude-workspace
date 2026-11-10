import { BANCO_SEC, GENERADORES, rngSemilla, programar, pendientes, notaChilena, mezclar } from "../engine";
import { SECCIONES, DG } from "./estudio.js";

/* ---------- Íconos ---------- */
const IC = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
  repeat:
    '<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  bolt: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>',
  cable: '<circle cx="7" cy="7" r="3"/><circle cx="17" cy="17" r="3"/><path d="M9.5 8.5c4 1 4 6 5 6.5"/>',
  pipe: '<path d="M4 3v9a7 7 0 0 0 7 7h10"/><path d="M8.5 3v9a2.5 2.5 0 0 0 2.5 2.5h10"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M3 9h18M3 15h18M9 3v18"/>',
  ground: '<path d="M12 3v9M5 12h14M8 16h8M10.5 20h3"/>',
  gauge: '<path d="M3.5 18a9 9 0 1 1 17 0"/><path d="M12 15l4.5-5"/><circle cx="12" cy="15.5" r="1.4"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  play: '<path d="M7 4.5v15l12-7.5z"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 15h.01M12 15h.01M15.5 15v3"/>',
};
const ico = (n) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ""}</svg>`;
const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const nf = (v, d = 1) => Number(v).toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d });

/* ---------- Estado ---------- */
const KEY = "cuest-sec-ric-v1";
const ST0 = () => ({ stats: {}, rep: {}, hist: [], dia: {}, racha: 0, best: 0 });
let ST = (() => {
  try {
    return Object.assign(ST0(), JSON.parse(localStorage.getItem(KEY) || "{}"));
  } catch {
    return ST0();
  }
})();
const guardar = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(ST));
  } catch {
    /* almacenamiento no disponible: el cuestionario funciona igual */
  }
};
const TEMA_SEC = {};
SECCIONES.forEach((s) => s.temas.forEach((t) => (TEMA_SEC[t] = s.id)));
const secDe = (t) => TEMA_SEC[t] || "fund";
const GEN_SEC = Object.fromEntries(Object.entries(GENERADORES).map(([k, g]) => [k, secDe(g(rngSemilla(1)).t)]));

/* ---------- Preguntas ---------- */
let semilla = (Date.now() ^ (Math.random() * 1e9)) >>> 0;
const rnd = () => rngSemilla((semilla = (semilla * 1103515245 + 12345) >>> 0));
function deBanco(q) {
  const ord = mezclar(
    q.o.map((_, i) => i),
    (semilla = (semilla * 69069 + 1) >>> 0),
  );
  return {
    key: "b:" + q.id,
    q: q.q,
    o: ord.map((i) => q.o[i]),
    a: ord.indexOf(q.a),
    e: q.e,
    ref: q.ref,
    t: q.t,
    sec: secDe(q.t),
    calc: false,
  };
}
function deGen(k, r) {
  const q = GENERADORES[k](r || rnd());
  return { key: "g:" + k, q: q.q, o: q.o, a: q.a, e: q.e, ref: q.ref, t: q.t, sec: secDe(q.t), calc: true };
}
function armar({ sec = "todas", n = 10, calc = true, seed } = {}) {
  const r = seed != null ? rngSemilla(seed) : rnd();
  const banco = BANCO_SEC.q.filter((q) => sec === "todas" || secDe(q.t) === sec);
  const gens = Object.keys(GENERADORES).filter((k) => sec === "todas" || GEN_SEC[k] === sec);
  const nGen = calc && gens.length ? Math.min(n, Math.max(1, Math.round(n * (banco.length ? 0.35 : 1)))) : 0;
  const nB = Math.min(banco.length, n - nGen);
  const sel = mezclar(banco, Math.floor(r() * 1e9))
    .slice(0, nB)
    .map(deBanco);
  const gsel = [];
  for (let i = 0; i < n - nB && gens.length; i++) gsel.push(deGen(gens[i % gens.length], r));
  return mezclar(sel.concat(gsel), Math.floor(r() * 1e9));
}

/* ---------- Sesión ---------- */
let SES = null,
  tick = 0;
function iniciar(modo, qs, titulo, lim = 0) {
  SES = { modo, qs, titulo, i: 0, ans: {}, t0: Date.now(), lim, fin: false };
  clearInterval(tick);
  if (lim)
    tick = setInterval(() => {
      if (!SES || SES.fin) return clearInterval(tick);
      const el = document.getElementById("reloj");
      if (Date.now() - SES.t0 >= SES.lim) entregar();
      else if (el) el.textContent = restante();
    }, 1000);
  ir("sesion");
}
const restante = () => {
  const r = Math.max(0, SES.lim - (Date.now() - SES.t0));
  return `${Math.floor(r / 6e4)}:${String(Math.floor((r % 6e4) / 1e3)).padStart(2, "0")}`;
};
function registrar(q, ok) {
  const s = (ST.stats[q.sec] = ST.stats[q.sec] || { ok: 0, n: 0 });
  s.n++;
  if (ok) s.ok++;
  if (!ok || ST.rep[q.key]) ST.rep[q.key] = programar(ST.rep[q.key], ok, Date.now());
}
function responder(j) {
  const q = SES.qs[SES.i];
  if (SES.modo !== "simulacro" && SES.ans[SES.i] != null) return;
  SES.ans[SES.i] = j;
  if (SES.modo !== "simulacro") {
    const ok = j === q.a;
    registrar(q, ok);
    ST.racha = ok ? ST.racha + 1 : 0;
    ST.best = Math.max(ST.best, ST.racha);
    guardar();
  }
  pintar();
  if (SES.modo !== "simulacro") document.getElementById("fb")?.focus();
}
function entregar() {
  if (!SES || SES.fin) return;
  SES.fin = true;
  SES.t1 = Date.now();
  clearInterval(tick);
  const ok = SES.qs.filter((q, i) => SES.ans[i] === q.a).length;
  if (SES.modo === "simulacro") {
    SES.qs.forEach((q, i) => registrar(q, SES.ans[i] === q.a));
    ST.hist.push({
      d: Date.now(),
      ok,
      n: SES.qs.length,
      nota: notaChilena(ok, SES.qs.length),
      min: Math.round((SES.t1 - SES.t0) / 6e4),
    });
  }
  if (SES.modo === "dia") ST.dia = { f: hoy(), ok, n: SES.qs.length };
  guardar();
  pintar();
}
const hoy = () => new Date().toISOString().slice(0, 10);

/* ---------- Vistas ---------- */
const TABS = [
  ["inicio", "home", "Inicio"],
  ["estudio", "book", "Estudiar"],
  ["practica", "check", "Practicar"],
  ["simulacro", "timer", "Simulacro"],
  ["repaso", "repeat", "Repaso"],
  ["progreso", "chart", "Progreso"],
];
let vista = "inicio",
  secAbierta = null;
function ir(v, extra) {
  vista = v;
  if (v === "estudio") secAbierta = extra || null;
  try {
    history.replaceState(null, "", "#" + v + (extra ? "-" + extra : ""));
  } catch {
    /* sin historial */
  }
  pintar();
  window.scrollTo({ top: 0 });
}
const pct = (s) => (s && s.n ? Math.round((s.ok / s.n) * 100) : null);
const barra = (p) =>
  `<div class="bar" role="progressbar" aria-valuenow="${p || 0}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p || 0}%"></i></div>`;
const totales = () => Object.values(ST.stats).reduce((a, s) => ({ ok: a.ok + s.ok, n: a.n + s.n }), { ok: 0, n: 0 });

function vInicio() {
  const T0 = totales(),
    due = pendientes(ST.rep, Date.now()).length,
    dia = ST.dia.f === hoy() ? ST.dia : null,
    best = ST.hist.length ? Math.max(...ST.hist.map((h) => h.nota)) : null;
  return `<section class="hero"><p class="eb">Pliegos RIC · SEC Chile · banco ${BANCO_SEC.ver}</p><h1>Cuestionario de certificación <em>SEC</em></h1><p>Instalaciones eléctricas domiciliarias. ${BANCO_SEC.q.length} preguntas basadas en los pliegos RIC N°02, N°03, N°04, N°05, N°06, N°10 y N°19, más ${Object.keys(GENERADORES).length} tipos de ejercicios de cálculo con valores nuevos en cada intento.</p>
  <div class="ha"><button class="hb pri" data-go="dia">${ico("star")} ${dia ? "Desafío de hoy: " + dia.ok + "/" + dia.n : "Desafío del día"}</button><button class="hb" data-go="simulacro">${ico("timer")} Simulacro</button><button class="hb" data-go="estudio">${ico("book")} Estudiar</button></div></section>
  <div class="kpis"><div class="kpi"><span>Respondidas</span><b>${T0.n}</b></div><div class="kpi"><span>Aciertos</span><b>${T0.n ? Math.round((T0.ok / T0.n) * 100) + " %" : "—"}</b></div><div class="kpi ${due ? "warn" : ""}"><span>Para repasar hoy</span><b>${due}</b></div><div class="kpi"><span>Mejor nota</span><b>${best != null ? nf(best) : "—"}</b></div></div>
  <h2 class="sh">Cómo prepararte</h2><div class="cards">
  ${[
    ["estudio", "book", "1 · Estudia", "9 secciones con reglas citadas, tablas y diagramas."],
    ["practica", "check", "2 · Practica por tema", "Corrección inmediata con la explicación y el numeral del pliego."],
    ["repaso", "repeat", "3 · Repasa lo fallado", "Lo que fallas vuelve en 1, 3, 7, 14 y 30 días."],
    ["simulacro", "timer", "4 · Rinde el simulacro", "30 preguntas en 45 minutos con nota de 1,0 a 7,0."],
  ]
    .map(
      ([v, i, t, d]) =>
        `<button class="card cardb" data-go="${v}"><span class="ci">${ico(i)}</span><span><b>${t}</b><small>${d}</small></span></button>`,
    )
    .join("")}</div>`;
}
function vEstudio() {
  if (secAbierta) {
    const s = SECCIONES.find((x) => x.id === secAbierta);
    if (s) {
      const st = pct(ST.stats[s.id]);
      return `<button class="lk" data-go="estudio">← Todas las secciones</button><p class="eb">Sección de estudio</p><h1>${esc(s.t)}</h1><p class="lead">${esc(s.intro)}</p>
      ${s.dg.map((k) => `<figure class="card fig">${DG[k]}</figure>`).join("")}
      <section class="card"><h2>Lo que debes saber</h2><ul class="rules">${s.reglas.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join("")}</ul></section>
      ${s.tabla ? `<section class="card"><h2>Tabla de referencia</h2>${s.tabla}</section>` : ""}
      <section class="card warnc"><h2>Errores frecuentes</h2><ul>${s.errores.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></section>
      <div class="row"><button class="btn pri" data-prac="${s.id}">${ico("play")} Practicar esta sección (10)</button>${st != null ? `<span class="hint">Tu acierto en esta sección: ${st} %</span>` : ""}</div>`;
    }
  }
  return `<p class="eb">Estudiar</p><h1>Secciones de estudio</h1><p class="lead">Resumen normativo con la cita del pliego en cada regla, tablas y diagramas. Al final de cada sección puedes practicar solo ese tema.</p><div class="secs">${SECCIONES.map(
    (s) => {
      const p = pct(ST.stats[s.id]),
        nq =
          BANCO_SEC.q.filter((q) => secDe(q.t) === s.id).length +
          Object.values(GEN_SEC).filter((x) => x === s.id).length;
      return `<button class="card sec" data-sec="${s.id}"><span class="ci">${ico(s.ic)}</span><span class="st"><b>${esc(s.t)}</b><small>${esc(s.intro)}</small>${barra(p)}<small>${p != null ? p + " % de acierto" : "Sin practicar"} · ${nq} tipos de pregunta</small></span></button>`;
    },
  ).join("")}</div>`;
}
function vPractica() {
  return `<p class="eb">Practicar</p><h1>Práctica por tema</h1><p class="lead">Respuesta inmediata con explicación y numeral. Las preguntas y el orden de las alternativas cambian en cada intento; los ejercicios de cálculo usan valores nuevos.</p>
  <section class="card"><div class="grid"><label class="f"><span>Sección</span><select id="psec"><option value="todas">Todas las secciones</option>${SECCIONES.map((s) => `<option value="${s.id}">${esc(s.t)}</option>`).join("")}</select></label>
  <label class="f"><span>Cantidad</span><select id="pn"><option>10</option><option selected>15</option><option>20</option><option>30</option></select></label></div>
  <label class="chk"><input type="checkbox" id="pcalc" checked> Incluir ejercicios de cálculo con valores al azar</label>
  <button class="btn pri" data-go="pgo">${ico("play")} Comenzar práctica</button></section>`;
}
function vSimulacro() {
  const H = ST.hist.slice(-8).reverse();
  return `<p class="eb">Simulacro</p><h1>Simulacro tipo examen</h1><p class="lead">30 preguntas al azar (20 del banco normativo y 10 de cálculo) en 45 minutos. Sin ayudas hasta entregar; al final verás la nota, el detalle por sección y cada explicación.</p>
  <div class="note">Material de práctica basado en el texto de los pliegos RIC. No es el examen oficial de la SEC ni reproduce sus preguntas.</div>
  <button class="btn pri big" data-go="sgo">${ico("timer")} Comenzar simulacro</button>
  ${H.length ? `<section class="card"><h2>Tus últimos simulacros</h2><div class="tw"><table><thead><tr><th>Fecha</th><th>Correctas</th><th>Nota</th><th>Minutos</th></tr></thead><tbody>${H.map((h) => `<tr><td>${new Date(h.d).toLocaleDateString("es-CL")}</td><td>${h.ok}/${h.n}</td><td><b class="${h.nota >= 4 ? "okc" : "badc"}">${nf(h.nota)}</b></td><td>${h.min}</td></tr>`).join("")}</tbody></table></div></section>` : ""}`;
}
function vRepaso() {
  const due = pendientes(ST.rep, Date.now()),
    tot = Object.keys(ST.rep).length,
    dom = Object.values(ST.rep).filter((t) => t.box >= 5).length;
  return `<p class="eb">Repaso espaciado</p><h1>Repasa lo que fallaste</h1><p class="lead">Cada pregunta fallada vuelve al día siguiente; si la aciertas, se espacia a 3, 7, 14 y 30 días. Los ejercicios de cálculo vuelven con valores distintos.</p>
  <div class="kpis"><div class="kpi ${due.length ? "warn" : ""}"><span>Para hoy</span><b>${due.length}</b></div><div class="kpi"><span>En repaso</span><b>${tot}</b></div><div class="kpi"><span>Dominadas</span><b>${dom}</b></div></div>
  ${due.length ? `<button class="btn pri big" data-go="rgo">${ico("repeat")} Repasar ahora (${Math.min(20, due.length)})</button>` : `<div class="note ok">${tot ? "Estás al día con el repaso." : "Aún no hay preguntas para repasar: practica o rinde un simulacro."}</div>`}`;
}
function vProgreso() {
  const T0 = totales();
  return `<p class="eb">Progreso</p><h1>Tu avance</h1><div class="kpis"><div class="kpi"><span>Respondidas</span><b>${T0.n}</b></div><div class="kpi"><span>Acierto global</span><b>${T0.n ? Math.round((T0.ok / T0.n) * 100) + " %" : "—"}</b></div><div class="kpi"><span>Mejor racha</span><b>${ST.best}</b></div><div class="kpi"><span>Simulacros</span><b>${ST.hist.length}</b></div></div>
  <section class="card"><h2>Acierto por sección</h2>${SECCIONES.map((s) => {
    const st = ST.stats[s.id],
      p = pct(st);
    return `<div class="prow"><span>${esc(s.t)}</span>${barra(p)}<small>${p != null ? `${p} % · ${st.ok}/${st.n}` : "—"}</small>${p != null && p < 70 ? `<button class="lk" data-sec="${s.id}">Estudiar</button>` : ""}</div>`;
  }).join("")}</section>
  <button class="btn ghost" id="reset">Borrar mi progreso</button><p class="hint" id="resetmsg" role="status"></p>`;
}
function vSesion() {
  const S2 = SES;
  if (!S2) return vInicio();
  if (S2.fin) return vResultado();
  const q = S2.qs[S2.i],
    a = S2.ans[S2.i],
    sim = S2.modo === "simulacro",
    resp = a != null && !sim,
    respondidas = Object.keys(S2.ans).length;
  return `<div class="sesh"><div class="sesi"><p class="eb">${esc(S2.titulo)}</p><div class="sesm"><b>Pregunta ${S2.i + 1} de ${S2.qs.length}</b>${q.calc ? '<span class="tag">Cálculo</span>' : ""}<span class="tag sec">${esc(SECCIONES.find((s) => s.id === q.sec)?.t || "")}</span></div></div><div class="sesr">${S2.lim ? `<span class="reloj" aria-live="off">${ico("timer")} <span id="reloj">${restante()}</span></span>` : ""}<button class="lk" data-go="salir">Salir</button></div></div>${barra(Math.round(((sim ? respondidas : S2.i) / S2.qs.length) * 100))}
  <section class="card qcard"><h2 class="q">${esc(q.q)}</h2><div class="ops" role="radiogroup" aria-label="Alternativas">${q.o
    .map((o, j) => {
      const cls = resp ? (j === q.a ? "ok" : j === a ? "bad" : "") : sim && a === j ? "sel" : "";
      return `<button class="op ${cls}" data-op="${j}" role="radio" aria-checked="${a === j}" ${resp ? "disabled" : ""}><span class="ol">${"ABCD"[j]}</span><span>${esc(o)}</span></button>`;
    })
    .join("")}</div>
  ${resp ? `<div id="fb" tabindex="-1" class="fb ${a === q.a ? "ok" : "bad"}"><b>${a === q.a ? "✓ Correcto" : "✗ Incorrecto · la respuesta es " + "ABCD"[q.a] + ": " + esc(q.o[q.a])}</b><p>${esc(q.e)}</p><small>${esc(q.ref)}</small></div>` : ""}
  <div class="row">${sim && S2.i > 0 ? `<button class="btn ghost" data-go="prev">← Anterior</button>` : ""}${resp || sim ? `<button class="btn pri" data-go="next">${S2.i + 1 < S2.qs.length ? "Siguiente →" : sim ? "Entregar" : "Ver resultado"}</button>` : `<span class="hint">Elige una alternativa (teclas 1 a 4).</span>`}${sim ? `<button class="btn ghost" data-go="entregar">Entregar (${respondidas}/${S2.qs.length})</button>` : ""}</div></section>
  ${!sim ? `<p class="hint">Racha actual: ${ST.racha} · mejor: ${ST.best}</p>` : ""}`;
}
function vResultado() {
  const S2 = SES,
    R = S2.qs.map((q, i) => ({ q, a: S2.ans[i], ok: S2.ans[i] === q.a })),
    ok = R.filter((r) => r.ok).length,
    nota = notaChilena(ok, R.length);
  const porSec = {};
  R.forEach((r) => {
    const x = (porSec[r.q.sec] = porSec[r.q.sec] || { ok: 0, n: 0 });
    x.n++;
    if (r.ok) x.ok++;
  });
  return `<p class="eb">${esc(S2.titulo)} · resultado</p><h1>${ok} de ${R.length} correctas</h1>
  <div class="kpis"><div class="kpi ${nota >= 4 ? "ok" : "bad"}"><span>Nota (60 % de exigencia)</span><b>${nf(nota)}</b></div><div class="kpi"><span>Acierto</span><b>${Math.round((ok / R.length) * 100)} %</b></div><div class="kpi"><span>Tiempo</span><b>${Math.max(1, Math.round((S2.t1 - S2.t0) / 6e4))} min</b></div></div>
  <section class="card"><h2>Por sección</h2>${Object.entries(porSec)
    .map(
      ([k, x]) =>
        `<div class="prow"><span>${esc(SECCIONES.find((s) => s.id === k)?.t || k)}</span>${barra(Math.round((x.ok / x.n) * 100))}<small>${x.ok}/${x.n}</small></div>`,
    )
    .join("")}</section>
  <section class="card"><h2>Revisión</h2><ol class="rev">${R.map((r) => `<li class="${r.ok ? "ok" : "bad"}"><b>${esc(r.q.q)}</b><span>${r.ok ? "✓" : "✗ Tu respuesta: " + (r.a != null ? esc(r.q.o[r.a]) : "sin responder") + " ·"} Correcta: <b>${esc(r.q.o[r.q.a])}</b></span><small>${esc(r.q.e)} · ${esc(r.q.ref)}</small></li>`).join("")}</ol></section>
  <div class="row"><button class="btn pri" data-go="${S2.modo === "simulacro" ? "sgo" : "practica"}">${S2.modo === "simulacro" ? "Nuevo simulacro" : "Seguir practicando"}</button><button class="btn ghost" data-go="inicio">Inicio</button></div>`;
}

/* ---------- Pintado y eventos ---------- */
function pintar() {
  const v =
    vista === "sesion"
      ? vSesion()
      : vista === "estudio"
        ? vEstudio()
        : vista === "practica"
          ? vPractica()
          : vista === "simulacro"
            ? vSimulacro()
            : vista === "repaso"
              ? vRepaso()
              : vista === "progreso"
                ? vProgreso()
                : vInicio();
  document.getElementById("main").innerHTML = v;
  const act =
    vista === "sesion"
      ? SES?.modo === "simulacro"
        ? "simulacro"
        : SES?.modo === "repaso"
          ? "repaso"
          : "practica"
      : vista;
  document.getElementById("tabs").innerHTML = TABS.map(
    ([k, i, t]) =>
      `<button data-go="${k}" ${act === k ? 'aria-current="page"' : ""}>${ico(i)}<span>${t}</span></button>`,
  ).join("");
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-go],[data-op],[data-sec],[data-prac],#reset");
  if (!b) return;
  if (b.id === "reset") {
    if (b.dataset.ok !== "1") {
      b.dataset.ok = "1";
      b.textContent = "¿Seguro? Toca otra vez para borrar";
      return;
    }
    ST = ST0();
    guardar();
    pintar();
    return;
  }
  if (b.dataset.op != null) return responder(+b.dataset.op);
  if (b.dataset.sec) return ir("estudio", b.dataset.sec);
  if (b.dataset.prac)
    return iniciar(
      "practica",
      armar({ sec: b.dataset.prac, n: 10 }),
      "Práctica · " + SECCIONES.find((s) => s.id === b.dataset.prac).t,
    );
  const g = b.dataset.go;
  if (g === "pgo") {
    const sec = document.getElementById("psec").value;
    return iniciar(
      "practica",
      armar({ sec, n: +document.getElementById("pn").value, calc: document.getElementById("pcalc").checked }),
      "Práctica · " + (sec === "todas" ? "todas las secciones" : SECCIONES.find((s) => s.id === sec).t),
    );
  }
  if (g === "sgo") {
    const r = rnd(),
      banco = mezclar(BANCO_SEC.q, Math.floor(r() * 1e9))
        .slice(0, 20)
        .map(deBanco),
      gk = mezclar(Object.keys(GENERADORES), Math.floor(r() * 1e9))
        .slice(0, 10)
        .map((k) => deGen(k, r));
    return iniciar("simulacro", mezclar(banco.concat(gk), Math.floor(r() * 1e9)), "Simulacro tipo examen", 45 * 6e4);
  }
  if (g === "dia") {
    const d = hoy(),
      seed = +d.replace(/-/g, "");
    return iniciar("dia", armar({ n: 8, seed }), "Desafío del día · " + new Date().toLocaleDateString("es-CL"));
  }
  if (g === "rgo") {
    const ks = pendientes(ST.rep, Date.now()).slice(0, 20);
    const qs = ks
      .map((k) => {
        if (k.startsWith("b:")) {
          const q = BANCO_SEC.q.find((x) => x.id === k.slice(2));
          return q && deBanco(q);
        }
        return GENERADORES[k.slice(2)] ? deGen(k.slice(2)) : null;
      })
      .filter(Boolean);
    return iniciar("repaso", qs, "Repaso de hoy");
  }
  if (g === "next") {
    if (SES.i + 1 < SES.qs.length) {
      SES.i++;
      pintar();
    } else entregar();
    return;
  }
  if (g === "prev") {
    SES.i = Math.max(0, SES.i - 1);
    return pintar();
  }
  if (g === "entregar") {
    const falta = SES.qs.length - Object.keys(SES.ans).length;
    if (falta && b.dataset.ok !== "1") {
      b.dataset.ok = "1";
      b.textContent = `Quedan ${falta} sin responder · toca otra vez para entregar`;
      return;
    }
    return entregar();
  }
  if (g === "salir") {
    if (SES && !SES.fin && Object.keys(SES.ans).length && b.dataset.ok !== "1") {
      b.dataset.ok = "1";
      b.textContent = "¿Salir? Se pierde lo respondido";
      return;
    }
    clearInterval(tick);
    SES = null;
    return ir("inicio");
  }
  if (g === "estudio") return ir("estudio");
  ir(g);
});
document.addEventListener("keydown", (e) => {
  if (vista !== "sesion" || !SES || SES.fin || e.target.closest("input,select,textarea")) return;
  if (/^[1-4]$/.test(e.key)) responder(+e.key - 1);
  else if (e.key === "Enter" && (SES.ans[SES.i] != null || SES.modo === "simulacro") && !e.target.closest("button")) {
    if (SES.i + 1 < SES.qs.length) {
      SES.i++;
      pintar();
    } else entregar();
  }
});
document.documentElement.lang = "es";
function desdeHash() {
  const h = (location.hash || "").slice(1),
    [v, ...r] = h.split("-"),
    x = r.join("-");
  if (["estudio", "practica", "simulacro", "repaso", "progreso", "inicio"].includes(v) && vista !== "sesion") {
    vista = v;
    secAbierta = v === "estudio" && SECCIONES.some((s) => s.id === x) ? x : null;
  }
}
window.addEventListener("hashchange", () => {
  desdeHash();
  pintar();
});
desdeHash();
pintar();
window.CUEST = { armar, GENERADORES, BANCO_SEC };
