import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page notfound">
      <h1>404</h1>
      <p className="lead">No encontramos esa página.</p>
      <Link to="/" className="btn btn-accent">← Volver al inicio</Link>
    </div>
  )
}
