# Arquitectura

## Principios

1. **Un solo HTML de salida.** La app se comparte como archivo y se publica como artifact; debe abrir sin
   servidor en iPhone (Safari y app de Claude) y Android (Chrome). Por eso la compilación incrusta todo.
2. **Motor separado de la interfaz.** Todo cálculo normativo vive en `src/engine` como funciones puras y
   tipadas. La interfaz solo lee datos del usuario, llama al motor y presenta el desarrollo.
3. **Datos normativos versionados.** `src/data/ric.json` contiene las tablas con su referencia (`_ref`) al
   pliego y numeral. Nada normativo se escribe a mano en la interfaz.
4. **Sin romper proyectos guardados.** El estado se guarda en `localStorage` (`ric-calc-v3`). Si el formato
   cambia, se agrega una función de migración (ver `ampMigrate` en `src/app/00-nucleo.js`).

## Capas

| Capa        | Ubicación           | Responsabilidad                                                                                |
| ----------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| Datos       | `src/data/ric.json` | Tablas RIC 4.4, 4.6, 4.7, 4.21, 3.1, 3.2; límites de caída, secciones mínimas, tierra, colores |
| Motor       | `src/engine/*.ts`   | Conductores, demanda, protecciones, caída, tierra, cortocircuito, números                      |
| Interfaz    | `src/app/NN-*.js`   | Páginas, formularios, resultados paso a paso, simulador 3D, juegos, curso                      |
| Compilación | `scripts/build.mjs` | esbuild empaqueta el motor como `RICEngine` (IIFE) y concatena la interfaz                     |

El motor se expone en la página como el objeto global `RICEngine`. La interfaz lo usa así:

```js
const { ampTable, fdViv, fsViv, chooseIn } = RICEngine;
const chooseS = (o) => RICEngine.chooseS(Object.assign({ amp: S.amp }, o));
```

## Secciones de la interfaz (`src/app`)

| Archivo                        | Contenido                                                                                                |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `00-nucleo.js`                 | Estado, guardado, migración, utilidades de formato y formularios, circuitos                              |
| `01-proyecto.js`               | Páginas del proyecto en 8 etapas                                                                         |
| `02-calculadoras.js`           | Calculadoras básicas, glosario y tablas                                                                  |
| `03-cuadro.js`                 | Cuadro de carga                                                                                          |
| `04-portadas-ilustraciones.js` | Portadas y figuras explicativas                                                                          |
| `05-modelo-vivienda.js`        | Modelo de la vivienda y del simulador, evaluación eléctrica                                              |
| `06-sim-cableado.js`           | Cableado, cajas, ductos, mediciones y colocación                                                         |
| `07-sim-inspector.js`          | Inspector RIC, desafíos y barra de colocación                                                            |
| `08-panel-practica.js`         | Pared de práctica y examen práctico                                                                      |
| `09-sim-interfaz.js`           | Hojas, errores, pantalla completa, carga diferida de three.js                                            |
| `10-sim-3d.js`                 | Escena 3D (cámara, materiales, construcción de la escena)                                                |
| `11-sim-eventos.js`            | Eventos táctiles y de teclado del 3D                                                                     |
| `12-calculadoras-avanzadas.js` | Curvas, factores, cortocircuito, EV, FV, energía, subtablero, momentos                                   |
| `13-reportes.js`               | Plantillas, informes, materiales, plano, memoria, autopruebas                                            |
| `14-juego-tablero.js`          | Juego «Armar tablero»                                                                                    |
| `15-curso.js`                  | Curso, quiz y ejercicios                                                                                 |
| `16-precios-vivienda.js`       | Precios en CLP y diseñador de vivienda                                                                   |
| `17-informe-etapas.js`         | Informe técnico, lámina SEC y etapas                                                                     |
| `18-navegacion.js`             | Páginas, navegación, render, validación en vivo y eventos globales                                       |
| `19-asistente.js`              | Asistente guiado (7 pasos), resultados, unilineal del proyecto, materiales y exportación                 |
| `20-demos.js`                  | Demostraciones: caída vs distancia, corriente vs protección, paso a paso animado, correcto vs incorrecto |
| `21-sim-fallas.js`             | Calidad gráfica del 3D (auto, baja, media, alta con sombras), color de fase y «Simular una falla»        |
| `22-aprender.js`               | Ruta de aprendizaje: 5 niveles, repaso espaciado, contra reloj, simulacro tipo SEC y logros              |
| `23-iconos.js`                 | Íconos SVG propios y reemplazo automático de símbolos antiguos en pestañas, menú, portada y 3D           |
| `99-inicio.js`                 | Arranque: idioma, enlace «Saltar al contenido», registro de la PWA y primer render                       |

Las secciones comparten una sola clausura (se concatenan en orden numérico), así que el orden importa: una
sección puede usar lo declarado en otra solo después de que la app terminó de cargar.

## Diseño

- `src/styles/tokens.css`: colores (claro y oscuro), tipografía, espaciado, radios, sombras y foco.
- `src/styles/theme.css`: identidad visual v3 «Voltaje» (azul eléctrico y ámbar, encabezado oscuro, barra de pestañas flotante, colores por categoría, portada con héroe). Se aplica al final.
- `src/styles/components.css`: botones, campos, tarjetas, inicio por modos, asistente y unilineal. Se aplica
  después de `app.css`, así que manda sobre los estilos antiguos.
- Objetivos táctiles de 44 px como mínimo, campos de 16 px (evita el zoom de iPhone) y contraste AA en ambos temas.

## App instalable (PWA)

`npm run build` deja en `dist/` un sitio publicable: `index.html`, `manifest.webmanifest`, `sw.js` e `icon.svg`.
Al publicarlo en un sitio propio con https (por ejemplo GitHub Pages), la app se puede instalar y funciona sin
conexión. Dentro del visor de claude.ai o abierto como archivo, el registro se omite y todo sigue funcionando.

## Calidad

- `npm run check` antes de cada commit; `npm run test:e2e` antes de publicar.
- La compilación revisa la sintaxis (`node --check`) y falla si queda un marcador sin reemplazar.
- La app trae además autopruebas internas visibles en Reportes («Verificación del motor de cálculo»).

## Siguientes pasos de la migración

- Mover más cálculos de la interfaz al motor (cuadro de carga, momentos, subtablero, FV, EV).
- Convertir secciones de la interfaz a módulos ES con importaciones explícitas, una por una.
