/** Multiplicador del disparo magnético por curva (IEC 60898: B 3–5, C 5–10, D 10–20; se usa el extremo superior). */
export const KMAG: Record<string, number> = { B: 5, C: 10, D: 20 };

export interface EntradaIcc {
  Icc0?: number; // kA en el empalme
  La?: number; // m alimentador
  Sa?: number; // mm² alimentador
  L?: number; // m circuito
  S?: number; // mm² circuito
  In?: number;
  cv?: string;
  t?: number; // s, tiempo de despeje para el esfuerzo térmico
  Ig?: number; // A, general
  pdc?: number; // kA poder de corte del automático
  pdcG?: number; // kA poder de corte del general
}

/**
 * Cortocircuito básico monofásico (220 V). Método convencional (criterio usual, no fijado por los pliegos RIC):
 * Icc mín = 0,95·U0 / (Zs + 1,5·(Ra + Rc)); k = 115 para cobre con PVC.
 */
export function iccCalc(o: EntradaIcc) {
  const U0 = 220,
    rho = 0.018;
  const Zs = U0 / (Math.max(0.1, +(o.Icc0 ?? 0) || 3) * 1e3);
  const Ra = (2 * rho * (+(o.La ?? 0) || 0)) / (+(o.Sa ?? 0) || 6);
  const S = +(o.S ?? 0) || 2.5;
  const Rc = (2 * rho * (+(o.L ?? 0) || 0)) / S;
  const In = +(o.In ?? 0) || 16;
  const Ig = +(o.Ig ?? 0) || 25;
  const Imax = U0 / (Zs + Ra),
    ImaxF = U0 / (Zs + Ra + Rc),
    Imin = (0.95 * U0) / (Zs + 1.5 * (Ra + Rc)),
    Im = KMAG[o.cv || "C"] * In;
  const Lmax = Math.max(0, (((0.95 * U0) / Im - Zs - 1.5 * Ra) * S) / (3 * rho)),
    Smin = Math.sqrt(Imax * Imax * (+(o.t ?? 0) || 0.01)) / 115;
  const Igm = 5 * Ig,
    Lsel = Math.max(0, ((U0 / Igm - Zs - Ra) * S) / (2 * rho));
  const pdc = +(o.pdc ?? 0) || 6;
  return {
    Zs,
    Ra,
    Rc,
    Imax,
    ImaxF,
    Imin,
    Im,
    Lmax,
    Smin,
    Igm,
    Lsel,
    okPdc: Imax <= pdc * 1e3,
    okPdcG: Imax <= (+(o.pdcG ?? 0) || pdc) * 1e3,
    okMag: Imin >= Im,
    okTh: S >= Smin,
    ratio: Ig / In,
  };
}
