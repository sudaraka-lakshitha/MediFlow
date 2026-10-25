import { useCallback, useEffect, useState } from 'react';
import { api, errorMessage } from '../api/client';
import { stockQuantityStep } from "../utils/unitMeasure";
import { useAuth } from '../auth/useAuth';
import { Modal, ModalActions } from './Modal';
import { Alert } from './Ui';
const money = (value: unknown) => `Rs. ${Number(value || 0).toFixed(2)}`;
const noSales: any[] = [];

export function RefundWorkspace({ sales = noSales, refreshToken }: { sales?: any[]; refreshToken?: unknown }) {
  const { user } = useAuth();
  const staff = user?.role !== 'PATIENT';
  const canPay = user?.role === 'ADMIN' || user?.role === 'CASHIER' || !!user?.cashierAccess;
  const canReview = user?.role === 'ADMIN' || user?.role === 'PHARMACIST';
  const [refunds, setRefunds] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saleId, setSaleId] = useState('');
  const [draft, setDraft] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [action, setAction] = useState<any>(null);
  const [feeDecision, setFeeDecision] = useState<{ id: number; approved: boolean; reason: string } | null>(null);
  const canApproveFee = user?.role === 'ADMIN' || Boolean(user?.deliveryRefundApprovalAccess);
  const load = useCallback(async () => { try { const result = await api.get('/refunds'); setRefunds(result.data.data); } catch (caught) { setError(errorMessage(caught)); } }, []);
  useEffect(() => { load(); }, [load, sales, refreshToken]);
  const payload = () => ({ expectedRefundCount: draft.refundCount, reason: draft.reason, items: Object.entries(draft.quantities).filter(([,quantity]) => Number(quantity) > 0).map(([id,quantity]) => ({ saleItemId: Number(id), quantity: Number(quantity) })) });
  const save = async (operation: () => Promise<unknown>) => { setBusy(true); setError(''); try { await operation(); setDraft(null); setAction(null); setPreview(null); await load(); } catch (caught) { setError(errorMessage(caught)); } finally { setBusy(false); } };
  return <section className="card p-3 mt-4" aria-label="Refunds and returns">
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2"><h3 className="h5 mb-0">Refunds {staff ? '& returned stock' : ''}</h3><button className="btn btn-sm btn-outline-secondary" onClick={load}>Refresh refunds</button></div>
    <p className="small text-secondary mt-2">Refund authorization and confirmed payout are tracked separately.{staff && ' Returned goods are not added to saleable stock until a pharmacist reviews them.'}</p>
    <Alert message={error} />
    {canPay && sales.some((sale) => sale.status === 'PAID') && <div className="d-flex flex-wrap gap-2 mb-3"><label className="visually-hidden" htmlFor="refund-sale">Completed invoice to refund</label><select id="refund-sale" className="form-select" style={{ maxWidth: 460 }} value={saleId} onChange={(event) => setSaleId(event.target.value)}><option value="">Choose a completed prescription or retail invoice</option>{sales.filter((sale) => sale.status === 'PAID').map((sale) => <option key={sale.id} value={sale.id}>{sale.invoiceNumber} — {sale.patient?.fullName || 'Walk-in'} — {money(sale.total)}</option>)}</select><button className="btn btn-outline-danger" disabled={!saleId} onClick={() => { const sale = sales.find((record) => record.id === Number(saleId)); setDraft({ sale, reason: '', quantities: {}, refundCount: refunds.filter((refund) => refund.saleId === sale.id).length }); setPreview(null); }}>Create refund / return</button></div>}
    {!refunds.length && <p className="text-secondary mb-0">No refunds recorded.</p>}
    {refunds.map((refund) => <article className="border rounded p-3 mt-2" key={refund.id}>
      <div className="d-flex flex-wrap justify-content-between gap-2"><strong>Refund #{refund.id} · {refund.sale?.invoiceNumber || refund.paymentRequest?.requestNumber}{refund.category === 'DELIVERY_FEE' ? ' · Delivery-fee exception' : ''}</strong><strong>{money(refund.amount)} — {({ SETTLED: 'Payout confirmed', PENDING: 'Payout pending', AWAITING_APPROVAL: 'Awaiting separate approval', REJECTED: 'Exception rejected' } as Record<string, string>)[refund.status] || refund.status}</strong></div>
      <p className="mb-1">{refund.reason}</p>
      {refund.approvalReason && <p>Decision: {refund.approvalReason}</p>}
      {staff && refund.category === 'DELIVERY_FEE' && <p className="small text-secondary">Requested by staff #{refund.createdById} · Supporting reference: {refund.evidenceReference}{refund.approvedById ? ` · Reviewed by staff #${refund.approvedById}` : ''}</p>}
      {canApproveFee && refund.status === 'AWAITING_APPROVAL' && refund.createdById !== user?.id && <button className="btn btn-outline-primary my-2" disabled={busy} onClick={() => setFeeDecision({ id: refund.id, approved: false, reason: '' })}>Review delivery-fee exception</button>}
      {staff && refund.status === 'AWAITING_APPROVAL' && refund.createdById === user?.id && <p className="small">Another authorized staff member must review your request.</p>}
      {refund.status === 'SETTLED' && <small className="text-secondary">{refund.method} · {refund.reference} · {new Date(refund.settledAt).toLocaleString()}</small>}
      {canPay && refund.status === 'PENDING' && <button className="btn btn-sm btn-outline-primary my-2" onClick={() => setAction({ type: 'settle', id: refund.id, method: 'CASH', reference: '', confirmed: false })}>Record completed payout</button>}
      {refund.lines.map((line: any) => <div className="border-top mt-2 pt-2" key={line.id}><span>{line.name} × {line.quantity} — {money(line.amount)}</span>{staff && <><small className="d-block text-secondary">Stock: {line.stockStatus.replaceAll('_',' ')}{line.stockReason ? ` — ${line.stockReason}` : ''}</small>{canReview && line.stockStatus === 'PENDING_REVIEW' && <button className="btn btn-sm btn-outline-secondary mt-1" onClick={() => setAction({ type: 'stock', id: line.id, decision: 'NOT_RESTOCKED', reason: '', confirmed: false })}>Review returned stock</button>}</>}</div>)}
    </article>)}
    {feeDecision && <Modal title="Review delivery-fee exception" onClose={() => { if (!busy) setFeeDecision(null); }}><form onSubmit={async event => { event.preventDefault(); setBusy(true); setError(''); try { await api.post(`/refunds/${feeDecision.id}/delivery-fee-decision`, { approved: feeDecision.approved, reason: feeDecision.reason }); setFeeDecision(null); await load(); } catch (caught) { setError(errorMessage(caught)); } finally { setBusy(false); } }}>
      <p>Approval authorizes the amount shown on the request. A cashier must still confirm the actual payout separately.</p>
      <label>Decision<select className="form-select" value={feeDecision.approved ? 'approve' : 'reject'} onChange={e => setFeeDecision({ ...feeDecision, approved: e.target.value === 'approve' })}><option value="reject">Reject exception</option><option value="approve">Approve exception</option></select></label>
      <label className="d-block">Customer-visible decision reason<textarea required minLength={3} maxLength={500} className="form-control" value={feeDecision.reason} onChange={e => setFeeDecision({ ...feeDecision, reason: e.target.value })} /></label>
      <Alert message={error} /><button className="btn btn-primary mt-3" disabled={busy}>Record decision</button>
    </form></Modal>}
    {draft && <Modal title={`Refund / return — ${draft.sale.invoiceNumber}`} onClose={() => !busy && setDraft(null)} size="lg"><form onSubmit={(event) => { event.preventDefault(); if (preview) save(() => api.post(`/refunds/sale/${draft.sale.id}`,payload())); }}><fieldset disabled={busy}>
      <p>Enter only the quantities being refunded. Original invoice and dispensing records remain unchanged.</p>
      {draft.sale.items.map((item: any) => { const prior = refunds.filter((refund) => refund.saleId === draft.sale.id).flatMap((refund) => refund.lines).filter((line: any) => line.saleItemId === item.id).reduce((sum: number,line: any) => sum + Number(line.quantity),0); const remaining = Number(item.quantity) - prior; return <div className="row g-2 align-items-center mb-2" key={item.id}><label className="col-sm-8" htmlFor={`refund-qty-${item.id}`}>{item.product.genericName} · batch {item.batch?.batchNumber}<small className="d-block text-secondary">Refundable: {remaining} {item.product.unit}</small></label><div className="col-sm-4"><input id={`refund-qty-${item.id}`} className="form-control" type="number" min="0" max={remaining} step={stockQuantityStep(item.product.unit)} disabled={remaining <= 0} value={draft.quantities[item.id] || ''} onChange={(event) => { setPreview(null); setDraft({ ...draft, quantities: { ...draft.quantities, [item.id]: event.target.value } }); }} /></div></div>; })}
      <label htmlFor="refund-reason" className="form-label">Reason</label><textarea id="refund-reason" className="form-control" minLength={3} maxLength={500} required value={draft.reason} onChange={(event) => { setPreview(null); setDraft({ ...draft, reason: event.target.value }); }} />
      <Alert message={error} />
      {preview && <div className="alert alert-info mt-3">Refund to authorize: <strong>{money(preview.amount)}</strong>. Payout remains pending; no stock is automatically restored.</div>}
      <div className="modal-actions"><button type="button" className="btn btn-light" onClick={() => setDraft(null)}>Cancel</button><button className="btn btn-outline-primary" type="button" disabled={busy || draft.reason.trim().length < 3} onClick={async () => { setBusy(true); try { setPreview((await api.post(`/refunds/sale/${draft.sale.id}/preview`,payload())).data.data); } catch (caught) { setError(errorMessage(caught)); } finally { setBusy(false); } }}>Preview refund</button><button className="btn btn-danger" disabled={busy || !preview}>Authorize refund</button></div>
    </fieldset></form></Modal>}
    {action && <Modal title={action.type === 'settle' ? 'Confirm refund payout' : 'Pharmacist stock review'} onClose={() => !busy && setAction(null)}><form onSubmit={(event) => { event.preventDefault(); save(() => action.type === 'settle' ? api.post(`/refunds/${action.id}/settle`, { method: action.method, reference: action.reference, payoutConfirmed: action.confirmed }) : api.post(`/refunds/lines/${action.id}/stock-review`, { decision: action.decision, reason: action.reason })); }}>
      {action.type === 'settle' ? <><p>This records a payout already made. It does not transfer money.</p><label htmlFor="refund-method">Refund method</label><select id="refund-method" className="form-select mb-2" value={action.method} onChange={(event) => setAction({ ...action, method: event.target.value })}><option value="CASH">Cash</option><option value="BANK_TRANSFER">Bank transfer</option><option value="CARD">Card reversal</option></select><label htmlFor="refund-reference">Transaction / cash payout reference</label><input id="refund-reference" className="form-control" required minLength={3} maxLength={120} value={action.reference} onChange={(event) => setAction({ ...action, reference: event.target.value })} /></> : <><p>Confirm the returned quantity and condition before approving saleable stock. Refund payment is handled separately.</p><label htmlFor="return-decision">Stock decision</label><select id="return-decision" className="form-select mb-2" value={action.decision} onChange={(event) => setAction({ ...action, decision: event.target.value })}><option value="NOT_RESTOCKED">Returned — do not put back into saleable stock</option><option value="NOT_RETURNED">Goods were not returned</option><option value="RESTOCKED">Inspected and approved for saleable stock</option></select><label htmlFor="return-reason">Inspection / decision reason</label><textarea id="return-reason" className="form-control" required minLength={3} maxLength={500} value={action.reason} onChange={(event) => setAction({ ...action, reason: event.target.value })} /></>}
      <label className="d-block my-3"><input type="checkbox" className="form-check-input me-2" required checked={action.confirmed} onChange={(event) => setAction({ ...action, confirmed: event.target.checked })} />{action.type === 'settle' ? 'I confirm the customer has received this refund.' : 'I have reviewed the quantity and condition and authorize this stock decision.'}</label><Alert message={error} /><ModalActions onClose={() => !busy && setAction(null)} submitLabel="Record confirmation" busy={busy} disabled={!action.confirmed} />
    </form></Modal>}
  </section>;
}
