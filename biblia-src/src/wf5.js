/* ============ CURSO · Módulo Producción y operaciones ============
   Referencias (calculadoras con datos por defecto): Pronósticos: MA3 = 549,3; SES(0,3) = 530,8; tendencia b = 12,371, a = 411,92 → 572,7.
   Balanceo: takt 75 s; Σt = 274 s; N mín = 4; eficiencia 91,3 %. OEE: A 91,3 %, P 86,1 %, Q 96,3 %, OEE 75,7 %.
   SMED: 78 → 31 min; 3,92 h/semana; 188 h/año; $ 40.984.000. VSM: takt 60 s; LT 28,26 días; VA 242 s; PCE 0,031 %.
   Secuenciación: SPT flujo 14,33; EDD tardanza 2,33. Johnson: B-D-C-E-A, makespan 30. Productividad total 1,236 → 1,289 (+4,3 %). */
(function(){
  const n = crsNum, mean = a => a.reduce((s, x) => s + x, 0) / a.length;

  /* ===================== PRONÓSTICOS ===================== */
  const DH = [420, 445, 430, 470, 490, 465, 510, 525, 505, 540, 560, 548];
  const fcAll = (D, m, a) => { const N = D.length, ma = D.map((_, t) => t >= m ? mean(D.slice(t - m, t)) : NaN); ma.push(mean(D.slice(N - m)));
    const es = [D[0]]; for (let t = 1; t <= N; t++) es[t] = a * D[t - 1] + (1 - a) * es[t - 1]; es[0] = NaN;
    const X = D.map((_, t) => t + 1), mx = mean(X), my = mean(D), b = X.reduce((s, x, i) => s + (x - mx) * (D[i] - my), 0) / X.reduce((s, x) => s + (x - mx) ** 2, 0), a0 = my - b * mx, tr = X.concat([N + 1]).map(x => a0 + b * x);
    const mad = F => { const e = D.map((d, t) => isFinite(F[t]) ? Math.abs(d - F[t]) : NaN).filter(isFinite); return mean(e); };
    return { ma, es, tr, a0, b, mad:{ ma:mad(ma), es:mad(es), tr:mad(tr) } }; };
  CRS.pronosticos = {
    kw:"pronosticos pronostico demanda promedio movil suavizamiento exponencial tendencia regresion mad mape señal de rastreo forecast",
    ess:{ pts:["Un pronóstico estima la demanda futura a partir de la historia: es la base de producción, compras e inventario.", "<b>Promedio móvil</b> y <b>suavizamiento exponencial</b> sirven para demanda estable; con tendencia se quedan atrás.", "La <b>tendencia lineal</b> ajusta una recta por mínimos cuadrados.", "Se elige el método con menor error (<b>MAD</b>, MAPE) y sin sesgo (señal de rastreo)."],
      fx:"Promedio móvil: F = (Dₜ + … + Dₜ₋ₙ₊₁) ÷ n;   SES: Fₜ₊₁ = α·Dₜ + (1 − α)·Fₜ;   Tendencia: F = a + b·t", when:"hay historia de demanda suficiente y el patrón pasado (nivel, tendencia) se espera que continúe." },
    intro:{ prob:"<p>Una planta de alimentos registró la demanda de 12 meses: 420, 445, 430… hasta 548. Debe decidir cuánto producir el mes 13. Si produce de menos, pierde ventas; si produce de más, acumula producto que vence.</p>",
      anal:"<p>Es como estimar cuánto vas a gastar en almuerzos el próximo mes: miras los últimos meses. Si siempre gastas parecido, un promedio basta. Si cada mes gastas un poco más, el promedio se queda corto y conviene proyectar la tendencia.</p>",
      terms:[["Dₜ", "Demanda real del período t."], ["Fₜ", "Pronóstico para el período t."], ["Error", "Dₜ − Fₜ."], ["MAD", "Desviación absoluta media: promedio de los errores en valor absoluto."], ["MAPE", "Error porcentual absoluto medio."], ["Señal de rastreo", "Suma de errores ÷ MAD: si pasa de ±4, el pronóstico tiene sesgo."], ["α", "Constante de suavizamiento (0 a 1): cuánto pesa el dato más reciente."]] },
    adv:"<p><b>Por qué se atrasan los promedios con tendencia:</b> el promedio de los últimos 3 meses está «centrado» un mes y medio atrás; si la demanda sube 12 unidades por mes, el promedio queda unas 18 unidades bajo la realidad. Por eso aquí la señal de rastreo marca sesgo para promedio móvil y suavizamiento simple.</p><p><b>Métodos con tendencia y estacionalidad:</b> Holt (doble suavizamiento) y Holt-Winters (con índices estacionales) se usan cuando hay temporadas (por ejemplo, ventas de helados).</p>",
    sp:{ title:"Tres métodos de pronóstico, paso a paso",
      params:[{ k:"m", l:"Períodos del promedio móvil", v:3, u:"", step:1 }, { k:"a", l:"Constante α", v:0.3, u:"" }],
      script(p){ const m = Math.max(1, Math.round(p.m)), r = fcAll(DH, m, p.a), last = DH.slice(-m);
        return [
          { t:"Datos", e:"D = " + DH.join(", "), s:"Demanda de los meses 1 a 12. Se nota una tendencia al alza." },
          { t:"Promedio móvil", e:"F₁₃ = (" + last.join(" + ") + ") ÷ " + m + " = " + n(r.ma[12], 1), h:n(r.ma[12], 1), s:"Promedio de los últimos " + m + " meses." },
          { t:"Suavizamiento", e:"F₁₃ = " + n(p.a, 2) + " · 548 + " + n(1 - p.a, 2) + " · " + n(r.es[11], 1) + " = " + n(r.es[12], 1), h:n(r.es[12], 1), s:"Mezcla el último dato real con el último pronóstico." },
          { t:"Tendencia: pendiente", e:"b = Σ(t − t̄)(D − D̄) ÷ Σ(t − t̄)² = " + n(r.b, 3), h:n(r.b, 3), s:"La demanda sube unas " + n(r.b, 1) + " unidades por mes." },
          { t:"Tendencia: intercepto", e:"a = D̄ − b · t̄ = " + n(mean(DH), 2) + " − " + n(r.b, 3) + " · 6,5 = " + n(r.a0, 2), s:"Punto de partida de la recta." },
          { t:"Tendencia", e:"F₁₃ = " + n(r.a0, 2) + " + " + n(r.b, 3) + " · 13 = " + n(r.tr[12], 1), h:n(r.tr[12], 1), s:"Se proyecta la recta al mes 13." },
          { t:"Comparar errores", e:"MAD: promedio móvil " + n(r.mad.ma, 1) + ";  suavizamiento " + n(r.mad.es, 1) + ";  tendencia " + n(r.mad.tr, 1), s:"Gana el de menor error. Con tendencia clara, la recta se ajusta mejor." }]; } },
    vars:[["Dₜ", "Demanda real en el período t", "unidades", "—"], ["Fₜ", "Pronóstico para el período t", "unidades", "—"], ["n", "Períodos del promedio móvil", "períodos", "2 a 12"], ["α", "Constante de suavizamiento", "—", "0,1 a 0,5"], ["a, b", "Intercepto y pendiente de la tendencia", "u y u/período", "—"], ["MAD", "Error absoluto medio", "unidades", "—"], ["MAPE", "Error porcentual medio", "%", "&lt; 10 % es bueno"], ["TS", "Señal de rastreo (Σ errores ÷ MAD)", "—", "entre −4 y +4"]],
    sup:"<ul><li>El patrón pasado continuará (sin cambios de mercado, promociones ni quiebres).</li><li>Los datos no tienen errores ni quiebres de stock (la venta perdida no aparece como demanda).</li><li>Si hay estacionalidad, estos métodos simples no bastan.</li></ul>",
    ex:{ t:"Demanda mensual de 12 meses: 420, 445, 430, 470, 490, 465, 510, 525, 505, 540, 560, 548. Se compara promedio móvil de 3 meses, suavizamiento con α = 0,3 y tendencia lineal.",
      steps:[["Calculo el promedio móvil del mes 13.", "Método simple y rápido.", "549 unidades; MAD 26,1.", "Se queda atrás porque la demanda crece."],
        ["Calculo el suavizamiento exponencial.", "Da más peso al último dato.", "531 unidades; MAD 33,6.", "Con α = 0,3 reacciona lento: aún peor con tendencia."],
        ["Ajusto la tendencia lineal.", "Captura el crecimiento.", "F₁₃ = 573; MAD 12,5; MAPE 2,6 %; sin sesgo.", "Es el mejor: error menor y sin sesgo."]],
      r:"usar la tendencia lineal: pronosticar 573 unidades para el mes 13 (error típico ± 12,5)." },
    real:"<p>Retail, alimentos y farmacéuticas pronostican por producto y local cada semana. Los ERP y herramientas de planificación (S&OP) combinan métodos estadísticos con el juicio comercial (promociones, lanzamientos). La exactitud del pronóstico se mide mes a mes con MAPE y sesgo.</p>",
    sim:"fc",
    chk(){ const r = fcAll(DH, 3, 0.3), T = NUC.tendencia(DH), E = NUC.suavizamiento(DH, 0.3); return [["SES", r.es[12], E[12]], ["b", r.b, T.b], ["MA3", r.ma[12], (540 + 560 + 548) / 3]]; },
    quiz:[["Con una demanda que crece todos los meses, el promedio móvil:", ["Se adelanta a la demanda", "Se queda atrás de la demanda", "Coincide con la demanda", "Se vuelve negativo"], 1, "Promedia datos antiguos, más bajos."],
      ["Un α alto (cercano a 1) en suavizamiento exponencial hace que el pronóstico:", ["Reaccione rápido a los cambios", "Ignore los datos recientes", "Sea siempre igual al promedio", "No tenga error"], 0, "Pesa más el último dato."],
      ["La señal de rastreo da +7. Esto indica:", ["Un pronóstico excelente", "Que el pronóstico subestima sistemáticamente (sesgo)", "Que el MAD es cero", "Que la demanda bajó"], 1, "Errores positivos acumulados: la demanda real supera al pronóstico una y otra vez."]],
    dec:"cuánto producir y comprar para los próximos períodos, y qué método usar según el patrón de la demanda.",
    pre:["descriptiva", "regresion"], rel:["eoq", "mrp", "stock-seguridad"] };

  CSIM.fc = { title:"Tres pronósticos persiguiendo una demanda con tendencia",
    goal:"por qué los promedios se quedan atrás cuando hay tendencia, cómo α cambia la reacción del suavizamiento y cómo el error decide el mejor método.",
    params:[{ k:"m", l:"Períodos del promedio móvil", min:2, max:6, step:1, v:3, u:"", help:"Más períodos = más estable pero más atrasado." },
      { k:"a", l:"Constante α del suavizamiento", min:0.05, max:0.95, step:0.05, v:0.3, u:"", help:"Cerca de 1 = reacciona rápido; cerca de 0 = muy suave." },
      { k:"g", l:"Crecimiento extra de la demanda", min:-10, max:20, step:1, v:0, u:"u/mes", help:"Suma una tendencia a los datos: mira cómo sufren los promedios." }],
    init(){ return { t:0 }; }, onParam(s){ s.t = Math.max(s.t, 12); }, tick(s, p, dt){ s.t += dt * 2; if (s.t > 22) s.t = 0; },
    draw(g, W, H, s, p, C){ const D = DH.map((d, i) => d + p.g * i), r = fcAll(D, p.m, p.a), x0 = 46, x1 = W - 14, y0 = H - 30, top = 34, k = Math.min(12, Math.floor(s.t)), lo = Math.min(...D, ...r.tr) - 20, hi = Math.max(...D, ...r.tr, r.ma[12], r.es[12]) + 20, X = t => x0 + (t - 0.5) / 13 * (x1 - x0), Y = v => y0 - (v - lo) / (hi - lo) * (y0 - top);
      SIMG.axes(g, x0, y0, x1, top, C, "mes", "Demanda");
      [lo + 20, (lo + hi) / 2, hi - 20].forEach(v => SIMG.text(g, n(v), x0 - 4, Y(v) + 4, C.muted, C, "right"));
      for (let t = 1; t <= 13; t += 2) SIMG.text(g, t, X(t), y0 + 14, C.muted, C, "center");
      const line = (F, col, w) => { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); let st = false; for (let t = 1; t <= Math.min(13, k + 1); t++) { const v = F[t - 1]; if (!isFinite(v)) continue; st ? g.lineTo(X(t), Y(v)) : g.moveTo(X(t), Y(v)); st = true; } g.stroke(); };
      line(r.ma, C.c2, 2); line(r.es, C.c3, 2); line(r.tr, C.c4, 2);
      D.slice(0, k).forEach((d, i) => { g.fillStyle = C.ink; g.beginPath(); g.arc(X(i + 1), Y(d), 4, 0, 7); g.fill(); });
      if (k >= 12) { [[r.ma[12], C.c2], [r.es[12], C.c3], [r.tr[12], C.c4]].forEach(([v, col]) => { g.fillStyle = col; g.beginPath(); g.arc(X(13), Y(v), 6, 0, 7); g.fill(); }); SIMG.text(g, "mes 13", X(13), top + 10, C.ink, C, "center", true); }
      [["Promedio móvil", C.c2], ["Suavizamiento", C.c3], ["Tendencia", C.c4]].forEach(([t, col], i) => { g.fillStyle = col; g.fillRect(x0 + i * 120, 8, 14, 4); SIMG.text(g, t, x0 + 18 + i * 120, 14, C.ink, C, "left"); }); },
    metrics(s, p){ const D = DH.map((d, i) => d + p.g * i), r = fcAll(D, p.m, p.a), best = Object.entries(r.mad).sort((a, b) => a[1] - b[1])[0][0];
      return [["Promedio móvil (mes 13)", n(r.ma[12], 1) + " · MAD " + n(r.mad.ma, 1)], ["Suavizamiento (mes 13)", n(r.es[12], 1) + " · MAD " + n(r.mad.es, 1)], ["Tendencia (mes 13)", n(r.tr[12], 1) + " · MAD " + n(r.mad.tr, 1)], ["Menor error", { ma:"Promedio móvil", es:"Suavizamiento", tr:"Tendencia" }[best]]]; },
    ann(s, p){ return s.t < 12 ? "Los puntos negros son la demanda real que va apareciendo. Cada línea es un método que intenta anticiparla." : "Fíjate en la distancia entre cada línea y los puntos: los promedios quedan bajo la demanda cuando esta crece."; },
    concl(s, p){ const D = DH.map((d, i) => d + p.g * i), r = fcAll(D, p.m, p.a), best = Object.entries(r.mad).sort((a, b) => a[1] - b[1])[0]; return "<p>Con estos datos, el método con menor error es <b>" + { ma:"promedio móvil", es:"suavizamiento exponencial", tr:"tendencia lineal" }[best[0]] + "</b> (MAD " + n(best[1], 1) + ").</p><p><b>Qué demuestra:</b> no hay un método mejor siempre; depende del patrón. Con tendencia, los promedios se atrasan; con demanda estable, ganan por simples.</p><p><b>Qué decisión informa:</b> qué método usar para planificar producción y compras.</p>"; } };

  /* ===================== BALANCEO DE LÍNEA ===================== */
  const ST0 = [70, 75, 61, 68];
  CRS.balanceo = {
    kw:"balanceo de linea takt time tiempo de ciclo estaciones eficiencia del balance retraso cuello de botella peso posicional rpw linea de ensamble",
    ess:{ pts:["El <b>takt</b> es el ritmo que exige el cliente: tiempo disponible ÷ demanda.", "Ninguna estación puede demorar más que el takt; si no, no se cumple la demanda.", "Mínimo de estaciones = Σ tiempos ÷ takt, redondeado hacia arriba.", "Eficiencia = Σ tiempos ÷ (estaciones × takt). El resto es tiempo ocioso."],
      fx:"Takt = Tiempo disponible ÷ Demanda;   N mín = ⌈Σt ÷ Takt⌉;   E = Σt ÷ (N · Takt)", when:"una línea de ensamble con tareas y precedencias debe producir una demanda dada con el menor número de estaciones." },
    intro:{ prob:"<p>Una línea arma un producto con 10 tareas que suman 274 segundos. Hay 450 minutos por turno y se deben producir 360 unidades. ¿Cuántas estaciones se necesitan y cómo repartir las tareas para que nadie quede sobrecargado ni ocioso?</p>",
      anal:"<p>Es como una cadena de personas pasando ladrillos: si una persona es más lenta, todos los demás esperan. El ritmo lo pone el más lento (cuello de botella). Balancear es repartir el trabajo para que todos demoren parecido.</p>",
      terms:[["Takt time", "Cada cuánto debe salir una unidad para cumplir la demanda."], ["Tiempo de ciclo de una estación", "Suma de los tiempos de las tareas asignadas."], ["Cuello de botella", "Estación más lenta: limita la producción."], ["Precedencia", "Tarea que debe hacerse antes que otra."], ["Peso posicional (RPW)", "Tiempo de la tarea más el de todas sus sucesoras: se asignan primero las de mayor peso."], ["Retraso del balance", "1 − eficiencia: porcentaje de tiempo ocioso."]] },
    adv:"<p><b>Tiempo de ciclo vs takt.</b> El takt es lo que pide el mercado; el tiempo de ciclo real es lo que da la estación más lenta. Si el ciclo real supera el takt, se trabaja horas extra o se agrega capacidad.</p><p><b>Heurísticas:</b> además del peso posicional existen la regla de la tarea más larga y la de más sucesoras. Ninguna garantiza el óptimo, pero suelen acercarse mucho.</p>",
    sp:{ title:"Balanceo de línea, paso a paso",
      params:[{ k:"T", l:"Tiempo disponible por turno", v:450, u:"min" }, { k:"D", l:"Demanda por turno", v:360, u:"u" }],
      script(p){ const tk = p.T * 60 / p.D, sum = 274, N = Math.ceil(sum / tk - 1e-9), E = sum / (4 * tk);
        return [
          { t:"Takt", e:"Takt = " + n(p.T) + " min × 60 ÷ " + n(p.D) + " = " + n(tk, 2) + " s", h:n(tk, 2) + " s", s:"Debe salir una unidad cada " + n(tk, 1) + " segundos." },
          { t:"Contenido", e:"Σt = 40 + 30 + 50 + 40 + 6 + 25 + 15 + 20 + 18 + 30 = 274 s", h:"274 s", s:"Tiempo total de trabajo por unidad." },
          { t:"Mínimo", e:"N mín = ⌈274 ÷ " + n(tk, 2) + "⌉ = ⌈" + n(sum / tk, 2) + "⌉ = " + N, h:"= " + N, s:"Se redondea hacia arriba: no existe una fracción de estación." },
          { t:"Asignar", e:"E1: A, B (70 s);  E2: C, F (75 s);  E3: D, G, E (61 s);  E4: H, I, J (68 s)", s:"Por peso posicional, respetando precedencias y sin pasar el takt de 75 s." },
          { t:"Eficiencia", e:"E = 274 ÷ (4 × " + n(tk, 2) + ") = " + n(E * 100, 1) + " %", h:n(E * 100, 1) + " %", s:"El " + n((1 - E) * 100, 1) + " % del tiempo de las estaciones queda ocioso." },
          { t:"Cuello", e:"Estación más cargada: E2 con 75 s", s:"Define el ritmo real de la línea: si E2 demora más, toda la línea se frena." }]; } },
    vars:[["Takt", "Tiempo disponible ÷ demanda", "segundos por unidad", "—"], ["tᵢ", "Tiempo de la tarea i", "s", "—"], ["Σt", "Contenido de trabajo total", "s", "—"], ["N", "Número de estaciones", "—", "≥ N mín"], ["Cₖ", "Tiempo de la estación k", "s", "≤ Takt"], ["E", "Eficiencia del balance", "%", "80 a 98"]],
    sup:"<ul><li>Tiempos de tarea constantes (sin variabilidad).</li><li>Precedencias fijas; las tareas no se dividen.</li><li>Un solo producto (las líneas mixtas requieren secuencias especiales).</li></ul>",
    ex:{ t:"10 tareas (A a J) suman 274 s. Turno de 450 minutos, demanda 360 unidades.",
      steps:[["Calculo el takt: 450 × 60 ÷ 360.", "Es el ritmo exigido.", "75 s por unidad.", "Ninguna estación puede pasar de 75 s."],
        ["Calculo el mínimo teórico de estaciones: ⌈274 ÷ 75⌉.", "Es la cota inferior.", "⌈3,65⌉ = 4 estaciones.", "No se puede hacer con 3 personas."],
        ["Asigno por peso posicional.", "Las tareas con más trabajo «aguas abajo» van primero.", "70, 75, 61 y 68 s.", "Se logra con 4 estaciones: el mínimo."],
        ["Calculo la eficiencia: 274 ÷ (4 × 75).", "Mide el aprovechamiento.", "91,3 % (8,7 % ocioso, 26 s por ciclo).", "Muy buen balance; la estación 3 tiene 14 s libres por unidad."]],
      r:"4 estaciones con eficiencia de 91,3 %. La estación 2 es el cuello de botella (75 s = takt): cualquier atraso ahí impide cumplir la demanda." },
    real:"<p>Las armadoras automotrices y de electrodomésticos rebalancean sus líneas cada vez que cambia la demanda (por ejemplo, de 360 a 420 unidades por turno, el takt baja de 75 a 64 s y puede requerir una estación más). En servicios, el mismo concepto se aplica a líneas de preparación de pedidos y de comida rápida.</p>",
    sim:"lb",
    chk(){ return [["Takt", 450 * 60 / 360, 75], ["Eficiencia", 274 / (4 * 75) * 100, 91.33333333333333]]; },
    quiz:[["Con 480 minutos disponibles y una demanda de 240 unidades, el takt es:", ["2 min", "0,5 min", "240 min", "480 min"], 0, "480 ÷ 240 = 2 minutos por unidad."],
      ["Si Σt = 200 s y el takt es 60 s, el mínimo de estaciones es:", ["3", "3,33", "4", "5"], 2, "⌈200 ÷ 60⌉ = ⌈3,33⌉ = 4."],
      ["Una estación demora 80 s y el takt es 75 s. Entonces:", ["La línea cumple la demanda", "Esa estación es un cuello de botella y no se cumple la demanda", "La eficiencia es 100 %", "Hay que quitar una estación"], 1, "La línea solo puede sacar una unidad cada 80 s."]],
    dec:"cuántas personas o estaciones poner en la línea y cómo repartir las tareas para cumplir la demanda con el menor costo.",
    pre:["tiempo-estandar"], rel:["oee", "vsm", "tiempo-estandar"] };

  CSIM.lb = { title:"Línea de ensamble: takt, cuello de botella y WIP",
    goal:"cómo la estación más lenta fija el ritmo de toda la línea, cómo se acumula inventario en proceso antes de ella y qué pasa si la demanda sube.",
    params:[{ k:"D", l:"Demanda por turno", min:250, max:480, step:10, v:360, u:"u", help:"Cambia el takt (450 min por turno)." },
      { k:"s2", l:"Tiempo de la estación 2", min:50, max:100, step:1, v:75, u:"s", help:"Súbelo sobre el takt y mira cómo se acumulan piezas antes de ella." }],
    init(){ return { t:0, next:0, q:[[], [], [], []], busy:[0, 0, 0, 0], out:0, wip:[0, 0, 0, 0] }; }, onParam(s){ Object.assign(s, CSIM.lb.init()); },
    tick(s, p, dt){ const tk = 450 * 60 / p.D, T = [ST0[0], p.s2, ST0[2], ST0[3]], h = dt * 40; let left = h;
      while (left > 0) { const step = Math.min(left, 1); left -= step; s.t += step;
        if (s.t >= s.next) { s.q[0].push(0); s.next += tk; }
        for (let k = 3; k >= 0; k--) { if (s.busy[k] > 0) { s.busy[k] -= step; if (s.busy[k] <= 0) { s.busy[k] = 0; if (k < 3) s.q[k + 1].push(0); else s.out++; } }
          if (s.busy[k] === 0 && s.q[k].length) { s.q[k].shift(); s.busy[k] = T[k]; } } } },
    draw(g, W, H, s, p, C){ const tk = 450 * 60 / p.D, T = [ST0[0], p.s2, ST0[2], ST0[3]], bw = (W - 40) / 4, top = 20, by = 70;
      T.forEach((t, k) => { const x = 20 + k * bw, over = t > tk; g.strokeStyle = over ? C.bad : C.ink; g.lineWidth = over ? 3 : 1.5; g.strokeRect(x + bw * 0.3, by, bw * 0.55, 46); SIMG.text(g, "E" + (k + 1), x + bw * 0.575, by - 6, C.ink, C, "center", true);
        if (s.busy[k] > 0) { g.fillStyle = C.c3; g.beginPath(); g.arc(x + bw * 0.575, by + 23, 9, 0, 7); g.fill(); g.fillStyle = C.c3; g.globalAlpha = 0.3; g.fillRect(x + bw * 0.3, by + 40, bw * 0.55 * (1 - s.busy[k] / t), 6); g.globalAlpha = 1; }
        const qn = s.q[k].length; for (let j = 0; j < Math.min(qn, 12); j++) { g.fillStyle = C.c1; g.beginPath(); g.arc(x + bw * 0.24 - (j % 4) * 9, by + 10 + Math.floor(j / 4) * 12, 4, 0, 7); g.fill(); } if (qn > 12) SIMG.text(g, "+" + (qn - 12), x + 2, by + 56, C.bad, C, "left", true); });
      const y0 = H - 26, h1 = H - by - 90, mx = Math.max(110, ...T), Y = v => y0 - v / mx * h1; SIMG.text(g, "Tiempo por estación (s) vs takt", 20, by + 72, C.muted, C, "left");
      T.forEach((t, k) => { const x = 20 + k * bw + bw * 0.3; g.fillStyle = t > tk ? C.bad : C.c1; g.fillRect(x, Y(t), bw * 0.55, y0 - Y(t)); SIMG.text(g, n(t) + " s", x + bw * 0.275, Y(t) - 4, C.ink, C, "center", true); });
      SIMG.hline(g, 20, W - 20, Y(tk), C.c2, [6, 4], "Takt " + n(tk, 1) + " s", C); },
    metrics(s, p){ const tk = 450 * 60 / p.D, T = [ST0[0], p.s2, ST0[2], ST0[3]], cyc = Math.max(...T), sum = T.reduce((a, b) => a + b, 0);
      return [["Takt", n(tk, 1) + " s"], ["Ciclo real (estación más lenta)", n(cyc) + " s"], ["Producción posible por turno", n(450 * 60 / cyc) + " u"], ["Eficiencia del balance", n(sum / (4 * Math.max(tk, cyc)) * 100, 1) + " %"], ["WIP en la línea", n(s.q.reduce((a, q) => a + q.length, 0))], ["Unidades terminadas", n(s.out)]]; },
    ann(s, p){ const tk = 450 * 60 / p.D, T = [ST0[0], p.s2, ST0[2], ST0[3]], k = T.indexOf(Math.max(...T)); return Math.max(...T) > tk ? "La estación E" + (k + 1) + " demora más que el takt: se acumulan piezas (círculos azules) antes de ella y no se cumple la demanda." : "Todas las estaciones caben bajo el takt. E" + (k + 1) + " es la más cargada: cualquier atraso ahí frena toda la línea."; },
    concl(s, p){ const tk = 450 * 60 / p.D, T = [ST0[0], p.s2, ST0[2], ST0[3]], cyc = Math.max(...T); return "<p>Con takt de " + n(tk, 1) + " s y una estación más lenta de " + cyc + " s, la línea puede producir <b>" + n(450 * 60 / cyc) + " unidades</b> por turno frente a una demanda de " + p.D + ".</p><p><b>Qué demuestra:</b> la línea avanza al ritmo de su cuello de botella; el inventario en proceso crece justo antes de él.</p><p><b>Qué decisión informa:</b> cuántas estaciones poner, dónde reforzar y si conviene rebalancear al cambiar la demanda.</p>"; } };

  /* ===================== OEE ===================== */
  const oeeCalc = p => { const plan = 480 - 45, op = plan - p.np, A = op / plan, P = Math.min(1, 0.9 * p.u / op), Q = (p.u - p.d) / p.u; return { plan, op, A, P, Q, O:A * P * Q }; };
  CRS.oee = {
    kw:"oee efectividad global de los equipos disponibilidad rendimiento calidad perdidas tpm paradas velocidad defectos capacidad utilizacion",
    ess:{ pts:["El OEE mide qué tanto del tiempo planificado se convierte en <b>unidades buenas a velocidad ideal</b>.", "OEE = Disponibilidad × Rendimiento × Calidad.", "Separa tres pérdidas: <b>paradas</b>, <b>velocidad reducida</b> y <b>defectos</b>.", "Referencias: 85 % es clase mundial; bajo 60 % hay mucho por mejorar."],
      fx:"OEE = A × P × Q", when:"quieres saber cuánto rinde realmente un equipo y dónde se pierde la capacidad." },
    intro:{ prob:"<p>Una envasadora trabaja un turno de 480 minutos. Al final del turno produjo 380 unidades, 14 defectuosas. El jefe dice que la máquina «anduvo bien». ¿Cuánto rindió realmente y dónde se perdió el resto?</p>",
      anal:"<p>Es como un bus que debería hacer 10 viajes al día. Si estuvo en el taller una hora (disponibilidad), anduvo lento por el tráfico (rendimiento) y algunos pasajeros se bajaron en el lugar equivocado (calidad), al final hizo bastante menos que 10 viajes útiles.</p>",
      terms:[["Tiempo planificado", "Turno menos paradas planificadas (colación, mantención programada)."], ["Disponibilidad (A)", "Tiempo operativo ÷ tiempo planificado: pierde por fallas y cambios."], ["Rendimiento (P)", "Producción real ÷ producción a velocidad ideal en el tiempo operativo."], ["Calidad (Q)", "Unidades buenas ÷ unidades totales."], ["Tiempo de ciclo ideal", "Lo menos que puede demorar una unidad (velocidad de diseño)."]] },
    adv:"<p><b>Las seis grandes pérdidas (TPM):</b> fallas y cambios de formato (disponibilidad); microparadas y velocidad reducida (rendimiento); defectos y mermas de arranque (calidad). Cada una tiene herramientas propias: mantenimiento preventivo, SMED, ajustes de proceso, poka-yoke.</p><p><b>Utilización y eficiencia</b> se calculan sobre otras bases (capacidad de diseño y efectiva) y no deben confundirse con el OEE.</p>",
    sp:{ title:"OEE, paso a paso",
      params:[{ k:"np", l:"Paradas no planificadas", v:38, u:"min" }, { k:"u", l:"Unidades producidas", v:380, u:"u" }, { k:"d", l:"Unidades defectuosas", v:14, u:"u" }],
      script(p){ const r = oeeCalc(p);
        return [
          { t:"Tiempo planificado", e:"480 − 45 = " + r.plan + " min", s:"Se descuentan las paradas planificadas (colación, mantención programada)." },
          { t:"Disponibilidad", e:"A = (" + r.plan + " − " + p.np + ") ÷ " + r.plan + " = " + n(r.A * 100, 1) + " %", h:n(r.A * 100, 1) + " %", s:"Fallas y cambios dejaron la máquina detenida " + p.np + " minutos." },
          { t:"Rendimiento", e:"P = 0,9 × " + p.u + " ÷ " + n(r.op) + " = " + n(r.P * 100, 1) + " %", h:n(r.P * 100, 1) + " %", s:"A velocidad ideal (0,9 min por unidad) habría producido " + n(r.op / 0.9) + " unidades en el tiempo operativo." },
          { t:"Calidad", e:"Q = (" + p.u + " − " + p.d + ") ÷ " + p.u + " = " + n(r.Q * 100, 1) + " %", h:n(r.Q * 100, 1) + " %", s:"Unidades buenas sobre el total." },
          { t:"OEE", e:"OEE = " + n(r.A, 3) + " × " + n(r.P, 3) + " × " + n(r.Q, 3) + " = " + n(r.O * 100, 1) + " %", h:n(r.O * 100, 1) + " %", s:"Del tiempo planificado, solo ese porcentaje se convirtió en unidades buenas a velocidad ideal." }]; } },
    vars:[["A", "Disponibilidad = tiempo operativo ÷ tiempo planificado", "%", "85 a 95"], ["P", "Rendimiento = ciclo ideal × unidades ÷ tiempo operativo", "%", "85 a 95"], ["Q", "Calidad = unidades buenas ÷ unidades totales", "%", "95 a 99,9"], ["OEE", "A × P × Q", "%", "clase mundial ≈ 85"], ["Tc ideal", "Tiempo de ciclo ideal", "min por unidad", "—"]],
    sup:"<ul><li>El tiempo de ciclo ideal es realista (de diseño o el mejor demostrado).</li><li>Se registran todas las paradas; las microparadas suelen esconderse en el rendimiento.</li><li>Comparar OEE entre máquinas distintas es engañoso: úsalo para mejorar la misma máquina en el tiempo.</li></ul>",
    ex:{ t:"Turno de 480 min, 45 min de paradas planificadas, 38 min de paradas no planificadas, ciclo ideal 0,9 min por unidad, 380 unidades producidas, 14 defectuosas.",
      steps:[["Calculo A = (435 − 38) ÷ 435.", "Pérdida por paradas.", "91,3 %.", "Se perdieron 8,7 puntos por fallas y cambios."],
        ["Calculo P = 0,9 × 380 ÷ 397.", "Pérdida por velocidad.", "86,1 %.", "La mayor pérdida: 12,6 puntos por andar lento o microparadas."],
        ["Calculo Q = 366 ÷ 380.", "Pérdida por defectos.", "96,3 %.", "2,9 puntos perdidos por defectos."],
        ["Multiplico: OEE = 0,913 × 0,861 × 0,963.", "Indicador global.", "75,7 %.", "Atacar primero la velocidad (microparadas, ajustes) es lo que más sube el OEE."]],
      r:"OEE de 75,7 %. La mayor pérdida está en el rendimiento (velocidad): es la primera que conviene atacar." },
    real:"<p>El OEE nació del mantenimiento productivo total (TPM) en Japón y hoy lo usan embotelladoras, plantas de alimentos, envases y minería (para chancadores y molinos). Los tableros de planta muestran el OEE por turno y la cascada de pérdidas para que los equipos decidan qué mejorar.</p>",
    sim:"oee",
    chk(){ const r = oeeCalc({ np:38, u:380, d:14 }); return [["OEE", r.O, 0.913 * 0 + (397 / 435) * (342 / 397) * (366 / 380)]]; },
    quiz:[["Disponibilidad 90 %, rendimiento 90 % y calidad 90 %. El OEE es:", ["90 %", "81 %", "72,9 %", "270 %"], 2, "0,9 × 0,9 × 0,9 = 0,729."],
      ["Una máquina anda al 80 % de su velocidad de diseño por microparadas. Eso afecta:", ["La disponibilidad", "El rendimiento", "La calidad", "Ninguno"], 1, "Las microparadas y la velocidad reducida bajan el rendimiento."],
      ["¿Qué herramienta ataca directamente la pérdida por cambios de formato?", ["SMED", "Pareto", "Ishikawa", "ABC"], 0, "SMED reduce el tiempo de cambio y sube la disponibilidad."]],
    dec:"dónde está la capacidad oculta de un equipo y qué pérdida atacar primero.",
    rel:["smed", "balanceo", "productividad"] };

  CSIM.oee = { title:"Cascada de pérdidas del turno: del tiempo total a las unidades buenas",
    goal:"cómo se va perdiendo capacidad en paradas, velocidad y defectos, y cuál de las tres pérdidas pesa más.",
    params:[{ k:"np", l:"Paradas no planificadas", min:0, max:150, step:2, v:38, u:"min", help:"Fallas y cambios de formato." }, { k:"u", l:"Unidades producidas", min:200, max:480, step:5, v:380, u:"u", help:"A velocidad ideal se podrían hacer más (0,9 min/u)." }, { k:"d", l:"Unidades defectuosas", min:0, max:80, step:1, v:14, u:"u", help:"Rechazos y reprocesos." }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0.6; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.6); },
    draw(g, W, H, s, p, C){ const r = oeeCalc(p), ideal = r.op * Math.min(1, 0.9 * p.u / r.op), good = (p.u - p.d) * 0.9, bars = [["Turno", 480, C.muted], ["Planificado", r.plan, C.c1], ["Operativo", r.op, C.c1], ["A velocidad ideal", 0.9 * p.u, C.c1], ["Unidades buenas", good, C.c3]];
      const x0 = Math.min(140, W * 0.34), x1 = W - 60, bh = (H - 30) / bars.length, X = v => x0 + v / 480 * (x1 - x0);
      bars.forEach(([lab, v, col], i) => { const y = 14 + i * bh, w = (X(v) - x0) * s.t; SIMG.text(g, lab, 4, y + bh * 0.5, C.ink, C, "left", i === 4); g.fillStyle = col; g.fillRect(x0, y + 4, w, bh - 12); SIMG.text(g, n(v) + " min", x0 + w + 6, y + bh * 0.5, C.ink, C, "left", true);
        if (i > 0) { const prev = bars[i - 1][1], loss = prev - v; if (loss > 0.5) { g.fillStyle = C.bad; g.globalAlpha = 0.25; g.fillRect(X(v), y + 4, (X(prev) - X(v)) * s.t, bh - 12); g.globalAlpha = 1; } } });
      SIMG.text(g, "OEE = " + n(r.O * 100, 1) + " %", W - 6, H - 6, C.ink, C, "right", true); },
    metrics(s, p){ const r = oeeCalc(p); return [["Disponibilidad", n(r.A * 100, 1) + " %"], ["Rendimiento", n(r.P * 100, 1) + " %"], ["Calidad", n(r.Q * 100, 1) + " %"], ["OEE", n(r.O * 100, 1) + " %"], ["Puntos perdidos por paradas", n((1 - r.A) * 100, 1)], ["Por velocidad", n(r.A * (1 - r.P) * 100, 1)], ["Por defectos", n(r.A * r.P * (1 - r.Q) * 100, 1)]]; },
    ann(s, p){ const r = oeeCalc(p), L = [["paradas", 1 - r.A], ["velocidad", r.A * (1 - r.P)], ["defectos", r.A * r.P * (1 - r.Q)]].sort((a, b) => b[1] - a[1]); return "Cada barra pierde una parte (zona roja) respecto de la anterior. La mayor pérdida hoy es por " + L[0][0] + "."; },
    concl(s, p){ const r = oeeCalc(p); return "<p>El OEE es <b>" + n(r.O * 100, 1) + " %</b>: de " + r.plan + " minutos planificados, solo " + n(r.O * r.plan) + " se convirtieron en unidades buenas a velocidad ideal.</p><p><b>Qué demuestra:</b> tres porcentajes «altos» multiplicados dan un OEE bastante menor. La capacidad oculta está en la pérdida más grande.</p><p><b>Qué decisión informa:</b> priorizar mantenimiento, SMED, ajuste de velocidad o control de calidad.</p>"; } };

  /* ===================== SMED ===================== */
  const SA = [["Buscar molde", 9, "E", 9], ["Traer herramientas", 6, "E", 6], ["Precalentar molde", 12, "E", 12], ["Detener y purgar", 4, "I", 4], ["Soltar pernos", 8, "I", 2], ["Retirar molde", 6, "I", 5], ["Montar molde", 7, "I", 6], ["Apretar pernos", 9, "I", 2], ["Conectar mangueras", 5, "I", 2], ["Ajustar parámetros", 8, "I", 7], ["Piezas de prueba", 4, "I", 3]];
  CRS.smed = {
    kw:"smed cambio rapido de formato setup cambio de herramienta actividades internas externas shingo single minute exchange of die",
    ess:{ pts:["SMED reduce el tiempo de <b>cambio de formato</b> (con la máquina detenida).", "Clave: separar actividades <b>internas</b> (solo con la máquina parada) de <b>externas</b> (se pueden hacer con la máquina andando).", "Luego convertir internas en externas y acortar las internas que quedan.", "Menos tiempo de cambio = más capacidad y lotes más chicos."],
      fx:"Horas liberadas al año = (minutos ahorrados × cambios por semana ÷ 60) × semanas", when:"una máquina pierde mucho tiempo en cambios de producto o formato." },
    intro:{ prob:"<p>Una inyectora de plástico demora 78 minutos en cambiar de molde, 5 veces por semana. Durante ese tiempo la máquina no produce. ¿Se puede reducir?</p>",
      anal:"<p>Es como una parada en boxes de Fórmula 1: los neumáticos y las herramientas ya están listos antes de que llegue el auto. Todo lo que se puede preparar antes, se prepara antes. Con el auto detenido solo se hace lo imprescindible, y muy rápido.</p>",
      terms:[["Actividad interna", "Solo se puede hacer con la máquina detenida."], ["Actividad externa", "Se puede hacer con la máquina funcionando (antes o después del cambio)."], ["Tiempo de cambio", "Desde la última pieza buena del producto anterior hasta la primera buena del siguiente."], ["Shigeo Shingo", "Ingeniero japonés que desarrolló SMED en Toyota."]] },
    adv:"<p>Técnicas para acortar internas: sujeciones rápidas (un cuarto de vuelta en vez de 12 pernos), alturas estandarizadas de moldes, conexiones rápidas de mangueras, operaciones en paralelo (dos personas), y eliminar ajustes con topes y plantillas. El objetivo histórico es «un dígito»: menos de 10 minutos.</p>",
    sp:{ title:"SMED, paso a paso",
      params:[{ k:"c", l:"Cambios por semana", v:5, u:"" }, { k:"v", l:"Valor de una hora productiva", v:218000, u:"$" }],
      script(p){ const act = SA.reduce((s, a) => s + a[1], 0), prop = SA.filter(a => a[2] === "I").reduce((s, a) => s + a[3], 0), red = act - prop, hs = red * p.c / 60, ha = hs * 48;
        return [
          { t:"Situación actual", e:"Cambio actual = " + act + " min (todo con la máquina detenida)", s:"Hoy todas las actividades se hacen con la máquina parada." },
          { t:"Separar", e:"Externas posibles: buscar molde (9), traer herramientas (6), precalentar (12) = 27 min", h:"27 min", s:"Se pueden hacer mientras la máquina sigue produciendo el producto anterior." },
          { t:"Acortar internas", e:"Pernos 8 → 2, apretar 9 → 2, mangueras 5 → 2…", s:"Sujeciones rápidas y conexiones rápidas." },
          { t:"Cambio propuesto", e:"Internas propuestas = " + prop + " min", h:prop + " min", s:"Reducción de " + red + " minutos (" + n(red / act * 100) + " %)." },
          { t:"Horas liberadas", e:red + " min × " + p.c + " cambios ÷ 60 = " + n(hs, 2) + " h/semana  →  × 48 = " + n(ha) + " h/año", h:n(ha) + " h/año", s:"Tiempo que la máquina vuelve a producir." },
          { t:"Valor", e:n(ha) + " h × $ " + n(p.v) + " = $ " + n(Math.round(ha) * p.v), h:"$ " + n(Math.round(ha) * p.v), s:"Valor anual de la capacidad recuperada." }]; } },
    vars:[["Tᵢ", "Tiempo de actividades internas", "min", "—"], ["Tₑ", "Tiempo de actividades externas", "min", "≤ tiempo entre cambios"], ["c", "Cambios por semana", "—", "—"], ["v", "Valor de una hora productiva", "$/h", "—"]],
    sup:"<ul><li>Hay demanda para lo que se produzca en las horas liberadas (si no, el beneficio es bajar lotes e inventario).</li><li>Las externas caben en el tiempo de producción entre cambios.</li></ul>",
    ex:{ t:"Cambio de molde de 78 minutos, 11 actividades, 5 cambios por semana, 48 semanas al año, hora productiva $ 218.000.",
      steps:[["Clasifico cada actividad en interna o externa.", "Primera etapa de SMED.", "Buscar molde, traer herramientas y precalentar (27 min) pueden ser externas.", "Sin inversión, el cambio baja de 78 a 51 minutos."],
        ["Acorto las internas con sujeciones y conexiones rápidas.", "Segunda etapa.", "Internas: 31 minutos.", "Reducción total de 47 minutos (60 %)."],
        ["Calculo las horas liberadas.", "Para medir el impacto.", "47 × 5 ÷ 60 = 3,92 h por semana; 188 h al año.", "Casi 4 turnos de 48 horas al año."],
        ["Valorizo.", "Para justificar la inversión.", "188 × $ 218.000 = $ 40.984.000 al año.", "Justifica fácilmente sujeciones rápidas y un carro de moldes."]],
      r:"bajar el cambio de 78 a 31 minutos (60 %), liberando 188 horas al año, valorizadas en unos $ 41 millones." },
    real:"<p>SMED se aplica en inyectoras, prensas, envasadoras y líneas de alimentos con muchos formatos. En mantenimiento minero, la misma lógica se usa en paradas de planta: todo lo que se puede preparar antes de detener el molino se prepara antes.</p>",
    sim:"smed",
    chk(){ return [["Propuesto", SA.filter(a => a[2] === "I").reduce((s, a) => s + a[3], 0), 31], ["Valor", 188 * 218000, 40984000]]; },
    quiz:[["Una actividad externa es la que:", ["Hace un proveedor externo", "Se puede hacer con la máquina funcionando", "Se hace afuera de la planta", "Dura más de 10 minutos"], 1, "No requiere detener la máquina."],
      ["El primer paso de SMED es:", ["Comprar herramientas nuevas", "Separar actividades internas de externas", "Eliminar el cambio", "Aumentar los lotes"], 1, "Solo con separar se logra una gran reducción sin inversión."],
      ["Reducir el tiempo de cambio permite:", ["Lotes más grandes", "Lotes más chicos y menos inventario", "Más defectos", "Menos capacidad"], 1, "Si cambiar es barato, conviene cambiar más seguido."]],
    dec:"cuánto invertir en reducir los cambios y cuánta capacidad e inventario se ganan.",
    rel:["oee", "vsm", "eoq"] };

  CSIM.smed = { title:"Cambio de formato: de 78 minutos a 31",
    goal:"cómo se reduce el tiempo de máquina detenida al pasar actividades a externas y acortar las internas.",
    params:[{ k:"c", l:"Cambios por semana", min:1, max:20, step:1, v:5, u:"", help:"Más cambios = más valor de la mejora." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t += dt; if (s.t > 9) s.t = 0; },
    draw(g, W, H, s, p, C){ const ph = Math.min(1, Math.max(0, (s.t - 1.5) / 3)), x0 = 90, x1 = W - 14, X = v => x0 + v / 80 * (x1 - x0), y1 = 40, y2 = 120, h = 32;
      SIMG.text(g, "Máquina detenida", 4, y1 + h * 0.6, C.ink, C, "left", true); SIMG.text(g, "Máquina andando", 4, y2 + h * 0.6, C.ink, C, "left", true);
      g.strokeStyle = C.line; g.strokeRect(x0, y1, x1 - x0, h); g.strokeRect(x0, y2, x1 - x0, h);
      let tI = 0, tE = 0; const cols = [C.c1, C.c2, C.c3, C.c4, C.c5];
      SA.forEach((a, i) => { const ext = a[2] === "E", dur = a[1] + (a[3] - a[1]) * (ext ? 0 : ph); let x, y;
        if (ext) { const xi = tI, xe = tE; x = xi + (xe - xi) * ph; y = y1 + (y2 - y1) * ph; tE += a[1]; tI += a[1] * (1 - ph); } else { x = tI; y = y1; tI += dur; }
        g.fillStyle = cols[i % 5]; g.globalAlpha = 0.75; g.fillRect(X(x), y + 2, X(x + dur) - X(x) - 1, h - 4); g.globalAlpha = 1; });
      SIMG.text(g, "Máquina detenida: " + n(tI) + " min", x0, y1 - 8, C.ink, C, "left", true);
      for (let v = 0; v <= 80; v += 10) SIMG.text(g, v, X(v), H - 10, C.muted, C, "center"); SIMG.text(g, ph < 1 ? "Moviendo externas y acortando internas…" : "Propuesta SMED", W - 6, 14, C.muted, C, "right"); }, h:W => 200,
    metrics(s, p){ const red = 47; return [["Cambio actual", "78 min"], ["Cambio propuesto", "31 min"], ["Reducción", "60 %"], ["Horas liberadas al año", n(red * p.c / 60 * 48)], ["Valor anual", "$ " + n(Math.round(red * p.c / 60 * 48) * 218000)]]; },
    ann(s){ return s.t < 1.5 ? "Situación actual: todas las actividades se hacen con la máquina detenida (78 min)." : "Las actividades externas bajan a la fila de abajo (se hacen con la máquina andando) y las internas se acortan."; },
    concl(s, p){ return "<p>El tiempo con la máquina detenida baja de <b>78 a 31 minutos</b>. Con " + p.c + " cambios por semana se liberan <b>" + n(47 * p.c / 60 * 48) + " horas al año</b>.</p><p><b>Qué demuestra:</b> gran parte del cambio no necesita la máquina detenida; solo reorganizar ya ahorra 27 minutos.</p><p><b>Qué decisión informa:</b> en qué invertir (sujeciones rápidas, carro de moldes) y cuánto achicar los lotes.</p>"; } };

  /* ===================== VSM ===================== */
  const VP = [["Corte", 39, 4600], ["Prensado", 46, 1100], ["Soldadura", 62, 1600], ["Pintura", 40, 1200], ["Ensamble", 55, 1800], ["Despacho", 0, 2700]];
  const vsmCalc = p => { const P = VP.map((x, i) => i === 0 ? [x[0], x[1], p.ic] : x), days = P.map(x => x[2] / p.d), LT = days.reduce((a, b) => a + b, 0), VA = P.reduce((s, x) => s + x[1], 0); return { P, days, LT, VA, takt:27600 / p.d, PCE:VA / (LT * 27600) }; };
  CRS.vsm = {
    kw:"vsm mapa de flujo de valor value stream mapping lead time tiempo de valor agregado pce eficiencia del ciclo lean inventario takt",
    ess:{ pts:["El VSM dibuja el flujo completo de un producto: procesos, inventarios e información.", "El <b>lead time</b> (días) es casi todo espera en inventarios; el <b>valor agregado</b> son segundos.", "Por la ley de Little: días de inventario = inventario ÷ demanda diaria.", "PCE = valor agregado ÷ lead time: suele ser menor a 1 %."],
      fx:"Días de inventario = Inventario ÷ Demanda diaria;   PCE = VA ÷ LT", when:"quieres ver dónde se pierde tiempo en un proceso completo y priorizar mejoras lean." },
    intro:{ prob:"<p>Una pieza metálica pasa por corte, prensado, soldadura, pintura, ensamble y despacho. Trabajarla toma 4 minutos, pero desde que entra la materia prima hasta que sale el producto pasan casi 4 semanas. ¿Dónde se va el tiempo?</p>",
      anal:"<p>Es como un trámite: la firma toma 2 minutos, pero el papel pasa 3 semanas en bandejas de distintas oficinas. El VSM muestra las bandejas.</p>",
      terms:[["Lead time", "Tiempo total que demora una pieza en atravesar el proceso."], ["Tiempo de valor agregado (VA)", "Tiempo en que se transforma el producto de algo que el cliente paga."], ["PCE", "Eficiencia del ciclo del proceso: VA ÷ lead time."], ["Takt", "Ritmo de la demanda."], ["Supermercado / FIFO", "Formas de controlar el inventario entre procesos en un estado futuro."]] },
    adv:"<p><b>Estado futuro:</b> se rediseña el flujo para producir al takt, reemplazar inventarios por flujo continuo o supermercados con kanban, y programar en un solo punto (el marcapaso). La meta es bajar el lead time, no los segundos de proceso.</p>",
    sp:{ title:"Lead time y PCE, paso a paso",
      params:[{ k:"d", l:"Demanda diaria", v:460, u:"u/día" }, { k:"ic", l:"Inventario antes de corte", v:4600, u:"u" }],
      script(p){ const r = vsmCalc(p);
        return [
          { t:"Takt", e:"27.600 s ÷ " + n(p.d) + " = " + n(r.takt, 1) + " s", s:"Ritmo de la demanda." },
          { t:"Días de inventario", e:r.P.map((x, i) => x[0] + " " + n(x[2]) + " ÷ " + n(p.d) + " = " + n(r.days[i], 2)).slice(0, 3).join(";  ") + "…", s:"Ley de Little: cada pieza espera, en promedio, el inventario dividido por lo que sale por día." },
          { t:"Lead time", e:"LT = Σ días = " + n(r.LT, 2) + " días", h:n(r.LT, 2), s:"Tiempo que demora una pieza en atravesar todo." },
          { t:"Valor agregado", e:"VA = 39 + 46 + 62 + 40 + 55 = " + r.VA + " s", h:r.VA + " s", s:"Solo 4 minutos de trabajo real." },
          { t:"PCE", e:"PCE = " + r.VA + " ÷ (" + n(r.LT, 2) + " × 27.600) = " + n(r.PCE * 100, 3) + " %", h:n(r.PCE * 100, 3) + " %", s:"Más del 99,9 % del tiempo la pieza está esperando." },
          { t:"Cuello", e:"Soldadura: 62 s > takt " + n(r.takt, 1) + " s", s:"No alcanza a seguir la demanda: hay que balancear (2 operarios no bastan)." }]; } },
    vars:[["Takt", "Tiempo disponible diario ÷ demanda diaria", "s", "—"], ["Iᵢ", "Inventario antes del proceso i", "unidades", "—"], ["dᵢ", "Días de inventario = Iᵢ ÷ demanda diaria", "días", "—"], ["LT", "Lead time = Σ dᵢ", "días", "—"], ["VA", "Σ tiempos de ciclo", "s", "—"], ["PCE", "VA ÷ LT", "%", "&lt; 1 % típico"]],
    sup:"<ul><li>Es una foto de un día: los inventarios cambian.</li><li>La ley de Little supone un sistema estable.</li><li>El tiempo de ciclo debe medirse en terreno, no tomarse del manual.</li></ul>",
    ex:{ t:"Demanda de 460 piezas por día, 27.600 s disponibles. Procesos con ciclos de 39, 46, 62, 40, 55 y 0 s, e inventarios previos de 4.600, 1.100, 1.600, 1.200, 1.800 y 2.700 piezas.",
      steps:[["Calculo el takt: 27.600 ÷ 460.", "Para compararlo con los ciclos.", "60 s.", "Soldadura (62 s) no alcanza a seguir la demanda."],
        ["Calculo los días de inventario de cada etapa.", "Para ver dónde espera la pieza.", "Corte 10 días, despacho 5,9, ensamble 3,9…", "Los 4.600 de materia prima son el mayor tiempo de espera."],
        ["Sumo el lead time.", "Tiempo total.", "28,3 días.", "Casi un mes desde que llega el acero hasta que sale la pieza."],
        ["Calculo el PCE.", "Mide la proporción de valor agregado.", "242 s ÷ 780.000 s = 0,031 %.", "La mejora está en los inventarios, no en acelerar las máquinas."]],
      r:"atacar los inventarios (empezando por los 10 días de materia prima) y el cuello de botella de soldadura. Bajar el inventario de corte a 1.000 piezas reduciría el lead time en casi 8 días." },
    real:"<p>El VSM es la herramienta de partida de casi todo programa lean (Toyota, manufactura, hospitales, bancos). En servicios se mapea el flujo de un trámite: por ejemplo, la aprobación de un crédito, donde el trabajo real son minutos y la espera, días.</p>",
    sim:"vsm",
    chk(){ const r = vsmCalc({ d:460, ic:4600 }); return [["LT", r.LT, 13000 / 460], ["PCE", r.PCE, 242 / (13000 / 460 * 27600)]]; },
    quiz:[["Con 2.000 piezas en inventario y una demanda de 400 por día, la pieza espera en promedio:", ["5 días", "0,2 días", "2.400 días", "800 días"], 0, "2.000 ÷ 400 = 5 días (ley de Little)."],
      ["En un VSM típico, el lead time se explica sobre todo por:", ["Tiempos de máquina", "Esperas en inventario", "Transporte", "Inspección"], 1, "Los segundos de proceso son mínimos frente a los días de espera."],
      ["Un PCE de 0,03 % significa que:", ["El proceso es eficiente", "La pieza pasa casi todo el tiempo esperando", "Las máquinas son lentas", "Hay muchos defectos"], 1, "Solo 0,03 % del tiempo se agrega valor."]],
    dec:"dónde reducir inventarios, qué proceso balancear y cómo diseñar el flujo futuro.",
    pre:["balanceo"], rel:["balanceo", "smed", "lean"] };

  CSIM.vsm = { h:W => 250, title:"Escalera del lead time: días de espera contra segundos de valor",
    goal:"por qué el lead time depende casi solo de los inventarios, y cuánto se gana al reducirlos.",
    params:[{ k:"d", l:"Demanda diaria", min:200, max:600, step:10, v:460, u:"u/día", help:"Cambia el takt y los días de inventario." }, { k:"ic", l:"Inventario antes de corte", min:200, max:6000, step:100, v:4600, u:"u", help:"Bájalo y mira cómo cae el lead time." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt); },
    draw(g, W, H, s, p, C){ const r = vsmCalc(p), bw = (W - 20) / r.P.length, by = 30, x0 = 10;
      r.P.forEach((x, i) => { const cx = x0 + i * bw + bw / 2, over = x[1] > r.takt; g.fillStyle = C.c2; g.globalAlpha = 0.85; const tri = 10 + Math.min(22, r.days[i] * 2.2); g.beginPath(); g.moveTo(cx - bw / 2 + 6, by + 46); g.lineTo(cx - bw / 2 + 6 + tri, by + 46); g.lineTo(cx - bw / 2 + 6 + tri / 2, by + 46 - tri * 0.9); g.closePath(); g.fill(); g.globalAlpha = 1;
        g.strokeStyle = over ? C.bad : C.ink; g.lineWidth = over ? 2.5 : 1.2; g.strokeRect(cx - bw * 0.2, by + 6, bw * 0.48, 40); SIMG.text(g, x[0].slice(0, 9), cx + bw * 0.04, by + 2, C.ink, C, "center", true); SIMG.text(g, x[1] + " s", cx + bw * 0.04, by + 30, C.ink, C, "center");
        const ly = H - 70, w = bw * s.t; g.strokeStyle = C.c1; g.lineWidth = 3; g.beginPath(); g.moveTo(x0 + i * bw, ly); g.lineTo(x0 + i * bw + w * 0.6, ly); g.stroke(); SIMG.text(g, n(r.days[i], 1) + " d", x0 + i * bw + bw * 0.3, ly - 6, C.ink, C, "center", true);
        g.strokeStyle = C.c3; g.beginPath(); g.moveTo(x0 + i * bw + bw * 0.6, ly + 26); g.lineTo(x0 + (i + 1) * bw, ly + 26); g.stroke(); SIMG.text(g, x[1] + " s", x0 + i * bw + bw * 0.8, ly + 42, C.ink, C, "center"); });
      SIMG.text(g, "Lead time " + n(r.LT, 1) + " días  ·  Valor agregado " + r.VA + " s", W - 6, H - 6, C.ink, C, "right", true); },
    metrics(s, p){ const r = vsmCalc(p); return [["Takt", n(r.takt, 1) + " s"], ["Lead time", n(r.LT, 2) + " días"], ["Valor agregado", r.VA + " s"], ["PCE", n(r.PCE * 100, 3) + " %"], ["Proceso sobre el takt", r.P.filter(x => x[1] > r.takt).map(x => x[0]).join(", ") || "ninguno"]]; },
    ann(s, p){ const r = vsmCalc(p), k = r.days.indexOf(Math.max(...r.days)); return "Los triángulos naranjos son inventarios. La línea azul de abajo son días de espera; la verde, segundos de trabajo. La mayor espera está antes de " + r.P[k][0] + "."; },
    concl(s, p){ const r = vsmCalc(p), base = vsmCalc({ d:p.d, ic:4600 }); return "<p>Lead time <b>" + n(r.LT, 1) + " días</b> para solo " + r.VA + " segundos de trabajo (PCE " + n(r.PCE * 100, 3) + " %)." + (p.ic < 4600 ? " Reducir el inventario de corte ahorra " + n(base.LT - r.LT, 1) + " días." : "") + "</p><p><b>Qué demuestra:</b> acelerar máquinas casi no cambia el lead time; reducir inventarios sí.</p><p><b>Qué decisión informa:</b> el diseño del estado futuro y las prioridades de mejora.</p>"; } };

  /* ===================== SECUENCIACIÓN ===================== */
  const JB = [["A", 6, 8], ["B", 2, 6], ["C", 8, 18], ["D", 3, 15], ["E", 9, 23], ["F", 4, 12]], RULES = ["FCFS", "SPT", "LPT", "EDD", "CR"];
  const seqRun = k => { let o = JB.slice(); if (k === 1) o.sort((a, b) => a[1] - b[1]); if (k === 2) o.sort((a, b) => b[1] - a[1]); if (k === 3) o.sort((a, b) => a[2] - b[2]); if (k === 4) o.sort((a, b) => a[2] / a[1] - b[2] / b[1]);
    let t = 0; const R = o.map(j => { t += j[1]; return { id:j[0], p:j[1], d:j[2], C:t, T:Math.max(0, t - j[2]) }; }); return { R, flow:mean(R.map(x => x.C)), tard:mean(R.map(x => x.T)), late:R.filter(x => x.T > 0).length, tmax:Math.max(...R.map(x => x.T)) }; };
  CRS.secuenciacion = {
    kw:"secuenciacion reglas de prioridad spt edd fcfs lpt razon critica tardanza tiempo de flujo programacion de trabajos una maquina",
    ess:{ pts:["Decide en qué <b>orden</b> procesar trabajos en una máquina o puesto.", "<b>SPT</b> (más corto primero) minimiza el tiempo de flujo promedio y el trabajo en proceso.", "<b>EDD</b> (fecha de entrega más próxima) minimiza la tardanza máxima.", "FCFS es justo pero rara vez el mejor."],
      fx:"Cⱼ = Σ p (hasta j);   Tardanzaⱼ = máx(0, Cⱼ − dⱼ);   Flujo = Σ Cⱼ ÷ n", when:"hay varios trabajos esperando un mismo recurso y quieres cumplir plazos o reducir esperas." },
    intro:{ prob:"<p>Un taller tiene 6 trabajos esperando la misma máquina, cada uno con su tiempo de proceso y su fecha de entrega. ¿En qué orden hacerlos para atrasarse lo menos posible?</p>",
      anal:"<p>En la fila del supermercado, si dejas pasar primero al que lleva un solo producto, el tiempo promedio de espera de todos baja. Eso es SPT. Si en cambio atiendes primero al que tiene que tomar el bus más pronto, eso es EDD.</p>",
      terms:[["pⱼ", "Tiempo de proceso del trabajo j."], ["dⱼ", "Fecha de entrega del trabajo j."], ["Cⱼ", "Momento en que termina el trabajo j."], ["Tiempo de flujo", "Cuánto pasa cada trabajo en el sistema (aquí, Cⱼ)."], ["Tardanza", "Atraso respecto de la fecha (0 si llega a tiempo)."], ["Razón crítica (CR)", "Tiempo hasta la entrega ÷ tiempo de proceso: menor = más urgente."]] },
    adv:"<p>Para minimizar el <b>número</b> de trabajos atrasados existe el algoritmo de Moore-Hodgson (parte de EDD y saca los trabajos que causan atrasos). Con varias máquinas en serie aparecen reglas como Johnson (2 máquinas) y heurísticas para más.</p>",
    sp:{ title:"Reglas de prioridad, paso a paso",
      params:[],
      script(){ const S = seqRun(1), E = seqRun(3), F = seqRun(0);
        return [
          { t:"Datos", e:JB.map(j => j[0] + ": p=" + j[1] + ", d=" + j[2]).join(";  "), s:"Tiempo de proceso y fecha de entrega (días)." },
          { t:"FCFS", e:"A → B → C → D → E → F:  flujo " + n(F.flow, 2) + ";  tardanza prom. " + n(F.tard, 2), s:"Orden de llegada." },
          { t:"SPT", e:"Orden: " + S.R.map(x => x.id).join(" → "), s:"Se ordena por tiempo de proceso, de menor a mayor." },
          { t:"SPT: términos", e:"C = " + S.R.map(x => x.C).join(", ") + "  →  flujo = " + n(S.flow, 2), h:n(S.flow, 2), s:"Cada término es la suma de los tiempos hasta ese trabajo." },
          { t:"EDD", e:"Orden: " + E.R.map(x => x.id).join(" → ") + ";  tardanzas " + E.R.map(x => x.T).join(", "), s:"Por fecha de entrega." },
          { t:"EDD: resultado", e:"Tardanza promedio = " + n(E.tard, 2) + ";  atrasados = " + E.late, h:n(E.tard, 2), s:"La menor tardanza de las reglas." },
          { t:"Elegir", e:"SPT: menor flujo (" + n(S.flow, 2) + ");  EDD: menor tardanza (" + n(E.tard, 2) + ")", s:"La mejor regla depende de qué importa más." }]; } },
    vars:[["pⱼ", "Tiempo de proceso", "días u horas", "—"], ["dⱼ", "Fecha de entrega", "día", "—"], ["Cⱼ", "Término del trabajo", "día", "—"], ["Tⱼ", "Tardanza", "días", "≥ 0"], ["CR", "(dⱼ − hoy) ÷ tiempo restante", "—", "&lt; 1 = atrasado"]],
    sup:"<ul><li>Una sola máquina, sin interrupciones.</li><li>Todos los trabajos disponibles desde el inicio.</li><li>Tiempos de proceso conocidos y sin tiempos de cambio dependientes del orden.</li></ul>",
    ex:{ t:"Seis trabajos: A (6 días, entrega día 8), B (2; 6), C (8; 18), D (3; 15), E (9; 23), F (4; 12).",
      steps:[["Aplico SPT: B, D, F, A, C, E.", "Minimiza el tiempo en el sistema.", "Flujo promedio 14,33 días; 3 atrasados.", "Los trabajos cortos salen rápido."],
        ["Aplico EDD: B, A, F, D, C, E.", "Minimiza la tardanza.", "Tardanza promedio 2,33; 2 atrasados.", "Mejor cumplimiento de fechas."],
        ["Comparo con FCFS.", "Referencia.", "Flujo 18,17; tardanza 5,17; 4 atrasados.", "El orden de llegada es el peor de los tres."]],
      r:"si importa cumplir fechas, usar EDD (tardanza promedio 2,33 días). Si importa despejar el taller y reducir inventario en proceso, SPT." },
    real:"<p>Imprentas, talleres de mantenimiento, laboratorios y servicios técnicos usan reglas de prioridad en sus tableros de órdenes. Los sistemas MES (de ejecución de manufactura) proponen la secuencia con estas reglas y el supervisor ajusta.</p>",
    sim:"seq",
    chk(){ return [["SPT flujo", seqRun(1).flow, 14.333333333333334], ["EDD tardanza", seqRun(3).tard, 2.3333333333333335]]; },
    quiz:[["La regla que minimiza el tiempo de flujo promedio en una máquina es:", ["FCFS", "SPT", "LPT", "CR"], 1, "Los trabajos cortos primero reducen la espera promedio de todos."],
      ["La regla que minimiza la tardanza máxima es:", ["SPT", "EDD", "LPT", "FCFS"], 1, "Ordenar por fecha de entrega."],
      ["Un trabajo con razón crítica 0,8 está:", ["Adelantado", "Atrasado: no alcanza a terminar a tiempo", "Justo a tiempo", "Terminado"], 1, "Le queda menos tiempo que el trabajo que falta."]],
    dec:"en qué orden atender trabajos según se priorice el cumplimiento de fechas o el flujo.",
    rel:["johnson", "cpm"] };

  CSIM.seq = { title:"Gantt de una máquina según la regla de prioridad",
    goal:"cómo cada regla ordena los trabajos y por qué SPT reduce el flujo mientras EDD reduce los atrasos.",
    params:[{ k:"r", l:"Regla", min:0, max:4, step:1, v:1, fmt:v => RULES[v], u:"", help:"0 FCFS · 1 SPT · 2 LPT · 3 EDD · 4 CR." }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0; }, tick(s, p, dt){ s.t += dt * 6; if (s.t > 40) s.t = 0; },
    draw(g, W, H, s, p, C){ const r = seqRun(p.r), x0 = 30, x1 = W - 10, X = v => x0 + v / 34 * (x1 - x0), rh = Math.min(40, (H - 60) / 6), top = 20;
      for (let d = 0; d <= 32; d += 4) SIMG.text(g, d, X(d), H - 12, C.muted, C, "center");
      let st = 0; r.R.forEach((j, i) => { const y = top + i * rh, done = Math.max(0, Math.min(j.C, s.t) - st); SIMG.text(g, j.id, 12, y + rh * 0.6, C.ink, C, "center", true);
        g.fillStyle = j.T > 0 ? C.bad : C.c1; g.globalAlpha = 0.25; g.fillRect(X(st), y + 4, X(j.C) - X(st), rh - 8); g.globalAlpha = 1; g.fillRect(X(st), y + 4, done / 34 * (x1 - x0), rh - 8);
        g.strokeStyle = C.ink; g.lineWidth = 2; g.beginPath(); g.moveTo(X(j.d), y + 2); g.lineTo(X(j.d), y + rh - 2); g.stroke(); st = j.C; });
      SIMG.text(g, "Raya negra = fecha de entrega · rojo = atrasado", W - 6, 12, C.muted, C, "right"); },
    metrics(s, p){ const r = seqRun(p.r); return [["Secuencia", r.R.map(x => x.id).join(" → ")], ["Flujo promedio", n(r.flow, 2)], ["Tardanza promedio", n(r.tard, 2)], ["Tardanza máxima", n(r.tmax)], ["Trabajos atrasados", n(r.late)]]; },
    ann(s, p){ return ["FCFS atiende en orden de llegada, sin mirar tiempos ni fechas.", "SPT pone primero los trabajos cortos: muchos terminan pronto.", "LPT pone primero los largos: todos esperan más (es la peor para el flujo).", "EDD sigue las fechas de entrega: menos atrasos.", "La razón crítica prioriza los trabajos con menos tiempo disponible respecto de lo que les falta."][p.r]; },
    concl(s, p){ const r = seqRun(p.r); return "<p>Con <b>" + RULES[p.r] + "</b>: flujo promedio " + n(r.flow, 2) + " días, tardanza promedio " + n(r.tard, 2) + " y " + r.late + " trabajos atrasados.</p><p><b>Qué demuestra:</b> el orden no cambia el trabajo total (32 días), pero sí cuánto esperan y cuántos se atrasan.</p><p><b>Qué decisión informa:</b> la regla de prioridad del taller según lo que más importe.</p>"; } };

  /* ===================== JOHNSON ===================== */
  const JO = [["A", 5, 2], ["B", 1, 6], ["C", 9, 7], ["D", 3, 8], ["E", 10, 4]];
  const johnson = () => { const L = JO.filter(j => j[1] <= j[2]).sort((a, b) => a[1] - b[1]), R = JO.filter(j => j[1] > j[2]).sort((a, b) => b[2] - a[2]); return L.concat(R); };
  const twoM = seq => { let t1 = 0, t2 = 0; return seq.map(j => { const s1 = t1, e1 = t1 + j[1]; t1 = e1; const s2 = Math.max(e1, t2), e2 = s2 + j[2]; t2 = e2; return { id:j[0], s1, e1, s2, e2 }; }); };
  CRS.johnson = {
    kw:"regla de johnson dos maquinas flow shop makespan secuencia optima tiempo total de terminacion",
    ess:{ pts:["Con <b>dos máquinas en serie</b> (todos pasan por M1 y luego por M2), la regla de Johnson da el orden que minimiza el tiempo total (makespan).", "Trabajos con tiempo menor en M1 van <b>al principio</b>, ordenados de menor a mayor tiempo en M1.", "Trabajos con tiempo menor en M2 van <b>al final</b>, ordenados de mayor a menor tiempo en M2.", "Así M2 empieza pronto y no queda ociosa al final."],
      fx:"Si mín(t₁, t₂) está en M1 → al inicio;  si está en M2 → al final", when:"hay exactamente dos etapas en el mismo orden para todos los trabajos." },
    intro:{ prob:"<p>Cinco trabajos deben pasar por corte (M1) y luego por pintura (M2). ¿En qué orden hacerlos para terminar todo lo antes posible?</p>",
      anal:"<p>Lavar y secar ropa: conviene empezar por la carga que se lava rápido (la secadora empieza pronto) y dejar al final la que se seca rápido (la secadora termina pronto).</p>",
      terms:[["Makespan", "Tiempo hasta que termina el último trabajo."], ["Ocio de M2", "Tiempo que M2 espera por trabajos de M1."], ["Flow shop", "Todos los trabajos siguen la misma secuencia de máquinas."]] },
    adv:"<p>La regla de Johnson es óptima para 2 máquinas. Para 3 máquinas funciona si la máquina del medio está dominada (sumando tiempos en pares); en general, con más máquinas se usan heurísticas (como NEH).</p>",
    sp:{ title:"Regla de Johnson, paso a paso",
      params:[],
      script(){ const seq = johnson(), G = twoM(seq);
        return [
          { t:"Datos", e:JO.map(j => j[0] + " (" + j[1] + "; " + j[2] + ")").join(";  "), s:"Tiempos en M1 y M2." },
          { t:"Mínimo global", e:"B: 1 en M1  →  primero", h:"primero", s:"El menor tiempo de todos está en M1: B va al inicio." },
          { t:"Siguiente", e:"A: 2 en M2  →  último", h:"último", s:"El menor está en M2: A va al final." },
          { t:"Siguiente", e:"D: 3 en M1  →  segundo;   E: 4 en M2  →  penúltimo", s:"Se repite con los que quedan." },
          { t:"Siguiente", e:"C: queda al medio", s:"Solo queda un lugar." },
          { t:"Secuencia", e:seq.map(j => j[0]).join(" → ") + "  →  makespan = " + G[G.length - 1].e2, h:"makespan = " + G[G.length - 1].e2, s:"Es el menor tiempo total posible." }]; } },
    vars:[["t₁ⱼ, t₂ⱼ", "Tiempo del trabajo j en M1 y M2", "horas", "—"], ["Makespan", "Término del último trabajo en M2", "horas", "—"], ["Ocio M2", "Tiempo en que M2 espera", "horas", "—"]],
    sup:"<ul><li>Dos máquinas, mismo orden para todos.</li><li>Sin tiempos de cambio dependientes de la secuencia.</li><li>Todos los trabajos disponibles al inicio.</li></ul>",
    ex:{ t:"Cinco trabajos con tiempos (M1; M2): A (5; 2), B (1; 6), C (9; 7), D (3; 8), E (10; 4).",
      steps:[["Ubico los trabajos según dónde está su menor tiempo.", "Es la regla de Johnson.", "B y D al inicio (menor en M1); A y E al final (menor en M2).", "M2 recibe trabajo pronto y termina pronto."],
        ["Armo la secuencia: B, D, C, E, A.", "Orden óptimo.", "Makespan 30 horas; M2 ociosa 3 horas.", "Es el mínimo posible con estas máquinas."]],
      r:"procesar en el orden B → D → C → E → A para terminar en 30 horas." },
    real:"<p>Se usa en talleres con dos etapas (corte y soldadura, mecanizado y tratamiento térmico, impresión y encuadernación). En imprentas, por ejemplo, ordena los trabajos entre impresión y terminación.</p>",
    sim:"jo",
    chk(){ const G = twoM(johnson()); return [["Makespan", G[G.length - 1].e2, 30]]; },
    quiz:[["En la regla de Johnson, un trabajo con tiempos (2; 9) va:", ["Al final", "Al principio", "Al medio", "Da lo mismo"], 1, "Su menor tiempo (2) está en M1."],
      ["Un trabajo con tiempos (8; 1) va:", ["Al principio", "Al final", "En segundo lugar", "Se descarta"], 1, "Su menor tiempo está en M2."],
      ["¿Qué minimiza la regla de Johnson?", ["La tardanza", "El makespan (tiempo total)", "El costo", "El número de trabajos"], 1, "Es óptima para el tiempo total con 2 máquinas."]],
    dec:"el orden de los trabajos en dos etapas para terminar lo antes posible.",
    rel:["secuenciacion"] };

  CSIM.jo = { title:"Dos máquinas: Johnson contra orden de llegada",
    goal:"por qué empezar con trabajos cortos en M1 y terminar con trabajos cortos en M2 reduce el tiempo total.",
    params:[{ k:"m", l:"Secuencia", min:0, max:1, step:1, v:1, fmt:v => v ? "Johnson" : "Orden de llegada", u:"", help:"0 = A, B, C, D, E; 1 = Johnson." }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0; }, tick(s, p, dt){ s.t += dt * 5; if (s.t > 42) s.t = 0; },
    draw(g, W, H, s, p, C){ const seq = p.m ? johnson() : JO, G = twoM(seq), x0 = 40, x1 = W - 10, X = v => x0 + v / 36 * (x1 - x0), cols = { A:C.c1, B:C.c2, C:C.c3, D:C.c4, E:C.c5 };
      [["M1", 40, "s1", "e1"], ["M2", 100, "s2", "e2"]].forEach(([m, y, a, b]) => { SIMG.text(g, m, 4, y + 20, C.ink, C, "left", true); g.strokeStyle = C.line; g.strokeRect(x0, y, x1 - x0, 34);
        G.forEach(j => { const done = Math.max(0, Math.min(j[b], s.t) - j[a]); g.fillStyle = cols[j.id]; g.globalAlpha = 0.3; g.fillRect(X(j[a]), y + 2, X(j[b]) - X(j[a]), 30); g.globalAlpha = 1; g.fillRect(X(j[a]), y + 2, done / 36 * (x1 - x0), 30); SIMG.text(g, j.id, (X(j[a]) + X(j[b])) / 2, y + 22, C.ink, C, "center", true); }); });
      for (let v = 0; v <= 36; v += 4) SIMG.text(g, v, X(v), 160, C.muted, C, "center"); const ms = G[G.length - 1].e2; g.strokeStyle = C.bad; g.lineWidth = 2; g.beginPath(); g.moveTo(X(ms), 30); g.lineTo(X(ms), 145); g.stroke(); SIMG.text(g, "Fin " + ms, X(ms) + 4, 28, C.ink, C, "left", true); },
    h:W => 190,
    metrics(s, p){ const G = twoM(p.m ? johnson() : JO), ms = G[G.length - 1].e2, busy2 = JO.reduce((a, j) => a + j[2], 0); return [["Secuencia", G.map(j => j.id).join(" → ")], ["Makespan", n(ms)], ["Ocio de M2", n(ms - busy2)]]; },
    ann(s, p){ return p.m ? "Con Johnson, M2 empieza casi de inmediato (B dura 1 en M1) y termina con A, que dura poco en M2." : "En orden de llegada, M2 queda esperando: los huecos en la fila de abajo son tiempo ocioso."; },
    concl(s, p){ const a = twoM(JO), b = twoM(johnson()); return "<p>Orden de llegada: <b>" + a[a.length - 1].e2 + "</b>; Johnson: <b>" + b[b.length - 1].e2 + "</b>.</p><p><b>Qué demuestra:</b> el orden cambia el tiempo total aunque el trabajo sea el mismo; la clave es no dejar ociosa la segunda máquina.</p><p><b>Qué decisión informa:</b> la secuencia de producción en dos etapas.</p>"; } };

  /* ===================== PRODUCTIVIDAD ===================== */
  const PI = [["Mano de obra", 28e6, 29.5e6], ["Materiales", 31e6, 35.2e6], ["Energía", 4.2e6, 4.1e6], ["Capital", 9e6, 9e6]];
  const prodCalc = p => { const q1 = 10500, q2 = p.q2, c2 = PI.map((x, i) => i === 1 ? p.m2 * 1e6 : x[2]), s1 = PI.reduce((a, x) => a + x[1], 0), s2 = c2.reduce((a, b) => a + b, 0), P1 = q1 * 8500 / s1, P2 = q2 * 8500 / s2;
    return { P1, P2, var:(P2 / P1 - 1) * 100, part:PI.map((x, i) => [x[0], q1 / (x[1] / 1e6), q2 / (c2[i] / 1e6)]) }; };
  CRS.productividad = {
    kw:"productividad parcial total multifactorial eficiencia insumos produccion mano de obra materiales variacion",
    ess:{ pts:["Productividad = lo que se produce ÷ lo que se usa para producirlo.", "<b>Parcial</b>: respecto de un solo insumo (por ejemplo, unidades por hora-hombre).", "<b>Total</b> (multifactorial): valor de la producción ÷ costo de todos los insumos.", "Se compara en el tiempo: la variación muestra si se mejora."],
      fx:"P parcial = Producción ÷ Insumo;   P total = Valor de la producción ÷ Σ insumos", when:"quieres medir si la empresa produce más con lo mismo (o lo mismo con menos)." },
    intro:{ prob:"<p>Una fábrica produjo 10.500 unidades en el período 1 y 11.800 en el período 2, pero también gastó más en mano de obra y materiales. ¿Mejoró realmente la productividad?</p>",
      anal:"<p>Si un estudiante sube su nota de 5,0 a 5,5 pero estudió el doble de horas, su «productividad» de estudio bajó. Lo que importa es el resultado en relación con el esfuerzo.</p>",
      terms:[["Productividad parcial", "Producción por unidad de un insumo."], ["Productividad total", "Valor producido por cada peso gastado en todos los insumos."], ["Insumo", "Recurso usado: mano de obra, materiales, energía, capital."], ["Variación", "(P₂ − P₁) ÷ P₁."]] },
    adv:"<p>La productividad parcial puede engañar: automatizar sube la productividad de la mano de obra pero puede bajar la del capital. La total integra todo. Para comparar períodos con precios distintos se usan precios constantes (de un año base).</p>",
    sp:{ title:"Productividad parcial y total, paso a paso",
      params:[{ k:"q2", l:"Producción período 2", v:11800, u:"u" }, { k:"m2", l:"Materiales período 2", v:35.2, u:"millones $" }],
      script(p){ const r = prodCalc(p);
        return [
          { t:"Parcial: mano de obra", e:"P1 = 10.500 ÷ 28 = " + n(r.part[0][1], 1) + " u por millón;  P2 = " + n(p.q2) + " ÷ 29,5 = " + n(r.part[0][2], 1), h:n(r.part[0][2], 1), s:"Unidades por cada millón gastado en mano de obra." },
          { t:"Parcial: materiales", e:"P1 = " + n(r.part[1][1], 1) + ";  P2 = " + n(r.part[1][2], 1), s:"Si baja, se está usando más material por unidad (merma)." },
          { t:"Total P1", e:"P1 = 10.500 × 8.500 ÷ 72.200.000 = " + n(r.P1, 3), h:n(r.P1, 3), s:"Cada peso gastado generó " + n(r.P1, 3) + " pesos de producción." },
          { t:"Total P2", e:"P2 = " + n(p.q2) + " × 8.500 ÷ Σ insumos = " + n(r.P2, 3), h:n(r.P2, 3), s:"Mismo cálculo en el período 2." },
          { t:"Variación", e:"(" + n(r.P2, 3) + " ÷ " + n(r.P1, 3) + " − 1) × 100 = " + n(r.var, 1) + " %", h:n(r.var, 1) + " %", s:r.var > 0 ? "La productividad total mejoró." : "La productividad total empeoró." }]; } },
    vars:[["Producción", "Unidades o valor producido", "u o $", "—"], ["Insumo", "Recurso usado", "h, kg, $", "—"], ["P", "Productividad", "u por insumo o $/$", "—"], ["ΔP", "Variación porcentual", "%", "—"]],
    sup:"<ul><li>Producción y costos del mismo período y alcance.</li><li>Precios comparables entre períodos (si hay inflación, usar precios constantes).</li></ul>",
    ex:{ t:"Período 1: 10.500 unidades; período 2: 11.800. Precio $ 8.500. Insumos (millones): mano de obra 28 → 29,5; materiales 31 → 35,2; energía 4,2 → 4,1; capital 9 → 9.",
      steps:[["Calculo productividades parciales.", "Para ver cada insumo.", "Mano de obra +6,7 %; materiales −1,0 %; energía +15,1 %; capital +12,4 %.", "Los materiales empeoran: posible merma."],
        ["Calculo la total.", "Visión integrada.", "1,236 → 1,289.", "Cada peso de insumo genera más producción."],
        ["Calculo la variación.", "Para reportar.", "+4,3 %.", "Mejora real, pero hay que revisar el uso de materiales."]],
      r:"la productividad total subió 4,3 %, aunque la de materiales bajó 1 %: conviene investigar mermas." },
    real:"<p>La Comisión Nacional de Evaluación y Productividad (CNEP) mide la productividad de la economía chilena; en las empresas se usa en tableros mensuales por planta. En minería se sigue la productividad por trabajador y por tonelada movida.</p>",
    sim:"pr",
    chk(){ const r = prodCalc({ q2:11800, m2:35.2 }); return [["P1", r.P1, 10500 * 8500 / 72.2e6], ["Var", r.var, (11800 * 8500 / 77.8e6 / (10500 * 8500 / 72.2e6) - 1) * 100]]; },
    quiz:[["Se producen 1.200 unidades con 300 horas-hombre. La productividad de la mano de obra es:", ["4 u/h", "0,25 u/h", "1.500", "900"], 0, "1.200 ÷ 300 = 4 unidades por hora."],
      ["La productividad de la mano de obra subió, pero la total bajó. ¿Qué puede estar pasando?", ["Es imposible", "Se gastó mucho más en otros insumos (capital, materiales)", "La producción bajó", "El precio subió"], 1, "La parcial no ve los demás insumos."],
      ["Para comparar productividad total entre años con inflación se usan:", ["Precios corrientes", "Precios constantes", "Solo unidades", "Solo costos"], 1, "Así se compara cantidad, no precios."]],
    dec:"si los cambios en la operación realmente mejoran el uso de los recursos y dónde actuar.",
    rel:["oee", "tiempo-estandar"] };

  CSIM.pr = { title:"Productividad parcial por insumo y total",
    goal:"cómo una productividad parcial puede subir mientras otra baja, y cómo la total resume todo.",
    params:[{ k:"q2", l:"Producción del período 2", min:9000, max:14000, step:100, v:11800, u:"u", help:"Más producción con los mismos insumos sube todas las productividades." }, { k:"m2", l:"Materiales del período 2", min:28, max:42, step:0.2, v:35.2, u:"MM$", help:"Más gasto en materiales baja su productividad." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt); },
    draw(g, W, H, s, p, C){ const r = prodCalc(p), x0 = 110, x1 = W - 60, bh = (H - 60) / 4, top = 16;
      r.part.forEach(([nm, a, b], i) => { const y = top + i * bh, mx = Math.max(a, b) * 1.15, X = v => x0 + v / mx * (x1 - x0), v = (b / a - 1) * 100; SIMG.text(g, nm, 4, y + bh * 0.45, C.ink, C, "left", true);
        g.fillStyle = C.muted; g.fillRect(x0, y + 4, (X(a) - x0) * s.t, bh * 0.3); g.fillStyle = v >= 0 ? C.c3 : C.bad; g.fillRect(x0, y + 6 + bh * 0.3, (X(b) - x0) * s.t, bh * 0.3); SIMG.text(g, (v >= 0 ? "+" : "") + n(v, 1) + " %", X(Math.max(a, b)) + 6, y + bh * 0.45, C.ink, C, "left", true); });
      SIMG.text(g, "Gris = período 1; color = período 2 (verde mejora, rojo empeora)", 4, H - 26, C.muted, C, "left"); SIMG.text(g, "Total: " + n(r.P1, 3) + " → " + n(r.P2, 3) + " (" + (r.var >= 0 ? "+" : "") + n(r.var, 1) + " %)", 4, H - 8, C.ink, C, "left", true); },
    metrics(s, p){ const r = prodCalc(p); return [["Productividad total P1", n(r.P1, 3)], ["Productividad total P2", n(r.P2, 3)], ["Variación", n(r.var, 1) + " %"]].concat(r.part.map(x => [x[0] + " (u/MM$)", n(x[1], 1) + " → " + n(x[2], 1)])); },
    ann(s, p){ const r = prodCalc(p); return r.part[1][2] < r.part[1][1] ? "Los materiales rinden menos que antes: se usa más material por unidad (merma o desperdicio)." : "Todas las productividades parciales mejoran o se mantienen."; },
    concl(s, p){ const r = prodCalc(p); return "<p>La productividad total pasa de " + n(r.P1, 3) + " a " + n(r.P2, 3) + " (<b>" + (r.var >= 0 ? "+" : "") + n(r.var, 1) + " %</b>).</p><p><b>Qué demuestra:</b> las productividades parciales pueden moverse en sentidos opuestos; la total dice si el conjunto mejora.</p><p><b>Qué decisión informa:</b> qué insumo revisar primero.</p>"; } };
})();
