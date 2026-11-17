const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); p.on('console', m => { if (m.type()==='error') errs.push('CONSOLE ' + m.text()); });
  await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await p.goto('file://' + process.cwd() + '/test.html');
  const ids = await p.evaluate(() => [...document.querySelectorAll('#side [data-go]')].map(b => b.dataset.go));
  const all = [...new Set(ids.concat(['herramientas','carrera','gestion','informes','aprender','reportes']))];
  for (const id of all) {
    await p.evaluate(id => { location.hash = id; }, id); await p.waitForTimeout(30);
    let bad = await p.evaluate(() => [...document.querySelectorAll('.note.bad')].map(n => n.textContent).join(' | '));
    if (bad) console.log('BAD-EX', id, bad.slice(0,200));
    const hasCalc = await p.$('[data-act="calc"]');
    if (hasCalc) { await hasCalc.click(); await p.waitForTimeout(30);
      bad = await p.evaluate(() => [...document.querySelectorAll('.note.bad')].map(n => n.textContent).join(' | '));
      if (bad) console.log('BAD-CALC', id, bad.slice(0,200)); }
  }
  await p.evaluate(() => { location.hash = 'reportes'; }); await p.waitForTimeout(100);
  const rep = await p.evaluate(() => document.querySelectorAll('.rep-s').length);
  console.log('pages', all.length, 'report sections', rep);
  console.log(errs.join('\n') || 'NO JS ERRORS');
  await b.close();
})();
