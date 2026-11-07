/* ---------------- PRODUCCIÓN Y OPERACIONES ---------------- */
def("pronosticos", "ops", {
  t:"Pronósticos de demanda", ico:"Prn", d:"Promedio móvil, suavizamiento exponencial y tendencia lineal con MAD y MAPE",
  ey:"Planificación de la producción · Series de tiempo",
  lead:"Ingresa la demanda histórica. La app aplica tres métodos, mide su error y recomienda el más preciso para el próximo período.",
  f:[LST("D", "Demanda histórica (más antigua primero)", "420 445 430 470 490 465 510 525 505 540 560 548"), F("n", "Períodos del promedio móvil", 3), F("a", "Constante de suavizamiento α", 0.3, { h:"Entre 0 y 1. Alta = reacciona rápido; baja = suaviza." }), F("h", "Períodos a proyectar", 3)],
  c(v){
    const D = list(v.D, "la demanda"), N = D.length, n = need(v, "n", "Períodos móviles", { pos:true, int:true }), a = need(v, "a", "α"), H = Math.min(12, need(v, "h", "Períodos a proyectar", { pos:true, int:true }));
    if (N < Math.max(4, n + 2)) fail("Necesitas al menos " + Math.max(4, n + 2) + " datos.");
    if (!(a > 0 && a < 1)) fail("α debe estar entre 0 y 1.");
    const ma = NUC.mediaMovil(D, n);
    const es = NUC.suavizamiento(D, a);
    const TL = NUC.tendencia(D), a0 = TL.a0, b = TL.b;
    const lr = TL.lr;
    const err = f => NUC.errores(D, f);
    const M = [{ nm:"Promedio móvil (" + n + ")", f:ma, nx:mean(D.slice(N - n)), E:err(ma), proj:() => mean(D.slice(N - n)) }, { nm:"Suavizamiento exponencial (α = " + nf(a, 2) + ")", f:es.slice(0, N), nx:es[N], E:err(es.slice(0, N)), proj:() => es[N] }, { nm:"Tendencia lineal", f:lr, nx:a0 + b * (N + 1), E:err(lr), proj:k => a0 + b * (N + k) }];
    const best = M.reduce((p, q) => q.E.MAD < p.E.MAD ? q : p);
    let h = kpis([kpi("Método recomendado", best.nm.split(" (")[0], "", "hi"), kpi("Pronóstico próximo período", n0(best.nx), "unidades"), kpi("MAD", nf(best.E.MAD, 1)), kpi("MAPE", pc(best.E.MAPE))]);
    h += table(["Método", "Próximo período", "MAD", "MSE", "MAPE", "Señal de rastreo", ""], M.map(m => rowc([m.nm, n0(m.nx), nf(m.E.MAD, 1), n0(m.E.MSE), pc(m.E.MAPE), nf(m.E.TS, 2), Math.abs(m.E.TS) > 4 ? pill("bad", "Sesgo") : pill("ok", "Sin sesgo")], m === best ? "sel" : "")), { num:[1, 2, 3, 4, 5] });
    h += steps([
      { t:"Promedio móvil simple", f:"F_(t+1) = (D_t + D_(t−1) + … + D_(t−n+1)) ÷ n", s:"F_" + (N + 1) + " = (" + D.slice(N - n).join(" + ") + ") ÷ " + n + " = " + nf(M[0].nx, 1), why:"útil con demanda estable; siempre va atrasado si hay tendencia." },
      { t:"Suavizamiento exponencial simple", f:"F_(t+1) = α × D_t + (1 − α) × F_t", s:"F_" + (N + 1) + " = " + nf(a, 2) + " × " + D[N - 1] + " + " + nf(1 - a, 2) + " × " + nf(es[N - 1], 1) + " = " + nf(es[N], 1), why:"da más peso a lo reciente y necesita guardar muy pocos datos." },
      { t:"Tendencia lineal (mínimos cuadrados)", f:"F_t = a + b × t   ·   b = Σ(t − t̄)(D − D̄) ÷ Σ(t − t̄)²", s:"b = " + nf(b, 3) + " · a = " + nf(a0, 2) + " → F_" + (N + 1) + " = " + nf(M[2].nx, 1), why:"captura crecimiento o caída sostenidos." },
      { t:"Medir el error", f:"MAD = Σ|D − F| ÷ n   ·   MAPE = Σ(|D − F| ÷ D) ÷ n   ·   TS = Σ(D − F) ÷ MAD", r:"Gana " + best.nm + " (menor MAD)", c:"ok", why:"una señal de rastreo fuera de ±4 indica que el método se equivoca sistemáticamente hacia un lado." }
    ]);
    const proj = []; for (let k = 1; k <= H; k++) proj.push([N + k, best.proj(k)]);
    h += h3("Proyección con " + best.nm) + table(["Período", "Pronóstico"], proj.map(p => [p[0], n0(p[1])]), { num:[0, 1] });
    h += chart({ title:"Demanda y pronósticos", series:[{ pts:D.map((d, i) => [i + 1, d]), cls:"s1", dot:"d1" }, { pts:ma.map((f, i) => [i + 1, f]), cls:"s2", dash:true }, { pts:es.slice(0, N).map((f, i) => [i + 1, f]), cls:"s3", dash:true }, { pts:lr.map((f, i) => [i + 1, f]).concat(proj.filter(() => best === M[2])), cls:"s4", dash:true }, { pts:[[N, D[N - 1]]].concat(proj), cls:"s5", dot:"d5" }], xlab:"Período", ylab:"Unidades", legend:[["--blue", "Demanda real"], ["--copper", "Prom. móvil"], ["--ok", "Exponencial"], ["--c3", "Tendencia"], ["--c4", "Proyección"]] });
    h += lectura("el método con menor error para estos datos es «" + best.nm + "»: pronostica " + n0(best.nx) + " unidades para el próximo período y se equivoca en promedio " + nf(best.E.MAD, 1) + " unidades." + (Math.abs(best.E.TS) > 4 ? " Su señal de rastreo indica sesgo: revisa si hay tendencia o estacionalidad." : ""));
    return h;
  },
  learn:"<p>Elige el método por su <b>error fuera de muestra</b>, no solo por cómo se ve. Con estacionalidad (ventas de invierno, fin de mes) usa índices estacionales o Holt-Winters. Pronostica a nivel agregado (familia de productos) cuando puedas: el error relativo es menor.</p>",
  rel:["eoq", "stock-seguridad", "mrp"]
});

def("eoq", "ops", {
  t:"Lote económico (EOQ / EPQ)", ico:"EOQ", d:"Cantidad óptima de pedido, costo total, punto de reorden y descuentos",
  ey:"Gestión de inventarios · Modelos determinísticos",
  lead:"Encuentra cuánto pedir y cada cuánto para minimizar la suma del costo de pedir y de mantener inventario.",
  f:[F("D", "Demanda anual", 12000, { u:"unidades" }), F("S", "Costo por pedido o setup", 85000, { u:"$" }), F("Cu", "Costo unitario", 4200, { u:"$" }), F("i", "Costo anual de mantener", 22, { u:"% del costo unitario" }), F("dias", "Días hábiles al año", 300), F("L", "Lead time", 6, { u:"días" }), F("p", "Tasa de producción (0 si se compra)", 0, { u:"unid/día", h:"Si fabricas el lote internamente, ingresa cuánto produces por día (modelo EPQ)." }),
     MAT("desc", "Descuentos por cantidad (opcional): desde · precio", "0 4200\n1500 4050\n4000 3900", { h:"Una fila por tramo. Deja vacío si no hay descuentos." })],
  c(v){
    const D = need(v, "D", "Demanda", { pos:true }), S0 = need(v, "S", "Costo por pedido", { pos:true }), Cu = need(v, "Cu", "Costo unitario", { pos:true }), i = need(v, "i", "Costo de mantener") / 100, dias = need(v, "dias", "Días hábiles", { pos:true }), L = opt(v, "L") || 0, p = opt(v, "p") || 0;
    const E = NUC.eoq(D, S0, Cu, i, dias, L, p), d = E.d, fac = E.fac, H = E.H, Q = E.Q, Imax = E.Imax, N = E.N, T = E.T, CTp = E.CTp, CTm = E.CTm, CT = E.CT, ROP = E.ROP;
    let h = kpis([kpi("Lote óptimo Q*", n0(Q), "unidades", "hi"), kpi("Pedidos al año", nf(N, 1)), kpi("Tiempo entre pedidos", nf(T, 1), "días"), kpi("Punto de reorden", n0(Math.ceil(ROP)), "unidades"), kpi("Costo anual de inventario", money(CTp + CTm)), kpi("Costo total con compra", money(CT))]);
    h += steps([
      { t:"Costo de mantener por unidad y año", f:"H = i × C", s:"H = " + nf(i, 2) + " × " + money(Cu) + " = " + money(H, 1), r:money(H, 1) },
      { t:p > 0 ? "Lote económico de producción (EPQ)" : "Lote económico de pedido (EOQ)", f:p > 0 ? "Q* = √[2DS ÷ (H × (1 − d/p))]" : "Q* = √(2DS ÷ H)", s:"Q* = √[2 × " + n0(D) + " × " + money(S0) + " ÷ (" + money(H, 1) + (p > 0 ? " × " + nf(fac, 3) : "") + ")] = " + nf(Q, 1), r:n0(Q) + " unidades", why:"en Q* el costo anual de pedir es igual al costo anual de mantener; ahí la suma es mínima." },
      { t:"Costo total anual", f:"CT = (D/Q) × S + H × I_max/2 + D × C", s:"CT = " + money(CTp) + " + " + money(CTm) + " + " + money(D * Cu) + " = " + money(CT), r:money(CT) },
      { t:"Punto de reorden", f:"ROP = d × L", s:"ROP = " + nf(d, 2) + " × " + L + " = " + nf(ROP, 1), r:n0(Math.ceil(ROP)) + " unidades", why:"cuando el inventario baja a este nivel se emite el pedido para que llegue justo al agotarse. Suma stock de seguridad si la demanda varía." }
    ]);
    const tr = rows(v.desc || "").map(r => r.map(num)).filter(r => r.length >= 2 && fin(r[0]) && fin(r[1])).sort((x, y) => x[0] - y[0]);
    if (tr.length > 1) { const ev = tr.map((r, k) => { const Hk = i * r[1], q0 = Math.sqrt(2 * D * S0 / (Hk * fac)), next = tr[k + 1] ? tr[k + 1][0] : Infinity; let q = Math.max(q0, r[0] || 1); const feas = q < next || q0 >= next; if (q >= next) q = r[0] || 1; const ct = D / q * S0 + Hk * q * fac / 2 + D * r[1]; return { r, q0, q, ct, ok:feas }; });
      const bb = ev.reduce((a, b) => b.ct < a.ct ? b : a);
      h += h3("Descuentos por cantidad") + table(["Desde", "Precio", "Q* del tramo", "Q ajustado", "Costo total"], ev.map(e => rowc([n0(e.r[0]), money(e.r[1]), n0(e.q0), n0(e.q), money(e.ct)], e === bb ? "sel" : "")), { num:[0, 1, 2, 3, 4] }) + note("Con descuentos conviene pedir <b>" + n0(bb.q) + " unidades</b> a " + money(bb.r[1]) + " (costo total " + money(bb.ct) + ").", "ok"); }
    const pts1 = [], pts2 = [], pts3 = []; for (let k = 1; k <= 40; k++) { const q = Q * 3 * k / 40; pts1.push([q, D / q * S0]); pts2.push([q, H * q * fac / 2]); pts3.push([q, D / q * S0 + H * q * fac / 2]); }
    h += chart({ title:"Curva de costos", series:[{ pts:pts1, cls:"s1" }, { pts:pts2, cls:"s2" }, { pts:pts3, cls:"s3" }], v:[{ x:Q, cls:"sb", lbl:"Q*" }], ymax:pts3[3][1], xlab:"Tamaño de lote Q", ylab:"$/año", legend:[["--blue", "Costo de pedir"], ["--copper", "Costo de mantener"], ["--ok", "Total"]] });
    h += eoqSlider(D, S0, H, fac, Q);
    h += lectura("conviene pedir <b>" + n0(Q) + " unidades</b> cada vez, unas " + nf(N, 1) + " veces al año (cada " + nf(T, 0) + " días), y emitir el pedido cuando queden " + n0(Math.ceil(ROP)) + " unidades. Pedir un poco más o un poco menos casi no cambia el costo.");
    return h;
  },
  learn:"<p>Supuestos del EOQ: demanda constante y conocida, lead time fijo, sin faltantes, costo unitario constante. Es robusto: pedir un 20 % más o menos que Q* encarece el costo de inventario solo alrededor de 2 %.</p>",
  rel:["stock-seguridad", "abc", "mrp"]
});

def("stock-seguridad", "ops", {
  t:"Stock de seguridad y punto de reorden", ico:"SS", d:"Inventario de protección según nivel de servicio y variabilidad",
  ey:"Gestión de inventarios · Modelos probabilísticos",
  lead:"Calcula cuánto inventario extra mantener para cubrir la variabilidad de la demanda y del tiempo de entrega.",
  f:[F("d", "Demanda diaria promedio", 45, { u:"unid/día" }), F("sd", "Desviación estándar de la demanda diaria", 9, { u:"unid/día" }), F("L", "Lead time promedio", 7, { u:"días" }), F("sL", "Desviación estándar del lead time", 1.5, { u:"días" }), F("ns", "Nivel de servicio (ciclo)", 95, { u:"%" }), SEL("pol", "Política de revisión", "Q", [["Q", "Continua (punto de reorden)"], ["P", "Periódica (cada T días)"]]), F("T", "Período de revisión (solo periódica)", 14, { u:"días" }), F("Cu", "Costo unitario", 4200, { u:"$" }), F("i", "Costo anual de mantener", 22, { u:"%" })],
  c(v){
    const d = need(v, "d", "Demanda diaria", { pos:true }), sd = need(v, "sd", "Desviación demanda", { nn:true }), L = need(v, "L", "Lead time", { nn:true }), sL = opt(v, "sL") || 0, ns = need(v, "ns", "Nivel de servicio") / 100, T = opt(v, "T") || 0, Cu = opt(v, "Cu") || 0, i = (opt(v, "i") || 0) / 100;
    if (!(ns > 0.5 && ns < 1)) fail("El nivel de servicio debe estar entre 50 % y 99,99 %.");
    const z = invNorm(ns), per = v.pol === "P" ? T + L : L, sig = Math.sqrt(per * sd * sd + d * d * sL * sL), SS = z * sig, ROP = d * per + SS, costo = SS * Cu * i;
    let h = kpis([kpi("Factor z", nf(z, 3)), kpi("Stock de seguridad", n0(Math.ceil(SS)), "unidades", "hi"), kpi(v.pol === "P" ? "Nivel máximo (S)" : "Punto de reorden", n0(Math.ceil(ROP)), "unidades"), kpi("Costo anual del SS", money(costo))]);
    h += steps([
      { t:"Factor de seguridad z", f:"z = Φ⁻¹(nivel de servicio)", s:"z = Φ⁻¹(" + nf(ns, 4) + ") = " + nf(z, 3), r:nf(z, 3), why:"es cuántas desviaciones estándar te cubres. Con 95 % se acepta quedar sin stock en 1 de cada 20 ciclos." },
      { t:"Desviación de la demanda durante el período de riesgo", f:"σ = √[(" + (v.pol === "P" ? "T + L" : "L") + ") × σ_d² + d² × σ_L²]", s:"σ = √[" + nf(per, 1) + " × " + nf(sd, 2) + "² + " + nf(d, 1) + "² × " + nf(sL, 2) + "²] = " + nf(sig, 2), r:nf(sig, 2) + " unidades", why:"el riesgo dura mientras esperas el pedido" + (v.pol === "P" ? " más el tiempo hasta la próxima revisión." : ".") },
      { t:"Stock de seguridad", f:"SS = z × σ", s:"SS = " + nf(z, 3) + " × " + nf(sig, 2) + " = " + nf(SS, 1), r:n0(Math.ceil(SS)) + " unidades" },
      { t:v.pol === "P" ? "Nivel objetivo de inventario" : "Punto de reorden", f:v.pol === "P" ? "S = d × (T + L) + SS   ·   Pedido = S − inventario actual" : "ROP = d × L + SS", s:nf(d, 1) + " × " + nf(per, 1) + " + " + nf(SS, 1) + " = " + nf(ROP, 1), r:n0(Math.ceil(ROP)) + " unidades", c:"ok" }
    ]);
    const lv = [0.8, 0.85, 0.9, 0.95, 0.975, 0.99, 0.995, 0.999];
    h += h3("Sensibilidad al nivel de servicio") + table(["Nivel de servicio", "z", "Stock de seguridad", "Costo anual"], lv.map(x => { const zz = invNorm(x); return rowc([pc(x), nf(zz, 3), n0(Math.ceil(zz * sig)), money(zz * sig * Cu * i)], Math.abs(x - ns) < 1e-9 ? "sel" : ""); }), { num:[0, 1, 2, 3] });
    h += note("Pasar de 95 % a 99 % de servicio aumenta el stock de seguridad en " + pc(invNorm(0.99) / invNorm(0.95) - 1, 0) + ". Los últimos puntos de servicio son los más caros.", "info");
    return h;
  },
  rel:["eoq", "pronosticos", "abc"]
});

def("abc", "ops", {
  t:"Clasificación ABC de inventarios", ico:"ABC", d:"Pareto de inventarios por valor anual de consumo",
  ey:"Gestión de inventarios · Principio de Pareto",
  lead:"Ordena los ítems por su valor de consumo anual para enfocar el control en los pocos que concentran la mayor parte del dinero.",
  f:[MAT("items", "Ítems: código ; demanda anual ; costo unitario", "R-101;1200;8500\nR-102;300;42000\nR-103;5200;650\nR-104;950;3100\nR-105;80;95000\nR-106;15000;120\nR-107;2400;2600\nR-108;600;1800\nR-109;4100;950\nR-110;150;7400\nR-111;7800;210\nR-112;320;15600", { h:"Una fila por ítem, separado por punto y coma." }), F("A", "Límite clase A (acumulado)", 80, { u:"%" }), F("B", "Límite clase B (acumulado)", 95, { u:"%" })],
  c(v){
    const R = rows(v.items).map(r => { if (r.length < 3) fail("Cada fila necesita código, demanda y costo: «" + r.join(" ") + "»."); const q = num(r[1]), c = num(r[2]); if (!fin(q) || !fin(c)) fail("Revisa los números de «" + r[0] + "»."); return { id:r[0], q, c, val:q * c }; });
    if (R.length < 3) fail("Ingresa al menos 3 ítems.");
    const lA = need(v, "A", "Límite A") / 100, lB = need(v, "B", "Límite B") / 100, T = sum(R.map(r => r.val));
    R.sort((a, b) => b.val - a.val); let ac = 0; R.forEach(r => { const prev = ac; ac += r.val / T; r.ac = ac; r.cl = prev < lA - 1e-9 ? "A" : prev < lB - 1e-9 ? "B" : "C"; });
    const cnt = k => R.filter(r => r.cl === k), share = k => sum(cnt(k).map(r => r.val)) / T;
    let h = kpis(["A", "B", "C"].map(k => kpi("Clase " + k, cnt(k).length + " ítems", pc(cnt(k).length / R.length, 0) + " de ítems · " + pc(share(k), 0) + " del valor", k === "A" ? "hi" : "")));
    h += table(["#", "Ítem", "Demanda", "Costo unit.", "Valor anual", "% valor", "% acumulado", "Clase"], R.map((r, k) => [k + 1, esc(r.id), n0(r.q), money(r.c), money(r.val), pc(r.val / T), pc(r.ac), pill(r.cl === "A" ? "bad" : r.cl === "B" ? "warn" : "ok", r.cl)]), { num:[0, 2, 3, 4, 5, 6], foot:["", "Total", "", "", money(T), "100 %", "", ""] });
    h += chart({ title:"Pareto ABC", bars:R.map((r, k) => ({ x:k + 1, y:r.val / T * 100, cls:r.cl === "A" ? "bar2" : r.cl === "B" ? "bar1" : "barm" })), series:[{ pts:R.map((r, k) => [k + 1, r.ac * 100]), cls:"s3", dot:"d3" }], h:[{ y:lA * 100, cls:"sm", lbl:"A " + pc(lA, 0) }, { y:lB * 100, cls:"sm", lbl:"B " + pc(lB, 0) }], xcat:R.map(r => r.id), ymin:0, ymax:100, ylab:"% del valor", legend:[["--copper", "Clase A"], ["--blue", "Clase B"], ["--line", "Clase C"], ["--ok", "% acumulado"]] });
    h += note("<b>A:</b> revisión continua, pronóstico fino, proveedores con contrato y conteo cíclico mensual. <b>B:</b> revisión periódica. <b>C:</b> reglas simples (dos contenedores, pedidos grandes) y conteo anual.", "info");
    return h;
  },
  rel:["eoq", "pareto"]
});

def("balanceo", "ops", {
  t:"Balanceo de línea", ico:"Bal", d:"Tiempo takt, número de estaciones, asignación de tareas y eficiencia",
  ey:"Diseño de procesos · Líneas de ensamble",
  lead:"Asigna las tareas de una línea a estaciones respetando las precedencias y el tiempo takt, y mide la eficiencia del balance.",
  f:[F("disp", "Tiempo disponible por turno", 450, { u:"min" }), F("dem", "Demanda por turno", 360, { u:"unidades" }), SEL("regla", "Regla de asignación", "rpw", [["rpw", "Mayor peso posicional (RPW)"], ["lt", "Mayor tiempo de tarea"], ["ns", "Mayor número de sucesores"]]),
     MAT("tareas", "Tareas: id ; tiempo (s) ; precedentes", "A;40;-\nB;30;A\nC;50;A\nD;40;B\nE;6;B\nF;25;C\nG;15;C\nH;20;D,E\nI;18;F,G\nJ;30;H,I", { h:"Precedentes separados por coma; «-» si no tiene." })],
  c(v){
    const disp = need(v, "disp", "Tiempo disponible", { pos:true }), dem = need(v, "dem", "Demanda", { pos:true }), takt = disp * 60 / dem;
    const T = {}; const ids = [];
    rows(v.tareas).forEach(r => { if (r.length < 2) fail("Cada tarea necesita id y tiempo: «" + r.join(" ") + "»."); const t = num(r[1]); if (!fin(t) || t <= 0) fail("Tiempo inválido en la tarea " + r[0] + "."); T[r[0]] = { id:r[0], t, p:(r[2] && r[2] !== "-") ? r[2].split(/[,\s]+/).filter(Boolean) : [] }; ids.push(r[0]); });
    ids.forEach(id => T[id].p.forEach(p => { if (!T[p]) fail("La tarea " + id + " depende de «" + p + "», que no existe."); }));
    const succ = id => { const out = new Set(), st = [id]; while (st.length) { const x = st.pop(); ids.forEach(j => { if (T[j].p.includes(x) && !out.has(j)) { out.add(j); st.push(j); } }); } return out; };
    ids.forEach(id => { const s = succ(id); if (s.has(id)) fail("Hay un ciclo de precedencias en la tarea " + id + "."); T[id].nsuc = s.size; T[id].rpw = T[id].t + sum([...s].map(j => T[j].t)); });
    const over = ids.filter(id => T[id].t > takt); if (over.length) fail("Las tareas " + over.join(", ") + " duran más que el takt (" + nf(takt, 1) + " s). Divide esas tareas, duplica la estación o aumenta el tiempo disponible.");
    const B = NUC.balanceo(T, ids, takt, v.regla), St = B.St, tot = B.tot, Nmin = B.Nmin, N = B.N, ef = B.ef;
    let h = kpis([kpi("Takt", nf(takt, 1), "s/unidad", "hi"), kpi("Estaciones mínimas teóricas", Nmin), kpi("Estaciones asignadas", N, "", N === Nmin ? "ok" : ""), kpi("Eficiencia", pc(ef), "", ef >= 0.85 ? "ok" : ""), kpi("Retraso del balance", pc(1 - ef)), kpi("Tiempo ocioso por ciclo", nf(N * takt - tot, 1), "s")]);
    h += steps([
      { t:"Tiempo takt", f:"Takt = Tiempo disponible ÷ Demanda", s:"Takt = " + n0(disp) + " min × 60 ÷ " + n0(dem) + " = " + nf(takt, 2) + " s", r:nf(takt, 2) + " s por unidad", why:"es el ritmo al que debe salir una unidad para cumplir la demanda. Ninguna estación puede demorar más." },
      { t:"Mínimo teórico de estaciones", f:"N_min = ⌈ Σ t_i ÷ Takt ⌉", s:"N_min = ⌈" + n0(tot) + " ÷ " + nf(takt, 2) + "⌉ = ⌈" + nf(tot / takt, 2) + "⌉", r:Nmin + " estaciones" },
      { t:"Asignación por " + { rpw:"peso posicional", lt:"mayor tiempo", ns:"número de sucesores" }[v.regla], q:"En cada estación se agrega la tarea disponible (precedentes ya asignadas y que cabe en el tiempo restante) con mayor prioridad.", r:N + " estaciones", c:N === Nmin ? "ok" : "warn" },
      { t:"Eficiencia del balance", f:"E = Σ t_i ÷ (N × Takt)", s:"E = " + n0(tot) + " ÷ (" + N + " × " + nf(takt, 2) + ") = " + pc(ef), r:pc(ef), why:"el resto (" + pc(1 - ef) + ") es tiempo ocioso pagado. Sobre 85 % se considera un buen balance." }
    ]);
    h += h3("Estaciones") + table(["Estación", "Tareas", "Tiempo (s)", "Ocioso (s)", "Utilización"], St.map((s, k) => [k + 1, s.tasks.join(" → "), nf(s.t, 1), nf(takt - s.t, 1), pc(s.t / takt)]), { num:[0, 2, 3, 4] });
    h += chart({ title:"Carga por estación", bars:St.map((s, k) => ({ x:k + 1, y:s.t, cls:s.t / takt > 0.95 ? "bar2" : "bar1", lbl:nf(s.t, 0) })), h:[{ y:takt, cls:"sb", lbl:"Takt " + nf(takt, 1) + " s" }], xcat:St.map((s, k) => "E" + (k + 1)), ymin:0, ylab:"Segundos" });
    h += h3("Prioridades calculadas") + table(["Tarea", "Tiempo", "Precedentes", "Sucesores", "Peso posicional"], ids.map(id => [id, nf(T[id].t, 1), T[id].p.join(", ") || "—", T[id].nsuc, nf(T[id].rpw, 1)]), { num:[1, 3, 4] });
    h += lectura("para producir al ritmo de la demanda debe salir una unidad cada " + nf(takt, 1) + " s. Con " + N + " estaciones la línea queda ocupada el " + pc(ef) + " del tiempo" + (N > Nmin ? "; el mínimo teórico era " + Nmin + ", así que conviene probar otra regla o dividir tareas." : ", que es el mínimo posible de estaciones."));
    return h;
  },
  rel:["tiempo-estandar", "oee", "vsm"]
});

def("oee", "ops", {
  t:"OEE y capacidad", ico:"OEE", d:"Disponibilidad × rendimiento × calidad; utilización y eficiencia",
  ey:"Productividad de equipos · TPM",
  lead:"Mide la eficiencia general de un equipo (OEE) y la relación entre capacidad de diseño, efectiva y real.",
  f:[F("turno", "Duración del turno", 480, { u:"min" }), F("pp", "Paradas planificadas (colación, mantención programada)", 45, { u:"min" }), F("np", "Paradas no planificadas (fallas, setups)", 38, { u:"min" }), F("tc", "Tiempo de ciclo ideal", 0.9, { u:"min/unidad" }), F("tot", "Unidades producidas", 380), F("mal", "Unidades defectuosas", 14),
     F("cd", "Capacidad de diseño (opcional)", 520, { u:"unid/turno" }), F("ce", "Capacidad efectiva (opcional)", 470, { u:"unid/turno" })],
  c(v){
    const tu = need(v, "turno", "Turno", { pos:true }), pp = need(v, "pp", "Paradas planificadas", { nn:true }), np = need(v, "np", "Paradas no planificadas", { nn:true }), tc = need(v, "tc", "Tiempo de ciclo", { pos:true }), tot = need(v, "tot", "Unidades", { nn:true }), mal = need(v, "mal", "Defectuosas", { nn:true });
    const TP = tu - pp, TO = TP - np; if (TO <= 0) fail("Las paradas superan el tiempo del turno.");
    const A = TO / TP, P = tc * tot / TO, Q = tot ? (tot - mal) / tot : 0, O = A * P * Q;
    if (P > 1.001) fail("El rendimiento supera 100 %: revisa el tiempo de ciclo ideal o las unidades producidas.");
    const cls = O >= 0.85 ? ["ok", "Clase mundial"] : O >= 0.65 ? ["warn", "Aceptable, con pérdidas"] : ["bad", "Bajo: hay pérdidas grandes"];
    let h = kpis([kpi("Disponibilidad", pc(A)), kpi("Rendimiento", pc(P)), kpi("Calidad", pc(Q)), kpi("OEE", pc(O), "", "hi")]);
    h += note("OEE de " + pc(O) + ": " + pill(cls[0], cls[1]) + ". Referencia clase mundial ≈ 85 % (90 % × 95 % × 99,9 %).", cls[0] === "ok" ? "ok" : "");
    h += steps([
      { t:"Disponibilidad", f:"A = Tiempo operativo ÷ Tiempo planificado", s:"A = (" + n0(TP) + " − " + n0(np) + ") ÷ " + n0(TP) + " = " + pc(A), r:pc(A), why:"captura las pérdidas por fallas y cambios de formato." },
      { t:"Rendimiento", f:"P = (Ciclo ideal × Unidades totales) ÷ Tiempo operativo", s:"P = (" + nf(tc, 2) + " × " + n0(tot) + ") ÷ " + n0(TO) + " = " + pc(P), r:pc(P), why:"captura microparadas y operación a velocidad reducida." },
      { t:"Calidad", f:"Q = Unidades buenas ÷ Unidades totales", s:"Q = " + n0(tot - mal) + " ÷ " + n0(tot) + " = " + pc(Q), r:pc(Q), why:"captura rechazos y reprocesos." },
      { t:"OEE", f:"OEE = A × P × Q", s:"OEE = " + nf(A, 3) + " × " + nf(P, 3) + " × " + nf(Q, 3) + " = " + pc(O), r:pc(O), c:cls[0] }
    ]);
    const lost = [["Paradas no planificadas", (1 - A)], ["Velocidad reducida", A * (1 - P)], ["Defectos", A * P * (1 - Q)]];
    h += h3("Seis grandes pérdidas agrupadas") + table(["Pérdida", "Puntos de OEE perdidos"], lost.map(l => [l[0], pc(l[1])]), { num:[1] });
    const cd = opt(v, "cd"), ce = opt(v, "ce");
    if (cd && ce) { const real = tot - mal; h += steps([{ t:"Utilización", f:"U = Producción real ÷ Capacidad de diseño", s:n0(real) + " ÷ " + n0(cd) + " = " + pc(real / cd), r:pc(real / cd) }, { t:"Eficiencia", f:"E = Producción real ÷ Capacidad efectiva", s:n0(real) + " ÷ " + n0(ce) + " = " + pc(real / ce), r:pc(real / ce), why:"la capacidad efectiva ya descuenta mezcla de productos, mantenciones y estándares de calidad; por eso la eficiencia es la medida justa del desempeño." }]); }
    return h;
  },
  rel:["balanceo", "productividad"]
});

def("secuenciacion", "ops", {
  t:"Secuenciación con reglas de prioridad", ico:"Seq", d:"FCFS, SPT, LPT, EDD y razón crítica en una máquina",
  ey:"Programación de operaciones · Taller (job shop)",
  lead:"Compara el orden en que conviene procesar los trabajos en un centro de trabajo según distintas reglas.",
  f:[MAT("jobs", "Trabajos: id ; tiempo de proceso ; fecha de entrega", "A;6;8\nB;2;6\nC;8;18\nD;3;15\nE;9;23\nF;4;12", { h:"Fecha de entrega en días desde hoy (en orden de llegada)." }), SEL("det", "Mostrar detalle de", "SPT", [["FCFS", "FCFS"], ["SPT", "SPT"], ["LPT", "LPT"], ["EDD", "EDD"], ["CR", "Razón crítica"]])],
  c(v){
    const J = rows(v.jobs).map((r, k) => { const p = num(r[1]), d = num(r[2]); if (!fin(p) || !fin(d)) fail("Revisa la fila del trabajo «" + r[0] + "»."); return { id:r[0], p, d, k }; });
    if (J.length < 2) fail("Ingresa al menos 2 trabajos.");
    const rules = { FCFS:(a, b) => a.k - b.k, SPT:(a, b) => a.p - b.p || a.k - b.k, LPT:(a, b) => b.p - a.p || a.k - b.k, EDD:(a, b) => a.d - b.d || a.k - b.k, CR:(a, b) => a.d / a.p - b.d / b.p || a.k - b.k };
    const ev = Object.keys(rules).map(nm => { const seq = J.slice().sort(rules[nm]); let t = 0; const det = seq.map(j => { t += j.p; return { j, c:t, tard:Math.max(0, t - j.d) }; }); const tot = sum(J.map(j => j.p)), flow = sum(det.map(x => x.c));
      return { nm, seq, det, F:flow / J.length, T:mean(det.map(x => x.tard)), Tmax:Math.max.apply(null, det.map(x => x.tard)), late:det.filter(x => x.tard > 0).length, U:tot / flow, L:flow / tot }; });
    const bF = Math.min.apply(null, ev.map(e => e.F)), bT = Math.min.apply(null, ev.map(e => e.T));
    let h = table(["Regla", "Secuencia", "Flujo prom.", "Tardanza prom.", "Tardanza máx.", "Atrasados", "Utilización", "Trabajos prom. en sistema"], ev.map(e => [e.nm, e.seq.map(x => x.j ? x.j.id : x.id).join(" → "), nf(e.F, 2) + (e.F === bF ? " " + pill("ok", "mín.") : ""), nf(e.T, 2) + (e.T === bT ? " " + pill("ok", "mín.") : ""), nf(e.Tmax, 1), e.late, pc(e.U), nf(e.L, 2)]), { num:[2, 3, 4, 5, 6, 7] });
    const D = ev.find(e => e.nm === v.det) || ev[1];
    h += h3("Detalle: " + D.nm) + table(["Orden", "Trabajo", "Proceso", "Término", "Entrega", "Tardanza"], D.det.map((x, k) => rowc([k + 1, x.j.id, nf(x.j.p, 1), nf(x.c, 1), nf(x.j.d, 1), nf(x.tard, 1)], x.tard > 0 ? "badr" : "")), { num:[0, 2, 3, 4, 5] });
    let t0 = 0; h += gantt(D.det.map(x => { const it = { id:x.j.id, s:t0, d:x.j.p, crit:x.tard > 0 }; t0 += x.j.p; return it; }), { leg:'<span><i style="background:var(--copper)"></i>Termina atrasado</span><span><i style="background:var(--blue)"></i>A tiempo</span>' });
    h += steps([{ t:"Métricas", f:"Flujo prom. = Σ C_j ÷ n   ·   Tardanza_j = máx(0, C_j − d_j)   ·   Utilización = Σ p_j ÷ Σ C_j", why:"SPT siempre minimiza el tiempo de flujo promedio y el inventario en proceso; EDD minimiza la tardanza máxima." }]);
    return h;
  },
  rel:["johnson", "cpm"]
});

def("johnson", "ops", {
  t:"Regla de Johnson (2 máquinas)", ico:"Jn", d:"Secuencia óptima que minimiza el makespan en flujo de dos etapas",
  ey:"Programación de operaciones · Flow shop",
  lead:"Encuentra el orden que termina antes todos los trabajos cuando cada uno pasa primero por la máquina 1 y luego por la 2.",
  f:[MAT("jobs", "Trabajos: id ; tiempo M1 ; tiempo M2", "A;5;2\nB;1;6\nC;9;7\nD;3;8\nE;10;4")],
  c(v){
    const J = rows(v.jobs).map(r => { const a = num(r[1]), b = num(r[2]); if (!fin(a) || !fin(b)) fail("Revisa la fila «" + r[0] + "»."); return { id:r[0], a, b }; });
    if (J.length < 2) fail("Ingresa al menos 2 trabajos.");
    const pool = J.slice(), front = [], back = [], log = [];
    while (pool.length) { let m = Infinity, x = null, where = ""; pool.forEach(j => { if (j.a < m) { m = j.a; x = j; where = "M1"; } if (j.b < m) { m = j.b; x = j; where = "M2"; } });
      if (where === "M1") front.push(x); else back.unshift(x); log.push(x.id + " (mín. " + nf(m, 1) + " en " + where + " → " + (where === "M1" ? "al inicio" : "al final") + ")"); pool.splice(pool.indexOf(x), 1); }
    const seq = front.concat(back); let t1 = 0, t2 = 0, idle = 0; const G = [];
    seq.forEach(j => { const s1 = t1; t1 += j.a; const s2 = Math.max(t1, t2); idle += s2 - t2; t2 = s2 + j.b; G.push({ j, s1, e1:t1, s2, e2:t2 }); });
    let h = kpis([kpi("Secuencia óptima", seq.map(j => j.id).join(" → "), "", "hi"), kpi("Makespan", nf(t2, 1), "u. de tiempo"), kpi("Ocio de M2", nf(idle, 1))]);
    h += steps([{ t:"Regla de Johnson", q:"Repite: busca el menor tiempo entre todos los trabajos pendientes. Si está en M1, el trabajo va lo más adelante posible; si está en M2, lo más atrás posible.", s:log.join("\n"), r:seq.map(j => j.id).join(" → "), c:"ok", why:"así M2 empieza a trabajar lo antes posible y termina con los trabajos que menos la retrasan." }]);
    h += table(["Trabajo", "Inicio M1", "Fin M1", "Inicio M2", "Fin M2"], G.map(g => [g.j.id, nf(g.s1, 1), nf(g.e1, 1), nf(g.s2, 1), nf(g.e2, 1)]), { num:[1, 2, 3, 4] });
    h += gantt(G.map(g => ({ id:g.j.id + " · M1", s:g.s1, d:g.j.a })).concat(G.map(g => ({ id:g.j.id + " · M2", s:g.s2, d:g.j.b, crit:true }))), { leg:'<span><i style="background:var(--blue)"></i>Máquina 1</span><span><i style="background:var(--copper)"></i>Máquina 2</span>' });
    return h;
  },
  rel:["secuenciacion"]
});

def("mrp", "ops", {
  t:"MRP: registro de un ítem", ico:"MRP", d:"Necesidades netas, recepciones y lanzamientos de órdenes planeadas",
  ey:"Planificación de requerimientos de materiales",
  lead:"Calcula cuándo y cuánto pedir de un componente a partir de sus requerimientos brutos, inventario y lead time.",
  f:[LST("RB", "Requerimientos brutos por período", "0 120 0 150 80 0 200 90"), LST("RP", "Recepciones programadas por período", "0 100 0 0 0 0 0 0", { h:"Órdenes ya emitidas que llegarán. Misma cantidad de valores." }), F("I0", "Inventario disponible inicial", 60), F("SS", "Stock de seguridad", 20), F("LT", "Lead time", 2, { u:"períodos" }), SEL("lote", "Política de lote", "L4L", [["L4L", "Lote a lote"], ["FQ", "Cantidad fija"], ["POQ", "Cantidad periódica (POQ)"]]), F("Q", "Cantidad fija (si aplica)", 250), F("P", "Períodos cubiertos por POQ (si aplica)", 2)],
  c(v){
    const RB = list(v.RB, "requerimientos"), N = RB.length; let RP = list(v.RP || "", "recepciones"); if (!RP.length) RP = new Array(N).fill(0); if (RP.length !== N) fail("Las recepciones programadas deben tener " + N + " valores.");
    const I0 = need(v, "I0", "Inventario inicial", { nn:true }), SS = opt(v, "SS") || 0, LT = need(v, "LT", "Lead time", { nn:true, int:true }), Q = opt(v, "Q") || 0, P = Math.max(1, opt(v, "P") || 1);
    let inv = I0; const NN = [], RPL = new Array(N).fill(0), INV = [], LAN = new Array(N).fill(0), atras = [];
    for (let t = 0; t < N; t++) { const disp = inv + RP[t]; let nn = Math.max(0, RB[t] + SS - disp); NN.push(nn); let q = 0;
      if (nn > 0) { if (v.lote === "L4L") q = nn; else if (v.lote === "FQ") { if (!(Q > 0)) fail("Ingresa la cantidad fija."); q = Math.ceil(nn / Q) * Q; } else { q = nn + sum(RB.slice(t + 1, t + P)); } }
      RPL[t] = q; inv = disp + q - RB[t]; INV.push(inv); if (q > 0) { if (t - LT >= 0) LAN[t - LT] += q; else atras.push("período " + (t + 1)); } }
    const hd = ["", "Inicial"].concat(RB.map((_, t) => "P" + (t + 1)));
    let h = kpis([kpi("Órdenes planeadas", RPL.filter(x => x > 0).length), kpi("Cantidad total a pedir", n0(sum(RPL))), kpi("Inventario promedio", nf(mean(INV), 1))]);
    if (atras.length) h += note("Hay necesidades en " + atras.join(", ") + " que no alcanzan a cubrirse con el lead time: la orden tendría que haberse lanzado antes del período 1. Acelera con el proveedor o revisa el plan maestro.", "bad");
    h += table(hd, [["Requerimientos brutos", ""].concat(RB.map(n0)), ["Recepciones programadas", ""].concat(RP.map(x => x ? n0(x) : "")), rowc(["Inventario proyectado", n0(I0)].concat(INV.map(n0)), ""), rowc(["Necesidades netas", ""].concat(NN.map(x => x ? n0(x) : "")), "badr"), rowc(["Recepción de órdenes planeadas", ""].concat(RPL.map(x => x ? n0(x) : "")), "sel"), rowc(["Lanzamiento de órdenes planeadas", ""].concat(LAN.map(x => x ? n0(x) : "")), "sel")], { num:Array.from({ length:N + 1 }, (_, i) => i + 1) });
    h += steps([
      { t:"Necesidades netas", f:"NN_t = máx(0, RB_t + SS − (Inventario_(t−1) + RP_t))", why:"solo se pide lo que falta después de usar el inventario y lo que ya viene en camino." },
      { t:"Tamaño de lote", f:v.lote === "L4L" ? "Recepción = NN (lote a lote)" : v.lote === "FQ" ? "Recepción = múltiplo de Q = " + n0(Q) : "Recepción = NN_t + RB de los " + (P - 1) + " períodos siguientes", why:"lote a lote minimiza inventario; lotes mayores reducen el número de pedidos y setups." },
      { t:"Desfase por lead time", f:"Lanzamiento_(t − LT) = Recepción planeada_t", s:"LT = " + LT + " períodos", why:"la orden debe emitirse con anticipación para llegar a tiempo." }
    ]);
    return h;
  },
  learn:"<p>En un MRP completo, los <b>lanzamientos</b> del producto padre se multiplican por la cantidad indicada en la lista de materiales (BOM) y pasan a ser los <b>requerimientos brutos</b> de cada componente del nivel siguiente. Se procesa nivel por nivel (codificación de nivel más bajo).</p>",
  rel:["pronosticos", "eoq"]
});

def("colas", "ops", {
  t:"Teoría de colas (M/M/s)", ico:"λμ", d:"Tiempos de espera, largo de cola y número óptimo de servidores",
  ey:"Investigación de operaciones · Líneas de espera",
  lead:"Calcula cuánto esperan los clientes y cuántos servidores conviene tener balanceando el costo de espera con el costo de atender.",
  f:[F("lam", "Tasa de llegada λ", 22, { u:"clientes/hora" }), F("mu", "Tasa de servicio por servidor μ", 8, { u:"clientes/hora" }), F("s", "Número de servidores s", 3), F("cw", "Costo de espera", 7000, { u:"$/cliente-hora" }), F("cs", "Costo de un servidor", 9500, { u:"$/hora" })],
  c(v){
    const lam = need(v, "lam", "λ", { pos:true }), mu = need(v, "mu", "μ", { pos:true }), s = need(v, "s", "Servidores", { pos:true, int:true, max:200 }), cw = opt(v, "cw") || 0, cs = opt(v, "cs") || 0;
    const mm = k => NUC.mmc(lam, mu, k, cw, cs);
    const R = mm(s); if (!R) fail("Con " + s + " servidor(es) el sistema es inestable: ρ = λ/(sμ) = " + nf(lam / (s * mu), 3) + " ≥ 1 y la cola crece sin límite. Necesitas al menos " + Math.floor(lam / mu + 1) + " servidores.");
    let h = kpis([kpi("Utilización ρ", pc(R.rho)), kpi("Clientes en cola Lq", nf(R.Lq, 2)), kpi("Espera en cola Wq", nf(R.Wq * 60, 1), "min", "hi"), kpi("Tiempo en el sistema W", nf(R.W * 60, 1), "min"), kpi("Clientes en el sistema L", nf(R.L, 2)), kpi("Probabilidad de esperar", pc(R.Pw))]);
    h += steps([
      { t:"Intensidad de tráfico", f:"ρ = λ ÷ (s × μ)", s:"ρ = " + nf(lam, 2) + " ÷ (" + s + " × " + nf(mu, 2) + ") = " + nf(R.rho, 4), r:pc(R.rho), why:"debe ser menor que 1. Cerca de 1 la espera se dispara aunque «sobre» poca capacidad." },
      { t:"Probabilidad de sistema vacío", f:"P₀ = [Σ_(n=0)^(s−1) (λ/μ)ⁿ/n! + (λ/μ)ˢ ÷ (s!(1 − ρ))]⁻¹", s:"P₀ = " + nf(R.P0, 5), r:nf(R.P0, 5) },
      { t:"Largo de la cola", f:"Lq = P₀ × (λ/μ)ˢ × ρ ÷ [s! × (1 − ρ)²]", s:"Lq = " + nf(R.Lq, 4), r:nf(R.Lq, 3) + " clientes" },
      { t:"Tiempos (ley de Little)", f:"Wq = Lq ÷ λ   ·   W = Wq + 1/μ   ·   L = λ × W", s:"Wq = " + nf(R.Wq, 4) + " h · W = " + nf(R.W, 4) + " h · L = " + nf(R.L, 3), r:nf(R.Wq * 60, 1) + " min de espera promedio", c:"ok" }
    ]);
    const rng = []; for (let k = Math.max(1, Math.floor(lam / mu) + 1); k <= Math.max(s + 3, Math.floor(lam / mu) + 5); k++) { const x = mm(k); if (x) rng.push(x); }
    const best = rng.reduce((a, b) => b.CT < a.CT ? b : a);
    h += h3("Costo total según número de servidores") + table(["Servidores", "ρ", "Lq", "Wq (min)", "L", "Costo servidores", "Costo de espera", "Costo total/hora"], rng.map(x => rowc([x.k, pc(x.rho), nf(x.Lq, 2), nf(x.Wq * 60, 1), nf(x.L, 2), money(x.k * cs), money(x.L * cw), money(x.CT)], x === best ? "sel" : "")), { num:[0, 1, 2, 3, 4, 5, 6, 7] });
    if (cw || cs) h += note("El costo total mínimo se logra con <b>" + best.k + " servidores</b> (" + money(best.CT) + " por hora).", "ok");
    h += lectura("los servidores están ocupados el " + pc(R.rho) + " del tiempo; un cliente espera en promedio " + nf(R.Wq * 60, 1) + " minutos antes de ser atendido y " + pc(R.Pw) + " de los clientes tiene que esperar." + (R.rho > 0.85 ? " Con una utilización tan alta, cualquier aumento de llegadas dispara la espera." : ""));
    return h;
  },
  learn:"<p>Notación de Kendall A/B/s: llegadas Poisson (M), servicio exponencial (M) y s servidores en paralelo con una sola fila. Una fila única que alimenta a varios servidores siempre es mejor que filas separadas por servidor. La <b>ley de Little</b> (L = λW) vale para cualquier sistema estable, también en inventarios y procesos.</p>",
  rel:["simulacion-mc", "oee"]
});

def("vsm", "ops", {
  t:"VSM: lead time y eficiencia del proceso", ico:"VSM", d:"Mapa de flujo de valor: tiempo de valor agregado vs lead time",
  ey:"Lean manufacturing · Value Stream Mapping",
  lead:"Ingresa los procesos del flujo con su tiempo de ciclo y el inventario que espera antes de cada uno. La app calcula el lead time y cuánto de ese tiempo agrega valor.",
  f:[F("dd", "Demanda diaria del cliente", 460, { u:"unid/día" }), F("td", "Tiempo disponible diario", 27600, { u:"s/día", h:"Ej.: 2 turnos × 7,67 h × 3.600" }), MAT("proc", "Procesos: nombre ; tiempo de ciclo (s) ; inventario antes del proceso (unid) ; operarios", "Corte;39;4600;1\nPrensado;46;1100;1\nSoldadura;62;1600;2\nPintura;40;1200;1\nEnsamble;55;1800;2\nDespacho;0;2700;1")],
  c(v){
    const dd = need(v, "dd", "Demanda diaria", { pos:true }), td = need(v, "td", "Tiempo disponible", { pos:true }), takt = td / dd;
    const P = rows(v.proc).map(r => ({ nm:r[0], tc:num(r[1]) || 0, inv:num(r[2]) || 0, op:num(r[3]) || 1 }));
    if (!P.length) fail("Ingresa al menos un proceso.");
    const LTd = sum(P.map(p => p.inv)) / dd, VA = sum(P.map(p => p.tc)), LTs = LTd * td, PCE = VA / LTs;
    let h = kpis([kpi("Takt", nf(takt, 1), "s"), kpi("Lead time de producción", nf(LTd, 1), "días", "hi"), kpi("Tiempo de valor agregado", nf(VA, 0), "s"), kpi("Eficiencia del ciclo (PCE)", pc(PCE, 3))]);
    h += table(["Proceso", "Ciclo (s)", "Ciclo vs takt", "Inventario previo", "Días de inventario", "Operarios"], P.map(p => [esc(p.nm), nf(p.tc, 0), p.tc > takt ? pill("bad", "Cuello de botella") : pill("ok", pc(p.tc / takt, 0) + " del takt"), n0(p.inv), nf(p.inv / dd, 2), p.op]), { num:[1, 3, 4, 5] });
    h += steps([
      { t:"Takt", f:"Takt = Tiempo disponible ÷ Demanda", s:n0(td) + " ÷ " + n0(dd) + " = " + nf(takt, 1) + " s", r:nf(takt, 1) + " s" },
      { t:"Lead time (por ley de Little)", f:"Días de inventario = Inventario ÷ Demanda diaria   ·   LT = Σ días", s:"LT = " + n0(sum(P.map(p => p.inv))) + " ÷ " + n0(dd) + " = " + nf(LTd, 2) + " días", r:nf(LTd, 1) + " días", why:"una pieza que entra hoy debe esperar a que salgan todas las que están delante." },
      { t:"Eficiencia del ciclo del proceso", f:"PCE = Tiempo de valor agregado ÷ Lead time", s:"PCE = " + n0(VA) + " s ÷ " + n0(LTs) + " s = " + pc(PCE, 4), r:pc(PCE, 3), c:PCE > 0.25 ? "ok" : "warn", why:"en procesos tradicionales suele ser menor a 1 %. Reducir inventarios (supermercados, FIFO, flujo continuo) baja el lead time sin trabajar más rápido." }
    ]);
    h += chart({ title:"Ciclo por proceso vs takt", bars:P.map((p, k) => ({ x:k + 1, y:p.tc, cls:p.tc > takt ? "bar2" : "bar1" })), h:[{ y:takt, cls:"sb", lbl:"Takt" }], xcat:P.map(p => p.nm), ymin:0, ylab:"Segundos" });
    return h;
  },
  rel:["balanceo", "lean"]
});

/* ---------------- ESTUDIO DEL TRABAJO ---------------- */
def("tiempo-estandar", "trab", {
  t:"Tiempo estándar (cronometraje)", ico:"TE", d:"Tiempo observado, normal y estándar; tamaño de muestra; producción esperada",
  ey:"Estudio de tiempos · Medición del trabajo",
  lead:"Ingresa las lecturas del cronómetro de un elemento o ciclo. La app verifica si tomaste suficientes lecturas y calcula el tiempo estándar con valoración y suplementos.",
  f:[LST("x", "Lecturas del ciclo", "25.2 24.8 26.1 25.5 24.9 25.7 26.3 25.0 24.6 25.4 25.9 25.1", { u:"s" }), F("V", "Valoración del ritmo", 105, { u:"%", h:"100 % = ritmo normal. >100 % si el operario trabajó más rápido." }), F("S", "Suplementos", 14, { u:"%", h:"Ver tabla de suplementos OIT abajo." }), SEL("prec", "Confianza y precisión", "40", [["40", "95 % confianza · ±5 %"], ["20", "95 % confianza · ±10 %"]]), F("jor", "Jornada", 480, { u:"min" })],
  c(v){
    const X = list(v.x, "las lecturas"), V = need(v, "V", "Valoración", { pos:true }) / 100, Sp = need(v, "S", "Suplementos", { nn:true }) / 100, k = num(v.prec), jor = need(v, "jor", "Jornada", { pos:true });
    if (X.length < 5) fail("Toma al menos 5 lecturas.");
    const n = X.length, sx = sum(X), sx2 = sum(X.map(x => x * x)), nreq = Math.pow(k * Math.sqrt(Math.max(0, n * sx2 - sx * sx)) / sx, 2);
    const TO = sx / n, TN = TO * V, TE = TN * (1 + Sp), uh = 3600 / TE, ut = jor * 60 / TE;
    let h = kpis([kpi("Tiempo observado", nf(TO, 2), "s"), kpi("Tiempo normal", nf(TN, 2), "s"), kpi("Tiempo estándar", nf(TE, 2), "s", "hi"), kpi("Unidades por hora", nf(uh, 1)), kpi("Unidades por jornada", n0(Math.floor(ut))), kpi("Lecturas necesarias", Math.ceil(nreq), "tienes " + n, nreq <= n ? "ok" : "bad")]);
    if (nreq > n) h += note("Faltan " + (Math.ceil(nreq) - n) + " lecturas para la precisión pedida. Toma más ciclos y vuelve a calcular.", "bad");
    h += steps([
      { t:"¿Son suficientes las lecturas?", f:"n' = [ k · √(n·Σx² − (Σx)²) ÷ Σx ]²   (k = 40 para 95 % ± 5 %)", s:"n' = [" + k + " × √(" + n + " × " + nf(sx2, 2) + " − " + nf(sx, 2) + "²) ÷ " + nf(sx, 2) + "]² = " + nf(nreq, 2), r:Math.ceil(nreq) + " lecturas", c:nreq <= n ? "ok" : "bad", why:"con más variabilidad entre ciclos necesitas más observaciones para confiar en el promedio." },
      { t:"Tiempo observado (TO)", f:"TO = Σx ÷ n", s:"TO = " + nf(sx, 2) + " ÷ " + n + " = " + nf(TO, 3) + " s", r:nf(TO, 3) + " s" },
      { t:"Tiempo normal (TN)", f:"TN = TO × Valoración", s:"TN = " + nf(TO, 3) + " × " + nf(V, 2) + " = " + nf(TN, 3) + " s", r:nf(TN, 3) + " s", why:"lleva el tiempo del operario observado al de un operario calificado trabajando a ritmo normal." },
      { t:"Tiempo estándar (TE)", f:"TE = TN × (1 + Suplementos)", s:"TE = " + nf(TN, 3) + " × " + nf(1 + Sp, 2) + " = " + nf(TE, 3) + " s", r:nf(TE, 2) + " s por unidad", c:"ok", why:"los suplementos cubren necesidades personales, fatiga y demoras inevitables." },
      { t:"Producción esperada", f:"Unidades/hora = 3.600 ÷ TE", s:"3.600 ÷ " + nf(TE, 3) + " = " + nf(uh, 2), r:n0(Math.floor(ut)) + " unidades por jornada de " + jor + " min" }
    ]);
    h += chart({ title:"Lecturas", series:[{ pts:X.map((x, i) => [i + 1, x]), cls:"s1", dot:"d1" }], h:[{ y:TO, cls:"sm", lbl:"Promedio" }], xlab:"Lectura", ylab:"Segundos" });
    return h;
  },
  learn:"<h4>Suplementos OIT (porcentaje sobre el tiempo normal)</h4>" + "<div class='tbl-wrap'><table><thead><tr><th>Concepto</th><th class='num'>Hombres</th><th class='num'>Mujeres</th></tr></thead><tbody>" + [["Necesidades personales (constante)", 5, 7], ["Fatiga básica (constante)", 4, 4], ["Trabajo de pie", 2, 4], ["Postura ligeramente incómoda", 0, 1], ["Postura incómoda (inclinado)", 2, 3], ["Muy incómoda (echado, estirado)", 7, 7], ["Levantar 5 kg", 1, 2], ["Levantar 10 kg", 3, 6], ["Levantar 20 kg", 9, 17], ["Iluminación algo inferior", 0, 0], ["Iluminación muy inadecuada", 5, 5], ["Concentración intensa (trabajo fino)", 2, 2], ["Ruido intermitente fuerte", 2, 2], ["Tensión mental bastante compleja", 1, 1], ["Monotonía mental alta", 4, 4], ["Trabajo muy aburrido (tedio)", 2, 1]].map(r => "<tr><td>" + r[0] + "</td><td class='num'>" + r[1] + "</td><td class='num'>" + r[2] + "</td></tr>").join("") + "</tbody></table></div><p>Valoración: método Westinghouse (habilidad, esfuerzo, condiciones y consistencia) o escala 0–100 británica. Elimina lecturas anormales (caída de herramienta, interrupciones) antes de calcular.</p>",
  rel:["muestreo", "balanceo", "aprendizaje"]
});

def("muestreo", "trab", {
  t:"Muestreo del trabajo", ico:"MT", d:"Observaciones necesarias, porcentaje de inactividad y tiempo estándar por muestreo",
  ey:"Medición del trabajo · Observaciones instantáneas",
  lead:"Estima qué porcentaje del tiempo una persona o máquina está activa con observaciones aleatorias, y calcula cuántas observaciones necesitas.",
  f:[F("p0", "Proporción estimada de la actividad (estudio piloto)", 18, { u:"%" }), F("e", "Error absoluto aceptado", 3, { u:"puntos %" }), SEL("cl", "Confianza", "0.95", CONF), F("N", "Observaciones realizadas", 620), F("x", "Observaciones de la actividad (ej.: inactivo)", 104), F("T", "Tiempo total del estudio", 4800, { u:"min" }), F("U", "Unidades producidas en el estudio", 1350), F("V", "Valoración promedio", 100, { u:"%" }), F("S", "Suplementos", 12, { u:"%" })],
  c(v){
    const p0 = need(v, "p0", "Proporción estimada") / 100, e = need(v, "e", "Error", { pos:true }) / 100, cl = num(v.cl), z = zConf(cl), N = need(v, "N", "Observaciones", { pos:true }), x = need(v, "x", "Observaciones de la actividad", { nn:true }), T = opt(v, "T"), U = opt(v, "U"), V = (opt(v, "V") || 100) / 100, Sp = (opt(v, "S") || 0) / 100;
    const nreq = z * z * p0 * (1 - p0) / (e * e), p = x / N, eReal = z * Math.sqrt(p * (1 - p) / N);
    let h = kpis([kpi("Observaciones necesarias", n0(Math.ceil(nreq)), "", N >= nreq ? "ok" : "bad"), kpi("Proporción observada", pc(p)), kpi("Precisión lograda", "± " + pc(eReal, 2)), kpi("Intervalo", pc(Math.max(0, p - eReal)) + " – " + pc(Math.min(1, p + eReal)))]);
    const st = [
      { t:"Tamaño de muestra", f:"n = z² × p × (1 − p) ÷ e²", s:"n = " + nf(z, 3) + "² × " + nf(p0, 3) + " × " + nf(1 - p0, 3) + " ÷ " + nf(e, 3) + "² = " + nf(nreq, 1), r:n0(Math.ceil(nreq)) + " observaciones", c:N >= nreq ? "ok" : "bad" },
      { t:"Proporción observada", f:"p = observaciones de la actividad ÷ observaciones totales", s:"p = " + n0(x) + " ÷ " + n0(N) + " = " + pc(p, 2), r:pc(p, 2) },
      { t:"Precisión alcanzada", f:"e = z × √[p(1 − p) ÷ n]", s:"e = " + nf(z, 3) + " × √[" + nf(p, 3) + " × " + nf(1 - p, 3) + " ÷ " + n0(N) + "] = " + pc(eReal, 2), r:"± " + pc(eReal, 2) }
    ];
    if (T && U) { const TEu = T * (1 - p) * V / U * (1 + Sp); st.push({ t:"Tiempo estándar por unidad", f:"TE = [T × (1 − p_inactivo) × Valoración ÷ Unidades] × (1 + S)", s:"TE = [" + n0(T) + " × " + nf(1 - p, 3) + " × " + nf(V, 2) + " ÷ " + n0(U) + "] × " + nf(1 + Sp, 2) + " = " + nf(TEu, 3) + " min", r:nf(TEu, 3) + " min/unidad (" + nf(TEu * 60, 1) + " s)", c:"ok" }); }
    h += steps(st);
    h += note("Programa las observaciones en momentos aleatorios (tabla de números aleatorios) y a lo largo de varios días para que la muestra represente todos los turnos y situaciones.", "info");
    return h;
  },
  rel:["tiempo-estandar", "productividad"]
});

def("aprendizaje", "trab", {
  t:"Curva de aprendizaje", ico:"CA", d:"Tiempo de la unidad n, tiempo acumulado y promedio según la tasa de aprendizaje",
  ey:"Estudio del trabajo · Modelo de Wright",
  lead:"Estima cómo baja el tiempo por unidad a medida que los trabajadores repiten la tarea.",
  f:[F("r", "Tasa de aprendizaje", 85, { u:"%", h:"Cada vez que se duplica la producción, el tiempo por unidad cae a este porcentaje." }), F("T1", "Tiempo de la primera unidad", 120, { u:"min" }), F("n", "Unidades a producir", 64)],
  c(v){
    const r = need(v, "r", "Tasa") / 100, T1 = need(v, "T1", "T1", { pos:true }), n = need(v, "n", "Unidades", { pos:true, int:true, max:100000 });
    if (!(r > 0 && r <= 1)) fail("La tasa debe estar entre 1 % y 100 %.");
    const b = Math.log(r) / Math.LN2, Tn = k => T1 * Math.pow(k, b); let tot = 0; const pts = []; for (let k = 1; k <= n; k++) { tot += Tn(k); if (k <= 200 || k % Math.ceil(n / 200) === 0) pts.push([k, Tn(k)]); }
    let h = kpis([kpi("Tiempo de la unidad " + n, nf(Tn(n), 2), "min", "hi"), kpi("Tiempo total", nf(tot, 1), "min"), kpi("Promedio por unidad", nf(tot / n, 2), "min"), kpi("Exponente b", nf(b, 4))]);
    h += steps([
      { t:"Exponente de aprendizaje", f:"b = log(r) ÷ log(2)", s:"b = log(" + nf(r, 2) + ") ÷ log(2) = " + nf(b, 4), r:nf(b, 4) },
      { t:"Tiempo de la unidad n", f:"T_n = T₁ × n^b", s:"T_" + n + " = " + nf(T1, 2) + " × " + n + "^" + nf(b, 4) + " = " + nf(Tn(n), 3), r:nf(Tn(n), 2) + " min", why:"útil para cotizar contratos de varias unidades y para planificar dotación en la puesta en marcha." }
    ]);
    const dbl = []; for (let k = 1; k <= n; k *= 2) dbl.push([k, nf(Tn(k), 2), nf(Tn(k) / T1 * 100, 1) + " %"]);
    h += table(["Unidad", "Tiempo (min)", "% de T₁"], dbl, { num:[0, 1, 2] });
    h += chart({ title:"Curva de aprendizaje", series:[{ pts, cls:"s1" }], xlab:"Unidad", ylab:"Minutos por unidad", ymin:0 });
    return h;
  },
  rel:["tiempo-estandar"]
});

def("productividad", "trab", {
  t:"Productividad parcial y total", ico:"Prod", d:"Productividad por factor, multifactorial y su variación entre períodos",
  ey:"Gestión de operaciones · Medición de la productividad",
  lead:"Compara la productividad de dos períodos por recurso (mano de obra, materiales, energía, capital) y en total.",
  f:[F("q1", "Producción período 1", 10500, { u:"unidades" }), F("q2", "Producción período 2", 11800, { u:"unidades" }), F("p", "Valor de venta por unidad (para la total)", 8500, { u:"$" }), MAT("ins", "Insumos: nombre ; costo período 1 ; costo período 2", "Mano de obra;28000000;29500000\nMateriales;31000000;35200000\nEnergía;4200000;4100000\nCapital (depreciación y arriendo);9000000;9000000")],
  c(v){
    const q1 = need(v, "q1", "Producción 1", { pos:true }), q2 = need(v, "q2", "Producción 2", { pos:true }), p = opt(v, "p") || 1;
    const I = rows(v.ins).map(r => ({ nm:r[0], a:num(r[1]), b:num(r[2]) })); if (!I.length || I.some(x => !fin(x.a) || !fin(x.b) || x.a <= 0 || x.b <= 0)) fail("Revisa la tabla de insumos: cada fila necesita nombre y dos costos positivos.");
    const tA = sum(I.map(x => x.a)), tB = sum(I.map(x => x.b)), PT1 = q1 * p / tA, PT2 = q2 * p / tB;
    let h = kpis([kpi("Productividad total P1", nf(PT1, 3)), kpi("Productividad total P2", nf(PT2, 3)), kpi("Variación", pc(PT2 / PT1 - 1), "", PT2 >= PT1 ? "ok" : "bad")]);
    h += table(["Insumo", "Productividad P1 (unid/MM$)", "Productividad P2 (unid/MM$)", "Variación"], I.map(x => { const a = q1 / x.a * 1e6, b = q2 / x.b * 1e6; return [esc(x.nm), nf(a, 2), nf(b, 2), (b >= a ? pill("ok", "▲ " + pc(b / a - 1)) : pill("bad", "▼ " + pc(b / a - 1)))]; }), { num:[1, 2] });
    h += steps([
      { t:"Productividad parcial", f:"P_parcial = Producción ÷ Un insumo", why:"muestra qué recurso mejoró o empeoró, pero puede engañar: automatizar sube la productividad de la mano de obra y baja la del capital." },
      { t:"Productividad total (multifactorial)", f:"P_total = Valor de la producción ÷ Σ insumos", s:"P1 = " + money(q1 * p) + " ÷ " + money(tA) + " = " + nf(PT1, 3) + " · P2 = " + money(q2 * p) + " ÷ " + money(tB) + " = " + nf(PT2, 3), r:pc(PT2 / PT1 - 1) + " de variación", c:PT2 >= PT1 ? "ok" : "bad", why:"usa precios constantes (los del período base) para que la inflación no se confunda con productividad." }
    ]);
    return h;
  },
  rel:["oee", "tiempo-estandar"]
});
