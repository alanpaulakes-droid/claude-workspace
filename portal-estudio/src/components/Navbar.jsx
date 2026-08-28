import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'

function Logo() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7c83ff" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="9" fill="url(#lg)" />
        <path
          d="M16 8.5 L23 12 L16 15.5 L9 12 Z"
          fill="#fff" opacity="0.95"
        />
        <path
          d="M11 14.2 v4.1 c0 1.6 2.4 2.9 5 2.9 s5-1.3 5-2.9 v-4.1"
          stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round"
        />
        <circle cx="23" cy="12" r="1.1" fill="#fff" />
        <path d="M23 12 v4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="brand" aria-label="Inicio">
          <Logo />
          <span className="brand-text">Portal de Estudio</span>
        </Link>
        {!onHome && (
          <Link to="/" className="btn btn-ghost btn-sm">
            <Icon name="ArrowLeft" size={16} /> Inicio
          </Link>
        )}
      </div>
    </header>
  )
}
