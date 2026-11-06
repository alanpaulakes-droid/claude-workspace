  const OD_THHN = { 1.5: 2.9, 2.5: 3.5, 4: 4.2, 6: 4.8, 10: 6.2, 16: 7.3, 25: 9, 35: 10.2 };
  const DUCTOS = { 16: ['16 mm (5/8")', 13], 20: ['20 mm (3/4")', 16.9], 25: ['25 mm (1")', 21.4], 32: ['32 mm (1 1/4")', 27.8], 40: ['40 mm (1 1/2")', 35.4] };
  const DMAT = { PVC: "Tubo PVC conduit (embutido)", EMT: "Tubo met\xE1lico EMT (a la vista)", FLEX: "Tubo flexible corrugado (embutido)" };
  function cqRow() {
    return { tda: "", ckto: "", pl: 0, eg: 0, e2: 0, e3: 0, fase: "", disy: "auto", curva: "auto", pc: "6", drN: "auto", drIn: "auto", drCl: "A", drS: "30", cond: "auto", ncond: 3, ducto: "auto", dmat: "PVC", ubic: "" };
  }
  function cqNorm() {
    const q = S.cuadro;
    if (q.Icc == null) q.Icc = 0;
    q.rows = q.rows.map((r) => Object.assign(cqRow(), r));
  }
  function ductFill(sec, n, d) {
    const od = OD_THHN[sec] || Math.sqrt(sec) * 1.9, ac = n * Math.PI * od * od / 4, ad = Math.PI * d * d / 4;
    return ac / ad * 100;
  }
  function cqGeneral() {
    const q = S.cuadro, V = +q.V || 220, tw = q.rows.reduce((a, r) => a + cqBase(r).tw, 0), fd = fdViv(tw);
    return { tw, fd, Ig: fd.Pd / V, In: nextCom(Math.max(fd.Pd / V, 25)) };
  }
  function cqBase(r) {
    const q = S.cuadro, tc = (+r.pl || 0) + (+r.eg || 0) + (+r.e2 || 0) + (+r.e3 || 0), tw = (+r.pl || 0) * (+q.wPL || 0) + (+r.eg || 0) * (+q.wEG || 0) + (+r.e2 || 0) * (+q.wE2 || 0) + (+r.e3 || 0) * (+q.wE3 || 0);
    return { tc, tw };
  }
  function cqDR(i) {
    const r = S.cuadro.rows[i];
    if (r.drN !== "auto" && String(r.drN).trim()) return String(r.drN).trim();
    return "DR" + (Math.floor(i / 3) + 1);
  }
  function cqCalc(r, i) {
    const q = S.cuadro, V = +q.V || 220, { tc, tw } = cqBase(r), I = tw / V, enc = (+r.eg || 0) + (+r.e2 || 0) + (+r.e3 || 0), tmin = +r.e3 > 0 ? 16 : 0;
    const auto = tw > 0 ? chooseIn(I, tw, V, 1, tmin) : null, In = r.disy === "auto" ? auto : +r.disy;
    const cvAuto = enc > 0 ? "C" : "B", cv = r.curva === "auto" ? cvAuto : r.curva;
    const smin = enc > 0 ? 2.5 : 1.5, sAuto = In ? SECC.find((s) => s >= smin && (+S.amp[s] || 0) >= In) : null, sec = r.cond === "auto" ? sAuto : +r.cond, Iz = sec ? +S.amp[sec] || 0 : 0;
    const gen = cqGeneral(), drAuto = [25, 40, 63, 80].find((x) => x >= Math.max(In || 0, gen.In)) || 63, drIn2 = r.drIn === "auto" ? drAuto : +r.drIn, drS = +r.drS, dr = cqDR(i);
    const nDR = S.cuadro.rows.filter((x, j) => cqDR(j) === dr).length;
    const nc = Math.max(2, +r.ncond || 3), dAuto = sec ? Object.keys(DUCTOS).map(Number).find((d) => ductFill(sec, nc, DUCTOS[d][1]) <= llenadoMax(nc)) || null : null, duc = r.ducto === "auto" ? dAuto : +r.ducto, fill = sec && duc ? ductFill(sec, nc, DUCTOS[duc][1]) : NaN;
    const pc = +r.pc, Icc = +q.Icc || 0;
    const ck = [];
    if (tw > 0) {
      ck.push({ g: "Disyuntor", ok: In != null && In >= 1.1 * I - 1e-9, t: "Margen de 10 % sobre la corriente", d: "Se exige In \u2265 1,1 \xD7 I = 1,1 \xD7 ".concat(nf(I), " = ").concat(nf(1.1 * I), " A. Elegido: ").concat(In != null ? In : "\u2014", " A."), fx: "Usa un disyuntor de ".concat(auto != null ? auto : "mayor", " A o m\xE1s (o deja \u201CAuto\u201D)."), why: "si el autom\xE1tico trabaja al l\xEDmite, se calienta y corta sin que haya falla." });
      ck.push({ g: "Disyuntor", ok: In != null && tw <= 0.9 * V * In + 1e-9, t: "Regla del 90 % (RIC N\xB010, 5.1.4.4)", d: "La potencia del circuito (".concat(n0(tw), " W) no debe superar 0,9 \xD7 ").concat(n0(V), " \xD7 ").concat(In != null ? In : 0, " = ").concat(n0(0.9 * V * (In || 0)), " W."), fx: "Sube el disyuntor o reparte los puntos en otro circuito.", why: "deja reserva para que la protecci\xF3n no opere en su l\xEDmite." });
      if (tmin) ck.push({ g: "Disyuntor", ok: In != null && In >= tmin, t: "M\xEDnimo 16 A para enchufes de alto consumo", d: "El circuito tiene enchufes de ".concat(n0(+q.wE3), " W; su protecci\xF3n debe ser de al menos 16 A. Elegido: ").concat(In != null ? In : "\u2014", " A."), fx: "Usa 16 A o m\xE1s.", why: "cocina, lavadero y hornos llevan circuitos de m\xEDnimo 16 A (RIC N\xB010, 5.2.1)." });
      ck.push({ g: "Disyuntor", ok: enc > 0 ? cv !== "B" : true, t: "Curva adecuada (".concat(cv, ")"), d: enc > 0 ? "El circuito tiene enchufes y se eligi\xF3 curva ".concat(cv, ". Lo recomendado es curva C.") : "Circuito solo de iluminaci\xF3n: curva ".concat(cv, " (recomendada B)."), fx: "Cambia a curva C.", why: "los equipos enchufados tienen picos de arranque de 5 a 10 veces su corriente; la curva B (3\u20135 \xD7 In) disparar\xEDa sin falla (RIC N\xB010, 5.1.4.2)." });
      ck.push({ g: "Disyuntor", ok: Icc > 0 ? pc >= Icc : true, warn: !(Icc > 0), t: "Poder de corte", d: Icc > 0 ? "Poder de corte ".concat(nf(pc, 1), " kA frente a una corriente de cortocircuito de ").concat(nf(Icc, 1), " kA en el tablero.") : "Poder de corte elegido: ".concat(nf(pc, 1), " kA. Ingresa arriba la corriente de cortocircuito del tablero para verificarlo."), fx: "Elige un poder de corte mayor que la corriente de cortocircuito.", why: "si el autom\xE1tico no puede cortar la corriente de un cortocircuito, se destruye o se suelda y no protege. La distribuidora puede informar el valor." });
      ck.push({ g: "Conductor", ok: !!sec && sec >= smin, t: "Secci\xF3n m\xEDnima (RIC N\xB004, 5.4)", d: "M\xEDnimo ".concat(sStr(smin), " mm\xB2 para ").concat(enc > 0 ? "enchufes o circuito mixto" : "iluminaci\xF3n", ". Elegido: ").concat(sec ? sStr(sec) : "\u2014", " mm\xB2."), fx: "Usa al menos ".concat(sStr(smin), " mm\xB2."), why: "da resistencia mec\xE1nica al cable y margen para cargas futuras." });
      ck.push({ g: "Conductor", ok: !!sec && In != null && Iz >= In, t: "El cable soporta la protecci\xF3n (Iz \u2265 In)", d: "El cable de ".concat(sec ? sStr(sec) : "\u2014", " mm\xB2 soporta ").concat(n0(Iz), " A y el disyuntor es de ").concat(In != null ? In : "\u2014", " A."), fx: sAuto ? "Usa ".concat(sStr(sAuto), " mm\xB2 o m\xE1s, o un disyuntor menor.") : "Usa una secci\xF3n mayor.", why: "si el cable aguanta menos que el disyuntor, se recalienta antes de que este corte." });
      ck.push({ g: "Diferencial", ok: drS <= 30, t: "Sensibilidad \u2264 30 mA (RIC N\xB010, 5.1.3.5)", d: "Sensibilidad elegida: ".concat(drS, " mA."), fx: "Usa un diferencial de 30 mA.", why: "sobre unos 30 mA a trav\xE9s del cuerpo hay riesgo de paro card\xEDaco; 300 mA solo protege contra incendio." });
      ck.push({ g: "Diferencial", ok: r.drCl !== "AC", t: "Clase del diferencial (".concat(r.drCl, ")"), d: r.drCl === "AC" ? "La clase AC solo detecta fugas senoidales puras." : "Clase ".concat(r.drCl, ": detecta las fugas de equipos electr\xF3nicos."), fx: "Usa clase A (o B si hay inversores o cargadores de veh\xEDculo).", why: "computadores, cargadores y equipos inverter producen fugas pulsantes que un AC no detecta bien (RIC N\xB005, 7.8.3)." });
      ck.push({ g: "Diferencial", ok: drIn2 >= (In || 0) && drIn2 >= gen.In, t: "Calibre del diferencial", d: "Calibre ".concat(drIn2, " A. Debe ser \u2265 al disyuntor del circuito (").concat(In != null ? In : "\u2014", " A) y \u2265 a la protecci\xF3n general (").concat(gen.In, " A) que lo antecede."), fx: "Usa un diferencial de ".concat(drAuto, " A o m\xE1s."), why: "el diferencial no se protege solo contra sobrecarga; el autom\xE1tico que lo antecede no puede ser mayor que su calibre (RIC N\xB002, 6.2.6)." });
      ck.push({ g: "Diferencial", ok: nDR <= 3, t: "M\xE1ximo 3 circuitos por diferencial", d: "".concat(dr, " protege ").concat(nDR, " circuito(s)."), fx: "Asigna otro diferencial a algunos circuitos (columna N\xB0 DR).", why: "las peque\xF1as fugas normales de cada circuito se suman y har\xEDan disparar el diferencial sin falla (RIC N\xB010, 5.1.3.7)." });
      ck.push({ g: "Ducto", ok: !!duc && fill <= llenadoMax(nc), warn: true, t: "Llenado del ducto \u2264 " + llenadoMax(nc) + " % (RIC N\xB004, Tabla 4.21)", d: duc ? "".concat(nc, " conductores de ").concat(sec ? sStr(sec) : "\u2014", " mm\xB2 ocupan el ").concat(nf(fill, 0), " % del ducto ").concat(DUCTOS[duc][0], ".") : "No hay un ducto de la lista que cumpla.", fx: dAuto ? "Usa un ducto de ".concat(DUCTOS[dAuto][0], " o mayor.") : "Usa un ducto mayor o separa los conductores.", why: "un ducto muy lleno no deja disipar el calor y da\xF1a la aislaci\xF3n al pasar los cables. El l\xEDmite es norma (Tabla 4.21); los di\xE1metros de cable y tubo son referenciales: verif\xEDcalos con el fabricante." });
    }
    const fails = ck.filter((c) => !c.ok).length;
    return { tc, tw, I, auto, In, cv, cvAuto, sAuto, sec, Iz, smin, drIn: drIn2, drAuto, drS, dr, dAuto, duc, fill, nc, pc, ck, fails };
  }
  function pgCuadro() {
    cqNorm();
    const q = S.cuadro;
    const opsIn = COM.slice(0, 9).map((x) => [x, x + " A"]), opsS = SECC.slice(0, 8).map((x) => [x, sStr(x)]);
    const rows = q.rows.map((r, i) => {
      var _a;
      const c = cqCalc(r, i), P = "cuadro.rows.".concat(i);
      const sel = (f, ops, lab, autoTxt) => cSel(P + "." + f, (autoTxt != null ? [["auto", autoTxt]] : []).concat(ops), lab, false);
      return '<tr data-crow="'.concat(i, '">\n   <td>').concat(cTxt(P + ".tda", "TDA", "TDA"), "</td><td>").concat(cTxt(P + ".ckto", String(i + 1), "N\xB0 circuito"), "</td>\n   <td>").concat(cNum(P + ".pl", 48, "Portal\xE1mparas"), "</td><td>").concat(cNum(P + ".eg", 48, "Enchufes generales"), "</td><td>").concat(cNum(P + ".e2", 48, "Enchufes col. 2"), "</td><td>").concat(cNum(P + ".e3", 48, "Enchufes col. 3"), '</td>\n   <td class="num calcd" data-live="tc">').concat(c.tc, '</td><td class="num calcd" data-live="tw">').concat(n0(c.tw), "</td>\n   <td>").concat(cSel(P + ".fase", [["", "\u2014"], ["R", "R"], ["S", "S"], ["T", "T"]], "Fase", false), '</td>\n   <td class="num calcd" data-live="I">').concat(nf(c.I), "</td>\n   <td>").concat(sel("disy", opsIn, "Disyuntor amperaje", "".concat((_a = c.auto) != null ? _a : "\u2014", " A (auto)")), "</td>\n   <td>").concat(sel("curva", [["B", "B"], ["C", "C"], ["D", "D"]], "Disyuntor curva", "".concat(c.cvAuto, " (auto)")), "</td>\n   <td>").concat(sel("pc", [["3", "3 kA"], ["4.5", "4,5 kA"], ["6", "6 kA"], ["10", "10 kA"]], "Poder de corte"), "</td>\n   <td>").concat(cTxt(P + ".drN", c.dr, "N\xB0 diferencial").replace('value="auto"', 'value=""'), "</td>\n   <td>").concat(sel("drIn", [[25, "25 A"], [40, "40 A"], [63, "63 A"], [80, "80 A"]], "Diferencial amperaje", "".concat(c.drAuto, " A (auto)")), "</td>\n   <td>").concat(sel("drCl", [["AC", "AC"], ["A", "A"], ["F", "F"], ["B", "B"]], "Diferencial clase"), "</td>\n   <td>").concat(sel("drS", [["10", "10 mA"], ["30", "30 mA"], ["300", "300 mA"]], "Sensibilidad"), "</td>\n   <td>").concat(sel("cond", opsS, "Conductor", "".concat(c.sAuto ? sStr(c.sAuto) : "\u2014", " (auto)")), "</td>\n   <td>").concat(cNum(P + ".ncond", 44, "N\xB0 conductores"), "</td>\n   <td>").concat(sel("ducto", Object.keys(DUCTOS).map((k) => [k, k + " mm"]), "Ducto", "".concat(c.dAuto ? c.dAuto + " mm" : "\u2014", " (auto)")), "</td>\n   <td>").concat(sel("dmat", Object.entries(DMAT).map(([k, v]) => [k, k === "PVC" ? "PVC" : k === "EMT" ? "EMT" : "Flexible"]), "Material ducto"), "</td>\n   <td>").concat(cTxt(P + ".ubic", "Ej.: Dormitorios", "Ubicaci\xF3n"), '</td>\n   <td data-live="st">').concat(cqState(c, i), '</td>\n   <td class="rowact"><button class="btn ghost small" type="button" data-act="dup" data-list="cuadro.rows" data-i="').concat(i, '" title="Duplicar">\u29C9</button> <button class="btn ghost small" type="button" data-act="del" data-list="cuadro.rows" data-i="').concat(i, '" title="Eliminar">\u2715</button></td></tr>');
    }).join("");
    const wIn = (k, l) => '<input id="f_cuadro_'.concat(k, '" type="text" inputmode="decimal" data-path="cuadro.').concat(k, '" data-num="1" value="').concat(esc(shownum(q[k])), '" style="width:64px" aria-label="').concat(l, '">');
    return '<p class="eyebrow">Planilla</p><button class="btn calc" type="button" data-go="tg" style="float:right;margin:0 0 8px 8px">⚡ Juego: armar tablero</button><h1>Cuadro de carga</h1>\n  <p class="lead">Llena la planilla como en papel. Totales, corriente, disyuntor, diferencial, conductor y ducto se calculan solos mientras escribes; puedes cambiar cualquier valor sugerido. Toca el bot\xF3n de estado de cada fila para ver qu\xE9 cumple y qu\xE9 no, y por qu\xE9.</p>\n  '.concat(formCard('<input id="f_cuadro_titulo" type="text" data-path="cuadro.titulo" value="'.concat(esc(q.titulo), '" aria-label="T\xEDtulo" style="font-family:var(--f-display);font-weight:700;font-size:17px;max-width:420px">'), '\n   <div class="grid">'.concat(fNum("cuadro.V", "Tensi\xF3n", { unit: "V" })).concat(fNum("cuadro.Hz", "Frecuencia", { unit: "Hz" })).concat(fNum("cuadro.Icc", "Cortocircuito en el tablero (opcional)", { unit: "kA", help: "Lo informa la distribuidora. Sirve para verificar el poder de corte." }), '</div>\n   <div class="tbl-wrap cq" style="margin-top:14px"><table>\n   <thead><tr><th rowspan="2">TDA</th><th rowspan="2">N\xB0<br>ckto</th><th>Porta-<br>l\xE1mp.</th><th>Enchufes<br>grles.</th><th>Enchufes</th><th>Enchufes</th><th rowspan="2">Total<br>centros</th><th rowspan="2">Total<br>watts</th><th rowspan="2">Fase</th><th rowspan="2">Corriente<br>A</th><th colspan="3">Disyuntor (termomagn\xE9tico)</th><th colspan="4">Diferencial</th><th colspan="4">Canalizaci\xF3n</th><th rowspan="2">Ubicaci\xF3n</th><th rowspan="2">Estado</th><th rowspan="2"></th></tr>\n   <tr><th>').concat(wIn("wPL", "W portal\xE1mpara"), " W</th><th>").concat(wIn("wEG", "W enchufe general"), " W</th><th>").concat(wIn("wE2", "W enchufe col. 2"), " W</th><th>").concat(wIn("wE3", "W enchufe col. 3"), " W</th><th>").concat(ab("In"), "</th><th>").concat(ab("Curva"), "</th><th>Poder<br>corte</th><th>N\xB0 DR</th><th>").concat(ab("In"), "</th><th>Clase</th><th>").concat(ab("I\u0394n"), "</th><th>Cond.<br>mm\xB2</th><th>N\xB0<br>cond.</th><th>Ducto</th><th>Tipo</th></tr></thead>\n   <tbody>").concat(rows || '<tr><td colspan="24"><div class="empty">Planilla vac\xEDa. Presiona \u201CAgregar circuito\u201D.</div></td></tr>', '</tbody>\n   <tfoot><tr class="tot"><th colspan="2">TOTALES</th><th class="num" data-live="spl"></th><th class="num" data-live="seg"></th><th class="num" data-live="se2"></th><th class="num" data-live="se3"></th><th class="num" data-live="stc"></th><th class="num" data-live="stw"></th><th></th><th class="num" data-live="sI"></th><th colspan="14"></th></tr></tfoot></table></div>\n   <p class="hint" style="margin:6px 0 0">\u201C(auto)\u201D es el valor que sugiere la app seg\xFAn la norma; despliega la lista para elegir otro.</p>\n   <div class="actions" style="border:0;margin-top:8px;padding-top:0"><button class="btn ghost" type="button" data-act="add" data-list="cuadro.rows">+ Agregar circuito</button><button class="btn ghost" type="button" data-act="cqcopy">Copiar planilla (para Excel)</button><button class="btn ghost" type="button" data-act="cqdef">Restaurar 100 / 250 / 500 / 1.200 W</button>').concat(q.rows.length ? '<button class="btn danger small" type="button" data-act="cqempty">Vaciar planilla</button>' : "", '<span class="hint" id="cqmsg"></span></div>\n   <div id="cqsum">').concat(cqSummary(), "</div>"), { calc: false, tag: "Planilla" }), "\n  ").concat(learn("C\xF3mo se llena y se elige cada columna", '<ul style="padding-left:20px;margin:0">\n   <li><b>Portal\xE1mp. / Enchufes:</b> cantidad de cada tipo. La potencia por unidad est\xE1 en la segunda fila del encabezado y se puede cambiar.</li>\n   <li><b>Total watts</b> = \u03A3 cantidad \xD7 W de cada columna. <b>Corriente</b> = total watts \xF7 tensi\xF3n.</li>\n   <li><b>Disyuntor \u2013 amperaje:</b> el menor con In \u2265 1,1 \xD7 I y watts \u2264 90 % de V \xD7 In; 16 A m\xEDnimo si hay enchufes de la \xFAltima columna.</li>\n   <li><b>Disyuntor \u2013 curva:</b> B para solo iluminaci\xF3n; C si hay enchufes.</li>\n   <li><b>Disyuntor \u2013 poder de corte:</b> la corriente m\xE1xima de cortocircuito que puede cortar sin da\xF1arse. Debe ser mayor que la del tablero; en viviendas lo usual es 4,5 a 6 kA.</li>\n   <li><b>Diferencial:</b> 30 mA, clase A, calibre \u2265 a la protecci\xF3n que lo antecede y m\xE1ximo 3 circuitos por diferencial (se agrupan de a 3 si dejas N\xB0 DR vac\xEDo).</li>\n   <li><b>Conductor:</b> la menor secci\xF3n con Iz \u2265 In y al menos 1,5 mm\xB2 (luz) o 2,5 mm\xB2 (enchufes). La ca\xEDda de tensi\xF3n se verifica en \u201CCa\xEDda de tensi\xF3n\u201D.</li>\n   <li><b>Ducto:</b> el menor ducto donde los conductores (fase, neutro y tierra = 3) ocupen como m\xE1ximo el 33 % de su secci\xF3n interior (RIC N\xB004, Tabla 4.21). Los di\xE1metros de cable THHN son aproximados: valor referencial.</li>\n   <li><b>Fase:</b> en trif\xE1sico, reparte los circuitos para que las fases queden parejas.</li></ul>'));
  }
  function cqState(c, i) {
    if (!(c.tw > 0)) return pill("info", "Vac\xEDo");
    return '<button class="stbtn '.concat(c.fails ? "bad" : "ok", '" type="button" data-act="cqwhy" data-i="').concat(i, '" aria-label="Ver verificaciones">').concat(c.fails ? "\u2717 ".concat(c.fails) : "\u2713", "</button>");
  }
  function cqWhy(i) {
    var _a;
    const r = S.cuadro.rows[i], c = cqCalc(r, i), nm = "Circuito ".concat(r.ckto || i + 1).concat(r.ubic ? " \xB7 " + r.ubic : "");
    const fail = c.ck.filter((x) => !x.ok), ok = c.ck.filter((x) => x.ok);
    const item = (x) => '<li class="'.concat(x.ok ? "okc" : "badc", '"><b>').concat(x.ok ? "\u2713" : "\u2717", " ").concat(x.g, ": ").concat(x.t, "</b><br>").concat(x.d).concat(x.ok ? "" : '<br><span class="fx">C\xF3mo corregir: '.concat(x.fx, "</span>"), '<br><span class="hint">Por qu\xE9: ').concat(x.why, "</span></li>");
    return '<h3 style="margin:0 0 6px">'.concat(esc(nm), '</h3><p class="hint" style="margin:0 0 8px">').concat(n0(c.tw), " W \xB7 ").concat(nf(c.I), " A \xB7 Disyuntor ").concat((_a = c.In) != null ? _a : "\u2014", " A curva ").concat(c.cv, " ").concat(nf(c.pc, 1), " kA \xB7 ").concat(c.dr, " ").concat(c.drIn, " A clase ").concat(r.drCl, " ").concat(c.drS, " mA \xB7 ").concat(c.sec ? sStr(c.sec) : "\u2014", " mm\xB2 \xB7 ducto ").concat(c.duc ? DUCTOS[c.duc][0] : "\u2014", " ").concat(DMAT[r.dmat] ? "(" + DMAT[r.dmat] + ")" : "", "</p>\n  ").concat(fail.length ? '<p style="margin:0 0 4px"><b>'.concat(fail.length, ' punto(s) no cumplen:</b></p><ul class="whyl">').concat(fail.map(item).join(""), "</ul>") : '<p class="note ok" style="margin:0 0 8px">Este circuito cumple todas las verificaciones.</p>', '\n  <details><summary class="hint" style="cursor:pointer">Ver lo que s\xED cumple (').concat(ok.length, ')</summary><ul class="whyl">').concat(ok.map(item).join(""), "</ul></details>");
  }
  function cqSummary() {
    const q = S.cuadro, V = +q.V || 220;
    if (!q.rows.length) return "";
    const cs = q.rows.map(cqCalc), g = cqGeneral(), ph = { R: 0, S: 0, T: 0 }, drs = new Set(q.rows.map((r, i) => cqDR(i))), bad = cs.filter((c) => c.fails).length;
    q.rows.forEach((r, i) => {
      if (ph[r.fase] != null) ph[r.fase] += cs[i].tw;
    });
    const usaF = ph.R + ph.S + ph.T > 0;
    return kpis([kpi("Potencia instalada", n0(g.tw), "W"), kpi("Demanda ".concat(ab("Pd")), n0(g.fd.Pd), "W"), kpi("Corriente de demanda", nf(g.Ig, 1), "A"), kpi("Protecci\xF3n general", g.In, "A"), kpi("Diferenciales", drs.size), kpi("Circuitos con observaciones", bad, "", bad ? "bad" : "ok")].concat(usaF ? [kpi("Fase R / S / T", "".concat(n0(ph.R), " / ").concat(n0(ph.S), " / ").concat(n0(ph.T)), "W")] : [])) + '<p class="hint">Demanda seg\xFAn RIC N\xB003, Tabla 3.1: '.concat(n0(g.fd.a), " \xD7 1").concat(g.fd.b ? " + ".concat(n0(g.fd.b), " \xD7 0,35") : "", " = ").concat(n0(g.fd.Pd), " W. La protecci\xF3n general m\xEDnima de una vivienda es 25 A.</p>");
  }
  function cqLive() {
    const q = S.cuadro;
    const sum = { pl: 0, eg: 0, e2: 0, e3: 0, tc: 0, tw: 0 };
    document.querySelectorAll("tr[data-crow]").forEach((tr) => {
      var _a;
      const i = +tr.dataset.crow, r = q.rows[i];
      if (!r) return;
      const c = cqCalc(r, i);
      tr.querySelector('[data-live="tc"]').textContent = c.tc;
      tr.querySelector('[data-live="tw"]').textContent = n0(c.tw);
      tr.querySelector('[data-live="I"]').textContent = nf(c.I);
      {
        const st = tr.querySelector('[data-live="st"]'), h = cqState(c, i);
        if (st.dataset.h !== h) {
          st.innerHTML = h;
          st.dataset.h = h;
        }
      }
      const opt = (f, t) => {
        const o = tr.querySelector("#f_cuadro_rows_".concat(i, "_").concat(f, ' option[value="auto"]'));
        if (o) o.textContent = t;
      };
      opt("disy", "".concat((_a = c.auto) != null ? _a : "\u2014", " A (auto)"));
      opt("curva", "".concat(c.cvAuto, " (auto)"));
      opt("drIn", "".concat(c.drAuto, " A (auto)"));
      opt("cond", "".concat(c.sAuto ? sStr(c.sAuto) : "\u2014", " (auto)"));
      opt("ducto", "".concat(c.dAuto ? c.dAuto + " mm" : "\u2014", " (auto)"));
      const dn = tr.querySelector("#f_cuadro_rows_".concat(i, "_drN"));
      if (dn && document.activeElement !== dn) dn.placeholder = "DR" + (Math.floor(i / 3) + 1);
      sum.pl += +r.pl || 0;
      sum.eg += +r.eg || 0;
      sum.e2 += +r.e2 || 0;
      sum.e3 += +r.e3 || 0;
      sum.tc += c.tc;
      sum.tw += c.tw;
    });
    const set = (k, v) => {
      const el = document.querySelector('[data-live="'.concat(k, '"]'));
      if (el) el.textContent = v;
    };
    set("spl", sum.pl);
    set("seg", sum.eg);
    set("se2", sum.e2);
    set("se3", sum.e3);
    set("stc", sum.tc);
    set("stw", n0(sum.tw));
    set("sI", nf(sum.tw / (+q.V || 220)));
    const sm = document.getElementById("cqsum");
    if (sm) {
      const h = cqSummary();
      if (sm.dataset.h !== h) {
        sm.innerHTML = h;
        sm.dataset.h = h;
      }
    }
    const tp = document.getElementById("tip");
    if (!tp.hidden && tp.dataset.row != null && S.cuadro.rows[+tp.dataset.row]) document.getElementById("tipd").innerHTML = cqWhy(+tp.dataset.row);
  }
  function potLive() {
    const t = T("potencias");
    document.querySelectorAll("tr[data-prow]").forEach((tr) => {
      const r = t.rows[+tr.dataset.prow];
      if (r) tr.querySelector('[data-live="sub"]').textContent = n0((+r.cant || 0) * (+r.w || 0)) + " W";
    });
    const el = document.querySelector('[data-live="tot"]');
    if (el) el.textContent = n0(potTotal(t)) + " W";
  }
  function cqCSV() {
    const q = S.cuadro, h = ["TDA", "N\xB0 ckto", "Portal\xE1mp. ".concat(q.wPL, " W"), "Enchufes grles. ".concat(q.wEG, " W"), "Enchufes ".concat(q.wE2, " W"), "Enchufes ".concat(q.wE3, " W"), "Total centros", "Total watts", "Fase", "Corriente A", "Disyuntor A", "Curva", "Poder de corte kA", "N\xB0 DR", "Diferencial A", "Clase", "Sensibilidad mA", "Conductor mm\xB2", "N\xB0 conductores", "Ducto", "Tipo ducto", "Ubicaci\xF3n", "Observaciones"];
    const L = [q.titulo + " ".concat(q.V, " V / ").concat(q.Hz, " Hz"), h.join("	")];
    let tw = 0, tc = 0;
    q.rows.forEach((r, i) => {
      var _a;
      const c = cqCalc(r, i);
      tw += c.tw;
      tc += c.tc;
      L.push([r.tda, r.ckto || i + 1, r.pl || 0, r.eg || 0, r.e2 || 0, r.e3 || 0, c.tc, Math.round(c.tw), r.fase, nf(c.I), (_a = c.In) != null ? _a : "", c.cv, nf(c.pc, 1), c.dr, c.drIn, r.drCl, c.drS, c.sec ? sStr(c.sec) : "", c.nc, c.duc ? DUCTOS[c.duc][0] : "", DMAT[r.dmat] || "", r.ubic, c.ck.filter((x) => !x.ok).map((x) => x.g + ": " + x.t).join("; ")].join("	"));
    });
    L.push(["TOTALES", "", "", "", "", "", tc, Math.round(tw), "", nf(tw / (+q.V || 220))].join("	"));
    return L.join("\n");
  }
