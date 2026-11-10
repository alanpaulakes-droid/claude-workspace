import { RIC } from "./datos";

/** Resistencia máxima de la tierra de protección en esquema TT: RA × Ia ≤ UL, con Ia = sensibilidad del diferencial (RIC N°05, 8.7.7.3). */
export const rProteccionMax = (idn: number, humedo = false): number =>
  (humedo ? RIC.UL.humedo : RIC.UL.seco) / (idn || 0.03);

/** Pica vertical: R = ρ / L (RIC N°06, Tabla 6.4). */
export const picaVertical = (rho: number, L: number): number => rho / L;

/** Evalúa la tierra de servicio (RIC N°06, 6.1 y 6.2): ≤ 20 Ω cumple; ≤ 80 Ω solo con las condiciones de 6.2. */
export function evalTierraServicio(R: number): "ok" | "condicional" | "no" {
  if (R <= RIC.tierraServ.max) return "ok";
  if (R <= RIC.tierraServ.maxExc) return "condicional";
  return "no";
}
