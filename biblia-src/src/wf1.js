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
  add("pr", '<p class="hint crs-qzl" aria-live="polite">' + crsQzLine(id) + "</p>");
  if (K.gen || (K.sp && (K.sp.params || []).length && crsGen(id))) add("pr", '<section class="crs-s"><h2>Ejercicio con datos nuevos</h2><p class="hint">Cada vez se generan datos distintos para que practiques el procedimiento sin memorizar la respuesta.</p><div id="crs-gbox"></div><p><button type="button" class="btn" data-crs-gen="' + id + '">Generar ejercicio</button></p></section>');
  if (K.quiz) add("pr", '<section class="crs-s"><h2>Ponte a prueba</h2>' + K.quiz.map(q0 => { const pm = q0[1].map((_, j) => j).sort(() => Math.random() - 0.5); return [q0[0], pm.map(j => q0[1][j]), pm.indexOf(q0[2]), q0[3]]; }).map((q, i) => '<fieldset class="cq crs-q" data-ok="' + q[2] + '"><legend><span class="cq-n">Pregunta ' + (i + 1) + "</span></legend><div class=\"cq-t\">" + q[0] + "</div>" +
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
      (K.rel && K.rel.length ? '<p class="x-h">Temas relacionados</p><div class="quick">' + chips(K.rel) + "</div>" : "") +
      (crsBack(id).length ? '<p class="x-h">También se usa en</p><div class="quick">' + chips(crsBack(id)) + "</div>" : "") +
      (typeof expBtns === "function" ? '<p class="x-h">Llévate el resumen de esta lección</p><div class="actions">' + expBtns("leccion", ' data-c="' + id + '"') + "</div>" : "") + "</section>"); }
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

/* ===== Referencia del curso: tabla maestra de fórmulas y glosario de lecciones (filtrables, con enlace a cada lección) ===== */
function crsIds(){ return Object.keys(CRS).filter(id => CRS[id] && PAGES.some(p => p.id === id)); }
function crsArea(id){ const p = pageOf(id); return (typeof GROUPS !== "undefined" && GROUPS[p.g]) || ""; }
function crsFormHTML(){
  ensureContent(); const ids = crsIds().filter(id => CRS[id].ess).sort((a, b) => (crsArea(a) + pageOf(a).t).localeCompare(crsArea(b) + pageOf(b).t, "es"));
  if (!ids.length) return "";
  const rows = ids.map(id => { const E = CRS[id].ess, t = pageOf(id).t; return '<tr data-k="' + crsEsc(crsNz(crsArea(id) + " " + t + " " + E.fx + " " + E.when + " " + (CRS[id].kw || ""))) + '"><td>' + crsEsc(crsArea(id)) + '</td><td><button type="button" class="linkb" data-go="' + id + '/fx">' + crsEsc(t) + '</button></td><td class="crs-ff">' + E.fx + "</td><td>" + E.when + "</td></tr>"; }).join("");
  return '<section class="card crs-ref" aria-labelledby="crs-fh"><h2 id="crs-fh">Tabla maestra: fórmulas de las lecciones interactivas</h2><p class="hint">' + ids.length + ' lecciones. Toca el tema para abrir su «Fórmula paso a paso». Puedes filtrar por tema, área, símbolo o palabra clave.</p>' +
    '<input type="search" data-crsf="crs-ft" placeholder="Filtrar fórmulas (ej.: VAN, σ, inventario)…" aria-label="Filtrar la tabla maestra de fórmulas">' +
    '<div class="crs-tw" tabindex="0" role="region" aria-label="Tabla maestra de fórmulas"><table id="crs-ft"><thead><tr><th scope="col">Área</th><th scope="col">Tema</th><th scope="col">Fórmula clave</th><th scope="col">Cuándo usarla</th></tr></thead><tbody>' + rows + '</tbody></table></div><p class="hint crs-fn" hidden>Sin resultados para ese filtro.</p></section>';
}
function crsGlosHTML(){
  ensureContent(); const G = {};
  /* un mismo símbolo puede significar cosas distintas según la lección (n, p, C…): se agrupa por término y definición */
  crsIds().forEach(id => ((CRS[id].intro && CRS[id].intro.terms) || []).forEach(([k, d]) => { const key = String(k).trim() + "\u0001" + d; (G[key] = G[key] || { t:String(k).trim(), d, ids:[] }).ids.push(id); }));
  const ks = Object.keys(G).sort((a, b) => crsNz(G[a].t).localeCompare(crsNz(G[b].t), "es") || crsNz(G[a].d).localeCompare(crsNz(G[b].d), "es")); if (!ks.length) return "";
  return '<section class="card crs-ref" aria-labelledby="crs-gh"><h2 id="crs-gh">Términos de las lecciones interactivas</h2><p class="hint">' + ks.length + ' términos explicados dentro de las lecciones, con enlace a cada una.</p>' +
    '<input type="search" data-crsf="crs-gl" placeholder="Filtrar términos de las lecciones…" aria-label="Filtrar términos de las lecciones">' +
    '<dl class="gl" id="crs-gl">' + ks.map(k => '<div class="crs-gi" data-k="' + crsEsc(crsNz(G[k].t + " " + G[k].d)) + '"><dt>' + G[k].t + "</dt><dd>" + G[k].d + ' <span class="crs-gl-l">' + G[k].ids.map(id => '<button type="button" class="linkb" data-go="' + id + '/con">' + crsEsc(pageOf(id).t) + "</button>").join(" · ") + "</span></dd></div>").join("") + '</dl><p class="hint crs-fn" hidden>Sin resultados para ese filtro.</p></section>';
}
/* temas que enlazan a este y que él no enlaza: enlace de vuelta automático */
function crsBack(id){ return crsIds().filter(j => j !== id && (CRS[j].rel || []).indexOf(id) >= 0 && (CRS[id].rel || []).indexOf(j) < 0); }
document.addEventListener("input", e => { const t = e.target.closest && e.target.closest("[data-crsf]"); if (!t) return; const box = document.getElementById(t.dataset.crsf); if (!box) return;
  const q = crsNz(t.value).trim(); let k = 0; box.querySelectorAll("[data-k]").forEach(r => { const ok = !q || r.dataset.k.indexOf(q) >= 0; r.hidden = !ok; if (ok) k++; });
  const nf = t.closest("section") && t.closest("section").querySelector(".crs-fn"); if (nf) nf.hidden = k > 0; });

/* ===== Práctica con datos nuevos: ejercicio generado al azar a partir del guion de «Fórmula paso a paso» =====
   Se varían los datos del guion, se pregunta el resultado de un paso que depende de ellos y las alternativas incorrectas
   salen de aplicar el mismo procedimiento con un dato mal leído (errores típicos). */
const CRS_GENCH = { "stock-seguridad.ns":[90, 95, 99], "tasas.m":[1, 2, 4, 12], "muestra.c":[90, 95, 99], "iper.P":[1, 2, 4], "iper.Cc":[1, 2, 4], "pronosticos.m":[2, 3, 4, 5], "pronosticos.a":[0.1, 0.2, 0.3, 0.4, 0.5],
  "decisiones.pa":[0.2, 0.3, 0.4], "decisiones.pm":[0.3, 0.4, 0.5], "decisiones.al":[0.3, 0.5, 0.6, 0.8], "capacidad.m":[9.95, 10, 10.05, 10.1, 10.15], "capacidad.s":[0.1, 0.12, 0.15, 0.18, 0.2], "capacidad.li":[9.4], "capacidad.ls":[10.6],
  "ruido.L1":[85, 88, 91, 94, 97, 100], "ruido.h1":[0.5, 1, 1.5, 2, 3], "tiempo-estandar.v":[90, 95, 100, 105, 110, 115], "tiempo-estandar.s":[10, 12, 14, 15, 18, 20], "aprendizaje.r":[75, 80, 85, 90], "aprendizaje.N":[8, 16, 32, 64, 100],
  "regresion.xp":[20, 35, 45, 60], "amef.d":[2, 3, 4, 5, 6, 7, 8], "pareto.c":[70, 75, 80, 85], "abc.A":[70, 75, 80], "abc.B":[90, 95], "mrp.I0":[40, 60, 80, 100], "mrp.SS":[10, 20, 30], "mrp.LT":[1, 2, 3],
  "asignacion.af":[6, 8, 10, 12, 14], "cpm.T":[19, 20, 21, 22, 23, 24, 25], "colas.lam":[16, 18, 20, 22], "colas.mu":[8, 9, 10], "colas.s":[3, 4], "muestreo.e":[2, 2.5, 3, 4, 5], "muestreo.p":[10, 15, 18, 20, 25, 30],
  "niosh.H":[25, 30, 35, 40, 45, 50], "niosh.V":[30, 45, 60, 75, 90, 120], "niosh.P":[8, 10, 12, 15, 18, 20, 23], "balanceo.T":[420, 450, 480], "wacc.b":[0.6, 0.8, 0.9, 1, 1.2, 1.4], "oee.np":[20, 30, 38, 45, 60], "vida-economica.i":[0, 5, 10, 15, 20, 30, 40], "kpis.ok":[850, 880, 912, 940, 970], "kpis.f":[2, 3, 4, 5, 6, 8] };
const crsDec = v => { const s = String(v); return s.indexOf(".") >= 0 ? s.split(".")[1].length : 0; };
function crsRandP(id, P){ const v = {}; P.forEach(q => { const ch = CRS_GENCH[id + "." + q.k]; if (ch) { v[q.k] = ch[Math.floor(Math.random() * ch.length)]; return; }
    let x = q.v * (0.7 + Math.random() * 0.6); const d = crsDec(q.v); if (d) x = +x.toFixed(d); else if (Math.abs(q.v) >= 1000) { const m = Math.pow(10, Math.floor(Math.log10(Math.abs(q.v))) - 1); x = Math.round(x / m) * m; } else x = Math.max(1, Math.round(x)); v[q.k] = x; }); return v; }
function crsAlt(id, P, v){ /* un dato mal leído: cada parámetro, por turno, con otro valor */
  return P.map(q => { const w = Object.assign({}, v), ch = CRS_GENCH[id + "." + q.k]; if (ch && ch.length === 1) return w; if (ch) { const o = ch.filter(c => c !== v[q.k]); w[q.k] = o[Math.floor(Math.random() * o.length)]; } else { const d = crsDec(q.v); let x = v[q.k] * (Math.random() < 0.5 ? 0.8 : 1.25); w[q.k] = d ? +x.toFixed(d) : Math.max(1, Math.round(x)); } return w; }); }
const crsHasNum = s => /\d/.test(s || "") && !/NaN|Infinity|undefined|—/.test(s || "");
function crsScale(h, f){ /* escala el primer número de un texto en formato chileno, conservando decimales y unidad */
  return String(h).replace(/−?\d{1,3}(?:\.\d{3})+(?:,\d+)?|−?\d+(?:,\d+)?/, m => { const neg = m[0] === "−", t = m.replace("−", ""), d = (t.split(",")[1] || "").length, x = parseFloat(t.replace(/\./g, "").replace(",", ".")) * f; return (neg ? "−" : "") + crsNum(x, d); }); }
function crsGen(id){
  const K = CRS[id]; if (!K || !K.sp || !(K.sp.params || []).length) return null; const P = K.sp.params;
  for (let tr = 0; tr < 40; tr++) {
    const v = crsRandP(id, P); let A; try { A = K.sp.script(v); } catch (e) { continue; }
    const Bs = []; for (let j = 0; j < 4; j++) { try { Bs.push(K.sp.script(crsRandP(id, P))); } catch (e) {} }
    const pv = P.map(q => crsNum(v[q.k], crsDec(v[q.k]))), triv = h => { const m = String(h).match(/\d[\d.,]*/g) || []; return m.length && m.every(x => pv.indexOf(x.replace(/[.,]$/, "")) >= 0); };
    const cand = A.map((s, i) => i).filter(i => crsHasNum(A[i].h) && !triv(A[i].h) && Bs.some(B => B[i] && B[i].h !== A[i].h)); if (!cand.length) continue;
    const i = cand[Math.random() < 0.6 ? cand.length - 1 : Math.floor(Math.random() * cand.length)], ok = A[i].h, ops = new Set([ok]);
    const num = h => { const m = String(h).replace("−", "-").match(/-?\d{1,3}(?:\.\d{3})+(?:,\d+)?|-?\d+(?:,\d+)?/); return m ? parseFloat(m[0].replace(/\.(?=\d{3})/g, "").replace(",", ".")) : NaN; };
    const pct = /%/.test(ok) && num(ok) >= 0 && num(ok) <= 100, fine = h => crsHasNum(h) && (!pct || (num(h) >= 0 && num(h) <= 100)) && !(num(ok) >= 0 && num(h) < 0);
    crsAlt(id, P, v).forEach(w => { try { const h = K.sp.script(w)[i].h; if (ops.size < 4 && fine(h)) ops.add(h); } catch (e) {} });
    [0.8, 1.2, 0.5, 2, 0.9, 1.1, 0.7, 1.3].forEach(f => { if (ops.size < 4) { const h = crsScale(ok, f); if (fine(h)) ops.add(h); } });
    if (ops.size < 4) continue;
    const L = [...ops].slice(0, 4).sort(() => Math.random() - 0.5);
    const datos = P.map(q => q.l + " = " + crsNum(v[q.k], crsDec(v[q.k])) + (q.u && !/\d a \d/.test(q.u) ? " " + q.u : "")).join(";  ");
    const e = String(A[i].e), at = e.lastIndexOf(ok), guia = at >= 0 ? crsEsc(e.slice(0, at)) + '<b class="crs-blank">?</b>' + crsEsc(e.slice(at + ok.length)) : "";
    return { q:"<p><b>Datos:</b> " + crsEsc(datos) + ".</p><p>Aplica el procedimiento de «Fórmula paso a paso». Paso <b>«" + crsEsc(A[i].t) + "»</b>" + (guia ? ':</p><p class="crs-gx">' + guia + "</p><p>¿Qué valor va en el signo de interrogación?</p>" : ". ¿Qué resultado obtienes?</p>"), ops:L, ok:L.indexOf(ok), expl:crsEsc(A[i].e) + (A[i].s ? " — " + A[i].s : ""), steps:A }; }
  return null; }
let crsAnyQ = () => null;
function crsGenHTML(id){ const K = CRS[id]; let G = null; if (K && K.gen) for (let t = 0; t < 6 && !G; t++) { try { const g = K.gen(); if (g && g.ops.length === 4 && g.ok >= 0) G = { q:g.q, ops:g.ops, ok:g.ok, expl:g.expl, steps:null }; } catch (e) {} } if (!G) G = crsGen(id); if (!G) return '<p class="hint">No se pudo generar un ejercicio con estos datos. Intenta otra vez.</p>';
  const okT = String(G.ops[G.ok]).replace(/<[^>]+>/g, ""), num = crsParseNum(okT), dec = ((okT.match(/\d,(\d+)/) || [])[1] || "").length;
  const free = isFinite(num) && (okT.match(/\d[\d.,]*/g) || []).length === 1 ? '<div class="crs-free"><label>Escribe tu resultado <input type="text" inputmode="decimal" autocomplete="off" class="crs-fin" aria-describedby="crs-fh-' + id + '"></label> <button type="button" class="btn ghost" data-crs-chk="1">Comprobar</button><p class="hint" id="crs-fh-' + id + '">Solo el número (por ejemplo 1.234,5 o 1234.5). Se acepta una diferencia de 1 % por redondeo. O elige una alternativa:</p></div>' : "";
  return '<fieldset class="cq crs-q crs-gq" data-ok="' + G.ok + '" data-gen="1"' + (free ? ' data-num="' + num + '" data-dec="' + dec + '"' : "") + '><legend><span class="cq-n">Ejercicio con datos nuevos</span></legend><div class="cq-t">' + G.q + "</div>" + free +
    G.ops.map((o, j) => '<label class="cq-o"><input type="radio" name="crsg-' + id + "-" + Date.now() + '" value="' + j + '"><span><b>' + "abcd"[j] + ")</b> " + crsEsc(o) + "</span></label>").join("") +
    '<div class="cq-sol" hidden><p class="cq-dh">Explicación</p><p>' + G.expl + '</p>' + (G.steps ? '<details><summary>Ver el desarrollo completo</summary><ol class="crs-gsteps">' + G.steps.map(s => "<li><b>" + crsEsc(s.t) + ":</b> " + crsEsc(s.e) + "</li>").join("") + "</ol></details>" : "") + "</div></fieldset>"; }
/* número escrito por el estudiante: acepta 1.234,5 · 1234,5 · 1234.5 · 1,2 % · $ 3.000 */
function crsParseNum(t){ let s = String(t || "").replace(/−/g, "-").replace(/[^\d.,-]/g, " ").trim().split(/\s+/).filter(x => /\d/.test(x))[0]; if (!s) return NaN;
  if (s.indexOf(".") >= 0 && s.indexOf(",") >= 0) s = s.replace(/\./g, "").replace(",", "."); else if (s.indexOf(",") >= 0) s = s.replace(",", "."); else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, ""); return parseFloat(s); }
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-crs-chk]"); if (!b) return; const fs = b.closest(".crs-gq"), inp = fs.querySelector(".crs-fin"), raw = String(inp.value).trim(), v = crsParseNum(raw), alt = /^-?\d+\.\d{3}$/.test(raw) ? parseFloat(raw) : NaN, ok = +fs.dataset.num, d = +fs.dataset.dec || 0;
  if (!isFinite(v)) { inp.setAttribute("aria-invalid", "true"); inp.focus(); return; } inp.removeAttribute("aria-invalid");
  const tol = Math.max(Math.abs(ok) * 0.01, 0.6 * Math.pow(10, -d)), good = Math.abs(v - ok) <= tol || Math.abs(alt - ok) <= tol, k = +fs.dataset.ok; /* «10.577» puede ser miles o decimal: se aceptan ambas lecturas */
  fs.classList.remove("ok", "bad"); fs.classList.add(good ? "ok" : "bad"); fs.querySelectorAll(".cq-o").forEach((l, j) => l.classList.toggle("is-ok", j === k));
  const sol = fs.querySelector(".cq-sol"); sol.hidden = false; sol.firstElementChild.textContent = good ? "Correcto. Por qué:" : "No es ese valor. El resultado es " + fs.querySelectorAll(".cq-o span")[k].textContent.replace(/^[a-d]\)\s*/, "") + ". Por qué:";
  if (!fs.dataset.rec) { fs.dataset.rec = "1"; crsQzRec(cur, good); const l = document.querySelector(".crs-qzl"); if (l) l.textContent = crsQzLine(cur); } });
document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.matches && e.target.matches(".crs-fin")) { e.preventDefault(); const b = e.target.closest(".crs-free").querySelector("[data-crs-chk]"); if (b) b.click(); } });
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-crs-gen]"); if (!b) return; const box = document.getElementById("crs-gbox"); if (!box) return; box.innerHTML = crsGenHTML(b.dataset.crsGen); b.textContent = "Otro ejercicio"; const f = box.querySelector("input"); if (f) f.focus(); });

/* ===== Progreso de práctica (solo en este navegador) y repaso sugerido ===== */
function crsQzRec(id, ok){ try { S.qz = S.qz || {}; const r = S.qz[id] = S.qz[id] || { n:0, ok:0, h:[] }; r.n++; if (ok) r.ok++; r.h = (r.h || []).concat(ok ? 1 : 0).slice(-10); r.t = Date.now(); save(); } catch (e) {} }
function crsQzLine(id){ const r = S.qz && S.qz[id]; if (!r || !r.n) return "Aún no respondes preguntas de este tema."; const rec = r.h.length ? Math.round(r.h.reduce((a, b) => a + b, 0) / r.h.length * 100) : 0; return "Has respondido " + r.n + " preguntas: " + r.ok + " correctas. Últimas " + r.h.length + ": " + rec + " %."; }
function crsQzWeak(){ const Q = S.qz || {}; return Object.keys(Q).filter(id => PAGES.some(p => p.id === id) && Q[id].h && Q[id].h.length >= 2).map(id => [id, Q[id].h.reduce((a, b) => a + b, 0) / Q[id].h.length]).filter(x => x[1] < 0.7).sort((a, b) => a[1] - b[1]).slice(0, 5); }
function crsProgHTML(bar){ const Q = S.qz || {}, ids = Object.keys(Q).filter(id => PAGES.some(p => p.id === id)); if (!ids.length) return "";
  const n = ids.reduce((a, id) => a + Q[id].n, 0), ok = ids.reduce((a, id) => a + Q[id].ok, 0), dom = ids.filter(id => Q[id].h.length >= 3 && Q[id].h.slice(-3).every(x => x)).length, W = crsQzWeak();
  return '<div class="prog"><div class="prog-r"><span>Preguntas de práctica correctas</span><b>' + ok + " de " + n + "</b></div>" + bar(ok, n, "Preguntas correctas") + "</div>" +
    '<p class="hint">Temas practicados: ' + ids.length + " · dominados (3 aciertos seguidos): " + dom + "</p>" +
    (W.length ? '<h3 class="panel-sub">Repaso sugerido</h3><div class="quick">' + W.map(([id, p]) => '<button type="button" class="chip" data-go="' + id + '/pr">' + crsEsc(pageOf(id).t) + " · " + Math.round(p * 100) + " %</button>").join("") + "</div>" : ""); }
document.addEventListener("change", e => { const r = e.target; if (!r.matches || !r.matches(".crs-q input[type=radio]")) return; const fs = r.closest(".crs-q"); if (fs.dataset.rec) return; fs.dataset.rec = "1";
  crsQzRec(cur, +r.value === +fs.dataset.ok); const l = document.querySelector(".crs-qzl"); if (l) l.textContent = crsQzLine(cur); });

/* ===== Resumen descargable de cada lección (Word o PDF) ===== */
function crsExportHTML(id){ const K = CRS[id]; if (!K) return ""; let h = "", k = 0; const H = t => "<h2>" + (++k) + ". " + t + "</h2>";
  if (K.ess) h += H("Lo esencial") + "<ul>" + K.ess.pts.map(p => "<li>" + p + "</li>").join("") + "</ul><p><b>Fórmula clave:</b> " + K.ess.fx + "</p>" + (K.ess.when ? "<p><b>Úsala cuando</b> " + K.ess.when + "</p>" : "");
  if (K.intro) h += H("El problema que resuelve") + K.intro.prob + (K.intro.anal ? "<p><b>Comparación:</b></p>" + K.intro.anal : "") + (K.intro.terms ? "<dl>" + K.intro.terms.map(t => "<dt>" + t[0] + "</dt><dd>" + t[1] + "</dd>").join("") + "</dl>" : "");
  if (K.sp) { let st = []; try { const v = {}; (K.sp.params || []).forEach(q => v[q.k] = q.v); st = K.sp.script(v); } catch (e) {} if (st.length) h += H(K.sp.title || "Fórmula paso a paso") + "<ol>" + st.map(s => "<li><b>" + crsEsc(s.t) + ":</b> " + crsEsc(s.e) + (s.s ? " — " + s.s : "") + "</li>").join("") + "</ol>"; }
  if ((K.vars || []).length) h += H("Qué significa cada letra") + "<table><thead><tr><th>Símbolo</th><th>Significado</th><th>Unidad</th><th>Rango típico</th></tr></thead><tbody>" + K.vars.map(v => "<tr><td>" + v.join("</td><td>") + "</td></tr>").join("") + "</tbody></table>";
  if (K.sup) h += H("Supuestos") + K.sup;
  if (K.ex) h += H("Ejemplo guiado") + "<p>" + K.ex.t + "</p><table><thead><tr><th>Qué hago</th><th>Por qué</th><th>Qué obtengo</th><th>Cómo lo interpreto</th></tr></thead><tbody>" + K.ex.steps.map(s => "<tr><td>" + s.join("</td><td>") + "</td></tr>").join("") + "</tbody></table><p><b>Resultado:</b> " + K.ex.r + "</p>";
  if (K.real) h += H("En la práctica") + K.real;
  if (K.adv) h += H("Nivel avanzado") + K.adv;
  if (K.dec) h += H("Qué decisión te permite tomar") + "<p>" + K.dec + "</p>";
  if ((K.quiz || []).length) h += H("Autoevaluación") + "<ol>" + K.quiz.map(q => "<li>" + q[0] + "<br>" + q[1].map((o, j) => "abcd"[j] + ") " + o).join(" · ") + "</li>").join("") + "</ol><p><b>Respuestas:</b> " + K.quiz.map((q, i) => (i + 1) + ") " + "abcd"[q[2]] + " — " + q[3]).join(" ") + "</p>";
  return h; }
