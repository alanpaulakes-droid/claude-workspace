/* ============ CURSO INTERACTIVO: vista por pestañas, StepPlayer, SimulationFrame y búsqueda difusa ============
   Un tema con entrada en CRS[id] se muestra como curso:
     «Lo esencial» arriba y seis pestañas: Concepto | Fórmula paso a paso | Ejemplo | Simulación | Práctica | Resumen.
   El contenido que ya tenía el tema no se borra: sus secciones se reubican en la pestaña que corresponde.
   CRS[id] = {
     ess:{ pts:[…], fx:"fórmula principal", when:"cuándo usarla" },
     intro:{ prob, anal, terms:[[término, definición]] },              → Concepto
     adv:"html"                                                         → Concepto (desplegable «Nivel avanzado»)
     sp:{ title, params:[{k,l,v,u,step}], script:p => [{e, h, s, t}] }, → Fórmula (StepPlayer)
     vars:[[símbolo, significado, unidad, rango típico]],                → Fórmula
     sup:"html"                                                         → Fórmula (desplegable «Supuestos y limitaciones»)
     ex:{ t, steps:[[qué hago, por qué, qué obtengo, cómo lo interpreto]], r }  → Ejemplo
     real:"html"                                                        → Ejemplo (desplegable «Caso real»)
     sim:"id de CSIM"                                                   → Simulación
     quiz:[[pregunta, [opciones], índice correcto, explicación]]       → Práctica (+ la calculadora como «Hazlo tú»)
     dec:"decisión que permite tomar", pre:[ids], rel:[ids], kw:"sinónimos para el buscador"  → Resumen
   } */
const CRS = {}, CSIM = {};
const CRS_TABS = [["con", "Concepto"], ["fx", "Fórmula paso a paso"], ["ej", "Ejemplo"], ["sim", "Simulación"], ["pr", "Práctica"], ["res", "Resumen"]];
const crsEsc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
const crsReduce = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
const crsNum = (x, d) => { if (!isFinite(x)) return "—"; d = d == null ? 0 : d; const neg = x < 0; let [e, f] = Math.abs(x).toFixed(d).split("."); e = e.replace(/\B(?=(\d{3})+(?!\d))/g, "."); return (neg ? "−" : "") + e + (f ? "," + f : ""); };
function crsTabOf(id){ const h = location.hash.slice(1).split("/"); if (h[0] === id && CRS_TABS.some(t => t[0] === h[1])) return h[1];
  try { const t = S.ctab && S.ctab[id]; if (CRS_TABS.some(x => x[0] === t)) return t; } catch (e) {} return "con"; }
function crsSetTab(root, tab, push){ const box = root.querySelector(".crs"); if (!box) return; const id = box.dataset.crs;
  box.querySelectorAll('[role="tab"]').forEach(b => { const on = b.dataset.tab === tab; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
  box.querySelectorAll('[role="tabpanel"]').forEach(p => { p.hidden = p.dataset.tab !== tab; });
  try { S.ctab = S.ctab || {}; S.ctab[id] = tab; save(); } catch (e) {}
  try { const h = "#" + id + (tab === "con" ? "" : "/" + tab); if (location.hash !== h) history.replaceState(null, "", h); } catch (e) {}
  const pnl = box.querySelector('[role="tabpanel"][data-tab="' + tab + '"]'); if (pnl) { simWake(pnl); spWake(pnl); }
  if (push) { const nav = box.querySelector(".crs-tabs"); if (nav && nav.getBoundingClientRect().top < 0) nav.scrollIntoView({ block:"start" }); }
  try { if (typeof tocBuild === "function") setTimeout(() => tocBuild(root), 0); } catch (e) {} }

/* ---------- armado de la vista de curso (sobre el HTML ya armado por la plantilla) ---------- */
function crsHTML(id, html){ if (window.__noT8 || !CRS[id]) return html; const K = CRS[id];
  const T = document.createElement("template"); T.innerHTML = html; const R = T.content;
  const sec = k => R.querySelector("#t8-" + k), take = el => { if (el && el.parentNode) el.parentNode.removeChild(el); return el; };
  const acc = (t, body, open) => body ? '<details class="item crs-acc"' + (open ? " open" : "") + "><summary>" + t + '</summary><div class="body prose">' + body + "</div></details>" : "";
  const P = {}; CRS_TABS.forEach(t => { P[t[0]] = document.createElement("div"); P[t[0]].className = "crs-p"; P[t[0]].setAttribute("role", "tabpanel"); P[t[0]].dataset.tab = t[0]; P[t[0]].id = "crs-p-" + t[0]; P[t[0]].setAttribute("aria-labelledby", "crs-t-" + t[0]); P[t[0]].tabIndex = 0; });
  const add = (k, h) => { if (h) P[k].insertAdjacentHTML("beforeend", h); }, mv = (k, el) => { if (el) P[k].appendChild(take(el)); };
  /* Concepto */
  if (K.intro) add("con", '<section class="crs-s"><h2>El problema que resuelve</h2>' + K.intro.prob + (K.intro.anal ? '<div class="crs-anal"><p class="x-h">Una comparación para entenderlo</p>' + K.intro.anal + "</div>" : "") +
    (K.intro.terms ? '<p class="x-h">Términos que debes conocer</p><dl class="deep-dl">' + K.intro.terms.map(t => "<dt>" + t[0] + "</dt><dd>" + t[1] + "</dd>").join("") + "</dl>" : "") + "</section>");
  mv("con", sec("def")); mv("con", sec("con"));
  add("con", acc("Nivel avanzado", K.adv));
  /* Fórmula paso a paso */
  if (K.sp) add("fx", '<section class="crs-s"><h2>' + (K.sp.title || "La fórmula, paso a paso") + '</h2><div class="sp" data-sp="' + id + '"></div></section>');
  if (K.vars) add("fx", '<section class="crs-s"><h2>Qué significa cada letra</h2><div class="tbl-wrap"><table class="crs-vars"><thead><tr><th>Símbolo</th><th>Significado</th><th>Unidad</th><th>Rango típico</th></tr></thead><tbody>' +
    K.vars.map(v => '<tr><td class="crs-sym">' + v[0] + "</td><td>" + v[1] + "</td><td>" + (v[2] || "—") + "</td><td>" + (v[3] || "—") + "</td></tr>").join("") + "</tbody></table></div></section>");
  mv("fx", sec("fx")); mv("fx", sec("met"));
  add("fx", acc("Supuestos y limitaciones", K.sup));
  { const e = sec("err"); if (e) { const d = document.createElement("details"); d.className = "item crs-acc"; d.innerHTML = "<summary>Errores frecuentes</summary>"; const b = document.createElement("div"); b.className = "body"; d.appendChild(b); [...take(e).children].forEach(c => { if (!c.classList.contains("t8-h")) b.appendChild(c); }); P.fx.appendChild(d); } }
  /* Ejemplo */
  if (K.ex) add("ej", '<section class="crs-s"><h2>Ejemplo guiado</h2><p class="x-case">' + K.ex.t + '</p><ol class="crs-ex">' +
    K.ex.steps.map(s => '<li><p class="crs-ex-a"><span>Qué hago</span>' + s[0] + '</p><p><span>Por qué</span>' + s[1] + '</p><p><span>Qué obtengo</span>' + s[2] + '</p><p><span>Qué significa para el negocio</span>' + s[3] + "</p></li>").join("") + '</ol><p class="x-r"><b>Conclusión:</b> ' + K.ex.r + "</p></section>");
  mv("ej", sec("ej"));
  add("ej", acc("Caso real", K.real));
  /* Simulación */
  if (K.sim && CSIM[K.sim]) add("sim", '<div class="csim" data-csim="' + K.sim + '"></div>'); else add("sim", '<p class="hint">La simulación de este tema se agrega en una próxima fase.</p>');
  /* Práctica */
  if (K.quiz) add("pr", '<section class="crs-s"><h2>Ponte a prueba</h2>' + K.quiz.map((q, i) => '<fieldset class="cq crs-q" data-ok="' + q[2] + '"><legend><span class="cq-n">Pregunta ' + (i + 1) + "</span></legend><div class=\"cq-t\">" + q[0] + "</div>" +
    q[1].map((o, j) => '<label class="cq-o"><input type="radio" name="crsq-' + id + "-" + i + '" value="' + j + '"><span><b>' + "abcd"[j] + ")</b> " + o + "</span></label>").join("") + '<div class="cq-sol" hidden><p class="cq-dh">Explicación</p><p>' + q[3] + "</p></div></fieldset>").join("") + "</section>");
  /* la calculadora queda siempre visible bajo las pestañas (para usarla rápido, sin cambiar de pestaña) */
  const calcF = R.querySelector("section.card.form"), calcR = R.querySelector("section#res"), calc = document.createElement("section"); calc.className = "crs-calc"; calc.id = "crs-calc";
  if (calcF || calcR) { calc.innerHTML = '<h2 class="crs-try">Calculadora: hazlo tú con tus datos</h2><p class="hint">Cambia los datos de entrada y presiona «Calcular». El desarrollo paso a paso aparece en el resultado.</p>'; if (calcF) calc.appendChild(take(calcF)); if (calcR) calc.appendChild(take(calcR));
    add("pr", '<p class="crs-go"><button type="button" class="btn ghost" data-crs-calc="1">Ir a la calculadora con tus propios datos ↓</button></p>'); }
  mv("pr", sec("ejer"));
  /* Resumen */
  { const chips = a => (a || []).filter(x => PAGES.some(p => p.id === x)).map(x => '<button type="button" class="chip" data-go="' + x + '">' + crsEsc(pageOf(x).t) + "</button>").join("");
    add("res", '<section class="crs-s"><h2>Lo esencial</h2><ul class="crs-pts">' + (K.ess ? K.ess.pts.map(p => "<li>" + p + "</li>").join("") : "") + "</ul>" +
      (K.dec ? '<p class="x-h">Qué decisión te permite tomar</p><p>' + K.dec + "</p>" : "") +
      (K.pre && K.pre.length ? '<p class="x-h">Antes de este tema conviene saber</p><div class="quick">' + chips(K.pre) + "</div>" : "") +
      (K.rel && K.rel.length ? '<p class="x-h">Temas relacionados</p><div class="quick">' + chips(K.rel) + "</div>" : "") + "</section>"); }
  mv("res", sec("fic"));
  /* lo que quede de la guía (#guia) va al final del Concepto; la navegación antigua por secciones ya no aplica */
  const g = R.querySelector("#guia"); if (g) { g.querySelectorAll(":scope > .sechead, :scope > p.hint").forEach(x => x.remove()); const nav = g.querySelector(".t8-nav"); if (nav) nav.remove(); mv("con", g); }
  /* tarjeta «Lo esencial» + pestañas, justo después del título */
  const box = document.createElement("div"); box.className = "crs"; box.dataset.crs = id;
  const E = K.ess;
  box.innerHTML = (E ? '<aside class="crs-ess" aria-label="Lo esencial"><p class="crs-ess-h">Lo esencial</p><ul>' + E.pts.map(p => "<li>" + p + "</li>").join("") + '</ul><p class="crs-ess-fx" tabindex="0" role="group" aria-label="Fórmula clave">' + E.fx + "</p>" + (E.when ? '<p class="crs-ess-w"><b>Cuándo usarla:</b> ' + E.when + "</p>" : "") + ((calcF || calcR) ? '<p class="crs-ess-b no-print"><button type="button" class="btn ghost small" data-crs-calc="1">Calcular con mis datos ↓</button></p>' : "") + "</aside>" : "") +
    '<div class="crs-tabs no-print" role="tablist" aria-label="Partes del tema">' + CRS_TABS.map(t => '<button type="button" role="tab" id="crs-t-' + t[0] + '" aria-controls="crs-p-' + t[0] + '" data-tab="' + t[0] + '" aria-selected="false" tabindex="-1">' + t[1] + "</button>").join("") + "</div>";
  CRS_TABS.forEach(t => box.appendChild(P[t[0]]));
  if (calc.childNodes.length) box.appendChild(calc);
  const anchor = R.querySelector("p.lead"); const after = anchor && anchor.nextElementSibling && anchor.nextElementSibling.matches("p.hint") ? anchor.nextElementSibling : anchor;
  if (after && after.parentNode) after.parentNode.insertBefore(box, after.nextSibling); else R.prepend(box);
  return T.innerHTML; }

function crsAfter(root){ const box = root.querySelector(".crs"); if (!box) return; const id = box.dataset.crs; crsSetTab(root, crsTabOf(id), false);
  box.querySelectorAll(".sp[data-sp]").forEach(el => spMount(el, CRS[el.dataset.sp].sp));
  box.querySelectorAll(".csim[data-csim]").forEach(el => simMount(el, CSIM[el.dataset.csim])); }

/* pestañas: clic y teclado (flechas, Inicio, Fin) */
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest('.crs [role="tab"]'); if (!b) return; crsSetTab(document.getElementById("app"), b.dataset.tab, true); });
document.addEventListener("keydown", e => { const b = e.target.closest && e.target.closest('.crs [role="tab"]'); if (!b) return; const all = [...b.parentNode.children], i = all.indexOf(b);
  const j = e.key === "ArrowRight" ? (i + 1) % all.length : e.key === "ArrowLeft" ? (i - 1 + all.length) % all.length : e.key === "Home" ? 0 : e.key === "End" ? all.length - 1 : -1;
  if (j < 0) return; e.preventDefault(); all[j].focus(); crsSetTab(document.getElementById("app"), all[j].dataset.tab, false); });
/* un enlace a una sección (búsqueda, índice) abre primero la pestaña que la contiene */
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-t8ref]"); if (!b) return; const h = document.getElementById(b.dataset.t8ref); const p = h && h.closest('.crs [role="tabpanel"]'); if (p && p.hidden) crsSetTab(document.getElementById("app"), p.dataset.tab, false); }, true);
window.addEventListener("hashchange", () => { const [h, t] = location.hash.slice(1).split("/"); const box = document.querySelector(".crs"); if (box && box.dataset.crs === h && t) crsSetTab(document.getElementById("app"), t, false); });
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-crs-calc]"); if (!b) return; const c = document.getElementById("crs-calc"); if (c) c.scrollIntoView({ block:"start", behavior:crsReduce() ? "auto" : "smooth" }); });
/* práctica: al elegir una opción se corrige y se explica */
document.addEventListener("change", e => { const r = e.target; if (!r.matches || !r.matches(".crs-q input[type=radio]")) return; const fs = r.closest(".crs-q"), ok = +fs.dataset.ok, v = +r.value;
  fs.classList.remove("ok", "bad"); fs.classList.add(v === ok ? "ok" : "bad"); fs.querySelectorAll(".cq-o").forEach((l, j) => { l.classList.toggle("is-ok", j === ok); l.classList.toggle("is-bad", j === v && v !== ok); });
  const s = fs.querySelector(".cq-sol"); s.hidden = false; s.firstElementChild.textContent = v === ok ? "Correcto. Por qué:" : "No es esa. La respuesta es " + "abcd"[ok] + "). Por qué:"; });
/* al imprimir se muestran todas las pestañas */
window.addEventListener("beforeprint", () => document.querySelectorAll('.crs [role="tabpanel"]').forEach(p => { p.dataset.wasHidden = p.hidden ? "1" : ""; p.hidden = false; }));
window.addEventListener("afterprint", () => document.querySelectorAll('.crs [role="tabpanel"]').forEach(p => { if (p.dataset.wasHidden) p.hidden = true; }));

/* ============ StepPlayer: el cálculo se desarrolla como en una pizarra ============
   Guion: [{ e:"expresión", h:"parte resaltada", s:"narración", t:"transformación" }]. Controles: ⏮ ▶/⏸ ⏭ ↺, velocidad, barra con marcas, teclado. */
const SP = new WeakMap();
const spMark = (e, h) => { const x = crsEsc(e); if (!h) return x; const k = x.indexOf(crsEsc(h)); return k < 0 ? x : x.slice(0, k) + '<mark class="sp-hi">' + crsEsc(h) + "</mark>" + x.slice(k + crsEsc(h).length); };
function spMount(el, def){ if (!def || SP.has(el)) return; const st = { def, p:{}, steps:[], i:0, play:false, rate:1, t:null };
  (def.params || []).forEach(q => st.p[q.k] = q.v);
  el.innerHTML = '<div class="sp-board" aria-live="polite"></div><p class="sp-say"></p>' +
    '<div class="sp-bar" role="group" aria-label="Pasos"></div>' +
    '<div class="sp-ctl no-print"><button type="button" class="btn ghost small" data-sp="first" aria-label="Al inicio">⏮</button><button type="button" class="btn ghost small" data-sp="prev" aria-label="Paso anterior">◀</button><button type="button" class="btn small sp-pp" data-sp="play" aria-label="Reproducir">▶ Reproducir</button><button type="button" class="btn ghost small" data-sp="next" aria-label="Paso siguiente">▶︎▶︎</button><button type="button" class="btn ghost small" data-sp="reset" aria-label="Reiniciar">↺</button>' +
    '<label class="sp-rate">Velocidad <select data-sp="rate"><option value="0.5">0,5×</option><option value="0.75">0,75×</option><option value="1" selected>1×</option><option value="1.5">1,5×</option><option value="2">2×</option></select></label><span class="sp-pos" aria-live="off"></span></div>' +
    (def.params && def.params.length ? '<details class="item crs-acc sp-try"><summary>Hazlo tú: cambia los datos y mira el cálculo de nuevo</summary><div class="body"><div class="sp-in">' + def.params.map(q => '<label>' + q.l + ' <span class="unit">' + (q.u || "") + '</span><input type="number" inputmode="decimal" step="' + (q.step || "any") + '" data-spk="' + q.k + '" value="' + q.v + '"></label>').join("") + '</div><p class="hint">El guion se recalcula con tus datos. Usa números positivos.</p></div></details>' : "");
  el.tabIndex = -1; SP.set(el, st); spBuild(el); }
function spBuild(el){ const st = SP.get(el); let steps = []; try { steps = st.def.script(st.p) || []; } catch (e) { steps = [{ e:"Revisa los datos", s:"Algún dato no es válido: " + e.message }]; }
  st.steps = steps; st.i = Math.min(st.i, steps.length - 1); if (st.i < 0) st.i = 0;
  el.querySelector(".sp-bar").innerHTML = steps.map((s, i) => '<button type="button" class="sp-dot" data-sp="go" data-i="' + i + '" aria-label="Paso ' + (i + 1) + ": " + crsEsc(s.t || "") + '" title="' + crsEsc(s.t || "Paso " + (i + 1)) + '"></button>').join("");
  spShow(el, false); }
function spShow(el, anim){ const st = SP.get(el), s = st.steps[st.i] || {}, board = el.querySelector(".sp-board");
  board.innerHTML = st.steps.slice(0, st.i + 1).map((x, k) => '<div class="sp-l' + (k === st.i ? " now" + (anim && !crsReduce() ? " in" : "") : "") + '">' + (x.t ? '<span class="sp-t">' + crsEsc(x.t) + "</span>" : "") + '<span class="sp-x">' + spMark(x.e, k === st.i ? x.h : "") + "</span></div>").join("");
  const now = board.querySelector(".now"); if (now && anim) { const r = now.getBoundingClientRect(), b = board.getBoundingClientRect(); if (r.bottom > b.bottom || r.top < b.top) board.scrollTop = now.offsetTop - board.clientHeight + now.offsetHeight + 8; }
  el.querySelector(".sp-say").innerHTML = s.s || "";
  el.querySelectorAll(".sp-dot").forEach((d, k) => { d.classList.toggle("done", k < st.i); d.classList.toggle("on", k === st.i); });
  el.querySelector(".sp-pos").textContent = "Paso " + (st.i + 1) + " de " + st.steps.length; }
function spTimer(el){ const st = SP.get(el); clearTimeout(st.t); if (!st.play) return; const s = st.steps[st.i] || {};
  const ms = (1300 + String(s.s || "").replace(/<[^>]+>/g, "").length * 32) / st.rate;
  st.t = setTimeout(() => { if (!el.isConnected) return; if (st.i < st.steps.length - 1) { st.i++; spShow(el, true); spTimer(el); } else spPlay(el, false); }, ms); }
function spPlay(el, on){ const st = SP.get(el); st.play = on; const b = el.querySelector(".sp-pp"); b.textContent = on ? "⏸ Pausa" : "▶ Reproducir"; b.setAttribute("aria-label", on ? "Pausa" : "Reproducir");
  if (on && st.i >= st.steps.length - 1) { st.i = 0; spShow(el, true); } spTimer(el); }
function spWake(){ }
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest(".sp [data-sp]"); if (!b || b.tagName === "SELECT") return; const el = b.closest(".sp"), st = SP.get(el); if (!st) return; const a = b.dataset.sp;
  if (a === "play") return spPlay(el, !st.play);
  if (a === "next" && st.i < st.steps.length - 1) st.i++; else if (a === "prev" && st.i > 0) st.i--; else if (a === "first") st.i = 0; else if (a === "reset") { st.i = 0; spPlay(el, false); } else if (a === "go") st.i = +b.dataset.i;
  spShow(el, true); spTimer(el); });
document.addEventListener("change", e => { const t = e.target; const el = t.closest && t.closest(".sp"); if (!el || !SP.get(el)) return; const st = SP.get(el);
  if (t.dataset.sp === "rate") { st.rate = +t.value || 1; spTimer(el); }
  if (t.dataset.spk) { const v = parseFloat(String(t.value).replace(",", ".")); if (isFinite(v) && v > 0) { st.p[t.dataset.spk] = v; t.classList.remove("gd-bad"); spBuild(el); } else t.classList.add("gd-bad"); } });
document.addEventListener("keydown", e => { const el = e.target.closest && e.target.closest(".sp"); if (!el || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return; const st = SP.get(el); if (!st) return;
  if (e.key === " " || e.key === "k") { e.preventDefault(); spPlay(el, !st.play); } else if (e.key === "ArrowRight") { if (st.i < st.steps.length - 1) { st.i++; spShow(el, true); } e.preventDefault(); } else if (e.key === "ArrowLeft") { if (st.i > 0) { st.i--; spShow(el, true); } e.preventDefault(); } else if (e.key === "Home") { st.i = 0; spShow(el, true); e.preventDefault(); } });

/* ============ SimulationFrame: Objetivo | Lienzo | Parámetros | Métricas en vivo | Conclusión ============
   CSIM[id] = { title, goal, params:[{k,l,min,max,step,v,u,help,fmt}], init(p), tick(st,p,dt), draw(g,W,H,st,p,C), metrics(st,p)→[[l,v]], ann(st,p)→texto, concl(st,p)→html, h } */
const SIMST = new WeakMap(); let SIMIO = null;
const simColors = () => { const cs = getComputedStyle(document.documentElement), v = n => cs.getPropertyValue(n).trim();
  return { ink:v("--ink"), muted:v("--muted"), line:v("--line"), surf:v("--surface"), bg:v("--surface2"), c1:v("--cat-1") || v("--blue"), c2:v("--cat-2"), c3:v("--cat-3"), c4:v("--cat-4"), c5:v("--cat-5"), bad:v("--bad"), ok:v("--ok"), font:getComputedStyle(document.body).fontFamily }; };
function simMount(el, def){ if (!def || SIMST.has(el)) return; const p = {}; def.params.forEach(q => p[q.k] = q.v);
  el.innerHTML = '<p class="csim-goal"><b>Al terminar entenderás:</b> ' + def.goal + '</p><div class="csim-main"><div class="csim-cv"><canvas role="img" aria-label="' + crsEsc(def.title) + '"></canvas><p class="csim-ann" aria-live="polite"></p></div>' +
    '<div class="csim-side"><p class="x-h">Parámetros</p>' + def.params.map(q => '<div class="csim-pr"><label for="sim-' + q.k + '">' + q.l + ' <output data-o="' + q.k + '"></output></label><input id="sim-' + q.k + '" type="range" min="' + q.min + '" max="' + q.max + '" step="' + q.step + '" value="' + q.v + '" data-k="' + q.k + '"><small>' + (q.help || "") + "</small></div>").join("") +
    '<p class="x-h">Métricas en vivo</p><dl class="csim-m"></dl></div></div>' +
    '<div class="csim-ctl no-print"><button type="button" class="btn small" data-csimc="play">⏸ Pausa</button><button type="button" class="btn ghost small" data-csimc="reset">↺ Reiniciar</button><label class="sp-rate">Velocidad <select data-csimc="rate"><option value="0.5">0,5×</option><option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option></select></label></div>' +
    '<div class="csim-concl"><p class="x-h">Conclusión</p><div class="csim-cc"></div></div>';
  const st = { def, p, s:def.init(p), run:!crsReduce(), rate:1, last:0, vis:false, raf:0, cv:el.querySelector("canvas"), C:simColors(), uiT:0 };
  SIMST.set(el, st); simOut(el); simDraw(el); simUi(el, true);
  if (!st.run) el.querySelector('[data-csimc="play"]').textContent = "▶ Animar";
  if (!SIMIO && "IntersectionObserver" in window) SIMIO = new IntersectionObserver(es => es.forEach(x => { const s = SIMST.get(x.target); if (s) { s.vis = x.isIntersecting; if (s.vis) simLoop(x.target); } }));
  if (SIMIO) SIMIO.observe(el); else { st.vis = true; simLoop(el); } }
function simOut(el){ const st = SIMST.get(el); st.def.params.forEach(q => { const o = el.querySelector('[data-o="' + q.k + '"]'); if (o) o.textContent = (q.fmt ? q.fmt(st.p[q.k]) : crsNum(st.p[q.k], (String(q.step).split(".")[1] || "").length)) + (q.u ? " " + q.u : ""); }); }
function simUi(el, force){ const st = SIMST.get(el), now = performance.now(); if (!force && now - st.uiT < 250) return; st.uiT = now;
  el.querySelector(".csim-m").innerHTML = st.def.metrics(st.s, st.p).map(m => "<dt>" + m[0] + "</dt><dd>" + m[1] + "</dd>").join("");
  const a = st.def.ann ? st.def.ann(st.s, st.p) : ""; const an = el.querySelector(".csim-ann"); if (an.textContent !== a) an.textContent = a;
  el.querySelector(".csim-cc").innerHTML = st.def.concl(st.s, st.p); }
function simDraw(el){ const st = SIMST.get(el), cv = st.cv, W = Math.max(280, cv.parentNode.clientWidth), H = st.def.h ? st.def.h(W) : Math.round(Math.min(440, Math.max(320, W * 0.66))), dpr = Math.min(2, window.devicePixelRatio || 1);
  if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + "px"; }
  const g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H); st.def.draw(g, W, H, st.s, st.p, st.C); }
function simLoop(el){ const st = SIMST.get(el); if (!st || st.raf || !st.run || !st.vis) return; st.last = performance.now();
  const f = now => { st.raf = 0; if (!el.isConnected || !st.run || !st.vis || el.closest("[hidden]")) return; const dt = Math.min(0.05, (now - st.last) / 1000) * st.rate; st.last = now;
    st.def.tick(st.s, st.p, dt); simDraw(el); simUi(el); st.raf = requestAnimationFrame(f); };
  st.raf = requestAnimationFrame(f); }
function simWake(pnl){ pnl.querySelectorAll(".csim[data-csim]").forEach(el => { const st = SIMST.get(el); if (st) { st.C = simColors(); simDraw(el); simUi(el, true); simLoop(el); } }); }
document.addEventListener("input", e => { const t = e.target; const el = t.closest && t.closest(".csim"); if (!el || !t.dataset.k) return; const st = SIMST.get(el); if (!st) return;
  st.p[t.dataset.k] = +t.value; if (st.def.onParam) st.def.onParam(st.s, st.p, t.dataset.k); simOut(el); simDraw(el); simUi(el, true); });
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest(".csim [data-csimc]"); if (!b || b.tagName === "SELECT") return; const el = b.closest(".csim"), st = SIMST.get(el); if (!st) return;
  if (b.dataset.csimc === "play") { st.run = !st.run; b.textContent = st.run ? "⏸ Pausa" : "▶ Animar"; simLoop(el); }
  if (b.dataset.csimc === "reset") { st.s = st.def.init(st.p); simDraw(el); simUi(el, true); } });
document.addEventListener("change", e => { const t = e.target; if (t.dataset && t.dataset.csimc === "rate") { const st = SIMST.get(t.closest(".csim")); if (st) st.rate = +t.value; } });
window.addEventListener("resize", () => document.querySelectorAll(".csim[data-csim]").forEach(el => { if (SIMST.get(el)) simDraw(el); }));
try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => setTimeout(() => document.querySelectorAll(".csim[data-csim]").forEach(el => { const s = SIMST.get(el); if (s) { s.C = simColors(); simDraw(el); } }), 50)); } catch (e) {}
new MutationObserver(() => document.querySelectorAll(".csim[data-csim]").forEach(el => { const s = SIMST.get(el); if (s) { s.C = simColors(); simDraw(el); } })).observe(document.documentElement, { attributes:true, attributeFilter:["data-theme"] });
/* utilidades de dibujo para las simulaciones */
const SIMG = {
  axes(g, x0, y0, x1, y1, C, xl, yl){ g.strokeStyle = C.line; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y1); g.lineTo(x0, y0); g.lineTo(x1, y0); g.stroke();
    g.fillStyle = C.muted; g.font = "12px " + C.font; if (xl) { g.textAlign = "right"; g.fillText(xl, x1, y0 + 16); } if (yl) { g.textAlign = "left"; g.fillText(yl, x0 + 4, y1 + 2); } },
  hline(g, x0, x1, y, col, dash, lab, C){ g.strokeStyle = col; g.lineWidth = 1.5; g.setLineDash(dash || []); g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); g.setLineDash([]); if (lab) { g.fillStyle = C.ink; g.font = "12px " + C.font; g.textAlign = "right"; g.fillText(lab, x1 - 4, y - 5); } },
  text(g, s, x, y, col, C, al, b){ g.fillStyle = col; g.font = (b ? "600 " : "") + "12px " + C.font; g.textAlign = al || "left"; g.fillText(s, x, y); } };

/* ============ Búsqueda difusa (temas, fórmulas, simulaciones y glosario) ============ */
const crsNz = t => String(t || "").replace(/<[^>]+>/g, "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function crsScore(q, s){ if (!s) return 0; if (s === q) return 100; const i = s.indexOf(q); if (i === 0) return 90; if (i > 0) return /[\s(·,/-]/.test(s[i - 1]) ? 80 : 60;
  /* subsecuencia (letras en orden con saltos) */ let k = 0, gaps = 0, last = -1; for (let j = 0; j < s.length && k < q.length; j++) if (s[j] === q[k]) { if (last >= 0) gaps += j - last - 1; last = j; k++; }
  if (k === q.length && gaps <= q.length * 2) return 45 - Math.min(20, gaps);
  /* parecido por bigramas (tolera errores de tipeo) */ if (q.length < 4) return 0; const bg = x => { const a = []; for (let j = 0; j < x.length - 1; j++) a.push(x.slice(j, j + 2)); return a; };
  const A = bg(q); let best = 0; s.split(/[\s(),/·-]+/).forEach(w => { if (w.length < 3) return; const B = bg(w); let m = 0; const used = B.slice(); A.forEach(x => { const z = used.indexOf(x); if (z >= 0) { m++; used.splice(z, 1); } }); best = Math.max(best, 2 * m / (A.length + B.length)); });
  return best >= 0.6 ? Math.round(best * 40) : 0; }
function crsSearch(q){ q = crsNz(q).trim(); if (q.length < 1) return []; const H = [];
  const push = (k, t, go, sc) => { if (sc > 0) H.push({ k, t, go, sc }); };
  PAGES.forEach(p => { if (p.id === "inicio" || p.g === "hub") return; const K = CRS[p.id]; const s = Math.max(crsScore(q, crsNz(p.t)) + 10, K ? crsScore(q, crsNz(K.kw)) : 0, C[p.id] ? crsScore(q, crsNz(C[p.id].ico)) + 5 : 0);
    push(K ? "Tema" : (GROUPS[p.g] || "Sección"), p.t, p.id, s); });
  Object.keys(CRS).forEach(id => { const K = CRS[id]; if (!PAGES.some(p => p.id === id)) return;
    if (K.ess) push("Fórmula", K.ess.fx.replace(/<[^>]+>/g, "") + " · " + pageOf(id).t, id + "/fx", Math.max(crsScore(q, crsNz(K.ess.fx)), crsScore(q, crsNz(K.kw)) - 5));
    (K.vars || []).forEach(v => { if (crsNz(v[0]).replace(/<[^>]+>/g, "").trim() === q) push("Fórmula", v[0].replace(/<[^>]+>/g, "") + ": " + v[1].replace(/<[^>]+>/g, "") + " · " + pageOf(id).t, id + "/fx", 70); });
    if (K.sim && CSIM[K.sim]) push("Simulación", CSIM[K.sim].title, id + "/sim", Math.max(crsScore(q, crsNz(CSIM[K.sim].title)), crsScore(q, crsNz(K.kw)) - 10)); });
  (typeof FORM !== "undefined" ? FORM : []).forEach(f => push("Fórmula", f[1] + ": " + f[2], "formulario", Math.max(crsScore(q, crsNz(f[1])), crsScore(q, crsNz(f[2])) - 10) - 5));
  Object.keys(typeof GLOS !== "undefined" ? GLOS : {}).forEach(g => push("Glosario", g + ": " + String(GLOS[g]).slice(0, 60) + "…", "glosario", crsScore(q, crsNz(g)) - 8));
  const ORDK = { "Tema":0, "Fórmula":1, "Simulación":2, "Glosario":4 };
  const seen = new Set(); return H.sort((a, b) => b.sc - a.sc).filter(h => { const key = h.k + h.go + h.t; if (seen.has(key)) return false; seen.add(key); return true; })
    .slice(0, 30).sort((a, b) => ((ORDK[a.k] == null ? 3 : ORDK[a.k]) - (ORDK[b.k] == null ? 3 : ORDK[b.k])) || b.sc - a.sc).slice(0, 24); }
