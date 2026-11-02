/* ===== Demostraciones animadas (figura en bucle) ===== */
const LN={t:40,ua:20,fa:19,th:26,sh:25,ft:8,nk:11};
const PB={x:0,y:0,r:0,m:0,t:180,h:null,a1:4,e1:4,a2:-4,e2:-4,l1:0,k1:0,l2:-2,k2:-2,f1:null,f2:null};
const am=(a,e,d=3)=>({a1:a,e1:e,a2:a-d,e2:e-d});
const lg=(l,k,d=3)=>({l1:l,k1:k,l2:l-d,k2:k-d});
const UP=am(178,178),DN=am(4,4),FW=am(90,90);
const dirA=a=>{a=a*Math.PI/180;return [Math.sin(a),Math.cos(a)]};
/* front-view helpers: near limb = right side, far = left */
const fa=(a,e)=>({a1:a,e1:e,a2:-a,e2:-e});
const fl=(l,k)=>({l1:l,k1:k,l2:-l,k2:-k});

const TUCK={t:150,h:125,l1:140,k1:-20,l2:137,k2:-23,a1:100,e1:20,a2:97,e2:17};
const RUNA={t:170,h:175,l1:55,k1:5,l2:-30,k2:-100,a1:-45,e1:30,a2:50,e2:140};
const RUNB={t:170,h:175,l2:55,k2:5,l1:-30,k1:-100,a2:-45,e2:30,a1:50,e1:140};
const PU_T={t:115,h:110,...am(0,0),l1:-65,k1:-65,l2:-66,k2:-66,f1:5,f2:5};
const PU_B={t:103,h:103,a1:-100,e1:25,a2:-101,e2:24,l1:-77,k1:-77,l2:-78,k2:-78,f1:5,f2:5};
const SQ_T={...am(-30,170),...lg(0,0)};
const SQ_B={t:140,h:155,...am(-70,130),...lg(88,-28)};
const BRIDGE={t:280,h:330,a1:355,e1:355,a2:352,e2:352,l1:25,k1:-10,l2:22,k2:-13};
const SPLIT={t:180,l1:90,k1:90,l2:-90,k2:-90,...am(178,178)};

const AN={
 squat:{p:[{k:'plate',at:'S',dx:-4}],fr:[[SQ_T,700,300],[SQ_B,900,250]]},
 squatPause:{p:[{k:'plate',at:'S',dx:-4}],fr:[[SQ_T,700,300],[SQ_B,900,1300]]},
 rdl:{p:[{k:'plate',at:'W1'}],fr:[[{...DN},800,300],[{t:95,h:110,x:-8,...am(3,3),...lg(14,-2)},1000,300]]},
 bulgarian:{p:[{k:'box',x:72,w:22,h:17},{k:'db'}],fr:[[{l1:12,k1:-2,l2:-35,k2:-69,f2:-100,...DN},700,250],[{x:-14.6,t:172,l1:80,k1:-15,l2:-10,k2:-133,f2:-100,...DN},900,250]]},
 bulgarianBW:{p:[{k:'box',x:72,w:22,h:17}],fr:[[{l1:12,k1:-2,l2:-35,k2:-69,f2:-100,a1:-30,e1:60,a2:-32,e2:58},700,250],[{x:-14.6,t:172,l1:80,k1:-15,l2:-10,k2:-133,f2:-100,a1:-30,e1:60,a2:-32,e2:58},900,250]]},
 hipThrust:{p:[{k:'bench',of:['S'],w:26},{k:'plate',at:'H',dy:-7}],fr:[[{t:-125,h:-125,l1:125,k1:-5,l2:122,k2:-8,a1:65,e1:35,a2:62,e2:32},800,200],[{t:-95,h:-100,l1:95,k1:0,l2:92,k2:-3,a1:95,e1:65,a2:92,e2:62},700,600]]},
 calf:{p:[{k:'db'}],fr:[[{...DN,f1:90,f2:90},500,200],[{...DN,f1:30,f2:28},500,500]]},
 calfSingle:{fr:[[{...DN,l2:-10,k2:-90,f2:-60,f1:90},500,200],[{...DN,l2:-10,k2:-90,f2:-60,f1:30},500,500]]},
 copenhagen:{v:'f',p:[{k:'bench',of:['A1'],w:16}],fr:[[{t:-78,h:-78,a1:178,e1:178,a2:0,e2:-90,l1:95,k1:95,l2:70,k2:70,f1:95,f2:70},900,600],[{t:-70,h:-70,a1:178,e1:178,a2:5,e2:-85,l1:97,k1:97,l2:72,k2:72,f1:97,f2:72},900,600]]},
 sidePlank:{v:'f',fr:[[{t:-82,h:-82,a1:178,e1:178,a2:0,e2:-90,l1:80,k1:80,l2:84,k2:84,f1:80,f2:84},900,500],[{t:-74,h:-74,a1:178,e1:178,a2:4,e2:-86,l1:76,k1:76,l2:80,k2:80,f1:76,f2:80},900,500]]},
 pallof:{p:[{k:'band',at:'W1',to:[30,82]}],fr:[[{...am(20,150)},600,200],[{...am(90,90)},600,900]]},
 ohp:{p:[{k:'plate',at:'W1'}],fr:[[{...am(40,165)},800,250],[{h:175,...UP},800,400]]},
 pushPress:{p:[{k:'plate',at:'W1'}],fr:[[{...am(40,165)},700,300],[{...am(40,165),...lg(18,-14)},350,0],[{...am(130,175),y:3,f1:45,f2:43},250,0],[{h:175,...UP},350,500]]},
 lockout:{p:[{k:'plate',at:'W1'}],fr:[[{...UP,l1:6,k1:4,l2:-6,k2:-6},900,600],[{...am(176,180),l1:6,k1:4,l2:-6,k2:-6,t:178},900,600]]},
 pullup:{p:[{k:'pbar',at:'W1'}],fr:[[{...UP,...lg(12,6),pin:['W1',120,22]},900,250],[{a1:25,e1:175,a2:22,e2:172,...lg(18,10),pin:['W1',120,22]},800,450]]},
 hangHollow:{pt:1,p:[{k:'pbar',at:'W1'}],fr:[[{...UP,t:182,...lg(12,12),pin:['W1',120,22]},900,500],[{...UP,t:186,...lg(22,22),pin:['W1',120,22]},900,500]]},
 dbBench:{p:[{k:'bench',of:['S','H'],w:0},{k:'db'}],fr:[[{t:-90,h:-90,l1:70,k1:0,l2:67,k2:-3,...am(12,172)},800,250],[{t:-90,h:-90,l1:70,k1:0,l2:67,k2:-3,...am(180,180)},800,350]]},
 row:{p:[{k:'plate',at:'W1'}],fr:[[{t:115,h:120,...lg(20,-12),...am(0,0)},700,200],[{t:115,h:120,...lg(20,-12),...am(-80,5)},600,400]]},
 facePull:{p:[{k:'band',at:'W1',to:[220,60]}],fr:[[{...am(90,90)},600,200],[{...am(115,-170)},600,600]]},
 dips:{p:[{k:'pbar',at:'W1',w:14}],fr:[[{...am(2,2),...lg(-10,-80),pin:['W1',120,72]},800,250],[{...am(-55,30),...lg(-10,-80),pin:['W1',120,72]},800,300]]},
 farmer:{p:[{k:'db'}],fr:[[{...DN,l1:22,k1:5,l2:-20,k2:-35},450,0],[{...DN,l1:-20,k1:-35,l2:22,k2:5},450,0]]},
 hollow:{pt:1,fr:[[{t:-80,h:-80,...am(-98,-98),...lg(80,80)},1100,400],[{t:-76,h:-76,...am(-96,-96),...lg(77,77)},1100,400]]},
 hollowRock:{pt:1,fr:[[{t:-80,h:-80,...am(-98,-98),...lg(80,80),r:-12},600,0],[{t:-80,h:-80,...am(-98,-98),...lg(80,80),r:12},600,0]]},
 clean:{p:[{k:'plate',at:'W1'}],fr:[[{...DN},500,200],[{t:150,h:160,...lg(15,-10),...am(0,0)},700,200],[{t:185,y:3,f1:40,f2:38,...am(-5,-5)},220,0],[{t:170,...lg(45,-30),...am(105,210)},250,300],[{...am(105,210)},600,500]]},
 frontSquat:{p:[{k:'plate',at:'W1'}],fr:[[{...am(105,210)},700,250],[{t:155,h:170,...am(85,190),...lg(90,-30)},900,250]]},
 boxJump:{reset:1,p:[{k:'box',x:158,w:46,h:30}],fr:[[{x:-30,...DN},300,300],[{x:-30,t:150,...lg(45,-30),...am(-60,-40)},500,100],[{x:-2,y:42,t:185,...UP,...lg(8,-2),f1:40,f2:38},300,0],[{x:42,y:30,t:150,...lg(70,-25),...FW},300,200],[{x:42,y:30,...DN},500,800]]},
 mbThrow:{p:[{k:'ball',at:'W1'}],fr:[[{t:135,h:150,...lg(40,-25),...am(5,5)},800,200],[{t:200,h:210,y:12,f1:40,f2:38,...am(200,200)},350,600]]},
 invRow:{p:[{k:'pbar',at:'W1'}],fr:[[{t:-110,h:-110,...UP,...lg(70,70),f1:160,f2:160},800,250],[{t:-125,h:-125,a1:-40,e1:175,a2:-42,e2:173,...lg(55,55),f1:145,f2:145},700,400]]},
 wheel:{p:[{k:'wheel',at:'W1'}],fr:[[{t:115,h:120,...am(12,12),l1:0,k1:-90,l2:-2,k2:-92,f1:-90,f2:-92},900,250],[{t:95,h:100,...am(83,83),l1:60,k1:-90,l2:58,k2:-92,f1:-90,f2:-92},1000,300]]},
 pistol:{fr:[[{...FW,l1:0,k1:0,l2:55,k2:55},900,250],[{t:135,h:150,...am(95,95),l1:95,k1:-35,l2:95,k2:95},1000,250]]},
 nordic:{p:[{k:'pad',at:'A1'}],fr:[[{...am(10,10),l1:0,k1:-90,l2:-2,k2:-92,f1:-90,f2:-92},900,200],[{t:125,h:130,...am(100,100),l1:-55,k1:-90,l2:-57,k2:-92,f1:-90,f2:-92},1600,150]]},
 gluteBridge:{fr:[[{t:-90,h:-90,a1:92,e1:90,a2:90,e2:88,l1:125,k1:-20,l2:125,k2:125},800,200],[{t:-68,h:-80,a1:95,e1:92,a2:93,e2:90,l1:110,k1:-10,l2:112,k2:112},700,700]]},
 lungeJump:{fr:[[{l1:80,k1:-5,l2:-25,k2:-100,f2:20,a1:-40,e1:-20,a2:40,e2:60},500,150],[{y:24,l1:20,k1:0,l2:-10,k2:-20,a1:30,e1:50,a2:-30,e2:-10},300,0],[{l2:80,k2:-5,l1:-25,k1:-100,f1:20,a2:-40,e2:-20,a1:40,e1:60},300,150],[{y:24,l2:20,k2:0,l1:-10,k1:-20,a2:30,e2:50,a1:-30,e1:-10},300,0]]},
 pushup:{fr:[[PU_T,700,250],[PU_B,800,250]]},
 pushupPause:{fr:[[PU_T,700,250],[PU_B,800,1300]]},
 pike:{fr:[[{t:55,h:30,...am(40,40),...lg(-12,-12),f1:-20,f2:-20},800,250],[{t:55,h:20,a1:-15,e1:70,a2:-17,e2:68,...lg(-12,-12),f1:-20,f2:-20},800,250]]},
 benchDip:{p:[{k:'bench',of:['W1'],w:22}],fr:[[{a1:-15,e1:-5,a2:-17,e2:-7,l1:60,k1:60,l2:58,k2:58,f1:180,f2:178},800,200],[{a1:-60,e1:-10,a2:-62,e2:-12,l1:75,k1:75,l2:73,k2:73,f1:180,f2:178},800,250]]},
 bear:{fr:[[{t:95,h:110,...am(0,0),l1:5,k1:-70,l2:3,k2:-72,f1:0,f2:0},400,0],[{t:95,h:110,a1:18,e1:18,a2:-6,e2:-6,l1:-5,k1:-80,l2:18,k2:-60,f1:0,f2:0},400,0],[{t:95,h:110,...am(0,0),l1:5,k1:-70,l2:3,k2:-72,f1:0,f2:0},400,0],[{t:95,h:110,a1:-6,e1:-6,a2:18,e2:18,l1:18,k1:-60,l2:-5,k2:-80,f1:0,f2:0},400,0]]},
 superman:{pt:1,fr:[[{t:96,h:100,...am(96,96),...lg(-96,-96)},900,200],[{t:104,h:112,...am(106,106),...lg(-104,-104)},900,800]]},
 plank:{fr:[[{t:103,h:105,a1:0,e1:90,a2:-2,e2:88,...lg(-77,-77),f1:5,f2:5},1200,400],[{t:104,h:107,a1:0,e1:90,a2:-2,e2:88,...lg(-78,-78),f1:5,f2:5},1200,400]]},
 handstandWall:{pt:1,p:[{k:'wall',x:132}],fr:[[{t:0,h:0,...am(0,0),...lg(180,180)},1200,400],[{t:2,h:2,...am(1,1),...lg(178,178)},1200,400]]},
 handstand:{pt:1,mat:1,fr:[[{...UP,l1:20,k1:20},500,200],[{t:20,h:10,...am(30,30),l1:200,k1:200,l2:-30,k2:-30,f2:-30},500,0],[{t:0,h:0,...am(0,0),...lg(180,180)},450,1200],[{t:-20,h:-10,...am(-25,-25),l1:200,k1:200,l2:-40,k2:-40},500,0],[{...UP,l1:20,k1:20},450,300]]},
 toeTouch:{v:'f',pt:1,fr:[[{...fa(5,5),...fl(3,3)},400,200],[{...fa(150,150),...fl(3,3)},300,100],[{...fa(-25,-55),...fl(3,3)},250,0],[{y:42,...fa(95,95),...fl(100,100)},280,120],[{...fa(150,150),...fl(3,3)},280,400]]},
 hurdlerPike:{pt:1,fr:[[{...UP},400,200],[{...am(-40,-30),...lg(35,-25),t:165},300,0],[{y:35,...am(100,100),l1:95,k1:95,l2:-60,k2:-150},280,150],[{...UP},280,350],[{...am(-40,-30),...lg(35,-25),t:165},300,0],[{y:35,t:145,h:130,...am(110,110),l1:95,k1:95,l2:92,k2:92},280,150],[{...UP},280,350]]},
 compression:{pt:1,fr:[[{l1:90,k1:90,l2:88,k2:88,...am(4,4)},700,200],[{t:175,l1:108,k1:108,l2:106,k2:106,...am(4,4)},700,500]]},
 splitR:{pt:1,mat:1,fr:[[{...SPLIT},1200,600],[{t:125,h:115,...am(120,112),l1:90,k1:90,l2:-90,k2:-90},1200,900]]},
 splitL:{pt:1,mat:1,fr:[[{...SPLIT,l1:-90,k1:-90,l2:90,k2:90},1200,600],[{t:125,h:115,...am(120,112),l1:-90,k1:-90,l2:90,k2:90},1200,900]]},
 middle:{v:'f',pt:1,mat:1,fr:[[{...fa(150,150),...fl(90,90)},1100,400],[{t:135,h:120,a1:110,e1:110,a2:-160,e2:150,...fl(90,90)},1100,600],[{...fa(150,150),...fl(90,90)},1100,400],[{t:225,h:240,a1:160,e1:210,a2:-110,e2:-110,...fl(90,90)},1100,600]]},
 bridge:{mat:1,fr:[[{...BRIDGE,a1:345,e1:345,a2:342,e2:342},1000,300],[{...BRIDGE,a1:370,e1:370,a2:367,e2:367,t:285},1000,700]]},
 toBridge:{mat:1,fr:[[{...UP},700,300],[{t:205,h:220,a1:215,e1:215,a2:212,e2:212,...lg(12,-5)},900,200],[{...BRIDGE},800,1000],[{t:205,h:220,a1:215,e1:215,a2:212,e2:212,...lg(12,-5)},900,200]]},
 heelStretch:{pt:1,p:[{k:'band',at:'W1',to:'T1'}],fr:[[{l1:120,k1:120,...am(130,130),l2:0,k2:0,f2:90},900,200],[{l1:172,k1:172,a1:168,e1:168,a2:-10,e2:-10,l2:0,k2:0,f2:90},900,1200]]},
 scorpion:{pt:1,fr:[[{t:170,h:175,l1:0,k1:0,f1:90,l2:-150,k2:170,a2:-175,e2:-170,a1:100,e1:100},1200,900],[{t:30,h:20,l1:0,k1:0,f1:90,l2:-178,k2:-178,a1:-20,e1:-20,a2:-22,e2:-22},1300,900]]},
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
 bhs:{pt:1,mat:1,reset:1,fr:[[{x:45,...UP},300,400],[{x:48,t:160,h:165,...lg(60,-30),...FW},400,80],[{x:30,y:14,t:200,h:215,...am(205,205),...lg(15,15),r:60},280,0],[{x:5,t:195,h:210,...am(200,200),...lg(15,15),r:180},250,0],[{x:-25,t:165,...UP,...lg(25,25),r:300},250,0],[{x:-35,t:170,...UP,...lg(20,-10),r:360},220,600]]},
 frontHs:{pt:1,mat:1,reset:1,fr:[[{x:-45,...UP},300,400],[{x:-40,t:170,...UP,l1:40,k1:40,l2:-10,k2:-10},300,0],[{x:-20,t:180,...UP,...lg(-10,-10),r:-90},250,0],[{x:0,t:190,...UP,...lg(-15,-15),r:-180},250,0],[{x:25,y:10,t:200,h:210,...am(200,200),...lg(-10,-10),r:-280},300,0],[{x:40,t:185,...UP,...lg(10,-5),r:-360},250,600]]},
 backTuck:{pt:1,mat:1,fr:[[{...UP},400,300],[{t:160,h:165,...lg(40,-30),...am(-40,-30)},300,50],[{y:8,t:185,...UP,...lg(-2,-2),f1:30,f2:28},180,0],[{y:50,...TUCK,r:150},220,0],[{y:45,...TUCK,r:290},220,0],[{y:15,...UP,...lg(15,5),r:350},180,0],[{t:165,...lg(40,-30),...am(130,130),r:360},180,300],[{...UP,r:360},400,400]]},
 frontTuck:{pt:1,mat:1,fr:[[{...UP},400,300],[{t:160,h:165,...lg(40,-30),...am(178,178)},300,50],[{y:12,t:175,...am(100,100),...lg(-2,-2),f1:30,f2:28},180,0],[{y:50,...TUCK,r:-150},220,0],[{y:45,...TUCK,r:-290},220,0],[{y:15,...UP,...lg(15,5),r:-350},180,0],[{t:165,...lg(40,-30),...am(130,130),r:-360},180,300],[{...UP,r:-360},400,400]]}
};

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
function animKey(n){
 if(ANAME[n])return ANAME[n];const s=n.toLowerCase();
 const R=[['revisión de video',null],['rol adelante','rolls'],['toe touch','toeTouch'],['puente con patada','backWalk'],['bajada a puente','toBridge'],['back walkover','backWalk'],['front walkover','frontWalk'],
  ['mortal adelante','frontTuck'],['flick adelante','frontHs'],['mortal','backTuck'],['standing tuck','backTuck'],['flick','bhs'],['rueda','cartwheel'],['rondada','cartwheel'],['parada','handstand'],
  ['pases','bhs'],['consistencia','bhs'],['combinación','toeTouch'],['simulación','bhs'],['técnica libre','cartwheel']];
 for(const [k,v] of R)if(s.includes(k))return v;return null}

/* preparar frames */
for(const k in AN){const an=AN[k];an.fr=an.fr.map(([p,mv,hd])=>{const q=Object.assign({},PB,p);
 if(q.h==null)q.h=q.t;
 if(q.f1==null)q.f1=(an.pt||an.v==='f')?q.k1:90+q.r*0;
 if(q.f2==null)q.f2=(an.pt||an.v==='f')?q.k2:90;
 return [q,mv,hd]});an.total=an.fr.reduce((a,f)=>a+f[1]+f[2],0)}

function solveJ(p,an){
 const r=p.r,add=(pt,a,l)=>{const d=dirA(a+r);return [pt[0]+d[0]*l,pt[1]+d[1]*l]};
 const fv=an.v==='f';const J={H:[0,0]};
 J.S=add(J.H,p.t,LN.t);J.N=add(J.S,p.h,LN.nk);
 const tr=(p.t+r)*Math.PI/180,pp=[-Math.cos(tr),Math.sin(tr)],off=(pt,w)=>fv?[pt[0]+pp[0]*w,pt[1]+pp[1]*w]:pt;
 J.s1=off(J.S,9);J.s2=off(J.S,-9);J.p1=off(J.H,5);J.p2=off(J.H,-5);
 J.E1=add(J.s1,p.a1,LN.ua);J.W1=add(J.E1,p.e1,LN.fa);J.E2=add(J.s2,p.a2,LN.ua);J.W2=add(J.E2,p.e2,LN.fa);
 J.K1=add(J.p1,p.l1,LN.th);J.A1=add(J.K1,p.k1,LN.sh);J.K2=add(J.p2,p.l2,LN.th);J.A2=add(J.K2,p.k2,LN.sh);
 const flen=fv?4:LN.ft;J.T1=add(J.A1,p.f1,flen);J.T2=add(J.A2,p.f2,flen);
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

let DCOL=null,DCOLt=0;
function dcols(){const now=Date.now();if(!DCOL||now-DCOLt>1500){const cs=getComputedStyle(document.documentElement),g=v=>cs.getPropertyValue(v).trim();DCOL={ink:g('--ink'),far:g('--mute'),line:g('--line'),acc:g('--acc'),acc2:g('--acc2'),bg:g('--card2')};DCOLt=now}return DCOL}
function drawDemo(cv,key,ms){
 const an=AN[key];const ctx=cv.getContext('2d');const W=cv.width,Hh=cv.height,s=W/240;
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,W,Hh);ctx.setTransform(s,0,0,s,0,0);
 const C=dcols();const p=poseAt(an,ms);const J=solveJ(p,an);
 ctx.lineCap='round';ctx.lineJoin='round';
 // suelo
 if(an.mat){ctx.fillStyle=C.acc2;ctx.globalAlpha=.18;ctx.fillRect(10,GY,220,6);ctx.globalAlpha=1}
 ctx.strokeStyle=C.line;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(6,GY+1);ctx.lineTo(234,GY+1);ctx.stroke();
 const props=an.p||[];
 const P=(at,dx=0,dy=0)=>Array.isArray(at)?[at[0],at[1]]:[J[at][0]+dx,J[at][1]+dy];
 // props de fondo
 for(const q of props){ctx.fillStyle=C.far;ctx.strokeStyle=C.far;ctx.globalAlpha=.55;
  if(q.k==='box'){ctx.fillRect(q.x,GY-q.h,q.w,q.h)}
  if(q.k==='bench'){const xs=q.of.map(k=>J[k][0]),ys=q.of.map(k=>J[k][1]);let x0=Math.min(...xs)-6,x1=Math.max(...xs)+6;if(q.w&&x1-x0<q.w){const c=(x0+x1)/2;x0=c-q.w/2;x1=c+q.w/2}const top=Math.max(...ys)+4;ctx.fillRect(x0,top,x1-x0,4);ctx.fillRect(x0+2,top,3,GY-top);ctx.fillRect(x1-5,top,3,GY-top)}
  if(q.k==='wall'){ctx.fillRect(q.x,0,5,GY)}
  if(q.k==='pbar'){const [x,y]=P(q.at),w=q.w||30;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-w,y);ctx.lineTo(x+w,y);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-w,y);ctx.lineTo(x-w,GY);ctx.moveTo(x+w,y);ctx.lineTo(x+w,GY);ctx.stroke()}
  if(q.k==='cone'){ctx.beginPath();ctx.moveTo(q.x-6,GY);ctx.lineTo(q.x,GY-12);ctx.lineTo(q.x+6,GY);ctx.fill()}
  if(q.k==='band'){const a=P(q.at),b=P(q.to);ctx.globalAlpha=1;ctx.strokeStyle=C.acc;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();if(Array.isArray(q.to)){ctx.strokeStyle=C.far;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b[0],b[1]-6);ctx.lineTo(b[0],GY);ctx.stroke()}}
  ctx.globalAlpha=1}
 const seg=(pts,col,w)=>{ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(J[pts[0]][0],J[pts[0]][1]);for(const k of pts.slice(1))ctx.lineTo(J[k][0],J[k][1]);ctx.stroke()};
 const fv=an.v==='f',farC=fv?C.ink:C.far;
 seg(['p2','K2','A2','T2'],farC,5);seg(['s2','E2','W2'],farC,4.5);
 if(fv){seg(['p1','p2'],C.ink,5);seg(['s1','s2'],C.ink,5)}
 seg(['H','S'],C.ink,6);
 ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(J.N[0],J.N[1],7,0,7);ctx.fill();
 seg(['p1','K1','A1','T1'],C.ink,5);seg(['s1','E1','W1'],C.ink,4.5);
 // props de frente
 for(const q of props){
  if(q.k==='plate'){const [x,y]=P(q.at,q.dx||0,q.dy||0);ctx.fillStyle=C.acc2;ctx.beginPath();ctx.arc(x,y,10,0,7);ctx.fill();ctx.fillStyle=C.bg;ctx.beginPath();ctx.arc(x,y,2.5,0,7);ctx.fill()}
  if(q.k==='db'){ctx.fillStyle=C.acc2;for(const k of ['W1','W2']){const [x,y]=J[k];ctx.fillRect(x-7,y-3.5,14,7)}}
  if(q.k==='ball'){const [x,y]=P(q.at);ctx.fillStyle=C.acc;ctx.beginPath();ctx.arc(x,y,8,0,7);ctx.fill()}
  if(q.k==='wheel'){const [x,y]=P(q.at);ctx.strokeStyle=C.acc2;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.stroke()}
  if(q.k==='pad'){const [x,y]=P(q.at);ctx.fillStyle=C.acc2;ctx.fillRect(x-6,y-9,12,6)}}
}
const DEMO=new Set();let demoRAF=null;const demoT0=performance.now();
const demoIO='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)DEMO.add(e.target);else DEMO.delete(e.target)})):null;
const reduceMotion=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function initDemos(root){
 root.querySelectorAll('canvas.demo').forEach(cv=>{const key=cv.dataset.a;if(!AN[key])return;
  const dpr=Math.min(2,window.devicePixelRatio||1);const w=cv.clientWidth||240;cv.width=Math.round(w*dpr);cv.height=Math.round(w*dpr*160/240);
  cv._off=Math.random()*1000;
  if(reduceMotion){const an=AN[key];let t=0;for(let i=0;i<an.fr.length-1;i++)t+=an.fr[i][1]+an.fr[i][2];drawDemo(cv,key,t+an.fr[an.fr.length-1][1]);cv.onclick=()=>{cv._play=!cv._play;if(cv._play){DEMO.add(cv);if(!demoRAF)demoRAF=requestAnimationFrame(demoLoop)}else DEMO.delete(cv)};return}
  drawDemo(cv,key,0);if(demoIO)demoIO.observe(cv);else DEMO.add(cv)});
 if(!demoRAF&&!reduceMotion&&DEMO.size+1)demoRAF=requestAnimationFrame(demoLoop)}
function demoLoop(now){for(const cv of DEMO){if(!cv.isConnected){DEMO.delete(cv);continue}drawDemo(cv,cv.dataset.a,now-demoT0)}demoRAF=requestAnimationFrame(demoLoop)}
