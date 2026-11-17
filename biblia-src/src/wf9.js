/* ============ CURSO · Módulo Estudio del trabajo y ergonomía ============
   Referencias (calculadoras): TO 25,375 s; TN 26,644 s; TE 30,374 s; 118,5 u/h. Muestreo: n = 630; p = 16,77 %; e = ± 2,94 %; TE 3,314 min.
   Aprendizaje 85 %: T₆₄ = 45,26 min; total 3.711,8 min. NIOSH: LPR 8,76 kg; IL 2,06. Ruido: dosis 251 %; NPSeq 89,0 dB(A). */
(function(){
  const n = crsNum, zr = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const bar = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, Math.min(y, y + h), w, Math.abs(h)); };

  /* ===================== TIEMPO ESTÁNDAR ===================== */
  const LT = [25.2, 24.8, 26.1, 25.5, 24.9, 25.7, 26.3, 25.0, 24.6, 25.4, 25.9, 25.1];
  const te = (L, v, s) => { const TO = L.reduce((a, b) => a + b, 0) / L.length, TN = TO * v, TE = TN * (1 + s); return { TO, TN, TE }; };
  const nnec = L => { const N = L.length, S = L.reduce((a, b) => a + b, 0), S2 = L.reduce((a, b) => a + b * b, 0); return Math.pow(40 * Math.sqrt(N * S2 - S * S) / S, 2); };
  CRS["tiempo-estandar"] = {
    kw:"tiempo estandar estudio de tiempos cronometraje valoracion del ritmo suplementos tolerancias tiempo normal tiempo observado",
    ess:{ pts:["El <b>tiempo estándar</b> es lo que tarda un operario calificado, a ritmo normal, incluyendo descansos y necesidades.", "Se cronometra el ciclo varias veces: el promedio es el <b>tiempo observado</b> (TO).", "Se corrige por el ritmo del operario (<b>valoración</b>) → tiempo normal (TN).", "Se agregan <b>suplementos</b> (fatiga, necesidades personales, demoras) → TE."],
      fx:"TO = Σx ÷ n;   TN = TO · valoración;   TE = TN · (1 + suplementos)", when:"necesitas fijar metas de producción, costear mano de obra, balancear líneas o pagar incentivos." },
    intro:{ prob:"<p>Se cronometró 12 veces el armado de una pieza (entre 24,6 y 26,3 s). El operario trabaja algo más rápido que lo normal (105 %) y los suplementos son 14 %. ¿Cuál es el tiempo estándar y cuántas piezas por jornada se pueden exigir?</p>",
      anal:"<p>Si mides cuánto tardas en ir a la universidad un día que corriste, no puedes usar ese tiempo para todos los días. Hay que ajustarlo a un ritmo «normal» y agregar un margen para imprevistos.</p>",
      terms:[["Ciclo", "Conjunto de elementos que se repite por cada unidad."], ["TO", "Tiempo observado: promedio de las lecturas."], ["Valoración", "Ritmo del operario vs ritmo normal (100 %)."], ["TN", "Tiempo normal."], ["Suplementos", "Margen por fatiga, necesidades y demoras inevitables (típico 10 a 20 %)."], ["TE", "Tiempo estándar."], ["n'", "Número de lecturas necesarias para la precisión deseada."]] },
    adv:"<p><b>Número de lecturas:</b> n' = [40 √(nΣx² − (Σx)²) ÷ Σx]² para 95 % de confianza y ± 5 %. Si n' &gt; n, hay que tomar más lecturas. <b>Datos predeterminados (MTM, MOST):</b> tiempos tabulados por movimiento básico, sin cronometrar.</p>",
    sp:{ title:"Del cronómetro al tiempo estándar", params:[{ k:"v", l:"Valoración", v:105, u:"%" }, { k:"s", l:"Suplementos", v:14, u:"%" }],
      script(p){ const r = te(LT, p.v / 100, p.s / 100);
        return [
          { t:"Lecturas", e:"12 lecturas: 25,2; 24,8; 26,1; … ; 25,1 s;  Σx = 304,5", s:"Se cronometra el mismo ciclo varias veces." },
          { t:"¿Bastan?", e:"n' = [40 · √(12 · 7.729,87 − 304,5²) ÷ 304,5]² = " + n(nnec(LT), 2), s:"Se necesita 1 lectura; tenemos 12: suficiente." },
          { t:"TO", e:"TO = 304,5 ÷ 12 = " + n(r.TO, 3) + " s", h:n(r.TO, 3) + " s", s:"Tiempo promedio observado." },
          { t:"TN", e:"TN = " + n(r.TO, 3) + " · " + n(p.v / 100, 2) + " = " + n(r.TN, 3) + " s", h:n(r.TN, 3) + " s", s:p.v > 100 ? "El operario es más rápido que lo normal: el tiempo normal es mayor que el observado." : "Ajuste al ritmo normal." },
          { t:"TE", e:"TE = " + n(r.TN, 3) + " · " + n(1 + p.s / 100, 2) + " = " + n(r.TE, 3) + " s", h:n(r.TE, 3) + " s", s:"Incluye descansos y demoras." },
          { t:"Producción", e:"3.600 ÷ " + n(r.TE, 3) + " = " + n(3600 / r.TE, 1) + " u/h  →  " + n(Math.floor(480 * 60 / r.TE)) + " por jornada", h:n(Math.floor(480 * 60 / r.TE)), s:"Meta justa para 8 horas." }]; } },
    vars:[["x", "Lectura de cronómetro", "s", "—"], ["n", "Número de lecturas", "—", "≥ n'"], ["TO", "Tiempo observado", "s", "—"], ["V", "Valoración del ritmo", "%", "80 a 120 %"], ["TN", "Tiempo normal", "s", "—"], ["S", "Suplementos", "%", "10 a 20 %"], ["TE", "Tiempo estándar", "s", "—"]],
    sup:"<ul><li>Método de trabajo estandarizado antes de medir.</li><li>Operario calificado y entrenado.</li><li>Valoración hecha por un analista con experiencia.</li></ul>",
    ex:{ t:"12 lecturas del armado (Σ = 304,5 s); valoración 105 %; suplementos 14 %; jornada 480 min.",
      steps:[["Verifico el número de lecturas.", "Precisión.", "n' = 0,66 → 1.", "12 lecturas bastan."], ["Promedio.", "TO.", "25,375 s.", ""], ["Ajusto ritmo.", "TN.", "26,644 s.", ""], ["Agrego suplementos.", "TE.", "30,374 s.", "118,5 u/h; 948 por jornada."]],
      r:"tiempo estándar 30,37 s por pieza: meta de 948 piezas por jornada de 8 horas." },
    real:"<p>Base de los incentivos por producción, del costeo de mano de obra y del balanceo de líneas. Un estándar mal hecho genera conflictos laborales: debe ser transparente y medido con método.</p>",
    sim:"crono",
    chk(){ const r = te(LT, 1.05, 0.14); return [["TO", r.TO, 304.5 / 12], ["TE", r.TE, 304.5 / 12 * 1.05 * 1.14], ["n'", nnec(LT), (() => { const m = 304.5 / 12, v = LT.reduce((q, x) => q + (x - m) ** 2, 0) / 11; return Math.pow(40 * Math.sqrt(12 * 11 * v) / 304.5, 2); })()]]; },
    quiz:[["Un operario trabaja al 90 % del ritmo normal y su TO es 20 s. El TN es:", ["22,2 s", "18 s", "20 s", "90 s"], 1, "TN = 20 × 0,90 = 18 s."], ["Los suplementos se agregan para:", ["Castigar a los lentos", "Considerar fatiga, necesidades y demoras", "Bajar la meta", "Medir la calidad"], 1, "Una persona no trabaja 8 horas sin pausa."], ["Si las lecturas varían mucho, el número de lecturas necesarias:", ["Baja", "Sube", "No cambia", "Es cero"], 1, "Más variación, más datos para la misma precisión."]],
    dec:"metas de producción, costos de mano de obra y dotación.",
    rel:["muestreo", "balanceo", "aprendizaje", "productividad"] };

  CSIM.crono = { title:"Cronometraje: lecturas, promedio y tiempo estándar",
    goal:"cómo las lecturas se estabilizan en un promedio y cómo la valoración y los suplementos lo convierten en tiempo estándar.",
    params:[{ k:"v", l:"Valoración del ritmo", min:80, max:120, step:5, v:105, u:"%", help:"100 % = ritmo normal." }, { k:"s", l:"Suplementos", min:5, max:30, step:1, v:14, u:"%", help:"" }, { k:"sd", l:"Variabilidad del operario", min:0.2, max:3, step:0.1, v:0.5, u:"s", help:"Desviación de las lecturas." }],
    init(){ return { L:[], acc:0 }; }, onParam(s, p, k){ if (k === "sd") { s.L = []; } },
    tick(s, p, dt){ s.acc += dt * 4; while (s.acc >= 1 && s.L.length < 60) { s.acc -= 1; s.L.push(25.375 + p.sd * zr()); } },
    draw(g, W, H, s, p, C){ const x0 = 44, xm = Math.max(x0 + 120, W * 0.62), x1 = W - 14, y0 = H - 30, top = 36, Y = v => y0 - (v - 15) / 30 * (y0 - top), X = i => x0 + (i + 0.5) / Math.max(20, s.L.length) * (xm - x0 - 10);
      SIMG.axes(g, x0, y0, xm - 10, top, C, "", "Lectura (s)"); [20, 30, 40].forEach(v => SIMG.text(g, v, x0 - 4, Y(v) + 4, C.muted, C, "right")); SIMG.text(g, "lecturas", xm - 10, y0 + 14, C.muted, C, "right");
      s.L.forEach((v, i) => { g.fillStyle = C.c1; g.beginPath(); g.arc(X(i), Y(v), 3, 0, 7); g.fill(); });
      if (s.L.length) { const r = te(s.L, p.v / 100, p.s / 100); SIMG.hline(g, x0, xm - 10, Y(r.TO), C.ink, [4, 3], "", C);
        const bw = Math.min(46, (x1 - xm) / 3 - 8); [["TO", r.TO, C.c1], ["TN", r.TN, C.c3], ["TE", r.TE, C.c2]].forEach(([l, v, c], k) => { const x = xm + 6 + k * (bw + 8); bar(g, x, y0, bw, Y(v) - y0, c); SIMG.text(g, n(v, 1), x + bw / 2, Y(v) - 4, C.ink, C, "center", true); SIMG.text(g, l, x + bw / 2, y0 + 14, C.muted, C, "center", true); }); } },
    metrics(s, p){ if (!s.L.length) return [["Lecturas", "0"]]; const r = te(s.L, p.v / 100, p.s / 100); return [["Lecturas", n(s.L.length)], ["Necesarias (95 %, ± 5 %)", n(Math.ceil(nnec(s.L)))], ["TO", n(r.TO, 2) + " s"], ["TE", n(r.TE, 2) + " s"], ["Piezas por jornada", n(Math.floor(28800 / r.TE))]]; },
    ann(s, p){ const N = s.L.length ? Math.ceil(nnec(s.L)) : 0; return N > s.L.length ? "Faltan lecturas: con esta variabilidad se necesitan " + N + " para 95 % de confianza y ± 5 %." : "Los puntos son lecturas; la línea punteada es su promedio (TO). A la derecha: TO → TN (ritmo) → TE (suplementos)."; },
    concl(s, p){ return "<p>Con valoración " + p.v + " % y suplementos " + p.s + " %, el TE es " + (s.L.length ? n(te(s.L, p.v / 100, p.s / 100).TE, 2) : "—") + " s.</p><p><b>Qué demuestra:</b> un operario más variable obliga a tomar más lecturas; la valoración corrige que el operario observado no sea «normal».</p><p><b>Qué decisión informa:</b> meta diaria y dotación necesaria.</p>"; } };

  /* ===================== MUESTREO DEL TRABAJO ===================== */
  CRS.muestreo = {
    kw:"muestreo del trabajo observaciones instantaneas proporcion de tiempo inactivo actividad utilizacion tamaño de muestra",
    ess:{ pts:["En vez de cronometrar todo, se hacen <b>observaciones al azar</b>: ¿qué está haciendo el trabajador (o la máquina) en este instante?", "La proporción de observaciones en una actividad estima el % del tiempo dedicado a ella.", "Tamaño: n = z²·p(1 − p) ÷ e² (como una encuesta).", "Sirve para medir tiempos inactivos, utilización de equipos y tareas largas o variadas."],
      fx:"n = z² · p(1 − p) ÷ e²;   p̂ = observaciones de la actividad ÷ n;   e = z · √(p̂(1 − p̂) ÷ n)", when:"quieres saber qué porcentaje del tiempo se usa en cada actividad sin cronometrar todo el día." },
    intro:{ prob:"<p>Un estudio piloto indica que los operarios están inactivos el 18 % del tiempo. ¿Cuántas observaciones se necesitan para estimar ese porcentaje con ± 3 puntos y 95 % de confianza?</p>",
      anal:"<p>Si quieres saber cuánto tiempo pasa tu perro durmiendo, no necesitas mirarlo todo el día: basta mirarlo en momentos al azar y anotar si duerme. Con suficientes miradas, la proporción se acerca a la real.</p>",
      terms:[["Observación", "Registro instantáneo de lo que ocurre en un momento al azar."], ["p", "Proporción del tiempo en la actividad."], ["e", "Error absoluto aceptado (puntos porcentuales)."], ["z", "1,96 para 95 %."], ["Utilización", "1 − proporción inactiva."]] },
    adv:"<p>Los momentos de observación deben ser <b>aleatorios</b> (tabla de números aleatorios o app), para no coincidir con ciclos del trabajo. Combinado con la producción del período y la valoración, entrega un tiempo estándar.</p>",
    sp:{ title:"Tamaño y resultado del muestreo", params:[{ k:"p", l:"Proporción piloto", v:18, u:"%" }, { k:"e", l:"Error aceptado", v:3, u:"puntos %" }],
      script(q){ const p = q.p / 100, e = q.e / 100, N = 1.96 * 1.96 * p * (1 - p) / (e * e), ph = 104 / 620, ee = 1.96 * Math.sqrt(ph * (1 - ph) / 620), T = 4800 * (1 - ph) / 1350 * 1.12;
        return [
          { t:"Tamaño", e:"n = 1,96² · " + n(p, 2) + " · " + n(1 - p, 2) + " ÷ " + n(e, 3) + "² = " + n(N, 1), h:n(Math.ceil(N)), s:"Observaciones necesarias." },
          { t:"Resultado", e:"Inactivo en 104 de 620 observaciones: p̂ = " + n(ph * 100, 2) + " %", h:n(ph * 100, 2) + " %", s:"" },
          { t:"Precisión", e:"e = 1,96 · √(" + n(ph, 3) + " · " + n(1 - ph, 3) + " ÷ 620) = ± " + n(ee * 100, 2) + " %", s:"Se logró la precisión pedida (menos de 3 puntos)." },
          { t:"Tiempo estándar", e:"TE = 4.800 min · " + n(1 - ph, 3) + " ÷ 1.350 u · 1,12 = " + n(T, 3) + " min/u", h:n(T, 3) + " min", s:"Tiempo productivo por unidad, con suplementos." }]; } },
    vars:[["n", "Número de observaciones", "—", "—"], ["p", "Proporción de la actividad", "%", "—"], ["e", "Error absoluto", "puntos %", "1 a 5"], ["z", "Valor normal", "—", "1,96 (95 %)"], ["T", "Tiempo total del estudio", "min", "—"], ["S", "Suplementos", "%", "—"]],
    sup:"<ul><li>Observaciones aleatorias e independientes.</li><li>El período estudiado es representativo.</li></ul>",
    ex:{ t:"Piloto 18 % inactivo; error ± 3 %; 95 %. Estudio: 620 observaciones, 104 inactivas; 4.800 min; 1.350 unidades; suplementos 12 %.",
      steps:[["Calculo n.", "Precisión pedida.", "630 observaciones.", ""], ["Calculo p̂.", "Resultado.", "16,77 % inactivo.", "Utilización 83 %."], ["Verifico precisión.", "¿Alcanza?", "± 2,94 %.", "Sí."], ["Tiempo estándar.", "Tiempo productivo por unidad.", "3,314 min/u.", ""]],
      r:"los operarios están inactivos el 16,8 % del tiempo (± 2,9 %); el tiempo estándar resulta 3,31 min por unidad." },
    real:"<p>Se usa en bodegas, mantención, hospitales y oficinas, donde el trabajo no es repetitivo. Hoy se apoya en sensores y cámaras (con resguardo de privacidad).</p>",
    sim:"wsam",
    chk(){ const ph = 104 / 620; return [["n", 1.96 * 1.96 * 0.18 * 0.82 / 0.0009, Math.pow(1.96 / 0.03, 2) * 0.1476], ["TE", 4800 * (1 - ph) / 1350 * 1.12, 4800 * 516 / 620 / 1350 * 1.12]]; },
    quiz:[["Para reducir el error a la mitad, las observaciones:", ["Se duplican", "Se cuadruplican", "Bajan", "No cambian"], 1, "El error está al cuadrado."], ["Las observaciones deben hacerse:", ["Siempre a la misma hora", "En momentos aleatorios", "Solo al inicio del turno", "Cuando el supervisor quiera"], 1, "Para evitar sesgos con ciclos del trabajo."], ["Si en 400 observaciones una máquina estuvo detenida 60 veces, su utilización estimada es:", ["15 %", "85 %", "60 %", "40 %"], 1, "1 − 60/400 = 85 %."]],
    dec:"cuánto tiempo se pierde y en qué, y tiempos estándar para trabajos no repetitivos.",
    pre:["tiempo-estandar"], rel:["tiempo-estandar", "muestra", "oee"] };

  CSIM.wsam = { title:"Observaciones al azar de un turno",
    goal:"cómo observaciones instantáneas al azar estiman el porcentaje de tiempo inactivo, y cómo se estrecha el error.",
    params:[{ k:"p", l:"Inactividad real (desconocida)", min:5, max:40, step:1, v:17, u:"%", help:"" }, { k:"e", l:"Error aceptado", min:1, max:6, step:0.5, v:3, u:"puntos %", help:"Define cuántas observaciones planificar." }],
    init(p){ const B = []; let t = 0, idle = false; while (t < 480) { const d = idle ? 2 + Math.random() * 10 : 5 + Math.random() * 40; B.push([t, Math.min(480, t + d), idle]); t += d; idle = !idle; } return { B, O:[], acc:0 }; },
    onParam(s, p){ Object.assign(s, this.init(p)); },
    tick(s, p, dt){ const nn = Math.ceil(1.96 * 1.96 * 0.18 * 0.82 / Math.pow(p.e / 100, 2)); s.acc += dt * 25; while (s.acc >= 1 && s.O.length < nn) { s.acc -= 1; const t = Math.random() * 480; s.O.push([t, Math.random() < p.p / 100]); } },
    draw(g, W, H, s, p, C){ const x0 = 20, x1 = W - 14, X = t => x0 + t / 480 * (x1 - x0), yb = 40, hb = 26;
      SIMG.text(g, "Turno de 8 h · cada punto es una observación al azar", x0, 18, C.muted, C, "left");
      s.O.forEach(([t, id], i) => { const y = yb + hb + 12 + (i % 30) * ((H - 140) / 30); g.fillStyle = id ? C.bad : C.c1; g.beginPath(); g.arc(X(t), y, 2.4, 0, 7); g.fill(); });
      g.fillStyle = C.c1; g.globalAlpha = 0.25; g.fillRect(x0, yb, x1 - x0, hb); g.globalAlpha = 1; SIMG.text(g, "trabajando (azul) · inactivo (rojo)", x0 + 6, yb + 17, C.ink, C, "left", true);
      const N = s.O.length; if (N > 1) { const k = s.O.filter(o => o[1]).length, ph = k / N, e = 1.96 * Math.sqrt(ph * (1 - ph) / N), yy = H - 40, Xp = v => x0 + v / 0.5 * (x1 - x0);
        g.strokeStyle = C.line; g.beginPath(); g.moveTo(x0, yy); g.lineTo(x1, yy); g.stroke(); g.fillStyle = C.c2; g.globalAlpha = 0.3; g.fillRect(Xp(Math.max(0, ph - e)), yy - 10, Xp(ph + e) - Xp(Math.max(0, ph - e)), 20); g.globalAlpha = 1;
        g.fillStyle = C.c2; g.beginPath(); g.arc(Xp(ph), yy, 5, 0, 7); g.fill(); g.strokeStyle = C.ink; g.lineWidth = 2; g.beginPath(); g.moveTo(Xp(p.p / 100), yy - 14); g.lineTo(Xp(p.p / 100), yy + 14); g.stroke();
        [0, 0.1, 0.2, 0.3, 0.4].forEach(v => SIMG.text(g, n(v * 100) + " %", Xp(v), yy + 28, C.muted, C, "center")); } },
    metrics(s, p){ const N = s.O.length, k = s.O.filter(o => o[1]).length, ph = N ? k / N : 0; return [["Planificadas", n(Math.ceil(1.96 * 1.96 * 0.18 * 0.82 / Math.pow(p.e / 100, 2)))], ["Realizadas", n(N)], ["Inactivo estimado", N ? n(ph * 100, 1) + " %" : "—"], ["Error actual", N > 1 ? "± " + n(1.96 * Math.sqrt(ph * (1 - ph) / N) * 100, 2) + " %" : "—"]]; },
    ann(s){ return "Abajo: el punto naranja es la estimación y la banda su error; la raya negra es el valor real. Con más observaciones, la banda se angosta."; },
    concl(s, p){ return "<p>Con " + n(s.O.length) + " observaciones la estimación está a pocos puntos del valor real (" + p.p + " %).</p><p><b>Qué demuestra:</b> no hace falta mirar todo el tiempo; basta con suficientes miradas al azar.</p><p><b>Qué decisión informa:</b> cuánto tiempo se pierde y dónde actuar.</p>"; } };

  /* ===================== CURVA DE APRENDIZAJE ===================== */
  const Tn = (T1, r, k) => T1 * Math.pow(k, Math.log(r) / Math.log(2));
  CRS.aprendizaje = {
    kw:"curva de aprendizaje experiencia tasa de aprendizaje 80 85 90 por ciento tiempo de la unidad n exponente wright",
    ess:{ pts:["Cada vez que la producción acumulada se <b>duplica</b>, el tiempo por unidad baja a un porcentaje fijo (la tasa de aprendizaje).", "Con 85 %: la unidad 2 toma 85 % de la 1; la 4, 85 % de la 2; y así.", "Tₙ = T₁ · nᵇ, con b = log(r) ÷ log(2).", "Sirve para cotizar pedidos, planificar capacidad y estimar costos de productos nuevos."],
      fx:"Tₙ = T₁ · nᵇ;   b = log(r) ÷ log 2", when:"produces algo nuevo o en lotes pequeños, donde los operarios mejoran con la práctica." },
    intro:{ prob:"<p>La primera unidad de un tablero eléctrico tomó 120 minutos. Con una tasa de aprendizaje de 85 %, ¿cuánto tomará la unidad 64? ¿Y las 64 en total?</p>",
      anal:"<p>La primera vez que armas un mueble de caja toma una tarde; la quinta vez, una hora. No porque el mueble cambie, sino porque ya sabes dónde va cada pieza.</p>",
      terms:[["T₁", "Tiempo de la primera unidad."], ["r", "Tasa de aprendizaje (por ejemplo 0,85)."], ["b", "Exponente de aprendizaje (negativo)."], ["Tₙ", "Tiempo de la unidad n."], ["Tiempo acumulado", "Suma de los tiempos de las unidades 1 a n."]] },
    adv:"<p><b>Tasas típicas:</b> ensamble manual 75 a 85 %; trabajo mixto 85 a 90 %; procesos automatizados 90 a 95 % (aprenden menos). La curva se aplana: después de muchas unidades, la mejora es casi imperceptible.</p>",
    sp:{ title:"Tiempo de la unidad n", params:[{ k:"T1", l:"Primera unidad", v:120, u:"min" }, { k:"r", l:"Tasa de aprendizaje", v:85, u:"%" }, { k:"N", l:"Unidad", v:64, u:"" }],
      script(p){ const r = p.r / 100, b = Math.log(r) / Math.log(2); let S = 0; for (let k = 1; k <= p.N; k++) S += Tn(p.T1, r, k);
        return [
          { t:"Exponente", e:"b = log(" + n(r, 2) + ") ÷ log(2) = " + n(b, 4), h:n(b, 4), s:"Negativo: el tiempo baja." },
          { t:"Duplicando", e:"T₂ = " + n(Tn(p.T1, r, 2), 1) + ";  T₄ = " + n(Tn(p.T1, r, 4), 1) + ";  T₈ = " + n(Tn(p.T1, r, 8), 1) + " min", s:"Cada duplicación multiplica por " + n(r, 2) + "." },
          { t:"Unidad n", e:"T" + p.N + " = " + p.T1 + " · " + p.N + "^" + n(b, 4) + " = " + n(Tn(p.T1, r, p.N), 2) + " min", h:n(Tn(p.T1, r, p.N), 2) + " min", s:"" },
          { t:"Total", e:"Σ T₁ … T" + p.N + " = " + n(S, 1) + " min;  promedio " + n(S / p.N, 2), h:n(S, 1) + " min", s:"Para cotizar el pedido completo." }]; } },
    vars:[["T₁", "Tiempo de la primera unidad", "min", "—"], ["r", "Tasa de aprendizaje", "%", "75 a 95 %"], ["b", "Exponente", "—", "−0,4 a −0,07"], ["n", "Número de la unidad", "—", "—"], ["Tₙ", "Tiempo de la unidad n", "min", "—"]],
    sup:"<ul><li>Mismo producto y método.</li><li>Producción continua (si se interrumpe, se «olvida»).</li></ul>",
    ex:{ t:"T₁ = 120 min; tasa 85 %; 64 unidades.",
      steps:[["Calculo b.", "Exponente.", "−0,2345.", ""], ["Unidad 64.", "6 duplicaciones.", "120 × 0,85⁶ = 45,26 min.", "38 % del tiempo inicial."], ["Total.", "Sumar las 64.", "3.711,8 min (58 min promedio).", "Si se cotizara con 120 min por unidad, se sobreestimaría el doble."]],
      r:"la unidad 64 toma 45,26 min y el pedido completo 3.711,8 min." },
    real:"<p>Se descubrió en la fabricación de aviones (Wright, 1936). Hoy se usa en construcción de casas en serie, armado de equipos y en la estimación del costo de tecnologías nuevas (paneles solares, baterías).</p>",
    sim:"lrn",
    chk(){ let S = 0; for (let k = 1; k <= 64; k++) S += Tn(120, 0.85, k); return [["T64", Tn(120, 0.85, 64), 120 * Math.pow(0.85, 6)], ["Total", S, Array.from({ length:64 }, (_, k) => 120 * Math.pow(0.85, Math.log2(k + 1))).reduce((a, b) => a + b, 0)], ["b", Math.log(0.85) / Math.log(2), -0.2344652536]]; },
    quiz:[["Con tasa 80 %, si T₁ = 100, T₄ es:", ["80", "64", "60", "51,2"], 1, "100 × 0,8 × 0,8 = 64."], ["Una tasa de aprendizaje de 95 % indica:", ["Mucho aprendizaje", "Poco aprendizaje", "Ningún aprendizaje", "Aprendizaje negativo"], 1, "El tiempo baja solo 5 % por duplicación."], ["La curva de aprendizaje se usa para:", ["Calcular el EOQ", "Cotizar pedidos y planificar capacidad", "Medir ruido", "Calcular el VAN"], 1, "Estima tiempos y costos futuros."]],
    dec:"cotizaciones, plazos de entrega y dotación al lanzar productos nuevos.",
    rel:["tiempo-estandar", "productividad", "pronosticos"] };

  CSIM.lrn = { title:"Curva de aprendizaje: cada duplicación baja el tiempo",
    goal:"cómo baja el tiempo por unidad con la experiencia y por qué la mejora se hace más lenta.",
    params:[{ k:"r", l:"Tasa de aprendizaje", min:70, max:98, step:1, v:85, u:"%", help:"Menor = se aprende más rápido." }, { k:"lg", l:"Escala del eje", min:0, max:1, step:1, v:0, fmt:v => v ? "logarítmica" : "normal", u:"", help:"En escala log-log la curva es una recta." }],
    init(){ return { k:0 }; }, onParam(s){ s.k = 0; }, tick(s, p, dt){ s.k = Math.min(64, s.k + dt * 20); },
    draw(g, W, H, s, p, C){ const r = p.r / 100, x0 = 50, x1 = W - 14, y0 = H - 30, top = 36, X = k => p.lg ? x0 + Math.log(k) / Math.log(64) * (x1 - x0) : x0 + (k - 1) / 63 * (x1 - x0), Y = v => p.lg ? y0 - Math.log(v / 15) / Math.log(130 / 15) * (y0 - top) : y0 - v / 130 * (y0 - top);
      SIMG.axes(g, x0, y0, x1, top, C, "", "Minutos por unidad"); [30, 60, 120].forEach(v => SIMG.text(g, v, x0 - 4, Y(v) + 4, C.muted, C, "right")); [1, 8, 16, 32].forEach(k => SIMG.text(g, k, X(k), y0 + 14, C.muted, C, "center"));
      g.strokeStyle = C.line; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(X(1), Y(120)); g.lineTo(X(64), Y(120)); g.stroke(); g.setLineDash([]);
      g.strokeStyle = C.c1; g.lineWidth = 2.5; g.beginPath(); for (let k = 1; k <= Math.max(1, s.k); k++) { k > 1 ? g.lineTo(X(k), Y(Tn(120, r, k))) : g.moveTo(X(k), Y(Tn(120, r, k))); } g.stroke();
      [1, 2, 4, 8, 16, 32, 64].filter(k => k <= s.k).forEach(k => { g.fillStyle = C.c2; g.beginPath(); g.arc(X(k), Y(Tn(120, r, k)), 4.5, 0, 7); g.fill(); if (k >= 4) SIMG.text(g, n(Tn(120, r, k), 0), X(k), Y(Tn(120, r, k)) - 9, C.ink, C, "center", true); });
      SIMG.text(g, "● duplicaciones de la producción", x1, 14, C.c2, C, "right", true); },
    metrics(s, p){ const r = p.r / 100; let S = 0; for (let k = 1; k <= 64; k++) S += Tn(120, r, k); return [["Unidad 2", n(Tn(120, r, 2), 1) + " min"], ["Unidad 64", n(Tn(120, r, 64), 1) + " min"], ["Total 64 unidades", n(S, 0) + " min"], ["Ahorro vs sin aprendizaje", n((1 - S / 7680) * 100, 1) + " %"]]; },
    ann(s, p){ return p.lg ? "En escala logarítmica la curva es una línea recta: así se reconoce el aprendizaje en datos reales." : "Los puntos naranjos marcan las duplicaciones (1, 2, 4, 8…): en cada una el tiempo se multiplica por la tasa."; },
    concl(s, p){ return "<p>Con tasa " + p.r + " %, la unidad 64 toma " + n(Tn(120, p.r / 100, 64), 1) + " min (de 120 iniciales).</p><p><b>Qué demuestra:</b> la mejora es rápida al principio y lenta después.</p><p><b>Qué decisión informa:</b> cotizar y planificar sin sobreestimar ni subestimar tiempos.</p>"; } };

  /* ===================== NIOSH ===================== */
  const FM = 0.84, CMg = 0.95;
  const lpr = (H, V, D, A) => { const HM = Math.min(1, 25 / H), VM = 1 - 0.003 * Math.abs(V - 75), DM = Math.min(1, 0.82 + 4.5 / D), AM = 1 - 0.0032 * A; return { HM, VM, DM, AM, L: 23 * HM * VM * DM * AM * FM * CMg }; };
  CRS.niosh = {
    kw:"niosh ecuacion de levantamiento manejo manual de cargas limite de peso recomendado indice de levantamiento ergonomia ley 20001",
    ess:{ pts:["La ecuación NIOSH calcula el <b>límite de peso recomendado</b> (LPR) para levantar sin riesgo de lesión lumbar.", "Parte de 23 kg (constante de carga) y la multiplica por factores menores que 1 según distancia, altura, recorrido, giro, frecuencia y agarre.", "<b>Índice de levantamiento</b> IL = peso ÷ LPR: sobre 1 hay riesgo; sobre 3, riesgo alto.", "En Chile, la Ley 20.001 limita la carga manual a 25 kg (hombres adultos) y exige evaluar el riesgo."],
      fx:"LPR = 23 · HM · VM · DM · AM · FM · CM;   IL = peso ÷ LPR", when:"evalúas o rediseñas un puesto donde se levantan cargas a mano." },
    intro:{ prob:"<p>Un operario levanta cajas de 18 kg desde 60 cm de altura, con las manos a 40 cm del cuerpo, las sube 70 cm y gira el tronco 30°, 2 veces por minuto. ¿Es seguro?</p>",
      anal:"<p>Levantar una bolsa de 10 kg pegada al cuerpo es fácil; la misma bolsa con los brazos estirados y girando la espalda es mucho más dañina. NIOSH cuantifica ese «cómo se levanta».</p>",
      terms:[["H", "Distancia horizontal manos–tobillos (cm)."], ["V", "Altura de las manos al inicio (cm)."], ["D", "Desplazamiento vertical (cm)."], ["A", "Ángulo de asimetría (giro del tronco)."], ["FM", "Factor de frecuencia (tabla)."], ["CM", "Factor de agarre (tabla)."], ["LPR", "Límite de peso recomendado."], ["IL", "Índice de levantamiento."]] },
    adv:"<p><b>Factores:</b> HM = 25 ÷ H; VM = 1 − 0,003|V − 75|; DM = 0,82 + 4,5 ÷ D; AM = 1 − 0,0032A. La mejor posición es H = 25 cm y V = 75 cm (altura de los nudillos). <b>Rediseño:</b> acercar la carga, subirla a la altura de la cintura y eliminar giros vale más que entrenar.</p>",
    sp:{ title:"Límite de peso recomendado", params:[{ k:"H", l:"Distancia horizontal H", v:40, u:"cm" }, { k:"V", l:"Altura inicial V", v:60, u:"cm" }, { k:"P", l:"Peso", v:18, u:"kg" }],
      script(p){ const r = lpr(p.H, p.V, 70, 30);
        return [
          { t:"HM", e:"HM = 25 ÷ " + p.H + " = " + n(r.HM, 3), h:n(r.HM, 3), s:"Mientras más lejos del cuerpo, menor." },
          { t:"VM", e:"VM = 1 − 0,003 · |" + p.V + " − 75| = " + n(r.VM, 3), s:"Lo ideal es la altura de los nudillos (75 cm)." },
          { t:"DM y AM", e:"DM = 0,82 + 4,5 ÷ 70 = " + n(r.DM, 3) + ";  AM = 1 − 0,0032 · 30 = " + n(r.AM, 3), s:"Recorrido y giro." },
          { t:"FM y CM", e:"FM = 0,84 (2/min, 1 a 2 h);  CM = 0,95 (agarre regular)", s:"De las tablas NIOSH." },
          { t:"LPR", e:"LPR = 23 · " + [r.HM, r.VM, r.DM, r.AM, FM, CMg].map(v => n(v, 3)).join(" · ") + " = " + n(r.L, 2) + " kg", h:n(r.L, 2) + " kg", s:"Peso aceptable para casi toda la población." },
          { t:"IL", e:"IL = " + p.P + " ÷ " + n(r.L, 2) + " = " + n(p.P / r.L, 2), h:n(p.P / r.L, 2), s:p.P / r.L > 3 ? "Riesgo alto: rediseñar con urgencia." : p.P / r.L > 1 ? "Hay riesgo: rediseñar el puesto." : "Aceptable." }]; } },
    vars:[["H", "Distancia horizontal", "cm", "25 a 63"], ["V", "Altura de las manos", "cm", "0 a 175"], ["D", "Desplazamiento vertical", "cm", "25 a 175"], ["A", "Asimetría", "°", "0 a 135"], ["FM", "Factor de frecuencia", "—", "tabla"], ["CM", "Factor de agarre", "—", "0,90 a 1"], ["LPR", "Límite recomendado", "kg", "≤ 23"], ["IL", "Índice", "—", "≤ 1 aceptable"]],
    sup:"<ul><li>Levantamiento con dos manos, en posición de pie.</li><li>Sin empujes ni arrastres (para eso hay otros métodos).</li></ul>",
    ex:{ t:"Caja de 18 kg; H 40 cm; V 60 cm; D 70 cm; giro 30°; 2/min por 1 a 2 h; agarre regular.",
      steps:[["Factores.", "Fórmulas y tablas.", "HM 0,625; VM 0,955; DM 0,884; AM 0,904; FM 0,84; CM 0,95.", "El peor factor es la distancia horizontal."], ["LPR.", "Multiplicar.", "8,76 kg.", ""], ["IL.", "Peso ÷ LPR.", "2,06.", "Riesgo: aunque 18 kg cumple el máximo legal de 25 kg."]],
      r:"IL = 2,06: el levantamiento es riesgoso. Acercar la caja (H = 25) y subirla a 75 cm casi duplica el LPR." },
    real:"<p>En Chile la Ley 20.001 y la Guía Técnica de Manejo Manual de Carga obligan a evaluar el riesgo. Cumplir el máximo legal (25 kg) no basta: el cómo se levanta importa tanto como el peso.</p>",
    sim:"niosh",
    chk(){ const r = lpr(40, 60, 70, 30); return [["LPR", r.L, 23 * 0.625 * 0.955 * (0.82 + 4.5 / 70) * 0.904 * 0.84 * 0.95], ["IL", 18 / r.L, 18 / (23 * 0.625 * 0.955 * (0.82 + 4.5 / 70) * 0.904 * 0.84 * 0.95)]]; },
    quiz:[["¿Qué cambio aumenta más el LPR?", ["Levantar más rápido", "Acercar la carga al cuerpo", "Girar más el tronco", "Bajar la carga al suelo"], 1, "HM = 25 ÷ H: de 50 a 25 cm, el factor pasa de 0,5 a 1."], ["Un IL = 0,8 significa:", ["Riesgo alto", "Levantamiento aceptable", "Prohibido", "Peso legal excedido"], 1, "IL ≤ 1: aceptable para la mayoría."], ["La altura ideal de inicio del levantamiento es:", ["El suelo", "La altura de los nudillos (≈ 75 cm)", "Sobre la cabeza", "Los hombros"], 1, "VM = 1 con V = 75 cm."]],
    dec:"si un puesto de manejo de carga es seguro y qué rediseñar primero.",
    rel:["ruido", "iper", "tiempo-estandar"] };

  CSIM.niosh = { title:"Factores NIOSH y riesgo del levantamiento",
    goal:"cuál factor reduce más el límite de peso y cómo el rediseño del puesto baja el riesgo.",
    params:[{ k:"P", l:"Peso de la caja", min:5, max:25, step:1, v:18, u:"kg", help:"" }, { k:"H", l:"Distancia horizontal H", min:25, max:63, step:1, v:40, u:"cm", help:"" }, { k:"V", l:"Altura inicial V", min:0, max:150, step:5, v:60, u:"cm", help:"" }, { k:"A", l:"Giro del tronco", min:0, max:90, step:5, v:30, u:"°", help:"" }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.8); },
    draw(g, W, H, s, p, C){ const r = lpr(p.H, p.V, 70, p.A), F = [["HM distancia", r.HM], ["VM altura", r.VM], ["DM recorrido", r.DM], ["AM giro", r.AM], ["FM frecuencia", FM], ["CM agarre", CMg]], x0 = 110, x1 = W * 0.6, rh = (H - 30) / F.length, IL = p.P / r.L;
      F.forEach(([l, v], k) => { const y = 14 + k * rh; SIMG.text(g, l, x0 - 8, y + rh * 0.5 + 4, C.ink, C, "right"); g.fillStyle = C.line; g.globalAlpha = 0.35; g.fillRect(x0, y + rh * 0.2, x1 - x0, rh * 0.55); g.globalAlpha = 1; bar(g, x0, y + rh * 0.2, (x1 - x0) * v * s.t, rh * 0.55, v < 0.8 ? C.c2 : C.c1); SIMG.text(g, n(v, 2), x0 + (x1 - x0) * v * s.t - 4, y + rh * 0.5 + 4, C.surf, C, "right", true); });
      const gx = x1 + 30, gw = W - 14 - gx, gy = 30, gh = H - 70, Yg = v => gy + gh - Math.min(1, v / 25) * gh; g.fillStyle = C.line; g.globalAlpha = 0.35; g.fillRect(gx, gy, gw, gh); g.globalAlpha = 1;
      bar(g, gx, gy + gh, gw, (Yg(p.P) - gy - gh) * s.t, IL > 3 ? C.bad : IL > 1 ? C.c2 : C.ok); g.strokeStyle = C.ink; g.lineWidth = 2; g.beginPath(); g.moveTo(gx - 6, Yg(r.L)); g.lineTo(gx + gw + 6, Yg(r.L)); g.stroke();
      SIMG.text(g, "LPR " + n(r.L, 1) + " kg", gx + gw / 2, Yg(r.L) - 6, C.ink, C, "center", true); SIMG.text(g, "IL " + n(IL, 2), gx + gw / 2, gy + gh + 18, C.ink, C, "center", true); SIMG.text(g, p.P + " kg", gx + gw / 2, Math.max(gy + 12, Yg(p.P) + 16), C.surf, C, "center", true); },
    metrics(s, p){ const r = lpr(p.H, p.V, 70, p.A), IL = p.P / r.L; return [["LPR", n(r.L, 2) + " kg"], ["IL", n(IL, 2)], ["Nivel", IL > 3 ? "Riesgo alto" : IL > 1 ? "Riesgo" : "Aceptable"], ["Peso máximo sin riesgo", n(r.L, 1) + " kg"]]; },
    ann(s, p){ return p.H > 35 ? "La barra roja más corta suele ser HM: acercar la carga al cuerpo es el cambio que más ayuda." : "A la izquierda, cada factor (1 = sin penalización). A la derecha, el peso real contra el límite (línea negra)."; },
    concl(s, p){ const r = lpr(p.H, p.V, 70, p.A); return "<p>LPR = " + n(r.L, 2) + " kg; IL = <b>" + n(p.P / r.L, 2) + "</b>.</p><p><b>Qué demuestra:</b> el riesgo depende de la postura tanto como del peso.</p><p><b>Qué decisión informa:</b> qué rediseñar (mesas elevadoras, acercar la carga, eliminar giros) y si hace falta ayuda mecánica.</p>"; } };

  /* ===================== RUIDO ===================== */
  const TR = [["Esmerilado", 94, 1.5], ["Prensa hidráulica", 88, 3], ["Sala de compresores", 91, 0.5], ["Oficina de planta", 68, 3]];
  const Tp = L => 8 / Math.pow(2, (L - 85) / 3);
  const dosis = T => T.reduce((a, [, L, h]) => a + h / Tp(L), 0), leq = T => 10 * Math.log10(T.reduce((a, [, L, h]) => a + h * Math.pow(10, L / 10), 0) / 8);
  CRS.ruido = {
    kw:"ruido dosis de ruido nivel de presion sonora decibeles db a npseq ds 594 protocolo prexor hipoacusia protector auditivo",
    ess:{ pts:["El límite en Chile (DS 594) es <b>85 dB(A) durante 8 horas</b>.", "Cada <b>3 dB más</b> el sonido tiene el doble de energía: el tiempo permitido se reduce a la mitad.", "La <b>dosis</b> suma la fracción de tiempo permitido usada en cada tarea; sobre 100 % se excede el límite.", "El nivel equivalente NPSeq resume toda la jornada en un solo número."],
      fx:"T = 8 ÷ 2^((L − 85) ÷ 3);   D = Σ tᵢ ÷ Tᵢ;   NPSeq = 10·log₁₀[Σ tᵢ·10^(Lᵢ ÷ 10) ÷ 8]", when:"evalúas la exposición a ruido de un trabajador que pasa por varias áreas." },
    intro:{ prob:"<p>Un operario pasa 1,5 h esmerilando (94 dB), 3 h en prensa (88 dB), 0,5 h en compresores (91 dB) y 3 h en oficina (68 dB). ¿Cumple el límite?</p>",
      anal:"<p>El ruido es como el sol: lo que daña es la dosis (intensidad por tiempo). Una hora a pleno sol de mediodía puede ser peor que una tarde entera a la sombra.</p>",
      terms:[["dB(A)", "Decibel con ponderación A (como oye el oído humano)."], ["L", "Nivel de presión sonora de la tarea."], ["T", "Tiempo máximo permitido a ese nivel."], ["t", "Tiempo real expuesto."], ["Dosis", "Σ t ÷ T (100 % = límite)."], ["NPSeq", "Nivel equivalente de 8 horas."], ["PREXOR", "Protocolo del MINSAL de exposición ocupacional a ruido."]] },
    adv:"<p><b>Escala logarítmica:</b> dos máquinas de 90 dB juntas dan 93 dB, no 180. <b>Jerarquía de control:</b> eliminar o encerrar la fuente, alejar al trabajador, rotar tareas y, al final, protector auditivo (su atenuación real es menor que la nominal).</p>",
    sp:{ title:"Dosis diaria y nivel equivalente", params:[{ k:"L1", l:"Nivel del esmerilado", v:94, u:"dB(A)" }, { k:"h1", l:"Horas de esmerilado", v:1.5, u:"h" }],
      script(p){ const T = [["Esmerilado", p.L1, p.h1]].concat(TR.slice(1)), D = dosis(T);
        return [
          { t:"Tiempo permitido", e:"T(" + p.L1 + " dB) = 8 ÷ 2^((" + p.L1 + " − 85) ÷ 3) = " + n(Tp(p.L1), 2) + " h", h:n(Tp(p.L1), 2) + " h", s:"Cada 3 dB sobre 85, la mitad de tiempo." },
          { t:"Dosis esmerilado", e:n(p.h1, 1) + " ÷ " + n(Tp(p.L1), 2) + " = " + n(p.h1 / Tp(p.L1) * 100, 1) + " %", s:"Fracción del permitido usada en esa tarea." },
          { t:"Otras tareas", e:"Prensa 3 ÷ 4 = 75 %;  compresores 0,5 ÷ 2 = 25 %;  oficina ≈ 0,7 %", s:"" },
          { t:"Dosis total", e:"D = " + n(D * 100, 1) + " %", h:n(D * 100, 1) + " %", s:D > 1 ? "Sobre 100 %: se excede el límite legal." : "Bajo el límite." },
          { t:"NPSeq", e:"NPSeq = 10·log₁₀[Σ tᵢ·10^(Lᵢ/10) ÷ 8] = " + n(leq(T), 1) + " dB(A)", h:n(leq(T), 1) + " dB(A)", s:"Equivale a estar " + n(leq(T), 1) + " dB toda la jornada." }]; } },
    vars:[["L", "Nivel de presión sonora", "dB(A)", "—"], ["T", "Tiempo permitido", "h", "8 h a 85 dB"], ["t", "Tiempo de exposición", "h", "—"], ["D", "Dosis", "%", "≤ 100 %"], ["NPSeq", "Nivel equivalente 8 h", "dB(A)", "≤ 85"]],
    sup:"<ul><li>Criterio de intercambio de 3 dB (Chile, DS 594).</li><li>Niveles medidos con sonómetro o dosímetro calibrado.</li></ul>",
    ex:{ t:"Esmerilado 94 dB 1,5 h; prensa 88 dB 3 h; compresores 91 dB 0,5 h; oficina 68 dB 3 h.",
      steps:[["Tiempos permitidos.", "Fórmula.", "1; 4; 2 h; oficina sin límite práctico.", ""], ["Dosis parciales.", "t ÷ T.", "150 %; 75 %; 25 %; 0,7 %.", "El esmerilado solo ya excede el límite."], ["Dosis total.", "Sumar.", "251 %.", "Más del doble de lo permitido."], ["NPSeq.", "Promedio energético.", "89,0 dB(A).", "4 dB sobre el límite."]],
      r:"dosis 251 % (NPSeq 89 dB(A)): no cumple. Prioridad: encerrar o reducir el esmerilado y limitar su tiempo; mientras tanto, protector auditivo." },
    real:"<p>La hipoacusia por ruido es una de las enfermedades profesionales más frecuentes en Chile. El protocolo PREXOR del MINSAL obliga a medir, controlar y vigilar audiométricamente a los expuestos.</p>",
    sim:"ruido",
    chk(){ return [["Dosis", dosis(TR), 1.5 + 0.75 + 0.25 + 3 / Tp(68)], ["NPSeq", leq(TR), 10 * Math.log10((1.5 * Math.pow(10, 9.4) + 3 * Math.pow(10, 8.8) + 0.5 * Math.pow(10, 9.1) + 3 * Math.pow(10, 6.8)) / 8)]]; },
    quiz:[["Con criterio de 3 dB, a 91 dB(A) el tiempo permitido es:", ["8 h", "4 h", "2 h", "1 h"], 2, "91 − 85 = 6 dB = dos duplicaciones: 8 ÷ 4 = 2 h."], ["Dos máquinas de 90 dB funcionando juntas generan aproximadamente:", ["180 dB", "93 dB", "90 dB", "100 dB"], 1, "Duplicar la energía suma 3 dB."], ["La primera medida de control del ruido debería ser:", ["Entregar tapones", "Actuar sobre la fuente", "Pagar un bono", "Hacer audiometrías"], 1, "Jerarquía de control: primero la fuente."]],
    dec:"si un trabajador está sobreexpuesto y qué tarea controlar primero.",
    rel:["niosh", "iper", "muestreo"] };

  CSIM.ruido = { title:"Dosis de ruido de la jornada",
    goal:"cómo pocas horas en una tarea muy ruidosa pueden copar toda la dosis diaria, y qué controles la bajan más.",
    params:[{ k:"L1", l:"Nivel del esmerilado", min:80, max:100, step:1, v:94, u:"dB(A)", help:"Encerrar la fuente baja el nivel." }, { k:"h1", l:"Horas de esmerilado", min:0, max:4, step:0.25, v:1.5, u:"h", help:"Rotar tareas baja el tiempo." }, { k:"pr", l:"Atenuación del protector", min:0, max:15, step:1, v:0, u:"dB", help:"Atenuación real (no la nominal)." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.8); },
    T(p){ return [["Esmeril", p.L1 - p.pr, p.h1], ["Prensa", 88 - p.pr, 3], ["Compres.", 91 - p.pr, 0.5], ["Oficina", 68, 3]]; },
    draw(g, W, H, s, p, C){ const T = this.T(p), D = dosis(T), x0 = 50, x1 = W - 14, y0 = H - 58, top = 36, mx = Math.max(1.2, D * 1.1), Y = v => y0 - v / mx * (y0 - top), bw = (x1 - x0) / 5;
      SIMG.axes(g, x0, y0, x1, top, C, "", "Dosis"); [0, 1].forEach(v => SIMG.text(g, n(v * 100) + " %", x0 - 4, Y(v) + 4, v ? C.bad : C.muted, C, "right", !!v)); SIMG.hline(g, x0, x1, Y(1), C.bad, [5, 4], "", C);
      let acc = 0; T.forEach(([l, L, h], k) => { const d = h / Tp(L), x = x0 + k * bw + bw * 0.15; bar(g, x, Y(acc), bw * 0.7, (Y(acc + d) - Y(acc)) * s.t, [C.c3, C.c1, C.c2, C.muted][k]); SIMG.text(g, n(d * 100, 0) + " %", x + bw * 0.35, Y(acc + d) * s.t + Y(acc) * (1 - s.t) - 4, C.ink, C, "center", true); SIMG.text(g, l, x + bw * 0.35, y0 + 14, C.muted, C, "center"); SIMG.text(g, n(L, 0) + " dB", x + bw * 0.35, y0 + 28, C.muted, C, "center"); SIMG.text(g, n(h, 2) + " h", x + bw * 0.35, y0 + 42, C.muted, C, "center"); acc += d; });
      const x = x0 + 4 * bw + bw * 0.15; bar(g, x, y0, bw * 0.7, (Y(D) - y0) * s.t, D > 1 ? C.bad : C.ok); SIMG.text(g, n(D * 100, 0) + " %", x + bw * 0.35, Y(D) * s.t + y0 * (1 - s.t) - 4, C.ink, C, "center", true); SIMG.text(g, "TOTAL", x + bw * 0.35, y0 + 14, C.ink, C, "center", true); },
    metrics(s, p){ const T = this.T(p), D = dosis(T); return [["Dosis total", n(D * 100, 1) + " %"], ["NPSeq 8 h", n(leq(T), 1) + " dB(A)"], ["Tiempo permitido esmerilando", n(Tp(p.L1 - p.pr), 2) + " h"], ["Estado", D > 1 ? "Sobre el límite" : D > 0.5 ? "Sobre nivel de acción (50 %)" : "Aceptable"]]; },
    ann(s, p){ return p.h1 > 0 && p.h1 / Tp(p.L1 - p.pr) > 1 ? "Solo el esmerilado ya supera el 100 %: hay que bajar su nivel o su tiempo." : "Cada barra es la dosis de una tarea, apilada sobre la anterior; la barra final es la dosis total."; },
    concl(s, p){ const D = dosis(this.T(p)); return "<p>Dosis total: <b>" + n(D * 100, 0) + " %</b>.</p><p><b>Qué demuestra:</b> por la escala logarítmica, bajar 3 dB la fuente equivale a reducir a la mitad el tiempo de exposición.</p><p><b>Qué decisión informa:</b> qué control aplicar primero (fuente, tiempo o protector).</p>"; } };
})();
