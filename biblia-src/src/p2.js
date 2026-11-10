<script>
(function(){
"use strict";
/* Referencia a un ícono del sprite (el sprite se arma al iniciar, en w5.js · icoSprite) */
const icoUse = id => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-' + id + '"/></svg>';
/* ============ ESTADO ============ */
const KEY = "biblia-ii-v1";
let S = { v:{}, snap:{}, done:{}, proj:{ nombre:"", autor:"", empresa:"", fecha:"" }, quiz:{}, last:null };
try { const t = JSON.parse(localStorage.getItem(KEY) || "null"); if (t && typeof t === "object") S = Object.assign(S, t); } catch (e) {}
let saveT = null;
function save(){ clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }, 150); }

/* ============ FORMATO ============ */
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const fin = x => typeof x === "number" && isFinite(x);
function nf(x, d){ if (d == null) d = 2; if (!fin(x)) return "—"; if (Math.abs(x) < Math.pow(10, -d) / 2) x = 0; return x.toLocaleString("es-CL", { minimumFractionDigits:d, maximumFractionDigits:d }); }
const n0 = x => nf(x, 0), n1 = x => nf(x, 1), n3 = x => nf(x, 3), n4 = x => nf(x, 4);
const pc = (x, d) => fin(x) ? nf(x * 100, d == null ? 1 : d) + " %" : "—";
const money = (x, d) => fin(x) ? (x < 0 ? "−$ " : "$ ") + nf(Math.abs(x), d || 0) : "—";
const sum = a => a.reduce((s, x) => s + x, 0);
const mean = a => a.length ? sum(a) / a.length : NaN;
function sd(a){ if (a.length < 2) return NaN; const m = mean(a); return Math.sqrt(sum(a.map(x => (x - m) * (x - m))) / (a.length - 1)); }
function fail(m){ throw new Error(m); }

/* ============ LECTURA DE DATOS ============ */
function num(s){
  if (typeof s === "number") return s;
  s = String(s == null ? "" : s).trim().replace(/[\s$%]/g, "");
  if (!s) return NaN;
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, "").replace(",", ".");
  else s = s.replace(",", ".");
  s = s.replace(/^−/, "-");
  return Number(s);
}
function list(s, name){
  const t = String(s || "").split(/[\s;]+/).filter(x => x !== "");
  return t.map(x => { const v = num(x.replace(/,$/, "")); if (!fin(v)) fail("En " + (name || "la lista") + " hay un valor que no es número: «" + x + "». Separa con espacios, punto y coma o saltos de línea."); return v; });
}
function rows(s){
  return String(s || "").split(/\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#")).map(l => (/[;\t|]/.test(l) ? l.split(/\s*[;\t|]\s*/) : l.split(/\s+/)).map(x => x.trim()));
}
function need(v, k, name, o){
  const x = num(v[k]); o = o || {};
  if (!fin(x)) fail("Falta un valor numérico en «" + name + "».");
  if (o.pos && !(x > 0)) fail("«" + name + "» debe ser mayor que cero.");
  if (o.nn && x < 0) fail("«" + name + "» no puede ser negativo.");
  if (o.int && Math.round(x) !== x) fail("«" + name + "» debe ser un número entero.");
  if (o.max != null && x > o.max) fail("«" + name + "» no puede ser mayor que " + o.max + ".");
  return x;
}
function opt(v, k){ const x = num(v[k]); return fin(x) ? x : null; }

/* ============ BLOQUES DE RESULTADO ============ */
const kpi = (l, v, u, c) => '<div class="kpi ' + (c || "") + '"><div class="l">' + l + '</div><div class="v">' + v + (u ? " <small>" + u + "</small>" : "") + "</div></div>";
const kpis = a => '<div class="kpis">' + a.join("") + "</div>";
const note = (m, c) => '<div class="note ' + (c || "") + '">' + m + "</div>";
const pill = (c, t) => '<span class="pill ' + c + '">' + t + "</span>";
const okp = (b, t1, t2) => b ? pill("ok", "✓ " + (t1 || "Cumple")) : pill("bad", "✗ " + (t2 || "No cumple"));
function steps(a){
  return '<div class="steps">' + a.map((s, i) => '<div class="step ' + (s.c || "") + '"><span class="sn">' + (i + 1) + '</span><div class="sb"><h4>' + s.t + "</h4>" +
    (s.q ? '<p class="q">' + s.q + "</p>" : "") + (s.f ? M(s.f) : "") + (s.s ? M(s.s, "s") : "") +
    (s.r ? '<p class="r">Resultado: <span>' + s.r + "</span></p>" : "") + (s.why ? '<p class="why"><b>¿Por qué?</b> ' + s.why + "</p>" : "") + "</div></div>").join("") + "</div>";
}
function table(head, body, o){
  o = o || {}; const N = o.num || [];
  const th = head.map((h, i) => "<th" + (N.includes(i) ? ' class="num"' : "") + ">" + h + "</th>").join("");
  const tb = body.map(r => { const cls = r._c ? ' class="' + r._c + '"' : ""; return "<tr" + cls + ">" + r.map((c, i) => "<td" + (N.includes(i) ? ' class="num"' : "") + ">" + (c == null ? "" : c) + "</td>").join("") + "</tr>"; }).join("");
  const tf = o.foot ? '<tr class="tot">' + o.foot.map((c, i) => "<td" + (N.includes(i) ? ' class="num"' : "") + ">" + (c == null ? "" : c) + "</td>").join("") + "</tr>" : "";
  return '<div class="tbl-wrap' + (o.tall ? " tall" : "") + '"><table class="' + (o.cls || "") + '"><thead><tr>' + th + "</tr></thead><tbody>" + tb + tf + "</tbody></table></div>";
}
const rowc = (r, c) => { r._c = c; return r; };
const h3 = t => '<h3 style="margin-top:18px">' + t + "</h3>";

/* ============ ESTADÍSTICA ============ */
function erf(x){ const t = 1 / (1 + 0.3275911 * Math.abs(x)); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; }
const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
function invNorm(p){
  if (!(p > 0 && p < 1)) return NaN;
  const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  const pl = 0.02425; let q, r;
  if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  q = p - 0.5; r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
function gammaln(x){ const g = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (let j = 0; j < 6; j++) s += g[j] / ++y; return -t + Math.log(2.5066282746310005 * s / x); }
function betacf(a, b, x){ let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; let h = d;
  for (let m = 1; m <= 200; m++) { const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-12) break; }
  return h; }
function ibeta(x, a, b){ if (x <= 0) return 0; if (x >= 1) return 1; const bt = Math.exp(gammaln(a + b) - gammaln(a) - gammaln(b) + a * Math.log(x) + b * Math.log(1 - x)); return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b; }
function tCDF(t, df){ const x = df / (df + t * t); const p = 0.5 * ibeta(x, df / 2, 0.5); return t >= 0 ? 1 - p : p; }
function tInv(p, df){ let lo = -1000, hi = 1000; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (tCDF(m, df) < p) lo = m; else hi = m; } return (lo + hi) / 2; }
const zConf = cl => invNorm(1 - (1 - cl) / 2);

/* ============ FINANZAS ============ */
const npv = (r, F) => F.reduce((s, f, t) => s + f / Math.pow(1 + r, t), 0);
function irr(F){
  const roots = []; let prevR = -0.99, prevV = npv(prevR, F);
  for (let r = -0.98; r <= 10; r += (r < 1 ? 0.005 : 0.05)) {
    const v = npv(r, F);
    if (fin(v) && fin(prevV) && (v === 0 || prevV * v < 0)) { let a = prevR, b = r, fa = prevV; for (let i = 0; i < 100; i++) { const m = (a + b) / 2, fm = npv(m, F); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } } roots.push((a + b) / 2); }
    prevR = r; prevV = v;
  }
  return roots;
}
function fct(i, n){
  if (Math.abs(i) < 1e-12) return { FP:1, PF:1, AP:1 / n, PA:n, AF:1 / n, FA:n, PG:n * (n - 1) / 2, AG:(n - 1) / 2 };
  const q = Math.pow(1 + i, n);
  return { FP:q, PF:1 / q, AP:i * q / (q - 1), PA:(q - 1) / (i * q), AF:i / (q - 1), FA:(q - 1) / i, PG:(q - i * n - 1) / (i * i * q), AG:1 / i - n / (q - 1) };
}

/* ============ PROGRAMACIÓN LINEAL (simplex de dos fases) ============ */
function lpSolve(c, A, ops, b, maxim){
  const m = A.length, n = c.length, EPS = 1e-9;
  const R = [], O = [], B = [], flip = [];
  for (let i = 0; i < m; i++) { let a = A[i].slice(), o = ops[i], bi = b[i], f = false;
    if (bi < 0) { a = a.map(x => -x); bi = -bi; o = o === "<=" ? ">=" : o === ">=" ? "<=" : "="; f = true; }
    R.push(a); O.push(o); B.push(bi); flip.push(f); }
  const nS = O.filter(o => o !== "=").length, nA = O.filter(o => o !== "<=").length, N = n + nS + nA;
  const T = [], basis = [], dcol = [], isArt = new Array(N).fill(false);
  let si = n, ai = n + nS;
  for (let i = 0; i < m; i++) { const row = new Array(N + 1).fill(0); for (let j = 0; j < n; j++) row[j] = R[i][j];
    if (O[i] === "<=") { row[si] = 1; basis[i] = si; dcol[i] = si; si++; }
    else if (O[i] === ">=") { row[si] = -1; si++; row[ai] = 1; isArt[ai] = true; basis[i] = ai; dcol[i] = ai; ai++; }
    else { row[ai] = 1; isArt[ai] = true; basis[i] = ai; dcol[i] = ai; ai++; }
    row[N] = B[i]; T.push(row); }
  function pivot(r, k){ const pv = T[r][k]; for (let j = 0; j <= N; j++) T[r][j] /= pv;
    for (let i = 0; i < T.length; i++) if (i !== r) { const f = T[i][k]; if (Math.abs(f) > 0) for (let j = 0; j <= N; j++) T[i][j] -= f * T[r][j]; }
    basis[r] = k; }
  function run(z, allow){ let it = 0;
    while (it++ < 5000) { let k = -1; for (let j = 0; j < N; j++) if (allow(j) && z[j] < -EPS) { k = j; break; }
      if (k < 0) return "opt";
      let r = -1, best = Infinity; for (let i = 0; i < m; i++) if (T[i][k] > EPS) { const q = T[i][N] / T[i][k]; if (q < best - EPS || (Math.abs(q - best) <= EPS && basis[i] < basis[r])) { best = q; r = i; } }
      if (r < 0) return "unb";
      const pv = T[r][k]; for (let j = 0; j <= N; j++) T[r][j] /= pv;
      for (let i = 0; i < m; i++) if (i !== r) { const f = T[i][k]; if (f) for (let j = 0; j <= N; j++) T[i][j] -= f * T[r][j]; }
      const fz = z[k]; for (let j = 0; j <= N; j++) z[j] -= fz * T[r][j];
      basis[r] = k; }
    return "it"; }
  if (nA > 0) { const z = new Array(N + 1).fill(0); for (let j = 0; j < N; j++) if (isArt[j]) z[j] = 1;
    for (let i = 0; i < m; i++) if (isArt[basis[i]]) for (let j = 0; j <= N; j++) z[j] -= T[i][j];
    const st = run(z, () => true); if (st === "it") return { status:"it" };
    if (z[N] < -1e-7) return { status:"inf" };
    for (let i = 0; i < m; i++) if (isArt[basis[i]]) { for (let j = 0; j < N; j++) if (!isArt[j] && Math.abs(T[i][j]) > EPS) { pivot(i, j); break; } } }
  const cc = c.map(x => maxim ? x : -x), z = new Array(N + 1).fill(0);
  for (let j = 0; j < n; j++) z[j] = -cc[j];
  for (let i = 0; i < m; i++) { const bj = basis[i]; const coef = bj < n ? -cc[bj] : 0; if (coef) for (let j = 0; j <= N; j++) z[j] -= coef * T[i][j]; }
  const st = run(z, j => !isArt[j]);
  if (st === "unb") return { status:"unb" };
  if (st === "it") return { status:"it" };
  const x = new Array(n).fill(0); for (let i = 0; i < m; i++) if (basis[i] < n) x[basis[i]] = T[i][N];
  const zv = sum(c.map((cj, j) => cj * x[j]));
  const dual = dcol.map((col, i) => { let y = z[col]; if (flip[i]) y = -y; if (!maxim) y = -y; return y; });
  return { status:"opt", x, z:zv, dual };
}
/* Programación entera: ramificación y acotamiento (Branch and Bound) sobre el simplex */
function ilpSolve(c, A, ops, b, maxim){
  const root = lpSolve(c, A, ops, b, maxim); if (root.status !== "opt") return root;
  const better = (z, w) => maxim ? z > w + 1e-7 : z < w - 1e-7;
  let best = null, nodes = 0; const stack = [{ A:[], ops:[], b:[], d:0 }], tree = [];
  while (stack.length && nodes < 4000) { const nd = stack.pop(); nodes++;
    const R = nodes === 1 ? root : lpSolve(c, A.concat(nd.A), ops.concat(nd.ops), b.concat(nd.b), maxim);
    if (R.status !== "opt") { if (tree.length < 12) tree.push({ d:nd.d, cut:nd.cut, st:"Infactible: se descarta" }); continue; }
    if (best && !better(R.z, best.z)) { if (tree.length < 12) tree.push({ d:nd.d, cut:nd.cut, z:R.z, st:"No supera a la mejor entera: se poda" }); continue; }
    let j = -1, fr = 0; R.x.forEach((x, k) => { const f = Math.abs(x - Math.round(x)); if (f > 1e-6 && f > fr) { fr = f; j = k; } });
    if (j < 0) { best = { status:"opt", x:R.x.map(x => Math.round(x)), z:R.z }; if (tree.length < 12) tree.push({ d:nd.d, cut:nd.cut, z:R.z, x:best.x, st:"Solución entera: nueva mejor" }); continue; }
    if (tree.length < 12) tree.push({ d:nd.d, cut:nd.cut, z:R.z, x:R.x, st:"Fraccionaria: se ramifica" });
    const row = c.map((_, k) => k === j ? 1 : 0), fl = Math.floor(R.x[j] + 1e-9);
    stack.push({ A:nd.A.concat([row]), ops:nd.ops.concat(["<="]), b:nd.b.concat([fl]), d:nd.d + 1, cut:[j, "≤", fl] });
    stack.push({ A:nd.A.concat([row]), ops:nd.ops.concat([">="]), b:nd.b.concat([fl + 1]), d:nd.d + 1, cut:[j, "≥", fl + 1] }); }
  if (!best) return { status:"inf" };
  best.z = sum(c.map((cj, k) => cj * best.x[k])); best.relax = root; best.nodes = nodes; best.tree = tree; best.dual = A.map(() => NaN); best.cut = nodes >= 4000;
  return best;
}

/* ============ GRÁFICOS (SVG con tokens del tema) ============ */
function niceTicks(lo, hi, cnt){
  if (!fin(lo) || !fin(hi)) return [0, 1];
  if (lo === hi) { lo -= 1; hi += 1; }
  const span = hi - lo, step0 = span / (cnt || 5), mag = Math.pow(10, Math.floor(Math.log10(step0))), r = step0 / mag;
  const step = (r < 1.5 ? 1 : r < 3 ? 2 : r < 7 ? 5 : 10) * mag;
  const out = []; for (let v = Math.floor(lo / step) * step; v <= hi + step * 0.5; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  return out;
}
function tickLbl(v){ const a = Math.abs(v); if (a >= 1e9) return nf(v / 1e9, 1) + " MM"; if (a >= 1e6) return nf(v / 1e6, a >= 1e7 ? 0 : 1) + " M"; if (a >= 1e4) return nf(v / 1e3, 0) + " k"; if (a >= 100 || Number.isInteger(v)) return nf(v, 0); return nf(v, a < 1 ? 2 : 1); }
/* o: {series:[{pts,cls,dot,lbl}], h:[{y,cls,lbl}], v:[{x,cls,lbl}], xlab, ylab, ymin, ymax, xmin, xmax, bars:[{x,y,cls,lbl}], bw, poly:[{pts,cls}], xcat:[labels]} */
function chart(o){
  const W = 760, H = o.h0 || 300, L = 62, Rr = 18, T = 16, Bm = o.xcat ? 56 : 42;
  let xs = [], ys = [];
  (o.series || []).forEach(s => s.pts.forEach(p => { xs.push(p[0]); ys.push(p[1]); }));
  (o.bars || []).forEach(b => { xs.push(b.x); ys.push(b.y); ys.push(0); });
  (o.h || []).forEach(h => ys.push(h.y)); (o.v || []).forEach(v => xs.push(v.x));
  (o.poly || []).forEach(p => p.pts.forEach(q => { xs.push(q[0]); ys.push(q[1]); }));
  xs = xs.filter(fin); ys = ys.filter(fin);
  let x0 = o.xmin != null ? o.xmin : Math.min.apply(null, xs), x1 = o.xmax != null ? o.xmax : Math.max.apply(null, xs);
  let y0 = o.ymin != null ? o.ymin : Math.min.apply(null, ys), y1 = o.ymax != null ? o.ymax : Math.max.apply(null, ys);
  if (o.bars && o.bars.length) { x0 -= 0.6; x1 += 0.6; }
  if (x0 === x1) { x0 -= 1; x1 += 1; }
  const yt = niceTicks(y0, y1, 5); if (o.ymin == null) y0 = Math.min(y0, yt[0]); if (o.ymax == null) y1 = Math.max(y1, yt[yt.length - 1]);
  if (y0 === y1) { y0 -= 1; y1 += 1; }
  const X = x => L + (x - x0) / (x1 - x0) * (W - L - Rr), Y = y => T + (1 - (y - y0) / (y1 - y0)) * (H - T - Bm);
  let g = "";
  yt.filter(t => t >= y0 - 1e-9 && t <= y1 + 1e-9).forEach(t => { g += '<line class="gr" x1="' + L + '" x2="' + (W - Rr) + '" y1="' + Y(t) + '" y2="' + Y(t) + '"/><text class="mu" x="' + (L - 6) + '" y="' + (Y(t) + 4) + '" text-anchor="end">' + tickLbl(t) + "</text>"; });
  if (o.xcat) o.xcat.forEach((c, i) => { const xx = X(i + 1); g += '<text class="mu" x="' + xx + '" y="' + (H - Bm + 16) + '" text-anchor="middle">' + esc(String(c).slice(0, 12)) + "</text>"; });
  else niceTicks(x0, x1, 8).filter(t => t >= x0 - 1e-9 && t <= x1 + 1e-9).forEach(t => { g += '<text class="mu" x="' + X(t) + '" y="' + (H - Bm + 16) + '" text-anchor="middle">' + tickLbl(t) + "</text>"; });
  g += '<line class="ax" x1="' + L + '" x2="' + (W - Rr) + '" y1="' + Y(Math.max(y0, Math.min(y1, 0))) + '" y2="' + Y(Math.max(y0, Math.min(y1, 0))) + '"/><line class="ax" x1="' + L + '" x2="' + L + '" y1="' + T + '" y2="' + (H - Bm) + '"/>';
  (o.poly || []).forEach(p => { g += '<polygon class="' + (p.cls || "reg") + '" points="' + p.pts.map(q => X(q[0]) + "," + Y(q[1])).join(" ") + '"/>'; });
  const bw = o.bars && o.bars.length ? Math.max(4, Math.min(60, (W - L - Rr) / ((x1 - x0) || 1) * (o.bw || 0.7))) : 0;
  (o.bars || []).forEach(b => { const ya = Y(Math.max(0, b.y)), yb = Y(Math.min(0, b.y)); g += '<rect class="' + (b.cls || "bar1") + '" x="' + (X(b.x) - bw / 2) + '" y="' + ya + '" width="' + bw + '" height="' + Math.max(0.5, yb - ya) + '" rx="2"/>' + (b.lbl ? '<text x="' + X(b.x) + '" y="' + (ya - 4) + '" text-anchor="middle" class="mu">' + b.lbl + "</text>" : ""); });
  (o.h || []).forEach(h => { if (h.y < y0 || h.y > y1) return; g += '<line class="' + (h.cls || "sb") + '" x1="' + L + '" x2="' + (W - Rr) + '" y1="' + Y(h.y) + '" y2="' + Y(h.y) + '"/>' + (h.lbl ? '<text class="lg" x="' + (W - Rr - 4) + '" y="' + (Y(h.y) - 4) + '" text-anchor="end">' + h.lbl + "</text>" : ""); });
  (o.v || []).forEach(v => { g += '<line class="' + (v.cls || "sm") + '" x1="' + X(v.x) + '" x2="' + X(v.x) + '" y1="' + T + '" y2="' + (H - Bm) + '"/>' + (v.lbl ? '<text class="lg" x="' + (X(v.x) + 4) + '" y="' + (T + 12) + '">' + v.lbl + "</text>" : ""); });
  (o.series || []).forEach(s => { const pts = s.pts.filter(p => fin(p[0]) && fin(p[1]));
    if (!s.only) g += '<polyline class="' + (s.cls || "s1") + '" points="' + pts.map(p => X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1)).join(" ") + '"' + (s.dash ? ' stroke-dasharray="6 4"' : "") + "/>";
    if (s.dot) pts.forEach((p, i) => { const bad = s.badIdx && s.badIdx.includes(i); g += '<circle class="' + (bad ? "db" : s.dot) + '" cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="' + (bad ? 5 : (s.r || 3.5)) + '"/>' + (s.tags && s.tags[i] ? '<text x="' + (X(p[0]) + 7) + '" y="' + (Y(p[1]) - 6) + '">' + esc(s.tags[i]) + "</text>" : ""); }); });
  if (o.xlab) g += '<text class="mu" x="' + ((W + L) / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + o.xlab + "</text>";
  if (o.ylab) g += '<text class="mu" x="14" y="' + ((H - Bm + T) / 2) + '" text-anchor="middle" transform="rotate(-90 14 ' + ((H - Bm + T) / 2) + ')">' + o.ylab + "</text>";
  const lg = (o.legend || []).map(l => '<span><i style="background:var(' + l[0] + ')"></i>' + l[1] + "</span>").join("");
  return '<figure class="ch"><div class="sv"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(o.title || "Gráfico") + '">' + g + "</svg></div>" + (lg ? '<div class="legend">' + lg + "</div>" : "") + (o.cap ? "<figcaption>" + o.cap + "</figcaption>" : "") + "</figure>";
}
function gantt(items, o){
  o = o || {}; const W = 760, rowH = 26, L = 110, T = 22, end = Math.max.apply(null, items.map(i => i.s + i.d).concat([1]));
  const H = T + items.length * rowH + 24, X = x => L + x / end * (W - L - 16);
  let g = ""; niceTicks(0, end, 10).filter(t => t <= end + 1e-9).forEach(t => { g += '<line class="gr" x1="' + X(t) + '" x2="' + X(t) + '" y1="' + (T - 4) + '" y2="' + (H - 20) + '"/><text class="mu" x="' + X(t) + '" y="' + (H - 6) + '" text-anchor="middle">' + tickLbl(t) + "</text>"; });
  items.forEach((it, i) => { const y = T + i * rowH; g += '<text x="' + (L - 8) + '" y="' + (y + 16) + '" text-anchor="end">' + esc(it.id) + "</text>";
    if (it.slack > 0) g += '<rect class="barm" x="' + X(it.s + it.d) + '" y="' + (y + 9) + '" width="' + (X(it.s + it.d + it.slack) - X(it.s + it.d)) + '" height="6" rx="3"/>';
    g += '<rect class="' + (it.crit ? "bar2" : "bar1") + '" x="' + X(it.s) + '" y="' + (y + 4) + '" width="' + Math.max(1, X(it.s + it.d) - X(it.s)) + '" height="16" rx="3"/>'; });
  return '<figure class="ch"><div class="sv"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Carta Gantt">' + g + '</svg></div><div class="legend">' + (o.leg || '<span><i style="background:var(--copper)"></i>Ruta crítica</span><span><i style="background:var(--blue)"></i>Actividad con holgura</span><span><i style="background:var(--line)"></i>Holgura total</span>') + "</div></figure>";
}
