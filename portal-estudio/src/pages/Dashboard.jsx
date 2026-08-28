import { courses } from '../data/courses.js'
import { useProgress } from '../context/ProgressContext.jsx'
import CourseCard from '../components/CourseCard.jsx'
import Icon from '../components/Icon.jsx'

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

  const stats = [
    { icon: 'Layers', num: courses.length, label: 'Materias' },
    { icon: 'Check', num: `${totals.done}/${totals.total}`, label: 'Temas completados' },
    { icon: 'Target', num: `${globalPercent}%`, label: 'Progreso global' },
  ]

  return (
    <div className="page">
      <section className="hero">
        <span className="hero-eyebrow">
          <Icon name="Sparkles" size={14} /> Tu portal de estudio
        </span>
        <h1>Aprende, practica y repasa</h1>
        <p className="lead">
          Temario estructurado, apuntes, quizzes y flashcards de repaso espaciado.
          Elige una materia para empezar.
        </p>
        <div className="stats-row">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <span className="stat-icon"><Icon name={s.icon} size={18} /></span>
              <div>
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            </div>
          ))}
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
