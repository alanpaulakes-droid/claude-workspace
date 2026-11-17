/* ============ CURSO · Tema piloto: Lote económico (EOQ) ============
   Números del ejemplo (verificados por script): D = 12.000 u/año, S = $ 85.000, Cu = $ 4.200, i = 22 % → H = $ 924;
   Q* = 1.486 u; N = 8,08 pedidos/año; ciclo = 37 días hábiles; ROP = 240 u; CT* = $ 1.372.938 ($ 686.469 + $ 686.469). */
(function(){
  const n = crsNum;
  CRS.eoq = {
    kw:"eoq lote economico cantidad economica de pedido wilson cuanto pedir inventario costo de pedir costo de mantener harris",
    ess:{ pts:["Responde <b>cuánto pedir cada vez</b> para que la suma del costo de pedir y del costo de guardar sea la mínima.",
      "Pedir seguido abarata guardar pero encarece pedir. El óptimo está donde <b>los dos costos se igualan</b>.",
      "El lote crece con la <b>raíz</b> de la demanda: el doble de demanda no significa el doble de lote.",
      "Se lanza el pedido cuando el inventario baja al <b>punto de reorden</b> (ROP = d × L)."],
      fx:"Q* = √(2 · D · S ÷ H)", when:"la demanda es estable y conocida, y puedes estimar cuánto cuesta hacer un pedido y cuánto cuesta guardar una unidad un año." },
    intro:{ prob:"<p>Una distribuidora de alimentos en Temuco compra arroz a un proveedor de Santiago. Si pide poco y seguido, paga muchos fletes y mucho tiempo administrativo. Si pide mucho de una vez, llena la bodega, inmoviliza plata y arriesga mermas.</p><p><b>¿Cuánto conviene pedir cada vez?</b> El lote económico responde esa pregunta con un número.</p>",
      anal:"<p>Es como cargar el auto con bencina. Si echas $ 2.000 cada vez, vas a la bencinera todos los días (mucho tiempo perdido). Si pudieras llenar un estanque gigante de un año, tendrías una fortuna inmovilizada. Lo razonable está en un punto intermedio.</p>",
      terms:[["Inventario", "Unidades guardadas esperando ser vendidas o usadas."], ["Lote (Q)", "Cantidad que se pide cada vez."], ["Costo de pedir (S)", "Lo que cuesta hacer un pedido, sin importar su tamaño: flete fijo, papeleo, recepción."], ["Costo de mantener (H)", "Lo que cuesta guardar una unidad durante un año: bodega, seguros, mermas y el dinero inmovilizado."], ["Lead time (L)", "Tiempo que demora en llegar un pedido desde que lo haces."], ["Punto de reorden (ROP)", "Nivel de inventario en que se lanza el siguiente pedido."]] },
    adv:"<p><b>Qué tan grave es equivocarse.</b> Si pides un lote Q distinto del óptimo Q*, el costo sube según CT(Q) ÷ CT* = ½ · (Q ÷ Q* + Q* ÷ Q).</p><p>Pedir el doble del óptimo (Q = 2Q*) cuesta ½ · (2 + 0,5) = 1,25 veces el mínimo: un 25 % más. Pedir 20 % de más cuesta solo 1,7 % más. La curva es plana cerca del óptimo: puedes redondear a cajas o pallets sin miedo.</p><p><b>Variantes:</b> si tú fabricas el lote (llega de a poco), se usa el EPQ: Q* = √(2DS ÷ (H(1 − d ÷ p))). Si el proveedor ofrece descuentos por cantidad, se calcula el EOQ en cada tramo de precio y se compara el costo total, incluido el costo de compra. La calculadora de la pestaña Práctica hace ambos.</p>",
    sp:{ title:"La fórmula, deducida paso a paso",
      params:[{ k:"D", l:"Demanda anual D", v:12000, u:"unidades/año" }, { k:"S", l:"Costo por pedido S", v:85000, u:"$" }, { k:"Cu", l:"Costo unitario Cu", v:4200, u:"$" }, { k:"i", l:"Costo de mantener i", v:22, u:"% al año" }],
      script(p){ const H = p.Cu * p.i / 100, Q2 = 2 * p.D * p.S / H, Q = Math.sqrt(Q2), N = p.D / Q, c = N * p.S;
        return [
          { t:"Planteo", e:"CT(Q) = (D ÷ Q) · S + (Q ÷ 2) · H", s:"El costo total del año tiene dos partes: lo que cuesta <b>pedir</b> y lo que cuesta <b>guardar</b>." },
          { t:"Costo de pedir", e:"CT(Q) = (D ÷ Q) · S + (Q ÷ 2) · H", h:"(D ÷ Q) · S", s:"D ÷ Q es cuántos pedidos haces al año. Cada pedido cuesta S." },
          { t:"Costo de mantener", e:"CT(Q) = (D ÷ Q) · S + (Q ÷ 2) · H", h:"(Q ÷ 2) · H", s:"En promedio tienes medio lote en bodega (Q ÷ 2). Cada unidad guardada un año cuesta H." },
          { t:"Derivar", e:"dCT/dQ = −D · S ÷ Q² + H ÷ 2", h:"dCT/dQ", s:"El punto más bajo de una curva está donde su pendiente es cero. La derivada mide esa pendiente." },
          { t:"Igualar a cero", e:"−D · S ÷ Q² + H ÷ 2 = 0", h:"= 0", s:"Buscamos el Q donde la pendiente vale cero." },
          { t:"Despejar", e:"H ÷ 2 = D · S ÷ Q²", s:"Pasamos el término negativo al otro lado, donde queda positivo." },
          { t:"Despejar", e:"Q² = 2 · D · S ÷ H", h:"Q²", s:"Multiplicamos ambos lados por Q² y por 2, y dividimos por H." },
          { t:"Fórmula", e:"Q* = √(2 · D · S ÷ H)", h:"√(2 · D · S ÷ H)", s:"Sacamos raíz cuadrada. El asterisco (*) indica que es el valor óptimo." },
          { t:"Calcular H", e:"H = Cu × i = " + n(p.Cu) + " × " + n(p.i / 100, 2) + " = " + n(H) + " $ por unidad al año", h:"= " + n(H), s:"El costo de mantener suele darse como porcentaje del costo unitario. Primero se convierte a pesos." },
          { t:"Sustituir", e:"Q* = √(2 · " + n(p.D) + " · " + n(p.S) + " ÷ " + n(H) + ")", h:n(p.D), s:"Reemplazamos D = " + n(p.D) + " unidades al año, S = $ " + n(p.S) + " por pedido y H = $ " + n(H) + "." },
          { t:"Simplificar", e:"Q* = √" + n(Q2), h:n(Q2), s:"Arriba: 2 × " + n(p.D) + " × " + n(p.S) + " = " + n(2 * p.D * p.S) + ". Dividido por " + n(H) + " da " + n(Q2) + "." },
          { t:"Resultado", e:"Q* ≈ " + n(Q) + " unidades", h:n(Q), s:"Conviene pedir lotes de unas <b>" + n(Q) + " unidades</b>." },
          { t:"Interpretar", e:"N = D ÷ Q* = " + n(p.D) + " ÷ " + n(Q) + " ≈ " + n(N, 2) + " pedidos al año", h:n(N, 2), s:"Harás unos " + n(N, 1) + " pedidos al año." },
          { t:"Comprobar", e:"(D ÷ Q*) · S = " + n(c) + " = (Q* ÷ 2) · H", h:n(c), s:"En el óptimo el costo de pedir es igual al de mantener: $ " + n(c) + " cada uno. El total es $ " + n(2 * c) + " al año." }]; } },
    vars:[["D", "Demanda anual: unidades que se venden o consumen en un año", "unidades/año", "1.000 a 1.000.000"], ["S", "Costo de hacer un pedido (o de preparar una máquina), fijo por pedido", "$ por pedido", "$ 10.000 a $ 500.000"],
      ["Cu", "Costo de comprar (o fabricar) una unidad", "$ por unidad", "según el producto"], ["i", "Costo de mantener como porcentaje del costo unitario", "% al año", "15 % a 35 %"],
      ["H", "Costo de mantener una unidad durante un año (H = Cu × i)", "$ por unidad al año", "15 % a 35 % de Cu"], ["Q", "Lote: cantidad que se pide cada vez", "unidades", "—"], ["Q*", "Lote económico: el Q que minimiza el costo total", "unidades", "—"],
      ["N", "Número de pedidos al año (N = D ÷ Q)", "pedidos/año", "—"], ["CT", "Costo total anual de pedir y mantener", "$ al año", "—"], ["d", "Demanda diaria (d = D ÷ días hábiles)", "unidades/día", "—"], ["L", "Lead time: días que demora en llegar un pedido", "días", "1 a 60"], ["ROP", "Punto de reorden: nivel en que se lanza el pedido (ROP = d × L)", "unidades", "—"]],
    sup:"<ul><li><b>Demanda constante y conocida.</b> Si varía, se agrega un stock de seguridad (tema relacionado).</li><li><b>Lead time constante.</b></li><li><b>Todo el lote llega junto.</b> Si se fabrica de a poco, usa el EPQ.</li><li><b>Sin quiebres de stock</b> y sin descuentos por cantidad (la calculadora maneja descuentos).</li><li><b>Costos constantes</b> en el año.</li></ul><p>Aunque los supuestos rara vez se cumplen exactos, el resultado es robusto: equivocarse 20 % en Q sube el costo menos de 2 %.</p>",
    ex:{ t:"Una distribuidora vende <b>12.000 unidades</b> de un producto al año (300 días hábiles). Cada pedido cuesta <b>$ 85.000</b>, cada unidad cuesta <b>$ 4.200</b> y mantener inventario cuesta el <b>22 % al año</b> del costo unitario. El proveedor demora <b>6 días</b>.",
      steps:[["Calculo H = Cu × i = 4.200 × 0,22.", "La fórmula necesita el costo de mantener en pesos, no en porcentaje.", "H = $ 924 por unidad al año.", "Cada unidad que pasa un año en bodega cuesta $ 924 (bodega, seguros, mermas y capital inmovilizado)."],
        ["Calculo Q* = √(2 × 12.000 × 85.000 ÷ 924).", "Es el lote que hace mínimo el costo total.", "Q* = √2.207.792 ≈ 1.486 unidades.", "Conviene pedir de a unas 1.486 unidades (en la práctica, el múltiplo de caja o pallet más cercano)."],
        ["Calculo N = D ÷ Q* = 12.000 ÷ 1.486 y el ciclo = 300 ÷ N.", "Para saber cada cuánto se pide.", "N ≈ 8,08 pedidos al año; un pedido cada 37 días hábiles.", "Compras planifica unos 8 pedidos al año."],
        ["Calculo los costos: N × S y (Q* ÷ 2) × H.", "Para conocer el costo total y comprobar el óptimo.", "$ 686.469 de pedir y $ 686.469 de mantener; total $ 1.372.938 al año.", "Los dos costos son iguales: confirma que estamos en el óptimo."],
        ["Calculo ROP = d × L = (12.000 ÷ 300) × 6 = 40 × 6.", "Para saber cuándo lanzar el pedido.", "ROP = 240 unidades.", "Cuando en bodega queden 240 unidades, se hace el pedido; llega justo cuando se acaba."],
        ["Comparo con pedir 3.000 unidades de una vez: (12.000 ÷ 3.000) × 85.000 + (3.000 ÷ 2) × 924.", "Para medir el costo de no usar el lote económico.", "$ 1.726.000 al año: 25,7 % más caro.", "Pedir «por si acaso» el doble cuesta unos $ 353.000 extra al año."]],
      r:"pedir lotes de unas 1.500 unidades, unas 8 veces al año, cada vez que el inventario baje a 240 unidades. El costo anual de pedir y mantener será de unos $ 1,37 millones." },
    real:"<p>En el retail y en las distribuidoras, el EOQ se usa como punto de partida y luego se ajusta: al múltiplo de pallet, a la capacidad del camión y al mínimo que exige el proveedor. En minería y mantenimiento se usa para repuestos de consumo regular (filtros, correas), mientras que los repuestos críticos de baja rotación se gestionan con otros modelos.</p><p>Una práctica común es revisar el EOQ cada vez que cambia el costo del flete o la tasa de interés: si el dinero se encarece, H sube y conviene pedir lotes más chicos.</p>",
    sim:"eoq",
    /* verificación: el guion y la calculadora deben dar lo mismo */
    chk(){ const E = NUC.eoq(12000, 85000, 4200, 0.22, 300, 6, 0); return [["Q*", Math.sqrt(2 * 12000 * 85000 / 924), E.Q], ["N", 12000 / Math.sqrt(2 * 12000 * 85000 / 924), E.N], ["CT", 2 * 12000 / Math.sqrt(2 * 12000 * 85000 / 924) * 85000, E.CTp + E.CTm], ["ROP", 40 * 6, E.ROP]]; },
    quiz:[["Si la demanda anual se cuadruplica y lo demás no cambia, el lote económico:", ["Se cuadruplica", "Se duplica", "No cambia", "Se reduce a la mitad"], 1, "Q* depende de la raíz de D: √4 = 2. El lote se duplica, no se cuadruplica."],
      ["En el lote económico, el costo anual de pedir comparado con el de mantener es:", ["Mayor", "Menor", "Igual", "Cero"], 2, "En el óptimo ambos costos se igualan. Por eso, si al calcular no te dan iguales, revisa las cuentas."],
      ["Sube la tasa de interés y mantener inventario se vuelve más caro (H aumenta). El lote económico:", ["Aumenta", "Disminuye", "No cambia", "Se vuelve cero"], 1, "H está dividiendo dentro de la raíz: si H sube, Q* baja. Conviene pedir lotes más chicos y más seguido."]],
    dec:"cuánto comprar en cada pedido, cada cuánto pedir y en qué nivel de inventario lanzar el pedido. También permite estimar el ahorro de pasar de lotes «a ojo» al lote económico.",
    pre:["productividad"], rel:["stock-seguridad", "abc", "mrp", "pronosticos"] };

  /* ---------- Simulación: inventario en diente de sierra + curvas de costo ---------- */
  const DIAS = 300;
  const zr = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  CSIM.eoq = { h:W => Math.round(Math.min(560, Math.max(420, W * 0.78))), title:"Inventario en diente de sierra y costo total según el lote",
    goal:"por qué existe un lote que minimiza el costo, qué pasa en la bodega cuando pides más o menos que ese lote, y por qué la demanda variable obliga a tener stock de seguridad.",
    params:[{ k:"Q", l:"Lote que pides (Q)", min:200, max:5000, step:50, v:3000, u:"u", help:"Muévelo hasta que la línea de tu costo total toque el punto más bajo de la curva." },
      { k:"D", l:"Demanda anual (D)", min:3000, max:30000, step:500, v:12000, u:"u/año", help:"Unidades que se venden en el año (300 días hábiles)." },
      { k:"S", l:"Costo por pedido (S)", min:10000, max:250000, step:5000, v:85000, u:"$", help:"Flete, papeleo y recepción de cada pedido." },
      { k:"H", l:"Costo de mantener (H)", min:200, max:3000, step:20, v:924, u:"$/u·año", help:"Cuánto cuesta guardar una unidad durante un año." },
      { k:"L", l:"Lead time (L)", min:0, max:20, step:1, v:6, u:"días", help:"Días que demora en llegar un pedido." },
      { k:"V", l:"Variabilidad de la demanda", min:0, max:60, step:5, v:0, u:"%", help:"0 % = demanda constante (supuesto del EOQ). Súbela y mira los quiebres." },
      { k:"SS", l:"Stock de seguridad (SS)", min:0, max:600, step:10, v:0, u:"u", help:"Colchón extra para cuando la demanda viene más alta." }],
    init(p){ return { t:0, acc:0, I:p.Q + p.SS, pend:[], hist:[[0, p.Q + p.SS]], dem:0, short:0, outs:0, inOut:false, lastOut:-99, orders:0 }; },
    tick(s, p, dt){ s.acc += dt * 10; /* 10 días por segundo a velocidad 1× */
      while (s.acc >= 0.25) { s.acc -= 0.25; s.t += 0.25; const d = p.D / DIAS * 0.25, q = Math.max(0, d * (1 + p.V / 100 * zr()));
        s.dem += q; s.I -= q; if (s.I < 0) { s.short += -s.I; s.I = 0; if (!s.inOut) { s.outs++; s.inOut = true; s.lastOut = s.t; } } else s.inOut = false;
        for (let k = s.pend.length - 1; k >= 0; k--) if (s.pend[k].a <= s.t) { s.I += s.pend[k].q; s.pend.splice(k, 1); }
        const pos = s.I + s.pend.reduce((a, o) => a + o.q, 0), rop = p.D / DIAS * p.L + p.SS;
        if (pos <= rop) { s.orders++; if (p.L === 0) s.I += p.Q; else s.pend.push({ a:s.t + p.L, q:p.Q }); }
        s.hist.push([s.t, s.I]); if (s.hist.length > 2000) s.hist.splice(0, s.hist.length - 2000); } },
    draw(g, W, H, s, p, C){ const pad = 46, top = 22, h1 = Math.round(H * 0.5), y0 = top + h1, x0 = pad, x1 = W - 12, win = 150, tmin = Math.max(0, s.t - win);
      const ymax = Math.max(p.Q + p.SS, 400) * 1.15, Y = v => y0 - v / ymax * h1, X = t => x0 + (t - tmin) / win * (x1 - x0);
      SIMG.axes(g, x0, y0, x1, top, C, "días", "Inventario (u)");
      g.fillStyle = C.muted; g.font = "11px " + C.font; g.textAlign = "right"; [0, 0.5, 1].forEach(f => { const v = ymax / 1.15 * f; g.fillText(n(v), x0 - 6, Y(v) + 4); g.strokeStyle = C.line; g.globalAlpha = .5; g.beginPath(); g.moveTo(x0, Y(v)); g.lineTo(x1, Y(v)); g.stroke(); g.globalAlpha = 1; });
      const rop = p.D / DIAS * p.L + p.SS; SIMG.hline(g, x0, x1, Y(rop), C.c2, [6, 4], "Punto de reorden " + n(rop) + " u", C); if (p.SS > 0) SIMG.hline(g, x0, x1, Y(p.SS), C.c4, [2, 3], "Stock de seguridad", C);
      g.strokeStyle = C.c1; g.lineWidth = 2; g.beginPath(); let st = false; s.hist.forEach(([t, v]) => { if (t < tmin) return; const x = X(t), y = Y(v); if (!st) { g.moveTo(x, y); st = true; } else g.lineTo(x, y); }); g.stroke();
      g.fillStyle = C.bad; s.hist.forEach(([t, v]) => { if (t >= tmin && v <= 0.0001) g.fillRect(X(t) - 1.5, y0 - 6, 3, 6); });
      s.pend.forEach(o => { const x = X(o.a); if (x <= x1) { g.fillStyle = C.c3; g.beginPath(); g.moveTo(x, y0 - 2); g.lineTo(x - 5, y0 - 11); g.lineTo(x + 5, y0 - 11); g.closePath(); g.fill(); } });
      /* curvas de costo: escala hasta 2,5 veces el mínimo para que se vea la forma de U */
      const t2 = y0 + 40, h2 = H - t2 - 28, qs = Math.sqrt(2 * p.D * p.S / p.H), qmax = Math.max(qs * 3.2, p.Q * 1.15), cost = q => p.D / q * p.S + q / 2 * p.H, cmax = cost(qs) * 2.5, XQ = q => x0 + q / qmax * (x1 - x0), YC = c => t2 + h2 - Math.min(c, cmax) / cmax * h2;
      SIMG.axes(g, x0, t2 + h2, x1, t2, C, "lote Q (u)", "Costo anual ($)");
      g.save(); g.beginPath(); g.rect(x0, t2, x1 - x0, h2); g.clip();
      [[q => q / 2 * p.H, C.c2], [q => p.D / q * p.S, C.c3], [cost, C.c1]].forEach(([fn, col], k) => { g.strokeStyle = col; g.lineWidth = k === 2 ? 2.6 : 1.8; g.beginPath(); let f0 = true; for (let q = qmax / 200; q <= qmax; q += qmax / 200) { const y = YC(fn(q)); f0 ? g.moveTo(XQ(q), y) : g.lineTo(XQ(q), y); f0 = false; } g.stroke(); });
      g.restore();
      const lab = (t, q, fn, dy, col) => { SIMG.text(g, t, XQ(q), YC(fn(q)) + dy, col, C, "center", true); };
      lab("Total", qs * 2.6, cost, -8, C.ink); lab("Mantener", qs * 2.6, q => q / 2 * p.H, 16, C.ink); lab("Pedir", qs * 0.55, q => p.D / q * p.S, -8, C.ink);
      g.strokeStyle = C.muted; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(XQ(qs), t2); g.lineTo(XQ(qs), t2 + h2); g.stroke(); g.setLineDash([]); SIMG.text(g, "Q* = " + n(qs), XQ(qs) + 4, t2 + 12, C.ink, C, "left", true);
      const yq = YC(cost(p.Q)); g.fillStyle = C.c1; g.strokeStyle = C.surf; g.lineWidth = 2; g.beginPath(); g.arc(XQ(p.Q), yq, 6, 0, 7); g.fill(); g.stroke(); SIMG.text(g, "Tu lote", XQ(p.Q), yq - 11, C.ink, C, "center", true); },
    metrics(s, p){ const qs = Math.sqrt(2 * p.D * p.S / p.H), ct = q => p.D / q * p.S + q / 2 * p.H, ex = (ct(p.Q) / ct(qs) - 1) * 100, sv = s.dem ? (1 - s.short / s.dem) * 100 : 100;
      return [["Lote económico Q*", n(qs) + " u"], ["Tu lote Q", n(p.Q) + " u"], ["Pedidos al año (D ÷ Q)", n(p.D / p.Q, 1)], ["Costo de pedir", "$ " + n(p.D / p.Q * p.S)], ["Costo de mantener", "$ " + n(p.Q / 2 * p.H)], ["Costo total", "$ " + n(ct(p.Q)) + (ex > 0.5 ? " (+" + n(ex, 1) + " %)" : " (óptimo)")], ["Quiebres de stock", n(s.outs)], ["Demanda atendida", n(sv, 1) + " %"]]; },
    ann(s, p){ const qs = Math.sqrt(2 * p.D * p.S / p.H), r = p.Q / qs;
      if (s.t - s.lastOut < 12) return "Quiebre de stock: durante el lead time la demanda superó el punto de reorden. Sube el stock de seguridad o baja la variabilidad.";
      if (Math.abs(r - 1) < 0.05) return "Estás en el lote económico: el costo de pedir y el de mantener son iguales (las curvas verde y naranja se cruzan aquí).";
      return r > 1 ? "Tu lote es mayor que el óptimo: pides pocas veces, pero guardas mucho inventario y el costo de mantener domina." : "Tu lote es menor que el óptimo: guardas poco, pero pides muy seguido y el costo de pedir domina."; },
    concl(s, p){ const qs = Math.sqrt(2 * p.D * p.S / p.H), ct = q => p.D / q * p.S + q / 2 * p.H, ex = (ct(p.Q) / ct(qs) - 1) * 100;
      return "<p>Con estos datos, el lote económico es <b>" + n(qs) + " unidades</b> (" + n(p.D / qs, 1) + " pedidos al año, uno cada " + n(DIAS / (p.D / qs)) + " días hábiles). " +
        (ex > 0.5 ? "Tu lote de " + n(p.Q) + " unidades cuesta <b>$ " + n(ct(p.Q) - ct(qs)) + " más al año</b> (" + n(ex, 1) + " %)." : "Tu lote está en el óptimo.") + "</p>" +
        "<p><b>Qué demuestra:</b> el costo total es una curva con forma de U y su punto más bajo está donde se cruzan el costo de pedir y el de mantener. Cerca del óptimo la curva es plana: equivocarse un poco cuesta poco.</p>" +
        "<p><b>Qué decisión informa:</b> cuánto pedir y en qué nivel lanzar el pedido. " + (p.V > 0 ? "Con demanda variable, el EOQ no basta: hace falta stock de seguridad para no quebrar." : "Prueba subir la variabilidad: verás por qué se necesita stock de seguridad.") + "</p>"; } };
})();
