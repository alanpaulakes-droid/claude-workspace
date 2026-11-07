const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.route(/cdnjs|jsdelivr|fonts/,r=>r.abort());
await p.goto('file://'+__dirname+'/testx.html');await p.waitForTimeout(500);
const ids=await p.evaluate(()=>__X.PAGES.filter(x=>__X.t8Applies(x.id)).map(x=>[x.id,x.g,x.t,!!__X.T2[x.id]]));
const out=[];for(const [id,g,t,has] of ids){await p.evaluate(i=>location.hash=i,id);await p.waitForTimeout(60);
 const r=await p.evaluate(()=>[...document.querySelectorAll('#app .t8-nav button')].map(b=>(b.classList.contains('t8-empty')?'P':b.classList.contains('t8-ref')?'r':'✓')).join(''));out.push([g,id,has?'T2':'--',r,t]);}
out.sort();console.log(out.map(x=>x.join(' | ')).join('\n'));
const no=out.filter(x=>x[2]==='--');console.log('sin T2',no.length,'con pendientes',out.filter(x=>x[3].includes('P')).length);
const byg={};no.forEach(x=>byg[x[0]]=(byg[x[0]]||0)+1);console.log(byg);await b.close()})()
