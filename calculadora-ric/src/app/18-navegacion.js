  const PAGES = [
    { id: "home", g: "", t: "Inicio", r: pgHome },
    { id: "hub_proy", g: "hub", t: "Proceso del proyecto", r: pgHubProy2 },
    { id: "hub_calc", g: "hub", t: "Calculadoras r\xE1pidas", r: pgHubCalc },
    { id: "hub_learn", g: "hub", t: "Aprender", r: pgHubLearn },
    { id: "cuadro", g: "plan", t: "Cuadro de carga", r: pgCuadro },
    { id: "tg", g: "plan", t: "Armar tablero (juego)", r: pgTG },
    { id: "sim", g: "taller", t: "Simulador 3D", r: pgSim },
    { id: "casa", g: "taller", t: "Dise\xF1ar mi vivienda", r: pgCasa },
    { id: "pan", g: "taller", t: "Panel de pr\xE1ctica", r: pgPan },
    { id: "asis", g: "asis", t: "Resultados del asistente", r: pgAsis },
    { id: "e1", g: "proy", n: "1", t: "Definici\xF3n del proyecto", r: pgE1 },
    { id: "p1", g: "proy", n: "2", t: "Levantamiento y factibilidad", r: pg1 },
    { id: "p2", g: "proy", n: "3.1", t: "Recintos y puntos", r: pg2, c: calc2 },
    { id: "p3", g: "proy", n: "3.2", t: "Circuitos", r: pg3, c: calc3 },
    { id: "p4", g: "proy", n: "3.3", t: "Demanda y alimentador", r: pg4, c: calc4 },
    { id: "p5", g: "proy", n: "3.4", t: "Protecciones", r: pg5, c: calc5 },
    { id: "p6", g: "proy", n: "3.5", t: "Tablero", r: pg6, c: calc6 },
    { id: "p7", g: "proy", n: "3.6", t: "Puesta a tierra", r: pg7, c: calc7 },
    { id: "p9", g: "proy", n: "3.7", t: "Cuadro de cargas", r: pg9, c: calc9 },
    { id: "e3", g: "proy", n: "3.8", t: "Planos y especificaciones", r: pgE3 },
    { id: "e4", g: "proy", n: "4", t: "Presupuesto y planificaci\xF3n", r: pgE4 },
    { id: "e5", g: "proy", n: "5", t: "Ejecuci\xF3n", r: pgE5 },
    { id: "p8", g: "proy", n: "6", t: "Inspecci\xF3n y ensayos", r: pg8, c: calc8 },
    { id: "e7", g: "proy", n: "7", t: "Documentaci\xF3n y declaraci\xF3n SEC", r: pgE7 },
    { id: "e8", g: "proy", n: "8", t: "Puesta en servicio y entrega", r: pgE8 },
    { id: "t_corriente", g: "calc", t: "Corriente y potencia", r: tCorriente, c: cCorriente },
    { id: "t_potencias", g: "calc", t: "Suma de potencias", r: tPotencias, c: cPotencias },
    { id: "t_caida", g: "calc", t: "Ca\xEDda de tensi\xF3n", r: tCaida, c: cCaida },
    { id: "t_mom", g: "calc", t: "Ca\xEDda en circuitos (momentos)", r: tMom, c: cMom },
    { id: "t_conductor", g: "calc", t: "Elegir conductor", r: tConductor, c: cConductor },
    { id: "t_proteccion", g: "calc", t: "Elegir protecciones", r: tProteccion, c: cProteccion },
    { id: "t_cargas", g: "calc", t: "Cuadro de cargas r\xE1pido", r: tCargas, c: cCargas },
    { id: "t_demanda", g: "calc", t: "Potencia de demanda", r: tDemanda, c: cDemanda },
    { id: "t_puntos", g: "calc", t: "Puntos y recintos", r: tPuntos, c: cPuntos },
    { id: "t_tierra", g: "calc", t: "Puesta a tierra", r: tTierra, c: cTierra },
    { id: "t_ohm", g: "calc", t: "Ley de Ohm", r: tOhm, c: cOhm },
    { id: "t_curvas", g: "calc", t: "Curvas de disparo", r: tCurvas, c: cCurvas },
    { id: "t_icc", g: "calc", t: "Cortocircuito y selectividad", r: tIcc, c: cIcc },
    { id: "t_ev", g: "calc", t: "Cargador de auto el\xE9ctrico", r: tEv, c: cEv },
    { id: "t_fv", g: "calc", t: "Paneles solares (net billing)", r: tFv, c: cFv },
    { id: "t_td", g: "calc", t: "Tablero de distribuci\xF3n", r: tTd, c: cTd },
    { id: "t_energia", g: "calc", t: "Consumo y costo de energ\xEDa", r: tEnergia, c: cEnergia },
    { id: "rep", g: "rep", t: "Reportes", r: pgRep },
    { id: "curso", g: "learn", t: "Curso RIC completo", r: pgCurso },
    { id: "l_conceptos", g: "learn", t: "Conceptos b\xE1sicos", r: pgConceptos },
    { id: "l_comp", g: "learn", t: "Componentes ilustrados", r: pgComp },
    { id: "l_glosario", g: "learn", t: "Glosario", r: pgGlosario },
    { id: "l_tablas", g: "learn", t: "Tablas", r: pgTablas },
    { id: "demo", g: "learn", t: "Demostraciones interactivas", r: pgDemo },
    { id: "ruta", g: "learn", t: "Ruta de aprendizaje", r: pgRuta }
  ];
  const GROUPS = { asis: "Asistente", proy: "Proyecto (8 etapas)", calc: "C\xE1lculos", plan: "Tableros y cuadro", taller: "Simulador 3D", rep: "Reportes", learn: "Normativa y aprender" };
  const PARENT = { asis: "hub_proy", proy: "hub_proy", calc: "hub_calc", learn: "hub_learn", plan: "home", taller: "home", hub: "home", rep: "home" };
  const TABS = [["home", "\u2302", "Inicio"], ["hub_proy", "\u2460", "Proyecto"], ["hub_calc", "\u0192", "C\xE1lculos"], ["cuadro", "\u25A6", "Cuadro"], ["sim", "\u25C8", "3D"], ["rep", "\u2399", "Reportes"], ["hub_learn", "\xA7", "Norma"]];
  function tabOf(id) {
    const p = pageOf(id);
    if (id === "home") return "home";
    if (p.g === "hub") return id;
    if (p.g === "plan") return "cuadro";
    if (p.g === "taller") return "sim";
    if (p.g === "rep") return "rep";
    return PARENT[p.g] || "home";
  }
  let cur = "home";
  try {
    const x = localStorage.getItem(KEY + "-page");
    if (x && PAGES.some((p) => p.id === x)) cur = x;
  } catch (e) {
  }
  const pageOf = (id) => PAGES.find((p) => p.id === id) || PAGES[0];
  function snapOf(id) {
    return id.startsWith("t_") ? JSON.stringify(S.tools[id.slice(2)]) : JSON.stringify({ p: S.proj, r: S.rooms, c: S.circuits, t: S.tierra, e: S.ens, a: S.amp });
  }
  function legend(html) {
    const ks = [...new Set([...html.matchAll(/data-ab="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&")))];
    return ks.length ? learn("Abreviaturas de esta p\xE1gina", '<dl class="gl">'.concat(ks.map((k) => "<dt>".concat(esc(k), "</dt><dd>").concat(esc(GLOS[k] || ""), "</dd>")).join(""), "</dl>")) : "";
  }
  const PKEY = KEY + "-projs";
  const projList = () => {
    try {
      return JSON.parse(localStorage.getItem(PKEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  };
  let projMsg = "";
  function projHTML() {
    const L = projList(), ks = Object.keys(L).sort((a, b) => (L[b].d || 0) - (L[a].d || 0)), nm = S.proj && S.proj.nombre || S.casa && S.casa.n || "";
    return '<section class="card"><div class="sechead"><h2 style="margin:0">Mis proyectos</h2><span class="hint">Se guardan en este navegador; exp\xF3rtalos para respaldarlos o abrirlos en otro equipo.</span></div><div class="chips" style="margin:8px 0"><input type="text" id="projname" value="' + esc(nm) + '" placeholder="Nombre del proyecto" aria-label="Nombre del proyecto" style="min-width:200px;flex:1"><button type="button" class="btn small" data-pj="save">\u{1F4BE} Guardar actual</button><button type="button" class="btn ghost small" data-pj="exp">⬇ Exportar archivo</button><label class="btn ghost small" style="cursor:pointer">⬆ Importar archivo<input type="file" accept=".json,application/json" data-pj="imp" hidden></label><button type="button" class="btn ghost small" data-pj="off" title="Archivo HTML que funciona sin internet, incluida la vista 3D">\u2B07 App sin conexi\xF3n</button><button type="button" class="btn ghost small" data-pj="new">' + (projMsg === "conf-new" ? "\xBFSeguro? Toca otra vez" : "＋ Proyecto nuevo") + "</button></div>" + (projMsg && projMsg !== "conf-new" ? note(esc(projMsg), "ok") : "") + (ks.length ? '<div class="tbl-wrap"><table class="pt"><thead><tr><th>Proyecto</th><th>Guardado</th><th></th></tr></thead><tbody>' + ks.map((k) => "<tr><td><b>" + esc(k) + "</b></td><td>" + new Date(L[k].d || 0).toLocaleString("es-CL") + '</td><td style="white-space:nowrap"><button type="button" class="btn small" data-pj="open" data-k="' + esc(k) + '">Abrir</button> <button type="button" class="btn ghost small" data-pj="dup" data-k="' + esc(k) + '" aria-label="Duplicar ' + esc(k) + '">\u29C9 Duplicar</button> <button type="button" class="btn ghost small" data-pj="del" aria-label="Borrar ' + esc(k) + '" data-k="' + esc(k) + '">' + (projMsg === "conf-del:" + k ? "\xBFBorrar?" : "✕") + "</button></td></tr>").join("") + "</tbody></table></div>" : '<p class="hint" style="margin:0">A\xFAn no guardas proyectos. Al abrir otro, guarda primero el actual.</p>') + "</section>";
  }
  function projLoad(o) {
    if (!o || typeof o !== "object" || !o.proj) return false;
    S = ampMigrate(Object.assign(blankProject(), { amp: Object.assign({}, AMP_DEF), tools: toolBlank() }, o));
    const b = toolBlank();
    for (const k in b) if (!S.tools[k]) S.tools[k] = b[k];
    if (!S.cuadro) S.cuadro = cuadroBlank();
    houseKey = null;
    save();
    return true;
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-pj]");
    if (!b || b.tagName === "INPUT") return;
    const a = b.dataset.pj, L = projList(), k = b.dataset.k;
    const put = (m) => {
      try {
        localStorage.setItem(PKEY, JSON.stringify(m));
        return true;
      } catch (err) {
        projMsg = "No hay espacio en el navegador: exporta y borra proyectos antiguos.";
        return false;
      }
    };
    if (a === "save") {
      const n = (document.getElementById("projname").value || "").trim() || "Proyecto " + (Object.keys(L).length + 1);
      if (S.proj && !S.proj.nombre) S.proj.nombre = n;
      save();
      L[n] = { d: Date.now(), s: JSON.stringify(S) };
      if (put(L)) projMsg = "\xAB" + n + "\xBB guardado.";
    } else if (a === "open" && L[k]) {
      try {
        projLoad(JSON.parse(L[k].s));
        projMsg = "\xAB" + k + "\xBB abierto.";
      } catch (err) {
        projMsg = "No se pudo abrir el proyecto.";
      }
    } else if (a === "dup" && L[k]) {
      let n = k + " (copia)", i = 2;
      while (L[n]) n = k + " (copia " + i++ + ")";
      try {
        const o = JSON.parse(L[k].s);
        if (o.proj) o.proj.nombre = n;
        L[n] = { d: Date.now(), s: JSON.stringify(o) };
        if (put(L)) projMsg = "\xAB" + k + "\xBB duplicado como \xAB" + n + "\xBB.";
      } catch (err) {
        projMsg = "No se pudo duplicar el proyecto.";
      }
    } else if (a === "del") {
      if (projMsg !== "conf-del:" + k) projMsg = "conf-del:" + k;
      else {
        delete L[k];
        put(L);
        projMsg = "\xAB" + k + "\xBB borrado.";
      }
    } else if (a === "new") {
      if (projMsg !== "conf-new") projMsg = "conf-new";
      else {
        projLoad({ proj: blankProject().proj });
        projMsg = "Proyecto nuevo creado. El anterior sigue en la lista si lo guardaste.";
      }
    } else if (a === "off") {
      const cl = document.documentElement.cloneNode(true);
      ["#three-js", "#app > *"].forEach((q) => cl.querySelectorAll(q).forEach((n) => n.remove()));
      dlFile("calculadora-ric-sin-conexion.html", new Blob(["<!doctype html>\n" + cl.outerHTML], { type: "text/html" })).then((rr) => {
        projMsg = dlMsg(rr, "App descargada: \xE1brela con doble clic en el computador o el tel\xE9fono, aun sin internet. Tus proyectos no viajan dentro: exp\xF3rtalos e imp\xF3rtalos en ella.");
        render(true);
      });
      return;
    } else if (a === "exp") {
      const n = (S.proj && S.proj.nombre || "proyecto").replace(/[^\w\-]+/g, "_");
      dlFile(n + ".ric.json", new Blob([JSON.stringify({ app: "calculadora-ric", v: 1, d: Date.now(), S })], { type: "application/json" })).then((rr) => {
        projMsg = dlMsg(rr, "Proyecto exportado.");
        render(true);
      });
      return;
    }
    render(true);
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (!el || !el.matches || !el.matches('[data-pj="imp"]') || !el.files || !el.files[0]) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const o = JSON.parse(String(r.result || "")), d = o && o.S ? o.S : o;
        projMsg = projLoad(d) ? "Proyecto importado." : "El archivo no es un proyecto de esta app.";
      } catch (err) {
        projMsg = "El archivo no es un proyecto v\xE1lido.";
      }
      render(true);
    };
    r.readAsText(el.files[0]);
  });
  function searchHits(q) {
    q = q.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
    if (q.length < 2) return [];
    const nz = (t) => String(t || "").replace(/<[^>]+>/g, "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(), H = [];
    PAGES.forEach((p) => {
      if (nz(p.t + " " + (DESC[p.id] || "")).includes(q)) H.push({ go: p.id, t: p.t, k: GROUPS[p.g] || "Inicio" });
    });
    CU.forEach((l) => {
      if (nz(l.t).includes(q)) H.push({ cu: l.id, t: l.t, k: "Lecci\xF3n" });
    });
    Object.keys(GLOS).forEach((g) => {
      if (nz(g + " " + GLOS[g]).includes(q)) H.push({ go: "l_glosario", t: g + ": " + String(GLOS[g]).slice(0, 60), k: "Glosario" });
    });
    return H.slice(0, 12);
  }
  document.addEventListener("input", (e) => {
    if (!e.target || e.target.id !== "gsearch") return;
    const box = document.getElementById("gsres"), H = searchHits(e.target.value);
    if (box) box.innerHTML = H.map((h) => '<button type="button" ' + (h.cu ? 'data-gscu="' + h.cu + '"' : 'data-go="' + h.go + '"') + '><span class="k">›</span>' + esc(h.t) + ' <small class="hint">' + esc(h.k) + "</small></button>").join("") || (e.target.value.trim().length >= 2 ? '<p class="hint" style="padding:4px 8px;margin:0">Sin resultados</p>' : "");
  });
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-gscu]");
    if (!b) return;
    cuInit().cur = b.dataset.gscu;
    save();
    go("curso");
  });
  function renderSide() {
    let h = '<div class="gsw"><input type="search" id="gsearch" placeholder="\u{1F50D} Buscar c\xE1lculo, lecci\xF3n o t\xE9rmino\u2026" aria-label="Buscar en la app" autocomplete="off"><div id="gsres"></div></div><button type="button" data-go="home" aria-current="'.concat(cur === "home", '"><span class="k">\u2302</span>Inicio</button>');
    let closed = [];
    try {
      closed = JSON.parse(localStorage.getItem(KEY + "-side") || "[]");
    } catch (e) {
    }
    const cg = pageOf(cur).g;
    for (const g of Object.keys(GROUPS)) {
      const op = g === cg || !closed.includes(g);
      h += '<details class="sgp" data-sgp="'.concat(g, '" ').concat(op ? "open" : "", "><summary>").concat(GROUPS[g], "</summary>") + PAGES.filter((p2) => p2.g === g).map((p2) => '<button type="button" data-go="'.concat(p2.id, '" aria-current="').concat(p2.id === cur, '"><span class="k">').concat(p2.n || ICON[p2.id] && ICON[p2.id].length <= 2 && ICON[p2.id] || (g === "calc" ? "\u0192" : "\xB7"), "</span>").concat(p2.t).concat(RES[p2.id] ? '<span class="done">\u2713</span>' : "", "</button>")).join("") + "</details>";
    }
    document.getElementById("side").innerHTML = h;
    const p = pageOf(cur);
    document.getElementById("crumb").textContent = cur === "home" ? "" : (GROUPS[p.g] && p.g !== "plan" && p.g !== "taller" ? "".concat(GROUPS[p.g], " \u203A ") : "") + p.t;
    document.getElementById("backBtn").hidden = cur === "home";
    const tb = tabOf(cur);
    document.getElementById("tabbar").innerHTML = TABS.map(([id, ic, l]) => '<button type="button" data-go="'.concat(id, '" aria-current="').concat(id === tb, '"><span class="ic">').concat(ic, "</span><span>").concat(l, "</span></button>")).join("");
  }
  const GUIA = {
    calc: ["Escribe los datos en los campos; si un valor est\xE1 fuera de rango ver\xE1s debajo qu\xE9 corregir.", "Toca \xABVer con ejemplo\xBB para cargar un caso t\xEDpico y ver c\xF3mo se llena.", "Toca \xABCalcular\xBB: el resultado muestra el desarrollo paso a paso y el pliego RIC que se aplica.", "Si cambias un dato despu\xE9s, el resultado se marca como desactualizado hasta que vuelvas a calcular."],
    proy: ["Avanza por las 8 etapas en orden con los botones del final de la p\xE1gina.", "Completa los campos; los datos se guardan solos en este dispositivo.", "Cada etapa revisa el cumplimiento RIC y te dice qu\xE9 falta y por qu\xE9.", "Al final, genera el informe, la memoria y la l\xE1mina SEC desde Reportes."],
    cuadro: ["Agrega los circuitos con su tipo, puntos y largo.", "La app propone autom\xE1tico, secci\xF3n y diferencial seg\xFAn RIC N\xB003 y N\xB004.", "Revisa las alertas en rojo: cada una explica qu\xE9 corregir.", "Pasa el cuadro al tablero o al simulador 3D para verlo armado."],
    tg: ["Elige un nivel o \xABLibre\xBB y lee el encargo.", "Abre \uD83E\uDDF0 Piezas, elige cada valor (marcados en rojo si falta alguno) y coloca la pieza: autom\xE1tico o tocando un riel.", "Elige un color de cable y toca dos bornes para conectarlos; \u21B6 deshace.", "Toca \xABComprobar\xBB: cada error dice qu\xE9 corregir. Despu\xE9s puedes pasar el tablero al 3D."],
    sim: ["Toca \xABColocar\xBB, elige el elemento y toca un muro o el piso; con \xABConectar\xBB unes la caja o el autom\xE1tico con el punto.", "Arrastra para girar, pellizca para acercar y usa \u26F6 Grande para ver en pantalla completa.", "El bot\xF3n rojo \u26A0 lista los errores RIC con su explicaci\xF3n y la correcci\xF3n propuesta.", "Usa \u21B6 Atr\xE1s para deshacer y los instrumentos para medir tensi\xF3n, continuidad y aislamiento."],
    casa: ["Elige una plantilla o dibuja los recintos con medidas exactas (en metros).", "Mueve y ajusta cada recinto tocando o con los campos num\xE9ricos.", "Revisa las alertas de superficie m\xEDnima y accesos.", "Pasa la vivienda al simulador 3D para instalar los puntos."],
    pan: ["Elige un encargo o arma libremente en la pared de pr\xE1ctica.", "\xABAgregar lo pedido\xBB coloca lo necesario; tambi\xE9n puedes colocar a mano en el 3D.", "\xABComprobar\xBB prueba el circuito y ofrece corregir (con tu autorizaci\xF3n, autom\xE1tico o desactivado).", "Abajo tienes el plano de la pared, el unilineal, el multilineal y los materiales."],
    ruta: ["Sigue los niveles en orden: cada uno combina lecciones, pr\xE1ctica y preguntas tipo SEC.", "Lo que falles entra a \xABRepaso\xBB y vuelve a aparecer en 1, 3, 7, 14 y 30 d\xEDas.", "En \xABContra reloj\xBB dimensiona circuitos en 45 segundos; en \xABSimulacro SEC\xBB rinde 25 preguntas en 40 minutos.", "Cada respuesta explica el porqu\xE9 y cita el pliego RIC."],
    demo: ["Elige una pesta\xF1a: ca\xEDda vs distancia, corriente vs protecci\xF3n, paso a paso o correcto vs incorrecto.", "Mueve los deslizadores: el gr\xE1fico y los valores cambian al instante.", "En \xABPaso a paso\xBB toca Reproducir; en \xABCorrecto vs incorrecto\xBB toca Simular la falla.", "Cada resultado cita el pliego RIC que aplica."],
    rep: ["Revisa que las etapas del proyecto est\xE9n completas.", "Elige el documento: informe t\xE9cnico, memoria, protocolo de ensayos, l\xE1mina o listado de materiales.", "Usa \xABImprimir o guardar PDF\xBB para obtener el archivo."]
  };
  function guiaAdd(html) {
    const p = pageOf(cur), L = GUIA[cur] || GUIA[p.g];
    if (!L || cur === "home" || p.g === "hub" || p.g === "learn") return html;
    const g = '<details class="guia"><summary>\u2139\uFE0F \xBFC\xF3mo se usa esta secci\xF3n? <span class="hint" style="font-weight:400">(' + L.length + " pasos)</span></summary><ol>" + L.map((x) => "<li>" + x + "</li>").join("") + "</ol></details>";
    const m = html.match(/<p class="lead"[^>]*>[\s\S]*?<\/p>/) || html.match(/<\/h1>/);
    if (!m) return g + html;
    const i = m.index + m[0].length;
    return html.slice(0, i) + g + html.slice(i);
  }
  function render(keepFocus) {
    simKill();
    if (cur !== "casa" && casaFull) {
      casaFull = false;
      document.body.classList.remove("tgfsb");
    }
    syncHouse();
    const ae = document.activeElement, fid = keepFocus && ae && ae.id;
    const p = pageOf(cur);
    let html = p.r();
    if (RES[cur] && SNAP[cur] !== snapOf(cur)) {
      html = html.replace('<section class="card result" id="res">', '<section class="card result" id="res"><div class="note stale"><span>Cambiaste datos despu\xE9s de calcular: este resultado ya no corresponde.</span><button class="btn small" type="button" data-act="calc">Recalcular</button></div>');
    }
    if (p.g === "proy") {
      const ps = PAGES.filter((x) => x.g === "proy"), i = ps.findIndex((x) => x.id === cur), pr = ps[i - 1], nx = ps[i + 1];
      html += '<div class="pager">'.concat(pr ? '<button class="btn ghost" type="button" data-go="'.concat(pr.id, '">\u2190 ').concat(pr.n, ". ").concat(pr.t, "</button>") : "<span></span>").concat(nx ? '<button class="btn" type="button" data-go="'.concat(nx.id, '">').concat(nx.n, ". ").concat(nx.t, " \u2192</button>") : "", "</div>");
    }
    if (cur !== "l_glosario") html += legend(html);
    html = guiaAdd(html);
    if (["p3", "p5", "p6"].includes(cur) && S.circuits.length) html += '<section class="card"><div class="sechead"><span class="tag">En vivo</span><h2 style="margin:0">Diagrama unilineal</h2></div><p class="hint">Se actualiza solo cuando cambias circuitos, cargas o largos.</p><div class="tbl-wrap">' + uniSVG() + "</div></section>";
    html = wizWrap(html);
    if (S.migr && S.migr.amp && !S.migr.seen) html = '<div class="note warn migr" role="status"><span><b>Tablas actualizadas al RIC vigente.</b> La capacidad de corriente de los cables ahora sale del RIC N\xB004, Tabla 4.4 (m\xE9todo A1, cable de 70 \xB0C), el llenado de ductos de la Tabla 4.21 y el factor de simultaneidad de la Tabla 3.2 del RIC N\xB003. Algunos resultados de tus proyectos pueden cambiar: rev\xEDsalos.</span> <button class="btn small" type="button" data-go="l_tablas">Ver tablas</button> <button class="btn ghost small" type="button" data-act="migrok">Entendido</button></div>' + html;
    html += '<p class="aviso-sec" role="note">\u2696\uFE0F Herramienta de apoyo para aprender y proyectar. No reemplaza el proyecto ni la firma de un instalador el\xE9ctrico autorizado SEC, ni la lectura del texto vigente de los pliegos RIC. Datos normativos: ' + RIC_DATA.fuente + ' (versi\xF3n de datos ' + RIC_DATA.ver + ').</p>';
    document.getElementById("app").innerHTML = html;
    clampLeads();
    renderSide();
    {
      const st = document.querySelector('.wz [aria-current="step"]');
      if (st && st.scrollIntoView) st.scrollIntoView({ block: "nearest", inline: "center" });
    }
    if (cur === "sim") simMount();
    if (fid) {
      const el = document.getElementById(fid);
      if (el) {
        el.focus({ preventScroll: true });
        if (el.setSelectionRange && el.type === "text") {
          try {
            const l = el.value.length;
            el.setSelectionRange(l, l);
          } catch (e) {
          }
        }
      }
    }
  }
  const HIST = [];
  function show(id) {
    if (tgFull) tgSetFull(false);
    cur = id;
    try {
      localStorage.setItem(KEY + "-page", id);
      if (id !== "home") localStorage.setItem(KEY + "-last", id);
    } catch (e) {
    }
    closeMenu();
    document.getElementById("tip").hidden = true;
    render();
    window.scrollTo({ top: 0 });
  }
  function go(id) {
    if (id === cur) return;
    HIST.push(cur);
    if (HIST.length > 50) HIST.shift();
    try {
      history.pushState({ id }, "");
    } catch (e) {
    }
    show(id);
  }
  function back() {
    let id = HIST.pop();
    if (!id) {
      const p = pageOf(cur);
      id = PARENT[p.g] || "home";
    }
    show(id);
  }
  window.addEventListener("popstate", () => {
    const id = HIST.pop() || PARENT[pageOf(cur).g] || "home";
    show(id);
  });
  try {
    history.replaceState({ id: cur }, "");
  } catch (e) {
  }
  function doCalc() {
    const p = pageOf(cur);
    if (!p.c) return;
    RES[cur] = resultCard(p.c());
    SNAP[cur] = snapOf(cur);
    render();
    const r = document.getElementById("res");
    if (r) r.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
  function markStale() {
    if (!RES[cur]) return;
    const r = document.getElementById("res");
    if (!r || r.querySelector(".stale")) return;
    if (SNAP[cur] !== snapOf(cur)) r.insertAdjacentHTML("afterbegin", '<div class="note stale"><span>Cambiaste datos despu\xE9s de calcular: este resultado ya no corresponde.</span><button class="btn small" type="button" data-act="calc">Recalcular</button></div>');
  }
  function readEl(el) {
    const path = el.dataset.path;
    if (!path) return false;
    let v;
    if (el.dataset.bool) v = el.checked;
    else if (el.dataset.num) v = parseNum(el.value);
    else v = el.value;
    if (path.startsWith("amp.")) {
      if (v > 0) {
        S.amp[path.slice(4).replace("_", ".")] = v;
        S.ampCfg.custom = JSON.stringify(S.amp) !== JSON.stringify(ampTable(S.ampCfg));
      }
      return true;
    }
    if (path.startsWith("ampCfg.")) {
      setP(path, path === "ampCfg.tc" ? +v : v);
      if (!(RIC_DATA.iz[S.ampCfg.tc] || {})[S.ampCfg.met]) S.ampCfg.met = "A1";
      S.amp = ampTable(S.ampCfg);
      S.ampCfg.custom = false;
      return true;
    }
    if (path.startsWith("ens.aisl.")) {
      const i = +path.split(".")[2];
      S.ens.aisl[i] = v;
      return true;
    }
    if (path.startsWith("ens.items.")) {
      S.ens.items[path.split(".")[2]] = v;
      return true;
    }
    setP(path, v);
    const m = path.match(/^circuits\.(\d+)\.tipo$/);
    if (m) {
      const c = S.circuits[+m[1]];
      if (c.tipo === "alumbrado") c.potUnit = 100;
      else if (c.tipo === "enchufes" || c.tipo === "cocina") c.potUnit = 250;
      if (c.tipo === "horno" && !(+c.pot > 0)) c.pot = Math.max(1500, +S.proj.potHorno || 1500);
    }
    const m2 = path.match(/^tools\.cargas\.rows\.(\d+)\.tipo$/);
    if (m2) {
      const r = S.tools.cargas.rows[+m2[1]];
      r.w = v === "alumbrado" ? 100 : v === "horno" ? 2e3 : v === "especial" ? 1e3 : 250;
      if (v === "horno" || v === "especial") r.cant = 1;
    }
    if (path === "tools.conductor.uso") S.tools.conductor.lim = v === "alim" ? 3 : 5;
    if (path === "proj.potHorno") S.circuits.forEach((c) => {
      if (c.tipo === "horno") c.pot = Math.max(1500, v || 1500);
    });
    return true;
  }
  function live() {
    if (cur === "cuadro") cqLive();
    if (cur === "t_potencias") potLive();
  }
  const VRANGE = [
    [/\.(cf)$/, 0.3, 1, "El factor de potencia (cos φ) va entre 0,3 y 1; en vivienda se usa 0,9 a 1."],
    [/\.(fc)$/, 0.1, 1, "El factor de correcci\xF3n va entre 0,1 y 1."],
    [/\.(V|Vmax|Vmp|Voc)$/, 12, 1000, "Revisa la tensi\xF3n: en Chile la red domiciliaria es 220 V (monof\xE1sica) o 380 V (trif\xE1sica)."],
    [/\.(VL)$/, 100, 1000, "La tensi\xF3n entre fases en Chile es 380 V."],
    [/\.(L|La|Lalim|Lac|Lb|Ls|perim)$/, 0.1, 5000, "El largo va en metros, entre 0,1 y 5.000 m."],
    [/\.(rho)$/, 0.01, 0.05, "La resistividad va en Ω\xB7mm\xB2/m: cobre 0,018 y aluminio 0,028."],
    [/\.(lim)$/, 0.5, 10, "El l\xEDmite de ca\xEDda va en %: el RIC N\xB003 fija 3 % para cada tramo y 5 % en total."],
    [/\.(I|In|Ig|Icc|Icc0|idn)$/, 0.01, 1e5, "La corriente debe ser mayor que 0."],
    [/\.(Hz)$/, 40, 70, "En Chile la frecuencia es 50 Hz."],
    [/\.(Tmin)$/, -40, 40, "La temperatura m\xEDnima va en \xB0C, entre -40 y 40."]
  ];
  function numCheck(el) {
    const raw = String(el.value || "").trim(), path = el.dataset.path || "";
    if (!raw) return "";
    if (!/^[-+]?(\d{1,3}(\.\d{3})+|\d+)?([.,]\d+)?$/.test(raw.replace(/\s/g, "")) || !/\d/.test(raw)) return "Escribe solo n\xFAmeros; usa coma o punto para los decimales (ej.: 2,5).";
    const v = parseNum(raw), neg = /\.(Tmin|bVoc|dva|dvA)$/.test(path);
    if (v < 0 && !neg) return "El valor no puede ser negativo.";
    const r = VRANGE.find(([re]) => re.test(path));
    if (r && (v < r[1] || v > r[2])) return r[3];
    return "";
  }
  function numMark(el) {
    const msg = numCheck(el), f = el.closest(".field") || el.parentElement;
    let m = f && f.querySelector(":scope > .ferr");
    el.toggleAttribute("aria-invalid", !!msg);
    if (!msg) {
      if (m) m.remove();
      return;
    }
    if (!m && f) {
      m = document.createElement("small");
      m.className = "ferr";
      m.id = (el.id || "n" + Math.random().toString(36).slice(2)) + "_err";
      f.appendChild(m);
    }
    if (m) {
      if (m.textContent !== msg) m.textContent = msg;
      el.setAttribute("aria-describedby", m.id);
    }
  }
  let enhN = 0;
  function enhance(root) {
    root.querySelectorAll(".field > label:not([for])").forEach((lb) => {
      const c = lb.parentElement.querySelector("input:not([type=checkbox]):not([type=radio]),select,textarea");
      if (!c) return;
      if (!c.id) c.id = "fx" + ++enhN;
      lb.htmlFor = c.id;
    });
    root.querySelectorAll(".field > small:not(.ferr)").forEach((sm) => {
      const c = sm.parentElement.querySelector("input,select,textarea");
      if (!c || c.getAttribute("aria-describedby")) return;
      if (!sm.id) sm.id = "fh" + ++enhN;
      c.setAttribute("aria-describedby", sm.id);
    });
    root.querySelectorAll("input[data-num]").forEach((el) => el.value && numMark(el));
  }
  {
    const app = document.getElementById("app");
    let q = 0;
    if (app) new MutationObserver(() => {
      if (q) return;
      q = requestAnimationFrame(() => {
        q = 0;
        enhance(app);
      });
    }).observe(app, { childList: true, subtree: true });
  }
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (!(el instanceof HTMLElement) || !el.dataset.path || el.tagName === "SELECT" || el.dataset.bool) return;
    if (el.dataset.num) numMark(el);
    if (readEl(el)) {
      save();
      markStale();
      live();
    }
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el && el.id === "rjsonin" && el.files && el.files[0]) {
      const fr = new FileReader();
      fr.onload = () => {
        const m = document.getElementById("rmsg");
        try {
          const o = JSON.parse(fr.result), d = o && o.data ? o.data : o;
          if (!d || !d.proj) throw 0;
          S = d;
          if (!S.tools) S.tools = toolBlank();
          {
            const bb = toolBlank();
            for (const k in bb) if (!S.tools[k]) S.tools[k] = bb[k];
          }
          if (!S.cuadro) S.cuadro = cuadroBlank();
          ampMigrate(S);
          if (!S.sim2) S.sim2 = sim2Blank();
          save();
          render();
          const m2 = document.getElementById("rmsg");
          if (m2) m2.textContent = "Proyecto abierto.";
        } catch (err) {
          if (m) m.textContent = "Ese archivo no es un proyecto de esta app.";
        }
      };
      fr.readAsText(el.files[0]);
      return;
    }
  }, true);
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (!(el instanceof HTMLElement) || !el.dataset.path) return;
    if (!readEl(el)) return;
    save();
    if (el.dataset.re || el.dataset.bool && el.closest("table")) render(true);
    else {
      markStale();
      live();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.matches && e.target.matches("input[data-path]") && !e.target.dataset.bool) {
      e.preventDefault();
      readEl(e.target);
      save();
      if (pageOf(cur).c) doCalc();
      else {
        const f = [...document.querySelectorAll("main input[data-path],main select[data-path]")], i = f.indexOf(e.target);
        if (f[i + 1]) f[i + 1].focus();
        live();
      }
      return;
    }
    const a = e.target.closest && e.target.closest("abbr[data-ab]");
    if (a && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      showTip(a.dataset.ab);
    }
    if (e.key === "Escape") document.getElementById("tip").hidden = true;
    if (e.key === "Escape" && cur === "tg" && tgFull) {
      tgSetFull(false);
      tgRender();
    }
  });
  function showTip(k) {
    const t = document.getElementById("tip");
    delete t.dataset.row;
    document.getElementById("tipk").textContent = k;
    document.getElementById("tipd").textContent = GLOS[k] || "";
    t.hidden = false;
  }
  function showWhy(i) {
    const t = document.getElementById("tip");
    t.dataset.row = i;
    document.getElementById("tipk").textContent = "Verificaci\xF3n del circuito";
    document.getElementById("tipd").innerHTML = cqWhy(i);
    t.hidden = false;
    t.scrollTop = 0;
  }
  function closeMenu() {
    const s = document.getElementById("side");
    if (matchMedia("(max-width:900px)").matches) {
      s.hidden = true;
      document.getElementById("menuBtn").setAttribute("aria-expanded", "false");
    }
  }
  document.getElementById("backBtn").addEventListener("click", back);
  document.getElementById("menuBtn").addEventListener("click", () => {
    const s = document.getElementById("side");
    s.hidden = !s.hidden;
    document.getElementById("menuBtn").setAttribute("aria-expanded", String(!s.hidden));
  });
  function listOf(path) {
    return getP(path);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("abbr[data-ab]");
    if (a) {
      e.preventDefault();
      showTip(a.dataset.ab);
      return;
    }
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.go) {
      go(b.dataset.go);
      return;
    }
    const act = b.dataset.act;
    if (!act) return;
    if (act === "tipclose") {
      document.getElementById("tip").hidden = true;
      return;
    }
    if (act === "tpl") {
      const keep = S.sim2 ? { done: S.sim2.done, score: S.sim2.score, log: S.sim2.log } : {};
      S.sim2 = Object.assign(simTemplate(b.dataset.k), keep);
      simInsp = null;
      simSel = null;
      simPC = null;
      simSheet = null;
      save();
      if (cur === "sim") {
        simRefresh([["ok", "Plantilla cargada: " + (TPLS.find((t) => t[0] === b.dataset.k) || [])[2]]]);
      } else go("sim");
      return;
    }
    if (act === "rpdf") {
      try {
        window.print();
      } catch (err) {
        const m = document.getElementById("rmsg");
        if (m) m.textContent = "Tu navegador no permite imprimir aqu\xED: usa Compartir \u2192 Imprimir.";
      }
      return;
    }
    if (act === "rxls") {
      const m = document.getElementById("rmsg");
      if (m) m.textContent = "Generando Excel\u2026";
      repXLSX(m);
      return;
    }
    if (act === "rsvg") {
      const m = document.getElementById("rmsg");
      dlFile("plano-planta.svg", new Blob([planSVG(S.sim2)], { type: "image/svg+xml" })).then((rr) => {
        if (m) m.textContent = dlMsg(rr, "Plano descargado.");
      });
      return;
    }
    if (act === "rmem") {
      const m = document.getElementById("rmsg");
      dlFile("memoria-explicativa.html", new Blob([memoriaHTML(S.sim2, true)], { type: "text/html" })).then((rr) => {
        if (m) m.textContent = dlMsg(rr, "Memoria descargada: \xE1brela con Word o el navegador.");
      });
      return;
    }
    if (act === "rcopy") {
      const txt = repCSV(), m = document.getElementById("rmsg");
      try {
        navigator.clipboard.writeText(txt).then(() => {
          m.textContent = "Copiado: p\xE9galo en Excel.";
        }, () => {
          m.textContent = "No se pudo copiar.";
        });
      } catch (err) {
        m.textContent = "No se pudo copiar.";
      }
      return;
    }
    if (act === "rjson") {
      const ok = dlFile((S.proj && S.proj.nombre || "proyecto-ric").replace(/[^\w\-]+/g, "_") + ".json", new Blob([JSON.stringify({ app: "calculadora-ric", v: 3, data: S }, null, 1)], { type: "application/json" }));
      const m = document.getElementById("rmsg");
      ok.then((rr) => {
        if (m) m.textContent = dlMsg(rr, "Proyecto guardado como archivo.");
      });
      return;
    }
    if (act === "cqwhy") {
      showWhy(+b.dataset.i);
      return;
    }
    if (act === "calc") {
      doCalc();
      return;
    }
    if (act === "add") {
      const L = listOf(b.dataset.list);
      if (b.dataset.list === "rooms") L.push({ nombre: "", tipo: "dormitorio", area: 0, perim: 0, centros: 0, enchufes: 0, horno: false });
      else if (b.dataset.list === "circuits") L.push({ nombre: "", tipo: "enchufes", puntos: 0, potUnit: 250, pot: 0, L: 0, inForz: "auto" });
      else if (b.dataset.list === "cuadro.rows") L.push(cqRow());
      else if (b.dataset.list === "tools.potencias.rows") L.push({ n: "", cant: 0, w: 0 });
      else L.push({ n: "", tipo: "enchufes", cant: 0, w: 250, L: 0 });
    }
    if (act === "del") {
      listOf(b.dataset.list).splice(+b.dataset.i, 1);
      if (b.dataset.list === "circuits") S.ens.aisl = [];
    }
    if (act === "dup") {
      const L = listOf(b.dataset.list), i = +b.dataset.i, o = Object.assign({}, L[i]);
      if ("nombre" in o) o.nombre = (o.nombre || "") + " (copia)";
      if ("n" in o) o.n = (o.n || "") + " (copia)";
      L.splice(i + 1, 0, o);
      if (b.dataset.list === "circuits") S.ens.aisl = [];
    }
    if (act === "gen") {
      S.circuits = genCircuits(S);
      S.ens.aisl = [];
    }
    if (act === "cqclear") S.tools.cargas.rows = [];
    if (act === "padd") {
      const L = S.tools.potencias.rows, ex = L.find((r) => r.n === b.dataset.n && +r.w === +b.dataset.w);
      if (ex) ex.cant = (+ex.cant || 0) + 1;
      else L.push({ n: b.dataset.n, cant: 1, w: +b.dataset.w });
    }
    if (act === "pclear") S.tools.potencias.rows = [];
    if (act === "p2prot" || act === "p2cond") {
      const P = potTotal(S.tools.potencias), k = act === "p2prot" ? "proteccion" : "conductor";
      Object.assign(S.tools[k], { ent: "P", P });
      save();
      go("t_" + k);
      doCalc();
      return;
    }
    if (act === "cqdef") Object.assign(S.cuadro, { V: 220, Hz: 50, wPL: 100, wEG: 250, wE2: 500, wE3: 1200 });
    if (act === "del" && b.dataset.list === "cuadro.rows") document.getElementById("tip").hidden = true;
    if (act === "cqempty") {
      if (b.dataset.ok !== "1") {
        b.dataset.ok = "1";
        b.textContent = "\xBFSeguro? Toca otra vez";
        return;
      }
      S.cuadro.rows = [];
    }
    if (act === "cqcopy") {
      const txt = cqCSV(), msg = document.getElementById("cqmsg");
      const fb = () => {
        const ta = document.createElement("textarea");
        ta.value = txt;
        ta.style.width = "100%";
        ta.rows = 6;
        msg.replaceWith(ta);
        ta.select();
      };
      try {
        navigator.clipboard.writeText(txt).then(() => {
          msg.textContent = "Copiado. P\xE9galo en Excel.";
        }, fb);
      } catch (err) {
        fb();
      }
      return;
    }
    if (act === "tclear") {
      S.tools[b.dataset.k] = toolBlank()[b.dataset.k];
      delete RES["t_" + b.dataset.k];
    }
    if (act === "protdoc") {
      const w = window.open("", "_blank");
      if (w && w.document) {
        w.document.open();
        w.document.write(protocoloDoc());
        w.document.close();
      } else dlFile("protocolo-ensayos.html", new Blob([protocoloDoc()], { type: "text/html" }));
      return;
    }
    if (act === "tex") {
      S.tools[b.dataset.k] = toolExample(b.dataset.k);
      save();
      render();
      doCalc();
      return;
    }
    if (act === "migrok") {
      S.migr.seen = 1;
      save();
      render();
      return;
    }
    if (act === "ampdef") {
      S.amp = ampTable(S.ampCfg);
      S.ampCfg.custom = false;
      save();
      render();
      return;
    }
    if (act === "askproj") {
      const ex = b.dataset.k === "ex";
      document.getElementById("confirm").innerHTML = '<span class="hint">'.concat(ex ? "Se reemplazar\xE1 tu proyecto por el ejemplo." : "Se borrar\xE1n recintos, circuitos y mediciones.", '</span> <button class="btn danger small" type="button" data-act="doproj" data-k="').concat(b.dataset.k, '">S\xED, ').concat(ex ? "cargar ejemplo" : "borrar", '</button> <button class="btn ghost small" type="button" data-act="noproj">Cancelar</button>');
      return;
    }
    if (act === "noproj") {
      document.getElementById("confirm").innerHTML = "";
      return;
    }
    if (act === "doproj") {
      const np = b.dataset.k === "ex" ? exampleProject() : blankProject();
      Object.assign(S, np);
      PAGES.filter((p) => p.g === "proy").forEach((p) => {
        delete RES[p.id];
        delete SNAP[p.id];
      });
    }
    save();
    render();
  });
