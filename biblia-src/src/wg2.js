/* ============ CURSO · Lean, mejora continua, 7 herramientas de la calidad y KPI ============
   Referencias: kanban N = D·L·(1 + α) ÷ C = 400·0,5·1,1 ÷ 25 = 8,8 → 9 tarjetas. Costo de la calidad: 2,4 + 3,1 + 9,8 + 6,2 = 21,5 MM$ (4,3 % de 500 MM$).
   Disponibilidad = MTBF ÷ (MTBF + MTTR) = 120 ÷ 124 = 96,77 %; OTIF = 912 ÷ 980 = 93,06 %. */
(function(){
  const n = crsNum, bar = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, Math.min(y, y + h), w, Math.abs(h)); };
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), pick = a => a[Math.floor(Math.random() * a.length)];
  const sh = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cls = (ok, all) => { const o = sh([ok].concat(sh(all.filter(x => x !== ok)).slice(0, 3))); return { ops:o, ok:o.indexOf(ok) }; };

  /* ===================== LEAN ===================== */
  const kan = (D, L, a, C) => D * L * (1 + a) / C;
  CRS.lean = {
    kw:"lean manufacturing desperdicios muda timwoods 5s kanban pull push kaizen jidoka poka yoke tpm flujo continuo toyota",
    ess:{ pts:["Lean busca entregar lo que el cliente valora <b>eliminando desperdicios</b> (todo lo que consume recursos sin agregar valor).", "8 desperdicios (TIMWOODS): transporte, inventario, movimiento, esperas, sobreproducción, sobreprocesos, defectos y talento no aprovechado.", "<b>Pull</b>: se produce solo lo que el proceso siguiente consume; el kanban limita el inventario en proceso.", "Base: trabajo estandarizado y 5S; luego mejora continua (kaizen)."],
      fx:"N.º de kanbans = D · L · (1 + α) ÷ C;   Lead time = inventario en proceso ÷ ritmo de salida (Little)", when:"hay mucho inventario entre procesos, esperas largas o tiempos de entrega altos." },
    intro:{ prob:"<p>Una línea de armado tiene cajas de piezas acumuladas entre estaciones, el lead time es de 6 días aunque el trabajo real dura 40 minutos, y aun así se atrasan pedidos. ¿Cómo hacer fluir la producción?</p>",
      anal:"<p>En un supermercado, el reponedor no llena la góndola cuando quiere: repone lo que los clientes sacaron. Eso es un sistema pull. Si repusiera «por si acaso», el pasillo se llenaría de cajas y los productos se vencerían.</p>",
      terms:[["Valor", "Lo que el cliente está dispuesto a pagar."], ["Muda", "Desperdicio: actividad que no agrega valor."], ["Push", "Producir según un plan, aunque el siguiente proceso no lo necesite."], ["Pull", "Producir solo lo que se consume."], ["Kanban", "Tarjeta que autoriza producir o mover un contenedor."], ["WIP", "Inventario en proceso."], ["Kaizen", "Mejora continua en pasos pequeños."], ["Jidoka / poka-yoke", "Detener ante anomalías / dispositivo que evita el error."]] },
    adv:"<p><b>Ley de Little:</b> lead time = WIP ÷ ritmo de salida. Bajar el inventario en proceso, con el mismo ritmo, baja el tiempo de entrega en la misma proporción. <b>Heijunka:</b> nivelar volumen y mezcla. <b>Cuidado:</b> el pull sin estabilidad (paradas, defectos, setups largos) deja la línea sin material; primero se estabiliza con TPM, SMED y calidad en la fuente.</p>",
    sp:{ title:"Cuántas tarjetas kanban usar", params:[{ k:"D", l:"Demanda", v:400, u:"u/día" }, { k:"L", l:"Tiempo de reposición", v:0.5, u:"días" }, { k:"a", l:"Factor de seguridad", v:0.1, u:"" }, { k:"C", l:"Capacidad del contenedor", v:25, u:"u" }],
      script(p){ const N = kan(p.D, p.L, p.a, p.C);
        return [
          { t:"Consumo en la reposición", e:"D · L = " + n(p.D) + " · " + n(p.L, 2) + " = " + n(p.D * p.L) + " u", s:"Lo que se consume mientras llega el reabastecimiento." },
          { t:"Seguridad", e:n(p.D * p.L) + " · (1 + " + n(p.a, 2) + ") = " + n(p.D * p.L * (1 + p.a), 1) + " u", s:"Margen por variabilidad." },
          { t:"Contenedores", e:"N = " + n(p.D * p.L * (1 + p.a), 1) + " ÷ " + n(p.C) + " = " + n(N, 2), h:n(N, 2), s:"Contenedores necesarios." },
          { t:"Redondear", e:"N = " + Math.ceil(N) + " tarjetas", h:Math.ceil(N) + " tarjetas", s:"Hacia arriba. El inventario máximo en proceso queda en " + Math.ceil(N) * p.C + " u." },
          { t:"Mejorar", e:"Para bajar el inventario: reducir L (reposición más rápida) o α (proceso más estable)", s:"Lean quita tarjetas a medida que el proceso mejora." }]; } },
    vars:[["D", "Demanda", "u/día", "—"], ["L", "Tiempo de reposición", "días", "—"], ["α", "Factor de seguridad", "fracción", "0 a 0,2"], ["C", "Capacidad del contenedor", "u", "—"], ["N", "N.º de kanbans", "tarjetas", "entero"]],
    sup:"<ul><li>Demanda relativamente estable (si no, nivelar primero).</li><li>Proceso proveedor confiable.</li></ul>",
    ex:{ t:"Demanda 400 piezas/día; reposición 0,5 días; seguridad 10 %; contenedor de 25 piezas.",
      steps:[["Consumo durante la reposición.", "D · L.", "200 piezas.", ""], ["Agrego seguridad.", "× 1,1.", "220 piezas.", ""], ["Divido por contenedor.", "÷ 25.", "8,8 → 9 tarjetas.", "Máximo 225 piezas en proceso."]],
      r:"9 tarjetas kanban (225 piezas como máximo en proceso)." },
    real:"<p>El Sistema de Producción Toyota es el origen. En Chile se aplica en manufactura, minería (mantenimiento lean), retail (reposición pull) y salud (flujo de pacientes).</p>",
    sim:"pull",
    chk(){ return [["N", kan(400, 0.5, 0.1, 25), 8.8], ["N entero", Math.ceil(kan(400, 0.5, 0.1, 25)), 9]]; },
    quiz:[["Producir antes de que el cliente lo necesite es el desperdicio de:", ["Transporte", "Sobreproducción", "Movimiento", "Talento"], 1, "Además genera inventario y oculta problemas."], ["En un sistema pull, la producción la dispara:", ["El plan mensual", "El consumo del proceso siguiente", "La capacidad de la máquina", "El supervisor"], 1, "Se repone lo consumido."], ["Si el inventario en proceso se reduce a la mitad con el mismo ritmo de salida, el lead time:", ["Se duplica", "Se reduce a la mitad", "No cambia", "Sube un poco"], 1, "Ley de Little."]],
    dec:"cuánto inventario permitir entre procesos y qué desperdicios atacar primero.",
    rel:["vsm", "smed", "oee", "balanceo", "mejora-continua"] };

  CSIM.pull = { title:"Push vs pull: inventario en proceso y tiempo de entrega",
    goal:"por qué empujar producción llena la línea de inventario y alarga la entrega, y cómo el kanban lo limita.",
    params:[{ k:"pull", l:"Sistema", min:0, max:1, step:1, v:0, fmt:v => v ? "pull (kanban)" : "push (por plan)", u:"", help:"" }, { k:"K", l:"Tarjetas kanban por estación", min:1, max:8, step:1, v:3, u:"", help:"Solo aplica en pull." }, { k:"lam", l:"Ritmo de entrada del plan", min:8, max:14, step:1, v:12, u:"u/h", help:"La estación 3 (cuello) hace 10 u/h." }],
    init(){ return { q:[0, 0, 0], out:0, t:0, acc:[0, 0, 0, 0], hist:[] }; }, onParam(s){ Object.assign(s, this.init()); },
    tick(s, p, dt){ const h = dt * 2, cap = [12, 11, 10]; s.t += h;
      s.acc[0] += p.lam * h; while (s.acc[0] >= 1) { s.acc[0] -= 1; if (!p.pull || s.q[0] < p.K) s.q[0]++; }
      for (let k = 0; k < 3; k++) { s.acc[k + 1] += cap[k] * h * (0.75 + Math.random() * 0.5); while (s.acc[k + 1] >= 1 && s.q[k] > 0) { s.acc[k + 1] -= 1; if (k < 2) { if (p.pull && s.q[k + 1] >= p.K) break; s.q[k]--; s.q[k + 1]++; } else { s.q[k]--; s.out++; } } if (s.acc[k + 1] > 2) s.acc[k + 1] = 2; }
      s.hist.push(s.q[0] + s.q[1] + s.q[2]); if (s.hist.length > 400) s.hist.shift(); },
    draw(g, W, H, s, p, C){ const x0 = 16, bw = (W - 32) / 3, y0 = H * 0.46, mx = Math.max(10, ...s.q, p.pull ? p.K : 0) * 1.1;
      ["Corte", "Soldadura", "Pintura (cuello)"].forEach((l, k) => { const x = x0 + k * bw; bar(g, x + 8, y0, bw - 16, -(y0 - 40) * s.q[k] / mx, s.q[k] > 15 ? C.bad : C.c1); SIMG.text(g, l, x + bw / 2, y0 + 16, C.ink, C, "center", true); SIMG.text(g, s.q[k] + " u en espera", x + bw / 2, y0 + 32, C.muted, C, "center"); if (p.pull) SIMG.hline(g, x + 8, x + bw - 8, y0 - (y0 - 40) * p.K / mx, C.c2, [4, 3], "", C); });
      const gy = H - 14, gh = H * 0.24, m2 = Math.max(10, ...s.hist); g.strokeStyle = C.c3; g.lineWidth = 2; g.beginPath(); s.hist.forEach((v, i) => { const x = x0 + i / 400 * (W - 32), y = gy - v / m2 * gh; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke();
      SIMG.text(g, "Inventario total en proceso (WIP) en el tiempo", x0, gy - gh - 6, C.muted, C, "left"); SIMG.text(g, p.pull ? "- - límite kanban" : "", W - 16, 20, C.c2, C, "right", true); },
    metrics(s, p){ const wip = s.q[0] + s.q[1] + s.q[2], th = s.t > 0 ? s.out / s.t : 0; return [["WIP actual", n(wip) + " u"], ["Producción por hora", n(th, 1) + " u/h"], ["Lead time (Little)", th > 0 ? n(wip / th, 1) + " h" : "—"]]; },
    ann(s, p){ return !p.pull && p.lam > 10 ? "En push se empuja más de lo que el cuello de botella (10 u/h) puede hacer: el inventario crece sin límite y la entrega se alarga." : p.pull ? "Con kanban, cada estación produce solo si hay espacio: el inventario queda acotado y el lead time es corto, con casi la misma producción." : "Las barras son el inventario en espera antes de cada estación."; },
    concl(s, p){ return "<p>" + (p.pull ? "Con pull el WIP se mantiene bajo " + 3 * p.K + " unidades." : "En push el WIP crece si el plan supera la capacidad del cuello.") + "</p><p><b>Qué demuestra:</b> más inventario no produce más: solo alarga el tiempo de entrega (ley de Little).</p><p><b>Qué decisión informa:</b> cuántas tarjetas kanban usar y dónde está el cuello de botella.</p>"; } };

  /* ===================== MEJORA CONTINUA ===================== */
  const red = (d0, f, k) => d0 * Math.pow(1 - f, k);
  CRS["mejora-continua"] = {
    kw:"mejora continua pdca deming dmaic seis sigma 8d a3 kaizen estandarizar ciclo de mejora solucion de problemas",
    ess:{ pts:["<b>PDCA</b>: Planificar (problema, causa, plan), Hacer (probar), Verificar (medir el resultado), Actuar (estandarizar o corregir).", "<b>DMAIC</b> (Seis Sigma): Definir, Medir, Analizar, Mejorar, Controlar; para problemas complejos con datos.", "<b>8D</b> para reclamos de clientes; <b>A3</b> para resumir un problema en una hoja.", "Sin estandarizar (la «A»), las mejoras se pierden y el problema vuelve."],
      fx:"Defectos después de k ciclos ≈ d₀ · (1 − f)ᵏ   (f = fracción que elimina cada ciclo que se estandariza)", when:"un problema se repite o un indicador no mejora, y quieres un método ordenado para resolverlo." },
    intro:{ prob:"<p>Una planta tiene 8 % de piezas defectuosas. Cada mes «se hacen cosas», pero el porcentaje sube y baja sin mejorar. ¿Cómo convertir los esfuerzos en mejora sostenida?</p>",
      anal:"<p>Al aprender una receta: planificas (lees y compras), haces (cocinas), verificas (pruebas), y actúas (anotas el cambio en la receta). Si no anotas, la próxima vez repites el error.</p>",
      terms:[["PDCA", "Ciclo Planificar–Hacer–Verificar–Actuar (Deming)."], ["DMAIC", "Definir–Medir–Analizar–Mejorar–Controlar."], ["8D", "8 disciplinas para no conformidades y reclamos."], ["A3", "Informe de una hoja con el problema y su solución."], ["Estandarizar", "Dejar la mejora escrita y entrenada como el nuevo método."], ["Contención", "Medida inmediata para proteger al cliente mientras se busca la causa."]] },
    adv:"<p><b>Elegir método:</b> PDCA para mejoras del día a día; DMAIC cuando hay variabilidad y datos (proyectos de 3 a 6 meses); 8D cuando hay un cliente afectado. Todos comparten la lógica: entender el problema con datos, encontrar la causa raíz, probar, verificar y estandarizar.</p>",
    sp:{ title:"Mejora acumulada con ciclos PDCA", params:[{ k:"d", l:"Defectos iniciales", v:8, u:"%" }, { k:"f", l:"Reducción por ciclo", v:25, u:"%" }, { k:"k", l:"Ciclos", v:4, u:"" }],
      script(p){ const f = p.f / 100, D = red(p.d, f, p.k);
        return [
          { t:"Plan", e:"Problema: " + n(p.d, 1) + " % defectuosos;  meta: bajar " + p.f + " % por ciclo", s:"Se define con datos." },
          { t:"Un ciclo", e:n(p.d, 1) + " · (1 − " + n(f, 2) + ") = " + n(red(p.d, f, 1), 2) + " %", s:"Hacer, verificar y estandarizar la mejora." },
          { t:"k ciclos", e:"d = " + n(p.d, 1) + " · (1 − " + n(f, 2) + ")^" + p.k + " = " + n(D, 2) + " %", h:n(D, 2) + " %", s:"Cada ciclo parte desde el nuevo estándar." },
          { t:"Reducción total", e:"(" + n(p.d, 1) + " − " + n(D, 2) + ") ÷ " + n(p.d, 1) + " = " + n((1 - D / p.d) * 100, 1) + " %", h:n((1 - D / p.d) * 100, 1) + " %", s:"Mejoras pequeñas y sostenidas se acumulan." }]; } },
    vars:[["d₀", "Nivel inicial del problema", "%", "—"], ["f", "Reducción por ciclo", "fracción", "—"], ["k", "Ciclos completados", "—", "—"]],
    sup:"<ul><li>Cada ciclo se estandariza (si no, la mejora se pierde).</li><li>El problema se mide igual antes y después.</li></ul>",
    ex:{ t:"8 % defectuosos; cada ciclo PDCA elimina 25 % del problema que queda; 4 ciclos.",
      steps:[["Ciclo 1.", "8 × 0,75.", "6,00 %.", ""], ["Ciclos 2 a 4.", "Seguir multiplicando.", "4,50; 3,38; 2,53 %.", ""], ["Resultado.", "Acumulado.", "Reducción de 68 %.", "Sin estandarizar, el nivel volvería cerca de 8 %."]],
      r:"después de 4 ciclos estandarizados, los defectos bajan de 8 % a 2,53 %." },
    real:"<p>ISO 9001 se basa en el ciclo PDCA. Las empresas con programas de mejora continua (kaizen, Seis Sigma) llevan un tablero de proyectos con ahorros verificados por finanzas.</p>",
    sim:"pdca",
    chk(){ return [["d4", red(8, 0.25, 4), 8 * 0.31640625]]; },
    quiz:[["¿Qué etapa del PDCA se omite cuando una mejora se pierde con el tiempo?", ["Planificar", "Hacer", "Verificar", "Actuar (estandarizar)"], 3, "Sin estándar, se vuelve al método antiguo."], ["Para un reclamo de un cliente automotriz se usa típicamente:", ["8D", "Canvas", "FODA", "VAN"], 0, "Incluye contención y respuesta al cliente."], ["La etapa «Medir» de DMAIC responde:", ["¿Por qué ocurre?", "¿Cuánto y con qué frecuencia ocurre?", "¿Qué solución aplicar?", "¿Cómo mantenerlo?"], 1, "Se cuantifica la línea base."]],
    dec:"qué metodología usar y cómo sostener las mejoras.",
    rel:["porques", "ishikawa", "pareto", "lean", "calidad-7"] };

  CSIM.pdca = { title:"Ciclos de mejora: con y sin estandarizar",
    goal:"por qué la etapa «Actuar» (estandarizar) es la que convierte esfuerzos en mejora sostenida.",
    params:[{ k:"st", l:"¿Se estandariza cada mejora?", min:0, max:1, step:1, v:1, fmt:v => v ? "sí" : "no", u:"", help:"" }, { k:"f", l:"Reducción por ciclo", min:5, max:40, step:5, v:25, u:"%", help:"" }],
    init(){ return { pts:[8], lvl:8, t:0 }; }, onParam(s){ Object.assign(s, this.init()); },
    tick(s, p, dt){ s.t += dt; if (s.t < 0.35 || s.pts.length > 60) return; s.t = 0; const k = s.pts.length;
      if (k % 4 === 0) s.lvl = p.st ? s.lvl * (1 - p.f / 100) : 8 * (1 - p.f / 100); else if (!p.st) s.lvl += (8 - s.lvl) * 0.45;
      s.pts.push(Math.max(0.3, s.lvl + (Math.random() - 0.5) * 0.6)); },
    draw(g, W, H, s, p, C){ const x0 = 40, x1 = W - 14, y0 = H - 30, top = 36, X = i => x0 + i / 60 * (x1 - x0), Y = v => y0 - v / 10 * (y0 - top);
      SIMG.axes(g, x0, y0, x1, top, C, "", "% defectuoso"); [0, 4, 8].forEach(v => SIMG.text(g, v + " %", x0 - 4, Y(v) + 4, C.muted, C, "right")); for (let i = 4; i <= 60; i += 4) { g.strokeStyle = C.line; g.setLineDash([2, 4]); g.beginPath(); g.moveTo(X(i), top); g.lineTo(X(i), y0); g.stroke(); g.setLineDash([]); }
      g.strokeStyle = p.st ? C.c1 : C.bad; g.lineWidth = 2.5; g.beginPath(); s.pts.forEach((v, i) => i ? g.lineTo(X(i), Y(v)) : g.moveTo(X(i), Y(v))); g.stroke();
      SIMG.text(g, "líneas punteadas = fin de cada ciclo PDCA", x1, 18, C.muted, C, "right"); },
    metrics(s, p){ const last = s.pts[s.pts.length - 1]; return [["Semanas", n(s.pts.length - 1)], ["Defectos actuales", n(last, 2) + " %"], ["Reducción", n((1 - last / 8) * 100, 1) + " %"]]; },
    ann(s, p){ return p.st ? "Cada ciclo deja un nuevo estándar: el nivel baja como una escalera y no vuelve." : "Sin estandarizar, la mejora aparece en el ciclo y luego se pierde: el indicador vuelve a su nivel antiguo (efecto rebote)."; },
    concl(s, p){ return "<p>" + (p.st ? "Con estandarización la mejora se acumula." : "Sin estandarización, el problema vuelve una y otra vez.") + "</p><p><b>Qué demuestra:</b> el valor del PDCA está en cerrar el ciclo con un estándar.</p><p><b>Qué decisión informa:</b> exigir procedimientos, capacitación y control después de cada mejora.</p>"; } };

  /* ===================== 7 HERRAMIENTAS + COSTOS DE LA CALIDAD ===================== */
  const PAF = [2.4, 3.1, 9.8, 6.2];
  CRS["calidad-7"] = {
    kw:"7 herramientas de la calidad hoja de verificacion histograma pareto causa efecto dispersion estratificacion grafico de control costos de la calidad paf prevencion evaluacion fallas",
    ess:{ pts:["Las <b>7 herramientas</b>: hoja de verificación, histograma, Pareto, causa-efecto, dispersión, estratificación y gráfico de control.", "Cada una responde una pregunta distinta: ¿cuánto ocurre?, ¿cómo se distribuye?, ¿qué causa pesa más?, ¿qué podría causarlo?, ¿se relacionan?, ¿difiere por grupo?, ¿el proceso es estable?", "<b>Costos de la calidad (PAF)</b>: prevención + evaluación + fallas internas + fallas externas.", "Invertir en prevención suele bajar mucho el costo total."],
      fx:"Costo de la calidad = Prevención + Evaluación + Fallas internas + Fallas externas;   % = costo ÷ ventas", when:"debes elegir qué herramienta usar para un problema de calidad o justificar inversión en prevención." },
    intro:{ prob:"<p>Una planta gasta MM$ 2,4 en prevención, 3,1 en inspección, 9,8 en scrap y reprocesos y 6,2 en garantías, con ventas de MM$ 500. ¿Cuánto le cuesta la (no) calidad y dónde invertir?</p>",
      anal:"<p>Ir al dentista dos veces al año (prevención) cuesta poco. Una caries tratada a tiempo (falla interna) cuesta más. Una extracción de urgencia (falla externa) cuesta mucho más y además duele.</p>",
      terms:[["Hoja de verificación", "Formato para contar qué, dónde y cuándo ocurre."], ["Histograma", "Distribución de datos medidos."], ["Pareto", "Ordena causas de mayor a menor."], ["Causa-efecto", "Ishikawa: posibles causas por categoría."], ["Dispersión", "Relación entre dos variables."], ["Estratificación", "Separar datos por turno, máquina, proveedor."], ["Gráfico de control", "¿El proceso es estable en el tiempo?"], ["PAF", "Prevención, evaluación (appraisal) y fallas."]] },
    adv:"<p>Una secuencia típica: hoja de verificación (recolectar) → Pareto (priorizar) → Ishikawa (hipótesis) → estratificación y dispersión (verificar) → gráfico de control (mantener). El costo de la calidad suele estar entre 5 y 25 % de las ventas en empresas sin programa de calidad.</p>",
    sp:{ title:"Costo de la calidad", params:[{ k:"P", l:"Prevención", v:2.4, u:"MM$" }, { k:"E", l:"Evaluación", v:3.1, u:"MM$" }, { k:"FI", l:"Fallas internas", v:9.8, u:"MM$" }, { k:"FE", l:"Fallas externas", v:6.2, u:"MM$" }],
      script(p){ const T = p.P + p.E + p.FI + p.FE, F = p.FI + p.FE;
        return [
          { t:"Suma", e:"CC = " + n(p.P, 1) + " + " + n(p.E, 1) + " + " + n(p.FI, 1) + " + " + n(p.FE, 1) + " = " + n(T, 1) + " MM$", h:n(T, 1) + " MM$", s:"Costo total de la calidad." },
          { t:"Sobre ventas", e:n(T, 1) + " ÷ 500 = " + n(T / 500 * 100, 2) + " %", h:n(T / 500 * 100, 2) + " %", s:"Porcentaje de las ventas." },
          { t:"Fallas", e:"Fallas = " + n(F, 1) + " MM$ (" + n(F / T * 100, 1) + " % del total)", h:n(F / T * 100, 1) + " %", s:"Lo que se pierde por no hacerlo bien." },
          { t:"Decisión", e:"Prevención es solo " + n(p.P / T * 100, 1) + " %: invertir en prevención (AMEF, capacitación, poka-yoke)", s:"Cada peso en prevención evita varios en fallas." }]; } },
    vars:[["P", "Prevención", "$", "—"], ["E", "Evaluación", "$", "—"], ["FI", "Fallas internas", "$", "—"], ["FE", "Fallas externas", "$", "—"], ["CC", "Costo de la calidad", "$", "—"]],
    sup:"<ul><li>Los costos se clasifican con el mismo criterio cada período.</li><li>Las fallas externas incluyen garantías y devoluciones (la pérdida de clientes es difícil de medir).</li></ul>",
    ex:{ t:"Prevención 2,4; evaluación 3,1; fallas internas 9,8; externas 6,2 (MM$); ventas 500 MM$.",
      steps:[["Sumo.", "Costo total.", "21,5 MM$.", ""], ["Divido por ventas.", "Peso relativo.", "4,30 %.", ""], ["Analizo la mezcla.", "Fallas vs prevención.", "Fallas 74 %; prevención 11 %.", "Invertir en prevención."]],
      r:"el costo de la calidad es 21,5 MM$ (4,3 % de las ventas); tres cuartos son fallas, señal para invertir en prevención." },
    real:"<p>Las 7 herramientas resuelven la mayoría de los problemas de planta sin estadística avanzada. Los costos de la calidad se usan para justificar proyectos de mejora ante la gerencia.</p>",
    sim:"paf",
    chk(){ const T = PAF.reduce((a, b) => a + b, 0); return [["CC", T, 21.5], ["%", T / 500, 0.043]]; },
    quiz:[["Para saber si dos variables (temperatura y defectos) se relacionan se usa:", ["Pareto", "Diagrama de dispersión", "Hoja de verificación", "Histograma"], 1, "Muestra la relación entre dos variables."], ["Una garantía pagada a un cliente es un costo de:", ["Prevención", "Evaluación", "Falla interna", "Falla externa"], 3, "La falla llegó al cliente."], ["Para ver si un proceso es estable en el tiempo se usa:", ["Gráfico de control", "Canvas", "Pareto", "FODA"], 0, "Distingue causas comunes y especiales."]],
    dec:"qué herramienta usar y cuánto invertir en prevención.",
    rel:["pareto", "ishikawa", "control-xr", "descriptiva", "mejora-continua"] };

  CSIM.paf = { title:"Costo total de la calidad según la inversión en prevención",
    goal:"cómo invertir en prevención y evaluación reduce las fallas y por qué existe un punto de costo mínimo.",
    params:[{ k:"P", l:"Inversión en prevención y evaluación", min:1, max:20, step:0.5, v:5.5, u:"MM$", help:"" }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.8); },
    fail(x){ return 16 * Math.exp(-(x - 5.5) / 6); },
    draw(g, W, H, s, p, C){ const x0 = 50, x1 = W - 14, y0 = H - 30, top = 36, X = v => x0 + (v - 1) / 19 * (x1 - x0), Y = v => y0 - v / 40 * (y0 - top), K = Math.round(120 * s.t);
      SIMG.axes(g, x0, y0, x1, top, C, "", "MM$"); [0, 20, 40].forEach(v => SIMG.text(g, v, x0 - 4, Y(v) + 4, C.muted, C, "right")); [1, 5, 10, 15].forEach(v => SIMG.text(g, v, X(v), y0 + 14, C.muted, C, "center"));
      [[x => x, C.c1, "prevención + evaluación"], [x => this.fail(x), C.bad, "fallas"], [x => x + this.fail(x), C.ink, "total"]].forEach(([f, c, l], j) => { g.strokeStyle = c; g.lineWidth = j === 2 ? 3 : 2; g.beginPath(); for (let i = 0; i <= K; i++) { const x = 1 + i / 120 * 19, y = Math.max(top, Y(f(x))); i ? g.lineTo(X(x), y) : g.moveTo(X(x), y); } g.stroke(); SIMG.text(g, "■ " + l, x1 - (2 - j) * 130, 18, c, C, "right", true); });
      let bx = 1, bv = 1e9; for (let x = 1; x <= 20; x += 0.1) { const v = x + this.fail(x); if (v < bv) { bv = v; bx = x; } } g.fillStyle = C.ok; g.beginPath(); g.arc(X(bx), Y(bv), 5, 0, 7); g.fill();
      g.strokeStyle = C.c2; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(X(p.P), top); g.lineTo(X(p.P), y0); g.stroke(); g.setLineDash([]); },
    metrics(s, p){ const F = this.fail(p.P); let bx = 1, bv = 1e9; for (let x = 1; x <= 20; x += 0.1) { const v = x + this.fail(x); if (v < bv) { bv = v; bx = x; } } return [["Fallas", n(F, 1) + " MM$"], ["Costo total", n(p.P + F, 1) + " MM$"], ["Inversión de costo mínimo", "≈ " + n(bx, 1) + " MM$"]]; },
    ann(s, p){ return p.P < 5 ? "Con poca prevención, las fallas dominan el costo: cada peso en prevención ahorra varios en fallas." : "La línea negra (total) tiene un mínimo (punto verde): más allá, prevenir cuesta más de lo que ahorra (modelo didáctico)."; },
    concl(s, p){ return "<p>Con " + n(p.P, 1) + " MM$ en prevención y evaluación, el costo total es " + n(p.P + this.fail(p.P), 1) + " MM$.</p><p><b>Qué demuestra:</b> la mayoría de las empresas invierte menos de lo conveniente en prevención.</p><p><b>Qué decisión informa:</b> el presupuesto de calidad.</p>"; } };

  /* ===================== KPI ===================== */
  CRS.kpis = {
    kw:"kpi indicadores clave de desempeño oee otif mtbf mttr disponibilidad fill rate tablero semaforo meta ficha de indicador",
    ess:{ pts:["Un <b>KPI</b> mide el avance hacia un objetivo: tiene fórmula, meta, frecuencia, fuente de datos y responsable.", "Ejemplos: OEE, OTIF (a tiempo y completo), MTBF y MTTR, accidentabilidad, costo logístico.", "<b>Disponibilidad = MTBF ÷ (MTBF + MTTR)</b>.", "Se muestra como tendencia con meta y semáforo, no como un valor aislado."],
      fx:"Disponibilidad = MTBF ÷ (MTBF + MTTR);   OTIF = pedidos a tiempo y completos ÷ pedidos totales", when:"necesitas medir el desempeño de un área, fijar metas o armar un tablero de gestión." },
    intro:{ prob:"<p>Una bomba falló 5 veces en 600 horas de operación y cada reparación tomó en promedio 4 horas. Además, de 980 pedidos, 912 llegaron a tiempo y completos. ¿Cómo se ven estos indicadores frente a sus metas?</p>",
      anal:"<p>El tablero de un auto muestra pocos indicadores clave (velocidad, combustible, temperatura) con zonas de alerta. Un tablero de gestión hace lo mismo con la empresa.</p>",
      terms:[["KPI", "Indicador clave de desempeño."], ["MTBF", "Tiempo medio entre fallas."], ["MTTR", "Tiempo medio de reparación."], ["OTIF", "On time in full: a tiempo y completo."], ["Meta", "Valor a lograr."], ["Umbral", "Límite del semáforo (verde, amarillo, rojo)."], ["Indicador líder / rezagado", "Anticipa el resultado / lo muestra después."]] },
    adv:"<p><b>Pocos y buenos:</b> 5 a 7 KPI por nivel. <b>Líderes y rezagados:</b> la accidentabilidad es rezagada; las inspecciones realizadas son líderes. Un KPI sin dueño ni acción asociada no mejora nada.</p>",
    sp:{ title:"Disponibilidad y OTIF", params:[{ k:"T", l:"Horas de operación", v:600, u:"h" }, { k:"f", l:"Número de fallas", v:5, u:"" }, { k:"r", l:"Tiempo medio de reparación", v:4, u:"h" }, { k:"ok", l:"Pedidos a tiempo y completos", v:912, u:"" }],
      script(p){ const MT = p.T / p.f, D = MT / (MT + p.r), O = p.ok / 980;
        return [
          { t:"MTBF", e:"MTBF = " + n(p.T) + " ÷ " + p.f + " = " + n(MT, 1) + " h", h:n(MT, 1) + " h", s:"Tiempo medio entre fallas." },
          { t:"Disponibilidad", e:"D = " + n(MT, 1) + " ÷ (" + n(MT, 1) + " + " + n(p.r, 1) + ") = " + n(D * 100, 2) + " %", h:n(D * 100, 2) + " %", s:D >= 0.9 ? "Sobre la meta de 90 %: verde." : "Bajo la meta de 90 %: rojo." },
          { t:"OTIF", e:"OTIF = " + n(p.ok) + " ÷ 980 = " + n(O * 100, 2) + " %", h:n(O * 100, 2) + " %", s:O >= 0.95 ? "Cumple la meta de 95 %." : "Bajo la meta de 95 %: revisar causas de atraso." }]; } },
    vars:[["MTBF", "Tiempo medio entre fallas", "h", "creciente"], ["MTTR", "Tiempo medio de reparación", "h", "decreciente"], ["D", "Disponibilidad", "%", "≥ 90 %"], ["OTIF", "A tiempo y completo", "%", "≥ 95 %"]],
    sup:"<ul><li>Datos confiables y definiciones estables.</li><li>Mismo período de medición para comparar.</li></ul>",
    ex:{ t:"Bomba: 600 h de operación, 5 fallas, 4 h promedio de reparación. Despachos: 912 de 980 OTIF.",
      steps:[["MTBF.", "600 ÷ 5.", "120 h.", ""], ["Disponibilidad.", "120 ÷ 124.", "96,77 %.", "Verde (meta 90 %)."], ["OTIF.", "912 ÷ 980.", "93,06 %.", "Rojo (meta 95 %): atacar causas de atraso."]],
      r:"disponibilidad 96,77 % (cumple); OTIF 93,06 % (no cumple: prioridad del área logística)." },
    real:"<p>Las empresas usan tableros (Power BI, Excel) con KPI por área, revisados en reuniones diarias o semanales. Los contratos con clientes suelen exigir OTIF y disponibilidad mínimos con multas asociadas.</p>",
    sim:"kpi",
    chk(){ return [["D", 120 / 124, 0.967741935483871], ["OTIF", 912 / 980, 0.9306122448979592]]; },
    quiz:[["Si el MTTR baja y el MTBF no cambia, la disponibilidad:", ["Baja", "Sube", "No cambia", "Se vuelve 0"], 1, "Menos tiempo detenido por falla."], ["Un pedido que llegó a tiempo pero incompleto cuenta en el OTIF como:", ["Cumplido", "No cumplido", "Medio cumplido", "No se cuenta"], 1, "Debe ser a tiempo Y completo."], ["Las inspecciones de seguridad realizadas son un indicador:", ["Rezagado", "Líder", "Financiero", "De calidad"], 1, "Anticipan el resultado (accidentes)."]],
    dec:"qué medir, con qué meta y dónde actuar primero.",
    rel:["oee", "accidentabilidad", "ratios", "mejora-continua"] };

  CSIM.kpi = { title:"Tablero de KPI con semáforo",
    goal:"cómo un tablero con meta y tendencia muestra dónde actuar, y cómo MTBF y MTTR mueven la disponibilidad.",
    params:[{ k:"mtbf", l:"MTBF", min:20, max:300, step:5, v:120, u:"h", help:"" }, { k:"mttr", l:"MTTR", min:1, max:24, step:0.5, v:4, u:"h", help:"" }, { k:"otif", l:"OTIF del mes", min:80, max:100, step:0.5, v:93, u:"%", help:"" }],
    init(){ return { h:[], t:0 }; }, onParam(){}, tick(s, p, dt){ s.t += dt; if (s.t > 0.25) { s.t = 0; const d = p.mtbf / (p.mtbf + p.mttr) * 100; s.h.push([d + (Math.random() - 0.5) * 1.5, p.otif + (Math.random() - 0.5) * 2]); if (s.h.length > 30) s.h.shift(); } },
    draw(g, W, H, s, p, C){ const D = p.mtbf / (p.mtbf + p.mttr) * 100, K = [["Disponibilidad", D, 90, 0], ["OTIF", p.otif, 95, 1]], cw = (W - 36) / 2;
      K.forEach(([l, v, m, j], k) => { const x = 12 + k * (cw + 12), y = 12, h = H - 24, col = v >= m ? C.ok : v >= m - 3 ? C.c2 : C.bad; g.strokeStyle = C.line; g.strokeRect(x + 0.5, y + 0.5, cw, h);
        SIMG.text(g, l, x + 12, y + 22, C.ink, C, "left", true); g.fillStyle = col; g.beginPath(); g.arc(x + cw - 20, y + 18, 8, 0, 7); g.fill(); g.fillStyle = C.ink; g.font = "700 28px " + C.font; g.textAlign = "left"; g.fillText(n(v, 1) + " %", x + 12, y + 60); SIMG.text(g, "meta " + m + " %", x + 12, y + 80, C.muted, C, "left");
        const gy = y + h - 16, gh = h - 120, Y = q => gy - (q - 80) / 20 * gh, X = i => x + 12 + i / 29 * (cw - 24); SIMG.hline(g, x + 12, x + cw - 12, Y(m), C.muted, [4, 3], "", C);
        g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); s.h.forEach((r, i) => { const yy = Y(Math.max(80, Math.min(100, r[j]))); i ? g.lineTo(X(i), yy) : g.moveTo(X(i), yy); }); g.stroke(); }); },
    metrics(s, p){ const D = p.mtbf / (p.mtbf + p.mttr); return [["Disponibilidad", n(D * 100, 2) + " %"], ["Horas detenidas por cada 1.000 h", n((1 - D) * 1000, 1) + " h"], ["OTIF", n(p.otif, 1) + " %"]]; },
    ann(s, p){ return "Verde: cumple la meta. Amarillo: hasta 3 puntos bajo la meta. Rojo: actuar. La línea muestra la tendencia, que importa más que un valor aislado."; },
    concl(s, p){ return "<p>Disponibilidad " + n(p.mtbf / (p.mtbf + p.mttr) * 100, 1) + " % y OTIF " + n(p.otif, 1) + " %.</p><p><b>Qué demuestra:</b> reparar más rápido (MTTR) o fallar menos (MTBF) mejoran la disponibilidad; el semáforo enfoca la atención.</p><p><b>Qué decisión informa:</b> dónde poner esfuerzo de mejora.</p>"; } };

  /* ejercicios de clasificar para las 7 herramientas (además del cálculo de costo de la calidad) */
  const Q7 = [["¿Cuántas veces ocurre cada tipo de defecto en el turno?", "Hoja de verificación"], ["¿Cómo se distribuyen los diámetros medidos?", "Histograma"], ["¿Qué 2 o 3 causas explican la mayoría de los reclamos?", "Diagrama de Pareto"], ["¿Qué causas posibles tiene la rebaba?", "Diagrama causa-efecto"], ["¿La temperatura del molde se relaciona con los defectos?", "Diagrama de dispersión"], ["¿Los defectos son distintos entre el turno de día y el de noche?", "Estratificación"], ["¿El proceso se mantiene estable semana a semana?", "Gráfico de control"]];
  const PAFQ = [["Capacitación de operarios en el nuevo método", "Prevención"], ["Diseño de un poka-yoke", "Prevención"], ["Inspección final de productos", "Evaluación"], ["Calibración de instrumentos", "Evaluación"], ["Piezas desechadas (scrap) en la línea", "Falla interna"], ["Reproceso de lotes antes del despacho", "Falla interna"], ["Garantías pagadas a clientes", "Falla externa"], ["Flete de devolución de un pedido rechazado", "Falla externa"]];
  CRS["calidad-7"].gen = () => { if (Math.random() < 0.5) { const [q, ok] = pick(Q7), o = cls(ok, Q7.map(x => x[1])); return { q:"<p>Pregunta del equipo de calidad: <b>«" + q + "»</b></p><p>¿Qué herramienta básica responde mejor esta pregunta?</p>", ops:o.ops, ok:o.ok, expl:"La herramienta adecuada es <b>" + ok + "</b>." }; }
    const [q, ok] = pick(PAFQ), o = cls(ok, ["Prevención", "Evaluación", "Falla interna", "Falla externa"]); return { q:"<p>En el modelo de costos de la calidad (PAF), ¿cómo se clasifica: <b>«" + q + "»</b>?</p>", ops:o.ops, ok:o.ok, expl:"Es un costo de <b>" + ok.toLowerCase() + "</b>. Prevención evita que el defecto ocurra; evaluación lo detecta; las fallas son el costo del defecto dentro (interna) o fuera (externa) de la empresa." }; };
  const MEJ = [["Se forma el equipo, se describe el problema y se aplica contención para proteger al cliente.", "8D"], ["Se mide la línea base del defecto y se verifica el sistema de medición (R&R).", "DMAIC: Medir"], ["Se prueba la solución en una línea piloto durante 2 semanas.", "PDCA: Hacer"], ["Se compara el indicador antes y después de la prueba.", "PDCA: Verificar"], ["Se actualiza el procedimiento y se capacita a todos los turnos.", "PDCA: Actuar"], ["Se establece un gráfico de control y un plan de reacción.", "DMAIC: Controlar"]];
  CRS["mejora-continua"].gen = () => { if (Math.random() < 0.5) return null; const [q, ok] = pick(MEJ), o = cls(ok, MEJ.map(x => x[1])); return { q:"<p>¿A qué metodología o etapa corresponde esta acción?</p><p><b>«" + q + "»</b></p>", ops:o.ops, ok:o.ok, expl:"Corresponde a <b>" + ok + "</b>." }; };
})();
