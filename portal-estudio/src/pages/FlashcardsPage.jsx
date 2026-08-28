import { useMemo, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { getCourse } from '../data/courses.js'
import { useProgress } from '../context/ProgressContext.jsx'
import { sortByDue, isDue } from '../lib/srs.js'
import Icon from '../components/Icon.jsx'

export default function FlashcardsPage() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const { getCardState, reviewFlashcard } = useProgress()

  const cards = course?.flashcards || []

  // Estados actuales de las tarjetas (para ordenar por vencimiento).
  const cardStates = useMemo(() => {
    const map = {}
    cards.forEach((c) => { map[c.id] = getCardState(courseId, c.id) })
    return map
  }, [cards, courseId, getCardState])

  // Orden fijo por sesión: se calcula una vez al montar.
  const [ordered] = useState(() => sortByDue(cards, cardStates))
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [reviewed, setReviewed] = useState({ correct: 0, wrong: 0 })

  if (!course || cards.length === 0) return <Navigate to={`/curso/${courseId}`} replace />

  const dueCount = cards.filter((c) => isDue(cardStates[c.id])).length
  const done = pos >= ordered.length
  const card = ordered[pos]

  const answer = (correct) => {
    reviewFlashcard(courseId, card.id, correct)
    setReviewed((r) => ({
      correct: r.correct + (correct ? 1 : 0),
      wrong: r.wrong + (correct ? 0 : 1),
    }))
    setFlipped(false)
    setPos((p) => p + 1)
  }

  return (
    <div className="page flashcards" style={{ '--accent': course.color }}>
      <nav className="breadcrumb">
        <Link to={`/curso/${courseId}`}>{course.titulo}</Link>
        <span aria-hidden="true"> / </span>
        <span>Flashcards</span>
      </nav>

      <div className="fc-head">
        <h1>Flashcards</h1>
        <p className="lead">
          {dueCount > 0
            ? `${dueCount} tarjeta(s) para repasar hoy · ${cards.length} en total.`
            : `Todo al día. Repasando las ${cards.length} tarjetas.`}
        </p>
      </div>

      {done ? (
        <div className="fc-done">
          <div className="fc-done-icon" aria-hidden="true"><Icon name="Trophy" size={34} /></div>
          <h2>Sesión completada</h2>
          <p className="lead">{reviewed.correct} acertadas · {reviewed.wrong} para reforzar.</p>
          <div className="fc-done-actions">
            <Link to={`/curso/${courseId}`} className="btn btn-accent">
              <Icon name="ArrowLeft" size={16} /> Volver al temario
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="fc-counter">
            Tarjeta {pos + 1} de {ordered.length}
          </div>

          <button
            type="button"
            className={`flashcard ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? 'Ver frente' : 'Ver respuesta'}
          >
            <div className="flashcard-inner">
              <div className="flashcard-face flashcard-front">
                <span className="fc-label">Pregunta</span>
                <p>{card.frente}</p>
                <span className="fc-hint">Toca para ver la respuesta</span>
              </div>
              <div className="flashcard-face flashcard-back">
                <span className="fc-label">Respuesta</span>
                <p>{card.reverso}</p>
              </div>
            </div>
          </button>

          {flipped ? (
            <div className="fc-grade">
              <p className="fc-grade-q">¿Cómo te fue?</p>
              <div className="fc-grade-btns">
                <button type="button" className="btn btn-wrong" onClick={() => answer(false)}>
                  <Icon name="X" size={17} strokeWidth={2.6} /> Falta repasar
                </button>
                <button type="button" className="btn btn-right" onClick={() => answer(true)}>
                  <Icon name="Check" size={17} strokeWidth={2.6} /> Lo sabía
                </button>
              </div>
            </div>
          ) : (
            <p className="fc-tip">Piensa la respuesta y luego voltea la tarjeta.</p>
          )}
        </>
      )}
    </div>
  )
}
