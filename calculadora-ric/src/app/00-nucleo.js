  /* Motor de cálculo y datos normativos: src/engine (TypeScript) y src/data/ric.json, expuestos como RICEngine. */
  const { COM, SECC, AMP_CFG_DEF, AMP_NCH, ampTable, fnRIC, llenadoMax, parseNum, nextCom, fdViv, fsViv, chooseIn } = RICEngine;
  const RIC_DATA = Object.assign({}, RICEngine.RIC, { tierraServ: RICEngine.RIC.tierraServ.max });
  const AMP_DEF = ampTable(AMP_CFG_DEF);
  const TIPOS_REC = { dormitorio: "Dormitorio", living: "Living", comedor: "Comedor", estar: "Sala de estar", cocina: "Cocina", lavadero: "Lavadero", bano: "Ba\xF1o", pasillo: "Pasillo / hall", escalera: "Escalera", otro: "Otro" };
  const USOS = { alumbrado: ["Alumbrado", 1.5, 0, "B", 100], enchufes: ["Enchufes generales", 2.5, 0, "C", 250], cocina: ["Enchufes cocina / lavadero", 2.5, 16, "C", 250], horno: ["Horno o cocina el\xE9ctrica", 2.5, 16, "C", 0], especial: ["Otra carga (equipo)", 2.5, 0, "C", 0], sub: ["Subalimentador", 2.5, 0, "C", 0], alim: ["Alimentador", 4, 25, "\u2014", 0] };
  const CIR_T = ["alumbrado", "enchufes", "cocina", "horno", "especial"];
  const AMB_CABLE = { seco: ["Interior seco, en ducto", "THHN (90 \xB0C) o H07V-K (70 \xB0C)"], humedo: ["Ambiente h\xFAmedo", "THWN-2 (90 \xB0C)"], enterrado: ["Directamente enterrado", "RV-K (90 \xB0C, 0,6/1 kV)"], reunion: ["Lugar de reuni\xF3n de personas", "H07Z1-K libre de hal\xF3genos (solo circuitos)"], aire: ["Bandeja o aire libre (alimentador)", "RV o RV-K (90 \xB0C)"] };
  const IP_UB = { interior: ["Interior", "IP41"], bajotecho: ["Exterior bajo techo", "IP44"], intemperie: ["Exterior a la intemperie", "IP54"], humedo: ["Lugar h\xFAmedo o mojado", "IPX4, separado 6,5 mm del muro"] };
  const GLOS = {
    "V": "Tensi\xF3n (volts, V). Es la \u201Cpresi\xF3n\u201D que empuja la corriente. En Chile: 220 V entre fase y neutro.",
    "VL": "Tensi\xF3n entre l\xEDneas en un sistema trif\xE1sico, es decir, entre dos fases. En Chile: 380 V.",
    "I": "Corriente (amperes, A). Cantidad de electricidad que circula por el cable cada segundo.",
    "Is": "Corriente de servicio: la corriente que circula por un circuito con toda su carga proyectada.",
    "In": "Corriente nominal de la protecci\xF3n: el n\xFAmero en amperes impreso en el autom\xE1tico (6, 10, 16, 20, 25 A\u2026).",
    "Iz": "Corriente admisible del conductor: lo m\xE1ximo que el cable soporta de forma continua sin que su aislaci\xF3n se da\xF1e por calor.",
    "I\u0394n": "Sensibilidad del diferencial: la corriente de fuga con la que dispara. En viviendas: 30 mA = 0,03 A.",
    "R": "Resistencia (ohm, \u03A9). Cu\xE1nto se opone un material al paso de la corriente.",
    "P": "Potencia activa (watts, W). Energ\xEDa por segundo que se convierte en luz, calor o movimiento.",
    "P_inst": "Potencia instalada: suma de las potencias de todos los puntos y equipos de la instalaci\xF3n.",
    "Pd": "Potencia de demanda: la potencia m\xE1xima que se espera usar al mismo tiempo. Pd = P_inst \xD7 Fd.",
    "Pap": "Potencia aparente (VA): la que la red entrega en total, incluida la parte que no produce trabajo. Pap = P \xF7 cos \u03C6.",
    "VA": "Volt-ampere: unidad de la potencia aparente. Coincide con los watts solo si cos \u03C6 = 1.",
    "Fd": "Factor de demanda (\u2264 1): qu\xE9 fracci\xF3n de la potencia instalada se usa realmente a la vez. RIC N\xB003, Tabla 3.1.",
    "Fs": "Factor de simultaneidad: cuando varias viviendas comparten empalme, fracci\xF3n de ellas que tiene su m\xE1ximo a la misma hora. RIC N\xB003, Tabla 3.2.",
    "cos \u03C6": "Factor de potencia (0 a 1). Qu\xE9 parte de la corriente produce trabajo \xFAtil. Resistencias y ampolletas = 1; motores \u2248 0,8\u20130,9.",
    "\u03C1": "Resistividad (rho) del material del cable, en \u03A9\xB7mm\xB2/m. Cobre \u2248 0,018 (criterio usual que considera el cable tibio; el RIC N\xB004, Tabla 4.1, exige 100 % IACS, es decir 0,01724 a 20 \xB0C). Mientras menor, mejor conduce.",
    "L": "Largo del tramo de cable, en metros, medido solo de ida (del tablero al punto).",
    "S": "Secci\xF3n del conductor (mm\xB2): el \xE1rea del corte transversal del cobre. M\xE1s secci\xF3n = menos resistencia y menos calor.",
    "\u0394V": "Ca\xEDda de tensi\xF3n: volts que se pierden en el cable por su resistencia. Se expresa tambi\xE9n en % de la tensi\xF3n nominal.",
    "fc": "Factor de correcci\xF3n: reduce la capacidad del cable si hace calor o si van varios circuitos juntos. 1 = sin correcci\xF3n.",
    "TM": "Interruptor termomagn\xE9tico (autom\xE1tico). Protege el CABLE contra sobrecarga (parte t\xE9rmica) y cortocircuito (parte magn\xE9tica).",
    "DR": "Protector diferencial. Protege a las PERSONAS: compara la corriente que entra y la que sale; si hay diferencia (fuga), corta.",
    "Curva": "Curva de disparo del termomagn\xE9tico. B: corta r\xE1pido (3\u20135 \xD7 In), para iluminaci\xF3n. C: tolera arranques (5\u201310 \xD7 In), para enchufes y equipos.",
    "PE": "Conductor de protecci\xF3n (tierra), verde o verde/amarillo. Une las partes met\xE1licas con la puesta a tierra.",
    "N": "Conductor neutro, blanco. Por \xE9l vuelve la corriente.",
    "TN-S": "Esquema de tierra exigido en viviendas: el neutro (N) y la tierra de protecci\xF3n (PE) van separados en toda la instalaci\xF3n.",
    "UL": "Tensi\xF3n de seguridad: lo m\xE1ximo que puede quedar en una carcasa sin peligro. 50 V en lugar seco y 24 V en lugar h\xFAmedo.",
    "IP": "Grado de protecci\xF3n de una caja o tablero. 1.\xAA cifra: contra s\xF3lidos; 2.\xAA cifra: contra agua. Ej.: IP44.",
    "DIN": "Riel met\xE1lico de 35 mm donde se montan las protecciones en el tablero. Cada aparato ocupa \u201Cm\xF3dulos\u201D de 18 mm.",
    "M\u03A9": "Megaohm = un mill\xF3n de ohm. Unidad de la resistencia de aislamiento.",
    "TE-1": "Declaraci\xF3n de la instalaci\xF3n el\xE9ctrica interior que el instalador autorizado presenta a la SEC.",
    "SEC": "Superintendencia de Electricidad y Combustibles: fiscaliza las instalaciones el\xE9ctricas en Chile.",
    "RIC": "Reglamento de Instalaciones de Consumo: pliegos t\xE9cnicos N\xB001 a N\xB019 de la SEC, que reemplazan a la NCh Elec. 4/2003.",
    "kW": "Kilowatt = 1.000 W.",
    "Q": "Potencia reactiva (VAr): la que usan motores y fuentes para crear campos magn\xE9ticos. Va y viene sin hacer trabajo \xFAtil.",
    "VAr": "Volt-ampere reactivo: unidad de la potencia reactiva Q.",
    "OL": "Fuera de rango (overload). En una prueba de continuidad significa circuito abierto: el conductor est\xE1 cortado."
  };
  const KEY = "ric-calc-v3";
  function blankProject() {
    return { proj: { nombre: "", sistema: "mono", V: 220, VL: 380, cf: 1, rho: 0.018, fc: 1, Lalim: 0, nViv: 1, ubic: "interior", potHorno: 1500 }, rooms: [], circuits: [], tierra: { Rserv: 0, Rprot: 0, amb: "seco", idn: 0.03 }, ens: { items: {}, aisl: [] } };
  }
  function exampleProject() {
    const p = blankProject();
    Object.assign(p.proj, { nombre: "Casa ejemplo 60 m\xB2", Lalim: 12, potHorno: 2e3 });
    p.rooms = [
      { nombre: "Living-comedor", tipo: "living", area: 20, perim: 18, centros: 2, enchufes: 3, horno: false },
      { nombre: "Cocina", tipo: "cocina", area: 8, perim: 11.5, centros: 1, enchufes: 3, horno: true },
      { nombre: "Dormitorio 1", tipo: "dormitorio", area: 12, perim: 14, centros: 2, enchufes: 2, horno: false },
      { nombre: "Dormitorio 2", tipo: "dormitorio", area: 9, perim: 12, centros: 1, enchufes: 2, horno: false },
      { nombre: "Ba\xF1o", tipo: "bano", area: 4, perim: 8, centros: 1, enchufes: 0, horno: false },
      { nombre: "Lavadero", tipo: "lavadero", area: 3, perim: 7, centros: 1, enchufes: 1, horno: false },
      { nombre: "Pasillo", tipo: "pasillo", area: 4, perim: 9, centros: 1, enchufes: 0, horno: false }
    ];
    p.circuits = genCircuits(p);
    const Ls = { alumbrado: 15, enchufes: 18, cocina: 12, horno: 10 };
    p.circuits.forEach((c) => c.L = Ls[c.tipo] || 15);
    p.tierra = { Rserv: 15, Rprot: 40, amb: "seco", idn: 0.03 };
    return p;
  }
  function toolBlank() {
    return {
      corriente: { modo: "PaI", sis: "mono", P: 0, I: 0, V: 220, VL: 380, cf: 1 },
      caida: { sis: "mono", ent: "I", I: 0, P: 0, cf: 1, V: 220, VL: 380, L: 0, S: 2.5, rho: 0.018, lim: 3 },
      conductor: { uso: "enchufes", amb: "seco", sis: "mono", ent: "P", P: 0, I: 0, cf: 1, V: 220, VL: 380, L: 0, lim: 5, fc: 1, rho: 0.018, ta: 30, ng: 1 },
      proteccion: { tipo: "enchufes", ent: "P", P: 0, I: 0, V: 220, cf: 1, S: 2.5, fc: 1, ta: 30, ng: 1 },
      cargas: { V: 220, cf: 1, dvA: 0, rho: 0.018, fc: 1, rows: [] },
      demanda: { P: 0, n: 1, sis: "mono", V: 220, VL: 380, cf: 1 },
      puntos: { In: 10, V: 220, cf: 1, W: 250, tipo: "dormitorio", area: 0, perim: 0 },
      tierra: { amb: "seco", idn: 0.03, R: 0, Rs: 0, Sf: 4, rho: 0, Lb: 1.5, nb: 1 },
      ohm: { par: "VI", V: 0, I: 0, R: 0, P: 0 },
      curvas: { In: 16, cv: "C", I: 0 },
      potencias: { V: 220, cf: 1, rows: [] },
      icc: { Icc0: 3, Sa: 6, La: 12, Ig: 25, pdcG: 6, In: 16, cv: "C", pdc: 6, S: 2.5, L: 0 },
      ev: { P: 7400, L: 0, Pd: 0, Ig: 25, amb: "int", ta: 30, ng: 1, fc: 1 },
      fv: { kwh: 0, hsp: 5, pr: 0.8, Wp: 550, Voc: 49.5, Vmp: 41.5, bVoc: -0.27, Tmin: -5, Tmax: 70, Vmax: 600, mppt0: 120, mppt1: 550, Lac: 10, Pinv: 0 },
      energia: { tar: 200, rows: [] },
      td: { Pv: 0, Ig: 40, Sa: 10, La: 12, Ls: 0, ta: 30, ng: 1, fc: 1, rows: [] },
      mom: { V: 220, S: 2.5, lim: 3, dva: 0, rows: [] }
    };
  }
  function toolExample(k) {
    return {
      corriente: { modo: "PaI", sis: "mono", P: 2e3, I: 0, V: 220, VL: 380, cf: 1 },
      caida: { sis: "mono", ent: "I", I: 10, P: 0, cf: 1, V: 220, VL: 380, L: 25, S: 2.5, rho: 0.018, lim: 3 },
      conductor: { uso: "enchufes", amb: "seco", sis: "mono", ent: "P", P: 2e3, I: 0, cf: 1, V: 220, VL: 380, L: 20, lim: 5, fc: 1, rho: 0.018 },
      proteccion: { tipo: "enchufes", ent: "P", P: 1750, I: 0, V: 220, cf: 1, S: 2.5, fc: 1 },
      cargas: { V: 220, cf: 1, dvA: 1, rho: 0.018, fc: 1, rows: [{ n: "Iluminaci\xF3n", tipo: "alumbrado", cant: 8, w: 100, L: 15 }, { n: "Enchufes dormitorios", tipo: "enchufes", cant: 6, w: 250, L: 18 }, { n: "Cocina", tipo: "cocina", cant: 4, w: 250, L: 12 }, { n: "Horno", tipo: "horno", cant: 1, w: 2e3, L: 10 }] },
      demanda: { P: 8e3, n: 1, sis: "mono", V: 220, VL: 380, cf: 1 },
      puntos: { In: 10, V: 220, cf: 1, W: 250, tipo: "living", area: 20, perim: 18 },
      tierra: { amb: "seco", idn: 0.03, R: 40, Rs: 15, Sf: 4, rho: 100, Lb: 1.5, nb: 2 },
      ohm: { par: "VI", V: 220, I: 10, R: 0, P: 0 },
      curvas: { In: 16, cv: "C", I: 40 },
      potencias: { V: 220, cf: 1, rows: [{ n: "Centros de luz", cant: 6, w: 100 }, { n: "Enchufes", cant: 5, w: 250 }, { n: "Microondas", cant: 1, w: 1200 }] },
      icc: { Icc0: 3, Sa: 6, La: 15, Ig: 25, pdcG: 6, In: 16, cv: "C", pdc: 6, S: 2.5, L: 35 },
      ev: { P: 7400, L: 18, Pd: 5200, Ig: 40, amb: "int", ta: 35, ng: 1, fc: 1 },
      fv: { kwh: 280, hsp: 5, pr: 0.8, Wp: 550, Voc: 49.5, Vmp: 41.5, bVoc: -0.27, Tmin: -5, Tmax: 70, Vmax: 600, mppt0: 120, mppt1: 550, Lac: 12, Pinv: 0 },
      energia: { tar: 200, rows: EN_DEF.map(([n, c, w, h, led]) => ({ n, c, w, h, led })) },
      td: { Pv: 9e3, Ig: 40, Sa: 10, La: 12, Ls: 14, ta: 35, ng: 1, fc: 1, rows: TD_DEF.map(([n, tipo, P, L]) => ({ n, tipo, P, L })) },
      mom: { V: 220, S: 2.5, lim: 3, dva: 1.2, rows: MOM_DEF.map(([n, P, L]) => ({ n, P, L })) }
    }[k];
  }
  let S;
  try {
    S = JSON.parse(localStorage.getItem(KEY) || "null");
  } catch (e) {
    S = null;
  }
  if (!S || !S.proj) {
    S = Object.assign(blankProject(), { amp: Object.assign({}, AMP_DEF), ampCfg: Object.assign({}, AMP_CFG_DEF), tools: toolBlank() });
  }
  function ampMigrate(st) {
    if (!st.amp) st.amp = Object.assign({}, AMP_DEF);
    if (!st.ampCfg) {
      const old = Object.keys(AMP_NCH).every((k) => +st.amp[k] === AMP_NCH[k]);
      st.ampCfg = Object.assign({}, AMP_CFG_DEF, { custom: !old });
      if (old) {
        st.amp = Object.assign({}, AMP_DEF);
        st.migr = { amp: 1, at: Date.now() };
      }
    }
    return st;
  }
  ampMigrate(S);
  if (!S.tools) S.tools = toolBlank();  if (S.migr && S.migr.amp && !S.migr.saved) {
    S.migr.saved = 1;
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {
    }
  }

  function cuadroBlank() {
    return { titulo: "CUADRO DE CARGA DE ALUMBRADO", V: 220, Hz: 50, wPL: 100, wEG: 250, wE2: 500, wE3: 1200, rows: [] };
  }
  if (!S.cuadro) S.cuadro = cuadroBlank();
  {
    const b = toolBlank();
    for (const k in b) if (!S.tools[k]) S.tools[k] = b[k];
  }
  function save() {
    simUndoTrack();
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {
    }
  }
  const RES = {};
  const SNAP = {};
  const nf = (n, d = 2) => isFinite(n) ? Number(n).toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d }) : "\u2014";
  const n0 = (n) => nf(n, 0), n1 = (n) => nf(n, 1);
  const sStr = (s) => nf(s, s % 1 ? 1 : 0);
  const esc = (s) => String(s != null ? s : "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const ab = (k) => '<abbr tabindex="0" data-ab="'.concat(esc(k), '" title="').concat(esc(GLOS[k] || ""), '">').concat(esc(k), "</abbr>");
  const pill = (c, t) => '<span class="pill '.concat(c, '">').concat(t, "</span>");
  const okp = (b) => b ? pill("ok", "\u2713 Cumple") : pill("bad", "\u2717 No cumple");
  const shownum = (v) => +v === 0 || v == null || v === "" ? "" : String(v).replace(".", ",");
  function getP(path) {
    return path.split(".").reduce((o, k) => o == null ? o : o[k], S);
  }
  function setP(path, v) {
    const ks = path.split(".");
    let o = S;
    for (let i = 0; i < ks.length - 1; i++) {
      if (o[ks[i]] == null) o[ks[i]] = /^\d+$/.test(ks[i + 1]) ? [] : {};
      o = o[ks[i]];
    }
    o[ks[ks.length - 1]] = v;
  }
  function fNum(path, label, { unit = "", help = "", re = false } = {}) {
    const id = "f_" + path.replace(/\./g, "_");
    return '<div class="field"><label for="'.concat(id, '">').concat(label).concat(unit ? ' <span class="unit">['.concat(unit, "]</span>") : "", '</label><input id="').concat(id, '" type="text" inputmode="decimal" autocomplete="off" data-path="').concat(path, '" data-num="1" ').concat(re ? 'data-re="1"' : "", ' value="').concat(esc(shownum(getP(path))), '" placeholder="0">').concat(help ? "<small>".concat(help, "</small>") : "", "</div>");
  }
  function fSel(path, label, opts, { help = "", re = false } = {}) {
    const id = "f_" + path.replace(/\./g, "_"), v = String(getP(path));
    return '<div class="field"><label for="'.concat(id, '">').concat(label, '</label><select id="').concat(id, '" data-path="').concat(path, '" ').concat(re ? 'data-re="1"' : "", ">").concat(opts.map(([k, l]) => '<option value="'.concat(esc(k), '" ').concat(String(k) === v ? "selected" : "", ">").concat(l, "</option>")).join(""), "</select>").concat(help ? "<small>".concat(help, "</small>") : "", "</div>");
  }
  function fText(path, label, ph) {
    const id = "f_" + path.replace(/\./g, "_");
    return '<div class="field"><label for="'.concat(id, '">').concat(label, '</label><input id="').concat(id, '" type="text" data-path="').concat(path, '" value="').concat(esc(getP(path)), '" placeholder="').concat(esc(ph), '"></div>');
  }
  const cNum = (path, w = 80, lab = "") => '<input id="f_'.concat(path.replace(/\./g, "_"), '" type="text" inputmode="decimal" autocomplete="off" data-path="').concat(path, '" data-num="1" value="').concat(esc(shownum(getP(path))), '" placeholder="0" style="width:').concat(w, 'px" aria-label="').concat(esc(lab), '">');
  const cTxt = (path, ph, lab) => '<input id="f_'.concat(path.replace(/\./g, "_"), '" type="text" data-path="').concat(path, '" value="').concat(esc(getP(path)), '" placeholder="').concat(esc(ph), '" aria-label="').concat(esc(lab), '">');
  const cSel = (path, opts, lab, re = true) => '<select id="f_'.concat(path.replace(/\./g, "_"), '" data-path="').concat(path, '" ').concat(re ? 'data-re="1"' : "", ' aria-label="').concat(esc(lab), '">').concat(opts.map(([k, l]) => '<option value="'.concat(esc(k), '" ').concat(String(k) === String(getP(path)) ? "selected" : "", ">").concat(l, "</option>")).join(""), "</select>");
  const SIS = [["mono", "Monof\xE1sico (220 V)"], ["tri", "Trif\xE1sico (380 V)"]];
  function step(n, { t, q, f, s, r, why, ok }) {
    const cls = ok === true ? "ok" : ok === false ? "bad" : ok === "warn" ? "warn" : "";
    const st = ok === true ? okp(true) : ok === false ? okp(false) : ok === "warn" ? pill("warn", "Revisar") : "";
    return '<div class="step '.concat(cls, '"><div class="sn">').concat(n, '</div><div class="sb"><h4>').concat(t, " ").concat(st, "</h4>").concat(q ? '<p class="q">'.concat(q, "</p>") : "").concat(f ? '<div class="fl">F\xF3rmula</div><div class="f">'.concat(f, "</div>") : "").concat(s ? '<div class="fl">Reemplazando valores</div><div class="f s">'.concat(s, "</div>") : "").concat(r ? '<p class="r">Resultado: <span>'.concat(r, "</span></p>") : "").concat(why ? '<p class="why"><b>\xBFPor qu\xE9?</b> '.concat(why, "</p>") : "", "</div></div>");
  }
  const steps = (arr) => '<div class="steps">'.concat(arr.filter(Boolean).map((x, i) => step(i + 1, x)).join(""), "</div>");
  const kpi = (l, v, u = "", c = "") => '<div class="kpi '.concat(c, '"><div class="l">').concat(l, '</div><div class="v">').concat(v).concat(u ? " <small>".concat(u, "</small>") : "", "</div></div>");
  const kpis = (a) => '<div class="kpis">'.concat(a.join(""), "</div>");
  const note = (m, c = "info") => '<div class="note '.concat(c, '">').concat(m, "</div>");
  const learn = (title, html, open = false) => '<details class="learn" '.concat(open ? "open" : "", "><summary>\u{1F4D8} ").concat(title, '</summary><div class="body">').concat(html, "</div></details>");
  function formCard(title, inner, { tag = "Datos", calc = true, calcLabel = "Calcular", extra = "" } = {}) {
    return '<section class="card form"><div class="sechead"><span class="tag">'.concat(tag, '</span><h2 style="margin:0">').concat(title, "</h2></div>").concat(inner, '\n  <div class="actions">').concat(calc ? '<button class="btn calc" type="button" data-act="calc">'.concat(calcLabel, "</button>") : "").concat(extra, '<span class="hint">').concat(calc ? "Tip: presiona Enter en cualquier campo para calcular." : "", "</span></div></section>");
  }
  function resultCard(html) {
    return '<section class="card result" id="res"><div class="sechead"><span class="tag">Resultado</span><h2 style="margin:0">Desarrollo del c\xE1lculo</h2></div>'.concat(html, "</section>");
  }
  function minCentros(r) {
    return +r.area > 10 ? 2 : 1;
  }
  function minEnchufes(r) {
    if (["dormitorio", "living", "comedor", "estar"].includes(r.tipo)) return Math.max(1, Math.ceil((+r.perim || 0) / 8));
    if (r.tipo === "cocina") return 3;
    if (r.tipo === "lavadero") return 1;
    return 0;
  }
  const areaTotal = (p) => p.rooms.reduce((a, r) => a + (+r.area || 0), 0);
  const chooseS = (o) => RICEngine.chooseS(Object.assign({ amp: S.amp }, o));
  function cmpTable(tries, sel, limTxt, maxS = 16) {
    return '<div class="tbl-wrap"><table><thead><tr><th class="num">Secci\xF3n '.concat(ab("S"), '</th><th class="num">Capacidad ').concat(ab("Iz"), "\xD7").concat(ab("fc"), "</th><th>\xBF\u2265 m\xEDnimo?</th><th>\xBF").concat(ab("Iz"), " \u2265 ").concat(ab("In"), '?</th><th class="num">').concat(ab("\u0394V"), "</th><th>\xBF").concat(limTxt, "?</th></tr></thead><tbody>\n  ").concat(tries.filter((t) => t.s <= Math.max(maxS, sel ? sel.s : maxS)).map((t) => '<tr class="'.concat(sel && t.s === sel.s ? "sel" : "", '"><td class="num">').concat(sStr(t.s), ' mm\xB2</td><td class="num">').concat(n0(t.Iz), " A</td><td>").concat(t.okMin ? pill("ok", "s\xED") : pill("bad", "no"), "</td><td>").concat(t.okIz ? pill("ok", "s\xED") : pill("bad", "no"), '</td><td class="num">').concat(nf(t.pct), " %</td><td>").concat(t.okDv ? pill("ok", "s\xED") : pill("bad", "no"), "</td></tr>")).join(""), '</tbody></table></div>\n  <p class="hint">La fila verde es la secci\xF3n elegida: la m\xE1s delgada que cumple las tres condiciones. Las de arriba se descartan por la columna en rojo.</p>');
  }
  const circPot = (c) => c.tipo === "horno" || c.tipo === "especial" ? +c.pot || 0 : (+c.puntos || 0) * (+c.potUnit || 0);
  function genCircuits(p) {
    const V = +p.proj.V || 220, out = [];
    const luz = p.rooms.reduce((a, r) => a + (+r.centros || 0), 0);
    const encG = p.rooms.filter((r) => !["cocina", "lavadero"].includes(r.tipo)).reduce((a, r) => a + (+r.enchufes || 0), 0);
    const encC = p.rooms.filter((r) => ["cocina", "lavadero"].includes(r.tipo)).reduce((a, r) => a + (+r.enchufes || 0), 0);
    const hornos = p.rooms.filter((r) => r.horno && r.tipo === "cocina").length;
    const maxL = Math.max(1, Math.floor(0.9 * 10 * V / 100)), maxE = Math.max(1, Math.floor(0.9 * 16 * V / 250));
    const split = (t, m) => {
      if (t <= 0) return [];
      const n = Math.ceil(t / m), b = Math.floor(t / n), r = t % n;
      return Array.from({ length: n }, (_, i) => b + (i < r ? 1 : 0));
    };
    const mk = (nombre, tipo, puntos, potUnit, pot) => ({ nombre, tipo, puntos, potUnit, pot, L: 0, inForz: "auto" });
    split(luz, maxL).forEach((n, i, a) => out.push(mk("Alumbrado" + (a.length > 1 ? " " + (i + 1) : ""), "alumbrado", n, 100, 0)));
    split(encG, maxE).forEach((n, i, a) => out.push(mk("Enchufes" + (a.length > 1 ? " " + (i + 1) : ""), "enchufes", n, 250, 0)));
    split(encC, maxE).forEach((n, i, a) => out.push(mk("Cocina y lavadero" + (a.length > 1 ? " " + (i + 1) : ""), "cocina", n, 250, 0)));
    for (let i = 0; i < hornos; i++) out.push(mk("Horno" + (hornos > 1 ? " " + (i + 1) : ""), "horno", 1, 0, Math.max(1500, +p.proj.potHorno || 1500)));
    const minC = areaTotal(p) < 30 ? 2 : 3;
    while (out.length < minC && out.length) {
      const idx = out.reduce((bi, c2, i) => c2.puntos > 1 && c2.tipo !== "horno" && (bi < 0 || c2.puntos > out[bi].puntos) ? i : bi, -1);
      if (idx < 0) break;
      const c = out[idx], h = Math.floor(c.puntos / 2);
      out.splice(idx + 1, 0, Object.assign({}, c, { nombre: c.nombre + " B", puntos: c.puntos - h }));
      c.puntos = h;
      c.nombre += " A";
    }
    return out;
  }
  function calcAlim(p) {
    const q = p.proj, tri = q.sistema === "tri", cf = +q.cf || 1, rho = +q.rho || 0.018, fc = +q.fc || 1, L = +q.Lalim || 0;
    const Pinst = p.circuits.reduce((a, c) => a + circPot(c), 0), fd = fdViv(Pinst), n = Math.max(1, +q.nViv || 1), fs = fsViv(n);
    const Pd = n > 1 ? fd.Pd * n * fs.fs : fd.Pd, Vref = tri ? +q.VL : +q.V;
    const Ibal = tri ? Pd / (Math.sqrt(3) * Vref * cf) : Pd / (Vref * cf);
    let Ifase = 0, ph = null;
    if (tri && Pinst > 0) {
      ph = { R: 0, S: 0, T: 0 };
      p.circuits.map((c, i) => ({ i, P: circPot(c) })).sort((a, b) => b.P - a.P).forEach((o) => {
        const k2 = Object.keys(ph).reduce((a, b) => ph[a] <= ph[b] ? a : b);
        ph[k2] += o.P;
      });
      Ifase = Math.max(ph.R, ph.S, ph.T) * (Pd / Pinst) / (+q.V * cf);
    }
    const Ia = Math.max(Ibal, Ifase), In = nextCom(Math.max(Ia, 25)), k = tri ? Math.sqrt(3) : 2;
    const { tries, sel } = chooseS({ I: Ia, In, L, k, Vref, rho, lim: 3, Smin: 4, fc });
    return { tri, cf, rho, fc, L, Pinst, fd, n, fs, Pd, Vref, Ibal, Ifase, Ia, In, k, tries, sel, ph, dvPct: sel ? sel.pct : NaN };
  }
  function calcCirc(p, c, alim) {
    const q = p.proj, V = +q.V, cf = +q.cf || 1, rho = +q.rho || 0.018, fc = +q.fc || 1, L = +c.L || 0, u = USOS[c.tipo] || USOS.enchufes;
    const P = circPot(c), Is = P / (V * cf), auto = P > 0 ? chooseIn(Is, P, V, cf, u[2]) : null;
    const forz = c.inForz && c.inForz !== "auto", In = forz ? +c.inForz : auto;
    const okIn = In != null && P > 0 && In >= 1.1 * Is - 1e-9 && In >= u[2] && P <= 0.9 * V * In * cf + 1e-9;
    const dvA = isFinite(alim.dvPct) ? alim.dvPct : 3;
    const { tries, sel } = chooseS({ I: Is, In, L, k: 2, Vref: V, rho, lim: 5 - dvA, Smin: u[1], fc });
    return { u, P, Is, auto, forz, In, okIn, tries, sel, dvA, L, V, cf, rho, curva: u[3], ok: okIn && !!sel && P > 0 && L > 0, tot: sel ? sel.pct + dvA : NaN };
  }
  function issues(p) {
    const out = [], a = calcAlim(p), minC = areaTotal(p) < 30 ? 2 : 3;
    if (!p.rooms.length) out.push("No hay recintos ingresados (paso 2).");
    p.rooms.forEach((r, i) => {
      const nm = r.nombre || "Recinto " + (i + 1);
      if ((+r.centros || 0) < minCentros(r)) out.push("".concat(nm, ": faltan centros de iluminaci\xF3n (m\xEDnimo ").concat(minCentros(r), ")."));
      if ((+r.enchufes || 0) < minEnchufes(r)) out.push("".concat(nm, ": faltan enchufes (m\xEDnimo ").concat(minEnchufes(r), ")."));
    });
    if (p.circuits.length < minC) out.push("Hay ".concat(p.circuits.length, " circuito(s); el m\xEDnimo para ").concat(n1(areaTotal(p)), " m\xB2 es ").concat(minC, "."));
    if (p.rooms.some((r) => r.tipo === "cocina" || r.tipo === "lavadero") && !p.circuits.some((c) => c.tipo === "cocina")) out.push("Falta el circuito exclusivo de enchufes de cocina y lavadero (m\xEDnimo 16 A).");
    if (p.rooms.filter((r) => r.horno && r.tipo === "cocina").length > p.circuits.filter((c) => c.tipo === "horno").length) out.push("Falta un circuito independiente para el horno el\xE9ctrico.");
    p.circuits.forEach((c, i) => {
      var _a;
      const r = calcCirc(p, c, a), nm = "C".concat(i + 1, " ").concat(c.nombre || "").trim();
      if (r.P <= 0) out.push("".concat(nm, ": no tiene potencia."));
      else if (!(r.L > 0)) out.push("".concat(nm, ": falta el largo para calcular la ca\xEDda de tensi\xF3n."));
      else if (!r.okIn) out.push("".concat(nm, ": la protecci\xF3n ").concat((_a = r.In) != null ? _a : "\u2014", " A no cumple el margen exigido."));
      else if (!r.sel) out.push("".concat(nm, ": ninguna secci\xF3n cumple la ca\xEDda de tensi\xF3n; acorta o divide el circuito."));
      if (r.In && r.In > a.In) out.push("".concat(nm, ": su protecci\xF3n (").concat(r.In, " A) es mayor que la general (").concat(a.In, " A)."));
      if (c.tipo === "horno" && (+c.pot || 0) < 1500) out.push("".concat(nm, ": el horno debe proyectarse con al menos 1.500 W."));
    });
    if (p.circuits.length) {
      if (!(a.L > 0)) out.push("Falta el largo del alimentador (paso 1).");
      else if (!a.sel) out.push("Alimentador: ninguna secci\xF3n cumple; revisa el largo.");
    }
    if (!(+p.tierra.Rserv > 0) || !(+p.tierra.Rprot > 0)) out.push("Faltan las mediciones de puesta a tierra (paso 7).");
    else {
      if (+p.tierra.Rserv > 20) out.push("Tierra de servicio sobre 20 \u03A9.");
      if (+p.tierra.Rprot > (p.tierra.amb === "humedo" ? 24 : 50) / (+p.tierra.idn || 0.03)) out.push("Tierra de protecci\xF3n sobre el l\xEDmite.");
    }
    return out;
  }
