/**
 * Teoría de colas M/M/c — motor de cálculo en TypeScript puro.
 *
 * Modelo: llegadas Poisson (tasa λ), tiempos de servicio exponenciales
 * (tasa μ por servidor), c servidores idénticos, disciplina FIFO, cola
 * infinita. Es el corazón del "Simulador Arena Lite" de INDUSHUB.
 *
 * Todas las tasas se expresan en clientes/hora. Los tiempos resultantes
 * (Wq, W) se devuelven en horas.
 */

export interface MMcInput {
  /** λ — tasa de llegada (clientes/hora) */
  lambda: number;
  /** μ — tasa de servicio por servidor (clientes/hora) */
  mu: number;
  /** c — número de servidores */
  servers: number;
}

export interface MMcResult {
  /** ¿El sistema es estable? (ρ < 1) */
  stable: boolean;
  /** a = λ/μ — carga ofrecida en Erlangs (servidores ocupados en promedio) */
  offeredLoad: number;
  /** ρ = λ/(c·μ) — utilización del sistema (0–1) */
  rho: number;
  /** P0 — probabilidad de que el sistema esté vacío */
  p0: number;
  /** Pw — probabilidad de que un cliente tenga que esperar (Erlang C) */
  probWait: number;
  /** Lq — número promedio de clientes en cola */
  lq: number;
  /** L — número promedio de clientes en el sistema */
  l: number;
  /** Wq — tiempo promedio de espera en cola (horas) */
  wq: number;
  /** W — tiempo promedio en el sistema (horas) */
  w: number;
  /** Servidores ocupados en promedio (= a, acotado a c) */
  busyServers: number;
}

/** Factorial iterativo seguro para c pequeños/medianos. */
function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

/** Resultado trivial (sistema vacío o entradas inválidas). */
function emptyResult(stable: boolean): MMcResult {
  return {
    stable,
    offeredLoad: 0,
    rho: 0,
    p0: 1,
    probWait: 0,
    lq: 0,
    l: 0,
    wq: 0,
    w: 0,
    busyServers: 0,
  };
}

/**
 * Resuelve el modelo M/M/c y devuelve las métricas de desempeño.
 * Robusto ante entradas inválidas (NaN, negativos) y sistemas inestables.
 */
export function solveMMc(input: MMcInput): MMcResult {
  const lambda = Number.isFinite(input.lambda) ? Math.max(0, input.lambda) : 0;
  const mu = Number.isFinite(input.mu) ? Math.max(0, input.mu) : 0;
  const servers = Number.isFinite(input.servers)
    ? Math.max(1, Math.floor(input.servers))
    : 1;

  // Sin llegadas o sin capacidad de servicio → caso trivial.
  if (lambda === 0 || mu === 0) return emptyResult(mu > 0);

  const a = lambda / mu; // carga ofrecida (Erlangs)
  const rho = a / servers; // utilización por servidor

  // Sistema inestable: la cola crece sin límite.
  if (rho >= 1) {
    return {
      ...emptyResult(false),
      offeredLoad: a,
      rho,
      p0: 0,
      probWait: 1,
      lq: Infinity,
      l: Infinity,
      wq: Infinity,
      w: Infinity,
      busyServers: servers,
    };
  }

  // P0 = 1 / [ Σ_{n=0}^{c-1} aⁿ/n!  +  (a^c / c!)·(1/(1-ρ)) ]
  let sum = 0;
  for (let n = 0; n < servers; n += 1) {
    sum += Math.pow(a, n) / factorial(n);
  }
  const lastTerm = (Math.pow(a, servers) / factorial(servers)) * (1 / (1 - rho));
  const p0 = 1 / (sum + lastTerm);

  // Pw (Erlang C) = (a^c / (c!·(1-ρ))) · P0
  const probWait =
    (Math.pow(a, servers) / (factorial(servers) * (1 - rho))) * p0;

  // Lq = Pw · ρ / (1 - ρ)
  const lq = (probWait * rho) / (1 - rho);

  // Little: Wq = Lq/λ ; W = Wq + 1/μ ; L = λ·W
  const wq = lq / lambda;
  const w = wq + 1 / mu;
  const l = lambda * w;

  return {
    stable: true,
    offeredLoad: a,
    rho,
    p0,
    probWait,
    lq,
    l,
    wq,
    w,
    busyServers: Math.min(servers, a),
  };
}

/** Convierte horas a un texto legible (h / min / s). */
export function formatDuration(hours: number): string {
  if (!Number.isFinite(hours)) return '∞';
  if (hours <= 0) return '0 min';
  const totalMinutes = hours * 60;
  if (totalMinutes < 1) return `${(totalMinutes * 60).toFixed(0)} s`;
  if (totalMinutes < 60) return `${totalMinutes.toFixed(1)} min`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h} h ${m} min`;
}

/** Redondea un número finito a los decimales dados; ∞ para no finitos. */
export function fmt(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '∞';
  return value.toFixed(decimals);
}
