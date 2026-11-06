/** Funciones puras para las demostraciones interactivas (gráficos y comparaciones). */

export interface ParCaida {
  /** 2 (monofásico) o √3 (trifásico) */
  k: number;
  rho: number;
  I: number;
  Vref: number;
}

/** Caída de tensión en % a lo largo del tramo: puntos (L, ΔV %) de 0 a Lmax. */
export function serieCaida(p: ParCaida, S: number, Lmax: number, n = 24): { L: number; pct: number }[] {
  const out: { L: number; pct: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const L = (Lmax * i) / n;
    out.push({ L, pct: p.Vref && S ? ((p.k * p.rho * L * p.I) / S / p.Vref) * 100 : 0 });
  }
  return out;
}

/** Largo máximo [m] para no superar `lim` % de caída: L = lim/100 · Vref · S / (k · ρ · I). */
export function largoMaxCaida(p: ParCaida, S: number, lim: number): number {
  return p.I > 0 ? ((lim / 100) * p.Vref * S) / (p.k * p.rho * p.I) : Infinity;
}

/**
 * Coordinación protección–conductor (RIC N°10, 5.1.4.1 y 5.1.5.1): Is ≤ In ≤ Iz, con In ≥ 1,1 · Is.
 * `holgura` = In / Is; `margen` = Iz / In (≥ 1 para que el cable quede protegido).
 */
export function coordinacion(Is: number, In: number, Iz: number) {
  return {
    okCarga: In >= 1.1 * Is - 1e-9,
    okCable: Iz >= In - 1e-9,
    holgura: Is > 0 ? In / Is : Infinity,
    margen: In > 0 ? Iz / In : Infinity,
  };
}

/**
 * Corriente que un termomagnético puede dejar pasar por largo tiempo sin cortar (1,45·In, IEC 60898)
 * comparada con lo que soporta el cable: si 1,45·In > 1,45·Iz el cable se sobrecalienta antes del disparo.
 */
export function sobrecargaSinDisparo(In: number, Iz: number): { Ilim: number; excedeCable: boolean } {
  const Ilim = 1.45 * In;
  return { Ilim, excedeCable: In > Iz + 1e-9 };
}
