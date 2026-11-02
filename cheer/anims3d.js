/* ===== Demostraciones 3D (Three.js) — usa las poses de anims.js ===== */
let R3=null;
const ZOFF={s1:11,E1:11,W1:11,s2:-11,E2:-11,W2:-11,p1:6.5,K1:6.5,A1:6.5,T1:6.5,p2:-6.5,K2:-6.5,A2:-6.5,T2:-6.5};
function to3(an,J){const T=THREE,o={},fv=an.v==='f';
 for(const k in J){if(k[0]==='_')continue;const [x,y]=J[k];
  o[k]=fv?new T.Vector3(0,GY-y,-(x-120)):new T.Vector3(x-120,GY-y,ZOFF[k]||0)}
 if(!fv){o.s1.z=11;o.s2.z=-11}
 return o}
function bbox2(key){const an=AN[key];if(an._bb)return an._bb;let x0=1e9,x1=-1e9,y0=1e9;
 for(let i=0;i<48;i++){const J=solveJ(poseAt(an,an.total*i/48),an);for(const k in J){const [x,y]=J[k];x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y-(k==='N'?9:4))}}
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
  const hemi=new T.HemisphereLight(0xffffff,0x9b93ad,0.72);scene.add(hemi);
  const sun=new T.DirectionalLight(0xffffff,0.95);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
  Object.assign(sun.shadow.camera,{left:-170,right:170,top:170,bottom:-170,near:10,far:700});sun.shadow.bias=-0.0006;sun.shadow.radius=4;
  scene.add(sun);scene.add(sun.target);
  const rim=new T.DirectionalLight(0xffffff,0.35);scene.add(rim);
  const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.7,metalness:0},o||{}));
  const floorM=M(0xe9e6f2,{roughness:1});const floor=new T.Mesh(new T.CircleGeometry(1400,72),floorM);floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
  const matM=M(0x3f6fd8,{roughness:.95});const mat=new T.Mesh(new T.BoxGeometry(260,2.4,96),matM);mat.position.y=1.2;mat.receiveShadow=true;scene.add(mat);

  /* --- materiales del atleta --- */
  const C={skin:0xb97a52,hair:0x221812,shirt:0xe0245e,shorts:0x23203a,shoe:0xf4f4f8,sole:0x2b2b33,eye:0xffffff,iris:0x2a1a10,lip:0xa25a48};
  const mSkin=()=>M(C.skin,{roughness:.62}),mShirt=()=>M(C.shirt,{roughness:.8}),mShorts=()=>M(C.shorts,{roughness:.85});
  const fig=new T.Group();scene.add(fig);
  const UNIT_CYL=(rt,rb)=>new T.CylinderGeometry(rt,rb,1,20,1);
  const segs=[];
  function seg(a,b,r1,r2,mat,grp){const m=new T.Mesh(UNIT_CYL(r2,r1),mat);m.castShadow=true;m.receiveShadow=true;fig.add(m);const s={m,a,b,grp};segs.push(s);return s}
  const balls=[];
  function ball(at,r,mat,grp,sc){const m=new T.Mesh(new T.SphereGeometry(r,20,14),mat);if(sc)m.scale.set(...sc);m.castShadow=true;fig.add(m);const o={m,at,grp};balls.push(o);return o}
  const HL={q:[],c:[],g:[],a:[],f:[],d:[],b:[]};
  const reg=(code,mat)=>{HL[code].push(mat);return mat};
  for(const n of [1,2]){
   const thS=reg('q',mShorts()),thK=reg('q',mSkin()),sh=reg('c',mSkin()),ua=reg('a',mSkin()),sl=reg('a',mShirt()),fa=reg('f',mSkin()),sd=reg('d',mShirt());
   seg('p'+n,'mT'+n,7.2,6.6,thS);seg('mT'+n,'K'+n,6.1,4.7,thK);ball('K'+n,4.7,thK);
   seg('K'+n,'mS'+n,4.7,5.0,sh);seg('mS'+n,'A'+n,5.0,3.1,sh);ball('A'+n,3.2,sh);
   const shoe=M(C.shoe,{roughness:.5});seg('A'+n,'T'+n,3.6,3.0,shoe);ball('T'+n,3.0,shoe);
   seg('s'+n,'mU'+n,5.0,4.6,sl);seg('mU'+n,'E'+n,4.3,3.4,ua);ball('E'+n,3.4,ua);
   seg('E'+n,'W'+n,3.4,2.6,fa);ball('W'+n,3.0,fa,null,[1,1.15,.8]);
   ball('s'+n,5.4,sd);
  }
  const absM=reg('b',mShirt()),chestM=reg('b',mShirt()),pelvM=reg('g',mShorts());
  const torso=[];
  function tpart(geo,mat){const m=new T.Mesh(geo,mat);m.castShadow=true;m.receiveShadow=true;fig.add(m);torso.push(m);return m}
  const abs=tpart(UNIT_CYL(1,0.92),absM),chest=tpart(UNIT_CYL(1.0,0.86),chestM),pelvis=tpart(new T.SphereGeometry(1,22,16),pelvM);
  const neckM=mSkin();const neck=seg('S','mN',3.6,3.4,neckM);
  /* cabeza con cara */
  const head=new T.Group();fig.add(head);
  const skull=new T.Mesh(new T.SphereGeometry(7,28,22),mSkin());skull.scale.set(.88,1.04,.98);skull.castShadow=true;head.add(skull);
  const jaw=new T.Mesh(new T.SphereGeometry(5.2,20,14),skull.material);jaw.position.set(0,-3.4,1.6);jaw.scale.set(1,.8,1);head.add(jaw);
  const hairM=M(C.hair,{roughness:.9});
  const hair=new T.Mesh(new T.SphereGeometry(7.35,28,18,0,Math.PI*2,0,Math.PI*0.52),hairM);hair.scale.set(.92,1.04,1.02);hair.rotation.x=-0.42;hair.position.set(0,.5,-.4);head.add(hair);
  const eyeW=M(C.eye,{roughness:.3}),irisM=M(C.iris,{roughness:.3});
  for(const sx of [-1,1]){
   const e=new T.Mesh(new T.SphereGeometry(1.25,14,10),eyeW);e.position.set(sx*2.5,.9,5.75);e.scale.set(1,.8,.6);head.add(e);
   const ir=new T.Mesh(new T.SphereGeometry(.72,12,8),irisM);ir.position.set(sx*2.5,.9,6.45);head.add(ir);
   const br=new T.Mesh(new T.BoxGeometry(2.8,.55,.7),hairM);br.position.set(sx*2.5,2.55,5.9);br.rotation.z=sx*-0.12;head.add(br);
   const ear=new T.Mesh(new T.SphereGeometry(1.7,12,10),skull.material);ear.position.set(sx*6.2,.2,0);ear.scale.set(.5,1,.75);head.add(ear);
  }
  const nose=new T.Mesh(new T.ConeGeometry(1.05,3,12),skull.material);nose.rotation.x=Math.PI/2.2;nose.position.set(0,-.6,7.1);head.add(nose);
  const mouth=new T.Mesh(new T.BoxGeometry(2.6,.45,.6),M(C.lip));mouth.position.set(0,-3.2,6.15);head.add(mouth);

  R3={T,renderer,scene,cam,sun,rim,hemi,floor,floorM,mat,matM,fig,segs,balls,HL,abs,chest,pelvis,head,props:{},M,mats:{absM,chestM}};
  return R3;
 }catch(e){console.warn('3D no disponible',e);R3=false;return R3}
}

/* --- props 3D por animación --- */
function props3(key){const R=R3,T=R.T;if(R.props[key])return R.props[key];const an=AN[key];const g=new T.Group();R.scene.add(g);const ups=[];
 const eq=R.M(0x3f3a55,{roughness:.45,metalness:.35}),eq2=R.M(0x8d88a6,{roughness:.6,metalness:.2}),pad=R.M(0x2b2840,{roughness:.8});
 const sh=m=>{m.castShadow=true;m.receiveShadow=true;g.add(m);return m};
 const cylBetween=(m,a,b)=>{const d=new T.Vector3().subVectors(b,a),L=d.length()||.01;m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());m.scale.set(1,L,1)};
 for(const q of an.p||[]){
  if(q.k==='plate'){const bar=sh(new T.Mesh(new T.CylinderGeometry(1.1,1.1,74,12),eq2));bar.rotation.x=Math.PI/2;const ps=[];for(const z of [-30,-26,26,30]){const p=sh(new T.Mesh(new T.CylinderGeometry(z*z>800?11:9,z*z>800?11:9,3,28),eq));p.rotation.x=Math.PI/2;ps.push([p,z])}
   ups.push(J=>{const P=J[q.at].clone();P.x+=(q.dx||0);P.y-=(q.dy||0);P.z=0;bar.position.copy(P);for(const [p,z] of ps){p.position.set(P.x,P.y,z)}})}
  if(q.k==='db'){for(const w of ['W1','W2']){const h=sh(new T.Mesh(new T.CylinderGeometry(1,1,12,10),eq2));h.rotation.x=Math.PI/2;const pl=[-5,5].map(z=>{const p=sh(new T.Mesh(new T.CylinderGeometry(4.6,4.6,3.4,20),eq));p.rotation.x=Math.PI/2;return [p,z]});
   ups.push(J=>{const P=J[w];h.position.set(P.x,P.y,P.z);for(const [p,z] of pl)p.position.set(P.x,P.y,P.z+z)})}}
  if(q.k==='ball'){const b=sh(new T.Mesh(new T.SphereGeometry(8.5,24,18),R.M(0x7c3aed,{roughness:.6})));ups.push(J=>{const P=J[q.at];b.position.set(P.x+3,P.y,0)})}
  if(q.k==='wheel'){const w=sh(new T.Mesh(new T.TorusGeometry(5.5,2,12,28),eq));const ax=sh(new T.Mesh(new T.CylinderGeometry(.9,.9,26,8),eq2));ax.rotation.x=Math.PI/2;ups.push(J=>{const P=J[q.at];w.position.set(P.x,Math.max(7.5,P.y),0);ax.position.copy(w.position)})}
  if(q.k==='pad'){const p=sh(new T.Mesh(new T.BoxGeometry(10,6,30),pad));ups.push(J=>{const P=J[q.at];p.position.set(P.x,P.y+6,0)})}
  if(q.k==='box'){const b=sh(new T.Mesh(new T.BoxGeometry(q.w,q.h,42),R.M(0x9a6b45,{roughness:.8})));b.position.set(q.x+q.w/2-120,q.h/2,0)}
  if(q.k==='wall'){const w=sh(new T.Mesh(new T.BoxGeometry(5,220,120),R.M(0xcfcadf,{roughness:1})));w.position.set(q.x-120+2.5,110,0)}
  if(q.k==='cone'){const c=sh(new T.Mesh(new T.ConeGeometry(6,14,20),R.M(0xff7a1a,{roughness:.6})));c.position.set(q.x-120,7,0)}
  if(q.k==='bench'){const top=sh(new T.Mesh(new T.BoxGeometry(1,4,22),pad)),l1=sh(new T.Mesh(new T.BoxGeometry(3,1,16),eq)),l2=sh(new T.Mesh(new T.BoxGeometry(3,1,16),eq));
   ups.push(J=>{const xs=q.of.map(k=>J[k].x),ys=q.of.map(k=>J[k].y);let x0=Math.min(...xs)-6,x1=Math.max(...xs)+6;if(q.w&&x1-x0<q.w){const c=(x0+x1)/2;x0=c-q.w/2;x1=c+q.w/2}const y=Math.max(1,Math.min(...ys)-6);
    top.scale.x=x1-x0;top.position.set((x0+x1)/2,y-2,0);for(const [l,x] of [[l1,x0+3],[l2,x1-3]]){l.scale.y=Math.max(.1,y-4);l.position.set(x,(y-4)/2,0)}})}
  if(q.k==='pbar'){const par=q.w===14;const bars=[],posts=[];
   if(par){for(const z of [-12,12]){bars.push([sh(new T.Mesh(new T.CylinderGeometry(1.3,1.3,60,10),eq2)),z])}bars.forEach(([b])=>b.rotation.z=Math.PI/2);for(let i=0;i<4;i++)posts.push(sh(new T.Mesh(new T.CylinderGeometry(1.3,1.3,1,8),eq)))}
   else{bars.push([sh(new T.Mesh(new T.CylinderGeometry(1.3,1.3,64,10),eq2)),0]);bars[0][0].rotation.x=Math.PI/2;for(let i=0;i<2;i++)posts.push(sh(new T.Mesh(new T.CylinderGeometry(1.6,1.6,1,8),eq)))}
   ups.push(J=>{const P=J[q.at];for(const [b,z] of bars)b.position.set(P.x,P.y+1,z);
    const pts=par?[[P.x-26,-12],[P.x+26,-12],[P.x-26,12],[P.x+26,12]]:[[P.x,-32],[P.x,32]];posts.forEach((p,i)=>{p.scale.y=Math.max(.1,P.y);p.position.set(pts[i][0],P.y/2,pts[i][1])})})}
  if(q.k==='band'){const bm=R.M(0xe0245e,{roughness:.5});const b=sh(new T.Mesh(new T.CylinderGeometry(.8,.8,1,8),bm));let post=null;if(Array.isArray(q.to)){post=sh(new T.Mesh(new T.CylinderGeometry(2,2,1,10),eq))}
   ups.push((J,an)=>{const a=J[q.at];let c;if(Array.isArray(q.to)){c=an.v==='f'?new T.Vector3(0,GY-q.to[1],-(q.to[0]-120)):new T.Vector3(q.to[0]-120,GY-q.to[1],a.z);post.scale.y=c.y+6;post.position.set(c.x,(c.y+6)/2,c.z)}else c=J[q.to];cylBetween(b,a,c)})}
 }
 return R.props[key]={g,ups}}

/* --- actualizar figura --- */
function pose3(J,an){const R=R3,T=R.T,L=(a,b,t)=>a.clone().lerp(b,t);
 for(const n of [1,2]){J['mT'+n]=L(J['p'+n],J['K'+n],.45);J['mS'+n]=L(J['K'+n],J['A'+n],.35);J['mU'+n]=L(J['s'+n],J['E'+n],.32)}
 J.mN=L(J.S,J.N,.55);
 const Y=new T.Vector3(0,1,0);
 for(const s of R.segs){const a=J[s.a],b=J[s.b];const d=new T.Vector3().subVectors(b,a);const len=d.length()||.01;s.m.position.copy(a).addScaledVector(d,.5);s.m.quaternion.setFromUnitVectors(Y,d.divideScalar(len));s.m.scale.set(1,len,1)}
 for(const o of R.balls){o.m.position.copy(J[o.at])}
 // tronco orientado (ancho lateral)
 const fv=an.v==='f';const up=new T.Vector3().subVectors(J.S,J.H);const tl=up.length();up.normalize();
 let lat=fv?new T.Vector3().subVectors(J.s2,J.s1).normalize():new T.Vector3(0,0,J._m?-1:1);
 lat.addScaledVector(up,-lat.dot(up)).normalize();const fw=new T.Vector3().crossVectors(up,lat).normalize();
 const q=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(fw,up,lat));
 const mid=J.H.clone().addScaledVector(up,tl*.45),top=J.H.clone().addScaledVector(up,tl*.9);
 const put=(m,a,b,sx,sz)=>{const len=a.distanceTo(b);m.position.copy(a).lerp(b,.5);m.quaternion.copy(q);m.scale.set(sx,len,sz)};
 put(R.abs,J.H,mid,7.2,9.6);put(R.chest,mid,top,8.6,12.2);
 R.pelvis.position.copy(J.H).addScaledVector(up,1.5);R.pelvis.quaternion.copy(q);R.pelvis.scale.set(7.4,7,10.6);
 // cabeza: mira hacia "fw" del cuerpo proyectado
 const hu=new T.Vector3().subVectors(J.N,J.S).normalize();
 const hf=fv?new T.Vector3(1,0,0):fw.clone();
 hf.addScaledVector(hu,-hf.dot(hu)).normalize();const hs=new T.Vector3().crossVectors(hu,hf).normalize();
 R.head.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(hs,hu,hf));R.head.position.copy(J.N).addScaledVector(hu,-1);
}

let R3theme='';
function theme3(){const R=R3,C=dcols();const key=[C.bg2,C.floor,C.mat,C.top,C.short].join();if(key===R3theme)return;R3theme=key;const T=R.T;
 const col=s=>{try{return new T.Color(s)}catch(e){return new T.Color(0x888888)}};
 R.renderer.setClearColor(col(C.bg2),1);R.scene.fog=new T.Fog(col(C.bg2),300,900);R.floorM.color=col(C.floor);R.matM.color=col(C.mat);
 const dark=col(C.bg2).getHSL({}).l<.3;R.hemi.intensity=dark?.6:.72;R.hemi.groundColor=col(dark?'#3a3550':'#9b93ad');
 for(const s of R.segs)if(s.m.material.color.getHex()===0xe0245e||s.m.material.userData.shirt){s.m.material.userData.shirt=1;s.m.material.color=col(C.top)}
 for(const b of R.balls)if(b.m.material.userData.shirt||b.m.material.color.getHex()===0xe0245e){b.m.material.userData.shirt=1;b.m.material.color=col(C.top)}
 R.mats.absM.color=col(C.top);R.mats.chestM.color=col(C.top)}

function draw3D(cv,key,ms){
 const R=r3init();if(!R)return drawDemo(cv,key,ms);
 const T=R.T,an=AN[key];theme3();
 if(R.renderer.domElement.width!==cv.width||R.renderer.domElement.height!==cv.height){R.renderer.setPixelRatio(1);R.renderer.setSize(cv.width,cv.height,false);R.cam.aspect=cv.width/cv.height;R.cam.updateProjectionMatrix()}
 const p=poseAt(an,ms);const J2=solveJ(p,an);const J=to3(an,J2);J._m=p.m>0.5;
 pose3(J,an);
 for(const k in R.props)R.props[k].g.visible=(k===key);
 const pr=props3(key);pr.g.visible=true;for(const u of pr.ups)u(J,an);
 // músculos
 const m=MU[key],pulse=.5+.5*Math.sin(ms/260);const hc=new T.Color(m&&m.st?0x2f8bff:0xff6a00);
 for(const c in R.HL)for(const mt of R.HL[c]){if(m&&m.c.includes(c)){mt.emissive.copy(hc);mt.emissiveIntensity=.22+.38*pulse}else{mt.emissiveIntensity=0}}
 // cámara
 const bb=bbox2(key),fv=an.v==='f';const cx=(bb.x0+bb.x1)/2,h=GY-bb.y0,w=bb.x1-bb.x0;
 const tgt=fv?new T.Vector3(0,h*.5,-(cx-120)):new T.Vector3(cx-120,h*.5,0);
 const base=fv?[0.86,0.26,0.44]:[0.5,0.26,0.83];const az=cv._az||0;const ca=Math.cos(az),sa=Math.sin(az);
 const dir=new T.Vector3(base[0]*ca+base[2]*sa,base[1],-base[0]*sa+base[2]*ca).normalize();
 const need=Math.max(h,w/R.cam.aspect)*1.18+14;const dist=need/(2*Math.tan(R.cam.fov*Math.PI/360));
 R.cam.position.copy(tgt).addScaledVector(dir,dist);if(R.scene.fog){R.scene.fog.near=dist*1.05;R.scene.fog.far=dist*2.6}R.cam.lookAt(tgt);
 R.sun.position.set(tgt.x+70,tgt.y+190,tgt.z+110);R.sun.target.position.copy(tgt);R.rim.position.set(tgt.x-120,tgt.y+80,tgt.z-140);
 R.floor.position.set(tgt.x,0,tgt.z);R.mat.visible=!!an.mat;R.mat.position.set(tgt.x,1.2,tgt.z);if(fv)R.mat.rotation.y=Math.PI/2;else R.mat.rotation.y=0;
 R.renderer.render(R.scene,R.cam);
 const ctx=cv.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(R.renderer.domElement,0,0)}
