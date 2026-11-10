/**
 * Simulación de fallas en un circuito domiciliario: qué protección actúa, en cuánto tiempo y por qué.
 * Curvas de disparo de termomagnéticos según IEC 60898 (térmico desde 1,13·In, disparo convencional 1,45·In,
 * magnético entre 3–5 In (B), 5–10 In (C) y 10–20 In (D)). Los tiempos del tramo térmico son una
 * aproximación de las curvas típicas de fabricante (criterio usual), no valores normativos.
 */
export const CURVAS: Record<string, [number, number]> = { B: [3, 5], C: [5, 10], D: [10, 20] };

/** Tiempo máximo (banda superior) y mínimo (banda inferior) de disparo térmico para k = I / In [s]. */
export function tiemposTermicos(k: number): { tMin: number; tMax: number } {
  const tUp =
    k < 1.45
      ? 3600 * Math.pow(1.45 / k, 6)
      : k < 2.55
        ? Math.exp(Math.log(3600) + (Math.log(60) - Math.log(3600)) * (Math.log(k / 1.45) / Math.log(2.55 / 1.45)))
        : 60 * Math.pow(2.55 / k, 2);
  const tLo =
    k < 2.55
      ? Math.exp(Math.log(3600) + (Math.log(1) - Math.log(3600)) * (Math.log(k / 1.13) / Math.log(2.55 / 1.13)))
      : Math.pow(2.55 / k, 2);
  return { tMin: Math.max(0, tLo), tMax: tUp };
}

export type Zona = "sin" | "lenta" | "termica" | "transicion" | "magnetica";
/** Zona de la curva de disparo para k = I / In. tMin y tMax en segundos (null si no dispara). */
export function zonaDisparo(k: number, cv = "C"): { zona: Zona; tMin: number | null; tMax: number | null } {
  const [m1, m2] = CURVAS[cv] ?? CURVAS.C;
  if (k < 1.13) return { zona: "sin", tMin: null, tMax: null };
  if (k < 1.45) return { zona: "lenta", tMin: 3600, tMax: null };
  const t = tiemposTermicos(k);
  if (k < m1) return { zona: "termica", tMin: t.tMin, tMax: Math.min(3600, t.tMax) };
  if (k < m2) return { zona: "transicion", tMin: 0.01, tMax: Math.min(60, t.tMax) };
  return { zona: "magnetica", tMin: 0.005, tMax: 0.1 };
}

export type TipoFalla = "sobrecarga" | "cortocircuito" | "tierra" | "subdimensionado";
export interface EntradaFalla {
  tipo: TipoFalla;
  /** Tensión fase–neutro [V] */
  U0?: number;
  /** Protección del circuito [A] y curva */
  In: number;
  cv: string;
  /** Capacidad del cable del circuito [A] */
  Iz: number;
  /** Corriente normal del circuito [A] */
  Is: number;
  /** Carga extra conectada en una sobrecarga [W] */
  Pextra?: number;
  /** Impedancia de la red hasta el empalme [Ω] */
  Zs: number;
  /** Resistencia de ida y vuelta del alimentador [Ω] */
  Ra: number;
  /** Resistencia de ida y vuelta del circuito hasta el punto más lejano [Ω] */
  Rc: number;
  /** Diferencial: existe, sensibilidad [A] y si funciona */
  dr: { tiene: boolean; idn?: number; funciona?: boolean };
  /** Conductor de protección conectado */
  pe: boolean;
  /** Resistencia del cuerpo humano (RIC N°05, 5.7: 2.000 Ω referencial) */
  Rcuerpo?: number;
}
export interface ResultadoFalla {
  I: number;
  k: number;
  actua: "tm-magnetico" | "tm-termico" | "dr" | "ninguno";
  tMin: number | null;
  tMax: number | null;
  zona: Zona;
  nivel: "ok" | "riesgo" | "grave";
  /** Tensión de contacto en carcasas durante la falla [V] (solo falla a tierra) */
  Uc?: number;
  /** El cable supera su capacidad mientras dura la falla */
  cableSobre: boolean;
  motivo: string;
  ref: string;
}

/** Calcula qué ocurre ante una falla. Corrientes de cortocircuito por el método convencional (0,95·U0; cable caliente × 1,5). */
export function simularFalla(e: EntradaFalla): ResultadoFalla {
  const U0 = e.U0 ?? 220;
  const idn = e.dr.idn ?? 0.03;
  const drOk = e.dr.tiene && e.dr.funciona !== false;
  const UL = 50;
  if (e.tipo === "sobrecarga" || e.tipo === "subdimensionado") {
    const I = e.tipo === "sobrecarga" ? e.Is + (e.Pextra ?? 0) / U0 : 1.45 * e.In;
    const k = I / e.In;
    const z = zonaDisparo(k, e.cv);
    const cableSobre = I > e.Iz + 1e-9;
    const tarda = z.zona === "sin" || z.zona === "lenta";
    const grave = cableSobre && (tarda || (z.tMax ?? 0) > 60) && 1.45 * e.In > 1.45 * e.Iz + 1e-9;
    return {
      I,
      k,
      actua: z.zona === "sin" ? "ninguno" : z.zona === "magnetica" ? "tm-magnetico" : "tm-termico",
      tMin: z.tMin,
      tMax: z.tMax,
      zona: z.zona,
      nivel: grave ? "grave" : cableSobre && tarda ? "riesgo" : "ok",
      cableSobre,
      motivo: grave
        ? "El cable soporta menos que su protección: la sobrecarga lo calienta sobre su límite antes de que el automático corte."
        : z.zona === "sin"
          ? "La corriente no alcanza a hacer disparar el automático: el circuito sigue funcionando."
          : z.zona === "lenta" && !cableSobre
            ? "Sobrecarga leve: el automático puede tardar más de una hora en cortar, pero el cable la soporta sin dañarse."
            : "La parte térmica del automático (bimetal) corta la sobrecarga; mientras más corriente, más rápido.",
      ref: "RIC N°10, 5.1.4.1 y 5.1.5.1 · RIC N°04, Tabla 4.4",
    };
  }
  if (e.tipo === "cortocircuito") {
    const I = (0.95 * U0) / (e.Zs + 1.5 * (e.Ra + e.Rc));
    const k = I / e.In;
    const z = zonaDisparo(k, e.cv);
    const ok = z.zona === "magnetica";
    return {
      I,
      k,
      actua: ok ? "tm-magnetico" : z.zona === "sin" ? "ninguno" : "tm-termico",
      tMin: z.tMin,
      tMax: z.tMax,
      zona: z.zona,
      nivel: ok ? "ok" : "grave",
      cableSobre: true,
      motivo: ok
        ? "La corriente de cortocircuito supera el umbral magnético: el automático corta al instante."
        : "El circuito es tan largo o delgado que la corriente de cortocircuito no alcanza el umbral magnético: el corte se demora y el cable se daña.",
      ref: "Criterio usual (método convencional) · RIC N°10, 5.1.4.2",
    };
  }
  // Falla a tierra: la fase toca una carcasa metálica
  if (!e.pe) {
    const Ib = U0 / (e.Rcuerpo ?? 2000);
    return {
      I: Ib,
      k: Ib / e.In,
      actua: drOk && Ib >= idn ? "dr" : "ninguno",
      tMin: drOk ? 0.01 : null,
      tMax: drOk ? (Ib >= 5 * idn ? 0.04 : 0.3) : null,
      zona: "sin",
      nivel: drOk ? "riesgo" : "grave",
      Uc: U0,
      cableSobre: false,
      motivo: drOk
        ? "Sin conductor de tierra la carcasa queda a 220 V. Solo cuando alguien la toca pasa corriente por su cuerpo y el diferencial corta."
        : "Sin tierra ni diferencial la carcasa queda a 220 V y nada corta: quien la toque recibe la descarga.",
      ref: "RIC N°05 (contactos indirectos) · RIC N°10, 5.1.3.5 y 5.2 f)",
    };
  }
  const I = (0.95 * U0) / (e.Zs + 1.5 * (e.Ra + e.Rc));
  const k = I / e.In;
  const z = zonaDisparo(k, e.cv);
  const Uc = I * 1.5 * (e.Rc / 2);
  if (drOk)
    return {
      I,
      k,
      actua: "dr",
      tMin: 0.01,
      tMax: 0.04,
      zona: z.zona,
      nivel: "ok",
      Uc,
      cableSobre: false,
      motivo:
        "La corriente de falla vuelve por el conductor de tierra y no por el neutro: el diferencial detecta la diferencia y corta en milisegundos" +
        (z.zona === "magnetica" ? " (el magnético del automático también actúa)." : "."),
      ref: "RIC N°10, 5.1.3.5 · RIC N°05 (RA × Id ≤ UL)",
    };
  return {
    I,
    k,
    actua: z.zona === "magnetica" ? "tm-magnetico" : z.zona === "sin" ? "ninguno" : "tm-termico",
    tMin: z.tMin,
    tMax: z.tMax,
    zona: z.zona,
    nivel: z.zona === "magnetica" && Uc <= U0 ? (Uc > UL ? "riesgo" : "ok") : "grave",
    Uc,
    cableSobre: true,
    motivo:
      z.zona === "magnetica"
        ? "Sin diferencial solo el magnético protege: corta rápido porque la falla es casi un cortocircuito, pero la carcasa alcanza una tensión peligrosa mientras dura."
        : "Sin diferencial y con poca corriente de falla el automático tarda: la carcasa queda con tensión peligrosa por mucho tiempo.",
    ref: "RIC N°10, 5.1.3.5 · RIC N°05 (Zs × Ia ≤ U0)",
  };
}
