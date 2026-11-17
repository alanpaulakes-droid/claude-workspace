/* ============ MOTOR DE FÓRMULAS ============
   Convierte fórmulas escritas en forma lineal ("VAN = Σ F_t ÷ (1 + r)^t") en un árbol
   y lo dibuja como fórmula matemática: fracciones apiladas, potencias, subíndices y raíces.
   El mismo árbol se exporta a Word (ecuaciones OMML) y a PDF (imagen). */
const MOPS = "+−-×·=≤≥<>≈→±≠∈";
function mTok(s){
  const T = []; let i = 0; s = String(s);
  const idRe = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñüΑ-ΡΤ-ωϕµ∂∞θ%$€][A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9Α-ΡΤ-ωµ̄̿'′*²³¹⁰-⁹ⁿ₀-₉ᵢ%]*/;
  while (i < s.length) {
    const ch = s[i], rest = s.slice(i);
    if (ch === " ") { let j = i; while (s[j] === " ") j++; T.push({ k:"sp", n:j - i }); i = j; continue; }
    let m = rest.match(/^\d+(?:[.,]\d+)*(?:\s?%)?/); if (m) { T.push({ k:"num", v:m[0] }); i += m[0].length; continue; }
    if (ch === "Σ" || ch === "∑") { T.push({ k:"sum" }); i++; continue; }
    m = rest.match(idRe); if (m) { T.push({ k:"id", v:m[0] }); i += m[0].length; continue; }
    if ("([{⌈|".includes(ch)) { T.push({ k:"open", v:ch }); i++; continue; }
    if (")]}⌉".includes(ch)) { T.push({ k:"close", v:ch }); i++; continue; }
    if (ch === "÷") { T.push({ k:"div" }); i++; continue; }
    if (ch === "/" && s[i - 1] === " " && s[i + 1] === " ") { T.push({ k:"div" }); i++; continue; }
    if (ch === "^") { T.push({ k:"pow" }); i++; continue; }
    if (ch === "_") { T.push({ k:"subs" }); i++; continue; }
    if (ch === "√") { T.push({ k:"sqrt" }); i++; continue; }
    if (ch === "Σ" || ch === "∑") { T.push({ k:"sum" }); i++; continue; }
    if (MOPS.includes(ch)) { T.push({ k:"op", v:ch === "-" ? "−" : ch }); i++; continue; }
    T.push({ k:"txt", v:ch }); i++;
  }
  return T;
}
/* Árbol: {t:"row",c:[]}, {t:"frac",n,d}, {t:"sup",b,e}, {t:"sub",b,e}, {t:"sqrt",c}, {t:"paren",o,c,cl}, {t:"tok",v,k}, {t:"sp"} */
function mParse(s){
  const T = mTok(s); let p = 0;
  const peek = () => T[p], skipSp = () => { while (T[p] && T[p].k === "sp") p++; };
  const row = c => ({ t:"row", c });
  function group(){ // devuelve el contenido entre paréntesis (sin paréntesis) cuando es operando de ^ o _
    const o = T[p++], c = seq(o.v === "|" ? "|" : { "(":")", "[":"]", "{":"}", "⌈":"⌉" }[o.v]); return { o:o.v, c };
  }
  function atom(){
    const t = peek(); if (!t) return null;
    if (t.k === "open") { const g = group(); return g.o === "{" ? g.c : { t:"paren", o:g.o, c:g.c, cl:{ "(":")", "[":"]", "⌈":"⌉", "|":"|" }[g.o] }; }
    if (t.k === "sqrt") { p++; skipSp(); const a = atom(); return { t:"sqrt", c:a && a.t === "paren" && a.o === "(" ? a.c : a || row([]) }; }
    if (t.k === "num" || t.k === "id" || t.k === "txt") { p++; return { t:"tok", v:t.v, k:t.k }; }
    if (t.k === "op") { p++; return { t:"tok", v:t.v, k:"op" }; }
    return null;
  }
  function scripts(a){
    for (;;) { const t = peek(); if (!t || (t.k !== "pow" && t.k !== "subs")) return a; p++;
      let e; if (peek() && peek().k === "open") { const g = group(); e = g.c; } else e = atom() || row([]);
      a = { t:t.k === "pow" ? "sup" : "sub", b:a, e }; }
  }
  function factor(){ const a = atom(); return a ? scripts(a) : null; }
  // término: factores yuxtapuestos/×/· y divisiones; termina en + − o relación (a nivel superior) o cierre
  function term(close){
    let left = [], cur = left;
    for (;;) {
      const t = peek(); if (!t) break;
      if (t.k === "close" || (close === "|" && t.k === "open" && t.v === "|" && left.length)) break;
      if (t.k === "op" && "+−=≤≥<>≈→±≠".includes(t.v) && left.some(x => x.t !== "sp")) break;
      if (t.k === "sp") { p++; cur.push({ t:"sp", n:t.n }); continue; }
      if (t.k === "div") { p++; skipSp(); while (cur.length && cur[cur.length - 1].t === "sp") cur.pop();
        const num = row(cur.slice()); const den = term1(close); const f = { t:"frac", n:num.c.length === 1 && num.c[0].t === "paren" && num.c[0].o === "(" ? num.c[0].c : num, d:den };
        cur.length = 0; cur.push(f); continue; }
      if (t.k === "sum") { p++; if (peek() && peek().k === "sp") { skipSp(); const rest = term(close); cur.push({ t:"tok", v:"Σ", k:"op" }, { t:"sp", n:1 }); cur.push(rest); break; } cur.push({ t:"tok", v:"Σ", k:"op" }); continue; }
      const f = factor(); if (!f) { p++; continue; } cur.push(f);
    }
    return row(left);
  }
  // denominador: un solo factor (con potencias) o grupo entre paréntesis
  function term1(close){ const ch = [];
    for (;;) { const t = peek(); if (!t) break; if (t.k === "sum") { p++; ch.push({ t:"tok", v:"Σ", k:"op" }); continue; } const f = factor(); if (!f) break; ch.push(f); const n2 = peek();
      if (n2 && n2.k === "sp" && n2.n === 1 && ch[0].t === "tok" && ch[0].k === "id" && T[p + 1] && T[p + 1].k === "id" && /^[a-záéíóúñ]{2,}$/.test(T[p + 1].v) && !/^(ln|log|sen|cos|tan|máx|mín|max|min|exp)$/.test(T[p + 1].v)) { p++; ch.push({ t:"sp", n:1 }); continue; }
      if (!n2 || ["sp", "op", "div", "close"].includes(n2.k)) break; }
    if (ch.length === 1 && ch[0].t === "paren" && ch[0].o === "(") return ch[0].c; return row(ch); }
  function seq(close){
    const out = [];
    for (;;) { const t = peek(); if (!t) break;
      if (t.k === "close") { if (close) { p++; } break; }
      if (close === "|" && t.k === "open" && t.v === "|" && out.length) { p++; break; }
      if (t.k === "op" && "+−=≤≥<>≈→±≠".includes(t.v)) { p++; out.push({ t:"tok", v:t.v, k:"op" }); continue; }
      if (t.k === "sp") { p++; out.push({ t:"sp", n:t.n }); continue; }
      const tm = term(close); if (!tm.c.length) { p++; continue; } out.push(tm);
    }
    return row(out);
  }
  const r = seq(null); return r;
}
/* ---- HTML ---- */
const isWord = v => (/^[A-Za-zÁÉÍÓÚÑÜáéíóúñü]{3,}/.test(v) || /^(de|del|la|las|el|los|en|por|al|con|sin|un|una)$/.test(v)) && !/^(sen|cos|tan|log|ln|máx|mín|max|min|exp)$/.test(v);
function mHtml(n){
  if (!n) return "";
  switch (n.t) {
    case "row": return n.c.map(mHtml).join("");
    case "sp": return n.n > 2 ? '<span class="msp2"></span>' : " ";
    case "tok": { const v = esc(n.v); if (n.k === "op") return '<span class="mo">' + v + "</span>"; if (n.k === "num") return '<span class="mn">' + v + "</span>"; if (n.k === "id") return isWord(n.v) ? '<span class="mw">' + v + "</span>" : '<span class="mi">' + v + "</span>"; return v; }
    case "frac": return '<span class="mfrac"><span class="mnum">' + mHtml(n.n) + '</span><span class="mden">' + mHtml(n.d) + "</span></span>";
    case "sup": return mHtml(n.b) + "<sup>" + mHtml(n.e) + "</sup>";
    case "sub": return mHtml(n.b) + "<sub>" + mHtml(n.e) + "</sub>";
    case "sqrt": return '<span class="msqrt"><span class="mrad">√</span><span class="mrc">' + mHtml(n.c) + "</span></span>";
    case "paren": { const tall = mDepth(n.c) > 0; return '<span class="mpar' + (tall ? " tall" : "") + '"><span class="mpl">' + esc(n.o) + "</span>" + mHtml(n.c) + '<span class="mpl">' + esc(n.cl) + "</span></span>"; }
  }
  return "";
}
function mDepth(n){ if (!n) return 0; if (n.t === "frac") return 1 + Math.max(mDepth(n.n), mDepth(n.d)); if (n.t === "row") return Math.max(0, ...n.c.map(mDepth)); if (n.t === "sup" || n.t === "sub") return mDepth(n.b); if (n.t === "sqrt" || n.t === "paren") return mDepth(n.c); return 0; }
/* fórmula en bloque (con texto original guardado para exportar) */
function M(s, cls){ s = String(s); return '<div class="mblk ' + (cls || "") + '" data-lin="' + esc(s) + '">' + s.split(/ {3,}·? {0,}|\n/).filter(x => x.trim()).map(part => '<span class="mline">' + mHtml(mParse(part.trim().replace(/^·\s*/, ""))) + "</span>").join("") + "</div>"; }
/* fórmula en línea */
const mi = s => '<span class="mx" data-lin="' + esc(s) + '">' + mHtml(mParse(s)) + "</span>";
/* reemplaza <m>…</m> escrito dentro de contenidos */
const mFill = html => String(html).replace(/<m>([\s\S]*?)<\/m>/g, (_, s) => mi(s.replace(/&amp;/g, "&")));

/* ---- Word (OMML) ---- */
function mOmml(n){
  if (!n) return "";
  const r = (v, plain) => "<m:r>" + (plain ? '<m:rPr><m:sty m:val="p"/></m:rPr>' : "") + '<w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">' + XE(v) + "</m:t></m:r>";
  switch (n.t) {
    case "row": return n.c.map(mOmml).join("");
    case "sp": return r(n.n > 2 ? "   " : " ", true);
    case "tok": return r(n.v, n.k !== "id" || isWord(n.v) || n.v.length > 1);
    case "frac": return "<m:f><m:num>" + mOmml(n.n) + "</m:num><m:den>" + mOmml(n.d) + "</m:den></m:f>";
    case "sup": return "<m:sSup><m:e>" + mOmml(n.b) + "</m:e><m:sup>" + mOmml(n.e) + "</m:sup></m:sSup>";
    case "sub": return "<m:sSub><m:e>" + mOmml(n.b) + "</m:e><m:sub>" + mOmml(n.e) + "</m:sub></m:sSub>";
    case "sqrt": return '<m:rad><m:radPr><m:degHide m:val="1"/></m:radPr><m:deg/><m:e>' + mOmml(n.c) + "</m:e></m:rad>";
    case "paren": return '<m:d><m:dPr><m:begChr m:val="' + XE(n.o) + '"/><m:endChr m:val="' + XE(n.cl) + '"/></m:dPr><m:e>' + mOmml(n.c) + "</m:e></m:d>";
  }
  return "";
}

/* ---- Dibujo SVG para PDF ---- */
let _mctx = null;
function mMeasure(t, sz, it){ if (!_mctx) _mctx = document.createElement("canvas").getContext("2d"); _mctx.font = (it ? "italic " : "") + sz + "px 'Times New Roman', Times, serif"; return _mctx.measureText(t).width; }
function mBox(n, sz){
  const T = (v, it, cls) => { const w = mMeasure(v, sz, it) + (cls === "op" ? sz * 0.35 : 0); return { w, h:sz * 0.72, d:sz * 0.24, draw:(x, y) => '<text x="' + (x + (cls === "op" ? sz * 0.175 : 0)) + '" y="' + y + '" font-size="' + sz + '"' + (it ? ' font-style="italic"' : "") + ">" + XE(v) + "</text>" }; };
  switch (n.t) {
    case "row": { const bs = n.c.map(c => mBox(c, sz)); let w = 0; const h = Math.max(sz * 0.72, ...bs.map(b => b.h)), d = Math.max(sz * 0.24, ...bs.map(b => b.d)); bs.forEach(b => w += b.w); return { w, h, d, draw:(x, y) => { let s = "", xx = x; bs.forEach(b => { s += b.draw(xx, y); xx += b.w; }); return s; } }; }
    case "sp": return { w:n.n > 2 ? sz * 1.2 : sz * 0.25, h:0, d:0, draw:() => "" };
    case "tok": return n.k === "op" ? T(n.v, false, "op") : T(n.v, n.k === "id" && !isWord(n.v) && n.v.length <= 2);
    case "frac": { const a = mBox(n.n, sz), b = mBox(n.d, sz), w = Math.max(a.w, b.w) + sz * 0.4, ax = sz * 0.3, g = sz * 0.18;
      return { w, h:ax + g + a.d + a.h, d:-ax + g + b.h + b.d, draw:(x, y) => { const ly = y - ax; return a.draw(x + (w - a.w) / 2, ly - g - a.d) + b.draw(x + (w - b.w) / 2, ly + g + b.h) + '<line x1="' + (x + sz * 0.1) + '" x2="' + (x + w - sz * 0.1) + '" y1="' + ly + '" y2="' + ly + '" stroke="#14202C" stroke-width="' + Math.max(1, sz * 0.05) + '"/>'; } }; }
    case "sup": case "sub": { const b = mBox(n.b, sz), e = mBox(n.e, sz * 0.7), up = n.t === "sup";
      const sh = up ? Math.max(sz * 0.42, b.h - e.h * 0.6) : sz * 0.22;
      return { w:b.w + e.w + sz * 0.05, h:up ? Math.max(b.h, sh + e.h) : b.h, d:up ? b.d : Math.max(b.d, sh + e.d), draw:(x, y) => b.draw(x, y) + e.draw(x + b.w + sz * 0.03, up ? y - sh : y + sh) }; }
    case "sqrt": { const c = mBox(n.c, sz), rw = sz * 0.6, gap = sz * 0.12;
      return { w:c.w + rw + sz * 0.1, h:c.h + gap * 2, d:c.d, draw:(x, y) => { const top = y - c.h - gap; return '<path d="M' + x + " " + (y - sz * 0.3) + " L" + (x + rw * 0.3) + " " + (y - sz * 0.38) + " L" + (x + rw * 0.55) + " " + (y + c.d) + " L" + (x + rw) + " " + top + " L" + (x + rw + c.w + sz * 0.05) + " " + top + '" fill="none" stroke="#14202C" stroke-width="' + Math.max(1, sz * 0.05) + '"/>' + c.draw(x + rw + sz * 0.03, y); } }; }
    case "paren": { const c = mBox(n.c, sz), pw = sz * 0.35;
      return { w:c.w + pw * 2, h:c.h + sz * 0.05, d:c.d + sz * 0.05, draw:(x, y) => { const t = y - c.h, b = y + c.d, sw = Math.max(1, sz * 0.05);
        const sym = (xx, o) => o === "(" || o === ")" ? '<path d="M' + (xx + (o === "(" ? pw * 0.75 : pw * 0.25)) + " " + t + " Q" + (xx + (o === "(" ? 0 : pw)) + " " + ((t + b) / 2) + " " + (xx + (o === "(" ? pw * 0.75 : pw * 0.25)) + " " + b + '" fill="none" stroke="#14202C" stroke-width="' + sw + '"/>' : '<text x="' + xx + '" y="' + y + '" font-size="' + sz + '">' + XE(o) + "</text>";
        return sym(x, n.o) + c.draw(x + pw, y) + sym(x + pw + c.w, n.cl); } }; }
  }
  return { w:0, h:0, d:0, draw:() => "" };
}
async function mImage(lin){
  const parts = String(lin).split(/ {3,}·? {0,}|\n/).filter(x => x.trim()), sz = 22, gap = 14;
  const boxes = parts.map(p => mBox(mParse(p.trim().replace(/^·\s*/, "")), sz)); let H = 8, W = 0; boxes.forEach(b => { H += b.h + b.d + gap; W = Math.max(W, b.w); }); W += 16;
  let y = 8, g = ""; boxes.forEach(b => { y += b.h; g += b.draw(8, y); y += b.d + gap; });
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" font-family="Times New Roman, Times, serif" fill="#14202C">' + g + "</svg>";
  const img = new Image(); await new Promise((ok, ko) => { img.onload = ok; img.onerror = ko; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); });
  const sc = 3, cv = document.createElement("canvas"); cv.width = Math.ceil(W * sc); cv.height = Math.ceil(H * sc); const cx = cv.getContext("2d"); cx.fillStyle = "#fff"; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(img, 0, 0, cv.width, cv.height);
  return { url:cv.toDataURL("image/png"), w:W, h:H };
}
