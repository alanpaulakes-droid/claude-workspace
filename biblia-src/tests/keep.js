const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.route(/cdnjs/, r => r.abort());
await p.goto('file://' + __dirname + '/testx.html'); await p.waitForTimeout(400);
const ids = await p.evaluate(() => __X.PAGES.filter(x => __X.t8Applies(x.id)).map(x => x.id)); const bad = [];
const grab = () => p.evaluate(() => { const a = document.getElementById('app').cloneNode(true); a.querySelectorAll('.t8-nav,.t8-h,.t8-pend,.t8-refs,.bcrumb,.xlinks,.pidx,.favb,.retbar').forEach(x => x.remove()); a.querySelectorAll('#guia > p.hint').forEach(x => x.remove());
  const sums = [...a.querySelectorAll('details > summary')].map(s => s.textContent.trim()).sort(); return { sums, len:a.textContent.replace(/\s+/g, '').length, tab:a.querySelectorAll('table').length, fig:a.querySelectorAll('figure,svg').length, mb:a.querySelectorAll('.mblk,.mx').length }; });
for (const id of ids) {
  await p.evaluate(id => { window.__noT8 = true; location.hash = id; }, id); await p.waitForTimeout(60); await p.evaluate(() => { window.__noT8 = true; }); 
  await p.evaluate(id => { location.hash = 'inicio'; }, id); await p.waitForTimeout(30); await p.evaluate(id => { location.hash = id; }, id); await p.waitForTimeout(80); const A = await grab();
  await p.evaluate(() => { window.__noT8 = false; location.hash = 'inicio'; }); await p.waitForTimeout(30); await p.evaluate(id => { location.hash = id; }, id); await p.waitForTimeout(80); const B = await grab();
  const missing = A.sums.filter(s => !B.sums.includes(s)); const d = A.len - B.len;
  if (missing.length || Math.abs(d) > 40 || A.tab !== B.tab || A.fig > B.fig || A.mb !== B.mb) bad.push(id + ' miss=' + JSON.stringify(missing).slice(0,120) + ' dlen=' + d + ' tab ' + A.tab + '/' + B.tab + ' fig ' + A.fig + '/' + B.fig + ' mb ' + A.mb + '/' + B.mb); }
console.log('checked', ids.length, 'bad', bad.length); bad.slice(0, 20).forEach(x => console.log(x)); await b.close(); })();
