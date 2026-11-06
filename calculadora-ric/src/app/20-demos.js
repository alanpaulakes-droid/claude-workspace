  /* ===== Demostraciones interactivas: caída vs distancia, corriente vs protección, paso a paso animado y correcto vs incorrecto ===== */
  const DM_DEF = { tab: "caida", sis: "mono", P: 2000, L: 25, S: 2.5, lim: 3, In: 16, cv: "C", Sp: 2.5, k: 1.2, tipo: "enchufes", Pp: 2000, Lp: 30, step: 99, esc: "cable", fallo: false };
  let DM = (() => {
    try {
      return Object.assign({}, DM_DEF, JSON.parse(localStorage.getItem(KEY + "-demo") || "{}"), { step: 99, fallo: false });
    } catch (e) {
      return Object.assign({}, DM_DEF);
    }
  })();
  const dmSave = () => {
    try {
      localStorage.setItem(KEY + "-demo", JSON.stringify(DM));
    } catch (e) {
    }
  };
  const dmReduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DM_TABS = [["caida", "Ca\xEDda vs distancia"], ["proteccion", "Corriente vs protecci\xF3n"], ["pasos", "Paso a paso"], ["comparar", "Correcto vs incorrecto"]];
  const dmFmt = { P: (v) => n0(v) + " W", Pp: (v) => n0(v) + " W", L: (v) => n0(v) + " m", Lp: (v) => n0(v) + " m", k: (v) => nf(v, 1) + " \xD7 In" };
  function dmRng(k, lab, min, max, step, help) {
    const v = DM[k], f = dmFmt[k] || ((x) => x);
    return '<div class="field dmr"><label for="dm_' + k + '">' + lab + ' <output id="dmo_' + k + '" for="dm_' + k + '">' + f(v) + '</output></label><input type="range" id="dm_' + k + '" data-dm="' + k + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + v + '" aria-valuetext="' + esc(String(f(v))) + '">' + (help ? "<small>" + help + "</small>" : "") + "</div>";
  }
  function dmSel(k, lab, opts) {
    return '<div class="field"><label for="dm_' + k + '">' + lab + '</label><select id="dm_' + k + '" data-dm="' + k + '">' + opts.map(([v, t]) => '<option value="' + v + '"' + (String(DM[k]) === String(v) ? " selected" : "") + ">" + t + "</option>").join("") + "</select></div>";
  }
  const dmSecc = (max) => SECC.filter((s) => s <= max).map((s) => [s, sStr(s) + " mm\xB2 (Iz " + ampOf(s) + " A)"]);
  const dmI = (P, sis) => sis === "tri" ? P / (Math.sqrt(3) * 380) : P / 220;
  const dmPar = (P, sis) => ({ k: sis === "tri" ? Math.sqrt(3) : 2, rho: +S.proj.rho || 0.018, I: dmI(P, sis), Vref: sis === "tri" ? 380 : 220 });
  /* Actualiza un SVG sin reemplazarlo, para que las transiciones CSS animen el cambio. */
  function dmMorph(box, html) {
    if (!box) return;
    const t = document.createElement("div");
    t.innerHTML = html;
    const olds = box.querySelectorAll("[data-k]"), news = t.querySelectorAll("[data-k]");
    const same = olds.length && olds.length === news.length && [...olds].every((o, i) => o.dataset.k === news[i].dataset.k && o.tagName === news[i].tagName);
    if (!same) {
      box.innerHTML = html;
      return;
    }
    news.forEach((n, i) => {
      const o = olds[i];
      for (const a of n.attributes) if (o.getAttribute(a.name) !== a.value) o.setAttribute(a.name, a.value);
      if (!n.children.length && o.textContent !== n.textContent) o.textContent = n.textContent;
    });
  }
  /* ---- 1. Caída de tensión vs distancia ---- */
  function dmCaidaChart() {
    const p = dmPar(DM.P, DM.sis), L = +DM.L, Ssel = +DM.S, W = 440, H = 290, ml = 44, mr = 12, mt = 14, mb = 36;
    const Lmax = Math.max(40, Math.ceil(L * 1.6 / 10) * 10), pctAt = (S2, l) => p.k * p.rho * l * p.I / S2 / p.Vref * 100;
    const ymax = Math.min(15, Math.max(6, Math.ceil(pctAt(Ssel, L) * 1.25)));
    const x = (l) => ml + l / Lmax * (W - ml - mr), y = (v) => mt + (1 - Math.min(v, ymax) / ymax) * (H - mt - mb);
    let g = '<svg viewBox="0 0 ' + W + " " + H + '" class="dmsvg" role="img" aria-label="Ca\xEDda de tensi\xF3n seg\xFAn el largo para cada secci\xF3n"><rect x="' + ml + '" y="' + mt + '" width="' + (W - ml - mr) + '" height="' + (H - mt - mb) + '" class="dm-bg"/>';
    for (let v = 0; v <= ymax; v += ymax > 8 ? 2 : 1) g += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + y(v) + '" y2="' + y(v) + '" class="dm-grid"/><text x="' + (ml - 6) + '" y="' + (y(v) + 4) + '" class="dm-ax" text-anchor="end">' + v + " %</text>";
    for (let l = 0; l <= Lmax; l += Lmax > 80 ? 20 : 10) g += '<text x="' + x(l) + '" y="' + (H - mb + 16) + '" class="dm-ax" text-anchor="middle">' + l + "</text>";
    g += '<text x="' + (W - mr) + '" y="' + (H - 4) + '" class="dm-ax" text-anchor="end">largo del tramo [m]</text>';
    [[+DM.lim, "dm-lim warn", "l\xEDmite " + DM.lim + " %"], [5, "dm-lim bad", "total 5 %"]].forEach(([v, c, t], i) => {
      if (v <= ymax) g += '<line data-k="lim' + i + '" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + y(v) + '" y2="' + y(v) + '" class="' + c + '"/><text data-k="limt' + i + '" x="' + (W - mr - 4) + '" y="' + (y(v) - 5) + '" text-anchor="end" class="dm-ax">' + t + "</text>";
    });
    [1.5, 2.5, 4, 6, 10].forEach((S2, i) => {
      const pts = RICEngine.serieCaida(p, S2, Lmax, 30).map((q) => x(q.L).toFixed(1) + "," + y(q.pct).toFixed(1));
      g += '<path data-k="ln' + i + '" d="M' + pts.join("L") + '" class="dm-line c' + (i + 1) + (S2 === Ssel ? " sel" : "") + '"/>';
      const lastV = pctAt(S2, Lmax), yl = y(lastV);
      g += '<text data-k="lt' + i + '" x="' + (lastV > ymax ? x(ymax / pctAt(S2, 1)) + 4 : W - mr - 2) + '" y="' + (lastV > ymax ? mt + 12 : yl - 4) + '" text-anchor="' + (lastV > ymax ? "start" : "end") + '" class="dm-lt c' + (i + 1) + '">' + sStr(S2) + "</text>";
    });
    const pv = pctAt(Ssel, L);
    g += '<line data-k="mkv" x1="' + x(L) + '" x2="' + x(L) + '" y1="' + mt + '" y2="' + (H - mb) + '" class="dm-mkl"/><circle data-k="mk" cx="' + x(L) + '" cy="' + y(pv) + '" r="7" class="dm-mk ' + (pv > 5 ? "bad" : pv > DM.lim ? "warn" : "ok") + '"/>';
    return g + "</svg>";
  }
  function dmCaidaInfo() {
    const p = dmPar(DM.P, DM.sis), S2 = +DM.S, r = RICEngine.caidaTension(p.k, p.rho, +DM.L, p.I, S2, p.Vref), Lm = RICEngine.largoMaxCaida(p, S2, +DM.lim), ok = r.pct <= +DM.lim;
    const nx = SECC.find((s) => s > S2), Lm2 = nx ? RICEngine.largoMaxCaida(p, nx, +DM.lim) : null;
    return kpis([kpi("Corriente", nf(p.I, 1), "A"), kpi("Ca\xEDda", nf(r.dv, 2), "V"), kpi("Ca\xEDda", nf(r.pct, 2), "%", ok ? "ok" : r.pct <= 5 ? "warn" : "bad"), kpi("Largo m\xE1x. al " + DM.lim + " %", isFinite(Lm) ? n0(Lm) : "—", "m")]) +
      '<ul class="dmwhy"><li><b>\xBFY si duplico el largo?</b> La ca\xEDda se duplica: ' + nf(r.pct, 2) + " % → " + nf(r.pct * 2, 2) + " %.</li><li><b>\xBFY si duplico la carga?</b> La corriente se duplica y tambi\xE9n la ca\xEDda.</li><li><b>\xBFY si subo de secci\xF3n?</b> " + (nx ? "Con " + sStr(nx) + " mm\xB2 puedes llegar a " + n0(Lm2) + " m (ca\xEDda inversamente proporcional a la secci\xF3n)." : "Ya es la secci\xF3n m\xE1xima del gr\xE1fico.") + "</li></ul>" +
      '<p class="hint">ΔV = ' + (DM.sis === "tri" ? "√3" : "2") + " \xD7 ρ \xD7 L \xD7 I \xF7 S = " + (DM.sis === "tri" ? "1,732" : "2") + " \xD7 " + nf(p.rho, 3) + " \xD7 " + n0(+DM.L) + " \xD7 " + nf(p.I, 2) + " \xF7 " + sStr(S2) + " = " + nf(r.dv, 2) + " V. L\xEDmites: 3 % por tramo y 5 % total (RIC N\xB003, 5.1.3).</p>";
  }
  /* ---- 2. Corriente vs protección ---- */
  function dmProtChart() {
    const In = +DM.In, Iz = ampOf(+DM.Sp), I = In * +DM.k, Is = dmI(DM.Pp, "mono"), vals = [["Is", "Carga del circuito", Is, "c1"], ["In", "Protecci\xF3n (In)", In, "c2"], ["Iz", "Cable (Iz)", Iz, "c3"], ["I", "Corriente que circula ahora", I, I > Iz ? "bad" : "c4"]];
    const W = 440, rowH = 50, H = 14 + vals.length * rowH + 26, ml = 10, mr = 64, mx = Math.max(...vals.map((v) => v[2]), 1.45 * In) * 1.1, x = (v) => ml + v / mx * (W - ml - mr);
    let g = '<svg viewBox="0 0 ' + W + " " + H + '" class="dmsvg" role="img" aria-label="Comparaci\xF3n de corrientes: carga, protecci\xF3n, cable y corriente actual">';
    vals.forEach(([k, t, v, c], i) => {
      const yy = 16 + i * rowH;
      g += '<text x="' + ml + '" y="' + (yy + 12) + '" class="dm-lb">' + t + '</text><rect data-k="b' + k + '" x="' + ml + '" y="' + (yy + 18) + '" width="' + Math.max(2, x(v) - ml).toFixed(1) + '" height="20" rx="5" class="dm-bar ' + c + '"/><text data-k="v' + k + '" x="' + (x(v) + 6).toFixed(1) + '" y="' + (yy + 33) + '" class="dm-lb b">' + nf(v, 1) + " A</text>";
    });
    const y1 = 10, y2 = H - 24;
    g += '<line data-k="l145" x1="' + x(1.45 * In).toFixed(1) + '" x2="' + x(1.45 * In).toFixed(1) + '" y1="' + y1 + '" y2="' + y2 + '" class="dm-lim warn"/><text data-k="t145" x="' + x(1.45 * In).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" class="dm-ax">1,45 \xD7 In</text>';
    return g + "</svg>";
  }
  function dmProtInfo() {
    const In = +DM.In, Iz = ampOf(+DM.Sp), Is = dmI(DM.Pp, "mono"), co = RICEngine.coordinacion(Is, In, Iz), k = +DM.k, I = k * In, z = curvZone(k, DM.cv);
    const cab = I <= Iz ? "El cable trabaja dentro de su capacidad." : z.c === "ok" || z.z === "Sobrecarga leve" ? "⚠ El cable lleva m\xE1s de lo que soporta y el autom\xE1tico todav\xEDa no corta: se calienta sobre su l\xEDmite." : "El cable se sobrecarga, pero el autom\xE1tico corta en " + z.t + ".";
    return '<ul class="chk"><li class="' + (co.okCarga ? "ok" : "") + '">' + (co.okCarga ? "✓" : "⚠") + " <span>In ≥ 1,1 \xD7 Is: " + In + " A ≥ " + nf(1.1 * Is, 1) + " A (RIC N\xB010, 5.1.4.1)</span></li><li class=\"" + (co.okCable ? "ok" : "") + '">' + (co.okCable ? "✓" : "⚠") + " <span>Iz ≥ In: el cable de " + sStr(+DM.Sp) + " mm\xB2 soporta " + Iz + " A y la protecci\xF3n es de " + In + " A (RIC N\xB010, 5.1.5.1)." + (co.okCable ? "" : " Una sobrecarga entre " + Iz + " y " + nf(1.45 * In, 1) + " A puede durar m\xE1s de una hora sin que el autom\xE1tico corte.") + "</span></li></ul>" +
      kpis([kpi("Corriente ahora", nf(I, 1), "A"), kpi("Zona", z.z, "", z.c), kpi("Tiempo de corte", z.t, "", z.c)]) + '<p class="hint">' + z.d + " " + cab + "</p>" + '<div class="tbl-wrap">' + curvSVG(DM.cv, k) + '</div><p class="hint">Curvas ' + DM.cv + " seg\xFAn IEC 60898 (t\xE9rmico desde 1,13 \xD7 In; magn\xE9tico entre " + CURV[DM.cv][0] + " y " + CURV[DM.cv][1] + " \xD7 In). Capacidad del cable: tabla " + esc(S.ampCfg.met) + " \xB7 " + esc(RIC_DATA.tcab[S.ampCfg.tc] || "") + " (RIC N\xB004, Tabla 4.4).</p>";
  }
  /* ---- 3. Paso a paso animado ---- */
  let dmPrev = {}, dmTimer = 0;
  function dmPasos() {
    const u = USOS[DM.tipo], P = +DM.Pp, L = +DM.Lp, V = 220, I = P / V, In = RICEngine.chooseIn(I, P, V, 1, u[2]);
    const r = chooseS({ I, In, L, k: 2, Vref: V, rho: +S.proj.rho || 0.018, lim: 3, Smin: u[1], fc: 1 }), sel = r.sel, dv = sel ? sel.pct : NaN;
    const firstIz = r.tries.find((t) => t.okMin && t.okIz), why = !sel ? "ninguna secci\xF3n cumple" : firstIz && firstIz.s === sel.s && sel.s === u[1] ? "manda la secci\xF3n m\xEDnima" : firstIz && firstIz.s === sel.s ? "manda la capacidad del cable" : "manda la ca\xEDda de tensi\xF3n";
    return [
      { k: "I", t: "Corriente del circuito", f: "I = P \xF7 V", v: nf(I, 2) + " A", s: n0(P) + " W \xF7 220 V" },
      { k: "In", t: "Protecci\xF3n", f: "In ≥ 1,1 \xD7 I y P ≤ 0,9 \xD7 V \xD7 In", v: In ? In + " A curva " + u[3] : "—", s: "1,1 \xD7 " + nf(I, 2) + " = " + nf(1.1 * I, 2) + " A → calibre comercial" + (u[2] ? " (m\xEDnimo " + u[2] + " A)" : ""), ref: "RIC N\xB010, 5.1.4" },
      { k: "Smin", t: "Secci\xF3n m\xEDnima", f: "Seg\xFAn el uso", v: sStr(u[1]) + " mm\xB2", s: u[0], ref: "RIC N\xB004, 5.4" },
      { k: "Iz", t: "Capacidad del cable", f: "Iz ≥ In", v: firstIz ? sStr(firstIz.s) + " mm\xB2 (" + n0(firstIz.Iz) + " A)" : "—", s: "Tabla " + S.ampCfg.met + " \xB7 " + S.ampCfg.tc + " \xB0C", ref: "RIC N\xB004, Tabla 4.4" },
      { k: "dv", t: "Ca\xEDda de tensi\xF3n", f: "ΔV % = 2ρLI \xF7 S \xF7 V \xD7 100 ≤ 3 %", v: isFinite(dv) ? nf(dv, 2) + " %" : "—", s: "L = " + n0(L) + " m", ref: "RIC N\xB003, 5.1.3" },
      { k: "S", t: "Resultado", f: "La menor secci\xF3n que cumple todo", v: sel ? sStr(sel.s) + " mm\xB2 \xB7 " + In + " A" : "Divide el circuito", s: why, res: true }
    ];
  }
  function dmPasosInfo() {
    const P2 = dmPasos(), n = Math.min(DM.step, P2.length);
    const h = '<ol class="dmsteps">' + P2.map((p, i) => {
      const chg = dmPrev[p.k] != null && dmPrev[p.k] !== p.v;
      return '<li class="dmstep' + (i < n ? " show" : "") + (p.res ? " res" : "") + '"' + (i < n ? "" : ' aria-hidden="true"') + '><span class="n">' + (i + 1) + '</span><div><b>' + p.t + '</b><div class="f">' + p.f + '</div><div class="dmv' + (chg ? " chg" : "") + '">' + p.v + '</div><small>' + esc(p.s) + (p.ref ? " \xB7 " + p.ref : "") + "</small></div></li>";
    }).join("") + "</ol>";
    dmPrev = Object.fromEntries(P2.map((p) => [p.k, p.v]));
    return '<div class="exp dmplay"><button type="button" class="btn" data-dmp="play">' + (dmTimer ? "⏸ Pausa" : "▶ Reproducir") + '</button><button type="button" class="btn ghost" data-dmp="prev" aria-label="Paso anterior">←</button><button type="button" class="btn ghost" data-dmp="next" aria-label="Paso siguiente">→</button><button type="button" class="btn ghost" data-dmp="all">Ver todo</button><span class="hint" role="status">Paso ' + n + " de " + P2.length + "</span></div>" + h;
  }
  /* ---- 4. Correcto vs incorrecto ---- */
  const A70 = () => RICEngine.ampTable({ met: "A1", tc: 70 });
  function dmEsq(o, bad) {
    const W = 330, H = 150, red = (k) => bad === k ? " bad" : "";
    let g = '<svg viewBox="0 0 ' + W + " " + H + '" class="dmesq' + (bad ? " inc" : "") + '" role="img" aria-label="' + esc(o.alt) + '"><rect x="6" y="20" width="96" height="' + (o.n > 1 ? 120 : 92) + '" rx="8" class="dm-box"/><text x="54" y="14" text-anchor="middle" class="dm-ax">Tablero</text>';
    let yy = 32;
    if (o.dr !== false) {
      g += '<rect x="16" y="' + yy + '" width="76" height="24" rx="5" class="dm-dev' + red("dr") + '"/><text x="54" y="' + (yy + 16) + '" text-anchor="middle" class="dm-lb s">' + esc(o.drt || "DR 30 mA") + "</text>";
      yy += 32;
    } else if (bad === "dr") {
      g += '<rect x="16" y="' + yy + '" width="76" height="24" rx="5" class="dm-dev bad dash"/><text x="54" y="' + (yy + 16) + '" text-anchor="middle" class="dm-lb s">sin DR</text>';
      yy += 32;
    }
    const n = o.n || 1;
    for (let i = 0; i < n; i++) {
      const y0 = yy + i * (n > 1 ? 18 : 0);
      if (n > 1) g += '<rect x="22" y="' + (y0 - 2) + '" width="64" height="14" rx="3" class="dm-dev"/><text x="54" y="' + (y0 + 8) + '" text-anchor="middle" class="dm-lb xs">C' + (i + 1) + "</text>";
      else g += '<rect x="16" y="' + y0 + '" width="76" height="24" rx="5" class="dm-dev"/><text x="54" y="' + (y0 + 16) + '" text-anchor="middle" class="dm-lb s">' + esc(o.tm || "TM 16 A") + "</text>";
    }
    const cy = 70, cab = o.cab || "2,5 mm\xB2";
    [["F", -10, "f"], ["N", 0, "n"], ["PE", 10, "pe"]].forEach(([t, dy, c]) => {
      if (c === "pe" && o.pe === false) {
        g += '<line x1="102" x2="232" y1="' + (cy + dy) + '" y2="' + (cy + dy) + '" class="dm-w ' + c + ' miss' + red("pe") + '"/>';
        return;
      }
      g += '<line x1="102" x2="232" y1="' + (cy + dy) + '" y2="' + (cy + dy) + '" class="dm-w ' + c + (red("cab") || red("caida")) + '"/>';
    });
    g += '<text x="167" y="' + (cy - 18) + '" text-anchor="middle" class="dm-lb s' + (red("cab") || red("caida") ? " bt" : "") + '">' + esc(cab) + "</text>";
    if (o.duct) g += '<circle cx="167" cy="' + (cy + 40) + '" r="22" class="dm-duct' + red("ducto") + '"/>' + Array.from({ length: o.duct }, (_, i) => '<circle cx="' + (167 + 11 * Math.cos(i / o.duct * 6.283)) + '" cy="' + (cy + 40 + 11 * Math.sin(i / o.duct * 6.283)) + '" r="' + (o.duct > 4 ? 6.4 : 6) + '" class="dm-cond"/>').join("") + '<text x="199" y="' + (cy + 44) + '" class="dm-lb xs">' + esc(o.ductt || "") + "</text>";
    g += '<rect x="232" y="' + (cy - 26) + '" width="90" height="52" rx="8" class="dm-box"/><text x="277" y="' + (cy - 4) + '" text-anchor="middle" class="dm-lb s">' + esc(o.carga || "Carga") + '</text><text x="277" y="' + (cy + 12) + '" text-anchor="middle" class="dm-lb xs">' + esc(o.cargat || "") + "</text>";
    if (o.pe === false) g += '<text x="167" y="' + (cy + 26) + '" text-anchor="middle" class="dm-lb xs bt">sin conductor de tierra</text>';
    g += '<circle cx="' + (bad ? 300 : 300) + '" cy="20" r="13" class="dm-st ' + (bad ? "bad" : "ok") + '"/><text x="300" y="25" text-anchor="middle" class="dm-st-t">' + (bad ? "✗" : "✓") + "</text>";
    return g + "</svg>";
  }
  function dmEscenarios() {
    const a = A70(), p = { k: 2, rho: 0.018, I: 10, Vref: 220 }, c1 = RICEngine.caidaTension(2, 0.018, 25, 10, 2.5, 220).pct, c2 = RICEngine.caidaTension(2, 0.018, 60, 10, 1.5, 220).pct;
    const f3 = ductFill(2.5, 3, DUCTOS[20][1]), f6 = ductFill(2.5, 6, DUCTOS[16][1]);
    return {
      cable: { t: "Cable delgado con protecci\xF3n grande", ref: "RIC N\xB010, 5.1.5.1 \xB7 RIC N\xB004, Tabla 4.4 (A1, 70 \xB0C)", falla: "Sobrecarga sostenida de " + nf(1.45 * 16, 1) + " A (1,45 \xD7 In) por enchufar varios calefactores.", ok: { o: { tm: "TM 16 A", cab: "2,5 mm\xB2 \xB7 Iz " + a[2.5] + " A", carga: "Enchufes", cargat: "3.500 W", alt: "Circuito correcto" }, act: "El cable de 2,5 mm\xB2 (Iz " + a[2.5] + " A) tolera 1,45 \xD7 Iz = " + nf(1.45 * a[2.5], 1) + " A mientras el autom\xE1tico corta por t\xE9rmico.", res: "El autom\xE1tico desconecta y la aislaci\xF3n no se da\xF1a." }, bad: { o: { tm: "TM 16 A", cab: "1,5 mm\xB2 \xB7 Iz " + a[1.5] + " A", carga: "Enchufes", cargat: "3.500 W", alt: "Circuito incorrecto" }, b: "cab", act: "El cable de 1,5 mm\xB2 (Iz " + a[1.5] + " A) solo tolera " + nf(1.45 * a[1.5], 1) + " A, pero el autom\xE1tico de 16 A puede tardar m\xE1s de una hora en cortar " + nf(1.45 * 16, 1) + " A.", res: "La aislaci\xF3n se recalienta y se degrada: riesgo de incendio dentro del muro.", fx: "Usa 2,5 mm\xB2 o baja el autom\xE1tico a 10 A." } },
      dr: { t: "Enchufes sin diferencial", ref: "RIC N\xB010, 5.1.3.5 (todo circuito de alumbrado y enchufes con diferencial ≤ 30 mA)", falla: "Una persona toca un artefacto con fuga y una corriente de unos 100 mA pasa por su cuerpo a tierra (valor ilustrativo).", ok: { o: { tm: "TM 16 A", cab: "2,5 mm\xB2", carga: "Hervidor", cargat: "con fuga", alt: "Circuito con diferencial" }, act: "El diferencial detecta la diferencia entre fase y neutro (≥ 30 mA) y corta en milisegundos (ensayo: ≤ 40 ms a 5 \xD7 IΔn, IEC 61008).", res: "La persona siente un golpe breve; el corte llega antes del riesgo de fibrilaci\xF3n." }, bad: { o: { tm: "TM 16 A", cab: "2,5 mm\xB2", carga: "Hervidor", cargat: "con fuga", dr: false, alt: "Circuito sin diferencial" }, b: "dr", act: "El termomagn\xE9tico no ve la fuga: 0,1 A es much\xEDsimo menos que sus 16 A.", res: "La corriente sigue pasando por la persona: riesgo de electrocuci\xF3n.", fx: "Instala un diferencial de 30 mA clase A (m\xE1ximo 3 circuitos por diferencial)." } },
      pe: { t: "Artefacto met\xE1lico sin tierra", ref: "RIC N\xB005 (contactos indirectos: RA \xD7 Id ≤ UL) \xB7 RIC N\xB010, 5.2 f) esquema TN-S", falla: "La fase toca la carcasa met\xE1lica de una lavadora.", ok: { o: { tm: "TM 16 A", cab: "2,5 mm\xB2", carga: "Lavadora", cargat: "carcasa a tierra", alt: "Circuito con tierra" }, act: "La corriente de falla se va por el conductor de tierra y el diferencial corta apenas aparece, sin que nadie toque la carcasa.", res: "La carcasa nunca queda con tensi\xF3n peligrosa." }, bad: { o: { tm: "TM 16 A", cab: "2,5 mm\xB2", carga: "Lavadora", cargat: "carcasa sin tierra", pe: false, alt: "Circuito sin tierra" }, b: "pe", act: "No hay camino a tierra: la carcasa queda a 220 V y nada corta. El diferencial solo act\xFAa cuando alguien la toca.", res: "Quien toque la lavadora recibe la descarga a trav\xE9s de su cuerpo.", fx: "Lleva el conductor de protecci\xF3n (verde o verde/amarillo) a cada enchufe y artefacto met\xE1lico." } },
      caida: { t: "Circuito largo y delgado", ref: "RIC N\xB003, 5.1.3 (3 % por tramo, 5 % total)", falla: "Se enciende una carga de 10 A al final del circuito.", ok: { o: { tm: "TM 16 A", cab: "2,5 mm\xB2 \xB7 25 m", carga: "Equipo", cargat: "ΔV " + nf(c1, 1) + " %", alt: "Circuito con ca\xEDda aceptable" }, act: "Ca\xEDda de " + nf(c1, 2) + " %: dentro del l\xEDmite.", res: "El equipo recibe casi 220 V y funciona bien." }, bad: { o: { tm: "TM 16 A", cab: "1,5 mm\xB2 \xB7 60 m", carga: "Equipo", cargat: "ΔV " + nf(c2, 1) + " %", alt: "Circuito con ca\xEDda excesiva" }, b: "caida", act: "Ca\xEDda de " + nf(c2, 2) + " %: supera el 5 % total. El cable pierde " + n0(10 * 10 * 2 * 0.018 * 60 / 1.5) + " W en calor.", res: "Motores y compresores se calientan, la luz baja y los equipos fallan antes de tiempo.", fx: "Sube a " + sStr(SECC.find((s) => RICEngine.largoMaxCaida(p, s, 3) >= 60) || 6) + " mm\xB2 o divide el circuito." } },
      ducto: { t: "Tubo sobrellenado", ref: "RIC N\xB004, Tabla 4.21 (33 % con 2 o m\xE1s conductores) y Tabla 4.6 (fn)", falla: "Se pasan los cables con la gu\xEDa y despu\xE9s el circuito trabaja a plena carga.", ok: { o: { tm: "TM 16 A", cab: "3 \xD7 2,5 mm\xB2", carga: "Circuito", cargat: "1 por tubo", duct: 3, ductt: "20 mm \xB7 " + n0(f3) + " %", alt: "Tubo con llenado correcto" }, act: "Llenado de " + n0(f3) + " % (≤ 33 %): los cables pasan sin esfuerzo y disipan calor.", res: "Aislaci\xF3n intacta y capacidad de corriente completa." }, bad: { o: { tm: "TM 16 A", cab: "6 \xD7 2,5 mm\xB2", carga: "2 circuitos", cargat: "en un tubo", duct: 6, ductt: "16 mm \xB7 " + n0(f6) + " %", alt: "Tubo sobrellenado" }, b: "ducto", act: "Llenado de " + n0(f6) + " % (> 33 %) y 4 conductores activos: la capacidad baja a 0,8 \xD7 Iz (Tabla 4.6).", res: "La aislaci\xF3n se raspa al tirar y el calor acumulado la envejece: riesgo de falla a tierra.", fx: "Usa un tubo mayor o un tubo por circuito." } },
      drn: { t: "Demasiados circuitos en un diferencial", ref: "RIC N\xB010, 5.1.3.7 (m\xE1ximo 3 circuitos por diferencial)", falla: "Cada circuito tiene una fuga normal peque\xF1a, por ejemplo 7 mA (valor ilustrativo).", ok: { o: { drt: "2 \xD7 DR 30 mA", cab: "3 + 2 circuitos", carga: "Vivienda", cargat: "repartida", n: 3, alt: "Circuitos repartidos en dos diferenciales" }, act: "Cada diferencial ve como m\xE1ximo 3 \xD7 7 = 21 mA: no dispara sin motivo.", res: "Si uno corta, el resto de la casa sigue con energ\xEDa." }, bad: { o: { drt: "1 DR 30 mA", cab: "5 circuitos", carga: "Vivienda", cargat: "completa", n: 5, alt: "Cinco circuitos en un diferencial" }, b: "dr", act: "Las fugas se suman: 5 \xD7 7 = 35 mA ≥ 30 mA y el diferencial dispara.", res: "Cortes sin causa aparente que dejan toda la casa sin luz y dificultan encontrar la falla.", fx: "Reparte en diferenciales de hasta 3 circuitos." } }
    };
  }
  function dmComparar() {
    const E = dmEscenarios(), e = E[DM.esc] || E.cable, side = (s, bad) => '<div class="dmside ' + (bad ? "bad" : "ok") + (DM.fallo && bad ? " fallo" : "") + '"><h3>' + (bad ? "✗ Incorrecto" : "✓ Correcto") + "</h3>" + dmEsq(s.o, bad ? s.b : null) + '<ol class="dmtl"><li><b>Ocurre:</b> ' + e.falla + "</li><li><b>Qu\xE9 act\xFAa:</b> " + s.act + "</li><li><b>Resultado:</b> " + s.res + "</li>" + (s.fx ? '<li class="fx"><b>C\xF3mo se corrige:</b> ' + s.fx + "</li>" : "") + "</ol></div>";
    return '<div class="chips dmesc" role="group" aria-label="Elegir caso">' + Object.entries(E).map(([k, x]) => '<button type="button" class="chip' + (k === DM.esc ? " on" : "") + '" data-dmesc="' + k + '" aria-pressed="' + (k === DM.esc) + '">' + x.t + "</button>").join("") + '</div><div class="exp" style="margin:10px 0"><button type="button" class="btn calc" data-dmp="fallo">' + (DM.fallo ? "↺ Volver a mirar" : "⚡ Simular la falla") + '</button><span class="hint">Norma: ' + e.ref + '</span></div><div class="dmcmp">' + side(e.ok, false) + side(e.bad, true) + "</div>";
  }
  /* ---- Página ---- */
  function dmControls() {
    if (DM.tab === "caida") return '<div class="grid">' + dmSel("sis", "Sistema", [["mono", "Monof\xE1sico 220 V"], ["tri", "Trif\xE1sico 380 V"]]) + dmSel("S", "Secci\xF3n destacada", dmSecc(10)) + dmSel("lim", "L\xEDmite del tramo", [[3, "3 % (alimentador o circuito)"], [5, "5 % (total)"]]) + "</div>" + dmRng("P", "Carga", 100, 10000, 100) + dmRng("L", "Largo del tramo", 1, 100, 1);
    if (DM.tab === "proteccion") return '<div class="grid">' + dmSel("In", "Protecci\xF3n", COM.slice(0, 7).map((x) => [x, x + " A"])) + dmSel("cv", "Curva", [["B", "B (3–5 In)"], ["C", "C (5–10 In)"], ["D", "D (10–20 In)"]]) + dmSel("Sp", "Secci\xF3n del cable", dmSecc(10)) + "</div>" + dmRng("Pp", "Carga del circuito", 100, 6000, 50) + dmRng("k", "Corriente que circula (sobrecarga o falla)", 0.5, 20, 0.1, "Mueve para ver cu\xE1ndo y c\xF3mo corta el autom\xE1tico.");
    if (DM.tab === "pasos") return '<div class="grid">' + dmSel("tipo", "Tipo de circuito", CIR_T.filter((k) => k !== "horno" && k !== "especial").map((k) => [k, USOS[k][0]])) + "</div>" + dmRng("Pp", "Carga", 100, 3500, 50) + dmRng("Lp", "Largo", 1, 80, 1);
    return "";
  }
  function dmOut() {
    if (DM.tab === "caida") return '<div id="dminfo" aria-live="polite">' + dmCaidaInfo() + "</div>";
    if (DM.tab === "proteccion") return '<div id="dminfo" aria-live="polite">' + dmProtInfo() + "</div>";
    if (DM.tab === "pasos") return '<div id="dminfo">' + dmPasosInfo() + "</div>";
    return '<div id="dminfo">' + dmComparar() + "</div>";
  }
  function pgDemo() {
    return '<p class="eyebrow">Aprender \xB7 demostraciones</p><h1>Demostraciones interactivas</h1><p class="lead">Mueve los controles y mira c\xF3mo cambian los resultados. Cada demostraci\xF3n usa el mismo motor de c\xE1lculo y las tablas RIC de la app.</p><div class="dmtabs" role="tablist" aria-label="Demostraciones">' + DM_TABS.map(([k, t]) => '<button type="button" role="tab" data-dmt="' + k + '" aria-selected="' + (DM.tab === k) + '">' + t + "</button>").join("") + '</div><section class="card" role="tabpanel">' + (DM.tab === "caida" || DM.tab === "proteccion" ? '<div class="dmchart" id="dmchart">' + (DM.tab === "caida" ? dmCaidaChart() : dmProtChart()) + "</div>" : "") + '<div id="dmctl">' + dmControls() + '</div><div id="dmout">' + dmOut() + "</div></section>";
  }
  function dmRefresh() {
    const c = document.getElementById("dmchart"), i = document.getElementById("dminfo");
    if (!c && !i) return;
    if (c) dmMorph(c, DM.tab === "caida" ? dmCaidaChart() : dmProtChart());
    if (i) i.innerHTML = DM.tab === "caida" ? dmCaidaInfo() : DM.tab === "proteccion" ? dmProtInfo() : DM.tab === "pasos" ? dmPasosInfo() : dmComparar();
  }
  function dmStop() {
    clearInterval(dmTimer);
    dmTimer = 0;
  }
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (!el || !el.dataset || !el.dataset.dm) return;
    const k = el.dataset.dm;
    DM[k] = isNaN(+el.value) ? el.value : +el.value;
    const o = document.getElementById("dmo_" + k);
    if (o) {
      o.textContent = (dmFmt[k] || ((x) => x))(DM[k]);
      el.setAttribute("aria-valuetext", o.textContent);
    }
    dmSave();
    dmRefresh();
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el && el.dataset && el.dataset.dm && el.tagName === "SELECT") {
      DM[el.dataset.dm] = isNaN(+el.value) ? el.value : +el.value;
      dmSave();
      dmRefresh();
    }
  });
  document.addEventListener("click", (e) => {
    const t = e.target.closest && e.target.closest("[data-dmt],[data-dmp],[data-dmesc],[data-demo]");
    if (!t) return;
    if (t.dataset.demo) {
      DM.tab = t.dataset.demo;
      dmSave();
      go("demo");
      return;
    }
    if (t.dataset.dmt) {
      dmStop();
      DM.tab = t.dataset.dmt;
      DM.step = DM.tab === "pasos" ? 0 : 99;
      DM.fallo = false;
      dmSave();
      render(true);
      if (DM.tab === "pasos") dmPlay();
      return;
    }
    if (t.dataset.dmesc) {
      DM.esc = t.dataset.dmesc;
      DM.fallo = false;
      dmSave();
      dmRefresh();
      return;
    }
    const a = t.dataset.dmp;
    if (a === "fallo") {
      DM.fallo = !DM.fallo;
      dmRefresh();
      return;
    }
    if (a === "play") {
      if (dmTimer) dmStop();
      else dmPlay();
      dmRefresh();
      return;
    }
    dmStop();
    if (a === "prev") DM.step = Math.max(0, Math.min(DM.step, 6) - 1);
    if (a === "next") DM.step = Math.min(6, DM.step + 1);
    if (a === "all") DM.step = 99;
    dmRefresh();
  });
  function dmPlay() {
    dmStop();
    if (dmReduce()) {
      DM.step = 99;
      dmRefresh();
      return;
    }
    if (DM.step >= 6) DM.step = 0;
    dmTimer = setInterval(() => {
      if (cur !== "demo" || DM.tab !== "pasos") return dmStop();
      DM.step++;
      if (DM.step >= 6) dmStop();
      dmRefresh();
    }, 1100);
  }
