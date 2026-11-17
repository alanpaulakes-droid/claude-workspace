const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.route(/cdnjs/, r => r.abort());
await p.goto('file://' + __dirname + '/testx.html'); await p.waitForTimeout(500);
const r = await p.evaluate(() => {
  const out = { audit:[], fuzz:[] };
  const run = (id, v) => { const c = __X.C[id]; let h, err = null; try { h = c.c(v); } catch (e) { err = e.message; } return { h, err }; };
  const bad = s => /\bNaN\b|Infinity|undefined|\[object|\bnull\b/.test(String(s).replace(/<[^>]+>/g, " "));
  for (const id of Object.keys(__X.C)) { const c = __X.C[id]; const v = {}; c.f.forEach(f => v[f.k] = f.d);
    const { h, err } = run(id, v); const d = document.createElement("div"); d.innerHTML = h || "";
    out.audit.push([id, err ? "ERR:" + err : "", d.querySelectorAll(".step").length, d.querySelectorAll(".step .mblk").length, d.querySelectorAll(".mblk.s").length, d.querySelectorAll(".note").length, d.querySelectorAll(".kpi").length, d.querySelectorAll(".kpi .v small").length, bad(h) ? "BADTXT" : ""]);
    for (const f of c.f) { if (!["num","list","mat"].includes(f.t)) continue;
      for (const val of ["", "0", "-5", "abc"]) { const v2 = Object.assign({}, v, { [f.k]: val }); const x = run(id, v2);
        const txt = String(x.h || "").replace(/<[^>]+>/g, " ");
        if (x.err === null && bad(x.h)) out.fuzz.push([id, f.k, JSON.stringify(val), "texto inválido: " + (txt.match(/.{0,40}(\bNaN\b|Infinity|undefined|\bnull\b).{0,20}/) || [""])[0]]); } } }
  return out; });
const fs = require('fs'); fs.writeFileSync('aud3.json', JSON.stringify(r));
console.log('calcs', r.audit.length); r.audit.forEach(a => console.log(a.join(' | '))); console.log('FUZZ', r.fuzz.length); r.fuzz.slice(0, 60).forEach(f => console.log(f.join(' | ')));
await b.close(); })();
