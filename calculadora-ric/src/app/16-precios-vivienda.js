  const PREC0 = { "cab:1.5": 300, "cab:2.5": 440, "cab:4": 720, "cab:6": 1050, "cab:10": 1800, "cab:16": 2900, "cab:25": 4500, "tub:pvc16": 290, "tub:pvc20": 300, "tub:emt16": 1500, "tub:emt20": 1900, "tub:flex16": 190, "tub:flex20": 230, curva: 250, copla: 190, term: 150, abraz: 120, cdev: 1200, cemb: 890, ccen: 900, sw: 3190, out: 3390, horno: 6490, lamp: 1990, conec: 300, ig2: 12990, ig4: 34990, "dr:AC": 23590, "dr:A": 39990, "dr:F": 69990, "dr:B": 249990, tm: 5990, tab8: 9990, tab12: 13990, tab18: 22990, tab24: 29990, tab36: 49990, tab48: 69990, barra: 4990, peine: 6500, regN: 3990, regPE: 3990, regF: 6990, regpeine: 6500, pil: 12990, copper: 16990, tierra: 1800, mo: 18e3, sw15: 4990, sw32: 6990, sw24: 4590, swip: 6490, dim: 14990, out2: 5190, outip: 6990, outusb: 13990, out16: 4990, outdat: 6990, pm: 1490, pir: 14990, pul: 2990, ext: 19990, tim: 9990, plaf: 9990, foco: 5990, tubo: 14990 };
  const precio = (k) => {
    const v = S.precios && S.precios[k];
    return v != null && v !== "" && isFinite(+v) ? +v : PREC0[k] || 0;
  };
  const clp = (v) => "$" + n0(v);
  function bomCost(B) {
    let net = 0;
    B.forEach((b) => {
      b.pu = b.k ? precio(b.k) : 0;
      b.st = b.pu * b.q;
      net += b.st;
    });
    return { net, iva: net * 0.19, tot: net * 1.19 };
  }
  function pInput(k) {
    return '<input class="pin" type="number" min="0" step="10" inputmode="numeric" data-pk="' + k + '" value="' + precio(k) + '" aria-label="Precio unitario">';
  }
  function bomTable(B, edit) {
    const c = bomCost(B), grp = [...new Set(B.map((b) => b.g))];
    const rows = grp.map((g) => {
      const its = B.filter((b) => b.g === g && b.q > 0);
      if (!its.length) return "";
      return '<tr class="grp"><td colspan="5">' + g + "</td></tr>" + its.map((b) => "<tr><td>" + esc(b.d) + '</td><td class="num"><b>' + b.q + "</b></td><td>" + b.u + '</td><td class="num">' + (edit && b.k ? '<span class="no-print">' + pInput(b.k) + '</span><span class="only-print">' + clp(b.pu) + "</span>" : clp(b.pu)) + '</td><td class="num">' + clp(b.st) + "</td></tr>").join("");
    }).join("");
    return '<div class="tbl-wrap"><table class="pt bom"><thead><tr><th>Material</th><th>Cant.</th><th>Unid.</th><th>Precio unit.</th><th>Subtotal</th></tr></thead><tbody>' + rows + '</tbody><tfoot><tr><td colspan="4">Neto</td><td class="num">' + clp(c.net) + '</td></tr><tr><td colspan="4">IVA 19 %</td><td class="num">' + clp(c.iva) + '</td></tr><tr class="tot"><td colspan="4"><b>Total</b></td><td class="num"><b>' + clp(c.tot) + "</b></td></tr></tfoot></table></div>";
  }
  const CASA_COL = { dormitorio: "#dbe6f2", living: "#efe4cf", comedor: "#efe4cf", estar: "#efe4cf", cocina: "#f4dfc8", lavadero: "#dcebee", bano: "#d4ebe2", pasillo: "#e6e6e6", escalera: "#ddd3c2", otro: "#ececec" };
  const CIRC = ["pasillo", "living", "comedor", "estar", "escalera"];
  const rd = (v) => Math.round(v * 100) / 100;
  let casaCotas = true, casaMode = "mover", casaSel = null, casaConf = "", casaDrag = null, casaMsg = "", casaDragged = false, casaFull = false, casaStep = 0.1, casaHist = [], casaWsel = null, casaWPush = false, casaNew = { t: "dormitorio", n: "", w: 3, l: 3, pos: "der", ref: "" };
  const casaR = (id, n, t, x, z, w, l) => ({ id, n, t, x, z, w, l });
  function casaDef() {
    return { n: "Casa base 70 m\xB2", tx: 1.7, rooms: ROOMS0.map((r) => casaR(r.id, r.n, r.t, r.x0, r.z0, r.x1 - r.x0, r.z1 - r.z0)), doors: DOORS0.map((d) => d.slice()) };
  }
  const CASA_TPL = [
    ["base", "Casa base 70 m\xB2", "La del simulador", casaDef],
    ["depto", "Departamento ≈ 50 m\xB2", "1 dormitorio", () => casaAuto({ n: "Departamento 50 m\xB2", tx: 1.2, rooms: [casaR("r1", "Living-comedor", "living", 0, 0, 4.5, 3.2), casaR("r2", "Dormitorio", "dormitorio", 0, 3.2, 4.5, 3), casaR("r3", "Cocina", "cocina", 4.5, 0, 3.5, 2.4), casaR("r4", "Hall", "pasillo", 4.5, 2.4, 1.2, 3.8), casaR("r5", "Ba\xF1o", "bano", 5.7, 2.4, 2.3, 2), casaR("r6", "Logia", "lavadero", 5.7, 4.4, 2.3, 1.8)], doors: [] })],
    ["casa3", "Casa ≈ 90 m\xB2", "3 dormitorios, 2 ba\xF1os", () => casaAuto({ n: "Casa 3 dormitorios 90 m\xB2", tx: 1.5, rooms: [casaR("r1", "Living-comedor", "living", 0, 0, 5.5, 4), casaR("r2", "Cocina", "cocina", 5.5, 0, 3.5, 4), casaR("r3", "Logia", "lavadero", 9, 0, 3, 2.2), casaR("r4", "Ba\xF1o 2", "bano", 9, 2.2, 3, 1.8), casaR("r5", "Pasillo", "pasillo", 3.5, 4, 8.5, 1.1), casaR("r6", "Dormitorio 1", "dormitorio", 0, 4, 3.5, 3.5), casaR("r7", "Dormitorio 2", "dormitorio", 3.5, 5.1, 3.5, 2.4), casaR("r8", "Ba\xF1o", "bano", 7, 5.1, 2, 2.4), casaR("r9", "Dormitorio 3", "dormitorio", 9, 5.1, 3, 2.4)], doors: [] })],
    ["casa2p", "Casa 2 pisos ≈ 125 m\xB2", "3 dormitorios, escalera", () => {
      const R = casaR, c = { n: "Casa 2 pisos 125 m\xB2", tx: 1.5, af: 0, rooms: [R("r1", "Living-comedor", "living", 0, 0, 4.6, 7.4), R("r2", "Hall de acceso", "pasillo", 4.6, 0, 1.2, 3.4), R("r3", "Escalera", "escalera", 4.6, 3.4, 1.2, 4), R("r4", "Ba\xF1o visita", "bano", 5.8, 0, 2.8, 1.8), R("r5", "Cocina", "cocina", 5.8, 1.8, 2.8, 3.4), R("r6", "Logia", "lavadero", 5.8, 5.2, 2.8, 2.2)], doors: [["z", 0, 4.75, 5.65], ["x", 4.6, 1.3, 2.1], ["x", 5.8, 0.5, 1.3], ["x", 5.8, 2.3, 3.1], ["z", 5.2, 6.6, 7.4]], open: [["x", 4.6, 5.6, 7.4]] };
      c.other = { rooms: [R("r7", "Dormitorio principal", "dormitorio", 0, 0, 3.4, 4.6), R("r8", "Ba\xF1o", "bano", 3.4, 0, 2.4, 2.2), R("r9", "Estudio", "otro", 5.8, 0, 2.8, 2.2), R("r10", "Pasillo", "pasillo", 3.4, 2.2, 5.2, 1.2), R("r11", "Hall", "pasillo", 3.4, 3.4, 1.2, 1.2), R("r12", "Escalera", "escalera", 4.6, 3.4, 1.2, 4), R("r13", "Dormitorio 2", "dormitorio", 0, 4.6, 4.6, 2.8), R("r14", "Dormitorio 3", "dormitorio", 5.8, 3.4, 2.8, 4)], doors: [["x", 3.4, 2.4, 3.2], ["z", 2.2, 4.2, 5], ["z", 2.2, 6.8, 7.6], ["z", 3.4, 6.8, 7.6], ["z", 4.6, 3.6, 4.4]], open: [["z", 3.4, 3.4, 4.6], ["z", 3.4, 4.6, 5.8]] };
      return c;
    }],
    ["cero", "Desde cero", "Un recinto para empezar", () => casaAuto({ n: "Mi vivienda", tx: 1, rooms: [casaR("r1", "Living", "living", 0, 0, 4, 4)], doors: [] })]
  ];
  const cBox = (r) => ({ x0: r.x, x1: r.x + r.w, z0: r.z, z1: r.z + r.l });
  function casaSwap(c) {
    if (!c.other) return;
    const o = c.other;
    c.other = { rooms: c.rooms, doors: c.doors, open: c.open || [] };
    c.rooms = o.rooms || [];
    c.doors = o.doors || [];
    c.open = o.open || [];
    c.af = c.af === 1 ? 0 : 1;
  }
  const casaAF = (c) => c.af === 1 ? 1 : 0;
  function casaAll(c) {
    const a = casaAF(c), R = c.rooms.map((r) => Object.assign({}, r, { f: a }));
    return c.other ? R.concat((c.other.rooms || []).map((r) => Object.assign({}, r, { f: 1 - a }))) : R;
  }
  const casaUse = (c) => casaAll(c).filter((r) => !(r.f && r.t === "escalera"));
  function casaShared(a, b) {
    const A = cBox(a), B = cBox(b), e = 0.02;
    for (const [p0, p1, q0, q1, ax] of [[A.x1, B.x0, 0, 0, "x"], [A.x0, B.x1, 0, 0, "x"], [A.z1, B.z0, 0, 0, "z"], [A.z0, B.z1, 0, 0, "z"]]) {
      if (Math.abs(p0 - p1) > e) continue;
      const m0 = ax === "x" ? Math.max(A.z0, B.z0) : Math.max(A.x0, B.x0), m1 = ax === "x" ? Math.min(A.z1, B.z1) : Math.min(A.x1, B.x1);
      if (m1 - m0 > e) return [ax, p0, m0, m1];
    }
    return null;
  }
  const doorOn = (sh, w) => {
    const c = (sh[2] + sh[3]) / 2;
    w = Math.min(w, sh[3] - sh[2] - 0.2);
    return [sh[0], rd(sh[1]), rd(c - w / 2), rd(c + w / 2)];
  };
  function casaRoot(c) {
    if (casaAF(c) === 1) return c.rooms.find((r) => r.t === "escalera") || c.rooms.slice().sort((a, b) => b.w * b.l - a.w * a.l)[0];
    const z0 = Math.min(...c.rooms.map((r) => r.z));
    return c.rooms.filter((r) => Math.abs(r.z - z0) < 0.02).sort((a, b) => CIRC.includes(b.t) - CIRC.includes(a.t) || b.w * b.l - a.w * a.l)[0];
  }
  function casaAuto(c) {
    const R = c.rooms, D = [];
    c.doors = D;
    if (!R.length) return c;
    const root = casaRoot(c), z0 = root.z, lo = root.x + 0.6, hi = root.x + root.w - 0.6;
    if (!c.open) c.open = [];
    if (hi >= lo && casaAF(c) === 0) {
      let cx = [c.tx + 1.4, c.tx - 1.4].find((v) => v >= lo && v <= hi);
      if (cx == null) cx = Math.abs(lo - c.tx) > Math.abs(hi - c.tx) ? lo : hi;
      D.push(["z", rd(z0), rd(cx - 0.45), rd(cx + 0.45)]);
    }
    const inT = /* @__PURE__ */ new Set([root.id]);
    for (; ; ) {
      let best = null;
      R.forEach((a) => {
        if (!inT.has(a.id)) return;
        R.forEach((b) => {
          if (inT.has(b.id)) return;
          const sh = casaShared(a, b);
          if (!sh) return;
          const op = (c.open || []).some((o) => o[0] === sh[0] && Math.abs(o[1] - sh[1]) < 0.02 && o[3] > sh[2] && o[2] < sh[3] && o[3] - o[2] >= 0.6);
          if (op) {
            if (!best || best.sc > -100) best = { sc: -100, sh, b, op: 1 };
            return;
          }
          if (sh[3] - sh[2] < 1) return;
          if (a.t === "escalera" || b.t === "escalera") {
            if (!CIRC.includes(a.t) || !CIRC.includes(b.t)) return;
            if (!best || best.sc > -50) best = { sc: -50, sh, b, mkop: 1 };
            return;
          }
          const sc = (CIRC.includes(a.t) ? 0 : 2) + (a.t === "bano" ? 4 : 0) + (b.t === "bano" && !CIRC.includes(a.t) ? 3 : 0) - Math.min(sh[3] - sh[2], 3) * 0.1;
          if (!best || sc < best.sc) best = { sc, sh, b };
        });
      });
      if (!best) break;
      inT.add(best.b.id);
      if (best.mkop) c.open.push(doorOn(best.sh, Math.min(1.2, best.sh[3] - best.sh[2])));
      else if (!best.op) D.push(doorOn(best.sh, 0.8));
    }
    return c;
  }
  function casaNorm(c) {
    const A = casaAll(c);
    if (!A.length) return;
    const mx = Math.min(...A.map((r) => r.x)), mz = Math.min(...A.map((r) => r.z));
    if (Math.abs(mx) < 1e-9 && Math.abs(mz) < 1e-9) return;
    const sh = (d) => d[0] === "x" ? ["x", rd(d[1] - mx), rd(d[2] - mz), rd(d[3] - mz)] : ["z", rd(d[1] - mz), rd(d[2] - mx), rd(d[3] - mx)];
    [c, c.other].forEach((k) => {
      if (!k) return;
      (k.rooms || []).forEach((r) => {
        r.x = rd(r.x - mx);
        r.z = rd(r.z - mz);
      });
      k.doors = (k.doors || []).map(sh);
      k.open = (k.open || []).map(sh);
    });
    c.tx = rd(c.tx - mx);
  }
  function casaPrune(c) {
    c.open = (c.open || []).filter((o) => c.rooms.some((a) => c.rooms.some((b) => {
      if (a === b) return false;
      const sh = casaShared(a, b);
      return sh && sh[0] === o[0] && Math.abs(sh[1] - o[1]) < 0.02 && o[2] >= sh[2] - 0.02 && o[3] <= sh[3] + 0.02;
    })));
    c.doors = c.doors.filter((d) => !c.open.some((o) => o[0] === d[0] && Math.abs(o[1] - d[1]) < 0.02 && d[3] > o[2] + 0.02 && d[2] < o[3] - 0.02));
    const n = c.doors.length;
    c.doors = c.doors.filter((d) => c.rooms.some((r) => {
      const b = cBox(r);
      return d[0] === "x" ? (Math.abs(b.x0 - d[1]) < 0.02 || Math.abs(b.x1 - d[1]) < 0.02) && d[2] >= b.z0 - 0.02 && d[3] <= b.z1 + 0.02 : (Math.abs(b.z0 - d[1]) < 0.02 || Math.abs(b.z1 - d[1]) < 0.02) && d[2] >= b.x0 - 0.02 && d[3] <= b.x1 + 0.02;
    }));
    return n - c.doors.length;
  }
  function casaToHouse(c) {
    const k = JSON.parse(JSON.stringify(c));
    if (casaAF(k) === 1) casaSwap(k);
    casaNorm(k);
    const o = k.other || { rooms: [], doors: [], open: [] }, rm = (f) => (r) => Object.assign({ id: r.id, n: r.n, t: r.t, x0: rd(r.x), x1: rd(r.x + r.w), z0: rd(r.z), z1: rd(r.z + r.l), f }, r.t === "escalera" ? { sk: r.sk || "", sd: r.sd || "" } : {}), dd = (f) => (d) => d.slice(0, 4).concat([f]);
    return { n: k.n || "Mi vivienda", tx: rd(k.tx), rooms: k.rooms.map(rm(0)).concat((o.rooms || []).map(rm(1))), doors: k.doors.map(dd(0)).concat((o.doors || []).map(dd(1))), open: (k.open || []).map(dd(0)).concat((o.open || []).map(dd(1))), we: +k.we || 0.15, wi: +k.wi || 0.12 };
  }
  const cArea = (r) => r.w * r.l;
  const cMinC = (r) => minCentros({ area: cArea(r) });
  const cMinE = (r) => minEnchufes({ tipo: r.t, perim: 2 * (r.w + r.l) });
  function casaFront(c) {
    const z0 = Math.min(...c.rooms.map((r) => r.z));
    return c.rooms.filter((r) => Math.abs(r.z - z0) < 0.02);
  }
  function casaCheck(c) {
    if (!c.other) return casaCheck1(c);
    const a = casaCheck1(c), k = JSON.parse(JSON.stringify(c));
    casaSwap(k);
    const b = casaCheck1(k), P = "Piso " + (casaAF(k) + 1) + ": ";
    return { E: a.E.concat(b.E.map((m) => P + m)), Wn: a.Wn.concat(b.Wn.map((m) => P + m)) };
  }
  function casaCheck1(c) {
    const E = [], Wn = [], R = c.rooms, up = casaAF(c) === 1, two = !!c.other;
    R.forEach((r) => {
      if (!(r.w >= 0.9 && r.l >= 0.9)) E.push(r.n + ": cada lado debe medir al menos 0,9 m.");
      if (r.w > 30 || r.l > 30) E.push(r.n + ": m\xE1ximo 30 m por lado.");
    });
    for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) {
      const a = cBox(R[i]), b = cBox(R[j]), ox = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), oz = Math.min(a.z1, b.z1) - Math.max(a.z0, b.z0);
      if (ox > 0.02 && oz > 0.02) E.push(R[i].n + " y " + R[j].n + " se superponen (" + n1(ox * oz) + " m\xB2).");
    }
    if (!R.length) E.push("Agrega al menos un recinto.");
    if (!R.length) return { E, Wn };
    if (two) {
      const es = R.filter((r) => r.t === "escalera"), eo = (c.other.rooms || []).filter((r) => r.t === "escalera");
      if (!es.length) E.push("En una casa de 2 pisos ambos pisos necesitan un recinto \xABEscalera\xBB, uno sobre el otro.");
      else if (eo.length && !es.some((a) => eo.some((b) => {
        const A = cBox(a), B = cBox(b), ox = Math.min(A.x1, B.x1) - Math.max(A.x0, B.x0), oz = Math.min(A.z1, B.z1) - Math.max(A.z0, B.z0);
        return ox > 0 && oz > 0 && ox * oz >= 0.6 * Math.min(cArea(a), cArea(b));
      }))) E.push("La escalera de este piso no coincide con la del otro piso: deben quedar una sobre la otra.");
      es.forEach((r) => {
        const k = r.sk || "recta";
        if (Math.min(r.w, r.l) < 0.9) E.push(r.n + ": el ancho \xFAtil m\xEDnimo de una escalera es 0,9 m.");
        else if (k === "caracol") {
          if (Math.min(r.w, r.l) < 1.4) Wn.push(r.n + ": una escalera caracol c\xF3moda necesita al menos 1,4 \xD7 1,4 m (di\xE1metro).");
        } else if (k === "L") {
          if (Math.min(r.w, r.l) < 1.8) Wn.push(r.n + ": una escalera en L necesita al menos 1,8 m por lado para dos tramos de 0,9 m.");
          else if (r.w + r.l < 4.6) Wn.push(r.n + ": en L, los dos tramos suman " + nf(r.w + r.l - 2, 2) + " m de recorrido; para " + nf(FH, 2) + " m de altura se recomiendan \u2248 3,5 m.");
        } else if (Math.max(r.w, r.l) < 3.6) Wn.push(r.n + ": una escalera recta para " + nf(FH, 2) + " m de altura necesita \u2248 3,8 m de largo (15 pelda\xF1os de 18 \xD7 25 cm); con " + nf(Math.max(r.w, r.l), 2) + " m deber\xE1 ser en L o de caracol.");
      });
    }
    if (up) {
      const seen = new Set(R.filter((r) => r.t === "escalera").map((r) => r.id)), q = [...seen];
      const adj = (a, b) => {
        const sh = casaShared(a, b);
        return sh && c.doors.concat((c.open || []).filter((o) => o[3] - o[2] >= 0.6)).some((d) => d[0] === sh[0] && Math.abs(d[1] - sh[1]) < 0.02 && d[2] >= sh[2] - 0.02 && d[3] <= sh[3] + 0.02);
      };
      while (q.length) {
        const id = q.shift(), a = R.find((r) => r.id === id);
        R.forEach((b) => {
          if (!seen.has(b.id) && adj(a, b)) {
            seen.add(b.id);
            q.push(b.id);
          }
        });
      }
      const off = R.filter((r) => !seen.has(r.id));
      if (seen.size && off.length) Wn.push("Sin acceso desde la escalera: " + off.map((r) => r.n).join(", ") + ". Usa \xAB\u{1F6AA} Auto\xBB o agrega puertas.");
      return { E, Wn };
    }
    const fr = casaFront(c), onF = fr.find((r) => c.tx >= r.x + 0.5 && c.tx <= r.x + r.w - 0.5);
    if (!onF) E.push("El tablero debe ir en el muro del frente (arriba en el plano), a 0,5 m o m\xE1s de una esquina.");
    const z0 = fr[0].z;
    const ext = c.doors.filter((d) => d[0] === "z" && Math.abs(d[1] - z0) < 0.02);
    if (!ext.length) Wn.push("No hay puerta de entrada en el frente.");
    if (ext.some((d) => c.tx + 0.55 > d[2] && c.tx - 0.55 < d[3])) E.push("El tablero queda sobre el vano de la puerta de entrada: mu\xE9velo.");
    const adj = (a, b) => {
      const sh = casaShared(a, b);
      return sh && c.doors.concat((c.open || []).filter((o) => o[3] - o[2] >= 0.6)).some((d) => d[0] === sh[0] && Math.abs(d[1] - sh[1]) < 0.02 && d[2] >= sh[2] - 0.02 && d[3] <= sh[3] + 0.02);
    };
    const seen = new Set(fr.filter((r) => ext.some((d) => d[2] >= r.x - 0.02 && d[3] <= r.x + r.w + 0.02)).map((r) => r.id)), q = [...seen];
    while (q.length) {
      const id = q.shift(), a = R.find((r) => r.id === id);
      R.forEach((b) => {
        if (!seen.has(b.id) && adj(a, b)) {
          seen.add(b.id);
          q.push(b.id);
        }
      });
    }
    const off = R.filter((r) => !seen.has(r.id));
    if (ext.length && off.length) Wn.push("Sin acceso por puertas: " + off.map((r) => r.n).join(", ") + ". Usa \xAB\u{1F6AA} Puertas autom\xE1ticas\xBB o agrega una en modo Puertas.");
    if (R.length > 1) {
      const lone = R.filter((a) => !R.some((b) => b !== a && casaShared(a, b)));
      if (lone.length) Wn.push("Recintos sueltos (no tocan a ning\xFAn otro): " + lone.map((r) => r.n).join(", ") + ".");
    }
    return { E, Wn };
  }
  const CC_T = { alumbrado: ["Alumbrado", 100, "B", 0, 1.5], enchufes: ["Enchufes", 250, "C", 0, 2.5], cocina: ["Cocina y lavadero", 250, "C", 16, 2.5], horno: ["Horno o cocina el\xE9ctrica", 0, "C", 16, 2.5], clima: ["Climatizaci\xF3n", 0, "C", 16, 2.5], otro: ["Otro equipo", 0, "C", 0, 2.5] };
  function casaBase(c) {
    const R = casaUse(c), R0 = R.filter((r) => !r.f), z0 = R0.length ? Math.min(...R0.map((r) => r.z)) : 0;
    let cen = 0, enc = 0, sw = 0, hor = 0, La = 0, Le = 0, wet = 0, dmax = 0;
    R.forEach((r) => {
      const d = Math.abs(r.x + r.w / 2 - c.tx) + Math.abs(r.z + r.l / 2 - z0) + 0.6 + (r.f ? FH : 0), mc = cMinC(r), me = cMinE(r);
      dmax = Math.max(dmax, d + Math.max(r.w, r.l) / 2);
      cen += mc;
      enc += me;
      sw++;
      if (r.t === "cocina") hor++;
      if (["cocina", "lavadero"].includes(r.t)) wet += me;
      La += d + 1.6 * (mc - 1) + (WH - 1.1);
      if (me) Le += d + (r.w + r.l) * 0.6 + (WH - 0.3) * me;
    });
    Le += hor * 6;
    return { cen, enc, sw, hor, La, Le, wet, dmax };
  }
  function casaCircAuto(c) {
    const b = casaBase(c), L = Math.max(5, Math.round(b.dmax + 2)), out = [];
    const split = (t, m) => {
      if (t <= 0) return [];
      const n = Math.ceil(t / m), q = Math.floor(t / n), r = t % n;
      return Array.from({ length: n }, (_, i) => q + (i < r ? 1 : 0));
    };
    const mk = (t, n, pts, P) => ({ n, t, pts, P: P || 0, S: CC_T[t][4], In: "auto", L });
    split(b.cen, 19).forEach((n, i, a) => out.push(mk("alumbrado", "Alumbrado" + (a.length > 1 ? " " + (i + 1) : ""), n)));
    split(b.enc - b.wet, 12).forEach((n, i, a) => out.push(mk("enchufes", "Enchufes" + (a.length > 1 ? " " + (i + 1) : ""), n)));
    if (b.wet) out.push(mk("cocina", "Cocina y lavadero", b.wet));
    for (let i = 0; i < b.hor; i++) out.push(mk("horno", "Horno" + (b.hor > 1 ? " " + (i + 1) : ""), 1, 2e3));
    const A = casaUse(c).reduce((a, r) => a + cArea(r), 0), minC = A >= 30 ? 3 : 2;
    while (out.length < minC) {
      const k = out.reduce((bi, x, i) => x.pts > 1 && CC_T[x.t][1] && (bi < 0 || x.pts > out[bi].pts) ? i : bi, -1);
      if (k < 0) break;
      const x = out[k], h = Math.floor(x.pts / 2);
      out.splice(k + 1, 0, Object.assign({}, x, { n: x.n + " B", pts: x.pts - h }));
      x.pts = h;
      x.n += " A";
    }
    return out;
  }
  function casaCircCalc(x) {
    const T0 = CC_T[x.t] || CC_T.otro, P = T0[1] ? (+x.pts || 0) * T0[1] : +x.P || 0, I = P / V0, auto = P > 0 ? chooseIn(I, P, V0, 1, T0[3]) : null, In = x.In === "auto" || !x.In ? auto : +x.In, S0 = +x.S || T0[4], Iz = ampOf(S0), L = +x.L || 0, dv = I > 0 && L > 0 ? 2 * RHO * L * I / S0 / V0 * 100 : 0, E = [], W = [];
    if (!(P > 0)) E.push("sin carga");
    if (S0 < T0[4]) E.push("cable bajo el m\xEDnimo (" + sStr(T0[4]) + " mm\xB2, RIC N\xB004)");
    if (P > 0 && In == null) E.push("ninguna protecci\xF3n comercial sirve: divide el circuito");
    else if (In != null && P > 0 && (In < 1.1 * I - 1e-9 || P > 0.9 * V0 * In + 1e-9)) E.push("protecci\xF3n chica (In ≥ 1,1 \xD7 I y P ≤ 90 % de V \xD7 In)");
    if (In != null && T0[3] && In < T0[3]) E.push("m\xEDnimo " + T0[3] + " A para este circuito (RIC N\xB010)");
    if (In != null && Iz < In) E.push("el cable soporta " + Iz + " A y la protecci\xF3n es de " + In + " A (Iz ≥ In)");
    if (dv > 3) W.push("ca\xEDda " + nf(dv, 2) + " % (deja ≤ 3 % al circuito si el alimentador usa 2 %)");
    if (x.t === "alumbrado" && In != null && In > 10 && S0 <= 1.5) W.push("alumbrado: lo usual es 10 A con 1,5 mm\xB2");
    return { P, I, In, auto, Iz, S: S0, dv, cv: T0[2], E, W, ok: !E.length };
  }
  function casaCircCheck(c) {
    const cs = c.circ || [], b = casaBase(c), A = casaUse(c).reduce((a, r) => a + cArea(r), 0), minC = A >= 30 ? 3 : 2, G = [], Wn = [], rs = cs.map(casaCircCalc);
    if (cs.length < minC) G.push("Una vivienda de " + n1(A) + " m\xB2 necesita al menos " + minC + " circuitos (RIC N\xB010).");
    if (casaUse(c).some((r) => ["cocina", "lavadero"].includes(r.t)) && !cs.some((x) => x.t === "cocina")) G.push("Falta el circuito exclusivo de enchufes de cocina y lavadero (m\xEDnimo 16 A).");
    const pa = cs.filter((x) => x.t === "alumbrado").reduce((a, x) => a + (+x.pts || 0), 0), pe = cs.filter((x) => x.t === "enchufes" || x.t === "cocina").reduce((a, x) => a + (+x.pts || 0), 0);
    if (pa < b.cen) Wn.push("Los circuitos de alumbrado suman " + pa + " centros; el plano necesita al menos " + b.cen + ".");
    if (pe < b.enc) Wn.push("Los circuitos de enchufes suman " + pe + "; el plano necesita al menos " + b.enc + ".");
    if (b.hor && !cs.some((x) => x.t === "horno")) Wn.push("Si la cocina tendr\xE1 horno o cocina el\xE9ctrica, agrega su circuito independiente de 16 A (≥ 1.500 W).");
    const Pi = rs.reduce((a, r) => a + r.P, 0), fd = fdViv(Pi), Ig = nextCom(Math.max(fd.Pd / V0, 25)), nDR = Math.max(1, Math.ceil(cs.length / 3));
    return { rs, G, Wn, Pi, Pd: fd.Pd, Ig, nDR, pil: cs.length >= 4, minC };
  }
  function casaCircHTML(c) {
    if (!Array.isArray(c.circ)) c.circ = casaCircAuto(c);
    const K = casaCircCheck(c), opIn = COM.slice(0, 8);
    const rows = c.circ.map((x, i) => {
      const r = K.rs[i], T0 = CC_T[x.t] || CC_T.otro, st = r.E.length ? pill("bad", "✗ " + r.E.length) : r.W.length ? pill("warn", "⚠") : pill("ok", "✓");
      return '<tr class="' + (r.E.length ? "ccbad" : "") + '"><td><b>C' + (i + 1) + '</b></td><td><input type="text" data-cc="n" data-i="' + i + '" value="' + esc(x.n || "") + '" maxlength="26" aria-label="Nombre"></td><td><select data-cc="t" data-i="' + i + '" aria-label="Uso">' + Object.keys(CC_T).map((t) => '<option value="' + t + '"' + (t === x.t ? " selected" : "") + ">" + CC_T[t][0] + "</option>").join("") + "</select></td><td>" + (T0[1] ? '<input type="number" min="0" max="40" inputmode="numeric" data-cc="pts" data-i="' + i + '" value="' + (+x.pts || 0) + '" aria-label="Puntos" style="width:64px"> <span class="hint">\xD7 ' + T0[1] + " W</span>" : '<input type="number" min="0" step="100" inputmode="numeric" data-cc="P" data-i="' + i + '" value="' + (+x.P || 0) + '" aria-label="Potencia" style="width:84px"> <span class="hint">W</span>') + '</td><td class="num">' + n0(r.P) + ' W<br><span class="hint">' + nf(r.I, 1) + ' A</span></td><td><select data-cc="S" data-i="' + i + '" aria-label="Secci\xF3n">' + [1.5, 2.5, 4, 6, 10].map((v) => '<option value="' + v + '"' + (+x.S === v ? " selected" : "") + ">" + sStr(v) + " mm\xB2</option>").join("") + '</select><br><span class="hint">Iz ' + r.Iz + ' A</span></td><td><select data-cc="In" data-i="' + i + '" aria-label="Protecci\xF3n"><option value="auto"' + (x.In === "auto" ? " selected" : "") + ">" + (r.auto != null ? r.auto + " A (auto)" : "— (auto)") + "</option>" + opIn.map((v) => '<option value="' + v + '"' + (+x.In === v ? " selected" : "") + ">" + v + " A</option>").join("") + '</select><br><span class="hint">curva ' + r.cv + " \xB7 DR" + (Math.floor(i / 3) + 1) + '</span></td><td><input type="number" min="1" max="200" step="1" inputmode="decimal" data-cc="L" data-i="' + i + '" value="' + (+x.L || 0) + '" aria-label="Largo" style="width:64px"><br><span class="hint">ΔV ' + nf(r.dv, 2) + ' %</span></td><td title="' + esc(r.E.concat(r.W).join(" \xB7 ")) + '">' + st + '</td><td><button type="button" class="btn ghost small" data-cs="ccdel" data-i="' + i + '" aria-label="Quitar">✕</button></td></tr>' + (r.E.length || r.W.length ? '<tr class="ccmsg"><td></td><td colspan="9">' + r.E.map((m) => '<span class="bad">✗ ' + esc(m) + "</span>").concat(r.W.map((m) => '<span class="warn">⚠ ' + esc(m) + "</span>")).join(" \xB7 ") + "</td></tr>" : "");
    }).join("");
    const bad = K.rs.filter((r) => !r.ok).length;
    return '<section class="card"><div class="sechead"><h2 style="margin:0">4 \xB7 Circuitos y cables</h2><span class="hint">t\xFA eliges cu\xE1ntos circuitos, su carga, la secci\xF3n del cable y la protecci\xF3n; la app revisa el RIC</span></div>' + kpis([kpi("Circuitos", c.circ.length, "m\xEDn. " + K.minC, c.circ.length >= K.minC ? "ok" : "bad"), kpi("Instalada", n0(K.Pi), "W"), kpi("Demanda", n0(K.Pd), "W"), kpi("General", K.Ig, "A"), kpi("Diferenciales", K.nDR, "m\xE1x. 3 circ. c/u"), kpi("Luz piloto", K.pil ? "S\xED" : "Opcional", K.pil ? "RIC 02, 6.2.14" : "≤ 3 circuitos"), kpi("Con errores", bad, "", bad ? "bad" : "ok")]) + '<div class="tbl-wrap"><table class="pt cct"><thead><tr><th></th><th>Nombre</th><th>Uso</th><th>Puntos / carga</th><th class="num">P</th><th>Cable</th><th>Protecci\xF3n</th><th>Largo (m)</th><th></th><th></th></tr></thead><tbody>' + rows + "</tbody></table></div>" + (K.G.length ? note("<b>Corrige:</b> " + K.G.map(esc).join(" \xB7 "), "bad") : "") + (K.Wn.length ? note(K.Wn.map(esc).join(" \xB7 "), "warn") : "") + (!K.G.length && !bad ? note("✓ Circuitos conformes: secciones m\xEDnimas, Is ≤ In ≤ Iz, regla del 90 % y m\xEDnimos de 16 A en cocina y horno.", "ok") : "") + '<div class="chips" style="margin-top:8px"><button type="button" class="btn small" data-cs="ccadd"' + (c.circ.length >= 12 ? " disabled" : "") + '>+ Circuito</button><button type="button" class="btn ghost small" data-cs="ccauto">' + (casaConf === "ccauto" ? "\xBFReemplazar tus circuitos? Toca otra vez" : "↺ Proponer seg\xFAn el plano") + '</button><button type="button" class="btn ghost small" data-cs="cctg">⚡ Armar este tablero en el juego</button></div><p class="hint">El largo es la distancia aproximada del tablero al punto m\xE1s lejano del circuito; con \xE9l se calcula la ca\xEDda de tensi\xF3n. Los diferenciales se asignan de a 3 circuitos.</p></section>';
  }
  function casaBOMc(c, b, B) {
    const cs = c.circ || [], rs = cs.map(casaCircCalc), K = casaCircCheck(c), P = (g, d, q, u, k) => B.push({ g, d, q: Math.ceil(q), u, k });
    for (let i = B.length - 1; i >= 0; i--) if (B[i].g === "Conductores" || B[i].g === "Tablero") B.splice(i, 1);
    const ML = (b.La * 3 + b.sw * (WH - 1.1)) * 1.1, ME = b.Le * 3 * 1.1, cab = {};
    const ptsA = cs.filter((x) => x.t === "alumbrado").reduce((a, x) => a + (+x.pts || 0), 0) || 1, Pe = rs.reduce((a, r, i) => a + (cs[i].t === "alumbrado" ? 0 : r.P), 0) || 1;
    cs.forEach((x, i) => {
      const m = x.t === "alumbrado" ? ML * (+x.pts || 0) / ptsA : ME * rs[i].P / Pe;
      cab[rs[i].S] = (cab[rs[i].S] || 0) + m;
    });
    Object.keys(cab).sort((a, b2) => a - b2).forEach((s) => P("Conductores", "Cable " + sStr(+s) + " mm\xB2 (fase, neutro, tierra y retornos)", cab[s], "m", "cab:" + s));
    P("Conductores", "Cable 6 mm\xB2 alimentador (fase y neutro, 12 m)", 24, "m", "cab:6");
    const tm = {};
    rs.forEach((r) => {
      const k = (r.In || 16) + " A curva " + r.cv;
      tm[k] = (tm[k] || 0) + 1;
    });
    const nPn = Math.max(0, Math.ceil(cs.length / 3) - (cs.length % 3 === 1 ? 1 : 0)) + (K.nDR > 1 || K.pil ? 1 : 0), mods = 2 + K.nDR * 2 + cs.length + (K.pil ? 3 : 0), modT = [8, 12, 18, 24, 36, 48].find((m) => m >= Math.ceil(mods * 1.25)) || 48;
    P("Tablero", "Interruptor general 2P " + K.Ig + " A curva C", 1, "u", "ig2");
    P("Tablero", "Diferenciales 2P " + ([25, 40, 63].find((x) => x >= K.Ig) || 63) + " A 30 mA clase A", K.nDR, "u", "dr:A");
    Object.keys(tm).forEach((k) => P("Tablero", "Disyuntor 1P " + k, tm[k], "u", "tm"));
    if (K.pil) {
      P("Tablero", "Luz piloto con disyuntor propio 1P+N 6 A (RIC N\xB002, 6.2.14–15)", 1, "u", "pil");
    }
    if (nPn) P("Tablero", "Peines de conexi\xF3n (cortados a medida, con tapas)", nPn, "u", "peine");
    P("Tablero", "Tablero de " + modT + " m\xF3dulos DIN (" + mods + " usados + 25 % reserva)", 1, "u", "tab" + modT);
    P("Tablero", "Barras de neutro (" + K.nDR + ") y barra de tierra", K.nDR + 1, "u", "barra");
    return B;
  }
  function casaEst(c) {
    const R = casaUse(c), R0 = R.filter((r) => !r.f), z0 = R0.length ? Math.min(...R0.map((r) => r.z)) : 0;
    let cen = 0, enc = 0, sw = 0, hor = 0, La = 0, Le = 0, wet = 0;
    R.forEach((r) => {
      const d = Math.abs(r.x + r.w / 2 - c.tx) + Math.abs(r.z + r.l / 2 - z0) + 0.6 + (r.f ? FH : 0), mc = cMinC(r), me = cMinE(r);
      cen += mc;
      enc += me;
      sw++;
      if (r.t === "cocina") hor++;
      if (["cocina", "lavadero"].includes(r.t)) wet += me;
      La += d + 1.6 * (mc - 1) + (WH - 1.1);
      if (me) Le += d + (r.w + r.l) * 0.6 + (WH - 0.3) * me;
    });
    Le += hor * 6;
    const nA = Math.max(1, Math.ceil(cen / 12)), nE = Math.max(1, Math.ceil((enc - wet) / 12)), nC = (wet ? 1 : 0) + hor, nTot = nA + nE + nC;
    const nDR = Math.max(1, Math.ceil(nTot / 3)), mods = 2 + nDR * 2 + nTot + (nTot >= 4 ? 3 : 0), modT = [8, 12, 18, 24, 36, 48].find((m) => m >= Math.ceil(mods * 1.25)) || 48;
    const B = [], P = (g, d, q, u, k) => B.push({ g, d, q: Math.ceil(q), u, k });
    P("Conductores", "Cable 1,5 mm\xB2 (alumbrado: fase, neutro, tierra y retornos)", (La * 3 + sw * (WH - 1.1)) * 1.1, "m", "cab:1.5");
    P("Conductores", "Cable 2,5 mm\xB2 (enchufes y horno: fase, neutro y tierra)", Le * 3 * 1.1, "m", "cab:2.5");
    P("Conductores", "Cable 6 mm\xB2 alimentador (fase y neutro, 12 m)", 24, "m", "cab:6");
    P("Canalizaci\xF3n", "Tubo PVC conduit 16 mm", (La + Le) * 1.1, "m", "tub:pvc16");
    P("Canalizaci\xF3n", "Curvas y uniones", (cen + enc + sw) * 1.5, "u", "curva");
    P("Cajas", "Cajas de derivaci\xF3n", R.length + nTot, "u", "cdev");
    P("Cajas", "Cajas de embutir", sw + enc + hor, "u", "cemb");
    P("Cajas", "Cajas de centro", cen, "u", "ccen");
    P("Aparatos", "Interruptores", sw, "u", "sw");
    P("Aparatos", "Enchufes 2P+T 10/16 A", enc, "u", "out");
    P("Aparatos", "Salida de fuerza para horno", hor, "u", "horno");
    P("Aparatos", "Portal\xE1mparas / centros", cen, "u", "lamp");
    P("Empalmes", "Conectores para empalmes", (R.length + nTot) * 4, "u", "conec");
    P("Tablero", "Interruptor general 2P 25 A curva C", 1, "u", "ig2");
    P("Tablero", "Diferenciales 2P 25 A 30 mA", nDR, "u", "dr:A");
    P("Tablero", "Autom\xE1ticos 1P+N (" + nA + " alumbrado, " + nE + " enchufes" + (nC ? ", " + nC + " cocina/horno" : "") + ")", nTot, "u", "tm");
    P("Tablero", "Tablero de " + modT + " m\xF3dulos DIN", 1, "u", "tab" + modT);
    P("Tablero", "Barra de neutro y barra de tierra", 2, "u", "barra");
    P("Puesta a tierra", 'Barra Copperweld 5/8" con c\xE1mara', 1, "u", "copper");
    P("Puesta a tierra", "Conductor de tierra al electrodo", 5, "m", "tierra");
    P("Mano de obra", "Instalaci\xF3n por punto (referencial)", cen + enc + sw + hor, "u", "mo");
    if (Array.isArray(c.circ) && c.circ.length) casaBOMc(c, { La, Le, sw }, B);
    return { B, cen, enc, sw, hor, nTot: Array.isArray(c.circ) && c.circ.length ? c.circ.length : nTot };
  }
  const CK = 46, CM = 48;
  function casaOver(c) {
    const R = c.rooms, o = /* @__PURE__ */ new Set();
    for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) {
      const a = cBox(R[i]), b = cBox(R[j]);
      if (Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > 0.02 && Math.min(a.z1, b.z1) - Math.max(a.z0, b.z0) > 0.02) {
        o.add(R[i].id);
        o.add(R[j].id);
      }
    }
    return o;
  }
  function casaSVG(c, fr) {
    const R = c.rooms, K = CK, M = CM, ov = casaOver(c), RA = casaAll(c), RO = c.other ? c.other.rooms || [] : [], up = casaAF(c) === 1;
    const b = fr || { x0: Math.min(0, ...RA.map((r) => r.x)), z0: Math.min(0, ...RA.map((r) => r.z)), x1: Math.max(4, ...RA.map((r) => r.x + r.w)), z1: Math.max(4, ...RA.map((r) => r.z + r.l)) };
    const W = (b.x1 - b.x0) * K + M * 2, H = (b.z1 - b.z0) * K + M * 2, X = (x) => M + (x - b.x0) * K, Z = (z) => M + (z - b.z0) * K;
    let g = '<defs><pattern id="cgrid" width="' + K + '" height="' + K + '" patternUnits="userSpaceOnUse" x="' + X(0) + '" y="' + Z(0) + '"><path d="M' + K + " 0H0V" + K + '" fill="none" stroke="#c9d3dc" stroke-width=".6"/></pattern><marker id="ca" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#7c8790"/></marker></defs><rect width="' + W + '" height="' + H + '" fill="#fbfcfd"/><rect width="' + W + '" height="' + H + '" fill="url(#cgrid)"/>';
    RO.forEach((r) => {
      g += '<g pointer-events="none"><rect x="' + X(r.x) + '" y="' + Z(r.z) + '" width="' + r.w * K + '" height="' + r.l * K + '" fill="' + (r.t === "escalera" ? "rgba(140,120,90,.16)" : "none") + '" stroke="#8a96a1" stroke-width="1.2" stroke-dasharray="5 4"/><text x="' + X(r.x + 4 / K) + '" y="' + Z(r.z + 12 / K) + '" font-size="8.5" fill="#8a96a1">' + esc(r.n) + " (piso " + (up ? 1 : 2) + ")</text></g>";
    });
    R.forEach((r) => {
      const sel = r.id === casaSel, bad = ov.has(r.id);
      g += '<rect data-r="' + r.id + '" x="' + X(r.x) + '" y="' + Z(r.z) + '" width="' + r.w * K + '" height="' + r.l * K + '" fill="' + (bad ? "#f6d4d0" : CASA_COL[r.t] || "#eee") + '" stroke="' + (sel ? "#b8621b" : bad ? "#c0392b" : "none") + '" stroke-width="' + (sel ? 3 : bad ? 2 : 1) + '"' + (sel ? ' stroke-dasharray="7 4"' : "") + ' style="cursor:' + (casaMode === "mover" ? sel ? "move" : "pointer" : "crosshair") + '"/>';
    });
    if (R.length) {
      const z0 = Math.min(...R.map((r) => r.z));
      const RB = R.map(cBox), we = +c.we || 0.15, wi = +c.wi || 0.12;
      deriveWalls(RB, c.doors, c.open).forEach((w) => {
        const [a, bb, cc, d] = w, ext = wallKind(RB, w) === "e", sw = Math.max(3, (ext ? we : wi) * K);
        g += '<line x1="' + X(a) + '" y1="' + Z(bb) + '" x2="' + X(cc) + '" y2="' + Z(d) + '" stroke="' + (ext ? "#22272b" : "#3d444a") + '" stroke-width="' + sw.toFixed(1) + '" stroke-linecap="square" pointer-events="none"/>';
        if (casaCotas) {
          const L = Math.hypot(cc - a, d - bb);
          if (L >= 0.6) {
            const mx = X((a + cc) / 2), mz = Z((bb + d) / 2);
            g += '<g pointer-events="none"><rect x="' + (mx - 20) + '" y="' + (mz - 7) + '" width="40" height="14" rx="3" fill="#fff" fill-opacity=".92" stroke="#c9d3dc"/><text x="' + mx + '" y="' + (mz + 4) + '" font-size="9.5" font-weight="700" fill="#4a5661" text-anchor="middle">' + nf(L, 2) + "</text></g>";
          }
        }
      });
      const wsv = casaMode === "muros" ? casaWselValid(c) : null;
      if (wsv) {
        const [ax, v, m0, m1] = wsv.s, hx = ax === "x", P = (t) => hx ? [X(v), Z(t)] : [X(t), Z(v)], [x1, y1] = P(m0), [x2, y2] = P(m1), bw = Math.max(16, wi * K + 12);
        g += '<g pointer-events="none"><line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="rgba(184,98,27,.22)" stroke-width="' + bw + '" stroke-linecap="butt"/>';
        casaSegOpen(c, wsv.s).forEach((o) => {
          [o[2], o[3]].forEach((t) => {
            const [px, py] = P(t);
            g += hx ? '<line x1="' + (px - bw / 2) + '" y1="' + py + '" x2="' + (px + bw / 2) + '" y2="' + py + '" stroke="#b8621b" stroke-width="2.5"/>' : '<line x1="' + px + '" y1="' + (py - bw / 2) + '" x2="' + px + '" y2="' + (py + bw / 2) + '" stroke="#b8621b" stroke-width="2.5"/>';
          });
          const [cx, cy] = P((o[2] + o[3]) / 2), lb = nf(o[3] - o[2], 2) + " m";
          g += '<rect x="' + (cx - 26) + '" y="' + (cy - 9) + '" width="52" height="18" rx="9" fill="#b8621b"/><text x="' + cx + '" y="' + (cy + 4) + '" font-size="10.5" font-weight="800" fill="#fff" text-anchor="middle">' + lb + "</text>";
        });
        g += "</g>";
      }
      c.doors.forEach((d, i) => {
        const [ax, v, m0, m1] = d, L = (m1 - m0) * K;
        const p = ax === "x" ? "M" + X(v) + " " + Z(m0) + " A " + L + " " + L + " 0 0 1 " + (X(v) + L) + " " + (Z(m0) + L) + " L" + X(v) + " " + Z(m0) : "M" + X(m0) + " " + Z(v) + " A " + L + " " + L + " 0 0 0 " + (X(m0) + L) + " " + (Z(v) + L) + " L" + X(m0) + " " + Z(v);
        g += '<path d="' + p + '" fill="rgba(184,98,27,.08)" stroke="#b8621b" stroke-width="1.2" pointer-events="none"/>';
        g += '<line data-d="' + i + '" x1="' + (ax === "x" ? X(v) : X(m0)) + '" y1="' + (ax === "x" ? Z(m0) : Z(v)) + '" x2="' + (ax === "x" ? X(v) : X(m1)) + '" y2="' + (ax === "x" ? Z(m1) : Z(v)) + '" stroke="' + (casaMode === "puertas" ? "rgba(174,42,33,.55)" : "transparent") + '" stroke-width="14"' + (casaMode === "puertas" ? "" : ' pointer-events="none"') + "/>";
      });
      R.filter((r) => r.t === "escalera").forEach((r) => {
        const sp = stairPlanSVG({ x0: r.x, x1: r.x + r.w, z0: r.z, z1: r.z + r.l, sk: r.sk, sd: r.sd }, X, Z, "#8c7a5c", 1, up);
        g += '<g pointer-events="none">' + sp.svg + '<text x="' + X(sp.top[0]) + '" y="' + (Z(sp.top[1]) - 6) + '" font-size="8.5" font-weight="800" fill="#5c4a2c" text-anchor="middle">' + (up ? "BAJA" : "SUBE") + "</text></g>";
      });
      R.forEach((r) => {
        const cx = X(r.x + r.w / 2), cz = Z(r.z + r.l / 2), fs = Math.max(8, Math.min(12, r.w * K / 9));
        g += '<g pointer-events="none" text-anchor="middle" fill="#25313b"><text x="' + cx + '" y="' + (cz - 4) + '" font-size="' + fs + '" font-weight="800">' + esc(r.n) + '</text><text x="' + cx + '" y="' + (cz + fs + 1) + '" font-size="' + (fs - 1) + '">' + nf(r.w, 2) + " \xD7 " + nf(r.l, 2) + " m \xB7 " + n1(cArea(r)) + " m\xB2</text></g>";
      });
      const s = R.find((r) => r.id === casaSel);
      if (s && casaMode === "mover") {
        const x0 = X(s.x), x1 = X(s.x + s.w), y0 = Z(s.z), y1 = Z(s.z + s.l);
        g += '<g pointer-events="none" font-size="11" font-weight="800" fill="#b8621b" text-anchor="middle"><line x1="' + x0 + '" y1="' + (y1 + 14) + '" x2="' + x1 + '" y2="' + (y1 + 14) + '" stroke="#b8621b" marker-start="url(#ca)" marker-end="url(#ca)"/><rect x="' + ((x0 + x1) / 2 - 26) + '" y="' + (y1 + 7) + '" width="52" height="14" rx="3" fill="#fff"/><text x="' + (x0 + x1) / 2 + '" y="' + (y1 + 18) + '">' + nf(s.w, 2) + ' m</text><line x1="' + (x1 + 14) + '" y1="' + y0 + '" x2="' + (x1 + 14) + '" y2="' + y1 + '" stroke="#b8621b" marker-start="url(#ca)" marker-end="url(#ca)"/><rect x="' + (x1 + 1) + '" y="' + ((y0 + y1) / 2 - 7) + '" width="52" height="14" rx="3" fill="#fff"/><text x="' + (x1 + 27) + '" y="' + ((y0 + y1) / 2 + 4) + '">' + nf(s.l, 2) + " m</text></g>";
        g += '<g data-h="' + s.id + '" style="cursor:nwse-resize"><circle cx="' + x1 + '" cy="' + y1 + '" r="16" fill="transparent"/><circle cx="' + x1 + '" cy="' + y1 + '" r="9" fill="#b8621b" stroke="#fff" stroke-width="2" pointer-events="none"/><path d="M' + (x1 - 4) + " " + (y1 - 4) + "L" + (x1 + 4) + " " + (y1 + 4) + '" stroke="#fff" stroke-width="1.6" pointer-events="none"/></g>';
      }
      const ex = Math.max(...R.map((r) => r.x + r.w)), mx = Math.min(...R.map((r) => r.x)), ez = Math.max(...R.map((r) => r.z + r.l));
      g += '<g font-size="11" fill="#5a6772" text-anchor="middle" pointer-events="none"><line x1="' + X(mx) + '" y1="' + (Z(z0) - 26) + '" x2="' + X(ex) + '" y2="' + (Z(z0) - 26) + '" stroke="#7c8790" marker-start="url(#ca)" marker-end="url(#ca)"/><text x="' + (X(mx) + X(ex)) / 2 + '" y="' + (Z(z0) - 31) + '" font-weight="700">' + nf(ex - mx, 2) + ' m \xB7 frente (calle)</text><line x1="' + (X(mx) - 24) + '" y1="' + Z(z0) + '" x2="' + (X(mx) - 24) + '" y2="' + Z(ez) + '" stroke="#7c8790" marker-start="url(#ca)" marker-end="url(#ca)"/><text transform="translate(' + (X(mx) - 30) + " " + (Z(z0) + Z(ez)) / 2 + ') rotate(-90)" font-weight="700">' + nf(ez - z0, 2) + " m</text></g>";
      if (!up) g += '<g pointer-events="none"><rect x="' + (X(c.tx) - 0.45 * K) + '" y="' + (Z(z0) + 3) + '" width="' + 0.9 * K + '" height="9" fill="#1d2329"/><text x="' + X(c.tx) + '" y="' + (Z(z0) + 24) + '" text-anchor="middle" font-size="10" font-weight="800" fill="#1d2329">TABLERO</text><rect x="' + (X(c.tx - 1) - 6) + '" y="' + (Z(z0) - 14) + '" width="12" height="10" fill="#ddd" stroke="#555"/></g>';
      if (casaMode === "tablero" && !up) g += '<line data-front="1" x1="' + X(mx) + '" y1="' + Z(z0) + '" x2="' + X(ex) + '" y2="' + Z(z0) + '" stroke="rgba(31,95,191,.35)" stroke-width="18"/>';
    }
    return '<svg id="casasvg" viewBox="0 0 ' + W + " " + H + '" data-b="' + [b.x0, b.z0, b.x1, b.z1].join(",") + '" role="img" aria-label="Plano de la vivienda">' + g + "</svg>";
  }
  function casaPt(e) {
    const sv = document.getElementById("casasvg");
    if (!sv) return null;
    const rc = sv.getBoundingClientRect(), vb = sv.viewBox.baseVal, b = sv.dataset.b.split(",").map(Number);
    const sc = Math.min(rc.width / vb.width, rc.height / vb.height), ox = rc.left + (rc.width - vb.width * sc) / 2, oy = rc.top + (rc.height - vb.height * sc) / 2;
    return { x: b[0] + ((e.clientX - ox) / sc - CM) / CK, z: b[1] + ((e.clientY - oy) / sc - CM) / CK, b, px: sc * CK };
  }
  const STEPS = [0.05, 0.1, 0.25, 0.5];
  const casaFld = (id, f, v, lab, extra) => '<label class="cif"><span>' + lab + '</span><input id="' + id + '" type="number" inputmode="decimal" step="' + casaStep + '" data-ci="' + f + '" value="' + rd(v) + '"' + (extra || "") + "></label>";
  function casaWallList(c, s) {
    const sides = [["Arriba", "z", s.z, s.x, s.x + s.w], ["Abajo", "z", s.z + s.l, s.x, s.x + s.w], ["Izquierda", "x", s.x, s.z, s.z + s.l], ["Derecha", "x", s.x + s.w, s.z, s.z + s.l]];
    const rows = sides.map(([nm, ax, v, a0, a1]) => {
      const nb = c.rooms.filter((o) => o !== s).map((o) => [o, casaShared(s, o)]).filter(([o, sh]) => sh && sh[0] === ax && Math.abs(sh[1] - v) < 0.02);
      const shared = nb.reduce((a, [o, sh]) => a + (sh[3] - sh[2]), 0), ext = Math.max(0, a1 - a0 - shared);
      const items = nb.map(([o, sh]) => {
        const k = [ax, rd(sh[1]), rd(sh[2]), rd(sh[3])], op = (c.open || []).some((q) => q[0] === ax && Math.abs(q[1] - sh[1]) < 0.02 && q[3] > sh[2] + 0.02 && q[2] < sh[3] - 0.02), dr = c.doors.filter((d) => d[0] === ax && Math.abs(d[1] - sh[1]) < 0.02 && d[3] > sh[2] && d[2] < sh[3]).length;
        const inf = casaSegInfo(c, k);
        return '<span class="cwi">con <b>' + esc(o.n) + "</b> " + nf(sh[3] - sh[2], 2) + " m · " + (inf.len > 0 ? (inf.pct >= 100 ? "sin muro" : "abierto " + inf.pct + " %") : dr ? "muro con puerta" : "muro") + ' <button type="button" class="chip" data-cs="wsel" data-k="' + s.id + "," + o.id + '">\u270F Abertura</button></span>';
      }).join("");
      return '<div class="cwr"><b>' + nm + '</b> <span class="hint">' + nf(a1 - a0, 2) + " m" + (ext > 0.02 ? " · " + nf(ext, 2) + " m exterior (" + nf(+c.we || 0.15, 2) + " m)" : "") + "</span>" + items + "</div>";
    }).join("");
    return '<details class="cwl" open><summary>Muros y separaciones de este recinto</summary>' + rows + "</details>";
  }
  function casaInspector(c) {
    const s = c.rooms.find((r) => r.id === casaSel), ts = (v, at) => '<select ' + at + ">" + Object.entries(TIPOS_REC).map(([k, t]) => '<option value="' + k + '"' + (k === v ? " selected" : "") + ">" + t + "</option>").join("") + "</select>";
    const st = nf(casaStep, 2).replace(/0$/, "");
    if (s) return '<div class="casains"><div class="cih"><b>✏ ' + esc(s.n) + '</b><span class="hint">' + n1(cArea(s)) + " m\xB2 \xB7 per\xEDmetro " + nf(2 * (s.w + s.l), 2) + " m \xB7 m\xEDn. RIC: " + cMinC(s) + " centro(s), " + cMinE(s) + ' enchufe(s)</span><button type="button" class="chip" data-cs="desel" aria-label="Cerrar">✕</button></div><div class="cigrid"><label class="cif cwide"><span>Nombre</span><input id="ci-n" type="text" data-ci="n" maxlength="40" value="' + esc(s.n) + '"></label><label class="cif"><span>Tipo</span>' + ts(s.t, 'id="ci-t" data-ci="t"') + "</label>" + casaFld("ci-w", "w", s.w, "Ancho (m)", ' min="0.9" max="30"') + casaFld("ci-l", "l", s.l, "Largo (m)", ' min="0.9" max="30"') + casaFld("ci-x", "x", s.x, "Posici\xF3n X (m)") + casaFld("ci-z", "z", s.z, "Posici\xF3n Z (m)") + (s.t === "escalera" ? '<label class="cif"><span>Tipo de escalera</span><select data-ci="sk" aria-label="Tipo de escalera">' + [["recta", "Recta"], ["L", "En L (con descanso)"], ["caracol", "Caracol"]].map(([k, l]) => '<option value="' + k + '"' + ((s.sk || "recta") === k ? " selected" : "") + ">" + l + "</option>").join("") + '</select></label><label class="cif"><span>Sentido de subida</span><select data-ci="sd" aria-label="Sentido de subida">' + (s.sk === "L" ? [["der", "Gira a la derecha"], ["izq", "Gira a la izquierda"]] : s.sk === "caracol" ? [["der", "Horario"], ["izq", "Antihorario"]] : [["", "Autom\xE1tico"], ["N", "Sube hacia arriba del plano"], ["S", "Sube hacia abajo del plano"], ["O", "Sube hacia la izquierda"], ["E", "Sube hacia la derecha"]]).map(([k, l]) => '<option value="' + k + '"' + ((s.sd || (s.sk === "L" || s.sk === "caracol" ? "der" : "")) === k ? " selected" : "") + ">" + l + "</option>").join("") + "</select></label>" : "") + '</div><div class="cinud"><div><span class="hint">Mover ' + st + ' m</span><button type="button" class="chip" data-cs="nud" data-k="-1,0" aria-label="Izquierda">←</button><button type="button" class="chip" data-cs="nud" data-k="0,-1" aria-label="Arriba">↑</button><button type="button" class="chip" data-cs="nud" data-k="0,1" aria-label="Abajo">↓</button><button type="button" class="chip" data-cs="nud" data-k="1,0" aria-label="Derecha">→</button></div><div><span class="hint">Ancho</span><button type="button" class="chip" data-cs="siz" data-k="w,-1">−</button><button type="button" class="chip" data-cs="siz" data-k="w,1">+</button><span class="hint">Largo</span><button type="button" class="chip" data-cs="siz" data-k="l,-1">−</button><button type="button" class="chip" data-cs="siz" data-k="l,1">+</button></div></div>' + casaWallList(c, s) + '<div class="chips"><button type="button" class="chip" data-cs="dup">⧉ Duplicar al lado</button><button type="button" class="chip bad" data-cs="del">\u{1F5D1} Eliminar recinto</button></div></div>';
    const nw = casaNew, refs = '<option value="">toda la casa</option>' + c.rooms.map((r) => '<option value="' + r.id + '"' + (r.id === nw.ref ? " selected" : "") + ">" + esc(r.n) + "</option>").join("");
    const pos = [["der", "a la derecha de"], ["aba", "debajo de"], ["izq", "a la izquierda de"], ["arr", "arriba de"]].map(([k, t]) => '<option value="' + k + '"' + (k === nw.pos ? " selected" : "") + ">" + t + "</option>").join("");
    return '<div class="casains"><div class="cih"><b>＋ Nuevo recinto</b><span class="hint">o toca un recinto del plano para editarlo</span></div><div class="cigrid"><label class="cif"><span>Tipo</span>' + ts(nw.t, 'id="cn-t" data-cn="t"') + '</label><label class="cif"><span>Nombre</span><input id="cn-n" type="text" data-cn="n" maxlength="40" placeholder="' + esc(TIPOS_REC[nw.t] || "Recinto") + '" value="' + esc(nw.n) + '"></label><label class="cif"><span>Ancho (m)</span><input id="cn-w" type="number" inputmode="decimal" step="0.05" min="0.9" max="30" data-cn="w" value="' + nw.w + '"></label><label class="cif"><span>Largo (m)</span><input id="cn-l" type="number" inputmode="decimal" step="0.05" min="0.9" max="30" data-cn="l" value="' + nw.l + '"></label><label class="cif"><span>Ubicar</span><select id="cn-p" data-cn="pos">' + pos + '</select></label><label class="cif"><span>De</span><select id="cn-r" data-cn="ref">' + refs + '</select></label></div><div class="chips"><button type="button" class="btn small" data-cs="addgo">＋ Agregar recinto</button></div></div>';
  }
  function casaWrap(c, ck) {
    const up = casaAF(c) === 1;
    if (up && casaMode === "tablero") casaMode = "mover";
    const fls = c.other ? '<span class="cfl" role="group" aria-label="Piso">' + [0, 1].map((f) => '<button type="button" class="chip' + (casaAF(c) === f ? " on" : "") + '" data-cs="fl" data-k="' + f + '" aria-pressed="' + (casaAF(c) === f) + '">Piso ' + (f + 1) + "</button>").join("") + '<button type="button" class="chip bad" data-cs="rm2" title="Quitar el 2.\xBA piso">' + (casaConf === "rm2" ? "\xBFQuitar el 2.\xBA piso? Toca otra vez" : "✕ 2.\xBA piso") + '</button></span><span class="cbsep"></span>' : '<button type="button" class="chip" data-cs="add2" title="Agregar un segundo piso">＋ 2.\xBA piso</button><span class="cbsep"></span>';
    const modes = fls + [["mover", "✋ Mover"], ["muros", "\u{1F9F1} Muros"], ["puertas", "\u{1F6AA} Puertas"]].concat(up ? [] : [["tablero", "▣ Tablero"]]).map(([k, t]) => '<button type="button" class="chip' + (casaMode === k ? " on" : "") + '" data-cs="mode" data-k="' + k + '" aria-pressed="' + (casaMode === k) + '">' + t + "</button>").join("");
    const hint = { mover: casaSel ? "Arrastra el recinto marcado para moverlo o el punto naranjo para cambiar su tama\xF1o. Se ajusta a la grilla y a los muros vecinos." : "Toca un recinto para seleccionarlo; despu\xE9s podr\xE1s arrastrarlo o escribir sus medidas.", muros: "Toca un muro interior y elige en el panel qu\xE9 parte quitar: porcentaje, largo y ubicaci\xF3n (cocina americana, living-comedor integrado, arco al pasillo\u2026). Los muros exteriores no se abren.", puertas: "Toca un muro para poner una puerta (0,8 m; 0,9 m en el frente). Toca una puerta roja para quitarla.", tablero: "Toca el muro del frente (l\xEDnea azul) donde ir\xE1 el tablero." }[casaMode];
    const msg = (c.other ? note("<b>Editando el piso " + (casaAF(c) + 1) + ".</b> " + (up ? "El otro piso se ve punteado como referencia. La escalera debe quedar exactamente sobre la del 1.\xBA piso; el tablero general queda en el 1.\xBA piso." : "El 2.\xBA piso se ve punteado como referencia. Cambia de piso con los botones Piso 1 / Piso 2."), "info") : "") + (casaMsg ? note(esc(casaMsg), "ok") : "") + (ck.E.length ? note("<b>Corrige:</b> " + ck.E.map(esc).join(" \xB7 "), "bad") : "") + (ck.Wn.length ? note(ck.Wn.map(esc).join(" \xB7 "), "warn") : "") + (!ck.E.length && !ck.Wn.length ? note("✓ Plano listo: sin superposiciones, todos con acceso y tablero en el frente.", "ok") : "");
    casaMsg = "";
    return '<div id="casawrap" class="casawrap' + (casaFull ? " full" : "") + '"><div class="casabar">' + modes + '<span class="cbsep"></span><button type="button" class="chip" data-cs="add" title="Nuevo recinto">＋ Recinto</button><button type="button" class="chip" data-cs="auto" title="Puertas autom\xE1ticas">\u{1F6AA} Auto</button><button type="button" class="chip" data-cs="undo"' + (casaHist.length ? "" : " disabled") + ' title="Deshacer">↶</button><label class="chip cstep" title="Im\xE1n de la grilla">Im\xE1n <select data-cf="step" aria-label="Im\xE1n">' + STEPS.map((v) => '<option value="' + v + '"' + (v === casaStep ? " selected" : "") + ">" + nf(v, 2) + " m</option>").join("") + '</select></label><button type="button" class="chip' + (casaCotas ? " on" : "") + '" data-cs="cotas" aria-pressed="' + casaCotas + '">\u{1F4CF} Cotas</button><label class="chip cstep" title="Espesor de muros exteriores">Muro ext. <select data-cf="we" aria-label="Espesor muros exteriores">' + [0.1, 0.12, 0.15, 0.2, 0.25, 0.3].map((v) => '<option value="' + v + '"' + (Math.abs(v - (+c.we || 0.15)) < 1e-6 ? " selected" : "") + ">" + nf(v, 2) + " m</option>").join("") + '</select></label><label class="chip cstep" title="Espesor de tabiques interiores">Tabique <select data-cf="wi" aria-label="Espesor tabiques">' + [0.07, 0.1, 0.12, 0.15].map((v) => '<option value="' + v + '"' + (Math.abs(v - (+c.wi || 0.12)) < 1e-6 ? " selected" : "") + ">" + nf(v, 2) + " m</option>").join("") + '</select></label><button type="button" class="chip on" data-cs="full">' + (casaFull ? "✕ Salir" : "⛶ Pantalla completa") + '</button></div><p class="hint casahint">' + hint + '</p><div class="casaplan" id="casaplan">' + casaSVG(c) + '</div><div class="casamsg">' + msg + "</div>" + (casaMode === "muros" ? casaWallEditor(c) : casaInspector(c)) + "</div>";
  }
  function pgCasa() {
    if (!S.casa) S.casa = casaDef();
    if (!Array.isArray(S.casa.circ)) S.casa.circ = casaCircAuto(S.casa);
    const c = S.casa, ck = casaCheck(c), A = casaUse(c).reduce((a, r) => a + cArea(r), 0), est = casaEst(c), two = !!c.other;
    if (casaSel && !c.rooms.some((r) => r.id === casaSel)) casaSel = null;
    const rows = casaAll(c).sort((a, b) => a.f - b.f).map((r) => '<tr class="' + (r.id === casaSel ? "csel" : "") + '"><td><b>' + esc(r.n) + "</b>" + (two ? ' <span class="hint">\xB7 piso ' + (r.f + 1) + (r.f && r.t === "escalera" ? " (vac\xEDo)" : "") + "</span>" : "") + "</td><td>" + (TIPOS_REC[r.t] || r.t) + '</td><td class="num">' + nf(r.w, 2) + " \xD7 " + nf(r.l, 2) + '</td><td class="num">' + n1(cArea(r)) + '</td><td class="num">' + cMinC(r) + " / " + cMinE(r) + '</td><td style="white-space:nowrap"><button type="button" class="btn ghost small" data-cs="sel" data-id="' + r.id + '" title="Editar">✏</button><button type="button" class="btn ghost small" data-cs="delid" data-id="' + r.id + '" title="Eliminar">\u{1F5D1}</button></td></tr>').join("");
    const tpl = CASA_TPL.map(([k, t, d]) => '<button type="button" class="tpl" data-cs="tpl" data-k="' + k + '"><span class="ti">\u{1F4D0}</span><span class="tt">' + (casaConf === "tpl:" + k ? "\xBFReemplazar el plano? Toca otra vez" : t) + '</span><span class="td">' + d + "</span></button>").join("");
    const cs = s2HasWork() && casaConf === "sim" ? "\xBFReemplazar la instalaci\xF3n actual del 3D? Toca otra vez" : "▶ Usar en el Simulador 3D";
    const R0 = casaAll(c).filter((r) => !r.f), front = R0.length ? Math.min(...R0.map((r) => r.x)) : 0;
    return '<p class="eyebrow">Simulador \xB7 proyecto real</p><h1>Dise\xF1ar mi vivienda</h1><p class="lead">Dibuja el plano con las medidas reales: recintos, puertas y ubicaci\xF3n del tablero. La app calcula superficies, los puntos m\xEDnimos RIC N\xB010 por recinto y un presupuesto preliminar. Despu\xE9s p\xE1salo al Simulador 3D para instalar punto por punto y obtener el listado exacto de materiales y costos en Reportes.</p>' +
      '<section class="card"><h2>1 \xB7 Partir de</h2><div class="tpls">' + tpl + "</div></section>" +
      '<section class="card"><div class="sechead"><h2 style="margin:0">2 \xB7 Plano</h2><div class="field" style="margin:0;min-width:180px"><input type="text" data-cf="hn" value="' + esc(c.n || "") + '" aria-label="Nombre del proyecto" placeholder="Nombre del proyecto"></div></div>' + casaWrap(c, ck) +
      kpis([kpi("Superficie", n1(A), "m\xB2"), kpi("Recintos", casaUse(c).length), kpi(two ? "Pisos" : "Puertas", two ? 2 : c.doors.length), kpi("Centros m\xEDn.", est.cen), kpi("Enchufes m\xEDn.", est.enc), kpi("Circuitos m\xEDn.", A >= 30 ? Math.max(3, est.nTot) : est.nTot)]) + "</section>" +
      '<section class="card"><h2>3 \xB7 Cuadro de recintos</h2><div class="tbl-wrap"><table class="pt casat"><thead><tr><th>Recinto</th><th>Tipo</th><th>Medidas (m)</th><th>m\xB2</th><th>M\xEDn. RIC</th><th></th></tr></thead><tbody>' + rows + '</tbody><tfoot><tr><td colspan="3"><b>Total</b></td><td class="num"><b>' + n1(A) + '</b></td><td class="num">' + est.cen + " / " + est.enc + '</td><td></td></tr></tfoot></table></div><p class="hint">M\xEDn. RIC: centros de luz / enchufes seg\xFAn RIC N\xB010 (5.2.2 y 5.2.3).</p><div class="field" style="max-width:300px;margin-top:10px"><label>Tablero: distancia desde la esquina izquierda del frente (m)</label><input type="number" inputmode="decimal" step="0.05" data-cf="tx" value="' + rd(c.tx - front) + '"></div></section>' +
      '' + casaCircHTML(c) + '<section class="card"><h2>5 \xB7 Presupuesto preliminar</h2><p class="hint">Estimaci\xF3n con los puntos m\xEDnimos RIC y recorridos aproximados desde el tablero. Los precios son referenciales (CLP) y puedes cambiarlos aqu\xED o en Reportes; se guardan para todo el proyecto. El listado exacto sale al instalar en el 3D.</p>' + bomTable(est.B, true) + '<div class="chips" style="margin-top:8px"><button type="button" class="chip" data-cs="prst">↺ Restaurar precios</button></div></section>' +
      '<section class="card"><h2>6 \xB7 Usar el plano</h2><div class="chips"><button type="button" class="btn calc" data-cs="sim"' + (ck.E.length ? " disabled" : "") + ">" + cs + '</button><button type="button" class="btn ghost" data-cs="p2"' + (ck.E.length ? " disabled" : "") + ">" + (casaConf === "p2" ? "\xBFReemplazar los recintos del paso 2? Toca otra vez" : "→ Enviar recintos al paso 2") + "</button></div>" + (ck.E.length ? '<p class="hint">Corrige los errores del plano para continuar.</p>' : "") +
      learn("Qu\xE9 revisa la RIC en el plano", '<ul class="hand"><li><b>Centros de luz (RIC N\xB010, 5.2.2):</b> 1 por recinto hasta 10 m\xB2 y 2 sobre 10 m\xB2.</li><li><b>Enchufes (RIC N\xB010, 5.2.3):</b> dormitorios y living 1 cada 8 m de per\xEDmetro (o fracci\xF3n); cocina 3; lavadero 1.</li><li><b>Circuitos:</b> una vivienda de 30 m\xB2 o m\xE1s necesita al menos 3 (alumbrado, enchufes y cocina/lavadero), cada uno con diferencial de 30 mA.</li><li><b>Tablero:</b> en un lugar accesible, cerca del acceso y del medidor, nunca en ba\xF1os ni sobre el vano de una puerta.</li><li><b>Ba\xF1os:</b> respeta los vol\xFAmenes de seguridad: nada de enchufes cerca de la tina o ducha.</li></ul>') + learn("Viviendas de 2 pisos: instrucciones b\xE1sicas", '<ol class="hand"><li><b>Un solo empalme y tablero general</b> en el 1.\xBA piso, en lugar accesible, cerca del acceso y del medidor. Si el 2.\xBA piso es grande o est\xE1 lejos, se recomienda un <b>tablero de distribuci\xF3n</b> en el 2.\xBA piso alimentado desde el general con su propio autom\xE1tico.</li><li><b>Circuitos por piso:</b> separa alumbrado y enchufes de cada piso (por ejemplo, C1 alumbrado 1.\xBA piso, C2 alumbrado 2.\xBA piso, C3 y C4 enchufes). As\xED una falla no deja a oscuras toda la casa y la ca\xEDda de tensi\xF3n se controla mejor.</li><li><b>Montante:</b> las canalizaciones suben por un ducto vertical cerca del tablero o por un tabique, con <b>cajas de registro</b> en cada piso; nunca cables sueltos dentro de la losa o el entrepiso sin tubo.</li><li><b>Escalera:</b> la luz se comanda desde ambos niveles con un par de interruptores <b>9/24</b> (combinaci\xF3n). Ubica la luminaria donde se pueda cambiar la ampolleta sin riesgo de ca\xEDda (muro o descanso, no sobre el vac\xEDo).</li><li><b>Ca\xEDda de tensi\xF3n:</b> el largo de cada circuito incluye el tramo vertical (≈ ' + nf(FH, 2) + ' m por piso); revisa que no supere el 3 % (RIC N\xB003).</li><li><b>Puesta a tierra \xFAnica:</b> un solo electrodo y una barra PE en el tablero general; el conductor de protecci\xF3n llega a todos los circuitos de ambos pisos y al tablero del 2.\xBA piso (RIC N\xB006).</li><li><b>Protecci\xF3n diferencial:</b> 30 mA en todos los circuitos de alumbrado y enchufes, en especial los ba\xF1os de ambos pisos (RIC N\xB010, 5.1.3.5).</li><li><b>Puntos m\xEDnimos</b> se calculan por recinto en cada piso igual que en un piso; el vac\xEDo de la escalera del 2.\xBA piso no cuenta como recinto.</li></ol><p class="hint">En el Simulador 3D ver\xE1s ambos pisos, la escalera y el montante; usa los botones Piso 1 / Piso 2 / Todo para trabajar en cada nivel.</p>') + "</section>";
  }
  function s2HasWork() {
    return !!(S.sim2 && (S.sim2.items.length || S.sim2.circuits.length));
  }
  function casaEdgeAt(c, p) {
    let best = null;
    c.rooms.forEach((r) => {
      const b = cBox(r);
      [["z", b.z0, b.x0, b.x1, p.x, p.z], ["z", b.z1, b.x0, b.x1, p.x, p.z], ["x", b.x0, b.z0, b.z1, p.z, p.x], ["x", b.x1, b.z0, b.z1, p.z, p.x]].forEach(([ax, v, a, bb, t, o]) => {
        if (t < a || t > bb) return;
        const d = Math.abs(o - v);
        if (d < 0.35 && (!best || d < best.d)) best = { d, ax, v, a, b: bb, t, r };
      });
    });
    if (!best) return null;
    let segs = [[best.a, best.b]], shared = null;
    c.rooms.forEach((o) => {
      if (o === best.r) return;
      const sh = casaShared(best.r, o);
      if (!sh || sh[0] !== best.ax || Math.abs(sh[1] - best.v) > 0.02) return;
      if (best.t >= sh[2] && best.t <= sh[3]) shared = [sh[2], sh[3]];
      segs = segs.flatMap(([a, b]) => sh[3] <= a || sh[2] >= b ? [[a, b]] : [[a, sh[2]], [sh[3], b]].filter(([x, y]) => y - x > 0.02));
    });
    const iv = shared || segs.find(([a, b]) => best.t >= a && best.t <= b);
    return iv ? { ax: best.ax, v: best.v, a: iv[0], b: iv[1], t: best.t, ext: !shared } : null;
  }
  function casaSegOpen(c, s) {
    return (c.open || []).filter((o) => o[0] === s[0] && Math.abs(o[1] - s[1]) < 0.02 && o[3] > s[2] + 0.01 && o[2] < s[3] - 0.01);
  }
  function casaSegInfo(c, s) {
    const L = s[3] - s[2], op = casaSegOpen(c, s), len = Math.min(L, op.reduce((a, o) => a + Math.min(o[3], s[3]) - Math.max(o[2], s[2]), 0)), free = L - len, off = op.length ? Math.max(0, Math.min(...op.map((o) => o[2])) - s[2]) : 0;
    return { L, len, pct: L > 0 ? Math.round(len / L * 100) : 0, pos: free > 0.005 ? Math.max(0, Math.min(100, Math.round(off / free * 100))) : 50, n: op.length };
  }
  function casaSetSeg(c, s, len, pos) {
    const L = s[3] - s[2];
    len = Math.max(0, Math.min(L, +len || 0));
    if (L - len < 0.05) len = L;
    if (len < 0.05) len = 0;
    c.open = (c.open || []).filter((o) => !(o[0] === s[0] && Math.abs(o[1] - s[1]) < 0.02 && o[3] > s[2] + 0.01 && o[2] < s[3] - 0.01));
    if (len > 0) {
      const a = rd(s[2] + (L - len) * Math.max(0, Math.min(100, pos)) / 100);
      c.open.push([s[0], rd(s[1]), a, rd(Math.min(s[3], a + len))]);
    }
  }
  function casaSegs(c) {
    const out = [];
    c.rooms.forEach((a, i) => c.rooms.forEach((b, j) => {
      if (j <= i) return;
      const sh = casaShared(a, b);
      if (sh) out.push({ s: [sh[0], rd(sh[1]), rd(sh[2]), rd(sh[3])], ids: [a.id, b.id], A: a, B: b });
    }));
    return out;
  }
  function casaWselValid(c) {
    if (!casaWsel || !c) return null;
    const A = c.rooms.find((r) => r.id === casaWsel.ids[0]), B = c.rooms.find((r) => r.id === casaWsel.ids[1]), sh = A && B ? casaShared(A, B) : null;
    if (!sh) return null;
    return { s: [sh[0], rd(sh[1]), rd(sh[2]), rd(sh[3])], A, B };
  }
  function casaSegAt(c, ed) {
    return casaSegs(c).find((q) => q.s[0] === ed.ax && Math.abs(q.s[1] - ed.v) < 0.02 && ed.t >= q.s[2] - 0.02 && ed.t <= q.s[3] + 0.02) || null;
  }
  function casaSnapNear(c, p) {
    let best = null;
    c.rooms.forEach((r) => {
      const b = cBox(r);
      [["x", 1, b.x1, b.z0, b.z1, p.z, p.x], ["x", 0, b.x0, b.z0, b.z1, p.z, p.x], ["z", 1, b.z1, b.x0, b.x1, p.x, p.z], ["z", 0, b.z0, b.x0, b.x1, p.x, p.z]].forEach(([ax, hi, v, a, bb, t, o]) => {
        if (t < a || t > bb) return;
        const d = Math.abs(o - v);
        if (d < 0.35 && (!best || d < best.d)) best = { d, ax, hi, v, a, b: bb, r };
      });
    });
    if (!best) return null;
    let tg = null;
    c.rooms.forEach((o) => {
      if (o === best.r) return;
      const ob = cBox(o), ov = best.ax === "x" ? best.hi ? ob.x0 : ob.x1 : best.hi ? ob.z0 : ob.z1, m0 = best.ax === "x" ? Math.max(best.a, ob.z0) : Math.max(best.a, ob.x0), m1 = best.ax === "x" ? Math.min(best.b, ob.z1) : Math.min(best.b, ob.x1), dd = Math.abs(ov - best.v);
      if (dd > 0.02 && dd <= 0.3 && m1 - m0 > 0.3 && (!tg || dd < tg.dd)) tg = { o, ov, dd };
    });
    if (!tg) return null;
    const r = best.r, r0 = Object.assign({}, r), d = tg.ov - best.v;
    if (best.ax === "x") {
      if (best.hi) r.w = rd(r.w + d);
      else { r.x = rd(r.x + d); r.w = rd(r.w - d); }
    } else {
      if (best.hi) r.l = rd(r.l + d);
      else { r.z = rd(r.z + d); r.l = rd(r.l - d); }
    }
    if (r.w < 0.9 || r.l < 0.9 || casaOver(c).has(r.id)) {
      Object.assign(r, r0);
      return null;
    }
    return "\xAB" + r.n + "\xBB y \xAB" + tg.o.n + "\xBB ten\xEDan " + nf(tg.dd, 2) + " m de " + (d * (best.hi ? 1 : -1) > 0 ? "separaci\xF3n" : "traslape") + ": ajust\xE9 \xAB" + r.n + "\xBB para que compartan el muro. ";
  }
  function casaWMsg(c, w) {
    const i = casaSegInfo(c, w.s);
    return i.len > 0 ? "Abertura de " + nf(i.len, 2) + " m (" + i.pct + " %) entre " + w.A.n + " y " + w.B.n + "." + (i.len < 0.6 ? " Con menos de 0,60 m no sirve como paso." : "") : "Muro completo entre " + w.A.n + " y " + w.B.n + ".";
  }
  function casaWallEditor(c) {
    const w = casaWselValid(c);
    if (!w) {
      const L = casaSegs(c).filter((q) => casaSegOpen(c, q.s).length);
      return '<div class="casains"><div class="cih"><b>\u{1F9F1} Muros y aberturas</b><span class="hint">Toca un muro interior del plano para elegir qu\xE9 parte quitar.</span></div>' + (L.length ? '<div class="cwopl">' + L.map((q) => {
        const i = casaSegInfo(c, q.s);
        return '<div class="cwr"><b>' + esc(q.A.n) + " \u2194 " + esc(q.B.n) + '</b><span class="hint">' + nf(i.len, 2) + " de " + nf(i.L, 2) + " m \xB7 " + i.pct + ' %</span><button type="button" class="chip" data-cs="wsel" data-k="' + q.ids.join(",") + '">\u270F Editar</button></div>';
      }).join("") + "</div>" : '<p class="hint" style="margin:6px 0 0">A\xFAn no hay aberturas. Ejemplos: cocina americana, living-comedor integrado, arco hacia el pasillo.</p>') + "</div>";
    }
    const i = casaSegInfo(c, w.s), hx = w.s[0] === "x", lb = hx ? ["Arriba", "Centro", "Abajo"] : ["Izquierda", "Centro", "Derecha"], part = i.pct > 0 && i.pct < 100;
    const dr = c.doors.filter((d) => d[0] === w.s[0] && Math.abs(d[1] - w.s[1]) < 0.02 && d[3] > w.s[2] && d[2] < w.s[3]).length;
    const st = i.len <= 0 ? "" : i.len >= 0.6 ? note("\u2713 Funciona como paso entre los dos recintos.", "ok") : note("Con menos de 0,60 m la abertura no cuenta como paso: agrega una puerta o ampl\xEDala.", "warn");
    return '<div class="casains cwed"><div class="cih"><b>\u{1F9F1} Muro entre ' + esc(w.A.n) + " y " + esc(w.B.n) + '</b><span class="hint">Largo ' + nf(i.L, 2) + " m \xB7 tabique " + nf(+c.wi || 0.12, 2) + ' m</span><button type="button" class="chip" data-cs="wdesel" aria-label="Cerrar">\u2715</button></div>' +
      '<div class="cwrow"><label for="cw-r">Abertura</label><output id="cw-o"><b>' + i.pct + " %</b> \xB7 " + nf(i.len, 2) + ' m</output></div><input id="cw-r" class="cwrange" type="range" min="0" max="100" step="5" value="' + i.pct + '" data-cw="pct" aria-label="Porcentaje del muro que se quita">' +
      '<div class="chips cwq">' + [[0, "Muro completo"], [25, "25 %"], [50, "50 %"], [75, "75 %"], [100, "Sin muro"]].map(([v, t]) => '<button type="button" class="chip' + (i.pct === v ? " on" : "") + '" data-cs="wpct" data-k="' + v + '">' + t + "</button>").join("") + "</div>" +
      '<div class="cigrid cw2"><label class="cif"><span>Largo de la abertura (m)</span><input id="cw-len" type="number" inputmode="decimal" min="0" max="' + rd(i.L) + '" step="0.05" value="' + rd(i.len) + '" data-cw="len"></label><label class="cif"><span>Desde ' + lb[0].toLowerCase() + ' (m)</span><input id="cw-off" type="number" inputmode="decimal" min="0" step="0.05" value="' + rd((i.L - i.len) * i.pos / 100) + '" data-cw="off"' + (part ? "" : " disabled") + "></label></div>" +
      '<div class="cwrow"><label for="cw-p">Ubicaci\xF3n en el muro</label></div><div class="chips cwq">' + lb.map((t, k) => '<button type="button" class="chip' + (part && i.pos === k * 50 ? " on" : "") + '" data-cs="wpos" data-k="' + k * 50 + '"' + (part ? "" : " disabled") + ">" + t + "</button>").join("") + '</div><input id="cw-p" class="cwrange" type="range" min="0" max="100" step="5" value="' + i.pos + '" data-cw="pos"' + (part ? "" : " disabled") + ' aria-label="Ubicaci\xF3n de la abertura">' +
      st + (dr && i.len > 0 ? note("Si la abertura alcanza la puerta de este muro, la puerta se quita.", "warn") : "") + "</div>";
  }
  function casaWLive(c) {
    const w = casaWselValid(c);
    if (!w) return;
    const i = casaSegInfo(c, w.s), pl = document.getElementById("casaplan"), o = document.getElementById("cw-o"), ln = document.getElementById("cw-len"), of = document.getElementById("cw-off");
    if (pl) pl.innerHTML = casaSVG(c);
    if (o) o.innerHTML = "<b>" + i.pct + " %</b> \xB7 " + nf(i.len, 2) + " m";
    if (ln) ln.value = rd(i.len);
    if (of) of.value = rd((i.L - i.len) * i.pos / 100);
  }
  function casaToggleOpen(c, o) {
    if (!c.open) c.open = [];
    const i = c.open.findIndex((q) => q[0] === o[0] && Math.abs(q[1] - o[1]) < 0.02 && Math.abs(q[2] - o[2]) < 0.02 && Math.abs(q[3] - o[3]) < 0.02);
    if (i >= 0) c.open.splice(i, 1);
    else c.open.push(o);
  }
  function casaPush() {
    casaHist.push(JSON.stringify(S.casa));
    if (casaHist.length > 50) casaHist.shift();
  }
  function casaRefresh() {
    const w = document.getElementById("casawrap");
    if (!w || cur !== "casa") return render(true);
    render(true);
  }
  function casaCommit(msg) {
    const c = S.casa;
    casaNorm(c);
    const k = casaPrune(c);
    casaMsg = (msg || "") + (k ? (msg ? " " : "") + "Se quit" + (k > 1 ? "aron " + k + " puertas que quedaron" : "\xF3 1 puerta que qued\xF3") + " fuera de un muro." : "");
    save();
    casaRefresh();
  }
  function casaNewId(c) {
    let i = 1;
    while (casaAll(c).some((r) => r.id === "r" + i)) i++;
    return "r" + i;
  }
  function casaSetFull(on) {
    casaFull = on;
    document.body.classList.toggle("tgfsb", on);
    try {
      if (on && document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {
      });
      if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {
      });
    } catch (e) {
    }
    render(true);
  }
  function casaDelete(id) {
    const c = S.casa, i = c.rooms.findIndex((r) => r.id === id);
    if (i < 0) return;
    if (c.rooms.length < 2) {
      casaMsg = "Debe quedar al menos un recinto.";
      return casaRefresh();
    }
    casaPush();
    const n = c.rooms[i].n;
    c.rooms.splice(i, 1);
    if (casaSel === id) casaSel = null;
    casaCommit("\xAB" + n + "\xBB eliminado. Toca ↶ para deshacer.");
  }
  function casaAddRoom() {
    const c = S.casa, nw = casaNew, w = Math.max(0.9, Math.min(30, +nw.w || 3)), l = Math.max(0.9, Math.min(30, +nw.l || 3));
    const ref = c.rooms.find((r) => r.id === nw.ref), bb = ref ? { x: ref.x, z: ref.z, x1: ref.x + ref.w, z1: ref.z + ref.l } : c.rooms.length ? { x: Math.min(...c.rooms.map((r) => r.x)), z: Math.min(...c.rooms.map((r) => r.z)), x1: Math.max(...c.rooms.map((r) => r.x + r.w)), z1: Math.max(...c.rooms.map((r) => r.z + r.l)) } : { x: 0, z: 0, x1: 0, z1: 0 };
    const p = { der: [bb.x1, bb.z], aba: [bb.x, bb.z1], izq: [bb.x - w, bb.z], arr: [bb.x, bb.z - l] }[nw.pos] || [bb.x1, bb.z];
    casaPush();
    const id = casaNewId(c), r = casaR(id, (nw.n || "").trim() || (TIPOS_REC[nw.t] || "Recinto") + " " + (c.rooms.filter((q) => q.t === nw.t).length + 1), nw.t, rd(p[0]), rd(p[1]), rd(w), rd(l));
    c.rooms.push(r);
    const sh = ref ? casaShared(ref, r) : null;
    if (sh && sh[3] - sh[2] >= 1) c.doors.push(doorOn(sh, 0.8));
    casaSel = id;
    casaMode = "mover";
    casaNew.n = "";
    casaCommit("\xAB" + r.n + "\xBB agregado" + (sh && sh[3] - sh[2] >= 1 ? " con puerta hacia \xAB" + ref.n + "\xBB." : ". Agrega una puerta en modo Puertas o con \u{1F6AA} Auto."));
  }
  document.addEventListener("click", (e) => {
    if (cur !== "casa" && cur !== "rep") return;
    const b = e.target.closest && e.target.closest("[data-cs]");
    if (!b || b.disabled) return;
    const a = b.dataset.cs, c = S.casa;
    if (a === "prst") {
      S.precios = {};
      save();
      render(true);
      return;
    }
    if (!c) return;
    if (a !== "tpl" && a !== "sim" && a !== "p2" && a !== "ccauto" && a !== "rm2") casaConf = "";
    const s = c.rooms.find((r) => r.id === casaSel);
    if (a === "tpl") {
      const k = b.dataset.k;
      if (casaConf !== "tpl:" + k) {
        casaConf = "tpl:" + k;
        render(true);
        return;
      }
      casaConf = "";
      casaPush();
      S.casa = CASA_TPL.find((t) => t[0] === k)[3]();
      casaSel = null;
      casaCommit("Plano cargado.");
      return;
    }
    if (a === "mode") {
      casaMode = b.dataset.k;
      return render(true);
    }
    if (a === "cotas") {
      casaCotas = !casaCotas;
      return render(true);
    }
    if (a === "fl") {
      if (+b.dataset.k !== casaAF(c)) {
        casaSwap(c);
        casaSel = null;
        casaWsel = null;
        save();
      }
      return render(true);
    }
    if (a === "add2") {
      casaPush();
      if (casaAF(c) === 1) c.af = 0;
      let es = c.rooms.find((r) => r.t === "escalera");
      const R2 = [];
      if (es) {
        R2.push(casaR(casaNewId(c), "Escalera", "escalera", es.x, es.z, es.w, es.l));
        c.other = { rooms: R2, doors: [], open: [] };
        const az = es.l >= es.w;
        R2.push(casaR(casaNewId(c), "Hall", "pasillo", az ? es.x + es.w : es.x, az ? es.z : es.z + es.l, az ? 1.2 : es.w, az ? Math.min(es.l, 1.5) : 1.2));
      } else {
        c.other = { rooms: [], doors: [], open: [] };
        c.other.rooms.push(casaR(casaNewId(c), "Hall", "pasillo", 0, 0, 3, 3));
      }
      casaSwap(c);
      casaAuto(c);
      casaSel = null;
      casaCommit(es ? "2.\xBA piso creado con la escalera sobre la del 1.\xBA piso y un hall de llegada. Agrega dormitorios, ba\xF1o y otros recintos." : "2.\xBA piso creado. Agrega un recinto \xABEscalera\xBB en el 1.\xBA piso y otro igual en este piso, uno sobre el otro.");
      return;
    }
    if (a === "rm2") {
      if (casaConf !== "rm2") {
        casaConf = "rm2";
        return render(true);
      }
      casaConf = "";
      casaPush();
      if (casaAF(c) === 1) casaSwap(c);
      delete c.other;
      c.af = 0;
      casaSel = null;
      casaCommit("2.\xBA piso quitado. Toca ↶ para deshacer.");
      return;
    }
    if ((a === "sel" || a === "delid") && c.other && !c.rooms.some((r) => r.id === b.dataset.id) && (c.other.rooms || []).some((r) => r.id === b.dataset.id)) {
      casaSwap(c);
      save();
    }
    if (a === "wsel") {
      casaWsel = { ids: b.dataset.k.split(",") };
      casaMode = "muros";
      return render(true);
    }
    if (a === "wdesel") {
      casaWsel = null;
      return render(true);
    }
    if (a === "wpct" || a === "wpos") {
      const w = casaWselValid(c);
      if (!w) return;
      const i = casaSegInfo(c, w.s);
      casaPush();
      if (a === "wpct") casaSetSeg(c, w.s, i.L * +b.dataset.k / 100, i.len > 0 ? i.pos : 50);
      else casaSetSeg(c, w.s, i.len, +b.dataset.k);
      return casaCommit(casaWMsg(c, w));
    }
    if (a === "full") return casaSetFull(!casaFull);
    if (a === "undo") {
      if (!casaHist.length) return;
      S.casa = JSON.parse(casaHist.pop());
      casaMsg = "Cambio deshecho.";
      save();
      return casaRefresh();
    }
    if (a === "add" || a === "desel") {
      if (a === "add") casaNew.ref = casaSel || casaNew.ref;
      casaSel = null;
      casaMode = "mover";
      render(true);
      if (a === "add") {
        const f = document.getElementById("cn-w");
        if (f && !casaFull) f.closest(".casains").scrollIntoView({ block: "nearest" });
      }
      return;
    }
    if (a === "addgo") return casaAddRoom();
    if (a === "sel") {
      casaSel = b.dataset.id;
      casaMode = "mover";
      render(true);
      const w = document.getElementById("casawrap");
      if (w) w.scrollIntoView({ block: "start" });
      return;
    }
    if (a === "delid") return casaDelete(b.dataset.id);
    if (a === "del" && s) return casaDelete(s.id);
    if (a === "ccadd") {
      if (!Array.isArray(c.circ)) c.circ = casaCircAuto(c);
      casaPush();
      c.circ.push({ n: "Enchufes " + (c.circ.length + 1), t: "enchufes", pts: 4, P: 0, S: 2.5, In: "auto", L: Math.max(5, Math.round(casaBase(c).dmax + 2)) });
      save();
      return render(true);
    }
    if (a === "ccdel" && Array.isArray(c.circ)) {
      casaPush();
      c.circ.splice(+b.dataset.i, 1);
      save();
      return render(true);
    }
    if (a === "ccauto") {
      if (casaConf !== "ccauto") {
        casaConf = "ccauto";
        return render(true);
      }
      casaConf = "";
      casaPush();
      c.circ = casaCircAuto(c);
      save();
      return render(true);
    }
    if (a === "cctg") {
      if (!Array.isArray(c.circ)) c.circ = casaCircAuto(c);
      tgInit();
      S.tg.free.circ = c.circ.slice(0, 9).map((x) => ({ n: x.n, t: x.t, P: Math.round(casaCircCalc(x).P), S: +x.S || 2.5 }));
      S.tg.free.emer = c.circ.some((x) => x.t === "alumbrado");
      S.tg.lv = "libre";
      save();
      if (casaFull) casaSetFull(false);
      go("tg");
      return;
    }
    if (a === "auto") {
      casaPush();
      casaAuto(c);
      casaCommit("Puertas recalculadas: una de entrada y una por recinto, de preferencia desde pasillos y living.");
      return;
    }
    if (a === "nud" && s) {
      const [dx, dz] = b.dataset.k.split(",").map(Number);
      casaPush();
      s.x = rd(s.x + dx * casaStep);
      s.z = rd(s.z + dz * casaStep);
      return casaCommit();
    }
    if (a === "siz" && s) {
      const [f, d] = b.dataset.k.split(",");
      casaPush();
      s[f] = rd(Math.max(0.9, Math.min(30, s[f] + +d * casaStep)));
      return casaCommit();
    }
    if (a === "dup" && s) {
      casaPush();
      const id = casaNewId(c), r = casaR(id, s.n + " (copia)", s.t, rd(s.x + s.w), s.z, s.w, s.l);
      c.rooms.push(r);
      casaSel = id;
      casaCommit("Copia agregada a la derecha.");
      return;
    }
    if (a === "p2") {
      if (S.rooms && S.rooms.length && casaConf !== "p2") {
        casaConf = "p2";
        render(true);
        return;
      }
      casaConf = "";
      S.rooms = casaUse(c).map((r) => ({ nombre: r.n + (c.other ? " (piso " + (r.f + 1) + ")" : ""), tipo: r.t, area: rd(cArea(r)), perim: rd(2 * (r.w + r.l)), centros: cMinC(r), enchufes: cMinE(r), horno: r.t === "cocina" }));
      if (S.proj && !S.proj.nombre) S.proj.nombre = c.n || "";
      save();
      if (casaFull) casaSetFull(false);
      go("p2");
      return;
    }
    if (a === "sim") {
      if (s2HasWork() && casaConf !== "sim") {
        casaConf = "sim";
        render(true);
        return;
      }
      casaConf = "";
      const o = S.sim2 || {};
      S.sim2 = Object.assign(sim2Blank(), { done: o.done || {}, score: o.score || 0, log: o.log || [], house: casaToHouse(c) });
      if (Array.isArray(c.circ) && c.circ.length) {
        const s2 = S.sim2;
        c.circ.slice(0, 8).forEach((x, k) => {
          const r = casaCircCalc(x);
          s2.circuits.push({ id: s2.nid++, n: String(x.n || "").slice(0, 20), In: [6, 10, 16, 20, 25, 32].includes(r.In) ? r.In : 16, cv: r.cv, pc: 6, S: [1.5, 2.5, 4, 6].includes(r.S) ? r.S : 2.5, dr: "DR" + (Math.floor(k / 3) + 1), ds: 30, cl: "A", nc: "dr", pe: true, on: true });
        });
      }
      simInsp = null;
      simSel = null;
      simPC = null;
      save();
      if (casaFull) casaSetFull(false);
      go("sim");
    }
  });
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (!el || !el.dataset || !el.dataset.cw || el.type !== "range" || cur !== "casa" || !S.casa) return;
    const c = S.casa, w = casaWselValid(c);
    if (!w) return;
    const i = casaSegInfo(c, w.s), v = +el.value;
    if (!casaWPush) {
      casaPush();
      casaWPush = true;
    }
    if (el.dataset.cw === "pct") casaSetSeg(c, w.s, i.L * v / 100, i.len > 0 ? i.pos : 50);
    else casaSetSeg(c, w.s, i.len, v);
    casaWLive(c);
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (!el || !el.dataset) return;
    if (el.dataset.pk && (cur === "casa" || cur === "rep")) {
      if (!S.precios) S.precios = {};
      S.precios[el.dataset.pk] = Math.max(0, +el.value || 0);
      save();
      render(true);
      return;
    }
    if (cur !== "casa" || !S.casa) return;
    const c = S.casa, num = (v) => +String(v).replace(",", ".");
    if (el.dataset.cn) {
      const f = el.dataset.cn;
      casaNew[f] = f === "w" || f === "l" ? Math.max(0.9, Math.min(30, num(el.value) || 3)) : el.value;
      return;
    }
    if (el.dataset.cc && Array.isArray(c.circ)) {
      const x = c.circ[+el.dataset.i], k = el.dataset.cc;
      if (!x) return;
      casaPush();
      if (k === "n") x.n = el.value.slice(0, 26);
      else if (k === "t") {
        x.t = el.value;
        const T0 = CC_T[x.t] || CC_T.otro;
        if ((+x.S || 0) < T0[4]) x.S = T0[4];
        if (!T0[1] && !(+x.P > 0)) x.P = x.t === "horno" ? 2e3 : x.t === "clima" ? 2500 : 1500;
        if (T0[1] && !(+x.pts > 0)) x.pts = 4;
      } else if (k === "In") x.In = el.value === "auto" ? "auto" : +el.value;
      else if (k === "S") x.S = +el.value;
      else x[k] = Math.max(0, +String(el.value).replace(",", ".") || 0);
      save();
      return render(true);
    }
    if (el.dataset.cw && cur === "casa" && S.casa) {
      const c2 = S.casa, w = casaWselValid(c2);
      if (!w) return;
      const i = casaSegInfo(c2, w.s), v = Math.max(0, num(el.value) || 0);
      if (!casaWPush) casaPush();
      casaWPush = false;
      if (el.dataset.cw === "pct") casaSetSeg(c2, w.s, i.L * v / 100, i.len > 0 ? i.pos : 50);
      else if (el.dataset.cw === "pos") casaSetSeg(c2, w.s, i.len, v);
      else if (el.dataset.cw === "len") casaSetSeg(c2, w.s, v, i.len > 0 ? i.pos : 50);
      else if (el.dataset.cw === "off") {
        const fr = i.L - i.len;
        casaSetSeg(c2, w.s, i.len, fr > 0 ? Math.min(v, fr) / fr * 100 : 50);
      }
      return casaCommit(casaWMsg(c2, w));
    }
    const f = el.dataset.cf || el.dataset.ci;
    if (!f) return;
    if (el.dataset.cf === "we" || el.dataset.cf === "wi") {
      casaPush();
      c[el.dataset.cf] = +el.value;
      return casaCommit("Espesor de muros actualizado.");
    }
    if (el.dataset.cf === "step") {
      casaStep = +el.value || 0.1;
      return render(true);
    }
    if (f === "hn") {
      c.n = el.value.slice(0, 80);
      save();
      return;
    }
    if (f === "tx") {
      casaPush();
      c.tx = rd((num(el.value) || 0) + Math.min(...casaAll(c).filter((q) => !q.f).map((q) => q.x)));
      return casaCommit();
    }
    const r = c.rooms.find((q) => q.id === casaSel);
    if (!el.dataset.ci || !r) return;
    casaPush();
    if (f === "n") r.n = el.value.slice(0, 40).trim() || "Recinto";
    else if (f === "t") r.t = el.value;
    else if (f === "sk" || f === "sd") {
      r[f] = el.value;
      if (f === "sk") r.sd = "";
      if (c.other) (c.other.rooms || []).filter((q) => q.t === "escalera" && Math.min(q.x + q.w, r.x + r.w) - Math.max(q.x, r.x) > 0.3 && Math.min(q.z + q.l, r.z + r.l) - Math.max(q.z, r.z) > 0.3).forEach((q) => {
        q.sk = r.sk;
        q.sd = r.sd;
      });
    }
    else {
      let v = num(el.value);
      if (!isFinite(v)) return render(true);
      if (f === "w" || f === "l") v = Math.max(0.9, Math.min(30, v));
      else v = Math.max(-50, Math.min(50, v));
      r[f] = rd(v);
    }
    casaCommit();
  });
  document.addEventListener("keydown", (e) => {
    if (cur !== "casa" || !S.casa) return;
    const t = e.target, typing = t && (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA");
    if (e.key === "Escape") {
      if (casaFull) casaSetFull(false);
      else if (casaSel) {
        casaSel = null;
        render(true);
      }
      return;
    }
    if (typing) return;
    const s = S.casa.rooms.find((r) => r.id === casaSel);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && casaHist.length) {
      e.preventDefault();
      S.casa = JSON.parse(casaHist.pop());
      save();
      return casaRefresh();
    }
    if (!s) return;
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (d) {
      e.preventDefault();
      casaPush();
      s.x = rd(s.x + d[0] * casaStep);
      s.z = rd(s.z + d[1] * casaStep);
      casaCommit();
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      casaDelete(s.id);
    }
  });
  document.addEventListener("pointerdown", (e) => {
    if (cur !== "casa" || !S.casa || e.button > 0) return;
    const t = e.target;
    if (!t.closest || !t.closest("#casasvg")) return;
    const c = S.casa, p = casaPt(e);
    if (!p) return;
    if (casaMode === "mover") {
      const hg = t.closest("[data-h]"), rid = hg ? hg.dataset.h : t.dataset && t.dataset.r;
      const r = c.rooms.find((q) => q.id === rid);
      e.preventDefault();
      if (!r) {
        casaDrag = { none: true, cx: e.clientX, cy: e.clientY };
        return;
      }
      casaDragged = false;
      casaDrag = { id: r.id, size: !!hg, live: r.id === casaSel, cx: e.clientX, cy: e.clientY, p0: p, r0: Object.assign({}, r), fr: { x0: p.b[0], z0: p.b[1], x1: p.b[2], z1: p.b[3] } };
      return;
    }
    if (casaMode === "muros") {
      e.preventDefault();
      let ed = casaEdgeAt(c, p), snap = "";
      if (!ed) {
        casaWsel = null;
        casaMsg = "Toca justo sobre un muro.";
        return casaRefresh();
      }
      if (ed.ext) {
        const h0 = JSON.stringify(c);
        snap = casaSnapNear(c, p);
        if (snap) {
          casaHist.push(h0);
          if (casaHist.length > 50) casaHist.shift();
          ed = casaEdgeAt(c, p);
        }
        if (!ed || ed.ext) {
          if (snap) return casaCommit(snap);
          casaWsel = null;
          casaMsg = "Ese muro da al exterior o a un patio: no se puede abrir. Las aberturas se hacen en muros entre dos recintos.";
          return casaRefresh();
        }
      }
      const sg = casaSegAt(c, ed);
      if (!sg) {
        casaMsg = "No encontr\xE9 los dos recintos de ese muro.";
        return casaRefresh();
      }
      casaWsel = { ids: sg.ids };
      if (snap) return casaCommit(snap);
      return casaRefresh();
    }
    if (casaMode === "puertas") {
      e.preventDefault();
      if (t.dataset && t.dataset.d != null) {
        casaPush();
        c.doors.splice(+t.dataset.d, 1);
        casaCommit("Puerta quitada.");
        return;
      }
      const ed = casaEdgeAt(c, p);
      if (!ed) {
        casaMsg = "Toca justo sobre un muro.";
        return casaRefresh();
      }
      const w = ed.ext ? 0.9 : 0.8;
      if (ed.b - ed.a < w + 0.2) {
        casaMsg = "Ese tramo de muro mide " + nf(ed.b - ed.a, 2) + " m: no cabe una puerta de " + nf(w, 1) + " m.";
        return casaRefresh();
      }
      const m = Math.max(ed.a + 0.1 + w / 2, Math.min(ed.b - 0.1 - w / 2, ed.t));
      casaPush();
      c.doors = c.doors.filter((d) => !(d[0] === ed.ax && Math.abs(d[1] - ed.v) < 0.02 && d[3] > m - w / 2 && d[2] < m + w / 2));
      c.doors.push([ed.ax, rd(ed.v), rd(m - w / 2), rd(m + w / 2)]);
      casaCommit(ed.ext ? "Puerta exterior agregada." : "Puerta agregada.");
      return;
    }
    if (casaMode === "tablero") {
      e.preventDefault();
      const fr = casaFront(c), z0 = fr.length ? fr[0].z : 0, r = fr.find((q) => p.x >= q.x && p.x <= q.x + q.w);
      if (!r || Math.abs(p.z - z0) > 0.6) {
        casaMsg = "El tablero va en el muro del frente (l\xEDnea azul).";
        return casaRefresh();
      }
      casaPush();
      c.tx = rd(Math.max(r.x + 0.5, Math.min(r.x + r.w - 0.5, Math.round(p.x * 20) / 20)));
      casaCommit("Tablero en " + nf(c.tx - Math.min(...c.rooms.map((q) => q.x)), 2) + " m desde la esquina izquierda del frente.");
    }
  });
  document.addEventListener("pointermove", (e) => {
    if (!casaDrag || casaDrag.none || cur !== "casa") return;
    if (!casaDrag.live) return;
    if (!casaDragged && Math.hypot(e.clientX - casaDrag.cx, e.clientY - casaDrag.cy) < 10) return;
    const c = S.casa, r = c.rooms.find((q) => q.id === casaDrag.id);
    if (!r) return;
    if (!casaDragged) {
      casaDragged = true;
      casaPush();
    }
    const dx = (e.clientX - casaDrag.cx) / casaDrag.p0.px, dz = (e.clientY - casaDrag.cy) / casaDrag.p0.px, r0 = casaDrag.r0, st = casaStep, sn = (v) => Math.round(v / st) * st, th = Math.max(0.15, st * 0.6);
    const ox = c.rooms.filter((q) => q !== r).flatMap((q) => [q.x, q.x + q.w]), oz = c.rooms.filter((q) => q !== r).flatMap((q) => [q.z, q.z + q.l]);
    const near = (v, L) => {
      let b = null;
      L.forEach((u) => {
        if (Math.abs(u - v) < th && (b == null || Math.abs(u - v) < Math.abs(b - v))) b = u;
      });
      return b;
    };
    if (casaDrag.size) {
      let x1 = sn(r0.x + r0.w + dx), z1 = sn(r0.z + r0.l + dz);
      const sx = near(r0.x + r0.w + dx, ox), sz = near(r0.z + r0.l + dz, oz);
      if (sx != null) x1 = sx;
      if (sz != null) z1 = sz;
      r.w = rd(Math.max(0.9, Math.min(30, x1 - r.x)));
      r.l = rd(Math.max(0.9, Math.min(30, z1 - r.z)));
    } else {
      const rx = r0.x + dx, rz = r0.z + dz;
      let x = sn(rx), z = sn(rz);
      const a1 = near(rx, ox), a2 = near(rx + r.w, ox), b1 = near(rz, oz), b2 = near(rz + r.l, oz);
      if (a1 != null) x = a1;
      else if (a2 != null) x = a2 - r.w;
      if (b1 != null) z = b1;
      else if (b2 != null) z = b2 - r.l;
      r.x = rd(x);
      r.z = rd(z);
    }
    const pl = document.getElementById("casaplan");
    if (pl) pl.innerHTML = casaSVG(c, casaDrag.fr);
  });
  function casaEnd() {
    if (!casaDrag) return;
    const d = casaDrag;
    casaDrag = null;
    if (cur !== "casa") return;
    if (d.none) {
      if (casaSel) {
        casaSel = null;
        render(true);
      }
      return;
    }
    if (!casaDragged) {
      casaSel = d.id;
      return render(true);
    }
    casaDragged = false;
    casaSel = d.id;
    casaCommit();
  }
  document.addEventListener("pointerup", casaEnd);
  document.addEventListener("pointercancel", casaEnd);
