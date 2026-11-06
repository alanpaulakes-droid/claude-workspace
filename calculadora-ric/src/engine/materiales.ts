/** Partida de materiales: g = grupo, d = descripción, q = cantidad, u = unidad, k = clave de precio. */
export interface Partida {
  g: string;
  d: string;
  q: number;
  u: string;
  k: string;
}
export interface CircuitoMat {
  In: number | null;
  S: number | null;
  L: number;
  curva: string;
}
export interface EntradaMateriales {
  tri: boolean;
  alim: { In: number | null; S: number | null; L: number };
  circuitos: CircuitoMat[];
  /** Merma de cable (criterio usual: 10 %) */
  merma?: number;
  /** Chicotes y bajadas por circuito en metros por conductor (criterio usual: 2 m) */
  extra?: number;
}

const TAB_MOD = [8, 12, 18, 24, 36, 48];

/** Módulos DIN del tablero y tamaño comercial con 25 % de reserva (RIC N°02, 6.1.16.3). */
export function modulosTablero(nCirc: number, tri: boolean): { usados: number; reserva: number; tablero: number } {
  const nDR = Math.ceil(nCirc / 3);
  const usados = (tri ? 4 : 2) + (tri ? 4 : 2) * nDR + nCirc;
  const reserva = Math.ceil(usados * 0.25);
  const tablero = TAB_MOD.find((m) => m >= usados + reserva) ?? TAB_MOD[TAB_MOD.length - 1];
  return { usados, reserva, tablero };
}

/**
 * Lista de materiales eléctricos de un proyecto a partir de sus circuitos ya calculados.
 * Cada circuito lleva fase, neutro y tierra (3 conductores); el alimentador 3 (monofásico) o 5 (trifásico).
 * Cantidades estimadas: no incluye cajas, ductos ni aparatos, que dependen del plano.
 */
export function materialesProyecto(e: EntradaMateriales): Partida[] {
  const merma = e.merma ?? 0.1,
    extra = e.extra ?? 2;
  const out: Partida[] = [];
  const cab = new Map<number, number>();
  const addCab = (S: number | null, L: number, n: number) => {
    if (!S || !(L > 0)) return;
    cab.set(S, (cab.get(S) ?? 0) + n * (L * (1 + merma) + extra));
  };
  e.circuitos.forEach((c) => addCab(c.S, c.L, 3));
  addCab(e.alim.S, e.alim.L, e.tri ? 5 : 3);
  [...cab.entries()]
    .sort((a, b) => a[0] - b[0])
    .forEach(([S, m]) =>
      out.push({
        g: "Conductores",
        d: `Cable de cobre ${String(S).replace(".", ",")} mm²`,
        q: Math.ceil(m),
        u: "m",
        k: `cab:${S}`,
      }),
    );
  const nC = e.circuitos.length;
  if (e.alim.In)
    out.push({
      g: "Protecciones",
      d: `Interruptor general ${e.tri ? "4P" : "2P"} ${e.alim.In} A`,
      q: 1,
      u: "un",
      k: e.tri ? "ig4" : "ig2",
    });
  const nDR = Math.ceil(nC / 3);
  if (nDR) out.push({ g: "Protecciones", d: "Diferencial 30 mA clase A", q: nDR, u: "un", k: "dr:A" });
  const tm = new Map<string, number>();
  e.circuitos.forEach((c) => {
    if (!c.In) return;
    const k = `${c.In} A curva ${c.curva}`;
    tm.set(k, (tm.get(k) ?? 0) + 1);
  });
  [...tm.entries()].forEach(([d, q]) =>
    out.push({ g: "Protecciones", d: `Termomagnético 1P ${d}`, q, u: "un", k: "tm" }),
  );
  if (nC) {
    const m = modulosTablero(nC, e.tri);
    out.push({
      g: "Tablero",
      d: `Tablero ${m.tablero} módulos (usa ${m.usados} + reserva ${m.reserva})`,
      q: 1,
      u: "un",
      k: `tab${m.tablero}`,
    });
    out.push({ g: "Tablero", d: "Barra de neutro (una por diferencial)", q: nDR, u: "un", k: "regN" });
    out.push({ g: "Tablero", d: "Barra de tierra", q: 1, u: "un", k: "regPE" });
    out.push({ g: "Tablero", d: "Terminales para conductores", q: nC * 6 + 6, u: "un", k: "term" });
  }
  return out;
}
