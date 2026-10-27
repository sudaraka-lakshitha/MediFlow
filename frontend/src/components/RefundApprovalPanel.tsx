import { useCallback, useEffect, useState } from 'react';
import { api, errorMessage } from '../api/client';
import { useAuth } from '../auth/useAuth';
import { Modal } from './Modal';
import { Alert } from './Ui';
import { SearchableSelect } from './SearchableSelect';
import { stockQuantityStep } from '../utils/unitMeasure';
import { WorkflowGuard } from './WorkflowGuard';
const money = (value: unknown) => `Rs. ${Number(value || 0).toFixed(2)}`;

export function RefundApprovalPanel({ onDecision }: { onDecision: () => Promise<unknown> }) {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]), [options, setOptions] = useState<any[]>([]);
  const [page, setPage] = useState(1), [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState('PENDING');
  const [draft, setDraft] = useState<any>(null), [preview, setPreview] = useState<any>(null), [decision, setDecision] = useState<any>(null);
  const [error, setError] = useState(''), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const load = useCallback(async () => {
    try { const response = await api.get('/refund-approvals', { params: { page, pageSize: 20, status } }); setRows(response.data.data); setHasMore(response.data.pagination.hasMore); }
    catch (caught) { setError(errorMessage(caught)); }
  }, [page, status]);
  useEffect(() => { void load(); }, [load]);
  const search = useCallback(async (query: string) => {
    try { const response = await api.get('/refund-approvals/options', { params: { search: query } }); setOptions(response.data.data); }
    catch (caught) { setError(errorMessage(caught)); }
  }, []);
  const payload = () => ({ revision: draft.bill.revision, reason: draft.reason, ...(draft.partial ? { itemIds: Object.keys(draft.quantities).filter(id => Number(draft.quantities[id]) > 0).map(Number), quantities: Object.fromEntries(Object.entries(draft.quantities).filter(([,qty]) => Number(qty) > 0).map(([id,qty]) => [id, Number(qty)])) } : {}) });
  const perform = async (action: () => Promise<unknown>) => { if (busy) return; setBusy(true); setError(''); try { await action(); } catch (caught) { setError(errorMessage(caught)); } finally { setBusy(false); } };
  return <WorkflowGuard resource={draft?.bill?.id || decision?.paymentRequestId ? `payment/${draft?.bill?.id || decision?.paymentRequestId}` : null} onCancel={() => { setPreview(null); setDraft(null); setDecision(null); }}>
    <details className="border rounded p-3 mt-3" open={user?.role === 'ADMIN'}><summary className="fw-bold">Administrator refund approvals</summary>
      <p className="small mt-2">Escalate paid, uncollected invoices that staff cannot refund directly. Completed sales use the return/refund process below. Approval creates a pending payout; it never transfers money.</p>
      <Alert message={error} />{message && <p role="status" className="text-success">{message}</p>}
      <button className="btn btn-outline-primary me-2" disabled={busy} onClick={() => { setError(''); setPreview(null); setDraft({ bill: null, reason: '', partial: false, quantities: {} }); }}>Request administrator approval</button>
      <button className="btn btn-outline-secondary" disabled={busy} onClick={() => void load()}>Refresh requests</button>
      <label className="d-block mt-3">Approval status<select className="form-select" value={status} onChange={event => { setStatus(event.target.value); setPage(1); }}><option value="PENDING">Pending administrator review</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select></label>
      {rows.map(row => <article className="border-top pt-2 mt-2" key={row.id}>
        <strong>{row.requestNumber} · {money(row.amount)} · {row.status}</strong><p className="mb-1">{row.reason}</p>
        {row.selection.lines.map((line: any) => <div className="small" key={line.id}>{line.name} × {line.quantity}</div>)}
        {row.selection.includesDeliveryFee && <p className="small">Includes the paid, pre-dispatch delivery fee.</p>}
        <small>Requested by staff #{row.requestedById} · {new Date(row.createdAt).toLocaleString()}</small>
        {row.decisionReason && <p>Decision: {row.decisionReason}</p>}
        {user?.role === 'ADMIN' && row.status === 'PENDING' && row.requestedById !== user.id && <button className="btn btn-sm btn-outline-primary ms-2" disabled={busy} onClick={() => setDecision({ ...row, approved: false, reason: '' })}>Review request</button>}
        {row.status === 'PENDING' && row.requestedById === user?.id && <p className="small">A different administrator must review this request.</p>}
      </article>)}
      {!rows.length && <p className="mt-2">No approval requests on this page.</p>}
      <div className="d-flex gap-2 mt-2"><button className="btn btn-sm btn-outline-secondary" disabled={page === 1 || busy} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page}</span><button className="btn btn-sm btn-outline-secondary" disabled={!hasMore || busy} onClick={() => setPage(page + 1)}>Next</button></div>
    </details>
    {draft && <Modal title="Request restricted-refund approval" onClose={() => !busy && setDraft(null)}>
      <form onSubmit={event => { event.preventDefault(); if (!preview) return; void perform(async () => { await api.post(`/payment-requests/${draft.bill.id}/refund-approval`, { ...payload(), hash: preview.hash }); setDraft(null); setPreview(null); setMessage('Request sent to the administrator. No payment or stock has changed.'); await load(); }); }}>
        <fieldset disabled={busy}>
          <SearchableSelect options={[...(draft.bill && !options.some(row => row.id === draft.bill.id) ? [draft.bill] : []), ...options].map(row => ({ value: row.id, label: row.requestNumber, description: row.patient?.fullName || 'Walk-in' }))} value={draft.bill?.id} onQueryChange={search} onChange={id => { setDraft({ ...draft, bill: options.find(row => row.id === Number(id)), quantities: {} }); setPreview(null); }} placeholder="Search paid invoice or customer" required />
          {draft.bill && <><label className="d-block my-2"><input type="checkbox" checked={draft.partial} onChange={e => { setDraft({ ...draft, partial: e.target.checked }); setPreview(null); }} /> Refund selected quantities only</label>
            {draft.partial && draft.bill.items.map((item: any) => <label className="d-block my-2" key={item.id}>{item.product.genericName} — billed {item.quantity} {item.product.unit}<input type="number" className="form-control" min="0" max={item.quantity} step={stockQuantityStep(item.product.unit)} value={draft.quantities[item.id] || ''} onChange={e => { setDraft({ ...draft, quantities: { ...draft.quantities, [item.id]: e.target.value } }); setPreview(null); }} /></label>)}
          </>}
          <label className="d-block my-2">Customer-visible reason<textarea className="form-control" required minLength={3} maxLength={500} value={draft.reason} onChange={e => { setDraft({ ...draft, reason: e.target.value }); setPreview(null); }} /></label>
          {preview && <div className="alert alert-info">Refund requested: {money(preview.amount)}{preview.includesDeliveryFee && ' (includes the pre-dispatch delivery fee)'}.<br />{preview.lines.map((line: any) => <div key={line.id}>{line.name} × {line.quantity}</div>)}</div>}
          <Alert message={error} /><button type="button" className="btn btn-outline-primary me-2" disabled={!draft.bill || draft.reason.trim().length < 3 || (draft.partial && !Object.values(draft.quantities).some(value => Number(value) > 0))} onClick={() => void perform(async () => setPreview((await api.post(`/payment-requests/${draft.bill.id}/refund-approval/preview`, payload())).data.data))}>Preview request</button><button className="btn btn-primary" disabled={!preview}>Submit for approval</button>
        </fieldset>
      </form>
    </Modal>}
    {decision && <Modal title={`Review refund — ${decision.requestNumber}`} onClose={() => !busy && setDecision(null)}><form onSubmit={event => { event.preventDefault(); void perform(async () => { await api.post(`/payment-requests/${decision.paymentRequestId}/refund-approval/decision`, { approvalId: decision.id, approved: decision.approved, reason: decision.reason }); setDecision(null); setMessage('Decision recorded. Approved refunds await a separate cashier payout.'); await load(); await onDecision(); }); }}>
      <p>Requested amount: <strong>{money(decision.amount)}</strong>. Approval applies only if the invoice, selected quantities and delivery details are unchanged.</p>
      <select className="form-select" disabled={busy} value={decision.approved ? 'approve' : 'reject'} onChange={e => setDecision({ ...decision, approved: e.target.value === 'approve' })}><option value="reject">Reject request</option><option value="approve">Approve refund obligation</option></select>
      <label className="d-block my-2">Decision reason<textarea className="form-control" disabled={busy} required minLength={3} maxLength={500} value={decision.reason} onChange={e => setDecision({ ...decision, reason: e.target.value })} /></label>
      <Alert message={error} /><button className="btn btn-primary" disabled={busy}>Record administrator decision</button>
    </form></Modal>}
  </WorkflowGuard>;
}
