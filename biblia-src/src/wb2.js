/* ============ FASE 3: PRUEBAS DEL NÚCLEO DE CÁLCULO ============
   Resultados esperados calculados de forma independiente (Python) o tomados de casos de libro. */
const TEST3 = [
  ["Lote económico (EOQ)", "D = 1.000; S = 10; C = 5; i = 10 %", () => NUC.eoq(1000, 10, 5, 0.10, 300, 0, 0).Q, 200, 0.01, "unidades"],
  ["Lote económico (EOQ)", "D = 4.800; S = 25.000; C = 2.000; i = 25 %; L = 5 días", () => NUC.eoq(4800, 25000, 2000, 0.25, 300, 5, 0).Q, 692.820, 0.01, "unidades"],
  ["Lote económico (EOQ)", "Punto de reorden del caso anterior", () => NUC.eoq(4800, 25000, 2000, 0.25, 300, 5, 0).ROP, 80, 0.001, "unidades"],
  ["Lote de producción (EPQ)", "D = 60.000; S = 400.000; H = 120; p = 1.200/día; 250 días", () => NUC.eoq(60000, 400000, 480, 0.25, 250, 0, 1200).Q, 22360.680, 0.01, "unidades"],
  ["Cola M/M/1", "λ = 2; μ = 3", () => NUC.mmc(2, 3, 1).Lq, 1.33333, 0.0001, "clientes en cola"],
  ["Cola M/M/1", "λ = 2; μ = 3 (espera en cola)", () => NUC.mmc(2, 3, 1).Wq * 60, 40, 0.001, "min"],
  ["Cola M/M/c", "λ = 2; μ = 3; c = 2", () => NUC.mmc(2, 3, 2).P0, 0.5, 0.0001, "P₀"],
  ["Cola M/M/c", "λ = 2; μ = 3; c = 2", () => NUC.mmc(2, 3, 2).Lq, 0.083333, 0.0001, "clientes en cola"],
  ["Cola M/M/c", "λ = 6; μ = 2,5; c = 4; espera $30.000; servidor $18.000", () => NUC.mmc(6, 2.5, 4, 30000, 18000).CT, 156917, 1, "$/hora"],
  ["VAN", "r = 10 %; flujos −1.000; 500; 500; 500", () => NUC.van(0.10, [-1000, 500, 500, 500]).VAN, 243.426, 0.01, "$"],
  ["TIR", "flujos −1.000; 500; 500; 500", () => NUC.van(0.10, [-1000, 500, 500, 500]).TIR * 100, 23.375, 0.01, "%"],
  ["VAN", "r = 10 %; −50 y 15 durante 5 años", () => NUC.van(0.10, [-50, 15, 15, 15, 15, 15]).VAN, 6.8618, 0.001, "millones $"],
  ["PRI descontado", "mismo caso", () => NUC.van(0.10, [-50, 15, 15, 15, 15, 15]).PRId, 4.2632, 0.001, "períodos"],
  ["Punto de equilibrio", "CF = 10.000; p = 50; cv = 30", () => NUC.equilibrio(10000, 50, 30, 0, 0, 0).Q, 500, 0.001, "unidades"],
  ["Punto de equilibrio", "CF = 12 MM; p = 8.000; cv = 5.000; U = 2,19 MM después de 27 %", () => NUC.equilibrio(12e6, 8000, 5000, 2190000, 0.27, 4600).Qo, 5000, 0.01, "unidades"],
  ["Apalancamiento operativo", "mismo caso, ventas 4.600", () => NUC.equilibrio(12e6, 8000, 5000, 2190000, 0.27, 4600).GAO, 7.6667, 0.001, "veces"],
  ["Cp", "LEI 9,4; LES 10,6; μ 10,08; σ 0,15", () => NUC.capacidad(9.4, 10.6, 10.08, 0.15).Cp, 1.3333, 0.0001, ""],
  ["Cpk", "mismo caso", () => NUC.capacidad(9.4, 10.6, 10.08, 0.15).Cpk, 1.15556, 0.0001, ""],
  ["Fracción fuera", "mismo caso", () => NUC.capacidad(9.4, 10.6, 10.08, 0.15).ppm, 266.38, 0.5, "ppm"],
  ["Cpk", "LEI 990; LES 1.010; μ 1.002; σ 4", () => NUC.capacidad(990, 1010, 1002, 4).Cpk, 0.66667, 0.0001, ""],
  ["Límites de control X̄", "8 subgrupos de 4 ejes (LSC)", () => NUC.xr([[25.02,24.98,25.01,24.99],[25.00,25.03,24.97,25.00],[24.98,25.01,25.02,24.99],[25.01,25.00,24.98,25.03],[24.99,25.02,25.00,24.97],[25.03,24.99,25.01,25.01],[24.97,25.00,25.02,25.01],[25.00,24.98,25.01,25.01]]).LSCx, 25.034055, 0.00001, "mm"],
  ["Límites de control R", "mismo caso (LSC de R)", () => NUC.xr([[25.02,24.98,25.01,24.99],[25.00,25.03,24.97,25.00],[24.98,25.01,25.02,24.99],[25.01,25.00,24.98,25.03],[24.99,25.02,25.00,24.97],[25.03,24.99,25.01,25.01],[24.97,25.00,25.02,25.01],[25.00,24.98,25.01,25.01]]).LSCr, 0.10269, 0.00001, "mm"],
  ["Balance de línea", "6 tareas; takt 30 s (eficiencia)", () => { const T = { A:{t:12,p:[]}, B:{t:15,p:["A"]}, C:{t:10,p:["A"]}, D:{t:18,p:["B"]}, E:{t:8,p:["C"]}, F:{t:14,p:["D","E"]} }; T.A.rpw = 77; T.B.rpw = 47; T.C.rpw = 32; T.D.rpw = 32; T.E.rpw = 22; T.F.rpw = 14; return NUC.balanceo(T, ["A","B","C","D","E","F"], 30, "rpw").ef; }, 0.85556, 0.0001, ""],
  ["Promedio móvil", "120, 132, 125, 140, 138, 150, 147, 158; n = 3 (próximo)", () => mean([150, 147, 158]), 151.667, 0.001, "unidades"],
  ["Suavizamiento exponencial", "misma serie; α = 0,3; F₁ = D₁", () => NUC.suavizamiento([120,132,125,140,138,150,147,158], 0.3)[8], 145.4484, 0.001, "unidades"],
  ["Tendencia lineal", "misma serie (pendiente)", () => NUC.tendencia([120,132,125,140,138,150,147,158]).b, 4.92857, 0.0001, "unidades/período"],
  ["Error MAD (tendencia)", "misma serie", () => NUC.errores([120,132,125,140,138,150,147,158], NUC.tendencia([120,132,125,140,138,150,147,158]).lr).MAD, 3.78571, 0.0001, "unidades"],
  ["Regresión lineal", "8 pares edad–horas (pendiente)", () => NUC.regresion([[1,22],[2,25],[3,31],[4,33],[5,38],[6,41],[7,47],[8,49]]).b, 3.97619, 0.0001, "h/año"],
  ["Regresión lineal", "mismo caso (intercepto)", () => NUC.regresion([[1,22],[2,25],[3,31],[4,33],[5,38],[6,41],[7,47],[8,49]]).a, 17.85714, 0.0001, "h"],
  ["Regresión lineal", "mismo caso (r)", () => NUC.regresion([[1,22],[2,25],[3,31],[4,33],[5,38],[6,41],[7,47],[8,49]]).r, 0.995902, 0.00001, ""],
  ["PL 2 variables", "máx 8x₁ + 5x₂; 2x₁ + x₂ ≤ 100; x₁ + x₂ ≤ 80; x₁ ≤ 40", () => NUC.pl([8, 5], [[2, 1], [1, 1], [1, 0]], ["<=", "<=", "<="], [100, 80, 40], true).z, 460, 0.0001, ""],
  ["PL 2 variables (Wyndor)", "máx 3x₁ + 5x₂; x₁ ≤ 4; 2x₂ ≤ 12; 3x₁ + 2x₂ ≤ 18", () => NUC.pl([3, 5], [[1, 0], [0, 2], [3, 2]], ["<=", "<=", "<="], [4, 12, 18], true).z, 36, 0.0001, ""],
  ["PL 3 variables", "mezcla de mineral (mín costo)", () => NUC.pl([9, 5, 7], [[1, 1, 1], [1.2, 0.6, 0.9], [14, 10, 12], [1, 0, 0], [0, 1, 0], [0, 0, 1]], ["=", ">=", "<=", "<=", "<=", "<="], [10000, 8700, 125000, 4000, 6000, 5000], false).z, 68000, 0.01, "USD/día"]
];
function runTest3(){ return TEST3.map(t => { let got = NaN, err = ""; try { got = t[2](); } catch (e) { err = e.message; } const ok = fin(got) && Math.abs(got - t[3]) <= t[4]; return { calc:t[0], inp:t[1], exp:t[3], got, ok, tol:t[4], u:t[5], err }; }); }
function pgPruebas(){
  const R = runTest3(), okN = R.filter(r => r.ok).length, dec = r => Math.max(0, Math.min(6, -Math.floor(Math.log10(r.tol))));
  return '<p class="eyebrow">Referencia · Calidad de las calculadoras</p><h1>Pruebas de las calculadoras</h1><p class="lead">Cada vez que abres esta página, el núcleo de cálculo se prueba contra resultados conocidos, calculados de forma independiente o tomados de casos de libro. Si alguna prueba falla, se marca en rojo.</p>' +
    kpis([kpi("Pruebas", R.length), kpi("Correctas", okN, "", okN === R.length ? "ok" : "bad"), kpi("Con error", R.length - okN, "", R.length - okN ? "bad" : "ok")]) +
    table(["Calculadora", "Entrada de prueba", "Resultado esperado", "Resultado obtenido", "Estado"], R.map(r => rowc([r.calc, r.inp, nf(r.exp, dec(r)) + (r.u ? " " + r.u : ""), r.err ? "Error: " + esc(r.err) : nf(r.got, dec(r)) + (r.u ? " " + r.u : ""), r.ok ? pill("ok", "✓ Correcto") : pill("bad", "✗ Revisar")], r.ok ? "" : "badr")), { num:[2, 3] }) +
    note("Tolerancia: diferencias de redondeo menores que la última cifra mostrada. Las mismas funciones son las que usan las calculadoras, así que si estas pruebas pasan, los cálculos de la interfaz también.", "info"); }
