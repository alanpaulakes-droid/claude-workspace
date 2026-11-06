  const PAN_HOUSE = { n: "Panel de pr\xE1ctica", tx: 0.75, panel: true, we: 0.08, wi: 0.08, rooms: [{ id: "pan", n: "Panel de pr\xE1ctica", t: "otro", x0: 0, x1: 4.8, z0: 0, z1: 1.2 }], doors: [], open: [] };
  const PAN_EX = [["c912", "Centro con interruptor 9/12", { c912: 1 }], ["enc", "Enchufes", { enc: 2 }], ["c915", "Dos centros con 9/15", { c915: 1 }], ["c924", "Escalera con dos 9/24", { c924: 1 }], ["c932", "Tres centros con 9/32", { c932: 1 }], ["full", "Pr\xE1ctica completa (como en taller)", { c912: 2, c915: 1, c924: 1, enc: 4 }]];
  const PAN_REQ = [["c912", "Centro de luz con interruptor 9/12", "\u{1F4A1}"], ["c915", "Dos centros con interruptor 9/15", "\u{1F4A1}\u{1F4A1}"], ["c924", "Centro con dos interruptores 9/24 (escalera)", "⇄"], ["c932", "Tres centros con interruptor 9/32", "\u{1F4A1}\u{1F4A1}\u{1F4A1}"], ["enc", "Enchufe 2P+T 10/16 A", "⏻"]];
  const isPan = (s) => !!(s && s.house && s.house.panel);
  function panBlank() {
    const s = sim2Blank();
    s.house = JSON.parse(JSON.stringify(PAN_HOUSE));
    s.inst = "vista";
    s.duct = "pvc";
    s.scope = [];
    s.alim = { S: 6, L: 5 };
    s.reg = [];
    s.pan = { ex: "full", req: Object.assign({}, PAN_EX.find((x) => x[0] === "full")[2]), fix: "ask" };
    return s;
  }
  function panCount(s) {
    const by = new Map(s.items.map((i) => [i.id, i])), L = s.items.filter((i) => i.t === "lamp"), sv = (id) => by.get(id) || {};
    const c924 = L.filter((l) => l.sw != null && l.sw2 != null && sv(l.sw).v === "c" && sv(l.sw2).v === "c").length;
    const c915 = s.items.filter((w) => w.t === "sw" && w.v === "d" && L.some((l) => l.sw === w.id && (l.k || 0) === 0) && L.some((l) => l.sw === w.id && l.k === 1)).length;
    const c912 = L.filter((l) => l.sw != null && l.sw2 == null && !["c", "d", "t"].includes(sv(l.sw).v)).length;
    const c932 = s.items.filter((w) => w.t === "sw" && w.v === "t" && [0, 1, 2].every((k) => L.some((l) => l.sw === w.id && (l.k || 0) === k))).length;
    const enc = s.items.filter((i) => i.t === "out" && i.v !== "dat").length;
    return { c912, c915, c924, c932, enc };
  }
  function panTest(s0) {
    const s = JSON.parse(JSON.stringify(s0)), R = [];
    s.gen.on = true;
    s.drOff = {};
    s.fault = null;
    s.circuits.forEach((c) => c.on = true);
    const by = (id) => s.items.find((i) => i.id === id), on = (l) => !!simEval(s).act(l);
    s.items.filter((i) => i.t === "lamp").forEach((l) => {
      const a = by(l.sw), b = l.sw2 != null ? by(l.sw2) : null;
      let ok = false, how = "";
      if (!a) how = "no tiene interruptor";
      else if (a.v === "c" && b && b.v === "c") {
        a.on = false;
        b.on = false;
        const r0 = on(l);
        a.on = true;
        const r1 = on(l);
        b.on = true;
        const r2 = on(l);
        ok = r0 !== r1 && r1 !== r2;
        how = "9/24: " + [r0, r1, r2].map((x) => x ? "ON" : "OFF").join(" → ");
      } else if (a.v === "d" || a.v === "t") {
        const key = ["on", "on2", "on3"][l.k || 0];
        a.on = false;
        a.on2 = false;
        a.on3 = false;
        const r0 = on(l);
        a[key] = true;
        const r1 = on(l);
        ok = !r0 && r1;
        how = (a.v === "t" ? "9/32" : "9/15") + " tecla " + ((l.k || 0) + 1) + ": " + (r0 ? "ON" : "OFF") + " → " + (r1 ? "ON" : "OFF");
      } else {
        a.on = false;
        const r0 = on(l);
        a.on = true;
        const r1 = on(l);
        ok = !r0 && r1;
        how = "interruptor abierto " + (r0 ? "ON" : "OFF") + " \xB7 cerrado " + (r1 ? "ON" : "OFF");
      }
      R.push({ t: l.name + " (" + (s.circuits.find((c) => c.id === l.c) || {}).n + ")", d: how, ok });
    });
    s.items.filter((i) => i.t === "out" && i.v !== "dat").forEach((o) => {
      o.on = true;
      o.a = o.a && o.a !== "none" ? o.a : "tv";
      const ev = simEval(s), c = s.circuits.find((x) => x.id === o.c) || {}, V = ev.V ? ev.V[o.id] || 0 : 0, ok = ev.act(o) && V > 190 && c.pe !== false;
      R.push({ t: o.name, d: "Tensi\xF3n " + n0(V) + " V \xB7 tierra " + (c.pe === false ? "cortada" : "conectada") + " \xB7 " + (c.dr !== "none" ? "con diferencial " + c.dr : "sin diferencial"), ok: ok && c.dr !== "none" });
      o.on = false;
    });
    const E0 = simInspect(s0).filter((o) => !o.fault), E = E0.filter((o) => !/: sin puntos$/.test(o.t)), A = E0.filter((o) => /: sin puntos$/.test(o.t));
    return { R, E, A, ok: R.length > 0 && R.every((r) => r.ok) && !E.length };
  }
  function panFixes(s) {
    const F = [], ev = simEval(s), cBy = (id) => s.circuits.find((c) => c.id === id), nextS = (In) => SECC.find((x) => ampOf(x) >= In) || 6;
    simErrs(s).forEach((o) => {
      const c = o.cid != null ? cBy(o.cid) : null, t = o.t, it = o.id != null ? s.items.find((i) => i.id === o.id) : null;
      let f = null;
      if (c && /tierra \(PE\) sin conectar/.test(t)) f = () => c.pe = true;
      else if (c && /neutro (conectado a la barra general|sin conectar)/.test(t)) f = () => c.nc = "dr";
      else if (c && /: sin diferencial/.test(t)) f = () => {
        const d = simDRs(s).find((x) => s.circuits.filter((q) => q.dr === x).length < 3) || "DR" + (simDRs(s).length + 1);
        c.dr = d;
        c.ds = 30;
        c.cl = "A";
        c.nc = "dr";
      };
      else if (c && /secci\xF3n bajo el m\xEDnimo/.test(t)) f = () => c.S = s.items.some((i) => i.c === c.id && (i.t === "out" || i.t === "horno")) ? Math.max(2.5, +c.S) : Math.max(1.5, +c.S);
      else if (c && /tramo hacia .* (bajo el m\xEDnimo|m\xE1s delgado)/.test(t) && it) f = () => delete it.S;
      else if (c && /autom\xE1tico chico/.test(t)) f = () => {
        const x = ev.cs[cIdx(s, c.id)], P = x.Ip * V0, hor = s.items.some((i) => i.c === c.id && i.t === "horno"), In = chooseIn(P / V0, P, V0, 1, hor ? 16 : 0);
        if (In) c.In = In;
        if (ampOf(c.S) < c.In) c.S = nextS(c.In);
      };
      else if (c && /el cable soporta menos que el autom\xE1tico|cable insuficiente a/.test(t)) f = () => c.S = nextS(+c.In / fTemp(s.ta || 30));
      else if (c && /curva B con enchufes/.test(t)) f = () => c.cv = "C";
      else if (c && /diferencial de \d+ mA/.test(t)) f = () => c.ds = 30;
      else if (c && /diferencial clase AC/.test(t)) f = () => c.cl = "A";
      else if (it && it.free && / sin conectar$/.test(t)) f = () => {
        const bx = s.items.filter((b) => b.t === "box" && b.c === it.c && b.id !== it.id && !b.free).sort((a, b) => Math.hypot(a.p[0] - it.p[0], a.p[1] - it.p[1]) - Math.hypot(b.p[0] - it.p[0], b.p[1] - it.p[1]))[0];
        it.free = false;
        it.par = bx ? bx.id : null;
      };
      else if (it && it.t === "lamp" && / sin interruptor$/.test(t)) {
        const w = s.items.filter((x) => x.t === "sw" && x.c === it.c && !["c", "d"].includes(x.v)).sort((a, b) => Math.hypot(a.p[0] - it.p[0], a.p[1] - it.p[1]) - Math.hypot(b.p[0] - it.p[0], b.p[1] - it.p[1]))[0];
        if (w) f = () => it.sw = w.id;
      } else if (c && /tramos salen del tablero/.test(t)) f = () => {
        const roots = s.items.filter((i) => i.c === c.id && i.par == null && !i.free);
        let hub = roots.find((i) => i.t === "box");
        if (!hub) {
          const zf = WTE / 2 + 6e-3, x0 = Math.min(...roots.map((i) => i.p[0]));
          hub = s.items.find((i) => i.id === simAddItem(s, "box", c.id, [Math.max(TX + tabW(s) / 2 + 0.25, x0 - 0.2), 2.15, zf], [0, 0, 1], { par: null }));
        }
        roots.forEach((i) => {
          if (i !== hub) i.par = hub.id;
        });
      };
      else if (/Tablero sin regleta|Regleta de (neutro|tierra) con pocos bornes/.test(t)) f = () => regAuto(s);
      else if (/General menor a 25 A/.test(t)) f = () => s.gen.In = 25;
      else if (/General insuficiente/.test(t)) f = () => s.gen.In = nextCom(Math.max(25, ev.Idm)) || 63;
      else if (/Alimentador bajo 4/.test(t)) f = () => s.alim.S = 6;
      else if (/^(Empalme|Uni\xF3n|Caja|Regleta|Falta)|empalme|regleta/i.test(t) && s.wm === "man") f = () => s.items.filter((b) => b.t === "box").forEach((b) => s.emp[b.id] = boxExpected(s, b));
      if (f) F.push({ t, f });
    });
    return F;
  }
  function regAuto(s) {
    const nd = regNeed(s), sz = (n) => [4, 7, 12, 15].find((x) => x >= n) || 15;
    if (!Array.isArray(s.reg)) s.reg = regOf(s).map((r) => Object.assign({}, r));
    ["N", "PE"].forEach((t) => {
      const h = regHave(s, t);
      if (h < nd[t]) {
        s.reg = s.reg.filter((r) => r.t !== t);
        s.reg.push({ t, n: sz(nd[t]) });
      }
    });
  }
  function panApply(s, F) {
    const done = [];
    F.forEach((x) => {
      try {
        x.f();
        done.push(x.t);
      } catch (e) {
      }
    });
    return done;
  }
  function panAuto(s) {
    const q = s.pan.req || {}, have = panCount(s), zf = WTE / 2 + 6e-3, msgs = [], C = (n, In, cv, Sx) => {
      const al = n === "Alumbrado";
      let c = s.circuits.find((x) => x.n === n) || s.circuits.find((x) => al ? /alumbr|luz|ilumin/i.test(x.n || "") : /enchuf/i.test(x.n || "")) || s.circuits.find((x) => al ? x.cv === "B" && +x.S <= 1.5 : x.cv === "C" && +x.S >= 2.5 && !/horno|cocina|clima|emerg/i.test(x.n || ""));
      if (!c) {
        const drs = simDRs(s), d = drs.find((x) => s.circuits.filter((y) => y.dr === x).length < 3) || "DR" + (drs.length + 1);
        c = { id: s.nid++, n, In, cv, pc: 6, S: Sx, dr: d, ds: 30, cl: "A", nc: "dr", pe: true, on: true };
        s.circuits.push(c);
      }
      return c.id;
    };
    const need = { c912: Math.max(0, (+q.c912 || 0) - have.c912), c915: Math.max(0, (+q.c915 || 0) - have.c915), c924: Math.max(0, (+q.c924 || 0) - have.c924), c932: Math.max(0, (+q.c932 || 0) - have.c932), enc: Math.max(0, (+q.enc || 0) - have.enc) };
    if (!need.c912 && !need.c915 && !need.c924 && !need.c932 && !need.enc) return ["Ya est\xE1 todo lo pedido en el panel."];
    const x0 = TX + tabW(s) / 2 + 0.35, xMax = HW - 0.2, occ = (y0, y1) => Math.max(x0, ...s.items.filter((i) => i.p[1] >= y0 && i.p[1] <= y1).map((i) => i.p[0] + 0.3));
    let xL = occ(1, 2.4), xE = occ(0.2, 1.05), lastL = s.items.filter((i) => i.t === "box" && i.p[1] > 1.6).map((b) => b.id).pop(), lastE = s.items.filter((i) => i.t === "box" && i.p[1] <= 1.6).map((b) => b.id).pop();
    const A = (t, cid, x, y, o) => simAddItem(s, t, cid, [Math.round(x * 100) / 100, y, zf], [0, 0, 1], o);
    const cl = need.c912 + need.c915 + need.c924 + need.c932 ? C("Alumbrado", 10, "B", 1.5) : null, ce = need.enc ? C("Enchufes", 16, "C", 2.5) : null;
    const box = (cid, x, y, last) => A("box", cid, x, y, { par: last != null && s.items.some((b) => b.id === last && b.c === cid) ? last : null });
    let placed = 0, full = false;
    const grp = (w, fn) => {
      if (xL + w > xMax) {
        full = true;
        return;
      }
      const bx = box(cl, xL + w / 2, 2.2, lastL);
      lastL = bx;
      fn(bx, xL + w / 2);
      xL += w + 0.05;
      placed++;
    };
    for (let i = 0; i < need.c912; i++) grp(0.45, (bx, cx) => {
      const w = A("sw", cl, cx - 0.12, 1.15, { par: bx });
      A("lamp", cl, cx + 0.12, 1.65, { par: bx, sw: w, v: "pm" });
    });
    for (let i = 0; i < need.c915; i++) grp(0.7, (bx, cx) => {
      const w = A("sw", cl, cx, 1.15, { par: bx, v: "d" });
      A("lamp", cl, cx - 0.2, 1.65, { par: bx, sw: w, k: 0, v: "pm" });
      A("lamp", cl, cx + 0.2, 1.65, { par: bx, sw: w, k: 1, v: "pm" });
    });
    for (let i = 0; i < need.c932; i++) grp(0.95, (bx, cx) => {
      const w = A("sw", cl, cx, 1.15, { par: bx, v: "t" });
      [-0.32, 0, 0.32].forEach((o, k) => A("lamp", cl, cx + o, 1.65, { par: bx, sw: w, k, v: "pm" }));
    });
    for (let i = 0; i < need.c924; i++) grp(0.9, (bx, cx) => {
      const a = A("sw", cl, cx - 0.3, 1.15, { par: bx, v: "c" }), b = A("sw", cl, cx + 0.3, 1.15, { par: bx, v: "c" });
      A("lamp", cl, cx, 1.65, { par: bx, sw: a, sw2: b, v: "pm" });
    });
    for (let i = 0; i < need.enc; i++) {
      if (xE + 0.35 > xMax) {
        full = true;
        break;
      }
      const bx = box(ce, xE + 0.17, 0.95, lastE);
      lastE = bx;
      A("out", ce, xE + 0.17, 0.45, { par: bx });
      xE += 0.4;
      placed++;
    }
    if (s.wm === "man") s.items.filter((b) => b.t === "box").forEach((b) => s.emp[b.id] = boxExpected(s, b));
    regAuto(s);
    msgs.push(placed + " grupo(s) agregado(s) con su caja de derivaci\xF3n, cableado y protecci\xF3n" + (cl ? " \xB7 circuito Alumbrado 10 A B 1,5 mm\xB2" : "") + (ce ? " \xB7 circuito Enchufes 16 A C 2,5 mm\xB2" : "") + ".");
    if (full) msgs.push("No cupo todo en el panel: quita elementos o pide menos puntos.");
    return msgs;
  }
  function panElevSVG(s) {
    const ev = simEval(s), K = 170, M = 50, Wd = HW * K + 2 * M, Hd = WH * K + 2 * M + 40, X = (x) => M + x * K, Y = (y) => M + (WH - y) * K, W = tabW(s);
    let g = '<rect width="' + Wd + '" height="' + Hd + '" fill="#fff"/><text x="' + M + '" y="26" font-size="14" font-weight="800">PLANO DE LA PARED DE PR\xC1CTICA (VISTA FRONTAL)</text>';
    g += '<rect x="' + X(0) + '" y="' + Y(WH) + '" width="' + HW * K + '" height="' + WH * K + '" fill="#f3e3c8" stroke="#8a6a3a" stroke-width="2"/>';
    g += '<rect x="' + X(TX - W / 2) + '" y="' + Y(1.975) + '" width="' + W * K + '" height="' + 0.95 * K + '" fill="#e6eaee" stroke="#333" stroke-width="2"/><text x="' + X(TX) + '" y="' + (Y(1.5) + 5) + '" text-anchor="middle" font-size="13" font-weight="800">TABLERO</text><text x="' + X(TX) + '" y="' + (Y(1.5) + 22) + '" text-anchor="middle" font-size="10">General ' + s.gen.In + " A \xB7 " + s.circuits.length + " circuito(s)</text>";
    ev.E.forEach((e) => {
      const col = CCOL[e.ci % CCOL.length];
      g += '<polyline points="' + e.pts.map((q) => X(q[0]).toFixed(1) + "," + Y(q[1]).toFixed(1)).join(" ") + '" fill="none" stroke="#e8661c" stroke-width="7" stroke-linejoin="round" opacity=".85"/><polyline points="' + e.pts.map((q) => X(q[0]).toFixed(1) + "," + Y(q[1]).toFixed(1)).join(" ") + '" fill="none" stroke="' + col + '" stroke-width="1.6" stroke-dasharray="5 3"/>';
    });
    s.items.forEach((it) => {
      const x = X(it.p[0]), y = Y(it.p[1]), col = CCOL[cIdx(s, it.c) % CCOL.length];
      let sym;
      if (it.t === "box") sym = '<rect x="-9" y="-9" width="18" height="18" fill="#fff" stroke="' + col + '" stroke-width="2"/><line x1="-9" y1="-9" x2="9" y2="9" stroke="' + col + '" stroke-width="1.5"/>';
      else if (it.t === "lamp" || it.t === "sw" || it.t === "out") sym = '<g transform="scale(1.4)">' + varSym(it.t, it.v || "s", col) + "</g>";
      else sym = '<rect x="-10" y="-8" width="20" height="16" fill="#fff" stroke="' + col + '" stroke-width="2"/>';
      g += '<g transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ')">' + sym + '</g><text x="' + (x + 14) + '" y="' + (y - 10) + '" font-size="9.5" font-weight="700">' + esc(it.name) + '</text><text x="' + (x + 14) + '" y="' + (y + 2) + '" font-size="8.5" fill="#555">h = ' + nf(it.p[1], 2) + " m</text>";
    });
    g += '<line x1="' + X(0) + '" y1="' + (Y(0) + 22) + '" x2="' + X(HW) + '" y2="' + (Y(0) + 22) + '" stroke="#555" marker-start="url(#ea)" marker-end="url(#ea)"/><text x="' + X(HW / 2) + '" y="' + (Y(0) + 38) + '" text-anchor="middle" font-size="11">' + nf(HW, 2) + ' m</text><line x1="' + (X(0) - 22) + '" y1="' + Y(0) + '" x2="' + (X(0) - 22) + '" y2="' + Y(WH) + '" stroke="#555" marker-start="url(#ea)" marker-end="url(#ea)"/><text transform="translate(' + (X(0) - 28) + " " + Y(WH / 2) + ') rotate(-90)" text-anchor="middle" font-size="11">' + nf(WH, 2) + " m</text>";
    g += '<text x="' + M + '" y="' + (Hd - 8) + '" font-size="9.5" fill="#555">Tubo PVC naranjo a la vista \xB7 l\xEDnea de color = circuito \xB7 alturas sobre el piso \xB7 escala gr\xE1fica 1 m = ' + K + " px</text>";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + Wd + " " + Hd + '" font-family="Arial,Helvetica,sans-serif" role="img" aria-label="Plano de la pared de pr\xE1ctica"><defs><marker id="ea" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#555"/></marker></defs>' + g + "</svg>";
  }
  function panMultiSVG(s) {
    const by = new Map(s.items.map((i) => [i.id, i])), RED = "#c62828", BLU = "#1565c0", GRN = "#2e7d32", ink = "#222";
    const L = (x1, y1, x2, y2, c, w, d) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || ink) + '" stroke-width="' + (w || 1.6) + '"' + (d ? ' stroke-dasharray="' + d + '"' : "") + "/>";
    const Tt = (x, y, t, sz, a, w) => '<text x="' + x + '" y="' + y + '" font-size="' + (sz || 9) + '" text-anchor="' + (a || "middle") + '" font-weight="' + (w || 400) + '" fill="' + ink + '">' + esc(t) + "</text>";
    const lampS = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="9" fill="#fff" stroke="' + ink + '" stroke-width="1.6"/><path d="M' + (x - 6.4) + " " + (y - 6.4) + "L" + (x + 6.4) + " " + (y + 6.4) + "M" + (x + 6.4) + " " + (y - 6.4) + "L" + (x - 6.4) + " " + (y + 6.4) + '" stroke="' + ink + '" stroke-width="1.4"/>';
    const sw = (x, y) => L(x, y, x + 9, y + 16, ink, 1.8) + '<circle cx="' + x + '" cy="' + y + '" r="2" fill="' + ink + '"/><circle cx="' + x + '" cy="' + (y + 20) + '" r="2" fill="' + ink + '"/>';
    const blocks = [];
    s.circuits.forEach((c, k) => {
      const its = s.items.filter((i) => i.c === c.id), D = [], usedL = new Set();
      its.filter((i) => i.t === "sw" && i.v === "c").forEach((a) => {
        const l = its.find((x) => x.t === "lamp" && x.sw === a.id && x.sw2 != null);
        if (l) {
          D.push({ k: "924", a, b: by.get(l.sw2), l: [l], w: 120 });
          usedL.add(l.id);
        }
      });
      its.filter((i) => i.t === "sw" && i.v !== "c").forEach((w) => {
        const ls = its.filter((l) => l.t === "lamp" && l.sw === w.id && !usedL.has(l.id));
        ls.forEach((l) => usedL.add(l.id));
        if (ls.length) D.push({ k: w.v === "d" || w.v === "t" ? "915" : "912", a: w, l: ls.sort((p, q) => (p.k || 0) - (q.k || 0)), w: Math.max(80, ls.length * 46 + 34) });
      });
      its.filter((l) => l.t === "lamp" && !usedL.has(l.id)).forEach((l) => D.push({ k: "lamp", l: [l], w: 70 }));
      its.filter((o) => (o.t === "out" && o.v !== "dat") || o.t === "horno").forEach((o) => D.push({ k: "out", o, w: 70 }));
      blocks.push({ c, k, D });
    });
    const W = Math.max(560, ...blocks.map((b) => 200 + b.D.reduce((a, d) => a + d.w, 0))) + 20, BH = 190, H = 150 + blocks.length * BH + 40;
    let g = '<rect width="' + W + '" height="' + H + '" fill="#fff"/>' + Tt(16, 22, "ESQUEMA MULTILINEAL (DESARROLLADO)", 12, "start", 800) + Tt(16, 38, "Fase en rojo \xB7 neutro en azul \xB7 conductor de protecci\xF3n (PE) en verde, punteado \xB7 retornos y viajeros en negro", 8.5, "start");
    g += L(40, 60, 40, 110, RED, 2.2) + L(56, 60, 56, 110, BLU, 2.2) + Tt(48, 56, "Empalme 220 V", 8.5) + '<rect x="30" y="70" width="36" height="22" fill="#fff" stroke="' + ink + '"/>' + Tt(48, 85, "IG " + s.gen.In + " A", 8) + L(40, 110, W - 20, 110, RED, 2) + L(56, 118, W - 20, 118, BLU, 2) + L(72, 126, W - 20, 126, GRN, 1.6, "5 3") + Tt(W - 22, 106, "L", 8, "end", 700) + Tt(W - 22, 116, "N", 8, "end", 700) + Tt(W - 22, 124, "PE", 8, "end", 700) + Tt(W - 22, 140, "PE: barra de tierra y electrodo", 7.5, "end");
    blocks.forEach(({ c, k, D }, bi) => {
      const y = 160 + bi * BH, yF = y + 26, yN = y + 150, yP = y + 168, dr = c.dr !== "none";
      g += L(120, 110, 120, yF, RED, 1.6) + L(136, 118, 136, yN, BLU, 1.6) + L(150, 126, 150, yP, GRN, 1.2, "5 3");
      g += '<rect x="110" y="' + (y - 4) + '" width="20" height="18" fill="#fff" stroke="' + ink + '"/>' + Tt(120, y + 9, c.In + "", 7.5, "middle", 700);
      if (dr) g += '<rect x="104" y="' + (y + 40) + '" width="44" height="22" rx="3" fill="#fff" stroke="' + ink + '" stroke-dasharray="3 2"/>' + Tt(126, y + 55, c.dr + " " + c.ds + "mA", 7);
      g += Tt(16, y + 8, "C" + (k + 1) + " " + (c.n || ""), 10, "start", 800) + Tt(16, y + 21, c.In + " A curva " + c.cv + " \xB7 " + sStr(+c.S) + " mm\xB2", 8, "start") + Tt(16, y + 32, dr ? c.dr + " " + c.ds + " mA clase " + c.cl : "sin diferencial", 8, "start");
      g += L(120, yF, 190 + D.reduce((a, d) => a + d.w, 0), yF, RED, 1.6) + L(136, yN, 190 + D.reduce((a, d) => a + d.w, 0), yN, BLU, 1.6) + L(150, yP, 190 + D.reduce((a, d) => a + d.w, 0), yP, GRN, 1.2, "5 3");
      let x = 200;
      D.forEach((d) => {
        const cx = x + d.w / 2;
        if (d.k === "912" || d.k === "915") {
          const sx = x + 14;
          g += L(sx, yF, sx, yF + 24) + sw(sx, yF + 24) + Tt(sx - 5, yF + 30, d.a.name, 7.5, "end");
          d.l.forEach((l, i) => {
            const lx = x + 44 + i * 46;
            const ox = d.k === "915" ? sx + 18 * i : sx, yR = d.k === "915" ? yF + 48 + 8 * i : yF + 44;
            g += (d.k === "915" && i ? L(sx, yF + 18, ox, yF + 18) + L(ox, yF + 18, ox, yF + 24) + sw(ox, yF + 24) : "") + L(ox, yF + 44, ox, yR) + L(ox, yR, lx, yR) + L(lx, yR, lx, yF + 80) + lampS(lx, yF + 89) + L(lx, yF + 98, lx, yN) + L(lx + 9, yF + 89, lx + 20, yF + 89, GRN, 1, "3 2") + L(lx + 20, yF + 89, lx + 20, yP, GRN, 1, "3 2") + Tt(lx, yN + 12, l.name, 7.5);
          });
        } else if (d.k === "924") {
          const ax = x + 14, bx2 = x + 84, lx = x + 104, ya = yF + 40, t1 = yF + 30, t2 = yF + 50, dot = (cx2, cy2) => '<circle cx="' + cx2 + '" cy="' + cy2 + '" r="2.2" fill="' + ink + '"/>';
          g += L(ax, yF, ax, ya) + dot(ax, ya) + L(ax, ya, ax + 18, t1 + 2, ink, 1.8) + dot(ax + 20, t1) + dot(ax + 20, t2) + L(ax + 20, t1, bx2 - 20, t1, ink, 1.4) + L(ax + 20, t2, bx2 - 20, t2, ink, 1.4) + dot(bx2 - 20, t1) + dot(bx2 - 20, t2) + L(bx2, ya, bx2 - 18, t2 - 2, ink, 1.8) + dot(bx2, ya) + L(bx2, ya, bx2, yF + 66) + L(bx2, yF + 66, lx, yF + 66) + L(lx, yF + 66, lx, yF + 80) + lampS(lx, yF + 89) + L(lx, yF + 98, lx, yN) + L(lx + 9, yF + 89, lx + 16, yF + 89, GRN, 1, "3 2") + L(lx + 16, yF + 89, lx + 16, yP, GRN, 1, "3 2") + Tt(ax, ya + 14, d.a.name, 7.5) + Tt(bx2 - 4, yF + 80, d.b ? d.b.name : "", 7.5, "end") + Tt((ax + bx2) / 2, t1 - 4, "viajeros", 7) + Tt(lx, yN + 12, d.l[0].name, 7.5);
        } else if (d.k === "lamp") {
          g += L(cx, yF, cx, yF + 80) + lampS(cx, yF + 89) + L(cx, yF + 98, cx, yN) + Tt(cx, yN + 12, d.l[0].name, 7.5);
        } else {
          g += L(cx - 10, yF, cx - 10, yF + 70, RED, 1.4) + L(cx, yN, cx, yF + 88, BLU, 1.4) + L(cx + 12, yP, cx + 12, yF + 80, GRN, 1.2, "3 2") + '<path d="M' + (cx - 14) + " " + (yF + 70) + " A 14 14 0 0 0 " + (cx + 14) + " " + (yF + 70) + 'Z" fill="#fff" stroke="' + ink + '" stroke-width="1.6"/>' + Tt(cx, yN + 12, d.o.name, 7.5);
        }
        x += d.w;
      });
      if (!D.length) g += Tt(220, y + 90, "Circuito sin puntos", 9, "start");
    });
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" font-family="Arial,Helvetica,sans-serif" role="img" aria-label="Esquema multilineal">' + g + "</svg>";
  }
  function withHouse(h, fn) {
    const hk = houseKey, h0 = S.sim2 && S.sim2.house || null;
    if (JSON.stringify(h) === hk) return fn();
    setHouse(h);
    try {
      return fn();
    } finally {
      setHouse(h0);
      houseKey = hk;
    }
  }
  let panRes = null, panAsk = null;
  const panState = () => isPan(S.sim2) ? S.sim2 : S.panSim || null;
  function panReqHTML(s) {
    const q = s.pan.req || {}, h = panCount(s);
    return '<div class="tbl-wrap"><table class="pt"><thead><tr><th>Lo pedido</th><th class="num">Pedido</th><th class="num">En el panel</th><th></th></tr></thead><tbody>' + PAN_REQ.map(([k, t, ic]) => "<tr><td>" + ic + " " + t + '</td><td class="num"><input type="number" min="0" max="8" inputmode="numeric" data-pn="req" data-k="' + k + '" value="' + (+q[k] || 0) + '" style="width:60px" aria-label="' + esc(t) + '"></td><td class="num">' + h[k] + "</td><td>" + (+q[k] ? h[k] >= +q[k] ? pill("ok", "✓") : pill("warn", "faltan " + (+q[k] - h[k])) : "") + "</td></tr>").join("") + "</tbody></table></div>";
  }
  function panTestHTML(r) {
    if (!r) return "";
    return '<div class="note ' + (r.ok ? "ok" : "bad") + '"><b>' + (r.ok ? "✓ El panel funciona y cumple" : "✗ El panel a\xFAn no pasa la prueba") + "</b></div>" + (r.R.length ? '<ul class="whyl">' + r.R.map((x) => "<li>" + (x.ok ? "✓ " : "✗ ") + "<b>" + esc(x.t) + '</b><br><span class="hint">' + esc(x.d) + "</span></li>").join("") + "</ul>" : '<p class="hint">No hay luces ni enchufes para probar.</p>') + (r.E.length ? '<p style="margin:8px 0 4px"><b>Observaciones del inspector (' + r.E.length + "):</b></p><ul class=\"whyl\">" + r.E.slice(0, 12).map((o) => "<li>✗ " + esc(o.t) + '<br><span class="hint">' + esc(o.w || o.d || "") + "</span></li>").join("") + "</ul>" : "") + (r.A && r.A.length ? '<p class="hint" style="margin:6px 0 0">Reserva: ' + r.A.map((o) => esc(o.t.replace(/: sin puntos$/, ""))).join(", ") + " no tienen puntos en esta pr\xE1ctica (quedan como circuitos de reserva).</p>" : "");
  }
  function panAskHTML(s) {
    const F = panFixes(s);
    if (!F.length || s.pan.fix === "off") return "";
    return '<div class="note warn"><b>Se pueden corregir ' + F.length + " problema(s):</b><ul style=\"margin:6px 0;padding-left:18px\">" + F.slice(0, 8).map((x) => "<li>" + esc(x.t) + "</li>").join("") + '</ul><button type="button" class="btn small" data-pn="fix">✔ Autorizo corregir</button> <button type="button" class="btn ghost small" data-pn="nofix">Ahora no</button></div>';
  }
  function panSimCard(s) {
    const h = panCount(s), q = s.pan.req || {}, tot = PAN_REQ.reduce((a, [k]) => a + Math.min(+q[k] || 0, h[k]), 0), need = PAN_REQ.reduce((a, [k]) => a + (+q[k] || 0), 0);
    return '<section class="card" style="border:2px solid var(--accent,#b8621b)"><div class="sechead"><h2 style="margin:0">\u{1FAB5} Panel de pr\xE1ctica</h2><span class="pill ' + (need && tot >= need ? "ok" : "info") + '">' + tot + "/" + need + ' pedido</span></div><p class="hint" style="margin:6px 0">Coloca componentes en el tablero de madera (toca la madera con \xABColocar\xBB), con\xE9ctalos y compru\xE9balos. Las luces usan la variante <b>Portal\xE1mpara</b>.</p><div class="actions" style="border:0;padding:0;margin:6px 0;flex-wrap:wrap"><button class="btn calc small" type="button" data-pn="test">✔ Comprobar</button><button class="btn small" type="button" data-pn="auto">＋ Agregar lo pedido</button><label class="chip cstep">Correcci\xF3n <select data-pn="fixmode" aria-label="Modo de correcci\xF3n">' + [["ask", "Pedir autorizaci\xF3n"], ["auto", "Autom\xE1tica"], ["off", "Desactivada"]].map(([k, l]) => '<option value="' + k + '"' + (s.pan.fix === k ? " selected" : "") + ">" + l + "</option>").join("") + '</select></label><button class="btn ghost small" type="button" data-go="pan">\u{1F4D0} Diagramas y materiales</button><button class="btn ghost small" type="button" data-pn="close">← Volver a mi casa</button></div>' + (panAsk ? panAskHTML(s) : "") + (panRes ? panTestHTML(panRes) : "") + "</section>";
  }
  function panAutoFix(s, msgs) {
    if (!isPan(s) || !s.pan) return;
    if (s.pan.fix === "auto") {
      for (let i = 0; i < 3; i++) {
        const d = panApply(s, panFixes(s));
        if (!d.length) break;
        msgs.push(["ok", "Corregido autom\xE1ticamente: " + d.slice(0, 3).join(" \xB7 ") + (d.length > 3 ? " (+" + (d.length - 3) + ")" : "")]);
      }
      panAsk = null;
    } else if (s.pan.fix === "ask") panAsk = panFixes(s).length ? 1 : null;
  }
  function panOpen() {
    if (!isPan(S.sim2)) S.simCasa = S.sim2 || sim2Blank();
    S.sim2 = isPan(S.sim2) ? S.sim2 : S.panSim || panBlank();
    delete S.panSim;
    simPV.lamp = "pm";
    simInsp = null;
    simSel = null;
    simPC = null;
    panRes = null;
    save();
    go("sim");
  }
  function panClose() {
    if (!isPan(S.sim2)) return go("sim");
    S.panSim = S.sim2;
    S.sim2 = S.simCasa || sim2Blank();
    delete S.simCasa;
    simInsp = null;
    simSel = null;
    simPC = null;
    save();
    go("sim");
  }
  function pgPan() {
    const s = panState(), active = isPan(S.sim2);
    const ex = PAN_EX.map(([k, t, q]) => '<button type="button" class="tpl" data-pn="ex" data-k="' + k + '"' + (s && s.pan.ex === k ? ' style="border-color:var(--accent,#b8621b)"' : "") + '><span class="ti">\u{1FAB5}</span><span class="tt">' + t + '</span><span class="td">' + PAN_REQ.filter(([r]) => q[r]).map(([r]) => q[r] + " \xD7 " + { c912: "luz con 9/12", c915: "9/15 con 2 luces", c924: "escalera 9/24", c932: "9/32 con 3 luces", enc: "enchufe" }[r]).join(" \xB7 ") + "</span></button>").join("");
    let diag = '<p class="hint">Abre el panel para empezar.</p>';
    if (s) diag = withHouse(s.house, () => {
      const B = simBOM(s);
      return '<section class="card"><h2>Plano de la pared</h2><div class="plan" style="overflow:auto">' + panElevSVG(s) + '</div><p class="hint">Vista frontal con la ubicaci\xF3n y altura de cada componente y el recorrido de los tubos.</p></section><section class="card"><h2>Diagrama unilineal</h2>' + simConnSVG(s) + '</section><section class="card"><h2>Esquema multilineal</h2><div class="plan" style="overflow:auto">' + panMultiSVG(s) + '</div><p class="hint">Cada circuito con su fase, neutro y tierra; los interruptores cortan la fase y los 9/24 se unen por dos viajeros.</p></section><section class="card"><h2>Listado de materiales</h2>' + bomTable(B, true) + '</section><div class="actions no-print" style="border:0"><button class="btn" type="button" data-pn="print">\u{1F5A8} Imprimir diagramas y materiales</button></div>';
    });
    return '<p class="eyebrow">Simulador 3D \xB7 modo pr\xE1ctico</p><h1>Panel de pr\xE1ctica</h1><p class="lead">Un tablero de madera como el del taller: montas el tablero el\xE9ctrico, cajas, tubos, interruptores, portal\xE1mparas y enchufes, los conectas y compruebas que funcionen. Ideal para practicar circuitos cortos antes de la obra.</p>' +
      '<section class="card"><h2>1 \xB7 Elige el encargo</h2><div class="tpls">' + ex + "</div>" + (s ? '<h3 style="margin:14px 0 6px">Lo pedido (puedes cambiar las cantidades)</h3>' + panReqHTML(s) + '<div class="grid" style="margin-top:10px"><div class="field"><label>Correcci\xF3n de errores</label><select data-pn="fixmode">' + [["ask", "Pedir autorizaci\xF3n antes de corregir"], ["auto", "Corregir autom\xE1ticamente mientras armo"], ["off", "No corregir (modo evaluaci\xF3n)"]].map(([k, l]) => '<option value="' + k + '"' + (s.pan.fix === k ? " selected" : "") + ">" + l + "</option>").join("") + "</select></div></div>" : "") + "</section>" +
      '<section class="card"><h2>2 \xB7 Arma y comprueba</h2><div class="actions" style="border:0;padding:0;flex-wrap:wrap"><button class="btn calc" type="button" data-pn="open">' + (active ? "◈ Ir al panel en el 3D" : "◈ Abrir el panel en el 3D") + "</button>" + (s ? '<button class="btn" type="button" data-pn="auto">＋ Agregar lo pedido</button><button class="btn" type="button" data-pn="test">✔ Comprobar</button>' : "") + (active ? '<button class="btn ghost" type="button" data-pn="close">← Volver a mi casa</button>' : "") + (s ? '<button class="btn danger small" type="button" data-pn="reset">' + (panAsk === "reset" ? "\xBFVaciar el panel? Toca otra vez" : "Vaciar panel") + "</button>" : "") + "</div>" + (s && active && panAsk && panAsk !== "reset" ? panAskHTML(s) : "") + (panRes ? panTestHTML(panRes) : "") + learn("C\xF3mo se arma", '<ol class="hand"><li>Abre el panel en el 3D. Agrega los disyuntores en \xAB⚡ + Disyuntor / DR\xBB (alumbrado 10 A curva B y enchufes 16 A curva C, con diferencial de 30 mA).</li><li>Con <b>Colocar</b> toca la madera para poner cajas de derivaci\xF3n, interruptores, portal\xE1mparas (variante \xABPortal\xE1mpara\xBB de Luz) y enchufes. Quedan a la altura donde tocas.</li><li>Con <b>\u{1F517} Conectar</b> toca el autom\xE1tico o la caja de origen y luego cada punto: se dibuja el tubo naranjo con sus conductores.</li><li>En cada luz elige su interruptor; para escalera, los dos 9/24.</li><li>Toca <b>Comprobar</b>: se energiza el panel, se accionan los interruptores y se mide cada enchufe.</li></ol>') + "</section>" + diag;
  }
  const EXM = {
    sec: { d: "Circuito de enchufes con cable de 1,5 mm\xB2", w: "Los enchufes requieren 2,5 mm\xB2 como m\xEDnimo (RIC N\xB004, 5.4).", pick: (s) => s.circuits.find((c) => +c.S >= 2.5 && s.items.some((i) => i.c === c.id && i.t === "out")), set: (s, c) => c.S = 1.5, bad: (s, c) => +c.S < 2.5 },
    pe: { d: "Conductor de protecci\xF3n desconectado en el tablero", w: "Sin PE una falla deja carcasas con tensi\xF3n y el diferencial no act\xFAa a tiempo (RIC N\xB006).", pick: (s) => s.circuits.find((c) => c.pe !== false), set: (s, c) => c.pe = false, bad: (s, c) => c.pe === false },
    dr: { d: "Circuito sin protecci\xF3n diferencial", w: "Todos los circuitos de la vivienda llevan diferencial de 30 mA (RIC N\xB010, 5.1.3.5).", pick: (s) => s.circuits.find((c) => c.dr !== "none" && !c._x), set: (s, c) => c.dr = "none", bad: (s, c) => c.dr === "none" },
    nc: { d: "Neutro conectado a la barra general en un circuito con diferencial", w: "El neutro debe salir del mismo diferencial; si no, \xE9ste detecta fuga y dispara con cualquier carga.", pick: (s) => s.circuits.find((c) => c.dr !== "none" && c.nc !== "bar" && !c._x), set: (s, c) => c.nc = "bar", bad: (s, c) => c.nc === "bar" },
    cv: { d: "Enchufes protegidos con curva B", w: "Los enchufes alimentan equipos con corriente de arranque: se usa curva C.", pick: (s) => s.circuits.find((c) => c.cv === "C" && s.items.some((i) => i.c === c.id && i.t === "out")), set: (s, c) => c.cv = "B", bad: (s, c) => c.cv === "B" && s.items.some((i) => i.c === c.id && i.t === "out") },
    In: { d: "Autom\xE1tico mayor que lo que soporta el cable", w: "Debe cumplirse Is ≤ In ≤ Iz: con 16 A en 1,5 mm\xB2 el cable se recalienta antes de que el autom\xE1tico corte.", pick: (s) => s.circuits.find((c) => +c.S === 1.5 && +c.In <= 10), set: (s, c) => c.In = 16, bad: (s, c) => ampOf(c.S) < +c.In },
    alim: { d: "Alimentador de 2,5 mm\xB2", w: "La secci\xF3n m\xEDnima del alimentador es 4 mm\xB2 (RIC N\xB004, 5.4).", pick: (s) => s, set: (s) => s.alim.S = 2.5, bad: (s) => +s.alim.S < 4 },
    gen: { d: "Interruptor general de 20 A", w: "La protecci\xF3n m\xEDnima del empalme de una vivienda es 25 A (RIC N\xB010, 5.2.1).", pick: (s) => s, set: (s) => s.gen.In = 20, bad: (s) => +s.gen.In < 25 },
    ip: { d: "Enchufe com\xFAn en zona h\xFAmeda", w: "En ba\xF1os y lavaderos los enchufes deben ser IP44 o superior, con tapa.", pick: (s) => s.items.find((i) => i.t === "out" && i.v === "ip"), set: (s, it) => delete it.v, bad: (s, it) => it.v !== "ip" }
  };
  function examStart(s0) {
    const keep = { done: s0.done, score: s0.score, log: s0.log }, s = Object.assign(sim2Example(), keep), ks = Object.keys(EXM).sort(() => Math.random() - 0.5), m = [];
    for (const k of ks) {
      if (m.length >= 5) break;
      const t = EXM[k].pick(s);
      if (!t) continue;
      EXM[k].set(s, t);
      if (t.id != null && s.circuits.includes(t)) t._x = 1;
      m.push({ k, ref: t === s ? null : s.circuits.includes(t) ? "c" + t.id : "i" + t.id });
    }
    s.circuits.forEach((c) => delete c._x);
    s.exam = { t0: Date.now(), m, res: null };
    return s;
  }
  const examRef = (s, r) => r == null ? s : r[0] === "c" ? s.circuits.find((c) => c.id === +r.slice(1)) : s.items.find((i) => i.id === +r.slice(1));
  function examGrade(s) {
    const R = s.exam.m.map((x) => {
      const t = examRef(s, x.ref);
      return { k: x.k, ok: !t ? x.k === "ip" ? false : true : !EXM[x.k].bad(s, t) };
    }), ok = R.filter((r) => r.ok).length, ref = sim2Example();
    s.exam.m.forEach((x, i) => {
      if (R[i].ok) return;
      const t = examRef(ref, x.ref);
      if (t) EXM[x.k].set(ref, t);
    });
    const extra = Math.max(0, simInspect(s).filter((o) => !o.fault).length - simInspect(ref).filter((o) => !o.fault).length);
    return { R, ok, n: R.length, extra, nota: Math.max(1, Math.round((1 + 6 * ok / R.length - Math.min(1, extra * 0.2)) * 10) / 10), min: Math.round((Date.now() - s.exam.t0) / 6e4) };
  }
  function examHTML(s) {
    const e = s.exam;
    if (!e) return '<p class="hint" style="margin:0 0 8px">Se carga la casa de ejemplo con 5 fallas normativas escondidas. La lista de errores y la revisi\xF3n del inspector quedan ocultas: encu\xE9ntralas revisando el tablero, los circuitos y midiendo, corr\xEDgelas y entrega. Nota de 1,0 a 7,0.</p><button class="btn" type="button" data-sa="exam">\u{1F3AF} Iniciar examen</button>';
    if (!e.res) return '<p style="margin:0 0 8px"><b>Examen en curso</b> \xB7 ' + e.m.length + ' fallas ocultas \xB7 iniciado hace ' + Math.max(0, Math.round((Date.now() - e.t0) / 6e4)) + ' min.</p><p class="hint" style="margin:0 0 8px">Pistas: revisa secciones, curvas, diferenciales, neutros y tierras de cada circuito, el general, el alimentador y los enchufes de zonas h\xFAmedas.</p><div class="actions" style="border:0;padding-top:0"><button class="btn calc" type="button" data-sa="examend">Entregar examen</button><button class="btn ghost small" type="button" data-sa="examquit">Abandonar</button></div>';
    const r = e.res;
    return '<div class="kpis">' + kpi("Nota", nf(r.nota, 1), "", r.nota >= 4 ? "ok" : "bad") + kpi("Fallas corregidas", r.ok + "/" + r.n) + kpi("Errores nuevos", r.extra, "", r.extra ? "bad" : "ok") + kpi("Tiempo", r.min, "min") + '</div><ul class="whyl">' + r.R.map((x) => "<li>" + (x.ok ? "✓ " : "✗ ") + "<b>" + EXM[x.k].d + '</b><br><span class="hint">' + EXM[x.k].w + "</span></li>").join("") + '</ul><div class="actions" style="border:0;padding-top:0"><button class="btn" type="button" data-sa="exam">Nuevo examen</button><button class="btn ghost small" type="button" data-sa="examquit">Cerrar</button></div>';
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-pn]");
    if (!b || b.tagName === "SELECT" || b.tagName === "INPUT") return;
    const a = b.dataset.pn;
    if (a === "open") return panOpen();
    if (a === "close") return panClose();
    let s = panState();
    if (a === "ex") {
      if (!s) {
        S.panSim = panBlank();
        s = S.panSim;
      }
      const x = PAN_EX.find((q) => q[0] === b.dataset.k);
      s.pan.ex = x[0];
      s.pan.req = Object.assign({}, x[2]);
      save();
      return render(true);
    }
    if (!s) return;
    const msgs = [], run = (fn) => isPan(S.sim2) ? fn() : withHouse(s.house, fn);
    if (a === "reset") {
      if (panAsk !== "reset") {
        panAsk = "reset";
        return render(true);
      }
      panAsk = null;
      const ns = panBlank();
      ns.pan = Object.assign({}, s.pan);
      if (isPan(S.sim2)) S.sim2 = ns;
      else S.panSim = ns;
      panRes = null;
      save();
      return render(true);
    }
    if (a === "auto") run(() => panAuto(s).forEach((m) => msgs.push(["ok", m])));
    if (a === "test") {
      panRes = run(() => panTest(s));
      msgs.push([panRes.ok ? "ok" : "warn", panRes.ok ? "Prueba superada: todo funciona y cumple." : "La prueba encontr\xF3 problemas: revisa el detalle."]);
    }
    if (a === "fix") {
      const d = run(() => panApply(s, panFixes(s)));
      msgs.push(["ok", "Corregido: " + d.slice(0, 4).join(" \xB7 ") + (d.length > 4 ? " (+" + (d.length - 4) + ")" : "")]);
      panAsk = null;
    }
    if (a === "nofix") {
      panAsk = null;
      if (cur === "sim") return render(true);
    }
    if (a === "print") {
      const w = window.open("", "_blank"), html = run(() => '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Panel de pr\xE1ctica</title><style>' + INF_CSS + '</style></head><body><h1>Panel de pr\xE1ctica</h1><h2>Plano de la pared</h2>' + panElevSVG(s) + "<h2>Diagrama unilineal</h2>" + simConnSVG(s) + "<h2>Esquema multilineal</h2>" + panMultiSVG(s) + "<h2>Listado de materiales</h2>" + bomTable(simBOM(s), false) + "</body></html>");
      if (w && w.document) {
        w.document.open();
        w.document.write(html);
        w.document.close();
      } else dlFile("panel-practica.html", new Blob([html], { type: "text/html" }));
      return;
    }
    if (a !== "print") {
      if (a !== "test") run(() => simTrips(s, msgs));
      save();
      if (cur === "sim" && isPan(S.sim2)) simRefresh(msgs);
      else render(true);
      if (msgs.length && cur === "sim") simToast(msgs);
    }
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (!el || !el.dataset || !el.dataset.pn) return;
    const s = panState();
    if (!s) return;
    if (el.dataset.pn === "req") s.pan.req[el.dataset.k] = Math.max(0, Math.min(8, Math.round(+el.value || 0)));
    if (el.dataset.pn === "fixmode") {
      s.pan.fix = el.value;
      panAsk = null;
    }
    save();
    if (cur === "sim" && isPan(S.sim2)) simRefresh([]);
    else render(true);
  });
