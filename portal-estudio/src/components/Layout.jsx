import Navbar from './Navbar.jsx'

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container">{children}</main>
      <footer className="site-footer">
        <span>Portal de Estudio · tu progreso se guarda en este dispositivo.</span>
      </footer>
    </div>
  )
}
