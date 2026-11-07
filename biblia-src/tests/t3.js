const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.route(/cdnjs/, r => r.abort()); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + __dirname + '/testx.html'); await p.waitForTimeout(400);
const R = await p.evaluate(() => __X.runTest3());
R.forEach(r => console.log((r.ok ? 'OK ' : 'FALLA ') + r.calc + ' | ' + r.inp + ' | ' + r.exp + ' | ' + r.got + (r.err ? ' | ' + r.err : '')));
console.log('total', R.length, 'ok', R.filter(r => r.ok).length, errs); await b.close(); })();
