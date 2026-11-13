/* ============ FASE 3: NÚCLEO DE CÁLCULO (funciones puras, sin interfaz) ============
   Cada función recibe números y devuelve un objeto con resultados. No lee ni escribe HTML ni el DOM.
   Las calculadoras de la interfaz solo leen los campos, llaman a estas funciones y dibujan el resultado.
   Las pruebas (TEST3) comparan cada función con resultados conocidos. */
const NUC = {
  /* Lote económico de pedido / de producción */
  eoq(D, S, Cu, i, dias, L, p){
    const d = D / dias; if (p > 0 && p <= d) fail("La tasa de producción (" + nf(p, 1) + "/día) debe superar a la demanda diaria (" + nf(d, 1) + "/día).");
    const fac = p > 0 ? 1 - d / p : 1, H = i * Cu, Q = Math.sqrt(2 * D * S / (H * fac)), Imax = Q * fac, N = D / Q, T = dias / N, CTp = D / Q * S, CTm = H * Imax / 2, CT = CTp + CTm + D * Cu, ROP = d * L;
    return { d, fac, H, Q, Imax, N, T, CTp, CTm, CT, ROP };
  },
  /* Cola M/M/c (M/M/1 con c = 1) */
  mmc(lam, mu, k, cw, cs){
    const r = lam / mu, rho = r / k; if (rho >= 1) return null;
    let s0 = 0, f = 1; for (let n = 0; n < k; n++) { if (n > 0) f *= n; s0 += Math.pow(r, n) / f; }
    const fk = f * (k > 0 ? k : 1), tail = Math.pow(r, k) / (fk * (1 - rho)), P0 = 1 / (s0 + tail);
    const Lq = P0 * Math.pow(r, k) * rho / (fk * Math.pow(1 - rho, 2)), Wq = Lq / lam, W = Wq + 1 / mu, L = lam * W, Pw = tail * P0;
    return { k, rho, P0, Lq, Wq, W, L, Pw, CT:k * (cs || 0) + L * (cw || 0) };
  },
  /* VAN, TIR, PRI, IVAN y beneficio/costo */
  van(r, Fl){
    const fac = Fl.map((f, t) => 1 / Math.pow(1 + r, t)), vp = Fl.map((f, t) => f * fac[t]), VAN = sum(vp);
    let ac = 0, acd = 0; const acA = [], acdA = []; Fl.forEach((f, t) => { ac += f; acd += vp[t]; acA.push(ac); acdA.push(acd); });
    const pri = a => { if (a[0] >= 0) return 0; for (let t = 1; t < a.length; t++) if (a[t] >= 0) return t - 1 + (-a[t - 1]) / (a[t] - a[t - 1]); return NaN; };
    const PRI = pri(acA), PRId = pri(acdA), roots = irr(Fl), TIR = roots.length ? roots[0] : NaN;
    const I0 = Fl[0] < 0 ? -Fl[0] : NaN, IVAN = VAN / I0, VPpos = sum(vp.slice(1).filter(x => x > 0)), VPneg = -sum(vp.slice(1).filter(x => x < 0)), BC = VPpos / ((fin(I0) ? I0 : 0) + VPneg);
    return { fac, vp, VAN, acA, acdA, PRI, PRId, roots, TIR, I0, IVAN, VPpos, VPneg, BC };
  },
  /* Punto de equilibrio */
  equilibrio(CF, p, cv, U, t, Qp){
    const mc = p - cv; if (mc <= 0) fail("El precio debe ser mayor que el costo variable: con margen negativo nunca hay equilibrio.");
    if (t >= 1) fail("La tasa de impuesto debe ser menor que 100 %.");
    const Q = CF / mc, V = Q * p, rmc = mc / p, Qo = (CF + U / (1 - t)) / mc, ms = Qp ? (Qp - Q) / Qp : NaN, UAI = Qp ? Qp * mc - CF : NaN, GAO = Qp ? Qp * mc / UAI : NaN;
    return { mc, Q, V, rmc, Qo, ms, UAI, GAO };
  },
  /* Capacidad de proceso */
  capacidad(L, U, m, s){
    const Cp = (U - L) / (6 * s), Cpu = (U - m) / (3 * s), Cpl = (m - L) / (3 * s), Cpk = Math.min(Cpu, Cpl), pL = Phi((L - m) / s), pU = 1 - Phi((U - m) / s);
    return { Cp, Cpu, Cpl, Cpk, pL, pU, ppm:(pL + pU) * 1e6, zb:3 * Cpk };
  },
  /* Gráfico X̄-R */
  xr(G){
    const n = G[0].length, [A2, D3, D4, d2] = CC[n], xb = G.map(mean), R = G.map(r => Math.max.apply(null, r) - Math.min.apply(null, r)), X2 = mean(xb), Rb = mean(R);
    const LSCx = X2 + A2 * Rb, LICx = X2 - A2 * Rb, LSCr = D4 * Rb, LICr = D3 * Rb, sig = Rb / d2;
    const outX = xb.map((x, i) => x > LSCx || x < LICx ? i : -1).filter(i => i >= 0), outR = R.map((x, i) => x > LSCr || x < LICr ? i : -1).filter(i => i >= 0);
    let run = 0, runMax = 0, side = 0; xb.forEach(x => { const sd0 = x > X2 ? 1 : x < X2 ? -1 : 0; if (sd0 && sd0 === side) run++; else { run = 1; side = sd0; } runMax = Math.max(runMax, run); });
    return { n, A2, D3, D4, d2, xb, R, X2, Rb, LSCx, LICx, LSCr, LICr, sig, outX, outR, runMax, ok:!outX.length && !outR.length && runMax < 8 };
  },
  /* Balance de línea (heurística por prioridad) */
  balanceo(T, ids, takt, regla){
    const key = { rpw:x => x.rpw, lt:x => x.t, ns:x => x.nsuc }[regla] || (x => x.rpw);
    const done = new Set(), St = []; let cur = null;
    while (done.size < ids.length) {
      if (!cur) { cur = { tasks:[], t:0 }; St.push(cur); }
      const cand = ids.filter(id => !done.has(id) && T[id].p.every(p => done.has(p)) && T[id].t <= takt - cur.t + 1e-9).sort((a, b) => key(T[b]) - key(T[a]) || a.localeCompare(b));
      if (!cand.length) { cur = null; continue; }
      const x = cand[0]; cur.tasks.push(x); cur.t += T[x].t; done.add(x);
    }
    const tot = sum(ids.map(id => T[id].t)), Nmin = Math.ceil(tot / takt - 1e-9), N = St.length;
    return { St, tot, Nmin, N, ef:tot / (N * takt) };
  },
  /* Pronósticos */
  mediaMovil:(D, n) => D.map((_, t) => t >= n ? mean(D.slice(t - n, t)) : NaN),
  suavizamiento(D, a){ const N = D.length, es = [D[0]]; for (let t = 1; t <= N; t++) es[t] = a * D[t - 1] + (1 - a) * es[t - 1]; es[0] = NaN; return es; },
  tendencia(D){ const X = D.map((_, t) => t + 1), mx = mean(X), my = mean(D), b = sum(X.map((x, i) => (x - mx) * (D[i] - my))) / sum(X.map(x => (x - mx) * (x - mx))), a0 = my - b * mx; return { a0, b, lr:X.map(x => a0 + b * x) }; },
  errores(D, f){ const e = []; D.forEach((d, t) => { if (fin(f[t])) e.push({ d, f:f[t], e:d - f[t] }); }); const MAD = mean(e.map(x => Math.abs(x.e))), MSE = mean(e.map(x => x.e * x.e)), MAPE = mean(e.map(x => Math.abs(x.e) / x.d)), TS = sum(e.map(x => x.e)) / MAD; return { MAD, MSE, MAPE, TS, n:e.length }; },
  /* Regresión lineal simple */
  regresion(P){
    const n = P.length, X = P.map(p => p[0]), Y = P.map(p => p[1]), mx = mean(X), my = mean(Y), Sxx = sum(X.map(x => (x - mx) * (x - mx))), Sxy = sum(P.map(p => (p[0] - mx) * (p[1] - my))), Syy = sum(Y.map(y => (y - my) * (y - my)));
    if (Sxx === 0) fail("Todos los x son iguales: no se puede ajustar una recta.");
    const b = Sxy / Sxx, a = my - b * mx, r = Sxy / Math.sqrt(Sxx * Syy), SSE = sum(P.map(p => Math.pow(p[1] - (a + b * p[0]), 2))), se = Math.sqrt(SSE / (n - 2));
    return { n, X, Y, mx, my, Sxx, Sxy, Syy, b, a, r, SSE, se };
  },
  /* Programación lineal (método Simplex de dos fases y ramificación y acotamiento) */
  pl:(c, A, ops, b, maxim, entero) => entero ? ilpSolve(c, A, ops, b, maxim) : lpSolve(c, A, ops, b, maxim)
};

/* ---------- Lectura en lenguaje simple (se agrega al final del resultado) ---------- */
const lectura = h => note("<b>En palabras simples:</b> " + h, "info");

/* ---------- Validación central de rangos (se aplica antes de calcular) ---------- */
const RULES = {
  "van-tir":{ tasa:{ gt:-100 } }, equivalencias:{ i:{ gt:-100 }, val:{ min:0 } }, tasas:{ tasa:{ gt:-100 }, inf:{ gt:-100 } }, amortizacion:{ tasa:{ min:0 } },
  equilibrio:{ U:{ min:0 }, t:{ min:0, lt:100 }, Qp:{ min:0 } }, costeo:{ gav:{ min:0 }, m:{ min:0 }, iva:{ min:0, max:100 } },
  caue:{ i:{ gt:-100 } }, "vida-economica":{ i:{ gt:-100 } }, wacc:{ beta:{ min:0 }, prm:{ min:0 }, rp:{ min:0 }, kd:{ min:0 }, tc:{ min:0, lt:100 } },
  "flujo-caja":{ V1:{ min:0 }, cvp:{ min:0, max:100 }, t:{ min:0, lt:100 }, r:{ gt:-100 } },
  ratios:{ AC:{ min:0 }, INV:{ min:0 }, PC:{ min:0 }, AT:{ min:0 }, PT:{ min:0 }, VTA:{ min:0 }, CV:{ min:0 }, GF:{ min:0 }, CxC:{ min:0 } },
  eoq:{ S:{ gt:0 }, i:{ gt:0 }, L:{ min:0 }, p:{ min:0 } }, "stock-seguridad":{ sL:{ min:0 }, T:{ min:0 }, Cu:{ min:0 }, i:{ min:0 } },
  abc:{ A:{ gt:0, max:100 }, B:{ gt:0, max:100 } }, oee:{ cd:{ min:0 }, ce:{ min:0 } }, mrp:{ SS:{ min:0 }, Q:{ min:0 }, P:{ min:0 } },
  colas:{ cw:{ min:0 }, cs:{ min:0 } }, muestreo:{ p0:{ gt:0, lt:100 }, T:{ gt:0 }, U:{ min:0 }, V:{ gt:0 }, S:{ min:0 } }, productividad:{ p:{ min:0 } },
  pareto:{ cut:{ gt:0, max:100 } }, amef:{ lim:{ min:0 } }, muestra:{ p:{ gt:0, lt:100 }, s:{ gt:0 }, N:{ min:0 } }, cpm:{ T:{ min:0 } },
  localizacion:{ ct:{ min:0 } }, "simulacion-mc":{ r:{ gt:-100 }, t:{ min:0, lt:100 } }, accidentabilidad:{ inv:{ min:0 } }, huella:{ prod:{ min:0 } }, smed:{ vh:{ min:0 } }
};
function ruleMsg(f, x, R){
  const lab = "«" + String(f.l).replace(/<[^>]+>/g, "") + "»";
  if (R.gt != null && !(x > R.gt)) return R.gt === 0 ? lab + " debe ser mayor que cero." : lab + " debe ser mayor que " + R.gt + ".";
  if (R.min != null && x < R.min) return R.min === 0 ? lab + " no puede ser negativo." : lab + " debe ser al menos " + R.min + ".";
  if (R.lt != null && !(x < R.lt)) return lab + " debe ser menor que " + R.lt + ".";
  if (R.max != null && x > R.max) return lab + " no puede ser mayor que " + R.max + ".";
  return null; }
function checkRules(id, v){ const RR = RULES[id]; if (!RR) return; C[id].f.forEach(f => { const R = RR[f.k]; if (!R) return; const x = num(v[f.k]); if (!fin(x)) return; const m = ruleMsg(f, x, R); if (m) fail(m); }); }
/* Las calculadoras se envuelven: primero la validación central, luego el cálculo original */
Object.keys(C).forEach(id => { const c0 = C[id].c; C[id].c = function(v){ checkRules(id, v); return c0.call(this, v); }; });

/* ---------- Botón «Copiar resultado» ---------- */
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest('[data-act="copyres"]'); if (!b) return;
  const r = document.getElementById("res"); if (!r) return; const cl = r.cloneNode(true); cl.querySelectorAll(".no-print,.actions,button,details.usados,figure,svg,.sechead").forEach(x => x.remove());
  cl.querySelectorAll(".mblk").forEach(m => { const d = document.createElement("div"); d.textContent = String(m.dataset.lin || m.textContent).replace(/ {3,}·? */g, "  ·  "); m.replaceWith(d); });
  cl.querySelectorAll(".mx").forEach(m => m.replaceWith(document.createTextNode(m.dataset.lin || m.textContent)));
  cl.querySelectorAll(".kpi").forEach(k => { const l = k.querySelector(".l"), v = k.querySelector(".v"); const d = document.createElement("div"); d.textContent = (l ? l.textContent : "") + ": " + (v ? v.textContent.replace(/\s+/g, " ") : ""); k.replaceWith(d); });
  cl.querySelectorAll(".step .sn").forEach(n => { n.textContent = n.textContent + ". "; });
  cl.style.cssText = "position:absolute;left:-10000px;top:0;width:800px;white-space:normal"; document.body.appendChild(cl);
  const id = b.dataset.c, txt = (C[id] ? C[id].t + "\n\n" : "") + cl.innerText.replace(/\n{3,}/g, "\n\n").trim(); cl.remove();
  const ok = () => toast("Resultado copiado"), fb = () => { const ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (er) { toast("No se pudo copiar"); } ta.remove(); };
  try { navigator.clipboard.writeText(txt).then(ok, fb); } catch (er) { fb(); } });
