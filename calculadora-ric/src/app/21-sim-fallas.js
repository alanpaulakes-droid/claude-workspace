  /* ===== Simulador 3D: calidad gráfica y simulación de fallas (sobrecarga, cortocircuito, falla a tierra, cable subdimensionado) ===== */
  const QUAL_L = { auto: "Autom\xE1tica", baja: "Baja (m\xE1s fluida)", media: "Media", alta: "Alta (sombras)" };
  function simQualPref() {
    try {
      return localStorage.getItem(KEY + "-q") || "auto";
    } catch (e) {
      return "auto";
    }
  }
  function simQual(coarse) {
    const q = simQualPref();
    if (q !== "auto") return q;
    return coarse ? (window.devicePixelRatio || 1) > 2 ? "baja" : "media" : "alta";
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest('[data-sq]');
    if (!b) return;
    try {
      localStorage.setItem(KEY + "-q", b.dataset.sq);
    } catch (err) {
    }
    render(true);
  });
  const FASE_COL = { rojo: 13840175, azul: 2056144, negro: 2106408 };
  function simFasePref() {
    try {
      return localStorage.getItem(KEY + "-fase") || "rojo";
    } catch (e) {
      return "rojo";
    }
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-sfase]");
    if (!b) return;
    try {
      localStorage.setItem(KEY + "-fase", b.dataset.sfase);
    } catch (err) {
    }
    render(true);
  });
  function simQualHTML() {
    const q = simQualPref();
    return '<div class="field"><label>Calidad gr\xE1fica del 3D</label><div class="chips" role="group" aria-label="Calidad gr\xE1fica">' + Object.entries(QUAL_L).map(([k, t]) => '<button type="button" class="chip' + (q === k ? " on" : "") + '" data-sq="' + k + '" aria-pressed="' + (q === k) + '">' + t + "</button>").join("") + '</div><small>Autom\xE1tica usa sombras en computador y una versi\xF3n m\xE1s liviana en tel\xE9fonos. Si el 3D se pone lento, la resoluci\xF3n baja sola.</small></div><div class="field" style="margin-top:10px"><label>Color de la fase en el 3D</label><div class="chips" role="group" aria-label="Color de la fase">' + [["azul", "Azul"], ["negro", "Negro"], ["rojo", "Rojo"]].map(([k, t]) => '<button type="button" class="chip' + (simFasePref() === k ? " on" : "") + '" data-sfase="' + k + '" aria-pressed="' + (simFasePref() === k) + '">' + t + "</button>").join("") + '</div><small>RIC N\xB004, 5.32: fases azul, negro o rojo; neutro blanco; tierra verde o verde/amarillo.</small></div>';
  }
  /* ---- Fallas ---- */
  const SF_T = { sobrecarga: "Sobrecarga (enchufar m\xE1s equipos)", cortocircuito: "Cortocircuito al final del circuito", tierra: "Falla a tierra (fase toca una carcasa)", subdimensionado: "Cable subdimensionado (sobrecarga de 1,45 \xD7 In)" };
  let SF = { cid: null, tipo: "cortocircuito", P: 3000, res: null, bak: null }, simFx = null;
  function simFxHot(cid) {
    return !!(simFx && simFx.cid === cid && simFx.hot);
  }
  function sfInput(s, c) {
    const ev = simEval(s), k = cIdx(s, c.id), x = ev.cs[k] || {}, ic = simIcc(s, ev), cc = ic.c[c.id] || { R: 0 };
    const iz = ampOf(+c.S) * fTemp(s.ta || 30), bad = s.fault && s.fault.type === "drMalo" && s.fault.dr === c.dr;
    return { In: +c.In, cv: c.cv || "C", Iz: iz, Is: x.I || 0, Pextra: +SF.P, Zs: ic.Zs, Ra: ic.Ra, Rc: cc.R || 2 * 0.018 * 10 / (+c.S || 2.5), dr: { tiene: c.dr !== "none", idn: (+c.ds || 30) / 1e3, funciona: !bad }, pe: c.pe !== false, far: cc.far };
  }
  const sfDev = (r, c) => r.actua === "dr" ? "el diferencial " + c.dr + " (" + (c.ds || 30) + " mA)" : r.actua === "tm-magnetico" ? "el magn\xE9tico del autom\xE1tico " + c.In + " A curva " + c.cv : r.actua === "tm-termico" ? "el t\xE9rmico del autom\xE1tico " + c.In + " A curva " + c.cv : "ninguna protecci\xF3n";
  const sfT = (r) => r.tMin == null ? "no corta" : r.tMax == null ? "m\xE1s de 1 hora" : tfmt(r.tMin) + " a " + tfmt(r.tMax);
  function sfResHTML() {
    const s = S.sim2, r = SF.res;
    if (!r) return '<p class="hint" style="margin:0">Elige un circuito y una falla, y toca Simular.</p>';
    const c = s.circuits.find((q) => q.id === r.cid) || {}, cls = r.nivel === "ok" ? "ok" : r.nivel === "riesgo" ? "warn" : "bad";
    return '<ol class="dmtl sfres"><li><b>Falla:</b> ' + SF_T[r.tipo] + " en C" + (cIdx(s, c.id) + 1) + (r.far ? " (punto m\xE1s lejano: " + esc(r.far) + ")" : "") + ". Corriente: <b>" + nf(r.I, r.I < 1 ? 3 : 1) + " A</b>" + (r.tipo !== "tierra" || r.pe ? " = " + nf(r.k, 1) + " \xD7 In" : "") + ".</li><li><b>Act\xFAa:</b> " + sfDev(r, c) + " \xB7 " + sfT(r) + ".</li>" + (r.Uc != null ? "<li><b>Tensi\xF3n en la carcasa:</b> " + n0(r.Uc) + " V (l\xEDmite de seguridad 50 V en lugar seco, RIC N\xB005).</li>" : "") + (r.cableSobre ? "<li><b>Cable:</b> lleva m\xE1s de lo que soporta (Iz " + n0(r.Iz) + " A) mientras dura la falla.</li>" : "") + '<li><b>Resultado:</b> <span class="pill ' + cls + '">' + (r.nivel === "ok" ? "Protegido" : r.nivel === "riesgo" ? "Riesgo" : "Peligro") + "</span> " + r.motivo + '</li></ol><p class="hint" style="margin:6px 0 0">Norma: ' + r.ref + ". Tiempos de disparo seg\xFAn curvas IEC 60898; corriente de cortocircuito por el m\xE9todo convencional (criterio usual).</p>";
  }
  function sfCardHTML() {
    const s = S.sim2;
    if (!s || !s.circuits.length) return "";
    if (SF.cid == null || !s.circuits.some((c) => c.id === SF.cid)) SF.cid = s.circuits[0].id;
    const opt = (k, v, t) => '<option value="' + v + '"' + (String(SF[k]) === String(v) ? " selected" : "") + ">" + t + "</option>";
    return '<section class="card" id="sfcard"><h2>⚡ Simular una falla</h2><p class="hint" style="margin:0 0 8px">Elige un circuito y una falla. La app calcula la corriente con los largos y secciones reales del modelo, muestra qu\xE9 protecci\xF3n act\xFAa, en cu\xE1nto tiempo y el riesgo, y lo refleja en el 3D.</p><div class="grid sg"><div class="field"><label for="sf_cid">Circuito</label><select id="sf_cid" data-sf="cid">' + s.circuits.map((c, k) => opt("cid", c.id, "C" + (k + 1) + " " + esc(c.n || "") + " \xB7 " + c.In + " A " + c.cv + " \xB7 " + sStr(+c.S) + " mm\xB2")).join("") + '</select></div><div class="field"><label for="sf_tipo">Falla</label><select id="sf_tipo" data-sf="tipo">' + Object.entries(SF_T).map(([k, t]) => opt("tipo", k, t)).join("") + "</select></div>" + (SF.tipo === "sobrecarga" ? '<div class="field"><label for="sf_P">Carga extra enchufada</label><select id="sf_P" data-sf="P">' + [1000, 2000, 3000, 4000, 6000].map((w) => opt("P", w, n0(w) + " W")).join("") + "</select></div>" : "") + '</div><div class="exp" style="margin-top:8px"><button type="button" class="btn calc" data-sf="go">⚡ Simular</button>' + (SF.bak ? '<button type="button" class="btn ghost" data-sf="reset">↺ Restablecer</button>' : "") + '</div><div id="sfres" role="status" aria-live="polite" style="margin-top:8px">' + sfResHTML() + "</div></section>";
  }
  function sfRun() {
    const s = S.sim2, c = s.circuits.find((q) => q.id === +SF.cid);
    if (!c) return;
    sfReset(true);
    const inp = sfInput(s, c), r = RICEngine.simularFalla(Object.assign({ tipo: SF.tipo }, inp));
    SF.res = Object.assign({ cid: c.id, tipo: SF.tipo, Iz: inp.Iz, far: inp.far, pe: inp.pe }, r);
    SF.bak = { cid: c.id, on: c.on, dr: c.dr !== "none" ? !!(s.drOff && s.drOff[c.dr]) : null };
    if (r.actua === "dr" && c.dr !== "none") {
      s.drOff = s.drOff || {};
      s.drOff[c.dr] = true;
    } else if (r.actua === "tm-magnetico" || r.actua === "tm-termico" && r.tMax != null && r.tMax <= 3600) c.on = false;
    simFx = { cid: c.id, hot: r.cableSobre || r.nivel !== "ok" };
    simToast([[r.nivel === "ok" ? "ok" : "bad", "C" + (cIdx(s, c.id) + 1) + ": act\xFAa " + sfDev(r, c) + " (" + sfT(r) + ")."]]);
    save();
    simRefresh([]);
    simBuild();
    sfPaint();
  }
  function sfReset(silent) {
    const s = S.sim2, b = SF.bak;
    if (b) {
      const c = s.circuits.find((q) => q.id === b.cid);
      if (c) {
        c.on = b.on;
        if (b.dr != null && s.drOff) s.drOff[c.dr] = b.dr;
      }
    }
    SF.bak = null;
    simFx = null;
    if (!silent) {
      SF.res = null;
      save();
      simRefresh([]);
      simBuild();
      sfPaint();
    }
  }
  function sfPaint() {
    const el = document.getElementById("sfcard");
    if (el) el.outerHTML = sfCardHTML();
  }
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (!el || !el.dataset || !el.dataset.sf || el.tagName !== "SELECT") return;
    SF[el.dataset.sf] = isNaN(+el.value) ? el.value : +el.value;
    SF.res = null;
    sfPaint();
  });
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("button[data-sf]");
    if (!b) return;
    if (b.dataset.sf === "go") sfRun();
    if (b.dataset.sf === "reset") sfReset(false);
  });
