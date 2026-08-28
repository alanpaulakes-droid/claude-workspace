import { useParams, Link, Navigate } from 'react-router-dom'
import { getCourse, getTopic } from '../data/courses.js'
import { useProgress } from '../context/ProgressContext.jsx'
import Icon from '../components/Icon.jsx'

function ContentBlock({ block }) {
  switch (block.tipo) {
    case 'h':
      return <h3 className="lesson-h">{block.texto}</h3>
    case 'p':
      return <p className="lesson-p">{block.texto}</p>
    case 'ul':
      return (
        <ul className="lesson-ul">
          {block.items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      )
    case 'ol':
      return (
        <ol className="lesson-ol">
          {block.items.map((it, i) => <li key={i}>{it}</li>)}
        </ol>
      )
    case 'nota':
      return (
        <div className="lesson-note">
          <Icon name="Lightbulb" size={18} className="lesson-note-icon" />
          <span>{block.texto}</span>
        </div>
      )
    case 'code':
      return <pre className="lesson-code"><code>{block.texto}</code></pre>
    default:
      return null
  }
}

export default function LessonPage() {
  const { courseId, topicId } = useParams()
  const course = getCourse(courseId)
  const tema = getTopic(courseId, topicId)
  const { isTopicComplete, toggleTopicComplete, getQuizScore } = useProgress()

  if (!course || !tema) return <Navigate to="/404" replace />

  const complete = isTopicComplete(courseId, topicId)
  const score = getQuizScore(courseId, topicId)
  const hasQuiz = Array.isArray(tema.quiz) && tema.quiz.length > 0
  const idx = course.temas.findIndex((t) => t.id === topicId)
  const next = course.temas[idx + 1]

  return (
    <div className="page lesson" style={{ '--accent': course.color }}>
      <nav className="breadcrumb">
        <Link to={`/curso/${courseId}`}>{course.titulo}</Link>
        <span aria-hidden="true"> / </span>
        <span>{tema.titulo}</span>
      </nav>

      <h1>{tema.titulo}</h1>
      <p className="lead">{tema.resumen}</p>

      <article className="lesson-content">
        {tema.contenido.map((block, i) => (
          <ContentBlock key={i} block={block} />
        ))}
      </article>

      <div className="lesson-actions">
        <button
          type="button"
          className={`btn ${complete ? 'btn-ghost' : 'btn-accent'}`}
          onClick={() => toggleTopicComplete(courseId, topicId)}
        >
          <Icon name="Check" size={17} strokeWidth={2.6} />
          {complete ? 'Completado — desmarcar' : 'Marcar como completado'}
        </button>

        {hasQuiz && (
          <Link to={`/curso/${courseId}/tema/${topicId}/quiz`} className="btn btn-primary">
            {score ? `Repetir quiz (${score.correct}/${score.total})` : 'Hacer el quiz'}
            <Icon name="ArrowRight" size={17} />
          </Link>
        )}
      </div>

      <div className="lesson-nav">
        {next ? (
          <Link to={`/curso/${courseId}/tema/${next.id}`} className="btn btn-ghost">
            Siguiente tema: {next.titulo} <Icon name="ArrowRight" size={16} />
          </Link>
        ) : (
          <Link to={`/curso/${courseId}`} className="btn btn-ghost">
            <Icon name="ArrowLeft" size={16} /> Volver al temario
          </Link>
        )}
      </div>
    </div>
  )
}
