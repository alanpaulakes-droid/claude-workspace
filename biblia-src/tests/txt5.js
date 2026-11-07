const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport:{ width:1200, height:900 } }); await p.route(/cdnjs|fonts/, r => r.abort());
await p.goto('file://' + __dirname + '/testx.html'); await p.waitForTimeout(400);
const ids = await p.evaluate(() => __X.PAGES.map(x => x.id)); const out = {};
for (const id of ids) { await p.evaluate(id => { location.hash = id; }, id); await p.waitForTimeout(90);
  out[id] = await p.evaluate(() => { const a = document.getElementById('app'); a.querySelectorAll('details').forEach(d => d.open = true); const c = a.cloneNode(true); c.querySelectorAll('pre, code, .mblk, .mx, svg, input, textarea, select, .tx').forEach(x => x.remove()); return c.innerText; }); }
fs.writeFileSync('alltext.json', JSON.stringify(out)); console.log(Object.keys(out).length, Object.values(out).reduce((s, t) => s + t.length, 0)); await b.close(); })();
