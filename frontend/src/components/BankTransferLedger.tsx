import { formatPharmacyDateTime } from "../utils/pharmacyTime";
import { useCallback, useEffect, useState } from 'react';
import { api, errorMessage } from '../api/client';
import { useHistoryPage } from '../api/useHistoryPage';
import { Modal } from './Modal';
import { Alert } from './Ui';
import { SearchableSelect } from './SearchableSelect';
import { WorkflowGuard } from './WorkflowGuard';
const money = (value: unknown) => `Rs. ${Number(value || 0).toFixed(2)}`;

export function BankTransferLedger({ onAllocated }: { onAllocated(): Promise<unknown> }) {
  const { get, controls } = useHistoryPage('Verified bank transfers');
  const [rows, setRows] = useState<any[]>([]), [banks, setBanks] = useState<any[]>([]), [patients, setPatients] = useState<any[]>([]), [invoices, setInvoices] = useState<any[]>([]);
  const [draft, setDraft] = useState<any>(null), [allocate, setAllocate] = useState<any>(null), [invoice, setInvoice] = useState<any>(null);
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const load = useCallback(async () => { try { setRows((await get('/bank-transfers')).data.data); } catch (caught) { setError(errorMessage(caught)); } }, [get]);
  useEffect(() => { void load(); }, [load]);
  const searchPatients = useCallback(async (search: string) => { try { setPatients((await api.get('/cashier/patients', { params: { search } })).data.data); } catch (caught) { setError(errorMessage(caught)); } }, []);
  const transferId = allocate?.id;
  const searchInvoices = useCallback(async (search: string) => { if (!transferId) return; try { setInvoices((await api.get(`/bank-transfers/${transferId}/invoices`, { params: { search } })).data.data); } catch (caught) { setError(errorMessage(caught)); } }, [transferId]);
  return <WorkflowGuard resource={invoice?.id ? `payment/${invoice.id}` : null} onCancel={() => { setAllocate(null); setInvoice(null); }}>
    <details className="panel mt-4"><summary className="fw-bold">Verified bank transfers & invoice allocations</summary>
      <p className="small mt-2">Record a bank-statement-confirmed receipt once, then allocate it to one or more prepared invoices for the same customer. This is for money already received, not a bank transfer instruction. Refunding an invoice does not restore this balance.</p>
      <p className="small text-secondary">Older payments retain their duplicate-reference protection. Do not register an already-paid transfer again. Allocations appear in the normal invoice/payment reconciliation; this ledger also shows unallocated receipts by their bank payment date.</p>
      <Alert message={error} /><button className="btn btn-outline-primary me-2" disabled={busy} onClick={async () => { setBusy(true); try { setBanks((await api.get('/bank-accounts')).data.data); setDraft({ bankAccountId: '', patient: null, reference: '', amount: '', paidOn: '', bankVerified: false }); } catch (caught) { setError(errorMessage(caught)); } finally { setBusy(false); } }}>Record verified receipt</button><button className="btn btn-outline-secondary" disabled={busy} onClick={() => void load()}>Refresh ledger</button>
      {controls}
      {rows.map(row => <article className="border-top py-2" key={row.id}>
        <strong>BT#{row.id} · {row.reference} · {row.patient.fullName}</strong>
        <div>{row.bankAccount.bankName} · {row.bankAccount.accountNumber} · Bank payment date {row.paidOn.slice(0, 10)}</div>
        <div>Received {money(row.amount)} · Unallocated {money(row.availableAmount)}</div>
        {row.allocations.map((allocation: any) => <small className="d-block" key={allocation.id}>{allocation.paymentRequest.requestNumber} · {money(allocation.amount)} · {formatPharmacyDateTime(allocation.createdAt)}</small>)}
        {Number(row.availableAmount) > 0 && <button className="btn btn-sm btn-outline-primary mt-2" disabled={busy} onClick={() => { setAllocate(row); setInvoice(null); setInvoices([]); setError(''); }}>Allocate to an invoice</button>}
      </article>)}
    </details>
    {draft && <Modal title="Record bank-statement-confirmed receipt" onClose={() => !busy && setDraft(null)}><form onSubmit={async event => { event.preventDefault(); if (busy) return; setBusy(true); setError(''); try { await api.post('/bank-transfers', { bankAccountId: Number(draft.bankAccountId), patientId: draft.patient.id, reference: draft.reference, amount: Number(draft.amount), paidOn: draft.paidOn, bankVerified: draft.bankVerified }); setDraft(null); await load(); } catch (caught) { setError(errorMessage(caught)); } finally { setBusy(false); } }}><fieldset disabled={busy}>
      <label className="d-block">Destination bank account<select className="form-select" required value={draft.bankAccountId} onChange={e => setDraft({ ...draft, bankAccountId: e.target.value })}><option value="">Choose account</option>{banks.map(bank => <option key={bank.id} value={bank.id}>{bank.bankName} · {bank.accountNumber}</option>)}</select></label>
      <label className="d-block mt-2">Customer<SearchableSelect required options={[...(draft.patient && !patients.some(patient => patient.id === draft.patient.id) ? [draft.patient] : []), ...patients].map(patient => ({ value: patient.id, label: patient.fullName, description: patient.phone || patient.email }))} value={draft.patient?.id} onChange={id => setDraft({ ...draft, patient: patients.find(patient => patient.id === Number(id)) })} onQueryChange={searchPatients} placeholder="Search customer name, phone or email" /></label>
      <label className="d-block mt-2">Bank transaction reference<input className="form-control" required minLength={3} maxLength={80} value={draft.reference} onChange={e => setDraft({ ...draft, reference: e.target.value })} /></label>
      <label className="d-block mt-2">Amount received<input className="form-control" required type="number" min="0.01" step="0.01" max="9999999999.99" value={draft.amount} onChange={e => setDraft({ ...draft, amount: e.target.value })} /></label>
      <label className="d-block mt-2">Bank payment date<input className="form-control" required type="date" value={draft.paidOn} onChange={e => setDraft({ ...draft, paidOn: e.target.value })} /></label>
      <label className="d-block my-3"><input type="checkbox" required checked={draft.bankVerified} onChange={e => setDraft({ ...draft, bankVerified: e.target.checked })} /> I verified the destination, customer, reference, date and received amount against the bank statement.</label>
      <Alert message={error} /><button className="btn btn-primary" disabled={!draft.patient}>Record verified receipt</button>
    </fieldset></form></Modal>}
    {allocate && <Modal title={`Allocate ${allocate.reference}`} onClose={() => { if (!busy) { setAllocate(null); setInvoice(null); } }}><form onSubmit={async event => { event.preventDefault(); if (busy || !invoice) return; setBusy(true); setError(''); try { await api.post(`/payment-requests/${invoice.id}/bank-allocation`, { transferId: allocate.id, revision: invoice.revision }); setAllocate(null); setInvoice(null); await load(); await onAllocated(); } catch (caught) { setError(errorMessage(caught)); } finally { setBusy(false); } }}>
      <p>Unallocated balance: {money(allocate.availableAmount)}. Invoice revisions, customer acknowledgement and remaining funds are checked again when you confirm.</p>
      <SearchableSelect disabled={busy} required options={[...(invoice && !invoices.some(row => row.id === invoice.id) ? [invoice] : []), ...invoices].map(row => ({ value: row.id, label: row.requestNumber, description: money(row.total) }))} value={invoice?.id} onChange={id => setInvoice(invoices.find(row => row.id === Number(id)))} onQueryChange={searchInvoices} placeholder="Search this customer's unpaid invoice reference" />
      {invoice && <p className="my-3">Allocate {money(invoice.total)} to {invoice.requestNumber}. This marks the invoice paid and reserves its medicines; it does not dispense them.</p>}
      <Alert message={error} /><button className="btn btn-primary mt-3" disabled={busy || !invoice || Number(invoice.total) > Number(allocate.availableAmount)}>Confirm allocation</button>
    </form></Modal>}
  </WorkflowGuard>;
}
