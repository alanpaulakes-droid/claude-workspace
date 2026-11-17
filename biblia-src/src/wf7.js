/* ============ CURSO · Módulo Estadística ============
   Referencias: Descriptiva (30 datos): x̄ = 50,1233; s = 0,3266; IC 95 % = 50,001 a 50,245.
   Muestra: p = 0,5; e = 5 %; 95 % → n₀ = 384,1 → 385; con N = 1.200 → 292. Regresión: y = 548,444 + 69,8667x; r = 0,9978; R² = 99,56 %; ŷ(60) = 4.740,4. */
(function(){
  const n = crsNum, zr = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const mean = a => a.reduce((s, x) => s + x, 0) / a.length, sd = a => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
  const zOf = c => ({ 90:1.645, 95:1.96, 99:2.576 })[c] || 1.96;

  /* ===================== ESTADÍSTICA DESCRIPTIVA ===================== */
  const DD = [50.2, 49.8, 50.5, 50.1, 49.6, 50.3, 50.0, 49.9, 50.7, 50.2, 49.7, 50.4, 50.1, 50.0, 49.5, 50.6, 50.3, 49.9, 50.2, 50.8, 49.8, 50.1, 50.4, 49.6, 50.0, 50.3, 50.5, 49.9, 50.2, 50.1];
  CRS.descriptiva = {
    kw:"estadistica descriptiva media mediana moda desviacion estandar varianza histograma cuartiles intervalo de confianza coeficiente de variacion",
    ess:{ pts:["Resume muchos datos en pocos números: dónde está el centro (media, mediana) y cuánto varían (desviación, rango).", "La <b>desviación estándar</b> mide la distancia típica de los datos a la media.", "El <b>histograma</b> muestra la forma: simétrica, sesgada, con dos picos.", "El <b>intervalo de confianza</b> dice entre qué valores está, probablemente, la media real del proceso."],
      fx:"x̄ = Σx ÷ n;   s = √(Σ(x − x̄)² ÷ (n − 1));   IC = x̄ ± t · s ÷ √n", when:"tienes una muestra de mediciones y necesitas describirla o estimar el comportamiento del proceso." },
    intro:{ prob:"<p>Se pesaron 30 sacos que deberían pesar 50 kg. Los pesos van de 49,5 a 50,8. ¿Cuánto pesan en promedio, cuánto varían y se puede afirmar que el promedio real está sobre 50 kg?</p>",
      anal:"<p>Si mides la estatura de tu curso, el promedio dice «cómo es el típico» y la desviación dice «qué tan distintos son entre sí». Dos cursos con el mismo promedio pueden ser muy distintos si uno tiene a todos parecidos y el otro mezcla muy altos y muy bajos.</p>",
      terms:[["Media (x̄)", "Suma de los datos dividida por la cantidad."], ["Mediana", "Valor del medio al ordenar los datos."], ["Desviación estándar (s)", "Distancia típica a la media (en la misma unidad que los datos)."], ["Varianza (s²)", "Desviación al cuadrado."], ["Coeficiente de variación", "s ÷ x̄ × 100: variación relativa."], ["Cuartiles", "Valores que dejan 25 %, 50 % y 75 % de los datos por debajo."], ["Error estándar", "s ÷ √n: cuánto varía la media de una muestra a otra."]] },
    adv:"<p><b>¿Por qué n − 1?</b> Al calcular la desviación con la media de la misma muestra, los datos quedan «demasiado cerca» de ella. Dividir por n − 1 (corrección de Bessel) compensa ese sesgo.</p><p><b>t de Student:</b> con muestras pequeñas se usa t en vez de z (con 29 grados de libertad, t = 2,045 en vez de 1,96), porque s también es una estimación.</p><p><b>Media vs mediana:</b> con datos sesgados (sueldos, tiempos de reparación) la mediana representa mejor al «típico».</p>",
    sp:{ title:"Media, desviación e intervalo, paso a paso",
      params:[],
      script(){ const m = mean(DD), s = sd(DD), e = 2.045 * s / Math.sqrt(30);
        return [
          { t:"Suma", e:"Σx = 50,2 + 49,8 + … + 50,1 = " + n(DD.reduce((a, b) => a + b, 0), 1), s:"Se suman los 30 pesos." },
          { t:"Media", e:"x̄ = 1.503,7 ÷ 30 = " + n(m, 4) + " kg", h:n(m, 4), s:"El peso promedio de la muestra." },
          { t:"Desvíos", e:"(50,2 − 50,1233)² + (49,8 − 50,1233)² + … = " + n(DD.reduce((a, x) => a + (x - m) ** 2, 0), 4), s:"Se suma el cuadrado de la distancia de cada dato a la media." },
          { t:"Varianza", e:"s² = " + n(DD.reduce((a, x) => a + (x - m) ** 2, 0), 4) + " ÷ 29 = " + n(s * s, 5), s:"Se divide por n − 1." },
          { t:"Desviación", e:"s = √" + n(s * s, 5) + " = " + n(s, 4) + " kg", h:n(s, 4), s:"Los sacos se alejan unos 0,33 kg del promedio, típicamente." },
          { t:"Intervalo", e:"IC 95 % = " + n(m, 4) + " ± 2,045 · " + n(s, 4) + " ÷ √30 = " + n(m - e, 3) + " a " + n(m + e, 3), h:n(m - e, 3) + " a " + n(m + e, 3), s:"Con 95 % de confianza, la media real del proceso está en ese rango." },
          { t:"Conclusión", e:"El intervalo queda sobre 50 kg", s:"Se puede afirmar que el proceso llena, en promedio, sobre los 50 kg." }]; } },
    vars:[["n", "Tamaño de la muestra", "datos", "—"], ["x̄", "Media muestral", "unidad del dato", "—"], ["s", "Desviación estándar muestral", "unidad del dato", "—"], ["s²", "Varianza", "unidad²", "—"], ["CV", "s ÷ x̄ × 100", "%", "&lt; 10 % suele ser poca variación"], ["t", "Valor t de Student (n − 1 grados de libertad)", "—", "≈ 2 para n ≥ 30 al 95 %"], ["IC", "Intervalo de confianza de la media", "unidad del dato", "—"]],
    sup:"<ul><li>La muestra es aleatoria y representativa del proceso.</li><li>Para el intervalo con t: datos aproximadamente normales o n ≥ 30.</li><li>Las mediciones son confiables.</li></ul>",
    ex:{ t:"30 pesos de sacos de cemento (kg), entre 49,5 y 50,8.",
      steps:[["Calculo la media y la mediana.", "Medidas de centro.", "Media 50,123; mediana 50,10.", "Casi iguales: los datos son simétricos."],
        ["Calculo la desviación estándar.", "Medida de variación.", "s = 0,327 kg; CV = 0,65 %.", "Variación muy baja respecto del peso."],
        ["Calculo el IC 95 % de la media.", "Estimar la media real.", "50,001 a 50,245 kg.", "La envasadora llena en promedio sobre 50 kg: regala unos 120 g por saco."]],
      r:"los sacos pesan en promedio 50,12 kg (entre 50,00 y 50,25 con 95 % de confianza). Se puede bajar el ajuste unos 100 g sin incumplir el peso." },
    real:"<p>Es la base de todo análisis de datos en planta: control de peso neto (exigido por la ley de etiquetado), tiempos de atención, consumos de energía. Excel (PROMEDIO, DESVEST.M, INTERVALO.CONFIANZA.T) y Power BI lo calculan; lo clave es interpretar.</p>",
    sim:"hist",
    chk(){ return [["Media", mean(DD), 50.123333333333335], ["s", sd(DD), Math.sqrt((30 * DD.reduce((a, x) => a + x * x, 0) - DD.reduce((a, x) => a + x, 0) ** 2) / (30 * 29))]]; },
    quiz:[["En los datos 2, 3, 3, 4, 18, la medida de centro más representativa es:", ["La media (6)", "La mediana (3)", "El máximo", "El rango"], 1, "El 18 arrastra la media; la mediana no se afecta."],
      ["Si todos los datos se multiplican por 2, la desviación estándar:", ["No cambia", "Se duplica", "Se cuadruplica", "Baja a la mitad"], 1, "La desviación tiene la misma unidad que los datos."],
      ["Al aumentar el tamaño de la muestra, el intervalo de confianza de la media:", ["Se ensancha", "Se estrecha", "No cambia", "Desaparece"], 1, "El error estándar s ÷ √n baja."]],
    dec:"cómo es el proceso (centro y variación), si cumple un valor objetivo y cuánta precisión tiene la estimación.",
    rel:["muestra", "control-xr", "capacidad", "regresion"] };

  CSIM.hist = { title:"Histograma que converge a la campana",
    goal:"cómo se forma la distribución al juntar muchos datos, y por qué la media de la muestra se estabiliza mientras el intervalo se estrecha.",
    params:[{ k:"mu", l:"Media real del proceso", min:49.5, max:50.5, step:0.05, v:50.12, u:"kg", help:"Lo que la muestra intenta estimar." }, { k:"sg", l:"Desviación real", min:0.1, max:0.6, step:0.02, v:0.33, u:"kg", help:"Variación del proceso." }],
    init(){ return { x:[], acc:0 }; }, onParam(s){ s.x = []; },
    tick(s, p, dt){ s.acc += dt * 30; while (s.acc >= 1 && s.x.length < 3000) { s.acc -= 1; s.x.push(p.mu + p.sg * zr()); } },
    draw(g, W, H, s, p, C){ const lo = 48.5, hi = 51.5, k = 40, bins = new Array(k).fill(0), x0 = 40, x1 = W - 12, y0 = H - 30, top = 16, X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0); s.x.forEach(v => { const b = Math.floor((v - lo) / (hi - lo) * k); if (b >= 0 && b < k) bins[b]++; });
      SIMG.axes(g, x0, y0, x1, top, C, "peso (kg)", "Frecuencia"); const mx = Math.max(1, ...bins), bw = (x1 - x0) / k;
      bins.forEach((c, i) => { const h = c / mx * (y0 - top - 20); g.fillStyle = C.c1; g.globalAlpha = 0.6; g.fillRect(x0 + i * bw + 1, y0 - h, bw - 2, h); g.globalAlpha = 1; });
      if (s.x.length > 30) { const sc = s.x.length * (hi - lo) / k / (p.sg * Math.sqrt(2 * Math.PI)) / mx * (y0 - top - 20); g.strokeStyle = C.ink; g.lineWidth = 1.8; g.beginPath(); for (let i = 0; i <= 200; i++) { const v = lo + i / 200 * (hi - lo), y = y0 - sc * Math.exp(-0.5 * ((v - p.mu) / p.sg) ** 2); i ? g.lineTo(X(v), y) : g.moveTo(X(v), y); } g.stroke();
        const m = mean(s.x), e = 1.96 * sd(s.x) / Math.sqrt(s.x.length); g.fillStyle = C.c2; g.globalAlpha = 0.25; g.fillRect(X(m - e), top, Math.max(2, X(m + e) - X(m - e)), y0 - top); g.globalAlpha = 1; g.strokeStyle = C.c2; g.lineWidth = 2; g.beginPath(); g.moveTo(X(m), top); g.lineTo(X(m), y0); g.stroke(); SIMG.text(g, "x̄ = " + n(m, 3), X(m) + 4, top + 12, C.ink, C, "left", true); }
      [49, 49.5, 50, 50.5].forEach(v => SIMG.text(g, n(v, 1), X(v), y0 + 14, C.muted, C, "center")); },
    metrics(s, p){ const N = s.x.length; if (N < 2) return [["Datos", n(N)]]; const m = mean(s.x), d = sd(s.x), e = 1.96 * d / Math.sqrt(N); return [["Datos", n(N)], ["Media muestral", n(m, 4)], ["Desviación muestral", n(d, 4)], ["IC 95 % de la media", n(m - e, 3) + " a " + n(m + e, 3)], ["Ancho del IC", n(2 * e, 4)]]; },
    ann(s){ return s.x.length < 100 ? "Con pocos datos el histograma es irregular: cada nuevo dato lo cambia." : "Con muchos datos el histograma toma la forma de la campana (línea negra) y la banda naranja (IC de la media) se vuelve muy angosta."; },
    concl(s, p){ return "<p>Con " + n(s.x.length) + " datos, la media muestral está muy cerca de la real (" + n(p.mu, 2) + ").</p><p><b>Qué demuestra:</b> la forma de la distribución aparece al juntar muchos datos; la incertidumbre sobre la media baja con √n, aunque la variación de los datos no cambia.</p><p><b>Qué decisión informa:</b> cuántos datos tomar y qué tan confiable es un promedio.</p>"; } };

  /* ===================== TAMAÑO DE MUESTRA ===================== */
  CRS.muestra = {
    kw:"tamaño de muestra intervalo de confianza error maximo margen de error encuesta proporcion poblacion finita nivel de confianza z",
    ess:{ pts:["Calcula <b>cuántos datos</b> tomar para estimar algo con un error máximo y una confianza dados.", "Para una proporción: n₀ = z²·p(1 − p) ÷ e². Si no se sabe p, se usa 0,5 (el caso más exigente).", "Más confianza o menos error ⇒ muchas más muestras (el error está al cuadrado).", "Con población chica, se corrige: n = n₀ ÷ (1 + (n₀ − 1) ÷ N)."],
      fx:"n₀ = z² · p(1 − p) ÷ e²;   n = n₀ ÷ (1 + (n₀ − 1) ÷ N)", when:"vas a hacer una encuesta, una auditoría o un muestreo de calidad y necesitas definir cuántos casos revisar." },
    intro:{ prob:"<p>Una empresa con 1.200 trabajadores quiere saber qué porcentaje está satisfecho con el casino, con un error de ± 5 % y 95 % de confianza. ¿A cuántos hay que encuestar?</p>",
      anal:"<p>Para saber si una olla de sopa está salada no hay que tomársela entera: basta una cucharada, si está bien revuelta. La pregunta es cuántas cucharadas necesitas para estar seguro.</p>",
      terms:[["Población (N)", "Todos los casos de interés."], ["Muestra (n)", "Los casos que se revisan."], ["Error máximo (e)", "Cuánto puede alejarse la estimación del valor real."], ["Confianza", "Probabilidad de que el intervalo contenga el valor real."], ["z", "Valor normal de la confianza: 90 % → 1,645; 95 % → 1,96; 99 % → 2,576."], ["p", "Proporción esperada (0,5 si no se sabe)."]] },
    adv:"<p><b>Para estimar una media:</b> n₀ = (z · σ ÷ e)², con σ estimada de un piloto. <b>Muestreo estratificado:</b> si la población tiene grupos distintos (turnos, plantas), se muestrea cada uno en proporción para mejorar la precisión con el mismo n.</p>",
    sp:{ title:"Tamaño de muestra, paso a paso",
      params:[{ k:"c", l:"Confianza (90, 95 o 99)", v:95, u:"%" }, { k:"e", l:"Error máximo", v:5, u:"%" }, { k:"N", l:"Población", v:1200, u:"" }],
      script(p){ const z = zOf(Math.round(p.c)), e = p.e / 100, n0 = z * z * 0.25 / (e * e), nn = n0 / (1 + (n0 - 1) / p.N);
        return [
          { t:"z", e:"Confianza " + Math.round(p.c) + " %  →  z = " + z, s:"Valor de la tabla normal." },
          { t:"Fórmula", e:"n₀ = z² · p(1 − p) ÷ e²", s:"Con p = 0,5 porque no sabemos el resultado (es el caso que pide más muestra)." },
          { t:"Sustituir", e:"n₀ = " + z + "² · 0,5 · 0,5 ÷ " + n(e, 3) + "² = " + n(n0, 1), h:n(n0, 1), s:"Sin considerar el tamaño de la población." },
          { t:"Corrección", e:"n = " + n(n0, 1) + " ÷ (1 + (" + n(n0, 1) + " − 1) ÷ " + n(p.N) + ") = " + n(nn, 1), h:n(nn, 1), s:"Con una población chica, se necesitan menos." },
          { t:"Redondear", e:"n = " + n(Math.ceil(nn)) + " personas", h:n(Math.ceil(nn)), s:"Siempre hacia arriba." }]; } },
    vars:[["n₀", "Muestra para población infinita", "casos", "—"], ["n", "Muestra corregida", "casos", "—"], ["N", "Tamaño de la población", "casos", "—"], ["z", "Valor normal de la confianza", "—", "1,645 a 2,576"], ["p", "Proporción esperada", "—", "0,5 si no se sabe"], ["e", "Error máximo", "fracción", "0,01 a 0,1"]],
    sup:"<ul><li>La muestra se elige al azar (si no, la fórmula no protege del sesgo).</li><li>Todas las personas responden (si hay no respuesta, hay que encuestar más).</li></ul>",
    ex:{ t:"Encuesta de satisfacción en una empresa de 1.200 trabajadores; error ± 5 %; confianza 95 %.",
      steps:[["Uso z = 1,96 y p = 0,5.", "No se conoce la proporción.", "n₀ = 1,96² × 0,25 ÷ 0,05² = 384,1.", "Sin corrección habría que encuestar 385."],
        ["Corrijo por población finita.", "La población es chica.", "n = 384,1 ÷ (1 + 383,1 ÷ 1.200) = 291,2.", "Bastan 292 personas."],
        ["Pruebo con error de 3 %.", "Ver el costo de más precisión.", "n₀ = 1.067; corregido 565.", "Bajar el error de 5 % a 3 % casi duplica la muestra."]],
      r:"encuestar a 292 trabajadores elegidos al azar. Si se espera que algunos no respondan (por ejemplo, 20 %), invitar a unos 365." },
    real:"<p>Las encuestas de opinión nacionales en Chile suelen usar del orden de 1.000 a 1.500 casos (error cercano a ± 3 %). En auditoría de inventario y en calidad se usan tablas de muestreo (como ISO 2859) que derivan de estas mismas ideas.</p>",
    sim:"ci",
    chk(){ const n0 = 1.96 * 1.96 * 0.25 / 0.0025; return [["n0", n0, 384.16], ["n", n0 / (1 + (n0 - 1) / 1200), 1200 * n0 / (1200 + n0 - 1)]]; },
    quiz:[["Si se quiere reducir el error a la mitad, la muestra:", ["Se duplica", "Se cuadruplica", "No cambia", "Baja a la mitad"], 1, "El error está al cuadrado en el denominador."],
      ["Sin información previa, la proporción que se usa es:", ["0,1", "0,5", "0,9", "1"], 1, "p(1 − p) es máximo con p = 0,5: es la opción conservadora."],
      ["Con 95 % de confianza, de 100 intervalos calculados con muestras distintas, aproximadamente cuántos contienen el valor real:", ["5", "50", "95", "100"], 2, "Eso significa la confianza."]],
    dec:"cuántos casos revisar para tener una estimación confiable al menor costo.",
    pre:["descriptiva"], rel:["descriptiva", "muestreo"] };

  CSIM.ci = { title:"Intervalos de confianza: ¿cuántos atrapan el valor real?",
    goal:"qué significa «95 % de confianza» y cómo el tamaño de muestra cambia el ancho de los intervalos.",
    params:[{ k:"nn", l:"Tamaño de la muestra", min:20, max:1000, step:10, v:292, u:"", help:"Más muestra = intervalos más angostos." }, { k:"c", l:"Confianza", min:90, max:99, step:1, v:95, fmt:v => (v >= 98 ? 99 : v >= 93 ? 95 : 90) + " %", u:"", help:"90, 95 o 99 %." }, { k:"p", l:"Proporción real (desconocida)", min:10, max:90, step:5, v:60, u:"%", help:"Lo que la encuesta intenta estimar." }],
    init(){ return { L:[], acc:0, hit:0, tot:0 }; }, onParam(s){ Object.assign(s, CSIM.ci.init()); },
    tick(s, p, dt){ s.acc += dt * 3; const c = p.c >= 98 ? 99 : p.c >= 93 ? 95 : 90, z = zOf(c); while (s.acc >= 1) { s.acc -= 1; let x = 0; for (let i = 0; i < p.nn; i++) if (Math.random() < p.p / 100) x++; const ph = x / p.nn, e = z * Math.sqrt(ph * (1 - ph) / p.nn), ok = Math.abs(ph - p.p / 100) <= e; s.L.push([ph, e, ok]); s.tot++; if (ok) s.hit++; if (s.L.length > 40) s.L.shift(); } },
    draw(g, W, H, s, p, C){ const x0 = 30, x1 = W - 20, X = v => x0 + v * (x1 - x0), rh = (H - 50) / 40;
      g.strokeStyle = C.ink; g.lineWidth = 2; g.beginPath(); g.moveTo(X(p.p / 100), 22); g.lineTo(X(p.p / 100), H - 20); g.stroke(); SIMG.text(g, "valor real " + p.p + " %", X(p.p / 100), 14, C.ink, C, "center", true);
      s.L.forEach(([ph, e, ok], i) => { const y = 28 + i * rh; g.strokeStyle = ok ? C.c1 : C.bad; g.lineWidth = 2; g.beginPath(); g.moveTo(X(Math.max(0, ph - e)), y); g.lineTo(X(Math.min(1, ph + e)), y); g.stroke(); g.fillStyle = ok ? C.c1 : C.bad; g.beginPath(); g.arc(X(ph), y, 2.5, 0, 7); g.fill(); });
      [0, 0.25, 0.5, 0.75, 1].forEach(v => SIMG.text(g, n(v * 100) + " %", X(v), H - 6, C.muted, C, "center")); },
    metrics(s, p){ const c = p.c >= 98 ? 99 : p.c >= 93 ? 95 : 90, z = zOf(c); return [["Intervalos simulados", n(s.tot)], ["Contienen el valor real", s.tot ? n(s.hit / s.tot * 100, 1) + " %" : "—"], ["Confianza teórica", c + " %"], ["Error con n = " + p.nn, "± " + n(z * Math.sqrt(0.25 / p.nn) * 100, 1) + " % (peor caso)"]]; },
    ann(s){ return "Cada línea es el intervalo de una encuesta distinta. Las rojas no atrapan el valor real: con 95 % de confianza, más o menos 1 de cada 20 falla."; },
    concl(s, p){ return "<p>De " + n(s.tot) + " encuestas simuladas, el " + (s.tot ? n(s.hit / s.tot * 100, 1) : "—") + " % de los intervalos contiene el valor real.</p><p><b>Qué demuestra:</b> la confianza es la proporción de intervalos que aciertan a la larga; el tamaño de muestra define el ancho de cada uno.</p><p><b>Qué decisión informa:</b> cuántos casos revisar según la precisión requerida.</p>"; } };

  /* ===================== REGRESIÓN LINEAL ===================== */
  const RX = [10, 15, 20, 25, 30, 35, 40, 45, 50], RY = [1250, 1610, 1980, 2210, 2690, 2950, 3420, 3590, 4100];
  const reg = (X, Y) => { const mx = mean(X), my = mean(Y), sxy = X.reduce((s, x, i) => s + (x - mx) * (Y[i] - my), 0), sxx = X.reduce((s, x) => s + (x - mx) ** 2, 0), syy = Y.reduce((s, y) => s + (y - my) ** 2, 0), b = sxy / sxx, a = my - b * mx; return { a, b, r:sxy / Math.sqrt(sxx * syy), mx, my, sxy, sxx }; };
  CRS.regresion = {
    kw:"regresion lineal correlacion minimos cuadrados pendiente intercepto r r2 coeficiente de determinacion prediccion recta",
    ess:{ pts:["Ajusta la <b>recta</b> que mejor describe cómo cambia y cuando cambia x.", "La pendiente b dice cuánto sube y por cada unidad de x; el intercepto a, cuánto vale y cuando x = 0.", "<b>r</b> (−1 a 1) mide la fuerza de la relación; <b>R²</b> dice qué porcentaje de la variación de y explica x.", "Correlación no es causalidad, y extrapolar lejos de los datos es riesgoso."],
      fx:"ŷ = a + b·x;   b = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)²;   a = ȳ − b·x̄", when:"dos variables numéricas parecen relacionadas y quieres estimar una a partir de la otra (costos, consumos, tiempos)." },
    intro:{ prob:"<p>Una planta registró su costo total para distintos niveles de producción. ¿Cuánto es el costo fijo, cuánto cuesta cada mil unidades adicionales y cuánto costaría producir 60 mil?</p>",
      anal:"<p>Si anotas cuánto gastas en bencina según los kilómetros recorridos, los puntos forman casi una línea. La pendiente es lo que gastas por kilómetro y el intercepto es lo que gastas aunque no manejes (por ejemplo, el seguro).</p>",
      terms:[["Variable independiente (x)", "La que explica (producción)."], ["Variable dependiente (y)", "La que se quiere estimar (costo)."], ["Pendiente (b)", "Cambio de y por unidad de x."], ["Intercepto (a)", "Valor de y cuando x = 0."], ["Residuo", "Diferencia entre el valor real y el de la recta."], ["r", "Coeficiente de correlación (−1 a 1)."], ["R²", "Coeficiente de determinación: % de variación explicada."]] },
    adv:"<p><b>Mínimos cuadrados:</b> la recta elegida es la que hace mínima la suma de los residuos al cuadrado. <b>Supuestos para inferencia:</b> residuos independientes, con varianza constante y aproximadamente normales; revisarlos con un gráfico de residuos. <b>Regresión múltiple:</b> varias x a la vez (producción, horas extra, temperatura).</p>",
    sp:{ title:"Recta de mínimos cuadrados, paso a paso",
      params:[{ k:"xp", l:"Producción a predecir", v:60, u:"miles" }],
      script(p){ const r = reg(RX, RY);
        return [
          { t:"Promedios", e:"x̄ = " + n(r.mx, 1) + ";   ȳ = " + n(r.my, 3), s:"Producción media (miles) y costo medio (miles $)." },
          { t:"Covarianza", e:"Σ(x − x̄)(y − ȳ) = " + n(r.sxy, 1), s:"Mide si x e y suben juntas." },
          { t:"Variación de x", e:"Σ(x − x̄)² = " + n(r.sxx, 1), s:"Cuánto varía la producción." },
          { t:"Pendiente", e:"b = " + n(r.sxy, 1) + " ÷ " + n(r.sxx, 1) + " = " + n(r.b, 4), h:n(r.b, 4), s:"Cada mil unidades más cuestan unos $ " + n(r.b, 1) + " mil: es el costo variable." },
          { t:"Intercepto", e:"a = " + n(r.my, 3) + " − " + n(r.b, 4) + " · " + n(r.mx, 1) + " = " + n(r.a, 3), h:n(r.a, 3), s:"Costo cuando no se produce: el costo fijo estimado ($ " + n(r.a) + " mil)." },
          { t:"Ecuación", e:"ŷ = " + n(r.a, 3) + " + " + n(r.b, 4) + "·x", s:"La recta de costos." },
          { t:"Ajuste", e:"r = " + n(r.r, 4) + ";   R² = " + n(r.r * r.r * 100, 2) + " %", h:"R² = " + n(r.r * r.r * 100, 2) + " %", s:"La producción explica casi toda la variación del costo." },
          { t:"Predecir", e:"ŷ(" + n(p.xp) + ") = " + n(r.a, 3) + " + " + n(r.b, 4) + " · " + n(p.xp) + " = " + n(r.a + r.b * p.xp, 1), h:n(r.a + r.b * p.xp, 1), s:p.xp > 50 ? "Ojo: " + p.xp + " está fuera del rango observado (10 a 50): es una extrapolación." : "Dentro del rango observado." }]; } },
    vars:[["x", "Variable independiente", "según el caso", "—"], ["y", "Variable dependiente", "según el caso", "—"], ["b", "Pendiente", "unidad de y por unidad de x", "—"], ["a", "Intercepto", "unidad de y", "—"], ["r", "Correlación", "—", "−1 a 1"], ["R²", "Determinación", "%", "0 a 100"], ["ŷ", "Valor estimado", "unidad de y", "—"]],
    sup:"<ul><li>La relación es aproximadamente lineal en el rango de datos.</li><li>Los residuos no tienen patrón (si forman una curva, la relación no es lineal).</li><li>Las predicciones valen dentro del rango observado.</li></ul>",
    ex:{ t:"Costo total (miles $) para producciones de 10 a 50 mil unidades: 1.250, 1.610, 1.980, 2.210, 2.690, 2.950, 3.420, 3.590 y 4.100.",
      steps:[["Calculo la pendiente.", "Es el costo variable por mil unidades.", "b = 69,87 mil $ por mil unidades.", "Cada unidad cuesta unos $ 70 de costo variable."],
        ["Calculo el intercepto.", "Es el costo fijo estimado.", "a = 548,4 mil $.", "Aunque no se produzca, hay $ 548 mil de costo fijo al período."],
        ["Calculo r y R².", "¿Qué tan buena es la recta?", "r = 0,998; R² = 99,6 %.", "La recta describe muy bien los costos."],
        ["Predigo para 60 mil unidades.", "Presupuesto.", "4.740 mil $.", "Es extrapolación (máximo observado 50): usar con cautela."]],
      r:"costo ≈ 548 + 69,9 × (miles de unidades). Para 60 mil unidades, unos $ 4,74 millones, con la advertencia de que está fuera del rango observado." },
    real:"<p>La regresión se usa para separar costos fijos y variables, estimar consumos de energía según la producción, relacionar ventas con publicidad y calibrar instrumentos. En minería, para relacionar la ley del mineral con la recuperación.</p>",
    sim:"reg",
    chk(){ const r = reg(RX, RY), q = NUC.regresion(RX.map((x, i) => [x, RY[i]])); return [["b", r.b, q.b], ["a", r.a, q.a], ["r", r.r, q.r]]; },
    quiz:[["Si r = −0,95, la relación entre x e y es:", ["Fuerte y directa", "Fuerte e inversa", "Débil", "Inexistente"], 1, "Cerca de −1: cuando x sube, y baja de forma muy consistente."],
      ["R² = 0,64 significa que:", ["x explica el 64 % de la variación de y", "y vale 64 % de x", "La pendiente es 0,64", "Hay 64 datos"], 0, "Es la proporción de variación explicada."],
      ["Ventas de helados y ahogamientos están correlacionados. Esto prueba que:", ["Los helados causan ahogamientos", "Nada sobre causalidad: ambos suben en verano", "Hay que prohibir los helados", "r es negativo"], 1, "Una tercera variable (el calor) explica ambos."]],
    dec:"estimar costos fijos y variables, presupuestar y predecir una variable a partir de otra dentro del rango conocido.",
    pre:["descriptiva"], rel:["pronosticos", "equilibrio", "descriptiva"] };

  CSIM.reg = { title:"Recta de mínimos cuadrados con residuos y ruido ajustable",
    goal:"cómo se ajusta la recta, qué son los residuos y por qué un dato atípico puede cambiar mucho el resultado.",
    params:[{ k:"nz", l:"Ruido (dispersión)", min:0, max:400, step:10, v:60, u:"miles $", help:"Más ruido = menor R²." }, { k:"out", l:"Dato atípico en x = 45", min:-1500, max:1500, step:100, v:0, u:"miles $", help:"Mueve un punto lejos de la tendencia." }],
    init(p){ return { e:RX.map(() => zr()), t:0 }; }, onParam(){}, tick(s, p, dt){ s.t = Math.min(1, s.t + dt); },
    draw(g, W, H, s, p, C){ const Y0 = RX.map(x => 548.444 + 69.8667 * x), Y = Y0.map((y, i) => y + s.e[i] * p.nz + (RX[i] === 45 ? p.out : 0)), r = reg(RX, Y), x0 = 56, x1 = W - 14, y0 = H - 30, top = 14, X = v => x0 + v / 60 * (x1 - x0), YY = v => y0 - (v + 500) / 6000 * (y0 - top);
      SIMG.axes(g, x0, y0, x1, top, C, "producción (miles)", "Costo (miles $)"); [0, 2000, 4000].forEach(v => SIMG.text(g, n(v), x0 - 4, YY(v) + 4, C.muted, C, "right")); [0, 10, 20, 30].forEach(v => SIMG.text(g, v, X(v), y0 + 14, C.muted, C, "center"));
      g.strokeStyle = C.c2; g.lineWidth = 2.5; g.beginPath(); g.moveTo(X(0), YY(r.a)); g.lineTo(X(60), YY(r.a + r.b * 60 * s.t)); g.stroke();
      RX.forEach((x, i) => { g.strokeStyle = C.bad; g.lineWidth = 1; g.beginPath(); g.moveTo(X(x), YY(Y[i])); g.lineTo(X(x), YY(r.a + r.b * x)); g.stroke(); g.fillStyle = C.c1; g.strokeStyle = C.surf; g.lineWidth = 2; g.beginPath(); g.arc(X(x), YY(Y[i]), 6, 0, 7); g.fill(); g.stroke(); });
      g.fillStyle = C.muted; g.globalAlpha = 0.12; g.fillRect(X(50), top, X(60) - X(50), y0 - top); g.globalAlpha = 1; SIMG.text(g, "extrapolación", X(55), top + 12, C.muted, C, "center");
      SIMG.text(g, "ŷ = " + n(r.a) + " + " + n(r.b, 2) + "x   R² = " + n(r.r * r.r * 100, 1) + " %", x0 + 8, top + 14, C.ink, C, "left", true); },
    metrics(s, p){ const Y = RX.map((x, i) => 548.444 + 69.8667 * x + s.e[i] * p.nz + (x === 45 ? p.out : 0)), r = reg(RX, Y); return [["Pendiente b", n(r.b, 2)], ["Intercepto a", n(r.a, 1)], ["r", n(r.r, 4)], ["R²", n(r.r * r.r * 100, 2) + " %"], ["Predicción para 60", n(r.a + r.b * 60)]]; },
    ann(s, p){ return Math.abs(p.out) > 500 ? "El dato atípico tira la recta hacia él: un solo punto cambia la pendiente y baja el R². Antes de ajustar, revisa si ese dato es un error." : "Las líneas rojas son los residuos: la recta naranja es la que hace mínima la suma de sus cuadrados."; },
    concl(s, p){ const Y = RX.map((x, i) => 548.444 + 69.8667 * x + s.e[i] * p.nz + (x === 45 ? p.out : 0)), r = reg(RX, Y); return "<p>Con este ruido, R² = <b>" + n(r.r * r.r * 100, 1) + " %</b> y la pendiente estimada es " + n(r.b, 2) + " (la real es 69,87).</p><p><b>Qué demuestra:</b> con más dispersión la estimación es menos precisa; un dato atípico puede distorsionarla.</p><p><b>Qué decisión informa:</b> si la recta sirve para presupuestar y qué datos revisar.</p>"; } };
})();
