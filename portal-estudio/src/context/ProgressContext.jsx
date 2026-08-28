import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadJSON, saveJSON } from '../lib/storage.js'
import { courses } from '../data/courses.js'
import { newCardState, reviewCard } from '../lib/srs.js'

const ProgressContext = createContext(null)

const DEFAULT = {
  completedTopics: {},   // { "cursoId/temaId": true }
  quizScores: {},        // { "cursoId/temaId": { correct, total, at } }
  cardStates: {},        // { "cursoId/cardId": {box,dueAt,...} }
}

export function ProgressProvider({ children }) {
  const [state, setState] = useState(() => ({ ...DEFAULT, ...loadJSON('progress', {}) }))

  // Persistir cada cambio.
  useEffect(() => {
    saveJSON('progress', state)
  }, [state])

  const api = useMemo(() => {
    const topicKey = (courseId, topicId) => `${courseId}/${topicId}`
    const cardKey = (courseId, cardId) => `${courseId}/${cardId}`

    return {
      // --- Temas completados ---
      isTopicComplete: (courseId, topicId) =>
        !!state.completedTopics[topicKey(courseId, topicId)],

      toggleTopicComplete: (courseId, topicId) =>
        setState((s) => {
          const key = topicKey(courseId, topicId)
          const completedTopics = { ...s.completedTopics }
          if (completedTopics[key]) delete completedTopics[key]
          else completedTopics[key] = true
          return { ...s, completedTopics }
        }),

      setTopicComplete: (courseId, topicId, value) =>
        setState((s) => {
          const key = topicKey(courseId, topicId)
          const completedTopics = { ...s.completedTopics }
          if (value) completedTopics[key] = true
          else delete completedTopics[key]
          return { ...s, completedTopics }
        }),

      // --- Resultados de quizzes ---
      getQuizScore: (courseId, topicId) =>
        state.quizScores[topicKey(courseId, topicId)] || null,

      saveQuizScore: (courseId, topicId, correct, total) =>
        setState((s) => ({
          ...s,
          quizScores: {
            ...s.quizScores,
            [topicKey(courseId, topicId)]: { correct, total, at: Date.now() },
          },
        })),

      // --- Flashcards (repaso espaciado) ---
      getCardState: (courseId, cardId) =>
        state.cardStates[cardKey(courseId, cardId)] || newCardState(),

      reviewFlashcard: (courseId, cardId, correct) =>
        setState((s) => {
          const key = cardKey(courseId, cardId)
          return {
            ...s,
            cardStates: {
              ...s.cardStates,
              [key]: reviewCard(s.cardStates[key], correct),
            },
          }
        }),

      // --- Estadísticas por curso ---
      courseProgress: (courseId) => {
        const course = courses.find((c) => c.id === courseId)
        if (!course) return { done: 0, total: 0, percent: 0 }
        const total = course.temas.length
        const done = course.temas.filter(
          (t) => state.completedTopics[topicKey(courseId, t.id)],
        ).length
        return { done, total, percent: total ? Math.round((done / total) * 100) : 0 }
      },

      // --- Reset global ---
      resetAll: () => setState({ ...DEFAULT }),
    }
  }, [state])

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress debe usarse dentro de <ProgressProvider>')
  return ctx
}
