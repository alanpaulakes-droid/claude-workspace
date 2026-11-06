/** Caída de tensión ΔV = k·ρ·L·I / S [V] y en % de Vref. k = 2 (monofásico) o √3 (trifásico). */
export function caidaTension(
  k: number,
  rho: number,
  L: number,
  I: number,
  S: number,
  Vref: number,
): { dv: number; pct: number } {
  const dv = S > 0 ? (k * rho * L * I) / S : NaN;
  return { dv, pct: Vref ? (dv / Vref) * 100 : NaN };
}

/** Corriente de diseño: monofásica P/(V·cos φ) o trifásica P/(√3·VL·cos φ). */
export function corriente(P: number, V: number, cf = 1, tri = false): number {
  return P / ((tri ? Math.sqrt(3) : 1) * V * (cf || 1));
}
