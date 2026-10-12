import type { ReactNode } from 'react';

export const Loading = () => <div className="loading" role="status" aria-live="polite"><span className="spinner-border spinner-border-sm" aria-hidden="true" /> Loading...</div>;
export const Alert = ({ message }: { message: string }) => message ? <div className="alert alert-danger py-2" role="alert" aria-live="assertive">{message}</div> : null;
export const Empty = ({ text = 'No records found.' }: { text?: string }) => <div className="empty-state"><i className="bi bi-inbox" /><p>{text}</p></div>;
export const Status = ({ value }: { value: string }) => <span className={`status status-${value.toLowerCase().replaceAll('_', '-')}`}>{value.replaceAll('_', ' ')}</span>;
export function Metric({ label, value, icon, tone = 'teal' }: { label: string; value: ReactNode; icon: string; tone?: string }) {
  return <div className="metric-card"><span className={`metric-icon ${tone}`}><i className={`bi bi-${icon}`} /></span><div><small>{label}</small><strong>{value}</strong></div></div>;
}
