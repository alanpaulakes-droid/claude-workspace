/* ============ CURSO · Ejercicios generados para lecciones sin datos variables + certamen de práctica por ramo ============
   Cada K.gen() devuelve { q (html), ops (texto), ok (índice), expl (html) } con datos al azar.
   El certamen de cada ramo toma sus temas (herramientas y enlaces del ramo) y mezcla ejercicios generados y preguntas conceptuales. */
(function(){
  const n = crsNum, R = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), pick = a => a[Math.floor(Math.random() * a.length)];
  const sh = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const $ = x => (x < 0 ? "−$ " : "$ ") + n(Math.abs(Math.round(x)));
  /* correcta + distractores (sin repetir al formatear); si faltan, se completan escalando la correcta */
  const opts = (ok, ds, fm) => { const seen = new Set([fm(ok)]), out = []; ds.forEach(d => { if (!isFinite(d)) return; const s = fm(d); if (!seen.has(s)) { seen.add(s); out.push(s); } });
    let k = 1; while (out.length < 3 && k < 20) { const s = fm(ok * (1 + 0.13 * k * (k % 2 ? 1 : -1))); if (!seen.has(s)) { seen.add(s); out.push(s); } k++; }
    const all = sh([fm(ok)].concat(out.slice(0, 3))); return { ops:all, ok:all.indexOf(fm(ok)) }; };
  const cls = (ok, all) => { const o = sh([ok].concat(sh(all.filter(x => x !== ok)).slice(0, 3))); return { ops:o, ok:o.indexOf(ok) }; };
  const G = (id, f) => { if (CRS[id]) CRS[id].gen = f; };
  const tbl = (h, rows) => '<div class="tbl-wrap"><table><thead><tr>' + h.map(x => "<th>" + x + "</th>").join("") + "</tr></thead><tbody>" + rows.map(r => "<tr>" + r.map(c => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";

  /* ---------- Transporte: esquina noroeste ---------- */
  G("transporte", () => { const m = 3, k = 3, of = [R(3, 7) * 10, R(3, 7) * 10, R(3, 7) * 10], tot = of[0] + of[1] + of[2], d1 = R(2, 5) * 10, d2 = R(2, 5) * 10, de = [d1, d2, tot - d1 - d2];
    if (de[2] <= 0) return null; const c = [0, 1, 2].map(() => [0, 1, 2].map(() => R(2, 12)));
    const nw = (o, d) => { o = o.slice(); d = d.slice(); let i = 0, j = 0, z = 0; while (i < m && j < k) { const q = Math.min(o[i], d[j]); z += q * c[i][j]; o[i] -= q; d[j] -= q; if (o[i] === 0) i++; else j++; } return z; };
    const mc = () => { const o = of.slice(), d = de.slice(); let z = 0; const cells = []; for (let i = 0; i < m; i++) for (let j = 0; j < k; j++) cells.push([c[i][j], i, j]); cells.sort((a, b) => a[0] - b[0]).forEach(([cc, i, j]) => { const q = Math.min(o[i], d[j]); z += q * cc; o[i] -= q; d[j] -= q; }); return z; };
    const z = nw(of, de), o = opts(z, [mc(), nw(of.slice().reverse(), de), tot * 7], v => $(v * 1000));
    return { q:"<p>Tres plantas abastecen a tres bodegas (costo en miles de $ por unidad):</p>" + tbl(["", "Bodega 1", "Bodega 2", "Bodega 3", "Oferta"], [0, 1, 2].map(i => ["Planta " + (i + 1)].concat(c[i]).concat([of[i]]))).replace("</tbody>", "<tr><td>Demanda</td><td>" + de.join("</td><td>") + "</td><td>" + tot + "</td></tr></tbody>") + "<p>¿Cuál es el costo total de la solución inicial por el método de la <b>esquina noroeste</b>?</p>", ops:o.ops, ok:o.ok,
      expl:"Se parte en la celda (Planta 1, Bodega 1), se asigna el mínimo entre oferta y demanda, y se avanza a la derecha si se agota la demanda o hacia abajo si se agota la oferta. Costo = Σ cantidad × costo = " + $(z * 1000) + ". (El método de costo mínimo daría " + $(mc() * 1000) + ".)" }; });

  /* ---------- Monte Carlo: valor esperado con variables uniformes ---------- */
  G("simulacion-mc", () => { const a = R(6, 10) * 1000, b = a + R(4, 8) * 1000, p = R(8, 15) * 1000, cv = Math.round(p * R(45, 65) / 100 / 100) * 100, CF = R(20, 60) * 1e6 / 10, E = (p - cv) * (a + b) / 2 - CF;
    const o = opts(E, [(p - cv) * a - CF, (p - cv) * (a + b) / 2, p * (a + b) / 2 - CF], $);
    return { q:"<p>La demanda mensual de un producto es incierta y se modela como <b>uniforme entre " + n(a) + " y " + n(b) + " unidades</b>. Precio $ " + n(p) + ", costo variable $ " + n(cv) + " por unidad y costo fijo " + $(CF) + " al mes.</p><p>Si se simulan muchos meses, ¿hacia qué valor tiende la <b>utilidad promedio</b>?</p>", ops:o.ops, ok:o.ok,
      expl:"La utilidad es lineal en la demanda, así que su promedio usa la demanda media: (" + n(a) + " + " + n(b) + ") ÷ 2 = " + n((a + b) / 2) + ". Utilidad = (" + n(p) + " − " + n(cv) + ") × " + n((a + b) / 2) + " − " + n(CF) + " = " + $(E) + ". La simulación agrega la dispersión (riesgo) alrededor de ese promedio." }; });

  /* ---------- Secuenciación: SPT ---------- */
  G("secuenciacion", () => { const J = "ABCDE".split("").slice(0, 4).map(x => [x, R(2, 12), 0]); let acc = 0; J.forEach(j => { j[2] = R(5, 30); });
    const flow = o => { let t = 0, s = 0; o.forEach(j => { t += j[1]; s += t; }); return s / o.length; };
    const spt = J.slice().sort((a, b) => a[1] - b[1]), edd = J.slice().sort((a, b) => a[2] - b[2]), F = flow(spt), o = opts(F, [flow(J), flow(edd), spt.reduce((s, j) => s + j[1], 0) / 4], v => n(v, 2) + " días");
    return { q:"<p>Trabajos en espera (en orden de llegada):</p>" + tbl(["Trabajo", "Duración (días)", "Entrega (día)"], J.map(j => [j[0], j[1], j[2]])) + "<p>Con la regla <b>SPT</b> (menor tiempo de proceso primero), ¿cuál es el <b>tiempo promedio de flujo</b>?</p>", ops:o.ops, ok:o.ok,
      expl:"Orden SPT: " + spt.map(j => j[0]).join(" → ") + ". Tiempos de término: " + spt.map((j, i) => n(spt.slice(0, i + 1).reduce((s, x) => s + x[1], 0))).join(", ") + ". Promedio = " + n(F, 2) + " días. SPT minimiza el tiempo promedio de flujo." }; });

  /* ---------- Johnson: makespan en 2 máquinas ---------- */
  G("johnson", () => { const J = "ABCDE".split("").map(x => [x, R(2, 10), R(2, 10)]);
    const ms = o => { let t1 = 0, t2 = 0; o.forEach(j => { t1 += j[1]; t2 = Math.max(t2, t1) + j[2]; }); return t2; };
    const a = J.filter(j => j[1] <= j[2]).sort((x, y) => x[1] - y[1]), b = J.filter(j => j[1] > j[2]).sort((x, y) => y[2] - x[2]), S = a.concat(b), M = ms(S);
    const o = opts(M, [ms(J), J.reduce((s, j) => s + j[1] + j[2], 0), ms(S.slice().reverse())], v => n(v) + " h");
    return { q:"<p>Cinco trabajos pasan por corte (M1) y luego por pintura (M2):</p>" + tbl(["Trabajo", "M1 (h)", "M2 (h)"], J.map(j => [j[0], j[1], j[2]])) + "<p>Con la <b>regla de Johnson</b>, ¿cuál es el tiempo total para terminar todos los trabajos (makespan)?</p>", ops:o.ops, ok:o.ok,
      expl:"Primero van los trabajos con M1 ≤ M2, de menor a mayor M1; al final, los con M1 &gt; M2, de mayor a menor M2. Secuencia: " + S.map(j => j[0]).join(" → ") + ". Makespan = " + n(M) + " h (en orden de llegada sería " + n(ms(J)) + " h)." }; });

  /* ---------- Gráfico X̄-R: límite superior ---------- */
  G("control-xr", () => { const A2 = 0.577, D4 = 2.114, mu = R(95, 105) / 10, X = [0, 1, 2, 3, 4, 5].map(() => +(mu + (R(-12, 12)) / 100).toFixed(2)), Rg = X.map(() => +(R(10, 40) / 100).toFixed(2)), xb = X.reduce((a, b) => a + b, 0) / 6, rb = Rg.reduce((a, b) => a + b, 0) / 6, L = xb + A2 * rb;
    const o = opts(L, [xb + D4 * rb, xb + 3 * rb, xb - A2 * rb, D4 * rb], v => n(v, 3) + " mm");
    return { q:"<p>Se tomaron 6 subgrupos de 5 piezas (diámetro en mm):</p>" + tbl(["Subgrupo", "X̄", "R"], X.map((x, i) => [i + 1, n(x, 2), n(Rg[i], 2)])) + "<p>Con A₂ = 0,577 (n = 5), ¿cuál es el <b>límite superior de control del gráfico X̄</b>?</p>", ops:o.ops, ok:o.ok,
      expl:"X̿ = " + n(xb, 4) + "; R̄ = " + n(rb, 4) + ". LSC = X̿ + A₂·R̄ = " + n(xb, 4) + " + 0,577 × " + n(rb, 4) + " = " + n(L, 3) + " mm. (D₄·R̄ es el límite superior del gráfico R, no del X̄.)" }; });

  /* ---------- Gráfico p ---------- */
  G("control-p", () => { const N = pick([100, 150, 200, 250]), d = [0, 1, 2, 3, 4, 5].map(() => R(2, 14)), pb = d.reduce((a, b) => a + b, 0) / (6 * N), L = pb + 3 * Math.sqrt(pb * (1 - pb) / N);
    const o = opts(L, [pb + 3 * Math.sqrt(pb * (1 - pb) / (6 * N)), pb + 2 * Math.sqrt(pb * (1 - pb) / N), pb + 3 * Math.sqrt(pb * (1 - pb)), pb * 3], v => n(v * 100, 2) + " %");
    return { q:"<p>Cada día se inspeccionan " + N + " envases. Defectuosos en 6 días: " + d.join(", ") + ".</p><p>¿Cuál es el <b>límite superior de control</b> del gráfico p?</p>", ops:o.ops, ok:o.ok,
      expl:"p̄ = " + d.reduce((a, b) => a + b, 0) + " ÷ (6 × " + N + ") = " + n(pb * 100, 2) + " %. LSC = p̄ + 3·√(p̄(1 − p̄) ÷ n) = " + n(L * 100, 2) + " %. Se usa n de cada muestra (" + N + "), no el total." }; });

  /* ---------- Descriptiva: desviación estándar muestral ---------- */
  G("descriptiva", () => { const k = R(5, 7), x = Array.from({ length:k }, () => R(12, 30)), m = x.reduce((a, b) => a + b, 0) / k, ss = x.reduce((a, v) => a + (v - m) ** 2, 0), s = Math.sqrt(ss / (k - 1));
    const o = opts(s, [Math.sqrt(ss / k), ss / (k - 1), x.reduce((a, v) => a + Math.abs(v - m), 0) / k], v => n(v, 2) + " min");
    return { q:"<p>Tiempos de atención medidos (minutos): " + x.join(", ") + ".</p><p>¿Cuál es la <b>desviación estándar muestral</b> s?</p>", ops:o.ops, ok:o.ok,
      expl:"x̄ = " + n(m, 3) + ". Σ(x − x̄)² = " + n(ss, 3) + ". s = √(" + n(ss, 3) + " ÷ " + (k - 1) + ") = " + n(s, 2) + " min. Se divide por n − 1 porque es una muestra (dividir por n da la desviación poblacional; sin raíz es la varianza)." }; });

  /* ---------- Flujo de caja: flujo de un año ---------- */
  G("flujo-caja", () => { const I = R(60, 140) * 1e6, C = Math.round(I * R(45, 70) / 100 / 1e6) * 1e6, D = R(5, 20) * 1e6, t = 0.27, FC = (I - C - D) * (1 - t) + D;
    const o = opts(FC, [(I - C) * (1 - t), (I - C - D) * (1 - t), I - C - D, (I - C) * (1 - t) - D], $);
    return { q:"<p>En un año, un proyecto tiene ingresos " + $(I) + ", costos de operación " + $(C) + " y depreciación " + $(D) + ". Impuesto 27 %.</p><p>¿Cuál es el <b>flujo de caja</b> de ese año (sin inversiones ni recuperaciones)?</p>", ops:o.ops, ok:o.ok,
      expl:"UAI = " + n(I) + " − " + n(C) + " − " + n(D) + " = " + $(I - C - D) + ". Impuesto = 27 % → utilidad neta " + $((I - C - D) * (1 - t)) + ". Se suma la depreciación (no es salida de dinero): FC = " + $(FC) + "." }; });

  /* ---------- Ratios ---------- */
  G("ratios", () => { const AC = R(30, 90) * 10, Inv = Math.round(AC * R(20, 45) / 100), PC = R(20, 70) * 10, Pat = R(40, 90) * 10, UN = R(5, 15) * 10, which = R(0, 2);
    const Q = [["la <b>razón corriente</b>", AC / PC, [PC / AC, (AC - Inv) / PC, AC - PC], v => n(v, 2) + " veces", "Razón corriente = AC ÷ PC = " + AC + " ÷ " + PC],
      ["la <b>prueba ácida</b>", (AC - Inv) / PC, [AC / PC, Inv / PC, (AC - Inv) / AC], v => n(v, 2) + " veces", "Prueba ácida = (AC − inventarios) ÷ PC = (" + AC + " − " + Inv + ") ÷ " + PC],
      ["el <b>ROE</b>", UN / Pat, [UN / (Pat + PC), Pat / UN / 100, UN / AC], v => n(v * 100, 1) + " %", "ROE = utilidad neta ÷ patrimonio = " + UN + " ÷ " + Pat]][which];
    const o = opts(Q[1], Q[2], Q[3]);
    return { q:"<p>Datos (MM$): activo corriente " + AC + "; inventarios " + Inv + "; pasivo corriente " + PC + "; patrimonio " + Pat + "; utilidad neta " + UN + ".</p><p>¿Cuánto vale " + Q[0] + "?</p>", ops:o.ops, ok:o.ok, expl:Q[4] + " = " + Q[3](Q[1]) + "." }; });

  /* ---------- Huella de carbono ---------- */
  G("huella", () => { const kWh = R(100, 600) * 1000, L = R(5, 30) * 1000, fe = 0.2421, fd = 2.68, E = (kWh * fe + L * fd) / 1000;
    const o = opts(E, [kWh * fe + L * fd, kWh * fe / 1000, (kWh * fd + L * fe) / 1000], v => n(v, 1) + " t CO₂e");
    return { q:"<p>Una planta consumió " + n(kWh) + " kWh de electricidad (factor 0,2421 kg CO₂e/kWh) y " + n(L) + " L de diésel (factor 2,68 kg CO₂e/L).</p><p>¿Cuál es su huella (alcances 1 y 2)?</p>", ops:o.ops, ok:o.ok,
      expl:"Electricidad: " + n(kWh) + " × 0,2421 = " + n(kWh * fe) + " kg. Diésel: " + n(L) + " × 2,68 = " + n(L * fd) + " kg. Total = " + n(kWh * fe + L * fd) + " kg = " + n(E, 1) + " t CO₂e (÷ 1.000)." }; });

  /* ---------- Herramientas cualitativas: clasificar ---------- */
  const FODA = [["Personal con 10 años de experiencia en inyección", "Fortaleza"], ["Certificación ISO 9001 vigente", "Fortaleza"], ["Planta propia cerca del puerto", "Fortaleza"], ["Marca reconocida en la región", "Fortaleza"],
    ["OEE de 55 %", "Debilidad"], ["Cambios de formato de 2 horas", "Debilidad"], ["Sin sistema de costos por producto", "Debilidad"], ["Alta rotación de operarios", "Debilidad"],
    ["Ley REP exige envases reciclables", "Oportunidad"], ["Fondos CORFO para eficiencia energética", "Oportunidad"], ["Crece la demanda de alimentos envasados", "Oportunidad"], ["Nuevo tratado comercial con Asia", "Oportunidad"],
    ["Alza del precio de la resina", "Amenaza"], ["Importaciones de bajo costo", "Amenaza"], ["Escasez de técnicos de mantención en la zona", "Amenaza"], ["Tipo de cambio volátil", "Amenaza"]];
  G("foda", () => { const [f, ok] = pick(FODA), o = cls(ok, ["Fortaleza", "Debilidad", "Oportunidad", "Amenaza"]);
    return { q:"<p>En el análisis FODA de una planta de envases, ¿dónde se clasifica: <b>«" + f + "»</b>?</p>", ops:o.ops, ok:o.ok, expl:"Es " + ok.toLowerCase() + ": " + ({ Fortaleza:"interna y positiva (depende de la empresa).", Debilidad:"interna y negativa (la empresa puede corregirla).", Oportunidad:"externa y positiva (viene del entorno).", Amenaza:"externa y negativa (viene del entorno)." })[ok] }; });
  const M6 = [["Operador sin capacitación en el ajuste", "Mano de obra"], ["Fatiga en el turno de noche", "Mano de obra"], ["Instructivo de trabajo desactualizado", "Método"], ["Secuencia de armado no estandarizada", "Método"],
    ["Molde con desgaste", "Máquina"], ["Sensor de temperatura descalibrado en la inyectora", "Máquina"], ["Resina con humedad", "Material"], ["Proveedor nuevo de tornillos", "Material"],
    ["Pie de metro sin certificar", "Medición"], ["Criterio visual distinto entre inspectores", "Medición"], ["Polvo en el área de pintura", "Medio ambiente"], ["Temperatura de la nave sobre 30 °C", "Medio ambiente"]];
  G("ishikawa", () => { const [f, ok] = pick(M6), o = cls(ok, ["Mano de obra", "Método", "Máquina", "Material", "Medición", "Medio ambiente"]);
    return { q:"<p>En un diagrama de Ishikawa (6M) sobre piezas defectuosas, ¿en qué categoría va la causa <b>«" + f + "»</b>?</p>", ops:o.ops, ok:o.ok, expl:"Corresponde a <b>" + ok + "</b>. Recuerda que en el diagrama las causas son hipótesis: después hay que verificarlas con datos." }; });
  const CH = [["La línea se detuvo 40 minutos", "El motor de la cinta se sobrecargó", "El rodamiento estaba agarrotado", "No tenía lubricación", "No existe plan de mantenimiento preventivo para cintas"],
    ["Un cliente recibió el pedido equivocado", "Se despachó la caja de otro pedido", "Las cajas no tenían etiqueta", "La impresora de etiquetas estaba sin cinta", "No hay control de insumos de la impresora en el procedimiento"],
    ["Un operario se cortó la mano", "Usaba el esmeril sin guarda", "La guarda se había retirado", "Se sacó para un trabajo especial y no se repuso", "No existe verificación de guardas antes del uso"],
    ["Se entregaron 500 piezas fuera de medida", "El torno quedó mal ajustado", "Se cambió la herramienta sin medir la primera pieza", "No hay inspección de primera pieza", "El procedimiento de cambio no incluye verificación"]];
  G("porques", () => { const c = pick(CH), ok = c[4], o = cls(ok, c.slice(1));
    return { q:"<p>Problema: <b>«" + c[0] + "»</b>. Al aplicar los 5 porqués aparecen estas respuestas. ¿Cuál es la <b>causa raíz</b> sobre la que conviene actuar?</p>", ops:o.ops, ok:o.ok, expl:"La causa raíz es la falla del sistema o procedimiento: «" + ok + "». Las otras son causas intermedias; actuar sobre ellas arregla el caso, pero el problema vuelve. Cadena: " + c.join(" → ") + "." }; });
  const SI = [["Proveedor de materia prima", "Proveedores"], ["Área de compras", "Proveedores"], ["Transportista", "Proveedores"], ["Orden de compra", "Entradas"], ["Materia prima", "Entradas"], ["Plano del producto", "Entradas"],
    ["Cortar y soldar", "Proceso"], ["Inspeccionar", "Proceso"], ["Producto terminado", "Salidas"], ["Informe de calidad", "Salidas"], ["Factura", "Salidas"], ["Cliente final", "Clientes"], ["Bodega de despacho", "Clientes"], ["Área de facturación", "Clientes"]];
  G("sipoc", () => { const [f, ok] = pick(SI), o = cls(ok, ["Proveedores", "Entradas", "Proceso", "Salidas", "Clientes"]);
    return { q:"<p>En el SIPOC de un proceso de fabricación, ¿en qué columna va <b>«" + f + "»</b>?</p>", ops:o.ops, ok:o.ok, expl:"Va en <b>" + ok + "</b>. Proveedores entregan; entradas es lo que entra; proceso son los pasos; salidas lo que se produce; clientes quienes lo reciben (pueden ser áreas internas)." }; });
  const CV = [["Reducir en 30 % las paradas no planificadas", "Propuesta de valor"], ["Entrega en 24 horas", "Propuesta de valor"], ["Plantas mineras medianas", "Segmentos de clientes"], ["Pymes de alimentos", "Segmentos de clientes"],
    ["Venta directa y ferias", "Canales"], ["Tienda en línea", "Canales"], ["Ejecutivo dedicado", "Relación con clientes"], ["Suscripción mensual", "Fuentes de ingresos"], ["Venta por unidad", "Fuentes de ingresos"],
    ["Plataforma de software", "Recursos clave"], ["Ingenieros especializados", "Recursos clave"], ["Instalación y soporte", "Actividades clave"], ["Fabricante de sensores", "Socios clave"], ["Arriendo y sueldos", "Estructura de costos"]];
  G("canvas", () => { const [f, ok] = pick(CV), all = ["Propuesta de valor", "Segmentos de clientes", "Canales", "Relación con clientes", "Fuentes de ingresos", "Recursos clave", "Actividades clave", "Socios clave", "Estructura de costos"], o = cls(ok, all);
    return { q:"<p>En el Canvas de un negocio, ¿en qué bloque va <b>«" + f + "»</b>?</p>", ops:o.ops, ok:o.ok, expl:"Va en <b>" + ok + "</b>." }; });
  G("raci", () => { const roles = ["Gerente", "Jefe de proyecto", "Ingeniero", "Mantención", "Calidad"], tipo = R(0, 3), L = ["A", "R", "C", "I", "C"];
    if (tipo === 1) L[3] = "A"; if (tipo === 2) L[1] = "C"; if (tipo === 3) { L[0] = "R"; } const ok = ["La asignación es válida", "Hay dos A: solo debe haber un aprobador", "Falta un R: nadie ejecuta la tarea", "Falta un A: nadie rinde cuentas"][tipo === 3 ? 3 : tipo];
    const o = cls(ok, ["La asignación es válida", "Hay dos A: solo debe haber un aprobador", "Falta un R: nadie ejecuta la tarea", "Falta un A: nadie rinde cuentas"]);
    return { q:"<p>Actividad «Aprobar la compra del equipo». Asignación RACI:</p>" + tbl(roles, [L]) + "<p>¿Qué se puede concluir?</p>", ops:o.ops, ok:o.ok, expl:"Cada actividad necesita exactamente un A y al menos un R. Aquí: A = " + L.filter(x => x === "A").length + ", R = " + L.filter(x => x === "R").length + ". Por eso: " + ok.toLowerCase() + "." }; });

  /* ======================= Pregunta unificada para práctica y certamen ======================= */
  crsAnyQ = id => { const K = CRS[id]; if (!K) return null;
    const fromGen = () => { if (!K.gen) return null; for (let t = 0; t < 6; t++) { try { const g = K.gen(); if (g && g.ops.length === 4 && g.ok >= 0) return { q:g.q, ops:g.ops.map(crsEsc), ok:g.ok, sol:g.expl }; } catch (e) {} } return null; };
    const fromSp = () => { const g = crsGen(id); return g ? { q:g.q, ops:g.ops.map(crsEsc), ok:g.ok, sol:g.expl } : null; };
    const fromQuiz = () => { if (!(K.quiz || []).length) return null; const q = pick(K.quiz), pm = sh(q[1].map((_, j) => j)); return { q:"<p>" + q[0] + "</p>", ops:pm.map(j => q[1][j]), ok:pm.indexOf(q[2]), sol:q[3] }; };
    const r = Math.random(); return (r < 0.7 ? (fromGen() || fromSp() || fromQuiz()) : (fromQuiz() || fromGen() || fromSp())); };

  /* ======================= Certamen de práctica por ramo ======================= */
  /* temas de cada ramo (los que el ramo enlaza en sus unidades, prácticas y herramientas) */
  const RT = {
    "ramo-analisis-procesos":"calidad-7,kpis,sipoc,descriptiva,pareto,vsm,ishikawa,productividad,tiempo-estandar,muestreo",
    "ramo-nivelacion-matematica":"equivalencias,tasas,equilibrio,aprendizaje",
    "ramo-topicos-ingenieria":"porques,ishikawa,factores,huella,foda,canvas,raci",
    "ramo-innovacion-1":"canvas,foda,factores,raci",
    "ramo-intro-programacion":"pronosticos,programacion-lineal,simulacion-mc",
    "ramo-fisica-medicion":"capacidad,descriptiva,ruido",
    "ramo-fundamentos-matematicas":"programacion-lineal,mrp,localizacion",
    "ramo-calculo":"eoq,equilibrio,capacidad",
    "ramo-innovacion-2":"canvas,van-tir,equilibrio,simulacion-mc,foda,raci",
    "ramo-procesos-industriales":"lean,kpis,oee,balanceo,vsm,huella,sipoc,tiempo-estandar,muestreo",
    "ramo-base-datos":"abc,pronosticos,regresion",
    "ramo-investigacion-operativa":"programacion-lineal,transporte,asignacion,ruta-corta,colas,decisiones,simulacion-mc,cpm",
    "ramo-metodos-cuantitativos":"descriptiva,muestra,regresion,control-xr,simulacion-mc",
    "ramo-costos-presupuestos":"costeo,equilibrio,ratios,van-tir,flujo-caja,equivalencias,tasas",
    "ramo-sistemas-productivos":"lean,oee,balanceo,mrp,eoq,smed,secuenciacion,localizacion,factores,pronosticos,vsm,sipoc,tiempo-estandar,muestreo",
    "ramo-integrador-1":"cpm,pareto,ishikawa,foda,canvas,raci",
    "ramo-ingenieria-economica":"van-tir,equivalencias,tasas,caue,vida-economica,depreciacion,simulacion-mc,flujo-caja,decisiones",
    "ramo-logistica":"eoq,stock-seguridad,abc,transporte,ruta-corta,localizacion,pronosticos",
    "ramo-modelamiento-procesos":"lean,sipoc,vsm,colas,simulacion-mc,tiempo-estandar,muestreo",
    "ramo-mineria-datos":"regresion,pronosticos,descriptiva,abc,muestra,simulacion-mc",
    "ramo-portafolio-proyectos":"cpm,raci,factores,van-tir,simulacion-mc,foda,canvas",
    "ramo-evaluacion-proyectos":"flujo-caja,van-tir,wacc,simulacion-mc,localizacion,pronosticos,factores,equivalencias,tasas",
    "ramo-planificacion-mejora":"lean,mejora-continua,calidad-7,kpis,vsm,smed,oee,pareto,ishikawa,porques,control-xr,capacidad,sigma,sipoc,tiempo-estandar,muestreo",
    "ramo-transformacion-digital":"van-tir,factores,cpm,regresion,foda,canvas,raci",
    "ramo-responsabilidad-social":"huella,iper,foda,accidentabilidad,niosh,ruido",
    "ramo-integrador-2":"flujo-caja,van-tir,cpm,pareto,ishikawa,vsm,foda,canvas,raci",
    "ramo-topicos-especialidad":"kpis,mejora-continua,foda,canvas,raci" };
  const topics = c => { if (RT[c.id]) return RT[c.id].split(",").filter(id => CRS[id]); let cx = ""; try { cx = typeof CX !== "undefined" && CX[c.id] ? JSON.stringify(CX[c.id]) : ""; } catch (e) {} const s = JSON.stringify(c.u) + " " + (typeof CG !== "undefined" && CG[c.id] ? CG[c.id] : "") + " " + cx, ids = new Set((c.tools || []).filter(t => CRS[t])); (s.match(/data-go=\\?"([a-z0-9-]+)/g) || []).forEach(m => { const id = m.replace(/^data-go=\\?"/, ""); if (CRS[id]) ids.add(id); }); return [...ids]; };
  const ST = {}, NQ = 12, notaF = p => p < 0.6 ? 1 + 3 * p / 0.6 : 4 + 3 * (p - 0.6) / 0.4;
  const build = (cid, only) => { const T = only && only !== "all" ? [only] : topics(COURSES.find(x => x.id === cid)), N = only && only !== "all" ? 6 : NQ, order = [], out = [];
    while (order.length < N * 6) order.push(...sh(T)); for (let k = 0; k < order.length && out.length < N; k++) { const id = order[k]; for (let t = 0; t < 4; t++) { const q = crsAnyQ(id); if (q && !out.some(o => o.q === q.q)) { out.push(Object.assign(q, { id })); break; } } }
    return out.sort((a, b) => crsNz(pageOf(a.id).t).localeCompare(crsNz(pageOf(b.id).t))); };
  const render = (cid, only) => { const box = document.querySelector('.cert[data-gc="' + cid + '"]'); if (!box) return; const qs = build(cid, only); ST[cid] = qs;
    box.querySelector(".cert-body").innerHTML = '<p class="hint">' + qs.length + " preguntas · tiempo sugerido " + qs.length * 6 + " minutos · usa calculadora.</p>" + qs.map((q, i) => '<fieldset class="cq" data-i="' + i + '"><legend><span class="cq-n">Pregunta ' + (i + 1) + '</span> <span class="cq-ind">' + crsEsc(pageOf(q.id).t) + '</span></legend><div class="cq-t">' + q.q + "</div>" +
      q.ops.map((o, j) => '<label class="cq-o"><input type="radio" name="gc-' + cid + "-" + i + '" value="' + j + '"><span><b>' + "abcd"[j] + ")</b> " + o + "</span></label>").join("") + '<div class="cq-sol" hidden></div></fieldset>').join("") +
      '<div class="cert-act"><button type="button" class="btn" data-gcert-fix="' + cid + '">Corregir certamen</button></div><div class="cert-res" aria-live="polite"></div>';
    box.querySelector(".cert-body").scrollIntoView({ block:"start" }); };
  const correct = cid => { const box = document.querySelector('.cert[data-gc="' + cid + '"]'), qs = ST[cid]; if (!box || !qs) return; let ok = 0; const by = {};
    qs.forEach((q, i) => { const fs = box.querySelector('.cq[data-i="' + i + '"]'), r = fs.querySelector("input:checked"), v = r ? +r.value : -1, good = v === q.ok; if (good) ok++; (by[q.id] = by[q.id] || [0, 0])[1]++; if (good) by[q.id][0]++;
      if (typeof crsQzRec === "function" && v >= 0) crsQzRec(q.id, good);
      fs.classList.remove("ok", "bad"); fs.classList.add(good ? "ok" : "bad"); fs.querySelectorAll(".cq-o").forEach((l, j) => { l.classList.toggle("is-ok", j === q.ok); l.classList.toggle("is-bad", j === v && !good); });
      const s = fs.querySelector(".cq-sol"); s.hidden = false; s.innerHTML = "<p><b>" + (good ? "Correcta." : v < 0 ? "Sin responder." : "Incorrecta.") + " Respuesta: " + "abcd"[q.ok] + ').</b></p><p class="cq-dh">Desarrollo</p><p>' + q.sol + '</p><p><button type="button" class="linkb" data-go="' + q.id + '/fx">Repasar la lección</button></p>'; });
    const p = ok / qs.length, nt = notaF(p);
    box.querySelector(".cert-res").innerHTML = '<div class="cert-sum"><p class="cert-big">Nota ' + nt.toFixed(1).replace(".", ",") + "</p><p>" + ok + " de " + qs.length + " correctas (" + Math.round(p * 100) + " %). Escala de 1,0 a 7,0 con 60 % de exigencia.</p>" +
      tbl(["Tema", "Correctas", "Estado"], Object.keys(by).map(id => ['<button type="button" class="linkb" data-go="' + id + '/pr">' + crsEsc(pageOf(id).t) + "</button>", by[id][0] + " de " + by[id][1], by[id][0] === by[id][1] ? "Logrado" : by[id][0] / by[id][1] >= 0.5 ? "Parcial: repasa el tema" : "No logrado: estudia la lección y practica"])) +
      '<p>Genera otro certamen: las preguntas y los números cambian.</p><div class="cert-act"><button type="button" class="btn" data-gcert-new="' + cid + '">Generar otro certamen</button></div></div>';
    box.querySelector(".cert-res").scrollIntoView({ block:"start" }); };
  const shell = (cid, T) => '<div class="cert" data-gc="' + cid + '"><p>Certamen de práctica con los temas de este ramo: ejercicios con datos que cambian cada vez y preguntas de concepto. Al corregir verás tu nota, el logro por tema y el desarrollo de cada pregunta, con enlace a la lección para repasar.</p>' +
    '<p class="hint">Temas: ' + T.map(id => crsEsc(pageOf(id).t)).join(" · ") + ".</p>" +
    '<div class="cert-act no-print"><label>Practicar <select data-gcert-sel="' + cid + '"><option value="all">Certamen completo (' + NQ + " preguntas)</option>" + T.map(id => '<option value="' + id + '">Solo ' + crsEsc(pageOf(id).t) + " (6 preguntas)</option>").join("") + '</select></label> <button type="button" class="btn" data-gcert-new="' + cid + '">Generar certamen</button></div><div class="cert-body"></div></div>';
  COURSES.forEach(c => { if (c.u.some(u => /Certamen de práctica/.test(u[0]))) return; const T = topics(c); if (T.length < 3) return; c.u.push([(c.u.length + 1) + ". Certamen de práctica (temas del ramo)", shell(c.id, T), "raw"]); });
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-gcert-new],[data-gcert-fix]"); if (!b) return;
    if (b.dataset.gcertNew) { const s = document.querySelector('[data-gcert-sel="' + b.dataset.gcertNew + '"]'); render(b.dataset.gcertNew, s ? s.value : "all"); } else correct(b.dataset.gcertFix); });
})();
