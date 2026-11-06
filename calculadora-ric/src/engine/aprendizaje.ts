import banco from "../data/banco-sec.json";

export interface PreguntaSEC {
  id: string;
  /** Nivel de la ruta (1 básico … 5 instalador) */
  n: number;
  t: string;
  q: string;
  o: string[];
  a: number;
  e: string;
  ref: string;
}
export const BANCO_SEC: { ver: string; nota: string; q: PreguntaSEC[] } = banco;

/** Tarjeta de repaso espaciado (sistema Leitner): caja 1–5 y fecha de la próxima revisión [ms]. */
export interface Tarjeta {
  box: number;
  due: number;
  fallos: number;
  aciertos: number;
}
/** Días hasta la próxima revisión según la caja (criterio usual de repaso espaciado). */
export const INTERVALOS = [0, 1, 3, 7, 14, 30];
const DIA = 864e5;

/** Actualiza una tarjeta tras responder: acierto → sube de caja; error → vuelve a la caja 1 (revisar mañana). */
export function programar(t: Tarjeta | undefined, ok: boolean, ahora: number): Tarjeta {
  const c = t ?? { box: 1, due: ahora, fallos: 0, aciertos: 0 };
  const box = ok ? Math.min(5, c.box + 1) : 1;
  return {
    box,
    due: ahora + INTERVALOS[box] * DIA,
    fallos: c.fallos + (ok ? 0 : 1),
    aciertos: c.aciertos + (ok ? 1 : 0),
  };
}

/** Claves de las tarjetas que tocan hoy, de la más atrasada a la más reciente. */
export function pendientes(m: Record<string, Tarjeta>, ahora: number): string[] {
  return Object.entries(m)
    .filter(([, t]) => t.due <= ahora && t.box < 5)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([k]) => k);
}

/** Nota chilena (1,0 a 7,0) con exigencia del 60 % para el 4,0 (criterio usual en Chile). */
export function notaChilena(ok: number, n: number, exig = 0.6): number {
  if (!n) return 1;
  const p = ok / n;
  const nota = p < exig ? 1 + (3 * p) / exig : 4 + (3 * (p - exig)) / (1 - exig);
  return Math.round(nota * 10) / 10;
}

/** Mezcla un arreglo con una semilla (para que el examen sea reproducible en pruebas). */
export function mezclar<T>(arr: T[], semilla = Math.random() * 1e9): T[] {
  const a = arr.slice();
  let s = Math.floor(semilla) % 2147483647 || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
