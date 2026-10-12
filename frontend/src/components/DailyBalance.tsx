import { useState } from 'react';
import { api, errorMessage } from '../api/client';
import { Modal, ModalActions } from './Modal';
import { Alert } from './Ui';
import { useAuth } from '../auth/useAuth';
import { CashierBalanceReview } from './CashierBalanceReview';
const money = (value: unknown) => `Rs. ${Number(value || 0).toFixed(2)}`;
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const blankForm = () => ({ openingCash: '', countedCash: '', bankIn: '', bankOut: '', cardIn: '', cardOut: '', referencesChecked: false, notes: '' });
const localTime = (value: string) => new Date(value).toLocaleString('en-GB', { timeZone: 'Asia/Colombo' });

export function DailyBalance() {
  const { user } = useAuth();
  const canViewPharmacy = user?.role === 'ADMIN' || (user?.pharmacyReconciliationAccess && (user.role === 'CASHIER' || (user.role === 'PHARMACIST' && user.cashierAccess)));
  const [scope, setScope] = useState('PERSONAL');
  const pharmacy = scope === 'PHARMACY';
  const endpoint = `/cashier/reconciliation${pharmacy ? '/pharmacy' : ''}`;
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(today);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [correction, setCorrection] = useState({ entryId: '', method: 'BANK_TRANSFER', reference: '', reason: '' });
  const [form, setForm] = useState<any>(blankForm);
  const [reviewCashier, setReviewCashier] = useState<any>(null);
  const reset = () => { setData(null); setError(''); setForm(blankForm()); setReviewCashier(null); setCorrection({ entryId: '', method: 'BANK_TRANSFER', reference: '', reason: '' }); };
  const load = async () => { setBusy(true); setError(''); setReviewCashier(null); try { setData((await api.get(endpoint,{ params: { day } })).data.data); setForm((current: any) => ({ ...current, referencesChecked: false })); } catch(caught) { setError(errorMessage(caught)); setData(null); } finally { setBusy(false); } };
  const exportBank = () => {
    const csvValue = (value: unknown) => { let text = String(value ?? ''); if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`; return `"${text.replaceAll('"','""')}"`; };
    const lines = [['Date (Sri Lanka)','Cashier','Document','Direction','Amount','Transaction / payout reference','Original payment method'],...data.entries.filter((entry: any) => entry.method === 'BANK_TRANSFER' || entry.originalMethod?.includes('BANK_TRANSFER')).map((entry: any) => [localTime(entry.date),entry.cashierName || user?.fullName,entry.document,`${entry.direction} ${entry.method}`,entry.amount,entry.reference,entry.originalMethod || entry.method])];
    const url = URL.createObjectURL(new Blob([lines.map((line) => line.map(csvValue).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'})); const link = document.createElement('a'); link.href=url; link.download=`bank-reconciliation-${scope.toLowerCase()}-${day}.csv`; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const verified = { BANK_TRANSFER: { received: Number(form.bankIn), refunded: Number(form.bankOut) }, CARD: { received: Number(form.cardIn), refunded: Number(form.cardOut) } };
  const allEntered = ['openingCash','countedCash','bankIn','bankOut','cardIn','cardOut'].every((key) => form[key] !== '' && Number(form[key]) >= 0);
  const variance = data ? Number(form.countedCash) - Number(form.openingCash) - data.totals.CASH.net : 0;
  return <>
    <button className="btn btn-outline-primary" onClick={() => { setOpen(true); load(); }}>Daily balance & bank reconciliation</button>
    {open && <Modal title="Daily balance & bank reconciliation" onClose={() => !busy && setOpen(false)} size="xl">
      {canViewPharmacy && <div className="mb-3"><label htmlFor="balance-scope" className="form-label">Balance scope</label><select id="balance-scope" className="form-select" value={scope} disabled={busy} onChange={event => { setScope(event.target.value); reset(); }}><option value="PERSONAL">My cashier balance</option><option value="PHARMACY">Entire pharmacy — all cashiers</option></select></div>}
      <p className="text-secondary">{pharmacy ? 'All cashiers’ activity. Each cashier needs a current sign-off, or a documented administrator review if unavailable, before the combined pharmacy balance can be confirmed.' : 'Your cashier activity.'} Transactions use payment/payout date (Sri Lanka time). Cash refunds reduce the till even when the customer originally paid by bank. Pending refunds are not yet payouts.</p>
      <div className="d-flex flex-wrap gap-2 mb-3"><label htmlFor="balance-day" className="align-self-center">Business day</label><input id="balance-day" type="date" disabled={busy} max={today()} className="form-control w-auto" value={day} onChange={(event) => { setDay(event.target.value); reset(); }} /><button className="btn btn-outline-secondary" disabled={busy} onClick={load}>Load / refresh transactions</button>{data && <button className="btn btn-outline-secondary" onClick={exportBank}>Download bank references (CSV)</button>}</div>
      <Alert message={error} />
      {data && <>
        <div className={`alert ${data.confirmed ? 'alert-success' : 'alert-warning'}`}>{data.confirmed ? `Balance confirmed on ${localTime(data.confirmations[0].createdAt)}${pharmacy ? ` by ${data.confirmations[0].snapshot.confirmedBy}` : ''}.` : data.confirmations.length ? 'Transactions or cashier confirmations changed. Reconcile and confirm again.' : 'Not yet confirmed.'} {data.pendingRefunds > 0 && `${data.pendingRefunds} authorized refund(s) still await payout (current queue, not this day’s payouts).`}</div>
        {pharmacy && <section className="mb-3" aria-label="Individual cashier confirmations"><h4 className="h6">Individual cashier confirmations</h4><div className="table-responsive"><table className="table table-sm"><thead><tr><th>Cashier</th><th>Daily balance</th><th>Opening cash</th><th>Counted closing cash</th><th>Last confirmation (Sri Lanka)</th></tr></thead><tbody>{data.cashiers.map((cashier: any) => <tr key={cashier.cashierId}><td>{cashier.name}</td><td className={cashier.confirmed ? 'text-success' : 'text-danger'}>{cashier.confirmed ? 'Confirmed' : cashier.confirmationId ? 'Changed — reconfirm' : 'Not confirmed'}</td><td>{cashier.openingCash == null ? '—' : money(cashier.openingCash)}</td><td>{cashier.countedCash == null ? '—' : money(cashier.countedCash)}</td><td>{cashier.confirmedAt ? localTime(cashier.confirmedAt) : '—'}</td></tr>)}</tbody></table></div>{!data.cashiers.length && <p className="small">No cashier transactions or cash counts recorded for this day.</p>}<p className="small">Confirmed cashier counts combined: opening cash <strong>{money(data.openingCash)}</strong>; closing cash <strong>{money(data.countedCash)}</strong>. Missing or stale counts must be resolved before final confirmation.</p></section>}
        {data.warnings.map((warning: string,index: number) => <p className="text-danger small" key={index}>{warning}</p>)}
        {pharmacy && <div className="mb-3">
          {data.cashiers.filter((cashier: any) => cashier.review).map((cashier: any) => <details key={cashier.cashierId} className="small mb-2"><summary>{cashier.name}: administrator review by {cashier.review.reviewerName}{!cashier.confirmed && ' (outdated — recheck required)'}</summary><p className="mb-0">Reason: {cashier.review.reason}<br />Evidence: {cashier.review.evidenceReference}</p></details>)}
          {user?.role === 'ADMIN' && data.cashiers.filter((cashier: any) => !cashier.confirmed && cashier.cashierId !== user.id).map((cashier: any) => <button key={cashier.cashierId} className="btn btn-outline-secondary me-2 mb-2" disabled={busy} onClick={() => setReviewCashier(cashier)}>Review on behalf of {cashier.name}</button>)}
        </div>}
        {pharmacy && reviewCashier && <CashierBalanceReview key={`${day}-${reviewCashier.cashierId}-${reviewCashier.confirmationId}`} day={day} cashier={reviewCashier} entries={data.entries.filter((entry: any) => entry.cashierId === reviewCashier.cashierId)} onBusy={setBusy} onCancel={() => setReviewCashier(null)} onSaved={async () => { setReviewCashier(null); await load(); }} />}
        {!pharmacy && data.entries.some((entry: any) => !entry.id.startsWith('legacy-sale-') && (entry.method === 'OTHER' || (entry.method === 'BANK_TRANSFER' && !entry.reference) || entry.warning?.startsWith('Legacy refund'))) && <form className="border rounded p-3 mb-3" onSubmit={async event => {
          event.preventDefault(); setBusy(true); setError('');
          try { await api.post('/cashier/reconciliation/classify', { ...correction, day, fingerprint: data.fingerprint }); setCorrection({ entryId: '', method: 'BANK_TRANSFER', reference: '', reason: '' }); await load(); }
          catch (caught) { setError(errorMessage(caught)); } finally { setBusy(false); }
        }}>
          <h4 className="h6">Resolve an unclassified payment</h4>
          <p className="small text-secondary">Check the receipt or bank statement first. This records an audited correction, not a new payment. Recount the updated balances afterwards.</p>
          <label className="form-label" htmlFor="classify-entry">Transaction</label><select id="classify-entry" className="form-select mb-2" required value={correction.entryId} onChange={event => setCorrection({ ...correction, entryId: event.target.value })}><option value="">Choose transaction</option>{data.entries.filter((entry: any) => !entry.id.startsWith('legacy-sale-') && (entry.method === 'OTHER' || (entry.method === 'BANK_TRANSFER' && !entry.reference) || entry.warning?.startsWith('Legacy refund'))).map((entry: any) => <option key={entry.id} value={entry.id}>{entry.document} · {entry.direction} · {money(entry.amount)} · {entry.id}</option>)}</select>
          <label className="form-label" htmlFor="classify-method">Verified payment method</label><select id="classify-method" className="form-select mb-2" value={correction.method} onChange={event => setCorrection({ ...correction, method: event.target.value })}><option value="BANK_TRANSFER">Bank transfer</option><option value="CARD">Card</option><option value="CASH">Cash</option></select>
          <label className="form-label" htmlFor="classify-reference">Receipt / statement reference</label><input id="classify-reference" className="form-control mb-2" required maxLength={120} value={correction.reference} onChange={event => setCorrection({ ...correction, reference: event.target.value })}/>
          <label className="form-label" htmlFor="classify-reason">Correction reason</label><input id="classify-reason" className="form-control mb-2" required minLength={3} maxLength={500} value={correction.reason} onChange={event => setCorrection({ ...correction, reason: event.target.value })}/>
          <button className="btn btn-outline-primary" disabled={busy}>Save verified classification</button>
        </form>}
        <div className="table-responsive"><table className="table"><thead><tr><th>Method</th><th>Received</th><th>Refunds paid out</th><th>Net</th></tr></thead><tbody>{Object.entries(data.totals).map(([method,value]:[string,any]) => <tr key={method}><th>{method.replaceAll('_',' ')}</th><td>{money(value.received)}</td><td>{money(value.refunded)}</td><td>{money(value.net)}</td></tr>)}</tbody></table></div>
        <details className="mb-3" open><summary>Payment and refund references</summary><div className="table-responsive" style={{maxHeight:280}}><table className="table table-sm"><thead><tr><th>Time (Sri Lanka)</th>{pharmacy && <th>Cashier</th>}<th>Document</th><th>In / out</th><th>Method</th><th>Amount</th><th>Reference</th><th>Originally paid by</th></tr></thead><tbody>{data.entries.map((entry:any)=><tr key={entry.id}><td>{localTime(entry.date)}</td>{pharmacy && <td>{entry.cashierName}</td>}<td>{entry.document}</td><td>{entry.direction}</td><td>{entry.method}</td><td>{money(entry.amount)}</td><td>{entry.reference || '—'}</td><td>{entry.originalMethod || '—'}</td></tr>)}</tbody></table></div></details>
        <form onSubmit={async(event)=>{event.preventDefault();setBusy(true);setError('');try{await api.post(`${endpoint}/confirm`,{day,fingerprint:data.fingerprint,openingCash:Number(form.openingCash),countedCash:Number(form.countedCash),verified,referencesChecked:form.referencesChecked,notes:form.notes});await load();}catch(caught){setError(errorMessage(caught));}finally{setBusy(false);}}}>
          <h4 className="h6">Count and verify actual balances</h4><div className="row g-3">{[['openingCash','Opening cash / float'],['countedCash','Counted closing cash'],['bankIn','Bank statement credits'],['bankOut','Bank refund debits'],['cardIn','Card terminal receipts'],['cardOut','Card refund reversals']].map(([key,label])=><div className="col-md-4" key={key}><label htmlFor={`balance-${key}`} className="form-label">{label}</label><input id={`balance-${key}`} className="form-control" type="number" required min="0" step="0.01" value={form[key]} onChange={(event)=>setForm({...form,[key]:event.target.value,referencesChecked:false})}/></div>)}</div>
          <p className="mt-3 mb-1">Expected closing cash: <strong>{money(Number(form.openingCash)+data.totals.CASH.net)}</strong>. Difference: <strong className={Math.abs(variance)>.005?'text-danger':'text-success'}>{money(variance)}</strong></p>
          <p className="text-secondary small">Do not include pending transfer slips as received money. Enter 0 for methods with no activity. Cash drops, expenses and drawer transfers must be reconciled separately; this view covers customer receipts and refunds.</p>
          <label htmlFor="balance-notes" className="form-label">Reconciliation notes</label><textarea id="balance-notes" className="form-control" maxLength={500} value={form.notes} onChange={(event)=>setForm({...form,notes:event.target.value})}/>
          <label className="d-block my-3"><input className="form-check-input me-2" type="checkbox" checked={form.referencesChecked} onChange={(event)=>setForm({...form,referencesChecked:event.target.checked})}/>I checked the cash count, bank/card references and refund payout evidence, including any different refund method.</label>
          <ModalActions onClose={()=>!busy && setOpen(false)} submitLabel={pharmacy ? 'Confirm pharmacy-wide daily balance' : 'Confirm daily balance'} busy={busy} disabled={(pharmacy && data.confirmed) || !allEntered || !form.referencesChecked || !!data.warnings.length || Math.abs(variance)>.005}/>
        </form>
      </>}
    </Modal>}
  </>;
}
