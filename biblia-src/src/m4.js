/* ============ HISTORIA, PENSADORES Y BIBLIOGRAFÍA ============ */
const HIST = [
["1776", "Adam Smith publica <i>La riqueza de las naciones</i>: la división del trabajo en una fábrica de alfileres multiplica la productividad."],
["1798", "Eli Whitney propone la fabricación de mosquetes con piezas intercambiables, base de la producción en serie."],
["1832", "Charles Babbage publica <i>On the Economy of Machinery and Manufactures</i>, con análisis de costos y división del trabajo."],
["1881", "Frederick W. Taylor inicia estudios de tiempos en Midvale Steel."],
["1908", "Se crea el primer programa universitario de ingeniería industrial en la Universidad Estatal de Pensilvania."],
["1911", "Taylor publica <i>The Principles of Scientific Management</i>. Los Gilbreth desarrollan el estudio de movimientos."],
["1913", "Henry Ford pone en marcha la línea de ensamble móvil en Highland Park. Ford W. Harris publica el modelo EOQ."],
["1910s", "Henry Gantt crea el diagrama de barras para programar el trabajo."],
["1916", "Henri Fayol publica <i>Administración industrial y general</i>: planificar, organizar, dirigir, coordinar y controlar."],
["1924", "Walter Shewhart crea el gráfico de control en Bell Labs. Estudios de Hawthorne (Elton Mayo, 1924–1932) sobre el factor humano."],
["1937–1945", "Durante la Segunda Guerra Mundial nace la investigación de operaciones en equipos británicos y estadounidenses (radares, convoyes, logística)."],
["1947", "George Dantzig desarrolla el método Simplex."],
["1950", "W. Edwards Deming dicta sus seminarios en Japón. Shigeo Shingo distingue actividades internas y externas en los cambios de formato."],
["1950s–1970s", "Taiichi Ohno desarrolla el Sistema de Producción Toyota (justo a tiempo, kanban, jidoka)."],
["1957–1958", "Se crean CPM (DuPont) y PERT (programa Polaris)."],
["1964", "Joseph Orlicky implementa MRP en J. I. Case."],
["1971", "Seiichi Nakajima impulsa el TPM en Japón."],
["1979", "Michael Porter publica las cinco fuerzas competitivas en <i>Harvard Business Review</i>."],
["1984", "Eliyahu Goldratt publica <i>La meta</i> (teoría de restricciones)."],
["1986", "Motorola crea Seis Sigma. Al año siguiente Estados Unidos crea el premio nacional de calidad Malcolm Baldrige."],
["1987", "Se publica la primera versión de la norma ISO 9000."],
["1988–1990", "John Krafcik acuña el término «lean». Womack, Jones y Roos publican <i>La máquina que cambió el mundo</i> (1990)."],
["1990", "Gartner acuña el término ERP."],
["2001", "Manifiesto Ágil. GHG Protocol corporativo."],
["2011", "Se presenta el concepto de Industria 4.0 en la feria de Hannover."],
["2020s", "Analítica avanzada, inteligencia artificial, gemelos digitales, sostenibilidad y economía circular se integran a la ingeniería industrial."]
];
function pgHistoria(){
  return pg("Aprender · Historia", "Historia de la ingeniería industrial", "De la división del trabajo a la industria 4.0: cómo nacieron las ideas que usas en cada herramienta.",
    '<div class="steps">' + HIST.map(h => '<div class="step"><span class="sn" style="width:auto;min-width:34px;padding:0 8px;border-radius:17px;font-size:12px">' + h[0] + '</span><div class="sb"><p class="q">' + h[1] + "</p></div></div>").join("") + "</div>" +
    h3("Cuatro grandes etapas") + acc([
      ["Administración científica (1880–1930)", "<p>Taylor, los Gilbreth, Gantt y Fayol buscaron reemplazar la improvisación por métodos medidos: estudio de tiempos, selección y capacitación de trabajadores, incentivos, planificación separada de la ejecución. Aumentó enormemente la productividad, pero fue criticada por deshumanizar el trabajo. Los estudios de Hawthorne mostraron que la motivación y el grupo social también afectan el rendimiento.</p>"],
      ["Investigación de operaciones y estadística (1940–1970)", "<p>La guerra exigió optimizar recursos escasos. Nacieron la programación lineal, la teoría de colas, el control estadístico de procesos aplicado masivamente, CPM y PERT, y la simulación. Las computaciones permitieron resolver modelos grandes.</p>"],
      ["Calidad total y producción japonesa (1950–1990)", "<p>Deming, Juran e Ishikawa en calidad; Ohno y Shingo en producción. Japón demostró que se podía producir con alta calidad, bajo inventario y gran variedad. Occidente lo estudió y lo difundió como lean y TQM.</p>"],
      ["Sistemas integrados, datos y sostenibilidad (1990–hoy)", "<p>ERP, cadena de suministro global, Seis Sigma, gestión de proyectos profesional, analítica de datos, industria 4.0, inteligencia artificial y exigencias de sostenibilidad. El ingeniero industrial pasa de optimizar una máquina a diseñar sistemas completos.</p>"]
    ], true));
}
const GURUS = [
["Frederick W. Taylor (1856–1915)", "Padre de la administración científica. Estudio de tiempos, estándares de trabajo, pago por pieza diferencial, separación entre planificación y ejecución.", "<i>The Principles of Scientific Management</i> (1911)."],
["Frank (1868–1924) y Lillian Gilbreth (1878–1972)", "Estudio de movimientos, therbligs, diagramas de proceso. Lillian fue pionera de la psicología industrial y la ergonomía; doctora en psicología y referente de las mujeres en ingeniería.", "<i>Motion Study</i> (1911); <i>The Psychology of Management</i> (1914)."],
["Henry L. Gantt (1861–1919)", "Diagrama de barras para programar, sistema de bonos por tarea.", "<i>Work, Wages, and Profits</i> (1910)."],
["Henri Fayol (1841–1925)", "Funciones de la administración y 14 principios de gestión.", "<i>Administration industrielle et générale</i> (1916)."],
["Henry Ford (1863–1947)", "Producción en masa, línea de ensamble móvil, estandarización.", "<i>My Life and Work</i> (1922)."],
["Walter A. Shewhart (1891–1967)", "Gráficos de control, causas comunes y asignables, ciclo planificar-hacer-estudiar.", "<i>Economic Control of Quality of Manufactured Product</i> (1931)."],
["W. Edwards Deming (1900–1993)", "Calidad como sistema, 14 puntos para la gestión, ciclo PDCA, crítica a las metas numéricas sin método. El premio de calidad más importante de Japón lleva su nombre.", "<i>Out of the Crisis</i> (1986)."],
["Joseph M. Juran (1904–2008)", "Trilogía de la calidad (planificación, control, mejora), principio de Pareto, costo de la calidad.", "<i>Quality Control Handbook</i> (1951)."],
["Kaoru Ishikawa (1915–1989)", "Diagrama causa-efecto, círculos de calidad, siete herramientas básicas.", "<i>Guide to Quality Control</i> (1968)."],
["Philip Crosby (1926–2001)", "Cero defectos, «la calidad es gratis», costo de no calidad.", "<i>Quality Is Free</i> (1979)."],
["Taiichi Ohno (1912–1990)", "Sistema de Producción Toyota, justo a tiempo, kanban, siete desperdicios, 5 porqués.", "<i>Toyota Production System</i> (1978; en inglés 1988)."],
["Shigeo Shingo (1909–1990)", "SMED, poka-yoke, inspección en la fuente.", "<i>A Revolution in Manufacturing: The SMED System</i> (1985)."],
["George Dantzig (1914–2005)", "Método Simplex y programación lineal.", "<i>Linear Programming and Extensions</i> (1963)."],
["Eliyahu Goldratt (1947–2011)", "Teoría de restricciones, contabilidad del throughput, cadena crítica.", "<i>La meta</i> (1984)."],
["Peter Drucker (1909–2005)", "Administración por objetivos, el trabajador del conocimiento, la gestión como disciplina.", "<i>The Practice of Management</i> (1954)."],
["Michael Porter (1947)", "Cinco fuerzas, cadena de valor, ventaja competitiva, valor compartido.", "<i>Competitive Strategy</i> (1980); <i>Competitive Advantage</i> (1985)."],
["Genichi Taguchi (1924–2012)", "Función de pérdida de calidad, diseño robusto de experimentos.", "<i>Introduction to Quality Engineering</i> (1986)."],
["Nassir Sapag Chain (Chile)", "Referente latinoamericano en preparación y evaluación de proyectos; sus libros son texto base en las universidades chilenas.", "<i>Preparación y evaluación de proyectos</i> (con R. Sapag y J. M. Sapag)."]
];
function pgPensadores(){
  return pg("Aprender · Pensadores", "Grandes pensadores de la disciplina", "Quiénes crearon las ideas de la ingeniería industrial, qué aportaron y qué leer de cada uno.",
    table(["Autor", "Aporte principal", "Obra clave"], GURUS.map(g => ["<b>" + g[0] + "</b>", g[1], g[2]])));
}
const BIB = [
["Operaciones y logística", ["Chase, R. B., y Jacobs, F. R. (2014). <i>Administración de operaciones: producción y cadena de suministros</i> (13.ª ed.). McGraw-Hill.", "Heizer, J., y Render, B. (2014). <i>Principios de administración de operaciones</i> (9.ª ed.). Pearson.", "Krajewski, L., Ritzman, L., y Malhotra, M. (2013). <i>Administración de operaciones</i> (10.ª ed.). Pearson.", "Nahmias, S. (2007). <i>Análisis de la producción y las operaciones</i> (5.ª ed.). McGraw-Hill.", "Chopra, S., y Meindl, P. (2013). <i>Administración de la cadena de suministro</i> (5.ª ed.). Pearson.", "Ballou, R. H. (2004). <i>Logística: administración de la cadena de suministro</i> (5.ª ed.). Pearson."]],
["Economía, finanzas y proyectos", ["Sapag Chain, N., Sapag Chain, R., y Sapag Puelma, J. M. (2014). <i>Preparación y evaluación de proyectos</i> (6.ª ed.). McGraw-Hill.", "Blank, L., y Tarquin, A. (2012). <i>Ingeniería económica</i> (7.ª ed.). McGraw-Hill.", "Horngren, C., Datar, S., y Rajan, M. (2012). <i>Contabilidad de costos</i> (14.ª ed.). Pearson.", "Ross, S., Westerfield, R., y Jaffe, J. (2012). <i>Finanzas corporativas</i> (9.ª ed.). McGraw-Hill.", "Project Management Institute. (2021). <i>PMBOK Guide</i> (7.ª ed.)."]],
["Investigación de operaciones y estadística", ["Hillier, F. S., y Lieberman, G. J. (2010). <i>Introducción a la investigación de operaciones</i> (9.ª ed.). McGraw-Hill.", "Taha, H. A. (2012). <i>Investigación de operaciones</i> (9.ª ed.). Pearson.", "Walpole, R. et al. (2012). <i>Probabilidad y estadística para ingeniería y ciencias</i> (9.ª ed.). Pearson.", "Montgomery, D. C. (2013). <i>Introduction to Statistical Quality Control</i> (7th ed.). Wiley.", "Law, A. M. (2015). <i>Simulation Modeling and Analysis</i> (5th ed.). McGraw-Hill."]],
["Trabajo, calidad y mejora", ["Freivalds, A., y Niebel, B. W. (2014). <i>Ingeniería industrial de Niebel</i> (13.ª ed.). McGraw-Hill.", "Kanawaty, G. (Ed.). (1996). <i>Introducción al estudio del trabajo</i> (4.ª ed.). OIT.", "Gutiérrez Pulido, H., y de la Vara, R. (2013). <i>Control estadístico de la calidad y Seis Sigma</i>. McGraw-Hill.", "Womack, J. P., y Jones, D. T. (1996). <i>Lean Thinking</i>. Simon & Schuster.", "Liker, J. K. (2004). <i>The Toyota Way</i>. McGraw-Hill.", "Rother, M., y Shook, J. (1998). <i>Learning to See</i>. Lean Enterprise Institute.", "Goldratt, E. M., y Cox, J. (1984). <i>La meta</i>."]],
["Estrategia, innovación y gestión", ["Porter, M. E. (1985). <i>Ventaja competitiva</i>. CECSA.", "Osterwalder, A., y Pigneur, Y. (2011). <i>Generación de modelos de negocio</i>. Deusto.", "Kaplan, R. S., y Norton, D. P. (1996). <i>The Balanced Scorecard</i>. Harvard Business School Press.", "Kotter, J. P. (1996). <i>Leading Change</i>. Harvard Business School Press.", "Minto, B. (2009). <i>The Pyramid Principle</i>. Pearson."]],
["Recursos gratuitos en línea", ["Hyndman y Athanasopoulos, <i>Forecasting: Principles and Practice</i> (otexts.com/fpp3).", "James et al., <i>An Introduction to Statistical Learning</i> (statlearning.com).", "Biblioteca del Congreso Nacional: leyes chilenas (bcn.cl/leychile).", "Cochilco: estadísticas mineras (cochilco.cl).", "Banco Central de Chile: base de datos estadísticos (si3.bcentral.cl).", "INE: estadísticas nacionales (ine.gob.cl).", "MIT OpenCourseWare: cursos de operaciones y optimización (ocw.mit.edu)."]]
];
function pgBiblio(){
  return pg("Aprender · Bibliografía", "Bibliografía esencial", "Los libros y fuentes que conviene tener a mano durante la carrera y el ejercicio profesional, en formato APA.",
    BIB.map(b => h3(b[0]) + "<ul class='prose'>" + b[1].map(x => '<li style="padding-left:1.5em;text-indent:-1.5em;list-style:none">' + x + "</li>").join("") + "</ul>").join(""));
}

/* ============ PÁGINAS DE MALLA E INDUSTRIAS ============ */
function pgMalla(){
  S.malla = S.malla || {};
  const ok = COURSES.filter(c => S.malla[c.id]).length;
  let h = pg("Mi carrera · Ingeniería Industrial Advance (UNAB)", "Mi malla curricular", "Los ramos de tu programa ordenados por trimestre. Cada ramo abre apuntes por unidad, herramientas para practicar y bibliografía. Marca los aprobados para seguir tu avance.",
    kpis([kpi("Ramos en la malla", COURSES.length), kpi("Aprobados", ok, "", "ok"), kpi("Avance", pc(ok / COURSES.length, 0), "", "hi")]));
  h += '<div class="malla">' + [1, 2, 3, 4, 5, 6, 7, 8].map(t => '<div class="mcol"><div class="mhead">' + t + "° trimestre</div>" + COURSES.filter(c => inTri(c, t)).map(c => c.tri !== t ? '<div class="mcell' + (S.malla[c.id] ? " ok" : "") + '"><button type="button" class="linkb" data-go="' + c.id + '">' + triName(c, t) + '</button><span class="hint">Se marca en el ' + c.tri + "° trimestre</span></div>" : '<div class="mcell' + (S.malla[c.id] ? " ok" : "") + '"><button type="button" class="linkb" data-go="' + c.id + '">' + triName(c, t) + '</button><label class="mchk"><input type="checkbox" data-malla="' + c.id + '"' + (S.malla[c.id] ? " checked" : "") + "> Aprobado</label></div>").join("") + "</div>").join("") + "</div>";
  h += note("Malla basada en la publicada por UNAB Online para Ingeniería Industrial Advance (sujeta a cambios por la universidad). Inglés I a IV se agrupan en una sola página de inglés técnico.", "info");
  return h;
}
const crsFigs = id => CX[id] && CX[id].fig ? CX[id].fig.map(f => { try { return f(); } catch (e) { return ""; } }).join("") : "";
function crsSecs(id){ const e = CX[id] || {}, out = [];
  if (e.fx) out.push(["Fórmulas clave del ramo", '<div class="fxl">' + e.fx.map(f => "<h4>" + f[0] + "</h4>" + M(f[1]) + (f[2] || "")).join("") + "</div>"]);
  if (e.ej) out.push(["Ejemplo resuelto aplicado", '<div class="ejr">' + e.ej + "</div>"]);
  out.push(["Tips del experto y de estudio", '<ul class="tips">' + (e.tips || []).concat(TIPS_ESTUDIO).map(t => "<li>" + t + "</li>").join("") + "</ul>"]);
  return out; }
function pgRamo(id){
  const c = COURSES.find(x => x.id === id), i = COURSES.indexOf(c), pr = COURSES[i - 1], nx = COURSES[i + 1];
  let h = '<div id="ramodoc"><p class="eyebrow">' + c.tri + "° trimestre · Ingeniería Industrial Advance</p><h1>" + c.t + '</h1><p class="lead">' + c.d + "</p>";
  h += '<section class="card"><h2>Por qué es importante</h2><p>' + c.why + "</p>" + (typeof CG !== "undefined" && CG[c.id] ? CG[c.id] : "") + "<p class='hint'>Cada unidad parte con una explicación desde cero (por qué importa, la idea en simple, términos y símbolos, paso a paso, ejemplo explicado y errores comunes) y termina con un resumen técnico. Toca las siglas subrayadas para ver su significado.</p></section>";
  h += crsFigs(c.id) + '<h2 class="sh">Unidades y contenidos</h2>' + acc(unitsOf(c), true);
  if (CX[c.id]) h += '<h2 class="sh">Practica y aplica</h2>' + acc(crsSecs(c.id), false);
  if (c.tools.length) h += '<h2 class="sh">Practica con estas herramientas</h2><div class="quick no-print">' + c.tools.filter(t => C[t]).map(t => '<button class="chip" type="button" data-go="' + t + '">' + C[t].t + "</button>").join("") + "</div>";
  h += '<h2 class="sh">Bibliografía recomendada</h2><ul class="prose">' + c.src.map(s => '<li style="list-style:none;padding-left:1.5em;text-indent:-1.5em">' + s + "</li>").join("") + "</ul></div>";
  h += '<div class="actions no-print"><label class="chk"><input type="checkbox" data-malla="' + c.id + '"' + (S.malla && S.malla[c.id] ? " checked" : "") + '> Marcar como aprobado</label>' + expBtns("ramo", ' data-c="' + c.id + '"') + "</div>";
  h += '<div class="pager">' + (pr ? '<button class="btn ghost" type="button" data-go="' + pr.id + '">← ' + pr.t + "</button>" : "<span></span>") + (nx ? '<button class="btn ghost" type="button" data-go="' + nx.id + '">' + nx.t + " →</button>" : "") + "</div>";
  return h;
}
function pgIndustrias(){
  return pg("Industrias · Dónde trabaja un ingeniero industrial", "Industrias y campo laboral", "Cómo funciona cada sector, qué hace en él un ingeniero industrial, con qué indicadores lo evalúan y qué herramientas usa.",
    '<div class="tiles">' + IND.map(x => '<button class="tile" type="button" data-go="ind-' + x[0].normalize("NFD").replace(/[̀-ͯ]/g, "") + '"><span class="ti">' + x[1].slice(0, 3) + '</span><span class="tt">' + x[1] + '</span><span class="td">' + x[2].split(".")[0] + ".</span></button>").join("") + "</div>");
}
const indFigs = key => IX[key] ? IX[key].fig.map(f => { try { return f(); } catch (e) { return ""; } }).join("") : "";
function indSecs(x){ const e = IX[x[0]] || {}, out = [["Qué hace un ingeniero industrial", x[4]]];
  if (e.dia) out.push(["Un día típico de trabajo", e.dia]);
  out.push(["Indicadores con que se mide el trabajo", "<p>" + x[5] + "</p>"]);
  if (e.fx) out.push(["Fórmulas clave del sector", '<div class="fxl">' + e.fx.map(f => "<h4>" + f[0] + "</h4>" + M(f[1]) + (f[2] || "")).join("") + "</div>"]);
  if (e.ej) out.push(["Ejemplo numérico", '<div class="ejr">' + e.ej + "</div>"]);
  out.push(["Herramientas que más se usan", "<p>" + x[6] + "</p>"], ["Normativa relevante", "<p>" + x[7] + "</p>"], ["Ejemplo de proyecto", x[8]]);
  if (e.tips) out.push(["Tips del experto", '<ul class="tips">' + e.tips.map(t => "<li>" + t + "</li>").join("") + "</ul>"]);
  return out; }
function pgIndustria(k){
  const x = IND.find(i => "ind-" + i[0].normalize("NFD").replace(/[̀-ͯ]/g, "") === k);
  return '<div id="inddoc">' + pg("Industrias", x[1], x[2],
    '<section class="card"><h2>Cómo funciona el sector</h2>' + x[3] + "</section>" +
    indFigs(x[0]) + acc(indSecs(x), true) +
    '<h2 class="sh">Practica</h2><div class="quick no-print">' + x[9].filter(t => C[t]).map(t => '<button class="chip" type="button" data-go="' + t + '">' + C[t].t + "</button>").join("") + "</div>") + "</div>" +
    '<div class="actions no-print">' + expBtns("ind", ' data-c="' + k + '"') + "</div>";
}
