/* ============ ILUSTRACIONES DE HOJA CON CELDAS (letra + número) Y DE PÁGINA DE WORD ============ */
Object.assign(D, {
  /* rows: matriz de valores mostrados (fila 1 = fila 1 de Excel). o.sel celda activa, o.f fórmula de la barra,
     o.hl {"C2":1, "B2:B7":2} colores 1-4, o.ar flechas [[desde, hacia]], o.notes [[color, texto]], o.r0/o.c0 primera fila/columna visibles */
  sheet(rows, o){ o = o || {}; const r0 = o.r0 || 1, c0 = o.c0 || 1, nc = Math.max(...rows.map(r => r.length)), RH = 24, NW = 30;
    const isNum = v => /^[-−$]?\s?[\d.,]+\s?%?$/.test(String(v).trim()) && /\d/.test(String(v));
    const cw = Array.from({ length:nc }, (_, j) => (o.w && o.w[j]) || Math.max(54, Math.min(170, Math.max(...rows.map(r => String(r[j] ?? "").length)) * 7.2 + 16)));
    const top = o.sel ? 40 : 6, gx = 8, W = Math.max(gx + NW + cw.reduce((a, b) => a + b, 0) + 10, o.minW || 0, 360);
    const cx = j => gx + NW + cw.slice(0, j).reduce((a, b) => a + b, 0), ry = i => top + 20 + i * RH;
    const hl = {}; Object.entries(o.hl || {}).forEach(([k, v]) => { if (k.includes(":")) { const [a, b] = k.split(":").map(XL.parseRef); for (let r = a.r; r <= b.r; r++) for (let c = a.c; c <= b.c; c++) hl[XL.refStr(r, c)] = v; } else hl[k] = v; });
    const at = ref => { const p = XL.parseRef(ref); return { j:p.c - c0, i:p.r - r0 }; };
    let g = "";
    if (o.sel) { g += rect(gx, 6, 58, 24, "dgbl", 3) + tx(gx + 29, 18, o.sel, { s:11.5, b:true }) + tx(gx + 72, 18, "fx", { s:11.5, b:true, cls:"dgs" }) + rect(gx + 86, 6, W - gx - 94, 24, "dgbl", 3) + tx(gx + 94, 18, o.f || "", { s:11.5, a:"start", n:200 }); }
    g += rect(gx, top, W - gx - 2 - 8 + 8 - 8, 20, "dgbg", 0);
    const selP = o.sel ? at(o.sel) : null;
    for (let j = 0; j < nc; j++) { const on = selP && selP.j === j; if (on) g += rect(cx(j), top, cw[j], 20, "dgb3", 0); g += tx(cx(j) + cw[j] / 2, top + 10, XL.colL(c0 + j), { s:10.5, b:true, cls:on ? "" : "dgs" }); }
    rows.forEach((row, i) => { const y = ry(i), on = selP && selP.i === i; if (on) g += rect(gx, y, NW, RH, "dgb3", 0); else g += rect(gx, y, NW, RH, "dgbg", 0); g += tx(gx + NW / 2, y + RH / 2, String(r0 + i), { s:10.5, b:true, cls:on ? "" : "dgs" });
      for (let j = 0; j < nc; j++) { const ref = XL.refStr(r0 + i, c0 + j), v = row[j] ?? "", c = hl[ref], head = o.head !== false && i === 0 && r0 === 1;
        g += rect(cx(j), y, cw[j], RH, c ? "dgb" + c : head ? "dgbg" : "dgbl", 0);
        if (v !== "") g += isNum(v) && !head ? tx(cx(j) + cw[j] - 6, y + RH / 2, v, { s:11, a:"end", n:200, b:ref === o.sel }) : tx(cx(j) + 6, y + RH / 2, v, { s:11, a:"start", n:200, b:head || ref === o.sel, cls:String(v)[0] === "=" ? "dgs" : "" }); } });
    if (selP) g += '<rect x="' + cx(selP.j) + '" y="' + ry(selP.i) + '" width="' + cw[selP.j] + '" height="' + RH + '" fill="none" style="stroke:var(--ok);stroke-width:2.6"/>';
    (o.box || []).forEach(k => { const [a, b] = k.split(":").map(at); g += '<rect x="' + (cx(a.j) + 1) + '" y="' + (ry(a.i) + 1) + '" width="' + (cx(b.j) + cw[b.j] - cx(a.j) - 2) + '" height="' + ((b.i - a.i + 1) * RH - 2) + '" fill="none" style="stroke:var(--copper);stroke-width:2;stroke-dasharray:5 3"/>'; });
    (o.ar || []).forEach(([f, t]) => { const a = at(f), b = at(t), x1 = cx(a.j) + cw[a.j] / 2, y1 = ry(a.i) + RH / 2, x2 = cx(b.j) + cw[b.j] / 2, y2 = ry(b.i) + RH / 2; const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, s = 10; g += arrow(x1 + dx / L * s, y1 + dy / L * s, x2 - dx / L * (s + 2), y2 - dy / L * (s + 2), "dgcrit"); });
    let H = ry(rows.length) + 8;
    (o.notes || []).forEach(n => { const L = wrapT(n[1], Math.floor((W - 44) / 6.3)); g += (n[0] ? rect(gx, H + 2, 14, 14, "dgb" + n[0], 2) : "") + tx(gx + (n[0] ? 22 : 0), H + 9 + (L.length - 1) * 7, n[1], { s:11, a:"start", n:Math.floor((W - 44) / 6.3) }); H += L.length * 14 + 8; });
    return fig(W, H + 4, g, o.cap || "", Math.min(W, o.minw || 300)); },
  /* Página de Word: items [{k:"h1"|"h2"|"p"|"li"|"tbl"|"fig"|"cap"|"toc"|"hdr"|"ftr"|"brk"|"quote", t:"texto"}], callouts por índice {2:"1"} */
  wdpage(items, o){ o = o || {}; const W = o.W || 600, PX = 110, PW = 380, ML = 40; let y = 54, g = "";
    g += rect(PX - 30, 6, PW + 60, 18, "dgbg", 2); for (let i = 0; i <= 17; i++) g += ln(PX - 30 + i * 26, 18, PX - 30 + i * 26, 24, "ax", "opacity:.5");
    g += '<polygon class="dgah" points="' + (PX) + ',8 ' + (PX - 5) + ',16 ' + (PX + 5) + ',16"/><polygon class="dgah" points="' + (PX + PW) + ',8 ' + (PX + PW - 5) + ',16 ' + (PX + PW + 5) + ',16"/>';
    const body = [];
    items.forEach((it, idx) => { const k = it.k, mark = o.marks; let h = 0, s = "";
      if (k === "hdr" || k === "ftr") { h = 18; s = tx(PX + PW / 2, y + 9, it.t, { s:9.5, cls:"dgs", n:70 }) + ln(PX, k === "hdr" ? y + 18 : y, PX + PW, k === "hdr" ? y + 18 : y, "ax", "opacity:.5;stroke-dasharray:3 3"); }
      else if (k === "h1") { h = 26; s = tx(PX, y + 13, it.t, { s:15, b:true, a:"start", n:60 }); }
      else if (k === "h2") { h = 22; s = tx(PX, y + 11, it.t, { s:12.5, b:true, a:"start", n:60 }); }
      else if (k === "p" || k === "li" || k === "quote") { const L = wrapT(it.t, k === "quote" ? 58 : 66); h = L.length * 14 + 6; s = (k === "li" ? tx(PX + 4, y + 7, "•", { s:12 }) : "") + (k === "quote" ? ln(PX + 10, y, PX + 10, y + h - 4, "dgcrit") : "") + tx(PX + (k === "li" ? 16 : k === "quote" ? 22 : 0), y + 7 + (L.length - 1) * 7, it.t + (mark ? " ¶" : ""), { s:10.5, a:"start", n:k === "quote" ? 58 : 66 }); }
      else if (k === "tbl") { const R = it.rows, cw = PW / R[0].length; h = R.length * 20 + 4; R.forEach((r, i) => r.forEach((v, j) => s += rect(PX + j * cw, y + i * 20, cw, 20, i === 0 ? "dgb1" : "dgbl", 0) + tx(PX + j * cw + cw / 2, y + i * 20 + 10, v, { s:10, b:i === 0, n:40 }))); }
      else if (k === "fig") { h = 70; s = rect(PX + 90, y, PW - 180, 62, "dgb5", 3) + tx(PX + PW / 2, y + 31, it.t || "[Imagen]", { s:10, cls:"dgs", n:30 }); }
      else if (k === "cap") { h = 18; s = tx(PX + PW / 2, y + 8, it.t, { s:9.5, cls:"dgs", n:80 }); }
      else if (k === "toc") { h = it.rows.length * 16 + 4; it.rows.forEach((r, i) => { s += tx(PX + (r[2] ? 14 : 0), y + 8 + i * 16, r[0], { s:10.5, a:"start", n:60 }) + tx(PX + PW, y + 8 + i * 16, r[1], { s:10.5, a:"end" }) + ln(PX + (r[2] ? 14 : 0) + r[0].length * 5.8 + 8, y + 12 + i * 16, PX + PW - 16, y + 12 + i * 16, "ax", "opacity:.6;stroke-dasharray:1 3"); }); }
      else if (k === "brk") { h = 18; s = ln(PX, y + 9, PX + PW, y + 9, "ax", "stroke-dasharray:4 3") + rect(PX + PW / 2 - 80, y + 1, 160, 16, "dgbl", 3) + tx(PX + PW / 2, y + 9, it.t || "Salto de sección (página siguiente)", { s:9, cls:"dgs", n:60 }); }
      body.push([idx, y, h]); g += s; y += h + 6; });
    const H = y + 14; g = rect(PX - 30, 32, PW + 60, H - 40, "dgbl", 2) + '<rect x="' + PX + '" y="44" width="' + PW + '" height="' + (H - 64) + '" fill="none" style="stroke:var(--c3);stroke-dasharray:2 4;opacity:.6"/>' + g;
    Object.entries(o.call || {}).forEach(([idx, n]) => { const b = body.find(q => q[0] === +idx); if (!b) return; const cyy = b[1] + Math.min(b[2], 26) / 2, cx2 = PX + PW + 52; g += ln(PX + PW + 4, cyy, cx2 - 10, cyy, "dgcrit") + '<circle class="dgnc" cx="' + cx2 + '" cy="' + cyy + '" r="9"/><text class="dgnt" x="' + cx2 + '" y="' + (cyy + 4) + '" text-anchor="middle">' + n + "</text>"; });
    (o.left || []).forEach(([idx, t]) => { const b = body.find(q => q[0] === idx); if (b) g += tx(PX - 36, b[1] + 9, t, { s:9, a:"end", cls:"dgs", n:14 }); });
    return fig(W, H, g, o.cap || "", 300); },
  /* Ruta de clics en la cinta: ["Insertar", "Tabla", "Insertar tabla…"] */
  ruta(steps, cap){ const MX = 430; let x = 8, y = 8, g = "", W = 0; const pos = [];
    steps.forEach((s, i) => { const w = Math.max(70, s.length * 7.4 + 22); if (x + w > MX && x > 8) { x = 8; y += 46; } pos.push([x, y, w]); x += w + 26; W = Math.max(W, x); });
    steps.forEach((s, i) => { const [px, py, w] = pos[i]; g += rect(px, py, w, 30, i === steps.length - 1 ? "dgb3" : i === 0 ? "dgb1" : "dgbl", 6) + tx(px + w / 2, py + 15, (i + 1) + ". " + s, { s:11.5, b:i === steps.length - 1, n:80 });
      if (i < steps.length - 1) { const nx = pos[i + 1]; if (nx[1] === py) g += arrow(px + w + 3, py + 15, px + w + 22, py + 15); else g += arrow(px + w / 2, py + 31, nx[0] + nx[2] / 2, nx[1] - 1); } });
    return fig(Math.max(W, 300), y + 46, g, cap || "", 300); }
});

/* ============ CALCULADORAS: posición en la tabla, Enter para bajar, validación y datos usados ============ */
const gdNum = s => /^-?\s*\$?\s*(\d+|\d{1,3}(\.\d{3})+)([.,]\d+)?\s*%?$/.test(String(s).trim());
function gdPos(inp){ const td = inp.closest("td"), tr = inp.closest("tr"), tb = inp.closest("table"); if (!td || !tb) return; const j = [...tr.children].indexOf(td), rh = tr.querySelector(".gd-rh"), ch = tb.tHead && tb.tHead.rows[0].children[j];
  tb.querySelectorAll(".gd-on").forEach(e => e.classList.remove("gd-on")); if (rh) rh.classList.add("gd-on"); if (ch) ch.classList.add("gd-on"); tr.classList.add("gd-on");
  const bar = tb.closest(".gd") ? tb.closest(".gd").querySelector(".gd-bar") : null; if (!bar) return; let p = bar.parentNode.querySelector(".gd-pos"); if (!p) { p = document.createElement("div"); p.className = "gd-pos"; bar.parentNode.insertBefore(p, bar); }
  p.innerHTML = "Estás escribiendo en: fila <b>" + esc(rh ? rh.textContent : "") + "</b> · columna <b>" + esc(ch ? ch.textContent : "") + "</b>. <span class='hint'>Enter baja a la fila siguiente; Tab avanza a la derecha.</span>"; }
document.addEventListener("focusin", e => { const t = e.target; if (t.matches && t.matches(".gd-t input, .gd-t select")) gdPos(t); });
document.addEventListener("keydown", e => { const t = e.target; if (e.key !== "Enter" || !t.matches || !t.matches(".gd-t input, .gd-item input")) return; e.preventDefault();
  if (t.dataset.i != null) { const n = t.closest(".gd-list").querySelector('input[data-i="' + (+t.dataset.i + 1) + '"]'); if (n) { n.focus(); n.select(); } return; }
  const n = t.closest("tbody").querySelector('[data-r="' + (+t.dataset.r + 1) + '"][data-j="' + t.dataset.j + '"]'); if (n) { n.focus(); if (n.select) n.select(); } });
document.addEventListener("input", e => { const t = e.target; if (t.matches && t.matches(".gd-t input.n, .gd-item input")) t.classList.toggle("gd-bad", t.value.trim() !== "" && !gdNum(t.value)); });
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest('[data-act="calc"]'); if (!b) return; const form = b.closest(".card.form") || document; const issues = [], marks = [];
  form.querySelectorAll(".gd-t").forEach((tb, ti) => tb.querySelectorAll("tbody tr").forEach(tr => { const ins = [...tr.querySelectorAll("input.n")], filled = ins.some(i => i.value.trim() !== ""), rn = tr.querySelector(".gd-rh");
    ins.forEach(i => { const v = i.value.trim(), j = [...tr.children].indexOf(i.closest("td")), cn = tb.tHead.rows[0].children[j], where = (rn ? rn.textContent : "") + " · " + (cn ? cn.textContent : "");
      if (v === "" && filled) { marks.push([ti, i.dataset.r, i.dataset.j, "gd-empty"]); issues.push(where + ": vacía"); } else if (v !== "" && !gdNum(v)) { marks.push([ti, i.dataset.r, i.dataset.j, "gd-bad"]); issues.push(where + ": «" + v + "» no es un número"); } }); }));
  form.querySelectorAll(".gd-list").forEach((ls, li) => ls.querySelectorAll("input").forEach(i => { const v = i.value.trim(); if (v !== "" && !gdNum(v)) { marks.push([li, i.dataset.i, null, "gd-bad", 1]); issues.push(i.parentNode.querySelector("span").textContent + ": «" + v + "» no es un número"); } }));
  setTimeout(() => { const f = document.querySelector(".card.form"); if (!f) return; let w = f.querySelector(".gd-warn"); if (!issues.length) { if (w) w.remove(); return; }
    const T = f.querySelectorAll(".gd-t"), Ls = f.querySelectorAll(".gd-list");
    marks.forEach(m => { const el = m[4] ? Ls[m[0]] && Ls[m[0]].querySelector('input[data-i="' + m[1] + '"]') : T[m[0]] && T[m[0]].querySelector('input[data-r="' + m[1] + '"][data-j="' + m[2] + '"]'); if (el) el.classList.add(m[3]); });
    if (!w) { w = document.createElement("div"); w.className = "note warn gd-warn"; f.insertBefore(w, f.querySelector(".actions")); }
    w.innerHTML = "<b>Revisa estas casillas</b> (marcadas en color en la tabla): " + issues.slice(0, 8).map(esc).join(" · ") + (issues.length > 8 ? " · y " + (issues.length - 8) + " más" : "") + ". Una fila a medio llenar o un texto donde va un número producen resultados erróneos. Usa coma o punto para decimales (12,5 o 12.5) y no escribas unidades dentro de la casilla."; }, 80); }, true);
