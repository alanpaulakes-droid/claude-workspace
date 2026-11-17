const {chromium}=require('playwright');const fs=require('fs');
const AX=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const pages=(process.argv[2]||'inicio,eoq,control-xr,formulario,glosario,ramo-intro-optimizacion,decisiones,tablas,pl,cpm,ishikawa,sim-sql,quiz,por-area,pruebas-calculadoras').split(',');
(async()=>{const b=await chromium.launch();const agg={};
for(const [mode,vp] of [['light',{width:1280,height:900}],['dark',{width:1280,height:900}],['mobile',{width:360,height:740}]]){
 const p=await b.newPage({viewport:vp,colorScheme:mode==='dark'?'dark':'light'});
 await p.route(/katex|noto|pdfmake/i,r=>r.abort());
 await p.goto('file://'+process.cwd()+'/testx.html');await p.waitForTimeout(800);
 for(const id of pages){
  await p.evaluate(i=>location.hash=i,id);await p.waitForTimeout(500);
  await p.evaluate(()=>document.querySelectorAll('#app details').forEach(d=>d.open=true));await p.waitForTimeout(400);
  await p.addScriptTag({content:AX});
  const r=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return r.violations.map(v=>({id:v.id,imp:v.impact,n:v.nodes.length,ex:v.nodes.slice(0,400).map(n=>n.target.join(' ')+' :: '+(n.any[0]||n.all[0]||{}).message)}))});
  r.forEach(v=>{const k=mode+'|'+v.id;agg[k]=agg[k]||{imp:v.imp,n:0,pages:[],ex:v.ex};agg[k].n+=v.n;if(agg[k].pages.length)agg[k].ex=agg[k].ex.concat(v.ex);agg[k].pages.push(id)});
 }
 await p.close();}
for(const k in agg)console.log(k,agg[k].imp,agg[k].n,agg[k].pages.join(','),'\n   ',agg[k].ex.join('\n    '));
await b.close()})()
