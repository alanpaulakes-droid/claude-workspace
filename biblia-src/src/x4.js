/* ============ DIAGRAMAS TÉCNICOS ADICIONALES ============ */
const rect = (x, y, w, h, cls, rx) => '<rect class="' + (cls || "dgb1") + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx == null ? 6 : rx) + '"/>';
const ln = (x1, y1, x2, y2, cls, st) => '<line class="' + (cls || "dga") + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"' + (st ? ' style="' + st + '"' : "") + "/>";
// Símbolos ASME: 0 operación, 1 transporte, 2 inspección, 3 demora, 4 almacenamiento
function asme(k, x, y, r){ r = r || 9;
  if (k === 0) return '<circle class="dgb1" cx="' + x + '" cy="' + y + '" r="' + r + '"/>';
  if (k === 1) return '<polygon class="dgb2" points="' + (x - r) + "," + (y - r * 0.5) + " " + (x + r * 0.2) + "," + (y - r * 0.5) + " " + (x + r * 0.2) + "," + (y - r) + " " + (x + r) + "," + y + " " + (x + r * 0.2) + "," + (y + r) + " " + (x + r * 0.2) + "," + (y + r * 0.5) + " " + (x - r) + "," + (y + r * 0.5) + '"/>';
  if (k === 2) return '<rect class="dgb3" x="' + (x - r) + '" y="' + (y - r) + '" width="' + 2 * r + '" height="' + 2 * r + '"/>';
  if (k === 3) return '<path class="dgb4" d="M' + (x - r) + " " + (y - r) + " H" + x + " A" + r + " " + r + " 0 0 1 " + x + " " + (y + r) + " H" + (x - r) + ' Z"/>';
  return '<polygon class="dgb5" points="' + (x - r) + "," + (y - r) + " " + (x + r) + "," + (y - r) + " " + x + "," + (y + r) + '"/>';
}
const ASMEN = ["Operación", "Transporte", "Inspección", "Demora", "Almacenamiento"];
Object.assign(D, {
  // Leyenda de símbolos ASME
  asmeLegend(cap){ const W = 560, H = 120; let g = "";
    ASMEN.forEach((n, i) => { const x = 60 + i * 110; g += asme(i, x, 40, 15) + tx(x, 78, n, { b:true, s:11.5 }) + tx(x, 98, ["transforma", "mueve", "verifica", "espera", "guarda"][i], { s:10.5, cls:"dgs" }); });
    return fig(W, H, g, cap || "Los cinco símbolos de la ASME para analizar procesos: solo la operación agrega valor; los demás son candidatos a eliminar o reducir.", 420); },
  // Diagrama de flujo ANSI: items [tipo, texto, (para decisión) texto rama No]
  flow(items, cap){ /* F4: usa el diagrama de flujo común (FC): formas estándar, flechas con punta y grilla */
    const T = { s:"ini", e:"fin", d:"dec", io:"io" }; return FC(items.map(it => it[0] === "d" && it[2] ? { t:"dec", x:it[1], lbl:["Sí", "No"], side:{ t:"pro", x:it[2], to:it[3] } } : { t:T[it[0]] || "pro", x:it[1] }), cap); },
  dop(lines, cap){ const W = 560, step = 46; let g = "", maxN = Math.max(...lines.map(l => l[1].length)), x0 = 70, dx = (W - 290) / Math.max(1, lines.length - 1), n = [0, 0];
    const H = 50 + (maxN + 1) * step + 40;
    lines.forEach((l, j) => { const x = lines.length === 1 ? W / 2 - 60 : x0 + j * dx; g += tx(x, 22, l[0], { b:true, s:11.5, n:20 }) + ln(x, 34, x, 44 + l[1].length * step);
      l[1].forEach((p, i) => { const y = 60 + i * step; g += asme(p[0], x, y, 12) + tx(x, y, p[0] === 0 ? "O" + (++n[0]) : "I" + (++n[1]), { s:9.5, b:true }) + tx(x + 20, y, p[1], { a:"start", s:11, n:22 }); }); });
    if (lines.length > 1) { const yj = 60 + maxN * step, xm = x0 + (lines.length - 1) * dx / 2; lines.forEach((l, j) => { const x = x0 + j * dx; g += ln(x, 44 + l[1].length * step, x, yj) + ln(x, yj, xm, yj); }); g += asme(0, xm, yj + 30, 12) + tx(xm, yj + 30, "O" + (++n[0]), { s:9.5, b:true }) + tx(xm + 20, yj + 30, "Ensamble final", { a:"start", s:11 }) + ln(xm, yj, xm, yj + 18); }
    return fig(W, H, g, cap, 420); },
  // Cursograma analítico (DAP): filas [descripción, símbolo 0-4, distancia m, tiempo min]
  dap(rows, cap){ const W = 640, rh = 26, top = 46, H = top + rows.length * rh + 52, cs = [330, 370, 410, 450, 490]; let g = rect(10, 10, W - 20, top - 14, "dgbg", 4) + tx(170, 23, "Actividad", { b:true }) + tx(560, 23, "Dist. (m)", { b:true, s:11 }) + tx(615, 23, "Min", { b:true, s:11 });
    cs.forEach((x, i) => g += asme(i, x, 23, 7));
    let pts = [];
    rows.forEach((r, i) => { const y = top + i * rh + rh / 2; g += ln(10, top + i * rh, W - 10, top + i * rh, "ax") + tx(20, y, (i + 1) + ". " + r[0], { a:"start", s:11, n:44 }) + tx(560, y, r[2] ? String(r[2]) : "–", { s:11 }) + tx(615, y, String(r[3]), { s:11 });
      pts.push([cs[r[1]], y]); });
    g += '<polyline class="s2" points="' + pts.map(p => p.join(",")).join(" ") + '"/>' + pts.map((p, i) => asme(rows[i][1], p[0], p[1], 7)).join("");
    const cnt = ASMEN.map((_, k) => rows.filter(r => r[1] === k).length), dist = rows.reduce((s, r) => s + (r[2] || 0), 0), tim = rows.reduce((s, r) => s + r[3], 0), yb = top + rows.length * rh;
    g += ln(10, yb, W - 10, yb, "ax") + tx(20, yb + 18, "Resumen", { a:"start", b:true, s:11 }) + cs.map((x, k) => tx(x, yb + 18, String(cnt[k]), { b:true, s:11 })).join("") + tx(560, yb + 18, String(dist), { b:true, s:11 }) + tx(615, yb + 18, String(Math.round(tim * 10) / 10), { b:true, s:11 }) + tx(W / 2, yb + 40, "Solo las " + cnt[0] + " operaciones agregan valor; las otras " + (rows.length - cnt[0]) + " actividades son candidatas a eliminar o reducir.", { s:10.5, cls:"dgs", n:90 });
    return fig(W, H, g, cap, 560); },
  // Diagrama de recorrido: áreas [[x,y,w,h,texto]], ruta [[x,y,símbolo]]
  recorrido(areas, path, cap){ const W = 600, H = 300; let g = rect(5, 5, W - 10, H - 10, "dgbl", 2);
    areas.forEach(a => g += rect(a[0], a[1], a[2], a[3], "dgbg", 4) + tx(a[0] + a[2] / 2, a[1] + 14, a[4], { s:10.5, b:true, cls:"dgs", n:18 }));
    for (let i = 0; i < path.length - 1; i++) g += arrow(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1], "dgcrit");
    path.forEach((p, i) => g += asme(p[2], p[0], p[1], 10) + tx(p[0], p[1] - 17, String(i + 1), { s:10, b:true }));
    return fig(W, H, g, cap, 460); },
  // Diagrama hombre-máquina: filas [actividad operador, estado op (1 ocupado/0 ocioso), actividad máquina, estado máq, minutos]
  hm(rows, cap){ const W = 560, top = 40, scale = 26, H = top + rows.reduce((s, r) => s + r[4], 0) * scale + 60; let y = top, g = tx(170, 20, "Operador", { b:true }) + tx(400, 20, "Máquina", { b:true }); let ob = 0, mb = 0, tot = 0;
    rows.forEach(r => { const h = r[4] * scale; g += rect(130, y, 80, h, r[1] ? "dgb1" : "dgbl", 0) + rect(360, y, 80, h, r[3] ? "dgb2" : "dgbl", 0) + tx(120, y + h / 2, r[0], { a:"end", s:10.5, n:18 }) + tx(450, y + h / 2, r[2], { a:"start", s:10.5, n:18 }) + tx(285, y + h / 2, r[4] + " min", { s:10, cls:"dgs" }); ob += r[1] ? r[4] : 0; mb += r[3] ? r[4] : 0; tot += r[4]; y += h; });
    g += tx(170, y + 18, "Ocupado " + Math.round(ob / tot * 100) + " %", { b:true, s:11 }) + tx(400, y + 18, "Ocupada " + Math.round(mb / tot * 100) + " %", { b:true, s:11 }) + tx(W / 2, y + 40, "Ciclo: " + tot + " min · color = trabajando · blanco = ocioso", { s:10.5, cls:"dgs", n:70 });
    return fig(W, H, g, cap, 440); },
  // BPMN simplificado: lanes [nombres], nodes [[id, lane, x, tipo s|t|g|e, texto]], edges [[a,b,etiqueta]]
  bpmn(lanes, nodes, edges, cap){ const W = 680, lh = 82, H = lanes.length * lh + 10; let g = "";
    lanes.forEach((l, i) => g += rect(5, 5 + i * lh, W - 10, lh, "dgbl", 0) + rect(5, 5 + i * lh, 28, lh, "dgbg", 0) + '<text x="19" y="' + (5 + i * lh + lh / 2) + '" text-anchor="middle" dominant-baseline="middle" transform="rotate(-90 19 ' + (5 + i * lh + lh / 2) + ')" style="font-size:10.5px;font-weight:700">' + esc(l) + "</text>");
    const P = {}; nodes.forEach(n => { const y = 5 + n[1] * lh + lh / 2; P[n[0]] = [n[2], y, n[3]];
      if (n[3] === "s") g += '<circle class="dgb3" cx="' + n[2] + '" cy="' + y + '" r="13"/>';
      else if (n[3] === "e") g += '<circle class="dgb4" cx="' + n[2] + '" cy="' + y + '" r="13" style="stroke-width:3"/>';
      else if (n[3] === "g") g += '<polygon class="dgb2" points="' + n[2] + "," + (y - 18) + " " + (n[2] + 18) + "," + y + " " + n[2] + "," + (y + 18) + " " + (n[2] - 18) + "," + y + '"/>' + tx(n[2], y, "×", { b:true, s:13 });
      else g += rect(n[2] - 46, y - 22, 92, 44, "dgb1", 8);
      if (n[4]) g += n[3] === "t" ? tx(n[2], y, n[4], { s:10.5, n:16 }) : tx(n[2], y + (n[3] === "g" ? -27 : 25), n[4], { s:10, n:18, cls:"dgs" }); });
    const off = p => p[2] === "t" ? 46 : p[2] === "g" ? 18 : 13, offV = p => p[2] === "t" ? 22 : p[2] === "g" ? 18 : 13;
    edges.forEach(e => { const a = P[e[0]], b = P[e[1]]; if (a[1] === b[1]) g += arrow(a[0] + off(a), a[1], b[0] - off(b) - 2, b[1]); else { const mx = b[0]; g += ln(a[0] + (a[0] < mx ? off(a) : 0), a[1], mx, a[1]) + arrow(mx, a[1], mx, b[1] + (b[1] > a[1] ? -offV(b) - 2 : offV(b) + 2)); } if (e[2]) g += tx((a[0] + b[0]) / 2 + 6, a[1] - 9, e[2], { s:9.5, b:true, cls:"dgs" }); });
    return fig(W, H, g, cap, 540); },
  // Diagrama entidad-relación: ents [[nombre, x, y, [atributos]]], rels [[a, b, texto, card a, card b]]
  er(ents, rels, cap){ const W = 620, bw = 150; let H = 0; const P = {}; let g = "";
    ents.forEach(e => { const h = 26 + e[3].length * 17 + 6; P[e[0]] = [e[1], e[2], h]; H = Math.max(H, e[2] + h + 14); });
    rels.forEach(r => { const a = P[r[0]], b = P[r[1]], ax = a[0] + bw / 2, ay = a[1] + a[2] / 2, bx = b[0] + bw / 2, by = b[1] + b[2] / 2; const hz = Math.abs(bx - ax) > Math.abs(by - ay); g += ln(ax, ay, bx, by, "dga") + (hz ? tx((ax + bx) / 2, (ay + by) / 2 + 14, r[2], { s:10, cls:"dgs", n:14 }) : tx((ax + bx) / 2 + 30, (ay + by) / 2, r[2], { s:10, cls:"dgs", a:"start", n:14 }));
      });
    let cards = ""; rels.forEach(r => { const a = P[r[0]], b = P[r[1]], ax = a[0] + bw / 2, ay = a[1] + a[2] / 2, bx = b[0] + bw / 2, by = b[1] + b[2] / 2, hor = Math.abs(bx - ax) > Math.abs(by - ay);
      const edge = (p, ox, oy, tx0, ty0) => hor ? [ox + (tx0 > ox ? bw / 2 + 10 : -bw / 2 - 10), oy - 8] : [ox + 12, oy + (ty0 > oy ? p[2] / 2 + 10 : -p[2] / 2 - 8)];
      const ca = edge(a, ax, ay, bx, by), cb = edge(b, bx, by, ax, ay); cards += '<circle class="dgnc" cx="' + ca[0] + '" cy="' + ca[1] + '" r="9"/><text class="dgnt" x="' + ca[0] + '" y="' + (ca[1] + 4) + '" text-anchor="middle">' + esc(r[3]) + '</text><circle class="dgnc" cx="' + cb[0] + '" cy="' + cb[1] + '" r="9"/><text class="dgnt" x="' + cb[0] + '" y="' + (cb[1] + 4) + '" text-anchor="middle">' + esc(r[4]) + "</text>"; });
    ents.forEach(e => { const [x, y, h] = P[e[0]]; g += rect(x, y, bw, h, "dgbl", 6) + rect(x, y, bw, 24, "dgb1", 6) + tx(x + bw / 2, y + 12, e[0], { b:true, s:11.5 }) + e[3].map((a, i) => tx(x + 10, y + 36 + i * 17, a, { a:"start", s:10.5, n:26 })).join(""); });
    return fig(W, H, g + cards, cap, 520); },
  // Espina de pescado (Ishikawa): efecto, cats [[nombre, [causas]]]
  fishbone(effect, cats, cap){ /* F4: mismo diseño que el Ishikawa de la calculadora */ const h = ishiSVG(effect, cats); return cap ? h.replace(/<figcaption>[\s\S]*<\/figcaption>/, "<figcaption>" + cap + "</figcaption>") : h; },
  // Dispersión con recta de ajuste: pts [[x,y]]
  scatter(pts, cap, o){ o = o || {}; const W = 560, H = 250, xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), X = x => 55 + (x - x0) / (x1 - x0 || 1) * 480, Y = y => 205 - (y - y0) / (y1 - y0 || 1) * 175;
    let g = ln(50, 210, 545, 210, "ax") + ln(50, 20, 50, 210, "ax") + tx(300, 238, o.xl || "x", { s:11, cls:"dgs" }) + '<text x="16" y="115" transform="rotate(-90 16 115)" text-anchor="middle" class="mu">' + esc(o.yl || "y") + "</text>";
    pts.forEach(p => g += '<circle class="dgb1" cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="4.5"/>');
    if (o.fit !== false) { const n = pts.length, mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n, b = pts.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0) / pts.reduce((s, p) => s + (p[0] - mx) ** 2, 0), a = my - b * mx; g += ln(X(x0), Y(a + b * x0), X(x1), Y(a + b * x1), "s2"); }
    return fig(W, H, g, cap, 420); },
  // Comparación de layouts
  layouts(cap){ const W = 640, H = 260; let g = tx(160, 18, "Por proceso (funcional)", { b:true }) + tx(480, 18, "Por producto (en línea)", { b:true });
    [["Tornos", 30, 40], ["Fresas", 170, 40], ["Taladros", 30, 140], ["Pintura", 170, 140]].forEach(a => g += rect(a[1], a[2], 120, 70, "dgb1", 6) + tx(a[1] + 60, a[2] + 35, a[0], { b:true, s:11 }));
    g += '<polyline class="s2" points="90,75 230,75 90,175 230,175"/><polyline class="s3" points="230,75 90,175 230,175" style="stroke-dasharray:5 4"/>' + tx(160, 238, "Flujos cruzados: flexible, para mucha variedad y poco volumen", { s:10.5, cls:"dgs", n:46 });
    ["Corte", "Torneado", "Fresado", "Pintura"].forEach((s, i) => { const x = 350 + i * 72; g += rect(x, 100, 60, 50, "dgb2", 6) + tx(x + 30, 125, s, { s:10, b:true, n:9 }); if (i < 3) g += arrow(x + 60, 125, x + 71, 125); });
    g += tx(480, 238, "Flujo en línea recta: eficiente para alto volumen y poca variedad", { s:10.5, cls:"dgs", n:46 });
    return fig(W, H, g, cap || "Distribución por proceso (izquierda) y por producto (derecha). También existen la distribución por posición fija (el producto no se mueve, como un barco) y la celular (celdas con varias máquinas para una familia de productos).", 520); },
  // Diagrama de cuerpo libre de una viga simplemente apoyada
  beam(L, loads, cap){ const W = 560, H = 210, X = x => 60 + x / L * 440; let g = rect(60, 100, 440, 14, "dgb5", 2) + '<polygon class="dgb3" points="60,114 46,140 74,140"/><circle class="dgb3" cx="500" cy="127" r="12"/>' + tx(60, 156, "Apoyo A", { s:10.5 }) + tx(500, 156, "Apoyo B", { s:10.5 });
    let MA = 0, F = 0; loads.forEach(l => { g += arrow(X(l[0]), 40, X(l[0]), 97, "dgcrit") + tx(X(l[0]), 30, l[1] + " N", { b:true, s:11 }); MA += l[0] * l[1]; F += l[1]; });
    const RB = MA / L, RA = F - RB; g += arrow(60, 195, 60, 143, "dgup") + arrow(500, 195, 500, 141, "dgup") + tx(95, 185, "R_A = " + Math.round(RA) + " N", { s:11, b:true, a:"start" }) + tx(465, 185, "R_B = " + Math.round(RB) + " N", { s:11, b:true, a:"end" }) + tx(280, 82, "L = " + L + " m", { s:10.5, cls:"dgs" });
    return fig(W, H, g, cap, 420); },
  // Triángulo rectángulo para trigonometría
  triangle(cap){ const W = 480, H = 230; let g = '<polygon class="dgfill" points="60,190 380,190 380,40"/>' + ln(60, 190, 380, 190, "s1") + ln(380, 190, 380, 40, "s2") + ln(60, 190, 380, 40, "s3") + rect(366, 176, 14, 14, "dgbl", 0) +
      tx(220, 208, "Cateto adyacente (a)", { s:11, b:true }) + tx(440, 115, "Cateto opuesto (b)", { s:11, b:true, n:10 }) + tx(200, 98, "Hipotenusa (c)", { s:11, b:true }) + tx(100, 178, "θ", { s:14, b:true }) +
      tx(300, 165, "sen θ = b ÷ c · cos θ = a ÷ c · tan θ = b ÷ a", { s:10, cls:"dgs", n:24 });
    return fig(W, H, g, cap || "Triángulo rectángulo: las razones trigonométricas relacionan sus lados con el ángulo θ. Se usan para pendientes de correas transportadoras, rampas, fuerzas en cables y vectores.", 360); },
  // Tablero kanban
  kanban(cap){ const W = 600, H = 220, cols = [["Por hacer", ["Pedido 104", "Pedido 105", "Pedido 106"]], ["En proceso (máx. 2)", ["Pedido 102", "Pedido 103"]], ["Terminado", ["Pedido 100", "Pedido 101"]]]; let g = "";
    cols.forEach((c, i) => { const x = 15 + i * 195; g += rect(x, 10, 180, 200, "dgbl", 8) + tx(x + 90, 28, c[0], { b:true, s:11.5 }); c[1].forEach((t, j) => g += rect(x + 15, 46 + j * 50, 150, 38, ["dgb4", "dgb1", "dgb3"][i], 6) + tx(x + 90, 65 + j * 50, t, { s:11 })); if (i < 2) g += arrow(x + 182, 110, x + 193, 110); });
    return fig(W, H, g, cap || "Tablero kanban: cada tarjeta es un trabajo; limitar cuántos pueden estar «en proceso» evita la sobrecarga y acorta el tiempo de entrega.", 460); },
  // Costo-volumen-utilidad
  cvp(cf, p, cv, qmax, cap){ /* F4: zonas de pérdida y utilidad, punto de equilibrio y grilla */
    const W = 620, H = 290, L = 64, R = 590, B = 240, T = 22, ymax = p * qmax * 1.08, X = q => L + q / qmax * (R - L), Y = v => B - v / ymax * (B - T), qe = cf / (p - cv), ct = q => cf + cv * q;
    let g = ""; [0.25, 0.5, 0.75, 1].forEach(t => g += ln(L, Y(ymax * t), R, Y(ymax * t), "gr") + ln(X(qmax * t), T, X(qmax * t), B, "gr gv"));
    g += '<polygon class="cvp-loss" points="' + X(0) + "," + Y(0) + " " + X(qe) + "," + Y(p * qe) + " " + X(0) + "," + Y(cf) + '"/><polygon class="cvp-gain" points="' + X(qe) + "," + Y(p * qe) + " " + X(qmax) + "," + Y(p * qmax) + " " + X(qmax) + "," + Y(ct(qmax)) + '"/>';
    g += ln(L, B, R, B, "ax") + ln(L, T, L, B, "ax") + ln(X(0), Y(cf), X(qmax), Y(cf), "sm") + ln(X(0), Y(cf), X(qmax), Y(ct(qmax)), "s2") + ln(X(0), Y(0), X(qmax), Y(p * qmax), "s1") + ln(X(qe), T, X(qe), B, "sb");
    g += '<circle class="pt d2" cx="' + X(qe) + '" cy="' + Y(p * qe) + '" r="6" data-tip="Equilibrio: ' + Math.round(qe).toLocaleString("es-CL") + ' unidades"/>';
    g += tx(X(qmax) - 6, Y(p * qmax) + 18, "Ingresos", { a:"end", s:13, b:true, cls:"halo" }) + tx(X(qmax) - 6, Y(ct(qmax)) + 20, "Costo total", { a:"end", s:13, b:true, cls:"halo" }) + tx(X(qmax) - 6, Y(cf) - 10, "Costo fijo", { a:"end", s:13, cls:"dgs halo" }) +
      tx(X(qe) + 8, T + 14, "Equilibrio: " + Math.round(qe) + " u", { a:"start", s:13, b:true, cls:"halo" }) + tx(X(qe * 0.42), Y(cf * 0.62), "Pérdida", { s:13, b:true, cls:"cvp-lt" }) + tx(X(qe + (qmax - qe) * 0.62), Y(p * (qe + (qmax - qe) * 0.62)) + 34, "Utilidad", { s:13, b:true, cls:"cvp-gt" }) + tx((L + R) / 2, H - 10, "unidades vendidas", { s:13, cls:"dgs" });
    return fig(W, H, g, cap); },
  // Gantt simple: tareas [[nombre, inicio, duración, crítica]]
  gantt2(tasks, cap){ const W = 600, rh = 28, L = 150, T = 26, end = Math.max(...tasks.map(t => t[1] + t[2])), H = T + tasks.length * rh + 26, X = x => L + x / end * (W - L - 16); let g = "";
    for (let t = 0; t <= end; t++) g += ln(X(t), T - 6, X(t), H - 22, "ax", "opacity:.35") + tx(X(t), H - 10, String(t), { s:9.5, cls:"dgs" });
    tasks.forEach((t, i) => { const y = T + i * rh; g += tx(L - 8, y + rh / 2, t[0], { a:"end", s:11, n:24 }); });
    tasks.forEach((t, i) => { const y = T + i * rh; g += rect(X(t[1]), y + 5, X(t[1] + t[2]) - X(t[1]), rh - 10, t[3] ? "dgbh" : "dgb1", 4); });
    return fig(W, H, g, cap, 460); }
});
