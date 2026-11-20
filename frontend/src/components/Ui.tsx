import type { ReactNode } from 'react';

export const Loading = () => <div className="loading" role="status" aria-live="polite"><span className="spinner-border spinner-border-sm" aria-hidden="true" /> Loading...</div>;
export const Alert = ({ message }: { message: string }) => message ? <div className="alert alert-danger py-2 d-flex flex-wrap align-items-center gap-2" role="alert" aria-live="assertive">
  <span>{message}</span>
  {/unlock your workspace|workspace locked|workspace is locked/i.test(message) && <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => window.dispatchEvent(new Event('mediflow:request-unlock'))}>Unlock workspace</button>}
</div> : null;
/** Small note shown with a locked button, saying what is still needed. */
export const LockedReason = ({ reason }: { reason?: string }) => reason ? <small className="locked-reason" role="note"><i className="bi bi-lock-fill" aria-hidden="true" /><span>{reason}</span></small> : null;
export const Empty = ({ text = 'No records found.' }: { text?: string }) => <div className="empty-state"><i className="bi bi-inbox" /><p>{text}</p></div>;
export const Status = ({ value }: { value: string }) => <span className={`status status-${value.toLowerCase().replaceAll('_', '-')}`}>{value.replaceAll('_', ' ')}</span>;
export function Metric({ label, value, icon, tone = 'teal' }: { label: string; value: ReactNode; icon: string; tone?: string }) {
  return <div className="metric-card"><span className={`metric-icon ${tone}`}><i className={`bi bi-${icon}`} /></span><div><small>{label}</small><strong>{value}</strong></div></div>;
}
