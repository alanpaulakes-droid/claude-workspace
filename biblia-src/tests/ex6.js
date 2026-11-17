const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const ctx=await b.newContext({acceptDownloads:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/pdfmake|vfs_fonts/,r=>{const u=r.request().url();const f=u.includes('vfs')?'vfs_fonts.js':'pdfmake.min.js';r.fulfill({body:fs.readFileSync(require.resolve('pdfmake/build/'+f)),contentType:'application/javascript'})});
await p.route(/katex|noto/i,r=>r.abort());
await p.goto('file://'+process.cwd()+'/testx.html#eoq');await p.waitForTimeout(1000);
fs.mkdirSync('exp5',{recursive:true});
for(const [id,kind] of [['eoq','pagina'],['eoq','guia'],['ramo-intro-optimizacion','ramo'],['formulario','formulario'],['glosario','glosario'],['decisiones','pagina']]){
 await p.evaluate(i=>location.hash=i,id);await p.waitForTimeout(600);
 for(const fmt of ['docx','pdf']){
  const sel='#app [data-act=exp][data-kind="'+kind+'"][data-fmt="'+fmt+'"]';
  if(!await p.$(sel)){console.log('NO BTN',id,kind,fmt);continue;}
  const t0=Date.now();
  const [d]=await Promise.all([p.waitForEvent('download',{timeout:60000}),p.click(sel)]);
  const fn='exp5/'+id+'-'+kind+'.'+fmt; await d.saveAs(fn); console.log(fn,fs.statSync(fn).size,(Date.now()-t0)+'ms');
 }}
console.log('ERR',errs);await b.close()})()
