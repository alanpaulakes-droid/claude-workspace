import { describe, it, expect } from "vitest";
import {
  ampTable,
  fnRIC,
  ncAct,
  fGrp,
  fTemp,
  llenadoMax,
  chooseS,
  fdViv,
  fsViv,
  chooseIn,
  nextCom,
  caidaTension,
  corriente,
  rProteccionMax,
  picaVertical,
  evalTierraServicio,
  iccCalc,
  parseNum,
  RIC,
} from "../../src/engine";

describe("RIC N°04, Tabla 4.4 (capacidad de corriente)", () => {
  it("70 °C método A1", () => {
    const t = ampTable({ met: "A1", tc: 70 });
    expect([t[1.5], t[2.5], t[4], t[6], t[10], t[120]]).toEqual([14, 18, 24, 31, 42, 188]);
  });
  it("70 °C método B1", () => {
    const t = ampTable({ met: "B1", tc: 70 });
    expect([t[1.5], t[2.5], t[4], t[6], t[10], t[16]]).toEqual([16, 21, 28, 36, 50, 68]);
  });
  it("90 °C métodos B1, D2 y E", () => {
    expect(ampTable({ met: "B1", tc: 90 })[4]).toBe(37);
    expect(ampTable({ met: "D2", tc: 90 })[2.5]).toBe(38);
    expect(ampTable({ met: "E", tc: 90 })[95]).toBe(298);
  });
  it("por defecto A1 70 °C y método inexistente cae a A1 70 °C", () => {
    expect(ampTable()[2.5]).toBe(18);
    expect(ampTable({ met: "D1", tc: 70 })[2.5]).toBe(18);
  });
  it("todas las columnas crecen con la sección", () => {
    for (const tc of ["70", "90"] as const)
      for (const col of Object.values(RIC.iz[tc]) as number[][])
        for (let i = 1; i < col.length; i++) expect(col[i]).toBeGreaterThan(col[i - 1]);
  });
});

describe("RIC N°04, Tablas 4.6, 4.7 y 4.21", () => {
  it("fn por conductores activos", () => {
    expect([1, 3, 4, 6, 7, 24, 25, 42, 43].map(fnRIC)).toEqual([1, 1, 0.8, 0.8, 0.7, 0.7, 0.6, 0.6, 0.5]);
  });
  it("conductores activos: monofásico 2 por circuito, trifásico 3 (el neutro no cuenta)", () => {
    expect(ncAct(1)).toBe(2);
    expect(ncAct(3, true)).toBe(9);
    expect(fGrp(2)).toBe(0.8);
    expect(fGrp(4)).toBe(0.7);
  });
  it("ft por temperatura ambiente", () => {
    expect(fTemp(30)).toBe(1);
    expect(fTemp(40)).toBe(0.87);
    expect(fTemp(40, 90)).toBe(0.91);
    expect(fTemp(33)).toBe(0.94);
    expect(fTemp(70)).toBe(0.5);
  });
  it("llenado máximo de tubos", () => {
    expect([llenadoMax(1), llenadoMax(2), llenadoMax(3), llenadoMax(8), llenadoMax(3, true)]).toEqual([
      50, 33, 33, 33, 60,
    ]);
  });
});

describe("RIC N°03 (demanda, simultaneidad y caída)", () => {
  it("Tabla 3.1: 6.700 W → 4.295 W", () => {
    expect(fdViv(6700).Pd).toBeCloseTo(3000 + 3700 * 0.35, 9);
  });
  it("Tabla 3.1: tramo sobre 120 kW", () => {
    expect(fdViv(130000).Pd).toBeCloseTo(3000 + 117000 * 0.35 + 10000 * 0.25, 6);
  });
  it("Tabla 3.2: valores exactos y fórmula sobre 21", () => {
    expect([1, 4, 6, 10, 15, 21].map((n) => fsViv(n).fs)).toEqual([1, 0.95, 0.9, 0.85, 0.79, 0.73]);
    expect(fsViv(25).fs).toBeCloseTo(17.3 / 25, 12);
    expect(fsViv(25).modo).toBe("formula");
  });
  it("caída monofásica: 2·0,018·25·10/2,5 = 3,6 V = 1,64 %", () => {
    const r = caidaTension(2, 0.018, 25, 10, 2.5, 220);
    expect(r.dv).toBeCloseTo(3.6, 9);
    expect(r.pct).toBeCloseTo(1.636, 3);
  });
  it("corriente mono y trifásica", () => {
    expect(corriente(2000, 220)).toBeCloseTo(9.0909, 4);
    expect(corriente(10000, 380, 0.9, true)).toBeCloseTo(16.88, 2);
  });
});

describe("RIC N°10 (protección del circuito)", () => {
  it("2.000 W en 220 V → 16 A (10 A no alcanza: 0,9·220·10 = 1.980 W)", () => {
    expect(chooseIn(2000 / 220, 2000, 220, 1, 0)).toBe(16);
  });
  it("1.980 W cabe justo en 10 A", () => {
    expect(chooseIn(1980 / 220, 1980, 220, 1, 0)).toBe(10);
  });
  it("respeta el mínimo exigido (cocina 16 A)", () => {
    expect(chooseIn(1, 220, 220, 1, 16)).toBe(16);
  });
  it("nextCom", () => {
    expect(nextCom(25)).toBe(25);
    expect(nextCom(25.1)).toBe(32);
    expect(nextCom(500)).toBeNull();
  });
});

describe("Selección de sección (Iz, mínimo y caída)", () => {
  const base = { k: 2, Vref: 220, rho: 0.018, lim: 3, fc: 1, amp: ampTable({ met: "A1", tc: 70 }) };
  it("alimentador 25 A, 12 m, A1 70 °C: 4 mm² no alcanza (24 A) → 6 mm²", () => {
    const r = chooseS({ ...base, I: 20, In: 25, L: 12, Smin: 4 });
    expect(r.sel?.s).toBe(6);
    expect(r.tries.find((t) => t.s === 4)?.okIz).toBe(false);
  });
  it("con THHN 90 °C A1 el de 4 mm² sí sirve (31 A)", () => {
    const r = chooseS({ ...base, amp: ampTable({ met: "A1", tc: 90 }), I: 20, In: 25, L: 12, Smin: 4 });
    expect(r.sel?.s).toBe(4);
  });
  it("tramo largo: manda la caída de tensión", () => {
    const r = chooseS({ ...base, I: 10, In: 16, L: 60, Smin: 2.5 });
    expect(r.sel?.s).toBe(4);
    expect(r.sel?.pct).toBeLessThanOrEqual(3);
  });
});

describe("Puesta a tierra (RIC N°05 y N°06)", () => {
  it("R protección ≤ UL / IΔn", () => {
    expect(rProteccionMax(0.03)).toBeCloseTo(1666.67, 1);
    expect(rProteccionMax(0.03, true)).toBe(800);
  });
  it("pica vertical R = ρ/L", () => {
    expect(picaVertical(100, 1.5)).toBeCloseTo(66.67, 2);
  });
  it("tierra de servicio 20 Ω / hasta 80 Ω condicional", () => {
    expect(evalTierraServicio(20)).toBe("ok");
    expect(evalTierraServicio(50)).toBe("condicional");
    expect(evalTierraServicio(81)).toBe("no");
  });
});

describe("Cortocircuito (método convencional, criterio usual)", () => {
  it("Icc máx en el tablero con 3 kA de empalme y 12 m de 6 mm²", () => {
    const r = iccCalc({ Icc0: 3, La: 12, Sa: 6, L: 20, S: 2.5, In: 16, cv: "C", Ig: 25 });
    expect(r.Zs).toBeCloseTo(220 / 3000, 9);
    expect(r.Ra).toBeCloseTo((2 * 0.018 * 12) / 6, 9);
    expect(r.Imax).toBeCloseTo(220 / (220 / 3000 + 0.072), 6);
    expect(r.Im).toBe(160);
    expect(r.okMag).toBe(r.Imin >= 160);
  });
});

describe("Números con formato chileno", () => {
  it.each([
    ["2,5", 2.5],
    ["1.234,5", 1234.5],
    ["1.500", 1500],
    ["1500.5", 1500.5],
    ["", 0],
    ["abc", 0],
  ])("%s → %d", (a, b) => expect(parseNum(a)).toBe(b));
});

import { materialesProyecto, modulosTablero } from "../../src/engine";
describe("Materiales del proyecto", () => {
  it("módulos del tablero con 25 % de reserva", () => {
    expect(modulosTablero(4, false)).toEqual({ usados: 2 + 4 + 4, reserva: 3, tablero: 18 });
    expect(modulosTablero(2, false).tablero).toBe(8);
  });
  it("cable por sección: 3 conductores × (L × 1,1 + 2 m)", () => {
    const B = materialesProyecto({
      tri: false,
      alim: { In: 25, S: 6, L: 12 },
      circuitos: [
        { In: 10, S: 1.5, L: 15, curva: "B" },
        { In: 16, S: 2.5, L: 20, curva: "C" },
        { In: 16, S: 2.5, L: 10, curva: "C" },
      ],
    });
    const q = (k: string) => B.find((b) => b.k === k)?.q;
    expect(q("cab:1.5")).toBe(Math.ceil(3 * (15 * 1.1 + 2)));
    expect(q("cab:2.5")).toBe(Math.ceil(3 * (20 * 1.1 + 2) + 3 * (10 * 1.1 + 2)));
    expect(q("cab:6")).toBe(Math.ceil(3 * (12 * 1.1 + 2)));
    expect(q("dr:A")).toBe(1);
    expect(B.filter((b) => b.k === "tm").reduce((a, b) => a + b.q, 0)).toBe(3);
  });
});

import { serieCaida, largoMaxCaida, coordinacion, sobrecargaSinDisparo } from "../../src/engine";
describe("Demostraciones", () => {
  const p = { k: 2, rho: 0.018, I: 10, Vref: 220 };
  it("la caída crece en línea recta con el largo", () => {
    const s = serieCaida(p, 2.5, 50, 5);
    expect(s[0].pct).toBe(0);
    expect(s[5].pct).toBeCloseTo((2 * 0.018 * 50 * 10) / 2.5 / 2.2, 9);
    expect(s[4].pct / s[2].pct).toBeCloseTo(2, 9);
  });
  it("largo máximo al 3 % con 2,5 mm² y 10 A ≈ 45,8 m", () => {
    expect(largoMaxCaida(p, 2.5, 3)).toBeCloseTo((0.03 * 220 * 2.5) / (2 * 0.018 * 10), 9);
    expect(largoMaxCaida(p, 5, 3)).toBeCloseTo(2 * largoMaxCaida(p, 2.5, 3), 9);
  });
  it("coordinación Is ≤ In ≤ Iz", () => {
    expect(coordinacion(9.09, 16, 18)).toMatchObject({ okCarga: true, okCable: true });
    expect(coordinacion(9.09, 16, 14).okCable).toBe(false);
    expect(coordinacion(15, 16, 18).okCarga).toBe(false);
  });
  it("cable de 14 A con automático de 16 A queda desprotegido", () => {
    expect(sobrecargaSinDisparo(16, 14)).toEqual({ Ilim: 16 * 1.45, excedeCable: true });
  });
});

import { zonaDisparo, simularFalla } from "../../src/engine";
describe("Fallas (curvas IEC 60898 y método convencional)", () => {
  it("zonas de disparo curva C", () => {
    expect(zonaDisparo(1, "C").zona).toBe("sin");
    expect(zonaDisparo(1.3, "C").zona).toBe("lenta");
    expect(zonaDisparo(3, "C").zona).toBe("termica");
    expect(zonaDisparo(7, "C").zona).toBe("transicion");
    expect(zonaDisparo(10, "C").zona).toBe("magnetica");
    expect(zonaDisparo(5, "B").zona).toBe("magnetica");
  });
  const base = {
    In: 16,
    cv: "C",
    Iz: 18,
    Is: 8,
    Zs: 220 / 3000,
    Ra: (2 * 0.018 * 12) / 6,
    Rc: (2 * 0.018 * 20) / 2.5,
    dr: { tiene: true },
    pe: true,
  };
  it("cortocircuito cercano: actúa el magnético", () => {
    const r = simularFalla({ ...base, tipo: "cortocircuito" });
    expect(r.actua).toBe("tm-magnetico");
    expect(r.I).toBeGreaterThan(160);
  });
  it("cortocircuito al final de un circuito muy largo de 1,5 mm²: no llega al magnético", () => {
    const r = simularFalla({ ...base, tipo: "cortocircuito", Rc: (2 * 0.018 * 300) / 1.5 });
    expect(r.actua).not.toBe("tm-magnetico");
    expect(r.nivel).toBe("grave");
  });
  it("cable subdimensionado (Iz 14 A con 16 A): grave", () => {
    expect(simularFalla({ ...base, tipo: "subdimensionado", Iz: 14 }).nivel).toBe("grave");
    expect(simularFalla({ ...base, tipo: "subdimensionado", Iz: 18 }).nivel).toBe("ok");
  });
  it("falla a tierra con diferencial: actúa el diferencial", () => {
    expect(simularFalla({ ...base, tipo: "tierra" }).actua).toBe("dr");
  });
  it("sin tierra y sin diferencial: nada actúa", () => {
    const r = simularFalla({ ...base, tipo: "tierra", pe: false, dr: { tiene: false } });
    expect(r.actua).toBe("ninguno");
    expect(r.Uc).toBe(220);
    expect(r.nivel).toBe("grave");
  });
  it("sobrecarga de 3.000 W sobre 8 A: dispara por térmico", () => {
    const r = simularFalla({ ...base, tipo: "sobrecarga", Pextra: 3000 });
    expect(r.I).toBeCloseTo(8 + 3000 / 220, 9);
    expect(r.actua).toBe("tm-termico");
  });
});
