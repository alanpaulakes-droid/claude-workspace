/* ============ PRUEBAS DEL 2.° TRIMESTRE (III): ejemplos explicados desde cero ============
   Para quien no sabe nada del tema: qué significa cada dato, qué se pide, cada paso con su porqué,
   la respuesta, cómo comprobarla y el error típico. El ejemplo anterior queda como «Versión resumida». */
(function(){
  /* cada frase o cálculo en su propia línea: es más fácil de seguir que una línea larga con «;» */
  const L = h => '<span class="x-l">' + String(h).replace(/(?<!\d);\s+/g, '</span><span class="x-l">').replace(/\.\s+(?=[A-ZÁÉÍÓÚÑ¿«(0-9])/g, '.</span><span class="x-l">').replace(/:\s+(?=[^.<]{0,70}=)/g, ':</span><span class="x-l x-calc">') + "</span>";
  const X = o => '<p class="x-case">' + o.t + "</p>" +
    '<p class="x-h">Lo que te dan (y qué significa cada dato)</p><dl class="deep-dl">' + o.d.map(v => "<dt>" + v[0] + "</dt><dd>" + v[1] + "</dd>").join("") + "</dl>" +
    '<p class="x-h">Lo que te piden</p><p>' + o.p + "</p>" +
    '<p class="x-h">Paso a paso</p><ol class="x-steps">' + o.s.map(v => "<li><b>" + v[0] + "</b>" + L(v[1]) + "</li>").join("") + "</ol>" +
    '<p class="x-r"><b>Respuesta:</b>' + L(o.r) + "</p>" +
    (o.c ? '<p class="x-h">Compruébalo</p><p>' + L(o.c) + "</p>" : "") +
    (o.o ? '<p class="x-h">Ojo con este error</p><p>' + L(o.o) + "</p>" : "");
  const set = (id, key, html) => { const c = COURSES.find(x => x.id === id); if (!c) return; const i = c.u.findIndex(u => u[0].indexOf(key) >= 0); if (i < 0) return; UZ[id] = UZ[id] || []; (UZ[id][i] = UZ[id][i] || {}).e0 = html; };
  const OP = "ramo-intro-optimizacion", QA = "ramo-quimica-ambiente";

  /* ======================= OPTIMIZACIÓN ======================= */
  set(OP, "desarrollo histórico", X({ t:"Una línea de envasado de jugos planificó envasar <b>10.000 botellas</b> en un turno usando <b>80 horas-hombre</b>. Al final del turno se envasaron <b>9.000 botellas</b> y se usaron <b>90 horas-hombre</b>.",
    d:[["Hora-hombre", "Una persona trabajando una hora. 10 personas durante 8 horas son 10 × 8 = 80 horas-hombre."], ["10.000 botellas", "La meta: lo que se quería lograr."], ["80 horas-hombre", "Los recursos que se pensaba usar."], ["9.000 botellas", "Lo que realmente se logró."], ["90 horas-hombre", "Los recursos que realmente se usaron."]],
    p:"Calcular la eficacia, la eficiencia, la efectividad y cuánto cambió la productividad.",
    s:[["Eficacia: ¿cumplí la meta?", "Se compara lo logrado con lo planificado, dividiendo: 9.000 ÷ 10.000 = 0,90. Para pasarlo a porcentaje se multiplica por 100: <b>90 %</b>. Se lee: «de cada 10 botellas que debía envasar, envasé 9»."],
      ["Eficiencia: ¿gasté lo justo?", "Se compara lo que debías gastar con lo que gastaste. Va arriba lo previsto y abajo lo usado: 80 ÷ 90 = 0,889 → <b>88,9 %</b>. Si hubieras usado justo 80 horas, darías 100 %; como usaste más, queda bajo 100 %."],
      ["Efectividad: ¿las dos cosas a la vez?", "Se multiplican la eficacia y la eficiencia escritas como decimales: 0,90 × 0,889 = 0,80 → <b>80 %</b>."],
      ["Productividad planificada", "Productividad es «cuánto produzco por cada unidad de recurso». Botellas ÷ horas: 10.000 ÷ 80 = 125 botellas por hora-hombre. Es decir, cada persona debía envasar 125 botellas por hora."],
      ["Productividad real", "9.000 ÷ 90 = 100 botellas por hora-hombre."],
      ["Cuánto cambió", "Variación = (nuevo − anterior) ÷ anterior = (100 − 125) ÷ 125 = −25 ÷ 125 = −0,20 → <b>−20 %</b>. El signo menos significa que bajó."]],
    r:"eficacia 90 %, eficiencia 88,9 %, efectividad 80 % y la productividad bajó 20 %.",
    c:"Si la eficacia y la eficiencia hubieran sido 100 %, la productividad real sería igual a la planificada (125). Como las dos quedaron bajo 100 %, tiene sentido que la productividad haya bajado.",
    o:"Dar vuelta la división de la eficiencia (90 ÷ 80 = 112,5 %). Una eficiencia sobre 100 % significaría que gastaste menos de lo previsto, y aquí gastaste más." }));

  set(OP, "Ideas de negocio", X({ t:"Quieres vender cajas de verduras a domicilio en Temuco. Cada caja se vende en <b>$ 15.000</b>. Por cada caja gastas <b>$ 9.000</b> (verduras, la caja y el reparto). Además, cada mes pagas <b>$ 1.800.000</b> fijos (arriendo de bodega, un sueldo y la aplicación).",
    d:[["Precio (P) = $ 15.000", "Lo que te paga el cliente por una caja."], ["Costo variable (CV) = $ 9.000", "Lo que gastas por cada caja que vendes. Se llama «variable» porque si vendes más cajas, gastas más; si no vendes ninguna, no lo gastas."], ["Costo fijo (CF) = $ 1.800.000", "Lo que pagas igual cada mes, vendas 0 o 1.000 cajas."]],
    p:"¿Cuántas cajas al mes tienes que vender para no perder plata (punto de equilibrio)? ¿Y cuánto ganas si vendes 400?",
    s:[["Lo que te queda por caja", "De los $ 15.000 que te pagan, $ 9.000 se van en la caja misma. Te quedan 15.000 − 9.000 = <b>$ 6.000</b>. Eso se llama <b>margen de contribución</b>: es lo que cada caja «aporta» para pagar los costos fijos."],
      ["Cuántas cajas para juntar los costos fijos", "Necesitas juntar $ 1.800.000 de a $ 6.000 por caja: 1.800.000 ÷ 6.000 = <b>300 cajas</b>. Esa es la fórmula Q* = CF ÷ (P − CV)."],
      ["Llévalo a algo concreto", "Un mes tiene unas 4 semanas: 300 ÷ 4 = 75 cajas por semana. Así puedes evaluar si es realista para tu barrio."],
      ["Si vendes 400 cajas", "Cada caja aporta $ 6.000: 6.000 × 400 = $ 2.400.000. A eso le restas los fijos: 2.400.000 − 1.800.000 = <b>$ 600.000 de utilidad</b>."]],
    r:"necesitas vender 300 cajas al mes para no perder. Con 400 cajas ganas $ 600.000.",
    c:"Con 300 cajas: ingresos 300 × 15.000 = $ 4.500.000. Costos: variables 300 × 9.000 = $ 2.700.000 más fijos $ 1.800.000 = $ 4.500.000. Ingresos menos costos = 0: ni ganas ni pierdes. ✔",
    o:"Dividir por el precio: 1.800.000 ÷ 15.000 = 120 cajas. Es un error porque olvida que cada caja también te cuesta $ 9.000." }));

  set(OP, "Objetivos SMART", X({ t:"Una panadería bota mucho pan. Hoy la <b>merma</b> es de <b>8 %</b>. El objetivo SMART es: «Reducir la merma de pan amasado de 8 % a 5 % en la sucursal Ñuñoa antes del 31 de marzo». En la primera semana se produjeron <b>1.250 kg</b> y quedaron <b>75 kg</b> sin vender.",
    d:[["Merma", "Lo que se pierde: pan que no se vende y se bota. Se mide en porcentaje de lo producido."], ["8 %", "La línea base: cómo estamos hoy. De cada 100 kg producidos, 8 kg se pierden."], ["5 %", "La meta: adónde queremos llegar."], ["1.250 kg y 75 kg", "Lo producido y lo perdido en la semana."]],
    p:"¿Cuál es la merma de esta semana y qué parte del camino hacia la meta ya se recorrió?",
    s:[["Revisa que el objetivo sea SMART", "<b>S</b>: dice qué (merma de pan amasado) y dónde (Ñuñoa). <b>M</b>: tiene números (de 8 % a 5 %). <b>A</b>: bajar 3 puntos es posible ajustando la producción. <b>R</b>: botar menos pan es plata ahorrada. <b>T</b>: tiene fecha (31 de marzo)."],
      ["Calcula la merma de la semana", "Perdido ÷ producido × 100 = 75 ÷ 1.250 × 100 = 0,06 × 100 = <b>6 %</b>."],
      ["Calcula el avance", "El camino completo es de 8 % a 5 %: son 3 puntos. Ya bajamos de 8 % a 6 %: son 2 puntos. Avance = 2 ÷ 3 = 0,67 → <b>67 %</b>. Con la fórmula: (actual − base) ÷ (meta − base) = (6 − 8) ÷ (5 − 8) = (−2) ÷ (−3) = 0,67 (menos dividido por menos da más)."],
      ["Interpreta con el semáforo", "Se definió antes: verde si la merma es 5 % o menos, amarillo entre 5 % y 7 %, rojo sobre 7 %. Con 6 %: <b>amarillo</b>, vamos bien pero falta."]],
    r:"la merma de la semana es 6 % y se ha recorrido el 67 % del camino hacia la meta.",
    c:"Si la merma estuviera en 8 %, el avance sería 0 %; si estuviera en 5 %, sería 100 %. El 6 % está entre ambos y más cerca de la meta, así que 67 % tiene sentido.",
    o:"Decir que bajar de 8 % a 6 % es «bajar 2 %». En realidad bajó <b>2 puntos porcentuales</b> (que es un 25 % menos de merma)." }));

  set(OP, "Modelación matemática", X({ t:"Una panadería hace <b>pan amasado</b> y <b>hallulla</b>. Gana $ 300 por kilo de amasado y $ 250 por kilo de hallulla. Cada día tiene <b>200 kg de harina</b> y <b>16 horas de horno</b>. Un kilo de amasado usa 0,6 kg de harina y 0,04 horas de horno. Un kilo de hallulla usa 0,5 kg de harina y 0,05 horas de horno.",
    d:[["$ 300 y $ 250", "Ganancia por cada kilo vendido de cada pan."], ["200 kg de harina", "Todo lo que hay por día. No se puede usar más."], ["16 horas de horno", "Todo el tiempo de horno disponible al día."], ["0,6 kg de harina por kilo", "Para hacer 1 kg de amasado se gastan 0,6 kg de harina (el resto del peso es agua, levadura y grasa)."], ["0,04 horas de horno por kilo", "Cada kilo de amasado ocupa el horno 0,04 horas, es decir, 0,04 × 60 = 2,4 minutos."]],
    p:"Escribir el modelo matemático (no resolverlo todavía).",
    s:[["Elige las variables: ¿qué decido?", "Decido cuántos kilos hacer de cada pan. Les pongo nombre: <b>x₁</b> = kilos de amasado por día y <b>x₂</b> = kilos de hallulla por día. Una variable es como una caja vacía donde después va el número que más convenga. El «₁» y el «₂» solo sirven para distinguirlas."],
      ["Escribe la función objetivo: ¿qué quiero lograr?", "Ganar lo más posible. Si hago x₁ kilos de amasado, gano 300 × x₁ (por ejemplo, 10 kg dan $ 3.000). Lo mismo con la hallulla: 250 × x₂. La ganancia total, que se llama Z, es la suma: <b>máx Z = 300x₁ + 250x₂</b>. «máx» significa «hacer lo más grande posible». «300x₁» significa 300 multiplicado por x₁."],
      ["Escribe la restricción de harina: ¿qué me limita?", "Harina que uso: cada kilo de amasado gasta 0,6 kg, entonces x₁ kilos gastan 0,6x₁; la hallulla gasta 0,5x₂. Lo que uso no puede pasar lo que tengo: <b>0,6x₁ + 0,5x₂ ≤ 200</b>. El símbolo ≤ se lee «menor o igual que»."],
      ["Escribe la restricción de horno", "Mismo razonamiento con las horas: <b>0,04x₁ + 0,05x₂ ≤ 16</b>."],
      ["Agrega la no negatividad", "No se pueden hacer kilos negativos: <b>x₁ ≥ 0, x₂ ≥ 0</b> (≥ se lee «mayor o igual que»)."],
      ["Prueba el modelo con números inventados", "Si hago 100 kg de cada uno: harina 0,6 × 100 + 0,5 × 100 = 110 kg (cabe en 200 ✔); horno 0,04 × 100 + 0,05 × 100 = 9 h (cabe en 16 ✔); gano 300 × 100 + 250 × 100 = $ 55.000. Es posible, pero sobra harina y horno: el modelo sirve para buscar la mejor combinación."]],
    r:"máx Z = 300x₁ + 250x₂, sujeto a 0,6x₁ + 0,5x₂ ≤ 200 (harina); 0,04x₁ + 0,05x₂ ≤ 16 (horno); x₁ ≥ 0, x₂ ≥ 0.",
    c:"Revisa las unidades de cada restricción: en la de harina todo está en kilos de harina (0,6 kg por kilo × kilos = kilos); en la de horno todo está en horas.",
    o:"Poner lo disponible como coeficiente (200x₁…) o la ganancia en la restricción. Recuerda: en cada restricción, a la izquierda va «lo que uso» y a la derecha «lo que tengo»." }));

  set(OP, "Programación lineal y método gráfico", X({ t:"Una mueblería hace <b>mesas</b> (gana $ 20.000 cada una) y <b>sillas</b> ($ 15.000 cada una). Una mesa necesita 4 horas de carpintería y 2 de pintura; una silla, 2 de carpintería y 3 de pintura. A la semana hay <b>120 horas de carpintería</b> y <b>90 de pintura</b>. Modelo: máx Z = 20.000x₁ + 15.000x₂; 4x₁ + 2x₂ ≤ 120; 2x₁ + 3x₂ ≤ 90; x₁, x₂ ≥ 0.",
    d:[["x₁ y x₂", "Mesas y sillas por semana. En el gráfico, x₁ va en el eje horizontal y x₂ en el vertical."], ["4x₁ + 2x₂ ≤ 120", "Horas de carpintería usadas por mesas y sillas: no pueden pasar 120."], ["2x₁ + 3x₂ ≤ 90", "Horas de pintura: no pueden pasar 90."], ["Z", "La utilidad total que queremos que sea máxima."]],
    p:"¿Cuántas mesas y sillas hacer para ganar lo máximo?",
    s:[["Dibuja la recta de carpintería", "Para dibujar el borde se cambia ≤ por =: 4x₁ + 2x₂ = 120. Se buscan dos puntos fáciles. Si no hago sillas (x₂ = 0): 4x₁ = 120 → x₁ = 120 ÷ 4 = 30. Punto (30, 0). Si no hago mesas (x₁ = 0): 2x₂ = 120 → x₂ = 60. Punto (0, 60). Se unen con una recta."],
      ["¿Qué lado de la recta sirve?", "Pruebo el punto (0, 0): 4 × 0 + 2 × 0 = 0, y 0 ≤ 120 es cierto. Entonces sirve el lado donde está el origen (abajo de la recta)."],
      ["Dibuja la recta de pintura", "2x₁ + 3x₂ = 90. Con x₂ = 0: x₁ = 45 → (45, 0). Con x₁ = 0: x₂ = 30 → (0, 30). También sirve el lado del origen."],
      ["Marca la región factible", "Es la zona que queda bajo las dos rectas al mismo tiempo (y con x₁, x₂ positivos). Cualquier punto dentro es un plan de producción posible."],
      ["Encuentra las esquinas (vértices)", "(0, 0); (30, 0), porque más a la derecha la carpintería no alcanza (con 45 mesas se necesitarían 4 × 45 = 180 horas); (0, 30), porque más arriba no alcanza la pintura; y el punto donde se cruzan las dos rectas."],
      ["Calcula el cruce de las rectas", "Hay que resolver juntas 4x₁ + 2x₂ = 120 y 2x₁ + 3x₂ = 90. Multiplica la segunda por 2 para que x₁ tenga el mismo número: 4x₁ + 6x₂ = 180. Réstale la primera: (4x₁ − 4x₁) + (6x₂ − 2x₂) = 180 − 120 → 4x₂ = 60 → x₂ = 15. Reemplaza en la primera: 4x₁ + 2 × 15 = 120 → 4x₁ = 90 → x₁ = 22,5. Cruce: (22,5; 15)."],
      ["Evalúa la utilidad en cada esquina", "Z(0, 0) = $ 0. Z(30, 0) = 20.000 × 30 = $ 600.000. Z(0, 30) = 15.000 × 30 = $ 450.000. Z(22,5; 15) = 20.000 × 22,5 + 15.000 × 15 = 450.000 + 225.000 = <b>$ 675.000</b>."],
      ["Elige la mejor", "La mayor utilidad está en (22,5; 15). El óptimo siempre está en una esquina, por eso basta revisar las esquinas."]],
    r:"22,5 mesas y 15 sillas por semana (45 mesas cada dos semanas), con una utilidad de $ 675.000.",
    c:"Carpintería: 4 × 22,5 + 2 × 15 = 90 + 30 = 120 horas (justo lo disponible). Pintura: 2 × 22,5 + 3 × 15 = 45 + 45 = 90 horas (justo). Se usan completos los dos recursos: por eso no se puede ganar más.",
    o:"Elegir (45, 0) o (0, 60): son cortes de una recta con el eje, pero no cumplen la otra restricción. Antes de evaluar Z, verifica que el punto cumpla todas las restricciones." }));

  set(OP, "Solver de Excel", X({ t:"Resolviste la mueblería con Solver: 22,5 mesas, 15 sillas, utilidad $ 675.000. El <b>informe de sensibilidad</b> dice: precio sombra de carpintería = <b>$ 3.750</b> por hora y de pintura = <b>$ 2.500</b> por hora. Un taller vecino te ofrece horas extra de carpintería a $ 3.000 la hora.",
    d:[["Solver", "Herramienta de Excel que encuentra el óptimo: tú le dices qué celdas puede cambiar (las variables), qué celda maximizar (la utilidad) y qué límites respetar (las restricciones)."], ["Precio sombra", "Cuánto aumentaría la utilidad si tuvieras <b>una hora más</b> de ese recurso. Es lo máximo que te conviene pagar por esa hora extra."], ["$ 3.000", "Lo que cuesta cada hora extra ofrecida."]],
    p:"¿Conviene comprar horas extra de carpintería a $ 3.000?",
    s:[["Cómo se arma en Excel", "Celdas B2 y C2: las cantidades de mesas y sillas (Solver las cambia). D3: la utilidad = SUMAPRODUCTO de cantidades por utilidades unitarias. En otras celdas, las horas usadas de carpintería y pintura. En Solver: objetivo D3, «Máx», celdas variables B2:C2, restricciones horas usadas ≤ horas disponibles, método «Simplex LP»."],
      ["Lee el precio sombra", "Una hora más de carpintería aumenta la utilidad en $ 3.750."],
      ["Compara con el costo", "Ganas $ 3.750 y pagas $ 3.000: te quedan 3.750 − 3.000 = <b>$ 750</b> por hora. Conviene."],
      ["¿Y si costara $ 4.000?", "3.750 − 4.000 = −$ 250: perderías plata. No conviene."],
      ["Ojo con el límite", "El precio sombra vale solo dentro de un rango (el informe lo muestra como «aumento permitido»). Si compras demasiadas horas, la pintura se vuelve el límite y la hora extra de carpintería deja de valer $ 3.750."]],
    r:"sí conviene, porque cada hora extra a $ 3.000 aumenta la utilidad en $ 3.750 (ganancia neta de $ 750 por hora), dentro del rango permitido.",
    c:"El precio sombra solo es positivo si el recurso se usa completo. Aquí las 120 horas de carpintería se usan todas (vimos que la restricción está «activa»), así que tiene sentido que una hora más valga algo.",
    o:"Confundir el precio sombra con el precio de mercado de la hora. Es cuánto <b>vale para ti</b> una hora más, no cuánto cuesta." }));

  set(OP, "Elementos y tipos de modelos", X({ t:"Una empresa de alimentos tiene dos plantas: <b>Rancagua</b> (puede enviar 300 t) y <b>Talca</b> (200 t). Debe abastecer <b>Santiago</b> (250 t), <b>Concepción</b> (150 t) y <b>Valparaíso</b> (100 t). Flete por tonelada: Rancagua → Santiago $ 8.000, → Concepción $ 20.000, → Valparaíso $ 15.000; Talca → Santiago $ 18.000, → Concepción $ 12.000, → Valparaíso $ 25.000.",
    d:[["Oferta", "Lo máximo que puede enviar cada planta (300 t y 200 t)."], ["Demanda", "Lo que necesita cada ciudad (250, 150 y 100 t)."], ["Costo por tonelada", "Lo que cuesta llevar una tonelada por esa ruta."], ["t", "Toneladas."]],
    p:"Plantear el modelo y encontrar un plan de envío de costo mínimo.",
    s:[["Revisa si está balanceado", "Oferta total 300 + 200 = 500 t. Demanda total 250 + 150 + 100 = 500 t. Son iguales: todo lo que se produce se envía."],
      ["Define una variable por ruta", "Hay 2 plantas y 3 ciudades: 2 × 3 = 6 rutas. Por ejemplo, <b>x<sub>RS</sub></b> = toneladas que van de Rancagua a Santiago. Igual x<sub>RC</sub>, x<sub>RV</sub>, x<sub>TS</sub>, x<sub>TC</sub>, x<sub>TV</sub>."],
      ["Función objetivo", "Costo total = suma de (costo de la ruta × toneladas por esa ruta): mín Z = 8.000x<sub>RS</sub> + 20.000x<sub>RC</sub> + 15.000x<sub>RV</sub> + 18.000x<sub>TS</sub> + 12.000x<sub>TC</sub> + 25.000x<sub>TV</sub>."],
      ["Restricciones de oferta", "Lo que sale de cada planta no puede pasar su capacidad: x<sub>RS</sub> + x<sub>RC</sub> + x<sub>RV</sub> ≤ 300 y x<sub>TS</sub> + x<sub>TC</sub> + x<sub>TV</sub> ≤ 200."],
      ["Restricciones de demanda", "A cada ciudad debe llegar lo que pide: x<sub>RS</sub> + x<sub>TS</sub> = 250; x<sub>RC</sub> + x<sub>TC</sub> = 150; x<sub>RV</sub> + x<sub>TV</sub> = 100. Y todas las x ≥ 0."],
      ["Arma un plan con sentido común", "Santiago es mucho más barato desde Rancagua ($ 8.000 contra $ 18.000): Rancagua envía las 250 t. Concepción es más barato desde Talca ($ 12.000): Talca envía 150 t. A Rancagua le quedan 300 − 250 = 50 t y a Talca 200 − 150 = 50 t: las dos van a Valparaíso."],
      ["Calcula el costo", "250 × 8.000 = 2.000.000; 150 × 12.000 = 1.800.000; 50 × 15.000 = 750.000; 50 × 25.000 = 1.250.000. Total = <b>$ 5.800.000</b>."]],
    r:"Rancagua envía 250 t a Santiago y 50 t a Valparaíso; Talca envía 150 t a Concepción y 50 t a Valparaíso; costo mínimo $ 5.800.000 (hay otro plan con el mismo costo).",
    c:"Sale de Rancagua 250 + 50 = 300 ✔; de Talca 150 + 50 = 200 ✔; llegan a Santiago 250 ✔, a Concepción 150 ✔ y a Valparaíso 50 + 50 = 100 ✔.",
    o:"Usar una sola variable por planta o por ciudad. En transporte siempre hay una variable por <b>cada ruta</b> (plantas × destinos)." }));

  set(OP, "Problemas típicos", X({ t:"Se hace alimento para animales mezclando <b>maíz</b> ($ 250 el kilo, 9 % de proteína) y <b>soya</b> ($ 450 el kilo, 44 % de proteína). El alimento debe tener <b>al menos 20 % de proteína</b> y costar lo menos posible.",
    d:[["9 % de proteína", "En cada kilo de maíz hay 0,09 kg de proteína (9 de cada 100 gramos)."], ["44 % de proteína", "En cada kilo de soya hay 0,44 kg de proteína."], ["al menos 20 %", "Cada kilo de mezcla debe tener 0,20 kg de proteína o más. «Al menos» se escribe con ≥."], ["m y s", "Las variables: qué parte de cada kilo de mezcla es maíz (m) y qué parte es soya (s). Por ejemplo, m = 0,7 significa 700 g de maíz en cada kilo."]],
    p:"¿Qué proporción de maíz y de soya usar para cumplir la proteína al menor costo?",
    s:[["Por qué m + s = 1", "Un kilo de mezcla está hecho solo de maíz y soya. Las dos partes juntas forman el kilo completo: m + s = 1. Por eso m = 1 − s."],
      ["Costo de un kilo de mezcla", "Cada parte cuesta su precio: C = 250m + 450s. Ejemplo: mitad y mitad (m = 0,5; s = 0,5) cuesta 125 + 225 = $ 350."],
      ["Proteína de un kilo de mezcla", "Cada parte aporta su porcentaje: proteína = 0,09m + 0,44s, y debe ser ≥ 0,20. Con mitad y mitad: 0,045 + 0,22 = 0,265 → 26,5 %. Cumple, pero sobra proteína y la soya es cara: quizás se puede usar menos soya."],
      ["Reemplaza m por 1 − s", "0,09 × (1 − s) + 0,44s ≥ 0,20. Multiplica el paréntesis: 0,09 − 0,09s + 0,44s ≥ 0,20. Junta las s: −0,09s + 0,44s = 0,35s. Queda 0,09 + 0,35s ≥ 0,20."],
      ["Despeja s", "Resta 0,09 a ambos lados: 0,35s ≥ 0,11. Divide ambos lados por 0,35: s ≥ 0,11 ÷ 0,35 = 0,314. Significa: la soya debe ser al menos 0,314 del kilo, es decir, 314 gramos."],
      ["Decide", "Como la soya es más cara, conviene usar justo lo mínimo: s = 0,314 y m = 1 − 0,314 = 0,686 (686 g de maíz)."],
      ["Calcula el costo", "250 × 0,686 + 450 × 0,314 = 171,5 + 141,3 = <b>$ 312,8 ≈ $ 313 por kilo</b>. Más barato que mitad y mitad ($ 350)."]],
    r:"en cada kilo, 686 g de maíz y 314 g de soya, con un costo de unos $ 313 por kilo.",
    c:"Proteína: 0,09 × 0,686 + 0,44 × 0,314 = 0,062 + 0,138 = 0,200 → justo 20 % ✔. Y m + s = 0,686 + 0,314 = 1 ✔.",
    o:"Mezclar porcentajes enteros con decimales (escribir 9m + 44s ≥ 0,20). Usa todo en decimales (0,09; 0,44; 0,20) o todo en porcentaje (9, 44, 20)." }));

  /* ======================= QUÍMICA ======================= */
  set(QA, "Materia, estequiometría", X({ t:"Una caldera quema gas natural (metano, CH₄). La reacción es <b>CH₄ + 2 O₂ → CO₂ + 2 H₂O</b>. ¿Cuánto CO₂ se produce al quemar <b>1 kg de metano</b>?",
    d:[["CH₄", "Una molécula de metano: 1 átomo de carbono (C) y 4 de hidrógeno (H). El número chico (subíndice) dice cuántos átomos hay."], ["O₂, CO₂, H₂O", "Oxígeno del aire, dióxido de carbono y agua."], ["El 2 delante de O₂", "Coeficiente: hacen falta 2 moléculas de oxígeno por cada molécula de metano."], ["Masas atómicas", "C = 12, H = 1, O = 16. Dicen cuánto «pesa» cada tipo de átomo."]],
    p:"La masa de CO₂ que se forma con 1 kg de metano.",
    s:[["Lee la ecuación como una receta", "«1 metano + 2 oxígenos → 1 CO₂ + 2 aguas». Por cada molécula de metano que se quema, sale 1 molécula de CO₂."],
      ["Entiende el mol", "Las moléculas son demasiado pequeñas para contarlas una a una, así que se cuentan en paquetes llamados <b>mol</b> (como una «docena», pero de 6,022 × 10²³ unidades). La receta vale igual en moles: 1 mol de metano da 1 mol de CO₂."],
      ["Calcula cuánto pesa un mol (masa molar)", "Se suman los átomos: CH₄ = 12 + 4 × 1 = <b>16 g/mol</b> (un mol de metano pesa 16 g). CO₂ = 12 + 2 × 16 = <b>44 g/mol</b>."],
      ["Pasa los kilos a gramos y luego a moles", "1 kg = 1.000 g. Moles de metano = gramos ÷ masa molar = 1.000 ÷ 16 = <b>62,5 mol</b>."],
      ["Usa la receta", "1 mol de metano da 1 mol de CO₂, así que 62,5 mol de metano dan <b>62,5 mol de CO₂</b>."],
      ["Pasa los moles de CO₂ a gramos", "Gramos = moles × masa molar = 62,5 × 44 = 2.750 g = <b>2,75 kg</b>."]],
    r:"quemar 1 kg de metano produce 2,75 kg de CO₂.",
    c:"¿Cómo sale más masa (2,75 kg) de la que entró (1 kg)? Porque el CO₂ también lleva oxígeno que viene del aire. Entra: 1 kg de metano + 125 mol de O₂ × 32 g = 4 kg de oxígeno → 5 kg. Sale: 2,75 kg de CO₂ + 125 mol de agua × 18 g = 2,25 kg de agua → 5 kg. La masa se conserva ✔.",
    o:"Pensar que 1 kg de metano da 1 kg de CO₂. La ecuación relaciona <b>moles</b> (cantidad de moléculas), no kilos." }));

  set(QA, "Balanceo de ecuaciones", X({ t:"Balancea la combustión del propano (el gas licuado de los balones): <b>C₃H₈ + O₂ → CO₂ + H₂O</b>.",
    d:[["C₃H₈", "Propano: 3 carbonos y 8 hidrógenos."], ["Balancear", "Poner números delante de cada sustancia (coeficientes) para que haya la misma cantidad de cada tipo de átomo a la izquierda y a la derecha. Los átomos no se crean ni se destruyen: solo se reordenan."], ["Coeficiente", "Multiplica a toda la molécula: 3 CO₂ son 3 carbonos y 6 oxígenos."]],
    p:"Los coeficientes más pequeños (números enteros) que balancean la ecuación.",
    s:[["Cuenta los átomos de cada lado", "Izquierda: C = 3, H = 8, O = 2. Derecha: C = 1 (en CO₂), H = 2 (en H₂O), O = 2 + 1 = 3."],
      ["Balancea el carbono", "Hay 3 C a la izquierda y 1 a la derecha. Pon un 3 delante del CO₂: <b>3 CO₂</b> (ahora hay 3 C)."],
      ["Balancea el hidrógeno", "Hay 8 H a la izquierda. Cada H₂O tiene 2 H, así que necesitas 8 ÷ 2 = 4 aguas: <b>4 H₂O</b>."],
      ["Balancea el oxígeno al final", "Cuenta los O a la derecha: 3 CO₂ tienen 3 × 2 = 6 O; 4 H₂O tienen 4 × 1 = 4 O; total 10 O. Cada O₂ tiene 2 O, así que necesitas 10 ÷ 2 = 5: <b>5 O₂</b>."],
      ["Escribe la ecuación final", "C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O."]],
    r:"C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O.",
    c:"Izquierda: C 3, H 8, O 5 × 2 = 10. Derecha: C 3, H 4 × 2 = 8, O 6 + 4 = 10. Todo coincide ✔.",
    o:"Cambiar los números pequeños (subíndices), por ejemplo escribir H₂O₂ para «arreglar» el oxígeno. Eso cambia la sustancia (H₂O₂ es agua oxigenada). Solo se cambian los números grandes de adelante." }));

  set(QA, "Pesos atómicos y moleculares", X({ t:"En minería se usa mucho ácido sulfúrico, <b>H₂SO₄</b>. ¿Cuánto pesa un mol de ácido sulfúrico? ¿Cuántos moles hay en 196 g?",
    d:[["H₂SO₄", "2 átomos de hidrógeno, 1 de azufre (S) y 4 de oxígeno. Si no hay número, es 1."], ["Masas atómicas", "H = 1,008; S = 32,06; O = 16,00 (de la tabla periódica)."], ["g/mol", "Gramos por mol: cuánto pesa un paquete de 6,022 × 10²³ moléculas."]],
    p:"La masa molar del H₂SO₄ y los moles en 196 g.",
    s:[["Haz la lista de átomos", "H: 2; S: 1; O: 4."],
      ["Multiplica cada uno por su masa", "H: 2 × 1,008 = 2,016. S: 1 × 32,06 = 32,06. O: 4 × 16,00 = 64,00."],
      ["Suma", "2,016 + 32,06 + 64,00 = <b>98,08 g/mol</b>. Un mol de ácido sulfúrico pesa 98,08 g."],
      ["Calcula los moles en 196 g", "Moles = gramos ÷ masa molar = 196 ÷ 98,08 = <b>2,0 mol</b>."],
      ["Extra: ¿por qué el cloro pesa 35,45 y no un número redondo?", "Porque en la naturaleza hay dos tipos de átomos de cloro (isótopos): uno de 34,969 (el 75,76 %) y otro de 36,966 (el 24,24 %). La tabla muestra el <b>promedio ponderado</b>, como un promedio de notas con distinta ponderación: 34,969 × 0,7576 + 36,966 × 0,2424 = 26,49 + 8,96 = 35,45."]],
    r:"98,08 g/mol; en 196 g hay 2,0 mol.",
    c:"El oxígeno aporta 64 de los 98 g: tiene sentido, porque hay 4 oxígenos de 16 cada uno.",
    o:"Olvidar multiplicar por el subíndice: 1,008 + 32,06 + 16,00 = 49,07 está mal, porque hay 2 H y 4 O." }));

  set(QA, "Cantidades de reactivos y productos", X({ t:"Para fabricar amoníaco (usado en fertilizantes) se mezclan <b>28,0 g de nitrógeno (N₂)</b> y <b>9,0 g de hidrógeno (H₂)</b>. La reacción es <b>N₂ + 3 H₂ → 2 NH₃</b>. Al final se obtienen <b>25,0 g de NH₃</b>.",
    d:[["N₂ + 3 H₂ → 2 NH₃", "Receta: 1 nitrógeno con 3 hidrógenos forman 2 amoníacos."], ["Masas molares", "N₂ = 28,02 g/mol; H₂ = 2,016 g/mol; NH₃ = 17,03 g/mol."], ["Reactivo limitante", "El ingrediente que se acaba primero. Como en los sándwiches: si cada uno lleva 2 panes y 1 jamón, con 10 panes y 3 jamones solo haces 3 sándwiches; el jamón es el limitante."], ["Rendimiento", "Qué porcentaje de lo máximo posible realmente obtuviste."]],
    p:"¿Cuál es el reactivo limitante, cuánto amoníaco se podría obtener como máximo y cuál fue el rendimiento?",
    s:[["Pasa todo a moles", "N₂: 28,0 ÷ 28,02 = 1,00 mol. H₂: 9,0 ÷ 2,016 = 4,46 mol."],
      ["Compara con la receta", "Para 1,00 mol de N₂ la receta pide 3 × 1,00 = 3,00 mol de H₂. Tienes 4,46 mol: alcanza y sobra. Entonces el que se acaba primero es el N₂: <b>es el limitante</b>. Sobran 4,46 − 3,00 = 1,46 mol de H₂."],
      ["Calcula el máximo de producto", "Según la receta, 1 mol de N₂ da 2 mol de NH₃. Con 1,00 mol de N₂ salen 2,00 mol de NH₃ × 17,03 g/mol = <b>34,06 g</b>. Es el rendimiento teórico (lo máximo posible)."],
      ["Calcula el rendimiento", "Rendimiento = obtenido ÷ máximo × 100 = 25,0 ÷ 34,06 × 100 = <b>73,4 %</b>."]],
    r:"el limitante es el N₂; el máximo teórico es 34,06 g de NH₃ y el rendimiento fue 73,4 %.",
    c:"El rendimiento debe quedar entre 0 y 100 %. Si te da más de 100 %, calculaste el máximo con el reactivo equivocado.",
    o:"Elegir como limitante el que tiene menos gramos (aquí el H₂, con 9 g). Lo que importa son los <b>moles comparados con la receta</b>, no los gramos." }));

  set(QA, "Gases ideales", X({ t:"<b>Caso 1:</b> un compresor toma <b>10 L de aire a 1 atm</b> y lo comprime hasta <b>2,5 atm</b>, sin cambiar la temperatura. <b>Caso 2:</b> un globo de <b>2,0 L a 27 °C</b> se calienta hasta <b>127 °C</b>, sin cambiar la presión.",
    d:[["atm", "Atmósfera: unidad de presión. 1 atm es la presión del aire a nivel del mar."], ["L", "Litros, unidad de volumen."], ["Temperatura constante", "La temperatura no cambia: se usa la ley de Boyle (P₁ × V₁ = P₂ × V₂)."], ["Presión constante", "La presión no cambia: se usa la ley de Charles (V₁ ÷ T₁ = V₂ ÷ T₂)."], ["Kelvin (K)", "Escala de temperatura que parte del cero absoluto. K = °C + 273 (con más precisión, 273,15). En las leyes de los gases la temperatura siempre va en kelvin."]],
    p:"El volumen final en cada caso.",
    s:[["Caso 1: identifica la ley", "La temperatura no cambia, entonces es Boyle: P₁ × V₁ = P₂ × V₂. Los subíndices 1 y 2 significan «antes» y «después»."],
      ["Caso 1: despeja y calcula", "Quieres V₂. Divide ambos lados por P₂: V₂ = P₁ × V₁ ÷ P₂ = 1 × 10 ÷ 2,5 = <b>4 L</b>."],
      ["Caso 2: identifica la ley", "La presión no cambia, entonces es Charles: V₁ ÷ T₁ = V₂ ÷ T₂."],
      ["Caso 2: pasa a kelvin", "T₁ = 27 + 273 = 300 K. T₂ = 127 + 273 = 400 K."],
      ["Caso 2: despeja y calcula", "Multiplica ambos lados por T₂: V₂ = V₁ × T₂ ÷ T₁ = 2,0 × 400 ÷ 300 = <b>2,67 L</b>."]],
    r:"caso 1: 4 L; caso 2: 2,67 L.",
    c:"Caso 1: la presión subió 2,5 veces y el volumen bajó 2,5 veces (10 → 4) ✔. Caso 2: la temperatura absoluta subió de 300 a 400 K (un tercio más) y el volumen también subió un tercio (2 → 2,67) ✔.",
    o:"Usar grados Celsius: 2,0 × 127 ÷ 27 = 9,4 L. Un globo que pasa de 27 °C a 127 °C no se agranda casi 5 veces. Siempre pasa a kelvin." }));

  set(QA, "Atmósfera terrestre", X({ t:"Un relleno sanitario emite al año <b>500 toneladas de metano (CH₄)</b> y una fábrica de fertilizantes <b>2 toneladas de óxido nitroso (N₂O)</b>. ¿Cuánto calientan en total, expresado como CO₂ equivalente?",
    d:[["Gas de efecto invernadero", "Gas que atrapa calor en la atmósfera (CO₂, metano, óxido nitroso…)."], ["PCG (potencial de calentamiento global)", "Cuántas veces más calienta 1 kg de ese gas comparado con 1 kg de CO₂, en 100 años. Metano = 28; óxido nitroso = 265 (valores del IPCC, AR5)."], ["CO₂e (CO₂ equivalente)", "Una unidad común para poder sumar gases distintos: «cuánto CO₂ haría el mismo daño»."]],
    p:"Las emisiones totales en toneladas de CO₂ equivalente.",
    s:[["Convierte el metano", "Cada tonelada de metano calienta como 28 de CO₂: 500 × 28 = <b>14.000 t CO₂e</b>."],
      ["Convierte el óxido nitroso", "Cada tonelada calienta como 265 de CO₂: 2 × 265 = <b>530 t CO₂e</b>."],
      ["Suma", "14.000 + 530 = <b>14.530 t CO₂e</b>."]],
    r:"14.530 toneladas de CO₂ equivalente al año.",
    c:"Aunque se emitió 250 veces más metano que óxido nitroso, el N₂O aporta bastante (530 t) porque calienta mucho más por kilo. Sin pasar a CO₂e no se podrían comparar.",
    o:"Sumar directo 500 + 2 = 502 t. No se pueden sumar gases distintos sin multiplicar antes por su PCG." }));

  set(QA, "Contaminantes atmosféricos", X({ t:"Una caldera emite <b>500 kg/h de partículas</b>. Para limpiar los gases se instala primero un <b>ciclón (80 % de eficiencia)</b> y después un <b>filtro de mangas (99 %)</b>.",
    d:[["kg/h", "Kilos por hora: cuántas partículas salen cada hora."], ["Eficiencia de 80 %", "El equipo atrapa 80 de cada 100 kg que le llegan y deja pasar 20 (es decir, deja pasar la fracción 0,20)."], ["Eficiencia de 99 %", "Atrapa 99 de cada 100 y deja pasar 1 (fracción 0,01)."], ["En serie", "Uno después del otro: lo que sale del primero entra al segundo."]],
    p:"¿Cuántos kg/h salen finalmente a la atmósfera y cuál es la eficiencia total?",
    s:[["Lo que sale del ciclón", "Deja pasar el 20 %: 500 × 0,20 = <b>100 kg/h</b>."],
      ["Lo que sale del filtro", "Al filtro entran esos 100 kg/h y deja pasar el 1 %: 100 × 0,01 = <b>1 kg/h</b>."],
      ["Eficiencia total", "Se atraparon 500 − 1 = 499 kg/h de 500: 499 ÷ 500 × 100 = <b>99,8 %</b>. Con la fórmula: 1 − (0,20 × 0,01) = 1 − 0,002 = 0,998."]],
    r:"salen 1 kg/h a la atmósfera; la eficiencia total del sistema es 99,8 %.",
    c:"La eficiencia total debe ser mayor que la del mejor equipo solo (99 %) y menor que 100 %: 99,8 % ✔.",
    o:"Sumar las eficiencias (80 % + 99 % = 179 %). Una eficiencia nunca puede pasar de 100 %: se multiplican las fracciones que <b>pasan</b>." }));

  set(QA, "Combustión y emisiones", X({ t:"Una empresa de transporte con camiones propios consume <b>120.000 litros de diésel al año</b>. Cada litro quemado emite unos <b>2,7 kg de CO₂</b>.",
    d:[["Factor de emisión", "Cuánto CO₂ sale por cada unidad que se consume. Aquí, 2,7 kg de CO₂ por litro de diésel (un valor más preciso es 2,68; usa el oficial vigente en reportes)."], ["t", "Tonelada = 1.000 kg."]],
    p:"Las emisiones anuales de CO₂ de la flota.",
    s:[["Multiplica consumo por factor", "120.000 L × 2,7 kg/L = <b>324.000 kg de CO₂</b>. Los litros se cancelan y quedan kg."],
      ["Pasa a toneladas", "324.000 ÷ 1.000 = <b>324 t de CO₂</b>."],
      ["¿Dónde va en la huella?", "Son camiones propios que queman combustible: emisiones directas, <b>alcance 1</b>."]],
    r:"324 toneladas de CO₂ al año (alcance 1).",
    c:"Orden de magnitud: un auto particular gasta unos 1.000 L al año y emite unas 2,7 t. La flota gasta 120 veces más: 120 × 2,7 = 324 ✔.",
    o:"Olvidar pasar de kg a toneladas al reportar, o poner los camiones de una empresa contratada como alcance 1 (esos son alcance 3)." }));

  set(QA, "Energía en las reacciones", X({ t:"Un hotel calienta <b>1.000 litros de agua de 15 °C a 60 °C</b> con una caldera a gas natural (metano) de <b>85 % de eficiencia</b>. Datos: entalpías de formación (kJ/mol): CO₂ = −393,5; H₂O líquida = −285,8; CH₄ = −74,8; O₂ = 0.",
    d:[["Entalpía de formación (ΔH°f)", "Energía «guardada» en una sustancia comparada con sus elementos. Los elementos puros, como el O₂, valen 0."], ["ΔH de reacción", "Energía que se libera (si es negativa) o se absorbe (si es positiva) cuando ocurre la reacción. Δ (delta) significa «cambio»."], ["kJ y MJ", "Kilojoule y megajoule, unidades de energía. 1 MJ = 1.000 kJ."], ["Calor específico del agua (c = 4,184)", "Se necesitan 4,184 kJ para subir 1 °C la temperatura de 1 kg de agua."], ["85 % de eficiencia", "De cada 100 unidades de energía del gas, 85 llegan al agua y 15 se pierden por la chimenea."]],
    p:"La energía que libera el metano por kilo y cuántos kilos de gas se necesitan para calentar el agua.",
    s:[["Escribe la reacción", "CH₄ + 2 O₂ → CO₂ + 2 H₂O."],
      ["Suma la energía de los productos", "1 CO₂: −393,5. 2 H₂O: 2 × (−285,8) = −571,6. Total productos: −393,5 + (−571,6) = −965,1 kJ."],
      ["Suma la energía de los reactivos", "1 CH₄: −74,8. 2 O₂: 2 × 0 = 0. Total reactivos: −74,8 kJ."],
      ["Resta: productos menos reactivos", "ΔH = −965,1 − (−74,8). Restar un número negativo es lo mismo que sumarlo: −965,1 + 74,8 = <b>−890,3 kJ por mol</b>. Es negativo: la reacción libera calor (exotérmica)."],
      ["Pásalo a energía por kilo", "1 kg de metano son 1.000 ÷ 16 = 62,5 mol. Energía = 62,5 × 890,3 = 55.644 kJ ≈ <b>55,6 MJ por kg</b>."],
      ["Calcula la energía que necesita el agua", "q = m × c × ΔT, donde m es la masa (1.000 L de agua ≈ 1.000 kg) y ΔT es cuánto sube la temperatura (60 − 15 = 45 °C). q = 1.000 × 4,184 × 45 = 188.280 kJ = <b>188,3 MJ</b>."],
      ["Calcula el gas, considerando la eficiencia", "Cada kg de gas entrega 55,6 MJ, pero solo el 85 % llega al agua: 55,6 × 0,85 = 47,3 MJ útiles por kg. Gas = 188,3 ÷ 47,3 = <b>3,98 kg</b>."]],
    r:"el metano libera 890,3 kJ/mol (unos 55,6 MJ por kg) y se necesitan unos 3,98 kg de gas para calentar los 1.000 L.",
    c:"Si la caldera fuera perfecta (100 %) se necesitarían 188,3 ÷ 55,6 = 3,39 kg; con pérdidas se necesita más (3,98 kg) ✔.",
    o:"Restar al revés (reactivos − productos), que da +890,3: diría que quemar gas <b>absorbe</b> calor, lo que es absurdo. Siempre es productos menos reactivos." }));

  set(QA, "Fuentes de energía", X({ t:"<b>Caso 1:</b> una central a vapor trabaja entre <b>550 °C</b> (vapor) y <b>30 °C</b> (agua de enfriamiento). <b>Caso 2:</b> un aerogenerador con aspas de <b>100 m de diámetro</b> recibe viento de <b>10 m/s</b>; su coeficiente de potencia es <b>0,40</b> y la densidad del aire 1,225 kg/m³.",
    d:[["Eficiencia de Carnot", "Lo máximo que una máquina térmica podría convertir de calor en trabajo. Ninguna máquina real llega a ese valor."], ["Kelvin", "K = °C + 273 (más preciso: 273,15). En Carnot siempre se usa kelvin."], ["Diámetro y área", "El área que barren las aspas es un círculo: A = π × D² ÷ 4 (π ≈ 3,1416)."], ["Coeficiente de potencia (Cₚ)", "Qué fracción de la energía del viento aprovecha la turbina (0,40 = 40 %)."], ["v³", "La velocidad elevada al cubo: v × v × v."], ["W y MW", "Watt y megawatt (1 MW = 1.000.000 W)."]],
    p:"La eficiencia máxima de la central y la potencia del aerogenerador.",
    s:[["Caso 1: pasa las temperaturas a kelvin", "T caliente = 550 + 273 = 823 K. T fría = 30 + 273 = 303 K."],
      ["Caso 1: aplica Carnot", "η = 1 − T fría ÷ T caliente = 1 − 303 ÷ 823 = 1 − 0,368 = 0,632 → <b>63,2 %</b>. La central real logra cerca de 40 % por roces y pérdidas de calor."],
      ["Caso 2: calcula el área del rotor", "A = 3,1416 × 100² ÷ 4 = 3,1416 × 10.000 ÷ 4 = <b>7.854 m²</b>."],
      ["Caso 2: calcula v³", "10 × 10 × 10 = 1.000."],
      ["Caso 2: calcula la potencia", "P = ½ × ρ × A × v³ × Cₚ = 0,5 × 1,225 × 7.854 × 1.000 × 0,40 = 1.924.000 W = <b>1,92 MW</b>."]],
    r:"la central puede llegar como máximo a 63,2 % de eficiencia; el aerogenerador entrega unos 1,92 MW.",
    c:"Carnot siempre debe dar menos de 100 % ✔. En el aerogenerador, si el viento bajara a 5 m/s, v³ sería 125 (8 veces menos) y la potencia caería a 0,24 MW: por eso importa tanto dónde se instala.",
    o:"En Carnot usar °C: 1 − 30 ÷ 550 = 94,5 %, un valor imposible para una central térmica." }));

  set(QA, "Huella de carbono", X({ t:"Una pyme que fabrica envases produjo <b>200 toneladas</b> en el año. Consumió <b>50.000 kWh</b> de electricidad de la red y <b>8.000 litros de diésel</b> en sus camionetas propias. Factores: electricidad 0,2421 kg CO₂e por kWh; diésel 2,68 kg CO₂ por litro.",
    d:[["kWh", "Kilowatt-hora: unidad de energía eléctrica que aparece en la boleta de la luz."], ["Factor de emisión", "Cuánto CO₂ se emite por cada kWh o cada litro."], ["Alcance 1", "Emisiones directas de lo que es tuyo (tus vehículos, tus calderas)."], ["Alcance 2", "Emisiones por la electricidad que compras."], ["Alcance 3", "Otras emisiones indirectas (transporte contratado, proveedores, viajes)."]],
    p:"La huella de carbono de alcances 1 y 2 y la intensidad por tonelada producida.",
    s:[["Alcance 2: electricidad", "50.000 × 0,2421 = 12.105 kg = <b>12,1 t CO₂e</b>."],
      ["Alcance 1: diésel de las camionetas propias", "8.000 × 2,68 = 21.440 kg = <b>21,4 t CO₂</b>."],
      ["Suma", "12,1 + 21,4 = <b>33,5 t CO₂e</b>."],
      ["Intensidad", "Huella ÷ producción = 33.545 kg ÷ 200 t = <b>168 kg de CO₂e por tonelada de envases</b>. Sirve para comparar con otros años aunque la producción cambie."]],
    r:"33,5 t CO₂e (21,4 de alcance 1 y 12,1 de alcance 2); intensidad de unos 168 kg CO₂e por tonelada.",
    c:"Revisa las unidades: kWh × (kg/kWh) = kg; L × (kg/L) = kg. Luego ÷ 1.000 para toneladas ✔.",
    o:"Poner la electricidad en el alcance 1. La electricidad comprada siempre es alcance 2, porque el CO₂ lo emite la central que la genera." }));

  set(QA, "Agua y residuos", X({ t:"Una planta descarga <b>200 m³ de agua residual al día</b> con una <b>DBO de 800 mg/L</b>. La norma permite como máximo <b>300 mg/L</b>.",
    d:[["DBO", "Demanda bioquímica de oxígeno: cuánto oxígeno consumen los microorganismos al «comerse» la materia orgánica del agua. Mientras más alta, más sucia está el agua."], ["mg/L", "Miligramos por litro: cuánta contaminación hay en cada litro."], ["m³", "Metro cúbico = 1.000 litros."]],
    p:"¿Cuánta DBO descarga al día y qué porcentaje tiene que eliminar para cumplir la norma?",
    s:[["Pasa el caudal a litros", "200 m³ × 1.000 = 200.000 L al día."],
      ["Calcula la carga diaria", "Carga = litros × concentración = 200.000 × 800 = 160.000.000 mg. Para pasar a kg divide por 1.000.000: <b>160 kg de DBO al día</b>."],
      ["Calcula cuánto hay que eliminar", "Debe bajar de 800 a 300 mg/L: eliminar 500 mg/L. Como porcentaje: 500 ÷ 800 × 100 = <b>62,5 %</b>."]],
    r:"descarga 160 kg de DBO al día y debe eliminar al menos el 62,5 % antes de descargar.",
    c:"Después del tratamiento: 800 × (1 − 0,625) = 300 mg/L, justo el límite ✔.",
    o:"Dividir por la norma (500 ÷ 300) en vez de por la concentración inicial (500 ÷ 800)." }));

  /* ======================= MATEMÁTICA MÍNIMA (al inicio de cada ramo) =======================
     Cada idea es una ficha: título, una frase que la explica y los ejemplos uno por línea. */
  const mm = (t, items) => '<details class="mm"><summary>' + t + '</summary><div class="mm-g">' + items.map(v => '<div class="mm-i"><p class="mm-t">' + v[0] + "</p><p>" + v[1] + "</p>" + (v[2] ? '<ul class="mm-ex">' + v[2].map(e => "<li>" + e + "</li>").join("") + "</ul>" : "") + "</div>").join("") + "</div></details>";
  if (typeof CG !== "undefined") {
    CG[OP] = (CG[OP] || "") + mm("Matemática mínima que necesitas para este ramo (léela si te cuesta)", [
      ["De porcentaje a decimal", "Para pasar un porcentaje a número decimal, se divide por 100.", ["9 % → 0,09", "20 % → 0,20", "75,5 % → 0,755"]],
      ["De decimal a porcentaje", "Es al revés: se multiplica por 100.", ["0,889 → 88,9 %", "0,06 → 6 %"]],
      ["El signo ≤", "Se lee «menor o igual que». Significa «no puede pasar de».", ["x ≤ 200 significa: x puede valer 200 o menos, pero nunca más de 200."]],
      ["El signo ≥", "Se lee «mayor o igual que». Significa «al menos».", ["x ≥ 0 significa: x puede valer 0 o más, pero nunca un número negativo."]],
      ["Un número pegado a una letra", "Significa que se multiplican.", ["300x₁ es lo mismo que 300 × x₁.", "Si x₁ vale 10, entonces 300x₁ vale 3.000."]],
      ["Despejar", "Es dejar sola una letra. Para lograrlo, se hace la misma operación a ambos lados del signo.", ["4x = 120", "Divide ambos lados por 4.", "Resultado: x = 30."]],
      ["Despejar con decimales", "Funciona igual que con números enteros.", ["0,35s ≥ 0,11", "Divide ambos lados por 0,35.", "Resultado: s ≥ 0,314."]],
      ["Dónde corta una recta a los ejes", "Sirve para dibujar una restricción. Se busca un punto en cada eje.", ["Ecuación de ejemplo: 4x₁ + 2x₂ = 120.", "Corte con el eje horizontal: pon x₂ = 0. Queda 4x₁ = 120, entonces x₁ = 30.", "Corte con el eje vertical: pon x₁ = 0. Queda 2x₂ = 120, entonces x₂ = 60.", "Une los puntos (30, 0) y (0, 60) con una recta."]],
      ["Resolver dos ecuaciones juntas", "Se busca el punto donde se cruzan dos rectas. El método más simple es la reducción.", ["Paso 1: multiplica una ecuación para que una letra tenga el mismo número en las dos.", "Paso 2: resta las ecuaciones. Esa letra desaparece.", "Paso 3: despeja la letra que quedó.", "Paso 4: reemplaza ese valor en cualquiera de las dos ecuaciones para encontrar la otra letra."]],
      ["Variación porcentual", "Dice cuánto cambió algo, en porcentaje.", ["Fórmula: (valor nuevo − valor anterior) ÷ valor anterior × 100.", "Si el resultado es negativo, el valor bajó."]],
      ["Punto porcentual", "Es la resta entre dos porcentajes. No es lo mismo que un porcentaje de cambio.", ["Si la merma baja de 8 % a 6 %, bajó 2 puntos porcentuales."]]]);
    CG[QA] = (CG[QA] || "") + mm("Matemática y notación mínima que necesitas para este ramo (léela si te cuesta)", [
      ["Subíndice", "Es el número chico dentro de una fórmula. Dice cuántos átomos hay de ese elemento. Si no hay número, hay 1.", ["H₂O tiene 2 átomos de hidrógeno (H) y 1 de oxígeno (O)."]],
      ["Coeficiente", "Es el número grande delante de una fórmula. Dice cuántas moléculas hay.", ["3 CO₂ son 3 moléculas de CO₂.", "En total tienen 3 carbonos y 6 oxígenos."]],
      ["De porcentaje a decimal", "Se divide por 100.", ["80 % → 0,80", "0,5 % → 0,005"]],
      ["Unidades de masa", "Cada unidad es 1.000 veces la anterior.", ["1 kg = 1.000 g", "1 t (tonelada) = 1.000 kg"]],
      ["Unidades de volumen", "Un metro cúbico tiene mil litros.", ["1 m³ = 1.000 L"]],
      ["Unidades de energía y potencia", "El prefijo «M» (mega) significa un millón y «k» (kilo) significa mil.", ["1 MJ = 1.000 kJ", "1 MW = 1.000 kW = 1.000.000 W"]],
      ["Kelvin", "Es otra escala de temperatura. En las leyes de los gases y en Carnot siempre se usa kelvin.", ["Fórmula: K = °C + 273,15.", "Ejemplo: 27 °C = 300,15 K (se puede redondear a 300 K)."]],
      ["Notación científica", "Sirve para escribir números enormes o muy pequeños.", ["6,022 × 10²³ significa: correr la coma 23 lugares a la derecha.", "Es un número gigante: 602.200 trillones."]],
      ["Restar un número negativo", "Restar un negativo es lo mismo que sumarlo.", ["−965,1 − (−74,8)", "es lo mismo que −965,1 + 74,8", "= −890,3"]],
      ["Despejar en una proporción", "Si la letra que buscas está dividida, multiplica ambos lados por lo que la divide.", ["V₁ ÷ T₁ = V₂ ÷ T₂", "Multiplica ambos lados por T₂.", "Resultado: V₂ = V₁ × T₂ ÷ T₁."]],
      ["La ecuación como receta", "Los coeficientes de una ecuación balanceada son proporciones, como en una receta.", ["N₂ + 3 H₂ → 2 NH₃", "Si 1 mol de N₂ da 2 mol de NH₃,", "entonces 3 mol de N₂ dan 3 × 2 = 6 mol de NH₃."]]]);
  }
})();
