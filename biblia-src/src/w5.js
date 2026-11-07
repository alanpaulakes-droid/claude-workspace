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
const svgIco = id => SVGP[id] ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + SVGP[id] + "</svg>" : null;
SVGP["por-area"] = '<path d="M12 3 3 7.5l9 4.5 9-4.5z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>';
SVGP["por-trimestre"] = '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M8 13h2M12 13h2M16 13h1M8 16.5h2M12 16.5h2"/>'; SVGP["favoritos"] = '<path d="M12 3.8l2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z"/>';
