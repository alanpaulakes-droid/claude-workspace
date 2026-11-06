  const TPLS = [["casa", "\u{1F3E0}", "Vivienda completa", "70 m\xB2 \xB7 4 circuitos"], ["cocina", "\u{1F373}", "Remodelaci\xF3n cocina y logia", "Circuito exclusivo + horno"], ["clima", "\u2744", "Climatizaci\xF3n", "2 aires acondicionados"], ["vacia", "\u25A2", "Casa vac\xEDa", "Parte desde cero"], ["mia", "\u270F", "Mi vivienda", "La que dise\xF1aste, vac\xEDa"]];
  function simTemplate(k) {
    if (k === "casa") return sim2Example();
    const s = sim2Blank();
    if (k === "vacia") return s;
    if (k === "mia") return Object.assign(s, { house: casaToHouse(S.casa || casaDef()) });
    const C = (n, In, cv, Sx, dr) => {
      const c = { id: s.nid++, n, In, cv, pc: 6, S: Sx, dr, ds: 30, cl: "A", nc: "dr", pe: true, on: true };
      s.circuits.push(c);
      return c.id;
    };
    const A = (t, c, x, y, z, n, o) => simAddItem(s, t, c, [x, y, z], n, o);
    const L = (c, x, z, o) => simAddItem(s, "lamp", c, [x, 2.42, z], null, o);
    if (k === "cocina") {
      s.scope = ["coc", "lav"];
      const c1 = C("Alumbrado cocina y logia", 10, "B", 1.5, "DR1"), c2 = C("Cocina y lavadero", 16, "C", 2.5, "DR1"), c3 = C("Horno", 16, "C", 2.5, "DR2");
      const b1 = A("box", c1, 6.4, 2.3, 2.94, [0, 0, -1], { par: null });
      const s1 = A("sw", c1, 5.06, 1.1, 2.7, [1, 0, 0], { par: b1 });
      L(c1, 6.5, 1.5, { par: b1, sw: s1, P: 100 });
      const s2 = A("sw", c1, 8.06, 1.1, 2.8, [1, 0, 0], { par: b1 });
      L(c1, 9, 1.5, { par: b1, sw: s2 });
      const b2 = A("box", c2, 7.2, 2.3, 2.94, [0, 0, -1], { par: null });
      A("out", c2, 5.6, 1.1, 0.06, [0, 0, 1], { par: b2, a: "hervidor" });
      A("out", c2, 6.6, 1.1, 0.06, [0, 0, 1], { par: b2, a: "micro" });
      A("out", c2, 7.5, 1.1, 0.06, [0, 0, 1], { par: b2 });
      A("out", c2, 9, 1.1, 0.06, [0, 0, 1], { par: b2, a: "lav" });
      A("horno", c3, 7.94, 0.3, 1, [-1, 0, 0], { par: null, P: 2e3 });
      return s;
    }
    if (k === "clima") {
      s.scope = ["liv", "d1", "d2"];
      const c1 = C("Alumbrado", 10, "B", 1.5, "DR1"), c2 = C("Enchufes", 16, "C", 2.5, "DR1"), c3 = C("Clima living", 16, "C", 2.5, "DR2"), c4 = C("Clima dormitorio", 16, "C", 2.5, "DR2");
      const b1 = A("box", c1, 2.5, 2.3, 3.94, [0, 0, -1], { par: null });
      const s1 = A("sw", c1, 4.3, 1.1, 0.06, [0, 0, 1], { par: b1 });
      L(c1, 1.5, 2, { par: b1, sw: s1, P: 100 });
      L(c1, 3.5, 2, { par: b1, sw: s1, P: 100 });
      const s2 = A("sw", c1, 3.5, 1.1, 4.06, [0, 0, 1], { par: b1 });
      L(c1, 1.5, 5.5, { par: b1, sw: s2 });
      L(c1, 3.5, 5.5, { par: b1, sw: s2 });
      const b2 = A("box", c1, 5.6, 2.3, 4.56, [0, 0, 1], { par: b1 });
      const s3 = A("sw", c1, 7.3, 1.1, 4.56, [0, 0, 1], { par: b2 });
      L(c1, 6.4, 5.8, { par: b2, sw: s3 });
      L(c1, 8.7, 5.8, { par: b2, sw: s3 });
      const b3 = A("box", c2, 1.2, 2.3, 3.94, [0, 0, -1], { par: null });
      A("out", c2, 0.06, 0.3, 2, [1, 0, 0], { par: b3, a: "tv" });
      A("out", c2, 4.94, 0.3, 0.8, [-1, 0, 0], { par: b3, a: "pc" });
      A("out", c2, 3.2, 0.3, 3.94, [0, 0, -1], { par: b3 });
      A("out", c2, 0.06, 0.3, 5.5, [1, 0, 0], { par: b3 });
      A("out", c2, 3, 0.3, 6.94, [0, 0, -1], { par: b3 });
      const b4 = A("box", c2, 8.5, 2.3, 4.56, [0, 0, 1], { par: b3 });
      A("out", c2, 6.5, 0.3, 6.94, [0, 0, -1], { par: b4 });
      A("out", c2, 9.94, 0.3, 6, [-1, 0, 0], { par: b4 });
      A("out", c3, 0.06, 2, 1, [1, 0, 0], { par: null, a: "clima" });
      A("out", c4, 0.06, 2, 6.2, [1, 0, 0], { par: null, a: "clima" });
      return s;
    }
    return s;
  }
  function simReport(s) {
    const ev = simEval(s), errs = simInspect(s).filter((o) => !o.fault), dva = ev.dVap / V0 * 100;
    const rows = s.circuits.map((c, k) => {
      const its = s.items.filter((i) => i.c === c.id), x = ev.cs[k], P = x.Ip * V0, cnt = (t) => its.filter((i) => i.t === t).length, ce = errs.filter((o) => o.cid === c.id).length, L = ev.E.filter((e) => e.cid === c.id).reduce((a, e) => a + e.L, 0);
      return { n: "C".concat(k + 1), ph: s.sys === "tri" ? c.ph || "R" : "", nom: c.n || "", luces: cnt("lamp"), enchufes: cnt("out") + cnt("horno"), P, Is: P / V0, In: +c.In, cv: c.cv, pc: +c.pc, S: +c.S, Iz: ampOf(c.S), dr: c.dr === "none" ? "\u2014" : "".concat(c.dr, " ").concat(c.ds, " mA ").concat(c.cl), L, dv: x.dvp + dva, err: ce };
    });
    const Pi = rows.reduce((a, r) => a + r.P, 0);
    return { ev, errs, rows, Pi, Pd: ev.fd.Pd, Id: ev.Idm, dva };
  }
  function repIccHTML(s) {
    const r = simReport(s), ev = r.ev, I = simIcc(s, ev), Pd = r.Pd, Id = r.Id, tri = s.sys === "tri", ok = (b) => b ? '<span class="pill ok">✓</span>' : '<span class="pill bad">✗</span>';
    const rows = s.circuits.map((c, k) => {
      const x = I.c[c.id], Im = (KMAG[c.cv] || 10) * +c.In, ft = fTemp(s.ta || 30), Izc = ampOf(c.S) * ft;
      return "<tr><td><b>C" + (k + 1) + "</b> " + esc(c.n || "") + "</td><td>" + c.In + " A " + c.cv + " \xB7 " + nf(+c.pc, 1) + ' kA</td><td class="num">' + (x ? n0(x.Imin) : "—") + '</td><td class="num">' + n0(Im) + "</td><td>" + (x ? esc(x.far) : "—") + "</td><td>" + ok(!x || x.Imin >= Im) + " " + ok(I.Imax <= (+c.pc || 6) * 1e3) + '</td><td class="num">' + n0(Izc) + " A</td><td>" + ok(Izc >= +c.In) + "</td></tr>";
    }).join("");
    const big = Pd > 1e4 || tri, Igs = nextCom(Math.max(25, Id * 1.15)) || 63;
    return '<section class="card rep-s"><h2>Cortocircuito, temperatura y empalme</h2><p class="hint" style="margin-top:0">Icc presunta en el empalme ' + nf(+s.icc0 || 3, 1) + " kA \xB7 temperatura del entretecho " + (s.ta || 30) + " \xB0C (c\xE1mbialas en el Simulador, panel Tablero y circuitos).</p>" + kpis([kpi("Icc m\xE1x. en tablero", nf(I.Imax / 1e3, 2), "kA", I.Imax <= 6e3 ? "ok" : "bad"), kpi("Impedancia de red", nf(I.Zs * 1e3, 1), "mΩ"), kpi("Factor de temperatura", nf(fTemp(s.ta || 30), 2)), kpi("Empalme sugerido", big ? "Trif\xE1sico" : "Monof\xE1sico", Igs + " A")]) + '<div class="tbl-wrap"><table class="pt"><thead><tr><th>Circuito</th><th>Protecci\xF3n</th><th class="num">Icc m\xEDn. (A)</th><th class="num">Disparo magn. (A)</th><th>Punto m\xE1s lejano</th><th>Magn. \xB7 PdC</th><th class="num">Iz corregida</th><th>Iz ≥ In</th></tr></thead><tbody>' + (rows || '<tr><td colspan="8">Sin circuitos.</td></tr>') + '</tbody></table></div><p class="hint">Icc m\xEDn. con el cable caliente (\xD7 1,5) y tensi\xF3n al 95 %: debe superar 5 \xD7 In (curva B) o 10 \xD7 In (curva C) para que la falla se corte en forma instant\xE1nea. Selectividad: el general de ' + s.gen.In + " A s\xF3lo no act\xFAa ante fallas bajo " + n0(5 * s.gen.In) + " A; cerca del tablero puede saltar junto con el circuito (selectividad parcial). Empalme: demanda " + n0(Pd) + " W (" + nf(Id, 1) + " A). " + (big ? "Con m\xE1s de ≈ 10 kW de demanda o equipos trif\xE1sicos conviene empalme trif\xE1sico." : "Un empalme monof\xE1sico es suficiente para esta demanda.") + " La capacidad final la asigna la distribuidora.</p></section>";
  }
  function repCompraHTML(B) {
    const rows = [];
    B.filter((b) => b.q > 0).forEach((b) => {
      if (/^cab:/.test(b.k || "") && b.u === "m") {
        const R = Math.floor(b.q / 100), m = b.q - R * 100;
        rows.push([b.d, (R ? R + " rollo(s) de 100 m" : "") + (R && m ? " + " : "") + (m ? m + " m a granel" + (m >= 60 ? " (o un rollo m\xE1s: suele salir m\xE1s barato)" : "") : ""), b.q + " m"]);
      } else if (/^tub:/.test(b.k || "") && b.u === "m") rows.push([b.d, Math.ceil(b.q / 3) + " tira(s) de 3 m", b.q + " m"]);
      else rows.push([b.d, b.q + " " + (b.u === "u" ? "unidad(es)" : b.u), ""]);
    });
    return '<h3 style="margin-top:14px">Lista de compra por presentaci\xF3n</h3><div class="tbl-wrap"><table class="pt"><thead><tr><th>Material</th><th>Comprar</th><th class="num">Necesario</th></tr></thead><tbody>' + rows.map((r) => "<tr><td>" + esc(r[0]) + "</td><td><b>" + r[1] + '</b></td><td class="num">' + r[2] + "</td></tr>").join("") + '</tbody></table></div><p class="hint">Cable en rollos de 100 m y tubo en tiras de 3 m. Si un color sobra mucho, comb\xEDnalo con otro circuito antes de comprar otro rollo.</p><div class="chips no-print" style="margin-top:8px"><button type="button" class="chip" data-pcsv="out">⬇ Exportar precios (CSV)</button><label class="chip" style="cursor:pointer">⬆ Importar precios (CSV)<input type="file" accept=".csv,text/csv" data-pcsv="in" hidden></label><span class="hint" id="pcsvmsg"></span></div>';
  }
  const ENS_DR = (i) => (S.ens.dr && S.ens.dr[i]) || {};
  function ensExtraHTML() {
    const nDR = Math.max(1, Math.ceil(S.circuits.length / 3));
    if (!S.ens.dr) S.ens.dr = [];
    if (!S.ens.cont) S.ens.cont = [];
    if (!S.ens.zs) S.ens.zs = [];
    const dr = Array.from({ length: nDR }, (_, i) => "<tr><td>DR" + (i + 1) + "</td><td>" + cNum("ens.dr." + i + ".ma", 70, "mA de disparo") + "</td><td>" + cNum("ens.dr." + i + ".ms", 70, "ms a IΔn") + "</td><td>" + cNum("ens.dr." + i + ".ms5", 70, "ms a 5 IΔn") + "</td></tr>").join("");
    const cc = S.circuits.map((c, i) => "<tr><td>C" + (i + 1) + " " + esc(c.nombre || "") + "</td><td>" + cNum("ens.cont." + i, 70, "Ω continuidad") + "</td><td>" + cNum("ens.zs." + i, 70, "Ω lazo") + "</td></tr>").join("");
    return '<h3 style="margin-top:16px">Prueba de diferenciales (instrumento)</h3><div class="tbl-wrap"><table><thead><tr><th>Diferencial</th><th>Corriente de disparo [mA]</th><th>Tiempo a IΔn [ms]</th><th>Tiempo a 5 \xD7 IΔn [ms]</th></tr></thead><tbody>' + dr + '</tbody></table></div><h3 style="margin-top:16px">Continuidad del PE e impedancia de lazo</h3>' + (cc ? '<div class="tbl-wrap"><table><thead><tr><th>Circuito</th><th>Continuidad PE [Ω]</th><th>Impedancia de lazo Zs [Ω]</th></tr></thead><tbody>' + cc + "</tbody></table></div>" : '<div class="empty">No hay circuitos.</div>') + '<label class="check" style="margin-top:10px"><input type="checkbox" data-path="ens.pol" data-bool="1" ' + (S.ens.pol ? "checked" : "") + '><span><b>Polaridad verificada</b><br><span class="hint">Fase en el borne correcto de cada enchufe; interruptores cortan la fase, no el neutro.</span></span></label>';
  }
  function ensEval() {
    const out = [], a = calcAlim(S);
    (S.ens.dr || []).forEach((d, i) => {
      if (!d) return;
      const ma = parseNum(d.ma), ms = parseNum(d.ms), ms5 = parseNum(d.ms5);
      if (ma > 0) out.push({ t: "DR" + (i + 1) + ": corriente de disparo", f: "0,5 \xD7 IΔn < I disparo ≤ IΔn (15 a 30 mA)", s: nf(ma, 1) + " mA", ok: ma > 15 && ma <= 30 });
      if (ms > 0) out.push({ t: "DR" + (i + 1) + ": tiempo a IΔn", f: "t ≤ 300 ms", s: n0(ms) + " ms", ok: ms <= 300 });
      if (ms5 > 0) out.push({ t: "DR" + (i + 1) + ": tiempo a 5 \xD7 IΔn", f: "t ≤ 40 ms", s: n0(ms5) + " ms", ok: ms5 <= 40 });
    });
    S.circuits.forEach((c, i) => {
      const r = calcCirc(S, c, a), In = r.In || 16, Im = (KMAG[r.curva] || 10) * In, zs = parseNum((S.ens.zs || [])[i]), ct = parseNum((S.ens.cont || [])[i]);
      if (ct > 0) out.push({ t: "C" + (i + 1) + ": continuidad del PE", f: "Valor bajo y estable (referencia ≤ 1 Ω)", s: nf(ct, 2) + " Ω", ok: ct <= 1 ? true : "warn" });
      if (zs > 0) out.push({ t: "C" + (i + 1) + ": impedancia de lazo", f: "Zs \xD7 Im ≤ U0 → Zs ≤ 220 \xF7 (" + (KMAG[r.curva] || 10) + " \xD7 " + In + ")", s: nf(zs, 2) + " Ω \xB7 m\xE1x. " + nf(220 / Im, 2) + " Ω", ok: zs <= 220 / Im, why: "si Zs es alta, un cortocircuito no hace actuar el magn\xE9tico del autom\xE1tico." });
    });
    if (S.ens.pol != null) out.push({ t: "Polaridad", f: "Fase, neutro y tierra en sus bornes", s: S.ens.pol ? "Verificada" : "Pendiente", ok: !!S.ens.pol });
    return out;
  }
  function protocoloDoc() {
    const inf = infGet(), nm = S.proj && S.proj.nombre || "Vivienda", hoy = (/* @__PURE__ */ new Date()).toLocaleDateString("es-CL"), ev = ensEval(), a = calcAlim(S);
    const row = (c) => "<tr>" + c.map((x) => "<td>" + x + "</td>").join("") + "</tr>";
    const ai = S.circuits.map((c, i) => {
      const v = parseNum((S.ens.aisl || [])[i]);
      return row(["C" + (i + 1) + " " + esc(c.nombre || ""), v > 0 ? nf(v, 2) : "", "≥ 0,5", v > 0 ? v >= 0.5 ? "Cumple" : "No cumple" : ""]);
    }).join("");
    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Protocolo de ensayos \xB7 ' + esc(nm) + "</title><style>" + INF_CSS + '</style></head><body><h1>Protocolo de inspecci\xF3n y ensayos</h1><p>' + [esc(nm), esc((inf.dir || "") + (inf.comuna ? ", " + inf.comuna : "")), hoy].filter(Boolean).join(" \xB7 ") + "</p><h2>1. Datos generales</h2><table class=\"kv\"><tr><th>Propietario</th><td>" + esc(inf.prop || "") + "</td></tr><tr><th>Instalador</th><td>" + esc(inf.inst || "") + (inf.lic ? " \xB7 licencia SEC " + esc(inf.lic) : "") + "</td></tr><tr><th>Sistema</th><td>" + (S.proj.sistema === "tri" ? "Trif\xE1sico 380/220 V" : "Monof\xE1sico 220 V") + " \xB7 general " + a.In + " A \xB7 " + S.circuits.length + " circuitos</td></tr><tr><th>Instrumentos</th><td>Megger 500 V CC \xB7 telur\xF3metro \xB7 probador de diferenciales \xB7 medidor de lazo (indicar marca, modelo y fecha de calibraci\xF3n)</td></tr></table><h2>2. Inspecci\xF3n visual</h2><table><thead><tr><th>Verificaci\xF3n</th><th>Resultado</th></tr></thead><tbody>" + ENS.map(([k, t]) => row([t, S.ens.items[k] ? "Conforme" : "Pendiente"])).join("") + "</tbody></table><h2>3. Resistencia de aislamiento (500 V CC)</h2><table><thead><tr><th>Circuito</th><th>Medido [MΩ]</th><th>M\xEDnimo [MΩ]</th><th>Resultado</th></tr></thead><tbody>" + ai + "</tbody></table><h2>4. Puesta a tierra</h2><table><tbody>" + row(["Tierra de servicio", +S.tierra.Rserv > 0 ? nf(+S.tierra.Rserv, 1) + " Ω" : "", "≤ 20 Ω"]) + row(["Tierra de protecci\xF3n", +S.tierra.Rprot > 0 ? nf(+S.tierra.Rprot, 1) + " Ω" : "", "≤ UL \xF7 IΔn"]) + "</tbody></table><h2>5. Diferenciales, continuidad, lazo y polaridad</h2><table><thead><tr><th>Ensayo</th><th>Criterio</th><th>Medido</th><th>Resultado</th></tr></thead><tbody>" + (ev.map((x) => row([x.t, x.f, x.s, x.ok === true ? "Cumple" : x.ok === "warn" ? "Revisar" : "No cumple"])).join("") || row(["Sin mediciones registradas", "", "", ""])) + '</tbody></table><h2>6. Conclusi\xF3n</h2><p>La instalaci\xF3n ' + (ev.length && ev.every((x) => x.ok === true) && ENS.every(([k]) => S.ens.items[k]) && S.circuits.length && S.circuits.every((c, i) => parseNum((S.ens.aisl || [])[i]) >= 0.5) ? "cumple" : "debe completar o corregir") + ' los ensayos de verificaci\xF3n inicial (RIC N\xB019) antes de su puesta en servicio.</p><div class="firm"><div>Instalador autorizado SEC</div><div>Propietario o mandante</div></div></body></html>';
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest('[data-pcsv="out"]');
    if (!b) return;
    const names = {};
    try {
      if (S.sim2) simBOM(S.sim2).forEach((r) => names[r.k] = names[r.k] || r.d);
    } catch (err) {
    }
    const lines = ["clave;descripcion;precio_clp"].concat(Object.keys(PREC0).map((k) => k + ";" + String(names[k] || k).replace(/;/g, ",") + ";" + precio(k)));
    dlFile("precios-materiales.csv", new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv" })).then((rr) => {
      const m = document.getElementById("pcsvmsg");
      if (m) m.textContent = dlMsg(rr, "Precios exportados. Ed\xEDtalos en Excel y vuelve a importarlos.");
    });
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (!el || !el.matches || !el.matches('[data-pcsv="in"]') || !el.files || !el.files[0]) return;
    const rd2 = new FileReader();
    rd2.onload = () => {
      let n = 0;
      String(rd2.result || "").split(/\r?\n/).forEach((ln) => {
        const p = ln.split(/[;\t]/);
        if (p.length < 2) return;
        const k = p[0].trim().replace(/^\uFEFF/, ""), v = parseNum(p[p.length - 1]);
        if (PREC0[k] != null && v > 0) {
          if (!S.precios) S.precios = {};
          S.precios[k] = v;
          n++;
        }
      });
      save();
      render(true);
      const m = document.getElementById("pcsvmsg");
      if (m) m.textContent = n + " precio(s) importado(s).";
    };
    rd2.readAsText(el.files[0]);
  });
  function simBOM(s) {
    const ev = simEval(s), cond = {}, tubo = {}, cK = {}, tK = {}, add = (o, k, v) => o[k] = (o[k] || 0) + v, COLN = { F: "rojo (fase)", N: "blanco (neutro)", PE: "verde/amarillo (tierra)", R: "rojo oscuro (retorno)", R2: "naranjo (retorno 2)", C: "rojo (com\xFAn 9/24)", V1: "negro (viajero)", V2: "caf\xE9 (viajero)" };
    let curvas = 0;
    ev.E.forEach((e) => {
      const c = s.circuits[e.ci];
      if (!c) return;
      e.cond.forEach((q) => {
        const k = "".concat(sStr(e.S), " mm\xB2 \xB7 ").concat(COLN[q]);
        add(cond, k, e.L);
        cK[k] = "cab:" + e.S;
      });
      const d = e.S >= 4 || e.cond.length > 3 ? 20 : 16, tk = "Tubo ".concat({ pvc: "PVC conduit", emt: "met\xE1lico EMT", flex: "flexible corrugado" }[s.duct || "pvc"], " ").concat(d, " mm").concat(s.inst === "vista" ? " (a la vista)" : " (embutido)");
      add(tubo, tk, e.L);
      tK[tk] = "tub:" + (s.duct || "pvc") + d;
      curvas += edgeChecks(s, e).curv;
    });
    const La = +s.alim.L || 0;
    if (s.sys === "tri") {
      add(cond, "".concat(sStr(+s.alim.S), " mm\xB2 \xB7 azul (fase R) \xB7 alimentador"), La);
      add(cond, "".concat(sStr(+s.alim.S), " mm\xB2 \xB7 negro (fase S) \xB7 alimentador"), La);
    }
    add(cond, "".concat(sStr(+s.alim.S), " mm\xB2 \xB7 rojo (fase").concat(s.sys === "tri" ? " T" : "", ") \xB7 alimentador"), La);
    add(cond, "".concat(sStr(+s.alim.S), " mm\xB2 \xB7 blanco (neutro) \xB7 alimentador"), La);
    const it = (t) => s.items.filter((i) => i.t === t).length, drs = simDRs(s), mods = (s.sys === "tri" ? 4 : 2) + drs.length * 2 + s.circuits.length + (s.circuits.length >= 4 ? 3 : 0), modT = [8, 12, 18, 24, 36, 48].find((m) => m >= Math.ceil(mods * 1.25)) || 48;
    let regl = 0;
    s.items.filter((i) => i.t === "box").forEach((b) => {
      regl += boxExpected(s, b).length;
    });
    const R = [];
    const P = (g, d, q, u, k) => R.push({ g, d, q, u, k });
    Object.entries(cond).sort().forEach(([k, v]) => P("Conductores", "Cable ".concat(k), Math.ceil(v * 1.1), "m", cK[k] || "cab:" + +s.alim.S));
    Object.entries(tubo).forEach(([k, v]) => P("Canalizaci\xF3n", k, Math.ceil(v * 1.1), "m", tK[k]));
    P("Canalizaci\xF3n", "Codos (curvas) 90\xB0", curvas, "u", "curva");
    P("Canalizaci\xF3n", "Coplas de uni\xF3n (tiras de 3 m)", ev.E.reduce((a, e) => a + Math.max(0, Math.ceil(e.L / 3) - 1), 0), "u", "copla");
    P("Canalizaci\xF3n", "Terminales o conectores de tubo a caja", ev.E.length * 2, "u", "term");
    if (s.inst === "vista") P("Canalizaci\xF3n", "Abrazaderas de fijaci\xF3n (\u2248 1 cada metro)", Math.ceil(Object.values(tubo).reduce((a, v) => a + v, 0)), "u", "abraz");
    P("Cajas", "Cajas de derivaci\xF3n", it("box"), "u", "cdev");
    P("Cajas", "Cajas de embutir (interruptores y enchufes)", it("sw") + it("out") + it("horno"), "u", "cemb");
    P("Cajas", "Cajas de centro (luces)", it("lamp"), "u", "ccen");
    ["sw", "out"].forEach((t) => VAR[t].forEach(([v, , nm, k]) => P("Aparatos", nm, s.items.filter((i) => i.t === t && (i.v || "s") === v).length, "u", k)));
    P("Aparatos", "Salida de fuerza para horno", it("horno"), "u", "horno");
    VAR.lamp.forEach(([v, , nm, k]) => P("Luminarias", nm, s.items.filter((i) => i.t === "lamp" && (i.v || "s") === v).length, "u", k));
    P("Empalmes", "Conectores para empalmes (uno por regleta)", regl, "u", "conec");
    P("Tablero", "Interruptor general ".concat(s.sys === "tri" ? "4P" : "2P", " ").concat(s.gen.In, " A curva C 6 kA"), 1, "u", s.sys === "tri" ? "ig4" : "ig2");
    drs.forEach((d) => {
      const cc = s.circuits.filter((c) => c.dr === d);
      P("Tablero", "Diferencial 2P ".concat(drIn(s), " A ").concat(Math.max(...cc.map((c) => +c.ds)), " mA clase ").concat(cc[0].cl), 1, "u", PREC0["dr:" + cc[0].cl] ? "dr:" + cc[0].cl : "dr:A");
    });
    const tm = {};
    s.circuits.forEach((c) => add(tm, "Autom\xE1tico 1P+N ".concat(c.In, " A curva ").concat(c.cv, " ").concat(c.pc, " kA"), 1));
    Object.entries(tm).forEach(([k, v]) => P("Tablero", k, v, "u", "tm"));
    P("Tablero", "Tablero embutido de ".concat(modT, " m\xF3dulos DIN (usa ").concat(mods, ", +25 % reserva)"), 1, "u", "tab" + modT);
    regOf(s).forEach((r) => P("Tablero", REG_T[r.t][0] + " " + r.n + (r.t === "peine" ? " m\xF3dulos" : " bornes"), 1, "u", "reg" + r.t));
    P("Puesta a tierra", 'Barra Copperweld 5/8" \xD7 1,5 m, conector y c\xE1mara de registro', 1, "u", "copper");
    P("Puesta a tierra", "Conductor de tierra al electrodo (secci\xF3n seg\xFAn RIC N\xB006)", 5, "m", "tierra");
    P("Mano de obra", "Instalaci\xF3n por punto (referencial)", it("lamp") + it("sw") + it("out") + it("horno"), "u", "mo");
    return R;
  }
  function repHTML() {
    const s = S.sim2;
    if (!s || !s.circuits.length) return '<h1>Reportes</h1><div class="empty">A\xFAn no hay instalaci\xF3n en el simulador. Elige una plantilla para empezar.</div>'.concat(tplButtons());
    const r = simReport(s), B = simBOM(s), ok = !r.errs.length;
    const cq = '<div class="tbl-wrap"><table class="pt rep"><thead><tr><th>Circ.</th>'.concat(s.sys === "tri" ? "<th>Fase</th>" : "", "<th>Nombre</th><th>Luces</th><th>Enchufes</th><th>P proy. (W)</th><th>Is (A)</th><th>Autom\xE1tico</th><th>Diferencial</th><th>Cable</th><th>Iz (A)</th><th>Largo (m)</th><th>\u0394V total</th><th></th></tr></thead><tbody>").concat(r.rows.map((x) => "<tr><td><b>".concat(x.n, "</b></td>").concat(s.sys === "tri" ? "<td>".concat(x.ph, "</td>") : "", "<td>").concat(esc(x.nom), '</td><td class="num">').concat(x.luces, '</td><td class="num">').concat(x.enchufes, '</td><td class="num">').concat(n0(x.P), '</td><td class="num">').concat(nf(x.Is, 2), "</td><td>").concat(x.In, " A \xB7 ").concat(x.cv, " \xB7 ").concat(x.pc, " kA</td><td>").concat(x.dr, "</td><td>").concat(sStr(x.S), ' mm\xB2</td><td class="num">').concat(x.Iz, '</td><td class="num">').concat(n1(x.L), '</td><td class="num ').concat(x.dv > 5 ? "bad" : "", '">').concat(nf(x.dv, 2), " %</td><td>").concat(x.err ? '<span class="pill bad">\u2717 '.concat(x.err, "</span>") : '<span class="pill ok">\u2713</span>', "</td></tr>")).join(""), '\n   <tr class="tot"><td colspan="').concat(s.sys === "tri" ? 5 : 4, '"><b>Total instalado</b></td><td class="num"><b>').concat(n0(r.Pi), '</b></td><td class="num">').concat(nf(r.Pi / V0, 2), '</td><td colspan="7">Demanda ').concat(n0(r.Pd), " W (").concat(nf(r.Id, 1), " A) \xB7 General ").concat(s.gen.In, " A \xB7 Alimentador ").concat(sStr(+s.alim.S), " mm\xB2, ").concat(n1(+s.alim.L), " m, \u0394V ").concat(nf(r.dva, 2), " %</td></tr></tbody></table></div>");
    return '<p class="eyebrow no-print">Reportes y entregables</p><h1>'.concat(esc(S.proj && S.proj.nombre || "Instalaci\xF3n del simulador"), '</h1>\n  <div class="rep-act no-print"><button class="btn" type="button" data-act="rpdf">\u{1F5A8} PDF / Imprimir</button><button class="btn" type="button" data-act="rxls">\u2B07 Excel</button><button class="btn ghost" type="button" data-act="rcopy">\u29C9 Copiar cuadro</button><button class="btn ghost" type="button" data-act="rjson">\u{1F4BE} Guardar proyecto</button><label class="btn ghost" style="cursor:pointer">\u{1F4C2} Abrir proyecto<input type="file" accept=".json,application/json" id="rjsonin" hidden></label><span class="hint" id="rmsg"></span></div>\n  ').concat(kpis([kpi("Circuitos", s.circuits.length), kpi("P instalada", n0(r.Pi), "W"), kpi("Demanda", n0(r.Pd), "W"), kpi("General", s.gen.In, "A", r.Id > s.gen.In ? "bad" : "ok"), kpi("\u0394V m\xE1x.", nf(Math.max(0, ...r.rows.map((x) => x.dv)), 2), "%", Math.max(0, ...r.rows.map((x) => x.dv)) > 5 ? "bad" : "ok"), kpi("Observaciones", r.errs.length, "", ok ? "ok" : "bad")]), '\n  <section class="card rep-s"><h2>1 \xB7 Cuadro de carga</h2>').concat(cq, '<p class="hint">Proyecci\xF3n: 100 W por centro de luz, 250 W por enchufe; equipos de 1.500 W o m\xE1s con su potencia. Demanda seg\xFAn RIC N\xB003, Tabla 3.1.</p></section>\n  ').concat(s.sys === "tri" ? '<section class="card rep-s"><h2>Balance de fases</h2><div class="phb">'.concat(["R", "S", "T"].map((f) => {
      const mx = Math.max(1, r.ev.Pph.R, r.ev.Pph.S, r.ev.Pph.T);
      return "<div><b>".concat(f, '</b><span style="width:').concat(r.ev.Pph[f] / mx * 100, "%;background:").concat({ R: "#1F5FBF", S: "#333", T: "#C0392B" }[f], '"></span><em>').concat(n0(r.ev.Pph[f]), " W \xB7 ").concat(nf(r.ev.Pph[f] / V0, 1), " A</em></div>");
    }).join(""), "</div></section>") : "", '\n  <section class="card rep-s"><h2>2 \xB7 Diagrama unilineal del tablero</h2>').concat(simConnSVG(s), '</section>' + repIccHTML(s) + '\n  <section class="card rep-s"><div class="sechead"><h2 style="margin:0">3 \xB7 Plano de planta</h2><button class="btn ghost small no-print" type="button" data-act="rsvg">\u2B07 Plano (.svg)</button></div><div class="plan">').concat(planSVG(s), '</div><p class="hint">L\xEDnea punteada: recorrido autom\xE1tico por el entretecho. L\xEDnea continua: tubo que trazaste con la herramienta Trazar.</p></section>\n  <section class="card rep-s"><div class="sechead"><h2 style="margin:0">4 \xB7 Materiales y costos</h2><button class="btn ghost small no-print" type="button" data-cs="prst">\u21BA Restaurar precios</button></div>').concat(bomTable(B, true), '<p class="hint">Metros con 10 % de holgura, medidos sobre los recorridos del simulador. Precios unitarios referenciales en pesos chilenos, netos: c\xE1mbialos por los de tu proveedor y el total se recalcula (se guardan con el proyecto).</p>' + repCompraHTML(B) + '</section>\n  <section class="card rep-s"><div class="sechead"><h2 style="margin:0">5 \xB7 Memoria explicativa</h2><button class="btn ghost small no-print" type="button" data-act="rmem">\u2B07 Memoria (.html, abre en Word)</button></div><details class="memd" open><summary class="no-print">Ver / ocultar</summary><div class="memo">').concat(memoriaHTML(s, false), '</div></details></section>\n  ' + infSection(s) + '<section class="card rep-s"><h2>9 \xB7 Observaciones del inspector</h2>').concat(ok ? note("\u2713 La instalaci\xF3n cumple todo lo que revisa la app.", "ok") : '<ol class="obs">'.concat(r.errs.map((o) => "<li><b>".concat(esc(o.t), "</b> \u2014 ").concat(esc(o.d), ' <span class="hint">').concat(esc(o.w), "</span></li>")).join(""), "</ol>"), '</section>\n  <p class="hint no-print">Los datos salen del <button class="linkb" type="button" data-go="sim">Simulador 3D</button>. Cambia la instalaci\xF3n all\xED y este reporte se actualiza solo.</p><div class="no-print">').concat(testsHTML(), "</div>");
  }
  const CCOL = ["#1f77b4", "#d62728", "#2ca02c", "#9467bd", "#ff7f0e", "#8c564b", "#e377c2", "#17becf"];
  function edgeFl(e) {
    const fb = flY(e.it.p[1]), k = e.pts.findIndex((p, i) => i && Math.abs(p[0] - e.pts[i - 1][0]) < 1e-6 && Math.abs(p[2] - e.pts[i - 1][2]) < 1e-6 && Math.abs(p[1] - e.pts[i - 1][1]) > FH - 0.3);
    return k < 0 ? [[fb, e.pts, null]] : [[1 - fb, e.pts.slice(0, k), e.pts[k]], [fb, e.pts.slice(k), e.pts[k]]];
  }
  function planSVG(s, opt) {
    opt = opt || {};
    if (NFL < 2 || opt.fl != null) return planSVG1(s, opt);
    const A = [0, 1].map((f) => planSVG1(s, Object.assign({}, opt, { fl: f }))), vb = A.map((x) => x.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number)), W = Math.max(vb[0][0], vb[1][0]), H = vb[0][1] + vb[1][1] + 60;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" font-family="Arial,Helvetica,sans-serif" role="img" aria-label="Plano de planta, 2 pisos"><rect width="' + W + '" height="' + H + '" fill="#fff"/>' + [0, 1].map((f) => '<text x="40" y="' + (f ? vb[0][1] + 52 : 22) + '" font-size="15" font-weight="800">' + (f ? "PLANTA SEGUNDO PISO" : "PLANTA PRIMER PISO") + '</text><svg x="0" y="' + (f ? vb[0][1] + 60 : 30) + '" width="' + vb[f][0] + '" height="' + vb[f][1] + '" viewBox="0 0 ' + vb[f][0] + " " + vb[f][1] + '">' + A[f].replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") + "</svg>").join("") + "</svg>";
  }
  function planSVG1(s, opt) {
    opt = opt || {};
    const PF = opt.fl == null ? -1 : opt.fl, onF = (f) => PF < 0 || f === PF;
    const VU = ["lamp", "sw", "out"].flatMap((t) => VAR[t].filter((x) => x[0] !== "s" && s.items.some((i) => i.t === t && i.v === x[0])).map((x) => [t, x])), K = Math.min(62, 620 / Math.max(HW, 1)), M = 40, W = HW * K + M * 2 + 170, H = Math.max(HD * K + M * 2, 474 + 18 * s.circuits.length + 24 * VU.length), X = (x) => M + x * K, Z = (z) => M + z * K, ev = simEval(s);
    let g = '<rect x="0" y="0" width="'.concat(W, '" height="').concat(H, '" fill="#fff"/>');
    ROOMS.forEach((r) => {
      if (!onF(r.f || 0)) return;
      g += '<rect x="'.concat(X(r.x0), '" y="').concat(Z(r.z0), '" width="').concat((r.x1 - r.x0) * K, '" height="').concat((r.z1 - r.z0) * K, '" fill="#f6f3ec"/><text x="').concat(X(r.x0) + 8, '" y="').concat(Z(r.z1) - 20, '" font-size="11" fill="#8a8170" font-weight="700">').concat(esc(r.n.toUpperCase()), '</text><text x="').concat(X(r.x0) + 8, '" y="').concat(Z(r.z1) - 8, '" font-size="10" fill="#a39a88">').concat(n1(rArea(r)), " m\xB2</text>");
    });
    ROOMS.filter((r) => r.t === "escalera" && onF(r.f || 0)).forEach((r) => {
      g += stairPlanSVG(r, X, Z, "#a39a88", 1, PF === 1).svg;
    });
    WALLS.forEach((wl) => {
      const [a, b, c, d, wt] = wl;
      if (!onF(wl.f || 0)) return;
      g += '<line x1="'.concat(X(a), '" y1="').concat(Z(b), '" x2="').concat(X(c), '" y2="').concat(Z(d), '" stroke="#222" stroke-width="').concat(Math.max(3, (wt || 0.12) * K * 0.9).toFixed(1), '" stroke-linecap="square"/>');
    });
    DOORS.forEach(([ax, v, m0, m1, df]) => {
      if (!onF(df || 0)) return;
      const r = (m1 - m0) * K;
      if (ax === "x") g += '<path d="M'.concat(X(v), " ").concat(Z(m0), " A ").concat(r, " ").concat(r, " 0 0 1 ").concat(X(v) + r, " ").concat(Z(m0) + r, '" fill="none" stroke="#999" stroke-width="1"/>');
      else g += '<path d="M'.concat(X(m0), " ").concat(Z(v), " A ").concat(r, " ").concat(r, " 0 0 0 ").concat(X(m0) + r, " ").concat(Z(v) + r, '" fill="none" stroke="#999" stroke-width="1"/>');
    });
    const MT = [];
    ev.E.forEach((e) => {
      const col = CCOL[e.ci % CCOL.length];
      (PF < 0 ? [[0, e.pts, null]] : edgeFl(e).filter((x) => x[0] === PF)).forEach(([, pts, mp]) => {
        const p = pts.map((q) => "".concat(X(q[0]).toFixed(1), ",").concat(Z(q[2]).toFixed(1))).join(" ");
        g += '<polyline points="'.concat(p, '" fill="none" stroke="').concat(col, '" stroke-width="2" stroke-dasharray="').concat(e.it.route ? "" : "6 3", '" opacity=".9"/>');
        if (mp) MT.push(mp);
      });
    });
    if (MT.length) {
      const mx = Math.min(...MT.map((q) => q[0])), xx = Math.max(...MT.map((q) => q[0])), mz = MT[0][2];
      g += '<rect x="' + (X(mx) - 6) + '" y="' + (Z(mz) - 6) + '" width="' + (X(xx) - X(mx) + 12) + '" height="12" fill="#fff" stroke="#333" stroke-width="1.5"/><path d="M' + (X(mx) - 6) + " " + (Z(mz) + 6) + "L" + (X(xx) + 6) + " " + (Z(mz) - 6) + '" stroke="#333" stroke-width="1"/><text x="' + (X(xx) + 10) + '" y="' + (Z(mz) + 16) + '" font-size="10" font-weight="700">MONTANTE ' + (PF ? "(BAJA AL 1.\xBA PISO)" : "(SUBE AL 2.\xBA PISO)") + "</text>";
    }
    const sym = (it) => {
      const x = X(it.p[0]), z = Z(it.p[2]), k = cIdx(s, it.c), col = CCOL[k % CCOL.length];
      if (it.t === "lamp" || it.t === "sw") return '<g transform="translate(' + x + " " + z + ')">' + varSym(it.t, it.v || "s", col) + "</g>";
      if (it.t === "lamp") return '<circle cx="'.concat(x, '" cy="').concat(z, '" r="8" fill="#fff" stroke="').concat(col, '" stroke-width="2"/><path d="M').concat(x - 5.6, " ").concat(z - 5.6, "L").concat(x + 5.6, " ").concat(z + 5.6, "M").concat(x + 5.6, " ").concat(z - 5.6, "L").concat(x - 5.6, " ").concat(z + 5.6, '" stroke="').concat(col, '" stroke-width="2"/>');
      if (it.t === "sw") return '<circle cx="'.concat(x, '" cy="').concat(z, '" r="4" fill="').concat(col, '"/><line x1="').concat(x, '" y1="').concat(z, '" x2="').concat(x + 8, '" y2="').concat(z - 9, '" stroke="').concat(col, '" stroke-width="2"/>');
      if (it.t === "box") return '<rect x="'.concat(x - 6, '" y="').concat(z - 6, '" width="12" height="12" fill="#fff" stroke="').concat(col, '" stroke-width="2"/><line x1="').concat(x - 6, '" y1="').concat(z - 6, '" x2="').concat(x + 6, '" y2="').concat(z + 6, '" stroke="').concat(col, '" stroke-width="1.5"/>');
      if (it.t === "horno") return '<rect x="'.concat(x - 9, '" y="').concat(z - 7, '" width="18" height="14" fill="#fff" stroke="').concat(col, '" stroke-width="2"/><text x="').concat(x, '" y="').concat(z + 4, '" text-anchor="middle" font-size="10" font-weight="700" fill="').concat(col, '">H</text>');
      if (it.a === "clima") return '<rect x="'.concat(x - 10, '" y="').concat(z - 6, '" width="20" height="12" fill="#fff" stroke="').concat(col, '" stroke-width="2"/><text x="').concat(x, '" y="').concat(z + 4, '" text-anchor="middle" font-size="8" font-weight="700" fill="').concat(col, '">AC</text>');
      const n = it.n || [0, 0, 1], ang = Math.atan2(n[2], n[0]) * 180 / Math.PI;
      if (it.v && it.v !== "s") return '<g transform="translate(' + x + " " + z + ") rotate(" + ang + ')">' + varSym("out", it.v, col) + "</g>";
      return '<g transform="translate('.concat(x, " ").concat(z, ") rotate(").concat(ang, ')"><path d="M0 -7 A7 7 0 0 1 0 7Z" fill="#fff" stroke="').concat(col, '" stroke-width="2"/><line x1="2" y1="-3" x2="6" y2="-3" stroke="').concat(col, '" stroke-width="1.5"/><line x1="2" y1="3" x2="6" y2="3" stroke="').concat(col, '" stroke-width="1.5"/></g>');
    };
    s.items.forEach((it) => {
      if (onF(flY(it.p[1]))) g += sym(it);
    });
    if (PF < 1) g += '<rect x="'.concat(X(TX) - tabW(s) * K / 2, '" y="').concat(Z(0) + 3, '" width="').concat(tabW(s) * K, '" height="9" fill="#333"/><text x="').concat(X(TX), '" y="').concat(Z(0) + 24, '" text-anchor="middle" font-size="10" font-weight="700">TABLERO</text>');
    const lx = HW * K + M * 2 + 10;
    let ly = M;
    g += '<text x="'.concat(lx, '" y="').concat(ly, '" font-size="12" font-weight="800">SIMBOLOG\xCDA</text>');
    const L = (svg, t) => {
      ly += 24;
      g += '<g transform="translate('.concat(lx + 10, " ").concat(ly - 4, ')">').concat(svg, '</g><text x="').concat(lx + 28, '" y="').concat(ly, '" font-size="10.5">').concat(t, "</text>");
    };
    L('<circle r="7" fill="#fff" stroke="#333" stroke-width="2"/><path d="M-5 -5L5 5M5 -5L-5 5" stroke="#333" stroke-width="2"/>', "Centro de luz");
    L('<circle r="4" fill="#333"/><line x1="0" y1="0" x2="8" y2="-9" stroke="#333" stroke-width="2"/>', "Interruptor 9/12");
    L('<path d="M0 -7 A7 7 0 0 1 0 7Z" fill="#fff" stroke="#333" stroke-width="2"/>', "Enchufe 2P+T");
    L('<rect x="-6" y="-6" width="12" height="12" fill="#fff" stroke="#333" stroke-width="2"/><line x1="-6" y1="-6" x2="6" y2="6" stroke="#333"/>', "Caja de derivaci\xF3n");
    L('<rect x="-9" y="-7" width="18" height="14" fill="#fff" stroke="#333" stroke-width="2"/>', "Horno / AC");
    L('<line x1="-8" y1="0" x2="12" y2="0" stroke="#333" stroke-width="2" stroke-dasharray="6 3"/>', "Tubo (auto)");
    L('<line x1="-8" y1="0" x2="12" y2="0" stroke="#333" stroke-width="2"/>', "Tubo trazado");
    VU.forEach(([t, x]) => L(varSym(t, x[0], "#333"), esc(t === "lamp" ? x[1] : t === "out" ? x[0] === "dat" ? "Toma datos/TV" : "Enchufe " + ({ d: "doble", ip: "estanco IP44", usb: "con USB", f: "de fuerza 16 A" }[x[0]] || "") : x[0] === "dim" ? "Regulador (dimmer)" : x[0] === "pir" ? "Sensor de movimiento" : x[0] === "pul" ? "Pulsador de timbre" : "Interruptor " + x[1])));
    ly += 14;
    g += '<text x="'.concat(lx, '" y="').concat(ly + 10, '" font-size="12" font-weight="800">CIRCUITOS</text>');
    ly += 10;
    s.circuits.forEach((c, k) => {
      ly += 18;
      g += '<line x1="'.concat(lx, '" y1="').concat(ly - 4, '" x2="').concat(lx + 20, '" y2="').concat(ly - 4, '" stroke="').concat(CCOL[k % CCOL.length], '" stroke-width="3"/><text x="').concat(lx + 26, '" y="').concat(ly, '" font-size="10.5">C').concat(k + 1).concat(s.sys === "tri" ? " (" + (c.ph || "R") + ")" : "", " ").concat(esc((c.n || "").slice(0, 16)), "</text>");
    });
    g += '<text x="'.concat(M, '" y="').concat(H - 10, '" font-size="10" fill="#666">Plano de planta \xB7 instalaci\xF3n el\xE9ctrica \xB7 escala gr\xE1fica: 1 m = ').concat(Math.round(K), ' px \xB7 generado por la Calculadora RIC</text><line x1="').concat(X(HW - 2), '" y1="').concat(H - 24, '" x2="').concat(X(HW - 1), '" y2="').concat(H - 24, '" stroke="#333" stroke-width="2"/><text x="').concat(X(HW - 1.5), '" y="').concat(H - 28, '" text-anchor="middle" font-size="9">1 m</text>');
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '.concat(W, " ").concat(H, '" font-family="Arial,Helvetica,sans-serif" role="img" aria-label="Plano de planta">').concat(g, "</svg>");
  }
  function memoriaHTML(s, standalone) {
    const r = simReport(s), B = simBOM(s), ev = r.ev, tri = s.sys === "tri", nm = S.proj && S.proj.nombre || "Vivienda unifamiliar", area = ROOMS.reduce((a, x) => a + rArea(x), 0), hoy = (/* @__PURE__ */ new Date()).toLocaleDateString("es-CL");
    const tbl = (h, rows) => '<div class="tbl-wrap"><table class="mt"><thead><tr>'.concat(h.map((x) => "<th>".concat(x, "</th>")).join(""), "</tr></thead><tbody>").concat(rows.map((rw) => "<tr>".concat(rw.map((x) => "<td>".concat(x, "</td>")).join(""), "</tr>")).join(""), "</tbody></table></div>");
    const body = '<h1>Memoria explicativa</h1><p class="mm">'.concat(esc(nm), " \xB7 instalaci\xF3n el\xE9ctrica interior \xB7 ").concat(hoy, "</p>\n  <h2>1. Generalidades</h2><p>La presente memoria describe la instalaci\xF3n el\xE9ctrica interior de una vivienda de ").concat(n1(area), " m\xB2, con ").concat(ROOMS.length, " recintos, alimentada en sistema ").concat(tri ? "trif\xE1sico 380/220 V, 4 conductores" : "monof\xE1sico 220 V, 50 Hz", ". El proyecto se desarrolla seg\xFAn los pliegos t\xE9cnicos RIC de la SEC (RIC N\xB003 demanda y alimentadores, N\xB004 conductores y canalizaciones, N\xB005 protecciones, N\xB006 puesta a tierra, N\xB010 instalaciones de consumo en viviendas, N\xB019 ensayos).</p>\n  <h2>2. Descripci\xF3n de la instalaci\xF3n</h2><p>Desde el empalme y medidor sale un alimentador de ").concat(sStr(+s.alim.S), " mm\xB2 y ").concat(n1(+s.alim.L), " m hasta el tablero general, que contiene un interruptor general ").concat(tri ? "tetrapolar" : "bipolar", " de ").concat(s.gen.In, " A, ").concat(simDRs(s).length, " protector(es) diferencial(es) de 30 mA y ").concat(s.circuits.length, " circuito(s) protegidos por interruptores autom\xE1ticos. La canalizaci\xF3n es ").concat({ pvc: "tubo PVC conduit", emt: "tubo met\xE1lico EMT", flex: "tubo flexible corrugado" }[s.duct || "pvc"], " ").concat(s.inst === "vista" ? "a la vista (sobrepuesto)" : "embutido en muros y entretecho", "; las derivaciones se ejecutan en cajas.</p>\n  ").concat(tbl(["Circuito", tri ? "Fase" : "", "Uso", "Puntos", "P proy. (W)", "Protecci\xF3n", "Diferencial", "Conductor"].filter(Boolean), r.rows.map((x) => [x.n, tri ? x.ph : null, esc(x.nom), "".concat(x.luces, " luces \xB7 ").concat(x.enchufes, " enchufes"), n0(x.P), "".concat(x.In, " A curva ").concat(x.cv, " ").concat(x.pc, " kA"), x.dr, "".concat(sStr(x.S), " mm\xB2")].filter((v) => v !== null))), "\n  <h2>3. C\xE1lculo de la demanda</h2><p>Potencia instalada proyectada: <b>").concat(n0(r.Pi), " W</b> (100 W por centro, 250 W por enchufe, potencia real en equipos de 1.500 W o m\xE1s). Aplicando la Tabla 3.1 del RIC N\xB003 (primeros 3.000 W al 100 %, siguientes al 35 %): <b>Pd = ").concat(n0(r.Pd), " W</b>, corriente de demanda ").concat(nf(r.Id, 1), " A").concat(tri ? " en la fase m\xE1s cargada" : "", ". Se elige interruptor general de <b>").concat(s.gen.In, " A</b>.</p>\n  ").concat(tri ? "<p>Reparto por fase: R ".concat(n0(ev.Pph.R), " W \xB7 S ").concat(n0(ev.Pph.S), " W \xB7 T ").concat(n0(ev.Pph.T), " W.</p>") : "", "\n  <h2>4. Dimensionamiento de circuitos</h2><p>Para cada circuito se verifica: In \u2265 1,1 \xD7 Is; P \u2264 0,9 \xD7 V \xD7 In; Is \u2264 In \u2264 Iz; secci\xF3n m\xEDnima de 1,5 mm\xB2 en alumbrado y 2,5 mm\xB2 en enchufes; ca\xEDda de tensi\xF3n \u0394V = 2\xB7\u03C1\xB7L\xB7I/S con \u03C1 = 0,018 \u03A9\xB7mm\xB2/m, menor a 3 % en el alimentador y 5 % hasta el punto m\xE1s lejano.</p>\n  ").concat(tbl(["Circuito", "Is (A)", "In (A)", "Iz (A)", "Largo (m)", "\u0394V total (%)", "Cumple"], r.rows.map((x) => [x.n, nf(x.Is, 2), x.In, x.Iz, n1(x.L), nf(x.dv, 2), x.err ? "Revisar" : "S\xED"])), "\n  <p>Ca\xEDda en el alimentador: ").concat(nf(r.dva, 2), " %.</p>\n  <h2>5. Protecciones</h2><p>Protecci\xF3n contra sobrecargas y cortocircuitos mediante interruptores termomagn\xE9ticos curva B en alumbrado y C en enchufes y equipos, con poder de corte de 6 kA. Protecci\xF3n contra contactos indirectos mediante diferenciales de 30 mA clase A, con un m\xE1ximo de 3 circuitos por diferencial (RIC N\xB010).</p>\n  <h2>6. Puesta a tierra</h2><p>Puesta a tierra de protecci\xF3n mediante barra de cobre en c\xE1mara de registro, unida a la barra PE del tablero. La resistencia medida debe ser igual o menor a 20 \u03A9 (RIC N\xB006). Todo enchufe y equipo lleva conductor de protecci\xF3n verde/amarillo.</p>\n  <h2>7. Resumen de materiales</h2>").concat(tbl(["Material", "Cantidad", "Unidad"], B.filter((b) => b.q > 0).map((b) => [esc(b.d), b.q, b.u])), "\n  <h2>8. Observaciones</h2>").concat(r.errs.length ? "<ol>".concat(r.errs.map((o) => "<li><b>".concat(esc(o.t), "</b>: ").concat(esc(o.d), "</li>")).join(""), "</ol>") : "<p>La instalaci\xF3n cumple todas las verificaciones realizadas por la herramienta.</p>", '\n  <p class="mm">Documento generado autom\xE1ticamente. Debe ser revisado y firmado por un instalador el\xE9ctrico autorizado SEC.</p>');
    if (!standalone) return body;
    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Memoria explicativa \xB7 '.concat(esc(nm), "</title><style>body{font-family:Arial,Helvetica,sans-serif;max-width:820px;margin:30px auto;padding:0 20px;color:#111;line-height:1.45}h1{font-size:24px;margin-bottom:0}h2{font-size:16px;margin-top:22px;border-bottom:2px solid #333;padding-bottom:3px}.mm{color:#555;font-size:13px}table{border-collapse:collapse;width:100%;font-size:12.5px;margin:8px 0}th,td{border:1px solid #999;padding:4px 6px;text-align:left}th{background:#eee}</style></head><body>").concat(body, "<h2>Anexo: plano de planta</h2>").concat(planSVG(s), "</body></html>");
  }
  function selfTests() {
    const hk0 = houseKey, hh0 = S.sim2 && S.sim2.house || null;
    setHouse(null);
    try {
      return selfTests1();
    } finally {
      setHouse(hh0);
      houseKey = hk0;
    }
  }
  function selfTests1() {
    const T2 = [], chk = (n, ok, got, exp) => T2.push({ n, ok: !!ok, got, exp });
    try {
      const a1 = ampTable({ met: "A1", tc: 70 }), b1 = ampTable({ met: "B1", tc: 70 }), t9 = ampTable({ met: "B1", tc: 90 });
      chk("RIC N\xB004 Tabla 4.4 · 70 \xB0C A1: 1,5 / 2,5 / 4 mm\xB2", a1[1.5] === 14 && a1[2.5] === 18 && a1[4] === 24, a1[1.5] + " / " + a1[2.5] + " / " + a1[4] + " A", "14 / 18 / 24 A");
      chk("RIC N\xB004 Tabla 4.4 · 70 \xB0C B1: 2,5 / 6 / 120 mm\xB2", b1[2.5] === 21 && b1[6] === 36 && b1[120] === 239, b1[2.5] + " / " + b1[6] + " / " + b1[120] + " A", "21 / 36 / 239 A");
      chk("RIC N\xB004 Tabla 4.4 · 90 \xB0C B1: 4 / 16 mm\xB2", t9[4] === 37 && t9[16] === 88, t9[4] + " / " + t9[16] + " A", "37 / 88 A");
      chk("RIC N\xB004 Tabla 4.6 · fn con 3 / 4 / 24 / 25 / 43 conductores", fnRIC(3) === 1 && fnRIC(4) === 0.8 && fnRIC(24) === 0.7 && fnRIC(25) === 0.6 && fnRIC(43) === 0.5, [3, 4, 24, 25, 43].map(fnRIC).join(" / "), "1 / 0,8 / 0,7 / 0,6 / 0,5");
      chk("RIC N\xB004 Tabla 4.21 · llenado 1 / 3 conductores / uni\xF3n", llenadoMax(1) === 50 && llenadoMax(3) === 33 && llenadoMax(5) === 33 && llenadoMax(3, true) === 60, llenadoMax(1) + " / " + llenadoMax(3) + " / " + llenadoMax(3, true) + " %", "50 / 33 / 60 %");
      chk("RIC N\xB003 Tabla 3.2 · Fs con 6 / 15 / 21 viviendas", fsViv(6).fs === 0.9 && fsViv(15).fs === 0.79 && fsViv(21).fs === 0.73, [6, 15, 21].map((n) => fsViv(n).fs).join(" / "), "0,90 / 0,79 / 0,73");
      chk("RIC N\xB003 Tabla 3.2 · Fs con 25 viviendas (f\xF3rmula)", Math.abs(fsViv(25).fs - 17.3 / 25) < 1e-9, nf(fsViv(25).fs, 3), "0,692");
    } catch (e) {
      chk("Tablas RIC", false, String(e), "");
    }
    try {
      chk("Demanda RIC N\xB003 de 6.700 W", Math.round(fdViv(6700).Pd) === 4295, n0(fdViv(6700).Pd) + " W", "4.295 W");
    } catch (e) {
      chk("Demanda", false, String(e), "");
    }
    try {
      const x = chooseIn(2e3 / 220, 2e3, 220, 1, 0);
      chk("Autom\xE1tico para 2.000 W (regla 90 %)", x === 16, x + " A", "16 A");
    } catch (e) {
      chk("Autom\xE1tico", false, String(e), "");
    }
    try {
      const dv = 2 * 0.018 * 22 * (2e3 / 220) / 2.5;
      chk("Ca\xEDda de tensi\xF3n 22 m, 2,5 mm\xB2", Math.abs(dv - 2.88) < 0.01, nf(dv, 2) + " V", "2,88 V");
    } catch (e) {
      chk("Ca\xEDda", false, String(e), "");
    }
    try {
      chk("Curva C: 2,5 \xD7 In es t\xE9rmico", curvZone(2.5, "C").z === "Disparo t\xE9rmico", curvZone(2.5, "C").z, "Disparo t\xE9rmico");
      chk("Curva C: 12 \xD7 In es magn\xE9tico", curvZone(12, "C").z === "Disparo magn\xE9tico", curvZone(12, "C").z, "Disparo magn\xE9tico");
      chk("Curva B: 1 \xD7 In no dispara", curvZone(1, "B").z === "Sin disparo", curvZone(1, "B").z, "Sin disparo");
    } catch (e) {
      chk("Curvas", false, String(e), "");
    }
    ["casa", "cocina", "clima"].forEach((k) => {
      try {
        const s = simTemplate(k), n = simInspect(s).filter((o) => !o.fault).length;
        chk("Plantilla \xAB".concat(k, "\xBB sin observaciones"), n === 0, n + " obs.", "0");
      } catch (e) {
        chk("Plantilla " + k, false, String(e), "");
      }
    });
    try {
      setHouse(PAN_HOUSE);
      const s = panBlank();
      panAuto(s);
      const r = panTest(s), h2 = panCount(s);
      const s3 = panBlank();
      s3.pan.req = { c932: 1 };
      panAuto(s3);
      const r3 = panTest(s3);
      chk("Interruptor 9/32: cada tecla enciende su luz", r3.ok && panCount(s3).c932 === 1 && r3.R.length === 3, r3.R.map((x) => x.d).join(" \xB7 ") || "\u2014", "3 teclas OK");
      chk("Panel de pr\xE1ctica: lo pedido se arma y funciona", r.ok && h2.c912 === 2 && h2.c915 === 1 && h2.c924 === 1 && h2.enc === 4, r.R.filter((x) => x.ok).length + "/" + r.R.length + " pruebas \xB7 " + r.E.length + " obs.", r.R.length + "/" + r.R.length + " \xB7 0 obs.");
    } catch (e) {
      chk("Panel de pr\xE1ctica", false, String(e), "");
    }
    setHouse(null);
    {
      try {
        const h = casaToHouse(CASA_TPL.find((t) => t[0] === "casa2p")[3]());
        setHouse(h);
        const s = sim2Blank(), c = { id: s.nid++, n: "Alumbrado escalera", In: 10, cv: "B", pc: 6, S: 1.5, dr: "DR1", ds: 30, cl: "A", nc: "dr", pe: true, on: true };
        s.house = h;
        s.circuits.push(c);
        s.gen.on = true;
        const A = simAddItem(s, "sw", c.id, [5.74, 1.1, 4], [-1, 0, 0], { v: "c" }), B = simAddItem(s, "sw", c.id, [5.74, 1.1 + FH, 4.5], [-1, 0, 0], { v: "c" });
        const l = simAddItem(s, "lamp", c.id, [5.2, 2.42 + FH, 3.9], null, { sw: A, sw2: B });
        const ev = simEval(s), eB = ev.E.find((e) => e.id === B), rB = itemRoom(s.items.find((i) => i.id === B));
        chk("2 pisos: el punto del 2.\xBA piso queda en su recinto", rB && rB.f === 1 && rB.t === "escalera", rB ? rB.n + " (piso " + (rB.f + 1) + ")" : "\u2014", "Escalera (piso 2)");
        const up = eB && eB.pts.some((p, i) => i && Math.abs(p[0] - eB.pts[i - 1][0]) < 1e-6 && Math.abs(p[2] - eB.pts[i - 1][2]) < 1e-6 && Math.abs(p[1] - eB.pts[i - 1][1]) > FH - 0.2);
        chk("2 pisos: la canalizaci\xF3n sube por el montante", up, eB ? n1(eB.L) + " m" : "sin tramo", "tramo vertical \u2265 " + nf(FH, 2) + " m");
        const by = (id) => s.items.find((i) => i.id === id);
        by(A).on = true;
        const on1 = simEval(s).act(by(l));
        by(B).on = true;
        const on2 = simEval(s).act(by(l));
        chk("2 pisos: la luz de escalera se comanda desde ambos pisos", on1 && !on2 && !simInspect(s).some((o) => /Escalera: la luz/.test(o.t)), (on1 ? "on" : "off") + " \u2192 " + (on2 ? "on" : "off"), "on \u2192 off");
      } catch (e) {
        chk("Vivienda de 2 pisos", false, String(e), "");
      }
      setHouse(null);
    }
    try {
      const s = sim2Blank(), c = { id: s.nid++, n: "Alumbrado", In: 10, cv: "B", pc: 6, S: 1.5, dr: "DR1", ds: 30, cl: "A", nc: "dr", pe: true, on: true };
      s.circuits.push(c);
      s.gen.on = true;
      const b = simAddItem(s, "box", c.id, [2, 2.3, 3.94], [0, 0, -1], { par: null });
      const A = simAddItem(s, "sw", c.id, [0.06, 1.1, 1], [1, 0, 0], { par: b, v: "c" }), B = simAddItem(s, "sw", c.id, [4.94, 1.1, 1], [-1, 0, 0], { par: b, v: "c" });
      const l = simAddItem(s, "lamp", c.id, [2.5, 2.42, 2], null, { par: b, sw: A, sw2: B });
      const D = simAddItem(s, "sw", c.id, [3, 1.1, 0.06], [0, 0, 1], { par: b, v: "d" }), l1 = simAddItem(s, "lamp", c.id, [1, 2.42, 1], null, { par: b, sw: D, k: 0 }), l2 = simAddItem(s, "lamp", c.id, [4, 2.42, 1], null, { par: b, sw: D, k: 1 });
      const by = (id) => s.items.find((i) => i.id === id), on = (id) => simEval(s).act(by(id));
      const r0 = on(l);
      by(A).on = true;
      const r1 = on(l);
      by(B).on = true;
      const r2 = on(l);
      chk("Escalera 9/24: cualquiera de los dos interruptores cambia la luz", !r0 && r1 && !r2, [r0, r1, r2].map((x) => x ? "on" : "off").join(" → "), "off → on → off");
      by(D).on2 = true;
      chk("9/15: cada tecla controla su propia luz", !on(l1) && on(l2), (on(l1) ? "on" : "off") + " / " + (on(l2) ? "on" : "off"), "off / on");
      wireManual(s, true);
      const w = simWire(s);
      chk("Empalmes de 9/15 y 9/24 sin errores", w.errs.length === 0, w.errs.map((x) => x.t).join("; ") || "0", "0");
      by(A).on = false;
      chk("Con empalmes hechos a mano la escalera sigue funcionando", !!simWire(s).work[l] === (!!by(A).on !== !!by(B).on), simWire(s).work[l] ? "on" : "off", by(A).on !== by(B).on ? "on" : "off");
    } catch (e) {
      chk("Interruptores 9/15 y 9/24", false, String(e), "");
    }
    try {
      const s = simTemplate("casa");
      wireManual(s, true);
      const w = simWire(s);
      chk("Empalmes correctos no generan errores", w.errs.length === 0, w.errs.length + " errores", "0");
      const b = s.items.find((i) => i.t === "box");
      joinTerms(s, b.id, b.id + ":F", b.id + ":N");
      const w2 = simWire(s);
      chk("Fase unida a neutro se detecta como cortocircuito", w2.T.cf.some((f) => f.ss.includes("L") && f.ss.includes("N")), w2.T.cf.length + " conflicto(s)", "\u2265 1");
      s.gen.on = true;
      const m = [];
      simTrips(s, m);
      chk("El cortocircuito hace disparar el autom\xE1tico", s.circuits.some((c) => !c.on), m.length + " aviso(s)", "circuito apagado");
    } catch (e) {
      chk("Empalmes", false, String(e), "");
    }
    try {
      const s = simTemplate("casa");
      s.circuits[1].nc = "off";
      s.gen.on = true;
      const ev = simEval(s), o = s.items.find((i) => i.c === s.circuits[1].id && i.t === "out");
      chk("Neutro suelto deja el circuito sin tensi\xF3n", ev.V[o.id] === 0, nf(ev.V[o.id] || 0, 1) + " V", "0 V");
    } catch (e) {
      chk("Neutro", false, String(e), "");
    }
    try {
      const s = simTemplate("casa"), it = s.items.find((i) => i.t === "sw");
      it.route = [[3.45, 1, 0.03]];
      it.p = [4.3, 1.1, 0.06];
      it.n = [0, 0, 1];
      const ev = simEval(s), ck = edgeChecks(s, ev.ed.get(it.id));
      chk("Tubo por el vano de una puerta se detecta", ck.warn.some((x) => x.k === "puerta"), ck.warn.map((x) => x.k).join(", ") || "nada", "puerta");
    } catch (e) {
      chk("Puerta", false, String(e), "");
    }
    try {
      const s = simTemplate("casa");
      s.sys = "tri";
      simBalance(s);
      const ev = simEval(s), v = [ev.Pph.R, ev.Pph.S, ev.Pph.T];
      chk("Balance de fases reparte en R, S y T", v.every((x) => x > 0), v.map(n0).join(" / ") + " W", "3 fases con carga");
    } catch (e) {
      chk("Fases", false, String(e), "");
    }
    ["n1", "n2", "n3", "libre"].forEach((k) => ["1P", "1P+N"].forEach((p) => {
      try {
        const lv = k === "libre" ? tgFreeLv(Object.assign(tgFreeDef(true), { emer: true })) : TG_LV[k], so = tgFresh(lv, p), A = tgCheck(lv, so);
        chk("Tablero \xAB".concat(k, "\xBB (").concat(p, "): la soluci\xF3n no tiene errores"), A.errs.length + A.warns.length === 0, A.errs.concat(A.warns).map((x) => x.t).join("; ") || "0", "0");
        const bad = JSON.parse(JSON.stringify(so));
        bad.wires.push({ a: "BN1", b: "PE1", c: "W" });
        if (p === "1P") chk("Tablero \xAB".concat(k, "\xBB (").concat(p, "): neutro unido a tierra se detecta"), tgCheck(lv, bad).errs.some((x) => /Neutro unido a tierra/.test(x.t)), "", "error");
        const em = { parts: [], wires: [], t0: 0 }, h = tgHintOf(lv, em);
        chk("Tablero \xAB".concat(k, "\xBB (").concat(p, "): la pista pide colocar el general"), h.cat === "ig", h.msg.slice(0, 40), "ig");
      } catch (e) {
        chk("Tablero " + k, false, String(e), "");
      }
    }));
    try {
      const lv = TG_LV.n3, so = tgFresh(lv, "1P"), bad = JSON.parse(JSON.stringify(so)), pn = bad.parts.find((p) => p.k === "pn" && p.r === 1);
      bad.parts = bad.parts.filter((p) => p !== pn);
      const t1 = bad.parts.filter((p) => p.k === "tm" && p.r === 1).sort((a, b) => a.m - b.m);
      bad.wires = bad.wires.filter((w) => w.b !== pn.id + ".L").concat([{ a: "DR1.o1", b: t1[0].id + ".i1", c: "R" }, { a: t1[0].id + ".i1", b: t1[1].id + ".i1", c: "R" }]);
      chk("RIC N\xB002 6.2.4: puente de cable entre entradas se detecta", tgCheck(lv, bad).errs.some((x) => /Puente de cable entre entradas/.test(x.t)), "", "error");
      const nopl = JSON.parse(JSON.stringify(so));
      nopl.parts = nopl.parts.filter((p) => p.k !== "pl");
      chk("RIC N\xB002 6.2.14: con 5 circuitos falta la luz piloto", tgCheck(lv, nopl).errs.some((x) => /Falta la luz piloto/.test(x.t)), "", "error");
      const l1 = TG_LV.n1, s1 = tgFresh(l1, "1P");
      chk("Con 2 circuitos la luz piloto es opcional", !s1.parts.some((p) => p.k === "pl") && !tgCheck(l1, s1).errs.length, "", "sin error");
      const prot = JSON.parse(JSON.stringify(so)), tp = prot.parts.find((p) => p.k === "tm" && p.r === 0);
      prot.wires = prot.wires.map((w) => w.a === tp.id + ".o1" ? Object.assign({}, w, { a: "IG1.o1" }) : w);
      chk("RIC N\xB002 6.2.15: piloto sin protecci\xF3n propia se detecta", tgCheck(lv, prot).errs.some((x) => /sin protecci\xF3n propia/.test(x.t)), "", "error");
    } catch (e) {
      chk("Reglas RIC N\xB002", false, String(e), "");
    }
    return T2;
  }
  function testsHTML() {
    const T2 = selfTests(), ok = T2.filter((t) => t.ok).length;
    return '<details class="learn"><summary>'.concat(ok === T2.length ? "\u2713" : "\u26A0", " Verificaci\xF3n del motor de c\xE1lculo: ").concat(ok, "/").concat(T2.length, ' pruebas correctas</summary><div class="body"><div class="tbl-wrap"><table class="pt"><thead><tr><th>Prueba</th><th>Resultado</th><th>Esperado</th><th></th></tr></thead><tbody>').concat(T2.map((t) => "<tr><td>".concat(esc(t.n), "</td><td>").concat(esc(String(t.got)), "</td><td>").concat(esc(String(t.exp)), "</td><td>").concat(t.ok ? '<span class="pill ok">\u2713</span>' : '<span class="pill bad">\u2717</span>', "</td></tr>")).join(""), '</tbody></table></div><p class="hint">Casos conocidos que se recalculan cada vez que abres esta p\xE1gina. Si alguno falla, el c\xE1lculo cambi\xF3 y hay que revisarlo.</p></div></details>');
  }
  function pgRep() {
    return repHTML();
  }
  function tplButtons() {
    return '<div class="tpls"><button type="button" class="tpl" data-go="casa" style="border:1.5px solid var(--copper);background:var(--copper-soft)"><span class="ti">\u{1F4D0}</span><span class="tt">Dise\xF1ar mi vivienda</span><span class="td">Medidas, recintos, puertas \u2192 3D y costos</span></button>'.concat(TPLS.map(([k, ic, t, d]) => '<button type="button" class="tpl" data-act="tpl" data-k="'.concat(k, '"><span class="ti">').concat(ic, '</span><span class="tt">').concat(t, '</span><span class="td">').concat(d, "</span></button>")).join(""), "</div>");
  }
  async function dlFile(name, blob) {
    let d = null;
    try {
      d = window.claude && window.claude.use ? await window.claude.use("downloads") : null;
    } catch (e) {
      d = null;
    }
    if (d) {
      try {
        await d.save({ filename: name, data: blob });
        return "ok";
      } catch (e) {
        return e && e.code === "declined" ? "declined" : "err";
      }
    }
    try {
      const u = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = u;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(u);
        a.remove();
      }, 800);
      return "ok";
    } catch (e) {
      return "err";
    }
  }
  const dlMsg = (r, okTxt) => r === "ok" ? okTxt : r === "declined" ? "Descarga cancelada." : "No se pudo descargar aqu\xED: usa \xABCopiar cuadro\xBB.";
  function repCSV() {
    const r = simReport(S.sim2), B = simBOM(S.sim2), cst = bomCost(B), t = (a) => a.map((v) => String(v).replace(/\t/g, " ")).join("	");
    return [t(["Circuito", "Nombre", "Luces", "Enchufes", "P proyectada (W)", "Is (A)", "In (A)", "Curva", "Icu (kA)", "Diferencial", "Secci\xF3n (mm\xB2)", "Iz (A)", "Largo (m)", "\u0394V total (%)", "Observaciones"])].concat(r.rows.map((x) => t([x.n, x.nom, x.luces, x.enchufes, Math.round(x.P), x.Is.toFixed(2).replace(".", ","), x.In, x.cv, x.pc, x.dr, String(x.S).replace(".", ","), x.Iz, x.L.toFixed(1).replace(".", ","), x.dv.toFixed(2).replace(".", ","), x.err]))).concat(["", t(["Material", "Cantidad", "Unidad", "Precio unitario (CLP)", "Subtotal (CLP)"])]).concat(B.filter((b) => b.q > 0).map((b) => t([b.d, b.q, b.u, b.pu, b.st]))).concat([t(["Neto", "", "", "", Math.round(cst.net)]), t(["IVA 19 %", "", "", "", Math.round(cst.iva)]), t(["Total", "", "", "", Math.round(cst.tot)])]).join("\n");
  }
  let XLSX_P = null;
  function loadXLSX() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    if (XLSX_P) return XLSX_P;
    XLSX_P = new Promise((ok, no) => {
      const sc = document.createElement("script");
      sc.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      sc.onload = () => window.XLSX ? ok(window.XLSX) : no();
      sc.onerror = () => {
        XLSX_P = null;
        no();
      };
      document.head.appendChild(sc);
    });
    return XLSX_P;
  }
  function repXLSX(msg) {
    loadXLSX().then((X) => {
      const s = S.sim2, r = simReport(s), B = simBOM(s), wb = X.utils.book_new();
      const cq = [["Circuito", "Nombre", "Luces", "Enchufes", "P proyectada (W)", "Is (A)", "In (A)", "Curva", "Icu (kA)", "Diferencial", "Secci\xF3n (mm\xB2)", "Iz (A)", "Largo (m)", "\u0394V total (%)", "Observaciones"]].concat(r.rows.map((x) => [x.n, x.nom, x.luces, x.enchufes, Math.round(x.P), +x.Is.toFixed(2), x.In, x.cv, x.pc, x.dr, x.S, x.Iz, +x.L.toFixed(1), +x.dv.toFixed(2), x.err]));
      cq.push([], ["Total instalado (W)", Math.round(r.Pi)], ["Demanda RIC N\xB003 (W)", Math.round(r.Pd)], ["Corriente de demanda (A)", +r.Id.toFixed(1)], ["Interruptor general (A)", +s.gen.In], ["Alimentador (mm\xB2)", +s.alim.S], ["\u0394V alimentador (%)", +r.dva.toFixed(2)]);
      X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(cq), "Cuadro de carga");
      const cst = bomCost(B);
      X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([["Grupo", "Material", "Cantidad", "Unidad", "Precio unitario (CLP)", "Subtotal (CLP)"]].concat(B.filter((b) => b.q > 0).map((b) => [b.g, b.d, b.q, b.u, b.pu, b.st])).concat([[], ["", "Neto", "", "", "", Math.round(cst.net)], ["", "IVA 19 %", "", "", "", Math.round(cst.iva)], ["", "Total", "", "", "", Math.round(cst.tot)]])), "Materiales y costos");
      X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([["Observaci\xF3n", "Detalle", "Por qu\xE9"]].concat(r.errs.map((o) => [o.t, o.d, o.w]))), "Observaciones");
      const out = X.write(wb, { bookType: "xlsx", type: "array" });
      return dlFile("instalacion-ric.xlsx", new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })).then((rr) => {
        if (msg) msg.textContent = dlMsg(rr, "Excel listo.");
      });
    }).catch(() => {
      if (msg) msg.textContent = "Sin conexi\xF3n para generar el Excel: usa \xABCopiar cuadro\xBB y p\xE9galo en Excel.";
    });
  }
  function clampLeads() {
    document.querySelectorAll("#app .lead").forEach((p) => {
      if (p.dataset.cl) return;
      p.dataset.cl = "1";
      if (p.textContent.length < 120) return;
      p.classList.add("clamp");
      const b = document.createElement("button");
      b.type = "button";
      b.className = "leadmore";
      b.textContent = "\u24D8 m\xE1s";
      b.addEventListener("click", () => {
        const o = p.classList.toggle("clamp");
        b.textContent = o ? "\u24D8 m\xE1s" : "menos";
      });
      p.after(b);
    });
  }
