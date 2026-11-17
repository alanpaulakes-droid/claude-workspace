/* ---------------- SMED ---------------- */
def("smed", "ops", {
  t:"SMED: reducción del tiempo de cambio", ico:"SMED", d:"Separa, convierte y optimiza las actividades de un cambio de formato y valoriza las horas liberadas",
  ey:"Lean manufacturing · Cambio rápido de formato",
  lead:"Lista las actividades del cambio con su duración actual y lo que propones para cada una.",
  f:[MAT("acts", "Actividad ; minutos actuales ; tipo actual (I/E) ; tipo propuesto (I = interna, E = externa, X = eliminar) ; minutos propuestos", "Buscar molde en bodega;9;I;E;9\nTraer herramientas y llaves;6;I;E;6\nPrecalentar molde nuevo;12;I;E;12\nDetener línea y purgar material;4;I;I;4\nSoltar 12 pernos del molde;8;I;I;2\nRetirar molde con tecle;6;I;I;5\nMontar molde nuevo;7;I;I;6\nApretar pernos;9;I;I;2\nConectar mangueras de refrigeración;5;I;I;2\nAjustar parámetros por prueba y error;8;I;I;7\nProducir piezas de prueba y medir;4;I;I;3", { h:"I = con la máquina detenida. E = se hace con la máquina funcionando." }),
     F("n", "Cambios por semana", 5), F("sem", "Semanas de operación al año", 48), F("vh", "Valor de una hora productiva de la línea", 218000, { u:"$/h", h:"Margen de contribución por hora si hay demanda para producir más; si no, el costo evitado (horas extra)." })],
  c(v){
    const A = rows(v.acts).map(r => { const m0 = num(r[1]), m1 = num(r[4]), t0 = (r[2] || "I").toUpperCase(), t1 = (r[3] || t0).toUpperCase(); if (!r[0] || !fin(m0)) fail("Revisa la actividad «" + (r[0] || "") + "»: necesita nombre y minutos actuales."); return { nm:r[0], m0, t0, t1, m1:t1 === "X" ? 0 : (fin(m1) ? m1 : m0) }; });
    if (A.length < 2) fail("Ingresa al menos 2 actividades.");
    const n = need(v, "n", "Cambios por semana", { pos:true }), sem = need(v, "sem", "Semanas", { pos:true }), vh = opt(v, "vh") || 0;
    const I0 = sum(A.filter(a => a.t0 === "I").map(a => a.m0)), E0 = sum(A.filter(a => a.t0 === "E").map(a => a.m0)), I1 = sum(A.filter(a => a.t1 === "I").map(a => a.m1)), E1 = sum(A.filter(a => a.t1 === "E").map(a => a.m1));
    const red = I0 - I1, hs = red * n / 60, ha = hs * sem, val = ha * vh;
    const conv = A.filter(a => a.t0 === "I" && a.t1 === "E").length, acort = A.filter(a => a.t0 === "I" && a.t1 === "I" && a.m1 < a.m0).length, elim = A.filter(a => a.t1 === "X").length;
    let h = kpis([kpi("Cambio actual", n0(I0), "min con la máquina detenida"), kpi("Cambio propuesto", n0(I1), "min", "ok"), kpi("Reducción", pc(red / I0, 0), "", "hi"), kpi("Horas liberadas", nf(hs, 1), "por semana"), kpi("Horas al año", n0(ha)), kpi("Valor anual", money(val))]);
    h += table(["Actividad", "Actual (min)", "Tipo actual", "Propuesta", "Tipo propuesto", "Cambio"], A.map(a => [esc(a.nm), n0(a.m0), a.t0 === "I" ? "Interna" : "Externa", a.t1 === "X" ? "—" : n0(a.m1), a.t1 === "I" ? "Interna" : a.t1 === "E" ? "Externa" : "Eliminada", a.t1 === "X" ? pill("ok", "Se elimina") : a.t0 === "I" && a.t1 === "E" ? pill("ok", "Pasa a externa") : a.m1 < a.m0 ? pill("info", "Se acorta") : a.m1 > a.m0 ? pill("bad", "Aumenta") : pill("warn", "Sin cambio")]), { num:[1, 3], foot:["Total interno", n0(I0), "", n0(I1), "", ""] });
    h += steps([
      { t:"Separar actividades internas y externas", q:"Hoy " + A.filter(a => a.t0 === "I").length + " actividades se hacen con la máquina detenida y suman " + n0(I0) + " minutos.", why:"en la mayoría de los cambios sin estudiar, buena parte de lo que se hace con la máquina detenida podría hacerse antes." },
      { t:"Convertir internas en externas", q:conv + " actividades pasan a hacerse con la máquina funcionando (preparar molde, herramientas y material antes de detener)." + (elim ? " " + elim + " actividad(es) se eliminan." : ""), s:"Tiempo externo propuesto = " + n0(E1) + " min (debe caber dentro del tiempo de producción entre cambios)" },
      { t:"Optimizar las internas", q:acort + " actividades internas se acortan (sujeciones y acoples rápidos, recetas de parámetros, trabajo en paralelo).", f:"Cambio propuesto = Σ minutos de las actividades internas propuestas", s:n0(I0) + " → " + n0(I1) + " min", r:"−" + n0(red) + " min por cambio (" + pc(red / I0, 0) + ")", c:"ok" },
      { t:"Horas productivas liberadas", f:"Horas/semana = reducción × cambios por semana ÷ 60   ·   Horas/año = horas/semana × semanas", s:n0(red) + " × " + nf(n, 0) + " ÷ 60 = " + nf(hs, 2) + " h/semana · × " + n0(sem) + " = " + n0(ha) + " h/año", r:nf(hs, 1) + " h por semana" },
      { t:"Valor económico", f:"Valor anual = horas liberadas al año × valor de la hora", s:n0(ha) + " × " + money(vh) + " = " + money(val), r:money(val) + " al año", why:"solo vale el margen si hay demanda para usar esas horas; si no, el beneficio es producir en lotes más pequeños con menos inventario o evitar horas extra." }
    ]);
    h += chart({ title:"Tiempo de cambio antes y después", bars:[{ x:1, y:I0, cls:"bar2", lbl:n0(I0) + " min" }, { x:2, y:I1, cls:"bar3", lbl:n0(I1) + " min" }, { x:3, y:E1, cls:"bar1", lbl:n0(E1) + " min" }], xcat:["Interno actual", "Interno propuesto", "Externo propuesto"], ymin:0, ylab:"Minutos" });
    return h;
  },
  rel:["oee", "vsm", "lean", "generador-informe"]
});

/* ---------------- GENERADOR DE INFORMES (versión completa) ---------------- */
def("generador-informe", "inf", {
  t:"Generador de informe técnico", ico:"Inf", d:"Arma un informe con formato profesional y descárgalo en Word o PDF", btn:"Generar informe",
  ey:"Comunicación técnica · Informe",
  lead:"Completa las secciones y elige qué memorias de cálculo anexar. Luego descarga el documento en Word o PDF.",
  f:[SEL("tipo", "Tipo de documento", "tec", [["tec", "Informe técnico"], ["prac", "Informe de práctica profesional"], ["eje", "Informe ejecutivo"], ["av", "Informe de avance de proyecto"]]), TXT("tit", "Título", "Reducción del tiempo de cambio de formato en la inyectora 4 mediante SMED"), TXT("aut", "Autor(es)", "Nombre Apellido, estudiante de Ingeniería Industrial"), TXT("org", "Empresa o institución", "Envases del Sur S.A., planta Maipú"), TXT("dest", "Dirigido a", "Gerencia de Operaciones"), TXT("fec", "Fecha", "Octubre de 2026"),
     AREA("res", "Resumen ejecutivo", "La inyectora 4 detiene su producción 78 minutos en cada cambio de formato y realiza cinco cambios por semana, lo que equivale a 6,5 horas semanales sin producir. Se aplicó la metodología SMED a partir de la filmación y el análisis de dos cambios completos. Tres actividades pasaron a realizarse con la máquina en funcionamiento y otras siete se acortaron con sujeciones y acoples rápidos. El tiempo de cambio con la máquina detenida bajó a 31 minutos, una reducción de 60 %, que libera 3,9 horas productivas por semana (188 horas al año). Valorizadas al margen de contribución de la línea, equivalen a cerca de $ 41 millones anuales. Se recomienda estandarizar el procedimiento y replicarlo en las inyectoras 2 y 3.", { w:true }),
     AREA("ant", "Introducción y antecedentes", "La planta fabrica envases plásticos por inyección para la industria de alimentos. La demanda de pedidos pequeños y variados ha aumentado, lo que obliga a cambiar de molde con más frecuencia.\nEn el último trimestre la inyectora 4 registró un OEE de 61 %. El registro de detenciones muestra que los cambios de formato son la principal pérdida de disponibilidad.", { w:true }),
     AREA("obj", "Objetivos (el primero es el general; luego los específicos, uno por línea)", "Reducir en al menos 50 % el tiempo de cambio de formato de la inyectora 4.\nMedir y describir las actividades del cambio de formato actual.\nRediseñar el procedimiento aplicando las etapas de SMED.\nCuantificar las horas productivas liberadas y su valor económico.", { w:true }),
     AREA("alc", "Alcance y limitaciones", "El estudio considera solo la inyectora 4 y los moldes de la familia de envases de 500 ml. No incluye inversiones en moldes nuevos. La valorización supone que existe demanda para producir en las horas liberadas.", { w:true }),
     AREA("met", "Metodología", "Se filmaron dos cambios de formato completos en turnos distintos y se registró la duración de cada actividad.\nCada actividad se clasificó como interna (requiere la máquina detenida) o externa (puede hacerse con la máquina funcionando).\nCon el equipo de operadores y mantención se propusieron mejoras siguiendo las etapas de SMED: separar, convertir y optimizar.\nLos tiempos propuestos se validaron en un cambio piloto.", { w:true }),
     AREA("resu", "Resultados", "El tiempo de cambio con la máquina detenida bajó de 78 a 31 minutos (−60 %).\nTres de las once actividades pasaron a realizarse con la máquina en funcionamiento: buscar el molde, preparar herramientas y precalentar el molde nuevo.\nSiete actividades internas se acortaron con sujeciones rápidas, acoples rápidos de refrigeración y una receta estandarizada de parámetros.\nCon cinco cambios por semana se liberan 3,9 horas productivas semanales y 188 horas al año, valorizadas en cerca de $ 41 millones (Anexo A).", { w:true }),
     AREA("an", "Análisis y discusión", "La mayor parte de la reducción proviene de preparar el cambio antes de detener la máquina, medida que no requirió inversión. Las sujeciones rápidas explican la segunda parte del ahorro.\nEl beneficio económico depende de que exista demanda para las horas liberadas; si no la hubiera, el beneficio se traduciría en lotes más pequeños y menor inventario de producto terminado.", { w:true }),
     AREA("con", "Conclusiones (una por objetivo, en el mismo orden)", "Se cumplió el objetivo general: el tiempo de cambio se redujo 60 %, sobre la meta de 50 %.\nEl cambio actual tenía 78 minutos de actividades internas, de las cuales 27 podían realizarse con la máquina funcionando.\nEl procedimiento rediseñado quedó documentado y validado en un cambio piloto.\nLas horas liberadas tienen un valor estimado de $ 41 millones anuales.", { w:true }),
     AREA("rec", "Recomendaciones (una por línea: acción, responsable y plazo)", "Formalizar el procedimiento con una lista de verificación. Responsable: jefe de producción. Plazo: 2 semanas.\nCapacitar a los operadores de los tres turnos. Responsable: supervisor de inyección. Plazo: 1 mes.\nReplicar el estudio en las inyectoras 2 y 3. Responsable: ingeniero de procesos. Plazo: próximo trimestre.\nMedir el tiempo de cambio cada semana y publicarlo en el tablero de la línea.", { w:true }),
     AREA("ref", "Referencias (formato APA, una por línea)", "Shingo, S. (1985). A revolution in manufacturing: The SMED system. Productivity Press.\nOhno, T. (1988). Toyota production system: Beyond large-scale production. Productivity Press.", { w:true }),
     { k:"anx", l:"Anexar memorias de cálculo", d:"smed", t:"calcs", h:"Marca solo los cálculos que respaldan este informe. Aparecen las herramientas que ya calculaste, más SMED." }],
  c(v){
    const tipo = { tec:"Informe técnico", prac:"Informe de práctica profesional", eje:"Informe ejecutivo", av:"Informe de avance" }[v.tipo];
    const par = s => lines(s).map(x => "<p>" + esc(x) + "</p>").join(""), ol = s => "<ol>" + lines(s).map(x => "<li>" + esc(x) + "</li>").join("") + "</ol>";
    const objs = lines(v.obj), anx = String(v.anx || "").split(",").filter(id => C[id] && id !== "generador-informe");
    const S2 = [];
    if (lines(v.ant).length) S2.push(["Introducción y antecedentes", par(v.ant)]);
    if (objs.length) S2.push(["Objetivos", "<p><b>Objetivo general:</b> " + esc(objs[0]) + "</p>" + (objs.length > 1 ? "<p><b>Objetivos específicos:</b></p><ol>" + objs.slice(1).map(x => "<li>" + esc(x) + "</li>").join("") + "</ol>" : "")]);
    if (lines(v.alc).length) S2.push(["Alcance y limitaciones", par(v.alc)]);
    if (lines(v.met).length) S2.push(["Metodología", lines(v.met).length > 1 ? ol(v.met) : par(v.met)]);
    if (lines(v.resu).length) S2.push(["Resultados", lines(v.resu).length > 1 ? "<ul>" + lines(v.resu).map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>" : par(v.resu)]);
    if (lines(v.an).length) S2.push(["Análisis y discusión", par(v.an)]);
    if (lines(v.con).length) S2.push(["Conclusiones", lines(v.con).length > 1 ? ol(v.con) : par(v.con)]);
    if (lines(v.rec).length) S2.push(["Recomendaciones", lines(v.rec).length > 1 ? ol(v.rec) : par(v.rec)]);
    let d = '<div class="doc" id="docout"><div class="noexp"><p class="eyebrow">' + tipo + "</p><h1>" + esc(v.tit) + '</h1><p class="meta">' + [v.aut, v.org, v.dest ? "Para: " + v.dest : "", v.fec].filter(Boolean).map(esc).join(" · ") + "</p></div>";
    if (lines(v.res).length) d += "<h2>Resumen ejecutivo</h2>" + par(v.res);
    d += S2.map((s, i) => "<h2>" + (i + 1) + ". " + s[0] + "</h2>" + s[1]).join("");
    if (lines(v.ref).length) d += "<h2>Referencias</h2>" + lines(v.ref).map(x => '<p style="padding-left:2em;text-indent:-2em">' + esc(x) + "</p>").join("");
    const L = "ABCDEFGHIJ";
    anx.forEach((id, i) => { const a = L[i] || String(i + 1); d += "<h2>Anexo " + a + ". Memoria de cálculo: " + C[id].t + "</h2><h3>" + a + ".1 Datos de entrada</h3>" + inputSummary(id) + "<h3>" + a + ".2 Resultados y desarrollo</h3>" + demote(safeCalc(id)); });
    d += "</div>";
    const warn = anx.length ? "" : note("No se anexó ninguna memoria de cálculo. Si el informe cita cifras calculadas, márcalas en «Anexar memorias de cálculo».", "info noexp");
    return '<div class="actions no-print" style="margin-top:0;border:0;padding-top:0">' + expBtns("informe") + '<button class="btn ghost small" type="button" data-act="copyrich" data-t="docout">Copiar con formato</button></div>' + warn + d;
  },
  rel:["smed", "estructura-informe", "citas-apa", "plantillas", "reportes"]
});
const demote = h => String(h).replace(/<h3/g, "<h4").replace(/<\/h3>/g, "</h4>");
