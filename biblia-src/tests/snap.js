const { chromium } = require('playwright'); const fs = require('fs');
const CASES = JSON.parse(fs.readFileSync(__dirname + '/cases3.json', 'utf8'));
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.route(/cdnjs/, r => r.abort());
await p.goto('file://' + __dirname + '/testx.html'); await p.waitForTimeout(500);
const out = await p.evaluate(CASES => { const o = {}; Object.keys(__X.C).forEach(id => { const c = __X.C[id]; const v = {}; c.f.forEach(f => v[f.k] = f.d); try { o[id + "#default"] = String(c.c(v)).replace(/<[^>]+>/g, " ").replace(/\s+/g, " "); } catch (e) { o[id + "#default"] = "ERR " + e.message; } });
  CASES.forEach(([id, ov], k) => { const c = __X.C[id]; const v = {}; c.f.forEach(f => v[f.k] = f.d); Object.assign(v, ov); try { o[id + "#" + k] = String(c.c(v)).replace(/<[^>]+>/g, " ").replace(/\s+/g, " "); } catch (e) { o[id + "#" + k] = "ERR " + e.message; } }); return o; }, CASES);
fs.writeFileSync(process.argv[2], JSON.stringify(out)); console.log(Object.keys(out).length); await b.close(); })();
