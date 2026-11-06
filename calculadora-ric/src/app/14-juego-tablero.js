  const TG_COL = { R: ["Rojo", "#D32F2F", "fase"], K: ["Negro", "#1B1B1B", "fase"], A: ["Azul", "#1F5FBF", "fase"], W: ["Blanco", "#F4F4F4", "neutro"], G: ["Verde/amarillo", "#2E9E44", "tierra"] };
  const TG_SIG = { L: "fase", N: "neutro", PE: "tierra" };
  const TG_LV = {
    n1: { t: "Nivel 1 \xB7 Primer tablero", d: "Una casa peque\xF1a: alumbrado y enchufes. Con 2 circuitos la luz piloto es opcional (RIC N\xB002, 6.2.14). Alimentador de 6 mm\xB2.", alimS: 6, ndr: 1, emer: -1, circ: [["Alumbrado", 1.5, 1200, "B", 0, "alumbrado"], ["Enchufes", 2.5, 2500, "C", 0, "enchufes"]] },
    n2: { t: "Nivel 2 \xB7 Luz de emergencia", d: "Se suma la cocina y una luz de emergencia aut\xF3noma que vigila el alumbrado. Alimentador de 6 mm\xB2.", alimS: 6, ndr: 1, emer: 0, circ: [["Alumbrado", 1.5, 1100, "B", 0, "alumbrado"], ["Enchufes", 2.5, 2250, "C", 0, "enchufes"], ["Cocina y lavadero", 2.5, 3e3, "C", 16, "cocina"]] },
    n3: { t: "Nivel 3 \xB7 Vivienda completa", d: "Cinco circuitos con horno: necesitas dos diferenciales, peines de conexi\xF3n y luz piloto con su propia protecci\xF3n (m\xE1s de 3 circuitos). Alimentador de 10 mm\xB2.", alimS: 10, ndr: 2, emer: 0, circ: [["Alumbrado", 1.5, 1300, "B", 0, "alumbrado"], ["Enchufes dormitorios", 2.5, 2e3, "C", 0, "enchufes"], ["Enchufes living", 2.5, 2500, "C", 0, "enchufes"], ["Cocina y lavadero", 2.5, 3e3, "C", 16, "cocina"], ["Horno", 2.5, 2e3, "C", 16, "horno"]] }
  };
  const TG_TIPOS = { alumbrado: ["Alumbrado", "B", 0, 1.5, 1200], enchufes: ["Enchufes", "C", 0, 2.5, 2e3], cocina: ["Cocina y lavadero", "C", 16, 2.5, 3e3], horno: ["Horno", "C", 16, 2.5, 2e3], clima: ["Climatizaci\xF3n", "C", 16, 2.5, 2500], otro: ["Otro equipo", "C", 0, 2.5, 1500] };
  const TG_RAILS = 4, TG_MODS = 14, TG_RX = 190, TG_MW = 52, TG_RY = [150, 350, 550, 750], TG_OY = 930;
  const TG_K = {
    ig: { n: "Interruptor general", pre: "IG", ic: "\u{1F39A}", d: "Corta toda la casa de una vez (fase y neutro) y protege el alimentador." },
    dr: { n: "Diferencial", pre: "DR", ic: "Δ", d: "Protege a las personas: compara la corriente de fase y neutro y corta si hay una fuga. M\xE1ximo 3 circuitos por diferencial." },
    tm: { n: "Disyuntor", pre: "TM", ic: "⚡", d: "Termomagn\xE9tico: protege el cable de un circuito contra sobrecarga y cortocircuito. Tambi\xE9n sirve como protecci\xF3n propia (≤ 10 A) de la luz piloto." },
    pn: { n: "Peine de conexi\xF3n", pre: "PN", ic: "⫶", d: "Barra prefabricada que se aprieta en las entradas de varios equipos seguidos del mismo riel. Es la forma correcta de alimentar varios disyuntores desde un diferencial: el RIC N\xB002 (6.2.4) no acepta puentes de cable de equipo a equipo." },
    pl: { n: "Luz piloto", pre: "PL", ic: "●", d: "Indica que el tablero tiene tensi\xF3n. Obligatoria en tableros de m\xE1s de 3 circuitos y con su propia protecci\xF3n de 10 A como m\xE1ximo (RIC N\xB002, 6.2.14 y 6.2.15)." },
    bn: { n: "Barra de neutro", pre: "BN", ic: "▭", d: "Bornera aislada para repartir el neutro de un diferencial a sus circuitos. Una por diferencial." },
    bf: { n: "Barra de fase", pre: "BF", ic: "\u2261", d: "Regleta de distribuci\xF3n de fase (L): reparte la fase de la salida del general o de un diferencial a varios disyuntores con un cable a cada uno. Alternativa al peine; evita los puentes de cable de equipo a equipo que el RIC N\xB002 (6.2.4) no acepta. La fase se identifica con azul, negro o rojo y el neutro con blanco (RIC N\xB004, 5.32)." },
    pe: { n: "Barra de tierra", pre: "PE", ic: "⏚", d: "Bornera para repartir la tierra de protecci\xF3n a todos los circuitos, unida al electrodo." },
    rp: { n: "Repartidor L–N", pre: "RP", ic: "≡", d: "Bornera de distribuci\xF3n modular: una barra de fase (L) y una de neutro (N) con varios bornes. Alternativa al peine para repartir desde el general." }
  };
  const TG_CV = [["B", "B \xB7 3–5 In"], ["C", "C \xB7 5–10 In"], ["D", "D \xB7 10–20 In"]];
  const TG_SPEC = {
    ig: [["p", "Polos", [["1P", "1 polo"], ["2P", "2 polos (omnipolar)"]]], ["In", "Amperaje", [25, 32, 40, 50, 63].map((x) => [x, x + " A"])], ["cv", "Curva", TG_CV]],
    dr: [["In", "Amperaje", [25, 40, 63].map((x) => [x, x + " A"])], ["s", "Sensibilidad", [[10, "10 mA"], [30, "30 mA"], [300, "300 mA"]]], ["cl", "Clase", [["AC", "AC \xB7 solo senoidal"], ["A", "A \xB7 electr\xF3nica"], ["F", "F \xB7 inverter"], ["B", "B \xB7 CC (auto el\xE9ctrico, solar)"]]]],
    tm: [["p", "Polos", [["1P", "1P \xB7 solo fase"], ["1P+N", "1P+N \xB7 fase y neutro"], ["2P", "2P \xB7 dos polos"]]], ["In", "Amperaje", [6, 10, 16, 20, 25, 32].map((x) => [x, x + " A"])], ["cv", "Curva", TG_CV]],
    pn: [["p", "Tipo", [["1P", "1 polo \xB7 fase (para disyuntores 1P)"], ["2P", "2 polos \xB7 L+N (para diferenciales y 1P+N)"]]], ["n", "Largo", [2, 3, 4, 5, 6, 8, 10, 12].map((x) => [x, x + " m\xF3dulos"])]],
    pl: [],
    bn: [],
    bf: [],
    pe: [],
    rp: []
  };
  let tgSel = null, tgWire = null, tgDev = null, tgHintT = [], tgHist = [], tgChecked = null, tgConfirm = false, tgVB = null, tgDragged = false, tgMsg = "", tgFull = false, tgPanOpen = true, tgPlace = null, tgMove = null, tgCatOpen = false, tgCheckT = 0, tgHintPn = null;
  const tgMoney = (x) => "$" + n0(x);
  const tgWd = (k, sp) => k === "pn" ? 0 : k === "ig" || k === "tm" ? sp.p === "1P" ? 1 : 2 : k === "dr" ? 2 : k === "pl" ? 1 : k === "rp" ? 2 : 4;
  function tgPrice(k, sp) {
    if (k === "ig") return (sp.p === "1P" ? 8e3 : +sp.In <= 32 ? 14e3 : +sp.In <= 40 ? 16e3 : 22e3) + (sp.cv === "D" ? 4e3 : 0);
    if (k === "dr") return ({ 25: 28e3, 40: 32e3, 63: 45e3 }[sp.In] || 32e3) + (+sp.s === 10 ? 6e3 : +sp.s === 300 ? -4e3 : 0) + ({ AC: -6e3, A: 0, F: 15e3, B: 9e4 }[sp.cl] || 0);
    if (k === "tm") return (sp.p === "1P" ? 4500 : sp.p === "1P+N" ? 9e3 : 11e3) + (+sp.In >= 25 ? 1e3 : 0) + (sp.cv === "D" ? 3e3 : 0);
    if (k === "pn") return (sp.p === "2P" ? 3500 : 2e3) + (+sp.n || 2) * (sp.p === "2P" ? 700 : 450);
    return k === "pl" ? 6e3 : k === "rp" ? 12e3 : k === "bf" ? 5500 : 4500;
  }
  const tgCost = (st) => st.parts.reduce((a, p) => a + tgPrice(p.k, p.spec), 0);
  function tgSpecTxt(k, sp) {
    if (k === "ig" || k === "tm") return "".concat(sp.p, " \xB7 ").concat(sp.In, " A \xB7 curva ").concat(sp.cv);
    if (k === "dr") return "".concat(sp.In, " A \xB7 ").concat(sp.s, " mA \xB7 clase ").concat(sp.cl);
    if (k === "pn") return "".concat(sp.p === "2P" ? "L+N" : "1 polo", " \xB7 ").concat(sp.n, " m\xF3dulos");
    return "";
  }
  function tgFreeDef(ex) {
    return { v2: 1, alimS: 10, emer: false, circ: ex ? TG_LV.n3.circ.map((c) => ({ n: c[0], t: c[5], P: c[2], S: c[1] })) : [] };
  }
  function tgInit() {
    if (!S.tg || !S.tg.st || S.tg.v !== 2) S.tg = { v: 2, lv: S.tg && S.tg.lv || "n1", col: "R", st: {}, best: {}, cat: { k: "ig" } };
    if (!S.tg.best) S.tg.best = {};
    if (!S.tg.cat) S.tg.cat = { k: "ig" };
    if (!S.tg.free || !Array.isArray(S.tg.free.circ)) S.tg.free = tgFreeDef();
    if (!S.tg.free.v2) {
      S.tg.free.v2 = 1;
      S.tg.free.emer = false;
    }
    return S.tg;
  }
  let tgSimConf = false;
  function tgToSim() {
    const T0 = tgInit(), lv = tgLvl(), st = tgSt(), A = tgCheck(lv, st), req = A.req, s = S.sim2;
    const ig = st.parts.find((p) => p.k === "ig"), miss = req.map((r, k) => A.tmOf[k] && tgPart(st, A.tmOf[k]) ? null : r.n).filter(Boolean);
    if (!ig || miss.length) {
      tgSimConf = false;
      tgMsg = "Para pasarlo al 3D falta ".concat(!ig ? "el interruptor general" : "").concat(!ig && miss.length ? " y " : "").concat(miss.length ? "el disyuntor cableado de: " + miss.join(", ") : "", ".");
      tgRender();
      return;
    }
    const fromSim = T0.lv === "sim", old = s.circuits, drs = st.parts.filter((p) => p.k === "dr").sort((a, b) => a.r - b.r || a.m - b.m);
    const lose = old.length > req.length && s.items.some((i) => old.slice(req.length).some((c) => c.id === i.c));
    if ((lose || !fromSim && s.items.length) && !tgSimConf) {
      tgSimConf = true;
      tgMsg = lose ? "El 3D tiene ".concat(old.length, " circuitos y este tablero ").concat(req.length, ": los puntos de los circuitos sobrantes se borrar\xE1n. Toca otra vez \xABUsar este tablero en el 3D\xBB para confirmar.") : "Los circuitos del 3D tomar\xE1n las protecciones de este tablero (los puntos se mantienen). Toca otra vez para confirmar.";
      tgRender();
      return;
    }
    tgSimConf = false;
    s.circuits = req.map((r, k) => {
      const tm = tgPart(st, A.tmOf[k]), d = A.drOf[k] ? tgPart(st, A.drOf[k]) : null, di = d ? drs.indexOf(d) : -1;
      const c = old[k] || { id: s.nid++, pc: 6, nc: "dr", pe: true, on: true };
      Object.assign(c, { In: +tm.spec.In, cv: tm.spec.cv || "C", dr: di >= 0 ? "DR" + (di + 1) : "none", ds: d ? +d.spec.s : 30, cl: d ? d.spec.cl : "A" });
      if (!fromSim || !old[k]) {
        c.n = r.n;
        c.S = r.S;
      }
      return c;
    });
    s.gen.In = +ig.spec.In;
    if (lv.alimS) s.alim.S = lv.alimS;
    {
      const nd = regNeed(s), sz = (n) => [4, 7, 12, 15].find((x) => x >= n) || 15, R = [];
      st.parts.filter((p) => p.k === "bn").forEach((p, i) => R.push({ t: "N", n: i ? 7 : sz(nd.N) }));
      st.parts.filter((p) => p.k === "pe").forEach((p, i) => R.push({ t: "PE", n: i ? 7 : sz(nd.PE) }));
      st.parts.filter((p) => p.k === "bf" || p.k === "rp").forEach(() => R.push({ t: "F", n: 7 }));
      st.parts.filter((p) => p.k === "rp").forEach(() => R.push({ t: "N", n: 7 }));
      st.parts.filter((p) => p.k === "pn").forEach((p) => R.push({ t: "peine", n: Math.max(12, (+p.spec.n || 2) * 2) }));
      if (R.length) s.reg = R;
      const hv = tgHintPn, vb = tgVB, ht = tgHintT, L2 = tgLayout(lv, st);
      tgHintPn = null;
      tgVB = null;
      tgHintT = [];
      try {
        const svg = tgSVG(lv, st, A, false).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="' + L2.W + '" height="' + L2.H + '" font-family="Arial,Helvetica,sans-serif" ');
        s.tabImg = { svg, w: L2.W, h: L2.H, t: Date.now(), n: st.parts.length, c: st.wires.length };
      } catch (e) {
        delete s.tabImg;
      }
      tgHintPn = hv;
      tgVB = vb;
      tgHintT = ht;
      simTabView = "dis";
    }
    simSanitize(s);
    simInsp = null;
    simSel = null;
    tgMsg = "";
    save();
    go("sim");
    simToast([["ok", "Tablero traspasado tal como lo armaste: general ".concat(s.gen.In, " A, ").concat(s.circuits.length, " circuitos y ").concat(drs.length, " diferencial(es), con sus barras y cables. En \xABVista\xBB puedes alternar entre el dise\xF1o y la vista simple.")]]);
    setTimeout(() => SIMV && SIMV.view("t"), 400);
  }
  function tgFreeLv(fx) {
    const f = fx || tgInit().free, circ = f.circ.slice(0, 9).map((c, k) => {
      const T0 = TG_TIPOS[c.t] || TG_TIPOS.otro;
      return [String(c.n || T0[0] + " " + (k + 1)).slice(0, 26), +c.S || T0[3], Math.max(0, +c.P || 0), T0[1], T0[2], c.t in TG_TIPOS ? c.t : "otro"];
    });
    const al = circ.findIndex((c) => c[5] === "alumbrado");
    return { t: "Dise\xF1o libre", d: "T\xFA defines los circuitos: cantidad, uso, potencia y secci\xF3n del cable. La app revisa que cumplan el RIC y te pide las protecciones que correspondan.", alimS: +f.alimS || 10, ndr: Math.max(1, Math.ceil(circ.length / 3)), emer: f.emer && al >= 0 ? al : -1, circ, free: 1 };
  }
  function tgSimLv() {
    const s = S.sim2;
    if (!s || !s.circuits.length) return null;
    const ev = simEval(s), circ = s.circuits.map((c, k) => {
      const its = s.items.filter((i) => i.c === c.id), out = its.some((i) => i.t === "out" || i.t === "horno");
      const hi = its.some((i) => i.t === "horno" || i.t === "out" && ["cocina", "lavadero"].includes((itemRoom(i) || {}).t));
      return [c.n || "Circuito " + (k + 1), +c.S, Math.round(ev.cs[k].Ip * V0), out ? "C" : "B", hi ? 16 : 0, out ? its.some((i) => i.t === "horno") ? "horno" : hi ? "cocina" : "enchufes" : "alumbrado"];
    });
    return { t: "Mi casa del simulador 3D", d: "Los circuitos, cargas y cables de tu instalaci\xF3n del Simulador 3D. Alimentador de ".concat(sStr(+s.alim.S || 6), " mm\xB2."), alimS: +s.alim.S || 6, ndr: Math.min(3, Math.max(1, simDRs(s).length, Math.ceil(circ.length / 3))), emer: circ.findIndex((c) => c[3] === "B"), circ };
  }
  function tgLvl() {
    const T0 = tgInit();
    if (T0.lv === "libre") return tgFreeLv();
    if (T0.lv === "sim") {
      const l = tgSimLv();
      if (l) return l;
      T0.lv = "n1";
    }
    if (!TG_LV[T0.lv]) T0.lv = "n1";
    return TG_LV[T0.lv];
  }
  function tgSt() {
    const T0 = tgInit();
    let st = T0.st[T0.lv];
    if (!st || !Array.isArray(st.parts)) st = T0.st[T0.lv] = { parts: [], wires: [], t0: 0 };
    return st;
  }
  const tgPart = (st, id) => st.parts.find((p) => p.id === id);
  function tgPoles(st, id) {
    const p = tgPart(st, id);
    if (!p) return 0;
    if (p.k === "ig" || p.k === "tm") return p.spec.p === "1P" ? 1 : 2;
    return p.k === "dr" ? 2 : 0;
  }
  const tgNeedPL = (lv) => lv.circ.length >= 4;
  function tgDN(id, lv) {
    if (id === "src") return "Llegada del medidor";
    if (id === "T") return "Tierra (electrodo)";
    if (id === "OE") return "Luz de emergencia";
    if (/^O\d/.test(id)) return "Salida " + ((lv.circ[+id.slice(1) - 1] || [])[0] || id);
    const pre = id.slice(0, 2), nn = id.slice(2);
    if (pre === "IG") return "Interruptor general" + (nn !== "1" ? " " + nn : "");
    if (pre === "DR") return "Diferencial " + id;
    if (pre === "TM") return "Disyuntor D" + nn;
    if (pre === "PL") return "Luz piloto" + (nn !== "1" ? " " + nn : "");
    if (pre === "BN") return "Barra de neutro N" + nn;
    if (pre === "RP") return "Repartidor R" + nn;
    if (pre === "PN") return "Peine P" + nn;
    if (pre === "BF") return "Barra de fase F" + nn;
    if (pre === "PE") return "Barra de tierra" + (nn !== "1" ? " " + nn : "");
    return id;
  }
  function tgNewId(st, k) {
    const pre = TG_K[k].pre;
    let n = 1;
    while (st.parts.some((p) => p.id === pre + n)) n++;
    return pre + n;
  }
  function tgOcc(st, skip) {
    const o = Array.from({ length: TG_RAILS }, () => Array(TG_MODS).fill(null));
    st.parts.forEach((p) => {
      if (p.id === skip || p.k === "pn") return;
      for (let i = 0; i < tgWd(p.k, p.spec); i++) if (p.m + i < TG_MODS) o[p.r][p.m + i] = p.id;
    });
    return o;
  }
  function tgOccPn(st, skip) {
    const o = Array.from({ length: TG_RAILS }, () => Array(TG_MODS).fill(null));
    st.parts.forEach((p) => {
      if (p.id === skip || p.k !== "pn") return;
      for (let i = 0; i < (+p.spec.n || 2); i++) if (p.m + i < TG_MODS) o[p.r][p.m + i] = p.id;
    });
    return o;
  }
  function tgFit(st, r, m, w, skip) {
    const o = tgOcc(st, skip);
    for (let s0 = Math.min(m, TG_MODS - w); s0 >= Math.max(0, m - w + 1); s0--) {
      let ok = true;
      for (let i = 0; i < w; i++) if (o[r][s0 + i]) ok = false;
      if (ok) return s0;
    }
    return -1;
  }
  function tgFitPn(st, r, m, n, skip) {
    const o = tgOccPn(st, skip), s0 = Math.min(m, TG_MODS - n);
    if (s0 < 0) return -1;
    for (let i = 0; i < n; i++) if (o[r][s0 + i]) return -1;
    return s0;
  }
  function tgTeeth(st, p) {
    const out = [], n = +p.spec.n || 2;
    st.parts.forEach((d) => {
      if (d.r !== p.r || !["ig", "dr", "tm"].includes(d.k)) return;
      const np = tgPoles(st, d.id);
      for (let q = 1; q <= np; q++) {
        const mm = d.m + q - 1;
        if (mm >= p.m && mm < p.m + n) out.push({ t: d.id + ".i" + q, bus: p.spec.p === "2P" && q === 2 ? "N" : "L", m: mm, dev: d.id, q });
      }
    });
    return out;
  }
  function tgLayout(lv, st) {
    const D = {}, Tm = {}, MW = TG_MW;
    const term = (id, dv, x2, y, dir, lab, o) => Tm[id] = Object.assign({ id, dev: dv, x: x2, y, dir, lab }, o || {});
    D.src = { id: "src", x: 16, y: 100, w: 104, h: 84 };
    term("src.L", "src", 48, 88, "u", "L");
    term("src.N", "src", 100, 88, "u", "N");
    st.parts.forEach((p) => {
      const w = tgWd(p.k, p.spec), x = TG_RX + p.m * MW, ry = TG_RY[p.r];
      if (p.k === "pn") {
        const n = +p.spec.n || 2, x0 = x + 6, x1 = x + n * MW - 6, two = p.spec.p === "2P";
        D[p.id] = { id: p.id, k: p.k, x: x0, y: ry - (two ? 84 : 72), w: x1 - x0, h: two ? 24 : 12, x1 };
        term(p.id + ".L", p.id, x0 + 8, ry - 66, "u", "L", { feed: 1, bus: 1 });
        if (two) term(p.id + ".N", p.id, x0 + 22, ry - 78, "u", "N", { feed: 1, bus: 1 });
        return;
      }
      if (p.k === "rp") {
        D[p.id] = { id: p.id, k: p.k, x: x + 2, y: ry - 40, w: w * MW - 4, h: 80 };
        term(p.id + ".L", p.id, x + w * MW / 2, ry - 24, "b", "L", { bar: 1, x0: x + 8, x1: x + w * MW - 8 });
        term(p.id + ".N", p.id, x + w * MW / 2, ry + 24, "b", "N", { bar: 1, x0: x + 8, x1: x + w * MW - 8 });
        return;
      }
      if (p.k === "bn" || p.k === "pe" || p.k === "bf") {
        D[p.id] = { id: p.id, k: p.k, x: x + 4, y: ry - 7, w: w * MW - 8, h: 14 };
        term(p.id, p.id, x + w * MW / 2, ry, "b", "", { bar: 1, x0: x + 4, x1: x + w * MW - 4 });
        return;
      }
      D[p.id] = { id: p.id, k: p.k, x: x + 2, y: ry - 40, w: w * MW - 4, h: 80 };
      if (p.k === "pl") {
        term(p.id + ".a", p.id, x + 14, ry - 52, "u", "L");
        term(p.id + ".b", p.id, x + 38, ry - 52, "u", "N");
        return;
      }
      const n = tgPoles(st, p.id), labs = p.k === "dr" || p.spec.p === "1P+N" ? [["L", "N"], ["L", "N"]] : n === 1 ? [["1"], ["2"]] : [["1", "3"], ["2", "4"]];
      for (let q = 1; q <= n; q++) {
        const x2 = x + MW * (q - 0.5);
        term(p.id + ".i" + q, p.id, x2, ry - 52, "u", labs[0][q - 1], { io: "i", pole: q });
        term(p.id + ".o" + q, p.id, x2, ry + 52, "d", labs[1][q - 1], { io: "o", pole: q });
      }
    });
    D.T = { id: "T", x: 20, y: TG_OY + 12, w: 74, h: 54 };
    term("T.PE", "T", 57, TG_OY, "u", "PE");
    let x = 112;
    const outs = lv.circ.map((c, k) => "O" + (k + 1));
    if (lv.emer >= 0) outs.push("OE");
    outs.forEach((id) => {
      D[id] = { id, x, y: TG_OY + 12, w: 124, h: 54 };
      ["L", "N", "PE"].forEach((q, j) => term(id + "." + q, id, x + 22 + j * 40, TG_OY, "u", q));
      x += 136;
    });
    const RL = TG_RX + TG_MODS * MW, cw = Math.max(48, Math.min(280, st.wires.length * 7.5 + 22));
    return { D, T: Tm, RL, CX: RL + 18, CW: cw, LX: 124, LW: 56, W: Math.max(RL + 18 + cw + 16, x + 10), H: TG_OY + 96 };
  }
  function tgTN(tid, lv, L) {
    const t = L.T[tid];
    if (!t) return tid;
    if (t.bar) return t.lab ? "".concat(tgDN(t.dev, lv), " (barra ").concat(t.lab, ")") : tgDN(t.dev, lv);
    if (t.feed) return "".concat(tgDN(t.dev, lv), " (alimentaci\xF3n ").concat(t.lab, ")");
    return "".concat(tgDN(t.dev, lv), " (").concat(t.lab).concat(t.io === "i" ? " arriba" : t.io === "o" ? " abajo" : "", ")");
  }
  function tgReqs(lv) {
    const req = lv.circ.map(([n, Sx, P, cv, mn, tp]) => {
      const I = P / V0, smin = tp === "alumbrado" ? 1.5 : tp ? 2.5 : cv === "B" ? 1.5 : 2.5;
      return { n, S: Sx, P, I, cv, mn, tp: tp || "", smin, min: P > 0 ? chooseIn(I, P, V0, 1, mn) || 6 : Math.max(6, mn), max: ampOf(Sx) };
    });
    const Pi = req.reduce((a, r) => a + r.P, 0), fd = fdViv(Pi), Id = fd.Pd / V0;
    return { req, g: { Pi, Pd: fd.Pd, Id, min: nextCom(Math.max(Id, 25)), max: ampOf(lv.alimS) } };
  }
  const tgOkIn = (r) => COM.filter((x) => x >= r.min && x <= r.max);
  function tgCheck(lv, st) {
    const L = tgLayout(lv, st), { req, g } = tgReqs(lv), errs = [], warns = [], mark = new Set(), wmark = new Set(), seen = new Set();
    const nm = (t) => tgTN(t, lv, L), of = (k) => st.parts.filter((p) => p.k === k).sort((a, b) => a.r - b.r || a.m - b.m), SP = (id) => (tgPart(st, id) || {}).spec || {};
    const add = (sev, t, d, w, fx, tm, wm, x) => {
      if (seen.has(t)) return;
      seen.add(t);
      (sev === "bad" ? errs : warns).push(Object.assign({ t, d, w, fx, sev }, x || {}));
      (tm || []).forEach((y) => mark.add(y));
      (wm || []).forEach((y) => wmark.add(y));
    };
    const ws = st.wires.map((w, i) => Object.assign({ i }, w)).filter((w) => L.T[w.a] && L.T[w.b]);
    const adj = {}, deg = {}, link = (a, b, k) => (adj[a] = adj[a] || []).push(Object.assign({ to: b }, k));
    ws.forEach((w) => {
      link(w.a, w.b, { w: w.i });
      link(w.b, w.a, { w: w.i });
      deg[w.a] = (deg[w.a] || 0) + 1;
      deg[w.b] = (deg[w.b] || 0) + 1;
    });
    const pns = of("pn"), teeth = [];
    pns.forEach((p) => tgTeeth(st, p).forEach((t) => {
      const bus = p.id + "." + t.bus;
      if (!L.T[bus] || !L.T[t.t]) return;
      teeth.push({ a: t.t, b: bus, pn: p.id });
      link(t.t, bus, { pn: p.id });
      link(bus, t.t, { pn: p.id });
    }));
    const polesOf = Object.values(L.T).filter((t) => t.io === "i" && L.T[t.dev + ".o" + t.pole]);
    polesOf.forEach((t) => {
      const o = t.dev + ".o" + t.pole;
      link(t.id, o, { d: t.dev, p: t.pole, rev: false });
      link(o, t.id, { d: t.dev, p: t.pole, rev: true });
    });
    const conn = (t) => (deg[t] || 0) > 0 || teeth.some((x) => x.a === t || x.b === t), one = (s, k) => !!s && s.size === 1 && s.has(k), sg = (s) => s && s.size ? [...s].map((k) => TG_SIG[k]).join(" y ") : "nada";
    const sig = {}, lab = {}, SRC = [["src.L", "L"], ["src.N", "N"], ["T.PE", "PE"]];
    const reach = (s0, block) => {
      const vis = new Set([s0]), q = [s0];
      while (q.length) {
        const n = q.shift();
        (adj[n] || []).forEach((e) => {
          if (block && e.d === block) return;
          if (!vis.has(e.to)) {
            vis.add(e.to);
            q.push(e.to);
          }
        });
      }
      return vis;
    };
    SRC.forEach(([s0, k]) => reach(s0, null).forEach((n) => (sig[n] = sig[n] || new Set()).add(k)));
    {
      const q = SRC.map(([s0, k]) => (lab[s0] = k, s0));
      while (q.length) {
        const n = q.shift();
        (adj[n] || []).forEach((e) => {
          if (lab[e.to] == null) {
            lab[e.to] = lab[n];
            q.push(e.to);
          }
        });
      }
    }
    const pairs = {}, pk = (a, b) => [a, b].sort().join("+");
    ws.forEach((w) => {
      if (lab[w.a] && lab[w.b] && lab[w.a] !== lab[w.b]) (pairs[pk(lab[w.a], lab[w.b])] = pairs[pk(lab[w.a], lab[w.b])] || []).push(w);
    });
    teeth.forEach((x) => {
      if (lab[x.a] && lab[x.b] && lab[x.a] !== lab[x.b]) (pairs[pk(lab[x.a], lab[x.b])] = pairs[pk(lab[x.a], lab[x.b])] || []).push({ pn: x.pn, a: x.a, b: x.b });
    });
    polesOf.forEach((t) => {
      const o = t.dev + ".o" + t.pole;
      if (lab[t.id] && lab[o] && lab[t.id] !== lab[o]) (pairs[pk(lab[t.id], lab[o])] = pairs[pk(lab[t.id], lab[o])] || []).push({ dv: t.dev, a: t.id, b: o });
    });
    const SH = { "L+N": ["Cortocircuito: fase unida con neutro", "Al subir el general la corriente sube a miles de amperes: la parte magn\xE9tica corta al instante y los bornes pueden quemarse."], "L+PE": ["Fase unida a tierra", "Todo lo met\xE1lico unido a tierra quedar\xEDa con tensi\xF3n. El diferencial dispara; sin \xE9l hay riesgo de electrocuci\xF3n."], "N+PE": ["Neutro unido a tierra dentro del tablero", "En la vivienda el neutro (N) y la tierra (PE) van siempre separados (esquema TN-S). Si se unen aqu\xED, parte del retorno vuelve por la tierra y el diferencial dispara."] };
    Object.keys(pairs).forEach((k) => {
      const arr = pairs[k], x = arr[0];
      const d = x.pn ? "".concat(tgDN(x.pn, lv), " junta ").concat(TG_SIG[lab[x.a]], " y ").concat(TG_SIG[lab[x.b]], ": un peine de 1 polo sobre un equipo de 2 polos (o con L y N cruzados) une sus dos bornes.") : x.dv ? "En ".concat(tgDN(x.dv, lv), " llega ").concat(TG_SIG[lab[x.a]], " por arriba y ").concat(TG_SIG[lab[x.b]], " por abajo del mismo polo.") : "El cable entre ".concat(nm(x.a), " y ").concat(nm(x.b), " une ").concat(TG_SIG[lab[x.a]], " con ").concat(TG_SIG[lab[x.b]], ".");
      add("bad", SH[k][0], d + (arr.length > 1 ? " (".concat(arr.length, " puntos con este problema)") : ""), SH[k][1], x.pn ? "Usa un peine de 2 polos (L+N) sobre equipos bipolares, o un peine de 1 polo solo sobre disyuntores 1P." : "Quita ese cable y ll\xE9valo al borne que corresponde.", arr.filter((y) => y.dv).flatMap((y) => [y.a, y.b]).concat(arr.filter((y) => y.pn).map((y) => y.pn)), arr.filter((y) => !y.dv && !y.pn).map((y) => y.i));
    });
    const hasShort = !!pairs["L+N"], leak = !!(pairs["L+PE"] || pairs["N+PE"]);
    const chainFrom = (s0) => {
      const ch = { [s0]: [] }, q = [s0];
      while (q.length) {
        const n = q.shift();
        (adj[n] || []).forEach((e) => {
          if (ch[e.to]) return;
          ch[e.to] = e.d ? ch[n].concat([{ d: e.d, p: e.p, rev: e.rev }]) : ch[n];
          q.push(e.to);
        });
      }
      return ch;
    };
    const cL = chainFrom("src.L"), cN = chainFrom("src.N"), revs = new Set();
    const devs = st.parts.filter((p) => ["ig", "dr", "tm"].includes(p.k)).map((p) => p.id);
    const baseL = reach("src.L", null), baseN = reach("src.N", null), blkL = {}, blkN = {};
    devs.forEach((d) => {
      blkL[d] = reach("src.L", d);
      blkN[d] = reach("src.N", d);
    });
    const domL = (t) => baseL.has(t) ? devs.filter((d) => !blkL[d].has(t)) : [], domN = (t) => baseN.has(t) ? devs.filter((d) => !blkN[d].has(t)) : [];
    const polOf = (ch, d) => {
      const c = (ch || []).find((x) => x.d === d);
      return c ? c.p : 1;
    };
    const igs = of("ig"), drs = of("dr"), tms = of("tm"), pls = of("pl"), ig = igs[0] ? igs[0].spec : {};
    if (!igs.length) add("bad", "Falta el interruptor general", "No hay interruptor general en el tablero.", "Protege el alimentador y permite cortar toda la casa de una vez en una emergencia.", "Abre \u{1F9F0} Piezas, elige un interruptor general y col\xF3calo en un riel.", [], [], { miss: "ig" });
    else {
      const id = igs[0].id, X = { spec: 1, dev: id };
      if (igs.length > 1) add("bad", "Hay ".concat(igs.length, " interruptores generales"), "Un tablero de vivienda lleva un solo interruptor general.", "Con dos, ninguno corta toda la casa y en una emergencia no se sabe cu\xE1l bajar.", "Quita los que sobran.", igs.slice(1).map((p) => p.id));
      if (ig.p === "1P") add("bad", "General de 1 polo", "Elegiste un general unipolar: solo corta la fase.", "El general debe cortar fase y neutro a la vez (corte omnipolar, RIC N\xB002 6.5.3 y RIC N\xB010). As\xED, al bajarlo, nada queda unido a la red.", "T\xF3calo y c\xE1mbialo a 2 polos.", [id], [], X);
      if (+ig.In < g.min) add("bad", "General de ".concat(ig.In, " A: es chico"), "Potencia instalada ".concat(n0(g.Pi), " W → demanda ").concat(n0(g.Pd), " W (RIC N\xB003) = ").concat(nf(g.Id, 1), " A. M\xEDnimo ").concat(g.min, " A, y nunca menos de 25 A en una vivienda."), "Si es chico, corta cuando la casa usa varios equipos a la vez.", "T\xF3calo y usa ".concat(g.min, " A."), [id], [], X);
      else if (+ig.In > g.max) add("bad", "General de ".concat(ig.In, " A para un alimentador de ").concat(sStr(lv.alimS), " mm\xB2"), "El alimentador soporta ".concat(g.max, " A (Iz) y el general deja pasar ").concat(ig.In, " A."), "El general tambi\xE9n protege el alimentador: debe cumplirse In ≤ Iz, o el cable se recalienta sin que nada corte.", "T\xF3calo y usa ".concat(COM.filter((x) => x >= g.min && x <= g.max).join(" o ") || g.min, " A", g.min > g.max ? " y un alimentador m\xE1s grueso" : "", "."), [id], [], X);
      if (ig.cv !== "C") add("warn", "General curva ".concat(ig.cv), "Lo habitual para el general de una vivienda es curva C.", ig.cv === "B" ? "Con curva B, el arranque de varios equipos a la vez puede hacerlo disparar." : "La curva D es para motores grandes: tarda m\xE1s en cortar un cortocircuito.", "T\xF3calo y usa curva C.", [id], [], X);
    }
    if (!drs.length) add("bad", "Falta el diferencial", "No hay ning\xFAn diferencial en el tablero.", "RIC N\xB010: todos los circuitos de una vivienda llevan diferencial de 30 mA, que protege a las personas de una descarga.", "Abre \u{1F9F0} Piezas y coloca al menos un diferencial (m\xE1ximo 3 circuitos por cada uno).", [], [], { miss: "dr" });
    drs.forEach((p) => {
      const id = p.id, d = p.spec, X = { spec: 1, dev: id };
      if (+d.s > 30) add("bad", "".concat(id, " de ").concat(d.s, " mA"), "Un diferencial de ".concat(d.s, " mA solo protege contra incendio."), "Sobre unos 30 mA a trav\xE9s del cuerpo hay riesgo de paro card\xEDaco. En viviendas se exige 30 mA (RIC N\xB010, 5.1.3.5).", "T\xF3calo y usa 30 mA.", [id], [], X);
      if (d.cl === "AC") add("bad", "".concat(id, " clase AC"), "La clase AC solo detecta fugas de corriente alterna pura.", "Computadores, cargadores y equipos inverter producen fugas pulsantes que un AC no detecta bien (RIC N\xB005).", "T\xF3calo y usa clase A (o F o B si hay inverter, cargador de auto o paneles).", [id], [], X);
      else if (d.cl === "B") add("warn", "".concat(id, " clase B"), "La clase B es para fugas de corriente continua (cargador de auto, paneles solares).", "Funciona, pero cuesta varias veces m\xE1s que una clase A y esta casa no lo necesita.", "Usa clase A.", [id], [], X);
      if (igs.length && +d.In < +ig.In) add("bad", "".concat(id, " de ").concat(d.In, " A con general de ").concat(ig.In, " A"), "El diferencial (".concat(d.In, " A) es menor que el general que lo antecede (").concat(ig.In, " A)."), "El diferencial no se protege solo contra sobrecarga: la termomagn\xE9tica que lo antecede no puede ser mayor que su calibre (RIC N\xB002, 6.2.6).", "T\xF3calo y usa ".concat([25, 40, 63].find((x) => x >= +ig.In) || 63, " A o m\xE1s."), [id], [], X);
    });
    if (!conn("src.L") && !conn("src.N")) add("bad", "El tablero no recibe energ\xEDa", "La llegada del medidor (L y N) no est\xE1 conectada.", "Todo parte en la llegada: la fase y el neutro del alimentador entran por arriba del general.", "Une L de la llegada con el borne 1 del general y N con el borne 3.", ["src.L", "src.N"]);
    else if (!conn("src.L") || !conn("src.N")) add("bad", "Falta conectar ".concat(conn("src.L") ? "el neutro" : "la fase", " de la llegada"), "La llegada tiene un solo conductor conectado.", "Sin fase y neutro no hay tensi\xF3n en el tablero.", "Conecta los dos bornes de la llegada al general.", [conn("src.L") ? "src.N" : "src.L"]);
    const outCheck = (o, nmO) => {
      const tL = sig[o + ".L"], tN = sig[o + ".N"], tP = sig[o + ".PE"], r = { tm: null, dr: null, works: false, ok: false, nTrip: null };
      if (![".L", ".N", ".PE"].some((x) => conn(o + x))) {
        add("bad", "".concat(nmO, ": salida sin conectar"), "Ning\xFAn cable llega a esta salida.", "Cada circuito sale del tablero con su fase, su neutro y su tierra.", "Lleva fase, neutro y tierra hasta sus bornes L, N y PE.", [o + ".L", o + ".N", o + ".PE"]);
        return r;
      }
      let okL = false, okN = false, okP = false, dr = null, tm = null;
      if (!tL) add("bad", "".concat(nmO, ": no le llega la fase"), "El borne L no est\xE1 unido con la salida de un disyuntor.", "Sin fase el circuito no funciona.", "Une la salida (abajo) de su disyuntor con el borne L.", [o + ".L"]);
      else if (!one(tL, "L")) add("bad", "".concat(nmO, ": al borne L le llega ").concat(sg(tL)), "Por el conductor de fase del circuito llega otra cosa.", tL.has("N") ? "Fase y neutro invertidos (polaridad cambiada): los interruptores cortar\xEDan el neutro y los equipos quedar\xEDan con fase aunque est\xE9n apagados." : "La tierra nunca se usa como conductor activo.", "Revisa de d\xF3nde viene el cable del borne L.", [o + ".L"]);
      else {
        const ch = cL[o + ".L"] || [], dm = domL(o + ".L"), tmc = dm.filter((d) => d.startsWith("TM")), drc = dm.filter((d) => d.startsWith("DR"));
        ch.forEach((c) => c.rev && revs.add(c.d));
        okL = true;
        if (!dm.some((d) => d.startsWith("IG"))) add("bad", "".concat(nmO, ": la fase se salta el general"), ch.some((c) => c.d.startsWith("IG")) ? "Hay un camino que lleva la fase a la salida sin pasar por el general (un puente que lo salta)." : "La fase llega a la salida sin pasar por el interruptor general.", "Al bajar el general este circuito seguir\xEDa con tensi\xF3n: quien trabaje en \xE9l puede electrocutarse.", "Toma la fase desde la salida (abajo) del general y quita los puentes que lo saltan.", [o + ".L"]);
        if (!tmc.length) {
          okL = false;
          add("bad", "".concat(nmO, ": la fase no pasa por un disyuntor"), ch.some((c) => c.d.startsWith("TM")) ? "Hay otro camino que lleva la fase a la salida sin pasar por su disyuntor." : "La fase llega a la salida sin pasar por un disyuntor (termomagn\xE9tico).", "El disyuntor protege el cable del circuito contra sobrecarga y cortocircuito. Sin \xE9l, una falla quema el cable.", "Pasa la fase por la entrada (arriba) y la salida (abajo) de un disyuntor.", [o + ".L"]);
        } else tm = { d: tmc[tmc.length - 1], p: polOf(ch, tmc[tmc.length - 1]) };
        if (tmc.length > 1) add("warn", "".concat(nmO, ": dos disyuntores en serie"), "La fase pasa por ".concat(tmc.map((c) => tgDN(c, lv)).join(" y "), "."), "Cada circuito lleva un solo disyuntor; dos en serie no protegen mejor y confunden.", "Alimenta el disyuntor directo desde el diferencial (o su peine).", [o + ".L"]);
        if (!drc.length) {
          okL = false;
          const byp = ch.some((c) => c.d.startsWith("DR")) || drs.some((p) => (cL[o + ".L"] || []).some((c) => c.d === p.id));
          add("bad", "".concat(nmO, ": sin diferencial"), byp ? "La fase s\xED pasa por un diferencial, pero tambi\xE9n tiene otro camino que lo salta (un puente o un peine que une ese disyuntor con algo antes del diferencial)." : "La fase no pasa por ning\xFAn diferencial.", "RIC N\xB010: todos los circuitos de una vivienda llevan diferencial de 30 mA, que protege a las personas de una descarga.", byp ? "Busca el cable o peine que une la entrada del disyuntor con el general u otra fuente y qu\xEDtalo." : "Alimenta su disyuntor desde la salida (abajo) de un diferencial.", [o + ".L"]);
        } else dr = { d: drc[0], p: polOf(ch, drc[0]) };
        if (dr && dr.p === 2) add("warn", "".concat(dr.d, ": fase por el polo N"), "La fase pasa por el polo marcado N de ".concat(dr.d, "."), "Funciona, pero el borne N debe llevar el neutro: as\xED se respeta lo rotulado y nadie se confunde despu\xE9s.", "Cruza los cables: fase al polo L y neutro al polo N.", [dr.d + ".i2", dr.d + ".o2"]);
        if (tm && tm.p === 2 && SP(tm.d).p === "1P+N") add("warn", "".concat(tgDN(tm.d, lv), ": fase por el polo N"), "La fase pasa por el polo N del disyuntor 1P+N.", "En un 1P+N solo el polo de fase tiene protecci\xF3n t\xE9rmica y magn\xE9tica: por el polo N no se detecta la sobrecarga.", "Pasa la fase por el polo L.", [tm.d + ".i2", tm.d + ".o2"]);
      }
      if (!tN) add("bad", "".concat(nmO, ": no le llega el neutro"), "El borne N no est\xE1 unido al neutro.", "Sin neutro la corriente no puede volver: nada funciona.", "Une el borne N con la barra de neutro de su diferencial.", [o + ".N"]);
      else if (!one(tN, "N")) add("bad", "".concat(nmO, ": al borne N le llega ").concat(sg(tN)), "Por el conductor de neutro llega otra cosa.", tN.has("L") ? "Polaridad cambiada: el neutro quedar\xEDa con tensi\xF3n." : "La tierra nunca se usa como neutro.", "Revisa de d\xF3nde viene el cable del borne N.", [o + ".N"]);
      else {
        const ch = cN[o + ".N"] || [], drc = domN(o + ".N").filter((d) => d.startsWith("DR"));
        ch.forEach((c) => c.rev && revs.add(c.d));
        okN = true;
        if (dr && !drc.length) {
          okN = false;
          r.nTrip = [dr.d];
          add("bad", "".concat(nmO, ": el neutro no pasa por el diferencial"), "La fase pasa por ".concat(dr.d, ", pero el neutro llega sin pasar por \xE9l (desde la salida del general o una barra que no es la suya)."), "El diferencial compara la corriente que sale por su fase con la que vuelve por su neutro. Si el neutro vuelve por fuera, ve una \xABfuga\xBB y dispara apenas se enciende algo.", "Une el neutro con la salida N de ".concat(dr.d, " o con una barra alimentada solo por ella."), [o + ".N"]);
        } else if (dr && drc[0] !== dr.d) {
          okN = false;
          r.nTrip = [dr.d, drc[0]];
          add("bad", "".concat(nmO, ": fase por ").concat(dr.d, " y neutro por ").concat(drc[0]), "La fase y el neutro del circuito pasan por diferenciales distintos.", "Cada diferencial ve que lo que entra no vuelve: los dos disparan al usar el circuito.", "El neutro debe salir de ".concat(dr.d, "."), [o + ".N"]);
        } else if (drc[0] && polOf(ch, drc[0]) === 1) add("warn", "".concat(drc[0], ": neutro por el polo L"), "El neutro pasa por el polo L del diferencial.", "Funciona, pero se respeta lo rotulado: fase por L y neutro por N.", "Cruza los cables del diferencial.", [drc[0] + ".i1", drc[0] + ".o1"]);
      }
      if (!tP) add("bad", "".concat(nmO, ": sin tierra"), "El borne PE no est\xE1 unido a la barra de tierra.", "Sin tierra, si un equipo tiene una falla de aislaci\xF3n su carcasa queda con tensi\xF3n y nadie lo detecta hasta que alguien la toca (RIC N\xB006).", "Une PE con la barra de tierra usando cable verde/amarillo.", [o + ".PE"]);
      else if (!one(tP, "PE")) add("bad", "".concat(nmO, ": al borne PE le llega ").concat(sg(tP)), "Por el conductor de tierra llega un activo.", "La carcasa de los equipos quedar\xEDa con tensi\xF3n: muy peligroso.", "La tierra va solo a la barra de tierra.", [o + ".PE"]);
      else okP = true;
      r.tm = tm && tm.d;
      r.dr = dr && dr.d;
      r.works = okL && okN;
      r.ok = okL && okN && okP;
      return r;
    };
    const res = req.map((r, k) => {
      const x = outCheck("O" + (k + 1), r.n);
      if (r.S < r.smin) {
        x.ok = false;
        add("bad", "".concat(r.n, ": cable de ").concat(sStr(r.S), " mm\xB2 bajo el m\xEDnimo"), "Para ".concat(r.tp === "alumbrado" ? "alumbrado" : "enchufes y equipos", " la secci\xF3n m\xEDnima es ").concat(sStr(r.smin), " mm\xB2 (RIC N\xB004, 5.4)."), "Da resistencia mec\xE1nica y margen para cargas futuras, aunque la corriente sea baja.", "En los datos del circuito elige ".concat(sStr(r.smin), " mm\xB2 o m\xE1s."), ["O" + (k + 1) + ".L"]);
      }
      if (!(r.P > 0)) add("bad", "".concat(r.n, ": sin potencia"), "El circuito no tiene carga definida.", "Sin carga no se puede elegir su disyuntor.", "Ingresa la potencia del circuito.", []);
      if (x.tm) {
        const d = SP(x.tm), dn = tgDN(x.tm, lv), X = { spec: 1, dev: x.tm };
        if (+d.In < r.min) {
          x.ok = false;
          x.over = true;
          add("bad", "".concat(r.n, ": ").concat(dn, " de ").concat(d.In, " A es chico"), "Carga ".concat(n0(r.P), " W = ").concat(nf(r.I), " A. Se exige In ≥ 1,1 \xD7 I").concat(r.mn ? ", m\xEDnimo ".concat(r.mn, " A para este tipo de circuito,") : "", " y P ≤ 90 % \xD7 V \xD7 In → m\xEDnimo ").concat(r.min, " A."), "Si es chico, corta sin falla cuando el circuito se usa normalmente.", "T\xF3calo y usa ".concat(tgOkIn(r).join(" o ") || r.min, " A", tgOkIn(r).length ? "" : " y un cable m\xE1s grueso", "."), [x.tm], [], X);
        } else if (+d.In > r.max) {
          x.ok = false;
          add("bad", "".concat(r.n, ": ").concat(dn, " de ").concat(d.In, " A para cable de ").concat(sStr(r.S), " mm\xB2"), "El cable soporta ".concat(r.max, " A (Iz) y el disyuntor deja pasar ").concat(d.In, " A."), "El cable se recalentar\xEDa antes de que el disyuntor corte: riesgo de incendio. Debe cumplirse In ≤ Iz.", "T\xF3calo y usa ".concat(tgOkIn(r).join(" o ") || "un disyuntor menor", " A."), [x.tm], [], X);
        }
        if (d.cv === "D") {
          x.ok = false;
          add("bad", "".concat(r.n, ": curva D"), "La curva D (10–20 \xD7 In) es para motores grandes.", "En una vivienda tardar\xEDa demasiado en cortar un cortocircuito en un cable delgado.", "T\xF3calo y usa curva ".concat(r.cv, "."), [x.tm], [], X);
        } else if (d.cv !== r.cv) add("warn", "".concat(r.n, ": curva ").concat(d.cv), r.cv === "C" ? "Circuito con enchufes protegido con curva B." : "Circuito de alumbrado protegido con curva C.", r.cv === "C" ? "Los equipos enchufados tienen picos de arranque de 5 a 10 veces su corriente: la curva B (3–5 \xD7 In) disparar\xEDa sin falla." : "Funciona, pero la curva B corta m\xE1s r\xE1pido y es la recomendada para alumbrado.", "T\xF3calo y usa curva ".concat(r.cv, "."), [x.tm], [], X);
      }
      return x;
    });
    const tmOf = res.map((x) => x.tm), drOf = res.map((x) => x.dr);
    tmOf.forEach((t, k) => {
      const k2 = tmOf.indexOf(t);
      if (t && k2 !== k) add("bad", "".concat(tgDN(t, lv), " alimenta dos circuitos"), "".concat(req[k2].n, " y ").concat(req[k].n, " salen del mismo disyuntor."), "Cada circuito lleva su propio disyuntor: as\xED una falla deja sin energ\xEDa solo esa parte y cada cable queda protegido seg\xFAn su secci\xF3n.", "Usa un disyuntor distinto para cada salida.", [t]);
    });
    let pil = false, plTM = null;
    const needPL = tgNeedPL(lv);
    if (!pls.length) {
      if (needPL) add("bad", "Falta la luz piloto", "El tablero tiene ".concat(req.length, " circuitos."), "RIC N\xB002, 6.2.14: todo tablero lleva luz piloto que indique presencia de energ\xEDa, salvo los domiciliarios de hasta 3 circuitos.", "Abre \u{1F9F0} Piezas y coloca una luz piloto con su propio disyuntor de 6 o 10 A.", [], [], { miss: "pl" });
    } else {
      const pid = pls[0].id, ta = pid + ".a", tb = pid + ".b", pa = sig[ta], pb = sig[tb];
      if (!conn(ta) && !conn(tb)) add(needPL ? "bad" : "warn", "Luz piloto sin conectar", "La luz piloto no tiene cables.", needPL ? "Con m\xE1s de 3 circuitos es obligatoria (RIC N\xB002, 6.2.14)." : "Si la pones, con\xE9ctala; si no, qu\xEDtala: con ".concat(req.length, " circuitos es opcional."), "Alim\xE9ntala desde la salida de un disyuntor de 10 A como m\xE1ximo (fase) y el neutro.", [ta, tb]);
      else if (!(one(pa, "L") && one(pb, "N") || one(pa, "N") && one(pb, "L"))) add("bad", "La luz piloto no enciende", "Le llega ".concat(sg(pa), " por un borne y ").concat(sg(pb), " por el otro."), "Una ampolleta necesita fase por un borne y neutro por el otro.", "Une un borne con la fase (desde su disyuntor) y el otro con el neutro.", [ta, tb]);
      else {
        pil = !hasShort;
        const pL = one(pa, "L") ? ta : tb, dm = domL(pL), tmp = dm.filter((d) => d.startsWith("TM"));
        (cL[pL] || []).forEach((c) => c.rev && revs.add(c.d));
        plTM = tmp.length ? tmp[tmp.length - 1] : null;
        if (!plTM) add("bad", "Luz piloto sin protecci\xF3n propia", "La fase de la piloto viene directo ".concat(dm.some((d) => d.startsWith("IG")) ? "del general" : "de la llegada", ", sin un disyuntor propio."), "RIC N\xB002, 6.2.15: los equipos del tablero que necesitan energ\xEDa, como la luz piloto, se alimentan desde un circuito independiente con protecci\xF3n de 10 A como m\xE1ximo.", "Pon un disyuntor de 6 o 10 A (1P+N es lo m\xE1s c\xF3modo) y alimenta la piloto desde su salida.", [ta, tb]);
        else if (+SP(plTM).In > 10) add("bad", "Protecci\xF3n de la piloto de ".concat(SP(plTM).In, " A"), "".concat(tgDN(plTM, lv), " protege la luz piloto con ").concat(SP(plTM).In, " A."), "RIC N\xB002, 6.2.15: la protecci\xF3n de estos equipos es de 10 A como m\xE1ximo, porque sus cables son delgados.", "T\xF3calo y usa 6 o 10 A.", [plTM], [], { spec: 1, dev: plTM });
        else if (tmOf.includes(plTM)) add("bad", "La piloto comparte disyuntor con un circuito", "".concat(tgDN(plTM, lv), " alimenta la piloto y tambi\xE9n ").concat(req[tmOf.indexOf(plTM)].n, "."), "La piloto va en un circuito independiente (RIC N\xB002, 6.2.15): si se corta un circuito, la piloto debe seguir mostrando que hay tensi\xF3n.", "Usa un disyuntor solo para la piloto.", [plTM]);
        else if (pL === tb) add("warn", "Luz piloto con L y N cruzados", "La fase lleg\xF3 al borne marcado N.", "La ampolleta enciende igual, pero se respeta lo rotulado para no confundir a quien trabaje despu\xE9s.", "Cruza los dos cables de la piloto.", [ta, tb]);
      }
      if (pls.length > 1) add("warn", "Hay ".concat(pls.length, " luces piloto"), "En monof\xE1sico basta una (una por fase).", "Una pieza que no se usa es dinero perdido.", "Quita las que sobran.", pls.slice(1).map((p) => p.id));
    }
    drs.forEach((p) => {
      const n = drOf.filter((x) => x === p.id).length;
      if (n > 3) add("bad", "".concat(p.id, " protege ").concat(n, " circuitos"), "Un diferencial protege como m\xE1ximo 3 circuitos.", "Las peque\xF1as fugas normales de cada circuito se suman y har\xEDan disparar el diferencial sin falla (RIC N\xB010, 5.1.3.7).", "Coloca otro diferencial y pasa algunos circuitos a \xE9l.", [p.id]);
      else if (!n && ws.length) add("warn", "".concat(p.id, " no protege ning\xFAn circuito"), "Ninguna salida queda protegida solo a trav\xE9s de ".concat(p.id, "."), "Puede que no le llegue ning\xFAn circuito o que haya otro camino que lo salte. Una pieza que no se usa es dinero perdido.", "Alimenta desde su salida los disyuntores de sus circuitos (con un peine) o qu\xEDtalo.", [p.id]);
    });
    tms.forEach((p) => {
      if (!tmOf.includes(p.id) && p.id !== plTM && ws.length) add("warn", "".concat(tgDN(p.id, lv), " no alimenta ninguna salida"), "Su salida no llega a ning\xFAn circuito.", "Un disyuntor sin circuito ocupa lugar, cuesta dinero y confunde al rotular.", "\xDAsalo para un circuito o qu\xEDtalo.", [p.id]);
    });
    st.parts.filter((p) => p.k === "bn" || p.k === "pe" || p.k === "bf").forEach((p) => {
      const s0 = sig[p.id];
      if (p.k === "bf") {
        if (!conn(p.id)) {
          if (ws.length) add("warn", "".concat(tgDN(p.id, lv), " sin usar"), "La barra no tiene cables.", "Una pieza que no se usa es dinero perdido.", "\xDAsala o qu\xEDtala.", [p.id]);
        } else if (s0 && s0.size && !s0.has("L")) add("bad", "".concat(tgDN(p.id, lv), " con ").concat(sg(s0)), "La barra de fase solo debe llevar la fase (L).", s0.has("N") ? "Con el neutro en la barra de fase, los disyuntores quedan sin tensi\xF3n y se confunde la polaridad." : "La tierra va en su propia barra verde: nunca se mezcla con un activo.", "Alimenta la barra con la fase que sale del general o del diferencial.", [p.id]);
        return;
      }
      if (!conn(p.id)) {
        if (ws.length && (p.k === "bn" || !of("pe").some((q) => conn(q.id)))) add("warn", "".concat(tgDN(p.id, lv), " sin usar"), "La barra no tiene cables.", "Una pieza que no se usa es dinero perdido.", "\xDAsala o qu\xEDtala.", [p.id]);
        if (p.k === "bn") return;
      }
      if (p.k === "bn" && s0 && s0.size && !s0.has("N")) add("bad", "".concat(tgDN(p.id, lv), " con ").concat(sg(s0)), "La barra de neutro (aislada, blanca) solo debe llevar neutro.", s0.has("L") ? "Con fase, todo lo que se conecte a ella queda con tensi\xF3n." : "La tierra va en su propia barra verde: mezclar usos confunde y es peligroso.", "Usa esta barra solo para los neutros.", [p.id]);
      if (p.k === "pe" && s0 && s0.size && !s0.has("PE")) add("bad", "".concat(tgDN(p.id, lv), " con ").concat(sg(s0)), "La barra de tierra solo lleva tierra, unida al electrodo.", "Si la barra verde lleva un activo, quien trabaje despu\xE9s la tocar\xE1 creyendo que es tierra.", "Une la barra de tierra con el conductor del electrodo y usa otra barra para el neutro.", [p.id]);
    });
    of("rp").forEach((p) => {
      const sL = sig[p.id + ".L"], sN = sig[p.id + ".N"];
      if (!conn(p.id + ".L") && !conn(p.id + ".N")) {
        if (ws.length) add("warn", "".concat(tgDN(p.id, lv), " sin usar"), "El repartidor no tiene cables.", "Una pieza que no se usa es dinero perdido.", "\xDAsalo o qu\xEDtalo.", [p.id]);
        return;
      }
      if (sL && sL.size && !sL.has("L")) add("bad", "".concat(tgDN(p.id, lv), ": la barra L lleva ").concat(sg(sL)), "La barra marcada L del repartidor es para la fase.", "Si se usa para otra cosa, quien trabaje despu\xE9s confiar\xE1 en la marca y puede equivocarse.", "Usa la barra L para la fase y la barra N para el neutro.", [p.id + ".L"]);
      if (sN && sN.size && !sN.has("N")) add("bad", "".concat(tgDN(p.id, lv), ": la barra N lleva ").concat(sg(sN)), "La barra marcada N del repartidor es para el neutro.", sN.has("L") ? "Con fase en la barra N, quien la toque creyendo que es neutro puede electrocutarse." : "La tierra va en su barra verde, nunca en el repartidor.", "Usa la barra N solo para el neutro.", [p.id + ".N"]);
    });
    pns.forEach((p) => {
      const tt = teeth.filter((x) => x.pn === p.id), n = +p.spec.n || 2, free = n - tgTeeth(st, p).reduce((a, x) => a.add(x.m), new Set()).size;
      if (!tt.length) add("warn", "".concat(tgDN(p.id, lv), " sin equipos"), "El peine no queda apretado en la entrada de ning\xFAn equipo.", "Un peine solo sirve sobre las entradas de equipos seguidos del mismo riel.", "Mu\xE9velo sobre los disyuntores que quieres alimentar o qu\xEDtalo.", [p.id]);
      else if (free > 0) add("warn", "".concat(tgDN(p.id, lv), ": ").concat(free, " diente").concat(free > 1 ? "s" : "", " al aire"), "El peine es m\xE1s largo que los equipos que alimenta.", "RIC N\xB002, 6.2.4.3: los peines se usan con el 100 % de sus accesorios de f\xE1brica: los dientes sobrantes van cortados o tapados para que nadie toque partes con tensi\xF3n.", "C\xE1mbiale el largo a ".concat(n - free, " m\xF3dulos."), [p.id], [], { spec: 1, dev: p.id });
      if (tt.length && !(deg[p.id + ".L"] > 0) && !(deg[p.id + ".N"] > 0) && !tt.some((x) => (deg[x.a] || 0) > 0)) add("warn", "".concat(tgDN(p.id, lv), " sin alimentar"), "Ning\xFAn cable lleva energ\xEDa al peine.", "El peine reparte, pero alguien tiene que alimentarlo: desde la salida del diferencial (o del general).", "Une la salida del diferencial con la alimentaci\xF3n L del peine (o con la entrada del primer equipo).", [p.id + ".L"]);
    });
    if (of("pe").length === 0) add("bad", "Falta la barra de tierra", "No hay barra de tierra en el tablero.", "La tierra del electrodo se reparte a cada circuito desde una barra de tierra (RIC N\xB006).", "Abre \u{1F9F0} Piezas y coloca una barra de tierra.", [], [], { miss: "pe" });
    let em = null;
    if (lv.emer >= 0) {
      em = outCheck("OE", "Luz de emergencia");
      const want = tmOf[lv.emer];
      if (em.tm && want && em.tm !== want) {
        em.ok = false;
        em.works = false;
        add("bad", "Luz de emergencia en otro circuito", "Est\xE1 conectada a ".concat(tgDN(em.tm, lv), ", pero debe colgar del circuito de ").concat(req[lv.emer].n, " (").concat(tgDN(want, lv), ")."), "La luz de emergencia aut\xF3noma vigila el alumbrado de su zona: si ese circuito pierde tensi\xF3n (falla o disparo), enciende sola con su bater\xEDa. Si est\xE1 en otro circuito, no se entera del corte.", "Une su borne L con la salida de ".concat(tgDN(want, lv), "."), ["OE.L"]);
      } else if (em.tm && !want) add("warn", "Luz de emergencia sin su circuito", "Primero conecta el circuito de ".concat(req[lv.emer].n, "."), "La luz de emergencia va en el circuito de alumbrado que vigila.", "Conecta la salida de ".concat(req[lv.emer].n, "."), ["OE.L"]);
    }
    const badCol = { L: [], N: [], PE: [] };
    ws.forEach((w) => {
      const s = sig[w.a];
      if (!s || s.size !== 1) return;
      const k = [...s][0], okc = k === "L" ? ["R", "K", "A"].includes(w.c) : k === "N" ? w.c === "W" : w.c === "G";
      if (!okc) badCol[k].push(w);
    });
    Object.keys(badCol).forEach((k) => {
      const arr = badCol[k];
      if (!arr.length) return;
      add("bad", "".concat(arr.length, " cable").concat(arr.length > 1 ? "s" : "", " de ").concat(TG_SIG[k], " con color equivocado"), arr.slice(0, 3).map((w) => "".concat(nm(w.a), " → ").concat(nm(w.b), ": ").concat(TG_COL[w.c][0].toLowerCase())).join(" \xB7 ") + (arr.length > 3 ? " …" : ""), "Los colores dicen qu\xE9 es cada cable sin medir (RIC N\xB004, 5.32): fases azul, negro o rojo; neutro blanco; tierra verde o verde/amarillo. Un color cambiado enga\xF1a a quien trabaje despu\xE9s.", "Toca el cable y c\xE1mbiale el color: " + (k === "L" ? "rojo, negro o azul para la fase." : k === "N" ? "blanco para el neutro." : "verde/amarillo para la tierra."), [], arr.map((w) => w.i));
    });
    const over = Object.keys(deg).filter((t) => L.T[t] && !L.T[t].bar && deg[t] > (L.T[t].io || L.T[t].feed ? 2 : 1));
    if (over.length) add("bad", "Demasiados cables en un borne", over.map((t) => "".concat(nm(t), ": ").concat(deg[t], " cables")).join(" \xB7 "), "El borne de un equipo modular aprieta bien hasta 2 conductores; los de llegada, piloto y salidas, 1. Si hay m\xE1s, quedan flojos, se calientan y pueden provocar un incendio.", "Reparte con un peine o una barra.", over);
    {
      const jumpI = [], jumpO = [], fan = {};
      ws.forEach((w) => {
        const a = L.T[w.a], b = L.T[w.b];
        if (!a.io || !b.io || a.dev === b.dev) return;
        if (a.io === "i" && b.io === "i") jumpI.push(w);
        else if (a.io === "o" && b.io === "o") jumpO.push(w);
        else {
          const o = a.io === "o" ? a : b;
          (fan[o.id] = fan[o.id] || []).push(w);
        }
      });
      if (jumpI.length) add("bad", "Puente de cable entre entradas de equipos", jumpI.slice(0, 3).map((w) => "".concat(nm(w.a), " ↔ ").concat(nm(w.b))).join(" \xB7 "), "RIC N\xB002, 6.2.4: no se acepta cablear un tablero de dispositivo a dispositivo. Un puente as\xED obliga a meter dos cables en un borne, se suelta con el uso y no se puede desconectar un equipo sin dejar sin energ\xEDa a los siguientes.", "Quita el puente y usa un ⫶ peine de conexi\xF3n sobre los equipos seguidos (o una barra de distribuci\xF3n). El peine se alimenta con un solo cable.", jumpI.flatMap((w) => [w.a, w.b]), jumpI.map((w) => w.i));
      if (jumpO.length) add("bad", "Puente de cable entre salidas de equipos", jumpO.slice(0, 3).map((w) => "".concat(nm(w.a), " ↔ ").concat(nm(w.b))).join(" \xB7 "), "Unir dos salidas pone en paralelo dos protecciones: ninguna protege bien su cable y se pierde la selectividad.", "Cada salida va a su propio circuito o barra.", jumpO.flatMap((w) => [w.a, w.b]), jumpO.map((w) => w.i));
      Object.keys(fan).forEach((o) => {
        const arr = fan[o];
        if (arr.length < 2) return;
        const t = L.T[o];
        add("bad", "".concat(tgDN(t.dev, lv), " alimenta ").concat(arr.length, " equipos con cables"), "Desde ".concat(nm(o), " salen cables a ").concat(arr.map((w) => tgDN(L.T[w.a === o ? w.b : w.a].dev, lv)).join(", "), "."), t.dev.startsWith("DR") ? "RIC N\xB002, 6.2.4.2: la conexi\xF3n de un diferencial a m\xE1s de una termomagn\xE9tica se hace con barra de distribuci\xF3n o conexiones prefabricadas (peine), no con cables de equipo a equipo." : "RIC N\xB002, 6.2.4.1: si una termomagn\xE9tica alimenta m\xE1s de un equipo se usan barras o conexiones prefabricadas (peine o repartidor).", "Deja un solo cable hacia un ⫶ peine (o un repartidor) que reparta a todos.", [o], arr.map((w) => w.i));
      });
    }
    const uf = {}, fnd = (x) => {
      while (uf[x] != null && uf[x] !== x) x = uf[x];
      return x;
    };
    ws.concat(teeth).forEach((w) => {
      const a = fnd(w.a), b = fnd(w.b);
      if (a !== b) uf[a] = b;
    });
    const outsBy = {};
    Object.values(L.T).forEach((t) => {
      if (t.io === "o" && (t.dev.startsWith("IG") || t.dev.startsWith("DR")) && conn(t.id)) (outsBy[fnd(t.id)] = outsBy[fnd(t.id)] || []).push(t);
    });
    Object.values(outsBy).forEach((arr) => {
      const dv = [...new Set(arr.map((t) => t.dev))];
      if (dv.length < 2) return;
      add("bad", "Salidas de ".concat(dv.join(" y "), " unidas"), "".concat(lab[arr[0].id] === "N" ? "Los neutros" : "Las salidas", " de ").concat(dv.map((x) => tgDN(x, lv)).join(" y "), " quedaron unidos por cables, por la misma barra o por el mismo peine."), "Cada diferencial tiene su grupo de circuitos y su propia barra de neutro. Si se unen, la corriente vuelve por el otro lado y los diferenciales disparan sin falla (o uno queda sin efecto).", "Usa una barra de neutro y un peine distintos para cada diferencial y no unas sus salidas.", arr.map((t) => t.id));
      arr.forEach((t) => t.dev.startsWith("DR") && res.forEach((x) => {
        if (x.dr === t.dev) x.nTrip = (x.nTrip || []).concat([t.dev]);
      }));
    });
    revs.forEach((d) => add("warn", "".concat(tgDN(d, lv), " conectado al rev\xE9s"), "La energ\xEDa le entra por los bornes de abajo.", "La llegada va arriba y las salidas abajo: as\xED, al abrirlo, los bornes de abajo quedan sin tensi\xF3n y el sentido coincide con lo rotulado (algunos diferenciales solo funcionan bien en ese sentido).", "Invierte sus cables: entrada arriba, salida abajo.", [d]));
    const cost = tgCost(st), budget = tgBudget(lv);
    if (cost > budget) add("warn", "Te pasaste del presupuesto", "Gastaste ".concat(tgMoney(cost), " y el presupuesto de la obra es ").concat(tgMoney(budget), "."), "En una obra real el cliente paga lo presupuestado: elegir bien, ni de m\xE1s ni de menos, tambi\xE9n es parte del trabajo.", "Revisa piezas que sobran o equipos m\xE1s caros de lo necesario (diferencial clase B, disyuntores 2P donde basta 1P…).", []);
    const energ = [], lit = req.map(() => false), trip = new Set();
    let emOn = false;
    if (!conn("src.L") || !conn("src.N")) energ.push(["warn", "La llegada del medidor no est\xE1 conectada: el tablero queda sin tensi\xF3n."]);
    else if (hasShort) energ.push(["bad", "Al subir el general: \xA1cortocircuito! El general dispara al instante."]);
    else {
      if (leak) {
        drs.forEach((p) => trip.add(p.id));
        energ.push(["bad", "Al subir el general, los diferenciales disparan: hay una uni\xF3n entre ".concat(pairs["L+PE"] ? "fase y tierra" : "neutro y tierra", ".")]);
      }
      res.forEach((x) => (x.nTrip || []).forEach((d) => {
        if (!trip.has(d)) {
          trip.add(d);
          energ.push(["bad", "Al encender las cargas, ".concat(d, " dispara: su fase y su neutro no van por el mismo camino.")]);
        }
      }));
      if (pls.length || needPL) energ.push(pil ? ["ok", "Luz piloto encendida: el tablero tiene tensi\xF3n."] : ["warn", "La luz piloto no enciende."]);
      req.forEach((r, k) => {
        const x = res[k];
        if (!x.works) energ.push(["bad", "".concat(r.n, ": no funciona.")]);
        else if (trip.has(x.dr)) energ.push(["bad", "".concat(r.n, ": sin energ\xEDa porque ").concat(x.dr, " dispar\xF3.")]);
        else if (x.over) energ.push(["bad", "".concat(r.n, ": con toda la carga, ").concat(tgDN(x.tm, lv), " dispara por sobrecarga.")]);
        else {
          lit[k] = true;
          energ.push(["ok", "".concat(r.n, ": funciona (").concat(n0(r.P), " W, ").concat(nf(r.I), " A) \xB7 ").concat(x.tm ? tgDN(x.tm, lv).replace("Disyuntor ", "") : "", " \xB7 ").concat(x.dr || "", ".")]);
        }
      });
      if (em) {
        emOn = em.works && !trip.has(em.dr);
        energ.push(emOn ? ["ok", "Luz de emergencia: carga su bater\xEDa. Si ".concat(tgDN(tmOf[lv.emer] || "", lv), " o ").concat(em.dr, " se abren, enciende sola.")] : ["bad", "Luz de emergencia: no recibe tensi\xF3n."]);
      }
    }
    return { errs, warns, mark, wmark, lit, pil, emOn, energ, tmOf, drOf, res, em, req, g, cost, budget, wc: fnd, plTM, teeth };
  }
  function tgRoles(lv, st, A) {
    const by = (k) => st.parts.filter((p) => p.k === k).sort((a, b) => a.r - b.r || a.m - b.m), req = tgReqs(lv).req, nd = req.length;
    const ig = by("ig")[0], pl = by("pl")[0], drs = by("dr"), tms0 = by("tm"), pe = by("pe")[0], miss = [], ndr = Math.max(1, Math.ceil(nd / 3)), needPL = tgNeedPL(lv);
    const n2 = (n, a, b) => n === 1 ? a : n + " " + b;
    if (!ig) miss.push(["ig", "el interruptor general"]);
    if (needPL && !pl) miss.push(["pl", "la luz piloto"]);
    let plTM = null;
    if (pl) {
      if (A && A.plTM && tms0.some((x) => x.id === A.plTM) && !A.tmOf.includes(A.plTM)) plTM = A.plTM;
      else if (tms0.length > nd) {
        const c = tms0.filter((x) => +x.spec.In <= 10 && !(A && A.tmOf.includes(x.id))).sort((a, b) => a.r - b.r || (b.spec.p === "1P+N") - (a.spec.p === "1P+N") || a.m - b.m);
        plTM = c.length ? c[0].id : null;
      }
    }
    const tms = tms0.filter((x) => x.id !== plTM);
    if (drs.length < ndr) miss.push(["dr", n2(ndr - drs.length, "un diferencial", "diferenciales") + " (m\xE1ximo 3 circuitos por diferencial)"]);
    if (tms.length < nd) miss.push(["tm", n2(nd - tms.length, "un disyuntor", "disyuntores") + " (uno por circuito)"]);
    if (pl && !plTM && tms.length >= nd) miss.push(["tm", "un disyuntor de 6 o 10 A (1P+N) para la luz piloto (RIC N\xB002, 6.2.15)", { p: "1P+N", In: 6, cv: "B" }]);
    const drOf = [], tmOf = [], cnt = {};
    req.forEach((r, k) => {
      const d = A && A.drOf[k];
      if (d && drs.some((x) => x.id === d) && (cnt[d] || 0) < 3) {
        drOf[k] = d;
        cnt[d] = (cnt[d] || 0) + 1;
      }
    });
    req.forEach((r, k) => {
      if (drOf[k]) return;
      const c = [drs[Math.floor(k * drs.length / nd)]].concat(drs).find((x) => x && (cnt[x.id] || 0) < 3);
      if (c) {
        drOf[k] = c.id;
        cnt[c.id] = (cnt[c.id] || 0) + 1;
      }
    });
    const usedT = new Set();
    req.forEach((r, k) => {
      const t = A && A.tmOf[k];
      if (t && !usedT.has(t) && tms.some((x) => x.id === t)) {
        tmOf[k] = t;
        usedT.add(t);
      }
    });
    req.forEach((r, k) => {
      if (tmOf[k]) return;
      const near = tms.filter((x) => !usedT.has(x.id)), d = drs.find((x) => x.id === drOf[k]), grp = req.map((q, j) => j).filter((j) => drOf[j] === drOf[k] && tmOf[j]).map((j) => tms.find((x) => x.id === tmOf[j]));
      const t = near.sort((a, b) => {
        const sc = (x) => grp.length ? Math.min(...grp.map((y) => Math.abs(y.r - x.r) * 100 + Math.abs(y.m - x.m))) : d ? Math.abs(x.r - d.r - 1) * 100 + x.m : x.r * 100 + x.m;
        return sc(a) - sc(b);
      })[0];
      if (t) {
        tmOf[k] = t.id;
        usedT.add(t.id);
      }
    });
    const usedDR = drs.filter((d) => drOf.includes(d.id)).map((d) => d.id), bns = by("bn").concat(by("rp").map((p) => ({ id: p.id + ".N" }))), bnOf = {}, usedB = new Set();
    const grpOf = (d) => req.map((r, k) => k).filter((k) => drOf[k] === d && tmOf[k]).map((k) => tmOf[k]);
    const needBN = (d) => grpOf(d).some((t) => tgPoles(st, t) === 1) || !grpOf(d).length;
    usedDR.filter(needBN).forEach((d) => {
      const b = A && bns.find((x) => !usedB.has(x.id) && A.wc(d + ".o2") === A.wc(x.id));
      if (b) {
        bnOf[d] = b.id;
        usedB.add(b.id);
      }
    });
    usedDR.filter(needBN).forEach((d) => {
      if (bnOf[d]) return;
      const b = bns.find((x) => !usedB.has(x.id));
      if (b) {
        bnOf[d] = b.id;
        usedB.add(b.id);
      }
    });
    const nb = usedDR.filter(needBN).length - Object.keys(bnOf).length + (drs.length ? 0 : Math.max(0, ndr - bns.length));
    if (nb > 0) miss.push(["bn", n2(nb, "una barra de neutro", "barras de neutro") + " (una por diferencial)"]);
    if (!pe) miss.push(["pe", "la barra de tierra"]);
    const pns = by("pn"), pnOf = {}, usedP = new Set(), pnNeed = [];
    const cover = (ids, two) => {
      const ps = ids.map((id) => st.parts.find((p) => p.id === id)).filter(Boolean);
      if (ps.length < 2) return { skip: 1 };
      const r = ps[0].r, srt = ps.slice().sort((a, b) => a.m - b.m);
      if (ps.some((p) => p.r !== r)) return { bad: "en rieles distintos" };
      for (let i = 1; i < srt.length; i++) if (srt[i].m !== srt[i - 1].m + tgWd(srt[i - 1].k, srt[i - 1].spec)) return { bad: "con espacios o equipos de otro grupo entre ellos" };
      const m0 = srt[0].m, m1 = srt[srt.length - 1].m + tgWd(srt[srt.length - 1].k, srt[srt.length - 1].spec);
      const have = pns.find((p) => !usedP.has(p.id) && p.r === r && p.m <= m0 && p.m + (+p.spec.n) >= m1 && (p.spec.p === "2P") === two);
      return { r, m: m0, n: m1 - m0, have, names: srt.map((p) => p.id) };
    };
    const igGrp = [plTM && pl ? plTM : null].concat(usedDR).filter(Boolean);
    const want = (key, ids, two, label) => {
      const c = cover(ids, two);
      if (c.skip) return;
      if (c.bad) {
        miss.push(["move", "ubicar ".concat(ids.map((x) => tgDN(x, lv).replace("Disyuntor ", "").replace("Diferencial ", "")).join(", "), " juntos y seguidos en un mismo riel para ponerles un peine (ahora est\xE1n ").concat(c.bad, ")"), null, ids]);
        return;
      }
      if (c.have) {
        pnOf[key] = c.have.id;
        usedP.add(c.have.id);
      } else {
        pnNeed.push(key);
        miss.push(["pn", "un peine ".concat(two ? "de 2 polos (L+N)" : "de 1 polo", " de ").concat(c.n, " m\xF3dulos sobre ").concat(label), { p: two ? "2P" : "1P", n: c.n }, null, { r: c.r, m: c.m }]);
      }
    };
    want("IG", igGrp, true, "las entradas de lo que alimenta el general");
    usedDR.forEach((d) => {
      const g2 = grpOf(d);
      want(d, g2, g2.some((t) => tgPoles(st, t) === 2), "los disyuntores de ".concat(d));
    });
    return { ig: ig && ig.id, pl: pl && pl.id, pe: pe && pe.id, plTM: pl ? plTM : null, drOf, tmOf, bnOf, usedDR, pnOf, grpOf, igGrp, miss };
  }
  function tgRoleWires(lv, st, R) {
    const W = [], w = (a, b, c) => {
      if (a && b) W.push({ a, b, c });
    }, req = tgReqs(lv).req, P = (id) => tgPoles(st, id), first = (ids) => ids.map((id) => st.parts.find((p) => p.id === id)).filter(Boolean).sort((a, b) => a.r - b.r || a.m - b.m)[0];
    const oL = R.ig ? R.ig + ".o1" : null, oN = R.ig && P(R.ig) === 2 ? R.ig + ".o2" : null;
    if (R.ig) {
      w("src.L", R.ig + ".i1", "R");
      if (oN) w("src.N", R.ig + ".i2", "W");
    }
    if (R.igGrp.length > 1 && R.pnOf.IG) {
      w(oL, R.pnOf.IG + ".L", "R");
      w(oN, R.pnOf.IG + ".N", "W");
    } else if (R.igGrp.length === 1) {
      w(oL, R.igGrp[0] + ".i1", "R");
      w(oN, R.igGrp[0] + ".i2", "W");
    }
    if (R.pl && R.plTM) {
      w(R.plTM + ".o1", R.pl + ".a", "R");
      if (P(R.plTM) === 2) w(R.plTM + ".o2", R.pl + ".b", "W");
      else w(oN, R.pl + ".b", "W");
    }
    if (R.pe) w("T.PE", R.pe, "G");
    R.usedDR.forEach((d) => {
      const g2 = R.grpOf(d), two = g2.some((t) => P(t) === 2);
      if (g2.length > 1 && R.pnOf[d]) {
        w(d + ".o1", R.pnOf[d] + ".L", "R");
        if (two) w(d + ".o2", R.pnOf[d] + ".N", "W");
      } else if (g2.length === 1) {
        w(d + ".o1", g2[0] + ".i1", "R");
        if (two) w(d + ".o2", g2[0] + ".i2", "W");
      }
      if (R.bnOf[d]) w(d + ".o2", R.bnOf[d], "W");
    });
    req.forEach((r, k) => {
      const t = R.tmOf[k], o = "O" + (k + 1), bn = R.bnOf[R.drOf[k]];
      if (t) w(t + ".o1", o + ".L", "R");
      if (t && P(t) === 2) w(t + ".o2", o + ".N", "W");
      else w(bn, o + ".N", "W");
      w(R.pe, o + ".PE", "G");
    });
    if (lv.emer >= 0) {
      const t = R.tmOf[lv.emer], bn = R.bnOf[R.drOf[lv.emer]];
      if (t) w(t + ".o1", "OE.L", "R");
      w(t && P(t) === 2 ? t + ".o2" : bn, "OE.N", "W");
      w(R.pe, "OE.PE", "G");
    }
    return W;
  }
  function tgFresh(lv, tmP) {
    const { req, g } = tgReqs(lv), nd = req.length, ndr = Math.max(lv.ndr, Math.ceil(nd / 3)), igIn = COM.find((x) => x >= g.min && x <= g.max) || g.min, drIn2 = [25, 40, 63].find((x) => x >= igIn) || 63, needPL = tgNeedPL(lv);
    const st = { parts: [], wires: [], t0: 0 }, cur2 = [0, 0, 0, 0];
    const put = (r0, k, sp, gap) => {
      const w = tgWd(k, sp);
      let r = r0;
      while (r < TG_RAILS && cur2[r] + (cur2[r] && gap ? 1 : 0) + w > TG_MODS) r++;
      if (r >= TG_RAILS) r = TG_RAILS - 1;
      if (cur2[r] && gap) cur2[r]++;
      const id = tgNewId(st, k);
      st.parts.push({ id, k, r, m: cur2[r], spec: Object.assign({}, sp) });
      cur2[r] += w;
      return st.parts[st.parts.length - 1];
    };
    const pnOn = (ps, two) => {
      if (ps.length < 2) return;
      const m0 = ps[0].m, last = ps[ps.length - 1], n = last.m + tgWd(last.k, last.spec) - m0;
      st.parts.push({ id: tgNewId(st, "pn"), k: "pn", r: ps[0].r, m: m0, spec: { p: two ? "2P" : "1P", n } });
    };
    put(0, "ig", { p: "2P", In: igIn, cv: "C" });
    const top = [];
    if (needPL) top.push(put(0, "tm", { p: "1P+N", In: 6, cv: "B" }));
    const D = [];
    for (let j = 0; j < ndr; j++) D.push(put(0, "dr", { In: drIn2, s: 30, cl: "A" }));
    if (needPL) put(0, "pl", {});
    pnOn(top.concat(D), true);
    const grp = D.map(() => []);
    req.forEach((r, k) => grp[Math.min(ndr - 1, Math.floor(k * ndr / nd))].push(r));
    let rr = 1;
    grp.forEach((gr) => {
      const w = gr.length * (tmP === "1P+N" ? 2 : 1);
      if (cur2[rr] && cur2[rr] + 1 + w > TG_MODS) rr++;
      const ps = gr.map((r) => put(rr, "tm", { p: tmP || "1P", In: r.min, cv: r.cv }, ps0(gr, r)));
      pnOn(ps, tmP === "1P+N");
    });
    function ps0(gr, r) {
      return gr[0] === r;
    }
    const br = Math.min(TG_RAILS - 1, Math.max(...st.parts.map((p) => p.r)) + 1);
    if (tmP !== "1P+N") for (let j = 0; j < ndr; j++) put(br, "bn", {}, true);
    put(br, "pe", {}, true);
    st.wires = tgRoleWires(lv, st, tgRoles(lv, st, null));
    return st;
  }
  function tgBudget(lv) {
    return Math.ceil(tgCost(tgFresh(lv, "1P")) * 1.25 / 1e3) * 1e3;
  }
  function tgHintOf(lv, st) {
    const L = tgLayout(lv, st), A = tgCheck(lv, st), R = tgRoles(lv, st, A);
    tgHintPn = null;
    if (R.miss.length) {
      const m = R.miss[0];
      if (m[0] === "move") return { msg: "Pista: ".concat(m[1], ". T\xF3calos y usa ↔ Mover."), t: [], dev: m[3] && m[3][0] };
      if (m[0] === "pn") {
        tgHintPn = m[4];
        return { msg: "Pista: falta ".concat(m[1], ". Abre \u{1F9F0} Piezas → Peine (ya qued\xF3 elegido el tipo y el largo) y t\xF3calo en el riel ").concat(m[4].r + 1, " desde el m\xF3dulo ").concat(m[4].m + 1, " (marcado)."), cat: "pn", spec: m[2] };
      }
      return { msg: "Pista: falta colocar ".concat(m[1], ". Abre \u{1F9F0} Piezas, elige \xAB").concat(TG_K[m[0]].n, "\xBB con sus datos y t\xF3calo en un espacio libre de un riel."), cat: m[0], spec: m[2] };
    }
    const se = A.errs.find((e) => e.spec);
    if (se) return { msg: "Pista: ".concat(se.t, ". ").concat(se.fx), dev: se.dev };
    const want = tgRoleWires(lv, st, R), key = (a, b) => [a, b].sort().join("|"), wantK = new Set(want.map((w) => key(w.a, w.b)));
    const bad = st.wires.find((w) => {
      const a = L.T[w.a], b = L.T[w.b];
      return a && b && a.io && b.io && a.dev !== b.dev && (a.io === b.io || !wantK.has(key(w.a, w.b)));
    });
    if (bad) return { msg: "Pista: quita el cable ".concat(tgTN(bad.a, lv, L), " → ").concat(tgTN(bad.b, lv, L), ": es un puente de equipo a equipo. T\xF3calo y usa ✂ Quitar cable."), t: [bad.a, bad.b] };
    for (const w of want) {
      if (A.wc(w.a) !== A.wc(w.b)) return { msg: "Pista: une ".concat(tgTN(w.a, lv, L), " con ").concat(tgTN(w.b, lv, L), " usando cable ").concat(TG_COL[w.c][0].toLowerCase(), " (").concat(TG_COL[w.c][2], "). Los dos quedaron marcados en verde."), t: [w.a, w.b] };
    }
    return { msg: A.errs.length ? "Pista: ya est\xE1n las conexiones necesarias, pero hay algo mal puesto o de m\xE1s. Toca \xABComprobar\xBB para ver qu\xE9." : "Pista: \xA1parece listo! Toca \xABComprobar\xBB." };
  }
  function tgRoute(L, st) {
    const RY = TG_RY, OY = TG_OY, MW = TG_MW, gapOf = (t, other) => {
      if (t.dev === "src") return 0;
      if (/^O|^T$/.test(t.dev)) return 4;
      const p = tgPart(st, t.dev);
      if (!p) return 0;
      if (t.bar) return other && other.y < RY[p.r] ? p.r : p.r + 1;
      if (t.feed) return p.r;
      return t.dir === "u" ? p.r : p.r + 1;
    };
    const GAP = [0, 1, 2, 3, 4].map((k) => ({ y0: k === 0 ? 18 : RY[k - 1] + 62, y1: k === 4 ? OY - 18 : RY[k] - 92 }));
    const ws = st.wires.map((w, i) => Object.assign({ i }, w)).filter((w) => L.T[w.a] && L.T[w.b]);
    const slots = {}, pos = {};
    ws.forEach((w) => [["a", "b"], ["b", "a"]].forEach(([e, f]) => {
      if (L.T[w[e]].bar) (slots[w[e]] = slots[w[e]] || []).push({ k: w.i + e, ox: L.T[w[f]].x });
    }));
    Object.keys(slots).forEach((b) => {
      const t = L.T[b], p = tgPart(st, t.dev), arr = slots[b].sort((x, y) => parseInt(x.k) - parseInt(y.k)), n = arr.length;
      const rp = p && p.k === "rp", first = rp ? t.x0 + 10 : t.x0 + 13, pitch = rp ? (t.x1 - t.x0 - 20) / 4 : 18, last = rp ? t.x1 - 10 : t.x1 - 13;
      const step = n > 1 ? Math.min(pitch, (last - first) / (n - 1)) : pitch;
      arr.forEach((s2, j) => pos[s2.k] = first + j * step);
    });
    const multi = {};
    ws.forEach((w) => ["a", "b"].forEach((e) => {
      if (!L.T[w[e]].bar) (multi[w[e]] = multi[w[e]] || []).push(w.i);
    }));
    const end = (w, e) => {
      const t = L.T[w[e]], o = L.T[w[e === "a" ? "b" : "a"]], gp = gapOf(t, o);
      if (t.bar) {
        const up = gp <= tgPart(st, t.dev).r;
        return { x: pos[w.i + e], y: t.y + (up ? -7 : 7), g: gp, t };
      }
      const ml = multi[w[e]] || [], j = ml.indexOf(w.i), off = ml.length > 1 ? (j - (ml.length - 1) / 2) * 7 : 0;
      return { x: t.x + off, y: t.y, g: gp, t };
    };
    const R = ws.map((w) => {
      const a = end(w, "a"), b = end(w, "b");
      return { w, a, b, same: a.g === b.g };
    });
    const lanes = [0, 1, 2, 3, 4].map(() => []);
    R.forEach((r) => {
      if (r.same) lanes[r.a.g].push({ r, kind: 1, x: Math.min(r.a.x, r.b.x), span: Math.abs(r.a.x - r.b.x), e: "s" });
      else {
        [["a", r.a], ["b", r.b]].forEach(([e, p]) => {
          const above = p.y < (GAP[p.g].y0 + GAP[p.g].y1) / 2;
          lanes[p.g].push({ r, kind: above ? 0 : 2, x: p.x, e });
        });
      }
    });
    const laneY = {};
    lanes.forEach((arr, gi) => {
      const G = GAP[gi], A0 = arr.filter((x) => x.kind === 0).sort((p, q) => q.x - p.x), A1 = arr.filter((x) => x.kind === 1).sort((p, q) => p.span - q.span), A2 = arr.filter((x) => x.kind === 2).sort((p, q) => p.x - q.x), all = A0.concat(A1, A2), n = all.length;
      const step = n > 1 ? Math.min(8, (G.y1 - G.y0 - 10) / (n - 1)) : 0, y0 = (G.y0 + G.y1) / 2 - step * (n - 1) / 2;
      all.forEach((x, j) => laneY[x.r.w.i + x.e] = y0 + j * step);
    });
    const vert = R.filter((r) => !r.same).sort((p, q) => Math.abs(p.a.g - p.b.g) - Math.abs(q.a.g - q.b.g) || p.w.i - q.w.i), vx = {}, capL = Math.floor((L.LW - 10) / 6.5) + 1;
    const lc = L.LX + L.LW / 2, rc = L.CX + L.CW / 2, left = [], right = [];
    vert.forEach((r) => {
      const cl = Math.abs(r.a.x - lc) + Math.abs(r.b.x - lc), cr = Math.abs(r.a.x - rc) + Math.abs(r.b.x - rc);
      (cl < cr && left.length < capL ? left : right).push(r);
    });
    right.forEach((r, j) => vx[r.w.i] = L.CX + 7 + j * (right.length > 1 ? Math.min(8, (L.CW - 14) / (right.length - 1)) : 0));
    left.forEach((r, j) => vx[r.w.i] = L.LX + L.LW - 7 - j * 6.5);
    R.forEach((r) => {
      const { a, b } = r;
      if (r.same) {
        const y = laneY[r.w.i + "s"];
        r.pts = [[a.x, a.y], [a.x, y], [b.x, y], [b.x, b.y]];
      } else {
        const ya = laneY[r.w.i + "a"], yb = laneY[r.w.i + "b"], x = vx[r.w.i];
        r.pts = [[a.x, a.y], [a.x, ya], [x, ya], [x, yb], [b.x, yb], [b.x, b.y]];
      }
      r.d = "M" + r.pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L");
    });
    return { R, GAP };
  }
  function tgSVG(lv, st, A, shown) {
    const L = tgLayout(lv, st), bad = shown ? A.mark : new Set(), wbad = shown ? A.wmark : new Set(), hint = tgHintT || [], MW = TG_MW;
    const tx2 = (x, y, t, o) => '<text x="'.concat(x, '" y="').concat(y, '" text-anchor="').concat(o && o.a || "middle", '" font-size="').concat(o && o.s || 13, '" font-weight="').concat(o && o.b ? 700 : 400, '" fill="').concat(o && o.c || "#1d2731", '"').concat(o && o.h ? ' stroke="'.concat(o.h, '" stroke-width="4" stroke-linejoin="round" paint-order="stroke"') : "", ' pointer-events="none">').concat(esc(t), "</text>");
    const RT = tgRoute(L, st), GAP = RT.GAP, RL = L.RL;
    let g = '<defs><linearGradient id="tgcab" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#eef1f4"/><stop offset="1" stop-color="#d9dee3"/></linearGradient><linearGradient id="tgdin" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d5dade"/><stop offset=".5" stop-color="#aab2ba"/><stop offset="1" stop-color="#c9cfd5"/></linearGradient><pattern id="tglid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 10L10 0" stroke="#9aa3ab" stroke-width="1" opacity=".5"/></pattern><filter id="tgsh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-opacity=".28"/></filter></defs>';
    g += '<rect x="6" y="6" width="'.concat(L.W - 12, '" height="').concat(L.H - 12, '" rx="18" fill="url(#tgcab)" stroke="#6f7983" stroke-width="5"/>');
    const duct = (x, y, w, h) => '<rect x="'.concat(x, '" y="').concat(y, '" width="').concat(w, '" height="').concat(h, '" rx="4" fill="#c3c9cf" stroke="#9aa3ab"/>');
    const lid = (x, y, w, h) => '<rect x="'.concat(x, '" y="').concat(y, '" width="').concat(w, '" height="').concat(h, '" rx="4" fill="#e3e7eb" fill-opacity=".62" stroke="#8d969f"/><rect x="').concat(x, '" y="').concat(y, '" width="').concat(w, '" height="').concat(h, '" rx="4" fill="url(#tglid)" pointer-events="none"/>');
    const ducts = [];
    GAP.forEach((G) => ducts.push([L.LX + L.LW, G.y0, L.CX - L.LX - L.LW, G.y1 - G.y0]));
    ducts.push([L.CX, GAP[0].y0, L.CW, GAP[4].y1 - GAP[0].y0]);
    ducts.push([L.LX, GAP[0].y0, L.LW, GAP[4].y1 - GAP[0].y0]);
    {
      const g4 = GAP[4];
      ducts.push([16, g4.y0, L.LX - 16, g4.y1 - g4.y0]);
      const xr = Math.max(L.CX + L.CW, ...Object.values(L.D).filter((d) => /^O/.test(d.id)).map((d) => d.x + d.w));
      if (xr > L.CX + L.CW) ducts.push([L.CX + L.CW, g4.y0, xr - L.CX - L.CW + 4, g4.y1 - g4.y0]);
      ducts.push([16, GAP[0].y0, L.LX - 16, GAP[0].y1 - GAP[0].y0]);
    }
    ducts.forEach((d) => g += duct(d[0], d[1], d[2], d[3]));
    TG_RY.forEach((y, r) => {
      g += '<rect x="'.concat(TG_RX - 10, '" y="').concat(y - 9, '" width="').concat(RL - TG_RX + 20, '" height="18" rx="2" fill="url(#tgdin)" stroke="#8d969f"/>');
      for (let m = 0; m <= TG_MODS; m++) g += '<line x1="'.concat(TG_RX + m * MW, '" y1="').concat(y - 9, '" x2="').concat(TG_RX + m * MW, '" y2="').concat(y + 9, '" stroke="#8f98a1" stroke-width="1"/>');
      g += tx2(RL + 4, y + 4, "Riel " + (r + 1), { a: "end", s: 10, b: 1, c: "#5b6672" });
    });
    g += tx2(TG_RX + 4, TG_OY + 84, "Regleta de salida a los circuitos (orden de trabajo)", { a: "start", s: 12.5, b: 1, c: "#5b6672" });
    g += tx2(L.CX + L.CW / 2, GAP[0].y0 - 4 > 10 ? GAP[0].y0 - 4 : 14, "canaleta", { s: 10, c: "#6b7682" });
    const pnPlace = tgPlace && tgPlace.k === "pn" || tgMove && (tgPart(st, tgMove) || {}).k === "pn";
    Object.values(L.D).forEach((d) => {
      const id = d.id, p = tgPart(st, id), cur2 = tgDev === id || tgMove === id, isBad = bad.has(id), stk = cur2 ? "#e8823a" : isBad ? "#c0392b" : "#4b545d", sw = cur2 || isBad ? 4 : 2, cx = d.x + d.w / 2;
      if (id === "src") {
        g += '<line x1="8" y1="'.concat(d.y + 30, '" x2="').concat(d.x, '" y2="').concat(d.y + 30, '" stroke="#D32F2F" stroke-width="7"/><line x1="8" y1="').concat(d.y + 50, '" x2="').concat(d.x, '" y2="').concat(d.y + 50, '" stroke="#999" stroke-width="7"/><line x1="8" y1="').concat(d.y + 50, '" x2="').concat(d.x, '" y2="').concat(d.y + 50, '" stroke="#F4F4F4" stroke-width="5"/>');
        g += '<rect x="'.concat(d.x, '" y="').concat(d.y, '" width="').concat(d.w, '" height="').concat(d.h, '" rx="8" fill="#3b4650" filter="url(#tgsh)"/>') + tx2(cx, d.y + 30, "Llegada", { b: 1, c: "#fff", s: 14 }) + tx2(cx, d.y + 48, "desde el medidor", { c: "#dfe7ee", s: 11 }) + tx2(cx, d.y + 66, "alim. ".concat(sStr(lv.alimS), " mm\xB2"), { c: "#dfe7ee", s: 11 });
        return;
      }
      if (id === "T") {
        g += '<rect x="'.concat(d.x, '" y="').concat(d.y, '" width="').concat(d.w, '" height="').concat(d.h, '" rx="8" fill="#5c4a32" filter="url(#tgsh)"/>') + tx2(cx, d.y + 24, "Tierra", { b: 1, c: "#fff" }) + tx2(cx, d.y + 40, "electrodo", { c: "#eadfcf", s: 11 });
        return;
      }
      if (/^O/.test(id)) {
        const k = id === "OE" ? -1 : +id.slice(1) - 1, on = shown && (k < 0 ? A.emOn : A.lit[k]), r = k >= 0 ? A.req[k] : null;
        g += '<rect x="'.concat(d.x, '" y="').concat(d.y, '" width="').concat(d.w, '" height="').concat(d.h, '" rx="7" fill="').concat(k < 0 ? "#eef8ef" : "#fbfbf7", '" stroke="').concat(isBad ? "#c0392b" : "#4b545d", '" stroke-width="').concat(isBad ? 4 : 2, '" filter="url(#tgsh)"/><rect x="').concat(d.x + 3, '" y="').concat(d.y + 3, '" width="').concat(d.w - 6, '" height="6" rx="3" fill="').concat(on ? "#f2c037" : "#c9cdd1", '"/>');
        if (k < 0) g += '<rect x="'.concat(d.x + 8, '" y="').concat(d.y + 14, '" width="26" height="14" rx="3" fill="').concat(on ? "#3fbf5f" : "#2E7D32", '"/>').concat(tx2(d.x + 21, d.y + 25.5, "→", { s: 13, b: 1, c: "#fff" })).concat(tx2(d.x + 74, d.y + 26, "Emergencia", { b: 1, s: 12 })).concat(tx2(cx, d.y + 44, "aut\xF3noma \xB7 ".concat(((lv.circ[lv.emer] || [])[0] || "").slice(0, 10)), { s: 10.5, c: "#4b5662" }));
        else g += tx2(cx, d.y + 26, r.n.length > 16 ? r.n.slice(0, 15) + "…" : r.n, { b: 1, s: 12 }) + tx2(cx, d.y + 43, "C".concat(k + 1, " \xB7 ").concat(n0(r.P), " W \xB7 ").concat(sStr(r.S), " mm\xB2"), { s: 10.5, c: "#4b5662" });
        if (on) g += '<circle cx="'.concat(d.x + d.w - 10, '" cy="').concat(d.y + 6, '" r="9" fill="#ffd54a" opacity=".55"/>');
        return;
      }
      if (!p || p.k === "pn") return;
      if (p.k === "rp") {
        g += '<g class="tgd" data-tgd="'.concat(id, '" tabindex="0" role="button" aria-label="').concat(esc(tgDN(id, lv)), ': opciones"><rect x="').concat(d.x, '" y="').concat(d.y, '" width="').concat(d.w, '" height="').concat(d.h, '" rx="6" fill="#f3efe6" stroke="').concat(stk, '" stroke-width="').concat(sw, '" filter="url(#tgsh)"/></g>');
        [["L", "#c8a165"], ["N", "#dfe6ee"]].forEach(([q, fc]) => {
          const t = L.T[id + "." + q], sel = tgSel === t.id, hb = hint.includes(t.id), sk = sel ? "#e8823a" : bad.has(t.id) ? "#c0392b" : hb ? "#2e7d32" : "#6d7680";
          g += '<g class="tgt" data-tgt="'.concat(t.id, '" tabindex="0" role="button" aria-label="').concat(esc(tgTN(t.id, lv, L)), '"><rect x="').concat(t.x0 - 4, '" y="').concat(t.y - 13, '" width="').concat(t.x1 - t.x0 + 8, '" height="26" fill="transparent"/><rect x="').concat(t.x0, '" y="').concat(t.y - 7, '" width="').concat(t.x1 - t.x0, '" height="14" rx="3" fill="').concat(fc, '" stroke="').concat(sk, '" stroke-width="').concat(sel || hb ? 4 : 2, '"/>');
          for (let i = 0; i < 5; i++) g += '<circle cx="'.concat(t.x0 + 10 + i * (t.x1 - t.x0 - 20) / 4, '" cy="').concat(t.y, '" r="3" fill="#6d6455"/>');
          g += "</g>";
        });
        return;
      }
      if (p.k === "bn" || p.k === "pe" || p.k === "bf") {
        const pe = p.k === "pe", sel = tgSel === id, hb = hint.includes(id), sk = sel || cur2 ? "#e8823a" : isBad ? "#c0392b" : hb ? "#2e7d32" : "#6d7680", n = Math.floor((d.w - 8) / 18);
        g += '<g class="tgd" data-tgd="'.concat(id, '" tabindex="0" role="button" aria-label="').concat(esc(tgDN(id, lv)), ': opciones"><rect x="').concat(d.x, '" y="').concat(d.y - 34, '" width="').concat(d.w, '" height="22" rx="5" fill="').concat(pe ? "#d7efdc" : "#f4f4f1", '" stroke="').concat(cur2 ? "#e8823a" : "#9aa3ab", '"/>').concat(tx2(cx, d.y - 19, (pe ? "⏚ " : "") + tgDN(id, lv).replace("Barra de ", "Barra "), { s: 11.5, b: 1, c: pe ? "#1d6b2f" : "#3d4651" }), "</g>");
        g += '<g class="tgt" data-tgt="'.concat(id, '" tabindex="0" role="button" aria-label="').concat(esc(tgDN(id, lv)), ': conectar"><rect x="').concat(d.x - 4, '" y="').concat(d.y - 10, '" width="').concat(d.w + 8, '" height="').concat(d.h + 20, '" fill="transparent"/><rect x="').concat(d.x, '" y="').concat(d.y, '" width="').concat(d.w, '" height="').concat(d.h, '" rx="3" fill="').concat(pe ? "#2E9E44" : p.k === "bf" ? "#c94a3c" : "#f1f1ee", '" stroke="').concat(sk, '" stroke-width="').concat(sel || hb || cur2 ? 4 : 2, '"/>');
        for (let i = 0; i < n; i++) g += '<circle cx="'.concat(d.x + 13 + i * 18, '" cy="').concat(d.y + 7, '" r="3.4" fill="').concat(pe ? "#cfe9d4" : "#9aa3ad", '"/>');
        if (pe) for (let i = 0; i < n; i++) g += '<rect x="'.concat(d.x + 4 + i * 18, '" y="').concat(d.y, '" width="5" height="').concat(d.h, '" fill="#E8C300" opacity=".55"/>');
        g += "</g>";
        return;
      }
      const sp = p.spec;
      g += '<g class="tgd" data-tgd="'.concat(id, '" tabindex="0" role="button" aria-label="').concat(esc(tgDN(id, lv)), ': opciones"><rect x="').concat(d.x, '" y="').concat(d.y, '" width="').concat(d.w, '" height="').concat(d.h, '" rx="6" fill="').concat(p.k === "dr" ? "#eaf1f8" : p.k === "ig" ? "#fff6e8" : id === A.plTM ? "#fdf7dc" : "#fbfbf7", '" stroke="').concat(stk, '" stroke-width="').concat(sw, '" filter="url(#tgsh)"/>');
      g += '<rect x="'.concat(cx - 7, '" y="').concat(d.y + 6, '" width="14" height="14" rx="2" fill="#3e4a55"/><rect x="').concat(cx - 4, '" y="').concat(d.y + 8, '" width="8" height="6" rx="1" fill="').concat(shown && (p.k !== "tm" || A.tmOf.includes(id) || id === A.plTM) ? "#3fae6c" : "#9aa3ab", '"/>');
      if (p.k === "pl") {
        const on = shown && A.pil;
        g += '<circle cx="'.concat(cx, '" cy="').concat(d.y + 44, '" r="12" fill="').concat(on ? "#ffd54a" : "#d6d9dc", '" stroke="#7a7f85" stroke-width="2"/>').concat(on ? '<circle cx="'.concat(cx, '" cy="').concat(d.y + 44, '" r="21" fill="#ffd54a" opacity=".35"/>') : "");
      }
      g += "</g>";
    });
    st.parts.filter((p) => p.k === "pn").forEach((p) => {
      const d = L.D[p.id], two = p.spec.p === "2P", cur2 = tgDev === p.id || tgMove === p.id, isBad = bad.has(p.id), stk = cur2 ? "#e8823a" : isBad ? "#c0392b" : "#6f5a2c", ry = TG_RY[p.r];
      tgTeeth(st, p).forEach((t) => {
        const tt = L.T[t.t], yb = t.bus === "N" ? ry - 78 : ry - 66;
        g += '<line x1="'.concat(tt.x, '" y1="').concat(yb, '" x2="').concat(tt.x, '" y2="').concat(tt.y - 6, '" stroke="').concat(t.bus === "N" ? "#8aa0b4" : "#b87333", '" stroke-width="5" stroke-linecap="round"/>');
      });
      g += '<g class="tgd" data-tgd="'.concat(p.id, '" tabindex="0" role="button" aria-label="').concat(esc(tgDN(p.id, lv)), ': opciones">');
      if (two) g += '<rect x="'.concat(d.x, '" y="').concat(ry - 84, '" width="').concat(d.w, '" height="12" rx="3" fill="#dfe6ee" stroke="').concat(stk, '" stroke-width="').concat(cur2 || isBad ? 3 : 1.5, '"/>');
      g += '<rect x="'.concat(d.x, '" y="').concat(ry - 72, '" width="').concat(d.w, '" height="12" rx="3" fill="#d79a5d" stroke="').concat(stk, '" stroke-width="').concat(cur2 || isBad ? 3 : 1.5, '"/>').concat(tx2(d.x + d.w / 2 + 14, ry - 62.5, tgDN(p.id, lv).replace("Peine ", "Peine ") + (two ? " \xB7 L+N" : " \xB7 L"), { s: 9.5, b: 1, c: "#3a2a12", h: "#d79a5d" }), "</g>");
    });
    const sw2 = (w) => TG_COL[w.c] || TG_COL.R;
    RT.R.forEach((r) => {
      const c = sw2(r.w);
      g += '<path d="'.concat(r.d, '" fill="none" stroke="#2a2f35" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/><path d="').concat(r.d, '" fill="none" stroke="').concat(c[1], '" stroke-width="3.8" stroke-linejoin="round" stroke-linecap="round"/>');
      if (r.w.c === "G") g += '<path d="'.concat(r.d, '" fill="none" stroke="#E8C300" stroke-width="3.8" stroke-dasharray="7 9" stroke-linejoin="round"/>');
    });
    ducts.forEach((d) => g += lid(d[0], d[1], d[2], d[3]));
    RT.R.forEach((r) => {
      const c = sw2(r.w), sel = tgWire === r.w.i, wb = wbad.has(r.w.i), p = r.pts, stubs = [[p[0], p[1]], [p[p.length - 2], p[p.length - 1]]];
      g += '<g class="tgw" data-tgw="'.concat(r.w.i, '" tabindex="0" role="button" aria-label="Cable ').concat(esc(c[0]), '">');
      if (sel || wb) g += '<path d="'.concat(r.d, '" fill="none" stroke="').concat(sel ? "#e8823a" : "#e53935", '" stroke-width="12" opacity=".55" stroke-linejoin="round" ').concat(wb && !sel ? 'stroke-dasharray="8 6"' : "", "/>");
      if (sel) g += '<path d="'.concat(r.d, '" fill="none" stroke="').concat(c[1], '" stroke-width="4" stroke-linejoin="round"/>');
      stubs.forEach(([q1, q2]) => {
        const dd = "M".concat(q1[0], " ").concat(q1[1], " L").concat(q2[0], " ").concat(q2[1]);
        g += '<path d="'.concat(dd, '" fill="none" stroke="#2a2f35" stroke-width="6" stroke-linecap="round"/><path d="').concat(dd, '" fill="none" stroke="').concat(c[1], '" stroke-width="3.8" stroke-linecap="round"/>');
        if (r.w.c === "G") g += '<path d="'.concat(dd, '" fill="none" stroke="#E8C300" stroke-width="3.8" stroke-dasharray="7 9"/>');
      });
      g += '<path d="'.concat(r.d, '" fill="none" stroke="transparent" stroke-width="14"/></g>');
    });
    st.parts.forEach((p) => {
      const d = L.D[p.id], sp = p.spec, cx = d.x + d.w / 2, H = (x, y, t, o) => g += tx2(x, y, t, Object.assign({ h: p.k === "dr" ? "#eaf1f8" : p.k === "ig" ? "#fff6e8" : p.k === "pe" ? "#d7efdc" : p.id === A.plTM ? "#fdf7dc" : "#fbfbf7" }, o));
      if (p.k === "pn") return;
      if (p.k === "pl") H(cx, d.y + 74, "Piloto", { s: 11, b: 1 });
      else if (p.k === "rp") {
        H(cx, d.y + 44, "Repartidor", { s: 11, b: 1, h: "#f3efe6" });
        H(d.x + 9, d.y + 21, "L", { s: 10, b: 1, c: "#8a5a1f", h: "#f3efe6" });
        H(d.x + 9, d.y + 69, "N", { s: 10, b: 1, c: "#3d4651", h: "#f3efe6" });
      } else if (p.k === "bn" || p.k === "pe" || p.k === "bf") H(cx, d.y - 19, (p.k === "pe" ? "⏚ " : "") + tgDN(p.id, lv).replace("Barra de ", "Barra "), { s: 11.5, b: 1, c: p.k === "pe" ? "#1d6b2f" : p.k === "bf" ? "#a8322b" : "#3d4651" });
      else {
        H(cx, d.y + 36, p.k === "ig" ? d.w < 60 ? "GRAL" : "GENERAL" : p.k === "dr" ? p.id : "D" + p.id.slice(2), { b: 1, s: 13.5 });
        if (p.k === "dr") {
          H(cx, d.y + 53, "".concat(sp.In, " A \xB7 ").concat(sp.s, " mA"), { s: 11.5 });
          H(cx, d.y + 67, "clase " + sp.cl, { s: 10.5, c: "#4b5662" });
        } else {
          H(cx, d.y + 53, "".concat(sp.In, " A ").concat(sp.cv), { s: 11.5 });
          H(cx, d.y + 67, p.id === A.plTM ? "piloto" : sp.p, { s: 10.5, c: "#4b5662" });
        }
      }
    });
    Object.values(L.T).forEach((t) => {
      if (t.bar) return;
      const sel = tgSel === t.id, hb = hint.includes(t.id), isB = bad.has(t.id), lyU = t.dir === "u";
      g += '<g class="tgt" data-tgt="'.concat(t.id, '" tabindex="0" role="button" aria-label="').concat(esc(tgTN(t.id, lv, L)), '"><circle cx="').concat(t.x, '" cy="').concat(t.y, '" r="').concat(t.feed ? 13 : 18, '" fill="transparent"/>');
      if (hb) g += '<circle cx="'.concat(t.x, '" cy="').concat(t.y, '" r="').concat(t.feed ? 12 : 16, '" fill="#66bb6a" opacity=".55"/>');
      if (isB) g += '<circle cx="'.concat(t.x, '" cy="').concat(t.y, '" r="').concat(t.feed ? 12 : 16, '" fill="none" stroke="#e53935" stroke-width="3"/>');
      g += '<circle cx="'.concat(t.x, '" cy="').concat(t.y, '" r="').concat(t.feed ? sel ? 9 : 7 : sel ? 12 : 10, '" fill="').concat(t.feed ? "#e9c08a" : "#cdd1d6", '" stroke="').concat(sel ? "#e8823a" : "#3a3f44", '" stroke-width="').concat(sel ? 4 : 2, '"/><line x1="').concat(t.x - 4, '" y1="').concat(t.y - 4, '" x2="').concat(t.x + 4, '" y2="').concat(t.y + 4, '" stroke="#5a6068" stroke-width="2"/></g>');
      const dk = t.dev === "src" || t.dev === "T";
      if (!t.feed) g += tx2(t.x, lyU ? t.y + (dk ? 22 : t.io || t.dev.startsWith("PL") ? 24 : 26) : t.y - 15, t.lab, { s: 11, b: 1, c: dk ? "#fff" : t.lab === "PE" ? "#1d6b2f" : t.lab === "L" ? "#b71c1c" : "#47515c" });
    });
    if (tgPlace || tgMove) {
      const o = pnPlace ? tgOccPn(st, tgMove) : tgOcc(st, tgMove);
      TG_RY.forEach((y, r) => {
        for (let m = 0; m < TG_MODS; m++) if (!o[r][m]) g += '<rect class="tgslot" data-tgslot="'.concat(r, ":").concat(m, '" x="').concat(TG_RX + m * MW + 3, '" y="').concat(pnPlace ? y - 90 : y - 44, '" width="').concat(MW - 6, '" height="').concat(pnPlace ? 34 : 88, '" rx="6"/>');
      });
    }
    if (tgHintPn) {
      const hp = tgHintPn;
      g += '<rect x="'.concat(TG_RX + hp.m * MW + 2, '" y="').concat(TG_RY[hp.r] - 92, '" width="').concat(MW - 4, '" height="36" rx="6" fill="#66bb6a" opacity=".45" stroke="#2e7d32" stroke-width="2" pointer-events="none"/>');
    }
    const vb = tgVB ? tgVBclamp(tgVB, L.W, L.H) : { x: 0, y: 0, w: L.W, h: L.H };
    return '<svg class="tgsvg" data-w="'.concat(L.W, '" data-h="').concat(L.H, '" viewBox="').concat([vb.x, vb.y, vb.w, vb.h].map((v) => Math.round(v * 10) / 10).join(" "), '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Interior del tablero para armar y cablear">').concat(g, "</svg>");
  }
  const TG_SHORT = { p: (v) => v, In: (v) => v + " A", cv: (v) => v, s: (v) => v + " mA", cl: (v) => v, n: (v) => v + " m" };
  let tgNeed = false;
  function tgNeedMsg() {
    const k = S.tg.cat.k, sp = S.tg.cat[k] || {}, miss = TG_SPEC[k].filter(([f]) => sp[f] == null || sp[f] === "").map(([, l]) => l);
    if (!miss.length) return false;
    tgNeed = true;
    tgMsg = "Antes de colocar el " + TG_K[k].n.toLowerCase() + " elige: " + miss.join(", ") + " (marcados en rojo en la caja de piezas).";
    tgRender();
    const c = document.getElementById("tgcat");
    if (c) c.scrollIntoView({ block: "nearest", behavior: "smooth" });
    return true;
  }
  function tgSpecSel(k, sp, act) {
    return TG_SPEC[k].map(([f, lab, ops]) => {
      const cur3 = ops.find(([v]) => String(sp[f]) === String(v));
      return '<div class="tgseg' + (tgNeed && !cur3 ? " tgmiss" : "") + '" role="group" aria-label="'.concat(esc(lab), '"><span>').concat(lab).concat(cur3 ? ' <em class="hint">\xB7 '.concat(esc(cur3[1]), "</em>") : "", "</span><div>").concat(ops.map(([v, l]) => '<button type="button" class="tgch" data-tg="'.concat(act, '" data-f="').concat(f, '" data-v="').concat(v, '" aria-pressed="').concat(String(sp[f]) === String(v), '" title="').concat(esc(l), '">').concat(TG_SHORT[f](v), "</button>")).join(""), "</div></div>");
    }).join("");
  }
  function tgCatHTML() {
    const c = S.tg.cat, k = c.k || "ig", sp = c[k] || {}, ready = TG_SPEC[k].every(([f]) => sp[f] != null && sp[f] !== ""), w = tgWd(k, sp);
    return '<section class="card tgp" id="tgcat"><h3>\u{1F9F0} Caja de piezas</h3><div class="tgkinds">'.concat(Object.keys(TG_K).map((kk) => '<button type="button" class="tgkc" data-tg="catk" data-k="'.concat(kk, '" aria-pressed="').concat(kk === k, '"><b>').concat(TG_K[kk].ic, "</b> ").concat(TG_K[kk].n, "</button>")).join(""), '</div><p class="hint" style="margin:8px 0 4px">').concat(TG_K[k].d, "</p>").concat(tgSpecSel(k, sp, "cspec"), '<div class="tgbuy"><span>').concat(ready ? "<b>".concat(tgMoney(tgPrice(k, sp)), "</b> \xB7 ").concat(k === "pn" ? "va sobre las entradas" : w + " m\xF3dulo" + (w > 1 ? "s" : "")) : '<span class="hint">Toca un valor en cada fila</span>', '</span><span class="tgbtns"><button type="button" class="btn small" data-tg="autoplace" ').concat(ready ? "" : 'aria-disabled="true" data-need="1"', ">⚡ ", k === "pn" ? "Poner donde corresponde" : "Poner en el primer lugar libre", '</button><button type="button" class="btn ghost small" data-tg="place" ').concat(ready ? "" : 'aria-disabled="true" data-need="1"', ">\u{1F4CD} Elegir el lugar</button></span></div></section>");
  }
  function tgStatus(lv, st, L) {
    if (tgMsg) return tgMsg;
    if (tgPlace) return tgPlace.k === "pn" ? "\u{1F4CD} Toca sobre las entradas del primer equipo que alimentar\xE1 el peine (".concat(tgSpecTxt("pn", tgPlace.spec), "). ✕ para terminar.") : "\u{1F4CD} Toca un espacio verde de un riel para colocar: ".concat(TG_K[tgPlace.k].n, " ").concat(tgSpecTxt(tgPlace.k, tgPlace.spec), ". Puedes poner varios; toca ✕ para terminar.");
    if (tgMove) return "↔ Toca un espacio verde para mover ".concat(tgDN(tgMove, lv).toLowerCase(), ". Sus cables lo siguen.");
    if (tgWire != null && st.wires[tgWire]) {
      const w = st.wires[tgWire];
      return "Cable ".concat(TG_COL[w.c][0].toLowerCase(), ": ").concat(tgTN(w.a, lv, L), " → ").concat(tgTN(w.b, lv, L), ".");
    }
    if (tgSel) return "✋ ".concat(tgTN(tgSel, lv, L), ": ahora toca el otro extremo del cable ").concat(TG_COL[S.tg.col || "R"][0].toLowerCase(), ".");
    if (tgDev) return "".concat(tgDN(tgDev, lv), ": c\xE1mbiale los datos, mu\xE9velo o qu\xEDtalo.");
    if (!st.parts.length) return "El tablero est\xE1 vac\xEDo. Abre \u{1F9F0} Piezas, elige qu\xE9 protecci\xF3n quieres y col\xF3cala donde quieras.";
    return "Toca un borne y luego otro para tender un cable: el cable se ordena solo por las canaletas. Toca una pieza para cambiarla o moverla.";
  }
  function tgPanel(lv, st, A, shown, L) {
    const sw = (k, v) => '<i style="background:'.concat(v[1]).concat(k === "G" ? ";background-image:repeating-linear-gradient(90deg,transparent 0 6px,#E8C300 6px 10px)" : "", '"></i>');
    let h = "";
    const close = tgFull ? '<button type="button" class="btn ghost small" data-tg="pclose" style="float:right">✕ Cerrar</button>' : "";
    if (tgWire != null && st.wires[tgWire]) {
      const w = st.wires[tgWire];
      h += '<section class="card tgp">'.concat(close, '<div class="tgsel"><b>Cable seleccionado</b><p class="hint" style="margin:2px 0 6px">').concat(esc(tgTN(w.a, lv, L)), " → ").concat(esc(tgTN(w.b, lv, L)), '</p><div class="tgcols">').concat(Object.keys(TG_COL).map((k) => '<button type="button" class="tgcol" data-tg="wcol" data-k="'.concat(k, '" aria-pressed="').concat(w.c === k, '">').concat(sw(k, TG_COL[k]), '<span class="tgtxt">').concat(TG_COL[k][0], "</span></button>")).join(""), '</div><div class="actions" style="border:0;padding:6px 0 0;margin:0"><button type="button" class="btn danger small" data-tg="wdel">✂ Quitar cable</button><button type="button" class="btn ghost small" data-tg="x">Listo</button></div></div></section>');
    } else if (tgDev && tgPart(st, tgDev)) {
      const p = tgPart(st, tgDev);
      h += '<section class="card tgp">'.concat(close, '<div class="tgsel"><b>').concat(esc(tgDN(p.id, lv)), '</b> <span class="hint">\xB7 ').concat(tgMoney(tgPrice(p.k, p.spec)), " \xB7 riel ").concat(p.r + 1, "</span>").concat(TG_SPEC[p.k].length ? tgSpecSel(p.k, p.spec, "pspec") : '<p class="hint" style="margin:4px 0">'.concat(TG_K[p.k].d, "</p>"), '<div class="actions" style="border:0;padding:6px 0 0;margin:0"><button type="button" class="btn small" data-tg="move">↔ Mover</button><button type="button" class="btn ghost small" data-tg="dup">⧉ Otro igual</button><button type="button" class="btn danger small" data-tg="pdel">\u{1F5D1} Quitar</button><button type="button" class="btn ghost small" data-tg="x">Listo</button></div></div></section>');
    }
    if (!tgFull || tgCatOpen) h += tgCatHTML();
    if (shown) {
      const nb = A.errs.length, nw = A.warns.length, star = nb ? "★☆☆" : nw ? "★★☆" : "★★★", secs = st.t0 ? Math.max(0, Math.round((tgCheckT - st.t0) / 1e3)) : 0;
      const item = (o) => '<li class="'.concat(o.sev === "bad" ? "badc" : "tgwarn", '"><b>').concat(o.sev === "bad" ? "✗" : "⚠", " ").concat(esc(o.t), "</b><br>").concat(esc(o.d), '<br><span class="fx">C\xF3mo corregir: ').concat(esc(o.fx), '</span><br><span class="hint">Por qu\xE9: ').concat(esc(o.w), "</span></li>");
      h += '<section class="card tgp" id="tgres">'.concat(close, '<div class="sechead"><span class="tag">Resultado</span><span class="tgstar" aria-label="').concat(nb ? 1 : nw ? 2 : 3, ' de 3 estrellas">').concat(star, '</span></div><p class="hint" style="margin:0 0 6px">⏱ ').concat(Math.floor(secs / 60), " min ").concat(secs % 60, " s \xB7 \u{1F4B0} ").concat(tgMoney(A.cost), " de ").concat(tgMoney(A.budget), "</p>").concat(nb ? note("<b>".concat(nb, " error(es)</b>").concat(nw ? " y ".concat(nw, " observaci\xF3n(es)") : "", ". Corr\xEDgelos y vuelve a comprobar."), "bad") : note(nw ? "✓ El tablero funciona y es seguro. Quedan ".concat(nw, " detalle(s) para la tercera estrella.") : "✓ \xA1Tablero perfecto! Bien elegido, bien ubicado, bien conectado y dentro del presupuesto.", "ok"), '<p style="margin:8px 0 4px"><b>⚡ Al energizar</b></p><ul class="tgen">').concat(A.energ.map(([c, t]) => '<li class="'.concat(c, '">').concat(c === "ok" ? "✓" : c === "bad" ? "✗" : "•", " ").concat(esc(t), "</li>")).join(""), "</ul>").concat(nb + nw ? '<ul class="whyl" style="margin-top:10px">'.concat(A.errs.concat(A.warns).map(item).join(""), "</ul>") : "", "</section>");
    } else if (tgChecked && !tgFull) h += note("Cambiaste el tablero despu\xE9s de comprobar. Toca \xABComprobar\xBB otra vez.", "info");
    h += '<section class="card tgp"><div class="actions" style="margin:0;padding:0;border:0"><button type="button" class="btn small" data-tg="tosim">\u25B6 ' + (tgSimConf ? "\xBFConfirmas? Toca otra vez" : "\u25C8 Pasar este tablero al Simulador 3D") + '</button><button type="button" class="btn ghost small" data-tg="sol">Ver soluci\xF3n</button><button type="button" class="btn danger small" data-tg="reset">'.concat(tgConfirm ? "\xBFSeguro? Toca otra vez" : "Vaciar tablero", '</button></div><p class="hint" style="margin:6px 0 0">').concat(st.parts.length, " pieza(s) \xB7 ").concat(st.wires.length, " cable(s)</p></section>");
    return h;
  }
  function tgTable(lv, st, A, shown) {
    const SP = (id) => (tgPart(st, id) || {}).spec || {}, dsum = (id) => {
      if (!id) return '<span class="hint">sin conectar</span>';
      const d = SP(id);
      return id.startsWith("DR") ? "".concat(id, " \xB7 ").concat(d.In, " A \xB7 ").concat(d.s, " mA \xB7 clase ").concat(d.cl) : "D".concat(id.slice(2), " \xB7 ").concat(d.p, " \xB7 ").concat(d.In, " A ").concat(d.cv);
    };
    const stt = (ok) => shown ? ok ? pill("ok", "✓") : pill("bad", "✗") : '<span class="hint">—</span>';
    const igp = st.parts.find((p) => p.k === "ig"), ig = igp ? igp.spec : null, rows = A.req.map((r, k) => {
      const x = A.res[k];
      return "<tr><td><b>C".concat(k + 1, "</b></td><td>").concat(esc(r.n), '</td><td class="num">').concat(n0(r.P), ' W</td><td class="num">').concat(nf(r.I), " A</td><td>").concat(sStr(r.S), " mm\xB2 \xB7 Iz ").concat(r.max, " A</td><td>").concat(shown ? (tgOkIn(r).join(" / ") || "—") + " A \xB7 " + r.cv : '<span class="hint">al comprobar</span>', "</td><td>").concat(dsum(x.tm), "</td><td>").concat(dsum(x.dr), "</td><td>").concat(stt(x.ok && !A.errs.some((e) => e.t.startsWith(r.n + ":"))), "</td></tr>");
    }).join("");
    const em = lv.emer >= 0 ? '<tr><td><b>E</b></td><td>Luz de emergencia</td><td class="num">≈ 5 W</td><td></td><td>colgada de C'.concat(lv.emer + 1, "</td><td>la de C").concat(lv.emer + 1, "</td><td>").concat(dsum(A.em && A.em.tm), "</td><td>").concat(dsum(A.em && A.em.dr), "</td><td>").concat(stt(A.em && A.em.ok && A.emOn), "</td></tr>") : "";
    const pl = tgNeedPL(lv) || st.parts.some((p) => p.k === "pl") ? '<tr><td><b>P</b></td><td>Luz piloto'.concat(tgNeedPL(lv) ? "" : ' <span class="hint">(opcional)</span>', '</td><td class="num">≈ 1 W</td><td></td><td>circuito propio</td><td>≤ 10 A</td><td>').concat(dsum(A.plTM), '</td><td>—</td><td>').concat(stt(A.pil && !A.errs.concat(A.warns).some((e) => /piloto/i.test(e.t))), "</td></tr>") : "";
    return '<section class="card"><div class="sechead"><span class="tag">Rotulaci\xF3n</span><h2 style="margin:0">Tabla de distribuci\xF3n del tablero</h2></div><p class="hint" style="margin-top:0">Va pegada en la tapa del tablero: dice qu\xE9 protege cada disyuntor y diferencial. Las columnas \xABconectado\xBB se leen de tus cables, en vivo.</p><div class="tbl-wrap"><table class="pt"><thead><tr><th>Circ.</th><th>Uso</th><th class="num">Carga</th><th class="num">I</th><th>Cable</th><th>Disyuntor admisible</th><th>Disyuntor conectado</th><th>Diferencial</th><th>Estado</th></tr></thead><tbody><tr class="tot"><td><b>G</b></td><td>Interruptor general</td><td class="num">'.concat(n0(A.g.Pd), ' W</td><td class="num">').concat(nf(A.g.Id, 1), " A</td><td>alim. ").concat(sStr(lv.alimS), " mm\xB2 \xB7 Iz ").concat(A.g.max, " A</td><td>").concat(shown ? (COM.filter((x) => x >= A.g.min && x <= A.g.max).join(" / ") || "—") + " A \xB7 2P \xB7 C" : '<span class="hint">al comprobar</span>', "</td><td>").concat(ig ? "".concat(ig.p, " \xB7 ").concat(ig.In, " A ").concat(ig.cv) : '<span class="hint">sin colocar</span>', "</td><td>—</td><td>").concat(stt(ig && !A.errs.some((e) => /general/i.test(e.t))), "</td></tr>").concat(rows).concat(em).concat(pl, '</tbody></table></div><p class="hint">Carga del general: demanda seg\xFAn RIC N\xB003 sobre ').concat(n0(A.g.Pi), " W instalados.</p></section>");
  }
  function tgFreeCard(lv) {
    const f = S.tg.free, rows = f.circ.map((c, k) => {
      const T0 = TG_TIPOS[c.t] || TG_TIPOS.otro, low = (+c.S || 0) < (c.t === "alumbrado" ? 1.5 : 2.5);
      return '<tr><td><b>C'.concat(k + 1, '</b></td><td><input type="text" data-tgf="n" data-i="').concat(k, '" value="').concat(esc(c.n || ""), '" placeholder="').concat(esc(T0[0]), '" maxlength="26" aria-label="Nombre C').concat(k + 1, '"></td><td><select data-tgf="t" data-i="').concat(k, '" aria-label="Uso">').concat(Object.keys(TG_TIPOS).map((t) => '<option value="'.concat(t, '"').concat(t === c.t ? " selected" : "", ">").concat(TG_TIPOS[t][0], "</option>")).join(""), '</select></td><td><input type="number" inputmode="numeric" min="0" step="50" data-tgf="P" data-i="').concat(k, '" value="').concat(+c.P || 0, '" aria-label="Potencia W" style="width:96px"></td><td><select data-tgf="S" data-i="').concat(k, '" aria-label="Secci\xF3n"').concat(low ? ' class="bad"' : "", ">").concat([1, 1.5, 2.5, 4, 6, 10].map((s) => '<option value="'.concat(s, '"').concat(+c.S === s ? " selected" : "", ">").concat(sStr(s), " mm\xB2</option>")).join(""), '</select></td><td class="num">').concat(nf((+c.P || 0) / V0, 1), ' A</td><td><button type="button" class="btn ghost small" data-tg="fdel" data-i="').concat(k, '" aria-label="Quitar C').concat(k + 1, '"', ">✕</button></td></tr>");
    }).join("");
    const al = [4, 6, 10, 16].map((s) => '<option value="'.concat(s, '"').concat(+f.alimS === s ? " selected" : "", ">").concat(s, " mm\xB2 (Iz ").concat(ampOf(s), " A)</option>")).join("");
    const cs = S.casa && Array.isArray(S.casa.circ) && S.casa.circ.length;
    return '<section class="card tgfree"><div class="sechead"><span class="tag">Tu proyecto</span><h2 style="margin:0">Circuitos del tablero</h2></div><p class="hint" style="margin-top:0">Define la cantidad de circuitos, su uso, la potencia y la secci\xF3n del cable. M\xEDnimos RIC N\xB004: 1,5 mm\xB2 en alumbrado y 2,5 mm\xB2 en enchufes y equipos. Con m\xE1s de 3 circuitos el tablero lleva luz piloto (RIC N\xB002, 6.2.14) y con m\xE1s de 3 por diferencial necesitas otro diferencial.</p><div class="tbl-wrap"><table class="pt tgft"><thead><tr><th></th><th>Nombre</th><th>Uso</th><th>Potencia (W)</th><th>Cable</th><th class="num">I</th><th></th></tr></thead><tbody>'.concat(rows || '<tr><td colspan="7" class="hint">A\xFAn no hay circuitos: agr\xE9galos con \xAB+ Circuito\xBB, tr\xE1elos de \xABDise\xF1ar mi vivienda\xBB o carga el \xABEjemplo\xBB.</td></tr>', '</tbody></table></div><div class="tgfopt"><label>Alimentador <select data-tgf="alimS" aria-label="Alimentador">').concat(al, '</select></label><label class="tgchk"><input type="checkbox" data-tgf="emer"').concat(f.emer ? " checked" : "", '> Luz de emergencia en el alumbrado</label><button type="button" class="btn small" data-tg="fadd"').concat(f.circ.length >= 9 ? " disabled" : "", '>+ Circuito</button>').concat(cs ? '<button type="button" class="btn ghost small" data-tg="fcasa">⬇ Usar los de \xABDise\xF1ar mi vivienda\xBB</button>' : "", '<button type="button" class="btn ghost small" data-tg="fdef">↺ Ejemplo</button></div><p class="hint" style="margin:6px 0 0">').concat(lv.circ.length, " circuito(s) \xB7 ").concat(Math.max(1, Math.ceil(lv.circ.length / 3)), " diferencial(es) m\xEDnimo \xB7 luz piloto ").concat(tgNeedPL(lv) ? "<b>obligatoria</b>" : "opcional", "</p></section>");
  }
  function tgOrder(lv, A) {
    const { req } = A, needPL = tgNeedPL(lv);
    return '<details class="item tgord" open><summary>\u{1F4CB} Orden de trabajo <span class="hint">\xB7 presupuesto '.concat(tgMoney(A.budget), '</span></summary><div class="body"><ul class="hand"><li>Arma el tablero desde cero: elige y coloca el <b>interruptor general</b>, los <b>diferenciales</b>, un <b>disyuntor por circuito</b>, los <b>peines</b> que repartan la energ\xEDa').concat(needPL ? ", la <b>luz piloto con su propio disyuntor (≤ 10 A)</b>" : "", ' y las <b>barras</b> de neutro y de tierra.</li><li>Sin puentes de cable de equipo a equipo (RIC N\xB002, 6.2.4): para alimentar varios equipos desde una protecci\xF3n usa un peine o una barra.</li><li>Alimentador de ').concat(sStr(lv.alimS), " mm\xB2 (soporta ").concat(A.g.max, " A).</li><li>Circuitos: ").concat(req.map((r, k) => "<b>C".concat(k + 1, "</b> ").concat(esc(r.n), " (").concat(n0(r.P), " W, cable ").concat(sStr(r.S), " mm\xB2)")).join(" \xB7 "), ".</li>").concat(lv.emer >= 0 ? "<li>Luz de emergencia aut\xF3noma que vigile <b>".concat(esc(req[lv.emer].n), "</b>.</li>") : "", "<li>Colores: fase rojo, negro o azul \xB7 neutro blanco \xB7 tierra verde/amarillo.</li><li>No te pases de <b>").concat(tgMoney(A.budget), "</b>. Gastado: <b>").concat(tgMoney(A.cost), "</b>.</li></ul></div></details>");
  }
  function tgHTML() {
    const lv = tgLvl(), st = tgSt(), L = tgLayout(lv, st), A = tgCheck(lv, st), shown = tgChecked === JSON.stringify(st), T0 = S.tg;
    const lvs = Object.keys(TG_LV).map((k) => [k, TG_LV[k].t]).concat([["libre", "✏ Dise\xF1o libre"]]).concat(S.sim2 && S.sim2.circuits.length ? [["sim", "Mi casa del simulador 3D"]] : []);
    const chips = '<div class="tglv" role="group" aria-label="Nivel">'.concat(lvs.map(([k, t]) => {
      const b = T0.best[k];
      return '<button type="button" data-tg="lv" data-k="'.concat(k, '" aria-pressed="').concat(T0.lv === k, '">').concat(esc(t)).concat(b ? ' <span class="tgbst">'.concat("★".repeat(b.s)).concat("☆".repeat(3 - b.s), "</span>") : "", "</button>");
    }).join(""), '</div><p class="hint" style="margin:-4px 0 10px">').concat(esc(lv.d), "</p>");
    const col = T0.col || "R", sw = (k) => '<i style="background:'.concat(TG_COL[k][1]).concat(k === "G" ? ";background-image:repeating-linear-gradient(90deg,transparent 0 6px,#E8C300 6px 10px)" : "", '"></i>');
    const busy = tgPlace || tgMove;
    const bar = '<div class="tgtool"><div class="tgcols" role="group" aria-label="Color del cable"><span class="tglab">Cable:</span>'.concat(Object.keys(TG_COL).map((k) => '<button type="button" class="tgcol" data-tg="col" data-k="'.concat(k, '" aria-pressed="').concat(col === k, '" aria-label="').concat(TG_COL[k][0], " (").concat(TG_COL[k][2], ')" title="').concat(TG_COL[k][0], " (").concat(TG_COL[k][2], ')">').concat(sw(k), '<span class="tgtxt">').concat(TG_COL[k][0], "</span></button>")).join(""), '<span class="tgcost" title="Gastado / presupuesto">\u{1F4B0} ').concat(tgMoney(A.cost), " / ").concat(tgMoney(A.budget), '</span></div><div class="tgacts"><button type="button" class="btn small" data-tg="cat" aria-pressed="').concat(tgCatOpen, '">\u{1F9F0} Piezas</button><button type="button" class="btn calc small" data-tg="check">✓ Comprobar</button><button type="button" class="btn ghost small" data-tg="hint" aria-label="Pista">\u{1F4A1}<span class="tgtxt"> Pista</span></button><button type="button" class="btn ghost small" data-tg="undo" aria-label="Deshacer" ').concat(tgHist.length ? "" : "disabled", '>↶<span class="tgtxt"> Deshacer</span></button><button type="button" class="btn ghost small" data-tg="full" aria-label="').concat(tgFull ? "Salir de pantalla completa" : "Pantalla completa", '">').concat(tgFull ? "✕ Salir" : '⛶<span class="tgtxt"> Pantalla completa</span>', "</button>").concat(busy ? '<button type="button" class="btn danger small" data-tg="x">✕ Terminar</button>' : "", '</div><div class="tgst" aria-live="polite">').concat(esc(tgStatus(lv, st, L)), "</div></div>");
    const side = !tgFull || tgPanOpen && (tgWire != null || tgDev || shown || tgCatOpen);
    return chips + (T0.lv === "libre" ? tgFreeCard(lv) : "") + tgOrder(lv, A) + '<div class="tggrid'.concat(tgFull ? " full" : "", '"><div>').concat(bar, '<div class="tgbox').concat(tgVB ? " zoomed" : "", busy ? " placing" : "", '">').concat(tgSVG(lv, st, A, shown), '<div class="tgzm"><button type="button" data-tg="zin" aria-label="Acercar">+</button><button type="button" data-tg="zout" aria-label="Alejar">−</button><button type="button" data-tg="zfit" aria-label="Ver todo el tablero" title="Ver todo">⤢</button></div></div></div><div class="tgside" ').concat(side ? "" : "hidden", ">").concat(tgPanel(lv, st, A, shown, L), "</div></div>").concat(tgTable(lv, st, A, shown));
  }
  function tgVBclamp(v, W, H) {
    const w = Math.max(W / 8, Math.min(W, v.w)), h = w * H / W;
    return { x: Math.max(-w * 0.25, Math.min(W - w * 0.75, v.x)), y: Math.max(-h * 0.25, Math.min(H - h * 0.75, v.y)), w, h };
  }
  function tgZoomBy(f, cx, cy) {
    const svg = document.querySelector("#tgwrap .tgsvg");
    if (!svg) return;
    const W = +svg.dataset.w, H = +svg.dataset.h, b = svg.viewBox.baseVal, v = { x: b.x, y: b.y, w: b.width, h: b.height }, r = svg.getBoundingClientRect(), sc = Math.max(v.w / r.width, v.h / r.height);
    let px = v.x + v.w / 2, py = v.y + v.h / 2;
    if (cx != null) {
      px = v.x + (cx - (r.left + (r.width - v.w / sc) / 2)) * sc;
      py = v.y + (cy - (r.top + (r.height - v.h / sc) / 2)) * sc;
    }
    const nw = Math.max(W / 8, Math.min(W, v.w * f)), k = nw / v.w;
    tgSetVB(svg, { x: px - (px - v.x) * k, y: py - (py - v.y) * k, w: nw, h: nw * H / W });
  }
  function tgSetVB(svg, v) {
    const W = +svg.dataset.w, H = +svg.dataset.h, c = tgVBclamp(v, W, H), fit = c.w >= W - 0.5;
    tgVB = fit ? null : c;
    const d = fit ? { x: 0, y: 0, w: W, h: H } : c;
    svg.setAttribute("viewBox", [d.x, d.y, d.w, d.h].join(" "));
    const bx = svg.closest(".tgbox");
    if (bx) bx.classList.toggle("zoomed", !fit);
  }
  {
    const P = /* @__PURE__ */ new Map();
    let pinch = 0, moved = 0;
    document.addEventListener("pointerdown", (e) => {
      if (cur !== "tg" || !e.target.closest || !e.target.closest("#tgwrap .tgsvg")) return;
      if (P.size === 0) {
        moved = 0;
        tgDragged = false;
      }
      P.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (P.size === 2) {
        const a = [...P.values()];
        pinch = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
      }
    });
    document.addEventListener("pointermove", (e) => {
      const p = P.get(e.pointerId);
      if (!p || cur !== "tg") return;
      const svg = document.querySelector("#tgwrap .tgsvg");
      if (!svg) return;
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      if (P.size === 2) {
        const a = [...P.values()], d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
        if (pinch && d) tgZoomBy(pinch / d, (a[0].x + a[1].x) / 2, (a[0].y + a[1].y) / 2);
        pinch = d;
        tgDragged = true;
        return;
      }
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved < 8 || !tgVB) return;
      tgDragged = true;
      const b = svg.viewBox.baseVal, r = svg.getBoundingClientRect(), sc = Math.max(b.width / r.width, b.height / r.height);
      tgSetVB(svg, { x: b.x - dx * sc, y: b.y - dy * sc, w: b.width, h: b.height });
    });
    const up = (e) => {
      P.delete(e.pointerId);
      if (P.size < 2) pinch = 0;
    };
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", up);
    document.addEventListener("wheel", (e) => {
      if (cur !== "tg" || !e.target.closest || !e.target.closest("#tgwrap .tgsvg") || !(e.ctrlKey || tgVB || tgFull)) return;
      e.preventDefault();
      tgZoomBy(e.deltaY > 0 ? 1.15 : 0.87, e.clientX, e.clientY);
    }, { passive: false });
  }
  function tgPSpec(id, f, v) {
    const st = tgSt(), p = tgPart(st, id);
    if (!p) return;
    const nv = f === "In" || f === "s" || f === "n" ? +v : v, sp2 = Object.assign({}, p.spec, { [f]: nv });
    if (p.k === "pn") {
      if (tgFitPn(st, p.r, p.m, +sp2.n, p.id) !== p.m) {
        tgMsg = "No cabe: ese largo choca con otro peine o sale del riel. Mu\xE9velo primero.";
        tgRender();
        return;
      }
      tgPush();
      p.spec = sp2;
      save();
      tgRender();
      return;
    }
    const w = tgWd(p.k, sp2);
    if (w !== tgWd(p.k, p.spec) && tgFit(st, p.r, p.m, w, p.id) !== p.m) {
      const s0 = tgFit(st, p.r, p.m + w - 1, w, p.id);
      if (s0 < 0) {
        tgMsg = "No hay espacio al lado para un equipo de ".concat(w, " m\xF3dulos: mu\xE9velo primero a un lugar con m\xE1s espacio.");
        tgRender();
        return;
      }
      tgPush();
      p.m = s0;
    } else tgPush();
    p.spec = sp2;
    tgPrune(st);
    save();
    tgRender();
  }
  function tgRender() {
    const w = document.getElementById("tgwrap");
    if (!w) return;
    const bx = w.querySelector(".tgbox"), sp = bx ? [bx.scrollLeft, bx.scrollTop] : null, ae = document.activeElement, fid = ae && ae.dataset && ae.dataset.tgf ? [ae.dataset.tgf, ae.dataset.i] : null;
    w.innerHTML = tgHTML();
    tgMsg = "";
    const bx2 = w.querySelector(".tgbox");
    if (bx2 && sp) {
      bx2.scrollLeft = sp[0];
      bx2.scrollTop = sp[1];
    }
    if (fid) {
      const el = w.querySelector('[data-tgf="'.concat(fid[0], '"]').concat(fid[1] != null ? '[data-i="'.concat(fid[1], '"]') : ""));
      if (el) el.focus({ preventScroll: true });
    }
  }
  function tgSetFull(on) {
    tgFull = on;
    document.body.classList.toggle("tgfsb", on);
    const w = document.getElementById("tgwrap");
    try {
      if (on && w && w.requestFullscreen && !document.fullscreenElement) w.requestFullscreen().catch(() => {
      });
      else if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {
      });
    } catch (e) {
    }
  }
  document.addEventListener("fullscreenchange", () => {
    if (cur === "tg" && tgFull && !document.fullscreenElement) {
      tgSetFull(false);
      tgRender();
    }
  });
  function tgPush() {
    const st = tgSt();
    tgHist.push(JSON.stringify(st));
    if (tgHist.length > 80) tgHist.shift();
    if (!st.t0) st.t0 = Date.now();
  }
  const tgPrune = (st) => {
    const L = tgLayout(tgLvl(), st);
    st.wires = st.wires.filter((w) => L.T[w.a] && L.T[w.b]);
  };
  function tgTerm(id) {
    const st = tgSt();
    tgWire = null;
    tgDev = null;
    tgPlace = null;
    tgMove = null;
    tgHintT = [];
    tgHintPn = null;
    tgConfirm = false;
    if (!tgSel) tgSel = id;
    else if (tgSel === id) tgSel = null;
    else if (st.wires.some((w) => w.a === tgSel && w.b === id || w.a === id && w.b === tgSel)) {
      tgMsg = "Esos dos bornes ya est\xE1n unidos con un cable.";
      tgSel = null;
    } else {
      tgPush();
      st.wires.push({ a: tgSel, b: id, c: S.tg.col || "R" });
      tgSel = null;
      save();
    }
    tgRender();
  }
  function tgSlot(r, m) {
    const st = tgSt(), lv = tgLvl();
    if (tgPlace) {
      if (tgPlace.k === "pn") {
        const n = +tgPlace.spec.n || 2, s0 = tgFitPn(st, r, m, n, null);
        if (s0 < 0) tgMsg = "No cabe ah\xED: choca con otro peine o se sale del riel.";
        else {
          tgPush();
          const id = tgNewId(st, "pn");
          st.parts.push({ id, k: "pn", r, m: s0, spec: Object.assign({}, tgPlace.spec) });
          tgMsg = "✓ ".concat(tgDN(id, lv), " puesto en el riel ").concat(r + 1, ": queda apretado en las entradas de los equipos que tiene debajo.");
          tgPlace = null;
          tgHintPn = null;
          save();
        }
      } else {
        const w = tgWd(tgPlace.k, tgPlace.spec), s0 = tgFit(st, r, m, w, null);
        if (s0 < 0) tgMsg = "No cabe ah\xED: necesita ".concat(w, " m\xF3dulos libres seguidos en el riel.");
        else {
          tgPush();
          const id = tgNewId(st, tgPlace.k);
          st.parts.push({ id, k: tgPlace.k, r, m: s0, spec: Object.assign({}, tgPlace.spec) });
          tgMsg = "✓ ".concat(tgDN(id, lv), " colocado en el riel ").concat(r + 1, ". Toca otro espacio para poner otro igual, o ✕ Terminar.");
          save();
        }
      }
    } else if (tgMove) {
      const p = tgPart(st, tgMove), s0 = p ? p.k === "pn" ? tgFitPn(st, r, m, +p.spec.n || 2, p.id) : tgFit(st, r, m, tgWd(p.k, p.spec), p.id) : -1;
      if (!p) tgMove = null;
      else if (s0 < 0) tgMsg = "No cabe ah\xED: necesita ".concat(p.k === "pn" ? p.spec.n : tgWd(p.k, p.spec), " m\xF3dulos libres seguidos.");
      else {
        tgPush();
        p.r = r;
        p.m = s0;
        tgMove = null;
        tgDev = p.id;
        save();
      }
    }
    tgRender();
  }
  function tgAutoPn(st, sp) {
    const n = +sp.n || 2, two = sp.p === "2P", A = tgCheck(tgLvl(), st), R = tgRoles(tgLvl(), st, A), m = R.miss.find((x) => x[0] === "pn" && x[4] && (x[2].p === "2P") === two);
    if (m && tgFitPn(st, m[4].r, m[4].m, n, null) === m[4].m) return [m[4].r, m[4].m];
    for (let r = 0; r < TG_RAILS; r++) {
      const o = tgOcc(st, null), op = tgOccPn(st, null);
      for (let k = 0; k + n <= TG_MODS; k++) {
        if (o[r][k] && (k === 0 || o[r][k - 1] !== o[r][k]) && op[r].slice(k, k + n).every((x) => !x)) return [r, k];
      }
    }
    return null;
  }
  function pgTG() {
    tgInit();
    return '<p class="eyebrow">Juego did\xE1ctico \xB7 RIC N\xB002, N\xB004, N\xB005 y N\xB010</p><h1>Armar y cablear el tablero</h1>\n  <p class="lead">El tablero parte vac\xEDo. T\xFA eliges cada protecci\xF3n en la caja de piezas (general, diferenciales, disyuntores, peines, luz piloto y barras), la colocas donde quieras en los rieles y conectas cada fase, neutro y tierra hasta las salidas. Los cables se ordenan solos por las canaletas. \xABComprobar\xBB energiza el tablero y te dice qu\xE9 est\xE1 mal y por qu\xE9, seg\xFAn el RIC.</p>\n  <div id="tgwrap">'.concat(tgHTML(), "</div>\n  ").concat(learn("C\xF3mo se arma y cablea un tablero domiciliario (RIC N\xB002)", "".concat(ILL.tablero(), '<ol class="hand"><li><b>Elegir:</b> general de 2 polos curva C con amperaje entre la demanda y lo que soporta el alimentador; diferenciales de 30 mA clase A con calibre ≥ general (m\xE1ximo 3 circuitos cada uno); un disyuntor por circuito con In ≥ 1,1 \xD7 I y ≤ Iz del cable (curva B alumbrado, C enchufes).</li><li><b>Sin puentes de cable de equipo a equipo</b> (RIC N\xB002, 6.2.4). Se acepta un cable de una termomagn\xE9tica a <i>un</i> diferencial. Si el general alimenta varios equipos, o un diferencial varios disyuntores, se usa un <b>peine de conexi\xF3n</b> (barra prefabricada que se aprieta en las entradas) o una barra de distribuci\xF3n, alimentados con un solo cable. Los peines van con todos sus accesorios: dientes sobrantes cortados o tapados (6.2.4.3).</li><li><b>Luz piloto:</b> obligatoria en tableros de m\xE1s de 3 circuitos (6.2.14), alimentada desde un circuito propio con protecci\xF3n de 10 A como m\xE1ximo (6.2.15).</li><li><b>Llegada → general:</b> fase y neutro del alimentador entran por arriba del general.</li><li><b>Neutro:</b> la salida N de cada diferencial va a su propia barra de neutro; de ah\xED sale el neutro de cada circuito de ese diferencial. Nunca se mezclan neutros de distintos diferenciales.</li><li><b>Tierra:</b> el conductor del electrodo llega a la barra de tierra y de ella sale la tierra de cada circuito. No pasa por protecciones y no se une al neutro.</li><li><b>Orden:</b> los cables van por canaletas, en l\xEDneas rectas, sin cruzar el frente de los equipos. Con 8 circuitos o m\xE1s las canaletas son obligatorias (6.1.16.1) y las salidas van a regletas (6.2.12).</li><li><b>Reserva:</b> deja 25 % de espacio libre en rieles y barras (6.1.16.3).</li><li><b>Colores:</b> fase rojo, negro o azul; neutro blanco; tierra verde/amarillo. M\xE1ximo 2 cables por borne.</li></ol>').concat(ILL.colores())));
  }
  document.addEventListener("click", (e) => {
    if (cur !== "tg") return;
    const el = e.target.closest && e.target.closest("[data-tgslot],[data-tgt],[data-tgw],[data-tgd],[data-tg]");
    if (!el) return;
    if (tgDragged && el.closest(".tgsvg")) {
      tgDragged = false;
      return;
    }
    tgDragged = false;
    const lv = tgLvl(), st = tgSt();
    tgPanOpen = true;
    if (el.dataset.tgslot) {
      const [r, m] = el.dataset.tgslot.split(":").map(Number);
      tgSlot(r, m);
      return;
    }
    if (el.dataset.tgt) {
      tgTerm(el.dataset.tgt);
      return;
    }
    if (el.dataset.tgw != null) {
      tgWire = tgWire === +el.dataset.tgw ? null : +el.dataset.tgw;
      tgSel = tgDev = tgPlace = tgMove = null;
      tgRender();
      return;
    }
    if (el.dataset.tgd) {
      if (tgPlace || tgMove) tgMsg = "Ese lugar est\xE1 ocupado: toca un espacio verde.";
      else {
        tgDev = tgDev === el.dataset.tgd ? null : el.dataset.tgd;
        tgSel = null;
        tgWire = null;
      }
      tgRender();
      if (tgDev && window.innerWidth < 900 && !tgFull) {
        const p = document.querySelector(".tgsel");
        if (p) p.scrollIntoView({ block: "nearest" });
      }
      return;
    }
    const a = el.dataset.tg;
    if (a !== "reset") tgConfirm = false;
    if (a === "col") {
      S.tg.col = el.dataset.k;
      save();
    } else if (a === "x") {
      tgSel = tgWire = tgDev = tgPlace = tgMove = null;
    } else if (a === "zin" || a === "zout") {
      tgZoomBy(a === "zin" ? 0.7 : 1 / 0.7);
      return;
    } else if (a === "zfit") tgVB = null;
    else if (a === "cspec") {
      const c = S.tg.cat, sp = c[c.k] || (c[c.k] = {}), f = el.dataset.f;
      sp[f] = f === "In" || f === "s" || f === "n" ? +el.dataset.v : el.dataset.v;
      save();
    } else if (a === "pspec" && tgDev) {
      tgPSpec(tgDev, el.dataset.f, el.dataset.v);
      return;
    } else if ((a === "autoplace" || a === "place") && tgNeedMsg()) {
      return;
    } else if (a === "autoplace") {
      tgNeed = false;
      const k = S.tg.cat.k, sp = Object.assign({}, S.tg.cat[k] || {});
      if (TG_SPEC[k].every(([f]) => sp[f] != null && sp[f] !== "")) {
        let at = null;
        if (k === "pn") at = tgAutoPn(st, sp);
        else {
          const w = tgWd(k, sp), r0 = k === "tm" ? 1 : k === "bn" || k === "pe" || k === "bf" || k === "rp" ? 2 : 0;
          for (let i = 0; i < TG_RAILS && !at; i++) {
            const r = (r0 + i) % TG_RAILS, o = tgOcc(st, null);
            for (let m = 0; m + w <= TG_MODS && !at; m++) if (o[r].slice(m, m + w).every((x) => !x)) at = [r, m];
          }
        }
        if (!at) tgMsg = k === "pn" ? "No encontr\xE9 equipos seguidos sin peine: elige el lugar a mano." : "No queda espacio en los rieles: quita o mueve piezas.";
        else {
          tgPush();
          const id = tgNewId(st, k);
          st.parts.push({ id, k, r: at[0], m: at[1], spec: sp });
          tgHintPn = null;
          tgMsg = "✓ ".concat(tgDN(id, lv), /^(Barra|Luz)/.test(tgDN(id, lv)) ? " puesta en el riel " : " puesto en el riel ").concat(at[0] + 1, ". Si quieres otro lugar, t\xF3calo y usa ↔ Mover.");
          save();
        }
      }
    } else if (a === "tosim") {
      tgToSim();
      return;
    } else if (a === "full") tgSetFull(!tgFull);
    else if (a === "pclose") {
      tgPanOpen = false;
      tgCatOpen = false;
    } else if (a === "cat") {
      tgCatOpen = !tgCatOpen;
      tgPlace = tgMove = null;
      tgRender();
      const c = document.getElementById("tgcat");
      if (tgCatOpen && c && !tgFull) c.scrollIntoView({ block: "nearest" });
      return;
    } else if (a === "catk") S.tg.cat.k = el.dataset.k;
    else if (a === "place") {
      tgNeed = false;
      const k = S.tg.cat.k, sp = Object.assign({}, S.tg.cat[k] || {});
      if (TG_SPEC[k].every(([f]) => sp[f] != null && sp[f] !== "")) {
        tgPlace = { k, spec: sp };
        tgSel = tgWire = tgDev = tgMove = null;
        if (tgFull) tgCatOpen = false;
        tgRender();
        const b = document.querySelector(".tgtool");
        if (b && !tgFull) b.scrollIntoView({ block: "start" });
        return;
      }
    } else if (a === "lv") {
      S.tg.lv = el.dataset.k;
      tgSel = tgWire = tgDev = tgPlace = tgMove = null;
      tgHintT = [];
      tgHintPn = null;
      tgHist = [];
      tgChecked = null;
      save();
    } else if (a === "fadd" && S.tg.free.circ.length < 9) {
      S.tg.free.circ.push({ n: "", t: "enchufes", P: 2e3, S: 2.5 });
      save();
    } else if (a === "fdel" && S.tg.free.circ.length > 0) {
      tgPush();
      S.tg.free.circ.splice(+el.dataset.i, 1);
      tgPrune(st);
      save();
    } else if (a === "fdef") {
      S.tg.free = tgFreeDef(true);
      tgPrune(st);
      save();
    } else if (a === "fcasa" && S.casa && Array.isArray(S.casa.circ)) {
      S.tg.free.circ = S.casa.circ.slice(0, 9).map((c) => ({ n: c.n, t: c.t, P: Math.round(+c.P || 0), S: +c.S || 2.5 }));
      S.tg.free.emer = S.tg.free.circ.some((c) => c.t === "alumbrado");
      tgPrune(st);
      save();
    } else if (a === "wcol" && st.wires[tgWire]) {
      tgPush();
      st.wires[tgWire].c = el.dataset.k;
      save();
    } else if (a === "wdel" && st.wires[tgWire]) {
      tgPush();
      st.wires.splice(tgWire, 1);
      tgWire = null;
      save();
    } else if (a === "move" && tgDev) {
      tgMove = tgDev;
      tgPlace = null;
    } else if (a === "dup" && tgDev) {
      const p = tgPart(st, tgDev);
      if (p) {
        S.tg.cat.k = p.k;
        S.tg.cat[p.k] = Object.assign({}, p.spec);
        tgPlace = { k: p.k, spec: Object.assign({}, p.spec) };
        tgDev = null;
      }
    } else if (a === "pdel" && tgDev) {
      tgPush();
      const id = tgDev;
      st.parts = st.parts.filter((p) => p.id !== id);
      st.wires = st.wires.filter((w) => w.a !== id && w.b !== id && !w.a.startsWith(id + ".") && !w.b.startsWith(id + "."));
      tgMsg = "".concat(tgDN(id, lv), " quitado junto con sus cables.");
      tgDev = null;
      save();
    } else if (a === "undo") {
      if (tgHist.length) {
        S.tg.st[S.tg.lv] = JSON.parse(tgHist.pop());
        tgSel = tgWire = tgDev = tgPlace = tgMove = null;
        save();
      }
    } else if (a === "hint") {
      const hx = tgHintOf(lv, st);
      tgHintT = hx.t || [];
      tgSel = tgWire = tgPlace = tgMove = null;
      tgDev = hx.dev || null;
      if (hx.cat) {
        S.tg.cat.k = hx.cat;
        if (hx.spec) S.tg.cat[hx.cat] = Object.assign({}, S.tg.cat[hx.cat] || {}, hx.spec);
        tgCatOpen = true;
      }
      tgMsg = hx.msg;
    } else if (a === "sol") {
      tgPush();
      const so = tgFresh(lv, "1P");
      st.parts = so.parts;
      st.wires = so.wires;
      tgSel = tgWire = tgDev = tgPlace = tgMove = null;
      tgHintT = [];
      tgHintPn = null;
      tgMsg = "Soluci\xF3n cargada: f\xEDjate en las piezas elegidas, en los peines y en el recorrido de cada color. \xAB↶\xBB vuelve a tu tablero.";
      save();
    } else if (a === "reset") {
      if (!tgConfirm) tgConfirm = true;
      else {
        tgConfirm = false;
        tgPush();
        st.parts = [];
        st.wires = [];
        st.t0 = 0;
        tgSel = tgWire = tgDev = tgPlace = tgMove = null;
        tgHintT = [];
        tgHintPn = null;
        tgChecked = null;
        save();
      }
    } else if (a === "check") {
      tgSel = tgWire = tgPlace = tgMove = null;
      tgHintT = [];
      tgHintPn = null;
      tgChecked = JSON.stringify(st);
      tgCheckT = Date.now();
      const A = tgCheck(lv, st), s0 = A.errs.length ? 1 : A.warns.length ? 2 : 3, secs = st.t0 ? Math.round((tgCheckT - st.t0) / 1e3) : 0, b = S.tg.best[S.tg.lv];
      if (!A.errs.length && (!b || s0 > b.s || s0 === b.s && secs < b.t)) {
        S.tg.best[S.tg.lv] = { s: s0, t: secs, c: A.cost };
        save();
      }
      tgRender();
      const r = document.getElementById("tgres");
      if (r && window.innerWidth < 900 && !tgFull) r.scrollIntoView({ block: "start" });
      return;
    }
    tgRender();
  });
  document.addEventListener("change", (e) => {
    if (cur !== "tg") return;
    const el = e.target;
    if (!el.dataset) return;
    if (el.dataset.tgf) {
      const f = S.tg.free, k = el.dataset.tgf, i = +el.dataset.i;
      if (k === "alimS") f.alimS = +el.value;
      else if (k === "emer") f.emer = el.checked;
      else if (f.circ[i]) {
        const c = f.circ[i];
        if (k === "n") c.n = el.value.slice(0, 26);
        else if (k === "t") {
          c.t = el.value;
          const T0 = TG_TIPOS[c.t] || TG_TIPOS.otro;
          if ((+c.S || 0) < T0[3]) c.S = T0[3];
        } else if (k === "P") c.P = Math.max(0, Math.min(2e4, +String(el.value).replace(",", ".") || 0));
        else if (k === "S") c.S = +el.value;
      }
      tgPrune(tgSt());
      save();
      tgRender();
      return;
    }
  });
  document.addEventListener("keydown", (e) => {
    if (cur !== "tg" || e.key !== "Enter" && e.key !== " ") return;
    const el = e.target.closest && e.target.closest("[data-tgt],[data-tgw],[data-tgd]");
    if (!el) return;
    e.preventDefault();
    el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
