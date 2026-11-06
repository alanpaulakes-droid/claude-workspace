  function simErrs(s) {
    if (s.exam && !s.exam.res) return [];
    return simInspect(s).filter((o) => !o.fault);
  }
  function errListHTML(errs) {
    if (!errs.length) return note("Sin errores: lo que llevas armado cumple las reglas que revisa la app.", "ok");
    return '<ul class="whyl">'.concat(errs.map((o) => {
      const go2 = o.box != null ? "b:" + o.box : o.id != null ? "i:" + o.id : o.room ? "r:" + o.room : o.tab || o.cid != null ? "t" : "";
      return '<li class="badc"><b>\u2717 '.concat(esc(o.t), "</b><br>").concat(esc(o.d), '<br><span class="hint">Por qu\xE9: ').concat(esc(o.w), "</span>").concat(go2 ? '<br><button class="btn ghost small" type="button" data-sa="errgo" data-x="'.concat(go2, '" style="margin-top:6px">').concat(o.box != null ? "Abrir la caja" : "Ver en 3D", "</button>") : "", "</li>");
    }).join(""), "</ul>");
  }
  function simConnSVG(s) {
    const groups = simDRs(s).map((d) => ({ d, cs: s.circuits.filter((c) => c.dr === d) }));
    const nod = s.circuits.filter((c) => c.dr === "none");
    if (nod.length) groups.push({ d: null, cs: nod });
    const cx = {};
    let slot = 0;
    groups.forEach((gr) => {
      gr.x0 = 70 + slot * 96;
      gr.cs.forEach((c) => {
        cx[c.id] = 70 + slot * 96 + 48;
        slot++;
      });
      gr.x1 = 70 + slot * 96;
      gr.cx = (gr.x0 + gr.x1) / 2;
    });
    const W = Math.max(520, 90 + slot * 96), needBar = s.circuits.some((c) => c.dr === "none" || c.nc === "bar");
    let g = "";
    const box = (x, y, w, h, t1, t2, bad) => '<rect x="'.concat(x, '" y="').concat(y, '" width="').concat(w, '" height="').concat(h, '" rx="5" class="f-surf" stroke="').concat(bad ? "var(--bad)" : "var(--ink)", '" stroke-width="').concat(bad ? 3 : 2, '"/>') + tx(x + w / 2, y + h / 2 - (t2 ? 7 : 0), t1, "tb") + (t2 ? tx(x + w / 2, y + h / 2 + 9, t2, "ts") : "");
    g += tx(14, 14, "Desde el medidor", "ts", "start") + wl(40, 24, 40, 48, WC.T) + wl(56, 24, 56, 48, WC.N) + box(24, 48, 48, 44, "IG", "".concat(s.gen.In, " A"));
    g += wl(40, 92, 40, 112, WC.T) + wl(56, 92, 56, 124, WC.N) + wl(40, 112, W - 24, 112, WC.T) + wl(56, 124, W - 24, 124, WC.N);
    g += tx(W - 20, 104, "Fase", "ts", "end") + tx(W - 20, 136, "Neutro", "ts", "end");
    if (needBar) {
      g += wl(30, 124, 30, 300, WC.N) + wl(30, 124, 56, 124, WC.N) + '<rect x="24" y="296" width="'.concat(W - 48, '" height="8" rx="2" fill="').concat(WC.N, '" stroke="#8a8a8a"/>') + tx(W - 20, 288, "Barra N general", "ts", "end");
    }
    g += '<rect x="24" y="316" width="'.concat(W - 48, '" height="8" rx="2" fill="').concat(WC.PE, '"/>') + tx(W - 20, 334, "Barra PE", "ts", "end") + wl(14, 320, 24, 320, WC.PE) + wl(14, 320, 14, 345, WC.PE) + gnd(14, 348);
    groups.forEach((gr) => {
      if (gr.d) {
        const bad = gr.cs.length > 3;
        g += wl(gr.cx - 12, 112, gr.cx - 12, 146, WC.T) + wl(gr.cx + 12, 124, gr.cx + 12, 146, WC.N) + box(gr.cx - 34, 146, 68, 44, gr.d, "".concat(Math.max(...gr.cs.map((c) => +c.ds)), " mA"), bad);
        g += wl(gr.cx - 12, 190, gr.cx - 12, 206, WC.T) + wl(gr.x0 + 20, 206, gr.x1 - 20, 206, WC.T) + wl(gr.cx + 12, 190, gr.cx + 12, 280, WC.N) + wl(gr.x0 + 34, 280, gr.x1 - 6, 280, WC.N);
      } else {
        g += wl(gr.x0 + 20, 112, gr.x0 + 20, 206, WC.T) + wl(gr.x0 + 20, 206, gr.x1 - 20, 206, WC.T) + tx(gr.cx, 160, "Sin diferencial", "ts bad");
      }
      gr.cs.forEach((c) => {
        const k = cIdx(s, c.id), x = cx[c.id], wrongN = c.dr !== "none" && c.nc === "bar", noPE = c.pe === false;
        g += wl(x - 20, 206, x - 20, 222, WC.T) + box(x - 34, 222, 44, 34, "C".concat(k + 1), "".concat(c.In, "A ").concat(c.cv)) + wl(x - 20, 256, x - 20, 360, WC.T);
        if (c.dr !== "none" && !wrongN) g += wl(x, 280, x, 360, WC.N);
        else g += '<line x1="'.concat(x, '" y1="300" x2="').concat(x, '" y2="360" stroke="').concat(wrongN ? "var(--bad)" : "#8a8a8a", '" stroke-width="').concat(wrongN ? 4 : 6.5, '" ').concat(wrongN ? 'stroke-dasharray="6 4"' : "", "/>") + (wrongN ? "" : '<line x1="'.concat(x, '" y1="300" x2="').concat(x, '" y2="360" stroke="').concat(WC.N, '" stroke-width="4"/>'));
        if (noPE) g += tx(x + 20, 342, "\u2717", "tb bad");
        else g += wl(x + 20, 320, x + 20, 360, WC.PE);
        g += tx(x, 376, c.n ? esc(c.n.slice(0, 11)) : "Circuito ".concat(k + 1), "ts") + (wrongN ? tx(x, 292, "\u26A0", "tb bad") : "");
      });
    });
    return fig("0 0 ".concat(W, " 390"), g, "Conexiones del tablero: la fase pasa por el general, el diferencial y el autom\xE1tico de cada circuito. El neutro de cada circuito sale de su diferencial. La tierra (PE) va directa de la barra PE a cada circuito. En rojo, lo que est\xE1 mal conectado.", "Diagrama de conexiones del tablero");
  }
  const PRESET = { alum: ["Alumbrado", 10, "B", 1.5, "lamp"], enc: ["Enchufes", 16, "C", 2.5, "out"], coc: ["Cocina y lavadero", 16, "C", 2.5, "out"], horno: ["Horno", 16, "C", 2.5, "horno"], otro: ["", 16, "C", 2.5, "out"] };
  function nextDRname(s) {
    const n = simDRs(s).map((d) => +d.slice(2) || 0);
    return "DR" + (Math.max(0, ...n) + 1);
  }
  function tabSheetHTML(s) {
    const drs = simDRs(s), nx = nextDRname(s), cnt = (d) => s.circuits.filter((c) => c.dr === d).length;
    const drOpts = (cur2) => drs.map((d) => [d, d]).concat([[nx, "Nuevo: ".concat(nx)], ["none", "Sin diferencial"]]);
    const add = '<div class="tb-add"><b>Agregar disyuntor</b> <span class="hint">Cada disyuntor es un circuito nuevo.</span>\n   <div class="field"><label>Lo protege</label><select data-sx="newdr" aria-label="Diferencial del nuevo circuito"><option value="auto" '.concat(simNewDR === "auto" ? "selected" : "", ">Autom\xE1tico (m\xE1x. 3 circuitos por diferencial)</option>").concat(drs.map((d) => '<option value="'.concat(d, '" ').concat(simNewDR === d ? "selected" : "", ">").concat(d, " (").concat(cnt(d), " circuito").concat(cnt(d) === 1 ? "" : "s", ")</option>")).join(""), '<option value="new" ').concat(simNewDR === "new" ? "selected" : "", ">Nuevo diferencial ").concat(nx, '</option><option value="none" ').concat(simNewDR === "none" ? "selected" : "", '>Sin diferencial (no recomendado)</option></select></div>\n   <div class="pb-t">').concat(Object.entries(PRESET).map(([k, v]) => '<button type="button" data-sa="addc2" data-k="'.concat(k, '" ').concat(s.circuits.length >= 8 ? "disabled" : "", ">+ ").concat(v[0] || "Otro", " <small>").concat(v[1], " A \xB7 ").concat(v[2], " \xB7 ").concat(String(v[3]).replace(".", ","), " mm\xB2</small></button>")).join(""), "</div></div>");
    const drl = drs.length ? drs.map((d) => {
      const cc = s.circuits.filter((c) => c.dr === d);
      return "<tr><td><b>".concat(d, '</b><br><span class="hint">').concat(cc.map((c) => "C" + (cIdx(s, c.id) + 1)).join(", "), "</span></td><td>").concat(drIn(s), ' A</td><td><select data-sx="drds" data-dr="').concat(d, '" aria-label="Sensibilidad ').concat(d, '">').concat([[10, "10 mA"], [30, "30 mA"], [300, "300 mA"]].map(([v, l]) => '<option value="'.concat(v, '" ').concat(+cc[0].ds === v ? "selected" : "", ">").concat(l, "</option>")).join(""), '</select></td><td><select data-sx="drcl" data-dr="').concat(d, '" aria-label="Clase ').concat(d, '">').concat(["A", "AC", "F", "B"].map((v) => "<option ".concat(cc[0].cl === v ? "selected" : "", ">").concat(v, "</option>")).join(""), "</select></td></tr>");
    }).join("") : "";
    const dr = "<b>Diferenciales</b>".concat(drs.length ? '<div class="tbl-wrap"><table class="pt"><thead><tr><th>DR</th><th>In</th><th>I\u0394n</th><th>Clase</th></tr></thead><tbody>'.concat(drl, "</tbody></table></div>") : '<p class="hint">A\xFAn no hay diferenciales.</p>', '<p class="hint" style="margin:4px 0 0">Un diferencial aparece cuando le asignas al menos un circuito. Para agregar uno, elige \xABNuevo diferencial\xBB al crear un disyuntor o c\xE1mbiale el diferencial a un circuito.</p>');
    const rows = s.circuits.map((c, k) => "<tr><td><b>C".concat(k + 1, '</b></td><td><input type="text" data-sp="circuits.').concat(k, '.n" value="').concat(esc(c.n), '" placeholder="Nombre" style="width:110px"></td><td>').concat(sSel("circuits.".concat(k, ".In"), [[6, "6 A"], [10, "10 A"], [16, "16 A"], [20, "20 A"], [25, "25 A"], [32, "32 A"]], c.In, "In"), "</td><td>").concat(sSel("circuits.".concat(k, ".cv"), [["B", "B"], ["C", "C"], ["D", "D"]], c.cv, "Curva"), "</td><td>").concat(sSel("circuits.".concat(k, ".S"), [[1.5, "1,5"], [2.5, "2,5"], [4, "4"], [6, "6"]], c.S, "Secci\xF3n"), "</td>").concat(s.sys === "tri" ? "<td>".concat(sSel("circuits.".concat(k, ".ph"), [["R", "R"], ["S", "S"], ["T", "T"]], c.ph || "R", "Fase"), "</td>") : "", "<td>").concat(sSel("circuits.".concat(k, ".dr"), drOpts(c.dr).concat(drs.includes(c.dr) || c.dr === "none" || c.dr === nx ? [] : [[c.dr, c.dr]]), c.dr, "Diferencial"), "</td><td>").concat(sSel("circuits.".concat(k, ".nc"), (c.dr === "none" ? [["dr", "Barra N"]] : [["dr", "N ".concat(c.dr)], ["bar", "Barra N gral."]]).concat([["off", "Suelto"]]), c.dr === "none" && c.nc === "bar" ? "dr" : c.nc || "dr", "Neutro"), "</td><td>").concat(sSel("circuits.".concat(k, ".pe"), [["1", "Barra PE"], ["0", "Suelta"]], c.pe === false ? "0" : "1", "Tierra"), '</td><td><button type="button" class="btn ').concat(c.on ? "" : "ghost", ' small" data-sa="ctog" data-c="').concat(c.id, '">').concat(c.on ? "ON" : "OFF", '</button></td><td><button type="button" class="btn danger small" data-sa="delc" data-c="').concat(c.id, '" aria-label="Eliminar C').concat(k + 1, '">').concat(simConfirm === "c" + c.id ? "\xBFSeguro?" : "\u2715", "</button></td></tr>")).join("");
    const tm = '<div class="hud-btns" style="margin:0 0 8px;align-items:center"><button type="button" class="btn ghost small" data-sa="totg">\u26A1 Armar este tablero en el juego</button><span class="hint">Lo que armes all\xED vuelve con \xABUsar este tablero en el 3D\xBB.</span></div><b>Disyuntores (autom\xE1ticos)</b>'.concat(s.circuits.length ? '<div class="tbl-wrap"><table class="pt"><thead><tr><th></th><th>Nombre</th><th>In</th><th>Curva</th><th>mm\xB2</th>'.concat(s.sys === "tri" ? "<th>Fase</th>" : "", "<th>Fase desde</th><th>Neutro a</th><th>Tierra a</th><th></th><th></th></tr></thead><tbody>").concat(rows, "</tbody></table></div>") : '<p class="hint">Sin disyuntores todav\xEDa.</p>', '\n   <div class="field" style="margin-top:6px"><label>Interruptor general</label>').concat(sSel("gen.In", [[20, "20 A"], [25, "25 A"], [32, "32 A"], [40, "40 A"], [50, "50 A"], [63, "63 A"]], s.gen.In, "General"), "</div>");
    const canh = '<div class="wm"><span>Canalizaci\xF3n:</span><button type="button" data-sa="inst" data-v="emb" aria-pressed="'.concat(s.inst !== "vista", '">Dentro del muro</button><button type="button" data-sa="inst" data-v="vista" aria-pressed="').concat(s.inst === "vista", '">A la vista (fuera)</button></div><div class="wm"><span>Tubo:</span>').concat([["pvc", "PVC conduit"], ["emt", "Met\xE1lico EMT"], ["flex", "Flexible corrugado"]].map(([k, l]) => '<button type="button" data-sa="dtype" data-v="'.concat(k, '" aria-pressed="').concat((s.duct || "pvc") === k, '">').concat(l, "</button>")).join(""), "</div>");
    const sysh = canh + '<div class="wm"><span>Sistema:</span><button type="button" data-sa="sys" data-v="mono" aria-pressed="'.concat(s.sys !== "tri", '">Monof\xE1sico 220 V</button><button type="button" data-sa="sys" data-v="tri" aria-pressed="').concat(s.sys === "tri", '">Trif\xE1sico 380/220 V</button>').concat(s.sys === "tri" ? '<button type="button" data-sa="balph">\u2696 Balancear fases</button>' : "", "</div>").concat(s.sys === "tri" ? (() => {
      const ev = simEval(s), mx = Math.max(1, ev.Pph.R, ev.Pph.S, ev.Pph.T);
      return '<div class="phb">'.concat(["R", "S", "T"].map((f) => "<div><b>".concat(f, '</b><span style="width:').concat(ev.Pph[f] / mx * 100, "%;background:").concat({ R: "#1F5FBF", S: "#333", T: "#C0392B" }[f], '"></span><em>').concat(n0(ev.Pph[f]), " W</em></div>")).join(""), "</div>");
    })() : "");
    const wmh = sysh + '<div class="wm"><span>Empalmes en cajas:</span><button type="button" data-sa="wm" data-v="auto" aria-pressed="'.concat(s.wm !== "man", '">Autom\xE1ticos</button><button type="button" data-sa="wm" data-v="man1" aria-pressed="').concat(s.wm === "man", '">Los hago yo</button></div><p class="hint" style="margin:2px 0 8px">Conexiones del tablero: la fase de cada autom\xE1tico sale de su diferencial; el neutro va a la salida N de ese diferencial; la tierra a la barra PE. C\xE1mbialas para ver qu\xE9 pasa.</p>');
    return add + wmh + tm + dr + '<div class="actions" style="border:0;padding:6px 0 0"><button type="button" class="btn small" data-sa="tool" data-k="place">Ir a colocar puntos</button><button type="button" class="btn ghost small" data-sa="connon">Ver conexiones</button><button type="button" class="btn ghost small" data-sa="tgsim">\u26A1 Cablear el tablero cable a cable</button></div>';
  }
  let simSheetWas = null;
  function renderSheet() {
    try {
      renderSheet0();
    } finally {
      simWrapCls();
      if (simSheet && simSheet !== simSheetWas && window.innerWidth < 900) {
        const w = document.getElementById("simwrap"), r = w && w.getBoundingClientRect();
        if (r && (r.top < 60 || r.bottom > window.innerHeight)) w.scrollIntoView({ block: "start" });
      }
      simSheetWas = simSheet;
    }
  }
  function renderSheet0() {
    const sh = document.getElementById("simsheet");
    if (!sh) return;
    {
      const bd0 = document.getElementById("shbody");
      if (bd0) bd0.classList.toggle("boxmode", !!(simSheet && simSheet.startsWith("box:")));
    }
    if (!simSheet) {
      sh.hidden = true;
      return;
    }
    sh.hidden = false;
    const s = S.sim2, errs = simErrs(s);
    const bd = document.getElementById("shbody"), st = bd.scrollTop;
    if (simSheet && simSheet.startsWith("box:")) {
      const b = s.items.find((i) => i.id === +simSheet.slice(4) && i.t === "box");
      if (!b) {
        simSheet = null;
        sh.hidden = true;
        return;
      }
      document.getElementById("shtitle").textContent = "".concat(b.name, " \xB7 empalmes");
      bd.innerHTML = boxSheetHTML(s, b);
      bd.scrollTop = st;
      return;
    }
    if (simSheet === "tab") {
      document.getElementById("shtitle").textContent = "Tablero: disyuntores y diferenciales";
      bd.innerHTML = tabSheetHTML(s);
      bd.scrollTop = st;
      return;
    }
    if (simSheet === "err") {
      document.getElementById("shtitle").textContent = "Errores (".concat(errs.length, ")");
      document.getElementById("shbody").innerHTML = errListHTML(errs);
    } else {
      document.getElementById("shtitle").textContent = "Conexiones del tablero";
      const te = errs.filter((o) => o.tab);
      document.getElementById("shbody").innerHTML = (s.circuits.length ? simConnSVG(s) : note("Agrega circuitos para ver sus conexiones.")) + (te.length ? '<p style="margin:8px 0 4px"><b>Errores de conexi\xF3n</b></p>' + errListHTML(te) : note("Las conexiones del tablero est\xE1n correctas.", "ok")) + '<p class="hint">Puedes cambiar d\xF3nde se conecta el neutro y la tierra de cada circuito en su ficha, m\xE1s abajo.</p>';
    }
  }
  function updErr(toast) {
    const errs = simErrs(S.sim2), b = document.getElementById("simerr");
    if (b) {
      b.textContent = S.sim2.exam && !S.sim2.exam.res ? "\u{1F3AF}" : errs.length ? "\u26A0 ".concat(errs.length) : "\u2713 0";
      b.className = S.sim2.exam && !S.sim2.exam.res ? "eb" : errs.length ? "eb bad" : "eb ok";
    }
    const now = new Set(errs.map((o) => o.t));
    let nw = [];
    if (simPrevErr && toast) nw = errs.filter((o) => !o.quiet && !simPrevErr.has(o.t)).slice(0, 2).map((o) => ["warn", "\u26A0 " + o.t + ". " + o.w]);
    simPrevErr = now;
    return nw;
  }
  function simSetFl(v) {
    simFl = NFL > 1 ? v : -1;
    document.querySelectorAll('[data-sa="fl"]').forEach((x) => x.setAttribute("aria-pressed", String(+x.dataset.v === simFl)));
    if (!SIMV) return;
    SIMV.applyFl();
    if (SIMV.mode === "walk" && simFl < 0) simFl = 0;
    if (SIMV.cutH != null) SIMV.setCut(SIMV.cutH);
    if (SIMV.mode !== "walk") SIMV.set({ y: simFl > 0 ? FH + 0.6 : simFl < 0 ? FH * 0.6 : 0.6 });
    else if (!SIMV.okAt(SIMV.w.x, SIMV.w.z)) {
      const r = ROOMS.filter((q) => (q.f || 0) === simFl && q.t !== "escalera").sort((a, b) => rArea(b) - rArea(a))[0];
      if (r) SIMV.wTo({ x: (r.x0 + r.x1) / 2, z: (r.z0 + r.z1) / 2 });
    }
    SIMV.updRL();
  }
  function applyWalls() {
    if (!SIMV) return;
    const m = SIMV.wallM;
    if (simWall === 2) {
      m.transparent = false;
      m.opacity = 1;
      m.depthWrite = true;
    } else {
      m.transparent = true;
      m.opacity = simWall ? 0.32 : 0.07;
      m.depthWrite = false;
    }
    m.needsUpdate = true;
    const c = SIMV.ceilM;
    if (c) {
      c.visible = simCeil > 0;
      if (simCeil === 3) {
        c.transparent = false;
        c.opacity = 1;
        c.depthWrite = true;
      } else {
        c.transparent = true;
        c.opacity = [0, 0.1, 0.4][simCeil] || 0.1;
        c.depthWrite = false;
      }
      c.needsUpdate = true;
    }
    SIMV.dirty = true;
  }
  let simTabView = "dis", TABTEX = null;
  function tabTex(s) {
    const ti = s.tabImg;
    if (!ti) return null;
    if (TABTEX && TABTEX.t === ti.t) return TABTEX.tex;
    if (TABTEX && TABTEX.loading === ti.t) return null;
    TABTEX = { loading: ti.t };
    const img = new Image();
    img.onload = () => {
      const cw = 1600, ch = Math.round(cw * ti.h / ti.w), c = document.createElement("canvas");
      c.width = cw;
      c.height = ch;
      const x = c.getContext("2d");
      x.fillStyle = "#e9edf0";
      x.fillRect(0, 0, cw, ch);
      x.drawImage(img, 0, 0, cw, ch);
      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 4;
      TABTEX = { t: ti.t, tex };
      if (SIMV && cur === "sim") simBuild();
    };
    img.onerror = () => {
      TABTEX = { t: ti.t, tex: null };
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(ti.svg);
    return null;
  }
  const GEOC = /* @__PURE__ */ new Map();
  function geoC(k, mk) {
    let g = GEOC.get(k);
    if (!g) {
      if (GEOC.size > 4e3) GEOC.clear();
      g = mk();
      g.userData.keep = 1;
      GEOC.set(k, g);
    }
    return g;
  }
  function loadThree(ok, fail) {
    if (window.THREE) return ok();
    const src = document.getElementById("three-src");
    if (src && src.textContent.length > 1e5) {
      try {
        const sc2 = document.createElement("script");
        sc2.id = "three-js";
        sc2.textContent = src.textContent;
        document.head.appendChild(sc2);
      } catch (e) {
      }
      if (window.THREE) return ok();
    }
    let s = document.getElementById("three-js");
    if (!s) {
      s = document.createElement("script");
      s.id = "three-js";
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      document.head.appendChild(s);
    }
    s.addEventListener("load", () => ok(), { once: true });
    s.addEventListener("error", () => fail(), { once: true });
  }
  function simFail() {
    const w = document.getElementById("simwrap");
    if (w) w.innerHTML = '<div class="empty" style="margin:40px 16px">No se pudo iniciar la vista 3D. Se necesita conexi\xF3n a internet y un navegador con WebGL. El resto del simulador y de la app funciona igual.</div>';
  }
  function simSetMode(m) {
    simMode = m;
    if (m === "walk") {
      simWallPrev = simWall;
      if (simWall < 2) {
        simWall = 2;
        applyWalls();
      }
    } else if (simWallPrev != null) {
      simWall = simWallPrev;
      simWallPrev = null;
      applyWalls();
    }
    if (SIMV) SIMV.setMode(m);
    simModeUI();
  }
  function simBalance(s) {
    const ev = simEval(s), L = { R: 0, S: 0, T: 0 };
    s.circuits.map((c, k) => ({ c, P: ev.cs[k].Ip * V0 })).sort((a, b) => b.P - a.P).forEach((o) => {
      const f = ["R", "S", "T"].sort((a, b) => L[a] - L[b])[0];
      o.c.ph = f;
      L[f] += o.P;
    });
  }
  function simWrapCls() {
    const w = document.getElementById("simwrap");
    if (!w) return;
    const sh = document.getElementById("simsheet"), pl = document.getElementById("simplace");
    w.classList.toggle("sheet-open", !!sh && !sh.hidden);
    w.classList.toggle("placing", !!pl && !pl.hidden);
    w.classList.toggle("walk", simMode === "walk");
  }
  function simUndoTrack() {
    try {
      simUndoTrack0();
    } catch (e) {
    }
  }
  function simUndoTrack0() {
    if (cur !== "sim" || !S || !S.sim2) return;
    const c = JSON.stringify(S.sim2);
    if (simLast != null && c !== simLast) {
      simUndo.push(simLast);
      if (simUndo.length > 40) simUndo.shift();
    }
    simLast = c;
    const b = document.getElementById("simundo");
    if (b) b.disabled = !simUndo.length;
  }
  function simUndoDo() {
    if (!simUndo.length) {
      simToast([["warn", "No hay nada que deshacer."]]);
      return;
    }
    const p = simUndo.pop();
    S.sim2 = JSON.parse(p);
    simLast = p;
    simInsp = null;
    simSel = null;
    simTermSel = null;
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {
    }
    simRefresh([["ok", "\u21B6 Deshecho el \xFAltimo cambio."]]);
    const b = document.getElementById("simundo");
    if (b) b.disabled = !simUndo.length;
  }
  function simModeUI() {
    simWrapCls();
    const b = document.getElementById("simmode");
    if (b) {
      b.innerHTML = simMode === "walk" ? '<span class="ic">\u{1F6B6}</span><small>Andar</small>' : '<span class="ic">\u2725</span><small>Libre</small>';
      b.setAttribute("aria-pressed", String(simMode === "walk"));
    }
    const j = document.getElementById("simjoy");
    if (j) j.hidden = simMode !== "walk";
    const wb = document.querySelector('[data-sa="walls"]');
    if (wb) wb.textContent = "Muros: " + ["tenues", "medios", "s\xF3lidos"][simWall];
  }
  function simFSon() {
    const w = document.getElementById("simwrap");
    return !!(w && (document.fullscreenElement === w || document.webkitFullscreenElement === w || w.classList.contains("fs")));
  }
  function simFSui() {
    const b = document.getElementById("simfs");
    if (b) b.innerHTML = simFSon() ? '<span class="ic">\u2715</span><small>Salir</small>' : '<span class="ic">\u26F6</span><small>Grande</small>';
  }
  function simFSoff() {
    const w = document.getElementById("simwrap");
    simFSnat = false;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {
    });
    else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen();
    if (w) w.classList.remove("fs");
    document.body.classList.remove("simfs");
    simFSui();
    simRefit();
  }
  function simRefit() {
    if (PANEL) setTimeout(() => SIMV && SIMV.mode !== "walk" && SIMV.view("g"), 260);
  }
  function simFS() {
    const w = document.getElementById("simwrap");
    if (!w) return;
    if (simFSon()) {
      simFSoff();
      return;
    }
    const css = () => {
      w.classList.add("fs");
      document.body.classList.add("simfs");
      simFSui();
      simRefit();
    };
    css();
    try {
      if (w.requestFullscreen) w.requestFullscreen().then(() => { simFSnat = true; simFSui(); simRefit(); }).catch(() => {});
      else if (w.webkitRequestFullscreen) { w.webkitRequestFullscreen(); simFSnat = true; }
    } catch (e) {
    }
    if (innerHeight > innerWidth * 1.2) simToast([["ok", "Pantalla completa. Para ver la pared m\xE1s grande, gira el tel\xE9fono en horizontal. Toca \u2715 Salir para volver."]]);
    w.focus({ preventScroll: true });
  }
  let simFSnat = false;
  const simFSchg = () => {
    if (simFSnat && !document.fullscreenElement && !document.webkitFullscreenElement) {
      simFSnat = false;
      const w = document.getElementById("simwrap");
      if (w) w.classList.remove("fs");
      document.body.classList.remove("simfs");
    }
    simFSui();
    simRefit();
  };
  document.addEventListener("fullscreenchange", simFSchg);
  addEventListener("orientationchange", () => simFSon() && simRefit());
  addEventListener("resize", () => { if (simFSon()) { clearTimeout(simFSrz); simFSrz = setTimeout(simRefit, 150); } });
  let simFSrz = 0;
  document.addEventListener("webkitfullscreenchange", simFSchg);
  function simMount() {
    simLast = JSON.stringify(S.sim2);
    simShowHud(null);
    simPrevErr = null;
    updErr(false);
    renderSheet();
    loadThree(() => {
      const w = document.getElementById("simwrap");
      if (cur !== "sim" || !w || SIMV) return;
      try {
        SIMV = simCreate(w);
        if (simCut != null) SIMV.setCut(simCut);
        if (simMode === "walk") SIMV.setMode("walk");
        SIMV.updMap();
        applyWalls();
        simBuild();
        if (simConn) SIMV.view("t");
      } catch (e) {
        console.error(e);
        simFail();
      }
    }, simFail);
  }
  function simKill() {
    simFSoff();
    if (SIMV) {
      SIMV.dispose();
      SIMV = null;
    }
  }
  function txtSprite(text, { bg = "rgba(20,32,44,.85)", fg = "#fff", h = 0.11, fixed = false, depth = false } = {}) {
    const c = document.createElement("canvas"), x = c.getContext("2d"), f = 44;
    x.font = "700 ".concat(f, "px Arial");
    const w = Math.ceil(x.measureText(text).width) + 28;
    c.width = w;
    c.height = f + 20;
    x.font = "700 ".concat(f, "px Arial");
    x.fillStyle = bg;
    const r = 14;
    x.beginPath();
    x.moveTo(r, 0);
    x.arcTo(w, 0, w, c.height, r);
    x.arcTo(w, c.height, 0, c.height, r);
    x.arcTo(0, c.height, 0, 0, r);
    x.arcTo(0, 0, w, 0, r);
    x.fill();
    x.fillStyle = fg;
    x.textBaseline = "middle";
    x.fillText(text, 14, c.height / 2 + 2);
    const tex = new THREE.CanvasTexture(c);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: depth, transparent: true, sizeAttenuation: !fixed }));
    h *= fixed ? 0.78 : 0.72;
    sp.scale.set(h * w / c.height, h, 1);
    sp.renderOrder = 10;
    return sp;
  }
  function faceTex(lines, mods, bg) {
    const c = document.createElement("canvas");
    c.width = 110 * mods;
    c.height = 150;
    const x = c.getContext("2d");
    x.fillStyle = bg;
    x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = "#1b2430";
    x.textAlign = "center";
    x.textBaseline = "middle";
    lines.forEach((l, i) => {
      x.font = i === 0 ? "800 34px Arial" : "700 28px Arial";
      x.fillText(l, c.width / 2, 22 + i * 36);
    });
    return new THREE.CanvasTexture(c);
  }
  function glowTex() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d"), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,220,120,1)");
    g.addColorStop(1, "rgba(255,200,80,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
