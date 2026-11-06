import { RIC, SECC, AMP_CFG_DEF, type AmpCfg, type TablaIz } from "./datos";

type ColIz = Record<string, (number | null)[]>;
const IZ = RIC.iz as unknown as Record<string, ColIz>;

/** Columna de la Tabla 4.4 (RIC N°04) para un tipo de cable y método de instalación. */
export function ampTable(cfg: AmpCfg = AMP_CFG_DEF): TablaIz {
  const t = IZ[String(cfg.tc)] ?? IZ["70"];
  const col = t[String(cfg.met)] ?? IZ["70"].A1;
  const o: TablaIz = {};
  SECC.forEach((s, i) => {
    const v = col[i];
    if (v != null) o[s] = v;
  });
  return o;
}

/** Factor fn por cantidad de conductores activos en un ducto (RIC N°04, Tabla 4.6). */
export function fnRIC(nc: number): number {
  const i = RIC.fn.hasta.findIndex((m) => nc <= m);
  return i < 0 ? 0.5 : RIC.fn.f[i];
}

/** Conductores activos de n circuitos: monofásico fase + neutro; trifásico 3 fases (el neutro no cuenta, 6.2.4). */
export const ncAct = (n: number, tri = false): number => Math.max(1, Math.round(+n || 1)) * (tri ? 3 : 2);

/** Factor de agrupamiento para n circuitos en el mismo ducto. */
export const fGrp = (n: number, tri = false): number => fnRIC(ncAct(n, tri));

/** Factor ft por temperatura ambiente (RIC N°04, Tabla 4.7). */
export function fTemp(ta: number, tc: number = 70): number {
  const col = (RIC.ft as unknown as Record<string, number[]>)[String(tc)] ?? RIC.ft["70"];
  const i = RIC.ft.t.findIndex((t) => t >= (+ta || 30) - 1e-9);
  return i < 0 ? col[col.length - 1] : col[i];
}

/** Llenado máximo de un tubo en % (RIC N°04, Tabla 4.21). `union`: tramo de unión de tableros de hasta 1 m. */
export function llenadoMax(nc: number, union = false): number {
  if (union) return RIC.llenado.union;
  const k = String(Math.min(3, Math.max(1, Math.round(nc)))) as "1" | "2" | "3";
  return RIC.llenado[k];
}

export interface IntentoSeccion {
  s: number;
  Iz: number;
  dv: number;
  pct: number;
  okMin: boolean;
  okIz: boolean;
  okDv: boolean;
}
export interface EntradaSeccion {
  /** Corriente de diseño [A] */
  I: number;
  /** Protección [A]; null = no se verifica Iz ≥ In */
  In: number | null;
  /** Largo, solo ida [m] */
  L: number;
  /** 2 (monofásico) o √3 (trifásico) */
  k: number;
  /** Tensión de referencia [V] */
  Vref: number;
  /** Resistividad [Ω·mm²/m] */
  rho: number;
  /** Límite de caída [%] */
  lim: number;
  /** Sección mínima [mm²] */
  Smin: number;
  /** Factor de corrección total */
  fc: number;
  /** Tabla Iz a usar */
  amp: TablaIz;
}

/**
 * Elige la sección más delgada que cumple: S ≥ mínima (RIC N°04, 5.4), Iz·fc ≥ In (RIC N°10, 5.1.5.1)
 * y caída ≤ límite (RIC N°03, 5.1.3). Devuelve todos los intentos para mostrar el desarrollo.
 */
export function chooseS(e: EntradaSeccion): { tries: IntentoSeccion[]; sel: IntentoSeccion | null } {
  const tries: IntentoSeccion[] = [];
  let sel: IntentoSeccion | null = null;
  for (const s of SECC) {
    const Iz = (+e.amp[s] || 0) * e.fc;
    const dv = (e.k * e.rho * e.L * e.I) / s;
    const pct = e.Vref ? (dv / e.Vref) * 100 : 0;
    const t: IntentoSeccion = {
      s,
      Iz,
      dv,
      pct,
      okMin: s >= e.Smin,
      okIz: e.In == null || Iz >= e.In,
      okDv: pct <= e.lim + 1e-9,
    };
    tries.push(t);
    if (!sel && t.okMin && t.okIz && t.okDv) sel = t;
  }
  return { tries, sel };
}
