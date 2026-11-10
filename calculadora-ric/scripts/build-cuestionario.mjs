// Compila el cuestionario de certificación SEC a un solo HTML (usa el motor y el banco de la calculadora).
// Uso: npm run build:cuestionario  ->  dist/CUESTIONARIO_SEC_RIC.html y copia en ../CUESTIONARIO_SEC_RIC.html
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const res = await build({
  entryPoints: [join(ROOT, "src/cuestionario/app.js")],
  bundle: true,
  format: "iife",
  target: "es2019",
  charset: "utf8",
  minify: true,
  write: false,
  legalComments: "none",
});
const js = res.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const css = readFileSync(join(ROOT, "src/cuestionario/estilos.css"), "utf8");
const out = readFileSync(join(ROOT, "src/cuestionario/index.html"), "utf8")
  .replace("/*@CSS*/", () => css)
  .replace("/*@JS*/", () => js);
mkdirSync(join(ROOT, "dist"), { recursive: true });
const dist = join(ROOT, "dist", "CUESTIONARIO_SEC_RIC.html");
writeFileSync(dist, out);
if (!process.argv.includes("--no-copy")) copyFileSync(dist, join(ROOT, "..", "CUESTIONARIO_SEC_RIC.html"));
console.log(`OK cuestionario · ${(out.length / 1024).toFixed(0)} KB -> ${dist}`);
