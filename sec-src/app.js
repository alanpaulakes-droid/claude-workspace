/* ============================================================
   APLICACIÓN: estado, router, render de módulos, quiz, simulador,
   calculadoras, buscador. Lee los objetos de datos (RIC, PREGUNTAS,
   FIG, QIMG, TEORIA, PRACTICA, PROYECTO, PRUEBAS, CASOS, ...).
   ============================================================ */
(()=>{"use strict";
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const VF='<span class="vf" title="Dato a verificar en el pliego vigente publicado por la SEC">⚠ verificar</span>';
const fmt=s=>String(s).replace(/«([^»]+)»/g,'<span class="ref">$1</span>').replace(/⚠(\s*verificar)?/g,VF);
const fmtRef=s=>esc(s).replace(/⚠(\s*verificar)?/g,VF);
const nf=(x,d=0)=>Number(x).toLocaleString("es-CL",{minimumFractionDigits:d,maximumFractionDigits:d});
const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const ricName=n=>n==="GEN"?"Teoría y generales":`RIC N°${n}`;

/* ---------- Estado persistente ---------- */
const KEY="secric.v2";
const S=(()=>{let d={};try{d=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}return Object.assign({read:{},ans:{},fails:{},sims:[],mini:{},theme:null},d)})();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const record=(q,ok)=>{const a=S.ans[q.id]||{n:0,ok:0};a.n++;if(ok)a.ok++;S.ans[q.id]=a;if(ok)delete S.fails[q.id];else S.fails[q.id]=(S.fails[q.id]||0)+1;save()};

/* ---------- Tema ---------- */
const applyTheme=()=>{if(S.theme)document.documentElement.dataset.theme=S.theme;else delete document.documentElement.dataset.theme};
applyTheme();
$("#themeBtn").onclick=()=>{const dark=S.theme?S.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;S.theme=dark?"light":"dark";applyTheme();save()};

/* ---------- Módulos ---------- */
const MOD=[
 ["inicio","Inicio","0"],["evaluar","★ Evaluaciones","★"],["ric","Estudio por RIC","1"],["teoria","Teoría eléctrica aplicada","2"],["diagramas","Diagramas técnicos","3"],
 ["practica","Instalación paso a paso","4"],["proyecto","Proceso del proyecto","5"],["pruebas","Pruebas y mediciones","6"],
 ["casos","Casos prácticos","7"],["banco","Banco de preguntas","8"],["simulador","Simulador de examen","9"],["repaso","Repaso de falladas","↻"],["recursos","Recursos","10"]];
const NOREAD=new Set(["evaluar","banco","simulador","repaso"]);
const READKEYS=[...RIC.map(r=>"ric"+r.n),"teoria","diagramas","practica","proyecto","pruebas","casos","recursos"];
const progress=()=>Math.round(READKEYS.filter(k=>S.read[k]).length/READKEYS.length*100);
const setProg=()=>{const p=progress();const el=$("#progTop");el.setAttribute("aria-valuenow",p);el.firstElementChild.style.width=p+"%"};

function renderSide(cur){
  const ricLinks=RIC.filter(r=>r.prio).map(r=>`<a href="#/ric/${r.n}" ${cur==="ric/"+r.n?'aria-current="page"':""}><span class="num">${r.n}</span>${esc(r.t.replace(/ ⚠$/,""))}${S.read["ric"+r.n]?'<span class="done" aria-label="leído">✓</span>':""}</a>`).join("");
  $("#side").innerHTML=`<h2>Evaluaciones</h2>${[["evaluar","Centro de evaluaciones"],["simulador","Simulador de examen"],["banco","Banco de preguntas"],["repaso","Repaso de falladas ("+Object.keys(S.fails).length+")"]].map(([id,t])=>`<a href="#/${id}" ${cur===id?'aria-current="page"':""}><span class="num">★</span>${t}</a>`).join("")}
  <h2>Módulos de estudio</h2>${MOD.filter(m=>!NOREAD.has(m[0])).map(([id,t,n])=>`<a href="#/${id}" ${cur===id?'aria-current="page"':""}><span class="num">${n}</span>${t}${S.read[id]?'<span class="done" aria-label="leído">✓</span>':""}</a>`).join("")}
  <h2>Fichas prioritarias (vivienda)</h2>${ricLinks}<a href="#/ric"><span class="num">…</span>Todas las fichas (01–19)</a>`;
}
const side=$("#side"),scrim=$("#scrim"),mb=$("#menuBtn");
const closeMenu=()=>{side.classList.remove("open");scrim.hidden=true;mb.setAttribute("aria-expanded","false")};
mb.onclick=()=>{const o=!side.classList.contains("open");side.classList.toggle("open",o);scrim.hidden=!o;mb.setAttribute("aria-expanded",String(o));if(o)side.querySelector("a")?.focus()};
scrim.onclick=closeMenu;
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&side.classList.contains("open")){closeMenu();mb.focus()}});

/* ---------- Componentes ---------- */
const crumbs=list=>`<nav class="crumbs" aria-label="Ruta de navegación"><a href="#/inicio">Inicio</a>${list.map((c,i)=>` › ${i===list.length-1?`<span aria-current="page">${c[0]}</span>`:`<a href="${c[1]}">${c[0]}</a>`}`).join("")}</nav>`;
const table=t=>`<div class="tw"><table>${t.cap?`<caption>${fmt(t.cap)}</caption>`:""}<thead><tr>${t.cols.map(c=>`<th scope="col">${fmt(c)}</th>`).join("")}</tr></thead><tbody>${t.rows.map(r=>`<tr>${r.map(c=>`<td>${fmt(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>${t.ref?`<p class="small muted">${fmt(t.ref)}</p>`:""}</div>`;
const fig=k=>{const f=FIG[k];if(!f)return"";return `<figure class="fig" id="fig-${k}"><div class="sv">${f.svg("ok")}</div><figcaption><b>${esc(f.t)}.</b> ${fmt(f.cap)}<br><span class="ref">${fmtRef(f.ref)}</span></figcaption>
 <div class="row no-print"><button class="btn sm errbtn" data-err="${k}" aria-pressed="false" aria-controls="eb-${k}">⚠ Ver error común</button></div>
 <div class="errbox" id="eb-${k}" hidden><div class="note bad"><b>Error común:</b> ${fmt(f.err)}</div></div></figure>`};
const readBtn=k=>`<div class="row no-print"><button class="btn ${S.read[k]?"":"pri"}" data-read="${k}" aria-pressed="${!!S.read[k]}">${S.read[k]?"✓ Marcado como leído":"Marcar como leído"}</button><button class="btn" data-print>Imprimir / PDF</button></div>`;
const pct=(o,n)=>n?Math.round(o/n*100):0;

/* ---------- Motor de preguntas ---------- */
function Quiz(el,qs,o={}){
  const st={i:0,ans:Array(qs.length).fill(null),done:Array(qs.length).fill(false),fin:false,t0:Date.now(),limit:o.minutes?o.minutes*60:0};
  let timer=null;
  const exam=o.mode==="exam";
  const qimg=q=>q.img&&QIMG[q.img]?`<div class="qimg fig" style="padding:8px;margin:0 0 10px">${QIMG[q.img]()}</div>`:"";
  const tick=()=>{if(!st.limit||st.fin)return;const left=st.limit-Math.floor((Date.now()-st.t0)/1000);const t=el.querySelector(".timer");if(t){const m=Math.max(0,left);t.textContent=`${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`;t.classList.toggle("low",m<300)}if(left<=0)finish()};
  function draw(focus){
    if(st.fin)return drawEnd();
    const q=qs[st.i],a=st.ans[st.i],shown=!exam&&st.done[st.i];
    el.innerHTML=`<div class="card" aria-live="polite">
     <div class="row" style="margin-top:0;justify-content:space-between"><span class="tag">Pregunta ${st.i+1} de ${qs.length}</span>${st.limit?`<span class="timer" role="timer" aria-label="Tiempo restante">--:--</span>`:""}</div>
     <div class="qmeta" style="margin-top:8px"><span class="tag prio">${ricName(q.ric)}</span><span class="tag">Dificultad ${"●".repeat(q.d)}${"○".repeat(3-q.d)}</span>${q.img?'<span class="tag">Con imagen</span>':""}</div>
     <p class="q" id="qt">${esc(q.q)}</p>${qimg(q)}
     <div class="ops" role="radiogroup" aria-labelledby="qt">${q.o.map((t,i)=>`<button class="op ${shown?(i===q.a?"ok":i===a?"bad":""):(a===i?"sel":"")}" role="radio" aria-checked="${a===i}" data-op="${i}" ${shown?"disabled":""}><span class="ol">${"ABCD"[i]}</span><span>${esc(t)}</span></button>`).join("")}</div>
     ${shown?`<div class="fb ${a===q.a?"ok":"bad"}" tabindex="-1" id="fb"><b>${a===q.a?"✓ Correcto":"✗ Incorrecto · respuesta: "+"ABCD"[q.a]}</b><p style="margin:6px 0">${esc(q.e)}</p><span class="ref">${fmtRef(q.ref)}</span>${q.v?" "+VF:""}</div>`:""}
     <div class="row">${st.i>0&&exam?'<button class="btn" data-nav="-1">← Anterior</button>':""}
      ${exam?`<button class="btn ${st.i<qs.length-1?"pri":""}" data-nav="1" ${st.i>=qs.length-1?"disabled":""}>Siguiente →</button><button class="btn ${st.i>=qs.length-1?"pri":""}" data-submit>Entregar examen</button>`:
       shown?`<button class="btn pri" data-nav="1">${st.i<qs.length-1?"Siguiente →":"Ver resultado"}</button>`:`<button class="btn pri" data-check ${a==null?"disabled":""}>Responder</button>`}
     </div>
     ${exam?`<details class="no-print" style="margin-top:12px"><summary>Mapa de preguntas (${st.ans.filter(x=>x!=null).length}/${qs.length} respondidas)</summary><div class="row" style="margin:0 0 10px">${qs.map((_,i)=>`<button class="btn sm ${i===st.i?"pri":""}" data-go="${i}" aria-label="Ir a pregunta ${i+1}${st.ans[i]!=null?", respondida":""}">${i+1}${st.ans[i]!=null?"✓":""}</button>`).join("")}</div></details>`:""}
     <p class="small muted no-print" style="margin-top:8px">Atajo: teclas A–D o 1–4 para elegir; Enter para responder.</p></div>`;
    tick();
    if(focus==="fb")el.querySelector("#fb")?.focus();else if(focus)el.querySelector(".op")?.focus();
  }
  function choose(i){if(!exam&&st.done[st.i])return;st.ans[st.i]=i;draw();el.querySelector(`[data-op="${i}"]`)?.focus()}
  function check(){if(st.ans[st.i]==null)return;st.done[st.i]=true;record(qs[st.i],st.ans[st.i]===qs[st.i].a);draw("fb")}
  function finish(){if(st.fin)return;st.fin=true;clearInterval(timer);if(exam)qs.forEach((q,i)=>record(q,st.ans[i]===q.a));drawEnd();o.onDone&&o.onDone(res())}
  function res(){const ok=qs.filter((q,i)=>st.ans[i]===q.a).length;const by={};qs.forEach((q,i)=>{const b=by[q.ric]||(by[q.ric]={n:0,ok:0});b.n++;if(st.ans[i]===q.a)b.ok++});return{ok,n:qs.length,by,min:Math.round((Date.now()-st.t0)/60000)}}
  function drawEnd(){
    const r=res(),p=pct(r.ok,r.n),pass=o.pass?p>=o.pass:null;
    const weak=Object.entries(r.by).filter(([,b])=>pct(b.ok,b.n)<(o.pass||60)).sort((a,b)=>pct(a[1].ok,a[1].n)-pct(b[1].ok,b[1].n));
    el.innerHTML=`<div class="card" tabindex="-1" id="endc"><h2>${exam?"Resultado del simulador":"Resultado"}</h2>
     <div class="kpis"><div class="kpi ${pass===false?"bad":"ok"}"><span>Puntaje</span><b>${p} %</b></div><div class="kpi"><span>Correctas</span><b>${r.ok}/${r.n}</b></div>${pass!=null?`<div class="kpi ${pass?"ok":"bad"}"><span>Estado (mínimo ${o.pass} %)</span><b>${pass?"Aprobado":"Reprobado"}</b></div>`:""}<div class="kpi"><span>Minutos</span><b>${r.min}</b></div></div>
     <h3>Resultado por pliego</h3>${Object.entries(r.by).sort().map(([k,b])=>`<div class="row" style="margin-top:6px"><span style="min-width:150px">${k==="GEN"?"Teoría y generales":`<a href="#/ric/${k}">RIC N°${k}</a>`}</span><span class="bar" aria-hidden="true"><i style="width:${pct(b.ok,b.n)}%"></i></span><span class="small">${b.ok}/${b.n} (${pct(b.ok,b.n)} %)</span></div>`).join("")}
     ${weak.length?`<div class="note warn" style="margin-top:14px"><b>Refuerza:</b> ${weak.map(([k])=>k==="GEN"?'<a href="#/teoria">Teoría</a>':`<a href="#/ric/${k}">RIC N°${k} — ${esc(RIC.find(x=>x.n===k)?.t||"")}</a>`).join(" · ")}</div>`:`<div class="note ok" style="margin-top:14px">Sin pliegos débiles en esta sesión.</div>`}
     <details><summary>Revisión de respuestas</summary><ol class="rev">${qs.map((q,i)=>{const ok=st.ans[i]===q.a;return `<li><b>${ok?"✓":"✗"} ${esc(q.q)}</b><br>${ok?"":`<span class="small">Tu respuesta: ${st.ans[i]!=null?esc(q.o[st.ans[i]]):"sin responder"} · </span>`}<span class="small">Correcta: <b>${esc(q.o[q.a])}</b></span><br><span class="small">${esc(q.e)}</span> <span class="ref">${fmtRef(q.ref)}</span>${q.v?" "+VF:""}</li>`}).join("")}</ol></details>
     <div class="row no-print">${o.again?`<button class="btn pri" data-again>Repetir con otras preguntas</button>`:""}<a class="btn" href="#/repaso">Repasar falladas (${Object.keys(S.fails).length})</a></div></div>`;
    el.querySelector("#endc").focus();
  }
  el.onclick=e=>{const b=e.target.closest("button");if(!b||!el.contains(b))return;
    if(b.dataset.op!=null)choose(+b.dataset.op);
    else if(b.dataset.check!=null)check();
    else if(b.dataset.nav){const n=st.i+ +b.dataset.nav;if(n>=qs.length){finish();return}st.i=Math.max(0,n);draw(true)}
    else if(b.dataset.go!=null){st.i=+b.dataset.go;draw(true)}
    else if(b.dataset.submit!=null){const sin=st.ans.filter(x=>x==null).length;if(!sin||b.dataset.sure)finish();else{b.dataset.sure="1";b.classList.add("pri");b.textContent=`Quedan ${sin} sin responder · toca otra vez para entregar`}}
    else if(b.dataset.again!=null)o.again()};
  el.onkeydown=e=>{if(st.fin||e.target.closest("input,select,textarea,summary"))return;const k=e.key.toLowerCase();const m={a:0,b:1,c:2,d:3,1:0,2:1,3:2,4:3}[k];if(m!=null&&!e.ctrlKey&&!e.metaKey){e.preventDefault();choose(m)}else if(k==="enter"&&!exam&&!st.done[st.i]&&st.ans[st.i]!=null&&!e.target.closest("button")){e.preventDefault();check()}};
  if(st.limit)timer=setInterval(tick,1000);
  draw();
  return{stop:()=>clearInterval(timer)};
}
let activeQuiz=null;
const startQuiz=(el,qs,o)=>{activeQuiz&&activeQuiz.stop();activeQuiz=Quiz(el,qs,o)};

/* ---------- Calculadoras ---------- */
const izOf=(tc,met,s)=>IZ[tc][met][IZ.secc.indexOf(s)];
const ftOf=(tc,t)=>{const i=IZ.ft.t.findIndex(x=>t<=x);return IZ.ft[tc][i<0?IZ.ft.t.length-1:i]};
const fnOf=n=>IZ.fn.f[IZ.fn.hasta.findIndex(x=>n<=x)];
const protFor=(P,V,ib,min=6)=>IZ.prot.find(x=>x>=1.1*ib-1e-9&&x>=min&&P<=0.9*V*x+1e-9);
const dV=(tri,L,I,S,rho=0.018)=>(tri?Math.sqrt(3):2)*rho*L*I/S;
function calcCaida(el){
  el.innerHTML=`<div class="card no-print-break"><h3>Calculadora de caída de tensión</h3><div class="form">
   <label class="f"><span>Sistema</span><select id="cc-s"><option value="m">Monofásico 220 V</option><option value="t">Trifásico 380 V</option></select></label>
   <label class="f"><span>Largo L (m, solo ida)</span><input id="cc-l" type="number" min="1" value="25" inputmode="decimal"></label>
   <label class="f"><span>Corriente I (A)</span><input id="cc-i" type="number" min="0.1" step="0.1" value="16" inputmode="decimal"></label>
   <label class="f"><span>Sección S (mm²)</span><select id="cc-x">${IZ.secc.map(s=>`<option ${s===2.5?"selected":""}>${s}</option>`).join("")}</select></label>
   <label class="f"><span>Caída previa aguas arriba (%)</span><input id="cc-p" type="number" min="0" step="0.1" value="0" inputmode="decimal"></label></div>
   <div class="out" id="cc-o" role="status" aria-live="polite" style="margin-top:12px"></div></div>`;
  const run=()=>{const tri=$("#cc-s").value==="t",V=tri?380:220,L=+$("#cc-l").value,I=+$("#cc-i").value,s=+$("#cc-x").value,pr=+$("#cc-p").value||0;
    if(!(L>0&&I>0)){$("#cc-o").textContent="Ingresa largo y corriente mayores que cero.";return}
    const v=dV(tri,L,I,s),p=v/V*100,tot=p+pr;
    $("#cc-o").innerHTML=`ΔV = ${tri?"√3":"2"} × 0,018 × ${nf(L)} × ${nf(I,1)} ÷ ${nf(s,1)} = <b>${nf(v,2)} V</b> → <b>${nf(p,2)} %</b><br>Tramo: ${p<=3?'<span style="color:var(--ok)">cumple ≤ 3 %</span>':'<span style="color:var(--bad)">supera 3 %: sube la sección</span>'} · Total acumulado ${nf(tot,2)} %: ${tot<=5?'<span style="color:var(--ok)">cumple ≤ 5 %</span>':'<span style="color:var(--bad)">supera 5 %</span>'} <span class="ref">RIC N°03, 5.1.3</span>`};
  el.querySelectorAll("input,select").forEach(i=>i.oninput=run);run();
}
function calcSecc(el){
  el.innerHTML=`<div class="card"><h3>Dimensionamiento de conductor y protección</h3><div class="form">
   <label class="f"><span>Potencia P (W)</span><input id="cs-p" type="number" min="1" value="3000" inputmode="decimal"></label>
   <label class="f"><span>Sistema</span><select id="cs-s"><option value="m">Monofásico 220 V</option><option value="t">Trifásico 380 V</option></select></label>
   <label class="f"><span>cos φ</span><input id="cs-c" type="number" min="0.5" max="1" step="0.01" value="1"></label>
   <label class="f"><span>Uso</span><select id="cs-u"><option value="1.5">Iluminación (mín. 1,5 mm²)</option><option value="2.5" selected>Enchufes / mixto (mín. 2,5 mm²)</option><option value="4">Alimentador (mín. 4 mm²)</option></select></label>
   <label class="f"><span>Método</span><select id="cs-m"><option>A1</option><option>B1</option><option>E</option></select></label>
   <label class="f"><span>Aislación</span><select id="cs-t"><option value="70">70 °C (THWN, H07V…)</option><option value="90">90 °C (THHN, RV-K…)</option></select></label>
   <label class="f"><span>T° ambiente (°C)</span><input id="cs-a" type="number" value="30" min="10" max="60"></label>
   <label class="f"><span>Conductores activos en el ducto</span><input id="cs-n" type="number" value="2" min="1" max="60"></label>
   <label class="f"><span>Largo (m)</span><input id="cs-l" type="number" value="20" min="1"></label></div>
   <div class="out" id="cs-o" role="status" aria-live="polite" style="margin-top:12px"></div>
   <p class="small muted">Criterio del curso: Ib ≤ In ≤ Iz × ft × fn; In ≥ 1,1 × Ib y P ≤ 0,9 × V × In «RIC N°10»; sección mínima por uso; ΔV ≤ 3 %. Para motores y cargas especiales aplica además el pliego correspondiente.</p></div>`;
  el.querySelector("p.small").innerHTML=fmt(el.querySelector("p.small").textContent);
  const run=()=>{const P=+$("#cs-p").value,tri=$("#cs-s").value==="t",V=tri?380:220,c=+$("#cs-c").value||1,mn=+$("#cs-u").value,met=$("#cs-m").value,tc=$("#cs-t").value,ta=+$("#cs-a").value,n=+$("#cs-n").value||1,L=+$("#cs-l").value;
    const ib=P/((tri?Math.sqrt(3):1)*V*c),In=IZ.prot.find(x=>x>=1.1*ib-1e-9&&(tri||P<=0.9*V*x*c+1e-9));
    if(!In){$("#cs-o").textContent="Carga fuera del rango de la tabla del curso (> 125 A).";return}
    const ft=ftOf(tc,ta),fn=fnOf(n);
    const s=IZ.secc.find(x=>x>=mn&&izOf(tc,met,x)*ft*fn>=In&&dV(tri,L,ib,x)/V*100<=3);
    if(!s){$("#cs-o").textContent="Ninguna sección de la tabla cumple: revisa el largo o divide la carga.";return}
    const iz=izOf(tc,met,s),d=dV(tri,L,ib,s)/V*100;
    $("#cs-o").innerHTML=`Ib = ${nf(ib,2)} A · In = <b>${In} A</b> (≥ 1,1 × Ib = ${nf(1.1*ib,2)} A)<br>ft = ${nf(ft,2)} · fn = ${nf(fn,2)} → sección <b>${nf(s,1)} mm²</b> (Iz tabla ${iz} A → corregida ${nf(iz*ft*fn,1)} A ≥ ${In} A)<br>ΔV = ${nf(d,2)} % ${d<=3?"≤ 3 % ✓":""} <span class="ref">RIC N°04, Tablas 4.4, 4.6, 4.7</span>`};
  el.querySelectorAll("input,select").forEach(i=>i.oninput=run);run();
}

/* ---------- Casos prácticos (cálculo) ---------- */
function resolverCaso(c){
  const fd=P=>Math.min(P,3000)+Math.max(0,Math.min(P,120000)-3000)*.35+Math.max(0,P-120000)*.25;
  const rows=c.circ.map(x=>{const ib=x.p/220;const min=x.tipo==="luz"?10:16;const In=protFor(x.p,220,ib,min);const smin=x.tipo==="luz"?1.5:2.5;const s=IZ.secc.find(z=>z>=smin&&izOf("70",c.met,z)>=In);const d=dV(false,x.L,ib,s)/220*100;return Object.assign({},x,{ib,In,curva:x.tipo==="luz"?"B":"C",s,iz:izOf("70",c.met,s),d})});
  const general=rows.filter(r=>r.tipo!=="esp100"),esp=rows.filter(r=>r.tipo==="esp100");
  const Pinst=rows.reduce((a,r)=>a+r.p,0),Pg=general.reduce((a,r)=>a+r.p,0),Pdg=fd(Pg),Pd=Pdg+esp.reduce((a,r)=>a+r.p,0);
  let Imax,fases=null;
  if(c.tipo==="tri"){fases={L1:0,L2:0,L3:0};esp.forEach(r=>fases[r.f]+=r.p);fases.L3+=Pdg;Imax=Math.max(...Object.values(fases))/220}else Imax=Pd/220;
  const IG=IZ.prot.find(x=>x>=Imax&&x>=25);
  const sAl=IZ.secc.find(z=>z>=4&&izOf("70",c.met,z)>=IG);
  const dAl=c.tipo==="tri"?dV(true,c.Lal,Imax,sAl)/380*100:dV(false,c.Lal,Imax,sAl)/220*100;
  const DR=[25,40,63].find(x=>x>=IG);
  return{rows,Pinst,Pg,Pdg,Pd,Imax,IG,sAl,dAl,DR,fases};
}
function uniCaso(c,r){
  const w=Math.max(760,140+r.rows.length*62);const drs=[...new Set(r.rows.map(x=>x.dr))];
  let x0=110,body=`${T(20,26,(c.tipo==="tri"?"Empalme trifásico ":"Empalme ")+r.IG+" A","t-b")}<circle cx="60" cy="60" r="18" class="bx"/>${T(60,64,"kWh","t-b","middle")}<path d="M60 78V100" class="ln"/>${T(72,94,`Alim. ${nf(r.sAl,1)} mm² + PE`,"t-m")}<rect x="46" y="100" width="28" height="30" rx="3" class="brk"/>${T(84,120,`IG ${c.tipo==="tri"?"4P":"2P"} ${r.IG} A`,"t-m")}<path d="M60 130V150H${w-30}" class="ln" stroke-width="2.5"/>`;
  drs.forEach(d=>{const cs=r.rows.filter(z=>z.dr===d);const xa=x0,xb=x0+(cs.length-1)*62,xm=(xa+xb)/2;
   body+=`<path d="M${xm} 150V166" class="ln"/><rect x="${xm-16}" y="166" width="32" height="28" rx="3" class="rcd"/>${T(xm,210,d.replace(" ⚠",""),"t-m","middle")}${T(xm,222,(d.includes("tipo B")?"":r.DR+" A ")+"30 mA","t-m","middle")}<path d="M${xm} 194V232M${xa} 232H${xb}" class="ln"/>`;
   cs.forEach((z,i)=>{const x=xa+i*62;body+=`<path d="M${x} 232V242" class="ln"/><rect x="${x-12}" y="242" width="24" height="28" rx="3" class="brk"/>${T(x,284,z.c,"t-b","middle")}${T(x,298,z.In+"A "+z.curva,"t-m","middle")}${T(x,312,nf(z.s,1)+" mm²","t-m","middle")}`});x0=xb+90});
  return SV(`0 0 ${Math.max(w,x0)} 330`,"Diagrama unilineal — "+c.t,"Unilineal calculado del caso: empalme, alimentador, interruptor general, diferenciales y circuitos con calibre, curva y sección.",body);
}

/* ---------- Vistas ---------- */
const V={};
V.inicio=()=>{const n=Object.keys(S.ans).length,tot=Object.values(S.ans).reduce((a,b)=>a+b.n,0),ok=Object.values(S.ans).reduce((a,b)=>a+b.ok,0),best=S.sims.reduce((m,s)=>Math.max(m,s.p),0),p=progress();
 return `<span class="eb">Curso de certificación · Instalaciones domiciliarias BT</span><h1>Preparación para la certificación SEC</h1>
 <p class="lead">Estudia los pliegos RIC con citas al numeral, practica con diagramas técnicos y casos resueltos, y mide tu avance con un simulador de examen.</p>
 <div class="cta"><a class="btn pri big" href="#/evaluar">★ Ir a las evaluaciones</a><a class="btn big" href="#/simulador">⏱ Simulador de examen</a><a class="btn big" href="#/ric">📘 Estudiar por RIC</a></div>
 <div class="note warn"><b>Aviso:</b> ${esc(MARCO.aviso)} Los datos que no se pudieron confirmar contra el texto oficial se marcan con ${VF}.</div>
 <section class="card"><h2>Tu progreso global</h2><div class="row" style="margin-top:0"><span class="bar" role="progressbar" aria-label="Progreso global" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></span><b>${p} %</b></div>
 <div class="kpis" style="margin-top:12px"><div class="kpi"><span>Temas leídos</span><b>${READKEYS.filter(k=>S.read[k]).length}/${READKEYS.length}</b></div><div class="kpi"><span>Preguntas distintas</span><b>${n}/${PREGUNTAS.length}</b></div><div class="kpi ${tot&&pct(ok,tot)>=60?"ok":"warn"}"><span>Acierto histórico</span><b>${tot?pct(ok,tot)+" %":"—"}</b></div><div class="kpi ${Object.keys(S.fails).length?"bad":""}"><span>Falladas por repasar</span><b>${Object.keys(S.fails).length}</b></div><div class="kpi"><span>Mejor simulacro</span><b>${S.sims.length?best+" %":"—"}</b></div></div></section>
 <div class="grid2"><section class="card"><h2>Objetivo</h2><p>Dominar los requisitos de seguridad de las instalaciones de consumo en baja tensión aplicables a viviendas, saber calcular y proyectar una instalación domiciliaria completa y rendir con seguridad la evaluación de certificación SEC.</p></section>
 <section class="card"><h2>Alcance y marco normativo</h2><ul><li>${esc(MARCO.ds)}</li><li>${esc(MARCO.res)}</li><li>Énfasis: RIC N°01, 02, 03, 04, 05, 06, 10, 15, 18 y 19. Los demás pliegos, en formato resumido.</li></ul></section></div>
 <section class="card"><h2>Cómo usar la plataforma</h2><ol class="steps"><li><b>Estudia</b> cada ficha RIC: objetivo, definiciones, tablas, errores en terreno y «lo que entra en el examen». <a href="#/ric">Ir a fichas</a></li><li><b>Refuerza</b> con teoría, diagramas, instalación paso a paso, proceso del proyecto y pruebas.</li><li><b>Aplica</b> en los 3 casos prácticos resueltos. <a href="#/casos">Ver casos</a></li><li><b>Practica</b> con el banco de ${PREGUNTAS.length} preguntas filtrando por RIC y dificultad. <a href="#/banco">Banco</a></li><li><b>Mide</b> tu nivel en el simulador cronometrado y repasa las falladas. <a href="#/simulador">Simulador</a></li></ol><p class="small muted">Tu progreso se guarda en este navegador (localStorage). Usa el buscador superior para encontrar cualquier concepto.</p></section>
 <h2>Módulos</h2><div class="grid">${MOD.slice(1).map(([id,t,n])=>`<a class="tile" href="#/${id}"><span class="tag">${n}</span> <b>${t}</b>${S.read[id]?'<span class="tag ok">✓ leído</span>':""}</a>`).join("")}</div>`};
V.ric=()=>`${crumbs([["Estudio por RIC"]])}<span class="eb">Módulo 1</span><h1>Estudio por pliego RIC</h1><p class="lead">Una ficha por pliego. Las marcadas como prioritarias son las de mayor peso para instalaciones domiciliarias.</p>
 <div class="grid">${[...RIC].sort((a,b)=>b.prio-a.prio||a.n.localeCompare(b.n)).map(r=>{const m=S.mini[r.n];return `<a class="tile" href="#/ric/${r.n}"><b>RIC N°${r.n}</b><small>${esc(r.t.replace(" ⚠",""))}</small>${r.prio?'<span class="tag prio">Prioritario vivienda</span> ':'<span class="tag">Resumido</span> '}${S.read["ric"+r.n]?'<span class="tag ok">✓ leído</span> ':""}${m!=null?`<span class="tag">Mini-quiz ${m} %</span>`:""}</a>`}).join("")}</div>`;
V.ricN=n=>{const r=RIC.find(x=>x.n===n);if(!r)return V.ric();const i=RIC.indexOf(r),prev=RIC[i-1],next=RIC[i+1];
 return `${crumbs([["Estudio por RIC","#/ric"],["RIC N°"+r.n]])}<span class="eb">RIC N°${r.n} · ${r.prio?"Prioritario":"Resumido"}</span><h1>${fmt(r.t)}</h1>
 <div class="row no-print" style="margin:0 0 12px"><a class="btn pri sm" href="#/ric/${r.n}" data-jump="miniq">★ Ir al mini-quiz de esta ficha</a><a class="btn sm" href="#/evaluar">Centro de evaluaciones</a></div>
 <section class="card"><h2>Objetivo</h2><p>${fmt(r.obj)}</p></section>
 <section class="card"><h2>Definiciones clave</h2><dl class="defs">${r.defs.map(([a,b])=>`<dt>${esc(a)}</dt><dd>${fmt(b)}</dd>`).join("")}</dl></section>
 <section class="card"><h2>Requisitos</h2>${r.req.map(table).join("")}</section>
 ${r.dg.map(fig).join("")}
 <section class="card"><h2>Errores frecuentes en terreno</h2><ul class="err">${r.err.map(e=>`<li>${fmt(e)}</li>`).join("")}</ul></section>
 <section class="card exam"><h2>Lo que entra en el examen</h2><ul>${r.exam.map(e=>`<li>${fmt(e)}</li>`).join("")}</ul></section>
 <section class="no-print" id="miniq"><h2>Mini-quiz (5 preguntas)</h2><div id="mini"></div></section>
 ${readBtn("ric"+r.n)}
 <div class="row no-print">${prev?`<a class="btn" href="#/ric/${prev.n}">← RIC N°${prev.n}</a>`:""}${next?`<a class="btn" href="#/ric/${next.n}">RIC N°${next.n} →</a>`:""}</div>`};
V.evaluar=()=>{const tot=Object.values(S.ans).reduce((a,b)=>a+b.n,0),ok=Object.values(S.ans).reduce((a,b)=>a+b.ok,0),f=Object.keys(S.fails).length,best=S.sims.reduce((m,x)=>Math.max(m,x.p),0);
 return `${crumbs([["Evaluaciones"]])}<span class="eb">Evaluaciones</span><h1>Centro de evaluaciones</h1><p class="lead">Todas las formas de evaluarte en un solo lugar.</p>
 <div class="kpis"><div class="kpi"><span>Respuestas</span><b>${tot}</b></div><div class="kpi ${tot&&pct(ok,tot)>=60?"ok":"warn"}"><span>Acierto</span><b>${tot?pct(ok,tot)+" %":"—"}</b></div><div class="kpi ${f?"bad":""}"><span>Falladas</span><b>${f}</b></div><div class="kpi"><span>Mejor simulacro</span><b>${S.sims.length?best+" %":"—"}</b></div></div>
 <div class="grid ev">
  <a class="tile big" href="#/simulador"><b>⏱ Simulador de examen</b><small>Cronometrado, preguntas aleatorias, nota mínima y feedback por RIC débil.</small></a>
  <a class="tile big" href="#/banco"><b>📋 Banco de preguntas</b><small>${PREGUNTAS.length} preguntas filtrables por RIC, dificultad e imagen.</small></a>
  <a class="tile big" href="#/repaso"><b>↻ Repaso de falladas</b><small>${f?f+" preguntas pendientes":"Sin pendientes"}</small></a>
  <button class="tile big" id="ev-img" style="text-align:left;font:inherit"><b>🖼 Preguntas con imagen</b><small>${PREGUNTAS.filter(q=>q.img).length} preguntas: identifica conexiones y errores.</small></button>
 </div>
 <section class="card" style="margin-top:14px"><h2>Práctica rápida por pliego</h2><div class="form"><label class="f"><span>Pliego</span><select id="ev-r">${[...RIC.map(r=>r.n),"GEN"].map(n=>`<option value="${n}">${n==="GEN"?"Teoría y generales":"RIC N°"+n+" — "+esc(RIC.find(r=>r.n===n).t.replace(" ⚠",""))}</option>`).join("")}</select></label><label class="f"><span>Preguntas</span><select id="ev-n"><option>5</option><option selected>10</option><option>15</option></select></label></div><div class="row"><button class="btn pri" id="ev-go">Comenzar práctica</button></div></section>
 <div id="evq"></div>
 <section class="card"><h2>Mini-quiz de cada ficha</h2><div class="grid">${RIC.map(r=>`<a class="tile" href="#/ric/${r.n}" data-jump="miniq"><b>RIC N°${r.n}</b><small>${S.mini[r.n]!=null?"Último: "+S.mini[r.n]+" %":"Sin rendir"}</small></a>`).join("")}</div></section>`};
V.teoria=()=>`${crumbs([["Teoría eléctrica aplicada"]])}<span class="eb">Módulo 2</span><h1>Teoría eléctrica aplicada</h1>${TEORIA.map(t=>`<section class="card" id="t-${t.id}"><h2>${t.t}</h2>${fmt(t.html)}</section>${(t.dg||[]).map(fig).join("")}`).join("")}${readBtn("teoria")}`;
V.diagramas=()=>`${crumbs([["Diagramas técnicos"]])}<span class="eb">Módulo 3</span><h1>Diagramas e imágenes técnicas</h1><p class="lead">Cada diagrama incluye leyenda, referencia normativa y un botón para ver el error común en terreno.</p>
 <nav class="card no-print" aria-label="Índice de diagramas"><div class="row" style="margin:0">${Object.entries(FIG).map(([k,f])=>`<a class="btn sm" href="#/diagramas" data-jump="fig-${k}">${esc(f.t)}</a>`).join("")}</div></nav>${Object.keys(FIG).map(fig).join("")}${readBtn("diagramas")}`;
V.practica=()=>`${crumbs([["Instalación paso a paso"]])}<span class="eb">Módulo 4</span><h1>Instalación práctica paso a paso</h1>
 <section class="card"><h2>Secuencia de obra</h2><ol class="steps">${PRACTICA.secuencia.map(([a,b])=>`<li><b>${a}.</b> ${fmt(b)}</li>`).join("")}</ol></section>
 <div class="grid2"><section class="card"><h2>Herramientas e instrumentos</h2><ul>${PRACTICA.herramientas.map(x=>`<li>${fmt(x)}</li>`).join("")}</ul></section><section class="card"><h2>Elementos de protección personal</h2><ul>${PRACTICA.epp.map(x=>`<li>${fmt(x)}</li>`).join("")}</ul></section></div>
 <section class="card"><h2>Bloqueo y etiquetado (LOTO)</h2><ol class="steps">${PRACTICA.loto.map(x=>`<li>${fmt(x)}</li>`).join("")}</ol><p class="small">${fmt("Referencia: «RIC N°17» ⚠ numeral · buenas prácticas de trabajo sin tensión (5 reglas de oro).")}</p></section>
 <section class="card"><h2>Verificación de ausencia de tensión</h2><ol class="steps">${PRACTICA.ausencia.map(x=>`<li>${fmt(x)}</li>`).join("")}</ol></section>
 ${["uniones","canalizacion","tablero"].map(fig).join("")}${readBtn("practica")}`;
V.proyecto=()=>`${crumbs([["Proceso del proyecto"]])}<span class="eb">Módulo 5</span><h1>Proceso del proyecto eléctrico</h1><p class="lead">Selecciona una etapa del flujo para ver responsable, documentos y detalle.</p>
 <div class="flow" role="group" aria-label="Etapas del proyecto">${PROYECTO.map((p,i)=>`<button data-step="${i}" aria-pressed="${i===0}" aria-controls="stepd">${esc(p.t)}<small>${esc(p.r)}</small></button>`).join("")}</div>
 <section class="card" id="stepd" aria-live="polite" style="margin-top:14px"></section>
 <section class="card"><h2>Tabla resumen</h2>${table({cols:["#","Etapa","Responsable","Documentos"],rows:PROYECTO.map((p,i)=>[String(i+1),p.t,p.r,p.d])})}</section>
 ${fig("unilineal")}${fig("simbologia")}${readBtn("proyecto")}`;
V.pruebas=()=>`${crumbs([["Pruebas y mediciones"]])}<span class="eb">Módulo 6</span><h1>Pruebas y mediciones</h1>
 ${PRUEBAS.map(p=>`<section class="card"><h2>${esc(p.t)}</h2><dl class="defs"><dt>Instrumento</dt><dd>${fmt(p.inst)}</dd><dt>Método</dt><dd>${fmt(p.met)}</dd><dt>Aceptación</dt><dd><b>${fmt(p.ac)}</b></dd><dt>Cita</dt><dd>${fmt(p.ref)}</dd></dl></section>`).join("")}
 ${fig("telurometro")}
 <section class="card" id="protocolo"><h2>Protocolo de ensayos (imprimible)</h2><p class="small muted">Completa en pantalla o imprime en blanco.</p>
 <div class="form"><label class="f"><span>Dirección</span><input type="text"></label><label class="f"><span>Instalador / licencia</span><input type="text"></label><label class="f"><span>Fecha</span><input type="text"></label></div>
 <div class="tw" style="margin-top:12px"><table><thead><tr><th>Circuito</th><th>Continuidad PE</th><th>Aislación F–N (MΩ)</th><th>F–PE (MΩ)</th><th>N–PE (MΩ)</th><th>DR: I disparo (mA) / t (ms)</th><th>Polaridad</th><th>OK</th></tr></thead><tbody>${["Alimentador","C1","C2","C3","C4","C5","C6"].map(c=>`<tr><td>${c}</td>${"<td><input type='text' aria-label='valor'></td>".repeat(7)}</tr>`).join("")}</tbody></table></div>
 <p>Resistencia de puesta a tierra: ______ Ω (aceptación ${fmt("≤ 20 Ω «RIC N°06, 6.1»")}) · Equipo y n.° de serie: ____________ · Firma: ____________</p><div class="row no-print"><button class="btn pri" data-print>Imprimir protocolo</button></div></section>${readBtn("pruebas")}`;
V.casos=()=>`${crumbs([["Casos prácticos"]])}<span class="eb">Módulo 7</span><h1>Casos prácticos resueltos</h1><p class="lead">Cálculos con ρ = 0,018 Ω·mm²/m, cos φ = 1, conductores de 70 °C en método ${CASOS[0].met} (embutido) a 30 °C. Los valores se calculan con el mismo código de las calculadoras.</p>
 ${CASOS.map(c=>{const r=resolverCaso(c);return `<section class="card" id="${c.id}"><h2>${esc(c.t)}</h2><p>${esc(c.desc)}</p>
 <h3>1 · Cuadro de cargas</h3><div class="tw"><table><thead><tr><th>Circ.</th><th>Uso</th>${c.tipo==="tri"?"<th>Fase</th>":""}<th>P (W)</th><th>Ib (A)</th><th>Protección</th><th>Sección</th><th>Iz A1 (A)</th><th>L (m)</th><th>ΔV %</th><th>Diferencial</th></tr></thead><tbody>${r.rows.map(x=>`<tr><td>${x.c}</td><td>${esc(x.u)}</td>${c.tipo==="tri"?`<td>${x.f}</td>`:""}<td>${nf(x.p)}</td><td>${nf(x.ib,2)}</td><td>${x.In} A curva ${x.curva}</td><td>${nf(x.s,1)} mm²</td><td>${x.iz}</td><td>${x.L}</td><td>${nf(x.d,2)}</td><td>${fmt(x.dr)}</td></tr>`).join("")}</tbody></table></div>
 <p class="small">${fmt("Protección: In ≥ 1,1 × Ib y P ≤ 0,9 × 220 × In «RIC N°10, 5.1.4.1 y 5.1.4.4»; mínimo 10 A en alumbrado y 16 A en enchufes/cocina «RIC N°10, 5.2 d)». Sección: Iz ≥ In «RIC N°04, Tabla 4.4» y mínimos «RIC N°04, 5.4».")}</p>
 <h3>2 · Demanda y empalme</h3><div class="formula">P instalada = ${nf(r.Pinst)} W · Uso general ${nf(r.Pg)} W → Tabla 3.1: ${nf(Math.min(r.Pg,3000))} + ${nf(Math.max(0,r.Pg-3000))} × 0,35 = ${nf(r.Pdg)} W${r.Pd>r.Pdg?` · + cargas especiales al 100 %: ${nf(r.Pd-r.Pdg)} W`:""} → Demanda ${nf(r.Pd)} W</div>
 ${r.fases?`<p>Reparto por fase: L1 ${nf(r.fases.L1)} W · L2 ${nf(r.fases.L2)} W · L3 ${nf(r.fases.L3)} W → corriente de la fase más cargada ${nf(r.Imax,1)} A.</p>`:`<p>I = ${nf(r.Pd)} ÷ 220 = ${nf(r.Imax,1)} A.</p>`}
 <p>${fmt(`Interruptor general y empalme: <b>${r.IG} A</b> (≥ I y ≥ 25 A «RIC N°10, 5.2»; capacidades normalizadas de empalme de la distribuidora ⚠). Diferenciales: ${r.DR} A, coordinados con el general «RIC N°02, 6.2.6».`)}</p>
 <h3>3 · Alimentador y caída de tensión</h3><p>${fmt(`Alimentador ${c.tipo==="tri"?"4 × ":"2 × "}${nf(r.sAl,1)} mm² + PE (Iz ${izOf("70",c.met,r.sAl)} A ≥ ${r.IG} A; mínimo 4 mm² «RIC N°03, 5.1.2»). Largo ${c.Lal} m → ΔV = ${nf(r.dAl,2)} %. Peor total: ${nf(r.dAl+Math.max(...r.rows.map(x=>x.d)),2)} % ${r.dAl+Math.max(...r.rows.map(x=>x.d))<=5?"≤ 5 % ✓":"> 5 % ✗"} «RIC N°03, 5.1.3».`)}</p>
 ${r.IG===25&&izOf("70",c.met,4)<25?`<div class="note">Observa: con 4 mm² en A1 (24 A) no se alcanza a proteger con 25 A; por eso se sube a ${nf(r.sAl,1)} mm² (o se usa canalización B1, donde 4 mm² soporta 28 A).</div>`:""}
 <h3>4 · Diagrama unilineal</h3><figure class="fig"><div class="sv">${uniCaso(c,r)}</div><figcaption>Unilineal calculado. ${fmt("«RIC N°18»")}</figcaption></figure>
 <h3>Notas normativas</h3><ul>${c.notas.map(x=>`<li>${fmt(x)}</li>`).join("")}</ul></section>`}).join("")}${readBtn("casos")}`;
V.banco=()=>{const rics=["todos",...RIC.map(r=>r.n),"GEN"];return `${crumbs([["Banco de preguntas"]])}<span class="eb">Módulo 8</span><h1>Banco de preguntas tipo examen</h1><p class="lead">${PREGUNTAS.length} preguntas clasificadas por pliego y dificultad, con explicación y cita normativa. ${PREGUNTAS.filter(q=>q.img).length} incluyen imagen.</p>
 <section class="card no-print"><div class="form"><label class="f"><span>Pliego</span><select id="bf-r">${rics.map(r=>`<option value="${r}">${r==="todos"?"Todos":r==="GEN"?"Teoría y generales":"RIC N°"+r} (${r==="todos"?PREGUNTAS.length:PREGUNTAS.filter(q=>q.ric===r).length})</option>`).join("")}</select></label>
 <label class="f"><span>Dificultad</span><select id="bf-d"><option value="0">Todas</option><option value="1">● Básica</option><option value="2">●● Media</option><option value="3">●●● Alta</option></select></label>
 <label class="f"><span>Tipo</span><select id="bf-i"><option value="0">Todas</option><option value="1">Solo con imagen</option><option value="2">Solo no respondidas</option></select></label>
 <label class="f"><span>Cantidad para practicar</span><select id="bf-n"><option>10</option><option selected>20</option><option>30</option><option value="999">Todas</option></select></label></div>
 <div class="row"><button class="btn pri" id="bf-go">Practicar selección</button><span id="bf-c" class="small muted" role="status"></span></div></section>
 <div id="bq"></div><details id="blist"><summary>Ver listado de la selección (con respuestas, imprimible)</summary><ol id="bl"></ol></details>`};
V.simulador=()=>`${crumbs([["Simulador de examen"]])}<span class="eb">Módulo 9</span><h1>Simulador de examen</h1>
 <div class="note warn">Configuración de práctica. Cantidad de preguntas, tiempo y nota mínima del examen oficial: ${VF} con la SEC.</div>
 <section class="card no-print" id="simcfg"><div class="form"><label class="f"><span>Preguntas</span><select id="sm-n"><option>20</option><option selected>40</option><option>60</option></select></label><label class="f"><span>Tiempo (min)</span><select id="sm-t"><option>30</option><option selected>60</option><option>90</option></select></label><label class="f"><span>Aprobación (%)</span><select id="sm-p"><option>50</option><option selected>60</option><option>70</option><option>75</option></select></label><label class="f"><span>Enfoque</span><select id="sm-f"><option value="vivienda">Prioritarios vivienda (80 %) + resto</option><option value="todo">Todo el banco</option></select></label></div><div class="row"><button class="btn pri" id="sm-go">Comenzar simulador</button></div></section>
 <div id="simq"></div>
 ${S.sims.length?`<section class="card"><h2>Historial</h2>${table({cols:["Fecha","Puntaje","Estado","Preguntas"],rows:S.sims.slice(-10).reverse().map(s=>[new Date(s.f).toLocaleString("es-CL"),s.p+" %",s.ok?"Aprobado":"Reprobado",String(s.n)])})}</section>`:""}`;
V.repaso=()=>{const ids=Object.keys(S.fails);return `${crumbs([["Repaso de falladas"]])}<span class="eb">Repaso</span><h1>Repaso de preguntas falladas</h1>
 ${ids.length?`<p class="lead">Tienes ${ids.length} preguntas por repasar. Cada acierto la retira de la lista.</p><div class="row"><button class="btn pri" id="rp-go">Repasar ahora (${Math.min(20,ids.length)})</button><button class="btn" id="rp-clr">Vaciar lista</button></div><div id="rpq" style="margin-top:14px"></div>`:`<div class="note ok">No tienes preguntas falladas pendientes.</div>`}
 <section class="card" style="margin-top:14px"><h2>Acierto por pliego (histórico)</h2>${[...RIC.map(r=>r.n),"GEN"].map(k=>{let n=0,o=0;PREGUNTAS.filter(q=>q.ric===k).forEach(q=>{const a=S.ans[q.id];if(a){n+=a.n;o+=a.ok}});return `<div class="row" style="margin-top:6px"><span style="min-width:150px">${k==="GEN"?"Teoría":`<a href="#/ric/${k}">RIC N°${k}</a>`}</span><span class="bar" aria-hidden="true"><i style="width:${pct(o,n)}%"></i></span><span class="small">${n?pct(o,n)+" %":"—"}</span></div>`}).join("")}
 <div class="row"><button class="btn" id="rp-reset">Borrar todo mi progreso</button></div></section>`};
V.recursos=()=>`${crumbs([["Recursos"]])}<span class="eb">Módulo 10</span><h1>Recursos</h1>
 <section class="card"><h2>Glosario normativo</h2><dl class="defs">${GLOSARIO.map(([a,b])=>`<dt id="g-${norm(a).replace(/[^a-z0-9]/g,"")}">${esc(a)}</dt><dd>${fmt(b)}</dd>`).join("")}</dl></section>
 <section class="card"><h2>Fórmulas</h2>${["I = P ÷ (V × cos φ)    [monofásico]","I = P ÷ (√3 × V<sub>L</sub> × cos φ)    [trifásico]","ΔV = 2 × ρ × L × I ÷ S    [mono]    ·    ΔV = √3 × ρ × L × I ÷ S    [tri]","Iz' = Iz × ft × fn    ·    Ib ≤ In ≤ Iz'","Σ P ≤ 0,9 × V × In    ·    In ≥ 1,1 × Ib    (RIC N°10)","Demanda vivienda: 3 kW × 100 % + (P − 3 kW) × 35 % (hasta 120 kW)","R pica ≈ ρ ÷ L    ·    RA × IΔn ≤ UL"].map(f=>`<div class="formula">${f}</div>`).join("")}</section>
 <section class="card"><h2>Tablas resumen</h2>${table({cap:"Valores que más se preguntan",cols:["Tema","Valor","Cita"],rows:[["Caída de tensión","3 % tramo · 5 % total","«RIC N°03, 5.1.3»"],["Secciones mínimas","1,5 ilum. · 2,5 enchufes · 2,5 subalim. · 4 alim. (mm²)","«RIC N°04, 5.4»"],["Colores","L1 azul · L2 negro · L3 rojo · N blanco · PE verde/verde-amarillo","«RIC N°04, 5.32»"],["Llenado de tubo","50 % / 33 % / 60 %","«RIC N°04, Tabla 4.21»"],["Diferencial","≤ 30 mA · máx. 3 circuitos","«RIC N°10, 5.1.3.5 y 5.1.3.7»"],["Tierra de servicio","≤ 20 Ω (80 Ω con 6.2)","«RIC N°06, 6.1 y 6.2»"],["UL","50 V seco · 24 V húmedo","«RIC N°05, 5.8»"],["Tableros IP","41 interior · 44 bajo techo · 54 intemperie · X4 mojado","«RIC N°02, 6.1.21»"],["Altura comandos","0,45 – 2,0 m","«RIC N°02, 6.1.22»"],["Aislación","500 V CC → ≥ 0,5 MΩ","«RIC N°19, Tabla 19.1»"],["Continuidad","4–24 V, ≥ 0,2 A","«RIC N°19, 7.2.1»"]]})}</section>
 <section class="card"><h2>Checklist de inspección</h2>${CHECKLIST.map(([g,...it])=>`<h3>${g}</h3><ul class="chk">${it.map((x,i)=>`<li><label><input type="checkbox" data-chk="${g}-${i}" ${S.read["chk:"+g+"-"+i]?"checked":""}> <span>${fmt(x)}</span></label></li>`).join("")}</ul>`).join("")}</section>
 <section class="card"><h2>Datos marcados para verificar</h2>${table({cols:["Pliego / tema","Qué verificar"],rows:VERIFICAR})}</section>
 <section class="card"><h2>Enlaces oficiales</h2><ul>${ENLACES.map(([t,u])=>`<li><a href="${u}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join("")}</ul></section>${readBtn("recursos")}`;

/* ---------- Buscador ---------- */
let IDX=null;
const strip=s=>String(s).replace(/<[^>]+>/g," ").replace(/[«»]/g,"");
function buildIdx(){IDX=[];
 RIC.forEach(r=>IDX.push({t:`RIC N°${r.n} — ${r.t}`,s:"Ficha",h:"#/ric/"+r.n,x:strip([r.t,r.obj,...r.defs.flat(),...r.req.flatMap(t=>t.rows.flat()),...r.err,...r.exam].join(" "))}));
 TEORIA.forEach(t=>IDX.push({t:t.t,s:"Teoría",h:"#/teoria",x:strip(t.t+" "+t.html)}));
 Object.entries(FIG).forEach(([k,f])=>IDX.push({t:f.t,s:"Diagrama",h:"#/diagramas",j:"fig-"+k,x:strip(f.t+" "+f.cap+" "+f.err+" "+f.ref)}));
 GLOSARIO.forEach(([a,b])=>IDX.push({t:a,s:"Glosario",h:"#/recursos",x:strip(a+" "+b)}));
 PROYECTO.forEach(p=>IDX.push({t:p.t,s:"Proceso del proyecto",h:"#/proyecto",x:strip(Object.values(p).join(" "))}));
 PRUEBAS.forEach(p=>IDX.push({t:p.t,s:"Pruebas",h:"#/pruebas",x:strip(Object.values(p).join(" "))}));
 PREGUNTAS.forEach(q=>IDX.push({t:q.q,s:"Pregunta · "+ricName(q.ric),h:"#/banco",x:strip(q.q+" "+q.o[q.a]+" "+q.e+" "+q.ref)}));
 IDX.forEach(e=>e.n=norm(e.t+" "+e.x));}
V.buscar=q=>{if(!IDX)buildIdx();const ws=norm(q).split(/\s+/).filter(w=>w.length>1);
 const res=ws.length?IDX.map(e=>({e,sc:ws.reduce((a,w)=>a+(e.n.includes(w)?(norm(e.t).includes(w)?3:1):-99),0)})).filter(r=>r.sc>0).sort((a,b)=>b.sc-a.sc).slice(0,60):[];
 const hl=s=>{let h=esc(s);ws.forEach(w=>{h=h.replace(new RegExp("("+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","gi"),"<mark>$1</mark>")});return h};
 const snip=e=>{const i=e.n.indexOf(ws[0]);return i<0?"":"…"+e.x.substr(Math.max(0,i-60),160)+"…"};
 return `${crumbs([["Búsqueda"]])}<h1>Resultados para «${esc(q)}»</h1><p class="muted" role="status">${res.length} resultado(s)</p><div class="card sres" style="padding:0">${res.map(({e})=>`<a href="${e.h}" ${e.j?`data-jump="${e.j}"`:""}><b>${hl(e.t)}</b><br><small>${e.s} · ${hl(snip(e))}</small></a>`).join("")||'<p style="padding:14px">Sin resultados. Prueba con otra palabra (p. ej., «diferencial», «IP44», «TE1»).</p>'}</div>`};
let sT;$("#q").addEventListener("input",e=>{clearTimeout(sT);sT=setTimeout(()=>{const v=e.target.value.trim();if(v.length<2)return;CUR="buscar/"+v;try{history.replaceState(null,"","#/buscar/"+encodeURIComponent(v))}catch(e){}route(false)},250)});
$("#q").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();$("#main").focus()}});

/* ---------- Router ---------- */
let pendingJump=null,stepFn=null;
const hashPath=()=>{try{return decodeURIComponent(location.hash.replace(/^#\/?/,""))}catch(e){return ""}};
let CUR=hashPath()||"inicio";
function go(path,focus=true){CUR=path;try{history.pushState(null,"","#/"+path)}catch(e){}route(focus)}
function route(focus=true){
  activeQuiz&&activeQuiz.stop();activeQuiz=null;
  const h=CUR||"inicio";const [a,b]=h.split("/");
  let html,cur=a;
  if(a==="ric"&&b){html=V.ricN(b);cur="ric/"+b}else if(a==="buscar")html=V.buscar(h.slice(7));else html=(V[a]||V.inicio)();
  const m=$("#main");m.dataset.ok="1";m.innerHTML=html+`<footer class="foot"><p>${esc(MARCO.aviso)} Datos con ${VF} deben confirmarse en el pliego vigente.</p></footer>`;
  renderSide(V[a]?cur:"inicio");document.querySelectorAll("#bnav [data-b]").forEach(x=>{const k=x.dataset.b;const on=k===a||(k==="ric"&&a==="ric");if(on)x.setAttribute("aria-current","page");else x.removeAttribute("aria-current")});setProg();closeMenu();
  document.title=(a==="ric"&&b?`RIC N°${b} · `:"")+"Curso SEC RIC";
  after(a,b);
  if(pendingJump){const el=document.getElementById(pendingJump);pendingJump=null;if(el){el.scrollIntoView();el.querySelector("button,a")?.focus();return}}
  if(focus){window.scrollTo(0,0);m.focus({preventScroll:true})}
}
function after(a,b){
  stepFn=null;
  if(a==="ric"&&b){const qs=shuffle(PREGUNTAS.filter(q=>q.ric===b)).slice(0,5);if(qs.length)startQuiz($("#mini"),qs,{mode:"practice",onDone:r=>{S.mini[b]=pct(r.ok,r.n);save()},again:()=>after(a,b)})}
  if(a==="evaluar"){const st=qs=>{startQuiz($("#evq"),qs,{mode:"practice",again:()=>route()});$("#evq").scrollIntoView()};
   $("#ev-go").onclick=()=>{const r=$("#ev-r").value;st(shuffle(PREGUNTAS.filter(q=>q.ric===r)).slice(0,+$("#ev-n").value))};
   $("#ev-img").onclick=()=>st(shuffle(PREGUNTAS.filter(q=>q.img)))}
  if(a==="teoria"){calcCaida($("#calcCaida"));calcSecc($("#calcSecc"))}
  if(a==="proyecto"){const show=i=>{const p=PROYECTO[i];$("#stepd").innerHTML=`<h2>${i+1} · ${esc(p.t)}</h2><dl class="defs"><dt>Responsable</dt><dd>${esc(p.r)}</dd><dt>Documentos</dt><dd>${esc(p.d)}</dd><dt>Detalle</dt><dd>${fmt(p.x)}</dd></dl><div class="row">${i>0?`<button class="btn" data-step="${i-1}">← Anterior</button>`:""}${i<PROYECTO.length-1?`<button class="btn pri" data-step="${i+1}">Siguiente etapa →</button>`:""}</div>`;document.querySelectorAll(".flow button").forEach(x=>x.setAttribute("aria-pressed",String(+x.dataset.step===i)))};show(0);stepFn=show}
  if(a==="banco"){const sel=()=>{const r=$("#bf-r").value,d=+$("#bf-d").value,t=+$("#bf-i").value;return PREGUNTAS.filter(q=>(r==="todos"||q.ric===r)&&(!d||q.d===d)&&(t!==1||q.img)&&(t!==2||!S.ans[q.id]))};
   const upd=()=>{const s=sel();$("#bf-c").textContent=`${s.length} preguntas en la selección`;$("#bl").innerHTML=s.map(q=>`<li style="margin-bottom:10px"><b>${esc(q.q)}</b> <span class="tag">${ricName(q.ric)} · ${"●".repeat(q.d)}</span><ol type="A">${q.o.map((o,i)=>`<li${i===q.a?' style="font-weight:700"':""}>${esc(o)}${i===q.a?" ✓":""}</li>`).join("")}</ol><span class="small">${esc(q.e)}</span> <span class="ref">${fmtRef(q.ref)}</span></li>`).join("")};
   ["#bf-r","#bf-d","#bf-i"].forEach(s=>$(s).onchange=upd);upd();
   $("#bf-go").onclick=()=>{const s=sel();if(!s.length)return;const n=+$("#bf-n").value;startQuiz($("#bq"),shuffle(s).slice(0,n),{mode:"practice",again:()=>$("#bf-go").click()});$("#bq").scrollIntoView()}}
  if(a==="simulador"){$("#sm-go").onclick=()=>{const n=+$("#sm-n").value,t=+$("#sm-t").value,p=+$("#sm-p").value;let qs;
    if($("#sm-f").value==="vivienda"){const pr=new Set(RIC.filter(r=>r.prio).map(r=>r.n).concat("GEN"));const A=shuffle(PREGUNTAS.filter(q=>pr.has(q.ric))),B=shuffle(PREGUNTAS.filter(q=>!pr.has(q.ric)));const k=Math.round(n*.8);qs=shuffle(A.slice(0,k).concat(B.slice(0,n-k)))}else qs=shuffle(PREGUNTAS).slice(0,n);
    $("#simcfg").hidden=true;startQuiz($("#simq"),qs,{mode:"exam",minutes:t,pass:p,onDone:r=>{const pp=pct(r.ok,r.n);S.sims.push({f:Date.now(),p:pp,ok:pp>=p,n:r.n});save()},again:()=>route()})}}
  if(a==="repaso"){const go=$("#rp-go");if(go)go.onclick=()=>{const qs=shuffle(PREGUNTAS.filter(q=>S.fails[q.id])).slice(0,20);startQuiz($("#rpq"),qs,{mode:"practice",again:()=>route()})};
   const c=$("#rp-clr");if(c)c.onclick=()=>{S.fails={};save();route()};
   $("#rp-reset").onclick=e=>{const b=e.currentTarget;if(!b.dataset.sure){b.dataset.sure="1";b.textContent="¿Seguro? Toca otra vez para borrar todo";return}Object.assign(S,{read:{},ans:{},fails:{},sims:[],mini:{}});save();route()}}
  if(a==="recursos")document.querySelectorAll("[data-chk]").forEach(c=>c.onchange=()=>{S.read["chk:"+c.dataset.chk]=c.checked;save()});
}
document.addEventListener("click",e=>{
  const st=e.target.closest("[data-step]");if(st&&stepFn){stepFn(+st.dataset.step);return}
  const r=e.target.closest("[data-read]");if(r){const k=r.dataset.read;S.read[k]=!S.read[k];save();r.textContent=S.read[k]?"✓ Marcado como leído":"Marcar como leído";r.classList.toggle("pri",!S.read[k]);r.setAttribute("aria-pressed",String(S.read[k]));renderSide(CUR);setProg();return}
  if(e.target.closest("[data-print]")){document.querySelectorAll("details").forEach(d=>d.open=true);window.print();return}
  const er=e.target.closest("[data-err]");if(er){const k=er.dataset.err,f=document.getElementById("fig-"+k),on=er.getAttribute("aria-pressed")!=="true";f.querySelector(".sv").innerHTML=FIG[k].svg(on?"err":"ok");f.querySelector(".errbox").hidden=!on;er.setAttribute("aria-pressed",String(on));er.textContent=on?"✓ Ver instalación correcta":"⚠ Ver error común";return}
  const j=e.target.closest("[data-jump]");if(j){e.preventDefault();const id=j.dataset.jump,path=(j.getAttribute("href")||"#/"+CUR).replace(/^#\/?/,"");if(path===CUR){const el=document.getElementById(id);if(el){el.scrollIntoView();const f=el.querySelector("button,a");f&&f.focus()}}else{pendingJump=id;go(path)}return}
  const ln=e.target.closest('a[href^="#/"]');if(ln&&!e.ctrlKey&&!e.metaKey){e.preventDefault();go(ln.getAttribute("href").slice(2));return}
  const bm=e.target.closest("[data-menu]");if(bm){mb.click();return}
});
window.addEventListener("popstate",()=>{CUR=hashPath()||"inicio";route()});
window.addEventListener("hashchange",()=>{const h=hashPath()||"inicio";if(h!==CUR){CUR=h;route()}});
window.addEventListener("beforeprint",()=>document.querySelectorAll("details").forEach(d=>d.open=true));
route(false);
})();
