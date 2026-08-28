import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressBar from './ProgressBar.jsx'

export default function CourseCard({ course }) {
  const { courseProgress } = useProgress()
  const { done, total, percent } = courseProgress(course.id)

  return (
    <Link
      to={`/curso/${course.id}`}
      className="card course-card"
      style={{ '--accent': course.color }}
    >
      <div className="course-card-head">
        <span className="course-emoji" aria-hidden="true">{course.emoji}</span>
        <div>
          <h3 className="course-title">{course.titulo}</h3>
          <p className="course-desc">{course.descripcion}</p>
        </div>
      </div>
      <div className="course-card-foot">
        <ProgressBar percent={percent} color={course.color} />
        <span className="course-meta">
          {done}/{total} temas · {percent}%
        </span>
      </div>
    </Link>
  )
}
