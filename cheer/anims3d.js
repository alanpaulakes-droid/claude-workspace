/* ===== Demostraciones 3D (Three.js): atleta con musculatura y resaltado por músculo ===== */
let R3=null;
const ZOFF={s1:11,E1:11,W1:11,s2:-11,E2:-11,W2:-11,p1:6.5,K1:6.5,A1:6.5,T1:6.5,p2:-6.5,K2:-6.5,A2:-6.5,T2:-6.5};
/* músculos trabajados por ejercicio (ids de malla) */
const MU3={};
[[['squat','squatPause','frontSquat','pistol','bulgarian','bulgarianBW','lungeJump'],'Q G AD'],[['rdl'],'H G LB'],[['nordic'],'H'],
 [['hipThrust','gluteBridge'],'G H'],[['calf','calfSingle','pogo'],'C'],[['copenhagen'],'AD AB'],[['sidePlank','pallof'],'AB OB'],
 [['plank','hollow','hollowRock','wheel'],'AB'],[['vup','compression'],'AB HF'],[['bear'],'AB D Q'],
 [['ohp','pressZ','pike'],'D TR'],[['lockout'],'D TR AB T'],[['pushPress'],'D TR Q'],
 [['pullup','invRow'],'L B T'],[['hangHollow'],'L AB F'],[['row'],'L T B'],[['dbBench','pushup','pushupPause'],'P TR D'],[['dips','benchDip'],'TR P D'],
 [['facePull','extRot'],'D T'],[['farmer'],'F T AB'],[['clean'],'G H Q T'],[['mbThrow'],'G H D'],[['boxJump','vjump','broad','tuckJump','hop'],'Q G C'],
 [['superman'],'LB G'],[['handstandWall','handstand'],'D TR AB'],[['toeTouch','hurdlerPike'],'HF AB AD'],
 [['splitR','splitL'],'H HF'],[['middle'],'AD'],[['heelStretch'],'H'],[['legRaise'],'HF AB'],[['scorpion'],'HF AB D'],[['bridge','toBridge'],'AB P D HF'],
 [['run','jog','shuttle'],'Q H C G'],[['jacks'],'C D'],[['liberty','balanceRelevé','heelArab'],'C AB G'],
 [['rolls','rollFwd','cartwheel','backWalk','frontWalk','bhs','frontHs','backTuck','frontTuck'],'D TR AB Q']
].forEach(([ks,c])=>ks.forEach(k=>MU3[k]=c.split(' ')));

function to3(an,J){const T=THREE,o={},fv=an.v==='f',z3=an.z3||{};
 for(const k in J){if(k[0]==='_')continue;const [x,y]=J[k];
  let z=ZOFF[k]||0;if(z3.E&&/^E[12]$/.test(k))z=Math.sign(z)*z3.E;if(z3.W&&/^W[12]$/.test(k))z=Math.sign(z)*z3.W;
  o[k]=fv?new T.Vector3(0,GY-y,-(x-120)):new T.Vector3(x-120,GY-y,z)}
 if(!fv){const pz=J._p||{};for(const n of [1,2]){const sg=n===1?1:-1,s=o['s'+n];
  const zE=sg*(pz.ez!=null?pz.ez:(z3.E||11)),zW=sg*(pz.wz!=null?pz.wz:(z3.W||11));
  const fix=(a,b,L,zb)=>{const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,dz=zb-a.z,k=Math.sqrt(Math.max(L*L-dz*dz,9))/d;return new T.Vector3(a.x+dx*k,a.y+dy*k,zb)};
  const E=fix(s,o['E'+n],LN.ua,zE),W=fix(E,o['W'+n],LN.fa,zW);o['E'+n]=E;o['W'+n]=W}}
 return o}
function bbox2(key){const an=AN[key];if(an._bb)return an._bb;let x0=1e9,x1=-1e9,y0=1e9;
 for(let i=0;i<48;i++){const J=solveJ(poseAt(an,an.total*i/48),an);for(const k in J){const [x,y]=J[k];x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y-(k==='N'?9:5))}}
 for(const q of an.p||[]){if(q.k==='box'){x0=Math.min(x0,q.x);x1=Math.max(x1,q.x+q.w)}if(q.k==='cone'){x0=Math.min(x0,q.x);x1=Math.max(x1,q.x)}if(q.k==='band'&&Array.isArray(q.to)){x0=Math.min(x0,q.to[0]);x1=Math.max(x1,q.to[0]);y0=Math.min(y0,q.to[1])}}
 return an._bb={x0,x1,y0}}

function r3init(){
 if(R3!==null)return R3;
 if(!window.THREE){R3=false;return R3}
 try{
  const T=THREE;const cv=document.createElement('canvas');
  const renderer=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:false,preserveDrawingBuffer:true});
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  const scene=new T.Scene();const cam=new T.PerspectiveCamera(30,4/3,1,3000);
  const hemi=new T.HemisphereLight(0xffffff,0x8d86a0,0.55);scene.add(hemi);
  const sun=new T.DirectionalLight(0xfff6ec,1.0);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
  Object.assign(sun.shadow.camera,{left:-170,right:170,top:170,bottom:-170,near:10,far:700});sun.shadow.bias=-0.0006;
  scene.add(sun);scene.add(sun.target);
  const rim=new T.DirectionalLight(0xcfe0ff,0.55);scene.add(rim);
  const fillL=new T.DirectionalLight(0xffffff,0.22);scene.add(fillL);
  const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.7,metalness:0},o||{}));
  const floorM=M(0xe9e6f2,{roughness:1});const floor=new T.Mesh(new T.CircleGeometry(1400,72),floorM);floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
  const matM=M(0x3f6fd8,{roughness:.95});const mat=new T.Mesh(new T.BoxGeometry(260,2.4,96),matM);mat.position.y=1.2;mat.receiveShadow=true;scene.add(mat);

  const SKIN=0xb47552,BLACK=0x18181c,BLACK2=0x111114;
  const skinM=()=>M(SKIN,{roughness:.48}),clothM=()=>M(BLACK,{roughness:.88}),shortM=()=>M(BLACK2,{roughness:.92});
  const fig=new T.Group();scene.add(fig);
  const cyl=(rt,rb)=>new T.CylinderGeometry(rt,rb,1,24,1);const SPH=new T.SphereGeometry(1,28,20);
  const segs=[],balls=[],muscles=[];
  function seg(a,b,r1,r2,mat){const m=new T.Mesh(cyl(r2,r1),mat);m.castShadow=true;m.receiveShadow=true;fig.add(m);segs.push({m,a,b});return m}
  function ball(at,r,mat,sc){const m=new T.Mesh(SPH,mat);m.scale.set(r*(sc?sc[0]:1),r*(sc?sc[1]:1),r*(sc?sc[2]:1));m.userData.base=m.scale.clone();m.castShadow=true;fig.add(m);balls.push({m,at});return m}
  /* músculo: elipsoide en el marco local de un segmento (t a lo largo, ox hacia afuera, oz hacia adelante) */
  function mus(id,side,a,b,t,ox,oz,rx,ry,rz,mat,frame){const m=new T.Mesh(SPH,mat);m.castShadow=true;m.receiveShadow=true;fig.add(m);
   const o={m,id,side,a,b,t,ox,oz,r:[rx,ry,rz],frame:frame||'limb'};muscles.push(o);return o}
  for(const n of [1,2]){
   const P='p'+n,K='K'+n,A='A'+n,Tt='T'+n,S='s'+n,E='E'+n,W='W'+n;
   // pierna base
   seg(P,K,5.4,4.3,skinM());ball(K,4.3,skinM());seg(K,A,3.9,2.7,skinM());ball(A,2.9,skinM());
   const shoe=M(0xf2f2f5,{roughness:.5}),sole=M(0x2a2a30,{roughness:.8});seg(A,Tt,3.5,2.9,shoe);ball(Tt,2.9,shoe);
   // músculos de la pierna (bajo el short la parte alta va negra)
   mus('Q',n,P,K,.52,0,2.1,4.5,9.8,3.5,skinM());              // cuádriceps (recto/vasto)
   mus('Q',n,P,K,.6,2.4,.9,3.2,8.5,3.2,skinM());              // vasto lateral
   mus('Q',n,P,K,.8,-2.1,1.5,2.7,4.2,2.6,skinM());            // vasto medial (gota)
   mus('H',n,P,K,.5,0,-2.3,4.2,9.5,3.4,skinM());              // isquiotibiales
   mus('AD',n,P,K,.3,-2.6,0,3.1,8,3.6,skinM());               // aductores
   mus('C',n,K,A,.27,1.2,-2.3,2.8,6.5,3,skinM());             // gemelo lateral
   mus('C',n,K,A,.3,-1.3,-2.4,3,7,3.1,skinM());               // gemelo medial
   mus('C',n,K,A,.38,.4,1.5,1.7,6,1.6,skinM());               // tibial anterior
   seg(P,'mT'+n,7.1,6.7,shortM());                             // short
   // brazo
   seg(S,E,3.5,2.9,skinM());ball(E,2.9,skinM());seg(E,W,3.0,2.2,skinM());ball(W,2.6,skinM(),[1,1.2,.75]);
   mus('B',n,S,E,.58,0,1.9,2.8,6.6,2.7,skinM());             // bíceps
   mus('TR',n,S,E,.45,0,-2.0,3,7.8,2.8,skinM());             // tríceps
   mus('F',n,E,W,.25,0,.6,2.9,5.2,2.6,skinM());              // antebrazo
   mus('D',n,S,E,.12,.6,0,4.5,5.4,4.4,clothM());               // deltoides (bajo la manga)
   seg(S,'mU'+n,5.3,4.7,clothM());                            // manga
  }
  /* tronco */
  const torso={};const tp=(geo,mat)=>{const m=new T.Mesh(geo,mat);m.castShadow=true;m.receiveShadow=true;fig.add(m);return m};
  torso.abs=tp(cyl(1,0.92),clothM());torso.chest=tp(cyl(1,0.84),clothM());torso.pelvis=tp(SPH,shortM());
  const tmus=[];const tm=(id,part,t,ox,oz,rx,ry,rz,mat,mirror)=>{for(const sx of mirror?[1,-1]:[1]){const m=new T.Mesh(SPH,mat);m.castShadow=true;fig.add(m);tmus.push({m,id,part,t,ox:ox*sx,oz,r:[rx,ry,rz]})}};
  tm('P','chest',.62,4.4,5.6,5.2,3.6,1.9,clothM(),1);        // pectorales
  tm('L','chest',.45,8.6,-1.5,2.6,8,4.2,clothM(),1);         // dorsales
  tm('T','chest',.95,3.6,-3.5,4,3,2.6,clothM(),1);           // trapecios
  tm('AB','abs',.5,0,5.6,5.4,9,2.2,clothM());                 // abdomen
  tm('OB','abs',.5,6.6,2.4,2.4,8,3.6,clothM(),1);            // oblicuos
  tm('LB','abs',.45,2.6,-5.2,2.4,8.5,2.4,clothM(),1);        // lumbares
  tm('G','pelvis',0,4.6,-5.6,5.4,6,4.6,shortM(),1);          // glúteos
  tm('HF','pelvis',0,4.2,4.4,2.6,4,2.4,shortM(),1);          // flexores de cadera
  seg('S','mN',3.7,3.4,skinM());
  /* cabeza */
  const head=new T.Group();fig.add(head);const hs=skinM();
  const skull=new T.Mesh(SPH,hs);skull.scale.set(6.2,7.3,6.9);skull.castShadow=true;head.add(skull);
  const jaw=new T.Mesh(SPH,hs);jaw.position.set(0,-3.6,1.8);jaw.scale.set(5.1,3.9,5);head.add(jaw);
  const chin=new T.Mesh(SPH,hs);chin.position.set(0,-5.6,4.2);chin.scale.set(2.4,1.6,1.8);head.add(chin);
  const hairM=M(0x1c130e,{roughness:.95});
  const hair=new T.Mesh(new T.SphereGeometry(1,32,20,0,Math.PI*2,0,Math.PI*0.5),hairM);hair.scale.set(6.6,7.5,7.25);hair.rotation.x=-0.38;hair.position.set(0,.7,-.5);head.add(hair);
  const eyeW=M(0xf4f1ec,{roughness:.25}),irisM=M(0x3a2414,{roughness:.25});
  for(const sx of [-1,1]){
   const e=new T.Mesh(SPH,eyeW);e.position.set(sx*2.3,.9,5.75);e.scale.set(.95,.62,.45);head.add(e);
   const ir=new T.Mesh(SPH,irisM);ir.position.set(sx*2.3,.88,6.12);ir.scale.set(.52,.52,.25);head.add(ir);
   const br=new T.Mesh(new T.BoxGeometry(2.6,.38,.6),hairM);br.position.set(sx*2.35,2.25,6.0);br.rotation.z=sx*-0.1;head.add(br);
   const ear=new T.Mesh(SPH,hs);ear.position.set(sx*6.1,.1,-.2);ear.scale.set(.9,1.9,1.3);head.add(ear);
   const cheek=new T.Mesh(SPH,hs);cheek.position.set(sx*3.3,-1.6,4.6);cheek.scale.set(1.9,1.6,1.4);head.add(cheek);
  }
  const nose=new T.Mesh(SPH,hs);nose.position.set(0,-.7,6.9);nose.scale.set(1,2,1.25);head.add(nose);
  const mouth=new T.Mesh(new T.BoxGeometry(2.7,.45,.5),M(0x8a4a3a));mouth.position.set(0,-3.3,6.2);head.add(mouth);
  const beard=new T.Mesh(SPH,M(0x2a1d16,{roughness:1,transparent:true,opacity:.28}));beard.position.set(0,-4.2,3.4);beard.scale.set(5.2,3.2,4.2);head.add(beard);

  R3={T,renderer,scene,cam,sun,rim,fillL,hemi,floor,floorM,mat,matM,fig,segs,balls,muscles,tmus,torso,head,props:{},M};
  return R3;
 }catch(e){console.warn('3D no disponible',e);R3=false;return R3}
}

/* --- props 3D --- */
function props3(key){const R=R3,T=R.T;if(R.props[key])return R.props[key];const an=AN[key];const g=new T.Group();R.scene.add(g);const ups=[];
 const eq=R.M(0x2f2c3b,{roughness:.4,metalness:.4}),eq2=R.M(0xa5a1b8,{roughness:.35,metalness:.6}),pad=R.M(0x26232f,{roughness:.8});
 const sh=m=>{m.castShadow=true;m.receiveShadow=true;g.add(m);return m};
 const cylBetween=(m,a,b)=>{const d=new T.Vector3().subVectors(b,a),L=d.length()||.01;m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());m.scale.set(1,L,1)};
 for(const q of an.p||[]){
  if(q.k==='plate'){const bar=sh(new T.Mesh(new T.CylinderGeometry(1.1,1.1,78,12),eq2));bar.rotation.x=Math.PI/2;const ps=[];for(const z of [-31,-27,27,31]){const big=Math.abs(z)>29;const p=sh(new T.Mesh(new T.CylinderGeometry(big?11.5:9,big?11.5:9,3.2,32),big?eq:R.M(0x7a1f2b,{roughness:.6})));p.rotation.x=Math.PI/2;ps.push([p,z])}
   ups.push(J=>{const P=J[q.at].clone();P.x+=(q.dx||0);P.y-=(q.dy||0);P.z=0;bar.position.copy(P);for(const [p,z] of ps)p.position.set(P.x,P.y,z)})}
  if(q.k==='db'){for(const w of ['W1','W2']){const h=sh(new T.Mesh(new T.CylinderGeometry(1,1,12,10),eq2));h.rotation.x=Math.PI/2;const pl=[-5.2,5.2].map(z=>{const p=sh(new T.Mesh(new T.CylinderGeometry(4.6,4.6,3.6,6),eq));p.rotation.x=Math.PI/2;return [p,z]});
   ups.push(J=>{const P=J[w];h.position.set(P.x,P.y,P.z);for(const [p,z] of pl)p.position.set(P.x,P.y,P.z+z)})}}
  if(q.k==='ball'){const b=sh(new T.Mesh(new T.SphereGeometry(8.5,28,20),R.M(0x5b3fd1,{roughness:.7})));ups.push(J=>{const P=J[q.at];b.position.set(P.x+3,P.y,0)})}
  if(q.k==='wheel'){const w=sh(new T.Mesh(new T.TorusGeometry(5.5,2,14,28),eq));const ax=sh(new T.Mesh(new T.CylinderGeometry(.9,.9,26,8),eq2));ax.rotation.x=Math.PI/2;ups.push(J=>{const P=J[q.at];w.position.set(P.x,Math.max(7.5,P.y),0);ax.position.copy(w.position)})}
  if(q.k==='pad'){const p=sh(new T.Mesh(new T.BoxGeometry(10,6,30),pad));ups.push(J=>{const P=J[q.at];p.position.set(P.x,P.y+6,0)})}
  if(q.k==='box'){const b=sh(new T.Mesh(new T.BoxGeometry(q.w,q.h,42),R.M(0x8f6440,{roughness:.8})));b.position.set(q.x+q.w/2-120,q.h/2,0)}
  if(q.k==='wall'){const w=sh(new T.Mesh(new T.BoxGeometry(5,220,120),R.M(0xcfcadf,{roughness:1})));w.position.set(q.x-120+2.5,110,0)}
  if(q.k==='cone'){const c=sh(new T.Mesh(new T.ConeGeometry(6,14,24),R.M(0xff7a1a,{roughness:.6})));c.position.set(q.x-120,7,0)}
  if(q.k==='bench'){const top=sh(new T.Mesh(new T.BoxGeometry(1,4,22),pad)),l1=sh(new T.Mesh(new T.BoxGeometry(3,1,16),eq)),l2=sh(new T.Mesh(new T.BoxGeometry(3,1,16),eq));
   ups.push(J=>{const xs=q.of.map(k=>J[k].x),ys=q.of.map(k=>J[k].y);let x0=Math.min(...xs)-6,x1=Math.max(...xs)+6;if(q.w&&x1-x0<q.w){const c=(x0+x1)/2;x0=c-q.w/2;x1=c+q.w/2}const y=Math.max(1,Math.min(...ys)-6);
    top.scale.x=x1-x0;top.position.set((x0+x1)/2,y-2,0);for(const [l,x] of [[l1,x0+3],[l2,x1-3]]){l.scale.y=Math.max(.1,y-4);l.position.set(x,(y-4)/2,0)}})}
  if(q.k==='pbar'){const par=q.w===14;const bars=[],posts=[];
   if(par){for(const z of [-12,12])bars.push([sh(new T.Mesh(new T.CylinderGeometry(1.3,1.3,60,10),eq2)),z]);bars.forEach(([b])=>b.rotation.z=Math.PI/2);for(let i=0;i<4;i++)posts.push(sh(new T.Mesh(new T.CylinderGeometry(1.3,1.3,1,8),eq)))}
   else{bars.push([sh(new T.Mesh(new T.CylinderGeometry(1.3,1.3,64,10),eq2)),0]);bars[0][0].rotation.x=Math.PI/2;for(let i=0;i<2;i++)posts.push(sh(new T.Mesh(new T.CylinderGeometry(1.6,1.6,1,8),eq)))}
   ups.push(J=>{const P=J[q.at];for(const [b,z] of bars)b.position.set(P.x,P.y+1,z);
    const pts=par?[[P.x-26,-12],[P.x+26,-12],[P.x-26,12],[P.x+26,12]]:[[P.x,-32],[P.x,32]];posts.forEach((p,i)=>{p.scale.y=Math.max(.1,P.y);p.position.set(pts[i][0],P.y/2,pts[i][1])})})}
  if(q.k==='band'){const bm=R.M(0xe0245e,{roughness:.5});const b=sh(new T.Mesh(new T.CylinderGeometry(.8,.8,1,8),bm));let post=null;if(Array.isArray(q.to))post=sh(new T.Mesh(new T.CylinderGeometry(2,2,1,10),eq));
   ups.push((J,an)=>{const a=J[q.at];let c;if(Array.isArray(q.to)){c=an.v==='f'?new T.Vector3(0,GY-q.to[1],-(q.to[0]-120)):new T.Vector3(q.to[0]-120,GY-q.to[1],a.z);post.scale.y=c.y+6;post.position.set(c.x,(c.y+6)/2,c.z)}else c=J[q.to];cylBetween(b,a,c)})}
 }
 return R.props[key]={g,ups}}

/* --- pose del modelo --- */
const _v=()=>new THREE.Vector3();
function limbFrame(a,b,ant,out){const T=THREE;const y=_v().subVectors(b,a);const len=y.length()||.01;y.divideScalar(len);
 let z=ant.clone().addScaledVector(y,-ant.dot(y));if(z.lengthSq()<1e-4){z=out.clone().cross(y)}z.normalize();const x=_v().crossVectors(y,z);const sg=x.dot(out)<0?-1:1;
 return {y,z,x,len,sg,q:new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z))}}
function pose3(J,an,act,pulse){const R=R3,T=R.T,L=(a,b,t)=>a.clone().lerp(b,t);
 for(const n of [1,2]){J['mT'+n]=L(J['p'+n],J['K'+n],.42);J['mU'+n]=L(J['s'+n],J['E'+n],.3)}
 J.mN=L(J.S,J.N,.55);
 const Y=new T.Vector3(0,1,0);
 for(const s of R.segs){const a=J[s.a],b=J[s.b];const d=_v().subVectors(b,a);const len=d.length()||.01;s.m.position.copy(a).addScaledVector(d,.5);s.m.quaternion.setFromUnitVectors(Y,d.divideScalar(len));s.m.scale.set(1,len,1)}
 for(const o of R.balls)o.m.position.copy(J[o.at]);
 const fv=an.v==='f';
 const up=_v().subVectors(J.S,J.H).normalize();
 let lat=fv?_v().subVectors(J.s2,J.s1).normalize():new T.Vector3(0,0,J._m?-1:1);
 lat.addScaledVector(up,-lat.dot(up)).normalize();const fw=_v().crossVectors(up,lat).normalize();
 // partes del tronco con columna flexible
 const part=(m,a,b,sx,sz)=>{const f=limbFrame(a,b,fw,lat);const len=a.distanceTo(b);m.position.copy(a).lerp(b,.5);
  m.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(_v().crossVectors(f.y,f.z),f.y,f.z));m.scale.set(sz,len,sx);return f};
 const top=J.M.clone().lerp(J.S,.86);
 const fA=part(R.torso.abs,J.H,J.M,7.6,10);const fC=part(R.torso.chest,J.M,top,8.8,12.6);
 R.torso.pelvis.position.copy(J.H).addScaledVector(up,1.2);R.torso.pelvis.quaternion.copy(R.torso.abs.quaternion);R.torso.pelvis.scale.set(10.8,7.2,7.6);
 const frames={abs:[J.H,J.M,fA],chest:[J.M,top,fC],pelvis:[J.H,J.H,fA]};
 for(const o of R.tmus){const [a,b,f]=frames[o.part];const xa=_v().crossVectors(f.y,f.z);
  const pos=a.clone().lerp(b,o.t).addScaledVector(xa,o.ox).addScaledVector(f.z,o.oz);if(o.part==='pelvis')pos.addScaledVector(f.y,1);
  o.m.position.copy(pos);o.m.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(xa,f.y,f.z));
  const on=act&&act.includes(o.id),k=on?1+.06*pulse:1;o.m.scale.set(o.r[0]*k,o.r[1],o.r[2]*k)}
 // músculos de extremidades
 const outv={};for(const n of [1,2]){outv[n]=_v().subVectors(J['s'+n],J.S);if(outv[n].lengthSq()<1e-3)outv[n]=lat.clone().multiplyScalar(n===1?1:-1);outv[n].normalize()}
 const antCache={};
 const ant=(n,isLeg)=>{const k=n+(isLeg?'l':'a');if(antCache[k])return antCache[k];let v;
  if(isLeg){const p=J['p'+n],K=J['K'+n],A=J['A'+n];const mid=L(p,A,.5);const bk=_v().subVectors(mid,K);v=bk.length()>2?bk.multiplyScalar(-1):fw.clone()}
  else{const s=J['s'+n],E=J['E'+n],W=J['W'+n];const mid=L(s,W,.5);const f=_v().subVectors(mid,E);v=f.length()>2?f:fw.clone()}
  return antCache[k]=v.normalize()};
 for(const o of R.muscles){const a=J[o.a],b=J[o.b];const isLeg=o.a[0]==='p'||o.a[0]==='K';const f=limbFrame(a,b,ant(o.side,isLeg),outv[o.side]);
  const pos=a.clone().addScaledVector(f.y,f.len*o.t).addScaledVector(f.x,o.ox*f.sg).addScaledVector(f.z,o.oz);
  o.m.position.copy(pos);o.m.quaternion.copy(f.q);const on=act&&act.includes(o.id),k=on?1+.07*pulse:1;o.m.scale.set(o.r[0]*k,o.r[1]*Math.min(1.15,f.len/24+.1),o.r[2]*k)}
 // cabeza
 const hu=_v().subVectors(J.N,J.S).normalize();const chestUp=_v().subVectors(J.S,J.M).normalize();
 let fwC=_v().crossVectors(chestUp,lat).normalize();const hf=fv?new T.Vector3(1,0,0):fwC;
 hf.addScaledVector(hu,-hf.dot(hu)).normalize();const hx=_v().crossVectors(hu,hf).normalize();
 R.head.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(hx,hu,hf));R.head.position.copy(J.N).addScaledVector(hu,-1.2);
}

let R3theme='';
function theme3(){const R=R3,C=dcols();const key=[C.bg2,C.floor,C.mat].join();if(key===R3theme)return;R3theme=key;const T=R.T;
 const col=s=>{try{return new T.Color(s)}catch(e){return new T.Color(0x888888)}};
 R.renderer.setClearColor(col(C.bg2),1);R.scene.fog=new T.Fog(col(C.bg2),300,900);R.floorM.color=col(C.floor);R.matM.color=col(C.mat);
 const dark=col(C.bg2).getHSL({}).l<.3;R.hemi.intensity=dark?.5:.55;R.rim.intensity=dark?.9:.55}

function draw3D(cv,key,ms){
 const R=r3init();if(!R)return drawDemo(cv,key,ms);
 const T=R.T,an=AN[key];theme3();
 if(R.renderer.domElement.width!==cv.width||R.renderer.domElement.height!==cv.height){R.renderer.setPixelRatio(1);R.renderer.setSize(cv.width,cv.height,false);R.cam.aspect=cv.width/cv.height;R.cam.updateProjectionMatrix()}
 const p=poseAt(an,ms);const J2=solveJ(p,an);J2._p=p;const J=to3(an,J2);J._m=p.m>0.5;
 const act=MU3[key]||[],st=MU[key]&&MU[key].st,pulse=.5+.5*Math.sin(ms/240);
 pose3(J,an,act,pulse);
 const hc=new T.Color(st?0x1f8bff:0xff3b1f);
 for(const o of R.muscles.concat(R.tmus)){const mt=o.m.material;if(act.includes(o.id)){mt.emissive.copy(hc);mt.emissiveIntensity=.35+.45*pulse}else mt.emissiveIntensity=0}
 for(const k in R.props)R.props[k].g.visible=(k===key);
 const pr=props3(key);pr.g.visible=true;for(const u of pr.ups)u(J,an);
 const bb=bbox2(key),fv=an.v==='f';const cx=(bb.x0+bb.x1)/2,h=GY-bb.y0,w=bb.x1-bb.x0;
 const tgt=fv?new T.Vector3(0,h*.5,-(cx-120)):new T.Vector3(cx-120,h*.5,0);
 const base=an.cam||(fv?[0.86,0.24,0.46]:[0.5,0.24,0.83]);const az=cv._az||0;const ca=Math.cos(az),sa=Math.sin(az);
 const dir=new T.Vector3(base[0]*ca+base[2]*sa,base[1],-base[0]*sa+base[2]*ca).normalize();
 const need=Math.max(h,w/R.cam.aspect)*1.1+18;const dist=need/(2*Math.tan(R.cam.fov*Math.PI/360));
 R.cam.position.copy(tgt).addScaledVector(dir,dist);R.cam.lookAt(tgt);if(R.scene.fog){R.scene.fog.near=dist*1.05;R.scene.fog.far=dist*2.6}
 R.sun.position.set(tgt.x+70,tgt.y+190,tgt.z+120);R.sun.target.position.copy(tgt);
 R.rim.position.copy(tgt).addScaledVector(dir,-200).add(new T.Vector3(0,120,0));R.fillL.position.copy(tgt).addScaledVector(dir,150).add(new T.Vector3(-60,20,0));
 R.floor.position.set(tgt.x,0,tgt.z);R.mat.visible=!!an.mat;R.mat.position.set(tgt.x,1.2,tgt.z);R.mat.rotation.y=fv?Math.PI/2:0;
 R.renderer.render(R.scene,R.cam);
 const ctx=cv.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(R.renderer.domElement,0,0)}
