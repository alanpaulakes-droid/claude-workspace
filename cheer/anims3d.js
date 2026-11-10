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
 [['rolls','rollFwd','cartwheel','backWalk','frontWalk','bhs','frontHs','backTuck','frontTuck'],'D TR AB Q'],[['rdlSingle','goodMorning'],'H G LB'],[['walkLunge','stepUp'],'Q G'],[['deadbug','mountain'],'AB'],[['legRaiseHang','hFrontLever','rFrontLever'],'AB L'],[['dbRow','ropeClimb','rMuscleUp'],'L B F'],[['hKip','hSwing','rSwing','hHipCircle'],'L AB D'],[['planche','rPlanche','rCross','rSupport','rBackLever'],'D P B TR'],[['pSupport','pSwing','pHandstand','hCast','hCastHS','hGiant','hGiantF','hStalder','hHandstand','pUpperArm','pShoulderStand'],'D TR AB'],[['phSupport','phPendulum','phScissors','phCircles','phMushroom','phFlair','flair'],'D TR AB OB'],[['rLsit','pLsit'],'AB HF'],[['vRun','vHandspring'],'Q C D'],[['pancake'],'AD H'],[['rSkin'],'D P'],[['wrists'],'F']
].forEach(([ks,c])=>ks.forEach(k=>MU3[k]=c.split(' ')));

const RAD3={H:6.6,M:7.2,S:7.2,N:7,p1:6.4,p2:6.4,K1:4.3,K2:4.3,A1:3.3,A2:3.3,T1:2.7,T2:2.7,E1:2.9,E2:2.9,W1:1.6,W2:1.6,s1:4.4,s2:4.4};
function to3(an,J){const T=THREE,o={},fv=an.v==='f',z3=an.z3||{};
 for(const k in J){if(k[0]==='_')continue;const [x,y]=J[k];
  let z=ZOFF[k]||0;if(z3.E&&/^E[12]$/.test(k))z=Math.sign(z)*z3.E;if(z3.W&&/^W[12]$/.test(k))z=Math.sign(z)*z3.W;
  o[k]=fv?new T.Vector3(0,GY-y,-(x-120)):new T.Vector3(x-120,GY-y,z)}
 if(fv&&an.bend2){const K=o.K2;const tgt=new T.Vector3(K.x+22,Math.max(2.6,K.y-14),K.z);const d=tgt.sub(K).normalize();o.A2=K.clone().addScaledVector(d,LN.sh);o.A2.y=Math.max(o.A2.y,3.3);o.T2=o.A2.clone().add(new T.Vector3(1,-.5,-7.5))}
 if(fv&&an.fwArm){o.E2.x=0;o.W2=new T.Vector3(LN.fa,o.E2.y,o.E2.z);o.E2.y=Math.max(o.E2.y,2.5);o.W2.y=o.E2.y}
 if(!fv){const pz=J._p||{};for(const n of [1,2]){const sg=n===1?1:-1,s=o['s'+n];
  const zE=sg*(pz.ez!=null?pz.ez:(z3.E||11)),zW=sg*(pz.wz!=null?pz.wz:(z3.W||11));
  const fix=(a,b,L,zb)=>{const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,dz=zb-a.z,k=Math.sqrt(Math.max(L*L-dz*dz,9))/d;return new T.Vector3(a.x+dx*k,a.y+dy*k,zb)};
  const E=fix(s,o['E'+n],LN.ua,zE),W=fix(E,o['W'+n],LN.fa,zW);o['E'+n]=E;o['W'+n]=W}}
 if(an.yaw&&J._p&&J._p.yw){const c=o.WM||o.W1,ang=J._p.yw*Math.PI/180,ca=Math.cos(ang),sa=Math.sin(ang);for(const k in o){if(k==='W1'||k==='W2'||k==='WM')continue;const v=o[k],dx=v.x-c.x,dz=v.z-c.z;v.x=c.x+dx*ca+dz*sa;v.z=c.z-dx*sa+dz*ca}}
 if(!(J._p&&J._p.pin)){let lo=1e9;for(const k in RAD3)if(o[k])lo=Math.min(lo,o[k].y-RAD3[k]);if(lo<0)for(const k in o)o[k].y-=lo}
 return o}
function bbox2(key){const an=AN[key];if(an._bb)return an._bb;let x0=1e9,x1=-1e9,y0=1e9;
 for(let i=0;i<48;i++){const J=solveJ(poseAt(an,an.total*i/48),an);for(const k in J){const [x,y]=J[k];x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y-(k==='N'?9:5))}}
 for(const q of an.p||[]){if(q.k==='box'){x0=Math.min(x0,q.x);x1=Math.max(x1,q.x+q.w)}if(q.k==='cone'){x0=Math.min(x0,q.x);x1=Math.max(x1,q.x)}if(q.k==='band'&&Array.isArray(q.to)){x0=Math.min(x0,q.to[0]);x1=Math.max(x1,q.to[0]);y0=Math.min(y0,q.to[1])}}
 if(an.yaw){const J=solveJ(poseAt(an,0),an);const hx=(J.W1[0]+J.W2[0])/2;const e=Math.max(Math.abs(x0-hx),Math.abs(x1-hx))*1.1;x0=hx-e;x1=hx+e}
 return an._bb={x0,x1,y0}}

function r3init(){
 if(R3!==null)return R3;
 if(!window.THREE){R3=false;return R3}
 try{
  const T=THREE;const cv=document.createElement('canvas');
  const renderer=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:false,preserveDrawingBuffer:true});
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  const scene=new T.Scene();const cam=new T.PerspectiveCamera(30,4/3,1,3000);
  /* entorno de estudio para reflejos suaves en piel y tela */
  try{const pm=new T.PMREMGenerator(renderer);const env=new T.Scene();
   env.add(new T.Mesh(new T.BoxGeometry(60,40,60),new T.MeshBasicMaterial({color:0x3e3b46,side:T.BackSide})));
   const panel=(w,h,x,y,z,rx,ry,k)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(k,k,k),side:T.DoubleSide}));m.position.set(x,y,z);m.rotation.set(rx,ry,0);env.add(m)};
   panel(34,14,0,19.5,0,Math.PI/2,0,5);panel(18,22,-29.5,6,8,0,Math.PI/2,3.2);panel(16,18,29.5,6,-6,0,-Math.PI/2,1.6);panel(30,14,0,7,-29.5,0,0,2.2);
   scene.environment=pm.fromScene(env,0.04).texture;pm.dispose()}catch(e){}
  const hemi=new T.HemisphereLight(0xffffff,0x6d667c,0.28);scene.add(hemi);
  const sun=new T.DirectionalLight(0xfff1e2,1.55);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
  Object.assign(sun.shadow.camera,{left:-170,right:170,top:170,bottom:-170,near:10,far:700});sun.shadow.bias=-0.0006;sun.shadow.normalBias=0.4;
  scene.add(sun);scene.add(sun.target);
  const rim=new T.DirectionalLight(0xd6e4ff,0.9);scene.add(rim);
  const fillL=new T.DirectionalLight(0xffffff,0.18);scene.add(fillL);
  const M=(c,o)=>{const m=new T.MeshStandardMaterial(Object.assign({roughness:.7,metalness:0,envMapIntensity:.6},o||{}));m.color.setHex(c).convertSRGBToLinear();return m};
  const floorM=M(0xe9e6f2,{roughness:1,envMapIntensity:.2});const floor=new T.Mesh(new T.CircleGeometry(1400,72),floorM);floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
  const matM=M(0x3f6fd8,{roughness:.95,envMapIntensity:.2});const mat=new T.Mesh(new T.BoxGeometry(260,2.4,96),matM);mat.position.y=1.2;mat.receiveShadow=true;scene.add(mat);

  const SKIN=0xbb7b57;
  const skinM=()=>{const m=new T.MeshPhysicalMaterial({roughness:.52,metalness:0,clearcoat:.12,clearcoatRoughness:.55,envMapIntensity:.7});m.color.setHex(SKIN).convertSRGBToLinear();return m};
  const clothM=()=>M(0x17171b,{roughness:.82,envMapIntensity:.45}),shortM=()=>M(0x101013,{roughness:.86,envMapIntensity:.4});
  const fig=new T.Group();scene.add(fig);
  const SPH=new T.SphereGeometry(1,32,24);
  const lathe=(pts,seg)=>{const v=[new T.Vector2(0,pts[0][0]-.015)];for(const [t,r] of pts)v.push(new T.Vector2(r,t));v.push(new T.Vector2(0,pts[pts.length-1][0]+.015));return new T.LatheGeometry(v,seg||32)};
  const segs=[],balls=[],muscles=[],hands=[],shoes=[];
  function seg(a,b,geo,mat){const m=new T.Mesh(geo,mat);m.castShadow=true;m.receiveShadow=true;fig.add(m);segs.push({m,a,b});return m}
  function ball(at,r,mat,sc){const m=new T.Mesh(SPH,mat);m.scale.set(r*(sc?sc[0]:1),r*(sc?sc[1]:1),r*(sc?sc[2]:1));m.castShadow=true;fig.add(m);balls.push({m,at});return m}
  function mus(id,side,a,b,t,ox,oz,rx,ry,rz,mat){const m=new T.Mesh(SPH,mat);m.castShadow=true;m.receiveShadow=true;fig.add(m);const o={m,id,side,a,b,t,ox,oz,r:[rx,ry,rz]};muscles.push(o);return o}
  /* perfiles anatómicos (t a lo largo del hueso, radio) */
  const G={
   thigh:lathe([[0,6.5],[.1,6.9],[.3,6.6],[.55,5.9],[.78,4.9],[.92,4.3],[1,4.2]]),
   shin:lathe([[0,4.3],[.1,4.1],[.24,4.7],[.36,4.5],[.58,3.4],[.82,2.5],[1,2.35]]),
   uarm:lathe([[0,4.5],[.15,4.3],[.42,3.9],[.62,3.75],[.85,3.1],[1,2.9]]),
   farm:lathe([[0,2.9],[.14,3.3],[.32,3.15],[.65,2.45],[1,2.0]]),
   shorts:lathe([[0,7.3],[.18,7.6],[.4,7.2],[.46,7.0]]),
   sleeve:lathe([[0,4.55],[.2,4.5],[.36,4.3],[.4,4.25]]),
   neck:lathe([[0,4.4],[.3,3.6],[.7,3.4],[1,3.3]]),
   abs:lathe([[0,1],[.3,.93],[.65,.9],[1,.98]],40),
   chest:lathe([[0,.89],[.3,1.0],[.6,1.08],[.82,1.1],[.94,.98],[1,.62]],40)};
  for(const n of [1,2]){
   const P='p'+n,K='K'+n,A='A'+n,S='s'+n,E='E'+n,W='W'+n;
   const sk=skinM();
   seg(P,K,G.thigh,sk);ball(K,4.3,sk);seg(K,A,G.shin,sk);ball(A,2.5,sk);
   seg(P,K,G.shorts,shortM());
   mus('Q',n,P,K,.42,0,3.3,4.1,9,3.4,skinM());mus('Q',n,P,K,.55,3.5,1.2,3,8,3,skinM());mus('Q',n,P,K,.78,-2.7,1.7,2.6,4,2.6,skinM());
   mus('H',n,P,K,.5,0,-3.3,4,9,3.2,skinM());mus('AD',n,P,K,.3,-3.5,0,3,7,3.4,skinM());
   mus('C',n,K,A,.27,1.4,-2.85,2.5,6,2.7,skinM());mus('C',n,K,A,.3,-1.5,-2.95,2.7,6.5,2.8,skinM());mus('C',n,K,A,.36,.6,2.35,1.6,6,1.5,skinM());
   seg(S,E,G.uarm,sk);ball(E,2.95,sk);seg(E,W,G.farm,sk);
   seg(S,E,G.sleeve,clothM());
   mus('B',n,S,E,.58,0,2.25,2.4,6,2.3,skinM());mus('TR',n,S,E,.45,0,-2.35,2.6,7,2.4,skinM());mus('F',n,E,W,.22,.4,.9,2.6,5,2.4,skinM());
   mus('D',n,S,E,.1,.6,0,3.9,4.6,3.9,clothM());
   // mano con dedos
   const hg=new T.Group();fig.add(hg);const palm=new T.Mesh(SPH,sk);palm.scale.set(2.25,2.7,1.15);palm.position.set(0,2.4,0);palm.castShadow=true;hg.add(palm);
   for(let i=0;i<4;i++){const f=new T.Mesh(SPH,sk);f.scale.set(.58,1.9-(i===3?.35:0)-(i===0?.15:0),.55);f.position.set(-1.55+i*1.03,5.6-(i===3?.3:0),.15);f.castShadow=true;hg.add(f)}
   const th=new T.Mesh(SPH,sk);th.scale.set(.62,1.6,.62);th.position.set(2.15,1.9,.7);th.rotation.z=-.6;hg.add(th);
   const open=[...hg.children];const fist=new T.Group();hg.add(fist);
   const fb=new T.Mesh(SPH,sk);fb.scale.set(2.35,2.3,2.2);fb.position.set(0,2.5,.2);fb.castShadow=true;fist.add(fb);
   for(let i=0;i<4;i++){const k=new T.Mesh(SPH,sk);k.scale.set(.62,.7,.75);k.position.set(-1.45+i*.97,4.3,.9);fist.add(k)}
   const tf=new T.Mesh(SPH,sk);tf.scale.set(.65,1.5,.65);tf.position.set(1.6,2.9,1.6);tf.rotation.set(.9,0,-.5);fist.add(tf);
   hands.push({g:hg,n,open,fist});
   // zapatilla
   const sg=new T.Group();fig.add(sg);const up=new T.Mesh(SPH,M(0xf3f3f6,{roughness:.55}));up.scale.set(3.1,6.2,2.7);up.position.set(0,3.4,.5);up.castShadow=true;sg.add(up);
   const sole=new T.Mesh(SPH,M(0x26262c,{roughness:.9}));sole.scale.set(3.0,6.4,.8);sole.position.set(0,3.4,-1.75);sole.castShadow=true;sg.add(sole);
   const sw=new T.Mesh(SPH,M(0x101014));sw.scale.set(.25,3,.7);sw.position.set(2.95,3.8,.3);sg.add(sw);
   shoes.push({g:sg,n});
  }
  const torso={};const tp=(geo,mat)=>{const m=new T.Mesh(geo,mat);m.castShadow=true;m.receiveShadow=true;fig.add(m);return m};
  torso.abs=tp(G.abs,clothM());torso.chest=tp(G.chest,clothM());torso.pelvis=tp(SPH,shortM());
  const tmus=[];const tm=(id,part,t,ox,oz,rx,ry,rz,mat,mirror)=>{for(const sx of mirror?[1,-1]:[1]){const m=new T.Mesh(SPH,mat);m.castShadow=true;fig.add(m);tmus.push({m,id,part,t,ox:ox*sx,oz,r:[rx,ry,rz]})}};
  tm('P','chest',.62,4.4,6.3,5.2,3.6,1.9,clothM(),1);
  tm('L','chest',.45,9.2,-1.6,2.6,8,4,clothM(),1);
  tm('T','chest',.9,4.6,-1.6,4.6,3.6,3.2,clothM(),1);
  tm('AB','abs',.5,0,6.2,5.2,8.6,2,clothM());
  tm('OB','abs',.5,8.2,2,2.3,8,3.4,clothM(),1);
  tm('LB','abs',.45,2.6,-6,2.3,8.4,2.2,clothM(),1);
  tm('G','pelvis',0,4.6,-5.8,5.4,6,4.6,shortM(),1);
  tm('HF','pelvis',0,4.2,4.6,2.6,4,2.4,shortM(),1);
  seg('S','N',G.neck,skinM());
  /* cabeza */
  const head=new T.Group();fig.add(head);const hs=skinM();
  const skull=new T.Mesh(SPH,hs);skull.scale.set(5.8,7.0,6.7);skull.castShadow=true;head.add(skull);
  const jaw=new T.Mesh(SPH,hs);jaw.position.set(0,-3.5,1.9);jaw.scale.set(5.1,3.9,5);head.add(jaw);
  const chin=new T.Mesh(SPH,hs);chin.position.set(0,-5.5,4.2);chin.scale.set(2.4,1.6,1.8);head.add(chin);
  const hairM=M(0x18100b,{roughness:.95,envMapIntensity:.3});
  const hair=new T.Mesh(new T.SphereGeometry(1,40,24,0,Math.PI*2,0,Math.PI*0.5),hairM);hair.scale.set(5.95,7.08,6.85);hair.rotation.x=-0.38;hair.position.set(0,.75,-.5);head.add(hair);
  const eyeW=M(0xf4f1ec,{roughness:.2}),irisM=M(0x2f1c10,{roughness:.2});
  for(const sx of [-1,1]){
   const sock=new T.Mesh(SPH,hs);sock.position.set(sx*2.3,1.35,5.5);sock.scale.set(1.5,.55,.9);head.add(sock);
   const e=new T.Mesh(SPH,eyeW);e.position.set(sx*2.3,.85,5.7);e.scale.set(.95,.55,.45);head.add(e);
   const ir=new T.Mesh(SPH,irisM);ir.position.set(sx*2.3,.83,6.05);ir.scale.set(.48,.48,.22);head.add(ir);
   const br=new T.Mesh(new T.BoxGeometry(2.6,.36,.6),hairM);br.position.set(sx*2.35,2.25,6.0);br.rotation.z=sx*-0.1;head.add(br);
   const ear=new T.Mesh(SPH,hs);ear.position.set(sx*6.05,.1,-.2);ear.scale.set(.85,1.9,1.3);head.add(ear);
   const cheek=new T.Mesh(SPH,hs);cheek.position.set(sx*3.3,-1.6,4.6);cheek.scale.set(1.9,1.6,1.4);head.add(cheek);
  }
  const nose=new T.Mesh(SPH,hs);nose.position.set(0,-.7,6.85);nose.scale.set(.95,2,1.25);head.add(nose);
  const lip=M(0x8a4c3c,{roughness:.5});const ul=new T.Mesh(SPH,lip);ul.position.set(0,-3.05,6.05);ul.scale.set(1.5,.32,.5);head.add(ul);const ll=new T.Mesh(SPH,lip);ll.position.set(0,-3.55,5.95);ll.scale.set(1.3,.38,.5);head.add(ll);
  const beard=new T.Mesh(SPH,M(0x24180f,{roughness:1,transparent:true,opacity:.3}));beard.position.set(0,-4.2,3.4);beard.scale.set(5.25,3.2,4.25);head.add(beard);

  R3={T,renderer,scene,cam,sun,rim,fillL,hemi,floor,floorM,mat,matM,fig,segs,balls,muscles,tmus,torso,head,hands,shoes,props:{},M};
  return R3;
 }catch(e){console.warn('3D no disponible',e);R3=false;return R3}
}

/* --- agarre de barra: posición sin atravesar el cuerpo + IK de brazos --- */
function ik2(s,t,l1,l2,pole){const T=THREE;const d=_v().subVectors(t,s);let L=d.length();const mx=l1+l2-0.05;let tt=t.clone();if(L>mx){d.setLength(mx);tt=s.clone().add(d);L=mx}
 const dir=d.clone().normalize();const a=(l1*l1+L*L-l2*l2)/(2*L);const h=Math.sqrt(Math.max(0,l1*l1-a*a));
 const pv=_v().subVectors(pole,s);pv.addScaledVector(dir,-pv.dot(dir));if(pv.lengthSq()<1e-6)pv.set(0,-1,0);pv.normalize();
 return [s.clone().addScaledVector(dir,a).addScaledVector(pv,h),tt]}
function segDist2(P,A,B){const ax=B.x-A.x,ay=B.y-A.y,L=ax*ax+ay*ay;let t=L?((P.x-A.x)*ax+(P.y-A.y)*ay)/L:0;t=Math.max(0,Math.min(1,t));const dx=P.x-(A.x+ax*t),dy=P.y-(A.y+ay*t);return Math.sqrt(dx*dx+dy*dy)}
function barIK(J,an){const b=an.bar;if(!b)return;const T=THREE;
 const up=_v().subVectors(J.S,J.M).normalize();const lat=new T.Vector3(0,0,J._m?-1:1);lat.addScaledVector(up,-lat.dot(up)).normalize();const fw=_v().crossVectors(up,lat).normalize();
 let C,push;
 if(b.t==='back'){C=J.S.clone().addScaledVector(fw,-9.8).addScaledVector(up,2.4);push=fw.clone().negate()}
 else if(b.t==='front'){C=J.S.clone().addScaledVector(fw,8.4).addScaledVector(up,2.6);push=fw.clone()}
 else if(b.t==='hip'){C=J.H.clone();C.y+=9.5;push=new T.Vector3(0,1,0)}
 else{C=J.W1.clone().lerp(J.W2,.5);push=b.push==='up'?new T.Vector3(0,1,0):fw.clone();push.z=0;if(push.lengthSq()<1e-4)push.set(1,0,0);push.normalize()}
 C.z=0;
 const caps=[[J.H,J.M,7.4],[J.M,J.S,7.8],[J.S,J.N,4],[J.N,J.N,8],[J.p1,J.K1,6.6],[J.K1,J.A1,4.6],[J.p2,J.K2,6.6],[J.K2,J.A2,4.6]];
 for(let i=0;i<60;i++){let bad=false;for(const [A,B,r] of caps)if(segDist2(C,A,B)<r+1.3){bad=true;break}if(!bad)break;C.addScaledVector(push,.5)}
 const g=b.g||22;J.BAR=C;
 for(const n of [1,2]){const sg=Math.sign(J['s'+n].z)||(n===1?1:-1),s=J['s'+n];const G=C.clone();G.z=sg*g;
  const out=new T.Vector3(0,0,sg);let pole;
  if(b.t==='back')pole=s.clone().addScaledVector(up,-1).addScaledVector(fw,-.6).addScaledVector(out,1.2);
  else if(b.t==='front')pole=s.clone().addScaledVector(fw,1.3).addScaledVector(out,.5).addScaledVector(up,-.2);
  else pole=J['E'+n].clone().addScaledVector(out,.6);
  let [E,W]=ik2(s,G,LN.ua,LN.fa,pole);const fd=_v().subVectors(G,E).normalize();[E,W]=ik2(s,G.clone().addScaledVector(fd,-2.4),LN.ua,LN.fa,pole);
  J['E'+n]=E;J['W'+n]=W}
}
/* --- props 3D --- */
function props3(key){const R=R3,T=R.T;if(R.props[key])return R.props[key];const an=AN[key];const g=new T.Group();R.scene.add(g);const ups=[];
 const eq=R.M(0x2f2c3b,{roughness:.4,metalness:.4}),eq2=R.M(0xa5a1b8,{roughness:.35,metalness:.6}),pad=R.M(0x26232f,{roughness:.8});
 const sh=m=>{m.castShadow=true;m.receiveShadow=true;g.add(m);return m};
 const cylBetween=(m,a,b)=>{const d=new T.Vector3().subVectors(b,a),L=d.length()||.01;m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());m.scale.set(1,L,1)};
 for(const q of an.p||[]){
  if(q.k==='plate'){const bar=sh(new T.Mesh(new T.CylinderGeometry(1.1,1.1,78,12),eq2));bar.rotation.x=Math.PI/2;const ps=[];for(const z of [-31,-27,27,31]){const big=Math.abs(z)>29;const p=sh(new T.Mesh(new T.CylinderGeometry(big?11.5:9,big?11.5:9,3.2,32),big?eq:R.M(0x7a1f2b,{roughness:.6})));p.rotation.x=Math.PI/2;ps.push([p,z])}
   ups.push(J=>{const P=J.BAR?J.BAR.clone():J[q.at].clone();if(!J.BAR){P.x+=(q.dx||0);P.y-=(q.dy||0)}P.z=0;bar.position.copy(P);for(const [p,z] of ps)p.position.set(P.x,P.y,z)})}
  if(q.k==='db'){for(const w of ['W1','W2']){const h=sh(new T.Mesh(new T.CylinderGeometry(1,1,12,10),eq2));h.rotation.x=Math.PI/2;const pl=[-5.2,5.2].map(z=>{const p=sh(new T.Mesh(new T.CylinderGeometry(4.6,4.6,3.6,6),eq));p.rotation.x=Math.PI/2;return [p,z]});
   ups.push(J=>{const P=J[w];h.position.set(P.x,P.y,P.z);for(const [p,z] of pl)p.position.set(P.x,P.y,P.z+z)})}}
  if(q.k==='ball'){const b=sh(new T.Mesh(new T.SphereGeometry(8.5,28,20),R.M(0x5b3fd1,{roughness:.7})));ups.push(J=>{const P=J[q.at];b.position.set(P.x+3,P.y,0)})}
  if(q.k==='wheel'){const w=sh(new T.Mesh(new T.TorusGeometry(5.5,2,14,28),eq));const ax=sh(new T.Mesh(new T.CylinderGeometry(.9,.9,26,8),eq2));ax.rotation.x=Math.PI/2;ups.push(J=>{const P=J[q.at];w.position.set(P.x,Math.max(7.5,P.y),0);ax.position.copy(w.position)})}
  if(q.k==='pad'){const p=sh(new T.Mesh(new T.BoxGeometry(10,6,30),pad));ups.push(J=>{const P=J[q.at];p.position.set(P.x,P.y+7.6,0)})}
  if(q.k==='rings'){const rm=R.M(0x8b5a2b,{roughness:.5});const rs=[],st=[];for(const k of ['W1','W2']){rs.push([sh(new T.Mesh(new T.TorusGeometry(5.2,1.1,12,32),rm)),k]);st.push(sh(new T.Mesh(new T.BoxGeometry(1.6,1,.5),R.M(0x2a2a30,{roughness:.8}))))}
   ups.push((J,an)=>{rs.forEach(([m,k],i)=>{const P=J[k];const sg=k==='W1'?1:-1;const off=an.v==='f'?new T.Vector3(0,0,-sg*0):new T.Vector3(0,0,sg*2.5);m.position.set(P.x,P.y-1.5,P.z).add(off);m.rotation.set(0,an.v==='f'?Math.PI/2:0,0);const top=420;st[i].scale.y=top-P.y-5;st[i].position.set(P.x,(top+P.y+5)/2,P.z).add(off);st[i].userData.noCol=1})})}
  if(q.k==='pommel'){const leather=R.M(0x6b4a2f,{roughness:.65}),wood=R.M(0xd8c49b,{roughness:.5});const body=sh(new T.Mesh(new T.CylinderGeometry(14,14,110,24),leather));body.rotation.x=Math.PI/2;body.scale.set(1,1,.85);
   const pm=[-15,15].map(()=>sh(new T.Mesh(new T.TorusGeometry(5,1.6,10,24,Math.PI),wood)));const legs=[-40,40].map(()=>sh(new T.Mesh(new T.CylinderGeometry(2.4,3.2,1,10),eq)));
   ups.push((J,an)=>{const P=J.WM||J.W1;const top=P.y-11;body.position.set(5,top-12,0);pm.forEach((m,i)=>{m.position.set(0,top,i?15:-15);m.rotation.set(0,Math.PI/2,0)});legs.forEach((l,i)=>{l.scale.y=Math.max(.1,top-24);l.position.set(5,(top-24)/2,i?40:-40)})})}
  if(q.k==='mush'){const leather=R.M(0x6b4a2f,{roughness:.65});const dome=sh(new T.Mesh(new T.CylinderGeometry(19,22,10,32),leather));const stem=sh(new T.Mesh(new T.CylinderGeometry(4,9,1,16),eq));
   ups.push(J=>{const P=J.WM||J.W1;const top=P.y-2;dome.position.set(0,top-5,0);stem.scale.y=Math.max(.1,top-10);stem.position.set(0,(top-10)/2,0)})}
  if(q.k==='board'){const b=sh(new T.Mesh(new T.BoxGeometry(32,4,40),R.M(0xd9d4c8,{roughness:.7})));b.position.set(q.x-120,3,0);b.rotation.z=-.12}
  if(q.k==='vault'){const top=sh(new T.Mesh(new T.CylinderGeometry(30,30,8,32),R.M(0x2e3a8c,{roughness:.6})));top.scale.set(q.w/60,1,1);top.position.set(q.x+q.w/2-120,q.h-4,0);const post=sh(new T.Mesh(new T.CylinderGeometry(4,7,q.h-8,14),eq));post.position.set(q.x+q.w/2-120,(q.h-8)/2,0);const base=sh(new T.Mesh(new T.BoxGeometry(50,3,46),eq));base.position.set(q.x+q.w/2-120,1.5,0)}
  if(q.k==='rope'){const r=sh(new T.Mesh(new T.CylinderGeometry(1.4,1.4,600,10),R.M(0xc9b48a,{roughness:.9})));r.position.set(q.x-120,300,0)}
  if(q.k==='db1'){const h=sh(new T.Mesh(new T.CylinderGeometry(1,1,12,10),eq2));h.rotation.x=Math.PI/2;const pl=[-5.2,5.2].map(z=>{const p=sh(new T.Mesh(new T.CylinderGeometry(4.6,4.6,3.6,6),eq));p.rotation.x=Math.PI/2;return [p,z]});ups.push(J=>{const P=J.W1;h.position.set(P.x,P.y,P.z);for(const [p,z] of pl)p.position.set(P.x,P.y,P.z+z)})}
  if(q.k==='box'){const b=sh(new T.Mesh(new T.BoxGeometry(q.w,q.h,42),R.M(0x8f6440,{roughness:.8})));b.position.set(q.x+q.w/2-120,q.h/2,0)}
  if(q.k==='wall'){const w=sh(new T.Mesh(new T.BoxGeometry(5,220,120),R.M(0xcfcadf,{roughness:1})));w.position.set(q.x-120+2.5,110,0)}
  if(q.k==='cone'){const c=sh(new T.Mesh(new T.ConeGeometry(6,14,24),R.M(0xff7a1a,{roughness:.6})));c.position.set(q.x-120,7,0)}
  if(q.k==='bench'){const top=sh(new T.Mesh(new T.BoxGeometry(1,1,1),pad)),l1=sh(new T.Mesh(new T.BoxGeometry(1,1,1),eq)),l2=sh(new T.Mesh(new T.BoxGeometry(1,1,1),eq));let done=false;
   let fixJ=null;if(q.fix){let best=null;for(let i=0;i<24;i++){const pp=poseAt(an,an.total*i/24);const j2=solveJ(pp,an);j2._p=pp;const jj=to3(an,j2);const lo=Math.min(...q.of.map(k=>jj[k].y-(RAD3[k]||3)));if(!best||lo<best.lo)best={lo,jj}}fixJ=best.jj}
   ups.push((J0,an)=>{if(q.fix&&done)return;done=true;const J=fixJ||J0;const fv=an.v==='f';const H=k=>fv?-J[k].z:J[k].x;const xs=q.of.map(H),ys=q.of.map(k=>J[k].y);let x0=Math.min(...xs)-6,x1=Math.max(...xs)+6;if(q.ext){x0=Math.min(...xs)+q.ext[0];x1=Math.max(...xs)+q.ext[1]}else if(q.w&&x1-x0<q.w){const c=(x0+x1)/2;x0=c-q.w/2;x1=c+q.w/2}const y=Math.max(1,Math.min(...q.of.map(k=>J[k].y-(RAD3[k]||3)))-.2);
    const D=q.d||(fv?40:22);const place=(m,cx,cy,sx,sy,sz)=>{m.scale.set(fv?sz:sx,sy,fv?sx:sz);m.position.set(fv?0:cx,cy,fv?-cx:0)};
    place(top,(x0+x1)/2,y-2,x1-x0,4,D);place(l1,x0+3,(y-4)/2,3,Math.max(.1,y-4),D-6);place(l2,x1-3,(y-4)/2,3,Math.max(.1,y-4),D-6)})}
  if(q.k==='pbar'){const par=q.w===14;const bars=[],posts=[];
   if(par){for(const z of [-12,12])bars.push([sh(new T.Mesh(new T.CylinderGeometry(1.3,1.3,60,10),eq2)),z]);bars.forEach(([b])=>b.rotation.z=Math.PI/2);for(let i=0;i<4;i++)posts.push(sh(new T.Mesh(new T.CylinderGeometry(1.3,1.3,1,8),eq)))}
   else{bars.push([sh(new T.Mesh(new T.CylinderGeometry(1.3,1.3,64,10),eq2)),0]);bars[0][0].rotation.x=Math.PI/2;for(let i=0;i<2;i++)posts.push(sh(new T.Mesh(new T.CylinderGeometry(1.6,1.6,1,8),eq)))}
   ups.push((J,an)=>{const P=Array.isArray(q.at)?(an.v==='f'?new T.Vector3(0,GY-q.at[1],-(q.at[0]-120)):new T.Vector3(q.at[0]-120,GY-q.at[1],0)):J[q.at];for(const [b,z] of bars)b.position.set(P.x,P.y+1,z);
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
 const Y=new T.Vector3(0,1,0);
 for(const s of R.segs){const a=J[s.a],b=J[s.b];const d=_v().subVectors(b,a);const len=d.length()||.01;s.m.position.copy(a);s.m.quaternion.setFromUnitVectors(Y,d.divideScalar(len));s.m.scale.set(1,len,1)}
 for(const o of R.balls)o.m.position.copy(J[o.at]);
 const fv=an.v==='f';
 const up=_v().subVectors(J.S,J.H).normalize();
 let lat=fv?_v().subVectors(J.s2,J.s1).normalize():new T.Vector3(0,0,J._m?-1:1);
 lat.addScaledVector(up,-lat.dot(up)).normalize();const fw=_v().crossVectors(up,lat).normalize();
 // partes del tronco con columna flexible
 const part=(m,a,b,sx,sz)=>{const f=limbFrame(a,b,fw,lat);const len=a.distanceTo(b);m.position.copy(a);
  m.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(_v().crossVectors(f.y,f.z),f.y,f.z));m.scale.set(sz,len,sx);return f};
 const top=J.M.clone().lerp(J.S,1.04);
 const fA=part(R.torso.abs,J.H,J.M,7.6,10.2);const fC=part(R.torso.chest,J.M,top,8,11.4);
 R.torso.pelvis.position.copy(J.H).addScaledVector(up,1.2);R.torso.pelvis.quaternion.copy(R.torso.abs.quaternion);R.torso.pelvis.scale.set(9.6,6.6,7.0);
 const frames={abs:[J.H,J.M,fA],chest:[J.M,top,fC],pelvis:[J.H,J.H,fA]};
 for(const o of R.tmus){const [a,b,f]=frames[o.part];const xa=_v().crossVectors(f.y,f.z);
  const pos=a.clone().lerp(b,o.t).addScaledVector(xa,o.ox).addScaledVector(f.z,o.oz);if(o.part==='pelvis')pos.addScaledVector(f.y,1);
  o.m.position.copy(pos);o.m.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(xa,f.y,f.z));
  const on=act&&act.includes(o.id),k=on?1+.06*pulse:1;o.m.visible=!!on||o.id==='T';o.m.scale.set(o.r[0]*k,o.r[1],o.r[2]*k)}
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
 for(const h of R.hands){const n=h.n;const f=limbFrame(J['E'+n],J['W'+n],ant(n,false),outv[n]);h.g.position.copy(J['W'+n]).addScaledVector(f.y,-.6);h.g.quaternion.copy(f.q);h.g.scale.set(f.sg,1,1);const gp=!!an.grip;h.fist.visible=gp;for(const m of h.open)m.visible=!gp}
 for(const sh of R.shoes){const n=sh.n;const A=J['A'+n],Tt=J['T'+n],K=J['K'+n];const upv=_v().subVectors(K,A).normalize();const f=limbFrame(A,Tt,upv,outv[n]);sh.g.position.copy(A).addScaledVector(f.y,-2);sh.g.quaternion.copy(f.q)}
 // cabeza
 const hu=_v().subVectors(J.N,J.S).normalize();const chestUp=_v().subVectors(J.S,J.M).normalize();
 let fwC=_v().crossVectors(chestUp,lat).normalize();const hf=fv?new T.Vector3(1,0,0):fwC;
 hf.addScaledVector(hu,-hf.dot(hu)).normalize();const hx=_v().crossVectors(hu,hf).normalize();
 R.head.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(hx,hu,hf));R.head.position.copy(J.N).addScaledVector(hu,.2);R.head.scale.setScalar(.9);
}

let R3theme='';
function theme3(){const R=R3,C=dcols();const key=[C.bg2,C.floor,C.mat].join();if(key===R3theme)return;R3theme=key;const T=R.T;
 const col=s=>{try{return new T.Color(s)}catch(e){return new T.Color(0x888888)}};
 R.renderer.setClearColor(col(C.bg2),1);R.scene.fog=new T.Fog(col(C.bg2).convertSRGBToLinear(),300,900);R.floorM.color=col(C.floor).convertSRGBToLinear();R.matM.color=col(C.mat).convertSRGBToLinear();
 const dark=col(C.bg2).getHSL({}).l<.3;R.hemi.intensity=dark?.3:.28;R.rim.intensity=dark?1.2:.9}

function draw3D(cv,key,ms){
 const R=r3init();if(!R)return drawDemo(cv,key,ms);
 const T=R.T,an=AN[key];theme3();
 if(R.renderer.domElement.width!==cv.width||R.renderer.domElement.height!==cv.height){R.renderer.setPixelRatio(1);R.renderer.setSize(cv.width,cv.height,false);R.cam.aspect=cv.width/cv.height;R.cam.updateProjectionMatrix()}
 const p=poseAt(an,ms);const J2=solveJ(p,an);J2._p=p;const J=to3(an,J2);J._m=p.m>0.5;barIK(J,an);
 const act=MU3[key]||[],st=MU[key]&&MU[key].st,pulse=.5+.5*Math.sin(ms/240);
 pose3(J,an,act,pulse);
 const hc=new T.Color(st?0x1f8bff:0xff3b1f).convertSRGBToLinear();
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
