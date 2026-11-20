// Takes the "one person at a time" lock when a record is opened for editing, and shows a message if
// someone else has it.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { api, errorMessage } from '../api/client';
import { beginWorkflowClaim, denyWorkflowClaim, setWorkflowLeaseToken, workflowLeaseToken } from '../api/workflowState';
import { Modal } from './Modal';

/** Keeps a form mounted, but inaccessible until exclusive editing is granted. */
export function WorkflowGuard({ resource, onCancel, children }: { resource: string | null; onCancel(): void; children: ReactNode }) {
  const [readyFor, setReadyFor] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);
  const [canRegain, setCanRegain] = useState(false);
  const retry = useRef<() => void>(() => {});
  const cancel = useRef(onCancel); cancel.current = onCancel;
  useEffect(() => {
    if (!resource) { setReadyFor(null); setError(''); return; }
    let alive = true, token: string | null = null, renewing = false, failed = false;
    beginWorkflowClaim();
    setReadyFor(null); setError(''); setCanRegain(false);
    const release = (value: string) => api.delete(`/workflow-locks/${resource}`, { data: { token: value } }).catch(() => {});
    const acquire = async () => {
      if (renewing) return; renewing = true; setRetrying(true);
      try {
        const response = await api.post(`/workflow-locks/${resource}`, token ? { token } : {});
        const granted = response.data.data.token as string;
        if (!alive) { void release(granted); return; }
        token = granted; failed = false; setError(''); setCanRegain(true); setWorkflowLeaseToken(token); setReadyFor(resource);
      } catch (e) {
        if (alive) { failed = true; denyWorkflowClaim(); setReadyFor(null); setError(errorMessage(e)); }
      } finally { renewing = false; if (alive) setRetrying(false); }
    };
    // Only renew the original lease. Never acquire a replacement over stale form data.
    retry.current = () => { if (alive && token) void acquire(); };
    // Avoid duplicate claims during React's development effect replay.
    const start = window.setTimeout(() => void acquire(), 0);
    const heartbeat = window.setInterval(() => { if (alive && token && !failed) void acquire(); }, 25_000);
    const conflict = (event: Event) => { failed = true; denyWorkflowClaim(); setReadyFor(null); setError(String((event as CustomEvent).detail)); };
    window.addEventListener('mediflow:workflow-conflict', conflict);
    return () => {
      alive = false; clearTimeout(start); clearInterval(heartbeat);
      retry.current = () => {};
      window.removeEventListener('mediflow:workflow-conflict', conflict);
      if (workflowLeaseToken() === token) setWorkflowLeaseToken(null);
      if (token) void release(token);
    };
  }, [resource]);
  const blocked = Boolean(resource && readyFor !== resource);
  return <>
    <div inert={blocked} style={blocked ? { visibility: 'hidden' } : undefined}>{children}</div>
    {blocked && <Modal title={error ? 'Request is unavailable' : 'Checking editing access'} onClose={() => cancel.current()} size="sm">
      <p role="status">{error || 'Checking whether someone else is editing or processing this request…'}</p>
      {error && <p>{canRegain ? 'After unlocking your session, you can recheck your existing editing access. If it has expired or someone else has taken over, close this form and refresh the list before reopening it.' : 'Close this form and refresh the list before reopening it.'} No changes have been submitted by this check.</p>}
      {error && canRegain && <button type="button" className="btn btn-primary me-2" disabled={retrying} onClick={() => retry.current()}>{retrying ? 'Checking access…' : 'Regain editing access'}</button>}
      <button type="button" className="btn btn-light" onClick={() => cancel.current()}>Close form</button>
    </Modal>}
  </>;
}
