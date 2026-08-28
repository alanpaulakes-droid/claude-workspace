import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { getCourse, getTopic } from '../data/courses.js'
import { useProgress } from '../context/ProgressContext.jsx'

export default function QuizPage() {
  const { courseId, topicId } = useParams()
  const course = getCourse(courseId)
  const tema = getTopic(courseId, topicId)
  const { saveQuizScore, setTopicComplete } = useProgress()

  const [answers, setAnswers] = useState({}) // { preguntaId: opcionIndex }
  const [submitted, setSubmitted] = useState(false)

  if (!course || !tema || !Array.isArray(tema.quiz) || tema.quiz.length === 0) {
    return <Navigate to={`/curso/${courseId}`} replace />
  }

  const preguntas = tema.quiz
  const allAnswered = preguntas.every((p) => answers[p.id] != null)
  const correctCount = preguntas.filter((p) => answers[p.id] === p.correcta).length

  const choose = (pid, oi) => {
    if (submitted) return
    setAnswers((a) => ({ ...a, [pid]: oi }))
  }

  const submit = () => {
    setSubmitted(true)
    saveQuizScore(courseId, topicId, correctCount, preguntas.length)
    // Aprobado (>=60%) marca el tema como completado.
    if (correctCount / preguntas.length >= 0.6) {
      setTopicComplete(courseId, topicId, true)
    }
  }

  const retry = () => {
    setAnswers({})
    setSubmitted(false)
  }

  const pct = Math.round((correctCount / preguntas.length) * 100)
  const passed = pct >= 60

  return (
    <div className="page quiz" style={{ '--accent': course.color }}>
      <nav className="breadcrumb">
        <Link to={`/curso/${courseId}`}>{course.titulo}</Link>
        <span aria-hidden="true"> / </span>
        <Link to={`/curso/${courseId}/tema/${topicId}`}>{tema.titulo}</Link>
        <span aria-hidden="true"> / </span>
        <span>Quiz</span>
      </nav>

      <h1>Quiz · {tema.titulo}</h1>

      {submitted && (
        <div className={`quiz-result ${passed ? 'ok' : 'ko'}`}>
          <strong>{correctCount}/{preguntas.length}</strong> correctas ({pct}%)
          {' — '}
          {passed ? '¡Aprobado! Tema marcado como completado.' : 'Sigue repasando y vuelve a intentarlo.'}
        </div>
      )}

      <ol className="quiz-list">
        {preguntas.map((p, qi) => {
          const chosen = answers[p.id]
          return (
            <li key={p.id} className="quiz-q">
              <p className="quiz-q-text">
                <span className="quiz-q-num">{qi + 1}.</span> {p.pregunta}
              </p>
              <div className="quiz-options">
                {p.opciones.map((op, oi) => {
                  const isChosen = chosen === oi
                  const isCorrect = p.correcta === oi
                  let cls = 'quiz-option'
                  if (submitted) {
                    if (isCorrect) cls += ' correct'
                    else if (isChosen) cls += ' wrong'
                  } else if (isChosen) {
                    cls += ' selected'
                  }
                  return (
                    <button
                      type="button"
                      key={oi}
                      className={cls}
                      onClick={() => choose(p.id, oi)}
                      disabled={submitted}
                    >
                      <span className="quiz-bullet" aria-hidden="true">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {op}
                    </button>
                  )
                })}
              </div>
              {submitted && p.explicacion && (
                <p className="quiz-explain">
                  {chosen === p.correcta ? '✓' : '✗'} {p.explicacion}
                </p>
              )}
            </li>
          )
        })}
      </ol>

      <div className="quiz-actions">
        {!submitted ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={submit}
            disabled={!allAnswered}
          >
            {allAnswered ? 'Corregir' : `Responde las ${preguntas.length} preguntas`}
          </button>
        ) : (
          <>
            <button type="button" className="btn btn-ghost" onClick={retry}>
              Reintentar
            </button>
            <Link to={`/curso/${courseId}`} className="btn btn-accent">
              Volver al temario →
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
