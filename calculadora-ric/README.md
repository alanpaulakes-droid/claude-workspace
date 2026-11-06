# Calculadora RIC Domiciliaria

Aplicación web para proyectar, calcular, simular y aprender instalaciones eléctricas domiciliarias según los
Pliegos Técnicos Normativos RIC (SEC, Chile). Se compila a **un solo archivo HTML** que funciona sin servidor
ni internet en iPhone, Android y computador.

> Herramienta de apoyo. No reemplaza el proyecto ni la firma de un instalador eléctrico autorizado SEC, ni la
> lectura del texto vigente de los pliegos.

## Requisitos

- Node.js 20 o superior y npm.
- Python 3 (genera la versión liviana `TABLERO_PRACTICA_RIC.html`).
- Para las pruebas e2e: Playwright con Chromium (`PLAYWRIGHT_PATH` apunta a su carpeta si no está en `node_modules`).

## Comandos

| Comando             | Qué hace                                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `npm install`       | Instala las herramientas de desarrollo.                                                                              |
| `npm run build`     | Compila `dist/CALCULADORA_RIC.html`, lo copia a la raíz del repositorio y regenera `TABLERO_PRACTICA_RIC.html`.      |
| `npm test`          | Pruebas unitarias del motor de cálculo (Vitest).                                                                     |
| `npm run test:e2e`  | Pruebas de flujos clave en el navegador (todas las páginas, migración, validación, Armar tablero, iPhone y Android). |
| `npm run typecheck` | Revisión de tipos (TypeScript).                                                                                      |
| `npm run lint`      | ESLint del motor, pruebas y scripts.                                                                                 |
| `npm run format`    | Prettier.                                                                                                            |
| `npm run check`     | Tipos + lint + pruebas unitarias + compilación (correr antes de cada commit).                                        |

## Estructura

```
calculadora-ric/
├─ src/
│  ├─ data/ric.json        Tablas normativas versionadas, cada una con su referencia al pliego
│  ├─ engine/              Motor de cálculo puro en TypeScript (sin DOM ni estado global)
│  ├─ app/NN-*.js          Interfaz, simulador 3D, juegos y enseñanza, por sección (se concatenan en orden)
│  ├─ styles/app.css       Estilos
│  ├─ vendor/three.min.js  three.js r128 (se activa solo al abrir el 3D)
│  └─ index.html           Plantilla con marcadores /*@CSS*/ /*@THREE*/ /*@ENGINE*/ /*@APP*/
├─ scripts/build.mjs       Compilación a un solo HTML
├─ tests/unit/             Pruebas del motor con casos de los pliegos
├─ tests/e2e/run.mjs       Pruebas de flujos en Chromium
└─ docs/                   Arquitectura y referencia de cálculos
```

Más detalle en [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) y [docs/CALCULOS.md](docs/CALCULOS.md).
