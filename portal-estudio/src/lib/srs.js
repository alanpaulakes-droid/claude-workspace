// Repaso espaciado simplificado (inspirado en SM-2 / Leitner).
// Cada tarjeta guarda: box (nivel), dueAt (timestamp), lastResult.
// Al acertar sube de caja (repaso más espaciado); al fallar vuelve a la caja 1.

const DAY = 24 * 60 * 60 * 1000

// Intervalos en días según la caja (Leitner de 5 niveles).
const INTERVALS = [0, 1, 2, 4, 8, 16]

export function newCardState() {
  return { box: 0, dueAt: 0, lastResult: null, reviews: 0 }
}

export function reviewCard(state, correct) {
  const s = state || newCardState()
  const box = correct ? Math.min(s.box + 1, INTERVALS.length - 1) : 1
  const intervalDays = INTERVALS[box]
  return {
    box,
    dueAt: Date.now() + intervalDays * DAY,
    lastResult: correct ? 'correct' : 'wrong',
    reviews: (s.reviews || 0) + 1,
  }
}

export function isDue(state, now = Date.now()) {
  if (!state || state.reviews === 0) return true // nunca repasada
  return (state.dueAt || 0) <= now
}

// Ordena las tarjetas: primero las vencidas/nuevas, luego por fecha de repaso.
export function sortByDue(cards, states, now = Date.now()) {
  return [...cards].sort((a, b) => {
    const da = isDue(states[a.id], now) ? 0 : 1
    const db = isDue(states[b.id], now) ? 0 : 1
    if (da !== db) return da - db
    return (states[a.id]?.dueAt || 0) - (states[b.id]?.dueAt || 0)
  })
}
