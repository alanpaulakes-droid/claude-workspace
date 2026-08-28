import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressBar from './ProgressBar.jsx'
import Icon from './Icon.jsx'

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
        <span className="icon-badge" aria-hidden="true">
          <Icon name={course.icon} size={24} strokeWidth={2.1} />
        </span>
        <div className="course-card-headtext">
          <h3 className="course-title">{course.titulo}</h3>
          <p className="course-desc">{course.descripcion}</p>
        </div>
      </div>
      <div className="course-card-foot">
        <div className="course-meta-row">
          <span className="course-meta">{done}/{total} temas</span>
          <span className="course-meta course-percent">{percent}%</span>
        </div>
        <ProgressBar percent={percent} color={course.color} />
      </div>
    </Link>
  )
}
