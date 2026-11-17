/* ============ CURSO · Módulo Inventarios: stock de seguridad, ABC y MRP ============
   Números verificados por script con los datos por defecto de cada calculadora:
   SS: d = 45, σd = 9, L = 7, σL = 1,5, 95 % → z = 1,645; σ = 71,58; SS = 117,7; ROP = 432,7; costo = $ 108.786/año.
   ABC: total $ 57.480.000; A = 7 ítems (85,1 % del valor), B = 3 (11,1 %), C = 2 (3,9 %) con la regla «clase según el acumulado previo».
   MRP (lote a lote): recepciones P4 130, P5 80, P7 200, P8 90; lanzamientos P2, P3, P5, P6; total 500; inventario promedio 30. */
(function(){
  const n = crsNum, zr = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  /* inversa de la normal estándar (Acklam) */
  const zinv = p => { const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239], b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572], c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783], d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    const pl = 0.02425; let q, r; if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p <= 1 - pl) { q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
    q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); };
  const ssCalc = p => { const z = zinv(p.ns / 100), sig = Math.sqrt(p.L * p.sd * p.sd + p.d * p.d * p.sL * p.sL), SS = z * sig; return { z, sig, SS, ROP:p.d * p.L + SS, mu:p.d * p.L }; };

  /* ===================== STOCK DE SEGURIDAD ===================== */
  CRS["stock-seguridad"] = {
    kw:"stock de seguridad safety stock punto de reorden rop nivel de servicio z desviacion lead time inventario de proteccion quiebre",
    ess:{ pts:["El stock de seguridad (SS) es un <b>colchón</b> de inventario para cuando la demanda viene más alta o el proveedor se atrasa.",
      "Se calcula con el <b>nivel de servicio</b> (z) y la <b>variabilidad</b> de la demanda durante el lead time (σ).",
      "El punto de reorden es la demanda esperada durante el lead time <b>más</b> el stock de seguridad.",
      "Subir el nivel de servicio de 95 % a 99 % aumenta el SS en más de 40 %: el último tramo de servicio es caro."],
      fx:"SS = z · σ;   ROP = d · L + SS", when:"la demanda o el tiempo de entrega varían y un quiebre de stock (quedarse sin producto) tiene costo." },
    intro:{ prob:"<p>Una ferretería vende en promedio 45 sacos de cemento al día, pero hay días de 30 y días de 60. El proveedor demora 7 días, a veces 9. Si pide cuando le quedan justo 45 × 7 = 315 sacos, la mitad de las veces se va a quedar sin cemento antes de que llegue el pedido.</p><p><b>¿Cuánto inventario extra conviene tener para no quedarse sin stock casi nunca?</b></p>",
      anal:"<p>Es como salir de la casa con tiempo extra para una entrevista: en promedio el viaje dura 40 minutos, pero si sales justo 40 minutos antes, la mitad de las veces llegas tarde. Sales 15 minutos antes «por si acaso». Esos 15 minutos son tu stock de seguridad.</p>",
      terms:[["Nivel de servicio", "Probabilidad de NO quedarse sin stock durante un ciclo de reposición (95 % = 19 de cada 20 ciclos sin quiebre)."], ["z", "Número de desviaciones estándar que corresponde al nivel de servicio (95 % → 1,645; 99 % → 2,326)."], ["Desviación estándar (σ)", "Medida de cuánto varía algo alrededor de su promedio."], ["Demanda durante el lead time", "Lo que se vende mientras esperas que llegue el pedido."], ["Quiebre de stock", "Quedarse sin producto cuando el cliente lo pide."]] },
    adv:"<p><b>Por qué se suman varianzas y no desviaciones.</b> La demanda de 7 días es la suma de 7 demandas diarias. Si cada una varía con σd, la suma varía con √7 · σd (no 7 · σd), porque los días altos y bajos se compensan en parte. Por eso la fórmula usa L · σd² dentro de la raíz.</p><p><b>Revisión periódica.</b> Si en vez de pedir al llegar al ROP revisas cada T días, el riesgo cubre T + L días: σ = √((T + L) · σd² + d² · σL²) y el nivel máximo es S = d · (T + L) + SS.</p><p><b>Nivel de servicio de ciclo y tasa de llenado.</b> El 95 % de este tema es «de ciclo» (probabilidad de no quebrar en un ciclo). La tasa de llenado (fill rate) mide qué fracción de las unidades pedidas se entrega, y suele ser mayor.</p>",
    sp:{ title:"Stock de seguridad y punto de reorden, paso a paso",
      params:[{ k:"d", l:"Demanda diaria promedio d", v:45, u:"u/día" }, { k:"sd", l:"Desviación de la demanda σd", v:9, u:"u/día" }, { k:"L", l:"Lead time L", v:7, u:"días" }, { k:"sL", l:"Desviación del lead time σL", v:1.5, u:"días" }, { k:"ns", l:"Nivel de servicio", v:95, u:"%" }],
      script(p){ if (!(p.ns > 50 && p.ns < 100)) throw new Error("el nivel de servicio debe estar entre 50 y 99,99 %"); const r = ssCalc(p), vD = p.L * p.sd * p.sd, vL = p.d * p.d * p.sL * p.sL;
        return [
          { t:"Idea", e:"ROP = demanda esperada en el lead time + stock de seguridad", s:"Pedimos cuando el inventario alcanza para cubrir la espera <b>más</b> un colchón." },
          { t:"Demanda esperada", e:"d · L = " + n(p.d) + " · " + n(p.L) + " = " + n(r.mu) + " u", h:n(r.mu) + " u", s:"Es lo que se vende, en promedio, mientras llega el pedido." },
          { t:"Fórmula de σ", e:"σ = √(L · σd² + d² · σL²)", s:"La incertidumbre tiene dos fuentes: la demanda que varía (primer término) y el proveedor que se atrasa (segundo término)." },
          { t:"Variabilidad de la demanda", e:"L · σd² = " + n(p.L) + " · " + n(p.sd, 1) + "² = " + n(vD, 1), h:n(vD, 1), s:"Se suman varianzas (σ²), no desviaciones." },
          { t:"Variabilidad del lead time", e:"d² · σL² = " + n(p.d) + "² · " + n(p.sL, 1) + "² = " + n(vL, 1), h:n(vL, 1), s:"Si el proveedor demora un día más, hay que cubrir d unidades más." },
          { t:"Sumar y sacar raíz", e:"σ = √(" + n(vD, 1) + " + " + n(vL, 1) + ") = " + n(r.sig, 2) + " u", h:n(r.sig, 2), s:"Esta es la desviación de la demanda durante el lead time." },
          { t:"Buscar z", e:"Nivel " + n(p.ns, 1) + " %  →  z = " + n(r.z, 3), h:"z = " + n(r.z, 3), s:"z sale de la tabla normal: cuántas desviaciones hay que cubrir para no quebrar ese porcentaje de las veces." },
          { t:"Stock de seguridad", e:"SS = z · σ = " + n(r.z, 3) + " · " + n(r.sig, 2) + " = " + n(r.SS, 1) + " u", h:n(r.SS, 1) + " u", s:"Es el colchón. Se redondea hacia arriba: " + n(Math.ceil(r.SS)) + " unidades." },
          { t:"Punto de reorden", e:"ROP = " + n(r.mu) + " + " + n(r.SS, 1) + " = " + n(r.ROP, 1) + " u", h:n(r.ROP, 1), s:"Cuando el inventario baje a unas " + n(Math.ceil(r.ROP)) + " unidades, se hace el pedido." }]; } },
    vars:[["d", "Demanda diaria promedio", "unidades/día", "—"], ["σd", "Desviación estándar de la demanda diaria", "unidades/día", "10 % a 50 % de d"], ["L", "Lead time promedio (demora del proveedor)", "días", "1 a 60"], ["σL", "Desviación estándar del lead time", "días", "0 a 30 % de L"],
      ["z", "Factor de servicio de la normal estándar", "sin unidad", "1,28 (90 %) a 2,33 (99 %)"], ["σ", "Desviación de la demanda durante el lead time", "unidades", "—"], ["SS", "Stock de seguridad", "unidades", "—"], ["ROP", "Punto de reorden", "unidades", "—"]],
    sup:"<ul><li>La demanda diaria sigue (aproximadamente) una <b>distribución normal</b> y los días son independientes.</li><li>La demanda y el lead time son <b>independientes</b> entre sí.</li><li>Los datos (promedios y desviaciones) vienen de un historial representativo: si hay estacionalidad, calcula por temporada.</li><li>Para productos de venta muy baja (pocas unidades al mes) la normal no sirve: se usa la distribución de Poisson.</li></ul>",
    ex:{ t:"Una ferretería vende <b>45 sacos</b> de cemento al día en promedio, con una desviación de <b>9 sacos</b>. El proveedor demora <b>7 días</b> en promedio, con una desviación de <b>1,5 días</b>. Quiere un nivel de servicio de <b>95 %</b>. Cada saco cuesta $ 4.200 y mantenerlo cuesta 22 % al año.",
      steps:[["Calculo la demanda esperada en el lead time: 45 × 7.", "Es la base del punto de reorden.", "315 sacos.", "Si todo fuera exacto, bastaría pedir cuando queden 315."],
        ["Calculo σ = √(7 × 9² + 45² × 1,5²) = √(567 + 4.556,25).", "Mide cuánto puede desviarse la demanda mientras espero.", "σ = 71,6 sacos.", "La mayor parte del riesgo viene del proveedor (4.556 de 5.123): conviene negociar entregas más puntuales."],
        ["Busco z para 95 %.", "Traduce el nivel de servicio a desviaciones estándar.", "z = 1,645.", "Cubrir 1,645 desviaciones deja un 5 % de probabilidad de quiebre por ciclo."],
        ["Calculo SS = 1,645 × 71,6.", "Es el colchón necesario.", "SS = 117,7 → 118 sacos.", "Se mantienen 118 sacos extra en forma permanente."],
        ["Calculo ROP = 315 + 117,7.", "Es el nivel donde se pide.", "ROP = 432,7 → 433 sacos.", "Compras lanza el pedido cuando quedan 433 sacos."],
        ["Calculo el costo del colchón: 117,7 × 4.200 × 0,22.", "Para saber cuánto cuesta el servicio.", "$ 108.786 al año.", "Es el precio de cumplir 95 %; con 99 % el SS sube a 166 sacos."]],
      r:"pedir cuando queden 433 sacos y mantener un colchón de 118 sacos, que cuesta unos $ 109.000 al año. Reducir la variabilidad del proveedor es la forma más barata de bajar ese colchón." },
    real:"<p>En supermercados y distribuidoras, el nivel de servicio se fija por categoría: productos de alta rotación y de los que el cliente no acepta sustituto (leche, pan) se manejan con 98 % a 99 %; productos de baja rotación o con sustitutos, con 90 % a 95 %. Los sistemas ERP recalculan el SS cada semana con el historial reciente de demanda y de atrasos del proveedor.</p>",
    sim:"ss",
    chk(){ const r = ssCalc({ d:45, sd:9, L:7, sL:1.5, ns:95 }); return [["σ", r.sig, 71.5768817426409], ["SS", r.SS, 117.73349341014894], ["ROP", r.ROP, 432.7334934101489]]; },
    quiz:[["Si el nivel de servicio pasa de 95 % a 99 %, el stock de seguridad:", ["Sube 4 %", "Sube más de 40 %", "No cambia", "Baja"], 1, "z pasa de 1,645 a 2,326: el SS sube 2,326 ÷ 1,645 − 1 = 41 %. Los últimos puntos de servicio son los más caros."],
      ["El proveedor se vuelve totalmente puntual (σL = 0). El stock de seguridad:", ["Aumenta", "Baja", "No cambia", "Se vuelve cero siempre"], 1, "Desaparece el término d²σL²; queda solo la variabilidad de la demanda. En el ejemplo, σ baja de 71,6 a 23,8 sacos."],
      ["¿Qué pasa si se usa ROP = d × L sin stock de seguridad y la demanda es simétrica?", ["Nunca hay quiebres", "Hay quiebre en cerca de la mitad de los ciclos", "Hay quiebre en el 5 % de los ciclos", "El inventario crece sin límite"], 1, "La demanda real en el lead time queda sobre el promedio la mitad de las veces: equivale a un nivel de servicio de 50 %."]],
    dec:"cuánto inventario de protección mantener, cuándo pedir y cuánto cuesta cada punto de nivel de servicio. También muestra si conviene trabajar con el proveedor para reducir su variabilidad.",
    pre:["eoq", "descriptiva"], rel:["eoq", "abc", "pronosticos"] };

  CSIM.ss = { title:"Demanda durante el lead time: riesgo de quiebre y nivel de servicio",
    goal:"cómo el stock de seguridad cubre la variabilidad, por qué el nivel de servicio observado se acerca al objetivo y cuánto pesa cada fuente de incertidumbre.",
    params:[{ k:"ns", l:"Nivel de servicio objetivo", min:50, max:99.5, step:0.5, v:95, u:"%", help:"Porcentaje de ciclos sin quiebre que quieres lograr." },
      { k:"d", l:"Demanda diaria promedio (d)", min:10, max:100, step:1, v:45, u:"u/día", help:"Ventas promedio por día." },
      { k:"sd", l:"Variabilidad de la demanda (σd)", min:0, max:30, step:1, v:9, u:"u/día", help:"Cuánto se aleja la demanda de un día de su promedio." },
      { k:"L", l:"Lead time (L)", min:1, max:20, step:1, v:7, u:"días", help:"Días que demora el proveedor." },
      { k:"sL", l:"Variabilidad del lead time (σL)", min:0, max:4, step:0.5, v:1.5, u:"días", help:"Cuánto varían los atrasos del proveedor." }],
    init(p){ return { cyc:0, outs:0, bins:new Array(40).fill(0), acc:0, last:null }; },
    onParam(s){ s.cyc = 0; s.outs = 0; s.bins.fill(0); s.last = null; },
    tick(s, p, dt){ s.acc += dt * 25; const r = ssCalc(p), lo = r.mu - 4 * Math.max(r.sig, 1), hi = r.mu + 4 * Math.max(r.sig, 1);
      while (s.acc >= 1) { s.acc -= 1; const Lr = Math.max(0, Math.round(p.L + p.sL * zr())); let dem = 0; for (let k = 0; k < Lr; k++) dem += Math.max(0, p.d + p.sd * zr());
        s.cyc++; if (dem > r.ROP) s.outs++; s.last = dem; const b = Math.floor((dem - lo) / (hi - lo) * 40); if (b >= 0 && b < 40) s.bins[b]++; } },
    draw(g, W, H, s, p, C){ const r = ssCalc(p), x0 = 46, x1 = W - 12, y0 = H - 30, top = 26, sg = Math.max(r.sig, 1), lo = r.mu - 4 * sg, hi = r.mu + 4 * sg, X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0);
      SIMG.axes(g, x0, y0, x1, top, C, "demanda durante el lead time (u)", "Frecuencia");
      const mx = Math.max(1, ...s.bins), bw = (x1 - x0) / 40;
      s.bins.forEach((c, k) => { const v = lo + (k + 0.5) / 40 * (hi - lo), h = c / mx * (y0 - top - 20); g.fillStyle = v > r.ROP ? C.bad : C.c1; g.globalAlpha = 0.55; g.fillRect(x0 + k * bw + 1, y0 - h, bw - 2, h); g.globalAlpha = 1; });
      /* curva normal teórica escalada al histograma */
      if (s.cyc > 20) { const scale = s.cyc * (hi - lo) / 40 / (sg * Math.sqrt(2 * Math.PI)) / mx * (y0 - top - 20); g.strokeStyle = C.ink; g.lineWidth = 1.8; g.beginPath(); for (let k = 0; k <= 200; k++) { const v = lo + k / 200 * (hi - lo), y = y0 - scale * Math.exp(-0.5 * ((v - r.mu) / sg) ** 2); k ? g.lineTo(X(v), y) : g.moveTo(X(v), y); } g.stroke(); }
      g.strokeStyle = C.muted; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(X(r.mu), top); g.lineTo(X(r.mu), y0); g.stroke(); g.setLineDash([]); SIMG.text(g, "promedio " + n(r.mu), X(r.mu), top + 10, C.ink, C, "center");
      g.strokeStyle = C.c2; g.lineWidth = 2.5; g.beginPath(); g.moveTo(X(r.ROP), top); g.lineTo(X(r.ROP), y0); g.stroke(); SIMG.text(g, "ROP " + n(r.ROP), X(r.ROP) + 5, top + 26, C.ink, C, "left", true);
      g.fillStyle = C.c2; g.globalAlpha = 0.15; g.fillRect(X(r.mu), top + 34, X(r.ROP) - X(r.mu), 18); g.globalAlpha = 1; SIMG.text(g, "SS = " + n(r.SS), (X(r.mu) + X(r.ROP)) / 2, top + 47, C.ink, C, "center", true);
      g.fillStyle = C.muted; g.font = "11px " + C.font; g.textAlign = "center"; [lo, r.mu, hi].forEach(v => g.fillText(n(v), X(v), y0 + 14)); },
    metrics(s, p){ const r = ssCalc(p), obs = s.cyc ? (1 - s.outs / s.cyc) * 100 : NaN;
      return [["z", n(r.z, 3)], ["σ en el lead time", n(r.sig, 1) + " u"], ["Stock de seguridad", n(r.SS, 1) + " u"], ["Punto de reorden", n(r.ROP, 1) + " u"], ["Ciclos simulados", n(s.cyc)], ["Ciclos con quiebre", n(s.outs)], ["Servicio observado", isFinite(obs) ? n(obs, 1) + " %" : "—"], ["Servicio objetivo", n(p.ns, 1) + " %"]]; },
    ann(s, p){ const r = ssCalc(p); if (s.cyc < 30) return "Cada barra junta los ciclos de reposición simulados según cuánto se vendió mientras se esperaba el pedido.";
      const vD = p.L * p.sd * p.sd, vL = p.d * p.d * p.sL * p.sL; return "Las barras rojas son ciclos con quiebre: la demanda superó el punto de reorden. " + (vL > vD ? "La mayor parte del riesgo viene de los atrasos del proveedor." : "La mayor parte del riesgo viene de la demanda que varía."); },
    concl(s, p){ const r = ssCalc(p), obs = s.cyc ? (1 - s.outs / s.cyc) * 100 : NaN;
      return "<p>Con estos datos necesitas un stock de seguridad de <b>" + n(Math.ceil(r.SS)) + " unidades</b> y pedir cuando queden <b>" + n(Math.ceil(r.ROP)) + "</b>. " + (s.cyc > 200 ? "En " + n(s.cyc) + " ciclos simulados el servicio fue " + n(obs, 1) + " %, muy cerca del objetivo de " + n(p.ns, 1) + " %." : "Deja correr la simulación: el servicio observado se acercará al objetivo.") + "</p>" +
        "<p><b>Qué demuestra:</b> el histograma toma la forma de la campana normal (la curva negra) y la proporción de barras rojas coincide con 100 % menos el nivel de servicio. Más variabilidad ensancha la campana y exige más colchón.</p><p><b>Qué decisión informa:</b> qué nivel de servicio comprometer y si conviene invertir en reducir los atrasos del proveedor en vez de pagar más inventario.</p>"; } };

  /* ===================== CLASIFICACIÓN ABC ===================== */
  CRS.abc = {
    kw:"abc pareto 80 20 clasificacion de inventarios valor de consumo anual regla 80/20",
    ess:{ pts:["Ordena los ítems por su <b>valor de consumo anual</b> (demanda × costo unitario).", "Unos <b>pocos ítems (A)</b> concentran la mayor parte del dinero: ahí se pone el control más estricto.", "Los muchos ítems de poco valor (C) se manejan con reglas simples y revisiones espaciadas.", "Es el principio de Pareto aplicado al inventario."],
      fx:"Valor anual = D · Cu;   % acumulado = Σ valor ÷ valor total", when:"tienes muchos ítems y poco tiempo: necesitas decidir dónde poner el control." },
    intro:{ prob:"<p>Una bodega de repuestos mineros maneja 12 códigos (en la vida real, miles). Contarlos todos cada semana es imposible. ¿Cuáles merecen conteos frecuentes, pronósticos cuidadosos y negociación con proveedores, y cuáles se pueden manejar con una regla simple?</p>",
      anal:"<p>En tu presupuesto mensual, el arriendo y la comida son pocos ítems que se llevan casi toda la plata: los revisas con cuidado. Los chicles y los pasajes sueltos son muchos ítems de poca plata: no vale la pena anotarlos uno por uno.</p>",
      terms:[["Valor de consumo anual", "Demanda anual × costo unitario: cuánta plata pasa por ese ítem en un año."], ["Porcentaje acumulado", "Suma de los porcentajes de valor desde el ítem más caro hasta el actual."], ["Clase A", "Pocos ítems (10 % a 20 %) con la mayor parte del valor (≈ 70 % a 80 %)."], ["Clase B", "Ítems intermedios."], ["Clase C", "Muchos ítems (≈ 50 %) con poco valor (≈ 5 %)."]] },
    adv:"<p><b>ABC multicriterio.</b> El valor no es lo único que importa: un repuesto barato puede detener toda la planta. Se combina el ABC por valor con un XYZ por variabilidad de la demanda o con un criterio de criticidad (VED: vital, esencial, deseable). Un ítem C por valor pero vital se trata como A.</p><p><b>Regla de corte.</b> Hay dos convenciones: asignar la clase según el acumulado <b>antes</b> de sumar el ítem (la que usa la calculadora) o <b>después</b>. Con la primera, el ítem que cruza el 80 % queda en A.</p>",
    sp:{ title:"Clasificación ABC, paso a paso",
      params:[{ k:"A", l:"Límite de la clase A", v:80, u:"% acumulado" }, { k:"B", l:"Límite de la clase B", v:95, u:"% acumulado" }],
      script(p){ const it = [["R-102", 300, 42000], ["R-101", 1200, 8500], ["R-105", 80, 95000], ["R-107", 2400, 2600], ["R-112", 320, 15600], ["R-109", 4100, 950], ["R-103", 5200, 650], ["R-104", 950, 3100], ["R-106", 15000, 120], ["R-111", 7800, 210], ["R-110", 150, 7400], ["R-108", 600, 1800]].map(r => ({ id:r[0], v:r[1] * r[2], q:r[1], c:r[2] })).sort((a, b) => b.v - a.v);
        const T = it.reduce((s, x) => s + x.v, 0); let ac = 0; it.forEach(x => { const prev = ac; ac += x.v / T; x.ac = ac; x.cl = prev < p.A / 100 - 1e-9 ? "A" : prev < p.B / 100 - 1e-9 ? "B" : "C"; });
        const cnt = k => it.filter(x => x.cl === k), sh = k => cnt(k).reduce((s, x) => s + x.v, 0) / T * 100;
        return [
          { t:"Valor anual", e:"Valor = Demanda anual × Costo unitario", s:"Primero se mide cuánta plata pasa por cada ítem en un año." },
          { t:"Ejemplo", e:"R-102: " + n(it[0].q) + " × " + n(it[0].c) + " = $ " + n(it[0].v), h:"$ " + n(it[0].v), s:"Pocas unidades, pero muy caras: es el ítem de mayor valor." },
          { t:"Otro ejemplo", e:"R-106: 15.000 × 120 = $ 1.800.000", h:"$ 1.800.000", s:"Muchas unidades baratas: mucho movimiento, poco valor." },
          { t:"Total", e:"Valor total = $ " + n(T), h:n(T), s:"Se suma el valor de los 12 ítems." },
          { t:"Ordenar", e:"Orden: " + it.slice(0, 4).map(x => x.id).join(" > ") + " > …", s:"Se ordenan de mayor a menor valor." },
          { t:"Acumular", e:"% acumulado: " + it.slice(0, 4).map(x => n(x.ac * 100, 1) + " %").join(" → ") + " → …", s:"Se va sumando el porcentaje de cada ítem." },
          { t:"Cortar", e:"Clase A si el acumulado previo < " + n(p.A) + " %;  B si < " + n(p.B) + " %;  si no, C", h:"< " + n(p.A) + " %", s:"El ítem que cruza el límite todavía queda en la clase de arriba." },
          { t:"Resultado", e:"A: " + cnt("A").length + " ítems (" + n(sh("A"), 1) + " %) · B: " + cnt("B").length + " (" + n(sh("B"), 1) + " %) · C: " + cnt("C").length + " (" + n(sh("C"), 1) + " %)", h:"A: " + cnt("A").length + " ítems", s:"Pocos ítems concentran la mayor parte del valor." }]; } },
    vars:[["D", "Demanda anual del ítem", "unidades/año", "—"], ["Cu", "Costo unitario", "$ por unidad", "—"], ["Valor", "Valor de consumo anual (D × Cu)", "$ al año", "—"], ["% valor", "Valor del ítem ÷ valor total × 100", "%", "0 a 100"], ["% acumulado", "Suma de % valor desde el primer ítem", "%", "0 a 100"], ["Límite A, B", "Cortes de las clases sobre el % acumulado", "%", "A: 70 a 80; B: 90 a 95"]],
    sup:"<ul><li>Usa el valor de un año representativo; si hay ítems nuevos, estima su demanda.</li><li>El ABC por valor no mide criticidad ni variabilidad: compleméntalo (ver nivel avanzado).</li><li>Reclasifica al menos una vez al año: los ítems cambian de clase.</li></ul>",
    ex:{ t:"Una bodega de repuestos tiene 12 ítems. Por ejemplo, R-102: 300 unidades al año a $ 42.000; R-106: 15.000 unidades a $ 120. El valor total anual es $ 57.480.000. Límites: A hasta 80 % acumulado, B hasta 95 %.",
      steps:[["Calculo el valor anual de cada ítem (demanda × costo).", "El dinero, no la cantidad, define la importancia.", "R-102 = $ 12.600.000; R-106 = $ 1.800.000.", "R-106 mueve 50 veces más unidades que R-102, pero vale 7 veces menos."],
        ["Ordeno de mayor a menor y calculo el % acumulado.", "Para ver cuántos ítems concentran el valor.", "Los 3 primeros (R-102, R-101, R-105) suman 52,9 %.", "Un cuarto de los ítems ya explica más de la mitad del dinero."],
        ["Asigno clases con los cortes de 80 % y 95 %.", "Separar dónde poner el control.", "A = 7 ítems (85,1 % del valor); B = 3 (11,1 %); C = 2 (3,9 %).", "Con solo 12 ítems los grupos salen menos marcados que con miles."],
        ["Defino políticas por clase.", "Cada clase tiene un tratamiento distinto.", "A: conteo cíclico mensual y pronóstico ítem a ítem; B: trimestral; C: anual y pedidos grandes.", "El tiempo de los analistas se concentra donde está la plata."]],
      r:"los ítems A reciben el control más estricto: conteos frecuentes, pronósticos cuidadosos y negociación de precios. Los C se manejan con reglas simples." },
    real:"<p>En una bodega minera típica, del orden de 10 % a 20 % de los códigos explica cerca del 80 % del valor del inventario. Las auditorías de inventario se organizan con conteos cíclicos: los A se cuentan varias veces al año, los C una vez. Así se mejora la exactitud del inventario sin cerrar la bodega para un conteo total.</p>",
    sim:"abc",
    chk(){ const it = [[300, 42000], [1200, 8500], [80, 95000], [2400, 2600], [320, 15600], [4100, 950], [5200, 650], [950, 3100], [15000, 120], [7800, 210], [150, 7400], [600, 1800]], T = it.reduce((s, r) => s + r[0] * r[1], 0); return [["Total", T, 57480000], ["% A (7 primeros)", (12600000 + 10200000 + 7600000 + 6240000 + 4992000 + 3895000 + 3380000) / T * 100, 85.08524704244955]]; },
    quiz:[["En la clasificación ABC, los ítems se ordenan por:", ["Cantidad vendida", "Costo unitario", "Valor de consumo anual (demanda × costo)", "Orden alfabético"], 2, "Lo que importa es cuánta plata pasa por el ítem en un año."],
      ["Los ítems de clase A típicamente son:", ["Muchos ítems con poco valor", "Pocos ítems con la mayor parte del valor", "Los ítems más baratos", "Los de mayor peso físico"], 1, "Es el principio de Pareto: pocos ítems concentran la mayor parte del valor."],
      ["Un repuesto de $ 5.000 detiene la planta si falta. Por valor es clase C. ¿Qué haces?", ["Lo tratas como C", "Lo eliminas del inventario", "Lo tratas como crítico (A) aunque su valor sea bajo", "Lo cuentas una vez cada cinco años"], 2, "El ABC por valor se complementa con criticidad: un ítem vital se controla como A."]],
    dec:"qué ítems controlar con más frecuencia, a cuáles dedicar pronósticos y negociación, y cómo repartir el tiempo de conteo de la bodega.",
    pre:["pareto"], rel:["eoq", "stock-seguridad", "pareto"] };

  CSIM.abc = { title:"Pareto de inventarios: de la lista desordenada a las clases A, B y C",
    goal:"por qué al ordenar por valor aparecen pocos ítems que concentran casi todo el dinero, y cómo los límites cambian el tamaño de cada clase.",
    params:[{ k:"N", l:"Número de ítems", min:8, max:40, step:1, v:20, u:"", help:"Cantidad de códigos en la bodega (ejemplo)." },
      { k:"s", l:"Concentración del valor", min:0.2, max:2, step:0.1, v:1.5, u:"", help:"0,2 = valores parecidos entre ítems; 2 = muy pocos ítems valen casi todo." },
      { k:"A", l:"Límite de la clase A", min:50, max:90, step:5, v:80, u:"%", help:"Porcentaje acumulado de valor que define la clase A." },
      { k:"B", l:"Límite de la clase B", min:70, max:99, step:1, v:95, u:"%", help:"Debe ser mayor que el límite A." }],
    init(p){ const v = []; for (let k = 1; k <= p.N; k++) v.push(1000 / Math.pow(k, p.s) * (0.85 + 0.3 * Math.random())); const order = v.map((_, i) => i).sort(() => Math.random() - 0.5); return { v, order, t:0 }; },
    onParam(s, p, k){ if (k === "N" || k === "s") { const ns = CSIM.abc.init(p); Object.assign(s, ns); } },
    tick(s, p, dt){ s.t += dt; if (s.t > 9) s.t = 0; },
    draw(g, W, H, s, p, C){ const x0 = 46, x1 = W - 40, y0 = H - 34, top = 24, N = s.v.length, T = s.v.reduce((a, b) => a + b, 0), sorted = s.v.map((v, i) => i).sort((a, b) => s.v[b] - s.v[a]);
      const ph = Math.min(1, Math.max(0, (s.t - 1.2) / 2)), ease = ph < 0.5 ? 2 * ph * ph : 1 - Math.pow(-2 * ph + 2, 2) / 2, bw = (x1 - x0) / N, vmax = Math.max(...s.v);
      SIMG.axes(g, x0, y0, x1, top, C, "ítems (de mayor a menor valor)", "% del valor");
      let ac = 0; const cls = {}; sorted.forEach(i => { const prev = ac; ac += s.v[i] / T; cls[i] = prev < p.A / 100 - 1e-9 ? "A" : prev < p.B / 100 - 1e-9 ? "B" : "C"; });
      s.v.forEach((v, i) => { const from = s.order.indexOf(i), to = sorted.indexOf(i), pos = from + (to - from) * ease, h = v / vmax * (y0 - top - 30);
        g.fillStyle = ease < 1 ? C.muted : cls[i] === "A" ? C.c2 : cls[i] === "B" ? C.c1 : C.line; g.fillRect(x0 + pos * bw + 1, y0 - h, Math.max(1, bw - 2), h); });
      if (s.t > 3.4) { const pr = Math.min(1, (s.t - 3.4) / 2); g.strokeStyle = C.c3; g.lineWidth = 2.2; g.beginPath(); let a = 0; sorted.slice(0, Math.max(1, Math.round(N * pr))).forEach((i, k) => { a += s.v[i] / T; const x = x0 + (k + 0.5) * bw, y = y0 - a * (y0 - top - 10); k ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke();
        [[p.A, "A"], [p.B, "B"]].forEach(([l, t]) => SIMG.hline(g, x0, x1, y0 - l / 100 * (y0 - top - 10), C.muted, [4, 4], t + " " + l + " %", C)); }
      SIMG.text(g, s.t < 1.2 ? "Lista desordenada" : s.t < 3.4 ? "Ordenando por valor…" : "Curva de % acumulado", x1, top + 4, C.ink, C, "right", true); },
    metrics(s, p){ const T = s.v.reduce((a, b) => a + b, 0), sorted = s.v.slice().sort((a, b) => b - a); let ac = 0; const c = { A:[0, 0], B:[0, 0], C:[0, 0] };
      sorted.forEach(v => { const prev = ac; ac += v / T; const k = prev < p.A / 100 - 1e-9 ? "A" : prev < p.B / 100 - 1e-9 ? "B" : "C"; c[k][0]++; c[k][1] += v / T; });
      return ["A", "B", "C"].map(k => ["Clase " + k, c[k][0] + " ítems (" + n(c[k][0] / s.v.length * 100) + " %) · " + n(c[k][1] * 100, 1) + " % del valor"]); },
    ann(s, p){ return s.t < 3.4 ? "Las barras se reordenan de mayor a menor valor anual." : "La curva verde sube rápido al principio: pocos ítems acumulan casi todo el valor. Donde cruza " + p.A + " % termina la clase A."; },
    concl(s, p){ const T = s.v.reduce((a, b) => a + b, 0), sorted = s.v.slice().sort((a, b) => b - a); let ac = 0, nA = 0, vA = 0; sorted.forEach(v => { if (ac < p.A / 100 - 1e-9) { nA++; vA += v / T; } ac += v / T; });
      return "<p>Con esta concentración, <b>" + nA + " de " + s.v.length + " ítems</b> (" + n(nA / s.v.length * 100) + " %) forman la clase A y suman el <b>" + n(vA * 100, 1) + " %</b> del valor.</p><p><b>Qué demuestra:</b> mientras más concentrado está el valor, menos ítems hay en A y más rentable es enfocar el control. Con valores parecidos (concentración baja) el ABC pierde fuerza.</p><p><b>Qué decisión informa:</b> qué ítems contar y pronosticar con más cuidado, y cuáles manejar con reglas simples.</p>"; } };

  /* ===================== MRP ===================== */
  const mrpRun = (RB, RP, p) => { let inv = p.I0; const N = RB.length, NN = [], REC = new Array(N).fill(0), INV = [], LAN = new Array(N).fill(0), atras = [];
    for (let t = 0; t < N; t++) { const disp = inv + RP[t], nn = Math.max(0, RB[t] + p.SS - disp); NN.push(nn); let q = 0; if (nn > 0) q = p.Q > 0 ? Math.ceil(nn / p.Q) * p.Q : nn;
      REC[t] = q; inv = disp + q - RB[t]; INV.push(inv); if (q > 0) { if (t - p.LT >= 0) LAN[t - p.LT] += q; else atras.push(t + 1); } }
    return { NN, REC, INV, LAN, atras }; };
  const RB0 = [0, 120, 0, 150, 80, 0, 200, 90], RP0 = [0, 100, 0, 0, 0, 0, 0, 0];
  CRS.mrp = {
    kw:"mrp planificacion de requerimientos de materiales necesidades netas explosion lista de materiales bom lanzamiento orden planeada lote a lote",
    ess:{ pts:["El MRP responde <b>qué, cuánto y cuándo pedir</b> de cada componente para cumplir el plan de producción.", "Necesidad neta = lo que se requiere más el stock de seguridad, menos lo que hay y lo que ya viene.", "La orden se <b>lanza</b> antes de cuando se necesita: tantos períodos como el lead time.", "Los lanzamientos de un producto se convierten en requerimientos de sus componentes (lista de materiales)."],
      fx:"NNₜ = máx(0, RBₜ + SS − (Iₜ₋₁ + RPₜ))", when:"la demanda de un componente depende del plan de producción de otro producto (demanda dependiente)." },
    intro:{ prob:"<p>Una fábrica de bicicletas sabe cuántas bicicletas armará cada semana. Para eso necesita ruedas, marcos y frenos que demoran semanas en llegar. Si pide tarde, la línea se detiene; si pide antes de tiempo, llena la bodega.</p><p><b>¿Cuándo y cuánto pedir de cada componente?</b></p>",
      anal:"<p>Es como cocinar para un cumpleaños: sabes que el sábado necesitas 2 kilos de harina. Revisas la despensa (inventario), ves que tienes medio kilo y que tu mamá traerá uno (recepción programada). Te falta medio kilo, y como el almacén demora 2 días en traerlo, lo pides el jueves.</p>",
      terms:[["Requerimiento bruto (RB)", "Cantidad del componente que el plan de producción necesita en cada período."], ["Recepción programada (RP)", "Pedidos ya emitidos que llegarán en un período."], ["Inventario proyectado (I)", "Lo que se espera tener al final de cada período."], ["Necesidad neta (NN)", "Lo que falta después de usar el inventario y las recepciones."], ["Recepción de orden planeada", "Cuánto debe llegar en el período para cubrir la necesidad."], ["Lanzamiento de orden planeada", "Cuándo hay que emitir la orden: la recepción adelantada el lead time."], ["Lote a lote (L4L)", "Pedir exactamente la necesidad neta de cada período."]] },
    adv:"<p><b>Explosión de la lista de materiales.</b> Si una bicicleta lleva 2 ruedas, los lanzamientos de bicicletas multiplicados por 2 son los requerimientos brutos de ruedas, desfasados por el lead time de armado. Se procesa nivel por nivel (de la bicicleta a la rueda, de la rueda al rayo).</p><p><b>Tamaño de lote.</b> Lote a lote minimiza inventario pero multiplica pedidos. Cantidad fija (por ejemplo, el EOQ) o cantidad periódica (POQ, cubrir varios períodos) reducen pedidos a cambio de más inventario.</p>",
    sp:{ title:"Registro MRP, período a período",
      params:[{ k:"I0", l:"Inventario inicial", v:60, u:"u" }, { k:"SS", l:"Stock de seguridad", v:20, u:"u" }, { k:"LT", l:"Lead time", v:2, u:"períodos", step:1 }],
      script(p){ const r = mrpRun(RB0, RP0, { ...p, Q:0 }), out = [{ t:"Datos", e:"RB = " + RB0.join(" · ") + ";  RP en P2 = 100", s:"Requerimientos brutos por período y un pedido que ya viene en camino." }];
        let inv = p.I0; for (let t = 0; t < 8; t++) { const disp = inv + RP0[t], nn = r.NN[t];
          out.push({ t:"Período " + (t + 1), e:"NN = máx(0, " + RB0[t] + " + " + p.SS + " − (" + n(inv) + (RP0[t] ? " + " + RP0[t] : "") + ")) = " + n(nn) + (nn ? "  →  recibir " + n(r.REC[t]) + ", lanzar en P" + (t + 1 - p.LT) : ""), h:"= " + n(nn), s:nn ? "Falta material: hay que recibir " + n(r.REC[t]) + " unidades en P" + (t + 1) + ", así que la orden se lanza " + p.LT + " períodos antes." : "Alcanza con lo que hay. Inventario al final: " + n(r.INV[t]) + "." });
          inv = r.INV[t]; }
        out.push({ t:"Resumen", e:"Lanzamientos: " + r.LAN.map((q, t) => q ? "P" + (t + 1) + " = " + q : "").filter(Boolean).join(" · "), s:"Este es el plan de compras del componente." + (r.atras.length ? " Ojo: hay necesidades que no alcanzan a cubrirse (períodos " + r.atras.join(", ") + ")." : "") });
        return out; } },
    vars:[["RBₜ", "Requerimiento bruto del período t", "unidades", "—"], ["RPₜ", "Recepción programada en t (pedido ya emitido)", "unidades", "—"], ["Iₜ", "Inventario proyectado al final de t", "unidades", "≥ SS"], ["SS", "Stock de seguridad", "unidades", "—"], ["NNₜ", "Necesidad neta del período t", "unidades", "≥ 0"], ["LT", "Lead time del componente", "períodos", "1 a 8"], ["Q", "Tamaño de lote (si no es lote a lote)", "unidades", "—"]],
    sup:"<ul><li>El plan maestro de producción (qué se fabrica y cuándo) es correcto y estable.</li><li>Los lead times son fijos y conocidos.</li><li>El inventario registrado en el sistema es exacto: un MRP con inventario mal contado planifica mal.</li><li>Capacidad infinita: el MRP básico no revisa si las máquinas alcanzan (eso lo hace el CRP).</li></ul>",
    ex:{ t:"Un componente tiene requerimientos brutos de 0, 120, 0, 150, 80, 0, 200 y 90 unidades en los períodos 1 a 8. Hay <b>60</b> en inventario, llegan <b>100</b> en el período 2, el stock de seguridad es <b>20</b> y el lead time es <b>2 períodos</b>. Se pide lote a lote.",
      steps:[["Recorro los períodos 1 a 3 calculando NN = RB + SS − disponible.", "Para ver hasta cuándo alcanza el inventario.", "NN = 0 en P1, P2 y P3; inventario al final de P3 = 40.", "Con lo que hay y el pedido que viene, se cubre hasta el período 3."],
        ["Calculo P4: 150 + 20 − 40.", "Aparece la primera falta.", "NN = 130: recibir 130 en P4.", "Como el lead time es 2, la orden se lanza en P2."],
        ["Sigo con P5 a P8.", "Cada período con falta genera una orden.", "Recepciones: P5 = 80, P7 = 200, P8 = 90.", "Lanzamientos en P3, P5 y P6."],
        ["Resumo el plan.", "Compras necesita saber qué emitir y cuándo.", "4 órdenes, 500 unidades en total, inventario promedio de 30.", "El inventario se mantiene en el mínimo (20) desde P4: lote a lote no deja sobrantes."]],
      r:"emitir órdenes por 130 (P2), 80 (P3), 200 (P5) y 90 (P6). Si cada pedido tiene un costo fijo alto, conviene agrupar con cantidad fija o POQ." },
    real:"<p>Los ERP (SAP, Oracle, Odoo) ejecutan el MRP cada noche: toman el plan maestro, explotan las listas de materiales y proponen órdenes de compra y de fabricación. El planificador revisa los «mensajes de excepción» (adelantar, atrasar o cancelar órdenes) en vez de calcular a mano. El simulador de ERP de esta app tiene un MRP para practicar.</p>",
    sim:"mrp",
    chk(){ const r = mrpRun(RB0, RP0, { I0:60, SS:20, LT:2, Q:0 }); return [["Total recepciones", r.REC.reduce((a, b) => a + b, 0), 500], ["Lanzamiento P2", r.LAN[1], 130], ["Inventario promedio", r.INV.reduce((a, b) => a + b, 0) / 8, 30]]; },
    quiz:[["La necesidad neta de un período se calcula como:", ["Requerimiento bruto + inventario", "máx(0, RB + SS − inventario disponible − recepciones)", "Requerimiento bruto × lead time", "Inventario − stock de seguridad"], 1, "Solo se pide lo que falta después de usar lo que hay y lo que ya viene."],
      ["Una recepción planeada en el período 7 con lead time de 3 períodos se lanza en:", ["El período 10", "El período 7", "El período 4", "El período 3"], 2, "La orden se emite 3 períodos antes de cuando debe llegar: 7 − 3 = 4."],
      ["¿Qué tipo de demanda maneja el MRP?", ["Independiente (la del cliente final)", "Dependiente (la de componentes según el plan de producción)", "Aleatoria sin patrón", "Solo la de servicios"], 1, "La demanda de ruedas depende de cuántas bicicletas se planea armar."]],
    dec:"qué órdenes de compra y de fabricación emitir y cuándo, para cumplir el plan de producción con el menor inventario posible.",
    pre:["eoq", "pronosticos"], rel:["eoq", "stock-seguridad", "pronosticos", "sim-erp"] };

  CSIM.mrp = { title:"Registro MRP que se llena período a período",
    goal:"cómo se calculan las necesidades netas, por qué la orden se lanza antes de lo que se necesita y cómo el lead time, el stock de seguridad y el tamaño de lote cambian el plan.",
    params:[{ k:"LT", l:"Lead time", min:0, max:4, step:1, v:2, u:"períodos", help:"Cuántos períodos antes hay que lanzar la orden." },
      { k:"SS", l:"Stock de seguridad", min:0, max:80, step:5, v:20, u:"u", help:"Inventario mínimo que se quiere mantener." },
      { k:"I0", l:"Inventario inicial", min:0, max:300, step:10, v:60, u:"u", help:"Lo que hay en bodega al comenzar." },
      { k:"Q", l:"Lote fijo (0 = lote a lote)", min:0, max:300, step:25, v:0, u:"u", help:"Con lote fijo se pide en múltiplos de esta cantidad." }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0; },
    tick(s, p, dt){ s.t += dt * 0.8; if (s.t > 11) s.t = 0; },
    draw(g, W, H, s, p, C){ const r = mrpRun(RB0, RP0, p), cur = Math.min(8, Math.floor(s.t)), rows = [["Req. brutos", RB0], ["Recep. programadas", RP0], ["Inventario", r.INV], ["Necesidad neta", r.NN], ["Recibir (planeado)", r.REC], ["Lanzar orden", r.LAN]];
      const lw = Math.min(150, W * 0.34), cw = (W - lw - 10) / 8, rh = Math.min(42, (H - 60) / 7), y0 = 16;
      g.font = "12px " + C.font; for (let k = 0; k < 8; k++) { const x = lw + k * cw; if (k === cur - 1 || (cur === 8 && k === 7 && s.t < 9)) { g.fillStyle = C.c1; g.globalAlpha = 0.1; g.fillRect(x, y0, cw, rh * 7); g.globalAlpha = 1; } SIMG.text(g, "P" + (k + 1), x + cw / 2, y0 + rh * 0.65, C.ink, C, "center", true); }
      rows.forEach(([lab, arr], ri) => { const y = y0 + rh * (ri + 1); g.strokeStyle = C.line; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); SIMG.text(g, lab, 4, y + rh * 0.62, C.ink, C, "left", ri >= 3);
        for (let k = 0; k < 8; k++) { const show = ri < 2 || k < cur || (ri === 5 && r.REC.some((q, t) => q && t - p.LT === k && t < cur)); if (!show) continue; const v = ri === 5 ? arr[k] : arr[k]; if (!v && ri !== 2) continue;
          const col = ri === 3 && v ? C.bad : ri === 4 && v ? C.ok : ri === 5 && v ? C.c2 : C.ink; SIMG.text(g, n(v), lw + k * cw + cw / 2, y + rh * 0.62, col, C, "center", ri >= 3); } });
      /* flechas del desfase: de la recepción a su lanzamiento */
      r.REC.forEach((q, t) => { if (!q || t >= cur || t - p.LT < 0) return; const xa = lw + t * cw + cw / 2, xb = lw + (t - p.LT) * cw + cw / 2, ya = y0 + rh * 5 + rh * 0.9, yb = y0 + rh * 6 + rh * 0.15;
        g.strokeStyle = C.c2; g.lineWidth = 1.6; g.beginPath(); g.moveTo(xa, ya); g.lineTo(xb, yb); g.stroke(); g.fillStyle = C.c2; g.beginPath(); g.arc(xb, yb, 3, 0, 7); g.fill(); });
      if (r.atras.length && cur >= Math.min(...r.atras)) SIMG.text(g, "Falta en P" + r.atras.join(", P") + ": la orden debió lanzarse antes del P1", 4, y0 + rh * 7 + 18, C.bad, C, "left", true); },
    metrics(s, p){ const r = mrpRun(RB0, RP0, p); return [["Órdenes planeadas", n(r.REC.filter(x => x > 0).length)], ["Total a pedir", n(r.REC.reduce((a, b) => a + b, 0)) + " u"], ["Inventario promedio", n(r.INV.reduce((a, b) => a + b, 0) / 8, 1) + " u"], ["Necesidades sin cubrir a tiempo", r.atras.length ? "P" + r.atras.join(", P") : "ninguna"]]; },
    ann(s, p){ const cur = Math.min(8, Math.floor(s.t)); if (cur < 1) return "El plan avanza período a período. Mira cuándo aparece la primera necesidad neta."; const r = mrpRun(RB0, RP0, p), t = cur - 1;
      return r.NN[t] ? "Período " + cur + ": falta material (necesidad neta " + n(r.NN[t]) + "). Se recibe " + n(r.REC[t]) + " y la flecha muestra que la orden se lanzó " + p.LT + " período(s) antes." : "Período " + cur + ": alcanza con el inventario. Queda " + n(r.INV[t]) + "."; },
    concl(s, p){ const r = mrpRun(RB0, RP0, p);
      return "<p>Con lead time " + p.LT + ", stock de seguridad " + p.SS + " y " + (p.Q ? "lote fijo de " + p.Q : "lote a lote") + ", el plan tiene <b>" + r.REC.filter(x => x > 0).length + " órdenes</b> por " + n(r.REC.reduce((a, b) => a + b, 0)) + " unidades e inventario promedio de " + n(r.INV.reduce((a, b) => a + b, 0) / 8, 1) + ".</p><p><b>Qué demuestra:</b> cada falta genera una orden que se lanza adelantada el lead time. Con lotes fijos hay menos órdenes pero más inventario; si el lead time es largo, algunas necesidades ya no se alcanzan a cubrir.</p><p><b>Qué decisión informa:</b> el calendario de órdenes de compra y fabricación, y el equilibrio entre número de pedidos e inventario.</p>"; } };
})();
