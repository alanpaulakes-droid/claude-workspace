/* ============ REGISTRO DE HERRAMIENTAS ============ */
const C = {};
function def(id, g, o){ o.id = id; o.g = g; C[id] = o; }
const F = (k, l, d, o) => Object.assign({ k, l, d, t:"num" }, o || {});
const SEL = (k, l, d, opts, o) => Object.assign({ k, l, d, t:"sel", o:opts }, o || {});
const TXT = (k, l, d, o) => Object.assign({ k, l, d, t:"txt" }, o || {});
const LST = (k, l, d, o) => Object.assign({ k, l, d, t:"list" }, o || {});
const MAT = (k, l, d, o) => Object.assign({ k, l, d, t:"mat" }, o || {});
const AREA = (k, l, d, o) => Object.assign({ k, l, d, t:"area" }, o || {});
const CONF = [["0.90", "90 %"], ["0.95", "95 %"], ["0.99", "99 %"]];

/* ---------------- ECONOMÍA Y FINANZAS ---------------- */
def("van-tir", "eco", {
  t:"VAN, TIR y período de recuperación", ico:"VAN", d:"Evalúa un flujo de caja: VAN, TIR, PRI, IVAN y B/C",
  ey:"Evaluación de proyectos · Matemática financiera",
  lead:"Ingresa la tasa de descuento y los flujos netos desde el año 0 (la inversión va con signo negativo). La app calcula si el proyecto crea valor y en cuánto tiempo se recupera.",
  f:[F("tasa", "Tasa de descuento", 12, { u:"% anual", h:"Costo de oportunidad del capital (TMAR o WACC)." }),
     LST("flujos", "Flujos netos por período (F0, F1, F2, …)", "-1000000000 280000000 320000000 350000000 380000000 300000000", { h:"Un valor por período, separados por espacio o salto de línea. F0 suele ser negativo." })],
  c(v){
    const r = need(v, "tasa", "Tasa de descuento") / 100, Fl = list(v.flujos, "los flujos");
    if (Fl.length < 2) fail("Ingresa al menos dos flujos (F0 y F1).");
    const V = NUC.van(r, Fl), fac = V.fac, vp = V.vp, VAN = V.VAN, acA = V.acA, acdA = V.acdA, PRI = V.PRI, PRId = V.PRId, roots = V.roots, TIR = V.TIR, I0 = V.I0, IVAN = V.IVAN, VPpos = V.VPpos, VPneg = V.VPneg, BC = V.BC;
    let h = kpis([kpi("VAN", money(VAN), "", VAN >= 0 ? "ok" : "bad"), kpi("TIR", fin(TIR) ? pc(TIR, 2) : "—", "", fin(TIR) ? (TIR >= r ? "ok" : "bad") : ""), kpi("PRI simple", fin(PRI) ? n1(PRI) : "No recupera", fin(PRI) ? "períodos" : ""), kpi("PRI descontado", fin(PRId) ? n1(PRId) : "No recupera", fin(PRId) ? "períodos" : ""), kpi("IVAN", fin(IVAN) ? nf(IVAN, 3) : "—", "VAN / I₀"), kpi("Beneficio / Costo", nf(BC, 3))]);
    h += VAN >= 0 ? note("<b>Se acepta:</b> el proyecto rinde más que el " + pc(r) + " exigido y deja " + money(VAN) + " de riqueza adicional, medida en dinero de hoy.", "ok") : note("<b>Se rechaza:</b> con un " + pc(r) + " de exigencia el proyecto destruye " + money(-VAN) + " de valor.", "bad");
    if (roots.length > 1) h += note("El flujo cambia de signo más de una vez y tiene " + roots.length + " TIR (" + roots.map(x => pc(x, 2)).join(", ") + "). En ese caso decide solo con el VAN.");
    h += steps([
      { t:"Valor actual de cada flujo", q:"Se trae cada flujo al presente dividiéndolo por (1 + r) elevado a su período.", f:"VP_t = F_t ÷ (1 + r)^t", s:"VP_1 = " + money(Fl[1]) + " ÷ (1 + " + nf(r, 4) + ")^1 = " + money(vp[1]), why:"un peso hoy vale más que un peso mañana porque puede invertirse a la tasa r." },
      { t:"Valor Actual Neto (VAN)", f:"VAN = Σ F_t ÷ (1 + r)^t", s:"VAN = " + vp.slice(0, 4).map(x => money(x)).join(" + ") + (vp.length > 4 ? " + …" : "") + " = " + money(VAN), r:money(VAN), c:VAN >= 0 ? "ok" : "bad", why:"si el VAN es positivo, el proyecto devuelve la inversión, paga la rentabilidad exigida y además genera un excedente." },
      { t:"Tasa Interna de Retorno (TIR)", q:"Es la tasa que hace VAN = 0. Se encuentra por iteración (bisección).", f:"0 = Σ F_t ÷ (1 + TIR)^t", r:fin(TIR) ? pc(TIR, 2) : "no existe", c:fin(TIR) ? (TIR >= r ? "ok" : "bad") : "warn", why:"la TIR es la rentabilidad propia del proyecto. Se acepta si TIR ≥ tasa exigida." },
      { t:"Período de recuperación (PRI)", q:"Se acumulan los flujos hasta que el saldo pasa de negativo a positivo y se interpola dentro del período.", f:"PRI = (t − 1) + |Acum_(t−1)| ÷ F_t", r:(fin(PRI) ? n1(PRI) : "—") + " períodos (simple) · " + (fin(PRId) ? n1(PRId) : "—") + " (descontado)", why:"mide liquidez y riesgo: mientras más corto, antes se recupera el dinero. No reemplaza al VAN porque ignora lo que pasa después." }
    ]);
    h += h3("Tabla de flujos") + table(["t", "Flujo", "Factor 1/(1+r)^t", "Valor actual", "Acumulado", "Acum. descontado"],
      Fl.map((f, t) => rowc([t, money(f), n4(fac[t]), money(vp[t]), money(acA[t]), money(acdA[t])], acdA[t] >= 0 && (t === 0 || acdA[t - 1] < 0) ? "sel" : "")), { num:[0, 1, 2, 3, 4, 5], foot:["Σ", money(sum(Fl)), "", money(VAN), "", ""] });
    const rmax = Math.max(0.3, fin(TIR) ? TIR * 2 : 0.3), pts = []; for (let k = 0; k <= 40; k++) { const rr = rmax * k / 40; pts.push([rr * 100, npv(rr, Fl)]); }
    h += chart({ title:"Perfil del VAN", series:[{ pts, cls:"s1" }], h:[{ y:0, cls:"sm" }], v:[{ x:r * 100, cls:"sb", lbl:"r = " + pc(r) }].concat(fin(TIR) ? [{ x:TIR * 100, cls:"sm", lbl:"TIR" }] : []), xlab:"Tasa de descuento (%)", ylab:"VAN ($)", cap:"Perfil del VAN: el punto donde la curva corta el eje horizontal es la TIR." });
    if (Fl[0] >= 0) h += note("<b>Revisa los signos:</b> el primer flujo (año 0) es positivo, es decir, no hay inversión inicial. La inversión se ingresa con signo negativo.", "bad");
    h += lectura(VAN >= 0 ? "invertir en este proyecto deja " + money(VAN) + " más que dejar el dinero en una alternativa que rinde " + pc(r) + "." + (fin(PRId) ? " La inversión se recupera, en dinero de hoy, en unos " + n1(PRId) + " períodos." : "") : "con una exigencia de " + pc(r) + " el proyecto no alcanza a pagar lo que el dinero rendiría en otra alternativa: pierde " + money(-VAN) + " en dinero de hoy.");
    return h;
  },
  learn:"<p><b>VAN</b> responde «¿cuánto más rico quedo hoy?». <b>TIR</b> responde «¿qué rentabilidad tiene el proyecto?». Si comparas proyectos excluyentes, elige por VAN: la TIR puede inducir a error cuando los montos o las vidas útiles son distintos.</p><ul><li>Usa flujos <b>incrementales</b> (con proyecto − sin proyecto).</li><li>No incluyas costos hundidos (lo ya gastado no cambia con la decisión).</li><li>La depreciación no es un flujo de caja; solo importa porque reduce impuestos (ver «Flujo de caja de un proyecto»).</li><li>Tasa nominal con flujos nominales; tasa real con flujos reales.</li></ul>",
  rel:["flujo-caja", "wacc", "tasas", "equivalencias"]
});

def("equivalencias", "eco", {
  t:"Equivalencias financieras (P, F, A, G)", ico:"P/F", d:"Factores de interés compuesto y conversión entre P, F, A y G",
  ey:"Matemática financiera · Factores de interés compuesto",
  lead:"Convierte un monto entre valor presente (P), valor futuro (F), anualidad o cuota uniforme (A) y gradiente aritmético (G).",
  f:[F("i", "Tasa por período", 1.5, { u:"%" }), F("n", "Número de períodos", 24), SEL("de", "Conozco", "A", [["P", "P · valor presente"], ["F", "F · valor futuro"], ["A", "A · cuota uniforme"], ["G", "G · gradiente"]]), F("val", "Monto conocido", 250000, { u:"$" }), SEL("a", "Quiero encontrar", "P", [["P", "P · valor presente"], ["F", "F · valor futuro"], ["A", "A · cuota uniforme"]])],
  c(v){
    const i = need(v, "i", "Tasa") / 100, n = need(v, "n", "Períodos", { pos:true }), x = need(v, "val", "Monto");
    const k = fct(i, n), toP = { P:1, F:k.PF, A:k.PA, G:k.PG }[v.de], P = x * toP, fromP = { P:1, F:k.FP, A:k.AP }[v.a], R = P * fromP;
    const nm = { P:"P", F:"F", A:"A", G:"G" };
    let h = kpis([kpi(nm[v.a] + " equivalente", money(R, 0), "", "hi"), kpi("Valor presente P", money(P, 0)), kpi("Tasa · períodos", pc(i, 2) + " · " + n0(n))]);
    h += steps([
      { t:"Llevar el monto conocido a valor presente", f:"P = " + v.de + " × (P/" + v.de + ", i, n)", s:v.de === "P" ? "P = " + money(x) : "P = " + money(x) + " × " + nf(toP, 6) + " = " + money(P), r:money(P) },
      { t:"Convertir P al valor buscado", f:v.a + " = P × (" + v.a + "/P, i, n)", s:v.a === "P" ? "No requiere conversión" : v.a + " = " + money(P) + " × " + nf(fromP, 6) + " = " + money(R), r:money(R), c:"ok", why:"todos los valores son equivalentes a la misma tasa: da lo mismo recibir cualquiera de ellos." }
    ]);
    h += h3("Factores para i = " + pc(i, 2) + " y n = " + n0(n)) + table(["Factor", "Notación", "Fórmula", "Valor"], [
      ["Cantidad compuesta", "(F/P, i, n)", "(1+i)^n", nf(k.FP, 6)], ["Valor presente", "(P/F, i, n)", "1 ÷ (1+i)^n", nf(k.PF, 6)],
      ["Recuperación de capital", "(A/P, i, n)", "i(1+i)^n ÷ [(1+i)^n − 1]", nf(k.AP, 6)], ["Valor presente de serie", "(P/A, i, n)", "[(1+i)^n − 1] ÷ [i(1+i)^n]", nf(k.PA, 6)],
      ["Fondo de amortización", "(A/F, i, n)", "i ÷ [(1+i)^n − 1]", nf(k.AF, 6)], ["Cantidad compuesta de serie", "(F/A, i, n)", "[(1+i)^n − 1] ÷ i", nf(k.FA, 6)],
      ["Valor presente de gradiente", "(P/G, i, n)", "[(1+i)^n − i·n − 1] ÷ [i²(1+i)^n]", nf(k.PG, 6)], ["Serie uniforme de gradiente", "(A/G, i, n)", "1/i − n ÷ [(1+i)^n − 1]", nf(k.AG, 6)]
    ], { num:[3] });
    return h;
  },
  learn:"<p>La anualidad A ocurre al <b>final</b> de cada período (vencida), de 1 a n. Si los pagos son anticipados, multiplica P por (1 + i). El gradiente G parte en el período 2 (G, 2G, … (n−1)G); el primer pago va como anualidad aparte.</p><p>La tasa i y n deben estar en la misma unidad de tiempo: tasa mensual con meses, anual con años.</p>",
  rel:["tasas", "amortizacion", "van-tir"]
});

def("tasas", "eco", {
  t:"Tasas de interés: nominal, efectiva y real", ico:"%", d:"Convierte tasas nominales, efectivas, periódicas y reales (Fisher)",
  ey:"Matemática financiera · Conversión de tasas",
  lead:"Transforma una tasa al período que necesitas y descuenta la inflación para obtener la tasa real.",
  f:[SEL("tipo", "La tasa que tengo es", "nom", [["nom", "Nominal anual (TNA)"], ["efa", "Efectiva anual (TEA)"], ["per", "Periódica (por subperíodo)"]]), F("tasa", "Tasa", 12, { u:"%" }), F("m", "Capitalizaciones por año", 12, { h:"12 mensual · 4 trimestral · 2 semestral · 360 diaria" }), F("inf", "Inflación anual esperada", 4, { u:"%" })],
  c(v){
    const x = need(v, "tasa", "Tasa") / 100, m = need(v, "m", "Capitalizaciones", { pos:true }), inf = (opt(v, "inf") || 0) / 100;
    let ip, TEA, j;
    if (v.tipo === "nom") { j = x; ip = j / m; TEA = Math.pow(1 + ip, m) - 1; }
    else if (v.tipo === "efa") { TEA = x; ip = Math.pow(1 + TEA, 1 / m) - 1; j = ip * m; }
    else { ip = x; j = ip * m; TEA = Math.pow(1 + ip, m) - 1; }
    const real = (1 + TEA) / (1 + inf) - 1, cont = Math.log(1 + TEA);
    let h = kpis([kpi("Efectiva anual (TEA)", pc(TEA, 3), "", "hi"), kpi("Nominal anual", pc(j, 3)), kpi("Periódica", pc(ip, 4), "cada 1/" + n0(m) + " año"), kpi("Real anual (Fisher)", pc(real, 3))]);
    h += steps([
      { t:"Tasa periódica", f:"i_p = TNA ÷ m   ó   i_p = (1 + TEA)^(1/m) − 1", s:"i_p = " + pc(ip, 4), r:pc(ip, 4) },
      { t:"Tasa efectiva anual", f:"TEA = (1 + i_p)^m − 1", s:"TEA = (1 + " + nf(ip, 6) + ")^" + n0(m) + " − 1 = " + pc(TEA, 3), r:pc(TEA, 3), why:"la efectiva incluye el interés sobre el interés; es la única comparable entre productos con distinta capitalización." },
      { t:"Tasa real (ecuación de Fisher)", f:"(1 + TEA) = (1 + real) × (1 + π)", s:"real = (1 + " + nf(TEA, 5) + ") ÷ (1 + " + nf(inf, 4) + ") − 1 = " + pc(real, 3), r:pc(real, 3), why:"mide cuánto crece tu poder de compra. Restar la inflación (" + pc(TEA - inf, 2) + ") es solo una aproximación." }
    ]);
    h += h3("Tasas equivalentes a la TEA") + table(["Período", "Subperíodos por año", "Tasa efectiva del período"],
      [["Diaria (año comercial)", 360], ["Mensual", 12], ["Bimestral", 6], ["Trimestral", 4], ["Semestral", 2], ["Anual", 1]].map(r => [r[0], r[1], pc(Math.pow(1 + TEA, 1 / r[1]) - 1, 4)]).concat([["Continua equivalente", "∞", pc(cont, 4)]]), { num:[1, 2] });
    return h;
  },
  learn:"<p>En Chile los créditos informan la <b>CAE</b> (Carga Anual Equivalente, Ley 20.555), que incluye intereses, comisiones y seguros. Para comparar créditos usa la CAE, no la tasa mensual publicitada. Los créditos en <b>UF</b> ya están indexados a la inflación, por eso su tasa se parece a una tasa real.</p>",
  rel:["equivalencias", "amortizacion"]
});

def("amortizacion", "eco", {
  t:"Amortización de créditos", ico:"Cuota", d:"Tabla de desarrollo: sistema francés, alemán o americano",
  ey:"Financiamiento · Tabla de desarrollo",
  lead:"Construye la tabla de pagos de un préstamo: cuota, interés, amortización y saldo en cada período.",
  f:[F("M", "Monto del crédito", 25000000, { u:"$" }), F("tasa", "Tasa", 1.1, { u:"%" }), SEL("tt", "Tipo de tasa", "men", [["men", "Mensual"], ["tea", "Efectiva anual"], ["tna", "Nominal anual (÷12)"]]), F("n", "Plazo", 48, { u:"meses" }), SEL("sis", "Sistema", "fr", [["fr", "Francés (cuota fija)"], ["al", "Alemán (amortización fija)"], ["am", "Americano (bullet)"]])],
  c(v){
    const M = need(v, "M", "Monto", { pos:true }), x = need(v, "tasa", "Tasa") / 100, n = need(v, "n", "Plazo", { pos:true, int:true, max:600 });
    const i = v.tt === "men" ? x : v.tt === "tea" ? Math.pow(1 + x, 1 / 12) - 1 : x / 12;
    let s = M; const R = []; let TI = 0, TC = 0, c1 = NaN;
    const cuotaFr = i === 0 ? M / n : M * i / (1 - Math.pow(1 + i, -n));
    for (let t = 1; t <= n; t++) { const it = s * i; let am, cu;
      if (v.sis === "fr") { cu = cuotaFr; am = cu - it; } else if (v.sis === "al") { am = M / n; cu = am + it; } else { am = t === n ? s : 0; cu = am + it; }
      if (t === 1) c1 = cu; s -= am; if (Math.abs(s) < 1e-6) s = 0; TI += it; TC += cu; R.push([t, money(cu), money(it), money(am), money(s)]); }
    const nom = { fr:"francés", al:"alemán", am:"americano" }[v.sis];
    let h = kpis([kpi(v.sis === "fr" ? "Cuota fija" : "Primera cuota", money(c1)), kpi("Tasa mensual", pc(i, 3)), kpi("Total intereses", money(TI), "", "hi"), kpi("Total pagado", money(TC))]);
    h += steps([
      { t:"Tasa del período", f:"i = tasa mensual equivalente", s:"i = " + pc(i, 4), r:pc(i, 4) },
      v.sis === "fr" ? { t:"Cuota fija (sistema francés)", f:"C = M × i ÷ [1 − (1 + i)^−n]", s:"C = " + money(M) + " × " + nf(i, 6) + " ÷ [1 − (1 + " + nf(i, 6) + ")^−" + n + "] = " + money(cuotaFr), r:money(cuotaFr), why:"al principio la mayor parte de la cuota es interés; al final, amortización." }
        : v.sis === "al" ? { t:"Amortización constante (alemán)", f:"Amortización = M ÷ n   ·   Cuota_t = M/n + i × Saldo_(t−1)", s:"Amortización = " + money(M / n), r:"cuotas decrecientes", why:"pagas menos intereses totales que en el francés porque el saldo baja más rápido." }
        : { t:"Sistema americano", f:"Cuota_t = i × M  (t < n)   ·   Cuota_n = i × M + M", s:"Interés periódico = " + money(M * i), r:"capital al final", why:"común en bonos corporativos: el capital se devuelve completo al vencimiento." },
      { t:"Interés y saldo de cada período", f:"Interés_t = i × Saldo_(t−1)   ·   Saldo_t = Saldo_(t−1) − Amortización_t" }
    ]);
    h += h3("Tabla de desarrollo · sistema " + nom) + table(["Período", "Cuota", "Interés", "Amortización", "Saldo"], R, { num:[0, 1, 2, 3, 4], tall:true, foot:["Total", money(TC), money(TI), money(M), ""] });
    return h;
  },
  learn:"<p>Al evaluar un proyecto con deuda (flujo del inversionista) se agregan: el préstamo como ingreso en t = 0, los intereses como gasto (generan ahorro tributario) y la amortización como egreso después de impuestos.</p>",
  rel:["tasas", "flujo-caja", "wacc"]
});

def("depreciacion", "eco", {
  t:"Depreciación de activos", ico:"Dep", d:"Lineal, suma de dígitos y saldo doble decreciente",
  ey:"Contabilidad de costos · Activo fijo",
  lead:"Compara los métodos de depreciación de un activo y su valor libro año a año.",
  f:[F("C", "Costo del activo", 60000000, { u:"$" }), F("VR", "Valor residual", 6000000, { u:"$" }), F("n", "Vida útil", 6, { u:"años" })],
  c(v){
    const Cc = need(v, "C", "Costo", { pos:true }), VR = need(v, "VR", "Valor residual", { nn:true }), n = need(v, "n", "Vida útil", { pos:true, int:true, max:60 });
    if (VR >= Cc) fail("El valor residual debe ser menor que el costo.");
    const B = Cc - VR, SD = n * (n + 1) / 2, rate = 2 / n; let vl1 = Cc, vl2 = Cc, vl3 = Cc; const rowsT = [], p1 = [[0, Cc]], p2 = [[0, Cc]], p3 = [[0, Cc]];
    for (let t = 1; t <= n; t++) {
      const d1 = B / n, d2 = B * (n - t + 1) / SD; let d3 = vl3 * rate; if (vl3 - d3 < VR) d3 = vl3 - VR; if (t === n) d3 = vl3 - VR;
      vl1 -= d1; vl2 -= d2; vl3 -= d3; p1.push([t, vl1]); p2.push([t, vl2]); p3.push([t, vl3]);
      rowsT.push([t, money(d1), money(vl1), money(d2), money(vl2), money(d3), money(vl3)]);
    }
    let h = kpis([kpi("Base depreciable", money(B)), kpi("Lineal anual", money(B / n)), kpi("SDA año 1", money(B * n / SD)), kpi("Doble decreciente año 1", money(Cc * rate))]);
    h += steps([
      { t:"Línea recta", f:"D = (C − VR) ÷ n", s:"D = (" + money(Cc) + " − " + money(VR) + ") ÷ " + n + " = " + money(B / n), r:money(B / n) + " por año" },
      { t:"Suma de los dígitos de los años (SDA)", f:"D_t = (C − VR) × (n − t + 1) ÷ [n(n+1)/2]", s:"Suma de dígitos = " + n0(SD) + " → D_1 = " + money(B) + " × " + n + "/" + n0(SD), r:money(B * n / SD) + " el año 1" },
      { t:"Saldo doble decreciente", f:"D_t = (2 ÷ n) × Valor libro_(t−1), sin bajar del valor residual", s:"Tasa = 2 ÷ " + n + " = " + pc(rate), r:money(Cc * rate) + " el año 1", why:"los métodos acelerados adelantan el gasto: pagas menos impuesto al inicio, lo que mejora el VAN aunque el total depreciado sea el mismo." }
    ]);
    h += h3("Depreciación y valor libro por año") + table(["Año", "Lineal", "VL lineal", "SDA", "VL SDA", "Doble dec.", "VL doble dec."], rowsT, { num:[0, 1, 2, 3, 4, 5, 6] });
    h += chart({ title:"Valor libro", series:[{ pts:p1, cls:"s1", dot:"d1" }, { pts:p2, cls:"s2", dot:"d2" }, { pts:p3, cls:"s3", dot:"d3" }], h:[{ y:VR, cls:"sm", lbl:"Valor residual" }], xlab:"Año", ylab:"Valor libro ($)", legend:[["--blue", "Lineal"], ["--copper", "SDA"], ["--ok", "Doble decreciente"]] });
    h += note("En Chile el SII fija vidas útiles normales por tipo de bien y permite <b>depreciación acelerada</b> (vida útil ÷ 3, en línea recta) y, para algunas empresas, depreciación instantánea. Verifica la tabla vigente del SII antes de usar estos valores en una declaración.", "info");
    return h;
  },
  rel:["flujo-caja", "caue"]
});

def("equilibrio", "eco", {
  t:"Punto de equilibrio y margen de contribución", ico:"PE", d:"Unidades y ventas para no perder; meta de utilidad; apalancamiento",
  ey:"Costos · Análisis costo-volumen-utilidad",
  lead:"Calcula cuántas unidades debes vender para cubrir todos los costos y cuántas para lograr una utilidad objetivo.",
  f:[F("CF", "Costos fijos del período", 18000000, { u:"$" }), F("p", "Precio de venta unitario", 12500, { u:"$" }), F("cv", "Costo variable unitario", 7400, { u:"$" }), F("U", "Utilidad objetivo (después de impuesto)", 4000000, { u:"$" }), F("t", "Tasa de impuesto", 27, { u:"%" }), F("Qp", "Ventas proyectadas", 5200, { u:"unidades" })],
  c(v){
    const CF = need(v, "CF", "Costos fijos", { nn:true }), p = need(v, "p", "Precio", { pos:true }), cv = need(v, "cv", "Costo variable", { nn:true }), U = opt(v, "U") || 0, t = (opt(v, "t") || 0) / 100, Qp = opt(v, "Qp");
    const EQ = NUC.equilibrio(CF, p, cv, U, t, Qp), mc = EQ.mc, Q = EQ.Q, V = EQ.V, rmc = EQ.rmc, Qo = EQ.Qo, ms = EQ.ms, UAI = EQ.UAI, GAO = EQ.GAO;
    let h = kpis([kpi("Equilibrio", n0(Math.ceil(Q)), "unidades", "hi"), kpi("Ventas de equilibrio", money(V)), kpi("Margen de contribución", money(mc), pc(rmc) + " del precio"), kpi("Para la utilidad objetivo", n0(Math.ceil(Qo)), "unidades"), kpi("Margen de seguridad", fin(ms) ? pc(ms) : "—", "", fin(ms) ? (ms > 0 ? "ok" : "bad") : ""), kpi("Apalancamiento operativo", fin(GAO) && UAI > 0 ? nf(GAO, 2) + "×" : "—")]);
    h += steps([
      { t:"Margen de contribución unitario", f:"MC = p − cv", s:"MC = " + money(p) + " − " + money(cv) + " = " + money(mc), r:money(mc), why:"es lo que cada unidad aporta para pagar costos fijos y, después, generar utilidad." },
      { t:"Punto de equilibrio en unidades", f:"Q_e = CF ÷ MC", s:"Q_e = " + money(CF) + " ÷ " + money(mc) + " = " + nf(Q, 1), r:n0(Math.ceil(Q)) + " unidades (se redondea hacia arriba)" },
      { t:"Punto de equilibrio en pesos", f:"V_e = CF ÷ (MC/p)", s:"V_e = " + money(CF) + " ÷ " + nf(rmc, 4) + " = " + money(V), r:money(V) },
      { t:"Unidades para la utilidad objetivo", f:"Q = [CF + U ÷ (1 − t)] ÷ MC", s:"Q = [" + money(CF) + " + " + money(U) + " ÷ " + nf(1 - t, 2) + "] ÷ " + money(mc) + " = " + nf(Qo, 1), r:n0(Math.ceil(Qo)) + " unidades", why:"la utilidad objetivo se pide después de impuestos, por eso se divide por (1 − t)." }
    ].concat(Qp ? [{ t:"Margen de seguridad y apalancamiento", f:"MS = (Q_p − Q_e) ÷ Q_p   ·   GAO = MC total ÷ UAI", s:"MS = (" + n0(Qp) + " − " + n1(Q) + ") ÷ " + n0(Qp) + " = " + pc(ms) + "   ·   GAO = " + money(Qp * mc) + " ÷ " + money(UAI) + " = " + nf(GAO, 2), r:pc(ms) + " · " + nf(GAO, 2) + "×", c:ms > 0 ? "ok" : "bad", why:"el margen de seguridad dice cuánto pueden caer las ventas antes de perder. Un GAO de " + nf(GAO, 1) + " significa que si las ventas suben 1 %, la utilidad operacional sube " + nf(GAO, 1) + " %." }] : []));
    const qmax = Math.max(Q * 2, Qp || 0, Qo) * 1.1, pI = [], pC = [];
    for (let k = 0; k <= 20; k++) { const q = qmax * k / 20; pI.push([q, q * p]); pC.push([q, CF + q * cv]); }
    h += chart({ title:"Gráfico de equilibrio", series:[{ pts:pI, cls:"s1" }, { pts:pC, cls:"s2" }], h:[{ y:CF, cls:"sm", lbl:"Costos fijos" }], v:[{ x:Q, cls:"sb", lbl:"Q equilibrio" }], xlab:"Unidades", ylab:"$", legend:[["--blue", "Ingresos"], ["--copper", "Costo total"]] });
    h += lectura("cada unidad deja " + money(mc) + " para pagar los costos fijos; con " + n0(Math.ceil(Q)) + " unidades se cubren todos los costos y desde ahí cada unidad adicional es ganancia." + (fin(ms) ? (ms > 0 ? " Con las ventas proyectadas, estas pueden caer " + pc(ms) + " antes de perder." : " Con las ventas proyectadas, la empresa pierde dinero.") : ""));
    return h;
  },
  learn:"<p>Con varios productos usa el <b>margen de contribución ponderado</b> por la mezcla de ventas: MC̄ = Σ (MC_i × participación_i). El equilibrio se calcula con MC̄ y luego se reparte según la mezcla.</p>",
  rel:["costeo", "flujo-caja"]
});

def("costeo", "eco", {
  t:"Costo unitario y precio de venta", ico:"$/u", d:"Costeo por absorción, precio con margen o markup, IVA",
  ey:"Costos · Fijación de precios",
  lead:"Suma materiales, mano de obra y costos indirectos para obtener el costo unitario y define el precio con el margen que necesitas.",
  f:[F("mp", "Materia prima por unidad", 3200, { u:"$" }), F("mod", "Mano de obra directa por unidad", 1800, { u:"$" }), F("cif", "Costos indirectos de fabricación del período", 9000000, { u:"$" }), F("q", "Producción del período", 4000, { u:"unidades" }), F("gav", "Gastos de administración y ventas por unidad", 900, { u:"$" }), SEL("modo", "Definir precio por", "mg", [["mg", "Margen sobre el precio"], ["mk", "Markup sobre el costo"]]), F("m", "Margen o markup", 30, { u:"%" }), F("iva", "IVA", 19, { u:"%" })],
  c(v){
    const mp = need(v, "mp", "Materia prima", { nn:true }), mo = need(v, "mod", "Mano de obra", { nn:true }), cif = need(v, "cif", "CIF", { nn:true }), q = need(v, "q", "Producción", { pos:true }), gav = opt(v, "gav") || 0, m = need(v, "m", "Margen") / 100, iva = (opt(v, "iva") || 0) / 100;
    const cifu = cif / q, cprod = mp + mo + cifu, ctot = cprod + gav;
    if (v.modo === "mg" && m >= 1) fail("El margen sobre el precio debe ser menor que 100 %.");
    const p = v.modo === "mg" ? ctot / (1 - m) : ctot * (1 + m), pIva = p * (1 + iva), mgEq = (p - ctot) / p, mkEq = (p - ctot) / ctot;
    let h = kpis([kpi("Costo de producción", money(cprod, 0), "por unidad"), kpi("Costo total", money(ctot, 0), "por unidad"), kpi("Precio neto", money(p, 0), "", "hi"), kpi("Precio con IVA", money(pIva, 0)), kpi("Margen / Markup", pc(mgEq) + " / " + pc(mkEq))]);
    h += steps([
      { t:"CIF por unidad", f:"CIF_u = CIF del período ÷ producción", s:money(cif) + " ÷ " + n0(q) + " = " + money(cifu, 1), r:money(cifu, 1), why:"los costos indirectos (supervisión, energía, mantención, arriendo de planta) se reparten entre las unidades. Si la producción baja, el costo unitario sube." },
      { t:"Costo unitario de producción", f:"C_prod = MP + MOD + CIF_u", s:money(mp) + " + " + money(mo) + " + " + money(cifu, 1) + " = " + money(cprod, 1), r:money(cprod, 1) },
      { t:"Costo total unitario", f:"C_total = C_prod + GAV", s:money(cprod, 1) + " + " + money(gav) + " = " + money(ctot, 1), r:money(ctot, 1) },
      { t:"Precio de venta", f:v.modo === "mg" ? "p = C_total ÷ (1 − margen)" : "p = C_total × (1 + markup)", s:v.modo === "mg" ? money(ctot, 1) + " ÷ (1 − " + nf(m, 2) + ") = " + money(p, 1) : money(ctot, 1) + " × (1 + " + nf(m, 2) + ") = " + money(p, 1), r:money(p, 0), why:"margen y markup no son lo mismo: un markup de 30 % equivale a un margen de 23,1 %." },
      { t:"Precio al público con IVA", f:"p_IVA = p × (1 + IVA)", s:money(p, 1) + " × " + nf(1 + iva, 2) + " = " + money(pIva, 1), r:money(pIva, 0) }
    ]);
    h += chart({ title:"Estructura del precio", bars:[{ x:1, y:mp, cls:"bar1", lbl:pc(mp / p) }, { x:2, y:mo, cls:"bar1", lbl:pc(mo / p) }, { x:3, y:cifu, cls:"bar1", lbl:pc(cifu / p) }, { x:4, y:gav, cls:"bar1", lbl:pc(gav / p) }, { x:5, y:p - ctot, cls:"bar3", lbl:pc((p - ctot) / p) }], xcat:["Materia prima", "Mano de obra", "CIF", "GAV", "Utilidad"], ylab:"$ por unidad", cap:"Porcentajes sobre el precio neto." });
    return h;
  },
  learn:"<p><b>Costeo por absorción</b> (exigido para estados financieros) incluye los CIF fijos en el inventario. <b>Costeo variable</b> (útil para decidir) deja los fijos como gasto del período. <b>Costeo ABC</b> asigna indirectos según actividades y sus inductores (n.º de órdenes, horas máquina, setups), y es más preciso cuando hay muchos productos.</p>",
  rel:["equilibrio"]
});

def("caue", "eco", {
  t:"CAUE: comparar alternativas", ico:"CAUE", d:"Costo anual uniforme equivalente entre dos equipos o alternativas",
  ey:"Ingeniería económica · Alternativas mutuamente excluyentes",
  lead:"Compara dos alternativas con vidas útiles distintas llevando todos sus costos a un costo anual equivalente.",
  f:[F("i", "Tasa de descuento", 10, { u:"%" }), TXT("nA", "Alternativa A", "Torno CNC nuevo"), F("IA", "Inversión A", 45000000, { u:"$" }), F("CA", "Costo anual A", 6000000, { u:"$/año" }), F("RA", "Valor residual A", 8000000, { u:"$" }), F("nA_", "Vida útil A", 8, { u:"años" }),
     TXT("nB", "Alternativa B", "Torno convencional reacondicionado"), F("IB", "Inversión B", 18000000, { u:"$" }), F("CB", "Costo anual B", 11000000, { u:"$/año" }), F("RB", "Valor residual B", 2000000, { u:"$" }), F("nB_", "Vida útil B", 5, { u:"años" })],
  c(v){
    const i = need(v, "i", "Tasa") / 100;
    const alt = s => { const I = need(v, "I" + s, "Inversión " + s, { nn:true }), Cc = need(v, "C" + s, "Costo anual " + s, { nn:true }), R = opt(v, "R" + s) || 0, n = need(v, "n" + s + "_", "Vida útil " + s, { pos:true }); const k = fct(i, n); return { I, Cc, R, n, k, caue:I * k.AP + Cc - R * k.AF, nm:v["n" + s] || s }; };
    const A = alt("A"), B = alt("B"), win = A.caue <= B.caue ? A : B;
    let h = kpis([kpi("CAUE " + esc(A.nm), money(A.caue), "", A === win ? "ok" : ""), kpi("CAUE " + esc(B.nm), money(B.caue), "", B === win ? "ok" : ""), kpi("Ahorro anual", money(Math.abs(A.caue - B.caue)), "", "hi")]);
    h += note("Conviene <b>" + esc(win.nm) + "</b>: su costo equivalente es menor en " + money(Math.abs(A.caue - B.caue)) + " por año.", "ok");
    h += steps([A, B].map(x => ({ t:"CAUE de " + esc(x.nm), f:"CAUE = I × (A/P, i, n) + C − VR × (A/F, i, n)", s:"CAUE = " + money(x.I) + " × " + nf(x.k.AP, 5) + " + " + money(x.Cc) + " − " + money(x.R) + " × " + nf(x.k.AF, 5) + " = " + money(x.caue), r:money(x.caue) + " por año", why:"(A/P) reparte la inversión en cuotas anuales que incluyen el costo de capital; (A/F) convierte el valor residual en un ahorro anual." })));
    h += note("El CAUE supone que cada alternativa se puede repetir en las mismas condiciones al terminar su vida útil. Si no es así, compara con un horizonte común.", "info");
    return h;
  },
  rel:["vida-economica", "equivalencias", "depreciacion"]
});

def("vida-economica", "eco", {
  t:"Vida económica y reemplazo de equipos", ico:"VE", d:"Año óptimo para reemplazar un activo (mínimo CAUE)",
  ey:"Ingeniería económica · Análisis de reemplazo",
  lead:"Encuentra cuántos años conviene mantener un equipo antes de reemplazarlo, considerando su pérdida de valor y el aumento de sus costos de operación.",
  f:[F("I", "Inversión inicial", 40000000, { u:"$" }), F("i", "Tasa de descuento", 10, { u:"%" }), LST("VM", "Valor de mercado al final de cada año", "30000000 23000000 17500000 13000000 9500000 7000000 5000000"), LST("CO", "Costo de operación y mantención de cada año", "4000000 4600000 5500000 6800000 8400000 10500000 13000000")],
  c(v){
    const I = need(v, "I", "Inversión", { pos:true }), i = need(v, "i", "Tasa") / 100, VM = list(v.VM, "los valores de mercado"), CO = list(v.CO, "los costos");
    if (VM.length !== CO.length) fail("Ingresa la misma cantidad de valores de mercado (" + VM.length + ") y de costos (" + CO.length + ").");
    let vpCO = 0; const R = [], pts = [];
    for (let n = 1; n <= VM.length; n++) { vpCO += CO[n - 1] / Math.pow(1 + i, n); const k = fct(i, n); const cc = I * k.AP - VM[n - 1] * k.AF, co = vpCO * k.AP, tot = cc + co; R.push({ n, cc, co, tot }); pts.push([n, tot]); }
    const best = R.reduce((a, b) => b.tot < a.tot ? b : a);
    let h = kpis([kpi("Vida económica", best.n, "años", "hi"), kpi("CAUE mínimo", money(best.tot)), kpi("CAUE de capital en ese año", money(best.cc)), kpi("CAUE de operación en ese año", money(best.co))]);
    h += steps([
      { t:"Costo de capital equivalente", f:"CAUE_cap(n) = I × (A/P, i, n) − VM_n × (A/F, i, n)", why:"baja con los años: la inversión se reparte en más períodos." },
      { t:"Costo de operación equivalente", f:"CAUE_op(n) = [Σ CO_t × (P/F, i, t)] × (A/P, i, n)", why:"sube con los años porque el equipo envejece." },
      { t:"Vida económica", f:"n* = argmin [CAUE_cap(n) + CAUE_op(n)]", r:best.n + " años con " + money(best.tot) + "/año", c:"ok", why:"después de ese año cada año extra encarece el costo anual promedio; es el momento de reemplazar." }
    ]);
    h += table(["Años de uso", "CAUE capital", "CAUE operación", "CAUE total"], R.map(r => rowc([r.n, money(r.cc), money(r.co), money(r.tot)], r === best ? "sel" : "")), { num:[0, 1, 2, 3] });
    h += chart({ title:"CAUE según años de uso", series:[{ pts:R.map(r => [r.n, r.cc]), cls:"s1", dot:"d1" }, { pts:R.map(r => [r.n, r.co]), cls:"s2", dot:"d2" }, { pts, cls:"s3", dot:"d3" }], v:[{ x:best.n, cls:"sb", lbl:"Vida económica" }], xlab:"Años de uso", ylab:"$/año", legend:[["--blue", "Capital"], ["--copper", "Operación"], ["--ok", "Total"]] });
    return h;
  },
  rel:["caue", "depreciacion"]
});

def("wacc", "eco", {
  t:"Costo de capital: CAPM y WACC", ico:"WACC", d:"Tasa de descuento: costo del patrimonio y costo promedio ponderado",
  ey:"Finanzas corporativas · Tasa de descuento",
  lead:"Calcula la rentabilidad exigida por los accionistas (CAPM) y el costo promedio ponderado del capital de la empresa.",
  f:[F("rf", "Tasa libre de riesgo", 5.5, { u:"%", h:"Ej.: bono del Banco Central o de Tesorería a 10 años." }), F("beta", "Beta", 0.9), SEL("bt", "La beta ingresada es", "L", [["L", "Apalancada (de la empresa)"], ["U", "Desapalancada (de la industria)"]]), F("prm", "Premio por riesgo de mercado", 6.5, { u:"%" }), F("rp", "Premio por riesgo país o tamaño (opcional)", 0, { u:"%" }), F("kd", "Costo de la deuda (antes de impuesto)", 7, { u:"%" }), F("tc", "Tasa de impuesto corporativo", 27, { u:"%" }), F("D", "Deuda", 400, { u:"MM$" }), F("E", "Patrimonio", 600, { u:"MM$" })],
  c(v){
    const rf = need(v, "rf", "Tasa libre de riesgo") / 100, b0 = need(v, "beta", "Beta"), prm = need(v, "prm", "Premio de mercado") / 100, rp = (opt(v, "rp") || 0) / 100, kd = need(v, "kd", "Costo de la deuda") / 100, t = need(v, "tc", "Impuesto") / 100, D = need(v, "D", "Deuda", { nn:true }), E = need(v, "E", "Patrimonio", { pos:true });
    const bL = v.bt === "U" ? b0 * (1 + (1 - t) * D / E) : b0, ke = rf + bL * prm + rp, wE = E / (D + E), wD = D / (D + E), W = wE * ke + wD * kd * (1 - t);
    let h = kpis([kpi("Costo del patrimonio k_e", pc(ke, 2)), kpi("Costo deuda después de impuesto", pc(kd * (1 - t), 2)), kpi("WACC", pc(W, 2), "", "hi"), kpi("Beta apalancada", nf(bL, 3))]);
    h += steps((v.bt === "U" ? [{ t:"Apalancar la beta (Hamada)", f:"β_L = β_U × [1 + (1 − t) × D/E]", s:"β_L = " + nf(b0, 3) + " × [1 + " + nf(1 - t, 2) + " × " + nf(D / E, 3) + "] = " + nf(bL, 3), r:nf(bL, 3), why:"más deuda significa más riesgo para el accionista." }] : []).concat([
      { t:"CAPM", f:"k_e = r_f + β × (E[r_m] − r_f) + premios", s:"k_e = " + pc(rf, 2) + " + " + nf(bL, 3) + " × " + pc(prm, 2) + " + " + pc(rp, 2) + " = " + pc(ke, 2), r:pc(ke, 2) },
      { t:"WACC", f:"WACC = E/(D+E) × k_e + D/(D+E) × k_d × (1 − t)", s:"WACC = " + nf(wE, 3) + " × " + pc(ke, 2) + " + " + nf(wD, 3) + " × " + pc(kd, 2) + " × " + nf(1 - t, 2) + " = " + pc(W, 2), r:pc(W, 2), c:"ok", why:"los intereses se descuentan de impuestos, por eso la deuda cuesta k_d × (1 − t). Usa pesos a valor de mercado, no contables." }
    ]));
    return h;
  },
  rel:["van-tir", "flujo-caja"]
});

def("flujo-caja", "eco", {
  t:"Flujo de caja de un proyecto", ico:"FC", d:"Flujo puro con impuestos, depreciación, capital de trabajo y valor de desecho",
  ey:"Preparación y evaluación de proyectos · Flujo de caja puro",
  lead:"Construye el flujo de caja completo de un proyecto (sin financiamiento) y obtiene VAN, TIR y período de recuperación.",
  f:[F("I", "Inversión en activo fijo", 120000000, { u:"$" }), F("KT", "Capital de trabajo", 15000000, { u:"$" }), F("n", "Horizonte de evaluación", 6, { u:"años" }), F("V1", "Ingresos del año 1", 95000000, { u:"$" }), F("g", "Crecimiento anual de ingresos", 5, { u:"%" }), F("cvp", "Costos variables", 42, { u:"% de ingresos" }), F("CF", "Costos fijos anuales", 18000000, { u:"$" }), F("vu", "Vida útil contable del activo", 8, { u:"años" }), F("VD", "Valor de desecho (venta del activo al final)", 35000000, { u:"$" }), F("t", "Impuesto a la renta", 27, { u:"%" }), F("r", "Tasa de descuento", 12, { u:"%" })],
  c(v){
    const I = need(v, "I", "Inversión", { nn:true }), KT = need(v, "KT", "Capital de trabajo", { nn:true }), n = need(v, "n", "Horizonte", { pos:true, int:true, max:40 }), V1 = need(v, "V1", "Ingresos"), g = (opt(v, "g") || 0) / 100, cvp = need(v, "cvp", "Costos variables") / 100, CF = need(v, "CF", "Costos fijos", { nn:true }), vu = need(v, "vu", "Vida útil", { pos:true }), VD = opt(v, "VD") || 0, t = need(v, "t", "Impuesto") / 100, r = need(v, "r", "Tasa") / 100;
    const dep = I / vu, Y = []; let perd = 0;
    for (let k = 1; k <= n; k++) { const ing = V1 * Math.pow(1 + g, k - 1), cv = ing * cvp, d = k <= vu ? dep : 0; let uai = ing - cv - CF - d; let vl = 0, gan = 0;
      if (k === n) { vl = Math.max(0, I - dep * Math.min(n, vu)); gan = VD - vl; uai += gan; }
      let base = uai + perd; let imp = 0; if (base > 0) { imp = base * t; perd = 0; } else { perd = base; }
      const un = uai - imp, fc = un + d + (k === n ? vl + KT : 0);
      Y.push({ k, ing, cv, d, gan, uai, imp, un, vl, fc }); }
    const Fl = [-(I + KT)].concat(Y.map(y => y.fc)), VAN = npv(r, Fl), T = irr(Fl)[0];
    let ac = 0, pri = NaN; for (let k = 0; k < Fl.length; k++) { const prev = ac; ac += Fl[k] / Math.pow(1 + r, k); if (k > 0 && prev < 0 && ac >= 0) pri = k - 1 + (-prev) / (Fl[k] / Math.pow(1 + r, k)); }
    let h = kpis([kpi("VAN", money(VAN), "", VAN >= 0 ? "ok" : "bad"), kpi("TIR", fin(T) ? pc(T, 2) : "—", "", fin(T) && T >= r ? "ok" : "bad"), kpi("PRI descontado", fin(pri) ? n1(pri) + " años" : "No recupera"), kpi("Depreciación anual", money(dep))]);
    h += VAN >= 0 ? note("El proyecto es rentable a la tasa de " + pc(r) + ": crea " + money(VAN) + " de valor.", "ok") : note("El proyecto no alcanza la rentabilidad exigida del " + pc(r) + ".", "bad");
    const yrs = ["Ítem", "Año 0"].concat(Y.map(y => "Año " + y.k)), z = "";
    const row = (lbl, f0, fn) => [lbl, f0].concat(Y.map(fn));
    h += h3("Flujo de caja proyectado") + table(yrs, [
      row("(+) Ingresos", z, y => money(y.ing)), row("(−) Costos variables", z, y => money(-y.cv)), row("(−) Costos fijos", z, () => money(-CF)), row("(−) Depreciación", z, y => money(-y.d)),
      row("(+) Ganancia venta de activo", z, y => y.k === n ? money(y.gan) : ""), rowc(row("= Utilidad antes de impuesto", z, y => money(y.uai)), "sel"), row("(−) Impuesto " + pc(t, 0), z, y => money(-y.imp)),
      rowc(row("= Utilidad neta", z, y => money(y.un)), "sel"), row("(+) Depreciación", z, y => money(y.d)), row("(+) Valor libro del activo vendido", z, y => y.k === n ? money(y.vl) : ""),
      row("(−) Inversión fija", money(-I), () => ""), row("(−/+) Capital de trabajo", money(-KT), y => y.k === n ? money(KT) : "")
    ], { num:Array.from({ length:n + 2 }, (_, i) => i).slice(1), foot:["Flujo de caja neto"].concat(Fl.map(x => money(x))) });
    h += steps([
      { t:"Depreciación", f:"D = Inversión ÷ vida útil", s:money(I) + " ÷ " + vu + " = " + money(dep), why:"no es salida de caja: se resta para calcular el impuesto y luego se suma de vuelta." },
      { t:"Impuesto", f:"Impuesto = t × UAI (si hay pérdida se arrastra al año siguiente)", why:"la ley chilena permite imputar pérdidas tributarias a las utilidades futuras." },
      { t:"Valor de desecho", f:"Ganancia = Venta − Valor libro   ·   Valor libro = I − D × años", s:"Valor libro año " + n + " = " + money(Y[n - 1].vl) + " · ganancia = " + money(Y[n - 1].gan), why:"solo la ganancia sobre el valor libro paga impuesto." },
      { t:"Capital de trabajo", f:"Se invierte en t = 0 y se recupera en t = n", why:"es el dinero inmovilizado en inventarios y cuentas por cobrar para operar." },
      { t:"VAN y TIR", f:"VAN = Σ FC_t ÷ (1 + r)^t", s:"VAN = " + money(VAN), r:money(VAN) + " · TIR " + (fin(T) ? pc(T, 2) : "—"), c:VAN >= 0 ? "ok" : "bad" }
    ]);
    h += chart({ title:"Flujos netos", bars:Fl.map((f, k) => ({ x:k, y:f, cls:f >= 0 ? "bar3" : "bar2" })), xlab:"Año", ylab:"$" });
    return h;
  },
  learn:"<p>Estructura clásica (Sapag): <b>ingresos y egresos afectos a impuesto → gastos no desembolsables → cálculo del impuesto → ajuste por gastos no desembolsables → costos y beneficios no afectos a impuesto</b> (inversión, capital de trabajo, valor de desecho).</p><p>Para el flujo del inversionista agrega: préstamo (+ en t = 0), intereses (gasto antes de impuesto) y amortización de la deuda (después de impuesto), y descuenta a la tasa del patrimonio k_e.</p>",
  rel:["van-tir", "wacc", "depreciacion", "amortizacion"]
});

def("ratios", "eco", {
  t:"Indicadores financieros", ico:"Ratio", d:"Liquidez, endeudamiento, rentabilidad y actividad desde el balance",
  ey:"Análisis de estados financieros",
  lead:"Ingresa datos del balance y del estado de resultados para diagnosticar la salud financiera de la empresa.",
  f:[F("AC", "Activo corriente", 520, { u:"MM$" }), F("INV", "Inventarios", 180, { u:"MM$" }), F("PC", "Pasivo corriente", 310, { u:"MM$" }), F("AT", "Activo total", 1450, { u:"MM$" }), F("PT", "Pasivo total", 780, { u:"MM$" }), F("PAT", "Patrimonio", 670, { u:"MM$" }), F("VTA", "Ventas", 1900, { u:"MM$" }), F("CV", "Costo de ventas", 1260, { u:"MM$" }), F("EBIT", "Resultado operacional (EBIT)", 210, { u:"MM$" }), F("GF", "Gastos financieros", 48, { u:"MM$" }), F("UN", "Utilidad neta", 118, { u:"MM$" }), F("CxC", "Cuentas por cobrar", 240, { u:"MM$" })],
  c(v){
    const g = k => need(v, k, k), AC = g("AC"), INV = g("INV"), PC = g("PC"), AT = g("AT"), PT = g("PT"), PAT = g("PAT"), VTA = g("VTA"), CV = g("CV"), EBIT = g("EBIT"), GF = g("GF"), UN = g("UN"), CxC = g("CxC");
    const R = [
      ["Liquidez", "Razón corriente", "AC ÷ PC", AC / PC, x => x >= 1.5 ? "ok" : x >= 1 ? "warn" : "bad", "≥ 1,5 holgado; < 1 riesgo de no pagar el corto plazo"],
      ["Liquidez", "Prueba ácida", "(AC − Inventarios) ÷ PC", (AC - INV) / PC, x => x >= 1 ? "ok" : x >= 0.7 ? "warn" : "bad", "≥ 1 sin depender de vender inventario"],
      ["Endeudamiento", "Deuda / Patrimonio", "PT ÷ Patrimonio", PT / PAT, x => x <= 1 ? "ok" : x <= 2 ? "warn" : "bad", "≤ 1 conservador; > 2 apalancado"],
      ["Endeudamiento", "Endeudamiento sobre activos", "PT ÷ AT", PT / AT, x => x <= 0.5 ? "ok" : x <= 0.7 ? "warn" : "bad", "fracción de activos financiada con deuda", 1],
      ["Endeudamiento", "Cobertura de intereses", "EBIT ÷ Gastos financieros", EBIT / GF, x => x >= 3 ? "ok" : x >= 1.5 ? "warn" : "bad", "veces que la operación paga los intereses"],
      ["Rentabilidad", "Margen bruto", "(Ventas − Costo de ventas) ÷ Ventas", (VTA - CV) / VTA, () => "info", "", 1],
      ["Rentabilidad", "Margen operacional", "EBIT ÷ Ventas", EBIT / VTA, () => "info", "", 1],
      ["Rentabilidad", "Margen neto", "Utilidad neta ÷ Ventas", UN / VTA, () => "info", "", 1],
      ["Rentabilidad", "ROA", "Utilidad neta ÷ Activo total", UN / AT, x => x >= 0.05 ? "ok" : "warn", "rentabilidad de los activos", 1],
      ["Rentabilidad", "ROE", "Utilidad neta ÷ Patrimonio", UN / PAT, x => x >= 0.12 ? "ok" : "warn", "compárala con el costo del patrimonio k_e", 1],
      ["Actividad", "Rotación de inventarios", "Costo de ventas ÷ Inventarios", CV / INV, () => "info", "veces al año · días = 365 ÷ rotación"],
      ["Actividad", "Días de inventario", "365 ÷ rotación", 365 / (CV / INV), () => "info", "días"],
      ["Actividad", "Período de cobro", "CxC ÷ Ventas × 365", CxC / VTA * 365, x => x <= 45 ? "ok" : x <= 75 ? "warn" : "bad", "días"],
      ["Actividad", "Rotación de activos", "Ventas ÷ Activo total", VTA / AT, () => "info", "veces"]
    ];
    const dupont = [UN / VTA, VTA / AT, AT / PAT];
    let h = kpis([kpi("Razón corriente", nf(AC / PC, 2)), kpi("Deuda / Patrimonio", nf(PT / PAT, 2)), kpi("ROE", pc(UN / PAT), "", "hi"), kpi("Margen neto", pc(UN / VTA))]);
    h += table(["Área", "Indicador", "Fórmula", "Valor", "Lectura", "Referencia"], R.map(r => [r[0], "<b>" + r[1] + "</b>", r[2], r[7] ? pc(r[3]) : nf(r[3], 2), pill(r[4](r[3]), { ok:"Sano", warn:"Atención", bad:"Riesgo", info:"Info" }[r[4](r[3])]), '<span class="hint">' + r[5] + "</span>"]), { num:[3] });
    h += steps([{ t:"Análisis DuPont del ROE", f:"ROE = Margen neto × Rotación de activos × Multiplicador de capital", s:"ROE = " + pc(dupont[0], 2) + " × " + nf(dupont[1], 3) + " × " + nf(dupont[2], 3) + " = " + pc(dupont[0] * dupont[1] * dupont[2], 2), r:pc(UN / PAT, 2), why:"separa si la rentabilidad viene de vender con margen, de usar bien los activos o de endeudarse." }]);
    h += note("Los rangos de referencia son generales; compáralos siempre con el promedio de la industria y con la tendencia de la propia empresa.", "info");
    return h;
  },
  rel:["wacc", "flujo-caja"]
});
