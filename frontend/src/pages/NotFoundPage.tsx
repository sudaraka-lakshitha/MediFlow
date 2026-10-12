import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return <main className="not-found-page">
    <div className="not-found-card">
      <span className="not-found-icon" aria-hidden="true"><i className="bi bi-signpost-split" /></span>
      <p className="eyebrow">Page not found</p>
      <h1>We could not find that workspace page.</h1>
      <p>The link may be outdated, or your account may not have access to it.</p>
      <Link className="btn btn-primary" to="/"><i className="bi bi-grid-1x2-fill me-2" />Return to dashboard</Link>
    </div>
  </main>;
}
