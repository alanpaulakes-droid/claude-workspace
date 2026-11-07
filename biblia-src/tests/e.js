const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ acceptDownloads:true }); const p = await ctx.newPage();
  const errs=[]; p.on('pageerror', e => errs.push(e.message));
  await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await p.route(/pdfmake\.min\.js$/, r => r.fulfill({ path:require.resolve('pdfmake/build/pdfmake.min.js'), contentType:'application/javascript' }));
  await p.route(/vfs_fonts\.js$/, r => r.fulfill({ path:require.resolve('pdfmake/build/vfs_fonts.js'), contentType:'application/javascript' }));
  await p.goto('file://' + process.cwd() + '/test.html#generador-informe'); await p.waitForTimeout(200);
  for (const [hash, kind] of [['generador-informe','informe'],['van-tir','calc'],['ramo-sistemas-productivos','ramo'],['control-xr','guia'],['mantenimiento','saber'],['asignacion','guia'],['transporte','calc']]) {
    await p.evaluate(h => location.hash = h, hash); await p.waitForTimeout(200);
    for (const fmt of ['docx','pdf']) {
      const btn = p.locator(`[data-act="exp"][data-kind="${kind}"][data-fmt="${fmt}"]`).first();
      const [dl] = await Promise.all([p.waitForEvent('download', { timeout:30000 }), btn.click()]);
      const f = 'out/' + hash + '.' + fmt; await dl.saveAs(f); console.log('saved', f);
    }
  }
  console.log(errs.join('\n') || 'no errors'); await b.close();
})();
