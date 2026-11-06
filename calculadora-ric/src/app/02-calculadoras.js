  const T = (k) => S.tools[k];
  const curOf = (t) => {
    const tri = t.sis === "tri", cf = +t.cf || 1;
    return t.ent === "P" ? tri ? +t.P / (Math.sqrt(3) * +t.VL * cf) : +t.P / (+t.V * cf) : +t.I;
  };
  const DEMO_OF = { caida: ["caida", "C\xF3mo cambia la ca\xEDda con el largo, la carga y la secci\xF3n"], mom: ["caida", "C\xF3mo cambia la ca\xEDda con el largo, la carga y la secci\xF3n"], conductor: ["pasos", "El c\xE1lculo del conductor paso a paso, animado"], proteccion: ["proteccion", "Corriente, protecci\xF3n y cable en un gr\xE1fico, con la curva de disparo"], curvas: ["proteccion", "Corriente, protecci\xF3n y cable en un gr\xE1fico, con la curva de disparo"], tierra: ["comparar", "Qu\xE9 pasa con y sin tierra o diferencial"] };
  function tPage(k, ref, title, lead, form, learnHtml) {
    const dm = DEMO_OF[k];
    return '<p class="eyebrow">Calculadora r\xE1pida'.concat(ref ? " \xB7 " + ref : "", "</p><h1>").concat(title, '</h1><p class="lead">').concat(lead, "</p>\n  ") + (dm ? '<button type="button" class="demo-link" data-demo="' + dm[0] + '"><span aria-hidden="true">\u25B6</span> Demostraci\xF3n: ' + dm[1] + "</button>" : "").concat(formulaCard(k), "\n  ").concat(formCard("Ingresa tus datos", form, { extra: '<button class="btn ghost" type="button" data-act="tclear" data-k="'.concat(k, '">Limpiar</button><button class="btn ghost" type="button" data-act="tex" data-k="').concat(k, '">Ver con ejemplo</button>') }), "\n  ").concat(RES["t_" + k] || "").concat(learnHtml ? learn("Entender el concepto", learnHtml) : "");
  }
  const vField = (k, t) => t.sis === "tri" ? fNum("tools.".concat(k, ".VL"), "Tensi\xF3n entre l\xEDneas ".concat(ab("VL")), { unit: "V", help: "380 V" }) : fNum("tools.".concat(k, ".V"), "Tensi\xF3n ".concat(ab("V")), { unit: "V", help: "220 V" });
  const loadFields = (k, t) => t.ent === "P" ? fNum("tools.".concat(k, ".P"), "Potencia ".concat(ab("P")), { unit: "W" }) : fNum("tools.".concat(k, ".I"), "Corriente ".concat(ab("I")), { unit: "A" });
  function tCorriente() {
    const t = T("corriente");
    return tPage(
      "corriente",
      "",
      "Corriente y potencia",
      "Convierte potencia en corriente, o corriente en potencia, en monof\xE1sico o trif\xE1sico.",
      '<div class="grid">'.concat(fSel("tools.corriente.modo", "Quiero calcular", [["PaI", "La corriente (conozco la potencia)"], ["IaP", "La potencia (conozco la corriente)"]], { re: true })).concat(fSel("tools.corriente.sis", "Sistema", SIS, { re: true })).concat(t.modo === "PaI" ? fNum("tools.corriente.P", "Potencia ".concat(ab("P")), { unit: "W", help: "La potencia de placa del equipo o la suma de los puntos" }) : fNum("tools.corriente.I", "Corriente ".concat(ab("I")), { unit: "A" })).concat(vField("corriente", t)).concat(fNum("tools.corriente.cf", "Factor de potencia ".concat(ab("cos \u03C6")), { help: "1 para resistencias; 0,8\u20130,9 para motores" }), "</div>"),
      "<p>La <b>potencia</b> (".concat(ab("P"), ", en watts) es cu\xE1nta energ\xEDa usa un equipo. La <b>corriente</b> (").concat(ab("I"), ", en amperes) es cu\xE1nta electricidad circula por el cable. Se relacionan por la tensi\xF3n: con la misma potencia, a mayor tensi\xF3n, menos corriente.</p><p>En trif\xE1sico la potencia se reparte entre tres fases, por eso aparece \u221A3 \u2248 1,73. El ").concat(ab("cos \u03C6"), " indica qu\xE9 parte de la corriente hace trabajo \xFAtil: con motores es menor que 1 y la corriente sube.</p>")
    );
  }
  function cCorriente() {
    const t = T("corriente"), tri = t.sis === "tri", cf = +t.cf || 1, Vr = tri ? +t.VL : +t.V, k = tri ? Math.sqrt(3) : 1;
    if (!(Vr > 0)) return note("Ingresa la tensi\xF3n.");
    if (t.modo === "PaI") {
      if (!(+t.P > 0)) return note("Ingresa la potencia.");
      const I = +t.P / (k * Vr * cf);
      return kpis([kpi("Corriente", nf(I), "A"), kpi("Potencia aparente", n0(+t.P / cf), "VA")]) + steps([
        { t: "Corriente ".concat(ab("I")), f: tri ? "I = P \xF7 (\u221A3 \xD7 VL \xD7 cos \u03C6)" : "I = P \xF7 (V \xD7 cos \u03C6)", s: "I = ".concat(n0(+t.P), " \xF7 (").concat(tri ? "1,732 \xD7 " : "").concat(n0(Vr), " \xD7 ").concat(nf(cf), ") = ").concat(nf(I), " A"), r: "".concat(nf(I), " A"), why: "es la corriente con que se eligen el cable y la protecci\xF3n." },
        { t: "Potencia aparente ".concat(ab("Pap")), f: "Pap = P \xF7 cos \u03C6", s: "Pap = ".concat(n0(+t.P), " \xF7 ").concat(nf(cf), " = ").concat(n0(+t.P / cf), " VA"), r: "".concat(n0(+t.P / cf), " ").concat(ab("VA")), why: "si cos \u03C6 < 1, la red entrega m\xE1s de lo que se aprovecha y el cable debe soportarlo." }
      ]);
    }
    if (!(+t.I > 0)) return note("Ingresa la corriente.");
    const Pw = k * Vr * +t.I * cf;
    return kpis([kpi("Potencia", n0(Pw), "W"), kpi("En kilowatts", nf(Pw / 1e3), "kW")]) + steps([{ t: "Potencia ".concat(ab("P")), f: tri ? "P = \u221A3 \xD7 VL \xD7 I \xD7 cos \u03C6" : "P = V \xD7 I \xD7 cos \u03C6", s: "P = ".concat(tri ? "1,732 \xD7 " : "").concat(n0(Vr), " \xD7 ").concat(nf(+t.I), " \xD7 ").concat(nf(cf), " = ").concat(n0(Pw), " W"), r: "".concat(n0(Pw), " W"), why: "sirve, por ejemplo, para saber cu\xE1nta carga admite un circuito: 10 A \xD7 220 V \u2248 2.200 W." }]);
  }
  function tCaida() {
    const t = T("caida");
    return tPage(
      "caida",
      "RIC N\xB003, 5.1.3",
      "Ca\xEDda de tensi\xF3n",
      "Calcula cu\xE1nta tensi\xF3n se pierde en un tramo con la carga concentrada al final (alimentador, subalimentador o un equipo \xFAnico). Para un circuito con varios enchufes o centros de luz repartidos usa <button type=\"button\" class=\"linkb\" data-go=\"t_mom\">el m\xE9todo de los momentos el\xE9ctricos</button>.",
      '<div class="grid">'.concat(fSel("tools.caida.sis", "Sistema", SIS, { re: true })).concat(fSel("tools.caida.ent", "Dato que conozco", [["I", "La corriente"], ["P", "La potencia"]], { re: true })).concat(loadFields("caida", t)).concat(t.ent === "P" ? fNum("tools.caida.cf", ab("cos \u03C6")) : "").concat(vField("caida", t)).concat(fNum("tools.caida.L", "Largo del tramo ".concat(ab("L")), { unit: "m", help: "Solo ida" })).concat(fSel("tools.caida.S", "Secci\xF3n del cable ".concat(ab("S")), SECC.map((x) => [x, sStr(x) + " mm\xB2"]))).concat(fSel("tools.caida.lim", "L\xEDmite que debe cumplir", [[3, "3 % \u2014 alimentador"], [5, "5 % \u2014 total hasta el punto m\xE1s lejano"], [2, "2 % \u2014 circuito, si el alimentador ya us\xF3 3 %"]])).concat(fNum("tools.caida.rho", "Resistividad ".concat(ab("\u03C1")), { unit: "\u03A9\xB7mm\xB2/m", help: "Cobre 0,018 \xB7 Aluminio 0,028" }), "</div>"),
      "<p>Un cable no es un conductor perfecto: tiene resistencia, y parte de la tensi\xF3n se \u201Cgasta\u201D en calentarlo. Es como el agua en una manguera larga y delgada: llega con menos presi\xF3n al final.</p><p>La p\xE9rdida crece con el <b>largo</b> y la <b>corriente</b>, y disminuye con la <b>secci\xF3n</b>. En monof\xE1sico el largo se multiplica por 2 porque la corriente va por la fase y vuelve por el neutro. El RIC N\xB003 permite 3 % en el alimentador y 5 % en total hasta el punto m\xE1s lejano.</p>"
    );
  }
  function cCaida() {
    const t = T("caida"), tri = t.sis === "tri", k = tri ? Math.sqrt(3) : 2, Vr = tri ? +t.VL : +t.V, I = curOf(t), L = +t.L, s = +t.S, rho = +t.rho || 0.018, lim = +t.lim;
    if (!(I > 0) || !(L > 0) || !(Vr > 0)) return note("Ingresa la corriente (o la potencia), la tensi\xF3n y el largo.");
    const dv = k * rho * L * I / s, pct = dv / Vr * 100, Sreq = k * rho * L * I / (lim / 100 * Vr), Sn = SECC.find((x) => x >= Sreq - 1e-9), Lmax = lim / 100 * Vr * s / (k * rho * I);
    return kpis([kpi("Ca\xEDda", nf(dv), "V"), kpi("Ca\xEDda", nf(pct), "%", pct <= lim ? "ok" : "bad"), kpi("Secci\xF3n m\xEDnima", Sn ? sStr(Sn) : "\u2014", "mm\xB2"), kpi("Largo m\xE1ximo", n1(Lmax), "m")]) + steps([
      t.ent === "P" ? { t: "Corriente", f: tri ? "I = P \xF7 (\u221A3 \xD7 VL \xD7 cos \u03C6)" : "I = P \xF7 (V \xD7 cos \u03C6)", s: "I = ".concat(nf(I), " A"), r: "".concat(nf(I), " A") } : null,
      { t: "Ca\xEDda de tensi\xF3n ".concat(ab("\u0394V")), q: "Calculamos los volts que se pierden en el cable.", f: "\u0394V = ".concat(tri ? "\u221A3" : "2", " \xD7 \u03C1 \xD7 L \xD7 I \xF7 S"), s: "\u0394V = ".concat(tri ? "1,732" : "2", " \xD7 ").concat(nf(rho, 3), " \xD7 ").concat(n1(L), " \xD7 ").concat(nf(I), " \xF7 ").concat(sStr(s), " = ").concat(nf(dv), " V"), r: "".concat(nf(dv), " V") },
      { t: "Ca\xEDda en porcentaje", q: "La comparamos con la tensi\xF3n nominal.", f: "\u0394V % = \u0394V \xF7 ".concat(tri ? "VL" : "V", " \xD7 100"), s: "".concat(nf(dv), " \xF7 ").concat(n0(Vr), " \xD7 100 = ").concat(nf(pct), " %"), r: "".concat(nf(pct), " % (l\xEDmite ").concat(n0(lim), " %)"), ok: pct <= lim, why: pct <= lim ? "la tensi\xF3n que llega al final del tramo es suficiente." : "se pierde demasiada tensi\xF3n: aumenta la secci\xF3n o acorta el tramo." },
      { t: "Secci\xF3n m\xEDnima para cumplir el l\xEDmite", q: "Despejamos S de la f\xF3rmula.", f: "S m\xEDn = ".concat(tri ? "\u221A3" : "2", " \xD7 \u03C1 \xD7 L \xD7 I \xF7 (l\xEDmite % \xF7 100 \xD7 ").concat(tri ? "VL" : "V", ")"), s: "S m\xEDn = ".concat(nf(Sreq), " mm\xB2 \u2192 secci\xF3n comercial ").concat(Sn ? sStr(Sn) + " mm\xB2" : "sobre 120 mm\xB2"), r: Sn ? "".concat(sStr(Sn), " mm\xB2") : "Divide la carga o acorta el tramo", why: "igual debes verificar que esa secci\xF3n soporte la corriente (Iz) y que no sea menor al m\xEDnimo del RIC N\xB004. Usa \u201CElegir conductor\u201D para revisarlo todo junto." },
      { t: "Largo m\xE1ximo con ".concat(sStr(s), " mm\xB2"), f: "L m\xE1x = (l\xEDmite % \xF7 100 \xD7 ".concat(tri ? "VL" : "V", ") \xD7 S \xF7 (").concat(tri ? "\u221A3" : "2", " \xD7 \u03C1 \xD7 I)"), s: "L m\xE1x = ".concat(n1(Lmax), " m"), r: "".concat(n1(Lmax), " m"), why: "\xFAtil en terreno: hasta d\xF3nde puedes llevar el circuito sin cambiar de secci\xF3n." }
    ]);
  }
  function tConductor() {
    const t = T("conductor");
    return tPage(
      "conductor",
      "RIC N\xB004 y N\xB003",
      "Elegir conductor",
      "Encuentra la secci\xF3n que cumple las tres condiciones de la norma y el tipo de cable adecuado al ambiente.",
      '<div class="grid">'.concat(fSel("tools.conductor.uso", "\xBFPara qu\xE9 es el cable?", Object.entries(USOS).map(([k, v]) => [k, v[0]]), { re: true, help: "Secci\xF3n m\xEDnima: ".concat(sStr(USOS[t.uso][1]), " mm\xB2") })).concat(fSel("tools.conductor.amb", "\xBFD\xF3nde va?", Object.entries(AMB_CABLE).map(([k, v]) => [k, v[0]]))).concat(fSel("tools.conductor.sis", "Sistema", SIS, { re: true })).concat(fSel("tools.conductor.ent", "Dato que conozco", [["P", "La potencia"], ["I", "La corriente"]], { re: true })).concat(loadFields("conductor", t)).concat(vField("conductor", t)).concat(fNum("tools.conductor.L", "Largo ".concat(ab("L")), { unit: "m", help: "Solo ida" })).concat(fNum("tools.conductor.lim", "Ca\xEDda m\xE1xima permitida", { unit: "%", help: t.uso === "alim" ? "Alimentador: 3 %" : "Lo que queda del 5 % total (ej.: 5 \u2212 ca\xEDda del alimentador)" }), '</div>\n  <details class="item" style="margin-top:14px"><summary>Par\xE1metros avanzados</summary><div class="body"><div class="grid">').concat(fNum("tools.conductor.cf", ab("cos \u03C6"))).concat(fNum("tools.conductor.fc", "Factor adicional ".concat(ab("fc")))).concat(fNum("tools.conductor.rho", ab("\u03C1"), { unit: "\u03A9\xB7mm\xB2/m" }), "</div></div></details>" + '<div class="grid" style="margin-top:10px">' + fcFields("conductor") + "</div>"),
      "<p>Un cable debe cumplir <b>tres condiciones a la vez</b>:</p><ol><li><b>Secci\xF3n m\xEDnima de la norma</b>, aunque la carga sea chica: 1,5 mm\xB2 en iluminaci\xF3n, 2,5 mm\xB2 en enchufes y 4 mm\xB2 en el alimentador. Da resistencia mec\xE1nica y margen para el futuro.</li><li><b>Capacidad de corriente</b> (".concat(ab("Iz"), "): debe aguantar m\xE1s que la protecci\xF3n (").concat(ab("In"), "), para que esta corte antes de que el cable se recaliente.</li><li><b>Ca\xEDda de tensi\xF3n</b>: no debe perder m\xE1s volts de lo permitido.</li></ol><p>Se elige la secci\xF3n m\xE1s peque\xF1a que cumple las tres. La aislaci\xF3n se elige seg\xFAn el ambiente: humedad, calor, enterrado o lugares con p\xFAblico.</p>")
    );
  }
  function cConductor() {
    const t = T("conductor"), u = USOS[t.uso], tri = t.sis === "tri", k = tri ? Math.sqrt(3) : 2, Vr = tri ? +t.VL : +t.V, cf = +t.cf || 1, I = curOf(t);
    if (!(I > 0) || !(+t.L > 0) || !(Vr > 0)) return note("Ingresa la potencia (o la corriente), la tensi\xF3n y el largo.");
    const Pw = t.ent === "P" ? +t.P : (tri ? Math.sqrt(3) : 1) * Vr * I * cf, Vcap = tri ? Math.sqrt(3) * Vr : Vr;
    const In = t.uso === "alim" ? nextCom(Math.max(I, 25)) : chooseIn(I, Pw, Vcap, cf, u[2]);
    const { tries, sel } = chooseS({ I, In, L: +t.L, k, Vref: Vr, rho: +t.rho || 0.018, lim: +t.lim || 5, Smin: u[1], fc: fcOf(t) }), cab = AMB_CABLE[t.amb];
    return kpis([kpi("Corriente", nf(I), "A"), kpi("Protecci\xF3n", In != null ? In : "\u2014", "A"), kpi("Secci\xF3n", sel ? sStr(sel.s) : "\u2014", "mm\xB2", sel ? "ok" : "bad"), kpi("Ca\xEDda", sel ? nf(sel.pct) : "\u2014", "%")]) + steps([
      { t: "Corriente ".concat(ab("I")), f: tri ? "I = P \xF7 (\u221A3 \xD7 VL \xD7 cos \u03C6)" : "I = P \xF7 (V \xD7 cos \u03C6)", s: "I = ".concat(nf(I), " A"), r: "".concat(nf(I), " A") },
      { t: "Protecci\xF3n asociada ".concat(ab("In")), q: "Primero se fija el autom\xE1tico, porque el cable debe aguantar al menos esa corriente.", f: t.uso === "alim" ? "In \u2265 I y \u2265 25 A" : "In \u2265 1,1 \xD7 I \xB7 P \u2264 90 % \xD7 V \xD7 In".concat(u[2] ? " \xB7 In \u2265 ".concat(u[2], " A") : ""), s: "In = ".concat(In != null ? In : "\u2014", " A"), r: "".concat(In != null ? In : "\u2014", " A").concat(u[3] !== "\u2014" ? ", curva " + u[3] : ""), ok: In != null },
      fcOf(t) !== 1 ? fcStep(t) : null,
      { t: "Secci\xF3n ".concat(ab("S")), q: "Probamos de la m\xE1s delgada a la m\xE1s gruesa hasta que cumpla todo.", f: "\u2460 S \u2265 ".concat(sStr(u[1]), " mm\xB2   \u2461 Iz \xD7 fc \u2265 In   \u2462 \u0394V \u2264 ").concat(nf(+t.lim, 1), " %"), s: sel ? "".concat(sStr(sel.s), " mm\xB2: Iz ").concat(n0(sel.Iz), " A \u2265 ").concat(In, " A \xB7 \u0394V ").concat(nf(sel.pct), " %") : "Ninguna secci\xF3n cumple", r: sel ? "".concat(sStr(sel.s), " mm\xB2") : "\u2014", ok: !!sel },
      { t: "Tipo de cable", f: "".concat(cab[0], " \u2192 ").concat(cab[1]), why: "la aislaci\xF3n debe resistir humedad y temperatura; en lugares con p\xFAblico, no debe emitir humos t\xF3xicos al quemarse (RIC N\xB004, Tabla 4.2)." }
    ]) + '<h3 style="margin-top:16px">Comparaci\xF3n de secciones</h3>' + cmpTable(tries, sel, "\u0394V \u2264 ".concat(nf(+t.lim, 1), " %")) + '<p class="hint">Neutro igual a la fase. '.concat(ab("PE"), " igual a la fase hasta 25 mm\xB2. Sobre 6 mm\xB2 se usa cable multifilar.</p>");
  }
  function tProteccion() {
    const t = T("proteccion");
    return tPage(
      "proteccion",
      "RIC N\xB010 y N\xB005",
      "Elegir protecciones",
      "Selecciona el termomagn\xE9tico de un circuito, verifica que coordine con el cable instalado y compara todas las opciones.",
      '<div class="grid">'.concat(fSel("tools.proteccion.tipo", "Tipo de circuito", CIR_T.map((k) => [k, USOS[k][0]]))).concat(fSel("tools.proteccion.ent", "Dato que conozco", [["P", "La potencia"], ["I", "La corriente"]], { re: true })).concat(loadFields("proteccion", t)).concat(fNum("tools.proteccion.V", "Tensi\xF3n ".concat(ab("V")), { unit: "V" })).concat(fSel("tools.proteccion.S", "Secci\xF3n del cable instalado", SECC.slice(0, 6).map((x) => [x, sStr(x) + " mm\xB2"])), '</div>\n  <details class="item" style="margin-top:14px"><summary>Par\xE1metros avanzados</summary><div class="body"><div class="grid">').concat(fNum("tools.proteccion.cf", ab("cos \u03C6"))).concat(fNum("tools.proteccion.fc", ab("fc")), "</div></div></details>" + '<div class="grid" style="margin-top:10px">' + fcFields("proteccion") + "</div>"),
      "<p>El autom\xE1tico (".concat(ab("In"), ") se elige con dos reglas: debe ser al menos un 10 % mayor que la corriente del circuito, y la potencia conectada no debe superar el 90 % de lo que el autom\xE1tico permite. Ambas evitan que trabaje al l\xEDmite y corte sin motivo.</p><p>Luego se revisa contra el cable: <b>Is \u2264 In \u2264 Iz</b>. La curva B corta r\xE1pido (iluminaci\xF3n); la C tolera el pico de arranque de equipos (enchufes).</p>")
    );
  }
  function cProteccion() {
    const t = T("proteccion"), u = USOS[t.tipo], cf = +t.cf || 1, V = +t.V, I = t.ent === "P" ? +t.P / (V * cf) : +t.I, Pw = t.ent === "P" ? +t.P : V * I * cf, Iz = (+S.amp[t.S] || 0) * fcOf(t);
    if (!(I > 0) || !(V > 0)) return note("Ingresa la potencia o la corriente del circuito.");
    const In = chooseIn(I, Pw, V, cf, u[2]), okC = In != null && I <= In && In <= Iz, okS = +t.S >= u[1], W = t.tipo === "alumbrado" ? 100 : 250;
    const rows = COM.slice(0, 7).map((x) => '<tr class="'.concat(x === In ? "sel" : "", '"><td class="num">').concat(x, " A</td><td>").concat(x >= 1.1 * I - 1e-9 ? pill("ok", "s\xED") : pill("bad", "no"), "</td><td>").concat(Pw <= 0.9 * V * x * cf + 1e-9 ? pill("ok", "s\xED") : pill("bad", "no"), "</td><td>").concat(x >= u[2] ? pill("ok", "s\xED") : pill("bad", "no"), "</td><td>").concat(x <= Iz ? pill("ok", "s\xED") : pill("bad", "no"), '</td><td class="num">').concat(Math.floor(0.9 * V * x * cf / W), "</td></tr>")).join("");
    return kpis([kpi("Corriente", nf(I), "A"), kpi("Termomagn\xE9tico", In != null ? In : "\u2014", "A"), kpi("Curva", u[3]), kpi("Coordinaci\xF3n", okC && okS ? "OK" : "Revisar", "", okC && okS ? "ok" : "bad")]) + steps([
      { t: "Termomagn\xE9tico ".concat(ab("In")), f: "In \u2265 1,1 \xD7 Is \xB7 P \u2264 90 % \xD7 V \xD7 In".concat(u[2] ? " \xB7 In \u2265 ".concat(u[2], " A") : ""), s: "Is = ".concat(nf(I), " A \u2192 1,1 \xD7 Is = ").concat(nf(1.1 * I), " A \u2192 In = ").concat(In != null ? In : "\u2014", " A"), r: "".concat(In != null ? In : "\u2014", " A, curva ").concat(u[3]), ok: In != null },
      { t: "Coordinaci\xF3n con el cable", f: "Is \u2264 In \u2264 Iz", s: "".concat(nf(I), " A \u2264 ").concat(In != null ? In : "\u2014", " A \u2264 ").concat(n0(Iz), " A (").concat(sStr(+t.S), " mm\xB2)"), ok: okC, why: okC ? "el autom\xE1tico corta antes de que el cable se recaliente." : "el cable aguanta menos que la protecci\xF3n: podr\xEDa quemarse sin que el autom\xE1tico corte. Usa un cable m\xE1s grueso o reduce la carga." },
      { t: "Secci\xF3n m\xEDnima del tipo", f: "".concat(u[0], ": S \u2265 ").concat(sStr(u[1]), " mm\xB2"), s: "Cable instalado ".concat(sStr(+t.S), " mm\xB2"), ok: okS, why: "la norma exige una secci\xF3n m\xEDnima aunque la corriente sea baja." },
      { t: "Diferencial ".concat(ab("DR")), f: "I\u0394n \u2264 30 mA \xB7 m\xE1ximo 3 circuitos por diferencial \xB7 clase A", why: "protege a las personas contra la electrocuci\xF3n." }
    ]) + '<h3 style="margin-top:16px">Todas las opciones comparadas</h3><div class="tbl-wrap"><table><thead><tr><th class="num">In</th><th>\u2265 1,1 \xD7 Is</th><th>P \u2264 90 %</th><th>\u2265 m\xEDn. tipo</th><th>\u2264 Iz cable</th><th class="num">Puntos de '.concat(W, " W que admite</th></tr></thead><tbody>").concat(rows, '</tbody></table></div><p class="hint">La fila verde es la elegida: la menor que cumple las reglas del circuito.</p>');
  }
  function tCargas() {
    const t = T("cargas");
    const rows = t.rows.map((r, i) => "<tr><td>".concat(cTxt("tools.cargas.rows.".concat(i, ".n"), "Nombre", "Nombre"), "</td><td>").concat(cSel("tools.cargas.rows.".concat(i, ".tipo"), CIR_T.map((k) => [k, USOS[k][0]]), "Tipo"), "</td><td>").concat(cNum("tools.cargas.rows.".concat(i, ".cant"), 60, "Cantidad"), "</td><td>").concat(cNum("tools.cargas.rows.".concat(i, ".w"), 80, "W c/u"), "</td><td>").concat(cNum("tools.cargas.rows.".concat(i, ".L"), 64, "Largo"), '</td><td class="rowact"><button class="btn ghost small" type="button" data-act="dup" data-list="tools.cargas.rows" data-i="').concat(i, '" title="Duplicar">\u29C9</button> <button class="btn ghost small" type="button" data-act="del" data-list="tools.cargas.rows" data-i="').concat(i, '" title="Eliminar">\u2715</button></td></tr>')).join("");
    return tPage(
      "cargas",
      "",
      "Cuadro de cargas r\xE1pido",
      "Arma una lista de circuitos, agrega o elimina filas y calcula la protecci\xF3n, la secci\xF3n y la ca\xEDda de cada uno, m\xE1s los totales del tablero.",
      '<div class="grid">'.concat(fNum("tools.cargas.V", "Tensi\xF3n ".concat(ab("V")), { unit: "V" })).concat(fNum("tools.cargas.dvA", "Ca\xEDda usada por el alimentador", { unit: "%", help: "Los circuitos podr\xE1n usar 5 % menos este valor" })).concat(fNum("tools.cargas.cf", ab("cos \u03C6"))).concat(fNum("tools.cargas.fc", ab("fc")), '</div>\n  <div class="tbl-wrap" style="margin-top:14px"><table><thead><tr><th>Circuito</th><th>Tipo</th><th>Cantidad</th><th>W c/u</th><th>Largo m</th><th></th></tr></thead><tbody>').concat(rows || '<tr><td colspan="6"><div class="empty">Sin circuitos. Presiona \u201CAgregar circuito\u201D.</div></td></tr>', '</tbody></table></div>\n  <div class="actions" style="border:0;margin-top:8px;padding-top:0"><button class="btn ghost" type="button" data-act="add" data-list="tools.cargas.rows">+ Agregar circuito</button>').concat(t.rows.length ? '<button class="btn danger small" type="button" data-act="cqclear">Vaciar tabla</button>' : "", "</div>"),
      "<p>Es el mismo procedimiento del proyecto paso a paso, resumido en una fila por circuito: potencia \u2192 corriente \u2192 protecci\xF3n \u2192 secci\xF3n. Al final se suman las potencias y se aplica el factor de demanda para obtener la protecci\xF3n general.</p><p>Usa \u201CW c/u\u201D = 100 para centros de luz y 250 para enchufes, salvo que conozcas la potencia real del equipo.</p>"
    );
  }
  function cCargas() {
    const t = T("cargas"), V = +t.V, cf = +t.cf || 1, lim = 5 - (+t.dvA || 0);
    if (!t.rows.length) return note("Agrega al menos un circuito.");
    if (!(V > 0)) return note("Ingresa la tensi\xF3n.");
    let Pinst = 0;
    const res = t.rows.map((r) => {
      const u = USOS[r.tipo] || USOS.enchufes, P = (+r.cant || 0) * (+r.w || 0), I = P / (V * cf), In = P > 0 ? chooseIn(I, P, V, cf, u[2]) : null, c = chooseS({ I, In, L: +r.L || 0, k: 2, Vref: V, rho: +t.rho || 0.018, lim, Smin: u[1], fc: +t.fc || 1 });
      Pinst += P;
      const prob = [];
      if (!(P > 0)) prob.push("sin potencia");
      if (!(+r.L > 0)) prob.push("falta el largo");
      if (r.tipo === "horno" && P > 0 && P < 1500) prob.push("horno < 1.500 W");
      if (P > 0 && !c.sel) prob.push("ninguna secci\xF3n cumple");
      return { u, P, I, In, sel: c.sel, prob };
    });
    const fd = fdViv(Pinst), Ig = fd.Pd / (V * cf), Ing = nextCom(Math.max(Ig, 25)), nDR = Math.ceil(t.rows.length / 3);
    return kpis([kpi(ab("P_inst"), n0(Pinst), "W"), kpi(ab("Pd"), n0(fd.Pd), "W"), kpi("Corriente general", nf(Ig, 1), "A"), kpi("Protecci\xF3n general", Ing, "A"), kpi("Diferenciales 30 mA", nDR)]) + '<div class="tbl-wrap"><table><thead><tr><th>Circuito</th><th class="num">P W</th><th class="num">'.concat(ab("Is"), ' A</th><th class="num">').concat(ab("In"), " A</th><th>").concat(ab("Curva"), '</th><th class="num">').concat(ab("S"), ' mm\xB2</th><th class="num">').concat(ab("\u0394V"), " %</th><th>Estado</th></tr></thead><tbody>").concat(t.rows.map((r, i) => {
      var _a;
      const x = res[i];
      return "<tr><td>".concat(esc(r.n || "Circuito " + (i + 1)), '</td><td class="num">').concat(n0(x.P), '</td><td class="num">').concat(nf(x.I), '</td><td class="num">').concat((_a = x.In) != null ? _a : "\u2014", "</td><td>").concat(x.u[3], '</td><td class="num">').concat(x.sel ? sStr(x.sel.s) : "\u2014", '</td><td class="num">').concat(x.sel ? nf(x.sel.pct) : "\u2014", "</td><td>").concat(x.prob.length ? pill("bad", "\u2717 " + x.prob.join(", ")) : pill("ok", "\u2713"), "</td></tr>");
    }).join(""), "</tbody></table></div>") + steps([
      { t: "Cada fila", f: "P = cantidad \xD7 W \xB7 Is = P \xF7 (V \xD7 cos \u03C6) \xB7 In \u2265 1,1 \xD7 Is \xB7 S: m\xEDnimo, Iz \u2265 In, \u0394V \u2264 " + nf(lim, 1) + " %", why: "es el procedimiento del paso 3 del proyecto. Para ver el desarrollo completo de una fila, usa \u201CElegir conductor\u201D." },
      { t: "Totales del tablero", f: "Pd = P_inst con Fd (Tabla 3.1) \xB7 I general = Pd \xF7 (V \xD7 cos \u03C6) \xB7 In general \u2265 m\xE1x(I ; 25 A)", s: "Pd = ".concat(n0(fd.Pd), " W \u2192 I = ").concat(nf(Ig), " A \u2192 In = ").concat(Ing, " A \xB7 \u2308 ").concat(t.rows.length, " \xF7 3 \u2309 = ").concat(nDR, " diferencial(es)"), r: "General ".concat(Ing, " A \xB7 ").concat(nDR, " DR 30 mA") }
    ]);
  }
  function tDemanda() {
    const t = T("demanda");
    return tPage(
      "demanda",
      "RIC N\xB003, Tablas 3.1 y 3.2",
      "Potencia de demanda",
      "Calcula la demanda m\xE1xima de una o varias viviendas, su corriente y la protecci\xF3n general.",
      '<div class="grid">'.concat(fNum("tools.demanda.P", "Potencia instalada ".concat(ab("P_inst"), " por vivienda"), { unit: "W", help: "Suma de todos los puntos y equipos" })).concat(fNum("tools.demanda.n", "Viviendas en el mismo empalme", { help: "1 si es una casa" })).concat(fSel("tools.demanda.sis", "Sistema", SIS, { re: true })).concat(vField("demanda", t)).concat(fNum("tools.demanda.cf", ab("cos \u03C6")), "</div>"),
      "<p>No se usan todos los equipos a la vez. El RIC N\xB003 considera completos los primeros 3 kW y solo el 35 % de lo que pasa de ah\xED (hasta 120 kW). Si varias viviendas comparten un empalme, adem\xE1s se aplica el factor de simultaneidad (".concat(ab("Fs"), "), porque no todas tienen su consumo m\xE1ximo a la misma hora.</p>")
    );
  }
  function cDemanda() {
    const t = T("demanda"), Pw = +t.P;
    if (!(Pw > 0)) return note("Ingresa la potencia instalada.");
    const fd = fdViv(Pw), n = Math.max(1, +t.n || 1), fs = fsViv(n), Pd = n > 1 ? fd.Pd * n * fs.fs : fd.Pd, tri = t.sis === "tri", cf = +t.cf || 1, Vr = tri ? +t.VL : +t.V;
    if (!(Vr > 0)) return note("Ingresa la tensi\xF3n.");
    const I = tri ? Pd / (Math.sqrt(3) * Vr * cf) : Pd / (Vr * cf), In = nextCom(Math.max(I, 25));
    return kpis([kpi(ab("Pd"), n0(Pd), "W"), kpi("Fd equivalente", nf(fd.Pd / Pw)), kpi("Corriente", nf(I), "A"), kpi("Protecci\xF3n general", In, "A")]) + steps([
      { t: "Factor de demanda ".concat(ab("Fd")), f: "Pd = (primeros 3 kW \xD7 1) + (de 3 a 120 kW \xD7 0,35) + (sobre 120 kW \xD7 0,25)", s: "Pd = ".concat(n0(fd.a), " \xD7 1").concat(fd.b ? " + ".concat(n0(fd.b), " \xD7 0,35") : "").concat(fd.c ? " + ".concat(n0(fd.c), " \xD7 0,25") : "", " = ").concat(n0(fd.Pd), " W"), r: "".concat(n0(fd.Pd), " W por vivienda") },
      n > 1 ? { t: "Factor de simultaneidad ".concat(ab("Fs")), f: n > 21 ? "Fs = (15,3 + (n \u2212 21) \xD7 0,5) \xF7 n" : "Fs seg\xFAn Tabla 3.2", s: "n = ".concat(n, " \u2192 Fs = ").concat(nf(fs.fs, 3), " \xB7 ").concat(n0(fd.Pd), " \xD7 ").concat(n, " \xD7 ").concat(nf(fs.fs, 3), " = ").concat(n0(Pd), " W"), r: "".concat(n0(Pd), " W"), ok: fs.modo === "interp" ? "warn" : void 0, why: fs.modo === "interp" ? "este valor se interpol\xF3 entre los conocidos: verif\xEDcalo en la Tabla 3.2." : "" } : null,
      { t: "Corriente y protecci\xF3n general", f: (tri ? "I = Pd \xF7 (\u221A3 \xD7 VL \xD7 cos \u03C6)" : "I = Pd \xF7 (V \xD7 cos \u03C6)") + " \xB7 In \u2265 m\xE1x(I ; 25 A)", s: "I = ".concat(nf(I), " A \u2192 In = ").concat(In, " A"), r: "".concat(In, " A \xB7 alimentador m\xEDnimo 4 mm\xB2"), ok: true, why: "la protecci\xF3n del empalme de una vivienda no puede ser menor a 25 A (RIC N\xB010)." }
    ]) + note("El factor de demanda se aplica solo al alimentador. Los circuitos se calculan siempre con su potencia completa.");
  }
  function tPuntos() {
    const t = T("puntos");
    return tPage(
      "puntos",
      "RIC N\xB010, 5.1.4 y 5.2.2",
      "Puntos por circuito y m\xEDnimos por recinto",
      "Calcula cu\xE1ntos centros o enchufes caben en un circuito, y cu\xE1ntos exige como m\xEDnimo un recinto.",
      '<h3>Circuito</h3><div class="grid">'.concat(fSel("tools.puntos.In", "Protecci\xF3n del circuito ".concat(ab("In")), COM.slice(0, 6).map((x) => [x, x + " A"]))).concat(fSel("tools.puntos.W", "Tipo de punto", [[100, "Centro de luz (100 W)"], [250, "Enchufe (250 W)"]])).concat(fNum("tools.puntos.V", ab("V"), { unit: "V" })).concat(fNum("tools.puntos.cf", ab("cos \u03C6")), '</div>\n  <h3 style="margin-top:16px">Recinto (opcional)</h3><div class="grid">').concat(fSel("tools.puntos.tipo", "Tipo de recinto", Object.entries(TIPOS_REC))).concat(fNum("tools.puntos.area", "\xC1rea", { unit: "m\xB2" })).concat(fNum("tools.puntos.perim", "Per\xEDmetro", { unit: "m" }), "</div>"),
      "<p>La suma de los puntos de un circuito no puede superar el 90 % de su capacidad (V \xD7 In). El 10 % restante es margen para que el autom\xE1tico no trabaje al l\xEDmite. Por ejemplo, un circuito de 10 A a 220 V admite 1.980 W: 19 centros de 100 W o 7 enchufes de 250 W.</p>"
    );
  }
  function cPuntos() {
    const t = T("puntos"), cap = +t.V * +t.In * (+t.cf || 1), W = +t.W || 250, max = Math.floor(0.9 * cap / W), r = { tipo: t.tipo, area: +t.area, perim: +t.perim };
    if (!(cap > 0)) return note("Ingresa la tensi\xF3n.");
    const recinto = r.area > 0 ? [
      { t: "Centros de luz del recinto", f: "\u2264 10 m\xB2 \u2192 1 \xB7 > 10 m\xB2 \u2192 2", s: "".concat(n1(r.area), " m\xB2 \u2192 ").concat(minCentros(r)), r: "".concat(minCentros(r), " centro(s), cada uno con su interruptor") },
      { t: "Enchufes del recinto", f: ["dormitorio", "living", "comedor", "estar"].includes(t.tipo) ? "\u2308 per\xEDmetro \xF7 8 m \u2309" : t.tipo === "cocina" ? "Cocina: 3 enchufes, circuito exclusivo 16 A" : t.tipo === "lavadero" ? "Lavadero: 1 enchufe" : "Sin m\xEDnimo para este recinto", s: ["dormitorio", "living", "comedor", "estar"].includes(t.tipo) ? "\u2308 ".concat(n1(r.perim), " \xF7 8 \u2309 = ").concat(minEnchufes(r)) : "", r: "".concat(minEnchufes(r), " enchufe(s) doble(s) o triple(s)") }
    ] : [];
    return kpis([kpi("Capacidad del circuito", n0(cap), "W"), kpi("90 % utilizable", n0(0.9 * cap), "W"), kpi("Puntos m\xE1ximos", max, "", "ok")].concat(r.area > 0 ? [kpi("Luz m\xEDnima recinto", minCentros(r)), kpi("Enchufes m\xEDnimos", minEnchufes(r))] : [])) + steps([
      { t: "Capacidad del circuito", f: "Capacidad = V \xD7 In \xD7 cos \u03C6", s: "".concat(n0(+t.V), " \xD7 ").concat(t.In, " \xD7 ").concat(nf(+t.cf || 1), " = ").concat(n0(cap), " W"), r: "".concat(n0(cap), " W") },
      { t: "Puntos m\xE1ximos", f: "N m\xE1x = \u230A 0,9 \xD7 capacidad \xF7 W por punto \u230B", s: "\u230A 0,9 \xD7 ".concat(n0(cap), " \xF7 ").concat(W, " \u230B = \u230A ").concat(nf(0.9 * cap / W), " \u230B = ").concat(max), r: "".concat(max, " puntos"), why: "\u230A \u230B significa redondear hacia abajo: no se puede instalar una fracci\xF3n de punto." }
    ].concat(recinto));
  }
  function tTierra() {
    return tPage(
      "tierra",
      "RIC N\xB006 y N\xB005",
      "Puesta a tierra",
      "Verifica las resistencias de puesta a tierra medidas y calcula la secci\xF3n del conductor de protecci\xF3n.",
      '<div class="grid">'.concat(fNum("tools.tierra.R", "Tierra de protecci\xF3n medida", { unit: "\u03A9" })).concat(fNum("tools.tierra.Rs", "Tierra de servicio medida", { unit: "\u03A9" })).concat(fSel("tools.tierra.amb", "Ambiente", [["seco", "Seco (UL 50 V)"], ["humedo", "H\xFAmedo o mojado (UL 24 V)"]])).concat(fNum("tools.tierra.idn", "Sensibilidad ".concat(ab("I\u0394n")), { unit: "A", help: "30 mA = 0,03" })).concat(fSel("tools.tierra.Sf", "Secci\xF3n de la fase", SECC.map((x) => [x, sStr(x) + " mm\xB2"])), "</div>") + '<h3 style="margin:14px 0 6px">Dise\xF1o del electrodo (opcional)</h3><div class="grid">' + fNum("tools.tierra.rho", "Resistividad del terreno \u03C1", { unit: "\u03A9\xB7m", help: "Medida con m\xE9todo de Wenner. Ref.: tierra vegetal 50\u2013100 \xB7 arcilla 100\u2013200 \xB7 ripio seco 1.000\u20133.000" }) + fNum("tools.tierra.Lb", "Largo de la barra", { unit: "m" }) + fNum("tools.tierra.nb", "N\xFAmero de barras", { help: "En l\xEDnea, separadas al menos 2 veces su largo" }) + "</div>",
      "<p>Cuando una carcasa met\xE1lica queda con tensi\xF3n por una falla, la corriente de fuga pasa por la tierra. Esa corriente multiplicada por la resistencia de tierra es la tensi\xF3n que tendr\xEDa la carcasa. La regla R \u2264 UL \xF7 I\u0394n asegura que esa tensi\xF3n no supere la de seguridad antes de que el diferencial corte.</p>"
    );
  }
  function cTierra() {
    const t = T("tierra"), UL = t.amb === "humedo" ? 24 : 50, Rmax = UL / (+t.idn || 0.03), Sf = +t.Sf, pe = Sf <= 25 ? Sf : Sf <= 50 ? 25 : Sf / 2;
    return kpis([kpi("R protecci\xF3n m\xE1x.", n0(Rmax), "\u03A9"), kpi("R servicio m\xE1x.", 20, "\u03A9"), kpi("Conductor PE", sStr(pe), "mm\xB2")]) + steps([
      { t: "Tierra de protecci\xF3n", f: "R m\xE1x = UL \xF7 I\u0394n", s: "".concat(UL, " \xF7 ").concat(nf(+t.idn, 3), " = ").concat(n0(Rmax), " \u03A9").concat(+t.R > 0 ? " \xB7 medido ".concat(nf(+t.R, 1), " \u03A9") : " \xB7 ingresa el valor medido para comparar"), r: "".concat(n0(Rmax), " \u03A9 m\xE1ximo"), ok: +t.R > 0 ? +t.R <= Rmax : void 0 },
      { t: "Tierra de servicio", f: "R \u2264 20 \u03A9 (RIC N\xB006, 6.1) \xB7 hasta 80 \u03A9 solo con las condiciones de 6.2", s: +t.Rs > 0 ? "".concat(nf(+t.Rs, 1), " \u03A9") : "Ingresa el valor medido para comparar", ok: +t.Rs > 0 ? +t.Rs <= 20 ? true : +t.Rs <= 80 ? "warn" : false : void 0, why: +t.Rs > 20 && +t.Rs <= 80 ? "sobre 20 \u03A9 solo se acepta hasta 80 \u03A9 si se cumple 6.2.1 (potencia instalada \u2264 10 kW, esquema de neutralizaci\xF3n, general omnipolar, diferencial de 300 mA en los alimentadores y de 30 mA en todos los circuitos) o 6.2.2 (protecciones de sobretensi\xF3n permanente y transitoria en todos los tableros). Si no, mejora el electrodo." : "mantiene el neutro cerca del potencial de tierra." },
      { t: "Conductor de protecci\xF3n ".concat(ab("PE")), f: "S \u2264 25 \u2192 PE = S \xB7 25 < S \u2264 50 \u2192 25 mm\xB2 \xB7 S > 50 \u2192 S \xF7 2", s: "Fase ".concat(sStr(Sf), " mm\xB2 \u2192 PE ").concat(sStr(pe), " mm\xB2"), r: "".concat(sStr(pe), " mm\xB2, verde o verde/amarillo"), why: "debe soportar la corriente de falla mientras la protecci\xF3n corta." },
      (() => {
        const rho = +t.rho, L = +t.Lb || 1.5, n = Math.max(1, Math.round(+t.nb || 1));
        if (!(rho > 0)) return null;
        const R1 = rho / L, k = [1, 1.16, 1.29, 1.36, 1.42, 1.46][Math.min(5, n - 1)], Rn = R1 / n * k, need = Math.ceil(R1 / 20), ok20 = Rn <= 20;
        return { t: "Resistencia estimada del electrodo", q: "Pica vertical (barra Copperweld). Varias barras en paralelo con un factor k de utilizaci\xF3n (criterio usual, separadas al menos su largo).", f: "R1 = \u03C1 \xF7 L (RIC N\xB006, Tabla 6.4) \xB7 Rn = R1 \xF7 n \xD7 k", s: "R1 = " + n0(rho) + " \xF7 " + nf(L, 1) + " = " + n1(R1) + " \u03A9 \xB7 con " + n + " barra(s): " + n1(Rn) + " \u03A9", r: n1(Rn) + " \u03A9", ok: ok20 && Rn <= Rmax ? true : Rn <= Rmax ? "warn" : false, why: ok20 ? "cumple tambi\xE9n el valor de 20 \u03A9 que se exige a la tierra de servicio. Conf\xEDrmalo midiendo con telur\xF3metro." : "para llegar a 20 \u03A9 necesitar\xEDas del orden de " + need + " barras o mejorar el terreno (tratamiento qu\xEDmico, barra m\xE1s larga, malla). Siempre se confirma midiendo." };
      })()
    ]);
  }
  function tOhm() {
    const t = T("ohm"), need = { VI: ["V", "I"], VR: ["V", "R"], IR: ["I", "R"], PV: ["P", "V"], PI: ["P", "I"], PR: ["P", "R"] }[t.par], lab = { V: ["Tensi\xF3n ".concat(ab("V")), "V"], I: ["Corriente ".concat(ab("I")), "A"], R: ["Resistencia ".concat(ab("R")), "\u03A9"], P: ["Potencia ".concat(ab("P")), "W"] };
    return tPage(
      "ohm",
      "",
      "Ley de Ohm y potencia",
      "Con dos datos conocidos obtiene los otros dos. V\xE1lido para cargas resistivas (cos \u03C6 = 1), como calefactores, hervidores o ampolletas incandescentes.",
      '<div class="grid">'.concat(fSel("tools.ohm.par", "Datos que conozco", [["VI", "Tensi\xF3n y corriente"], ["VR", "Tensi\xF3n y resistencia"], ["IR", "Corriente y resistencia"], ["PV", "Potencia y tensi\xF3n"], ["PI", "Potencia y corriente"], ["PR", "Potencia y resistencia"]], { re: true })).concat(need.map((k) => fNum("tools.ohm." + k, lab[k][0], { unit: lab[k][1] })).join(""), "</div>"),
      "<p>La <b>ley de Ohm</b> dice que la corriente que circula es igual a la tensi\xF3n dividida por la resistencia: I = V \xF7 R. A m\xE1s tensi\xF3n, m\xE1s corriente; a m\xE1s resistencia, menos corriente.</p><p>La <b>potencia</b> es tensi\xF3n por corriente: P = V \xD7 I. Combinando ambas f\xF3rmulas se puede obtener cualquier valor a partir de otros dos.</p>"
    );
  }
  function cOhm() {
    const t = T("ohm");
    let V = +t.V, I = +t.I, R = +t.R, Pw = +t.P, f = "", s = "";
    const need = { VI: ["V", "I"], VR: ["V", "R"], IR: ["I", "R"], PV: ["P", "V"], PI: ["P", "I"], PR: ["P", "R"] }[t.par];
    if (!need.every((k) => +t[k] > 0)) return note("Ingresa los dos datos que conoces.");
    switch (t.par) {
      case "VI":
        R = V / I;
        Pw = V * I;
        f = "R = V \xF7 I \xB7 P = V \xD7 I";
        s = "R = ".concat(nf(V), " \xF7 ").concat(nf(I), " = ").concat(nf(R), " \u03A9 \xB7 P = ").concat(nf(V), " \xD7 ").concat(nf(I), " = ").concat(n0(Pw), " W");
        break;
      case "VR":
        I = V / R;
        Pw = V * V / R;
        f = "I = V \xF7 R \xB7 P = V\xB2 \xF7 R";
        s = "I = ".concat(nf(V), " \xF7 ").concat(nf(R), " = ").concat(nf(I), " A \xB7 P = ").concat(nf(V), "\xB2 \xF7 ").concat(nf(R), " = ").concat(n0(Pw), " W");
        break;
      case "IR":
        V = I * R;
        Pw = I * I * R;
        f = "V = I \xD7 R \xB7 P = I\xB2 \xD7 R";
        s = "V = ".concat(nf(I), " \xD7 ").concat(nf(R), " = ").concat(nf(V), " V \xB7 P = ").concat(nf(I), "\xB2 \xD7 ").concat(nf(R), " = ").concat(n0(Pw), " W");
        break;
      case "PV":
        I = Pw / V;
        R = V * V / Pw;
        f = "I = P \xF7 V \xB7 R = V\xB2 \xF7 P";
        s = "I = ".concat(n0(Pw), " \xF7 ").concat(nf(V), " = ").concat(nf(I), " A \xB7 R = ").concat(nf(V), "\xB2 \xF7 ").concat(n0(Pw), " = ").concat(nf(R), " \u03A9");
        break;
      case "PI":
        V = Pw / I;
        R = Pw / (I * I);
        f = "V = P \xF7 I \xB7 R = P \xF7 I\xB2";
        s = "V = ".concat(n0(Pw), " \xF7 ").concat(nf(I), " = ").concat(nf(V), " V \xB7 R = ").concat(n0(Pw), " \xF7 ").concat(nf(I), "\xB2 = ").concat(nf(R), " \u03A9");
        break;
      case "PR":
        I = Math.sqrt(Pw / R);
        V = Math.sqrt(Pw * R);
        f = "I = \u221A(P \xF7 R) \xB7 V = \u221A(P \xD7 R)";
        s = "I = \u221A(".concat(n0(Pw), " \xF7 ").concat(nf(R), ") = ").concat(nf(I), " A \xB7 V = \u221A(").concat(n0(Pw), " \xD7 ").concat(nf(R), ") = ").concat(nf(V), " V");
        break;
    }
    return kpis([kpi("Tensi\xF3n", nf(V), "V"), kpi("Corriente", nf(I), "A"), kpi("Resistencia", nf(R), "\u03A9"), kpi("Potencia", n0(Pw), "W")]) + steps([{ t: "Valores que faltaban", f, s, r: "V ".concat(nf(V), " V \xB7 I ").concat(nf(I), " A \xB7 R ").concat(nf(R), " \u03A9 \xB7 P ").concat(n0(Pw), " W"), why: "sirve, por ejemplo, para comprobar la resistencia de un calefactor o estimar la corriente de un equipo resistivo." }]);
  }
  function pgConceptos() {
    const c = (t, img, h) => '<section class="card"><h2>'.concat(t, "</h2>").concat(img || "").concat(h, "</section>");
    return '<p class="eyebrow">Aprender</p><h1>Conceptos b\xE1sicos</h1><p class="lead">Lo m\xEDnimo que hay que entender para que cada c\xE1lculo tenga sentido, explicado de forma simple y con im\xE1genes.</p>\n  '.concat(c("Tensi\xF3n, corriente y resistencia", ILL.ohm(), "<p>Piensa en una ca\xF1er\xEDa de agua. La <b>tensi\xF3n</b> (".concat(ab("V"), ", volts) es la presi\xF3n que empuja el agua. La <b>corriente</b> (").concat(ab("I"), ", amperes) es cu\xE1nta agua pasa por segundo. La <b>resistencia</b> (").concat(ab("R"), ", ohm) es qu\xE9 tan angosta es la ca\xF1er\xEDa. La ley de Ohm las une: <b>I = V \xF7 R</b>.</p>")), "\n  ").concat(c("Potencia", "", "<p>La <b>potencia</b> (".concat(ab("P"), ", watts) es cu\xE1nta energ\xEDa usa un equipo por segundo: <b>P = V \xD7 I</b>. Un hervidor de 2.000 W a 220 V toma unos 9 A. Las cuentas de luz cobran energ\xEDa, que es potencia por tiempo (kWh).</p>")), "\n  ").concat(c("Monof\xE1sico y trif\xE1sico", ILL.monotri(), "<p>En trif\xE1sico la carga se reparte en tres conductores, por eso se usa en casas grandes o con equipos potentes.</p>"), "\n  ").concat(c("Colores de los conductores", ILL.colores(), "<p>Los colores permiten que cualquier t\xE9cnico identifique cada conductor sin medir. Nunca uses verde o verde/amarillo para otra cosa que no sea tierra.</p>"), "\n  ").concat(c("C\xF3mo se conecta un circuito", ILL.circuito(), "<p>La fase lleva la energ\xEDa al equipo y el neutro la devuelve. La tierra (PE) no lleva corriente en condiciones normales: solo act\xFAa si hay una falla. El termomagn\xE9tico va siempre en la fase.</p>"), "\n  ").concat(c("Factor de potencia y condensadores", ILL.condensador(), "<p>En equipos con motor o fuente electr\xF3nica, parte de la corriente va y viene sin hacer trabajo \xFAtil: es la potencia reactiva (".concat(ab("Q"), "). El ").concat(ab("cos \u03C6"), " indica la fracci\xF3n \xFAtil. Con cos \u03C6 = 0,8, para la misma potencia se necesita un 25 % m\xE1s de corriente.</p><p>Un <b>condensador</b> almacena energ\xEDa en un campo el\xE9ctrico y entrega esa potencia reactiva cerca del equipo, as\xED la red no tiene que hacerlo. En viviendas casi no se usan; aparecen dentro de motores (condensador de arranque) y en industrias para corregir el factor de potencia.</p>")), "\n  ").concat(c("Por qu\xE9 se calienta un cable", "", "<p>Toda corriente que pasa por un cable lo calienta, y el calor crece con el cuadrado de la corriente: el doble de corriente produce cuatro veces m\xE1s calor. Si supera lo que soporta la aislaci\xF3n, esta se derrite y puede producir un cortocircuito o un incendio. Por eso cada secci\xF3n tiene una corriente m\xE1xima (".concat(ab("Iz"), ").</p>")), "\n  ").concat(c("Ca\xEDda de tensi\xF3n", ILL.caida(), "<p>La norma permite 3 % en el alimentador y 5 % en total hasta el punto m\xE1s lejano.</p>"), "\n  ").concat(c("Sobrecarga, cortocircuito y el termomagn\xE9tico", ILL.termo(), "<p>Una <b>sobrecarga</b> es conectar m\xE1s de lo que el circuito soporta: la corriente sube un poco por mucho rato. Un <b>cortocircuito</b> es cuando fase y neutro se tocan: la corriente sube cientos de veces en un instante. El termomagn\xE9tico (".concat(ab("TM"), "), tambi\xE9n llamado disyuntor o autom\xE1tico, cubre ambos casos.</p>")), "\n  ").concat(c("Contacto directo e indirecto: el diferencial", ILL.diferencial(), "<p><b>Contacto directo</b>: tocar un cable con tensi\xF3n. <b>Contacto indirecto</b>: tocar la carcasa de un equipo que qued\xF3 con tensi\xF3n por una falla. Contra ambos protege el diferencial (".concat(ab("DR"), ").</p>")), "\n  ").concat(c("Puesta a tierra", ILL.tierra(), "<p>La tierra de servicio debe medir 20 \u03A9 o menos, y la de protecci\xF3n debe ser lo bastante baja para que la carcasa en falla no supere la tensi\xF3n de seguridad (".concat(ab("UL"), ").</p>")), "\n  ").concat(c("El tablero", ILL.tablero(), "<p>Las barras de neutro y de tierra van separadas (esquema ".concat(ab("TN-S"), "). Se deja 25 % de espacio libre para ampliar.</p>")), "\n  ").concat(c("Instrumentos de medici\xF3n", ILL.instrumentos(), "<p>Puedes practicar con todos estos instrumentos en el <b>Simulador 3D</b>.</p>"), "\n  ").concat(c("Los pliegos RIC que usa la app", "", '<ul style="margin:0;padding-left:20px"><li><b>RIC N\xB002</b>: tableros.</li><li><b>RIC N\xB003</b>: alimentadores, demanda y ca\xEDda de tensi\xF3n.</li><li><b>RIC N\xB004</b>: conductores y canalizaciones.</li><li><b>RIC N\xB005</b>: protecci\xF3n contra tensiones peligrosas.</li><li><b>RIC N\xB006</b>: puesta a tierra.</li><li><b>RIC N\xB010</b>: alumbrado y enchufes, incluido lo exigido en viviendas.</li><li><b>RIC N\xB017, N\xB018, N\xB019</b>: mantenimiento, declaraci\xF3n TE-1 y puesta en servicio.</li></ul>'));
  }
  function pgComp() {
    const it = [["Colores de los conductores", ILL.colores], ["Circuito domiciliario", ILL.circuito], ["Monof\xE1sico y trif\xE1sico", ILL.monotri], ["Termomagn\xE9tico (disyuntor)", ILL.termo], ["Diferencial", ILL.diferencial], ["Condensador y factor de potencia", ILL.condensador], ["Tablero", ILL.tablero], ["Puesta a tierra", ILL.tierra], ["Ca\xEDda de tensi\xF3n", ILL.caida], ["Instrumentos", ILL.instrumentos], ["Ley de Ohm", ILL.ohm]];
    return '<p class="eyebrow">Aprender</p><h1>Componentes ilustrados</h1><p class="lead">Una imagen por cada componente y concepto, con lo esencial para reconocerlo.</p>'.concat(it.map(([t, f]) => '<section class="card"><h2>'.concat(t, "</h2>").concat(f(), "</section>")).join(""));
  }
  function pgGlosario() {
    return '<p class="eyebrow">Aprender</p><h1>Glosario de abreviaturas</h1><p class="lead">Todas las siglas y s\xEDmbolos que aparecen en la app.</p><section class="card"><dl class="gl">'.concat(Object.keys(GLOS).map((k) => "<dt>".concat(esc(k), "</dt><dd>").concat(esc(GLOS[k]), "</dd>")).join(""), "</dl></section>");
  }
  function pgTablas() {
    return '<p class="eyebrow">Aprender \xB7 datos de referencia</p><h1>Tablas que usa la app</h1><p class="lead">Elige c\xF3mo se instalan los cables y su temperatura de servicio: la app toma la columna correspondiente de la Tabla 4.4 del RIC N\xB004 y todos los c\xE1lculos la usan. Tambi\xE9n puedes escribir valores del fabricante.</p>\n  '.concat(formCard("Capacidad de corriente del cable " + ab("Iz") + " (cobre)", "".concat('<div class="grid">' + fSel("ampCfg.tc", "Tipo de cable (temperatura de servicio)", Object.entries(RIC_DATA.tcab), { re: true }) + fSel("ampCfg.met", "M\xE9todo de instalaci\xF3n", Object.keys(RIC_DATA.iz[S.ampCfg.tc] || RIC_DATA.iz[70]).map((k) => [k, RIC_DATA.met[k]]), { re: true, help: "Vivienda con tubo embutido en muro: A1. Tubo a la vista o bandeja adosada: B1." }) + "</div>", note(S.ampCfg.custom ? "\u26A0 La tabla tiene valores escritos a mano (no coinciden con una columna del RIC). Toca \xABUsar la tabla RIC\xBB para volver a la norma." : "Fuente: RIC N\xB004, Tabla 4.4 \xB7 cable " + RIC_DATA.tcab[S.ampCfg.tc] + " \xB7 m\xE9todo " + S.ampCfg.met + " \xB7 30 \xB0C de ambiente" + (/^D/.test(S.ampCfg.met) ? " (suelo a 20 \xB0C)" : "") + ", hasta 3 conductores con carga. Corrige por temperatura (Tabla 4.7) y agrupamiento (Tabla 4.6).", S.ampCfg.custom ? "warn" : "info"), '<div class="tbl-wrap"><table><thead><tr><th class="num">Secci\xF3n</th><th>Iz [A]</th></tr></thead><tbody>').concat(SECC.map((s) => '<tr><td class="num">'.concat(sStr(s), ' mm\xB2</td><td><input id="f_amp_').concat(String(s).replace(".", "_"), '" type="text" inputmode="decimal" data-path="amp.').concat(String(s).replace(".", "_"), '" data-num="1" value="').concat(esc(shownum(S.amp[s])), '" style="width:90px" aria-label="Iz ').concat(sStr(s), ' mm\xB2"></td></tr>')).join(""), "</tbody></table></div>"), { calc: false, tag: "Editable", extra: '<button class="btn ghost" type="button" data-act="ampdef">Usar la tabla RIC</button><span class="hint">Los cambios se guardan al escribir.</span>' }), '\n  <section class="card"><h2>Secciones m\xEDnimas (RIC N\xB004, 5.4)</h2><table><tbody><tr><td>Iluminaci\xF3n</td><td class="num">1,5 mm\xB2</td></tr><tr><td>Enchufes y mixtos</td><td class="num">2,5 mm\xB2</td></tr><tr><td>Subalimentador</td><td class="num">2,5 mm\xB2</td></tr><tr><td>Alimentador</td><td class="num">4 mm\xB2</td></tr></tbody></table></section>\n  <section class="card"><h2>Factor de demanda en viviendas (RIC N\xB003, Tabla 3.1)</h2><table><tbody><tr><td>Primeros 3 kW</td><td class="num">1,00</td></tr><tr><td>De 3 a 120 kW</td><td class="num">0,35</td></tr><tr><td>Sobre 120 kW</td><td class="num">0,25</td></tr></tbody></table></section>\n  <section class="card"><h2>Tipo de cable seg\xFAn ambiente (RIC N\xB004, Tabla 4.2)</h2><div class="tbl-wrap"><table><thead><tr><th>Cable</th><th>Temp.</th><th>Uso</th></tr></thead><tbody><tr><td>THHN</td><td>90 \xB0C</td><td>Ductos, molduras y bandejas, ambiente seco</td></tr><tr><td>THWN-2</td><td>90 \xB0C</td><td>Igual que THHN, tambi\xE9n h\xFAmedo</td></tr><tr><td>H07Z1-K</td><td>70 \xB0C</td><td>Libre de hal\xF3genos; lugares de reuni\xF3n; solo circuitos</td></tr><tr><td>RV / RV-K</td><td>90 \xB0C</td><td>Alimentadores; RV-K puede ir enterrado</td></tr></tbody></table></div></section>\n  <section class="card"><h2>Colores de conductores (RIC N\xB004, 5.32)</h2>').concat(ILL.colores(), '</section>\n  <section class="card"><h2>Canalizaciones (RIC N\xB004)</h2><ul style="margin:0;padding-left:20px"><li>Ductos no met\xE1licos retardantes de llama y autoextinguibles.</li><li>Un solo circuito por tuber\xEDa.</li><li>Uniones solo dentro de cajas, con 25 % de volumen libre y chicotes de 15 cm.</li><li>Sobre 6 mm\xB2 se usa cable multifilar.</li><li>Nunca en el mismo ducto que el gas; 0,15 m de ductos de aire caliente.</li></ul></section>');
  }
  const FORM = {
    corriente: {
      il: ["monotri"],
      f: [["Monof\xE1sico", "I = P \xF7 (V \xD7 cos \u03C6)"], ["Trif\xE1sico", "I = P \xF7 (\u221A3 \xD7 VL \xD7 cos \u03C6)"], ["Al rev\xE9s (potencia)", "P = V \xD7 I \xD7 cos \u03C6   \xB7   P = \u221A3 \xD7 VL \xD7 I \xD7 cos \u03C6"]],
      v: [["I", "Corriente", "A"], ["P", "Potencia activa", "W"], ["V", "Tensi\xF3n fase\u2013neutro", "V"], ["VL", "Tensi\xF3n entre fases", "V"], ["cos \u03C6", "Factor de potencia", "\u2014"], ["\u221A3", "Ra\xEDz de 3 \u2248 1,732", "\u2014"]],
      h: ["Multiplica la tensi\xF3n por el cos \u03C6 (en trif\xE1sico, multiplica adem\xE1s por 1,732).", "Divide la potencia por ese resultado.", "Ejemplo: 2.000 W \xF7 (220 \xD7 1) = 9,09 A."]
    },
    caida: {
      il: ["caida"],
      f: [["Monof\xE1sico", "\u0394V = 2 \xD7 \u03C1 \xD7 L \xD7 I \xF7 S"], ["Trif\xE1sico", "\u0394V = \u221A3 \xD7 \u03C1 \xD7 L \xD7 I \xF7 S"], ["En porcentaje", "\u0394V % = \u0394V \xF7 V \xD7 100"], ["Secci\xF3n m\xEDnima", "S m\xEDn = 2 \xD7 \u03C1 \xD7 L \xD7 I \xF7 (l\xEDmite % \xF7 100 \xD7 V)"]],
      v: [["\u0394V", "Ca\xEDda de tensi\xF3n", "V"], ["\u03C1", "Resistividad (cobre 0,018)", "\u03A9\xB7mm\xB2/m"], ["L", "Largo del tramo, solo ida", "m"], ["I", "Corriente", "A"], ["S", "Secci\xF3n del cable", "mm\xB2"], ["V", "Tensi\xF3n nominal", "V"]],
      h: ["Multiplica 2 \xD7 \u03C1 \xD7 L \xD7 I.", "Divide por la secci\xF3n S: obtienes los volts perdidos.", "Divide por la tensi\xF3n y multiplica por 100 para el %.", "Ejemplo: 2 \xD7 0,018 \xD7 25 \xD7 10 \xF7 2,5 = 3,6 V \u2192 3,6 \xF7 220 \xD7 100 = 1,64 %."]
    },
    conductor: {
      il: ["colores"],
      f: [["Condici\xF3n 1", "S \u2265 secci\xF3n m\xEDnima del RIC N\xB004"], ["Condici\xF3n 2", "Iz \xD7 fc \u2265 In"], ["Condici\xF3n 3", "\u0394V % \u2264 l\xEDmite permitido"]],
      v: [["S", "Secci\xF3n del cable", "mm\xB2"], ["Iz", "Corriente que soporta el cable (tabla)", "A"], ["fc", "Factor de correcci\xF3n", "\u2014"], ["In", "Corriente de la protecci\xF3n", "A"], ["\u0394V", "Ca\xEDda de tensi\xF3n", "%"]],
      h: ["Calcula la corriente I = P \xF7 (V \xD7 cos \u03C6).", "Elige la protecci\xF3n: In \u2265 1,1 \xD7 I.", "Parte por la secci\xF3n m\xEDnima y busca en la tabla una con Iz \u2265 In.", "Calcula la ca\xEDda con esa secci\xF3n; si pasa el l\xEDmite, prueba la siguiente secci\xF3n."]
    },
    proteccion: {
      il: ["termo"],
      f: [["Margen", "In \u2265 1,1 \xD7 Is"], ["Regla del 90 %", "P \u2264 0,9 \xD7 V \xD7 In"], ["Coordinaci\xF3n", "Is \u2264 In \u2264 Iz"]],
      v: [["In", "Protecci\xF3n (autom\xE1tico)", "A"], ["Is", "Corriente del circuito", "A"], ["P", "Potencia del circuito", "W"], ["Iz", "Corriente que soporta el cable", "A"]],
      h: ["Calcula Is = P \xF7 V.", "Multiplica por 1,1 y sube al autom\xE1tico comercial siguiente (6, 10, 16, 20, 25\u2026).", "Comprueba que 0,9 \xD7 V \xD7 In sea mayor que P.", "Comprueba que In no supere la Iz del cable."]
    },
    potencias: {
      il: ["circuito"],
      f: [["Potencia de cada fila", "P fila = cantidad \xD7 potencia unitaria"], ["Potencia total", "P total = P fila 1 + P fila 2 + \u2026"], ["Corriente total", "I = P total \xF7 (V \xD7 cos \u03C6)"]],
      v: [["P", "Potencia", "W"], ["V", "Tensi\xF3n", "V"], ["I", "Corriente", "A"], ["cos \u03C6", "Factor de potencia", "\u2014"], ["kW", "Kilowatt = 1.000 W", "kW"]],
      h: ["Multiplica la cantidad de cada equipo por su potencia.", "Suma todos los resultados.", "Divide el total por 1.000 si lo quieres en kW.", "Ejemplo: 8 \xD7 100 + 6 \xD7 250 = 800 + 1.500 = 2.300 W."]
    },
    cargas: {
      il: ["tablero"],
      f: [["Potencia", "P = cantidad \xD7 W"], ["Corriente", "Is = P \xF7 (V \xD7 cos \u03C6)"], ["Protecci\xF3n", "In \u2265 1,1 \xD7 Is"], ["Secci\xF3n", "S m\xEDn \xB7 Iz \u2265 In \xB7 \u0394V \u2264 l\xEDmite"]],
      v: [["P", "Potencia del circuito", "W"], ["Is", "Corriente", "A"], ["In", "Protecci\xF3n", "A"], ["S", "Secci\xF3n", "mm\xB2"]],
      h: ["Repite para cada circuito: potencia \u2192 corriente \u2192 protecci\xF3n \u2192 secci\xF3n.", "Suma las potencias y aplica el factor de demanda para el total."]
    },
    demanda: {
      f: [["Factor de demanda (Tabla 3.1)", "Pd = 3.000 \xD7 1 + (P \u2212 3.000) \xD7 0,35   (si P est\xE1 entre 3 y 120 kW)"], ["Si P \u2264 3.000 W", "Pd = P"], ["Corriente", "I = Pd \xF7 (V \xD7 cos \u03C6)"]],
      v: [["P_inst", "Potencia instalada", "W"], ["Pd", "Potencia de demanda", "W"], ["Fd", "Factor de demanda", "\u2014"], ["Fs", "Factor de simultaneidad", "\u2014"]],
      h: ["Toma los primeros 3.000 W completos.", "Al resto multipl\xEDcalo por 0,35.", "Suma ambos valores.", "Ejemplo: 8.000 W \u2192 3.000 + 5.000 \xD7 0,35 = 4.750 W."]
    },
    puntos: {
      f: [["Capacidad", "Capacidad = V \xD7 In \xD7 cos \u03C6"], ["Puntos m\xE1ximos", "N m\xE1x = \u230A 0,9 \xD7 capacidad \xF7 W por punto \u230B"], ["Enchufes por recinto", "Enchufes = \u2308 per\xEDmetro \xF7 8 \u2309"]],
      v: [["In", "Protecci\xF3n del circuito", "A"], ["W", "Potencia por punto (100 luz, 250 enchufe)", "W"], ["\u230A \u230B", "Redondear hacia abajo", "\u2014"], ["\u2308 \u2309", "Redondear hacia arriba", "\u2014"]],
      h: ["Multiplica V \xD7 In: es lo que admite el circuito.", "Toma el 90 %.", "Divide por la potencia de cada punto y redondea hacia abajo.", "Ejemplo: 0,9 \xD7 220 \xD7 10 \xF7 250 = 7,9 \u2192 7 enchufes."]
    },
    tierra: {
      il: ["tierra"],
      f: [["Tierra de protecci\xF3n", "R m\xE1x = UL \xF7 I\u0394n"], ["Tierra de servicio", "R \u2264 20 \u03A9"], ["Conductor PE", "S \u2264 25 \u2192 PE = S \xB7 25 < S \u2264 50 \u2192 25 \xB7 S > 50 \u2192 S \xF7 2"]],
      v: [["R", "Resistencia de puesta a tierra", "\u03A9"], ["UL", "Tensi\xF3n de seguridad (50 V seco, 24 V h\xFAmedo)", "V"], ["I\u0394n", "Sensibilidad del diferencial", "A"], ["PE", "Conductor de protecci\xF3n", "mm\xB2"]],
      h: ["Divide la tensi\xF3n de seguridad por la sensibilidad del diferencial.", "Ejemplo: 50 \xF7 0,03 = 1.667 \u03A9 m\xE1ximo.", "Compara con el valor medido."]
    },
    curvas: {
      f: [["M\xFAltiplo", "k = I \xF7 In"], ["Zona t\xE9rmica (sobrecarga)", "1,13 \xD7 In no dispara en 1 h \xB7 1,45 \xD7 In dispara antes de 1 h"], ["Zona magn\xE9tica (cortocircuito)", "B: 3\u20135 \xD7 In \xB7 C: 5\u201310 \xD7 In \xB7 D: 10\u201320 \xD7 In"]],
      v: [["In", "Corriente nominal del autom\xE1tico", "A"], ["I", "Corriente que circula o de falla", "A"], ["k", "Veces que I supera a In", "\u2014"], ["t", "Tiempo de corte", "s"]],
      h: ["Divide la corriente por la nominal del autom\xE1tico.", "Busca ese m\xFAltiplo en el eje horizontal de la curva.", "Ejemplo: 40 A en un 16 A curva C \u2192 k = 2,5 \u2192 disparo t\xE9rmico en segundos."]
    },
    ohm: {
      il: ["ohm"],
      f: [["Ley de Ohm", "V = I \xD7 R   \xB7   I = V \xF7 R   \xB7   R = V \xF7 I"], ["Potencia", "P = V \xD7 I   \xB7   P = I\xB2 \xD7 R   \xB7   P = V\xB2 \xF7 R"]],
      v: [["V", "Tensi\xF3n", "V"], ["I", "Corriente", "A"], ["R", "Resistencia", "\u03A9"], ["P", "Potencia", "W"]],
      h: ["Identifica los dos datos que conoces.", "Elige la f\xF3rmula que usa solo esos dos datos.", "Ejemplo: 220 V y 10 A \u2192 R = 220 \xF7 10 = 22 \u03A9; P = 220 \xD7 10 = 2.200 W."]
    }
  };
  function formulaCard(k) {
    const F = FORM[k];
    if (!F) return "";
    return '<section class="card fcard"><div class="sechead"><span class="tag">F\xF3rmula</span><h2 style="margin:0">As\xED se calcula</h2></div>\n  '.concat(F.il ? F.il.map((k2) => ILL[k2]()).join("") : "", '<div class="flist">').concat(F.f.map(([l, f]) => '<div><div class="fl">'.concat(l, '</div><div class="f big">').concat(f, "</div></div>")).join(""), '</div>\n  <div class="fgrid"><div><h3>Qu\xE9 significa cada letra</h3><table class="vars"><tbody>').concat(F.v.map(([s, m, u]) => '<tr><td class="sym">'.concat(GLOS[s] ? ab(s) : esc(s), "</td><td>").concat(m, '</td><td class="num">').concat(u, "</td></tr>")).join(""), '</tbody></table></div>\n  <div><h3>Para hacerlo a mano</h3><ol class="hand">').concat(F.h.map((x) => "<li>".concat(x, "</li>")).join(""), "</ol></div></div></section>");
  }
  function tPotencias() {
    const t = T("potencias");
    const rows = t.rows.map((r, i) => '<tr data-prow="'.concat(i, '"><td>').concat(cTxt("tools.potencias.rows.".concat(i, ".n"), "Ej.: Ampolletas", "Equipo"), "</td><td>").concat(cNum("tools.potencias.rows.".concat(i, ".cant"), 64, "Cantidad"), "</td><td>").concat(cNum("tools.potencias.rows.".concat(i, ".w"), 84, "W unitario"), '</td><td class="num" data-live="sub">').concat(n0((+r.cant || 0) * (+r.w || 0)), ' W</td><td class="rowact"><button class="btn ghost small" type="button" data-act="dup" data-list="tools.potencias.rows" data-i="').concat(i, '" title="Duplicar">\u29C9</button> <button class="btn ghost small" type="button" data-act="del" data-list="tools.potencias.rows" data-i="').concat(i, '" title="Eliminar">\u2715</button></td></tr>')).join("");
    return tPage(
      "potencias",
      "",
      "Suma de potencias",
      "Suma la potencia de todos los equipos o puntos de un circuito, sin usar una calculadora aparte. El total se actualiza mientras escribes.",
      '<div class="grid">'.concat(fNum("tools.potencias.V", "Tensi\xF3n ".concat(ab("V")), { unit: "V" })).concat(fNum("tools.potencias.cf", ab("cos \u03C6")), '</div>\n  <div class="quick" style="margin-top:12px">').concat(["Centro de luz|100", "Enchufe|250", "Ampolleta LED|10", "Refrigerador|150", "Microondas|1200", "Hervidor|2000", "Lavadora|500", "Horno|2000", "Estufa el\xE9ctrica|1500", "TV|120", "Computador|300"].map((x) => {
        const [n, w] = x.split("|");
        return '<button class="chip" type="button" data-act="padd" data-n="'.concat(n, '" data-w="').concat(w, '">+ ').concat(n, " <span>").concat(w, " W</span></button>");
      }).join(""), '</div>\n  <div class="tbl-wrap" style="margin-top:12px"><table><thead><tr><th>Equipo o punto</th><th>Cantidad</th><th>W c/u</th><th class="num">Subtotal</th><th></th></tr></thead><tbody>').concat(rows || '<tr><td colspan="5"><div class="empty">Toca un bot\xF3n de arriba o \u201CAgregar fila\u201D.</div></td></tr>', '</tbody>\n  <tfoot><tr><th colspan="3">Total</th><th class="num" data-live="tot">').concat(n0(potTotal(t)), ' W</th><th></th></tr></tfoot></table></div>\n  <div class="actions" style="border:0;margin-top:8px;padding-top:0"><button class="btn ghost" type="button" data-act="add" data-list="tools.potencias.rows">+ Agregar fila</button>').concat(t.rows.length ? '<button class="btn danger small" type="button" data-act="pclear">Vaciar</button>' : "", "</div>"),
      "<p>La potencia total de un circuito es la suma de lo que consume cada cosa conectada. Si no conoces el equipo, el RIC N\xB010 indica usar 100 W por centro de luz y 250 W por enchufe. Con el total puedes ir a \u201CElegir protecciones\u201D o \u201CElegir conductor\u201D.</p>"
    );
  }
  const potTotal = (t) => t.rows.reduce((a, r) => a + (+r.cant || 0) * (+r.w || 0), 0);
  function cPotencias() {
    const t = T("potencias"), P = potTotal(t), V = +t.V, cf = +t.cf || 1;
    if (!t.rows.length || !(P > 0)) return note("Agrega al menos una fila con cantidad y potencia.");
    const I = V > 0 ? P / (V * cf) : NaN;
    return kpis([kpi("Potencia total", n0(P), "W", "ok"), kpi("En kilowatts", nf(P / 1e3), "kW"), kpi("Corriente", nf(I), "A")]) + steps([
      { t: "Potencia de cada fila", f: "P fila = cantidad \xD7 W", s: t.rows.map((r) => "".concat(r.cant || 0, " \xD7 ").concat(n0(+r.w || 0), " = ").concat(n0((+r.cant || 0) * (+r.w || 0)))).join("   \xB7   ") },
      { t: "Suma total", f: "P total = \u03A3 P fila", s: t.rows.map((r) => n0((+r.cant || 0) * (+r.w || 0))).join(" + ") + " = ".concat(n0(P), " W"), r: "".concat(n0(P), " W = ").concat(nf(P / 1e3), " kW") },
      { t: "Corriente ".concat(ab("I")), f: "I = P \xF7 (V \xD7 cos \u03C6)", s: "".concat(n0(P), " \xF7 (").concat(n0(V), " \xD7 ").concat(nf(cf), ") = ").concat(nf(I), " A"), r: "".concat(nf(I), " A"), why: "con esta corriente eliges la protecci\xF3n y el cable del circuito." }
    ]) + '<div class="actions" style="border:0;padding-top:0"><button class="btn ghost" type="button" data-act="p2prot">Usar '.concat(n0(P), ' W en \u201CElegir protecciones\u201D \u2192</button><button class="btn ghost" type="button" data-act="p2cond">Usar en \u201CElegir conductor\u201D \u2192</button></div>');
  }
