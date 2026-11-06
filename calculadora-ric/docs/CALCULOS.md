# Referencia de cálculos

Datos: `src/data/ric.json` (versión `2021.1`), tomados de los pliegos publicados por la SEC
(Res. Ex. N° 33.877/2020): RIC N°03 V1.1, N°04, N°05, N°06 y N°10. Lo marcado como **criterio usual** no
es exigencia textual de los pliegos y se puede cambiar.

| Cálculo                       | Función del motor        | Fórmula o regla                                                                     | Referencia                                  |
| ----------------------------- | ------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------- |
| Corriente de diseño           | `corriente`              | I = P / (V·cos φ); trifásico I = P / (√3·VL·cos φ)                                  | —                                           |
| Caída de tensión              | `caidaTension`           | ΔV = k·ρ·L·I / S, k = 2 (mono) o √3 (tri); ΔV % = ΔV / V × 100                      | RIC N°03, 5.1.3                             |
| Límite de caída               | `RIC.caida`              | 3 % por tramo; 5 % total al punto más desfavorable                                  | RIC N°03, 5.1.3                             |
| Demanda de vivienda           | `fdViv`                  | 100 % de los primeros 3 kW, 35 % de 3 a 120 kW, 25 % sobre 120 kW                   | RIC N°03, Tabla 3.1                         |
| Simultaneidad de viviendas    | `fsViv`                  | Tabla para 1 a 21 viviendas; n > 21: (15,3 + (n − 21)·0,5) / n                      | RIC N°03, Tabla 3.2                         |
| Protección del circuito       | `chooseIn`               | In ≥ 1,1·I y P ≤ 0,9·V·In·cos φ; calibre comercial inmediato superior               | RIC N°10, 5.1.4.1 y 5.1.4.4                 |
| Potencia por punto            | `RIC.circuitos`          | 100 W por centro si no se conoce; 250 W por enchufe                                 | RIC N°10, 5.1.4.5 y 5.1.4.6                 |
| Capacidad de corriente Iz     | `ampTable`               | Columna por cable (70/90 °C) y método (A1, A2, B1, B2, D1, D2, E)                   | RIC N°04, Tabla 4.4                         |
| Factor por temperatura        | `fTemp`                  | ft según ambiente                                                                   | RIC N°04, Tabla 4.7                         |
| Factor por agrupamiento       | `fnRIC`, `ncAct`, `fGrp` | fn por conductores activos (mono: fase y neutro; tri: el neutro no cuenta)          | RIC N°04, Tabla 4.6 y 6.2.4                 |
| Sección del conductor         | `chooseS`                | La menor S con S ≥ mínima, Iz·fc ≥ In y ΔV % ≤ límite                               | RIC N°04 5.4; N°10 5.1.5; N°03 5.1.3        |
| Secciones mínimas             | `RIC.seccionMin`         | Iluminación 1,5; enchufes y mixtos 2,5; subalimentador 2,5; alimentador 4 mm²       | RIC N°04, 5.4; RIC N°03, 5.1.2              |
| Llenado de tubos              | `llenadoMax`             | 50 % un conductor; 33 % dos o más; 60 % uniones de tableros ≤ 1 m; la tierra cuenta | RIC N°04, Tabla 4.21                        |
| Tierra de protección          | `rProteccionMax`         | R ≤ UL / IΔn; UL = 50 V seco, 24 V húmedo                                           | RIC N°05 (RA·Id ≤ UL)                       |
| Tierra de servicio            | `evalTierraServicio`     | ≤ 20 Ω; hasta 80 Ω solo con las condiciones de 6.2.1 o 6.2.2                        | RIC N°06, 6.1 y 6.2                         |
| Resistencia de una pica       | `picaVertical`           | R = ρ / L. Varias picas en paralelo: factor k de utilización (criterio usual)       | RIC N°06, Tabla 6.4                         |
| Cortocircuito mínimo y máximo | `iccCalc`                | Imín = 0,95·U0 / (Zs + 1,5·(Ra + Rc)); Imáx = U0 / (Zs + Ra); k = 115               | **Criterio usual** (no está en los pliegos) |
| Colores de conductores        | `RIC.colores`            | Fase 1 azul, fase 2 negro, fase 3 rojo, neutro blanco, PE verde o verde/amarillo    | RIC N°04, 5.32                              |
| Resistividad del cobre        | parámetro `rho`          | 0,018 Ω·mm²/m (criterio usual); 100 % IACS = 0,01724 a 20 °C                        | RIC N°04, Tabla 4.1                         |

## Demostraciones (`src/engine/demos.ts`)

| Función                | Qué entrega                                                              | Referencia                  |
| ---------------------- | ------------------------------------------------------------------------ | --------------------------- |
| `serieCaida`           | Puntos (L, ΔV %) para graficar la caída a lo largo del tramo             | RIC N°03, 5.1.3             |
| `largoMaxCaida`        | L máx = lím/100 · V · S / (k · ρ · I)                                    | RIC N°03, 5.1.3             |
| `coordinacion`         | Is ≤ In ≤ Iz con In ≥ 1,1 · Is                                           | RIC N°10, 5.1.4.1 y 5.1.5.1 |
| `sobrecargaSinDisparo` | 1,45 · In (corriente convencional de disparo, IEC 60898) frente al cable | Criterio usual (IEC)        |

Los casos «correcto vs incorrecto» que usan fugas de 7 mA o 100 mA lo indican en pantalla como valores ilustrativos.

## Fallas (`src/engine/fallas.ts`)

| Función        | Qué entrega                                                                                          | Referencia                                   |
| -------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `zonaDisparo`  | Zona de la curva (sin disparo, lenta, térmica, transición, magnética) y tiempos para k = I / In      | IEC 60898 (tiempos térmicos: criterio usual) |
| `simularFalla` | Corriente, protección que actúa, tiempo, tensión de contacto y nivel de riesgo para 4 tipos de falla | RIC N°10 5.1.3.5, 5.1.4, 5.1.5.1 · RIC N°05  |

Cortocircuito y falla a tierra usan la impedancia real del modelo 3D (red, alimentador y circuito hasta el punto más
lejano) con el método convencional (criterio usual). Sin conductor de tierra se usa 1.000 Ω para el cuerpo humano
(criterio usual).

## Aprendizaje (`src/engine/aprendizaje.ts`)

- `BANCO_SEC`: preguntas basadas en el texto de los pliegos RIC N°03, N°04, N°05, N°06 y N°10; cada una con
  explicación y numeral. Es material de práctica, no el examen oficial de la SEC.
- `programar` y `pendientes`: repaso espaciado (Leitner, cajas 1 a 5; repasos a 1, 3, 7, 14 y 30 días; criterio usual).
- `notaChilena`: nota de 1,0 a 7,0 con 60 % de exigencia para el 4,0 (criterio usual en Chile).

## Pendiente de confirmar o parametrizado

- Diámetros exteriores de cables y diámetros interiores de tubos: valores de catálogo, no normativos.
- Precios en CLP y horas de mano de obra: referencias de mercado.
- Factores del cálculo de cortocircuito (0,95 y 1,5) y k = 115: método convencional de otras normas.

## Cómo actualizar una tabla

1. Editar `src/data/ric.json` citando el pliego y numeral en `_ref`, y subir `ver`.
2. Ajustar o agregar casos en `tests/unit/motor.test.ts` con valores leídos del pliego.
3. `npm run check` y `npm run test:e2e`.
4. Si cambia el formato guardado, agregar una migración en `src/app/00-nucleo.js` y avisar en pantalla.
