import { COM, RIC } from "./datos";

/** Calibre comercial inmediatamente superior o igual a x; null si no hay. */
export function nextCom(x: number): number | null {
  for (const c of COM) if (c >= x - 1e-9) return c;
  return null;
}

/**
 * Protección de un circuito (RIC N°10, 5.1.4.1 y 5.1.4.4): In ≥ 1,1 × I y la potencia no supera
 * el 90 % de la capacidad del circuito (P ≤ 0,9 × V × In × cos φ). `tmin`: calibre mínimo exigido.
 */
export function chooseIn(I: number, P: number, Vcap: number, cf: number, tmin: number): number | null {
  const { holgura, usoMax } = RIC.circuitos;
  for (const x of COM) {
    if (x >= holgura * I - 1e-9 && x >= Math.max(6, tmin) && P <= usoMax * Vcap * x * cf + 1e-9) return x;
  }
  return null;
}
