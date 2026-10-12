import { useState } from 'react';
import { api, errorMessage } from '../api/client';
import { Alert } from './Ui';

const money = (value: unknown) => `Rs. ${Number(value || 0).toFixed(2)}`;
export function CashierBalanceReview({ day, cashier, entries, onCancel, onSaved, onBusy }: {
  day: string; cashier: any; entries: any[]; onCancel: () => void; onSaved: () => Promise<void>; onBusy: (busy: boolean) => void;
}) {
  const [form, setForm] = useState<any>({ openingCash: '', countedCash: '', bankIn: '', bankOut: '', cardIn: '', cardOut: '', reason: '', evidenceReference: '', referencesChecked: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fields = [['openingCash','Checked opening cash'],['countedCash','Checked closing cash'],['bankIn','Bank credits checked'],['bankOut','Bank refund debits checked'],['cardIn','Card receipts checked'],['cardOut','Card refund reversals checked']];
  const complete = fields.every(([key]) => form[key] !== '' && Number(form[key]) >= 0);
  const variance = Number(form.countedCash) - Number(form.openingCash) - cashier.totals.CASH.net;
  return <section className="border rounded p-3 mb-3 bg-light" aria-label="Administrator cashier balance review">
    <h4 className="h6">Reconcile on behalf of {cashier.name} — {day}</h4>
    <p className="small">Use only when this cashier cannot complete their own sign-off. Check their cash-count record, receipts and statement evidence. This records your administrator review separately; it does not impersonate the cashier or change payments.</p>
    <div className="table-responsive"><table className="table table-sm"><thead><tr><th>Method</th><th>Received</th><th>Refunded</th><th>Net</th></tr></thead><tbody>{Object.entries(cashier.totals).map(([method, value]: [string, any]) => <tr key={method}><th>{method.replaceAll('_',' ')}</th><td>{money(value.received)}</td><td>{money(value.refunded)}</td><td>{money(value.net)}</td></tr>)}</tbody></table></div>
    <details className="mb-3"><summary>This cashier’s transaction evidence</summary><div className="table-responsive"><table className="table table-sm"><thead><tr><th>Document</th><th>In / out</th><th>Method</th><th>Amount</th><th>Reference</th></tr></thead><tbody>{entries.map(entry => <tr key={entry.id}><td>{entry.document}</td><td>{entry.direction}</td><td>{entry.method}</td><td>{money(entry.amount)}</td><td>{entry.reference || '—'}</td></tr>)}</tbody></table></div></details>
    <Alert message={error} />
    <form onSubmit={async event => {
      event.preventDefault(); setBusy(true); onBusy(true); setError('');
      try {
        await api.post('/cashier/reconciliation/pharmacy/confirm-on-behalf', { day, cashierId: cashier.cashierId,
          expectedConfirmationId: cashier.confirmationId, fingerprint: cashier.fingerprint,
          openingCash: Number(form.openingCash), countedCash: Number(form.countedCash),
          verified: { BANK_TRANSFER: { received: Number(form.bankIn), refunded: Number(form.bankOut) }, CARD: { received: Number(form.cardIn), refunded: Number(form.cardOut) } },
          referencesChecked: form.referencesChecked, reason: form.reason, evidenceReference: form.evidenceReference });
        await onSaved();
      } catch (caught) { setError(errorMessage(caught)); }
      finally { setBusy(false); onBusy(false); }
    }}>
      <fieldset disabled={busy}>
        <div className="row g-3">{fields.map(([key,label]) => <div className="col-md-4" key={key}><label className="form-label" htmlFor={`review-${key}`}>{label}</label><input id={`review-${key}`} type="number" min="0" step="0.01" required className="form-control" value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value, referencesChecked: false })} /></div>)}</div>
        <p className="small mt-2">Cash difference: <strong className={Math.abs(variance) > .005 ? 'text-danger' : 'text-success'}>{money(variance)}</strong></p>
        <label className="form-label" htmlFor="review-reason">Why the cashier cannot confirm</label><textarea id="review-reason" className="form-control mb-2" required minLength={3} maxLength={500} value={form.reason} onChange={event => setForm({ ...form, reason: event.target.value, referencesChecked: false })} />
        <label className="form-label" htmlFor="review-evidence">Supporting evidence reference</label><input id="review-evidence" className="form-control" required minLength={3} maxLength={250} placeholder="Cash-count sheet / receipt bundle / statement reference" value={form.evidenceReference} onChange={event => setForm({ ...form, evidenceReference: event.target.value, referencesChecked: false })} />
        <label className="d-block my-3"><input type="checkbox" className="form-check-input me-2" checked={form.referencesChecked} onChange={event => setForm({ ...form, referencesChecked: event.target.checked })} />I personally checked this cashier’s cash counts, payment references and refund evidence.</label>
        <div className="d-flex gap-2 justify-content-end"><button type="button" className="btn btn-light" onClick={onCancel}>Cancel review</button><button className="btn btn-primary" disabled={!complete || !form.referencesChecked || Math.abs(variance) > .005}>Record administrator review</button></div>
      </fieldset>
    </form>
  </section>;
}
