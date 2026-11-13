/* ============ FASE 4: DIAGRAMAS DE LAS CALCULADORAS E INTERACTIVIDAD ============ */

/* ---------- Ishikawa: textos completos (ajuste de línea), cabeza siempre visible y alto según el número de causas ---------- */
function ishiSVG(problem, cats){
  const nT = Math.ceil(cats.length / 2), top = cats.slice(0, nT), bot = cats.slice(nT), nC = Math.max(top.length, bot.length, 1);
  const W = 1080, xh = 800, colW = (xh - 40) / nC, chars = Math.max(14, Math.floor((colW - 46) / 7.2));
  const prep = c => ({ name:dgWrap(c[0], Math.max(12, Math.floor(colW / 8.4))).slice(0, 2), causes:c[1].slice(0, 6).map(t => dgWrap(t, chars).slice(0, 3)) });
  const T = top.map(prep), B = bot.map(prep);
  const need = arr => Math.max(3, ...arr.map(c => c.causes.reduce((s, x) => s + x.length * 15 + 12, 0)));
  const hTop = need(T) + 64, hBot = need(B) + 64, y0 = hTop + 20, H = y0 + hBot + 20, gid = "ig" + (++DGN);
  let g = dgGrid(gid, W, H) + '<line class="ishi-sp" x1="30" y1="' + y0 + '" x2="' + xh + '" y2="' + y0 + '"/><polygon class="ishi-ah" points="' + xh + "," + (y0 - 11) + " " + (xh + 18) + "," + y0 + " " + xh + "," + (y0 + 11) + '"/>';
  const pl = dgWrap(problem || "Problema", 22).slice(0, 6), bh = Math.max(76, pl.length * 18 + 28);
  g += '<rect class="ishi-ef" x="' + (xh + 26) + '" y="' + (y0 - bh / 2) + '" width="' + (W - xh - 34) + '" height="' + bh + '" rx="12"/>' + dgText(xh + 26 + (W - xh - 34) / 2, y0, pl, { lh:18, cls:"ishi-eft" });
  const branch = (c, j, up) => { const xa = 40 + colW * (j + 1) - 14, ey = up ? 46 : H - 46, dx = Math.min(90, colW * 0.4), xb = xa - dx; let s = '<line class="ishi-bn" x1="' + xb + '" y1="' + ey + '" x2="' + xa + '" y2="' + y0 + '"/>';
    const nw = Math.min(colW - 12, Math.max(...c.name.map(l => l.length)) * 8 + 24), nh = c.name.length * 16 + 12, ny = up ? ey - 10 - nh : ey + 10;
    s += '<rect class="ishi-cat" x="' + (xb - nw / 2) + '" y="' + ny + '" width="' + nw + '" height="' + nh + '" rx="' + nh / 2 + '"/>' + dgText(xb, ny + nh / 2, c.name, { lh:16, cls:"ishi-catt" });
    let acc = 22; const span = Math.abs(y0 - ey);
    c.causes.forEach(L => { const hh = L.length * 15 + 12, f = (acc + hh / 2) / (span + 10); acc += hh; const yy = up ? ey + f * span : ey - f * span, xx = xb + (xa - xb) * f;
      s += '<line class="ishi-cz" x1="' + (xx - 16) + '" y1="' + yy + '" x2="' + xx + '" y2="' + yy + '"/><circle class="ishi-dot" cx="' + xx + '" cy="' + yy + '" r="2.5"/>' + dgText(xx - 20, yy, L, { a:"end", lh:15 }); });
    return s; };
  T.forEach((c, j) => g += branch(c, j, true)); B.forEach((c, j) => g += branch(c, j + (nC - B.length) / 2, false));
  return '<figure class="ch dg ishi"><div class="sv"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Diagrama de Ishikawa">' + g + '</svg></div><figcaption>Las causas más probables se verifican con datos (Pareto, gráficos de control, pruebas) antes de actuar. En el celular desliza el diagrama hacia el lado.</figcaption></figure>';
}
function cpmNet(A, order){
  const lev = {}; order.forEach(id => { lev[id] = A[id].p.length ? 1 + Math.max.apply(null, A[id].p.map(p => lev[p])) : 0; });
  const cols = {}; order.forEach(id => (cols[lev[id]] = cols[lev[id]] || []).push(id));
  const nL = Object.keys(cols).length, maxR = Math.max.apply(null, Object.values(cols).map(c => c.length));
  const bw = 140, bh = 80, gx = 60, gy = 28, W = 40 + nL * (bw + gx) - gx + 20, H = 40 + maxR * (bh + gy) - gy, P = {}, mk = "na" + (++DGN), mkc = mk + "c";
  Object.keys(cols).forEach(l => { const c = cols[l], off = (maxR - c.length) * (bh + gy) / 2; c.forEach((id, r) => { P[id] = [20 + l * (bw + gx), 20 + off + r * (bh + gy)]; }); });
  const f = x => nf(x, Math.abs(x - Math.round(x)) < 1e-9 ? 0 : 1);
  let g = dgGrid("cg" + mk, W, H) + '<defs><marker id="' + mk + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="dgah"/></marker><marker id="' + mkc + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="cpm-ahc"/></marker></defs>';
  order.forEach(id => A[id].p.forEach(p => { const crit = A[id].crit && A[p].crit && Math.abs(A[p].EF - A[id].ES) < 1e-9, [x1, y1] = P[p], [x2, y2] = P[id];
    g += '<path d="M' + (x1 + bw) + "," + (y1 + bh / 2) + " C" + (x1 + bw + gx / 2) + "," + (y1 + bh / 2) + " " + (x2 - gx / 2) + "," + (y2 + bh / 2) + " " + (x2 - 2) + "," + (y2 + bh / 2) + '" class="cpm-e' + (crit ? " crit" : "") + '" data-a="' + esc(p) + '" data-b="' + esc(id) + '" marker-end="url(#' + (crit ? mkc : mk) + ')"/>'; }));
  order.forEach(id => { const a = A[id], [x, y] = P[id];
    g += '<g class="cpm-n' + (a.crit ? " crit" : "") + '" data-n="' + esc(id) + '" data-tip="' + esc(id + ": duración " + f(a.te) + " · inicio " + f(a.ES) + "–" + f(a.LS) + " · holgura " + f(a.HT) + (a.crit ? " · crítica" : "")) + '"><rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="10" class="cpm-b"/><path d="M' + x + "," + (y + 24) + "h" + bw + "M" + x + "," + (y + bh - 24) + "h" + bw + '" class="cpm-l"/>' +
      '<text x="' + (x + 10) + '" y="' + (y + 17) + '" class="mu">' + f(a.ES) + '</text><text x="' + (x + bw / 2) + '" y="' + (y + 17) + '" text-anchor="middle" class="mu">' + f(a.te) + '</text><text x="' + (x + bw - 10) + '" y="' + (y + 17) + '" text-anchor="end" class="mu">' + f(a.EF) + "</text>" +
      '<text x="' + (x + bw / 2) + '" y="' + (y + bh / 2 + 6) + '" text-anchor="middle" class="cpm-id">' + esc(id) + "</text>" +
      '<text x="' + (x + 10) + '" y="' + (y + bh - 8) + '" class="mu">' + f(a.LS) + '</text><text x="' + (x + bw / 2) + '" y="' + (y + bh - 8) + '" text-anchor="middle" class="mu">H ' + f(a.HT) + '</text><text x="' + (x + bw - 10) + '" y="' + (y + bh - 8) + '" text-anchor="end" class="mu">' + f(a.LF) + "</text></g>"; });
  return '<figure class="ch dg cpmnet"><div class="sv"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Red del proyecto">' + g + '</svg></div><figcaption>Red del proyecto (actividad en el nodo). Arriba: inicio temprano · duración · término temprano. Abajo: inicio tardío · holgura · término tardío. En cobre, la ruta crítica.</figcaption></figure>';
}

/* ---------- Región factible: deslizador de la recta del objetivo ---------- */
const LPG = {}; let LPGN = 0;
function lpSlider(P, R, mx){ const k = ++LPGN; LPG[k] = { P, R, mx }; const zmax = Math.abs(R.z) * 1.4 || 1;
  return '<div class="isl no-print" data-lpg="' + k + '"><label>Mueve la recta del objetivo: Z = <b class="isl-v">' + nf(R.z, 2) + '</b></label><input type="range" min="0" max="' + zmax + '" step="' + (zmax / 200) + '" value="' + Math.abs(R.z) + '" aria-label="Valor de Z"><p class="hint isl-m">La recta pasa por el vértice óptimo: es el último punto de la región que toca.</p></div>'; }
document.addEventListener("input", e => { const s = e.target.closest && e.target.closest(".isl[data-lpg] input"); if (!s) return; const box = s.closest(".isl"), L = LPG[box.dataset.lpg]; if (!L) return;
  const z = +s.value * (L.R.z < 0 ? -1 : 1), fig = box.previousElementSibling; box.querySelector(".isl-v").textContent = nf(z, 2);
  const nh = lpGraph(L.P, L.R, z); if (nh && fig && fig.tagName === "FIGURE") { const t = document.createElement("template"); t.innerHTML = nh; fig.replaceWith(t.content.firstElementChild); }
  const max = L.mx, d = Math.abs(z - L.R.z) / (Math.abs(L.R.z) || 1);
  box.querySelector(".isl-m").textContent = d < 0.01 ? "La recta pasa por el vértice óptimo: es el último punto de la región que toca." : (max ? z <= L.R.z : z >= L.R.z) ? "La recta corta la región: hay soluciones factibles con este valor de Z, pero se puede mejorar desplazándola." : "La recta ya no toca la región: ninguna solución factible alcanza este valor de Z."; });

/* ---------- Curva de costos de inventario: deslizador del tamaño de lote ---------- */
function eoqSlider(D, S, H, fac, Q){ return '<div class="qsl no-print" data-d="' + D + '" data-s="' + S + '" data-h="' + H + '" data-f="' + fac + '" data-q="' + Q + '"><label>Prueba otro tamaño de lote: Q = <b class="qsl-v">' + n0(Q) + '</b></label><input type="range" min="' + Math.max(1, Q * 0.2) + '" max="' + Q * 3 + '" step="' + Math.max(1, Q / 200) + '" value="' + Q + '" aria-label="Tamaño de lote"><p class="hint qsl-m"></p></div>'; }
function eoqSlUpd(box){ const D = +box.dataset.d, S = +box.dataset.s, H = +box.dataset.h, fac = +box.dataset.f, Q0 = +box.dataset.q, q = +box.querySelector("input").value;
  const cp = D / q * S, cm = H * q * fac / 2, ct = cp + cm, c0 = D / Q0 * S + H * Q0 * fac / 2;
  box.querySelector(".qsl-v").textContent = n0(q); box.querySelector(".qsl-m").innerHTML = "Pedir: " + money(cp) + " · mantener: " + money(cm) + " · total: <b>" + money(ct) + "</b> (" + (ct - c0 < 0.5 ? "es el mínimo" : "+" + pc((ct - c0) / c0, 1) + " sobre el mínimo") + ")."; }
document.addEventListener("input", e => { const s = e.target.closest && e.target.closest(".qsl input"); if (s) eoqSlUpd(s.closest(".qsl")); });

/* ---------- Resultado actualizado en vivo mientras se escriben los datos ---------- */
const LIVE_SKIP = new Set(["generador-informe", "citas-apa", "conversor", "simulacion-mc"]);
const liveOn = () => { try { return localStorage.getItem(KEY + "-live") !== "0"; } catch (e) { return true; } };
let liveT = null;
function liveRes(id){
  if (cur !== id || !C[id] || document.querySelector(".card.form .field.v-bad")) return;
  S.v[id] = collect(id); S.done[id] = Date.now(); S.snap[id] = JSON.stringify(S.v[id]); save();
  const t = document.createElement("template"); t.innerHTML = mFill(calcPage(id)); const nr = t.content.querySelector("#res"), or = document.getElementById("res"); if (!nr || !or) return;
  const det = or.querySelector("details.usados"); if (det && det.open) { const d2 = nr.querySelector("details.usados"); if (d2) d2.open = true; }
  or.replaceWith(nr); try { abbrify(nr); } catch (e) {} try { calloutCap(document.getElementById("app")); } catch (e) {} try { diagramsAfter(nr); svgA11y(nr); } catch (e) {} try { wrapWide(nr); katexMotor(nr); } catch (e) {} try { nr.querySelectorAll(".qsl").forEach(eoqSlUpd); } catch (e) {}
}
document.addEventListener("input", e => { const el = e.target; if (!el.dataset || !el.dataset.c || !el.dataset.k || LIVE_SKIP.has(el.dataset.c) || !liveOn()) return; clearTimeout(liveT); const id = el.dataset.c; liveT = setTimeout(() => liveRes(id), 650); });
document.addEventListener("change", e => { const el = e.target; if (el.matches && el.matches("[data-live-toggle]")) { try { localStorage.setItem(KEY + "-live", el.checked ? "1" : "0"); } catch (er) {} toast(el.checked ? "El resultado se actualizará mientras escribes" : "El resultado se actualizará al presionar Calcular"); return; }
  if (el.dataset && el.dataset.c && el.dataset.k && el.tagName === "SELECT" && !el.dataset.re && !LIVE_SKIP.has(el.dataset.c) && liveOn()) { clearTimeout(liveT); const id = el.dataset.c; liveT = setTimeout(() => liveRes(id), 200); } });
function wc1Init(root){
  const a = root.querySelector(".card.form .actions"); if (a && C[cur] && !LIVE_SKIP.has(cur) && !a.querySelector("[data-live-toggle]")) a.insertAdjacentHTML("beforeend", '<label class="chk livechk no-print"><input type="checkbox" data-live-toggle' + (liveOn() ? " checked" : "") + "> Actualizar el resultado mientras escribo</label>");
  root.querySelectorAll(".qsl").forEach(eoqSlUpd); }
