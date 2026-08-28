import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="brand" aria-label="Inicio">
          <span className="brand-mark">📚</span>
          <span className="brand-text">Portal de Estudio</span>
        </Link>
        {!onHome && (
          <Link to="/" className="btn btn-ghost btn-sm">
            ← Inicio
          </Link>
        )}
      </div>
    </header>
  )
}
