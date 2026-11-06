/**
 * Datos normativos versionados (src/data/ric.json). Cada tabla lleva su referencia `_ref` al pliego RIC.
 * Para actualizar a una nueva versión de los pliegos: editar el JSON, subir `ver` y ajustar las pruebas.
 */
import ric from "../data/ric.json";

export type TempCable = 70 | 90;
export type Metodo = "A1" | "A2" | "B1" | "B2" | "D1" | "D2" | "E";
export interface AmpCfg {
  met: Metodo | string;
  tc: TempCable | number;
}
/** Tabla sección [mm²] → corriente admisible Iz [A]. */
export type TablaIz = Record<number, number>;

export const RIC = ric;
export const SECC: readonly number[] = ric.secc;
/** Calibres comerciales de interruptores automáticos [A] (mercado, no normativo). */
export const COM: readonly number[] = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];
export const AMP_CFG_DEF: AmpCfg = { met: "A1", tc: 70 };
/** Valores de la antigua NCh Elec. 4/2003 (solo para detectar y migrar proyectos antiguos). */
export const AMP_NCH: TablaIz = {
  1.5: 15,
  2.5: 20,
  4: 25,
  6: 33,
  10: 45,
  16: 61,
  25: 83,
  35: 103,
  50: 132,
  70: 165,
  95: 197,
  120: 235,
};
