/* ============ COMPLETAR TEMAS · LOTE 4: DESARROLLO PERSONAL, GESTIÓN, INFORMES Y OFIMÁTICA ============ */
const fxNo = "Modelos y estructuras clave (este tema no se apoya en fórmulas)";

/* ---------- Desarrollo personal ---------- */
T2["aprender-a-aprender"] = {
  def:"<p><b>Aprender a aprender</b> es usar las técnicas de estudio que la investigación en psicología cognitiva muestra como más eficaces (recuperación activa, repaso espaciado, intercalado y elaboración) y organizar el tiempo para aplicarlas. El objetivo es recordar más tiempo y poder usar lo aprendido en problemas nuevos, no solo reconocerlo al releer.</p>",
  fxT:fxNo,
  fxH:"<p><b>Pauta orientativa de repaso espaciado</b> (ajústala según lo que te cueste cada tema):</p>" + table(["Repaso", "Cuándo", "Qué hacer"], [["1", "Al día siguiente", "Escribir de memoria lo esencial y comparar con los apuntes."], ["2", "A los 3 días", "Resolver 2 o 3 ejercicios sin mirar la solución."], ["3", "A la semana", "Explicar el tema en voz alta (técnica de Feynman)."], ["4", "A las 2 semanas", "Mezclar ejercicios de este tema con otros (intercalado)."], ["5", "Al mes y antes de la prueba", "Simular la evaluación con tiempo."]]) + "<p>Regla clave: si recuerdas sin esfuerzo, alarga el intervalo; si fallas, acórtalo.</p>"
};

T2["bienestar"] = {
  fx:[["Deuda de sueño semanal", "D=\\sum_{d=1}^{7}\\left(h_{n}-h_{d}\\right)", "D = Σ (horas necesarias − horas dormidas)", [["D", "deuda de sueño de la semana (horas)"], ["h_n", "horas que necesitas por noche"], ["h_d", "horas que dormiste la noche d"]], "Suma lo que faltó cada noche. Un valor alto y repetido semana tras semana indica que el horario no es sostenible."]],
  met:"<p><b>Cómo armar una rutina de bienestar sostenible.</b></p>" + q9ol([
    "Registra una semana normal: horas de sueño, actividad física, comidas y momentos de estrés.",
    "Elige un solo cambio pequeño para empezar (por ejemplo, acostarte 30 minutos antes).",
    "Asócialo a algo que ya haces todos los días (después de cenar, al llegar a casa).",
    "Mantenlo dos o tres semanas antes de agregar otro cambio.",
    "Revisa el registro cada semana y ajusta.",
    "Si el ánimo bajo, la ansiedad o el agotamiento duran semanas o afectan tu vida diaria, pide ayuda profesional."]),
  err:q9ul([
    "<b>Querer cambiar todo a la vez</b> (dieta, ejercicio y sueño desde el lunes): se abandona rápido.",
    "<b>Recortar sueño para estudiar más:</b> baja la memoria y la concentración.",
    "<b>Compensar la semana durmiendo mucho el fin de semana:</b> desordena el horario.",
    "<b>Ignorar señales de agotamiento</b> o creer que pedir ayuda es debilidad.",
    "<b>Usar alcohol u otras sustancias para manejar el estrés.</b>"])
};

T2["habilidades-blandas"] = {
  fxT:fxNo,
  fxH:table(["Modelo", "Para qué sirve", "Estructura"], [["SBI (situación, comportamiento, impacto)", "Dar retroalimentación concreta", "«En la reunión de ayer (situación), interrumpiste dos veces al cliente (comportamiento) y no alcanzó a explicar el problema (impacto).»"], ["Matriz urgente / importante", "Priorizar el tiempo", "Importante y urgente: hacer; importante no urgente: planificar; urgente no importante: delegar; ninguno: eliminar."], ["Escucha activa", "Entender antes de responder", "Escuchar sin interrumpir, parafrasear y preguntar."]]),
  met:"<p><b>Cómo desarrollar una habilidad blanda en un mes.</b></p>" + q9ol(["Elige una sola habilidad y una situación concreta donde usarla (reuniones, correos, turnos).", "Define una conducta observable («resumir los acuerdos al final de cada reunión»).", "Practícala cada vez que se presente la situación.", "Pide retroalimentación a una persona de confianza cada semana.", "Anota qué funcionó y qué no, y ajusta."]),
  err:q9ul(["<b>Dar retroalimentación sobre la persona</b> («eres desordenado») en vez de sobre la conducta.", "<b>Responder correos importantes en caliente.</b>", "<b>Decir que sí a todo</b> y no cumplir los plazos.", "<b>Evitar el conflicto</b> hasta que el problema crece.", "<b>Creer que las habilidades blandas son innatas</b> y no practicarlas."]),
  ejer:["<p>Reescribe esta retroalimentación con el modelo SBI: «Siempre llegas tarde, eres muy irresponsable».</p>", "Describe una situación concreta (cuándo y dónde), no «siempre».", "Describe la conducta observable y su efecto, sin calificar a la persona.", "<p>Respuesta modelo: «El lunes y el miércoles llegaste 20 minutos después del inicio del turno (situación y conducta), y la línea partió con una persona menos (impacto). ¿Qué está pasando y cómo lo podemos resolver?»</p>"]
};

T2["influencia"] = {
  def:"<p>La <b>influencia</b> es la capacidad de lograr que otras personas acepten una idea o actúen, sin depender solo de la autoridad formal. En el trabajo de un ingeniero es clave para que se apruebe un proyecto, se adopte un cambio o se consiga apoyo de otras áreas.</p><p>La influencia ética se basa en argumentos verdaderos, beneficios reales para la otra parte y confianza; la manipulación oculta información o explota debilidades, y destruye la confianza.</p>",
  fxT:fxNo,
  fxH:table(["Modelo", "Idea central"], [["Ethos, pathos y logos (Aristóteles)", "Credibilidad de quien habla, emoción del público y lógica del argumento."], ["Principios de Cialdini", "Reciprocidad, compromiso y coherencia, prueba social, autoridad, simpatía, escasez y unidad."], ["Moneda de cambio", "Ofrecer algo que la otra parte valora a cambio de su apoyo."], ["Mapa de interesados", "Ubicar a cada persona según su poder y su interés para decidir cómo involucrarla."]]),
  met:"<p><b>Cómo conseguir apoyo para una propuesta.</b></p>" + q9ol(["Define qué necesitas exactamente y de quién.", "Haz el mapa de interesados: poder e interés de cada uno.", "Averigua qué le importa a cada persona clave (costo, seguridad, plazos, reconocimiento).", "Prepara el argumento con datos (logos), credibilidad (ethos) y un beneficio que le importe (pathos).", "Conversa antes de la reunión formal con las personas clave.", "Presenta, escucha objeciones y ajusta la propuesta."]),
  err:q9ul(["<b>Presentar solo datos técnicos</b> sin conectar con lo que le importa a quien decide.", "<b>Llegar a la reunión formal sin conversaciones previas.</b>", "<b>Exagerar beneficios u ocultar riesgos:</b> se pierde la credibilidad.", "<b>Ignorar a quienes tienen poder para bloquear</b> aunque no decidan.", "<b>Confundir insistencia con influencia.</b>"]),
  ejer:["<p>Quieres que la gerencia apruebe cambiar las luminarias de bodega por LED. El gerente de finanzas se preocupa por la caja y el jefe de bodega por las detenciones. ¿Qué argumento usarías con cada uno?</p>", "Piensa qué le importa a cada uno: dinero y plazo de recuperación, o continuidad de la operación.", "Usa datos para cada preocupación y ofrece algo que reduzca su riesgo.", "<p>Respuesta modelo: a finanzas, el ahorro anual en energía, el período de recuperación y el VAN; al jefe de bodega, un plan de instalación por sectores fuera de horario punta, sin detener la operación, y la mejor iluminación para leer etiquetas.</p>"]
};

T2["marca-personal"] = {
  fxT:fxNo,
  fxH:"<p><b>Presentación breve (pitch) en 3 partes:</b></p>" + q9ol(["<b>Quién eres:</b> «Soy estudiante de Ingeniería Industrial y trabajo en bodega».", "<b>Qué sabes hacer, con una prueba:</b> «Reduje en 30 % el tiempo de armado de pedidos rediseñando el recorrido».", "<b>Qué buscas:</b> «Me interesa la logística y busco una práctica en planificación»."]) + "<p><b>Perfil de LinkedIn:</b> foto profesional, titular con lo que haces y lo que buscas, extracto con logros medibles y experiencia con resultados, no solo funciones.</p>",
  met:"<p><b>Cómo construir tu marca personal en 90 días.</b></p>" + q9ol(["Define en una frase en qué quieres que te reconozcan.", "Actualiza tu perfil profesional con logros medibles.", "Contacta cada semana a una o dos personas del área que te interesa, con un mensaje personalizado.", "Comparte algo útil cada cierto tiempo (un aprendizaje, un caso, un resumen).", "Busca un mentor y pide conversaciones breves con objetivos claros.", "Revisa qué funcionó y ajusta."]),
  err:q9ul(["<b>Contactar solo cuando necesitas algo</b> (por ejemplo, cuando buscas trabajo).", "<b>Describir funciones en vez de logros</b> («encargado de bodega» en lugar de «reduje los quiebres de 8 % a 3 %»).", "<b>Publicar información confidencial</b> de tu empleador.", "<b>Enviar mensajes genéricos</b> a muchas personas.", "<b>Olvidar que lo que publicas en redes personales también forma parte de tu reputación.</b>"]),
  ejer:["<p>Mejora este titular de LinkedIn: «Estudiante».</p>", "Incluye tu carrera y una especialidad o interés.", "Agrega una fortaleza o un logro breve.", "<p>Respuesta modelo: «Estudiante de Ingeniería Industrial · Logística y mejora de procesos · Excel y análisis de datos».</p>"]
};

T2["oratoria"] = {
  fxT:fxNo,
  fxH:table(["Estructura", "Cuándo usarla", "Partes"], [["PREP", "Responder una pregunta o dar una opinión breve", "Punto, Razón, Ejemplo, Punto (repetido)."], ["Problema – solución – beneficio", "Proponer un proyecto", "Qué pasa hoy, qué propones, qué se gana (con cifras)."], ["Pasado – presente – futuro", "Contar un avance", "De dónde partimos, dónde estamos, qué sigue."]]) + "<p>Regla práctica: una idea por diapositiva y un mensaje central que la audiencia pueda repetir.</p>",
  met:"<p><b>Cómo preparar una presentación.</b></p>" + q9ol(["Escribe el mensaje central en una frase.", "Elige la estructura y ordena 3 ideas de apoyo.", "Prepara las diapositivas: poco texto, cifras grandes, gráficos con conclusión.", "Ensaya en voz alta al menos tres veces con cronómetro.", "Prepara respuestas para las tres preguntas más probables.", "Llega antes y prueba los equipos."]),
  err:q9ul(["<b>Leer las diapositivas</b> de espaldas al público.", "<b>Poner demasiado texto</b> o tablas ilegibles.", "<b>Pasarse del tiempo</b> asignado.", "<b>Empezar con disculpas</b> («no soy bueno hablando…»).", "<b>No ensayar en voz alta:</b> pensar la presentación no es lo mismo que decirla."]),
  ejer:["<p>Tienes 1 minuto para responder: «¿Por qué conviene comprar una grúa horquilla nueva?». Arma tu respuesta con PREP.</p>", "Empieza por la conclusión (punto) y da una razón con cifras.", "Agrega un ejemplo concreto y cierra repitiendo el punto.", "<p>Respuesta modelo: «Conviene comprarla (punto) porque la actual estuvo detenida 18 días este año y cada día parado cuesta unos $ 400.000 en horas extra (razón). En marzo se atrasaron 12 despachos por esa causa (ejemplo). Por eso recomiendo comprarla este trimestre (punto)». Las cifras son de ejemplo.</p>"]
};

T2["psicologia"] = {
  def:"<p>La <b>psicología</b> estudia cómo piensan, sienten, deciden y se comportan las personas. En el trabajo de un ingeniero sirve para entender por qué un cambio se rechaza, cómo motivar a un equipo, por qué las personas se equivocan aunque conozcan el procedimiento y cómo diseñar capacitaciones y sistemas que se usen de verdad.</p>",
  fxT:fxNo,
  fxH:table(["Modelo", "Idea central"], [["Motivación intrínseca (autonomía, competencia, relación)", "Las personas se comprometen más cuando deciden algo, sienten que progresan y se sienten parte de un grupo."], ["Sistema 1 y sistema 2 (Kahneman)", "Pensamos rápido e intuitivo la mayor parte del tiempo; el pensamiento lento y deliberado cuesta esfuerzo."], ["Seguridad psicológica", "Un equipo mejora cuando sus miembros pueden reportar errores sin miedo a represalias."], ["Error humano (distracciones, equivocaciones, violaciones)", "Cada tipo de error se previene de forma distinta."]]),
  met:"<p><b>Cómo implementar un cambio considerando a las personas.</b></p>" + q9ol(["Explica el porqué del cambio con datos y con lo que gana cada persona.", "Involucra a quienes harán el trabajo en el diseño.", "Capacita con práctica real, no solo con presentaciones.", "Facilita la conducta correcta (formularios simples, recordatorios visuales).", "Reconoce los avances y corrige sin castigar los errores reportados.", "Mide la adopción y ajusta."]),
  err:q9ul(["<b>Atribuir todo error a «falta de compromiso»</b> sin revisar el diseño del trabajo.", "<b>Castigar a quien reporta un error:</b> la próxima vez no se reportará.", "<b>Suponer que capacitar es suficiente</b> para cambiar una conducta.", "<b>Imponer un cambio sin explicar el porqué.</b>", "<b>Creer que las personas deciden siempre de forma racional.</b>"]),
  ejer:["<p>Los operadores no registran las detenciones en el nuevo sistema. ¿Qué preguntas harías antes de concluir que «no quieren usarlo»?</p>", "Revisa si el sistema es fácil de usar en el puesto (tiempo, acceso, guantes, conectividad).", "Revisa si entienden para qué sirve el registro y si reciben algo a cambio.", "<p>Respuesta modelo: ¿cuánto tiempo toma registrar una detención?; ¿hay un equipo disponible en el puesto?; ¿se capacitó con práctica?; ¿alguien usa esos datos y les devuelve resultados?; ¿se ha castigado a alguien por registrar detenciones largas?</p>"]
};

T2["relaciones"] = {
  def:"<p>Las <b>relaciones personales</b> son los vínculos con familia, pareja, amistades y compañeros de trabajo. Su calidad influye en el bienestar, la salud y el desempeño. Se construyen con habilidades que se pueden aprender: escuchar, expresar lo que molesta sin atacar, poner límites y resolver conflictos.</p>",
  fxT:fxNo,
  fxH:"<p><b>Comunicación no violenta en cuatro pasos:</b></p>" + q9ol(["<b>Observación</b> sin juicio: «Esta semana los platos quedaron en la cocina tres noches».", "<b>Sentimiento:</b> «Me siento cansado al llegar y encontrar la cocina así».", "<b>Necesidad:</b> «Necesito que compartamos el orden de la casa».", "<b>Petición concreta:</b> «¿Podemos turnarnos para lavar después de cenar?»."]),
  met:"<p><b>Cómo tener una conversación difícil.</b></p>" + q9ol(["Elige el momento: con calma y en privado.", "Parte por lo que quieres lograr, no por lo que te molesta.", "Usa los cuatro pasos de la comunicación no violenta.", "Escucha la respuesta y parafrasea lo que entendiste.", "Acuerden algo concreto y revísenlo después."]),
  err:q9ul(["<b>Generalizar</b> («nunca», «siempre»).", "<b>Criticar a la persona</b> en vez de la conducta.", "<b>Discutir en caliente</b> o frente a otros.", "<b>Callar hasta explotar</b> en vez de hablar a tiempo.", "<b>Pedir cambios vagos</b> («pon más de tu parte») en vez de peticiones concretas."])
};

T2["vida-cotidiana"] = {
  def:"<p>Este tema aplica herramientas de ingeniería a la vida diaria: ver tu rutina como un sistema, diseñar hábitos, organizar la semana, priorizar el tiempo, ordenar con 5S y tomar decisiones personales con método.</p>",
  fxT:fxNo,
  fxH:table(["Herramienta", "Cómo se usa en la vida diaria"], [["Las cuatro reglas del hábito", "Hazlo obvio, atractivo, fácil y satisfactorio; para romper un mal hábito, invierte las reglas."], ["Regla de los 2 minutos", "Empieza un hábito con una versión que tome menos de 2 minutos."], ["5S personal", "Clasificar, ordenar, limpiar, estandarizar y mantener (casa, escritorio, archivos)."], ["Matriz ponderada", "Comparar opciones personales con criterios y pesos explícitos."]]),
  err:q9ul(["<b>Depender de la fuerza de voluntad</b> en vez de diseñar el entorno.", "<b>Empezar un hábito demasiado grande.</b>", "<b>Planificar el día sin considerar la energía</b> (tareas difíciles en las horas de más cansancio).", "<b>Ordenar comprando cajas</b> antes de eliminar lo que no se usa.", "<b>Tomar decisiones importantes sin escribir los criterios.</b>"])
};

/* ---------- Gestión ---------- */
T2["kpis"] = {
  def:"<p>Un <b>KPI</b> (indicador clave de desempeño) es una medida que muestra si un proceso cumple su objetivo. Un buen KPI tiene una fórmula precisa, una fuente de datos confiable, una frecuencia de medición, una meta y un responsable.</p><p>Esta biblioteca reúne indicadores de producción, mantenimiento, logística, calidad, seguridad, finanzas y personas. No se trata de medir todo, sino de elegir pocos que guíen decisiones.</p>",
  fx:[["OEE (eficiencia global del equipo)", "OEE=D\\times R\\times C", "OEE = D × R × C", [["D", "disponibilidad"], ["R", "rendimiento"], ["C", "calidad"]], "Multiplica las tres pérdidas: tiempo detenido, velocidad reducida y unidades malas."],
    ["Rotación de inventario", "\\text{Rotación}=\\frac{\\text{Costo de ventas}}{\\text{Inventario promedio}},\\qquad \\text{Días}=\\frac{365}{\\text{Rotación}}", "Rotación = Costo de ventas ÷ Inventario promedio ;  Días = 365 ÷ Rotación", [], "Indica cuántas veces se renueva el inventario en el año y cuántos días de venta cubre."],
    ["Cumplimiento de entregas (OTIF)", "OTIF=\\frac{\\text{Pedidos a tiempo y completos}}{\\text{Pedidos totales}}\\times 100", "OTIF = Pedidos a tiempo y completos ÷ Pedidos totales × 100", [], "Solo cuenta como cumplido un pedido que llega en la fecha y con todo lo solicitado."]],
  met:"<p><b>Cómo definir un KPI.</b></p>" + q9ol(["Parte del objetivo del proceso (qué decisión debe guiar el indicador).", "Escribe la fórmula exacta, con numerador, denominador y unidad.", "Define la fuente de datos y quién la registra.", "Define la frecuencia de medición y el período de cálculo.", "Mide una línea base y fija una meta realista.", "Asigna un responsable y una reunión donde se revise.", "Revisa cada cierto tiempo si el KPI sigue siendo útil."]),
  ejB:["OEE de una envasadora", "<p>Disponibilidad 90 %, rendimiento 85 % y calidad 98 %.</p><p>OEE = 0,90 × 0,85 × 0,98 = <b>0,75 (75 %)</b>. La mayor pérdida está en el rendimiento: conviene revisar microdetenciones y velocidad.</p>"],
  err:q9ul(["<b>Medir demasiados indicadores:</b> nadie los revisa.", "<b>Definir un KPI sin fórmula exacta:</b> cada área lo calcula distinto.", "<b>Fijar metas sin línea base.</b>", "<b>Premiar un indicador que se puede «maquillar»</b> (por ejemplo, despachar incompleto para cumplir plazo).", "<b>Revisar el KPI sin tomar acciones.</b>"]),
  ejer:["<p>Una empresa tiene un costo de ventas anual de $ 120 millones y un inventario promedio de $ 20 millones. Calcula la rotación y los días de inventario.</p>", "Divide el costo de ventas por el inventario promedio.", "Divide 365 por la rotación.", "<p>Rotación = 120 ÷ 20 = <b>6 veces al año</b>. Días de inventario = 365 ÷ 6 ≈ <b>61 días</b>.</p>"],
  fic:["Un KPI necesita fórmula, fuente, frecuencia, meta y responsable.", "OEE = disponibilidad × rendimiento × calidad.", "Rotación = costo de ventas ÷ inventario promedio; días = 365 ÷ rotación.", "OTIF cuenta solo pedidos a tiempo y completos.", "Pocos indicadores, revisados con acciones, valen más que muchos."]
};

T2["mejora-continua"] = {
  def:"<p>La <b>mejora continua</b> es el esfuerzo sistemático de una organización por mejorar sus procesos en pasos pequeños y frecuentes, con datos y con la participación de quienes hacen el trabajo. Usa ciclos de resolución de problemas: PDCA (planificar, hacer, verificar, actuar), DMAIC (definir, medir, analizar, mejorar, controlar), 8D para problemas con clientes y el informe A3 para comunicar todo el ciclo en una hoja.</p>",
  fx:[["Defectos por millón de oportunidades", "DPMO=\\frac{\\text{Defectos}\\times 10^{6}}{\\text{Unidades}\\times\\text{Oportunidades por unidad}}", "DPMO = Defectos × 1.000.000 ÷ (Unidades × Oportunidades)", [], "Permite comparar procesos de distinta complejidad, porque divide por las oportunidades de error de cada unidad."],
    ["Mejora porcentual de un indicador", "\\text{Mejora}=\\frac{\\text{Antes}-\\text{Después}}{\\text{Antes}}\\times 100", "Mejora = (Antes − Después) ÷ Antes × 100", [], "Expresa el resultado del proyecto en relación con la línea base."]],
  met:"<p><b>Cómo resolver un problema con PDCA.</b></p>" + q9ol(["<b>Planificar:</b> define el problema con datos, mide la línea base, busca la causa raíz (5 porqués, Ishikawa) y propone acciones.", "<b>Hacer:</b> prueba las acciones en pequeño (una línea, un turno).", "<b>Verificar:</b> compara el indicador con la línea base.", "<b>Actuar:</b> si funcionó, estandariza (procedimiento, capacitación); si no, vuelve a planificar.", "Documenta el ciclo en un A3 y comparte lo aprendido."]),
  ejB:["reducir reprocesos en una línea de envasado", "<p>Línea base: 4,2 % de envases con sellado defectuoso. Causa raíz encontrada: temperatura de sellado variable por un sensor descalibrado. Acción: calibración y verificación diaria. Resultado tras un mes: 1,1 %.</p><p>Mejora = (4,2 − 1,1) ÷ 4,2 × 100 ≈ <b>74 %</b>. Se estandarizó la verificación diaria en la lista de chequeo de partida.</p>"],
  err:q9ul(["<b>Saltar del problema a la solución</b> sin buscar la causa raíz.", "<b>No medir la línea base:</b> después no se puede demostrar la mejora.", "<b>Implementar en toda la planta sin probar en pequeño.</b>", "<b>No estandarizar:</b> el problema vuelve a los pocos meses.", "<b>Confundir corrección con acción correctiva.</b>"]),
  ejer:["<p>En 2.000 unidades revisadas se encontraron 50 defectos. Cada unidad tiene 5 oportunidades de defecto. Calcula el DPMO.</p>", "Multiplica las unidades por las oportunidades para obtener el total de oportunidades.", "DPMO = defectos × 1.000.000 ÷ oportunidades totales.", "<p>Oportunidades = 2.000 × 5 = 10.000. DPMO = 50 × 1.000.000 ÷ 10.000 = <b>5.000</b>.</p>"],
  fic:["PDCA: planificar, hacer, verificar, actuar.", "DMAIC: definir, medir, analizar, mejorar, controlar.", "8D para problemas con clientes; A3 para comunicar el ciclo en una hoja.", "Sin línea base no hay mejora demostrable.", "Sin estandarización, el problema vuelve."]
};

/* ---------- Informes y herramientas ---------- */
T2["citas-apa"] = {
  fxT:"Estructuras clave de APA 7 (este tema no se apoya en fórmulas)",
  fxH:table(["Tipo", "Estructura de la referencia"], [["Libro", "Apellido, I. (Año). <i>Título del libro</i> (ed.). Editorial."], ["Artículo de revista", "Apellido, I., y Apellido, I. (Año). Título del artículo. <i>Nombre de la Revista, volumen</i>(número), páginas. https://doi.org/…"], ["Página web", "Autor u organización. (Año, día de mes). <i>Título de la página</i>. Sitio. URL"], ["Norma", "Organización. (Año). <i>Código y título de la norma</i>."]]) + "<p><b>Cita en el texto:</b> (Apellido, año) o Apellido (año); con tres o más autores: (Apellido et al., año).</p>",
  ejer:["<p>Arma la referencia APA 7 de este libro (datos ficticios): autores Ana Rojas y Pedro Soto; año 2021; título «Gestión de bodegas»; 2.ª edición; editorial Andes.</p>", "Autores con apellido e inicial, unidos por «y»; luego el año entre paréntesis.", "El título va en cursiva y la edición entre paréntesis, antes de la editorial.", "<p>Rojas, A., y Soto, P. (2021). <i>Gestión de bodegas</i> (2.ª ed.). Andes. En el texto: (Rojas y Soto, 2021).</p>"]
};

T2["generador-informe"] = {
  fxT:"Estructura clave de un informe técnico",
  fxH:q9ol(["<b>Portada:</b> título, autor, organización, fecha.", "<b>Resumen ejecutivo:</b> problema, método, resultado principal en cifras y recomendación (máximo una página).", "<b>Introducción:</b> contexto, problema y objetivos.", "<b>Metodología:</b> datos usados, herramientas y supuestos.", "<b>Resultados:</b> tablas y figuras numeradas, cada una comentada.", "<b>Conclusiones y recomendaciones:</b> una por objetivo.", "<b>Referencias y anexos</b> (memorias de cálculo)."]),
  ejer:["<p>Redacta un resumen ejecutivo de 3 oraciones con estos datos: el tiempo de cambio de formato de la línea 2 era de 45 minutos; con SMED se redujo a 18 minutos; esto libera unas 90 horas al año. Se recomienda aplicarlo a la línea 3.</p>", "Primera oración: problema y método. Segunda: resultado en cifras.", "Tercera: recomendación concreta.", "<p>Respuesta modelo: «Se aplicó la metodología SMED al cambio de formato de la línea 2, que tomaba 45 minutos. El tiempo se redujo a 18 minutos (60 % menos), lo que libera cerca de 90 horas productivas al año. Se recomienda replicar el método en la línea 3 durante el próximo trimestre.»</p>"]
};

T2["conversor"] = {
  fx:[["Temperatura", "{}^{\\circ}\\mathrm{F}={}^{\\circ}\\mathrm{C}\\times\\frac{9}{5}+32,\\qquad \\mathrm{K}={}^{\\circ}\\mathrm{C}+273{,}15", "°F = °C × 9 ÷ 5 + 32 ;  K = °C + 273,15", [], "Las escalas tienen distinto cero y distinto tamaño de grado, por eso no basta con multiplicar."],
    ["Presión", "1\\ \\text{bar}=100\\ \\text{kPa},\\qquad 1\\ \\text{psi}\\approx 6{,}895\\ \\text{kPa}", "1 bar = 100 kPa ;  1 psi ≈ 6,895 kPa", [], "Para pasar de psi a bar: multiplica por 0,0689."],
    ["Potencia", "1\\ \\text{hp}\\approx 0{,}7457\\ \\text{kW}", "1 hp ≈ 0,7457 kW", [], "Los motores importados suelen indicar hp; la tarifa eléctrica se calcula en kW y kWh."]],
  ejer:["<p>Un compresor indica 75 psi y su motor 30 hp. Expresa la presión en bar y la potencia en kW. Además, convierte 25 °C a °F.</p>", "Multiplica psi por 0,0689 y hp por 0,7457.", "Para °F: multiplica por 9/5 y suma 32.", "<p>75 psi × 0,0689 ≈ <b>5,17 bar</b>. 30 hp × 0,7457 ≈ <b>22,4 kW</b>. 25 °C × 9/5 + 32 = <b>77 °F</b>.</p>"]
};

/* ---------- Ofimática ---------- */
T2["excel-avanzado"] = {
  def:"<p><b>Excel avanzado</b> es el nivel en que la planilla deja de ser una tabla para anotar y se convierte en una herramienta de análisis: totales con condiciones, búsquedas entre tablas, funciones de texto y fecha, tablas dinámicas, validación de datos, formato condicional y gráficos que comunican. Es el nivel que se espera de un ingeniero industrial en su primer trabajo.</p>"
};

T2["word-basico"] = {
  fxT:"Estructuras clave de Word (este tema no se apoya en fórmulas)",
  fxH:table(["Para…", "Cómo hacerlo"], [["Dar formato a títulos", "Estilos Título 1, Título 2 (no negrita y tamaño a mano)."], ["Separar párrafos", "Espaciado posterior del párrafo, no Enter dobles."], ["Alinear columnas", "Tablas o tabulaciones, nunca espacios."], ["Pasar a página nueva", "Ctrl + Enter (salto de página), no muchos Enter."], ["Ver la estructura oculta", "Mostrar marcas de formato (¶)."]]),
  err:q9ul(["<b>Usar Enter repetidos</b> para separar párrafos o pasar de página.", "<b>Dar formato a mano</b> en vez de usar estilos.", "<b>Alinear con espacios</b> en vez de tablas o tabulaciones.", "<b>Insertar imágenes sin ajustar el diseño</b> y que se muevan al editar.", "<b>Enviar en Word un documento final</b> que no debe cambiar; para eso se usa PDF."])
};

T2["word-avanzado"] = {
  def:"<p><b>Word avanzado</b> es el manejo de documentos largos y formales: títulos numerados, tabla de contenido automática, secciones con distinta numeración, títulos de figuras y tablas, referencias cruzadas, notas al pie, ecuaciones, citas y control de cambios. Es lo que se necesita para un informe técnico, una memoria o un proyecto de título.</p>",
  fxT:"Estructuras clave de un documento largo",
  fxH:table(["Elemento", "Herramienta"], [["Títulos numerados", "Lista multinivel vinculada a los estilos Título 1, 2 y 3."], ["Índice", "Referencias → Tabla de contenido (se actualiza con F9)."], ["Numeración distinta por partes", "Saltos de sección y desvincular encabezados y pies."], ["Figuras y tablas", "Insertar título + referencia cruzada."], ["Bibliografía", "Citas y bibliografía con estilo APA."]]),
  met:"<p><b>Cómo armar un informe largo desde cero.</b></p>" + q9ol(["Configura los estilos (fuente, tamaños, espaciado) antes de escribir.", "Vincula la lista multinivel a los estilos de título.", "Inserta la portada y un salto de sección; luego la tabla de contenido y otro salto de sección.", "Ajusta la numeración: portada sin número, índice en romanos y cuerpo desde 1.", "Escribe el cuerpo usando estilos; inserta títulos de figuras y tablas.", "Usa referencias cruzadas y citas; al final, actualiza todos los campos (Ctrl + A, F9)."]),
  err:q9ul(["<b>Escribir la tabla de contenido a mano.</b>", "<b>Numerar títulos o figuras manualmente:</b> al agregar uno, todo queda desordenado.", "<b>No desvincular encabezados entre secciones.</b>", "<b>Olvidar actualizar los campos</b> antes de exportar a PDF.", "<b>Aceptar todos los cambios sin revisarlos</b> en el control de cambios."])
};

T2["word-pro"] = {
  def:"<p><b>Word profesional</b> es usar Word para automatizar documentos que se repiten: plantillas corporativas, combinación de correspondencia, campos, formularios con controles de contenido, elementos rápidos, vínculos con Excel y macros. Ahorra horas en documentos que se generan muchas veces con datos distintos.</p>",
  met:"<p><b>Cómo automatizar un documento repetitivo.</b></p>" + q9ol(["Identifica qué partes cambian y cuáles se mantienen.", "Crea una plantilla (.dotx) con estilos, logo y textos fijos.", "Define el origen de los datos (lista de Excel con encabezados claros).", "Inserta campos de combinación o controles de contenido en las partes variables.", "Prueba con pocos registros y revisa los resultados.", "Genera todos los documentos y guarda la plantilla para la próxima vez."]),
  err:q9ul(["<b>Partir de un documento antiguo</b> en vez de una plantilla limpia.", "<b>Usar una lista de Excel con celdas combinadas</b> o encabezados repetidos.", "<b>No revisar el formato de números y fechas</b> en la combinación.", "<b>Pegar tablas de Excel como imagen</b> cuando deben actualizarse.", "<b>Ejecutar macros de origen desconocido.</b>"])
};
