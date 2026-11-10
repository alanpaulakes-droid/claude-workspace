/* ============================================================
   CONTENIDOS: teoría, instalación práctica, proceso del proyecto,
   pruebas y mediciones, casos prácticos, recursos.
   ============================================================ */
const IZ={/* «RIC N°04, Tabla 4.4» cobre 70 °C / 90 °C, 30 °C, ≤3 conductores con carga */
  secc:[1.5,2.5,4,6,10,16,25,35,50,70,95,120],
  "70":{A1:[14,18,24,31,42,56,73,89,108,136,164,188],B1:[16,21,28,36,50,68,89,110,134,171,207,239],E:[19,24,31,43,60,80,101,126,153,196,238,276]},
  "90":{A1:[17,23,31,40,54,73,95,117,141,179,216,249],B1:[18,24,37,48,66,88,117,144,175,222,269,312],E:[19,32,42,54,75,100,127,158,192,246,298,346]},
  ft:{t:[10,15,20,25,30,35,40,45,50,55,60],"70":[1.22,1.17,1.12,1.06,1,.94,.87,.79,.71,.61,.5],"90":[1.15,1.12,1.08,1.04,1,.96,.91,.87,.82,.76,.71]},
  fn:{hasta:[3,6,24,42,1e9],f:[1,.8,.7,.6,.5]},
  prot:[6,10,16,20,25,32,40,50,63,80,100,125]
};

const TEORIA=[
{id:"ohm",t:"Ley de Ohm y potencia",html:`<div class="formula">V = I × R   ·   P = V × I × cos φ (monofásico)   ·   P = √3 × V<sub>L</sub> × I × cos φ (trifásico)</div>
<p>En la red domiciliaria chilena: 220 V entre fase y neutro y 380 V entre fases, 50 Hz.</p>
<div class="tw"><table><caption>Ejemplos rápidos</caption><thead><tr><th>Caso</th><th>Cálculo</th><th>Resultado</th></tr></thead><tbody>
<tr><td>Hervidor 2.200 W, 220 V</td><td>2.200 ÷ 220</td><td>10 A</td></tr>
<tr><td>Motor trifásico 380 V, 10 A, cos φ 0,85</td><td>√3 × 380 × 10 × 0,85</td><td>5.594 W</td></tr>
<tr><td>Carga 1.760 W, cos φ 0,8, 220 V</td><td>1.760 ÷ (220 × 0,8)</td><td>10 A</td></tr></tbody></table></div>`},
{id:"fp",t:"Factor de potencia",html:`<p>cos φ = P ÷ S. Potencia activa P (W), reactiva Q (VAr), aparente S (VA): S² = P² + Q². Con cos φ bajo, para la misma potencia útil circula más corriente: más pérdidas, más caída de tensión y conductores mayores. Se corrige con condensadores en instalaciones con motores.</p>`},
{id:"caida",t:"Caída de tensión",html:`<div class="formula">Monofásico: ΔV = 2 × ρ × L × I ÷ S    ·    Trifásico: ΔV = √3 × ρ × L × I ÷ S    ·    ΔV% = ΔV ÷ V × 100</div>
<p>ρ cobre ≈ 0,018 Ω·mm²/m (valor de cálculo usado en este curso; a temperatura de servicio es mayor). L en metros (solo ida), S en mm². Límites: 3 % por tramo y 5 % total «RIC N°03, 5.1.3».</p><div id="calcCaida"></div>`},
{id:"secc",t:"Dimensionamiento de conductores",html:`<ol class="steps"><li><b>Corriente de proyecto Ib</b>: P ÷ (V × cos φ).</li><li><b>Protección In</b>: In ≥ 1,1 × Ib (alumbrado «RIC N°10, 5.1.4.1») y Σ P ≤ 0,9 × V × In «RIC N°10, 5.1.4.4».</li><li><b>Capacidad corregida</b>: Iz' = Iz(tabla) × ft × fn «RIC N°04, Tablas 4.4, 4.6 y 4.7». Condición: Ib ≤ In ≤ Iz'.</li><li><b>Sección mínima por uso</b>: 1,5 / 2,5 / 4 mm² «RIC N°04, 5.4».</li><li><b>Caída de tensión</b>: ≤ 3 % el tramo y ≤ 5 % total. Si no cumple, subir sección.</li></ol><div id="calcSecc"></div>`},
{id:"selec",t:"Selectividad y curvas B / C / D",html:`<p>La <b>selectividad</b> consigue que ante una falla dispare solo la protección inmediatamente aguas arriba. Se logra escalonando calibres (y curvas) entre general y circuitos, y entre diferenciales (p. ej., 300 mA selectivo «S» aguas arriba de 30 mA instantáneos).</p>
<div class="tw"><table><thead><tr><th>Curva</th><th>Disparo magnético</th><th>Uso de referencia «RIC N°10, 5.1.4.2»</th></tr></thead><tbody><tr><td>B</td><td>3 a 5 × In</td><td>Iluminación, cargas resistivas, circuitos largos</td></tr><tr><td>C</td><td>5 a 10 × In</td><td>Enchufes, cargas mixtas</td></tr><tr><td>D</td><td>10 a 20 × In</td><td>Generales, motores, transformadores</td></tr></tbody></table></div>`,dg:["curvas"]},
{id:"dif",t:"Diferencial de 30 mA",html:`<p>Mide la diferencia entre corriente de ida (fase) y de retorno (neutro). Con IΔn = 30 mA protege a las personas como medida complementaria. Rango de disparo: entre 0,5 × IΔn (15 mA) y IΔn (30 mA). Tiempos de referencia para diferenciales generales: ≤ 300 ms a IΔn y ≤ 40 ms a 5 × IΔn (IEC 61008) ⚠. Tipos: AC (alterna senoidal), A (+ pulsante continua), B (+ continua lisa; cargadores VE, variadores).</p>`,dg:["diferencial"]},
{id:"esq",t:"Sistemas TT / TN / IT",html:`<p>Primera letra: relación de la fuente con tierra (T = a tierra, I = aislada). Segunda: relación de las masas (T = tierra local, N = unidas al neutro de la fuente). En TN, S = N y PE separados, C = combinados (PEN). La vivienda en Chile debe ser <b>TN-S</b> «RIC N°10, 5.2 f)».</p>`,dg:["esquemas"]}
];

const PRACTICA={
 secuencia:[["Replanteo","Marcar en obra centros, enchufes, interruptores, tablero y recorridos según plano; verificar alturas y distancias a cielos y pisos (0,30 / 0,20 m) «RIC N°04, 7.16.1.16»."],["Canalización","Instalar ductos y cajas: recorridos verticales u horizontales, llenado ≤ 33 %, cajas registrables «RIC N°04, Tabla 4.21»."],["Cableado","Pasar conductores con colores normativos «RIC N°04, 5.32» y secciones mínimas «RIC N°04, 5.4»; sin uniones dentro de ductos."],["Conexionado","Uniones en cajas con conectores o técnicas correctas y aisladas; enchufes, interruptores (en fase) y portalámparas (fase al centro)."],["Tablero","Montar gabinete con IP adecuado, IG, diferenciales (máx. 3 circuitos), peines, barras N y PE separadas, rótulos y reserva 25 % «RIC N°02»."],["Puesta a tierra","Hincar electrodo, cámara registrable, conductor a barra PE; medir con telurómetro «RIC N°06»."],["Verificación","Inspección visual y ensayos en el orden del «RIC N°19, 7.1.3»; protocolo firmado."]],
 herramientas:["Alicates universal, de corte y pelacables","Destornilladores aislados 1.000 V","Huincha de medir y nivel","Taladro y brocas, sonda pasacables","Multímetro y detector de tensión (CAT III/IV)","Megóhmetro, telurómetro y comprobador de diferenciales","Candados y tarjetas LOTO"],
 epp:["Casco con barbiquejo (dieléctrico)","Lentes de seguridad","Guantes dieléctricos de clase acorde a la tensión, con guantes de cuero de protección","Calzado dieléctrico","Ropa ignífuga (según análisis de arco) ⚠","Arnés para trabajos en altura"],
 loto:["Identificar todas las fuentes de energía (red, generador, FV).","Avisar a los afectados.","Cortar con el dispositivo de seccionamiento.","Bloquear con candado personal y etiquetar (nombre, fecha, motivo).","Verificar ausencia de tensión (ver procedimiento).","Poner a tierra y en cortocircuito cuando corresponda.","Señalizar y delimitar la zona.","Al terminar: retirar herramientas y personas, retirar tierras, retirar el bloqueo (solo quien lo puso) y reenergizar."],
 ausencia:["Probar el detector en una fuente conocida.","Medir entre todas las combinaciones: F–N, F–PE, N–PE (y F–F en trifásico).","Volver a probar el detector en la fuente conocida.","Recién entonces considerar el circuito sin tensión."]
};

const PROYECTO=[
{t:"Levantamiento",r:"Instalador / cliente",d:"Planos de arquitectura, necesidades del cliente, artefactos previstos",x:"Recorrer la vivienda, superficie de cada recinto, perímetros, cargas especiales (inducción, VE, termo)."},
{t:"Cálculo de demanda y empalme",r:"Instalador",d:"Memoria de cálculo (demanda)",x:"Potencia instalada → demanda con «RIC N°03, Tabla 3.1» (+ cargas especiales ⚠) → corriente → capacidad del empalme (≥ 25 A «RIC N°10, 5.2»)."},
{t:"Cuadro de cargas",r:"Instalador",d:"Cuadro de cargas",x:"Por circuito: centros (100 W), enchufes (250 W), potencia, Ib, In, curva, sección, ΔV y diferencial asociado."},
{t:"Planos",r:"Instalador",d:"Planta, diagrama unilineal, cuadro de cargas, simbología",x:"Según «RIC N°18»: trazado de circuitos, unilineal con protecciones y secciones, leyenda de simbología ⚠ formato."},
{t:"Memoria y especificaciones",r:"Instalador",d:"Memoria explicativa/cálculo, EETT",x:"Justificar protecciones, secciones, caídas y puesta a tierra; especificar materiales certificados."},
{t:"Ejecución y verificación",r:"Instalador",d:"Protocolo de ensayos",x:"Construir según proyecto y ejecutar ensayos «RIC N°19» (continuidad, aislación, tierra, diferencial, polaridad)."},
{t:"Declaración TE1",r:"Instalador autorizado",d:"TE1 + antecedentes en plataforma SEC",x:"Ingresar la declaración en línea ante la SEC con los documentos del proyecto ⚠ verificar anexos y plazos."},
{t:"Inspección / fiscalización",r:"SEC (u organismo que designe)",d:"Observaciones / aprobación",x:"La SEC puede revisar documentos o fiscalizar en terreno; las observaciones se subsanan y se actualiza la declaración ⚠."},
{t:"Solicitud de empalme",r:"Cliente / instalador ante distribuidora",d:"Solicitud + comprobante TE1",x:"La distribuidora define condiciones del empalme y conecta la instalación declarada."},
{t:"Puesta en servicio",r:"Distribuidora + instalador",d:"Acta / registro de conexión",x:"Conexión del medidor, energización, verificación final de polaridad y funcionamiento «RIC N°19»."}
];

const PRUEBAS=[
{t:"Continuidad del PE y equipotenciales",inst:"Óhmetro de baja resistencia / multitester de instalaciones",met:"Fuente de 4 a 24 V en vacío (CC o CA), corriente ≥ 0,2 A, entre barra PE y cada punto (enchufes, centros, masas).",ac:"Continuidad en todos los puntos; valor bajo y coherente con largo y sección ⚠ criterio numérico",ref:"«RIC N°19, 7.2.1»"},
{t:"Resistencia de aislación",inst:"Megóhmetro",met:"Sin tensión y sin cargas conectadas; 500 V CC en circuitos ≤ 500 V; medir F–F, F–N, F–PE, N–PE.",ac:"≥ 0,5 MΩ (circuitos ≤ 500 V)",ref:"«RIC N°19, Tabla 19.1 y 7.3.1»"},
{t:"Resistencia de puesta a tierra",inst:"Telurómetro",met:"Método de 3 puntos, electrodo desconectado, P al 62 % de E–C; repetir moviendo P.",ac:"≤ 20 Ω (≤ 80 Ω con las condiciones del punto 6.2)",ref:"«RIC N°06, 6.1 y 6.2»"},
{t:"Prueba de diferencial",inst:"Comprobador de diferenciales",met:"Inyectar 0,5 × IΔn (no debe disparar), 1 × IΔn (debe disparar y medir tiempo) y 5 × IΔn; probar también el botón T.",ac:"Dispara entre 0,5 y 1 × IΔn; ≤ 300 ms a IΔn ⚠",ref:"«RIC N°19» ⚠ · IEC 61008"},
{t:"Polaridad",inst:"Multímetro / probador de enchufes",met:"Verificar que interruptores unipolares corten la fase, fase al contacto central del portalámpara y conexión correcta de enchufes.",ac:"Sin inversiones",ref:"«RIC N°19, 7.1.3» ⚠ numeral"}
];

/* Casos prácticos resueltos (cálculos generados por código para que coincidan) */
const CASOS=[
{id:"c60",t:"Vivienda 60 m² (monofásica)",desc:"2 dormitorios (11 y 9 m²), living-comedor 20 m² (perímetro 18 m), cocina, baño, lavadero.",
 tipo:"mono",Lal:12,cos:1,
 circ:[{c:"C1",u:"Alumbrado (10 centros)",p:1000,tipo:"luz",dr:"DR1",L:18},{c:"C2",u:"Enchufes dormitorios y living (8)",p:2000,tipo:"enc",dr:"DR1",L:20},{c:"C3",u:"Cocina y lavadero (exclusivo)",p:2500,tipo:"coc",dr:"DR2",L:14}],
 especiales:[],met:"A1",notas:["3 circuitos: cumple el mínimo para ≥ 30 m² «RIC N°10, 5.2 b)».","Dormitorio de 11 m² → 2 centros «RIC N°10, 5.2 a)»; living 18 m de perímetro → 3 enchufes.","Cocina: 3 enchufes + lavadero 1 en circuito exclusivo de 16 A «RIC N°10, 5.2 c) y d)»."]},
{id:"c120",t:"Vivienda 120 m² (monofásica)",desc:"3 dormitorios, living, comedor, cocina con horno eléctrico, 2 baños, termo eléctrico.",
 tipo:"mono",Lal:20,cos:1,
 circ:[{c:"C1",u:"Alumbrado sector 1",p:1100,tipo:"luz",dr:"DR1",L:20},{c:"C2",u:"Alumbrado sector 2",p:1100,tipo:"luz",dr:"DR1",L:24},{c:"C3",u:"Enchufes dormitorios",p:2000,tipo:"enc",dr:"DR1",L:22},{c:"C4",u:"Enchufes living-comedor",p:2000,tipo:"enc",dr:"DR2",L:18},{c:"C5",u:"Cocina y lavadero",p:2500,tipo:"coc",dr:"DR2",L:15},{c:"C6",u:"Horno eléctrico",p:2500,tipo:"esp",dr:"DR2",L:12},{c:"C7",u:"Termo eléctrico",p:2000,tipo:"esp",dr:"DR3",L:16}],
 especiales:[],met:"A1",notas:["Cada diferencial con 3 circuitos como máximo «RIC N°10, 5.1.3.7».","Horno: potencia del equipo, nunca < 1.500 W «RIC N°10, 5.2 e)»."]},
{id:"c200",t:"Vivienda 200 m² con inducción y cargador VE (trifásica)",desc:"4 dormitorios, cocina de inducción 7,4 kW, cargador de vehículo eléctrico 7,4 kW (modo 3), horno 3 kW. Se proyecta empalme trifásico 380/220 V para equilibrar cargas.",
 tipo:"tri",Lal:30,cos:1,
 circ:[{c:"C1",u:"Alumbrado 1",p:1100,tipo:"luz",dr:"DR1",L:22,f:"L3"},{c:"C2",u:"Alumbrado 2",p:1100,tipo:"luz",dr:"DR1",L:26,f:"L3"},{c:"C3",u:"Alumbrado 3",p:1100,tipo:"luz",dr:"DR1",L:28,f:"L3"},{c:"C4",u:"Enchufes 1",p:2000,tipo:"enc",dr:"DR2",L:20,f:"L3"},{c:"C5",u:"Enchufes 2",p:2000,tipo:"enc",dr:"DR2",L:24,f:"L3"},{c:"C6",u:"Enchufes 3",p:2000,tipo:"enc",dr:"DR2",L:26,f:"L3"},{c:"C7",u:"Enchufes 4",p:2000,tipo:"enc",dr:"DR3",L:18,f:"L3"},{c:"C8",u:"Cocina y lavadero",p:2500,tipo:"coc",dr:"DR3",L:15,f:"L3"},{c:"C9",u:"Horno 3 kW",p:3000,tipo:"esp",dr:"DR3",L:12,f:"L3"},{c:"C10",u:"Cocina de inducción 7,4 kW",p:7400,tipo:"esp100",dr:"DR4",L:14,f:"L2"},{c:"C11",u:"Cargador VE 7,4 kW (modo 3)",p:7400,tipo:"esp100",dr:"DR5 tipo B ⚠",L:20,f:"L1"}],
 met:"A1",notas:["Inducción y cargador VE se consideran al 100 % (criterio conservador; ⚠ verificar factor aplicable en «RIC N°03» y «RIC N°15»).","El resto de la carga se agrupa en L3 y se le aplica la Tabla 3.1. Reparto por fases: L1 VE, L2 inducción, L3 resto.","Cargador VE: circuito exclusivo y diferencial con detección de CC «RIC N°15» ⚠.","Demanda del resto en una sola fase: se recomienda en obra repartir los circuitos de uso general entre fases para equilibrar mejor."]}
];

const CHECKLIST=[
["Empalme","Protección del empalme ≥ 25 A y acorde a la demanda «RIC N°10, 5.2»","Medidor accesible; bajada protegida en ducto «RIC N°01» ⚠"],
["Tablero","IP según ubicación «RIC N°02, 6.1.21»","Comandos entre 0,45 y 2,0 m «RIC N°02, 6.1.22»","Barras N y PE separadas e identificadas","Peine sin recortes «RIC N°02, 6.2.4.3»","Rotulación de circuitos","Reserva 25 % «RIC N°02, 6.1.16.3»","Luz piloto (si > 3 circuitos) «RIC N°02, 6.2.14»"],
["Protecciones","Diferencial ≤ 30 mA en circuitos de alumbrado/enchufes «RIC N°10, 5.1.3.5»","Máx. 3 circuitos por diferencial «RIC N°10, 5.1.3.7»","In acorde a la sección (In ≤ Iz')","Curvas adecuadas «RIC N°10, 5.1.4.2»"],
["Conductores y canalización","Colores «RIC N°04, 5.32»","Secciones mínimas «RIC N°04, 5.4»","Llenado ≤ 33 % «RIC N°04, Tabla 4.21»","Recorridos horizontales a 0,30 / 0,20 m «RIC N°04, 7.16.1.16»","Uniones solo en cajas registrables"],
["Puntos","Enchufes de alvéolos protegidos y capacidad ≥ protección «RIC N°10, 5.1.2.8 y 5.1.2.9»","Centros con PE «RIC N°10, 5.1.2.12»","Interruptor en la fase; fase al centro del portalámpara","Cantidades mínimas por recinto «RIC N°10, 5.2»"],
["Tierra","Resistencia ≤ 20 Ω (80 Ω con 6.2) «RIC N°06»","Cámara de inspección registrable","Esquema TN-S «RIC N°10, 5.2 f)»"],
["Ensayos","Continuidad PE «RIC N°19, 7.2.1»","Aislación ≥ 0,5 MΩ a 500 V CC «RIC N°19, Tabla 19.1»","Diferenciales con comprobador","Polaridad","Protocolo firmado"]
];

const ENLACES=[
["Superintendencia de Electricidad y Combustibles (SEC) — normativa y pliegos RIC vigentes","https://www.sec.cl"],
["Ley Chile (Biblioteca del Congreso Nacional) — buscar «Decreto 8 de 2019, Ministerio de Energía»","https://www.bcn.cl/leychile"],
["Diario Oficial — publicaciones de resoluciones SEC","https://www.diariooficial.interior.gob.cl"],
["Ministerio de Energía","https://energia.gob.cl"]
];
