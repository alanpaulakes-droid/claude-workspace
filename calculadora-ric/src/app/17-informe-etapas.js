  function infDef() {
    const d = /* @__PURE__ */ new Date(), iso = new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
    return { prop: "", rut: "", dir: "", comuna: "", region: "", rol: "", tipo: "nueva", inst: "", instRut: "", lic: "", clase: "D", fono: "", mail: "", dist: "", cliente: "", ini: iso, n: 2, hd: 8, sab: false, vhh: 9e3, gg: 10, ut: 15, mo: "hh" };
  }
  function infGet() {
    if (!S.inf) S.inf = infDef();
    const d = infDef();
    for (const k in d) if (S.inf[k] == null) S.inf[k] = d[k];
    return S.inf;
  }
  const INF_TIPO = { nueva: "Instalaci\xF3n nueva", ampliacion: "Ampliaci\xF3n", modificacion: "Modificaci\xF3n" };
  function infQty(s) {
    const ev = simEval(s), B = simBOM(s), it = (t) => s.items.filter((i) => i.t === t).length, sum = (g, u) => B.filter((b) => b.g === g && b.u === u).reduce((a, b) => a + b.q, 0);
    const curv = (B.find((b) => b.k === "curva") || {}).q || 0, regl = (B.find((b) => b.k === "conec") || {}).q || 0;
    return { ev, B, area: ROOMS.reduce((a, r) => a + rArea(r), 0), tubo: sum("Canalizaci\xF3n", "m"), cable: sum("Conductores", "m"), curv, regl, box: it("box"), lamp: it("lamp"), sw: it("sw"), out: it("out"), hor: it("horno"), nc: s.circuits.length, ndr: simDRs(s).length, La: +s.alim.L || 0, emb: s.inst !== "vista" };
  }
  function infTasks(s) {
    const q = infQty(s), k = q.emb ? 1 : 0.75, pts = q.lamp + q.sw + q.out + q.hor;
    return [
      { id: "rep", n: "Replanteo y trazado en obra", h: 1.5 + 0.04 * q.area, c: 2, d: [], w: "Marcar en muros y cielo la posici\xF3n de cajas, aparatos, tablero y recorridos seg\xFAn el plano." },
      { id: "can", n: "Canalizaci\xF3n (tubos, curvas" + (q.emb ? ", picado y tapado)" : ", fijaciones)"), h: (q.tubo * 0.17 + q.curv * 0.08) * k, c: 4, d: ["rep"], w: q.emb ? "Picar muros, fijar tubos y tapar. Respetar 3 curvas m\xE1ximo entre cajas." : "Fijar tubos con abrazaderas cada metro." },
      { id: "caj", n: "Cajas de derivaci\xF3n, de embutir y de centro", h: (q.box * 0.5 + (q.sw + q.out + q.hor) * 0.35 + q.lamp * 0.3) * k, c: 4, d: ["rep"], w: "Instalar " + q.box + " cajas de derivaci\xF3n, " + (q.sw + q.out + q.hor) + " de embutir y " + q.lamp + " de centro." },
      { id: "tab", n: "Montaje del tablero y protecciones", h: 2.5 + 0.35 * (q.nc + q.ndr + 1), c: 1, d: ["rep"], w: "General, " + q.ndr + " diferencial(es), " + q.nc + " autom\xE1tico(s), barras N y PE, rotulado." },
      { id: "ali", n: "Alimentador y puesta a tierra", h: 3 + 0.08 * q.La, c: 2, d: ["rep"], w: "Tender el alimentador (" + n1(q.La) + " m), hincar el electrodo y conectar la barra PE." },
      { id: "cab", n: "Alambrado (pasada de conductores)", h: q.cable * 0.012 + q.nc * 0.3, c: 3, d: ["can", "caj"], w: "Pasar " + n0(q.cable) + " m de conductor respetando los colores (RIC N\xB004, 5.32): fase azul, negro o rojo; neutro blanco; tierra verde o verde/amarillo." },
      { id: "emp", n: "Empalmes en cajas de derivaci\xF3n", h: q.regl * 0.12 + q.box * 0.2, c: 3, d: ["cab"], w: q.regl + " regletas o conectores. Nunca unir neutro con tierra." },
      { id: "ctb", n: "Conexi\xF3n de circuitos al tablero", h: q.nc * 0.4 + 0.5, c: 1, d: ["tab", "cab"], w: "Cada neutro sale de su diferencial; cada PE a la barra de tierra." },
      { id: "apa", n: "Aparatos y luminarias", h: (q.sw + q.out) * 0.25 + q.lamp * 0.35 + q.hor * 0.5, c: 3, d: ["emp"], w: q.sw + " interruptores, " + q.out + " enchufes, " + q.lamp + " luminarias" + (q.hor ? ", " + q.hor + " salida(s) de fuerza" : "") + "." },
      { id: "pru", n: "Pruebas, mediciones y puesta en servicio", h: 2 + 0.08 * pts + 0.3 * q.ndr, c: 2, d: ["ctb", "apa", "ali"], w: "Continuidad de PE, aislamiento (≥ 0,5 MΩ), resistencia de puesta a tierra, prueba de diferenciales y polaridad (RIC N\xB019)." },
      { id: "doc", n: "Planos finales, TE1 y entrega al propietario", h: 3, c: 1, d: ["pru"], w: "Actualizar planos, completar el cuadro de cargas y declarar la instalaci\xF3n (TE1)." }
    ].map((t) => Object.assign(t, { h: Math.max(0.5, Math.round(t.h * 2) / 2) }));
  }
  function infPlan(s, inf) {
    const T = infTasks(s), N = Math.max(1, Math.min(8, +inf.n || 1)), done = {}, run = [];
    let t = 0, free = N, guard = 0;
    while (Object.keys(done).length < T.length && guard++ < 500) {
      T.forEach((x) => {
        if (x.st != null || free < 1 || !x.d.every((d) => done[d] != null)) return;
        const w = Math.min(free, x.c);
        x.st = Math.max(t, ...x.d.map((d) => done[d]));
        x.w2 = w;
        x.dur = x.h / w;
        x.en = x.st + x.dur;
        free -= w;
        run.push(x);
      });
      if (!run.length) break;
      run.sort((a, b) => a.en - b.en);
      const f = run.shift();
      t = f.en;
      done[f.id] = f.en;
      free += f.w2;
    }
    const hd = Math.max(4, Math.min(12, +inf.hd || 8)), HH = T.reduce((a, x) => a + x.h, 0), mk = Math.max(...T.map((x) => x.en || 0));
    return { T, N, hd, HH, mk, days: Math.ceil(mk / hd - 1e-9) };
  }
  function infDates(inf, nd) {
    const out = [], d = new Date((inf.ini || "2026-01-01") + "T12:00:00");
    if (isNaN(d)) d.setTime(Date.now());
    while (out.length < nd) {
      const w = d.getDay();
      if (w !== 0 && (w !== 6 || inf.sab)) out.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return out;
  }
  const fDate = (d) => d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit" });
  const fDateL = (d) => d.toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  function ganttSVG(P, inf, mono) {
    const nd = Math.max(1, P.days), D = infDates(inf, nd + 1), LW = 270, cw = Math.max(26, Math.min(70, 640 / nd)), RH = 30, top = 46, W = LW + nd * cw + 190, H = top + P.T.length * RH + 34;
    const col = ["#1E4E78", "#B0522A", "#2A7848", "#7B4A9E", "#93600A", "#C0392B", "#17808A", "#555"];
    let g = '<rect width="' + W + '" height="' + H + '" fill="#fff"/><text x="10" y="18" font-size="13" font-weight="800" fill="#14202C">Carta Gantt \xB7 ' + P.N + " instalador" + (P.N > 1 ? "es" : "") + " \xB7 " + P.hd + " h/d\xEDa \xB7 " + nd + " d\xEDa" + (nd > 1 ? "s" : "") + " h\xE1biles</text>";
    for (let i = 0; i < nd; i++) {
      const x = LW + i * cw, we = D[i].getDay() === 6;
      g += '<rect x="' + x + '" y="' + (top - 16) + '" width="' + cw + '" height="' + (P.T.length * RH + 16) + '" fill="' + (i % 2 ? "#f4f6f8" : "#fff") + '" stroke="#e1e6eb"/>' + (we ? '<rect x="' + x + '" y="' + (top - 16) + '" width="' + cw + '" height="3" fill="#B0522A"/>' : "") + '<text x="' + (x + cw / 2) + '" y="' + (top - 4) + '" font-size="' + (cw < 34 ? 8.5 : 10) + '" text-anchor="middle" fill="#56657A">' + fDate(D[i]) + "</text>";
    }
    P.T.forEach((x, i) => {
      const y = top + i * RH, x0 = LW + x.st / P.hd * cw, x1 = LW + x.en / P.hd * cw, c = mono ? "#333" : col[i % col.length];
      g += '<text x="10" y="' + (y + 19) + '" font-size="11.5" fill="#14202C">' + (i + 1) + ". " + esc(x.n.length > 40 ? x.n.slice(0, 39) + "…" : x.n) + '</text><rect x="' + x0.toFixed(1) + '" y="' + (y + 7) + '" width="' + Math.max(3, x1 - x0).toFixed(1) + '" height="16" rx="4" fill="' + c + '" opacity=".9"/><text x="' + (x1 + 4).toFixed(1) + '" y="' + (y + 19) + '" font-size="9.5" fill="#56657A">' + nf(x.h, 1) + " HH \xB7 " + x.w2 + "p</text>";
      x.d.forEach((dd) => {
        const p = P.T.find((z) => z.id === dd), j = P.T.indexOf(p);
        if (p && Math.abs(p.en - x.st) < 1e-6) g += '<path d="M' + (LW + p.en / P.hd * cw).toFixed(1) + " " + (top + j * RH + 23) + "V" + (y + 15) + "h3" + '" fill="none" stroke="#9aa5ae" stroke-width="1" stroke-dasharray="2 2"/>';
      });
    });
    const xe = LW + P.mk / P.hd * cw, ye = top + P.T.length * RH;
    g += '<path d="M' + xe.toFixed(1) + " " + (ye + 6) + "l6 6l-6 6l-6 -6z" + '" fill="#2A7848"/><text x="' + (xe + 10).toFixed(1) + '" y="' + (ye + 16) + '" font-size="11" font-weight="700" fill="#2A7848">Entrega: ' + fDateL(D[Math.max(0, nd - 1)]) + "</text>";
    return '<svg class="gantt" viewBox="0 0 ' + W + " " + H + '" width="' + W + '" role="img" aria-label="Carta Gantt de la obra">' + g + "</svg>";
  }
  function infBudget(s, inf, P) {
    const B = simBOM(s), mat = bomCost(B.filter((b) => b.g !== "Mano de obra")).net, moPt = bomCost(B.filter((b) => b.g === "Mano de obra")).net;
    const lab = inf.mo === "pt" ? moPt : P.HH * (+inf.vhh || 0), sub = mat + lab, gg = sub * (+inf.gg || 0) / 100, ut = (sub + gg) * (+inf.ut || 0) / 100, net = sub + gg + ut;
    return { mat, lab, gg, ut, net, iva: net * 0.19, tot: net * 1.19, moPt };
  }
  function infMissing(inf) {
    const F = [["prop", "nombre del propietario"], ["rut", "RUT del propietario"], ["dir", "direcci\xF3n de la instalaci\xF3n"], ["comuna", "comuna"], ["inst", "nombre del instalador"], ["instRut", "RUT del instalador"], ["lic", "n\xFAmero de licencia SEC"], ["dist", "empresa distribuidora"]];
    return F.filter(([k]) => !String(inf[k] || "").trim()).map((x) => x[1]);
  }
  function infTE1(s, inf) {
    const r = simReport(s), ev = r.ev, tri = s.sys === "tri", area = ROOMS.reduce((a, x) => a + rArea(x), 0), T = S.tierra || {}, row = (a, b) => "<tr><th>" + a + "</th><td>" + (b === "" || b == null ? '<span class="miss">— completar —</span>' : b) + "</td></tr>";
    const tb = (t, rows) => '<h3>' + t + '</h3><table class="te">' + rows.join("") + "</table>";
    const drs = simDRs(s), ens = S.ens || {};
    return '<div class="te1"><p class="te-w">Borrador con los datos que pide la declaraci\xF3n de instalaci\xF3n el\xE9ctrica interior (TE1). La declaraci\xF3n oficial la ingresa un instalador autorizado en la plataforma en l\xEDnea de la SEC; este documento sirve para reunir y revisar la informaci\xF3n antes de declarar.</p>' +
      tb("A. Propietario", [row("Nombre o raz\xF3n social", esc(inf.prop)), row("RUT", esc(inf.rut)), row("Rol de aval\xFAo", esc(inf.rol))]) +
      tb("B. Ubicaci\xF3n y tipo de instalaci\xF3n", [row("Direcci\xF3n", esc(inf.dir)), row("Comuna / regi\xF3n", esc([inf.comuna, inf.region].filter(Boolean).join(", "))), row("Tipo de declaraci\xF3n", INF_TIPO[inf.tipo] || ""), row("Destino", "Vivienda unifamiliar"), row("Superficie construida", n1(area) + " m\xB2 \xB7 " + ROOMS.length + " recintos")]) +
      tb("C. Empalme y suministro", [row("Empresa distribuidora", esc(inf.dist)), row("N\xB0 de cliente / medidor", esc(inf.cliente)), row("Sistema", tri ? "Trif\xE1sico 380/220 V, 50 Hz" : "Monof\xE1sico 220 V, 50 Hz"), row("Potencia instalada", nf(r.Pi / 1e3, 2) + " kW"), row("Demanda m\xE1xima (RIC N\xB003)", nf(r.Pd / 1e3, 2) + " kW \xB7 " + nf(r.Id, 1) + " A"), row("Protecci\xF3n general", s.gen.In + " A, " + (tri ? "4P" : "2P") + " curva C")]) +
      tb("D. Instalador responsable", [row("Nombre", esc(inf.inst)), row("RUT", esc(inf.instRut)), row("Licencia SEC", inf.lic ? "Clase " + esc(inf.clase) + " \xB7 N\xB0 " + esc(inf.lic) : ""), row("Contacto", esc([inf.fono, inf.mail].filter(Boolean).join(" \xB7 ")))]) +
      tb("E. Caracter\xEDsticas t\xE9cnicas", [row("Alimentador", sStr(+s.alim.S) + " mm\xB2 Cu \xB7 " + n1(+s.alim.L || 0) + " m \xB7 ΔV " + nf(r.dva, 2) + " %"), row("Tablero", "1 tablero general \xB7 " + s.circuits.length + " circuito(s) \xB7 " + drs.length + " diferencial(es) de " + (s.circuits[0] ? s.circuits[0].ds : 30) + " mA"), row("Canalizaci\xF3n", ({ pvc: "Tubo PVC conduit", emt: "Tubo met\xE1lico EMT", flex: "Tubo flexible" }[s.duct || "pvc"]) + (s.inst === "vista" ? ", a la vista" : ", embutida")), row("Puesta a tierra", 'Electrodo Copperweld 5/8" \xD7 1,5 m' + (+T.Rprot > 0 ? " \xB7 R protecci\xF3n medida " + nf(+T.Rprot, 1) + " Ω" : "") + (+T.Rserv > 0 ? " \xB7 R servicio " + nf(+T.Rserv, 1) + " Ω" : "")), row("Esquema", "TN-S: neutro y tierra separados en toda la instalaci\xF3n")]) +
      '<h3>F. Cuadro de circuitos</h3><table class="te tc"><tr><th>Circ.</th><th>Destino</th><th>P (W)</th><th>Protecci\xF3n</th><th>DR</th><th>Conductor</th><th>ΔV</th></tr>' + r.rows.map((x) => "<tr><td>" + x.n + "</td><td>" + esc(x.nom) + "</td><td>" + n0(x.P) + "</td><td>" + x.In + " A curva " + x.cv + "</td><td>" + x.dr + "</td><td>" + sStr(x.S) + " mm\xB2</td><td>" + nf(x.dv, 2) + " %</td></tr>").join("") + "</table>" +
      tb("G. Ensayos (RIC N\xB019)", [row("Continuidad de conductores de protecci\xF3n", ens.items && Object.keys(ens.items).length ? "Registrados en el paso 8" : ""), row("Resistencia de aislamiento", Array.isArray(ens.aisl) && ens.aisl.some((v) => +v > 0) ? ens.aisl.filter((v) => +v > 0).map((v) => nf(+v, 1) + " MΩ").join(" \xB7 ") : ""), row("Prueba de diferenciales", ""), row("Resistencia de puesta a tierra", +T.Rprot > 0 ? nf(+T.Rprot, 1) + " Ω" : "")]) +
      tb("H. Documentos que se adjuntan", [row("Plano de planta con simbolog\xEDa", "Incluido"), row("Diagrama unilineal del tablero", "Incluido"), row("Cuadro de cargas", "Incluido"), row("Memoria explicativa", "Incluida")]) +
      '<div class="firm"><div>Firma instalador</div><div>Firma propietario</div></div></div>';
  }
  const INF_CSS = "@page{size:A4;margin:18mm 16mm 16mm 18mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;max-width:820px;margin:20px auto;padding:0 18px;color:#000;line-height:1.4;font-size:10.5pt}h1{font-size:17pt;margin:0;text-transform:uppercase;letter-spacing:.02em}h2{font-size:11.5pt;margin:20px 0 6px;text-transform:uppercase;border-bottom:1.2pt solid #000;padding-bottom:2px;page-break-after:avoid}h3{font-size:10.5pt;margin:12px 0 4px;page-break-after:avoid}p{margin:4px 0 6px;text-align:justify}table{border-collapse:collapse;width:100%;font-size:9pt;margin:4px 0 8px;page-break-inside:auto}tr{page-break-inside:avoid}th,td{border:.6pt solid #000;padding:3px 5px;text-align:left;vertical-align:top}th{background:#e6e6e6;font-weight:700}td.n,th.n{text-align:right;white-space:nowrap}.hdr{width:100%;border:1pt solid #000;margin-bottom:10px}.hdr td{font-size:8.5pt;padding:3px 6px}.hdr .t{font-weight:700;font-size:10pt;text-align:center}.cov{min-height:900px;display:flex;flex-direction:column}.cov .ttl{margin:110px 0 26px;text-align:center}.cov .ttl h1{font-size:20pt}.cov .ttl p{text-align:center;font-size:12pt;margin:6px 0}.kv th{width:32%}.toc{list-style:none;padding:0;margin:0}.toc li{display:flex;border-bottom:.5pt dotted #777;padding:2px 0}.toc li span{flex:1}.sig{display:grid;grid-template-columns:1fr 1fr 1fr;gap:26px;margin-top:46px}.sig div{border-top:.8pt solid #000;padding-top:3px;text-align:center;font-size:8.5pt}.miss{color:#555;font-style:italic}.te-w{border:.6pt solid #000;padding:5px 8px;font-size:9pt;margin:6px 0}.gw svg,.lam svg{width:100%;height:auto;display:block}.lam{border:.6pt solid #000}figure.ill{margin:6px 0}figure.ill svg{display:block;width:100%;height:auto;max-height:360px}figcaption{font-size:8.5pt;color:#333}.ill text{fill:#000;font-size:13px;font-family:Arial,Helvetica,sans-serif}.ill .f-ink{fill:#000}.ill .f-surf{fill:#fff}.ill .f-surf2{fill:#f2f2f2}.ill .f-mut{fill:#555}.ill .f-line{fill:#ccc}.ill .s-ink{stroke:#000}.ill .s-mut{stroke:#555}.ill .s-line{stroke:#ccc}.ill .bad{fill:#000}.ill .ok{fill:#000}.ill .ts{fill:#444;font-size:12px}.ill .tb{font-weight:700}.pb{page-break-before:always}.tot td{font-weight:700;background:#f0f0f0}.small{font-size:8.5pt;color:#333}.te th{width:36%}.te.tc th{width:auto}.firm{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px}.firm div{border-top:.8pt solid #000;padding-top:3px;text-align:center;font-size:8.5pt}h3+table{margin-top:2px}:root{--ink:#000;--bad:#000;--muted:#444;--line:#999;--surface:#fff;--surface2:#f2f2f2}@media print{body{margin:0;max-width:none;padding:0}}";
  function infDoc(s, which) {
    const inf = infGet(), E = etGet(), P = infPlan(s, inf), Bg = infBudget(s, inf, P), r = simReport(s), B = simBOM(s), D = infDates(inf, Math.max(1, P.days)), nm = S.proj && S.proj.nombre || HNAME || "Vivienda unifamiliar", area = ROOMS.reduce((a, x) => a + rArea(x), 0), hoy = (/* @__PURE__ */ new Date()).toLocaleDateString("es-CL"), tri = s.sys === "tri", T = S.tierra || {};
    const code = "IT-EL-" + String(Math.abs([...nm].reduce((a, c) => a * 31 + c.charCodeAt(0) | 0, 7)) % 1e3).padStart(3, "0"), ubic = [inf.dir, inf.comuna, inf.region].filter(Boolean).join(", ") || "—";
    const head = (t) => '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>' + t + " \xB7 " + esc(nm) + "</title><style>" + INF_CSS + "</style></head><body>";
    const hdr = (t) => '<table class="hdr"><tr><td rowspan="2" style="width:26%"><b>' + esc((inf.inst || "Instalador").toUpperCase()) + "</b><br>" + (inf.lic ? "Licencia SEC clase " + esc(inf.clase) + " N\xB0 " + esc(inf.lic) : "Instalador el\xE9ctrico") + '</td><td class="t">' + t + '</td><td style="width:22%">Documento: <b>' + code + "</b></td></tr><tr><td class=\"t\" style=\"font-weight:400\">" + esc(nm) + " \xB7 " + esc(ubic) + "</td><td>Rev. 0 \xB7 " + hoy + "</td></tr></table>";
    const kv = (rows) => '<table class="kv">' + rows.map(([a, b]) => "<tr><th>" + a + "</th><td>" + (b === "" || b == null ? '<span class="miss">por completar</span>' : b) + "</td></tr>").join("") + "</table>";
    if (which === "te1") return head("Antecedentes declaraci\xF3n TE1") + hdr("ANTECEDENTES PARA DECLARACI\xD3N TE1") + infTE1(s, inf) + '<h2 class="pb">Anexo A \xB7 L\xE1mina del proyecto</h2><div class="lam">' + laminaSVG(s) + "</div><h2>Anexo B \xB7 Diagrama unilineal</h2>" + simConnSVG(s) + "</body></html>";
    const mat = B.filter((b) => b.q > 0 && b.g !== "Mano de obra");
    bomCost(mat);
    const its = (t) => s.items.filter((i) => i.t === t).length, D0 = D[0], D1 = D[D.length - 1], drs = simDRs(s);
    const alc = E.def && E.def.alcance || "Suministro de materiales y ejecuci\xF3n de la instalaci\xF3n el\xE9ctrica interior de alumbrado y enchufes, incluido el tablero de distribuci\xF3n, la puesta a tierra de protecci\xF3n, los ensayos de puesta en servicio y la documentaci\xF3n para la declaraci\xF3n TE1. Se excluye el empalme y el medidor, que son de responsabilidad de la empresa distribuidora.";
    const reqs = E.def && E.def.req ? REQS.filter(([k]) => E.def.req[k]).map((x) => x[1]) : [];
    const TOC = ["Objetivo y alcance", "Antecedentes generales", "Normativa aplicable", "Descripci\xF3n de la instalaci\xF3n", "Cuadro de cargas y c\xE1lculos", "Especificaciones t\xE9cnicas", "Cubicaci\xF3n de materiales", "Presupuesto", "Programa de obra", "Procedimiento de ejecuci\xF3n", "Inspecci\xF3n, ensayos y puesta en servicio", "Antecedentes para la declaraci\xF3n TE1", "Observaciones"];
    let n = 0;
    const H = (pb) => "<h2" + (pb ? ' class="pb"' : "") + ">" + ++n + ". " + TOC[n - 1] + "</h2>";
    const ens = [["Continuidad de conductores de protecci\xF3n", "Continuidad entre barra PE y cada punto con tierra", ""], ["Resistencia de aislamiento", "≥ 0,5 MΩ por circuito a 500 V CC", Array.isArray((S.ens || {}).aisl) && S.ens.aisl.some((v) => +v > 0) ? S.ens.aisl.filter((v) => +v > 0).map((v) => nf(+v, 1) + " MΩ").join(" / ") : ""], ["Resistencia de puesta a tierra", "Seg\xFAn RIC N\xB006 y sensibilidad del diferencial", +T.Rprot > 0 ? nf(+T.Rprot, 1) + " Ω" : ""], ["Prueba de diferenciales", "Desconexi\xF3n con IΔn = 30 mA y bot\xF3n de prueba", ""], ["Polaridad y tensi\xF3n", "220 V \xB1 7,5 % F–N; fase en el borne correspondiente", ""], ["Funcionamiento", "Operaci\xF3n de cada interruptor, enchufe y protecci\xF3n", ""]];
    const spec = [["Conductores", "Cobre con aislaci\xF3n THHN/THWN-2 o NYA, secciones seg\xFAn cuadro de cargas. Colores (RIC N\xB004, 5.32): fase " + (tri ? "1 azul, fase 2 negro, fase 3 rojo" : "azul, negro o rojo seg\xFAn la fase que alimenta") + ", neutro blanco, protecci\xF3n verde o verde/amarillo."], ["Canalizaciones", "Tubo " + ({ pvc: "conduit PVC r\xEDgido auto-extinguible", emt: "met\xE1lico EMT", flex: "corrugado flexible auto-extinguible" }[s.duct || "pvc"]) + ", " + (s.inst === "vista" ? "a la vista con abrazaderas cada 1 m" : "embutido en muros y cielos") + ". Llenado m\xE1ximo 33 % (RIC N\xB004, Tabla 4.21); m\xE1ximo tres curvas entre cajas."], ["Cajas", "Cajas de derivaci\xF3n, de embutir y de centro de PVC con tapa. Empalmes con conectores certificados, siempre dentro de cajas accesibles."], ["Aparatos", "Interruptores y enchufes 2P+T de 10/16 A con certificaci\xF3n SEC. Alturas sobre N.P.T.: interruptores 1,10 m; enchufes 0,30 m (cocina 1,10 m). En zonas h\xFAmedas, grado IP44."], ["Protecciones", "Interruptor general " + s.gen.In + " A " + (tri ? "4P" : "2P") + " curva C; autom\xE1ticos termomagn\xE9ticos curva B o C, poder de corte 6 kA; " + drs.length + " diferencial(es) de 30 mA."], ["Tablero", "Tablero de distribuci\xF3n con riel DIN, barras de neutro y de tierra independientes, tapa, cuadro de circuitos y se\xF1al de riesgo el\xE9ctrico."], ["Puesta a tierra", 'Electrodo Copperweld 5/8" \xD7 1,5 m en c\xE1mara de inspecci\xF3n, conector de bronce y conductor de protecci\xF3n hasta la barra PE del tablero.']];
    const body = '<div class="cov">' + hdr("INFORME T\xC9CNICO") + '<div class="ttl"><h1>Informe t\xE9cnico</h1><p>Proyecto de instalaci\xF3n el\xE9ctrica interior</p><p><b>' + esc(nm.toUpperCase()) + "</b></p></div>" +
      kv([["Ubicaci\xF3n", esc(ubic)], ["Propietario / mandante", esc(inf.prop) + (inf.rut ? " \xB7 RUT " + esc(inf.rut) : "")], ["Instalador responsable", esc(inf.inst) + (inf.instRut ? " \xB7 RUT " + esc(inf.instRut) : "")], ["Licencia SEC", inf.lic ? "Clase " + esc(inf.clase) + " \xB7 N\xB0 " + esc(inf.lic) : ""], ["Tipo de obra", INF_TIPO[inf.tipo] || ""], ["Documento", code + " \xB7 Revisi\xF3n 0"], ["Fecha de emisi\xF3n", hoy]]) +
      "<h3>Control de revisiones</h3><table><tr><th>Rev.</th><th>Fecha</th><th>Descripci\xF3n</th><th>Elabor\xF3</th><th>Revis\xF3</th><th>Aprob\xF3</th></tr><tr><td>0</td><td>" + hoy + "</td><td>Emisi\xF3n para revisi\xF3n del mandante y declaraci\xF3n</td><td>" + esc(inf.inst || "") + "</td><td></td><td></td></tr></table>" +
      "<h3>Distribuci\xF3n</h3><table><tr><th>Destinatario</th><th>Uso</th></tr><tr><td>Propietario / mandante</td><td>Aprobaci\xF3n de alcance, presupuesto y programa; recepci\xF3n de la obra</td></tr><tr><td>Superintendencia de Electricidad y Combustibles</td><td>Antecedentes de respaldo de la declaraci\xF3n TE1</td></tr><tr><td>Equipo de instalaci\xF3n</td><td>Ejecuci\xF3n, control de avance y ensayos</td></tr></table>" +
      "<h3>Contenido</h3><ol class=\"toc\">" + TOC.map((t, i) => "<li><span>" + (i + 1) + ". " + t + "</span></li>").join("") + "<li><span>Anexo A. L\xE1mina del proyecto</span></li><li><span>Anexo B. Plano de planta y canalizaciones</span></li><li><span>Anexo C. Diagrama unilineal del tablero</span></li></ol></div>" +
      '<div class="pb"></div>' + hdr("INFORME T\xC9CNICO") +
      H() + "<p>" + esc(alc) + "</p>" + (reqs.length ? "<p>Requerimientos del mandante: " + reqs.join("; ") + ".</p>" : "") + kv([["Superficie construida", n1(area) + " m\xB2 \xB7 " + ROOMS.length + " recintos"], ["Potencia instalada / demanda", nf(r.Pi / 1e3, 2) + " kW / " + nf(r.Pd / 1e3, 2) + " kW"], ["Circuitos", s.circuits.length + " circuitos \xB7 " + drs.length + " diferencial(es)"], ["Plazo de ejecuci\xF3n", P.days + " d\xEDas h\xE1biles (" + fDate(D0) + " al " + fDate(D1) + ") con " + P.N + " instalador(es)"], ["Monto total", clp(Bg.tot) + " IVA incluido"]]) +
      H() + kv([["Direcci\xF3n", esc(inf.dir)], ["Comuna / regi\xF3n", esc([inf.comuna, inf.region].filter(Boolean).join(", "))], ["Rol de aval\xFAo", esc(inf.rol)], ["Empresa distribuidora", esc(inf.dist)], ["N\xB0 de cliente", esc(inf.cliente)], ["Suministro", tri ? "Trif\xE1sico 380/220 V, 50 Hz" : "Monof\xE1sico 220 V, 50 Hz"], ["Capacidad de empalme", E.fac_cap ? E.fac_cap + " A" : ""], ["Destino", "Vivienda"]]) +
      H() + "<p>El proyecto se desarrolla conforme al Reglamento de Seguridad de las Instalaciones de Consumo de Energ\xEDa El\xE9ctrica y sus pliegos t\xE9cnicos RIC, en particular:</p><table><tr><th>Pliego</th><th>Materia</th></tr>" + [["RIC N\xB002", "Tableros el\xE9ctricos"], ["RIC N\xB003", "Alimentadores y demanda de una instalaci\xF3n"], ["RIC N\xB004", "Conductores, materiales y sistemas de canalizaci\xF3n"], ["RIC N\xB005", "Medidas de protecci\xF3n contra tensiones peligrosas"], ["RIC N\xB006", "Puesta a tierra"], ["RIC N\xB010", "Instalaciones de uso habitacional"], ["RIC N\xB019", "Inspecci\xF3n, ensayos y puesta en servicio"]].map(([a, b]) => "<tr><td>" + a + "</td><td>" + b + "</td></tr>").join("") + '</table><p class="small">Los requisitos deben verificarse en las versiones vigentes publicadas por la SEC.</p>' +
      '<div class="pb"></div>' + hdr("INFORME T\xC9CNICO") + H() + memoriaHTML(s, false).replace(/<h1>[^<]*<\/h1>/, "").replace(/<p class="mm">[^<]*<\/p>/, "").replace(/<h2>(\d+)\.\s*/g, "<h3>4.$1 ").replace(/<h2>/g, "<h3>").replace(/<\/h2>/g, "</h3>") +
      H(true) + '<table><tr><th>Circ.</th><th>Destino</th><th class="n">Centros</th><th class="n">Enchufes</th><th class="n">P (W)</th><th class="n">Is (A)</th><th>Protecci\xF3n</th><th>Diferencial</th><th>Conductor</th><th class="n">Iz (A)</th><th class="n">L (m)</th><th class="n">ΔV (%)</th></tr>' + r.rows.map((x) => "<tr><td>" + x.n + "</td><td>" + esc(x.nom) + '</td><td class="n">' + x.luces + '</td><td class="n">' + x.enchufes + '</td><td class="n">' + n0(x.P) + '</td><td class="n">' + nf(x.Is, 2) + "</td><td>" + x.In + " A curva " + x.cv + "</td><td>" + x.dr + "</td><td>" + sStr(x.S) + ' mm\xB2</td><td class="n">' + x.Iz + '</td><td class="n">' + n1(x.L) + '</td><td class="n">' + nf(x.dv, 2) + "</td></tr>").join("") + '<tr class="tot"><td colspan="4">Total</td><td class="n">' + n0(r.Pi) + '</td><td colspan="7">Demanda (RIC N\xB003): ' + n0(r.Pd) + " W \xB7 " + nf(r.Id, 1) + " A \xB7 ΔV alimentador " + nf(r.dva, 2) + " %</td></tr></table>" +
      "<p>Criterios de dise\xF1o: In ≥ 1,1 \xD7 Is; Iz ≥ In; ca\xEDda de tensi\xF3n m\xE1xima 3 % en el alimentador y 5 % total; secci\xF3n m\xEDnima 1,5 mm\xB2 en alumbrado y 2,5 mm\xB2 en enchufes.</p>" +
      H() + "<table><tr><th style=\"width:22%\">Partida</th><th>Especificaci\xF3n</th></tr>" + spec.map(([a, b]) => "<tr><td><b>" + a + "</b></td><td>" + b + "</td></tr>").join("") + '</table><p class="small">Todos los materiales deben contar con certificaci\xF3n SEC.</p>' +
      H(true) + '<table><tr><th>\xCDtem</th><th>Descripci\xF3n</th><th class="n">Cant.</th><th>Un.</th><th class="n">P. unitario</th><th class="n">Total</th></tr>' + mat.map((b, i) => "<tr><td>" + (i + 1) + "</td><td>" + esc(b.d) + '</td><td class="n">' + b.q + "</td><td>" + b.u + '</td><td class="n">' + clp(b.pu) + '</td><td class="n">' + clp(b.st) + "</td></tr>").join("") + '<tr class="tot"><td colspan="5">Total materiales (neto)</td><td class="n">' + clp(Bg.mat) + "</td></tr></table>" +
      H() + '<table><tr><th>Partida</th><th class="n">Monto</th></tr><tr><td>1. Materiales</td><td class="n">' + clp(Bg.mat) + "</td></tr><tr><td>2. Mano de obra " + (inf.mo === "pt" ? "(por punto)" : "(" + nf(P.HH, 1) + " HH \xD7 " + clp(+inf.vhh) + ")") + '</td><td class="n">' + clp(Bg.lab) + "</td></tr><tr><td>3. Gastos generales (" + inf.gg + ' % de 1+2)</td><td class="n">' + clp(Bg.gg) + "</td></tr><tr><td>4. Utilidades (" + inf.ut + ' %)</td><td class="n">' + clp(Bg.ut) + '</td></tr><tr class="tot"><td>Total neto</td><td class="n">' + clp(Bg.net) + '</td></tr><tr><td>IVA (19 %)</td><td class="n">' + clp(Bg.iva) + '</td></tr><tr class="tot"><td>Total</td><td class="n">' + clp(Bg.tot) + '</td></tr></table><p class="small">Precios en pesos chilenos, referenciales de mercado minorista. Validez de la oferta: 15 d\xEDas. Forma de pago y anticipo seg\xFAn acuerdo con el mandante.</p>' +
      H(true) + '<div class="gw">' + ganttSVG(P, inf, true) + '</div><table><tr><th>N\xB0</th><th>Actividad</th><th class="n">HH</th><th class="n">Dotaci\xF3n</th><th>Inicio</th><th>T\xE9rmino</th></tr>' + P.T.map((x, i) => "<tr><td>" + (i + 1) + "</td><td>" + esc(x.n) + '</td><td class="n">' + nf(x.h, 1) + '</td><td class="n">' + x.w2 + "</td><td>" + fDate(D[Math.min(D.length - 1, Math.floor(x.st / P.hd + 1e-9))]) + "</td><td>" + fDate(D[Math.min(D.length - 1, Math.max(0, Math.ceil(x.en / P.hd - 1e-9) - 1))]) + "</td></tr>").join("") + '<tr class="tot"><td colspan="2">Total</td><td class="n">' + nf(P.HH, 1) + '</td><td class="n">' + P.N + "</td><td>" + fDate(D0) + "</td><td>" + fDate(D1) + "</td></tr></table>" +
      H() + "<table><tr><th>N\xB0</th><th style=\"width:32%\">Actividad</th><th>Instrucci\xF3n</th></tr>" + P.T.map((x, i) => "<tr><td>" + (i + 1) + "</td><td>" + esc(x.n) + "</td><td>" + esc(x.w) + "</td></tr>").join("") + "</table><h3>Puntos por recinto</h3><table><tr><th>Recinto</th><th>Puntos (circuito)</th></tr>" + ROOMS.map((rm) => {
        const L = s.items.filter((i) => itemRoom(i) === rm);
        return L.length ? "<tr><td>" + esc(rm.n) + "</td><td>" + L.map((i) => esc(i.name) + (varOf(i) ? " (" + varOf(i)[1] + ")" : "") + " – C" + (cIdx(s, i.c) + 1)).join("; ") + "</td></tr>" : "";
      }).join("") + "</table><h3>Seguridad</h3><p>" + EJEC_SEG.join(". ") + ".</p>" +
      H(true) + '<table><tr><th>Ensayo</th><th>Criterio de aceptaci\xF3n</th><th>Resultado</th><th style="width:16%">V\xB0B\xB0</th></tr>' + ens.map(([a, b, c]) => "<tr><td>" + a + "</td><td>" + b + "</td><td>" + (c || "") + "</td><td></td></tr>").join("") + "</table><h3>Procedimiento de puesta en servicio</h3><table><tr><th>N\xB0</th><th>Verificaci\xF3n</th><th style=\"width:16%\">V\xB0B\xB0</th></tr>" + PSE.map(([id, t], i) => "<tr><td>" + (i + 1) + "</td><td>" + t + "</td><td>" + (E.pse && E.pse[id] ? "Conforme" : "") + "</td></tr>").join("") + "</table>" +
      H(true) + infTE1(s, inf).replace('<div class="firm"><div>Firma instalador</div><div>Firma propietario</div></div>', "") +
      H() + (r.errs.length ? "<table><tr><th>N\xB0</th><th>Observaci\xF3n</th><th>Detalle</th></tr>" + r.errs.map((o, i) => "<tr><td>" + (i + 1) + "</td><td>" + esc(o.t) + "</td><td>" + esc(o.d) + "</td></tr>").join("") + "</table>" : "<p>Sin observaciones pendientes en la revisi\xF3n del proyecto.</p>") +
      '<div class="sig"><div>Instalador responsable<br>' + esc(inf.inst || "") + '</div><div>Propietario / mandante<br>' + esc(inf.prop || "") + "</div><div>Recepci\xF3n conforme<br>Fecha</div></div>" +
      '<h2 class="pb">Anexo A. L\xE1mina del proyecto</h2><div class="lam">' + laminaSVG(s) + (NFL > 1 ? '</div><div class="lam pb">' + laminaSVG(s, false, 1) : "") + '</div><h2 class="pb">Anexo B. Plano de planta y canalizaciones</h2>' + planSVG(s) + "<h2>Anexo C. Diagrama unilineal del tablero</h2>" + simConnSVG(s);
    return head("Informe t\xE9cnico") + body + "</body></html>";
  }
  function infSection(s, part) {
    const inf = infGet(), P = infPlan(s, inf), Bg = infBudget(s, inf, P), miss = infMissing(inf), D = infDates(inf, Math.max(1, P.days));
    const f = (k, l, ph, t) => '<div class="field"><label>' + l + '</label><input type="' + (t || "text") + '" data-inf="' + k + '" value="' + esc(inf[k]) + '" placeholder="' + esc(ph || "") + '"></div>';
    const sel = (k, l, o) => '<div class="field"><label>' + l + '</label><select data-inf="' + k + '">' + o.map(([v, t]) => '<option value="' + v + '"' + ((k === "sab" ? inf.sab ? "1" : "" : String(inf[k])) === String(v) ? " selected" : "") + ">" + t + "</option>").join("") + "</select></div>";
    const crew = '<div class="chips" role="group" aria-label="Instaladores"><span class="hint" style="align-self:center">Instaladores:</span>' + [1, 2, 3, 4, 5, 6].map((v) => '<button type="button" class="chip' + (+inf.n === v ? " on" : "") + '" data-ia="n" data-v="' + v + '">' + v + "</button>").join("") + "</div>";
    const SG = '<section class="card rep-s"><div class="sechead"><h2 style="margin:0">' + (part ? "" : "6 \xB7 ") + 'Programa de obra (Carta Gantt)</h2></div>' + crew + '<div class="grid sg">' + f("ini", "Fecha de inicio", "", "date") + sel("hd", "Horas por jornada", [[6, "6 h"], [8, "8 h"], [9, "9 h"], [10, "10 h"]]) + sel("sab", "S\xE1bados", [["", "No se trabaja"], ["1", "Se trabaja"]]) + "</div>" + kpis([kpi("Horas-hombre", nf(P.HH, 1), "HH"), kpi("Plazo", P.days, "d\xEDas h\xE1biles"), kpi("Inicio", fDate(D[0])), kpi("Entrega", fDate(D[D.length - 1]), "", "ok")]) + '<div class="gw">' + ganttSVG(P, inf) + '</div><p class="hint">Rendimientos referenciales por actividad (tubo, cajas, cable, aparatos, pruebas), calculados con las cantidades del simulador. Cada actividad usa como m\xE1ximo las personas que pueden trabajar en ella a la vez; las l\xEDneas punteadas son dependencias.</p></section>';
    const SB = '<section class="card rep-s"><h2>' + (part ? "" : "7 \xB7 ") + 'Presupuesto</h2><div class="grid sg">' + sel("mo", "Mano de obra", [["hh", "Por horas-hombre (Gantt)"], ["pt", "Por punto (tabla de precios)"]]) + (inf.mo === "pt" ? "" : f("vhh", "Valor hora-hombre ($)", "9000", "number")) + f("gg", "Gastos generales (%)", "10", "number") + f("ut", "Utilidad (%)", "15", "number") + '</div><div class="tbl-wrap"><table class="pt bom"><tbody><tr><td>Materiales</td><td class="num">' + clp(Bg.mat) + "</td></tr><tr><td>Mano de obra " + (inf.mo === "pt" ? "por punto" : nf(P.HH, 1) + " HH \xD7 " + clp(+inf.vhh)) + '</td><td class="num">' + clp(Bg.lab) + "</td></tr><tr><td>Gastos generales " + inf.gg + ' %</td><td class="num">' + clp(Bg.gg) + "</td></tr><tr><td>Utilidad " + inf.ut + ' %</td><td class="num">' + clp(Bg.ut) + '</td></tr></tbody><tfoot><tr><td>Neto</td><td class="num">' + clp(Bg.net) + '</td></tr><tr><td>IVA 19 %</td><td class="num">' + clp(Bg.iva) + '</td></tr><tr class="tot"><td><b>Total</b></td><td class="num"><b>' + clp(Bg.tot) + "</b></td></tr></tfoot></table></div></section>";
    const SD = '<section class="card rep-s"><div class="sechead"><h2 style="margin:0">' + (part ? "" : "8 \xB7 ") + 'Informe t\xE9cnico y TE1</h2></div><p class="hint">Estos datos aparecen en el informe y en el borrador TE1. Se guardan con el proyecto.</p><h3>Propietario e instalaci\xF3n</h3><div class="grid sg">' + f("prop", "Propietario", "Nombre completo") + f("rut", "RUT propietario", "12.345.678-9") + f("dir", "Direcci\xF3n", "Calle y n\xFAmero") + f("comuna", "Comuna") + f("region", "Regi\xF3n") + f("rol", "Rol de aval\xFAo", "Opcional") + sel("tipo", "Tipo de declaraci\xF3n", Object.entries(INF_TIPO)) + f("dist", "Distribuidora", "Ej.: empresa local") + f("cliente", "N\xB0 cliente / medidor", "Opcional") + '</div><h3>Instalador</h3><div class="grid sg">' + f("inst", "Nombre") + f("instRut", "RUT") + sel("clase", "Clase de licencia", [["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"]]) + f("lic", "N\xB0 licencia SEC") + f("fono", "Tel\xE9fono") + f("mail", "Correo", "", "email") + "</div>" + (miss.length ? note("Falta para el TE1: " + miss.join(", ") + ".", "warn") : note("✓ Datos completos para el borrador TE1.", "ok")) + '<div class="rep-act no-print"><button class="btn" type="button" data-ia="dinf">⬇ Informe t\xE9cnico completo</button><button class="btn" type="button" data-ia="dte1">⬇ Borrador TE1</button><button class="btn ghost" type="button" data-ia="pinf">\u{1F5A8} Ver e imprimir informe</button><span class="hint" id="imsg"></span></div><details class="memd"><summary class="no-print">Vista previa del borrador TE1</summary>' + infTE1(s, inf) + "</details>" + learn("Qu\xE9 incluye cada documento", '<ul class="hand"><li><b>Informe t\xE9cnico</b> (propietario, SEC e instaladores): portada, resumen, presupuesto, carta Gantt, plano, unilineal, cuadro de cargas, materiales, hoja de trabajo por recinto, datos TE1, memoria explicativa y observaciones.</li><li><b>Borrador TE1</b>: los datos que pide la declaraci\xF3n (propietario, ubicaci\xF3n, empalme, instalador, caracter\xEDsticas t\xE9cnicas, circuitos, ensayos y anexos) con el plano y el unilineal. La declaraci\xF3n se presenta en l\xEDnea ante la SEC, firmada por un instalador autorizado.</li><li>Los archivos son p\xE1ginas HTML: \xE1brelos en el navegador y usa Imprimir → Guardar como PDF, o \xE1brelos con Word.</li></ul>') + "</section>";
    return part === "g" ? SG : part === "b" ? SB : part === "d" ? SD : SG + SB + SD;
  }
  document.addEventListener("click", (e) => {
    if (!["rep", "e4", "e7"].includes(cur)) return;
    const b = e.target.closest && e.target.closest("[data-ia]");
    if (!b || !S.sim2) return;
    const a = b.dataset.ia, inf = infGet(), m = document.getElementById("imsg");
    if (a === "n") {
      inf.n = +b.dataset.v;
      save();
      render(true);
      return;
    }
    if (a === "dinf" || a === "dte1") {
      const te = a === "dte1";
      dlFile(te ? "antecedentes-TE1.html" : "informe-tecnico.html", new Blob([infDoc(S.sim2, te ? "te1" : "inf")], { type: "text/html" })).then((rr) => {
        if (m) m.textContent = dlMsg(rr, te ? "Borrador TE1 descargado." : "Informe descargado: \xE1brelo en el navegador e impr\xEDmelo como PDF.");
      });
      return;
    }
    if (a === "pinf") {
      const w = window.open("", "_blank");
      if (w && w.document) {
        w.document.open();
        w.document.write(infDoc(S.sim2, "inf"));
        w.document.close();
        setTimeout(() => {
          try {
            w.print();
          } catch (err) {
          }
        }, 500);
      } else if (m) m.textContent = "El navegador bloque\xF3 la ventana: usa \xAB⬇ Informe t\xE9cnico completo\xBB.";
    }
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (!["rep", "e4", "e7"].includes(cur) || !el || !el.dataset || !el.dataset.inf) return;
    const inf = infGet(), k = el.dataset.inf;
    inf[k] = ["n", "hd", "vhh", "gg", "ut"].includes(k) ? Math.max(0, +el.value || 0) : k === "sab" ? !!el.value : el.value.slice(0, 120);
    save();
    if (["ini", "hd", "sab", "vhh", "gg", "ut", "mo"].includes(k)) render(true);
  });
  function laminaSVG(s, standalone, fl) {
    const LF = NFL > 1 ? fl || 0 : -1, onF = (f) => LF < 0 || f === LF, inf = infGet(), E = etGet(), r = simReport(s), ev = r.ev, tri = s.sys === "tri", hoy = (/* @__PURE__ */ new Date()).toLocaleDateString("es-CL"), nm = S.proj && S.proj.nombre || HNAME || "Casa habitaci\xF3n";
    const F = "font-family:Arial,Helvetica,sans-serif";
    const T = (x, y, t, z, a, w, c) => '<text x="' + x.toFixed(2) + '" y="' + y.toFixed(2) + '" font-size="' + (z || 2.4) + '" text-anchor="' + (a || "start") + '" font-weight="' + (w || 400) + '" fill="' + (c || "#111") + '">' + esc(String(t)) + "</text>";
    const R = (x, y, w, h, sw, f) => '<rect x="' + x.toFixed(2) + '" y="' + y.toFixed(2) + '" width="' + w.toFixed(2) + '" height="' + h.toFixed(2) + '" fill="' + (f || "none") + '" stroke="#111" stroke-width="' + (sw || 0.25) + '"/>';
    const Ln = (x1, y1, x2, y2, sw, da) => '<line x1="' + x1.toFixed(2) + '" y1="' + y1.toFixed(2) + '" x2="' + x2.toFixed(2) + '" y2="' + y2.toFixed(2) + '" stroke="#111" stroke-width="' + (sw || 0.25) + '"' + (da ? ' stroke-dasharray="' + da + '"' : "") + "/>";
    let g = '<rect width="420" height="297" fill="#fff"/>' + R(5, 5, 410, 287, 0.7) + R(7, 7, 406, 283, 0.25);
    const by = new Map(s.items.map((i) => [i.id, i]));
    const plan = (ox, oy, w, h, kind, title) => {
      const k = Math.min((w - 6) / HW, (h - 16) / HD), X = (x) => ox + 3 + x * k, Z = (z) => oy + 3 + z * k;
      let p = "";
      ROOMS.forEach((rm) => {
        if (!onF(rm.f || 0)) return;
        p += T(X(rm.x0) + 1.2, Z(rm.z0) + 3.2, rm.n.toUpperCase(), 1.9, "start", 700, "#333");
        if (rm.t === "escalera") {
          const sp = stairPlanSVG(rm, X, Z, "#111", 0.12, LF === 1);
          p += sp.svg + T(X(sp.top[0]), Z(sp.top[1]) - 1.2, LF === 1 ? "BAJA" : "SUBE", 1.5, "middle", 700);
        }
      });
      WALLS.forEach((wl) => {
        if (onF(wl.f || 0)) p += Ln(X(wl[0]), Z(wl[1]), X(wl[2]), Z(wl[3]), Math.max(0.9, (wl[4] || 0.15) * k * 0.9));
      });
      DOORS.forEach(([ax, v, m0, m1, df]) => {
        if (!onF(df || 0)) return;
        const L = (m1 - m0) * k;
        p += ax === "x" ? '<path d="M' + X(v).toFixed(2) + " " + Z(m0).toFixed(2) + " A " + L.toFixed(2) + " " + L.toFixed(2) + " 0 0 1 " + (X(v) + L).toFixed(2) + " " + (Z(m0) + L).toFixed(2) + '" fill="none" stroke="#777" stroke-width="0.18"/>' : '<path d="M' + X(m0).toFixed(2) + " " + Z(v).toFixed(2) + " A " + L.toFixed(2) + " " + L.toFixed(2) + " 0 0 0 " + (X(m0) + L).toFixed(2) + " " + (Z(v) + L).toFixed(2) + '" fill="none" stroke="#777" stroke-width="0.18"/>';
      });
      const isL = (it) => it.t === "lamp" || it.t === "sw", sub = (it) => [...descend(s, it.id)].map((id) => by.get(id)).filter(Boolean), want = (it) => kind === "L" ? isL(it) || it.t === "box" && sub(it).some(isL) : !isL(it) && (it.t !== "box" || sub(it).some((x) => !isL(x) && x.t !== "box"));
      const MX = TX + tabW(s) / 2 + 0.4, MZ = 0.25;
      let mont = false;
      ev.E.forEach((e) => {
        if (!want(e.it)) return;
        const a0 = e.from != null ? by.get(e.from) : null, fi = flY(e.it.p[1]), fa = a0 ? flY(a0.p[1]) : 0;
        if (!onF(fi)) {
          if (LF >= 0 && fa === LF) mont = true;
          return;
        }
        const xf = LF >= 0 && fa !== fi;
        if (xf) mont = true;
        const a = xf ? null : a0, x1 = a ? a.p[0] : xf ? MX : TX, z1 = a ? a.p[2] : xf ? MZ : 0.2, x2 = e.it.p[0], z2 = e.it.p[2], mx = (X(x1) + X(x2)) / 2, mz = (Z(z1) + Z(z2)) / 2, dx = X(x2) - X(x1), dz = Z(z2) - Z(z1), L = Math.hypot(dx, dz) || 1, cx = mx - dz / L * L * 0.18, cz = mz + dx / L * L * 0.18;
        p += '<path d="M' + X(x1).toFixed(2) + " " + Z(z1).toFixed(2) + " Q" + cx.toFixed(2) + " " + cz.toFixed(2) + " " + X(x2).toFixed(2) + " " + Z(z2).toFixed(2) + '" fill="none" stroke="#111" stroke-width="0.22"/>';
        const tx = 0.25 * X(x1) + 0.5 * cx + 0.25 * X(x2), tz = 0.25 * Z(z1) + 0.5 * cz + 0.25 * Z(z2), ux = dx / L, uz = dz / L;
        e.cond.forEach((q, j) => {
          const o = (j - (e.cond.length - 1) / 2) * 0.7;
          p += Ln(tx + ux * o - uz * 0.8 + ux * 0.4, tz + uz * o + ux * 0.8 + uz * 0.4, tx + ux * o + uz * 0.8 - ux * 0.4, tz + uz * o - ux * 0.8 - uz * 0.4, 0.18);
        });
      });
      s.items.forEach((it) => {
        if (!onF(flY(it.p[1]))) return;
        if (it.t === "box") {
          if (!want(it)) return;
          p += '<g transform="translate(' + X(it.p[0]).toFixed(2) + " " + Z(it.p[2]).toFixed(2) + ') scale(0.22)"><rect x="-6" y="-6" width="12" height="12" fill="#fff" stroke="#111" stroke-width="1.6"/><line x1="-6" y1="-6" x2="6" y2="6" stroke="#111" stroke-width="1.2"/></g>';
          return;
        }
        if (kind === "L" ? !isL(it) : isL(it)) return;
        const n = it.n || [0, 0, 1], ang = Math.atan2(n[2], n[0]) * 180 / Math.PI;
        if (it.t === "horno") p += '<g transform="translate(' + X(it.p[0]).toFixed(2) + " " + Z(it.p[2]).toFixed(2) + ") rotate(" + ang + ') scale(0.22)">' + varSym("out", "f", "#111") + "</g>";
        else p += '<g transform="translate(' + X(it.p[0]).toFixed(2) + " " + Z(it.p[2]).toFixed(2) + ")" + (it.t === "out" ? " rotate(" + ang + ")" : "") + ' scale(0.22)">' + varSym(it.t, it.v || "s", "#111") + "</g>";
      });
      if (LF < 1) p += '<rect x="' + (X(TX) - 0.45 * k).toFixed(2) + '" y="' + (Z(0) + 0.3).toFixed(2) + '" width="' + (0.9 * k).toFixed(2) + '" height="1.6" fill="#111"/>' + T(X(TX), Z(0) + 4.3, "T.D.A.", 1.7, "middle", 700);
      if (mont) p += R(X(MX) - 0.9, Z(MZ) - 0.9, 1.8, 1.8, 0.3, "#fff") + Ln(X(MX) - 0.9, Z(MZ) + 0.9, X(MX) + 0.9, Z(MZ) - 0.9, 0.2) + T(X(MX) + 1.4, Z(MZ) + 3.4, LF ? "MONTANTE (DESDE T.D.A.)" : "MONTANTE AL 2.\xBA PISO", 1.4, "start", 700);
      const yt = Z(HD) + 8;
      p += T(ox + w / 2, yt, title + (LF >= 0 ? (LF ? " \xB7 2.\xBA PISO" : " \xB7 1.ER PISO") : ""), 3, "middle", 700) + Ln(ox + w / 2 - 28, yt + 1, ox + w / 2 + 28, yt + 1, 0.3) + T(ox + w / 2, yt + 4, "ESC. 1:" + Math.round(1e3 / k / 10) * 10 + " (aprox.)", 1.8, "middle");
      return p;
    };
    const kP = Math.min(126 / HW, 134 / HD), yB = Math.min(172, 10 + 3 + HD * kP + 26);
    g += plan(10, 10, 132, 150, "E", "PLANTA DE ENCHUFES") + plan(146, 10, 132, 150, "L", "PLANTA DE ILUMINACI\xD3N");
    g += T(12, yB - 6, "NOTA: TODOS LOS MATERIALES A UTILIZAR DEBEN CONTAR CON CERTIFICACI\xD3N SEC PARA SU USO Y COMERCIALIZACI\xD3N.", 2.2, "start", 700);
    {
      const x0 = 10, y0 = yB, cols = [["CIRC.", 11], ["CENTROS", 13], ["ENCH.", 11], ["FUERZA", 12], ["POT. (W)", 15], ["FASE", 10], ["PROTECCI\xD3N", 24], ["DIFERENCIAL", 22], ["CONDUCTOR", 20], ["DUCTO", 22], ["L (m)", 12], ["ΔV %", 12]], W2 = cols.reduce((a, c) => a + c[1], 0), rh = 4.6;
      g += T(x0 + W2 / 2, y0 + 3, "CUADRO DE CARGA", 3, "middle", 700) + R(x0, y0 + 5, W2, rh * (r.rows.length + 2), 0.35);
      let cx = x0;
      cols.forEach(([h, w2]) => {
        g += T(cx + w2 / 2, y0 + 5 + 3.2, h, 1.8, "middle", 700) + Ln(cx, y0 + 5, cx, y0 + 5 + rh * (r.rows.length + 2));
        cx += w2;
      });
      const pvc = { pvc: "CONDUIT", emt: "EMT", flex: "CORRUG." }[s.duct || "pvc"];
      [...r.rows, null].forEach((x, i) => {
        const y = y0 + 5 + rh * (i + 1);
        g += Ln(x0, y, x0 + W2, y, i ? 0.15 : 0.3);
        const v = x ? (() => {
          const c = s.circuits[i], its = s.items.filter((q) => q.c === c.id), fz = its.filter((q) => q.t === "horno").length, d = ev.E.some((e) => e.cid === c.id && (+e.S >= 4 || e.cond.length > 3)) ? 20 : 16;
          return [x.n, x.luces, its.filter((q) => q.t === "out").length, fz, n0(x.P), tri ? c.ph || "R" : "R", x.In + " A " + x.cv + " " + x.pc + " kA", x.dr, sStr(x.S) + " mm\xB2", d + " mm " + pvc, n1(x.L), nf(x.dv, 2)];
        })() : ["TOTAL", r.rows.reduce((a, q) => a + q.luces, 0), s.items.filter((q) => q.t === "out").length, s.items.filter((q) => q.t === "horno").length, n0(r.Pi), "", "", "", "", "", "", ""];
        let cx2 = x0;
        v.forEach((t, j) => {
          g += T(cx2 + cols[j][1] / 2, y + 3.3, t, 1.9, "middle", x ? 400 : 700);
          cx2 += cols[j][1];
        });
      });
      const y1 = y0 + 5 + rh * (r.rows.length + 2) + 6, cols2 = [["ALIMENTADOR", 26], ["P. INST. (kW)", 20], ["DEMANDA (kW)", 20], ["I (A)", 13], ["CONDUCTOR", 26], ["DUCTO", 20], ["L (m)", 12], ["ΔV (V)", 14], ["ΔV %", 13], ["PROTECCI\xD3N", 20]], W3 = cols2.reduce((a, c) => a + c[1], 0), a2 = +s.alim.L || 0, Sa = +s.alim.S || 6, dV = ev.dVap;
      g += T(x0 + W3 / 2, y1, "CUADRO RESUMEN DE ALIMENTADORES", 3, "middle", 700) + R(x0, y1 + 2, W3, rh * 2, 0.35) + Ln(x0, y1 + 2 + rh, x0 + W3, y1 + 2 + rh, 0.3);
      let cx3 = x0;
      const vv = ["T.D.A.", nf(r.Pi / 1e3, 2), nf(r.Pd / 1e3, 2), nf(r.Id, 1), (tri ? "4" : "2") + "\xD7" + sStr(Sa) + " mm\xB2 Cu", (Sa >= 10 ? 32 : 25) + " mm PVC", n1(a2), nf(dV, 2), nf(dV / V0 * 100, 2), s.gen.In + " A " + (tri ? "4P" : "2P")];
      cols2.forEach(([h, w2], j) => {
        g += T(cx3 + w2 / 2, y1 + 5.2, h, 1.8, "middle", 700) + T(cx3 + w2 / 2, y1 + 2 + rh + 3.3, vv[j], 1.9, "middle") + (j ? Ln(cx3, y1 + 2, cx3, y1 + 2 + rh * 2) : "");
        cx3 += w2;
      });
      const y2 = y1 + 2 + rh * 2 + 6;
      g += T(x0, y2, "C\xC1LCULO DE CA\xCDDA DE TENSI\xD3N (ALIMENTADOR)", 2.3, "start", 700) + T(x0, y2 + 4.5, "ΔV = " + (tri ? "√3" : "2") + " \xB7 L \xB7 I \xB7 ρ / S", 2.2) + T(x0, y2 + 8.8, "ΔV = " + (tri ? "1,73" : "2") + " \xD7 " + n1(a2) + " \xD7 " + nf(r.Id, 1) + " \xD7 0,018 / " + sStr(Sa) + " = " + nf(dV, 2) + " V  (" + nf(dV / V0 * 100, 2) + " % ≤ 3 %)", 2.2) + T(x0, y2 + 13.1, "Demanda seg\xFAn RIC N\xB003: P.dem = 3.000 W + 35 % del exceso sobre 3.000 W.", 2);
      const NOT = ["La instalaci\xF3n se ejecutar\xE1 seg\xFAn los pliegos t\xE9cnicos RIC de la SEC vigentes.", "Canalizaci\xF3n " + (s.inst === "vista" ? "a la vista" : "embutida") + " en tubo " + ({ pvc: "conduit PVC", emt: "met\xE1lico EMT", flex: "corrugado" }[s.duct || "pvc"]) + " \xD8 16/20 mm; m\xE1ximo 3 curvas entre cajas.", "Conductores de cobre; colores (RIC N\xB004, 5.32): fase azul, negro o rojo; neutro blanco; protecci\xF3n verde o verde/amarillo.", "Alturas de montaje sobre N.P.T.: interruptores 1,10 m; enchufes 0,30 m (cocina 1,10 m).", "Todos los circuitos de alumbrado y enchufes protegidos con diferencial de 30 mA.", "Empalmes solo dentro de cajas accesibles, con conectores certificados.", "T.D.A. con barras de neutro y tierra independientes, rotulado y con se\xF1al de riesgo el\xE9ctrico."];
      if (y2 + 20 + NOT.length * 4.2 < 290) {
        g += T(x0, y2 + 21, "NOTAS GENERALES", 2.3, "start", 700);
        NOT.forEach((t, i) => g += T(x0, y2 + 25.5 + i * 4.2, i + 1 + ". " + t, 1.9));
      }
    }
    {
      const x0 = 210, y0 = yB - 2, items = [["lamp", "s", "Centro de luz"]].concat(VAR.lamp.slice(1).filter((v) => s.items.some((i) => i.t === "lamp" && i.v === v[0])).map((v) => ["lamp", v[0], v[2]]), VAR.sw.filter((v) => v[0] === "s" || s.items.some((i) => i.t === "sw" && i.v === v[0])).map((v) => ["sw", v[0], v[2]]), VAR.out.filter((v) => v[0] === "s" || s.items.some((i) => i.t === "out" && i.v === v[0])).map((v) => ["out", v[0], v[2]]));
      const rows = items.length + 5, rh = 5.6, w = 66;
      g += R(x0, y0, w, 6 + rows * rh, 0.35) + T(x0 + w / 2, y0 + 4.4, "SIMBOLOG\xCDA GENERAL", 2.6, "middle", 700) + Ln(x0, y0 + 6, x0 + w, y0 + 6, 0.3) + Ln(x0 + 12, y0 + 6, x0 + 12, y0 + 6 + rows * rh);
      let y = y0 + 6;
      const row = (sym, t) => {
        g += '<g transform="translate(' + (x0 + 6) + " " + (y + rh / 2) + ') scale(0.24)">' + sym + "</g>" + T(x0 + 14, y + rh / 2 + 0.8, t.replace(/ \(.*\)$/, "").toUpperCase(), 1.65) + Ln(x0, y + rh, x0 + w, y + rh, 0.12);
        y += rh;
      };
      items.forEach(([t, v, n2]) => row(varSym(t, v, "#111"), n2));
      row('<rect x="-6" y="-6" width="12" height="12" fill="#fff" stroke="#111" stroke-width="1.6"/><line x1="-6" y1="-6" x2="6" y2="6" stroke="#111" stroke-width="1.2"/>', "Caja de derivaci\xF3n");
      row('<rect x="-10" y="-4" width="20" height="8" fill="#111"/>', "Tablero de distribuci\xF3n (T.D.A.)");
      row('<circle r="7" fill="#fff" stroke="#111" stroke-width="1.6"/><text y="2.5" font-size="6" text-anchor="middle" font-weight="700">kWh</text>', "Medidor de energ\xEDa");
      row('<path d="M-12 -4 Q0 6 12 -4" fill="none" stroke="#111" stroke-width="1.2"/><line x1="-2" y1="-2" x2="2" y2="4" stroke="#111" stroke-width="1"/><line x1="1" y1="-2" x2="5" y2="4" stroke="#111" stroke-width="1"/>', "Canalizaci\xF3n embutida y N\xB0 de conductores");
      row('<line x1="0" y1="-8" x2="0" y2="0" stroke="#111" stroke-width="1.4"/><line x1="-8" y1="0" x2="8" y2="0" stroke="#111" stroke-width="1.4"/><line x1="-5" y1="3" x2="5" y2="3" stroke="#111" stroke-width="1.4"/><line x1="-2" y1="6" x2="2" y2="6" stroke="#111" stroke-width="1.4"/>', "Puesta a tierra");
    }
    {
      const x0 = 282, y0 = 10;
      g += T(x0 + 64, y0 + 4, "DETALLE DE CONEXI\xD3N \xB7 C\xC1MARA DE INSPECCI\xD3N", 2.6, "middle", 700) + T(x0 + 64, y0 + 7.5, "ESC. 1:10", 1.9, "middle");
      const gx = x0 + 30, gy = y0 + 22;
      g += Ln(x0 + 4, gy, x0 + 124, gy, 0.4) + '<path d="M' + (x0 + 4) + " " + gy + "h120" + '" stroke="#111" stroke-width="0.4" stroke-dasharray="2 1.2"/>';
      for (let i = 0; i < 24; i++) g += Ln(x0 + 6 + i * 5, gy + 0.2, x0 + 4 + i * 5, gy + 2.2, 0.15);
      g += R(gx, gy - 1.5, 24, 1.5, 0.3, "#d9d9d9") + R(gx - 2, gy, 2, 22, 0.3, "#bdbdbd") + R(gx + 24, gy, 2, 22, 0.3, "#bdbdbd") + R(gx + 10.5, gy + 4, 3, 44, 0.3, "#c87533");
      g += '<path d="M' + (x0 + 4) + " " + (gy + 9) + " L" + (gx + 12) + " " + (gy + 9) + " L" + (gx + 12) + " " + (gy + 6) + '" fill="none" stroke="#2e7d32" stroke-width="0.7"/>' + R(gx + 10, gy + 5, 4, 2.4, 0.3, "#888");
      const lab = (y, t, x2) => g += Ln(gx + 28, y, x0 + 70, y, 0.15) + T(x0 + 71, y + 0.7, t, 1.75) + (x2 ? Ln(x2, y, gx + 28, y, 0.15) : "");
      lab(gy - 0.8, "Tapa de registro", gx + 22);
      lab(gy + 6, "Conector bronce para barra 5/8\"", gx + 14);
      lab(gy + 14, "C\xE1mara de inspecci\xF3n (PVC u hormig\xF3n)", gx + 26);
      lab(gy + 26, "Barra Copperweld 5/8\" \xD7 1,5 m", gx + 13.5);
      lab(gy + 40, "Relleno de tierra vegetal compactada", null);
      g += T(x0 + 4, gy + 7.6, "Conductor de protecci\xF3n desde barra PE del T.D.A.", 1.7) + T(x0 + 4, gy + 54, "Resistencia de puesta a tierra de servicio ≤ 20 Ω (RIC N\xB006)", 2.1, "start", 700);
      const Rm = +(S.tierra || {}).Rserv > 0 ? +(S.tierra || {}).Rserv : 0;
      if (Rm) g += T(x0 + 4, gy + 57.5, "Valor medido: " + nf(Rm, 1) + " Ω", 2);
    }
    {
      const x0 = 282, y0 = 92, w = 128, drs = simDRs(s);
      g += T(x0 + w / 2, y0, "DIAGRAMA UNILINEAL", 2.8, "middle", 700) + R(x0, y0 + 2, w, 98, 0.25);
      const ex = x0 + 12, ey = y0 + 8;
      g += R(ex - 5, ey, 10, 9, 0.35) + T(ex, ey + 6.6, "E", 4.5, "middle", 700) + T(ex + 7, ey + 4, "EMPALME " + (tri ? "TRIF\xC1SICO" : "MONOF\xC1SICO"), 1.8) + T(ex + 7, ey + 7, inf.dist || "Distribuidora", 1.7);
      g += '<circle cx="' + ex + '" cy="' + (ey + 16) + '" r="3.2" fill="#fff" stroke="#111" stroke-width="0.35"/>' + T(ex, ey + 16.8, "kWh", 1.6, "middle", 700) + Ln(ex, ey + 9, ex, ey + 12.8, 0.35) + Ln(ex, ey + 19.2, ex, ey + 30, 0.35);
      g += T(ex + 3, ey + 25, "ALIMENTADOR " + (tri ? "4" : "2") + "\xD7" + sStr(+s.alim.S || 6) + " mm\xB2 Cu \xB7 L = " + n1(+s.alim.L || 0) + " m \xB7 ΔV " + nf(ev.dVap / V0 * 100, 2) + " %", 1.75);
      const ty = ey + 30, n = s.circuits.length, x1 = ex + 18, step = Math.min(22, (w - 30) / Math.max(1, n));
      const brk = (x, y, t1, t2) => Ln(x, y, x, y + 3, 0.35) + '<path d="M' + x + " " + (y + 3) + " l2.2 -2.6" + '" stroke="#111" stroke-width="0.35" fill="none"/>' + Ln(x, y + 5, x, y + 8, 0.35) + '<circle cx="' + x + '" cy="' + (y + 3) + '" r="0.5" fill="#111"/>' + T(x + 2.8, y + 4.5, t1, 1.55) + (t2 ? T(x + 2.8, y + 6.6, t2, 1.45, "start", 400, "#444") : "");
      g += brk(ex, ty, "GENERAL " + s.gen.In + " A", (tri ? "4P" : "2P") + " curva C") + Ln(ex, ty + 8, ex, ty + 12, 0.35) + Ln(ex, ty + 12, x1 + step * (n - 1) + 6, ty + 12, 0.5) + T(x1 + step * (n - 1) + 7, ty + 12.6, "BARRA", 1.5);
      const groups = drs.map((d) => [d, s.circuits.filter((c) => c.dr === d)]).concat(s.circuits.some((c) => c.dr === "none") ? [[null, s.circuits.filter((c) => c.dr === "none")]] : []);
      let ci = 0;
      groups.forEach(([d, cs]) => {
        const xa = x1 + step * ci, xb = x1 + step * (ci + cs.length - 1), xm = (xa + xb) / 2;
        if (d) {
          g += Ln(xm, ty + 12, xm, ty + 15, 0.35) + R(xm - 4, ty + 15, 8, 6, 0.35) + T(xm, ty + 18.4, "ΔI", 1.8, "middle", 700) + T(xm, ty + 20.3, cs[0].ds + " mA", 1.3, "middle") + Ln(xm, ty + 21, xm, ty + 24, 0.35) + Ln(xa, ty + 24, xb + 0.01, ty + 24, 0.4) + T(xm + 4.6, ty + 17, d, 1.6, "start", 700);
        }
        cs.forEach((c) => {
          const x = x1 + step * ci, yb = d ? ty + 24 : ty + 12, k = cIdx(s, c.id);
          g += Ln(x, yb, x, ty + 27, 0.35) + brk(x, ty + 27, "C" + (k + 1), c.In + "A " + c.cv) + Ln(x, ty + 35, x, ty + 48, 0.35) + '<path d="M' + (x - 1.4) + " " + (ty + 48) + " l1.4 2.4 l1.4 -2.4" + '" fill="none" stroke="#111" stroke-width="0.3"/>' + '<text transform="translate(' + (x + 1.3) + " " + (ty + 38) + ') rotate(90)" font-size="1.5">' + esc((c.n || "").slice(0, 18)) + " \xB7 " + sStr(+c.S) + " mm\xB2</text>";
          ci++;
        });
      });
      const gx = x0 + 8, gy = ty + 58;
      g += Ln(ex, ty + 12, gx, ty + 12, 0.3, "1 0.8") + Ln(gx, ty + 12, gx, gy, 0.3, "1 0.8") + Ln(gx - 3, gy, gx + 3, gy, 0.35) + Ln(gx - 2, gy + 1, gx + 2, gy + 1, 0.35) + Ln(gx - 1, gy + 2, gx + 1, gy + 2, 0.35) + T(gx + 3.5, gy + 1.2, "T.P. / T.S.", 1.6, "start", 700) + T(x0 + w - 3, y0 + 98, "T.D.A.: tablero de distribuci\xF3n de alumbrado", 1.6, "end", 400, "#444");
    }
    {
      const x0 = 282, y0 = 198;
      g += R(x0, y0, 58, 46, 0.35) + T(x0 + 29, y0 + 4, "UBICACI\xD3N", 2.4, "middle", 700) + R(x0 + 14, y0 + 10, 26, 22, 0.25, "#eee") + R(x0 + 22, y0 + 16, 10, 10, 0.35, "#111") + Ln(x0 + 3, y0 + 35, x0 + 55, y0 + 35, 0.4) + Ln(x0 + 3, y0 + 38, x0 + 55, y0 + 38, 0.4) + T(x0 + 29, y0 + 37.2, (inf.dir || "CALLE").toUpperCase().slice(0, 30), 1.6, "middle") + '<path d="M' + (x0 + 50) + " " + (y0 + 20) + " l0 -8 l-2 4 m2 -4 l2 4" + '" fill="none" stroke="#111" stroke-width="0.35"/>' + T(x0 + 50, y0 + 10.5, "N", 2.2, "middle", 700) + T(x0 + 29, y0 + 43, (inf.comuna || "").toUpperCase(), 1.7, "middle");
      g += R(x0 + 60, y0, 68, 46, 0.35) + T(x0 + 94, y0 + 4, "REGISTRO S.E.C.", 2.4, "middle", 700) + T(x0 + 63, y0 + 16, "INSCRIPCI\xD3N N\xB0:", 1.9) + Ln(x0 + 84, y0 + 16.5, x0 + 125, y0 + 16.5, 0.2) + T(x0 + 86, y0 + 15.6, E.te1num || "", 1.9) + T(x0 + 63, y0 + 26, "FECHA:", 1.9) + Ln(x0 + 74, y0 + 26.5, x0 + 125, y0 + 26.5, 0.2) + T(x0 + 63, y0 + 36, "TIMBRE:", 1.9);
      const ty = 247, tw = 128, rows = [["PROYECTO", "INSTALACI\xD3N EL\xC9CTRICA INTERIOR DE ALUMBRADO Y ENCHUFES \xB7 " + nm.toUpperCase()], ["UBICACI\xD3N", ((inf.dir || "") + (inf.comuna ? ", " + inf.comuna : "")).toUpperCase()], ["PROPIETARIO", (inf.prop || "").toUpperCase() + (inf.rut ? "  RUT " + inf.rut : "")], ["INSTALADOR", (inf.inst || "").toUpperCase() + (inf.lic ? "  LIC. SEC CLASE " + inf.clase + " N\xB0 " + inf.lic : "")]];
      g += R(x0, ty, tw, 41, 0.5);
      rows.forEach(([a, b], i) => {
        const y = ty + i * 6.5;
        g += Ln(x0, y + 6.5, x0 + tw, y + 6.5, 0.2) + T(x0 + 1.5, y + 4.3, a, 1.6, "start", 700) + T(x0 + 22, y + 4.3, b.slice(0, 82), b.length > 64 ? 1.45 : 1.75) + Ln(x0 + 20, y, x0 + 20, y + 6.5, 0.2);
      });
      const yb = ty + 26, cells = [["ESCALA", "INDICADA"], ["L\xC1MINA", LF >= 0 ? LF + 1 + " DE 2" : "1 DE 1"], ["FECHA", hoy], ["REV.", "0"], ["FIRMA INSTALADOR", ""]], cw = [18, 18, 22, 10, 60];
      let cx = x0;
      cells.forEach(([a, b], i) => {
        g += Ln(cx, yb, cx, ty + 41, 0.2) + T(cx + 1.2, yb + 3.2, a, 1.5, "start", 700) + T(cx + cw[i] / 2, yb + 10, b, 2, "middle");
        cx += cw[i];
      });
      g += T(x0 + tw - 2, ty + 39.5, "SISTEMA " + (tri ? "TRIF\xC1SICO 380/220 V" : "MONOF\xC1SICO 220 V") + " \xB7 RIC SEC", 1.5, "end", 400, "#444");
    }
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 297" width="' + (standalone ? "420mm" : "100%") + '" height="' + (standalone ? "297mm" : "auto") + '" style="' + F + '" role="img" aria-label="L\xE1mina del proyecto el\xE9ctrico">' + g + "</svg>";
    return standalone ? '<?xml version="1.0" encoding="UTF-8"?>\n' + svg : svg;
  }
  const ETAPAS = [
    ["e1", "1", "Definici\xF3n del proyecto", "Requerimientos y alcance aprobados"],
    ["p1", "2", "Levantamiento y factibilidad", "Antecedentes del inmueble y suministro"],
    ["dis", "3", "Dise\xF1o el\xE9ctrico", "Planos, c\xE1lculos y especificaciones"],
    ["e4", "4", "Presupuesto y planificaci\xF3n", "Costos y programa aprobados"],
    ["e5", "5", "Ejecuci\xF3n", "Instalaci\xF3n construida"],
    ["p8", "6", "Inspecci\xF3n y ensayos", "Registros de pruebas y correcciones"],
    ["e7", "7", "Documentaci\xF3n y declaraci\xF3n SEC", "Antecedentes finales y tr\xE1mite TE1"],
    ["e8", "8", "Puesta en servicio y entrega", "Instalaci\xF3n entregada y documentaci\xF3n final"]
  ];
  const DIS_PAGES = ["p2", "p3", "p4", "p5", "p6", "p7", "p9", "e3"];
  const REQS = [["horno", "Horno o cocina el\xE9ctrica"], ["clima", "Aire acondicionado"], ["calef", "Calefacci\xF3n el\xE9ctrica"], ["termo", "Termo el\xE9ctrico"], ["ve", "Cargador de veh\xEDculo el\xE9ctrico"], ["bomba", "Bomba de agua / riego"], ["porton", "Port\xF3n autom\xE1tico"], ["ext", "Alumbrado exterior y jard\xEDn"], ["fv", "Sistema fotovoltaico (RIC N\xB009)"], ["datos", "Red de datos / TV"]];
  const FACT = [["med", "Medidor y empalme existentes en buen estado y accesibles"], ["cap", "Capacidad del empalme suficiente para la demanda calculada"], ["tab", "Ubicaci\xF3n del tablero accesible, seca y fuera de ba\xF1os y closets"], ["ter", "Terreno apto para el electrodo de puesta a tierra"], ["rec", "Planos de arquitectura o croquis con medidas de los recintos"], ["dist", "Factibilidad de la distribuidora (si se aumenta la potencia contratada)"]];
  const EJEC_SEG = ["Trabajar sin tensi\xF3n: abrir, bloquear y rotular el general", "Verificar ausencia de tensi\xF3n con instrumento antes de intervenir", "Usar EPP: guantes diel\xE9ctricos, lentes, calzado de seguridad", "Herramientas aisladas y en buen estado", "Mantener el orden y retirar escombros al final de cada jornada"];
  const PSE = [["vis", "Inspecci\xF3n visual final: aparatos fijos, tapas puestas, cajas cerradas"], ["ens", "Ensayos de la etapa 6 aprobados y registrados"], ["ener", "Energizaci\xF3n por etapas: general → diferenciales → autom\xE1ticos uno a uno"], ["test", "Bot\xF3n de prueba de cada diferencial operado con desconexi\xF3n correcta"], ["volt", "Tensi\xF3n y polaridad verificadas en enchufes (220 V F–N, 0 V N–PE)"], ["rot", "Tablero rotulado: circuitos, diferenciales y advertencia de riesgo el\xE9ctrico"], ["asb", "Planos finales (as built) y cuadro de cargas actualizados"], ["te1", "Declaraci\xF3n TE1 ingresada y comprobante entregado"], ["inst", "Instrucciones de uso y mantenci\xF3n entregadas al propietario"], ["acta", "Acta de entrega y recepci\xF3n firmada"]];
  function etGet() {
    if (!S.et || typeof S.et !== "object") S.et = {};
    const E = S.et;
    ["def", "fac", "ejec", "pse", "ok"].forEach((k) => {
      if (!E[k] || typeof E[k] !== "object") E[k] = {};
    });
    if (!E.def.req) E.def.req = {};
    return E;
  }
  function etDone(k) {
    const E = etGet(), sim = S.sim2 && S.sim2.circuits.length;
    if (k === "e1") return !!E.ok.e1;
    if (k === "p1") return !!E.ok.p1;
    if (k === "dis") return DIS_PAGES.filter((p) => p !== "e3").every((p) => RES[p]) || !!E.ok.dis;
    if (k === "e4") return !!E.ok.e4 && sim;
    if (k === "e5") return sim && infTasks(S.sim2).every((t) => E.ejec[t.id]);
    if (k === "p8") return !!E.ok.p8 || !!RES.p8;
    if (k === "e7") return !!E.ok.e7 && !infMissing(infGet()).length;
    if (k === "e8") return PSE.every(([id]) => E.pse[id]);
    return false;
  }
  const etCk = (grp, id, lab, on, sub) => '<label class="etck"><input type="checkbox" data-et="' + grp + "." + id + '"' + (on ? " checked" : "") + "><span>" + lab + (sub ? '<small class="hint">' + sub + "</small>" : "") + "</span></label>";
  const etHead = (n, t, obj) => '<p class="eyebrow">Etapa ' + n + " de 8 \xB7 " + t + '</p><h1>' + t + '</h1><p class="lead">Objetivo de la etapa: <b>' + obj + "</b>.</p>";
  const etApprove = (k, txt) => {
    const on = !!etGet().ok[k];
    return '<div class="etok' + (on ? " on" : "") + '">' + etCk("ok", k, txt, on) + "</div>";
  };
  const etField = (path, lab, ph, t) => {
    const v = path.split(".").reduce((o, x) => o == null ? o : o[x], etGet());
    return '<div class="field"><label>' + lab + "</label>" + (t === "area" ? '<textarea data-ef="' + path + '" rows="3" placeholder="' + esc(ph || "") + '">' + esc(v || "") + "</textarea>" : '<input type="' + (t || "text") + '" data-ef="' + path + '" value="' + esc(v == null ? "" : v) + '" placeholder="' + esc(ph || "") + '">') + "</div>";
  };
  const infF = (k, l, ph) => '<div class="field"><label>' + l + '</label><input type="text" data-inf="' + k + '" value="' + esc(infGet()[k] || "") + '" placeholder="' + esc(ph || "") + '"></div>';
  function pgHubProy2() {
    const rows = ETAPAS.map(([k, n, t, o]) => {
      const d = etDone(k), go = k === "dis" ? "p2" : k;
      return '<tr class="' + (d ? "etdone" : "") + '"><td class="num"><b>' + n + '</b></td><td><button type="button" class="linkb" data-go="' + go + '">' + t + "</button>" + (k === "dis" ? '<div class="etsub">' + DIS_PAGES.map((p) => {
        const pp = pageOf(p);
        return '<button type="button" class="linkb" data-go="' + p + '">' + pp.n + " " + pp.t + (RES[p] ? " ✓" : "") + "</button>";
      }).join("") + "</div>" : "") + "</td><td>" + o + "</td><td>" + (d ? pill("ok", "✓ Cumplida") : pill("info", "Pendiente")) + "</td></tr>";
    }).join("");
    const nd = ETAPAS.filter(([k]) => etDone(k)).length;
    return '<p class="eyebrow">Proyecto de instalaci\xF3n interior \xB7 pliegos RIC</p><h1>Proceso del proyecto</h1><p class="lead">Las 8 etapas en el orden en que se ejecuta un proyecto el\xE9ctrico domiciliario, desde la definici\xF3n con el mandante hasta la puesta en servicio. Cada etapa tiene un objetivo verificable.</p>' +
      '<div class="cubar" title="' + nd + ' de 8 etapas"><span style="width:' + nd / 8 * 100 + '%"></span></div>' +
      '<section class="card"><h2>Resumen general del proceso</h2><div class="tbl-wrap"><table class="ettab"><thead><tr><th>N.\xBA</th><th>Etapa</th><th>Objetivo</th><th>Estado</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      note("<b>Criterio fundamental:</b> el proyecto no se considera terminado solo porque la instalaci\xF3n est\xE1 montada o porque se present\xF3 la declaraci\xF3n TE1. La entrega exige las verificaciones t\xE9cnicas, el procedimiento de puesta en servicio y la documentaci\xF3n correspondiente.", "warn") +
      '<p class="hint">Referencia oficial: pliegos t\xE9cnicos RIC publicados por la SEC. Los requisitos espec\xEDficos deben comprobarse en sus versiones vigentes y seg\xFAn las caracter\xEDsticas reales de la instalaci\xF3n.</p><div class="actions" style="border:0;padding-top:0"><button class="btn" type="button" data-go="' + (ETAPAS.find(([k]) => !etDone(k)) || ETAPAS[0])[0].replace("dis", "p2") + '">Continuar con la etapa pendiente →</button></div></section>';
  }
  function pgE1() {
    const E = etGet(), D = E.def, inf = infGet();
    return etHead(1, "Definici\xF3n del proyecto", "requerimientos y alcance aprobados") +
      '<section class="card form"><div class="sechead"><span class="tag">Mandante</span><h2 style="margin:0">Cliente y tipo de obra</h2></div><div class="grid">' + infF("prop", "Propietario o mandante", "Nombre completo") + infF("rut", "RUT", "12.345.678-9") + infF("fono", "Tel\xE9fono de contacto") + '<div class="field"><label>Tipo de obra</label><select data-inf="tipo">' + Object.entries(INF_TIPO).map(([v, t]) => '<option value="' + v + '"' + (inf.tipo === v ? " selected" : "") + ">" + t + "</option>").join("") + "</select></div>" + etField("def.destino", "Destino del inmueble", "Vivienda unifamiliar") + etField("def.plazo", "Plazo requerido", "Ej.: 30 d\xEDas") + etField("def.presup", "Presupuesto disponible ($)", "Opcional", "number") + "</div>" +
      etField("def.alcance", "Alcance de los trabajos", "Ej.: instalaci\xF3n interior completa de alumbrado y enchufes, tablero general y puesta a tierra; excluye empalme.", "area") + "</section>" +
      '<section class="card form"><div class="sechead"><span class="tag">Requerimientos</span><h2 style="margin:0">Consumos y servicios solicitados</h2></div><div class="etgrid">' + REQS.map(([id, l]) => etCk("def.req", id, l, D.req[id])).join("") + "</div>" + etField("def.otros", "Otros requerimientos u observaciones del mandante", "", "area") + "</section>" +
      '<section class="card"><h2>Aprobaci\xF3n</h2>' + etField("def.fecha", "Fecha de aprobaci\xF3n del alcance", "", "date") + etApprove("e1", "Alcance y requerimientos revisados y aprobados por el mandante") + '<div class="actions" style="border:0;padding-top:0"><button class="btn" type="button" data-go="p1">Siguiente: levantamiento y factibilidad →</button></div></section>' +
      learn("Por qu\xE9 se define primero el alcance", "<p>El alcance fija qu\xE9 se va a construir y qu\xE9 queda fuera (por ejemplo, el empalme o la obra civil). Los requerimientos del mandante —horno, climatizaci\xF3n, cargador de veh\xEDculo— determinan los circuitos y la potencia, y por lo tanto el empalme y el presupuesto. Cambiarlos despu\xE9s obliga a rehacer el dise\xF1o.</p>");
  }
  function levHTML() {
    const E = etGet(), F = E.fac, ok = FACT.filter(([id]) => F[id]).length;
    let dem = "";
    if (S.circuits && S.circuits.length) {
      const a = calcAlim(S), cap = +E.fac_cap || 0;
      dem = kpis([kpi("Demanda calculada", n0(a.Pd), "W"), kpi("Corriente de demanda", nf(a.Ia, 1), "A"), kpi("Empalme declarado", cap ? cap + " A" : "—", "", cap ? cap >= a.Ia ? "ok" : "bad" : "")]);
    }
    return '<section class="card form"><div class="sechead"><span class="tag">Inmueble</span><h2 style="margin:0">Antecedentes del inmueble</h2></div><div class="grid">' + infF("dir", "Direcci\xF3n", "Calle y n\xFAmero") + infF("comuna", "Comuna") + infF("region", "Regi\xF3n") + infF("rol", "Rol de aval\xFAo", "Opcional") + etField("lev.sup", "Superficie construida (m\xB2)", "", "number") + etField("lev.pisos", "N\xB0 de pisos", "1", "number") + etField("lev.const", "Materialidad", "Ej.: alba\xF1iler\xEDa / tabiquer\xEDa") + '</div><p class="hint">Para dibujar el plano con medidas usa <button type="button" class="linkb" data-go="casa">Dise\xF1ar mi vivienda</button>.</p></section>' +
      '<section class="card form"><div class="sechead"><span class="tag">Suministro</span><h2 style="margin:0">Empalme y distribuidora</h2></div><div class="grid">' + infF("dist", "Empresa distribuidora") + infF("cliente", "N\xB0 de cliente / medidor") + '<div class="field"><label>Capacidad del empalme (A)</label><input type="number" data-ef="fac_cap" value="' + esc(E.fac_cap || "") + '" placeholder="Ej.: 25"></div>' + etField("lev.tipoEmp", "Tipo de empalme", "A\xE9reo / subterr\xE1neo") + "</div>" + dem + "</section>" +
      '<section class="card"><h2>Factibilidad</h2><div class="etgrid">' + FACT.map(([id, l]) => etCk("fac", id, l, F[id])).join("") + '</div><p class="hint">' + ok + " de " + FACT.length + " verificados.</p>" + etApprove("p1", "Levantamiento completo: antecedentes del inmueble y del suministro reunidos") + "</section>";
  }
  function pgE3() {
    const s = S.sim2, has = s && s.circuits.length;
    return etHead("3.8", "Planos y especificaciones", "planos, c\xE1lculos y especificaciones") +
      '<section class="card"><h2>Planos del proyecto</h2><div class="tiles"><button class="tile" type="button" data-go="casa"><span class="ti">\u{1F4D0}</span><span class="tt">Plano de arquitectura</span><span class="td">Recintos, medidas y puertas</span></button><button class="tile" type="button" data-go="sim"><span class="ti">◈</span><span class="tt">Trazado de la instalaci\xF3n</span><span class="td">Puntos, canalizaciones y circuitos</span></button><button class="tile" type="button" data-go="rep"><span class="ti">⎙</span><span class="tt">Reportes</span><span class="td">Cuadro, unilineal, materiales</span></button></div>' +
      (has ? '<div class="rep-act"><button class="btn" type="button" data-ia2="lam">⬇ L\xE1mina de plano (formato SEC)</button><button class="btn ghost" type="button" data-ia2="lamp">\u{1F5A8} Ver e imprimir l\xE1mina</button><span class="hint" id="lmsg"></span></div><div class="lamprev">' + laminaSVG(s) + "</div>" : note("Primero arma la instalaci\xF3n en el Simulador 3D para generar la l\xE1mina.", "info")) + "</section>" +
      '<section class="card"><h2>Especificaciones t\xE9cnicas de materiales</h2><div class="tbl-wrap"><table><thead><tr><th>Partida</th><th>Especificaci\xF3n</th></tr></thead><tbody>' + [["Conductores", "Cobre, aislaci\xF3n THHN/THWN-2 o NYA seg\xFAn RIC N\xB004; colores (RIC N\xB004, 5.32): fases 1, 2 y 3 azul, negro y rojo, neutro blanco, protecci\xF3n verde/amarillo."], ["Canalizaciones", "Tubo conduit PVC r\xEDgido o corrugado auto-extinguible, o EMT; di\xE1metro seg\xFAn llenado m\xE1ximo 33 % (RIC N\xB004, Tabla 4.21); m\xE1ximo 3 curvas entre cajas."], ["Cajas", "PVC o met\xE1licas con tapa; cajas de derivaci\xF3n accesibles; uniones con conectores o regletas certificadas."], ["Aparatos", "Interruptores y enchufes 10/16 A certificados por la SEC; enchufes 2P+T; IP44 en zonas h\xFAmedas."], ["Protecciones", "Autom\xE1ticos termomagn\xE9ticos curva B/C, poder de corte ≥ 6 kA; diferenciales 30 mA para circuitos de enchufes y alumbrado."], ["Tablero", "Tablero normalizado con riel DIN, barras de neutro y tierra, tapa, cuadro de circuitos y se\xF1al de riesgo el\xE9ctrico (RIC N\xB002)."], ["Puesta a tierra", "Electrodo Copperweld 5/8\" en c\xE1mara de registro, conductor de cobre desnudo o aislado verde/amarillo (RIC N\xB006)."]].map(([a, b]) => "<tr><td><b>" + a + "</b></td><td>" + b + "</td></tr>").join("") + '</tbody></table></div><p class="hint">Todos los materiales deben contar con certificaci\xF3n SEC para su comercializaci\xF3n.</p>' + etApprove("dis", "Dise\xF1o el\xE9ctrico terminado: planos, c\xE1lculos y especificaciones") + '<div class="actions" style="border:0;padding-top:0"><button class="btn" type="button" data-go="e4">Siguiente: presupuesto y planificaci\xF3n →</button></div></section>';
  }
  function pgE4() {
    const s = S.sim2;
    if (!s || !s.circuits.length) return etHead(4, "Presupuesto y planificaci\xF3n", "costos y programa aprobados") + note("El presupuesto y el programa se calculan con la instalaci\xF3n del Simulador 3D. Arma la casa all\xED primero.", "info") + '<button class="btn" type="button" data-go="sim">Ir al simulador</button>';
    return etHead(4, "Presupuesto y planificaci\xF3n", "costos y programa aprobados") + infSection(s, "b") + infSection(s, "g") + '<section class="card"><h2>Aprobaci\xF3n</h2>' + etApprove("e4", "Presupuesto y programa de obra aprobados por el mandante") + '<div class="actions" style="border:0;padding-top:0"><button class="btn ghost" type="button" data-go="rep">Ver listado de materiales en Reportes</button><button class="btn" type="button" data-go="e5">Siguiente: ejecuci\xF3n →</button></div></section>';
  }
  function pgE5() {
    const s = S.sim2, E = etGet();
    if (!s || !s.circuits.length) return etHead(5, "Ejecuci\xF3n", "instalaci\xF3n construida") + note("Arma primero la instalaci\xF3n en el Simulador 3D.", "info");
    const T = infTasks(s), dn = T.filter((t) => E.ejec[t.id]).length, hh = T.filter((t) => E.ejec[t.id]).reduce((a, t) => a + t.h, 0), tot = T.reduce((a, t) => a + t.h, 0);
    return etHead(5, "Ejecuci\xF3n", "instalaci\xF3n construida") + kpis([kpi("Actividades", dn + "/" + T.length), kpi("Avance f\xEDsico", n0(hh / tot * 100), "%", dn === T.length ? "ok" : ""), kpi("HH ejecutadas", nf(hh, 1), "de " + nf(tot, 1))]) + '<div class="cubar"><span style="width:' + hh / tot * 100 + '%"></span></div>' +
      '<section class="card"><h2>Control de avance</h2><div class="etlist">' + T.map((t, i) => etCk("ejec", t.id, i + 1 + ". " + t.n + " \xB7 " + nf(t.h, 1) + " HH", E.ejec[t.id], t.w)).join("") + "</div>" + etField("ejecObs", "Libro de obra: observaciones y cambios respecto al proyecto", "", "area") + "</section>" +
      '<section class="card"><h2>Seguridad en la ejecuci\xF3n</h2><ul class="hand">' + EJEC_SEG.map((x) => "<li>" + x + "</li>").join("") + '</ul><div class="actions" style="border:0;padding-top:0"><button class="btn ghost" type="button" data-go="sim">Practicar en el Simulador 3D</button><button class="btn" type="button" data-go="p8">Siguiente: inspecci\xF3n y ensayos →</button></div></section>';
  }
  function pgE7() {
    const s = S.sim2;
    const docs = [["Plano de planta y l\xE1mina de proyecto", !!(s && s.circuits.length)], ["Cuadro de cargas", !!RES.p9 || !!(s && s.circuits.length)], ["Diagrama unilineal", !!(s && s.circuits.length)], ["Memoria explicativa", !!(s && s.circuits.length)], ["Registro de ensayos (etapa 6)", !!RES.p8], ["Datos del propietario e instalador", !infMissing(infGet()).length]];
    return etHead(7, "Documentaci\xF3n y declaraci\xF3n SEC", "antecedentes finales y tr\xE1mite TE1") +
      '<section class="card"><h2>Antecedentes</h2><ul class="etdocs">' + docs.map(([t, ok]) => '<li class="' + (ok ? "ok" : "") + '">' + (ok ? "✓" : "○") + " " + t + "</li>").join("") + "</ul>" + (s && s.circuits.length ? '<div class="rep-act"><button class="btn" type="button" data-ia2="lam">⬇ L\xE1mina de plano</button></div>' : "") + "</section>" +
      (s && s.circuits.length ? infSection(s, "d") : note("Arma la instalaci\xF3n en el Simulador 3D para generar los documentos.", "info")) +
      '<section class="card"><h2>Tr\xE1mite</h2><ol class="hand"><li>El instalador autorizado revisa los antecedentes y los datos del borrador TE1.</li><li>Ingresa la declaraci\xF3n en la plataforma en l\xEDnea de la SEC con su clave y adjunta plano, cuadro de cargas y memoria.</li><li>Guarda el comprobante de la declaraci\xF3n y entr\xE9galo al propietario en la etapa 8.</li></ol>' + etField("te1num", "N\xB0 o folio de la declaraci\xF3n (una vez ingresada)", "") + etApprove("e7", "Declaraci\xF3n TE1 ingresada y antecedentes finales completos") + '<div class="actions" style="border:0;padding-top:0"><button class="btn" type="button" data-go="e8">Siguiente: puesta en servicio y entrega →</button></div></section>';
  }
  function pgE8() {
    const E = etGet(), dn = PSE.filter(([id]) => E.pse[id]).length;
    return etHead(8, "Puesta en servicio y entrega", "instalaci\xF3n entregada y documentaci\xF3n final") +
      '<section class="card"><h2>Procedimiento de puesta en servicio</h2><div class="etlist">' + PSE.map(([id, l], i) => etCk("pse", id, i + 1 + ". " + l, E.pse[id])).join("") + "</div><p class=\"hint\">" + dn + " de " + PSE.length + " verificados.</p>" + '<div class="grid">' + etField("ent.fecha", "Fecha de entrega", "", "date") + etField("ent.recibe", "Recibe conforme (nombre)", "") + "</div></section>" +
      (dn === PSE.length && etDone("p8") && etDone("e7") ? note("✓ Proyecto terminado: verificaciones t\xE9cnicas, puesta en servicio y documentaci\xF3n completas.", "ok") : note("<b>Criterio fundamental:</b> no se considera terminado el proyecto solo porque la instalaci\xF3n est\xE1 montada o porque se present\xF3 el TE1. Faltan " + [dn < PSE.length ? PSE.length - dn + " verificaci\xF3n(es) de puesta en servicio" : "", etDone("p8") ? "" : "los ensayos de la etapa 6", etDone("e7") ? "" : "la documentaci\xF3n de la etapa 7"].filter(Boolean).join(", ") + ".", "warn")) +
      '<div class="actions" style="border:0"><button class="btn ghost" type="button" data-go="hub_proy">Ver el resumen del proceso</button></div>';
  }
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (!el || !el.dataset) return;
    const E = etGet();
    if (el.dataset.et) {
      const [g, id] = el.dataset.et.split(".");
      if (g === "def") E.def.req[id] = el.checked;
      else (E[g] = E[g] || {})[id] = el.checked;
      save();
      render(true);
      return;
    }
    if (el.dataset.ef) {
      const ks = el.dataset.ef.split(".");
      let o = E;
      ks.slice(0, -1).forEach((k) => o = o[k] = o[k] && typeof o[k] === "object" ? o[k] : {});
      o[ks[ks.length - 1]] = el.value.slice(0, 2e3);
      save();
      if (el.dataset.ef === "fac_cap") render(true);
      return;
    }
    if (el.dataset.inf && !["rep", "e4", "e7"].includes(cur)) {
      const inf = infGet();
      inf[el.dataset.inf] = el.value.slice(0, 120);
      save();
    }
  });
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-ia2]");
    if (!b || !S.sim2) return;
    const m = document.getElementById("lmsg") || document.getElementById("imsg");
    if (b.dataset.ia2 === "lam") {
      if (NFL > 1) dlFile("lamina-proyecto-electrico-2-piso.svg", new Blob([laminaSVG(S.sim2, true, 1)], { type: "image/svg+xml" }));
      dlFile(NFL > 1 ? "lamina-proyecto-electrico-1-piso.svg" : "lamina-proyecto-electrico.svg", new Blob([laminaSVG(S.sim2, true)], { type: "image/svg+xml" })).then((rr) => {
        if (m) m.textContent = dlMsg(rr, "L\xE1mina descargada (SVG, tama\xF1o A3): \xE1brela en el navegador o en un programa de dibujo e impr\xEDmela en A3 horizontal.");
      });
    }
    if (b.dataset.ia2 === "lamp") {
      const w = window.open("", "_blank");
      if (w && w.document) {
        w.document.open();
        w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>L\xE1mina</title><style>@page{size:A3 landscape;margin:6mm}body{margin:0}svg{width:100%;height:auto}.pb{page-break-before:always}</style></head><body>' + laminaSVG(S.sim2) + (NFL > 1 ? '<div class="pb">' + laminaSVG(S.sim2, false, 1) + "</div>" : "") + "</body></html>");
        w.document.close();
        setTimeout(() => {
          try {
            w.print();
          } catch (err) {
          }
        }, 500);
      } else if (m) m.textContent = "El navegador bloque\xF3 la ventana: usa la descarga.";
    }
  });
