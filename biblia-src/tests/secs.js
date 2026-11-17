const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.route(/cdnjs|jsdelivr|fonts/,r=>r.abort());
await p.goto('file://'+__dirname+'/testx.html');await p.waitForTimeout(500);
for(const id of process.argv[2].split(',')){await p.evaluate(i=>location.hash=i,id);await p.waitForTimeout(80);
 console.log('### '+id);console.log(await p.evaluate((full)=>[...document.querySelectorAll('#app .t8-b')].map(s=>s.querySelector('h2').textContent+': '+[...s.querySelectorAll(':scope>details>summary')].map(x=>x.textContent).join(' / ')+(full?'\n   '+[...s.querySelectorAll(':scope>details .body')].map(x=>x.innerText.replace(/\s+/g,' ').slice(0,+full)).join('\n   '):'')).join('\n'),process.argv[3]||0));}
await b.close()})()
