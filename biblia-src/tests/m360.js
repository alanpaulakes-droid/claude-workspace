const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport:{ width:360, height:740 } });
const errs=[]; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
await p.goto('file://' + __dirname + '/testx.html'); await p.waitForTimeout(400);
const ids = await p.evaluate(() => __X.PAGES.map(x => x.id)); const bad = []; let t0=Date.now(), slow=[];
for (const id of ids) { const s=Date.now(); await p.evaluate(id => { location.hash = id; }, id); await p.waitForTimeout(120);
  const w = await p.evaluate(() => { document.querySelectorAll('#app details').forEach(d=>d.open=true); return [document.documentElement.scrollWidth, document.documentElement.clientWidth, [...document.querySelectorAll('#app *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>362 && getComputedStyle(e).position!=='fixed' && !e.closest('.tbl-wrap,.sv,.sw-scroll,.sw-tbl,.gd-wrap,.xl-wrap,.malla,pre,.mblk,.f,.canvas-wrap,[style*="overflow"]')}).slice(0,2).map(e=>e.tagName+'.'+e.className)]; });
  if (w[0] > w[1] + 1) bad.push(id + " " + w[0] + " " + JSON.stringify(w[2])); const dt=Date.now()-s; if(dt>600) slow.push(id+":"+dt); }
console.log("pages", ids.length, "overflow", bad.length); bad.forEach(x=>console.log(x)); console.log("slow", slow.join(" ")); console.log("errs", [...new Set(errs)].slice(0,10)); await b.close(); })();
