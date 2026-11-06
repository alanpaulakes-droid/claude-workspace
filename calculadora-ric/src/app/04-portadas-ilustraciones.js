  function hub(title, lead, items) {
    return "<h1>".concat(title, '</h1><p class="lead">').concat(lead, '</p><div class="tiles">').concat(items.map((p) => '<button class="tile" type="button" data-go="'.concat(p.id, '"><span class="ti">').concat(p.ic || p.n || "\u0192", '</span><span class="tt">').concat(p.t, '</span><span class="td">').concat(p.d || "", "</span>").concat(RES[p.id] ? '<span class="pill ok">\u2713 calculado</span>' : "", "</button>")).join(""), "</div>");
  }
  const DESC = {
    t_icc: "Poder de corte, disparo magn\xE9tico y largo m\xE1ximo",
    t_ev: "Circuito exclusivo y diferencial para el cargador",
    t_fv: "kWp, strings e inversor para net billing",
    t_energia: "kWh al mes, costo y ahorro con LED",
    t_td: "Subalimentador, protecciones y ca\xEDda acumulada",
    pan: "Tablero de madera: arma, conecta y comprueba circuitos cortos",
    t_mom: "Cargas repartidas: suma de momentos el\xE9ctricos",
    e1: "Alcance y requerimientos del mandante",
    e3: "L\xE1mina de plano y especificaciones",
    e4: "Costos y carta Gantt",
    e5: "Control de avance en obra",
    e7: "Antecedentes y borrador TE1",
    e8: "Energizaci\xF3n, pruebas y acta de entrega",
    p1: "Inmueble, suministro y factibilidad",
    p2: "Puntos m\xEDnimos por recinto",
    p3: "Potencia, corriente, protecci\xF3n y cable",
    p4: "Demanda, empalme y alimentador",
    p5: "Termomagn\xE9ticos y diferenciales",
    p6: "IP, m\xF3dulos y reserva",
    p7: "Resistencias y conductor PE",
    p8: "Aislamiento y verificaciones",
    p9: "Resumen y observaciones",
    t_corriente: "P \u2194 I, mono y trif\xE1sico",
    t_potencias: "Suma los W de un circuito",
    t_caida: "Volts perdidos en el cable",
    ruta: "Niveles del b\xE1sico al instalador, repaso espaciado, contra reloj, simulacro tipo SEC y logros",
    demo: "Gr\xE1ficos y animaciones: ca\xEDda, protecci\xF3n, paso a paso y correcto vs incorrecto",
    t_conductor: "Secci\xF3n y tipo de cable",
    t_proteccion: "Autom\xE1tico y coordinaci\xF3n",
    t_cargas: "Varios circuitos a la vez",
    t_demanda: "Factor de demanda RIC",
    t_puntos: "Puntos por circuito",
    t_tierra: "Resistencia y PE",
    t_ohm: "V, I, R y P",
    t_curvas: "Tiempo de corte B, C y D",
    l_conceptos: "Tensi\xF3n, corriente, potencia\u2026",
    l_glosario: "Todas las abreviaturas",
    l_tablas: "Tablas RIC usadas",
    curso: "25 lecciones, juegos, examen y descarga",
    casa: "Plano, medidas y costos",
    l_comp: "Una imagen por componente"
  };
  const ICON = { ruta: "\u{1F3AF}", demo: "\u25B6", t_icc: "Icc", t_ev: "\u{1F50C}", t_fv: "\u2600", t_energia: "kWh", t_td: "TD", pan: "\u{1FAB5}", t_mom: "\u03A3IL", casa: "\u{1F4D0}", t_curvas: "\u2307", t_corriente: "A", t_potencias: "\u03A3", t_caida: "\u0394V", t_conductor: "mm\xB2", t_proteccion: "In", t_cargas: "\u2630", t_demanda: "Pd", t_puntos: "N", t_tierra: "\u23DA", t_ohm: "\u03A9", l_conceptos: "?", l_comp: "\u25E7", l_glosario: "Aa", l_tablas: "\u25A6", curso: "\u{1F393}" };
  function pgHubProy() {
    return hub("Instalaci\xF3n paso a paso", "Sigue los 9 pasos en orden. Cada paso usa los datos de los anteriores.", PAGES.filter((p) => p.g === "proy").map((p) => Object.assign({ d: DESC[p.id] }, p)));
  }
  function pgHubCalc() {
    return hub("Calculadoras r\xE1pidas", "C\xE1lculos sueltos e independientes. No modifican tu proyecto.", PAGES.filter((p) => p.g === "calc").map((p) => Object.assign({ d: DESC[p.id], ic: ICON[p.id] }, p)));
  }
  function pgHubLearn() {
    return hub("Aprender", "Conceptos, glosario y tablas de referencia.", PAGES.filter((p) => p.g === "learn").map((p) => Object.assign({ d: DESC[p.id], ic: ICON[p.id] }, p)));
  }
  const WC = { R: "#1F5FBF", S: "#1B1B1B", T: "#C0392B", N: "#F4F4F4", PE: "#2E9E44", PEy: "#E8C300", Cu: "#C87533" };
  function fig(vb, inner, cap, label) {
    return '<figure class="ill"><div class="sv"><svg viewBox="'.concat(vb, '" role="img" aria-label="').concat(esc(label || cap), '">').concat(inner, "</svg></div>").concat(cap ? "<figcaption>".concat(cap, "</figcaption>") : "", "</figure>");
  }
  const wl = (x1, y1, x2, y2, c) => '<line x1="'.concat(x1, '" y1="').concat(y1, '" x2="').concat(x2, '" y2="').concat(y2, '" stroke="#8a8a8a" stroke-width="6.5" stroke-linecap="round"/><line x1="').concat(x1, '" y1="').concat(y1, '" x2="').concat(x2, '" y2="').concat(y2, '" stroke="').concat(c, '" stroke-width="4" stroke-linecap="round"/>');
  const dot = (x, y) => '<circle cx="'.concat(x, '" cy="').concat(y, '" r="4.5" class="f-ink"/>');
  const tx = (x, y, t, c = "", a = "middle") => '<text x="'.concat(x, '" y="').concat(y, '" text-anchor="').concat(a, '" dominant-baseline="central" class="').concat(c, '">').concat(t, "</text>");
  const gnd = (x, y) => '<line x1="'.concat(x - 16, '" y1="').concat(y, '" x2="').concat(x + 16, '" y2="').concat(y, '" class="s-ink" stroke-width="2.5"/><line x1="').concat(x - 10, '" y1="').concat(y + 6, '" x2="').concat(x + 10, '" y2="').concat(y + 6, '" class="s-ink" stroke-width="2.5"/><line x1="').concat(x - 4, '" y1="').concat(y + 12, '" x2="').concat(x + 4, '" y2="').concat(y + 12, '" class="s-ink" stroke-width="2.5"/>');
  function person(x, y, arm) {
    return '<circle cx="'.concat(x, '" cy="').concat(y, '" r="11" class="s-ink f-surf" stroke-width="2.5"/><line x1="').concat(x, '" y1="').concat(y + 11, '" x2="').concat(x, '" y2="').concat(y + 62, '" class="s-ink" stroke-width="3"/><line x1="').concat(x, '" y1="').concat(y + 28, '" x2="').concat(arm, '" y2="').concat(y + 38, '" class="s-ink" stroke-width="3"/><line x1="').concat(x, '" y1="').concat(y + 62, '" x2="').concat(x - 14, '" y2="').concat(y + 104, '" class="s-ink" stroke-width="3"/><line x1="').concat(x, '" y1="').concat(y + 62, '" x2="').concat(x + 14, '" y2="').concat(y + 104, '" class="s-ink" stroke-width="3"/>');
  }
  function washer(x, y) {
    return '<rect x="'.concat(x, '" y="').concat(y, '" width="90" height="110" rx="6" class="s-ink f-surf" stroke-width="2"/><rect x="').concat(x + 8, '" y="').concat(y + 8, '" width="74" height="14" rx="3" class="f-line"/><circle cx="').concat(x + 45, '" cy="').concat(y + 66, '" r="27" class="s-ink f-surf2" stroke-width="2"/><circle cx="').concat(x + 45, '" cy="').concat(y + 66, '" r="17" class="s-mut" fill="none" stroke-width="1.5"/>');
  }
  const zig = (x, y, c = "#E8A33D") => '<path d="M'.concat(x, " ").concat(y, ' l8 8 l-6 4 l9 9" fill="none" stroke="').concat(c, '" stroke-width="3" stroke-linejoin="round"/>');
  const arrowHead = (x, y, dir, c) => {
    const d = { d: "".concat(x - 6, ",").concat(y - 9, " ").concat(x + 6, ",").concat(y - 9, " ").concat(x, ",").concat(y), u: "".concat(x - 6, ",").concat(y + 9, " ").concat(x + 6, ",").concat(y + 9, " ").concat(x, ",").concat(y), r: "".concat(x - 9, ",").concat(y - 6, " ").concat(x - 9, ",").concat(y + 6, " ").concat(x, ",").concat(y), l: "".concat(x + 9, ",").concat(y - 6, " ").concat(x + 9, ",").concat(y + 6, " ").concat(x, ",").concat(y) }[dir];
    return '<polygon points="'.concat(d, '" fill="').concat(c, '"/>');
  };
  const ILL = {};
  ILL.colores = () => {
    const rows = [[WC.R, "Fase R (L1)", "Azul"], [WC.S, "Fase S (L2)", "Negro"], [WC.T, "Fase T (L3)", "Rojo"], [WC.N, "Neutro (N)", "Blanco"], [WC.PE, "Tierra de protecci\xF3n (PE)", "Verde o verde/amarillo", 1]];
    let g = "";
    rows.forEach((r, i) => {
      const y = 18 + i * 42;
      g += '<rect x="20" y="'.concat(y, '" width="250" height="20" rx="10" fill="').concat(r[0], '" stroke="#8a8a8a" stroke-width="1.5"/>');
      if (r[3]) for (let x = 40; x < 255; x += 24) g += '<rect x="'.concat(x, '" y="').concat(y + 1, '" width="10" height="18" fill="').concat(WC.PEy, '"/>');
      g += '<rect x="266" y="'.concat(y + 6, '" width="38" height="8" rx="2" fill="').concat(WC.Cu, '"/><line x1="270" y1="').concat(y + 8, '" x2="302" y2="').concat(y + 8, '" stroke="#E7A46B" stroke-width="1"/><line x1="270" y1="').concat(y + 12, '" x2="302" y2="').concat(y + 12, '" stroke="#9C5A27" stroke-width="1"/>');
      g += tx(322, y + 4, r[1], "tb", "start") + tx(322, y + 20, r[2], "ts", "start");
    });
    return fig("0 0 640 228", g, "Colores de los conductores (RIC N\xB004, 5.32). En una vivienda monof\xE1sica se usan una fase, el neutro y la tierra. El verde y el verde/amarillo son solo para tierra.", "Colores de conductores: fases azul, negro y rojo; neutro blanco; tierra verde o verde y amarillo");
  };
  ILL.circuito = () => {
    let g = "";
    g += '<rect x="10" y="58" width="78" height="86" rx="6" class="s-ink f-surf" stroke-width="2"/>' + tx(49, 88, "Medidor", "tb") + tx(49, 108, "kWh", "ts");
    g += wl(88, 85, 140, 85, WC.R) + wl(88, 115, 140, 115, WC.N);
    g += '<rect x="140" y="62" width="60" height="76" rx="6" class="s-ink f-surf" stroke-width="2"/>' + tx(170, 48, "General", "tb");
    [85, 115].forEach((y) => {
      g += '<line x1="140" y1="'.concat(y, '" x2="156" y2="').concat(y, '" class="s-ink" stroke-width="2"/><line x1="156" y1="').concat(y, '" x2="178" y2="').concat(y - 11, '" class="s-ink" stroke-width="2.5"/><circle cx="183" cy="').concat(y, '" r="3" class="f-ink"/><line x1="183" y1="').concat(y, '" x2="200" y2="').concat(y, '" class="s-ink" stroke-width="2"/>');
    });
    g += wl(200, 85, 240, 85, WC.R) + wl(200, 115, 240, 115, WC.N);
    g += '<rect x="240" y="56" width="80" height="88" rx="6" class="s-ink f-surf" stroke-width="2"/>' + tx(280, 40, "Diferencial 30 mA", "tb");
    g += '<ellipse cx="280" cy="100" rx="13" ry="36" fill="none" stroke="'.concat(WC.Cu, '" stroke-width="7"/>') + wl(240, 85, 320, 85, WC.R) + wl(240, 115, 320, 115, WC.N);
    g += wl(320, 85, 360, 85, WC.R) + '<rect x="360" y="72" width="50" height="26" rx="4" class="s-ink f-surf" stroke-width="2"/>' + tx(385, 85, "TM", "tb") + tx(385, 60, "10 A", "ts");
    g += wl(410, 85, 462, 85, WC.R) + wl(320, 115, 588, 115, WC.N) + wl(462, 85, 574, 85, WC.R);
    g += wl(150, 165, 602, 165, WC.PE) + wl(150, 165, 150, 200, WC.PE) + gnd(150, 203) + tx(150, 238, "Puesta a tierra", "ts");
    g += wl(462, 85, 462, 198, WC.R) + wl(478, 115, 478, 198, WC.N) + dot(462, 85) + dot(478, 115) + '<circle cx="470" cy="214" r="16" class="s-ink f-surf" stroke-width="2.5"/><line x1="459" y1="203" x2="481" y2="225" class="s-ink" stroke-width="2"/><line x1="481" y1="203" x2="459" y2="225" class="s-ink" stroke-width="2"/>' + tx(470, 248, "Ampolleta", "ts");
    g += wl(574, 85, 574, 196, WC.R) + wl(588, 115, 588, 196, WC.N) + wl(602, 165, 602, 196, WC.PE) + dot(574, 85) + dot(588, 115) + dot(602, 165) + '<rect x="560" y="196" width="56" height="38" rx="6" class="s-ink f-surf" stroke-width="2"/><circle cx="574" cy="215" r="4" class="f-ink"/><circle cx="588" cy="215" r="4" class="f-ink"/><circle cx="602" cy="215" r="4" class="f-ink"/>' + tx(588, 250, "Enchufe", "ts");
    g += tx(500, 76, "Fase", "ts", "start") + tx(500, 106, "Neutro", "ts", "start") + tx(500, 156, "Tierra (PE)", "ts", "start");
    return fig("0 0 640 262", g, "C\xF3mo se conecta un circuito: la energ\xEDa pasa por el general, el diferencial y el termomagn\xE9tico. La ampolleta usa fase y neutro; el enchufe adem\xE1s lleva tierra.", "Diagrama de un circuito domiciliario");
  };
  ILL.termo = () => {
    const xm = (m) => 400 + Math.log10(m) / Math.log10(20) * 210;
    let g = "";
    g += '<rect x="78" y="8" width="24" height="36" rx="4" fill="'.concat(WC.Cu, '"/><rect x="30" y="30" width="120" height="200" rx="10" class="s-ink f-surf" stroke-width="2.5"/>');
    for (let i = 0; i < 6; i++) g += '<ellipse cx="90" cy="'.concat(62 + i * 7, '" rx="18" ry="4" fill="none" stroke="').concat(WC.Cu, '" stroke-width="2.5"/>');
    g += '<path d="M68 118 Q92 140 110 172" fill="none" stroke="#9aa3ad" stroke-width="5"/><path d="M74 116 Q98 138 116 170" fill="none" stroke="'.concat(WC.Cu, '" stroke-width="5"/>');
    g += '<rect x="66" y="196" width="18" height="7" class="f-ink"/><rect x="92" y="204" width="18" height="7" class="f-ink"/>';
    g += '<line x1="104" y1="26" x2="170" y2="26" class="s-mut" stroke-dasharray="3 3"/>' + tx(176, 26, "Palanca: arriba = encendido", "tb", "start");
    g += '<line x1="110" y1="78" x2="170" y2="78" class="s-mut" stroke-dasharray="3 3"/>' + tx(176, 72, "Bobina (parte magn\xE9tica)", "tb", "start") + tx(176, 90, "Corta al instante en un cortocircuito", "ts", "start");
    g += '<line x1="116" y1="150" x2="170" y2="150" class="s-mut" stroke-dasharray="3 3"/>' + tx(176, 144, "L\xE1mina bimet\xE1lica (t\xE9rmica)", "tb", "start") + tx(176, 162, "Se curva con el calor de una sobrecarga", "ts", "start");
    g += '<line x1="112" y1="206" x2="170" y2="206" class="s-mut" stroke-dasharray="3 3"/>' + tx(176, 206, "Contactos y c\xE1mara apaga-chispas", "ts", "start");
    g += '<line x1="400" y1="20" x2="400" y2="215" class="s-ink" stroke-width="1.5"/><line x1="400" y1="215" x2="620" y2="215" class="s-ink" stroke-width="1.5"/>';
    [1, 3, 5, 10, 20].forEach((m) => {
      g += '<line x1="'.concat(xm(m), '" y1="215" x2="').concat(xm(m), '" y2="221" class="s-ink"/>') + tx(xm(m), 231, m === 1 ? "1\xD7In" : m, "ts");
    });
    g += tx(404, 12, "Tiempo de corte", "ts", "start") + tx(510, 250, "Corriente (veces In)", "ts");
    g += '<path d="M'.concat(xm(1.13), " 30 C").concat(xm(1.5), " 110 ").concat(xm(2.5), " 140 ").concat(xm(3), " 150 L").concat(xm(5), ' 205 L618 208" fill="none" stroke="var(--blue)" stroke-width="3"/>');
    g += '<path d="M'.concat(xm(1.13), " 30 C").concat(xm(1.6), " 115 ").concat(xm(4), " 150 ").concat(xm(5), " 155 L").concat(xm(10), ' 205 L618 208" fill="none" stroke="var(--copper)" stroke-width="3" stroke-dasharray="7 4"/>');
    g += tx(xm(3) - 8, 130, "Curva B", "tb", "end") + tx(xm(10) + 6, 170, "Curva C", "tb", "start");
    return fig("0 0 640 258", g, "El termomagn\xE9tico tiene dos partes. La t\xE9rmica corta lento cuando la corriente sube un poco por mucho rato; la magn\xE9tica corta al instante con un cortocircuito. La curva B corta entre 3 y 5 veces In; la C entre 5 y 10, por eso tolera arranques.", "Partes del termomagn\xE9tico y curvas B y C");
  };
  ILL.diferencial = () => {
    let g = "";
    g += '<path d="M90 120 A60 22 0 0 1 210 120" fill="none" stroke="'.concat(WC.Cu, '" stroke-width="11"/>') + wl(135, 22, 135, 228, WC.R) + wl(165, 22, 165, 228, WC.N) + '<path d="M90 120 A60 22 0 0 0 210 120" fill="none" stroke="'.concat(WC.Cu, '" stroke-width="11"/>');
    g += arrowHead(135, 60, "d", WC.R) + arrowHead(165, 185, "u", "#8a8a8a") + tx(122, 48, "I fase", "ts", "end") + tx(178, 190, "I neutro", "ts", "start");
    for (let i = 0; i < 4; i++) g += '<ellipse cx="'.concat(212 + i * 5, '" cy="120" rx="3" ry="9" fill="none" class="s-ink" stroke-width="2"/>');
    g += '<line x1="230" y1="124" x2="250" y2="160" class="s-ink" stroke-width="2"/><rect x="242" y="160" width="70" height="32" rx="5" class="s-ink f-surf" stroke-width="2"/>' + tx(277, 176, "Rel\xE9", "tb") + tx(277, 210, "corta", "ts");
    g += tx(150, 250, "Si I fase = I neutro, no hay fuga", "ts");
    g += '<line x1="330" y1="10" x2="330" y2="250" class="s-line"/>';
    g += washer(360, 92) + zig(432, 98) + person(530, 82, 452) + '<line x1="345" y1="214" x2="625" y2="214" class="s-ink" stroke-width="2"/>';
    for (let x = 350; x < 625; x += 14) g += '<line x1="'.concat(x, '" y1="214" x2="').concat(x - 8, '" y2="224" class="s-mut"/>');
    g += '<path d="M530 188 L530 210" stroke="var(--bad)" stroke-width="3" stroke-dasharray="4 3"/>' + arrowHead(530, 212, "d", "var(--bad)");
    g += tx(480, 40, "Fuga a trav\xE9s de la persona", "tb") + tx(480, 244, "Si la diferencia supera 30 mA, corta en milisegundos", "ts");
    return fig("0 0 640 260", g, "El diferencial compara la corriente que va por la fase con la que vuelve por el neutro dentro de un anillo (toroide). Si falta corriente, se est\xE1 escapando a tierra, por ejemplo por una persona, y el rel\xE9 corta.", "Funcionamiento del diferencial");
  };
  ILL.tierra = () => {
    let g = "";
    g += tx(160, 22, "Sin conexi\xF3n a tierra", "tb bad") + washer(50, 70) + zig(122, 76) + person(230, 60, 142);
    g += '<line x1="15" y1="214" x2="305" y2="214" class="s-ink" stroke-width="2"/><path d="M230 166 L230 210" stroke="var(--bad)" stroke-width="3.5" stroke-dasharray="5 3"/>' + arrowHead(230, 212, "d", "var(--bad)") + tx(160, 240, "La corriente de falla pasa por la persona", "ts");
    g += '<line x1="320" y1="10" x2="320" y2="250" class="s-line"/>';
    g += tx(480, 22, "Con tierra (PE) y diferencial", "tb ok") + washer(370, 70) + zig(442, 76) + person(560, 60, 462);
    g += wl(370, 160, 350, 160, WC.PE) + wl(350, 160, 350, 196, WC.PE) + gnd(350, 198) + '<line x1="335" y1="214" x2="625" y2="214" class="s-ink" stroke-width="2"/>';
    g += '<path d="M372 150 L356 150 L356 188" fill="none" stroke="var(--ok)" stroke-width="3" stroke-dasharray="5 3"/>' + arrowHead(356, 190, "d", "var(--ok)");
    g += tx(480, 240, "La falla se va por la tierra y el diferencial corta", "ts");
    return fig("0 0 640 258", g, "La puesta a tierra le da a la corriente de falla un camino seguro. Sin ella, el camino es la persona que toca el equipo.", "Comparaci\xF3n con y sin puesta a tierra");
  };
  ILL.condensador = () => {
    let g = "";
    g += '<line x1="30" y1="110" x2="86" y2="110" class="s-ink" stroke-width="2.5"/><line x1="86" y1="84" x2="86" y2="136" class="s-ink" stroke-width="5"/><line x1="102" y1="84" x2="102" y2="136" class="s-ink" stroke-width="5"/><line x1="102" y1="110" x2="150" y2="110" class="s-ink" stroke-width="2.5"/>' + tx(94, 160, "S\xEDmbolo", "ts");
    g += '<line x1="205" y1="60" x2="205" y2="78" class="s-ink" stroke-width="3"/><line x1="227" y1="60" x2="227" y2="78" class="s-ink" stroke-width="3"/><rect x="190" y="76" width="52" height="96" rx="9" fill="var(--blue-soft)" class="s-ink" stroke-width="2"/><ellipse cx="216" cy="78" rx="26" ry="6" class="s-ink f-surf" stroke-width="2"/>' + tx(216, 125, "\xB5F", "tb") + tx(216, 196, "Condensador", "tb") + tx(216, 214, "Se mide en \xB5F o kVAr", "ts");
    g += '<line x1="330" y1="200" x2="560" y2="60" class="s-mut" stroke-width="2" stroke-dasharray="6 4"/><line x1="560" y1="200" x2="560" y2="60" class="s-mut" stroke-width="2" stroke-dasharray="6 4"/>';
    g += '<line x1="330" y1="200" x2="560" y2="200" stroke="var(--blue)" stroke-width="5"/><line x1="560" y1="200" x2="560" y2="150" stroke="var(--copper)" stroke-width="5"/><line x1="330" y1="200" x2="560" y2="150" class="s-ink" stroke-width="3.5"/>';
    g += '<path d="M380 200 A50 50 0 0 0 378 188" fill="none" class="s-ink" stroke-width="2"/>' + tx(392, 190, "\u03C6", "tb", "start");
    g += tx(445, 222, "P (W): potencia \xFAtil", "ts") + tx(568, 175, "Q despu\xE9s", "ts", "start") + tx(568, 95, "Q antes", "ts", "start") + tx(430, 108, "S antes", "ts") + tx(470, 160, "S despu\xE9s", "ts");
    g += tx(330, 24, "cos \u03C6 = P \xF7 S: sube de 0,85 a 0,98", "tb", "start");
    return fig("0 0 640 240", g, "El condensador entrega la potencia reactiva (Q) que piden motores y fuentes. As\xED la red entrega menos potencia aparente (S), la corriente baja y el cos \u03C6 sube.", "Condensador y tri\xE1ngulo de potencias");
  };
  ILL.caida = () => {
    let g = '<defs><linearGradient id="gdv" x1="0" x2="1"><stop offset="0" stop-color="#1F5FBF"/><stop offset="1" stop-color="#C87533"/></linearGradient></defs>';
    g += '<rect x="20" y="60" width="70" height="80" rx="6" class="s-ink f-surf" stroke-width="2"/>' + tx(55, 100, "Tablero", "tb");
    g += '<line x1="90" y1="100" x2="548" y2="100" stroke="url(#gdv)" stroke-width="12" stroke-linecap="round"/><circle cx="570" cy="100" r="20" class="s-ink f-surf" stroke-width="2.5"/><line x1="556" y1="86" x2="584" y2="114" class="s-ink" stroke-width="2"/><line x1="584" y1="86" x2="556" y2="114" class="s-ink" stroke-width="2"/>';
    g += tx(110, 72, "220,0 V", "tb", "start") + tx(540, 66, "213,8 V", "tb", "end");
    g += '<line x1="90" y1="128" x2="548" y2="128" class="s-mut"/><line x1="90" y1="122" x2="90" y2="134" class="s-mut"/><line x1="548" y1="122" x2="548" y2="134" class="s-mut"/>' + tx(319, 142, "L = 30 m \xB7 I = 14,4 A \xB7 S = 2,5 mm\xB2", "ts");
    g += tx(320, 178, "\u0394V = 2 \xD7 0,018 \xD7 30 \xD7 14,4 \xF7 2,5 = 6,2 V  \u2192  2,8 %", "tb");
    return fig("0 0 640 200", g, "A lo largo del cable se pierde tensi\xF3n: el equipo recibe menos volts que los que hay en el tablero. M\xE1s largo o m\xE1s corriente aumenta la p\xE9rdida; m\xE1s secci\xF3n la reduce.", "Ca\xEDda de tensi\xF3n a lo largo de un cable");
  };
  ILL.monotri = () => {
    let g = "";
    g += tx(160, 22, "Monof\xE1sico", "tb") + wl(40, 70, 280, 70, WC.R) + wl(40, 120, 280, 120, WC.N) + '<line x1="160" y1="80" x2="160" y2="110" class="s-ink" stroke-width="2"/>' + arrowHead(160, 76, "u", "var(--ink)") + arrowHead(160, 114, "d", "var(--ink)") + tx(172, 95, "220 V", "tb", "start") + tx(30, 70, "F", "ts", "end") + tx(30, 120, "N", "ts", "end") + tx(160, 170, "1 fase + neutro + tierra", "ts");
    g += '<line x1="320" y1="10" x2="320" y2="200" class="s-line"/>';
    g += tx(480, 22, "Trif\xE1sico", "tb");
    [[55, WC.R, "R"], [85, WC.S, "S"], [115, WC.T, "T"], [145, WC.N, "N"]].forEach(([y, c, l]) => {
      g += wl(360, y, 600, y, c) + tx(350, y, l, "ts", "end");
    });
    g += '<line x1="420" y1="62" x2="420" y2="78" class="s-ink" stroke-width="2"/>' + tx(430, 70, "380 V", "tb", "start") + '<line x1="540" y1="122" x2="540" y2="138" class="s-ink" stroke-width="2"/>' + tx(550, 130, "220 V", "tb", "start");
    g += tx(480, 182, "380 V entre fases \xB7 220 V fase\u2013neutro", "ts");
    return fig("0 0 640 200", g, "Una casa normal recibe una fase y el neutro (220 V). En trif\xE1sico llegan tres fases: entre dos fases hay 380 V y entre una fase y el neutro, 220 V.", "Monof\xE1sico y trif\xE1sico");
  };
  ILL.tablero = () => {
    let g = '<rect x="20" y="16" width="480" height="270" rx="10" class="s-ink f-surf2" stroke-width="2.5"/>';
    const dev = (x, y, w, lab, lv = true) => '<rect x="'.concat(x, '" y="').concat(y, '" width="').concat(w, '" height="60" rx="4" class="s-ink f-surf" stroke-width="2"/>').concat(lv ? '<rect x="'.concat(x + w / 2 - 6, '" y="').concat(y + 10, '" width="12" height="18" rx="2" fill="').concat(WC.Cu, '"/>') : "").concat(tx(x + w / 2, y + 74, lab, "ts"));
    g += '<rect x="36" y="62" width="448" height="8" class="f-mut"/><rect x="36" y="157" width="448" height="8" class="f-mut"/>';
    g += dev(46, 36, 72, "General") + dev(132, 36, 72, "DR1 30 mA") + dev(218, 36, 72, "DR2 30 mA") + '<rect x="306" y="36" width="168" height="60" rx="4" fill="none" class="s-mut" stroke-dasharray="6 4"/>' + tx(390, 66, "Reserva 25 %", "ts");
    ["C1", "C2", "C3", "C4", "C5", "C6"].forEach((c, i) => {
      g += dev(46 + i * 40, 131, 34, c);
    });
    g += '<rect x="306" y="131" width="168" height="60" rx="4" fill="none" class="s-mut" stroke-dasharray="6 4"/>' + tx(390, 161, "Reserva", "ts");
    g += '<rect x="46" y="232" width="190" height="14" rx="3" fill="'.concat(WC.N, '" stroke="#8a8a8a" stroke-width="1.5"/><rect x="276" y="232" width="190" height="14" rx="3" fill="').concat(WC.PE, '"/>');
    for (let i = 0; i < 7; i++) g += '<circle cx="'.concat(62 + i * 26, '" cy="239" r="3.5" fill="#9aa3ad"/><circle cx="').concat(292 + i * 26, '" cy="239" r="3.5" fill="#cfe9d4"/>');
    g += tx(141, 266, "Barra neutro (N)", "ts") + tx(371, 266, "Barra tierra (PE)", "ts");
    return fig("0 0 520 300", g, "Orden t\xEDpico de un tablero domiciliario: interruptor general, diferenciales, un termomagn\xE9tico por circuito, barras de neutro y de tierra separadas, y espacio de reserva.", "Tablero domiciliario");
  };
  ILL.instrumentos = () => {
    let g = "";
    g += '<rect x="30" y="18" width="100" height="150" rx="12" fill="#F2C230" class="s-ink" stroke-width="2"/><rect x="42" y="32" width="76" height="34" rx="4" fill="#B9CBA8"/><text x="80" y="50" text-anchor="middle" dominant-baseline="central" style="font-family:var(--f-mono);font-size:17px;fill:#1b2b1b">220.4</text><circle cx="80" cy="108" r="24" fill="#2b2b2b"/><line x1="80" y1="108" x2="94" y2="92" stroke="#eee" stroke-width="3"/><line x1="62" y1="168" x2="52" y2="196" stroke="#C0392B" stroke-width="4"/><line x1="98" y1="168" x2="108" y2="196" stroke="#1B1B1B" stroke-width="4"/>' + tx(80, 212, "Mult\xEDmetro", "tb") + tx(80, 230, "Tensi\xF3n y continuidad", "ts");
    g += '<circle cx="235" cy="50" r="28" fill="none" stroke="#2b2b2b" stroke-width="10" stroke-dasharray="150 26"/><rect x="200" y="74" width="70" height="104" rx="10" fill="#E2632B" class="s-ink" stroke-width="2"/><rect x="210" y="94" width="50" height="22" rx="3" fill="#B9CBA8"/><text x="235" y="105" text-anchor="middle" dominant-baseline="central" style="font-family:var(--f-mono);font-size:13px;fill:#1b2b1b">9.1 A</text>' + tx(235, 212, "Pinza amperim\xE9trica", "tb") + tx(235, 230, "Corriente sin cortar", "ts");
    g += '<rect x="330" y="40" width="110" height="128" rx="10" fill="#2B6CB0" class="s-ink" stroke-width="2"/><rect x="342" y="54" width="86" height="30" rx="3" fill="#B9CBA8"/><text x="385" y="69" text-anchor="middle" dominant-baseline="central" style="font-family:var(--f-mono);font-size:13px;fill:#1b2b1b">&gt;200 M\u03A9</text><circle cx="385" cy="124" r="18" fill="#C0392B"/><text x="385" y="124" text-anchor="middle" dominant-baseline="central" style="font-size:10px;font-weight:700;fill:#fff">TEST</text>' + tx(385, 212, "Meg\xF3hmetro", "tb") + tx(385, 230, "Aislamiento a 500 V", "ts");
    g += '<rect x="490" y="30" width="96" height="88" rx="10" fill="#3A7D44" class="s-ink" stroke-width="2"/><rect x="502" y="44" width="72" height="26" rx="3" fill="#B9CBA8"/><text x="538" y="57" text-anchor="middle" dominant-baseline="central" style="font-family:var(--f-mono);font-size:13px;fill:#1b2b1b">15 \u03A9</text><line x1="480" y1="180" x2="625" y2="180" class="s-ink" stroke-width="2"/>';
    [500, 545, 600].forEach((x) => {
      g += '<line x1="538" y1="118" x2="'.concat(x, '" y2="160" class="s-mut"/><line x1="').concat(x, '" y1="160" x2="').concat(x, '" y2="186" class="s-ink" stroke-width="3"/>');
    });
    g += tx(545, 212, "Telur\xF3metro", "tb") + tx(545, 230, "Resistencia de tierra", "ts");
    return fig("0 0 640 240", g, "Instrumentos del instalador: mult\xEDmetro (tensi\xF3n y continuidad), pinza amperim\xE9trica (corriente sin cortar el cable), meg\xF3hmetro (aislamiento) y telur\xF3metro (puesta a tierra).", "Instrumentos de medici\xF3n");
  };
  ILL.ohm = () => {
    let g = "";
    g += '<rect x="40" y="70" width="110" height="80" rx="8" fill="var(--blue-soft)" class="s-ink" stroke-width="2"/>' + tx(95, 100, "Presi\xF3n", "tb") + tx(95, 120, "= Tensi\xF3n V", "ts");
    g += '<rect x="150" y="96" width="140" height="28" fill="var(--blue-soft)" class="s-ink" stroke-width="2"/><rect x="290" y="104" width="120" height="12" fill="var(--blue-soft)" class="s-ink" stroke-width="2"/><rect x="410" y="96" width="140" height="28" fill="var(--blue-soft)" class="s-ink" stroke-width="2"/>';
    [190, 240, 450, 500].forEach((x) => {
      g += arrowHead(x, 110, "r", "var(--blue)");
    });
    g += tx(220, 150, "Caudal = Corriente I", "ts") + tx(350, 150, "Estrechez = Resistencia R", "ts") + tx(480, 150, "I = V \xF7 R", "tb");
    return fig("0 0 600 180", g, "Analog\xEDa del agua: la tensi\xF3n es la presi\xF3n, la corriente es el caudal y la resistencia es un estrechamiento de la ca\xF1er\xEDa.", "Analog\xEDa de la ley de Ohm");
  };
