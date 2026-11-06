  /* ===== Asistente guiado de proyecto: proyecto → recintos y cargas → circuitos → alimentador → protecciones → tablero → resultados ===== */
  const WZ = [
    ["p1", "Proyecto", "Nombre, sistema y largo del alimentador"],
    ["p2", "Recintos y cargas", "Superficie, centros, enchufes y horno"],
    ["p3", "Circuitos", "Agrupa los puntos en circuitos"],
    ["p4", "Alimentador", "Demanda y conductor del alimentador"],
    ["p5", "Protecciones", "Termomagnéticos y diferenciales"],
    ["p6", "Tablero", "Módulos, reserva y grado IP"],
    ["asis", "Resultados", "Resumen, unilineal, materiales y exportar"]
  ];
  let wizOn = (() => {
    try {
      return localStorage.getItem(KEY + "-wiz") === "1";
    } catch (e) {
      return false;
    }
  })();
  function wizSet(on) {
    wizOn = on;
    try {
      localStorage.setItem(KEY + "-wiz", on ? "1" : "0");
    } catch (e) {
    }
  }
  const wizIdx = (id) => WZ.findIndex((w) => w[0] === id);
  function wizDone(id) {
    if (id === "p1") return !!(S.proj.nombre && +S.proj.Lalim > 0);
    if (id === "p2") return S.rooms.length > 0;
    if (id === "p3") return S.circuits.length > 0;
    if (id === "asis") return false;
    return !!RES[id];
  }
  function wizWrap(html) {
    const i = wizIdx(cur);
    if (!wizOn || i < 0) return html;
    const st = '<nav class="wz" aria-label="Pasos del asistente"><div class="wzt"><span>Asistente \xB7 paso <b>' + (i + 1) + "</b> de " + WZ.length + '<span class="wzd"> \xB7 ' + esc(WZ[i][2]) + '</span></span><button type="button" class="linkb" data-wz="exit">Salir del asistente</button></div><ol>' + WZ.map(([id, t], k) => '<li><button type="button" data-go="' + id + '" class="' + (wizDone(id) && k !== i ? "done" : "") + '"' + (k === i ? ' aria-current="step"' : "") + '><span class="n">' + (wizDone(id) && k !== i ? "✓" : k + 1) + "</span>" + esc(t) + "</button></li>").join("") + "</ol></nav>";
    const p = pageOf(cur), nx = WZ[i + 1], pv = WZ[i - 1];
    const nextLbl = nx ? (p.c && !RES[cur] ? "Calcular y seguir: " : "Siguiente: ") + nx[1] + " →" : "Terminar";
    const nav = '<div class="wznav no-print" role="group" aria-label="Avanzar en el asistente">' + (pv ? '<button type="button" class="btn ghost" data-wz="prev">← ' + esc(pv[1]) + "</button>" : '<button type="button" class="btn ghost" data-wz="exit">Salir</button>') + '<button type="button" class="btn calc" data-wz="next">' + esc(nextLbl) + "</button></div>";
    html = html.replace(/<div class="pager">[\s\S]*?<\/div>/, "");
    return st + html + nav;
  }
  function wizStart() {
    wizSet(true);
    go("p1");
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-wz]");
    if (!b) return;
    const a = b.dataset.wz, i = wizIdx(cur);
    if (a === "start") return wizStart();
    if (a === "exit") {
      wizSet(false);
      render();
      return;
    }
    if (a === "prev" && i > 0) return go(WZ[i - 1][0]);
    if (a === "next") {
      const p = pageOf(cur);
      if (p.c && !RES[cur]) {
        RES[cur] = resultCard(p.c());
        SNAP[cur] = snapOf(cur);
      }
      if (i < WZ.length - 1) go(WZ[i + 1][0]);
      else {
        wizSet(false);
        go("rep");
      }
      return;
    }
    if (a === "csv") {
      const B = bomProyecto(), lines = [["Grupo", "Material", "Cantidad", "Unidad", "Precio unitario CLP", "Subtotal CLP"]].concat(B.map((x) => [x.g, x.d, x.q, x.u, precio(x.k), precio(x.k) * x.q]));
      const csv = "﻿" + lines.map((r) => r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(";")).join("\r\n");
      dlFile(nomArch() + "-materiales.csv", new Blob([csv], { type: "text/csv" })).then((rr) => asisMsg(dlMsg(rr, "Listado de materiales descargado (se abre con Excel).")));
      return;
    }
    if (a === "svg") {
      dlFile(nomArch() + "-unilineal.svg", new Blob([uniSVG()], { type: "image/svg+xml" })).then((rr) => asisMsg(dlMsg(rr, "Diagrama unilineal descargado.")));
      return;
    }
    if (a === "print") {
      try {
        window.print();
      } catch (err) {
        asisMsg("Este visor no permite imprimir: descarga el archivo y \xE1brelo en el navegador.");
      }
    }
  });
  const nomArch = () => (S.proj && S.proj.nombre || "proyecto-ric").replace(/[^\w\-]+/g, "_");
  function asisMsg(t) {
    const m = document.getElementById("asismsg");
    if (m) m.textContent = t;
  }
  function asisCalc() {
    const a = calcAlim(S), rs = S.circuits.map((c) => calcCirc(S, c, a));
    return { a, rs };
  }
  function bomProyecto() {
    const { a, rs } = asisCalc();
    return RICEngine.materialesProyecto({ tri: S.proj.sistema === "tri", alim: { In: a.In, S: a.sel ? a.sel.s : null, L: a.L }, circuitos: rs.map((r) => ({ In: r.In, S: r.sel ? r.sel.s : null, L: r.L, curva: r.curva })) });
  }
  function uniSVG() {
    const { a, rs } = asisCalc(), tri = S.proj.sistema === "tri", W = 760, rowH = 34, top = 150;
    const groups = [];
    S.circuits.forEach((c, i) => {
      const g = Math.floor(i / 3);
      (groups[g] = groups[g] || []).push(i);
    });
    const H = top + groups.reduce((h, g) => h + 46 + g.length * rowH, 0) + 30;
    const t = (x, y, s, o = {}) => '<text x="' + x + '" y="' + y + '" font-size="' + (o.s || 13) + '" font-weight="' + (o.b ? 700 : 400) + '" fill="' + (o.c || "#14202C") + '" font-family="Arial,Helvetica,sans-serif"' + (o.a ? ' text-anchor="' + o.a + '"' : "") + ">" + esc(s) + "</text>";
    const box = (x, y, w, h, f, st) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="' + f + '" stroke="' + (st || "#3b4a5a") + '" stroke-width="1.4"/>';
    let g = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" class="unisvg" role="img" aria-label="Diagrama unilineal del proyecto"><rect width="' + W + '" height="' + H + '" fill="#fff"/>';
    g += t(20, 26, "Diagrama unilineal \xB7 " + (S.proj.nombre || "Proyecto"), { s: 15, b: 1 }) + t(20, 44, (tri ? "Trif\xE1sico 380/220 V" : "Monof\xE1sico 220 V") + " \xB7 esquema TN-S \xB7 RIC N\xB002 y N\xB010", { s: 11.5, c: "#4D5B6B" });
    g += box(20, 60, 150, 34, "#F2F5F8") + t(95, 82, "Empalme / medidor", { a: "middle", s: 12 });
    g += '<line x1="170" y1="77" x2="230" y2="77" stroke="#3b4a5a" stroke-width="2"/>' + t(200, 70, "Alim. " + (a.sel ? sStr(a.sel.s) + " mm\xB2" : "—"), { a: "middle", s: 10.5, c: "#4D5B6B" });
    g += box(230, 60, 190, 34, "#FFF6E8", "#AF4F1E") + t(325, 82, "General " + (tri ? "4P " : "2P ") + (a.In || "—") + " A", { a: "middle", s: 12.5, b: 1 });
    g += '<line x1="60" y1="94" x2="60" y2="' + (H - 24) + '" stroke="#3b4a5a" stroke-width="3"/><line x1="325" y1="94" x2="325" y2="118" stroke="#3b4a5a" stroke-width="2"/><line x1="60" y1="118" x2="325" y2="118" stroke="#3b4a5a" stroke-width="3"/>' + t(70, 112, "Barra de distribuci\xF3n", { s: 10.5, c: "#4D5B6B" });
    let y = top;
    groups.forEach((ix, k) => {
      g += '<line x1="60" y1="' + (y + 17) + '" x2="90" y2="' + (y + 17) + '" stroke="#3b4a5a" stroke-width="2"/>' + box(90, y, 210, 34, "#EAF1F8", "#1C5A96") + t(195, y + 22, "DR" + (k + 1) + " \xB7 30 mA \xB7 clase A", { a: "middle", s: 12, b: 1 });
      const yb = y + 34;
      g += '<line x1="195" y1="' + yb + '" x2="195" y2="' + (yb + 12 + (ix.length - 1) * rowH + 17) + '" stroke="#3b4a5a" stroke-width="2"/>';
      ix.forEach((i, j) => {
        const r = rs[i], c = S.circuits[i], yy = yb + 12 + j * rowH;
        g += '<line x1="195" y1="' + (yy + 13) + '" x2="320" y2="' + (yy + 13) + '" stroke="#3b4a5a" stroke-width="1.6"/>' + box(320, yy, 96, 26, r.okIn ? "#fff" : "#FBE5E3", r.okIn ? "#3b4a5a" : "#A8271E") + t(368, yy + 17, (r.In || "—") + " A " + r.curva, { a: "middle", s: 12, b: 1 });
        g += t(428, yy + 12, "C" + (i + 1) + " " + (c.nombre || ""), { s: 12, b: 1 }) + t(428, yy + 25, (r.sel ? sStr(r.sel.s) + " mm\xB2" : "sin secci\xF3n") + " \xB7 " + n0(r.P) + " W \xB7 ΔV total " + (isFinite(r.tot) ? nf(r.tot, 1) + " %" : "—"), { s: 11, c: "#4D5B6B" });
      });
      y = yb + 12 + ix.length * rowH;
    });
    g += t(W - 20, H - 10, "Generado con Calculadora RIC \xB7 apoyo, no reemplaza al instalador autorizado SEC", { a: "end", s: 9.5, c: "#6b7785" });
    return g + "</svg>";
  }
  function pgAsis() {
    const nm = S.proj.nombre || "Proyecto sin nombre";
    if (!S.circuits.length) return '<p class="eyebrow">Asistente \xB7 resultados</p><h1>' + esc(nm) + "</h1>" + note("A\xFAn no hay circuitos. Completa los recintos y genera los circuitos para ver los resultados.", "warn") + '<button class="btn" type="button" data-go="p2">Ir a recintos y cargas</button>';
    const { a, rs } = asisCalc(), I = issues(S), B = bomProyecto(), cost = bomCost(B), nDR = Math.ceil(S.circuits.length / 3), m = RICEngine.modulosTablero(S.circuits.length, S.proj.sistema === "tri");
    const rows = S.circuits.map((c, i) => {
      const r = rs[i];
      return "<tr><td><b>C" + (i + 1) + "</b> " + esc(c.nombre || "") + '</td><td class="num">' + n0(r.P) + '</td><td class="num">' + nf(r.Is) + '</td><td class="num">' + (r.In || "—") + " " + r.curva + '</td><td class="num">' + (r.sel ? sStr(r.sel.s) : "—") + '</td><td class="num">' + (isFinite(r.tot) ? nf(r.tot, 2) + " %" : "—") + "</td><td>DR" + (Math.floor(i / 3) + 1) + "</td><td>" + okp(r.ok) + "</td></tr>";
    }).join("");
    return '<p class="eyebrow">Asistente \xB7 resultados \xB7 RIC N\xB003, N\xB004 y N\xB010</p><h1>' + esc(nm) + '</h1><p class="lead">Resumen del dise\xF1o el\xE9ctrico con todo lo calculado en los pasos anteriores. Revisa las observaciones, descarga los entregables y contin\xFAa con planos, presupuesto y ensayos en el proyecto de 8 etapas.</p>' +
      kpis([kpi("Potencia instalada", n0(a.Pinst), "W"), kpi("Demanda", n0(a.Pd), "W"), kpi("Corriente del alimentador", nf(a.Ia), "A"), kpi("Protecci\xF3n general", a.In || "—", "A"), kpi("Alimentador", a.sel ? sStr(a.sel.s) : "—", "mm\xB2"), kpi("Circuitos", S.circuits.length), kpi("Diferenciales 30 mA", nDR), kpi("Tablero", m.tablero, "m\xF3dulos")]) +
      '<section class="card"><h2>Cumplimiento</h2>' + (I.length ? '<ul class="chk">' + I.map((x) => "<li>⚠ <span>" + esc(x) + "</span></li>").join("") + "</ul>" : '<ul class="chk"><li class="ok">✓ <span>Sin observaciones: el dise\xF1o cumple las verificaciones de la app. Conf\xEDrmalo con el instalador autorizado.</span></li></ul>') + "</section>" +
      '<section class="card"><h2>Circuitos</h2><div class="tbl-wrap"><table class="pt"><thead><tr><th>Circuito</th><th class="num">P [W]</th><th class="num">I [A]</th><th class="num">Protecci\xF3n</th><th class="num">S [mm\xB2]</th><th class="num">ΔV total</th><th>Diferencial</th><th>Estado</th></tr></thead><tbody>' + rows + '</tbody></table></div><p class="hint">Conductor elegido con la tabla ' + esc(S.ampCfg.met) + " \xB7 cable " + esc(RIC_DATA.tcab[S.ampCfg.tc] || "") + " (RIC N\xB004, Tabla 4.4). ΔV total incluye el alimentador (l\xEDmite 5 %, RIC N\xB003, 5.1.3).</p></section>" +
      '<section class="card"><h2>Diagrama unilineal</h2><div class="tbl-wrap">' + uniSVG() + "</div></section>" +
      '<section class="card"><h2>Materiales el\xE9ctricos estimados</h2>' + bomTable(B, false) + '<p class="hint">Estimaci\xF3n de conductores (fase, neutro y tierra; 10 % de merma y 2 m de chicotes por conductor, criterio usual), protecciones y tablero. No incluye cajas, ductos ni aparatos: se agregan al dibujar la vivienda. Total con IVA: <b>' + clp(cost.tot) + "</b>.</p></section>" +
      '<section class="card no-print"><h2>Exportar</h2><div class="exp"><button class="btn" type="button" data-wz="print">\u{1F5A8} Imprimir o guardar PDF</button><button class="btn ghost" type="button" data-wz="csv">⬇ Materiales (CSV para Excel)</button><button class="btn ghost" type="button" data-wz="svg">⬇ Unilineal (SVG)</button><button class="btn ghost" type="button" data-go="rep">Reportes completos</button></div><p class="hint" id="asismsg" role="status" aria-live="polite"></p></section>' + projHTML();
  }
