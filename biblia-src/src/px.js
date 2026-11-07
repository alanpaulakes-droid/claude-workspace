/* ============ EXPORTACIÓN A WORD (.docx) Y PDF ============ */
/* Modelo intermedio: se recorre el HTML del documento y se convierte en bloques
   {t:"h"|"p"|"li"|"table"|"img"|"pb", ...}; luego cada bloque se escribe en DOCX o PDF. */
const XE = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const CLEAN = s => String(s || "").replace(/ /g, " ").replace(/[ \t]+/g, " ");

function runsOf(node, fmt, out){
  fmt = fmt || {}; out = out || [];
  node.childNodes.forEach(ch => {
    if (ch.nodeType === 3) { const t = CLEAN(ch.textContent); if (t) out.push(Object.assign({ text:t }, fmt)); return; }
    if (ch.nodeType !== 1) return;
    const tg = ch.tagName, cl = ch.classList;
    if (tg === "BUTTON" || tg === "INPUT" || tg === "TEXTAREA" || tg === "SELECT" || cl.contains("no-print")) return;
    if (tg === "BR") { out.push(Object.assign({ text:"\n" }, fmt)); return; }
    const f = Object.assign({}, fmt);
    if (tg === "B" || tg === "STRONG") f.b = true;
    if (tg === "I" || tg === "EM") f.i = true;
    if (cl.contains("mono") || tg === "CODE") f.mono = true;
    if (cl.contains("tx")) { out.push(Object.assign(ch.dataset.alt ? { text:"", mx:ch.dataset.alt } : { text:ch.dataset.tex || CLEAN(ch.textContent), mono:true }, fmt)); return; }
    if (cl.contains("mx")) { out.push(Object.assign({ text:"", mx:ch.dataset.lin }, fmt)); return; }
    if (cl.contains("pill")) { const t = CLEAN(ch.textContent).trim(); if (t) out.push(Object.assign({ text:"[" + t + "]" }, f, { b:true })); return; }
    runsOf(ch, f, out);
  });
  return out;
}
const trimRuns = r => { while (r.length && !r[0].mx && !r[0].text.trim()) r.shift(); while (r.length && !r[r.length - 1].mx && !r[r.length - 1].text.trim()) r.pop(); if (r.length && !r[0].mx) r[0] = Object.assign({}, r[0], { text:r[0].text.replace(/^\s+/, "") }); const k = r.length - 1; if (r.length && !r[k].mx) r[k] = Object.assign({}, r[k], { text:r[k].text.replace(/\s+$/, "") }); return r; };
const txt = el => CLEAN(el.innerText || el.textContent || "").trim();

async function svgToImage(svg){
  const clone = svg.cloneNode(true), src = [svg].concat([...svg.querySelectorAll("*")]), dst = [clone].concat([...clone.querySelectorAll("*")]);
  src.forEach((s, i) => { const cs = getComputedStyle(s), d = dst[i]; if (!d || !d.setAttribute) return;
    ["fill", "stroke", "stroke-width", "stroke-dasharray", "opacity", "font-size", "font-weight", "text-anchor"].forEach(p => { const v = cs.getPropertyValue(p); if (v) d.setAttribute(p, v); });
    if (s.tagName === "text") d.setAttribute("font-family", "Arial, Helvetica, sans-serif"); });
  const vb = (svg.getAttribute("viewBox") || "0 0 760 300").split(/\s+/).map(Number), W = vb[2], H = vb[3];
  clone.setAttribute("width", W); clone.setAttribute("height", H); clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const data = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(clone));
  const img = new Image(); await new Promise((ok, ko) => { img.onload = ok; img.onerror = ko; img.src = data; });
  const sc = 2, cv = document.createElement("canvas"); cv.width = W * sc; cv.height = H * sc; const cx = cv.getContext("2d");
  cx.fillStyle = "#ffffff"; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(img, 0, 0, cv.width, cv.height);
  return { url:cv.toDataURL("image/png"), w:W, h:H };
}

async function toModel(root){
  const B = [], prevTheme = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute("data-theme", "light");
  let lastH = "";
  const P = (runs, style) => { runs = trimRuns(runs); if (runs.length) B.push({ t:"p", runs, style:style || "normal" }); };
  async function walk(el, lvl){
    for (const ch of [...el.children]) {
      const tg = ch.tagName, cl = ch.classList;
      if (tg === "BUTTON" || tg === "SCRIPT" || tg === "STYLE" || cl.contains("no-print") || cl.contains("actions") || cl.contains("exnote") || cl.contains("stale") || cl.contains("noexp") || ch.hidden) continue;
      if (cl.contains("mblk")) { B.push({ t:"math", lin:ch.dataset.lin }); continue; }
      if (["t8-nav", "t8-refs", "t8-pend", "bcrumb", "favb", "xlinks", "retbar", "livechk", "cnt"].some(k => cl.contains(k))) continue;
      if (cl.contains("tx")) { if (ch.dataset.alt) B.push({ t:"math", lin:ch.dataset.alt }); else P([{ text:ch.dataset.tex || txt(ch), mono:true }], "formula"); continue; }
      if (cl.contains("t8-h")) { const n = ch.querySelector(".t8-n"), c = ch.cloneNode(true); c.querySelectorAll(".t8-n,.cnt").forEach(x => x.remove()); B.push({ t:"h", lvl:1, text:(n ? txt(n) + ". " : "") + txt(c) }); continue; }
      if (cl.contains("c-h")) { P(runsOf(ch).map(r => Object.assign({}, r, { b:true })), "res"); continue; }
      if (tg === "DETAILS" && (cl.contains("c-hint") || cl.contains("c-why"))) { const s = ch.querySelector(":scope > summary"); if (s) P([{ text:txt(s), b:true, i:true }]); const bd = [...ch.children].filter(x => x.tagName !== "SUMMARY"); for (const x of bd) { if (x.tagName === "DIV" && !x.className) await walk(x, lvl); else { const w = document.createElement("div"); w.appendChild(x.cloneNode(true)); await walk(w, lvl); } } continue; }
      if (/^H[1-4]$/.test(tg)) { const t = txt(ch); if (t) { B.push({ t:"h", lvl:Math.min(3, +tg[1] - 1 || 1), text:t }); lastH = t; } continue; }
      if (tg === "P") { P(runsOf(ch), cl.contains("eyebrow") || cl.contains("hint") || cl.contains("meta") ? "small" : cl.contains("why") ? "why" : cl.contains("r") ? "res" : "normal"); continue; }
      if (tg === "UL" || tg === "OL") { let n = 0; for (const li of ch.children) { if (li.tagName !== "LI") continue; n++; const sub = li.querySelector("ul,ol"); const lc = li.cloneNode(true); lc.querySelectorAll("ul,ol").forEach(x => x.remove()); const r = trimRuns(runsOf(lc)); if (r.length) B.push({ t:"li", ord:tg === "OL", n, lvl:lvl || 0, runs:r }); if (sub) await walk({ children:[sub] }, (lvl || 0) + 1); } continue; }
      if (tg === "DL") { let dt = ""; for (const x of ch.children) { if (x.hidden) continue; if (x.tagName === "DT") dt = txt(x); else P([{ text:dt + ": ", b:true }].concat(runsOf(x))); } continue; }
      if (tg === "TABLE") { const rows = []; ch.querySelectorAll("tr").forEach(tr => { const cells = [...tr.children].map(td => ({ text:txt(td), b:td.tagName === "TH" || tr.classList.contains("tot"), num:td.classList.contains("num") })); if (cells.some(c => c.text)) rows.push({ cells, head:tr.parentNode.tagName === "THEAD" }); }); if (rows.length) B.push({ t:"table", rows, cap:lastH }); continue; }
      if (tg === "PRE") { txt(ch).split("\n").forEach(l => B.push({ t:"p", runs:[{ text:l || " ", mono:true }], style:"code" })); continue; }
      if (tg === "FIGURE") { const svg = ch.querySelector("svg"); if (svg) { try { const im = await svgToImage(svg); im.cap = svg.getAttribute("aria-label") || "Gráfico"; const fc = ch.querySelector("figcaption"); if (fc && txt(fc).trim() !== im.cap.trim()) im.note = txt(fc); B.push(Object.assign({ t:"img" }, im)); } catch (e) {} } continue; }
      if (tg === "DETAILS") { const s = ch.querySelector(":scope > summary"); if (s && txt(s)) B.push({ t:"h", lvl:cl.contains("item") && ch.closest(".t8") ? 2 : 3, text:txt(s) }); const body = ch.querySelector(":scope > .body") || ch; await walk(body, lvl); continue; }
      if (tg === "SUMMARY") continue;
      if (cl.contains("kpis")) { const rows = [...ch.querySelectorAll(".kpi")].map(k => ({ cells:[{ text:txt(k.querySelector(".l")), b:true }, { text:txt(k.querySelector(".v")) }] })); if (rows.length) B.push({ t:"table", rows:[{ head:true, cells:[{ text:"Indicador", b:true }, { text:"Valor", b:true }] }].concat(rows), cap:"Resumen de resultados", kp:true }); continue; }
      if (cl.contains("steps")) { for (const st of ch.querySelectorAll(":scope > .step")) { const n = txt(st.querySelector(".sn")), h4 = st.querySelector("h4"); P([{ text:"Paso " + n + ". ", b:true }, { text:h4 ? txt(h4) : "", b:true }], "stepT");
          for (const x of st.querySelectorAll(".sb > *")) { if (x.tagName === "H4") continue; if (x.classList.contains("mblk")) B.push({ t:"math", lin:x.dataset.lin }); else if (x.classList.contains("f")) P([{ text:txt(x), mono:true }], "formula"); else if (x.classList.contains("why")) P([{ text:"Fundamento: ", b:true, i:true }].concat(runsOf(x).map(r => Object.assign({}, r, { i:true })).filter(r => !/^¿Por qué\?\s*$/.test(r.text.trim()))), "why"); else if (x.classList.contains("r")) P(runsOf(x).map(r => Object.assign({}, r, { b:true })), "res"); else P(runsOf(x)); } } continue; }
      if (cl.contains("note")) { P(runsOf(ch), "note"); continue; }
      if (cl.contains("f")) { P([{ text:txt(ch), mono:true }], "formula"); continue; }
      if (cl.contains("foda")) { const q = [...ch.children].map(d => ({ text:txt(d.querySelector("h3")), items:[...d.querySelectorAll("li")].map(txt) })); B.push({ t:"table", rows:[{ head:true, cells:[{ text:q[0].text, b:true }, { text:q[1].text, b:true }] }, { cells:[{ text:q[0].items.join("\n") }, { text:q[1].items.join("\n") }] }, { head:true, cells:[{ text:q[2].text, b:true }, { text:q[3].text, b:true }] }, { cells:[{ text:q[2].items.join("\n") }, { text:q[3].items.join("\n") }] }], cap:"Matriz FODA" }); continue; }
      if (cl.contains("canvas9")) { B.push({ t:"table", rows:[{ head:true, cells:[{ text:"Bloque", b:true }, { text:"Contenido", b:true }] }].concat([...ch.children].map(d => ({ cells:[{ text:txt(d.querySelector("h4")), b:true }, { text:[...d.querySelectorAll("li")].map(txt).join("\n") }] }))), cap:"Modelo Canvas" }); continue; }
      if (cl.contains("chain")) { [...ch.children].forEach(d => P(runsOf(d), d.classList.contains("root") ? "res" : "normal")); continue; }
      if (cl.contains("kpi") || cl.contains("legend")) continue;
      if (tg === "DIV" && ch.children.length === 0 && txt(ch)) { P(runsOf(ch)); continue; }
      await walk(ch, lvl);
    }
  }
  try { await walk(root, 0); } finally { if (prevTheme) document.documentElement.setAttribute("data-theme", prevTheme); else document.documentElement.removeAttribute("data-theme"); }
  return B;
}

/* ---------- ZIP (sin compresión) ---------- */
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = u => { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = CRC[(c ^ u[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
function zip(files){
  const enc = new TextEncoder(), parts = [], cen = []; let off = 0;
  files.forEach(f => { const name = enc.encode(f.name), data = typeof f.data === "string" ? enc.encode(f.data) : f.data, crc = crc32(data);
    const lh = new DataView(new ArrayBuffer(30)); lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true); lh.setUint16(10, 0, true); lh.setUint16(12, 0x21, true); lh.setUint32(14, crc, true); lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true); lh.setUint16(26, name.length, true); lh.setUint16(28, 0, true);
    parts.push(new Uint8Array(lh.buffer), name, data);
    const ch = new DataView(new ArrayBuffer(46)); ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true); ch.setUint16(12, 0, true); ch.setUint16(14, 0x21, true); ch.setUint32(16, crc, true); ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true); ch.setUint16(28, name.length, true); ch.setUint32(42, off, true);
    cen.push(new Uint8Array(ch.buffer), name); off += 30 + name.length + data.length; });
  const csz = cen.reduce((s, u) => s + u.length, 0), end = new DataView(new ArrayBuffer(22)); end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, csz, true); end.setUint32(16, off, true);
  return new Blob(parts.concat(cen, [new Uint8Array(end.buffer)]), { type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}
const b64bytes = d => { const s = atob(d.split(",")[1]), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; };

/* ---------- DOCX ---------- */
function buildDocx(meta, B){
  const media = []; let fig = 0, tab = 0, did = 1;
  const run = r => r.mx ? "<m:oMath>" + mOmml(mParse(r.mx)) + "</m:oMath>" : r.text.split("\n").map((t, i) => (i ? "<w:r><w:br/></w:r>" : "") + '<w:r><w:rPr>' + (r.b ? "<w:b/>" : "") + (r.i ? "<w:i/>" : "") + (r.mono ? '<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/><w:sz w:val="19"/>' : "") + '</w:rPr><w:t xml:space="preserve">' + XE(t) + "</w:t></w:r>").join("");
  const para = (runs, st, extra) => "<w:p><w:pPr>" + (st ? '<w:pStyle w:val="' + st + '"/>' : "") + (extra || "") + "</w:pPr>" + runs.map(run).join("") + "</w:p>";
  const SM = { normal:"", small:"Pequeno", why:"Fundamento", res:"Resultado", note:"Nota", formula:"Formula", stepT:"Paso", code:"Codigo" };
  let body = "";
  body += para([{ text:meta.kind || "Documento técnico" }], "Antetitulo") + para([{ text:meta.title }], "Title") + (meta.subtitle ? para([{ text:meta.subtitle }], "Subtitle") : "");
  body += '<w:p><w:pPr><w:spacing w:before="2400"/></w:pPr></w:p>';
  (meta.lines || []).forEach(l => { body += para([{ text:l[0] + ": ", b:true }, { text:l[1] }], "Portada"); });
  body += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
  if (meta.toc !== false) { body += para([{ text:"Índice" }], "TOCHeading") + '<w:p><w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "1-2" \\h \\z \\u </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>Para ver el índice: clic derecho aquí y «Actualizar campos».</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p><w:p><w:r><w:br w:type="page"/></w:r></w:p>'; }
  B.forEach(b => {
    if (b.t === "math") String(b.lin).split(/ {3,}·? {0,}|\n/).filter(x => x.trim()).forEach(part => { body += '<w:p><w:pPr><w:spacing w:before="60" w:after="60"/><w:ind w:left="340"/></w:pPr><m:oMathPara><m:oMathParaPr><m:jc m:val="left"/></m:oMathParaPr><m:oMath>' + mOmml(mParse(part.trim().replace(/^·\s*/, ""))) + "</m:oMath></m:oMathPara></w:p>"; });
    else if (b.t === "h") body += para([{ text:b.text }], "Heading" + b.lvl);
    else if (b.t === "p") body += para(b.runs, SM[b.style] || "");
    else if (b.t === "li") body += para([{ text:(b.ord ? b.n + ".\t" : "•\t") }].concat(b.runs), "Lista", '<w:ind w:left="' + (500 + b.lvl * 400) + '" w:hanging="300"/>');
    else if (b.t === "table") { tab++; const nc = Math.max.apply(null, b.rows.map(r => r.cells.length)), w = Math.floor(9300 / nc);
      body += para([{ text:"Tabla " + tab + ". ", b:true }, { text:b.cap || "Resultados" }], "Caption");
      body += '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders><w:top w:val="single" w:sz="8" w:color="1E4E78"/><w:bottom w:val="single" w:sz="8" w:color="1E4E78"/><w:insideH w:val="single" w:sz="4" w:color="C8D2DC"/><w:insideV w:val="single" w:sz="4" w:color="E1E7ED"/><w:left w:val="nil"/><w:right w:val="nil"/></w:tblBorders><w:tblCellMar><w:top w:w="50" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="50" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>' + Array(nc).fill('<w:gridCol w:w="' + w + '"/>').join("") + "</w:tblGrid>";
      b.rows.forEach(r => { body += "<w:tr>" + (r.head ? "<w:trPr><w:tblHeader/></w:trPr>" : "") + r.cells.map(c => "<w:tc><w:tcPr>" + (r.head ? '<w:shd w:val="clear" w:color="auto" w:fill="1E4E78"/>' : "") + "</w:tcPr>" + para([{ text:c.text || "", b:c.b || r.head }], r.head ? "TablaEncabezado" : "TablaTexto", c.num && !r.head ? '<w:jc w:val="right"/>' : "") + "</w:tc>").join("") + (r.cells.length < nc ? Array(nc - r.cells.length).fill("<w:tc><w:p/></w:tc>").join("") : "") + "</w:tr>"; });
      body += "</w:tbl>" + para([{ text:"Fuente: elaboración propia." }], "Fuente"); }
    else if (b.t === "img") { fig++; did++; const rid = "rIdImg" + fig, cx = 5600000, cy = Math.round(cx * b.h / b.w); media.push({ name:"word/media/figura" + fig + ".png", data:b64bytes(b.url), rid });
      body += '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="' + cx + '" cy="' + cy + '"/><wp:docPr id="' + did + '" name="Figura ' + fig + '"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="' + did + '" name="figura' + fig + '.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="' + rid + '"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>';
      body += para([{ text:"Figura " + fig + ". ", b:true }, { text:b.cap + (b.note ? ". " + b.note : "") }], "Caption"); }
  });
  const doc = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"><w:body>' + body +
    '<w:sectPr><w:footerReference w:type="default" r:id="rIdFtr"/><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1701" w:header="709" w:footer="709" w:gutter="0"/><w:titlePg/></w:sectPr></w:body></w:document>';
  const st = (id, name, ppr, rpr, type, based) => '<w:style w:type="' + (type || "paragraph") + '" w:styleId="' + id + '"><w:name w:val="' + name + '"/>' + (based ? '<w:basedOn w:val="' + based + '"/>' : "") + '<w:qFormat/><w:pPr>' + (ppr || "") + "</w:pPr><w:rPr>" + (rpr || "") + "</w:rPr></w:style>";
  const styles = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="es-CL"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="288" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:pPrDefault></w:docDefaults>' +
    st("Normal", "Normal") +
    st("Title", "Title", '<w:spacing w:before="1800" w:after="240"/><w:jc w:val="left"/>', '<w:b/><w:color w:val="14202C"/><w:sz w:val="44"/>', null, "Normal") +
    st("Subtitle", "Subtitle", '<w:jc w:val="left"/>', '<w:color w:val="56657A"/><w:sz w:val="28"/>', null, "Normal") +
    st("Antetitulo", "Antetitulo", '<w:jc w:val="left"/>', '<w:caps/><w:color w:val="B0522A"/><w:spacing w:val="20"/><w:sz w:val="20"/>', null, "Normal") +
    st("Portada", "Portada", '<w:spacing w:after="60"/><w:jc w:val="left"/>', '<w:sz w:val="22"/>', null, "Normal") +
    st("Heading1", "heading 1", '<w:keepNext/><w:spacing w:before="360" w:after="120"/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="1E4E78"/></w:pBdr><w:jc w:val="left"/><w:outlineLvl w:val="0"/>', '<w:b/><w:color w:val="1E4E78"/><w:sz w:val="30"/>', null, "Normal") +
    st("Heading2", "heading 2", '<w:keepNext/><w:spacing w:before="240" w:after="80"/><w:jc w:val="left"/><w:outlineLvl w:val="1"/>', '<w:b/><w:color w:val="14202C"/><w:sz w:val="25"/>', null, "Normal") +
    st("Heading3", "heading 3", '<w:keepNext/><w:spacing w:before="180" w:after="60"/><w:jc w:val="left"/><w:outlineLvl w:val="2"/>', '<w:b/><w:color w:val="B0522A"/><w:sz w:val="22"/>', null, "Normal") +
    st("TOCHeading", "TOC Heading", '<w:spacing w:after="240"/>', '<w:b/><w:color w:val="1E4E78"/><w:sz w:val="30"/>', null, "Normal") +
    st("Caption", "caption", '<w:keepNext/><w:spacing w:before="160" w:after="60"/><w:jc w:val="left"/>', '<w:i/><w:color w:val="1E4E78"/><w:sz w:val="19"/>', null, "Normal") +
    st("Fuente", "Fuente", '<w:spacing w:before="40" w:after="200"/><w:jc w:val="left"/>', '<w:i/><w:color w:val="56657A"/><w:sz w:val="17"/>', null, "Normal") +
    st("Pequeno", "Texto pequeño", '<w:jc w:val="left"/>', '<w:color w:val="56657A"/><w:sz w:val="19"/>', null, "Normal") +
    st("Fundamento", "Fundamento", '<w:ind w:left="340"/>', '<w:color w:val="3C4A5A"/><w:sz w:val="21"/>', null, "Normal") +
    st("Resultado", "Resultado", '<w:ind w:left="340"/>', '<w:color w:val="14202C"/>', null, "Normal") +
    st("Paso", "Paso", '<w:keepNext/><w:spacing w:before="200" w:after="60"/><w:jc w:val="left"/>', '<w:color w:val="1E4E78"/>', null, "Normal") +
    st("Formula", "Fórmula", '<w:shd w:val="clear" w:color="auto" w:fill="EEF3F8"/><w:spacing w:before="40" w:after="80"/><w:ind w:left="340"/><w:jc w:val="left"/>', '<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/><w:sz w:val="19"/>', null, "Normal") +
    st("Codigo", "Código", '<w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="left"/>', '<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/><w:sz w:val="18"/>', null, "Normal") +
    st("Nota", "Nota", '<w:shd w:val="clear" w:color="auto" w:fill="F7EFE3"/><w:pBdr><w:left w:val="single" w:sz="18" w:space="6" w:color="B0522A"/></w:pBdr><w:ind w:left="200"/><w:spacing w:before="120" w:after="160"/>', '<w:sz w:val="21"/>', null, "Normal") +
    st("Lista", "Lista", '<w:spacing w:after="60"/><w:jc w:val="left"/><w:tabs><w:tab w:val="left" w:pos="500"/></w:tabs>', "", null, "Normal") +
    st("TablaTexto", "Texto de tabla", '<w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="left"/>', '<w:sz w:val="18"/>', null, "Normal") +
    st("TablaEncabezado", "Encabezado de tabla", '<w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="left"/>', '<w:b/><w:color w:val="FFFFFF"/><w:sz w:val="18"/>', null, "Normal") +
    st("Footer", "footer", '<w:jc w:val="left"/><w:tabs><w:tab w:val="right" w:pos="9100"/></w:tabs>', '<w:color w:val="56657A"/><w:sz w:val="17"/>', null, "Normal") +
    st("TOC1", "toc 1", '<w:spacing w:after="60"/><w:jc w:val="left"/>', '<w:b/>', null, "Normal") + st("TOC2", "toc 2", '<w:ind w:left="220"/><w:spacing w:after="40"/><w:jc w:val="left"/>', "", null, "Normal") + "</w:styles>";
  const footer = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:p><w:pPr><w:pStyle w:val="Footer"/><w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="C8D2DC"/></w:pBdr></w:pPr><w:r><w:t xml:space="preserve">' + XE(meta.title.slice(0, 90)) + '</w:t></w:r><w:r><w:tab/><w:t xml:space="preserve">Página </w:t></w:r><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>1</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r><w:r><w:t xml:space="preserve"> de </w:t></w:r><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> NUMPAGES </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>1</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>';
  const rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdSt" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdSet" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/><Relationship Id="rIdFtr" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>' + media.map(m => '<Relationship Id="' + m.rid + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="' + m.name.replace("word/", "") + '"/>').join("") + "</Relationships>";
  const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
  return zip([
    { name:"[Content_Types].xml", data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>' },
    { name:"_rels/.rels", data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>' },
    { name:"docProps/core.xml", data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>' + XE(meta.title) + "</dc:title><dc:creator>" + XE(meta.author || "") + '</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">' + now + "</dcterms:created></cp:coreProperties>" },
    { name:"word/document.xml", data:doc }, { name:"word/styles.xml", data:styles },
    { name:"word/settings.xml", data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:updateFields w:val="true"/><w:defaultTabStop w:val="708"/><w:decimalSymbol w:val=","/><w:listSeparator w:val=";"/></w:settings>' },
    { name:"word/footer1.xml", data:footer }, { name:"word/_rels/document.xml.rels", data:rels }
  ].concat(media.map(m => ({ name:m.name, data:m.data }))));
}

/* ---------- PDF (pdfmake, se carga solo al exportar) ---------- */
function loadScript(urls){ return new Promise((ok, ko) => { const tryN = i => { if (i >= urls.length) return ko(new Error("No se pudo cargar el generador de PDF. Revisa tu conexión.")); const s = document.createElement("script"); s.src = urls[i]; s.onload = ok; s.onerror = () => { s.remove(); tryN(i + 1); }; document.head.appendChild(s); }; tryN(0); }); }
async function ensurePdfMake(){
  if (window.pdfMake && window.pdfMake.vfs) return;
  if (!window.pdfMake) await loadScript(["https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js", "https://cdn.jsdelivr.net/npm/pdfmake@0.2.7/build/pdfmake.min.js"]);
  if (!window.pdfMake.vfs) await loadScript(["https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js", "https://cdn.jsdelivr.net/npm/pdfmake@0.2.7/build/vfs_fonts.js"]);
}
const SUPM = { "⁰":"0", "¹":"1", "²":"2", "³":"3", "⁴":"4", "⁵":"5", "⁶":"6", "⁷":"7", "⁸":"8", "⁹":"9", "⁻":"-", "ⁿ":"n", "ᵇ":"b" };
const pdfTxt = s => String(s == null ? "" : s).replace(/(.)\u033f/g, "$1 doble barra").replace(/(.)\u0304/g, "$1 barra")
  .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, c => String("₀₁₂₃₄₅₆₇₈₉".indexOf(c))).replace(/ₓ/g, "x").replace(/ᵢ/g, "i")
  .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻ⁿᵇ]+/g, m => m.length === 1 && "¹²³".includes(m) ? m : "^" + (m.length > 1 ? "(" : "") + [...m].map(c => SUPM[c]).join("") + (m.length > 1 ? ")" : ""))
  .replace(/→/g, "->").replace(/←/g, "<-").replace(/⌈/g, "techo(").replace(/⌉/g, ")").replace(/[✓✗]\s?/g, "").replace(/○/g, "O").replace(/⇨/g, "=>").replace(/□/g, "[ ]").replace(/▽/g, "V").replace(/[▶►]/g, ">").replace(/[★☆]/g, "*");
async function buildPdf(meta, B){
  await ensurePdfMake();
  const BLUE = "#1E4E78", CU = "#B0522A", MU = "#56657A";
  const R = runs => runs.map(r => ({ text:pdfTxt(r.mx || r.text), bold:!!r.b, italics:!!r.i, font:undefined, fontSize:r.mono ? 9 : undefined, color:r.mono ? "#14202C" : undefined }));
  const C = []; let fig = 0, tab = 0;
  C.push({ text:pdfTxt(meta.kind || "Documento técnico").toUpperCase(), color:CU, fontSize:9, characterSpacing:1.5, margin:[0, 150, 0, 8] }, { text:pdfTxt(meta.title), fontSize:24, bold:true, color:"#14202C", margin:[0, 0, 0, 10] });
  if (meta.subtitle) C.push({ text:pdfTxt(meta.subtitle), fontSize:13, color:MU });
  C.push({ canvas:[{ type:"line", x1:0, y1:0, x2:120, y2:0, lineWidth:3, lineColor:BLUE }], margin:[0, 18, 0, 140] });
  (meta.lines || []).forEach(l => C.push({ text:[{ text:l[0] + ": ", bold:true }, pdfTxt(l[1])], margin:[0, 0, 0, 4] }));
  if (meta.toc !== false) C.push({ toc:{ title:{ text:"Índice", fontSize:16, bold:true, color:BLUE, margin:[0, 0, 0, 12] } }, pageBreak:"before" });
  let first = true;
  for (const b of B) {
    if (b.t === "math") { try { const im = await mImage(b.lin); C.push({ image:im.url, width:Math.min(450, im.w * 0.62), margin:[14, 3, 0, 7] }); } catch (e) { C.push({ text:pdfTxt(b.lin), margin:[14, 2, 0, 6] }); } continue; }
    if (b.t === "h") { const s = [16, 13, 11.5][b.lvl - 1] || 11; const o = { text:pdfTxt(b.text), fontSize:s, bold:true, color:b.lvl === 3 ? CU : b.lvl === 1 ? BLUE : "#14202C", margin:[0, b.lvl === 1 ? 14 : 10, 0, 5], tocItem:b.lvl <= 2, tocMargin:[b.lvl === 2 ? 12 : 0, 2, 0, 2], headlineLevel:1 };
      let node = o; if (b.lvl === 1) { delete o.headlineLevel; node = { stack:[o, { canvas:[{ type:"line", x1:0, y1:0, x2:451, y2:0, lineWidth:0.7, lineColor:BLUE }], margin:[0, -3, 0, 6] }], headlineLevel:1 }; }
      if (first) { node.pageBreak = "before"; first = false; } C.push(node); }
    else if (b.t === "p") { const st = { small:{ fontSize:9, color:MU }, why:{ margin:[14, 0, 0, 6], color:"#3C4A5A" }, res:{ margin:[14, 0, 0, 6] }, note:{ fillColor:"#F7EFE3", margin:[0, 4, 0, 8] }, formula:{ fontSize:9, margin:[14, 2, 0, 6], background:"#EEF3F8" }, stepT:{ bold:true, color:BLUE, margin:[0, 8, 0, 3] }, code:{ fontSize:8.5, margin:[0, 0, 0, 0] } }[b.style] || {};
      if (b.style === "note") C.push({ table:{ widths:["*"], body:[[{ text:R(b.runs), margin:[6, 4, 6, 4] }]] }, layout:{ hLineWidth:() => 0, vLineWidth:i => i === 0 ? 3 : 0, vLineColor:() => CU, fillColor:() => "#F7EFE3" }, margin:[0, 4, 0, 10] });
      else C.push(Object.assign({ text:R(b.runs), margin:[0, 0, 0, 6], alignment:b.style ? "left" : "justify" }, st)); }
    else if (b.t === "li") C.push({ columns:[{ width:14 + b.lvl * 12, text:b.ord ? b.n + "." : "•", alignment:"right" }, { width:"*", text:R(b.runs) }], columnGap:6, margin:[b.lvl * 6, 0, 0, 3] });
    else if (b.t === "table") { tab++; const nc = Math.max.apply(null, b.rows.map(r => r.cells.length));
      C.push({ text:[{ text:"Tabla " + tab + ". ", bold:true }, pdfTxt(b.cap || "Resultados")], italics:true, color:BLUE, fontSize:9, margin:[0, 8, 0, 3] });
      C.push({ table:{ headerRows:b.rows[0].head ? 1 : 0, widths:Array(nc).fill("*"), body:b.rows.map(r => { const cs = r.cells.map(c => ({ text:pdfTxt(c.text || ""), bold:!!(c.b || r.head), color:r.head ? "#FFFFFF" : "#14202C", fillColor:r.head ? BLUE : null, alignment:c.num && !r.head ? "right" : "left", fontSize:8.5 })); while (cs.length < nc) cs.push({ text:"" }); return cs; }) },
        layout:{ hLineWidth:(i, n) => i === 0 || i === n.table.body.length ? 1 : 0.4, vLineWidth:() => 0, hLineColor:i => i === 0 ? BLUE : "#C8D2DC", paddingTop:() => 3, paddingBottom:() => 3 }, margin:[0, 0, 0, 2] });
      C.push({ text:"Fuente: elaboración propia.", italics:true, fontSize:8, color:MU, margin:[0, 2, 0, 10] }); }
    else if (b.t === "img") { fig++; C.push({ image:b.url, width:450, alignment:"center", margin:[0, 6, 0, 3] }, { text:[{ text:"Figura " + fig + ". ", bold:true }, pdfTxt(b.cap + (b.note ? ". " + b.note : ""))], italics:true, fontSize:9, color:BLUE, margin:[0, 0, 0, 10] }); }
  }
  const dd = { pageSize:"LETTER", pageMargins:[72, 64, 64, 64], info:{ title:meta.title, author:meta.author || "" }, content:C, defaultStyle:{ fontSize:10.5, lineHeight:1.25, color:"#14202C" },
    footer:(p, n) => p === 1 ? null : { columns:[{ text:pdfTxt(meta.title).slice(0, 80), color:MU, fontSize:8 }, { text:"Página " + p + " de " + n, alignment:"right", color:MU, fontSize:8 }], margin:[72, 20, 64, 0] },
    pageBreakBefore:(cur, after) => cur.headlineLevel === 1 && after.length === 0 };
  return await new Promise(ok => window.pdfMake.createPdf(dd).getBlob(ok));
}

/* ---------- Guardar ---------- */
async function saveFile(name, blob){
  let dl = null; try { dl = window.claude && window.claude.use ? await window.claude.use("downloads") : null; } catch (e) {}
  if (dl) { try { await dl.save({ filename:name, data:blob }); toast("Archivo listo: " + name); } catch (e) { if (e && e.code !== "declined") toast("No se pudo guardar el archivo (" + (e.code || "error") + ")"); } return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); toast("Descargando " + name);
}
const fileBase = s => String(s || "documento").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_").slice(0, 60) || "documento";
async function exportDoc(fmt, meta, el){
  if (!el) return; toast(fmt === "pdf" ? "Generando PDF…" : "Generando Word…");
  try { const B = await toModel(el); const blob = fmt === "pdf" ? await buildPdf(meta, B) : buildDocx(meta, B); await saveFile(fileBase(meta.title) + (fmt === "pdf" ? ".pdf" : ".docx"), blob); }
  catch (e) { toast(e.message || "No se pudo generar el archivo"); }
}
const expBtns = (kind, extra) => '<span class="expb no-print"><button class="btn small" type="button" data-act="exp" data-fmt="docx" data-kind="' + kind + '"' + (extra || "") + '>Descargar Word</button><button class="btn small ghost" type="button" data-act="exp" data-fmt="pdf" data-kind="' + kind + '"' + (extra || "") + ">Descargar PDF</button></span>";
