/* ============ SIMULADORES DE SOFTWARE: BASE COMÚN ============ */
const SIMS = [];
const SIM = o => SIMS.push(o);
const simSt = (id, init) => { S.sim = S.sim || {}; if (!S.sim[id]) S.sim[id] = init(); return S.sim[id]; };
const simReset = (id, init) => { S.sim = S.sim || {}; S.sim[id] = init(); save(); return S.sim[id]; };
const clone = o => JSON.parse(JSON.stringify(o));
/* Generador pseudoaleatorio con semilla (mulberry32): mismos datos y mismas corridas en cualquier equipo */
function rngSeed(seed){ let a = (seed >>> 0) || 1; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const numOk = s => { const v = num(s); return fin(v) ? v : NaN; };
const opts = (a, v) => a.map(o => { const [k, t] = Array.isArray(o) ? o : [o, o]; return '<option value="' + esc(k) + '"' + (String(k) === String(v) ? " selected" : "") + ">" + esc(t) + "</option>"; }).join("");
const swMsg = (el, m, c) => { const b = el.querySelector(".sw-status"); if (b) { b.className = "sw-status " + (c || ""); b.innerHTML = m; } };
/* Ventana tipo aplicación: barra de título, pestañas (cinta), cuerpo y barra de estado */
function swFrame(title, tabs, act){ return '<div class="sw"><div class="sw-top"><span class="sw-dots"><i></i><i></i><i></i></span><b>' + esc(title) + "</b></div>" +
  (tabs && tabs.length ? '<div class="sw-tabs" role="tablist">' + tabs.map(t => '<button type="button" role="tab" data-tab="' + t[0] + '" class="' + (t[0] === act ? "on" : "") + '">' + t[1] + "</button>").join("") + "</div>" : "") +
  '<div class="sw-body"></div><div class="sw-status" aria-live="polite">Listo</div></div>'; }
function pgSim(id){ const s = SIMS.find(x => x.id === id);
  return '<p class="eyebrow">Simuladores de software · ' + s.like + "</p><h1>" + s.t + '</h1><p class="lead">' + s.lead + "</p>" +
    '<details class="item" open><summary>Instructivo rápido: tu primer uso en 5 minutos</summary><div class="body prose">' + s.quick + "</div></details>" +
    '<div class="simbox noexp" data-sim="' + id + '"></div>' +
    '<h2 class="sh" style="margin-top:22px">Instructivo completo</h2>' + s.ins.map(x => '<details class="item"><summary>' + x[0] + '</summary><div class="body prose">' + x[1] + "</div></details>").join("") +
    (s.rel ? '<h3 style="margin-top:18px">Relacionado</h3><div class="quick">' + s.rel.filter(r => PAGES.find(p => p.id === r)).map(r => '<button class="chip" type="button" data-go="' + r + '">' + pageOf(r).t + "</button>").join("") + "</div>" : ""); }
function simInit(el){ const s = SIMS.find(x => x.id === el.dataset.sim); if (!s) return;
  try { s.init(el); } catch (e) { console.error(e); el.innerHTML = note("El simulador no pudo iniciarse: " + esc(e.message) + ". Usa «Restaurar datos de ejemplo» o recarga la página.", "bad") + '<button class="btn small" type="button" data-sreset="' + s.id + '">Restaurar datos de ejemplo</button>'; } }
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-sreset]"); if (!b) return; S.sim = S.sim || {}; delete S.sim[b.dataset.sreset]; save(); const box = b.closest("[data-sim]"); if (box) simInit(box); });
/* Gráficos compactos reutilizables */
function swBars(cats, vals, o){ o = o || {}; if (!cats.length) return '<p class="hint">Sin datos para graficar con los filtros actuales.</p>';
  return chart({ bars:vals.map((v, i) => ({ x:i + 1, y:v, cls:o.cls ? o.cls(i) : "bar1", lbl:o.lbl ? o.lbl(v) : "" })), xcat:cats, xmin:0.4, xmax:cats.length + 0.6, ymin:Math.min(0, ...vals), ylab:o.ylab || "", h0:o.h || 260, cap:o.cap, title:o.title }); }
function swHBars(cats, vals, fmt){ const mx = Math.max(...vals.map(Math.abs), 1e-9); return '<div class="sw-hb">' + cats.map((c, i) => '<div class="sw-hbr"><span class="sw-hbl">' + esc(c) + '</span><span class="sw-hbt"><i style="width:' + Math.max(0, vals[i]) / mx * 100 + '%"></i></span><span class="sw-hbv">' + (fmt ? fmt(vals[i]) : n0(vals[i])) + "</span></div>").join("") + "</div>"; }
/* Exportar una tabla a CSV (se abre la descarga del navegador) */
function swCSV(name, head, body){ const q = v => { const s = String(v == null ? "" : v); return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const csv = "﻿" + [head].concat(body).map(r => r.map(q).join(";")).join("\r\n");
  try { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type:"text/csv;charset=utf-8" })); a.download = name + ".csv"; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); return true; } catch (e) { return false; } }
/* Botones del instructivo que cargan un ejemplo en el simulador: data-simq="id" data-q="texto" */
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-simq]"); if (!b) return; const box = document.querySelector('[data-sim="' + b.dataset.simq + '"]'); if (!box || typeof box._load !== "function") return; box._load(b.dataset.q); box.scrollIntoView({ behavior:"smooth", block:"start" }); });
const LQ = (id, q, t) => '<button class="btn small ghost lq" type="button" data-simq="' + id + '" data-q="' + esc(q) + '">' + (t || "▶ Cargar y ejecutar en el simulador") + "</button>";
const QX = (id, q, t) => '<div class="sw-out">' + esc(q) + "</div>" + LQ(id, q, t);
const SIMX = (id, o) => { const s = SIMS.find(x => x.id === id); if (!s) return; if (o.quick) s.quick = o.quick; if (o.pre) s.ins = o.pre.concat(s.ins); if (o.post) s.ins = s.ins.concat(o.post); };
