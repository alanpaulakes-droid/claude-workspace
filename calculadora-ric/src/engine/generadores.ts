/**
 * Generadores de preguntas de cálculo con valores al azar: cada intento produce una variante nueva.
 * Las respuestas se calculan con el mismo motor de la calculadora (mismas tablas RIC).
 */
import { fdViv, fsViv } from "./demanda";
import { chooseIn } from "./protecciones";
import { ampTable, llenadoMax } from "./conductores";
import { picaVertical, rProteccionMax } from "./tierra";
import { RIC, SECC } from "./datos";

export interface PreguntaGen {
  id: string;
  n: number;
  t: string;
  q: string;
  o: string[];
  a: number;
  e: string;
  ref: string;
}
export type Rng = () => number;

/** Generador pseudoaleatorio reproducible (mulberry32). */
export function rngSemilla(seed: number): Rng {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const ent = (r: Rng, a: number, b: number, paso = 1) => a + paso * Math.floor(r() * (Math.floor((b - a) / paso) + 1));
const fmt = (v: number, d = 0) => v.toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Arma opciones: la correcta + distractores distintos, mezcladas. Devuelve opciones e índice correcto. */
function opciones(r: Rng, ok: string, otros: string[]): { o: string[]; a: number } {
  const set: string[] = [ok];
  for (const x of otros) if (!set.includes(x) && set.length < 4) set.push(x);
  let k = 2;
  while (set.length < 4) set.push(ok + " ".repeat(k++)); // nunca ocurre con los generadores actuales
  for (let i = set.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [set[i], set[j]] = [set[j], set[i]];
  }
  return { o: set, a: set.indexOf(ok) };
}

type Gen = (r: Rng) => PreguntaGen;
export const GENERADORES: Record<string, Gen> = {
  corriente: (r) => {
    const P = ent(r, 800, 4500, 50),
      I = P / 220;
    const { o, a } = opciones(r, fmt(I, 2) + " A", [
      fmt(P / 380, 2) + " A",
      fmt((P / 220) * 1.1, 2) + " A",
      fmt(P / 110, 2) + " A",
    ]);
    return {
      id: "gen:corriente",
      n: 1,
      t: "Fundamentos",
      q: `Un equipo resistivo de ${fmt(P)} W se conecta a 220 V (cos φ = 1). ¿Qué corriente consume?`,
      o,
      a,
      e: `I = P ÷ V = ${fmt(P)} ÷ 220 = ${fmt(I, 2)} A.`,
      ref: "Ley de Watt (P = V × I × cos φ)",
    };
  },
  proteccion: (r) => {
    const tipo = r() < 0.5 ? "alumbrado" : "enchufes";
    const P = tipo === "alumbrado" ? ent(r, 4, 26) * 100 : ent(r, 4, 14) * 250,
      I = P / 220,
      In = chooseIn(I, P, 220, 1, 0) as number;
    const otros = [6, 10, 16, 20, 25].filter((x) => x !== In).map((x) => x + " A");
    const { o, a } = opciones(r, In + " A", otros);
    return {
      id: "gen:proteccion",
      n: 3,
      t: "Circuitos",
      q: `Un circuito de ${tipo} suma ${fmt(P)} W en 220 V. ¿Qué protección termomagnética le corresponde?`,
      o,
      a,
      e: `I = ${fmt(P)} ÷ 220 = ${fmt(I, 2)} A. Se busca el calibre comercial con In ≥ 1,1 × I = ${fmt(1.1 * I, 2)} A y P ≤ 0,9 × 220 × In: ${In} A (0,9 × 220 × ${In} = ${fmt(0.9 * 220 * In)} W).`,
      ref: "RIC N°10, 5.1.4.1 y 5.1.4.4",
    };
  },
  caida: (r) => {
    const I = ent(r, 6, 16),
      L = ent(r, 10, 45),
      S = [1.5, 2.5, 4][ent(r, 0, 2)],
      dv = (2 * 0.018 * L * I) / S,
      pct = (dv / 220) * 100;
    const { o, a } = opciones(r, fmt(pct, 2) + " %", [
      fmt(pct / 2, 2) + " %",
      fmt((pct * 220) / 380, 2) + " %",
      fmt(pct * 2, 2) + " %",
    ]);
    return {
      id: "gen:caida",
      n: 2,
      t: "Caída de tensión",
      q: `Circuito monofásico de ${fmt(S, S % 1 ? 1 : 0)} mm² y ${L} m (solo ida) que lleva ${I} A. Con ρ = 0,018 Ω·mm²/m, ¿qué caída de tensión tiene en %?`,
      o,
      a,
      e: `ΔV = 2 × ρ × L × I ÷ S = 2 × 0,018 × ${L} × ${I} ÷ ${fmt(S, S % 1 ? 1 : 0)} = ${fmt(dv, 2)} V → ${fmt(dv, 2)} ÷ 220 × 100 = ${fmt(pct, 2)} %. ${pct <= 3 ? "Cumple el 3 % del tramo." : "Supera el 3 % del tramo: hay que subir la sección o acortar."}`,
      ref: "RIC N°03, 5.1.3",
    };
  },
  demanda: (r) => {
    const P = ent(r, 4, 24) * 1000,
      Pd = fdViv(P).Pd;
    const { o, a } = opciones(r, fmt(Pd) + " W", [fmt(P) + " W", fmt(P * 0.35) + " W", fmt(3000 + P * 0.35) + " W"]);
    return {
      id: "gen:demanda",
      n: 3,
      t: "Demanda",
      q: `Una vivienda tiene ${fmt(P)} W de potencia instalada de alumbrado. ¿Cuál es su demanda máxima según la Tabla 3.1?`,
      o,
      a,
      e: `Primeros 3.000 W al 100 % y el resto (hasta 120 kW) al 35 %: 3.000 + ${fmt(P - 3000)} × 0,35 = ${fmt(Pd)} W.`,
      ref: "RIC N°03, Tabla 3.1",
    };
  },
  centros: (r) => {
    const In = [10, 16][ent(r, 0, 1)],
      w = [60, 100][ent(r, 0, 1)],
      n = Math.floor((0.9 * 220 * In) / w);
    const { o, a } = opciones(r, String(n), [
      String(Math.floor((220 * In) / w)),
      String(Math.floor((0.8 * 220 * In) / w)),
      String(n + 2),
    ]);
    return {
      id: "gen:centros",
      n: 3,
      t: "Circuitos",
      q: `¿Cuántos centros de ${w} W como máximo admite un circuito de ${In} A en 220 V?`,
      o,
      a,
      e: `La suma de potencias se iguala al 90 % de la capacidad: 0,9 × 220 × ${In} = ${fmt(0.9 * 220 * In)} W ÷ ${w} W = ${n} centros.`,
      ref: "RIC N°10, 5.1.4.4",
    };
  },
  enchufes: (r) => {
    const per = ent(r, 9, 30),
      n = Math.ceil(per / 8),
      rec = ["dormitorio", "living", "comedor", "sala de estar"][ent(r, 0, 3)];
    const { o, a } = opciones(r, String(n), [
      String(Math.max(1, n - 1)),
      String(n + 1),
      String(Math.ceil(per / 4)),
      String(n + 2),
      String(n + 3),
    ]);
    return {
      id: "gen:enchufes",
      n: 2,
      t: "Vivienda",
      q: `Un ${rec} tiene ${per} m de perímetro. ¿Cuántos enchufes dobles o triples necesita como mínimo?`,
      o,
      a,
      e: `Uno por cada 8 m de perímetro o fracción: ${per} ÷ 8 = ${fmt(per / 8, 2)} → ${n}.`,
      ref: "RIC N°10, 5.2 b)",
    };
  },
  simultaneidad: (r) => {
    const n = ent(r, 2, 30),
      fs = fsViv(n).fs;
    const f = (x: number) => fmt(x, 2);
    const { o, a } = opciones(
      r,
      f(fs),
      [f(1), f(Math.max(0.5, fs - 0.05)), f(Math.min(1, fs + 0.05)), f(Math.max(0.5, fs - 0.1)), f(fs - 0.15)].filter(
        (x) => x !== f(fs),
      ),
    );
    return {
      id: "gen:simult",
      n: 4,
      t: "Demanda",
      q: `¿Qué factor de simultaneidad corresponde a ${n} viviendas alimentadas desde un solo empalme?`,
      o,
      a,
      e:
        n > 21
          ? `Sobre 21 viviendas: (15,3 + (${n} − 21) × 0,5) ÷ ${n} = ${fmt(fs, 3)}.`
          : `Valor de la Tabla 3.2 para ${n} viviendas: ${f(fs)}.`,
      ref: "RIC N°03, Tabla 3.2",
    };
  },
  pica: (r) => {
    const rho = ent(r, 5, 40) * 10,
      L = [1.5, 2, 2.5, 3][ent(r, 0, 3)],
      R = picaVertical(rho, L);
    const { o, a } = opciones(r, fmt(R, 1) + " Ω", [
      fmt(rho * L, 1) + " Ω",
      fmt(R / 2, 1) + " Ω",
      fmt((rho / L) * 2, 1) + " Ω",
    ]);
    return {
      id: "gen:pica",
      n: 4,
      t: "Puesta a tierra",
      q: `Se instala una pica vertical de ${fmt(L, 1)} m en un terreno de ${rho} Ω·m. ¿Qué resistencia aproximada tendrá?`,
      o,
      a,
      e: `R = ρ ÷ L = ${rho} ÷ ${fmt(L, 1)} = ${fmt(R, 1)} Ω. ${R <= RIC.tierraServ.max ? "Cumple 20 Ω." : "Supera 20 Ω: hay que agregar picas o mejorar el terreno."}`,
      ref: "RIC N°06, Tabla 6.4",
    };
  },
  tierraProt: (r) => {
    const hum = r() < 0.5,
      idn = [0.03, 0.3][ent(r, 0, 1)],
      R = rProteccionMax(idn, hum);
    const { o, a } = opciones(r, fmt(R) + " Ω", [
      fmt(rProteccionMax(idn, !hum)) + " Ω",
      fmt(20) + " Ω",
      fmt(R / 10) + " Ω",
    ]);
    return {
      id: "gen:tierraprot",
      n: 4,
      t: "Seguridad",
      q: `Con un diferencial de ${fmt(idn * 1000)} mA en un lugar ${hum ? "húmedo" : "seco"}, ¿cuál es la resistencia máxima de la tierra de protección?`,
      o,
      a,
      e: `RA ≤ UL ÷ IΔn = ${hum ? 24 : 50} ÷ ${fmt(idn, 2)} = ${fmt(R)} Ω (UL = ${hum ? "24 V en lugar húmedo" : "50 V en lugar seco"}).`,
      ref: "RIC N°05 (RA × Id ≤ UL)",
    };
  },
  seccion: (r) => {
    const In = [10, 16, 20, 25, 32][ent(r, 0, 4)],
      tb = ampTable({ met: "A1", tc: 70 }),
      S = SECC.find((s) => (tb[s] ?? 0) >= In) as number;
    const sstr = (s: number) => fmt(s, s % 1 ? 1 : 0) + " mm²";
    const otros = SECC.filter((s) => s !== S && s <= 10).map(sstr);
    const { o, a } = opciones(r, sstr(S), otros);
    return {
      id: "gen:seccion",
      n: 2,
      t: "Capacidad de corriente",
      q: `Cable de 70 °C embutido en pared (método A1, 30 °C). ¿Qué sección mínima soporta una protección de ${In} A (Iz ≥ In)?`,
      o,
      a,
      e: `En la Tabla 4.4, columna A1 a 70 °C: ${sstr(S)} soporta ${tb[S]} A ≥ ${In} A${SECC.indexOf(S) > 0 ? `; ${sstr(SECC[SECC.indexOf(S) - 1])} solo ${tb[SECC[SECC.indexOf(S) - 1]]} A` : ""}. Además, revisa la sección mínima según el uso.`,
      ref: "RIC N°04, Tabla 4.4",
    };
  },
  llenado: (r) => {
    const n = ent(r, 1, 6),
      m = llenadoMax(n);
    const { o, a } = opciones(
      r,
      m + " %",
      ["33 %", "40 %", "50 %", "60 %"].filter((x) => x !== m + " %"),
    );
    return {
      id: "gen:llenado",
      n: 2,
      t: "Canalizaciones",
      q: `¿Qué porcentaje máximo de la sección de un tubo pueden ocupar ${n} conductor${n > 1 ? "es" : ""} (incluida la tierra)?`,
      o,
      a,
      e: `Tabla 4.21: 1 conductor → 50 %; 2 o más → 33 %. Con ${n}: ${m} %.`,
      ref: "RIC N°04, Tabla 4.21",
    };
  },
  circMin: (r) => {
    const m2 = ent(r, 18, 90),
      n = m2 < 30 ? 2 : 3;
    const { o, a } = opciones(
      r,
      String(n),
      ["1", "2", "3", "4"].filter((x) => x !== String(n)),
    );
    return {
      id: "gen:circmin",
      n: 2,
      t: "Vivienda",
      q: `¿Cuántos circuitos como mínimo debe proyectarse en una vivienda de ${m2} m²?`,
      o,
      a,
      e: `Mínimo 2 circuitos bajo 30 m² y 3 circuitos para 30 m² o más: ${m2} m² → ${n}.`,
      ref: "RIC N°10, 5.2 b)",
    };
  },
};

/** Genera n preguntas de cálculo distintas en tipo cuando es posible. */
export function generarPreguntas(n: number, r: Rng, tipos: string[] = Object.keys(GENERADORES)): PreguntaGen[] {
  const out: PreguntaGen[] = [];
  const pool = tipos.slice();
  for (let i = 0; i < n; i++) {
    if (!pool.length) pool.push(...tipos);
    const k = pool.splice(Math.floor(r() * pool.length), 1)[0];
    out.push(GENERADORES[k](r));
  }
  return out;
}
