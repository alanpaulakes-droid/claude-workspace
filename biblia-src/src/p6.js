/* ---------------- SEGURIDAD, SALUD Y MEDIO AMBIENTE ---------------- */
/* Tabla del art. 5.° del DS 67 de 1999 (MINTRAB), verificada en el Compendio de Normas de SUSESO: tasa de siniestralidad total → cotización adicional (%) */
const DS67 = [[32, 0], [64, 0.34], [96, 0.68], [128, 1.02], [160, 1.36], [192, 1.70], [224, 2.04], [272, 2.38], [320, 2.72], [368, 3.06], [416, 3.40], [464, 3.74], [512, 4.08], [560, 4.42], [630, 4.76], [700, 5.10], [770, 5.44], [840, 5.78], [910, 6.12], [980, 6.46], [Infinity, 6.80]];
def("accidentabilidad", "seg", {
  t:"Indicadores de accidentabilidad", ico:"TA", d:"Tasa de accidentabilidad, siniestralidad, índices de frecuencia y gravedad (Ley 16.744)",
  ey:"Prevención de riesgos · Ley 16.744 y DS 67",
  lead:"Calcula los indicadores de seguridad que exige el organismo administrador y estima la cotización adicional diferenciada.",
  f:[F("tr", "Promedio de trabajadores del período", 250), F("acc", "Accidentes con tiempo perdido", 9), F("dias", "Días perdidos", 132), F("h", "Horas trabajadas por persona en el período", 2000, { h:"Con jornada de 42 h semanales (Ley 21.561, desde abril 2026) ≈ 2.000 h al año." }), F("inv", "Tasa de siniestralidad por invalideces y muertes (DS 67)", 0, { h:"Si no hubo, 0. La entrega el organismo administrador." })],
  c(v){
    const tr = need(v, "tr", "Trabajadores", { pos:true }), acc = need(v, "acc", "Accidentes", { nn:true }), dias = need(v, "dias", "Días perdidos", { nn:true }), hh = need(v, "h", "Horas", { pos:true }), inv = opt(v, "inv") || 0;
    const HHT = tr * hh, TA = acc / tr * 100, TS = dias / tr * 100, IF = acc * 1e6 / HHT, IG = dias * 1e6 / HHT, TST = TS + inv, ad = DS67.find(r => TST <= r[0])[1];
    let h = kpis([kpi("Tasa de accidentabilidad", nf(TA, 2), "%", TA > 3 ? "bad" : "ok"), kpi("Tasa de siniestralidad temporal", nf(TS, 1), "días/100 trab."), kpi("Índice de frecuencia", nf(IF, 2), "por millón HH"), kpi("Índice de gravedad", nf(IG, 1), "días por millón HH"), kpi("Días perdidos por accidente", acc ? nf(dias / acc, 1) : "—"), kpi("Cotización adicional estimada", nf(ad, 2) + " %", "", "hi")]);
    h += steps([
      { t:"Horas hombre trabajadas", f:"HHT = Trabajadores × Horas por persona", s:n0(tr) + " × " + n0(hh) + " = " + n0(HHT), r:n0(HHT) + " HH" },
      { t:"Tasa de accidentabilidad", f:"TA = (Accidentes con tiempo perdido ÷ Trabajadores) × 100", s:"(" + n0(acc) + " ÷ " + n0(tr) + ") × 100 = " + nf(TA, 2), r:nf(TA, 2) + " %", why:"cuántos trabajadores de cada 100 se accidentaron." },
      { t:"Tasa de siniestralidad", f:"TS = (Días perdidos ÷ Trabajadores) × 100", s:"(" + n0(dias) + " ÷ " + n0(tr) + ") × 100 = " + nf(TS, 1), r:nf(TS, 1), why:"mide la gravedad: días perdidos por cada 100 trabajadores." },
      { t:"Índice de frecuencia (IF)", f:"IF = Accidentes × 1.000.000 ÷ HHT", s:n0(acc) + " × 10⁶ ÷ " + n0(HHT) + " = " + nf(IF, 2), r:nf(IF, 2), why:"permite comparar empresas de distinto tamaño y jornada." },
      { t:"Índice de gravedad (IG)", f:"IG = Días perdidos × 1.000.000 ÷ HHT", s:n0(dias) + " × 10⁶ ÷ " + n0(HHT) + " = " + nf(IG, 1), r:nf(IG, 1) },
      { t:"Cotización adicional (DS 67)", f:"Tasa de siniestralidad total = TS temporal + invalideces y muertes → tabla del art. 5", s:"TST = " + nf(TST, 1) + " → " + nf(ad, 2) + " % de las remuneraciones imponibles", r:nf(ad, 2) + " % adicional", c:ad ? "warn" : "ok", why:"se suma a la cotización básica de 0,90 %. Para el cálculo oficial el DS 67 usa el promedio de tres períodos anuales consecutivos." }
    ]);
    h += note("Valores referenciales. La evaluación oficial la realiza la mutualidad o el ISL con el promedio de los últimos tres períodos (julio a junio).", "info");
    return h;
  },
  rel:["iper", "niosh", "ruido"]
});

def("iper", "seg", {
  t:"Matriz IPER (identificación de peligros y evaluación de riesgos)", ico:"IPER", d:"Probabilidad × consecuencia, nivel de riesgo y medidas de control",
  ey:"Prevención de riesgos · ISO 45001 y DS 44",
  lead:"Evalúa cada peligro con la matriz 3×3 de probabilidad (1, 2, 4) y consecuencia (1, 2, 4) y obtén el valor esperado de la pérdida (VEP).",
  f:[MAT("m", "Tarea o peligro ; probabilidad (1, 2 o 4) ; consecuencia (1, 2 o 4) ; medida de control propuesta", "Trabajo en altura sin línea de vida;4;4;Instalar línea de vida y permiso de trabajo\nManejo manual de sacos de 25 kg;4;2;Ayuda mecánica y capacitación MMC\nRuido en sala de compresores;2;2;Encierro acústico y protectores auditivos\nCorte con esmeril angular;2;4;Guarda, careta facial y bloqueo LOTO\nTropiezo con cables en oficina;2;1;Canalizar cables\nContacto con químicos de limpieza;1;2;Hojas de seguridad (HDS) y guantes de nitrilo")],
  c(v){
    const lvl = x => x >= 16 ? ["bad", "Intolerable", "Detener la actividad hasta controlar el riesgo"] : x >= 8 ? ["bad", "Importante", "Controlar antes de continuar; asignar recursos urgentes"] : x >= 4 ? ["warn", "Moderado", "Reducir el riesgo en un plazo definido"] : ["ok", "Tolerable", "Mantener controles y monitorear"];
    const R = rows(v.m).map(r => { const P = num(r[1]), C0 = num(r[2]); if (![1, 2, 4].includes(P) || ![1, 2, 4].includes(C0)) fail("En «" + r[0] + "» la probabilidad y la consecuencia deben ser 1, 2 o 4."); return { nm:r[0], P, C:C0, V:P * C0, med:r[3] || "" }; });
    if (!R.length) fail("Ingresa al menos un peligro.");
    R.sort((a, b) => b.V - a.V);
    const cnt = k => R.filter(r => lvl(r.V)[1] === k).length;
    let h = kpis([kpi("Intolerables", cnt("Intolerable"), "", cnt("Intolerable") ? "bad" : "ok"), kpi("Importantes", cnt("Importante")), kpi("Moderados", cnt("Moderado")), kpi("Tolerables", cnt("Tolerable"))]);
    h += table(["Peligro / tarea", "P", "C", "VEP", "Nivel", "Acción", "Medida de control"], R.map(r => { const l = lvl(r.V); return [esc(r.nm), r.P, r.C, "<b>" + r.V + "</b>", pill(l[0], l[1]), '<span class="hint">' + l[2] + "</span>", esc(r.med)]; }), { num:[1, 2, 3] });
    const grid = [[4, 8, 16], [2, 4, 8], [1, 2, 4]];
    h += h3("Matriz de evaluación") + table(["Probabilidad \\ Consecuencia", "Ligeramente dañino (1)", "Dañino (2)", "Extremadamente dañino (4)"], [["Alta (4)"].concat(grid[0].map(x => pill(lvl(x)[0], x + " · " + lvl(x)[1]))), ["Media (2)"].concat(grid[1].map(x => pill(lvl(x)[0], x + " · " + lvl(x)[1]))), ["Baja (1)"].concat(grid[2].map(x => pill(lvl(x)[0], x + " · " + lvl(x)[1])))]);
    h += steps([{ t:"Jerarquía de controles", q:"Aplica las medidas en este orden de eficacia: <b>1) eliminación, 2) sustitución, 3) controles de ingeniería, 4) controles administrativos</b> (procedimientos, señalización, capacitación) y <b>5) elementos de protección personal</b>.", why:"el EPP es la última barrera: protege solo a quien lo usa bien y no reduce el peligro." }]);
    return h;
  },
  rel:["accidentabilidad", "amef", "niosh"]
});

const NFM = { 0.2:[1, 1, .95, .95, .85, .85], 0.5:[.97, .97, .92, .92, .81, .81], 1:[.94, .94, .88, .88, .75, .75], 2:[.91, .91, .84, .84, .65, .65], 3:[.88, .88, .79, .79, .55, .55], 4:[.84, .84, .72, .72, .45, .45], 5:[.80, .80, .60, .60, .35, .35], 6:[.75, .75, .50, .50, .27, .27], 7:[.70, .70, .42, .42, .22, .22], 8:[.60, .60, .35, .35, .18, .18], 9:[.52, .52, .30, .30, 0, .15], 10:[.45, .45, .26, .26, 0, .13], 11:[.41, .41, 0, .23, 0, 0], 12:[.37, .37, 0, .21, 0, 0], 13:[0, .34, 0, 0, 0, 0], 14:[0, .31, 0, 0, 0, 0], 15:[0, .28, 0, 0, 0, 0] };
def("niosh", "seg", {
  t:"Levantamiento manual de carga (NIOSH)", ico:"kg", d:"Límite de peso recomendado (LPR) e índice de levantamiento",
  ey:"Ergonomía · Manejo manual de cargas (Ley 20.949)",
  lead:"Evalúa una tarea de levantamiento con la ecuación revisada de NIOSH y compárala con el límite legal chileno.",
  f:[F("w", "Peso de la carga", 18, { u:"kg" }), F("H", "Distancia horizontal manos–tobillos (H)", 40, { u:"cm" }), F("V", "Altura de las manos al inicio (V)", 60, { u:"cm" }), F("D", "Desplazamiento vertical (D)", 70, { u:"cm" }), F("A", "Ángulo de asimetría (giro del tronco)", 30, { u:"°" }), F("F", "Frecuencia", 2, { u:"levantamientos/min" }), SEL("dur", "Duración de la tarea", "2", [["1", "≤ 1 hora"], ["2", "1 a 2 horas"], ["8", "2 a 8 horas"]]), SEL("ag", "Calidad del agarre", "r", [["b", "Bueno (asas)"], ["r", "Regular"], ["m", "Malo"]]), SEL("leg", "Trabajador", "25", [["25", "Hombre adulto (máx. legal 25 kg)"], ["20", "Mujer o menor de 18 (máx. legal 20 kg)"]])],
  c(v){
    const w = need(v, "w", "Peso", { pos:true }), H = need(v, "H", "H", { pos:true }), V = need(v, "V", "V", { nn:true }), D = need(v, "D", "D", { nn:true }), A = need(v, "A", "A", { nn:true }), Fr = need(v, "F", "Frecuencia", { nn:true }), leg = num(v.leg);
    const HM = H <= 25 ? 1 : H > 63 ? 0 : 25 / H, VM = V > 175 ? 0 : 1 - 0.003 * Math.abs(V - 75), DM = D < 25 ? 1 : D > 175 ? 0 : 0.82 + 4.5 / D, AM = A > 135 ? 0 : 1 - 0.0032 * A;
    const keys = Object.keys(NFM).map(Number).sort((a, b) => a - b), fk = keys.find(k => Fr <= k + 1e-9), col = { 1:0, 2:2, 8:4 }[v.dur] + (V >= 75 ? 1 : 0), FM = fk == null ? 0 : NFM[fk][col];
    const CM = v.ag === "b" ? 1 : v.ag === "m" ? 0.9 : (V < 75 ? 0.95 : 1), LPR = 23 * HM * VM * DM * AM * FM * CM, LI = LPR > 0 ? w / LPR : Infinity;
    const cls = LI <= 1 ? ["ok", "Riesgo aceptable"] : LI <= 3 ? ["warn", "Riesgo moderado: rediseñar"] : ["bad", "Riesgo alto: intervención inmediata"];
    let h = kpis([kpi("Límite de peso recomendado", nf(LPR, 2), "kg", "hi"), kpi("Índice de levantamiento", fin(LI) ? nf(LI, 2) : "∞", "", cls[0] === "ok" ? "ok" : "bad"), kpi("Límite legal Chile", leg, "kg", w > leg ? "bad" : "ok")]);
    h += note(pill(cls[0], cls[1]) + (w > leg ? " · La carga de " + nf(w, 1) + " kg supera el máximo legal de " + leg + " kg (Ley 20.949): usa ayuda mecánica." : ""), cls[0] === "ok" && w <= leg ? "ok" : "bad");
    h += table(["Factor", "Fórmula", "Valor"], [["HM horizontal", "25 ÷ H", nf(HM, 3)], ["VM vertical", "1 − 0,003·|V − 75|", nf(VM, 3)], ["DM desplazamiento", "0,82 + 4,5 ÷ D", nf(DM, 3)], ["AM asimetría", "1 − 0,0032·A", nf(AM, 3)], ["FM frecuencia", "Tabla NIOSH (" + (fk != null ? fk + "/min" : "> 15/min") + ", " + { 1:"≤ 1 h", 2:"≤ 2 h", 8:"≤ 8 h" }[v.dur] + ")", nf(FM, 2)], ["CM agarre", "Tabla NIOSH", nf(CM, 2)]], { num:[2] });
    h += steps([
      { t:"Límite de peso recomendado", f:"LPR = 23 kg × HM × VM × DM × AM × FM × CM", s:"LPR = 23 × " + [HM, VM, DM, AM, FM, CM].map(x => nf(x, 3)).join(" × ") + " = " + nf(LPR, 2) + " kg", r:nf(LPR, 2) + " kg", why:"23 kg es la constante de carga en condiciones ideales; cada factor la reduce según la postura y la frecuencia." },
      { t:"Índice de levantamiento", f:"IL = Peso ÷ LPR", s:nf(w, 1) + " ÷ " + nf(LPR, 2) + " = " + (fin(LI) ? nf(LI, 2) : "∞"), r:fin(LI) ? nf(LI, 2) : "∞", c:cls[0] === "ok" ? "ok" : "bad", why:"IL ≤ 1 la mayoría de los trabajadores lo tolera; > 3 la mayoría tiene alto riesgo de lesión lumbar." }
    ]);
    const worst = [["HM", HM, "acerca la carga al cuerpo (reduce H)"], ["VM", VM, "levanta desde altura de nudillos (~75 cm)"], ["DM", DM, "reduce el recorrido vertical"], ["AM", AM, "evita girar el tronco"], ["FM", FM, "reduce la frecuencia o rota tareas"], ["CM", CM, "usa cajas con asas"]].sort((a, b) => a[1] - b[1]);
    h += note("Mayor mejora posible: <b>" + worst[0][0] + "</b> (" + nf(worst[0][1], 2) + ") → " + worst[0][2] + ".", "info");
    return h;
  },
  rel:["iper", "ruido"]
});

def("ruido", "seg", {
  t:"Dosis de ruido ocupacional", ico:"dB", d:"Dosis diaria y nivel equivalente de 8 horas (DS 594 y PREXOR)",
  ey:"Higiene industrial · Exposición a ruido",
  lead:"Ingresa los niveles de ruido y el tiempo de exposición de cada tarea del turno para calcular la dosis diaria.",
  f:[MAT("m", "Tarea ; nivel dB(A) ; horas", "Esmerilado;94;1.5\nPrensa hidráulica;88;3\nSala de compresores;91;0.5\nOficina de planta;68;3")],
  c(v){
    const R = rows(v.m).map(r => ({ nm:r[0], L:num(r[1]), t:num(r[2]) })); if (!R.length || R.some(r => !fin(r.L) || !fin(r.t) || r.t < 0)) fail("Cada fila necesita tarea, nivel en dB(A) y horas.");
    R.forEach(r => { r.T = 8 / Math.pow(2, (r.L - 85) / 3); r.d = r.t / r.T; });
    const D = sum(R.map(r => r.d)), T = sum(R.map(r => r.t)), Leq = 10 * Math.log10(sum(R.map(r => r.t * Math.pow(10, r.L / 10))) / 8);
    const cls = D > 1 ? ["bad", "Sobre el límite permisible"] : D >= 0.5 ? ["warn", "Sobre el nivel de acción (50 %)"] : ["ok", "Bajo el nivel de acción"];
    let h = kpis([kpi("Dosis diaria", pc(D, 0), "", D > 1 ? "bad" : "hi"), kpi("NPSeq 8 h", nf(Leq, 1), "dB(A)"), kpi("Horas evaluadas", nf(T, 1)), kpi("Estado", cls[1], "", cls[0] === "ok" ? "ok" : "bad")]);
    h += table(["Tarea", "dB(A)", "Horas", "Tiempo permitido (h)", "Dosis parcial"], R.map(r => [esc(r.nm), nf(r.L, 1), nf(r.t, 2), r.T > 24 ? "> 24" : nf(r.T, 2), pc(r.d, 1)]), { num:[1, 2, 3, 4], foot:["Total", "", nf(T, 2), "", pc(D, 1)] });
    h += steps([
      { t:"Tiempo máximo permitido por nivel", f:"T = 8 h ÷ 2^((L − 85) ÷ 3)", why:"el DS 594 fija 85 dB(A) para 8 horas con tasa de intercambio de 3 dB: cada 3 dB más, el tiempo permitido se reduce a la mitad." },
      { t:"Dosis diaria", f:"D = Σ (t_i ÷ T_i)", s:"D = " + R.map(r => nf(r.t, 2) + "/" + nf(r.T, 2)).join(" + ") + " = " + nf(D, 3), r:pc(D, 0), c:cls[0] },
      { t:"Nivel equivalente de 8 horas", f:"NPSeq,8h = 10 · log₁₀[Σ t_i · 10^(L_i/10) ÷ 8]", s:"= " + nf(Leq, 2) + " dB(A)", r:nf(Leq, 1) + " dB(A)" }
    ]);
    h += note("Protocolo PREXOR (MINSAL): con dosis ≥ 50 % (≈ 82 dB(A) en 8 h) el trabajador ingresa a vigilancia de salud con audiometrías. Límite de ruido impulsivo: 140 dB(C) peak.", "info");
    return h;
  },
  rel:["niosh", "iper"]
});

def("huella", "seg", {
  t:"Huella de carbono (alcances 1 y 2)", ico:"CO₂", d:"Emisiones de GEI por combustibles y electricidad, intensidad por unidad producida",
  ey:"Gestión ambiental · GHG Protocol / HuellaChile",
  lead:"Estima las emisiones directas (alcance 1) e indirectas por electricidad (alcance 2) de una planta.",
  f:[MAT("m", "Fuente ; cantidad ; unidad ; factor (kg CO₂e por unidad) ; alcance", "Electricidad SEN;420000;kWh;0.2421;2\nPetróleo diésel (grupos y grúas);18000;L;2.68;1\nGas licuado (GLP);6500;kg;2.94;1\nGas natural (calderas);22000;m3;1.96;1\nGasolina (vehículos);3500;L;2.31;1"), F("prod", "Producción del período", 150000, { u:"unidades" })],
  c(v){
    const R = rows(v.m).map(r => ({ nm:r[0], q:num(r[1]), u:r[2] || "", f:num(r[3]), a:num(r[4]) || 1 })); if (!R.length || R.some(r => !fin(r.q) || !fin(r.f))) fail("Cada fuente necesita cantidad y factor numéricos.");
    R.forEach(r => r.e = r.q * r.f / 1000); const T = sum(R.map(r => r.e)), A1 = sum(R.filter(r => r.a === 1).map(r => r.e)), A2 = sum(R.filter(r => r.a === 2).map(r => r.e)), pr = opt(v, "prod");
    let h = kpis([kpi("Emisiones totales", nf(T, 1), "t CO₂e", "hi"), kpi("Alcance 1", nf(A1, 1), "t CO₂e"), kpi("Alcance 2", nf(A2, 1), "t CO₂e"), kpi("Intensidad", pr ? nf(T * 1e6 / pr, 1) : "—", "g CO₂e por unidad")]);
    h += table(["Fuente", "Cantidad", "Factor", "Alcance", "t CO₂e", "%"], R.sort((a, b) => b.e - a.e).map(r => [esc(r.nm), n0(r.q) + " " + esc(r.u), nf(r.f, 3), r.a, nf(r.e, 2), pc(r.e / T)]), { num:[2, 3, 4, 5] });
    h += steps([{ t:"Emisiones por fuente", f:"Emisiones (t CO₂e) = Dato de actividad × Factor de emisión ÷ 1.000", why:"el alcance 3 (cadena de suministro, transporte de terceros, viajes) suele ser el mayor, pero requiere datos de proveedores." }]);
    h += note("El factor eléctrico precargado (0,2421 kg CO₂e/kWh) es el promedio del Sistema Eléctrico Nacional 2023 publicado por HuellaChile; para 2024 Cochilco informa 0,2017. Usa el del año evaluado. Los factores de combustibles son referenciales: reemplázalos por los de la tabla vigente de HuellaChile.", "info");
    return h;
  },
  rel:["accidentabilidad"]
});

/* ---------------- HERRAMIENTAS DE GESTIÓN ---------------- */
const lines = s => String(s || "").split("\n").map(x => x.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
const ul = a => a.length ? "<ul>" + a.map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>" : '<p class="hint">—</p>';
def("foda", "ges", {
  t:"Análisis FODA y estrategias cruzadas", ico:"FODA", d:"Fortalezas, oportunidades, debilidades, amenazas y matriz FO-DO-FA-DA",
  ey:"Planificación estratégica", btn:"Generar matriz",
  lead:"Escribe un punto por línea. La app arma la matriz FODA y la guía de estrategias cruzadas.",
  f:[TXT("obj", "Organización o proyecto", "Planta de envases plásticos – línea de inyección"), AREA("F", "Fortalezas (internas, positivas)", "Personal con experiencia\nMáquinas con 5 años de uso\nCertificación ISO 9001"), AREA("D", "Debilidades (internas, negativas)", "OEE de 58 %\nSetups de 90 minutos\nSin mantenimiento preventivo formal"), AREA("O", "Oportunidades (externas, positivas)", "Demanda creciente de envases reciclables\nLey REP de envases\nFondos CORFO para eficiencia"), AREA("A", "Amenazas (externas, negativas)", "Importaciones de bajo costo\nAlza del precio de la resina\nEscasez de técnicos de mantención")],
  c(v){
    const Fz = lines(v.F), Oz = lines(v.O), Dz = lines(v.D), Az = lines(v.A);
    let h = '<h3>' + esc(v.obj || "Análisis FODA") + '</h3><div class="foda"><div class="q1"><h3>Fortalezas</h3>' + ul(Fz) + '</div><div class="q2"><h3>Oportunidades</h3>' + ul(Oz) + '</div><div class="q3"><h3>Debilidades</h3>' + ul(Dz) + '</div><div class="q4"><h3>Amenazas</h3>' + ul(Az) + "</div></div>";
    h += h3("Estrategias cruzadas") + table(["", "Oportunidades", "Amenazas"], [["<b>Fortalezas</b>", "<b>FO · Ofensivas</b><br>Usa " + esc(Fz[0] || "una fortaleza") + " para aprovechar " + esc(Oz[0] || "una oportunidad") + ".", "<b>FA · Defensivas</b><br>Apóyate en " + esc(Fz[1] || Fz[0] || "una fortaleza") + " para enfrentar " + esc(Az[0] || "una amenaza") + "."], ["<b>Debilidades</b>", "<b>DO · Adaptativas</b><br>Corrige " + esc(Dz[0] || "una debilidad") + " aprovechando " + esc(Oz[Oz.length - 1] || "una oportunidad") + ".", "<b>DA · De supervivencia</b><br>Reduce " + esc(Dz[1] || Dz[0] || "una debilidad") + " para que " + esc(Az[1] || Az[0] || "una amenaza") + " no te afecte."]]);
    h += note("Redacta cada estrategia como acción concreta con responsable, plazo e indicador. Prioriza con una matriz de impacto vs esfuerzo.", "info");
    return h;
  },
  rel:["ishikawa", "canvas"]
});

const ISHI_PRE = [["6m", "6M · manufactura (mano de obra, método, máquina…)", ["Mano de obra", "Método", "Máquina", "Material", "Medición", "Medio ambiente"]], ["8m", "8M · manufactura ampliada (+ gestión y mantenimiento)", ["Mano de obra", "Método", "Máquina", "Material", "Medición", "Medio ambiente", "Gestión", "Mantenimiento"]], ["4p", "4P · servicios (personas, procesos, políticas, lugar)", ["Personas", "Procesos", "Políticas", "Lugar"]], ["4s", "4S · proveedores y entorno", ["Entorno", "Proveedores", "Sistemas", "Habilidades"]], ["pers", "Personalizada (escribe tus propios nombres)", null]];
def("ishikawa", "ges", {
  t:"Diagrama de Ishikawa (6M)", ico:"Ish", d:"Espina de pescado: causas agrupadas por categoría", btn:"Dibujar diagrama",
  ey:"Herramientas básicas de calidad · Análisis causa-efecto",
  lead:"Escribe el problema y las causas agrupadas en categorías (una causa por línea). Las categorías vienen con las 6M, pero puedes cambiar su nombre, elegir otra plantilla (8M, 4P de servicios, 4S) o dejar vacías las que no uses. La app dibuja el diagrama.",
  f:[TXT("p", "Problema (efecto)", "Alto porcentaje de piezas con rebaba"), SEL("pre", "Plantilla de categorías", "6m", ISHI_PRE.map(x => [x[0], x[1]]), { h:"Al cambiarla se reemplazan los nombres; tus causas se mantienen. Después puedes editar cada nombre." }),
    TXT("n1", "Categoría 1", "Mano de obra"), AREA("m1", "Causas de la categoría 1", "Operador nuevo sin capacitación\nRotación de turnos"), TXT("n2", "Categoría 2", "Método"), AREA("m2", "Causas de la categoría 2", "Parámetros de inyección no estandarizados\nSin instructivo de ajuste"),
    TXT("n3", "Categoría 3", "Máquina"), AREA("m3", "Causas de la categoría 3", "Desgaste del molde\nPresión de cierre inestable"), TXT("n4", "Categoría 4", "Material"), AREA("m4", "Causas de la categoría 4", "Resina con humedad\nCambio de proveedor"),
    TXT("n5", "Categoría 5", "Medición"), AREA("m5", "Causas de la categoría 5", "Calibrador sin certificar"), TXT("n6", "Categoría 6", "Medio ambiente"), AREA("m6", "Causas de la categoría 6", "Temperatura de la nave variable"),
    TXT("n7", "Categoría 7 (opcional)", ""), AREA("m7", "Causas de la categoría 7", ""), TXT("n8", "Categoría 8 (opcional)", ""), AREA("m8", "Causas de la categoría 8", "")],
  c(v){
    const cats = [1, 2, 3, 4, 5, 6, 7, 8].map(k => [String(v["n" + k] || "").trim(), lines(v["m" + k] || "")]).filter(c => c[0] || c[1].length).map((c, i) => [c[0] || "Categoría " + (i + 1), c[1]]);
    if (!cats.length) fail("Escribe al menos una categoría con sus causas.");
    if (!String(v.p || "").trim()) fail("Escribe el problema (efecto) que quieres analizar.");
    let h = ishiSVG(v.p, cats);
    h += table(["Categoría", "Causas", "N.º"], cats.map(c => [esc(c[0]), c[1].map(esc).join(" · ") || "—", c[1].length]), { num:[2] });
    h += note("Siguiente paso: vota las causas más probables y valida cada una con los 5 porqués o con datos.", "info");
    return h;
  },
  rel:["porques", "pareto", "foda"]
});

def("porques", "ges", {
  t:"5 porqués y plan de acción", ico:"5?", d:"Llega a la causa raíz preguntando por qué en cadena", btn:"Generar análisis",
  ey:"Solución de problemas · Análisis de causa raíz",
  lead:"Parte del problema y pregunta «¿por qué?» hasta llegar a una causa sobre la que puedas actuar.",
  f:[TXT("p", "Problema", "La línea 2 se detuvo 45 minutos"), TXT("w1", "¿Por qué 1?", "El motor de la cinta se detuvo por sobrecarga"), TXT("w2", "¿Por qué 2?", "El rodamiento del rodillo estaba agarrotado"), TXT("w3", "¿Por qué 3?", "No tenía lubricación"), TXT("w4", "¿Por qué 4?", "La lubricación no está en el plan de mantención"), TXT("w5", "¿Por qué 5?", "No existe un plan de mantenimiento preventivo para cintas"), TXT("acc", "Acción correctiva", "Crear plan preventivo de cintas con lubricación semanal"), TXT("resp", "Responsable y plazo", "Jefe de mantención · 15 días")],
  c(v){
    const W = ["w1", "w2", "w3", "w4", "w5"].map(k => v[k]).filter(x => x && x.trim());
    let h = '<div class="chain"><div><b>Problema:</b> ' + esc(v.p) + "</div>" + W.map((w, i) => '<div class="' + (i === W.length - 1 ? "root" : "") + '">' + (i + 1) + ". ¿Por qué? " + esc(w) + "</div>").join("") + "</div>";
    h += kpis([kpi("Causa raíz", esc(W[W.length - 1] || "—"), "", "hi"), kpi("Acción", esc(v.acc || "—")), kpi("Responsable y plazo", esc(v.resp || "—"))]);
    h += steps([{ t:"Prueba de la causa raíz", q:"Lee la cadena al revés con «por lo tanto». Si cada paso tiene sentido y al eliminar la causa raíz el problema no puede repetirse, encontraste la causa raíz.", why:"las causas raíz suelen ser fallas de sistema (procedimientos, planes, diseño), no personas. «Error humano» nunca es una causa raíz." }]);
    return h;
  },
  rel:["ishikawa", "mejora-continua"]
});

def("sipoc", "ges", {
  t:"SIPOC del proceso", ico:"SIPOC", d:"Proveedores, entradas, proceso, salidas y clientes", btn:"Generar SIPOC",
  ey:"Mapeo de procesos · Seis Sigma (Definir)",
  lead:"Describe el proceso a alto nivel en 4 a 7 pasos y sus elementos. Un elemento por línea.",
  f:[TXT("n", "Nombre del proceso", "Despacho de pedidos"), AREA("S", "Proveedores", "Área comercial\nBodega\nTransportista"), AREA("I", "Entradas", "Orden de venta\nProductos en stock\nGuía de despacho"), AREA("P", "Pasos del proceso (en orden)", "Recibir orden\nPreparar picking\nVerificar y embalar\nEmitir guía\nCargar camión"), AREA("O", "Salidas", "Pedido despachado\nGuía firmada\nRegistro en ERP"), AREA("Cl", "Clientes", "Cliente final\nFacturación")],
  c(v){
    const P = lines(v.P);
    let h = h3(esc(v.n || "Proceso")) + '<div class="tbl-wrap"><table><thead><tr><th>Proveedores</th><th>Entradas</th><th>Proceso</th><th>Salidas</th><th>Clientes</th></tr></thead><tbody><tr>' + [lines(v.S), lines(v.I), P, lines(v.O), lines(v.Cl)].map((a, i) => "<td>" + (i === 2 ? "<ol>" + a.map(x => "<li>" + esc(x) + "</li>").join("") + "</ol>" : ul(a)) + "</td>").join("") + "</tr></tbody></table></div>";
    if (P.length) { /* F4: diagrama SIPOC completo. Los pasos conservan su texto; los rótulos de las demás columnas se escriben al mostrar la página (data-t) */
      const cols = [["Proveedores", lines(v.S)], ["Entradas", lines(v.I)], ["Proceso", P], ["Salidas", lines(v.O)], ["Clientes", lines(v.Cl)]], cw = 168, gap = 34, W = 5 * cw + 4 * gap + 8, ih = 54, ig = 10, top = 56;
      const H = top + Math.max(...cols.map(c => c[1].length), 1) * (ih + ig) + 10; let g = '<defs><marker id="sipa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="dgah"/></marker></defs>';
      cols.forEach((c, k) => { const x = 4 + k * (cw + gap), mid = k === 2; g += '<rect class="sip-hd' + (mid ? " mid" : "") + '" x="' + x + '" y="4" width="' + cw + '" height="38" rx="10"/><text class="sip-ht" x="' + (x + cw / 2) + '" y="28" text-anchor="middle" data-t="' + c[0] + '"></text>';
        if (k < 4) g += '<line class="dga" x1="' + (x + cw + 4) + '" y1="23" x2="' + (x + cw + gap - 4) + '" y2="23" marker-end="url(#sipa)"/>';
        c[1].forEach((t, r) => { const y = top + r * (ih + ig);
          if (mid) g += '<rect class="sip-p" x="' + x + '" y="' + y + '" width="' + cw + '" height="' + ih + '" rx="10"/><circle class="sip-n" cx="' + (x + 18) + '" cy="' + (y + ih / 2) + '" r="11"/><text x="' + (x + 18) + '" y="' + (y + ih / 2 + 4) + '" text-anchor="middle" class="sip-nt">' + (r + 1) + '</text><text x="' + (x + 36) + '" y="' + (y + ih / 2 + 5) + '" class="sip-pt">' + esc(t.length > 24 ? t.slice(0, 23) + "…" : t) + "</text>" + (r < P.length - 1 ? '<line class="dga" x1="' + (x + cw / 2) + '" y1="' + (y + ih) + '" x2="' + (x + cw / 2) + '" y2="' + (y + ih + ig - 1) + '" marker-end="url(#sipa)"/>' : "");
          else g += '<rect class="sip-i" x="' + x + '" y="' + y + '" width="' + cw + '" height="' + ih + '" rx="8"/><text class="sip-it" x="' + (x + cw / 2) + '" y="' + (y + ih / 2 + 5) + '" text-anchor="middle" data-t="' + esc(t) + '" data-w="20"></text>'; }); });
      h += '<figure class="ch dg sipoc"><div class="sv"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Flujo del proceso">' + g + "</svg></div></figure>"; }
    h += note("Define también el inicio y el fin del proceso, y los requisitos críticos del cliente (CTQ) para cada salida.", "info");
    return h;
  },
  rel:["raci", "vsm"]
});

def("canvas", "ges", {
  t:"Modelo Canvas de negocio", ico:"Cnv", d:"Los 9 bloques del modelo de negocio en una página", btn:"Generar Canvas",
  ey:"Emprendimiento e innovación · Osterwalder",
  lead:"Completa los nueve bloques (un punto por línea) para ver el modelo de negocio en una sola lámina.",
  f:[TXT("n", "Negocio", "Servicio de mantenimiento predictivo con sensores IoT"), AREA("sa", "Socios clave", "Fabricante de sensores\nProveedor de nube"), AREA("ac", "Actividades clave", "Instalación de sensores\nAnálisis de datos\nSoporte técnico"), AREA("rc", "Recursos clave", "Plataforma de software\nIngenieros de confiabilidad"), AREA("pv", "Propuesta de valor", "Reducir paradas no planificadas en 30 %\nAlertas antes de la falla"), AREA("rcl", "Relación con clientes", "Ejecutivo dedicado\nInforme mensual"), AREA("can", "Canales", "Venta directa\nFerias mineras"), AREA("sc", "Segmentos de clientes", "Plantas mineras medianas\nIndustria alimentaria"), AREA("ec", "Estructura de costos", "Sensores\nNube\nPersonal técnico"), AREA("fi", "Fuentes de ingresos", "Suscripción mensual por equipo\nInstalación inicial")],
  c(v){
    const b = (k, t, st) => '<div style="' + st + '"><h4>' + t + "</h4>" + ul(lines(v[k])) + "</div>";
    let h = h3(esc(v.n || "Modelo de negocio")) + '<div class="tbl-wrap"><div class="canvas9">' +
      b("sa", "Socios clave", "grid-column:1;grid-row:1/3") + b("ac", "Actividades clave", "grid-column:2;grid-row:1") + b("rc", "Recursos clave", "grid-column:2;grid-row:2") + b("pv", "Propuesta de valor", "grid-column:3;grid-row:1/3;background:var(--copper-soft)") + b("rcl", "Relación con clientes", "grid-column:4;grid-row:1") + b("can", "Canales", "grid-column:4;grid-row:2") + b("sc", "Segmentos de clientes", "grid-column:5;grid-row:1/3") +
      '<div style="grid-column:1/3;grid-row:3"><h4>Estructura de costos</h4>' + ul(lines(v.ec)) + '</div><div style="grid-column:3/6;grid-row:3"><h4>Fuentes de ingresos</h4>' + ul(lines(v.fi)) + "</div></div></div>";
    h += note("Valida primero los supuestos más riesgosos (¿el cliente paga por esto?) con entrevistas y un producto mínimo viable antes de invertir.", "info");
    return h;
  },
  rel:["foda", "van-tir"]
});

def("raci", "ges", {
  t:"Matriz RACI", ico:"RACI", d:"Quién es responsable, aprueba, es consultado e informado", btn:"Validar matriz",
  ey:"Gestión de proyectos y procesos · Roles y responsabilidades",
  lead:"Asigna a cada actividad una letra por rol: R (realiza), A (aprueba, una sola por actividad), C (consultado) o I (informado).",
  f:[TXT("roles", "Roles (separados por ;)", "Gerente de planta; Jefe de proyecto; Ingeniero de procesos; Mantención; Calidad"), MAT("m", "Actividad ; letra para cada rol (o - si no participa)", "Definir alcance;A;R;C;I;C\nLevantar proceso actual;I;A;R;C;C\nDiseñar mejora;I;A;R;C;C\nValidar con piloto;I;A;R;R;R\nAprobar inversión;A;R;C;-;I\nCapacitar operadores;-;A;R;I;C")],
  c(v){
    const roles = (v.roles || "").split(";").map(s => s.trim()).filter(Boolean); if (!roles.length) fail("Ingresa los roles separados por punto y coma.");
    const R = rows(v.m).map(r => ({ act:r[0], l:r.slice(1).map(x => (x || "-").toUpperCase()) }));
    const issues = [];
    R.forEach(r => { if (r.l.length !== roles.length) issues.push("«" + r.act + "» tiene " + r.l.length + " letras y hay " + roles.length + " roles."); const a = r.l.filter(x => x.includes("A")).length, rr = r.l.filter(x => x.includes("R")).length; if (a !== 1) issues.push("«" + r.act + "» tiene " + a + " «A»: debe haber exactamente una."); if (!rr) issues.push("«" + r.act + "» no tiene ningún «R»: nadie la ejecuta."); });
    const load = roles.map((_, j) => R.filter(r => (r.l[j] || "").includes("R")).length);
    const col = x => x.includes("A") ? "bad" : x.includes("R") ? "warn" : x.includes("C") ? "info" : x.includes("I") ? "ok" : "";
    let h = table(["Actividad"].concat(roles.map(esc)), R.map(r => [esc(r.act)].concat(roles.map((_, j) => { const x = r.l[j] || "-"; return x === "-" ? '<span class="hint">—</span>' : pill(col(x), esc(x)); }))));
    h += issues.length ? note("<b>Revisa:</b><br>" + issues.map(esc).join("<br>"), "bad") : note("La matriz es consistente: cada actividad tiene un único aprobador y al menos un ejecutor.", "ok");
    h += h3("Carga de ejecución por rol") + table(["Rol", "Actividades como R"], roles.map((r, j) => [esc(r), load[j]]), { num:[1] });
    return h;
  },
  rel:["sipoc", "cpm"]
});

/* ---------------- INFORMES ---------------- */
def("generador-informe", "inf", {
  t:"Generador de informe técnico", ico:"Inf", d:"Arma un informe con formato profesional listo para copiar a Word", btn:"Generar informe",
  ey:"Comunicación técnica · Informe",
  lead:"Completa las secciones. La app arma el documento con la estructura estándar; cópialo con formato y pégalo en Word o Google Docs.",
  f:[SEL("tipo", "Tipo de documento", "tec", [["tec", "Informe técnico"], ["prac", "Informe de práctica profesional"], ["eje", "Informe ejecutivo"], ["av", "Informe de avance de proyecto"]]), TXT("tit", "Título", "Reducción del tiempo de cambio de formato en la línea de envasado 3"), TXT("aut", "Autor(es)", "Nombre Apellido, Ingeniero Civil Industrial"), TXT("org", "Empresa o institución", "Planta Envases del Sur S.A."), TXT("fec", "Fecha", "Octubre de 2026"), TXT("dest", "Dirigido a", "Gerencia de Operaciones"),
     AREA("res", "Resumen ejecutivo (problema, qué se hizo, resultado, recomendación)", "La línea 3 pierde 6,5 horas semanales en cambios de formato. Se aplicó la metodología SMED: se filmaron 4 cambios, se separaron actividades internas y externas y se estandarizaron herramientas. El tiempo de cambio bajó de 78 a 31 minutos (−60 %), lo que libera 3,8 horas productivas por semana, equivalentes a $ 41 millones anuales. Se recomienda extender el estándar a las líneas 1 y 2.", { w:true }),
     AREA("obj", "Objetivos (general y específicos, uno por línea)", "General: reducir en al menos 50 % el tiempo de cambio de formato de la línea 3.\nCuantificar el tiempo actual de cambio y sus actividades.\nRediseñar el procedimiento con SMED.\nEvaluar el impacto económico de la mejora.", { w:true }),
     AREA("ant", "Antecedentes y situación actual", "La línea 3 opera en 2 turnos y realiza 5 cambios de formato por semana. El OEE promedio del último trimestre fue de 61 %, con la disponibilidad como principal pérdida.", { w:true }),
     AREA("met", "Metodología", "Se registraron en video 4 cambios completos. Cada actividad se clasificó como interna (con la máquina detenida) o externa. Se aplicaron las etapas de SMED: separar, convertir y optimizar.", { w:true }),
     AREA("resu", "Resultados", "Tiempo promedio de cambio: 78 min antes y 31 min después.\nActividades convertidas a externas: 9 de 22.\nAhorro anual estimado: $ 41.000.000.", { w:true }),
     AREA("con", "Conclusiones", "El objetivo se cumplió: la reducción fue de 60 %, superior a la meta de 50 %. La principal ganancia provino de preparar herramientas y moldes antes de detener la línea.", { w:true }),
     AREA("rec", "Recomendaciones", "Estandarizar el procedimiento con una lista de verificación.\nCapacitar a los 3 turnos.\nReplicar en las líneas 1 y 2 durante el próximo trimestre.", { w:true }),
     AREA("ref", "Referencias (una por línea, formato APA)", "Shingo, S. (1985). A revolution in manufacturing: The SMED system. Productivity Press.", { w:true }),
     SEL("calc", "Anexar resultados de mis cálculos", "si", [["si", "Sí, anexar los que he calculado"], ["no", "No"]])],
  c(v){
    const tipo = { tec:"Informe técnico", prac:"Informe de práctica profesional", eje:"Informe ejecutivo", av:"Informe de avance" }[v.tipo];
    const par = s => lines(s).map(x => "<p>" + esc(x) + "</p>").join("");
    const objs = lines(v.obj); let n = 0; const sec = (t, body) => body ? "<h2>" + (++n) + ". " + t + "</h2>" + body : "";
    let d = '<div class="doc" id="docout"><p class="eyebrow">' + tipo + "</p><h1>" + esc(v.tit) + '</h1><p class="meta">' + [v.aut, v.org, v.dest ? "Para: " + v.dest : "", v.fec].filter(Boolean).map(esc).join(" · ") + "</p>";
    if (v.res) d += "<h2>Resumen ejecutivo</h2>" + par(v.res);
    d += sec("Introducción y antecedentes", par(v.ant));
    d += sec("Objetivos", objs.length ? "<p><b>Objetivo general:</b> " + esc(objs[0].replace(/^general:\s*/i, "")) + "</p>" + (objs.length > 1 ? "<p><b>Objetivos específicos:</b></p><ol>" + objs.slice(1).map(x => "<li>" + esc(x) + "</li>").join("") + "</ol>" : "") : "");
    d += sec("Metodología", par(v.met)) + sec("Resultados", lines(v.resu).length > 1 ? "<ul>" + lines(v.resu).map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>" : par(v.resu));
    if (v.calc === "si") { const done = Object.keys(S.done).filter(id => C[id] && id !== "generador-informe" && id !== "citas-apa"); if (done.length) d += sec("Memoria de cálculo", done.map((id, i) => "<h3>" + n + "." + (i + 1) + " " + C[id].t + "</h3>" + inputSummary(id) + safeCalc(id)).join("")); }
    d += sec("Conclusiones", par(v.con)) + sec("Recomendaciones", lines(v.rec).length > 1 ? "<ol>" + lines(v.rec).map(x => "<li>" + esc(x) + "</li>").join("") + "</ol>" : par(v.rec));
    if (lines(v.ref).length) d += "<h2>Referencias</h2>" + lines(v.ref).map(x => '<p style="padding-left:2em;text-indent:-2em">' + esc(x) + "</p>").join("");
    d += "</div>";
    return '<div class="actions" style="margin-top:0;border:0;padding-top:0"><button class="btn" type="button" data-act="copyrich" data-t="docout">Copiar con formato</button><button class="btn ghost" type="button" data-act="copytext" data-t="docout">Copiar como texto</button><span class="hint">Pega en Word o Google Docs y aplica el estilo de tu institución.</span></div>' + d;
  },
  rel:["estructura-informe", "citas-apa", "plantillas", "reportes"]
});

const fmtAut = s => { const A = lines(s).map(x => { const [ap, nm] = x.split(",").map(t => (t || "").trim()); return { ap, ini:(nm || "").split(/[\s.]+/).filter(Boolean).map(w => w[0].toUpperCase() + ".").join(" ") }; }).filter(a => a.ap); return A; };
def("citas-apa", "inf", {
  t:"Citas y referencias APA 7", ico:"APA", d:"Genera la referencia y la cita en el texto", btn:"Generar referencia",
  ey:"Comunicación técnica · Normas APA 7.ª edición",
  lead:"Elige el tipo de fuente y completa los datos. La app arma la referencia y las citas parentética y narrativa.",
  f:[SEL("tipo", "Tipo de fuente", "art", [["libro", "Libro"], ["art", "Artículo de revista"], ["web", "Página web"], ["norma", "Norma técnica (ISO, NCh)"], ["tesis", "Tesis o memoria de título"], ["ley", "Ley o decreto (Chile)"]]), AREA("aut", "Autores (Apellido, Nombres — uno por línea) u organización", "Pérez Soto, Juan Andrés\nMuñoz, Carla"), TXT("anio", "Año", "2023"), TXT("tit", "Título", "Aplicación de SMED en la industria del envase"), TXT("fue", "Revista, editorial, sitio, organismo o universidad", "Revista Ingeniería Industrial"), TXT("vol", "Volumen (artículo) o edición (libro) o número de norma/ley", "22"), TXT("num", "Número (artículo)", "3"), TXT("pag", "Páginas", "45–61"), TXT("url", "DOI o URL", "https://doi.org/10.1234/rii.2023.0045")],
  c(v){
    const A = fmtAut(v.aut), org = !A.length || lines(v.aut).length === 1 && !String(v.aut).includes(",");
    const list = org ? esc(lines(v.aut)[0] || "Autor") : (A.length === 1 ? A[0].ap + ", " + A[0].ini : A.length <= 20 ? A.slice(0, -1).map(a => a.ap + ", " + a.ini).join(", ") + ", y " + A[A.length - 1].ap + ", " + A[A.length - 1].ini : "");
    const yr = esc(v.anio || "s.f."), ti = esc(v.tit), fu = esc(v.fue), url = v.url ? " " + esc(v.url) : "";
    let ref = "";
    if (v.tipo === "libro") ref = list + " (" + yr + "). <i>" + ti + "</i>" + (v.vol ? " (" + esc(v.vol) + ".ª ed.)" : "") + ". " + fu + "." + url;
    else if (v.tipo === "art") ref = list + " (" + yr + "). " + ti + ". <i>" + fu + "</i>" + (v.vol ? ", <i>" + esc(v.vol) + "</i>" : "") + (v.num ? "(" + esc(v.num) + ")" : "") + (v.pag ? ", " + esc(v.pag) : "") + "." + url;
    else if (v.tipo === "web") ref = list + " (" + yr + "). <i>" + ti + "</i>. " + fu + "." + url;
    else if (v.tipo === "norma") ref = list + " (" + yr + "). <i>" + ti + "</i>" + (v.vol ? " (" + esc(v.vol) + ")" : "") + ". " + fu + "." + url;
    else if (v.tipo === "tesis") ref = list + " (" + yr + "). <i>" + ti + "</i> [Memoria de título, " + fu + "]." + url;
    else ref = esc(v.vol || "Ley N.º") + ". (" + yr + "). <i>" + ti + "</i>. " + fu + "." + url;
    const cit = org || v.tipo === "ley" ? (v.tipo === "ley" ? esc(v.vol || "Ley") : esc(lines(v.aut)[0] || "Autor")) : A.length === 1 ? A[0].ap : A.length === 2 ? A[0].ap + " y " + A[1].ap : A[0].ap + " et al.";
    let h = '<div class="doc" id="apaout" style="padding:18px 22px"><p style="padding-left:2em;text-indent:-2em;margin:0">' + ref + "</p></div>";
    h += '<div class="actions" style="border:0;padding-top:8px;margin-top:4px"><button class="btn small" type="button" data-act="copyrich" data-t="apaout">Copiar referencia</button></div>';
    h += table(["Uso", "Formato"], [["Cita parentética", "(" + cit + ", " + yr + ")"], ["Cita narrativa", cit + " (" + yr + ")"], ["Cita textual (< 40 palabras)", "«…texto…» (" + cit + ", " + yr + ", p. 12)"]]);
    h += note("Reglas clave APA 7: hasta 20 autores en la referencia; desde 3 autores se cita «et al.» en el texto; sangría francesa; lista ordenada alfabéticamente; DOI como URL (https://doi.org/…). En español se usa «y» entre autores.", "info");
    return h;
  },
  rel:["generador-informe", "estructura-informe"]
});

/* ---------------- CONVERSOR ---------------- */
const UN = {
  "Longitud":{ m:1, km:1000, cm:0.01, mm:0.001, "µm":1e-6, in:0.0254, ft:0.3048, yd:0.9144, mi:1609.344 },
  "Masa":{ kg:1, g:0.001, t:1000, lb:0.45359237, oz:0.028349523, "t corta":907.18474 },
  "Área":{ "m²":1, "km²":1e6, ha:1e4, "cm²":1e-4, "ft²":0.09290304, acre:4046.8564 },
  "Volumen":{ "m³":1, L:0.001, mL:1e-6, "ft³":0.0283168, "gal (EE.UU.)":0.00378541, "barril de petróleo":0.158987 },
  "Tiempo":{ s:1, min:60, h:3600, día:86400, semana:604800, "año (365 d)":31536000 },
  "Velocidad":{ "m/s":1, "km/h":1 / 3.6, mph:0.44704, nudo:0.514444 },
  "Caudal":{ "m³/s":1, "m³/h":1 / 3600, "L/s":0.001, "L/min":1 / 60000, "gal/min (gpm)":0.0000630902 },
  "Presión":{ Pa:1, kPa:1000, MPa:1e6, bar:1e5, atm:101325, psi:6894.757, "mm Hg":133.322, "m columna de agua":9806.65 },
  "Energía":{ J:1, kJ:1000, MJ:1e6, kWh:3.6e6, cal:4.184, kcal:4184, BTU:1055.056 },
  "Potencia":{ W:1, kW:1000, MW:1e6, "HP (mecánico)":745.69987, CV:735.49875, "BTU/h":0.29307107 },
  "Fuerza":{ N:1, kN:1000, kgf:9.80665, lbf:4.448222 },
  "Temperatura":{ "°C":"C", "°F":"F", K:"K" }
};
def("conversor", "learn", {
  t:"Conversor de unidades", ico:"⇄", d:"Longitud, masa, presión, energía, potencia, caudal, temperatura y más", btn:"Convertir",
  ey:"Herramientas · Sistema Internacional y unidades inglesas",
  lead:"Elige la magnitud, escribe el valor y la unidad de origen. Verás la equivalencia en todas las unidades de esa magnitud.",
  f:[SEL("cat", "Magnitud", "Presión", Object.keys(UN).map(k => [k, k]), { re:true }), F("x", "Valor", 120), SEL("de", "Unidad de origen", "psi", v => Object.keys(UN[v.cat] || UN["Longitud"]).map(k => [k, k]))],
  c(v){
    const cat = UN[v.cat] ? v.cat : "Longitud", U = UN[cat], x = need(v, "x", "Valor"), de = U[v.de] != null ? v.de : Object.keys(U)[0];
    let out;
    if (cat === "Temperatura") { const c = de === "°C" ? x : de === "°F" ? (x - 32) * 5 / 9 : x - 273.15; out = [["°C", c], ["°F", c * 9 / 5 + 32], ["K", c + 273.15]]; }
    else { const base = x * U[de]; out = Object.keys(U).map(k => [k, base / U[k]]); }
    const fmt = y => Math.abs(y) >= 1e6 || (Math.abs(y) < 1e-3 && y !== 0) ? y.toExponential(5).replace(".", ",") : nf(y, Math.abs(y) >= 100 ? 2 : 5);
    return '<p class="r">' + nf(x, 4) + " " + esc(de) + " equivale a:</p>" + table(["Unidad", "Equivalencia"], out.map(o => rowc([esc(o[0]), fmt(o[1])], o[0] === de ? "sel" : "")), { num:[1] }) + (cat === "Temperatura" ? note("°F = °C × 9/5 + 32 · K = °C + 273,15", "info") : "");
  },
  rel:["tablas"]
});
