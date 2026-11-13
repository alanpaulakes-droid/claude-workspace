/* ============ COMPLETAR TEMAS · LOTE 2: RAMOS DE LA MALLA (bloques pendientes) ============ */
const sqlBox = s => '<pre class="mono" style="white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%">' + esc(s) + "</pre>";

T2["ramo-base-datos"] = {
  fxT:"Estructuras clave de SQL (este ramo no se apoya en fórmulas)",
  fxH:"<p>En bases de datos, el equivalente a las fórmulas son las estructuras de consulta. Estas cuatro resuelven la mayoría de los casos:</p>" +
    "<p><b>1. Filtrar y ordenar</b></p>" + sqlBox("SELECT columnas\nFROM tabla\nWHERE condición\nORDER BY columna DESC;") +
    "<p><b>2. Resumir por grupo</b> (WHERE filtra filas antes de agrupar; HAVING filtra grupos después)</p>" + sqlBox("SELECT grupo, COUNT(*), SUM(monto), AVG(monto)\nFROM tabla\nWHERE condición_de_fila\nGROUP BY grupo\nHAVING condición_de_grupo;") +
    "<p><b>3. Unir tablas por su clave</b></p>" + sqlBox("SELECT p.nombre, v.cantidad\nFROM ventas v\nJOIN productos p ON p.id = v.producto_id;") +
    "<p><b>4. Incluir lo que no tiene coincidencias</b> (por ejemplo, productos sin ventas)</p>" + sqlBox("SELECT p.nombre, COUNT(v.id) AS ventas\nFROM productos p\nLEFT JOIN ventas v ON v.producto_id = p.id\nGROUP BY p.nombre;"),
  err:q9ul([
    "<b>Usar WHERE para filtrar un resultado agregado</b> («WHERE SUM(monto) &gt; 100»): eso va en HAVING.",
    "<b>Olvidar la condición del JOIN:</b> se genera el producto cartesiano (cada fila con todas las de la otra tabla) y los totales se multiplican.",
    "<b>Usar JOIN cuando se necesita LEFT JOIN:</b> desaparecen los registros sin coincidencia (clientes sin compras, productos sin ventas).",
    "<b>Comparar con NULL usando «=»:</b> se escribe IS NULL o IS NOT NULL.",
    "<b>Guardar datos repetidos en varias tablas</b> (sin normalizar): al actualizar uno, los demás quedan inconsistentes.",
    "<b>Ejecutar UPDATE o DELETE sin WHERE:</b> cambia o borra todas las filas. Prueba primero la condición con un SELECT."])
};

T2["ramo-costos-presupuestos"] = {
  err:q9ul([
    "<b>Asignar los costos indirectos con una sola base</b> (por ejemplo, horas de MOD) cuando los productos consumen recursos muy distintos; el costeo ABC corrige esa distorsión.",
    "<b>Decidir con el costo total unitario</b> en vez del margen de contribución y los costos relevantes.",
    "<b>Armar el presupuesto de producción sin considerar inventarios:</b> producción = ventas + inventario final deseado − inventario inicial.",
    "<b>Comparar el real con un presupuesto estático</b> cuando el volumen cambió; para analizar eficiencia se usa el presupuesto flexible.",
    "<b>Explicar una varianza solo con su signo:</b> hay que separarla en precio y cantidad (o eficiencia) y buscar la causa.",
    "<b>Confundir presupuesto de caja con estado de resultados:</b> las ventas a crédito y la depreciación hacen que no coincidan."])
};

T2["ramo-evaluacion-proyectos"] = {
  err:q9ul([
    "<b>Sobreestimar la demanda</b> con datos de mercado no verificados o suponiendo que se captará una gran participación desde el primer año.",
    "<b>Evaluar el flujo total cuando se pide el incremental</b> (o al revés) en proyectos de ampliación o reemplazo.",
    "<b>Olvidar el capital de trabajo</b> y su recuperación al final del horizonte.",
    "<b>Mezclar el flujo puro con el financiado:</b> el flujo puro se descuenta con la tasa del proyecto; el del inversionista incluye el préstamo y usa la tasa del inversionista.",
    "<b>Usar un valor de desecho que no corresponde</b> o duplicarlo (contable, comercial y económico son métodos alternativos).",
    "<b>Presentar un solo escenario:</b> sin análisis de sensibilidad no se sabe qué variable puede volver negativo el VAN."])
};

T2["ramo-ingenieria-economica"] = {
  err:q9ul([
    "<b>Convertir tasas dividiendo o multiplicando</b> cuando son efectivas: (1 + i<sub>anual</sub>) = (1 + i<sub>mensual</sub>)<sup>12</sup>.",
    "<b>Ubicar mal los flujos en el diagrama:</b> la fórmula P = A·(P/A, i, n) entrega el valor un período antes del primer pago.",
    "<b>Restar la depreciación del flujo de caja</b> sin volver a sumarla después de calcular el impuesto.",
    "<b>Comparar alternativas de vidas distintas con VAN</b> sin igualar el horizonte; usa CAUE.",
    "<b>Mezclar flujos nominales con tasa real</b> (o reales con tasa nominal).",
    "<b>Decidir el reemplazo con el costo histórico</b> del equipo actual: lo relevante es su valor de mercado hoy y sus costos futuros."])
};

T2["ramo-ingles"] = {
  fxT:"Estructuras clave del inglés técnico (este ramo no se apoya en fórmulas)",
  fxH:"<p>Estas estructuras sirven para informes, correos y presentaciones de trabajo:</p>" + table(["Para…", "Estructura", "Ejemplo"], [
    ["Presentar resultados", "The results show that + oración", "The results show that downtime fell by 12 %."],
    ["Describir un proceso", "Voz pasiva: is/was + participio", "The parts are inspected before packing."],
    ["Recomendar", "We recommend + verbo en -ing / that + sujeto + verbo", "We recommend replacing the pump."],
    ["Condición", "If + presente, will + verbo", "If demand increases, we will add a shift."],
    ["Comparar", "más corto: -er than / más largo: more … than", "Line B is faster than line A; it is more reliable."],
    ["Pedir algo en un correo", "Could you please + verbo…?", "Could you please send the updated schedule?"]]) +
    "<p><b>Números:</b> en inglés el decimal se separa con punto y los miles con coma: 1,250.5 equivale a 1.250,5 en Chile.</p>",
  err:q9ul([
    "<b>Invertir los separadores de números:</b> «3,5 %» en un informe en inglés debe escribirse «3.5 %».",
    "<b>Falsos amigos:</b> <i>actually</i> = en realidad (no «actualmente», que es <i>currently</i>); <i>eventually</i> = finalmente; <i>assist</i> = ayudar (asistir a una reunión es <i>attend</i>); <i>library</i> = biblioteca.",
    "<b>Omitir el sujeto:</b> «Is important to check…» debe ser «It is important to check…».",
    "<b>Olvidar la «s» de tercera persona:</b> «The machine stops», no «The machine stop».",
    "<b>Traducir palabra por palabra</b> frases hechas del español; usa estructuras propias del inglés técnico.",
    "<b>Usar un tono demasiado directo en correos</b> («Send me the report»); prefiere «Could you please send me the report?»."])
};

T2["ramo-integrador-1"] = {
  fxT:"Estructuras clave del seminario (este ramo no se apoya en fórmulas)",
  fxH:"<p>Plantillas para redactar las partes centrales de un proyecto de ingeniería:</p>" + table(["Parte", "Estructura", "Ejemplo"], [
    ["Problema", "En [lugar], [qué ocurre], lo que provoca [efecto medible].", "En la bodega de despacho, el 8 % de los pedidos sale incompleto, lo que genera reclamos y reenvíos."],
    ["Objetivo general", "Verbo en infinitivo + qué + dónde + para qué.", "Reducir los pedidos incompletos en la bodega de despacho para disminuir los reclamos."],
    ["Objetivo específico", "Un verbo medible por objetivo (diagnosticar, proponer, evaluar).", "Diagnosticar las causas de los pedidos incompletos mediante datos de tres meses."],
    ["Alcance", "Qué incluye, qué no incluye y en qué período.", "Incluye la bodega central; no incluye transporte; datos de enero a marzo."],
    ["Indicador", "Nombre = fórmula, línea base y meta.", "% pedidos incompletos = incompletos ÷ despachados; base 8 %; meta 3 %."]]),
  err:q9ul([
    "<b>Plantear una solución como si fuera el problema</b> («falta un sistema WMS»). El problema es el efecto observable; la solución viene después del diagnóstico.",
    "<b>Escribir objetivos que no se pueden verificar</b> («mejorar la gestión»). Cada objetivo debe tener un resultado comprobable.",
    "<b>Definir un alcance demasiado amplio</b> para el tiempo del ramo.",
    "<b>Armar un marco teórico de definiciones copiadas</b> que no se usan después en la metodología.",
    "<b>Citar sin formato o sin fuente</b> (usa APA 7 y fuentes verificables).",
    "<b>Dejar la metodología en términos generales</b> en vez de decir qué datos, de dónde, con qué herramienta y en qué semana."])
};

T2["ramo-integrador-2"] = {
  fxT:"Estructuras clave del proyecto de título (este ramo no se apoya en fórmulas nuevas)",
  fxH:"<p>El proyecto de título reutiliza las fórmulas de otros ramos (VAN, TIR, capacidad, indicadores). Lo propio de este ramo es la estructura del informe y de la defensa:</p>" + q9ol([
    "<b>Resumen ejecutivo</b> (una página): problema, propuesta, resultados en cifras y recomendación.",
    "<b>Diagnóstico:</b> situación actual con datos, indicadores de la línea base y causas principales.",
    "<b>Propuesta:</b> alternativas evaluadas, criterio de elección y diseño de la solución elegida.",
    "<b>Validación:</b> prueba piloto, simulación o cálculo que muestre que la propuesta funciona.",
    "<b>Evaluación económica:</b> inversión, ahorros o ingresos, VAN, TIR y sensibilidad.",
    "<b>Plan de implementación:</b> carta Gantt, responsables, riesgos y costos.",
    "<b>Conclusiones:</b> una por cada objetivo específico."]) +
    "<p>Para la defensa: una idea por diapositiva, cifras clave grandes y legibles, y un cierre con la recomendación y lo que se necesita para implementarla.</p>",
  err:q9ul([
    "<b>Elegir un proyecto sin acceso a datos</b> de la empresa: sin datos no hay diagnóstico ni validación.",
    "<b>Saltar del diagnóstico a la solución</b> sin demostrar la causa con datos.",
    "<b>Presentar una evaluación económica sin supuestos explícitos</b> ni análisis de sensibilidad.",
    "<b>Escribir conclusiones que no responden a los objetivos</b> o que introducen resultados nuevos.",
    "<b>Llenar las diapositivas de texto</b> y leerlas durante la defensa.",
    "<b>No ensayar con tiempo:</b> la defensa suele tener un límite estricto y preguntas de la comisión."])
};

T2["ramo-intro-optimizacion"] = {
  ejer:["<p>Una mueblería fabrica estantes (x₁) y mesas (x₂) por semana. Cada estante deja una utilidad de $ 40.000 y cada mesa $ 30.000. Un estante usa 2 h de corte y 1 h de armado; una mesa usa 1 h de corte y 1 h de armado. Hay 40 h de corte y 30 h de armado por semana. ¿Cuántos de cada uno conviene fabricar?</p>",
    "Escribe el modelo: máx Z = 40.000x₁ + 30.000x₂, sujeto a 2x₁ + x₂ ≤ 40 (corte), x₁ + x₂ ≤ 30 (armado), x₁, x₂ ≥ 0.",
    "Encuentra los vértices de la región factible: (0, 0), (20, 0), (0, 30) y la intersección de las dos restricciones. Evalúa Z en cada uno.",
    "<p>La intersección de 2x₁ + x₂ = 40 y x₁ + x₂ = 30 es x₁ = 10, x₂ = 20.</p>" + table(["Vértice", "Z ($)"], [["(0, 0)", "0"], ["(20, 0)", "800.000"], ["(0, 30)", "900.000"], ["(10, 20)", "<b>1.000.000</b>"]]) + "<p>Óptimo: <b>10 estantes y 20 mesas</b>, con utilidad de <b>$ 1.000.000</b> por semana. Se usan todas las horas de corte (2·10 + 20 = 40) y de armado (10 + 20 = 30). Puedes comprobarlo en la calculadora de programación lineal.</p>"]
};

T2["ramo-investigacion-operativa"] = {
  err:q9ul([
    "<b>Leer mal la tabla final del Simplex:</b> en maximización el óptimo se alcanza cuando ningún coeficiente de la fila Z indica mejora; revisa la convención de signos que usa tu texto.",
    "<b>Interpretar un precio sombra como precio de mercado:</b> es lo que aumenta Z por una unidad más del recurso, y solo dentro de su rango de factibilidad.",
    "<b>Redondear la solución de un modelo continuo</b> cuando las variables son enteras: usa programación entera (ramificación y acotamiento).",
    "<b>Olvidar que el problema de transporte debe estar balanceado:</b> agrega un origen o destino ficticio con costo 0 si oferta ≠ demanda.",
    "<b>Usar Dijkstra con costos negativos:</b> el algoritmo no funciona en ese caso.",
    "<b>Aplicar fórmulas de colas M/M/s</b> sin comprobar que ρ &lt; 1 y que las llegadas y servicios se ajustan razonablemente a esos supuestos."])
};

T2["ramo-modelamiento-procesos"] = {
  err:q9ul([
    "<b>Modelar el proceso ideal en vez del real</b> («cómo debería ser»): el diagnóstico se hace sobre lo que ocurre hoy.",
    "<b>Mezclar niveles de detalle</b> en el mismo diagrama (tareas de 2 minutos junto a subprocesos de una semana).",
    "<b>Usar mal los elementos BPMN:</b> cada compuerta que divide el flujo debe tener su compuerta de unión, y los mensajes entre participantes van con flujo de mensaje, no de secuencia.",
    "<b>Simular con promedios en vez de distribuciones:</b> se pierde la variabilidad, que es la causa de las colas.",
    "<b>Sacar conclusiones de una sola corrida</b> o sin período de calentamiento en la simulación.",
    "<b>Automatizar un proceso sin rediseñarlo:</b> se automatizan también los pasos que no agregan valor."])
};

T2["ramo-portafolio-proyectos"] = {
  err:q9ul([
    "<b>Priorizar por quién pide el proyecto</b> en vez de usar criterios explícitos (alineación estratégica, VAN, riesgo, recursos).",
    "<b>Aprobar más proyectos de los que la organización puede ejecutar:</b> los recursos compartidos se saturan y todos se atrasan.",
    "<b>Confundir programa con portafolio:</b> el programa agrupa proyectos relacionados con un beneficio común; el portafolio agrupa todo lo que compite por recursos.",
    "<b>Usar ágil como excusa para no planificar:</b> Scrum tiene objetivos de sprint, backlog priorizado y revisiones.",
    "<b>Medir avance por tiempo o gasto</b> en vez de valor ganado (EV).",
    "<b>No revisar el portafolio periódicamente</b> ni cancelar proyectos que perdieron sentido."])
};

T2["ramo-procesos-industriales"] = {
  err:q9ul([
    "<b>Plantear un balance de masa sin definir el límite del sistema</b> ni la base de cálculo (por hora, por tonelada).",
    "<b>Mezclar base seca y base húmeda</b> en un mismo balance (frecuente en minería y alimentos).",
    "<b>Olvidar las corrientes de recirculación o mermas</b>: entrada = salida + acumulación + pérdidas.",
    "<b>Clasificar mal el tipo de proceso:</b> el volumen y la variedad determinan si conviene un proceso por proyecto, por lotes, en línea o continuo.",
    "<b>Usar la ley de mineral sin la recuperación metalúrgica</b> al calcular el metal producido.",
    "<b>Mezclar unidades</b> (toneladas cortas y métricas, % en peso y ppm) dentro del mismo cálculo."])
};

T2["ramo-quimica-ambiente"] = {
  err:q9ul([
    "<b>Usar una ecuación química sin balancear:</b> las proporciones en moles salen mal y todo el cálculo posterior también.",
    "<b>Confundir masa con moles:</b> la ecuación relaciona moles. Por ejemplo, 12 g de carbono producen 44 g de CO₂, así que 1 kg de carbono genera unos 3,67 kg de CO₂.",
    "<b>Mezclar unidades de concentración</b> (mg/L, ppm, %) sin convertirlas.",
    "<b>Olvidar el reactivo limitante:</b> la cantidad de producto la fija el reactivo que se agota primero.",
    "<b>Tratar «residuo» y «emisión» como lo mismo:</b> se miden, regulan y gestionan de forma distinta.",
    "<b>Citar límites legales de memoria:</b> los valores de normas de emisión y calidad cambian; se deben verificar en la normativa vigente."])
};

T2["ramo-topicos-especialidad"] = {
  fx:[["Matriz de decisión ponderada", "S_j=\\sum_{i=1}^{n} w_i\\,s_{ij},\\qquad \\sum w_i=1", "S = Σ wᵢ·sᵢ ;  Σ wᵢ = 1",
    [["S_j", "puntaje total de la opción j"], ["w_i", "peso del criterio i (los pesos suman 1)"], ["s_ij", "nota de la opción j en el criterio i (por ejemplo, de 1 a 5)"]],
    "Convierte una elección con varios criterios en un número comparable. Como los pesos suman 1, el puntaje queda en la misma escala que las notas."]],
  ejB:["elegir la línea de especialización", "<p>Criterios y pesos: interés personal 0,4; demanda laboral 0,35; ramos ya aprobados que sirven de base 0,25. Notas de 1 a 5.</p>" + table(["Línea", "Interés", "Demanda", "Base", "Puntaje"], [["Logística", "4", "5", "3", "4 × 0,4 + 5 × 0,35 + 3 × 0,25 = <b>4,10</b>"], ["Calidad", "5", "3", "4", "5 × 0,4 + 3 × 0,35 + 4 × 0,25 = <b>4,05</b>"], ["Datos", "3", "4", "2", "3 × 0,4 + 4 × 0,35 + 2 × 0,25 = <b>3,10</b>"]]) + "<p>Logística y Calidad quedan casi empatadas: conviene revisar si los pesos reflejan lo que realmente importa antes de decidir.</p>"],
  err:q9ul([
    "<b>Elegir solo por lo que eligen los compañeros</b> o por el ramo que parece más fácil.",
    "<b>Usar pesos que no suman 1</b> en la matriz de decisión: los puntajes dejan de ser comparables.",
    "<b>Suponer que una diferencia pequeña de puntaje es decisiva:</b> prueba qué pasa si cambias un peso.",
    "<b>No conversar con profesionales del área</b> antes de elegir.",
    "<b>Ignorar los ramos que ya aprobaste</b> y que dan base para la especialidad."])
};

T2["ramo-topicos-ingenieria"] = {
  err:q9ul([
    "<b>Saltar a la solución</b> sin definir bien el problema, los requisitos y las restricciones.",
    "<b>Evaluar una sola alternativa:</b> el método de ingeniería compara opciones con criterios explícitos.",
    "<b>Tratar la ética como un tema aparte:</b> aparece en decisiones diarias (reportar datos verdaderos, no ocultar riesgos, respetar la confidencialidad).",
    "<b>Confundir sostenibilidad con solo medio ambiente:</b> incluye las dimensiones social y económica.",
    "<b>Presentar conclusiones sin datos</b> o con fuentes no verificables."])
};

T2["ramo-transformacion-digital"] = {
  err:q9ul([
    "<b>Comprar tecnología antes de definir el problema</b> y el indicador que se quiere mejorar.",
    "<b>Digitalizar un proceso malo:</b> primero se rediseña y estandariza; después se automatiza.",
    "<b>Ignorar la calidad de los datos:</b> sensores sin calibrar o registros incompletos llevan a malas decisiones.",
    "<b>Olvidar a las personas:</b> sin capacitación ni gestión del cambio, el sistema nuevo se usa a medias.",
    "<b>Hacer pilotos que nunca escalan</b> por no definir desde el inicio cómo se medirá el éxito.",
    "<b>Descuidar la ciberseguridad</b> al conectar equipos de planta a la red."])
};
