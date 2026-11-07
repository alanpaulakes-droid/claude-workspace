const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.route(/cdnjs|jsdelivr|fonts/,r=>r.abort());
await p.goto('file://'+__dirname+'/testx.html');await p.waitForTimeout(500);
for(const id of process.argv[2].split(',')){await p.evaluate(i=>location.hash=i,id);await p.waitForTimeout(80);
 console.log('### '+id);console.log(await p.evaluate(()=>{const s=document.querySelector('#t8-fx');return s?[...s.querySelectorAll('.mblk,.fcard h4,h4,b')].map(x=>x.dataset.lin||x.textContent).join(' | ').slice(0,900):''}));}
await b.close()})()
