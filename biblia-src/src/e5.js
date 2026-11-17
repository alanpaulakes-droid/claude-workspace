/* ============ AMPLIACIÓN DE GUÍAS: GESTIÓN, INFORMES Y UTILIDADES ============ */
GX["foda"] = {
fig:[() => D.matrix(["Fortalezas", "Debilidades"], ["Oportunidades", "Amenazas"], [[["FO · usar fortalezas para aprovechar oportunidades", 1], ["FA · usar fortalezas para defenderse", 4]], [["DO · corregir debilidades con oportunidades", 2], ["DA · reducir debilidades y evitar amenazas", 3]]], "Matriz TOWS: el valor del FODA está en cruzar los cuadrantes.")],
ej:"<p><b>Caso.</b> Una pyme de mantenimiento industrial en Antofagasta.</p><ul><li><b>F:</b> técnicos certificados en hidráulica; respuesta en menos de 4 horas.</li><li><b>D:</b> sin sistema de gestión de mantenimiento; dependencia de dos clientes.</li><li><b>O:</b> faenas mineras que externalizan mantención; fondos CORFO para digitalización.</li><li><b>A:</b> grandes contratistas nacionales; rotación de técnicos hacia la minería.</li></ul><p><b>FO:</b> ofrecer contratos de respuesta garantizada a nuevas faenas. <b>DO:</b> postular a CORFO para implementar un CMMS y reportar indicadores a los clientes. <b>FA:</b> fidelizar técnicos con plan de carrera y certificación. <b>DA:</b> diversificar clientes hacia industria no minera (sanitarias, puertos).</p>",
cmp:[["Herramienta", "Analiza"], [["PESTEL", "Entorno macro: político, económico, social, tecnológico, ecológico y legal"], ["5 fuerzas de Porter", "Atractivo de la industria"], ["Cadena de valor", "Actividades internas que crean ventaja"], ["FODA", "Síntesis interna y externa para definir estrategias"], ["Canvas", "Modelo de negocio"]]],
tips:["Prioriza máximo 5 ítems por cuadrante; un FODA de 40 puntos no orienta nada.", "Escribe oportunidades y amenazas como hechos del entorno, no como acciones de la empresa.", "Cada estrategia cruzada debe terminar con responsable, plazo e indicador."],
cita:["La estrategia consiste en elegir qué no hacer.", "Michael Porter, What Is Strategy? (1996)"]
};
GX["ishikawa"] = {
fig:[() => D.tree("Problema: rebaba en piezas", [["Máquina", ["Molde desgastado", "Presión inestable"]], ["Método", ["Parámetros sin estándar"]], ["Material", ["Resina húmeda"]], ["Mano de obra", ["Operador nuevo"]], ["Medición", ["Calibrador sin certificar"]], ["Medio ambiente", ["Temperatura variable"]]], "Las 6M organizan las causas posibles; luego se verifican con datos.")],
ej:"<p><b>Caso.</b> Un hospital tiene demoras en la entrega de exámenes de laboratorio. Categorías adaptadas a servicios: <b>personas</b> (turnos incompletos), <b>procesos</b> (muestras rotuladas a mano), <b>tecnología</b> (equipo sin interfaz con el sistema), <b>materiales</b> (quiebre de reactivos), <b>entorno</b> (traslado desde pabellones distantes), <b>medición</b> (no se registra la hora de toma). La verificación con datos mostró que el rotulado manual y la falta de interfaz explicaban la mayor parte de la demora.</p>",
cmp:[["Herramienta", "Aporta"], [["Lluvia de ideas", "Cantidad de causas"], ["Ishikawa", "Orden por categoría"], ["5 porqués", "Profundidad en una causa"], ["Pareto", "Prioridad con datos"], ["Diagrama de dispersión", "Comprobación de una relación"]]],
tips:["Formula el efecto con un número: «35 % de piezas con rebaba en la inyectora 4».", "Las causas deben ser hechos verificables, no culpas («operador descuidado» no sirve).", "Termina siempre con un plan de verificación de las 3 causas más votadas."],
cita:["El control de calidad empieza con educación y termina con educación.", "Kaoru Ishikawa"]
};
GX["porques"] = {
fig:[() => D.chain(["Problema", "¿Por qué? 1", "¿Por qué? 2", "¿Por qué? 3", "¿Por qué? 4", "Causa raíz de sistema"], "Cada respuesta se convierte en la siguiente pregunta hasta llegar a una causa que se pueda cambiar en el sistema.", { hi:[5] })],
ej:"<p><b>Caso clásico (atribuido al Monumento a Jefferson, Washington).</b> La piedra del monumento se deterioraba. ¿Por qué? Se lavaba con detergentes fuertes. ¿Por qué? Había muchos excrementos de palomas. ¿Por qué? Las palomas venían a comer arañas. ¿Por qué? Las arañas comían insectos atraídos por las luces que se encendían al atardecer. <b>Acción:</b> encender las luces más tarde. Una solución barata que nadie habría encontrado atacando el síntoma (comprar otro detergente).</p>",
cmp:[["Corrección", "Acción correctiva", "Acción preventiva"], [["Arregla el efecto ahora", "Elimina la causa de un problema ocurrido", "Elimina la causa de un problema potencial"], ["Lubricar el rodamiento", "Crear el plan de lubricación", "Revisar planes de equipos similares"]]],
tips:["Hazlo en el lugar del problema y con quienes lo vivieron.", "Si llegas a «error humano», pregunta un porqué más: ¿por qué el sistema permitió el error?", "Comprueba la cadena al revés con «por lo tanto»."],
cita:["Pregunta por qué cinco veces sobre cada problema.", "Taiichi Ohno"]
};
GX["sipoc"] = {
fig:[() => D.chain([["Proveedores", "quién entrega"], ["Entradas", "qué entrega"], ["Proceso", "4 a 7 pasos"], ["Salidas", "qué se produce"], ["Clientes", "quién lo recibe"]], "SIPOC: la vista de 30 segundos de un proceso.", { color:true })],
ej:"<p><b>Caso: proceso de compra de repuestos.</b> Proveedores: mantención (solicitud), proveedores externos (cotizaciones). Entradas: solicitud de pedido, presupuesto. Proceso: recibir solicitud → cotizar → aprobar → emitir orden → recibir y almacenar. Salidas: repuesto en bodega, factura registrada. Clientes: mantención, contabilidad. CTQ del cliente principal: plazo menor a 5 días para repuestos críticos.</p>",
cmp:[["Herramienta", "Detalle"], [["SIPOC", "Muy alto: límites y actores"], ["Diagrama de flujo", "Medio: actividades y decisiones"], ["VSM", "Flujo de valor con tiempos e inventarios"], ["BPMN", "Detalle para automatizar"]]],
tips:["Empieza por el centro (los pasos) y luego completa los extremos.", "Si un paso no tiene cliente, probablemente sobra."],
cita:["Si no puedes describir lo que haces como un proceso, no sabes lo que estás haciendo.", "Atribuida a W. Edwards Deming"]
};
GX["canvas"] = {
fig:[() => D.matrix(["Oferta", "Operación"], ["Clientes", "Valor", "Dinero"], [[["Segmentos · relación · canales", 4], ["Propuesta de valor", 2], ["Fuentes de ingresos", 1]], [["Socios clave", 4], ["Actividades y recursos clave", 4], ["Estructura de costos", 3]]], "Lectura simplificada del Canvas: el lado del cliente genera ingresos; el lado operativo genera costos.")],
ej:"<p><b>Caso: arriendo de herramientas por suscripción para maestros.</b> Segmento: maestros independientes de construcción. Propuesta: herramientas profesionales sin comprarlas, con reposición en 24 horas. Canales: app y punto de retiro en ferreterías aliadas. Ingresos: suscripción mensual. Recursos: inventario de herramientas, logística. Socios: ferreterías. Costos: compra y mantención de herramientas, logística. <b>Hipótesis más riesgosa:</b> que los maestros paguen mensualmente; se valida con una preventa a 30 maestros antes de comprar inventario.</p>",
cmp:[["Herramienta", "Foco"], [["Business Model Canvas", "Negocio completo"], ["Lean Canvas", "Startups: problema, solución, métricas clave"], ["Value Proposition Canvas", "Encaje entre cliente y producto"]]],
tips:["Cada post-it es una hipótesis; escribe cómo la vas a validar.", "Si no puedes calcular los ingresos y costos con los bloques del canvas, el modelo no está claro."],
cita:["Ningún plan de negocios sobrevive al primer contacto con los clientes.", "Steve Blank"]
};
GX["raci"] = {
fig:[() => D.matrix(["Definir alcance", "Diseñar mejora", "Aprobar inversión"], ["Gerente", "Jefe de proyecto", "Ingeniero"], [[["A", 3], ["R", 2], ["C", 4]], [["I", 1], ["A", 3], ["R", 2]], [["A", 3], ["R", 2], ["C", 4]]], "Matriz RACI: una sola A (aprueba) por actividad y al menos una R (realiza).")],
ej:"<p><b>Caso.</b> En una implementación de ERP nadie aprobaba formalmente los datos maestros de materiales y cada área los cargaba a su manera. La matriz RACI asignó la A al jefe de abastecimiento, la R a un analista y la C a mantención y finanzas. Los errores de códigos duplicados bajaron porque había un dueño claro.</p>",
cmp:[["Variante", "Letras"], [["RACI", "Responsable, Aprueba, Consultado, Informado"], ["RASCI", "Agrega Soporte"], ["DACI", "Driver, Aprobador, Contribuyente, Informado (decisiones)"]]],
tips:["Usa roles, no nombres: las personas cambian.", "Si una persona tiene R en todo, es un cuello de botella."],
cita:["Lo que es de todos no es de nadie.", "Refrán popular"]
};
GX["generador-informe"] = {
fig:[() => D.chain(["Resumen ejecutivo", "Introducción", "Objetivos", "Metodología", "Resultados", "Análisis", "Conclusiones", "Recomendaciones", "Referencias y anexos"], "Estructura estándar de un informe técnico.", { per:5 })],
ej:"<p><b>Párrafo de resumen mal escrito:</b> «En el presente informe se analizará la situación de la línea 3 y se verá qué se puede hacer para mejorar».</p><p><b>Bien escrito:</b> «La línea 3 pierde 6,5 horas semanales en cambios de formato. Aplicando SMED, el tiempo de cambio bajó de 78 a 31 minutos, lo que libera 188 horas productivas al año, valorizadas en $ 41 millones. Se recomienda replicarlo en las líneas 1 y 2».</p><p>El segundo dice el problema, lo que se hizo, el resultado con cifras y la recomendación en 4 oraciones.</p>",
cmp:[["Documento", "Extensión", "Lector"], [["Informe técnico", "10 a 40 páginas", "Jefaturas y técnicos"], ["Informe ejecutivo", "2 a 5 páginas", "Gerencia"], ["Minuta", "1 página", "Quien decide"], ["Memoria de cálculo", "Variable", "Revisor técnico"]]],
tips:["Escribe el resumen al final y léelo como si fueras el gerente con 2 minutos: ¿sabes qué decidir?", "Una idea por párrafo y empieza el párrafo con esa idea.", "Cada tabla y figura se menciona en el texto antes de aparecer.", "Lee el informe en voz alta: lo que suena mal está mal escrito."],
cita:["Si no puedes explicarlo de forma sencilla, no lo entiendes lo suficientemente bien.", "Atribuida a Albert Einstein"]
};
GX["citas-apa"] = {
ej:"<p><b>Libro:</b> Sapag Chain, N., Sapag Chain, R., y Sapag Puelma, J. M. (2014). <i>Preparación y evaluación de proyectos</i> (6.ª ed.). McGraw-Hill.</p><p><b>Artículo:</b> Little, J. D. C. (1961). A proof for the queuing formula L = λW. <i>Operations Research, 9</i>(3), 383–387. https://doi.org/10.1287/opre.9.3.383</p><p><b>Ley chilena:</b> Ley 16.744. (1968). <i>Establece normas sobre accidentes del trabajo y enfermedades profesionales</i>. Ministerio del Trabajo y Previsión Social. https://bcn.cl/</p><p><b>En el texto:</b> «La TIR puede inducir a error con proyectos excluyentes (Sapag Chain et al., 2014)».</p>",
tips:["Usa Zotero (gratuito) desde el primer día de la memoria: ahorrarás días al final.", "Cita la fuente original, no la página web que la resume.", "Parafrasear también requiere cita."],
cita:["Si he visto más lejos es porque estoy sentado sobre los hombros de gigantes.", "Isaac Newton, carta a Robert Hooke (1675)"]
};
GX["conversor"] = {
fig:[() => D.chain(["Valor en unidad de origen", "× factor a unidad base SI", "÷ factor de unidad destino", "Valor convertido"], "Toda conversión pasa por la unidad base del Sistema Internacional.", { color:true })],
ej:"<p><b>Caso.</b> Un catálogo indica una bomba de 15 HP y caudal de 200 gpm. En SI: 15 × 0,7457 = 11,2 kW; 200 gpm × 0,0000631 = 0,0126 m³/s = 45,4 m³/h. Con 4.000 horas al año y $ 120 por kWh, su consumo cuesta cerca de 11,2 × 4.000 × 120 = $ 5,4 millones al año (si opera a plena carga).</p>",
tips:["Escribe siempre la unidad junto al número y verifica que las unidades se cancelen en la fórmula (análisis dimensional).", "1 bar ≈ 14,5 psi ≈ 10 m de columna de agua: tres equivalencias que se usan a diario en planta."],
cita:["Cuando puedes medir aquello de lo que hablas y expresarlo en números, sabes algo sobre ello.", "Lord Kelvin, conferencia de 1883"]
};
