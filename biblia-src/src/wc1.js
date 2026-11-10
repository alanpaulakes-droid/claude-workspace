/* ============ FASE 4: DIAGRAMAS DE LAS CALCULADORAS E INTERACTIVIDAD ============ */

/* ---------- Ishikawa: textos completos (ajuste de línea), cabeza siempre visible y alto según el número de causas ---------- */
function ishiSVG(problem, cats){
  const nT = Math.ceil(cats.length / 2), top = cats.slice(0, nT), bot = cats.slice(nT), nC = Math.max(top.length, bot.length, 1);
  const W = 1040, xh = 790, colW = (xh - 40) / nC, chars = Math.max(14, Math.floor((colW - 46) / 6.4));
  const prep = c => ({ name:dgWrap(c[0], Math.max(14, Math.floor(colW / 7.5))).slice(0, 2), causes:c[1].slice(0, 6).map(t => dgWrap(t, chars).slice(0, 3)) });
  const T = top.map(prep), B = bot.map(prep);
  const need = arr => Math.max(3, ...arr.map(c => c.causes.reduce((s, x) => s + x.length * 13 + 12, 0)));
  const hTop = need(T) + 50, hBot = need(B) + 50, y0 = hTop + 20, H = y0 + hBot + 20;
  let g = '<line class="s1" x1="30" y1="' + y0 + '" x2="' + xh + '" y2="' + y0 + '" style="stroke-width:3"/><polygon class="d1" points="' + xh + "," + (y0 - 10) + " " + (xh + 16) + "," + y0 + " " + xh + "," + (y0 + 10) + '"/>';
  const pl = dgWrap(problem || "Problema", 24).slice(0, 6), bh = Math.max(70, pl.length * 16 + 26);
  g += '<rect class="boxc" x="' + (xh + 22) + '" y="' + (y0 - bh / 2) + '" width="' + (W - xh - 30) + '" height="' + bh + '" rx="8"/>' + dgText(xh + 22 + (W - xh - 30) / 2, y0, pl, { lh:16, st:"font-weight:700" });
  const branch = (c, j, up) => { const xa = 40 + colW * (j + 1) - 14, ey = up ? 34 : H - 34, dx = Math.min(90, colW * 0.4), xb = xa - dx; let s = '<line class="s2" x1="' + xb + '" y1="' + ey + '" x2="' + xa + '" y2="' + y0 + '" style="stroke-width:2"/>';
    s += dgText(xb, up ? ey - 14 - (c.name.length - 1) * 7 : ey + 14 + (c.name.length - 1) * 7, c.name, { lh:14, st:"font-weight:700" });
    let acc = 22; const span = Math.abs(y0 - ey);
    c.causes.forEach(L => { const hh = L.length * 13 + 12, f = (acc + hh / 2) / (span + 10); acc += hh; const yy = up ? ey + f * span : ey - f * span, xx = xb + (xa - xb) * f;
      s += '<line class="sm" x1="' + (xx - 14) + '" y1="' + yy + '" x2="' + xx + '" y2="' + yy + '"/>' + dgText(xx - 18, yy, L, { a:"end", lh:13, st:"font-size:11px" }); });
    return s; };
  T.forEach((c, j) => g += branch(c, j, true)); B.forEach((c, j) => g += branch(c, j + (nC - B.length) / 2, false));
  return '<figure class="ch dg"><div class="sv"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Diagrama de Ishikawa" style="min-width:640px">' + g + '</svg></div><figcaption>Las causas más probables se verifican con datos (Pareto, gráficos de control, pruebas) antes de actuar. En el celular desliza el diagrama hacia el lado.</figcaption></figure>';
}

/* ---------- Red de actividades (actividad en el nodo) con la ruta crítica destacada ---------- */
function cpmNet(A, order){
  const lev = {}; order.forEach(id => { lev[id] = A[id].p.length ? 1 + Math.max.apply(null, A[id].p.map(p => lev[p])) : 0; });
  const cols = {}; order.forEach(id => (cols[lev[id]] = cols[lev[id]] || []).push(id));
  const nL = Object.keys(cols).length, maxR = Math.max.apply(null, Object.values(cols).map(c => c.length));
  const bw = 132, bh = 72, gx = 54, gy = 26, W = 30 + nL * (bw + gx), H = 30 + maxR * (bh + gy), P = {}, mk = "na" + (++DGN);
  Object.keys(cols).forEach(l => { const c = cols[l], off = (maxR - c.length) * (bh + gy) / 2; c.forEach((id, r) => { P[id] = [20 + l * (bw + gx), 20 + off + r * (bh + gy)]; }); });
  const f = x => nf(x, Math.abs(x - Math.round(x)) < 1e-9 ? 0 : 1);
  let g = dgDefs(mk);
  order.forEach(id => A[id].p.forEach(p => { const crit = A[id].crit && A[p].crit && Math.abs(A[p].EF - A[id].ES) < 1e-9, [x1, y1] = P[p], [x2, y2] = P[id];
    g += '<path d="M' + (x1 + bw) + "," + (y1 + bh / 2) + " C" + (x1 + bw + gx / 2) + "," + (y1 + bh / 2) + " " + (x2 - gx / 2) + "," + (y2 + bh / 2) + " " + (x2 - 2) + "," + (y2 + bh / 2) + '" class="' + (crit ? "dgcrit" : "dga") + '" marker-end="url(#' + mk + ')"/>'; }));
  order.forEach(id => { const a = A[id], [x, y] = P[id];
    g += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="6" class="' + (a.crit ? "boxc" : "box") + '"/><line class="gr" x1="' + x + '" y1="' + (y + 22) + '" x2="' + (x + bw) + '" y2="' + (y + 22) + '"/><line class="gr" x1="' + x + '" y1="' + (y + bh - 22) + '" x2="' + (x + bw) + '" y2="' + (y + bh - 22) + '"/>' +
      '<text x="' + (x + 8) + '" y="' + (y + 15) + '" class="mu">' + f(a.ES) + '</text><text x="' + (x + bw / 2) + '" y="' + (y + 15) + '" text-anchor="middle" class="mu">' + f(a.te) + '</text><text x="' + (x + bw - 8) + '" y="' + (y + 15) + '" text-anchor="end" class="mu">' + f(a.EF) + "</text>" +
      '<text x="' + (x + bw / 2) + '" y="' + (y + bh / 2 + 5) + '" text-anchor="middle" style="font-weight:700;font-size:14px">' + esc(id) + "</text>" +
      '<text x="' + (x + 8) + '" y="' + (y + bh - 7) + '" class="mu">' + f(a.LS) + '</text><text x="' + (x + bw / 2) + '" y="' + (y + bh - 7) + '" text-anchor="middle" class="mu">H ' + f(a.HT) + '</text><text x="' + (x + bw - 8) + '" y="' + (y + bh - 7) + '" text-anchor="end" class="mu">' + f(a.LF) + "</text>"; });
  return '<figure class="ch dg"><div class="sv"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Red del proyecto" style="min-width:' + Math.min(W, 640) + 'px">' + g + '</svg></div><figcaption>Red del proyecto (actividad en el nodo). Arriba: inicio temprano · duración · término temprano. Abajo: inicio tardío · holgura · término tardío. En cobre, la ruta crítica.</figcaption></figure>';
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
  or.replaceWith(nr); try { abbrify(nr); } catch (e) {} try { calloutCap(document.getElementById("app")); } catch (e) {} try { wrapWide(nr); katexMotor(nr); } catch (e) {} try { nr.querySelectorAll(".qsl").forEach(eoqSlUpd); } catch (e) {}
}
document.addEventListener("input", e => { const el = e.target; if (!el.dataset || !el.dataset.c || !el.dataset.k || LIVE_SKIP.has(el.dataset.c) || !liveOn()) return; clearTimeout(liveT); const id = el.dataset.c; liveT = setTimeout(() => liveRes(id), 650); });
document.addEventListener("change", e => { const el = e.target; if (el.matches && el.matches("[data-live-toggle]")) { try { localStorage.setItem(KEY + "-live", el.checked ? "1" : "0"); } catch (er) {} toast(el.checked ? "El resultado se actualizará mientras escribes" : "El resultado se actualizará al presionar Calcular"); return; }
  if (el.dataset && el.dataset.c && el.dataset.k && el.tagName === "SELECT" && !el.dataset.re && !LIVE_SKIP.has(el.dataset.c) && liveOn()) { clearTimeout(liveT); const id = el.dataset.c; liveT = setTimeout(() => liveRes(id), 200); } });
function wc1Init(root){
  const a = root.querySelector(".card.form .actions"); if (a && C[cur] && !LIVE_SKIP.has(cur) && !a.querySelector("[data-live-toggle]")) a.insertAdjacentHTML("beforeend", '<label class="chk livechk no-print"><input type="checkbox" data-live-toggle' + (liveOn() ? " checked" : "") + "> Actualizar el resultado mientras escribo</label>");
  root.querySelectorAll(".qsl").forEach(eoqSlUpd); }
