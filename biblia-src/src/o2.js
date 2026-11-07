/* ============ OFIMÁTICA: HOJA INTERACTIVA, EDITOR DE DOCUMENTOS Y EDITOR DE ECUACIONES ============ */
const XS = {}, WX = {}, EQX = {};
const ofiDone = id => !!(S.ofi && S.ofi[id]);
function ofiMark(id){ S.ofi = S.ofi || {}; if (!S.ofi[id]) { S.ofi[id] = 1; save(); } }
const xlsBox = id => '<div class="xlsbox noexp" data-xls="' + id + '"></div>';
const wdBox = id => '<div class="wdbox noexp" data-wdx="' + id + '"></div>';
const eqBox = id => '<div class="eqbox noexp" data-eqx="' + id + '"></div>';

/* ---------- Hoja de cálculo ---------- */
function xlsInit(el){
  const id = el.dataset.xls, X = XS[id]; if (!X) return;
  const nc = X.cols || (X.data ? Math.max(...X.data.map(r => r.length)) : 6), nr = X.rows || (X.data ? X.data.length : 8) + (X.extra || 0);
  const base = {}; (X.data || []).forEach((row, i) => row.forEach((v, j) => { if (v !== "" && v != null) base[XL.colL(j + 1) + (i + 1)] = String(v); }));
  const fillCells = X.fill ? (() => { const a = XL.parseRef(X.fill[0]), b = XL.parseRef(X.fill[1]), out = []; for (let r = a.r; r <= b.r; r++) for (let c = a.c; c <= b.c; c++) out.push(XL.refStr(r, c)); return out; })() : [];
  const editable = X.free ? null : new Set(X.fill ? [X.fill[0]] : X.edit || Object.keys(X.sol || {}));
  S.ofiX = S.ofiX || {}; const saved = S.ofiX[id] || {};
  let user = Object.assign({}, saved), sel = X.sel || (X.fill ? X.fill[0] : (X.edit || Object.keys(X.sol || {}))[0]) || "A1";
  const isEd = ref => X.free || editable.has(ref);
  const build = () => { const cells = Object.assign({}, base, user);
    if (X.fill && user[X.fill[0]]) { const a = XL.parseRef(X.fill[0]); fillCells.slice(1).forEach(ref => { const b = XL.parseRef(ref); const f = user[X.fill[0]]; cells[ref] = f[0] === "=" ? XL.shift(f, b.r - a.r, b.c - a.c) : f; }); }
    return new XL.Sheet(cells); };
  el.innerHTML = '<div class="xl-bar"><span class="xl-nb"></span><span class="xl-fx">fx</span><input class="xl-in" type="text" spellcheck="false" autocomplete="off" aria-label="Barra de fórmulas"><button class="btn small xl-ok" type="button">Introducir</button></div><div class="xl-wrap"><table class="xl-grid"></table></div><div class="xl-pos" aria-live="polite"></div>' +
    (X.free ? '<div class="xl-act"><button class="btn small ghost" type="button" data-x="reset">Limpiar hoja</button><button class="btn small ghost" type="button" data-x="fx">Ver fórmulas</button></div>' : '<div class="xl-act"><button class="btn small" type="button" data-x="check">Comprobar</button><button class="btn small ghost" type="button" data-x="hint">Pista</button><button class="btn small ghost" type="button" data-x="sol">Ver solución</button><button class="btn small ghost" type="button" data-x="reset">Reiniciar</button><button class="btn small ghost" type="button" data-x="fx">Ver fórmulas</button>' + (ofiDone(id) ? '<span class="xl-done">✓ Resuelto</span>' : "") + "</div>") + '<div class="xl-msg" aria-live="polite"></div>';
  const pos = el.querySelector(".xl-pos"), grid = el.querySelector(".xl-grid"), inp = el.querySelector(".xl-in"), nb = el.querySelector(".xl-nb"), msg = el.querySelector(".xl-msg");
  let showF = false;
  const paint = () => { const sh = build(), sp = XL.parseRef(sel); let h = "<thead><tr><th class='xl-corner'></th>"; for (let c = 1; c <= nc; c++) h += "<th" + (c === sp.c ? " class='on'" : "") + ">" + XL.colL(c) + "</th>"; h += "</tr></thead><tbody>";
    for (let r = 1; r <= nr; r++) { h += "<tr><th" + (r === sp.r ? " class='on'" : "") + ">" + r + "</th>"; for (let c = 1; c <= nc; c++) { const ref = XL.refStr(r, c), v = sh.get(r, c), col = XL.colL(c), fm = (X.fmt && (X.fmt[ref] || X.fmt[col])) || "", head = X.head !== false && r === 1 && !isEd(ref);
        const cls = [isEd(ref) ? "ed" : "", fillCells.includes(ref) && ref !== (X.fill && X.fill[0]) ? "fl" : "", ref === sel ? "sel" : "", head ? "hd" : "", XL.isErr(v) ? "er" : "", typeof v === "number" ? "n" : ""].filter(Boolean).join(" ");
        const rw = showF ? (user[ref] != null ? user[ref] : base[ref]) || (X.fill && fillCells.includes(ref) && user[X.fill[0]] ? sh.raw(ref) : "") : "";
        h += '<td data-r="' + ref + '" title="Celda ' + ref + ' (columna ' + col + ', fila ' + r + ')" class="' + cls + (showF && String(rw)[0] === "=" ? " fx" : "") + '">' + esc(showF && String(rw)[0] === "=" ? rw : XL.show(v, fm)) + "</td>"; } h += "</tr>"; }
    grid.innerHTML = h + "</tbody>"; nb.textContent = sel;
    { const v = sh.get(sp.r, sp.c), rw = (user[sel] != null ? user[sel] : base[sel]) || (X.fill && fillCells.includes(sel) && user[X.fill[0]] ? sh.raw(sel) : ""), col = XL.colL(sp.c), fm = (X.fmt && (X.fmt[sel] || X.fmt[col])) || "";
      pos.innerHTML = "<b>Celda " + sel + "</b> = columna <b>" + col + "</b> + fila <b>" + sp.r + "</b>" + (rw === "" || rw == null ? " · vacía" : String(rw)[0] === "=" ? " · fórmula <span class='mono'>" + esc(rw) + "</span> → muestra <b>" + esc(XL.show(v, fm)) + "</b>" : " · dato: <b>" + esc(XL.show(v, fm)) + "</b>") + (isEd(sel) ? " · <span class='xl-edt'>puedes escribir aquí</span>" : ""); }
    const raw = (user[sel] != null ? user[sel] : base[sel]) || (X.fill && fillCells.includes(sel) && user[X.fill[0]] ? build().raw(sel) : "") || "";
    inp.value = raw; inp.disabled = !isEd(sel); inp.placeholder = isEd(sel) ? "Escribe un valor o una fórmula que empiece con =" : "Celda de datos (solo lectura)"; };
  const commit = () => { if (!isEd(sel)) return; const v = inp.value.trim(); if (v) user[sel] = v; else delete user[sel]; S.ofiX[id] = user; save(); msg.innerHTML = ""; paint(); };
  grid.addEventListener("click", e => { const td = e.target.closest("td[data-r]"); if (!td) return; sel = td.dataset.r; paint(); if (isEd(sel)) { inp.focus(); inp.select(); } });
  inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); commit(); const p = XL.parseRef(sel); if (X.free && p.r < nr) { sel = XL.refStr(p.r + 1, p.c); paint(); inp.focus(); } } else if (e.key === "Escape") paint(); });
  el.querySelector(".xl-ok").addEventListener("click", commit);
  el.querySelector(".xl-act").addEventListener("click", e => { const b = e.target.closest("[data-x]"); if (!b) return; const a = b.dataset.x;
    if (a === "fx") { showF = !showF; b.textContent = showF ? "Ver resultados" : "Ver fórmulas"; paint(); return; }
    if (a === "reset") { user = {}; S.ofiX[id] = {}; save(); msg.innerHTML = ""; paint(); return; }
    if (a === "hint") { msg.innerHTML = note(X.hint || "Revisa la sintaxis de la función en la tabla de referencia.", "info"); return; }
    if (a === "sol") { const s = X.fill ? X.fill[0] + ": " + X.sol : Object.entries(X.sol).map(([k, f]) => k + ": " + f).join(" · "); msg.innerHTML = note("<b>Una solución posible:</b> <span class='mono'>" + esc(s) + "</span>" + (X.why ? "<br>" + X.why : ""), "info"); return; }
    if (a === "check") {
      const targets = X.fill ? fillCells : Object.keys(X.sol), solCells = Object.assign({}, base);
      if (X.fill) { const a0 = XL.parseRef(X.fill[0]); fillCells.forEach(ref => { const b0 = XL.parseRef(ref); solCells[ref] = XL.shift(X.sol, b0.r - a0.r, b0.c - a0.c); }); } else Object.assign(solCells, X.sol);
      const ref = new XL.Sheet(solCells), mine = build(), bad = [];
      const first = X.fill ? [X.fill[0]] : targets; if (first.some(t => !user[t])) { msg.innerHTML = note("Escribe tu respuesta en la celda " + first.filter(t => !user[t]).join(", ") + " y presiona Introducir.", "warn"); return; }
      targets.forEach(t => { const p = XL.parseRef(t), a1 = ref.get(p.r, p.c), b1 = mine.get(p.r, p.c); const ok = typeof a1 === "number" && typeof b1 === "number" ? Math.abs(a1 - b1) <= 1e-6 * Math.max(1, Math.abs(a1)) : String(XL.show(a1)).toLowerCase().trim() === String(XL.show(b1)).toLowerCase().trim(); if (!ok) bad.push(t + " (esperado " + XL.show(a1) + ", obtuviste " + XL.show(b1) + ")"); });
      const reqMiss = (X.req || []).filter(rq => !(X.fill ? [X.fill[0]] : targets).some(t => String(user[t] || "").toUpperCase().includes(rq.toUpperCase())));
      if (!bad.length && !reqMiss.length) { ofiMark(id); msg.innerHTML = note("<b>¡Correcto!</b> " + (X.why || ""), "ok"); const act = el.querySelector(".xl-act"); if (!act.querySelector(".xl-done")) act.insertAdjacentHTML("beforeend", '<span class="xl-done">✓ Resuelto</span>'); }
      else if (!bad.length) msg.innerHTML = note("El resultado es correcto, pero el ejercicio pide usar: <b>" + reqMiss.join(", ") + "</b>. " + (X.hint || ""), "warn");
      else msg.innerHTML = note("Aún no. Revisa: " + bad.slice(0, 4).join("; ") + (bad.length > 4 ? "…" : "") + ". Usa «Pista» si lo necesitas.", "bad");
    } });
  paint();
}

/* ---------- Editor de documentos (tipo Word) ---------- */
function wdInit(el){
  const id = el.dataset.wdx, W = WX[id]; if (!W) return;
  S.ofiW = S.ofiW || {};
  el.innerHTML = '<div class="wd-tb" role="toolbar" aria-label="Herramientas de formato">' +
    '<select class="wd-st" aria-label="Estilo"><option value="p">Normal</option><option value="h1">Título 1</option><option value="h2">Título 2</option><option value="h3">Título 3</option><option value="blockquote">Cita</option></select>' +
    [["bold", "<b>N</b>", "Negrita (Ctrl+N / Ctrl+B)"], ["italic", "<i>K</i>", "Cursiva"], ["underline", "<u>S</u>", "Subrayado"], ["insertUnorderedList", "• Lista", "Viñetas"], ["insertOrderedList", "1. Lista", "Numeración"], ["justifyLeft", "⇤", "Alinear a la izquierda"], ["justifyCenter", "↔", "Centrar"], ["justifyRight", "⇥", "Alinear a la derecha"], ["justifyFull", "☰", "Justificar"], ["table", "Tabla", "Insertar tabla"], ["toc", "Tabla de contenido", "Insertar tabla de contenido"], ["caption", "Título de figura", "Insertar título numerado"], ["removeFormat", "Borrar formato", "Borrar formato"], ["undo", "↶", "Deshacer"], ["redo", "↷", "Rehacer"]].map(b => '<button type="button" class="wd-b" data-w="' + b[0] + '" title="' + b[2] + '" aria-label="' + b[2] + '">' + b[1] + "</button>").join("") +
    '<span class="wd-tbl" hidden><label>Filas <input type="number" min="1" max="12" value="3" class="wd-tr"></label><label>Columnas <input type="number" min="1" max="8" value="3" class="wd-tc"></label><button type="button" class="btn small" data-w="tableok">Insertar</button></span></div>' +
    '<div class="wd-page" contenteditable="true" spellcheck="true" lang="es"></div>' +
    (W.free ? "" : '<div class="xl-act"><button class="btn small" type="button" data-w="check">Comprobar</button><button class="btn small ghost" type="button" data-w="hint">Pista</button><button class="btn small ghost" type="button" data-w="reset">Reiniciar</button>' + (ofiDone(id) ? '<span class="xl-done">✓ Resuelto</span>' : "") + "</div>") + '<div class="xl-msg" aria-live="polite"></div>';
  const pg = el.querySelector(".wd-page"), msg = el.querySelector(".xl-msg"), st = el.querySelector(".wd-st"), tbl = el.querySelector(".wd-tbl");
  pg.innerHTML = S.ofiW[id] || W.init || "<p>Escribe aquí…</p>";
  try { document.execCommand("defaultParagraphSeparator", false, "p"); } catch (e) {}
  let range = null; const keep = () => { const s = window.getSelection(); if (s.rangeCount && pg.contains(s.anchorNode)) range = s.getRangeAt(0).cloneRange(); };
  const restore = () => { pg.focus(); if (range) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(range); } };
  const persist = () => { S.ofiW[id] = pg.innerHTML; save(); };
  ["keyup", "mouseup", "input"].forEach(ev => pg.addEventListener(ev, () => { keep(); const s = window.getSelection(); let n = s.anchorNode; while (n && n !== pg && !(n.nodeType === 1 && /^(H1|H2|H3|P|BLOCKQUOTE|LI)$/.test(n.tagName))) n = n.parentNode; if (n && n !== pg) st.value = n.tagName === "LI" ? "p" : n.tagName.toLowerCase(); }));
  pg.addEventListener("input", persist);
  st.addEventListener("change", () => { restore(); document.execCommand("formatBlock", false, "<" + st.value + ">"); persist(); });
  const capCount = () => pg.querySelectorAll(".wd-cap").length;
  el.querySelector(".wd-tb").addEventListener("mousedown", e => { if (e.target.closest("button")) e.preventDefault(); });
  el.addEventListener("click", e => { const b = e.target.closest("[data-w]"); if (!b) return; const a = b.dataset.w;
    if (a === "table") { tbl.hidden = !tbl.hidden; return; }
    if (a === "tableok") { const r = Math.max(1, Math.min(12, +el.querySelector(".wd-tr").value || 3)), c = Math.max(1, Math.min(8, +el.querySelector(".wd-tc").value || 3)); let h = "<table class='wd-t'><tbody>"; for (let i = 0; i < r; i++) { h += "<tr>"; for (let j = 0; j < c; j++) h += (i ? "<td>" : "<th>") + "&nbsp;" + (i ? "</td>" : "</th>"); h += "</tr>"; } h += "</tbody></table><p><br></p>"; restore(); document.execCommand("insertHTML", false, h); tbl.hidden = true; persist(); return; }
    if (a === "toc") { const hs = [...pg.querySelectorAll("h1,h2,h3")]; if (!hs.length) { msg.innerHTML = note("Primero aplica estilos de título (Título 1, 2 o 3) a los encabezados: la tabla de contenido se construye a partir de ellos, igual que en Word.", "warn"); return; } pg.querySelectorAll(".wd-toc").forEach(x => x.remove()); const n = [0, 0, 0]; const items = hs.map(hh => { const lv = +hh.tagName[1] - 1; n[lv]++; for (let k = lv + 1; k < 3; k++) n[k] = 0; const num = n.slice(0, lv + 1).join("."); return '<div class="wd-toci l' + lv + '"><span>' + num + " " + esc(hh.textContent) + "</span><span class='wd-dots'></span><span>" + (1 + Math.floor(hs.indexOf(hh) / 2)) + "</span></div>"; }).join("");
      pg.insertAdjacentHTML("afterbegin", '<div class="wd-toc" contenteditable="false"><div class="wd-toch">Tabla de contenido</div>' + items + "</div>"); persist(); msg.innerHTML = note("Tabla de contenido insertada con " + hs.length + " entradas (aquí los números de página son ilustrativos; Word pone los reales). Si cambias los títulos, vuelve a presionar el botón (en Word: clic derecho → Actualizar campo, o F9).", "info"); return; }
    if (a === "caption") { restore(); document.execCommand("insertHTML", false, '<p class="wd-cap">Figura ' + (capCount() + 1) + ". Escribe aquí la descripción</p>"); persist(); return; }
    if (a === "check") { let r; try { r = W.check(pg); } catch (x) { r = [false, "Revisa el documento."]; } if (r[0]) { ofiMark(id); msg.innerHTML = note("<b>¡Correcto!</b> " + (r[1] || W.why || ""), "ok"); const act = el.querySelector(".xl-act"); if (!act.querySelector(".xl-done")) act.insertAdjacentHTML("beforeend", '<span class="xl-done">✓ Resuelto</span>'); } else msg.innerHTML = note(r[1], "bad"); return; }
    if (a === "hint") { msg.innerHTML = note(W.hint, "info"); return; }
    if (a === "reset") { pg.innerHTML = W.init || "<p><br></p>"; delete S.ofiW[id]; save(); msg.innerHTML = ""; return; }
    restore(); document.execCommand(a, false, null); persist(); });
}

/* ---------- Editor de ecuaciones (formato lineal de Word) ---------- */
function eqLin(s){ return String(s).replace(/\\sqrt/g, "√").replace(/\\sum/g, "Σ").replace(/\\pi/g, "π").replace(/\\sigma/g, "σ").replace(/\\mu/g, "μ").replace(/\*/g, " × ").replace(/·/g, " × ").replace(/-/g, "−").replace(/\s*\/\s*/g, " ÷ "); }
function eqNum(src, vars){
  const s = String(src).replace(/\\sqrt/g, "√").replace(/\\pi/g, "π").replace(/\\sigma/g, "σ").replace(/\\mu/g, "μ").replace(/[−–]/g, "-").replace(/[×·]/g, "*").replace(/÷/g, "/"), T = []; let i = 0;
  while (i < s.length) { const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9.,]/.test(c)) { let j = i; while (j < s.length && /[0-9.,]/.test(s[j])) j++; T.push({ k:"n", v:parseFloat(s.slice(i, j).replace(",", ".")) }); i = j; continue; }
    if (/[A-Za-zα-ωΑ-Ω]/.test(c)) { let v = c; i++; if (s[i] === "_") { i++; if (s[i] === "(") { let j = s.indexOf(")", i); v += "_" + s.slice(i + 1, j); i = j + 1; } else { let j = i; while (j < s.length && /[A-Za-z0-9]/.test(s[j]) && j - i < 3) j++; v += "_" + s.slice(i, j); i = j; } } T.push({ k:"v", v }); continue; }
    if (c === "√") { T.push({ k:"sq" }); i++; continue; }
    if ("+-*/^()".includes(c)) { T.push({ k:c }); i++; continue; }
    throw new Error("Símbolo no reconocido: " + c); }
  let p = 0; const pk = () => T[p];
  const E = () => { let a = Tm(); while (pk() && (pk().k === "+" || pk().k === "-")) { const o = T[p++].k, b = Tm(); a = o === "+" ? a + b : a - b; } return a; };
  const startsF = t => t && (t.k === "n" || t.k === "v" || t.k === "(" || t.k === "sq");
  const Tm = () => { let a = Fc(); for (;;) { if (pk() && (pk().k === "*" || pk().k === "/")) { const o = T[p++].k, b = Fc(); a = o === "*" ? a * b : a / b; } else if (startsF(pk())) a = a * Fc(); else break; } return a; };
  const Fc = () => { if (pk() && pk().k === "-") { p++; return -Fc(); } let b = Pr(); if (pk() && pk().k === "^") { p++; b = Math.pow(b, Fc()); } return b; };
  const Pr = () => { const t = T[p++]; if (!t) throw new Error("Expresión incompleta");
    if (t.k === "n") return t.v; if (t.k === "v") { const key = t.v === "π" ? null : t.v; if (key == null) return Math.PI; if (!(key in vars)) throw new Error("Variable desconocida: " + t.v); return vars[key]; }
    if (t.k === "sq") return Math.sqrt(Pr()); if (t.k === "(") { const v = E(); if (!pk() || pk().k !== ")") throw new Error("Falta cerrar un paréntesis"); p++; return v; }
    throw new Error("Expresión mal formada"); };
  const v = E(); if (p < T.length) throw new Error("Sobran símbolos al final"); return v;
}
function eqInit(el){
  const id = el.dataset.eqx, Q = EQX[id]; if (!Q) return; S.ofiE = S.ofiE || {};
  el.innerHTML = '<p class="eq-goal"><b>Objetivo:</b></p>' + M(Q.target) + '<label class="eq-l">Escribe la ecuación en formato lineal de Word (después del signo =)</label><div class="eq-row"><input class="eq-in mono" type="text" spellcheck="false" autocomplete="off" placeholder="' + esc(Q.ph || "ej.: (a+b)/c") + '"><button class="btn small" type="button" data-e="check">Comprobar</button><button class="btn small ghost" type="button" data-e="hint">Pista</button><button class="btn small ghost" type="button" data-e="sol">Solución</button>' + (ofiDone(id) ? '<span class="xl-done">✓ Resuelto</span>' : "") + '</div><p class="hint" style="margin:6px 0 2px">Vista previa (así lo dibuja Word al presionar espacio o Enter):</p><div class="eq-prev"></div><div class="xl-msg" aria-live="polite"></div>';
  const inp = el.querySelector(".eq-in"), prev = el.querySelector(".eq-prev"), msg = el.querySelector(".xl-msg");
  const rhs = s => String(s).split("=").pop();
  const upd = () => { const v = inp.value.trim(); S.ofiE[id] = v; save(); if (!v) { prev.innerHTML = ""; return; } try { prev.innerHTML = M(Q.lhs + " = " + eqLin(rhs(v))); } catch (e) { prev.textContent = v; } };
  inp.value = S.ofiE[id] || ""; upd(); inp.addEventListener("input", upd);
  el.addEventListener("click", e => { const b = e.target.closest("[data-e]"); if (!b) return; const a = b.dataset.e;
    if (a === "hint") { msg.innerHTML = note(Q.hint, "info"); return; }
    if (a === "sol") { msg.innerHTML = note("Una forma de escribirla: <span class='mono'>" + esc(Q.sol) + "</span>", "info"); return; }
    try { let ok = true; for (let k = 0; k < 6; k++) { const vars = {}; Q.vars.forEach(([n, lo, hi]) => vars[n] = lo + Math.random() * (hi - lo)); const a1 = eqNum(rhs(inp.value), vars), b1 = Q.f(vars); if (!isFinite(a1) || Math.abs(a1 - b1) > 1e-6 * Math.max(1, Math.abs(b1))) { ok = false; break; } }
      if (ok) { ofiMark(id); msg.innerHTML = note("<b>¡Correcto!</b> La expresión es matemáticamente equivalente a la fórmula objetivo (se comprobó con valores al azar). " + (Q.why || ""), "ok"); if (!el.querySelector(".xl-done")) el.querySelector(".eq-row").insertAdjacentHTML("beforeend", '<span class="xl-done">✓ Resuelto</span>'); }
      else msg.innerHTML = note("La expresión no es equivalente. Revisa paréntesis: en formato lineal, todo el numerador o el denominador con más de un término debe ir entre paréntesis.", "bad"); }
    catch (x) { msg.innerHTML = note("No se pudo interpretar: " + esc(x.message) + ".", "bad"); } });
}
function afterRender(root){ try { if (typeof a11yScroll === "function") { setTimeout(() => a11yScroll(root), 60); setTimeout(() => a11yScroll(root), 900); } } catch (e) {} try { if (typeof w6Init === "function") setTimeout(() => w6Init(root), 0); } catch (e) {} root.querySelectorAll("textarea[data-c][data-k]").forEach(t => { try { gridInit(t); } catch (e) { console.error(e); } }); root.querySelectorAll("[data-xls]").forEach(xlsInit); root.querySelectorAll("[data-wdx]").forEach(wdInit); root.querySelectorAll("[data-eqx]").forEach(eqInit); if (typeof simInit === "function") root.querySelectorAll("[data-sim]").forEach(simInit); if (typeof ishiUI === "function") ishiUI(root); if (typeof w7Init === "function") try { w7Init(root); } catch (e) { console.error(e); } if (typeof wc1Init === "function") try { wc1Init(root); } catch (e) { console.error(e); } }

/* ---------- Ilustraciones de las ventanas ---------- */
Object.assign(D, {
  xlwin(cap, o){ o = o || {}; const W = 640, H = 330; let g = rect(5, 5, W - 10, H - 10, "dgbl", 8) + rect(5, 5, W - 10, 26, "dgb3", 8) + tx(W / 2, 18, "Libro1 – Excel", { s:11, b:true });
    ["Archivo", "Inicio", "Insertar", "Disposición", "Fórmulas", "Datos", "Revisar", "Vista"].forEach((t, i) => g += tx(40 + i * 72, 44, t, { s:10.5, b:i === (o.tab || 1), cls:i === (o.tab || 1) ? "" : "dgs" }));
    g += rect(12, 54, W - 24, 40, "dgbg", 4); ["Portapapeles", "Fuente", "Alineación", "Número", "Estilos", "Celdas", "Edición"].forEach((t, i) => g += tx(56 + i * 86, 82, t, { s:9.5, cls:"dgs" }) + ln(100 + i * 86, 60, 100 + i * 86, 88, "ax"));
    g += rect(12, 100, 70, 22, "dgb1", 3) + tx(47, 111, "D3", { s:11, b:true }) + tx(96, 111, "fx", { s:11, b:true, cls:"dgs" }) + rect(110, 100, W - 122, 22, "dgbl", 3) + tx(118, 111, "=A3*B3", { s:11, a:"start" });
    const cols = ["A", "B", "C", "D", "E", "F", "G"]; g += rect(12, 128, W - 24, 18, "dgbg", 0); cols.forEach((c, i) => g += tx(64 + i * 82, 137, c, { s:10, b:true, cls:"dgs" }));
    for (let r = 0; r < 7; r++) { const y = 146 + r * 20; g += tx(20, y + 10, String(r + 1), { s:10, cls:"dgs" }) + ln(30, y + 20, W - 12, y + 20, "ax", "opacity:.35"); }
    cols.forEach((c, i) => g += ln(28 + i * 82, 128, 28 + i * 82, 286, "ax", "opacity:.35"));
    const dat = [["Producto", "Cantidad", "Precio", "Total"], ["Tornillo", "120", "45", "5.400"], ["Tuerca", "80", "30", "2.400"]]; dat.forEach((row, r) => row.forEach((v, c) => g += tx(36 + c * 82, 156 + r * 20, v, { s:10.5, a:"start", b:r === 0 })));
    g += '<rect x="274" y="186" width="82" height="20" fill="none" style="stroke:var(--ok);stroke-width:2.4"/>';
    g += rect(12, 290, 90, 20, "dgb3", 3) + tx(57, 300, "Hoja1", { s:10, b:true }) + tx(130, 300, "⊕", { s:12, cls:"dgs" }) + tx(W - 20, 300, "Suma: 7.800   Promedio: 3.900", { s:9.5, a:"end", cls:"dgs" });
    const lab = [[620, 44, ""], [600, 111, ""], [12, 100, ""], [366, 196, ""], [112, 300, ""], [470, 300, ""]];
    lab.forEach((l, i) => g += '<circle class="dgnc" cx="' + l[0] + '" cy="' + l[1] + '" r="9"/><text class="dgnt" x="' + l[0] + '" y="' + (l[1] + 4) + '" text-anchor="middle">' + (i + 1) + "</text>");
    return fig(W, H, g, cap || "Partes de la ventana de Excel: (1) cinta de opciones con pestañas y grupos; (2) barra de fórmulas, que muestra lo que realmente contiene la celda (=A3*B3); (3) cuadro de nombres, que indica la celda activa (D3); (4) celda activa, que muestra el resultado (2.400); (5) pestañas de hojas; (6) barra de estado, con la suma y el promedio de lo seleccionado.", 520); },
  wdwin(cap){ const W = 640, H = 340; let g = rect(5, 5, W - 10, H - 10, "dgbl", 8) + rect(5, 5, W - 10, 26, "dgb1", 8) + tx(W / 2, 18, "Informe técnico – Word", { s:11, b:true });
    ["Archivo", "Inicio", "Insertar", "Diseño", "Disposición", "Referencias", "Correspondencia", "Revisar", "Vista"].forEach((t, i) => g += tx(38 + i * 68, 44, t, { s:10, b:i === 1, cls:i === 1 ? "" : "dgs" }));
    g += rect(12, 54, W - 24, 40, "dgbg", 4); ["Portapapeles", "Fuente", "Párrafo", "Estilos", "Edición"].forEach((t, i) => g += tx(66 + i * 120, 82, t, { s:9.5, cls:"dgs" }));
    [["Normal", 0], ["Título 1", 1], ["Título 2", 2]].forEach((s, i) => g += rect(372 + i * 52, 58, 48, 18, i === 1 ? "dgb2" : "dgbl", 3) + tx(396 + i * 52, 67, s[0], { s:8.5 }));
    g += rect(12, 100, 150, 228, "dgbg", 4) + tx(87, 114, "Panel de navegación", { s:10, b:true }); ["1. Introducción", "2. Diagnóstico", "   2.1 Datos", "3. Propuesta", "4. Conclusiones"].forEach((t, i) => g += tx(22, 134 + i * 18, t, { s:10, a:"start" }));
    g += rect(190, 100, 380, 228, "dgbl", 2); g += tx(210, 124, "2. Diagnóstico", { s:15, b:true, a:"start" }) + tx(210, 146, "2.1 Datos del proceso", { s:12, b:true, a:"start" });
    for (let i = 0; i < 5; i++) g += ln(210, 166 + i * 12, 550 - (i === 4 ? 120 : 0), 166 + i * 12, "ax", "opacity:.6");
    g += rect(260, 236, 240, 50, "dgb5", 2) + tx(380, 261, "[Figura]", { s:10, cls:"dgs" }) + tx(380, 300, "Figura 1. Diagrama de flujo del proceso", { s:9.5, cls:"dgs" }) + tx(380, 320, "— 3 —", { s:9, cls:"dgs" });
    return fig(W, H, g, cap || "Partes de Word: cinta de opciones, galería de estilos (Normal, Título 1, Título 2), panel de navegación (se arma solo con los títulos) y el documento con títulos, texto, figura con su título y número de página.", 520); },
  refs(cap){ const W = 620, H = 210; let g = "";
    [["Relativa: =B2*C2", "Al copiar hacia abajo cambia a =B3*C3, =B4*C4…", "dgb1"], ["Absoluta: =B2*$F$1", "$F$1 queda fija al copiar: todas las filas usan la misma tasa", "dgb2"], ["Mixta: =$A2*B$1", "Fija la columna A o la fila 1; útil en tablas de doble entrada", "dgb3"]].forEach((t, i) => { const y = 14 + i * 64; g += rect(14, y, 220, 50, t[2], 8) + tx(124, y + 25, t[0], { b:true, s:12 }) + arrow(238, y + 25, 268, y + 25) + tx(280, y + 25, t[1], { a:"start", s:11, n:46 }); });
    return fig(W, H, g, cap || "Tipos de referencias: el signo $ «congela» la columna, la fila o ambas al copiar la fórmula. Tecla F4 para alternar entre ellas.", 480); },
  lookup(cap){ const W = 620, H = 220; let g = "";
    const rows = [["Código", "Producto", "Precio"], ["P-01", "Tornillo", "45"], ["P-02", "Tuerca", "30"], ["P-03", "Perno", "120"]];
    rows.forEach((r, i) => r.forEach((v, j) => g += rect(250 + j * 110, 20 + i * 34, 110, 34, i === 0 ? "dgbg" : i === 2 ? (j === 0 ? "dgb2" : j === 2 ? "dgb3" : "dgbl") : "dgbl", 0) + tx(305 + j * 110, 37 + i * 34, v, { s:11, b:i === 0 })));
    g += rect(20, 80, 150, 44, "dgb2", 8) + tx(95, 102, "Busco: «P-02»", { b:true, s:11.5 }) + arrow(172, 102, 246, 105, "dgcrit") + arrow(470, 105, 470, 175, "dgcrit") + rect(400, 176, 140, 34, "dgb3", 8) + tx(470, 193, "Resultado: 30", { b:true, s:11.5 });
    g += tx(20, 160, "=BUSCARV(\"P-02\"; A2:C4; 3; FALSO)", { a:"start", s:10.5, cls:"dgs", n:40 }) + tx(20, 182, "=BUSCARX(\"P-02\"; A2:A4; C2:C4)", { a:"start", s:10.5, cls:"dgs", n:40 });
    return fig(W, H, g, cap || "Cómo funciona una búsqueda: Excel recorre la primera columna hasta encontrar el código y devuelve el valor de la columna indicada en esa misma fila.", 480); },
  pivot(cap){ const W = 640, H = 230; let g = tx(130, 14, "Datos (una fila por venta)", { b:true, s:11 }) + tx(500, 14, "Tabla dinámica", { b:true, s:11 });
    const src = [["Fecha", "Zona", "Monto"], ["03-01", "Norte", "120"], ["05-01", "Sur", "80"], ["09-01", "Norte", "200"], ["12-01", "Centro", "50"], ["15-01", "Sur", "70"]];
    src.forEach((r, i) => r.forEach((v, j) => g += rect(20 + j * 74, 26 + i * 28, 74, 28, i ? "dgbl" : "dgbg", 0) + tx(57 + j * 74, 40 + i * 28, v, { s:10.5, b:!i })));
    g += arrow(250, 110, 380, 110, "dgcrit") + tx(315, 96, "Insertar → Tabla dinámica", { s:9.5, cls:"dgs" });
    [["Zona", "Suma de Monto"], ["Centro", "50"], ["Norte", "320"], ["Sur", "150"], ["Total", "520"]].forEach((r, i) => r.forEach((v, j) => g += rect(400 + j * 110, 40 + i * 30, 110, 30, i === 0 || i === 4 ? "dgb1" : "dgbl", 0) + tx(455 + j * 110, 55 + i * 30, v, { s:10.5, b:i === 0 || i === 4 })));
    return fig(W, H, g, cap || "Una tabla dinámica resume miles de filas en segundos: arrastras «Zona» a Filas y «Monto» a Valores, y Excel calcula los totales.", 500); },
  dash(cap){ const W = 640, H = 270; let g = rect(5, 5, W - 10, H - 10, "dgbl", 8) + tx(20, 24, "Tablero de producción – Marzo", { a:"start", b:true, s:13, n:40 });
    [["OEE", "71 %", "meta 75 %"], ["OTIF", "94 %", "meta 95 %"], ["Mermas", "2,1 %", "meta < 2,5 %"], ["Accidentes", "0", "meta 0"]].forEach((k, i) => g += rect(16 + i * 154, 40, 144, 62, i < 2 ? "dgb4" : "dgb3", 8) + tx(88 + i * 154, 56, k[0], { s:10.5, cls:"dgs" }) + tx(88 + i * 154, 76, k[1], { b:true, s:17 }) + tx(88 + i * 154, 94, k[2], { s:9.5, cls:"dgs" }));
    const v = [62, 68, 66, 71, 74, 70, 73]; g += rect(16, 112, 300, 144, "dgbg", 6) + tx(26, 126, "OEE semanal (%)", { a:"start", s:10, b:true }); g += '<polyline class="s1" points="' + v.map((x, i) => (36 + i * 42) + "," + (240 - (x - 55) * 4.5)).join(" ") + '"/>';
    const p = [45, 25, 15, 10]; g += rect(330, 112, 294, 144, "dgbg", 6) + tx(340, 126, "Pareto de paradas (%)", { a:"start", s:10, b:true, n:30 }); p.forEach((x, i) => g += tx(373 + i * 66, 238 - x * 2, x + " %", { s:9.5, cls:"dgk" }) + rect(350 + i * 66, 246 - x * 2, 46, x * 2, i < 2 ? "dgbh" : "dgb1", 2));
    return fig(W, H, g, cap || "Un buen tablero: pocos indicadores con meta visible arriba, tendencia en el tiempo y un gráfico que explique las causas.", 520); }
});
