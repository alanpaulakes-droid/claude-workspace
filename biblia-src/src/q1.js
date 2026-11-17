/* ============ EDITOR DE TABLAS PARA LAS CALCULADORAS ============ */
// Especificaciones: nombres de columnas y filas tomados de otros campos de la misma calculadora.
const GRID = {
  "transporte.C":{ varCols:"dn", rowNames:"on", corner:"Origen \\ Destino", varLabel:"Destino" },
  "transporte.O":{ labelsFrom:"on", fallback:"Origen" },
  "transporte.D":{ labelsFrom:"dn", fallback:"Destino" },
  "asignacion.M":{ varCols:"cn", rowNames:"rn", corner:"Recurso \\ Tarea", varLabel:"Tarea" },
  "programacion-lineal.res":{ varCols:"vars", varSplit:/\s+/, tail:[{ n:"Signo", t:"op" }, { n:"Lado derecho (disponible)", t:"n" }], rowLabel:"Restricción", varLabel:"Coef. de" },
  "programacion-lineal.obj":{ labelsFrom:"vars", split:/\s+/, fallback:"Variable" },
  "decisiones.m":{ head:[{ n:"Alternativa", t:"t" }], varCols:"es", varLabel:"Escenario" },
  "decisiones.p":{ labelsFrom:"es", fallback:"Escenario" },
  "factores.m":{ head:[{ n:"Criterio", t:"t" }, { n:"Peso (%)", t:"n" }], varCols:"alt", varLabel:"Nota" },
  "raci.m":{ head:[{ n:"Actividad", t:"t" }], varCols:"roles", varLabel:"Rol", varType:"raci" },
  "eoq.desc":{ cols:[{ n:"Desde (unidades)", t:"n" }, { n:"Precio unitario ($)", t:"n" }], rowLabel:"Tramo" },
  "cpm.a":{ cols:[{ n:"Actividad", t:"t" }, { n:"Precedentes (separados por coma, - si no tiene)", t:"t" }, { n:"Duración (u optimista)", t:"n" }, { n:"Más probable (PERT, opcional)", t:"n" }, { n:"Pesimista (PERT, opcional)", t:"n" }] },
  "control-xr.sg":{ varLabel:"Medición", rowLabel:"Subgrupo" },
  "van-tir.flujos":{ fixedLabel:i => "Año " + i },
  "vida-economica.VM":{ fixedLabel:i => "Año " + (i + 1) },
  "vida-economica.CO":{ fixedLabel:i => "Año " + (i + 1) },
  "pronosticos.D":{ fixedLabel:i => "Período " + (i + 1) },
  "mrp.RB":{ fixedLabel:i => "Período " + (i + 1) },
  "mrp.RP":{ fixedLabel:i => "Período " + (i + 1) },
  "tiempo-estandar.x":{ fixedLabel:i => "Lectura " + (i + 1) },
  "descriptiva.x":{ fixedLabel:i => "Dato " + (i + 1) }
};
const cap1 = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const gNames = (cid, key, split) => { const el = document.getElementById("f-" + cid + "-" + key); return el && el.value.trim() ? el.value.split(split || /\s*;\s*/).map(s => s.trim()).filter(Boolean) : []; };
function gridCols(cid, f, data){
  const sp = GRID[cid + "." + f.k] || {}, maxLen = Math.max(0, ...data.map(r => r.length));
  if (sp.cols) return { cols:sp.cols.map(c => Object.assign({}, c)), variable:false };
  if (sp.varCols || sp.head || sp.tail || sp.varLabel) {
    const head = sp.head || [], tail = sp.tail || [], names = sp.varCols ? gNames(cid, sp.varCols, sp.varSplit) : [], nVar = Math.max(names.length, maxLen - head.length - tail.length, 1);
    const vc = []; for (let j = 0; j < nVar; j++) vc.push({ n:names[j] || ((sp.varLabel || "Columna") + " " + (j + 1)), t:sp.varType || "n", v:true });
    return { cols:head.concat(vc, tail), variable:true, nHead:head.length, nTail:tail.length };
  }
  const lbl = f.l.includes(":") ? f.l.split(":").slice(1).join(":") : f.l;
  if (lbl.includes(";")) { const parts = lbl.split(";").map(s => cap1(s.trim().replace(/\s+/g, " "))); const cols = parts.map((n, j) => { const vals = data.map(r => r[j]).filter(x => x != null && x !== ""); const numeric = vals.length ? vals.filter(x => fin(num(x)) || x === "-").length >= vals.length * 0.8 : !/nombre|descrip|tarea|actividad|id\b|código|fuente|unidad|precedentes|medida|tipo|alternativa|criterio|desde|hasta|categor|proceso|insumo|modo|peligro|punto|trabajo/i.test(n); return { n, t:numeric ? "n" : "t" }; });
    while (cols.length < maxLen) cols.push({ n:"Columna " + (cols.length + 1), t:"n" });
    return { cols, variable:false }; }
  const cols = []; for (let j = 0; j < Math.max(maxLen, 1); j++) cols.push({ n:"Columna " + (j + 1), t:"n", v:true });
  return { cols, variable:true, nHead:0, nTail:0 };
}
function gridInit(ta){
  const cid = ta.dataset.c, k = ta.dataset.k; if (!C[cid]) return; const f = C[cid].f.find(x => x.k === k); if (!f || (f.t !== "mat" && f.t !== "list")) return;
  const old = ta.parentNode.querySelector(".gd[data-for='" + k + "']"); if (old) old.remove();
  const wrap = document.createElement("div"); wrap.className = "gd"; wrap.dataset.for = k; ta.parentNode.insertBefore(wrap, ta); ta.hidden = !ta.dataset.raw;
  const sync = () => { ta.value = f.t === "list" ? wrap._get().filter(x => x !== "").join(" ") : wrap._get().filter(r => r.some(x => x !== "")).map(r => r.map(x => x === "" ? "" : x).join(";")).join("\n"); ta.dispatchEvent(new Event("input", { bubbles:true })); };
  const pasteGrid = (e, r0, c0, setCell) => { const t = (e.clipboardData || window.clipboardData).getData("text"); if (!/[\t\n]/.test(t)) return false; e.preventDefault(); t.replace(/\r/g, "").split("\n").filter((l, i, a) => l !== "" || i < a.length - 1).forEach((line, i) => line.split("\t").forEach((v, j) => setCell(r0 + i, c0 + j, v.trim()))); return true; };
  if (f.t === "list") {
    const sp = GRID[cid + "." + k] || {}; let vals = String(ta.value || "").split(/[\s;]+/).filter(x => x !== "");
    const fixed = f.l.includes(":") && f.l.split(":")[1].includes(";") ? f.l.split(":")[1].split(";").map(s => cap1(s.trim())) : null;
    const draw = () => { const names = sp.labelsFrom ? gNames(cid, sp.labelsFrom, sp.split) : [], n = fixed ? Math.max(fixed.length, vals.length) : Math.max(vals.length, names.length, 1);
      wrap.innerHTML = '<div class="gd-list">' + Array.from({ length:n }, (_, i) => '<label class="gd-item"><span>' + esc(fixed ? (fixed[i] || "Valor " + (i + 1)) : names[i] || (sp.fixedLabel ? sp.fixedLabel(i) : (sp.fallback || "Valor") + " " + (i + 1))) + '</span><input type="text" inputmode="decimal" data-i="' + i + '" value="' + esc(vals[i] ?? "") + '"></label>').join("") + "</div>" +
        '<div class="gd-bar">' + (fixed ? "" : '<button type="button" class="btn small ghost" data-g="add">+ Agregar valor</button><button type="button" class="btn small ghost" data-g="del">− Quitar el último</button>') + '<button type="button" class="btn small ghost" data-g="raw">' + (ta.hidden ? "Ver como texto" : "Ocultar texto") + "</button></div>"; };
    wrap._get = () => [...wrap.querySelectorAll(".gd-item input")].map(x => x.value.trim());
    wrap.addEventListener("input", e => { if (e.target.dataset.i != null) { vals = wrap._get(); sync(); } });
    wrap.addEventListener("paste", e => { const inp = e.target.closest("input[data-i]"); if (!inp) return; const t = (e.clipboardData || window.clipboardData).getData("text"); if (!/[\t\n ;]/.test(t.trim())) return; e.preventDefault(); const add = t.trim().split(/[\t\n; ]+/); vals = wrap._get(); add.forEach((v, j) => vals[+inp.dataset.i + j] = v); draw(); sync(); });
    wrap.addEventListener("click", e => { const b = e.target.closest("[data-g]"); if (!b) return; vals = wrap._get(); if (b.dataset.g === "add") vals.push(""); else if (b.dataset.g === "del") vals.pop(); else if (b.dataset.g === "raw") { ta.hidden = !ta.hidden; ta.dataset.raw = ta.hidden ? "" : "1"; } draw(); if (b.dataset.g !== "raw") sync(); });
    ta.addEventListener("change", () => { vals = String(ta.value || "").split(/[\s;]+/).filter(x => x !== ""); draw(); });
    draw(); return;
  }
  let data = rows(ta.value).map(r => r.slice()); if (!data.length) data = [[]];
  const sp = GRID[cid + "." + k] || {};
  const draw = () => { const G = gridCols(cid, f, data), rn = sp.rowNames ? gNames(cid, sp.rowNames) : [];
    data = data.map(r => { const o = r.slice(0, G.cols.length); while (o.length < G.cols.length) o.push(""); return o; });
    let h = '<div class="gd-wrap"><table class="gd-t"><thead><tr><th class="gd-rh">' + esc(sp.corner || (sp.rowLabel ? sp.rowLabel : "#")) + "</th>" + G.cols.map(c => '<th class="' + (c.t === "n" ? "n" : "") + '">' + esc(c.n) + "</th>").join("") + "<th></th></tr></thead><tbody>";
    data.forEach((r, i) => { h += '<tr><th class="gd-rh">' + esc(rn[i] || (sp.rowLabel ? sp.rowLabel + " " + (i + 1) : String(i + 1))) + "</th>" + G.cols.map((c, j) => { const v = r[j] ?? ""; if (c.t === "op") return '<td><select data-r="' + i + '" data-j="' + j + '">' + ["<=", ">=", "="].map(o => '<option value="' + o + '"' + (v.replace("≤", "<=").replace("≥", ">=") === o ? " selected" : "") + ">" + (o === "<=" ? "≤" : o === ">=" ? "≥" : "=") + "</option>").join("") + "</select></td>"; return '<td><input type="text" data-r="' + i + '" data-j="' + j + '"' + (c.t === "n" ? ' inputmode="decimal" class="n"' : "") + ' value="' + esc(v) + '" aria-label="' + esc((rn[i] || "Fila " + (i + 1)) + ", " + c.n) + '"></td>'; }).join("") + '<td><button type="button" class="gd-x" data-g="delrow" data-r="' + i + '" title="Eliminar fila" aria-label="Eliminar fila">×</button></td></tr>'; });
    h += "</tbody></table></div><div class='gd-bar'><button type='button' class='btn small ghost' data-g='addrow'>+ Agregar fila</button>" + (G.variable ? "<button type='button' class='btn small ghost' data-g='addcol'>+ Columna</button><button type='button' class='btn small ghost' data-g='delcol'>− Columna</button>" : "") + "<button type='button' class='btn small ghost' data-g='raw'>" + (ta.hidden ? "Ver como texto" : "Ocultar texto") + "</button><span class='hint'>Puedes pegar un rango copiado desde Excel en cualquier celda.</span></div>";
    wrap.innerHTML = h; wrap._G = G; };
  wrap._get = () => data;
  wrap.addEventListener("input", e => { const t = e.target; if (t.dataset.r == null || t.dataset.j == null) return; data[+t.dataset.r][+t.dataset.j] = t.value.trim(); sync(); });
  wrap.addEventListener("change", e => { const t = e.target; if (t.tagName === "SELECT") { data[+t.dataset.r][+t.dataset.j] = t.value; sync(); } });
  wrap.addEventListener("paste", e => { const t = e.target.closest("input[data-r]"); if (!t) return; if (pasteGrid(e, +t.dataset.r, +t.dataset.j, (r, j, v) => { while (data.length <= r) data.push([]); const row = data[r]; while (row.length <= j) row.push(""); row[j] = v; })) { draw(); sync(); } });
  wrap.addEventListener("click", e => { const b = e.target.closest("[data-g]"); if (!b) return; const a = b.dataset.g, G = wrap._G;
    if (a === "addrow") data.push(G.cols.map(c => c.t === "op" ? "<=" : ""));
    else if (a === "delrow") { data.splice(+b.dataset.r, 1); if (!data.length) data.push([]); }
    else if (a === "addcol") { const at = G.cols.length - (G.nTail || 0); data.forEach(r => r.splice(at, 0, "")); }
    else if (a === "delcol") { const at = G.cols.length - (G.nTail || 0) - 1; if (at >= (G.nHead || 0) + 1) data.forEach(r => r.splice(at, 1)); }
    else if (a === "raw") { ta.hidden = !ta.hidden; ta.dataset.raw = ta.hidden ? "" : "1"; draw(); return; }
    draw(); sync(); });
  ta.addEventListener("change", () => { data = rows(ta.value).map(r => r.slice()); if (!data.length) data = [[]]; draw(); });
  draw();
}
function gridRefresh(cid){ document.querySelectorAll("textarea[data-c='" + cid + "']").forEach(gridInit); }
document.addEventListener("change", e => { const el = e.target; if (!el.dataset || !el.dataset.c || !el.dataset.k || el.tagName === "TEXTAREA") return; const cid = el.dataset.c; if (Object.keys(GRID).some(key => key.startsWith(cid + ".") && Object.values(GRID[key]).includes(el.dataset.k))) gridRefresh(cid); });
// Los campos de nombres van antes que las tablas que rotulan.
[["transporte", ["on", "dn"]], ["asignacion", ["tipo", "rn", "cn"]], ["decisiones", ["es"]], ["programacion-lineal", ["tipo", "vars"]], ["factores", ["alt"]], ["raci", ["roles"]]].forEach(([cid, keys]) => { const c = C[cid]; if (!c) return; const first = keys.map(k => c.f.find(f => f.k === k)).filter(Boolean); c.f = first.concat(c.f.filter(f => !keys.includes(f.k))); });
