import { courses } from '../data/courses.js'
import { useProgress } from '../context/ProgressContext.jsx'
import CourseCard from '../components/CourseCard.jsx'

export default function Dashboard() {
  const { courseProgress } = useProgress()

  const totals = courses.reduce(
    (acc, c) => {
      const p = courseProgress(c.id)
      acc.done += p.done
      acc.total += p.total
      return acc
    },
    { done: 0, total: 0 },
  )
  const globalPercent = totals.total ? Math.round((totals.done / totals.total) * 100) : 0

  return (
    <div className="page">
      <section className="hero">
        <h1>Aprende, practica y repasa</h1>
        <p className="lead">
          Un portal con temario estructurado, apuntes, quizzes y flashcards de repaso
          espaciado. Elige una materia para empezar.
        </p>
        <div className="stats-row">
          <div className="stat">
            <span className="stat-num">{courses.length}</span>
            <span className="stat-label">Materias</span>
          </div>
          <div className="stat">
            <span className="stat-num">{totals.done}/{totals.total}</span>
            <span className="stat-label">Temas completados</span>
          </div>
          <div className="stat">
            <span className="stat-num">{globalPercent}%</span>
            <span className="stat-label">Progreso global</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">Materias</h2>
        <div className="grid">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>
    </div>
  )
}
