/* ---------------- CALIDAD Y ESTADÍSTICA ---------------- */
def("descriptiva", "cal", {
  t:"Estadística descriptiva e histograma", ico:"x̄σ", d:"Media, mediana, desviación, cuartiles, asimetría e histograma",
  ey:"Estadística · Análisis exploratorio de datos",
  lead:"Pega una serie de datos (mediciones, tiempos, ventas) y obtén su resumen estadístico completo con histograma.",
  f:[LST("x", "Datos", "50.2 49.8 50.5 50.1 49.6 50.3 50.0 49.9 50.7 50.2 49.7 50.4 50.1 50.0 49.5 50.6 50.3 49.9 50.2 50.8 49.8 50.1 50.4 49.6 50.0 50.3 50.5 49.9 50.2 50.1")],
  c(v){
    const X = list(v.x, "los datos"), n = X.length; if (n < 3) fail("Ingresa al menos 3 datos.");
    const s = X.slice().sort((a, b) => a - b), m = mean(X), sdv = sd(X), q = p => { const h = (n - 1) * p, lo = Math.floor(h); return s[lo] + (h - lo) * ((s[lo + 1] != null ? s[lo + 1] : s[lo]) - s[lo]); };
    const freq = {}; X.forEach(x => freq[x] = (freq[x] || 0) + 1); const mx = Math.max.apply(null, Object.values(freq)); const modas = mx > 1 ? Object.keys(freq).filter(k => freq[k] === mx).map(Number) : [];
    const sk = n * sum(X.map(x => Math.pow(x - m, 3))) / ((n - 1) * (n - 2) * Math.pow(sdv, 3)), ku = n > 3 ? (n * (n + 1) * sum(X.map(x => Math.pow(x - m, 4))) / ((n - 1) * (n - 2) * (n - 3) * Math.pow(sdv, 4))) - 3 * Math.pow(n - 1, 2) / ((n - 2) * (n - 3)) : NaN;
    const k = Math.ceil(1 + 3.322 * Math.log10(n)), w = (s[n - 1] - s[0]) / k || 1, bins = Array.from({ length:k }, (_, i) => ({ a:s[0] + i * w, b:s[0] + (i + 1) * w, c:0 }));
    X.forEach(x => { let i = Math.floor((x - s[0]) / w); if (i >= k) i = k - 1; bins[i].c++; });
    const t = tInv(0.975, n - 1), ic = t * sdv / Math.sqrt(n);
    let h = kpis([kpi("n", n), kpi("Media", nf(m, 4), "", "hi"), kpi("Mediana", nf(q(0.5), 4)), kpi("Desviación estándar", nf(sdv, 4)), kpi("Coef. de variación", pc(sdv / m, 2)), kpi("IC 95 % de la media", nf(m - ic, 3) + " – " + nf(m + ic, 3))]);
    h += table(["Medida", "Valor", "Medida", "Valor"], [["Mínimo", nf(s[0], 4), "Máximo", nf(s[n - 1], 4)], ["Rango", nf(s[n - 1] - s[0], 4), "Moda", modas.length ? modas.slice(0, 4).map(x => nf(x, 2)).join(" · ") : "sin moda"], ["Q1 (25 %)", nf(q(0.25), 4), "Q3 (75 %)", nf(q(0.75), 4)], ["Rango intercuartil", nf(q(0.75) - q(0.25), 4), "Varianza", nf(sdv * sdv, 5)], ["Asimetría", nf(sk, 3), "Curtosis (exceso)", nf(ku, 3)], ["Suma", nf(sum(X), 3), "Error estándar", nf(sdv / Math.sqrt(n), 4)]], { num:[1, 3], cls:"ftab" });
    h += steps([
      { t:"Media y desviación estándar muestral", f:"x̄ = Σx ÷ n   ·   s = √[Σ(x − x̄)² ÷ (n − 1)]", s:"x̄ = " + nf(sum(X), 3) + " ÷ " + n + " = " + nf(m, 4) + "   ·   s = " + nf(sdv, 4), why:"se divide por n − 1 porque la media se estimó con los mismos datos (corrección de Bessel)." },
      { t:"Intervalo de confianza de la media (95 %)", f:"x̄ ± t(α/2, n−1) × s ÷ √n", s:nf(m, 4) + " ± " + nf(t, 3) + " × " + nf(sdv, 4) + " ÷ √" + n + " = " + nf(m, 4) + " ± " + nf(ic, 4), r:"[" + nf(m - ic, 4) + " ; " + nf(m + ic, 4) + "]" },
      { t:"Histograma (regla de Sturges)", f:"k = 1 + 3,322 × log₁₀(n)", s:"k = " + k + " clases de ancho " + nf(w, 4), why:"Asimetría cercana a 0 y curtosis cercana a 0 sugieren datos aproximadamente normales." }
    ]);
    h += chart({ title:"Histograma", bars:bins.map((b, i) => ({ x:i + 1, y:b.c, cls:"bar1", lbl:b.c || "" })), xcat:bins.map(b => nf((b.a + b.b) / 2, 2)), ymin:0, bw:0.95, ylab:"Frecuencia", cap:"Marcas de clase en el eje horizontal." });
    return h;
  },
  rel:["capacidad", "muestra", "regresion"]
});

const CC = { 2:[1.880, 0, 3.267, 1.128], 3:[1.023, 0, 2.574, 1.693], 4:[0.729, 0, 2.282, 2.059], 5:[0.577, 0, 2.114, 2.326], 6:[0.483, 0, 2.004, 2.534], 7:[0.419, 0.076, 1.924, 2.704], 8:[0.373, 0.136, 1.864, 2.847], 9:[0.337, 0.184, 1.816, 2.970], 10:[0.308, 0.223, 1.777, 3.078] };
def("control-xr", "cal", {
  t:"Gráficos de control X̄ – R", ico:"X̄R", d:"Límites de control por variables y detección de puntos fuera de control",
  ey:"Control estadístico de procesos (CEP / SPC)",
  lead:"Ingresa los subgrupos (una fila por muestra). La app calcula los límites de control de la media y del rango y marca los puntos fuera de control.",
  f:[MAT("sg", "Subgrupos (una fila por muestra, mismo tamaño 2 a 10)", "10.2 9.9 10.1 10.0 10.3\n9.8 10.1 10.0 10.2 9.9\n10.1 10.0 9.9 10.3 10.1\n10.0 10.2 10.1 9.8 10.0\n9.9 10.0 10.2 10.1 10.0\n10.3 10.4 10.2 10.5 10.3\n10.0 9.9 10.1 10.0 10.2\n10.1 10.0 9.8 10.0 9.9\n9.9 10.1 10.0 10.2 10.1\n10.0 10.1 9.9 10.0 10.0\n10.2 10.0 10.1 9.9 10.1\n9.8 10.0 10.1 10.0 9.9")],
  c(v){
    const G = rows(v.sg).map(r => r.map(num)); if (G.length < 5) fail("Ingresa al menos 5 subgrupos (lo recomendable es 20 a 25).");
    const n = G[0].length; if (!CC[n]) fail("El tamaño de subgrupo debe estar entre 2 y 10."); if (G.some(r => r.length !== n || r.some(x => !fin(x)))) fail("Todas las filas deben tener " + n + " números.");
    const XR = NUC.xr(G), A2 = XR.A2, D3 = XR.D3, D4 = XR.D4, d2 = XR.d2, xb = XR.xb, R = XR.R, X2 = XR.X2, Rb = XR.Rb, LSCx = XR.LSCx, LICx = XR.LICx, LSCr = XR.LSCr, LICr = XR.LICr, sig = XR.sig, outX = XR.outX, outR = XR.outR, runMax = XR.runMax, ok = XR.ok;
    let h = kpis([kpi("X̿ (línea central)", nf(X2, 4)), kpi("R̄", nf(Rb, 4)), kpi("LSC / LIC de X̄", nf(LSCx, 4) + " / " + nf(LICx, 4)), kpi("LSC / LIC de R", nf(LSCr, 4) + " / " + nf(LICr, 4)), kpi("σ estimada (R̄/d₂)", nf(sig, 4)), kpi("Estado", ok ? "Bajo control" : "Fuera de control", "", ok ? "ok" : "bad")]);
    if (!ok) h += note("Puntos fuera de control: " + (outX.length ? "X̄ en subgrupo(s) " + outX.map(i => i + 1).join(", ") + ". " : "") + (outR.length ? "R en subgrupo(s) " + outR.map(i => i + 1).join(", ") + ". " : "") + (runMax >= 8 ? "Racha de " + runMax + " puntos al mismo lado de la línea central. " : "") + "Investiga la causa asignable, elimínala, descarta esos subgrupos y recalcula los límites.", "bad");
    h += steps([
      { t:"Promedios y rangos", f:"X̄_i = Σx ÷ n   ·   R_i = máx − mín   ·   X̿ = ΣX̄ ÷ k   ·   R̄ = ΣR ÷ k", s:"X̿ = " + nf(X2, 4) + " · R̄ = " + nf(Rb, 4) + " (k = " + G.length + ", n = " + n + ")" },
      { t:"Límites de X̄", f:"LSC = X̿ + A₂R̄   ·   LIC = X̿ − A₂R̄", s:"A₂ = " + A2 + " → " + nf(X2, 4) + " ± " + nf(A2 * Rb, 4), r:nf(LICx, 4) + " a " + nf(LSCx, 4), why:"equivale a ±3σ de la media muestral: si el proceso es estable, 99,73 % de los puntos cae dentro." },
      { t:"Límites de R", f:"LSC = D₄R̄   ·   LIC = D₃R̄", s:"D₃ = " + D3 + ", D₄ = " + D4, r:nf(LICr, 4) + " a " + nf(LSCr, 4) },
      { t:"Reglas de Western Electric", q:"Fuera de control si: 1 punto fuera de ±3σ; 2 de 3 más allá de 2σ; 4 de 5 más allá de 1σ; 8 seguidos a un mismo lado.", r:ok ? "Proceso estable" : "Revisar", c:ok ? "ok" : "bad" }
    ]);
    const xs = xb.map((x, i) => [i + 1, x]), rs = R.map((x, i) => [i + 1, x]);
    h += chart({ title:"Gráfico X̄", series:[{ pts:xs, cls:"s1", dot:"d1", badIdx:outX }], h:[{ y:LSCx, cls:"sb", lbl:"LSC" }, { y:X2 + 2 * A2 * Rb / 3, cls:"zn", lbl:"+2σ" }, { y:X2 + A2 * Rb / 3, cls:"zn", lbl:"+1σ" }, { y:X2, cls:"sm", lbl:"X̿" }, { y:X2 - A2 * Rb / 3, cls:"zn", lbl:"−1σ" }, { y:X2 - 2 * A2 * Rb / 3, cls:"zn", lbl:"−2σ" }, { y:LICx, cls:"sb", lbl:"LIC" }], xlab:"Subgrupo", ylab:"X̄", h0:250, cap:"Las líneas tenues marcan ±1σ y ±2σ del promedio: sirven para aplicar las reglas de 2 de 3 y 4 de 5 puntos." });
    h += chart({ title:"Gráfico R", series:[{ pts:rs, cls:"s2", dot:"d2", badIdx:outR }], h:[{ y:LSCr, cls:"sb", lbl:"LSC" }, { y:Rb, cls:"sm", lbl:"R̄" }].concat(LICr > 0 ? [{ y:LICr, cls:"sb", lbl:"LIC" }] : []), xlab:"Subgrupo", ylab:"R", ymin:0, h0:220 });
    h += table(["Subgrupo", "X̄", "R", ""], xb.map((x, i) => rowc([i + 1, nf(x, 4), nf(R[i], 4), outX.includes(i) || outR.includes(i) ? pill("bad", "Fuera") : ""], outX.includes(i) || outR.includes(i) ? "badr" : "")), { num:[0, 1, 2], tall:true });
    if (Rb === 0) h += note("<b>Todos los rangos son cero:</b> las mediciones dentro de cada subgrupo son idénticas. Probablemente el instrumento no tiene resolución suficiente; los límites calculados no sirven.", "bad");
    if (Rb > 0) h += lectura(ok ? "el proceso es estable: su variación se explica por causas comunes. No hay que ajustar la máquina por cada punto que se mueve dentro de los límites." : "el proceso muestra señales de una causa especial (algo cambió). Hay que buscarla en los subgrupos marcados, eliminarla y recalcular los límites sin esos datos.");
    return h;
  },
  learn:"<p>Primero se analiza el gráfico R (variabilidad): si R no está bajo control, los límites de X̄ no son confiables. Los límites de control describen lo que el proceso <b>hace</b>; los límites de especificación, lo que el cliente <b>pide</b>. No los confundas ni los dibujes juntos en el gráfico X̄.</p>",
  rel:["control-p", "capacidad"]
});

def("control-p", "cal", {
  t:"Gráfico de control p (atributos)", ico:"p", d:"Proporción de defectuosos con tamaño de muestra variable",
  ey:"Control estadístico de procesos · Atributos",
  lead:"Ingresa cada muestra con su tamaño y número de unidades defectuosas. Los límites se ajustan al tamaño de cada muestra.",
  f:[MAT("m", "Muestras: tamaño n ; defectuosos", "200;8\n180;6\n220;11\n200;7\n210;9\n190;5\n200;19\n205;8\n195;6\n200;10\n215;9\n185;7\n200;8\n210;6\n190;9")],
  c(v){
    const M = rows(v.m).map(r => ({ n:num(r[0]), d:num(r[1]) })); if (M.length < 5) fail("Ingresa al menos 5 muestras."); if (M.some(x => !fin(x.n) || !fin(x.d) || x.n <= 0 || x.d < 0 || x.d > x.n)) fail("Cada fila necesita n > 0 y defectuosos entre 0 y n.");
    const pb = sum(M.map(x => x.d)) / sum(M.map(x => x.n)); M.forEach(x => { x.p = x.d / x.n; const e = 3 * Math.sqrt(pb * (1 - pb) / x.n); x.U = Math.min(1, pb + e); x.L = Math.max(0, pb - e); x.out = x.p > x.U || x.p < x.L; });
    const out = M.map((x, i) => x.out ? i : -1).filter(i => i >= 0);
    let h = kpis([kpi("p̄", pc(pb, 2), "", "hi"), kpi("Muestras", M.length), kpi("Fuera de control", out.length, "", out.length ? "bad" : "ok")]);
    h += steps([
      { t:"Proporción media", f:"p̄ = Σ defectuosos ÷ Σ n", s:"p̄ = " + n0(sum(M.map(x => x.d))) + " ÷ " + n0(sum(M.map(x => x.n))) + " = " + nf(pb, 5), r:pc(pb, 2) },
      { t:"Límites para cada muestra", f:"LSC_i = p̄ + 3√[p̄(1 − p̄) ÷ n_i]   ·   LIC_i = máx(0, p̄ − 3√[…])", why:"con muestras más grandes los límites se estrechan porque la proporción observada es más precisa." }
    ]);
    if (out.length) h += note("Muestra(s) " + out.map(i => i + 1).join(", ") + " fuera de control: busca qué cambió (lote de material, operario, ajuste de máquina).", "bad");
    h += chart({ title:"Gráfico p", series:[{ pts:M.map((x, i) => [i + 1, x.p * 100]), cls:"s1", dot:"d1", badIdx:out }, { pts:M.map((x, i) => [i + 1, x.U * 100]), cls:"sb" }, { pts:M.map((x, i) => [i + 1, x.L * 100]), cls:"sb" }], h:[{ y:pb * 100, cls:"sm", lbl:"p̄" }], ymin:0, xlab:"Muestra", ylab:"% defectuoso" });
    h += table(["Muestra", "n", "Defectuosos", "p", "LIC", "LSC", ""], M.map((x, i) => rowc([i + 1, n0(x.n), n0(x.d), pc(x.p, 2), pc(x.L, 2), pc(x.U, 2), x.out ? pill("bad", "Fuera") : ""], x.out ? "badr" : "")), { num:[0, 1, 2, 3, 4, 5], tall:true });
    return h;
  },
  learn:"<p>Otros gráficos por atributos: <b>np</b> (número de defectuosos, n constante), <b>c</b> (número de defectos por unidad, límites c̄ ± 3√c̄) y <b>u</b> (defectos por unidad con n variable, ū ± 3√(ū/n)).</p>",
  rel:["control-xr", "sigma"]
});

def("capacidad", "cal", {
  t:"Capacidad de proceso Cp / Cpk", ico:"Cpk", d:"Índices de capacidad, PPM fuera de especificación y nivel sigma",
  ey:"Calidad · Capacidad del proceso",
  lead:"Compara la variabilidad del proceso con las especificaciones del cliente.",
  f:[F("LEI", "Límite de especificación inferior", 9.4), F("LES", "Límite de especificación superior", 10.6), F("mu", "Media del proceso", 10.08), F("s", "Desviación estándar del proceso", 0.15, { h:"Usa R̄/d₂ del gráfico de control para σ de corto plazo." })],
  c(v){
    const L = need(v, "LEI", "LEI"), U = need(v, "LES", "LES"), m = need(v, "mu", "Media"), s = need(v, "s", "Desviación", { pos:true });
    if (U <= L) fail("El LES debe ser mayor que el LEI.");
    const K = NUC.capacidad(L, U, m, s), Cp = K.Cp, Cpu = K.Cpu, Cpl = K.Cpl, Cpk = K.Cpk, pL = K.pL, pU = K.pU, ppm = K.ppm, zb = K.zb;
    const cls = Cpk >= 1.33 ? ["ok", "Capaz"] : Cpk >= 1 ? ["warn", "Apenas capaz"] : ["bad", "No capaz"];
    let h = kpis([kpi("Cp", nf(Cp, 3)), kpi("Cpk", nf(Cpk, 3), "", "hi"), kpi("Cpu / Cpl", nf(Cpu, 3) + " / " + nf(Cpl, 3)), kpi("PPM fuera", n0(ppm)), kpi("Nivel sigma (corto plazo)", nf(zb, 2) + "σ"), kpi("Dictamen", cls[1], "", cls[0] === "ok" ? "ok" : "bad")]);
    h += steps([
      { t:"Capacidad potencial", f:"Cp = (LES − LEI) ÷ 6σ", s:"Cp = (" + nf(U, 3) + " − " + nf(L, 3) + ") ÷ (6 × " + nf(s, 4) + ") = " + nf(Cp, 3), r:nf(Cp, 3), why:"compara el ancho de la tolerancia con el ancho natural del proceso, sin importar si está centrado." },
      { t:"Capacidad real", f:"Cpk = mín[(LES − μ) ÷ 3σ ; (μ − LEI) ÷ 3σ]", s:"Cpk = mín(" + nf(Cpu, 3) + " ; " + nf(Cpl, 3) + ") = " + nf(Cpk, 3), r:nf(Cpk, 3), c:cls[0], why:"si Cpk < Cp, el proceso está descentrado: " + (Cpu < Cpl ? "se acerca al límite superior." : "se acerca al límite inferior.") },
      { t:"Fracción fuera de especificación", f:"p = Φ((LEI − μ)/σ) + [1 − Φ((LES − μ)/σ)]", s:"p = " + nf(pL, 6) + " + " + nf(pU, 6) + " = " + nf(pL + pU, 6), r:n0(ppm) + " partes por millón", why:"supone distribución normal; verifica normalidad antes de confiar en las PPM." }
    ]);
    h += table(["Cpk", "Interpretación habitual"], [["< 1,00", "No capaz: produce fuera de especificación"], ["1,00 – 1,33", "Capaz con control estricto"], ["≥ 1,33", "Capaz (exigencia común en manufactura)"], ["≥ 1,67", "Exigencia típica automotriz (PPAP) para características críticas"], ["≥ 2,00", "Seis Sigma (con desplazamiento de 1,5σ ≈ 3,4 PPM)"]]);
    const pts = []; for (let k = 0; k <= 120; k++) { const x = m - 4.5 * s + 9 * s * k / 120; pts.push([x, Math.exp(-0.5 * Math.pow((x - m) / s, 2)) / (s * Math.sqrt(2 * Math.PI))]); }
    h += chart({ title:"Distribución vs especificación", series:[{ pts, cls:"s1" }], v:[{ x:L, cls:"sb", lbl:"LEI" }, { x:U, cls:"sb", lbl:"LES" }, { x:m, cls:"sm", lbl:"μ" }], ymin:0, xlab:"Característica medida", ylab:"Densidad" });
    if (m < L || m > U) h += note("<b>La media está fuera de la especificación:</b> más de la mitad de las piezas no cumple. Primero hay que centrar el proceso.", "bad");
    h += lectura("el proceso produce unas " + n0(ppm) + " piezas fuera de especificación por cada millón." + (Cp >= 1.33 && Cpk < 1.33 ? " La variación es aceptable, pero la media está corrida: centrar el proceso lo haría capaz." : Cpk < 1.33 ? " Hay que reducir la variación" + (Math.abs(Cpu - Cpl) > 0.1 ? " y centrar la media" : "") + " para llegar a Cpk ≥ 1,33." : " Es capaz: cumple con holgura la tolerancia del cliente."));
    return h;
  },
  rel:["control-xr", "sigma", "descriptiva"]
});

def("sigma", "cal", {
  t:"Nivel sigma y DPMO", ico:"6σ", d:"Defectos por millón de oportunidades, rendimiento y nivel sigma",
  ey:"Seis Sigma · Métricas de desempeño",
  lead:"Convierte los defectos observados en DPMO y nivel sigma para comparar procesos distintos.",
  f:[F("D", "Defectos encontrados", 186), F("U", "Unidades inspeccionadas", 4500), F("O", "Oportunidades de defecto por unidad", 6), SEL("sh", "Desplazamiento de largo plazo", "1.5", [["1.5", "Sí, 1,5σ (convención Seis Sigma)"], ["0", "No"]])],
  c(v){
    const D = need(v, "D", "Defectos", { nn:true }), U = need(v, "U", "Unidades", { pos:true }), O = need(v, "O", "Oportunidades", { pos:true }), sh = num(v.sh);
    const DPU = D / U, DPO = D / (U * O), DPMO = DPO * 1e6, Y = 1 - DPO, z = DPO > 0 ? invNorm(1 - DPO) + sh : Infinity, RTY = Math.exp(-DPU);
    let h = kpis([kpi("DPU", nf(DPU, 4)), kpi("DPMO", n0(DPMO), "", "hi"), kpi("Rendimiento", pc(Y, 3)), kpi("Nivel sigma", fin(z) ? nf(z, 2) + "σ" : "∞"), kpi("Rendimiento al primer intento (≈ e^−DPU)", pc(RTY, 2))]);
    h += steps([
      { t:"Defectos por oportunidad", f:"DPO = D ÷ (U × O)", s:"DPO = " + n0(D) + " ÷ (" + n0(U) + " × " + n0(O) + ") = " + nf(DPO, 6), r:n0(DPMO) + " DPMO" },
      { t:"Nivel sigma", f:"σ = Φ⁻¹(1 − DPO) + " + nf(sh, 1), s:"σ = " + nf(invNorm(1 - DPO), 3) + " + " + nf(sh, 1) + " = " + nf(z, 2), r:nf(z, 2) + "σ", why:"el 1,5σ supone que en el largo plazo la media del proceso se desplaza; así 6σ equivale a 3,4 DPMO." }
    ]);
    h += table(["Nivel sigma", "DPMO (con 1,5σ)", "Rendimiento"], [1, 2, 3, 4, 5, 6].map(k => { const d = (1 - Phi(k - 1.5)) * 1e6; return [k + "σ", n0(d), pc(1 - d / 1e6, 4)]; }), { num:[1, 2] });
    return h;
  },
  rel:["capacidad", "control-p", "amef"]
});

def("pareto", "cal", {
  t:"Diagrama de Pareto", ico:"80/20", d:"Prioriza causas o defectos por frecuencia o costo",
  ey:"Herramientas básicas de calidad",
  lead:"Ordena las categorías de mayor a menor para identificar las pocas causas vitales que explican la mayor parte del problema.",
  f:[MAT("d", "Categorías: nombre ; frecuencia o costo", "Rayas en superficie;142\nDimensión fuera de tolerancia;87\nSoldadura porosa;64\nFalta de componente;31\nEtiqueta mal impresa;18\nGolpe en embalaje;12\nOtros;9"), F("cut", "Corte de las causas vitales", 80, { u:"%" })],
  c(v){
    const R = rows(v.d).map(r => ({ nm:r[0], f:num(r[1]) })).filter(r => r.nm); if (R.length < 2 || R.some(r => !fin(r.f) || r.f < 0)) fail("Cada fila necesita nombre y un valor ≥ 0.");
    const cut = need(v, "cut", "Corte") / 100, T = sum(R.map(r => r.f)); R.sort((a, b) => b.f - a.f); let ac = 0; R.forEach(r => { const pr = ac; ac += r.f / T; r.ac = ac; r.vit = pr < cut - 1e-9; });
    const vit = R.filter(r => r.vit);
    let h = kpis([kpi("Causas vitales", vit.length + " de " + R.length, "", "hi"), kpi("Explican", pc(vit.length ? vit[vit.length - 1].ac : 0)), kpi("Total", n0(T))]);
    h += note("Enfócate en: <b>" + vit.map(r => esc(r.nm)).join(", ") + "</b>.", "ok");
    h += table(["Categoría", "Valor", "%", "% acumulado", ""], R.map(r => [esc(r.nm), n0(r.f), pc(r.f / T), pc(r.ac), r.vit ? pill("bad", "Vital") : pill("info", "Trivial")]), { num:[1, 2, 3] });
    h += chart({ title:"Pareto", bars:R.map((r, k) => ({ x:k + 1, y:r.f / T * 100, cls:r.vit ? "bar2" : "bar1" })), series:[{ pts:R.map((r, k) => [k + 1, r.ac * 100]), cls:"s3", dot:"d3" }], h:[{ y:cut * 100, cls:"sm", lbl:pc(cut, 0) }], xcat:R.map(r => r.nm), ymin:0, ymax:100, ylab:"% del total", legend:[["--copper", "Vitales"], ["--blue", "Triviales"], ["--ok", "% acumulado"]] });
    return h;
  },
  rel:["ishikawa", "abc", "amef"]
});

def("amef", "cal", {
  t:"AMEF / FMEA y número de prioridad de riesgo", ico:"NPR", d:"Severidad × ocurrencia × detección; priorización de acciones",
  ey:"Confiabilidad · Análisis de modo y efecto de falla",
  lead:"Evalúa cada modo de falla con severidad (S), ocurrencia (O) y detección (D) de 1 a 10 para priorizar acciones preventivas.",
  f:[MAT("m", "Modos de falla: descripción ; S ; O ; D", "Rodamiento se sobrecalienta;8;5;4\nFuga de aceite en sello;6;6;3\nPerno mal apretado;9;3;6\nSensor de nivel descalibrado;7;4;7\nCorrea desalineada;5;6;2\nError de etiquetado;4;5;5"), F("lim", "NPR que exige acción", 100)],
  c(v){
    const R = rows(v.m).map(r => { const S = num(r[1]), O = num(r[2]), D = num(r[3]); if ([S, O, D].some(x => !fin(x) || x < 1 || x > 10)) fail("S, O y D deben ir de 1 a 10 en «" + r[0] + "»."); return { nm:r[0], S, O, D, NPR:S * O * D }; });
    if (!R.length) fail("Ingresa al menos un modo de falla.");
    const lim = need(v, "lim", "Límite"); R.sort((a, b) => b.NPR - a.NPR || b.S - a.S);
    const lvl = r => r.S >= 9 ? ["bad", "Alta (S ≥ 9)"] : r.NPR >= lim ? ["bad", "Alta"] : r.NPR >= lim / 2 ? ["warn", "Media"] : ["ok", "Baja"];
    let h = kpis([kpi("Modos evaluados", R.length), kpi("Requieren acción", R.filter(r => lvl(r)[0] === "bad").length, "", "hi"), kpi("NPR máximo", R[0].NPR)]);
    h += table(["Modo de falla", "S", "O", "D", "NPR", "Prioridad"], R.map(r => { const l = lvl(r); return [esc(r.nm), r.S, r.O, r.D, "<b>" + r.NPR + "</b>", pill(l[0], l[1])]; }), { num:[1, 2, 3, 4] });
    h += steps([{ t:"Número de prioridad de riesgo", f:"NPR = S × O × D   (1 a 1.000)", why:"pero no te guíes solo por el NPR: una severidad 9 o 10 (seguridad o incumplimiento legal) exige acción aunque el NPR sea bajo. Por eso la norma AIAG-VDA 2019 reemplazó el NPR por la Prioridad de Acción (AP)." }, { t:"Después de la acción", q:"Reevalúa O y D. La severidad solo baja si cambias el diseño." }]);
    h += h3("Escalas de referencia") + table(["Puntaje", "Severidad", "Ocurrencia", "Detección"], [["9–10", "Afecta seguridad o ley", "Muy alta (≥ 1 en 10)", "Casi imposible de detectar"], ["7–8", "Pérdida de función principal", "Alta", "Detección remota"], ["4–6", "Degradación de función", "Moderada", "Detección moderada"], ["2–3", "Molestia menor", "Baja", "Alta probabilidad de detectar"], ["1", "Sin efecto", "Remota", "Detección casi segura"]]);
    return h;
  },
  rel:["pareto", "iper", "sigma"]
});

def("muestra", "cal", {
  t:"Tamaño de muestra e intervalos de confianza", ico:"n", d:"Muestra para estimar una media o una proporción (encuestas, inspección)",
  ey:"Estadística inferencial · Muestreo",
  lead:"Calcula cuántos datos necesitas para estimar una media o una proporción con el error y la confianza que elijas.",
  f:[SEL("tipo", "Quiero estimar", "p", [["p", "Una proporción (encuesta, % defectuoso)"], ["m", "Una media (tiempo, peso, monto)"]]), SEL("cl", "Confianza", "0.95", CONF), F("e", "Error máximo aceptado", 5, { h:"En puntos porcentuales para proporción; en unidades de la variable para media." }), F("p", "Proporción esperada (si no sabes, 50)", 50, { u:"%" }), F("s", "Desviación estándar estimada (para media)", 12), F("N", "Tamaño de la población (opcional)", 1200)],
  c(v){
    const cl = num(v.cl), z = zConf(cl), e = need(v, "e", "Error", { pos:true }), N = opt(v, "N");
    let n0v, st;
    if (v.tipo === "p") { const p = need(v, "p", "Proporción") / 100, ee = e / 100; n0v = z * z * p * (1 - p) / (ee * ee); st = { t:"Muestra para una proporción", f:"n₀ = z² × p(1 − p) ÷ e²", s:"n₀ = " + nf(z, 3) + "² × " + nf(p, 2) + " × " + nf(1 - p, 2) + " ÷ " + nf(ee, 3) + "² = " + nf(n0v, 1), why:"p = 50 % da la muestra más grande posible: úsala si no tienes información previa." }; }
    else { const s = need(v, "s", "Desviación", { pos:true }); n0v = Math.pow(z * s / e, 2); st = { t:"Muestra para una media", f:"n₀ = (z × σ ÷ e)²", s:"n₀ = (" + nf(z, 3) + " × " + nf(s, 3) + " ÷ " + nf(e, 3) + ")² = " + nf(n0v, 1) }; }
    const n = N ? n0v / (1 + (n0v - 1) / N) : n0v;
    let h = kpis([kpi("z", nf(z, 3)), kpi("Muestra sin corrección", n0(Math.ceil(n0v))), kpi("Muestra necesaria", n0(Math.ceil(n)), N ? "población " + n0(N) : "población infinita", "hi")]);
    h += steps([{ t:"Valor z de la confianza", f:"z = Φ⁻¹(1 − α/2)", s:"z = " + nf(z, 3) + " para " + pc(cl, 0) }, st].concat(N ? [{ t:"Corrección por población finita", f:"n = n₀ ÷ [1 + (n₀ − 1) ÷ N]", s:"n = " + nf(n0v, 1) + " ÷ [1 + " + nf(n0v - 1, 1) + " ÷ " + n0(N) + "] = " + nf(n, 1), r:n0(Math.ceil(n)), c:"ok", why:"cuando la muestra es una parte importante de la población, se necesitan menos datos." }] : []));
    return h;
  },
  rel:["descriptiva", "muestreo"]
});

def("regresion", "cal", {
  t:"Regresión lineal y correlación", ico:"r²", d:"Recta de mínimos cuadrados, R², error estándar y predicción",
  ey:"Estadística · Modelos de relación entre variables",
  lead:"Ajusta una recta y = a + b·x a tus datos y mide qué tan fuerte es la relación.",
  f:[MAT("d", "Pares x ; y", "10;1250\n15;1610\n20;1980\n25;2210\n30;2690\n35;2950\n40;3420\n45;3590\n50;4100"), TXT("xl", "Nombre de x", "Unidades producidas (miles)"), TXT("yl", "Nombre de y", "Costo total (miles $)"), F("x0", "Valor de x a predecir", 60)],
  c(v){
    const P = rows(v.d).map(r => [num(r[0]), num(r[1])]); if (P.length < 3 || P.some(p => !fin(p[0]) || !fin(p[1]))) fail("Ingresa al menos 3 pares numéricos.");
    const RG = NUC.regresion(P), n = RG.n, X = RG.X, Y = RG.Y, mx = RG.mx, my = RG.my, Sxx = RG.Sxx, Sxy = RG.Sxy, Syy = RG.Syy;
    const b = RG.b, a = RG.a, r = RG.r, SSE = RG.SSE, se = RG.se, x0 = opt(v, "x0"), t = tInv(0.975, n - 2);
    const sb = se / Math.sqrt(Sxx), tb = b / sb, pv = 2 * (1 - tCDF(Math.abs(tb), n - 2));
    let h = kpis([kpi("Ecuación", "y = " + nf(a, 3) + (b >= 0 ? " + " : " − ") + nf(Math.abs(b), 4) + "·x", "", "hi"), kpi("r", nf(r, 4)), kpi("R²", pc(r * r, 2)), kpi("Error estándar", nf(se, 3)), kpi("p-valor de la pendiente", pv < 0.0001 ? "< 0,0001" : nf(pv, 4))]);
    if (x0 != null) { const y0 = a + b * x0, ip = t * se * Math.sqrt(1 + 1 / n + Math.pow(x0 - mx, 2) / Sxx); h += note("Para x = " + nf(x0, 2) + " se predice y = <b>" + nf(y0, 2) + "</b> (intervalo de predicción 95 %: " + nf(y0 - ip, 2) + " a " + nf(y0 + ip, 2) + ")." + (x0 < Math.min.apply(null, X) || x0 > Math.max.apply(null, X) ? " Ojo: es una extrapolación fuera del rango observado." : ""), "info"); }
    h += steps([
      { t:"Pendiente", f:"b = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)²", s:"b = " + nf(Sxy, 3) + " ÷ " + nf(Sxx, 3) + " = " + nf(b, 5), r:nf(b, 5), why:"en una recta de costos, b es el costo variable unitario y a el costo fijo." },
      { t:"Intercepto", f:"a = ȳ − b·x̄", s:"a = " + nf(my, 3) + " − " + nf(b, 5) + " × " + nf(mx, 3) + " = " + nf(a, 4), r:nf(a, 4) },
      { t:"Correlación y determinación", f:"r = Sxy ÷ √(Sxx·Syy)   ·   R² = r²", s:"r = " + nf(r, 4) + " → R² = " + pc(r * r, 2), r:pc(r * r, 1) + " de la variación de y se explica por x", why:"correlación no implica causalidad." }
    ]);
    h += chart({ title:"Dispersión y recta", series:[{ pts:P, cls:"s1", dot:"d1", only:true }, { pts:[[Math.min.apply(null, X), a + b * Math.min.apply(null, X)], [Math.max.apply(null, X.concat(x0 != null ? [x0] : [])), a + b * Math.max.apply(null, X.concat(x0 != null ? [x0] : []))]], cls:"s2" }], xlab:esc(v.xl || "x"), ylab:esc(v.yl || "y") });
    if (Syy === 0) h += note("<b>Todos los valores de y son iguales:</b> la recta es horizontal y la correlación no está definida (no hay variación que explicar).", "bad");
    h += lectura(fin(r) ? "cada vez que x aumenta en 1, y cambia en promedio " + nf(b, 3) + ". La recta explica el " + pc(r * r) + " de la variación de y" + (r * r < 0.5 ? ", así que hay otros factores importantes que no están en el modelo." : ".") + " Una relación fuerte no prueba que x cause y." : "no hay variación en y que relacionar con x.");
    return h;
  },
  rel:["pronosticos", "descriptiva"]
});

/* ---------------- INVESTIGACIÓN DE OPERACIONES ---------------- */
function parseLP(v){
  const c = list(v.obj, "la función objetivo"), n = c.length; if (!n) fail("Ingresa los coeficientes de la función objetivo.");
  const A = [], ops = [], b = [], txt = [];
  rows(v.res).forEach(r0 => { const r = r0.join(" ").replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/([<>]=?|=)/g, " $1 ").trim().split(/\s+/); const k = r.findIndex(t => /^(<=|>=|=|<|>)$/.test(t)); if (k < 0) fail("Falta el operador (<=, >= o =) en: «" + r0.join(" ") + "»."); const co = r.slice(0, k).map(num), rhs = num(r[k + 1]);
    if (co.length !== n || co.some(x => !fin(x)) || !fin(rhs)) fail("La restricción «" + r0.join(" ") + "» debe tener " + n + " coeficientes y un lado derecho numérico.");
    A.push(co); ops.push(r[k].replace(/^<$/, "<=").replace(/^>$/, ">=")); b.push(rhs); txt.push(r0.join(" ")); });
  if (!A.length) fail("Ingresa al menos una restricción.");
  const nm = (v.vars || "").split(/[\s;,]+/).filter(Boolean); while (nm.length < n) nm.push("x" + (nm.length + 1));
  return { c, A, ops, b, n, nm:nm.slice(0, n), txt };
}
def("programacion-lineal", "io", {
  t:"Programación lineal (Simplex)", ico:"PL", d:"Maximiza o minimiza con restricciones; método gráfico si hay 2 variables",
  ey:"Investigación de operaciones · Optimización lineal",
  lead:"Escribe la función objetivo y las restricciones. La app resuelve con el método Simplex de dos fases y, si hay dos variables, dibuja la región factible.",
  f:[SEL("tipo", "Objetivo", "max", [["max", "Maximizar"], ["min", "Minimizar"]]), LST("obj", "Coeficientes de la función objetivo", "3000 5000", { h:"Ej.: utilidad por unidad de cada producto." }), TXT("vars", "Nombres de las variables (opcional)", "Puertas Ventanas"),
     MAT("res", "Restricciones: coeficientes  operador  lado derecho", "1 0 <= 4\n0 2 <= 12\n3 2 <= 18", { h:"Una por línea, ej.: 3 2 <= 18. Se asume que todas las variables son ≥ 0." }),
     SEL("ent", "Tipo de variables", "cont", [["cont", "Continuas (aceptan decimales: litros, horas, toneladas)"], ["int", "Enteras (unidades completas: muebles, personas, camiones)"]], { h:"Elige «Enteras» si no se pueden fabricar fracciones. Se resuelve con ramificación y acotamiento (Branch and Bound)." })],
  c(v){
    const P = parseLP(v), ENT = v.ent === "int", R = NUC.pl(P.c, P.A, P.ops, P.b, v.tipo === "max", ENT);
    if (R.status === "inf") return note("<b>Problema infactible:</b> no existe ningún punto que cumpla todas las restricciones a la vez. Revisa signos y lados derechos.", "bad");
    if (R.status === "unb") return note("<b>Solución no acotada:</b> la función objetivo puede crecer sin límite. Probablemente falta una restricción de capacidad o demanda.", "bad");
    if (R.status !== "opt") return note("No se alcanzó convergencia. Revisa el modelo.", "bad");
    let h = kpis([kpi("Z óptimo", nf(R.z, 2), v.tipo === "max" ? "máximo" : "mínimo", "hi")].concat(P.nm.map((nm, j) => kpi(esc(nm), nf(R.x[j], 4)))));
    if (ENT) h += note("<b>Solución entera.</b> Sin exigir enteros el óptimo sería " + P.nm.map((nm, j) => esc(nm) + " = " + nf(R.relax.x[j], 2)).join("; ") + " con Z = " + nf(R.relax.z, 2) + ". Exigiendo unidades completas: Z = " + nf(R.z, 2) + " (se resolvieron " + R.nodes + " subproblemas)." + (R.cut ? " Se alcanzó el límite de búsqueda: la solución puede no ser la óptima." : "") + " El precio sombra no aplica a modelos enteros.", "info");
    const rr = P.A.map((a, i) => { const lhs = sum(a.map((x, j) => x * R.x[j])), hol = P.ops[i] === "<=" ? P.b[i] - lhs : P.ops[i] === ">=" ? lhs - P.b[i] : 0; return [i + 1, esc(P.txt[i]), nf(lhs, 3), nf(hol, 3), Math.abs(hol) < 1e-7 ? pill("warn", "Activa") : pill("ok", "Con holgura"), ENT ? "—" : nf(R.dual[i], 4)]; });
    h += h3("Restricciones") + table(["#", "Restricción", "Uso (LHS)", "Holgura / excedente", "Estado", "Precio sombra"], rr, { num:[0, 2, 3, 5] });
    h += steps([
      { t:"Forma estándar", q:"A cada restricción ≤ se le suma una variable de holgura; a cada ≥ se le resta una de excedente y se agrega una artificial; las = llevan artificial.", f:(v.tipo === "max" ? "Max" : "Min") + " Z = " + P.c.map((c, j) => nf(c, 2) + "·" + P.nm[j]).join(" + ") },
      { t:"Fase 1 y fase 2 del Simplex", q:"La fase 1 busca una solución factible eliminando las artificiales; la fase 2 mejora Z pivoteando hasta que ningún costo reducido mejore el objetivo.", r:"Óptimo encontrado", c:"ok" },
      { t:"Precio sombra", f:"y_i = ΔZ por cada unidad adicional del lado derecho b_i", why:"indica cuánto pagarías como máximo por una unidad extra de ese recurso. Las restricciones con holgura tienen precio sombra 0: sobra recurso." }
    ].concat(ENT ? [{ t:"Variables enteras: ramificación y acotamiento", q:"Primero se resuelve sin exigir enteros (relajación lineal). Si una variable sale con decimales (por ejemplo 211,49), el problema se divide en dos ramas: una con esa variable ≤ 211 y otra con ≥ 212. Cada rama se resuelve otra vez; se descartan las infactibles y las que no pueden superar a la mejor solución entera ya encontrada.", r:"Z entero = " + nf(R.z, 2) + " (relajación: " + nf(R.relax.z, 2) + ")", c:"ok", why:"redondear la solución con decimales puede violar una restricción o no ser la mejor combinación entera." }] : []));
    if (ENT) h += h3("Primeros nodos del árbol de búsqueda") + table(["Nivel", "Rama", "Z", "Solución", "Decisión"], R.tree.map(t => [t.d, t.cut ? esc(P.nm[t.cut[0]]) + " " + t.cut[1] + " " + t.cut[2] : "Raíz (sin exigir enteros)", t.z != null ? nf(t.z, 2) : "—", t.x ? P.nm.map((nm, j) => esc(nm) + " = " + nf(t.x[j], 2)).join("; ") : "—", t.st]), { num:[0, 2] });
    if (P.n === 2) h += lpGraph(P, R) + lpSlider(P, R, v.tipo === "max");
    h += lectura("la mejor decisión es " + P.nm.map((nm, j) => esc(nm) + " = " + nf(R.x[j], 2)).join(", ") + ", con un valor de " + nf(R.z, 2) + ". Las restricciones marcadas como «Activa» son los cuellos de botella: si se quiere mejorar el resultado, hay que conseguir más de esos recursos.");
    return h;
  },
  learn:"<h3>La idea en una frase</h3><p>Tú escribes el modelo (cuánto gana cada producto y qué lo limita); la calculadora encuentra <b>cuántos</b> hacer de cada uno. Los coeficientes salen de los datos; las cantidades (x) son la incógnita.</p>" +
   "<h3>Receta para resolver problemas de producción</h3><ol>" +
   "<li><b>Lee y separa en tres:</b> lo que decides (cantidades), lo que quieres (ganar más o gastar menos) y lo que te limita (recursos y reglas).</li>" +
   "<li><b>Define las variables:</b> una por cada cosa que decides, con su unidad. Ej.: x₁ = escritorios por temporada.</li>" +
   "<li><b>Calcula la utilidad de una unidad</b> de cada producto: precio menos todo lo que cuesta fabricarla.</li></ol>" +
   M("c_j = P_j − Σ_k (m_kj × p_k) − Σ_m (t_mj ÷ 60 × w_m)") +
   "<ul class='vars'><li>P_j: precio de venta del producto j</li><li>m_kj × p_k: unidades de material k por su costo unitario (madera)</li><li>t_mj ÷ 60 × w_m: minutos de máquina pasados a horas, por el costo por hora del operador</li></ul><ol start='4'>" +
   "<li><b>Escribe la función objetivo:</b> utilidad de cada producto por su cantidad, sumadas.</li></ol>" + M("Máx Z = c₁x₁ + c₂x₂ + c₃x₃") + "<ol start='5'>" +
   "<li><b>Escribe una restricción por recurso:</b> lo que uso ≤ lo que tengo. Primero iguala unidades: si los tiempos están en minutos y la capacidad en horas, multiplica las horas por 60.</li></ol>" + M("Σ_j t_mj × x_j ≤ horas_m × 60") + "<ol start='6'>" +
   "<li><b>Traduce las reglas de mezcla</b> a desigualdades lineales (tabla de abajo). Nunca dejes variables dividiendo.</li>" +
   "<li><b>Indica el tipo de variables:</b> ≥ 0 siempre; elige «Enteras» si son unidades completas.</li>" +
   "<li><b>Resuelve e interpreta:</b> restricción activa (holgura 0) = cuello de botella; holgura positiva = recurso que sobra.</li>" +
   "<li><b>Verifica:</b> reemplaza la solución en cada restricción y comprueba que se cumple.</li></ol>" +
   "<h3>Cómo traducir frases a restricciones</h3><div class='tbl-wrap'><table><thead><tr><th>Frase del enunciado</th><th>Restricción</th></tr></thead><tbody>" +
   "<tr><td>Hay 80 horas de máquina y los tiempos están en minutos</td><td>… ≤ 80 × 60 = 4.800</td></tr>" +
   "<tr><td>Se usan como máximo 40.000 unidades de material</td><td>Σ (unidades por producto × x) ≤ 40.000</td></tr>" +
   "<tr><td>Se venden <b>más del triple</b> de A que de B</td><td>x_A − 3x_B ≥ 1 (enteras) o ≥ 0 (simplificada)</td></tr>" +
   "<tr><td>A es <b>al menos el doble</b> de B</td><td>x_A − 2x_B ≥ 0</td></tr>" +
   "<tr><td>A <b>no más del 20 %</b> del total</td><td>x_A ≤ 0,2(x_A + x_B + x_C) → 0,8x_A − 0,2x_B − 0,2x_C ≤ 0 → ×5: 4x_A − x_B − x_C ≤ 0</td></tr>" +
   "<tr><td>A <b>al menos el 30 %</b> del total</td><td>0,7x_A − 0,3x_B − 0,3x_C ≥ 0</td></tr>" +
   "<tr><td>Se deben fabricar al menos 50 de A</td><td>x_A ≥ 50</td></tr></tbody></table></div>" +
   "<p class='hint'>Truco del porcentaje: pasa todo a la izquierda, agrupa la variable que se repite y multiplica para quitar decimales. Multiplicar ambos lados por un número positivo no cambia la desigualdad.</p>" +
   "<h3>¿Cómo encuentra la calculadora los números?</h3><p>Las restricciones forman una región de combinaciones posibles con forma de poliedro. El óptimo siempre está en una <b>esquina</b> (vértice). El método Simplex salta de esquina en esquina, siempre hacia una que mejore Z, y se detiene cuando ninguna vecina mejora. En la esquina óptima algunas restricciones quedan justo en el límite; resolver esas ecuaciones da los valores de x. Si deben ser enteras, se ramifica: x ≤ 211 o x ≥ 212, hasta encontrar la mejor combinación entera.</p>" +
   "<h3>Ejemplo para cargar: Muebles del Sur S.A.</h3><p>Escritorios, mesas y muebles de cocina; utilidad unitaria ya descontada la madera y la mano de obra (asignación óptima de la calculadora de asignación: 7.700 por hora).</p><ul>" +
   "<li><b>Objetivo:</b> Maximizar · <b>Nombres:</b> Escritorios Mesas Cocina</li><li><b>Coeficientes:</b> 4590 4635 3051,67</li>" +
   "<li><b>Restricciones:</b><br><code>5 3 2 &lt;= 4800</code> (cortadora)<br><code>2 5 3 &lt;= 4800</code> (ensambladora)<br><code>3 2 5 &lt;= 4800</code> (barnizadora)<br><code>20 20 10 &lt;= 40000</code> (madera)<br><code>1 -3 0 &gt;= 1</code> (más del triple)<br><code>-1 4 -1 &lt;= 0</code> (mesas ≤ 20 %)</li><li><b>Tipo de variables:</b> Enteras</li></ul>" +
   "<p><b>Resultado:</b> 636 escritorios, 211 mesas y 493 muebles de cocina; Z ≈ 5.401.698. Cortadora y barnizadora quedan casi llenas (cuellos de botella); sobran madera y horas de ensambladora.</p>" +
   "<p>En Excel se resuelve con <b>Solver</b> (método Simplex LP, agregando la restricción «entero»); en Python con PuLP u OR-Tools.</p>",
  rel:["transporte", "asignacion"]
});
function lpGraph(P, R, zo){
  const pts = [], cand = [];
  const lines = P.A.map((a, i) => [a[0], a[1], P.b[i]]).concat([[1, 0, 0], [0, 1, 0]]);
  for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) { const [a1, b1, c1] = lines[i], [a2, b2, c2] = lines[j], d = a1 * b2 - a2 * b1; if (Math.abs(d) < 1e-12) continue; cand.push([(c1 * b2 - c2 * b1) / d, (a1 * c2 - a2 * c1) / d]); }
  const feas = p => p[0] >= -1e-7 && p[1] >= -1e-7 && P.A.every((a, i) => { const l = a[0] * p[0] + a[1] * p[1]; return P.ops[i] === "<=" ? l <= P.b[i] + 1e-7 : P.ops[i] === ">=" ? l >= P.b[i] - 1e-7 : Math.abs(l - P.b[i]) < 1e-7; });
  cand.filter(feas).forEach(p => { if (!pts.some(q => Math.abs(q[0] - p[0]) < 1e-7 && Math.abs(q[1] - p[1]) < 1e-7)) pts.push(p); });
  if (pts.length < 1) return "";
  const cx = mean(pts.map(p => p[0])), cy = mean(pts.map(p => p[1])); pts.sort((p, q) => Math.atan2(p[1] - cy, p[0] - cx) - Math.atan2(q[1] - cy, q[0] - cx));
  const xm = Math.max(1, ...pts.map(p => p[0])) * 1.3, ym = Math.max(1, ...pts.map(p => p[1])) * 1.3;
  const ser = P.A.map((a, i) => { const s = []; if (Math.abs(a[1]) > 1e-12) { s.push([0, P.b[i] / a[1]]); s.push([xm, (P.b[i] - a[0] * xm) / a[1]]); } else { s.push([P.b[i] / a[0], 0]); s.push([P.b[i] / a[0], ym]); } return { pts:s, cls:"sm" }; });
  const lab = P.A.map((a, i) => { const ok = q => q[0] >= 0 && q[1] >= 0 && q[0] <= xm && q[1] <= ym; const c = []; if (Math.abs(a[1]) > 1e-12) { c.push([xm * 0.82, (P.b[i] - a[0] * xm * 0.82) / a[1]]); c.push([xm * 0.15, (P.b[i] - a[0] * xm * 0.15) / a[1]]); } if (Math.abs(a[0]) > 1e-12) { c.push([(P.b[i] - a[1] * ym * 0.9) / a[0], ym * 0.9]); c.push([(P.b[i] - a[1] * ym * 0.5) / a[0], ym * 0.5]); } const q = c.find(ok); return q ? { pts:[q], cls:"sm", dot:"dlab", only:true, tags:["R" + (i + 1)], r:2 } : null; }).filter(Boolean);
  const z = zo != null ? zo : R.z, iso = Math.abs(P.c[1]) > 1e-12 ? [[0, z / P.c[1]], [xm, (z - P.c[0] * xm) / P.c[1]]] : [[z / P.c[0], 0], [z / P.c[0], ym]];
  return chart({ title:"Método gráfico", poly:[{ pts, cls:"reg" }], series:ser.concat(lab).concat([{ pts:iso, cls:"s2", dash:true }, { pts:pts, cls:"s1", dot:"d1", only:true, tags:pts.map(p => "(" + nf(p[0], 1) + "; " + nf(p[1], 1) + ")") }, { pts:[[R.x[0], R.x[1]]], cls:"s2", dot:"d2", only:true, r:7 }]), xmin:0, ymin:0, xmax:xm, ymax:ym, xlab:esc(P.nm[0]), ylab:esc(P.nm[1]), h0:360, legend:[["--ok", "Región factible"], ["--muted", "Restricciones"], ["--copper", "Recta de Z óptimo"]], cap:"El óptimo de un problema lineal siempre está en un vértice de la región factible. R1, R2… indican cada restricción en el orden en que se escribió." });
}

def("transporte", "io", {
  t:"Problema de transporte", ico:"Trp", d:"Esquina noroeste, Vogel y óptimo de costo mínimo",
  ey:"Investigación de operaciones · Redes de distribución",
  lead:"Decide cuánto enviar desde cada origen (plantas, bodegas) a cada destino (clientes, tiendas) al menor costo total.",
  f:[MAT("C", "Costos unitarios (fila = origen, columna = destino)", "8 6 10 9\n9 12 13 7\n14 9 16 5"), LST("O", "Oferta de cada origen", "35 50 40"), LST("D", "Demanda de cada destino", "45 20 30 30"), TXT("on", "Nombres de orígenes (opcional)", "Planta Santiago; Planta Rancagua; Planta Talca"), TXT("dn", "Nombres de destinos (opcional)", "Cliente 1; Cliente 2; Cliente 3; Cliente 4")],
  c(v){
    let Cm = rows(v.C).map(r => r.map(num)), O = list(v.O, "la oferta"), D = list(v.D, "la demanda");
    if (Cm.length !== O.length) fail("Hay " + Cm.length + " filas de costos y " + O.length + " ofertas."); if (Cm.some(r => r.length !== D.length || r.some(x => !fin(x)))) fail("Cada fila de costos debe tener " + D.length + " valores (uno por destino).");
    let on = (v.on || "").split(";").map(s => s.trim()).filter(Boolean), dn = (v.dn || "").split(";").map(s => s.trim()).filter(Boolean);
    while (on.length < O.length) on.push("O" + (on.length + 1)); while (dn.length < D.length) dn.push("D" + (dn.length + 1));
    const tO = sum(O), tD = sum(D); let fict = "";
    if (tO > tD + 1e-9) { D = D.concat([tO - tD]); dn = dn.concat(["Ficticio"]); Cm = Cm.map(r => r.concat([0])); fict = "Oferta mayor que demanda: se agregó un destino ficticio de " + n0(tO - tD) + " unidades (inventario no enviado)."; }
    else if (tD > tO + 1e-9) { O = O.concat([tD - tO]); on = on.concat(["Ficticio"]); Cm = Cm.concat([D.map(() => 0)]); fict = "Demanda mayor que oferta: se agregó un origen ficticio de " + n0(tD - tO) + " unidades (demanda insatisfecha)."; }
    const m = O.length, n = D.length;
    const nw = () => { const X = Cm.map(r => r.map(() => 0)), o = O.slice(), d = D.slice(); let i = 0, j = 0; while (i < m && j < n) { const q = Math.min(o[i], d[j]); X[i][j] = q; o[i] -= q; d[j] -= q; if (o[i] <= 1e-9) i++; else j++; } return X; };
    const vogel = () => { const X = Cm.map(r => r.map(() => 0)), o = O.slice(), d = D.slice(), ro = new Array(m).fill(true), co = new Array(n).fill(true);
      const pen = arr => { const s = arr.slice().sort((a, b) => a - b); return s.length > 1 ? s[1] - s[0] : s[0] || 0; };
      for (let it = 0; it < m + n; it++) { if (!ro.some(Boolean) || !co.some(Boolean)) break; let best = -1, bi = -1, bj = -1;
        for (let i = 0; i < m; i++) if (ro[i]) { const cs = Cm[i].filter((_, j) => co[j]); const p = pen(cs); if (p > best) { best = p; bi = i; bj = -1; } }
        for (let j = 0; j < n; j++) if (co[j]) { const cs = Cm.map(r => r[j]).filter((_, i) => ro[i]); const p = pen(cs); if (p > best) { best = p; bj = j; bi = -1; } }
        let i, j; if (bi >= 0) { i = bi; j = -1; let mc = Infinity; for (let k = 0; k < n; k++) if (co[k] && Cm[i][k] < mc) { mc = Cm[i][k]; j = k; } } else { j = bj; i = -1; let mc = Infinity; for (let k = 0; k < m; k++) if (ro[k] && Cm[k][j] < mc) { mc = Cm[k][j]; i = k; } }
        const q = Math.min(o[i], d[j]); X[i][j] += q; o[i] -= q; d[j] -= q; if (o[i] <= 1e-9) ro[i] = false; else co[j] = false; if (d[j] <= 1e-9) co[j] = false; }
      return X; };
    const cost = X => sum(X.map((r, i) => sum(r.map((x, j) => x * Cm[i][j]))));
    const c = [], A = [], ops = [], b = []; for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) c.push(Cm[i][j]);
    for (let i = 0; i < m; i++) { A.push(c.map((_, k) => Math.floor(k / n) === i ? 1 : 0)); ops.push("="); b.push(O[i]); }
    for (let j = 0; j < n; j++) { A.push(c.map((_, k) => k % n === j ? 1 : 0)); ops.push("="); b.push(D[j]); }
    const R = lpSolve(c, A, ops, b, false); if (R.status !== "opt") fail("No se pudo resolver el modelo.");
    const Xo = Cm.map((r, i) => r.map((_, j) => Math.round(R.x[i * n + j] * 1e6) / 1e6)), XN = nw(), XV = vogel();
    const grid = X => table([""].concat(dn.map(esc)).concat(["Oferta"]), X.map((r, i) => ["<b>" + esc(on[i]) + "</b>"].concat(r.map((x, j) => x > 1e-9 ? "<b>" + n0(x) + "</b> <span class='hint'>×" + nf(Cm[i][j], 0) + "</span>" : '<span class="hint">·</span>')).concat([n0(O[i])])), { num:Array.from({ length:n + 1 }, (_, k) => k + 1), foot:["Demanda"].concat(D.map(n0)).concat([n0(sum(O))]) });
    let h = kpis([kpi("Costo óptimo", money(R.z), "", "hi"), kpi("Esquina noroeste", money(cost(XN)), "+" + pc(cost(XN) / R.z - 1) + " vs óptimo"), kpi("Vogel (VAM)", money(cost(XV)), "+" + pc(cost(XV) / R.z - 1) + " vs óptimo")]);
    if (fict) h += note(fict, "info");
    h += h3("Plan óptimo de envíos") + grid(Xo) + steps([
      { t:"Balancear oferta y demanda", f:"Σ oferta = Σ demanda (si no, agregar origen o destino ficticio con costo 0)" },
      { t:"Solución inicial", q:"Esquina noroeste asigna sin mirar costos; Vogel calcula penalidades (diferencia entre los dos costos más bajos de cada fila y columna) y asigna donde la penalidad es mayor.", s:"Esquina NO: " + money(cost(XN)) + " · Vogel: " + money(cost(XV)), why:"Vogel suele quedar muy cerca del óptimo." },
      { t:"Optimización", q:"Se mejora la solución inicial (método MODI o de los multiplicadores u_i + v_j = c_ij) hasta que ningún costo reducido sea negativo. Aquí se resolvió como programa lineal.", r:money(R.z), c:"ok" }
    ]);
    h += '<details class="item"><summary>Ver solución de Vogel</summary><div class="body">' + grid(XV) + '</div></details><details class="item"><summary>Ver solución de esquina noroeste</summary><div class="body">' + grid(XN) + "</div></details>";
    return h;
  },
  rel:["programacion-lineal", "asignacion", "localizacion"]
});

def("asignacion", "io", {
  t:"Problema de asignación", ico:"Asg", d:"Asigna personas a tareas o máquinas a trabajos al menor costo o mayor beneficio",
  ey:"Investigación de operaciones · Método húngaro",
  lead:"Cada fila (persona, máquina) se asigna a exactamente una columna (tarea, turno). Si la matriz no es cuadrada se completa con filas o columnas ficticias.",
  f:[SEL("tipo", "Objetivo", "min", [["min", "Minimizar costo o tiempo"], ["max", "Maximizar beneficio o puntaje"]]), MAT("M", "Matriz (fila = recurso, columna = tarea)", "15 10 9 14\n9 15 10 12\n10 12 8 11\n13 11 14 10"), TXT("rn", "Nombres de filas (opcional)", "Ana; Benjamín; Camila; Diego"), TXT("cn", "Nombres de columnas (opcional)", "Torno; Fresa; Soldadura; Pintura")],
  c(v){
    let M = rows(v.M).map(r => r.map(num)); if (!M.length || M.some(r => r.some(x => !fin(x)))) fail("Revisa la matriz: solo números.");
    const m0 = M.length, n0_ = Math.max.apply(null, M.map(r => r.length)); if (M.some(r => r.length !== n0_)) fail("Todas las filas deben tener la misma cantidad de columnas.");
    const k = Math.max(m0, n0_); if (k > 10) fail("Máximo 10 × 10.");
    let rn = (v.rn || "").split(";").map(s => s.trim()).filter(Boolean), cn = (v.cn || "").split(";").map(s => s.trim()).filter(Boolean);
    while (rn.length < k) rn.push(rn.length < m0 ? "F" + (rn.length + 1) : "Ficticio"); while (cn.length < k) cn.push(cn.length < n0_ ? "C" + (cn.length + 1) : "Ficticia");
    const P = Array.from({ length:k }, (_, i) => Array.from({ length:k }, (_, j) => i < m0 && j < n0_ ? M[i][j] : 0));
    const c = [], A = [], ops = [], b = []; for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) c.push(P[i][j]);
    for (let i = 0; i < k; i++) { A.push(c.map((_, q) => Math.floor(q / k) === i ? 1 : 0)); ops.push("="); b.push(1); }
    for (let j = 0; j < k; j++) { A.push(c.map((_, q) => q % k === j ? 1 : 0)); ops.push("="); b.push(1); }
    const R = lpSolve(c, A, ops, b, v.tipo === "max"); if (R.status !== "opt") fail("No se pudo resolver.");
    const asg = []; for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) if (R.x[i * k + j] > 0.5) asg.push([i, j]);
    let h = kpis([kpi(v.tipo === "max" ? "Beneficio total" : "Costo total", nf(R.z, 2), "", "hi"), kpi("Asignaciones", asg.filter(a => a[0] < m0 && a[1] < n0_).length)]);
    h += table(["Recurso", "Asignado a", "Valor"], asg.map(a => rowc([esc(rn[a[0]]), esc(cn[a[1]]), nf(P[a[0]][a[1]], 2)], a[0] >= m0 || a[1] >= n0_ ? "" : "sel")), { num:[2] });
    h += table([""].concat(cn.map(esc)), P.map((r, i) => ["<b>" + esc(rn[i]) + "</b>"].concat(r.map((x, j) => asg.some(a => a[0] === i && a[1] === j) ? "<b>[" + nf(x, 1) + "]</b>" : nf(x, 1)))), { num:Array.from({ length:k }, (_, q) => q + 1) });
    h += steps([{ t:"Método húngaro (resumen)", q:"1) Resta el mínimo de cada fila. 2) Resta el mínimo de cada columna. 3) Cubre los ceros con el menor número de líneas. 4) Si hay k líneas, asigna en los ceros; si no, resta el menor valor no cubierto, súmalo en las intersecciones y repite.", why:"para maximizar, primero transforma: valor máximo − cada valor, y minimiza." }]);
    return h;
  },
  rel:["transporte", "programacion-lineal"]
});

def("cpm", "io", {
  t:"CPM / PERT: ruta crítica", ico:"CPM", d:"Holguras, ruta crítica, duración esperada y probabilidad de cumplir el plazo",
  ey:"Gestión de proyectos · Redes de actividades",
  lead:"Ingresa las actividades con sus precedencias y duraciones (una o tres estimaciones). La app calcula fechas tempranas y tardías, holguras, ruta crítica y la carta Gantt.",
  f:[MAT("a", "Actividades: id ; precedentes ; duración  (o: optimista ; probable ; pesimista)", "A;-;2;4;6\nB;-;3;5;9\nC;A;4;5;7\nD;A;4;6;10\nE;B,C;4;5;7\nF;D;3;4;8\nG;E;3;5;8\nH;F,G;1;2;3", { h:"«-» si no tiene precedentes. Con 3 duraciones se aplica PERT." }), F("T", "Plazo comprometido (opcional)", 22)],
  c(v){
    const A = {}, ids = [];
    rows(v.a).forEach(r => { if (r.length < 3) fail("Cada fila necesita id, precedentes y duración: «" + r.join(";") + "»."); const nums = r.slice(2).map(num); if (nums.some(x => !fin(x) || x < 0)) fail("Duraciones inválidas en " + r[0] + ".");
      let te, va = 0; if (nums.length >= 3) { const [a, m, b] = nums; if (!(a <= m && m <= b)) fail("En " + r[0] + " debe cumplirse optimista ≤ probable ≤ pesimista."); te = (a + 4 * m + b) / 6; va = Math.pow((b - a) / 6, 2); } else te = nums[0];
      A[r[0]] = { id:r[0], p:r[1] && r[1] !== "-" ? r[1].split(/[,\s]+/).filter(Boolean) : [], te, va, est:nums }; ids.push(r[0]); });
    if (!ids.length) fail("Ingresa actividades.");
    ids.forEach(id => A[id].p.forEach(p => { if (!A[p]) fail("La actividad " + id + " depende de «" + p + "», que no existe."); }));
    const order = [], vis = {}, tmp = {}; const visit = id => { if (vis[id]) return; if (tmp[id]) fail("Hay un ciclo en las precedencias que pasa por " + id + "."); tmp[id] = 1; A[id].p.forEach(visit); tmp[id] = 0; vis[id] = 1; order.push(id); }; ids.forEach(visit);
    order.forEach(id => { const a = A[id]; a.ES = a.p.length ? Math.max.apply(null, a.p.map(p => A[p].EF)) : 0; a.EF = a.ES + a.te; });
    const Tp = Math.max.apply(null, ids.map(id => A[id].EF));
    order.slice().reverse().forEach(id => { const a = A[id], suc = ids.filter(j => A[j].p.includes(id)); a.LF = suc.length ? Math.min.apply(null, suc.map(j => A[j].LS)) : Tp; a.LS = a.LF - a.te; a.HT = a.LS - a.ES; a.HL = (suc.length ? Math.min.apply(null, suc.map(j => A[j].ES)) : Tp) - a.EF; a.crit = Math.abs(a.HT) < 1e-9; });
    const crit = order.filter(id => A[id].crit), pert = ids.some(id => A[id].est.length >= 3), varT = sum(crit.map(id => A[id].va)), sT = Math.sqrt(varT), T = opt(v, "T");
    let h = kpis([kpi("Duración del proyecto", nf(Tp, 2), "u. de tiempo", "hi"), kpi("Ruta crítica", crit.join(" → ")), kpi("Actividades críticas", crit.length + " de " + ids.length)].concat(pert ? [kpi("σ del proyecto", nf(sT, 3))] : []).concat(pert && T != null && sT > 0 ? [kpi("P(terminar ≤ " + nf(T, 1) + ")", pc(Phi((T - Tp) / sT)), "", Phi((T - Tp) / sT) >= 0.9 ? "ok" : "bad")] : []));
    h += table(["Actividad", "Precedentes", "Duración" + (pert ? " (te)" : ""), pert ? "Varianza" : "", "IC", "TC", "IL", "TL", "Holgura total", "Holgura libre", ""], order.map(id => { const a = A[id]; return rowc([a.id, a.p.join(", ") || "—", nf(a.te, 2), pert ? nf(a.va, 3) : "", nf(a.ES, 2), nf(a.EF, 2), nf(a.LS, 2), nf(a.LF, 2), nf(a.HT, 2), nf(a.HL, 2), a.crit ? pill("bad", "Crítica") : ""], a.crit ? "badr" : ""); }), { num:[2, 3, 4, 5, 6, 7, 8, 9] });
    h += cpmNet(A, order);
    h += gantt(order.map(id => ({ id, s:A[id].ES, d:A[id].te, crit:A[id].crit, slack:A[id].HT })));
    h += steps([
      pert ? { t:"Duración esperada PERT", f:"te = (a + 4m + b) ÷ 6   ·   σ² = [(b − a) ÷ 6]²", why:"supone una distribución beta para cada actividad." } : { t:"Duraciones", q:"Se usaron duraciones determinísticas (CPM)." },
      { t:"Pasada hacia adelante", f:"IC = máx(TC de las precedentes)   ·   TC = IC + duración", r:"Duración = " + nf(Tp, 2) },
      { t:"Pasada hacia atrás", f:"TL = mín(IL de las sucesoras)   ·   IL = TL − duración" },
      { t:"Holguras", f:"Holgura total = IL − IC   ·   Holgura libre = mín(IC sucesoras) − TC", why:"la holgura total es cuánto puede atrasarse una actividad sin atrasar el proyecto; la libre, sin atrasar a ninguna otra." }
    ].concat(pert && T != null && sT > 0 ? [{ t:"Probabilidad de cumplir el plazo", f:"z = (T − T_esperado) ÷ σ_ruta crítica", s:"z = (" + nf(T, 2) + " − " + nf(Tp, 2) + ") ÷ " + nf(sT, 3) + " = " + nf((T - Tp) / sT, 3), r:pc(Phi((T - Tp) / sT)), c:Phi((T - Tp) / sT) >= 0.9 ? "ok" : "warn", why:"solo considera la variabilidad de la ruta crítica; si hay rutas casi críticas, la probabilidad real es menor." }] : []));
    return h;
  },
  learn:"<p>Para <b>acortar</b> el proyecto (crashing) se comprimen actividades de la ruta crítica empezando por la de menor costo de aceleración por unidad de tiempo, revisando en cada paso si aparecen nuevas rutas críticas.</p><p>IC = inicio más cercano (temprano), TC = término más cercano, IL = inicio más lejano (tardío), TL = término más lejano.</p>",
  rel:["secuenciacion", "gestion-proyectos"]
});

def("decisiones", "io", {
  t:"Decisiones bajo incertidumbre y riesgo", ico:"Dec", d:"Maximax, maximin, Hurwicz, Laplace, Savage, valor esperado y VEIP",
  ey:"Teoría de decisiones · Matriz de pagos",
  lead:"Compara alternativas frente a escenarios futuros con distintos criterios, con o sin probabilidades.",
  f:[MAT("m", "Matriz de pagos: alternativa ; resultado en cada escenario", "Planta grande;200;50;-120\nPlanta mediana;90;40;-30\nPlanta pequeña;40;30;-10\nNo invertir;0;0;0"), TXT("es", "Nombres de escenarios (opcional)", "Demanda alta; Demanda media; Demanda baja"), LST("p", "Probabilidades (opcional, suman 1)", "0.3 0.5 0.2"), F("a", "Coeficiente de optimismo α (Hurwicz)", 0.6), SEL("tipo", "Los valores son", "g", [["g", "Ganancias (más es mejor)"], ["c", "Costos (menos es mejor)"]])],
  c(v){
    const R = rows(v.m).map(r => ({ nm:r[0], x:r.slice(1).map(num) })); if (R.length < 2) fail("Ingresa al menos 2 alternativas."); const k = R[0].x.length; if (!k || R.some(r => r.x.length !== k || r.x.some(x => !fin(x)))) fail("Todas las alternativas deben tener " + k + " valores numéricos.");
    let es = (v.es || "").split(";").map(s => s.trim()).filter(Boolean); while (es.length < k) es.push("E" + (es.length + 1));
    const sg = v.tipo === "c" ? -1 : 1, a = need(v, "a", "α"); if (a < 0 || a > 1) fail("α debe estar entre 0 y 1.");
    let p = list(v.p || "", "probabilidades"); if (p.length && p.length !== k) fail("Ingresa " + k + " probabilidades."); if (p.length && Math.abs(sum(p) - 1) > 0.01) fail("Las probabilidades suman " + nf(sum(p), 3) + " y deben sumar 1.");
    const G = R.map(r => r.x.map(x => x * sg)), colMax = Array.from({ length:k }, (_, j) => Math.max.apply(null, G.map(g => g[j])));
    const crit = [["Maximax (optimista)", g => Math.max.apply(null, g)], ["Maximin (pesimista / Wald)", g => Math.min.apply(null, g)], ["Hurwicz (α = " + nf(a, 2) + ")", g => a * Math.max.apply(null, g) + (1 - a) * Math.min.apply(null, g)], ["Laplace (igual probabilidad)", g => mean(g)], ["Savage (mínimo arrepentimiento máx.)", g => -Math.max.apply(null, g.map((x, j) => colMax[j] - x))]];
    if (p.length) crit.push(["Valor esperado", g => sum(g.map((x, j) => x * p[j]))]);
    const res = crit.map(c => { const vals = G.map(c[1]), b = Math.max.apply(null, vals); return { nm:c[0], vals, best:R[vals.indexOf(b)].nm, bv:b }; });
    let h = table(["Criterio"].concat(R.map(r => esc(r.nm))).concat(["Elegida"]), res.map(r => [r.nm].concat(r.vals.map((x, i) => (r.best === R[i].nm ? "<b>" : "") + nf(x * (r.nm.startsWith("Savage") ? -1 : sg), 2) + (r.best === R[i].nm ? "</b>" : ""))).concat([pill("ok", esc(r.best))])), { num:R.map((_, i) => i + 1) });
    h += h3("Matriz de arrepentimiento (Savage)") + table(["Alternativa"].concat(es.map(esc)).concat(["Máximo"]), R.map((r, i) => { const rg = G[i].map((x, j) => colMax[j] - x); return [esc(r.nm)].concat(rg.map(x => nf(x, 2))).concat(["<b>" + nf(Math.max.apply(null, rg), 2) + "</b>"]); }), { num:Array.from({ length:k + 1 }, (_, j) => j + 1) });
    if (p.length) { const VEcIP = sum(colMax.map((x, j) => x * p[j])), VE = res[res.length - 1].bv, VEIP = VEcIP - VE;
      h += kpis([kpi("Mejor valor esperado", nf(VE * sg, 2), esc(res[res.length - 1].best), "hi"), kpi("VE con información perfecta", nf(VEcIP * sg, 2)), kpi("VEIP", nf(VEIP, 2), "máximo a pagar por información")]);
      h += steps([{ t:"Valor esperado", f:"VE(a) = Σ p_j × resultado(a, j)", r:esc(res[res.length - 1].best) }, { t:"Valor esperado de la información perfecta", f:"VEIP = Σ p_j × máx_a resultado(a, j) − máx VE", s:nf(VEcIP * sg, 2) + " − " + nf(VE * sg, 2) + " = " + nf(VEIP, 2), r:nf(VEIP, 2), why:"ningún estudio de mercado vale más que esto." }]); }
    return h;
  },
  learn:"<p>Usa los criterios sin probabilidades solo cuando de verdad no puedas estimarlas. Con probabilidades, el valor esperado es el criterio estándar para decisiones repetidas; para decisiones únicas y de gran impacto, considera también el riesgo (desviación de los resultados) o la utilidad.</p>",
  rel:["factores", "simulacion-mc"]
});

def("ruta-corta", "io", {
  t:"Ruta más corta (Dijkstra)", ico:"Dij", d:"Camino de menor distancia, tiempo o costo en una red",
  ey:"Investigación de operaciones · Modelos de redes",
  lead:"Ingresa los arcos de la red con su distancia, tiempo o costo y obtén el camino más corto entre dos nodos.",
  f:[MAT("e", "Arcos: desde ; hasta ; distancia", "Bodega;A;7\nBodega;B;9\nBodega;F;14\nA;B;10\nA;C;15\nB;C;11\nB;F;2\nC;D;6\nD;Cliente;9\nF;Cliente;11\nF;D;8"), TXT("o", "Nodo de origen", "Bodega"), TXT("d", "Nodo de destino", "Cliente"), SEL("dir", "Arcos", "no", [["no", "En ambos sentidos"], ["si", "Dirigidos (solo desde → hasta)"]])],
  c(v){
    const E = rows(v.e).map(r => ({ a:r[0], b:r[1], w:num(r[2]) })); if (!E.length || E.some(e => !e.a || !e.b || !fin(e.w) || e.w < 0)) fail("Cada arco necesita origen, destino y distancia ≥ 0.");
    const adj = {}; const add = (a, b, w) => { (adj[a] = adj[a] || []).push([b, w]); adj[b] = adj[b] || []; }; E.forEach(e => { add(e.a, e.b, e.w); if (v.dir !== "si") add(e.b, e.a, e.w); });
    const o = (v.o || "").trim(), d = (v.d || "").trim(); if (!adj[o]) fail("El nodo de origen «" + o + "» no está en la red."); if (!adj[d]) fail("El nodo de destino «" + d + "» no está en la red.");
    const dist = {}, prev = {}, done = new Set(); Object.keys(adj).forEach(k => dist[k] = Infinity); dist[o] = 0; const log = [];
    while (true) { let u = null; Object.keys(dist).forEach(k => { if (!done.has(k) && (u === null || dist[k] < dist[u])) u = k; }); if (u === null || dist[u] === Infinity) break; done.add(u); log.push(u + " (" + nf(dist[u], 1) + ")"); adj[u].forEach(([w, c]) => { if (dist[u] + c < dist[w]) { dist[w] = dist[u] + c; prev[w] = u; } }); }
    if (dist[d] === Infinity) return note("No existe camino de " + esc(o) + " a " + esc(d) + ".", "bad");
    const path = []; for (let x = d; x; x = prev[x]) { path.unshift(x); if (x === o) break; }
    let h = kpis([kpi("Distancia mínima", nf(dist[d], 2), "", "hi"), kpi("Ruta", path.map(esc).join(" → ")), kpi("Tramos", path.length - 1)]);
    h += steps([{ t:"Algoritmo de Dijkstra", q:"Se etiqueta el origen con 0. En cada paso se fija el nodo no visitado con menor etiqueta y se actualizan sus vecinos si se encuentra un camino más corto.", s:"Orden en que se fijaron los nodos: " + log.map(esc).join(" → "), r:path.map(esc).join(" → "), c:"ok", why:"funciona solo con distancias no negativas." }]);
    h += table(["Nodo", "Distancia desde " + esc(o), "Llega desde"], Object.keys(dist).sort((x, y) => dist[x] - dist[y]).map(k => rowc([esc(k), fin(dist[k]) ? nf(dist[k], 2) : "∞", prev[k] ? esc(prev[k]) : "—"], path.includes(k) ? "sel" : "")), { num:[1] });
    return h;
  },
  rel:["transporte", "localizacion"]
});

def("localizacion", "io", {
  t:"Localización: centro de gravedad", ico:"CG", d:"Ubicación de una planta o bodega que minimiza el costo de transporte",
  ey:"Diseño de la cadena de suministro · Localización de instalaciones",
  lead:"Ingresa las coordenadas de clientes o proveedores con el volumen que se mueve hacia cada uno.",
  f:[MAT("p", "Puntos: nombre ; x ; y ; volumen", "Santiago;50;80;3200\nValparaíso;20;85;1100\nRancagua;55;60;900\nTalca;60;25;700\nSan Antonio;18;62;600\nLos Andes;68;95;450"), F("ct", "Costo de transporte", 1.2, { u:"$ por unidad·km" })],
  c(v){
    const P = rows(v.p).map(r => ({ nm:r[0], x:num(r[1]), y:num(r[2]), w:num(r[3]) })); if (P.length < 2 || P.some(p => ![p.x, p.y, p.w].every(fin) || p.w < 0)) fail("Cada punto necesita nombre, x, y y volumen.");
    const W = sum(P.map(p => p.w)), cx = sum(P.map(p => p.x * p.w)) / W, cy = sum(P.map(p => p.y * p.w)) / W, ct = opt(v, "ct") || 1;
    let x = cx, y = cy; for (let it = 0; it < 500; it++) { let nx = 0, ny = 0, dd = 0; P.forEach(p => { const d = Math.hypot(p.x - x, p.y - y) || 1e-9; nx += p.w * p.x / d; ny += p.w * p.y / d; dd += p.w / d; }); const X2 = nx / dd, Y2 = ny / dd; if (Math.hypot(X2 - x, Y2 - y) < 1e-7) { x = X2; y = Y2; break; } x = X2; y = Y2; }
    const cost = (a, b) => sum(P.map(p => p.w * Math.hypot(p.x - a, p.y - b))) * ct;
    let h = kpis([kpi("Centro de gravedad", "(" + nf(cx, 2) + " ; " + nf(cy, 2) + ")"), kpi("Costo con centro de gravedad", money(cost(cx, cy))), kpi("Óptimo euclidiano (Weiszfeld)", "(" + nf(x, 2) + " ; " + nf(y, 2) + ")", "", "hi"), kpi("Costo mínimo", money(cost(x, y)))]);
    h += steps([
      { t:"Centro de gravedad", f:"Cx = Σ(x_i·V_i) ÷ ΣV_i   ·   Cy = Σ(y_i·V_i) ÷ ΣV_i", s:"Cx = " + nf(sum(P.map(p => p.x * p.w)), 0) + " ÷ " + n0(W) + " = " + nf(cx, 3) + " · Cy = " + nf(cy, 3), r:"(" + nf(cx, 2) + " ; " + nf(cy, 2) + ")", why:"es un buen punto de partida, pero minimiza distancias al cuadrado, no el costo real." },
      { t:"Mejora iterativa (Weiszfeld)", f:"x_(k+1) = Σ(V_i·x_i/d_i) ÷ Σ(V_i/d_i)", r:"(" + nf(x, 2) + " ; " + nf(y, 2) + ")", c:"ok", why:"minimiza la suma de volumen × distancia en línea recta." }
    ]);
    h += chart({ title:"Mapa", series:[{ pts:P.map(p => [p.x, p.y]), cls:"s1", dot:"d1", only:true, tags:P.map(p => p.nm), r:5 }, { pts:[[cx, cy]], cls:"s3", dot:"d3", only:true, tags:["CG"], r:6 }, { pts:[[x, y]], cls:"s2", dot:"d2", only:true, tags:["Óptimo"], r:6 }], xlab:"x (km)", ylab:"y (km)", h0:360 });
    h += note("Complementa con factores cualitativos (terrenos, normativa, mano de obra, accesos) usando el método de factores ponderados.", "info");
    return h;
  },
  rel:["factores", "transporte"]
});

def("factores", "io", {
  t:"Evaluación por factores ponderados", ico:"Pnd", d:"Decisión multicriterio: localización, proveedores, proyectos",
  ey:"Toma de decisiones · Análisis multicriterio",
  lead:"Asigna un peso a cada criterio y una nota a cada alternativa. La app normaliza los pesos y ordena las alternativas.",
  f:[TXT("alt", "Alternativas (separadas por ;)", "Quilicura; Pudahuel; Lampa"), MAT("m", "Criterios: nombre ; peso ; nota de cada alternativa (1–10)", "Costo del terreno;25;6;7;9\nAcceso a autopistas;20;9;8;6\nDisponibilidad de mano de obra;15;8;8;6\nCercanía a clientes;20;9;7;5\nNormativa y permisos;10;7;8;6\nRiesgo de inundación;10;8;6;7")],
  c(v){
    const al = (v.alt || "").split(";").map(s => s.trim()).filter(Boolean); if (al.length < 2) fail("Ingresa al menos 2 alternativas separadas por punto y coma.");
    const R = rows(v.m).map(r => ({ nm:r[0], w:num(r[1]), s:r.slice(2).map(num) })); if (!R.length || R.some(r => !fin(r.w) || r.s.length !== al.length || r.s.some(x => !fin(x)))) fail("Cada criterio necesita peso y " + al.length + " notas.");
    const W = sum(R.map(r => r.w)), tot = al.map((_, j) => sum(R.map(r => r.w / W * r.s[j]))), ord = tot.map((t, j) => [t, j]).sort((a, b) => b[0] - a[0]);
    let h = kpis(ord.map((o, k) => kpi((k + 1) + "° " + esc(al[o[1]]), nf(o[0], 2), "de 10", k === 0 ? "hi" : "")));
    h += table(["Criterio", "Peso"].concat(al.map(esc)), R.map(r => [esc(r.nm), pc(r.w / W, 0)].concat(r.s.map(x => nf(x, 1) + ' <span class="hint">→ ' + nf(x * r.w / W, 2) + "</span>"))), { num:Array.from({ length:al.length + 1 }, (_, i) => i + 1), foot:["Puntaje ponderado", pc(1, 0)].concat(tot.map(t => "<b>" + nf(t, 2) + "</b>")) });
    h += steps([{ t:"Puntaje ponderado", f:"Puntaje_j = Σ (peso_i ÷ Σpesos) × nota_ij", r:esc(al[ord[0][1]]) + " con " + nf(ord[0][0], 2), c:"ok", why:"la diferencia con la segunda es " + nf(ord[0][0] - ord[1][0], 2) + " puntos. Si es pequeña, haz un análisis de sensibilidad cambiando los pesos más discutibles." }]);
    h += chart({ title:"Puntajes", bars:tot.map((t, j) => ({ x:j + 1, y:t, cls:j === ord[0][1] ? "bar2" : "bar1", lbl:nf(t, 2) })), xcat:al, ymin:0, ymax:10, ylab:"Puntaje" });
    return h;
  },
  rel:["localizacion", "decisiones"]
});

def("simulacion-mc", "io", {
  t:"Simulación Monte Carlo de un proyecto", ico:"MC", d:"Riesgo del VAN con variables inciertas (distribución triangular)",
  ey:"Análisis de riesgo · Simulación",
  lead:"Define las variables inciertas con su valor mínimo, más probable y máximo. La app simula miles de escenarios y entrega la distribución del VAN.",
  f:[F("I", "Inversión inicial", 80000000, { u:"$" }), F("n", "Horizonte", 5, { u:"años" }), F("r", "Tasa de descuento", 12, { u:"%" }), F("t", "Impuesto", 27, { u:"%" }), LST("Q", "Unidades vendidas por año: mín ; probable ; máx", "9000 12000 14000"), LST("P", "Precio unitario: mín ; probable ; máx", "6500 7200 7800"), LST("CV", "Costo variable unitario: mín ; probable ; máx", "3800 4200 5000"), F("CF", "Costos fijos anuales", 12000000, { u:"$" }), F("N", "Número de simulaciones", 5000)],
  c(v){
    const I = need(v, "I", "Inversión", { nn:true }), n = need(v, "n", "Horizonte", { pos:true, int:true, max:30 }), r = need(v, "r", "Tasa") / 100, t = need(v, "t", "Impuesto") / 100, CF = need(v, "CF", "Costos fijos", { nn:true }), N = Math.min(20000, need(v, "N", "Simulaciones", { pos:true, int:true }));
    const tri = (s, nm) => { const x = list(s, nm); if (x.length !== 3 || !(x[0] <= x[1] && x[1] <= x[2])) fail("En «" + nm + "» ingresa mín ≤ probable ≤ máx."); return x; };
    const Qd = tri(v.Q, "unidades"), Pd = tri(v.P, "precio"), Cd = tri(v.CV, "costo variable");
    let seed = 12345; const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    const tr = ([a, m, b]) => { if (b === a) return a; const u = rnd(), fc = (m - a) / (b - a); return u < fc ? a + Math.sqrt(u * (b - a) * (m - a)) : b - Math.sqrt((1 - u) * (b - a) * (b - m)); };
    const dep = I / n, out = [];
    for (let s = 0; s < N; s++) { const Fl = [-I]; for (let k = 1; k <= n; k++) { const q = tr(Qd), p = tr(Pd), c = tr(Cd); const uai = q * (p - c) - CF - dep; const imp = uai > 0 ? uai * t : 0; Fl.push(uai - imp + dep); } out.push(npv(r, Fl)); }
    out.sort((a, b) => a - b); const m = mean(out), sdv = sd(out), pNeg = out.filter(x => x < 0).length / N, q = p => out[Math.min(N - 1, Math.floor(p * N))];
    let h = kpis([kpi("VAN esperado", money(m), "", "hi"), kpi("Desviación del VAN", money(sdv)), kpi("Probabilidad de VAN < 0", pc(pNeg), "", pNeg > 0.2 ? "bad" : "ok"), kpi("VAN P5 – P95", money(q(0.05)) + " a " + money(q(0.95)))]);
    const k = 24, lo = out[0], hi = out[N - 1], w = (hi - lo) / k || 1, bins = new Array(k).fill(0); out.forEach(x => { let i = Math.floor((x - lo) / w); if (i >= k) i = k - 1; bins[i]++; });
    h += chart({ title:"Distribución del VAN", bars:bins.map((c, i) => ({ x:lo + (i + 0.5) * w, y:c / N * 100, cls:lo + (i + 0.5) * w < 0 ? "bar2" : "bar3" })), bw:0.95 * w, v:[{ x:0, cls:"sb", lbl:"VAN = 0" }], xlab:"VAN ($)", ylab:"% de escenarios", cap:"Barras cobrizas: escenarios con pérdida." });
    h += steps([{ t:"Muestreo", f:"Triangular(a, m, b) por transformada inversa", q:"En cada una de las " + n0(N) + " iteraciones se sortean unidades, precio y costo para cada año y se calcula el VAN." }, { t:"Lectura", r:"P(VAN < 0) = " + pc(pNeg), c:pNeg > 0.2 ? "warn" : "ok", why:"el VAN determinístico esconde el riesgo; dos proyectos con igual VAN esperado pueden tener riesgos muy distintos." }]);
    h += table(["Percentil", "VAN"], [0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95].map(p => ["P" + Math.round(p * 100), money(q(p))]), { num:[1] });
    return h;
  },
  rel:["van-tir", "flujo-caja", "decisiones"]
});
