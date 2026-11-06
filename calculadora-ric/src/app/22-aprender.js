  /* ===== Ruta de aprendizaje: niveles, repaso espaciado, juego contra reloj, simulacro tipo SEC y logros ===== */
  const APR_DEF = () => ({ tab: "ruta", rep: {}, secOk: {}, sec: { best: null, hist: [] }, reloj: { best: 0, streak: 0, bestStreak: 0, perfect: 0 }, cnt: {}, logros: {} });
  let APR = (() => {
    try {
      return Object.assign(APR_DEF(), JSON.parse(localStorage.getItem(KEY + "-apr") || "{}"));
    } catch (e) {
      return APR_DEF();
    }
  })();
  const logroOk = (l) => {
    try {
      cuInit();
      return !!l[3]();
    } catch (e) {
      return false;
    }
  };
  function aprSave() {
    const nuevos = LOGROS.filter((l) => !APR.logros[l[0]] && logroOk(l));
    nuevos.forEach((l) => APR.logros[l[0]] = Date.now());
    try {
      localStorage.setItem(KEY + "-apr", JSON.stringify(APR));
    } catch (e) {
    }
    nuevos.forEach((l) => aprToast("\u{1F3C5} Logro desbloqueado: " + l[1]));
  }
  function aprCount(k) {
    APR.cnt[k] = (APR.cnt[k] || 0) + 1;
    aprSave();
  }
  function aprToast(t) {
    let el = document.getElementById("aprtoast");
    if (!el) {
      el = document.createElement("div");
      el.id = "aprtoast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = t;
    el.className = "show";
    clearTimeout(el._t);
    el._t = setTimeout(() => el.className = "", 4200);
  }
  /* ---- Preguntas: banco SEC y quiz de las lecciones del curso ---- */
  function aprPregunta(key) {
    const [src, a, b] = key.split(":");
    if (src === "sec") {
      const q = RICEngine.BANCO_SEC.q.find((x) => x.id === a);
      return q ? { q: q.q, o: q.o, a: q.a, e: q.e, ref: q.ref, t: q.t } : null;
    }
    if (src === "cu") {
      const L = CU.find((x) => x.id === a), q = L && L.q[+b];
      return q ? { q: q[0], o: q[1], a: q[2], e: q[3] || "", ref: "Curso: " + L.t, t: L.t } : null;
    }
    return null;
  }
  /* Registra una respuesta: los errores entran al repaso; los aciertos sobre tarjetas existentes las espacian. */
  function aprRegistrar(key, ok) {
    if (key.startsWith("sec:") && ok) APR.secOk[key.slice(4)] = 1;
    if (!ok || APR.rep[key]) APR.rep[key] = RICEngine.programar(APR.rep[key], ok, Date.now());
    aprSave();
  }
  /* ---- Niveles ---- */
  const NIVELES = [
    { n: 1, t: "B\xE1sico", d: "Electricidad, componentes, colores y seguridad b\xE1sica.", m: ["fund", "seg"], act: [["l_conceptos", "Conceptos b\xE1sicos"], ["tg", "Armar tablero: nivel 1"], ["demo", "Demostraci\xF3n: ca\xEDda vs distancia", "caida"]] },
    { n: 2, t: "Conductores y canalizaciones", d: "Secciones, capacidad de corriente, ductos, uniones y cajas (RIC N\xB003 y N\xB004).", m: ["cond", "canal", "union"], act: [["t_conductor", "Calculadora: elegir conductor"], ["demo", "Demostraci\xF3n: paso a paso", "pasos"], ["@reloj", "Juego: dimensiona contra reloj"]] },
    { n: 3, t: "Proyecto de vivienda", d: "Puntos, recintos, circuitos, tablero y planos (RIC N\xB010 y N\xB002).", m: ["puntos", "planos"], act: [["@asis", "Asistente: proyecto de vivienda"], ["casa", "Dise\xF1ar mi vivienda"], ["tg", "Armar tablero: nivel 2"]] },
    { n: 4, t: "Protecci\xF3n y puesta a tierra", d: "Diferenciales, contactos el\xE9ctricos, tierra y prevenci\xF3n de riesgos (RIC N\xB005 y N\xB006).", m: ["tierra", "prev"], act: [["demo", "Demostraci\xF3n: correcto vs incorrecto", "comparar"], ["sim", "Simulador 3D: simular una falla"], ["t_tierra", "Calculadora: puesta a tierra"]] },
    { n: 5, t: "Instalador", d: "Puesta en servicio, ensayos, mantenci\xF3n y simulacro tipo examen SEC.", m: ["serv"], act: [["@sec", "Simulacro tipo examen SEC"], ["sim", "Simulador 3D: examen pr\xE1ctico"], ["p8", "Proyecto: inspecci\xF3n y ensayos"]] }
  ];
  function nivelProg(N) {
    const ls = CU.filter((l) => N.m.includes(l.m)), qs = RICEngine.BANCO_SEC.q.filter((q) => q.n === N.n);
    const a = ls.filter((l) => cuDone(l.id)).length, b = qs.filter((q) => APR.secOk[q.id]).length;
    return { ls, qs, a, b, pct: Math.round((a + b) / Math.max(1, ls.length + qs.length) * 100) };
  }
  function aprRuta() {
    cuInit();
    let rec = null;
    const h = NIVELES.map((N) => {
      const p = nivelProg(N);
      if (!rec && p.pct < 70) rec = N.n;
      return '<section class="card nivel' + (rec === N.n ? " rec" : "") + '"><div class="nvh"><span class="nvn" aria-hidden="true">' + N.n + '</span><div><h2 style="margin:0">Nivel ' + N.n + " \xB7 " + N.t + "</h2><p class=\"hint\" style=\"margin:2px 0 0\">" + N.d + '</p></div></div><div class="bar" role="progressbar" aria-valuenow="' + p.pct + '" aria-valuemin="0" aria-valuemax="100" aria-label="Avance del nivel ' + N.n + '"><i style="width:' + p.pct + '%"></i></div><p class="hint" style="margin:4px 0 8px">' + p.pct + " % \xB7 lecciones " + p.a + "/" + p.ls.length + " \xB7 preguntas SEC dominadas " + p.b + "/" + p.qs.length + (rec === N.n ? " \xB7 <b>recomendado ahora</b>" : "") + '</p><div class="nvls">' + p.ls.map((l) => {
        const d = cuDone(l.id);
        return '<button type="button" class="chip' + (d ? " on" : "") + '" data-aprl="' + l.id + '">' + (d ? "✓ " : "") + esc(l.t) + "</button>";
      }).join("") + '</div><div class="nvact">' + N.act.map(([g, t, dm]) => '<button type="button" class="btn ghost small" ' + (g[0] === "@" ? 'data-aprg="' + g.slice(1) + '"' : dm ? 'data-demo="' + dm + '"' : 'data-go="' + g + '"') + ">" + t + "</button>").join("") + '<button type="button" class="btn small" data-aprq="' + N.n + '">Preguntas del nivel (' + p.qs.length + ")</button></div></section>";
    }).join("");
    return '<p class="hint">Avanza en orden: cada nivel combina lecciones del curso, pr\xE1ctica en la app y preguntas tipo SEC. Puedes entrar a cualquier nivel cuando quieras.</p>' + h;
  }
  /* ---- Sesión de preguntas (repaso, nivel o simulacro) ---- */
  let SES = null;
  function sesStart(keys, modo, titulo) {
    SES = { keys, i: 0, ans: {}, modo, titulo, t0: Date.now(), lim: modo === "sec" ? 40 * 60e3 : 0 };
    APR.tab = modo === "sec" ? "sec" : modo === "rep" ? "rep" : "ruta";
    render(true);
    window.scrollTo({ top: 0 });
  }
  function sesHTML() {
    const s = SES, k = s.keys[s.i], P = aprPregunta(k), a = s.ans[s.i], fin = s.done;
    if (fin) return sesFin();
    if (!P) {
      s.i++;
      return sesHTML();
    }
    const resp = a != null, inst = s.modo !== "sec";
    return '<section class="card ses"><div class="sesh"><b>' + esc(s.titulo) + '</b><span class="hint">Pregunta ' + (s.i + 1) + " de " + s.keys.length + (s.lim ? ' \xB7 <span id="sestime">' + sesTime() + "</span>" : "") + '</span></div><div class="bar"><i style="width:' + Math.round(s.i / s.keys.length * 100) + '%"></i></div><p class="sesq">' + esc(P.q) + '</p><div class="cuopts">' + P.o.map((o, j) => '<button type="button" class="cuo' + (resp && (inst || s.modo === "sec" && false) ? j === P.a ? " ok" : j === a ? " bad" : "" : resp && j === a ? " sel" : "") + '" data-sesa="' + j + '"' + (resp && inst ? " disabled" : "") + ">" + esc(o) + "</button>").join("") + "</div>" + (resp && inst ? note((a === P.a ? "✓ Correcto. " : "✗ La respuesta es: <b>" + esc(P.o[P.a]) + "</b>. ") + esc(P.e) + ' <span class="hint">' + esc(P.ref) + "</span>", a === P.a ? "ok" : "bad") : "") + '<div class="exp" style="margin-top:10px">' + (s.modo === "sec" && s.i > 0 ? '<button type="button" class="btn ghost" data-ses="prev">← Anterior</button>' : "") + (resp || s.modo === "sec" ? '<button type="button" class="btn calc" data-ses="next">' + (s.i + 1 < s.keys.length ? "Siguiente →" : s.modo === "sec" ? "Entregar simulacro" : "Terminar") + "</button>" : "") + '<button type="button" class="btn ghost" data-ses="exit">Salir</button></div></section>';
  }
  function sesTime() {
    const r = Math.max(0, SES.lim - (Date.now() - SES.t0)), m = Math.floor(r / 6e4), sg = Math.floor(r % 6e4 / 1e3);
    return "⏱ " + m + ":" + String(sg).padStart(2, "0");
  }
  function sesFin() {
    const s = SES, R = s.keys.map((k, i) => {
      const P = aprPregunta(k);
      return { k, P, a: s.ans[i], ok: P && s.ans[i] === P.a };
    }).filter((r) => r.P), ok = R.filter((r) => r.ok).length, nota = RICEngine.notaChilena(ok, R.length);
    return '<section class="card ses"><h2>' + esc(s.titulo) + ": resultado</h2>" + kpis([kpi("Correctas", ok + "/" + R.length), kpi("Nota", nf(nota, 1), "", nota >= 4 ? "ok" : "bad"), kpi("Tiempo", Math.max(1, Math.round((s.end - s.t0) / 6e4)), "min")]) + (s.modo === "sec" ? note("Simulaci\xF3n de pr\xE1ctica con preguntas basadas en los pliegos RIC; no es el examen oficial de la SEC. Exigencia del 60 % para la nota 4,0.", "info") : "") + (R.some((r) => !r.ok) ? '<h3>Para repasar (ya quedaron en tu repaso espaciado)</h3><ul class="chk">' + R.filter((r) => !r.ok).map((r) => "<li><span><b>" + esc(r.P.q) + "</b><br>Correcta: " + esc(r.P.o[r.P.a]) + ". " + esc(r.P.e) + ' <span class="hint">' + esc(r.P.ref) + "</span></span></li>").join("") + "</ul>" : note("✓ Todas correctas.", "ok")) + '<div class="exp" style="margin-top:10px"><button type="button" class="btn" data-ses="exit">Volver</button>' + (s.modo === "sec" ? '<button type="button" class="btn ghost" data-aprg="sec">Nuevo simulacro</button>' : "") + "</div></section>";
  }
  function sesAnswer(j) {
    const s = SES;
    if (s.modo !== "sec" && s.ans[s.i] != null) return;
    s.ans[s.i] = j;
    if (s.modo !== "sec") aprRegistrar(s.keys[s.i], j === aprPregunta(s.keys[s.i]).a);
    render(true);
  }
  function sesNext(d) {
    const s = SES;
    if (d < 0) {
      s.i = Math.max(0, s.i - 1);
      return render(true);
    }
    if (s.i + 1 < s.keys.length) s.i++;
    else sesEnd();
    render(true);
  }
  function sesEnd() {
    const s = SES;
    s.done = true;
    s.end = Date.now();
    if (s.modo === "sec") {
      const R = s.keys.map((k, i) => ({ k, ok: s.ans[i] === (aprPregunta(k) || {}).a }));
      R.forEach((r) => aprRegistrar(r.k, r.ok));
      const ok = R.filter((r) => r.ok).length, nota = RICEngine.notaChilena(ok, R.length);
      APR.sec.hist.push({ d: Date.now(), ok, n: R.length, nota });
      APR.sec.best = Math.max(APR.sec.best || 0, nota);
      aprSave();
    }
  }
  function aprRep() {
    const due = RICEngine.pendientes(APR.rep, Date.now()), tot = Object.keys(APR.rep).length, dom = Object.values(APR.rep).filter((t) => t.box >= 5).length;
    const prox = Object.values(APR.rep).filter((t) => t.box < 5 && t.due > Date.now()).sort((a, b) => a.due - b.due)[0];
    return '<section class="card"><h2>Repaso espaciado</h2><p class="hint">Cada pregunta que fallas (en el curso, en los niveles o en el simulacro) entra aqu\xED. Si la aciertas, vuelve a aparecer en 1, 3, 7, 14 y 30 d\xEDas; si la fallas, vuelve al d\xEDa siguiente.</p>' + kpis([kpi("Para hoy", due.length, "", due.length ? "warn" : "ok"), kpi("En repaso", tot), kpi("Dominadas", dom, "", "ok")]) + (due.length ? '<button type="button" class="btn calc" data-aprg="rep">Repasar ahora (' + due.length + ")</button>" : note(tot ? "✓ Est\xE1s al d\xEDa." + (prox ? " Pr\xF3ximo repaso: " + new Date(prox.due).toLocaleDateString("es-CL") + "." : "") : "A\xFAn no hay preguntas para repasar. Responde las preguntas de un nivel o un simulacro.", "ok")) + "</section>";
  }
  /* ---- Juego contra reloj: dimensiona el circuito ---- */
  let RJ = null, rjTimer = 0;
  const RJ_T = 45, RJ_N = 5;
  function rjNueva() {
    const tipos = ["alumbrado", "enchufes", "cocina"], tipo = tipos[Math.floor(Math.random() * 3)], u = USOS[tipo];
    const P = tipo === "alumbrado" ? 100 * (3 + Math.floor(Math.random() * 15)) : tipo === "enchufes" ? 250 * (3 + Math.floor(Math.random() * 9)) : 250 * (6 + Math.floor(Math.random() * 8)), L = 8 + Math.floor(Math.random() * 38);
    const I = P / 220, In = RICEngine.chooseIn(I, P, 220, 1, u[2]), r = chooseS({ I, In, L, k: 2, Vref: 220, rho: 0.018, lim: 3, Smin: u[1], fc: 1 });
    return { tipo, P, L, I, In, S: r.sel ? r.sel.s : null, dv: r.sel ? r.sel.pct : null, pIn: null, pS: null, t0: Date.now(), fin: false };
  }
  function rjStart() {
    RJ = { n: 0, pts: 0, okN: 0, q: rjNueva() };
    APR.tab = "reloj";
    rjTick();
    render(true);
  }
  function rjTick() {
    clearInterval(rjTimer);
    rjTimer = setInterval(() => {
      if (cur !== "ruta" || APR.tab !== "reloj" || !RJ || RJ.q.fin) return clearInterval(rjTimer);
      const left = RJ_T - (Date.now() - RJ.q.t0) / 1e3, el = document.getElementById("rjt");
      if (left <= 0) {
        rjCheck(true);
        return;
      }
      if (el) {
        el.textContent = Math.ceil(left) + " s";
        el.parentElement.classList.toggle("urg", left < 10);
        const b = document.getElementById("rjbar");
        if (b) b.style.width = left / RJ_T * 100 + "%";
      }
    }, 250);
  }
  function rjCheck(timeout) {
    const q = RJ.q;
    if (q.fin) return;
    q.fin = true;
    clearInterval(rjTimer);
    q.okIn = q.pIn === q.In;
    q.okS = q.pS === q.S;
    const left = Math.max(0, RJ_T - (Date.now() - q.t0) / 1e3), pts = (q.okIn ? 10 : 0) + (q.okS ? 10 : 0) + (q.okIn && q.okS ? Math.round(left / 3) : 0);
    q.pts = pts;
    q.timeout = !!timeout;
    RJ.pts += pts;
    if (q.okIn && q.okS) {
      RJ.okN++;
      APR.reloj.streak++;
      APR.reloj.bestStreak = Math.max(APR.reloj.bestStreak, APR.reloj.streak);
    } else APR.reloj.streak = 0;
    aprSave();
    render(true);
  }
  function rjSig() {
    RJ.n++;
    if (RJ.n >= RJ_N) {
      RJ.end = true;
      APR.reloj.best = Math.max(APR.reloj.best, RJ.pts);
      if (RJ.okN === RJ_N) APR.reloj.perfect = (APR.reloj.perfect || 0) + 1;
      aprSave();
    } else {
      RJ.q = rjNueva();
      rjTick();
    }
    render(true);
  }
  function aprReloj() {
    if (!RJ) return '<section class="card"><h2>⏱ Dimensiona contra reloj</h2><p>' + RJ_N + " circuitos al azar. Para cada uno elige la protecci\xF3n y la secci\xF3n del cable en " + RJ_T + " segundos. Se usa la tabla de capacidad " + esc(S.ampCfg.met) + " \xB7 " + S.ampCfg.tc + " \xB0C y un l\xEDmite de ca\xEDda del 3 % en el circuito.</p>" + kpis([kpi("Mejor puntaje", APR.reloj.best), kpi("Mejor racha", APR.reloj.bestStreak)]) + '<button type="button" class="btn calc" data-aprg="reloj">▶ Empezar</button></section>';
    if (RJ.end) return '<section class="card"><h2>⏱ Resultado</h2>' + kpis([kpi("Puntaje", RJ.pts, "", RJ.pts >= APR.reloj.best ? "ok" : ""), kpi("Circuitos correctos", RJ.okN + "/" + RJ_N), kpi("Mejor puntaje", APR.reloj.best)]) + '<div class="exp"><button type="button" class="btn calc" data-aprg="reloj">Jugar otra vez</button></div></section>';
    const q = RJ.q, u = USOS[q.tipo], ch = (k, v, t) => '<button type="button" class="chip' + (q[k] === v ? " on" : "") + (q.fin ? v === (k === "pIn" ? q.In : q.S) ? " good" : q[k] === v ? " badc" : "" : "") + '" data-rj="' + k + '" data-v="' + v + '"' + (q.fin ? " disabled" : "") + ' aria-pressed="' + (q[k] === v) + '">' + t + "</button>";
    const left = Math.max(0, RJ_T - (Date.now() - q.t0) / 1e3);
    return '<section class="card rj"><div class="sesh"><b>Circuito ' + (RJ.n + 1) + " de " + RJ_N + '</b><span class="rjt' + (left < 10 && !q.fin ? " urg" : "") + '">⏱ <span id="rjt">' + (q.fin ? "—" : Math.ceil(left) + " s") + "</span></span></div>" + (q.fin ? "" : '<div class="bar"><i id="rjbar" style="width:' + left / RJ_T * 100 + '%"></i></div>') + '<p class="sesq">' + u[0] + " \xB7 <b>" + n0(q.P) + " W</b> \xB7 220 V \xB7 largo <b>" + q.L + " m</b></p>" + '<div class="field"><label>Protecci\xF3n</label><div class="chips">' + [6, 10, 16, 20, 25, 32].map((v) => ch("pIn", v, v + " A")).join("") + '</div></div><div class="field" style="margin-top:8px"><label>Secci\xF3n</label><div class="chips">' + [1.5, 2.5, 4, 6, 10].map((v) => ch("pS", v, sStr(v) + " mm\xB2")).join("") + "</div></div>" + (q.fin ? note((q.okIn && q.okS ? "✓ \xA1Correcto! +" + q.pts + " puntos. " : (q.timeout ? "⏱ Se acab\xF3 el tiempo. " : "✗ ") + "Lo correcto: " + q.In + " A y " + sStr(q.S) + " mm\xB2. ") + "I = " + n0(q.P) + " \xF7 220 = " + nf(q.I, 2) + " A → In ≥ 1,1 \xD7 I y P ≤ 0,9 \xD7 220 \xD7 In" + (u[2] ? " (m\xEDnimo " + u[2] + " A)" : "") + " → " + q.In + " A (RIC N\xB010, 5.1.4). Secci\xF3n m\xEDnima " + sStr(u[1]) + " mm\xB2 (RIC N\xB004, 5.4), Iz ≥ In (Tabla 4.4) y ca\xEDda " + nf(q.dv, 2) + " % ≤ 3 % (RIC N\xB003, 5.1.3).", q.okIn && q.okS ? "ok" : "bad") + '<button type="button" class="btn calc" data-rj="next">' + (RJ.n + 1 < RJ_N ? "Siguiente circuito →" : "Ver resultado") + "</button>" : '<button type="button" class="btn calc" data-rj="ok"' + (q.pIn && q.pS ? "" : " disabled") + ">Comprobar</button>") + '<p class="hint" style="margin:8px 0 0">Puntaje: ' + RJ.pts + " \xB7 racha " + APR.reloj.streak + "</p></section>";
  }
  /* ---- Simulacro tipo examen SEC ---- */
  function aprSec() {
    const H = APR.sec.hist.slice(-5).reverse();
    return '<section class="card"><h2>\u{1F393} Simulacro tipo examen SEC</h2><p>25 preguntas al azar del banco de ' + RICEngine.BANCO_SEC.q.length + " preguntas basadas en los pliegos RIC N\xB003, N\xB004, N\xB005, N\xB006 y N\xB010, con 40 minutos. La correcci\xF3n y las explicaciones aparecen al entregar; lo que falles pasa a tu repaso.</p>" + note(RICEngine.BANCO_SEC.nota, "info") + kpis([kpi("Mejor nota", APR.sec.best != null ? nf(APR.sec.best, 1) : "—", "", APR.sec.best >= 4 ? "ok" : ""), kpi("Simulacros", APR.sec.hist.length)]) + (H.length ? '<div class="tbl-wrap"><table class="pt"><thead><tr><th>Fecha</th><th class="num">Correctas</th><th class="num">Nota</th></tr></thead><tbody>' + H.map((h) => "<tr><td>" + new Date(h.d).toLocaleDateString("es-CL") + '</td><td class="num">' + h.ok + "/" + h.n + '</td><td class="num">' + nf(h.nota, 1) + "</td></tr>").join("") + "</tbody></table></div>" : "") + '<button type="button" class="btn calc" data-aprg="sec">Comenzar simulacro</button></section>';
  }
  /* ---- Logros ---- */
  const LOGROS = [
    ["l1", "Primera lecci\xF3n", "Completa una lecci\xF3n del curso.", () => CU.some((l) => cuDone(l.id))],
    ["mod", "M\xF3dulo completo", "Completa todas las lecciones de un m\xF3dulo.", () => CU_M.some(([m]) => CU.filter((l) => l.m === m).every((l) => cuDone(l.id)))],
    ["curso", "Curso completo", "Completa todas las lecciones.", () => CU.every((l) => cuDone(l.id))],
    ["exf", "Examen final aprobado", "Aprueba el examen final del curso (11 o m\xE1s de 15).", () => (S.curso && S.curso.examBest || 0) >= 11],
    ["sec4", "Simulacro aprobado", "Saca nota 4,0 o m\xE1s en el simulacro tipo SEC.", () => (APR.sec.best || 0) >= 4],
    ["sec6", "Simulacro sobresaliente", "Saca nota 6,0 o m\xE1s en el simulacro tipo SEC.", () => (APR.sec.best || 0) >= 6],
    ["rj5", "Reloj perfecto", "Acierta los 5 circuitos de una partida contra reloj.", () => (APR.reloj.perfect || 0) >= 1],
    ["rj10", "Racha de 10", "Acierta 10 circuitos seguidos contra reloj.", () => APR.reloj.bestStreak >= 10],
    ["rep", "Repaso al d\xEDa", "Ten 5 o m\xE1s preguntas en repaso y ninguna pendiente.", () => Object.keys(APR.rep).length >= 5 && !RICEngine.pendientes(APR.rep, Date.now()).length],
    ["dom", "Dominio", "Lleva 10 preguntas del repaso a la caja final.", () => Object.values(APR.rep).filter((t) => t.box >= 5).length >= 10],
    ["fallas", "Detective de fallas", "Simula 4 fallas en el simulador 3D.", () => (APR.cnt.fallas || 0) >= 4],
    ["proy", "Proyecto sin observaciones", "Termina un proyecto de vivienda sin observaciones en el asistente.", () => !!(S.circuits && S.circuits.length && S.rooms && S.rooms.length && !issues(S).length)]
  ];
  function aprLogros() {
    const n = LOGROS.filter((l) => APR.logros[l[0]] || logroOk(l)).length;
    return '<section class="card"><h2>\u{1F3C5} Logros</h2><p class="hint">' + n + " de " + LOGROS.length + ' desbloqueados.</p><div class="logros">' + LOGROS.map(([k, t, d, f]) => {
      const on = !!APR.logros[k] || logroOk([k, t, d, f]);
      return '<div class="logro' + (on ? " on" : "") + '"><span class="li" aria-hidden="true">' + (on ? "\u{1F3C5}" : "\u{1F512}") + "</span><div><b>" + t + '</b><span class="hint">' + d + "</span></div><span class=\"sr-only\">" + (on ? "Desbloqueado" : "Bloqueado") + "</span></div>";
    }).join("") + "</div></section>";
  }
  /* ---- Página ---- */
  const APR_TABS = [["ruta", "Ruta por niveles"], ["rep", "Repaso"], ["reloj", "Contra reloj"], ["sec", "Simulacro SEC"], ["logros", "Logros"]];
  function pgRuta() {
    const due = RICEngine.pendientes(APR.rep, Date.now()).length;
    let body;
    if (SES && (APR.tab === "sec" && SES.modo === "sec" || APR.tab === "rep" && SES.modo === "rep" || APR.tab === "ruta" && SES.modo === "niv")) body = sesHTML();
    else body = APR.tab === "rep" ? aprRep() : APR.tab === "reloj" ? aprReloj() : APR.tab === "sec" ? aprSec() : APR.tab === "logros" ? aprLogros() : aprRuta();
    return '<p class="eyebrow">Aprender \xB7 RIC N\xB001 a N\xB019</p><h1>Ruta de aprendizaje</h1><p class="lead">Del b\xE1sico al nivel instalador: lecciones, pr\xE1ctica, juegos, repaso de lo que fallas y simulacro tipo examen SEC, con la cita del pliego en cada respuesta.</p><div class="dmtabs" role="tablist" aria-label="Secciones de la ruta">' + APR_TABS.map(([k, t]) => '<button type="button" role="tab" data-aprt="' + k + '" aria-selected="' + (APR.tab === k) + '">' + t + (k === "rep" && due ? ' <span class="pill warn">' + due + "</span>" : "") + "</button>").join("") + "</div>" + body;
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-aprt],[data-aprg],[data-aprq],[data-aprl],[data-sesa],[data-ses],[data-rj]");
    if (!b) return;
    const d = b.dataset;
    if (d.aprt) {
      APR.tab = d.aprt;
      if (SES && !SES.done && SES.modo === "sec" && d.aprt !== "sec") {
      } else if (SES && SES.done) SES = null;
      aprSave();
      render(true);
      return;
    }
    if (d.aprl) {
      cuInit();
      S.curso.cur = d.aprl;
      save();
      go("curso");
      return;
    }
    if (d.aprq) {
      const qs = RICEngine.BANCO_SEC.q.filter((q) => q.n === +d.aprq).map((q) => "sec:" + q.id);
      sesStart(RICEngine.mezclar(qs), "niv", "Preguntas del nivel " + d.aprq);
      return;
    }
    if (d.aprg) {
      const g = d.aprg;
      if (g === "asis") return wizStart();
      if (g === "rep") return sesStart(RICEngine.pendientes(APR.rep, Date.now()).slice(0, 20), "rep", "Repaso de hoy");
      if (g === "sec") return sesStart(RICEngine.mezclar(RICEngine.BANCO_SEC.q.map((q) => "sec:" + q.id)).slice(0, 25), "sec", "Simulacro tipo examen SEC");
      if (g === "reloj") {
        if (cur !== "ruta") go("ruta");
        return rjStart();
      }
      APR.tab = g;
      if (cur !== "ruta") go("ruta");
      else render(true);
      return;
    }
    if (d.sesa != null && SES) return sesAnswer(+d.sesa);
    if (d.ses && SES) {
      if (d.ses === "exit") {
        SES = null;
        render(true);
        return;
      }
      return sesNext(d.ses === "prev" ? -1 : 1);
    }
    if (d.rj && RJ) {
      if (d.rj === "ok") return rjCheck(false);
      if (d.rj === "next") return rjSig();
      if (!RJ.q.fin) {
        RJ.q[d.rj] = +d.v;
        render(true);
      }
    }
  });
  setInterval(() => {
    if (cur !== "ruta" || !SES || SES.done || !SES.lim) return;
    const el = document.getElementById("sestime");
    if (Date.now() - SES.t0 >= SES.lim) {
      sesEnd();
      render(true);
    } else if (el) el.textContent = sesTime();
  }, 1e3);
