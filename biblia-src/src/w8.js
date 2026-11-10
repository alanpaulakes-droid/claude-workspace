/* ============ FASE 1B: FÓRMULAS A KATEX Y PLANTILLA DE 8 BLOQUES ============ */

/* ---------- Conversión del árbol de fórmulas (mParse) a LaTeX ---------- */
const TEX_OP = { "−":"-", "-":"-", "×":"\\times ", "·":"\\cdot ", "≤":"\\le ", "≥":"\\ge ", "≈":"\\approx ", "→":"\\to ", "±":"\\pm ", "≠":"\\ne ", "∈":"\\in ", "Σ":"\\sum ", "∑":"\\sum ", "+":"+", "=":"=", "<":"<", ">":">" };
const TEX_FN = { sen:"\\operatorname{sen}", cos:"\\cos", tan:"\\tan", log:"\\log", ln:"\\ln", exp:"\\exp", máx:"\\operatorname{máx}", mín:"\\operatorname{mín}", max:"\\max", min:"\\min" };
const texEsc = s => String(s).replace(/[\\{}]/g, c => "\\" + c).replace(/[#$%&_]/g, c => "\\" + c).replace(/~/g, "\\textasciitilde{}").replace(/\^/g, "\\textasciicircum{}");
function texId(v){
  if (TEX_FN[v]) return TEX_FN[v] + " ";
  if (isWord(v)) return "\\text{" + texEsc(v) + "}";
  let s = v, acc = "";
  const bar = s.match(/^(.*?)([̄̿])(.*)$/); if (bar) { const b = bar[2] === "̿" ? "\\bar{\\bar{" + texChars(bar[1]) + "}}" : "\\bar{" + texChars(bar[1]) + "}"; return b + texChars(bar[3]); }
  return texChars(s);
}
const TSUB = { "₀":"0", "₁":"1", "₂":"2", "₃":"3", "₄":"4", "₅":"5", "₆":"6", "₇":"7", "₈":"8", "₉":"9", "ᵢ":"i" }, TSUP = { "⁰":"0", "¹":"1", "²":"2", "³":"3", "⁴":"4", "⁵":"5", "⁶":"6", "⁷":"7", "⁸":"8", "⁹":"9", "ⁿ":"n" };
function texChars(s){ let o = "", mode = "", buf = "";
  const flush = () => { if (buf) o += (mode === "sub" ? "_{" : "^{") + buf + "}"; buf = ""; mode = ""; };
  for (const ch of s) { const m = TSUB[ch] ? "sub" : TSUP[ch] ? "sup" : "";
    if (m) { if (mode !== m) flush(); mode = m; buf += TSUB[ch] || TSUP[ch]; continue; }
    flush(); o += ch === "$" ? "\\$" : ch === "%" ? "\\%" : ch === "*" ? "^{*}" : ch === "′" || ch === "'" ? "\\mkern1mu\\text{′}" : ch; }
  flush(); return o; }
function texNum(v){ return String(v).replace(/%/g, "\\%").replace(/(\d),(\d)/g, "$1{,}$2").replace(/\s/g, "\\,"); }
function texTxt(v){ if (/^[A-Za-z0-9.;:!?()\[\]|/*+=<>]$/.test(v)) return v; if (/^[,]$/.test(v)) return ",\\,"; if (/^[{}#$%&_\\^~]$/.test(v)) return texEsc(v); return v; }
function mTex(n){
  if (!n) return "";
  switch (n.t) {
    case "row": { let o = ""; const c = n.c;
      c.forEach((x, i) => { if (x.t === "sp") { const a = c[i - 1], b = c[i + 1]; const isOp = y => !y || (y.t === "tok" && y.k === "op") || y.t === "sp";
          if (x.n > 2) o += "\\qquad "; else if (!isOp(a) && !isOp(b)) o += "\\ "; return; }
        o += mTex(x); });
      return o; }
    case "sp": return "\\ ";
    case "tok": if (n.k === "op") return TEX_OP[n.v] != null ? TEX_OP[n.v] : texTxt(n.v); if (n.k === "num") return texNum(n.v); if (n.k === "id") return texId(n.v); return texTxt(n.v);
    case "frac": return "\\frac{" + mTex(n.n) + "}{" + mTex(n.d) + "}";
    case "sup": return "{" + mTex(n.b) + "}^{" + mTex(n.e) + "}";
    case "sub": return "{" + mTex(n.b) + "}_{" + mTex(n.e) + "}";
    case "sqrt": return "\\sqrt{" + mTex(n.c) + "}";
    case "paren": { const L = { "(":"(", "[":"[", "|":"|", "⌈":"\\lceil " }[n.o] || "(", R = { ")":")", "]":"]", "|":"|", "⌉":"\\rceil " }[n.cl] || ")"; return mDepth(n.c) > 0 ? "\\left" + L + mTex(n.c) + "\\right" + R : L + mTex(n.c) + R; }
  }
  return "";
}
const linTex = s => mTex(mParse(String(s).trim().replace(/^·\s*/, "")));

/* Dibuja con KaTeX las fórmulas del motor propio (.mblk en bloque y .mx en línea). Si una falla, queda la versión propia */
function katexMotor(root){
  const bl = [...root.querySelectorAll(".mblk:not([data-kx])")], il = [...root.querySelectorAll(".mx:not([data-kx])")];
  if (!bl.length && !il.length) return;
  katexLoad().then(k => { if (!k) return; let ok = 0, ko = 0;
    const R = (tex, disp) => k.renderToString(tex, { displayMode:disp, output:"mathml", throwOnError:true, strict:"ignore" });
    bl.forEach(b => { b.dataset.kx = "1"; const parts = String(b.dataset.lin || "").split(/ {3,}·? {0,}|\n/).filter(x => x.trim()), lines = b.querySelectorAll(":scope > .mline");
      if (parts.length !== lines.length) { ko++; return; }
      parts.forEach((p, i) => { try { lines[i].innerHTML = R(linTex(p), true); lines[i].classList.add("kx"); ok++; } catch (e) { ko++; } }); });
    il.forEach(m => { m.dataset.kx = "1"; try { m.innerHTML = R(linTex(m.dataset.lin || ""), false); m.classList.add("kx"); ok++; } catch (e) { ko++; } });
    katexMotor.stat = { ok:(katexMotor.stat ? katexMotor.stat.ok : 0) + ok, ko:(katexMotor.stat ? katexMotor.stat.ko : 0) + ko }; });
}

/* ---------- Plantilla fija de 8 bloques ---------- */
const T8 = [["def", "Definición"], ["con", "Conceptos clave"], ["fx", "Fórmulas"], ["met", "Método paso a paso"], ["ej", "Ejemplo resuelto"], ["err", "Errores comunes"], ["ejer", "Ejercicio con pistas"], ["fic", "Ficha resumen"]];
const t8n = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/^\d+\.\s*/, "");
function t8Class(title){
  const t = t8n(title);
  if (/comparacion|siglas y abreviaturas|esquema/.test(t)) return "con";
  if (/autoevaluacion|ejercicio|pon a prueba|ponte a prueba|^quiz|practica guiada|desafio|preguntas de repaso/.test(t)) return "ejer";
  if (/error|trampa|limitacion|cuidado|mito|que no hacer|lo que no/.test(t)) return "err";
  if (/ejemplo|caso|resuelto/.test(t)) return "ej";
  if (/formula/.test(t)) return "fx";
  if (/paso a paso|como aplicar|como se hace|procedimiento|metodo|como usar|como hacer|receta|como calcular|como leer|como interpretar|como elaborar|como armar|como construir|como implementar|como empezar|como se calcula|secuencia/.test(t)) return "met";
  if (/tips|para recordar|resumen|fuentes|bibliografia|lecturas|consejo|checklist|lista de verificacion|herramientas de esta app|recursos/.test(t)) return "fic";
  if (/que es|definicion|introduccion|por que es importante|para que sirve|la idea|historia|origen|en que consiste|desde cero|por que importa|^panorama/.test(t)) return "def";
  return "con";
}
/* Páginas que usan la plantilla: calculadoras (su guía), ramos, lecciones, saberes, gestión, Excel/Word y desarrollo personal */
const T8_SKIP = new Set(["libros", "experiencias", "excel-lab", "excel-ejercicios", "word-ejercicios", "empieza-aqui"]);
function t8Applies(id){ const p = pageOf(id); if (!p || T8_SKIP.has(id)) return false;
  if (p.calc) return !!(GUIDE[id] || C[id].learn || (typeof BG !== "undefined" && BG[id]));
  if (p.g === "malla") return id !== "mi-malla";
  if (["lean", "mejora-continua", "calidad-7", "gestion-proyectos", "kpis"].includes(id)) return true;
  return !!SAB.find(x => x.id === id); }

/* Tipo de tema: procedimiento (herramientas de gestión, ofimática, informes) o conceptual (lecciones, ramos, saberes) */
const T8_PROC = new Set(["foda", "canvas", "raci", "sipoc", "ishikawa", "porques", "kpis", "mejora-continua", "calidad-7", "lean", "gestion-proyectos", "citas-apa", "generador-informe", "conversor"]);
function t8Kind(id){ const p = pageOf(id); return T8_PROC.has(id) || ["ges", "ofi", "inf"].includes(p.g) ? "proc" : "conc"; }
/* Material de consulta que queda plegado: historia, fuentes, siglas, comparaciones, explicación extendida, datos de entrada */
const T8_FOLD = /historia|origen|fuentes|lecturas|bibliografia|siglas|comparacion|desde cero|mas a fondo|explicado en detalle|datos usados|tips del experto|notas practicas|preguntas frecuentes/;
const kids = (el, sel) => [...el.children].filter(c => c.matches(sel)), kid1 = (el, sel) => kids(el, sel)[0] || null;
function tpl8HTML(id, html){ if (window.__noT8) return html;
  if (!t8Applies(id)) return html;
  const T = document.createElement("template"); T.innerHTML = html; const R = T.content;
  const host = R.querySelector("#guia") || R.querySelector("#ramodoc") || R.querySelector("#sabdoc") || R;
  const B = {}; T8.forEach(b => B[b[0]] = []);
  const isCalc = !!R.querySelector("#guia");
  /* 1) contenido suelto (páginas de gestión): pasa a «Conceptos clave» como primera subsección */
  if (host === R) {
    const lead = kid1(R, ".lead"); let n = lead ? lead.nextSibling : null; const loose = [];
    while (n) { const nx = n.nextSibling; if (n.nodeType === 1 && n.matches("details.item")) break; if (n.nodeType === 1 && n.matches(".actions,.pager,.quick,.no-print")) break; loose.push(n); n = nx; }
    if (loose.some(x => x.nodeType === 1)) { const d = document.createElement("details"); d.className = "item"; d.innerHTML = '<summary>Panorama general y herramientas principales</summary><div class="body prose"></div>'; loose.forEach(x => d.querySelector(".body").appendChild(x)); B.con.push(d); }
  }
  /* 2) ramos: «Por qué es importante» → Definición; figuras → Conceptos; bibliografía → Ficha */
  const rd = host.id === "ramodoc";
  if (rd) {
    const card = kid1(host, "section.card"); if (card) { const h = card.querySelector("h2"); const d = document.createElement("details"); d.className = "item"; d.open = true; d.innerHTML = "<summary>" + (h ? h.textContent : "Por qué es importante") + '</summary><div class="body prose"></div>'; if (h) h.remove(); [...card.childNodes].forEach(x => d.querySelector(".body").appendChild(x)); card.remove(); B.def.push(d); }
    kids(host, "figure").forEach(f => { const d = document.createElement("details"); d.className = "item"; d.innerHTML = '<summary>Esquema visual del ramo</summary><div class="body"></div>'; d.querySelector(".body").appendChild(f); B.con.push(d); });
    const hs = kids(host, "h2.sh");
    hs.forEach(h => { const t = t8n(h.textContent);
      if (/bibliografia/.test(t)) { const ul = h.nextElementSibling; const d = document.createElement("details"); d.className = "item"; d.innerHTML = "<summary>Bibliografía recomendada</summary><div class=\"body prose\"></div>"; if (ul && ul.tagName === "UL") d.querySelector(".body").appendChild(ul); h.remove(); B.fic.push(d); }
      else if (/unidades|practica y aplica/.test(t)) h.remove(); });
  }
  /* 3) secciones desplegables: se clasifican por su título */
  const ds = kids(host, "details.item");
  if (!ds.length && !B.con.length && !B.def.length) return html;
  ds.forEach(d => { const s = d.querySelector(":scope > summary"); const k = rd && /^\d+\./.test(s.textContent.trim()) ? "con" : t8Class(s ? s.textContent : ""); B[k].push(d); });
  { const X = typeof t2Blocks === "function" ? t2Blocks(id) : null; if (X) Object.keys(X).forEach(k => { B[k] = X[k].concat(B[k]); }); }
  /* 4) se arma el tema. El orden depende del tipo de contenido (F3):
     cálculo → fórmulas y método primero; procedimiento → cómo se hace primero; conceptual → definición primero.
     Los bloques sin contenido propio no se muestran (antes aparecían como «pendiente» o como lista de referencias). */
  const kind = isCalc ? "calc" : t8Kind(id);
  const ORD = { calc:["fx", "met", "ej", "err", "ejer", "def", "con", "fic"], proc:["met", "ej", "err", "def", "con", "fx", "ejer", "fic"], conc:["def", "con", "fx", "met", "ej", "err", "ejer", "fic"] }[kind];
  const NAME = Object.assign(Object.fromEntries(T8), kind === "calc" ? { def:"Qué es y de dónde viene", ejer:"Practica" } : kind === "proc" ? { met:"Cómo se hace", ejer:"Practica" } : { ejer:"Practica" });
  const SEC = ORD.filter(k => B[k].length);
  const anchor = ds[0] || kid1(host, "h2.sh, .quick, .actions") || null;
  const wrap = document.createElement("div"); wrap.className = "t8 t8-" + kind;
  wrap.innerHTML = '<nav class="t8-nav no-print" aria-label="Secciones del tema"><div class="t8-tabs">' + SEC.map(k => '<button type="button" data-t8="' + k + '">' + NAME[k] + "</button>").join("") + "</div></nav>";
  SEC.forEach((k, i) => { const sec = document.createElement("section"); sec.className = "t8-b"; sec.id = "t8-" + k; sec.setAttribute("aria-labelledby", "t8h-" + k);
    sec.innerHTML = '<h2 class="t8-h" id="t8h-' + k + '"><span class="t8-n">' + (i + 1) + "</span>" + NAME[k] + "</h2>";
    B[k].forEach(d => sec.appendChild(d)); wrap.appendChild(sec); });
  if (typeof expBar === "function" && !R.querySelector('.expb [data-kind="ramo"],.expb [data-kind="saber"],.expb [data-kind="guia"]')) wrap.querySelector(".t8-nav").insertAdjacentHTML("afterend", expBar("pagina", id));
  else wrap.querySelector(".t8-nav").insertAdjacentHTML("afterend", '<div class="actions no-print t8-exp">' + prnBtn + "</div>");
  if (anchor && anchor.parentNode === host) host.insertBefore(wrap, anchor); else host.appendChild(wrap);
  if (isCalc) { const hint = kid1(host, "p.hint"); if (hint) hint.textContent = "Primero las fórmulas y el método; después un ejemplo resuelto, los errores más comunes y ejercicios para practicar."; }
  /* subsecciones: las principales quedan abiertas y se leen como texto con subtítulo; el material de consulta queda plegado */
  wrap.querySelectorAll("details.item").forEach(d => { const sm = d.querySelector(":scope > summary"), t = t8n(sm ? sm.textContent : "");
    const sec2 = T8_FOLD.test(t); d.classList.add(sec2 ? "fold" : "sub"); d.open = !sec2; });
  return T.innerHTML;
}
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-t8ref]"); if (!b) return; const h = document.getElementById(b.dataset.t8ref); if (!h) return; let p = h.parentElement; while (p) { if (p.tagName === "DETAILS") p.open = true; p = p.parentElement; } h.scrollIntoView({ behavior:"smooth", block:"start" }); h.classList.add("t8-flash"); setTimeout(() => h.classList.remove("t8-flash"), 1600); });
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-t8]"); if (!b) return; const s = document.getElementById("t8-" + b.dataset.t8); if (!s) return; const d = s.querySelector("details.item"); if (d) d.open = true; s.scrollIntoView({ behavior:"smooth", block:"start" }); });
