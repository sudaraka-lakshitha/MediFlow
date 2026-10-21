import { useCallback, useEffect, useState } from 'react';
import { api, errorMessage } from '../api/client';
import { pagedList } from '../api/pagedList';
import { useAuth } from '../auth/useAuth';
import { Alert } from './Ui';

export function DeliveryWorkspace({ onChange }: { onChange?: () => Promise<unknown> }) {
  const { user } = useAuth();
  const patient = user?.role === 'PATIENT';
  const pharmacist = user?.role === 'ADMIN' || user?.role === 'PHARMACIST';
  const [rows, setRows] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [fee, setFee] = useState<number | null>(null);
  const [feeDraft, setFeeDraft] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ id: '', address: '', phone: '' });
  const [references, setReferences] = useState<Record<number, string>>({});
  const [couriers, setCouriers] = useState<Record<number, string>>({});
  const [queue, setQueue] = useState('ALL');
  const [search, setSearch] = useState('');
  const load = useCallback(async () => {
    try {
      const [deliveries, settings] = await Promise.all([pagedList('/deliveries'), api.get('/delivery-settings')]);
      setRows(deliveries.data.data); setFee(settings.data.data.fee); setFeeDraft(String(settings.data.data.fee ?? ''));
      if (patient) setInvoices((await pagedList('/payment-requests')).data.data);
    } catch (e) { setError(errorMessage(e)); }
  }, [patient]);
  useEffect(() => { void load(); }, [load]);
  const run = async (operation: () => Promise<unknown>, success: string) => {
    setBusy(true); setError(''); setMessage('');
    try { await operation(); await load(); await onChange?.(); setMessage(success); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  };
  const eligible = invoices.filter(invoice => invoice.prescriptionId && invoice.status === 'PAID' && !rows.some(row => row.paymentRequestId === invoice.id));
  const ready = (row: any) => row.status === 'AWAITING_FEE' && row.paymentRequest.status === 'PAID' && row.feePaymentRequest?.status === 'PAID'
    && !row.paymentRequest.customerCancellationReason && !row.feePaymentRequest.customerCancellationReason
    && !row.paymentRequest.refunds?.length && !row.feePaymentRequest.refunds?.length
    && Number(row.paymentRequest.amountPaid) - Number(row.paymentRequest.refundedAmount) >= Number(row.paymentRequest.total)
    && Number(row.feePaymentRequest.amountPaid) - Number(row.feePaymentRequest.refundedAmount) >= Number(row.feePaymentRequest.total);
  const inQueue = (row: any, value: string) => value === 'ALL' || (value === 'READY' ? ready(row) : value === 'ATTENTION' ? ['REQUESTED', 'AWAITING_FEE'].includes(row.status) && !ready(row) : row.status === value);
  const filtered = rows.filter(row => inQueue(row, queue) && [row.paymentRequest.requestNumber, row.paymentRequest.patient?.fullName, row.courierService, row.trackingReference].join(' ').toLowerCase().includes(search.toLowerCase()));
  return <section className="panel mt-3">
    <h3>Home delivery</h3>
    <p className="text-secondary">Medicines and delivery fees must be paid and cashier-verified before dispatch. Request delivery before collecting your medicines.</p>
    <Alert message={error} />
    {message && <div className="alert alert-success" role="status">{message}</div>}
    <p>Standard delivery fee: {fee === null ? 'Not configured' : `Rs. ${fee.toFixed(2)}`}. Pharmacy confirmation is required.</p>
    {user?.role === 'ADMIN' && <form className="d-flex flex-wrap align-items-end gap-2 mb-3" onSubmit={e => { e.preventDefault(); void run(() => api.put('/delivery-settings', { fee: Number(feeDraft) }), 'Standard delivery fee saved. Existing fee invoices are unchanged.'); }}>
      <label>Standard fee (Rs.)<input className="form-control" type="number" min="0.01" max="1000000" step="0.01" required value={feeDraft} onChange={e => setFeeDraft(e.target.value)} /></label>
      <button className="btn btn-outline-primary" disabled={busy}>Save standard fee</button>
    </form>}
    {patient && eligible.length > 0 && <form onSubmit={e => { e.preventDefault(); void run(() => api.post(`/payment-requests/${form.id}/delivery`, { address: form.address, phone: form.phone }), 'Delivery requested. After pharmacy confirmation, pay the separate DEL invoice in Orders & invoice history. Refresh that list to see the new invoice.'); }}>
      <div className="row g-3 mb-3">
        <label className="col-md-4">Paid prescription<select className="form-select" required value={form.id} onChange={e => setForm({ ...form, id: e.target.value })}><option value="">Select invoice</option>{eligible.map(invoice => <option key={invoice.id} value={invoice.id}>{invoice.requestNumber}</option>)}</select></label>
        <label className="col-md-4">Contact number<input className="form-control" required pattern="(0|\+94)[0-9]{9}" placeholder="0701234567 or +94701234567" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
        <label className="col-12">Delivery address<textarea className="form-control" rows={2} required minLength={10} maxLength={500} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></label>
      </div><button className="btn btn-primary mb-3" disabled={busy || fee === null}>Request home delivery</button>
    </form>}
    <button className="btn btn-sm btn-outline-secondary mb-3" type="button" disabled={busy} onClick={() => void load()}>Refresh delivery status</button>
    <div className="d-flex flex-wrap gap-2 mb-3" role="group" aria-label="Delivery queues">
      {[['ALL', 'All'], ['ATTENTION', 'Needs attention'], ['READY', 'Ready to dispatch'], ['DISPATCHED', 'Dispatched'], ['DELIVERED', 'Delivered'], ['CANCELLED', 'Cancelled']].map(([value, label]) => <button type="button" key={value} aria-pressed={queue === value} className={`btn btn-sm ${queue === value ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setQueue(value)}>{label} ({rows.filter(row => inQueue(row, value)).length})</button>)}
    </div>
    <label className="d-block mb-3">Search invoice, customer, courier or tracking number<input className="form-control" value={search} onChange={e => setSearch(e.target.value)} /></label>
    {filtered.map(row => <article key={row.id} className="border rounded p-3 mb-3">
      <strong>{row.paymentRequest.requestNumber} — {row.paymentRequest.patient?.fullName}</strong>
      <div>{row.status.replaceAll('_', ' ')}</div>
      <p className="mb-1" style={{ whiteSpace: 'pre-wrap' }}>{row.address}</p><p>{row.phone}</p>
      {row.feePaymentRequest && <p>Delivery fee invoice: <strong>{row.feePaymentRequest.requestNumber}</strong> — Rs. {Number(row.feePaymentRequest.total).toFixed(2)} ({row.feePaymentRequest.status.replaceAll('_', ' ')}). {patient && 'Pay through Orders & invoice history; upload the receipt there for cashier verification.'}</p>}
      {row.trackingReference && <p>Dispatch reference: {row.trackingReference}</p>}
      {row.courierService && <p>Courier: {row.courierService}</p>}
      {row.dispatchedAt && <p>Dispatched: {new Date(row.dispatchedAt).toLocaleString()}</p>}
      {row.deliveredAt && <p>Delivered: {new Date(row.deliveredAt).toLocaleString()}</p>}
      {pharmacist && ['REQUESTED', 'AWAITING_FEE'].includes(row.status) && <button className="btn btn-outline-danger me-2" disabled={busy} onClick={() => { if (window.confirm('Cancel delivery and keep medicines for pharmacy collection? Any paid delivery fee will enter the refund workflow.')) void run(() => api.put(`/payment-requests/${row.paymentRequestId}/delivery`, { action: 'CANCEL' }), 'Delivery cancelled. Any delivery-fee refund must be settled by the cashier.'); }}>Cancel delivery</button>}
      {pharmacist && row.status === 'REQUESTED' && <button disabled={busy} className="btn btn-outline-primary" onClick={() => void run(() => api.put(`/payment-requests/${row.paymentRequestId}/delivery`, { action: 'CONFIRM' }), 'Delivery confirmed and fee invoice created. The patient must pay before dispatch.')}>Confirm delivery and issue fee invoice</button>}
      {pharmacist && ['AWAITING_FEE', 'DISPATCHED'].includes(row.status) && <form className="d-flex flex-wrap gap-2" onSubmit={e => { e.preventDefault(); if (row.status === 'AWAITING_FEE' && !window.confirm('Confirm medicines have been checked and are ready for courier handover? This will dispense stock and record dispatch.')) return; void run(() => api.put(`/payment-requests/${row.paymentRequestId}/delivery`, { action: row.status === 'DISPATCHED' ? 'UPDATE_TRACKING' : 'DISPATCH', trackingReference: references[row.id] ?? row.trackingReference, courierService: couriers[row.id] ?? row.courierService }), row.status === 'DISPATCHED' ? 'Courier tracking updated. Original dispatch time preserved.' : 'Medicines dispensed and delivery dispatched.'); }}>
        <label>Courier service<input className="form-control" required minLength={2} maxLength={120} value={couriers[row.id] ?? row.courierService ?? ''} onChange={e => setCouriers({ ...couriers, [row.id]: e.target.value })} /></label>
        <label>Tracking number<input className="form-control" required minLength={3} maxLength={160} value={references[row.id] ?? row.trackingReference ?? ''} onChange={e => setReferences({ ...references, [row.id]: e.target.value })} /></label>
        <button className="btn btn-primary align-self-end" disabled={busy || (row.status !== 'DISPATCHED' && !ready(row))}>{row.status === 'DISPATCHED' ? 'Update courier / tracking' : 'Dispense and dispatch'}</button>
      </form>}
      {pharmacist && row.status === 'DISPATCHED' && <button disabled={busy} className="btn btn-outline-primary" onClick={() => void run(() => api.put(`/payment-requests/${row.paymentRequestId}/delivery`, { action: 'DELIVERED' }), 'Delivery marked as delivered.')}>Confirm delivered to recipient</button>}
    </article>)}
    {!filtered.length && <p className="text-secondary">No deliveries in this view.</p>}
  </section>;
}
