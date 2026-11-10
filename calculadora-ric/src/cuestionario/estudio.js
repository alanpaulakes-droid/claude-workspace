/* Secciones de estudio: resumen normativo, tablas y diagramas SVG propios (se adaptan a modo claro y oscuro). */
const S = (vb, inner, label) => `<svg class="dg" viewBox="${vb}" role="img" aria-label="${label}">${inner}</svg>`;
const T = (x, y, t, c = "", a = "start") => `<text x="${x}" y="${y}" class="${c}" text-anchor="${a}">${t}</text>`;

const DG = {
  circuito: S(
    "0 0 520 220",
    `<rect x="20" y="70" width="90" height="80" rx="10" class="bx"/>${T(65, 105, "Fuente", "b", "middle")}${T(65, 125, "220 V", "m", "middle")}
     <path d="M110 90H220M300 90H400V130M110 130H400" class="w"/><path d="M220 90l60-22" class="w"/><circle cx="220" cy="90" r="5" class="dot"/><circle cx="300" cy="90" r="5" class="dot"/>${T(260, 60, "Interruptor", "m", "middle")}
     <rect x="380" y="100" width="40" height="60" rx="6" class="ac"/>${T(440, 125, "Carga R", "b")}${T(440, 145, "P = V × I", "m")}
     <path d="M160 82l14 8-14 8" class="ar"/>${T(165, 72, "I", "b", "middle")}
     ${T(20, 200, "V = I × R  ·  P = V × I × cos φ  ·  trifásico: P = √3 × VL × I × cos φ", "m")}`,
    "Circuito simple con fuente, interruptor y carga",
  ),
  colores: S(
    "0 0 520 200",
    [
      ["L1 · fase 1", "#1f5fd0"],
      ["L2 · fase 2", "#1d2228"],
      ["L3 · fase 3", "#c62828"],
      ["N · neutro", "#f4f4f4"],
      ["PE · protección", "pe"],
    ]
      .map(
        ([t, c], i) =>
          `<circle cx="${60 + i * 100}" cy="80" r="32" ${c === "pe" ? 'fill="url(#pe)"' : `fill="${c}"`} class="cab"/><circle cx="${60 + i * 100}" cy="80" r="14" class="cu"/>${T(60 + i * 100, 140, t, "b", "middle")}`,
      )
      .join("") +
      `<defs><pattern id="pe" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="16" height="16" fill="#2E9E44"/><rect width="6" height="16" fill="#E8C300"/></pattern></defs>${T(260, 180, "RIC N°04, 5.32 · el verde o verde/amarillo se reserva para el conductor de protección", "m", "middle")}`,
    "Código de colores de conductores",
  ),
  tubo: S(
    "0 0 520 230",
    `<circle cx="120" cy="110" r="80" class="bx"/><circle cx="120" cy="110" r="70" class="tb"/>
     <circle cx="98" cy="95" r="17" fill="#c62828" class="cab"/><circle cx="142" cy="95" r="17" fill="#f4f4f4" class="cab"/><circle cx="120" cy="133" r="17" fill="url(#pe2)" class="cab"/>
     <defs><pattern id="pe2" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="12" height="12" fill="#2E9E44"/><rect width="5" height="12" fill="#E8C300"/></pattern></defs>
     ${T(120, 222, "3 conductores (F, N, PE) ≤ 33 %", "b", "middle")}
     <rect x="260" y="30" width="230" height="170" rx="6" class="bx"/>${T(375, 22, "Muro (elevación)", "m", "middle")}
     <path d="M260 60H490" class="dsh"/><path d="M260 175H490" class="dsh"/>${T(495, 64, "0,30 m del cielo", "m", "end")}${T(495, 170, "0,20 m del piso", "m", "end")}
     <path d="M300 60V175M300 60H440V115" class="w ac2"/><rect x="430" y="115" width="20" height="16" rx="3" class="ac"/>${T(375, 100, "Tramos rectos", "m", "middle")}${T(375, 116, "verticales u horizontales", "m", "middle")}`,
    "Llenado de tubo y recorridos embutidos",
  ),
  caida: S(
    "0 0 520 220",
    `<defs><linearGradient id="vg" x1="0" x2="1"><stop offset="0" class="g0"/><stop offset="1" class="g1"/></linearGradient></defs>
     <rect x="20" y="70" width="80" height="70" rx="10" class="bx"/>${T(60, 100, "Tablero", "b", "middle")}${T(60, 120, "220 V", "m", "middle")}
     <rect x="100" y="98" width="300" height="14" rx="7" fill="url(#vg)"/>${T(250, 90, "L, S, ρ → la tensión baja a lo largo del cable", "m", "middle")}
     <rect x="400" y="70" width="90" height="70" rx="10" class="bx"/>${T(445, 100, "Carga", "b", "middle")}${T(445, 120, "220 − ΔV", "m", "middle")}
     ${T(20, 180, "ΔV = 2 × ρ × L × I ÷ S (monofásico)  ·  ΔV % = ΔV ÷ V × 100", "b")}${T(20, 205, "Límites: 3 % por tramo y 5 % total al punto más desfavorable (RIC N°03, 5.1.3)", "m")}`,
    "Caída de tensión a lo largo de un cable",
  ),
  demanda: S(
    "0 0 520 200",
    `<path d="M50 160H490M50 160V20" class="ax"/>
     <rect x="60" y="40" width="70" height="120" class="ac"/>${T(95, 34, "100 %", "b", "middle")}${T(95, 180, "0–3 kW", "m", "middle")}
     <rect x="150" y="118" width="250" height="42" class="ac2f"/>${T(275, 112, "35 %", "b", "middle")}${T(275, 180, "3–120 kW", "m", "middle")}
     <rect x="420" y="130" width="60" height="30" class="mut"/>${T(450, 124, "25 %", "b", "middle")}${T(450, 180, "> 120 kW", "m", "middle")}
     ${T(50, 198, "Factor de demanda casa habitación (RIC N°03, Tabla 3.1)", "m")}`,
    "Tramos del factor de demanda",
  ),
  protecciones: S(
    "0 0 520 240",
    `<path d="M60 200H490M60 200V20" class="ax"/>${T(275, 232, "Corriente (múltiplos de In)", "m", "middle")}${T(18, 110, "t", "m")}
     <path d="M80 30C110 120 150 150 200 160L200 200" class="cv b"/><path d="M95 30C140 120 190 150 260 165L260 200" class="cv c"/>
     ${T(150, 150, "B", "b")}${T(268, 150, "C", "b")}
     <path d="M200 60H260" class="dsh"/>${T(230, 55, "magnético", "m", "middle")}${T(110, 60, "térmico", "m")}
     <rect x="330" y="40" width="160" height="120" rx="10" class="bx"/>${T(410, 64, "Coordinación", "b", "middle")}
     <rect x="345" y="78" width="55" height="14" rx="4" class="ac"/>${T(406, 90, "Is", "m")}
     <rect x="345" y="102" width="90" height="14" rx="4" class="ac2f"/>${T(441, 114, "In", "m")}
     <rect x="345" y="126" width="120" height="14" rx="4" class="okf"/>${T(470, 138, "Iz", "m")}
     ${T(410, 178, "Is ≤ In ≤ Iz", "b", "middle")}${T(410, 196, "In ≥ 1,1 × Is (RIC N°10)", "m", "middle")}`,
    "Curvas de disparo B y C y coordinación protección–cable",
  ),
  diferencial: S(
    "0 0 520 210",
    `<ellipse cx="150" cy="100" rx="60" ry="30" class="tor"/>${T(150, 150, "Toroide", "m", "middle")}
     <path d="M30 85H400" class="w f"/><path d="M30 115H400" class="w n"/>${T(30, 78, "F", "b")}${T(30, 133, "N", "b")}
     <path d="M400 85V60M400 115V60" class="w"/><rect x="380" y="40" width="40" height="22" rx="4" class="ac"/>${T(430, 56, "Carga", "m")}
     <path d="M330 85V180H460" class="w pe dsh2"/>${T(340, 175, "fuga a tierra", "m")}${T(466, 184, "PE", "b")}
     <rect x="210" y="20" width="110" height="34" rx="8" class="bx"/>${T(265, 42, "Disparo", "b", "middle")}<path d="M210 37 180 75" class="dsh"/>
     ${T(20, 202, "Si la diferencia entre fase y neutro alcanza IΔn, corta · exigencia ≤ 30 mA: RIC N°10, 5.1.3.5", "m")}`,
    "Principio del diferencial",
  ),
  tablero: S(
    "0 0 520 300",
    `<rect x="90" y="20" width="240" height="250" rx="12" class="bx"/>${T(210, 14, "Tablero (cubierta cubre equipos y puerta)", "m", "middle")}
     <rect x="110" y="45" width="50" height="40" rx="5" class="ac"/>${T(135, 70, "IG", "b", "middle")}<circle cx="300" cy="62" r="11" class="pil"/>${T(300, 98, "Luz piloto", "m", "middle")}
     <rect x="110" y="110" width="60" height="40" rx="5" class="ac2f"/>${T(140, 135, "DR1", "b", "middle")}<rect x="180" y="110" width="60" height="40" rx="5" class="ac2f"/>${T(210, 135, "DR2", "b", "middle")}
     ${[0, 1, 2, 3, 4].map((i) => `<rect x="${110 + i * 34}" y="170" width="28" height="38" rx="4" class="tm"/>${T(124 + i * 34, 194, "C" + (i + 1), "m", "middle")}`).join("")}
     <rect x="282" y="170" width="30" height="38" rx="4" class="res"/>${T(297, 222, "reserva 25 %", "m", "middle")}
     <rect x="110" y="232" width="90" height="12" rx="3" fill="#f4f4f4" class="cab"/>${T(155, 260, "Barra N", "m", "middle")}<rect x="215" y="232" width="90" height="12" rx="3" fill="#2E9E44" class="cab"/>${T(260, 260, "Barra PE", "m", "middle")}
     <path d="M380 270V20" class="ax"/><path d="M372 270H388M372 20H388" class="ax"/>${T(392, 150, "comandos", "m")}${T(392, 166, "entre 0,45 m", "m")}${T(392, 182, "y 2,0 m del piso", "m")}
     ${T(20, 292, "IP41 interior · IP44 exterior bajo techo · IP54 intemperie · IPX4 mojado (RIC N°02)", "m")}`,
    "Tablero domiciliario y sus exigencias",
  ),
  vivienda: S(
    "0 0 520 260",
    `<rect x="20" y="20" width="300" height="220" class="bx"/><path d="M170 20V240M20 130H320" class="w"/>
     ${T(95, 45, "Dormitorio 12 m²", "b", "middle")}${T(245, 45, "Cocina", "b", "middle")}${T(95, 155, "Living 20 m²", "b", "middle")}${T(245, 155, "Baño", "b", "middle")}
     <circle cx="70" cy="85" r="8" class="lum"/><circle cx="120" cy="85" r="8" class="lum"/>${T(95, 112, "2 centros (> 10 m²)", "m", "middle")}
     ${[30, 160].map((x) => `<rect x="${x}" y="70" width="8" height="14" rx="2" class="enc"/>`).join("")}
     ${[200, 260, 312].map((x) => `<rect x="${x}" y="${x === 312 ? 70 : 122}" width="8" height="${x === 312 ? 14 : 8}" rx="2" class="enc"/>`).join("")}${T(245, 102, "3 enchufes mín.", "m", "middle")}
     <circle cx="95" cy="200" r="8" class="lum"/><circle cx="60" cy="200" r="8" class="lum"/>${T(95, 228, "1 enchufe cada 8 m de perímetro", "m", "middle")}
     ${T(340, 40, "RIC N°10, 5.2", "b")}${T(340, 62, "≤ 10 m²: 1 centro", "m")}${T(340, 80, "> 10 m²: 2 centros", "m")}${T(340, 98, "Cocina: 3 enchufes", "m")}${T(340, 116, "Lavadero: 1 enchufe", "m")}${T(340, 134, "Horno: ≥ 1.500 W", "m")}${T(340, 152, "< 30 m²: 2 circuitos", "m")}${T(340, 170, "≥ 30 m²: 3 circuitos", "m")}${T(340, 188, "Cocina/lavadero 16 A", "m")}${T(340, 206, "Esquema TN-S", "m")}`,
    "Puntos mínimos por recinto",
  ),
  tns: S(
    "0 0 520 200",
    `<circle cx="70" cy="80" r="34" class="bx"/>${T(70, 85, "Red", "b", "middle")}<path d="M104 60H460" class="w f"/><path d="M104 90H460" class="w n"/><path d="M70 114V170" class="w"/><path d="M55 170h30M60 178h20M65 186h10" class="w"/>
     ${T(470, 64, "L", "b")}${T(470, 94, "N", "b")}<path d="M240 90V130H460" class="w pe"/>${T(470, 134, "PE", "b")}<path d="M240 130V170M225 170h30M230 178h20M235 186h10" class="w pe"/>
     <rect x="380" y="40" width="60" height="110" rx="8" class="ac" opacity=".25"/>${T(410, 165, "Equipo", "m", "middle")}
     ${T(150, 186, "TN-S: neutro (N) y protección (PE) separados (RIC N°10, 5.2 f)", "m")}`,
    "Esquema TN-S",
  ),
  tierra: S(
    "0 0 520 240",
    `<path d="M20 70H500" class="ax"/>${T(500, 62, "nivel de terreno", "m", "end")}<rect x="20" y="70" width="480" height="160" class="soil"/>
     <path d="M140 40V200" class="pica"/><rect x="128" y="30" width="24" height="18" rx="3" class="bx"/>${T(160, 44, "Cámara de registro", "m")}
     <path d="M140 200l-6-14h12z" class="pica"/>${T(155, 140, "L", "b")}<path d="M150 72V198" class="dsh"/>
     ${T(260, 110, "R ≈ ρ ÷ L (pica vertical, RIC N°06 Tabla 6.4)", "b")}${T(260, 134, "Servicio: ≤ 20 Ω (hasta 80 Ω con 6.2)", "m")}${T(260, 156, "TN: Zs × Ia ≤ UL · TT: RA × Ia ≤ UL", "m")}${T(260, 178, "UL = 50 V seco · 24 V húmedo (RIC N°05)", "m")}`,
    "Puesta a tierra con pica vertical",
  ),
  servicio: S(
    "0 0 520 230",
    `<rect x="20" y="30" width="120" height="90" rx="12" class="ac2f"/>${T(80, 60, "Megóhmetro", "b", "middle")}${T(80, 82, "500 V CC", "m", "middle")}${T(80, 104, "≥ 0,5 MΩ", "b", "middle")}
     <path d="M140 60H300M140 90H300" class="w"/>${T(310, 64, "Fase", "m")}${T(310, 94, "Neutro / PE", "m")}
     ${["7.1.3.1 · Continuidad PE (4–24 V, ≥ 0,2 A)", "7.1.3.2 · Resistencia de aislamiento", "7.1.3.5 · Desconexión automática", "7.1.3.6 · Protección complementaria (DR)", "7.1.3.7–8 · Polaridad y orden de fases", "7.1.3.9–10 · Caída de tensión y funcionamiento"].map((t, i) => T(20, 150 + i * 14, t, "m")).join("")}
     ${T(320, 150, "Orden de ensayos (extracto)", "b")}${T(320, 168, "RIC N°19, 7.1.3", "m")}${T(320, 186, "Tabla 19.1", "m")}`,
    "Ensayos de puesta en servicio",
  ),
};

const tabla = (h, rows) =>
  `<div class="tw"><table><thead><tr>${h.map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

export const SECCIONES = [
  {
    id: "fund",
    t: "Fundamentos eléctricos",
    ic: "bolt",
    temas: ["Fundamentos"],
    intro: "Magnitudes y fórmulas que se usan en todos los cálculos de una instalación domiciliaria.",
    dg: ["circuito"],
    reglas: [
      ["Tensión de la red", "380/220 V y 50 Hz: 220 V entre fase y neutro, 380 V entre fases (RIC N°05, 5.9)."],
      ["Ley de Ohm", "I = V ÷ R. A más resistencia, menos corriente."],
      ["Potencia", "P = V × I × cos φ (monofásico) y P = √3 × VL × I × cos φ (trifásico)."],
      ["Factor de potencia", "Cargas resistivas: cos φ = 1; motores y fuentes: menor que 1."],
    ],
    errores: ["Usar 380 V en un circuito monofásico.", "Olvidar el cos φ en cargas con motor."],
  },
  {
    id: "cond",
    t: "Conductores: secciones, colores y capacidad",
    ic: "cable",
    temas: ["Secciones mínimas", "Colores", "Capacidad de corriente", "Conductores"],
    intro:
      "Cómo elegir el conductor: sección mínima según el uso, capacidad de corriente de la Tabla 4.4 y código de colores.",
    dg: ["colores"],
    reglas: [
      [
        "Secciones mínimas (RIC N°04, 5.4)",
        "Iluminación 1,5 mm² · enchufes y mixtos 2,5 mm² · subalimentador 2,5 mm² · alimentador 4 mm².",
      ],
      [
        "Colores (RIC N°04, 5.32)",
        "Fase 1 azul, fase 2 negro, fase 3 rojo; neutro blanco; protección verde o verde/amarillo.",
      ],
      [
        "Capacidad (RIC N°04, Tabla 4.4)",
        "Depende del tipo de cable (70 °C o 90 °C) y del método de instalación (A1, B1, E…).",
      ],
      [
        "Corrección (Tablas 4.6 y 4.7)",
        "Por temperatura ambiente sobre 30 °C y por más de 3 conductores activos en un ducto.",
      ],
      ["Neutro (RIC N°10, 5.1.5.3)", "En circuitos de uso general el neutro tiene al menos la sección de la fase."],
    ],
    tabla: tabla(
      ["Sección", "70 °C · A1 (embutido)", "70 °C · B1 (sobrepuesto)", "90 °C · B1"],
      [
        ["1,5 mm²", "14 A", "16 A", "18 A"],
        ["2,5 mm²", "18 A", "21 A", "24 A"],
        ["4 mm²", "24 A", "28 A", "37 A"],
        ["6 mm²", "31 A", "36 A", "48 A"],
        ["10 mm²", "42 A", "50 A", "66 A"],
      ],
    ),
    errores: [
      "Usar 1,5 mm² en enchufes.",
      "Proteger un 1,5 mm² embutido (14 A) con 16 A.",
      "Usar verde para una fase.",
    ],
  },
  {
    id: "canal",
    t: "Canalizaciones",
    ic: "pipe",
    temas: ["Canalizaciones"],
    intro: "Llenado de tubos, factores por agrupamiento y recorridos embutidos.",
    dg: ["tubo"],
    reglas: [
      [
        "Llenado (RIC N°04, Tabla 4.21)",
        "1 conductor: 50 % · 2 o más: 33 % · uniones de tableros ≤ 1 m: 60 %. La tierra cuenta.",
      ],
      ["Agrupamiento (Tabla 4.6)", "4 a 6 conductores activos: 0,8 · 7 a 24: 0,7 · 25 a 42: 0,6 · más de 42: 0,5."],
      [
        "Recorridos (RIC N°04, 7.16.1.16)",
        "Tramos verticales u horizontales; horizontales a 0,30 m de cielos y 0,20 m de pisos.",
      ],
    ],
    errores: ["Calcular el llenado sin el conductor de tierra.", "Pasar ductos en diagonal por el muro."],
  },
  {
    id: "dem",
    t: "Demanda y caída de tensión",
    ic: "chart",
    temas: ["Demanda", "Caída de tensión"],
    intro: "Cuánta potencia se usa a la vez y cuánta tensión se pierde en los cables.",
    dg: ["demanda", "caida"],
    reglas: [
      [
        "Demanda vivienda (RIC N°03, Tabla 3.1)",
        "Primeros 3 kW al 100 %, de 3 a 120 kW al 35 %, sobre 120 kW al 25 %.",
      ],
      [
        "Varias viviendas (Tabla 3.2)",
        "Factor de simultaneidad por número de viviendas; sobre 21: (15,3 + (n − 21) × 0,5) ÷ n.",
      ],
      ["Caída (RIC N°03, 5.1.3)", "Máximo 3 % por tramo y 5 % total al punto más desfavorable."],
      ["Alimentador (RIC N°03, 5.1.2)", "Sección mínima 4 mm²; subalimentador 2,5 mm²."],
    ],
    errores: ["Aplicar el 35 % a toda la potencia.", "Usar el largo de ida y vuelta además del factor 2."],
  },
  {
    id: "prot",
    t: "Protecciones y circuitos",
    ic: "shield",
    temas: ["Protecciones", "Circuitos", "Diferenciales"],
    intro: "Termomagnéticos para proteger el cable y diferenciales para proteger a las personas.",
    dg: ["protecciones", "diferencial"],
    reglas: [
      [
        "Capacidad del circuito (RIC N°10, 5.1.4.1)",
        "Potencia más 10 %; se elige el calibre comercial inmediatamente superior.",
      ],
      [
        "Cantidad de centros (5.1.4.4)",
        "La suma de potencias hasta el 90 % de la capacidad; 100 W por centro y 250 W por enchufe si no se conoce.",
      ],
      ["Curvas (5.1.4.2)", "Referencia: B iluminación, C enchufes, D o K generales."],
      [
        "Diferencial (5.1.3.5 y 5.1.3.7)",
        "Todo circuito de alumbrado con diferencial ≤ 30 mA; máximo 3 circuitos por diferencial.",
      ],
      ["Coordinación (5.1.5.1)", "El cable queda protegido: Is ≤ In ≤ Iz."],
      ["Maniobra (5.1.3.8)", "Las protecciones no se usan para encender y apagar cargas."],
    ],
    errores: ["Diferencial de 300 mA en circuitos de enchufes.", "5 circuitos bajo un mismo diferencial."],
  },
  {
    id: "tab",
    t: "Tableros",
    ic: "grid",
    temas: ["Tableros"],
    intro: "Construcción, grado IP, alturas y conexionado interno del tablero.",
    dg: ["tablero"],
    reglas: [
      [
        "Grado IP (RIC N°02, 6.1.21)",
        "Interior IP41 · exterior bajo techo IP44 · intemperie IP54 · lugares mojados IPX4. No se aceptan tableros abiertos.",
      ],
      ["Alturas (6.1.22)", "Dispositivos de comando entre 0,45 m y 2,0 m del piso terminado."],
      ["Reserva (6.1.16.3)", "Instalación nueva: prever 25 % de ampliación por tipo de servicio."],
      [
        "Luz piloto (6.2.14 y 6.2.15)",
        "Obligatoria salvo tableros domiciliarios de hasta 3 circuitos; su circuito con protección de 10 A máximo.",
      ],
      [
        "Conexionado (6.2.4)",
        "Nada de puentes de equipo a equipo: barra de distribución o peine, usando el 100 % de sus accesorios.",
      ],
      ["Barras (6.2.9)", "Orden azul, negro, rojo (R-S-T) de izquierda a derecha."],
    ],
    errores: ["Puentear disyuntores con cable.", "Cortar los dientes sobrantes de un peine."],
  },
  {
    id: "viv",
    t: "Vivienda: puntos, circuitos y esquema TN-S",
    ic: "home",
    temas: ["Vivienda"],
    intro: "Puntos mínimos por recinto, circuitos obligatorios y esquema de conexión a tierra de la vivienda.",
    dg: ["vivienda", "tns"],
    reglas: [
      ["Centros (RIC N°10, 5.2 a)", "Hasta 10 m² un centro; sobre 10 m² dos, cada uno con su interruptor."],
      [
        "Enchufes (5.2 b, c, d)",
        "Dormitorio, living, comedor: uno por cada 8 m de perímetro o fracción; cocina 3; lavadero 1.",
      ],
      ["Horno (5.2 e)", "Enchufe adicional de al menos 16 A y 1.500 W, o conexión fija."],
      [
        "Circuitos (5.2 b y d)",
        "Bajo 30 m² mínimo 2; desde 30 m² mínimo 3; uno exclusivo de cocina y lavadero de 16 A.",
      ],
      ["Empalme (5.2)", "Protección mínima de 25 A y alimentador de al menos 4 mm²."],
      [
        "Enchufes (5.1.2.8 y 5.1.2.9)",
        "De alvéolos protegidos y con capacidad no menor que la protección del circuito.",
      ],
      ["Esquema (5.2 f)", "TN-S: neutro y protección separados."],
    ],
    errores: ["Un solo centro en un recinto de 14 m².", "Alimentar el centro de luz desde un enchufe."],
  },
  {
    id: "tierra",
    t: "Puesta a tierra y seguridad",
    ic: "ground",
    temas: ["Puesta a tierra", "Seguridad"],
    intro: "Tierra de servicio, tierra de protección y tensiones de seguridad.",
    dg: ["tierra"],
    reglas: [
      ["Tierra de servicio (RIC N°06, 6.1)", "Máximo 20 Ω; hasta 80 Ω solo con las condiciones de 6.2."],
      ["Estimación (Tabla 6.4)", "Pica vertical R = ρ ÷ L · placa R = 0,8 ρ ÷ P · conductor horizontal R = 2 ρ ÷ L."],
      ["Tensión de seguridad (RIC N°05, 5.8)", "50 V CA en lugar seco y 24 V CA en lugar húmedo o mojado."],
      [
        "Esquema TN, como la vivienda TN-S (RIC N°05, 8.7.6.2 y Tabla 5.1)",
        "Zs × Ia ≤ UL y corte en 0,4 s como máximo a 220 V (0,2 s a 380 V). Con diferencial, Ia es su sensibilidad.",
      ],
      ["Esquema TT (RIC N°05, 8.7.7.3)", "RA × Ia ≤ UL: con diferencial de 30 mA y 50 V, RA ≤ 1.667 Ω."],
      ["Cuerpo humano (RIC N°05, 5.7)", "2.000 Ω como valor referencial."],
    ],
    errores: [
      "Confundir la tierra de servicio (≤ 20 Ω) con la de protección.",
      "Instalar enchufes sin conductor de tierra.",
    ],
  },
  {
    id: "serv",
    t: "Puesta en servicio y ensayos",
    ic: "gauge",
    temas: ["Puesta en servicio"],
    intro: "Ensayos de verificación inicial antes de energizar y declarar la instalación.",
    dg: ["servicio"],
    reglas: [
      [
        "Orden (RIC N°19, 7.1.3)",
        "Continuidad de PE → aislamiento → separación → suelos y paredes → desconexión automática → protección complementaria → polaridad → orden de fases → caída de tensión → funcionamiento.",
      ],
      ["Continuidad (7.2.1)", "Fuente de 4 V a 24 V en vacío y al menos 0,2 A."],
      [
        "Aislamiento (Tabla 19.1)",
        "Hasta 500 V: ensayo con 500 V CC y mínimo 0,5 MΩ; muy baja tensión: 250 V y 0,25 MΩ.",
      ],
      ["Dónde se mide (7.3.1)", "Entre fases, fase–neutro, fase–protección y neutro–protección."],
    ],
    errores: ["Medir aislamiento con los equipos conectados.", "Energizar antes de comprobar la continuidad del PE."],
  },
];
export { DG };
