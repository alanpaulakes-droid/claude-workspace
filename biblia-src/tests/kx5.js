const katex=require(process.argv[2]);const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.route(/cdnjs|jsdelivr|fonts/,r=>r.abort());
await p.goto('file://'+__dirname+'/testx.html');await p.waitForTimeout(400);
const fx=await p.evaluate(ids=>{const o=[];ids.forEach(i=>(__X.T2[i].fx||[]).forEach(f=>o.push([i,f[1]])));return o},process.argv[3].split(','));
let bad=0;fx.forEach(([i,t])=>{try{katex.renderToString(t,{throwOnError:true,strict:'error',output:'mathml'})}catch(e){bad++;console.log(i,e.message.slice(0,120))}});console.log('fx',fx.length,'bad',bad);await b.close()})()
