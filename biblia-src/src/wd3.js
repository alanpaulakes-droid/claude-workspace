/* ============ COMPLETAR TEMAS · LOTE 3: SABERES (bloques pendientes) ============
   Las tarifas, tasas y precios de los ejercicios son supuestos de ejemplo, no valores oficiales. */
const supu = '<p class="hint">Los precios, tarifas y tasas de este ejercicio son supuestos para practicar; no son valores oficiales.</p>';

T2["agro"] = {
  def:"<p>La <b>agroindustria</b> transforma y prepara productos agrícolas para el consumo o la exportación: selección, embalaje, frío, procesamiento (jugos, deshidratados, congelados, vino) y logística hasta el cliente. En Chile es una de las principales actividades exportadoras, con fruta fresca, vino y alimentos procesados.</p><p>Para el ingeniero industrial es un sistema productivo con dos rasgos propios: la materia prima es perecible y la demanda de capacidad se concentra en una temporada corta, por lo que la planificación de personal, frío y transporte es decisiva.</p>",
  met:"<p><b>Cómo planificar una temporada de packing.</b></p>" + q9ol([
    "Estima los kilos que llegarán por semana (pronóstico de cosecha de los productores).",
    "Calcula la capacidad de cada línea en kg/h, descontando cambios de calibre o de variedad y paradas.",
    "Determina turnos y personas por semana para procesar los kilos de la semana peak.",
    "Verifica la capacidad de frío: prefrío y cámaras en toneladas, y el tiempo máximo entre cosecha y frío.",
    "Coordina el transporte y las reservas de contenedores con la naviera según el programa de embarques.",
    "Revisa las certificaciones y los registros de trazabilidad que exige cada mercado.",
    "Durante la temporada, controla el rendimiento (kilos exportables ÷ kilos recibidos) y las mermas por día."]),
  err:q9ul([
    "<b>Dimensionar con la semana promedio</b> en vez de la semana peak: la fruta no puede esperar.",
    "<b>Olvidar el tiempo hasta el frío:</b> cada hora a temperatura ambiente acorta la vida de la fruta.",
    "<b>Calcular el riego sin la eficiencia del sistema:</b> el volumen a aplicar es mayor que la evapotranspiración del cultivo.",
    "<b>Confundir ET₀ con ETc:</b> la de referencia debe multiplicarse por el coeficiente del cultivo (Kc).",
    "<b>Registrar la trazabilidad al final del día</b> en vez de en el momento: los errores impiden aislar un lote con problemas."]),
  ejer:["<p>Un huerto de 2 ha tiene una ET₀ de 5 mm/día, un coeficiente de cultivo Kc = 0,9 y riego por goteo con eficiencia de 90 %. ¿Cuántos m³ de agua hay que aplicar por día?</p>",
    "Calcula primero la evapotranspiración del cultivo: ETc = Kc × ET₀.",
    "Recuerda que 1 mm sobre 1 ha equivale a 10 m³. Después divide por la eficiencia.",
    "<p>ETc = 0,9 × 5 = 4,5 mm/día. Volumen = 4,5 mm × 10 m³/(mm·ha) × 2 ha ÷ 0,9 = <b>100 m³ por día</b>.</p>"]
};

T2["comercio-exterior"] = {
  def:"<p>El <b>comercio exterior</b> es la compra (importación) y venta (exportación) de bienes y servicios entre países. Involucra acuerdos de entrega (Incoterms), transporte internacional, seguros, documentos, aduanas, impuestos, formas de pago y riesgo cambiario.</p><p>El ingeniero industrial lo usa para comparar proveedores extranjeros por su <b>costo total puesto en bodega</b>, planificar plazos de importación y gestionar el inventario en tránsito.</p>",
  met:"<p><b>Cómo calcular y gestionar una importación.</b></p>" + q9ol([
    "Pide cotizaciones con el mismo Incoterm (por ejemplo, FOB) para que sean comparables.",
    "Calcula el valor CIF: FOB + flete internacional + seguro.",
    "Calcula los derechos: arancel según el origen y los tratados vigentes (con certificado de origen, puede ser menor o cero).",
    "Calcula el IVA de importación sobre (CIF + arancel). Si la empresa emite facturas afectas, se recupera como crédito fiscal.",
    "Suma los gastos locales (agente de aduana, puerto, transporte a bodega) para obtener el costo puesto en bodega.",
    "Define la forma de pago (transferencia, cobranza o carta de crédito) y cómo cubrir el riesgo de tipo de cambio.",
    "Programa el pedido considerando el plazo total: producción, tránsito marítimo y trámite aduanero."]),
  err:q9ul([
    "<b>Comparar precios con Incoterms distintos</b> (un EXW contra un CIF): no incluyen los mismos costos ni riesgos.",
    "<b>Olvidar el seguro o el flete</b> en el valor CIF, que es la base de los derechos.",
    "<b>Sumar el IVA de importación al costo</b> cuando la empresa lo recupera como crédito fiscal.",
    "<b>No pedir el certificado de origen</b> y pagar arancel completo pudiendo acogerse a un tratado.",
    "<b>Calcular con el tipo de cambio de la cotización</b> y no con el del día de pago.",
    "<b>Emitir documentos con datos inconsistentes</b> (pesos, descripciones, valores): retrasan la aduana."]),
  ejer:["<p>Una empresa importa repuestos: valor FOB US$ 20.000, flete US$ 1.800, seguro US$ 200, arancel de 6 % (supuesto; verificar según origen y tratados) y gastos locales US$ 600. La empresa recupera el IVA. ¿Cuál es el costo puesto en bodega?</p>" + supu,
    "Calcula el CIF sumando FOB, flete y seguro; el arancel se aplica sobre el CIF.",
    "El IVA se calcula sobre CIF + arancel, pero si se recupera no forma parte del costo.",
    "<p>CIF = 20.000 + 1.800 + 200 = US$ 22.000. Arancel = 22.000 × 0,06 = US$ 1.320. IVA = (22.000 + 1.320) × 0,19 = US$ 4.430,80 (crédito fiscal, no es costo). Costo puesto en bodega = 22.000 + 1.320 + 600 = <b>US$ 23.920</b>.</p>"]
};

T2["electricidad"] = {
  def:"<p>La <b>electricidad industrial</b> estudia cómo se genera, distribuye y usa la energía eléctrica en una planta: tensiones y corrientes, potencia, motores, protecciones y tarifas. Casi todos los equipos de producción dependen de ella y suele ser uno de los mayores costos de operación.</p><p>El ingeniero industrial no diseña instalaciones (eso lo hace un especialista autorizado), pero sí calcula consumos y costos, evalúa ahorros (motores eficientes, variadores, factor de potencia) y exige condiciones de seguridad.</p>",
  met:"<p><b>Cómo estimar el consumo y el costo eléctrico de un equipo.</b></p>" + q9ol([
    "Toma los datos de placa o mide: tensión, corriente y factor de potencia (cos φ).",
    "Calcula la potencia activa; en trifásico: P = √3 × V × I × cos φ.",
    "Estima las horas de operación por año y el porcentaje de carga real.",
    "Calcula la energía: E (kWh) = P (kW) × horas.",
    "Multiplica por la tarifa de energía y agrega los cargos por potencia de tu contrato.",
    "Evalúa mejoras: motor de mayor eficiencia, variador de frecuencia (por la ley de afinidad, bajar 20 % la velocidad reduce la potencia a cerca de la mitad) o corrección del factor de potencia."]),
  err:q9ul([
    "<b>Confundir kW con kWh:</b> el kW es potencia (ritmo); el kWh es energía (lo que se cobra por consumo).",
    "<b>Usar la fórmula monofásica en un motor trifásico</b> (falta el factor √3).",
    "<b>Olvidar el factor de potencia</b> al pasar de corriente a potencia activa.",
    "<b>Sobredimensionar motores:</b> trabajando a poca carga bajan su eficiencia y su factor de potencia.",
    "<b>Regular caudal con válvula</b> en una bomba o ventilador cuando un variador ahorraría energía.",
    "<b>Intervenir equipos sin bloqueo y etiquetado</b> (LOTO) ni verificación de ausencia de tensión."]),
  ejer:["<p>Un motor trifásico trabaja a 380 V, 20 A y cos φ = 0,85, durante 16 h al día y 300 días al año. Con una tarifa de $ 120 por kWh (supuesto), ¿cuánto cuesta la energía anual?</p>" + supu,
    "Calcula la potencia activa con la fórmula trifásica y pásala a kW.",
    "Multiplica por las horas anuales (16 × 300) y luego por la tarifa.",
    "<p>P = √3 × 380 × 20 × 0,85 ≈ 11.189 W = 11,19 kW. Horas = 4.800. Energía ≈ 53.707 kWh. Costo ≈ 53.707 × 120 = <b>$ 6.444.892 al año</b> (sin cargos por potencia).</p>"]
};

T2["finanzas-personales"] = {
  def:"<p>Las <b>finanzas personales</b> son la gestión de tus ingresos, gastos, ahorros, deudas e inversiones para cumplir tus metas y enfrentar imprevistos. Usan las mismas herramientas de la ingeniería económica (valor del dinero en el tiempo, tasas, cuotas) aplicadas a tu vida.</p><p>Las decisiones principales son: cuánto gastar y ahorrar cada mes, cómo endeudarse sin poner en riesgo el presupuesto, cómo ahorrar para la vejez y cómo financiar una vivienda.</p>",
  met:"<p><b>Cómo ordenar tus finanzas en un mes.</b></p>" + q9ol([
    "Parte del sueldo líquido (lo que realmente recibes después de descuentos legales).",
    "Registra todos tus gastos de un mes y clasifícalos en fijos, variables y deudas.",
    "Define el ahorro como un gasto fijo que se aparta al recibir el sueldo, no lo que sobre a fin de mes.",
    "Arma un fondo de emergencia de varios meses de gastos antes de invertir en instrumentos de mayor riesgo.",
    "Antes de pedir un crédito, compara la CAE y el costo total, no solo la cuota.",
    "Prioriza pagar las deudas con la tasa más alta.",
    "Revisa el presupuesto cada mes y ajusta."]),
  err:q9ul([
    "<b>Mirar solo la cuota</b> y no el costo total ni la CAE de un crédito.",
    "<b>Pagar solo el mínimo de la tarjeta:</b> el saldo sigue generando intereses altos.",
    "<b>No tener fondo de emergencia</b> y endeudarse ante cualquier imprevisto.",
    "<b>Postergar el ahorro previsional voluntario</b>: el interés compuesto premia empezar temprano.",
    "<b>Invertir en algo que no entiendes</b> o que promete rentabilidades muy altas sin riesgo.",
    "<b>Comparar tasas de distinta unidad</b> (mensual contra anual)."]),
  ejer:["<p>Pides un crédito de consumo de $ 2.000.000 a 12 meses con una tasa de 2 % mensual (supuesto). ¿Cuál es la cuota y cuánto pagas en intereses?</p>" + supu,
    "Usa la fórmula de la cuota: C = P × i ÷ [1 − (1 + i)<sup>−n</sup>], con i = 0,02 y n = 12.",
    "Los intereses totales son la suma de las cuotas menos el monto pedido.",
    "<p>C = 2.000.000 × 0,02 ÷ [1 − 1,02<sup>−12</sup>] ≈ <b>$ 189.119</b>. Total pagado ≈ 12 × 189.119 = $ 2.269.430. Intereses ≈ <b>$ 269.430</b> (sin seguros ni comisiones, que aumentan la CAE).</p>"]
};

T2["hidraulica"] = {
  def:"<p>La <b>hidráulica</b> usa líquidos (agua, aceite) para transmitir fuerza o transportar fluidos; la <b>neumática</b> usa aire comprimido. En la industria aparecen en bombas, cañerías, cilindros, prensas, frenos y actuadores de máquinas.</p><p>El ingeniero industrial calcula presiones, caudales y potencias, elige entre soluciones hidráulicas y neumáticas, y controla el consumo de energía, en especial el del aire comprimido, que suele tener muchas fugas.</p>",
  met:"<p><b>Cómo estimar la potencia de una bomba.</b></p>" + q9ol([
    "Define el caudal necesario Q (m³/s) a partir del proceso.",
    "Calcula la altura total H (m): diferencia de nivel + diferencia de presión expresada en metros + pérdidas en cañerías y accesorios.",
    "Calcula la potencia hidráulica: P = ρ × g × Q × H.",
    "Divide por la eficiencia de la bomba para obtener la potencia en el eje; considera también la eficiencia del motor.",
    "Elige la bomba con su curva: el punto de operación es la intersección entre la curva de la bomba y la curva del sistema.",
    "Verifica que no haya cavitación (NPSH disponible mayor que el requerido)."]),
  err:q9ul([
    "<b>Mezclar unidades de presión</b> (bar, Pa, psi, metros de columna de agua) sin convertir: 1 bar = 100.000 Pa ≈ 10,2 m de agua.",
    "<b>Olvidar las pérdidas en cañerías y accesorios</b> al calcular la altura total.",
    "<b>Tomar la potencia hidráulica como potencia del motor</b> sin dividir por las eficiencias.",
    "<b>Ignorar las fugas de aire comprimido:</b> se pagan las 24 horas aunque nadie las use.",
    "<b>Instalar la bomba sin revisar el NPSH:</b> la cavitación daña el rodete.",
    "<b>Elegir neumática cuando se requiere fuerza alta y posición precisa</b> (ahí conviene hidráulica o actuadores eléctricos)."]),
  ejer:["<p>Una bomba debe elevar 72 m³/h de agua con una altura total de 30 m. Si su eficiencia es 70 %, ¿qué potencia necesita en el eje? (ρ = 1.000 kg/m³, g = 9,81 m/s²)</p>",
    "Pasa el caudal a m³/s: 72 ÷ 3.600.",
    "Calcula la potencia hidráulica y luego divide por la eficiencia.",
    "<p>Q = 0,02 m³/s. P = 1.000 × 9,81 × 0,02 × 30 = 5.886 W. P<sub>eje</sub> = 5.886 ÷ 0,7 ≈ <b>8,4 kW</b>.</p>"]
};

T2["mantenimiento"] = {
  def:"<p>El <b>mantenimiento</b> es el conjunto de actividades que conservan o devuelven a los equipos su capacidad de funcionar como se necesita, con seguridad y al menor costo total. Incluye el correctivo (reparar después de la falla), el preventivo (intervenir por tiempo o uso), el predictivo (intervenir según la condición medida) y la mejora de equipos.</p><p>Se mide con indicadores como MTBF, MTTR y disponibilidad, y se gestiona con un sistema de órdenes de trabajo (CMMS).</p>",
  met:"<p><b>Cómo definir la estrategia de mantenimiento de un equipo.</b></p>" + q9ol([
    "Evalúa la criticidad del equipo: efecto de su falla en seguridad, ambiente, producción y costo.",
    "Revisa el historial de fallas y calcula MTBF, MTTR y disponibilidad.",
    "Para cada modo de falla importante, define la tarea adecuada: predictiva si la falla da aviso, preventiva si depende del uso, o correr hasta la falla si el costo es bajo.",
    "Define frecuencias, repuestos críticos y personal.",
    "Planifica y programa las órdenes de trabajo; mide el cumplimiento del programa.",
    "Analiza las fallas repetitivas (causa raíz) y ajusta el plan."]),
  err:q9ul([
    "<b>Aplicar preventivo por calendario a todo:</b> muchas fallas no dependen de la edad; para ellas conviene el predictivo.",
    "<b>Calcular MTBF con el tiempo calendario</b> en vez del tiempo real de operación.",
    "<b>Confundir disponibilidad con confiabilidad:</b> un equipo puede estar disponible el 97 % del tiempo y fallar seguido con reparaciones rápidas.",
    "<b>Usar la confiabilidad exponencial</b> cuando hay desgaste (Weibull con β &gt; 1).",
    "<b>No registrar las fallas con su causa:</b> sin datos no se puede mejorar.",
    "<b>Olvidar los repuestos críticos:</b> el tiempo de espera de un repuesto suele ser la mayor parte del MTTR."]),
  ejer:["<p>En un mes, un equipo operó 702 h, tuvo 4 fallas y estuvo 18 h en reparación. Calcula MTBF, MTTR, disponibilidad y la probabilidad de operar 24 h seguidas sin fallar (modelo exponencial).</p>",
    "MTBF = tiempo de operación ÷ fallas; MTTR = tiempo de reparación ÷ reparaciones.",
    "A = MTBF ÷ (MTBF + MTTR); R(t) = e<sup>−t ÷ MTBF</sup>.",
    "<p>MTBF = 702 ÷ 4 = <b>175,5 h</b>. MTTR = 18 ÷ 4 = <b>4,5 h</b>. A = 175,5 ÷ 180 = <b>97,5 %</b>. R(24) = e<sup>−24 ÷ 175,5</sup> ≈ <b>0,87</b>.</p>"]
};

T2["mecanica"] = {
  def:"<p>La <b>mecánica industrial</b> estudia los materiales, los esfuerzos y los elementos que forman las máquinas: ejes, rodamientos, engranajes, correas, uniones y lubricación, junto con los procesos para fabricarlos y la forma de especificarlos en planos.</p><p>El ingeniero industrial la usa para entender por qué fallan los equipos, especificar repuestos, calcular potencias y transmisiones, y comunicarse con mantenimiento y proveedores.</p>",
  met:"<p><b>Cómo seleccionar una transmisión motor-reductor.</b></p>" + q9ol([
    "Define la velocidad y el torque que necesita la máquina.",
    "Calcula la relación de transmisión: i = velocidad del motor ÷ velocidad requerida.",
    "Calcula el torque en la salida: T = P × 60 ÷ (2π × n), considerando la eficiencia del reductor.",
    "Aplica un factor de servicio según el tipo de carga (golpes, arranques frecuentes).",
    "Verifica los elementos: vida de rodamientos, resistencia del eje y del acoplamiento.",
    "Define la lubricación (tipo y frecuencia) según el catálogo del fabricante."]),
  err:q9ul([
    "<b>Confundir rpm con rad/s</b> en el cálculo de potencia o torque.",
    "<b>Olvidar la eficiencia del reductor</b>: el torque de salida real es menor que el ideal.",
    "<b>No aplicar factor de servicio</b> a cargas con golpes.",
    "<b>Lubricar de más o con un lubricante equivocado:</b> el exceso de grasa también calienta y daña rodamientos.",
    "<b>Pedir un repuesto sin especificar tolerancia y ajuste</b> (por ejemplo, el ajuste entre eje y rodamiento).",
    "<b>Soldar sin procedimiento</b> ni considerar el material base."]),
  ejer:["<p>Un motor de 7,5 kW gira a 1.450 rpm y mueve un reductor de relación 20:1 con eficiencia de 95 %. ¿A qué velocidad gira la salida y qué torque entrega?</p>",
    "La velocidad de salida es la del motor dividida por la relación.",
    "Usa T = P × 60 ÷ (2π × n) con la velocidad de salida y multiplica por la eficiencia.",
    "<p>n<sub>2</sub> = 1.450 ÷ 20 = <b>72,5 rpm</b>. Torque ideal = 7.500 × 60 ÷ (2π × 72,5) ≈ 988 N·m. Con 95 % de eficiencia: ≈ <b>938 N·m</b>.</p>"]
};

T2["mecatronica"] = {
  met:"<p><b>Cómo integrar un sensor analógico a un PLC.</b></p>" + q9ol([
    "Define qué variable se mide, su rango y la precisión necesaria.",
    "Elige el sensor y la señal (4–20 mA es la más común en planta por su inmunidad al ruido y porque 0 mA indica cable cortado).",
    "Conecta la señal a una entrada analógica del PLC respetando el tipo de alimentación del lazo.",
    "Escala la señal: valor = (I − 4) ÷ 16 × (máximo − mínimo) + mínimo.",
    "Define alarmas (alto, bajo, falla de señal) y muéstralas en el HMI o SCADA.",
    "Si la variable se controla, ajusta el PID partiendo por la acción proporcional y verifica la respuesta ante cambios."]),
  err:q9ul([
    "<b>Escalar 4–20 mA como si fuera 0–20 mA:</b> olvidar restar los 4 mA desplaza toda la lectura.",
    "<b>No detectar la falla de señal</b> (corriente bajo 4 mA), que se interpreta como valor mínimo.",
    "<b>Ajustar un PID con ganancias altas desde el inicio:</b> el sistema oscila.",
    "<b>Automatizar sin estándar de nombres ni documentación</b> del programa del PLC.",
    "<b>Instalar un robot sin evaluar los riesgos</b> ni las protecciones de la celda.",
    "<b>Evaluar la automatización solo por la mano de obra ahorrada</b>, sin calidad, mantenimiento ni disponibilidad."]),
  ejer:["<p>Un transmisor de temperatura de 4–20 mA tiene un rango de 0 a 150 °C. El PLC lee 15,2 mA. ¿Qué temperatura indica? Si el encoder del mismo equipo tiene 1.024 pulsos por vuelta, ¿cuál es su resolución?</p>",
    "Usa valor = (I − 4) ÷ 16 × (máx − mín) + mín.",
    "La resolución del encoder es 360° ÷ pulsos por vuelta.",
    "<p>T = (15,2 − 4) ÷ 16 × 150 = <b>105 °C</b>. Resolución = 360 ÷ 1.024 ≈ <b>0,35°</b> por pulso.</p>"]
};

T2["excel-pro"] = {
  def:"<p><b>Excel profesional</b> es usar la planilla como una herramienta de análisis confiable: modelos ordenados, datos en tablas, funciones de búsqueda y resumen, tablas dinámicas, Power Query para limpiar datos y gráficos que comunican una conclusión.</p><p>La diferencia con el uso básico no está en conocer más funciones, sino en construir archivos que otra persona entiende, revisa y actualiza sin errores.</p>",
  fxT:"Funciones clave (Excel en español)",
  fxH:table(["Para…", "Función", "Ejemplo"], [
    ["Buscar un dato en otra tabla", "BUSCARX", "=BUSCARX(A2;Productos[Código];Productos[Precio];\"No existe\")"],
    ["Sumar con varias condiciones", "SUMAR.SI.CONJUNTO", "=SUMAR.SI.CONJUNTO(Ventas[Monto];Ventas[Región];\"Norte\";Ventas[Mes];3)"],
    ["Contar con condiciones", "CONTAR.SI.CONJUNTO", "=CONTAR.SI.CONJUNTO(Pedidos[Estado];\"Atrasado\")"],
    ["Evitar errores visibles", "SI.ERROR", "=SI.ERROR(B2/C2;0)"],
    ["Elegir según una condición", "SI / SI.CONJUNTO", "=SI(B2>=4;\"Aprobado\";\"Reprobado\")"],
    ["Filtrar una lista con fórmulas", "FILTRAR", "=FILTRAR(Ventas;Ventas[Monto]>1000000)"]]) + "<p>En Excel en español con configuración regional de Chile, los argumentos se separan con punto y coma.</p>",
  met:"<p><b>Cómo construir un modelo profesional.</b></p>" + q9ol([
    "Separa el archivo en hojas de <b>supuestos</b>, <b>datos</b>, <b>cálculos</b> y <b>resultados</b>.",
    "Convierte los datos en tablas (Ctrl + T) y usa sus nombres en las fórmulas.",
    "Escribe cada supuesto una sola vez, en una celda identificada; nunca escribas números fijos dentro de las fórmulas.",
    "Usa funciones de búsqueda y resumen en vez de copiar datos a mano.",
    "Agrega controles: totales que deben cuadrar y alertas si algo no calza.",
    "Resume con una tabla dinámica o un gráfico que responda una pregunta concreta.",
    "Documenta en una hoja de instrucciones qué hace el archivo y cómo se actualiza."]),
  ejB:["ventas por región", "<p>Tabla «Ventas» con columnas Fecha, Región, Producto y Monto. Se pide el total de la región Norte en marzo.</p>" + q9ul([
    "Agrega una columna Mes con =MES([@Fecha]).",
    "Total: =SUMAR.SI.CONJUNTO(Ventas[Monto];Ventas[Región];\"Norte\";Ventas[Mes];3).",
    "Si la tabla crece, la fórmula se actualiza sola porque usa la tabla y no un rango fijo."])],
  err:q9ul([
    "<b>Escribir números fijos dentro de las fórmulas</b> (=B2*1,19): si el valor cambia, hay que buscarlo en todo el archivo.",
    "<b>Usar rangos fijos</b> (A2:A500) que no incluyen las filas nuevas; usa tablas.",
    "<b>Mezclar datos y cálculos en la misma hoja</b> sin separación.",
    "<b>Ocultar errores con SI.ERROR</b> sin entender por qué aparecen.",
    "<b>Combinar celdas en tablas de datos:</b> impide ordenar, filtrar y hacer tablas dinámicas.",
    "<b>Hacer gráficos sin título que diga la conclusión</b> ni unidades en los ejes."]),
  ejer:["<p>Tienes una tabla «Pedidos» con columnas Cliente, Estado («Entregado» o «Atrasado») y Monto. Escribe la fórmula que suma el monto de los pedidos atrasados del cliente «Ferretería Sur».</p>",
    "Necesitas sumar con dos condiciones: una sobre Cliente y otra sobre Estado.",
    "La función es SUMAR.SI.CONJUNTO: primero el rango a sumar y luego pares de rango y criterio.",
    "<p><code>=SUMAR.SI.CONJUNTO(Pedidos[Monto];Pedidos[Cliente];\"Ferretería Sur\";Pedidos[Estado];\"Atrasado\")</code></p>"]
};

T2["mentalidad"] = {
  def:"<p>La <b>mentalidad del experto</b> es la forma de pensar que permite resolver problemas nuevos con rapidez y buen criterio: descomponer el problema, estimar órdenes de magnitud, mirar el sistema completo, desconfiar de los propios sesgos y concentrar el esfuerzo donde más rinde.</p><p>No depende de saber más fórmulas, sino de hábitos que se pueden practicar.</p>",
  fxT:"Herramientas de pensamiento (este tema no se apoya en fórmulas)",
  fxH:table(["Herramienta", "Pregunta que responde", "Cómo se aplica"], [
    ["Primeros principios", "¿Qué es cierto con seguridad?", "Separa los hechos de los supuestos heredados y razona desde los hechos."],
    ["Árbol MECE", "¿Qué partes tiene el problema?", "Divide en ramas sin superposición y sin vacíos."],
    ["Estimación de Fermi", "¿Cuál es el orden de magnitud?", "Multiplica cantidades razonables y declara cada supuesto."],
    ["Pensamiento sistémico", "¿Qué efectos indirectos habrá?", "Dibuja las relaciones y los ciclos de retroalimentación."],
    ["80/20", "¿Dónde está el mayor efecto?", "Ordena las causas de mayor a menor y actúa primero en las pocas que explican la mayor parte."]]),
  met:"<p><b>Cómo enfrentar un problema nuevo.</b></p>" + q9ol([
    "Escribe el problema en una frase, con un indicador medible.",
    "Descomponlo en un árbol MECE de posibles causas o componentes.",
    "Estima el orden de magnitud de cada rama para saber cuáles importan.",
    "Busca datos para las ramas grandes; descarta las pequeñas.",
    "Revisa tus sesgos: ¿qué evidencia te haría cambiar de opinión?",
    "Propón una acción, pruébala en pequeño y mide."]),
  ejB:["estimar el consumo de agua de un edificio", "<p>¿Cuántos litros de agua usa al día un edificio de 80 departamentos? Supuestos declarados: 3 personas por departamento y 150 litros por persona al día.</p><p>80 × 3 × 150 = <b>36.000 litros por día</b> (36 m³). El valor exacto no importa; importa saber si el estanque debe ser de 5, 50 o 500 m³.</p>"],
  err:q9ul([
    "<b>Saltar a la solución</b> antes de entender el problema.",
    "<b>Buscar solo datos que confirman lo que ya crees</b> (sesgo de confirmación).",
    "<b>Esconder los supuestos</b> de una estimación: deben quedar escritos para poder revisarlos.",
    "<b>Repartir el esfuerzo por igual</b> entre todas las causas en vez de concentrarse en las principales.",
    "<b>Optimizar una parte</b> y empeorar el sistema completo."]),
  ejer:["<p>Estima cuántas horas al año pierde una planta por cambios de formato si hace 3 cambios por turno, trabaja 2 turnos al día y 250 días al año, y cada cambio dura 25 minutos.</p>",
    "Multiplica cambios por turno × turnos por día × días por año para obtener los cambios anuales.",
    "Multiplica por la duración y pasa los minutos a horas.",
    "<p>3 × 2 × 250 = 1.500 cambios al año. 1.500 × 25 = 37.500 minutos = <b>625 horas al año</b>. Reducir cada cambio a 10 minutos (SMED) liberaría 375 horas.</p>"]
};

T2["ruta-pro"] = {
  def:"<p>La <b>ruta para ser pro</b> es un plan de 12 meses para pasar de conocer los conceptos a aplicarlos con soltura en el trabajo. Avanza por bloques de dos meses: herramientas base, terreno (gemba), datos y variación, lenguaje de datos, modelos para decidir y, al final, un proyecto que demuestre lo aprendido.</p>",
  fxT:"Estructura del plan (este tema no se apoya en fórmulas)",
  fxH:"<p>Cada bloque de dos meses sigue el mismo ciclo:</p>" + q9ol(["<b>Aprender</b> el concepto (lección y fórmula).", "<b>Practicar</b> con la calculadora o el simulador de la app.", "<b>Aplicar</b> a un caso real o del trabajo.", "<b>Mostrar</b> el resultado en una página: problema, método, cifra y conclusión."]) + "<p>Regla práctica: al menos 70 % del tiempo en practicar y aplicar, y no más de 30 % en leer.</p>",
  met:"<p><b>Cómo seguir la ruta sin abandonarla.</b></p>" + q9ol([
    "Define cuántas horas por semana puedes dedicar de verdad (por ejemplo, 4) y en qué días.",
    "Elige el bloque que corresponde y anota su meta concreta.",
    "Cada semana termina algo visible: un cálculo, un diagrama, una planilla.",
    "Al cierre de cada bloque, escribe una página con lo que aplicaste.",
    "Si te atrasas, reduce el alcance del bloque en vez de saltártelo.",
    "Al final del año, reúne las páginas en un portafolio."]),
  ejB:["una semana del bloque «datos y variación»", "<p>Meta del bloque: interpretar la variación de un proceso.</p>" + q9ul(["Lunes (1 h): lección de estadística descriptiva.", "Miércoles (1 h): calculadora de descriptiva con datos de ejemplo.", "Sábado (2 h): tomar 30 tiempos reales de un proceso cotidiano y calcular media, desviación y rango.", "Producto de la semana: histograma con una conclusión en una frase."])],
  err:q9ul([
    "<b>Planificar más horas de las que existen:</b> el plan se abandona en dos semanas.",
    "<b>Leer sin practicar:</b> se entiende, pero no se logra aplicar.",
    "<b>Saltar bloques</b> por parecer fáciles: la base sostiene lo que viene después.",
    "<b>No dejar evidencia</b> de lo aplicado: el portafolio es lo que demuestra el avance.",
    "<b>Comparar tu avance con el de otros</b> en vez de con tu propio punto de partida."]),
  ejer:["<p>Tienes 5 horas a la semana durante el bloque «decidir con modelos» (8 semanas). Reparte las horas para que al final tengas un caso resuelto de programación lineal aplicado a algo real.</p>",
    "Aplica la regla de no más de 30 % del tiempo en leer.",
    "Reserva las últimas semanas para el caso real y su página de resultados.",
    "<p>Una propuesta: semanas 1 y 2 (lección y método gráfico, 1,5 h de lectura y 3,5 h de práctica); semanas 3 a 5 (calculadora y Solver con ejemplos, 5 h de práctica); semanas 6 a 8 (modelar un caso real y escribir la página). Total: 40 h, con unas 3 h de lectura (menos de 30 %).</p>"]
};

T2["casos-integrados"] = {
  def:"<p>Un <b>caso integrado</b> es un problema real de empresa que no pertenece a una sola área: un atraso de entregas puede tener causas en capacidad, inventario, calidad y planificación al mismo tiempo. Resolverlo exige combinar herramientas de varias áreas.</p>",
  con:q9ul(["<b>Síntoma y causa:</b> lo que se observa (atrasos, quiebres, colas) casi nunca es la causa.", "<b>Indicador:</b> la cifra que muestra el problema y que debe mejorar (cumplimiento, nivel de servicio, tiempo de espera).", "<b>Restricción:</b> el recurso que limita el sistema completo.", "<b>Alternativas:</b> al menos dos soluciones comparadas con el mismo criterio.", "<b>Evaluación económica:</b> lo que cuesta y lo que ahorra cada alternativa.", "<b>Recomendación:</b> una decisión concreta con plazo y responsable."]),
  fxT:"Qué herramienta usar según el síntoma",
  fxH:table(["Síntoma", "Herramientas", "Dónde practicar"], [
    ["Atrasos en entregas", "Capacidad, cuello de botella, OEE, secuenciación", "OEE y capacidad; Secuenciación"],
    ["Inventario alto y quiebres a la vez", "Clasificación ABC, EOQ, stock de seguridad", "ABC; EOQ; Stock de seguridad"],
    ["Clientes esperando", "Teoría de colas, dotación por turno", "Teoría de colas"],
    ["Reparar o reemplazar", "VAN, CAUE, vida económica", "CAUE; Vida económica"],
    ["Defectos repetidos", "Pareto, Ishikawa, gráficos de control", "Pareto; Ishikawa; Gráficos X̄-R"]]),
  met:"<p><b>Cómo resolver un caso integrado.</b></p>" + q9ol([
    "Escribe el síntoma con una cifra (el indicador actual).",
    "Haz un árbol de causas posibles y busca datos para las principales.",
    "Identifica la restricción del sistema.",
    "Plantea al menos dos alternativas de solución.",
    "Evalúa cada una con la herramienta adecuada y con su costo y beneficio.",
    "Recomienda una, con plan de implementación e indicador de seguimiento."]),
  err:q9ul([
    "<b>Atacar el síntoma</b> (más horas extra, más inventario) sin buscar la causa.",
    "<b>Usar una sola herramienta</b> para un problema que tiene varias causas.",
    "<b>Recomendar sin cifras</b> de costo y beneficio.",
    "<b>Mejorar un recurso que no es la restricción.</b>",
    "<b>Olvidar cómo se medirá</b> si la solución funcionó."]),
  ejer:["<p>Una distribuidora tiene quiebres frecuentes en un producto clase A cuya demanda diaria tiene desviación estándar de 20 unidades y un plazo de reposición de 4 días. Hoy no tiene stock de seguridad. Propón cuánto stock de seguridad mantener para un nivel de servicio de 95 % (z ≈ 1,65).</p>",
    "El stock de seguridad con demanda variable y plazo fijo es SS = z × σ<sub>d</sub> × √L.",
    "Calcula √4 y multiplica.",
    "<p>SS = 1,65 × 20 × √4 = <b>66 unidades</b>. El punto de pedido debe subir en esas 66 unidades sobre la demanda esperada durante el plazo. Revisa además si el inventario alto de otros productos (clase C) libera el capital para financiarlo.</p>"]
};
