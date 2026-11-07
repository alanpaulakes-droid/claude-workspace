# Fuente de «La Biblia del Ingeniero Industrial»

`BIBLIA_INGENIERO_INDUSTRIAL.html` (raíz del repo) es un archivo **generado**. No se edita a mano: se editan los módulos de `src/` y se compila.

## Compilar

```bash
bash biblia-src/build.sh          # genera BIBLIA_INGENIERO_INDUSTRIAL.html
bash biblia-src/build.sh --test   # además genera tests/test.html y tests/testx.html
```

El script une los módulos en un orden fijo, valida la sintaxis con `node --check` y antepone `head.html`.
Todo el código corre dentro de una sola función `(() => { … })();`: los nombres `const` de nivel superior deben ser únicos entre todos los módulos.

## Mapa de módulos (`src/`)

| Archivo | Contenido |
|---|---|
| `p1.html` | HTML base, CSS (temas claro/oscuro, impresión) y apertura del script |
| `p2.js` | Estado y guardado (`localStorage` en try/catch) |
| `x1.js`, `x2.js`, `x4.js` | Motor de fórmulas `M()`, gráficos y diagramas base |
| `p3.js` – `p6b.js` | Registro de calculadoras `C[id]` (campos y cálculo) |
| `px.js` | Exportación a Word y PDF |
| `g*`, `e*`, `i*`, `c*`, `z*`, `u*`, `s*`, `d*`, `f*`, `o*`, `q*`, `v*`, `y*` | Contenido: guías, ramos, saberes, industrias, simuladores |
| `p7.js` | Formulario, glosario, tablas, KPI |
| `m1.js` – `m4.js` | Malla UNAB y páginas de ramo |
| `w1.js` – `w6.js` | Mejoras de contenido y validación en vivo |
| `w7.js` | F1a: navegación por área/trimestre, favoritos, KaTeX `TX()`, componentes `UI` |
| `w8.js` | F1b: conversión a KaTeX y plantilla de 8 bloques `tpl8HTML` |
| `w9.js`, `wa1.js` – `wa9.js` | F2: contenido por área en el registro `T2` |
| `wa0.js` | F4: diagramas `FC()` (flujo) y `LAYD()` (layout) |
| `wb1.js` | F3: núcleo de cálculo `NUC` y validación `RULES` |
| `wb2.js` | F3: 33 pruebas con resultado conocido (`TEST3`) |
| `wc1.js` | F4: Ishikawa, red CPM, controles deslizantes, recálculo en vivo |
| `wc2.js` | F5: exportar fichas, formulario y glosario; impresión; accesibilidad |
| `wd1.js` – `wd4.js` | Bloques que faltaban en los temas (Fundamentos, ramos, saberes, desarrollo personal, gestión, informes, ofimática). Registros `T2` parciales: solo agregan bloques |
| `p8.js` | Páginas, navegación, eventos y `render()` (va al final) |

## Pruebas (`tests/`)

Requieren Node y Playwright con Chromium, más `npm install` dentro de `tests/` (axe-core y pdfmake). Se ejecutan desde `tests/` después de `build.sh --test`.

| Script | Qué verifica | Resultado esperado |
|---|---|---|
| `t3.js` | 33 casos de las calculadoras | `total 33 ok 33` |
| `snap.js salida.json` | resultados numéricos de 85 casos | igual a `snap_ref.json` |
| `t.js` | todas las páginas y calculadoras | 7 líneas `BAD` conocidas |
| `e.js` | exportación de memorias de cálculo | `no errors` |
| `m360.js` | desborde horizontal a 360 px | `overflow 0` |
| `keep.js` | contenido conservado tras la plantilla | ningún `miss=[…]` con elementos |
| `aud3.js` | datos aleatorios en todas las calculadoras | `FUZZ 0` |
| `ax5.js` | accesibilidad WCAG AA (necesita `axe-core`) | sin violaciones |
| `perf5.js` | carga, render por página y errores de consola | `ERR [] 0` |
| `ex6.js` | exportación de fichas, formulario y glosario (necesita `pdfmake@0.2.7`) | sin errores |
| `pend.js` | bloques pendientes por tema | `con pendientes 0` |
| `kx5.js ruta/katex.min.js ids` | fórmulas TeX de los temas indicados | `bad 0` |
| `txt5.js`, `sp5.py` | extracción de texto y revisión ortográfica | lista de candidatos |
