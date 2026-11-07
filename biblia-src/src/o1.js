/* ============ OFIMÁTICA: MOTOR DE PLANILLA (tipo Excel) ============ */
const XL = (() => {
  class XErr { constructor(c){ this.c = c; } toString(){ return this.c; } }
  const E = { div:new XErr("#¡DIV/0!"), na:new XErr("#N/A"), val:new XErr("#¡VALOR!"), name:new XErr("#¿NOMBRE?"), ref:new XErr("#¡REF!"), num:new XErr("#¡NUM!"), circ:new XErr("#¡CIRC!"), spill:new XErr("#¡DESBORDAMIENTO!") };
  const isErr = v => v instanceof XErr;
  const colN = s => [...s.toUpperCase()].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
  const colL = n => { let s = ""; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };
  const parseRef = r => { const m = /^\$?([A-Za-z]{1,3})\$?(\d+)$/.exec(r); return m ? { c:colN(m[1]), r:+m[2] } : null; };
  const refStr = (r, c) => colL(c) + r;

  /* ---- Tokenizador ---- */
  function tokenize(src){
    const semi = src.includes(";"), T = []; let i = 0;
    const NUM = semi ? /^\d+(?:[.,]\d+)?(?:[eE][+-]?\d+)?/ : /^\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, REF = /^\$?[A-Za-z]{1,3}\$?\d+(?::\$?[A-Za-z]{1,3}\$?\d+)?/, NAME = /^[A-Za-zÁÉÍÓÚÑáéíóúñ_][A-Za-z0-9ÁÉÍÓÚÑáéíóúñ_.]*/;
    while (i < src.length) {
      const ch = src[i], rest = src.slice(i);
      if (/\s/.test(ch)) { i++; continue; }
      if (ch === '"') { let j = i + 1, s = ""; for (;;) { if (j >= src.length) throw E.val; if (src[j] === '"') { if (src[j + 1] === '"') { s += '"'; j += 2; continue; } break; } s += src[j++]; } T.push({ k:"str", v:s }); i = j + 1; continue; }
      let m;
      if ((m = REF.exec(rest)) && src[i + m[0].length] !== "(" && !/[A-Za-z_.]/.test(src[i + m[0].length] || "")) { T.push({ k:"ref", v:m[0].toUpperCase() }); i += m[0].length; continue; }
      if ((m = NUM.exec(rest))) { T.push({ k:"num", v:parseFloat(m[0].replace(",", ".")) }); i += m[0].length; continue; }
      if ((m = NAME.exec(rest))) { const nm = m[0].toUpperCase(); i += m[0].length; if (src[i] === "(") { T.push({ k:"fn", v:nm }); i++; } else if (["VERDADERO", "TRUE"].includes(nm)) T.push({ k:"bool", v:true }); else if (["FALSO", "FALSE"].includes(nm)) T.push({ k:"bool", v:false }); else T.push({ k:"name", v:nm }); continue; }
      const two = src.substr(i, 2);
      if (["<=", ">=", "<>"].includes(two)) { T.push({ k:"op", v:two }); i += 2; continue; }
      if ("+-*/^&=<>%".includes(ch)) { T.push({ k:"op", v:ch }); i++; continue; }
      if (ch === "(") { T.push({ k:"(" }); i++; continue; }
      if (ch === ")") { T.push({ k:")" }); i++; continue; }
      if (ch === ";" || (!semi && ch === ",")) { T.push({ k:"sep" }); i++; continue; }
      throw E.val;
    }
    return T;
  }
  /* ---- Analizador sintáctico ---- */
  function parse(src){
    const T = tokenize(src); let p = 0;
    const pk = () => T[p], nx = () => T[p++], isOp = (...o) => pk() && pk().k === "op" && o.includes(pk().v);
    function cmp(){ let a = cat(); while (isOp("=", "<>", "<", ">", "<=", ">=")) { const op = nx().v; a = { t:"bin", op, a, b:cat() }; } return a; }
    function cat(){ let a = add(); while (isOp("&")) { nx(); a = { t:"bin", op:"&", a, b:add() }; } return a; }
    function add(){ let a = mul(); while (isOp("+", "-")) { const op = nx().v; a = { t:"bin", op, a, b:mul() }; } return a; }
    function mul(){ let a = pw(); while (isOp("*", "/")) { const op = nx().v; a = { t:"bin", op, a, b:pw() }; } return a; }
    function pw(){ let a = un(); while (isOp("^")) { nx(); a = { t:"bin", op:"^", a, b:un() }; } return a; }
    function un(){ if (isOp("-")) { nx(); return { t:"neg", a:un() }; } if (isOp("+")) { nx(); return un(); } return post(); }
    function post(){ let a = prim(); while (isOp("%")) { nx(); a = { t:"pct", a }; } return a; }
    function prim(){ const t = nx(); if (!t) throw E.val;
      if (t.k === "num") return { t:"num", v:t.v }; if (t.k === "str") return { t:"str", v:t.v }; if (t.k === "bool") return { t:"bool", v:t.v };
      if (t.k === "ref") { if (t.v.includes(":")) { const [a, b] = t.v.split(":").map(parseRef); return { t:"rng", r1:Math.min(a.r, b.r), c1:Math.min(a.c, b.c), r2:Math.max(a.r, b.r), c2:Math.max(a.c, b.c) }; } const a = parseRef(t.v); return { t:"ref", r:a.r, c:a.c }; }
      if (t.k === "name") return { t:"err", v:E.name };
      if (t.k === "(") { const e = cmp(); if (!pk() || pk().k !== ")") throw E.val; nx(); return e; }
      if (t.k === "fn") { const args = []; if (pk() && pk().k === ")") { nx(); return { t:"fn", n:t.v, args }; }
        for (;;) { if (pk() && (pk().k === "sep" || pk().k === ")")) args.push({ t:"blank" }); else args.push(cmp()); const s = nx(); if (!s) throw E.val; if (s.k === ")") break; if (s.k !== "sep") throw E.val; }
        return { t:"fn", n:t.v, args }; }
      throw E.val; }
    const e = cmp(); if (p < T.length) throw E.val; return e;
  }
  /* ---- Coerción ---- */
  const toNum = v => { if (isErr(v)) throw v; if (v == null || v === "") return 0; if (typeof v === "number") return v; if (typeof v === "boolean") return v ? 1 : 0; const s = String(v).trim().replace(",", "."); if (s !== "" && !isNaN(+s)) return +s; throw E.val; };
  const toStr = v => { if (isErr(v)) throw v; if (v == null) return ""; if (typeof v === "boolean") return v ? "VERDADERO" : "FALSO"; if (typeof v === "number") return fmtNum(v, true); return String(v); };
  const toBool = v => { if (isErr(v)) throw v; if (typeof v === "boolean") return v; if (typeof v === "number") return v !== 0; if (v == null || v === "") return false; const s = String(v).toUpperCase(); if (s === "VERDADERO" || s === "TRUE") return true; if (s === "FALSO" || s === "FALSE") return false; throw E.val; };
  const isRng = v => v && v.rng;
  const flat = v => isRng(v) ? v.rows.flat() : [v];
  const scalar = v => isRng(v) ? (v.rows.length === 1 && v.rows[0].length === 1 ? v.rows[0][0] : E.val) : v;
  function fmtNum(v, raw){ if (!isFinite(v)) return E.num.c; if (raw) return String(+v.toPrecision(15)).replace(".", ","); const a = Math.abs(v), d = Number.isInteger(v) ? 0 : a >= 1000 ? 2 : a >= 1 ? 2 : 4; let s = v.toFixed(d); if (d) s = s.replace(/0+$/, "").replace(/\.$/, ""); const [ip, dp] = s.split("."); return ip.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (dp ? "," + dp : ""); }
  /* ---- Criterios (SUMAR.SI, CONTAR.SI…) ---- */
  function crit(c){
    if (typeof c === "number" || typeof c === "boolean") return v => (typeof v === "number" || typeof v === "boolean") && v === c;
    const s = String(c ?? ""), m = /^(<=|>=|<>|<|>|=)?(.*)$/.exec(s), op = m[1] || "=", rhs = m[2], n = rhs.trim() !== "" && !isNaN(+rhs.replace(",", ".")) ? +rhs.replace(",", ".") : null;
    if (n != null) return v => { if (typeof v !== "number") return op === "<>"; return op === "=" ? v === n : op === "<>" ? v !== n : op === "<" ? v < n : op === ">" ? v > n : op === "<=" ? v <= n : v >= n; };
    const re = new RegExp("^" + rhs.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "i");
    if (op === "=") return v => rhs === "" ? (v == null || v === "") : re.test(toStr(v));
    if (op === "<>") return v => rhs === "" ? !(v == null || v === "") : !re.test(toStr(v));
    return v => { const a = toStr(v).toLowerCase(), b = rhs.toLowerCase(); return op === "<" ? a < b : op === ">" ? a > b : op === "<=" ? a <= b : a >= b; };
  }
  /* ---- Fechas (número de serie como en Excel) ---- */
  const D0 = Date.UTC(1899, 11, 30), serial = (y, m, d) => Math.round((Date.UTC(y, m - 1, d) - D0) / 864e5), fromSerial = s => new Date(D0 + Math.floor(s) * 864e5);
  /* ---- Funciones ---- */
  const nums = (args, ev, strict) => { const out = []; args.forEach(a => { const v = ev(a); if (isRng(v)) v.rows.flat().forEach(x => { if (isErr(x)) throw x; if (typeof x === "number") out.push(x); }); else out.push(toNum(v)); }); return out; };
  const rng = (a, ev) => { const v = ev(a); return isRng(v) ? v : { rng:true, rows:[[v]] }; };
  const npvf = (r, fl) => fl.reduce((s, f, t) => s + f / Math.pow(1 + r, t + 1), 0);
  const F = {
    "SUMA": (a, ev) => nums(a, ev).reduce((s, x) => s + x, 0),
    "PROMEDIO": (a, ev) => { const n = nums(a, ev); if (!n.length) throw E.div; return n.reduce((s, x) => s + x, 0) / n.length; },
    "MAX": (a, ev) => { const n = nums(a, ev); return n.length ? Math.max(...n) : 0; },
    "MIN": (a, ev) => { const n = nums(a, ev); return n.length ? Math.min(...n) : 0; },
    "CONTAR": (a, ev) => a.reduce((s, x) => { const v = ev(x); return s + flat(v).filter(y => typeof y === "number").length; }, 0),
    "CONTARA": (a, ev) => a.reduce((s, x) => { const v = ev(x); return s + flat(v).filter(y => y != null && y !== "").length; }, 0),
    "CONTAR.BLANCO": (a, ev) => flat(ev(a[0])).filter(y => y == null || y === "").length,
    "PRODUCTO": (a, ev) => nums(a, ev).reduce((s, x) => s * x, 1),
    "MEDIANA": (a, ev) => { const n = nums(a, ev).sort((x, y) => x - y); if (!n.length) throw E.num; const h = Math.floor(n.length / 2); return n.length % 2 ? n[h] : (n[h - 1] + n[h]) / 2; },
    "DESVEST.M": (a, ev) => { const n = nums(a, ev); if (n.length < 2) throw E.div; const m = n.reduce((s, x) => s + x, 0) / n.length; return Math.sqrt(n.reduce((s, x) => s + (x - m) ** 2, 0) / (n.length - 1)); },
    "DESVEST.P": (a, ev) => { const n = nums(a, ev); if (!n.length) throw E.div; const m = n.reduce((s, x) => s + x, 0) / n.length; return Math.sqrt(n.reduce((s, x) => s + (x - m) ** 2, 0) / n.length); },
    "K.ESIMO.MAYOR": (a, ev) => { const n = nums([a[0]], ev).sort((x, y) => y - x), k = toNum(scalar(ev(a[1]))); if (k < 1 || k > n.length) throw E.num; return n[k - 1]; },
    "K.ESIMO.MENOR": (a, ev) => { const n = nums([a[0]], ev).sort((x, y) => x - y), k = toNum(scalar(ev(a[1]))); if (k < 1 || k > n.length) throw E.num; return n[k - 1]; },
    "ABS": (a, ev) => Math.abs(toNum(scalar(ev(a[0])))),
    "RAIZ": (a, ev) => { const x = toNum(scalar(ev(a[0]))); if (x < 0) throw E.num; return Math.sqrt(x); },
    "POTENCIA": (a, ev) => Math.pow(toNum(scalar(ev(a[0]))), toNum(scalar(ev(a[1])))),
    "PI": () => Math.PI,
    "ENTERO": (a, ev) => Math.floor(toNum(scalar(ev(a[0])))),
    "RESIDUO": (a, ev) => { const x = toNum(scalar(ev(a[0]))), d = toNum(scalar(ev(a[1]))); if (d === 0) throw E.div; return x - d * Math.floor(x / d); },
    "REDONDEAR": (a, ev) => { const x = toNum(scalar(ev(a[0]))), d = a[1] ? toNum(scalar(ev(a[1]))) : 0, f = Math.pow(10, d); return Math.sign(x) * Math.round(Math.abs(x) * f + 1e-9) / f; },
    "REDONDEAR.MAS": (a, ev) => { const x = toNum(scalar(ev(a[0]))), f = Math.pow(10, a[1] ? toNum(scalar(ev(a[1]))) : 0); return Math.sign(x) * Math.ceil(Math.abs(x) * f - 1e-9) / f; },
    "REDONDEAR.MENOS": (a, ev) => { const x = toNum(scalar(ev(a[0]))), f = Math.pow(10, a[1] ? toNum(scalar(ev(a[1]))) : 0); return Math.sign(x) * Math.floor(Math.abs(x) * f + 1e-9) / f; },
    "SUMAPRODUCTO": (a, ev) => { const R = a.map(x => rng(x, ev).rows.flat()); const n = R[0].length; if (R.some(r => r.length !== n)) throw E.val; let s = 0; for (let i = 0; i < n; i++) s += R.reduce((p, r) => p * (typeof r[i] === "number" ? r[i] : 0), 1); return s; },
    "SI": (a, ev) => toBool(scalar(ev(a[0]))) ? (a[1] && a[1].t !== "blank" ? ev(a[1]) : true) : (a[2] && a[2].t !== "blank" ? ev(a[2]) : false),
    "SI.CONJUNTO": (a, ev) => { for (let i = 0; i + 1 < a.length; i += 2) if (toBool(scalar(ev(a[i])))) return ev(a[i + 1]); throw E.na; },
    "SI.ERROR": (a, ev) => { try { const v = scalar(ev(a[0])); if (isErr(v)) throw v; return v; } catch (e) { if (isErr(e)) return ev(a[1]); throw e; } },
    "Y": (a, ev) => a.every(x => flat(ev(x)).every(v => v == null || v === "" ? true : toBool(v))),
    "O": (a, ev) => a.some(x => flat(ev(x)).some(v => v == null || v === "" ? false : toBool(v))),
    "NO": (a, ev) => !toBool(scalar(ev(a[0]))),
    "ESBLANCO": (a, ev) => { const v = scalar(ev(a[0])); return v == null || v === ""; },
    "ESNUMERO": (a, ev) => typeof scalar(ev(a[0])) === "number",
    "ESERROR": (a, ev) => { try { return isErr(scalar(ev(a[0]))); } catch (e) { return isErr(e); } },
    "SUMAR.SI": (a, ev) => { const r = rng(a[0], ev).rows.flat(), c = crit(scalar(ev(a[1]))), s = a[2] ? rng(a[2], ev).rows.flat() : r; return r.reduce((t, v, i) => t + (c(v) && typeof s[i] === "number" ? s[i] : 0), 0); },
    "CONTAR.SI": (a, ev) => { const r = rng(a[0], ev).rows.flat(), c = crit(scalar(ev(a[1]))); return r.filter(c).length; },
    "PROMEDIO.SI": (a, ev) => { const r = rng(a[0], ev).rows.flat(), c = crit(scalar(ev(a[1]))), s = a[2] ? rng(a[2], ev).rows.flat() : r, v = r.map((x, i) => c(x) && typeof s[i] === "number" ? s[i] : null).filter(x => x != null); if (!v.length) throw E.div; return v.reduce((p, x) => p + x, 0) / v.length; },
    "SUMAR.SI.CONJUNTO": (a, ev) => { const s = rng(a[0], ev).rows.flat(); const ok = s.map(() => true); for (let i = 1; i + 1 < a.length; i += 2) { const r = rng(a[i], ev).rows.flat(), c = crit(scalar(ev(a[i + 1]))); if (r.length !== s.length) throw E.val; r.forEach((v, j) => { if (!c(v)) ok[j] = false; }); } return s.reduce((t, v, j) => t + (ok[j] && typeof v === "number" ? v : 0), 0); },
    "CONTAR.SI.CONJUNTO": (a, ev) => { let ok = null; for (let i = 0; i + 1 < a.length; i += 2) { const r = rng(a[i], ev).rows.flat(), c = crit(scalar(ev(a[i + 1]))); if (!ok) ok = r.map(() => true); if (r.length !== ok.length) throw E.val; r.forEach((v, j) => { if (!c(v)) ok[j] = false; }); } return ok.filter(Boolean).length; },
    "PROMEDIO.SI.CONJUNTO": (a, ev) => { const s = rng(a[0], ev).rows.flat(); const ok = s.map(() => true); for (let i = 1; i + 1 < a.length; i += 2) { const r = rng(a[i], ev).rows.flat(), c = crit(scalar(ev(a[i + 1]))); r.forEach((v, j) => { if (!c(v)) ok[j] = false; }); } const v = s.filter((x, j) => ok[j] && typeof x === "number"); if (!v.length) throw E.div; return v.reduce((p, x) => p + x, 0) / v.length; },
    "MAX.SI.CONJUNTO": (a, ev) => { const s = rng(a[0], ev).rows.flat(); const ok = s.map(() => true); for (let i = 1; i + 1 < a.length; i += 2) { const r = rng(a[i], ev).rows.flat(), c = crit(scalar(ev(a[i + 1]))); r.forEach((v, j) => { if (!c(v)) ok[j] = false; }); } const v = s.filter((x, j) => ok[j] && typeof x === "number"); return v.length ? Math.max(...v) : 0; },
    "MIN.SI.CONJUNTO": (a, ev) => { const s = rng(a[0], ev).rows.flat(); const ok = s.map(() => true); for (let i = 1; i + 1 < a.length; i += 2) { const r = rng(a[i], ev).rows.flat(), c = crit(scalar(ev(a[i + 1]))); r.forEach((v, j) => { if (!c(v)) ok[j] = false; }); } const v = s.filter((x, j) => ok[j] && typeof x === "number"); return v.length ? Math.min(...v) : 0; },
    "BUSCARV": (a, ev) => { const k = scalar(ev(a[0])), t = rng(a[1], ev).rows, col = toNum(scalar(ev(a[2]))), apr = a[3] && a[3].t !== "blank" ? toBool(scalar(ev(a[3]))) : true; if (col < 1 || col > t[0].length) throw E.ref;
      if (!apr) { const r = t.find(r => eqv(r[0], k)); if (!r) throw E.na; return r[col - 1]; }
      let best = null; for (const r of t) { if (cmpv(r[0], k) <= 0) best = r; else break; } if (!best) throw E.na; return best[col - 1]; },
    "BUSCARX": (a, ev) => { const k = scalar(ev(a[0])), s = rng(a[1], ev), d = rng(a[2], ev), sf = s.rows.flat(), i = sf.findIndex(v => eqv(v, k)); if (i < 0) { if (a[3] && a[3].t !== "blank") return ev(a[3]); throw E.na; } if (s.rows.length === 1 && d.rows.length > 1 && d.rows[0].length === 1) return d.rows[i][0]; return d.rows.length === 1 ? d.rows[0][i] : (d.rows[i].length === 1 ? d.rows[i][0] : { rng:true, rows:[d.rows[i]] }); },
    "INDICE": (a, ev) => { const t = rng(a[0], ev).rows; let r = toNum(scalar(ev(a[1]))), c = a[2] ? toNum(scalar(ev(a[2]))) : 1; if (t.length === 1 && !a[2]) { c = r; r = 1; } if (r < 1 || c < 1 || r > t.length || c > t[0].length) throw E.ref; return t[r - 1][c - 1]; },
    "COINCIDIR": (a, ev) => { const k = scalar(ev(a[0])), r = rng(a[1], ev).rows.flat(), tp = a[2] ? toNum(scalar(ev(a[2]))) : 1; if (tp === 0) { const i = r.findIndex(v => eqv(v, k)); if (i < 0) throw E.na; return i + 1; } let b = -1; r.forEach((v, i) => { if (tp > 0 ? cmpv(v, k) <= 0 : cmpv(v, k) >= 0) b = i; }); if (b < 0) throw E.na; return b + 1; },
    "CONCAT": (a, ev) => a.map(x => flat(ev(x)).map(toStr).join("")).join(""),
    "CONCATENAR": (a, ev) => a.map(x => toStr(scalar(ev(x)))).join(""),
    "IZQUIERDA": (a, ev) => toStr(scalar(ev(a[0]))).slice(0, a[1] ? toNum(scalar(ev(a[1]))) : 1),
    "DERECHA": (a, ev) => { const s = toStr(scalar(ev(a[0]))), n = a[1] ? toNum(scalar(ev(a[1]))) : 1; return n ? s.slice(-n) : ""; },
    "EXTRAE": (a, ev) => toStr(scalar(ev(a[0]))).substr(toNum(scalar(ev(a[1]))) - 1, toNum(scalar(ev(a[2])))),
    "LARGO": (a, ev) => toStr(scalar(ev(a[0]))).length,
    "MAYUSC": (a, ev) => toStr(scalar(ev(a[0]))).toUpperCase(),
    "MINUSC": (a, ev) => toStr(scalar(ev(a[0]))).toLowerCase(),
    "NOMPROPIO": (a, ev) => toStr(scalar(ev(a[0]))).toLowerCase().replace(/(^|[^a-záéíóúñ])([a-záéíóúñ])/g, (m, p, c) => p + c.toUpperCase()),
    "ESPACIOS": (a, ev) => toStr(scalar(ev(a[0]))).trim().replace(/ +/g, " "),
    "SUSTITUIR": (a, ev) => toStr(scalar(ev(a[0]))).split(toStr(scalar(ev(a[1])))).join(toStr(scalar(ev(a[2])))),
    "ENCONTRAR": (a, ev) => { const i = toStr(scalar(ev(a[1]))).indexOf(toStr(scalar(ev(a[0]))), (a[2] ? toNum(scalar(ev(a[2]))) : 1) - 1); if (i < 0) throw E.val; return i + 1; },
    "HALLAR": (a, ev) => { const i = toStr(scalar(ev(a[1]))).toLowerCase().indexOf(toStr(scalar(ev(a[0]))).toLowerCase(), (a[2] ? toNum(scalar(ev(a[2]))) : 1) - 1); if (i < 0) throw E.val; return i + 1; },
    "VALOR": (a, ev) => toNum(scalar(ev(a[0]))),
    "FECHA": (a, ev) => serial(toNum(scalar(ev(a[0]))), toNum(scalar(ev(a[1]))), toNum(scalar(ev(a[2])))),
    "DIA": (a, ev) => fromSerial(toNum(scalar(ev(a[0])))).getUTCDate(),
    "MES": (a, ev) => fromSerial(toNum(scalar(ev(a[0])))).getUTCMonth() + 1,
    "AÑO": (a, ev) => fromSerial(toNum(scalar(ev(a[0])))).getUTCFullYear(),
    "DIASEM": (a, ev) => { const d = fromSerial(toNum(scalar(ev(a[0])))).getUTCDay(), t = a[1] ? toNum(scalar(ev(a[1]))) : 1; return t === 2 ? (d === 0 ? 7 : d) : d + 1; },
    "FIN.MES": (a, ev) => { const d = fromSerial(toNum(scalar(ev(a[0])))), m = toNum(scalar(ev(a[1]))); return serial(d.getUTCFullYear(), d.getUTCMonth() + 2 + m, 0); },
    "DIAS.LAB": (a, ev) => { let s = Math.floor(toNum(scalar(ev(a[0])))), e = Math.floor(toNum(scalar(ev(a[1])))), sg = 1; if (e < s) { [s, e] = [e, s]; sg = -1; } const hol = a[2] ? nums([a[2]], ev) : []; let n = 0; for (let x = s; x <= e; x++) { const d = fromSerial(x).getUTCDay(); if (d !== 0 && d !== 6 && !hol.includes(x)) n++; } return n * sg; },
    "VNA": (a, ev) => { const r = toNum(scalar(ev(a[0]))); return npvf(r, nums(a.slice(1), ev)); },
    "TIR": (a, ev) => { const fl = nums([a[0]], ev); let lo = -0.99, hi = 10; const f = r => fl.reduce((s, x, t) => s + x / Math.pow(1 + r, t), 0); if (f(lo) * f(hi) > 0) throw E.num; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; },
    "PAGO": (a, ev) => { const r = toNum(scalar(ev(a[0]))), n = toNum(scalar(ev(a[1]))), pv = toNum(scalar(ev(a[2]))), fv = a[3] ? toNum(scalar(ev(a[3]))) : 0, tp = a[4] ? toNum(scalar(ev(a[4]))) : 0; if (r === 0) return -(pv + fv) / n; const q = Math.pow(1 + r, n); return -(r * (pv * q + fv)) / ((1 + r * tp) * (q - 1)); },
    "VF": (a, ev) => { const r = toNum(scalar(ev(a[0]))), n = toNum(scalar(ev(a[1]))), pm = toNum(scalar(ev(a[2]))), pv = a[3] ? toNum(scalar(ev(a[3]))) : 0, tp = a[4] ? toNum(scalar(ev(a[4]))) : 0; if (r === 0) return -(pv + pm * n); const q = Math.pow(1 + r, n); return -(pv * q + pm * (1 + r * tp) * (q - 1) / r); },
    "VA": (a, ev) => { const r = toNum(scalar(ev(a[0]))), n = toNum(scalar(ev(a[1]))), pm = toNum(scalar(ev(a[2]))), fv = a[3] ? toNum(scalar(ev(a[3]))) : 0, tp = a[4] ? toNum(scalar(ev(a[4]))) : 0; if (r === 0) return -(fv + pm * n); const q = Math.pow(1 + r, n); return -(fv + pm * (1 + r * tp) * (q - 1) / r) / q; },
    "PENDIENTE": (a, ev) => lr(nums([a[0]], ev), nums([a[1]], ev)).b,
    "INTERSECCION.EJE": (a, ev) => lr(nums([a[0]], ev), nums([a[1]], ev)).a,
    "PRONOSTICO.LINEAL": (a, ev) => { const x = toNum(scalar(ev(a[0]))), m = lr(nums([a[1]], ev), nums([a[2]], ev)); return m.a + m.b * x; },
    "COEF.DE.CORREL": (a, ev) => lr(nums([a[1]], ev), nums([a[0]], ev)).r
  };
  function lr(y, x){ const n = x.length; if (n !== y.length || n < 2) throw E.div; const mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n; let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; } if (!sxx) throw E.div; const b = sxy / sxx; return { b, a:my - b * mx, r:sxy / Math.sqrt(sxx * syy) }; }
  const eqv = (a, b) => { if (typeof a === "string" && typeof b === "string") return a.toLowerCase() === b.toLowerCase(); if (typeof a === "number" && typeof b === "string" && b.trim() !== "" && !isNaN(+b)) return a === +b; return a === b; };
  const cmpv = (a, b) => { if (typeof a === "number" && typeof b === "number") return a - b; return toStr(a).toLowerCase() < toStr(b).toLowerCase() ? -1 : toStr(a).toLowerCase() > toStr(b).toLowerCase() ? 1 : 0; };
  const AL = { SUM:"SUMA", AVERAGE:"PROMEDIO", COUNT:"CONTAR", COUNTA:"CONTARA", COUNTBLANK:"CONTAR.BLANCO", PRODUCT:"PRODUCTO", MEDIAN:"MEDIANA", "STDEV.S":"DESVEST.M", "STDEV.P":"DESVEST.P", STDEV:"DESVEST.M", LARGE:"K.ESIMO.MAYOR", SMALL:"K.ESIMO.MENOR", SQRT:"RAIZ", POWER:"POTENCIA", INT:"ENTERO", MOD:"RESIDUO", ROUND:"REDONDEAR", ROUNDUP:"REDONDEAR.MAS", ROUNDDOWN:"REDONDEAR.MENOS", SUMPRODUCT:"SUMAPRODUCTO", IF:"SI", IFS:"SI.CONJUNTO", IFERROR:"SI.ERROR", AND:"Y", OR:"O", NOT:"NO", ISBLANK:"ESBLANCO", ISNUMBER:"ESNUMERO", ISERROR:"ESERROR", SUMIF:"SUMAR.SI", COUNTIF:"CONTAR.SI", AVERAGEIF:"PROMEDIO.SI", SUMIFS:"SUMAR.SI.CONJUNTO", COUNTIFS:"CONTAR.SI.CONJUNTO", AVERAGEIFS:"PROMEDIO.SI.CONJUNTO", MAXIFS:"MAX.SI.CONJUNTO", MINIFS:"MIN.SI.CONJUNTO", VLOOKUP:"BUSCARV", XLOOKUP:"BUSCARX", INDEX:"INDICE", MATCH:"COINCIDIR", CONCATENATE:"CONCATENAR", LEFT:"IZQUIERDA", RIGHT:"DERECHA", MID:"EXTRAE", LEN:"LARGO", UPPER:"MAYUSC", LOWER:"MINUSC", PROPER:"NOMPROPIO", TRIM:"ESPACIOS", SUBSTITUTE:"SUSTITUIR", FIND:"ENCONTRAR", SEARCH:"HALLAR", VALUE:"VALOR", DATE:"FECHA", DAY:"DIA", "DÍA":"DIA", MONTH:"MES", YEAR:"AÑO", WEEKDAY:"DIASEM", EOMONTH:"FIN.MES", NETWORKDAYS:"DIAS.LAB", NPV:"VNA", IRR:"TIR", PMT:"PAGO", FV:"VF", PV:"VA", SLOPE:"PENDIENTE", INTERCEPT:"INTERSECCION.EJE", "INTERSECCIÓN.EJE":"INTERSECCION.EJE", "FORECAST.LINEAR":"PRONOSTICO.LINEAL", "PRONÓSTICO.LINEAL":"PRONOSTICO.LINEAL", CORREL:"COEF.DE.CORREL", "ÍNDICE":"INDICE", "SUMAR.SI.CONJ":"SUMAR.SI.CONJUNTO" };
  const fnOf = n => F[n] || F[AL[n]];
  /* ---- Evaluación de una hoja ---- */
  function Sheet(cells){ this.cells = Object.assign({}, cells || {}); this.cache = {}; this.busy = {}; }
  Sheet.prototype.raw = function(ref){ return this.cells[ref]; };
  Sheet.prototype.set = function(ref, v){ if (v == null || v === "") delete this.cells[ref]; else this.cells[ref] = v; this.cache = {}; };
  Sheet.prototype.get = function(r, c){
    const ref = refStr(r, c); if (ref in this.cache) return this.cache[ref];
    if (this.busy[ref]) return E.circ;
    const raw = this.cells[ref]; let v;
    if (raw == null || raw === "") v = null;
    else if (typeof raw === "number" || typeof raw === "boolean") v = raw;
    else if (String(raw)[0] === "=") { this.busy[ref] = true; v = this.evalF(String(raw).slice(1)); if (isRng(v)) v = v.rows.length === 1 && v.rows[0].length === 1 ? v.rows[0][0] : v.rows[0][0]; delete this.busy[ref]; }
    else { const s = String(raw).trim(); if (/^-?\d+([.,]\d+)?%$/.test(s)) v = parseFloat(s.replace(",", ".")) / 100; else if (/^-?\d+([.,]\d+)?$/.test(s)) v = parseFloat(s.replace(",", ".")); else if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) v = parseFloat(s.replace(/\./g, "").replace(",", ".")); else if (/^(VERDADERO|FALSO)$/i.test(s)) v = /^V/i.test(s); else v = s; }
    this.cache[ref] = v; return v;
  };
  Sheet.prototype.evalF = function(src){
    let ast; try { ast = parse(src); } catch (e) { return isErr(e) ? e : E.val; }
    const ev = n => {
      switch (n.t) {
        case "num": return n.v; case "str": return n.v; case "bool": return n.v; case "blank": return null; case "err": throw n.v;
        case "ref": { const v = this.get(n.r, n.c); if (isErr(v)) throw v; return v; }
        case "rng": { const rows = []; for (let r = n.r1; r <= n.r2; r++) { const row = []; for (let c = n.c1; c <= n.c2; c++) row.push(this.get(r, c)); rows.push(row); } return { rng:true, rows }; }
        case "neg": return -toNum(scalar(ev(n.a)));
        case "pct": return toNum(scalar(ev(n.a))) / 100;
        case "bin": { const a = scalar(ev(n.a)), b = scalar(ev(n.b)); if (isErr(a)) throw a; if (isErr(b)) throw b;
          if (n.op === "&") return toStr(a) + toStr(b);
          if (["=", "<>", "<", ">", "<=", ">="].includes(n.op)) { let d; if (typeof a === "number" && typeof b === "number") d = a - b; else if (typeof a === "boolean" || typeof b === "boolean") d = (a === b ? 0 : 1); else { const x = toStr(a).toLowerCase(), y = toStr(b).toLowerCase(); d = (a == null && b === "") || (b == null && a === "") ? 0 : x < y ? -1 : x > y ? 1 : 0; if (a == null && typeof b === "number") d = -b; if (b == null && typeof a === "number") d = a; } return n.op === "=" ? d === 0 : n.op === "<>" ? d !== 0 : n.op === "<" ? d < 0 : n.op === ">" ? d > 0 : n.op === "<=" ? d <= 0 : d >= 0; }
          const x = toNum(a), y = toNum(b);
          if (n.op === "+") return x + y; if (n.op === "-") return x - y; if (n.op === "*") return x * y;
          if (n.op === "/") { if (y === 0) throw E.div; return x / y; }
          if (n.op === "^") { const r = Math.pow(x, y); if (!isFinite(r)) throw E.num; return r; } }
        case "fn": { const f = fnOf(n.n); if (!f) throw E.name; return f(n.args, ev); }
      }
      throw E.val;
    };
    try { const v = ev(ast); return typeof v === "number" && !isFinite(v) ? E.num : v; } catch (e) { return isErr(e) ? e : E.val; }
  };
  /* Desplazar una fórmula al copiarla (respeta $) */
  function shift(f, dr, dc){
    return String(f).split('"').map((seg, i) => i % 2 ? seg : seg.replace(/(^|[^A-Za-z0-9_.])(\$?)([A-Za-z]{1,3})(\$?)(\d+)(?![\d(A-Za-z])/g, (m, pre, d1, col, d2, row) => { const c = d1 ? colN(col) : colN(col) + dc, r = d2 ? +row : +row + dr; if (c < 1 || r < 1) return pre + "#¡REF!"; return pre + d1 + colL(c) + d2 + r; })).join('"');
  }
  const show = (v, fmt) => {
    if (v == null) return ""; if (isErr(v)) return v.c; if (typeof v === "boolean") return v ? "VERDADERO" : "FALSO";
    if (typeof v === "number") { if (fmt === "%") return fmtNum(Math.round(v * 10000) / 100) + " %"; if (fmt === "$") return (v < 0 ? "−$ " : "$ ") + fmtNum(Math.round(Math.abs(v))); if (fmt === "d") { const d = fromSerial(v); return String(d.getUTCDate()).padStart(2, "0") + "-" + String(d.getUTCMonth() + 1).padStart(2, "0") + "-" + d.getUTCFullYear(); } if (fmt === "2") return fmtNum(Math.round(v * 100) / 100); return fmtNum(v); }
    return String(v);
  };
  const FN_LIST = Object.keys(F);
  return { Sheet, shift, show, colL, colN, parseRef, refStr, isErr, E, FN_LIST, AL, serial };
})();
