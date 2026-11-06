  function simShowHud(m) {
    const h = document.getElementById("simhud");
    if (!h) return;
    const tl = TOOLS3D.find((t) => t[0] === simTool);
    if (!m) {
      h.innerHTML = '<div class="hud mini"><b>'.concat(tl[2], "</b><span>").concat(SHORT[simTool], '</span><button type="button" data-sa="hudhelp" aria-label="Ayuda">?</button></div>');
      return;
    }
    h.innerHTML = '<div class="hud '.concat(m.ok === true ? "good" : m.ok === false ? "bad" : "", '"><div class="hud-h"><span>').concat(esc(m.name), '</span><button type="button" data-sa="hudx" aria-label="Cerrar">\u2715</button></div>').concat(m.val !== "" ? '<div class="lcd">'.concat(esc(String(m.val)), "<small>").concat(esc(m.unit), "</small></div>") : "").concat(m.sub ? '<div class="hud-s">'.concat(esc(m.sub), "</div>") : "").concat(m.html || "").concat(m.exp ? '<details class="hud-d" '.concat(m.open ? "open" : "", "><summary>").concat(m.open ? "Ayuda" : "\xBFQu\xE9 significa?", '</summary><div class="hud-e">').concat(esc(m.exp), "</div></details>") : "", "</div>");
  }
  function simToast(msgs) {
    const el = document.getElementById("simtoast");
    if (!el || !msgs || !msgs.length) return;
    const u = [...new Map(msgs.map((m) => [m[1], m])).values()];
    el.innerHTML = u.slice(0, 3).map(([t, m]) => '<div class="tst '.concat(t, '">').concat(esc(m), "</div>")).join("");
    clearTimeout(simToastT);
    simToastT = setTimeout(() => {
      el.innerHTML = "";
    }, 7e3);
  }
  function simRefresh(msgs) {
    if (isPan(S.sim2) && S.sim2.pan) {
      msgs = msgs || [];
      const n0m = msgs.length;
      panAutoFix(S.sim2, msgs);
      if (msgs.length > n0m) save();
    }
    if (syncHouse() && cur === "sim") {
      render();
      if (msgs && msgs.length) simToast(msgs);
      return;
    }
    const p = document.getElementById("simpanel");
    if (p) {
      const op = [...p.querySelectorAll("details.item")].map((d) => d.open);
      p.innerHTML = simPanel();
      const ds = p.querySelectorAll("details.item");
      if (op.length === ds.length) ds.forEach((d, i) => d.open = op[i]);
    }
    const pl = document.getElementById("simplace");
    if (pl) {
      pl.hidden = simTool !== "place";
      pl.innerHTML = placeBar();
    }
    simBuild();
    const ne = updErr(true);
    renderSheet();
    const all = (msgs || []).concat(ne);
    if (all.length) simToast(all);
    renderSide();
  }
  document.addEventListener("pointerdown", (e) => {
    const v = document.getElementById("simvista");
    if (v && !v.hidden && !(e.target.closest && e.target.closest(".sim-nav"))) {
      v.hidden = true;
      const vb = document.getElementById("simvbtn");
      if (vb) vb.setAttribute("aria-pressed", "false");
    }
  }, true);
  document.addEventListener("input", (e) => {
    if (e.target && e.target.id === "simcutr") {
      simCut = +e.target.value;
      const v = document.getElementById("simcutv");
      if (v) v.textContent = nf(simCut, 2) + " m";
      if (SIMV) SIMV.setCut(simCut);
    }
  });
  document.addEventListener("toggle", (e) => {
    const sgd = e.target;
    if (sgd && sgd.dataset && sgd.dataset.sgp) {
      try {
        let cl = JSON.parse(localStorage.getItem(KEY + "-side") || "[]").filter((x) => x !== sgd.dataset.sgp);
        if (!sgd.open) cl.push(sgd.dataset.sgp);
        localStorage.setItem(KEY + "-side", JSON.stringify(cl));
      } catch (er) {
      }
    }
  }, true);
  document.addEventListener("toggle", (e) => {
    const d = e.target;
    if (d && d.dataset && d.dataset.ro) {
      d.open ? simRO.add(d.dataset.ro) : simRO.delete(d.dataset.ro);
    }
  }, true);
  document.addEventListener("click", (e) => {
    if (cur !== "sim") return;
    const b = e.target.closest("[data-sa]");
    if (!b || b.tagName === "SELECT") return;
    const s = S.sim2, a = b.dataset.sa, msgs = [];
    const nav = { zin: () => SIMV && SIMV.zoom(0.8), zout: () => SIMV && SIMV.zoom(1.25), rl: () => SIMV && SIMV.rot(0.35), rr: () => SIMV && SIMV.rot(-0.35), up: () => SIMV && SIMV.tilt(-0.2), dn: () => SIMV && SIMV.tilt(0.2) };
    if (nav[a]) {
      nav[a]();
      return;
    }
    if (a === "mode") {
      simSetMode(simMode === "walk" ? "orbit" : "walk");
      simToast([["ok", simMode === "walk" && PANEL ? "Modo caminar frente al panel: avanza o retrocede con el joystick (o W/S) hasta 7 m para ver el panel completo, y gira arrastrando la vista." : simMode === "walk" ? "Modo caminar: usa el joystick para moverte (los muros no se atraviesan, pasa por las puertas). Arrastra la vista para mirar. Usa \xABIr a\u2026\xBB para saltar a otra habitaci\xF3n." : "Modo libre: arrastra para girar, dos dedos para desplazar, pellizca para acercar."]]);
      return;
    }
    if (a === "tgsim") {
      tgInit().lv = "sim";
      save();
      go("tg");
      return;
    }
    if (a === "fs") {
      simFS();
      return;
    }
    if (a === "vista") {
      const v = document.getElementById("simvista");
      if (v) {
        v.hidden = !v.hidden;
        b.setAttribute("aria-pressed", String(!v.hidden));
      }
      return;
    }
    if (a === "meas") {
      const bt = document.querySelector('#simmeas button[data-k="'.concat(INSTR.includes(simTool) ? simTool : "volt", '"]'));
      if (bt) bt.click();
      return;
    }
    if (a === "fl") {
      simSetFl(+b.dataset.v);
      return;
    }
    if (a === "tabview") {
      simTabView = simTabView === "dis" ? "simple" : "dis";
      b.textContent = "Tablero: " + (simTabView === "dis" ? "dise\xF1o" : "simple");
      simBuild();
      return;
    }
    if (a === "ceil") {
      simCeil = (simCeil + 1) % 4;
      b.textContent = "Techo: " + ["oculto", "tenue", "medio", "s\xF3lido"][simCeil];
      applyWalls();
      return;
    }
    if (a === "dsolid") {
      simDuctSolid = !simDuctSolid;
      b.textContent = "Tubos: " + (simDuctSolid ? "s\xF3lidos" : "transp.");
      simBuild();
      return;
    }
    if (a === "inst") {
      s.inst = b.dataset.v;
      msgs.push(["ok", s.inst === "vista" ? "Canalizaci\xF3n a la vista: los tubos van por fuera de muros y bajo el techo, fijados con abrazaderas." : "Canalizaci\xF3n embutida: los tubos van dentro de los muros y en el entretecho, sobre el techo."]);
    }
    if (a === "dtype") {
      s.duct = b.dataset.v;
      msgs.push(["ok", { pvc: "Tubo PVC conduit: r\xEDgido, liviano, sirve embutido o a la vista.", emt: "Tubo met\xE1lico EMT: resistente a golpes, t\xEDpico a la vista.", flex: "Tubo flexible corrugado: se curva f\xE1cil, solo embutido." }[s.duct]]);
    }
    if (a === "rshape") {
      const it = s.items.find((i) => i.id === simRoute);
      if (it && it.n && Math.abs(it.n[1]) < 0.5 && simEval(s).ed.get(it.id)) {
        delete it.route;
        const e0 = simEval(s).ed.get(it.id), A = e0.pts[0], B = e0.pts[e0.pts.length - 1], px = Math.abs(it.n[0]) > 0.5, au = px ? A[2] : A[0], bu = px ? B[2] : B[0], mk = (u, y) => px ? [B[0], y, u] : [u, y, B[2]], fo = flY(it.p[1]) * FH, top = Math.min(WH - 0.12 + fo, Math.max(A[1], B[1]) + 0.3), bot = Math.max(0.15 + fo, Math.min(A[1], B[1]) - 0.3);
        it.route = { vf: [mk(au, B[1])], hf: [mk(bu, A[1])], up: [mk(au, top), mk(bu, top)], dn: [mk(au, bot), mk(bu, bot)] }[b.dataset.k];
      } else simToast([["warn", "Las formas r\xE1pidas sirven para tubos que llegan a un muro. Para luces de techo, toca los puntos a mano."]]);
      save();
      simRefresh();
      simRouteHud();
      return;
    }
    if (a === "rundo" || a === "rclear") {
      const it = s.items.find((i) => i.id === simRoute);
      if (it && it.route) {
        if (a === "rundo") it.route.pop();
        else delete it.route;
        if (it.route && !it.route.length) delete it.route;
      }
      save();
      simRefresh();
      simRouteHud();
      return;
    }
    if (a === "wsrc") {
      simSrc = null;
      simSel = null;
      simBuild();
      simWireHud();
      return;
    }
    if (a === "wdone") {
      simWCut = false;
      simSrc = null;
      simSel = null;
      simShowHud(null);
      simBuild();
      return;
    }
    if (a === "pconn") {
      s.mconn = s.mconn === false;
      const pl = document.getElementById("simplace");
      if (pl) pl.innerHTML = placeBar();
      simToast([["ok", s.mconn === false ? "Cableado autom\xE1tico: cada punto nuevo se conecta solo a la caja m\xE1s cercana." : "Cableado manual: los puntos nuevos quedan sin cable. Con\xE9ctalos con \u{1F517} Conectar."]]);
      save();
      return;
    }
    if (a === "rdone") {
      simRoute = null;
      simSel = null;
      simShowHud(null);
      simBuild();
      return;
    }
    if (a === "heat") {
      simHeat = (simHeat + 1) % 3;
      b.textContent = "\u{1F321} Calor: " + ["no", "carga", "ca\xEDda"][simHeat];
      simBuild();
      if (simHeat) simToast([["ok", simHeat === 1 ? "Mapa de carga: color de cada tubo seg\xFAn cu\xE1nto se acerca la corriente proyectada a lo que soporta el cable." : "Mapa de ca\xEDda de tensi\xF3n: color seg\xFAn el % acumulado desde el medidor (m\xE1ximo 5 %)."]]);
      return;
    }
    if (a === "xray") {
      simCut = simCut == null ? 1.2 : null;
      b.setAttribute("aria-pressed", String(simCut != null));
      const c = document.getElementById("simcut");
      if (c) c.hidden = simCut == null;
      if (SIMV) SIMV.setCut(simCut);
      return;
    }
    if (a === "undo") {
      simUndoDo();
      return;
    }
    if (a === "wroom") {
      const r = b.dataset.r;
      if (SIMV) SIMV.view(r);
      return;
    }
    if (a === "walls") {
      simWall = (simWall + 1) % 3;
      b.textContent = "Muros: " + ["tenues", "medios", "s\xF3lidos"][simWall];
      applyWalls();
      return;
    }
    if (a === "conn") {
      simConn = !simConn;
      b.setAttribute("aria-pressed", String(simConn));
      simSheet = simConn ? "conn" : simSheet === "conn" ? null : simSheet;
      if (simConn && SIMV) SIMV.view("t");
      renderSheet();
      simBuild();
      return;
    }
    if (a === "errs") {
      simSheet = simSheet === "err" ? null : "err";
      renderSheet();
      return;
    }
    if (a === "shx") {
      simSheet = null;
      renderSheet();
      return;
    }
    if (a === "roall" || a === "ronone") {
      document.querySelectorAll("details.rgrp").forEach((d) => {
        d.open = a === "roall";
        a === "roall" ? simRO.add(d.dataset.ro) : simRO.delete(d.dataset.ro);
      });
      return;
    }
    if (a === "hudhelp") {
      const tl = TOOLS3D.find((t) => t[0] === simTool);
      simShowHud({ name: tl[2], val: "", unit: "", sub: "", exp: tl[3], open: true });
      return;
    }
    if (a === "errgo" && b.dataset.x.startsWith("b:")) {
      const id = +b.dataset.x.slice(2), it = S.sim2.items.find((i) => i.id === id);
      if (it) {
        simSheet = "box:" + id;
        simSel = "i" + id;
        if (SIMV) SIMV.focus({ x: it.p[0], y: it.p[1], z: it.p[2] });
        renderSheet();
        simBuild();
      }
      return;
    }
    if (a === "errgo") {
      const x = b.dataset.x;
      if (SIMV) {
        if (x === "t") SIMV.view("t");
        else if (x.startsWith("r:")) SIMV.view(x.slice(2));
        else {
          const it = S.sim2.items.find((i) => i.id === +x.slice(2));
          if (it) {
            simSel = "i" + it.id;
            SIMV.focus({ x: it.p[0], y: it.p[1], z: it.p[2] });
            simBuild();
          }
        }
      }
      if (window.innerWidth < 900) {
        simSheet = null;
        renderSheet();
      }
      document.getElementById("simwrap").scrollIntoView({ block: "nearest" });
      return;
    }
    if (a === "labels") {
      if (SIMV) {
        SIMV.labels = !SIMV.labels;
        b.setAttribute("aria-pressed", String(SIMV.labels));
        simBuild();
      }
      return;
    }
    if (a === "tool") {
      if (b.dataset.k === "wire") setTimeout(simWireHud, 0);
      simTool = b.dataset.k;
      if (simTool !== "place" && simRegSel >= 0) {
        simRegSel = -1;
        simBuild();
      }
      if (simTool !== "route") simRoute = null;
      if (simTool !== "wire") simSrc = null;
      if (b.closest("#simsheet")) {
        simSheet = null;
        renderSheet();
      } else if (simTool === "place" && !S.sim2.circuits.length) {
        simSheet = "tab";
        renderSheet();
      }
      document.querySelectorAll("#simtools button,#simmeas button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.sa === "meas" ? INSTR.includes(simTool) : x.dataset.k === simTool)));
      const ms = document.getElementById("simmeas");
      if (ms) ms.hidden = !INSTR.includes(simTool);
      const pl = document.getElementById("simplace");
      if (pl) {
        pl.hidden = simTool !== "place";
        pl.innerHTML = placeBar();
      }
      simWrapCls();
      if (SIMV) {
        SIMV.ghost.visible = false;
        SIMV.dirty = true;
      }
      simShowHud(null);
      return;
    }
    if (a === "ptype") {
      simPT = b.dataset.k;
      const pl = document.getElementById("simplace");
      if (pl) pl.innerHTML = placeBar();
      return;
    }
    if (a === "regt" || a === "regadd" || a === "regdel" || a === "regsel" || a === "regmv" || a === "regz") {
      const s2 = S.sim2;
      if (a === "regt") simRegT = b.dataset.k;
      else if (a === "regsel") {
        simRegSel = +b.dataset.i === simRegSel ? -1 : +b.dataset.i;
        simBuild();
      } else {
        if (!Array.isArray(s2.reg)) s2.reg = regOf(s2).map((r) => Object.assign({}, r));
        if (a === "regmv" || a === "regz") {
          const r = s2.reg[simRegSel];
          if (r) {
            const P0 = regPos(s2, r, simRegSel), W2 = tabW(s2) / 2 - 0.05 - P0.L / 2;
            if (a === "regmv") {
              const [dx, dy] = b.dataset.k.split(",").map(Number);
              r.x = Math.round((P0.x + dx * 0.02) * 100) / 100;
              r.y = Math.round((P0.y + dy * 0.02) * 100) / 100;
            } else Object.assign(r, { top: { x: P0.x, y: 1.94 }, mid: { x: 0, y: P0.y }, bot: { x: P0.x, y: 1.06 }, izq: { x: -W2, y: P0.y }, der: { x: W2, y: P0.y } }[b.dataset.k]);
            const P2 = regPos(s2, r, simRegSel);
            r.x = P2.x;
            r.y = P2.y;
          }
        } else if (a === "regadd") {
          s2.reg.push({ t: simRegT, n: +b.dataset.n });
          simRegSel = s2.reg.length - 1;
          simToast([["ok", REG_T[simRegT][0] + " de " + b.dataset.n + (simRegT === "peine" ? " m\xF3dulos" : " bornes") + " agregada al tablero."]]);
        } else {
          s2.reg.splice(+b.dataset.i, 1);
          simRegSel = -1;
        }
        save();
        simRefresh([]);
        simBuild();
      }
      const pl = document.getElementById("simplace");
      if (pl) pl.innerHTML = placeBar();
      return;
    }
    if (a === "pvar") {
      simPV[simPT] = b.dataset.k;
      const pl = document.getElementById("simplace");
      if (pl) pl.innerHTML = placeBar();
      const vv = (VAR[simPT] || []).find((x) => x[0] === b.dataset.k);
      if (vv) simToast([["ok", "Colocar\xE1s: " + vv[2] + "."]]);
      return;
    }
    if (a === "wsec") {
      simWS = +b.dataset.v || 0;
      simWireHud();
      return;
    }
    if (a === "wcut") {
      simWCut = !simWCut;
      simWireHud();
      return;
    }
    if (a === "totg") {
      tgInit().lv = "sim";
      save();
      go("tg");
      return;
    }
    if (a === "hudx") {
      simShowHud(null);
      return;
    }
    if (a !== "clear" && a !== "delc") simConfirm = "";
    if (a === "connon") {
      simConn = true;
      document.querySelectorAll('.sim-nav [data-sa="conn"]').forEach((x) => x.setAttribute("aria-pressed", "true"));
      simSheet = "conn";
      if (SIMV) SIMV.view("t");
      renderSheet();
      simBuild();
      return;
    }
    if (a === "term") {
      const bid = +b.dataset.b, k = b.dataset.k;
      let conv = false;
      if (s.wm !== "man") {
        wireManual(s, true);
        conv = true;
      }
      const rr = () => {
        if (conv) {
          save();
          simRefresh();
        } else renderSheet();
      };
      if (!simTermSel || simTermSel.b !== bid) {
        simTermSel = { b: bid, k };
        simHint = false;
        rr();
        return;
      }
      if (simTermSel.k === k) {
        simTermSel = null;
        rr();
        return;
      }
      cutTerm(s, bid, simTermSel.k);
      joinTerms(s, bid, simTermSel.k, k);
      simTermSel = null;
    }
    if (a === "openbox") {
      const id = +b.dataset.id, it = s.items.find((i) => i.id === id);
      if (it) {
        simSheet = "box:" + id;
        simSel = "i" + id;
        simTermSel = null;
        if (SIMV) SIMV.focus({ x: it.p[0], y: it.p[1], z: it.p[2] });
        renderSheet();
        simBuild();
        const w = document.getElementById("simwrap");
        if (w) w.scrollIntoView({ block: "start" });
      }
      return;
    }
    if (a === "bxzoom") {
      simBoxZoom = !simBoxZoom;
      renderSheet();
      return;
    }
    if (a === "row") {
      const bid = +b.dataset.b, gi = +b.dataset.g;
      if (!simTermSel || simTermSel.b !== bid) {
        simToast([["warn", "Primero toca un cable y despu\xE9s la regleta donde quieres unirlo."]]);
        return;
      }
      if (s.wm !== "man") wireManual(s, true);
      const bx = s.items.find((i) => i.id === bid);
      if (bx) {
        const g = boxGroups(s, bx)[gi];
        if (g && !g.includes(simTermSel.k)) {
          cutTerm(s, bid, simTermSel.k);
          const g2 = boxGroups(s, bx).find((x) => x.includes(g[0]));
          joinTerms(s, bid, simTermSel.k, g2 ? g2[0] : g[0]);
        }
      }
      simTermSel = null;
    }
    if (a === "hint") {
      simHint = true;
      if (simTermSel) {
        const bx = s.items.find((i) => i.id === simTermSel.b);
        if (bx) {
          const q = simTermSel.k.split(":")[1], eg = (boxExpected(s, bx).find((g) => g.includes(simTermSel.k)) || []).filter((k) => k !== simTermSel.k).map((k) => {
            const it = s.items.find((i) => i.id === +k.split(":")[0]);
            return it ? it.id === bx.id ? "la entrada" : it.name : "";
          });
          simToast([["ok", "\u{1F4A1} Este cable de ".concat({ F: "fase", N: "neutro", PE: "tierra", R: "retorno" }[q], " va unido con ").concat(eg.length ? eg.join(", ") : "nada en esta caja (no se usa aqu\xED)", ". La regleta correcta qued\xF3 destacada.")]]);
        }
      }
      renderSheet();
      return;
    }
    if (a === "newrow" && simTermSel) {
      if (s.wm !== "man") wireManual(s, true);
      const bid = simTermSel.b;
      cutTerm(s, bid, simTermSel.k);
      (s.emp[bid] = s.emp[bid] || []).push([simTermSel.k]);
      simTermSel = null;
      simHint = false;
    }
    if (a === "tsx") {
      simTermSel = null;
      renderSheet();
      return;
    }
    if (a === "cut" && simTermSel) {
      if (s.wm !== "man") wireManual(s, true);
      cutTerm(s, simTermSel.b, simTermSel.k);
      simTermSel = null;
    }
    if (a === "nut") {
      const bid = +b.dataset.b, gi = +b.dataset.g;
      if (s.wm !== "man") wireManual(s, true);
      const bx = s.items.find((i) => i.id === bid);
      if (bx) {
        boxGroups(s, bx);
        s.emp[bid].splice(gi, 1);
      }
      simTermSel = null;
    }
    if (a === "empsol") {
      const bx = s.items.find((i) => i.id === +b.dataset.b);
      if (bx) {
        s.emp[bx.id] = boxExpected(s, bx);
        msgs.push(["ok", "".concat(bx.name, ": empalmes correctos. F\xEDjate c\xF3mo se une cada color.")]);
      }
    }
    if (a === "empclr") {
      s.emp[+b.dataset.b] = [];
      simTermSel = null;
    }
    if (a === "wm") {
      const v = b.dataset.v;
      simTermSel = null;
      if (v === "auto") {
        s.wm = "auto";
        msgs.push(["ok", "Empalmes autom\xE1ticos: la app une los cables correctamente en todas las cajas."]);
      } else {
        wireManual(s, v === "man1");
        msgs.push(["ok", v === "man1" ? "Empalmes manuales: partes con los empalmes hechos. C\xE1mbialos tocando los cables." : "Empalmes manuales desde cero: todos los cables de las cajas quedaron sueltos. Abre cada caja y \xFAnelos."]);
      }
    }
    if (a === "sys") {
      s.sys = b.dataset.v;
      if (s.sys === "tri") {
        simBalance(s);
        msgs.push(["ok", "Trif\xE1sico: cada circuito va en una fase (R, S o T). Se repartieron para equilibrar la carga."]);
      } else msgs.push(["ok", "Monof\xE1sico: todo en una fase de 220 V."]);
    }
    if (a === "balph") {
      simBalance(s);
      msgs.push(["ok", "Fases balanceadas: primero los circuitos m\xE1s grandes, cada uno en la fase menos cargada."]);
    }
    if (a === "tabsheet") {
      simSheet = simSheet === "tab" ? null : "tab";
      renderSheet();
      return;
    }
    if (a === "ctog") {
      const c = s.circuits.find((c2) => c2.id === +b.dataset.c);
      if (c) c.on = !c.on;
    }
    if (a === "addc2" && s.circuits.length < 8) {
      const pr = PRESET[b.dataset.k], drs = simDRs(s);
      let dr = simNewDR;
      if (dr === "auto") dr = drs.find((d) => s.circuits.filter((c) => c.dr === d).length < 3) || nextDRname(s);
      else if (dr === "new") dr = nextDRname(s);
      else if (dr !== "none" && !drs.includes(dr)) dr = nextDRname(s);
      const id = s.nid++;
      s.circuits.push({ id, n: pr[0], In: pr[1], cv: pr[2], pc: 6, S: pr[3], dr, ds: 30, cl: "A", nc: "dr", pe: true, on: true });
      simPC = id;
      simPT = pr[4];
      simNewDR = "auto";
      msgs.push(["ok", "Disyuntor C".concat(s.circuits.length, " ").concat(pr[0] || "", " agregado: ").concat(pr[1], " A curva ").concat(pr[2], ", cable ").concat(String(pr[3]).replace(".", ","), " mm\xB2, ").concat(dr === "none" ? "sin diferencial" : "protegido por " + dr, ".")]);
    }
    if (a === "addc") {
      const k = s.circuits.length, id = s.nid++;
      s.circuits.push({ id, n: "", In: k ? 16 : 10, cv: k ? "C" : "B", pc: 6, S: k ? 2.5 : 1.5, dr: "DR" + (Math.floor(k / 3) + 1), ds: 30, cl: "A", nc: "dr", pe: true, on: true });
      simPC = id;
    }
    if (a === "delc") {
      const id = +b.dataset.c;
      if (simConfirm !== "c" + id) {
        simConfirm = "c" + id;
        b.textContent = "\xBFSeguro? Se quitan sus puntos";
        return;
      }
      simConfirm = "";
      s.circuits = s.circuits.filter((c) => c.id !== id);
      s.fault = null;
      simSel = null;
    }
    if (a === "deli") simDelete(+b.dataset.id);
    if (a === "tog") {
      const it = s.items.find((i) => i.id === +b.dataset.id);
      if (it && it.t === "sw") swPress(it, -1);
      else if (it) it.on = !it.on;
    }
    if (a === "opt") {
      const r = simOptimize(s);
      msgs.push(r.moved ? ["ok", "Optimizaci\xF3n: se movieron " + r.moved + " caja(s) de derivaci\xF3n al punto que minimiza los recorridos. Ahorro: " + n1(r.dT) + " m de tubo y " + n1(r.dC) + " m de cable (" + n0(r.pct) + " %). Puedes deshacer con \u21B6."] : ["ok", "Las cajas ya est\xE1n en su mejor ubicaci\xF3n: no hay ahorro posible movi\xE9ndolas."]);
    }
    if (a === "ex") {
      const keep = { done: s.done, score: s.score, log: s.log };
      S.sim2 = Object.assign(sim2Example(), keep);
      simInsp = null;
      simSel = null;
      simPC = null;
    }
    if (a === "clear") {
      if (simConfirm !== "clear") {
        simConfirm = "clear";
        b.textContent = "\xBFSeguro? Toca otra vez";
        return;
      }
      simConfirm = "";
      S.sim2 = Object.assign(sim2Blank(), { done: s.done, score: s.score }, s.house ? { house: s.house } : {});
      simInsp = null;
      simSel = null;
      simPC = null;
    }
    if (a === "chal") {
      s.fault = simNewChallenge(s);
      simRep = { t: "", f: "aisl" };
      msgs.push(["warn", "Nuevo desaf\xEDo: lee el reporte del cliente y usa los instrumentos para encontrar la falla."]);
    }
    if (a === "report" && s.fault) {
      s.tries++;
      const ok = simRep.f === s.fault.type && simRep.t === tgtOf(s.fault);
      if (ok) {
        msgs.push(["ok", "\xA1Correcto! ".concat(FAULTS[s.fault.type], " en ").concat(tgtName(s, tgtOf(s.fault)), ". ").concat(FSOL[s.fault.type])]);
        s.score++;
        s.done.chal = 1;
        s.fault = null;
        s.drOff = {};
      } else msgs.push(["bad", "No es correcto. Sigue midiendo: piensa qu\xE9 instrumento detecta cada tipo de falla."]);
    }
    if (a === "giveup" && s.fault) {
      const f = s.fault;
      msgs.push(["warn", "La falla era: ".concat(FAULTS[f.type], " en ").concat(tgtName(s, tgtOf(f)), ". ").concat(FSOL[f.type])]);
      s.fault = null;
      s.drOff = {};
    }
    if (a === "exam") {
      S.sim2 = examStart(S.sim2);
      simInsp = null;
      simSel = null;
      simPC = null;
      msgs.push(["ok", "Examen iniciado: hay " + S.sim2.exam.m.length + " fallas normativas ocultas en la instalaci\xF3n. Encu\xE9ntralas y corr\xEDgelas, luego toca \xABEntregar examen\xBB."]);
    }
    if (a === "examend" && S.sim2.exam) {
      S.sim2.exam.res = examGrade(S.sim2);
      msgs.push(["ok", "Examen entregado: nota " + nf(S.sim2.exam.res.nota, 1) + "."]);
    }
    if (a === "examquit") delete S.sim2.exam;
    if (a === "insp" && S.sim2.exam && !S.sim2.exam.res) msgs.push(["warn", "Durante el examen la revisi\xF3n del inspector est\xE1 bloqueada: usa tus conocimientos y los instrumentos."]);
    else if (a === "insp") {
      simInsp = simInspect(S.sim2);
      if (!simInsp.length) S.sim2.done.insp = 1;
    }
    simTrips(S.sim2, msgs);
    save();
    simRefresh(msgs);
  });
  document.addEventListener("change", (e) => {
    if (cur !== "sim") return;
    const el = e.target;
    if (!el.dataset) return;
    if (el.dataset.sx === "go") {
      if (SIMV && el.value) SIMV.view(el.value);
      el.value = "";
      return;
    }
    if (el.dataset.sx === "pc") {
      simPC = +el.value;
      return;
    }
    if (el.dataset.sx === "newdr") {
      simNewDR = el.value;
      return;
    }
    if (el.dataset.sx === "drds" || el.dataset.sx === "drcl") {
      const s2 = S.sim2;
      s2.circuits.forEach((c) => {
        if (c.dr === el.dataset.dr) {
          if (el.dataset.sx === "drds") c.ds = +el.value;
          else c.cl = el.value;
        }
      });
      const msgs2 = [];
      simTrips(s2, msgs2);
      save();
      simRefresh(msgs2);
      return;
    }
    const p = el.dataset.sp;
    if (!p) return;
    if (p.startsWith("rep.")) {
      simRep[p.slice(4)] = el.value;
      return;
    }
    const s = S.sim2, ks = p.split(".");
    let o = s;
    for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
    const last = ks[ks.length - 1];
    if (last === "par" && el.value === "free") {
      o.free = true;
      o.par = null;
    } else if (["par", "sw", "sw2"].includes(last)) {
      o[last] = el.value === "" ? null : +el.value;
      if (last === "par") o.free = false;
    } else if (last === "c") {
      o.c = +el.value;
      o.par = null;
      if (o.t === "lamp") o.sw = null;
      if (o.t === "sw") s.items.forEach((l) => {
        if (l.sw === o.id) l.sw = null;
      });
    } else if (last === "pe") o.pe = el.value === "1";
    else o[last] = ["In", "S", "ds", "P", "L", "pc", "k", "icc0", "ta"].includes(last) ? +el.value : el.value;
    if (last === "S" && o.t && !(+o.S > 0)) delete o.S;
    if (last === "v" && o.v === "s") delete o.v;
    if (last === "v" && o.t === "lamp") o.P = o.v === "ext" ? 25 : o.v === "tim" ? 10 : o.P === 25 || o.P === 10 ? 60 : o.P;
    if (last === "dr" && s.fault && s.fault.type === "drMalo") s.fault = null;
    const msgs = [];
    simTrips(s, msgs);
    save();
    simRefresh(msgs);
  });
