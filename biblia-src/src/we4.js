/* ============ CERTAMEN DE PRÁCTICA (Optimización y Química y ambiente) ============
   Genera certámenes de selección múltiple con casos y problemas. Cada vez cambian las preguntas y los números.
   Se corrige en la página: puntaje, nota (escala 1,0 a 7,0 con 60 % de exigencia), logro por indicador y desarrollo de cada pregunta. */
(function(){
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const sh = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const f = (x, d) => { if (d == null) d = 0; const neg = x < 0; let s = Math.abs(x).toFixed(d); let [e, dec] = s.split("."); e = e.replace(/\B(?=(\d{3})+(?!\d))/g, "."); return (neg ? "−" : "") + e + (dec ? "," + dec : ""); };
  const $ = x => "$ " + f(Math.round(x));
  /* opciones numéricas: correcta + distractores (sin repetidos al formatear) */
  const num = (ok, ds, fm) => { const seen = new Set([fm(ok)]), out = [];
    ds.forEach(d => { const s = fm(d); if (!seen.has(s) && isFinite(d)) { seen.add(s); out.push(s); } });
    let k = 1; while (out.length < 3) { const v = ok * (1 + 0.15 * k * (k % 2 ? 1 : -1)) + (ok === 0 ? k : 0); const s = fm(v); if (!seen.has(s)) { seen.add(s); out.push(s); } k++; }
    const all = sh([fm(ok)].concat(out.slice(0, 3))); return { ops:all, ok:all.indexOf(fm(ok)) }; };
  const txt = (ok, ds) => { const u = []; sh(ds).forEach(d => { if (d && d !== ok && !u.includes(d)) u.push(d); }); const all = sh([ok].concat(u.slice(0, 3))); return { ops:all, ok:all.indexOf(ok) }; };
  const Q = (ind, q, o, sol) => ({ ind, q, ops:o.ops, ok:o.ok, sol });
  /* preguntas conceptuales: [enunciado, correcta, [distractores], explicación] */
  const pool = (ind, arr) => () => { const p = pick(arr); return Q(ind, p[0], txt(p[1], p[2]), p[3]); };

  /* ======================= OPTIMIZACIÓN ======================= */
  const PRODS = [["mesas", "sillas"], ["poleras", "polerones"], ["alfajores", "bombones"], ["estantes", "escritorios"], ["mermelada de frutilla", "mermelada de damasco"], ["jabones líquidos", "jabones en barra"], ["bicicletas urbanas", "bicicletas de montaña"]];
  const OPT = {
    "1.1":[
      () => { const P = R(8, 20) * 500, H = R(6, 12) * 10, A = Math.round(P * R(80, 110) / 100 / 10) * 10, Hr = Math.round(H * R(95, 125) / 100);
        const pl = pick(["una línea de envasado de jugos", "una planta de muebles", "una panadería industrial", "una imprenta"]);
        const which = pick(["eficacia", "eficiencia", "efectividad"]);
        const ec = A / P, ei = H / Hr, ef = ec * ei, ok = which === "eficacia" ? ec : which === "eficiencia" ? ei : ef;
        return Q("1.1", "En " + pl + " se planificó producir " + f(P) + " unidades en un turno usando " + f(H) + " horas-hombre. Se produjeron " + f(A) + " unidades y se usaron " + f(Hr) + " horas-hombre. ¿Cuál fue la <b>" + which + "</b>?",
          num(ok * 100, [ec * 100, ei * 100, ef * 100, Hr / H * 100, P / A * 100], v => f(v, 1) + " %"),
          "<p>Eficacia = logrado ÷ planificado = " + f(A) + " ÷ " + f(P) + " = " + f(ec * 100, 1) + " %. Eficiencia = recursos previstos ÷ usados = " + f(H) + " ÷ " + f(Hr) + " = " + f(ei * 100, 1) + " %. Efectividad = eficacia × eficiencia = " + f(ec, 3) + " × " + f(ei, 3) + " = " + f(ef * 100, 1) + " %.</p>"); },
      () => { const u1 = R(40, 90) * 10, h1 = R(8, 16) * 5, u2 = Math.round(u1 * R(95, 130) / 100), h2 = h1 + R(-5, 5);
        const p1 = u1 / h1, p2 = u2 / h2, d = (p2 - p1) / p1 * 100;
        return Q("1.1", "Un taller produjo " + f(u1) + " piezas con " + f(h1) + " horas-hombre en enero, y " + f(u2) + " piezas con " + f(h2) + " horas-hombre en febrero. ¿Cuál fue la variación de la productividad de la mano de obra?",
          num(d, [(u2 - u1) / u1 * 100, (h2 - h1) / h1 * 100, (p1 - p2) / p2 * 100, d * 2], v => (v > 0 ? "+" : "") + f(v, 1) + " %"),
          "<p>P₁ = " + f(u1) + " ÷ " + f(h1) + " = " + f(p1, 2) + " piezas/h. P₂ = " + f(u2) + " ÷ " + f(h2) + " = " + f(p2, 2) + " piezas/h. ΔP = (P₂ − P₁) ÷ P₁ × 100 = " + f(d, 1) + " %. Ojo: no basta comparar unidades; hay que dividir por el recurso usado.</p>"); },
      pool("1.1", [
        ["¿Qué aporte se asocia a George Dantzig (1947)?", "El método Simplex para resolver programación lineal", ["El estudio de tiempos y movimientos", "La línea de montaje móvil", "El control estadístico de procesos", "La carta Gantt"], "Dantzig creó el Simplex, base de la investigación de operaciones y de este ramo."],
        ["La administración científica, que busca «la mejor forma» de hacer cada tarea midiendo tiempos, se atribuye a:", "Frederick W. Taylor", ["Henry Ford", "W. Edwards Deming", "Adam Smith", "Taiichi Ohno"], "Taylor publicó Principios de la administración científica en 1911."],
        ["La herramienta visual para programar actividades en el tiempo con barras se debe a:", "Henry Gantt", ["Frank Gilbreth", "Walter Shewhart", "George Dantzig", "Eli Whitney"], "La carta Gantt (1910 a 1920)."],
        ["El sistema de producción que busca eliminar desperdicios y producir justo a tiempo nació en:", "Toyota (Japón)", ["Ford (Estados Unidos)", "La administración científica de Taylor", "La investigación de operaciones militar", "La primera revolución industrial"], "Ohno y Shingo desarrollaron el Sistema de Producción Toyota (lean)."],
        ["Una empresa cumplió 100 % de la meta de producción, pero usó 30 % más horas de las previstas. Fue:", "Eficaz pero no eficiente", ["Eficiente y eficaz", "Eficiente pero no eficaz", "Ni eficiente ni eficaz", "Efectiva al 100 %"], "Cumplió la meta (eficaz) gastando de más (no eficiente)."],
        ["En el sistema «panadería», el registro de ventas que se usa para ajustar la producción del día siguiente corresponde a:", "La retroalimentación", ["Una entrada", "El proceso", "Una salida", "El límite del sistema"], "La retroalimentación lleva información de la salida para corregir la entrada."],
        ["Un modelo de programación lineal con todos sus datos conocidos con certeza es un modelo:", "Matemático determinístico", ["Icónico", "Analógico", "Matemático probabilístico", "De simulación"], "Determinístico: sin incertidumbre en los parámetros."],
        ["¿Cuál es el orden correcto del método de la ingeniería?", "Definir el problema → recopilar datos → generar alternativas → modelar y evaluar → implementar → controlar", ["Implementar → definir → modelar → controlar", "Modelar → definir → implementar → recopilar datos", "Recopilar datos → implementar → definir → evaluar", "Controlar → modelar → definir → implementar"], "Siempre se parte definiendo el problema y cómo medir el éxito."],
        ["La productividad se define como:", "Producción ÷ recursos utilizados", ["Recursos ÷ producción", "Producción real ÷ producción planificada", "Utilidad ÷ ventas", "Eficacia + eficiencia"], "Es una razón con unidades, por ejemplo unidades por hora-hombre."]])],
    "1.2":[
      () => { const P = R(8, 40) * 500, CV = Math.round(P * R(40, 70) / 100 / 100) * 100, CF = R(6, 40) * 100000;
        const neg = pick(["una cafetería universitaria", "un servicio de lavado de autos a domicilio", "una fábrica de cerveza artesanal", "un emprendimiento de cajas de verduras", "una tienda de repuestos en línea"]);
        const q = CF / (P - CV), ok = Math.ceil(q);
        return Q("1.2", "Evalúas la viabilidad de " + neg + ". Precio de venta $ " + f(P) + " por unidad, costo variable $ " + f(CV) + " por unidad y costos fijos de $ " + f(CF) + " al mes. ¿Cuántas unidades al mes debe vender para alcanzar el punto de equilibrio?",
          num(ok, [Math.ceil(CF / P), Math.ceil(CF / CV), Math.ceil(CF / (P + CV)), Math.ceil(CF / (P - CV) * 1.5)], v => f(Math.round(v)) + " unidades"),
          "<p>Margen de contribución = P − CV = " + f(P) + " − " + f(CV) + " = $ " + f(P - CV) + ". Q* = CF ÷ (P − CV) = " + f(CF) + " ÷ " + f(P - CV) + " = " + f(q, 1) + " → <b>" + f(ok) + " unidades</b> (se redondea hacia arriba). Error típico: dividir por el precio en vez de por el margen.</p>"); },
      () => { const P = R(10, 30) * 1000, CV = Math.round(P * R(45, 65) / 100 / 500) * 500, CF = R(10, 50) * 100000, Qv = R(200, 900);
        const U = (P - CV) * Qv - CF;
        return Q("1.2", "Un taller de impresión 3D vende piezas a $ " + f(P) + ", con costo variable de $ " + f(CV) + " por pieza y costos fijos de $ " + f(CF) + " al mes. Si este mes vende " + f(Qv) + " piezas, ¿cuál es su utilidad?",
          num(U, [P * Qv - CF, (P - CV) * Qv, P * Qv - CV * Qv + CF, (P - CV) * Qv - CF * 2], $),
          "<p>U = (P − CV) × Q − CF = (" + f(P) + " − " + f(CV) + ") × " + f(Qv) + " − " + f(CF) + " = " + f((P - CV) * Qv) + " − " + f(CF) + " = <b>" + $(U) + "</b>." + (U < 0 ? " Es negativa: vende menos que el punto de equilibrio (" + f(Math.ceil(CF / (P - CV))) + " piezas)." : "") + "</p>"); },
      () => { const P = R(4, 20) * 1000, CV = Math.round(P * R(40, 70) / 100 / 100) * 100, CF = R(10, 60) * 100000; const r = (P - CV) / P, V = CF / r;
        return Q("1.2", "Una heladería tiene costos fijos de $ " + f(CF) + " al mes. Vende cada helado a $ " + f(P) + " y su costo variable es $ " + f(CV) + ". ¿Cuántos pesos debe vender al mes para no perder?",
          num(V, [CF / (CV / P), CF * r, CF + CV, CF / r * 0.8], $),
          "<p>Razón de contribución = (P − CV) ÷ P = " + f(P - CV) + " ÷ " + f(P) + " = " + f(r, 3) + ". Ventas de equilibrio = CF ÷ razón = " + f(CF) + " ÷ " + f(r, 3) + " = <b>" + $(V) + "</b>.</p>"); },
      pool("1.2", [
        ["En el Canvas de un servicio de reparto, «agricultores que proveen las verduras» corresponde al bloque:", "Socios clave", ["Segmentos de clientes", "Recursos clave", "Fuentes de ingreso", "Canales"], "Son aliados externos que permiten operar."],
        ["En el Canvas, «suscripción mensual de $ 25.000» va en:", "Fuentes de ingreso", ["Estructura de costos", "Propuesta de valor", "Relación con clientes", "Actividades clave"], "Es la forma en que el cliente paga."],
        ["En el Canvas, «vender por Instagram y WhatsApp» corresponde a:", "Canales", ["Socios clave", "Recursos clave", "Segmentos de clientes", "Estructura de costos"], "Canales: cómo llega la propuesta al cliente."],
        ["En el Canvas, «arriendo de bodega, sueldos y combustible» corresponde a:", "Estructura de costos", ["Fuentes de ingreso", "Actividades clave", "Recursos clave", "Socios clave"], "Son costos de operar."],
        ["Para una pyme, «una nueva ley que obliga a reciclar envases» es en el FODA una:", "Amenaza (u oportunidad si su negocio es reciclar)", ["Fortaleza", "Debilidad", "Fortaleza o debilidad, según el gerente", "No se incluye en el FODA"], "Es un factor externo; para la mayoría es amenaza y para un reciclador, oportunidad."],
        ["«No tenemos flota propia de reparto» es, en el FODA:", "Una debilidad", ["Una amenaza", "Una oportunidad", "Una fortaleza", "Un factor PESTEL"], "Es interno y negativo."],
        ["El alza del dólar que encarece insumos importados se analiza en PESTEL como factor:", "Económico", ["Político", "Social", "Tecnológico", "Legal"], "Tipo de cambio, inflación y tasas son factores económicos."],
        ["La Ley de 40 horas que cambia la jornada laboral es en PESTEL un factor:", "Legal", ["Ecológico", "Social", "Tecnológico", "Económico"], "Leyes y normas que obligan a la empresa."],
        ["Quieres comprobar, con el menor gasto posible, si los clientes realmente comprarían tu producto. La herramienta adecuada es:", "Un producto mínimo viable (Lean Startup)", ["Un FODA", "Un PESTEL", "Una carta Gantt", "Un diagrama de Pareto"], "El PMV permite medir con clientes reales antes de invertir."],
        ["En el ciclo de Lean Startup, el orden es:", "Construir → medir → aprender", ["Medir → aprender → construir", "Planificar → hacer → verificar → actuar", "Empatizar → definir → idear", "Aprender → construir → vender"], "Se construye un PMV, se mide con datos y se aprende para decidir."],
        ["Una estrategia que usa una fortaleza para aprovechar una oportunidad es del tipo:", "FO (ofensiva)", ["DA (supervivencia)", "FA (defensiva)", "DO (reorientación)", "PESTEL"], "FODA cruzado: F con O."],
        ["El margen de contribución unitario es:", "Precio − costo variable unitario", ["Precio − costo fijo", "Costo fijo ÷ precio", "Precio × cantidad", "Utilidad ÷ ventas"], "Lo que cada unidad aporta para cubrir los costos fijos."]])],
    "1.3":[
      () => { const T = R(150, 600), L = Math.round(T * R(80, 98) / 100);
        return Q("1.3", "Un centro de distribución despachó " + f(T) + " pedidos en el mes; " + f(L) + " llegaron en la fecha comprometida. La meta del indicador «entregas a tiempo» es ≥ 95 %. ¿Cuál es el valor del indicador y su estado?",
          txt(f(L / T * 100, 1) + " %, " + (L / T >= 0.95 ? "cumple la meta" : "no cumple la meta"), [f((T - L) / T * 100, 1) + " %, " + ((T - L) / T >= 0.95 ? "cumple la meta" : "no cumple la meta"), f(L / T * 100, 1) + " %, " + (L / T >= 0.95 ? "no cumple la meta" : "cumple la meta"), f(T / L * 100, 1) + " %, cumple la meta"]),
          "<p>Indicador = pedidos a tiempo ÷ pedidos totales × 100 = " + f(L) + " ÷ " + f(T) + " × 100 = " + f(L / T * 100, 1) + " %. La meta es 95 %: " + (L / T >= 0.95 ? "se cumple." : "no se cumple (faltan " + f(95 - L / T * 100, 1) + " puntos).") + "</p>"); },
      () => { const b = R(6, 12), m = b - R(2, 4), a = +(b - (b - m) * R(20, 90) / 100).toFixed(1); const av = (a - b) / (m - b) * 100;
        return Q("1.3", "Objetivo SMART: «reducir la merma de " + b + " % a " + m + " % antes de diciembre». Hoy la merma es " + f(a, 1) + " %. ¿Qué porcentaje del camino hacia la meta se ha recorrido?",
          num(av, [a / m * 100, (b - a) / b * 100, m / a * 100, 100 - av], v => f(v, 0) + " %"),
          "<p>Avance = (actual − base) ÷ (meta − base) × 100 = (" + f(a, 1) + " − " + b + ") ÷ (" + m + " − " + b + ") × 100 = <b>" + f(av, 0) + " %</b>.</p>"); },
      () => { const pr = R(800, 3000), d = Math.round(pr * R(2, 9) / 100);
        return Q("1.3", "En una semana se produjeron " + f(pr) + " kg de pan y quedaron " + f(d) + " kg sin vender. ¿Cuál es la merma?",
          num(d / pr * 100, [pr / d, (pr - d) / pr * 100, d / (pr - d) * 100 * 1.3, d / pr * 1000], v => f(v, 1) + " %"),
          "<p>Merma = kg no vendidos ÷ kg producidos × 100 = " + f(d) + " ÷ " + f(pr) + " × 100 = <b>" + f(d / pr * 100, 1) + " %</b>.</p>"); },
      pool("1.3", [
        ["¿Cuál de estos objetivos es SMART?", "Reducir los reclamos por despacho de 40 a 20 por mes en la bodega Quilicura antes del 31 de diciembre", ["Mejorar la atención al cliente", "Ser líderes del mercado", "Bajar los reclamos lo más posible", "Reducir los reclamos pronto"], "Es específico, medible, alcanzable, relevante y con plazo."],
        ["«Aumentar la producción de la línea 2 de 900 a 1.000 unidades por turno» no es SMART porque le falta:", "El plazo (T)", ["Ser medible (M)", "Ser específico (S)", "Un número", "Indicar la línea"], "No dice para cuándo."],
        ["«Aumentar la producción a 5.000 unidades por turno» cuando la máquina da como máximo 1.100 falla en la letra:", "A (alcanzable)", ["S (específico)", "M (medible)", "R (relevante)", "T (plazo)"], "No es posible con los recursos disponibles."],
        ["En una ficha de indicador, «semanal» corresponde al campo:", "Frecuencia", ["Meta", "Fórmula", "Fuente de datos", "Responsable"], "Cada cuánto se mide."],
        ["«≥ 95 %» en la ficha del indicador de entregas a tiempo es:", "La meta", ["La fórmula", "La línea base", "La unidad", "La frecuencia"], "El valor que se quiere alcanzar."],
        ["El valor de un indicador antes de iniciar un proyecto de mejora se llama:", "Línea base", ["Meta", "Semáforo", "Tendencia", "Holgura"], "Sin línea base no se puede medir el avance."],
        ["«Porcentaje de máquinas con mantenimiento preventivo al día» es un indicador:", "De proceso (adelantado)", ["De resultado (rezagado)", "Financiero", "De ventas", "Que no sirve para gestionar"], "Anticipa el resultado (menos fallas)."],
        ["Unidades defectuosas ÷ unidades producidas × 100 es un indicador de:", "Calidad", ["Eficiencia", "Productividad", "Servicio", "Costo"], "Mide defectos."],
        ["Al pasar un objetivo SMART a un modelo de optimización, «la merma no puede superar 5 %» se convierte en:", "Una restricción", ["La función objetivo", "Una variable de decisión", "Un parámetro sin uso", "La no negatividad"], "Es un límite que la solución debe respetar."],
        ["Las cuatro perspectivas del Cuadro de Mando Integral son:", "Financiera, clientes, procesos internos y aprendizaje", ["Política, económica, social y tecnológica", "Fortalezas, oportunidades, debilidades y amenazas", "Planificar, hacer, verificar y actuar", "Eficacia, eficiencia, efectividad y productividad"], "Ordenan los objetivos estratégicos."]])],
    "2.1":[
      () => { const m = R(2, 6), n = R(3, 8); const t = pick(["transporte", "asignación"]);
        if (t === "transporte") return Q("2.1", "Una empresa tiene " + m + " plantas y " + n + " centros de distribución y quiere minimizar el costo de flete. ¿Cuántas variables de decisión tiene el modelo de transporte?", num(m * n, [m + n, m * n + m + n, m, n * 2], v => f(v) + " variables"), "<p>Una variable xᵢⱼ por cada ruta origen-destino: " + m + " × " + n + " = <b>" + (m * n) + "</b>. Las restricciones son " + (m + n) + " (una por planta y una por centro).</p>");
        return Q("2.1", "Hay que asignar " + n + " operarios a " + n + " máquinas (uno a uno) minimizando el tiempo total. ¿Cuántas variables binarias tiene el modelo?", num(n * n, [n, 2 * n, n * (n - 1), n * n + 2 * n], v => f(v) + " variables"), "<p>xᵢⱼ = 1 si el operario i va a la máquina j: " + n + " × " + n + " = <b>" + (n * n) + "</b> variables y " + (2 * n) + " restricciones (cada operario una máquina, cada máquina un operario).</p>"); },
      pool("2.1", [
        ["En un modelo de PL de una panadería, «hay 200 kg de harina disponibles por día» es:", "Un parámetro que aparece en una restricción", ["Una variable de decisión", "La función objetivo", "Una variable binaria", "La no negatividad"], "Es un dato fijo (lado derecho) que limita la solución."],
        ["«x₁ = kilos de pan amasado producidos por día» es:", "Una variable de decisión", ["Un parámetro", "Una restricción", "La función objetivo", "Un coeficiente técnico"], "Es lo que decides."],
        ["En 0,6x₁ + 0,5x₂ ≤ 200, el número 0,6 representa:", "El consumo de harina por kilo de pan amasado (coeficiente técnico)", ["La utilidad por kilo", "La harina disponible", "La cantidad de pan a producir", "La holgura"], "aᵢⱼ: cuánto recurso usa una unidad de la actividad."],
        ["La restricción x₁ ≥ 0, x₂ ≥ 0 se llama:", "No negatividad", ["Holgura", "Restricción activa", "Divisibilidad", "Función objetivo"], "No se produce en cantidades negativas."],
        ["El supuesto de la PL que se viola si «producir 2,5 camiones» no tiene sentido es:", "Divisibilidad", ["Proporcionalidad", "Aditividad", "Certeza", "No negatividad"], "Las variables deben poder ser fraccionarias; si no, se usa programación entera."],
        ["Si al vender más de 100 unidades el precio baja por descuento, se viola el supuesto de:", "Proporcionalidad", ["Aditividad", "Divisibilidad", "Certeza", "No negatividad"], "El aporte ya no es proporcional a la cantidad."],
        ["Si la demanda futura es incierta pero el modelo usa un valor fijo, se está suponiendo:", "Certeza", ["Divisibilidad", "Aditividad", "Proporcionalidad", "Integralidad"], "Todos los parámetros se suponen conocidos."],
        ["¿Cuál NO es un elemento de un modelo de programación lineal?", "La opinión del gerente sobre el resultado", ["Variables de decisión", "Función objetivo", "Restricciones", "Parámetros"], "Los elementos son parámetros, variables, función objetivo y restricciones."],
        ["En «máx Z = 300x₁ + 250x₂», el 300 es:", "La utilidad por unidad de x₁", ["La cantidad de x₁", "El recurso disponible", "Un coeficiente técnico de la restricción", "La holgura"], "cⱼ: aporte unitario al objetivo."]])],
    "2.2":[
      () => { const [a, b] = pick(PRODS), p1 = R(10, 40) * 1000, c1 = Math.round(p1 * R(40, 70) / 100 / 500) * 500, p2 = R(10, 40) * 1000, c2 = Math.round(p2 * R(40, 70) / 100 / 500) * 500;
        const u1 = p1 - c1, u2 = p2 - c2;
        return Q("2.2", "Una pyme fabrica " + a + " (x₁) y " + b + " (x₂). Cada unidad de " + a + " se vende a $ " + f(p1) + " y cuesta $ " + f(c1) + " producirla; cada unidad de " + b + " se vende a $ " + f(p2) + " y cuesta $ " + f(c2) + ". ¿Cuál es la función objetivo correcta?",
          txt("máx Z = " + f(u1) + "x₁ + " + f(u2) + "x₂", ["máx Z = " + f(p1) + "x₁ + " + f(p2) + "x₂", "mín Z = " + f(c1) + "x₁ + " + f(c2) + "x₂", "máx Z = " + f(u2) + "x₁ + " + f(u1) + "x₂", "máx Z = " + f(u1 + u2) + "(x₁ + x₂)"]),
          "<p>Se maximiza la <b>utilidad</b>: precio − costo. " + a + ": " + f(p1) + " − " + f(c1) + " = " + f(u1) + "; " + b + ": " + f(p2) + " − " + f(c2) + " = " + f(u2) + ". Error típico: usar el precio (eso maximiza ventas, no utilidad).</p>"); },
      () => { const [a, b] = pick(PRODS), h1 = R(1, 6), h2 = R(1, 6), H = R(8, 30) * 10, rec = pick(["horas de corte", "horas de armado", "horas de máquina", "horas de pintura"]);
        return Q("2.2", "Cada unidad de " + a + " (x₁) requiere " + h1 + " " + rec + " y cada unidad de " + b + " (x₂) requiere " + h2 + ". Se dispone de " + H + " " + rec + " por semana. ¿Cuál es la restricción?",
          txt(h1 + "x₁ + " + h2 + "x₂ ≤ " + H, [h1 + "x₁ + " + h2 + "x₂ ≥ " + H, h2 + "x₁ + " + h1 + "x₂ ≤ " + H, "x₁ + x₂ ≤ " + H, H + "x₁ + " + H + "x₂ ≤ " + (h1 + h2)]),
          "<p>Lo que uso ≤ lo que tengo: " + h1 + "x₁ + " + h2 + "x₂ ≤ " + H + ". Es «≤» porque " + H + " es un máximo disponible.</p>"); },
      () => { /* método gráfico con dos restricciones que se cruzan en un vértice entero */
        let a1, b1, a2, b2; do { a1 = R(2, 6); b1 = R(1, 4); a2 = R(1, 4); b2 = R(2, 6); } while (a1 * b2 <= a2 * b1 + 2);
        const xs = R(2, 12), ys = R(2, 12), c1 = a1 * xs + b1 * ys, c2 = a2 * xs + b2 * ys, cx = R(2, 9) * 1000, cy = R(2, 9) * 1000;
        const V = [[0, 0], [c1 / a1, 0], [xs, ys], [0, c2 / b2]], Z = V.map(v => cx * v[0] + cy * v[1]); const best = Z.indexOf(Math.max(...Z));
        if (Z.filter(z => Math.abs(z - Z[best]) < 1).length > 1) return OPT["2.2"][2]();
        const vs = v => "(" + f(v[0], Number.isInteger(v[0]) ? 0 : 2) + "; " + f(v[1], Number.isInteger(v[1]) ? 0 : 2) + ")";
        const o = txt(vs(V[best]) + " con Z = " + $(Z[best]), V.map((v, i) => i === best ? null : vs(v) + " con Z = " + $(Z[i])).filter(Boolean).concat([vs([c2 / a2, 0]) + " con Z = " + $(cx * c2 / a2)]));
        return Q("2.2", "Resuelve gráficamente: máx Z = " + f(cx) + "x₁ + " + f(cy) + "x₂, sujeto a " + a1 + "x₁ + " + b1 + "x₂ ≤ " + c1 + "; " + a2 + "x₁ + " + b2 + "x₂ ≤ " + c2 + "; x₁, x₂ ≥ 0. ¿Cuál es la solución óptima?", o,
          "<p>Cortes: la primera recta corta los ejes en (" + f(c1 / a1, 2) + "; 0) y (0; " + f(c1 / b1, 2) + "); la segunda en (" + f(c2 / a2, 2) + "; 0) y (0; " + f(c2 / b2, 2) + "). Los vértices factibles son (0; 0), " + vs(V[1]) + ", la intersección " + vs(V[2]) + " (resolviendo el sistema) y " + vs(V[3]) + ". Z en cada uno: " + V.map((v, i) => vs(v) + " → " + $(Z[i])).join("; ") + ". El máximo es <b>" + vs(V[best]) + "</b>. El punto (" + f(c2 / a2, 2) + "; 0) no es factible: no cumple la primera restricción.</p>"); },
      () => { const h1 = R(2, 5), h2 = R(1, 4), H = R(10, 30) * 10, x1 = R(5, Math.floor(H / h1 / 2)), x2 = R(3, Math.max(4, Math.floor((H - h1 * x1) / h2) - 2)); const used = h1 * x1 + h2 * x2;
        if (used > H) return OPT["2.2"][3]();
        return Q("2.2", "La restricción de horas de horno es " + h1 + "x₁ + " + h2 + "x₂ ≤ " + H + ". La solución óptima es x₁ = " + x1 + " y x₂ = " + x2 + ". ¿Cuál es la holgura del horno?",
          num(H - used, [used, H, H - h1 * x1, H + used], v => f(v) + " horas"),
          "<p>Uso = " + h1 + " × " + x1 + " + " + h2 + " × " + x2 + " = " + used + " h. Holgura = " + H + " − " + used + " = <b>" + (H - used) + " h</b>. " + (H === used ? "Es cero: la restricción es activa (el horno es un cuello de botella)." : "Sobran horas: la restricción no es activa; tener más horno no aumentaría la utilidad.") + "</p>"); },
      pool("2.2", [
        ["Al graficar, ningún punto cumple todas las restricciones a la vez. El problema es:", "Infactible", ["No acotado", "Con óptimos múltiples", "Degenerado", "Óptimo en el origen"], "No existe región factible."],
        ["La función objetivo puede crecer sin límite dentro de la región factible. El problema es:", "No acotado (casi siempre falta una restricción)", ["Infactible", "Con óptimos múltiples", "Óptimo en un vértice", "Balanceado"], "Revisa si olvidaste un recurso o la demanda."],
        ["La recta de la función objetivo es paralela a una restricción activa en el óptimo. Entonces hay:", "Óptimos múltiples sobre ese borde", ["Infactibilidad", "Solución no acotada", "Un único óptimo en el origen", "Un error de modelación"], "Todos los puntos del borde dan el mismo Z."],
        ["En programación lineal, el óptimo (si existe) siempre se encuentra:", "En un vértice de la región factible", ["En el centro de la región factible", "En el origen", "Fuera de la región factible", "Donde las variables son iguales"], "Por eso basta evaluar Z en los vértices."],
        ["Una restricción activa en el óptimo significa que:", "Ese recurso se usa completo (holgura cero)", ["Ese recurso sobra", "La restricción no influye", "El modelo es infactible", "La variable vale cero"], "Más de ese recurso podría aumentar Z."],
        ["Para decidir de qué lado de la recta 4x₁ + 2x₂ = 120 está la zona permitida (≤), se prueba:", "El punto (0, 0): 0 ≤ 120, entonces la zona incluye el origen", ["Un vértice cualquiera", "El punto donde Z es máximo", "El corte con el eje x₂", "Ninguno: siempre es arriba"], "Si el origen cumple, la zona está hacia el origen."],
        ["En Solver de Excel, las celdas que el programa cambia para encontrar el óptimo son:", "Las celdas de las variables de decisión", ["La celda objetivo", "Las celdas de las restricciones", "Los coeficientes", "Los totales disponibles"], "Solver ajusta las variables respetando las restricciones."],
        ["En Solver, el método de resolución para un modelo lineal es:", "Simplex LP", ["GRG no lineal", "Evolutivo", "Newton", "Búsqueda aleatoria"], "Simplex LP es exacto para modelos lineales."]])],
    "2.3":[
      () => { const r1 = R(3, 10), r3 = R(3, 10), r2 = R(Math.max(r1, r3) + 1, r1 + r3 + 5); const ok = Math.max(r1 + r3, r2);
        return Q("2.3", "Un call center necesita al menos " + r1 + " ejecutivos de 8 a 12 h, " + r2 + " de 12 a 16 h y " + r3 + " de 16 a 20 h. Hay dos turnos de 8 horas: A (8 a 16 h) y B (12 a 20 h). ¿Cuál es el mínimo de ejecutivos que hay que contratar?",
          num(ok, [r1 + r2 + r3, r2, Math.max(r1, r3), r1 + r3 + r2 - Math.min(r1, r3)], v => f(v) + " ejecutivos"),
          "<p>Modelo: mín x<sub>A</sub> + x<sub>B</sub>, s.a. x<sub>A</sub> ≥ " + r1 + " (8 a 12 h, solo A); x<sub>A</sub> + x<sub>B</sub> ≥ " + r2 + " (12 a 16 h, ambos); x<sub>B</sub> ≥ " + r3 + " (16 a 20 h, solo B). Con x<sub>A</sub> = " + r1 + " y x<sub>B</sub> = " + r3 + " hay " + (r1 + r3) + " personas entre 12 y 16 h; " + (r1 + r3 >= r2 ? "basta." : (r2 - r1 - r3 === 1 ? "falta 1, que se agrega" : "faltan " + (r2 - r1 - r3) + ", que se agregan") + " a cualquier turno.") + " Mínimo = <b>" + ok + "</b>.</p>"); },
      () => { const c = [[R(5, 15), R(10, 25)], [R(10, 25), R(5, 15)]].map(r => r.map(v => v * 1000)), x = [[R(5, 20) * 10, R(2, 10) * 10], [R(0, 5) * 10, R(5, 20) * 10]];
        const tot = c[0][0] * x[0][0] + c[0][1] * x[0][1] + c[1][0] * x[1][0] + c[1][1] * x[1][1];
        return Q("2.3", "Plan de transporte: la planta 1 envía " + x[0][0] + " t a Santiago ($ " + f(c[0][0]) + "/t) y " + x[0][1] + " t a Concepción ($ " + f(c[0][1]) + "/t); la planta 2 envía " + x[1][0] + " t a Santiago ($ " + f(c[1][0]) + "/t) y " + x[1][1] + " t a Concepción ($ " + f(c[1][1]) + "/t). ¿Cuál es el costo total del plan?",
          num(tot, [(c[0][0] + c[0][1] + c[1][0] + c[1][1]) * (x[0][0] + x[0][1] + x[1][0] + x[1][1]) / 4, c[0][0] * x[0][1] + c[0][1] * x[0][0] + c[1][0] * x[1][1] + c[1][1] * x[1][0], tot * 1.1], $),
          "<p>Z = Σ cᵢⱼ xᵢⱼ = " + f(c[0][0]) + " × " + x[0][0] + " + " + f(c[0][1]) + " × " + x[0][1] + " + " + f(c[1][0]) + " × " + x[1][0] + " + " + f(c[1][1]) + " × " + x[1][1] + " = <b>" + $(tot) + "</b>.</p>"); },
      () => { const I0 = R(0, 10) * 10, P = [R(8, 15), R(8, 15), R(8, 15)].map(v => v * 10), D = [R(6, 16), R(6, 16), R(6, 16)].map(v => v * 10); let I = I0; const st = []; for (let t = 0; t < 3; t++) { I = I + P[t] - D[t]; st.push(I); }
        if (st.some(v => v < 0)) return OPT["2.3"][2]();
        return Q("2.3", "Planificación de producción: inventario inicial " + I0 + " unidades. Producción de enero, febrero y marzo: " + P.join(", ") + ". Demanda: " + D.join(", ") + ". ¿Cuál es el inventario al final de marzo?",
          num(st[2], [I0 + P[2] - D[2], P.reduce((a, b) => a + b) - D.reduce((a, b) => a + b), st[2] + I0 * 2 + 10, st[1]], v => f(v) + " unidades"),
          "<p>Balance Iₜ = Iₜ₋₁ + Pₜ − Dₜ. Enero: " + I0 + " + " + P[0] + " − " + D[0] + " = " + st[0] + ". Febrero: " + st[0] + " + " + P[1] + " − " + D[1] + " = " + st[1] + ". Marzo: " + st[1] + " + " + P[2] + " − " + D[2] + " = <b>" + st[2] + "</b>.</p>"); },
      () => { const p1 = R(7, 12), p2 = R(35, 48), r = R(16, 28), x = (r - p1) / (p2 - p1); const c1 = R(200, 300), c2 = R(400, 600); const cost = c1 * (1 - x) + c2 * x;
        return Q("2.3", "Se mezclan maíz (" + p1 + " % de proteína, $ " + c1 + "/kg) y harina de soya (" + p2 + " % de proteína, $ " + c2 + "/kg) para un alimento con al menos " + r + " % de proteína al menor costo. ¿Qué fracción mínima de soya debe tener cada kilo de mezcla?",
          num(x * 100, [r / p2 * 100, (p2 - r) / (p2 - p1) * 100, r / (p1 + p2) * 100, x * 50], v => f(v, 1) + " %"),
          "<p>Con x = fracción de soya: " + f(p1 / 100, 2) + "(1 − x) + " + f(p2 / 100, 2) + "x ≥ " + f(r / 100, 2) + " → x ≥ (" + r + " − " + p1 + ") ÷ (" + p2 + " − " + p1 + ") = <b>" + f(x * 100, 1) + " %</b>. Como la soya es más cara, el óptimo usa justo ese mínimo: costo = " + c1 + " × " + f(1 - x, 3) + " + " + c2 + " × " + f(x, 3) + " = $ " + f(cost, 0) + " por kg.</p>"); },
      pool("2.3", [
        ["Una empresa tiene 3 bodegas con stock y 5 clientes con pedidos, y quiere minimizar el costo de flete. El modelo es de:", "Transporte", ["Asignación", "Mezcla", "Turnos", "Inversión"], "Orígenes con oferta y destinos con demanda."],
        ["Hay 4 técnicos y 4 reparaciones; cada técnico hace una sola y cada reparación la hace uno. El modelo es de:", "Asignación", ["Transporte con demanda variable", "Mezcla", "Inventario", "Ruta más corta"], "Correspondencia uno a uno con variables 0-1."],
        ["Una viña combina vinos de distintos valles para lograr un grado alcohólico y un costo mínimo. El modelo es de:", "Mezcla", ["Asignación", "Transporte", "Turnos", "Inversión binaria"], "Insumos con exigencias de composición."],
        ["Con $ 500 millones, una empresa elige qué proyectos financiar para maximizar el VAN. Las variables son:", "Binarias (1 = se hace el proyecto, 0 = no)", ["Continuas entre 0 y 500", "Negativas", "De holgura", "Iguales al VAN"], "Cada proyecto se hace o no."],
        ["Un hospital define cuántas enfermeras empiezan en cada turno para cubrir la dotación mínima por hora. El modelo es de:", "Programación de turnos", ["Transporte", "Mezcla", "Asignación de máquinas", "Punto de equilibrio"], "Bloques horarios con mínimo de personas."],
        ["En un problema de transporte, si la oferta total supera la demanda total se agrega:", "Un destino ficticio con costo 0 que recibe el sobrante", ["Un origen ficticio", "Una variable binaria", "Una restricción de no negatividad", "Nada: es infactible"], "Así el problema queda balanceado."],
        ["La ecuación Iₜ = Iₜ₋₁ + Pₜ − Dₜ se usa en modelos de:", "Planificación de producción con inventario", ["Asignación", "Transporte", "Mezcla", "Turnos"], "Balance de inventario entre períodos."],
        ["Un modelo en que algunas variables deben ser enteras (camiones, personas) es de:", "Programación entera", ["Programación no lineal", "Simulación", "Programación por metas", "Teoría de colas"], "PL + restricción de integralidad."]])]
  };

  /* ======================= QUÍMICA ======================= */
  const A = { H:1.008, C:12.01, N:14.01, O:16.00, Na:22.99, Mg:24.31, Al:26.98, S:32.06, Cl:35.45, K:39.10, Ca:40.08, Mn:54.94, Fe:55.85, Cu:63.55 };
  const CMP = [["H₂SO₄", { H:2, S:1, O:4 }, "ácido sulfúrico"], ["CaCO₃", { Ca:1, C:1, O:3 }, "carbonato de calcio (caliza)"], ["Fe₂O₃", { Fe:2, O:3 }, "óxido férrico (hematita)"], ["C₆H₁₂O₆", { C:6, H:12, O:6 }, "glucosa"], ["NH₃", { N:1, H:3 }, "amoníaco"], ["HNO₃", { H:1, N:1, O:3 }, "ácido nítrico"], ["Ca(OH)₂", { Ca:1, O:2, H:2 }, "hidróxido de calcio (cal apagada)"], ["CuSO₄", { Cu:1, S:1, O:4 }, "sulfato de cobre"], ["KMnO₄", { K:1, Mn:1, O:4 }, "permanganato de potasio"], ["Al₂O₃", { Al:2, O:3 }, "óxido de aluminio (alúmina)"], ["C₃H₈", { C:3, H:8 }, "propano"], ["C₂H₅OH", { C:2, H:6, O:1 }, "etanol"], ["Mg(OH)₂", { Mg:1, O:2, H:2 }, "hidróxido de magnesio"], ["NaCl", { Na:1, Cl:1 }, "cloruro de sodio"], ["SO₂", { S:1, O:2 }, "dióxido de azufre"]];
  const MM = c => Object.keys(c).reduce((s, k) => s + A[k] * c[k], 0);
  const FUEL = [["metano", "CH₄", 16.04, 1, -890.3, "CH₄ + 2 O₂ → CO₂ + 2 H₂O"], ["propano", "C₃H₈", 44.09, 3, -2219.9, "C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O"], ["butano", "C₄H₁₀", 58.12, 4, -2877.6, "2 C₄H₁₀ + 13 O₂ → 8 CO₂ + 10 H₂O"], ["etanol", "C₂H₅OH", 46.07, 2, -1366.7, "C₂H₅OH + 3 O₂ → 2 CO₂ + 3 H₂O"], ["carbono (carbón puro)", "C", 12.01, 1, -393.5, "C + O₂ → CO₂"]];
  const ALK = ["metano", "etano", "propano", "butano", "pentano", "hexano", "heptano", "octano"];
  const sub = n => String(n).split("").map(d => "₀₁₂₃₄₅₆₇₈₉"[d]).join("");
  const GAS = [["CO₂", 44.01], ["CH₄", 16.04], ["SO₂", 64.07], ["O₂", 32.00], ["N₂", 28.02], ["NO₂", 46.01]];
  const K = c => c + 273.15;
  const QUI = {
    "1.1":[
      () => { const n = R(1, 8), H = 2 * n + 2; let a = 1, b = (3 * n + 1) / 2, c = n, d = n + 1; if (!Number.isInteger(b)) { a = 2; b *= 2; c *= 2; d *= 2; }
        const which = pick(["O₂", "suma"]); const fm = "C" + (n > 1 ? sub(n) : "") + "H" + sub(H);
        const eq = (a > 1 ? a + " " : "") + fm + " + " + b + " O₂ → " + (c > 1 ? c + " " : "") + "CO₂ + " + d + " H₂O";
        if (which === "O₂") return Q("1.1", "Balancea la combustión completa del " + ALK[n - 1] + ": " + fm + " + O₂ → CO₂ + H₂O, con los menores coeficientes enteros. ¿Cuál es el coeficiente del O₂?", num(b, [b / a + 1, 2 * n + 1, n + 1, b + 2, (3 * n + 1) / 2 + 0.5], v => f(v, Number.isInteger(v) ? 0 : 1)), "<p>C: " + n + " átomos → " + n + " CO₂. H: " + H + " → " + (n + 1) + " H₂O. O a la derecha: 2 × " + n + " + " + (n + 1) + " = " + (3 * n + 1) + " → " + (3 * n + 1) / 2 + " O₂." + (a === 2 ? " Como es fraccionario, se multiplica todo por 2." : "") + " Ecuación: <b>" + eq + "</b>.</p>");
        const s = a + b + c + d; return Q("1.1", "Balancea con los menores enteros: " + fm + " + O₂ → CO₂ + H₂O (combustión del " + ALK[n - 1] + "). ¿Cuánto suma el total de coeficientes?", num(s, [s - a + 1, 1 + (3 * n + 1) / 2 + n + n + 1 + 1, s + 2, s - 2], v => f(v)), "<p>" + eq + ". Suma = " + a + " + " + b + " + " + c + " + " + d + " = <b>" + s + "</b>.</p>"); },
      () => { const L = [["S en H₂SO₄", 6, "2(+1) + S + 4(−2) = 0"], ["Mn en KMnO₄", 7, "(+1) + Mn + 4(−2) = 0"], ["N en HNO₃", 5, "(+1) + N + 3(−2) = 0"], ["Cr en K₂Cr₂O₇", 6, "2(+1) + 2Cr + 7(−2) = 0"], ["C en CO₂", 4, "C + 2(−2) = 0"], ["Fe en Fe₂O₃", 3, "2Fe + 3(−2) = 0"], ["N en NH₃", -3, "N + 3(+1) = 0"], ["S en SO₂", 4, "S + 2(−2) = 0"], ["S en el ion SO₄²⁻", 6, "S + 4(−2) = −2"], ["Mn en MnO₂", 4, "Mn + 2(−2) = 0"], ["C en CH₄", -4, "C + 4(+1) = 0"]]; const p = pick(L);
        return Q("1.1", "¿Cuál es el número de oxidación del " + p[0] + "?", num(p[1], [-p[1], p[1] + 2, p[1] - 2, p[1] + 1, 0], v => (v > 0 ? "+" : "") + f(v)), "<p>O = −2, H = +1, K = +1 y la suma es igual a la carga: " + p[2] + " → <b>" + (p[1] > 0 ? "+" : "") + p[1] + "</b>.</p>"); },
      pool("1.1", [
        ["En Zn + Cu²⁺ → Zn²⁺ + Cu, la especie que se oxida es:", "Zn", ["Cu²⁺", "Zn²⁺", "Cu", "Ninguna"], "Zn pasa de 0 a +2: pierde electrones."],
        ["En Zn + Cu²⁺ → Zn²⁺ + Cu, el agente oxidante es:", "Cu²⁺", ["Zn", "Zn²⁺", "Cu", "El agua"], "El oxidante es el que se reduce (Cu²⁺ gana 2 e⁻)."],
        ["¿Cuál ecuación está balanceada en masa y en carga?", "2 Fe³⁺ + Cu → 2 Fe²⁺ + Cu²⁺", ["Fe³⁺ + Cu → Fe²⁺ + Cu²⁺", "Fe³⁺ + 2 Cu → Fe²⁺ + 2 Cu²⁺", "2 Fe³⁺ + 2 Cu → 2 Fe²⁺ + Cu²⁺", "Fe³⁺ + Cu → 2 Fe²⁺ + Cu²⁺"], "Átomos: 2 Fe y 1 Cu a cada lado. Carga: +6 = 2(+2) + 2."],
        ["Al balancear una ecuación química solo se pueden modificar:", "Los coeficientes", ["Los subíndices", "Las fórmulas de los productos", "Los estados de agregación", "Coeficientes y subíndices"], "Cambiar subíndices cambia la sustancia."],
        ["En la semirreacción MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O, la carga a cada lado es:", "+2 y +2", ["−1 y +2", "+7 y +2", "+8 y 0", "0 y 0"], "Izquierda: −1 + 8 − 5 = +2. Derecha: +2."],
        ["En el método ion-electrón en medio ácido, el oxígeno se balancea agregando:", "H₂O", ["O₂", "H⁺", "OH⁻", "Electrones"], "El O con agua, el H con H⁺ y la carga con electrones."],
        ["La oxidación corresponde a:", "Pérdida de electrones (sube el número de oxidación)", ["Ganancia de electrones", "Ganancia de oxígeno siempre", "Baja del número de oxidación", "Pérdida de protones"], "Oxidación = pérdida de e⁻."],
        ["Fe₂O₃ + CO → Fe + CO₂ balanceada queda:", "Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂", ["Fe₂O₃ + CO → 2 Fe + CO₂", "Fe₂O₃ + 2 CO → 2 Fe + 2 CO₂", "2 Fe₂O₃ + 3 CO → 4 Fe + 3 CO₂", "Fe₂O₃ + 3 CO → Fe + 3 CO₂"], "Fe 2 = 2; C 3 = 3; O 3 + 3 = 6 = 6."]])],
    "1.2":[
      () => { const c = pick(CMP), m = MM(c[1]), wrong1 = Object.keys(c[1]).reduce((s, k) => s + A[k], 0), k0 = Object.keys(c[1]).find(k => c[1][k] > 1) || "O";
        return Q("1.2", "Con la tabla de masas atómicas (H 1,008; C 12,01; N 14,01; O 16,00; Na 22,99; Mg 24,31; Al 26,98; S 32,06; Cl 35,45; K 39,10; Ca 40,08; Mn 54,94; Fe 55,85; Cu 63,55), calcula la masa molar del " + c[2] + ", " + c[0] + ".",
          num(m, [wrong1, m - A[k0] * ((c[1][k0] || 1) - 1), m + A.O, m * 1.1], v => f(v, 2) + " g/mol"),
          "<p>M = " + Object.keys(c[1]).map(k => c[1][k] + " × " + String(A[k]).replace(".", ",") + " (" + k + ")").join(" + ") + " = <b>" + f(m, 2) + " g/mol</b>. Error típico: olvidar multiplicar por el subíndice.</p>"); },
      () => { const m1 = R(10, 60), m2 = m1 + R(1, 2), fr = R(55, 92); const av = m1 * fr / 100 + m2 * (100 - fr) / 100;
        return Q("1.2", "Un elemento X tiene dos isótopos: " + m1 + ",00 u con " + fr + " % de abundancia y " + m2 + ",00 u con " + (100 - fr) + " %. ¿Cuál es su masa atómica promedio?",
          num(av, [(m1 + m2) / 2, m1 * (100 - fr) / 100 + m2 * fr / 100, m2, m1], v => f(v, 2) + " u"),
          "<p>Ā = Σ mᵢ·fᵢ = " + m1 + " × " + f(fr / 100, 2) + " + " + m2 + " × " + f((100 - fr) / 100, 2) + " = <b>" + f(av, 2) + " u</b>. Queda más cerca del isótopo más abundante.</p>"); },
      () => { const c = pick(CMP.filter(x => Object.keys(x[1]).length > 1)), m = MM(c[1]), el = pick(Object.keys(c[1])), p = c[1][el] * A[el] / m * 100;
        return Q("1.2", "¿Cuál es el porcentaje en masa de " + el + " en " + c[0] + " (" + c[2] + ")?",
          num(p, [A[el] / m * 100, c[1][el] / Object.values(c[1]).reduce((a, b) => a + b) * 100, 100 - p, p * 1.2], v => f(v, 1) + " %"),
          "<p>M(" + c[0] + ") = " + f(m, 2) + " g/mol. Masa de " + el + " en la fórmula = " + c[1][el] + " × " + String(A[el]).replace(".", ",") + " = " + f(c[1][el] * A[el], 2) + ". %" + el + " = " + f(c[1][el] * A[el], 2) + " ÷ " + f(m, 2) + " × 100 = <b>" + f(p, 1) + " %</b>.</p>"); },
      () => { const c = pick(CMP), M = MM(c[1]), g = R(2, 40) * 10, n = g / M;
        return Q("1.2", "¿Cuántos moles hay en " + g + " g de " + c[0] + "? (M = " + f(M, 2) + " g/mol)",
          num(n, [g * M / 1000, M / g, n * 6.022, g / (M / 2)], v => f(v, 3) + " mol"),
          "<p>n = m ÷ M = " + g + " ÷ " + f(M, 2) + " = <b>" + f(n, 3) + " mol</b> (" + f(n * 6.022, 2) + " × 10²³ moléculas).</p>"); }],
    "1.3":[
      () => { const fu = pick(FUEL), m = R(5, 60) * 10, co2 = m * fu[3] * 44.01 / fu[2];
        return Q("1.3", "Una caldera quema " + m + " kg de " + fu[0] + " (" + fu[1] + ", M = " + f(fu[2], 2) + " g/mol). Reacción: " + fu[5] + ". ¿Cuántos kg de CO₂ emite (combustión completa)?",
          num(co2, [m * 44.01 / fu[2], m * fu[3], m / fu[2] * fu[3], co2 * 12.01 / 44.01], v => f(v, 1) + " kg"),
          "<p>Cada mol de " + fu[1] + " tiene " + fu[3] + (fu[3] === 1 ? " átomo" : " átomos") + " de C y da " + fu[3] + " mol de CO₂. n = " + m + ".000 g ÷ " + f(fu[2], 2) + " = " + f(m * 1000 / fu[2], 0) + " mol → CO₂ = " + f(m * 1000 / fu[2] * fu[3], 0) + " mol × 44,01 g/mol = <b>" + f(co2, 1) + " kg</b>.</p>"); },
      () => { const gH = R(4, 20), gO = R(16, 160); const nH = gH / 2.016, nO = gO / 32.00, lim = nH / 2 < nO ? "H₂" : "O₂", nW = lim === "H₂" ? nH : 2 * nO, mW = nW * 18.02;
        return Q("1.3", "Se hacen reaccionar " + gH + " g de H₂ con " + gO + " g de O₂: 2 H₂ + O₂ → 2 H₂O. ¿Cuál es el reactivo limitante y cuánta agua se forma?",
          txt(lim + "; " + f(mW, 1) + " g de agua", [(lim === "H₂" ? "O₂" : "H₂") + "; " + f(lim === "H₂" ? 2 * nO * 18.02 : nH * 18.02, 1) + " g de agua", lim + "; " + f((gH + gO), 1) + " g de agua", (gH < gO ? "H₂" : "O₂") === lim ? "O₂; " + f(mW / 2, 1) + " g de agua" : (gH < gO ? "H₂" : "O₂") + "; " + f(gH * 9, 1) + " g de agua"]),
          "<p>Moles: H₂ = " + gH + " ÷ 2,016 = " + f(nH, 2) + " mol; O₂ = " + gO + " ÷ 32,00 = " + f(nO, 2) + " mol. Divide por el coeficiente: H₂ " + f(nH / 2, 2) + ", O₂ " + f(nO, 2) + ". El menor es <b>" + lim + "</b> (limitante). Agua = " + f(nW, 2) + " mol × 18,02 = <b>" + f(mW, 1) + " g</b>. Ojo: el limitante no es el de menos gramos, sino el de menor moles ÷ coeficiente.</p>"); },
      () => { const t = R(5, 50), p = R(70, 98), cao = t * p / 100 * 56.08 / 100.09, co = t * p / 100 * 44.01 / 100.09; const w = pick(["CaO", "CO₂"]);
        const ok = w === "CaO" ? cao : co;
        return Q("1.3", "Una planta calcina " + t + " t de caliza con " + p + " % de CaCO₃: CaCO₃ → CaO + CO₂ (M: CaCO₃ 100,09; CaO 56,08; CO₂ 44,01). ¿Cuántas toneladas de " + w + " se producen?",
          num(ok, [t * (w === "CaO" ? 56.08 : 44.01) / 100.09, ok * p / 100, t * p / 100, t - ok], v => f(v, 2) + " t"),
          "<p>CaCO₃ puro = " + t + " × " + f(p / 100, 2) + " = " + f(t * p / 100, 2) + " t. Proporción 1:1 en moles: " + w + " = " + f(t * p / 100, 2) + " × " + (w === "CaO" ? "56,08" : "44,01") + " ÷ 100,09 = <b>" + f(ok, 2) + " t</b>. Error típico: no corregir por pureza.</p>"); },
      () => { const gN = R(2, 20) * 14, th = gN / 28.02 * 2 * 17.03, real = th * R(55, 92) / 100;
        return Q("1.3", "En la síntesis de amoníaco (N₂ + 3 H₂ → 2 NH₃) se usan " + gN + " g de N₂ con H₂ en exceso y se obtienen " + f(real, 1) + " g de NH₃. ¿Cuál es el rendimiento porcentual? (M: N₂ 28,02; NH₃ 17,03)",
          num(real / th * 100, [real / (gN / 28.02 * 17.03) * 100, real / gN * 100, th / real * 100, real / th * 50], v => f(v, 1) + " %"),
          "<p>Teórico: " + gN + " ÷ 28,02 = " + f(gN / 28.02, 3) + " mol N₂ → × 2 = " + f(gN / 28.02 * 2, 3) + " mol NH₃ × 17,03 = " + f(th, 1) + " g. Rendimiento = " + f(real, 1) + " ÷ " + f(th, 1) + " × 100 = <b>" + f(real / th * 100, 1) + " %</b>.</p>"); },
      () => { const t = R(10, 100), p = R(50, 85), fe = t * p / 100 * 2 * 55.85 / 159.69;
        return Q("1.3", "Un alto horno procesa " + t + " t de mineral con " + p + " % de hematita (Fe₂O₃, M = 159,69). Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂ (Fe = 55,85). ¿Cuánto hierro se obtiene como máximo?",
          num(fe, [t * p / 100 * 55.85 / 159.69, t * 2 * 55.85 / 159.69, t * p / 100, fe * 1.5], v => f(v, 2) + " t"),
          "<p>Fe₂O₃ puro = " + f(t * p / 100, 2) + " t. Cada 159,69 t de Fe₂O₃ dan 2 × 55,85 = 111,70 t de Fe. Fe = " + f(t * p / 100, 2) + " × 111,70 ÷ 159,69 = <b>" + f(fe, 2) + " t</b>.</p>"); }],
    "2.1":[
      () => { const g = pick(GAS), kg = R(1, 50), T = R(0, 40), P = pick([1, 1, 0.8, 2]); const n = kg * 1000 / g[1], V = n * 0.08206 * K(T) / P / 1000;
        return Q("2.1", "Una planta emite " + kg + " kg de " + g[0] + " (M = " + f(g[1], 2) + " g/mol). ¿Qué volumen ocupa ese gas a " + T + " °C y " + f(P, 1) + " atm, considerándolo ideal?",
          num(V, [n * 0.08206 * T / P / 1000, n * 8.314 * K(T) / P / 1000, V * 1000, kg * 0.08206 * K(T) / P], v => f(v, 2) + " m³"),
          "<p>n = " + kg + ".000 g ÷ " + f(g[1], 2) + " = " + f(n, 1) + " mol. T = " + T + " + 273,15 = " + f(K(T), 2) + " K. V = nRT ÷ P = " + f(n, 1) + " × 0,08206 × " + f(K(T), 2) + " ÷ " + f(P, 1) + " = " + f(V * 1000, 0) + " L = <b>" + f(V, 2) + " m³</b>.</p>"); },
      () => { const g = pick(GAS.filter(x => ["SO₂", "NO₂", "CO₂", "CH₄"].includes(x[0]))), ppm = +(R(2, 80) / 100).toFixed(2), c = ppm * g[1] * 1000 / 24.45;
        return Q("2.1", "Una estación de monitoreo mide " + f(ppm, 2) + " ppm de " + g[0] + " (M = " + f(g[1], 2) + " g/mol) a 25 °C y 1 atm. Expresado en µg/m³, la concentración es:",
          num(c, [ppm * g[1] * 1000 / 22.4, ppm * 1000 / 24.45, c * 1.25, c / 10], v => f(v, 0) + " µg/m³"),
          "<p>C = ppm × M × 1.000 ÷ 24,45 = " + f(ppm, 2) + " × " + f(g[1], 2) + " × 1.000 ÷ 24,45 = <b>" + f(c, 0) + " µg/m³</b>. Así se compara con las normas de calidad del aire, que están en µg/m³.</p>"); },
      () => { const pt = pick([1, 0.77, 0.9, 0.65]), lugar = { 1:"a nivel del mar", 0.77:"en Calama (unos 2.260 m)", 0.9:"en Santiago (unos 520 m), aproximadamente", 0.65:"en una faena minera a unos 3.500 m" }[pt];
        return Q("2.1", "El aire tiene 21 % de O₂ en volumen. ¿Cuál es la presión parcial de O₂ " + lugar + ", si la presión atmosférica es " + f(pt, 2) + " atm?",
          num(0.21 * pt, [0.21, pt, 0.79 * pt, 0.21 / pt], v => f(v, 3) + " atm"),
          "<p>Dalton: P(O₂) = x(O₂) × P total = 0,21 × " + f(pt, 2) + " = <b>" + f(0.21 * pt, 3) + " atm</b>. En altura hay menos O₂ disponible: afecta a las personas y a la combustión de motores y calderas.</p>"); },
      pool("2.1", [
        ["¿Cuál NO es un supuesto del modelo de gas ideal?", "Las moléculas se atraen fuertemente entre sí", ["Las moléculas tienen volumen despreciable", "Los choques son elásticos", "Se mueven al azar", "Su energía cinética promedio es proporcional a T en K"], "En el gas ideal no hay fuerzas entre moléculas."],
        ["Un gas real se parece más a un gas ideal a:", "Baja presión y alta temperatura", ["Alta presión y baja temperatura", "Alta presión y alta temperatura", "Cerca del punto de licuación", "Cualquier condición"], "Las moléculas están lejos y se mueven rápido."],
        ["El CO₂ (44 g/mol) se acumula en zonas bajas y espacios confinados porque:", "Es más denso que el aire (≈ 29 g/mol)", ["Es más liviano que el aire", "Reacciona con el suelo", "Es un líquido a 25 °C", "No es un gas ideal"], "d = PM ÷ RT: a mayor M, mayor densidad."],
        ["El volumen molar de un gas ideal a 0 °C y 1 atm es:", "22,4 L/mol", ["24,45 L/mol", "1 L/mol", "8,314 L/mol", "0,08206 L/mol"], "A 25 °C es 24,45 L/mol."],
        ["La inversión térmica en Santiago empeora la contaminación porque:", "El aire frío y denso queda abajo y no sube, atrapando los contaminantes", ["Aumenta el viento", "El aire caliente queda abajo", "Llueve más", "Baja la presión atmosférica"], "El aire de abajo no se mezcla con el de arriba."]])],
    "2.2":[
      () => { const P1 = pick([1, 1.5, 2, 3]), V1 = R(5, 40), P2 = pick([2.5, 3.5, 4, 5, 6, 8].filter(x => x > P1)), V2 = P1 * V1 / P2;
        return Q("2.2", "Un compresor toma " + V1 + " L de aire a " + f(P1, 1) + " atm y lo comprime, a temperatura constante, hasta " + f(P2, 1) + " atm. ¿Qué volumen ocupa?",
          num(V2, [P2 * V1 / P1, V1, P1 * V1 * P2, V1 / P2], v => f(v, 2) + " L"),
          "<p>Boyle (T constante): P₁V₁ = P₂V₂ → V₂ = " + f(P1, 1) + " × " + V1 + " ÷ " + f(P2, 1) + " = <b>" + f(V2, 2) + " L</b>. Si la presión sube, el volumen debe bajar.</p>"); },
      () => { const V1 = R(2, 30), T1 = R(10, 35), T2 = R(60, 200), V2 = V1 * K(T2) / K(T1);
        return Q("2.2", "Un globo de " + V1 + " L está a " + T1 + " °C. Se calienta a presión constante hasta " + T2 + " °C. ¿Cuál es su nuevo volumen?",
          num(V2, [V1 * T2 / T1, V1 * K(T1) / K(T2), V1 + (T2 - T1), V2 * 1.2], v => f(v, 2) + " L"),
          "<p>Charles (P constante): V₂ = V₁ × T₂ ÷ T₁ en kelvin = " + V1 + " × " + f(K(T2), 2) + " ÷ " + f(K(T1), 2) + " = <b>" + f(V2, 2) + " L</b>. Error típico: usar °C (" + V1 + " × " + T2 + " ÷ " + T1 + " = " + f(V1 * T2 / T1, 2) + " L).</p>"); },
      () => { const P1 = +(R(18, 35) / 10).toFixed(1), T1 = R(10, 25), T2 = R(40, 75), P2 = P1 * K(T2) / K(T1);
        return Q("2.2", "Un cilindro rígido de gas está a " + f(P1, 1) + " atm y " + T1 + " °C. Queda al sol y llega a " + T2 + " °C. ¿Cuál es la nueva presión?",
          num(P2, [P1 * T2 / T1, P1 * K(T1) / K(T2), P1, P2 + 1], v => f(v, 2) + " atm"),
          "<p>Gay-Lussac (V constante): P₂ = P₁ × T₂ ÷ T₁ = " + f(P1, 1) + " × " + f(K(T2), 2) + " ÷ " + f(K(T1), 2) + " = <b>" + f(P2, 2) + " atm</b>. Por eso los cilindros no se dejan al sol.</p>"); },
      () => { const P1 = 1, V1 = R(100, 900), T1 = R(15, 30), P2 = pick([2, 3, 5, 8]), T2 = R(40, 120), V2 = P1 * V1 * K(T2) / (K(T1) * P2);
        return Q("2.2", "En una chimenea, " + V1 + " m³ de gases a 1 atm y " + T1 + " °C se comprimen a " + P2 + " atm y se calientan a " + T2 + " °C. ¿Qué volumen ocupan?",
          num(V2, [V1 * T2 / (T1 * P2), V1 * P2 * K(T2) / K(T1), V1 / P2, V1 * K(T1) / (K(T2) * P2)], v => f(v, 1) + " m³"),
          "<p>Ley combinada: V₂ = P₁V₁T₂ ÷ (T₁P₂) = 1 × " + V1 + " × " + f(K(T2), 2) + " ÷ (" + f(K(T1), 2) + " × " + P2 + ") = <b>" + f(V2, 1) + " m³</b>.</p>"); },
      pool("2.2", [
        ["Si a temperatura constante la presión de un gas se triplica, su volumen:", "Se reduce a un tercio", ["Se triplica", "No cambia", "Se reduce a la mitad", "Se multiplica por 9"], "Boyle: P y V son inversamente proporcionales."],
        ["La ley que relaciona volumen y temperatura a presión constante es la de:", "Charles", ["Boyle", "Gay-Lussac", "Dalton", "Avogadro"], "V₁ ÷ T₁ = V₂ ÷ T₂."],
        ["Si la temperatura absoluta de un gas en un recipiente rígido se duplica, su presión:", "Se duplica", ["Se reduce a la mitad", "No cambia", "Se cuadruplica", "Baja a cero"], "Gay-Lussac: P proporcional a T (en K)."],
        ["¿Por qué en las leyes de los gases la temperatura debe estar en kelvin?", "Porque las leyes son proporcionales a la temperatura absoluta; en °C aparecen ceros y negativos sin sentido", ["Por convención internacional solamente", "Porque el kelvin es más preciso", "Porque así R vale 1", "Da lo mismo usar °C"], "A 0 °C la fórmula con °C daría volumen cero."],
        ["A igual presión y temperatura, volúmenes iguales de gases distintos contienen:", "El mismo número de moles (Avogadro)", ["La misma masa", "La misma densidad", "Distinto número de moléculas", "El mismo número de átomos siempre"], "V proporcional a n."]])],
    "2.3":[
      () => { const m1 = R(5, 500), m2 = R(1, 20); return Q("2.3", "Un relleno sanitario emite " + m1 + " t de CH₄ al año y una planta de fertilizantes " + m2 + " t de N₂O. Con PCG a 100 años de 28 (CH₄) y 265 (N₂O), ¿cuánto suman en CO₂e?",
          num(m1 * 28 + m2 * 265, [m1 + m2, m1 * 265 + m2 * 28, (m1 + m2) * 28, m1 * 28], v => f(v) + " t CO₂e"),
          "<p>CO₂e = Σ m × PCG = " + m1 + " × 28 + " + m2 + " × 265 = " + f(m1 * 28) + " + " + f(m2 * 265) + " = <b>" + f(m1 * 28 + m2 * 265) + " t CO₂e</b>.</p>"); },
      () => { const T0 = R(10, 30), h = R(2, 9), T = T0 - 6.5 * h; return Q("2.3", "En la troposfera la temperatura baja en promedio 6,5 °C por km. Si en la superficie hay " + T0 + " °C, ¿qué temperatura aproximada habrá a " + h + " km de altura?",
          num(T, [T0 + 6.5 * h, T0 - 6.5, T0 - 10 * h, T0 - h], v => f(v, 1) + " °C"),
          "<p>T(h) ≈ T₀ − 6,5 × h = " + T0 + " − 6,5 × " + h + " = <b>" + f(T, 1) + " °C</b>. En la estratosfera la tendencia se invierte por la absorción de UV del ozono.</p>"); },
      pool("2.3", [
        ["El gas más abundante del aire seco es:", "N₂ (78 %)", ["O₂ (21 %)", "CO₂ (0,04 %)", "Ar (0,9 %)", "Vapor de agua"], "Nitrógeno 78,08 %."],
        ["La capa de ozono está en la:", "Estratosfera", ["Troposfera", "Mesosfera", "Termosfera", "Exosfera"], "Entre unos 15 y 35 km."],
        ["En la capa donde ocurren el clima y casi toda la contaminación, la temperatura:", "Baja con la altura (troposfera)", ["Sube con la altura", "Es constante", "Sube por el ozono", "Baja a −90 °C"], "La troposfera contiene ~75 % de la masa del aire."],
        ["¿Cuál NO es un gas de efecto invernadero?", "N₂", ["CO₂", "CH₄", "N₂O", "Vapor de agua"], "El N₂ no absorbe radiación infrarroja."],
        ["Sin efecto invernadero natural, la temperatura media de la Tierra sería cercana a:", "−18 °C", ["+15 °C", "0 °C", "+30 °C", "−50 °C"], "Hoy es de unos +15 °C gracias al efecto natural."],
        ["El agujero de la capa de ozono lo causan principalmente:", "Los CFC (clorofluorocarbonos)", ["El CO₂", "El metano", "El vapor de agua", "El material particulado"], "Se controla con el Protocolo de Montreal; es distinto del cambio climático."],
        ["La concentración de CO₂ pasó de unas 280 ppm (preindustrial) a:", "Más de 420 ppm hoy", ["Unas 300 ppm", "Unas 1.000 ppm", "Unas 150 ppm", "No ha cambiado"], "El aumento se debe sobre todo a combustibles fósiles."],
        ["La ley chilena que fija la meta de carbono neutralidad a 2050 es la:", "Ley 21.455 (Ley Marco de Cambio Climático)", ["Ley 19.300", "Ley 20.920 (REP)", "Ley 16.744", "Ley 20.780"], "Publicada en 2022."],
        ["¿Qué retroalimentación amplifica el calentamiento?", "El deshielo baja el albedo y se absorbe más energía", ["Más nubes siempre enfrían", "El CO₂ se destruye con el calor", "El ozono absorbe el CO₂", "La lluvia ácida enfría el planeta"], "Menos hielo = superficie más oscura = más absorción."],
        ["Reducir emisiones con energía renovable es una medida de:", "Mitigación", ["Adaptación", "Compensación obligatoria", "Remediación de suelos", "Control de MP"], "Adaptación sería prepararse para los efectos (riego, desalación)."]])],
    "2.4":[
      () => { const E = R(100, 900), e1 = R(70, 90), e2 = pick([95, 98, 99, 99.5]), S = E * (1 - e1 / 100) * (1 - e2 / 100), tot = (1 - (1 - e1 / 100) * (1 - e2 / 100)) * 100;
        return Q("2.4", "Una caldera emite " + E + " kg/h de partículas. Se instala un ciclón (" + e1 + " %) seguido de un filtro de mangas (" + f(e2, 1) + " %). ¿Cuántos kg/h salen a la atmósfera?",
          num(S, [E * (1 - Math.min(0.999, (e1 + e2) / 100 / 2)), E * (1 - e2 / 100), E * (1 - e1 / 100), E * (1 - e1 / 100) * e2 / 100], v => f(v, 2) + " kg/h"),
          "<p>Sale del ciclón: " + E + " × (1 − " + f(e1 / 100, 2) + ") = " + f(E * (1 - e1 / 100), 1) + " kg/h. Sale del filtro: " + f(E * (1 - e1 / 100), 1) + " × (1 − " + f(e2 / 100, 3) + ") = <b>" + f(S, 2) + " kg/h</b>. Eficiencia global = " + f(tot, 2) + " %. Las eficiencias no se suman: se multiplican las fracciones que pasan.</p>"); },
      () => { const E = R(50, 500), S = +(E * R(1, 15) / 100).toFixed(1); return Q("2.4", "A un precipitador electrostático entran " + E + " kg/h de material particulado y salen " + f(S, 1) + " kg/h. ¿Cuál es su eficiencia de remoción?",
          num((E - S) / E * 100, [S / E * 100, (E - S) / E * 90, 100 - (E - S) / E * 50], v => f(v, 1) + " %"),
          "<p>η = (E − S) ÷ E × 100 = (" + E + " − " + f(S, 1) + ") ÷ " + E + " × 100 = <b>" + f((E - S) / E * 100, 1) + " %</b>.</p>"); },
      () => { const t = R(2, 20), ca = t * 1000000 / 64.07 * 100.09 / 1e6; return Q("2.4", "Una fundición captura " + t + " t/día de SO₂ en un lavador con caliza: SO₂ + CaCO₃ + ½ O₂ → CaSO₄ + CO₂ (M: SO₂ 64,07; CaCO₃ 100,09). ¿Cuánta caliza pura se necesita como mínimo?",
          num(ca, [t, t * 64.07 / 100.09, ca * 2, t * 100.09 / 44.01], v => f(v, 2) + " t/día"),
          "<p>Proporción 1:1 en moles. CaCO₃ = " + t + " × 100,09 ÷ 64,07 = <b>" + f(ca, 2) + " t/día</b> (en la práctica se agrega un exceso).</p>"); },
      pool("2.4", [
        ["¿Cuál es un contaminante secundario?", "Ozono troposférico", ["Monóxido de carbono", "Dióxido de azufre", "Plomo", "Material particulado de un camino de tierra"], "Se forma por reacción de NOx y COV con luz solar."],
        ["Para retener MP2,5 con más de 99 % de eficiencia en un gran caudal de gases conviene:", "Un precipitador electrostático o un filtro de mangas", ["Una cámara de sedimentación", "Un ciclón", "Un convertidor catalítico", "Una chimenea más alta"], "Los ciclones son ineficientes en partículas finas."],
        ["El SO₂ de una fundición de cobre se controla con:", "Captura en planta de ácido sulfúrico o lavado con caliza", ["Un ciclón", "Un filtro de mangas", "Un convertidor de tres vías", "Carbón activado para COV"], "El SO₂ es un gas: se absorbe o se convierte."],
        ["Los NOx de una central térmica se reducen con:", "Reducción catalítica selectiva (amoníaco o urea + catalizador)", ["Un filtro de mangas", "Un ciclón", "Lavado con caliza", "Una cámara de sedimentación"], "Se convierten en N₂ y H₂O."],
        ["Una zona donde la concentración está entre el 80 % y el 100 % de la norma primaria se declara:", "Zona latente", ["Zona saturada", "Zona de emergencia", "Zona franca", "Zona de sacrificio"], "Saturada es cuando la supera."],
        ["La norma que limita lo que sale por la chimenea de una fuente es una:", "Norma de emisión", ["Norma primaria de calidad", "Norma secundaria de calidad", "Norma ISO 14001", "Resolución de calificación ambiental"], "Las normas de calidad regulan el aire que respiramos."],
        ["Una norma primaria de calidad del aire protege:", "La salud de las personas", ["Los suelos y la vegetación", "El patrimonio cultural", "A los trabajadores dentro de la planta", "Los recursos hídricos"], "La secundaria protege recursos naturales."],
        ["Cuando una zona se declara saturada, la autoridad debe dictar:", "Un plan de descontaminación atmosférica (PPDA)", ["Un estudio de impacto ambiental", "Una norma ISO", "Un impuesto verde", "Una RCA"], "Ley 19.300."],
        ["El MP2,5 en Temuco y Coyhaique proviene principalmente de:", "La calefacción a leña", ["Las fundiciones", "Los aviones", "El ozono", "Las centrales hidroeléctricas"], "Por eso los PPDA incluyen recambio de calefactores."],
        ["El convertidor catalítico de tres vías de un auto controla:", "CO, hidrocarburos y NOx", ["SO₂ y MP", "Solo CO₂", "Plomo y ozono", "Solo partículas"], "Oxida CO y HC y reduce NOx."]])],
    "3.1":[
      () => { const RX = [["CH₄ + 2 O₂ → CO₂ + 2 H₂O(l)", -890.3, "[−393,5 + 2(−285,8)] − [−74,8 + 0]", -393.5 - 285.8 + 74.8], ["C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O(l)", -2219.9, "[3(−393,5) + 4(−285,8)] − [−103,8]", -393.5 - 285.8 + 103.8], ["C₂H₅OH(l) + 3 O₂ → 2 CO₂ + 3 H₂O(l)", -1366.7, "[2(−393,5) + 3(−285,8)] − [−277,7]", -393.5 - 285.8 + 277.7], ["CaCO₃ → CaO + CO₂", 178.3, "[−635,1 + (−393,5)] − [−1.206,9]", 178.3], ["CO + ½ O₂ → CO₂", -283.0, "[−393,5] − [−110,5]", -283.0]]; const r = pick(RX);
        return Q("3.1", "Con las entalpías de formación (kJ/mol): CO₂ −393,5; H₂O(l) −285,8; CH₄ −74,8; C₃H₈ −103,8; C₂H₅OH(l) −277,7; CaCO₃ −1.206,9; CaO −635,1; CO −110,5; O₂ 0. Calcula ΔH° de " + r[0] + ".",
          num(r[1], [-r[1], r[3], r[1] * 2, r[1] / 2], v => (v > 0 ? "+" : "") + f(v, 1) + " kJ/mol"),
          "<p>ΔH°r = Σ n·ΔH°f(productos) − Σ n·ΔH°f(reactivos) = " + r[2] + " = <b>" + (r[1] > 0 ? "+" : "") + f(r[1], 1) + " kJ/mol</b>: " + (r[1] < 0 ? "exotérmica (libera calor)." : "endotérmica (absorbe calor).") + "</p>"); },
      () => { const m = R(100, 2000), T1 = R(10, 20), T2 = R(45, 90), q = m * 4.184 * (T2 - T1) / 1000;
        return Q("3.1", "Un hotel calienta " + f(m) + " L de agua de " + T1 + " °C a " + T2 + " °C (c = 4,184 kJ/(kg·°C); 1 L ≈ 1 kg). ¿Cuánta energía se necesita?",
          num(q, [m * 4.184 * T2 / 1000, m * (T2 - T1) / 1000, q * 1000 / 1000 / 4.184, q * 2], v => f(v, 1) + " MJ"),
          "<p>q = m·c·ΔT = " + f(m) + " × 4,184 × (" + T2 + " − " + T1 + ") = " + f(q * 1000, 0) + " kJ = <b>" + f(q, 1) + " MJ</b>.</p>"); },
      () => { const q = R(100, 900), eta = R(70, 95), pc = pick([[55.5, "gas natural (metano)"], [50.3, "gas licuado (propano)"], [45.5, "diésel"]]), m = q / (pc[0] * eta / 100);
        return Q("3.1", "Un proceso necesita " + q + " MJ de calor útil. Se usa " + pc[1] + " (poder calorífico " + f(pc[0], 1) + " MJ/kg) en una caldera de " + eta + " % de eficiencia. ¿Cuántos kg de combustible se queman?",
          num(m, [q / pc[0], q / pc[0] * eta / 100, q * eta / 100, m * 1.3], v => f(v, 2) + " kg"),
          "<p>m = q ÷ (PC × η) = " + q + " ÷ (" + f(pc[0], 1) + " × " + f(eta / 100, 2) + ") = <b>" + f(m, 2) + " kg</b>. Sin la eficiencia darías " + f(q / pc[0], 2) + " kg: la caldera pierde parte del calor por la chimenea.</p>"); },
      () => { const fu = pick(FUEL.slice(0, 4)), kg = R(1, 20), Qm = kg * 1000 / fu[2] * -fu[4] / 1000;
        return Q("3.1", "¿Cuánta energía libera la combustión completa de " + kg + " kg de " + fu[0] + " (" + fu[1] + ", M = " + f(fu[2], 2) + " g/mol; ΔH°c = " + f(fu[4], 1) + " kJ/mol)?",
          num(Qm, [kg * -fu[4] / 1000, kg / fu[2] * -fu[4], Qm * fu[3], Qm / 2], v => f(v, 1) + " MJ"),
          "<p>Moles = " + kg + ".000 ÷ " + f(fu[2], 2) + " = " + f(kg * 1000 / fu[2], 1) + " mol. Q = " + f(kg * 1000 / fu[2], 1) + " × " + f(-fu[4], 1) + " kJ = " + f(Qm * 1000, 0) + " kJ = <b>" + f(Qm, 1) + " MJ</b>.</p>"); },
      pool("3.1", [
        ["Una reacción con ΔH = −250 kJ es:", "Exotérmica: libera calor al entorno", ["Endotérmica: absorbe calor", "Isotérmica", "Imposible", "Endotérmica porque el signo es negativo"], "ΔH negativo = libera."],
        ["Si A → B tiene ΔH = +80 kJ, entonces 2 B → 2 A tiene:", "−160 kJ", ["+80 kJ", "−80 kJ", "+160 kJ", "0 kJ"], "Invertir cambia el signo y duplicar multiplica por 2."],
        ["La entalpía estándar de formación del O₂(g) es:", "0 kJ/mol", ["−393,5 kJ/mol", "−285,8 kJ/mol", "+100 kJ/mol", "Depende de la masa"], "Los elementos en su estado estándar valen 0."],
        ["La calcinación de la caliza (CaCO₃ → CaO + CO₂, ΔH = +178 kJ/mol) es:", "Endotérmica: requiere entregar calor", ["Exotérmica", "Una combustión", "Una neutralización", "Espontánea a temperatura ambiente"], "Por eso los hornos de cal queman combustible."],
        ["La combustión libera energía porque:", "Los enlaces que se forman (C=O, O–H) son más fuertes que los que se rompen", ["Se destruye masa", "El oxígeno tiene energía nuclear", "Los productos tienen más energía que los reactivos", "Se rompen más enlaces de los que se forman"], "Formar enlaces fuertes libera más energía de la que cuesta romper los débiles."],
        ["El poder calorífico superior (PCS) es mayor que el inferior (PCI) porque:", "Incluye el calor de condensación del agua formada", ["Usa más oxígeno", "Se mide a mayor presión", "Considera combustión incompleta", "Es un error de medición"], "Si el vapor condensa, se recupera ese calor."]])],
    "3.2":[
      () => { const Tc = R(350, 650), Tf = R(15, 45), e = 1 - K(Tf) / K(Tc);
        return Q("3.2", "Una central térmica opera con vapor a " + Tc + " °C y descarga calor a " + Tf + " °C. ¿Cuál es su eficiencia máxima teórica (Carnot)?",
          num(e * 100, [(1 - Tf / Tc) * 100, K(Tf) / K(Tc) * 100, e * 60, (Tc - Tf) / Tc * 50], v => f(v, 1) + " %"),
          "<p>η = 1 − T_f ÷ T_c con kelvin = 1 − " + f(K(Tf), 2) + " ÷ " + f(K(Tc), 2) + " = <b>" + f(e * 100, 1) + " %</b>. La central real logra bastante menos (35 a 45 %). Con °C el resultado sería incorrecto (" + f((1 - Tf / Tc) * 100, 1) + " %).</p>"); },
      () => { const Qc = R(5, 60), H = R(20, 300), eta = R(85, 92), P = 1000 * 9.81 * Qc * H * eta / 100 / 1e6;
        return Q("3.2", "Una central hidroeléctrica tiene un caudal de " + Qc + " m³/s, una caída de " + H + " m y una eficiencia de " + eta + " %. ¿Qué potencia entrega?",
          num(P, [1000 * 9.81 * Qc * H / 1e6, Qc * H * eta / 100 / 1000, P * 1000 / 9.81 / 1000, P / 2], v => f(v, 2) + " MW"),
          "<p>P = ρ·g·Q·H·η = 1.000 × 9,81 × " + Qc + " × " + H + " × " + f(eta / 100, 2) + " = " + f(P * 1e6, 0) + " W = <b>" + f(P, 2) + " MW</b>.</p>"); },
      () => { const D = R(6, 13) * 10, v = R(6, 12), cp = R(35, 45) / 100, A = Math.PI * D * D / 4, P = 0.5 * 1.225 * A * v * v * v * cp / 1e6;
        return Q("3.2", "Un aerogenerador tiene un rotor de " + D + " m de diámetro, el viento sopla a " + v + " m/s y su Cₚ es " + f(cp, 2) + " (ρ = 1,225 kg/m³). ¿Qué potencia genera?",
          num(P, [0.5 * 1.225 * A * v * v * cp / 1e6, 0.5 * 1.225 * Math.PI * D * D * v * v * v * cp / 1e6, P / cp, P * 2], v2 => f(v2, 2) + " MW"),
          "<p>A = π·D² ÷ 4 = " + f(A, 0) + " m². P = ½·ρ·A·v³·Cₚ = 0,5 × 1,225 × " + f(A, 0) + " × " + v + "³ × " + f(cp, 2) + " = <b>" + f(P, 2) + " MW</b>. Ojo con el cubo: si el viento baja a la mitad, la potencia cae a 1/8.</p>"); },
      () => { const Ar = R(2, 40) * 10, eta = R(18, 23), G = pick([800, 900, 1000]), P = G * Ar * eta / 100 / 1000, h = R(5, 9);
        return Q("3.2", "Una bodega instala " + Ar + " m² de paneles fotovoltaicos de " + eta + " % de eficiencia. Con una irradiancia de " + G + " W/m², ¿qué potencia entregan y cuánta energía producen en " + h + " horas equivalentes de sol pleno?",
          txt(f(P, 1) + " kW y " + f(P * h, 0) + " kWh", [f(G * Ar / 1000, 1) + " kW y " + f(G * Ar / 1000 * h, 0) + " kWh", f(P, 1) + " kW y " + f(P / h, 1) + " kWh", f(P * 10, 1) + " kW y " + f(P * 10 * h, 0) + " kWh", f(P, 1) + " kW y " + f(P * 24, 0) + " kWh"]),
          "<p>P = G·A·η = " + G + " × " + Ar + " × " + f(eta / 100, 2) + " = " + f(P * 1000, 0) + " W = " + f(P, 1) + " kW. E = P × t = " + f(P, 1) + " × " + h + " = <b>" + f(P * h, 0) + " kWh</b>.</p>"); },
      pool("3.2", [
        ["¿Qué ley impide que una central térmica tenga 100 % de eficiencia?", "La segunda ley de la termodinámica", ["La primera ley", "La ley cero", "La ley de Boyle", "La ley de Hess"], "Siempre se cede calor a la fuente fría."],
        ["La primera ley de la termodinámica establece que:", "La energía se conserva: solo se transforma", ["La entropía siempre disminuye", "El calor fluye de frío a caliente", "Toda la energía se puede convertir en trabajo", "La masa se convierte en energía en toda reacción"], "ΔU = Q − W."],
        ["¿Cuál fuente tiene la mayor eficiencia de conversión?", "Hidroeléctrica (85 a 90 %)", ["Termoeléctrica a carbón", "Solar fotovoltaica", "Biomasa", "Geotérmica"], "Convierte energía potencial con pocas pérdidas."],
        ["Si la velocidad del viento se duplica, la potencia de un aerogenerador:", "Se multiplica por 8", ["Se duplica", "Se cuadruplica", "No cambia", "Se reduce a la mitad"], "P depende de v³."],
        ["El límite de Betz indica que un aerogenerador puede captar como máximo:", "59,3 % de la energía del viento", ["100 %", "33 %", "90 %", "25 %"], "Es el máximo teórico."],
        ["La energía nuclear de fisión, en operación:", "Casi no emite CO₂, pero genera residuos radiactivos", ["Emite más CO₂ que el carbón", "No genera residuos", "Usa el viento", "Funciona con hidrógeno"], "Emisiones de ciclo de vida ≈ 12 g CO₂e/kWh."],
        ["El mayor emisor de CO₂ por kWh entre estas fuentes es:", "Carbón", ["Gas natural en ciclo combinado", "Eólica", "Nuclear", "Hidroeléctrica"], "≈ 820 g CO₂e/kWh."],
        ["La biomasa se considera con bajo aporte neto de CO₂ porque:", "El CO₂ que emite fue absorbido antes por las plantas (ciclo biogénico)", ["No emite CO₂ al quemarse", "Su eficiencia es 100 %", "No produce material particulado", "Es energía nuclear"], "Aun así genera MP local."],
        ["Una central de ciclo combinado es más eficiente que una a carbón porque:", "Aprovecha el calor de escape de la turbina a gas para generar vapor", ["Quema más combustible", "No tiene pérdidas", "Funciona sin fuente fría", "Usa energía solar"], "Dos ciclos en serie: 50 a 60 %."],
        ["En el norte de Chile, la principal ventaja de la energía solar es:", "La alta irradiación, de las mejores del mundo", ["Que genera de noche", "Que no necesita área", "Que su eficiencia supera 60 %", "Que no requiere inversión"], "Su desventaja es la variabilidad (solo de día)."]])],
    "3.3":[
      () => { const kwh = R(20, 900) * 1000, l = R(5, 200) * 1000, e2 = kwh * 0.2421 / 1000, e1 = l * 2.68 / 1000;
        return Q("3.3", "Una planta consumió en el año " + f(kwh) + " kWh de electricidad (factor 0,2421 kg CO₂e/kWh) y " + f(l) + " L de diésel en grúas propias (2,68 kg CO₂/L). ¿Cuál es su huella de alcances 1 + 2?",
          num(e1 + e2, [e1, e2, (kwh + l) * 0.2421 / 1000, kwh * 2.68 / 1000 + l * 0.2421 / 1000], v => f(v, 1) + " t CO₂e"),
          "<p>Alcance 1 (diésel): " + f(l) + " × 2,68 = " + f(e1, 1) + " t. Alcance 2 (electricidad): " + f(kwh) + " × 0,2421 = " + f(e2, 1) + " t. Total = <b>" + f(e1 + e2, 1) + " t CO₂e</b>.</p>"); },
      () => { const h = R(500, 9000), p = R(2, 50) * 1000, I = h / p * 1000; return Q("3.3", "Una fábrica de envases tiene una huella de " + f(h) + " t CO₂e y produjo " + f(p) + " t de envases. ¿Cuál es su intensidad de emisiones?",
          num(I, [I / 10, I * 1.5, I * 10], v => f(v, 1) + " kg CO₂e por t"),
          "<p>Intensidad = huella ÷ producción = " + f(h) + " t ÷ " + f(p) + " t = " + f(h / p, 4) + " t/t = <b>" + f(I, 1) + " kg CO₂e por tonelada</b>. Permite comparar años con distinta producción.</p>"); },
      () => { const kg = R(5, 100), g = pick([["R-134a", 1300], ["R-410A", 1924], ["R-404A", 3943]]), e = kg * g[1] / 1000;
        return Q("3.3", "En el año se recargaron " + kg + " kg de refrigerante " + g[0] + " en las cámaras de frío (fugas). Con un PCG de " + f(g[1]) + ", ¿cuánto aporta a la huella y en qué alcance?",
          txt(f(e, 1) + " t CO₂e, alcance 1", [f(e, 1) + " t CO₂e, alcance 2", f(kg / 1000, 3) + " t CO₂e, alcance 1", f(e, 1) + " t CO₂e, alcance 3", f(e * 1000, 0) + " t CO₂e, alcance 1"]),
          "<p>E = masa × PCG = " + kg + " kg × " + f(g[1]) + " = " + f(kg * g[1]) + " kg = <b>" + f(e, 1) + " t CO₂e</b>. Las fugas de equipos propios son emisiones directas: <b>alcance 1</b>. Verifica el PCG vigente de cada gas.</p>"); },
      pool("3.3", [
        ["La electricidad comprada a la red pertenece al:", "Alcance 2", ["Alcance 1", "Alcance 3", "No se contabiliza", "Alcance 1 si es renovable"], "Emisiones indirectas por energía comprada."],
        ["El diésel de los camiones propios de la empresa es:", "Alcance 1", ["Alcance 2", "Alcance 3", "No se cuenta", "Alcance 2 si se compra a un distribuidor"], "Combustión en fuentes propias o controladas."],
        ["El transporte de productos que hace una empresa contratada es:", "Alcance 3", ["Alcance 1", "Alcance 2", "No se cuenta", "Alcance 1 si se paga por viaje"], "Otras emisiones indirectas de la cadena de valor."],
        ["El CO₂ que se libera al calcinar caliza en un horno de cal es:", "Alcance 1, emisión de proceso", ["Alcance 2", "Alcance 3", "No se cuenta porque no es combustión", "Biogénico"], "Viene de la química del proceso, no del combustible."],
        ["La norma ISO para la huella de carbono de un producto es:", "ISO 14067", ["ISO 14064-1", "ISO 9001", "ISO 45001", "ISO 14001"], "La 14064-1 es para organizaciones."],
        ["El programa del Ministerio del Medio Ambiente que reconoce a las organizaciones que miden y reducen su huella es:", "HuellaChile", ["SEIA", "Ley REP", "RETC", "PPDA"], "Entrega sellos de cuantificación, reducción y neutralización."],
        ["En la jerarquía para reducir la huella, la compensación con bonos de carbono va:", "Al final, solo para lo que no se pudo evitar ni reducir", ["Primero, porque es más barato", "En lugar de medir", "Antes de reducir", "Nunca se permite"], "Evitar → reducir → sustituir → compensar."],
        ["Para comparar la huella de dos años con distinta producción conviene usar:", "La intensidad (CO₂e por unidad producida)", ["La huella total", "Solo el alcance 1", "El número de trabajadores", "El precio de los bonos de carbono"], "Normaliza por la actividad."]])]
  };

  /* ======================= ARMADO DEL CERTAMEN ======================= */
  const BANK = { "ramo-intro-optimizacion":{ G:OPT, n:15, t:"Introducción a los métodos de optimización", min:90 }, "ramo-quimica-ambiente":{ G:QUI, n:20, t:"Química y ambiente", min:90 } };
  const ST = {};
  const build = (id, ind) => { const B = BANK[id], keys = Object.keys(B.G), sel = ind && ind !== "all" ? [ind] : keys, out = [], used = new Set();
    const total = ind && ind !== "all" ? 8 : B.n;
    /* reparto: al menos una por indicador; el resto al azar, sin repetir el mismo generador si se puede */
    const order = ind && ind !== "all" ? [] : sh(keys);
    while (out.length < total) { const k = order.length ? order.shift() : pick(sel), gs = B.G[k]; let gi = R(0, gs.length - 1), tries = 0;
      while (used.has(k + gi) && tries++ < 6) gi = R(0, gs.length - 1); used.add(k + gi);
      let q = null; for (let t = 0; t < 5 && !q; t++) { try { q = gs[gi](); if (!q || q.ops.length < 4 || q.ok < 0) q = null; } catch (e) { q = null; } }
      if (q && !out.some(o => o.q === q.q)) out.push(q); }
    return out.sort((a, b) => a.ind.localeCompare(b.ind)); };
  const nota = p => p < 0.6 ? 1 + 3 * p / 0.6 : 4 + 3 * (p - 0.6) / 0.4;
  const qHTML = (id, qs) => qs.map((q, i) => '<fieldset class="cq" data-i="' + i + '"><legend><span class="cq-n">Pregunta ' + (i + 1) + '</span> <span class="cq-ind">Indicador ' + q.ind + "</span></legend><div class=\"cq-t\">" + q.q + "</div>" +
    q.ops.map((o, j) => '<label class="cq-o"><input type="radio" name="cq-' + id + "-" + i + '" value="' + j + '"><span><b>' + "abcd"[j] + ")</b> " + o + "</span></label>").join("") + '<div class="cq-sol" hidden></div></fieldset>').join("");
  const render = (id, ind) => { const box = document.querySelector('.cert[data-c="' + id + '"]'); if (!box) return; const qs = build(id, ind); ST[id] = { qs, done:false };
    box.querySelector(".cert-body").innerHTML = '<p class="hint">' + qs.length + " preguntas · " + (ind && ind !== "all" ? "práctica del indicador " + ind : "todos los indicadores") + " · tiempo sugerido " + Math.round(BANK[id].min * qs.length / BANK[id].n) + " minutos. Usa calculadora y la tabla de datos de cada pregunta.</p>" + qHTML(id, qs) +
      '<div class="cert-act"><button type="button" class="btn" data-cert-fix="' + id + '">Corregir certamen</button></div><div class="cert-res" aria-live="polite"></div>';
    box.querySelector(".cert-body").scrollIntoView({ block:"start" }); };
  const correct = id => { const box = document.querySelector('.cert[data-c="' + id + '"]'), S = ST[id]; if (!box || !S) return; let ok = 0; const byInd = {};
    S.qs.forEach((q, i) => { const fs = box.querySelector('.cq[data-i="' + i + '"]'), r = fs.querySelector("input:checked"), v = r ? +r.value : -1, good = v === q.ok; if (good) ok++;
      byInd[q.ind] = byInd[q.ind] || [0, 0]; byInd[q.ind][1]++; if (good) byInd[q.ind][0]++;
      fs.classList.remove("ok", "bad"); fs.classList.add(good ? "ok" : "bad"); fs.querySelectorAll(".cq-o").forEach((l, j) => { l.classList.toggle("is-ok", j === q.ok); l.classList.toggle("is-bad", j === v && !good); });
      const s = fs.querySelector(".cq-sol"); s.hidden = false; s.innerHTML = "<p><b>" + (good ? "Correcta." : v < 0 ? "Sin responder." : "Incorrecta.") + " Respuesta: " + "abcd"[q.ok] + ").</b></p><p class=\"cq-dh\">Desarrollo</p>" + q.sol.replace(/(?<!\d);\s+/g, "<br>").replace(/\.\s+(?=[A-ZÁÉÍÓÚÑ¿«(0-9])/g, ".<br>"); });
    const p = ok / S.qs.length, n = nota(p);
    box.querySelector(".cert-res").innerHTML = '<div class="cert-sum"><p class="cert-big">Nota ' + n.toFixed(1).replace(".", ",") + "</p><p>" + ok + " de " + S.qs.length + " correctas (" + Math.round(p * 100) + " %). Escala de 1,0 a 7,0 con 60 % de exigencia: el 4,0 se logra con el 60 %.</p>" +
      tbl(Object.keys(byInd).sort().map(k => [k, byInd[k][0] + " de " + byInd[k][1], byInd[k][0] === byInd[k][1] ? "Logrado" : byInd[k][0] / byInd[k][1] >= 0.5 ? "Parcial: repasa la unidad" : "No logrado: estudia la unidad y practica este indicador"])) +
      '<p>Revisa el desarrollo de cada pregunta más arriba. Luego genera otro certamen: los números y las preguntas cambian.</p><div class="cert-act"><button type="button" class="btn" data-cert-new="' + id + '">Generar otro certamen</button></div></div>';
    box.querySelector(".cert-res").scrollIntoView({ block:"start" }); };
  const tbl = rows => "<div class='tbl-wrap'><table><thead><tr><th>Indicador</th><th>Correctas</th><th>Estado</th></tr></thead><tbody>" + rows.map(r => "<tr>" + r.map(c => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
  const shell = id => { const B = BANK[id], keys = Object.keys(B.G);
    return '<div class="cert" data-c="' + id + '"><p>Certamen de práctica tipo solemne: selección múltiple con casos y problemas como los de la prueba. <b>Cada vez que lo generas cambian las preguntas y los números</b>, así puedes practicar muchas veces. Al corregir verás tu nota, el logro por indicador y el desarrollo completo de cada pregunta.</p>' +
      '<div class="cert-act no-print"><label>Practicar <select data-cert-ind="' + id + '"><option value="all">Certamen completo (' + B.n + " preguntas)</option>" + keys.map(k => '<option value="' + k + '">Solo indicador ' + k + " (8 preguntas)</option>").join("") + '</select></label> <button type="button" class="btn" data-cert-new="' + id + '">Generar certamen</button></div><div class="cert-body"></div></div>'; };

  Object.keys(BANK).forEach(id => { const c = COURSES.find(x => x.id === id); if (!c || c.u.some(u => /Certamen de práctica/.test(u[0]))) return;
    c.u.push([(c.u.length + 1) + ". Certamen de práctica (todos los indicadores)", shell(id), "raw"]); });
  document.addEventListener("click", e => { const b = e.target.closest("[data-cert-new],[data-cert-fix]"); if (!b) return;
    if (b.dataset.certNew) { const s = document.querySelector('[data-cert-ind="' + b.dataset.certNew + '"]'); render(b.dataset.certNew, s ? s.value : "all"); }
    else correct(b.dataset.certFix); });
})();
