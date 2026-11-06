// Compila la app a un solo HTML autocontenido (funciona sin servidor en iPhone y Android).
// Uso: npm run build  ->  dist/CALCULADORA_RIC.html y copia en ../CALCULADORA_RIC.html
import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { build } from "esbuild";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const rd = (p) => readFileSync(join(ROOT, p), "utf8");

// 1. Motor de cálculo y datos normativos (TypeScript) -> IIFE global RICEngine
const eng = await build({
  entryPoints: [join(ROOT, "src/engine/index.ts")],
  bundle: true,
  format: "iife",
  globalName: "RICEngine",
  target: "es2019",
  charset: "utf8",
  write: false,
  legalComments: "none",
});
const engine = eng.outputFiles[0].text;

// 2. Interfaz: secciones en orden numérico, dentro de una sola clausura
const appDir = join(ROOT, "src/app");
const parts = readdirSync(appDir)
  .filter((f) => /^\d\d-.*\.js$/.test(f))
  .sort();
const app = parts.map((f) => readFileSync(join(appDir, f), "utf8")).join("");

// 3. Plantilla
const out = rd("src/index.html")
  .replace("/*@CSS*/", () => ["app.css", "tokens.css", "components.css"].map((f) => rd("src/styles/" + f)).join(""))
  .replace("/*@THREE*/", () => rd("src/vendor/three.min.js"))
  .replace("/*@ENGINE*/", () => engine)
  .replace("/*@APP*/", () => app);
if (/\/\*@(CSS|THREE|ENGINE|APP)\*\//.test(out)) throw new Error("Quedó un marcador sin reemplazar en la plantilla");

// 4. Revisión de sintaxis del script principal antes de escribir
const tmp = join(ROOT, "dist", ".app-check.js");
mkdirSync(join(ROOT, "dist"), { recursive: true });
writeFileSync(tmp, engine + "\n(function() {\n" + app + "})();\n");
execFileSync(process.execPath, ["--check", tmp], { stdio: "inherit" });

const dist = join(ROOT, "dist", "CALCULADORA_RIC.html");
writeFileSync(dist, out);
// Sitio publicable (PWA): index.html + manifest + service worker + ícono
writeFileSync(join(ROOT, "dist", "index.html"), out);
for (const f of ["manifest.webmanifest", "sw.js", "icon.svg"])
  copyFileSync(join(ROOT, "src/pwa", f), join(ROOT, "dist", f));
if (!process.argv.includes("--no-copy")) {
  copyFileSync(dist, join(ROOT, "..", "CALCULADORA_RIC.html"));
  // versión liviana para teléfono (se genera desde el HTML principal)
  execFileSync("python3", [join(ROOT, "..", "herramientas", "build_tablero_practica.py")], { stdio: "inherit" });
}
console.log(`OK ${parts.length} secciones · ${(out.length / 1024 / 1024).toFixed(2)} MB -> ${dist}`);
