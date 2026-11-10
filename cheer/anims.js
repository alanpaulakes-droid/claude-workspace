/* ===== Demostraciones animadas (figura en bucle) ===== */
const LN={t:40,ua:20,fa:19,th:26,sh:25,ft:8,nk:11};
const PB={x:0,y:0,r:0,m:0,sp:0,yw:0,t:180,h:null,a1:4,e1:4,a2:-4,e2:-4,l1:0,k1:0,l2:-2,k2:-2,f1:null,f2:null};
const am=(a,e,d=3)=>({a1:a,e1:e,a2:a-d,e2:e-d});
const lg=(l,k,d=3)=>({l1:l,k1:k,l2:l-d,k2:k-d});
const UP=am(178,178),DN=am(4,4),FW=am(90,90);
const dirA=a=>{a=a*Math.PI/180;return [Math.sin(a),Math.cos(a)]};
/* front-view helpers: near limb = right side, far = left */
const fa=(a,e)=>({a1:a,e1:e,a2:-a,e2:-e});
const fl=(l,k)=>({l1:l,k1:k,l2:-l,k2:-k});

const TUCK={t:150,h:125,l1:140,k1:-20,l2:137,k2:-23,a1:-60,e1:28,a2:-62,e2:26};
const RUNA={t:170,h:175,l1:55,k1:5,l2:-30,k2:-100,a1:-45,e1:30,a2:50,e2:140};
const RUNB={t:170,h:175,l2:55,k2:5,l1:-30,k1:-100,a2:-45,e2:30,a1:50,e1:140};
const PU_T={t:115,h:110,...am(0,0),l1:-65,k1:-65,l2:-66,k2:-66,f1:5,f2:5};
const PU_B={t:103,h:103,a1:-100,e1:25,a2:-101,e2:24,l1:-77,k1:-77,l2:-78,k2:-78,f1:5,f2:5};
const SQ_T={...am(-30,170),...lg(0,0)};
const SQ_B={t:140,h:155,...am(-70,130),...lg(88,-28)};
const BRIDGE={t:240,sp:42,h:300,a1:355,e1:355,a2:352,e2:352,l1:25,k1:-10,l2:22,k2:-13};
const SPLIT={t:180,l1:90,k1:90,l2:-90,k2:-90,...am(178,178)};

const AN={
 squat:{p:[{k:'plate',at:'S',dx:-7,dy:2}],fr:[[SQ_T,700,300],[SQ_B,900,250]]},
 squatPause:{p:[{k:'plate',at:'S',dx:-7,dy:2}],fr:[[SQ_T,700,300],[SQ_B,900,1300]]},
 rdl:{p:[{k:'plate',at:'W1'}],fr:[[{...DN},800,300],[{t:95,h:110,x:-8,...am(3,3),...lg(14,-2)},1000,300]]},
 bulgarian:{p:[{k:'box',x:58,w:24,h:17},{k:'db'}],fr:[[{l1:12,k1:-2,l2:-35,k2:-69,f2:-100,...DN},700,250],[{x:-14.6,t:172,l1:80,k1:-15,l2:-10,k2:-133,f2:-100,...DN},900,250]]},
 bulgarianBW:{p:[{k:'box',x:58,w:24,h:17}],fr:[[{l1:12,k1:-2,l2:-35,k2:-69,f2:-100,a1:-30,e1:60,a2:-32,e2:58},700,250],[{x:-14.6,t:172,l1:80,k1:-15,l2:-10,k2:-133,f2:-100,a1:-30,e1:60,a2:-32,e2:58},900,250]]},
 hipThrust:{p:[{k:'bench',of:['S'],ext:[-30,-3]},{k:'plate',at:'H',dy:-7}],fr:[[{t:-125,h:-125,l1:125,k1:-5,l2:122,k2:-8,a1:65,e1:72,a2:62,e2:69},800,200],[{t:-95,h:-100,l1:95,k1:0,l2:92,k2:-3,a1:95,e1:102,a2:92,e2:99},700,600]]},
 calf:{p:[{k:'db'}],fr:[[{...DN,f1:90,f2:90},500,200],[{...DN,f1:30,f2:28},500,500]]},
 calfSingle:{fr:[[{...DN,l2:-10,k2:-90,f2:-60,f1:90},500,200],[{...DN,l2:-10,k2:-90,f2:-60,f1:30},500,500]]},
 copenhagen:{v:'f',fwArm:1,bend2:1,p:[{k:'bench',of:['A1'],ext:[-3,20],fix:1}],fr:[[{t:-99,h:-96,a1:178,e1:178,a2:0,e2:-90,l1:115,k1:115,l2:57,k2:57,f1:115,f2:57},1000,300],[{t:-80,h:-80,a1:178,e1:178,a2:0,e2:-90,l1:100,k1:100,l2:22,k2:22,f1:100,f2:22},1000,900]]},
 sidePlank:{v:'f',fwArm:1,fr:[[{t:-82,h:-82,a1:178,e1:178,a2:0,e2:-90,l1:80,k1:80,l2:84,k2:84,f1:80,f2:84},900,500],[{t:-74,h:-74,a1:178,e1:178,a2:4,e2:-86,l1:76,k1:76,l2:80,k2:80,f1:76,f2:80},900,500]]},
 pallof:{p:[{k:'band',at:'W1',to:[30,82]}],fr:[[{...am(20,150)},600,200],[{...am(90,90)},600,900]]},
 ohp:{p:[{k:'plate',at:'W1'}],fr:[[{...am(40,165)},800,250],[{h:175,...UP},800,400]]},
 pushPress:{p:[{k:'plate',at:'W1'}],fr:[[{...am(40,165)},700,300],[{...am(40,165),...lg(18,-14)},350,0],[{...am(130,175),y:3,f1:45,f2:43},250,0],[{h:175,...UP},350,500]]},
 lockout:{p:[{k:'plate',at:'W1'}],fr:[[{...UP,l1:6,k1:4,l2:-6,k2:-6},900,600],[{...am(176,180),l1:6,k1:4,l2:-6,k2:-6,t:178},900,600]]},
 pullup:{p:[{k:'pbar',at:'W1'}],fr:[[{...UP,...lg(12,6),pin:['W1',120,8]},900,250],[{a1:25,e1:175,a2:22,e2:172,...lg(18,10),pin:['W1',120,8]},800,450]]},
 hangHollow:{pt:1,p:[{k:'pbar',at:'W1'}],fr:[[{...UP,t:182,...lg(12,12),pin:['W1',120,6]},900,500],[{...UP,t:186,...lg(22,22),pin:['W1',120,6]},900,500]]},
 dbBench:{p:[{k:'bench',of:['N','H'],ext:[-6,1],d:17},{k:'db'}],fr:[[{t:-90,h:-90,l1:70,k1:0,l2:67,k2:-3,...am(12,172)},800,250],[{t:-90,h:-90,l1:70,k1:0,l2:67,k2:-3,...am(180,180)},800,350]]},
 row:{p:[{k:'plate',at:'W1'}],fr:[[{t:115,h:120,...lg(20,-12),...am(0,0)},700,200],[{t:115,h:120,...lg(20,-12),...am(-80,5)},600,400]]},
 facePull:{p:[{k:'band',at:'W1',to:[220,60]}],fr:[[{...am(90,90),ez:13,wz:7},600,200],[{...am(95,172),ez:28,wz:16},600,600]]},
 dips:{p:[{k:'pbar',at:'W1',w:14}],fr:[[{...am(2,2),...lg(-10,-80),pin:['W1',120,72]},800,250],[{...am(-55,30),...lg(-10,-80),pin:['W1',120,72]},800,300]]},
 farmer:{p:[{k:'db'}],fr:[[{...DN,l1:22,k1:5,l2:-20,k2:-35},450,0],[{...DN,l1:-20,k1:-35,l2:22,k2:5},450,0]]},
 hollow:{pt:1,fr:[[{t:-80,h:-80,...am(-98,-98),...lg(80,80)},1100,400],[{t:-76,h:-76,...am(-96,-96),...lg(77,77)},1100,400]]},
 hollowRock:{pt:1,fr:[[{t:-80,h:-80,...am(-98,-98),...lg(80,80),r:-12},600,0],[{t:-80,h:-80,...am(-98,-98),...lg(80,80),r:12},600,0]]},
 clean:{p:[{k:'plate',at:'W1',dy:3}],fr:[[{...DN},500,200],[{t:150,h:160,...lg(15,-10),...am(0,0)},700,200],[{t:185,y:3,f1:40,f2:38,...am(-5,-5)},220,0],[{t:170,...lg(45,-30),...am(100,265)},250,300],[{...am(100,265)},600,500]]},
 frontSquat:{p:[{k:'plate',at:'W1',dy:3}],fr:[[{...am(100,265)},700,250],[{t:155,h:170,...am(78,243),...lg(90,-30)},900,250]]},
 boxJump:{reset:1,p:[{k:'box',x:158,w:46,h:30}],fr:[[{x:-30,...DN},300,300],[{x:-30,t:150,...lg(45,-30),...am(-60,-40)},500,100],[{x:4,y:58,t:185,...UP,...lg(8,-2),f1:40,f2:38},300,0],[{x:30,y:52,t:160,...TUCK,a1:90,e1:90,a2:88,e2:88},200,0],[{x:42,y:33.5,t:150,...lg(70,-25),...FW},250,200],[{x:42,y:33.5,...DN},500,800]]},
 mbThrow:{p:[{k:'ball',at:'W1'}],fr:[[{t:135,h:150,...lg(40,-25),...am(5,5)},800,200],[{t:200,h:210,y:12,f1:40,f2:38,...am(200,200)},350,600]]},
 invRow:{p:[{k:'pbar',at:'W1'}],fr:[[{t:-110,h:-110,...UP,...lg(70,70),f1:160,f2:160},800,250],[{t:-125,h:-125,a1:40,e1:170,a2:38,e2:168,...lg(55,55),f1:145,f2:145},700,400]]},
 wheel:{p:[{k:'wheel',at:'W1'}],fr:[[{t:115,h:120,...am(12,12),l1:0,k1:-90,l2:-2,k2:-92,f1:-90,f2:-92},900,250],[{t:95,h:100,...am(83,83),l1:60,k1:-90,l2:58,k2:-92,f1:-90,f2:-92},1000,300]]},
 pistol:{fr:[[{...FW,l1:0,k1:0,l2:55,k2:55},900,250],[{t:135,h:150,...am(95,95),l1:95,k1:-35,l2:95,k2:95},1000,250]]},
 nordic:{p:[{k:'pad',at:'A1'}],fr:[[{...am(10,10),l1:0,k1:-90,l2:-2,k2:-92,f1:-90,f2:-92},900,200],[{t:125,h:130,...am(100,100),l1:-55,k1:-90,l2:-57,k2:-92,f1:-90,f2:-92},1600,150]]},
 gluteBridge:{fr:[[{t:-90,h:-90,a1:92,e1:90,a2:90,e2:88,l1:125,k1:-20,l2:125,k2:125},800,200],[{t:-68,h:-80,a1:95,e1:92,a2:93,e2:90,l1:110,k1:-10,l2:112,k2:112},700,700]]},
 lungeJump:{fr:[[{l1:80,k1:-5,l2:-25,k2:-100,f2:20,a1:-40,e1:-20,a2:40,e2:60},500,150],[{y:24,l1:20,k1:0,l2:-10,k2:-20,a1:30,e1:50,a2:-30,e2:-10},300,0],[{l2:80,k2:-5,l1:-25,k1:-100,f1:20,a2:-40,e2:-20,a1:40,e1:60},300,150],[{y:24,l2:20,k2:0,l1:-10,k1:-20,a2:30,e2:50,a1:-30,e1:-10},300,0]]},
 pushup:{fr:[[PU_T,700,250],[PU_B,800,250]]},
 pushupPause:{fr:[[PU_T,700,250],[PU_B,800,1300]]},
 pike:{fr:[[{t:55,h:30,...am(40,40),...lg(-12,-12),f1:-20,f2:-20},800,250],[{t:55,h:20,a1:-15,e1:70,a2:-17,e2:68,...lg(-12,-12),f1:-20,f2:-20},800,250]]},
 benchDip:{p:[{k:'bench',of:['W1'],ext:[-24,-1]}],fr:[[{a1:-15,e1:-5,a2:-17,e2:-7,l1:60,k1:60,l2:58,k2:58,f1:180,f2:178},800,200],[{a1:-60,e1:-10,a2:-62,e2:-12,l1:75,k1:75,l2:73,k2:73,f1:180,f2:178},800,250]]},
 bear:{fr:[[{t:95,h:110,...am(0,0),l1:5,k1:-70,l2:3,k2:-72,f1:0,f2:0},400,0],[{t:95,h:110,a1:18,e1:18,a2:-6,e2:-6,l1:-5,k1:-80,l2:18,k2:-60,f1:0,f2:0},400,0],[{t:95,h:110,...am(0,0),l1:5,k1:-70,l2:3,k2:-72,f1:0,f2:0},400,0],[{t:95,h:110,a1:-6,e1:-6,a2:18,e2:18,l1:18,k1:-60,l2:-5,k2:-80,f1:0,f2:0},400,0]]},
 superman:{pt:1,fr:[[{t:93,sp:2,h:98,...am(96,98),...lg(-94,-94)},900,200],[{t:96,sp:12,h:115,...am(112,114),...lg(-102,-102)},900,800]]},
 plank:{fr:[[{t:103,h:105,a1:0,e1:90,a2:-2,e2:88,...lg(-77,-77),f1:5,f2:5},1200,400],[{t:104,h:107,a1:0,e1:90,a2:-2,e2:88,...lg(-78,-78),f1:5,f2:5},1200,400]]},
 handstandWall:{pt:1,p:[{k:'wall',x:132}],fr:[[{t:0,h:0,...am(0,0),...lg(180,180)},1200,400],[{t:2,h:2,...am(1,1),...lg(178,178)},1200,400]]},
 handstand:{pt:1,mat:1,fr:[[{...UP,l1:30,k1:30,l2:-5,k2:-5},500,300],[{t:40,h:30,...am(40,40),l1:0,k1:-10,l2:-170,k2:-170},550,0],[{t:0,h:0,...am(0,0),l1:-180,k1:-180,l2:-180,k2:-180},450,1300],[{t:40,h:30,...am(40,40),l1:-170,k1:-170,l2:0,k2:-10},450,0],[{...UP,l1:-5,k1:-5,l2:30,k2:30},500,400]]},
 toeTouch:{v:'f',pt:1,fr:[[{...fa(5,5),...fl(3,3)},400,200],[{...fa(150,150),...fl(3,3)},300,100],[{...fa(-25,-55),...fl(3,3)},250,0],[{y:55,...fa(95,95),...fl(100,100)},280,120],[{...fa(150,150),...fl(3,3)},280,400]]},
 hurdlerPike:{pt:1,fr:[[{...UP},400,200],[{...am(-40,-30),...lg(35,-25),t:165},300,0],[{y:52,...am(100,100),l1:95,k1:95,l2:-60,k2:-150},280,150],[{...UP},280,350],[{...am(-40,-30),...lg(35,-25),t:165},300,0],[{y:52,t:145,h:130,...am(110,110),l1:95,k1:95,l2:92,k2:92},280,150],[{...UP},280,350]]},
 compression:{pt:1,fr:[[{l1:90,k1:90,l2:88,k2:88,...am(4,4)},700,200],[{t:175,l1:108,k1:108,l2:106,k2:106,...am(4,4)},700,500]]},
 splitR:{pt:1,mat:1,fr:[[{...SPLIT},1200,600],[{t:125,h:115,...am(120,112),l1:90,k1:90,l2:-90,k2:-90},1200,900]]},
 splitL:{pt:1,mat:1,fr:[[{...SPLIT,l1:-90,k1:-90,l2:90,k2:90},1200,600],[{t:125,h:115,...am(120,112),l1:-90,k1:-90,l2:90,k2:90},1200,900]]},
 middle:{v:'f',pt:1,mat:1,fr:[[{...fa(150,150),...fl(90,90)},1100,400],[{t:135,h:120,a1:110,e1:110,a2:-160,e2:150,...fl(90,90)},1100,600],[{...fa(150,150),...fl(90,90)},1100,400],[{t:225,h:240,a1:160,e1:210,a2:-110,e2:-110,...fl(90,90)},1100,600]]},
 bridge:{mat:1,fr:[[{...BRIDGE,a1:345,e1:345,a2:342,e2:342},1000,300],[{...BRIDGE,a1:370,e1:370,a2:367,e2:367,t:244},1000,700]]},
 toBridge:{mat:1,fr:[[{...UP},700,300],[{t:195,sp:20,h:230,a1:215,e1:218,a2:212,e2:215,...lg(18,-8)},900,200],[{...BRIDGE},800,1000],[{t:195,sp:20,h:230,a1:215,e1:218,a2:212,e2:215,...lg(18,-8)},900,200]]},
 heelStretch:{pt:1,p:[{k:'band',at:'W1',to:'T1'}],fr:[[{l1:120,k1:120,...am(130,130),l2:0,k2:0,f2:90},900,200],[{l1:172,k1:172,a1:168,e1:168,a2:-10,e2:-10,l2:0,k2:0,f2:90},900,1200]]},
 scorpion:{pt:1,fr:[[{t:172,sp:-18,h:160,l1:0,k1:0,f1:90,l2:-150,k2:-255,a2:-175,e2:-165,a1:100,e1:105},1200,900],[{t:30,sp:-10,h:20,l1:0,k1:0,f1:90,l2:-178,k2:-180,a1:-5,e1:0,a2:-7,e2:-2},1300,900]]},
 legRaise:{pt:1,fr:[[{a1:-20,e1:60,a2:-22,e2:58,l1:0,k1:0},600,200],[{a1:-20,e1:60,a2:-22,e2:58,l1:100,k1:100},500,800],[{a1:-20,e1:60,a2:-22,e2:58,l1:0,k1:0},500,200],[{a1:-20,e1:60,a2:-22,e2:58,t:170,l1:-55,k1:-55},500,800]]},
 run:{fr:[[RUNA,260,0],[{...RUNB,y:4},260,0]]},
 jog:{fr:[[{...RUNA,l1:35,l2:-20,k2:-70,a1:-30,a2:35},380,0],[{...RUNB,l2:35,l1:-20,k1:-70,a2:-30,a1:35,y:2},380,0]]},
 shuttle:{p:[{k:'cone',x:50},{k:'cone',x:190}],fr:[[{...RUNA,x:-60},220,0],[{...RUNB,x:-25},220,0],[{...RUNA,x:10},220,0],[{...RUNB,x:45},220,0],[{t:150,...lg(60,-30),x:62,a1:60,e1:90,a2:-30,e2:0},220,100],[{...RUNA,x:45,m:1},150,0],[{...RUNB,x:10,m:1},220,0],[{...RUNA,x:-25,m:1},220,0],[{...RUNB,x:-45,m:1},220,0],[{t:150,...lg(60,-30),x:-62,m:1,a1:60,e1:90,a2:-30,e2:0},220,100]]},
 jacks:{v:'f',fr:[[{...fa(5,5),...fl(3,3)},280,0],[{y:6,...fa(165,170),...fl(25,25)},280,0]]},
 pogo:{fr:[[{...am(-15,-15),f1:35,f2:33},170,0],[{...am(-10,-10),y:12,f1:15,f2:13},170,0]]},
 vjump:{fr:[[{...DN},400,300],[{t:150,h:165,...lg(50,-35),...am(-60,-40)},500,80],[{y:45,t:182,...UP,...lg(-2,-4),f1:25,f2:23},300,80],[{t:160,...lg(35,-25),...am(60,60)},300,200],[{...DN},400,400]]},
 broad:{reset:1,fr:[[{x:-50,...DN},300,300],[{x:-50,t:150,h:165,...lg(50,-35),...am(-60,-40)},500,80],[{x:0,y:28,t:155,...lg(70,-20),...am(130,130)},320,0],[{x:45,t:145,...lg(70,-30),...am(80,80)},300,700]]},
 hop:{fr:[[{...am(-10,10),l2:-10,k2:-90,f2:-60},300,150],[{t:165,...am(-40,-20),l1:35,k1:-25,l2:-15,k2:-95,f2:-60},300,50],[{y:20,...am(60,80),l1:5,k1:0,f1:40,l2:-10,k2:-90,f2:-60},250,50],[{t:165,...am(20,40),l1:30,k1:-20,l2:-15,k2:-95,f2:-60},250,250]]},
 tuckJump:{pt:1,fr:[[{...DN},350,250],[{t:150,h:165,...lg(50,-35),...am(-60,-40)},400,50],[{y:30,...UP},200,0],[{y:48,...TUCK,t:175,h:180},200,100],[{y:20,...UP},200,0],[{t:160,...lg(35,-25),...FW},250,400]]},
 vup:{pt:1,fr:[[{t:-90,h:-90,a1:-92,e1:-92,a2:-94,e2:-94,...lg(92,92)},600,200],[{t:-135,h:-135,...am(150,150),...lg(135,135)},500,400]]},
 liberty:{pt:1,fr:[[{l1:0,k1:0,f1:30,l2:80,k2:-60,...am(165,165),r:-2},1000,300],[{l1:0,k1:0,f1:30,l2:80,k2:-60,...am(163,163),r:2},1000,300]]},
 balanceRelevé:{fr:[[{l1:0,k1:0,f1:30,l2:-10,k2:-90,f2:-60,...am(90,90),r:-2},1000,300],[{l1:0,k1:0,f1:30,l2:-10,k2:-90,f2:-60,...am(92,92),r:2},1000,300]]},
 heelArab:{pt:1,fr:[[{l1:0,k1:0,f1:30,l2:170,k2:170,a2:165,e2:165,a1:95,e1:95},900,1000],[{t:170,l1:0,k1:0,f1:30,l2:-105,k2:-105,a1:120,e1:120,a2:110,e2:110},900,1000]]},
 extRot:{v:'f',p:[{k:'band',at:'W1',to:[30,95]}],fr:[[{a1:5,e1:-80,a2:-5,e2:-5,...fl(3,3)},600,150],[{a1:5,e1:80,a2:-5,e2:-5,...fl(3,3)},600,400]]},
 pressZ:{p:[{k:'db'}],fr:[[{l1:90,k1:90,l2:88,k2:88,...am(40,165)},700,200],[{l1:90,k1:90,l2:88,k2:88,...UP},700,350]]},
 rollFwd:{pt:1,mat:1,reset:1,fr:[[{x:-60,...UP},300,300],[{x:-55,t:150,h:120,...lg(110,-25),...FW},400,100],[{x:-40,...TUCK,r:-90},350,0],[{x:-10,...TUCK,r:-180},350,0],[{x:20,...TUCK,r:-270},350,0],[{x:45,t:150,h:150,...lg(110,-25),...FW,r:-360},350,0],[{x:50,...UP,r:-360},400,600]]},
 rolls:{pt:1,mat:1,fr:[[{x:-60,...UP},300,300],[{x:-55,t:150,h:120,...lg(110,-25),...FW},400,100],[{x:-35,...TUCK,r:-120},400,0],[{x:5,...TUCK,r:-250},400,0],[{x:40,t:150,h:150,...lg(110,-25),...FW,r:-360},400,0],[{x:45,...UP,r:-360},400,500],[{x:40,t:150,h:150,...lg(110,-25),...FW,r:-360},400,100],[{x:5,...TUCK,r:-250},400,0],[{x:-35,...TUCK,r:-120},400,0],[{x:-55,t:150,h:120,...lg(110,-25),...FW,r:0},400,0]]},
 cartwheel:{v:'f',pt:1,mat:1,reset:1,fr:[[{x:-75,...fa(165,165),...fl(4,4)},300,300],[{x:-70,...fa(150,150),...fl(30,30)},300,0],[{x:-38,...fa(150,150),...fl(30,30),r:-90},330,0],[{x:0,...fa(150,150),...fl(30,30),r:-180},330,0],[{x:38,...fa(150,150),...fl(30,30),r:-270},330,0],[{x:70,...fa(150,150),...fl(30,30),r:-360},330,0],[{x:75,...fa(165,165),...fl(4,4),r:-360},300,600]]},
 backWalk:{pt:1,mat:1,reset:1,fr:[[{x:40,...UP,l1:40,k1:40,l2:0,k2:0},300,400],[{x:38,t:200,h:220,...am(205,205),l1:40,k1:40,l2:-5,k2:-5,r:30},600,0],[{x:22,t:200,h:220,...am(205,205),l1:50,k1:50,l2:-25,k2:-25,r:110},550,0],[{x:0,t:195,h:215,...am(200,200),l1:50,k1:50,l2:-35,k2:-35,r:180},500,0],[{x:-22,t:195,h:215,...am(200,200),l1:50,k1:50,l2:-35,k2:-35,r:260},500,0],[{x:-38,t:185,...UP,l1:40,k1:40,l2:-20,k2:-20,r:340},500,0],[{x:-40,...UP,l1:40,k1:40,l2:0,k2:0,r:360},400,600]]},
 frontWalk:{pt:1,mat:1,reset:1,fr:[[{x:-40,...UP,l1:30,k1:30,l2:0,k2:0},300,400],[{x:-36,t:160,h:150,...am(165,165),l1:30,k1:30,l2:-40,k2:-40,r:-30},500,0],[{x:-20,t:170,...UP,l1:30,k1:30,l2:-50,k2:-50,r:-110},500,0],[{x:0,t:170,...UP,l1:40,k1:40,l2:-45,k2:-45,r:-180},500,0],[{x:22,t:165,...am(165,165),l1:40,k1:40,l2:-45,k2:-45,r:-260},500,0],[{x:38,t:175,...UP,l1:20,k1:20,l2:-40,k2:-40,r:-340},500,0],[{x:40,...UP,l1:0,k1:0,l2:-30,k2:-30,r:-360},400,600]]},
 bhs:{pt:1,mat:1,reset:1,fr:[[{x:45,...UP},300,400],[{x:48,t:160,h:165,...lg(60,-30),...FW},400,80],[{x:28,y:30,t:200,h:215,...am(205,205),...lg(15,15),r:70},280,0],[{x:15,y:24,t:198,h:212,...am(203,203),...lg(15,15),r:125},140,0],[{x:5,t:195,h:210,...am(200,200),...lg(15,15),r:180},250,0],[{x:-25,t:165,...UP,...lg(25,25),r:300},250,0],[{x:-35,t:170,...UP,...lg(20,-10),r:360},220,600]]},
 frontHs:{pt:1,mat:1,reset:1,fr:[[{x:-45,...UP},300,400],[{x:-40,t:170,...UP,l1:40,k1:40,l2:-10,k2:-10},300,0],[{x:-20,t:180,...UP,...lg(-10,-10),r:-130},250,0],[{x:0,t:190,...UP,...lg(-15,-15),r:-180},250,0],[{x:25,y:26,t:200,h:210,...am(200,200),...lg(-10,-10),r:-280},300,0],[{x:40,t:185,...UP,...lg(10,-5),r:-360},250,600]]},
 backTuck:{pt:1,mat:1,fr:[[{...UP},400,300],[{t:160,h:165,...lg(40,-30),...am(-40,-30)},300,50],[{y:8,t:185,...UP,...lg(-2,-2),f1:30,f2:28},180,0],[{y:50,...TUCK,r:150},220,0],[{y:45,...TUCK,r:290},220,0],[{y:15,...UP,...lg(15,5),r:350},180,0],[{t:165,...lg(40,-30),...am(130,130),r:360},180,300],[{...UP,r:360},400,400]]},
 frontTuck:{pt:1,mat:1,fr:[[{...UP},400,300],[{t:160,h:165,...lg(40,-30),...am(178,178)},300,50],[{y:12,t:175,...am(100,100),...lg(-2,-2),f1:30,f2:28},180,0],[{y:50,...TUCK,r:-150},220,0],[{y:45,...TUCK,r:-290},220,0],[{y:15,...UP,...lg(15,5),r:-350},180,0],[{t:165,...lg(40,-30),...am(130,130),r:-360},180,300],[{...UP,r:-360},400,400]]}
};

/* ---- animaciones adicionales: variantes y aparatos de artística ---- */
const PIN=(x,y,j)=>({pin:[j||'W1',x,y]});
const HANG=(r)=>({t:180,h:180,...lg(4,4),a1:178-r,e1:178-r,a2:176-r,e2:176-r,r});
Object.assign(AN,{
 rdlSingle:{p:[{k:'db'}],fr:[[{...DN,l1:0,k1:0,l2:-2,k2:-4},700,200],[{t:95,h:108,x:-6,...am(4,4),l1:10,k1:-4,l2:-85,k2:-85,f2:-60},1000,300]]},
 goodMorning:{p:[{k:'plate',at:'S',dx:-7,dy:2}],fr:[[{...am(-30,170),...lg(0,0)},700,200],[{t:100,h:112,x:-9,...am(-110,90),...lg(12,-4)},1000,300]]},
 walkLunge:{p:[{k:'db'}],fr:[[{...DN},450,100],[{...DN,l1:80,k1:-8,l2:-25,k2:-100,f2:20},550,200],[{...DN},450,100],[{...DN,l2:80,k2:-8,l1:-25,k1:-100,f1:20},550,200]]},
 stepUp:{reset:1,p:[{k:'box',x:128,w:42,h:18},{k:'db'}],fr:[[{x:-25,...DN},300,300],[{x:-14,...DN,l1:95,k1:-20,f1:70},450,0],[{x:-4,...DN,l1:80,k1:-38},300,150],[{x:24,y:21.5,...DN,l2:-30,k2:-60},600,0],[{x:26,y:21.5,...DN},250,500],[{x:22,y:21.5,...DN,l1:-10,k1:-40},300,0],[{x:-4,...DN,l1:80,k1:-38},500,150],[{x:-25,...DN},500,300]]},
 deadbug:{fr:[[{t:-90,h:-90,a1:180,e1:180,a2:178,e2:178,l1:180,k1:90,l2:178,k2:88},500,150],[{t:-90,h:-90,a1:262,e1:262,a2:178,e2:178,l1:180,k1:90,l2:105,k2:105},700,300],[{t:-90,h:-90,a1:180,e1:180,a2:178,e2:178,l1:180,k1:90,l2:178,k2:88},500,150],[{t:-90,h:-90,a1:180,e1:180,a2:260,e2:260,l1:105,k1:105,l2:178,k2:88},700,300]]},
 dbRow:{p:[{k:'bench',of:['W2'],ext:[-14,14]},{k:'db1'}],fr:[[{t:108,h:118,...lg(14,-8),a1:0,e1:0,a2:-8,e2:-8},600,200],[{t:108,h:118,...lg(14,-8),a1:-75,e1:5,a2:-8,e2:-8},600,450]]},
 legRaiseHang:{p:[{k:'pbar',at:[120,8]}],fr:[[{...HANG(0),...PIN(120,8)},800,200],[{...HANG(0),l1:95,k1:95,l2:93,k2:93,t:186,...PIN(120,8)},800,500]]},
 mountain:{fr:[[{...PU_T},180,0],[{...PU_T,l1:25,k1:-70,f1:-30},220,60],[{...PU_T},180,0],[{...PU_T,l2:25,k2:-70,f2:-30},220,60]]},
 planche:{fr:[[{t:96,h:110,a1:-28,e1:-28,a2:-30,e2:-30,l1:62,k1:-98,l2:60,k2:-100,y:3},1100,700],[{t:94,h:108,a1:-34,e1:-34,a2:-36,e2:-36,l1:-86,k1:-86,l2:-88,k2:-88,y:3},1100,900]]},
 flair:{pt:1,yaw:1,reset:1,mat:1,fr:[[{t:118,h:128,a1:-12,e1:-12,a2:-14,e2:-14,l1:-98,k1:-98,l2:-132,k2:-132,yw:0},1000,0],[{t:118,h:128,a1:-12,e1:-12,a2:-14,e2:-14,l1:-98,k1:-98,l2:-132,k2:-132,yw:360},1000,0]]},
 pancake:{pt:1,mat:1,fr:[[{t:178,h:178,l1:90,k1:90,l2:88,k2:88,...am(170,170)},900,300],[{t:118,h:112,l1:90,k1:90,l2:88,k2:88,...am(108,108)},1100,900]]},
 wrists:{fr:[[{t:96,h:110,a1:-14,e1:-14,a2:-16,e2:-16,l1:0,k1:-90,l2:-2,k2:-92,f1:-90,f2:-92,x:-4},700,200],[{t:96,h:110,a1:16,e1:16,a2:14,e2:14,l1:-14,k1:-90,l2:-16,k2:-92,f1:-90,f2:-92,x:6},700,200]]},
 ropeClimb:{reset:1,p:[{k:'rope',x:122}],fr:[[{...am(170,178),a2:150,e2:180,l1:40,k1:-40,l2:30,k2:-50,y:0},400,0],[{a1:150,e1:180,a2:170,e2:178,l1:30,k1:-50,l2:40,k2:-40,y:14},400,0],[{...am(170,178),a2:150,e2:180,l1:40,k1:-40,l2:30,k2:-50,y:28},400,0],[{a1:150,e1:180,a2:170,e2:178,l1:30,k1:-50,l2:40,k2:-40,y:42},400,0],[{...am(170,178),a2:150,e2:180,l1:40,k1:-40,l2:30,k2:-50,y:56},400,300]]},
 /* anillas */
 rSupport:{p:[{k:'rings'}],fr:[[{...am(2,2),...lg(4,4),...PIN(120,84)},1200,400],[{...am(-2,-2),...lg(6,6),t:178,...PIN(120,84)},1200,400]]},
 rLsit:{p:[{k:'rings'}],fr:[[{...am(2,2),...lg(4,4),...PIN(120,84)},800,200],[{...am(2,2),t:176,...lg(90,90),...PIN(120,84)},800,1400]]},
 rSkin:{p:[{k:'rings'}],fr:[[{...HANG(0),...PIN(120,8)},700,200],[{t:180,h:180,l1:90,k1:90,l2:88,k2:88,a1:88,e1:88,a2:86,e2:86,r:90,...PIN(120,8)},900,0],[{t:180,h:180,...lg(0,0),a1:-2,e1:-2,a2:-4,e2:-4,r:180,...PIN(120,8)},900,500],[{t:180,h:150,l1:40,k1:40,l2:38,k2:38,a1:-142,e1:-142,a2:-144,e2:-144,r:320,...PIN(120,8)},1000,700]]},
 rSwing:{p:[{k:'rings'}],fr:[[{...HANG(40),t:184,...lg(14,14),...PIN(120,8)},750,0],[{...HANG(-40),t:172,...lg(-12,-12),...PIN(120,8)},750,0]]},
 rMuscleUp:{p:[{k:'rings'}],fr:[[{...HANG(0),...PIN(120,10)},700,200],[{a1:25,e1:175,a2:22,e2:172,...lg(16,10),...PIN(120,10)},800,100],[{...am(-55,30),...lg(8,6),...PIN(120,10)},450,100],[{...am(2,2),...lg(4,4),...PIN(120,10)},600,700]]},
 rBackLever:{p:[{k:'rings'}],fr:[[{t:0,h:0,a1:180,e1:180,a2:178,e2:178,...lg(180,180),...PIN(120,30)},900,300],[{t:90,h:96,a1:247,e1:247,a2:245,e2:245,...lg(270,270),...PIN(120,30)},1200,1200]]},
 rFrontLever:{p:[{k:'rings'}],fr:[[{...HANG(0),...PIN(120,8)},700,200],[{t:270,h:262,a1:178,e1:178,a2:176,e2:176,l1:170,k1:50,l2:168,k2:48,...PIN(120,8)},900,500],[{t:270,h:262,a1:178,e1:178,a2:176,e2:176,...lg(90,90),...PIN(120,8)},700,1100]]},
 hFrontLever:{p:[{k:'pbar',at:[120,8]}],fr:[[{...HANG(0),...PIN(120,8)},700,200],[{t:270,h:262,a1:178,e1:178,a2:176,e2:176,l1:170,k1:50,l2:168,k2:48,...PIN(120,8)},900,500],[{t:270,h:262,a1:178,e1:178,a2:176,e2:176,...lg(90,90),...PIN(120,8)},700,1100]]},
 rCross:{v:'f',p:[{k:'rings'}],fr:[[{...fa(4,4),...fl(3,3),pin:['WM',120,48]},900,400],[{...fa(90,90),...fl(3,3),pin:['WM',120,48]},1500,1300]]},
 rPlanche:{p:[{k:'rings'}],fr:[[{t:96,h:110,a1:-28,e1:-28,a2:-30,e2:-30,l1:-5,k1:-135,l2:-7,k2:-137,...PIN(120,92)},1000,600],[{t:94,h:108,a1:-34,e1:-34,a2:-36,e2:-36,...lg(-86,-86),...PIN(120,92)},1100,1000]]},
 /* barra fija */
 hSwing:{p:[{k:'pbar',at:[120,8]}],fr:[[{...HANG(42),t:184,...lg(14,14),...PIN(120,8)},700,0],[{...HANG(-42),t:172,...lg(-12,-12),...PIN(120,8)},700,0]]},
 hKip:{p:[{k:'pbar',at:[120,12]}],fr:[[{...HANG(-30),t:172,...lg(-8,-8),...PIN(120,12)},600,0],[{...HANG(35),t:184,...lg(14,14),...PIN(120,12)},600,0],[{t:184,h:184,l1:150,k1:150,l2:148,k2:148,a1:158,e1:158,a2:156,e2:156,r:20,...PIN(120,12)},400,100],[{t:174,h:176,...am(5,5),...lg(8,8),...PIN(120,12)},450,700]]},
 hHipCircle:{reset:1,p:[{k:'pbar',at:[120,60]}],fr:[[{t:172,h:176,...am(8,8),...lg(6,6),r:0,...PIN(120,60)},400,500],[{t:172,h:176,...am(8,8),...lg(26,26),r:120,...PIN(120,60)},450,0],[{t:172,h:176,...am(8,8),...lg(26,26),r:240,...PIN(120,60)},450,0],[{t:172,h:176,...am(8,8),...lg(6,6),r:360,...PIN(120,60)},450,600]]},
 hCast:{p:[{k:'pbar',at:[120,60]}],fr:[[{t:172,h:176,...am(8,8),...lg(6,6),...PIN(120,60)},600,300],[{t:92,h:100,...am(-14,-14),...lg(-88,-88),...PIN(120,60)},500,300],[{t:172,h:176,...am(8,8),...lg(6,6),...PIN(120,60)},500,400]]},
 hCastHS:{p:[{k:'pbar',at:[120,60]}],fr:[[{t:172,h:176,...am(8,8),...lg(6,6),...PIN(120,60)},600,300],[{t:92,h:100,...am(-14,-14),...lg(-88,-88),...PIN(120,60)},450,0],[{t:0,h:0,...am(0,0),...lg(-180,-180),...PIN(120,60)},600,900],[{t:172,h:176,...am(8,8),...lg(6,6),...PIN(120,60)},800,300]]},
 hGiant:{reset:1,pt:1,p:[{k:'pbar',at:[120,6]}],fr:[[{t:0,h:0,...am(0,0),...lg(180,180),r:0,...PIN(120,6)},350,200],[{t:0,h:0,...am(0,0),...lg(180,180),r:90,...PIN(120,6)},350,0],[{t:-6,h:-6,...am(0,0),...lg(192,192),r:180,...PIN(120,6)},350,0],[{t:6,h:6,...am(0,0),...lg(168,168),r:270,...PIN(120,6)},350,0],[{t:0,h:0,...am(0,0),...lg(180,180),r:360,...PIN(120,6)},350,200]]},
 hGiantF:{reset:1,pt:1,p:[{k:'pbar',at:[120,6]}],fr:[[{t:0,h:0,...am(0,0),...lg(180,180),r:0,...PIN(120,6)},350,200],[{t:0,h:0,...am(0,0),...lg(180,180),r:-90,...PIN(120,6)},350,0],[{t:6,h:6,...am(0,0),...lg(168,168),r:-180,...PIN(120,6)},350,0],[{t:-6,h:-6,...am(0,0),...lg(192,192),r:-270,...PIN(120,6)},350,0],[{t:0,h:0,...am(0,0),...lg(180,180),r:-360,...PIN(120,6)},350,200]]},
 hStalder:{reset:1,pt:1,p:[{k:'pbar',at:[120,40]}],fr:[[{t:0,h:0,...am(0,0),...lg(180,180),r:0,...PIN(120,40)},350,200],[{t:0,h:0,...am(0,0),...lg(280,280),r:90,...PIN(120,40)},400,0],[{t:0,h:0,...am(0,0),...lg(262,262),r:180,...PIN(120,40)},400,0],[{t:0,h:0,...am(0,0),...lg(300,300),r:270,...PIN(120,40)},400,0],[{t:0,h:0,...am(0,0),...lg(360,360),r:360,...PIN(120,40)},400,300]]},
 hHandstand:{pt:1,p:[{k:'pbar',at:[120,60]}],fr:[[{t:0,h:0,...am(0,0),...lg(180,180),r:-3,...PIN(120,60)},1000,300],[{t:0,h:0,...am(0,0),...lg(180,180),r:3,...PIN(120,60)},1000,300]]},
 /* paralelas */
 pSupport:{p:[{k:'pbar',at:[120,86],w:14}],fr:[[{...am(2,2),...lg(4,4),...PIN(120,86)},900,300],[{...am(2,2),l1:30,k1:-20,l2:-2,k2:-2,...PIN(120,86)},500,200],[{...am(2,2),...lg(4,4),...PIN(120,86)},500,200],[{...am(2,2),l2:30,k2:-20,l1:-2,k1:-2,...PIN(120,86)},500,200]]},
 pSwing:{p:[{k:'pbar',at:[120,86],w:14}],fr:[[{t:182,h:182,...lg(14,14),a1:-45,e1:-45,a2:-47,e2:-47,r:45,...PIN(120,86)},750,0],[{t:176,h:176,...lg(-10,-10),a1:65,e1:65,a2:63,e2:63,r:-65,...PIN(120,86)},750,0]]},
 pLsit:{p:[{k:'pbar',at:[120,86],w:14}],fr:[[{...am(2,2),...lg(4,4),...PIN(120,86)},800,200],[{...am(2,2),t:176,...lg(90,90),...PIN(120,86)},800,1400]]},
 pUpperArm:{p:[{k:'pbar',at:[120,44],w:14}],fr:[[{t:182,h:182,...lg(12,12),a1:50,e1:50,a2:48,e2:48,r:40,...PIN(120,44,'E1')},750,0],[{t:176,h:176,...lg(-10,-10),a1:130,e1:130,a2:128,e2:128,r:-40,...PIN(120,44,'E1')},750,0]]},
 pHandstand:{pt:1,p:[{k:'pbar',at:[120,86],w:14}],fr:[[{t:180,h:180,...lg(4,4),...am(0,0),r:0,...PIN(120,86)},500,100],[{t:178,h:178,...lg(-8,-8),a1:70,e1:70,a2:68,e2:68,r:-70,...PIN(120,86)},500,0],[{t:180,h:180,...lg(0,0),a1:180,e1:180,a2:178,e2:178,r:-180,...PIN(120,86)},600,1100],[{t:178,h:178,...lg(-8,-8),a1:70,e1:70,a2:68,e2:68,r:-70,...PIN(120,86)},600,0],[{t:182,h:182,...lg(12,12),a1:-40,e1:-40,a2:-42,e2:-42,r:40,...PIN(120,86)},500,0]]},
 pShoulderStand:{pt:1,p:[{k:'pbar',at:[120,44],w:14}],fr:[[{t:180,h:180,...lg(4,4),...am(90,90),...PIN(120,44,'E1')},700,300],[{t:90,h:95,...lg(-90,-90),...am(90,90),...PIN(120,44,'E1')},600,0],[{t:0,h:0,...lg(-180,-180),...am(90,90),...PIN(120,44,'E1')},600,1200]]},
 /* caballo con arcos */
 phSupport:{v:'f',p:[{k:'pommel'}],fr:[[{...fa(4,4),...fl(3,3),pin:['WM',120,90]},900,400],[{...fa(4,4),...fl(3,3),t:182,pin:['WM',120,90]},900,400]]},
 phPendulum:{v:'f',p:[{k:'pommel'}],fr:[[{t:166,h:170,...fa(4,4),l1:38,k1:38,l2:32,k2:32,pin:['WM',120,90]},700,100],[{t:194,h:190,...fa(4,4),l1:-32,k1:-32,l2:-38,k2:-38,pin:['WM',120,90]},700,100]]},
 phScissors:{v:'f',p:[{k:'pommel'}],fr:[[{t:166,h:170,...fa(4,4),l1:75,k1:75,l2:-8,k2:-8,pin:['WM',120,90]},600,100],[{t:194,h:190,...fa(4,4),l1:8,k1:8,l2:-75,k2:-75,pin:['WM',120,90]},600,100]]},
 phCircles:{yaw:1,p:[{k:'pommel'}],reset:1,fr:[[{t:128,h:140,...am(-10,-10),...lg(-52,-52),yw:0,...PIN(120,90)},1100,0],[{t:128,h:140,...am(-10,-10),...lg(-52,-52),yw:360,...PIN(120,90)},1100,0]]},
 phMushroom:{yaw:1,p:[{k:'mush'}],reset:1,fr:[[{t:128,h:140,...am(-10,-10),...lg(-52,-52),yw:0,...PIN(120,104)},1100,0],[{t:128,h:140,...am(-10,-10),...lg(-52,-52),yw:360,...PIN(120,104)},1100,0]]},
 phFlair:{yaw:1,p:[{k:'pommel'}],reset:1,fr:[[{t:128,h:140,...am(-10,-10),l1:-20,k1:-20,l2:-84,k2:-84,yw:0,...PIN(120,90)},1100,0],[{t:128,h:140,...am(-10,-10),l1:-20,k1:-20,l2:-84,k2:-84,yw:360,...PIN(120,90)},1100,0]]},
 /* salto */
 vRun:{reset:1,p:[{k:'board',x:150}],fr:[[{...RUNA,x:-80},220,0],[{...RUNB,x:-55},220,0],[{...RUNA,x:-30},220,0],[{...RUNB,x:-5},220,0],[{x:14,y:12,t:172,...am(-50,-30),...lg(25,10)},260,0],[{x:34,y:8,t:168,...am(-20,-10),...lg(14,-6)},180,60],[{x:46,y:40,t:182,...UP,...lg(-2,-2),f1:30,f2:28},300,500]]},
 vHandspring:{reset:1,pt:1,p:[{k:'board',x:96},{k:'vault',x:134,w:54,h:86}],fr:[[{...RUNA,x:-75},220,0],[{...RUNB,x:-50},220,0],[{x:-25,y:9,t:168,...am(-20,-10),...lg(14,-6)},220,60],[{x:10,y:72,t:150,h:150,...am(150,150),...lg(-8,-8),r:-50},280,0],[{x:40,y:86,t:180,...UP,...lg(-2,-2),r:-180},230,40],[{x:80,y:100,t:186,...UP,...lg(4,4),r:-270},300,0],[{x:112,y:0,t:160,...lg(45,-30),...am(140,140),r:-360},300,500]]},
});

const ANAME={
 'Salto al cajón':'boxJump','Sentadilla trasera':'squat','Sentadilla con pausa':'squatPause','Peso muerto rumano':'rdl','Sentadilla búlgara':'bulgarian','Sentadilla búlgara (mochila con peso)':'bulgarianBW','Hip thrust':'hipThrust',
 'Elevación de talones de pie':'calf','Elevación de talones a una pierna':'calfSingle','Elevación de talones a una pierna en escalón':'calfSingle','Plancha Copenhague':'copenhagen','Pallof press':'pallof',
 'Press militar de pie':'ohp','Push press':'pushPress','Dominadas':'pullup','Dominadas o remo invertido':'pullup','Press banca con mancuernas':'dbBench','Remo con barra':'row','Face pull':'facePull','Fondos en paralelas':'dips',
 'Farmer walk':'farmer','Farmer walk pesado':'farmer','Hollow hold':'hollow','Hang power clean':'clean','Sentadilla frontal':'frontSquat','Lanzamiento de balón medicinal sobre la cabeza':'mbThrow','Remo invertido':'invRow','Rueda abdominal':'wheel',
 'Sentadilla pistol (progresión)':'pistol','Nordic curl':'nordic','Puente de glúteo a una pierna':'gluteBridge','Zancada con salto alternada':'lungeJump','Plancha lateral':'sidePlank',
 'Flexiones (progresión: normales → declinadas → arquero)':'pushup','Flexiones con pausa abajo':'pushupPause','Flexiones pike / parada de manos contra pared':'pike','Fondos en banco':'benchDip','Caminata de oso':'bear','Superman / arch hold':'superman','Arch hold':'superman',
 'Parada de manos contra pared':'handstandWall','Parada de manos contra pared (hold)':'handstandWall','Toe touch':'toeTouch','Toe touch repetidos':'toeTouch','Hurdler y pike':'hurdlerPike','Compresión: elevación de piernas sentado':'compression','Hollow rocks':'hollowRock',
 'Split frontal derecho':'splitR','Split frontal izquierdo':'splitL','Split lateral (middle split)':'middle','Puente (bridge)':'bridge','Heel stretch con banda':'heelStretch','Scorpion / needle':'scorpion','Elevación activa de pierna (frente/lado)':'legRaise',
 'Sprints':'run','Shuttle 5-10-5':'shuttle','Bloque de resistencia específica':'jacks','Trote suave zona 2':'jog','Plancha frontal':'plank',
 'Pogo jumps (saltos de tobillo)':'pogo','Salto vertical con contramovimiento':'vjump','Salto de longitud':'broad','Saltos a una pierna':'hop','Tuck jumps':'tuckJump','V-ups':'vup',
 'Liberty en relevé (equilibrio)':'liberty','Heel stretch / arabesque en equilibrio':'heelArab','Equilibrio en relevé a una pierna':'balanceRelevé','Hollow en barra (body tight)':'hangHollow','Lockout overhead con barra':'lockout','Rotación externa con banda':'extRot','Press Z sentado (mancuernas)':'pressZ'
};
Object.assign(ANAME,{
 'Peso muerto rumano a una pierna':'rdlSingle','Good morning':'goodMorning','Zancada caminando con mancuernas':'walkLunge','Step-up al cajón con mancuernas':'stepUp','Dead bug':'deadbug','Remo con mancuerna a una mano':'dbRow','Elevación de piernas colgado':'legRaiseHang','Mountain climbers':'mountain','Dominadas supinas (chin-up)':'pullup','Saltos de tijera (jumping jacks)':'jacks',
 'Escuadra (L-sit) en paralelas':'pLsit','Trepa de cuerda con piernas':'ropeClimb','Trepa de cuerda sin piernas':'ropeClimb','Parada de manos libre':'handstand','Front lever agrupado':'hFrontLever','Back lever agrupado':'rBackLever','Plancha agrupada':'planche','Muscle-up':'rMuscleUp','Press a parada piernas abiertas':'handstand','Front lever piernas abiertas':'hFrontLever','Plancha agrupada avanzada':'planche','Back lever extendido':'rBackLever','Cruz con banda':'rCross','Flexiones en parada de manos libre':'handstand','Plancha completa':'planche','Front lever completo':'hFrontLever','Maltesa con banda':'rPlanche','Cruz libre':'rCross','Manna (progresión)':'pLsit',
 'German hang (hombros)':'rSkin','Pancake (piernas abiertas sentado)':'pancake','Muñecas: apoyos en 4 direcciones':'wrists'});
/* elementos de artística → animación */
const MAGANIM={s1:'rolls',s2:'handstand',s3:'cartwheel',s4:'frontHs',s5:'frontHs',s6:'bhs',s7:'backTuck',s8:'frontTuck',s9:'backTuck',s10:'backTuck',s11:'frontTuck',s12:'handstand',s13:'flair',s14:'backTuck',s15:'backTuck',
 h1:'phSupport',h2:'phPendulum',h3:'phScissors',h4:'phPendulum',h5:'phScissors',h6:'phMushroom',h7:'phCircles',h8:'phCircles',h9:'phScissors',h10:'phMushroom',h11:'phCircles',h12:'phFlair',
 r1:'rSupport',r2:'rSkin',r3:'rSwing',r4:'rLsit',r5:'rMuscleUp',r6:'rBackLever',r7:'rFrontLever',r8:'rSupport',r9:'rSwing',r10:'rSwing',r11:'rCross',r12:'rSupport',r13:'rPlanche',r14:'rSwing',
 v1:'vRun',v2:'vHandspring',v3:'vHandspring',v4:'vHandspring',v5:'vHandspring',v6:'vHandspring',v7:'vHandspring',v8:'vHandspring',v9:'vHandspring',
 p1:'pSupport',p2:'pSwing',p3:'pLsit',p4:'pUpperArm',p5:'pUpperArm',p6:'pShoulderStand',p7:'pHandstand',p8:'pSwing',p9:'pSwing',p10:'pSwing',p11:'pHandstand',p12:'pSwing',
 b1:'hSwing',b2:'hSwing',b3:'hHipCircle',b4:'hKip',b5:'hCast',b6:'hCastHS',b7:'hGiant',b8:'hGiantF',b9:'hGiant',b10:'hStalder',b11:'hHandstand',b12:'hGiant',b13:'hGiant'};

function animKey(n){
 if(ANAME[n])return ANAME[n];const s=n.toLowerCase();
 const R=[['revisión de video',null],['rol adelante','rolls'],['toe touch','toeTouch'],['puente con patada','backWalk'],['bajada a puente','toBridge'],['back walkover','backWalk'],['front walkover','frontWalk'],
  ['barani','frontTuck'],['paloma','frontHs'],['kip de cabeza','frontHs'],['mortal adelante','frontTuck'],['flick adelante','frontHs'],['mortal','backTuck'],['standing tuck','backTuck'],['flick','bhs'],['flic','bhs'],['full','backTuck'],['doble mortal','backTuck'],['rueda','cartwheel'],['rondada','cartwheel'],['parada','handstand'],
  ['pases','bhs'],['consistencia','bhs'],['combinación','toeTouch'],['simulación','bhs'],['técnica libre','cartwheel']];
 for(const [k,v] of R)if(s.includes(k))return v;return null}

const Z3={squat:{E:21,W:25},squatPause:{E:21,W:25},pullup:{E:20,W:22},hangHollow:{E:16,W:20},ohp:{E:16,W:15},pushPress:{E:16,W:15},lockout:{E:18,W:20},row:{E:14,W:13},invRow:{E:18,W:19},pushup:{E:15,W:15},pushupPause:{E:15,W:15},pike:{E:14,W:14},dips:{E:12,W:12},clean:{E:14,W:13},frontSquat:{E:14,W:13},dbBench:{E:17,W:15},wheel:{E:10,W:8},benchDip:{E:12,W:11}};for(const k in Z3)AN[k].z3=Z3[k];
for(const k of ['squat','squatPause','rdl','row','clean','frontSquat','ohp','pushPress','lockout'])AN[k].cam=[0.78,0.2,0.6];
const BAR3={squat:{t:'back',g:24},squatPause:{t:'back',g:24},frontSquat:{t:'front',g:15},hipThrust:{t:'hip',g:21},rdl:{t:'hands',g:21},row:{t:'hands',g:21},clean:{t:'hands',g:19},ohp:{t:'hands',g:19},pushPress:{t:'hands',g:19},lockout:{t:'hands',g:24}};
for(const k in BAR3)AN[k].bar=BAR3[k];
for(const k of ['dbRow','legRaiseHang','rSupport','rLsit','rSkin','rSwing','rMuscleUp','rBackLever','rFrontLever','hFrontLever','rCross','rPlanche','hSwing','hKip','hHipCircle','hCast','hCastHS','hGiant','hGiantF','hStalder','hHandstand','pSupport','pSwing','pLsit','pHandstand','phSupport','phPendulum','phScissors','phCircles','phMushroom','phFlair','ropeClimb','rdlSingle','walkLunge','stepUp'])AN[k].grip=1;
AN.goodMorning.bar={t:'back',g:24};AN.goodMorning.grip=1;
for(const k of ['squat','squatPause','frontSquat','clean','rdl','row','ohp','pushPress','lockout','hipThrust','dbBench','farmer','calf','bulgarian','pressZ','pullup','hangHollow','dips','invRow','wheel','facePull','pallof','extRot','heelStretch','mbThrow'])AN[k].grip=1;
for(const k of ['phSupport','phPendulum','phScissors'])AN[k].cam=[0.7,0.5,0.5];
AN.copenhagen.cam=[0.8,0.38,0.46];AN.sidePlank.cam=[0.8,0.32,0.5];AN.hipThrust.cam=[0.12,0.6,0.79];AN.handstandWall.cam=[0.05,0.22,1];AN.facePull.cam=[0.55,0.25,0.8];
/* preparar frames */
for(const k in AN){const an=AN[k];an.fr=an.fr.map(([p,mv,hd])=>{const q=Object.assign({},PB,p);
 if(q.h==null)q.h=q.t;
 if(q.f1==null)q.f1=(an.pt||an.v==='f')?q.k1:90+q.r*0;
 if(q.f2==null)q.f2=(an.pt||an.v==='f')?q.k2:90;
 return [q,mv,hd]});an.total=an.fr.reduce((a,f)=>a+f[1]+f[2],0)}

function solveJ(p,an){
 const r=p.r,add=(pt,a,l)=>{const d=dirA(a+r);return [pt[0]+d[0]*l,pt[1]+d[1]*l]};
 const fv=an.v==='f';const J={H:[0,0]};
 J.M=add(J.H,p.t,LN.t/2);J.S=add(J.M,p.t+(p.sp||0),LN.t/2);J.N=add(J.S,p.h,LN.nk);
 const tr=(p.t+(p.sp||0)/2+r)*Math.PI/180,pp=[-Math.cos(tr),Math.sin(tr)],off=(pt,w)=>fv?[pt[0]+pp[0]*w,pt[1]+pp[1]*w]:pt;
 J.s1=off(J.S,9);J.s2=off(J.S,-9);J.p1=off(J.H,5);J.p2=off(J.H,-5);
 J.E1=add(J.s1,p.a1,LN.ua);J.W1=add(J.E1,p.e1,LN.fa);J.E2=add(J.s2,p.a2,LN.ua);J.W2=add(J.E2,p.e2,LN.fa);
 J.K1=add(J.p1,p.l1,LN.th);J.A1=add(J.K1,p.k1,LN.sh);J.K2=add(J.p2,p.l2,LN.th);J.A2=add(J.K2,p.k2,LN.sh);
 const flen=fv?4:LN.ft;J.T1=add(J.A1,p.f1,flen);J.T2=add(J.A2,p.f2,flen);J.WM=[(J.W1[0]+J.W2[0])/2,(J.W1[1]+J.W2[1])/2];
 if(p.m>0.5)for(const k in J)J[k]=[-J[k][0],J[k][1]];
 let dx,dy;
 if(p.pin){const q=J[p.pin[0]];dx=p.pin[1]-q[0];dy=p.pin[2]-q[1]}
 else{let mx=-1e9;for(const k in J){const y=J[k][1]+(k==='N'?7:0);if(y>mx)mx=y}dx=120+p.x;dy=GY-mx-p.y}
 for(const k in J)J[k]=[J[k][0]+dx,J[k][1]+dy];return J}
const GY=150;
const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
function poseAt(an,ms){
 let t=ms%an.total;const n=an.fr.length;
 for(let i=0;i<n;i++){const [q,mv,hd]=an.fr[i];const prev=an.fr[(i-1+n)%n][0];
  if(t<mv){if(i===0&&an.reset)return q;const e=ease(t/mv),o={};for(const k in q){const a=prev[k],b=q[k];
    if(typeof b==='number'&&typeof a==='number')o[k]=a+(b-a)*e;
    else if(Array.isArray(b)&&Array.isArray(a))o[k]=[b[0],a[1]+(b[1]-a[1])*e,a[2]+(b[2]-a[2])*e];else o[k]=b}return o}
  t-=mv;if(t<hd)return q;t-=hd}
 return an.fr[n-1][0]}

/* ---- músculos / foco ---- */
const MU={};
[[['squat','squatPause','frontSquat','pistol','bulgarian','bulgarianBW','lungeJump'],'q g','Cuádriceps · glúteos'],
 [['rdl','nordic'],'q g','Isquiotibiales · glúteos'],[['hipThrust','gluteBridge'],'g q','Glúteos · isquiotibiales'],
 [['calf','calfSingle','pogo'],'c','Pantorrillas · tobillos'],[['copenhagen'],'q b','Aductores · core'],
 [['sidePlank','plank','hollow','hollowRock','pallof','vup','compression','wheel','bear'],'b','Core'],
 [['ohp','pushPress','lockout','pressZ','pike'],'a d','Hombros · tríceps'],[['pullup','invRow','row','hangHollow'],'a b','Espalda · bíceps'],
 [['dbBench','pushup','pushupPause','dips','benchDip'],'a d','Pecho · tríceps'],[['facePull','extRot'],'d','Hombro posterior · manguito rotador'],
 [['farmer'],'f b','Agarre · core'],[['clean','mbThrow','boxJump','vjump','broad','tuckJump','hop'],'q g c','Potencia de piernas'],
 [['superman'],'b g','Espalda baja · glúteos'],[['handstandWall','handstand'],'a d b','Hombros · core'],
 [['toeTouch','hurdlerPike'],'q b','Flexores de cadera · técnica de salto'],
 [['splitR','splitL','heelStretch','legRaise'],'q','Isquiotibiales · flexores de cadera',1],[['middle'],'q','Aductores · cadera',1],
 [['bridge','toBridge','scorpion'],'b d','Espalda · hombros · cadera',1],
 [['run','jog','shuttle','jacks'],'q c','Resistencia · velocidad'],[['liberty','balanceRelevé','heelArab'],'c b','Equilibrio · tobillo · core'],
 [['rdlSingle','goodMorning'],'q g','Isquiotibiales · glúteos'],[['walkLunge','stepUp'],'q g','Cuádriceps · glúteos'],[['deadbug','mountain','legRaiseHang','hFrontLever','rFrontLever'],'b','Core · dorsales'],[['dbRow','ropeClimb','rMuscleUp','hKip','hSwing','rSwing','hHipCircle'],'a b','Espalda · bíceps · agarre'],[['planche','rPlanche','rCross','rSupport','rBackLever','pSupport','pSwing','pHandstand','phSupport','phPendulum','phScissors','phCircles','phMushroom','phFlair','hCast','hCastHS','hGiant','hGiantF','hStalder','hHandstand','pUpperArm','pShoulderStand','flair'],'a d b','Hombros · core · tríceps'],[['rLsit','pLsit'],'b','Core · flexores de cadera'],[['vRun','vHandspring'],'q c d','Potencia de piernas · bloqueo de hombros'],[['pancake'],'q','Aductores · isquios',1],[['rSkin'],'d','Hombros (movilidad)',1],[['wrists'],'f','Muñecas y antebrazos'],
 [['rolls','rollFwd','cartwheel','backWalk','frontWalk','bhs','frontHs','backTuck','frontTuck'],'a b','Técnica de tumbling']
].forEach(([ks,c,l,st])=>ks.forEach(k=>MU[k]={c:c.split(' '),l,st:!!st}));
function demoHTML(n,ak){const k=ak||animKey(n);if(!k||!AN[k])return '';const m=MU[k];
 return `<figure class="demo-w"><canvas class="demo" data-a="${k}" role="img" aria-label="Demostración animada: ${n}"></canvas><figcaption>${m?`<span class="mu ${m.st?'st':''}">${m.st?'Estira':'Trabaja'}: ${m.l}</span>`:''}<span class="slow">Toca: lento · Arrastra: girar</span></figcaption></figure>`}

const NOGHOST=new Set(['run','jog','farmer','jacks','pogo','bear','lungeJump','hollowRock','liberty','balanceRelevé','plank','hollow','superman','sidePlank','copenhagen','lockout','handstandWall','hangHollow','splitR','splitL','middle','bridge','heelArab']);
/* ---- encuadre automático ---- */
function fitOf(key){const an=AN[key];if(an._fit)return an._fit;
 let x0=1e9,x1=-1e9,y0=1e9;const N=60;
 for(let i=0;i<N;i++){const J=solveJ(poseAt(an,an.total*i/N),an);for(const k in J){const [x,y]=J[k],r=k==='N'?10:6;x0=Math.min(x0,x-r);x1=Math.max(x1,x+r);y0=Math.min(y0,y-r)}}
 for(const q of an.p||[]){if(q.k==='box'){x0=Math.min(x0,q.x);x1=Math.max(x1,q.x+q.w);y0=Math.min(y0,GY-q.h)}if(q.k==='wall'){x1=Math.max(x1,q.x+6)}if(q.k==='cone'){x0=Math.min(x0,q.x-8);x1=Math.max(x1,q.x+8)}
  if(q.k==='band'&&Array.isArray(q.to)){x0=Math.min(x0,q.to[0]-4);x1=Math.max(x1,q.to[0]+4);y0=Math.min(y0,q.to[1]-8)}if(q.k==='pbar'){y0=Math.min(y0,0)}}
 const W=240,H=180,pad=12,fy=158;const bw=Math.max(60,x1-x0),bh=Math.max(60,GY-y0);
 const s=Math.min((W-2*pad)/bw,(fy-pad)/bh,2.3);const cx=(x0+x1)/2;
 return an._fit={s,tx:W/2-cx*s,ty:fy-GY*s}}

let DCOL=null,DCOLt=0;
function dcols(){const now=Date.now();if(!DCOL||now-DCOLt>1500){const cs=getComputedStyle(document.documentElement),g=(v,d)=>cs.getPropertyValue(v).trim()||d;
 DCOL={ink:g('--ink','#222'),line:g('--line','#ddd'),acc:g('--acc','#e0245e'),acc2:g('--acc2','#7c3aed'),bg:g('--card','#fff'),bg2:g('--card2','#eee'),
  skin:g('--skin','#e7b08c'),skin2:g('--skin2','#c98e6b'),hair:g('--hair','#3a2418'),top:g('--top','#e0245e'),top2:g('--top2','#a81a47'),short:g('--short','#2d2748'),short2:g('--short2','#1d1832'),shoe:g('--shoe','#f5f5fa'),shoe2:g('--shoe2','#c9c7d6'),hl:g('--hl','#ff7a1a'),stc:g('--stc','#2f9bff'),floor:g('--floor','#e9e6f2'),mat:g('--mat','#3f6fd8'),equip:g('--equip','#55506e'),equip2:g('--equip2','#8b86a3')};DCOLt=now}return DCOL}

function cap(ctx,a,b,r1,r2){const dx=b[0]-a[0],dy=b[1]-a[1],an=Math.atan2(dy,dx),h=Math.PI/2;ctx.beginPath();ctx.arc(a[0],a[1],r1,an+h,an-h);ctx.arc(b[0],b[1],r2,an-h,an+h);ctx.closePath();ctx.fill()}
const lerpP=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];

function drawFigure(ctx,J,an,C,ghost,mu,pulse){
 const fv=an.v==='f',sh=!ghost&&!fv;
 const col=(c,c2,far)=>ghost?ghost:(far&&sh?c2:c);
 const leg=(n,far)=>{const P=n==1?'p1':'p2',K='K'+n,A='A'+n,T='T'+n;
  ctx.fillStyle=col(C.skin,C.skin2,far);cap(ctx,J[P],J[K],6.2,4.6);cap(ctx,J[K],J[A],4.6,3);
  ctx.fillStyle=col(C.short,C.short2,far);cap(ctx,J[P],lerpP(J[P],J[K],.42),7,5.6);
  ctx.fillStyle=col(C.shoe,C.shoe2,far);cap(ctx,J[A],J[T],3.4,2.6)};
 const arm=(n,far)=>{const S='s'+n,E='E'+n,W='W'+n;ctx.fillStyle=col(C.skin,C.skin2,far);cap(ctx,J[S],J[E],3.9,3.1);cap(ctx,J[E],J[W],3.1,2.4);ctx.beginPath();ctx.arc(J[W][0],J[W][1],2.9,0,7);ctx.fill();
  ctx.fillStyle=col(C.top,C.top2,far);cap(ctx,J[S],lerpP(J[S],J[E],.3),4.6,4)};
 leg(2,1);arm(2,1);
 // torso
 const neck=lerpP(J.S,J.N,.42);
 ctx.fillStyle=col(C.skin,C.skin,0);cap(ctx,J.S,neck,3.2,3);
 if(fv){ctx.fillStyle=col(C.short,C.short,0);cap(ctx,J.p1,J.p2,7.5,7.5);ctx.fillStyle=col(C.top,C.top,0);cap(ctx,J.s1,J.s2,6.5,6.5);
  ctx.beginPath();ctx.moveTo(J.s1[0],J.s1[1]);ctx.lineTo(J.s2[0],J.s2[1]);ctx.lineTo(J.p2[0],J.p2[1]);ctx.lineTo(J.p1[0],J.p1[1]);ctx.closePath();ctx.lineWidth=9;ctx.strokeStyle=ctx.fillStyle;ctx.lineJoin='round';ctx.stroke();ctx.fill();
  ctx.fillStyle=col(C.short,C.short,0);const m1=lerpP(J.p1,J.s1,.28),m2=lerpP(J.p2,J.s2,.28);ctx.beginPath();ctx.moveTo(J.p1[0],J.p1[1]);ctx.lineTo(m1[0],m1[1]);ctx.lineTo(m2[0],m2[1]);ctx.lineTo(J.p2[0],J.p2[1]);ctx.closePath();ctx.stroke();ctx.fill()}
 else{ctx.fillStyle=col(C.top,C.top,0);cap(ctx,J.H,J.S,7.6,7.2);ctx.fillStyle=col(C.short,C.short,0);cap(ctx,J.H,lerpP(J.H,J.S,.3),8.2,7.6)}
 // cabeza
 const d=[J.N[0]-J.S[0],J.N[1]-J.S[1]],dl=Math.hypot(d[0],d[1])||1,u=[d[0]/dl,d[1]/dl];let bk=[u[1],-u[0]];if(J._m)bk=[-bk[0],-bk[1]];
 ctx.fillStyle=ghost||C.hair;
 if(!fv){ctx.beginPath();ctx.ellipse(J.N[0]+bk[0]*9+u[0]*1,J.N[1]+bk[1]*9+u[1]*1,5.5,3,Math.atan2(bk[1],bk[0]),0,7);ctx.fill()}
 ctx.beginPath();ctx.arc(J.N[0],J.N[1],7.6,0,7);ctx.fill();
 if(!ghost){ctx.fillStyle=C.skin;ctx.beginPath();if(fv)ctx.arc(J.N[0]-u[0]*1.6,J.N[1]-u[1]*1.6,6.2,0,7);else ctx.arc(J.N[0]-bk[0]*2.2-u[0]*.8,J.N[1]-bk[1]*2.2-u[1]*.8,6,0,7);ctx.fill()}
 // foco muscular
 if(mu&&!ghost){ctx.save();ctx.globalAlpha=.35+.3*pulse;ctx.fillStyle=mu.st?C.stc:C.hl;ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=8;
  for(const c of mu.c){if(c==='q'){cap(ctx,J.p1,J.K1,5,3.8)}if(c==='c'){cap(ctx,J.K1,J.A1,3.8,2.4)}if(c==='g'){ctx.beginPath();ctx.arc(J.p1[0]-bk[0]*3,J.p1[1]-bk[1]*3,6.5,0,7);ctx.fill()}
   if(c==='a'){cap(ctx,J.s1,J.E1,3.4,2.6)}if(c==='f'){cap(ctx,J.E1,J.W1,2.8,2.2)}if(c==='d'){ctx.beginPath();ctx.arc(J.s1[0],J.s1[1],5,0,7);ctx.fill()}if(c==='b'){cap(ctx,lerpP(J.H,J.S,.15),lerpP(J.H,J.S,.85),5.6,5.6)}}
  ctx.restore()}
 leg(1,0);arm(1,0);
 if(mu&&!ghost){ctx.save();ctx.globalAlpha=.4+.35*pulse;ctx.fillStyle=mu.st?C.stc:C.hl;ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;
  for(const c of mu.c){if(c==='q')cap(ctx,J.p1,J.K1,4.6,3.4);if(c==='c')cap(ctx,J.K1,J.A1,3.4,2.2);if(c==='a')cap(ctx,J.s1,J.E1,3,2.3);if(c==='f')cap(ctx,J.E1,J.W1,2.5,2)}
  ctx.restore()}
}

function drawDemo(cv,key,ms){
 const an=AN[key];const ctx=cv.getContext('2d');const W=cv.width,Hh=cv.height,k=W/240;const C=dcols();const F=fitOf(key);
 ctx.setTransform(1,0,0,1,0,0);
 const g=ctx.createLinearGradient(0,0,0,Hh);g.addColorStop(0,C.bg);g.addColorStop(1,C.bg2);ctx.fillStyle=g;ctx.fillRect(0,0,W,Hh);
 // piso
 const gy=(F.ty+GY*F.s)*k;ctx.fillStyle=C.floor;ctx.fillRect(0,gy,W,Hh-gy);
 if(an.mat){ctx.fillStyle=C.mat;ctx.globalAlpha=.85;ctx.fillRect(W*.04,gy,W*.92,5*k);ctx.globalAlpha=.25;ctx.fillRect(W*.04,gy+5*k,W*.92,Hh-gy);ctx.globalAlpha=1}
 ctx.fillStyle=C.line;ctx.fillRect(0,gy,W,Math.max(1,k));
 ctx.setTransform(k*F.s,0,0,k*F.s,k*F.tx,k*F.ty);
 const p=poseAt(an,ms);const J=solveJ(p,an);J._m=p.m>0.5;
 // sombra
 const hx=J.H[0],air=Math.max(0,GY-Math.max(J.A1[1],J.A2[1],J.T1[1],J.T2[1]));
 ctx.fillStyle='rgba(0,0,0,'+(0.16*Math.max(.35,1-air/60))+')';ctx.beginPath();ctx.ellipse(hx,GY+1.5,26*Math.max(.5,1-air/120),3.2,0,0,7);ctx.fill();
 ctx.lineCap='round';ctx.lineJoin='round';
 const props=an.p||[];const P=(at,dx=0,dy=0)=>Array.isArray(at)?[at[0],at[1]]:[J[at][0]+dx,J[at][1]+dy];
 for(const q of props){
  if(q.k==='rings'){for(const k of ['W1','W2']){const [x,y]=J[k];ctx.globalAlpha=1;ctx.strokeStyle=C.far;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y-5);ctx.lineTo(x,-400);ctx.stroke();ctx.strokeStyle=C.acc2;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x,y,5,0,7);ctx.stroke()}}
  if(q.k==='pommel'){const [x,y]=J.WM;ctx.fillRect(x-14,y+10,40,14);ctx.fillRect(x-4,y+2,8,9);ctx.fillRect(x-2,y+24,4,GY-y-24)}
  if(q.k==='mush'){const [x,y]=J.WM;ctx.beginPath();ctx.ellipse(x,y+4,22,6,0,0,7);ctx.fill();ctx.fillRect(x-4,y+4,8,GY-y-4)}
  if(q.k==='board'){ctx.beginPath();ctx.moveTo(q.x-14,GY);ctx.lineTo(q.x+14,GY);ctx.lineTo(q.x+14,GY-7);ctx.fill()}
  if(q.k==='vault'){ctx.fillRect(q.x,GY-q.h,q.w,5);ctx.fillRect(q.x+q.w/2-3,GY-q.h,6,q.h)}
  if(q.k==='rope'){ctx.globalAlpha=1;ctx.strokeStyle=C.far;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(q.x,-400);ctx.lineTo(q.x,GY);ctx.stroke()}
  if(q.k==='box'){ctx.fillStyle=C.equip2;ctx.fillRect(q.x,GY-q.h,q.w,q.h);ctx.fillStyle=C.equip;ctx.fillRect(q.x,GY-q.h,q.w,3)}
  if(q.k==='bench'){const xs=q.of.map(k=>J[k][0]),ys=q.of.map(k=>J[k][1]);let x0=Math.min(...xs)-6,x1=Math.max(...xs)+6;if(q.w&&x1-x0<q.w){const c=(x0+x1)/2;x0=c-q.w/2;x1=c+q.w/2}const top=Math.max(...ys)+5;
   ctx.fillStyle=C.equip;ctx.fillRect(x0+3,top+3,3,GY-top-3);ctx.fillRect(x1-6,top+3,3,GY-top-3);ctx.fillStyle=C.equip2;ctx.beginPath();ctx.roundRect?ctx.roundRect(x0,top,x1-x0,5,2):ctx.rect(x0,top,x1-x0,5);ctx.fill()}
  if(q.k==='wall'){ctx.fillStyle=C.equip2;ctx.fillRect(q.x,-200,7,GY+200)}
  if(q.k==='pbar'){const [x,y]=P(q.at),w=q.w||30;ctx.strokeStyle=C.equip;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x-w,y);ctx.lineTo(x-w,GY);ctx.moveTo(x+w,y);ctx.lineTo(x+w,GY);ctx.stroke();ctx.strokeStyle=C.equip2;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-w-3,y);ctx.lineTo(x+w+3,y);ctx.stroke()}
  if(q.k==='cone'){ctx.fillStyle='#ff8a1a';ctx.beginPath();ctx.moveTo(q.x-6,GY);ctx.lineTo(q.x,GY-13);ctx.lineTo(q.x+6,GY);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(q.x-3,GY-7,6,2)}
  if(q.k==='band'){const a=P(q.at),b=P(q.to);if(Array.isArray(q.to)){ctx.fillStyle=C.equip;ctx.fillRect(b[0]-2,b[1]-8,4,GY-b[1]+8)}ctx.strokeStyle=C.acc;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo((a[0]+b[0])/2,(a[1]+b[1])/2+3,b[0],b[1]);ctx.stroke()}}
 // fantasma: posición inicial
 if(!an.reset&&an.fr.length<=3&&!reduceMotion&&!NOGHOST.has(key)){const g0=solveJ(an.fr[0][0],an);g0._m=an.fr[0][0].m>0.5;ctx.globalAlpha=.13;drawFigure(ctx,g0,an,C,C.ink,null,0);ctx.globalAlpha=1}
 const pulse=.5+.5*Math.sin(ms/260);
 drawFigure(ctx,J,an,C,null,MU[key],pulse);
 for(const q of props){
  if(q.k==='plate'){const [x,y]=P(q.at,q.dx||0,q.dy||0);ctx.strokeStyle=C.equip2;ctx.lineWidth=2;ctx.fillStyle=C.equip;ctx.beginPath();ctx.arc(x,y,11,0,7);ctx.fill();ctx.fillStyle=C.equip2;ctx.beginPath();ctx.arc(x,y,7.5,0,7);ctx.fill();ctx.fillStyle=C.equip;ctx.beginPath();ctx.arc(x,y,2.4,0,7);ctx.fill()}
  if(q.k==='db1'){const [x,y]=J.W1;ctx.fillStyle=C.equip;ctx.fillRect(x-6,y-1.2,12,2.4);ctx.fillRect(x-8,y-4.5,4,9);ctx.fillRect(x+4,y-4.5,4,9)}
  if(q.k==='db'){for(const k of ['W2','W1']){const [x,y]=J[k];ctx.fillStyle=C.equip;ctx.fillRect(x-6,y-1.2,12,2.4);ctx.fillRect(x-8,y-4.5,4,9);ctx.fillRect(x+4,y-4.5,4,9)}}
  if(q.k==='ball'){const [x,y]=P(q.at);ctx.fillStyle=C.acc2;ctx.beginPath();ctx.arc(x,y,8.5,0,7);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(x,y,8.5,-.6,.9);ctx.stroke()}
  if(q.k==='wheel'){const [x,y]=P(q.at);ctx.strokeStyle=C.equip;ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(x,y,6.5,0,7);ctx.stroke();ctx.fillStyle=C.equip2;ctx.fillRect(x-9,y-1,18,2)}
  if(q.k==='pad'){const [x,y]=P(q.at);ctx.fillStyle=C.equip;ctx.fillRect(x-7,y-10,14,6)}}
}
const DEMO=new Set();let demoRAF=null;const demoT0=performance.now();
const demoIO='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)DEMO.add(e.target);else DEMO.delete(e.target)})):null;
const reduceMotion=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function drawAny(cv,k,t){if(window.THREE&&typeof draw3D==='function')draw3D(cv,k,t);else drawDemo(cv,k,t)}
function initDemos(root){
 root.querySelectorAll('canvas.demo').forEach(cv=>{const key=cv.dataset.a;if(!AN[key])return;
  const dpr=Math.min(2,window.devicePixelRatio||1);const w=cv.clientWidth||300;cv.width=Math.round(w*dpr);cv.height=Math.round(w*dpr*180/240);
  cv._t=0;cv._last=null;cv._speed=1;cv._az=0;const fig=cv.closest('.demo-w');
  let down=null,moved=0;
  cv.addEventListener('pointerdown',e=>{down=e.clientX;moved=0;try{cv.setPointerCapture(e.pointerId)}catch(_){}});
  cv.addEventListener('pointermove',e=>{if(down==null)return;const dx=e.clientX-down;down=e.clientX;moved+=Math.abs(dx);cv._az+=dx*0.012;if(reduceMotion||!DEMO.has(cv))drawAny(cv,key,cv._t)});
  const end=()=>{if(down==null)return;down=null;if(moved<6){if(reduceMotion){cv._play=!cv._play;if(cv._play){DEMO.add(cv);startDemo()}else DEMO.delete(cv);return}
   cv._speed=cv._speed===1?.35:1;if(fig)fig.classList.toggle('slowon',cv._speed<1)}};
  cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',()=>{down=null});
  cv.style.touchAction='pan-y';
  if(reduceMotion){const an=AN[key];cv._t=an.fr[0][1]+(an.fr[1]?an.fr[1][1]:0);drawAny(cv,key,cv._t);return}
  drawAny(cv,key,0);if(demoIO)demoIO.observe(cv);else DEMO.add(cv)});
 if(!reduceMotion)startDemo()}
function startDemo(){if(!demoRAF)demoRAF=requestAnimationFrame(demoLoop)}
function demoLoop(now){for(const cv of DEMO){if(!cv.isConnected){DEMO.delete(cv);continue}if(cv._last!=null)cv._t+=Math.min(100,now-cv._last)*cv._speed;cv._last=now;drawAny(cv,cv.dataset.a,cv._t)}
 for(const cv of document.querySelectorAll('canvas.demo'))if(!DEMO.has(cv))cv._last=null;
 demoRAF=requestAnimationFrame(demoLoop)}
