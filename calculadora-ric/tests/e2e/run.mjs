// Pruebas de flujos clave sobre el HTML compilado (Chromium de Playwright).
// Uso: npm run build && npm run test:e2e
// Requiere Playwright instalado globalmente (PLAYWRIGHT_PATH) o en node_modules.
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join, dirname } from "node:path";

const require = createRequire(import.meta.url);
const pwPath = process.env.PLAYWRIGHT_PATH || "/opt/node-tools/node_modules/playwright";
let chromium, devices;
try {
  ({ chromium, devices } = require(pwPath));
} catch {
  ({ chromium, devices } = require("playwright"));
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const FILE = process.env.APP_FILE || join(ROOT, "dist", "CALCULADORA_RIC.html");
const URL = pathToFileURL(FILE).href;
const results = [];
const check = (name, ok, info = "") => {
  results.push({ name, ok: !!ok, info });
  console.log(`${ok ? "✓" : "✗"} ${name}${info ? " · " + info : ""}`);
};
const goPage = (p, id) =>
  p.evaluate((i) => {
    const b = document.createElement("button");
    b.dataset.go = i;
    document.body.appendChild(b);
    b.click();
    b.parentNode.removeChild(b);
  }, id);

const browser = await chromium.launch();
try {
  // 1. Todas las páginas sin errores (escritorio) y autopruebas del motor
  {
    const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(URL);
    const ids = await p.evaluate(() => [
      ...new Set([...document.querySelectorAll("[data-go]")].map((x) => x.dataset.go)),
    ]);
    for (const id of ids) {
      await goPage(p, id);
      await p.waitForTimeout(id === "sim" ? 1200 : 120);
    }
    check(
      "Todas las páginas abren sin errores",
      errs.length === 0 && ids.length > 40,
      `${ids.length} páginas ${errs.join(" | ")}`,
    );
    await goPage(p, "sim");
    await p.waitForTimeout(1200);
    await p.click('.tpl[data-k="casa"]');
    await p.waitForTimeout(1200);
    await goPage(p, "rep");
    await p.waitForTimeout(500);
    const st = await p.evaluate(() => {
      const s = [...document.querySelectorAll("details.learn summary")]
        .map((x) => x.innerText)
        .find((x) => /pruebas/.test(x));
      return s || "";
    });
    const m = st.match(/(\d+)\/(\d+)/);
    check("Autopruebas internas del motor", m && m[1] === m[2], st);
    await p.close();
  }

  // 2. Migración de un proyecto con la tabla NCh 4/2003 y elección de método/cable
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    await p.addInitScript(() => {
      if (sessionStorage.getItem("x")) return;
      sessionStorage.setItem("x", "1");
      localStorage.setItem(
        "ric-calc-v3",
        JSON.stringify({
          proj: { nombre: "Viejo", sistema: "mono", V: 220, VL: 380, cf: 1, rho: 0.018, fc: 1, Lalim: 10, nViv: 1 },
          rooms: [],
          circuits: [],
          tierra: {},
          ens: { items: {}, aisl: [] },
          amp: { 1.5: 15, 2.5: 20, 4: 25, 6: 33, 10: 45, 16: 61, 25: 83, 35: 103, 50: 132, 70: 165, 95: 197, 120: 235 },
        }),
      );
    });
    await p.goto(URL);
    await p.waitForTimeout(400);
    const S = () => p.evaluate(() => JSON.parse(localStorage.getItem("ric-calc-v3")));
    let s = await S();
    check(
      "Migración NCh → RIC N°04 Tabla 4.4 (A1 70 °C)",
      s.amp[2.5] === 18 && s.ampCfg.met === "A1" && (await p.$(".note.migr")),
      `2,5 mm² = ${s.amp[2.5]} A`,
    );
    await goPage(p, "l_tablas");
    await p.waitForTimeout(300);
    await p.selectOption("#f_ampCfg_tc", "90");
    await p.waitForTimeout(200);
    await p.selectOption("#f_ampCfg_met", "B1");
    await p.waitForTimeout(200);
    s = await S();
    check("Cambio a THHN 90 °C método B1", s.amp[4] === 37 && s.ampCfg.tc === 90, `4 mm² = ${s.amp[4]} A`);
    check("Aviso SEC visible", await p.$(".aviso-sec"));
    await ctx.close();
  }

  // 3. Validación en vivo de campos numéricos
  {
    const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await p.goto(URL);
    await goPage(p, "t_caida");
    await p.waitForTimeout(300);
    await p.fill("#f_tools_caida_L", "abc");
    await p.waitForTimeout(150);
    const msg = await p.evaluate(() => (document.querySelector(".ferr") || {}).textContent || "");
    check("Validación en vivo de números", /solo n/.test(msg), msg);
    await p.close();
  }

  // 3b. Asistente de proyecto completo con el ejemplo, resultados y duplicar
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(URL);
    await p.click('[data-wz="start"]');
    await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelector('[data-act="askproj"][data-k="ex"]').click());
    await p.evaluate(() => document.querySelector('[data-act="doproj"]').click());
    await p.waitForTimeout(300);
    for (let i = 0; i < 6; i++) {
      await p.evaluate(() => document.querySelector('[data-wz="next"]').click());
      await p.waitForTimeout(300);
    }
    const r = await p.evaluate(() => ({
      h1: document.querySelector("h1").innerText,
      kpis: document.querySelectorAll(".kpi").length,
      svg: !!document.querySelector(".unisvg"),
      bom: document.querySelectorAll("table.bom tbody tr").length,
      ok: !!document.querySelector(".chk li.ok"),
      sw: document.documentElement.scrollWidth <= innerWidth + 1,
    }));
    check(
      "Asistente: 7 pasos hasta Resultados",
      r.h1 === "Casa ejemplo 60 m²" && r.kpis >= 8 && r.svg && r.bom > 8 && r.ok && r.sw && !errs.length,
      JSON.stringify(r),
    );
    await p.fill("#projname", "Casa ejemplo 60 m²");
    await p.evaluate(() => document.querySelector('[data-pj="save"]').click());
    await p.waitForTimeout(200);
    await p.evaluate(() => document.querySelector('[data-pj="dup"]').click());
    await p.waitForTimeout(200);
    const L = await p.evaluate(() =>
      Object.keys(
        JSON.parse(
          localStorage.getItem("ric-calc-v3-projs") ||
            localStorage.getItem(Object.keys(localStorage).find((k) => /proj/.test(k))) ||
            "{}",
        ),
      ),
    );
    check(
      "Guardar y duplicar proyecto",
      L.some((k) => /copia/.test(k)),
      L.join(" · "),
    );
    await ctx.close();
  }

  // 3c. Demostraciones interactivas
  {
    const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(URL);
    await goPage(p, "t_caida");
    await p.waitForTimeout(200);
    await p.click(".demo-link");
    await p.waitForTimeout(300);
    const before = await p.evaluate(() => document.querySelector('[data-k="mk"]').getAttribute("cy"));
    await p.evaluate(() => {
      const r = document.getElementById("dm_L");
      r.value = 80;
      r.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await p.waitForTimeout(200);
    const after = await p.evaluate(() => document.querySelector('[data-k="mk"]').getAttribute("cy"));
    check("Demo caída: el gráfico responde al largo", +after < +before, `${before} → ${after}`);
    await p.click('[data-dmt="proteccion"]');
    await p.selectOption("#dm_Sp", "1.5");
    await p.waitForTimeout(200);
    const warn = await p.evaluate(
      () =>
        /Iz ≥ In/.test(document.getElementById("dminfo").innerText) &&
        !!document.querySelector("#dminfo .chk li:not(.ok)"),
    );
    check("Demo protección: detecta cable menor que la protección", warn);
    await p.click('[data-dmt="pasos"]');
    await p.click('[data-dmp="all"]');
    await p.waitForTimeout(200);
    check("Demo paso a paso: 6 pasos visibles", (await p.$$eval(".dmstep.show", (x) => x.length)) === 6);
    await p.click('[data-dmt="comparar"]');
    let n = 0;
    for (const k of ["cable", "dr", "pe", "caida", "ducto", "drn"]) {
      await p.click(`[data-dmesc="${k}"]`);
      n += await p.$$eval(".dmside", (x) => x.length);
    }
    await p.click('[data-dmp="fallo"]');
    check(
      "Demo correcto vs incorrecto: 6 casos y simulación",
      n === 12 && !!(await p.$(".dmside.fallo")) && !errs.length,
      errs.join(" | "),
    );
    await p.close();
  }

  // 3d. Simulador 3D: simular fallas, calidad gráfica y color de fase
  {
    const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(URL);
    await goPage(p, "sim");
    await p.waitForTimeout(1500);
    await p.click('.tpl[data-k="casa"]');
    await p.waitForTimeout(1500);
    const act = {};
    for (const t of ["sobrecarga", "cortocircuito", "tierra", "subdimensionado"]) {
      await p.selectOption("#sf_tipo", t);
      await p.click('[data-sf="go"]');
      await p.waitForTimeout(400);
      act[t] = await p.evaluate(
        () => (document.getElementById("sfres").innerText.match(/Actúa: ([^·]+)/) || [])[1] || "",
      );
    }
    check(
      "Simular falla: cortocircuito → magnético, tierra → diferencial",
      /magnético/.test(act.cortocircuito) && /diferencial/.test(act.tierra) && /térmico/.test(act.sobrecarga),
      JSON.stringify(act),
    );
    await p.click('[data-sf="reset"]');
    await p.waitForTimeout(300);
    const on = await p.evaluate(() =>
      JSON.parse(localStorage.getItem("ric-calc-v3")).sim2.circuits.every((c) => c.on !== false),
    );
    check("Restablecer deja todos los circuitos encendidos", on);
    await p.click('[data-sq="alta"]');
    await p.waitForTimeout(1500);
    await p.click('[data-sfase="azul"]');
    await p.waitForTimeout(1500);
    const ok3d = await p.evaluate(
      () => !!document.getElementById("simcv") && !document.querySelector("#simwrap .empty"),
    );
    check("3D en calidad alta (sombras) y fase azul sin errores", ok3d && !errs.length, errs.join(" | "));
    await p.click('[data-sq="auto"]');
    await p.click('[data-sfase="rojo"]');
    await p.close();
  }

  // 3e. Ruta de aprendizaje: niveles, repaso espaciado, contra reloj, simulacro SEC y logros
  {
    const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(URL);
    await goPage(p, "ruta");
    await p.waitForTimeout(200);
    check("Ruta: 5 niveles", (await p.$$eval(".nivel", (x) => x.length)) === 5);
    const correcta = () =>
      p.evaluate(() => {
        const q = document.querySelector(".sesq").innerText;
        const B = RICEngine.BANCO_SEC.q.find((x) => x.q === q);
        return B ? B.a : 0;
      });
    await p.click('[data-aprq="1"]');
    let n = 0;
    while ((await p.$("[data-sesa]")) && n < 30) {
      const a = await correcta();
      await p.click(`[data-sesa="${(a + 1) % 3}"]`);
      await p.click('[data-ses="next"]');
      n++;
    }
    const apr = () => p.evaluate(() => JSON.parse(localStorage.getItem("ric-calc-v3-apr") || "{}"));
    let A = await apr();
    check(
      "Errores del nivel entran al repaso",
      Object.keys(A.rep).length === n && n > 5,
      `${Object.keys(A.rep).length}/${n}`,
    );
    await p.evaluate(() => {
      const k = "ric-calc-v3-apr",
        X = JSON.parse(localStorage.getItem(k));
      Object.values(X.rep).forEach((t) => (t.due = 0));
      localStorage.setItem(k, JSON.stringify(X));
    });
    await p.reload();
    await goPage(p, "ruta");
    await p.waitForTimeout(150);
    await p.click('[data-aprt="rep"]');
    await p.click('[data-aprg="rep"]');
    for (let i = 0; i < 20 && (await p.$("[data-sesa]")); i++) {
      await p.click(`[data-sesa="${await correcta()}"]`);
      await p.click('[data-ses="next"]');
    }
    A = await apr();
    check(
      "Repaso: aciertos suben de caja (Leitner)",
      Object.values(A.rep).every((t) => t.box === 2),
    );
    await p.click('[data-ses="exit"]');
    await p.click('[data-aprt="reloj"]');
    await p.click('[data-aprg="reloj"]');
    for (let r = 0; r < 5; r++) {
      await p.click('[data-rj="pIn"][data-v="16"]');
      await p.click('[data-rj="pS"][data-v="2.5"]');
      await p.click('[data-rj="ok"]');
      await p.click('[data-rj="next"]');
    }
    check(
      "Contra reloj: partida de 5 circuitos con puntaje",
      /Puntaje/.test(await p.evaluate(() => document.querySelector(".kpis").innerText)),
    );
    await p.click('[data-aprt="sec"]');
    await p.click('[data-aprg="sec"]');
    for (let i = 0; i < 25; i++) {
      await p.click(`[data-sesa="${await correcta()}"]`);
      await p.click('[data-ses="next"]');
    }
    A = await apr();
    check(
      "Simulacro SEC: 25/25 → nota 7,0 y logros",
      A.sec.best === 7 && !!A.logros.sec6 && !errs.length,
      errs.join(" | "),
    );
    await p.close();
  }

  // 4. Armar tablero: soluciones de los niveles aprueban
  {
    const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await p.goto(URL);
    await goPage(p, "tg");
    await p.waitForTimeout(300);
    for (const k of ["n1", "n2", "n3"]) {
      await p.evaluate((k) => document.querySelector(`[data-tg="lv"][data-k="${k}"]`).click(), k);
      await p.waitForTimeout(200);
      await p.evaluate(() => document.querySelector('[data-tg="sol"]')?.click());
      await p.waitForTimeout(250);
      await p.evaluate(() => document.querySelector('[data-tg="check"]')?.click());
      await p.waitForTimeout(250);
      const ok = await p.evaluate(() => /Tablero perfecto/.test(document.getElementById("tgwrap").innerText));
      check(`Armar tablero ${k}: la solución aprueba`, ok);
    }
    await p.close();
  }

  // 5. Teléfono (iPhone y Android): sin scroll horizontal y "Grande" del 3D
  for (const [nombre, dev] of [
    ["iPhone 13", devices["iPhone 13"]],
    ["Pixel 5", devices["Pixel 5"]],
  ]) {
    const ctx = await browser.newContext({ ...dev, defaultBrowserType: undefined });
    const p = await ctx.newPage();
    if (nombre.startsWith("iPhone"))
      await p.addInitScript(() => {
        Element.prototype.requestFullscreen = undefined;
        Element.prototype.webkitRequestFullscreen = undefined;
      });
    await p.goto(URL);
    await goPage(p, "sim");
    await p.waitForTimeout(1500);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
    await p.evaluate(() => document.querySelector('[data-sa="fs"]').click());
    await p.waitForTimeout(500);
    const fs = await p.evaluate(() => {
      const r = document.getElementById("simwrap").getBoundingClientRect();
      return Math.round(r.width) === innerWidth && Math.round(r.height) >= innerHeight - 2;
    });
    check(`${nombre}: sin scroll horizontal y pantalla completa del 3D`, sw && fs);
    await ctx.close();
  }
} finally {
  await browser.close();
}
const bad = results.filter((r) => !r.ok);
console.log(`\n${results.length - bad.length}/${results.length} pruebas e2e correctas`);
process.exit(bad.length ? 1 : 0);
