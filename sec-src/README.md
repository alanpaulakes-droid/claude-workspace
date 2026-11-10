# Curso SEC · RIC — fuentes

Se arma en un solo archivo: `./sec-src/build.sh` → `CUESTIONARIO_SEC_RIC.html`.

| Archivo | Contenido |
|---|---|
| head.html | HTML base y CSS (modo claro/oscuro, impresión, responsive) |
| data-ric.js | Fichas RIC 01–19, glosario y lista de datos ⚠ por verificar |
| data-preg.js | Banco de preguntas: `Q(id, ric, dificultad, enunciado, opciones, correcta, explicación, cita, imagen?)` |
| data-svg.js | Diagramas SVG (`FIG`) e imágenes de preguntas (`QIMG`) |
| data-cont.js | Teoría, práctica, proceso del proyecto, pruebas, casos, checklist, enlaces |
| app.js | Router, vistas, quiz, simulador, calculadoras, buscador, localStorage |

Convenciones de texto: `«RIC N°xx, punto»` se muestra como cita; `⚠` como «verificar en pliego vigente».
