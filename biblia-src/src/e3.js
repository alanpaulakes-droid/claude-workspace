/* ============ AMPLIACIÓN DE GUÍAS: ESTUDIO DEL TRABAJO Y CALIDAD ============ */
GX["tiempo-estandar"] = {
fx:[["Tiempo observado", "TO = Σx ÷ n", V([["x", "cada lectura del cronómetro"], ["n", "número de lecturas"]])], ["Tiempo normal", "TN = TO × V", V([["V", "valoración del ritmo (1,10 si el operario trabajó 10 % más rápido que lo normal)"]])], ["Tiempo estándar", "TE = TN × (1 + S)", V([["S", "suplementos en decimal (necesidades personales, fatiga, demoras)"]])], ["Lecturas necesarias (95 % y ±5 %)", "n' = (40 × √(n × Σx² − (Σx)²) ÷ Σx)²", V([])], ["Producción esperada", "Unidades por hora = 3.600 ÷ TE", V([["TE", "en segundos"]])]],
fig:[() => D.chain([["Tiempo observado", "promedio de lecturas"], ["× Valoración", "ritmo normal = 100 %"], ["= Tiempo normal", ""], ["× (1 + suplementos)", "fatiga, necesidades"], ["= Tiempo estándar", "base de planificación"]], "Del cronómetro al tiempo estándar.", { color:true })],
ej:"<p><b>Enunciado.</b> En una línea de empaque de fruta se cronometró el armado de una caja: lecturas de 18, 20, 19, 21, 18, 20, 19, 19 segundos. El analista valora el ritmo en 95 % (el operario trabajó algo lento). Suplementos: 5 % personales + 4 % fatiga + 2 % de pie = 11 %.</p>" +
 M("TO = 154 ÷ 8 = 19,25 s") + M("TN = 19,25 × 0,95 = 18,29 s") + M("TE = 18,29 × 1,11 = 20,30 s") + M("Cajas por hora = 3.600 ÷ 20,30 = 177") +
 "<p>Para 12.000 cajas por turno de 8 horas se necesitan 12.000 ÷ (177 × 8) = 8,5 → <b>9 armadores</b>. Verificación de lecturas: con estas 8 lecturas, n' ≈ 5, así que son suficientes.</p>",
cmp:[["Técnica", "Precisión", "Costo", "Cuándo"], [["Cronometraje", "Alta", "Medio", "Tareas repetitivas y cortas"], ["Muestreo del trabajo", "Media", "Bajo", "Tareas largas o variadas, grupos"], ["Tiempos predeterminados (MTM, MOST)", "Alta", "Alto (requiere entrenamiento)", "Diseñar un puesto antes de que exista"], ["Datos estándar", "Media", "Bajo una vez construidos", "Familias de tareas similares"], ["Estimación de expertos", "Baja", "Muy bajo", "Primera aproximación"]]],
tips:["Mejora el método antes de medirlo: estandarizar un método malo solo fija el desperdicio.", "Explica al operario qué estás midiendo y por qué; un estudio a escondidas genera desconfianza y datos falsos.", "Descarta lecturas anormales (caída de herramienta, conversación) y anótalas: muestran problemas del puesto.", "Revisa la ergonomía del puesto junto con el tiempo: un estándar que lesiona no es sostenible."],
cita:["En el pasado el hombre ha sido lo primero; en el futuro el sistema debe ser lo primero.", "Frederick W. Taylor, The Principles of Scientific Management (1911)"]
};
GX["muestreo"] = {
fx:[["Tamaño de muestra", "n = z² × p × (1 − p) ÷ e²", V([["z", "valor normal de la confianza (1,96 para 95 %)"], ["p", "proporción esperada de la actividad"], ["e", "error absoluto aceptado"]])], ["Proporción observada", "p = x ÷ n", V([["x", "observaciones en que se vio la actividad"]])], ["Precisión lograda", "e = z × √(p × (1 − p) ÷ n)", V([])], ["Tiempo estándar por muestreo", "TE = (T × (1 − p_inactivo) × V ÷ U) × (1 + S)", V([["T", "tiempo total del estudio"], ["U", "unidades producidas"]])]],
fig:[() => D.bars(["Trabajando", "Esperando materiales", "Traslados", "Esperando permisos", "Pausas personales"], [61, 14, 11, 9, 5], "Resultado típico de un muestreo en un equipo de mantenimiento: casi 40 % del tiempo no es trabajo directo.", { fmt:v => v + " %", hi:[1, 3] })],
ej:"<p><b>Enunciado.</b> Se quiere saber qué porcentaje del tiempo están detenidas las grúas de un patio de contenedores. Un piloto indica cerca de 20 %. Se acepta un error de ±3 puntos con 95 % de confianza.</p>" +
 M("n = 1,96² × 0,20 × 0,80 ÷ 0,03² = 683 observaciones") +
 "<p>En 15 días se hacen 46 observaciones diarias en horarios aleatorios. Si en 700 observaciones la grúa estaba detenida 168 veces:</p>" + M("p = 168 ÷ 700 = 24 %   ·   e = 1,96 × √(0,24 × 0,76 ÷ 700) = 3,2 %") +
 "<p>Las grúas están detenidas entre 21 % y 27 % del tiempo; el siguiente paso es clasificar las causas de detención.</p>",
cmp:[["Aspecto", "Muestreo", "Cronometraje"], [["Mide", "Proporción del tiempo", "Duración de un ciclo"], ["Observador", "Visitas breves y aleatorias", "Presencia continua"], ["Ideal para", "Grupos, tareas largas, máquinas", "Tareas cortas y repetitivas"], ["Molestia al trabajador", "Baja", "Alta"]]],
tips:["Genera los horarios con números aleatorios (ALEATORIO.ENTRE en Excel) y cúmplelos; si el observador elige cuándo ir, sesga la muestra.", "Define cada categoría con un ejemplo concreto antes de empezar.", "Comparte los resultados con el equipo como problema del sistema, no como control de las personas."],
cita:["Lo que se mide, mejora.", "Atribuida a Peter Drucker"]
};
GX["aprendizaje"] = {
fx:[["Modelo de Wright", "T_n = T_1 × n^b", V([["T_n", "tiempo de la unidad número n"], ["T_1", "tiempo de la primera unidad"]])], ["Exponente", "b = log(r) ÷ log(2)", V([["r", "tasa de aprendizaje (0,80 para 80 %)"]])], ["Tiempo acumulado", "T_total = Σ T_1 × k^b", V([["k", "desde 1 hasta n"]])]],
fig:[() => D.curve(n => 100 * Math.pow(n, Math.log(0.8) / Math.LN2), "Curva de aprendizaje de 80 %: cada vez que la producción acumulada se duplica, el tiempo por unidad baja 20 %.", { x0:1, x1:64, xl:"unidad n", yl:"horas por unidad", marks:[[2, "80"], [4, "64"], [8, "51"]] })],
ej:"<p><b>Enunciado.</b> Una empresa de montajes cotiza 16 estructuras iguales. La primera tomó 200 horas. La experiencia indica una curva de 85 %.</p>" +
 M("b = log(0,85) ÷ log(2) = −0,2345") + M("T_16 = 200 × 16^(−0,2345) = 200 × 0,522 = 104 horas") +
 "<p>Unidades 1, 2, 4, 8, 16: 200, 170, 145, 123, 104 horas. El total de las 16 es cerca de 2.080 horas (promedio 130). Cotizar todo a 200 horas dejaría a la empresa fuera de competencia; cotizar a 104 generaría pérdidas.</p>",
cmp:[["Industria", "Tasa típica"], [["Aeronáutica", "80 % – 85 %"], ["Construcción repetitiva", "85 % – 90 %"], ["Electrónica", "90 % – 95 %"], ["Procesos automatizados", "95 % – 100 %"], ["Tareas manuales complejas", "75 % – 85 %"]]],
tips:["Usa la curva para planificar la puesta en marcha: en las primeras semanas de una línea nueva la producción será menor.", "Después de interrupciones largas hay olvido: el tiempo vuelve a subir.", "En licitaciones de muchas unidades, pregunta siempre si aplicaste curva de aprendizaje; tu competencia probablemente lo hizo."],
cita:["La experiencia es el nombre que todos dan a sus errores.", "Oscar Wilde"]
};
GX["productividad"] = {
fx:[["Productividad parcial", "P = Producción ÷ Insumo", V([])], ["Productividad total", "PT = Valor de la producción ÷ Σ Valor de los insumos", V([])], ["Variación", "ΔP = P_2 ÷ P_1 − 1", V([])]],
fig:[() => D.matrix(["Eficaz", "No eficaz"], ["Eficiente", "No eficiente"], [[["Productivo: logra la meta con pocos recursos", 1], ["Logra la meta, pero cara", 2]], [["Barato, pero no cumple", 2], ["Ni cumple ni ahorra", 3]]], "Eficacia (lograr la meta) y eficiencia (usar bien los recursos) son distintas; la productividad necesita ambas.")],
ej:"<p><b>Enunciado.</b> Una panadería industrial produjo 120.000 kg el mes pasado con 4.000 horas hombre y este mes 126.000 kg con 3.900 horas.</p>" + M("P_1 = 120.000 ÷ 4.000 = 30 kg/HH   ·   P_2 = 126.000 ÷ 3.900 = 32,3 kg/HH") + M("ΔP = 32,3 ÷ 30 − 1 = 7,7 %") + "<p>Si además el consumo de harina por kilo subió por mermas, la productividad de materiales bajó: revisa ambas antes de celebrar.</p>",
cmp:[["Concepto", "Pregunta"], [["Eficacia", "¿Logramos el resultado?"], ["Eficiencia", "¿Con cuántos recursos?"], ["Productividad", "¿Cuánto producimos por recurso?"], ["Efectividad", "¿Logramos el resultado correcto de forma eficiente?"]]],
tips:["Usa precios constantes del período base para que la inflación no parezca productividad.", "La productividad laboral sube al automatizar, pero la del capital puede bajar: mira siempre la total.", "Mide la productividad por línea o proceso, no solo por planta: el promedio esconde los problemas."],
cita:["La eficiencia es hacer bien las cosas; la eficacia es hacer las cosas correctas.", "Peter Drucker"]
};
GX["descriptiva"] = {
fx:[["Media", "x̄ = Σx ÷ n", V([])], ["Desviación estándar muestral", "s = √(Σ(x − x̄)² ÷ (n − 1))", V([["n − 1", "se usa porque la media se estimó con los mismos datos"]])], ["Coeficiente de variación", "CV = s ÷ x̄", V([])], ["Intervalo de confianza de la media", "x̄ ± t × s ÷ √n", V([["t", "valor de la t de Student con n − 1 grados de libertad"]])], ["Número de clases (Sturges)", "k = 1 + 3,322 × log(n)", V([])]],
fig:[() => D.normal()],
ej:"<p><b>Enunciado.</b> Tiempos de atención de 6 clientes en minutos: 4, 6, 5, 7, 5, 9.</p>" + M("x̄ = 36 ÷ 6 = 6 min") + M("s = √((4 + 0 + 1 + 1 + 1 + 9) ÷ 5) = √3,2 = 1,79 min") + M("CV = 1,79 ÷ 6 = 30 %") +
 "<p>La mediana es 5,5 min: el cliente de 9 minutos sube la media. Para tiempos de espera con colas largas, reporta mediana y percentil 90 además del promedio.</p>",
cmp:[["Medida", "Ventaja", "Cuidado"], [["Media", "Usa todos los datos", "Sensible a extremos"], ["Mediana", "Robusta", "Ignora la magnitud de los extremos"], ["Desviación estándar", "Escala de los datos", "Sensible a extremos"], ["Rango intercuartil", "Robusto", "Menos conocido por la gerencia"], ["Percentil 90", "Describe la experiencia de los peor atendidos", "Requiere más datos"]]],
tips:["Grafica antes de calcular: un histograma revela mezclas, atípicos y errores de digitación que un promedio esconde.", "En informes, reporta siempre media y dispersión juntas.", "Si el histograma tiene dos jorobas, probablemente hay dos poblaciones (dos máquinas, dos turnos): estratifica."],
cita:["En Dios confiamos; todos los demás deben traer datos.", "Atribuida a W. Edwards Deming"]
};
GX["control-xr"] = {
fx:[["Línea central de X̄", "X̿ = Σ X̄_i ÷ k", V([["X̄_i", "promedio del subgrupo i"], ["k", "número de subgrupos"]])], ["Límites de X̄", "LSC = X̿ + A₂ × R̄   ·   LIC = X̿ − A₂ × R̄", V([["A₂", "constante que depende del tamaño de subgrupo n (0,577 para n = 5)"], ["R̄", "rango promedio"]])], ["Límites de R", "LSC = D₄ × R̄   ·   LIC = D₃ × R̄", V([])], ["Desviación del proceso", "σ = R̄ ÷ d₂", V([])]],
fig:[() => D.control()],
ej:"<p><b>Enunciado.</b> Se controla el peso de sacos de cemento de 25 kg con subgrupos de 5 sacos. Tras 20 subgrupos: X̿ = 25,10 kg y R̄ = 0,40 kg.</p>" +
 M("LSC = 25,10 + 0,577 × 0,40 = 25,33 kg   ·   LIC = 25,10 − 0,577 × 0,40 = 24,87 kg") + M("LSC_R = 2,114 × 0,40 = 0,85 kg   ·   LIC_R = 0") + M("σ = 0,40 ÷ 2,326 = 0,172 kg") +
 "<p>Si un subgrupo da X̄ = 25,40, está fuera de control: se detiene, se revisa el sistema de dosificación y se registra la causa.</p>",
cmp:[["Gráfico", "Dato", "Tamaño de subgrupo"], [["X̄ – R", "Variable medible", "2 a 10"], ["X̄ – S", "Variable medible", "Más de 10"], ["I – MR", "Una medición a la vez", "1"], ["p / np", "Proporción o número de defectuosos", "Grande"], ["c / u", "Número de defectos", "Unidad de inspección"]]],
tips:["Analiza primero el gráfico R: si la dispersión no está bajo control, los límites de X̄ no valen.", "No ajustes la máquina por cada punto dentro de los límites: eso aumenta la variación (Deming lo mostró con el experimento del embudo).", "Anota en el gráfico lo que pasó (cambio de lote, de operador): el gráfico es también una bitácora.", "Los límites de control se recalculan solo cuando el proceso cambió de verdad."],
cita:["Un mal sistema le gana siempre a una buena persona.", "Atribuida a W. Edwards Deming"]
};
GX["control-p"] = {
fx:[["Proporción media", "p̄ = Σ defectuosos ÷ Σ inspeccionados", V([])], ["Límites", "LSC = p̄ + 3 × √(p̄ × (1 − p̄) ÷ n)   ·   LIC = p̄ − 3 × √(p̄ × (1 − p̄) ÷ n)", V([["n", "tamaño de cada muestra"]])], ["Gráfico c", "LSC = c̄ + 3 × √c̄", V([["c̄", "promedio de defectos por unidad de inspección"]])]],
fig:[() => D.control("Gráfico p: cada punto es la proporción de defectuosos de una muestra; uno fuera del límite indica que algo cambió.")],
ej:"<p><b>Enunciado.</b> Un call center revisa 200 llamadas diarias y en 20 días encontró 160 con errores de registro.</p>" + M("p̄ = 160 ÷ 4.000 = 0,04") + M("LSC = 0,04 + 3 × √(0,04 × 0,96 ÷ 200) = 0,04 + 0,0416 = 8,2 %") + "<p>Un día con 19 errores (9,5 %) está fuera de control: revisar qué pasó ese día (personal nuevo, falla del sistema).</p>",
cmp:[["Gráfico", "Qué cuenta"], [["p", "Proporción de unidades defectuosas, n variable"], ["np", "Número de unidades defectuosas, n constante"], ["c", "Número de defectos en una unidad"], ["u", "Defectos por unidad, tamaño variable"]]],
tips:["Usa muestras de tamaño suficiente para que n × p̄ sea al menos 5; si no, el gráfico no detecta nada.", "Un punto bajo el límite inferior también es una señal: algo mejoró (o el inspector dejó de revisar). Investígalo.", "Define con fotos o muestras qué es un defecto; si no, cada inspector mide distinto."],
cita:["La calidad es adecuación al uso.", "Joseph M. Juran"]
};
GX["capacidad"] = {
fx:[["Capacidad potencial", "Cp = (LES − LEI) ÷ 6σ", V([["LES / LEI", "límites de especificación superior e inferior"], ["σ", "desviación estándar del proceso"]])], ["Capacidad real", "Cpk = mín((LES − μ) ÷ 3σ ; (μ − LEI) ÷ 3σ)", V([["μ", "media del proceso"]])], ["Fracción fuera", "p = Φ((LEI − μ) ÷ σ) + 1 − Φ((LES − μ) ÷ σ)", V([["Φ", "función de distribución normal estándar"]])]],
fig:[() => D.normal("Capacidad: el proceso es capaz cuando su campana cabe con holgura entre los límites de especificación del cliente.", { spec:true })],
ej:"<p><b>Enunciado.</b> El diámetro de un perno debe estar entre 9,90 y 10,10 mm. El proceso tiene media 10,03 mm y σ = 0,025 mm.</p>" + M("Cp = 0,20 ÷ (6 × 0,025) = 1,33") + M("Cpk = mín((10,10 − 10,03) ÷ 0,075 ; (10,03 − 9,90) ÷ 0,075) = mín(0,93 ; 1,73) = 0,93") +
 "<p>Cp de 1,33 dice que el proceso <b>podría</b> cumplir, pero Cpk de 0,93 dice que <b>no cumple</b> porque está corrido hacia arriba. Solo centrando la máquina en 10,00 el Cpk sube a 1,33 sin invertir nada.</p>",
cmp:[["Índice", "σ usada", "Mide"], [["Cp", "Corto plazo", "Potencial si estuviera centrado"], ["Cpk", "Corto plazo", "Capacidad real considerando el centrado"], ["Pp / Ppk", "Total (largo plazo)", "Desempeño real observado"], ["Nivel sigma", "Con desplazamiento 1,5σ", "Comparación entre procesos distintos"]]],
tips:["Si Cpk es mucho menor que Cp, centra antes de invertir.", "Calcula capacidad solo con procesos estables (bajo control).", "Pide a tus proveedores Cpk de las características críticas y verifícalo con tus propias mediciones."],
cita:["La calidad es gratis.", "Philip Crosby, Quality Is Free (1979)"]
};
GX["sigma"] = {
fx:[["Defectos por oportunidad", "DPO = D ÷ (U × O)", V([["D", "defectos"], ["U", "unidades"], ["O", "oportunidades de defecto por unidad"]])], ["DPMO", "DPMO = DPO × 1.000.000", V([])], ["Nivel sigma", "Z = Φ⁻¹(1 − DPO) + 1,5", V([["1,5", "desplazamiento de largo plazo de la convención Seis Sigma"]])]],
fig:[() => D.bars(["2σ", "3σ", "4σ", "5σ", "6σ"], [308537, 66807, 6210, 233, 3.4], "DPMO por nivel sigma (con desplazamiento de 1,5σ). Cada nivel reduce los defectos entre 10 y 30 veces.", { fmt:v => v >= 1000 ? n0(v) : nf(v, 1) })],
ej:"<p><b>Enunciado.</b> Un centro de distribución despachó 10.000 pedidos; cada uno tiene 4 oportunidades de error (producto, cantidad, dirección, documento). Hubo 120 errores.</p>" + M("DPMO = 120 ÷ (10.000 × 4) × 1.000.000 = 3.000") + M("Z = Φ⁻¹(0,997) + 1,5 = 2,75 + 1,5 = 4,25σ") + "<p>Para llegar a 5σ (233 DPMO) habría que reducir los errores más de 12 veces.</p>",
cmp:[["Métrica", "Ventaja"], [["% defectuoso", "Simple"], ["PPM", "Útil cuando los defectos son escasos"], ["DPMO", "Compara procesos de distinta complejidad"], ["Nivel sigma", "Lenguaje común en programas Seis Sigma"]]],
tips:["Define las oportunidades de forma conservadora y estable; inflarlas mejora el número sin mejorar el proceso.", "Seis Sigma no es la meta para todo: en procesos administrativos, pasar de 3σ a 4σ ya es un gran logro."],
cita:["La variación es el enemigo de la calidad.", "Principio central de Seis Sigma"]
};
GX["pareto"] = {
fx:[["Porcentaje acumulado", "%Acum_k = Σ f_i ÷ Σ f_total", V([["f_i", "frecuencia o costo de cada categoría, ordenadas de mayor a menor"]])]],
fig:[() => D.bars(["Rayas", "Dimensión", "Soldadura", "Falta pieza", "Etiqueta", "Golpe", "Otros"], [142, 87, 64, 31, 18, 12, 9], "Pareto de defectos: las tres primeras barras explican cerca del 80 % de los casos.", { hi:[0, 1, 2] })],
ej:"<p><b>Enunciado.</b> Reclamos de un restaurante en un mes: demora 48, pedido equivocado 22, comida fría 15, cobro erróneo 8, limpieza 4, otros 3 (total 100).</p><p>Acumulados: 48 %, 70 %, 85 %, 93 %, 97 %, 100 %. Las tres primeras causas explican el 85 %. Conviene atacar la demora (por ejemplo, con un balance de la cocina y un sistema de comandas) antes que la limpieza.</p><p><b>Pareto de segundo nivel:</b> dentro de «demora», separar por turno o por plato suele revelar que la mayoría ocurre en el almuerzo con un par de platos complejos.</p>",
cmp:[["Herramienta", "Para qué"], [["Pareto", "Priorizar dónde actuar"], ["Ishikawa", "Encontrar causas posibles"], ["5 porqués", "Llegar a la causa raíz"], ["Hoja de verificación", "Recolectar los datos del Pareto"]]],
tips:["Haz el Pareto por costo además de por frecuencia: el defecto más frecuente no siempre es el más caro.", "Si «Otros» es la barra más grande, tus categorías están mal definidas.", "Después de mejorar, repite el Pareto con datos nuevos para mostrar el antes y después en la misma escala."],
cita:["Los pocos vitales y los muchos triviales.", "Joseph M. Juran"]
};
GX["amef"] = {
fx:[["Número de prioridad de riesgo", "NPR = S × O × D", V([["S", "severidad del efecto (1 a 10)"], ["O", "ocurrencia de la causa (1 a 10)"], ["D", "detección: 10 = imposible de detectar"]])]],
fig:[() => D.matrix(["Severidad 9–10", "Severidad 5–8", "Severidad 1–4"], ["Ocurrencia baja", "Media", "Alta"], [[["Acción necesaria", 3], ["Acción necesaria", 3], ["Acción necesaria", 3]], [["Revisar", 2], ["Acción recomendada", 3], ["Acción necesaria", 3]], [["Aceptable", 1], ["Revisar", 2], ["Acción recomendada", 2]]], "Lógica de prioridad: la severidad alta exige acción aunque la falla sea poco frecuente (idea de la Prioridad de Acción AIAG-VDA).")],
ej:"<p><b>Enunciado.</b> AMEF de proceso del llenado de cilindros de gas.</p><div class='tbl-wrap'><table><thead><tr><th>Modo de falla</th><th>Efecto</th><th class='num'>S</th><th class='num'>O</th><th class='num'>D</th><th class='num'>NPR</th></tr></thead><tbody><tr><td>Sobrellenado</td><td>Riesgo de explosión</td><td class='num'>10</td><td class='num'>2</td><td class='num'>4</td><td class='num'>80</td></tr><tr><td>Válvula con fuga</td><td>Fuga de gas</td><td class='num'>9</td><td class='num'>3</td><td class='num'>3</td><td class='num'>81</td></tr><tr><td>Etiqueta ilegible</td><td>Reclamo</td><td class='num'>3</td><td class='num'>6</td><td class='num'>3</td><td class='num'>54</td></tr></tbody></table></div><p>Aunque los NPR son parecidos, las dos primeras tienen severidad 9–10 y exigen acción: corte automático por peso (poka-yoke) y prueba de fuga al 100 %. Tras las acciones, O y D bajan; S no cambia porque el efecto es el mismo.</p>",
cmp:[["Tipo de AMEF", "Analiza", "Cuándo"], [["De diseño", "Fallas del producto por diseño", "Antes de liberar planos"], ["De proceso", "Fallas en la fabricación", "Antes de la producción en serie"], ["De sistema", "Interacciones entre subsistemas", "Productos complejos"], ["De maquinaria", "Fallas de equipos", "Mantenimiento centrado en confiabilidad"]]],
tips:["Haz el AMEF en equipo y en terreno; un AMEF de escritorio no encuentra las fallas reales.", "Prioriza por severidad antes que por NPR.", "Conecta el AMEF con el plan de control: cada causa importante debe tener un control y una reacción definida."],
cita:["Para que una tecnología sea exitosa, la realidad debe estar por encima de las relaciones públicas, porque a la naturaleza no se la puede engañar.", "Richard Feynman, informe sobre el accidente del Challenger (1986)"]
};
GX["muestra"] = {
fx:[["Para una proporción", "n₀ = z² × p × (1 − p) ÷ e²", V([])], ["Para una media", "n₀ = (z × σ ÷ e)²", V([["σ", "desviación estándar estimada"], ["e", "error máximo aceptado"]])], ["Población finita", "n = n₀ ÷ (1 + (n₀ − 1) ÷ N)", V([["N", "tamaño de la población"]])]],
fig:[() => D.curve(e => 0.9604 / (e * e), "Tamaño de muestra para una proporción (95 %, p = 0,5) según el error aceptado: para reducir el error a la mitad se necesita cuatro veces la muestra.", { x0:0.02, x1:0.1, xl:"error aceptado", yl:"muestra n", marks:[[0.05, "±5 % → 384"]] })],
ej:"<p><b>Enunciado.</b> Se quiere estimar el tiempo promedio de carga de camiones con ±2 minutos y 95 % de confianza. Un piloto da σ = 8 minutos.</p>" + M("n₀ = (1,96 × 8 ÷ 2)² = 61,5 ≈ 62 camiones") + "<p>Si solo se cargan 200 camiones en el período:</p>" + M("n = 62 ÷ (1 + 61 ÷ 200) = 47,5 ≈ 48 camiones"),
cmp:[["Muestreo", "Cómo", "Cuándo"], [["Aleatorio simple", "Todos tienen igual probabilidad", "Población homogénea"], ["Estratificado", "Muestra en cada grupo", "Grupos distintos (turnos, regiones)"], ["Sistemático", "Uno de cada k", "Líneas de producción"], ["Por conglomerados", "Se eligen grupos completos", "Población dispersa geográficamente"]]],
tips:["Si no sabes nada de la proporción, usa p = 0,5: da la muestra más grande y nunca te quedas corto.", "En encuestas, la muestra es la de respuestas, no la de invitaciones: considera la tasa de respuesta.", "Un error de ±5 % no permite afirmar que 52 % es «mayoría»."],
cita:["No es necesario comerse un buey entero para saber que la carne está dura.", "Atribuida a Samuel Johnson"]
};
GX["regresion"] = {
fx:[["Pendiente", "b = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)²", V([])], ["Intercepto", "a = ȳ − b × x̄", V([])], ["Recta", "ŷ = a + b × x", V([["ŷ", "valor estimado de y"]])], ["Correlación", "r = Sxy ÷ √(Sxx × Syy)", V([])], ["Coeficiente de determinación", "R² = r²", V([])]],
fig:[() => D.curve(x => 520 + 72 * x, "Recta de costos: el intercepto representa el costo fijo y la pendiente el costo variable por unidad.", { x0:0, x1:60, xl:"unidades producidas (miles)", yl:"costo total (miles $)" })],
ej:"<p><b>Enunciado.</b> Consumo eléctrico de una planta (MWh) y toneladas producidas en 4 meses: (10 t; 50), (12; 56), (15; 65), (13; 59).</p>" +
 M("x̄ = 12,5   ·   ȳ = 57,5") + M("b = (18,75 + 0,75 + 18,75 + 0,75) ÷ (6,25 + 0,25 + 6,25 + 0,25) = 39 ÷ 13 = 3,0 MWh por tonelada") + M("a = 57,5 − 3,0 × 12,5 = 20 MWh") +
 "<p>La planta consume unos 20 MWh fijos al mes (iluminación, aire comprimido, climatización) aunque no produzca. Esa es la primera oportunidad de eficiencia energética.</p>",
cmp:[["Técnica", "Uso"], [["Regresión simple", "Una variable explicativa"], ["Regresión múltiple", "Varias variables (precio, temperatura, días hábiles)"], ["Regresión logística", "Predecir un sí/no (falla o no falla)"], ["Series de tiempo", "Cuando la variable explicativa es el tiempo"]]],
tips:["Grafica la dispersión antes: la regresión lineal ajusta una recta aunque los datos sean una curva.", "Un R² alto no prueba causalidad: las ventas de helados y los ahogamientos se correlacionan por el verano.", "Revisa los residuos; si tienen patrón, al modelo le falta una variable."],
cita:["Correlación no implica causalidad.", "Principio básico de la estadística"]
};
