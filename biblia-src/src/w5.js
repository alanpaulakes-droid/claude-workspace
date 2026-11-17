/* ============ ÍCONOS DE LÍNEA (navegación y portada) ============ */
const SVGP = {
  inicio:'<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9v11.5h13V9"/><path d="M10 20.5v-6h4v6"/>',
  "mi-malla":'<rect x="3.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.2"/>',
  herramientas:'<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8.5 6.5h7"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01"/>',
  gestion:'<path d="M3.5 3.5v17h17"/><path d="m7.5 14.5 4-4 3 3 5.5-6"/>',
  informes:'<path d="M14 2.5H6.5A1.5 1.5 0 0 0 5 4v16a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 20V7.5z"/><path d="M14 2.5v5h5"/><path d="M8.5 13h7M8.5 16.5h5"/>',
  aprender:'<path d="M2.5 5.5A1.5 1.5 0 0 1 4 4h5a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4A1.5 1.5 0 0 1 2.5 16z"/><path d="M21.5 5.5A1.5 1.5 0 0 0 20 4h-5a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20a1.5 1.5 0 0 0 1.5-1.5z"/>',
  carrera:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2"/><path d="M3 12.5h18"/>',
  industrias:'<path d="M2.5 20.5h19"/><path d="M4 20.5v-9l5 3v-3l5 3v-9h3.5v15"/>',
  ofimatica:'<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9.5h18M9 4v16"/>',
  simuladores:'<rect x="2.5" y="4" width="19" height="13" rx="1.5"/><path d="M8 20.5h8M12 17v3.5"/><path d="m10.2 8.3 4.3 2.2-4.3 2.2z"/>',
  desarrollo:'<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20.5a7 7 0 0 1 14 0"/>',
  saberes:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>'
};
/* Sistema de íconos: un solo set de línea (24 × 24, trazo 1,7, extremos redondeados). Cada ícono se define
   una vez como <symbol> en un sprite oculto y se reutiliza con <use>. svgIco(id) devuelve la referencia. */
Object.assign(SVGP, {
  buscar:'<circle cx="11" cy="11" r="6.5"/><path d="m20.5 20.5-4.9-4.9"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  cerrar:'<path d="M6 6l12 12M18 6 6 18"/>',
  volver:'<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>',
  "chev-r":'<path d="m9.5 6 6 6-6 6"/>',
  "chev-d":'<path d="m6 9.5 6 6 6-6"/>',
  estrella:'<path d="M12 3.8l2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z"/>',
  "estrella-on":'<path d="M12 3.8l2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z" fill="currentColor"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  equis:'<path d="M7 7l10 10M17 7 7 17"/>',
  descargar:'<path d="M12 3.5v12M7 11l5 5 5-5"/><path d="M4.5 20.5h15"/>',
  imprimir:'<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="1.5"/><path d="M7 14.5h10v6H7z"/>',
  mas:'<circle cx="5.5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18.5" cy="12" r="1.2" fill="currentColor"/>',
  reloj:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  play:'<path d="M8 5.5v13l10.5-6.5z"/>',
  sol:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
  luna:'<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
  auto:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
  info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
  alerta:'<path d="M12 3.5 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.3v.2"/>',
  externo:'<path d="M14 4.5h5.5V10M19.5 4.5 11 13"/><path d="M18 14v5.5H4.5V6H10"/>',
  temas:'<path d="M4 4.5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4z"/><path d="M20 4.5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>',
  /* un ícono por área */
  "a-mat":'<path d="M17.5 5H7l5.5 7L7 19h10.5"/>',
  "a-est":'<path d="M3 19.5h18"/><path d="M4 18.5c3 0 4-12 8-12s5 12 8 12"/>',
  "a-io":'<circle cx="5.5" cy="12" r="2.2"/><circle cx="18.5" cy="6" r="2.2"/><circle cx="18.5" cy="18" r="2.2"/><path d="m7.5 11 9-4M7.5 13l9 4M18.5 8.2v7.6"/>',
  "a-prod":'<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.6M12 17.9v2.6M3.5 12h2.6M17.9 12h2.6M6 6l1.8 1.8M16.2 16.2 18 18M6 18l1.8-1.8M16.2 7.8 18 6"/>',
  "a-cal":'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  "a-log":'<path d="M2.5 6.5h11v10h-11z"/><path d="M13.5 10h4l3 3.5v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
  "a-eco":'<path d="M3.5 20.5h17"/><path d="M6 17V12M10.5 17V8.5M15 17v-6M19.5 17V5.5"/>',
  "a-ges":'<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  "a-prog":'<path d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15"/>',
  "a-seg":'<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>',
  "a-car":'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2"/><path d="M3 12.5h18"/>',
  "a-ref":'<path d="M6.5 3.5h11v17l-5.5-3.5-5.5 3.5z"/>'
});
SVGP.calcular = SVGP.herramientas; SVGP.malla = SVGP["mi-malla"];
const svgIco = id => SVGP[id] ? icoUse(id) : null;
function icoSprite(){ if (document.getElementById("icoSprite")) return;
  const d = document.createElement("div"); d.innerHTML = '<svg id="icoSprite" xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false">' +
    Object.keys(SVGP).map(k => '<symbol id="i-' + k + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + SVGP[k] + "</symbol>").join("") + "</svg>";
  document.body.insertBefore(d.firstChild, document.body.firstChild); }
SVGP["por-area"] = '<path d="M12 3 3 7.5l9 4.5 9-4.5z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>';
SVGP["por-trimestre"] = '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M8 13h2M12 13h2M16 13h1M8 16.5h2M12 16.5h2"/>'; SVGP["favoritos"] = '<path d="M12 3.8l2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z"/>';
