/* ============ COMPLETAR TEMAS · LOTE 1: FUNDAMENTOS (bloques pendientes) ============
   Registro T2 parcial: solo se agregan los bloques que faltaban; el resto del tema se conserva. */
const apl = (t, h) => '<div class="c-ex"><div class="c-h">Aplicación rápida · ' + t + "</div>" + h + "</div>";

T2["fund-costos"] = {
  met:"<p><b>Cómo calcular el costo de un producto y usarlo para decidir.</b></p>" + q9ol([
    "Reúne los costos del período y sepáralos en <b>directos</b> (materia prima directa, MPD; mano de obra directa, MOD) e <b>indirectos</b> (costos indirectos de fabricación, CIF).",
    "Clasifica cada costo según su comportamiento: <b>variable</b> (cambia con el volumen) o <b>fijo</b> (no cambia dentro del rango normal de operación).",
    "Calcula el costo unitario de producción: (MPD + MOD + CIF) ÷ unidades producidas.",
    "Calcula el margen de contribución unitario: precio − costo variable unitario.",
    "Calcula el punto de equilibrio: costos fijos ÷ margen de contribución unitario.",
    "Para decidir (pedido especial, comprar o fabricar, cerrar una línea) usa solo los <b>costos relevantes</b>: los que cambian entre alternativas."]) +
    apl("costo unitario y punto de equilibrio", "<p>Un mes: MPD $ 1.200.000, MOD $ 800.000 (ambas variables) y CIF fijos $ 600.000; se producen 2.000 unidades y se venden a $ 1.500.</p>" + q9ul([
      "Costo unitario = (1.200.000 + 800.000 + 600.000) ÷ 2.000 = <b>$ 1.300</b>.",
      "Costo variable unitario = 2.000.000 ÷ 2.000 = $ 1.000; margen de contribución = 1.500 − 1.000 = <b>$ 500</b> por unidad.",
      "Punto de equilibrio = 600.000 ÷ 500 = <b>1.200 unidades</b> al mes."])),
  err:q9ul([
    "<b>Usar el costo unitario total para decidir un pedido especial.</b> El costo fijo prorrateado no cambia si se acepta el pedido; compara el precio con el costo variable (y los costos extra que genere el pedido).",
    "<b>Tratar el costo fijo por unidad como constante.</b> Con CIF de $ 600.000, a 2.000 unidades son $ 300 por unidad y a 1.000 unidades son $ 600.",
    "<b>Confundir utilidad con caja.</b> La depreciación reduce la utilidad, pero no es una salida de dinero en el período.",
    "<b>Suponer que la MOD siempre es variable.</b> Con sueldo mensual fijo, en el corto plazo se comporta como costo fijo.",
    "<b>Sumar el IVA al costo.</b> En una empresa que emite facturas afectas, el IVA de las compras es crédito fiscal y no forma parte del costo.",
    "<b>Incluir costos hundidos</b> (ya gastados y no recuperables) al comparar alternativas."])
};

T2["fund-economia"] = {
  met:"<p><b>Cómo evaluar una inversión, de principio a fin.</b></p>" + q9ol([
    "Define la decisión y la alternativa base (por ejemplo, seguir con el equipo actual) y el horizonte de evaluación.",
    "Construye el flujo de caja <b>incremental</b> de cada período: inversión, ingresos, costos, impuestos, capital de trabajo y valor residual.",
    "Elige la tasa de descuento en la misma unidad de tiempo que los períodos y con el mismo criterio que los flujos (ambos nominales o ambos reales).",
    "Calcula el VAN: suma de cada flujo dividido por (1 + i)<sup>t</sup>.",
    "Complementa con la TIR y el período de recuperación.",
    "Haz un análisis de sensibilidad: ¿qué pasa si las ventas bajan 10 % o la inversión sube 15 %?",
    "Decide: se acepta si VAN &gt; 0; entre alternativas excluyentes, la de mayor VAN (o menor CAUE si tienen vidas distintas)."]) +
    apl("VAN y TIR de una máquina", "<p>Inversión de $ 10.000.000 que ahorra $ 3.000.000 al año durante 5 años, con tasa de descuento de 10 % anual.</p>" + q9ul([
      "Factor de valor presente de una anualidad (10 %, 5 años) = [1 − 1,1<sup>−5</sup>] ÷ 0,1 = 3,7908.",
      "VAN = 3.000.000 × 3,7908 − 10.000.000 ≈ <b>$ 1.372.360</b> &gt; 0: conviene.",
      "TIR: tasa que hace VAN = 0 ≈ <b>15,2 %</b>, mayor que 10 %.",
      "Período de recuperación simple = 10.000.000 ÷ 3.000.000 ≈ 3,3 años."])),
  err:q9ul([
    "<b>Sumar pesos de fechas distintas</b> sin llevarlos a una misma fecha.",
    "<b>Mezclar unidades de tiempo:</b> tasa anual con flujos mensuales. Convierte con (1 + i<sub>anual</sub>)<sup>1/12</sup> − 1, no dividiendo por 12, cuando la tasa es efectiva.",
    "<b>Restar la depreciación como salida de caja.</b> Solo se usa para calcular el impuesto; después se vuelve a sumar.",
    "<b>Incluir costos hundidos</b> (estudios ya pagados) o <b>olvidar el capital de trabajo</b> y su recuperación al final.",
    "<b>Descontar flujos nominales con una tasa real</b> (o al revés).",
    "<b>Comparar con VAN alternativas de vidas distintas</b> sin igualarlas; usa CAUE o un horizonte común.",
    "<b>Confiar solo en la TIR:</b> con flujos que cambian de signo más de una vez puede haber varias TIR, y entre alternativas excluyentes la de mayor TIR no siempre es la de mayor VAN."])
};

T2["fund-io"] = {
  err:q9ul([
    "<b>Mezclar unidades en una restricción</b> (horas con minutos, kilos con toneladas). Cada término de una restricción debe estar en la misma unidad que el lado derecho.",
    "<b>Olvidar la no negatividad</b> o definir variables sin unidad ni período («x = pan» en vez de «kilos de pan al día»).",
    "<b>Redondear una solución continua</b> cuando las variables deben ser enteras: el resultado puede ser infactible o no óptimo; usa programación entera.",
    "<b>Usar un precio sombra fuera de su rango de validez:</b> solo vale mientras el lado derecho se mueva dentro del rango de sensibilidad.",
    "<b>Aplicar M/M/1 con ρ ≥ 1:</b> la cola crece sin límite; primero hay que aumentar la capacidad.",
    "<b>Creer en el modelo sin validarlo:</b> compara sus resultados con datos reales de algunos períodos antes de decidir."])
};

T2["fund-operaciones"] = {
  met:"<p><b>Cómo dimensionar una línea de producción.</b></p>" + q9ol([
    "Define la demanda del período (unidades por turno o por día).",
    "Calcula el tiempo disponible neto: turno menos colación, pausas y paradas planificadas.",
    "Calcula el <b>takt time</b> = tiempo disponible ÷ demanda: el ritmo al que debe salir cada unidad.",
    "Mide el tiempo de cada tarea y suma el contenido de trabajo (Σt).",
    "Calcula el número mínimo de estaciones = Σt ÷ takt, redondeado <b>hacia arriba</b>.",
    "Asigna las tareas a estaciones respetando precedencias, sin que ninguna supere el takt.",
    "Calcula la eficiencia = Σt ÷ (estaciones × takt) e identifica el cuello de botella (la estación más cargada)."]) +
    apl("takt time y estaciones", "<p>Turno con 7,5 h efectivas (27.000 s), demanda de 450 unidades y contenido de trabajo de 210 s por unidad.</p>" + q9ul([
      "Takt = 27.000 ÷ 450 = <b>60 s</b> por unidad.",
      "Estaciones mínimas = 210 ÷ 60 = 3,5 → <b>4 estaciones</b>.",
      "Eficiencia con 4 estaciones = 210 ÷ (4 × 60) = <b>87,5 %</b>."])),
  err:q9ul([
    "<b>Confundir takt time con tiempo de ciclo.</b> El takt lo fija la demanda; el tiempo de ciclo lo fija el proceso. Se necesita ciclo ≤ takt.",
    "<b>Usar el turno completo como tiempo disponible</b> sin descontar colación, pausas y paradas planificadas.",
    "<b>Redondear hacia abajo el número de estaciones o personas:</b> con 3,5 se necesitan 4.",
    "<b>Mejorar una operación que no es el cuello de botella:</b> la producción total no cambia.",
    "<b>Planificar con la capacidad de diseño</b> en vez de la capacidad efectiva (con mantenciones, cambios y mermas).",
    "<b>Usar un pronóstico sin medir su error</b> (MAD, MAPE) ni revisarlo cuando la demanda cambia."])
};

T2["fund-proyectos"] = {
  met:"<p><b>Cómo llevar un proyecto desde la idea hasta el cierre.</b></p>" + q9ol([
    "<b>Iniciar:</b> acta del proyecto con objetivo medible, alcance (qué incluye y qué no), patrocinador y restricciones.",
    "<b>Alcance:</b> EDT con los entregables, desglosados hasta paquetes de trabajo que se puedan estimar y asignar.",
    "<b>Tiempo:</b> lista de actividades, duraciones y precedencias; calcula la ruta crítica (CPM) y las holguras; dibuja la carta Gantt.",
    "<b>Costos y recursos:</b> presupuesto por paquete de trabajo; la suma acumulada en el tiempo es la línea base (PV).",
    "<b>Riesgos:</b> identifica, evalúa probabilidad × impacto y define una respuesta y un responsable para los principales.",
    "<b>Controlar:</b> cada semana o mes mide el valor ganado (EV) y el costo real (AC); calcula CPI = EV ÷ AC y SPI = EV ÷ PV.",
    "<b>Cerrar:</b> entrega formal, aceptación del cliente y lecciones aprendidas."]) +
    apl("valor ganado", "<p>Presupuesto total (BAC) $ 100 millones. A la fecha: PV = 40, EV = 32 y AC = 36 (millones de $).</p>" + q9ul([
      "CPI = 32 ÷ 36 = <b>0,89</b>: por cada $ 1 gastado se logra $ 0,89 de trabajo (sobrecosto).",
      "SPI = 32 ÷ 40 = <b>0,80</b>: se ha avanzado el 80 % de lo planificado (atraso).",
      "Costo estimado al término, si sigue igual: EAC = BAC ÷ CPI = 100 ÷ 0,889 ≈ <b>$ 112,5 millones</b>."])),
  err:q9ul([
    "<b>Partir sin alcance acordado por escrito:</b> después cada cambio se discute sin base.",
    "<b>Armar la EDT con actividades en vez de entregables</b> o mezclar niveles de detalle.",
    "<b>Medir el avance por tiempo transcurrido o por dinero gastado.</b> El avance real es el valor ganado (trabajo terminado).",
    "<b>Confundir AC con EV:</b> gastar el 50 % del presupuesto no significa llevar el 50 % del proyecto.",
    "<b>Vigilar solo la ruta crítica:</b> una actividad que consume toda su holgura se vuelve crítica.",
    "<b>Aceptar cambios de alcance sin control de cambios</b> (sin evaluar su efecto en plazo y costo).",
    "<b>Planificar sin reserva de contingencia</b> para los riesgos identificados."])
};

T2["fund-seguridad"] = {
  def:"<p>La <b>seguridad y salud en el trabajo</b> (SST) es la disciplina que identifica, evalúa y controla los peligros del trabajo para prevenir accidentes y enfermedades profesionales. En la empresa se integra con la gestión ambiental, que controla los impactos de la operación sobre el entorno (emisiones, residuos, agua, energía).</p><p>En Chile, la base legal es la <b>Ley 16.744</b> sobre accidentes del trabajo y enfermedades profesionales, junto con sus decretos reglamentarios (<i>verificar la normativa complementaria vigente</i>). El ingeniero industrial participa diseñando procesos y puestos de trabajo seguros, evaluando riesgos y midiendo el desempeño con indicadores.</p>",
  met:"<p><b>Cómo gestionar los riesgos de un área de trabajo.</b></p>" + q9ol([
    "Lista los procesos y tareas del área, incluidas las <b>no rutinarias</b> (mantención, limpieza, emergencias).",
    "Identifica los peligros de cada tarea (mecánicos, eléctricos, químicos, físicos, ergonómicos, psicosociales).",
    "Evalúa cada riesgo: probabilidad × consecuencia, con la escala definida por la empresa.",
    "Clasifica el riesgo (por ejemplo: tolerable, importante, intolerable) y prioriza.",
    "Define controles siguiendo la <b>jerarquía</b>: eliminación, sustitución, controles de ingeniería, controles administrativos y, al final, elementos de protección personal.",
    "Evalúa el riesgo residual, asigna responsables y plazos, y verifica que los controles funcionen.",
    "Mide resultados con indicadores (tasa de accidentabilidad, siniestralidad, índice de frecuencia) y actualiza el IPER ante cambios o accidentes."]) +
    apl("indicadores de una planta", "<p>Un año: 4 accidentes con tiempo perdido, 60 días perdidos, 250 trabajadores en promedio y 480.000 horas trabajadas.</p>" + q9ul([
      "Tasa de accidentabilidad = 4 ÷ 250 × 100 = <b>1,6 %</b>.",
      "Tasa de siniestralidad = 60 ÷ 250 × 100 = <b>24 días</b> perdidos por cada 100 trabajadores.",
      "Índice de frecuencia = 4 × 1.000.000 ÷ 480.000 ≈ <b>8,3</b> accidentes por millón de horas."])),
  err:q9ul([
    "<b>Confundir peligro con riesgo.</b> El peligro es la fuente de daño; el riesgo combina su probabilidad y su gravedad.",
    "<b>Partir por los elementos de protección personal.</b> Son el último control de la jerarquía; primero se busca eliminar o aislar el peligro.",
    "<b>Hacer el IPER solo de tareas rutinarias</b> y olvidar mantención, limpieza y emergencias.",
    "<b>No actualizar la matriz</b> después de un cambio de proceso, de equipo o de un accidente.",
    "<b>Calcular las tasas con la dotación de fin de año</b> en vez del promedio de trabajadores del período.",
    "<b>Cerrar una investigación culpando al trabajador</b> sin buscar la causa raíz en el método, el equipo o la organización.",
    "<b>Mirar solo los accidentes</b> e ignorar las exposiciones crónicas que causan enfermedades profesionales (ruido, sílice, posturas)."])
};

T2["fund-trabajo"] = {
  err:q9ul([
    "<b>Medir antes de estandarizar el método.</b> Primero se define y documenta la mejor forma de hacer la tarea; después se cronometra.",
    "<b>Cronometrar a un operario no representativo</b> (novato, muy rápido o que sabe que lo observan y cambia su ritmo) sin aplicar la valoración del ritmo.",
    "<b>Aplicar los suplementos sobre el tiempo observado.</b> Se aplican sobre el tiempo normal: TN = TO × valoración; TE = TN × (1 + suplementos).",
    "<b>Tomar pocas observaciones</b> sin calcular cuántas se necesitan para la precisión buscada.",
    "<b>Promediar elementos extraños</b> (interrupciones, fallas, conversaciones) dentro de los ciclos normales.",
    "<b>Evaluar la carga física solo por el peso</b>, sin considerar frecuencia, postura, distancia y duración de la tarea."])
};
