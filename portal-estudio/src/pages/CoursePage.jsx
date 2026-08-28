import { useParams, Link, Navigate } from 'react-router-dom'
import { getCourse } from '../data/courses.js'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressBar from '../components/ProgressBar.jsx'

export default function CoursePage() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const { isTopicComplete, getQuizScore, courseProgress } = useProgress()

  if (!course) return <Navigate to="/404" replace />

  const { done, total, percent } = courseProgress(course.id)
  const hasCards = Array.isArray(course.flashcards) && course.flashcards.length > 0

  return (
    <div className="page" style={{ '--accent': course.color }}>
      <div className="course-header">
        <span className="course-emoji-lg" aria-hidden="true">{course.emoji}</span>
        <div className="course-header-text">
          <h1>{course.titulo}</h1>
          <p className="lead">{course.descripcion}</p>
        </div>
      </div>

      <div className="course-progress-box">
        <ProgressBar percent={percent} color={course.color} />
        <span className="course-meta">{done}/{total} temas · {percent}%</span>
      </div>

      {hasCards && (
        <Link to={`/curso/${course.id}/flashcards`} className="btn btn-accent flashcards-cta">
          🎴 Repasar con flashcards ({course.flashcards.length})
        </Link>
      )}

      <h2 className="section-title">Temario</h2>
      <ol className="topic-list">
        {course.temas.map((tema, i) => {
          const complete = isTopicComplete(course.id, tema.id)
          const score = getQuizScore(course.id, tema.id)
          return (
            <li key={tema.id} className={`topic-item ${complete ? 'is-complete' : ''}`}>
              <Link to={`/curso/${course.id}/tema/${tema.id}`} className="topic-link">
                <span className="topic-index">{complete ? '✓' : i + 1}</span>
                <span className="topic-body">
                  <span className="topic-title">{tema.titulo}</span>
                  <span className="topic-summary">{tema.resumen}</span>
                  {score && (
                    <span className="topic-score">
                      Quiz: {score.correct}/{score.total}
                    </span>
                  )}
                </span>
                <span className="topic-go" aria-hidden="true">›</span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
