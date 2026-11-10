/* ============================================================
   DIAGRAMAS TÉCNICOS (SVG inline dibujado con código)
   FIG[clave] = { t: título, cap: leyenda, ref: cita RIC, err: error común,
                  svg: (modo) => string }   modo: "ok" | "err" | "q" (sin rótulos de respuesta)
   ============================================================ */
const T=(x,y,s,c="",a="start")=>`<text x="${x}" y="${y}" class="${c}" text-anchor="${a}">${s}</text>`;
let _svgId=0;
const SV=(vb,title,desc,body)=>{const id="sv"+(++_svgId);return `<svg viewBox="${vb}" role="img" aria-labelledby="${id}t ${id}d"><title id="${id}t">${title}</title><desc id="${id}d">${desc}</desc>${body}</svg>`};
const X=(x,y,s=9)=>`<path d="M${x-s} ${y-s}L${x+s} ${y+s}M${x+s} ${y-s}L${x-s} ${y+s}" class="bad"/>`;
const OK=(x,y)=>`<path d="M${x-8} ${y}l6 6 11-13" class="okl"/>`;
const PEstripe=`<defs><pattern id="peS" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="10" height="10" fill="#15803D"/><rect width="4" height="10" fill="#EAB308"/></pattern></defs>`;

const FIG={
/* ---------------------------------------------------------- */
empAereo:{t:"Empalme aéreo monofásico",ref:"RIC N°01 · RIC N°10, 5.2 (protección ≥ 25 A, alimentador ≥ 4 mm²)",
 cap:"Acometida desde la red, punto de anclaje, bajada en ducto, caja con medidor y protección del empalme, alimentador al tablero general y tierra de servicio. Las alturas y distancias mínimas se rotulan como pendientes de verificar en el RIC N°01 vigente y en la norma de la distribuidora.",
 err:"Acometida que cruza sobre techos o junto a ventanas al alcance de la mano; bajada sin ducto ni protección mecánica; medidor dentro de la propiedad sin acceso para lectura.",
 svg:m=>SV("0 0 760 360","Empalme aéreo monofásico","Poste con red de baja tensión, acometida hasta el anclaje en la fachada, bajada en ducto hasta la caja del medidor con su protección, alimentador hacia el tablero general y electrodo de tierra de servicio.",
 `<rect x="0" y="300" width="760" height="60" class="soil"/><path d="M0 300H760" class="ln"/>
 <rect x="54" y="40" width="14" height="260" class="bx"/>${T(61,30,"Poste red BT","t-b","middle")}
 <path d="M40 60H90M40 76H90" class="ln"/>${T(96,64,"Red BT (distribuidora)","t-m")}
 <path d="M68 70Q260 ${m==="err"?150:120} 430 92" class="wf"/>${T(240,m==="err"?168:132,"Acometida","t-b","middle")}
 ${m==="err"?`<path d="M300 150l70 -70h120v220h-190z" class="wall" opacity=".6"/>${T(330,118,"techo","t-m")}${X(300,128,12)}${T(300,190,"cruza sobre techo","t-bad","middle")}`:""}
 <rect x="430" y="70" width="230" height="230" class="wall"/>${T(545,62,"Fachada vivienda","t-m","middle")}
 <circle cx="436" cy="92" r="5" class="dot"/>${T(442,84,"Anclaje","t-m")}
 ${m==="err"?`<path d="M440 92V196" class="wf"/>${X(470,140)}${T(476,144,"bajada sin ducto","t-bad")}`:`<rect x="436" y="92" width="10" height="104" fill="none" stroke="var(--muted)"/><path d="M441 92V196" class="wf"/>${T(452,140,"Bajada en ducto","t-m")}`}
 <rect x="420" y="196" width="80" height="70" rx="4" class="bx2"/>${T(460,212,"Caja empalme","t-m","middle")}
 <circle cx="447" cy="238" r="16" class="bx"/>${T(447,242,"kWh","t-b","middle")}
 <rect x="472" y="226" width="18" height="26" rx="2" class="brk"/>${T(481,278,"Protección ≥ 25 A","t-m","middle")}
 <path d="M490 240H600V200" class="wf"/>${T(545,232,"Alimentador ≥ 4 mm²","t-m","middle")}
 <rect x="580" y="150" width="54" height="50" rx="4" class="brk"/>${T(607,178,"TG","t-b","middle")}
 <path d="M430 262H400V330" class="wpe"/><path d="M400 300V340" class="cus"/>${T(392,352,"Tierra de servicio","t-m","end")}
 <path d="M720 300V196" class="dim"/><path d="M714 196H726M714 300H726" class="ln"/>${T(712,250,"Altura medidor","t-m","end")}${T(712,266,"⚠ verificar RIC N°01","t-m","end")}
 <path d="M20 300V115" class="dim"/>${T(24,200,"Altura acometida sobre","t-m")}${T(24,214,"calzada / acera: ⚠ verificar","t-m")}`)},
/* ---------------------------------------------------------- */
empSub:{t:"Empalme subterráneo",ref:"RIC N°01 ⚠ verificar puntos de profundidad y protección mecánica",
 cap:"Desde la red subterránea o cámara de la distribuidora, el conductor llega en ducto enterrado, sube protegido en ducto hasta la caja del medidor y su protección; de allí parte el alimentador.",
 err:"Conductor directamente enterrado sin ducto ni señalización, o subida al medidor sin protección mecánica.",
 svg:m=>SV("0 0 760 330","Empalme subterráneo","Cámara de la distribuidora, ducto enterrado con cinta de advertencia, subida en ducto a la caja del medidor en un pilar y alimentador hacia el tablero.",
 `<rect x="0" y="150" width="760" height="180" class="soil"/><path d="M0 150H760" class="ln"/>${T(10,142,"Nivel de terreno (acera)","t-m")}
 <rect x="40" y="150" width="100" height="80" class="bx2"/>${T(90,250,"Cámara distribuidora","t-m","middle")}
 ${m==="err"?`<path d="M140 210H470V150" class="wf"/>${X(300,210)}${T(300,240,"cable directamente enterrado, sin ducto","t-bad","middle")}`:`<rect x="140" y="202" width="335" height="16" rx="8" fill="none" stroke="var(--muted)" stroke-width="2"/><path d="M140 210H470V150" class="wf"/><path d="M160 186H450" stroke="#E8A317" stroke-width="3" stroke-dasharray="10 6"/>${T(300,182,"Cinta de advertencia","t-m","middle")}${T(300,238,"Ducto enterrado (profundidad: ⚠ verificar)","t-m","middle")}`}
 <rect x="440" y="30" width="110" height="120" class="wall"/>${T(495,24,"Pilar / muro","t-m","middle")}
 ${m==="err"?"":`<rect x="464" y="96" width="12" height="114" fill="none" stroke="var(--muted)"/>`}
 <rect x="456" y="50" width="80" height="50" rx="4" class="bx2"/><circle cx="480" cy="75" r="14" class="bx"/>${T(480,79,"kWh","t-b","middle")}
 <rect x="505" y="62" width="16" height="26" rx="2" class="brk"/>
 <path d="M536 75H660V110" class="wf"/>${T(600,68,"Alimentador","t-m","middle")}
 <rect x="630" y="110" width="60" height="40" rx="4" class="brk"/>${T(660,135,"TG","t-b","middle")}`)},
/* ---------------------------------------------------------- */
tablero:{t:"Tablero domiciliario",ref:"RIC N°02, 6.1.16.3 · 6.1.21 · 6.1.22 · 6.2.4.2 · 6.2.9 · 6.2.14 · RIC N°10, 5.1.3.5 y 5.1.3.7",
 cap:"Interruptor general arriba; diferenciales de 30 mA con no más de 3 circuitos cada uno; distribución por peine; barras de neutro (blanca) y de tierra (verde) separadas e identificadas; rotulación de circuitos; luz piloto (exigible sobre 3 circuitos); espacio de reserva del 25 %; comandos entre 0,45 m y 2,0 m del piso.",
 err:"Conductor de protección conectado en la barra de neutro; puentes de cable de diferencial a automáticos en vez de peine; diferencial con 4 o más circuitos; sin rótulos ni reserva.",
 svg:m=>{const e=m!=="ok";return SV("0 0 760 400","Tablero domiciliario","Gabinete con interruptor general, dos diferenciales, cinco automáticos, barras de neutro y tierra, luz piloto y espacio de reserva.",
 `<rect x="150" y="20" width="420" height="360" rx="10" class="bx2"/>${T(360,14,"Gabinete IP41 (interior)","t-m","middle")}
 <path d="M170 60H550M170 160H550M170 260H550" class="ln" stroke-width="3"/>${T(556,64,"riel DIN","t-m")}
 <rect x="190" y="38" width="44" height="50" rx="4" class="brk"/>${T(212,66,"IG","t-b","middle")}${T(212,104,"2P 25 A","t-m","middle")}
 <circle cx="290" cy="60" r="10" fill="#E8A317" stroke="#8A4B00"/>${T(290,98,"Luz piloto","t-m","middle")}${T(290,112,"(≤ 10 A)","t-m","middle")}
 <rect x="190" y="136" width="54" height="50" rx="4" class="rcd"/>${T(217,158,"DR1","t-b","middle")}${T(217,174,"30 mA","t-m","middle")}
 <rect x="360" y="136" width="54" height="50" rx="4" class="rcd"/>${T(387,158,"DR2","t-b","middle")}${T(387,174,"30 mA","t-m","middle")}
 ${[0,1,2].map(i=>`<rect x="${190+i*36}" y="238" width="30" height="46" rx="3" class="brk"/>${T(205+i*36,265,"C"+(i+1),"t-b","middle")}`).join("")}
 ${[0,1].map(i=>`<rect x="${360+i*36}" y="238" width="30" height="46" rx="3" class="brk"/>${T(375+i*36,265,"C"+(i+4),"t-b","middle")}`).join("")}
 <rect x="440" y="238" width="104" height="46" rx="3" fill="none" stroke="var(--ok)" stroke-dasharray="5 4"/>${T(492,265,"Reserva 25 %","t-ok","middle")}
 ${m==="err"?`<path d="M217 186C200 205 260 215 241 238M217 186C230 210 290 210 277 238" class="bad"/>${T(150,214,"puentes de cable","t-bad","end")}`:`<rect x="190" y="226" width="102" height="6" class="cu"/>${T(300,222,"peine","t-m")}<rect x="360" y="226" width="66" height="6" class="cu"/>`}
 ${T(205,298,"Ilum.","t-m","middle")}${T(241,312,"Ench.","t-m","middle")}${T(277,298,"Coc.","t-m","middle")}
 <rect x="190" y="320" width="150" height="12" rx="3" fill="#F3F4F6" stroke="#6B7280"/>${T(265,348,"Barra N (blanco)","t-m","middle")}
 <rect x="380" y="320" width="150" height="12" rx="3" fill="#15803D" stroke="#14532D"/>${T(455,348,"Barra PE (verde)","t-m","middle")}
 ${e?`<path d="M600 326H${m==="q"?340:340}" stroke="url(#peS)" stroke-width="5"/>${PEstripe}${T(610,330,"PE del circuito","t-m")}`:`${PEstripe}<path d="M600 326H530" stroke="url(#peS)" stroke-width="5"/>${T(610,330,"PE del circuito","t-m")}`}
 ${m==="err"?`${X(345,326)}${T(360,372,"PE en barra de neutro","t-bad","middle")}`:""}
 <path d="M110 380V60" class="ax"/><path d="M104 60H116M104 380H116" class="ln"/>${T(104,210,"Comandos","t-m","end")}${T(104,224,"0,45 – 2,0 m","t-m","end")}${T(104,238,"del piso","t-m","end")}
 ${T(600,160,"Rótulos:","t-b")}${T(600,178,"C1 Alumbrado","t-m")}${T(600,194,"C2 Enchufes","t-m")}${T(600,210,"C3 Cocina/lavadero","t-m")}${T(600,226,"C4 Alumbrado 2","t-m")}${T(600,242,"C5 Enchufes 2","t-m")}`)}},
/* ---------------------------------------------------------- */
enchufe:{t:"Enchufe 10/16 A con tierra",ref:"RIC N°10, 5.1.2.8 (alvéolos protegidos) · 5.1.2.9 (capacidad ≥ protección) · RIC N°04, 5.32 (colores)",
 cap:"Enchufe hembra de alvéolos protegidos, de tres alvéolos en línea: el central es la tierra de protección. Fase (L) y neutro (N) a los bornes laterales según la marcación del fabricante. Conductores: L1 azul, N blanco, PE verde o verde/amarillo. La convención de lado para fase se marca como ⚠ verificar.",
 err:"Borne de tierra sin conectar, o «puente» entre neutro y tierra dentro del enchufe; enchufe de 10 A en un circuito protegido con 16 A.",
 svg:m=>SV("0 0 760 280","Conexión de enchufe 10/16 A con tierra","Vista frontal del enchufe con alvéolos de fase, tierra al centro y neutro; vista posterior con bornes conectados a los conductores azul, verde/amarillo y blanco.",
 `${PEstripe}<rect x="40" y="40" width="200" height="200" rx="18" class="bx2"/>${T(140,30,"Vista frontal","t-b","middle")}
 <rect x="82" y="90" width="12" height="40" rx="3" class="dot"/><rect x="134" y="90" width="12" height="40" rx="3" class="dot"/><rect x="186" y="90" width="12" height="40" rx="3" class="dot"/>
 <rect x="76" y="150" width="24" height="16" rx="3" class="dot"/><circle cx="140" cy="158" r="8" class="dot"/><rect x="180" y="150" width="24" height="16" rx="3" class="dot"/>
 ${T(88,190,"L / N","t-m","middle")}${T(140,190,"PE","t-b","middle")}${T(192,190,"N / L","t-m","middle")}${T(140,216,"Alvéolos protegidos","t-m","middle")}
 ${T(140,262,"10 A (patas delgadas) / 16 A (gruesas)","t-m","middle")}
 <rect x="360" y="40" width="200" height="200" rx="18" class="bx2"/>${T(460,30,"Vista posterior (bornes)","t-b","middle")}
 <rect x="390" y="120" width="30" height="30" rx="4" class="bx"/><rect x="445" y="120" width="30" height="30" rx="4" class="bx"/><rect x="500" y="120" width="30" height="30" rx="4" class="bx"/>
 ${T(405,170,"L","t-b","middle")}${T(460,170,"⏚","t-b","middle")}${T(515,170,"N","t-b","middle")}
 <path d="M405 135H405V260" class="wf"/>${m==="err"?`<path d="M460 135V180" stroke="url(#peS)" stroke-width="4"/>${X(460,200)}${T(600,205,"PE suelto / sin conectar","t-bad")}<path d="M460 135H515" class="bad"/>${T(600,120,"puente N–PE","t-bad")}`:`<path d="M460 135V260" stroke="url(#peS)" stroke-width="4"/>`}
 <path d="M515 135V260" class="wn"/>
 ${T(600,240,"Azul = fase L1","t-m")}${T(600,256,"Blanco = neutro","t-m")}${T(600,272,"Verde/amarillo = PE","t-m")}
 ${T(600,60,"Lado de la fase:","t-m")}${T(600,76,"⚠ verificar convención","t-m")}`)},
/* ---------------------------------------------------------- */
int912:{t:"Interruptor de un efecto (9/12)",ref:"RIC N°10 ⚠ verificar punto (interruptor en la fase) · RIC N°19 (ensayo de polaridad)",
 cap:"El interruptor corta la FASE. La fase sale del interruptor como «retorno» al contacto central del portalámpara; el neutro llega directo al casquillo; el PE llega al centro de iluminación.",
 err:"Interruptor intercalado en el neutro: con el interruptor abierto el portalámpara sigue con tensión respecto de tierra.",
 svg:m=>SV("0 0 760 230","Conexión de interruptor de un efecto","Fase pasa por el interruptor hacia la lámpara; neutro va directo a la lámpara; conductor de protección al centro de iluminación.",
 `${PEstripe}${T(20,50,"L","t-b")}${T(20,110,"N","t-b")}${T(20,170,"PE","t-b")}
 <path d="M40 46H${m==="err"?600:200}" class="wf"/><path d="M40 106H${m==="err"?200:600}" class="wn"/><path d="M40 166H640" stroke="url(#peS)" stroke-width="4"/>
 <rect x="200" y="20" width="110" height="${m==="err"?110:56}" rx="6" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/>${T(255,m==="err"?146:92,"Interruptor 9/12","t-m","middle")}
 ${m==="err"?`<circle cx="210" cy="106" r="4" class="dot"/><path d="M210 106L250 90" class="ln"/><circle cx="270" cy="106" r="4" class="dot"/><path d="M270 106H600" class="wn"/>${X(250,70)}${T(330,130,"interruptor en el NEUTRO","t-bad")}`:`<circle cx="210" cy="46" r="4" class="dot"/><path d="M210 46L250 30" class="ln"/><circle cx="270" cy="46" r="4" class="dot"/><path d="M270 46H600" class="wf"/>${T(420,38,"retorno (fase conmutada)","t-m","middle")}`}
 <circle cx="620" cy="76" r="26" class="bx"/><path d="M602 58l36 36M638 58l-36 36" class="ln"/>${T(620,124,"Centro","t-m","middle")}
 <path d="M600 46Q610 50 612 60" class="${m==="err"?"wn":"wf"}"/><path d="M600 106Q610 100 612 92" class="${m==="err"?"wf":"wn"}"/><path d="M640 166V102" stroke="url(#peS)" stroke-width="4"/>
 ${m==="err"?"":OK(700,76)}`)},
/* ---------------------------------------------------------- */
escalera:{t:"Interruptores de escalera (9/24) e intermedio (9/32)",ref:"Práctica de instalación · RIC N°10 ⚠ verificar denominación comercial 9/24 y 9/32",
 cap:"Dos conmutadores 9/24 permiten encender desde dos puntos: la fase entra al común del primero, dos «viajeros» unen ambos conmutadores y el común del segundo va a la lámpara. Para un tercer punto se intercala un interruptor intermedio (cruce) entre los viajeros, comercialmente denominado 9/32 ⚠.",
 err:"Llevar la fase al borne de viajero en lugar del común, o conectar el neutro a los conmutadores: la luz funciona solo desde un punto o queda un portalámpara siempre energizado.",
 svg:m=>SV("0 0 760 260","Conexión escalera con dos conmutadores y un intermedio","Fase al común del primer conmutador, dos viajeros hasta un intermedio y luego al segundo conmutador, cuyo común alimenta la lámpara; neutro directo a la lámpara.",
 `${T(14,44,"L","t-b")}${T(14,224,"N","t-b")}<path d="M30 40H90" class="wf"/><path d="M30 220H690" class="wn"/>
 <rect x="80" y="20" width="110" height="140" rx="6" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/>${T(135,180,"9/24 (1)","t-b","middle")}
 <circle cx="96" cy="40" r="4" class="dot"/><path d="M96 40L170 ${m==="err"?110:70}" class="ln"/><circle cx="175" cy="70" r="4" class="dot"/><circle cx="175" cy="110" r="4" class="dot"/>${T(96,30,"común","t-m","middle")}
 <path d="M175 70H300M175 110H300" class="wl2"/>${T(240,62,"viajero 1","t-m","middle")}${T(240,130,"viajero 2","t-m","middle")}
 <rect x="300" y="50" width="110" height="80" rx="6" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/>${T(355,150,"9/32 intermedio ⚠","t-b","middle")}
 <path d="M300 70L410 110M300 110L410 70" class="dim"/><path d="M300 70H410M300 110H410" class="ln" opacity=".5"/>
 <path d="M410 70H520M410 110H520" class="wl2"/>
 <rect x="510" y="20" width="110" height="140" rx="6" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/>${T(565,180,"9/24 (2)","t-b","middle")}
 <circle cx="525" cy="70" r="4" class="dot"/><circle cx="525" cy="110" r="4" class="dot"/><path d="M525 70L600 40" class="ln"/><circle cx="604" cy="40" r="4" class="dot"/>${T(604,30,"común","t-m","middle")}
 <path d="M604 40H690V90" class="wf"/><circle cx="690" cy="112" r="22" class="bx"/><path d="M674 96l32 32M706 96l-32 32" class="ln"/><path d="M690 134V220" class="wn"/>
 ${m==="err"?`${X(60,80)}${T(30,250,"Error: fase al viajero / neutro conmutado","t-bad")}`:""}`)},
/* ---------------------------------------------------------- */
portalamp:{t:"Portalámpara: fase al contacto central",ref:"RIC N°10 ⚠ verificar punto · RIC N°19 (polaridad)",
 cap:"La fase (retorno del interruptor) va al contacto central; el neutro, a la rosca. Al cambiar la ampolleta, la parte que se puede tocar (rosca) queda a potencial de neutro.",
 err:"Fase conectada a la rosca: al enroscar la ampolleta, los dedos pueden tocar el casquillo energizado.",
 svg:m=>{const f=m==="err";return SV("0 0 760 250","Conexión de portalámpara","Corte del portalámpara con contacto central y rosca, mostrando a qué conductor se conecta cada uno.",
 `<rect x="250" y="40" width="160" height="150" rx="10" class="bx2"/>
 ${[0,1,2,3,4].map(i=>`<path d="M270 ${70+i*20}h120" class="ln" opacity=".5"/>`).join("")}${T(330,62,"Rosca (casquillo)","t-m","middle")}
 <rect x="315" y="170" width="30" height="16" rx="3" class="cu"/>${T(330,210,"Contacto central","t-m","middle")}
 <path d="M90 178H315" class="${f?"wn":"wf"}"/>${T(80,182,f?"N":"L (retorno)","t-b","end")}
 <path d="M90 80H270" class="${f?"wf":"wn"}"/>${T(80,84,f?"L":"N","t-b","end")}
 ${f?`${X(470,80)}${T(490,84,"Fase en la rosca: peligro","t-bad")}`:`${OK(470,120)}${T(490,124,"Correcto","t-ok")}`}`)}},
/* ---------------------------------------------------------- */
colores:{t:"Código de colores de conductores",ref:"RIC N°04, 5.32",
 cap:"Fase L1 azul, L2 negro, L3 rojo; neutro blanco; protección verde o verde/amarillo (colores reservados).",
 err:"Usar verde o verde/amarillo como fase o neutro; usar blanco como fase; «marcar» con cinta un conductor de otro color en vez de usar el color correcto.",
 svg:m=>SV("0 0 760 200","Código de colores de conductores","Cinco cortes de conductor con su color: azul, negro, rojo, blanco y verde con amarillo.",
 `${PEstripe}${[["L1 · Fase 1","#1D4ED8","azul"],["L2 · Fase 2","#111827","negro"],["L3 · Fase 3","#C81E1E","rojo"],["N · Neutro","#F3F4F6","blanco"],["PE · Protección","url(#peS)","verde / verde-amarillo"]].map((c,i)=>`<circle cx="${80+i*150}" cy="80" r="40" fill="${c[1]}" stroke="#6B7280" stroke-width="2"/><circle cx="${80+i*150}" cy="80" r="14" class="cu"/>${T(80+i*150,148,c[0],"t-b","middle")}${T(80+i*150,166,c[2],"t-m","middle")}`).join("")}
 ${m==="err"?`${X(680,80,20)}${T(680,192,"nunca como fase","t-bad","middle")}`:""}`)},
/* ---------------------------------------------------------- */
uniones:{t:"Uniones de conductores: correctas e incorrectas",ref:"RIC N°04 ⚠ verificar punto (uniones en cajas, continuidad y aislación)",
 cap:"Fila superior, correctas: cola de rata (derivación en caja, aislada), derivación en T, Western Union (unión en línea), conector de resorte certificado y regleta/bornera. Todas dentro de caja de derivación, con aislación equivalente a la del conductor. Fila inferior, incorrectas.",
 err:"Uniones dentro del ducto; cobre expuesto fuera del conector; unión solo «apoyada» o sin torsión; aislación con cinta no eléctrica; secciones o materiales incompatibles en un mismo borne.",
 svg:m=>{const P=(x,lab,body,ok)=>`<g transform="translate(${x} 0)"><rect x="0" y="${ok?20:190}" width="140" height="150" rx="8" class="bx2"/>${body}${T(70,ok?160:330,lab,"t-b","middle")}${ok?OK(120,42):X(120,212,8)}</g>`;
 return SV("0 0 760 350","Uniones correctas e incorrectas","Diez paneles: cinco formas correctas de unir conductores y cinco errores frecuentes.",
 P(5,"Cola de rata",`<path d="M20 120L70 80M20 60L70 80" class="cus"/><path d="M70 80l30 0" class="cus" stroke-width="7"/><rect x="92" y="70" width="34" height="20" rx="4" class="tape"/>`,1)+
 P(155,"Derivación en T",`<path d="M10 70H130" class="cus"/><path d="M70 130V70" class="cus"/><path d="M60 64h20v12h-20z" class="cus" stroke-width="3"/>`,1)+
 P(305,"Western Union",`<path d="M10 80H60M80 80H130" class="cus"/><path d="M50 72q10 16 20 0q10 -16 20 0M50 88q10 -16 20 0" class="cus" stroke-width="3"/>`,1)+
 P(455,"Conector resorte",`<path d="M10 70H60M10 90H60" class="cus"/><path d="M60 60h30l20 20-20 20h-30z" fill="#E8A317" stroke="#8A4B00"/>`,1)+
 P(605,"Regleta / bornera",`<rect x="40" y="55" width="60" height="50" rx="4" class="bx"/><path d="M10 70H50M90 70H130M10 92H50M90 92H130" class="cus"/>`,1)+
 P(5,"Sin aislar",`<path d="M20 290L70 250M20 230L70 250M70 250h40" class="cus"/>`,0)+
 P(155,"Dentro del ducto",`<rect x="10" y="230" width="120" height="40" rx="18" fill="none" stroke="var(--muted)" stroke-width="2"/><path d="M15 250H125" class="cus"/><rect x="60" y="242" width="20" height="16" class="tape"/>`,0)+
 P(305,"Solo apoyada",`<path d="M10 250H72M68 254H130" class="cus"/>`,0)+
 P(455,"Cobre expuesto",`<path d="M10 240H60M10 260H60" class="cus"/><path d="M75 230h25l15 20-15 20h-25z" fill="#E8A317" stroke="#8A4B00"/>`,0)+
 P(605,"Cinta de embalaje",`<path d="M10 250H130" class="cus"/><rect x="50" y="238" width="40" height="24" fill="#D6C7A1" opacity=".9"/>`,0))}},
/* ---------------------------------------------------------- */
tierra:{t:"Puesta a tierra con barra Copperweld",ref:"RIC N°06, 6.1 y 6.2 (≤ 20 Ω; 80 Ω con condiciones) · Tabla 6.4 (R ≈ ρ/L) · ⚠ verificar dimensiones de barra y cámara",
 cap:"Electrodo de acero recubierto de cobre hincado verticalmente; unión con conector apernado o soldadura exotérmica dentro de una cámara de inspección registrable; conductor de tierra hasta la barra PE del tablero, desde la que salen los conductores de protección de los circuitos.",
 err:"Unión electrodo–conductor enterrada sin cámara (no se puede inspeccionar ni medir); conductor de tierra empalmado o sin protección mecánica; usar cañerías de agua como electrodo.",
 svg:m=>SV("0 0 760 330","Sistema de puesta a tierra con barra","Terreno con barra vertical, cámara de inspección en la superficie, conductor hasta la barra de protección del tablero y conductores de protección hacia los circuitos.",
 `${PEstripe}<rect x="0" y="110" width="760" height="220" class="soil"/><path d="M0 110H760" class="ln"/>${T(10,102,"Nivel de terreno","t-m")}
 ${m==="q"?"":m==="err"?`${X(150,130)}${T(190,140,"sin cámara de inspección","t-bad")}`:`<rect x="110" y="96" width="80" height="44" class="bx2"/>${T(150,90,"Cámara de inspección (registrable)","t-m","middle")}`}
 <path d="M150 120V310" class="cus" stroke-width="9"/>${T(170,240,"Barra Copperweld","t-b")}${T(170,256,"(L y Ø: ⚠ verificar)","t-m")}
 <rect x="142" y="114" width="16" height="12" rx="2" fill="#6B7280"/>${T(200,128,"Conector","t-m")}
 <path d="M150 116V60H520" stroke="url(#peS)" stroke-width="5" fill="none"/>${T(330,52,"Conductor de tierra (sección: ⚠ verificar)","t-m","middle")}
 <rect x="500" y="20" width="160" height="80" rx="6" class="bx2"/>${T(580,14,"Tablero","t-m","middle")}<rect x="520" y="54" width="120" height="10" fill="#15803D"/>${T(580,84,"Barra PE","t-b","middle")}
 <path d="M560 64V140M600 64V140" stroke="url(#peS)" stroke-width="3"/>${T(620,150,"PE a circuitos","t-m")}
 <path d="M320 310V150" class="dim"/>${T(326,230,"R ≈ ρ ÷ L","t-b")}${T(326,246,"(RIC N°06, Tabla 6.4)","t-m")}`)},
/* ---------------------------------------------------------- */
telurometro:{t:"Medición con telurómetro (método de 3 puntos)",ref:"RIC N°06 · RIC N°19 ⚠ verificar punto del método · IEEE 81 (regla del 62 %)",
 cap:"Electrodo bajo prueba E (desconectado de la instalación), pica de corriente C alejada (típicamente ≥ 5 a 10 veces la longitud del electrodo) y pica de potencial P al 62 % de la distancia E–C. Se repite moviendo P ±10 % para confirmar que la lectura es estable.",
 err:"Medir con el electrodo conectado a la instalación (lectura falsamente baja por caminos en paralelo) o con picas demasiado cerca (zonas de influencia superpuestas).",
 svg:m=>SV("0 0 760 260","Método de caída de potencial","Telurómetro conectado al electrodo E, a la pica de potencial P ubicada al 62 por ciento y a la pica de corriente C.",
 `<rect x="0" y="130" width="760" height="130" class="soil"/><path d="M0 130H760" class="ln"/>
 <rect x="300" y="20" width="120" height="56" rx="6" class="bx2"/>${T(360,44,"Telurómetro","t-b","middle")}${T(360,62,"E   P   C","t-m","middle")}
 <path d="M80 130V230" class="cus" stroke-width="8"/>${T(80,250,"E (electrodo)","t-b","middle")}
 <path d="M${m==="err"?220:430} 130V190" class="cus" stroke-width="5"/>${T(m==="err"?220:430,210,"P","t-b","middle")}
 <path d="M680 130V190" class="cus" stroke-width="5"/>${T(680,210,"C","t-b","middle")}
 <path d="M330 76Q200 100 80 130M360 76Q${m==="err"?280:400} 100 ${m==="err"?220:430} 130M390 76Q560 100 680 130" class="ln"/>
 <path d="M80 112H${m==="err"?220:430}" class="dim"/>${T(m==="err"?150:255,106,m==="err"?"P muy cerca de E":"62 % de D","t-m","middle")}
 <path d="M80 98H680" class="dim"/>${T(560,94,"D (E–C)","t-m","middle")}
 ${m==="err"?X(220,160):""}`)},
/* ---------------------------------------------------------- */
unilineal:{t:"Diagrama unilineal tipo de una vivienda",ref:"RIC N°18 (presentación) · RIC N°10, 5.1.3.5, 5.1.3.7 y 5.2 · RIC N°04, 5.4",
 cap:"Empalme → medidor → alimentador → interruptor general → diferenciales 30 mA (máximo 3 circuitos cada uno) → automáticos de cada circuito, con calibre, curva, sección y destino. Ejemplo para vivienda de ~60 m² (ver Caso 1).",
 err:"Omitir la sección o la curva de cada circuito; dibujar un diferencial con más de 3 circuitos; no indicar la puesta a tierra ni la capacidad del empalme.",
 svg:m=>SV("0 0 760 330","Diagrama unilineal tipo","Empalme y medidor, alimentador, interruptor general, dos diferenciales y cuatro circuitos con sus protecciones.",
 `${T(20,30,"Empalme 25 A","t-b")}<circle cx="60" cy="70" r="20" class="bx"/>${T(60,74,"kWh","t-b","middle")}
 <path d="M60 90V120" class="ln"/>${T(70,110,"Alim. 2×6 mm² + PE","t-m")}
 <rect x="45" y="120" width="30" height="34" rx="3" class="brk"/>${T(85,142,"IG 2P 25 A curva C","t-m")}
 <path d="M60 154V180H600" class="ln" stroke-width="2.5"/>
 ${[[150,"DR1 2P 25 A · 30 mA",[["C1","10 A B","1,5 mm²","Alumbrado"],["C2","16 A C","2,5 mm²","Enchufes"]]],[450,"DR2 2P 25 A · 30 mA",[["C3","16 A C","2,5 mm²","Cocina / lavadero"]]]].map(([x,lab,cs])=>`<path d="M${x} 180V200" class="ln"/><rect x="${x-18}" y="200" width="36" height="34" rx="3" class="rcd"/>${T(x+24,222,lab,"t-m")}<path d="M${x} 234V250H${x+(cs.length-1)*150}" class="ln"/>${cs.map((c,i)=>`<path d="M${x+i*150} 250V262" class="ln"/><rect x="${x+i*150-14}" y="262" width="28" height="30" rx="3" class="brk"/>${T(x+i*150,306,c[0]+" · "+c[1],"t-b","middle")}${T(x+i*150,320,c[2]+" · "+c[3],"t-m","middle")}`).join("")}`).join("")}
 <path d="M20 170V200" class="wpe"/><path d="M8 200h24M12 206h16M16 212h8" class="ln"/>${T(36,206,"PAT servicio","t-m")}`)},
/* ---------------------------------------------------------- */
simbologia:{t:"Simbología eléctrica de planos",ref:"RIC N°18 ⚠ verificar contra la simbología normalizada vigente",
 cap:"Símbolos de uso habitual en planos domiciliarios (representación referencial). Usa siempre la simbología normalizada vigente e inclúyela como leyenda en cada plano.",
 err:"Inventar símbolos o no incluir la leyenda de simbología en el plano.",
 svg:m=>{const S=[["Centro de iluminación",`<circle cx="0" cy="0" r="14" class="ln"/><path d="M-10 -10l20 20M10 -10l-20 20" class="ln"/>`],["Enchufe 10/16 A",`<path d="M-14 6A14 14 0 0 1 14 6Z" class="ln"/><path d="M0 -8v-10" class="ln"/>`],["Interruptor 9/12",`<circle cx="0" cy="6" r="5" class="dot"/><path d="M0 6L14 -12M14 -12l6 4" class="ln"/>`],["Conmutador 9/24",`<circle cx="0" cy="6" r="5" class="dot"/><path d="M0 6L14 -12M14 -12l6 4M0 6L-14 24M-14 24l-6 -4" class="ln"/>`],["Tablero",`<rect x="-18" y="-10" width="36" height="20" class="ln"/><path d="M-18 10L18 -10" class="ln"/>`],["Medidor kWh",`<circle cx="0" cy="0" r="14" class="ln"/>${T(0,4,"kWh","t-m","middle")}`],["Puesta a tierra",`<path d="M0 -14V0M-14 0h28M-9 6h18M-4 12h8" class="ln"/>`],["Automático",`<rect x="-8" y="-16" width="16" height="32" class="ln"/><path d="M-8 16L8 -16" class="ln"/>`],["Diferencial",`<rect x="-10" y="-16" width="20" height="32" class="ln"/><ellipse cx="0" cy="0" rx="14" ry="6" class="ln"/>`],["Caja de derivación",`<rect x="-12" y="-12" width="24" height="24" class="ln"/><circle cx="0" cy="0" r="3" class="dot"/>`]];
 return SV("0 0 760 260","Simbología eléctrica","Diez símbolos habituales en planos eléctricos domiciliarios con su nombre.",S.map((s,i)=>`<g transform="translate(${80+(i%5)*150} ${70+Math.floor(i/5)*120})">${s[1]}${T(0,46,s[0],"t-m","middle")}</g>`).join("")+T(380,250,"Representación referencial — ⚠ verificar simbología normalizada vigente","t-m","middle"))}},
/* ---------------------------------------------------------- */
canalizacion:{t:"Canalizaciones: llenado, cajas y alturas",ref:"RIC N°04, Tabla 4.21 (llenado) · 7.16.1.16 (recorridos) · RIC N°02, 6.1.22",
 cap:"Corte de tubo con 3 conductores (F, N, PE): ocupación ≤ 33 % (1 conductor ≤ 50 %; uniones de gabinetes ≤ 1 m: 60 %). En muro, los recorridos embutidos son verticales u horizontales; los horizontales a 0,30 m del cielo y 0,20 m del piso. Las alturas de montaje de enchufes e interruptores se indican como ⚠ verificar.",
 err:"Tubos llenos sobre el 33 %; recorridos diagonales en muro; uniones dentro del tubo; cajas de derivación tapadas por el estuco (no registrables).",
 svg:m=>SV("0 0 760 290","Canalización embutida y llenado de tubo","Corte transversal de un tubo con tres conductores y elevación de un muro con recorridos horizontales y verticales, cajas y alturas.",
 `${PEstripe}<circle cx="120" cy="120" r="70" fill="none" stroke="var(--muted)" stroke-width="4"/>
 <circle cx="100" cy="102" r="17" fill="#1D4ED8" stroke="#555"/><circle cx="140" cy="102" r="17" fill="#F3F4F6" stroke="#555"/><circle cx="120" cy="138" r="17" fill="url(#peS)" stroke="#555"/>
 ${T(120,214,"3 conductores ≤ 33 %","t-b","middle")}${T(120,230,"1 conductor ≤ 50 %","t-m","middle")}${T(120,246,"Unión gabinetes ≤ 1 m: 60 %","t-m","middle")}
 <rect x="290" y="20" width="440" height="250" class="wall"/>${T(510,14,"Muro (elevación)","t-m","middle")}
 <path d="M290 60H730" class="dim"/>${T(726,54,"0,30 m bajo cielo","t-m","end")}<path d="M290 240H730" class="dim"/>${T(726,258,"0,20 m sobre piso","t-m","end")}
 ${m==="err"?`<path d="M340 60L560 210" class="bad"/>${T(450,120,"recorrido diagonal","t-bad","middle")}`:`<path d="M330 60H600M420 60V170M560 60V190" stroke="var(--blue)" stroke-width="5" fill="none"/>`}
 <rect x="410" y="170" width="20" height="24" rx="2" class="bx2"/>${T(436,186,"Interruptor","t-m")}${T(436,200,"altura ⚠ verificar","t-m")}
 <rect x="550" y="190" width="20" height="24" rx="2" class="bx2"/>${T(576,206,"Enchufe","t-m")}${T(576,220,"altura ⚠ verificar","t-m")}
 <rect x="410" y="48" width="24" height="24" rx="2" class="bx2"/><circle cx="422" cy="60" r="3" class="dot"/>${T(440,90,"Caja de derivación registrable","t-m")}`)},
/* ---------------------------------------------------------- */
curvas:{t:"Curvas de disparo B, C y D",ref:"RIC N°10, 5.1.4.2 · IEC 60898-1 (umbrales magnéticos)",
 cap:"Zona térmica (sobrecarga, tiempo inverso) y zona magnética (cortocircuito, instantánea). Disparo magnético: B entre 3 y 5 In; C entre 5 y 10 In; D entre 10 y 20 In. Referencia: B iluminación, C enchufes, D o K protecciones generales/motores.",
 err:"Elegir curva B para cargas con alta corriente de partida (disparos intempestivos) o curva D en circuitos largos de enchufes (puede no despejar a tiempo una falla de baja corriente).",
 svg:m=>SV("0 0 760 300","Curvas de disparo de interruptores automáticos","Gráfico tiempo versus múltiplos de corriente nominal con las curvas B, C y D.",
 `<path d="M80 260H720M80 260V20" class="ax"/>${T(400,292,"Múltiplos de In (escala log.)","t-m","middle")}${T(30,140,"t (s)","t-m")}
 ${[1,3,5,10,20].map((v,i)=>{const x=80+[0,140,220,340,470][i];return `<path d="M${x} 256v8" class="ax"/>${T(x,280,v+"×","t-m","middle")}`}).join("")}
 <path d="M100 30C150 120 200 170 220 200V250H260" class="curveB"/>${T(205,190,"B","t-b")}
 <path d="M110 30C170 120 240 170 300 200V250H340" class="curveC"/>${T(300,190,"C","t-b")}
 <path d="M120 30C200 120 320 170 420 200V250H470" class="curveD"/>${T(420,190,"D","t-b")}
 ${T(140,60,"Zona térmica (sobrecarga)","t-m")}${T(500,240,"Zona magnética (cortocircuito)","t-m")}`)},
/* ---------------------------------------------------------- */
esquemas:{t:"Esquemas de conexión a tierra TT, TN-S e IT",ref:"RIC N°10, 5.2 f) (vivienda: TN-S) · RIC N°05 / RIC N°06 · IEC 60364-1",
 cap:"TT: neutro a tierra en la fuente y masas a un electrodo local independiente. TN-S: neutro a tierra en el origen y conductor PE separado del N en toda la instalación (exigido en viviendas). IT: fuente aislada de tierra o a través de alta impedancia, masas a tierra.",
 err:"Usar el neutro como conductor de protección (TN-C) en circuitos de la vivienda, o unir N y PE aguas abajo del punto de unión permitido.",
 svg:m=>{const P=(x,t,b)=>`<g transform="translate(${x} 0)"><rect x="0" y="10" width="240" height="250" rx="8" class="bx2"/>${T(120,34,t,"t-b","middle")}${b}</g>`;
 return SV("0 0 760 270","Esquemas TT, TN-S e IT","Tres paneles comparando la conexión del neutro de la fuente y de las masas a tierra.",`${PEstripe}`+
 P(5,"TT",`<path d="M30 70H210M30 100H210" class="wf"/><path d="M30 130H210" class="wn"/>${T(18,104,"L","t-m")}${T(18,134,"N","t-m")}<path d="M30 130V200" class="ln"/><path d="M18 200h24M22 206h16" class="ln"/>${T(30,224,"Tierra fuente","t-m","middle")}<rect x="150" y="150" width="50" height="34" class="bx"/>${T(175,172,"masa","t-m","middle")}<path d="M175 184V210" stroke="url(#peS)" stroke-width="4"/><path d="M163 210h24M167 216h16" class="ln"/>${T(175,240,"Tierra local","t-m","middle")}`)+
 P(260,"TN-S (vivienda)",`<path d="M30 70H210" class="wf"/><path d="M30 100H210" class="wn"/><path d="M30 130H210" stroke="url(#peS)" stroke-width="4"/>${T(18,74,"L","t-m")}${T(18,104,"N","t-m")}${T(10,134,"PE","t-m")}<path d="M40 100V200M40 130" class="ln"/><circle cx="40" cy="130" r="4" class="dot"/><path d="M28 200h24M32 206h16" class="ln"/>${T(40,226,"N y PE unidos en el origen","t-m")}<rect x="150" y="150" width="50" height="34" class="bx"/>${T(175,172,"masa","t-m","middle")}<path d="M175 130V150" stroke="url(#peS)" stroke-width="4"/>`)+
 P(515,"IT",`<path d="M30 70H210M30 100H210" class="wf"/>${T(18,74,"L1","t-m")}${T(18,104,"L2","t-m")}<rect x="22" y="140" width="16" height="30" class="bx"/>${T(48,160,"Z alta / aislado","t-m")}<path d="M30 100V140M30 170V200" class="ln"/><path d="M18 200h24M22 206h16" class="ln"/><rect x="150" y="150" width="50" height="34" class="bx"/>${T(175,172,"masa","t-m","middle")}<path d="M175 184V210" stroke="url(#peS)" stroke-width="4"/><path d="M163 210h24M167 216h16" class="ln"/>${T(120,248,"Vigilancia de aislamiento","t-m","middle")}`))}},
/* ---------------------------------------------------------- */
diferencial:{t:"Principio del interruptor diferencial",ref:"RIC N°10, 5.1.3.5 (≤ 30 mA en circuitos de alumbrado) · 5.1.3.7 (máx. 3 circuitos)",
 cap:"El diferencial compara la corriente que va por la fase con la que vuelve por el neutro. Si la diferencia (fuga a tierra) alcanza IΔn, desconecta. Con 30 mA protege a las personas (protección complementaria).",
 err:"Conectar el neutro de un circuito a otro diferencial (neutros cruzados): dispara sin falla. Puentear el diferencial porque «salta»: oculta una falla real de aislación.",
 svg:m=>SV("0 0 760 230","Principio del diferencial","Fase y neutro atraviesan un toroide; una fuga a tierra desequilibra las corrientes y provoca el disparo.",
 `${T(14,84,"L","t-b")}${T(14,144,"N","t-b")}<path d="M30 80H600" class="wf"/><path d="M30 140H600" class="wn"/>
 <ellipse cx="220" cy="110" rx="34" ry="60" fill="none" stroke="#E8A317" stroke-width="10" opacity=".8"/>${T(220,196,"Toroide","t-m","middle")}
 <rect x="300" y="20" width="130" height="34" rx="6" class="rcd"/>${T(365,42,"Relé de disparo","t-b","middle")}<path d="M254 90L300 40" class="dim"/>
 <rect x="600" y="60" width="60" height="100" rx="6" class="bx"/>${T(630,114,"Carga","t-m","middle")}
 <path d="M630 160V200H500" class="bad"/>${T(560,218,"fuga a tierra (Id)","t-bad","middle")}<path d="M490 194h20M494 200h12" class="ln"/>
 ${T(20,222,"Si I(L) − I(N) ≥ IΔn = 30 mA → desconecta","t-b")}`)}
};

/* Imágenes para preguntas (variantes «q» sin rótulos de respuesta) */
const QIMG={
  tableroErr:()=>FIG.tablero.svg("q"),
  uniones:()=>{const P=(x,l,b)=>`<g transform="translate(${x} 0)"><rect x="0" y="10" width="175" height="150" rx="8" class="bx2"/>${b}${T(88,180,l,"t-b","middle")}</g>`;
    return SV("0 0 760 190","Cuatro uniones de conductores A a D","A: conductores torcidos sin aislar. B: conector de resorte dentro de caja. C: unión con cinta de embalaje. D: conductores solo apoyados.",
    P(5,"A",`<path d="M20 110L80 70M20 50L80 70M80 70h50" class="cus"/>`)+P(195,"B",`<rect x="10" y="20" width="155" height="130" rx="6" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/><path d="M20 70H80M20 92H80" class="cus"/><path d="M80 60h34l22 21-22 21h-34z" fill="#E8A317" stroke="#8A4B00"/>`)+P(385,"C",`<path d="M15 80H160" class="cus"/><rect x="60" y="66" width="50" height="28" fill="#D6C7A1"/>`)+P(575,"D",`<path d="M15 80H90M85 84H160" class="cus"/>`))},
  colores:()=>{const P=(x,l,c)=>`<g transform="translate(${x} 0)">${c.map((k,i)=>`<circle cx="${40+i*48}" cy="60" r="20" fill="${k}" stroke="#6B7280" stroke-width="2"/>`).join("")}${T(88,110,l,"t-b","middle")}</g>`;
    return SV("0 0 760 125","Cuatro combinaciones de colores A a D","Cada panel muestra fase, neutro y protección en distinto orden de colores.",PEstripe+P(5,"A",["#1D4ED8","#F3F4F6","url(#peS)"])+P(195,"B",["#F3F4F6","#1D4ED8","#C81E1E"])+P(385,"C",["#15803D","#F3F4F6","#111827"])+P(575,"D",["#111827","#111827","#111827"])+T(380,122,"Orden en cada panel: fase · neutro · protección","t-m","middle"))},
  telurometro:()=>FIG.telurometro.svg("ok").replace("62 % de D","P = ¿? % de D"),
  tierraErr:()=>FIG.tierra.svg("q"),
  portalamp:()=>SV("0 0 760 210","Portalámpara con dos conductores","Corte de portalámpara con rosca y contacto central, y dos conductores sin indicar a cuál va la fase.",
    `<rect x="250" y="30" width="160" height="140" rx="10" class="bx2"/>${[0,1,2,3,4].map(i=>`<path d="M270 ${60+i*20}h120" class="ln" opacity=".5"/>`).join("")}${T(330,52,"Rosca","t-m","middle")}<rect x="315" y="150" width="30" height="16" rx="3" class="cu"/>${T(330,190,"Contacto central","t-m","middle")}<path d="M90 158H315M90 70H270" class="ln" stroke-width="3"/>${T(80,162,"?","t-b","end")}${T(80,74,"?","t-b","end")}`),
  escalera:()=>FIG.escalera.svg("ok").replace(/9\/24 \(\d\)|9\/32 intermedio ⚠/g,"¿?")
};
