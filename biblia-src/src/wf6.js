/* ============ CURSO · Módulo Calidad ============
   Referencias (calculadoras, datos por defecto): X̄-R: X̿ = 10,055; R̄ = 0,325; LSC/LIC X̄ = 10,2425 / 9,8675; LSC R = 0,687; subgrupo 6 fuera.
   p: p̄ = 128/3.000 = 4,27 %; muestra 7 fuera (9,5 % > 8,55 %). Capacidad: Cp 1,333; Cpk 1,156; 266 PPM.
   Sigma: DPMO 6.889; 3,96σ. Pareto: 3 de 7 causas explican 80,7 %. AMEF: NPR máx 196 (sensor), 5 de 6 ≥ 100. */
(function(){
  const n = crsNum, zr = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const Phi = z => { const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2), p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
  const zinv = p => { let lo = -8, hi = 8; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; Phi(m) < p ? lo = m : hi = m; } return (lo + hi) / 2; };

  /* ===================== CARTA X̄-R ===================== */
  const XG = ["10.2 9.9 10.1 10.0 10.3", "9.8 10.1 10.0 10.2 9.9", "10.1 10.0 9.9 10.3 10.1", "10.0 10.2 10.1 9.8 10.0", "9.9 10.0 10.2 10.1 10.0", "10.3 10.4 10.2 10.5 10.3", "10.0 9.9 10.1 10.0 10.2", "10.1 10.0 9.8 10.0 9.9", "9.9 10.1 10.0 10.2 10.1", "10.0 10.1 9.9 10.0 10.0", "10.2 10.0 10.1 9.9 10.1", "9.8 10.0 10.1 10.0 9.9"].map(r => r.split(" ").map(Number));
  const xrCalc = G => { const xb = G.map(r => r.reduce((a, b) => a + b, 0) / r.length), R = G.map(r => Math.max(...r) - Math.min(...r)), X = xb.reduce((a, b) => a + b, 0) / xb.length, Rb = R.reduce((a, b) => a + b, 0) / R.length; return { xb, R, X, Rb, lsc:X + 0.577 * Rb, lic:X - 0.577 * Rb, lscR:2.114 * Rb }; };
  const weRules = (pts, c, s) => { const out = []; pts.forEach((v, i) => { const z = (v - c) / s; if (Math.abs(z) > 3) out.push([i, "Regla 1: un punto fuera de los límites"]);
      if (i >= 2) { const w = pts.slice(i - 2, i + 1).map(x => (x - c) / s); [1, -1].forEach(sg => { if (w.filter(z2 => z2 * sg > 2).length >= 2) out.push([i, "Regla 2: 2 de 3 puntos más allá de 2σ del mismo lado"]); }); }
      if (i >= 4) { const w = pts.slice(i - 4, i + 1).map(x => (x - c) / s); [1, -1].forEach(sg => { if (w.filter(z2 => z2 * sg > 1).length >= 4) out.push([i, "Regla 3: 4 de 5 puntos más allá de 1σ del mismo lado"]); }); }
      if (i >= 7) { const w = pts.slice(i - 7, i + 1).map(x => x - c); if (w.every(x => x > 0) || w.every(x => x < 0)) out.push([i, "Regla 4: 8 puntos seguidos del mismo lado de la línea central"]); } }); return out; };
  CRS["control-xr"] = {
    kw:"control estadistico de procesos spc grafico de control carta xbarra r xr limites de control western electric causas asignables shewhart",
    ess:{ pts:["Una carta de control separa la variación <b>normal</b> del proceso (causas comunes) de la variación <b>anormal</b> (causas asignables).", "La carta X̄ vigila el promedio; la carta R, la dispersión, con subgrupos de 2 a 10 piezas.", "Límites: X̿ ± A₂·R̄. Se calculan con datos del proceso, no con las especificaciones.", "Un punto fuera o un patrón (reglas de Western Electric) indica que algo cambió: hay que investigar."],
      fx:"LSC, LIC de X̄ = X̿ ± A₂·R̄;   LSC de R = D₄·R̄;   LIC de R = D₃·R̄", when:"un proceso repetitivo produce una característica medible (peso, diámetro, temperatura) y quieres detectar cambios a tiempo." },
    intro:{ prob:"<p>Una envasadora llena bolsas de 10 kg. Cada hora se pesan 5 bolsas. Algunos promedios salen 10,1 y otros 9,9: ¿es normal o algo se desajustó? Ajustar la máquina cada vez que un número cambia empeora las cosas.</p>",
      anal:"<p>Tu tiempo de viaje al trabajo varía todos los días unos minutos (variación normal). Pero si un día demoras el doble, algo pasó (un choque, un corte): eso es una causa asignable. La carta de control te dice cuándo preocuparte y cuándo no.</p>",
      terms:[["Subgrupo", "Pequeña muestra tomada al mismo tiempo (por ejemplo, 5 bolsas cada hora)."], ["X̄ (equis barra)", "Promedio de un subgrupo."], ["R (rango)", "Máximo − mínimo del subgrupo."], ["X̿", "Promedio de los promedios: línea central."], ["R̄", "Promedio de los rangos."], ["A₂, D₃, D₄", "Constantes de tabla según el tamaño del subgrupo (n = 5: A₂ = 0,577; D₃ = 0; D₄ = 2,114)."], ["Causa asignable", "Algo específico que cambió el proceso (desgaste, material nuevo, operario)."]] },
    adv:"<p><b>Fase I y fase II.</b> En la fase I se calculan los límites con datos históricos y se eliminan los subgrupos con causa asignable (aquí el 6). En la fase II los límites quedan fijos y se vigila el proceso en tiempo real.</p><p><b>Límites de control ≠ especificaciones.</b> Un proceso puede estar bajo control y aun así producir fuera de especificación (proceso no capaz), o tener puntos fuera de control dentro de especificación. Por eso se complementa con el análisis de capacidad.</p><p><b>σ estimada</b> = R̄ ÷ d₂ (d₂ = 2,326 para n = 5): 0,1397 en el ejemplo.</p>",
    sp:{ title:"Límites de control X̄-R, paso a paso",
      params:[],
      script(){ const r = xrCalc(XG);
        return [
          { t:"Datos", e:"12 subgrupos de n = 5 pesos (kg)", s:"Cada fila son 5 bolsas pesadas en la misma hora." },
          { t:"Promedio y rango", e:"Subgrupo 1: X̄ = (10,2 + 9,9 + 10,1 + 10,0 + 10,3) ÷ 5 = 10,10;   R = 10,3 − 9,9 = 0,4", h:"X̄ = (10,2 + 9,9 + 10,1 + 10,0 + 10,3) ÷ 5 = 10,10", s:"Se repite para los 12 subgrupos." },
          { t:"Línea central", e:"X̿ = Σ X̄ ÷ 12 = " + n(r.X, 4) + ";   R̄ = Σ R ÷ 12 = " + n(r.Rb, 4), h:"X̿ = Σ X̄ ÷ 12 = " + n(r.X, 4), s:"Promedio de promedios y promedio de rangos." },
          { t:"Límites X̄", e:"X̿ ± A₂·R̄ = " + n(r.X, 4) + " ± 0,577 · " + n(r.Rb, 4) + " = " + n(r.lic, 4) + " a " + n(r.lsc, 4), h:n(r.lic, 4) + " a " + n(r.lsc, 4), s:"A₂ = 0,577 para subgrupos de 5." },
          { t:"Límites R", e:"LSC = D₄·R̄ = 2,114 · " + n(r.Rb, 4) + " = " + n(r.lscR, 4) + ";   LIC = 0", s:"Con n ≤ 6, D₃ = 0: el rango no tiene límite inferior." },
          { t:"Revisar", e:"Subgrupo 6: X̄ = " + n(r.xb[5], 2) + " > " + n(r.lsc, 4), h:n(r.xb[5], 2) + " > " + n(r.lsc, 4), s:"Fuera de control: hay que buscar qué pasó en esa hora (por ejemplo, cambio de bobina)." },
          { t:"Fase I", e:"Se elimina el subgrupo 6 y se recalculan los límites", s:"Así los límites representan el proceso sin causas asignables." }]; } },
    vars:[["n", "Tamaño del subgrupo", "piezas", "2 a 10 (típico 4 o 5)"], ["X̄ᵢ", "Promedio del subgrupo i", "unidad medida", "—"], ["Rᵢ", "Rango del subgrupo i", "unidad medida", "—"], ["X̿", "Promedio de los X̄", "unidad medida", "—"], ["R̄", "Promedio de los rangos", "unidad medida", "—"], ["A₂", "Constante para límites de X̄", "—", "n = 5: 0,577"], ["D₃, D₄", "Constantes para límites de R", "—", "n = 5: 0 y 2,114"], ["σ̂", "Desviación estimada = R̄ ÷ d₂", "unidad medida", "—"]],
    sup:"<ul><li>Las mediciones son confiables (sistema de medición validado).</li><li>Los subgrupos son racionales: tomados en condiciones homogéneas.</li><li>La característica es aproximadamente normal (el promedio X̄ ayuda por el teorema central del límite).</li><li>Al menos 20 a 25 subgrupos para fijar límites confiables.</li></ul>",
    ex:{ t:"Peso de bolsas de 10 kg: 12 subgrupos de 5 bolsas, una vez por hora.",
      steps:[["Calculo X̄ y R de cada subgrupo.", "Resumen de cada hora.", "Por ejemplo, subgrupo 1: X̄ = 10,10, R = 0,4.", "Cada punto de la carta es una hora de producción."],
        ["Calculo X̿ y R̄.", "Centro de las cartas.", "X̿ = 10,055 kg; R̄ = 0,325 kg.", "El proceso llena en promedio 55 g de más."],
        ["Calculo los límites.", "Separan variación normal de anormal.", "X̄: 9,8675 a 10,2425; R: 0 a 0,687.", "Mientras los puntos estén dentro y sin patrones, no se toca la máquina."],
        ["Reviso los puntos.", "Detectar causas asignables.", "Subgrupo 6 (X̄ = 10,34) fuera del límite superior.", "Se investiga la hora 6 (cambio de material, ajuste) antes de usar la carta."]],
      r:"el proceso tuvo una causa asignable en el subgrupo 6. Se investiga, se elimina ese subgrupo y se recalculan los límites para la vigilancia diaria." },
    real:"<p>Las cartas de control nacieron con Walter Shewhart en los Bell Labs (1924). Hoy se usan en llenado de alimentos, en el espesor de láminas, en la ley de concentrado en minería y en tiempos de atención en servicios. Muchas plantas tienen las cartas en pantallas junto a la máquina.</p>",
    sim:"xr",
    chk(){ const r = xrCalc(XG); return [["X̿", r.X, 10.055], ["R̄", r.Rb, 0.325], ["LSC", r.lsc, 10.2425250]]; },
    quiz:[["Un punto de la carta X̄ cae fuera del límite superior. Lo correcto es:", ["Ajustar la máquina de inmediato sin investigar", "Investigar la causa asignable de ese momento", "Ignorarlo", "Cambiar los límites"], 1, "La carta avisa; la acción depende de encontrar la causa."],
      ["Los límites de control se calculan con:", ["Las especificaciones del cliente", "Los datos del propio proceso", "La meta de producción", "El costo"], 1, "Representan lo que el proceso hace de forma natural."],
      ["Ocho puntos seguidos sobre la línea central, todos dentro de los límites, indican:", ["Proceso perfecto", "Un posible corrimiento de la media (regla 4)", "Error de medición seguro", "Nada"], 1, "Es muy improbable por azar: probablemente cambió la media."]],
    dec:"cuándo intervenir un proceso y cuándo dejarlo tranquilo, evitando ajustes innecesarios.",
    pre:["descriptiva"], rel:["control-p", "capacidad", "sim-estadistica"] };

  CSIM.xr = { title:"Carta X̄ en vivo con zonas y reglas de Western Electric",
    goal:"cómo se ven la variación normal y un cambio real del proceso, y cómo las reglas detectan corrimientos antes de que un punto salga de los límites.",
    params:[{ k:"sh", l:"Corrimiento de la media", min:0, max:0.3, step:0.01, v:0, u:"kg", help:"Simula un desajuste de la máquina después del subgrupo 20." },
      { k:"sm", l:"Variabilidad (× σ normal)", min:0.5, max:2.5, step:0.1, v:1, u:"×", help:"Más variabilidad = puntos más dispersos." }],
    init(){ return { pts:[], acc:0 }; }, onParam(s){ s.pts = s.pts.slice(0, 20); },
    tick(s, p, dt){ s.acc += dt * 2.5; while (s.acc >= 1) { s.acc -= 1; const k = s.pts.length, mu = 10.055 + (k >= 20 ? p.sh : 0), sg = 0.1397 * p.sm; let m = 0; for (let j = 0; j < 5; j++) m += mu + sg * zr(); s.pts.push(m / 5); if (s.pts.length > 60) s.pts.splice(20, 1); } },
    draw(g, W, H, s, p, C){ const c = 10.055, se = 0.1397 / Math.sqrt(5), x0 = 54, x1 = W - 70, top = 16, y0 = H - 26, lo = c - 4.5 * se, hi = c + 4.5 * se, Y = v => y0 - (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * (y0 - top), X = i => x0 + i / 60 * (x1 - x0);
      [[3, C.bad, "LSC"], [2, C.c2, "2σ"], [1, C.muted, "1σ"], [0, C.ink, "X̿"], [-1, C.muted, "−1σ"], [-2, C.c2, "−2σ"], [-3, C.bad, "LIC"]].forEach(([z, col, lab]) => { g.strokeStyle = col; g.lineWidth = z === 0 ? 1.6 : 1; g.setLineDash(Math.abs(z) === 3 || z === 0 ? [] : [4, 4]); g.beginPath(); g.moveTo(x0, Y(c + z * se)); g.lineTo(x1, Y(c + z * se)); g.stroke(); g.setLineDash([]); SIMG.text(g, lab + " " + n(c + z * se, 3), x1 + 4, Y(c + z * se) + 4, C.ink, C, "left"); });
      g.strokeStyle = C.muted; g.setLineDash([2, 4]); g.beginPath(); g.moveTo(X(20), top); g.lineTo(X(20), y0); g.stroke(); g.setLineDash([]); SIMG.text(g, "fase II", X(20) + 4, top + 10, C.muted, C, "left");
      const al = new Set(weRules(s.pts, c, se).map(a => a[0]));
      g.strokeStyle = C.c1; g.lineWidth = 1.5; g.beginPath(); s.pts.forEach((v, i) => i ? g.lineTo(X(i), Y(v)) : g.moveTo(X(i), Y(v))); g.stroke();
      s.pts.forEach((v, i) => { g.fillStyle = al.has(i) ? C.bad : C.c1; g.beginPath(); g.arc(X(i), Y(v), al.has(i) ? 5 : 3, 0, 7); g.fill(); }); },
    metrics(s, p){ const al = weRules(s.pts, 10.055, 0.1397 / Math.sqrt(5)); return [["Subgrupos", n(s.pts.length)], ["Límites X̄", "9,868 a 10,243 kg"], ["Alertas", n(new Set(al.map(a => a[0])).size)], ["Última alerta", al.length ? "subgrupo " + (al[al.length - 1][0] + 1) : "ninguna"]]; },
    ann(s, p){ const al = weRules(s.pts, 10.055, 0.1397 / Math.sqrt(5)); return al.length ? al[al.length - 1][1] + " (subgrupo " + (al[al.length - 1][0] + 1) + ")." : p.sh > 0 ? "Hay un corrimiento desde el subgrupo 20; espera: las reglas lo detectarán." : "Solo variación normal: los puntos suben y bajan al azar dentro de los límites."; },
    concl(s, p){ return "<p>" + (p.sh > 0 ? "Con un corrimiento de " + n(p.sh, 2) + " kg, las reglas de zonas suelen detectarlo antes que la regla del punto fuera de límites." : "Sin corrimiento, aparecen pocas alertas falsas (con 4 reglas, alrededor de 1 cada 90 puntos).") + "</p><p><b>Qué demuestra:</b> la variación normal no se corrige; un cambio real deja huellas (puntos fuera, rachas, tendencias).</p><p><b>Qué decisión informa:</b> cuándo detener y ajustar el proceso.</p>"; } };

  /* ===================== CARTA p ===================== */
  const PS = [[200, 8], [180, 6], [220, 11], [200, 7], [210, 9], [190, 5], [200, 19], [205, 8], [195, 6], [200, 10], [215, 9], [185, 7], [200, 8], [210, 6], [190, 9]];
  const pCalc = S => { const N = S.reduce((a, s) => a + s[0], 0), D = S.reduce((a, s) => a + s[1], 0), pb = D / N; return { pb, N, D, L:S.map(([nn, d]) => { const e = 3 * Math.sqrt(pb * (1 - pb) / nn); return { p:d / nn, lsc:pb + e, lic:Math.max(0, pb - e) }; }) }; };
  CRS["control-p"] = {
    kw:"grafico p carta p atributos proporcion de defectuosos fraccion defectuosa limites variables control estadistico",
    ess:{ pts:["La carta p vigila la <b>proporción de defectuosos</b> cuando cada pieza se clasifica como buena o mala.", "Línea central: p̄ = total de defectuosos ÷ total inspeccionado.", "Los límites dependen del tamaño de cada muestra: muestras grandes tienen límites más estrechos.", "Un punto sobre el LSC indica que algo empeoró en esa muestra."],
      fx:"p̄ = Σd ÷ Σn;   LSC, LIC = p̄ ± 3·√(p̄(1 − p̄) ÷ nᵢ)", when:"se inspecciona por atributos (pasa / no pasa) y el tamaño de la muestra puede variar." },
    intro:{ prob:"<p>Una línea de ensamble revisa cada día unas 200 unidades y cuenta las defectuosas: 8, 6, 11… y un día 19. ¿Fue mala suerte o algo cambió?</p>",
      anal:"<p>Si lanzas 200 monedas, a veces salen 95 caras y a veces 105: es azar. Pero si salen 140, la moneda está cargada. La carta p dice hasta dónde llega el azar.</p>",
      terms:[["d", "Defectuosos en la muestra."], ["n", "Tamaño de la muestra."], ["p", "Proporción defectuosa = d ÷ n."], ["p̄", "Proporción promedio (línea central)."], ["Atributo", "Característica que se cuenta (pasa / no pasa), no se mide."]] },
    adv:"<p>Variantes: carta <b>np</b> (número de defectuosos, con n constante), carta <b>c</b> (número de defectos por unidad, por ejemplo rayas en una puerta) y carta <b>u</b> (defectos por unidad con tamaño variable). Las de atributos necesitan muestras más grandes que las de variables para detectar el mismo cambio.</p>",
    sp:{ title:"Carta p, paso a paso",
      params:[],
      script(){ const r = pCalc(PS), e7 = 3 * Math.sqrt(r.pb * (1 - r.pb) / 200);
        return [
          { t:"Datos", e:"15 muestras de unos 200;  " + r.D + " defectuosos en " + n(r.N) + " unidades", s:"Cada muestra es un día de inspección." },
          { t:"Línea central", e:"p̄ = " + r.D + " ÷ " + n(r.N) + " = " + n(r.pb, 5) + " = " + n(r.pb * 100, 2) + " %", h:n(r.pb * 100, 2) + " %", s:"Proporción defectuosa promedio." },
          { t:"Límite (n = 200)", e:"3 · √(" + n(r.pb, 4) + " · " + n(1 - r.pb, 4) + " ÷ 200) = " + n(e7, 4), s:"Para una muestra de 200." },
          { t:"Límites", e:"LSC = " + n((r.pb + e7) * 100, 2) + " %;   LIC = máx(0; " + n((r.pb - e7) * 100, 2) + " %) = 0", h:"LSC = " + n((r.pb + e7) * 100, 2) + " %", s:"Un LIC negativo se reemplaza por 0." },
          { t:"Muestra 7", e:"p = 19 ÷ 200 = 9,50 % > " + n((r.pb + e7) * 100, 2) + " %", h:"9,50 %", s:"Fuera de control: investigar qué pasó ese día (material, operario, máquina)." }]; } },
    vars:[["dᵢ", "Defectuosos en la muestra i", "unidades", "—"], ["nᵢ", "Tamaño de la muestra i", "unidades", "50 a 500"], ["pᵢ", "Proporción defectuosa = dᵢ ÷ nᵢ", "—", "0 a 1"], ["p̄", "Proporción media", "—", "—"], ["LSCᵢ, LICᵢ", "Límites de la muestra i", "—", "LIC ≥ 0"]],
    sup:"<ul><li>Las unidades son independientes y la probabilidad de defecto es la misma (binomial).</li><li>n · p̄ ≥ 5 aproximadamente, para que la aproximación normal funcione.</li></ul>",
    ex:{ t:"15 muestras diarias de 180 a 220 unidades; en total 128 defectuosos en 3.000 unidades.",
      steps:[["Calculo p̄ = 128 ÷ 3.000.", "Línea central.", "4,27 %.", "En promedio, 4 de cada 100 salen defectuosas."],
        ["Calculo los límites para cada n.", "Cambian según el tamaño.", "Con n = 200: LSC = 8,55 %; LIC = 0.", "Con n = 220 el LSC baja a 8,35 %."],
        ["Comparo cada p con sus límites.", "Detectar causas asignables.", "Muestra 7: 9,50 % > 8,55 %.", "Ese día pasó algo distinto: investigar."]],
      r:"el proceso tiene 4,27 % de defectuosos en promedio y un día fuera de control (muestra 7) que hay que investigar." },
    real:"<p>Se usa en inspección visual (soldaduras, pintura, etiquetas), en servicios (porcentaje de pedidos con error, llamadas no resueltas) y en salud (tasa de infecciones). En retail, la proporción de pedidos con faltantes se vigila con cartas p.</p>",
    sim:"pc",
    chk(){ const r = pCalc(PS); return [["p̄", r.pb, 128 / 3000], ["LSC n=200", r.L[0].lsc, 128 / 3000 + 3 * Math.sqrt(128 / 3000 * (1 - 128 / 3000) / 200)]]; },
    quiz:[["Si la muestra crece, los límites de la carta p:", ["Se ensanchan", "Se estrechan", "No cambian", "Desaparecen"], 1, "El error estándar baja con √n."],
      ["El LIC calculado da −1,2 %. Se usa:", ["−1,2 %", "0", "p̄", "1,2 %"], 1, "Una proporción no puede ser negativa."],
      ["Una carta p es adecuada para:", ["El diámetro de un eje", "El porcentaje de envases con etiqueta mal pegada", "La temperatura de un horno", "El peso de un saco"], 1, "Es un atributo: pasa o no pasa."]],
    dec:"cuándo investigar un aumento de defectuosos y si una mejora realmente bajó la proporción.",
    pre:["control-xr"], rel:["control-xr", "pareto", "sigma"] };

  CSIM.pc = { title:"Carta p en vivo con límites que cambian según el tamaño de muestra",
    goal:"cómo el azar mueve la proporción de defectuosos y cuándo un aumento es real.",
    params:[{ k:"p", l:"Proporción real del proceso", min:1, max:12, step:0.5, v:4.3, u:"%", help:"Súbela después de unas muestras: mira cuándo aparecen puntos fuera." }, { k:"nm", l:"Tamaño de muestra", min:50, max:500, step:10, v:200, u:"u", help:"Muestras más grandes = límites más estrechos." }],
    init(){ return { pts:[], acc:0 }; },
    tick(s, p, dt){ s.acc += dt * 2.5; while (s.acc >= 1) { s.acc -= 1; let d = 0; for (let i = 0; i < p.nm; i++) if (Math.random() < p.p / 100) d++; s.pts.push([p.nm, d]); if (s.pts.length > 50) s.pts.shift(); } },
    draw(g, W, H, s, p, C){ const pb = 128 / 3000, x0 = 44, x1 = W - 12, top = 14, y0 = H - 24, mx = 0.16, Y = v => y0 - Math.min(v, mx) / mx * (y0 - top), X = i => x0 + i / 50 * (x1 - x0);
      SIMG.axes(g, x0, y0, x1, top, C, "muestra", "p"); [0, 0.04, 0.08, 0.12, 0.16].forEach(v => SIMG.text(g, n(v * 100) + " %", x0 - 4, Y(v) + 4, C.muted, C, "right"));
      SIMG.hline(g, x0, x1, Y(pb), C.ink, [], "p̄ " + n(pb * 100, 2) + " %", C);
      g.strokeStyle = C.bad; g.lineWidth = 1.2; g.beginPath(); s.pts.forEach(([nn], i) => { const l = pb + 3 * Math.sqrt(pb * (1 - pb) / nn); i ? g.lineTo(X(i), Y(l)) : g.moveTo(X(i), Y(l)); }); g.stroke();
      s.pts.forEach(([nn, d], i) => { const v = d / nn, l = pb + 3 * Math.sqrt(pb * (1 - pb) / nn), out = v > l; g.fillStyle = out ? C.bad : C.c1; g.beginPath(); g.arc(X(i), Y(v), out ? 5 : 3, 0, 7); g.fill(); }); },
    metrics(s, p){ const pb = 128 / 3000, out = s.pts.filter(([nn, d]) => d / nn > pb + 3 * Math.sqrt(pb * (1 - pb) / nn)).length; return [["Línea central p̄", "4,27 %"], ["LSC con n = " + p.nm, n((pb + 3 * Math.sqrt(pb * (1 - pb) / p.nm)) * 100, 2) + " %"], ["Proporción real", n(p.p, 1) + " %"], ["Puntos fuera", n(out) + " de " + s.pts.length]]; },
    ann(s, p){ return p.p > 6 ? "El proceso empeoró: más puntos se acercan o pasan el límite superior (línea roja)." : "Proporción cercana a la histórica: los puntos varían por azar dentro de los límites."; },
    concl(s, p){ return "<p>Con una proporción real de " + n(p.p, 1) + " % y muestras de " + p.nm + ", el límite superior está en " + n((128 / 3000 + 3 * Math.sqrt(128 / 3000 * (1 - 128 / 3000) / p.nm)) * 100, 2) + " %.</p><p><b>Qué demuestra:</b> las muestras grandes detectan antes un empeoramiento, porque sus límites son más estrechos.</p><p><b>Qué decisión informa:</b> el tamaño de muestra y cuándo investigar.</p>"; } };

  /* ===================== CAPACIDAD Cp / Cpk ===================== */
  const capCalc = p => { const cp = (p.ls - p.li) / (6 * p.s), cpu = (p.ls - p.m) / (3 * p.s), cpl = (p.m - p.li) / (3 * p.s), cpk = Math.min(cpu, cpl), ppm = (Phi((p.li - p.m) / p.s) + 1 - Phi((p.ls - p.m) / p.s)) * 1e6; return { cp, cpu, cpl, cpk, ppm }; };
  CRS.capacidad = {
    kw:"capacidad de proceso cp cpk especificaciones les lei ppm seis sigma capaz indice de capacidad",
    ess:{ pts:["La capacidad compara lo que el proceso <b>hace</b> (su variación, 6σ) con lo que el cliente <b>pide</b> (las especificaciones).", "<b>Cp</b> mide si cabe el ancho: (LES − LEI) ÷ 6σ.", "<b>Cpk</b> considera además si el proceso está centrado: la distancia a la especificación más cercana ÷ 3σ.", "Cpk ≥ 1,33 es la exigencia habitual; bajo 1, el proceso produce fuera de especificación."],
      fx:"Cp = (LES − LEI) ÷ 6σ;   Cpk = mín[(LES − μ) ÷ 3σ; (μ − LEI) ÷ 3σ]", when:"el proceso está bajo control estadístico y quieres saber si cumple las especificaciones del cliente." },
    intro:{ prob:"<p>Un eje debe medir entre 9,4 y 10,6 mm. El proceso produce ejes con media 10,08 mm y desviación 0,15 mm. ¿Cumple siempre? ¿Cuántos ejes por millón saldrán fuera?</p>",
      anal:"<p>Es como estacionar un auto en un estacionamiento: Cp dice si el auto es más angosto que el espacio; Cpk dice si además está centrado. Un auto angosto pero pegado a una línea igual puede rayarse.</p>",
      terms:[["LEI, LES", "Límites de especificación inferior y superior (los fija el cliente o el diseño)."], ["μ", "Media del proceso."], ["σ", "Desviación estándar del proceso."], ["PPM", "Partes por millón fuera de especificación."], ["Proceso centrado", "μ está en el medio de LEI y LES: entonces Cp = Cpk."]] },
    adv:"<p><b>Cp y Cpk vs Pp y Ppk:</b> los primeros usan la variación de corto plazo (dentro de los subgrupos, R̄ ÷ d₂); los segundos, la variación total de largo plazo. Si Ppk es mucho menor que Cpk, el proceso se mueve entre subgrupos.</p><p><b>Relación con sigma:</b> Cpk = 1,33 equivale a 4σ y Cpk = 2 a «seis sigma».</p>",
    sp:{ title:"Cp, Cpk y PPM, paso a paso",
      params:[{ k:"m", l:"Media μ", v:10.08, u:"mm" }, { k:"s", l:"Desviación σ", v:0.15, u:"mm" }, { k:"li", l:"LEI", v:9.4, u:"mm" }, { k:"ls", l:"LES", v:10.6, u:"mm" }],
      script(p){ const r = capCalc(p);
        return [
          { t:"Cp", e:"Cp = (" + n(p.ls, 2) + " − " + n(p.li, 2) + ") ÷ (6 · " + n(p.s, 3) + ") = " + n(r.cp, 3), h:n(r.cp, 3), s:"Compara el ancho permitido con el ancho natural del proceso (6σ)." },
          { t:"Cpu", e:"(LES − μ) ÷ 3σ = (" + n(p.ls, 2) + " − " + n(p.m, 2) + ") ÷ " + n(3 * p.s, 3) + " = " + n(r.cpu, 3), s:"Distancia al límite superior en unidades de 3σ." },
          { t:"Cpl", e:"(μ − LEI) ÷ 3σ = (" + n(p.m, 2) + " − " + n(p.li, 2) + ") ÷ " + n(3 * p.s, 3) + " = " + n(r.cpl, 3), s:"Distancia al límite inferior." },
          { t:"Cpk", e:"Cpk = mín(" + n(r.cpu, 3) + "; " + n(r.cpl, 3) + ") = " + n(r.cpk, 3), h:n(r.cpk, 3), s:"El lado más cercano manda. Como la media está corrida hacia arriba, el límite superior es el problema." },
          { t:"PPM", e:"Fuera = Φ((LEI − μ) ÷ σ) + 1 − Φ((LES − μ) ÷ σ) = " + n(r.ppm) + " PPM", h:n(r.ppm) + " PPM", s:"Ejes por millón que saldrán fuera de especificación." },
          { t:"Dictamen", e:r.cpk >= 1.33 ? "Capaz (Cpk ≥ 1,33)" : r.cpk >= 1 ? "Apenas capaz: centrar el proceso" : "No capaz", s:"Centrar la media en " + n((p.li + p.ls) / 2, 2) + " subiría Cpk hasta Cp = " + n(r.cp, 3) + "." }]; } },
    vars:[["LEI, LES", "Límites de especificación", "unidad medida", "—"], ["μ", "Media del proceso", "unidad medida", "—"], ["σ", "Desviación del proceso", "unidad medida", "—"], ["Cp", "Capacidad potencial", "—", "≥ 1,33"], ["Cpk", "Capacidad real (con centrado)", "—", "≥ 1,33"], ["PPM", "Partes por millón fuera", "—", "—"]],
    sup:"<ul><li>El proceso está bajo control estadístico (si no, la capacidad no se puede predecir).</li><li>Los datos son aproximadamente normales.</li><li>σ se estima con suficientes datos (al menos 25 subgrupos o 100 piezas).</li></ul>",
    ex:{ t:"Ejes con especificación 9,4 a 10,6 mm; media del proceso 10,08 mm; σ = 0,15 mm.",
      steps:[["Calculo Cp = 1,2 ÷ 0,9.", "¿Cabe el proceso en la especificación?", "Cp = 1,333.", "El ancho alcanza: si estuviera centrado sería capaz."],
        ["Calculo Cpk = mín(1,156; 1,511).", "¿Está centrado?", "Cpk = 1,156.", "Está corrido hacia el límite superior."],
        ["Estimo las PPM.", "Para dimensionar el problema.", "266 por millón.", "Pocas, pero sobre la exigencia común."],
        ["Propongo centrar en 10,0 mm.", "Es más barato que reducir σ.", "Cpk subiría a 1,333.", "Con un ajuste de 0,08 mm el proceso cumple la exigencia de 1,33."]],
      r:"el proceso es apenas capaz (Cpk 1,156) por estar descentrado. Centrar la media en 10,0 mm lo lleva a 1,333." },
    real:"<p>La industria automotriz exige Cpk ≥ 1,67 en características críticas para aprobar piezas de proveedores (PPAP). En minería y alimentos se usa para leyes de concentrado, humedad y peso neto.</p>",
    sim:"cap",
    chk(){ const r = capCalc({ m:10.08, s:0.15, li:9.4, ls:10.6 }); return [["Cp", r.cp, 1.3333333333333326], ["Cpk", r.cpk, 1.1555555555555557]]; },
    quiz:[["Un proceso tiene Cp = 1,5 y Cpk = 0,8. Significa que:", ["Es muy variable", "Cabría en la especificación, pero está descentrado", "Es perfecto", "No se puede calcular"], 1, "Cp alto = ancho suficiente; Cpk bajo = media mal ubicada."],
      ["Si el proceso está exactamente centrado:", ["Cp > Cpk", "Cp = Cpk", "Cp < Cpk", "Cpk = 0"], 1, "Ambas distancias a los límites son iguales."],
      ["Para subir Cp hay que:", ["Mover la media", "Reducir la variación (σ)", "Cambiar el operador", "Agregar inspección"], 1, "Cp solo depende de σ y del ancho de la especificación."]],
    dec:"si un proceso puede cumplir lo que pide el cliente, y si conviene centrarlo o reducir su variación.",
    pre:["control-xr", "descriptiva"], rel:["sigma", "control-xr"] };

  CSIM.cap = { title:"Campana del proceso frente a los límites de especificación",
    goal:"la diferencia entre ancho (Cp) y centrado (Cpk), y cuántas piezas quedan fuera según dónde esté la campana.",
    params:[{ k:"m", l:"Media μ", min:9.6, max:10.4, step:0.01, v:10.08, u:"mm", help:"Centra la campana: mira cómo sube Cpk." }, { k:"s", l:"Desviación σ", min:0.05, max:0.3, step:0.005, v:0.15, u:"mm", help:"Achica la campana: sube Cp." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt); },
    draw(g, W, H, s, p, C){ const li = 9.4, ls = 10.6, x0 = 20, x1 = W - 20, y0 = H - 30, top = 20, lo = 9, hi = 11, X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0), pk = 1 / (p.s * Math.sqrt(2 * Math.PI)), Y = d => y0 - d / pk * 0.85 * (y0 - top - 10) * s.t;
      g.save(); g.beginPath(); g.rect(x0, top, x1 - x0, y0 - top); g.clip();
      [[lo, li], [ls, hi]].forEach(([a, b]) => { g.fillStyle = C.bad; g.globalAlpha = 0.35; g.beginPath(); g.moveTo(X(a), y0); for (let v = a; v <= b; v += 0.005) g.lineTo(X(v), Y(Math.exp(-0.5 * ((v - p.m) / p.s) ** 2) / (p.s * Math.sqrt(2 * Math.PI)))); g.lineTo(X(b), y0); g.closePath(); g.fill(); g.globalAlpha = 1; });
      g.strokeStyle = C.c1; g.lineWidth = 2.5; g.beginPath(); for (let v = lo; v <= hi; v += 0.005) { const y = Y(Math.exp(-0.5 * ((v - p.m) / p.s) ** 2) / (p.s * Math.sqrt(2 * Math.PI))); v === lo ? g.moveTo(X(v), y) : g.lineTo(X(v), y); } g.stroke(); g.restore();
      [[li, "LEI 9,4"], [ls, "LES 10,6"]].forEach(([v, t]) => { g.strokeStyle = C.bad; g.lineWidth = 2; g.beginPath(); g.moveTo(X(v), top); g.lineTo(X(v), y0); g.stroke(); SIMG.text(g, t, X(v), top - 6, C.ink, C, "center", true); });
      g.strokeStyle = C.muted; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(X(10), top); g.lineTo(X(10), y0); g.stroke(); g.setLineDash([]); SIMG.text(g, "centro 10,0", X(10), y0 + 16, C.muted, C, "center");
      g.strokeStyle = C.ink; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y0); g.stroke(); SIMG.text(g, "μ = " + n(p.m, 2), X(p.m), y0 - 6 - (y0 - top) * 0.1, C.ink, C, "center", true); },
    metrics(s, p){ const r = capCalc({ ...p, li:9.4, ls:10.6 }); return [["Cp", n(r.cp, 3)], ["Cpk", n(r.cpk, 3)], ["PPM fuera", n(r.ppm)], ["Dictamen", r.cpk >= 1.33 ? "Capaz" : r.cpk >= 1 ? "Apenas capaz" : "No capaz"]]; },
    ann(s, p){ const r = capCalc({ ...p, li:9.4, ls:10.6 }); return r.cp - r.cpk > 0.15 ? "La campana cabe (Cp " + n(r.cp, 2) + ") pero está corrida: la cola que cruza un límite (zona roja) produce piezas malas." : r.cp < 1 ? "La campana es más ancha que la especificación: aunque se centre, habrá piezas fuera. Hay que reducir σ." : "Proceso centrado: Cp y Cpk casi iguales."; },
    concl(s, p){ const r = capCalc({ ...p, li:9.4, ls:10.6 }); return "<p>Cp = <b>" + n(r.cp, 3) + "</b>, Cpk = <b>" + n(r.cpk, 3) + "</b>, " + n(r.ppm) + " piezas por millón fuera de especificación.</p><p><b>Qué demuestra:</b> Cp depende solo del ancho; Cpk, del ancho y del centrado. Centrar suele ser más barato que reducir la variación.</p><p><b>Qué decisión informa:</b> si el proceso cumple y qué mejorar primero.</p>"; } };

  /* ===================== NIVEL SIGMA ===================== */
  const sigCalc = p => { const dpo = p.d / (p.u * p.o), sig = zinv(1 - dpo) + 1.5; return { dpu:p.d / p.u, dpo, dpmo:dpo * 1e6, sig, y:(1 - dpo) * 100, fty:Math.exp(-p.d / p.u) * 100 }; };
  CRS.sigma = {
    kw:"nivel sigma seis sigma six sigma dpmo dpu defectos por millon de oportunidades rendimiento desplazamiento 1,5 sigma",
    ess:{ pts:["El nivel sigma mide la calidad en <b>defectos por millón de oportunidades</b> (DPMO).", "Una oportunidad es cada lugar donde puede aparecer un defecto en una unidad.", "Seis sigma = 3,4 DPMO (con el desplazamiento convencional de 1,5σ).", "Permite comparar procesos muy distintos con una misma escala."],
      fx:"DPMO = Defectos ÷ (Unidades × Oportunidades) × 10⁶;   Nivel σ = Φ⁻¹(1 − DPO) + 1,5", when:"quieres medir y comparar la calidad de procesos con distintas complejidades." },
    intro:{ prob:"<p>Se inspeccionaron 4.500 formularios con 6 campos cada uno y se encontraron 186 errores. ¿Qué tan bueno es el proceso comparado con otro que arma motores?</p>",
      anal:"<p>Es como comparar a dos estudiantes: uno se equivoca en 3 preguntas de una prueba de 10 y otro en 3 de 100. Hay que dividir por las «oportunidades» de equivocarse.</p>",
      terms:[["Defecto", "Cualquier falla respecto del requisito."], ["Oportunidad", "Lugar o característica donde puede haber un defecto."], ["DPU", "Defectos por unidad."], ["DPMO", "Defectos por millón de oportunidades."], ["Desplazamiento 1,5σ", "Convención que supone que la media se mueve a largo plazo."]] },
    adv:"<p>Tabla de referencia (con 1,5σ): 3σ ≈ 66.807 DPMO, 4σ ≈ 6.210, 5σ ≈ 233, 6σ ≈ 3,4. La metodología DMAIC (definir, medir, analizar, mejorar, controlar) es el camino de mejora de Seis Sigma.</p>",
    sp:{ title:"Nivel sigma, paso a paso",
      params:[{ k:"d", l:"Defectos", v:186, u:"" }, { k:"u", l:"Unidades", v:4500, u:"" }, { k:"o", l:"Oportunidades por unidad", v:6, u:"" }],
      script(p){ const r = sigCalc(p);
        return [
          { t:"DPU", e:"DPU = " + p.d + " ÷ " + n(p.u) + " = " + n(r.dpu, 4), s:"Defectos por unidad." },
          { t:"DPO", e:"DPO = " + p.d + " ÷ (" + n(p.u) + " × " + p.o + ") = " + n(r.dpo, 6), h:n(r.dpo, 6), s:"Defectos por oportunidad." },
          { t:"DPMO", e:"DPMO = " + n(r.dpo, 6) + " × 1.000.000 = " + n(r.dpmo), h:n(r.dpmo), s:"Por millón de oportunidades." },
          { t:"Nivel σ", e:"σ = Φ⁻¹(1 − " + n(r.dpo, 6) + ") + 1,5 = " + n(r.sig - 1.5, 3) + " + 1,5 = " + n(r.sig, 2), h:n(r.sig, 2), s:"Φ⁻¹ es la inversa de la normal; se suma 1,5 por convención." },
          { t:"Rendimiento", e:"Rendimiento = 1 − DPO = " + n(r.y, 3) + " %;  al primer intento ≈ e^−DPU = " + n(r.fty, 2) + " %", s:"Proporción de formularios sin ningún error." }]; } },
    vars:[["D", "Defectos encontrados", "—", "—"], ["U", "Unidades inspeccionadas", "—", "—"], ["O", "Oportunidades por unidad", "—", "—"], ["DPO", "D ÷ (U·O)", "—", "—"], ["DPMO", "DPO × 10⁶", "—", "—"], ["σ", "Nivel sigma de corto plazo", "—", "1 a 6"]],
    sup:"<ul><li>Las oportunidades deben definirse de forma honesta (no inflarlas para mejorar el número).</li><li>El 1,5σ es una convención, no una ley.</li></ul>",
    ex:{ t:"4.500 formularios, 6 campos cada uno, 186 errores.",
      steps:[["Calculo DPO = 186 ÷ 27.000.", "Normaliza por oportunidades.", "0,006889.", "Uno de cada 145 campos tiene error."],
        ["Convierto a DPMO.", "Escala estándar.", "6.889 DPMO.", "Similar a un proceso de 4σ (6.210)."],
        ["Calculo el nivel sigma.", "Para comparar.", "3,96σ.", "Llegar a 5σ exige bajar los errores casi 30 veces."]],
      r:"el proceso opera a 3,96σ (6.889 DPMO). El 96 % de los formularios sale sin errores al primer intento." },
    real:"<p>Motorola y General Electric popularizaron Seis Sigma en los 80 y 90. Hoy bancos, aseguradoras, hospitales y manufactura forman «green belts» y «black belts» que dirigen proyectos DMAIC con metas en DPMO.</p>",
    sim:"sig",
    chk(){ const r = sigCalc({ d:186, u:4500, o:6 }); return [["DPMO", r.dpmo, 186 / 27000 * 1e6]]; },
    quiz:[["Con 50 defectos en 1.000 unidades de 10 oportunidades, el DPMO es:", ["50.000", "5.000", "500", "50"], 1, "50 ÷ 10.000 × 10⁶ = 5.000."],
      ["Seis sigma corresponde aproximadamente a:", ["3,4 DPMO", "66.807 DPMO", "1 % de defectos", "0 defectos"], 0, "Con el desplazamiento de 1,5σ."],
      ["¿Por qué se divide por oportunidades?", ["Para inflar el resultado", "Para comparar procesos de distinta complejidad", "Porque lo exige la ISO", "No se divide"], 1, "Un producto complejo tiene más lugares donde fallar."]],
    dec:"comparar procesos, fijar metas de mejora y medir proyectos Seis Sigma.",
    rel:["capacidad", "pareto", "mejora-continua"] };

  CSIM.sig = { title:"Escala sigma: de defectos por millón a nivel σ",
    goal:"cómo cada nivel sigma reduce los defectos de forma exponencial y dónde está tu proceso.",
    params:[{ k:"d", l:"Defectos encontrados", min:1, max:2000, step:1, v:186, u:"", help:"Baja los defectos y mira cómo sube el nivel." }, { k:"o", l:"Oportunidades por unidad", min:1, max:20, step:1, v:6, u:"", help:"Con 4.500 unidades." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt); },
    draw(g, W, H, s, p, C){ const r = sigCalc({ d:p.d, u:4500, o:p.o }), lv = [[1, 691462], [2, 308538], [3, 66807], [4, 6210], [5, 233], [6, 3.4]], x0 = 60, x1 = W - 20, y0 = H - 30, top = 20, L = v => Math.log10(Math.max(1, v)), Y = v => y0 - L(v) / 6 * (y0 - top), X = sg => x0 + (sg - 0.5) / 6.2 * (x1 - x0);
      SIMG.axes(g, x0, y0, x1, top, C, "nivel σ", "DPMO (escala log)"); [1, 10, 100, 1000, 1e4, 1e5, 1e6].forEach(v => SIMG.text(g, n(v), x0 - 4, Y(v) + 4, C.muted, C, "right"));
      lv.forEach(([sg, d]) => { g.fillStyle = C.c1; g.globalAlpha = 0.7; g.fillRect(X(sg) - 14, Y(d * s.t + 1), 28, y0 - Y(d * s.t + 1)); g.globalAlpha = 1; SIMG.text(g, sg + "σ", X(sg), y0 + 14, C.ink, C, "center", true); });
      g.fillStyle = C.c2; g.beginPath(); g.arc(X(Math.min(6.4, r.sig)), Y(r.dpmo), 8, 0, 7); g.fill(); SIMG.text(g, "Tu proceso: " + n(r.sig, 2) + "σ (" + n(r.dpmo) + ")", X(Math.min(6.4, r.sig)) + 12, Y(r.dpmo) - 8, C.ink, C, "left", true); },
    metrics(s, p){ const r = sigCalc({ d:p.d, u:4500, o:p.o }); return [["DPMO", n(r.dpmo)], ["Nivel σ", n(r.sig, 2)], ["Rendimiento", n(r.y, 3) + " %"], ["Sin errores al primer intento", n(r.fty, 1) + " %"]]; },
    ann(s, p){ const r = sigCalc({ d:p.d, u:4500, o:p.o }); return "Cada nivel sigma reduce los defectos unas 10 a 25 veces. Para pasar de " + n(Math.floor(r.sig)) + "σ a " + n(Math.floor(r.sig) + 1) + "σ hay que mejorar mucho más que un paso lineal."; },
    concl(s, p){ const r = sigCalc({ d:p.d, u:4500, o:p.o }); return "<p>El proceso está en <b>" + n(r.sig, 2) + "σ</b> (" + n(r.dpmo) + " DPMO).</p><p><b>Qué demuestra:</b> la escala es exponencial: cada sigma adicional cuesta mucho más.</p><p><b>Qué decisión informa:</b> metas realistas de mejora y comparación entre procesos.</p>"; } };

  /* ===================== PARETO ===================== */
  const PA = [["Rayas en superficie", 142], ["Dimensión fuera de tolerancia", 87], ["Soldadura porosa", 64], ["Falta de componente", 31], ["Etiqueta mal impresa", 18], ["Golpe en embalaje", 12], ["Otros", 9]];
  CRS.pareto = {
    kw:"pareto diagrama de pareto 80 20 pocos vitales muchos triviales priorizar causas defectos",
    ess:{ pts:["Ordena causas de mayor a menor y muestra el porcentaje acumulado.", "Unos <b>pocos vitales</b> explican la mayor parte del problema (cerca del 80 %).", "Sirve para decidir <b>dónde atacar primero</b>.", "«Otros» va siempre al final, aunque sea grande."],
      fx:"% acumulado = Σ frecuencias hasta la causa ÷ total × 100", when:"hay varias causas y recursos limitados para resolverlas." },
    intro:{ prob:"<p>Una planta registró 363 defectos en un mes, de 7 tipos. No hay tiempo para atacar todos. ¿Por cuáles empezar?</p>",
      anal:"<p>En una casa con goteras, si tres de ellas mojan el 80 % del piso, reparas esas tres primero.</p>",
      terms:[["Pocos vitales", "Causas que explican la mayor parte del problema."], ["Muchos triviales", "Causas numerosas con poco impacto."], ["% acumulado", "Suma de porcentajes de mayor a menor."], ["Vilfredo Pareto", "Economista que observó la regla 80/20 en la distribución de la riqueza; Juran la aplicó a la calidad."]] },
    adv:"<p>Conviene hacer el Pareto por <b>costo</b>, no solo por frecuencia: un defecto raro pero caro puede ser el vital. También se hacen Paretos de segundo nivel (dentro de la causa vital, por máquina o turno).</p>",
    sp:{ title:"Diagrama de Pareto, paso a paso",
      params:[{ k:"c", l:"Corte de causas vitales", v:80, u:"%" }],
      script(p){ const T = PA.reduce((a, x) => a + x[1], 0); let ac = 0; const r = PA.map(x => { ac += x[1]; return [x[0], x[1], x[1] / T * 100, ac / T * 100]; }); const k = r.findIndex(x => x[3] >= p.c - 1e-9) + 1;
        return [
          { t:"Total", e:"Σ = " + PA.map(x => x[1]).join(" + ") + " = " + T, s:"Defectos del mes." },
          { t:"Ordenar", e:r.slice(0, 3).map(x => x[0] + " " + x[1]).join(" > ") + " > …", s:"De mayor a menor." },
          { t:"Porcentajes", e:r.slice(0, 3).map(x => n(x[2], 1) + " %").join(", ") + "…", s:"Cada causa sobre el total." },
          { t:"Acumulado", e:r.map(x => n(x[3], 1) + " %").slice(0, 4).join(" → ") + " → …", s:"Se va sumando." },
          { t:"Vitales", e:k + " de " + PA.length + " causas explican " + n(r[k - 1][3], 1) + " %", h:k + " de " + PA.length, s:"Esas causas son la prioridad." }]; } },
    vars:[["fᵢ", "Frecuencia (o costo) de la causa i", "casos o $", "—"], ["% i", "fᵢ ÷ total × 100", "%", "—"], ["% acumulado", "Suma desde la mayor", "%", "0 a 100"]],
    sup:"<ul><li>Las categorías son excluyentes.</li><li>El período es representativo.</li><li>«Más frecuente» no siempre es «más importante»: considera el costo.</li></ul>",
    ex:{ t:"363 defectos: rayas 142, dimensión 87, soldadura 64, falta de componente 31, etiqueta 18, golpe 12, otros 9.",
      steps:[["Ordeno y calculo porcentajes.", "Ver el peso de cada causa.", "Rayas 39,1 %, dimensión 24,0 %, soldadura 17,6 %.", "Tres causas dominan."],
        ["Calculo el acumulado.", "Ubicar el corte de 80 %.", "39,1 → 63,1 → 80,7 %.", "Las 3 primeras explican el 80,7 %."],
        ["Defino el plan.", "Priorizar.", "Proyectos de mejora para rayas, dimensión y soldadura.", "Resolver esas tres elimina 4 de cada 5 defectos."]],
      r:"atacar primero rayas, dimensión fuera de tolerancia y soldadura porosa: juntas explican el 80,7 % de los defectos." },
    real:"<p>Es una de las 7 herramientas básicas de la calidad. Se usa en reclamos de clientes, causas de paradas de máquinas, accidentes, mermas e incluso en el análisis de gastos.</p>",
    sim:"par",
    chk(){ return [["% 3 vitales", (142 + 87 + 64) / 363 * 100, 80.71625344352617]]; },
    quiz:[["En un Pareto, la categoría «Otros» se ubica:", ["Primera", "Al final", "Donde corresponda por tamaño", "Se elimina"], 1, "Agrupa causas menores, por convención va al final."],
      ["El objetivo principal del Pareto es:", ["Encontrar la causa raíz", "Priorizar dónde actuar", "Medir la capacidad", "Calcular costos"], 1, "Indica dónde está la mayor parte del problema; la causa raíz se busca después (Ishikawa, 5 porqués)."],
      ["Una causa con poca frecuencia pero altísimo costo:", ["Siempre se ignora", "Puede ser vital si el Pareto se hace por costo", "Va en «Otros»", "No existe"], 1, "Conviene hacer el Pareto por costo también."]],
    dec:"qué problemas atacar primero con recursos limitados.",
    rel:["ishikawa", "porques", "calidad-7", "abc"] };

  CSIM.par = { title:"Pareto interactivo: ¿qué pasa si eliminas la causa principal?",
    goal:"cómo se identifican los pocos vitales y cómo cambia el Pareto después de una mejora.",
    params:[{ k:"r", l:"Reducción de las rayas (mejora)", min:0, max:100, step:5, v:0, u:"%", help:"Simula un proyecto que elimina parte de la causa principal." }, { k:"c", l:"Corte de causas vitales", min:60, max:95, step:5, v:80, u:"%", help:"Umbral del acumulado." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 1.5); },
    draw(g, W, H, s, p, C){ const D = PA.map((x, i) => [x[0], i === 0 ? x[1] * (1 - p.r / 100) : x[1]]), oth = D.pop(); D.sort((a, b) => b[1] - a[1]); D.push(oth); const T = D.reduce((a, x) => a + x[1], 0) || 1;
      const x0 = 70, x1 = W - 40, y0 = H - 70, top = 16, bw = (x1 - x0) / D.length, mx = Math.max(...D.map(x => x[1]), 1); let ac = 0;
      SIMG.axes(g, x0, y0, x1, top, C, "", "Casos"); g.strokeStyle = C.c3; g.lineWidth = 2; g.beginPath();
      D.forEach((x, i) => { const h = x[1] / mx * (y0 - top - 10) * s.t, prev = ac; ac += x[1] / T; const vital = prev < p.c / 100 - 1e-9; g.fillStyle = vital ? C.c2 : C.c1; g.fillRect(x0 + i * bw + 3, y0 - h, bw - 6, h); SIMG.text(g, n(x[1]), x0 + i * bw + bw / 2, y0 - h - 4, C.ink, C, "center");
        g.save(); g.translate(x0 + i * bw + bw / 2, y0 + 8); g.rotate(-0.5); SIMG.text(g, x[0].slice(0, 16), 0, 0, C.muted, C, "right"); g.restore();
        const y = y0 - ac * (y0 - top - 10); i ? g.lineTo(x0 + (i + 0.5) * bw, y) : g.moveTo(x0 + (i + 0.5) * bw, y); }); g.stroke();
      SIMG.hline(g, x0, x1, y0 - p.c / 100 * (y0 - top - 10), C.muted, [4, 4], p.c + " %", C); SIMG.text(g, "Total " + n(T), x1, top + 4, C.ink, C, "right", true); },
    h:W => 340,
    metrics(s, p){ const D = PA.map((x, i) => [x[0], i === 0 ? x[1] * (1 - p.r / 100) : x[1]]), oth = D.pop(); D.sort((a, b) => b[1] - a[1]); D.push(oth); const T = D.reduce((a, x) => a + x[1], 0); let ac = 0, k = 0; D.forEach(x => { if (ac < p.c / 100 - 1e-9) k++; ac += x[1] / T; });
      return [["Defectos totales", n(T)], ["Causas vitales", k + " de 7"], ["Reducción total", n((1 - T / 363) * 100, 1) + " %"]]; },
    ann(s, p){ return p.r > 0 ? "Al reducir las rayas, el total baja y otra causa pasa a liderar: el Pareto se rehace después de cada mejora." : "Las barras naranjas son los pocos vitales; la línea verde es el % acumulado."; },
    concl(s, p){ return "<p>Eliminar el " + p.r + " % de las rayas reduce el total de defectos en " + n(142 * p.r / 100 / 363 * 100, 1) + " %.</p><p><b>Qué demuestra:</b> atacar la causa principal tiene el mayor impacto; después, el Pareto cambia y aparece una nueva prioridad.</p><p><b>Qué decisión informa:</b> el orden de los proyectos de mejora.</p>"; } };

  /* ===================== AMEF ===================== */
  const FM = [["Rodamiento se sobrecalienta", 8, 5, 4], ["Fuga de aceite en sello", 6, 6, 3], ["Perno mal apretado", 9, 3, 6], ["Sensor de nivel descalibrado", 7, 4, 7], ["Correa desalineada", 5, 6, 2], ["Error de etiquetado", 4, 5, 5]];
  CRS.amef = {
    kw:"amef fmea analisis de modo y efecto de falla npr rpn severidad ocurrencia deteccion riesgo prioridad",
    ess:{ pts:["El AMEF anticipa <b>cómo puede fallar</b> un producto o proceso antes de que falle.", "Cada modo de falla se califica de 1 a 10 en <b>severidad</b> (S), <b>ocurrencia</b> (O) y <b>detección</b> (D).", "NPR = S × O × D (de 1 a 1.000): prioriza las acciones.", "Una severidad de 9 o 10 exige acción aunque el NPR sea bajo."],
      fx:"NPR = S × O × D", when:"diseñas o cambias un producto o proceso y quieres prevenir fallas en vez de reaccionar." },
    intro:{ prob:"<p>Una línea de envasado tiene seis maneras conocidas de fallar. No hay presupuesto para atacarlas todas. ¿Cuáles priorizar?</p>",
      anal:"<p>Antes de un viaje largo en auto revisas: ¿qué tan grave sería que fallen los frenos (severidad)? ¿Qué tan probable es (ocurrencia)? ¿Lo notarías a tiempo (detección)? Revisas primero lo grave, probable y difícil de notar.</p>",
      terms:[["Modo de falla", "Forma en que algo puede fallar."], ["Severidad (S)", "Gravedad del efecto (10 = peligro para personas)."], ["Ocurrencia (O)", "Probabilidad de que ocurra (10 = casi seguro)."], ["Detección (D)", "Dificultad para detectarlo antes de que llegue al cliente (10 = imposible de detectar)."], ["NPR", "Número de prioridad de riesgo."]] },
    adv:"<p>Las versiones recientes (AIAG-VDA 2019) reemplazan el NPR por la <b>prioridad de acción</b> (AP): tablas que dan más peso a la severidad. Un NPR de 120 con S = 10 es más grave que un NPR de 200 con S = 4.</p>",
    sp:{ title:"NPR y prioridades, paso a paso",
      params:[{ k:"d", l:"Detección del sensor después de la acción", v:7, u:"1 a 10" }],
      script(p){ const L = FM.map((x, i) => [x[0], x[1], x[2], i === 3 ? p.d : x[3]]).map(x => [x[0], x[1] * x[2] * x[3], x[1]]).sort((a, b) => b[1] - a[1]);
        return [
          { t:"Fórmula", e:"NPR = S × O × D", s:"Tres notas de 1 a 10." },
          { t:"Ejemplo", e:"Sensor de nivel: 7 × 4 × " + p.d + " = " + 28 * p.d, h:"= " + 28 * p.d, s:"Grave, poco frecuente pero difícil de detectar." },
          { t:"Ejemplo", e:"Perno mal apretado: 9 × 3 × 6 = 162", s:"Severidad 9: exige acción aunque no sea el mayor NPR." },
          { t:"Ordenar", e:L.map(x => x[0].split(" ")[0] + " " + x[1]).join(" > "), s:"Prioridad de mayor a menor." },
          { t:"Acción", e:"NPR ≥ 100 o S ≥ 9  →  " + L.filter(x => x[1] >= 100 || x[2] >= 9).length + " modos requieren acción", s:"Umbral de la empresa (aquí 100)." }]; } },
    vars:[["S", "Severidad del efecto", "1 a 10", "—"], ["O", "Ocurrencia", "1 a 10", "—"], ["D", "Detección (10 = no se detecta)", "1 a 10", "—"], ["NPR", "S × O × D", "1 a 1.000", "umbral típico 100 a 125"]],
    sup:"<ul><li>Las escalas se definen por escrito y se aplican igual en todo el análisis.</li><li>Se hace en equipo (diseño, producción, calidad, mantención).</li><li>Después de cada acción se recalcula el NPR.</li></ul>",
    ex:{ t:"Seis modos de falla de una línea de envasado. Umbral de acción: NPR ≥ 100 o severidad ≥ 9.",
      steps:[["Calculo el NPR de cada modo.", "Cuantifica el riesgo.", "Sensor 196; perno 162; rodamiento 160; sello 108; etiquetado 100; correa 60.", "Cinco modos están sobre el umbral."],
        ["Priorizo.", "Recursos limitados.", "Sensor primero (196); perno por su severidad 9.", "El sensor es difícil de detectar (D = 7): conviene una alarma redundante."],
        ["Recalculo tras la acción (detección del sensor 7 → 2).", "Verificar el efecto.", "NPR del sensor baja a 56.", "La mejora en detección reduce el riesgo sin cambiar el equipo."]],
      r:"actuar primero sobre el sensor de nivel (NPR 196) y el perno (severidad 9). Una alarma redundante baja el NPR del sensor de 196 a 56." },
    real:"<p>El AMEF es obligatorio en la industria automotriz y aeroespacial, y se usa en dispositivos médicos, minería (AMEF de equipos críticos para mantenimiento) y en servicios (AMEF de procesos de atención).</p>",
    sim:"fm",
    chk(){ return [["NPR máx", Math.max(...FM.map(x => x[1] * x[2] * x[3])), 196]]; },
    quiz:[["Un modo de falla con S = 10, O = 2, D = 2 (NPR 40) se debe:", ["Ignorar por NPR bajo", "Atender por su severidad máxima", "Eliminar del AMEF", "Calificar de nuevo"], 1, "Una severidad de 10 (peligro) exige acción."],
      ["Para bajar la detección (D) de un modo de falla se puede:", ["Agregar un control o alarma que lo detecte antes", "Cambiar la severidad", "Ignorarlo", "Aumentar la producción"], 0, "Mejor detección = D más bajo."],
      ["El NPR máximo posible es:", ["100", "1.000", "30", "10"], 1, "10 × 10 × 10."]],
    dec:"qué riesgos atacar primero y si las acciones realmente los reducen.",
    rel:["ishikawa", "pareto", "iper"] };

  CSIM.fm = { title:"Priorización de riesgos del AMEF por NPR",
    goal:"cómo el NPR ordena los riesgos y cómo una acción sobre la detección o la ocurrencia cambia las prioridades.",
    params:[{ k:"ds", l:"Detección del sensor (D)", min:1, max:10, step:1, v:7, u:"", help:"Instala una alarma redundante: D baja." }, { k:"op", l:"Ocurrencia del perno (O)", min:1, max:10, step:1, v:3, u:"", help:"Un torque controlado baja O." }, { k:"u", l:"Umbral de acción", min:50, max:200, step:10, v:100, u:"NPR", help:"Desde este NPR se exige acción." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 1.5); },
    draw(g, W, H, s, p, C){ const L = FM.map((x, i) => ({ nm:x[0], S:x[1], O:i === 2 ? p.op : x[2], D:i === 3 ? p.ds : x[3] })).map(x => ({ ...x, R:x.S * x.O * x.D })).sort((a, b) => b.R - a.R), x0 = Math.min(190, W * 0.42), x1 = W - 40, bh = (H - 30) / L.length, X = v => x0 + v / 300 * (x1 - x0);
      L.forEach((x, i) => { const y = 10 + i * bh, act = x.R >= p.u || x.S >= 9; SIMG.text(g, x.nm.slice(0, 26), 4, y + bh * 0.55, C.ink, C, "left", act); g.fillStyle = act ? C.bad : C.c1; g.globalAlpha = act ? 0.8 : 0.6; g.fillRect(x0, y + 4, (X(x.R) - x0) * s.t, bh - 10); g.globalAlpha = 1; SIMG.text(g, x.R + (x.S >= 9 ? " (S=" + x.S + ")" : ""), X(x.R) + 4, y + bh * 0.55, C.ink, C, "left", true); });
      g.strokeStyle = C.ink; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(X(p.u), 4); g.lineTo(X(p.u), H - 16); g.stroke(); g.setLineDash([]); SIMG.text(g, "umbral " + p.u, X(p.u), H - 4, C.ink, C, "center"); },
    metrics(s, p){ const L = FM.map((x, i) => ({ S:x[1], R:x[1] * (i === 2 ? p.op : x[2]) * (i === 3 ? p.ds : x[3]) })); return [["NPR máximo", n(Math.max(...L.map(x => x.R)))], ["Modos que requieren acción", L.filter(x => x.R >= p.u || x.S >= 9).length + " de 6"], ["NPR total", n(L.reduce((a, x) => a + x.R, 0))]]; },
    ann(s, p){ return "Rojo = requiere acción (NPR ≥ umbral o severidad ≥ 9). Mejora la detección del sensor o la ocurrencia del perno y mira cómo se reordenan las prioridades."; },
    concl(s, p){ const L = FM.map((x, i) => x[1] * (i === 2 ? p.op : x[2]) * (i === 3 ? p.ds : x[3])); return "<p>NPR total del sistema: <b>" + n(L.reduce((a, b) => a + b, 0)) + "</b> (era 786).</p><p><b>Qué demuestra:</b> una acción bien elegida baja el riesgo y cambia el orden de prioridades; la severidad alta no se compensa con buen NPR.</p><p><b>Qué decisión informa:</b> el plan de acciones preventivas y su efecto esperado.</p>"; } };
})();
