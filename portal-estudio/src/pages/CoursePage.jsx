import { useParams, Link, Navigate } from 'react-router-dom'
import { getCourse } from '../data/courses.js'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import Icon from '../components/Icon.jsx'

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
        <span className="icon-badge icon-badge-lg" aria-hidden="true">
          <Icon name={course.icon} size={30} strokeWidth={2.1} />
        </span>
        <div className="course-header-text">
          <h1>{course.titulo}</h1>
          <p className="lead">{course.descripcion}</p>
        </div>
      </div>

      <div className="course-progress-box">
        <div className="course-meta-row">
          <span className="course-meta">{done}/{total} temas completados</span>
          <span className="course-meta course-percent">{percent}%</span>
        </div>
        <ProgressBar percent={percent} color={course.color} />
      </div>

      {hasCards && (
        <Link to={`/curso/${course.id}/flashcards`} className="btn btn-accent flashcards-cta">
          <Icon name="Layers" size={18} /> Repasar con flashcards ({course.flashcards.length})
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
                <span className="topic-index">
                  {complete ? <Icon name="Check" size={17} strokeWidth={2.6} /> : i + 1}
                </span>
                <span className="topic-body">
                  <span className="topic-title">{tema.titulo}</span>
                  <span className="topic-summary">{tema.resumen}</span>
                  {score && (
                    <span className="topic-score">
                      <Icon name="Trophy" size={13} /> Quiz: {score.correct}/{score.total}
                    </span>
                  )}
                </span>
                <span className="topic-go" aria-hidden="true">
                  <Icon name="ChevronRight" size={20} />
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
