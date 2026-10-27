import { useCallback, useEffect, useRef, useState } from 'react';
import { api, errorMessage } from '../api/client';
import { useHistoryPage } from '../api/useHistoryPage';
import { useAuth } from '../auth/useAuth';
import { Alert } from './Ui';
import { DeliveryBulkModal } from './DeliveryBulkModal';
import { exportDeliveries } from '../utils/deliveryCsv';
import { Modal } from './Modal';
import { personNameInputProps } from '../utils/personName';

export function DeliveryWorkspace({ onChange }: { onChange?: () => Promise<unknown> }) {
  const { get: readInvoices, controls: invoiceHistoryControls } = useHistoryPage('Paid invoices eligible for delivery');
  const { user } = useAuth();
  const patient = user?.role === 'PATIENT';
  const pharmacist = user?.role === 'ADMIN' || user?.role === 'PHARMACIST';
  const [rows, setRows] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [fee, setFee] = useState<number | null>(null);
  const [feeDraft, setFeeDraft] = useState('');
  const [editingFee, setEditingFee] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ id: '', recipientName: '', address: '', phone: '' });
  const [bulkOpen, setBulkOpen] = useState(false);
  const [feeRefund, setFeeRefund] = useState<{ id: number; amount: string; reason: string; evidence: string; maximum: number } | null>(null);
  const [returnAction, setReturnAction] = useState<{ id: number; version: string; action: string; reason: string; courier: string; tracking: string; checked: boolean } | null>(null);
  const [contact, setContact] = useState<{ id: number; recipientName: string; address: string; phone: string; version: string } | null>(null);
  const [courierFilter, setCourierFilter] = useState('');
  const [courierOptions, setCourierOptions] = useState<string[]>([]);
  const [dateField, setDateField] = useState('createdAt');
  const [from, setFrom] = useState(''), [to, setTo] = useState('');
  const [references, setReferences] = useState<Record<number, string>>({});
  const [couriers, setCouriers] = useState<Record<number, string>>({});
  const [draftVersions, setDraftVersions] = useState<Record<number, string>>({});
  const discardTracking = (id: number) => {
    setDraftVersions(current => { const next = { ...current }; delete next[id]; return next; });
    setReferences(current => { const next = { ...current }; delete next[id]; return next; });
    setCouriers(current => { const next = { ...current }; delete next[id]; return next; });
  };
  const [queue, setQueue] = useState('ALL');
  const [search, setSearch] = useState('');
  const deliveryFilters: Record<string, string> = { queue, search, courier: courierFilter, dateField };
  if (from) deliveryFilters.from = new Date(`${from}T00:00:00`).toISOString();
  if (to) { const end = new Date(`${to}T00:00:00`); end.setDate(end.getDate() + 1); deliveryFilters.to = end.toISOString(); }
  const { get: readDeliveries, controls: deliveryHistoryControls } = useHistoryPage('Deliveries', deliveryFilters);
  const loadVersion = useRef(0);
  const load = useCallback(async () => {
    const version = ++loadVersion.current;
    try {
      const [deliveries, settings, options] = await Promise.all([readDeliveries('/deliveries'), api.get('/delivery-settings'), api.get('/deliveries/couriers')]);
      if (version !== loadVersion.current) return;
      setRows(deliveries.data.data); setFee(settings.data.data.fee);
      setCourierOptions(options.data.data);
      if (patient) { const result = await readInvoices('/payment-requests?status=PAID'); if (version === loadVersion.current) setInvoices(result.data.data); }
    } catch (e) { if (version === loadVersion.current) setError(errorMessage(e)); }
  }, [patient, readDeliveries, readInvoices]);
  useEffect(() => { const timer = setTimeout(() => { void load(); }, 300); return () => clearTimeout(timer); }, [load]);
  const run = async (operation: () => Promise<unknown>, success: string) => {
    setBusy(true); setError(''); setMessage('');
    try { await operation(); await load(); await onChange?.(); setMessage(success); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  };
  const saveFee = async () => {
    if (!editingFee || busy) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await api.put('/delivery-settings', { fee: Number(feeDraft) });
      setFee(response.data.data.fee); setEditingFee(false); setFeeDraft('');
      setMessage('Standard delivery fee saved. Existing fee invoices are unchanged.');
    } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  };
  const eligible = invoices.filter(invoice => {
    const previous = invoice.delivery || rows.find(row => row.paymentRequestId === invoice.id);
    return invoice.prescriptionId && invoice.status === 'PAID' && !invoice.customerCancellationReason
      && Number(invoice.amountPaid) - Number(invoice.refundedAmount || 0) >= Number(invoice.total)
      && !invoice.refunds?.some((refund: any) => ['PENDING', 'AWAITING_APPROVAL'].includes(refund.status))
      && (!previous || (previous.status === 'CANCELLED' && !previous.dispatchedAt
        && (!previous.feePaymentRequest || previous.feePaymentRequest.status === 'CANCELLED')
        && !previous.feePaymentRequest?.refunds?.length));
  });
  const ready = (row: any) => row.status === 'AWAITING_FEE' && row.paymentRequest.status === 'PAID' && row.feePaymentRequest?.status === 'PAID'
    && !row.paymentRequest.customerCancellationReason && !row.feePaymentRequest.customerCancellationReason
    && !row.paymentRequest.refunds?.length && !row.feePaymentRequest.refunds?.length
    && Number(row.paymentRequest.amountPaid) - Number(row.paymentRequest.refundedAmount) >= Number(row.paymentRequest.total)
    && Number(row.feePaymentRequest.amountPaid) - Number(row.feePaymentRequest.refundedAmount) >= Number(row.feePaymentRequest.total);
  const inQueue = (row: any, value: string) => value === 'ALL' || (value === 'READY' ? ready(row) || row.status === 'RESHIP_READY' : value === 'ATTENTION' ? ['REQUESTED', 'AWAITING_FEE', 'DELIVERY_FAILED', 'RETURNING', 'RETURNED', 'RESHIP_REQUESTED'].includes(row.status) && !ready(row) : row.status === value);
  const filtered = rows.filter(row => {
    const date = row[dateField] ? new Date(row[dateField]) : null;
    const localDay = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '';
    return inQueue(row, queue) && (!courierFilter || row.courierService === courierFilter)
      && (!from || (!!localDay && localDay >= from)) && (!to || (!!localDay && localDay <= to))
      && [row.paymentRequest.requestNumber, row.paymentRequest.patient?.fullName, row.recipientName, row.courierService, row.trackingReference].join(' ').toLowerCase().includes(search.toLowerCase());
  });
  return <section className="panel mt-3">
    <h3>Home delivery</h3>
    <p className="text-secondary">Medicines and delivery fees must be paid and cashier-verified before dispatch. Request delivery before collecting your medicines.</p>
    <Alert message={error} />
    {deliveryHistoryControls}
    {patient && invoiceHistoryControls}
    {message && <div className="alert alert-success" role="status">{message}</div>}
    <p>Standard delivery fee: {fee === null ? 'Not configured' : `Rs. ${fee.toFixed(2)}`}. Pharmacy confirmation is required.</p>
    {user?.role === 'ADMIN' && <form className="d-flex flex-wrap align-items-end gap-2 mb-3" onSubmit={e => { e.preventDefault(); void saveFee(); }}>
      <label>Standard fee (Rs.)
        <div className="input-group">
          <input
            className="form-control"
            type="number"
            min="0.01"
            max="1000000"
            step="0.01"
            required
            readOnly={!editingFee}
            disabled={busy}
            value={editingFee ? feeDraft : (fee ?? '')}
            onChange={e => setFeeDraft(e.target.value)}
            style={{ background: editingFee ? undefined : '#f8f9fa', cursor: editingFee ? 'text' : 'not-allowed' }}
          />
          <span className="input-group-text" title={editingFee ? 'Editing' : 'Locked – click Edit to change'}>
            {editingFee ? '✏️' : '🔒'}
          </span>
        </div>
      </label>
      {editingFee ? <>
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save standard fee'}</button>
        <button type="button" className="btn btn-outline-secondary" disabled={busy} onClick={() => { setEditingFee(false); setFeeDraft(''); setError(''); }}>Cancel</button>
      </> : <button type="button" className="btn btn-outline-primary" disabled={busy} onClick={() => { setFeeDraft(String(fee ?? '')); setEditingFee(true); setError(''); setMessage(''); }}>✏️ Edit standard fee</button>}
    </form>}
    {patient && eligible.length > 0 && <form onSubmit={e => { e.preventDefault(); void run(() => api.post(`/payment-requests/${form.id}/delivery`, { recipientName: form.recipientName, address: form.address, phone: form.phone }), 'Delivery requested. After pharmacy confirmation, pay the separate DEL invoice in Orders & invoice history. Refresh that list to see the new invoice.'); }}>
      {rows.some(row => row.paymentRequestId === Number(form.id) && row.status === 'CANCELLED') && <p className="text-secondary">Request delivery again with the recipient details below. The previous cancelled fee remains in your invoice history; the pharmacy will confirm a new delivery fee.</p>}
      <div className="row g-3 mb-3">
        <label className="col-md-4">Delivery recipient name<input className="form-control" required {...personNameInputProps(recipientName => setForm(previous => ({ ...previous, recipientName })))} value={form.recipientName} onChange={e => setForm({ ...form, recipientName: e.target.value })} /></label>
        <label className="col-md-4">Paid prescription<select className="form-select" required value={form.id} onChange={e => setForm({ ...form, id: e.target.value })}><option value="">Select invoice</option>{eligible.map(invoice => <option key={invoice.id} value={invoice.id}>{invoice.requestNumber}</option>)}</select></label>
        <label className="col-md-4">Contact number<input className="form-control" required pattern="(0|\+94)[0-9]{9}" placeholder="0701234567 or +94701234567" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
        <label className="col-12">Delivery address<textarea className="form-control" rows={2} required minLength={10} maxLength={500} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></label>
      </div><button className="btn btn-primary mb-3" disabled={busy || fee === null}>Request home delivery</button>
    </form>}
    <button className="btn btn-sm btn-outline-secondary mb-3" type="button" disabled={busy} onClick={() => void load()}>Refresh delivery status</button>
    <div className="d-flex flex-wrap gap-2 mb-3" role="group" aria-label="Delivery queues">
      {[['ALL', 'All'], ['ATTENTION', 'Needs attention'], ['READY', 'Ready to dispatch'], ['DISPATCHED', 'Dispatched'], ['DELIVERY_FAILED', 'Delivery failed'], ['RETURNING', 'Returning to pharmacy'], ['DELIVERED', 'Delivered'], ['RETURNED', 'Returned'], ['RESHIP_REQUESTED', 'Reshipment requested'], ['CANCELLED', 'Cancelled']].map(([value, label]) => <button type="button" key={value} aria-pressed={queue === value} className={`btn btn-sm ${queue === value ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setQueue(value)}>{label}</button>)}
    </div>
    <label className="d-block mb-3">Search invoice, customer, courier or tracking number<input className="form-control" value={search} onChange={e => setSearch(e.target.value)} /></label>
    <div className="d-flex flex-wrap gap-2 mb-3 align-items-end">
      <label>Courier<select className="form-select" value={courierFilter} onChange={e => setCourierFilter(e.target.value)}><option value="">All couriers</option>{courierOptions.map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Date filter<select className="form-select" value={dateField} onChange={e => setDateField(e.target.value)}><option value="createdAt">Requested date</option><option value="dispatchedAt">Dispatch date</option><option value="deliveredAt">Delivered date</option></select></label>
      <label>From<input className="form-control" type="date" value={from} max={to || undefined} onChange={e => setFrom(e.target.value)} /></label>
      <label>To<input className="form-control" type="date" value={to} min={from || undefined} onChange={e => setTo(e.target.value)} /></label>
      <button className="btn btn-outline-secondary" onClick={() => { setQueue('ALL'); setSearch(''); setCourierFilter(''); setFrom(''); setTo(''); }}>Clear filters</button>
    </div>
    <p>{filtered.length} matching deliveries on this history page. Exports include this page only. Date filters use your local calendar dates.</p>
    {pharmacist && <div className="d-flex flex-wrap gap-2 mb-3">
      <button className="btn btn-primary" disabled={busy || !filtered.length || filtered.length > 500} onClick={async () => {
        setBusy(true); setError('');
        try {
          const response = await api.post('/deliveries/export.xlsx', { ids: filtered.map(row => row.id) }, { responseType: 'blob', timeout: 60000 });
          const url = URL.createObjectURL(response.data), link = document.createElement('a'); link.href = url; link.download = 'mediflow-deliveries.xlsx'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
      }}>Export formatted Excel template</button>
      <button className="btn btn-outline-primary" disabled={busy || !filtered.length} onClick={() => exportDeliveries(filtered)}>Export filtered CSV template</button>
      <button className="btn btn-primary" disabled={busy} onClick={() => setBulkOpen(true)}>Upload delivery updates</button>
      {filtered.length > 500 && <p>Refine the filters to at most 500 deliveries for Excel export.</p>}
    </div>}
    {filtered.map(row => <article key={row.id} className="border rounded p-3 mb-3">
      <strong>{row.paymentRequest.requestNumber} — {row.paymentRequest.patient?.fullName}</strong>
      <div>{({ REQUESTED: 'Processing — awaiting pharmacy confirmation', AWAITING_FEE: ready(row) ? 'Ready to dispatch' : 'Processing — awaiting verified payment', DISPATCHED: 'Shipped', DELIVERY_FAILED: 'Delivery attempt failed — parcel with courier', RETURNING: 'Returning to pharmacy — not yet received', DELIVERED: 'Delivered', CANCELLED: 'Cancelled' } as Record<string, string>)[row.status] || row.status.replaceAll('_', ' ')}</div>
      <p className="mb-1">Recipient: {row.recipientName || row.paymentRequest.patient?.fullName || 'Not recorded'}</p>
      <p className="mb-1" style={{ whiteSpace: 'pre-wrap' }}>{row.address}</p><p>{row.phone}</p>
      {pharmacist && ['REQUESTED', 'AWAITING_FEE'].includes(row.status) && <button className="btn btn-outline-primary me-2" disabled={busy} onClick={() => setContact({ id: row.paymentRequestId, recipientName: row.recipientName || row.paymentRequest.patient?.fullName || '', address: row.address, phone: row.phone, version: row.updatedAt })}>Edit recipient details</button>}
      {row.feePaymentRequest && <p>Delivery fee invoice: <strong>{row.feePaymentRequest.requestNumber}</strong> — Rs. {Number(row.feePaymentRequest.total).toFixed(2)} ({row.feePaymentRequest.status.replaceAll('_', ' ')}). {patient && 'Pay through Orders & invoice history; upload the receipt there for cashier verification.'}</p>}
      {!patient && row.feePaymentRequest?.status === 'FULFILLED' && Number(row.feePaymentRequest.amountPaid) > Number(row.feePaymentRequest.refundedAmount) && <button disabled={busy} className="btn btn-outline-secondary my-2" onClick={() => setFeeRefund({ id: row.feePaymentRequest.id, amount: '', reason: '', evidence: '', maximum: Number(row.feePaymentRequest.amountPaid) - Number(row.feePaymentRequest.refundedAmount) })}>Request exceptional delivery-fee refund</button>}
      {row.trackingReference && <p>Dispatch reference: {row.trackingReference}</p>}
      {row.courierService && <p>Courier: {row.courierService}</p>}
      {row.dispatchedAt && <p>Dispatched: {new Date(row.dispatchedAt).toLocaleString()}</p>}
      {row.deliveredAt && <p>Delivered: {new Date(row.deliveredAt).toLocaleString()}</p>}
      {row.returnedAt && <p>Returned to pharmacy: {new Date(row.returnedAt).toLocaleString()} — {row.returnReason}</p>}
      {row.paymentRequest.events?.filter((event: any) => ['DELIVERY_DELIVERY_FAILED', 'DELIVERY_RETURNING', 'DELIVERY_RETRY_DELIVERY'].includes(event.kind)).map((event: any, index: number) => <p key={`${event.createdAt}-${index}`} className="small text-secondary">{({ DELIVERY_DELIVERY_FAILED: 'Delivery attempt failed', DELIVERY_RETURNING: 'Returning to pharmacy', DELIVERY_RETRY_DELIVERY: 'Courier retry arranged' } as Record<string, string>)[event.kind]} — {new Date(event.createdAt).toLocaleString()}: {event.details?.reason}</p>)}
      {pharmacist && ['DISPATCHED', 'DELIVERY_FAILED', 'DELIVERED'].includes(row.status) && <div className="d-flex flex-wrap gap-2 my-2">{(row.status === 'DISPATCHED' ? ['DELIVERY_FAILED', 'RETURNING'] : row.status === 'DELIVERY_FAILED' ? ['RETRY_DELIVERY', 'RETURNING'] : ['RETURNING']).map(action => <button type="button" className="btn btn-outline-warning" key={action} disabled={busy} onClick={() => { const reason = window.prompt('Record the courier update and reason. This does not confirm physical return to the pharmacy.'); if (reason === null) return; if (reason.trim().length < 3 || reason.trim().length > 500) { setError('Enter a reason between 3 and 500 characters.'); return; } void run(() => api.put(`/payment-requests/${row.paymentRequestId}/delivery`, { action, reason: reason.trim(), expectedUpdatedAt: row.updatedAt }), 'Courier status updated. No stock, fee or refund was changed.'); }}>{({ DELIVERY_FAILED: 'Record failed attempt', RETURNING: 'Mark returning to pharmacy', RETRY_DELIVERY: 'Arrange courier retry' } as Record<string, string>)[action]}</button>)}</div>}
      {['RETURNED', 'RESHIP_REQUESTED', 'RESHIP_READY'].includes(row.status) && row.parcelContents?.length > 0 && <div className="border rounded p-2 my-2"><strong>Remaining parcel contents</strong><p className="small mb-1">Refund-authorized quantities are excluded even while payout is pending. Pack only the remaining quantities below.</p>{row.parcelContents.map((line: any) => <div key={line.saleItemId}>{line.name} · Batch {line.batchNumber}: <strong>{line.quantity} {line.unit}</strong> to reship · {line.refundedQuantity} refunded/authorized {Number(line.quantity) > 0 && !line.eligible && <span className="text-danger">— batch requires review; cannot reship</span>}</div>)}</div>}
      {patient && ['RESHIP_REQUESTED', 'RESHIP_READY'].includes(row.status) && <button disabled={busy} className="btn btn-outline-secondary" onClick={() => { if (window.confirm('Withdraw reshipment so the pharmacy can review a product refund instead?')) void run(() => api.post(`/payment-requests/${row.paymentRequestId}/delivery/reshipment/withdraw`), 'Reshipment withdrawn. Contact the cashier to arrange a product refund.'); }}>Withdraw reshipment</button>}
      {['RETURNED', 'RESHIP_REQUESTED', 'RESHIP_READY'].includes(row.status) && <p>Delivery processing fees are non-refundable after dispatch unless a special refund is authorized. Eligible products can be reviewed for a refund, or the returned parcel can be reshipped free after pharmacist inspection.</p>}
      {patient && row.status === 'RETURNED' && <button disabled={busy} className="btn btn-outline-primary" onClick={() => { if (window.confirm('Request free reshipment of this returned parcel instead of a product refund?')) void run(() => api.post(`/payment-requests/${row.paymentRequestId}/delivery/reshipment`), 'Free reshipment requested. A pharmacist must inspect the returned parcel.'); }}>Request free reshipment</button>}
      {pharmacist && ['DISPATCHED', 'DELIVERY_FAILED', 'RETURNING', 'DELIVERED', 'RESHIP_READY'].includes(row.status) && <button disabled={busy} className="btn btn-outline-warning" onClick={() => setReturnAction({ id: row.paymentRequestId, version: row.updatedAt, action: 'RETURNED', reason: '', courier: '', tracking: '', checked: false })}>Confirm parcel returned to pharmacy</button>}
      {pharmacist && ['RESHIP_REQUESTED', 'RESHIP_READY'].includes(row.status) && <button disabled={busy} className="btn btn-outline-primary" onClick={() => setReturnAction({ id: row.paymentRequestId, version: row.updatedAt, action: row.status === 'RESHIP_READY' ? 'RESHIP' : 'APPROVE_RESHIPMENT', reason: '', courier: '', tracking: '', checked: false })}>{row.status === 'RESHIP_READY' ? 'Dispatch free reshipment' : 'Inspect and approve reshipment'}</button>}
      {row.paymentRequest.events?.length > 0 && <details className="my-2"><summary>Shipment history</summary>{row.paymentRequest.events.map((event: any, index: number) => <p key={index}>{new Date(event.createdAt).toLocaleString()} — {event.kind.replaceAll('DELIVERY_', '').replaceAll('_', ' ')}: {event.details?.courierService || event.details?.previousCourierService} {event.details?.trackingReference || event.details?.previousTrackingReference} {event.details?.reason}</p>)}</details>}
      {pharmacist && row.canCancelDelivery && ['REQUESTED', 'AWAITING_FEE'].includes(row.status) && <button className="btn btn-outline-danger me-2" disabled={busy} onClick={() => { if (window.confirm('Cancel delivery and keep medicines for pharmacy collection? Any paid delivery fee will enter the refund workflow.')) void run(() => api.put(`/payment-requests/${row.paymentRequestId}/delivery`, { expectedUpdatedAt: row.updatedAt, action: 'CANCEL' }), 'Delivery cancelled. Any delivery-fee refund must be settled by the cashier.'); }}>Cancel delivery</button>}
      {pharmacist && !row.canCancelDelivery && ['REQUESTED', 'AWAITING_FEE'].includes(row.status) && row.feePaymentRequest?.status === 'PAID' && !row.feePaymentRequest.customerCancellationReason && <button type="button" className="btn btn-outline-warning me-2" disabled={busy} onClick={() => { const reason = window.prompt('Why should this paid delivery fee be cancelled? The cashier or administrator must review this request.'); if (reason === null) return; if (reason.trim().length < 3 || reason.trim().length > 500) { setError('Enter a cancellation reason between 3 and 500 characters.'); return; } void run(() => api.put(`/payment-requests/${row.paymentRequestId}/delivery`, { action: 'REQUEST_FEE_CANCELLATION', reason: reason.trim(), expectedUpdatedAt: row.updatedAt }), 'Delivery-fee cancellation requested. Dispatch is on hold. Ask the cashier or administrator to review the fee invoice; then finish cancelling delivery.'); }}>Request paid-fee cancellation</button>}
      {row.feePaymentRequest?.customerCancellationReason && !['CANCELLED', 'FULFILLED'].includes(row.feePaymentRequest.status) && <p className="text-warning">Delivery is on hold for cancellation review: {row.feePaymentRequest.customerCancellationReason}. The cashier or administrator must review the fee invoice.</p>}
      {['REQUESTED', 'AWAITING_FEE'].includes(row.status) && row.feePaymentRequest?.status === 'CANCELLED' && <p className="text-warning">The previous delivery-fee invoice was cancelled. The pharmacy can issue a replacement after any pending refund is settled, or cancel delivery for pharmacy collection.</p>}
      {pharmacist && (row.status === 'REQUESTED' || (row.status === 'AWAITING_FEE' && row.feePaymentRequest?.status === 'CANCELLED')) && <button disabled={busy || Boolean(row.feePaymentRequest?.refunds?.length)} className="btn btn-outline-primary" onClick={() => { if (row.feePaymentRequest && !window.confirm('Issue a new delivery-fee invoice? The cancelled invoice remains in the payment history.')) return; void run(() => api.put(`/payment-requests/${row.paymentRequestId}/delivery`, { expectedUpdatedAt: row.updatedAt, action: 'CONFIRM' }), 'Delivery confirmed and fee invoice created. The patient must pay before dispatch.'); }}>{row.feePaymentRequest ? 'Reissue delivery-fee invoice' : 'Confirm delivery and issue fee invoice'}</button>}
      {pharmacist && ['AWAITING_FEE', 'DISPATCHED', 'DELIVERY_FAILED', 'RETURNING'].includes(row.status) && <form className="d-flex flex-wrap gap-2" onSubmit={e => { e.preventDefault(); if (row.status === 'AWAITING_FEE' && !window.confirm('Confirm medicines have been checked and are ready for courier handover? This will dispense stock and record dispatch.')) return; void run(async () => { await api.put(`/payment-requests/${row.paymentRequestId}/delivery`, { expectedUpdatedAt: draftVersions[row.id] ?? row.updatedAt, action: row.status !== 'AWAITING_FEE' ? 'UPDATE_TRACKING' : 'DISPATCH', trackingReference: references[row.id] ?? row.trackingReference, courierService: couriers[row.id] ?? row.courierService }); discardTracking(row.id); }, row.status !== 'AWAITING_FEE' ? 'Courier tracking updated. Original dispatch time preserved.' : 'Medicines dispensed and delivery dispatched.'); }}>
        <label>Courier service<input className="form-control" disabled={busy} required minLength={2} maxLength={120} value={couriers[row.id] ?? row.courierService ?? ''} onChange={e => { setDraftVersions(current => ({ ...current, [row.id]: current[row.id] ?? row.updatedAt })); setCouriers({ ...couriers, [row.id]: e.target.value }); }} /></label>
        <label>Tracking number<input className="form-control" disabled={busy} required minLength={3} maxLength={160} value={references[row.id] ?? row.trackingReference ?? ''} onChange={e => { setDraftVersions(current => ({ ...current, [row.id]: current[row.id] ?? row.updatedAt })); setReferences({ ...references, [row.id]: e.target.value }); }} /></label>
        {draftVersions[row.id] && <button type="button" className="btn btn-outline-secondary align-self-end" disabled={busy} onClick={() => discardTracking(row.id)}>Discard tracking edits</button>}
        {draftVersions[row.id] && draftVersions[row.id] !== row.updatedAt && <p className="text-danger w-100">This delivery changed while you were editing. Your draft is preserved. Discard it and review the latest details before saving.</p>}
        <button className="btn btn-primary align-self-end" disabled={busy || (row.status === 'AWAITING_FEE' && !ready(row))}>{row.status !== 'AWAITING_FEE' ? 'Update courier / tracking' : 'Dispense and dispatch'}</button>
      </form>}
      {pharmacist && ['DISPATCHED', 'DELIVERY_FAILED'].includes(row.status) && <button disabled={busy} className="btn btn-outline-primary" onClick={() => { if (!window.confirm('Confirm the courier or recipient has verified that this parcel was delivered? Do not confirm based only on dispatch.')) return; void run(() => api.put(`/payment-requests/${row.paymentRequestId}/delivery`, { expectedUpdatedAt: row.updatedAt, action: 'DELIVERED' }), 'Delivery marked as delivered.'); }}>Confirm delivered to recipient</button>}
      {pharmacist && row.status === 'DELIVERED' && <button type="button" disabled={busy} className="btn btn-outline-warning" onClick={() => { const reason = window.prompt('Use this only if Delivered was recorded by mistake and the parcel is still with the courier. Explain the correction. For an actual return, use Returning to pharmacy.'); if (reason === null) return; if (reason.trim().length < 3 || reason.trim().length > 500) { setError('Enter a correction reason between 3 and 500 characters.'); return; } void run(() => api.put(`/payment-requests/${row.paymentRequestId}/delivery`, { action: 'CORRECT_DELIVERED', reason: reason.trim(), expectedUpdatedAt: row.updatedAt }), 'Incorrect delivered status corrected. The parcel is marked shipped; the previous delivery date remains in its history.'); }}>Correct mistaken delivered status</button>}
      {row.paymentRequest.events?.filter((event: any) => event.kind === 'DELIVERY_CORRECT_DELIVERED').map((event: any, index: number) => <p className="small text-secondary" key={`correction-${index}`}>Delivery status corrected — {new Date(event.createdAt).toLocaleString()}: {event.details?.reason}{event.details?.previousDeliveredAt && <> (previously marked delivered: {new Date(event.details.previousDeliveredAt).toLocaleString()})</>}</p>)}
    </article>)}
    {!filtered.length && <p className="text-secondary">No deliveries in this view.</p>}
    {bulkOpen && <DeliveryBulkModal onClose={() => setBulkOpen(false)} onApplied={() => { setMessage('Bulk delivery updates applied.'); void load(); void onChange?.(); }} />}
    {feeRefund && <Modal title="Exceptional delivery-fee refund" onClose={() => { if (!busy) setFeeRefund(null); }} size="sm"><form onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); try { await api.post(`/refunds/delivery-fee/${feeRefund.id}`, { amount: Number(feeRefund.amount), reason: feeRefund.reason, evidenceReference: feeRefund.evidence }); setFeeRefund(null); setMessage('Exception requested. Another authorized staff member must review it under Refunds before a cashier records payout.'); await load(); } catch (err) { setError(errorMessage(err)); } finally { setBusy(false); } }}>
      <p>Delivery charges are normally non-refundable after dispatch. This request does not refund products or change any shipment.</p>
      <label className="d-block">Requested refund (Rs.)<input type="number" min="0.01" step="0.01" max={feeRefund.maximum} required className="form-control" value={feeRefund.amount} onChange={e => setFeeRefund({ ...feeRefund, amount: e.target.value })} /></label>
      <label className="d-block">Customer-visible reason<textarea minLength={3} maxLength={500} required className="form-control" value={feeRefund.reason} onChange={e => setFeeRefund({ ...feeRefund, reason: e.target.value })} /></label>
      <label className="d-block">Supporting reference<input minLength={3} maxLength={120} required className="form-control" value={feeRefund.evidence} onChange={e => setFeeRefund({ ...feeRefund, evidence: e.target.value })} /></label>
      <Alert message={error} /><button disabled={busy} className="btn btn-primary mt-3">Submit for separate approval</button>
    </form></Modal>}
    {returnAction && <Modal title={returnAction.action === 'RETURNED' ? 'Confirm returned parcel' : returnAction.action === 'RESHIP' ? 'Dispatch free reshipment' : 'Pharmacist parcel inspection'} onClose={() => { if (!busy) setReturnAction(null); }} size="sm">
      {returnAction.action !== 'RETURNED' && <div className="alert alert-info">Inspect and pack only these unrefunded quantities:{rows.find(row => row.paymentRequestId === returnAction.id)?.parcelContents?.filter((line: any) => Number(line.quantity) > 0).map((line: any) => <div key={line.saleItemId}>{line.name} · {line.batchNumber}: <strong>{line.quantity} {line.unit}</strong></div>)}</div>}
      <form onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); try { await api.put(`/payment-requests/${returnAction.id}/delivery`, { action: returnAction.action, expectedUpdatedAt: returnAction.version, ...(returnAction.action === 'RESHIP' ? { courierService: returnAction.courier, trackingReference: returnAction.tracking } : { reason: returnAction.reason }), ...(returnAction.action === 'APPROVE_RESHIPMENT' ? { inspectionConfirmed: true } : {}) }); setReturnAction(null); await load(); setMessage('Parcel status updated. No additional delivery charge was created.'); } catch (err) { setError(errorMessage(err)); } finally { setBusy(false); } }}>
        {returnAction.action === 'RESHIP' ? <><label className="d-block">New courier service<input required minLength={2} maxLength={120} className="form-control" value={returnAction.courier} onChange={e => setReturnAction({ ...returnAction, courier: e.target.value })} /></label><label className="d-block">New tracking number<input required minLength={3} maxLength={160} className="form-control" value={returnAction.tracking} onChange={e => setReturnAction({ ...returnAction, tracking: e.target.value })} /></label></> : <label className="d-block">Return reason / inspection notes<textarea required minLength={3} maxLength={500} className="form-control" value={returnAction.reason} onChange={e => setReturnAction({ ...returnAction, reason: e.target.value })} /></label>}
        <label className="d-block my-3"><input type="checkbox" required checked={returnAction.checked} onChange={e => setReturnAction({ ...returnAction, checked: e.target.checked })} /> {returnAction.action === 'APPROVE_RESHIPMENT' ? 'I inspected the returned medicines and retail items and confirm this same parcel is safe to reship.' : returnAction.action === 'RESHIP' ? 'The inspected parcel is ready for courier handover.' : 'The parcel has physically returned to the pharmacy. No stock is being automatically restored.'}</label>
        <Alert message={error} /><button className="btn btn-primary" disabled={busy}>Confirm</button>
      </form>
    </Modal>}
    {contact && <Modal title="Edit delivery recipient" onClose={() => { if (!busy) setContact(null); }} size="sm">
      <form onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); try { await api.put(`/payment-requests/${contact.id}/delivery`, { action: 'UPDATE_DETAILS', recipientName: contact.recipientName, address: contact.address, phone: contact.phone, expectedUpdatedAt: contact.version }); setContact(null); await load(); setMessage('Recipient details updated.'); } catch (err) { setError(errorMessage(err)); } finally { setBusy(false); } }}>
        <label className="d-block">Recipient name<input className="form-control" required {...personNameInputProps(recipientName => setContact(previous => previous ? { ...previous, recipientName } : null))} value={contact.recipientName} onChange={e => setContact({ ...contact, recipientName: e.target.value })} /></label>
        <label className="d-block">Address<textarea className="form-control" required minLength={10} maxLength={500} value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })} /></label>
        <label className="d-block">Phone<input className="form-control" required value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} /></label>
        <Alert message={error} /><button className="btn btn-primary mt-3" disabled={busy}>Save recipient details</button>
      </form>
    </Modal>}
  </section>;
}
