import { RIC } from "./datos";

/** Demanda de una vivienda por tramos (RIC N°03, Tabla 3.1). a, b, c: potencia en cada tramo [W]. */
export function fdViv(P: number): { Pd: number; a: number; b: number; c: number } {
  const [t1, t2] = RIC.fd.tramos;
  const a = Math.min(P, t1[0]);
  const b = Math.max(0, Math.min(P, t2[0]) - t1[0]);
  const c = Math.max(0, P - t2[0]);
  return { Pd: a * t1[1] + b * t2[1] + c * RIC.fd.tramos[2][1], a, b, c };
}

/** Factor de simultaneidad para n viviendas con un solo empalme (RIC N°03, Tabla 3.2 y 6.5). */
export function fsViv(n: number): { fs: number; modo: "tabla" | "formula" } {
  n = Math.max(1, Math.round(n));
  if (n > 21) return { fs: (15.3 + (n - 21) * 0.5) / n, modo: "formula" };
  return { fs: RIC.fs.f[n - 1], modo: "tabla" };
}
