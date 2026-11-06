  const CURV = { B: [3, 5], C: [5, 10], D: [10, 20] };
  function curvBand(cv) {
    const [m1, m2] = CURV[cv], up = [], lo = [];
    const tUp = (k) => k < 1.45 ? 3600 * Math.pow(1.45 / k, 6) : k < 2.55 ? Math.exp(Math.log(3600) + (Math.log(60) - Math.log(3600)) * (Math.log(k / 1.45) / Math.log(2.55 / 1.45))) : 60 * Math.pow(2.55 / k, 2);
    const tLo = (k) => k < 2.55 ? Math.exp(Math.log(3600) + (Math.log(1) - Math.log(3600)) * (Math.log(k / 1.13) / Math.log(2.55 / 1.13))) : Math.pow(2.55 / k, 2);
    for (let k = 1.13; k < m2; k *= 1.06) up.push([k, Math.min(1e4, tUp(k))]);
    up.push([m2, Math.min(1e4, tUp(m2))], [m2, 0.1], [100, 0.1]);
    for (let k = 1.13; k < m1; k *= 1.06) lo.push([k, tLo(k)]);
    lo.push([m1, tLo(m1)], [m1, 5e-3], [100, 5e-3]);
    return { up, lo, tUp, tLo, m1, m2 };
  }
  function curvZone(k, cv) {
    const b = curvBand(cv);
    if (k < 1.13) return { z: "Sin disparo", d: "Corriente normal o sobrecarga m\xEDnima: el autom\xE1tico no corta.", t: "\u2014", c: "ok" };
    if (k < 1.45) return { z: "Sobrecarga leve", d: "Puede tardar m\xE1s de 1 hora en cortar. El cable se calienta poco a poco.", t: "> 1 h", c: "warn" };
    if (k < b.m1) {
      const a = b.tLo(k), c = Math.min(3600, b.tUp(k));
      return { z: "Disparo t\xE9rmico", d: "Sobrecarga: corta la parte t\xE9rmica (bimetal). Cuanto m\xE1s corriente, m\xE1s r\xE1pido.", t: "".concat(tfmt(a), " a ").concat(tfmt(c)), c: "warn" };
    }
    if (k < b.m2) return { z: "Zona de transici\xF3n", d: "Entre ".concat(b.m1, " y ").concat(b.m2, " veces In puede cortar el magn\xE9tico al instante o el t\xE9rmico en segundos."), t: "0,01 s a ".concat(tfmt(Math.min(60, b.tUp(k)))), c: "warn" };
    return { z: "Disparo magn\xE9tico", d: "Cortocircuito: el electroim\xE1n abre el contacto al instante.", t: "< 0,1 s", c: "bad" };
  }
  function tfmt(t) {
    return t >= 3600 ? nf(t / 3600, 1) + " h" : t >= 60 ? n0(t / 60) + " min" : t >= 1 ? nf(t, t < 10 ? 1 : 0) + " s" : nf(t, t < 0.1 ? 3 : 2) + " s";
  }
  function curvSVG(cv, k) {
    const W = 560, H = 360, L = 56, B = 36, x = (v) => L + (Math.log10(v) - 0) / 2 * (W - L - 14), y = (t) => 14 + (4 - Math.log10(t)) / (4 - -3) * (H - B - 14);
    let g = '<rect x="'.concat(L, '" y="14" width="').concat(W - L - 14, '" height="').concat(H - B - 14, '" class="f-surf" stroke="var(--line)"/>');
    [1, 2, 3, 5, 10, 20, 50, 100].forEach((v) => {
      g += '<line x1="'.concat(x(v), '" y1="14" x2="').concat(x(v), '" y2="').concat(H - B, '" stroke="var(--line)" stroke-width="1"/><text x="').concat(x(v), '" y="').concat(H - B + 16, '" text-anchor="middle" class="ts">').concat(v, "</text>");
    });
    [[1e4, "10000 s"], [3600, "1 h"], [60, "1 min"], [10, "10 s"], [1, "1 s"], [0.1, "0,1 s"], [0.01, "0,01 s"], [1e-3, "1 ms"]].forEach(([t, l]) => {
      g += '<line x1="'.concat(L, '" y1="').concat(y(t), '" x2="').concat(W - 14, '" y2="').concat(y(t), '" stroke="var(--line)" stroke-width="1"/><text x="').concat(L - 6, '" y="').concat(y(t) + 4, '" text-anchor="end" class="ts">').concat(l, "</text>");
    });
    const poly = (b, col, op) => '<polygon points="'.concat(b.up.map((p) => x(p[0]) + "," + y(p[1])).join(" "), " ").concat(b.lo.slice().reverse().map((p) => x(p[0]) + "," + y(p[1])).join(" "), '" fill="').concat(col, '" fill-opacity="').concat(op, '" stroke="').concat(col, '" stroke-width="').concat(op > 0.3 ? 2 : 1, '"/>');
    const COL = { B: "#2e86c1", C: "#d35400", D: "#7d3c98" };
    Object.keys(CURV).forEach((c) => {
      if (c !== cv) g += poly(curvBand(c), COL[c], 0.08);
    });
    g += poly(curvBand(cv), COL[cv], 0.35);
    Object.keys(CURV).forEach((c) => {
      const b = curvBand(c);
      g += '<text x="'.concat(x(b.m2) + 4, '" y="').concat(y(0.03), '" class="ts" fill="').concat(COL[c], '">').concat(c, "</text>");
    });
    if (k > 0) {
      const kk = Math.min(100, Math.max(1, k));
      g += '<line x1="'.concat(x(kk), '" y1="14" x2="').concat(x(kk), '" y2="').concat(H - B, '" stroke="var(--bad)" stroke-width="3" stroke-dasharray="6 4"/><text x="').concat(x(kk) + 6, '" y="28" class="tb" fill="var(--bad)">').concat(nf(k, 1), " \xD7 In</text>");
    }
    g += '<text x="'.concat((W + L) / 2, '" y="').concat(H - 4, '" text-anchor="middle" class="ts">M\xFAltiplo de la corriente nominal (I \xF7 In)</text>');
    return '<figure class="ill"><div class="sv"><svg viewBox="0 0 '.concat(W, " ").concat(H, '" role="img" aria-label="Curva tiempo-corriente ').concat(cv, '">').concat(g, "</svg></div><figcaption>Curva tiempo\u2013corriente t\xEDpica (IEC 60898-1). Banda fuerte: curva ").concat(cv, ". Para valores exactos usa la curva del fabricante.</figcaption></figure>");
  }
  function tCurvas() {
    const t = T("curvas");
    return tPage(
      "curvas",
      "IEC 60898-1",
      "Curvas de disparo",
      "Mira en qu\xE9 zona cae una corriente y cu\xE1nto tarda en cortar el autom\xE1tico.",
      '<div class="grid">'.concat(fNum("tools.curvas.In", "Corriente nominal ".concat(ab("In")), { unit: "A" })).concat(fSel("tools.curvas.cv", "Curva", [["B", "B \xB7 alumbrado (3\u20135 In)"], ["C", "C \xB7 enchufes y equipos (5\u201310 In)"], ["D", "D \xB7 motores (10\u201320 In)"]])).concat(fNum("tools.curvas.I", "Corriente que circula o de falla", { unit: "A", help: "Ej.: sobrecarga 24 A, cortocircuito 300 A" }), "</div>"),
      "<p>Un autom\xE1tico tiene dos partes. La <b>t\xE9rmica</b> (bimetal) corta las sobrecargas: si pasa 1,45 veces su corriente nominal, corta en menos de una hora; si pasa 3 veces, en segundos. La <b>magn\xE9tica</b> (electroim\xE1n) corta los cortocircuitos al instante.</p><p>La <b>curva</b> dice desde cu\xE1ntas veces In act\xFAa el magn\xE9tico: B entre 3 y 5, C entre 5 y 10, D entre 10 y 20. Por eso en enchufes se usa C: los equipos tienen picos de arranque que har\xEDan saltar una B.</p>"
    );
  }
  function cCurvas() {
    const t = T("curvas"), In = +t.In, I = +t.I;
    if (!(In > 0) || !(I > 0)) return note("Ingresa la corriente nominal y la corriente que circula.");
    const k = I / In, z = curvZone(k, t.cv), [m1, m2] = CURV[t.cv];
    return kpis([kpi("M\xFAltiplo k", nf(k, 2), "\xD7 In"), kpi("Zona", z.z, "", z.c), kpi("Tiempo de corte", z.t, "", z.c), kpi("Magn\xE9tico desde", "".concat(n0(m1 * In), "\u2013").concat(n0(m2 * In)), "A")]) + curvSVG(t.cv, k) + steps([
      { t: "M\xFAltiplo de la corriente nominal", f: "k = I \xF7 In", s: "k = ".concat(nf(I), " \xF7 ").concat(nf(In), " = ").concat(nf(k, 2)), r: "".concat(nf(k, 2), " veces In"), why: "la curva se lee en m\xFAltiplos de In, as\xED sirve para cualquier autom\xE1tico." },
      { t: "Zona de la curva " + t.cv, f: "t\xE9rmica 1,13\u2013".concat(m1, " In \xB7 magn\xE9tica \u2265 ").concat(m2, " In"), s: "".concat(nf(k, 2), " \xD7 In \u2192 ").concat(z.z), r: z.t, why: z.d }
    ]);
  }
  const FT_PVC = RICEngine.RIC.ft.t.map((t, i) => [t, RICEngine.RIC.ft[70][i]]);
  const { fTemp, ncAct, fGrp } = RICEngine;
  const fcOf = (t) => (+t.fc || 1) * fTemp(t.ta) * fGrp(t.ng, t.sis === "tri");
  const TA_OPT = FT_PVC.slice(1, 10).map(([t, f]) => [t, t + " \xB0C (f = " + nf(f, 2) + ")"]);
  const NG_OPT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 21, 22].map((n) => [n, n === 1 ? "Solo (2 conductores activos, f = 1,00)" : n + " circuitos monof\xE1sicos (" + 2 * n + " conductores, f = " + nf(fGrp(n), 2) + ")"]);
  const fcFields = (k) => fSel("tools." + k + ".ta", "Temperatura ambiente", TA_OPT, { help: "Entretecho en verano: 40 a 50 \xB0C" }) + fSel("tools." + k + ".ng", "Circuitos agrupados en el mismo ducto o bandeja", NG_OPT);
  const fcStep = (t) => ({ t: "Factores de correcci\xF3n " + ab("fc"), q: "La tabla de capacidad vale para 30 \xB0C y un circuito solo; con m\xE1s calor o m\xE1s cables juntos el cable disipa peor.", f: "fc = f temperatura \xD7 f agrupamiento \xD7 f adicional", s: "fc = " + nf(fTemp(t.ta), 2) + " \xD7 " + nf(fGrp(t.ng, t.sis === "tri"), 2) + " (" + ncAct(t.ng, t.sis === "tri") + " conductores activos) \xD7 " + nf(+t.fc || 1, 2) + " = " + nf(fcOf(t), 2), r: nf(fcOf(t), 2), why: "temperatura: RIC N\xB004, Tabla 4.7 (cable de 70 \xB0C); agrupamiento: RIC N\xB004, Tabla 4.6, que cuenta conductores activos en el mismo ducto (en monof\xE1sico, fase y neutro; la tierra nunca cuenta)." });
  const { KMAG, iccCalc } = RICEngine;
  function tIcc() {
    return tPage("icc", "RIC N\xB005 y N\xB010", "Cortocircuito, poder de corte y selectividad", "Calcula la corriente de cortocircuito en el tablero y al final del circuito, y verifica que los autom\xE1ticos la corten y que el general no salte antes que el del circuito.",
      '<div class="grid">' + fNum("tools.icc.Icc0", "Icc presunta en el empalme", { unit: "kA", help: "Dato de la distribuidora; en viviendas urbanas suele estar entre 1,5 y 6 kA" }) + fSel("tools.icc.Sa", "Secci\xF3n del alimentador", SECC.slice(2, 8).map((x) => [x, sStr(x) + " mm\xB2"])) + fNum("tools.icc.La", "Largo del alimentador", { unit: "m" }) + fNum("tools.icc.Ig", "Interruptor general", { unit: "A" }) + fSel("tools.icc.pdcG", "Poder de corte del general", [[4.5, "4,5 kA"], [6, "6 kA"], [10, "10 kA"]]) + fNum("tools.icc.In", "Autom\xE1tico del circuito " + ab("In"), { unit: "A" }) + fSel("tools.icc.cv", "Curva", [["B", "B (3–5 In)"], ["C", "C (5–10 In)"], ["D", "D (10–20 In)"]]) + fSel("tools.icc.pdc", "Poder de corte del autom\xE1tico", [[4.5, "4,5 kA"], [6, "6 kA"], [10, "10 kA"]]) + fSel("tools.icc.S", "Secci\xF3n del circuito", SECC.slice(0, 6).map((x) => [x, sStr(x) + " mm\xB2"])) + fNum("tools.icc.L", "Largo del circuito hasta el punto m\xE1s lejano", { unit: "m" }) + "</div>",
      "<p>Un <b>cortocircuito</b> es un contacto casi sin resistencia entre fase y neutro o tierra. La corriente queda limitada solo por la red y los cables, y puede llegar a miles de amperes.</p><p>Se revisan dos valores. La <b>Icc m\xE1xima</b>, en el tablero, decide el <b>poder de corte</b>: el autom\xE1tico debe poder abrir esa corriente sin destruirse. La <b>Icc m\xEDnima</b>, al final del circuito con el cable caliente, decide si el <b>disparo magn\xE9tico</b> act\xFAa: si el cable es muy largo o delgado, la falla no alcanza 5 \xD7 In (curva B) o 10 \xD7 In (curva C) y el corte demora segundos, con riesgo de incendio.</p><p>La <b>selectividad</b> busca que ante una falla salte solo el autom\xE1tico del circuito y no el general. Con autom\xE1ticos modulares suele ser parcial: hay que revisar las tablas del fabricante.</p>");
  }
  function cIcc() {
    const t = T("icc");
    if (!(+t.Icc0 > 0) || !(+t.In > 0) || !(+t.L > 0)) return note("Ingresa la Icc del empalme, el autom\xE1tico y el largo del circuito.");
    const r = iccCalc(t);
    return kpis([kpi("Icc m\xE1x. tablero", nf(r.Imax / 1e3, 2), "kA", r.okPdc && r.okPdcG ? "ok" : "bad"), kpi("Icc m\xEDn. final", n0(r.Imin), "A", r.okMag ? "ok" : "bad"), kpi("Largo m\xE1x. protegido", n0(r.Lmax), "m"), kpi("Ig / In", nf(r.ratio, 2), "", r.ratio >= 1.6 ? "ok" : "warn")]) + steps([
      { t: "Impedancia de la red", f: "Zs = U0 \xF7 Icc empalme", s: "Zs = 220 \xF7 " + n0(+t.Icc0 * 1e3) + " = " + nf(r.Zs * 1e3, 1) + " mΩ", r: nf(r.Zs * 1e3, 1) + " mΩ", why: "todo lo que hay antes del medidor (transformador y red) se resume en esta impedancia." },
      { t: "Icc m\xE1xima en el tablero", f: "Icc m\xE1x = U0 \xF7 (Zs + R alimentador) \xB7 R = 2 \xD7 ρ \xD7 L \xF7 S", s: "220 \xF7 (" + nf(r.Zs, 4) + " + " + nf(r.Ra, 4) + ") = " + n0(r.Imax) + " A", r: nf(r.Imax / 1e3, 2) + " kA", ok: r.okPdc && r.okPdcG, why: r.okPdc && r.okPdcG ? "el general (" + nf(+t.pdcG, 1) + " kA) y el autom\xE1tico (" + nf(+t.pdc, 1) + " kA) pueden abrir esta corriente." : "un autom\xE1tico con poder de corte menor que la Icc puede explotar o soldarse al cortar: usa uno de mayor poder de corte." },
      { t: "Icc m\xEDnima al final del circuito", q: "Peor caso: falla en el punto m\xE1s lejano, cable caliente (× 1,5) y tensi\xF3n baja (× 0,95). M\xE9todo convencional de c\xE1lculo (criterio usual): los pliegos RIC no fijan estos factores.", f: "Icc m\xEDn = 0,95 \xD7 U0 \xF7 (Zs + 1,5 \xD7 (R alim + R circuito))", s: "0,95 \xD7 220 \xF7 (" + nf(r.Zs, 4) + " + 1,5 \xD7 (" + nf(r.Ra, 4) + " + " + nf(r.Rc, 4) + ")) = " + n0(r.Imin) + " A", r: n0(r.Imin) + " A", ok: r.okMag, why: "para que act\xFAe el disparo magn\xE9tico (instant\xE1neo) se necesitan " + KMAG[t.cv] + " \xD7 " + t.In + " = " + n0(r.Im) + " A. " + (r.okMag ? "Se cumple." : "No se cumple: acorta el circuito, aumenta la secci\xF3n o usa curva B.") },
      { t: "Largo m\xE1ximo protegido", f: "L m\xE1x = (0,95 \xD7 U0 \xF7 Im − Zs − 1,5 \xD7 Ra) \xD7 S \xF7 (3 \xD7 ρ)", s: "L m\xE1x = " + n0(r.Lmax) + " m con " + sStr(+t.S) + " mm\xB2 y " + t.In + " A curva " + t.cv, r: n0(r.Lmax) + " m", ok: +t.L <= r.Lmax, why: "\xFAtil en obra: hasta d\xF3nde puedes alargar el circuito sin perder la protecci\xF3n contra cortocircuito." },
      { t: "Esfuerzo t\xE9rmico del cable", f: "S ≥ √(Icc\xB2 \xD7 t) \xF7 k \xB7 k = 115 (cobre, PVC) \xB7 t ≈ 10 ms", s: "S m\xEDn = √(" + n0(r.Imax) + "\xB2 \xD7 0,01) \xF7 115 = " + nf(r.Smin, 2) + " mm\xB2", r: nf(r.Smin, 2) + " mm\xB2", ok: r.okTh, why: "el cable debe aguantar el calor de la falla durante lo que tarda en cortar el autom\xE1tico." },
      { t: "Selectividad general ↔ circuito", f: "Ig \xF7 In ≥ 1,6 (selectividad de sobrecarga) \xB7 selectivo en cortocircuito si Icc < 5 \xD7 Ig", s: nf(r.ratio, 2) + " \xB7 el general no salta por fallas bajo " + n0(r.Igm) + " A, es decir a m\xE1s de ≈ " + n0(r.Lsel) + " m del tablero", r: r.ratio >= 1.6 ? "Selectividad parcial" : "Selectividad reducida", ok: r.ratio >= 1.6 ? true : "warn", why: "cerca del tablero la falla es tan grande que pueden saltar ambos; para selectividad total se necesitan las tablas del fabricante o un general de mayor calibre o curva." }
    ]);
  }
  function tEv() {
    const t = T("ev");
    return tPage("ev", "RIC N\xB015", "Cargador de veh\xEDculo el\xE9ctrico", "Dimensiona el circuito exclusivo de un punto de carga domiciliario (wallbox o modo 3).",
      '<div class="grid">' + fSel("tools.ev.P", "Potencia del cargador", [[3700, "3,7 kW (16 A monof\xE1sico)"], [7400, "7,4 kW (32 A monof\xE1sico)"], [11e3, "11 kW (16 A trif\xE1sico)"], [22e3, "22 kW (32 A trif\xE1sico)"]], { re: true }) + fNum("tools.ev.L", "Largo desde el tablero", { unit: "m" }) + fNum("tools.ev.Pd", "Demanda actual de la vivienda", { unit: "W", help: "De tu cuadro de cargas" }) + fNum("tools.ev.Ig", "Interruptor general actual", { unit: "A" }) + fSel("tools.ev.amb", "Ubicaci\xF3n", [["int", "Garaje cerrado"], ["ext", "Exterior bajo alero"], ["intem", "A la intemperie"]]) + fcFields("ev") + "</div>",
      "<p>Un cargador trabaja horas a corriente constante, as\xED que el circuito se dimensiona para carga continua: protecci\xF3n con margen sobre la corriente nominal, un circuito exclusivo por punto de carga y protecci\xF3n diferencial capaz de detectar fugas con componente continua (los cargadores la generan).</p><p>Antes de instalarlo revisa que el empalme y el general soporten la nueva carga: una carga de 7,4 kW equivale a casi toda la demanda de una casa t\xEDpica.</p>");
  }
  function cEv() {
    const t = T("ev"), P0 = +t.P || 7400, tri = P0 > 8e3, V = tri ? 380 : 220, I = P0 === 3700 || P0 === 11e3 ? 16 : 32, P = tri ? Math.sqrt(3) * V * I : V * I, In = nextCom(1.25 * I), fc = fcOf(t);
    if (!(+t.L > 0)) return note("Ingresa el largo desde el tablero.");
    const { tries, sel } = chooseS({ I, In, L: +t.L, k: tri ? Math.sqrt(3) : 2, Vref: V, rho: 0.018, lim: 3, Smin: 2.5, fc });
    const Pd2 = (+t.Pd || 0) + P, Ib = tri ? Pd2 / 3 / 220 : Pd2 / 220, okG = !(+t.Ig > 0) || Ib <= +t.Ig, ip = { int: "IP44", ext: "IP54", intem: "IP54 y protecci\xF3n UV" }[t.amb || "int"];
    return kpis([kpi("Corriente", nf(I, 1), "A"), kpi("Autom\xE1tico", In || "—", "A curva C"), kpi("Secci\xF3n", sel ? sStr(sel.s) : "—", "mm\xB2", sel ? "ok" : "bad"), kpi("General", okG ? "Suficiente" : "Aumentar", "", okG ? "ok" : "bad")]) + steps([
      { t: "Corriente del cargador", f: "Corriente nominal de placa del cargador", s: I + " A" + (tri ? " por fase" : "") + " \u2192 P = " + (tri ? "\u221A3 \xD7 380" : "220") + " \xD7 " + I + " = " + n0(P) + " W", r: I + " A", why: "el cargador limita su corriente a este valor durante toda la carga." },
      { t: "Protecci\xF3n (carga continua)", f: "In ≥ 1,25 \xD7 I", s: "1,25 \xD7 " + nf(I, 1) + " = " + nf(1.25 * I, 1) + " A → " + In + " A curva C, " + (tri ? "4P" : "2P"), r: In + " A", ok: In != null, why: "criterio usual para cargas que funcionan varias horas seguidas: el autom\xE1tico no debe trabajar al l\xEDmite." },
      fcStep(t),
      { t: "Secci\xF3n del conductor", f: "S ≥ 2,5 mm\xB2 \xB7 Iz \xD7 fc ≥ In \xB7 ΔV ≤ 3 %", s: sel ? sStr(sel.s) + " mm\xB2: Iz " + n0(sel.Iz) + " A \xB7 ΔV " + nf(sel.pct, 2) + " %" : "Ninguna secci\xF3n cumple", r: sel ? sStr(sel.s) + " mm\xB2" : "—", ok: !!sel },
      { t: "Protecci\xF3n diferencial", f: "30 mA tipo A + detecci\xF3n de continua 6 mA (RDC-DD), o diferencial tipo B", why: "un diferencial clase AC o A com\xFAn puede quedar “ciego” ante fugas continuas del cargador. Muchos wallbox traen la detecci\xF3n de 6 mA incorporada: rev\xEDsalo en su ficha.", ok: true },
      { t: "Capacidad del general y del empalme", f: "Demanda actual + cargador ≤ general", s: n0(+t.Pd || 0) + " + " + n0(P) + " = " + n0(Pd2) + " W → " + nf(Ib, 1) + " A" + (+t.Ig > 0 ? " vs " + t.Ig + " A" : ""), ok: +t.Ig > 0 ? okG : void 0, why: okG ? "el empalme actual soporta la carga; considera programar la carga en horario nocturno." : "pide aumento de capacidad del empalme a la distribuidora o usa un cargador con gesti\xF3n din\xE1mica de potencia." },
      { t: "Instalaci\xF3n", f: "Circuito exclusivo \xB7 enchufe o cargador " + ip + " \xB7 altura de toma 0,5 a 1,5 m \xB7 PE obligatorio", why: "la comunicaci\xF3n de la instalaci\xF3n a la SEC se hace con el tr\xE1mite que corresponda a puntos de carga; confirma los requisitos vigentes del RIC N\xB015." }
    ]) + '<h3 style="margin-top:16px">Secciones comparadas</h3>' + cmpTable(tries, sel, "ΔV ≤ 3 %");
  }
  function fvCalc(t) {
    const kWp = (+t.kwh || 0) * 12 / ((+t.hsp || 5) * 365 * (+t.pr || 0.8)), N = Math.max(1, Math.ceil(kWp * 1e3 / (+t.Wp || 550))), b = (+t.bVoc || -0.27) / 100;
    const VocC = (+t.Voc || 49.5) * (1 + b * ((+t.Tmin || -5) - 25)), VmpH = (+t.Vmp || 41.5) * (1 + b * ((+t.Tmax || 70) - 25)), VmpC = (+t.Vmp || 41.5) * (1 + b * ((+t.Tmin || -5) - 25));
    const nMax = Math.floor(Math.min((+t.Vmax || 600) / VocC, (+t.mppt1 || 550) / VmpC)), nMin = Math.ceil((+t.mppt0 || 120) / VmpH);
    let best = null;
    for (let ns = 1; ns <= 4; ns++) {
      const per = Math.ceil(N / ns);
      if (per >= nMin && per <= nMax) {
        best = { ns, per };
        break;
      }
    }
    const kWpR = (best ? best.ns * best.per : N) * (+t.Wp || 550) / 1e3, Pinv = +t.Pinv > 0 ? +t.Pinv : Math.max(1, Math.round(kWpR / 1.15 * 2) / 2) * 1e3, Iac = Pinv / 220, In = nextCom(1.25 * Iac);
    return { kWp, N, VocC, VmpH, nMax, nMin, best, kWpR, Pinv, Iac, In, gen: kWpR * (+t.hsp || 5) * 30 * (+t.pr || 0.8) };
  }
  function tFv() {
    return tPage("fv", "RIC N\xB009 \xB7 Ley 20.571", "Sistema fotovoltaico domiciliario", "Estima la potencia de paneles para cubrir tu consumo, arma los strings seg\xFAn el inversor y dimensiona el circuito de inyecci\xF3n (net billing).",
      '<div class="grid">' + fNum("tools.fv.kwh", "Consumo mensual", { unit: "kWh", help: "Est\xE1 en tu boleta" }) + fNum("tools.fv.hsp", "Horas sol pico", { unit: "h/d\xEDa", help: "Norte 6–7 \xB7 Santiago 5 \xB7 Sur 3–4" }) + fNum("tools.fv.Wp", "Potencia del panel", { unit: "Wp" }) + fNum("tools.fv.Voc", "Voc del panel", { unit: "V" }) + fNum("tools.fv.Vmp", "Vmp del panel", { unit: "V" }) + fNum("tools.fv.bVoc", "Coef. de temperatura de Voc", { unit: "%/\xB0C" }) + fNum("tools.fv.Tmin", "Temperatura m\xEDnima del lugar", { unit: "\xB0C" }) + fNum("tools.fv.Vmax", "Tensi\xF3n m\xE1x. CC del inversor", { unit: "V" }) + fNum("tools.fv.mppt0", "MPPT m\xEDnimo", { unit: "V" }) + fNum("tools.fv.mppt1", "MPPT m\xE1ximo", { unit: "V" }) + fNum("tools.fv.Lac", "Largo inversor → tablero", { unit: "m" }) + "</div>",
      "<p>Con <b>net billing</b> (Ley 20.571) la vivienda inyecta a la red lo que no consume y la distribuidora lo descuenta de la boleta. El sistema tiene una parte en <b>corriente continua</b> (paneles en serie, llamados strings) y una en <b>alterna</b> (inversor → tablero).</p><p>La tensi\xF3n de un panel <b>sube con el fr\xEDo</b>: el string se calcula con la temperatura m\xEDnima para no superar la tensi\xF3n m\xE1xima del inversor, y con el calor para no quedar bajo el rango MPPT.</p>");
  }
  function cFv() {
    const t = T("fv");
    if (!(+t.kwh > 0)) return note("Ingresa el consumo mensual.");
    const r = fvCalc(t), { tries, sel } = chooseS({ I: r.Iac, In: r.In, L: +t.Lac || 10, k: 2, Vref: 220, rho: 0.018, lim: 1.5, Smin: 2.5, fc: 1 });
    return kpis([kpi("Potencia FV", nf(r.kWpR, 2), "kWp"), kpi("Paneles", r.best ? r.best.ns * r.best.per : r.N), kpi("Strings", r.best ? r.best.ns + " \xD7 " + r.best.per : "—", "", r.best ? "ok" : "bad"), kpi("Generaci\xF3n", n0(r.gen), "kWh/mes")]) + steps([
      { t: "Potencia necesaria", f: "kWp = consumo anual \xF7 (HSP \xD7 365 \xD7 PR)", s: n0(+t.kwh * 12) + " \xF7 (" + nf(+t.hsp, 1) + " \xD7 365 \xD7 " + nf(+t.pr || 0.8, 2) + ") = " + nf(r.kWp, 2) + " kWp → " + r.N + " paneles de " + t.Wp + " Wp", r: nf(r.kWp, 2) + " kWp", why: "PR (rendimiento global) descuenta p\xE9rdidas por temperatura, suciedad, cables e inversor." },
      { t: "Voc en fr\xEDo (tensi\xF3n m\xE1xima)", f: "Voc fr\xEDo = Voc \xD7 (1 + β \xD7 (Tmin − 25))", s: nf(+t.Voc, 1) + " \xD7 (1 + " + nf(+t.bVoc / 100, 4) + " \xD7 (" + t.Tmin + " − 25)) = " + nf(r.VocC, 1) + " V", r: "M\xE1x. " + r.nMax + " paneles por string", why: "en la ma\xF1ana fr\xEDa, con sol y sin carga, la tensi\xF3n del string es la m\xE1s alta: no debe superar la del inversor." },
      { t: "Vmp en calor (tensi\xF3n m\xEDnima)", f: "Vmp caliente = Vmp \xD7 (1 + β \xD7 (70 − 25))", s: nf(r.VmpH, 1) + " V por panel", r: "M\xEDn. " + r.nMin + " paneles por string", why: "con el panel a 70 \xB0C la tensi\xF3n baja; si el string queda bajo el MPPT m\xEDnimo, el inversor no produce." },
      { t: "Configuraci\xF3n de strings", f: r.nMin + " ≤ paneles por string ≤ " + r.nMax, s: r.best ? r.best.ns + " string(s) de " + r.best.per + " paneles = " + nf(r.kWpR, 2) + " kWp" : "No hay configuraci\xF3n v\xE1lida con 1 a 4 strings", ok: !!r.best, why: "strings iguales en cada entrada MPPT; con 3 o m\xE1s strings en paralelo se necesitan fusibles de string (≈ 1,5 a 2 \xD7 Isc)." },
      { t: "Inversor", f: "P inversor ≈ kWp \xF7 1,1 a 1,2", s: n0(r.Pinv) + " W", r: nf(r.Pinv / 1e3, 1) + " kW", why: "el inversor debe estar en el listado de equipos autorizados por la SEC para generaci\xF3n distribuida." },
      { t: "Circuito de inyecci\xF3n (lado alterna)", f: "In ≥ 1,25 \xD7 I inversor \xB7 ΔV ≤ 1,5 % recomendado", s: "I = " + nf(r.Iac, 1) + " A → " + r.In + " A \xB7 " + (sel ? sStr(sel.s) + " mm\xB2, ΔV " + nf(sel.pct, 2) + " %" : "sin secci\xF3n v\xE1lida"), r: sel ? sStr(sel.s) + " mm\xB2" : "—", ok: !!sel, why: "baja ca\xEDda para que el inversor no se desconecte por sobretensi\xF3n al inyectar." },
      { t: "Protecciones y tr\xE1mite", f: "Lado CC: seccionador CC y protector de sobretensiones \xB7 Lado CA: autom\xE1tico, diferencial 30 mA tipo A (o el que indique el inversor) y protecci\xF3n RI incorporada", why: "la conexi\xF3n se tramita con la distribuidora (solicitud de conexi\xF3n) y se declara a la SEC con el formulario de generaci\xF3n (TE4). Confirma los requisitos vigentes antes de ejecutar." }
    ]) + '<h3 style="margin-top:16px">Secci\xF3n del circuito de inyecci\xF3n</h3>' + cmpTable(tries, sel, "ΔV ≤ 1,5 %");
  }
  const EN_DEF = [["Ampolletas", 10, 60, 4, 9], ["Refrigerador", 1, 150, 10, 0], ["Lavadora", 1, 500, 0.5, 0], ["Televisor", 1, 100, 5, 0], ["Computador", 1, 120, 6, 0], ["Hervidor", 1, 2e3, 0.2, 0], ["Microondas", 1, 1100, 0.3, 0], ["Plancha", 1, 1200, 0.2, 0], ["Calefactor el\xE9ctrico", 1, 1500, 3, 0], ["Termo el\xE9ctrico", 0, 2e3, 2, 0]];
  function tEnergia() {
    const t = T("energia");
    if (!Array.isArray(t.rows) || !t.rows.length) t.rows = EN_DEF.map(([n, c, w, h, led]) => ({ n, c, w, h, led }));
    const rows = t.rows.map((r, i) => "<tr><td>" + cTxt("tools.energia.rows." + i + ".n", "Equipo", "Equipo") + "</td><td>" + cNum("tools.energia.rows." + i + ".c", 56, "Cantidad") + "</td><td>" + cNum("tools.energia.rows." + i + ".w", 70, "W") + "</td><td>" + cNum("tools.energia.rows." + i + ".h", 56, "Horas") + "</td><td>" + cNum("tools.energia.rows." + i + ".led", 56, "W eficiente") + "</td></tr>").join("");
    return tPage("energia", "Eficiencia energ\xE9tica", "Consumo y costo de energ\xEDa", "Estima cu\xE1nto consume la vivienda al mes, cu\xE1nto cuesta y cu\xE1nto ahorras cambiando a equipos eficientes.",
      '<div class="grid">' + fNum("tools.energia.tar", "Precio de la energ\xEDa", { unit: "$/kWh", help: "Valor con IVA de tu boleta (cargo por energ\xEDa)" }) + '</div><div class="tbl-wrap"><table class="pt"><thead><tr><th>Equipo</th><th>Cant.</th><th>W c/u</th><th>Horas/d\xEDa</th><th>W alternativa eficiente</th></tr></thead><tbody>' + rows + '</tbody></table></div><p class="hint">Deja en 0 la columna eficiente si no hay alternativa. Ej.: ampolleta incandescente 60 W → LED 9 W.</p>',
      "<p>La energ\xEDa (kWh) es potencia por tiempo: un equipo de 1.000 W encendido una hora consume 1 kWh. Por eso un hervidor de 2.000 W gasta poco (se usa minutos) y un refrigerador de 150 W gasta mucho (funciona todo el d\xEDa).</p><p>La iluminaci\xF3n LED consume entre 80 y 90 % menos que la incandescente y dura muchas veces m\xE1s. Tambi\xE9n reduce la corriente del circuito de alumbrado.</p>");
  }
  function cEnergia() {
    const t = T("energia"), tar = +t.tar || 0, R = (t.rows || []).map((r) => ({ n: r.n, kwh: (+r.c || 0) * (+r.w || 0) * (+r.h || 0) * 30 / 1e3, kwh2: +r.led > 0 ? (+r.c || 0) * +r.led * (+r.h || 0) * 30 / 1e3 : null })).filter((r) => r.kwh > 0);
    if (!R.length) return note("Ingresa al menos un equipo con cantidad, potencia y horas.");
    const tot = R.reduce((a, r) => a + r.kwh, 0), tot2 = R.reduce((a, r) => a + (r.kwh2 != null ? r.kwh2 : r.kwh), 0), sv = tot - tot2;
    return kpis([kpi("Consumo", n0(tot), "kWh/mes"), kpi("Costo", "$" + n0(tot * tar), "/mes"), kpi("Ahorro posible", n0(sv), "kWh/mes", sv > 0 ? "ok" : ""), kpi("Ahorro anual", "$" + n0(sv * tar * 12), "")]) + '<div class="tbl-wrap"><table class="pt"><thead><tr><th>Equipo</th><th class="num">kWh/mes</th><th class="num">$/mes</th><th class="num">% del total</th><th class="num">Eficiente kWh/mes</th></tr></thead><tbody>' + R.sort((a, b) => b.kwh - a.kwh).map((r) => "<tr><td>" + esc(r.n) + '</td><td class="num">' + n1(r.kwh) + '</td><td class="num">$' + n0(r.kwh * tar) + '</td><td class="num">' + n0(r.kwh / tot * 100) + ' %</td><td class="num">' + (r.kwh2 != null ? n1(r.kwh2) : "—") + "</td></tr>").join("") + "</tbody></table></div>" + steps([{ t: "Energ\xEDa de cada equipo", f: "kWh/mes = cantidad \xD7 W \xD7 horas/d\xEDa \xD7 30 \xF7 1.000", r: n0(tot) + " kWh/mes" }, { t: "Costo", f: "$ = kWh \xD7 precio", s: n0(tot) + " \xD7 " + n0(tar) + " = $" + n0(tot * tar), r: "$" + n0(tot * tar) + " al mes" }]);
  }
  const TD_DEF = [["Alumbrado 2.\xBA piso", "alumbrado", 800, 18], ["Enchufes dormitorios", "enchufes", 1500, 22], ["Enchufes ba\xF1o y estar", "enchufes", 1000, 15], ["", "enchufes", 0, 0], ["", "enchufes", 0, 0], ["", "enchufes", 0, 0]];
  function tTd() {
    const t = T("td");
    if (!Array.isArray(t.rows) || !t.rows.length) t.rows = TD_DEF.map(([n, tipo, P, L]) => ({ n, tipo, P, L }));
    const rows = t.rows.map((r, i) => "<tr><td>" + cTxt("tools.td.rows." + i + ".n", "Circuito", "Nombre") + "</td><td>" + cSel("tools.td.rows." + i + ".tipo", [["alumbrado", "Alumbrado"], ["enchufes", "Enchufes"], ["horno", "Fuerza / equipo"]], "Tipo", false) + "</td><td>" + cNum("tools.td.rows." + i + ".P", 76, "Potencia W") + "</td><td>" + cNum("tools.td.rows." + i + ".L", 60, "Largo m") + "</td></tr>").join("");
    return tPage("td", "RIC N\xB002 y N\xB003", "Tablero de distribuci\xF3n", "Dimensiona un tablero secundario (2.\xBA piso, garaje, ampliaci\xF3n): subalimentador desde el tablero general, sus protecciones y la ca\xEDda de tensi\xF3n acumulada hasta el punto m\xE1s lejano.",
      '<div class="grid">' + fNum("tools.td.Pv", "Demanda total de la vivienda", { unit: "W", help: "Incluye la del tablero de distribuci\xF3n" }) + fNum("tools.td.Ig", "General del tablero principal", { unit: "A" }) + fSel("tools.td.Sa", "Alimentador (medidor → general)", SECC.slice(2, 7).map((x) => [x, sStr(x) + " mm\xB2"])) + fNum("tools.td.La", "Largo del alimentador", { unit: "m" }) + fNum("tools.td.Ls", "Largo del subalimentador (general → distribuci\xF3n)", { unit: "m" }) + fcFields("td") + '</div><h3 style="margin:14px 0 6px">Circuitos del tablero de distribuci\xF3n</h3><div class="tbl-wrap"><table class="pt"><thead><tr><th>Circuito</th><th>Tipo</th><th>Potencia (W)</th><th>Largo (m)</th></tr></thead><tbody>' + rows + "</tbody></table></div>",
      "<p>Un <b>tablero de distribuci\xF3n</b> se alimenta desde el tablero general mediante un <b>subalimentador</b> protegido por su propio autom\xE1tico. Se usa cuando parte de la vivienda queda lejos del general (segundo piso, quincho, taller) o para ordenar los circuitos.</p><p>La ca\xEDda de tensi\xF3n se <b>suma</b>: alimentador + subalimentador + circuito no debe superar el 5 % hasta el punto m\xE1s lejano, y el tramo alimentador + subalimentador se recomienda bajo el 3 %. Para que una falla en un circuito no deje sin energ\xEDa a todo el tablero, el autom\xE1tico del subalimentador debe ser mayor que los de sus circuitos (selectividad), y el general mayor que el del subalimentador.</p>");
  }
  function cTd() {
    const t = T("td"), rho = 0.018, fc = fcOf(t), V = 220, R = (t.rows || []).filter((r) => +r.P > 0);
    if (!R.length) return note("Ingresa al menos un circuito con potencia.");
    const C = R.map((r) => {
      const I = +r.P / V, Smin = r.tipo === "alumbrado" ? 1.5 : 2.5, tmin = r.tipo === "horno" ? 16 : 0, In = chooseIn(I, +r.P, V, 1, tmin), sel = chooseS({ I, In, L: +r.L || 1, k: 2, Vref: V, rho, lim: 5, Smin, fc }).sel;
      return { r, I, In, S: sel ? sel.s : null, dv: sel ? 2 * rho * (+r.L || 0) * I / sel.s / V * 100 : null, cv: r.tipo === "alumbrado" ? "B" : "C" };
    });
    const Pi = R.reduce((a, r) => a + +r.P, 0), Pd = fdViv(Pi).Pd, Is = Pd / V, maxIn = Math.max(...C.map((c) => c.In || 0)), InS = nextCom(Math.max(Is * 1.1, maxIn * 1.6)), ss = chooseS({ I: Is, In: InS, L: +t.Ls || 1, k: 2, Vref: V, rho, lim: 2, Smin: 2.5, fc }), Ss = ss.sel;
    const Iv = (+t.Pv || Pd) / V, dva = 2 * rho * (+t.La || 0) * Iv / (+t.Sa || 6) / V * 100, dvs = Ss ? 2 * rho * (+t.Ls || 0) * Is / Ss.s / V * 100 : 99, nDR = Math.ceil(C.length / 3), okSel = !(+t.Ig > 0) || +t.Ig >= InS * 1.25;
    const worst = C.reduce((a, c) => c.dv != null && c.dv > (a ? a.dv : -1) ? c : a, null), tot = dva + dvs + (worst ? worst.dv : 0);
    return kpis([kpi("Demanda del tablero", n0(Pd), "W"), kpi("Subalimentador", Ss ? sStr(Ss.s) + " mm\xB2" : "—", InS + " A", Ss ? "ok" : "bad"), kpi("ΔV alim. + sub.", nf(dva + dvs, 2), "%", dva + dvs <= 3 ? "ok" : "bad"), kpi("ΔV total m\xE1x.", nf(tot, 2), "%", tot <= 5 ? "ok" : "bad")]) + '<div class="tbl-wrap"><table class="pt"><thead><tr><th>Circuito</th><th class="num">P (W)</th><th class="num">I (A)</th><th>Protecci\xF3n</th><th>Cable</th><th class="num">ΔV circ.</th><th class="num">ΔV acumulada</th></tr></thead><tbody>' + C.map((c, i) => "<tr><td>C" + (i + 1) + " " + esc(c.r.n || "") + '</td><td class="num">' + n0(+c.r.P) + '</td><td class="num">' + nf(c.I, 2) + "</td><td>" + (c.In || "—") + " A curva " + c.cv + " \xB7 DR" + (Math.floor(i / 3) + 1) + "</td><td>" + (c.S ? sStr(c.S) + " mm\xB2" : "—") + '</td><td class="num">' + (c.dv != null ? nf(c.dv, 2) + " %" : "—") + '</td><td class="num ' + (c.dv != null && dva + dvs + c.dv > 5 ? "bad" : "") + '">' + (c.dv != null ? nf(dva + dvs + c.dv, 2) + " %" : "—") + "</td></tr>").join("") + "</tbody></table></div>" + steps([
      { t: "Demanda del tablero de distribuci\xF3n", f: "Pd = 3.000 + (P inst − 3.000) \xD7 0,35 (RIC N\xB003)", s: "P inst " + n0(Pi) + " W → Pd " + n0(Pd) + " W → I = " + nf(Is, 2) + " A", r: n0(Pd) + " W" },
      { t: "Protecci\xF3n del subalimentador", f: "In ≥ 1,1 \xD7 I y In ≥ 1,6 \xD7 mayor autom\xE1tico de los circuitos (selectividad)", s: "1,1 \xD7 " + nf(Is, 2) + " = " + nf(Is * 1.1, 1) + " A \xB7 1,6 \xD7 " + maxIn + " = " + nf(maxIn * 1.6, 1) + " A → " + InS + " A curva C", r: InS + " A", ok: InS != null },
      fcOf(t) !== 1 ? fcStep(t) : null,
      { t: "Secci\xF3n del subalimentador", f: "S ≥ 2,5 mm\xB2 \xB7 Iz \xD7 fc ≥ In \xB7 ΔV ≤ 2 % (recomendado)", s: Ss ? sStr(Ss.s) + " mm\xB2: Iz " + n0(Ss.Iz) + " A \xB7 ΔV " + nf(dvs, 2) + " %" : "Ninguna secci\xF3n cumple: acerca el tablero o reduce la carga", r: Ss ? sStr(Ss.s) + " mm\xB2 (fase, neutro y PE)" : "—", ok: !!Ss },
      { t: "Ca\xEDda de tensi\xF3n acumulada", f: "ΔV alimentador + subalimentador ≤ 3 % \xB7 + circuito ≤ 5 % (RIC N\xB003)", s: nf(dva, 2) + " + " + nf(dvs, 2) + (worst ? " + " + nf(worst.dv, 2) + " (" + (worst.r.n || "circuito m\xE1s cargado") + ")" : "") + " = " + nf(tot, 2) + " %", r: nf(tot, 2) + " %", ok: dva + dvs <= 3 && tot <= 5 },
      { t: "Coordinaci\xF3n con el general", f: "General ≥ 1,25 \xD7 autom\xE1tico del subalimentador", s: (+t.Ig > 0 ? t.Ig + " A vs " + InS + " A" : "Ingresa el general para verificar"), ok: +t.Ig > 0 ? okSel : void 0, why: okSel ? "ante una sobrecarga en el tablero de distribuci\xF3n act\xFAa primero su propio autom\xE1tico." : "con un general tan cercano al subalimentador pueden dispararse ambos: sube el general (si el empalme lo permite) o reparte la carga." },
      { t: "Armado del tablero de distribuci\xF3n", f: "Interruptor de cabecera " + InS + " A \xB7 " + nDR + " diferencial(es) 30 mA (m\xE1x. 3 circuitos c/u) \xB7 " + C.length + " autom\xE1ticos \xB7 barras N y PE \xB7 tapa y rotulado", why: "el PE del subalimentador une la barra PE del tablero de distribuci\xF3n con la del general; no se vuelve a unir el neutro con tierra en este tablero (RIC N\xB002)." }
    ]);
  }
  const MOM_DEF = [["Enchufe 1", 250, 4], ["Enchufe 2", 250, 7.5], ["Enchufe 3", 250, 11], ["Enchufe 4", 250, 14], ["Enchufe 5", 250, 17.5], ["Enchufe 6", 250, 21], ["", 0, 0], ["", 0, 0]];
  function tMom() {
    const t = T("mom");
    if (!Array.isArray(t.rows) || !t.rows.length) t.rows = MOM_DEF.map(([n, P, L]) => ({ n, P, L }));
    const rows = t.rows.map((r, i) => "<tr><td>" + (i + 1) + "</td><td>" + cTxt("tools.mom.rows." + i + ".n", "Punto", "Nombre") + "</td><td>" + cNum("tools.mom.rows." + i + ".P", 76, "Potencia W") + "</td><td>" + cNum("tools.mom.rows." + i + ".L", 70, "Distancia m") + "</td></tr>").join("");
    return tPage("mom", "RIC N\xB003, 5.1.3", "Ca\xEDda en circuitos: momentos el\xE9ctricos", "Para circuitos interiores con varias cargas repartidas (enchufes, centros de luz): calcula la ca\xEDda sumando el momento de cada carga, la secci\xF3n m\xEDnima y la compara con suponer toda la carga al final.",
      '<div class="grid">' + fNum("tools.mom.V", "Tensi\xF3n " + ab("V"), { unit: "V" }) + fSel("tools.mom.S", "Secci\xF3n del circuito " + ab("S"), SECC.slice(0, 6).map((x) => [x, sStr(x) + " mm\xB2"])) + fNum("tools.mom.lim", "Ca\xEDda permitida en el circuito", { unit: "%", help: "5 % total menos lo que use el alimentador (t\xEDpico 2 a 3 %)" }) + fNum("tools.mom.dva", "Ca\xEDda del alimentador (opcional)", { unit: "%" }) + '</div><h3 style="margin:14px 0 6px">Cargas del circuito</h3><div class="tbl-wrap"><table class="pt"><thead><tr><th>#</th><th>Punto</th><th>Potencia (W)</th><th>Distancia desde el tablero (m)</th></tr></thead><tbody>' + rows + '</tbody></table></div><p class="hint">La distancia es el recorrido real del cable desde el tablero hasta cada punto (solo ida). Usa 100 W por centro de luz y 250 W por enchufe, o la potencia real del equipo.</p>',
      "<p>La f\xF3rmula ΔV = 2\xB7ρ\xB7L\xB7I \xF7 S sirve para una carga <b>concentrada</b> al final de la l\xEDnea, como el alimentador entre el empalme y el tablero. En un circuito interior la corriente no recorre todo el cable completa: cada enchufe o centro de luz toma su parte en el camino, as\xED que el \xFAltimo tramo lleva poca corriente.</p><p>El <b>m\xE9todo de los momentos el\xE9ctricos</b> considera eso: cada carga aporta su corriente multiplicada por su distancia al tablero (su <b>momento</b>, I\xB7L o P\xB7L). La ca\xEDda hasta el punto m\xE1s lejano es ΔV = 2\xB7ρ\xB7Σ(Iᵢ\xB7Lᵢ) \xF7 S. Es equivalente a sumar tramo por tramo la corriente que circula por cada uno.</p><p>Si se supusiera toda la carga en el extremo, el resultado sale mayor y se elegir\xEDan cables m\xE1s gruesos de lo necesario. Si las cargas est\xE1n repartidas en forma pareja, el resultado se parece a poner toda la carga en la mitad del largo.</p>");
  }
  function cMom() {
    const t = T("mom"), V = +t.V || 220, S0 = +t.S || 2.5, rho = 0.018, lim = +t.lim || 3, R = (t.rows || []).filter((r) => +r.P > 0 && +r.L > 0).map((r) => ({ n: r.n || "", P: +r.P, L: +r.L, I: +r.P / V })).sort((a, b) => a.L - b.L);
    if (!R.length) return note("Ingresa al menos una carga con potencia y distancia.");
    const Ptot = R.reduce((a, r) => a + r.P, 0), Itot = Ptot / V, Lmax = R[R.length - 1].L, MI = R.reduce((a, r) => a + r.I * r.L, 0), MP = R.reduce((a, r) => a + r.P * r.L, 0);
    const dv = 2 * rho * MI / S0, pct = dv / V * 100, dvC = 2 * rho * Lmax * Itot / S0, pctC = dvC / V * 100, Smin = 2 * rho * MP / (V * (lim / 100 * V)), Sn = SECC.find((x) => x >= Smin - 1e-9), Lc = MI / Itot;
    let acc = 0, prev = 0, Irest = Itot;
    const tr = R.map((r) => {
      const d = 2 * rho * (r.L - prev) * Irest / S0;
      acc += d;
      const row = { r, Lt: r.L - prev, I: Irest, d, acc };
      Irest -= r.I;
      prev = r.L;
      return row;
    });
    const tot = pct + (+t.dva || 0);
    return kpis([kpi("Ca\xEDda (momentos)", nf(pct, 2), "%", pct <= lim ? "ok" : "bad"), kpi("Si fuera concentrada", nf(pctC, 2), "%"), kpi("Secci\xF3n m\xEDnima", Sn ? sStr(Sn) : "—", "mm\xB2"), kpi("Centro de cargas", n1(Lc), "m")]) + steps([
      { t: "Corriente de cada carga", f: "Iᵢ = Pᵢ \xF7 V", s: R.map((r) => nf(r.I, 2)).join(" + ") + " = " + nf(Itot, 2) + " A en total", r: nf(Itot, 2) + " A" },
      { t: "Suma de momentos el\xE9ctricos", q: "Cada carga se multiplica por su distancia al tablero.", f: "Σ (Iᵢ \xD7 Lᵢ)", s: R.map((r) => nf(r.I, 2) + " \xD7 " + n1(r.L)).join(" + ") + " = " + nf(MI, 2) + " A\xB7m", r: nf(MI, 2) + " A\xB7m (" + n0(MP) + " W\xB7m)" },
      { t: "Ca\xEDda hasta el punto m\xE1s lejano", f: "ΔV = 2 \xD7 ρ \xD7 Σ(Iᵢ \xD7 Lᵢ) \xF7 S", s: "2 \xD7 0,018 \xD7 " + nf(MI, 2) + " \xF7 " + sStr(S0) + " = " + nf(dv, 2) + " V → " + nf(pct, 2) + " %", r: nf(pct, 2) + " % (l\xEDmite " + nf(lim, 1) + " %)", ok: pct <= lim, why: pct <= lim ? "el punto m\xE1s lejano recibe tensi\xF3n suficiente." : "aumenta la secci\xF3n, divide el circuito o acerca el tablero." },
      { t: "Secci\xF3n m\xEDnima por momentos", f: "S = 2 \xD7 ρ \xD7 Σ(Pᵢ \xD7 Lᵢ) \xF7 (V \xD7 ΔV permitida en volts)", s: "2 \xD7 0,018 \xD7 " + n0(MP) + " \xF7 (" + n0(V) + " \xD7 " + nf(lim / 100 * V, 2) + ") = " + nf(Smin, 2) + " mm\xB2 → " + (Sn ? sStr(Sn) + " mm\xB2" : "sobre 120 mm\xB2"), r: Sn ? sStr(Sn) + " mm\xB2" : "—", why: "adem\xE1s debe cumplir la secci\xF3n m\xEDnima del RIC N\xB004 (1,5 mm\xB2 alumbrado, 2,5 mm\xB2 enchufes) e Iz ≥ In." },
      { t: "Comparaci\xF3n con carga concentrada", f: "ΔV concentrada = 2 \xD7 ρ \xD7 L m\xE1x \xD7 I total \xF7 S", s: "2 \xD7 0,018 \xD7 " + n1(Lmax) + " \xD7 " + nf(Itot, 2) + " \xF7 " + sStr(S0) + " = " + nf(pctC, 2) + " %", r: "Sobreestima " + n0((pctC / pct - 1) * 100) + " %", why: "suponer toda la carga al final s\xF3lo es correcto para un alimentador o un equipo \xFAnico. Equivale a concentrar la carga en el centro de cargas, a " + n1(Lc) + " m del tablero." },
      +t.dva > 0 ? { t: "Ca\xEDda total desde el empalme", f: "ΔV total = ΔV alimentador + ΔV circuito ≤ 5 %", s: nf(+t.dva, 2) + " + " + nf(pct, 2) + " = " + nf(tot, 2) + " %", ok: tot <= 5 } : null
    ]) + '<h3 style="margin-top:16px">C\xE1lculo tramo por tramo (mismo resultado)</h3><div class="tbl-wrap"><table class="pt"><thead><tr><th>Tramo hasta</th><th class="num">Largo (m)</th><th class="num">Corriente que circula (A)</th><th class="num">ΔV tramo (V)</th><th class="num">ΔV acumulada</th></tr></thead><tbody>' + tr.map((x) => "<tr><td>" + esc(x.r.n || "Punto") + '</td><td class="num">' + n1(x.Lt) + '</td><td class="num">' + nf(x.I, 2) + '</td><td class="num">' + nf(x.d, 3) + '</td><td class="num">' + nf(x.acc, 2) + " V \xB7 " + nf(x.acc / V * 100, 2) + " %</td></tr>").join("") + '</tbody></table></div><p class="hint">Cada tramo lleva la corriente de todas las cargas que quedan aguas abajo. Sumar las ca\xEDdas de los tramos da exactamente lo mismo que la suma de momentos.</p>';
  }
