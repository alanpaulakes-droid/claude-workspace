  const CL = { F: "fase", N: "neutro", PE: "tierra", R: "retorno", R2: "retorno 2", R3: "retorno 3", C: "com\xFAn", V1: "viajero 1", V2: "viajero 2" }, SGN = { L: "fase", N: "neutro", E: "tierra" };
  function boxKids(s, b) {
    return s.items.filter((i) => i.par === b.id);
  }
  function boxConduits(s, b) {
    const par = b.par != null ? s.items.find((i) => i.id === b.par) : null;
    return [{ id: b.id, inc: true, name: par ? par.name : "Tablero", cond: ["F", "N", "PE"] }].concat(boxKids(s, b).map((k) => ({ id: k.id, inc: false, name: k.name, cond: simConds(k), it: k })));
  }
  function boxExpected(s, b) {
    const kids = boxKids(s, b), g = { F: [b.id + ":F"], N: [b.id + ":N"], PE: [b.id + ":PE"] }, R = [];
    kids.forEach((k) => simConds(k).forEach((c) => {
      if (g[c]) g[c].push(k.id + ":" + c);
    }));
    const lampsOf = (w, f) => kids.filter((l) => l.t === "lamp" && l.sw === w.id && f(l));
    kids.filter((k) => k.t === "sw" && k.v !== "c").forEach((w) => {
      const mk = (w.v === "d" || w.v === "t"), ls = lampsOf(w, (l) => !(mk && l.k >= 1));
      if (ls.length) R.push([w.id + ":R"].concat(ls.map((l) => l.id + ":R")));
      const l2 = mk ? lampsOf(w, (l) => l.k === 1) : [], l3 = w.v === "t" ? lampsOf(w, (l) => l.k === 2) : [];
      if (l2.length) R.push([w.id + ":R2"].concat(l2.map((l) => l.id + ":R")));
      if (l3.length) R.push([w.id + ":R3"].concat(l3.map((l) => l.id + ":R")));
    });
    const cs = kids.filter((k) => k.t === "sw" && k.v === "c"), asB = /* @__PURE__ */ new Set(), pr = /* @__PURE__ */ new Map();
    kids.filter((l) => l.t === "lamp" && l.sw != null).forEach((l) => {
      const a = cs.find((w) => w.id === l.sw);
      if (!a) return;
      const b = l.sw2 != null ? cs.find((w) => w.id === l.sw2) : null, key = a.id + "-" + (b ? b.id : "");
      if (b) asB.add(b.id);
      if (!pr.has(key)) pr.set(key, { a, b, ls: [] });
      pr.get(key).ls.push(l);
    });
    cs.forEach((w) => {
      if (!asB.has(w.id)) g.F.push(w.id + ":C");
    });
    pr.forEach(({ a, b, ls }) => {
      if (b) {
        R.push([b.id + ":C"].concat(ls.map((l) => l.id + ":R")), [a.id + ":V1", b.id + ":V2"], [a.id + ":V2", b.id + ":V1"]);
      } else R.push([a.id + ":V1"].concat(ls.map((l) => l.id + ":R")));
    });
    return [g.F, g.N, g.PE].filter((x) => x.length > 1).concat(R);
  }
  function boxGroups(s, b) {
    if (s.wm !== "man") return boxExpected(s, b);
    if (!s.emp) s.emp = {};
    const valid = new Set(boxConduits(s, b).flatMap((c) => c.cond.map((k) => c.id + ":" + k)));
    const gs = (s.emp[b.id] || []).map((g) => [...new Set(g.filter((k) => valid.has(k)))]).filter((g) => g.length >= 1);
    s.emp[b.id] = gs;
    return gs;
  }
  function wireManual(s, fromExpected) {
    s.wm = "man";
    s.emp = {};
    if (fromExpected) s.items.filter((i) => i.t === "box").forEach((b) => {
      s.emp[b.id] = boxExpected(s, b);
    });
  }
  function syncSwFromEmp(s) {
    if (s.wm !== "man" || !s.emp) return;
    const by0 = new Map(s.items.map((i) => [i.id, i]));
    s.items.filter((b) => b.t === "box").forEach((b) => {
      const gs = s.emp[b.id] || [], kids = boxKids(s, b);
      kids.filter((l) => l.t === "lamp" && l.sw != null).forEach((l) => {
        const g = gs.find((g2) => g2.includes(l.id + ":R"));
        if (!g) return;
        if ((by0.get(l.sw) || {}).v === "c") return;
        const w = kids.find((w2) => w2.t === "sw" && w2.v !== "c" && (g.includes(w2.id + ":R") || g.includes(w2.id + ":R2") || g.includes(w2.id + ":R3")));
        if (!w) return;
        l.sw = w.id;
        l.k = w.v === "t" && g.includes(w.id + ":R3") ? 2 : (w.v === "d" || w.v === "t") && g.includes(w.id + ":R2") ? 1 : 0;
      });
    });
  }
  function simWire(s) {
    if (s.wm !== "man") return null;
    syncSwFromEmp(s);
    const by = new Map(s.items.map((i) => [i.id, i])), errs = [];
    const E = (it, t, d, w, x) => errs.push(Object.assign({ t, d, w, id: it ? it.id : null, cid: it ? it.c : null }, x || {}));
    const prop = (local, allOn) => {
      const sg = {}, cf = [], gi0 = {};
      s.items.filter((i) => i.par == null && !i.free).forEach((it) => {
        const c = s.circuits[cIdx(s, it.c)];
        if (!c) return;
        const o = {};
        simConds(it).forEach((k) => {
          o[k] = k === "F" ? "L" : k === "N" ? c.nc === "off" ? null : "N" : k === "PE" ? c.pe === false ? null : "E" : null;
        });
        sg[it.id] = o;
      });
      const q = local ? s.items.filter((i) => i.t === "box").map((i) => i.id) : s.items.filter((i) => i.par == null && !i.free && i.t === "box").map((i) => i.id);
      let n = 0;
      while (q.length && n < 200) {
        n++;
        const bid = q.shift(), b = by.get(bid), inS = local ? { F: "L", N: "N", PE: "E" } : sg[bid] || {}, kids = boxKids(s, b), gs = boxGroups(s, b), gi = /* @__PURE__ */ new Map();
        gs.forEach((g, i) => g.forEach((k) => gi.set(k, i)));
        const src = gs.map(() => []);
        ["F", "N", "PE"].forEach((k) => {
          const i = gi.get(bid + ":" + k);
          if (i != null && inS[k]) src[i].push({ s: inS[k], from: "in" });
        });
        const gv = (i) => {
          const ss = [...new Set(src[i].map((x) => x.s))];
          return ss.length === 1 ? ss[0] : ss.length > 1 ? "X" : null;
        };
        const swk = kids.filter((k) => k.t === "sw");
        for (let ps = 0; ps < 3; ps++) swk.forEach((w) => {
          const lk = (a, b2, on, fr) => {
            const ia = gi.get(w.id + ":" + a), ib = gi.get(w.id + ":" + b2);
            if (!on || ia == null || ib == null || ia === ib) return;
            const va = gv(ia);
            if (va && va !== "X" && !src[ib].some((x) => x.sw === w.id && x.s === va)) src[ib].push({ s: va, from: fr, sw: w.id });
          };
          if (w.v === "c") ["V1", "V2"].forEach((t) => {
            const on = allOn || t === "V1" === !!w.on;
            lk("C", t, on, "swc");
            lk(t, "C", on, "swc");
          });
          else {
            lk("F", "R", allOn || w.on, "sw");
            if (w.v === "d" || w.v === "t") lk("F", "R2", allOn || w.on2, "sw");
            if (w.v === "t") lk("F", "R3", allOn || w.on3, "sw");
          }
        });
        gs.forEach((g, i) => {
          const ss = [...new Set(src[i].map((x) => x.s))];
          if (ss.length > 1) cf.push({ box: bid, cid: b.c, ss, g: i, sw: src[i].some((x) => x.from === "sw" || x.from === "swc") });
        });
        gi0[bid] = { gs, src, gi };
        kids.forEach((k) => {
          const o = {};
          simConds(k).forEach((c) => {
            const i = gi.get(k.id + ":" + c);
            o[c] = i != null ? gv(i) : null;
          });
          sg[k.id] = o;
          if (k.t === "box" && !local) q.push(k.id);
        });
      }
      return { sg, cf, gi: gi0 };
    };
    const D = prop(false, false), T2 = prop(true, true);
    const work = {}, live2 = {};
    s.items.forEach((it) => {
      const g = D.sg[it.id] || {}, pr = it.t === "lamp" && it.sw != null ? [g.R, g.N] : [g.F, g.N];
      const ok = pr.includes("L") && pr.includes("N");
      work[it.id] = ok;
      live2[it.id] = it.t === "sw" ? ["L", "N"].includes(it.v === "c" ? g.C : g.F) : ok;
    });
    s.items.filter((i) => i.par == null && !i.free).forEach((it) => {
      if (it.t === "lamp" && it.sw != null) E(it, "".concat(it.name, ": su retorno no tiene de d\xF3nde venir"), "La luz sale directo del tablero, pero el retorno viene del interruptor y se une dentro de una caja.", "Alimenta la luz y su interruptor desde la misma caja de derivaci\xF3n.", { tab: 1 });
      if (it.t === "sw" && s.items.some((l) => l.sw === it.id)) E(it, "".concat(it.name, ": su retorno no llega a la luz"), "El interruptor sale directo del tablero; su retorno no tiene d\xF3nde unirse con la luz.", "Alimenta el interruptor y su luz desde la misma caja de derivaci\xF3n.", { tab: 1 });
    });
    s.items.filter((i) => i.t === "box").forEach((b) => {
      const L = T2.gi[b.id];
      if (!L) return;
      const kids = boxKids(s, b), ki = new Set(kids.map((k) => k.id));
      T2.cf.filter((f) => f.box === b.id).forEach((f) => {
        const h = (a) => f.ss.includes(a);
        if (h("L") && h("N")) E(b, "".concat(b.name, ": empalme une fase con neutro"), f.sw ? "Al cerrar el interruptor, la fase y el neutro quedan unidos." : "La fase y el neutro quedan unidos directamente.", "Es un cortocircuito: la corriente sube a miles de amperes y el autom\xE1tico dispara al instante.", { box: b.id });
        else if (h("L") && h("E")) E(b, "".concat(b.name, ": empalme une fase con tierra"), "La fase queda conectada al conductor de protecci\xF3n.", "Todas las carcasas met\xE1licas quedar\xEDan con tensi\xF3n; el diferencial dispara (si no hay, es muy peligroso).", { box: b.id });
        else if (h("N") && h("E")) E(b, "".concat(b.name, ": empalme une neutro con tierra"), "El neutro y la tierra solo se unen en el empalme de la compa\xF1\xEDa, nunca en la instalaci\xF3n.", "Parte de la corriente vuelve por la tierra: el diferencial lo detecta como fuga y dispara.", { box: b.id });
      });
      L.gs.forEach((g, i) => {
        const sws = [...new Set(L.src[i].filter((x) => x.from === "sw").map((x) => x.sw))];
        if (sws.length > 1) {
          const nm = sws.map((id) => (by.get(id) || {}).name).join(" y ");
          E(b, "".concat(b.name, ": retornos de ").concat(nm, " unidos"), "Los retornos de ".concat(nm, " est\xE1n en la misma regleta: cualquiera de ellos enciende todas esas luces."), "Cada interruptor lleva su propia regleta de retorno, unida solo con la luz que controla.", { box: b.id });
        }
      });
      kids.forEach((k) => {
        const g = T2.sg[k.id] || {};
        if (k.t === "sw" && k.v === "c") return;
        if (k.t === "sw") {
          if (g.F == null) E(k, "".concat(b.name, ": fase hacia ").concat(k.name, " suelta"), "Empalma el conductor que va al interruptor con la fase que entra a la caja.", "El interruptor debe cortar la fase.", { box: b.id, quiet: 1 });
          else if (g.F === "N") E(k, "".concat(b.name, ": ").concat(k.name, " corta el neutro"), "Al interruptor le llega el neutro en vez de la fase.", "Con el interruptor abierto la luz queda con fase: peligro al cambiar la ampolleta. El interruptor siempre corta la fase.", { box: b.id });
          else if (g.F === "E") E(k, "".concat(b.name, ": a ").concat(k.name, " le llega la tierra"), "El conductor del interruptor est\xE1 unido a la tierra.", "La tierra no se usa como conductor activo.", { box: b.id });
          if (k.v === "t") {
            const iR3 = L.gi.get(k.id + ":R3"), l3 = kids.filter((l) => l.sw === k.id && l.k === 2);
            if (l3.length && (iR3 == null || !l3.some((l) => L.gi.get(l.id + ":R") === iR3))) E(k, "".concat(b.name, ": retorno 3 de ").concat(k.name, " suelto"), "Une el retorno 3 (tecla 3) con el retorno de ".concat(l3.map((l) => l.name).join(" y "), "."), "Cada tecla del 9/32 tiene su propio retorno hacia su luz.", { box: b.id });
          }
          if (k.v === "d" || k.v === "t") {
            const iR2 = L.gi.get(k.id + ":R2"), l2 = kids.filter((l) => l.sw === k.id && l.k === 1);
            if (l2.length && (iR2 == null || !l2.some((l) => L.gi.get(l.id + ":R") === iR2))) E(k, "".concat(b.name, ": retorno 2 de ").concat(k.name, " suelto"), "Une el retorno 2 (tecla 2) con el retorno de ".concat(l2.map((l) => l.name).join(" y "), "."), "Cada tecla del 9/15 lleva su propio retorno.", { box: b.id, quiet: 1 });
          }
          const iR = L.gi.get(k.id + ":R"), lamps = kids.filter((l) => l.sw === k.id && !((k.v === "d" || k.v === "t") && l.k >= 1));
          if (lamps.length && (iR == null || !lamps.some((l) => L.gi.get(l.id + ":R") === iR))) E(k, "".concat(b.name, ": retorno de ").concat(k.name, " suelto"), "Une el retorno del interruptor con el retorno de ".concat(lamps.map((l) => l.name).join(" y "), "."), "El retorno lleva la fase del interruptor a la luz.", { box: b.id, quiet: 1 });
          return;
        }
        simConds(k).forEach((c) => {
          const v = g[c], exp = c === "N" ? "N" : c === "PE" ? "E" : "L";
          if (v === "X") return;
          if (c === "R") {
            const i = L.gi.get(k.id + ":R"), srcs = i != null ? L.src[i] : [], w = s.items.find((x) => x.id === k.sw);
            if (srcs.some((x) => x.from === "in" && x.s === "L")) {
              E(k, "".concat(b.name, ": ").concat(k.name, " queda siempre encendida"), "Su retorno est\xE1 unido directo a la fase: no pasa por el interruptor.", "El retorno debe unirse solo con el retorno del interruptor.", { box: b.id });
              return;
            }
            if (v == null) {
              if (w && !ki.has(w.id)) E(k, "".concat(b.name, ": ").concat(w.name, " no sale de esta caja"), "".concat(k.name, " recibe el retorno en ").concat(b.name, ", pero ").concat(w.name, " se alimenta desde ").concat(w.par != null ? (s.items.find((x) => x.id === w.par) || {}).name : "el tablero", "."), "La luz y su interruptor deben derivarse desde la misma caja para unir el retorno.", { box: b.id });
              else E(k, "".concat(b.name, ": retorno hacia ").concat(k.name, " suelto"), "Une el retorno de ".concat(k.name, " con el retorno de ").concat(w ? w.name : "su interruptor", "."), "Sin retorno la luz no enciende.", { box: b.id, quiet: 1 });
              return;
            }
            if (v !== "L") E(k, "".concat(b.name, ": al retorno de ").concat(k.name, " le llega ").concat(SGN[v]), "El retorno solo debe unirse con el retorno del interruptor.", "Revisa el empalme del retorno.", { box: b.id });
            else if (w && !srcs.some((x) => x.sw === w.id || k.sw2 != null && x.sw === k.sw2)) E(k, "".concat(b.name, ": ").concat(k.name, " la controla otro interruptor"), "Deber\xEDa controlarla ".concat(w.name, "."), "Revisa qu\xE9 retornos uniste.", { box: b.id });
            return;
          }
          if (v == null) E(k, "".concat(b.name, ": ").concat(CL[c], " hacia ").concat(k.name, " suelto"), "El conductor de ".concat(CL[c], " que va a ").concat(k.name, " no est\xE1 empalmado con el de la entrada."), c === "PE" ? "Sin tierra el punto queda sin protecci\xF3n contra contactos indirectos (RIC N\xB006)." : "Sin ese conductor el punto no funciona.", { box: b.id, quiet: 1 });
          else if (v !== exp) E(k, "".concat(b.name, ": a ").concat(k.name, " le llega ").concat(SGN[v], " por el conductor de ").concat(CL[c]), c === "PE" || v === "E" ? "La tierra y los activos (fase y neutro) no se mezclan." : "La fase y el neutro est\xE1n invertidos (polaridad cambiada).", v === "L" && c === "PE" ? "La carcasa del equipo quedar\xEDa con tensi\xF3n: muy peligroso." : "Respeta los colores: rojo con rojo, blanco con blanco, verde/amarillo con verde/amarillo.", { box: b.id });
        });
      });
    });
    return { D, T: T2, errs, work, live: live2 };
  }
  function joinTerms(s, bid, a, b) {
    const gs = s.emp[bid] || (s.emp[bid] = []);
    const ga = gs.find((g) => g.includes(a)), gb = gs.find((g) => g.includes(b));
    if (ga && ga === gb) return;
    const m = [...new Set([].concat(ga || [a], gb || [b]))];
    s.emp[bid] = gs.filter((g) => g !== ga && g !== gb).concat([m]);
  }
  function cutTerm(s, bid, k) {
    s.emp[bid] = (s.emp[bid] || []).map((g) => g.filter((x) => x !== k)).filter((g) => g.length > 1);
  }
  let simHint = false, simTermSel = null, simBoxZoom = typeof window !== "undefined" && window.innerWidth < 600, simUndo = [], simLast = null;
  function boxSheetHTML(s, b) {
    const cs = boxConduits(s, b), gs = boxGroups(s, b), W = simWire(s), man = s.wm === "man", k0 = cIdx(s, b.c), rm = itemRoom(b), nk = cs.length - 1;
    const ab2 = (t) => t.replace("Interruptor", "Interr.").replace("Enchufe", "Ench.");
    const nTop = 1 + Math.ceil(nk / 2), top = cs.slice(0, nTop), bot = cs.slice(nTop), CW = 34, PC = 34, LM = 86, RM = 56, cw = (c) => c.cond.length * CW + PC;
    const sum = (a) => a.reduce((x, c) => x + cw(c), 0), inner = Math.max(sum(top), sum(bot) + CW / 2, 300), Wd = LM + inner + RM;
    const ORD = { F: 0, N: 1, PE: 2, R: 3 }, TN = { F: "Fase", N: "Neutro", PE: "Tierra", R: "Retorno" };
    const lc = W ? W.T.cf.filter((f) => f.box === b.id).map((f) => f.g) : [];
    const selK = simTermSel && simTermSel.b === b.id ? simTermSel.k : null, expG = selK ? (boxExpected(s, b).find((g) => g.includes(selK)) || []).filter((k) => k !== selK) : [];
    const rows = gs.map((g, i) => {
      const ty = {};
      g.forEach((k) => {
        const q = k.split(":")[1];
        ty[q] = (ty[q] || 0) + 1;
      });
      const dom = Object.keys(ty).sort((a, c) => ty[c] - ty[a] || ORD[a] - ORD[c])[0];
      return { g, i, dom, mix: Object.keys(ty).length > 1, bad: lc.includes(i), sug: simHint && g.some((k) => expG.includes(k)) };
    }).sort((a, c) => ORD[a.dom] - ORD[c.dom] || a.i - c.i);
    const yT = 118, R0 = yT + 50, RS = 38, nR = Math.max(rows.length, 3), yB = R0 + (nR - 1) * RS + 50;
    const T2 = {};
    const put = (arr, y, dir) => {
      let x = LM + Math.floor((inner - sum(arr)) / 2 / CW) * CW + (dir < 0 ? CW / 2 : 0);
      arr.forEach((c) => {
        c._x = x;
        c._w = cw(c);
        c.cond.forEach((q, j) => {
          T2[c.id + ":" + q] = { x: x + PC / 2 + CW / 2 + j * CW, y, q, dir, c };
        });
        x += cw(c);
      });
    };
    put(top, yT, 1);
    put(bot, yB, -1);
    const col = (q) => CNAME[q][2], ln = (x1, y1, x2, y2, q, w) => '<line x1="'.concat(x1, '" y1="').concat(y1, '" x2="').concat(x2, '" y2="').concat(y2, '" stroke="').concat(col(q), '" stroke-width="').concat(w || 7, '" stroke-linecap="round"').concat(q === "N" ? ' class="nw"' : "", "/>") + (q === "R" ? '<line x1="'.concat(x1, '" y1="').concat(y1, '" x2="').concat(x2, '" y2="').concat(y2, '" stroke="#fff" stroke-width="2" stroke-dasharray="6 7" opacity=".75"/>') : "");
    let svg = '<rect x="'.concat(LM - 14, '" y="').concat(yT - 22, '" width="').concat(inner + 28, '" height="').concat(yB - yT + 44, '" rx="16" class="bxr"/>');
    const tube = (c, dir) => {
      const y0 = dir > 0 ? yT - 70 : yB + 22, inc = c.inc, nm = (inc ? "\u21D0 " : "\u2192 ") + ab2(c.name);
      let o = '<rect x="'.concat(c._x + 4, '" y="').concat(y0, '" width="').concat(c._w - 8, '" height="48" rx="6" fill="').concat(inc ? "#8a7f6d" : "#9aa3ad", '"/>');
      c.cond.forEach((q) => {
        const t = T2[c.id + ":" + q];
        o += ln(t.x, dir > 0 ? y0 : y0 + 48, t.x, dir > 0 ? yT - 14 : yB + 14, q, 6);
      });
      o += '<text x="'.concat(c._x + c._w / 2, '" y="').concat(dir > 0 ? y0 - 10 : y0 + 68, '" text-anchor="middle" class="bl').concat(inc ? " bin" : "", '">').concat(esc(nm.length > 12 ? nm.slice(0, 11) + "\u2026" : nm), "</text>");
      return o;
    };
    top.forEach((c) => svg += tube(c, 1));
    bot.forEach((c) => svg += tube(c, -1));
    const inG = new Set(gs.flat());
    let wires = "", bars = "";
    rows.forEach((r, ri) => {
      const y = R0 + ri * RS, pts = r.g.map((k) => T2[k]).filter(Boolean);
      if (!pts.length) return;
      const x0 = Math.min(...pts.map((p) => p.x)) - 16, x1 = Math.max(...pts.map((p) => p.x)) + 16;
      pts.forEach((p) => {
        wires += '<line x1="'.concat(p.x, '" y1="').concat(p.y, '" x2="').concat(p.x, '" y2="').concat(y, '" class="halo"/>') + ln(p.x, p.y, p.x, y, p.q);
      });
      bars += '<g data-sa="row" data-b="'.concat(b.id, '" data-g="').concat(r.i, '" class="rowb').concat(r.bad ? " bad" : r.mix ? " mix" : "").concat(r.sug ? " sug" : "").concat(selK && r.g.includes(selK) ? " cur" : "", '"><rect x="').concat(x0, '" y="').concat(y - 14, '" width="').concat(x1 - x0, '" height="28" class="hit2"/><rect x="').concat(x0, '" y="').concat(y - 7, '" width="').concat(x1 - x0, '" height="14" rx="7" class="bar"/>').concat(pts.map((p) => '<circle cx="'.concat(p.x, '" cy="').concat(y, '" r="7" fill="').concat(col(p.q), '" stroke="#222" stroke-width="1.5"/>')).join(""), "</g>");
      bars += '<text x="'.concat(LM - 20, '" y="').concat(y + 5, '" text-anchor="end" class="rl" fill="').concat(r.bad || r.mix ? "#c0392b" : r.dom === "N" ? "var(--ink)" : col(r.dom), '">').concat(r.bad ? "\u26A0 " : r.mix ? "\u26A0 " : "").concat(r.dom === "R" ? (() => {
        const w = r.g.map((k) => s.items.find((i) => i.id === +k.split(":")[0])).find((i) => i && i.t === "sw");
        return w ? "Ret. " + ab2(w.name).replace("Interr. ", "I") : "Retorno";
      })() : TN[r.dom], "</text>");
      bars += '<g data-sa="nut" data-b="'.concat(b.id, '" data-g="').concat(r.i, '" class="cutb"><circle cx="').concat(x1 + 20, '" cy="').concat(y, '" r="14"/><text x="').concat(x1 + 20, '" y="').concat(y + 5, '">\u2702</text></g>');
    });
    Object.entries(T2).forEach(([k, p]) => {
      if (!inG.has(k)) wires += '<line x1="'.concat(p.x, '" y1="').concat(p.y, '" x2="').concat(p.x, '" y2="').concat(p.y + p.dir * 24, '" stroke="').concat(col(p.q), '" stroke-width="7" stroke-dasharray="3 5" opacity=".7"').concat(p.q === "N" ? ' class="nw"' : "", '/><circle cx="').concat(p.x, '" cy="').concat(p.y + p.dir * 30, '" r="5" fill="none" stroke="').concat(col(p.q), '" stroke-width="2.5"/>');
    });
    svg += wires + bars;
    Object.entries(T2).forEach(([k, p]) => {
      const sel2 = simTermSel && simTermSel.b === b.id && simTermSel.k === k;
      svg += '<g data-sa="term" data-b="'.concat(b.id, '" data-k="').concat(k, '" class="term').concat(sel2 ? " sel" : "", '"><circle cx="').concat(p.x, '" cy="').concat(p.y, '" r="20" class="hit"/><circle cx="').concat(p.x, '" cy="').concat(p.y, '" r="').concat(sel2 ? 16 : 13, '" fill="').concat(col(p.q), '"/><text x="').concat(p.x, '" y="').concat(p.y + 5, '" fill="').concat(p.q === "N" ? "#222" : "#fff", '">').concat(p.q === "PE" ? "T" : p.q, "</text></g>");
    });
    const errs = W ? W.errs.filter((o) => o.box === b.id) : [];
    const st = boxKids(s, b).map((k) => {
      const ke = errs.filter((o) => o.id === k.id), ok = !ke.length;
      return '<span class="chip '.concat(ok ? "ok" : "bad", '">').concat(ok ? "\u2713" : "\u2717", " ").concat(esc(k.name), "</span>");
    }).join("");
    const sel = simTermSel && simTermSel.b === b.id ? simTermSel.k : null, selTxt = sel ? (() => {
      const t = T2[sel];
      return t ? "".concat(TN[t.q], " ").concat(t.c.inc ? "de la entrada" : "hacia " + t.c.name) : "";
    })() : "";
    const leg = ["F", "N", "PE", "R"].map((q) => '<span class="lg"><i style="background:'.concat(col(q)).concat(q === "R" ? ";background-image:repeating-linear-gradient(90deg,transparent 0 5px,rgba(255,255,255,.7) 5px 8px)" : "", '"></i>').concat(TN[q], " (").concat(CNAME[q][1], ")</span>")).join("");
    return '<div class="bxtop"><p class="hint" style="margin:0">'.concat(rm ? rm.n + " \xB7 " : "", "C").concat(k0 + 1, " ").concat(esc((s.circuits[k0] || {}).n || ""), " \xB7 <b>1 entrada y ").concat(nk, " derivaci\xF3n").concat(nk === 1 ? "" : "es", '</b></p>\n   <div class="wm"><span>Empalmes:</span><button type="button" data-sa="wm" data-v="auto" aria-pressed="').concat(!man, '">Autom\xE1ticos</button><button type="button" data-sa="wm" data-v="man1" aria-pressed="').concat(man, '">Los hago yo</button></div></div>\n   <div class="bxgrid"><div class="bxl"><div class="bxwrap').concat(simBoxZoom ? " zoom" : "", '"><button type="button" class="bxz" data-sa="bxzoom">').concat(simBoxZoom ? "\u2212 Achicar" : "\u{1F50D} Ampliar", '</button><svg class="boxsvg" viewBox="0 0 ').concat(Wd, " ").concat(yB + 100, '" style="--bw:').concat(Wd, 'px" role="img" aria-label="Interior de ').concat(esc(b.name), '">').concat(svg, '</svg></div></div><div class="bxr"><div class="bxst ').concat(errs.length ? "bad" : "ok", '">').concat(errs.length ? "\u2717 ".concat(errs.length, " error(es) \xB7 ").concat(esc(errs[0].t.replace(b.name + ": ", ""))) : man ? "\u2713 Empalmes correctos" : "\u2713 Autom\xE1ticos (correctos)", '</div>\n   <div class="emp-bar ').concat(sel ? "on" : "", '">').concat(sel ? '<div class="eb-t">\u270B <b>'.concat(esc(selTxt), '</b> \u2014 \xBFa qu\xE9 regleta lo conectas?</div><div class="dsts">').concat(rows.map((r) => {
      const here = r.g.includes(sel);
      const nm = r.dom === "R" ? (() => {
        const w = r.g.map((k) => s.items.find((i) => i.id === +k.split(":")[0])).find((i) => i && i.t === "sw");
        return w ? "Retorno " + ab2(w.name) : "Retorno";
      })() : TN[r.dom];
      return '<button type="button" class="dst'.concat(here ? " here" : "").concat(r.sug ? " sug" : "", '" data-sa="row" data-b="').concat(b.id, '" data-g="').concat(r.i, '" style="--c:').concat(col(r.dom), '" ').concat(here ? "disabled" : "", "><i></i>").concat(esc(nm), " <small>").concat(r.g.length).concat(here ? " \xB7 aqu\xED" : "", "</small></button>");
    }).join(""), '<button type="button" class="dst" data-sa="newrow" data-b="').concat(b.id, '">\uFF0B Regleta nueva</button></div><div class="dsts"><button type="button" class="btn ghost small" data-sa="hint">\u{1F4A1} \xBFD\xF3nde va?</button><button type="button" class="btn ghost small" data-sa="cut">\u2702 Dejar suelto</button><button type="button" class="btn ghost small" data-sa="tsx">Cancelar</button></div>') : '<span class="hint">Toca un <b>cable</b> (c\xEDrculo de color) y elige en los botones a qu\xE9 <b>regleta</b> va. Tambi\xE9n puedes tocar la regleta en el dibujo. \u2702 suelta una regleta completa.'.concat(man ? "" : " Al tocar pasas a empalmes manuales.", "</span>"), "</div>\n   ").concat(errs.length ? '<div class="note bad" style="margin:8px 0"><b>'.concat(errs.length, ' error(es) en esta caja</b><ul class="whyl" style="margin-top:6px">').concat(errs.map((o) => '<li class="badc"><b>\u2717 '.concat(esc(o.t.replace(b.name + ": ", "")), "</b><br>").concat(esc(o.d), '<br><span class="hint">Por qu\xE9: ').concat(esc(o.w), "</span></li>")).join(""), "</ul></div>") : note(man ? "\u2713 Los empalmes de esta caja est\xE1n correctos." : "Empalmes autom\xE1ticos: la app los hace bien. Elige \xABLos hago yo\xBB para practicar.", "ok"), '\n   <div class="chips">').concat(st, '</div>\n   <div class="actions" style="border:0;padding:4px 0 0"><button type="button" class="btn ghost small" data-sa="undo" ').concat(simUndo.length ? "" : "disabled", ">\u21B6 Deshacer</button>").concat(man ? '<button type="button" class="btn ghost small" data-sa="empsol" data-b="'.concat(b.id, '">Ver soluci\xF3n</button><button type="button" class="btn ghost small" data-sa="empclr" data-b="').concat(b.id, '">Soltar todos</button><button type="button" class="btn ghost small" data-sa="wm" data-v="man0">Todas las cajas desde cero</button>') : "", '</div>\n   <div class="legend">').concat(leg, '<span class="lg">\u25CF = conexi\xF3n \xB7 cruce sin punto = no se tocan</span></div>\n   <details class="hud-d"><summary>\xBFC\xF3mo se empalma una caja?</summary><div class="hud-e">Cada regleta es un empalme (conector). En una caja van: una regleta de <b>fase</b> con la fase de la entrada y la de cada salida (tambi\xE9n la que va al interruptor); una de <b>neutro</b> con todos los neutros; una de <b>tierra</b> con todas las tierras; y una de <b>retorno</b> por cada interruptor, que une su retorno con el de la luz que controla. Nunca se une fase con neutro ni con tierra. La fase se muestra en rojo (la norma permite azul, negro o rojo para las fases) y el retorno en rojo oscuro con franja: es la misma fase que vuelve desde el interruptor.</div></details></div></div>');
  }
  const ODIAM = { 1.5: 3, 2.5: 3.6, 4: 4.2, 6: 4.8, 10: 6.2, 16: 7.4 };
  function tubeOf(c, e) {
    const d = +(e.S || c.S) >= 4 || e.cond.length > 3 ? 20 : 16;
    return { d, din: d === 16 ? 13 : 17 };
  }
  function edgeChecks(s, e) {
    const c = s.circuits[e.ci];
    if (!c) return { curv: 0, warn: [], fill: 0, d: 16 };
    const { d, din } = tubeOf(c, e), R = 6 * d / 1e3, w = [];
    let curv = 0;
    for (let i = 1; i < e.pts.length - 1; i++) {
      const a = e.pts[i - 1], b = e.pts[i], q = e.pts[i + 1], u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [q[0] - b[0], q[1] - b[1], q[2] - b[2]], lu = Math.hypot(...u), lv = Math.hypot(...v);
      if (lu < 1e-4 || lv < 1e-4) continue;
      if (i === 1 && lu <= 0.08 || i === e.pts.length - 2 && lv <= 0.08) continue;
      const cs = (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]) / (lu * lv);
      if (cs < 0.87) {
        curv++;
        if (cs < -0.5 && e.it.route && !w.some((x) => x.k === "vuelta")) w.push({ k: "vuelta", t: "el recorrido se devuelve", d: "El tubo retrocede sobre su propio camino: cuenta como dos curvas y no deja pasar el cable. Mueve ese punto." });
        const tg = Math.tan(Math.min(Math.PI / 2, Math.acos(Math.max(-1, Math.min(1, cs)))) / 2) * R;
        if (e.it.route && (lu < tg - 1e-3 || lv < tg - 1e-3) && !w.some((x) => x.k === "radio")) w.push({ k: "radio", t: "curva muy cerrada", d: "Entre dos curvas hay ".concat(n0(Math.min(lu, lv) * 100), " cm; un tubo de ").concat(d, " mm necesita un radio de unos ").concat(n0(R * 100), " cm (\u2248 6 veces su di\xE1metro).") });
      }
    }
    if (curv > 3) w.push({ k: "curvas", t: "".concat(curv, " curvas en un solo tramo"), d: "Con m\xE1s de 3 curvas de 90\xB0 el cable cuesta mucho de pasar (gu\xEDa) y se da\xF1a el aislamiento. Agrega una caja de paso o simplifica el recorrido." });
    for (let i = 1; i < e.pts.length; i++) {
      const a = e.pts[i - 1], b = e.pts[i];
      if (Math.max(a[1], b[1]) > 2.05 && Math.min(a[1], b[1]) > 2.05) continue;
      DOORS.forEach(([ax, v, m0, m1]) => {
        const on = ax === "x" ? Math.abs(a[0] - v) < 0.2 && Math.abs(b[0] - v) < 0.2 : Math.abs(a[2] - v) < 0.2 && Math.abs(b[2] - v) < 0.2;
        if (!on) return;
        const t0 = Math.min(ax === "x" ? a[2] : a[0], ax === "x" ? b[2] : b[0]), t1 = Math.max(ax === "x" ? a[2] : a[0], ax === "x" ? b[2] : b[0]);
        if (t1 > m0 + 0.02 && t0 < m1 - 0.02 && !w.some((x) => x.k === "puerta")) w.push({ k: "puerta", t: "pasa por el vano de una puerta", d: "Bajo 2 m el tubo cruza una puerta: s\xFAbelo por sobre el dintel o ll\xE9valo por el entretecho." });
      });
    }
    const A = e.cond.length * Math.PI * Math.pow((ODIAM[+(e.S || c.S)] || 3.6) / 2, 2), fill = A / (Math.PI * Math.pow(din / 2, 2)) * 100;
    const fmax = llenadoMax(e.cond.length);
    if (fill > fmax) w.push({ k: "llenado", t: "tubo lleno al ".concat(n0(fill), " %"), d: "Usa un tubo de di\xE1metro mayor: con ".concat(e.cond.length, " conductores el m\xE1ximo es ").concat(fmax, " % (RIC N\xB004, Tabla 4.21; la tierra cuenta).") });
    return { curv: Math.max(0, curv), warn: w, fill, d };
  }
  function srcName(s) {
    if (!simSrc) return "";
    if (simSrc.box != null) {
      const b = s.items.find((i) => i.id === simSrc.box);
      return b ? "".concat(b.name, " (C").concat(cIdx(s, b.c) + 1, ")") : "";
    }
    const k = cIdx(s, simSrc.cid);
    return k >= 0 ? "autom\xE1tico C".concat(k + 1, " ").concat(s.circuits[k].n || "") : "";
  }
  function simIdentify(ud) {
    const s = S.sim2, o = simTool;
    simTool = "info";
    let m = null;
    try {
      if (ud.k === "item" && (s.items.find((i) => i.id === ud.id) || {}).t === "box") {
        simSheet = "box:" + ud.id;
        simSel = "i" + ud.id;
        simTermSel = null;
        renderSheet();
        simBuild();
        return;
      }
      m = simMeasure(s, ud);
    } finally {
      simTool = o;
    }
    if (m) {
      m.name = "\u24D8 " + m.name;
      simShowHud(m);
      if (ud.k === "edge") simSel = "e" + ud.id;
      else if (ud.k === "item") simSel = "i" + ud.id;
      simBuild();
    }
  }
  function simWireHud() {
    const s = S.sim2, secs = '<div class="hud-sec"><span>Cable:</span>' + [[0, "Del circuito"], [1.5, "1,5"], [2.5, "2,5"], [4, "4"], [6, "6"]].map(([v, l]) => '<button type="button" class="chip' + (simWS === v ? " on" : "") + '" data-sa="wsec" data-v="' + v + '">' + l + (v ? " mm\xB2" : "") + "</button>").join("") + "</div>";
    const cut = '<button type="button" class="btn ' + (simWCut ? "danger" : "ghost") + ' small" data-sa="wcut">✂ ' + (simWCut ? "Desconectando…" : "Desconectar") + "</button>";
    if (simWCut) {
      simShowHud({ name: "Desconectar", val: "", unit: "", sub: "Toca el punto o la caja al que quieres quitarle el cable. Lo que cuelga de una caja queda unido a ella.", html: '<div class="hud-btns">' + cut + '<button type="button" class="btn small" data-sa="wdone">✓ Listo</button></div>', open: false });
      return;
    }
    if (!simSrc) {
      simShowHud({ name: "Conectar", val: "", unit: "", sub: "1) Toca la caja de derivaci\xF3n o el autom\xE1tico (C1, C2…) del tablero de donde sale el cable.", html: secs + '<div class="hud-btns">' + cut + "</div>", exp: "Despu\xE9s toca cada enchufe, interruptor, luz o caja que quieras alimentar desde ah\xED. El tubo sale de la caja y va por el muro o por el entretecho, cada uno por su propio carril.", open: false });
      return;
    }
    const kids = s.items.filter((i) => !i.free && (simSrc.box != null ? i.par === simSrc.box : i.par == null && i.c === simSrc.cid));
    simShowHud({ name: "Conectar", val: "", unit: "", sub: "Origen: ".concat(srcName(s), " \xB7 ").concat(kids.length, " conectado(s). 2) Toca los puntos que alimenta. Toca una caja ya conectada para seguir cableando desde ella."), html: secs + '<div class="hud-btns"><button type="button" class="btn ghost small" data-sa="wsrc">Cambiar origen</button>' + cut + '<button type="button" class="btn small" data-sa="wdone">✓ Listo</button></div>', exp: "Un punto suelto o una caja suelta queda alimentado desde el origen con la secci\xF3n elegida (\xABDel circuito\xBB usa la del autom\xE1tico). Tocar una caja que ya tiene cable la vuelve el nuevo origen. Tocar otra vez un punto que ya sale de este origen lo desconecta; para soltar una caja usa ✂ Desconectar.", open: false });
  }
  function simWireClick(s, ud) {
    const msgs = [];
    if (ud.k === "tm") {
      simSrc = { cid: ud.cid };
      simSel = null;
      simBuild();
      simWireHud();
      return;
    }
    if (ud.k !== "item") {
      simWireHud();
      return;
    }
    const it = s.items.find((i) => i.id === ud.id);
    if (!it) return;
    if (simWCut) {
      if (it.free) simToast([["warn", "".concat(it.name, " ya est\xE1 sin cable.")]]);
      else {
        it.free = true;
        it.par = null;
        if (simSrc && simSrc.box === it.id) simSrc = null;
        msgs.push(["ok", "".concat(it.name, " desconectado.")]);
        simTrips(s, msgs);
        save();
        simRefresh(msgs);
      }
      simWireHud();
      return;
    }
    if (it.t === "box" && !it.free && (!simSrc || simSrc.box !== it.id)) {
      simSrc = { box: it.id };
      simSel = "i" + it.id;
      simBuild();
      simWireHud();
      simToast([["ok", "Ahora el origen es ".concat(it.name, ": toca los puntos que se alimentan desde ella.")]]);
      return;
    }
    if (!simSrc) {
      if (it.t === "box") {
        simSrc = { box: it.id };
        simSel = "i" + it.id;
        simBuild();
        simWireHud();
      } else simToast([["warn", "Primero toca la caja o el autom\xE1tico del tablero de donde sale el cable."]]);
      return;
    }
    if (simSrc.box === it.id) {
      simWireHud();
      return;
    }
    const fromBox = simSrc.box != null, src = fromBox ? s.items.find((i) => i.id === simSrc.box) : null, cid = fromBox ? src.c : simSrc.cid;
    const already = !it.free && (fromBox ? it.par === simSrc.box : it.par == null && it.c === cid);
    if (already) {
      it.free = true;
      it.par = null;
      msgs.push(["ok", "".concat(it.name, " desconectado. Queda sin cable.")]);
    } else {
      if (fromBox && descend(s, it.id).has(src.id)) {
        simToast([["warn", "No puedes alimentar ".concat(it.name, " desde ").concat(src.name, ": ").concat(src.name, " ya depende de ").concat(it.name, ".")]]);
        return;
      }
      it.free = false;
      it.par = fromBox ? src.id : null;
      if (simWS > 0) it.S = simWS;
      else delete it.S;
      const sub = descend(s, it.id);
      s.items.forEach((i) => {
        if (sub.has(i.id)) i.c = cid;
      });
      msgs.push(["ok", "".concat(it.name, " conectado desde ").concat(fromBox ? src.name : "el tablero (C" + (cIdx(s, cid) + 1) + ")", simWS > 0 ? " con " + sStr(simWS) + " mm\xB2" : "", it.t === "box" ? ". Toca de nuevo la caja para seguir cableando desde ella." : ".")]);
    }
    simTrips(s, msgs);
    save();
    simRefresh(msgs);
    simWireHud();
  }
  function simRouteHud() {
    const s = S.sim2, it = s.items.find((i) => i.id === simRoute);
    if (!it) {
      simShowHud(null);
      return;
    }
    const ev = simEval(s), e = ev.ed.get(it.id), ck = e ? edgeChecks(s, e) : { curv: 0, warn: [], fill: 0, d: 16 }, par = it.par != null ? s.items.find((i) => i.id === it.par) : null;
    simShowHud({
      name: "Ducto: recorrido y codos",
      val: e ? n1(e.L) : "",
      unit: "m",
      sub: "".concat(par ? par.name : "Tablero", " \u2192 ").concat(it.name, " \xB7 ").concat((it.route || []).length, " punto(s) \xB7 ").concat(ck.curv, " codo(s) de 90\xB0 \xB7 tubo ").concat(ck.d, " mm \xB7 llenado ").concat(n0(ck.fill), " %"),
      ok: ck.warn.length ? false : true,
      html: "".concat(ck.warn.map((x) => '<div class="hud-s" style="color:var(--bad)">\u2717 '.concat(esc(x.t), ": ").concat(esc(x.d), "</div>")).join(""), '<div class="hud-btns"><button type="button" class="btn ghost small" data-sa="rshape" data-k="up">\u2934 Por arriba</button><button type="button" class="btn ghost small" data-sa="rshape" data-k="dn">\u2935 Por abajo</button><button type="button" class="btn ghost small" data-sa="rshape" data-k="vf">\u2195 Vertical primero</button><button type="button" class="btn ghost small" data-sa="rshape" data-k="hf">\u2194 Horizontal primero</button></div><div class="hud-btns"><button type="button" class="btn ghost small" data-sa="rundo">\u21B6 Quitar punto</button><button type="button" class="btn ghost small" data-sa="rclear">Recorrido autom\xE1tico</button><button type="button" class="btn small" data-sa="rdone">\u2713 Listo</button></div>'),
      exp: "Toca muros o el piso para marcar por d\xF3nde pasa el tubo. En un muro el tubo baja o sube por ese muro; en el piso queda en el entretecho sobre ese punto. El largo cambia la ca\xEDda de tensi\xF3n y el listado de materiales.",
      open: false
    });
  }
  function simTrips(s, msgs) {
    for (let g = 0; g < 6; g++) {
      const ev = simEval(s);
      if (s.gen.on && ev.It > +s.gen.In) {
        s.gen.on = false;
        s.done.trip = 1;
        msgs.push(["bad", "El interruptor general (".concat(s.gen.In, " A) dispar\xF3: la corriente total, ").concat(nf(ev.It, 1), " A, super\xF3 su capacidad.")]);
        continue;
      }
      let nb = false;
      s.circuits.forEach((c, k) => {
        const x = ev.cs[k];
        if (x.en && c.dr !== "none" && c.nc === "bar" && x.I > 0.03) {
          s.drOff[c.dr] = true;
          nb = true;
          msgs.push(["bad", "".concat(c.dr, " dispar\xF3: el neutro de C").concat(k + 1, " est\xE1 conectado a la barra N general y no a la salida del diferencial. La corriente que vuelve por ese neutro no pasa por el diferencial, que la ve como una fuga.")]);
        }
      });
      if (nb) continue;
      if (ev.W) {
        let tr = false;
        ev.W.D.cf.forEach((f2) => {
          const k = cIdx(s, f2.cid), c = s.circuits[k], x = ev.cs[k];
          if (!x || !x.en || tr) return;
          const b = ev.by.get(f2.box), h = (a) => f2.ss.includes(a);
          if (h("L") && h("N")) {
            c.on = false;
            tr = true;
            s.done.trip = 1;
            msgs.push(["bad", "C".concat(k + 1, " dispar\xF3 por cortocircuito: en ").concat(b.name, " un empalme une la fase con el neutro").concat(f2.sw ? " al cerrar el interruptor" : "", ". La parte magn\xE9tica del autom\xE1tico cort\xF3 al instante.")]);
          } else if (h("L") && h("E")) {
            if (c.dr !== "none") {
              s.drOff[c.dr] = true;
              tr = true;
              msgs.push(["bad", "".concat(c.dr, " dispar\xF3: en ").concat(b.name, " la fase qued\xF3 unida a la tierra y la corriente se fue por el conductor de protecci\xF3n.")]);
            } else {
              c.on = false;
              tr = true;
              msgs.push(["bad", "\xA1Peligro! En ".concat(b.name, " la fase est\xE1 unida a la tierra y C").concat(k + 1, " no tiene diferencial: las carcasas quedan con tensi\xF3n. Se cort\xF3 C").concat(k + 1, ".")]);
            }
          } else if (h("N") && h("E") && x.I > 0.03 && c.dr !== "none") {
            s.drOff[c.dr] = true;
            tr = true;
            msgs.push(["bad", "".concat(c.dr, " dispar\xF3: en ").concat(b.name, " el neutro est\xE1 unido a la tierra. Parte de la corriente vuelve por la tierra y el diferencial lo ve como fuga.")]);
          }
        });
        if (tr) continue;
      }
      let ch = false;
      s.circuits.forEach((c, k) => {
        const x = ev.cs[k];
        if (x.en && x.I > +c.In) {
          c.on = false;
          ch = true;
          s.done.trip = 1;
          msgs.push(["bad", "C".concat(k + 1, " ").concat(c.n || "", " dispar\xF3 por sobrecarga: ").concat(nf(x.I, 1), " A > ").concat(c.In, " A. La parte t\xE9rmica del autom\xE1tico cort\xF3 para proteger el cable.")]);
        }
      });
      if (ch) continue;
      const f = s.fault;
      if (f && f.type === "carcasa") {
        const it = ev.by.get(f.item);
        if (it) {
          const k = cIdx(s, it.c), c = s.circuits[k];
          if (ev.cs[k].en && it.on && c.dr !== "none" && c.pe !== false) {
            s.drOff[c.dr] = true;
            msgs.push(["warn", "".concat(c.dr, " dispar\xF3: detect\xF3 una fuga a tierra en C").concat(k + 1, ". Algo conectado ah\xED tiene una falla de aislamiento hacia su carcasa.")]);
            continue;
          }
        }
      }
      if (ev.shock) msgs.push(["bad", "\xA1Peligro! Un equipo tiene su carcasa con tensi\xF3n y la falla no puede irse a tierra o no hay diferencial: nada corta. Si alguien la toca, la corriente pasa por su cuerpo."]);
      s.circuits.forEach((c, k) => {
        if (ev.cs[k].hot) msgs.push(["bad", "El cable de C".concat(k + 1, " se est\xE1 recalentando: lleva ").concat(nf(ev.cs[k].I, 1), " A y soporta ").concat(ev.cs[k].Iz, " A. El autom\xE1tico de ").concat(c.In, " A es demasiado grande para ese cable.")]);
      });
      if (s.items.some((i) => i.t === "lamp" && i.sw != null && ev.cs[cIdx(s, i.c)].en && ev.act(i))) s.done.lamp = 1;
      break;
    }
  }
  function pathLen(ev, id) {
    let L = 0, x = ev.ed.get(id), n = 0;
    while (x && n < 80) {
      L += x.L;
      x = x.from != null ? ev.ed.get(x.from) : null;
      n++;
    }
    return L;
  }
  function condHTML(cond) {
    return '<div class="conds">'.concat(cond.map((k) => '<span><i style="background:'.concat(CNAME[k][2], '"></i>').concat(CNAME[k][0], " (").concat(CNAME[k][1], ")</span>")).join(""), "</div>");
  }
  function itemDesc(s, it) {
    const k = cIdx(s, it.c), c = s.circuits[k], rm = itemRoom(it), par = it.par != null ? s.items.find((x) => x.id === it.par) : null;
    return "".concat(rm ? rm.n : "Sin recinto", " \xB7 C").concat(k + 1, " ").concat(c.n || "", " \xB7 desde ").concat(par ? par.name : "el tablero");
  }
  function simMeasure(s, ud) {
    const ev = simEval(s), f = s.fault, t = simTool, R = (name, val, unit, sub, exp, ok, html) => ({ name, val, unit, sub, exp, ok, html });
    const it = ud.k === "item" ? ev.by.get(ud.id) : null, e = ud.k === "edge" ? ev.ed.get(ud.id) : null, cid = it ? it.c : e ? e.cid : ud.cid != null ? ud.cid : null, k = cid != null ? cIdx(s, cid) : -1, c = k >= 0 ? s.circuits[k] : null, x = k >= 0 ? ev.cs[k] : null;
    if (t === "info") {
      if (e) {
        s.done.ident = 1;
        const ex = e.it.t === "sw" ? "Al interruptor solo llegan la fase y el retorno: el interruptor corta la fase, nunca el neutro." : e.it.t === "lamp" && e.it.sw != null ? "A la luz llegan el retorno (la fase que pas\xF3 por ".concat((ev.by.get(e.it.sw) || {}).name || "el interruptor", "), el neutro y la tierra.") : e.it.t === "box" ? "A la caja llegan fase, neutro y tierra. Dentro se hacen los empalmes hacia los puntos siguientes." : "Fase, neutro y tierra: la tierra protege a las personas si el equipo tiene una falla.";
        const ck = edgeChecks(s, e);
        return R("Tramo de cable", "".concat(e.cond.length, " \xD7 ").concat(sStr(e.S)), "mm\xB2", "".concat(e.from != null ? ev.by.get(e.from).name : "Tablero", " \u2192 ").concat(e.it.name, " \xB7 C").concat(k + 1, " ").concat(c.n || "", " \xB7 ").concat(n1(e.L), " m \xB7 tubo ").concat(ck.d, " mm \xB7 llenado ").concat(n0(ck.fill), " % \xB7 ").concat(ck.curv, " curvas").concat(e.it.route ? " \xB7 recorrido manual" : ""), ex, null, condHTML(e.cond));
      }
      if (it) return R(it.name, it.t === "out" || it.t === "lamp" || it.t === "horno" ? n0(simP(it)) : "", it.t === "box" ? "" : "W", itemDesc(s, it), it.t === "sw" ? "Controla: ".concat(s.items.filter((l) => l.sw === it.id).map((l) => l.name).join(", ") || "ninguna luz", ". Altura 1,10 m (RIC N\xB010: 0,80 a 1,40 m).") : it.t === "box" ? "Caja de derivaci\xF3n. Desde aqu\xED salen: ".concat((ev.kids.get(it.id) || []).map((i) => ev.by.get(i).name).join(", ") || "nada todav\xEDa", ". Las uniones de cables se hacen siempre dentro de cajas (RIC N\xB004, 5.12).") : it.t === "lamp" ? "".concat(it.sw != null ? "Controlada por " + (ev.by.get(it.sw) || {}).name : "Sin interruptor", ". Para el proyecto se considera 100 W por centro.") : it.t === "out" ? "".concat(APPL[it.a][0], ". Para el proyecto se considera 250 W por enchufe.") : "Circuito exclusivo de m\xEDnimo 16 A (RIC N\xB010).", null);
      if (ud.k === "gen") return R("Interruptor general", s.gen.In, "A", "2 polos \xB7 6 kA \xB7 ".concat(s.gen.on ? "encendido" : "apagado"), "Corta fase y neutro de toda la casa (omnipolar). M\xEDnimo 25 A en una vivienda.", null);
      if (ud.k === "dr") {
        const cc = s.circuits.filter((z) => z.dr === ud.dr);
        return R(ud.dr, drIn(s), "A", "".concat(Math.max(...cc.map((z) => +z.ds)), " mA \xB7 clase ").concat(cc[0] ? cc[0].cl : "A", " \xB7 protege ").concat(cc.map((z) => "C" + (cIdx(s, z.id) + 1)).join(", ")), "Compara la corriente de fase y neutro; si hay una fuga a tierra mayor a su sensibilidad, corta.", null);
      }
      if (ud.k === "tm") return R("Autom\xE1tico C".concat(k + 1), c.In, "A", "Curva ".concat(c.cv, " \xB7 ").concat(c.pc, " kA \xB7 cable ").concat(sStr(+c.S), " mm\xB2 (Iz ").concat(ampOf(c.S), " A)"), "".concat(c.n || "Circuito", " \xB7 ").concat(c.dr === "none" ? "sin diferencial" : c.dr + " " + c.ds + " mA", ". Corriente ahora: ").concat(nf(x.I, 2), " A."), null);
      if (ud.k === "alim") return R("Alimentador", "2 \xD7 ".concat(sStr(+s.alim.S)), "mm\xB2", "Medidor \u2192 tablero \xB7 ".concat(n1(+s.alim.L), " m"), "Fase y neutro desde el medidor. La ca\xEDda no debe superar 3 %.", null, condHTML(["F", "N"]));
      if (ud.k === "rod") return R("Puesta a tierra", "Barra Cu", "", "C\xE1mara de registro", "Electrodo de cobre enterrado. Se une a la barra PE del tablero.", null, condHTML(["PE"]));
      if (ud.k === "medidor") return R("Medidor", "220", "V", "Empalme de la distribuidora", "Desde aqu\xED sale el alimentador al tablero.", null);
      return R("Tablero", "", "", "".concat(s.circuits.length, " circuito(s)"), "Contiene el general, los diferenciales y un autom\xE1tico por circuito, con barras N y PE separadas.", null);
    }
    if (t === "volt") {
      if (ud.k === "medidor") return R("Mult\xEDmetro \xB7 V CA", nf(V0, 1), "V", "Fase\u2013neutro en el empalme", "Tensi\xF3n que entrega la distribuidora.", true);
      if (ud.k === "rod") return R("Mult\xEDmetro", "\u2014", "", "No corresponde", "La resistencia de tierra se mide con el telur\xF3metro.", null);
      if (ud.k === "alim" || ud.k === "tab" || ud.k === "gen") return R("Mult\xEDmetro \xB7 V CA", nf(s.gen.on ? ev.Vtab : 0, 1), "V", "Salida del general", s.gen.on ? "Ca\xEDda en el alimentador: ".concat(nf(ev.dVa / V0 * 100, 2), " % (m\xE1ximo 3 %).") : "El general est\xE1 apagado.", s.gen.on);
      if (ud.k === "tm" || ud.k === "dr") return R("Mult\xEDmetro \xB7 V CA", nf(x && x.en ? ev.Vtab : 0, 1), "V", "Salida de la protecci\xF3n", x && x.en ? "Hay tensi\xF3n a la salida." : "Sin tensi\xF3n: la protecci\xF3n est\xE1 abierta.", x ? x.en : null);
      const id = it ? it.id : e.id, node = ev.by.get(id), Vn = x.en ? ev.V[id] || 0 : 0, pe = f && f.type === "pe" && f.item === id || c.pe === false || !!(ev.W && ev.W.D.sg[id] && "PE" in ev.W.D.sg[id] && ev.W.D.sg[id].PE !== "E");
      if (!x.en) return R("Mult\xEDmetro \xB7 V CA", "0,0", "V", node.name, "0 V: el circuito est\xE1 desenergizado. Revisa el general, el diferencial y el autom\xE1tico.", false);
      if (node.t === "sw") {
        const open = !node.on;
        if (open) s.done.swv = 1;
        return R("Mult\xEDmetro \xB7 entre bornes", nf(open ? Vn : 0, 1), "V", "".concat(node.name, " ").concat(open ? "abierto" : "cerrado"), open ? "Con el interruptor abierto aparece toda la tensi\xF3n entre sus bornes: la fase llega por un lado y el retorno est\xE1 cortado." : "Cerrado: entre sus bornes hay 0 V porque se comporta como un conductor.", null);
      }
      if (node.t === "lamp" && !ev.act(node)) return R("Mult\xEDmetro \xB7 V CA", "0,0", "V", node.name, "La luz no recibe tensi\xF3n: ".concat(node.sw != null ? "su interruptor est\xE1 abierto (el retorno no trae fase)." : "est\xE1 apagada."), null);
      if (Vn < 1 && node.t !== "sw") return R("Mult\xEDmetro \xB7 V CA", "0,0", "V", node.name, "0 V entre fase y neutro: a este punto no le llegan bien la fase y el neutro. Revisa los empalmes de la caja que lo alimenta y el neutro del circuito en el tablero.", false);
      if (node.t === "out") s.done.volt = 1;
      const pct = (V0 - Vn) / V0 * 100;
      return R("Mult\xEDmetro \xB7 V CA", nf(Vn, 1), "V", "F\u2013N ".concat(nf(Vn, 1), " \xB7 F\u2013T ").concat(pe ? "0,0" : nf(Vn - 0.4, 1), " \xB7 N\u2013T ").concat(nf((ev.Vtab - Vn) / 2 + 0.3, 1), " V"), "".concat(node.name, ". Ca\xEDda total ").concat(nf(pct, 1), " % (m\xE1ximo 5 %).").concat(pe ? " Fase\u2013tierra en 0 V: este punto no tiene tierra." : "").concat(pct > 5 ? " Tensi\xF3n demasiado baja: revisa secci\xF3n, largo o un empalme flojo." : ""), pct <= 5 && !pe);
    }
    if (t === "pinza") {
      if (e || it) {
        const id = (e || it).id, Ie = x.en ? ev.I[id] || 0 : 0;
        if (Ie > 0) s.done.pinza = 1;
        const nd = ev.by.get(id);
        return R("Pinza \xB7 A CA", nf(Ie, 2), "A", e ? "Tramo hacia ".concat(nd.name) : nd.name, "Corriente que pasa por ese tramo: la de ".concat(nd.name).concat((ev.kids.get(id) || []).length ? " y todo lo que se alimenta desde ah\xED" : "", ". La pinza abraza un solo conductor."), Ie <= +c.In);
      }
      if (ud.k === "tm") {
        if (x.I > 0) s.done.pinza = 1;
        return R("Pinza \xB7 A CA", nf(x.I, 2), "A", "C".concat(k + 1, " \xB7 autom\xE1tico ").concat(c.In, " A \xB7 cable ").concat(ampOf(c.S), " A"), "Corriente total del circuito.", x.I <= +c.In);
      }
      if (ud.k === "rod") return R("Pinza \xB7 A CA", "0,00", "A", "Conductor de tierra", "En condiciones normales por la tierra no circula corriente.", true);
      if (ev.It > 0) s.done.pinza = 1;
      return R("Pinza \xB7 A CA", nf(ev.It, 2), "A", "Alimentador \xB7 general ".concat(s.gen.In, " A"), "Corriente total de la casa.", ev.It <= +s.gen.In);
    }
    if (t === "megger") {
      if (!c) return R("Meg\xF3hmetro", "\u2014", "", "Toca un ducto, un punto o un autom\xE1tico", "El aislamiento se mide por circuito.", null);
      if (x.en) return R("Meg\xF3hmetro", "\xA1ALTO!", "", "Circuito energizado", "Nunca midas aislamiento con tensi\xF3n: baja el autom\xE1tico primero. El meg\xF3hmetro inyecta 500 V CC.", false);
      s.done.megger = 1;
      const bad = f && f.type === "aisl" && f.c === c.id;
      return R("Meg\xF3hmetro \xB7 500 V CC", bad ? "0,18" : ">200", "M\u03A9", "C".concat(k + 1, " ").concat(c.n || ""), bad ? "Bajo 0,5 M\u03A9: el aislamiento est\xE1 da\xF1ado (RIC N\xB019, Tabla 19.1)." : "Sobre 0,5 M\u03A9: el aislamiento est\xE1 sano.", !bad);
    }
    if (t === "telu") {
      if (ud.k !== "rod") return R("Telur\xF3metro", "\u2014", "", "Toca la barra de tierra", "Est\xE1 en la c\xE1mara, afuera junto al medidor.", null);
      s.done.telu = 1;
      const v = f && f.type === "tierraAlta" ? 68 : 15;
      return R("Telur\xF3metro", v, "\u03A9", "Puesta a tierra", v <= 20 ? "Bajo 20 \u03A9: cumple (RIC N\xB006)." : "Sobre 20 \u03A9: no cumple. Hay que mejorar el electrodo.", v <= 20);
    }
    if (t === "cont") {
      if (!it || it.t === "sw") return R("Continuidad PE", "\u2014", "", "Toca un enchufe, luz, caja u horno", "", null);
      if (x.en) return R("Continuidad PE", "\xA1ALTO!", "", "Circuito energizado", "Apaga el autom\xE1tico antes de probar continuidad.", false);
      s.done.cont = 1;
      const bad = f && f.type === "pe" && f.item === it.id || c.pe === false || !!(ev.W && ev.W.D.sg[it.id] && "PE" in ev.W.D.sg[it.id] && ev.W.D.sg[it.id].PE !== "E"), r = RHO * pathLen(ev, it.id) / +c.S + 0.1;
      return R("Continuidad PE", bad ? "OL" : nf(r, 2), bad ? "" : "\u03A9", "".concat(it.name, " \u2194 barra PE"), bad ? c.pe === false ? "OL = abierto: la tierra de este circuito no est\xE1 conectada a la barra PE del tablero." : "OL = abierto: el conductor de tierra est\xE1 cortado. Este punto no est\xE1 protegido." : "Hay continuidad: la tierra llega a este punto.", !bad);
    }
    if (t === "drt") {
      if (ud.k !== "dr") return R("Probador DR", "\u2014", "", "Toca un diferencial del tablero", "", null);
      if (!s.gen.on) return R("Probador DR", "\u2014", "", "Sin tensi\xF3n", "Sube el general: el probador necesita tensi\xF3n.", null);
      s.done.drt = 1;
      const bad = f && f.type === "drMalo" && f.dr === ud.dr, ds = Math.max(30, ...s.circuits.filter((z) => z.dr === ud.dr).map((z) => +z.ds));
      if (bad) return R("Probador DR", "No dispara", "", "".concat(ud.dr, " \xB7 prueba con ").concat(ds, " mA"), "No cort\xF3: est\xE1 defectuoso y debe reemplazarse.", false);
      s.drOff[ud.dr] = true;
      return R("Probador DR", "".concat(Math.round(ds * 0.72), " mA"), "", "".concat(ud.dr, " dispar\xF3 en 24 ms"), "Dispar\xF3 bajo su sensibilidad y r\xE1pido: funciona.".concat(ds > 30 ? " Pero 300 mA no protege a las personas." : "", " S\xFAbelo con la herramienta Mano."), ds <= 30);
    }
    return null;
  }
  let simRegT = "N";
  function regBar(s) {
    const L = regOf(s), nd = regNeed(s), sel = L[simRegSel];
    const ctl = sel ? '<div class="pb-w" style="flex:0 0 100%;order:5;margin:2px 0"><b>' + REG_T[sel.t][1] + " " + sel.n + '</b> \xB7 toca el tablero en el 3D para ubicarla o mu\xE9vela:</div><div class="pb-t pb-v" role="group" aria-label="Mover regleta seleccionada"><button type="button" data-sa="regmv" data-k="-1,0" aria-label="Mover a la izquierda">\u2190</button><button type="button" data-sa="regmv" data-k="0,1" aria-label="Mover hacia arriba">\u2191</button><button type="button" data-sa="regmv" data-k="0,-1" aria-label="Mover hacia abajo">\u2193</button><button type="button" data-sa="regmv" data-k="1,0" aria-label="Mover a la derecha">\u2192</button>' + [["top", "Arriba"], ["mid", "Centro"], ["bot", "Abajo"], ["izq", "Izquierda"], ["der", "Derecha"]].map(([k, l]) => '<button type="button" data-sa="regz" data-k="' + k + '">' + l + "</button>").join("") + '<button type="button" data-sa="regdel" data-i="' + simRegSel + '">\u2715 Quitar</button></div>' : "";
    return '<div class="pb-t pb-v">' + Object.entries(REG_T).map(([k, v]) => '<button type="button" data-sa="regt" data-k="' + k + '" aria-pressed="' + (simRegT === k) + '">' + v[1] + "</button>").join("") + '</div><div class="pb-t pb-v">' + (simRegT === "peine" ? [12, 24] : simRegT === "F" ? [4, 7] : [4, 7, 12, 15]).map((n) => '<button type="button" data-sa="regadd" data-n="' + n + '">\uFF0B ' + n + (simRegT === "peine" ? " m\xF3d." : " bornes") + "</button>").join("") + "</div>" + '<div class="pb-t pb-v" style="flex-wrap:wrap">' + (L.length ? L.map((r, i) => '<button type="button" data-sa="regsel" data-i="' + i + '" aria-pressed="' + (i === simRegSel) + '" title="Seleccionar para moverla">' + REG_T[r.t][1] + " " + r.n + "</button>").join("") : '<span class="pb-w">Tablero sin regletas</span>') + '<span class="pb-w">Bornes necesarios: N ' + nd.N + " \xB7 PE " + nd.PE + "</span></div>" + ctl;
  }
  function simPlace(hit) {
    const s = S.sim2;
    if (simPT === "reg") {
      const L = regOf(s), r = L[simRegSel];
      if (hit && hit.k === "regpos" && r) {
        if (!Array.isArray(s.reg)) s.reg = L.map((q) => Object.assign({}, q));
        const q = s.reg[simRegSel];
        q.x = Math.round((hit.p[0] - TX) * 100) / 100;
        q.y = Math.round(hit.p[1] * 100) / 100;
        const P2 = regPos(s, q, simRegSel);
        q.x = P2.x;
        q.y = P2.y;
        simToast([["ok", REG_T[q.t][0] + " ubicada. Puedes afinar con las flechas."]]);
      } else simToast([["ok", L.length ? "Selecciona una regleta en la barra de abajo y toca el tablero donde quieres ponerla." : "Primero agrega una regleta: elige el tipo y toca \xAB\uFF0B bornes\xBB en la barra de abajo."]]);
      const pl = document.getElementById("simplace");
      if (pl) pl.innerHTML = placeBar();
      return;
    }
    if (!s.circuits.length) {
      simToast([["warn", "Primero agrega un circuito en el panel de abajo."]]);
      return;
    }
    if (s.items.length >= MAXI) {
      simToast([["warn", "M\xE1ximo ".concat(MAXI, " puntos.")]]);
      return;
    }
    const cid = simPC != null && cIdx(s, simPC) >= 0 ? simPC : s.circuits[0].id;
    let id;
    const hy = (d) => (PANEL || simPT === "lamp" ? Math.max(0.25, Math.min(2.3, hit.p[1] - flY(hit.p[1]) * FH)) : d) + flY(hit.p[1]) * FH;
    if (simPT === "lamp" && (simPV.lamp === "pm" || PANEL)) {
      if (hit.k !== "wall" || !roomOf(hit.p[0] + hit.n[0] * 0.3, hit.p[2] + hit.n[2] * 0.3, flY(hit.p[1]))) {
        simToast([["warn", PANEL ? "Toca la madera del panel para colocar el portal\xE1mpara." : "El portal\xE1mpara de muro se coloca tocando la cara interior de un muro."]]);
        return;
      }
      id = simAddItem(s, "lamp", cid, [hit.p[0], hy(1.8), hit.p[2]], hit.n, Object.assign(s.mconn === false ? {} : { free: true }, { v: "pm" }));
    } else if (simPT === "lamp") {
      if (hit.k !== "floor" && hit.k !== "ceil") {
        simToast([["warn", "Para colocar una luz, toca el techo (o el piso) del recinto."]]);
        return;
      }
      id = simAddItem(s, "lamp", cid, [hit.p[0], 2.42 + flY(hit.p[1]) * FH, hit.p[2]], null, Object.assign(s.mconn === false ? {} : { free: true }, { v: simPV.lamp }));
    } else if (simPT === "box" && hit.k === "ceil") {
      if (!roomOf(hit.p[0], hit.p[2], flY(hit.p[1]))) {
        simToast([["warn", "Toca el techo dentro de la casa."]]);
        return;
      }
      id = simAddItem(s, "box", cid, [hit.p[0], WH + flY(hit.p[1]) * FH, hit.p[2]], [0, -1, 0], s.mconn === false ? {} : { free: true });
    } else {
      if (hit.k !== "wall") {
        simToast([["warn", simPT === "box" ? "Toca un muro o el techo para colocar la caja." : "Toca un muro para colocar este elemento."]]);
        return;
      }
      if (!roomOf(hit.p[0] + hit.n[0] * 0.3, hit.p[2] + hit.n[2] * 0.3, flY(hit.p[1]))) {
        simToast([["warn", "Toca la cara interior de un muro de la casa."]]);
        return;
      }
      id = simAddItem(s, simPT, cid, [hit.p[0], PANEL ? hy(T_Y[simPT]) : T_Y[simPT] + flY(hit.p[1]) * FH, hit.p[2]], hit.n, Object.assign(s.mconn === false ? {} : { free: true }, VAR[simPT] ? { v: simPV[simPT] } : {}));
    }
    const it = s.items.find((i) => i.id === id), rm = itemRoom(it);
    simSel = "i" + id;
    simToast([["ok", it.free ? "".concat(it.name, " colocado en ").concat(rm ? rm.n : "la casa", ", sin cable. Usa \u{1F517} Conectar: toca la caja o el autom\xE1tico de origen y luego este punto.") : "".concat(it.name, " colocado en ").concat(rm ? rm.n : "la casa", " \xB7 C").concat(cIdx(s, cid) + 1, ". Conectado desde ").concat(it.par != null ? s.items.find((i) => i.id === it.par).name : "el tablero", ".")]]);
  }
  function simDelete(id) {
    const s = S.sim2, it = s.items.find((i) => i.id === id);
    if (!it) return;
    s.items.forEach((i) => {
      if (i.par === id) i.par = it.par;
      if (i.sw === id) i.sw = null;
    });
    s.items = s.items.filter((i) => i.id !== id);
    if (s.fault && (s.fault.item === id || s.fault.box === id)) s.fault = null;
    simSel = null;
  }
  function simClick(ud) {
    const s = S.sim2, msgs = [];
    if (simTool === "look") {
      if (SIMV && ud.pt) {
        SIMV.focus(ud.pt);
      }
      return;
    }
    if (simTool === "wire") {
      simWireClick(s, ud);
      return;
    }
    if (simTool === "route") {
      if (ud.k === "rpt" && simRoute != null) {
        const it = s.items.find((i) => i.id === simRoute);
        if (it) {
          (it.route = it.route || []).push(ud.p);
          if (it.route.length > 12) it.route.shift();
        }
        save();
        simRefresh();
        simRouteHud();
        return;
      }
      if (ud.k === "edge" || ud.k === "item") {
        simRoute = ud.id;
        simSel = "e" + ud.id;
        simBuild();
        simRouteHud();
        return;
      }
      simShowHud(null);
      return;
    }
    if (simTool === "place") {
      simPlace(ud);
      save();
      simRefresh();
      return;
    }
    if (simTool === "del") {
      if (ud.k === "item") {
        const it = s.items.find((i) => i.id === ud.id);
        simDelete(ud.id);
        msgs.push(["ok", "".concat(it.name, " quitado.")]);
      } else msgs.push(["warn", "Toca un punto (luz, enchufe, interruptor, caja u horno) para quitarlo."]);
      simTrips(s, msgs);
      save();
      simRefresh(msgs);
      return;
    }
    if (simTool === "mano") {
      if (ud.k === "gen") s.gen.on = !s.gen.on;
      else if (ud.k === "dr") s.drOff[ud.dr] = !s.drOff[ud.dr];
      else if (ud.k === "tm") {
        const c = s.circuits[cIdx(s, ud.cid)];
        c.on = !c.on;
      } else if (ud.k === "item") {
        const it = s.items.find((i) => i.id === ud.id);
        if (it.t === "box") {
          simSheet = "box:" + it.id;
          simSel = "i" + it.id;
          simTermSel = null;
          renderSheet();
          simBuild();
          return;
        }
        if (it.t === "lamp" && it.sw != null) {
          const w = s.items.find((i) => i.id === it.sw);
          swPress(w, (w.v === "d" || w.v === "t") ? it.k || 0 : 0);
          msgs.push(["ok", "Accionaste ".concat(w.name, (w.v === "d" || w.v === "t") ? " (tecla " + ((it.k || 0) + 1) + ")" : "", ", que controla esta luz.")]);
        } else if (it.t === "sw") {
          swPress(it, -1);
          msgs.push(["ok", "".concat(it.name, ": ").concat(swState(it))]);
        } else it.on = !it.on;
      } else {
        simShowHud(null);
        return;
      }
    } else if (simTool === "info" && ud.k === "item" && (s.items.find((i) => i.id === ud.id) || {}).t === "box") {
      simSheet = "box:" + ud.id;
      simSel = "i" + ud.id;
      simTermSel = null;
      renderSheet();
      simBuild();
      return;
    } else {
      const m = simMeasure(s, ud);
      if (m) {
        simShowHud(m);
        if (ud.k === "edge") simSel = "e" + ud.id;
        else if (ud.k === "item") simSel = "i" + ud.id;
        if (m.val !== "" && m.val !== "\u2014" && simTool !== "info") {
          s.log.unshift("".concat(m.name, ": ").concat(m.val, " ").concat(m.unit, " \u2014 ").concat(m.sub));
          s.log = s.log.slice(0, 10);
        }
      }
    }
    simTrips(s, msgs);
    save();
    simRefresh(msgs);
  }
