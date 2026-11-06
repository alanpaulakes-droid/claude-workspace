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
