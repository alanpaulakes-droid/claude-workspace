/* ============ CURSO · Módulo Investigación de operaciones ============
   Resultados de referencia tomados de las calculadoras con sus datos por defecto (verificados por script):
   PL: (2; 6), Z = 36.000, precios sombra 1.500 y 1.000. Transporte: óptimo $ 1.020, esquina noroeste $ 1.180.
   Asignación: 37 (Ana-Fresa, Benjamín-Torno, Camila-Soldadura, Diego-Pintura). CPM/PERT: 21,5; ruta A-C-E-G-H; σ = 1,323; P(≤ 22) = 64,7 %.
   Colas M/M/3: ρ = 91,7 %; Lq = 9,31; Wq = 25,4 min; W = 32,9 min; L = 12,06. Decisiones: VE máx 61 (planta grande); VEIP = 24.
   Dijkstra: 22 (Bodega-B-F-Cliente). Localización: CG (45,31; 72,08). Factores: Quilicura 7,80. Monte Carlo: VAN con valores probables = −$ 1.271.688. */
(function(){
  const n = crsNum, zr = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const fact = k => k <= 1 ? 1 : k * fact(k - 1);

  /* ---------- utilidades de PL en 2 variables: vértices de { a·x ≤ b, x ≥ 0 } ---------- */
  const lpVerts = cons => { const L = cons.concat([[1, 0, 0, -1], [0, 1, 0, -1]]).map(c => c.length === 4 ? c : [c[0], c[1], c[2], 1]); const V = [];
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const [a1, b1, c1] = L[i], [a2, b2, c2] = L[j], det = a1 * b2 - a2 * b1; if (Math.abs(det) < 1e-12) continue;
      const x = (c1 * b2 - c2 * b1) / det, y = (a1 * c2 - a2 * c1) / det; if (x < -1e-9 || y < -1e-9) continue; if (cons.every(c => c[0] * x + c[1] * y <= c[2] + 1e-9) && !V.some(v => Math.abs(v[0] - x) < 1e-7 && Math.abs(v[1] - y) < 1e-7)) V.push([x + 0, y + 0]); }
    const cx = V.reduce((s, v) => s + v[0], 0) / V.length, cy = V.reduce((s, v) => s + v[1], 0) / V.length; return V.sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx)); };

  /* ===================== PROGRAMACIÓN LINEAL ===================== */
  CRS["programacion-lineal"] = {
    kw:"programacion lineal pl simplex metodo grafico region factible funcion objetivo restricciones precio sombra optimo vertice lp",
    ess:{ pts:["Decide cuánto hacer de cada actividad para <b>maximizar</b> (utilidad) o <b>minimizar</b> (costo) respetando recursos limitados.", "Tiene tres piezas: <b>variables</b> (lo que decides), <b>función objetivo</b> (lo que quieres lograr) y <b>restricciones</b> (lo que te limita).", "El óptimo siempre está en un <b>vértice</b> (esquina) de la región factible.", "El <b>precio sombra</b> dice cuánto aumentaría la utilidad con una unidad más de un recurso."],
      fx:"máx Z = c₁x₁ + c₂x₂   s.a.   aᵢ₁x₁ + aᵢ₂x₂ ≤ bᵢ,   x ≥ 0", when:"los aportes y consumos son proporcionales a las cantidades (sin descuentos ni economías de escala) y las variables pueden tomar decimales." },
    intro:{ prob:"<p>Una fábrica de vidrios hace <b>puertas</b> ($ 3.000 de utilidad cada una) y <b>ventanas</b> ($ 5.000). La planta 1 tiene 4 horas para puertas; la planta 2, 12 horas para ventanas (cada ventana usa 2 h); y la planta 3 tiene 18 horas que comparten ambas (puerta 3 h, ventana 2 h).</p><p><b>¿Cuántas puertas y ventanas hacer para ganar lo máximo?</b></p>",
      anal:"<p>Es como armar una mochila para un viaje: quieres llevar lo que más te sirve (objetivo), pero hay un límite de peso y de espacio (restricciones). No puedes llevar todo; buscas la mejor combinación.</p>",
      terms:[["Variable de decisión", "Lo que eliges: x₁ = puertas, x₂ = ventanas."], ["Función objetivo", "Fórmula de lo que se maximiza o minimiza (Z)."], ["Restricción", "Límite que la solución debe respetar."], ["Región factible", "Todas las combinaciones que cumplen las restricciones."], ["Vértice", "Esquina de la región factible."], ["Restricción activa", "La que queda justo en su límite en el óptimo (holgura cero)."], ["Precio sombra", "Aumento de Z por una unidad más del lado derecho de una restricción."]] },
    adv:"<p><b>El método Simplex</b> recorre vértices de la región factible, saltando siempre a uno vecino que mejore Z, hasta que ninguno mejora. Funciona con miles de variables, donde el método gráfico ya no sirve.</p><p><b>Análisis de sensibilidad.</b> Los precios sombra (1.500 por hora de planta 2 y 1.000 por hora de planta 3 en el ejemplo) son válidos dentro de un rango del lado derecho. La planta 1 tiene holgura: una hora más no vale nada.</p><p><b>Programación entera.</b> Si las variables deben ser enteras (personas, camiones), se usa ramificación y acotamiento: el óptimo entero puede estar lejos del redondeo del óptimo continuo.</p>",
    sp:{ title:"Método gráfico, paso a paso",
      params:[{ k:"c1", l:"Utilidad por puerta", v:3000, u:"$" }, { k:"c2", l:"Utilidad por ventana", v:5000, u:"$" }, { k:"b3", l:"Horas de la planta 3", v:18, u:"h" }],
      script(p){ const cons = [[1, 0, 4], [0, 2, 12], [3, 2, p.b3]], V = lpVerts(cons), Z = V.map(v => p.c1 * v[0] + p.c2 * v[1]), k = Z.indexOf(Math.max(...Z)), b = V[k], f = v => "(" + n(v[0], 2) + "; " + n(v[1], 2) + ")";
        return [
          { t:"Modelo", e:"máx Z = " + n(p.c1) + "·x₁ + " + n(p.c2) + "·x₂", s:"x₁ = puertas, x₂ = ventanas. Cada una aporta su utilidad." },
          { t:"Restricciones", e:"x₁ ≤ 4;  2x₂ ≤ 12;  3x₁ + 2x₂ ≤ " + n(p.b3) + ";  x₁, x₂ ≥ 0", s:"Horas de las plantas 1, 2 y 3, y nada negativo." },
          { t:"Recta 1", e:"x₁ = 4", s:"Línea vertical: a la izquierda se cumple." },
          { t:"Recta 2", e:"2x₂ = 12  →  x₂ = 6", s:"Línea horizontal: abajo se cumple." },
          { t:"Recta 3", e:"3x₁ + 2x₂ = " + n(p.b3) + ":  cortes (" + n(p.b3 / 3, 2) + "; 0) y (0; " + n(p.b3 / 2, 2) + ")", h:"cortes", s:"Con dos puntos se dibuja la recta. El origen cumple, así que vale el lado de abajo." },
          { t:"Vértices", e:V.map(f).join("  "), s:"Las esquinas de la región donde se cumplen todas las restricciones." },
          { t:"Evaluar Z", e:V.map((v, i) => f(v) + " → " + n(Z[i])).join(";  "), h:f(b) + " → " + n(Z[k]), s:"Se calcula la utilidad en cada esquina." },
          { t:"Óptimo", e:"x₁ = " + n(b[0], 2) + ", x₂ = " + n(b[1], 2) + ",  Z = $ " + n(Z[k]), h:"Z = $ " + n(Z[k]), s:"Esa es la mejor combinación: " + n(b[0], 2) + " puertas y " + n(b[1], 2) + " ventanas." },
          { t:"Comprobar", e:"Planta 2: 2 · " + n(b[1], 2) + " = " + n(2 * b[1], 2) + " ≤ 12;  Planta 3: 3 · " + n(b[0], 2) + " + 2 · " + n(b[1], 2) + " = " + n(3 * b[0] + 2 * b[1], 2) + " ≤ " + n(p.b3), s:"Las restricciones que quedan en su límite son las activas: ahí está el cuello de botella." }]; } },
    vars:[["xⱼ", "Variable de decisión: cantidad de la actividad j", "unidades", "≥ 0"], ["cⱼ", "Aporte unitario al objetivo (utilidad o costo)", "$ por unidad", "—"], ["Z", "Valor de la función objetivo", "$", "—"], ["aᵢⱼ", "Consumo del recurso i por unidad de j (coeficiente técnico)", "recurso por unidad", "≥ 0"], ["bᵢ", "Disponibilidad del recurso i (lado derecho)", "unidades del recurso", "—"], ["yᵢ", "Precio sombra del recurso i", "$ por unidad del recurso", "≥ 0 en máx con ≤"]],
    sup:"<ul><li><b>Proporcionalidad:</b> el doble de puertas da el doble de utilidad y usa el doble de horas.</li><li><b>Aditividad:</b> el total es la suma de los aportes.</li><li><b>Divisibilidad:</b> se aceptan decimales (si no, programación entera).</li><li><b>Certeza:</b> los coeficientes se conocen.</li></ul>",
    ex:{ t:"Puertas (x₁) dejan $ 3.000 y ventanas (x₂) $ 5.000. Restricciones: x₁ ≤ 4 (planta 1), 2x₂ ≤ 12 (planta 2) y 3x₁ + 2x₂ ≤ 18 (planta 3).",
      steps:[["Dibujo las tres restricciones y la región factible.", "Para ver todas las combinaciones posibles.", "Un polígono con vértices (0; 0), (4; 0), (4; 3), (2; 6) y (0; 6).", "Cualquier punto dentro es un plan de producción que cabe en las plantas."],
        ["Evalúo Z en cada vértice.", "El óptimo está en una esquina.", "0; 12.000; 27.000; 36.000; 30.000.", "La mejor esquina es (2; 6) con $ 36.000."],
        ["Reviso qué restricciones quedan en su límite.", "Para encontrar los cuellos de botella.", "Plantas 2 y 3 activas (12 de 12 h y 18 de 18 h); planta 1 usa 2 de 4 h.", "La planta 1 tiene capacidad ociosa; las plantas 2 y 3 limitan la utilidad."],
        ["Leo los precios sombra del Simplex.", "Para saber dónde conviene invertir.", "1.500 por hora de planta 2; 1.000 por hora de planta 3; 0 para planta 1.", "Una hora extra en la planta 2 vale hasta $ 1.500; pagar más por ella no conviene."]],
      r:"fabricar 2 puertas y 6 ventanas para ganar $ 36.000. Si se quiere crecer, ampliar la planta 2 es lo que más rinde." },
    real:"<p>La programación lineal se usa a diario en refinerías (mezcla de crudos), en la minería (plan de extracción y mezcla de minerales), en la industria forestal (cortes de trozos), en la planificación de turnos y en la logística (asignación de flota). En Chile, la planificación de la minería a cielo abierto y la programación de centrales del sistema eléctrico se apoyan en modelos de optimización de este tipo.</p>",
    sim:"pl",
    chk(){ const V = lpVerts([[1, 0, 4], [0, 2, 12], [3, 2, 18]]), Z = V.map(v => 3000 * v[0] + 5000 * v[1]); return [["Z*", Math.max(...Z), 36000], ["vértices", V.length, 5]]; },
    quiz:[["El óptimo de un problema de programación lineal (si existe) está:", ["En el centro de la región factible", "En un vértice de la región factible", "Siempre en el origen", "Fuera de la región factible"], 1, "Al mover la recta de la función objetivo, el último punto que toca la región es una esquina."],
      ["Una restricción tiene holgura en el óptimo. Su precio sombra es:", ["Positivo y alto", "Cero", "Negativo", "Igual al lado derecho"], 1, "Si el recurso sobra, una unidad más no cambia la utilidad."],
      ["Si las variables deben ser números enteros (camiones), lo correcto es:", ["Redondear el óptimo continuo", "Usar programación entera", "Ignorar la restricción", "Duplicar las variables"], 1, "Redondear puede dar una solución infactible o lejos del óptimo entero."]],
    dec:"cuánto producir de cada producto, qué recurso es el cuello de botella y cuánto vale ampliar cada recurso.",
    pre:["ramo-intro-optimizacion"], rel:["transporte", "asignacion", "sim-optimizacion"] };

  CSIM.pl = { title:"Región factible restricción por restricción y recta de Z hasta el óptimo",
    goal:"cómo cada restricción recorta las posibilidades, por qué el óptimo queda en una esquina y cómo cambia esa esquina si cambian las utilidades o la capacidad.",
    params:[{ k:"c1", l:"Utilidad por puerta (c₁)", min:500, max:10000, step:500, v:3000, u:"$", help:"Súbela y mira cómo gira la recta de Z." },
      { k:"c2", l:"Utilidad por ventana (c₂)", min:500, max:10000, step:500, v:5000, u:"$", help:"Cambia la inclinación de la recta de utilidad." },
      { k:"b3", l:"Horas de la planta 3", min:6, max:30, step:1, v:18, u:"h", help:"Mueve la restricción 3x₁ + 2x₂ ≤ b₃." }],
    init(){ return { t:0 }; }, onParam(s){ s.t = Math.max(s.t, 4.2); },
    tick(s, p, dt){ s.t += dt; if (s.t > 11) s.t = 0; },
    draw(g, W, H, s, p, C){ const cons = [[1, 0, 4], [0, 2, 12], [3, 2, p.b3]], V = lpVerts(cons), Zs = V.map(v => p.c1 * v[0] + p.c2 * v[1]), k = Zs.indexOf(Math.max(...Zs)), best = V[k];
      const x0 = 46, y0 = H - 34, x1 = W - 16, top = 18, M = 10, X = v => x0 + v / M * (x1 - x0), Y = v => y0 - v / M * (y0 - top); SIMG.axes(g, x0, y0, x1, top, C, "x₁ puertas", "x₂ ventanas");
      g.fillStyle = C.muted; g.font = "11px " + C.font; g.textAlign = "center"; for (let v = 0; v <= M; v += 2) { g.fillText(v, X(v), y0 + 14); g.textAlign = "right"; g.fillText(v, x0 - 6, Y(v) + 4); g.textAlign = "center"; }
      const ph = s.t, lines = [[C.c2, "x₁ ≤ 4", [[4, 0], [4, M]]], [C.c3, "2x₂ ≤ 12", [[0, 6], [M, 6]]], [C.c4, "3x₁ + 2x₂ ≤ " + p.b3, [[0, p.b3 / 2], [p.b3 / 3, 0]]]];
      if (ph > 3.2) { g.fillStyle = C.c1; g.globalAlpha = 0.14; g.beginPath(); V.forEach((v, i) => i ? g.lineTo(X(v[0]), Y(v[1])) : g.moveTo(X(v[0]), Y(v[1]))); g.closePath(); g.fill(); g.globalAlpha = 1; }
      lines.forEach(([col, lab, pts], i) => { if (ph < i * 1) return; const pr = Math.min(1, (ph - i) / 0.8), a = pts[0], b = pts[1], e = [a[0] + (b[0] - a[0]) * pr, a[1] + (b[1] - a[1]) * pr];
        g.save(); g.beginPath(); g.rect(x0, top, x1 - x0, y0 - top); g.clip(); g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); g.moveTo(X(a[0]), Y(a[1])); g.lineTo(X(e[0]), Y(e[1])); g.stroke(); g.restore();
        const lp = i === 0 ? [4.15, 9.2] : i === 1 ? [7.2, 6.25] : [Math.min(9, p.b3 / 3) * 0.55 + 0.4, p.b3 / 2 * 0.45 + 0.6]; SIMG.text(g, lab, X(lp[0]), Y(lp[1]), C.ink, C, "left", true); });
      if (ph > 3.6) V.forEach(v => { g.fillStyle = C.surf; g.strokeStyle = C.ink; g.lineWidth = 1.5; g.beginPath(); g.arc(X(v[0]), Y(v[1]), 4, 0, 7); g.fill(); g.stroke(); });
      if (ph > 4.2) { const Zt = Math.min(1, (ph - 4.2) / 3) * Zs[k], pts = []; if (p.c2) { pts.push([0, Zt / p.c2], [Zt / p.c1, 0]); }
        g.save(); g.beginPath(); g.rect(x0, top, x1 - x0, y0 - top); g.clip(); g.strokeStyle = C.bad; g.lineWidth = 2; g.setLineDash([7, 5]); g.beginPath(); g.moveTo(X(-1), Y((Zt - p.c1 * -1) / p.c2)); g.lineTo(X(M + 1), Y((Zt - p.c1 * (M + 1)) / p.c2)); g.stroke(); g.setLineDash([]); g.restore();
        SIMG.text(g, "Z = " + n(Zt), x1 - 4, top + 12, C.ink, C, "right", true);
        if (ph > 7.2) { g.fillStyle = C.bad; g.beginPath(); g.arc(X(best[0]), Y(best[1]), 7, 0, 7); g.fill(); SIMG.text(g, "Óptimo (" + n(best[0], 2) + "; " + n(best[1], 2) + ")", X(best[0]) + 10, Y(best[1]) - 8, C.ink, C, "left", true); } } },
    metrics(s, p){ const cons = [[1, 0, 4], [0, 2, 12], [3, 2, p.b3]], V = lpVerts(cons), Zs = V.map(v => p.c1 * v[0] + p.c2 * v[1]), k = Zs.indexOf(Math.max(...Zs)), b = V[k], act = cons.map(c => Math.abs(c[0] * b[0] + c[1] * b[1] - c[2]) < 1e-7);
      return [["Puertas x₁", n(b[0], 2)], ["Ventanas x₂", n(b[1], 2)], ["Utilidad Z", "$ " + n(Zs[k])], ["Vértices", n(V.length)], ["Restricciones activas", ["planta 1", "planta 2", "planta 3"].filter((_, i) => act[i]).join(", ") || "ninguna"]]; },
    ann(s, p){ return s.t < 3.2 ? "Se dibujan las restricciones una por una: cada línea recorta lo que se puede hacer." : s.t < 4.2 ? "La zona azul es la región factible: cumple las tres restricciones a la vez." : s.t < 7.2 ? "La recta roja reúne todos los planes con la misma utilidad Z. Se desplaza hacia afuera mientras toque la región." : "El último punto que toca la recta es el óptimo: siempre es una esquina."; },
    concl(s, p){ const V = lpVerts([[1, 0, 4], [0, 2, 12], [3, 2, p.b3]]), Zs = V.map(v => p.c1 * v[0] + p.c2 * v[1]), k = Zs.indexOf(Math.max(...Zs)), b = V[k];
      return "<p>Con estas utilidades y " + p.b3 + " horas en la planta 3, conviene hacer <b>" + n(b[0], 2) + " puertas y " + n(b[1], 2) + " ventanas</b>, con una utilidad de <b>$ " + n(Zs[k]) + "</b>.</p><p><b>Qué demuestra:</b> la recta de utilidad se mueve en paralelo hasta la última esquina que toca. Si cambias mucho las utilidades, la recta gira y el óptimo salta a otra esquina; si cambias poco, el plan no cambia (eso es el análisis de sensibilidad).</p><p><b>Qué decisión informa:</b> el plan de producción y qué capacidad conviene ampliar.</p>"; } };

  /* ===================== TRANSPORTE ===================== */
  const TC = [[8, 6, 10, 9], [9, 12, 13, 7], [14, 9, 16, 5]], TO = [35, 50, 40], TD = [45, 20, 30, 30];
  const nwc = (O, D) => { const o = O.slice(), d = D.slice(), X = O.map(() => D.map(() => 0)); let i = 0, j = 0; while (i < o.length && j < d.length) { const q = Math.min(o[i], d[j]); X[i][j] = q; o[i] -= q; d[j] -= q; if (o[i] === 0) i++; else j++; } return X; };
  const vogel = (Cm, O, D) => { const o = O.slice(), d = D.slice(), X = O.map(() => D.map(() => 0)), rowOn = O.map(() => true), colOn = D.map(() => true);
    const pen = arr => { const s = arr.slice().sort((a, b) => a - b); return s.length > 1 ? s[1] - s[0] : s[0] || 0; };
    while (rowOn.some(x => x) && colOn.some(x => x)) { let best = null;
      rowOn.forEach((on, i) => { if (!on) return; const c = Cm[i].filter((_, j) => colOn[j]); const pv = pen(c); if (!best || pv > best.p) best = { p:pv, r:i }; });
      colOn.forEach((on, j) => { if (!on) return; const c = Cm.map(r => r[j]).filter((_, i) => rowOn[i]); const pv = pen(c); if (!best || pv > best.p) best = { p:pv, c:j }; });
      let i, j; if (best.r != null) { i = best.r; j = colOn.map((on, k) => on ? k : -1).filter(k => k >= 0).reduce((a, k) => Cm[i][k] < Cm[i][a] ? k : a); } else { j = best.c; i = rowOn.map((on, k) => on ? k : -1).filter(k => k >= 0).reduce((a, k) => Cm[k][j] < Cm[a][j] ? k : a); }
      const q = Math.min(o[i], d[j]); X[i][j] += q; o[i] -= q; d[j] -= q; if (o[i] === 0) rowOn[i] = false; else colOn[j] = false; }
    return X; };
  const tcost = X => X.reduce((s, r, i) => s + r.reduce((t, q, j) => t + q * TC[i][j], 0), 0);
  CRS.transporte = {
    kw:"transporte problema de transporte esquina noroeste vogel vam modi costo minimo oferta demanda distribucion plantas clientes",
    ess:{ pts:["Decide cuánto enviar desde cada <b>origen</b> (planta, bodega) a cada <b>destino</b> (cliente) al menor costo.", "Hay una variable por <b>ruta</b>: con 3 orígenes y 4 destinos, 12 variables.", "Se respeta la <b>oferta</b> de cada origen y se cubre la <b>demanda</b> de cada destino.", "Métodos iniciales: esquina noroeste (rápido, malo) y Vogel (casi siempre muy bueno); luego se optimiza."],
      fx:"mín Z = Σᵢ Σⱼ cᵢⱼ · xᵢⱼ   s.a.  Σⱼ xᵢⱼ ≤ Oᵢ,  Σᵢ xᵢⱼ = Dⱼ", when:"hay varios orígenes y destinos, un costo por unidad en cada ruta y cantidades conocidas." },
    intro:{ prob:"<p>Tres plantas (Santiago, Rancagua y Talca) abastecen a cuatro clientes. Cada ruta tiene un costo por tonelada distinto. ¿Desde dónde atender a cada cliente para que el flete total sea el mínimo?</p>",
      anal:"<p>Es como repartir pizzas desde tres locales: cada local tiene un número de pizzas listas y cada casa pide cierta cantidad. Conviene que cada casa la atienda el local más cercano, pero si ese local se queda sin pizzas, otro tiene que cubrir.</p>",
      terms:[["Origen y oferta (Oᵢ)", "Lugar desde donde se envía y cuánto puede enviar."], ["Destino y demanda (Dⱼ)", "Lugar que recibe y cuánto necesita."], ["cᵢⱼ", "Costo de enviar una unidad por la ruta i → j."], ["xᵢⱼ", "Unidades enviadas por la ruta i → j."], ["Balanceado", "Oferta total = demanda total (si no, se agrega un origen o destino ficticio)."], ["Esquina noroeste", "Método inicial que llena la tabla desde la esquina superior izquierda, sin mirar costos."], ["Vogel (VAM)", "Método inicial que prioriza donde equivocarse cuesta más (penalización)."]] },
    adv:"<p><b>Optimización MODI (u-v).</b> Desde una solución inicial se calculan potenciales uᵢ + vⱼ = cᵢⱼ en las rutas usadas y el costo reducido cᵢⱼ − uᵢ − vⱼ en las no usadas. Si alguno es negativo, conviene mover carga a esa ruta por un circuito cerrado. Se repite hasta que ninguno sea negativo.</p><p><b>Degeneración.</b> Una solución básica necesita m + n − 1 rutas usadas (aquí 3 + 4 − 1 = 6). Si hay menos, se agrega una ruta con cantidad cero para poder calcular los potenciales.</p>",
    sp:{ title:"Esquina noroeste y Vogel, paso a paso",
      params:[],
      script(){ const N = nwc(TO, TD), V = vogel(TC, TO, TD);
        return [
          { t:"Datos", e:"Oferta 35 · 50 · 40 = 125;  Demanda 45 · 20 · 30 · 30 = 125", s:"Está balanceado: se envía todo lo que se produce." },
          { t:"Esquina NO", e:"x₁₁ = mín(35; 45) = 35", h:"35", s:"Se parte arriba a la izquierda y se asigna lo máximo posible. Santiago queda sin oferta." },
          { t:"Esquina NO", e:"x₂₁ = 10;  x₂₂ = 20;  x₂₃ = 20", s:"Se baja una fila cuando se agota la oferta y se avanza una columna cuando se cubre la demanda." },
          { t:"Esquina NO", e:"x₃₃ = 10;  x₃₄ = 30   →   costo = $ " + n(tcost(N)), h:"$ " + n(tcost(N)), s:"Es rápida, pero no mira los costos: suele salir cara." },
          { t:"Vogel", e:"Penalización = diferencia entre los dos costos más bajos de cada fila y columna", s:"Mide cuánto se pierde si no se usa la ruta más barata." },
          { t:"Vogel", e:"Mayor penalización → asignar en su ruta más barata", s:"Se atiende primero donde equivocarse cuesta más. Se repite hasta completar." },
          { t:"Vogel", e:"Plan: Santiago→C2 " + V[0][1] + ", →C3 " + V[0][2] + ";  Rancagua→C1 " + V[1][0] + ", →C3 " + V[1][2] + ";  Talca→C2 " + V[2][1] + ", →C4 " + V[2][3], s:"Las rutas usadas son baratas." },
          { t:"Costo", e:"Z = " + V.map((r, i) => r.map((q, j) => q ? q + "·" + TC[i][j] : "").filter(Boolean).join(" + ")).join(" + ") + " = $ " + n(tcost(V)), h:"$ " + n(tcost(V)), s:"Con estos datos Vogel ya es óptimo: la calculadora confirma $ 1.020." },
          { t:"Comparar", e:"$ " + n(tcost(N)) + " (noroeste)  vs  $ " + n(tcost(V)) + " (óptimo):  " + n((tcost(N) / tcost(V) - 1) * 100, 1) + " % más caro", s:"Elegir bien las rutas ahorra casi 16 % del flete." }]; } },
    vars:[["xᵢⱼ", "Unidades enviadas del origen i al destino j", "unidades", "≥ 0"], ["cᵢⱼ", "Costo unitario de la ruta i → j", "$ por unidad", "—"], ["Oᵢ", "Oferta (capacidad) del origen i", "unidades", "—"], ["Dⱼ", "Demanda del destino j", "unidades", "—"], ["m, n", "Número de orígenes y destinos", "—", "—"], ["Z", "Costo total de transporte", "$", "—"]],
    sup:"<ul><li>El costo por unidad de cada ruta es constante (sin descuentos por volumen ni camiones a medio llenar).</li><li>Las cantidades son divisibles; si no, igual se suele obtener solución entera porque los datos son enteros.</li><li>No hay límites de capacidad en las rutas (si los hay, se modela como flujo en redes).</li></ul>",
    ex:{ t:"Plantas con oferta 35, 50 y 40 toneladas; clientes con demanda 45, 20, 30 y 30. Costos por tonelada (filas = plantas): 8 6 10 9 / 9 12 13 7 / 14 9 16 5.",
      steps:[["Verifico que oferta = demanda (125 = 125).", "El modelo estándar lo necesita.", "Balanceado.", "No sobra ni falta producto."],
        ["Armo una solución inicial con la esquina noroeste.", "Es la forma más simple de tener un plan factible.", "Costo $ 1.180.", "Cumple, pero manda carga por rutas caras (Talca → Cliente 3 a $ 16)."],
        ["Armo una solución con Vogel.", "Prioriza las decisiones con mayor penalización.", "Costo $ 1.020.", "Talca atiende al Cliente 4 ($ 5) y Rancagua al Cliente 1 ($ 9)."],
        ["Verifico optimalidad (MODI en la calculadora).", "Para saber si se puede bajar más.", "No hay costos reducidos negativos: $ 1.020 es el óptimo.", "Se ahorran $ 160 por despacho (13,6 % menos que la esquina noroeste)."]],
      r:"usar el plan de Vogel: el costo baja de $ 1.180 a $ 1.020 por despacho, un 13,6 % menos (la esquina noroeste es 15,7 % más cara que el óptimo)." },
    real:"<p>Las empresas de consumo masivo y las cementeras resuelven modelos de transporte (o su versión con capacidades) para decidir qué centro de distribución atiende a cada zona. Al abrir o cerrar una bodega, el modelo se vuelve a correr para ver el impacto en el costo total de distribución.</p>",
    sim:"tr",
    chk(){ return [["Noroeste", tcost(nwc(TO, TD)), 1180], ["Vogel", tcost(vogel(TC, TO, TD)), 1020]]; },
    quiz:[["Con 3 plantas y 5 clientes, el modelo de transporte tiene:", ["8 variables", "15 variables", "3 variables", "5 variables"], 1, "Una variable por ruta: 3 × 5 = 15."],
      ["Si la oferta total supera la demanda total, se agrega:", ["Un origen ficticio", "Un destino ficticio con costo 0", "Una variable binaria", "Nada"], 1, "El destino ficticio recibe el sobrante sin costo."],
      ["¿Por qué la esquina noroeste suele dar costos altos?", ["Porque es infactible", "Porque no considera los costos al asignar", "Porque usa demasiadas rutas", "Porque no balancea"], 1, "Asigna por posición en la tabla, no por costo."]],
    dec:"qué planta abastece a cada cliente y cuánto, y cuánto se ahorra frente a un plan hecho «a ojo».",
    pre:["programacion-lineal"], rel:["asignacion", "localizacion", "ruta-corta"] };

  CSIM.tr = { title:"Flujos de transporte: esquina noroeste vs óptimo",
    goal:"cómo cambian las rutas y el costo entre un plan inicial simple y el plan óptimo, y por qué conviene atender a cada cliente desde el origen más barato disponible.",
    params:[{ k:"m", l:"Plan que se muestra", min:0, max:1, step:1, v:1, fmt:v => v ? "Óptimo (Vogel)" : "Esquina noroeste", u:"", help:"0 = esquina noroeste; 1 = óptimo." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t += dt; },
    draw(g, W, H, s, p, C){ const X = p.m ? vogel(TC, TO, TD) : nwc(TO, TD), on = ["Santiago", "Rancagua", "Talca"], dn = ["Cliente 1", "Cliente 2", "Cliente 3", "Cliente 4"];
      const xa = Math.max(60, W * 0.14), xb = W - Math.max(60, W * 0.14), ya = i => 56 + i * (H - 100) / 2, yb = j => 44 + j * (H - 76) / 3, mx = 45;
      X.forEach((r, i) => r.forEach((q, j) => { if (!q) return; g.strokeStyle = TC[i][j] <= 7 ? C.c3 : TC[i][j] <= 10 ? C.c1 : C.c2; g.lineWidth = 1 + q / mx * 9; g.globalAlpha = 0.55; g.beginPath(); g.moveTo(xa, ya(i)); g.lineTo(xb, yb(j)); g.stroke(); g.globalAlpha = 1;
        const cnt = Math.max(1, Math.round(q / 10)); for (let k = 0; k < cnt; k++) { const f = ((s.t * 0.35 + k / cnt) % 1); g.fillStyle = C.ink; g.beginPath(); g.arc(xa + (xb - xa) * f, ya(i) + (yb(j) - ya(i)) * f, 2.6, 0, 7); g.fill(); }
        const f = 0.62 + 0.08 * i, lx = xa + (xb - xa) * f, ly = ya(i) + (yb(j) - ya(i)) * f; g.fillStyle = C.surf; g.globalAlpha = 0.85; g.fillRect(lx - 30, ly - 13, 60, 15); g.globalAlpha = 1; SIMG.text(g, q + " t × $" + TC[i][j], lx, ly - 2, C.ink, C, "center", true); }));
      on.forEach((t, i) => { g.fillStyle = C.c1; g.beginPath(); g.arc(xa, ya(i), 9, 0, 7); g.fill(); SIMG.text(g, t + " (" + TO[i] + ")", xa, ya(i) - 14, C.ink, C, "center", true); });
      dn.forEach((t, j) => { g.fillStyle = C.c2; g.fillRect(xb - 8, yb(j) - 8, 16, 16); SIMG.text(g, (W < 520 ? "C" + (j + 1) : t) + " (" + TD[j] + ")", xb, yb(j) - 13, C.ink, C, "center", true); }); },
    metrics(s, p){ const N = tcost(nwc(TO, TD)), V = tcost(vogel(TC, TO, TD)), X = p.m ? vogel(TC, TO, TD) : nwc(TO, TD);
      return [["Costo del plan mostrado", "$ " + n(tcost(X))], ["Esquina noroeste", "$ " + n(N)], ["Óptimo", "$ " + n(V)], ["Rutas usadas", n(X.flat().filter(q => q > 0).length)], ["Ahorro del óptimo", n((1 - V / N) * 100, 1) + " %"]]; },
    ann(s, p){ return p.m ? "El óptimo usa rutas baratas (líneas verdes): Talca atiende al Cliente 4 a $ 5 y Rancagua al Cliente 1 a $ 9." : "La esquina noroeste llena la tabla en orden y termina usando rutas caras (líneas naranjas), como Talca → Cliente 3 a $ 16."; },
    concl(){ return "<p>El plan óptimo cuesta <b>$ 1.020</b> frente a <b>$ 1.180</b> de la esquina noroeste: <b>13,6 % menos</b>.</p><p><b>Qué demuestra:</b> no basta con cumplir oferta y demanda; el orden en que se asignan las rutas define el costo. Los métodos que miran costos (Vogel, MODI) encuentran rutas baratas.</p><p><b>Qué decisión informa:</b> qué origen abastece a cada cliente y el presupuesto de flete.</p>"; } };

  /* ===================== ASIGNACIÓN ===================== */
  const AM = [[15, 10, 9, 14], [9, 15, 10, 12], [10, 12, 8, 11], [13, 11, 14, 10]], AR = ["Ana", "Benjamín", "Camila", "Diego"], AC = ["Torno", "Fresa", "Soldadura", "Pintura"];
  const perms = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).map(r => [x].concat(r)));
  const asgBest = M => { let best = null; perms([0, 1, 2, 3]).forEach(pm => { const c = pm.reduce((s, j, i) => s + M[i][j], 0); if (!best || c < best.c) best = { c, pm }; }); return best; };
  const redRows = M => M.map(r => { const m = Math.min(...r); return r.map(v => v - m); }), redCols = M => { const mins = M[0].map((_, j) => Math.min(...M.map(r => r[j]))); return M.map(r => r.map((v, j) => v - mins[j])); };
  CRS.asignacion = {
    kw:"asignacion problema de asignacion metodo hungaro personas tareas maquinas uno a uno costo minimo",
    ess:{ pts:["Asigna <b>uno a uno</b>: cada persona a una tarea y cada tarea a una persona.", "Busca el menor costo (o tiempo) total, o el mayor puntaje.", "El <b>método húngaro</b> resta mínimos por fila y columna hasta encontrar ceros que formen una asignación.", "Es un caso especial del transporte con ofertas y demandas iguales a 1."],
      fx:"mín Z = Σᵢ Σⱼ cᵢⱼ xᵢⱼ;  Σⱼ xᵢⱼ = 1;  Σᵢ xᵢⱼ = 1;  xᵢⱼ ∈ {0, 1}", when:"hay el mismo número de personas que de tareas (si no, se agregan filas o columnas ficticias) y cada una se asigna a una sola." },
    intro:{ prob:"<p>Un taller tiene 4 operarios y 4 máquinas. Cada operario demora distinto en cada máquina. ¿A qué máquina va cada uno para que el tiempo total sea el mínimo?</p>",
      anal:"<p>Es como elegir posiciones en un equipo de fútbol: cada jugador rinde distinto en cada puesto, y cada puesto lo ocupa uno solo. Buscas la formación con el mejor rendimiento total.</p>",
      terms:[["Matriz de costos", "Tabla con el costo (o tiempo) de cada persona en cada tarea."], ["xᵢⱼ", "Vale 1 si la persona i hace la tarea j, y 0 si no."], ["Reducción", "Restar el mínimo de cada fila (y después de cada columna) para crear ceros."], ["Cobertura", "Tapar todos los ceros con el menor número de líneas: si se necesitan n líneas, hay solución."]] },
    adv:"<p><b>Por qué funciona la reducción:</b> restar una constante a una fila no cambia qué asignación es la mejor, porque esa persona igual tendrá una tarea. Lo mismo con las columnas. Al final, una asignación sobre ceros tiene costo reducido cero: no puede haber otra mejor.</p><p><b>Maximizar:</b> se convierte restando cada valor del máximo de la matriz. <b>Prohibiciones:</b> una persona que no puede hacer una tarea lleva un costo muy grande (M).</p>",
    sp:{ title:"Método húngaro, paso a paso",
      params:[{ k:"af", l:"Costo de Ana en Fresa", v:10, u:"min" }],
      script(p){ const M = AM.map(r => r.slice()); M[0][1] = p.af; const R = redRows(M), Cm = redCols(R), b = asgBest(M);
        return [
          { t:"Matriz", e:M.map((r, i) => AR[i] + ": " + r.join(" ")).join("  |  "), s:"Filas = operarios; columnas = Torno, Fresa, Soldadura y Pintura." },
          { t:"Reducir filas", e:"Mínimos por fila: " + M.map(r => Math.min(...r)).join(", "), s:"A cada fila se le resta su menor valor." },
          { t:"Resultado", e:R.map((r, i) => AR[i] + ": " + r.join(" ")).join("  |  "), s:"Ahora cada fila tiene al menos un cero." },
          { t:"Reducir columnas", e:"Mínimos por columna: " + R[0].map((_, j) => Math.min(...R.map(r => r[j]))).join(", "), s:"Se repite por columnas." },
          { t:"Resultado", e:Cm.map((r, i) => AR[i] + ": " + r.join(" ")).join("  |  "), s:"Se buscan ceros que permitan una asignación uno a uno." },
          { t:"Asignar", e:b.pm.map((j, i) => AR[i] + " → " + AC[j]).join(";  "), h:b.pm.map((j, i) => AR[i] + " → " + AC[j]).join(";  "), s:"Si alcanzan los ceros, la asignación es óptima. Si no, se cubren los ceros con líneas y se ajusta (la calculadora lo hace)." },
          { t:"Costo", e:"Z = " + b.pm.map((j, i) => M[i][j]).join(" + ") + " = " + b.c, h:"= " + b.c, s:"Tiempo total mínimo." }]; } },
    vars:[["cᵢⱼ", "Costo o tiempo de la persona i en la tarea j", "$ o minutos", "—"], ["xᵢⱼ", "1 si i hace j; 0 si no", "—", "0 o 1"], ["n", "Número de personas (= tareas)", "—", "—"], ["Z", "Costo total", "$ o minutos", "—"]],
    sup:"<ul><li>Cada persona hace una sola tarea y cada tarea la hace una sola persona.</li><li>Matriz cuadrada (si no, se agregan filas o columnas ficticias con costo 0).</li><li>Costos independientes: el costo de Ana en Fresa no depende de quién esté en Torno.</li></ul>",
    ex:{ t:"Tiempos (minutos) de Ana, Benjamín, Camila y Diego en Torno, Fresa, Soldadura y Pintura: 15 10 9 14 / 9 15 10 12 / 10 12 8 11 / 13 11 14 10.",
      steps:[["Resto el mínimo de cada fila (9, 9, 8, 10).", "Crear ceros sin cambiar cuál es la mejor asignación.", "Cada fila tiene un cero.", "Es la tarea en que cada uno es relativamente mejor."],
        ["Resto el mínimo de cada columna.", "Asegurar un cero por columna.", "Matriz reducida con ceros en varias posiciones.", "Los ceros son candidatos a asignación."],
        ["Busco una asignación uno a uno sobre ceros.", "Si existe, es óptima.", "Ana → Fresa, Benjamín → Torno, Camila → Soldadura, Diego → Pintura.", "Ana no va a su mejor tarea (Soldadura, 9), porque Camila es aún mejor ahí."],
        ["Sumo los tiempos originales.", "Para obtener el total.", "10 + 9 + 8 + 10 = 37 minutos.", "Es el menor tiempo total posible entre las 24 combinaciones."]],
      r:"asignar Ana a Fresa, Benjamín a Torno, Camila a Soldadura y Diego a Pintura, con 37 minutos en total." },
    real:"<p>Se usa para asignar camiones a rutas, médicos a turnos, vendedores a zonas y proyectos a equipos. En licitaciones de transporte escolar o de recolección, el modelo de asignación ayuda a repartir recorridos entre proveedores al menor costo.</p>",
    sim:"as",
    chk(){ return [["Costo óptimo", asgBest(AM).c, 37]]; },
    quiz:[["¿Por qué se puede restar el mínimo de cada fila sin cambiar la solución óptima?", ["Porque cambia el costo total en la misma cantidad para todas las asignaciones", "Porque elimina tareas", "Porque la matriz se vuelve simétrica", "No se puede"], 0, "Toda asignación usa exactamente un valor de cada fila: todas bajan lo mismo."],
      ["Hay 5 operarios y 4 máquinas. Se agrega:", ["Una fila ficticia", "Una columna ficticia con costo 0", "Una restricción ≥", "Nada"], 1, "La máquina ficticia «asigna» al operario que queda libre."],
      ["Para maximizar puntajes con el método húngaro:", ["Se usa igual", "Se resta cada valor del máximo y se minimiza", "Se cambian filas por columnas", "No se puede"], 1, "Se convierte en un problema de pérdida de oportunidad."]],
    dec:"quién hace cada tarea para minimizar tiempo o costo total, o maximizar un puntaje.",
    pre:["transporte"], rel:["transporte", "programacion-lineal"] };

  CSIM.as = { title:"Método húngaro: reducción de filas y columnas hasta la asignación",
    goal:"cómo la reducción crea ceros sin cambiar la mejor asignación, y cómo un cambio en un costo cambia quién va a cada tarea.",
    params:[{ k:"af", l:"Tiempo de Ana en Fresa", min:5, max:20, step:1, v:10, u:"min", help:"Súbelo: llega un punto en que Ana deja de ir a Fresa." }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0; }, tick(s, p, dt){ s.t += dt; if (s.t > 10) s.t = 0; },
    draw(g, W, H, s, p, C){ const M = AM.map(r => r.slice()); M[0][1] = p.af; const ph = s.t < 2.5 ? 0 : s.t < 5 ? 1 : s.t < 7.5 ? 2 : 3, show = ph === 0 ? M : ph === 1 ? redRows(M) : redCols(redRows(M)), b = asgBest(M);
      const lw = Math.min(110, W * 0.25), cw = (W - lw - 10) / 4, rh = Math.min(52, (H - 70) / 5), y0 = 30;
      SIMG.text(g, ["1. Matriz original", "2. Restar el mínimo de cada fila", "3. Restar el mínimo de cada columna", "4. Asignación óptima (costo " + b.c + ")"][ph], 4, 16, C.ink, C, "left", true);
      AC.forEach((t, j) => SIMG.text(g, t, lw + j * cw + cw / 2, y0 + rh * 0.6, C.muted, C, "center", true));
      show.forEach((r, i) => { const y = y0 + rh * (i + 1); SIMG.text(g, AR[i], 4, y + rh * 0.6, C.ink, C, "left", true);
        r.forEach((v, j) => { const x = lw + j * cw, sel = ph === 3 && b.pm[i] === j; g.fillStyle = sel ? C.c3 : v === 0 && ph > 0 ? C.c2 : C.bg; g.globalAlpha = sel ? 0.35 : v === 0 && ph > 0 ? 0.25 : 1; g.fillRect(x + 3, y + 3, cw - 6, rh - 6); g.globalAlpha = 1;
          SIMG.text(g, ph === 3 ? M[i][j] : v, x + cw / 2, y + rh * 0.62, C.ink, C, "center", sel || v === 0); }); }); },
    metrics(s, p){ const M = AM.map(r => r.slice()); M[0][1] = p.af; const b = asgBest(M); return b.pm.map((j, i) => [AR[i], AC[j] + " (" + M[i][j] + ")"]).concat([["Total", b.c + " min"]]); },
    ann(s){ return s.t < 2.5 ? "Cada número es el tiempo de un operario en una máquina." : s.t < 5 ? "Se resta el menor valor de cada fila: aparecen ceros (naranjos)." : s.t < 7.5 ? "Se resta el menor valor de cada columna: más ceros." : "La asignación óptima (verde) queda sobre ceros de la matriz reducida."; },
    concl(s, p){ const M = AM.map(r => r.slice()); M[0][1] = p.af; const b = asgBest(M); return "<p>La mejor asignación tiene un total de <b>" + b.c + " minutos</b>: " + b.pm.map((j, i) => AR[i] + " → " + AC[j]).join(", ") + ".</p><p><b>Qué demuestra:</b> la mejor asignación no siempre pone a cada persona en su tarea más rápida; importa el conjunto. Si Ana se vuelve lenta en Fresa, toda la asignación se reacomoda.</p><p><b>Qué decisión informa:</b> quién hace cada tarea en un turno, ruta o proyecto.</p>"; } };

  /* ===================== CPM / PERT ===================== */
  const ACT0 = [["A", [], 2, 4, 6], ["B", [], 3, 5, 9], ["C", ["A"], 4, 5, 7], ["D", ["A"], 4, 6, 10], ["E", ["B", "C"], 4, 5, 7], ["F", ["D"], 3, 4, 8], ["G", ["E"], 3, 5, 8], ["H", ["F", "G"], 1, 2, 3]];
  const cpmRun = (mD) => { const A = ACT0.map(a => ({ id:a[0], pre:a[1], a:a[2], m:a[0] === "D" ? mD : a[3], b:a[4] })); A.forEach(x => { x.te = (x.a + 4 * x.m + x.b) / 6; x.v = ((x.b - x.a) / 6) ** 2; });
    const by = Object.fromEntries(A.map(x => [x.id, x])); A.forEach(x => { x.es = Math.max(0, ...x.pre.map(p => by[p].ef)); x.ef = x.es + x.te; }); const T = Math.max(...A.map(x => x.ef));
    for (let i = A.length - 1; i >= 0; i--) { const x = A[i], suc = A.filter(y => y.pre.includes(x.id)); x.lf = suc.length ? Math.min(...suc.map(y => y.ls)) : T; x.ls = x.lf - x.te; x.sl = x.ls - x.es; }
    const crit = A.filter(x => x.sl < 1e-9), sig = Math.sqrt(crit.reduce((s, x) => s + x.v, 0)); return { A, T, crit, sig }; };
  const Phi = z => { const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2), p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
  CRS.cpm = {
    kw:"cpm pert ruta critica holgura proyecto red de actividades carta gantt duracion esperada probabilidad de terminar plazo",
    ess:{ pts:["La <b>ruta crítica</b> es la secuencia más larga de actividades: define la duración del proyecto.", "Las actividades críticas tienen <b>holgura cero</b>: si se atrasan, se atrasa todo.", "PERT estima cada duración con tres valores: te = (a + 4m + b) ÷ 6.", "Con PERT se calcula la <b>probabilidad</b> de terminar antes de un plazo."],
      fx:"te = (a + 4m + b) ÷ 6;   Holgura = IL − IC;   z = (T − Te) ÷ σ", when:"un proyecto tiene actividades con precedencias claras y quieres saber su duración, qué vigilar y qué probabilidad hay de cumplir un plazo." },
    intro:{ prob:"<p>Una empresa instala una línea nueva: 8 actividades, algunas pueden hacerse en paralelo y otras deben esperar a que terminen las anteriores. El cliente pide terminar en 22 semanas.</p><p><b>¿Cuánto durará el proyecto, qué actividades no pueden atrasarse y qué probabilidad hay de cumplir?</b></p>",
      anal:"<p>Es como preparar un asado: mientras se calienta el carbón (30 min) puedes preparar las ensaladas (15 min). La ensalada tiene holgura: puede esperar. El carbón no: si se atrasa, se atrasa la comida. El carbón está en la ruta crítica.</p>",
      terms:[["Precedencia", "Actividad que debe terminar antes de que empiece otra."], ["IC / TC", "Inicio y término más tempranos (pasada hacia adelante)."], ["IL / TL", "Inicio y término más tardíos sin atrasar el proyecto (pasada hacia atrás)."], ["Holgura total", "Cuánto puede atrasarse una actividad sin atrasar el proyecto: IL − IC."], ["a, m, b", "Duración optimista, más probable y pesimista (PERT)."], ["σ del proyecto", "Desviación de la duración: raíz de la suma de varianzas de la ruta crítica."]] },
    adv:"<p><b>Compresión (crashing).</b> Para acortar el proyecto se aceleran actividades críticas, empezando por la de menor costo por día ahorrado. Al acortar, puede aparecer otra ruta crítica.</p><p><b>Limitación de PERT:</b> considera solo la ruta crítica para la probabilidad. Si hay rutas casi críticas con mucha varianza, la probabilidad real de cumplir es menor; la simulación Monte Carlo lo captura mejor.</p>",
    sp:{ title:"CPM y PERT, paso a paso",
      params:[{ k:"T", l:"Plazo comprometido", v:22, u:"semanas" }],
      script(p){ const r = cpmRun(6), A = Object.fromEntries(r.A.map(x => [x.id, x])), z = (p.T - r.T) / r.sig;
        return [
          { t:"PERT", e:"te = (a + 4m + b) ÷ 6", s:"Se pondera más la duración más probable." },
          { t:"Ejemplo", e:"B: (3 + 4·5 + 9) ÷ 6 = " + n(A.B.te, 2), h:n(A.B.te, 2), s:"B tiene un pesimista largo (9): su te sube sobre 5." },
          { t:"Adelante", e:"IC = máx(TC de las precedentes);  TC = IC + te", s:"Se recorre la red de izquierda a derecha." },
          { t:"Adelante", e:"E empieza en máx(TC_B = " + n(A.B.ef, 2) + "; TC_C = " + n(A.C.ef, 2) + ") = " + n(A.E.es, 2), h:n(A.E.es, 2), s:"E debe esperar a B y C: manda la que termina más tarde." },
          { t:"Duración", e:"Te = TC de H = " + n(r.T, 2) + " semanas", h:n(r.T, 2), s:"Es la duración esperada del proyecto." },
          { t:"Atrás", e:"TL = mín(IL de las sucesoras);  IL = TL − te", s:"Se recorre de derecha a izquierda." },
          { t:"Holgura", e:"B: " + n(A.B.ls, 2) + " − 0 = " + n(A.B.sl, 2) + ";  D: " + n(A.D.sl, 2) + ";  F: " + n(A.F.sl, 2), s:"Estas actividades pueden atrasarse un poco sin afectar el término." },
          { t:"Ruta crítica", e:r.crit.map(x => x.id).join(" → "), h:r.crit.map(x => x.id).join(" → "), s:"Actividades con holgura cero." },
          { t:"σ", e:"σ = √(Σ varianzas críticas) = " + n(r.sig, 3), s:"Cada varianza es ((b − a) ÷ 6)²." },
          { t:"Probabilidad", e:"z = (" + n(p.T) + " − " + n(r.T, 2) + ") ÷ " + n(r.sig, 3) + " = " + n(z, 3) + "  →  P = " + n(Phi(z) * 100, 1) + " %", h:"P = " + n(Phi(z) * 100, 1) + " %", s:"Probabilidad de terminar en " + n(p.T) + " semanas o menos." }]; } },
    vars:[["a, m, b", "Duraciones optimista, más probable y pesimista", "semanas", "a ≤ m ≤ b"], ["te", "Duración esperada (PERT)", "semanas", "—"], ["σ²", "Varianza de una actividad: ((b − a) ÷ 6)²", "semanas²", "—"], ["IC, TC", "Inicio y término tempranos", "semana", "—"], ["IL, TL", "Inicio y término tardíos", "semana", "—"], ["HT", "Holgura total (IL − IC)", "semanas", "≥ 0"], ["Te", "Duración esperada del proyecto", "semanas", "—"], ["z", "Valor normal del plazo: (T − Te) ÷ σ", "—", "—"]],
    sup:"<ul><li>Las precedencias son conocidas y fijas.</li><li>Recursos ilimitados (si dos actividades usan el mismo equipo, hay que nivelar recursos).</li><li>PERT supone duraciones independientes y una ruta crítica dominante.</li></ul>",
    ex:{ t:"8 actividades (A a H) con duraciones optimista, probable y pesimista. El cliente exige 22 semanas.",
      steps:[["Calculo te de cada actividad con PERT.", "Resume la incertidumbre de cada duración.", "Por ejemplo, A = 4,00, B = 5,33, D = 6,33.", "B y D tienen pesimistas largos: conviene vigilar sus riesgos."],
        ["Hago la pasada hacia adelante.", "Para conocer el término más temprano.", "Te = 21,5 semanas.", "En promedio se cumple el plazo de 22, por poco."],
        ["Hago la pasada hacia atrás y calculo holguras.", "Para saber qué no puede atrasarse.", "Ruta crítica A → C → E → G → H; B tiene 3,83 de holgura y D y F 4,67.", "El jefe de proyecto vigila A, C, E, G y H todos los días."],
        ["Calculo σ y la probabilidad de cumplir 22 semanas.", "Para comprometer un plazo con datos.", "σ = 1,323; z = 0,378; P = 64,7 %.", "Hay 35 % de riesgo de atrasarse: conviene negociar 24 semanas (P ≈ 98 %) o acelerar actividades críticas."]],
      r:"el proyecto dura 21,5 semanas en promedio, con 64,7 % de probabilidad de terminar en 22. Las actividades A, C, E, G y H no tienen holgura." },
    real:"<p>CPM/PERT se usa en construcción, en paradas de planta (mantenciones mayores de una concentradora o refinería, donde cada hora detenida cuesta mucho) y en proyectos de TI. Herramientas como MS Project o Primavera calculan la ruta crítica automáticamente; entender el cálculo permite interpretar sus alertas.</p>",
    sim:"cpm",
    chk(){ const r = cpmRun(6); return [["Duración", r.T, 21.5], ["σ", r.sig, 1.3228756555322954], ["P(22)", Phi((22 - r.T) / r.sig) * 100, 64.72715449573461]]; },
    quiz:[["La ruta crítica es:", ["La que tiene más actividades", "La secuencia más larga, que define la duración del proyecto", "La de actividades más caras", "La más corta"], 1, "Cualquier atraso en ella atrasa el término."],
      ["Una actividad tiene holgura total de 3 semanas. Si se atrasa 2 semanas:", ["El proyecto se atrasa 2 semanas", "El proyecto no se atrasa", "El proyecto se atrasa 3 semanas", "Se vuelve crítica y se atrasa todo"], 1, "Mientras el atraso no supere la holgura, el término no cambia (aunque la holgura disponible disminuye)."],
      ["Con a = 2, m = 4, b = 12, la duración PERT es:", ["4", "5", "6", "6,67"], 1, "te = (2 + 16 + 12) ÷ 6 = 30 ÷ 6 = 5."]],
    dec:"qué actividades vigilar, qué plazo comprometer y dónde invertir para acortar el proyecto.",
    pre:["descriptiva"], rel:["sim-proyectos", "simulacion-mc"] };

  CSIM.cpm = { title:"Carta Gantt con ruta crítica que se ilumina",
    goal:"cómo la ruta crítica define la duración, qué significa la holgura y cómo un atraso en una actividad no crítica puede volverla crítica.",
    params:[{ k:"mD", l:"Duración probable de D", min:3, max:14, step:0.5, v:6, u:"sem", help:"D no es crítica al principio. Súbela y mira cuándo cambia la ruta crítica." }, { k:"T", l:"Plazo comprometido", min:18, max:28, step:0.5, v:22, u:"sem", help:"Línea vertical del plazo." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t += dt * 3; const r = cpmRun(p.mD); if (s.t > r.T + 6) s.t = 0; },
    draw(g, W, H, s, p, C){ const r = cpmRun(p.mD), lw = 34, x0 = lw, x1 = W - 10, top = 20, rh = (H - top - 30) / r.A.length, Tm = Math.max(r.T, p.T) * 1.08, X = v => x0 + v / Tm * (x1 - x0);
      for (let w = 0; w <= Tm; w += 2) { g.strokeStyle = C.line; g.globalAlpha = 0.5; g.beginPath(); g.moveTo(X(w), top); g.lineTo(X(w), H - 28); g.stroke(); g.globalAlpha = 1; SIMG.text(g, w, X(w), H - 14, C.muted, C, "center"); }
      r.A.forEach((a, i) => { const y = top + i * rh + 4, h = rh - 8, crit = a.sl < 1e-9; SIMG.text(g, a.id, 12, y + h * 0.7, C.ink, C, "center", true);
        if (!crit) { g.strokeStyle = C.muted; g.setLineDash([3, 3]); g.strokeRect(X(a.ef), y + h * 0.3, X(a.lf) - X(a.ef), h * 0.4); g.setLineDash([]); }
        g.fillStyle = crit ? C.c2 : C.c1; g.globalAlpha = 0.28; g.fillRect(X(a.es), y, X(a.ef) - X(a.es), h); g.globalAlpha = 1; const done = Math.max(0, Math.min(a.ef, s.t) - a.es); g.fillStyle = crit ? C.c2 : C.c1; g.fillRect(X(a.es), y, done / Tm * (x1 - x0), h);
        if (crit) { g.strokeStyle = C.c2; g.lineWidth = 2; g.strokeRect(X(a.es), y, X(a.ef) - X(a.es), h); } });
      g.strokeStyle = C.bad; g.lineWidth = 2; g.beginPath(); g.moveTo(X(p.T), top - 6); g.lineTo(X(p.T), H - 28); g.stroke(); SIMG.text(g, "Plazo " + n(p.T, 1), X(p.T) - 4, top - 8, C.ink, C, "right", true);
      g.strokeStyle = C.ink; g.lineWidth = 1; g.beginPath(); g.moveTo(X(Math.min(s.t, r.T)), top); g.lineTo(X(Math.min(s.t, r.T)), H - 28); g.stroke(); },
    metrics(s, p){ const r = cpmRun(p.mD), z = (p.T - r.T) / r.sig; return [["Duración esperada", n(r.T, 2) + " sem"], ["Ruta crítica", r.crit.map(x => x.id).join("-")], ["σ del proyecto", n(r.sig, 3)], ["P(cumplir el plazo)", n(Phi(z) * 100, 1) + " %"], ["Holgura de D", n(r.A[3].sl, 2) + " sem"]]; },
    ann(s, p){ const r = cpmRun(p.mD); return r.crit.some(x => x.id === "D") ? "D se volvió crítica: su atraso consumió toda la holgura y ahora atrasa el proyecto." : "Las barras naranjas con borde son críticas. Las azules tienen holgura (recuadro punteado): pueden atrasarse hasta ese límite sin afectar el término."; },
    concl(s, p){ const r = cpmRun(p.mD), z = (p.T - r.T) / r.sig; return "<p>El proyecto dura <b>" + n(r.T, 2) + " semanas</b> en promedio, por la ruta <b>" + r.crit.map(x => x.id).join(" → ") + "</b>. La probabilidad de cumplir " + n(p.T, 1) + " semanas es <b>" + n(Phi(z) * 100, 1) + " %</b>.</p><p><b>Qué demuestra:</b> la duración la fija la ruta más larga. Una actividad con holgura puede atrasarse sin efecto hasta agotar su holgura; desde ahí se vuelve crítica.</p><p><b>Qué decisión informa:</b> qué vigilar, qué plazo comprometer y dónde acelerar.</p>"; } };

  /* ===================== COLAS M/M/s ===================== */
  const mms = (lam, mu, s) => { const r = lam / mu, rho = lam / (s * mu); if (rho >= 1) return { rho, ok:false }; let sum = 0; for (let k = 0; k < s; k++) sum += r ** k / fact(k);
    const P0 = 1 / (sum + r ** s / (fact(s) * (1 - rho))), Lq = P0 * r ** s * rho / (fact(s) * (1 - rho) ** 2), Wq = Lq / lam, W = Wq + 1 / mu, L = lam * W, Pw = r ** s / (fact(s) * (1 - rho)) * P0; return { rho, P0, Lq, Wq, W, L, Pw, ok:true }; };
  CRS.colas = {
    kw:"colas teoria de colas lineas de espera mm1 mms m/m/s lambda mu rho utilizacion ley de little erlang espera servidores",
    ess:{ pts:["Modela una <b>fila de espera</b>: clientes que llegan (λ por hora) y servidores que atienden (μ por hora cada uno).", "La <b>utilización</b> ρ = λ ÷ (s · μ) debe ser menor que 1; si no, la fila crece sin límite.", "Cerca de ρ = 1 la espera <b>explota</b>: con 92 % de utilización se espera mucho más que con 70 %.", "La <b>ley de Little</b> une todo: L = λ · W."],
      fx:"ρ = λ ÷ (s · μ);   L = λ · W;   Lq = λ · Wq", when:"los clientes llegan al azar (proceso de Poisson), los tiempos de atención son variables y quieres decidir cuántos servidores poner." },
    intro:{ prob:"<p>Una sucursal recibe 22 clientes por hora. Cada ejecutivo atiende 8 por hora y hay 3 ejecutivos. Parece suficiente (24 de capacidad), pero los clientes reclaman esperas de más de 20 minutos.</p><p><b>¿Por qué se forma tanta fila si la capacidad alcanza, y cuántos ejecutivos conviene tener?</b></p>",
      anal:"<p>Es como una autopista: con poco tráfico avanzas sin problemas; cuando está al 90 % de su capacidad, cualquier frenazo genera un taco enorme. No es que no quepan los autos: es que la variabilidad no deja que el sistema se recupere.</p>",
      terms:[["λ (lambda)", "Tasa de llegada: clientes por hora."], ["μ (mu)", "Tasa de servicio de un servidor: clientes que atiende por hora."], ["s", "Número de servidores."], ["ρ (rho)", "Utilización: fracción del tiempo que los servidores están ocupados."], ["L, Lq", "Clientes promedio en el sistema y en la cola."], ["W, Wq", "Tiempo promedio en el sistema y esperando en la cola."]] },
    adv:"<p><b>Notación de Kendall (A/B/s):</b> M/M/s significa llegadas Poisson, servicio exponencial y s servidores. Si el servicio es muy regular (M/D/1), la cola es la mitad que en M/M/1 con la misma utilización: reducir la variabilidad del servicio reduce la espera.</p><p><b>Costo total:</b> se suma el costo de los servidores (s · Cs) y el costo de espera (L · Cw) y se elige el s con menor total. En el ejemplo, 4 ejecutivos dan el mínimo ($ 63.556 por hora frente a $ 112.945 con 3).</p>",
    sp:{ title:"Fórmulas de M/M/s, paso a paso",
      params:[{ k:"lam", l:"Llegadas λ", v:22, u:"clientes/h" }, { k:"mu", l:"Servicio por servidor μ", v:8, u:"clientes/h" }, { k:"s", l:"Servidores s", v:3, u:"", step:1 }],
      script(p){ const q = mms(p.lam, p.mu, Math.round(p.s)); if (!q.ok) return [{ t:"Utilización", e:"ρ = " + n(p.lam) + " ÷ (" + p.s + " · " + n(p.mu) + ") = " + n(q.rho, 3) + " ≥ 1", s:"El sistema no da abasto: la fila crece sin límite. Agrega servidores." }];
        return [
          { t:"Utilización", e:"ρ = λ ÷ (s · μ) = " + n(p.lam) + " ÷ (" + p.s + " · " + n(p.mu) + ") = " + n(q.rho, 4), h:n(q.rho, 4), s:"Los ejecutivos están ocupados el " + n(q.rho * 100, 1) + " % del tiempo." },
          { t:"Sistema vacío", e:"P₀ = [Σ (λ/μ)ⁿ ÷ n! + (λ/μ)ˢ ÷ (s! (1 − ρ))]⁻¹ = " + n(q.P0, 5), s:"Probabilidad de que no haya nadie: base para lo demás." },
          { t:"Cola", e:"Lq = P₀ · (λ/μ)ˢ · ρ ÷ (s! (1 − ρ)²) = " + n(q.Lq, 2) + " clientes", h:n(q.Lq, 2), s:"El término (1 − ρ)² en el denominador hace que Lq explote cuando ρ se acerca a 1." },
          { t:"Little", e:"Wq = Lq ÷ λ = " + n(q.Lq, 3) + " ÷ " + n(p.lam) + " = " + n(q.Wq, 4) + " h = " + n(q.Wq * 60, 1) + " min", h:n(q.Wq * 60, 1) + " min", s:"Tiempo promedio esperando en la fila." },
          { t:"Sistema", e:"W = Wq + 1/μ = " + n(q.W * 60, 1) + " min;   L = λ · W = " + n(q.L, 2), s:"Se suma el tiempo de atención (1/μ = " + n(60 / p.mu, 1) + " min)." },
          { t:"Esperar", e:"P(esperar) = " + n(q.Pw * 100, 1) + " %", s:"Fórmula de Erlang C: probabilidad de llegar y encontrar a todos ocupados." }]; } },
    vars:[["λ", "Tasa de llegada", "clientes/hora", "—"], ["μ", "Tasa de servicio de un servidor", "clientes/hora", "—"], ["s", "Número de servidores", "—", "1 a 50"], ["ρ", "Utilización = λ ÷ (s·μ)", "—", "0 a 1 (debe ser < 1)"], ["P₀", "Probabilidad de sistema vacío", "—", "0 a 1"], ["Lq", "Clientes promedio en cola", "clientes", "—"], ["L", "Clientes promedio en el sistema", "clientes", "—"], ["Wq", "Espera promedio en cola", "horas", "—"], ["W", "Tiempo promedio en el sistema", "horas", "—"]],
    sup:"<ul><li>Llegadas Poisson (independientes, al azar) y servicio exponencial.</li><li>Población infinita y fila sin límite; nadie abandona.</li><li>Una sola fila para todos los servidores (primero en llegar, primero en ser atendido).</li><li>Régimen estable (ρ < 1) y tasas constantes en el período analizado: la hora punta se analiza aparte.</li></ul>",
    ex:{ t:"Llegan λ = 22 clientes por hora; cada ejecutivo atiende μ = 8 por hora; hay s = 3 ejecutivos. Un ejecutivo cuesta $ 9.500 por hora y cada hora de espera de un cliente se valora en $ 7.000.",
      steps:[["Calculo ρ = 22 ÷ (3 × 8).", "Para ver si el sistema es estable.", "ρ = 91,7 %.", "Estable, pero muy cargado: habrá filas largas."],
        ["Calculo Lq y Wq con las fórmulas de M/M/s.", "Para medir la espera.", "Lq = 9,31 clientes; Wq = 25,4 minutos.", "Los reclamos son reales: casi media hora de espera."],
        ["Calculo W y L.", "Para el tiempo total en la sucursal.", "W = 32,9 min; L = 12,06 clientes.", "Se necesita espacio para unas 12 personas adentro."],
        ["Comparo el costo total con 3, 4 y 5 ejecutivos.", "Para elegir la dotación.", "$ 112.945, $ 63.556 y $ 68.279 por hora.", "Con 4 ejecutivos la espera baja a 2,5 minutos y el costo total es el mínimo."]],
      r:"agregar un cuarto ejecutivo: la utilización baja a 68,8 %, la espera promedio cae de 25,4 a 2,5 minutos y el costo total por hora es el menor." },
    real:"<p>Bancos, call centers, cajas de supermercado, peajes, urgencias y puertos usan teoría de colas para dimensionar personal. Una regla práctica de los call centers es no planificar sobre 85 % de utilización, porque sobre ese nivel la espera crece muy rápido.</p>",
    sim:"q",
    chk(){ const q = mms(22, 8, 3); const N = NUC.mmc(22, 8, 3, 7000, 9500); return [["Lq", q.Lq, N.Lq], ["Wq", q.Wq, N.Wq], ["L", q.L, N.L]]; },
    quiz:[["Con λ = 10 por hora y un servidor con μ = 12 por hora, la utilización es:", ["120 %", "83 %", "12 %", "2 %"], 1, "ρ = 10 ÷ 12 = 0,833."],
      ["Si ρ pasa de 70 % a 95 %, la espera en cola:", ["Crece en proporción (36 % más)", "Crece mucho más que en proporción", "Baja", "No cambia"], 1, "La espera depende de 1 ÷ (1 − ρ): pasar de 0,30 a 0,05 multiplica ese factor por 6."],
      ["Según la ley de Little, si llegan 30 clientes por hora y cada uno pasa 0,5 horas en el sistema, en promedio hay:", ["60 clientes", "15 clientes", "30 clientes", "0,5 clientes"], 1, "L = λ · W = 30 × 0,5 = 15."]],
    dec:"cuántos servidores poner en cada horario, qué espera prometer y cuánto cuesta cada nivel de servicio.",
    pre:["descriptiva"], rel:["sim-procesos", "simulacion-mc"] };

  const expo = r => -Math.log(1 - Math.random()) / r;
  CSIM.q = { title:"Fila de espera en tiempo real con s servidores",
    goal:"por qué se forma fila aunque la capacidad alcance, cómo la espera explota cuando la utilización se acerca a 100 % y cómo cambian las métricas al agregar un servidor.",
    params:[{ k:"lam", l:"Llegadas λ", min:4, max:40, step:1, v:22, u:"clientes/h", help:"Clientes que llegan por hora, al azar." },
      { k:"mu", l:"Servicio por servidor μ", min:4, max:20, step:1, v:8, u:"clientes/h", help:"Clientes que atiende cada servidor por hora." },
      { k:"s", l:"Servidores s", min:1, max:6, step:1, v:3, u:"", help:"Ejecutivos atendiendo." }],
    init(){ return { t:0, next:0, q:[], srv:[], area:0, areaQ:0, served:0, waitSum:0, n:0, acc:0 }; },
    onParam(st){ Object.assign(st, { area:0, areaQ:0, served:0, waitSum:0, t0:st.t }); },
    tick(st, p, dt){ const h = dt * 3 / 60; /* 3 minutos por segundo real */ let left = h; while (st.srv.length < p.s) st.srv.push(null); st.srv.length = p.s;
      while (left > 1e-9) { const busyEnds = st.srv.map(c => c ? c.end : Infinity), tNext = Math.min(st.next || st.t, ...busyEnds), step = Math.min(left, Math.max(0, tNext - st.t));
        const nSys = st.q.length + st.srv.filter(Boolean).length; st.area += nSys * step; st.areaQ += st.q.length * step; st.t += step; left -= step;
        st.srv.forEach((c, i) => { if (c && c.end <= st.t + 1e-12) { st.srv[i] = null; st.served++; } });
        if (!st.next || st.next <= st.t + 1e-12) { st.q.push({ arr:st.t }); st.next = st.t + expo(p.lam); }
        st.srv.forEach((c, i) => { if (!c && st.q.length) { const cu = st.q.shift(); st.waitSum += st.t - cu.arr; st.n++; st.srv[i] = { end:st.t + expo(p.mu) }; } });
        if (step === 0 && left > 0 && tNext > st.t) continue; if (st.q.length > 200) st.q.length = 200; } },
    draw(g, W, H, st, p, C){ const qx = 20, qy = H / 2, sx = W - 120, gap = Math.min(52, (H - 40) / Math.max(1, p.s));
      SIMG.text(g, "Llegan", qx, 20, C.muted, C, "left"); SIMG.text(g, "Fila (" + st.q.length + ")", qx + 40, qy - 26, C.ink, C, "left", true);
      st.q.slice(0, 40).forEach((c, i) => { const x = sx - 40 - i * 15; if (x < qx) return; g.fillStyle = C.c1; g.beginPath(); g.arc(x, qy, 6, 0, 7); g.fill(); });
      if (st.q.length > 40) SIMG.text(g, "+" + (st.q.length - 40), qx, qy + 4, C.bad, C, "left", true);
      st.srv.forEach((c, i) => { const y = qy - (p.s - 1) * gap / 2 + i * gap; g.strokeStyle = C.ink; g.lineWidth = 1.5; g.strokeRect(sx, y - 16, 56, 32); SIMG.text(g, "S" + (i + 1), sx + 70, y + 4, C.muted, C, "left");
        if (c) { g.fillStyle = C.c3; g.beginPath(); g.arc(sx + 28, y, 8, 0, 7); g.fill(); } });
      SIMG.text(g, "Reloj: " + n(st.t * 60, 0) + " min", W - 8, H - 10, C.muted, C, "right"); },
    metrics(st, p){ const q = mms(p.lam, p.mu, p.s), T = st.t - (st.t0 || 0), L = T > 0 ? st.area / T : 0, Lq = T > 0 ? st.areaQ / T : 0, Wq = st.n ? st.waitSum / st.n * 60 : 0;
      return [["Utilización ρ", n(p.lam / (p.s * p.mu) * 100, 1) + " %"], ["Lq teórico / simulado", q.ok ? n(q.Lq, 2) + " / " + n(Lq, 2) : "∞ / " + n(Lq, 1)], ["L teórico / simulado", q.ok ? n(q.L, 2) + " / " + n(L, 2) : "∞"], ["Wq teórico / simulado", q.ok ? n(q.Wq * 60, 1) + " / " + n(Wq, 1) + " min" : "∞"], ["W teórico", q.ok ? n(q.W * 60, 1) + " min" : "∞"], ["Clientes atendidos", n(st.served)]]; },
    ann(st, p){ const rho = p.lam / (p.s * p.mu); return rho >= 1 ? "La utilización es " + n(rho * 100) + " %: llegan más clientes de los que se pueden atender y la fila crece sin parar." : rho > 0.85 ? "Utilización alta (" + n(rho * 100) + " %): basta una racha de llegadas para que se forme una fila larga que tarda en disolverse." : "Utilización moderada: la fila aparece de vez en cuando y se disuelve rápido."; },
    concl(st, p){ const q = mms(p.lam, p.mu, p.s); return (q.ok ? "<p>Con " + p.s + " servidores la utilización es " + n(q.rho * 100, 1) + " % y la espera promedio en fila es <b>" + n(q.Wq * 60, 1) + " minutos</b>. Con el tiempo, los valores simulados se acercan a los teóricos.</p>" : "<p>Con " + p.s + " servidores el sistema no es estable: hay que agregar capacidad.</p>") +
      "<p><b>Qué demuestra:</b> la fila no depende solo del promedio sino de la variabilidad. Por eso, con capacidad apenas mayor que la demanda, la espera es larga.</p><p><b>Qué decisión informa:</b> cuántos servidores poner por horario y qué nivel de espera prometer.</p>"; } };

  /* ===================== DECISIONES ===================== */
  const DM = [["Planta grande", [200, 50, -120]], ["Planta mediana", [90, 40, -30]], ["Planta pequeña", [40, 30, -10]], ["No invertir", [0, 0, 0]]];
  const decCalc = (pa, pm, al) => { let pb = 1 - pa - pm; if (pb < 0) { const k = pa + pm; pa /= k; pm /= k; pb = 0; } const P = [pa, pm, pb];
    const ev = DM.map(d => d[1].reduce((s, v, j) => s + v * P[j], 0)), mx = DM.map(d => Math.max(...d[1])), mn = DM.map(d => Math.min(...d[1])), hw = DM.map((d, i) => al * mx[i] + (1 - al) * mn[i]), lp = DM.map(d => d[1].reduce((a, b) => a + b, 0) / 3);
    const colMax = [0, 1, 2].map(j => Math.max(...DM.map(d => d[1][j]))), sav = DM.map(d => Math.max(...d[1].map((v, j) => colMax[j] - v))), veip = colMax.reduce((s, v, j) => s + v * P[j], 0) - Math.max(...ev);
    const arg = (a, f) => a.indexOf(f(...a)); return { P, ev, hw, lp, sav, veip, best:{ ev:arg(ev, Math.max), maximax:arg(mx, Math.max), maximin:arg(mn, Math.max), hurwicz:arg(hw, Math.max), laplace:arg(lp, Math.max), savage:arg(sav, Math.min) } }; };
  CRS.decisiones = {
    kw:"decisiones bajo incertidumbre riesgo valor esperado maximax maximin hurwicz laplace savage arrepentimiento veip informacion perfecta matriz de pagos arbol de decision",
    ess:{ pts:["Se arma una <b>matriz de pagos</b>: alternativas (filas) por escenarios (columnas).", "Bajo <b>incertidumbre</b> (sin probabilidades) hay criterios: optimista, pesimista, Hurwicz, Laplace y Savage.", "Bajo <b>riesgo</b> (con probabilidades) se elige el mayor <b>valor esperado</b>.", "El <b>VEIP</b> dice cuánto vale como máximo un estudio que elimine la incertidumbre."],
      fx:"VE(a) = Σⱼ pⱼ · pago(a, j);   VEIP = Σⱼ pⱼ · máxₐ pago(a, j) − máxₐ VE(a)", when:"debes elegir una alternativa sin saber qué escenario ocurrirá, y puedes estimar el resultado de cada combinación." },
    intro:{ prob:"<p>Una empresa evalúa construir una planta grande, mediana o pequeña, o no invertir. La utilidad depende de la demanda: alta, media o baja. La planta grande gana mucho si la demanda es alta y pierde mucho si es baja.</p><p><b>¿Qué alternativa elegir, y cuánto vale un estudio de mercado?</b></p>",
      anal:"<p>Es como decidir si llevar paraguas: si llueve y no lo llevas, te mojas (pérdida); si no llueve y lo llevas, cargas peso (pequeña molestia). El pronóstico del tiempo es «información»: vale lo que te ahorra equivocarte.</p>",
      terms:[["Matriz de pagos", "Resultado de cada alternativa en cada escenario."], ["Maximax", "Optimista: elige el mejor de los mejores resultados."], ["Maximin (Wald)", "Pesimista: elige el mejor de los peores resultados."], ["Hurwicz", "Mezcla con coeficiente de optimismo α: α·máx + (1 − α)·mín."], ["Laplace", "Supone escenarios igual de probables."], ["Savage", "Minimiza el máximo arrepentimiento (lo que se deja de ganar)."], ["Valor esperado (VE)", "Promedio ponderado por las probabilidades."], ["VEIP", "Valor esperado de la información perfecta."]] },
    adv:"<p><b>Árboles de decisión.</b> Cuando hay decisiones en secuencia (hacer un estudio, luego elegir planta), se dibuja un árbol: cuadrados para decisiones, círculos para azar. Se resuelve de derecha a izquierda (retroinducción), tomando el máximo en cada decisión y el valor esperado en cada nodo de azar.</p><p><b>Actitud frente al riesgo.</b> El valor esperado supone neutralidad al riesgo. Una pyme que quiebra si pierde 120 puede preferir la planta mediana aunque su VE sea menor: ahí se usa la utilidad esperada.</p>",
    sp:{ title:"Criterios de decisión, paso a paso",
      params:[{ k:"pa", l:"Probabilidad de demanda alta", v:0.3, u:"" }, { k:"pm", l:"Probabilidad de demanda media", v:0.5, u:"" }, { k:"al", l:"Optimismo α (Hurwicz)", v:0.6, u:"" }],
      script(p){ const r = decCalc(p.pa, p.pm, p.al), nm = i => DM[i][0];
        return [
          { t:"Matriz", e:DM.map(d => d[0] + ": " + d[1].join(" / ")).join(";  "), s:"Utilidades (en millones) con demanda alta / media / baja." },
          { t:"Maximax", e:"Mejores resultados: 200, 90, 40, 0  →  " + nm(r.best.maximax), s:"El optimista mira solo el mejor caso." },
          { t:"Maximin", e:"Peores resultados: −120, −30, −10, 0  →  " + nm(r.best.maximin), s:"El pesimista se protege del peor caso." },
          { t:"Hurwicz", e:"α · máx + (1 − α) · mín  →  " + r.hw.map(v => n(v, 1)).join(", ") + "  →  " + nm(r.best.hurwicz), s:"Con α = " + n(p.al, 2) + " de optimismo." },
          { t:"Laplace", e:"Promedio simple  →  " + r.lp.map(v => n(v, 2)).join(", ") + "  →  " + nm(r.best.laplace), s:"Si no sabes nada, cada escenario pesa lo mismo." },
          { t:"Savage", e:"Máximo arrepentimiento  →  " + r.sav.join(", ") + "  →  " + nm(r.best.savage), s:"Arrepentimiento = lo mejor de la columna menos lo obtenido." },
          { t:"Valor esperado", e:"VE = " + r.ev.map(v => n(v, 1)).join(", ") + "  →  " + nm(r.best.ev), h:nm(r.best.ev), s:"Con probabilidades " + r.P.map(x => n(x, 2)).join(", ") + "." },
          { t:"VEIP", e:"VEIP = Σ p · (mejor de cada columna) − VE máx = " + n(r.veip, 1), h:n(r.veip, 1), s:"Un estudio que adivine la demanda vale como máximo " + n(r.veip, 1) + " millones." }]; } },
    vars:[["pago(a, j)", "Resultado de la alternativa a si ocurre el escenario j", "$", "—"], ["pⱼ", "Probabilidad del escenario j", "—", "0 a 1, suman 1"], ["α", "Coeficiente de optimismo (Hurwicz)", "—", "0 a 1"], ["VE(a)", "Valor esperado de la alternativa a", "$", "—"], ["VEIP", "Valor esperado de la información perfecta", "$", "≥ 0"]],
    sup:"<ul><li>Los escenarios son excluyentes y cubren todas las posibilidades.</li><li>Las probabilidades (si se usan) suman 1 y son razonables.</li><li>El valor esperado supone que la decisión se repite o que se es neutral al riesgo.</li></ul>",
    ex:{ t:"Utilidades (millones): planta grande 200 / 50 / −120; mediana 90 / 40 / −30; pequeña 40 / 30 / −10; no invertir 0. Probabilidades: alta 0,3; media 0,5; baja 0,2.",
      steps:[["Calculo el valor esperado de cada alternativa.", "Es el criterio cuando hay probabilidades.", "Grande 61; mediana 41; pequeña 25; no invertir 0.", "En promedio, la planta grande rinde más."],
        ["Comparo con los criterios sin probabilidades.", "Para ver qué tan robusta es la elección.", "Maximax y Hurwicz: grande; maximin: no invertir; Savage: mediana.", "Un decisor pesimista no elegiría la grande."],
        ["Calculo el VEIP.", "Para saber cuánto vale un estudio de mercado.", "VEIP = 85 − 61 = 24 millones.", "No pagar más de 24 millones por un estudio, ni siquiera perfecto."]],
      r:"la planta grande tiene el mayor valor esperado (61 millones), pero arriesga perder 120. Si la empresa no puede soportar esa pérdida, la mediana es más prudente. Un estudio de mercado vale hasta 24 millones." },
    real:"<p>En minería, la decisión de expandir una planta concentradora se evalúa con escenarios de precio del cobre; en retail, la apertura de tiendas con escenarios de demanda. El VEIP ayuda a decidir cuánto gastar en estudios de factibilidad antes de invertir.</p>",
    sim:"dec",
    chk(){ const r = decCalc(0.3, 0.5, 0.6); return [["VE grande", r.ev[0], 61], ["VEIP", r.veip, 24], ["Hurwicz grande", r.hw[0], 72]]; },
    quiz:[["Un decisor pesimista usa el criterio:", ["Maximax", "Maximin", "Laplace", "Valor esperado"], 1, "Elige la alternativa cuyo peor resultado es el mejor."],
      ["El VEIP indica:", ["La ganancia de la mejor alternativa", "Cuánto pagar como máximo por información perfecta", "La probabilidad del mejor escenario", "El arrepentimiento mínimo"], 1, "Es lo que se gana en promedio al saber de antemano qué escenario ocurrirá."],
      ["Con α = 1, el criterio de Hurwicz es igual a:", ["Maximin", "Maximax", "Laplace", "Savage"], 1, "Con optimismo total solo cuenta el mejor resultado."]],
    dec:"qué alternativa elegir según la actitud frente al riesgo y cuánto vale reducir la incertidumbre.",
    rel:["simulacion-mc", "van-tir", "factores"] };

  CSIM.dec = { title:"Valor esperado y criterios de decisión según las probabilidades",
    goal:"cómo cambia la mejor alternativa al cambiar las probabilidades de los escenarios y el optimismo, y cuánto vale la información.",
    params:[{ k:"pa", l:"Probabilidad de demanda alta", min:0, max:1, step:0.05, v:0.3, u:"", help:"La demanda baja toma lo que falte para sumar 1." },
      { k:"pm", l:"Probabilidad de demanda media", min:0, max:1, step:0.05, v:0.5, u:"", help:"Si alta + media supera 1, se reescalan." },
      { k:"al", l:"Optimismo α (Hurwicz)", min:0, max:1, step:0.05, v:0.6, u:"", help:"0 = pesimista; 1 = optimista." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt); },
    draw(g, W, H, s, p, C){ const r = decCalc(p.pa, p.pm, p.al), x0 = Math.min(130, W * 0.32), x1 = W - 20, top = 26, bh = (H - top - 40) / 4, lo = -130, hi = 210, X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0);
      g.strokeStyle = C.muted; g.beginPath(); g.moveTo(X(0), top - 6); g.lineTo(X(0), H - 30); g.stroke(); SIMG.text(g, "0", X(0), H - 16, C.muted, C, "center");
      DM.forEach((d, i) => { const y = top + i * bh; SIMG.text(g, d[0], 4, y + bh * 0.45, C.ink, C, "left", i === r.best.ev);
        g.strokeStyle = C.line; g.lineWidth = 6; g.lineCap = "round"; g.beginPath(); g.moveTo(X(Math.min(...d[1])), y + bh * 0.4); g.lineTo(X(Math.max(...d[1])), y + bh * 0.4); g.stroke(); g.lineCap = "butt";
        d[1].forEach((v, j) => { g.fillStyle = [C.c3, C.c1, C.bad][j]; g.beginPath(); g.arc(X(v), y + bh * 0.4, 3 + r.P[j] * 9, 0, 7); g.fill(); });
        const ev = r.ev[i] * s.t; g.fillStyle = C.ink; g.fillRect(X(ev) - 1.5, y + bh * 0.4 - 12, 3, 24); SIMG.text(g, "VE " + n(r.ev[i], 1), X(ev), y + bh * 0.4 + 26, C.ink, C, "center", i === r.best.ev); });
      SIMG.text(g, "Puntos: alta (verde), media (azul), baja (rojo); el tamaño es la probabilidad.", 4, H - 4, C.muted, C, "left"); },
    metrics(s, p){ const r = decCalc(p.pa, p.pm, p.al), nm = i => DM[i][0]; return [["Probabilidades", r.P.map(x => n(x, 2)).join(" / ")], ["Valor esperado", nm(r.best.ev)], ["Maximax", nm(r.best.maximax)], ["Maximin", nm(r.best.maximin)], ["Hurwicz", nm(r.best.hurwicz)], ["Laplace", nm(r.best.laplace)], ["Savage", nm(r.best.savage)], ["VEIP", n(r.veip, 1)]]; },
    ann(s, p){ const r = decCalc(p.pa, p.pm, p.al); return "La barra negra de cada alternativa es su valor esperado. Hoy la mejor es «" + DM[r.best.ev][0] + "». Sube la probabilidad de demanda baja y mira cuándo deja de convenir la planta grande."; },
    concl(s, p){ const r = decCalc(p.pa, p.pm, p.al); return "<p>Con estas probabilidades conviene <b>" + DM[r.best.ev][0] + "</b> (VE = " + n(r.ev[r.best.ev], 1) + "). Un estudio de mercado perfecto valdría como máximo <b>" + n(r.veip, 1) + "</b>.</p><p><b>Qué demuestra:</b> la mejor alternativa depende de las probabilidades y de la actitud frente al riesgo; distintos criterios pueden dar respuestas distintas.</p><p><b>Qué decisión informa:</b> qué invertir y cuánto pagar por información antes de decidir.</p>"; } };

  /* ===================== RUTA MÁS CORTA (DIJKSTRA) ===================== */
  const RN = { Bodega:[0.06, 0.5], A:[0.3, 0.12], B:[0.32, 0.55], F:[0.55, 0.78], C:[0.6, 0.18], D:[0.8, 0.45], Cliente:[0.95, 0.75] };
  const redges = p => [["Bodega", "A", 7], ["Bodega", "B", 9], ["Bodega", "F", 14], ["A", "B", 10], ["A", "C", 15], ["B", "C", 11], ["B", "F", p.bf], ["C", "D", 6], ["D", "Cliente", 9], ["F", "Cliente", p.fc], ["F", "D", 8]];
  const dijk = p => { const E = redges(p), dist = {}, prev = {}, done = [], Q = Object.keys(RN); Q.forEach(k => dist[k] = Infinity); dist.Bodega = 0;
    while (done.length < Q.length) { const u = Q.filter(k => !done.includes(k)).reduce((a, k) => dist[k] < dist[a] ? k : a); done.push(u);
      E.forEach(([a, b, w]) => { [[a, b], [b, a]].forEach(([x, y]) => { if (x === u && dist[u] + w < dist[y]) { dist[y] = dist[u] + w; prev[y] = u; } }); }); }
    const path = ["Cliente"]; while (prev[path[0]]) path.unshift(prev[path[0]]); return { dist, prev, done, path }; };
  CRS["ruta-corta"] = {
    kw:"ruta mas corta dijkstra grafo red nodos arcos distancia camino minimo logistica",
    ess:{ pts:["Encuentra el camino de <b>menor distancia</b> (o tiempo, o costo) entre dos puntos de una red.", "Dijkstra «fija» los nodos uno a uno, siempre el de menor distancia acumulada.", "Al fijar un nodo, actualiza la distancia de sus vecinos si por ahí se llega más corto.", "Funciona con distancias positivas."],
      fx:"d(v) = mín(d(v), d(u) + w(u, v))", when:"quieres la ruta más corta o barata en una red de caminos, cables o procesos con costos positivos." },
    intro:{ prob:"<p>Un camión sale de la bodega y debe llegar a un cliente. Hay varios caminos posibles pasando por puntos intermedios, cada tramo con su distancia. ¿Cuál es el más corto?</p>",
      anal:"<p>Es como una mancha de agua que se expande desde la bodega: llega primero a los puntos más cercanos, y cada vez que alcanza un punto nuevo, sigue avanzando desde ahí. El orden en que el agua moja los puntos es el orden de Dijkstra.</p>",
      terms:[["Nodo", "Punto de la red (bodega, cruce, cliente)."], ["Arco", "Tramo que une dos nodos, con su distancia w."], ["Etiqueta d(v)", "Mejor distancia conocida desde el origen hasta v."], ["Nodo fijado", "Nodo cuya distancia ya es definitiva."]] },
    adv:"<p><b>Complejidad:</b> con una cola de prioridad, Dijkstra es muy rápido incluso con millones de nodos (navegadores GPS usan variantes como A*). <b>Distancias negativas</b> requieren Bellman-Ford. Para recorrer muchos clientes en una ruta (problema del vendedor viajero o ruteo de vehículos) se usan otras heurísticas.</p>",
    sp:{ title:"Algoritmo de Dijkstra, paso a paso",
      params:[{ k:"bf", l:"Distancia B – F", v:2, u:"km" }, { k:"fc", l:"Distancia F – Cliente", v:11, u:"km" }],
      script(p){ const r = dijk(p);
        return [{ t:"Inicio", e:"d(Bodega) = 0;  todos los demás = ∞", s:"Al comienzo solo conocemos el origen." }].concat(r.done.map((u, i) => ({ t:"Fijar " + (i + 1), e:"Fijo " + u + " con d = " + n(r.dist[u]) + (r.prev[u] ? " (viene de " + r.prev[u] + ")" : ""), h:u, s:i === 0 ? "Desde aquí se actualizan los vecinos." : "Es el nodo no fijado con menor distancia; sus vecinos se actualizan si por aquí se llega más corto." })))
          .concat([{ t:"Ruta", e:r.path.join(" → ") + " = " + n(r.dist.Cliente) + " km", h:n(r.dist.Cliente) + " km", s:"Se reconstruye la ruta siguiendo «viene de» hacia atrás desde el cliente." }]); } },
    vars:[["d(v)", "Distancia mínima conocida desde el origen hasta v", "km (o min, $)", "≥ 0"], ["w(u, v)", "Largo del arco entre u y v", "km", "> 0"], ["prev(v)", "Nodo desde el que se llega a v en la mejor ruta", "—", "—"]],
    sup:"<ul><li>Distancias no negativas.</li><li>La distancia de cada tramo es fija (sin tráfico variable).</li><li>Se busca un solo origen y un solo destino (o todos los destinos desde un origen).</li></ul>",
    ex:{ t:"Red con 7 nodos: Bodega, A, B, C, D, F y Cliente. Tramos: Bodega–A 7, Bodega–B 9, Bodega–F 14, A–B 10, A–C 15, B–C 11, B–F 2, C–D 6, D–Cliente 9, F–Cliente 11, F–D 8.",
      steps:[["Fijo Bodega (0) y actualizo vecinos.", "Es el origen.", "A = 7, B = 9, F = 14.", "Hay tres caminos de salida."],
        ["Fijo A (7), luego B (9).", "Siempre el menor no fijado.", "Por B, F baja de 14 a 11 (9 + 2).", "Ir directo a F no conviene: por B se ahorran 3 km."],
        ["Fijo F (11), D (19) y C (20).", "Se sigue expandiendo.", "Cliente = 11 + 11 = 22 por F.", "Por D sería 19 + 9 = 28: más largo."],
        ["Fijo Cliente (22) y reconstruyo.", "Se termina al fijar el destino.", "Ruta Bodega → B → F → Cliente, 22 km.", "El camión debe ir por B y F."]],
      r:"ir por Bodega → B → F → Cliente, con 22 km. Ir directo de la bodega a F parece más corto, pero por B se ahorran 3 km." },
    real:"<p>Los sistemas de navegación (Waze, Google Maps), el ruteo de paquetes en Internet y la planificación de recorridos de reparto usan algoritmos de ruta más corta. En logística, el resultado alimenta modelos de ruteo de vehículos con ventanas horarias.</p>",
    sim:"dj",
    chk(){ return [["Distancia mínima", dijk({ bf:2, fc:11 }).dist.Cliente, 22]]; },
    quiz:[["En cada iteración, Dijkstra fija:", ["El nodo más lejano", "El nodo no fijado con menor distancia acumulada", "Un nodo al azar", "El destino"], 1, "Así garantiza que esa distancia ya no puede mejorar."],
      ["Dijkstra no funciona bien si:", ["Hay muchos nodos", "Hay arcos con distancia negativa", "El grafo no es dirigido", "Hay ciclos"], 1, "Con distancias negativas un nodo fijado podría mejorar después."],
      ["Si un tramo de la ruta óptima se corta, lo correcto es:", ["Usar la misma ruta", "Volver a correr el algoritmo sin ese tramo", "Elegir el tramo más corto", "Ir en línea recta"], 1, "La nueva ruta óptima puede ser muy distinta."]],
    dec:"qué ruta usar entre dos puntos y cuánto se pierde si un tramo se corta.",
    rel:["transporte", "localizacion"] };

  CSIM.dj = { title:"Dijkstra animado: la búsqueda se expande desde la bodega",
    goal:"cómo Dijkstra fija los nodos en orden de distancia y por qué la ruta más corta no siempre es la más directa.",
    params:[{ k:"bf", l:"Distancia B – F", min:1, max:15, step:1, v:2, u:"km", help:"Súbela: el atajo por B deja de servir." }, { k:"fc", l:"Distancia F – Cliente", min:5, max:25, step:1, v:11, u:"km", help:"Súbela y la ruta cambia a pasar por D." }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0; }, tick(s, p, dt){ s.t += dt; if (s.t > 11) s.t = 0; },
    draw(g, W, H, s, p, C){ const r = dijk(p), E = redges(p), k = Math.min(r.done.length, Math.floor(s.t / 1.1)), fixed = r.done.slice(0, k), P = v => [24 + RN[v][0] * (W - 48), 24 + RN[v][1] * (H - 48)], inPath = (a, b) => k >= r.done.length && r.path.some((x, i) => i && ((r.path[i - 1] === a && x === b) || (r.path[i - 1] === b && x === a)));
      E.forEach(([a, b, w]) => { const [x1, y1] = P(a), [x2, y2] = P(b), tree = fixed.includes(b) && r.prev[b] === a || fixed.includes(a) && r.prev[a] === b; g.strokeStyle = inPath(a, b) ? C.c2 : tree ? C.c1 : C.line; g.lineWidth = inPath(a, b) ? 5 : tree ? 3 : 2; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
        g.fillStyle = C.surf; g.fillRect((x1 + x2) / 2 - 10, (y1 + y2) / 2 - 9, 20, 16); SIMG.text(g, w, (x1 + x2) / 2, (y1 + y2) / 2 + 4, C.muted, C, "center"); });
      Object.keys(RN).forEach(v => { const [x, y] = P(v), f = fixed.includes(v); g.fillStyle = f ? C.c1 : C.surf; g.strokeStyle = C.c1; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 15, 0, 7); g.fill(); g.stroke();
        SIMG.text(g, v === "Bodega" ? "Bod." : v === "Cliente" ? "Cli." : v, x, y + 4, f ? C.surf : C.ink, C, "center", true); SIMG.text(g, f ? "d=" + r.dist[v] : "", x, y - 20, C.ink, C, "center", true); }); },
    metrics(s, p){ const r = dijk(p); return [["Distancia mínima", n(r.dist.Cliente) + " km"], ["Ruta", r.path.join(" → ")], ["Orden de fijación", r.done.join(", ")]]; },
    ann(s, p){ const r = dijk(p), k = Math.min(r.done.length, Math.floor(s.t / 1.1)); return k < r.done.length ? "Paso " + (k + 1) + ": se fija " + r.done[k] + " (d = " + r.dist[r.done[k]] + "), el nodo no fijado más cercano. Las líneas azules forman el árbol de caminos más cortos." : "Ruta más corta en naranjo: " + r.path.join(" → ") + " (" + r.dist.Cliente + " km)."; },
    concl(s, p){ const r = dijk(p); return "<p>La ruta más corta es <b>" + r.path.join(" → ") + "</b>, con <b>" + r.dist.Cliente + " km</b>.</p><p><b>Qué demuestra:</b> Dijkstra avanza como una onda desde el origen y nunca necesita volver atrás. Un tramo corto (B–F) puede cambiar toda la ruta.</p><p><b>Qué decisión informa:</b> qué recorrido usar y qué tramos son críticos para la red.</p>"; } };

  /* ===================== LOCALIZACIÓN: CENTRO DE GRAVEDAD ===================== */
  const LP0 = [["Santiago", 50, 80, 3200], ["Valparaíso", 20, 85, 1100], ["Rancagua", 55, 60, 900], ["Talca", 60, 25, 700], ["San Antonio", 18, 62, 600], ["Los Andes", 68, 95, 450]];
  const locPts = p => LP0.map((x, i) => i === 0 ? [x[0], x[1], x[2], p.vs] : i === 3 ? [x[0], x[1], x[2], p.vt] : x);
  const cog = P => { const V = P.reduce((s, x) => s + x[3], 0); return [P.reduce((s, x) => s + x[1] * x[3], 0) / V, P.reduce((s, x) => s + x[2] * x[3], 0) / V]; };
  const lcost = (P, c, ct) => P.reduce((s, x) => s + x[3] * Math.hypot(x[1] - c[0], x[2] - c[1]), 0) * ct;
  const weisz = (P, k) => { let c = cog(P); const tr = [c]; for (let i = 0; i < k; i++) { let nx = 0, ny = 0, d = 0; P.forEach(x => { const di = Math.max(1e-6, Math.hypot(x[1] - c[0], x[2] - c[1])); nx += x[3] * x[1] / di; ny += x[3] * x[2] / di; d += x[3] / di; }); c = [nx / d, ny / d]; tr.push(c); } return tr; };
  CRS.localizacion = {
    kw:"localizacion centro de gravedad weiszfeld ubicacion bodega centro de distribucion coordenadas volumen costo de transporte",
    ess:{ pts:["Busca dónde ubicar una bodega o planta para minimizar el costo de transporte a sus clientes.", "El <b>centro de gravedad</b> es el promedio de las coordenadas ponderado por el volumen.", "Es un buen punto de partida, pero no siempre el óptimo: el método de <b>Weiszfeld</b> lo mejora iterando.", "Los clientes con más volumen «atraen» la ubicación."],
      fx:"Cx = Σ xᵢVᵢ ÷ ΣVᵢ;   Cy = Σ yᵢVᵢ ÷ ΣVᵢ", when:"el costo de transporte es proporcional a la distancia y al volumen, y hay libertad para elegir la ubicación." },
    intro:{ prob:"<p>Una empresa abastece seis ciudades de la zona central de Chile con volúmenes distintos. ¿Dónde ubicar el centro de distribución para que el costo de transporte total sea el menor?</p>",
      anal:"<p>Imagina un mapa sobre una mesa, con pesos colgando en cada ciudad proporcionales a su volumen. El punto donde el mapa queda en equilibrio sobre un dedo es el centro de gravedad.</p>",
      terms:[["(xᵢ, yᵢ)", "Coordenadas de cada punto en una grilla."], ["Vᵢ", "Volumen que se envía a cada punto."], ["Centro de gravedad", "Promedio ponderado de las coordenadas."], ["Weiszfeld", "Método iterativo que encuentra la ubicación de menor distancia ponderada real."]] },
    adv:"<p>El centro de gravedad minimiza la suma de distancias <b>al cuadrado</b>, no de distancias. Por eso puede quedar lejos del óptimo real cuando un punto domina en volumen: en el ejemplo, el óptimo de Weiszfeld cae justo en Santiago, que concentra el 46 % del volumen.</p><p>En la práctica, el resultado se ajusta a terrenos disponibles, accesos a autopistas y costos de suelo: se combina con la evaluación por factores ponderados.</p>",
    sp:{ title:"Centro de gravedad, paso a paso",
      params:[{ k:"vs", l:"Volumen de Santiago", v:3200, u:"u" }, { k:"vt", l:"Volumen de Talca", v:700, u:"u" }],
      script(p){ const P = locPts(p), V = P.reduce((s, x) => s + x[3], 0), sx = P.reduce((s, x) => s + x[1] * x[3], 0), sy = P.reduce((s, x) => s + x[2] * x[3], 0), c = [sx / V, sy / V], wz = weisz(P, 60);
        return [
          { t:"Datos", e:P.map(x => x[0] + " (" + x[1] + "; " + x[2] + ") · " + n(x[3])).join(";  "), s:"Coordenadas en una grilla y volumen de cada ciudad." },
          { t:"Volumen total", e:"ΣV = " + n(V), s:"Se suman los volúmenes." },
          { t:"Cx", e:"Σ x·V = " + n(sx) + "  →  Cx = " + n(sx) + " ÷ " + n(V) + " = " + n(c[0], 2), h:n(c[0], 2), s:"Promedio de x ponderado por volumen." },
          { t:"Cy", e:"Σ y·V = " + n(sy) + "  →  Cy = " + n(sy) + " ÷ " + n(V) + " = " + n(c[1], 2), h:n(c[1], 2), s:"Igual con y." },
          { t:"Costo", e:"Costo = ct · Σ V·distancia = $ " + n(lcost(P, c, 1.2)), s:"Con $ 1,2 por unidad·km." },
          { t:"Weiszfeld", e:"Óptimo ≈ (" + n(wz[wz.length - 1][0], 2) + "; " + n(wz[wz.length - 1][1], 2) + "),  costo $ " + n(lcost(P, wz[wz.length - 1], 1.2)), h:"$ " + n(lcost(P, wz[wz.length - 1], 1.2)), s:"Iterando, se llega a la ubicación de menor costo real." }]; } },
    vars:[["xᵢ, yᵢ", "Coordenadas del punto i", "km (grilla)", "—"], ["Vᵢ", "Volumen enviado al punto i", "unidades", "—"], ["Cx, Cy", "Coordenadas del centro de gravedad", "km", "—"], ["ct", "Costo de transporte", "$ por unidad·km", "—"], ["dᵢ", "Distancia de la ubicación al punto i", "km", "—"]],
    sup:"<ul><li>Costo proporcional a la distancia en línea recta (en ciudad se usa distancia rectilínea).</li><li>Volúmenes estables.</li><li>Cualquier punto del plano es elegible (luego se ajusta a terrenos reales).</li></ul>",
    ex:{ t:"Seis ciudades con coordenadas y volúmenes: Santiago (50; 80) 3.200; Valparaíso (20; 85) 1.100; Rancagua (55; 60) 900; Talca (60; 25) 700; San Antonio (18; 62) 600; Los Andes (68; 95) 450. Costo $ 1,2 por unidad·km.",
      steps:[["Calculo el centro de gravedad.", "Primera aproximación rápida.", "(45,31; 72,08).", "Queda al suroeste de Santiago, atraído por Valparaíso y San Antonio."],
        ["Calculo su costo.", "Para comparar.", "$ 169.387.", "Es el costo de transporte de esa ubicación."],
        ["Mejoro con Weiszfeld.", "El centro de gravedad no minimiza la distancia real.", "Óptimo en (50; 80), costo $ 148.456.", "Ubicarse en Santiago ahorra $ 20.931 (12 %)."]],
      r:"ubicar el centro de distribución en Santiago (o lo más cerca posible), con un ahorro de 12 % frente al centro de gravedad." },
    real:"<p>Las cadenas de retail ubicaron sus grandes centros de distribución en el sector poniente y norte de Santiago (Pudahuel, Quilicura, Lampa), cerca de autopistas y del mayor volumen de demanda. El modelo de centro de gravedad da la zona; la evaluación por factores elige el terreno.</p>",
    sim:"cg",
    chk(){ const c = cog(LP0); return [["Cx", c[0], 45.3093525179856], ["Cy", c[1], 72.0791366906475]]; },
    quiz:[["El centro de gravedad se calcula como:", ["El promedio simple de las coordenadas", "El promedio de las coordenadas ponderado por el volumen", "El punto más al centro del mapa", "La ciudad con más volumen"], 1, "Cada punto pesa según su volumen."],
      ["Si una ciudad duplica su volumen, el centro de gravedad:", ["Se aleja de ella", "Se acerca a ella", "No cambia", "Se va al origen"], 1, "Su peso en el promedio aumenta."],
      ["¿Por qué se mejora el centro de gravedad con Weiszfeld?", ["Porque el centro de gravedad no minimiza la suma de distancias reales", "Porque es más rápido", "Porque no usa volúmenes", "No se mejora"], 0, "El centro de gravedad minimiza distancias al cuadrado."]],
    dec:"en qué zona ubicar una bodega o planta y cuánto cuesta alejarse del óptimo.",
    rel:["factores", "transporte"] };

  CSIM.cg = { title:"Centro de gravedad y mejora iterativa de Weiszfeld",
    goal:"cómo el volumen de cada cliente atrae la ubicación y por qué el centro de gravedad se mejora iterando.",
    params:[{ k:"vs", l:"Volumen de Santiago", min:0, max:6000, step:100, v:3200, u:"u", help:"Súbelo: la ubicación óptima se pega a Santiago." }, { k:"vt", l:"Volumen de Talca", min:0, max:4000, step:100, v:700, u:"u", help:"Súbelo: la ubicación se desplaza al sur." }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0; }, tick(s, p, dt){ s.t += dt; if (s.t > 9) s.t = 0; },
    draw(g, W, H, s, p, C){ const P = locPts(p), x0 = 30, x1 = W - 20, y0 = H - 24, top = 14, X = v => x0 + v / 100 * (x1 - x0), Y = v => y0 - v / 100 * (y0 - top), mx = Math.max(...P.map(x => x[3]), 1);
      g.strokeStyle = C.line; g.strokeRect(x0, top, x1 - x0, y0 - top); const c = cog(P), tr = weisz(P, 40), k = Math.min(tr.length - 1, Math.floor(Math.max(0, s.t - 1.5) * 8));
      P.forEach(x => { g.strokeStyle = C.line; g.beginPath(); g.moveTo(X(x[1]), Y(x[2])); g.lineTo(X(tr[k][0]), Y(tr[k][1])); g.stroke(); });
      P.forEach(x => { g.fillStyle = C.c1; g.globalAlpha = 0.25; g.beginPath(); g.arc(X(x[1]), Y(x[2]), 4 + Math.sqrt(x[3] / mx) * 22, 0, 7); g.fill(); g.globalAlpha = 1; g.fillStyle = C.c1; g.beginPath(); g.arc(X(x[1]), Y(x[2]), 4, 0, 7); g.fill(); SIMG.text(g, x[0], X(x[1]) + 8, Y(x[2]) - 6, C.ink, C, "left"); });
      g.fillStyle = C.c4; g.beginPath(); g.arc(X(c[0]), Y(c[1]), 6, 0, 7); g.fill(); SIMG.text(g, "CG", X(c[0]) - 8, Y(c[1]) + 4, C.ink, C, "right", true);
      g.strokeStyle = C.c2; g.lineWidth = 1.5; g.beginPath(); tr.slice(0, k + 1).forEach((q, i) => i ? g.lineTo(X(q[0]), Y(q[1])) : g.moveTo(X(q[0]), Y(q[1]))); g.stroke();
      g.fillStyle = C.c2; g.beginPath(); g.arc(X(tr[k][0]), Y(tr[k][1]), 7, 0, 7); g.fill(); },
    metrics(s, p){ const P = locPts(p), c = cog(P), w = weisz(P, 80).pop(); return [["Centro de gravedad", "(" + n(c[0], 2) + "; " + n(c[1], 2) + ")"], ["Costo en el CG", "$ " + n(lcost(P, c, 1.2))], ["Óptimo (Weiszfeld)", "(" + n(w[0], 2) + "; " + n(w[1], 2) + ")"], ["Costo mínimo", "$ " + n(lcost(P, w, 1.2))], ["Ahorro", n((1 - lcost(P, w, 1.2) / lcost(P, c, 1.2)) * 100, 1) + " %"]]; },
    ann(s){ return s.t < 1.5 ? "Cada círculo es una ciudad; su tamaño es el volumen. El punto morado es el centro de gravedad." : "El punto naranjo parte del centro de gravedad y se mueve, iteración a iteración, hacia la ubicación de menor costo real."; },
    concl(s, p){ const P = locPts(p), c = cog(P), w = weisz(P, 80).pop(); return "<p>El centro de gravedad está en (" + n(c[0], 2) + "; " + n(c[1], 2) + "), pero la ubicación de menor costo es <b>(" + n(w[0], 2) + "; " + n(w[1], 2) + ")</b>, con un ahorro de " + n((1 - lcost(P, w, 1.2) / lcost(P, c, 1.2)) * 100, 1) + " %.</p><p><b>Qué demuestra:</b> el volumen atrae la ubicación. El centro de gravedad es un buen punto de partida, no siempre el óptimo.</p><p><b>Qué decisión informa:</b> la zona donde buscar terreno para la bodega.</p>"; } };

  /* ===================== FACTORES PONDERADOS ===================== */
  const FC = [["Costo del terreno", 25, [6, 7, 9]], ["Acceso a autopistas", 20, [9, 8, 6]], ["Mano de obra", 15, [8, 8, 6]], ["Cercanía a clientes", 20, [9, 7, 5]], ["Normativa y permisos", 10, [7, 8, 6]], ["Riesgo de inundación", 10, [8, 6, 7]]], FA = ["Quilicura", "Pudahuel", "Lampa"];
  const facScore = w => { const S = w.reduce((a, b) => a + b, 0) || 1; return FA.map((_, j) => FC.reduce((s, c, i) => s + w[i] / S * c[2][j], 0)); };
  CRS.factores = {
    kw:"factores ponderados evaluacion por factores matriz de decision multicriterio pesos puntaje localizacion seleccion de alternativas",
    ess:{ pts:["Compara alternativas con <b>varios criterios</b> que no se pueden reducir a pesos ($).", "Cada criterio tiene un <b>peso</b> (importancia) y cada alternativa una <b>nota</b> en cada criterio.", "Puntaje = Σ (peso × nota). Gana el mayor.", "Siempre conviene probar si el ganador cambia al mover los pesos (sensibilidad)."],
      fx:"Puntajeⱼ = Σᵢ (pesoᵢ ÷ Σ pesos) · notaᵢⱼ", when:"hay criterios cualitativos (acceso, permisos, riesgo) además del costo." },
    intro:{ prob:"<p>Una empresa debe elegir entre tres terrenos (Quilicura, Pudahuel y Lampa) para una bodega. Uno es más barato, otro tiene mejor acceso y otro está más cerca de los clientes. ¿Cómo comparar cosas tan distintas?</p>",
      anal:"<p>Es como elegir departamento: precio, cercanía al trabajo, luz y seguridad. A cada aspecto le das una importancia y una nota a cada opción. El que suma más puntos gana.</p>",
      terms:[["Criterio", "Aspecto que se evalúa."], ["Peso", "Importancia del criterio (suman 100 %)."], ["Nota", "Qué tan bien cumple la alternativa el criterio (de 1 a 10)."], ["Puntaje ponderado", "Suma de peso × nota."], ["Sensibilidad", "Probar si el resultado cambia al mover los pesos."]] },
    adv:"<p>Los pesos son subjetivos: conviene definirlos <b>antes</b> de ver las notas y con varias personas. Métodos más formales como AHP (proceso analítico jerárquico) derivan los pesos de comparaciones de a pares y miden la consistencia de los juicios.</p>",
    sp:{ title:"Puntaje ponderado, paso a paso",
      params:[{ k:"w1", l:"Peso del costo del terreno", v:25, u:"%" }, { k:"w4", l:"Peso de la cercanía a clientes", v:20, u:"%" }],
      script(p){ const w = FC.map((c, i) => i === 0 ? p.w1 : i === 3 ? p.w4 : c[1]), S = w.reduce((a, b) => a + b, 0), sc = facScore(w), b = sc.indexOf(Math.max(...sc));
        return [
          { t:"Criterios", e:FC.map((c, i) => c[0] + " " + w[i] + " %").join(";  "), s:"Pesos de cada criterio" + (S !== 100 ? " (suman " + S + ": se normalizan)." : ".") },
          { t:"Quilicura", e:FC.map((c, i) => n(w[i] / S, 2) + "·" + c[2][0]).join(" + ") + " = " + n(sc[0], 2), h:n(sc[0], 2), s:"Peso × nota en cada criterio." },
          { t:"Pudahuel", e:"Puntaje = " + n(sc[1], 2), s:"Mismo cálculo." },
          { t:"Lampa", e:"Puntaje = " + n(sc[2], 2), s:"Lampa gana en costo del terreno, pierde en cercanía." },
          { t:"Decisión", e:"Gana " + FA[b] + " con " + n(sc[b], 2) + " de 10", h:FA[b], s:"Mayor puntaje ponderado." }]; } },
    vars:[["pesoᵢ", "Importancia del criterio i", "%", "suman 100"], ["notaᵢⱼ", "Calificación de la alternativa j en el criterio i", "1 a 10", "—"], ["Puntajeⱼ", "Suma ponderada de la alternativa j", "1 a 10", "—"]],
    sup:"<ul><li>Los criterios son independientes (no se cuenta dos veces lo mismo).</li><li>Las notas usan la misma escala y el mismo sentido (más es mejor).</li><li>Un criterio eliminatorio (por ejemplo, terreno inundable) se aplica antes, no como un peso más.</li></ul>",
    ex:{ t:"Tres terrenos y seis criterios: costo (25 %), acceso a autopistas (20 %), mano de obra (15 %), cercanía a clientes (20 %), normativa (10 %) y riesgo de inundación (10 %). Notas de 1 a 10.",
      steps:[["Multiplico cada nota por su peso y sumo.", "Combina criterios distintos en una escala.", "Quilicura 7,80; Pudahuel 7,35; Lampa 6,65.", "Quilicura gana por acceso y cercanía a clientes."],
        ["Pruebo subir el peso del costo a 40 %.", "Para ver si el resultado es robusto.", "Quilicura sigue arriba con una ventaja menor (Lampa se acerca).", "La decisión es razonablemente estable."]],
      r:"elegir Quilicura (7,80 de 10). Antes de cerrar, conviene revisar el análisis de sensibilidad de los pesos." },
    real:"<p>Se usa para elegir proveedores, terrenos, software o sistemas de transporte. En licitaciones públicas en Chile, las bases definen criterios y ponderaciones (precio, experiencia, plazo) y el puntaje decide la adjudicación.</p>",
    sim:"fp",
    chk(){ const sc = facScore(FC.map(c => c[1])); return [["Quilicura", sc[0], 7.8], ["Lampa", sc[2], 6.65]]; },
    quiz:[["Si los pesos suman 80 en vez de 100:", ["El método no sirve", "Se normalizan dividiendo por 80", "Se suma 20 a todos", "Gana la alternativa con menos criterios"], 1, "Lo que importa es la proporción entre pesos."],
      ["Un criterio eliminatorio (por ejemplo, prohibición legal) debe:", ["Tener el mayor peso", "Aplicarse antes, descartando alternativas", "Ignorarse", "Tener peso cero"], 1, "No se compensa con otros criterios."],
      ["¿Qué es el análisis de sensibilidad en este método?", ["Cambiar las notas al azar", "Probar si el ganador cambia al variar los pesos", "Eliminar el peor criterio", "Sumar los pesos"], 1, "Si un pequeño cambio de pesos cambia el ganador, la decisión es frágil."]],
    dec:"qué alternativa elegir cuando hay criterios no monetarios, y qué tan robusta es esa elección.",
    rel:["localizacion", "decisiones"] };

  CSIM.fp = { title:"Puntaje ponderado: ¿cambia el ganador si cambian los pesos?",
    goal:"cómo los pesos determinan el ganador y qué tan robusta es una decisión multicriterio.",
    params:FC.map((c, i) => ({ k:"w" + i, l:"Peso: " + c[0], min:0, max:50, step:5, v:c[1], u:"%", help:"Notas: " + FA.map((a, j) => a + " " + c[2][j]).join(", ") + "." })),
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 2); },
    draw(g, W, H, s, p, C){ const w = FC.map((_, i) => p["w" + i]), S = w.reduce((a, b) => a + b, 0) || 1, cols = [C.c1, C.c2, C.c3, C.c4, C.c5, C.muted], x0 = 90, x1 = W - 50, top = 20, bh = (H - top - 50) / 3, X = v => x0 + v / 10 * (x1 - x0);
      FA.forEach((a, j) => { const y = top + j * bh + 8; SIMG.text(g, a, 4, y + bh * 0.4, C.ink, C, "left", true); let acc = 0;
        FC.forEach((c, i) => { const v = w[i] / S * c[2][j] * s.t; g.fillStyle = cols[i]; g.fillRect(X(acc), y, X(acc + v) - X(acc) - 1, bh * 0.6); acc += v; });
        SIMG.text(g, n(acc, 2), X(acc) + 6, y + bh * 0.4, C.ink, C, "left", true); });
      FC.forEach((c, i) => { const lx = 4 + (i % 3) * (W / 3), ly = H - 30 + Math.floor(i / 3) * 14; g.fillStyle = cols[i]; g.fillRect(lx, ly - 8, 10, 10); SIMG.text(g, c[0], lx + 14, ly, C.muted, C, "left"); }); },
    metrics(s, p){ const w = FC.map((_, i) => p["w" + i]), sc = facScore(w); return FA.map((a, j) => [a, n(sc[j], 2)]).concat([["Ganador", FA[sc.indexOf(Math.max(...sc))]]]); },
    ann(s, p){ const w = FC.map((_, i) => p["w" + i]), sc = facScore(w), o = sc.map((v, j) => [v, j]).sort((a, b) => b[0] - a[0]); return "Cada color es el aporte de un criterio. Ventaja del primero sobre el segundo: " + n(o[0][0] - o[1][0], 2) + " puntos" + (o[0][0] - o[1][0] < 0.2 ? " (decisión frágil)." : "."); },
    concl(s, p){ const w = FC.map((_, i) => p["w" + i]), sc = facScore(w), b = sc.indexOf(Math.max(...sc)); return "<p>Con estos pesos gana <b>" + FA[b] + "</b> con " + n(sc[b], 2) + " de 10.</p><p><b>Qué demuestra:</b> el resultado depende de los pesos; si el ganador cambia con ajustes pequeños, la decisión necesita más análisis.</p><p><b>Qué decisión informa:</b> la elección de terreno, proveedor o sistema con criterios mixtos.</p>"; } };

  /* ===================== SIMULACIÓN MONTE CARLO ===================== */
  const npv = (r, F) => F.reduce((s, f, t) => s + f / (1 + r) ** t, 0);
  const tri = (a, m, b) => { if (b === a) return a; const u = Math.random(), fc = (m - a) / (b - a); return u < fc ? a + Math.sqrt(u * (b - a) * (m - a)) : b - Math.sqrt((1 - u) * (b - a) * (b - m)); };
  const mcVan = (q, pr, cv, p) => { const I = p.I * 1e6, dep = I / 5, F = [-I]; for (let k = 1; k <= 5; k++) { const uai = q() * (pr() - cv()) - 12e6 - dep, imp = uai > 0 ? uai * 0.27 : 0; F.push(uai - imp + dep); } return npv(0.12, F); };
  CRS["simulacion-mc"] = {
    kw:"monte carlo simulacion riesgo van distribucion triangular probabilidad de perdida escenarios incertidumbre",
    ess:{ pts:["Repite el cálculo del VAN miles de veces, cada vez con valores <b>al azar</b> dentro de rangos realistas.", "Entrega una <b>distribución</b> de resultados, no un solo número: VAN esperado, dispersión y probabilidad de pérdida.", "Con valores sesgados (costos que suelen subir, precios que suelen bajar), el VAN esperado es <b>peor</b> que el del caso más probable.", "Mientras más simulaciones, más estable el resultado."],
      fx:"VANₖ = −I + Σₜ Fₜ(xₖ) ÷ (1 + r)ᵗ,   k = 1…N", when:"un resultado depende de varias variables inciertas y quieres saber el riesgo, no solo el caso base." },
    intro:{ prob:"<p>Un proyecto de $ 80 millones depende de cuántas unidades se vendan, a qué precio y con qué costo. Con los valores más probables, el VAN sale cercano a cero. ¿Qué tan riesgoso es? ¿Cuál es la probabilidad de perder plata?</p>",
      anal:"<p>Es como simular mil viajes al trabajo con tráfico al azar: algunos días llegas en 30 minutos y otros en 70. El promedio y la probabilidad de llegar tarde dicen más que el tiempo del «día típico».</p>",
      terms:[["Variable aleatoria", "Dato incierto que se sortea en cada simulación."], ["Distribución triangular", "Se define con mínimo, más probable y máximo."], ["Iteración", "Un cálculo completo con valores sorteados."], ["Percentil 5 / 95", "Valor bajo el cual queda el 5 % / 95 % de los resultados."], ["P(VAN < 0)", "Proporción de simulaciones con pérdida."]] },
    adv:"<p><b>Por qué el caso base engaña:</b> si el costo variable va de 3.800 a 5.000 con moda 4.200, su promedio es 4.333 (más alto que la moda). Lo mismo con el precio hacia abajo. Por eso el VAN esperado (−$ 9,5 millones) es peor que el VAN del caso más probable (−$ 1,3 millones).</p><p><b>Correlaciones:</b> si precio y volumen se mueven juntos, hay que sortearlos correlacionados; si no, se subestima o sobrestima el riesgo.</p>",
    sp:{ title:"Una iteración de Monte Carlo, paso a paso",
      params:[],
      script(){ const dep = 16e6, uai = 12000 * (7200 - 4200) - 12e6 - dep, imp = uai * 0.27, F = uai - imp + dep, fa = (1 - 1.12 ** -5) / 0.12, van = -80e6 + F * fa;
        return [
          { t:"Caso base", e:"Q = 12.000;  P = $ 7.200;  CV = $ 4.200;  CF = $ 12.000.000", s:"Valores más probables." },
          { t:"Depreciación", e:"80.000.000 ÷ 5 = $ 16.000.000 por año", s:"Se descuenta para calcular impuestos." },
          { t:"Utilidad", e:"UAI = 12.000 · (7.200 − 4.200) − 12.000.000 − 16.000.000 = $ " + n(uai), h:"$ " + n(uai), s:"Utilidad antes de impuestos." },
          { t:"Flujo", e:"F = UAI − 27 % + depreciación = $ " + n(F), s:"La depreciación se suma de vuelta porque no es salida de caja." },
          { t:"VAN base", e:"VAN = −80.000.000 + " + n(F) + " × " + n(fa, 4) + " = $ " + n(van), h:"$ " + n(van), s:"Con valores probables, el VAN es levemente negativo." },
          { t:"Sortear", e:"Q ~ Tri(9.000; 12.000; 14.000);  P ~ Tri(6.500; 7.200; 7.800);  CV ~ Tri(3.800; 4.200; 5.000)", s:"En cada iteración y año se sortean valores con distribución triangular." },
          { t:"Repetir", e:"N = 5.000 iteraciones  →  VAN esperado ≈ −$ 9,5 millones;  P(VAN < 0) ≈ 93 %", h:"P(VAN < 0) ≈ 93 %", s:"Los rangos son asimétricos en contra: el riesgo real es mucho mayor que lo que muestra el caso base." }]; } },
    vars:[["N", "Número de simulaciones", "—", "1.000 a 20.000"], ["I", "Inversión inicial", "$", "—"], ["Q, P, CV", "Unidades, precio y costo variable (sorteados)", "u, $/u", "mín a máx"], ["Fₜ", "Flujo de caja del año t", "$", "—"], ["r", "Tasa de descuento", "% anual", "—"], ["VANₖ", "VAN de la iteración k", "$", "—"]],
    sup:"<ul><li>Los rangos (mínimo, probable, máximo) son realistas y vienen de datos o expertos.</li><li>Las variables se sortean independientes (salvo que se modele la correlación).</li><li>El modelo del flujo de caja es correcto: la simulación no corrige errores del modelo.</li></ul>",
    ex:{ t:"Proyecto de $ 80 millones a 5 años, tasa 12 %, impuesto 27 %, costos fijos $ 12 millones. Unidades 9.000 / 12.000 / 14.000; precio 6.500 / 7.200 / 7.800; costo variable 3.800 / 4.200 / 5.000.",
      steps:[["Calculo el VAN con los valores más probables.", "Es lo que haría un análisis tradicional.", "−$ 1,27 millones.", "Parece casi neutro."],
        ["Simulo 5.000 escenarios sorteando las tres variables cada año.", "Para ver el rango de resultados.", "VAN esperado −$ 9,46 millones; desviación $ 6,5 millones.", "El promedio es mucho peor que el caso base."],
        ["Calculo la probabilidad de pérdida.", "Es lo que más importa al directorio.", "P(VAN < 0) = 92,9 %.", "El proyecto, tal como está, no conviene."]],
      r:"no invertir así: hay 93 % de probabilidad de perder. Para hacerlo viable hay que bajar el costo variable o asegurar precio (contrato)." },
    real:"<p>La simulación Monte Carlo se usa para evaluar proyectos mineros (con precio del cobre incierto), planes de producción, plazos de proyectos (combinada con CPM) y riesgo financiero. Herramientas como @Risk o Crystal Ball la hacen sobre Excel.</p>",
    sim:"mc",
    chk(){ const dep = 16e6, uai = 12000 * 3000 - 12e6 - dep, F = uai * 0.73 + dep, van = -80e6 + F * (1 - 1.12 ** -5) / 0.12; return [["VAN base", van, -1271687.7407850474]]; },
    quiz:[["¿Qué entrega una simulación Monte Carlo que no entrega el caso base?", ["Un único VAN exacto", "La distribución de resultados y la probabilidad de pérdida", "La tasa de descuento", "El flujo del año 0"], 1, "Muestra el rango y el riesgo, no solo un número."],
      ["Si el costo variable tiene rango asimétrico hacia arriba, el VAN esperado comparado con el VAN del caso más probable es:", ["Mayor", "Menor", "Igual", "Indeterminado"], 1, "El promedio del costo queda sobre su moda: el VAN promedio baja."],
      ["Al aumentar el número de simulaciones:", ["El VAN esperado sube", "Los resultados se estabilizan", "El riesgo desaparece", "La tasa cambia"], 1, "Más iteraciones = estimaciones más estables."]],
    dec:"si invertir, qué variables controlar o asegurar, y cuánto riesgo se asume.",
    pre:["van-tir"], rel:["van-tir", "decisiones", "flujo-caja"] };

  CSIM.mc = { title:"Histograma del VAN que converge con miles de simulaciones",
    goal:"cómo una distribución de resultados muestra el riesgo que oculta el caso base, y cómo los datos inciertos mueven la probabilidad de pérdida.",
    params:[{ k:"pr", l:"Precio más probable", min:6600, max:7700, step:50, v:7200, u:"$", help:"Rango de 6.500 a 7.800." }, { k:"cv", l:"Costo variable más probable", min:3900, max:4900, step:50, v:4200, u:"$", help:"Rango de 3.800 a 5.000." }, { k:"I", l:"Inversión", min:50, max:110, step:5, v:80, u:"millones", help:"Inversión inicial del proyecto." }],
    init(){ return { v:[], bins:new Array(36).fill(0), neg:0, sum:0, sum2:0 }; }, onParam(s){ Object.assign(s, CSIM.mc.init()); },
    tick(s, p, dt){ for (let k = 0; k < 40 && s.v.length < 20000; k++) { const v = mcVan(() => tri(9000, 12000, 14000), () => tri(6500, p.pr, 7800), () => tri(3800, p.cv, 5000), p); s.v.push(v); s.sum += v; s.sum2 += v * v; if (v < 0) s.neg++; const b = Math.floor((v + 45e6) / 90e6 * 36); if (b >= 0 && b < 36) s.bins[b]++; } },
    draw(g, W, H, s, p, C){ const x0 = 40, x1 = W - 12, y0 = H - 34, top = 20, X = v => x0 + (v + 45e6) / 90e6 * (x1 - x0), mx = Math.max(1, ...s.bins), bw = (x1 - x0) / 36;
      SIMG.axes(g, x0, y0, x1, top, C, "VAN (millones $)", "Frecuencia");
      s.bins.forEach((c, k) => { const v = -45e6 + (k + 0.5) * 2.5e6, h = c / mx * (y0 - top - 20); g.fillStyle = v < 0 ? C.c2 : C.c3; g.fillRect(x0 + k * bw + 1, y0 - h, bw - 2, h); });
      g.strokeStyle = C.ink; g.lineWidth = 1.5; g.beginPath(); g.moveTo(X(0), top); g.lineTo(X(0), y0); g.stroke(); SIMG.text(g, "VAN = 0", X(0) + 4, top + 10, C.ink, C, "left", true);
      if (s.v.length) { const m = s.sum / s.v.length; g.strokeStyle = C.c1; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(X(m), top + 16); g.lineTo(X(m), y0); g.stroke(); g.setLineDash([]); SIMG.text(g, "promedio", X(m) - 4, top + 26, C.ink, C, "right"); }
      [-40, -20, 0, 20, 40].forEach(v => SIMG.text(g, v, X(v * 1e6), y0 + 14, C.muted, C, "center")); },
    metrics(s, p){ const N = s.v.length, m = N ? s.sum / N : 0, sd = N > 1 ? Math.sqrt(Math.max(0, s.sum2 / N - m * m)) : 0, base = mcVan(() => 12000, () => p.pr, () => p.cv, p);
      return [["Simulaciones", n(N)], ["VAN del caso base", "$ " + n(base / 1e6, 2) + " M"], ["VAN esperado", "$ " + n(m / 1e6, 2) + " M"], ["Desviación", "$ " + n(sd / 1e6, 2) + " M"], ["P(VAN < 0)", N ? n(s.neg / N * 100, 1) + " %" : "—"]]; },
    ann(s, p){ return s.v.length < 500 ? "Cada simulación sortea unidades, precio y costo de cada año y calcula un VAN. El histograma se va formando." : "Las barras naranjas son escenarios con pérdida. La línea azul (promedio) queda a la izquierda del caso base porque los rangos son asimétricos en contra."; },
    concl(s, p){ const N = s.v.length, m = N ? s.sum / N : 0; return "<p>Tras " + n(N) + " simulaciones, el VAN esperado es <b>$ " + n(m / 1e6, 2) + " millones</b> y la probabilidad de pérdida es <b>" + (N ? n(s.neg / N * 100, 1) : "—") + " %</b>.</p><p><b>Qué demuestra:</b> un solo número (el caso base) esconde el riesgo. La forma del histograma muestra cuánto se puede ganar o perder.</p><p><b>Qué decisión informa:</b> invertir o no, y qué variable conviene asegurar (precio o costo) para bajar el riesgo.</p>"; } };
})();
