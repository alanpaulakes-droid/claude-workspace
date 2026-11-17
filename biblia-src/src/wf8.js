/* ============ CURSO · Módulo Ingeniería económica ============
   Referencias (calculadoras): VAN 12 % = $ 165.950.054, TIR 18,31 %; P = A(P/A 1,5 %, 24) = $ 5.007.601; TEA 12,683 %, real 8,349 %;
   cuota $ 673.172; lineal $ 9.000.000, SDA₁ $ 15.428.571; Qe 3.530; costo total $ 8.150, precio $ 11.643; CAUE A $ 13.735.429, B $ 15.420.760;
   vida económica 6 años ($ 14.558.517); WACC 8,85 %; VAN flujo de caja $ 36.763.932; ROE 17,61 %. */
(function(){
  const n = crsNum, M = x => (x < 0 ? "−$ " : "$ ") + n(Math.abs(x)), P = x => n(x * 100, 2) + " %";
  const AP = (i, k) => i === 0 ? 1 / k : i * Math.pow(1 + i, k) / (Math.pow(1 + i, k) - 1), AF = (i, k) => i === 0 ? 1 / k : i / (Math.pow(1 + i, k) - 1), PF = (i, k) => 1 / Math.pow(1 + i, k);
  const npv = (r, F) => F.reduce((s, f, t) => s + f / Math.pow(1 + r, t), 0);
  const irr = F => { let lo = -0.9, hi = 2, flo = npv(lo, F); if (flo * npv(hi, F) > 0) return NaN; for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2, fm = npv(m, F); if (fm * flo > 0) { lo = m; flo = fm; } else hi = m; } return (lo + hi) / 2; };
  const bar = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, Math.min(y, y + h), w, Math.abs(h)); };

  /* ===================== VAN Y TIR ===================== */
  const FV = [-1e9, 280e6, 320e6, 350e6, 380e6, 300e6];
  CRS["van-tir"] = {
    kw:"van tir valor actual neto tasa interna de retorno evaluacion de proyectos flujo descontado periodo de recuperacion pri ivan",
    ess:{ pts:["El <b>VAN</b> trae todos los flujos al día de hoy con la tasa de descuento y los suma: si es positivo, el proyecto crea valor.", "La <b>TIR</b> es la tasa que hace VAN = 0: la rentabilidad propia del proyecto.", "Regla: VAN &gt; 0 ⇔ TIR &gt; tasa exigida (en proyectos normales: primero inversión, luego beneficios).", "El <b>PRI</b> dice en cuánto tiempo se recupera la inversión."],
      fx:"VAN = Σ Fₜ ÷ (1 + r)ᵗ;   0 = Σ Fₜ ÷ (1 + TIR)ᵗ", when:"debes decidir si invertir en un proyecto o comparar proyectos con flujos en distintos años." },
    intro:{ prob:"<p>Una nueva línea de envasado cuesta $ 1.000 millones y entregará flujos de $ 280, 320, 350, 380 y 300 millones en 5 años. La empresa exige 12 % anual. ¿Conviene?</p>",
      anal:"<p>Un peso hoy vale más que un peso en un año: hoy lo puedes depositar y ganar interés. Por eso no se pueden sumar sin más los flujos de distintos años; primero hay que «traerlos» a hoy.</p>",
      terms:[["Flujo (Fₜ)", "Dinero neto que entra (+) o sale (−) en el período t."], ["Tasa de descuento (r)", "Rentabilidad mínima exigida (costo de oportunidad)."], ["Factor de descuento", "1 ÷ (1 + r)ᵗ."], ["VAN", "Suma de flujos descontados."], ["TIR", "Tasa con VAN = 0."], ["PRI", "Tiempo para recuperar la inversión."], ["IVAN", "VAN ÷ inversión: VAN por peso invertido."]] },
    adv:"<p><b>Proyectos excluyentes:</b> elegir por VAN, no por TIR (la TIR ignora el tamaño). <b>TIR múltiple:</b> si los flujos cambian de signo varias veces, puede haber más de una TIR; usar VAN. <b>Inflación:</b> flujos nominales con tasa nominal, o reales con tasa real; nunca mezclar.</p>",
    sp:{ title:"VAN y TIR, paso a paso", params:[{ k:"r", l:"Tasa de descuento", v:12, u:"%" }],
      script(p){ const r = p.r / 100, vp = FV.map((f, t) => f / Math.pow(1 + r, t)), V = vp.reduce((a, b) => a + b, 0), T = irr(FV);
        return [
          { t:"Factor", e:"Factor año t = 1 ÷ (1 + " + n(r, 2) + ")ᵗ", s:"Cuánto vale hoy un peso del año t." },
          { t:"Año 1", e:"280 MM ÷ " + n(1 + r, 2) + " = " + M(vp[1]), h:M(vp[1]), s:"El primer flujo traído a hoy." },
          { t:"Año 2", e:"320 MM ÷ " + n(1 + r, 2) + "² = " + M(vp[2]), s:"Mientras más lejano, más se descuenta." },
          { t:"Resto", e:"Años 3, 4 y 5: " + M(vp[3]) + ";  " + M(vp[4]) + ";  " + M(vp[5]), s:"Mismo cálculo." },
          { t:"VAN", e:"VAN = −1.000 MM + suma de lo anterior = " + M(V), h:M(V), s:V >= 0 ? "Positivo: el proyecto rinde más que el " + p.r + " % exigido." : "Negativo: no alcanza a rendir el " + p.r + " %." },
          { t:"TIR", e:"Tasa que hace VAN = 0:  TIR = " + P(T), h:P(T), s:"Se encuentra probando tasas (o con Excel: TIR)." },
          { t:"Decisión", e:(T > r ? "TIR " + P(T) + " > " + p.r + " %  ⇒ conviene" : "TIR " + P(T) + " < " + p.r + " %  ⇒ no conviene"), s:"VAN y TIR dan la misma respuesta en un proyecto normal." }]; } },
    vars:[["Fₜ", "Flujo neto del período t", "$", "F₀ suele ser negativo"], ["r", "Tasa de descuento", "% por período", "8 a 15 % típico"], ["t", "Período", "años", "0 a n"], ["VAN", "Valor actual neto", "$", "&gt; 0 conviene"], ["TIR", "Tasa interna de retorno", "%", "&gt; r conviene"], ["PRI", "Período de recuperación", "años", "menor es mejor"]],
    sup:"<ul><li>Los flujos son estimaciones; hay que sensibilizar.</li><li>La tasa refleja el riesgo del proyecto.</li><li>Los flujos ocurren al final de cada período.</li></ul>",
    ex:{ t:"Línea de envasado: inversión $ 1.000 MM; flujos 280, 320, 350, 380 y 300 MM; tasa 12 %.",
      steps:[["Descuento cada flujo.", "Llevarlos a pesos de hoy.", "250,0; 255,1; 249,1; 241,5 y 170,2 MM.", "Los flujos lejanos pesan menos."], ["Sumo y resto la inversión.", "Es el VAN.", "VAN = $ 165,95 MM.", "El proyecto crea $ 166 MM de valor sobre el 12 %."], ["Calculo la TIR.", "Rentabilidad propia.", "18,31 %.", "Supera el 12 % exigido."], ["Calculo el PRI.", "Riesgo de liquidez.", "3,1 años (4,0 descontado).", "Recupera la inversión antes del final."]],
      r:"conviene invertir: VAN = $ 165.950.054 y TIR = 18,31 % > 12 %." },
    real:"<p>El VAN es el criterio estándar en evaluación social de proyectos (Ministerio de Desarrollo Social, con tasa social de descuento 6 %) y en la evaluación privada de bancos e inversionistas. Excel: VNA y TIR.</p>",
    sim:"van",
    chk(){ const N = NUC.van(0.12, FV); return [["VAN", npv(0.12, FV), N.VAN], ["TIR", irr(FV), N.TIR]]; },
    quiz:[["Un proyecto tiene VAN = 0 a la tasa exigida. Eso significa que:", ["Pierde dinero", "Rinde exactamente la tasa exigida", "No recupera la inversión", "La TIR es 0"], 1, "VAN = 0 ⇔ TIR = r."], ["Si la tasa de descuento sube, el VAN de un proyecto normal:", ["Sube", "Baja", "No cambia", "Se vuelve la TIR"], 1, "Los flujos futuros valen menos hoy."], ["Entre dos proyectos excluyentes se elige el de:", ["Mayor TIR siempre", "Mayor VAN", "Menor inversión", "Menor PRI siempre"], 1, "El VAN mide la riqueza creada."]],
    dec:"invertir o no, y cuál proyecto elegir entre varios.",
    rel:["flujo-caja", "tasas", "wacc", "equivalencias"] };

  CSIM.van = { title:"Perfil del VAN: dónde cruza el cero",
    goal:"cómo el VAN baja al subir la tasa y por qué la TIR es el punto donde la curva cruza el cero.",
    params:[{ k:"r", l:"Tasa de descuento", min:0, max:30, step:0.5, v:12, u:"%", help:"Rentabilidad exigida." }, { k:"fx", l:"Flujos de ingreso (escenario)", min:70, max:130, step:5, v:100, u:"%", help:"100 % = caso base; 80 % = pesimista." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.8); },
    F(p){ return FV.map((f, t) => t ? f * p.fx / 100 : f); },
    draw(g, W, H, s, p, C){ const F = this.F(p), x0 = 60, x1 = W - 14, y0 = H - 30, top = 16, X = r => x0 + r / 0.3 * (x1 - x0), Y = v => top + (700e6 - v) / 1100e6 * (y0 - top);
      SIMG.axes(g, x0, y0, x1, top, C, "", "VAN (MM$)"); g.strokeStyle = C.line; g.beginPath(); g.moveTo(x0, Y(0)); g.lineTo(x1, Y(0)); g.stroke();
      [-400e6, 0, 400e6].forEach(v => SIMG.text(g, n(v / 1e6), x0 - 4, Y(v) + 4, C.muted, C, "right")); [0, 0.1, 0.2].forEach(r => SIMG.text(g, n(r * 100) + " %", X(r), y0 + 14, C.muted, C, "center"));
      g.strokeStyle = C.c1; g.lineWidth = 2.5; g.beginPath(); const K = Math.round(150 * s.t); for (let i = 0; i <= K; i++) { const r = i / 150 * 0.3, y = Y(npv(r, F)); i ? g.lineTo(X(r), y) : g.moveTo(X(r), y); } g.stroke();
      const T = irr(F); if (isFinite(T) && T < 0.3) { g.fillStyle = C.ink; g.beginPath(); g.arc(X(T), Y(0), 5, 0, 7); g.fill(); SIMG.text(g, "TIR " + P(T), X(T) + 6, Y(0) - 8, C.ink, C, "left", true); }
      const v = npv(p.r / 100, F); g.fillStyle = v >= 0 ? C.ok : C.bad; g.beginPath(); g.arc(X(p.r / 100), Y(v), 6, 0, 7); g.fill(); g.strokeStyle = g.fillStyle; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(X(p.r / 100), Y(v)); g.lineTo(X(p.r / 100), Y(0)); g.stroke(); g.setLineDash([]); },
    metrics(s, p){ const F = this.F(p), T = irr(F); return [["VAN a " + p.r + " %", M(npv(p.r / 100, F))], ["TIR", P(T)], ["IVAN", n(npv(p.r / 100, F) / 1e9, 3)], ["Decisión", npv(p.r / 100, F) >= 0 ? "Conviene" : "No conviene"]]; },
    ann(s, p){ return "La curva azul es el VAN para cada tasa. El punto de color es tu tasa: verde si el VAN es positivo. La TIR es donde la curva cruza el cero."; },
    concl(s, p){ const F = this.F(p); return "<p>Con flujos al " + p.fx + " % del caso base, la TIR es " + P(irr(F)) + ".</p><p><b>Qué demuestra:</b> el VAN depende de la tasa; mientras la tasa exigida esté bajo la TIR, el proyecto conviene.</p><p><b>Qué decisión informa:</b> invertir o no, y cuánto pueden caer los flujos antes de que deje de convenir.</p>"; } };

  /* ===================== EQUIVALENCIAS ===================== */
  CRS.equivalencias = {
    kw:"equivalencias factores de interes valor presente valor futuro anualidad serie uniforme gradiente p/a f/p a/p a/f",
    ess:{ pts:["Seis factores permiten mover dinero en el tiempo: de presente (P) a futuro (F) y a series de cuotas iguales (A).", "<b>F = P·(1 + i)ⁿ</b> y su inverso <b>P = F ÷ (1 + i)ⁿ</b>.", "Una serie de n cuotas A vale hoy <b>P = A·[(1 + i)ⁿ − 1] ÷ [i(1 + i)ⁿ]</b>.", "La tasa y los períodos deben estar en la misma unidad (meses con tasa mensual)."],
      fx:"F = P(1 + i)ⁿ;   P = A · [(1 + i)ⁿ − 1] ÷ [i(1 + i)ⁿ];   A = P · i(1 + i)ⁿ ÷ [(1 + i)ⁿ − 1]", when:"necesitas comparar montos de distintas fechas: cuotas, ahorros, arriendos, pagos futuros." },
    intro:{ prob:"<p>Un arriendo de maquinaria cuesta $ 250.000 al mes durante 24 meses. Con tasa 1,5 % mensual, ¿cuánto equivale pagar todo hoy?</p>",
      anal:"<p>Es como preguntar cuánto tendrías que depositar hoy en una cuenta para poder sacar $ 250.000 cada mes durante 2 años hasta dejarla en cero.</p>",
      terms:[["P", "Valor presente (hoy)."], ["F", "Valor futuro (al final)."], ["A", "Cuota igual en cada período."], ["i", "Tasa de interés por período."], ["n", "Número de períodos."], ["(P/A, i, n)", "Notación: «P dado A»: factor que multiplica a A para obtener P."], ["G", "Gradiente: aumento constante de la cuota cada período."]] },
    adv:"<p><b>Diagrama de flujo:</b> dibujar una línea de tiempo con flechas hacia arriba (entradas) y abajo (salidas) evita la mayoría de los errores. <b>Anualidad anticipada:</b> si las cuotas son al inicio de cada período, multiplicar por (1 + i).</p>",
    sp:{ title:"Serie uniforme a valor presente, paso a paso", params:[{ k:"A", l:"Cuota", v:250000, u:"$" }, { k:"i", l:"Tasa por período", v:1.5, u:"%" }, { k:"N", l:"Períodos", v:24, u:"" }],
      script(p){ const i = p.i / 100, f = Math.pow(1 + i, p.N), pa = (f - 1) / (i * f);
        return [
          { t:"Dato", e:"A = " + M(p.A) + ";  i = " + n(i, 4) + ";  n = " + p.N, s:"Tasa y períodos en la misma unidad." },
          { t:"(1 + i)ⁿ", e:"(1 + " + n(i, 4) + ")^" + p.N + " = " + n(f, 6), s:"Cuánto crece un peso en n períodos." },
          { t:"Factor", e:"(P/A) = (" + n(f, 6) + " − 1) ÷ (" + n(i, 4) + " · " + n(f, 6) + ") = " + n(pa, 6), h:n(pa, 6), s:"Las 24 cuotas valen hoy como " + n(pa, 2) + " cuotas." },
          { t:"P", e:"P = " + M(p.A) + " · " + n(pa, 6) + " = " + M(p.A * pa), h:M(p.A * pa), s:"Pagar todo hoy equivale a ese monto." },
          { t:"Comparar", e:"Suma simple de cuotas = " + M(p.A * p.N), s:"La diferencia (" + M(p.A * p.N - p.A * pa) + ") es el interés del dinero en el tiempo." }]; } },
    vars:[["P", "Valor presente", "$", "—"], ["F", "Valor futuro", "$", "—"], ["A", "Cuota uniforme", "$/período", "—"], ["G", "Gradiente", "$/período", "—"], ["i", "Tasa por período", "%", "—"], ["n", "Número de períodos", "períodos", "—"]],
    sup:"<ul><li>Tasa constante en todo el horizonte.</li><li>Cuotas al final de cada período (vencidas).</li></ul>",
    ex:{ t:"Arriendo de $ 250.000 mensuales por 24 meses; tasa 1,5 % mensual.",
      steps:[["Identifico: conozco A, busco P.", "Elegir el factor.", "Factor (P/A, 1,5 %, 24).", "Se trae una serie a hoy."], ["Calculo el factor.", "Fórmula de la serie.", "20,0304.", "24 cuotas valen como 20 hoy."], ["Multiplico.", "P = A × factor.", "$ 5.007.601.", "Pagar hoy $ 5,0 MM equivale a las 24 cuotas."]],
      r:"equivale a pagar $ 5.007.601 hoy (contra $ 6.000.000 sumando las cuotas sin interés)." },
    real:"<p>Se usa para comparar ofertas de crédito, leasing vs compra, pago contado vs cuotas, y para calcular cuánto ahorrar al mes para una meta (factor A/F). Excel: VA, VF y PAGO.</p>",
    sim:"eqv",
    chk(){ const i = 0.015, k = 24; return [["P/A", (1 - Math.pow(1 + i, -k)) / i, 20.030405], ["P", 250000 * (1 - Math.pow(1 + i, -k)) / i, 250000 / AP(i, k)]]; },
    quiz:[["Si la tasa sube, el valor presente de una serie de cuotas:", ["Sube", "Baja", "No cambia", "Se duplica"], 1, "Los pagos futuros se descuentan más."], ["Para saber cuánto ahorrar al mes para juntar F en n meses se usa:", ["(P/F)", "(A/F)", "(F/P)", "(P/G)"], 1, "Fondo de amortización: A dado F."], ["Con tasa anual 12 % y cuotas mensuales, hay que usar:", ["n en años e i = 12 %", "n en meses e i mensual", "cualquier combinación", "solo n en años"], 1, "Tasa y período siempre en la misma unidad."]],
    dec:"comparar alternativas de pago y calcular cuotas, ahorros y valores equivalentes.",
    rel:["tasas", "amortizacion", "van-tir", "caue"] };

  CSIM.eqv = { title:"Diagrama de flujo: una serie de cuotas traída a hoy",
    goal:"cuánto vale hoy cada cuota según su fecha, y por qué la suma descontada es menor que la suma simple.",
    params:[{ k:"i", l:"Tasa por período", min:0, max:5, step:0.1, v:1.5, u:"%", help:"Tasa mensual." }, { k:"N", l:"Número de cuotas", min:6, max:60, step:1, v:24, u:"", help:"Meses." }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.6); },
    draw(g, W, H, s, p, C){ const i = p.i / 100, x0 = 40, x1 = W - 14, y0 = H * 0.55, bw = (x1 - x0) / (p.N + 1), A = 250000, sc = (H * 0.4) / A;
      g.strokeStyle = C.line; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y0); g.stroke();
      for (let t = 1; t <= p.N; t++) { const x = x0 + t * bw, pv = A * PF(i, t); bar(g, x - bw * 0.35, y0, bw * 0.7, -A * sc, C.line); bar(g, x - bw * 0.35, y0, bw * 0.7, -pv * sc * s.t, C.c1); }
      const Pv = i ? A * (1 - Math.pow(1 + i, -p.N)) / i : A * p.N, hP = Math.min(H * 0.4, Pv / (A * p.N) * H * 0.4); bar(g, x0 - bw * 0.35, y0, bw * 0.9 + 6, hP * s.t, C.c2);
      SIMG.text(g, "P = " + M(Pv), x0, y0 + hP + 16, C.ink, C, "left", true); SIMG.text(g, "cuotas: gris = nominal, azul = valor de hoy", x0 + 4, 16, C.muted, C, "left"); SIMG.text(g, "mes " + p.N, x1, y0 + 14, C.muted, C, "right"); },
    metrics(s, p){ const i = p.i / 100, Pv = i ? 250000 * (1 - Math.pow(1 + i, -p.N)) / i : 250000 * p.N; return [["Suma simple", M(250000 * p.N)], ["Valor presente P", M(Pv)], ["(P/A, i, n)", n(Pv / 250000, 4)], ["Última cuota vale hoy", M(250000 * PF(i, p.N))]]; },
    ann(s, p){ return "Cada barra azul es lo que vale hoy esa cuota: las más lejanas valen menos. La barra naranja hacia abajo es P, la suma de todas las azules."; },
    concl(s, p){ return "<p>Con " + p.i + " % mensual y " + p.N + " cuotas, P es el " + n((p.i ? (1 - Math.pow(1 + p.i / 100, -p.N)) / (p.i / 100) : p.N) / p.N * 100, 1) + " % de la suma simple.</p><p><b>Qué demuestra:</b> el dinero futuro vale menos hoy; más tasa o más plazo, más diferencia.</p><p><b>Qué decisión informa:</b> si conviene pagar al contado o en cuotas.</p>"; } };

  /* ===================== TASAS ===================== */
  CRS.tasas = {
    kw:"tasas de interes nominal efectiva anual tea tna capitalizacion tasa real fisher inflacion tasa periodica continua",
    ess:{ pts:["La <b>tasa nominal</b> (TNA) es un «nombre»: se divide por las capitalizaciones del año para obtener la tasa del período.", "La <b>tasa efectiva anual</b> (TEA) es lo que realmente se gana o paga en un año: TEA = (1 + TNA ÷ m)ᵐ − 1.", "Más capitalizaciones ⇒ mayor TEA, con un límite (capitalización continua).", "La <b>tasa real</b> descuenta la inflación: (1 + nominal) = (1 + real)(1 + inflación)."],
      fx:"i_p = TNA ÷ m;   TEA = (1 + i_p)ᵐ − 1;   real = (1 + TEA) ÷ (1 + π) − 1", when:"comparas créditos o inversiones con tasas expresadas de distinta forma, o separas el efecto de la inflación." },
    intro:{ prob:"<p>Un banco ofrece un crédito al «12 % anual capitalizable mensualmente». ¿Cuál es el costo real del año? Si la inflación es 4 %, ¿cuánto se paga en términos reales?</p>",
      anal:"<p>Si te pagan interés cada mes, el interés del mes siguiente también gana interés («interés sobre interés»). Por eso 1 % mensual durante 12 meses da algo más de 12 % al año.</p>",
      terms:[["TNA", "Tasa nominal anual."], ["m", "Capitalizaciones por año (12 mensual, 4 trimestral)."], ["i_p", "Tasa del período = TNA ÷ m."], ["TEA", "Tasa efectiva anual."], ["π", "Inflación."], ["Tasa real", "Rentabilidad en poder de compra."], ["CAE", "Carga anual equivalente: tasa efectiva con gastos (exigida en Chile)."]] },
    adv:"<p><b>Capitalización continua:</b> TEA = e^TNA − 1 (para 12 %: 12,75 %). <b>Fisher aproximado:</b> real ≈ nominal − inflación (solo para tasas bajas). <b>UF:</b> los créditos en UF ya están en términos reales.</p>",
    sp:{ title:"De nominal a efectiva y a real", params:[{ k:"T", l:"Tasa nominal anual", v:12, u:"%" }, { k:"m", l:"Capitalizaciones por año", v:12, u:"" }, { k:"pi", l:"Inflación", v:4, u:"%" }],
      script(p){ const ip = p.T / 100 / p.m, E = Math.pow(1 + ip, p.m) - 1, R = (1 + E) / (1 + p.pi / 100) - 1;
        return [
          { t:"Tasa del período", e:"i_p = " + n(p.T, 2) + " % ÷ " + p.m + " = " + n(ip * 100, 4) + " %", h:n(ip * 100, 4) + " %", s:"Es la tasa que se cobra en cada período." },
          { t:"Componer", e:"TEA = (1 + " + n(ip, 6) + ")^" + p.m + " − 1", s:"Se acumula el interés sobre el interés." },
          { t:"TEA", e:"TEA = " + n(E * 100, 3) + " %", h:n(E * 100, 3) + " %", s:"Es el costo verdadero del año (mayor que el nominal)." },
          { t:"Fisher", e:"real = (1 + " + n(E, 6) + ") ÷ (1 + " + n(p.pi / 100, 2) + ") − 1", s:"Se descuenta la inflación." },
          { t:"Real", e:"real = " + n(R * 100, 3) + " %", h:n(R * 100, 3) + " %", s:"Lo que se paga en poder de compra." }]; } },
    vars:[["TNA", "Tasa nominal anual", "%", "—"], ["m", "Capitalizaciones por año", "veces", "1 a 365"], ["i_p", "Tasa del período", "%", "—"], ["TEA", "Tasa efectiva anual", "%", "≥ TNA"], ["π", "Inflación anual", "%", "Chile: meta 3 %"], ["real", "Tasa real", "%", "—"]],
    sup:"<ul><li>La tasa se mantiene en todo el año.</li><li>No incluye comisiones ni seguros (para eso, la CAE).</li></ul>",
    ex:{ t:"Crédito al 12 % anual capitalizable mensualmente; inflación esperada 4 %.",
      steps:[["Divido por 12.", "Tasa mensual.", "1 % mensual.", "Es lo que se cobra cada mes."], ["Compongo 12 meses.", "Interés sobre interés.", "TEA = 12,683 %.", "El costo real del año supera el 12 % anunciado."], ["Aplico Fisher.", "Quitar inflación.", "Real = 8,349 %.", "En poder de compra se paga 8,3 % anual."]],
      r:"el crédito cuesta 12,683 % efectivo anual, que equivale a 8,349 % real con 4 % de inflación." },
    real:"<p>En Chile la ley exige informar la <b>CAE</b> en todo crédito de consumo para que se pueda comparar. Los depósitos a plazo se publican con tasa mensual o a 30 días; los créditos hipotecarios, con tasa anual en UF (real).</p>",
    sim:"tea",
    chk(){ return [["TEA", Math.pow(1.01, 12) - 1, Math.exp(12 * Math.log(1.01)) - 1], ["real", Math.pow(1.01, 12) / 1.04 - 1, (Math.pow(1.01, 12) - 1.04) / 1.04]]; },
    quiz:[["24 % anual capitalizable trimestralmente equivale a una tasa trimestral de:", ["24 %", "6 %", "2 %", "8 %"], 1, "24 ÷ 4 = 6 %."], ["Con la misma TNA, ¿qué capitalización da mayor TEA?", ["Anual", "Semestral", "Mensual", "Diaria"], 3, "Más capitalizaciones, más interés compuesto."], ["Un depósito rinde 5 % y la inflación es 5 %. La tasa real es:", ["5 %", "0 %", "10 %", "−5 %"], 1, "(1,05 ÷ 1,05) − 1 = 0."]],
    dec:"qué crédito o inversión es realmente más barato o rentable.",
    rel:["equivalencias", "amortizacion", "van-tir"] };

  CSIM.tea = { title:"Interés sobre interés: la TEA según cuántas veces se capitaliza",
    goal:"por qué la misma tasa nominal rinde más si se capitaliza más seguido, y que existe un límite.",
    params:[{ k:"T", l:"Tasa nominal anual", min:1, max:60, step:1, v:12, u:"%", help:"La tasa «de nombre»." }, { k:"pi", l:"Inflación", min:0, max:15, step:0.5, v:4, u:"%", help:"Para la tasa real." }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.8); },
    MS:[[1, "anual"], [2, "semestral"], [4, "trimestral"], [12, "mensual"], [52, "semanal"], [365, "diaria"]],
    draw(g, W, H, s, p, C){ const x0 = 50, x1 = W - 14, y0 = H - 40, top = 36, T = p.T / 100, cont = Math.exp(T) - 1, lo = T * 0.98, hi = cont + (cont - T) * 0.25, Y = v => y0 - (v - lo) / (hi - lo) * (y0 - top), bw = (x1 - x0) / this.MS.length;
      SIMG.axes(g, x0, y0, x1, top, C, "", "TEA (escala ampliada)"); SIMG.hline(g, x0, x1, Y(cont), C.c2, [5, 4], "", C); SIMG.text(g, "- - límite continuo " + P(cont), x1, 14, C.c2, C, "right", true);
      this.MS.forEach(([m, l], k) => { const E = Math.pow(1 + T / m, m) - 1, x = x0 + k * bw + bw * 0.15, h = (y0 - Y(E)) * s.t; bar(g, x, y0, bw * 0.7, -h, C.c1); if (h > 22) SIMG.text(g, n(E * 100, 2), x + bw * 0.35, y0 - h + 16, C.surf, C, "center", true); SIMG.text(g, l, x + bw * 0.35, y0 + 14, C.muted, C, "center"); });
      [lo, (lo + hi) / 2].forEach(v => SIMG.text(g, n(v * 100, 1), x0 - 4, Y(v) + 4, C.muted, C, "right")); },
    metrics(s, p){ const T = p.T / 100, E = Math.pow(1 + T / 12, 12) - 1; return [["TEA mensual", P(E)], ["TEA diaria", P(Math.pow(1 + T / 365, 365) - 1)], ["Límite continuo", P(Math.exp(T) - 1)], ["Real (mensual)", P((1 + E) / (1 + p.pi / 100) - 1)]]; },
    ann(s, p){ return p.T >= 30 ? "Con tasas altas la diferencia entre nominal y efectiva es grande: por eso la ley obliga a informar la tasa efectiva (CAE)." : "Las barras suben con cada capitalización extra, pero cada vez menos: se acercan a la línea naranja (capitalización continua)."; },
    concl(s, p){ const T = p.T / 100; return "<p>Con " + p.T + " % nominal, la TEA va de " + P(T) + " (anual) a " + P(Math.exp(T) - 1) + " (continua).</p><p><b>Qué demuestra:</b> la frecuencia de capitalización cambia el costo real; la tasa nominal sola no basta para comparar.</p><p><b>Qué decisión informa:</b> comparar ofertas siempre en tasa efectiva.</p>"; } };

  /* ===================== AMORTIZACIÓN ===================== */
  const cuota = (Mo, i, k) => Mo * i / (1 - Math.pow(1 + i, -k));
  const tabla = (Mo, i, k, al) => { const R = []; let S = Mo; const C = cuota(Mo, i, k); for (let t = 1; t <= k; t++) { const I = S * i, Am = al ? Mo / k : C - I; R.push([I, Am]); S -= Am; } return R; };
  CRS.amortizacion = {
    kw:"amortizacion credito prestamo cuota fija sistema frances aleman tabla de amortizacion interes saldo insoluto",
    ess:{ pts:["Cada cuota tiene dos partes: <b>interés</b> (sobre el saldo que se debe) y <b>amortización</b> (lo que baja la deuda).", "<b>Sistema francés:</b> cuota fija; al principio casi todo es interés.", "<b>Sistema alemán:</b> amortización fija; la cuota baja con el tiempo.", "Interés del período = saldo × tasa; saldo nuevo = saldo − amortización."],
      fx:"C = M · i ÷ [1 − (1 + i)⁻ⁿ];   Iₜ = Sₜ₋₁ · i;   Aₜ = C − Iₜ", when:"pides o evalúas un crédito, un leasing o el financiamiento de un proyecto." },
    intro:{ prob:"<p>Una pyme pide $ 25 millones a 48 meses con tasa 1,1 % mensual, sistema francés. ¿Cuánto paga cada mes y cuánto paga en intereses en total?</p>",
      anal:"<p>Con el dividendo de una casa pasa lo mismo: los primeros años casi todo lo que pagas es interés, y la deuda baja muy lento. Hacia el final, casi todo es capital.</p>",
      terms:[["M", "Monto del crédito."], ["i", "Tasa por período."], ["n", "Número de cuotas."], ["C", "Cuota."], ["Iₜ", "Interés del período t."], ["Aₜ", "Amortización: parte que reduce la deuda."], ["Saldo insoluto", "Lo que aún se debe."]] },
    adv:"<p><b>Prepago:</b> abonar al capital al principio ahorra mucho interés (el interés se calcula sobre el saldo). <b>En impuestos:</b> los intereses son gasto deducible; la amortización no. Por eso en el flujo de caja se separan.</p>",
    sp:{ title:"Cuota francesa y primera fila de la tabla", params:[{ k:"Mo", l:"Monto", v:25000000, u:"$" }, { k:"i", l:"Tasa mensual", v:1.1, u:"%" }, { k:"N", l:"Plazo", v:48, u:"meses" }],
      script(p){ const i = p.i / 100, C = cuota(p.Mo, i, p.N), I1 = p.Mo * i;
        return [
          { t:"Fórmula", e:"C = M · i ÷ [1 − (1 + i)⁻ⁿ]", s:"La cuota que, con interés, deja la deuda en cero al final." },
          { t:"Sustituir", e:"C = " + M(p.Mo) + " · " + n(i, 4) + " ÷ [1 − " + n(1 + i, 3) + "^−" + p.N + "]", s:"" },
          { t:"Cuota", e:"C = " + M(C), h:M(C), s:"Se paga igual todos los meses." },
          { t:"Mes 1", e:"Interés = " + M(p.Mo) + " · " + n(i, 4) + " = " + M(I1) + ";  amortización = " + M(C - I1), h:M(C - I1), s:"Solo esa parte reduce la deuda." },
          { t:"Saldo", e:"Saldo = " + M(p.Mo) + " − " + M(C - I1) + " = " + M(p.Mo - C + I1), s:"El interés del mes 2 se calcula sobre este saldo." },
          { t:"Total", e:"Intereses totales = " + M(C) + " · " + p.N + " − " + M(p.Mo) + " = " + M(C * p.N - p.Mo), h:M(C * p.N - p.Mo), s:"El costo del financiamiento." }]; } },
    vars:[["M", "Monto del préstamo", "$", "—"], ["i", "Tasa por período", "%", "—"], ["n", "Número de cuotas", "períodos", "—"], ["C", "Cuota", "$", "—"], ["Iₜ", "Interés del período", "$", "—"], ["Aₜ", "Amortización del período", "$", "—"], ["Sₜ", "Saldo al final del período", "$", "llega a 0"]],
    sup:"<ul><li>Tasa fija todo el plazo.</li><li>No incluye seguros ni comisiones.</li></ul>",
    ex:{ t:"Crédito $ 25.000.000; 1,1 % mensual; 48 meses; francés.",
      steps:[["Calculo la cuota.", "Fórmula francesa.", "$ 673.172.", "Pago fijo mensual."], ["Separo el mes 1.", "Interés sobre el saldo.", "Interés $ 275.000; amortización $ 398.172.", "El 41 % de la primera cuota es interés."], ["Calculo el total.", "Costo del crédito.", "Intereses $ 7.312.241.", "Se paga 29 % más que lo prestado."]],
      r:"cuota $ 673.172 mensual; en total se pagan $ 32.312.241, de los cuales $ 7.312.241 son intereses." },
    real:"<p>Los créditos hipotecarios y de consumo en Chile usan sistema francés. Las tablas de amortización deben entregarse al cliente. El sistema alemán se usa en algunos créditos comerciales y en financiamiento de proyectos.</p>",
    sim:"amo",
    chk(){ const i = 0.011, C = cuota(25e6, i, 48); return [["C", C, 25e6 * i * Math.pow(1 + i, 48) / (Math.pow(1 + i, 48) - 1)], ["Intereses", tabla(25e6, i, 48).reduce((s, r) => s + r[0], 0), C * 48 - 25e6]]; },
    quiz:[["En el sistema francés, a medida que pasan los meses, el interés de cada cuota:", ["Sube", "Baja", "Es constante", "Es cero"], 1, "Se calcula sobre un saldo cada vez menor."], ["En el sistema alemán, la cuota:", ["Es fija", "Baja con el tiempo", "Sube con el tiempo", "Es solo interés"], 1, "La amortización es fija y el interés baja."], ["Para ahorrar más intereses, un prepago conviene hacerlo:", ["Al final", "Al principio", "Da lo mismo", "Nunca"], 1, "Reduce el saldo sobre el que se calculan todos los intereses futuros."]],
    dec:"elegir plazo y sistema de crédito, y planificar prepagos.",
    rel:["equivalencias", "tasas", "flujo-caja"] };

  CSIM.amo = { title:"Tabla de amortización: interés vs capital en cada cuota",
    goal:"cómo cambia la composición de la cuota mes a mes y cuánto interés se paga según tasa, plazo y sistema.",
    params:[{ k:"i", l:"Tasa mensual", min:0.3, max:3, step:0.1, v:1.1, u:"%", help:"" }, { k:"N", l:"Plazo", min:12, max:120, step:6, v:48, u:"meses", help:"" }, { k:"al", l:"Sistema", min:0, max:1, step:1, v:0, fmt:v => v ? "alemán" : "francés", u:"", help:"Francés: cuota fija. Alemán: amortización fija." }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.7); },
    draw(g, W, H, s, p, C){ const R = tabla(25e6, p.i / 100, p.N, p.al), x0 = 56, x1 = W - 14, y0 = H - 30, top = 36, mx = Math.max(...R.map(r => r[0] + r[1])) * 1.1, bw = (x1 - x0) / p.N, K = Math.ceil(p.N * s.t), Y = v => (y0 - top) * v / mx;
      SIMG.axes(g, x0, y0, x1, top, C, "", "Cuota ($)"); [0, mx / 2.2, mx / 1.1].forEach(v => SIMG.text(g, n(v / 1e3) + " mil", x0 - 4, y0 - Y(v) + 4, C.muted, C, "right"));
      for (let t = 0; t < K; t++) { const x = x0 + t * bw; bar(g, x, y0, Math.max(1, bw - 1), -Y(R[t][1]), C.c1); bar(g, x, y0 - Y(R[t][1]), Math.max(1, bw - 1), -Y(R[t][0]), C.c3); }
      SIMG.text(g, "■ interés", x1, 14, C.c3, C, "right", true); SIMG.text(g, "■ amortización", x1 - 70, 14, C.c1, C, "right", true); SIMG.text(g, "mes 1", x0, y0 + 14, C.muted, C, "left"); SIMG.text(g, "mes " + p.N, x1, y0 + 14, C.muted, C, "right"); },
    metrics(s, p){ const R = tabla(25e6, p.i / 100, p.N, p.al), I = R.reduce((a, r) => a + r[0], 0); return [["Primera cuota", M(R[0][0] + R[0][1])], ["Última cuota", M(R[p.N - 1][0] + R[p.N - 1][1])], ["Intereses totales", M(I)], ["Interés / monto", n(I / 25e6 * 100, 1) + " %"]]; },
    ann(s, p){ return p.al ? "Sistema alemán: la parte azul (capital) es igual todos los meses y el interés baja, así que la cuota baja." : "Sistema francés: la cuota total es igual, pero al principio la parte roja (interés) es mucho mayor."; },
    concl(s, p){ const I = tabla(25e6, p.i / 100, p.N, p.al).reduce((a, r) => a + r[0], 0); return "<p>Para $ 25 MM a " + p.N + " meses y " + p.i + " %, los intereses suman " + M(I) + ".</p><p><b>Qué demuestra:</b> el plazo largo baja la cuota pero sube mucho el interés total; el alemán paga menos interés que el francés.</p><p><b>Qué decisión informa:</b> plazo, sistema y conveniencia de prepagar.</p>"; } };

  /* ===================== DEPRECIACIÓN ===================== */
  const dep = (Co, VR, k) => { const L = [], S = [], D = []; let vl = Co; const sd = k * (k + 1) / 2; let vs = Co, vd = Co; for (let t = 1; t <= k; t++) { L.push(Co - (Co - VR) / k * t); vs -= (Co - VR) * (k - t + 1) / sd; S.push(vs); let d = vd * 2 / k; if (vd - d < VR) d = vd - VR; vd -= d; D.push(vd); } return { L, S, D }; };
  CRS.depreciacion = {
    kw:"depreciacion lineal linea recta suma de digitos doble saldo decreciente valor libro valor residual vida util activo",
    ess:{ pts:["La <b>depreciación</b> reparte el costo de un activo durante su vida útil: es un gasto contable que no sale de la caja.", "<b>Lineal:</b> el mismo monto cada año, (C − VR) ÷ n.", "<b>Acelerada</b> (suma de dígitos, doble saldo): más al principio, menos al final.", "Reduce la utilidad y por eso el impuesto: es un «escudo tributario»."],
      fx:"D = (C − VR) ÷ n;   D_t(SDA) = (C − VR) · (n − t + 1) ÷ [n(n + 1) ÷ 2];   D_t(DSD) = (2 ÷ n) · VL_{t−1}", when:"armas un flujo de caja, calculas impuestos o el valor libro de un activo." },
    intro:{ prob:"<p>Una máquina cuesta $ 60 millones, dura 6 años y al final se venderá en $ 6 millones. ¿Cuánto se deprecia cada año según cada método?</p>",
      anal:"<p>Un auto nuevo pierde valor año a año. La depreciación contable es una forma ordenada de registrar esa pérdida, aunque no coincida exactamente con el precio de mercado.</p>",
      terms:[["C", "Costo del activo."], ["VR", "Valor residual al final de la vida útil."], ["n", "Vida útil."], ["Base depreciable", "C − VR."], ["Valor libro (VL)", "Costo menos depreciación acumulada."], ["Escudo tributario", "Ahorro de impuesto = t × D."]] },
    adv:"<p>En Chile el SII publica una tabla de vidas útiles y permite depreciación acelerada (vida útil a un tercio) en ciertos casos. Para evaluación de proyectos, la depreciación se resta para calcular impuestos y luego se suma de vuelta porque no es salida de dinero.</p>",
    sp:{ title:"Tres métodos, año 1", params:[{ k:"Co", l:"Costo", v:60000000, u:"$" }, { k:"VR", l:"Valor residual", v:6000000, u:"$" }, { k:"N", l:"Vida útil", v:6, u:"años" }],
      script(p){ const B = p.Co - p.VR, sd = p.N * (p.N + 1) / 2;
        return [
          { t:"Base", e:"Base = " + M(p.Co) + " − " + M(p.VR) + " = " + M(B), s:"Lo que se reparte en la vida útil." },
          { t:"Lineal", e:"D = " + M(B) + " ÷ " + p.N + " = " + M(B / p.N) + " por año", h:M(B / p.N), s:"Igual todos los años." },
          { t:"SDA", e:"Suma de dígitos = " + p.N + " · " + (p.N + 1) + " ÷ 2 = " + sd + ";  D₁ = " + M(B) + " · " + p.N + "/" + sd + " = " + M(B * p.N / sd), h:M(B * p.N / sd), s:"El año 1 recibe la mayor fracción." },
          { t:"Doble saldo", e:"Tasa = 2 ÷ " + p.N + " = " + n(200 / p.N, 1) + " %;  D₁ = " + M(p.Co) + " · " + n(2 / p.N, 4) + " = " + M(p.Co * 2 / p.N), h:M(p.Co * 2 / p.N), s:"Se aplica sobre el valor libro (sin restar VR), sin bajar del residual." },
          { t:"Impuesto", e:"Ahorro año 1 (lineal, 27 %) = 0,27 · " + M(B / p.N) + " = " + M(0.27 * B / p.N), s:"La depreciación baja el impuesto aunque no sea un pago." }]; } },
    vars:[["C", "Costo de adquisición", "$", "—"], ["VR", "Valor residual", "$", "—"], ["n", "Vida útil", "años", "tabla SII"], ["Dₜ", "Depreciación del año t", "$", "—"], ["VLₜ", "Valor libro al final del año t", "$", "≥ VR"], ["t", "Tasa de impuesto", "%", "27 % régimen general"]],
    sup:"<ul><li>Vida útil y residual estimados.</li><li>El método se mantiene durante toda la vida del activo.</li></ul>",
    ex:{ t:"Máquina de $ 60 MM, residual $ 6 MM, 6 años.",
      steps:[["Lineal.", "Método simple.", "$ 9.000.000 por año.", "Valor libro baja parejo."], ["Suma de dígitos.", "Acelerado.", "Año 1: $ 15.428.571.", "Más gasto al principio."], ["Doble saldo decreciente.", "Más acelerado.", "Año 1: $ 20.000.000.", "Un tercio del costo en el primer año."]],
      r:"lineal $ 9 MM anuales; con métodos acelerados se deprecia más al inicio, lo que adelanta el ahorro de impuesto." },
    real:"<p>La depreciación acelerada es un incentivo tributario: no cambia el total depreciado, pero adelanta el ahorro de impuesto, y eso tiene valor por el dinero en el tiempo.</p>",
    sim:"dep",
    chk(){ const d = dep(60e6, 6e6, 6); return [["Lineal 1", 60e6 - d.L[0], 9e6], ["SDA 1", 60e6 - d.S[0], 54e6 * 6 / 21], ["DSD 1", 60e6 - d.D[0], 20e6]]; },
    quiz:[["La depreciación es una salida de caja:", ["Sí, cada año", "No: es un gasto contable", "Solo el primer año", "Solo si es acelerada"], 1, "El dinero salió al comprar el activo."], ["Con depreciación acelerada, los impuestos de los primeros años:", ["Suben", "Bajan", "No cambian", "Desaparecen"], 1, "Más gasto ⇒ menos utilidad ⇒ menos impuesto."], ["En lineal con C = 10, VR = 2 y n = 4, D anual es:", ["2,5", "2", "3", "8"], 1, "(10 − 2) ÷ 4 = 2."]],
    dec:"cómo registrar activos y cuánto impuesto se paga cada año.",
    rel:["flujo-caja", "vida-economica"] };

  CSIM.dep = { title:"Valor libro según el método de depreciación",
    goal:"cómo cada método baja el valor libro a distinto ritmo, aunque todos terminen en el valor residual.",
    params:[{ k:"VR", l:"Valor residual", min:0, max:20, step:1, v:6, u:"MM$", help:"Costo fijo: $ 60 MM." }, { k:"N", l:"Vida útil", min:3, max:12, step:1, v:6, u:"años", help:"" }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.7); },
    draw(g, W, H, s, p, C){ const d = dep(60e6, p.VR * 1e6, p.N), x0 = 50, x1 = W - 14, y0 = H - 30, top = 20, X = t => x0 + t / p.N * (x1 - x0), Y = v => y0 - v / 62e6 * (y0 - top), K = p.N * s.t;
      SIMG.axes(g, x0, y0, x1, top, C, "", "Valor libro (MM$)"); [0, 30e6, 60e6].forEach(v => SIMG.text(g, n(v / 1e6), x0 - 4, Y(v) + 4, C.muted, C, "right")); SIMG.text(g, "año 0", x0, y0 + 14, C.muted, C, "left"); SIMG.text(g, "año " + p.N, x1, y0 + 14, C.muted, C, "right");
      SIMG.hline(g, x0, x1, Y(p.VR * 1e6), C.muted, [3, 3], "", C);
      [[d.L, C.c1, "lineal"], [d.S, C.c2, "suma de dígitos"], [d.D, C.c3, "doble saldo"]].forEach(([A, c, l], k) => { g.strokeStyle = c; g.lineWidth = 2.5; g.beginPath(); g.moveTo(X(0), Y(60e6)); for (let t = 1; t <= Math.ceil(K); t++) g.lineTo(X(t), Y(A[t - 1])); g.stroke(); SIMG.text(g, "■ " + l, x1 - 4, top + 14 + k * 16, c, C, "right", true); }); },
    metrics(s, p){ const d = dep(60e6, p.VR * 1e6, p.N); return [["Lineal año 1", M(60e6 - d.L[0])], ["SDA año 1", M(60e6 - d.S[0])], ["Doble saldo año 1", M(60e6 - d.D[0])], ["Valor libro año 2 (lineal / DSD)", n(d.L[1] / 1e6, 1) + " / " + n(d.D[1] / 1e6, 1) + " MM"]]; },
    ann(s, p){ return "Las curvas que bajan más rápido son los métodos acelerados. Todas llegan al valor residual (línea punteada)."; },
    concl(s, p){ return "<p>Con " + p.N + " años y residual $ " + p.VR + " MM, todos los métodos deprecian lo mismo en total.</p><p><b>Qué demuestra:</b> cambia el ritmo, no el total.</p><p><b>Qué decisión informa:</b> cuándo se obtiene el ahorro de impuesto.</p>"; } };

  /* ===================== PUNTO DE EQUILIBRIO ===================== */
  CRS.equilibrio = {
    kw:"punto de equilibrio costo volumen utilidad cvu margen de contribucion costos fijos variables margen de seguridad apalancamiento operativo",
    ess:{ pts:["El <b>margen de contribución</b> (precio − costo variable) es lo que deja cada unidad para pagar los costos fijos.", "<b>Equilibrio:</b> Qe = CF ÷ (p − cv): unidades donde no se gana ni se pierde.", "Sobre Qe, cada unidad adicional aporta su margen completo a la utilidad.", "El <b>margen de seguridad</b> dice cuánto pueden caer las ventas antes de perder."],
      fx:"Qe = CF ÷ (p − cv);   Q_obj = [CF + U ÷ (1 − t)] ÷ (p − cv);   MS = (Q − Qe) ÷ Q", when:"fijas precios, evalúas un negocio nuevo o decides si aceptar un costo fijo adicional." },
    intro:{ prob:"<p>Una fábrica tiene costos fijos de $ 18 MM al mes, vende a $ 12.500 y su costo variable es $ 7.400 por unidad. ¿Cuántas unidades debe vender para no perder? ¿Y para ganar $ 4 MM después de impuesto?</p>",
      anal:"<p>Un carro de sopaipillas paga un permiso mensual (fijo) y la masa y aceite de cada sopaipilla (variable). Primero hay que vender suficientes para pagar el permiso; recién ahí empieza la ganancia.</p>",
      terms:[["CF", "Costos fijos: no cambian con el volumen (arriendo, sueldos fijos)."], ["cv", "Costo variable unitario."], ["p", "Precio de venta."], ["MC", "Margen de contribución = p − cv."], ["Qe", "Unidades de equilibrio."], ["GAO", "Grado de apalancamiento operativo: cuánto cambia la utilidad por cada 1 % de cambio en ventas."]] },
    adv:"<p><b>Multiproducto:</b> se usa un margen de contribución ponderado por la mezcla de ventas. <b>GAO alto</b> = mucho costo fijo: más riesgo, pero más utilidad cuando las ventas suben.</p>",
    sp:{ title:"Equilibrio y utilidad objetivo", params:[{ k:"CF", l:"Costos fijos", v:18000000, u:"$" }, { k:"p", l:"Precio", v:12500, u:"$" }, { k:"cv", l:"Costo variable", v:7400, u:"$" }],
      script(q){ const mc = q.p - q.cv, Q = q.CF / mc, Qo = (q.CF + 4e6 / 0.73) / mc;
        return [
          { t:"Margen", e:"MC = " + M(q.p) + " − " + M(q.cv) + " = " + M(mc), h:M(mc), s:"Lo que deja cada unidad." },
          { t:"Equilibrio", e:"Qe = " + M(q.CF) + " ÷ " + M(mc) + " = " + n(Q, 1) + " → " + n(Math.ceil(Q)) + " unidades", h:n(Math.ceil(Q)) + " unidades", s:"Se redondea hacia arriba." },
          { t:"En pesos", e:"Ve = " + n(Q, 1) + " · " + M(q.p) + " = " + M(Q * q.p), s:"Ventas mínimas para no perder." },
          { t:"Utilidad antes de impuesto", e:"4.000.000 ÷ (1 − 0,27) = " + M(4e6 / 0.73), s:"Para ganar $ 4 MM limpios hay que ganar más antes del impuesto." },
          { t:"Objetivo", e:"Q = (" + M(q.CF) + " + " + M(4e6 / 0.73) + ") ÷ " + M(mc) + " = " + n(Math.ceil(Qo)) + " unidades", h:n(Math.ceil(Qo)), s:"Unidades para la utilidad objetivo." }]; } },
    vars:[["CF", "Costos fijos del período", "$", "—"], ["p", "Precio unitario", "$", "—"], ["cv", "Costo variable unitario", "$", "&lt; p"], ["MC", "Margen de contribución", "$/u", "—"], ["Qe", "Unidades de equilibrio", "u", "—"], ["U", "Utilidad deseada después de impuesto", "$", "—"], ["t", "Tasa de impuesto", "%", "27 %"]],
    sup:"<ul><li>Precio y costo variable constantes (sin descuentos por volumen).</li><li>Costos fijos constantes en el rango.</li><li>Se vende todo lo producido.</li></ul>",
    ex:{ t:"CF $ 18 MM; p $ 12.500; cv $ 7.400; ventas proyectadas 5.200 u; meta $ 4 MM después de 27 % de impuesto.",
      steps:[["Margen.", "p − cv.", "$ 5.100 (40,8 % del precio).", "Cada unidad aporta $ 5.100."], ["Equilibrio.", "CF ÷ MC.", "3.530 unidades.", "Bajo eso, hay pérdida."], ["Utilidad objetivo.", "Agregar la utilidad antes de impuesto.", "4.604 unidades.", "Meta alcanzable con 5.200 proyectadas."], ["Margen de seguridad.", "Riesgo.", "32,1 %; GAO 3,11.", "Las ventas pueden caer 32 % antes de perder."]],
      r:"equilibrio en 3.530 unidades ($ 44,1 MM de ventas); para ganar $ 4 MM limpios se necesitan 4.604 unidades." },
    real:"<p>Se usa para fijar precios, evaluar si abrir un local o turno nuevo, y para negociar: un costo fijo adicional de $ 1 MM exige vender 1.000.000 ÷ MC unidades más.</p>",
    sim:"cvu",
    chk(){ const E = NUC.equilibrio(18e6, 12500, 7400, 4e6, 0.27, 5200); return [["Qe", 18e6 / 5100, E.Q], ["Qobj", (18e6 + 4e6 / 0.73) / 5100, E.Qo], ["MS", (5200 - 18e6 / 5100) / 5200, E.ms]]; },
    quiz:[["Si sube el costo fijo, el punto de equilibrio:", ["Baja", "Sube", "No cambia", "Se vuelve cero"], 1, "Hay más que cubrir con el mismo margen."], ["Si el precio baja y el costo variable no, el equilibrio:", ["Baja", "Sube", "No cambia", "Depende del CF"], 1, "El margen unitario baja."], ["Sobre el punto de equilibrio, cada unidad extra aumenta la utilidad en:", ["El precio", "El margen de contribución", "El costo fijo", "Nada"], 1, "El costo fijo ya está cubierto."]],
    dec:"precios, volúmenes mínimos y conveniencia de asumir costos fijos.",
    rel:["costeo", "regresion", "flujo-caja"] };

  CSIM.cvu = { title:"Gráfico costo-volumen-utilidad",
    goal:"dónde se cruzan ingresos y costos, y cómo precio, costo variable y costo fijo mueven ese cruce.",
    params:[{ k:"p", l:"Precio", min:8000, max:18000, step:100, v:12500, u:"$", help:"" }, { k:"cv", l:"Costo variable", min:3000, max:11000, step:100, v:7400, u:"$", help:"" }, { k:"CF", l:"Costos fijos", min:6, max:36, step:1, v:18, u:"MM$", help:"" }, { k:"Q", l:"Ventas", min:0, max:8000, step:100, v:5200, u:"u", help:"" }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.7); },
    draw(g, W, H, s, p, C){ const x0 = 56, x1 = W - 14, y0 = H - 30, top = 36, QM = 8000, VM = QM * 18000, X = q => x0 + q / QM * (x1 - x0), Y = v => y0 - v / VM * (y0 - top), CF = p.CF * 1e6, qe = p.p > p.cv ? CF / (p.p - p.cv) : Infinity, qq = QM * s.t;
      SIMG.axes(g, x0, y0, x1, top, C, "", "MM$"); [0, 50e6, 100e6].forEach(v => SIMG.text(g, n(v / 1e6), x0 - 4, Y(v) + 4, C.muted, C, "right")); [0, 2000, 4000, 6000].forEach(q => SIMG.text(g, n(q), X(q), y0 + 14, C.muted, C, "center"));
      if (isFinite(qe) && qe < QM) { g.fillStyle = C.bad; g.globalAlpha = 0.1; g.beginPath(); g.moveTo(X(0), Y(CF)); g.lineTo(X(qe), Y(qe * p.p)); g.lineTo(X(0), Y(0)); g.fill(); g.fillStyle = C.ok; g.beginPath(); g.moveTo(X(qe), Y(qe * p.p)); g.lineTo(X(QM), Y(QM * p.p)); g.lineTo(X(QM), Y(CF + QM * p.cv)); g.fill(); g.globalAlpha = 1; }
      const L = (f, c, w) => { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(X(0), Y(f(0))); g.lineTo(X(qq), Y(f(qq))); g.stroke(); };
      L(() => CF, C.muted, 1.5); L(q => CF + q * p.cv, C.c3, 2.5); L(q => q * p.p, C.c1, 2.5);
      if (isFinite(qe) && qe < QM) { g.fillStyle = C.ink; g.beginPath(); g.arc(X(qe), Y(qe * p.p), 5, 0, 7); g.fill(); SIMG.text(g, "Qe = " + n(Math.ceil(qe)), X(qe) + 8, Y(qe * p.p) + 16, C.ink, C, "left", true); }
      g.strokeStyle = C.c2; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(X(p.Q), top); g.lineTo(X(p.Q), y0); g.stroke(); g.setLineDash([]);
      SIMG.text(g, "■ costo total", x1, 14, C.c3, C, "right", true); SIMG.text(g, "■ ingresos", x1 - 100, 14, C.c1, C, "right", true); },
    metrics(s, p){ const mc = p.p - p.cv, CF = p.CF * 1e6, qe = CF / mc, U = p.Q * mc - CF; return [["Margen de contribución", M(mc)], ["Equilibrio", mc > 0 ? n(Math.ceil(qe)) + " u" : "nunca"], ["Utilidad con " + n(p.Q) + " u", M(U)], ["Margen de seguridad", mc > 0 && p.Q ? n((p.Q - qe) / p.Q * 100, 1) + " %" : "—"]]; },
    ann(s, p){ return p.p <= p.cv ? "Con precio menor o igual al costo variable, cada venta aumenta la pérdida: no hay equilibrio." : "Rojo: zona de pérdida. Verde: zona de utilidad. La línea punteada naranja son tus ventas."; },
    concl(s, p){ const mc = p.p - p.cv; return "<p>Con margen de " + M(mc) + " por unidad, el equilibrio está en " + (mc > 0 ? n(Math.ceil(p.CF * 1e6 / mc)) : "—") + " unidades.</p><p><b>Qué demuestra:</b> el equilibrio depende del margen unitario y del costo fijo.</p><p><b>Qué decisión informa:</b> precio mínimo, volumen meta y riesgo del negocio.</p>"; } };

  /* ===================== COSTEO ===================== */
  CRS.costeo = {
    kw:"costeo costo unitario materia prima mano de obra directa cif costos indirectos de fabricacion gav precio margen markup iva",
    ess:{ pts:["Costo de producción = <b>materia prima + mano de obra directa + costos indirectos (CIF)</b> por unidad.", "Los CIF del período se reparten entre las unidades producidas: más producción, menos CIF por unidad.", "Costo total = costo de producción + gastos de administración y ventas (GAV).", "<b>Margen</b> se calcula sobre el precio; <b>markup</b>, sobre el costo. No son lo mismo."],
      fx:"C_prod = MP + MOD + CIF ÷ Q;   C_total = C_prod + GAV;   p = C_total ÷ (1 − margen);   p_IVA = p · 1,19", when:"necesitas saber cuánto cuesta realmente un producto y a qué precio venderlo." },
    intro:{ prob:"<p>Un producto usa $ 3.200 de material y $ 1.800 de mano de obra. Los CIF son $ 9 MM al mes y se producen 4.000 unidades. Los gastos de venta son $ 900 por unidad. ¿A qué precio vender para tener 30 % de margen?</p>",
      anal:"<p>Al calcular cuánto cuesta un queque casero no basta con la harina y los huevos: hay que repartir el gas del horno y el tiempo. El horno encendido para 1 queque o para 4 cuesta casi lo mismo, así que hornear más baja el costo de cada uno.</p>",
      terms:[["MP", "Materia prima directa."], ["MOD", "Mano de obra directa."], ["CIF", "Costos indirectos de fabricación (energía, supervisión, mantención)."], ["GAV", "Gastos de administración y ventas."], ["Margen", "(p − costo) ÷ p."], ["Markup", "(p − costo) ÷ costo."], ["IVA", "19 % sobre el precio neto."]] },
    adv:"<p><b>Costeo ABC:</b> reparte los CIF según actividades (preparaciones, inspecciones) en vez de por unidades: más preciso con muchos productos distintos. <b>Costeo directo vs absorción:</b> el directo deja los CIF fijos como gasto del período; útil para decisiones de corto plazo.</p>",
    sp:{ title:"Del costo al precio", params:[{ k:"Q", l:"Producción", v:4000, u:"u" }, { k:"mg", l:"Margen sobre precio", v:30, u:"%" }],
      script(p){ const ci = 9e6 / p.Q, cp = 3200 + 1800 + ci, ct = cp + 900, pr = ct / (1 - p.mg / 100);
        return [
          { t:"CIF por unidad", e:"CIF/u = 9.000.000 ÷ " + n(p.Q) + " = " + M(ci), h:M(ci), s:"El costo indirecto se reparte en la producción." },
          { t:"Producción", e:"C_prod = 3.200 + 1.800 + " + n(ci, 1) + " = " + M(cp), s:"Costo de fabricar una unidad." },
          { t:"Total", e:"C_total = " + M(cp) + " + 900 = " + M(ct), h:M(ct), s:"Incluye vender y administrar." },
          { t:"Precio", e:"p = " + M(ct) + " ÷ (1 − " + n(p.mg / 100, 2) + ") = " + M(pr), h:M(pr), s:"Margen sobre el precio." },
          { t:"Markup", e:"Markup = (" + n(pr) + " − " + n(ct) + ") ÷ " + n(ct) + " = " + n((pr - ct) / ct * 100, 1) + " %", s:"El mismo precio, medido sobre el costo." },
          { t:"IVA", e:"Precio al público = " + M(pr) + " · 1,19 = " + M(pr * 1.19), h:M(pr * 1.19), s:"El IVA no es ingreso de la empresa: se entera al fisco." }]; } },
    vars:[["MP", "Materia prima por unidad", "$/u", "—"], ["MOD", "Mano de obra directa por unidad", "$/u", "—"], ["CIF", "Costos indirectos del período", "$", "—"], ["Q", "Producción del período", "u", "—"], ["GAV", "Gastos de administración y ventas", "$/u", "—"], ["margen", "Margen sobre precio", "%", "—"]],
    sup:"<ul><li>Los CIF se reparten por unidad (un solo producto o productos parecidos).</li><li>Se vende toda la producción.</li></ul>",
    ex:{ t:"MP $ 3.200; MOD $ 1.800; CIF $ 9 MM; 4.000 u; GAV $ 900; margen 30 %.",
      steps:[["CIF por unidad.", "Repartir.", "$ 2.250.", "Casi un tercio del costo."], ["Costo de producción.", "Sumar.", "$ 7.250.", ""], ["Costo total.", "Agregar GAV.", "$ 8.150.", ""], ["Precio.", "Margen 30 %.", "$ 11.643 neto; $ 13.855 con IVA.", "Markup equivalente: 42,9 %."]],
      r:"precio neto $ 11.643 (con IVA $ 13.855) para un costo total de $ 8.150." },
    real:"<p>Errores típicos: confundir margen con markup (vender con «30 % de markup» deja solo 23 % de margen) y olvidar que con menos producción el CIF por unidad sube.</p>",
    sim:"cos",
    chk(){ return [["Ctotal", 3200 + 1800 + 9e6 / 4000 + 900, 8150], ["Precio", 8150 / 0.7, 8150 * (1 + 3 / 7)]]; },
    quiz:[["Si la producción baja a la mitad, el CIF por unidad:", ["Baja a la mitad", "Se duplica", "No cambia", "Desaparece"], 1, "El mismo CIF se reparte en menos unidades."], ["Un producto cuesta $ 100 y se vende a $ 125. El margen sobre el precio es:", ["25 %", "20 %", "125 %", "80 %"], 1, "25 ÷ 125 = 20 % (el markup es 25 %)."], ["La mano de obra del supervisor de planta es:", ["MOD", "CIF", "GAV", "Materia prima"], 1, "No se asigna a una unidad específica."]],
    dec:"precios de venta, cotizaciones y qué productos dejan más margen.",
    rel:["equilibrio", "productividad"] };

  CSIM.cos = { title:"Costo unitario según el volumen de producción",
    goal:"por qué producir más baja el costo por unidad, y cómo el margen define el precio.",
    params:[{ k:"Q", l:"Producción", min:1000, max:8000, step:250, v:4000, u:"u", help:"" }, { k:"mg", l:"Margen sobre precio", min:5, max:50, step:1, v:30, u:"%", help:"" }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.7); },
    draw(g, W, H, s, p, C){ const x0 = 56, x1 = W - 14, y0 = H - 30, top = 36, X = q => x0 + (q - 1000) / 7000 * (x1 - x0), Y = v => y0 - v / 16000 * (y0 - top), ct = q => 5900 + 9e6 / q;
      SIMG.axes(g, x0, y0, x1, top, C, "", "$ por unidad"); [0, 5000, 10000, 15000].forEach(v => SIMG.text(g, n(v), x0 - 4, Y(v) + 4, C.muted, C, "right")); [1000, 3000, 5000, 7000].forEach(q => SIMG.text(g, n(q), X(q), y0 + 14, C.muted, C, "center"));
      g.fillStyle = C.c1; g.globalAlpha = 0.15; g.fillRect(x0, Y(5900), x1 - x0, y0 - Y(5900)); g.globalAlpha = 1; SIMG.text(g, "MP + MOD + GAV = $ 5.900", x1 - 6, Y(5900) + 16, C.muted, C, "right");
      const K = Math.round(140 * s.t); g.strokeStyle = C.c3; g.lineWidth = 2.5; g.beginPath(); for (let i = 0; i <= K; i++) { const q = 1000 + i / 140 * 7000; i ? g.lineTo(X(q), Y(ct(q))) : g.moveTo(X(q), Y(ct(q))); } g.stroke();
      g.strokeStyle = C.c2; g.lineWidth = 2; g.setLineDash([5, 4]); g.beginPath(); for (let i = 0; i <= K; i++) { const q = 1000 + i / 140 * 7000, v = Math.min(16000, ct(q) / (1 - p.mg / 100)); i ? g.lineTo(X(q), Y(v)) : g.moveTo(X(q), Y(v)); } g.stroke(); g.setLineDash([]);
      g.fillStyle = C.ink; g.beginPath(); g.arc(X(p.Q), Y(ct(p.Q)), 5, 0, 7); g.fill(); SIMG.text(g, "- - precio", x1, 14, C.c2, C, "right", true); SIMG.text(g, "■ costo total", x1 - 80, 14, C.c3, C, "right", true); },
    metrics(s, p){ const ct = 5900 + 9e6 / p.Q, pr = ct / (1 - p.mg / 100); return [["CIF por unidad", M(9e6 / p.Q)], ["Costo total", M(ct)], ["Precio neto", M(pr)], ["Markup equivalente", n((pr - ct) / ct * 100, 1) + " %"]]; },
    ann(s, p){ return p.Q < 2000 ? "Con poca producción el costo indirecto por unidad se dispara: el precio necesario podría no ser competitivo." : "La curva baja rápido al principio y luego se aplana: después de cierto volumen, producir más casi no abarata."; },
    concl(s, p){ return "<p>Con " + n(p.Q) + " unidades, el costo total es " + M(5900 + 9e6 / p.Q) + ".</p><p><b>Qué demuestra:</b> los costos fijos se diluyen con volumen (economías de escala).</p><p><b>Qué decisión informa:</b> precio, volumen mínimo y aceptar o no pedidos adicionales.</p>"; } };

  /* ===================== CAUE ===================== */
  const caue = (i, I, Co, VR, k) => I * AP(i, k) + Co - VR * AF(i, k);
  CRS.caue = {
    kw:"caue costo anual uniforme equivalente comparacion de alternativas vidas distintas reemplazo maquinas",
    ess:{ pts:["El <b>CAUE</b> convierte todos los costos de una alternativa en una cuota anual equivalente.", "Sirve para comparar alternativas con <b>vidas distintas</b> sin buscar un horizonte común.", "CAUE = inversión × (A/P) + costo anual − valor residual × (A/F).", "Se elige la de <b>menor CAUE</b> (si dan el mismo servicio)."],
      fx:"CAUE = I · (A/P, i, n) + C − VR · (A/F, i, n)", when:"debes elegir entre máquinas, vehículos o equipos con vidas útiles distintas que cumplen la misma función." },
    intro:{ prob:"<p>Un torno CNC nuevo cuesta $ 45 MM, opera con $ 6 MM al año, dura 8 años y vale $ 8 MM al final. Un torno convencional reacondicionado cuesta $ 18 MM, opera con $ 11 MM al año, dura 5 años y vale $ 2 MM. Con 10 %, ¿cuál conviene?</p>",
      anal:"<p>Es como comparar dos arriendos: uno con pie alto y cuota baja, otro sin pie y cuota alta. Para compararlos, se convierte el pie en «cuotas» y se suman.</p>",
      terms:[["I", "Inversión inicial."], ["C", "Costo anual de operación."], ["VR", "Valor residual al final."], ["(A/P, i, n)", "Factor de recuperación de capital."], ["(A/F, i, n)", "Factor de fondo de amortización."], ["CAUE", "Costo anual uniforme equivalente."]] },
    adv:"<p><b>Supuesto de repetición:</b> comparar CAUE con vidas distintas supone que cada alternativa se puede repetir en las mismas condiciones. Si no es así, usar un horizonte común con VAN.</p>",
    sp:{ title:"CAUE de dos alternativas", params:[{ k:"i", l:"Tasa", v:10, u:"%" }],
      script(p){ const i = p.i / 100, A = caue(i, 45e6, 6e6, 8e6, 8), B = caue(i, 18e6, 11e6, 2e6, 5);
        return [
          { t:"Factores A", e:"(A/P, " + p.i + " %, 8) = " + n(AP(i, 8), 5) + ";  (A/F) = " + n(AF(i, 8), 5), s:"Para 8 años." },
          { t:"CAUE A", e:"45 MM · " + n(AP(i, 8), 5) + " + 6 MM − 8 MM · " + n(AF(i, 8), 5) + " = " + M(A), h:M(A), s:"Costo anual del CNC." },
          { t:"Factores B", e:"(A/P, " + p.i + " %, 5) = " + n(AP(i, 5), 5) + ";  (A/F) = " + n(AF(i, 5), 5), s:"Para 5 años." },
          { t:"CAUE B", e:"18 MM · " + n(AP(i, 5), 5) + " + 11 MM − 2 MM · " + n(AF(i, 5), 5) + " = " + M(B), h:M(B), s:"Costo anual del convencional." },
          { t:"Decisión", e:(A < B ? "CNC: ahorra " : "Convencional: ahorra ") + M(Math.abs(A - B)) + " al año", s:"Se elige el menor CAUE." }]; } },
    vars:[["I", "Inversión", "$", "—"], ["C", "Costo de operación anual", "$/año", "—"], ["VR", "Valor residual", "$", "—"], ["n", "Vida útil", "años", "—"], ["i", "Tasa de descuento", "%", "—"], ["CAUE", "Costo anual equivalente", "$/año", "menor es mejor"]],
    sup:"<ul><li>Ambas alternativas entregan el mismo servicio.</li><li>Se pueden repetir al final de su vida.</li></ul>",
    ex:{ t:"Torno CNC vs convencional reacondicionado; tasa 10 %.",
      steps:[["CAUE del CNC.", "Fórmula.", "$ 13.735.429 por año.", ""], ["CAUE del convencional.", "Fórmula.", "$ 15.420.760 por año.", ""], ["Comparo.", "Menor costo.", "Ahorro $ 1.685.331 anual.", "Aunque cuesta más al inicio, el CNC es más barato a lo largo de su vida."]],
      r:"conviene el torno CNC: ahorra $ 1,69 MM al año en costo equivalente." },
    real:"<p>Se usa para flotas de camiones, compresores, bombas y equipos de minería, donde las alternativas tienen vidas útiles diferentes.</p>",
    sim:"caue",
    chk(){ return [["CAUE A", caue(0.1, 45e6, 6e6, 8e6, 8), 13735429.43], ["CAUE B", caue(0.1, 18e6, 11e6, 2e6, 5), 15420759.6]]; },
    quiz:[["El CAUE se usa principalmente cuando las alternativas tienen:", ["Igual vida", "Vidas distintas", "Solo ingresos", "Sin inversión"], 1, "Evita buscar un horizonte común."], ["Un valor residual mayor hace que el CAUE:", ["Suba", "Baje", "No cambie", "Sea cero"], 1, "Se resta."], ["Si la tasa sube, la alternativa con mayor inversión inicial:", ["Se favorece", "Se perjudica", "No cambia", "Se elimina"], 1, "El costo de capital pesa más."]],
    dec:"qué equipo comprar cuando tienen vidas útiles y costos distintos.",
    rel:["vida-economica", "equivalencias", "van-tir"] };

  CSIM.caue = { title:"CAUE de dos tornos según la tasa de descuento",
    goal:"cómo la tasa cambia la alternativa más conveniente (la de mayor inversión pierde con tasas altas).",
    params:[{ k:"i", l:"Tasa de descuento", min:0, max:40, step:1, v:10, u:"%", help:"" }, { k:"CA", l:"Costo anual del CNC", min:3, max:12, step:0.5, v:6, u:"MM$", help:"" }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.7); },
    draw(g, W, H, s, p, C){ const x0 = 56, x1 = W - 14, y0 = H - 30, top = 36, X = i => x0 + i / 0.4 * (x1 - x0), Y = v => y0 - (v - 8e6) / 16e6 * (y0 - top), A = i => caue(i, 45e6, p.CA * 1e6, 8e6, 8), B = i => caue(i, 18e6, 11e6, 2e6, 5);
      SIMG.axes(g, x0, y0, x1, top, C, "", "CAUE (MM$/año)"); [10e6, 15e6, 20e6].forEach(v => SIMG.text(g, n(v / 1e6), x0 - 4, Y(v) + 4, C.muted, C, "right")); [0, 0.1, 0.2, 0.3].forEach(i => SIMG.text(g, n(i * 100) + " %", X(i), y0 + 14, C.muted, C, "center"));
      const K = Math.round(120 * s.t); [[A, C.c1, "CNC nuevo"], [B, C.c3, "convencional"]].forEach(([f, c, l], k) => { g.strokeStyle = c; g.lineWidth = 2.5; g.beginPath(); for (let j = 0; j <= K; j++) { const i = j / 120 * 0.4, y = Math.max(top, Math.min(y0, Y(f(i)))); j ? g.lineTo(X(i), y) : g.moveTo(X(i), y); } g.stroke(); SIMG.text(g, "■ " + l, x1 - (1 - k) * 110, 14, c, C, "right", true); });
      let cr = NaN; for (let j = 1; j <= 400; j++) { const a = j / 1000, b = (j - 1) / 1000; if ((A(a) - B(a)) * (A(b) - B(b)) <= 0) { cr = a; break; } } if (isFinite(cr)) { g.fillStyle = C.ink; g.beginPath(); g.arc(X(cr), Y(A(cr)), 4, 0, 7); g.fill(); SIMG.text(g, "empate " + n(cr * 100, 1) + " %", X(cr) + 6, Y(A(cr)) - 8, C.ink, C, "left", true); }
      g.strokeStyle = C.c2; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(X(p.i / 100), top); g.lineTo(X(p.i / 100), y0); g.stroke(); g.setLineDash([]); },
    metrics(s, p){ const i = p.i / 100, a = caue(i, 45e6, p.CA * 1e6, 8e6, 8), b = caue(i, 18e6, 11e6, 2e6, 5); return [["CAUE CNC", M(a)], ["CAUE convencional", M(b)], ["Conviene", a < b ? "CNC" : "Convencional"], ["Diferencia anual", M(Math.abs(a - b))]]; },
    ann(s, p){ return "La línea punteada es tu tasa. Donde se cruzan las curvas las dos alternativas cuestan lo mismo: a la izquierda conviene una y a la derecha, la otra."; },
    concl(s, p){ return "<p>Con " + p.i + " % conviene el " + (caue(p.i / 100, 45e6, p.CA * 1e6, 8e6, 8) < caue(p.i / 100, 18e6, 11e6, 2e6, 5) ? "CNC" : "convencional") + ".</p><p><b>Qué demuestra:</b> con tasa alta, la alternativa de mayor inversión pierde atractivo.</p><p><b>Qué decisión informa:</b> qué comprar y qué tan robusta es la elección.</p>"; } };

  /* ===================== VIDA ECONÓMICA ===================== */
  const VM = [30e6, 23e6, 17.5e6, 13e6, 9.5e6, 7e6, 5e6], CO = [4e6, 4.6e6, 5.5e6, 6.8e6, 8.4e6, 10.5e6, 13e6];
  const ve = (i, k, f) => { const cap = 40e6 * AP(i, k) - VM[k - 1] * AF(i, k); let pv = 0; for (let t = 1; t <= k; t++) pv += CO[t - 1] * f ** (t - 1) * PF(i, t); return [cap, pv * AP(i, k)]; };
  CRS["vida-economica"] = {
    kw:"vida economica reemplazo de equipos caue minimo costo de capital costo de operacion mantencion",
    ess:{ pts:["La <b>vida económica</b> es la cantidad de años de uso que hace mínimo el costo anual equivalente total.", "El <b>costo de capital</b> anual baja con los años (la inversión se reparte en más años).", "El <b>costo de operación</b> sube con los años (más fallas y mantención).", "El mínimo de la suma indica cuándo reemplazar."],
      fx:"CAUE(n) = I·(A/P, i, n) − VMₙ·(A/F, i, n) + [Σ COₜ·(P/F, i, t)]·(A/P, i, n)", when:"debes decidir cada cuántos años renovar camiones, grúas, computadores o equipos." },
    intro:{ prob:"<p>Un equipo cuesta $ 40 MM. Su valor de reventa y su costo de operación cambian cada año. Con 10 %, ¿cuántos años conviene usarlo antes de reemplazarlo?</p>",
      anal:"<p>Un auto viejo es barato de tener (ya está pagado) pero caro de mantener. Uno nuevo es lo contrario. Hay un punto intermedio donde el costo total por año es mínimo.</p>",
      terms:[["I", "Inversión inicial."], ["VMₙ", "Valor de mercado al vender en el año n."], ["COₜ", "Costo de operación del año t."], ["CAUE capital", "Costo anual de la inversión neta de la reventa."], ["CAUE operación", "Costo anual equivalente de operar."], ["n*", "Vida económica."]] },
    adv:"<p>La vida económica suele ser menor que la vida física. Si llega una tecnología más eficiente (obsolescencia), el reemplazo puede convenir antes.</p>",
    sp:{ title:"CAUE por años de uso", params:[{ k:"i", l:"Tasa", v:10, u:"%" }],
      script(p){ const i = p.i / 100, R = [1, 2, 3, 4, 5, 6, 7].map(k => ve(i, k, 1)), T = R.map(r => r[0] + r[1]), b = T.indexOf(Math.min(...T));
        return [
          { t:"Año 1", e:"Capital: 40 MM · " + n(AP(i, 1), 4) + " − 30 MM = " + M(R[0][0]) + ";  operación " + M(R[0][1]), s:"Usarlo 1 año: se pierde mucho valor." },
          { t:"Año 3", e:"Capital " + M(R[2][0]) + " + operación " + M(R[2][1]) + " = " + M(T[2]), s:"El capital baja; la operación sube." },
          { t:"Año 6", e:"Capital " + M(R[5][0]) + " + operación " + M(R[5][1]) + " = " + M(T[5]), s:"" },
          { t:"Año 7", e:"Total " + M(T[6]), s:"La operación ya pesa más que lo que baja el capital." },
          { t:"Mínimo", e:"Vida económica n* = " + (b + 1) + " años;  CAUE = " + M(T[b]), h:(b + 1) + " años", s:"Conviene reemplazar al final de ese año." }]; } },
    vars:[["I", "Inversión", "$", "—"], ["VMₙ", "Valor de reventa en el año n", "$", "baja"], ["COₜ", "Costo de operación del año t", "$/año", "sube"], ["i", "Tasa", "%", "—"], ["n*", "Vida económica", "años", "—"]],
    sup:"<ul><li>Se reemplaza por un equipo igual.</li><li>Valores de mercado y costos estimados confiables.</li></ul>",
    ex:{ t:"Equipo de $ 40 MM; reventa 30, 23, 17,5, 13, 9,5, 7, 5 MM; operación 4; 4,6; 5,5; 6,8; 8,4; 10,5; 13 MM; tasa 10 %.",
      steps:[["Calculo el CAUE de capital por año de uso.", "Inversión menos reventa.", "Baja de 14,0 a 7,7 MM.", ""], ["Calculo el CAUE de operación.", "Costos crecientes.", "Sube de 4,0 a 7,0 MM.", ""], ["Sumo y busco el mínimo.", "Vida económica.", "6 años: $ 14.558.517 por año.", "Reemplazar al sexto año."]],
      r:"la vida económica es 6 años, con CAUE mínimo de $ 14.558.517." },
    real:"<p>Las empresas de transporte y minería renuevan flotas según este análisis. Si la mantención se dispara (por ejemplo, un camión que falla seguido), la vida económica se acorta.</p>",
    sim:"vec",
    chk(){ const T = [1, 2, 3, 4, 5, 6, 7].map(k => ve(0.1, k, 1)).map(r => r[0] + r[1]); return [["CAUE 6", T[5], 14558517], ["n*", T.indexOf(Math.min(...T)) + 1, 6]]; },
    quiz:[["Al aumentar los años de uso, el CAUE de capital:", ["Sube", "Baja", "Es constante", "Es cero"], 1, "La inversión se reparte en más años."], ["Si los costos de mantención crecen más rápido, la vida económica:", ["Se alarga", "Se acorta", "No cambia", "Es infinita"], 1, "El mínimo llega antes."], ["La vida económica comparada con la vida física es normalmente:", ["Mayor", "Menor o igual", "Siempre igual", "Sin relación"], 1, "Se reemplaza antes de que el equipo «muera»."]],
    dec:"cada cuántos años renovar un equipo.",
    pre:["caue"], rel:["caue", "depreciacion"] };

  CSIM.vec = { title:"Vida económica: el mínimo del costo anual",
    goal:"cómo el costo de capital que baja y el de operación que sube forman un mínimo.",
    params:[{ k:"i", l:"Tasa", min:0, max:25, step:1, v:10, u:"%", help:"" }, { k:"f", l:"Crecimiento extra de la mantención", min:0.9, max:1.3, step:0.02, v:1, fmt:v => "× " + n(v, 2) + " por año", u:"", help:"1 = caso base." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.7); },
    draw(g, W, H, s, p, C){ const R = [1, 2, 3, 4, 5, 6, 7].map(k => ve(p.i / 100, k, p.f)), x0 = 56, x1 = W - 14, y0 = H - 30, top = 36, X = k => x0 + (k - 0.5) / 7 * (x1 - x0), mx = Math.max(...R.map(r => r[0] + r[1])) * 1.1, Y = v => y0 - v / mx * (y0 - top);
      SIMG.axes(g, x0, y0, x1, top, C, "", "MM$/año"); [0, mx / 2.2, mx / 1.1].forEach(v => SIMG.text(g, n(v / 1e6, 1), x0 - 4, Y(v) + 4, C.muted, C, "right")); R.forEach((r, k) => SIMG.text(g, (k + 1) + (k ? "" : " año"), X(k + 1), y0 + 14, C.muted, C, "center"));
      const K = Math.max(1, Math.ceil(7 * s.t)); [[r => r[0], C.c1, "capital"], [r => r[1], C.c3, "operación"], [r => r[0] + r[1], C.ink, "total"]].forEach(([f, c, l], j) => { g.strokeStyle = c; g.lineWidth = j === 2 ? 3 : 2; g.beginPath(); R.slice(0, K).forEach((r, k) => k ? g.lineTo(X(k + 1), Y(f(r))) : g.moveTo(X(k + 1), Y(f(r)))); g.stroke(); SIMG.text(g, "■ " + l, x1 - (2 - j) * 90, 14, c, C, "right", true); });
      const T = R.map(r => r[0] + r[1]), b = T.indexOf(Math.min(...T)); if (s.t >= 1) { g.fillStyle = C.ok; g.beginPath(); g.arc(X(b + 1), Y(T[b]), 6, 0, 7); g.fill(); SIMG.text(g, "n* = " + (b + 1), X(b + 1), Y(T[b]) - 10, C.ink, C, "center", true); } },
    metrics(s, p){ const T = [1, 2, 3, 4, 5, 6, 7].map(k => ve(p.i / 100, k, p.f)).map(r => r[0] + r[1]), b = T.indexOf(Math.min(...T)); return [["Vida económica", (b + 1) + " años"], ["CAUE mínimo", M(T[b])], ["CAUE a 7 años", M(T[6])]]; },
    ann(s, p){ return p.f > 1.1 ? "Con mantención creciendo rápido, el mínimo se adelanta: conviene reemplazar antes." : "Azul baja (capital), rojo sube (operación); la negra es la suma y su punto más bajo es la vida económica."; },
    concl(s, p){ const T = [1, 2, 3, 4, 5, 6, 7].map(k => ve(p.i / 100, k, p.f)).map(r => r[0] + r[1]); return "<p>Vida económica: <b>" + (T.indexOf(Math.min(...T)) + 1) + " años</b>.</p><p><b>Qué demuestra:</b> hay un equilibrio entre pagar la inversión y soportar la mantención creciente.</p><p><b>Qué decisión informa:</b> el momento de reemplazo.</p>"; } };

  /* ===================== WACC ===================== */
  const bu = 0.9 / (1 + 0.73 * 400 / 600);
  const wacc = (w, t) => { const de = w / (1 - w), bl = bu * (1 + (1 - t) * de), ke = 0.055 + bl * 0.065, kd = 0.05 + 0.05 * w + 0.4 * Math.max(0, w - 0.5) ** 2; return { ke, kd, w: (1 - w) * ke + w * kd * (1 - t), bl }; };
  CRS.wacc = {
    kw:"wacc costo de capital promedio ponderado capm beta costo patrimonio costo deuda tasa de descuento escudo fiscal",
    ess:{ pts:["El <b>WACC</b> es el costo promedio del dinero que usa la empresa: parte deuda, parte patrimonio.", "<b>Costo del patrimonio</b> con CAPM: kₑ = r_f + β·(prima de mercado).", "La deuda cuesta menos porque sus intereses <b>reducen el impuesto</b>: k_d·(1 − t).", "El WACC es la tasa de descuento para proyectos de riesgo similar a la empresa."],
      fx:"kₑ = r_f + β·(E[r_m] − r_f);   WACC = E ÷ (D + E)·kₑ + D ÷ (D + E)·k_d·(1 − t)", when:"necesitas la tasa de descuento para evaluar un proyecto con VAN." },
    intro:{ prob:"<p>Una empresa tiene MM$ 400 de deuda al 7 % y MM$ 600 de patrimonio. Tasa libre de riesgo 5,5 %, beta 0,9, prima de mercado 6,5 %, impuesto 27 %. ¿Qué tasa debe exigir a sus proyectos?</p>",
      anal:"<p>Si financias un negocio con un préstamo del banco al 7 % y con plata de socios que esperan ganar 11 %, el costo promedio de todo el dinero está entre ambos, según cuánto pusiste de cada uno.</p>",
      terms:[["D, E", "Deuda y patrimonio (valor de mercado)."], ["kₑ", "Costo del patrimonio (lo que exigen los accionistas)."], ["k_d", "Costo de la deuda (tasa de interés)."], ["t", "Tasa de impuesto."], ["β", "Riesgo de la acción respecto al mercado."], ["r_f", "Tasa libre de riesgo (bonos del Banco Central)."], ["Prima de mercado", "Retorno extra del mercado sobre r_f."]] },
    adv:"<p><b>Más deuda no siempre baja el WACC:</b> la deuda es más barata, pero al aumentarla sube el riesgo de los accionistas (β apalancado, Hamada) y el costo de la deuda. Hay una estructura de capital óptima. <b>Beta desapalancada:</b> βu = βL ÷ [1 + (1 − t)·D/E].</p>",
    sp:{ title:"CAPM y WACC", params:[{ k:"b", l:"Beta", v:0.9, u:"" }, { k:"D", l:"Deuda", v:400, u:"MM$" }, { k:"E", l:"Patrimonio", v:600, u:"MM$" }],
      script(p){ const ke = 0.055 + p.b * 0.065, wd = p.D / (p.D + p.E), W = (1 - wd) * ke + wd * 0.07 * 0.73;
        return [
          { t:"CAPM", e:"kₑ = 5,5 % + " + n(p.b, 2) + " · 6,5 % = " + P(ke), h:P(ke), s:"Lo que exigen los accionistas por el riesgo." },
          { t:"Deuda neta", e:"k_d(1 − t) = 7 % · (1 − 0,27) = 5,11 %", s:"El interés baja el impuesto." },
          { t:"Pesos", e:"E/(D + E) = " + n(1 - wd, 3) + ";  D/(D + E) = " + n(wd, 3), s:"Proporción de cada fuente." },
          { t:"WACC", e:"WACC = " + n(1 - wd, 3) + " · " + P(ke) + " + " + n(wd, 3) + " · 5,11 % = " + P(W), h:P(W), s:"Tasa mínima para proyectos de riesgo similar." }]; } },
    vars:[["r_f", "Tasa libre de riesgo", "%", "≈ 5 % en Chile"], ["β", "Beta", "—", "0,5 a 1,5"], ["E[r_m] − r_f", "Prima de mercado", "%", "5 a 7 %"], ["kₑ", "Costo del patrimonio", "%", "—"], ["k_d", "Costo de la deuda", "%", "—"], ["t", "Impuesto", "%", "27 %"], ["D, E", "Deuda y patrimonio", "$", "valor de mercado"]],
    sup:"<ul><li>El proyecto tiene el mismo riesgo que la empresa.</li><li>La estructura de financiamiento se mantiene.</li></ul>",
    ex:{ t:"D = 400; E = 600 (MM$); k_d = 7 %; r_f = 5,5 %; β = 0,9; prima 6,5 %; t = 27 %.",
      steps:[["CAPM.", "Costo del patrimonio.", "kₑ = 11,35 %.", ""], ["Deuda después de impuesto.", "Escudo fiscal.", "5,11 %.", ""], ["Promedio ponderado.", "60 % / 40 %.", "WACC = 8,85 %.", "Tasa de descuento de los proyectos."]],
      r:"la empresa debe exigir al menos 8,85 % a proyectos de riesgo similar." },
    real:"<p>Las empresas chilenas reguladas (sanitarias, eléctricas) tienen su tasa de costo de capital fijada por ley o por estudios tarifarios con esta lógica. Los analistas usan betas de empresas comparables.</p>",
    sim:"wacc",
    chk(){ return [["ke", 0.055 + 0.9 * 0.065, 0.1135], ["WACC", 0.6 * 0.1135 + 0.4 * 0.07 * 0.73, wacc(0.4, 0.27).w]]; },
    quiz:[["¿Por qué la deuda tiene un costo efectivo menor que su tasa?", ["Porque es más riesgosa", "Porque los intereses rebajan el impuesto", "Porque no se paga", "Porque el banco lo subsidia"], 1, "Escudo fiscal: k_d(1 − t)."], ["Una beta de 1,5 significa que la acción:", ["Es menos riesgosa que el mercado", "Es más riesgosa que el mercado", "No tiene riesgo", "Rinde 1,5 %"], 1, "Se mueve 1,5 veces lo que el mercado."], ["Para evaluar un proyecto mucho más riesgoso que la empresa, se debe usar:", ["El WACC de la empresa", "Una tasa mayor", "La tasa libre de riesgo", "Cero"], 1, "La tasa debe reflejar el riesgo del proyecto."]],
    dec:"la tasa de descuento para el VAN y la estructura de financiamiento.",
    rel:["van-tir", "flujo-caja", "ratios"] };

  CSIM.wacc = { title:"WACC según el nivel de deuda",
    goal:"por qué agregar deuda baja el WACC al principio y lo sube cuando el riesgo crece (modelo simplificado).",
    params:[{ k:"w", l:"Deuda / (deuda + patrimonio)", min:0, max:80, step:1, v:40, u:"%", help:"" }, { k:"t", l:"Impuesto", min:0, max:40, step:1, v:27, u:"%", help:"Sin impuesto, la deuda no tiene ventaja fiscal." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.7); },
    draw(g, W, H, s, p, C){ const t = p.t / 100, x0 = 50, x1 = W - 14, y0 = H - 30, top = 36, X = w => x0 + w / 0.8 * (x1 - x0), Y = v => y0 - v / 0.25 * (y0 - top), K = Math.round(160 * s.t);
      SIMG.axes(g, x0, y0, x1, top, C, "", "Costo"); [0, 0.1, 0.2].forEach(v => SIMG.text(g, n(v * 100) + " %", x0 - 4, Y(v) + 4, C.muted, C, "right")); [0, 0.2, 0.4, 0.6].forEach(w => SIMG.text(g, n(w * 100) + " %", X(w), y0 + 14, C.muted, C, "center"));
      [[q => q.ke, C.c3, "kₑ"], [q => q.kd * (1 - t), C.c1, "k_d(1 − t)"], [q => q.w, C.ink, "WACC"]].forEach(([f, c, l], j) => { g.strokeStyle = c; g.lineWidth = j === 2 ? 3 : 2; g.beginPath(); for (let i = 0; i <= K; i++) { const w = i / 160 * 0.8, y = Math.max(top, Y(f(wacc(w, t)))); i ? g.lineTo(X(w), y) : g.moveTo(X(w), y); } g.stroke(); SIMG.text(g, "■ " + l, x1 - (2 - j) * 90, 14, c, C, "right", true); });
      let bw = 0, bv = 1; for (let i = 0; i <= 160; i++) { const w = i / 160 * 0.8, v = wacc(w, t).w; if (v < bv) { bv = v; bw = w; } } if (s.t >= 1) { g.fillStyle = C.ok; g.beginPath(); g.arc(X(bw), Y(bv), 5, 0, 7); g.fill(); SIMG.text(g, "mínimo", X(bw), Y(bv) + 18, C.ink, C, "center", true); }
      g.strokeStyle = C.c2; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(X(p.w / 100), top); g.lineTo(X(p.w / 100), y0); g.stroke(); g.setLineDash([]); },
    metrics(s, p){ const q = wacc(p.w / 100, p.t / 100); return [["Beta apalancada", n(q.bl, 3)], ["kₑ", P(q.ke)], ["k_d", P(q.kd)], ["WACC", P(q.w)]]; },
    ann(s, p){ return p.t === 0 ? "Sin impuesto, la deuda no tiene ventaja fiscal: el WACC casi no baja al endeudarse." : "Al subir la deuda, los accionistas exigen más (kₑ sube) y el banco cobra más con mucha deuda. El WACC tiene un mínimo. Modelo simplificado con fines didácticos."; },
    concl(s, p){ return "<p>Con " + p.w + " % de deuda, el WACC es " + P(wacc(p.w / 100, p.t / 100).w) + ".</p><p><b>Qué demuestra:</b> la deuda abarata el capital por el escudo fiscal, pero el exceso de deuda sube el riesgo.</p><p><b>Qué decisión informa:</b> estructura de financiamiento y tasa de descuento.</p>"; } };

  /* ===================== FLUJO DE CAJA ===================== */
  const fcj = (g0, cvp, r) => { const I = 120e6, KT = 15e6, D = 15e6, F = [-I - KT]; for (let y = 1; y <= 6; y++) { const ing = 95e6 * Math.pow(1 + g0, y - 1), gan = y === 6 ? 35e6 - 30e6 : 0, uai = ing * (1 - cvp) - 18e6 - D + gan, un = uai - 0.27 * uai; F.push(un + D + (y === 6 ? 30e6 + KT : 0)); } return { F, V: npv(r, F), T: irr(F) }; };
  CRS["flujo-caja"] = {
    kw:"flujo de caja proyecto evaluacion inversion capital de trabajo valor de desecho depreciacion impuesto van tir",
    ess:{ pts:["El flujo de caja ordena, año por año, el dinero que entra y sale por el proyecto.", "Orden: ingresos − costos − depreciación = utilidad antes de impuesto → − impuesto → + depreciación (no es salida de caja).", "Se agregan la inversión (año 0), el <b>capital de trabajo</b> (se recupera al final) y el <b>valor de desecho</b>.", "Con los flujos netos se calcula el VAN y la TIR."],
      fx:"FC = (Ingresos − Costos − D)·(1 − t) + D − Inversión + Recuperaciones", when:"evalúas un proyecto de inversión completo (planta, línea, negocio)." },
    intro:{ prob:"<p>Un proyecto invierte $ 120 MM en activos y $ 15 MM en capital de trabajo. Vende $ 95 MM el primer año, creciendo 5 % al año; costos variables 42 %, fijos $ 18 MM. Horizonte 6 años, tasa 12 %. ¿Es rentable?</p>",
      anal:"<p>Es como la planilla de gastos de un emprendimiento: lo que vendes menos lo que gastas, mes a mes. La diferencia es que aquí se agregan los impuestos y los efectos contables que los cambian.</p>",
      terms:[["Ingresos", "Ventas del año."], ["Depreciación", "Gasto contable; baja el impuesto pero no sale dinero."], ["UAI", "Utilidad antes de impuesto."], ["Capital de trabajo", "Dinero para operar (inventario, cuentas por cobrar); se recupera al final."], ["Valor de desecho", "Lo que vale el proyecto al final del horizonte."], ["Ganancia de capital", "Venta del activo − valor libro (paga impuesto)."]] },
    adv:"<p><b>Financiamiento:</b> el flujo «puro» no incluye deuda; el flujo del inversionista agrega préstamo, intereses (deducibles) y amortización. <b>Pérdidas:</b> se arrastran a años siguientes y reducen el impuesto futuro.</p>",
    sp:{ title:"Año 1 del flujo de caja", params:[],
      script(){ const ing = 95e6, cv = 0.42 * ing, uai = ing - cv - 18e6 - 15e6, R = fcj(0.05, 0.42, 0.12);
        return [
          { t:"Ingresos", e:"Ingresos = " + M(ing), s:"" },
          { t:"Costos", e:"− variables " + M(cv) + "  − fijos " + M(18e6) + "  − depreciación " + M(15e6), s:"Depreciación = 120 MM ÷ 8 años." },
          { t:"UAI", e:"UAI = " + M(uai), s:"Utilidad antes de impuesto." },
          { t:"Impuesto", e:"Impuesto = 27 % · " + M(uai) + " = " + M(0.27 * uai), s:"" },
          { t:"Flujo", e:"FC₁ = " + M(uai * 0.73) + " + " + M(15e6) + " = " + M(uai * 0.73 + 15e6), h:M(uai * 0.73 + 15e6), s:"Se suma la depreciación porque no salió dinero." },
          { t:"VAN", e:"Con los 6 años, desecho y capital de trabajo: VAN 12 % = " + M(R.V) + ";  TIR = " + P(R.T), h:M(R.V), s:"El proyecto es rentable." }]; } },
    vars:[["Ingresos", "Ventas del año", "$", "—"], ["CV", "Costos variables", "$", "% de ingresos"], ["CF", "Costos fijos", "$", "—"], ["D", "Depreciación", "$", "—"], ["t", "Impuesto", "%", "27 %"], ["KT", "Capital de trabajo", "$", "se recupera"], ["VD", "Valor de desecho", "$", "—"]],
    sup:"<ul><li>Precios constantes (sin inflación) o todo en nominal.</li><li>Impuesto sobre utilidad positiva.</li><li>Valor de desecho comercial del activo.</li></ul>",
    ex:{ t:"Inversión $ 120 MM + KT $ 15 MM; ventas $ 95 MM creciendo 5 %; CV 42 %; CF $ 18 MM; vida contable 8 años; desecho $ 35 MM; impuesto 27 %; tasa 12 %.",
      steps:[["Depreciación anual.", "120 ÷ 8.", "$ 15 MM.", "En 6 años queda valor libro $ 30 MM."], ["Flujo año 1.", "Estado de resultados.", "FC₁ = $ 31,1 MM.", ""], ["Año 6.", "Agregar desecho y KT.", "Venta 35 MM (ganancia 5 MM paga impuesto) y se recuperan 15 MM.", ""], ["VAN y TIR.", "Descontar.", "VAN $ 36.763.932; TIR 19,71 %.", "Conviene."]],
      r:"el proyecto es rentable: VAN $ 36,8 MM al 12 % y TIR 19,71 %." },
    real:"<p>Es el formato de evaluación privada que piden bancos, CORFO y fondos de inversión. Errores típicos: olvidar el capital de trabajo, restar la depreciación sin sumarla de vuelta y no cobrar impuesto a la ganancia por venta del activo.</p>",
    sim:"fcj",
    chk(){ return [["VAN", fcj(0.05, 0.42, 0.12).V, 36763932], ["TIR", fcj(0.05, 0.42, 0.12).T, NUC.van(0.12, fcj(0.05, 0.42, 0.12).F).TIR]]; },
    quiz:[["La depreciación en el flujo de caja se:", ["Resta y no se vuelve a sumar", "Resta para el impuesto y luego se suma", "Ignora", "Suma dos veces"], 1, "No es salida de dinero."], ["El capital de trabajo invertido al inicio:", ["Se pierde", "Se recupera al final", "Se deprecia", "Paga impuesto"], 1, "Es dinero inmovilizado durante el proyecto."], ["Si el activo se vende sobre su valor libro, la ganancia:", ["No paga impuesto", "Paga impuesto", "Se resta", "Se ignora"], 1, "Es ganancia de capital."]],
    dec:"si un proyecto completo es rentable y qué variables lo hacen más sensible.",
    pre:["van-tir", "depreciacion"], rel:["van-tir", "depreciacion", "wacc"] };

  CSIM.fcj = { title:"Flujos del proyecto y su VAN",
    goal:"cómo cambian los flujos y el VAN cuando cambian el crecimiento, los costos o la tasa (análisis de sensibilidad).",
    params:[{ k:"g", l:"Crecimiento de ventas", min:-5, max:15, step:1, v:5, u:"%", help:"" }, { k:"cv", l:"Costos variables", min:30, max:55, step:1, v:42, u:"% de ventas", help:"" }, { k:"r", l:"Tasa", min:5, max:25, step:0.5, v:12, u:"%", help:"" }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.8); },
    draw(g, W, H, s, p, C){ const R = fcj(p.g / 100, p.cv / 100, p.r / 100), x0 = 56, x1 = W - 14, top = 36, y0 = H - 30, Y = v => top + (90e6 - v) / 240e6 * (y0 - top), bw = (x1 - x0) / 7;
      SIMG.axes(g, x0, y0, x1, top, C, "", "MM$"); g.strokeStyle = C.line; g.beginPath(); g.moveTo(x0, Y(0)); g.lineTo(x1, Y(0)); g.stroke(); [-100e6, 0, 50e6].forEach(v => SIMG.text(g, n(v / 1e6), x0 - 4, Y(v) + 4, C.muted, C, "right"));
      R.F.forEach((f, t) => { const x = x0 + t * bw + bw * 0.12, d = f / Math.pow(1 + p.r / 100, t); bar(g, x, Y(0), bw * 0.36, (Y(f) - Y(0)) * s.t, f < 0 ? C.bad : C.c1); bar(g, x + bw * 0.38, Y(0), bw * 0.36, (Y(d) - Y(0)) * s.t, C.c2); SIMG.text(g, t, x + bw * 0.37, y0 + 14, C.muted, C, "center"); });
      SIMG.text(g, "■ descontado", x1, 14, C.c2, C, "right", true); SIMG.text(g, "■ flujo", x1 - 100, 14, C.c1, C, "right", true); },
    metrics(s, p){ const R = fcj(p.g / 100, p.cv / 100, p.r / 100); return [["VAN", M(R.V)], ["TIR", P(R.T)], ["Flujo año 1", M(R.F[1])], ["Decisión", R.V >= 0 ? "Conviene" : "No conviene"]]; },
    ann(s, p){ return "Las barras naranjas son los flujos traídos a hoy: el VAN es su suma. El año 6 es más alto porque se recuperan el capital de trabajo y la venta del activo."; },
    concl(s, p){ const R = fcj(p.g / 100, p.cv / 100, p.r / 100); return "<p>VAN = <b>" + M(R.V) + "</b>; TIR = " + P(R.T) + ".</p><p><b>Qué demuestra:</b> el VAN es muy sensible al porcentaje de costos variables: unos pocos puntos cambian la decisión.</p><p><b>Qué decisión informa:</b> invertir o no, y qué variable controlar con más cuidado.</p>"; } };

  /* ===================== RATIOS FINANCIEROS ===================== */
  CRS.ratios = {
    kw:"ratios financieros indicadores liquidez razon corriente prueba acida endeudamiento rentabilidad roe roa dupont rotacion",
    ess:{ pts:["Los ratios resumen los estados financieros en pocos números comparables.", "<b>Liquidez:</b> ¿puede pagar sus deudas de corto plazo? (razón corriente, prueba ácida).", "<b>Endeudamiento:</b> ¿cuánto depende de la deuda? (deuda/patrimonio, cobertura de intereses).", "<b>Rentabilidad:</b> ROE = margen neto × rotación de activos × multiplicador (DuPont)."],
      fx:"RC = AC ÷ PC;   ROE = UN ÷ Patrimonio = (UN ÷ Ventas)·(Ventas ÷ AT)·(AT ÷ Patrimonio)", when:"analizas la salud financiera de una empresa, un cliente o un proveedor." },
    intro:{ prob:"<p>Una empresa tiene activo corriente MM$ 520, pasivo corriente 310, activos 1.450, patrimonio 670, ventas 1.900 y utilidad 118. ¿Está sana? ¿De dónde viene su rentabilidad?</p>",
      anal:"<p>Igual que un chequeo médico mide presión, pulso y colesterol, los ratios miden liquidez, deuda y rentabilidad. Ninguno solo dice todo, pero juntos dan el diagnóstico.</p>",
      terms:[["AC / PC", "Activo y pasivo corriente (menos de un año)."], ["AT", "Activo total."], ["PT", "Pasivo total (deudas)."], ["UN", "Utilidad neta."], ["EBIT", "Resultado operacional."], ["ROE", "Rentabilidad del patrimonio."], ["ROA", "Rentabilidad de los activos."]] },
    adv:"<p><b>Comparar con la industria:</b> un supermercado opera con margen bajo y rotación alta; una minera, al revés. <b>DuPont</b> separa si la rentabilidad viene de márgenes, de eficiencia en el uso de activos o de endeudamiento.</p>",
    sp:{ title:"Liquidez, deuda y DuPont", params:[],
      script(){ const mn = 118 / 1900, ro = 1900 / 1450, mu = 1450 / 670;
        return [
          { t:"Liquidez", e:"Razón corriente = 520 ÷ 310 = " + n(520 / 310, 2), h:n(520 / 310, 2), s:"Sobre 1,5: puede pagar el corto plazo." },
          { t:"Ácida", e:"(520 − 180) ÷ 310 = " + n(340 / 310, 2), s:"Aun sin vender inventario, cubre sus deudas." },
          { t:"Deuda", e:"Deuda / patrimonio = 780 ÷ 670 = " + n(780 / 670, 2), s:"Más deuda que patrimonio: atención." },
          { t:"DuPont", e:"ROE = " + n(mn * 100, 2) + " % · " + n(ro, 3) + " · " + n(mu, 3), s:"Margen × rotación × multiplicador." },
          { t:"ROE", e:"ROE = " + n(mn * ro * mu * 100, 2) + " %", h:n(mn * ro * mu * 100, 2) + " %", s:"Supera el costo del patrimonio (11,35 %): crea valor." }]; } },
    vars:[["AC", "Activo corriente", "$", "—"], ["PC", "Pasivo corriente", "$", "—"], ["AT", "Activo total", "$", "—"], ["PT", "Pasivo total", "$", "—"], ["UN", "Utilidad neta", "$", "—"], ["RC", "Razón corriente", "veces", "≥ 1,5 holgado"], ["ROE", "Rentabilidad del patrimonio", "%", "&gt; kₑ crea valor"]],
    sup:"<ul><li>Estados financieros confiables y del mismo período.</li><li>Comparar con empresas del mismo rubro.</li></ul>",
    ex:{ t:"AC 520; inventarios 180; PC 310; AT 1.450; PT 780; patrimonio 670; ventas 1.900; costo de ventas 1.260; EBIT 210; gastos financieros 48; UN 118 (MM$).",
      steps:[["Liquidez.", "Corto plazo.", "RC 1,68; ácida 1,10.", "Sana."], ["Endeudamiento.", "Dependencia de deuda.", "D/P 1,16; cobertura 4,38.", "Atención, pero paga bien sus intereses."], ["Rentabilidad.", "DuPont.", "ROE 17,61 % = 6,21 % × 1,31 × 2,16.", "La deuda amplifica el ROE."]],
      r:"empresa líquida y rentable (ROE 17,6 %), con endeudamiento algo alto que conviene vigilar." },
    real:"<p>Los bancos usan estos ratios para dar créditos (exigen, por ejemplo, razón corriente mínima y deuda/patrimonio máxima en los contratos). La CMF publica los estados financieros de las sociedades anónimas abiertas.</p>",
    sim:"dup",
    chk(){ return [["ROE", (118 / 1900) * (1900 / 1450) * (1450 / 670), 118 / 670], ["RC", 520 / 310, 1.6774193548387097]]; },
    quiz:[["Una razón corriente de 0,8 indica:", ["Mucha liquidez", "Posibles problemas para pagar el corto plazo", "Alta rentabilidad", "Poca deuda"], 1, "El pasivo corriente supera al activo corriente."], ["Si el margen neto y la rotación no cambian, pero aumenta la deuda, el ROE:", ["Baja", "Sube", "No cambia", "Se anula"], 1, "Sube el multiplicador de capital (mientras la deuda no aumente mucho los intereses)."], ["La prueba ácida excluye:", ["La caja", "Los inventarios", "Las deudas", "El patrimonio"], 1, "Los inventarios son el activo corriente menos líquido."]],
    dec:"evaluar clientes, proveedores, inversiones y la salud de la propia empresa.",
    rel:["wacc", "flujo-caja", "kpis"] };

  CSIM.dup = { title:"Árbol DuPont: de dónde sale el ROE",
    goal:"cómo margen, rotación y endeudamiento se multiplican para formar la rentabilidad de los accionistas.",
    params:[{ k:"mn", l:"Margen neto", min:1, max:15, step:0.1, v:6.2, u:"%", help:"Utilidad ÷ ventas." }, { k:"ro", l:"Rotación de activos", min:0.3, max:3, step:0.05, v:1.31, u:"veces", help:"Ventas ÷ activos." }, { k:"mu", l:"Multiplicador de capital", min:1, max:4, step:0.05, v:2.16, u:"veces", help:"Activos ÷ patrimonio (más deuda = mayor)." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.8); },
    draw(g, W, H, s, p, C){ const roe = p.mn * p.ro * p.mu, x0 = 140, x1 = W - 60, rows = [["Margen neto", p.mn / 15, n(p.mn, 1) + " %", C.c1], ["Rotación", p.ro / 3, n(p.ro, 2) + "×", C.c3], ["Multiplicador", p.mu / 4, n(p.mu, 2) + "×", C.c4 || C.c2], ["ROE", Math.min(1, roe / 60), n(roe, 1) + " %", C.c2]], rh = (H - 40) / 4;
      rows.forEach(([l, f, v, c], k) => { const y = 16 + k * rh + (k === 3 ? 6 : 0); SIMG.text(g, l, x0 - 10, y + rh * 0.4 + 4, C.ink, C, "right", k === 3); g.fillStyle = C.line; g.globalAlpha = 0.4; g.fillRect(x0, y + rh * 0.15, x1 - x0, rh * 0.5); g.globalAlpha = 1; bar(g, x0, y + rh * 0.15, (x1 - x0) * f * s.t, rh * 0.5, c); SIMG.text(g, v, x0 + (x1 - x0) * f * s.t + 6, y + rh * 0.4 + 4, C.ink, C, "left", true); });
      const ke = Math.min(1, 11.35 / 60), xk = x0 + (x1 - x0) * ke, y3 = 16 + 3 * rh + 6; g.strokeStyle = C.ink; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(xk, y3); g.lineTo(xk, y3 + rh * 0.8); g.stroke(); g.setLineDash([]); SIMG.text(g, "kₑ 11,35 %", xk, y3 + rh * 0.8 + 12, C.muted, C, "center");
      SIMG.text(g, "×", x0 - 128, 16 + rh * 1.0 + 4, C.muted, C, "left", true); SIMG.text(g, "×", x0 - 128, 16 + rh * 2.0 + 4, C.muted, C, "left", true); SIMG.text(g, "=", x0 - 128, 16 + rh * 3.0 + 10, C.muted, C, "left", true); },
    metrics(s, p){ const roe = p.mn * p.ro * p.mu; return [["ROA (margen × rotación)", n(p.mn * p.ro, 2) + " %"], ["ROE", n(roe, 2) + " %"], ["Deuda / patrimonio", n(p.mu - 1, 2)], ["¿Crea valor? (ROE > kₑ)", roe > 11.35 ? "Sí" : "No"]]; },
    ann(s, p){ return p.mu > 3 ? "Un multiplicador alto infla el ROE con deuda: más rentabilidad, pero también más riesgo." : "El ROE es el producto de las tres barras de arriba. La línea punteada es lo que exigen los accionistas."; },
    concl(s, p){ return "<p>ROE = " + n(p.mn, 1) + " % × " + n(p.ro, 2) + " × " + n(p.mu, 2) + " = <b>" + n(p.mn * p.ro * p.mu, 1) + " %</b>.</p><p><b>Qué demuestra:</b> la misma rentabilidad se puede lograr con margen, con eficiencia o con deuda; no todas son igual de sanas.</p><p><b>Qué decisión informa:</b> qué palanca mejorar.</p>"; } };
})();
