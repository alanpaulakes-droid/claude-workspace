/* ============ FASE 4: DIAGRAMAS SVG REUTILIZABLES (flujo y layout) ============
   Estilo uniforme con las clases de color del tema (se adaptan a modo claro y oscuro). */
let DGN = 0;
const dgWrap = (s, n) => { const w = String(s).split(/\s+/), out = []; let l = ""; w.forEach(x => { if ((l + " " + x).trim().length > n && l) { out.push(l); l = x; } else l = (l + " " + x).trim(); }); if (l) out.push(l); return out; };
const dgText = (x, y, lines, o) => { o = o || {}; const lh = o.lh || 15, y0 = y - (lines.length - 1) * lh / 2; return lines.map((l, i) => '<text x="' + x + '" y="' + (y0 + i * lh + 4) + '" text-anchor="' + (o.a || "middle") + '"' + (o.cls ? ' class="' + o.cls + '"' : "") + (o.st ? ' style="' + o.st + '"' : "") + ">" + esc(l) + "</text>").join(""); };
const dgDefs = id => '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="dgah"/></marker></defs>';

/* Diagrama de flujo. nodos: [{t:'ini'|'fin'|'pro'|'io'|'dec', x:'texto', si:'texto rama', side:{t, x, to:índice}, lbl:['No','Sí']}] */
function FC(nodes, cap){
  const mk = "fa" + (++DGN), CX = 190, SX = 470, W = 640, gap = 34, out = []; let y = 24, g = "";
  const dims = n => { const L = dgWrap(n.x, n.t === "dec" ? 22 : 32).slice(0, 3); const h = n.t === "dec" ? Math.max(78, L.length * 15 + 42) : n.t === "ini" || n.t === "fin" ? 38 : L.length * 15 + 22; const w = n.t === "dec" ? 250 : n.t === "ini" || n.t === "fin" ? 170 : 240; return { L, h, w }; };
  const shape = (n, cx, cy, d) => { const { w, h } = d;
    if (n.t === "ini" || n.t === "fin") return '<rect class="dgbl" x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '"/>';
    if (n.t === "io") return '<polygon class="dgb3" points="' + (cx - w / 2 + 14) + "," + (cy - h / 2) + " " + (cx + w / 2) + "," + (cy - h / 2) + " " + (cx + w / 2 - 14) + "," + (cy + h / 2) + " " + (cx - w / 2) + "," + (cy + h / 2) + '"/>';
    if (n.t === "dec") return '<polygon class="dgb2" points="' + cx + "," + (cy - h / 2) + " " + (cx + w / 2) + "," + cy + " " + cx + "," + (cy + h / 2) + " " + (cx - w / 2) + "," + cy + '"/>';
    return '<rect class="dgb1" x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="6"/>'; };
  nodes.forEach(n => { const d = dims(n); out.push({ n, d, cy:y + d.h / 2 }); y += d.h + gap; });
  const H = y - gap + 24;
  out.forEach((o, i) => { const { n, d, cy } = o; g += shape(n, CX, cy, d) + dgText(CX, cy, d.L, { st:n.t === "ini" || n.t === "fin" ? "font-weight:600" : "" });
    if (i < out.length - 1) { const nx = out[i + 1]; g += '<line class="dga" x1="' + CX + '" y1="' + (cy + d.h / 2) + '" x2="' + CX + '" y2="' + (nx.cy - nx.d.h / 2 - 2) + '" marker-end="url(#' + mk + ')"/>';
      if (n.t === "dec") g += '<text x="' + (CX + 8) + '" y="' + (cy + d.h / 2 + 16) + '" class="mu">' + esc((n.lbl || ["No", "Sí"])[0]) + "</text>"; }
    if (n.side) { const s = n.side, sd = dims(s); g += '<line class="dga" x1="' + (CX + d.w / 2) + '" y1="' + cy + '" x2="' + (SX - sd.w / 2 - 2) + '" y2="' + cy + '" marker-end="url(#' + mk + ')"/><text x="' + (CX + d.w / 2 + 8) + '" y="' + (cy - 7) + '" class="mu">' + esc((n.lbl || ["No", "Sí"])[1]) + "</text>" + shape(s, SX, cy, sd) + dgText(SX, cy, sd.L);
      if (s.to != null && out[s.to]) { const tg = out[s.to], tx = CX + tg.d.w / 2 + 2, up = tg.cy < cy, sy = up ? cy - sd.h / 2 : cy + sd.h / 2;
        g += '<polyline class="dga" points="' + SX + "," + sy + " " + SX + "," + tg.cy + " " + tx + "," + tg.cy + '" marker-end="url(#' + mk + ')"/>'; } } });
  return '<figure class="ch dg"><div class="sv"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Diagrama de flujo" style="min-width:440px">' + dgDefs(mk) + g + '</svg></div><figcaption>' + (cap || "") + ' Símbolos: óvalo = inicio/fin; rectángulo = proceso; paralelogramo = entrada/salida; rombo = decisión.</figcaption></figure>'; }

/* Layout de 2 × 2 áreas: compara dos disposiciones con líneas de flujo de grosor proporcional a los viajes */
function LAYD(names, flows, a, b, cap){
  const pos = [[0, 0], [1, 0], [0, 1], [1, 1]], cell = 90, pad = 30, PW = 2 * cell + 2 * pad + 20;
  const mx = Math.max.apply(null, flows.map(f => f[2]));
  const panel = (ord, ox, title, total) => { let g = '<text x="' + (ox + PW / 2) + '" y="18" text-anchor="middle" style="font-weight:600">' + esc(title) + "</text>";
    const P = {}; ord.forEach((d, i) => { P[d] = [ox + pad + 10 + pos[i][0] * cell + cell / 2, 34 + pos[i][1] * cell + cell / 2]; });
    let nd = 0, labs = ""; flows.forEach(([u, v, f]) => { const [x1, y1] = P[u], [x2, y2] = P[v], w = 1 + 7 * f / mx, diag = x1 !== x2 && y1 !== y2, t = diag ? (nd++ % 2 ? 0.72 : 0.28) : 0.5, lx = x1 + (x2 - x1) * t + (x1 === x2 ? 8 : 0), ly = y1 + (y2 - y1) * t + (y1 === y2 ? -7 : 4);
      g += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="ly-fl" stroke-width="' + w + '"/>'; labs += '<text x="' + lx + '" y="' + ly + '" class="ly-ft" text-anchor="' + (x1 === x2 ? "start" : "middle") + '" style="paint-order:stroke;stroke:var(--surface);stroke-width:4px">' + f + "</text>"; });
    ord.forEach(d => { const [x, y] = P[d]; g += '<rect class="dgb1" x="' + (x - 26) + '" y="' + (y - 18) + '" width="52" height="36" rx="6"/>' + dgText(x, y, [names[d] || d], { st:"font-weight:600" }); });
    g += labs;
    g += '<text x="' + (ox + PW / 2) + '" y="' + (34 + 2 * cell + 22) + '" text-anchor="middle" class="mu">Viajes × m = ' + total + "</text>"; return g; };
  const W = 2 * PW + 20, H = 34 + 2 * cell + 34;
  return '<figure class="ch dg"><div class="sv"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Comparación de layouts" style="min-width:420px">' + panel(a[0], 0, a[1], a[2]) + panel(b[0], PW + 20, b[1], b[2]) + "</svg></div><figcaption>" + (cap || "") + "</figcaption></figure>"; }
