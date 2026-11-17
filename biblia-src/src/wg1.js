/* ============ CURSO · Módulo Gestión, mejora y seguridad ============
   Referencias (calculadoras): IPER 1 intolerable, 2 importantes, 1 moderado, 2 tolerables; accidentabilidad TA 3,60 %, TS 52,8, IF 18,00, IG 264,0, cotización adicional 0,34 %;
   huella 220,2 t CO₂e (alcance 1 118,6; alcance 2 101,7), 1.468,2 g por unidad. */
(function(){
  const n = crsNum, bar = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, Math.min(y, y + h), w, Math.abs(h)); };
  const box = (g, x, y, w, h, fill, stroke) => { g.fillStyle = fill; g.fillRect(x, y, w, h); if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); } };
  const wrap = (g, s, x, y, w, lh, col, C, al, b) => { g.font = (b ? "600 " : "") + "12px " + C.font; const ws = s.split(" "); let line = "", k = 0; ws.forEach(t => { const tt = line ? line + " " + t : t; if (g.measureText(tt).width > w && line) { SIMG.text(g, line, x, y + k * lh, col, C, al, b); line = t; k++; } else line = tt; }); if (line) SIMG.text(g, line, x, y + k * lh, col, C, al, b); return k + 1; };

  /* ===================== FODA ===================== */
  CRS.foda = {
    kw:"foda dafo swot fortalezas oportunidades debilidades amenazas analisis estrategico matriz cruzada estrategias fo fa do da",
    ess:{ pts:["<b>F y D</b> son internas (dependen de la empresa); <b>O y A</b> son externas (del entorno).", "El valor está en <b>cruzarlas</b>: FO (ofensivas), FA (defensivas), DO (adaptativas), DA (supervivencia).", "Cada factor debe ser concreto y verificable («OEE 58 %», no «somos ineficientes»).", "Se prioriza con evidencia: peso e impacto de cada factor."],
      fx:"Estrategia FO = usar una F para aprovechar una O;   DO = corregir una D aprovechando una O;   FA = usar una F para frenar una A;   DA = reducir una D para que una A no afecte", when:"defines la estrategia de una empresa, un área o un proyecto, o preparas un plan de negocio." },
    intro:{ prob:"<p>Una planta de envases plásticos tiene personal experimentado y certificación ISO 9001, pero su OEE es 58 % y los cambios de molde duran 90 minutos. Crece la demanda de envases reciclables y hay fondos CORFO, pero aumentan las importaciones baratas. ¿Qué estrategias seguir?</p>",
      anal:"<p>Antes de un partido, un entrenador mira las fortalezas y debilidades de su equipo (internas) y las del rival y la cancha (externas). Luego arma la táctica cruzando ambas: «usar nuestra velocidad contra su defensa lenta».</p>",
      terms:[["Fortaleza", "Capacidad interna que da ventaja."], ["Debilidad", "Limitación interna."], ["Oportunidad", "Factor externo favorable."], ["Amenaza", "Factor externo desfavorable."], ["Matriz cruzada", "Tabla que combina internos y externos para generar estrategias."], ["PESTEL / Porter", "Herramientas para encontrar O y A."]] },
    adv:"<p><b>Errores típicos:</b> poner como oportunidad algo interno («mejorar procesos»), hacer listas largas sin priorizar y no derivar estrategias. <b>Matriz EFI/EFE:</b> asigna pesos y calificaciones a cada factor para obtener un puntaje.</p>",
    sp:{ title:"De la lista a las estrategias", params:[],
      script(){ return [
        { t:"Interno +", e:"F: personal con experiencia;  máquinas de 5 años;  ISO 9001", s:"Lo que la planta hace bien y controla." },
        { t:"Interno −", e:"D: OEE 58 %;  setups de 90 min;  sin mantenimiento preventivo", s:"Datos concretos, no opiniones." },
        { t:"Externo", e:"O: demanda de reciclables;  Ley REP;  fondos CORFO.   A: importaciones;  alza de la resina;  falta de técnicos", s:"Lo que el entorno ofrece o impone." },
        { t:"FO", e:"Usar la experiencia del personal para desarrollar envases reciclables", h:"FO", s:"Ofensiva: fortaleza + oportunidad." },
        { t:"DO", e:"Corregir el OEE de 58 % con fondos CORFO (SMED, mantenimiento)", h:"DO", s:"Adaptativa: la oportunidad financia la mejora." },
        { t:"FA", e:"Usar ISO 9001 para diferenciarse de importaciones de calidad incierta", s:"Defensiva." },
        { t:"DA", e:"Reducir setups para producir lotes cortos y bajar inventario de resina cara", s:"Supervivencia: minimizar daño." }]; } },
    vars:[["F", "Fortaleza", "interna", "+"], ["D", "Debilidad", "interna", "−"], ["O", "Oportunidad", "externa", "+"], ["A", "Amenaza", "externa", "−"]],
    sup:"<ul><li>La información es actual y verificada.</li><li>Participan distintas áreas para evitar sesgos.</li></ul>",
    ex:{ t:"Planta de envases plásticos (línea de inyección).",
      steps:[["Separo internos y externos.", "Evitar confusiones.", "3 F, 3 D, 3 O, 3 A.", ""], ["Cruzo.", "Generar estrategias.", "FO, FA, DO, DA.", ""], ["Priorizo.", "Recursos limitados.", "DO: mejorar OEE con CORFO.", "Ataca la debilidad más cara con dinero externo."]],
      r:"estrategia prioritaria DO: programa de OEE (SMED y mantenimiento preventivo) financiado con CORFO; en paralelo, FO: línea de envases reciclables." },
    real:"<p>Se exige en planes de negocio (CORFO, SERCOTEC, bancos) y en la planificación estratégica anual. Su utilidad depende de convertirla en acciones con responsables.</p>",
    sim:"foda",
    chk(){ const F = 3, D = 3, O = 3, A = 3; return [["Cruces", F * O + F * A + D * O + D * A, 36]]; },
    quiz:[["«Alza del precio de la resina» es:", ["Fortaleza", "Debilidad", "Oportunidad", "Amenaza"], 3, "Externa y negativa."], ["«Setups de 90 minutos» es:", ["Fortaleza", "Debilidad", "Oportunidad", "Amenaza"], 1, "Interna y negativa."], ["Una estrategia DO busca:", ["Atacar con fortalezas", "Corregir debilidades aprovechando oportunidades", "Defenderse", "Cerrar el negocio"], 1, "Adaptativa."]],
    dec:"qué estrategias seguir y en qué orden.",
    rel:["canvas", "ishikawa", "kpis"] };

  CSIM.foda = { title:"Posición estratégica según el balance interno y externo",
    goal:"cómo el peso de fortalezas, debilidades, oportunidades y amenazas define el tipo de estrategia.",
    params:[{ k:"F", l:"Peso de las fortalezas", min:0, max:10, step:1, v:6, u:"", help:"" }, { k:"D", l:"Peso de las debilidades", min:0, max:10, step:1, v:7, u:"", help:"" }, { k:"O", l:"Peso de las oportunidades", min:0, max:10, step:1, v:8, u:"", help:"" }, { k:"A", l:"Peso de las amenazas", min:0, max:10, step:1, v:5, u:"", help:"" }],
    init(){ return { x:0, y:0 }; }, tick(s, p, dt){ const tx = p.F - p.D, ty = p.O - p.A; s.x += (tx - s.x) * Math.min(1, dt * 4); s.y += (ty - s.y) * Math.min(1, dt * 4); },
    Q:[["FO · ofensiva", 1, 1], ["DO · adaptativa", -1, 1], ["FA · defensiva", 1, -1], ["DA · supervivencia", -1, -1]],
    draw(g, W, H, s, p, C){ const cx = W / 2, cy = H / 2, sx = (W / 2 - 20) / 10, sy = (H / 2 - 20) / 10, q = (s.x >= 0 ? 0 : 1) + (s.y >= 0 ? 0 : 2);
      this.Q.forEach(([l, a, b], k) => { box(g, a > 0 ? cx : 14, b > 0 ? 14 : cy, W / 2 - 14, H / 2 - 14, k === q ? C.c1 : C.line, null); g.globalAlpha = 1; SIMG.text(g, l, a > 0 ? W - 22 : 22, b > 0 ? 32 : H - 22, k === q ? C.surf : C.muted, C, a > 0 ? "right" : "left", true); });
      g.strokeStyle = C.ink; g.lineWidth = 1; g.beginPath(); g.moveTo(14, cy); g.lineTo(W - 14, cy); g.moveTo(cx, 14); g.lineTo(cx, H - 14); g.stroke();
      SIMG.text(g, "interno fuerte →", W - 22, cy - 6, C.ink, C, "right"); SIMG.text(g, "↑ entorno favorable", cx + 6, 52, C.ink, C, "left");
      g.fillStyle = C.c2; g.strokeStyle = C.surf; g.lineWidth = 3; g.beginPath(); g.arc(cx + s.x * sx, cy - s.y * sy, 10, 0, 7); g.fill(); g.stroke(); },
    metrics(s, p){ const q = (p.F - p.D >= 0 ? 0 : 1) + (p.O - p.A >= 0 ? 0 : 2); return [["Balance interno (F − D)", n(p.F - p.D)], ["Balance externo (O − A)", n(p.O - p.A)], ["Estrategia sugerida", this.Q[q][0]]]; },
    ann(s, p){ return "El punto naranja se ubica según el balance interno (horizontal) y externo (vertical). El cuadrante coloreado es el tipo de estrategia que conviene priorizar."; },
    concl(s, p){ const q = (p.F - p.D >= 0 ? 0 : 1) + (p.O - p.A >= 0 ? 0 : 2); return "<p>Con estos pesos, la estrategia prioritaria es <b>" + this.Q[q][0] + "</b>.</p><p><b>Qué demuestra:</b> la misma empresa puede necesitar estrategias distintas según cambie el entorno.</p><p><b>Qué decisión informa:</b> dónde poner los recursos primero.</p>"; } };

  /* ===================== ISHIKAWA ===================== */
  const IC = [["Mano de obra", ["Operador nuevo sin capacitación", "Rotación de turnos"]], ["Método", ["Parámetros no estandarizados", "Sin instructivo de ajuste"]], ["Máquina", ["Desgaste del molde", "Presión de cierre inestable"]], ["Material", ["Resina con humedad", "Cambio de proveedor"]], ["Medición", ["Calibrador sin certificar"]], ["Medio ambiente", ["Temperatura variable"]]];
  CRS.ishikawa = {
    kw:"ishikawa diagrama causa efecto espina de pescado 6m mano de obra metodo maquina material medicion medio ambiente analisis de causas",
    ess:{ pts:["Ordena las <b>posibles causas</b> de un problema en categorías (las 6M) para no olvidar ninguna.", "El problema (efecto) va en la «cabeza»; las categorías son las espinas.", "Es una herramienta de <b>lluvia de ideas ordenada</b>: las causas son hipótesis que hay que verificar con datos.", "Se combina con los 5 porqués para llegar a la causa raíz."],
      fx:"Efecto ← {Mano de obra, Método, Máquina, Material, Medición, Medio ambiente}", when:"un problema tiene muchas causas posibles y necesitas ordenarlas antes de investigar." },
    intro:{ prob:"<p>Una inyectora produce muchas piezas con rebaba. Nadie se pone de acuerdo en la causa: unos culpan al operador, otros al molde, otros a la resina. ¿Cómo ordenar la discusión?</p>",
      anal:"<p>Si tu queque salió mal, puede ser la receta (método), el horno (máquina), los ingredientes (material), quien lo hizo (mano de obra), la balanza (medición) o el día de calor (ambiente). Revisar cada categoría evita culpar a la primera idea.</p>",
      terms:[["Efecto", "Problema que se analiza (redactado concreto y medible)."], ["6M", "Mano de obra, Método, Máquina, Material, Medición, Medio ambiente."], ["Causa", "Factor que podría producir el efecto."], ["Subcausa", "Causa de una causa."], ["Verificación", "Comprobar con datos si la causa realmente influye."]] },
    adv:"<p>En servicios se usan las <b>4P</b> (políticas, procedimientos, personas, planta) u otras categorías. Después del diagrama, se priorizan las causas (votación, Pareto de datos) y se verifican con experimentos o datos.</p>",
    sp:{ title:"Construir la espina de pescado", params:[],
      script(){ return [
        { t:"Efecto", e:"Alto porcentaje de piezas con rebaba", s:"Concreto y medible, en la cabeza del pez." },
        { t:"Categorías", e:"Mano de obra · Método · Máquina · Material · Medición · Medio ambiente", s:"Las 6 espinas principales." },
        { t:"Causas", e:"Máquina: desgaste del molde;  presión de cierre inestable", h:"presión de cierre inestable", s:"Lluvia de ideas en cada categoría." },
        { t:"Todas", e:"10 causas en 6 categorías", s:"Ninguna categoría queda sin revisar." },
        { t:"Priorizar", e:"Votación y datos → presión de cierre y humedad de la resina", s:"Se eligen las más probables para verificar." },
        { t:"Verificar", e:"Medir rebaba con presión estabilizada y resina secada", s:"La causa se confirma con datos, no con opiniones." }]; } },
    vars:[["Efecto", "Problema", "—", "medible"], ["Categoría", "Espina principal (6M)", "—", "4 a 8"], ["Causa", "Hipótesis", "—", "verificar"]],
    sup:"<ul><li>Participa gente que conoce el proceso.</li><li>Las causas se tratan como hipótesis.</li></ul>",
    ex:{ t:"Rebaba en piezas inyectadas.",
      steps:[["Defino el efecto.", "Problema medible.", "«Rebaba en 7 % de las piezas».", ""], ["Lleno las 6M.", "Lluvia de ideas.", "10 causas.", ""], ["Priorizo y verifico.", "Datos.", "Presión de cierre y humedad.", "Explicaban la mayor parte de la rebaba."]],
      r:"se identificaron 10 causas posibles; las verificadas fueron la presión de cierre y la humedad de la resina." },
    real:"<p>Herramienta básica de las 7 de la calidad, del ciclo PDCA y de la etapa «Analizar» de Six Sigma. Se usa en investigación de accidentes y reclamos.</p>",
    sim:"fish",
    chk(){ return [["Causas", IC.reduce((a, c) => a + c[1].length, 0), 10], ["Categorías", IC.length, 6]]; },
    quiz:[["«El calibrador no está certificado» pertenece a:", ["Método", "Medición", "Máquina", "Material"], 1, "Instrumentos de medida."], ["Las causas del diagrama de Ishikawa son:", ["Hechos comprobados", "Hipótesis por verificar", "Soluciones", "Indicadores"], 1, "Se verifican después."], ["¿Qué va en la cabeza del pescado?", ["La solución", "El problema (efecto)", "El responsable", "El costo"], 1, "El efecto."]],
    dec:"qué causas investigar primero.",
    rel:["porques", "pareto", "foda"] };

  CSIM.fish = { title:"Espina de pescado con causas priorizadas",
    goal:"cómo se ordenan las causas en categorías y cómo los votos o datos destacan las más probables.",
    params:[{ k:"lv", l:"Nivel de detalle", min:1, max:3, step:1, v:3, fmt:v => ["", "solo categorías", "con causas", "con prioridad"][v], u:"", help:"" }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.5); },
    SH:[["Operador nuevo", "Rotación de turnos"], ["Parámetros sin estándar", "Sin instructivo"], ["Molde gastado", "Presión de cierre"], ["Resina húmeda", "Nuevo proveedor"], ["Calibrador sin certificar"], ["Temperatura variable"]],
    h(W){ return W < 520 ? 560 : Math.round(Math.min(440, Math.max(320, W * 0.66))); },
    draw(g, W, H, s, p, C){ if (W < 520) return this.drawV(g, W, H, s, p, C); const hx = W - 110, cy = H / 2, x0 = 14, K = Math.ceil(IC.length * s.t), pri = ["Presión de cierre", "Resina húmeda"], cw = (hx - x0) / 3;
      g.strokeStyle = C.ink; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, cy); g.lineTo(hx, cy); g.stroke(); box(g, hx, cy - 30, 100, 60, C.c2, null); wrap(g, "Piezas con rebaba", hx + 50, cy - 6, 90, 14, C.surf, C, "center", true);
      IC.slice(0, K).forEach(([c], k) => { const up = k % 2 === 0, col = Math.floor(k / 2), bx = x0 + col * cw + 4, tw = cw - 12; let y = up ? 16 : H - 10 - (p.lv >= 2 ? 0 : 0);
        if (up) { SIMG.text(g, c, bx, y, C.c1, C, "left", true); y += 16; if (p.lv >= 2) this.SH[k].forEach(t => { const pr = p.lv >= 3 && pri.indexOf(t) >= 0; y += 13 * wrap(g, "•\u00a0" + t, bx, y, tw, 13, pr ? C.bad : C.ink, C, "left", pr) + 2; }); g.strokeStyle = C.c1; g.lineWidth = 2; g.beginPath(); g.moveTo(bx + 8, y); g.lineTo(bx + cw * 0.7, cy); g.stroke(); }
        else { const L = p.lv >= 2 ? this.SH[k] : [], lines = L.map(t => Math.max(1, Math.ceil(g.measureText("•\u00a0" + t).width / tw))); let yy = H - 26 - 13 * lines.reduce((a, b) => a + b, 0) - 2 * L.length; g.strokeStyle = C.c1; g.lineWidth = 2; g.beginPath(); g.moveTo(bx + 8, yy - 4); g.lineTo(bx + cw * 0.7, cy); g.stroke(); L.forEach((t, j) => { const pr = p.lv >= 3 && pri.indexOf(t) >= 0; yy += 13 * wrap(g, "•\u00a0" + t, bx, yy + 10, tw, 13, pr ? C.bad : C.ink, C, "left", pr) + 2; }); SIMG.text(g, c, bx, H - 8, C.c1, C, "left", true); } }); },
    drawV(g, W, H, s, p, C){ const cx = W / 2, K = Math.ceil(IC.length * s.t), pri = ["Presión de cierre", "Resina húmeda"], rh = (H - 90) / 3, tw = W / 2 - 30;
      g.strokeStyle = C.ink; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, 8); g.lineTo(cx, H - 66); g.stroke(); box(g, cx - 80, H - 62, 160, 50, C.c2, null); wrap(g, "Piezas con rebaba", cx, H - 33, 150, 14, C.surf, C, "center", true);
      IC.slice(0, K).forEach(([c], k) => { const left = k % 2 === 0, row = Math.floor(k / 2), x = left ? 10 : cx + 20, y0 = 16 + row * rh; let y = y0; SIMG.text(g, c, x, y, C.c1, C, "left", true); y += 16;
        if (p.lv >= 2) this.SH[k].forEach(t => { const pr = p.lv >= 3 && pri.indexOf(t) >= 0; y += 13 * wrap(g, "•\u00a0" + t, x, y, tw, 13, pr ? C.bad : C.ink, C, "left", pr) + 2; });
        g.strokeStyle = C.c1; g.lineWidth = 2; g.beginPath(); g.moveTo(left ? x + tw * 0.5 : x + tw * 0.5, y - 4); g.lineTo(cx, y0 + rh - 6); g.stroke(); }); },
    metrics(s, p){ return [["Categorías", n(IC.length)], ["Causas", n(IC.reduce((a, c) => a + c[1].length, 0))], ["Prioritarias", p.lv >= 3 ? "2 (en rojo)" : "—"]]; },
    ann(s, p){ return p.lv >= 3 ? "Las causas en rojo son las que el equipo priorizó con datos: son las que se verifican primero." : "Cada espina es una categoría (6M); en ella se cuelgan las causas posibles."; },
    concl(){ return "<p>El diagrama ordenó 10 causas en 6 categorías y destacó 2 para verificar.</p><p><b>Qué demuestra:</b> ordenar las ideas evita culpar a la primera causa que se nos ocurre.</p><p><b>Qué decisión informa:</b> qué investigar y medir primero.</p>"; } };

  /* ===================== 5 PORQUÉS ===================== */
  const PQ = ["El motor de la cinta se detuvo por sobrecarga", "El rodamiento del rodillo estaba agarrotado", "No tenía lubricación", "La lubricación no está en el plan de mantención", "No existe un plan de mantenimiento preventivo para cintas"];
  const ACC = ["Reiniciar el motor", "Cambiar el rodamiento", "Lubricar el rodillo", "Agregar este rodillo al plan", "Crear plan preventivo de cintas con lubricación semanal"];
  const REC = [0.9, 0.7, 0.5, 0.25, 0.05];
  CRS.porques = {
    kw:"5 porques cinco por que causa raiz analisis de causa raiz rca accion correctiva toyota",
    ess:{ pts:["Preguntar «¿por qué?» repetidamente (unas 5 veces) hasta llegar a la <b>causa raíz</b>.", "La causa raíz es la que, si se elimina, <b>evita que el problema se repita</b>.", "Si la acción solo arregla el síntoma, el problema vuelve.", "Cada respuesta debe basarse en hechos, no en suposiciones o culpables."],
      fx:"Problema → ¿por qué? → causa 1 → ¿por qué? → … → causa raíz → acción correctiva", when:"ocurre una falla o un problema puntual y quieres evitar que se repita." },
    intro:{ prob:"<p>La línea 2 se detuvo 45 minutos. El técnico reinició el motor y siguió. ¿Volverá a pasar?</p>",
      anal:"<p>Si tu auto se queda sin bencina, llenar el estanque resuelve hoy. Preguntar por qué (no miré el indicador → está malo → nunca lo arreglé) lleva a la solución que evita que se repita.</p>",
      terms:[["Síntoma", "Lo que se ve (la línea detenida)."], ["Causa directa", "Lo que provocó el síntoma."], ["Causa raíz", "Falla del sistema o proceso que permitió que ocurriera."], ["Acción correctiva", "Elimina la causa raíz."], ["Acción de contención", "Arreglo inmediato del síntoma."]] },
    adv:"<p><b>Prueba inversa:</b> leer la cadena al revés con «por lo tanto» debe tener sentido. <b>Ramas:</b> un problema puede tener varias cadenas; se combina con Ishikawa. La causa raíz suele ser un proceso o sistema, rara vez «error humano».</p>",
    sp:{ title:"La cadena de porqués", params:[],
      script(){ return [{ t:"Problema", e:"La línea 2 se detuvo 45 minutos", s:"El síntoma." }].concat(PQ.map((c, k) => ({ t:"¿Por qué " + (k + 1) + "?", e:c, h:k === 4 ? c : "", s:k === 4 ? "Causa raíz: falla del sistema de mantención." : "Acción posible: " + ACC[k].toLowerCase() + " (no evita que se repita)." }))).concat([{ t:"Acción", e:"Crear plan preventivo de cintas · jefe de mantención · 15 días", s:"Ataca la raíz, con responsable y plazo." }]); } },
    vars:[["Problema", "Efecto observado", "—", "concreto"], ["Por qué n", "Respuesta basada en hechos", "—", "≈ 5"], ["Causa raíz", "La que se elimina", "—", "sistema/proceso"]],
    sup:"<ul><li>Cada respuesta se verifica en terreno.</li><li>Se busca el proceso que falló, no un culpable.</li></ul>",
    ex:{ t:"Detención de 45 minutos en la línea 2.",
      steps:[["Pregunto 5 veces.", "Bajar a la raíz.", "Sin plan preventivo para cintas.", ""], ["Hago la prueba inversa.", "Coherencia.", "Sin plan → sin lubricar → agarrotado → sobrecarga → detención.", "Tiene sentido."], ["Defino la acción.", "Con responsable y plazo.", "Plan preventivo · jefe de mantención · 15 días.", ""]],
      r:"causa raíz: no existe plan preventivo para cintas. Acción: crearlo con lubricación semanal (jefe de mantención, 15 días)." },
    real:"<p>Nació en Toyota. Hoy es parte de los análisis de falla en mantención (RCA), de las no conformidades ISO y de la investigación de accidentes.</p>",
    sim:"why",
    chk(){ return [["Niveles", PQ.length, 5], ["Recurrencia raíz", REC[4], 0.05]]; },
    quiz:[["Reiniciar el motor que se detuvo es:", ["Acción correctiva", "Acción de contención", "Causa raíz", "Prevención"], 1, "Arregla el síntoma."], ["Una buena causa raíz suele ser:", ["«Error humano»", "Una falla de proceso o sistema", "Mala suerte", "El turno de noche"], 1, "Si el sistema permite el error, se repetirá con otra persona."], ["La prueba de la causa raíz consiste en:", ["Preguntar al jefe", "Leer la cadena al revés con «por lo tanto»", "Hacer un FODA", "Calcular el VAN"], 1, "Debe ser coherente en ambos sentidos."]],
    dec:"qué acción tomar para que el problema no se repita.",
    pre:["ishikawa"], rel:["ishikawa", "amef", "mejora-continua"] };

  CSIM.why = { title:"¿Dónde te detienes? Profundidad del análisis y recurrencia",
    goal:"por qué detenerse en el primer porqué deja el problema vivo, y cómo la acción en la causa raíz evita que se repita.",
    params:[{ k:"d", l:"Te detienes en el porqué n.º", min:1, max:5, step:1, v:5, u:"", help:"" }],
    init(){ return { t:0, m:[], acc:0 }; }, onParam(s){ s.t = 0; s.m = []; },
    tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.8); s.acc += dt * 6; while (s.acc >= 1 && s.m.length < 52) { s.acc -= 1; s.m.push(Math.random() < REC[p.d - 1] / 4); } },
    draw(g, W, H, s, p, C){ const x0 = 16, w = W - 32, hh = 36, K = Math.ceil(5 * s.t);
      for (let k = 0; k < K; k++) { const y = 10 + k * (hh + 6), on = k < p.d; box(g, x0 + k * 14, y, w - k * 14, hh, on ? (k === p.d - 1 ? C.c2 : C.c1) : C.line, null); wrap(g, (k + 1) + ". " + PQ[k], x0 + k * 14 + 8, y + 15, w - k * 14 - 16, 13, on ? C.surf : C.muted, C, "left", k === p.d - 1); }
      const yy = 10 + 5 * (hh + 6) + 10; SIMG.text(g, "Acción: " + ACC[p.d - 1], x0, yy, C.ink, C, "left", true);
      const cw = (w) / 52; s.m.forEach((f, i) => bar(g, x0 + i * cw, H - 14, Math.max(1, cw - 1), f ? -26 : -8, f ? C.bad : C.ok)); SIMG.text(g, "52 semanas siguientes (rojo = la falla se repite)", x0, H - 46, C.muted, C, "left"); },
    metrics(s, p){ const f = s.m.filter(x => x).length; return [["Acción", ACC[p.d - 1]], ["Probabilidad de que se repita en el año", n(REC[p.d - 1] * 100) + " %"], ["Fallas simuladas", n(f)], ["Horas perdidas estimadas", n(f * 0.75, 1)]]; },
    ann(s, p){ return p.d < 5 ? "Detenerse antes de la raíz deja el sistema igual: la falla vuelve a aparecer (barras rojas)." : "Con la acción en la causa raíz, casi no hay repeticiones."; },
    concl(s, p){ return "<p>Deteniéndote en el porqué " + p.d + ", la probabilidad de que se repita en el año es " + n(REC[p.d - 1] * 100) + " %.</p><p><b>Qué demuestra:</b> la profundidad del análisis define si el problema vuelve.</p><p><b>Qué decisión informa:</b> qué acción correctiva aprobar.</p>"; } };

  /* ===================== SIPOC ===================== */
  const SP = [["Proveedores", ["Área comercial", "Bodega", "Transportista"]], ["Entradas", ["Orden de venta", "Productos en stock", "Guía de despacho"]], ["Proceso", ["Recibir orden", "Preparar picking", "Verificar y embalar", "Emitir guía", "Cargar camión"]], ["Salidas", ["Pedido despachado", "Guía firmada", "Registro en ERP"]], ["Clientes", ["Cliente final", "Facturación"]]];
  CRS.sipoc = {
    kw:"sipoc proveedores entradas proceso salidas clientes mapa de alto nivel alcance del proceso six sigma definir",
    ess:{ pts:["Describe un proceso en una tabla de 5 columnas: <b>S</b>uppliers, <b>I</b>nputs, <b>P</b>rocess, <b>O</b>utputs, <b>C</b>ustomers.", "El proceso se resume en <b>4 a 7 pasos</b> de alto nivel.", "Define el <b>alcance</b>: dónde empieza y dónde termina el proceso.", "Se construye en este orden: proceso → salidas → clientes → entradas → proveedores."],
      fx:"Proveedores → Entradas → Proceso (4 a 7 pasos) → Salidas → Clientes", when:"inicias un proyecto de mejora y necesitas que todos entiendan el mismo proceso y su alcance." },
    intro:{ prob:"<p>El despacho de pedidos tiene reclamos por atrasos, pero bodega, ventas y transporte describen el proceso de forma distinta. ¿Cómo partir?</p>",
      anal:"<p>Preparar un asado: proveedores (carnicería, botillería), entradas (carne, carbón), proceso (encender, asar, servir), salidas (comida), clientes (invitados). Si alguien cree que el proceso incluye comprar y otro que no, discutirán sin entenderse.</p>",
      terms:[["Proveedor", "Quien entrega una entrada (interno o externo)."], ["Entrada", "Material, información o recurso que entra."], ["Proceso", "Pasos que transforman las entradas."], ["Salida", "Producto o resultado."], ["Cliente", "Quien recibe la salida."], ["Alcance", "Inicio y fin del proceso."]] },
    adv:"<p>Es la herramienta típica de la etapa <b>Definir</b> de DMAIC. Después se detalla con un diagrama de flujo o un VSM, y se agregan los requisitos del cliente (CTQ) de cada salida.</p>",
    sp:{ title:"Armar el SIPOC", params:[],
      script(){ return [
        { t:"P", e:"Recibir orden → preparar picking → verificar y embalar → emitir guía → cargar camión", s:"5 pasos de alto nivel: inicio y fin claros." },
        { t:"O", e:"Pedido despachado;  guía firmada;  registro en ERP", s:"¿Qué produce?" },
        { t:"C", e:"Cliente final;  facturación", s:"¿Quién lo recibe? (incluye clientes internos)." },
        { t:"I", e:"Orden de venta;  productos en stock;  guía de despacho", s:"¿Qué necesita?" },
        { t:"S", e:"Área comercial;  bodega;  transportista", h:"transportista", s:"¿Quién lo entrega?" }]; } },
    vars:[["S", "Proveedores", "—", "—"], ["I", "Entradas", "—", "—"], ["P", "Pasos del proceso", "—", "4 a 7"], ["O", "Salidas", "—", "—"], ["C", "Clientes", "—", "—"]],
    sup:"<ul><li>Visión de alto nivel (sin detalle de cada tarea).</li><li>Validado con quienes ejecutan el proceso.</li></ul>",
    ex:{ t:"Despacho de pedidos.",
      steps:[["Proceso.", "Alcance.", "5 pasos desde la orden hasta el camión.", ""], ["Salidas y clientes.", "Qué y para quién.", "3 salidas; 2 clientes.", "Facturación es cliente interno."], ["Entradas y proveedores.", "Qué y de quién.", "3 y 3.", ""]],
      r:"SIPOC de despacho con 5 pasos; quedó claro que el proceso termina al cargar el camión (la entrega es de otro proceso)." },
    real:"<p>Se usa al iniciar proyectos Lean Six Sigma, auditorías ISO 9001 (enfoque a procesos) y levantamientos para ERP.</p>",
    sim:"sipoc",
    chk(){ return [["Pasos", SP[2][1].length, 5], ["Columnas", SP.length, 5]]; },
    quiz:[["En un SIPOC, «Facturación» puede ser:", ["Solo proveedor", "Cliente interno", "Una entrada", "Un paso"], 1, "Recibe una salida (registro)."], ["¿Cuántos pasos debe tener la columna Proceso?", ["1", "4 a 7", "20 a 30", "Todos los detalles"], 1, "Es de alto nivel."], ["El SIPOC pertenece a la etapa DMAIC:", ["Definir", "Medir", "Analizar", "Controlar"], 0, "Delimita el proceso."]],
    dec:"alcance de un proyecto de mejora y actores involucrados.",
    rel:["vsm", "raci", "mejora-continua"] };

  CSIM.sipoc = { title:"Flujo de pedidos por el SIPOC",
    goal:"cómo entradas de varios proveedores pasan por los pasos del proceso y salen hacia los clientes, y dónde se acumulan.",
    params:[{ k:"tp", l:"Tiempo de «preparar picking»", min:2, max:20, step:1, v:8, u:"min", help:"Los demás pasos toman 4 min." }, { k:"ll", l:"Pedidos por hora", min:4, max:14, step:1, v:9, u:"", help:"" }],
    init(){ return { O:[], acc:0, done:0, t:0, W:[] }; }, onParam(s){ Object.assign(s, this.init()); },
    tick(s, p, dt){ const sp = dt * 60; s.t += sp; s.acc += sp * p.ll / 60; while (s.acc >= 1) { s.acc -= 1; s.O.push({ st:0, r:0, t0:s.t }); }
      const T = [4, p.tp, 4, 4, 4]; for (let k = 4; k >= 0; k--) { const at = s.O.filter(o => o.st === k); if (at.length) { at[0].r += sp; if (at[0].r >= T[k]) { at[0].st++; at[0].r = 0; if (at[0].st === 5) { s.done++; s.W.push(s.t - at[0].t0); if (s.W.length > 30) s.W.shift(); } } } } s.O = s.O.filter(o => o.st < 5); },
    draw(g, W, H, s, p, C){ const cw = (W - 20) / 5, top = 10, hd = 26;
      SP.forEach(([h, L], k) => { const x = 10 + k * cw; box(g, x + 2, top, cw - 4, hd, k === 2 ? C.c2 : C.c1, null); SIMG.text(g, h[0], x + cw / 2, top + 18, C.surf, C, "center", true); if (k !== 2) L.forEach((t, j) => wrap(g, t, x + cw / 2, top + hd + 20 + j * 34, cw - 10, 13, C.muted, C, "center")); });
      const steps = SP[2][1], x = 10 + 2 * cw, sh = (H - top - hd - 20) / 5; steps.forEach((t, j) => { const y = top + hd + 8 + j * sh, q = s.O.filter(o => o.st === j).length; box(g, x + 4, y, cw - 8, sh - 6, q > 3 ? C.bad : C.surf, C.line); wrap(g, t, x + cw / 2, y + 15, cw - 14, 12, q > 3 ? C.surf : C.ink, C, "center", true); for (let i = 0; i < Math.min(q, 8); i++) { g.fillStyle = q > 3 ? C.surf : C.c2; g.beginPath(); g.arc(x + 12 + i * 9, y + sh - 14, 3.5, 0, 7); g.fill(); } }); },
    metrics(s, p){ const ut = p.ll * Math.max(4, p.tp) / 60, lt = s.W.length ? s.W.reduce((a, b) => a + b, 0) / s.W.length : NaN; return [["Pedidos despachados", n(s.done)], ["En proceso", n(s.O.length)], ["Tiempo de despacho promedio", isFinite(lt) ? n(lt, 1) + " min" : "—"], ["Utilización del paso más lento", n(ut * 100) + " %"]]; },
    ann(s, p){ return p.ll * p.tp / 60 >= 1 ? "El paso «preparar picking» no alcanza: los pedidos se acumulan (en rojo) y el tiempo de despacho crece sin control." : "Los puntos naranjos son pedidos esperando en cada paso. El SIPOC muestra quién entra y quién recibe."; },
    concl(s, p){ return "<p>Con picking de " + p.tp + " min y " + p.ll + " pedidos por hora, " + (p.ll * p.tp / 60 >= 1 ? "el proceso se satura" : "el proceso fluye") + ".</p><p><b>Qué demuestra:</b> el SIPOC delimita el proceso; luego se mide para encontrar el cuello de botella.</p><p><b>Qué decisión informa:</b> qué paso mejorar primero.</p>"; } };

  /* ===================== CANVAS ===================== */
  const CVB = [["Socios clave", "Fabricante de sensores; proveedor de nube"], ["Actividades clave", "Instalación; análisis de datos; soporte"], ["Recursos clave", "Plataforma; ingenieros de confiabilidad"], ["Propuesta de valor", "Reducir paradas no planificadas en 30 %; alertas antes de la falla"], ["Relación con clientes", "Ejecutivo dedicado; informe mensual"], ["Canales", "Venta directa; ferias mineras"], ["Segmentos de clientes", "Plantas mineras medianas; industria alimentaria"], ["Estructura de costos", "Sensores; nube; personal técnico"], ["Fuentes de ingresos", "Suscripción mensual por equipo; instalación"]];
  CRS.canvas = {
    kw:"canvas modelo de negocio lienzo osterwalder propuesta de valor segmentos canales relacion fuentes de ingresos estructura de costos emprendimiento",
    ess:{ pts:["Describe <b>cómo un negocio crea, entrega y captura valor</b> en 9 bloques en una sola hoja.", "Lado derecho: <b>cliente</b> (segmentos, propuesta de valor, canales, relación, ingresos).", "Lado izquierdo: <b>operación</b> (socios, actividades, recursos, costos).", "Cada bloque es una hipótesis que se valida con clientes reales."],
      fx:"Utilidad = Fuentes de ingresos − Estructura de costos (y debe sostener la propuesta de valor a los segmentos)", when:"diseñas un emprendimiento, un nuevo servicio o evalúas una idea de negocio." },
    intro:{ prob:"<p>Un grupo de ingenieros quiere vender mantenimiento predictivo con sensores IoT a plantas mineras. ¿Cómo describir el negocio de forma clara y saber si es rentable?</p>",
      anal:"<p>Un food truck: clientes (oficinistas), propuesta (almuerzo rápido y rico), canal (el carro en la esquina), ingresos (venta por plato), recursos (el carro, la cocinera), costos (insumos, permiso). En una hoja se ve todo el negocio.</p>",
      terms:[["Segmentos", "A quién se le vende."], ["Propuesta de valor", "Problema que se resuelve o beneficio."], ["Canales", "Cómo se llega al cliente."], ["Relación", "Cómo se mantiene al cliente."], ["Ingresos", "Cómo y cuánto se cobra."], ["Recursos, actividades y socios", "Lo necesario para operar."], ["Costos", "Lo que cuesta operar."]] },
    adv:"<p><b>Lean Canvas:</b> variante para startups (problema, solución, métricas clave, ventaja injusta). <b>Validación:</b> entrevistas, prototipos y pruebas piloto antes de invertir. Se complementa con la evaluación económica (VAN) del modelo.</p>",
    sp:{ title:"Llenar el lienzo", params:[],
      script(){ return [
        { t:"Segmento", e:"Plantas mineras medianas;  industria alimentaria", s:"Primero el cliente." },
        { t:"Propuesta", e:"Reducir paradas no planificadas en 30 %", h:"30 %", s:"Un beneficio medible." },
        { t:"Canales y relación", e:"Venta directa y ferias;  ejecutivo dedicado e informe mensual", s:"" },
        { t:"Ingresos", e:"Suscripción mensual por equipo + instalación", s:"Ingreso recurrente." },
        { t:"Operación", e:"Recursos: plataforma, ingenieros;  actividades: instalar, analizar, soporte;  socios: fabricante, nube", s:"" },
        { t:"Costos", e:"Sensores, nube, personal técnico", s:"¿Los ingresos cubren los costos? Se calcula el equilibrio." }]; } },
    vars:[["Bloques", "Componentes del modelo", "—", "9"], ["Ingresos", "Por suscripción e instalación", "$", "—"], ["Costos", "Fijos y por cliente", "$", "—"]],
    sup:"<ul><li>Cada bloque es una hipótesis que hay que validar.</li><li>Los bloques deben ser coherentes entre sí.</li></ul>",
    ex:{ t:"Mantenimiento predictivo con sensores IoT.",
      steps:[["Lado del cliente.", "Valor.", "Segmentos, propuesta, canales, relación, ingresos.", ""], ["Lado operativo.", "Cómo se entrega.", "Socios, actividades, recursos, costos.", ""], ["Coherencia.", "¿Calza?", "Suscripción mensual financia la nube y el soporte.", "Validar con 3 plantas piloto."]],
      r:"modelo de suscripción con propuesta medible (−30 % de paradas); siguiente paso: piloto y cálculo del equilibrio de clientes." },
    real:"<p>Herramienta estándar en incubadoras (CORFO, Start-Up Chile) y en cursos de emprendimiento. Su fuerza es la conversación que genera, no el formato.</p>",
    sim:"canvas",
    chk(){ return [["Bloques", CVB.length, 9]]; },
    quiz:[["«Plantas mineras medianas» va en:", ["Propuesta de valor", "Segmentos de clientes", "Socios clave", "Canales"], 1, "A quién se vende."], ["La propuesta de valor responde a:", ["¿Cuánto cuesta?", "¿Qué problema le resuelvo al cliente?", "¿Quién es mi proveedor?", "¿Dónde vendo?"], 1, "Es el corazón del modelo."], ["Los bloques del canvas deben tratarse como:", ["Hechos", "Hipótesis por validar", "Requisitos legales", "Indicadores"], 1, "Se validan con clientes."]],
    dec:"si una idea de negocio es coherente y qué validar antes de invertir.",
    rel:["foda", "equilibrio", "van-tir"] };

  CSIM.canvas = { title:"Lienzo del negocio y su equilibrio de clientes",
    goal:"cómo los bloques de ingresos y costos determinan cuántos clientes se necesitan para que el negocio sea viable.",
    params:[{ k:"pr", l:"Suscripción por equipo", min:50, max:400, step:10, v:180, u:"mil $/mes", help:"" }, { k:"eq", l:"Equipos por cliente", min:2, max:30, step:1, v:12, u:"", help:"" }, { k:"cl", l:"Clientes", min:0, max:30, step:1, v:8, u:"", help:"" }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.8); },
    E(p){ const ing = p.cl * p.eq * p.pr * 1e3, cv = p.cl * p.eq * 45e3, cf = 18e6; return { ing, cos: cv + cf, cf, be: cf / (p.eq * (p.pr - 45) * 1e3) }; },
    draw(g, W, H, s, p, C){ const cvH = H * 0.55, c5 = (W - 20) / 5, rows = cvH / 2, x = 10, y = 8, e = this.E(p);
      const pos = [[0, 0, 1, 2], [1, 0, 1, 1], [1, 1, 1, 1], [2, 0, 1, 2], [3, 0, 1, 1], [3, 1, 1, 1], [4, 0, 1, 2]]; pos.forEach(([cx, cy, w, h], k) => { box(g, x + cx * c5 + 1, y + cy * rows + 1, w * c5 - 2, h * rows - 2, k === 3 ? C.c2 : C.surf, C.line); wrap(g, CVB[k][0], x + cx * c5 + 6, y + cy * rows + 16, w * c5 - 12, 13, k === 3 ? C.surf : C.c1, C, "left", true); });
      const yb = y + cvH; box(g, x + 1, yb + 2, W / 2 - 12, 30, C.surf, C.line); box(g, W / 2 + 1, yb + 2, W / 2 - 12, 30, C.surf, C.line); SIMG.text(g, "Costos " + n(e.cos / 1e6, 1) + " MM$/mes", x + 8, yb + 22, C.c3, C, "left", true); SIMG.text(g, "Ingresos " + n(e.ing / 1e6, 1) + " MM$/mes", W / 2 + 8, yb + 22, C.c1, C, "left", true);
      const gy = yb + 44, gh = H - gy - 22, mx = Math.max(e.ing, e.cos, 1) * 1.1, bw = Math.min(120, (W - 40) / 3); bar(g, W / 2 - bw - 8, gy + gh, bw, -gh * e.cos / mx * s.t, C.c3); bar(g, W / 2 + 8, gy + gh, bw, -gh * e.ing / mx * s.t, C.c1);
      SIMG.text(g, (e.ing >= e.cos ? "Utilidad " : "Pérdida ") + n(Math.abs(e.ing - e.cos) / 1e6, 1) + " MM$/mes", W / 2, H - 6, e.ing >= e.cos ? C.ok : C.bad, C, "center", true); },
    metrics(s, p){ const e = this.E(p); return [["Ingresos mensuales", "$ " + n(e.ing)], ["Costos mensuales", "$ " + n(e.cos)], ["Clientes para el equilibrio", p.pr > 45 ? n(Math.ceil(e.be)) : "nunca"], ["Supuestos", "costo fijo $ 18 MM/mes; $ 45 mil por equipo"]]; },
    ann(s, p){ return "Arriba, los bloques del lienzo (la propuesta de valor en el centro). Abajo, los bloques de costos e ingresos convertidos en números con supuestos didácticos."; },
    concl(s, p){ const e = this.E(p); return "<p>Se necesitan unos <b>" + (p.pr > 45 ? n(Math.ceil(e.be)) : "—") + " clientes</b> para cubrir los costos.</p><p><b>Qué demuestra:</b> un modelo atractivo debe además cerrar en números.</p><p><b>Qué decisión informa:</b> precio, segmento y meta comercial del piloto.</p>"; } };

  /* ===================== RACI ===================== */
  const RR = ["Gerente", "J. proy.", "Ing. proc.", "Mant.", "Calidad"];
  const RA = [["Definir alcance", "ARCIC"], ["Levantar proceso", "IARCC"], ["Diseñar mejora", "IARCC"], ["Validar con piloto", "IARRR"], ["Aprobar inversión", "ARC-I"], ["Capacitar operadores", "-ARIC"]];
  const rCheck = M => M.map(([a, r]) => { const A = (r.match(/A/g) || []).length, R = (r.match(/R/g) || []).length; return A !== 1 ? "debe haber exactamente un A" : R < 1 ? "falta un R" : ""; });
  CRS.raci = {
    kw:"raci matriz de responsabilidades responsable aprobador consultado informado roles proyecto gestion",
    ess:{ pts:["Asigna a cada actividad quién es <b>R</b> (la hace), <b>A</b> (aprueba y rinde cuentas), <b>C</b> (es consultado) e <b>I</b> (es informado).", "Regla de oro: <b>un solo A por actividad</b>.", "Al menos un R por actividad; demasiados C hacen lento el proyecto.", "Evita el «yo pensé que lo hacías tú»."],
      fx:"Por cada actividad: exactamente 1 A;  al menos 1 R;  C e I según necesidad", when:"un proyecto involucra varias áreas y hay confusión sobre quién hace o decide qué." },
    intro:{ prob:"<p>Un proyecto de mejora involucra a gerencia, jefe de proyecto, procesos, mantención y calidad. En la última reunión nadie sabía quién debía aprobar la inversión. ¿Cómo evitarlo?</p>",
      anal:"<p>En un trabajo grupal: quien escribe (R), quien entrega y responde ante el profesor (A), a quien se le pide opinión (C) y quien solo se entera (I). Si hay dos «A», nadie sabe quién decide.</p>",
      terms:[["R", "Responsable: ejecuta la tarea."], ["A", "Aprobador (accountable): responde por el resultado; uno solo."], ["C", "Consultado: aporta antes (comunicación de ida y vuelta)."], ["I", "Informado: se le avisa después (comunicación de ida)."], ["Rol", "Cargo o persona en la matriz."]] },
    adv:"<p><b>Revisión por columnas:</b> un rol con muchos R puede estar sobrecargado; uno sin R ni A quizás sobra en el proyecto. Variantes: RASCI (agrega S, soporte).</p>",
    sp:{ title:"Revisar una matriz RACI", params:[],
      script(){ const e = rCheck(RA); return [
        { t:"Roles", e:RR.join(" · "), s:"Columnas." },
        { t:"Actividades", e:RA.map(a => a[0]).join(" · "), s:"Filas." },
        { t:"Fila 1", e:"Definir alcance: A = gerente;  R = jefe de proyecto;  C = procesos y calidad;  I = mantención", s:"Un A y un R: correcto." },
        { t:"Regla A", e:"Filas con un solo A: " + e.filter(x => !x).length + " de " + RA.length, h:e.filter(x => !x).length + " de " + RA.length, s:"Todas cumplen." },
        { t:"Carga", e:"R por rol: " + RR.map((r, k) => r + " " + RA.filter(a => a[1][k] === "R").length).join(";  "), s:"Ingeniero de procesos concentra la ejecución." }]; } },
    vars:[["R", "Responsable", "—", "≥ 1 por fila"], ["A", "Aprobador", "—", "= 1 por fila"], ["C", "Consultado", "—", "pocos"], ["I", "Informado", "—", "—"]],
    sup:"<ul><li>Roles definidos (no nombres que cambian).</li><li>Acordada con todos los involucrados.</li></ul>",
    ex:{ t:"Proyecto de mejora con 5 roles y 6 actividades.",
      steps:[["Lleno la matriz.", "Acuerdo del equipo.", "6 × 5 celdas.", ""], ["Verifico un A por fila.", "Regla de oro.", "6 de 6 cumplen.", ""], ["Reviso carga por columnas.", "Sobrecarga.", "Ingeniero de procesos: 4 R de 6.", "Asignar apoyo."]],
      r:"matriz válida (un A por actividad); se detectó sobrecarga del ingeniero de procesos." },
    real:"<p>Se usa en gestión de proyectos (PMBOK), en implementaciones de ERP y en sistemas de gestión ISO para definir responsabilidades documentadas.</p>",
    sim:"raci",
    chk(){ return [["Filas válidas", rCheck(RA).filter(x => !x).length, 6], ["R de procesos", RA.filter(a => a[1][2] === "R").length, 4]]; },
    quiz:[["¿Cuántos A debe tener cada actividad?", ["Ninguno", "Exactamente uno", "Al menos dos", "Todos los roles"], 1, "Un solo dueño del resultado."], ["La diferencia entre C e I es que el C:", ["Ejecuta", "Es consultado antes y opina", "Aprueba", "No participa"], 1, "Comunicación de ida y vuelta."], ["Un rol con R en casi todas las actividades indica:", ["Buen diseño", "Posible sobrecarga", "Que sobra", "Que es el A"], 1, "Revisar la carga."]],
    dec:"quién hace, decide, opina y se entera en cada actividad.",
    rel:["sipoc", "foda", "mejora-continua"] };

  CSIM.raci = { title:"Matriz RACI con validación automática",
    goal:"cómo se detectan errores típicos de una matriz (dos aprobadores, actividad sin responsable) y la sobrecarga de un rol.",
    params:[{ k:"err", l:"Introducir un error", min:0, max:2, step:1, v:0, fmt:v => ["ninguno", "dos A en «Validar»", "sin R en «Aprobar»"][v], u:"", help:"" }],
    init(){ return { t:0 }; }, onParam(s){ s.t = 0; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.8); },
    M(p){ return RA.map(([a, r], k) => [a, p.err === 1 && k === 3 ? "AARRR" : p.err === 2 && k === 4 ? "ACC-I" : r]); },
    draw(g, W, H, s, p, C){ const M = this.M(p), e = rCheck(M), lw = Math.min(150, W * 0.32), cw = (W - lw - 14) / 5, rh = (H - 60) / (M.length + 1), col = { R:C.c1, A:C.c2, C:C.c3, I:C.muted, "-":C.line };
      RR.forEach((r, k) => wrap(g, r, lw + k * cw + cw / 2, 18, cw - 4, 12, C.ink, C, "center", true));
      M.forEach(([a, r], i) => { const y = 34 + i * rh, K = Math.ceil(5 * s.t); wrap(g, a, 10, y + rh / 2 + 4, lw - 16, 12, e[i] ? C.bad : C.ink, C, "left", !!e[i]);
        for (let k = 0; k < K; k++) { const ch = r[k]; box(g, lw + k * cw + 2, y + 2, cw - 4, rh - 4, ch === "-" ? C.surf : col[ch], C.line); SIMG.text(g, ch, lw + k * cw + cw / 2, y + rh / 2 + 5, ch === "-" ? C.muted : C.surf, C, "center", true); } });
      const bad = e.map((x, i) => x ? M[i][0] + ": " + x : "").filter(x => x); SIMG.text(g, bad.length ? "⚠ " + bad[0] : "✓ Todas las actividades tienen un A y al menos un R", 10, H - 12, bad.length ? C.bad : C.ok, C, "left", true); },
    metrics(s, p){ const M = this.M(p), e = rCheck(M); return [["Actividades válidas", n(e.filter(x => !x).length) + " de " + M.length]].concat(RR.map((r, k) => ["R de " + r, n(M.filter(a => a[1][k] === "R").length)])); },
    ann(s, p){ return p.err ? "La validación detectó el error: la fila queda en rojo. Una matriz con dos A o sin R genera conflictos o tareas huérfanas." : "Azul = R, naranja = A, verde = C, gris = I. Revisa por filas (un A) y por columnas (carga de cada rol)."; },
    concl(s, p){ return "<p>" + (p.err ? "Hay un error en la matriz." : "La matriz es válida.") + "</p><p><b>Qué demuestra:</b> reglas simples evitan confusiones de responsabilidad.</p><p><b>Qué decisión informa:</b> asignación de tareas y cargas del equipo.</p>"; } };

  /* ===================== IPER ===================== */
  const IP = [["Trabajo en altura sin línea de vida", 4, 4], ["Manejo manual de sacos de 25 kg", 4, 2], ["Ruido en sala de compresores", 2, 2], ["Corte con esmeril angular", 2, 4], ["Tropiezo con cables en oficina", 2, 1], ["Contacto con químicos de limpieza", 1, 2]];
  const lvl = v => v >= 16 ? "Intolerable" : v >= 8 ? "Importante" : v >= 4 ? "Moderado" : "Tolerable";
  CRS.iper = {
    kw:"iper matriz de riesgo identificacion de peligros evaluacion de riesgos probabilidad consecuencia vep jerarquia de controles prevencion ds 44 ley 16744",
    ess:{ pts:["<b>Peligro</b>: fuente de daño (altura, ruido). <b>Riesgo</b>: combinación de probabilidad y consecuencia de que ese daño ocurra.", "Valor esperado de pérdida: <b>VEP = probabilidad × consecuencia</b> (escala 1, 2, 4).", "Según el VEP: tolerable, moderado, importante o intolerable (detener la tarea).", "Controles por jerarquía: eliminar → sustituir → ingeniería → administrativos → EPP."],
      fx:"VEP = P × C;   P, C ∈ {1, 2, 4};   16 intolerable;  8 importante;  4 moderado;  1 a 2 tolerable", when:"evalúas los riesgos de un puesto, una tarea o un proyecto (exigido por el DS 44 en Chile)." },
    intro:{ prob:"<p>En una planta hay trabajo en altura sin línea de vida, manejo de sacos de 25 kg, ruido, uso de esmeril, cables sueltos y químicos de limpieza. ¿Qué atender primero?</p>",
      anal:"<p>Cruzar la calle mirando el celular: la probabilidad de un accidente y su gravedad son altas. Un corte con papel: muy probable, pero leve. La matriz ordena los riesgos para atacar primero los graves y probables.</p>",
      terms:[["Peligro", "Fuente con potencial de daño."], ["Riesgo", "Probabilidad × consecuencia."], ["P", "Probabilidad: 1 baja, 2 media, 4 alta."], ["C", "Consecuencia: 1 leve, 2 grave, 4 muy grave o fatal."], ["VEP", "Valor esperado de pérdida."], ["Riesgo residual", "El que queda después de los controles."], ["EPP", "Equipo de protección personal (última barrera)."]] },
    adv:"<p>En Chile, la Ley 16.744 y el DS 44 (2024) exigen gestionar los riesgos con una matriz IPER y un programa de trabajo preventivo. Los controles se priorizan por jerarquía: el EPP no reemplaza a controles de ingeniería.</p>",
    sp:{ title:"Evaluar y priorizar", params:[{ k:"P", l:"Probabilidad (1, 2 o 4)", v:4, u:"" }, { k:"Cc", l:"Consecuencia (1, 2 o 4)", v:4, u:"" }],
      script(p){ const v = p.P * p.Cc; return [
        { t:"Peligro", e:"Trabajo en altura sin línea de vida", s:"Se identifica en terreno." },
        { t:"P y C", e:"P = " + p.P + ";  C = " + p.Cc, s:"Probabilidad y consecuencia." },
        { t:"VEP", e:"VEP = " + p.P + " × " + p.Cc + " = " + v, h:String(v), s:"" },
        { t:"Nivel", e:lvl(v), h:lvl(v), s:v >= 16 ? "Detener la actividad hasta controlar el riesgo." : v >= 8 ? "Controlar antes de continuar." : "Reducir en un plazo definido o mantener controles." },
        { t:"Control", e:"Línea de vida y permiso de trabajo (ingeniería + administrativo)", s:"Con el control, P baja a 1: VEP = 4 (moderado)." }]; } },
    vars:[["P", "Probabilidad", "—", "1, 2, 4"], ["C", "Consecuencia", "—", "1, 2, 4"], ["VEP", "P × C", "—", "1 a 16"], ["Nivel", "Clasificación", "—", "tolerable a intolerable"]],
    sup:"<ul><li>Evaluación hecha en terreno con los trabajadores.</li><li>Se actualiza ante cambios o accidentes.</li></ul>",
    ex:{ t:"6 peligros de una planta.",
      steps:[["Evalúo P y C.", "Cada peligro.", "VEP 16, 8, 8, 4, 2 y 2.", ""], ["Clasifico.", "Prioridad.", "1 intolerable; 2 importantes; 1 moderado; 2 tolerables.", ""], ["Defino controles.", "Jerarquía.", "Altura: línea de vida y permiso (detener mientras tanto).", ""]],
      r:"prioridad 1: trabajo en altura (intolerable, detener). Luego sacos y esmeril (importantes)." },
    real:"<p>Es la herramienta central de los sistemas de gestión de seguridad (ISO 45001) y del DS 44. Los organismos administradores (mutualidades) la revisan en sus asesorías.</p>",
    sim:"iper",
    chk(){ const L = IP.map(r => lvl(r[1] * r[2])), c = k => L.filter(x => x === k).length; return [["Intolerables", c("Intolerable"), 1], ["Importantes", c("Importante"), 2], ["Moderados", c("Moderado"), 1], ["Tolerables", c("Tolerable"), 2]]; },
    quiz:[["P = 2 y C = 4 da un riesgo:", ["Tolerable", "Moderado", "Importante", "Intolerable"], 2, "VEP = 8."], ["¿Cuál es el control más eficaz?", ["EPP", "Capacitación", "Eliminar el peligro", "Señalética"], 2, "Primero en la jerarquía."], ["Ante un riesgo intolerable se debe:", ["Entregar EPP y seguir", "Detener la actividad hasta controlarlo", "Informar a fin de mes", "Nada"], 1, "No se trabaja con riesgo intolerable."]],
    dec:"qué riesgos atender primero y con qué tipo de control.",
    rel:["accidentabilidad", "niosh", "ruido"] };

  CSIM.iper = { title:"Matriz de riesgo: antes y después de los controles",
    goal:"cómo se ubican los peligros en la matriz y cómo los controles los mueven a zonas aceptables.",
    params:[{ k:"ctl", l:"Aplicar controles", min:0, max:1, step:1, v:0, fmt:v => v ? "sí" : "no", u:"", help:"Baja la probabilidad (y a veces la consecuencia)." }],
    init(){ return { t:1 }; }, onParam(s){ s.t = 0; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.8); },
    AFT:[[1, 4], [2, 2], [1, 2], [1, 4], [1, 1], [1, 1]],
    draw(g, W, H, s, p, C){ const lw = 70, sz = Math.min((W - lw - 20) / 3, (H - 60) / 3), X = c => lw + [0, 0, 1, 1, 2][c] * sz, Y = q => 10 + (2 - [0, 0, 1, 1, 2][q]) * sz, colr = v => v >= 16 ? C.bad : v >= 8 ? C.c2 : v >= 4 ? (C.c5 || C.c3) : C.ok;
      [1, 2, 4].forEach(q => [1, 2, 4].forEach(c => { box(g, X(c), Y(q), sz - 2, sz - 2, colr(q * c), null); g.globalAlpha = 1; SIMG.text(g, String(q * c), X(c) + sz - 8, Y(q) + 14, C.surf, C, "right", true); }));
      g.globalAlpha = 1; [1, 2, 4].forEach(q => SIMG.text(g, "P " + q, lw - 6, Y(q) + sz / 2, C.ink, C, "right", true)); [1, 2, 4].forEach(c => SIMG.text(g, "C " + c, X(c) + sz / 2, Y(1) + sz + 14, C.ink, C, "center", true));
      IP.forEach(([l, P, Cc], k) => { const a = p.ctl ? this.AFT[k] : [P, Cc], b = p.ctl ? [P, Cc] : this.AFT[k], f = s.t, px0 = X(b[1]) + 14 + (k % 3) * 18, py0 = Y(b[0]) + 26 + Math.floor(k / 3) * 18, px1 = X(a[1]) + 14 + (k % 3) * 18, py1 = Y(a[0]) + 26 + Math.floor(k / 3) * 18, x = px0 + (px1 - px0) * f, y = py0 + (py1 - py0) * f;
        g.fillStyle = C.ink; g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); SIMG.text(g, String(k + 1), x, y + 4, C.surf, C, "center", true); }); },
    h(W){ return Math.round(Math.min(440, Math.max(340, W * 0.7))); },
    metrics(s, p){ const V = IP.map(([, P, Cc], k) => p.ctl ? this.AFT[k][0] * this.AFT[k][1] : P * Cc), c = t => V.filter(v => lvl(v) === t).length; return [["Intolerables", n(c("Intolerable"))], ["Importantes", n(c("Importante"))], ["Moderados", n(c("Moderado"))], ["Tolerables", n(c("Tolerable"))]].concat(IP.map(([l], k) => [(k + 1) + ". " + l, lvl(V[k])])); },
    ann(s, p){ return p.ctl ? "Con controles, los peligros bajan en la matriz: ninguno queda intolerable. Los sacos siguen en moderado: requieren seguimiento." : "Cada círculo numerado es un peligro (lista en las métricas). Arriba a la derecha está lo más grave y probable."; },
    concl(s, p){ return "<p>" + (p.ctl ? "Con los controles, el peor riesgo residual es moderado." : "Sin controles, hay 1 riesgo intolerable y 2 importantes.") + "</p><p><b>Qué demuestra:</b> la matriz prioriza; los controles de ingeniería mueven el riesgo más que el EPP.</p><p><b>Qué decisión informa:</b> orden y tipo de medidas preventivas.</p>"; } };

  /* ===================== ACCIDENTABILIDAD ===================== */
  const DSL = typeof DS67 !== "undefined" ? DS67 : [[32, 0], [64, 0.34], [96, 0.68], [128, 1.02], [160, 1.36], [Infinity, 6.8]];
  const cot = ts => { for (const [lim, c] of DSL) if (ts <= lim) return c; return 6.8; };
  const acc = (N, a, d, h) => { const HH = N * h; return { HH, TA: a / N * 100, TS: d / N * 100, IF: a * 1e6 / HH, IG: d * 1e6 / HH, DP: a ? d / a : 0 }; };
  CRS.accidentabilidad = {
    kw:"accidentabilidad tasa de accidentabilidad siniestralidad indice de frecuencia indice de gravedad dias perdidos ds 67 cotizacion adicional ley 16744 mutual",
    ess:{ pts:["<b>Tasa de accidentabilidad</b>: accidentes con tiempo perdido por cada 100 trabajadores.", "<b>Tasa de siniestralidad</b>: días perdidos por cada 100 trabajadores.", "<b>Índice de frecuencia</b> e <b>índice de gravedad</b>: por millón de horas trabajadas (comparables entre empresas).", "En Chile (DS 67), la siniestralidad define la <b>cotización adicional</b> que paga la empresa."],
      fx:"TA = accidentes ÷ trabajadores × 100;   TS = días perdidos ÷ trabajadores × 100;   IF = accidentes × 10⁶ ÷ HHT;   IG = días × 10⁶ ÷ HHT", when:"mides el desempeño de seguridad o calculas el costo del seguro de accidentes." },
    intro:{ prob:"<p>Una empresa de 250 trabajadores tuvo 9 accidentes con tiempo perdido y 132 días perdidos en el año (2.000 horas por persona). ¿Cómo está su seguridad y cuánto le cuesta?</p>",
      anal:"<p>Comparar «9 accidentes» entre una pyme y una minera grande no sirve. Por eso se divide por el número de trabajadores o las horas trabajadas, igual que se comparan goles por partido y no goles totales.</p>",
      terms:[["Accidente con tiempo perdido", "El trabajador no puede volver al día siguiente."], ["Días perdidos", "Días de reposo por accidentes."], ["HHT", "Horas hombre trabajadas."], ["TA", "Tasa de accidentabilidad."], ["TS", "Tasa de siniestralidad."], ["IF / IG", "Índices de frecuencia y gravedad."], ["Cotización adicional", "Recargo del seguro según siniestralidad (DS 67)."]] },
    adv:"<p>La cotización total del seguro de la Ley 16.744 = básica 0,90 % + adicional según actividad o siniestralidad (0 a 6,8 %). Bajar los días perdidos reduce directamente ese costo. Los indicadores son reactivos: se complementan con indicadores proactivos (inspecciones, capacitaciones, observaciones de conducta).</p>",
    sp:{ title:"Tasas e índices", params:[{ k:"N", l:"Trabajadores", v:250, u:"" }, { k:"a", l:"Accidentes", v:9, u:"" }, { k:"d", l:"Días perdidos", v:132, u:"" }],
      script(p){ const r = acc(p.N, p.a, p.d, 2000); return [
        { t:"HHT", e:"HHT = " + n(p.N) + " · 2.000 = " + n(r.HH), s:"Horas trabajadas en el año." },
        { t:"TA", e:"TA = " + p.a + " ÷ " + p.N + " × 100 = " + n(r.TA, 2) + " %", h:n(r.TA, 2) + " %", s:"Accidentes por cada 100 trabajadores." },
        { t:"TS", e:"TS = " + p.d + " ÷ " + p.N + " × 100 = " + n(r.TS, 1), h:n(r.TS, 1), s:"Días perdidos por cada 100 trabajadores." },
        { t:"IF e IG", e:"IF = " + p.a + " × 10⁶ ÷ " + n(r.HH) + " = " + n(r.IF, 2) + ";  IG = " + n(r.IG, 1), s:"Por millón de horas: comparable." },
        { t:"DS 67", e:"TS " + n(r.TS, 1) + " → cotización adicional " + n(cot(r.TS), 2) + " %", h:n(cot(r.TS), 2) + " %", s:"Recargo sobre las remuneraciones imponibles." }]; } },
    vars:[["N", "Trabajadores promedio", "personas", "—"], ["a", "Accidentes con tiempo perdido", "—", "—"], ["d", "Días perdidos", "días", "—"], ["HHT", "Horas hombre trabajadas", "h", "—"], ["TA", "Tasa de accidentabilidad", "%", "—"], ["TS", "Tasa de siniestralidad", "días/100", "—"], ["IF", "Índice de frecuencia", "por 10⁶ h", "—"], ["IG", "Índice de gravedad", "días por 10⁶ h", "—"]],
    sup:"<ul><li>Solo accidentes con tiempo perdido (no trayecto, según criterio del indicador).</li><li>Promedio de trabajadores del período.</li></ul>",
    ex:{ t:"250 trabajadores; 9 accidentes; 132 días perdidos; 2.000 h por persona.",
      steps:[["HHT.", "Base.", "500.000 h.", ""], ["Tasas.", "Por 100 trabajadores.", "TA 3,60 %; TS 52,8.", ""], ["Índices.", "Por millón de horas.", "IF 18,00; IG 264,0.", "14,7 días por accidente."], ["Cotización.", "DS 67.", "0,34 % adicional.", "Bajar TS a 32 elimina el recargo."]],
      r:"TA 3,60 %, TS 52,8, IF 18 e IG 264; la siniestralidad genera una cotización adicional de 0,34 %." },
    real:"<p>Las mutualidades (ACHS, Mutual de Seguridad, IST) publican tasas por actividad; la SUSESO fiscaliza. Muchas licitaciones mineras exigen IF e IG bajo cierto umbral para participar.</p>",
    sim:"acc",
    chk(){ const r = acc(250, 9, 132, 2000); return [["TA", r.TA, 3.6], ["TS", r.TS, 52.8], ["IF", r.IF, 18], ["IG", r.IG, 264], ["Cotización", cot(r.TS), 0.34]]; },
    quiz:[["El índice de frecuencia se expresa por:", ["100 trabajadores", "Millón de horas trabajadas", "Año", "Accidente"], 1, "Permite comparar empresas de distinto tamaño."], ["Si bajan los días perdidos, baja directamente:", ["La TA", "La TS y la cotización adicional", "El IF", "El número de trabajadores"], 1, "La TS depende de los días."], ["Un IG alto con IF bajo indica:", ["Muchos accidentes leves", "Pocos accidentes pero graves", "Ningún accidente", "Error de cálculo"], 1, "Muchos días por accidente."]],
    dec:"metas de seguridad, comparación con la industria y costo del seguro.",
    rel:["iper", "kpis", "niosh"] };

  CSIM.acc = { title:"Accidentes, días perdidos y costo del seguro",
    goal:"cómo la frecuencia y la gravedad de los accidentes cambian los indicadores y la cotización adicional (DS 67).",
    params:[{ k:"a", l:"Accidentes con tiempo perdido", min:0, max:30, step:1, v:9, u:"", help:"" }, { k:"dp", l:"Días perdidos por accidente", min:1, max:40, step:0.1, v:14.7, u:"días", fmt:v => n(v, 1) + " días", help:"" }, { k:"N", l:"Trabajadores", min:50, max:1000, step:10, v:250, u:"", help:"" }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.8); },
    draw(g, W, H, s, p, C){ const r = acc(p.N, p.a, p.a * p.dp, 2000), x0 = 50, x1 = W - 14, y0 = H - 40, top = 36, X = ts => x0 + Math.min(ts, 200) / 200 * (x1 - x0);
      SIMG.text(g, "Siniestralidad (días perdidos / 100 trab.) → cotización", x0, 16, C.muted, C, "left");
      DSL.slice(0, 6).forEach(([lim, c], k) => { const a = k ? DSL[k - 1][0] : 0, b = Math.min(lim, 200), h = (y0 - top) * (c + 0.15) / 2.6; bar(g, X(a) + 1, y0, X(b) - X(a) - 2, -h, k ? C.c3 : C.ok); g.globalAlpha = 1; SIMG.text(g, n(c, 2) + " %", (X(a) + X(b)) / 2, y0 - h - 4, C.ink, C, "center", true); SIMG.text(g, String(b), X(b), y0 + 14, C.muted, C, "center"); });
      const x = X(r.TS * s.t); g.strokeStyle = C.c2; g.lineWidth = 3; g.beginPath(); g.moveTo(x, top - 8); g.lineTo(x, y0); g.stroke(); g.fillStyle = C.c2; g.beginPath(); g.moveTo(x - 7, top - 14); g.lineTo(x + 7, top - 14); g.lineTo(x, top - 4); g.fill(); SIMG.text(g, "TS " + n(r.TS, 1), x + 8, top + 6, C.ink, C, "left", true); },
    metrics(s, p){ const r = acc(p.N, p.a, p.a * p.dp, 2000); return [["Tasa de accidentabilidad", n(r.TA, 2) + " %"], ["Tasa de siniestralidad", n(r.TS, 1)], ["Índice de frecuencia", n(r.IF, 2)], ["Índice de gravedad", n(r.IG, 1)], ["Cotización adicional", n(cot(r.TS), 2) + " %"]]; },
    ann(s, p){ return "Cada escalón es un tramo del DS 67: mientras más días perdidos por cada 100 trabajadores, más alto el recargo del seguro. La flecha es tu empresa."; },
    concl(s, p){ const r = acc(p.N, p.a, p.a * p.dp, 2000); return "<p>TS = " + n(r.TS, 1) + " → cotización adicional <b>" + n(cot(r.TS), 2) + " %</b>.</p><p><b>Qué demuestra:</b> reducir la gravedad (volver antes con trabajo adaptado, mejor atención) baja el costo tanto como reducir la frecuencia.</p><p><b>Qué decisión informa:</b> metas y presupuesto de prevención.</p>"; } };

  /* ===================== HUELLA DE CARBONO ===================== */
  const HF = [["Electricidad SEN", 420000, "kWh", 0.2421, 2], ["Diésel", 18000, "L", 2.68, 1], ["Gas natural", 22000, "m³", 1.96, 1], ["GLP", 6500, "kg", 2.94, 1], ["Gasolina", 3500, "L", 2.31, 1]];
  const hu = (F, P) => { const e = F.map(f => f[1] * f[3] / 1000), T = e.reduce((a, b) => a + b, 0), A1 = e.filter((x, k) => F[k][4] === 1).reduce((a, b) => a + b, 0); return { e, T, A1, A2: T - A1, I: T * 1e6 / P }; };
  CRS.huella = {
    kw:"huella de carbono emisiones gei co2e alcance 1 alcance 2 alcance 3 factor de emision huella chile sostenibilidad cambio climatico",
    ess:{ pts:["Emisiones (t CO₂e) = <b>dato de actividad × factor de emisión</b> ÷ 1.000.", "<b>Alcance 1</b>: combustibles que la empresa quema (calderas, vehículos). <b>Alcance 2</b>: electricidad comprada. <b>Alcance 3</b>: cadena de valor (opcional en la mayoría de los reportes).", "La <b>intensidad</b> (g CO₂e por unidad) permite comparar años con distinta producción.", "Se reduce con eficiencia energética, cambio de combustible y energía renovable."],
      fx:"E = Σ (actividadᵢ × factorᵢ) ÷ 1.000;   intensidad = E ÷ producción", when:"reportas emisiones (Huella Chile, clientes, licitaciones) o evalúas proyectos de eficiencia energética." },
    intro:{ prob:"<p>Una planta consumió 420.000 kWh, 18.000 L de diésel, 22.000 m³ de gas natural, 6.500 kg de GLP y 3.500 L de gasolina, y produjo 150.000 unidades. ¿Cuál es su huella y dónde reducir?</p>",
      anal:"<p>Es como una boleta: cada consumo (luz, gas, bencina) tiene un «precio» en CO₂ (el factor). Sumando todas las líneas se obtiene la cuenta total de emisiones.</p>",
      terms:[["CO₂e", "Dióxido de carbono equivalente (incluye otros gases)."], ["Factor de emisión", "kg CO₂e por unidad de actividad."], ["Alcance 1", "Emisiones directas."], ["Alcance 2", "Indirectas por electricidad."], ["Alcance 3", "Otras indirectas (proveedores, transporte, uso del producto)."], ["Intensidad", "Emisiones por unidad producida."]] },
    adv:"<p>El factor del Sistema Eléctrico Nacional baja cada año por la entrada de energía solar y eólica. Un contrato de suministro renovable (PPA con certificados) puede llevar el alcance 2 casi a cero. Norma de referencia: GHG Protocol e ISO 14064; en Chile, programa Huella Chile del Ministerio del Medio Ambiente.</p>",
    sp:{ title:"Calcular la huella", params:[],
      script(){ const r = hu(HF, 150000); return [
        { t:"Electricidad", e:"420.000 kWh × 0,2421 ÷ 1.000 = " + n(r.e[0], 2) + " t", h:n(r.e[0], 2) + " t", s:"Alcance 2." },
        { t:"Diésel", e:"18.000 L × 2,68 ÷ 1.000 = " + n(r.e[1], 2) + " t", s:"Alcance 1." },
        { t:"Otros", e:"Gas natural " + n(r.e[2], 2) + ";  GLP " + n(r.e[3], 2) + ";  gasolina " + n(r.e[4], 2) + " t", s:"Alcance 1." },
        { t:"Total", e:"E = " + n(r.T, 1) + " t CO₂e  (alcance 1: " + n(r.A1, 1) + ";  alcance 2: " + n(r.A2, 1) + ")", h:n(r.T, 1) + " t", s:"" },
        { t:"Intensidad", e:n(r.T, 1) + " t ÷ 150.000 u = " + n(r.I, 1) + " g CO₂e por unidad", h:n(r.I, 1) + " g", s:"Indicador para seguir en el tiempo." }]; } },
    vars:[["Actividad", "Cantidad consumida", "kWh, L, m³, kg", "—"], ["Factor", "Factor de emisión", "kg CO₂e/unidad", "según fuente"], ["E", "Emisiones", "t CO₂e", "—"], ["Intensidad", "Emisiones por unidad", "g CO₂e/u", "—"]],
    sup:"<ul><li>Factores de emisión actualizados y de fuente oficial.</li><li>Datos de actividad de facturas o medidores.</li></ul>",
    ex:{ t:"Consumos anuales de la planta; 150.000 unidades.",
      steps:[["Multiplico cada consumo por su factor.", "Emisiones por fuente.", "Electricidad 101,7 t; diésel 48,2; gas natural 43,1; GLP 19,1; gasolina 8,1.", ""], ["Sumo.", "Total.", "220,2 t CO₂e.", "Alcance 1: 118,6; alcance 2: 101,7."], ["Intensidad.", "Por unidad.", "1.468,2 g/u.", "La electricidad es 46 %: primera palanca."]],
      r:"220,2 t CO₂e al año (1.468 g por unidad). Mayor fuente: electricidad (46 %); un PPA renovable la reduciría casi a cero." },
    real:"<p>Exigida cada vez más por clientes internacionales y licitaciones; el programa Huella Chile reconoce a las organizaciones que cuantifican, reducen y neutralizan. La Ley Marco de Cambio Climático fija carbono neutralidad a 2050.</p>",
    sim:"huella",
    chk(){ const r = hu(HF, 150000); return [["Total", r.T, (420000 * 0.2421 + 18000 * 2.68 + 22000 * 1.96 + 6500 * 2.94 + 3500 * 2.31) / 1000], ["Alcance 2", r.A2, 101.682]]; },
    quiz:[["El consumo de electricidad de la red es:", ["Alcance 1", "Alcance 2", "Alcance 3", "No se cuenta"], 1, "Indirecta por energía comprada."], ["El diésel de los grupos electrógenos propios es:", ["Alcance 1", "Alcance 2", "Alcance 3", "No se cuenta"], 0, "Combustión directa."], ["Para comparar años con distinta producción conviene usar:", ["Emisiones totales", "Intensidad por unidad", "Solo alcance 3", "Número de máquinas"], 1, "Normaliza por la actividad."]],
    dec:"dónde reducir emisiones primero y cómo reportarlas.",
    rel:["kpis", "equilibrio", "van-tir"] };

  CSIM.huella = { title:"Huella de carbono por fuente y medidas de reducción",
    goal:"qué fuentes pesan más y cuánto reduce cada medida (energía renovable, cambio de combustible, eficiencia).",
    params:[{ k:"ren", l:"Electricidad renovable (PPA)", min:0, max:100, step:5, v:0, u:"%", help:"Baja el alcance 2." }, { k:"dz", l:"Diésel reemplazado por electricidad", min:0, max:100, step:5, v:0, u:"%", help:"Grúas eléctricas, red en vez de grupo." }, { k:"ef", l:"Eficiencia energética", min:0, max:30, step:1, v:0, u:"%", help:"Menos consumo en todas las fuentes." }],
    init(){ return { t:0 }; }, tick(s, p, dt){ s.t = Math.min(1, s.t + dt * 0.8); },
    F(p){ const f = 1 - p.ef / 100, dzL = 18000 * p.dz / 100, kWhx = dzL * 3.5; return HF.map((r, k) => { const q = r.slice(); q[1] = (k === 0 ? r[1] + kWhx : k === 1 ? r[1] - dzL : r[1]) * f; if (k === 0) q[3] = r[3] * (1 - p.ren / 100); return q; }); },
    draw(g, W, H, s, p, C){ const b = hu(HF, 150000), a = hu(this.F(p), 150000), x0 = 20, x1 = W - 20, bh = 42, Xs = v => (x1 - x0) * v / b.T, cols = [C.c1, C.c2, C.c3, C.c4 || C.c2, C.c5 || C.muted];
      [["Antes", b], ["Con medidas", a]].forEach(([l, r], j) => { const y = 34 + j * (bh + 46); SIMG.text(g, l + ": " + n(r.T, 1) + " t CO₂e", x0, y - 8, C.ink, C, "left", true); let x = x0; r.e.forEach((e, k) => { const w = Xs(e) * (j ? s.t : 1); bar(g, x, y, Math.max(0, w - 2), bh, cols[k]); if (w > 46) SIMG.text(g, n(e, 0), x + w / 2, y + bh / 2 + 4, C.surf, C, "center", true); x += w; }); });
      const ly = 34 + 2 * (bh + 46); HF.forEach(([l], k) => { const cx = x0 + (k % 3) * ((x1 - x0) / 3), cy = ly + Math.floor(k / 3) * 18; bar(g, cx, cy - 9, 10, 10, cols[k]); SIMG.text(g, l, cx + 14, cy, C.muted, C, "left"); });
      SIMG.text(g, "Reducción: " + n((1 - a.T / b.T) * 100, 1) + " %", x1, H - 10, (a.T < b.T) ? C.ok : C.ink, C, "right", true); },
    metrics(s, p){ const a = hu(this.F(p), 150000); return [["Emisiones totales", n(a.T, 1) + " t CO₂e"], ["Alcance 1", n(a.A1, 1) + " t"], ["Alcance 2", n(a.A2, 1) + " t"], ["Intensidad", n(a.I, 1) + " g/u"]]; },
    ann(s, p){ return p.ren >= 80 ? "Con electricidad renovable, el alcance 2 casi desaparece: la mayor parte de la huella pasa a ser combustibles." : "Cada color es una fuente. Mueve los controles para ver cuánto reduce cada medida."; },
    concl(s, p){ const b = hu(HF, 150000), a = hu(this.F(p), 150000); return "<p>Las medidas reducen la huella en <b>" + n((1 - a.T / b.T) * 100, 1) + " %</b> (de " + n(b.T, 1) + " a " + n(a.T, 1) + " t).</p><p><b>Qué demuestra:</b> conviene atacar primero la fuente más grande.</p><p><b>Qué decisión informa:</b> plan de reducción y su prioridad.</p>"; } };
})();
