const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.route(/katex|noto|pdfmake/i,r=>r.abort());
await p.goto('file://'+process.cwd()+'/testx.html#eoq');await p.waitForTimeout(800);
await p.evaluate(()=>{window.__pc=0;window.print=()=>{window.__pc++;window.__open=[...document.querySelectorAll('#app details')].filter(d=>d.open).length;window.__tot=document.querySelectorAll('#app details').length;window.dispatchEvent(new Event('afterprint'))}});
await p.click('#app [data-act=print]');await p.waitForTimeout(400);
console.log(await p.evaluate(()=>[__pc,__open,__tot,[...document.querySelectorAll('#app details')].filter(d=>d.open).length]));
await p.emulateMedia({media:'print'});await p.evaluate(()=>document.querySelectorAll('#app details').forEach(d=>d.open=true));await p.pdf({path:'exp5/print-eoq.pdf'});
console.log(await p.evaluate(()=>['.t8-nav','.t8-exp','header.top','nav#side'].map(s=>{const e=document.querySelector(s);return s+':'+(e?getComputedStyle(e).display:'-')})));await b.close()})()
