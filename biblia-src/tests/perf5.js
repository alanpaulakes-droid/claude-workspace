const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|ERR_FAILED|net::/.test(m.text()))errs.push(m.text())});
await p.route(/katex|noto|pdfmake/i,r=>r.abort());
const t0=Date.now();await p.goto('file://'+process.cwd()+'/test.html',{waitUntil:'load'});const load=Date.now()-t0;
const nav=await p.evaluate(()=>{const n=performance.getEntriesByType('navigation')[0];return {dcl:Math.round(n.domContentLoadedEventEnd),load:Math.round(n.loadEventEnd)}});
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-go]')].map(x=>x.dataset.go));
const all=await p.evaluate(()=>{const s=new Set();document.querySelectorAll('[data-go]').forEach(x=>s.add(x.dataset.go));return [...s]});
const times=[];
const list=await p.evaluate(()=>{try{return PAGES.map(x=>x.id)}catch(e){return null}});
const pages=list||all;
for(const id of pages){const t=await p.evaluate(i=>{const t=performance.now();location.hash=i;window.dispatchEvent(new HashChangeEvent('hashchange'));return performance.now()-t},id);await p.waitForTimeout(30);
 const r=await p.evaluate(()=>{const t=performance.now();document.querySelectorAll('#app details').forEach(d=>d.open=true);document.body.offsetHeight;return [performance.now()-t,document.getElementById('app').querySelectorAll('*').length]});times.push([id,Math.round(t),Math.round(r[0]),r[1]]);}
times.sort((a,b)=>b[1]-a[1]);
const heap=await p.evaluate(()=>performance.memory?Math.round(performance.memory.usedJSHeapSize/1e6):null);
console.log('load',load,'ms',nav,'pages',pages.length,'heapMB',heap);console.log('slowest render',times.slice(0,8));
const avg=times.reduce((a,x)=>a+x[1],0)/times.length;console.log('avg render ms',avg.toFixed(1),'nodes max',Math.max(...times.map(x=>x[3])));
console.log('ERR',errs.slice(0,10),errs.length);await b.close()})()
