  const APPL = { none: ["Nada conectado", 0], tv: ["Televisor", 120], pc: ["Computador", 300], lav: ["Lavadora", 500], plancha: ["Plancha", 1e3], micro: ["Microondas", 1200], estufa: ["Estufa", 1500], hervidor: ["Hervidor", 2e3], clima: ["Aire acondicionado", 2500], termo: ["Termo el\xE9ctrico", 2e3] };
  const APPC = { tv: 2238513, pc: 5595246, lav: 15330800, plancha: 10181046, micro: 14014684, estufa: 12075823, hervidor: 3049153, clima: 16054007 };
  const ROOMS0 = [{ id: "liv", n: "Living-comedor", x0: 0, x1: 5, z0: 0, z1: 4, t: "living", col: 14074530 }, { id: "coc", n: "Cocina", x0: 5, x1: 8, z0: 0, z1: 3, t: "cocina", col: 13883340 }, { id: "lav", n: "Lavadero", x0: 8, x1: 10, z0: 0, z1: 3, t: "lavadero", col: 13358296 }, { id: "pas", n: "Pasillo", x0: 5, x1: 8, z0: 3, z1: 4.5, t: "pasillo", col: 13681842 }, { id: "ban", n: "Ba\xF1o", x0: 8, x1: 10, z0: 3, z1: 4.5, t: "bano", col: 13031902 }, { id: "d1", n: "Dormitorio 1", x0: 0, x1: 5, z0: 4, z1: 7, t: "dormitorio", col: 14273202 }, { id: "d2", n: "Dormitorio 2", x0: 5, x1: 10, z0: 4.5, z1: 7, t: "dormitorio", col: 13812651 }];
  const DOORS0 = [["z", 0, 3, 3.9], ["x", 5, 1.5, 2.4], ["x", 5, 3.1, 3.9], ["z", 4, 3.8, 4.6], ["z", 3, 6, 6.8], ["x", 8, 1.8, 2.6], ["x", 8, 3.2, 4], ["z", 4.5, 6.2, 7]];
  let PANEL = false, NFL = 1, ROOMS = ROOMS0, DOORS = DOORS0, OPEN = [], WALLS = [], HW = 10, HD = 7, TX = 1.7, HNAME = "", houseKey = null, WTE = 0.15, WTI = 0.12;
  function wallKind(R, w) {
    const mx = (w[0] + w[2]) / 2, mz = (w[1] + w[3]) / 2, hz = Math.abs(w[1] - w[3]) < 1e-6, inR = (x, z) => R.some((r) => x > r.x0 + 1e-6 && x < r.x1 - 1e-6 && z > r.z0 + 1e-6 && z < r.z1 - 1e-6);
    return (hz ? inR(mx, mz - 0.05) && inR(mx, mz + 0.05) : inR(mx - 0.05, mz) && inR(mx + 0.05, mz)) ? "i" : "e";
  }
  function deriveWalls(R, D, O) {
    D = (D || []).concat(O || []);
    const L = /* @__PURE__ */ new Map(), put = (ax, v, a, b) => {
      const k = ax + Math.round(v * 100);
      if (!L.has(k)) L.set(k, { ax, v, s: [] });
      L.get(k).s.push([a, b]);
    };
    R.forEach((r) => {
      put("z", r.z0, r.x0, r.x1);
      put("z", r.z1, r.x0, r.x1);
      put("x", r.x0, r.z0, r.z1);
      put("x", r.x1, r.z0, r.z1);
    });
    const W = [];
    L.forEach(({ ax, v, s }) => {
      s.sort((p, q) => p[0] - q[0]);
      let m = [];
      s.forEach(([a, b]) => {
        const l = m[m.length - 1];
        if (l && a <= l[1] + 1e-6) l[1] = Math.max(l[1], b);
        else m.push([a, b]);
      });
      D.filter((d) => d[0] === ax && Math.abs(d[1] - v) < 0.05).forEach((d) => {
        m = m.flatMap(([a, b]) => d[3] <= a || d[2] >= b ? [[a, b]] : [[a, d[2]], [d[3], b]].filter(([p, q]) => q - p > 0.02));
      });
      m.forEach(([a, b]) => W.push(ax === "z" ? [a, v, b, v] : [v, a, v, b]));
    });
    return W;
  }
  function setHouse(h) {
    const ok = h && Array.isArray(h.rooms) && h.rooms.length;
    ROOMS = ok ? h.rooms.map((r) => ({ id: String(r.id), n: String(r.n || "Recinto"), t: r.t || "otro", x0: +r.x0, x1: +r.x1, z0: +r.z0, z1: +r.z1, f: +r.f === 1 ? 1 : 0, sk: r.sk || "", sd: r.sd || "" })) : ROOMS0;
    DOORS = ok ? (h.doors || []).map((d) => [d[0], +d[1], +d[2], +d[3], +d[4] === 1 ? 1 : 0]) : DOORS0;
    OPEN = ok ? (h.open || []).map((d) => [d[0], +d[1], +d[2], +d[3], +d[4] === 1 ? 1 : 0]) : [];
    NFL = ROOMS.some((r) => r.f === 1) ? 2 : 1;
    PANEL = !!(ok && h.panel);
    WTE = ok && +h.we >= 0.08 ? Math.min(0.3, +h.we) : 0.15;
    WTI = ok && +h.wi >= 0.06 ? Math.min(0.25, +h.wi) : 0.12;
    HW = Math.max(...ROOMS.map((r) => r.x1));
    HD = Math.max(...ROOMS.map((r) => r.z1));
    TX = ok && isFinite(+h.tx) ? +h.tx : 1.7;
    HNAME = ok ? String(h.n || "Mi vivienda") : "";
    WALLS = [];
    for (let f = 0; f < NFL; f++) {
      const Rf = ROOMS.filter((r) => (r.f || 0) === f), of = (d) => (d[4] || 0) === f;
      deriveWalls(Rf, DOORS.filter(of), OPEN.filter(of)).forEach((w) => {
        const a = w.concat([wallKind(Rf, w) === "e" ? WTE : WTI]);
        a.f = f;
        WALLS.push(a);
      });
    }
  }
  function syncHouse() {
    const h = S && S.sim2 && S.sim2.house || null, k = h ? JSON.stringify(h) : "";
    if (k === houseKey) return false;
    houseKey = k;
    const n0f = NFL;
    setHouse(h);
    if (NFL !== n0f || NFL < 2) simFl = NFL > 1 ? 0 : -1;
    return true;
  }
  setHouse(null);
  const FH = 2.75, flY = (y) => (+y || 0) >= FH - 0.1 ? 1 : 0, flVis = (f) => simFl < 0 || NFL < 2 || f <= simFl, flPick = (f) => simFl < 0 || NFL < 2 || f === simFl;
  const WH = 2.5, V0 = 220, RHO = 0.018, YC = 2.64, MAXI = 60;
  const T_NAME = { lamp: "Luz", sw: "Interruptor", out: "Enchufe", box: "Caja", horno: "Horno" };
  const VAR = {
    sw: [["s", "9/12", "Interruptor 9/12 (un efecto)", "sw"], ["d", "9/15", "Interruptor 9/15 (dos efectos)", "sw15"], ["t", "9/32", "Interruptor 9/32 (tres efectos)", "sw32"], ["c", "9/24", "Interruptor 9/24 (combinaci\xF3n o escalera)", "sw24"], ["ip", "9/12 IP44", "Interruptor 9/12 estanco IP44", "swip"], ["dim", "Dimmer", "Regulador de intensidad (dimmer)", "dim"], ["pir", "Sensor", "Sensor de movimiento (detector de presencia)", "pir"], ["pul", "Pulsador", "Pulsador de timbre", "pul"]],
    out: [["s", "Simple", "Enchufe 2P+T 10/16 A", "out"], ["d", "Doble", "Enchufe doble 2P+T 10/16 A", "out2"], ["ip", "IP44", "Enchufe estanco IP44 con tapa", "outip"], ["usb", "USB", "Enchufe 2P+T con cargador USB", "outusb"], ["f", "Fuerza 16 A", "Enchufe de fuerza 2P+T 16 A", "out16"], ["dat", "Datos/TV", "Toma de datos RJ45 / TV (corrientes d\xE9biles)", "outdat"]],
    lamp: [["s", "Centro", "Centro de luz con portal\xE1mpara", "lamp"], ["led", "Plaf\xF3n LED", "Plaf\xF3n LED", "plaf"], ["foco", "Foco embutido", "Foco embutido LED", "foco"], ["tubo", "Tubo LED", "Equipo lineal LED / fluorescente", "tubo"], ["ext", "Extractor", "Extractor de ba\xF1o 25 W", "ext"], ["tim", "Timbre", "Campanilla de timbre 10 W", "tim"], ["pm", "Portal\xE1mpara", "Portal\xE1mpara de muro E27 (aplique)", "pm"]]
  };
  const REG_T = { N: ["Regleta de neutro", "Neutro", 3990], PE: ["Regleta de tierra (PE)", "Tierra", 3990], F: ["Repartidor de fase (bornera)", "Fase", 6990], peine: ["Peine de conexi\xF3n 1P (barra tipo peine)", "Peine", 6500] };
  const regOf = (s) => Array.isArray(s.reg) ? s.reg : [{ t: "N", n: 12 }, { t: "PE", n: 12 }];
  const regNeed = (s) => {
    const nDR = simDRs(s).length, sinDR = s.circuits.filter((c) => c.dr === "none" || c.nc === "bar").length;
    return { N: nDR + sinDR + 1, PE: s.circuits.length + 1 };
  };
  const REG_DEF = { N: [-0.17, 1.1], PE: [0.17, 1.1], F: [-0.3, 1.0], peine: [0, 1.43] };
  const regLen = (r) => r.t === "peine" ? r.n * 0.018 : Math.min(0.42, 0.03 + r.n * 0.024);
  function regPos(s, r, i) {
    const W = tabW(s), d = REG_DEF[r.t] || [0, 1.1], same = regOf(s).slice(0, i).filter((q) => q.t === r.t && q.x == null).length, L = regLen(r);
    let x = r.x != null ? +r.x : r.t === "peine" ? -W / 2 + 0.09 + L / 2 : d[0], y = r.y != null ? +r.y : d[1] + (r.t === "peine" ? same * 0.012 : -same * 0.05);
    const lim = Math.max(0, W / 2 - 0.05 - L / 2);
    x = Math.max(-lim, Math.min(lim, x));
    y = Math.max(1.06, Math.min(1.94, y));
    return { x, y, L };
  }
  let simRegSel = -1;
  const regHave = (s, t) => regOf(s).filter((r) => r.t === t).reduce((a, r) => a + (+r.n || 0), 0);
  const varOf = (it) => {
    const L = VAR[it.t];
    return L ? L.find((x) => x[0] === (it.v || "s")) || L[0] : null;
  };
  function varSym(t, v, col) {
    const st = 'stroke="' + col + '" stroke-width="2" fill="none"';
    if (t === "sw") {
      let g = '<circle r="4" fill="' + col + '"/><line x1="0" y1="0" x2="8" y2="-9" ' + st + "/>";
      if (v === "d") g = '<circle r="4" fill="' + col + '"/><line x1="0" y1="0" x2="5" y2="-10" ' + st + '/><line x1="0" y1="0" x2="10" y2="-4" ' + st + "/>";
      if (v === "t") g = '<circle r="4" fill="' + col + '"/><line x1="0" y1="0" x2="3" y2="-11" ' + st + '/><line x1="0" y1="0" x2="8" y2="-8" ' + st + '/><line x1="0" y1="0" x2="11" y2="-3" ' + st + "/>";
      if (v === "c") g += '<line x1="0" y1="0" x2="-8" y2="9" ' + st + "/>";
      if (v === "ip") g += '<text x="5" y="10" font-size="7" font-weight="800" fill="' + col + '">IP</text>';
      if (v === "dim") g += '<path d="M-8 8L6 -5M6 -5L2 -5M6 -5L6 -1" stroke="' + col + '" stroke-width="1.3" fill="none"/>';
      if (v === "pir") g = '<circle r="6" ' + st + '/><path d="M-3 3A4 4 0 0 1 3 3M-5 5A7 7 0 0 1 5 5" ' + st.replace('stroke-width="2"', 'stroke-width="1.2"') + '/><circle r="1.6" fill="' + col + '"/>';
      if (v === "pul") g = '<circle r="5.5" ' + st + '/><circle r="2.4" fill="' + col + '"/>';
      return g;
    }
    if (t === "out") {
      const hc = '<path d="M0 -7 A7 7 0 0 1 0 7Z" fill="' + (v === "f" ? col : "#fff") + '" stroke="' + col + '" stroke-width="2"/>', ln = (y) => '<line x1="2" y1="' + y + '" x2="7" y2="' + y + '" stroke="' + col + '" stroke-width="1.5"/>';
      if (v === "d") return hc + ln(-4) + ln(0) + ln(4);
      if (v === "f") return hc + '<line x1="2" y1="0" x2="9" y2="0" stroke="' + col + '" stroke-width="2"/>';
      if (v === "ip") return hc + ln(-3) + ln(3) + '<text x="-12" y="3" font-size="7" font-weight="800" fill="' + col + '">IP</text>';
      if (v === "usb") return hc + ln(-3) + ln(3) + '<rect x="-11" y="-2" width="6" height="4" fill="' + col + '"/>';
      if (v === "dat") return '<path d="M-6 -7L8 0L-6 7Z" fill="#fff" stroke="' + col + '" stroke-width="2"/><text x="-4" y="2.6" font-size="6.5" font-weight="800" fill="' + col + '">D</text>';
      return hc + ln(-3) + ln(3);
    }
    if (t === "lamp") {
      if (v === "led") return '<circle r="8" fill="#fff" stroke="' + col + '" stroke-width="2"/><circle r="4" fill="' + col + '"/>';
      if (v === "foco") return '<circle r="5" fill="#fff" stroke="' + col + '" stroke-width="2"/><circle r="1.8" fill="' + col + '"/>';
      if (v === "pm") return '<circle r="7" fill="#fff" stroke="' + col + '" stroke-width="2"/><path d="M-5 -5L5 5M5 -5L-5 5" stroke="' + col + '" stroke-width="1.6"/><line x1="-9" y1="9" x2="9" y2="9" stroke="' + col + '" stroke-width="2"/>';
      if (v === "ext") return '<circle r="8" fill="#fff" stroke="' + col + '" stroke-width="2"/><path d="M0 0C-2 -6 3 -7 3 -3ZM0 0C6 -2 7 3 3 3ZM0 0C2 6 -3 7 -3 3ZM0 0C-6 2 -7 -3 -3 -3Z" fill="' + col + '"/>';
      if (v === "tim") return '<path d="M-7 4H7M-5 4V-1A5 5 0 0 1 5 -1V4" fill="#fff" stroke="' + col + '" stroke-width="2"/><circle cy="6.5" r="1.6" fill="' + col + '"/>';
      if (v === "tubo") return '<rect x="-12" y="-4" width="24" height="8" fill="#fff" stroke="' + col + '" stroke-width="2"/><line x1="-12" y1="0" x2="12" y2="0" stroke="' + col + '" stroke-width="1.5"/>';
      return '<circle r="8" fill="#fff" stroke="' + col + '" stroke-width="2"/><path d="M-5.6 -5.6L5.6 5.6M5.6 -5.6L-5.6 5.6" stroke="' + col + '" stroke-width="2"/>';
    }
    return "";
  }
  const varIcon = (t, v) => '<svg viewBox="-14 -14 28 28" width="22" height="22" aria-hidden="true">' + varSym(t, v, "currentColor").replace(/#fff/g, "transparent") + "</svg>";
  function lampOn(by, l) {
    const w = by.get(l.sw);
    if (!w) return false;
    if (w.v === "c") {
      const w2 = l.sw2 != null ? by.get(l.sw2) : null;
      return w2 && w2.v === "c" ? !!w.on !== !!w2.on : !!w.on;
    }
    if (w.v === "t") return l.k === 2 ? !!w.on3 : l.k === 1 ? !!w.on2 : !!w.on;
    return w.v === "d" && l.k === 1 ? !!w.on2 : !!w.on;
  }
  function swPress(w, key) {
    if (w.v === "t") {
      if (key === 0 || key === 1 || key === 2) w[["on", "on2", "on3"][key]] = !w[["on", "on2", "on3"][key]];
      else {
        const n = ((w.on ? 1 : 0) + (w.on2 ? 2 : 0) + (w.on3 ? 4 : 0) + 1) % 8;
        w.on = !!(n & 1);
        w.on2 = !!(n & 2);
        w.on3 = !!(n & 4);
      }
    } else if (w.v === "d") {
      if (key === 1) w.on2 = !w.on2;
      else if (key === 0) w.on = !w.on;
      else {
        const n = ((w.on ? 1 : 0) + (w.on2 ? 2 : 0) + 1) % 4;
        w.on = !!(n & 1);
        w.on2 = !!(n & 2);
      }
    } else if (w.v === "pul") {
      w.on = true;
      clearTimeout(w._pt);
      setTimeout(() => {
        const x = S.sim2 && S.sim2.items.find((i) => i.id === w.id);
        if (x && x.on) {
          x.on = false;
          save();
          if (cur === "sim") simRefresh([]);
        }
      }, 1600);
    } else w.on = !w.on;
  }
  const swState = (w) => w.v === "t" ? [w.on, w.on2, w.on3].map((x, i) => "tecla " + (i + 1) + " " + (x ? "ON" : "OFF")).join(" \xB7 ") : w.v === "d" ? "tecla 1 " + (w.on ? "ON" : "OFF") + " \xB7 tecla 2 " + (w.on2 ? "ON" : "OFF") : w.on ? "ON" : "OFF";
  const T_Y = { sw: 1.1, box: 2.3, out: 0.3, horno: 0.3 };
  const CNAME = { F: ["Fase", "rojo", "#D32F2F", 13840175], N: ["Neutro", "blanco", "#F4F4F4", 15921906], PE: ["Tierra de protecci\xF3n", "verde/amarillo", "#2E9E44", 3055172], R: ["Retorno", "rojo oscuro con franja", "#8E1B1B", 9313051], R2: ["Retorno 2", "naranjo (2.\xBA efecto)", "#D9771E", 14251806], R3: ["Retorno 3", "caf\xE9 claro (3.er efecto)", "#A1887F", 10586239], C: ["Com\xFAn", "rojo (com\xFAn del 9/24)", "#C62828", 12986408], V1: ["Viajero 1", "negro", "#262626", 2500134], V2: ["Viajero 2", "caf\xE9", "#7B4A2A", 8080938] };
  const FAULTS = { aisl: "Aislamiento da\xF1ado", pe: "Tierra (PE) cortada", floja: "Empalme flojo", carcasa: "Falla a carcasa en un equipo", drMalo: "Diferencial defectuoso", tierraAlta: "Puesta a tierra fuera de norma" };
  const FHINT = { aisl: "En la inspecci\xF3n peri\xF3dica hay que revisar el aislamiento de cada circuito. En uno se da\xF1\xF3 un cable al pasarlo por el ducto.", pe: "Un enchufe o equipo no est\xE1 protegido contra contactos indirectos: algo pasa con su conductor de tierra.", floja: "El cliente dice que en una parte de la casa la tensi\xF3n baja cuando enciende equipos. Sospecha de un empalme mal hecho.", carcasa: "Al encender cierto equipo, salta el diferencial.", drMalo: "Hay que comprobar que las protecciones de las personas funcionen.", tierraAlta: "La medici\xF3n anual de la puesta a tierra est\xE1 pendiente." };
  const FSOL = { aisl: "Se detecta con el meg\xF3hmetro: con el circuito apagado marca menos de 0,5 M\u03A9.", pe: "Se detecta con la prueba de continuidad: ese punto marca OL (abierto) hasta la barra PE. Con el mult\xEDmetro, fase\u2013tierra da 0 V.", floja: "Se detecta con el mult\xEDmetro: con carga encendida, la tensi\xF3n cae mucho en todos los puntos que se alimentan desde esa caja. El empalme flojo se calienta y puede provocar un incendio.", carcasa: "Se detecta encendiendo los equipos uno a uno: al encender el que tiene la falla, el diferencial dispara.", drMalo: "Se detecta con el probador de diferenciales: no dispara con 30 mA.", tierraAlta: "Se detecta con el telur\xF3metro: marca m\xE1s de 20 \u03A9." };
  const TOOLS3D = [["route", "\u2310", "Ducto", "1) Toca un tubo (o el punto al que llega). 2) Elige una forma r\xE1pida (por arriba, por abajo, vertical u horizontal primero) o toca la pared por donde quieres que pase: cada cambio de direcci\xF3n es un codo de 90\xB0. M\xE1ximo 3 codos entre cajas (RIC N\xB004)."], ["wire", "\u{1F517}", "Conectar", "1) Toca la caja o el autom\xE1tico del tablero de donde sale el cable. 2) Toca los puntos que quieres alimentar desde ah\xED. Tocar de nuevo un punto ya conectado a ese origen lo desconecta. El tubo sigue solo el recorrido m\xE1s corto por muro o entretecho."], ["mano", "\u21BB", "Mano", "Toca el general, un diferencial, un autom\xE1tico, un interruptor o un equipo para encenderlo o apagarlo."], ["place", "+", "Colocar", "Elige qu\xE9 colocar y en qu\xE9 circuito. Toca un muro para enchufes, interruptores, cajas u horno; toca el piso para una luz."], ["del", "\u2715", "Quitar", "Toca un punto para quitarlo. Lo que colgaba de \xE9l se conecta a la caja anterior."], ["info", "i", "Identificar", "Toca un ducto para ver sus conductores, o cualquier elemento para ver sus datos."], ["look", "\u25CE", "Mirar", "Toca cualquier lugar para acercar la c\xE1mara ah\xED."], ["volt", "V", "Mult\xEDmetro", "Toca un enchufe, luz, interruptor, caja, tablero o medidor."], ["pinza", "A", "Pinza", "Toca un ducto o un equipo para medir la corriente que pasa por ah\xED."], ["cont", "\u03A9", "Continuidad", "Con el circuito apagado, toca un enchufe, luz, caja u horno."], ["megger", "M\u03A9", "Meg\xF3hmetro", "Con el circuito apagado, toca un ducto o el autom\xE1tico del circuito."], ["telu", "\u23DA", "Telur\xF3metro", "Toca la barra de tierra en la c\xE1mara, afuera junto al medidor."], ["drt", "\u0394I", "Probador DR", "Toca un diferencial del tablero."]];
  const INSTR = ["volt", "pinza", "cont", "megger", "telu", "drt"], MAINT = ["mano", "place", "wire", "route", "del", "info", "meas"];
  const SHORT = { route: "toca un tubo y elige su forma o los puntos por donde pasa", wire: "toca el origen y luego los puntos", info: "toca algo (o mant\xE9n el dedo con cualquier herramienta)", mano: "toca para encender o apagar", place: "toca un muro o el piso", del: "toca un punto para quitarlo", look: "toca para acercar", volt: "toca un punto", pinza: "toca un ducto o equipo", cont: "apaga el circuito y toca un punto", megger: "apaga el circuito y toca un ducto", telu: "toca la barra de tierra", drt: "toca un diferencial" };
  let simCeil = 1, simDuctSolid = false, simLP = false, simRoute = null, simSrc = null, simHeat = 0, simCut = null, simNewDR = "auto", simMode = "orbit", simWallPrev = null, simRO = /* @__PURE__ */ new Set(), simWall = 1, simConn = false, simSheet = null, simPrevErr = null;
  let simFl = -1, simPV = { sw: "s", out: "s", lamp: "s" }, simWS = 0, simWCut = false;
  let simTool = "mano", SIMV = null, simInsp = null, simToastT = 0, simSel = null, simPT = "lamp", simPC = null, simRep = { t: "", f: "aisl" }, simConfirm = "";
  const simP = (it) => it.t === "out" ? (APPL[it.a] || APPL.none)[1] : +it.P || 0;
  const simProj = (it) => it.t === "lamp" ? it.v === "ext" ? 30 : it.v === "tim" ? 10 : 100 : it.t === "out" && it.v === "dat" ? 0 : it.t === "out" ? Math.max(250, (APPL[it.a] || APPL.none)[1] >= 1500 ? (APPL[it.a] || APPL.none)[1] : 0) : it.t === "horno" ? Math.max(1500, +it.P || 0) : 0;
  const ampOf = (s) => +S.amp[s] || AMP_DEF[s] || 0;
  function stairModel(b, H) {
    H = H || FH;
    const lx = b.x1 - b.x0, lz = b.z1 - b.z0, k = b.sk || "recta", sd = b.sd || "", out = { steps: [], path: [], k };
    if (k === "caracol") {
      const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2, R = Math.max(0.5, Math.min(lx, lz) / 2 - 0.05), n = 14, a0 = sd === "izq" ? Math.PI : 0, sg = sd === "izq" ? -1 : 1, da = 5.6 / n;
      for (let i = 0; i < n; i++) {
        const a = a0 + sg * da * (i + 0.5);
        out.steps.push({ x: cx + Math.cos(a) * R / 2, z: cz + Math.sin(a) * R / 2, w: R, l: Math.min(0.42, R * da * 1.15), ry: -a, top: H * (i + 1) / n, slab: true });
        out.path.push([cx + Math.cos(a) * R * 0.7, cz + Math.sin(a) * R * 0.7]);
      }
      out.spiral = { cx, cz, R };
      return out;
    }
    if (k === "L" && lx >= 1.6 && lz >= 1.6) {
      const Wd = Math.min(1, Math.min(lx, lz) / 2), mir = sd === "izq", X = (x) => mir ? b.x0 + b.x1 - x : x;
      const LA = lz - Wd - 0.1, LB = lx - Wd - 0.1, n = 16, nA = Math.max(3, Math.round((n - 1) * LA / (LA + LB))), nB = n - 1 - nA, rise = H / n;
      for (let i = 0; i < nA; i++) {
        const run = LA / nA, t = 0.1 + run * (i + 0.5);
        out.steps.push({ x: X(b.x0 + Wd / 2), z: b.z1 - t, w: Wd - 0.06, l: run + 0.02, ry: 0, top: rise * (i + 1) });
      }
      out.steps.push({ x: X(b.x0 + Wd / 2), z: b.z0 + Wd / 2, w: Wd - 0.06, l: Wd - 0.04, ry: 0, top: rise * (nA + 1) });
      for (let i = 0; i < nB; i++) {
        const run = LB / nB, t = Wd + run * (i + 0.5);
        out.steps.push({ x: X(b.x0 + t), z: b.z0 + Wd / 2, w: run + 0.02, l: Wd - 0.06, ry: 0, top: rise * (nA + 2 + i) });
      }
      out.path = [[X(b.x0 + Wd / 2), b.z1 - 0.2], [X(b.x0 + Wd / 2), b.z0 + Wd / 2], [X(b.x1 - 0.25), b.z0 + Wd / 2]];
      return out;
    }
    const az = sd === "N" || sd === "S" ? true : sd === "E" || sd === "O" ? false : lz >= lx, L = (az ? lz : lx) - 0.3, Wd = Math.min(1.1, (az ? lx : lz) - 0.1), n = 15, run = L / n, neg = az ? sd !== "S" : sd !== "E";
    for (let i = 0; i < n; i++) {
      const t = 0.15 + run * (i + 0.5), c = az ? neg ? b.z1 - t : b.z0 + t : neg ? b.x1 - t : b.x0 + t;
      out.steps.push(az ? { x: b.x0 + 0.05 + Wd / 2, z: c, w: Wd, l: run + 0.02, ry: 0, top: H * (i + 1) / n } : { x: c, z: b.z0 + 0.05 + Wd / 2, w: run + 0.02, l: Wd, ry: 0, top: H * (i + 1) / n });
    }
    const f0 = 0.2, f1 = L + 0.1;
    out.path = az ? [[b.x0 + 0.05 + Wd / 2, neg ? b.z1 - f0 : b.z0 + f0], [b.x0 + 0.05 + Wd / 2, neg ? b.z1 - f1 : b.z0 + f1]] : [[neg ? b.x1 - f0 : b.x0 + f0, b.z0 + 0.05 + Wd / 2], [neg ? b.x1 - f1 : b.x0 + f1, b.z0 + 0.05 + Wd / 2]];
    out.rail = { az, neg, L, Wd };
    return out;
  }
  function stairPlanSVG(b, X, Z, col, sw, up) {
    const m = stairModel(b);
    let g = "";
    if (m.spiral) {
      const { cx, cz, R } = m.spiral, r = Math.abs(X(cx + R) - X(cx));
      g += '<circle cx="' + X(cx) + '" cy="' + Z(cz) + '" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '"/><circle cx="' + X(cx) + '" cy="' + Z(cz) + '" r="' + r * 0.08 + '" fill="' + col + '"/>';
      m.steps.forEach((s) => {
        const a = -s.ry - 5.6 / 28;
        g += '<line x1="' + X(cx) + '" y1="' + Z(cz) + '" x2="' + X(cx + Math.cos(a) * R) + '" y2="' + Z(cz + Math.sin(a) * R) + '" stroke="' + col + '" stroke-width="' + sw * 0.7 + '"/>';
      });
    } else m.steps.forEach((s) => {
      g += '<rect x="' + X(s.x - s.w / 2) + '" y="' + Z(s.z - s.l / 2) + '" width="' + (X(s.x + s.w / 2) - X(s.x - s.w / 2)) + '" height="' + (Z(s.z + s.l / 2) - Z(s.z - s.l / 2)) + '" fill="none" stroke="' + col + '" stroke-width="' + sw * 0.7 + '"/>';
    });
    const P = m.path, last = P[P.length - 1], prev = P[P.length - 2] || P[0], ang = Math.atan2(Z(last[1]) - Z(prev[1]), X(last[0]) - X(prev[0])), ah = Math.max(4, sw * 5);
    g += '<polyline points="' + P.map((q) => X(q[0]) + "," + Z(q[1])).join(" ") + '" fill="none" stroke="' + col + '" stroke-width="' + sw * 1.3 + '"' + (up ? ' stroke-dasharray="' + sw * 4 + " " + sw * 3 + '"' : "") + '/><path d="M' + X(last[0]) + " " + Z(last[1]) + "l" + (-ah * Math.cos(ang - 0.45)) + " " + (-ah * Math.sin(ang - 0.45)) + "M" + X(last[0]) + " " + Z(last[1]) + "l" + (-ah * Math.cos(ang + 0.45)) + " " + (-ah * Math.sin(ang + 0.45)) + '" stroke="' + col + '" stroke-width="' + sw * 1.3 + '" fill="none"/>';
    return { svg: g, foot: P[0], top: last };
  }
  function bathZone(r) {
    if (!r || r.t !== "bano") return null;
    const f = r.f || 0, W = Math.min(0.9, r.x1 - r.x0 - 0.2), L = Math.min(0.9, r.z1 - r.z0 - 0.2);
    if (W < 0.5 || L < 0.5) return null;
    const dm = DOORS.filter((d) => (d[4] || 0) === f && (d[0] === "x" ? (Math.abs(d[1] - r.x0) < 0.05 || Math.abs(d[1] - r.x1) < 0.05) && d[3] > r.z0 && d[2] < r.z1 : (Math.abs(d[1] - r.z0) < 0.05 || Math.abs(d[1] - r.z1) < 0.05) && d[3] > r.x0 && d[2] < r.x1)).map((d) => d[0] === "x" ? [d[1], (d[2] + d[3]) / 2] : [(d[2] + d[3]) / 2, d[1]]);
    const C = [[r.x0, r.z0, 1, 1], [r.x1, r.z0, -1, 1], [r.x0, r.z1, 1, -1], [r.x1, r.z1, -1, -1]].map(([x, z, sx, sz]) => ({ x0: Math.min(x, x + sx * W), x1: Math.max(x, x + sx * W), z0: Math.min(z, z + sz * L), z1: Math.max(z, z + sz * L), d: dm.length ? Math.min(...dm.map(([a, b]) => Math.hypot(a - x, b - z))) : 0 }));
    const b = C.sort((p, q) => q.d - p.d)[0];
    return { x0: b.x0, x1: b.x1, z0: b.z0, z1: b.z1, f };
  }
  function bathVol(it) {
    const rm = itemRoom(it), z = bathZone(rm);
    if (!z || it.t === "box" || it.t === "lamp") return 0;
    const x = it.p[0], y = it.p[1] - (z.f || 0) * FH, w = it.p[2], dx = Math.max(z.x0 - x, 0, x - z.x1), dz = Math.max(z.z0 - w, 0, w - z.z1), d = Math.hypot(dx, dz);
    if (y > 2.25) return 0;
    return d < 0.02 ? 1 : d <= 0.6 ? 2 : 0;
  }
  function simCost(s) {
    const ev = simEval(s);
    return ev.E.reduce((a, e) => ({ t: a.t + e.L, c: a.c + e.L * e.cond.length }), { t: 0, c: 0 });
  }
  function simOptimize(s) {
    const c0 = simCost(s), med = (a) => {
      const b = a.slice().sort((x, y) => x - y), m = b.length >> 1;
      return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2;
    };
    let moved = 0;
    for (let pass = 0; pass < 3; pass++) s.items.filter((b) => b.t === "box" && b.n && !b.route).forEach((b) => {
      const f = flY(b.p[1]), kids = s.items.filter((i) => i.par === b.id && flY(i.p[1]) === f), par = b.par != null ? s.items.find((i) => i.id === b.par) : null;
      if (!kids.length) return;
      const P = kids.map((i) => anchor(i)).concat([par && flY(par.p[1]) === f ? anchor(par) : [TX, 0, 0.1]]);
      let x = Math.round(med(P.map((q) => q[0])) * 20) / 20, z = Math.round(med(P.map((q) => q[2])) * 20) / 20;
      if (Math.abs(b.n[1]) < 0.5) {
        const ax = Math.abs(b.n[0]) > 0.5 ? "z" : "x", rm = roomOf(b.p[0] + b.n[0] * 0.3, b.p[2] + b.n[2] * 0.3, f);
        if (!rm) return;
        const lo = (ax === "z" ? rm.z0 : rm.x0) + 0.2, hi = (ax === "z" ? rm.z1 : rm.x1) - 0.2;
        if (ax === "z") {
          x = b.p[0];
          z = Math.max(lo, Math.min(hi, z));
        } else {
          z = b.p[2];
          x = Math.max(lo, Math.min(hi, x));
        }
        const wv = ax === "z" ? b.p[0] : b.p[2], tv = ax === "z" ? z : x;
        if (DOORS.some((d) => (d[4] || 0) === f && d[0] === (ax === "z" ? "x" : "z") && Math.abs(d[1] - wv) < 0.1 && tv > d[2] - 0.15 && tv < d[3] + 0.15)) return;
        if (roomOf(x + b.n[0] * 0.3, z + b.n[2] * 0.3, f) !== rm) return;
      } else if (!roomOf(x, z, f)) return;
      if (Math.hypot(x - b.p[0], z - b.p[2]) < 0.1) return;
      const before = simCost(s).c, e0 = simInspect(s).length, old = b.p.slice();
      b.p = [x, b.p[1], z];
      if (simCost(s).c < before - 0.05 && simInspect(s).length <= e0) moved++;
      else b.p = old;
    });
    const c1 = simCost(s);
    return { moved, dT: c0.t - c1.t, dC: c0.c - c1.c, pct: c0.c ? (c0.c - c1.c) / c0.c * 100 : 0 };
  }
  function simIcc(s, ev) {
    const U0 = 220, Zs = U0 / (Math.max(0.5, +s.icc0 || 3) * 1e3), Ra = 2 * RHO * (+s.alim.L || 0) / (+s.alim.S || 6), by = new Map(ev.E.map((e) => [e.id, e])), memo = {};
    const R = (id) => {
      if (memo[id] != null) return memo[id];
      const e = by.get(id);
      if (!e) return memo[id] = 0;
      memo[id] = 0;
      return memo[id] = 2 * RHO * e.L / (+e.S || 1.5) + (e.from != null ? R(e.from) : 0);
    };
    const c = {};
    ev.E.forEach((e) => {
      const r = R(e.id), x = c[e.cid];
      if (!x || r > x.R) c[e.cid] = { R: r, far: e.it.name, farId: e.it.id };
    });
    Object.values(c).forEach((x) => x.Imin = 0.95 * U0 / (Zs + 1.5 * (Ra + x.R)));
    return { Zs, Ra, Imax: U0 / (Zs + Ra), c };
  }
  const roomOf = (x, z, f) => ROOMS.find((r) => (r.f || 0) === (f || 0) && x >= r.x0 - 1e-6 && x <= r.x1 + 1e-6 && z >= r.z0 - 1e-6 && z <= r.z1 + 1e-6) || null;
  const rArea = (r) => (r.x1 - r.x0) * (r.z1 - r.z0), rPer = (r) => 2 * (r.x1 - r.x0 + (r.z1 - r.z0));
  const itemRoom = (it) => {
    const n = it.n || [0, 0, 0];
    return roomOf(it.p[0] + n[0] * 0.3, it.p[2] + n[2] * 0.3, flY(it.p[1]));
  };
  const cIdx = (s, id) => s.circuits.findIndex((c) => c.id === id);
  function simDRs(s) {
    return [...new Set(s.circuits.map((c) => c.dr).filter((d) => d !== "none"))].sort();
  }
  function drIn(s) {
    return [25, 40, 63, 80].find((x) => x >= +s.gen.In) || 63;
  }
  function sim2Blank() {
    return { v: 2, gen: { In: 25, on: false }, alim: { S: 6, L: 12 }, circuits: [], items: [], nid: 1, cnt: {}, drOff: {}, fault: null, done: {}, score: 0, tries: 0, log: [] };
  }
  function simAddItem(s, t, cid, p, n, o = {}) {
    const id = s.nid++;
    const used = new Set(s.items.filter((i) => i.t === t).map((i) => +((i.name || "").match(/(\d+)$/) || [0, 0])[1]));
    let num = 1;
    while (used.has(num)) num++;
    s.cnt[t] = Math.max(s.cnt[t] || 0, num);
    const it = { id, t, c: cid, p: p.slice(), n: n ? n.slice() : null, name: "".concat(T_NAME[t], " ").concat(num), par: null };
    if (t === "lamp") Object.assign(it, { P: 60, sw: null, on: false });
    if (t === "out") Object.assign(it, { a: "none", on: false });
    if (t === "sw") it.on = false;
    if (t === "horno") Object.assign(it, { P: 2e3, on: false });
    const rm = itemRoom(it);
    if (t === "out" && rm && rm.t === "cocina") it.p[1] = 1.1 + flY(p[1]) * FH;
    if (o.free) {
      it.free = true;
      it.par = null;
    } else if (o.par !== void 0) it.par = o.par;
    else {
      let best = null, bd = 1e9;
      s.items.forEach((b) => {
        if (b.t === "box" && b.c === cid) {
          const d = Math.hypot(b.p[0] - p[0], b.p[2] - p[2]) + (flY(b.p[1]) !== flY(p[1]) ? 50 : 0);
          if (d < bd) {
            bd = d;
            best = b;
          }
        }
      });
      it.par = best ? best.id : null;
    }
    ["P", "a", "sw", "v", "k", "sw2"].forEach((k) => {
      if (o[k] !== void 0) it[k] = o[k];
    });
    if (it.v === "s") delete it.v;
    if (t === "lamp" && o.P === void 0 && (it.v === "ext" || it.v === "tim")) it.P = it.v === "ext" ? 25 : 10;
    if (t === "out" && o.v === void 0 && rm && ["bano", "lavadero"].includes(rm.t)) it.v = "ip";
    if (t === "lamp" && o.sw === void 0) {
      const sw = s.items.find((x) => x.t === "sw" && x.c === cid && itemRoom(x) === rm);
      if (sw) it.sw = sw.id;
    }
    s.items.push(it);
    if (t === "sw" && o.par === void 0) s.items.forEach((l) => {
      if (l.t !== "lamp" || l.c !== cid || itemRoom(l) !== rm) return;
      if (l.sw == null) l.sw = id;
      else if (it.v === "c" && l.sw2 == null) {
        const a = s.items.find((w) => w.id === l.sw);
        if (a && a.v === "c") l.sw2 = id;
      }
    });
    return id;
  }
  function sim2Example() {
    const s = sim2Blank();
    const C = (n, In, cv, Sx, dr) => {
      const c = { id: s.nid++, n, In, cv, pc: 6, S: Sx, dr, ds: 30, cl: "A", nc: "dr", pe: true, on: true };
      s.circuits.push(c);
      return c.id;
    };
    const c1 = C("Alumbrado", 10, "B", 1.5, "DR1"), c2 = C("Enchufes", 16, "C", 2.5, "DR1"), c3 = C("Cocina y lavadero", 16, "C", 2.5, "DR2"), c4 = C("Horno", 16, "C", 2.5, "DR2");
    const A = (t, c, x, z, n, o) => simAddItem(s, t, c, n ? [x, T_Y[t], z] : [x, 2.42, z], n, o);
    const b1 = A("box", c1, 2.5, 3.94, [0, 0, -1], { par: null }), b2 = A("box", c1, 7.94, 4.25, [-1, 0, 0], { par: b1 });
    const s1 = A("sw", c1, 4.3, 0.06, [0, 0, 1], { par: b1 });
    A("lamp", c1, 1.5, 2, null, { par: b1, sw: s1, P: 100 });
    A("lamp", c1, 3.5, 2, null, { par: b1, sw: s1, P: 100 });
    const s2 = A("sw", c1, 3.5, 4.06, [0, 0, 1], { par: b1 });
    A("lamp", c1, 1.4, 5.5, null, { par: b1, sw: s2 });
    A("lamp", c1, 3.4, 5.5, null, { par: b1, sw: s2 });
    const s3 = A("sw", c1, 5.06, 2.7, [1, 0, 0], { par: b2 });
    A("lamp", c1, 6.5, 1.5, null, { par: b2, sw: s3 });
    const s4 = A("sw", c1, 5.06, 4.2, [1, 0, 0], { par: b2 });
    A("lamp", c1, 6.5, 3.75, null, { par: b2, sw: s4 });
    const s5 = A("sw", c1, 7.3, 4.56, [0, 0, 1], { par: b2 });
    A("lamp", c1, 6.4, 5.8, null, { par: b2, sw: s5 });
    A("lamp", c1, 8.7, 5.8, null, { par: b2, sw: s5 });
    const s6 = A("sw", c1, 8.06, 4.2, [1, 0, 0], { par: b2 });
    A("lamp", c1, 9, 3.75, null, { par: b2, sw: s6, P: 10 });
    const s7 = A("sw", c1, 8.06, 2.8, [1, 0, 0], { par: b2 });
    A("lamp", c1, 9, 1.5, null, { par: b2, sw: s7 });
    const b3 = A("box", c2, 1.2, 3.94, [0, 0, -1], { par: null });
    A("out", c2, 0.06, 2, [1, 0, 0], { par: b3, a: "tv" });
    A("out", c2, 4.94, 0.8, [-1, 0, 0], { par: b3, a: "pc" });
    A("out", c2, 3.2, 3.94, [0, 0, -1], { par: b3 });
    A("out", c2, 0.06, 5.5, [1, 0, 0], { par: b3, a: "estufa" });
    A("out", c2, 3, 6.94, [0, 0, -1], { par: b3 });
    const b4 = A("box", c2, 5.6, 4.56, [0, 0, 1], { par: b3 });
    A("out", c2, 6.5, 6.94, [0, 0, -1], { par: b4 });
    A("out", c2, 9.94, 6, [-1, 0, 0], { par: b4, a: "tv" });
    const b5 = A("box", c3, 7.2, 2.94, [0, 0, -1], { par: null });
    A("out", c3, 5.6, 0.06, [0, 0, 1], { par: b5, a: "hervidor" });
    A("out", c3, 6.6, 0.06, [0, 0, 1], { par: b5, a: "micro" });
    A("out", c3, 7.5, 0.06, [0, 0, 1], { par: b5 });
    A("out", c3, 9, 0.06, [0, 0, 1], { par: b5, a: "lav" });
    A("horno", c4, 7.94, 1, [-1, 0, 0], { par: null, P: 2e3 });
    return s;
  }
  if (!S.sim2) S.sim2 = sim2Blank();
  if (S.sim) delete S.sim;
  syncHouse();
  function simSanitize(s) {
    const cid = new Set(s.circuits.map((c) => c.id));
    s.items = s.items.filter((i) => cid.has(i.c));
    const by = new Map(s.items.map((i) => [i.id, i]));
    s.items.forEach((i) => {
      const p = i.par != null ? by.get(i.par) : null;
      if (!p || p.t !== "box" || p.c !== i.c || p.id === i.id) i.par = null;
      if (i.t === "lamp" && i.sw != null) {
        const w = by.get(i.sw);
        if (!w || w.t !== "sw" || w.c !== i.c) i.sw = null;
      }
      if (i.t === "lamp" && i.sw2 != null) {
        const a = by.get(i.sw), w = by.get(i.sw2);
        if (!a || a.v !== "c" || !w || w.t !== "sw" || w.v !== "c" || w.c !== i.c || w.id === a.id) i.sw2 = null;
      }
      if (i.t === "lamp" && i.k >= 1 && !((by.get(i.sw) || {}).v === "t" || i.k === 1 && (by.get(i.sw) || {}).v === "d")) i.k = 0;
    });
    s.items.forEach((i) => {
      let x = i, n = 0;
      while (x && x.par != null && n < 80) {
        x = by.get(x.par);
        n++;
      }
      if (n >= 80) i.par = null;
    });
  }
  function tabW(s) {
    return Math.max(0.9, Math.max(2 + 2 * simDRs(s).length, s.circuits.length) * 0.09 + 0.2) + 0.16;
  }
  function tabExit(ci, W) {
    return [TX + W / 2 - 0.115 - ci * 0.07, 1.975, 0.13];
  }
  const isWL = (it) => it.t === "lamp" && !!it.n && Math.abs(it.n[1]) < 0.5;
  function anchor(it) {
    if (it.t === "lamp" && !isWL(it)) return [it.p[0], WH + flY(it.p[1]) * FH, it.p[2]];
    const n = it.n || [0, 0, 1];
    return [it.p[0] + n[0] * 0.035, it.p[1] + (it.t === "box" ? 0 : 0.07), it.p[2] + n[2] * 0.035];
  }
  function simConds(it) {
    if (it.t === "sw") return it.v === "t" ? ["F", "R", "R2", "R3"] : it.v === "d" ? ["F", "R", "R2"] : it.v === "c" ? ["C", "V1", "V2"] : ["F", "R"];
    if (it.t === "lamp" && it.sw != null) return ["R", "N", "PE"];
    return ["F", "N", "PE"];
  }
  function simEdges(s) {
    const by = new Map(s.items.map((i) => [i.id, i])), W = tabW(s), out = [];
    const TAB = { p: [TX, 1.5, 0.066], n: [0, 0, 1] };
    const keyOf = (p, n) => {
      if (!n) return null;
      if (Math.abs(n[1]) > 0.5) return "ceil" + flY(p[1]) + ":" + p[0] + "," + p[2];
      const rm = roomOf(p[0] + n[0] * 0.3, p[2] + n[2] * 0.3, flY(p[1]));
      return (Math.abs(n[0]) > 0.5 ? "x" + Math.round(p[0] * 10) / 10 : "z" + Math.round(p[2] * 10) / 10) + "|" + (rm ? rm.id : "");
    };
    const doorBetween = (a, b) => {
      const ax = Math.abs(a.n[0]) > 0.5 ? "x" : "z", w = ax === "x" ? a.p[0] : a.p[2], t0 = Math.min(ax === "x" ? a.p[2] : a.p[0], ax === "x" ? b.p[2] : b.p[0]), t1 = Math.max(ax === "x" ? a.p[2] : a.p[0], ax === "x" ? b.p[2] : b.p[0]);
      return DOORS.some(([dx, dv, m0, m1, df]) => (df || 0) === flY(a.p[1]) && dx === ax && Math.abs(dv - w) < 0.2 && t1 > m0 && t0 < m1);
    };
    const live2 = s.items.filter((it) => !it.free && cIdx(s, it.c) >= 0 && (it.par == null || by.has(it.par)));
    const faces = /* @__PURE__ */ new Map(), addF = (bid, key, face) => {
      if (!faces.has(bid)) faces.set(bid, { top: [], bot: [] });
      faces.get(bid)[face].push(key);
    };
    const E0 = live2.map((it) => {
      const par = it.par != null ? by.get(it.par) : null, a = par ? { p: par.p, n: par.n || [0, 0, 1] } : TAB, same = (it.t !== "lamp" || isWL(it)) && keyOf(a.p, a.n) === keyOf(it.p, it.n || [0, 0, 1]) && !doorBetween(a, it);
      const e = { it, par, same };
      const aY = par ? par.p[1] : 1.975, cl = (b) => b.n && b.n[1] < -0.5;
      if (par) {
        e.pf = !cl(par) && same && it.p[1] < par.p[1] ? "bot" : "top";
        addF(par.id, it.id + "o", e.pf);
      }
      if (it.t === "box") {
        e.cf = !cl(it) && same && aY < it.p[1] ? "bot" : "top";
        addF(it.id, it.id + "i", e.cf);
      }
      return e;
    });
    const portOf = (bx, key, face) => {
      const L = faces.get(bx.id)[face], cnt = L.length, i = L.indexOf(key), sp = Math.min(0.045, 0.16 / Math.max(1, cnt)), o = (i - (cnt - 1) / 2) * sp, a = anchor(bx), n = bx.n || [0, 0, 1], ceil = n[1] < -0.5, t = ceil ? [1, 0, 0] : [n[2], 0, -n[0]];
      return [a[0] + t[0] * o, ceil ? (s.inst === "vista" ? WH - 0.06 : WH + 0.02) + flY(bx.p[1]) * FH : a[1] + (face === "top" ? 0.07 : -0.07), a[2] + t[2] * o];
    };
    const lanesF = [[], []], vista = s.inst === "vista", dw = vista ? 0 : -0.075, sh = (P, n) => n ? [P[0] + n[0] * dw, P[1] + (n[1] < -0.5 ? 0 : n[1] * dw), P[2] + n[2] * dw] : P;
    E0.forEach((e) => {
      const it = e.it, ci = cIdx(s, it.c), par = e.par;
      const A0 = par ? portOf(par, it.id + "o", e.pf) : tabExit(ci, W), B0 = it.t === "box" ? portOf(it, it.id + "i", e.cf) : anchor(it), A = sh(A0, par ? par.n && par.n[1] < -0.5 ? null : par.n || [0, 0, 1] : [0, 0, 1]), B = sh(B0, it.t === "lamp" || it.n && it.n[1] < -0.5 ? null : it.n);
      let raw;
      if (it.route && it.route.length) {
        raw = [A];
        let pv = A;
        it.route.concat([B]).forEach((q) => {
          if (q[1] > pv[1] + 1e-3) raw.push([pv[0], q[1], pv[2]], [q[0], q[1], pv[2]], q);
          else if (q[1] < pv[1] - 1e-3) raw.push([q[0], pv[1], pv[2]], [q[0], pv[1], q[2]], q);
          else raw.push([q[0], q[1], pv[2]], q);
          pv = q;
        });
      } else if (e.same) {
        const aP = !!par, bP = it.t === "box", ym = aP && bP ? (A[1] + B[1]) / 2 : A[1];
        raw = [A, [A[0], ym, A[2]], [B[0], ym, B[2]], B];
      } else {
        const fa = par ? flY(par.p[1]) : 0, fb = flY(it.p[1]), lanes = lanesF[fb];
        const sg = [["x", A[2], A[0], B[0]], ["z", B[0], A[2], B[2]]].map(([ax, c2, a2, b2]) => [ax, c2, Math.min(a2, b2), Math.max(a2, b2)]).filter((q) => q[3] - q[2] > 0.02);
        let ln = 0;
        while (ln < 9 && sg.some((q) => (lanes[ln] || []).some((r2) => r2[0] === q[0] ? Math.abs(r2[1] - q[1]) < 0.09 && Math.min(r2[3], q[3]) - Math.max(r2[2], q[2]) > 0.02 : r2[1] > q[2] + 0.03 && r2[1] < q[3] - 0.03 && q[1] > r2[2] + 0.03 && q[1] < r2[3] - 0.03))) ln++;
        (lanes[ln] = lanes[ln] || []).push(...sg);
        const hy = (f) => (vista ? WH - 0.05 - 0.07 * Math.min(ln, 4) - 0.012 * (ci % 3) : YC + 0.07 * ln + 0.015 * (ci % 3)) + f * FH, y = hy(fb);
        if (fa === fb) raw = [A, [A[0], y, A[2]], [B[0], y, A[2]], [B[0], y, B[2]], B];
        else {
          const MX = TX + W / 2 + 0.35 + 0.05 * (ci % 4), MZ = 0.09, ya = hy(fa);
          raw = [A, [A[0], ya, A[2]], [MX, ya, A[2]], [MX, ya, MZ], [MX, y, MZ], [B[0], y, MZ], [B[0], y, B[2]], B];
        }
      }
      raw = [A0].concat(raw, [B0]);
      const pts = [raw[0]];
      raw.slice(1).forEach((q) => {
        const l = pts[pts.length - 1];
        if (Math.hypot(q[0] - l[0], q[1] - l[1], q[2] - l[2]) > 1e-3) pts.push(q);
      });
      let L = 0;
      for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]);
      out.push({ id: it.id, from: par ? par.id : null, ci, cid: it.c, pts, L: Math.round(L * 10) / 10, it, cond: simConds(it), same: e.same, S: +it.S > 0 ? +it.S : +(s.circuits[ci] || {}).S || 2.5 });
    });
    return out;
  }
  function simEval(s) {
    simSanitize(s);
    const E = simEdges(s), ed = new Map(E.map((e) => [e.id, e])), by = new Map(s.items.map((i) => [i.id, i])), kids = /* @__PURE__ */ new Map(), f = s.fault;
    E.forEach((e) => {
      const k = e.from == null ? "T" + e.cid : e.from;
      if (!kids.has(k)) kids.set(k, []);
      kids.get(k).push(e.id);
    });
    const Wm = simWire(s), deadC = new Set(s.circuits.filter((c) => c.nc === "off").map((c) => c.id));
    const act0 = (it) => it.t === "lamp" ? it.sw != null ? lampOn(by, it) : !!it.on : !!it.on;
    const act = (it) => {
      if (deadC.has(it.c) && it.t !== "sw" && it.t !== "box") return false;
      if (!Wm) return act0(it);
      if (it.t === "lamp" && it.sw != null) return !!Wm.work[it.id];
      if (it.t === "sw" || it.t === "box") return !!it.on;
      return !!it.on && !!Wm.work[it.id];
    };
    const pw = (it, proj) => proj ? simProj(it) : act(it) ? it.t === "lamp" ? +it.P : it.t === "out" ? APPL[it.a][1] : it.t === "horno" ? +it.P : 0 : 0;
    const I = {}, Ip = {};
    const cs = s.circuits.map((c) => {
      const en = !!(s.gen.on && c.on && !(c.dr !== "none" && s.drOff[c.dr]));
      const sub = (id, proj, Tb) => {
        let x = proj || en ? pw(by.get(id), proj) / V0 : 0;
        (kids.get(id) || []).forEach((k) => x += sub(k, proj, Tb));
        Tb[id] = x;
        return x;
      };
      const roots = kids.get("T" + c.id) || [];
      let Ic = 0, Icp = 0;
      roots.forEach((r) => {
        Ic += sub(r, false, I);
        Icp += sub(r, true, Ip);
      });
      return { en, I: Ic, Ip: Icp, roots, Iz: ampOf(c.S), hot: false };
    });
    const tri = s.sys === "tri", PH = ["R", "S", "T"], Iph = { R: 0, S: 0, T: 0 }, Pph = { R: 0, S: 0, T: 0 };
    s.circuits.forEach((c, k) => {
      const f2 = PH.includes(c.ph) ? c.ph : "R";
      Iph[f2] += cs[k].I;
      Pph[f2] += cs[k].Ip * V0;
    });
    const It = tri ? Math.max(Iph.R, Iph.S, Iph.T) : cs.reduce((a, x) => a + x.I, 0), La = +s.alim.L || 0, Sa = +s.alim.S || 6, dVa = (tri ? 1 : 2) * RHO * La * It / Sa, Vtab = s.gen.on ? V0 - dVa : 0;
    const Pp = cs.reduce((a, x) => a + x.Ip * V0, 0), fd = fdViv(Pp), Idm = tri ? Math.max(Pph.R, Pph.S, Pph.T) * (Pp ? fd.Pd / Pp : 0) / V0 : fd.Pd / V0, dVap = (tri ? 1 : 2) * RHO * La * Idm / Sa;
    const V = {}, Vp = {};
    s.circuits.forEach((c, k) => {
      const x = cs[k];
      x.hot = x.en && x.I > x.Iz;
      const down = (id, Vin, proj) => {
        const e = ed.get(id), Ie = (proj ? Ip : I)[id] || 0;
        let dv = 2 * RHO * e.L * Ie / e.S;
        if (!proj && f && f.type === "floja" && (f.box != null && f.box === id || f.box == null && f.c === c.id && e.from == null)) dv += 1.6 * Ie;
        const Vo = Vin - dv;
        (proj ? Vp : V)[id] = Vo;
        (kids.get(id) || []).forEach((kk) => down(kk, Vo, proj));
      };
      x.roots.forEach((r) => {
        down(r, x.en ? Vtab : 0, false);
        down(r, V0 - dVap, true);
      });
      x.dvp = 0;
      s.items.forEach((it) => {
        if (it.c === c.id && Vp[it.id] != null && simProj(it) > 0) x.dvp = Math.max(x.dvp, (V0 - Vp[it.id]) / V0 * 100);
      });
    });
    s.items.forEach((it) => {
      if (V[it.id] != null && (deadC.has(it.c) && it.t !== "sw" || Wm && !Wm.live[it.id])) V[it.id] = 0;
    });
    let shock = false;
    if (f && f.type === "carcasa") {
      const it = by.get(f.item);
      if (it) {
        const k = cIdx(s, it.c);
        shock = !!(cs[k] && cs[k].en && it.on && (s.circuits[k].dr === "none" || s.circuits[k].pe === false));
      }
    }
    return { E, ed, by, kids, cs, It, dVa, Vtab, V, I, Vp, Ip, fd, dVap, act, shock, W: Wm, deadC, tri, Iph, Pph, Idm };
  }
