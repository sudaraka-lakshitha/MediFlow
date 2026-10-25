import { useState } from 'react';
import { api, errorMessage } from '../api/client';
import { parseCsv } from '../utils/csv';
import { Modal } from './Modal';


export function DeliveryBulkModal({ onClose, onApplied }: { onClose(): void; onApplied(): void }) {
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [preview, setPreview] = useState<any>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [confirmed, setConfirmed] = useState(false);
  const read = async (file?: File) => {
    if (!file || busy) return;
    setBusy(true); setError(''); setPreview(null); setConfirmed(false); setRows([]);
    try {
      if (/\.xlsx$/i.test(file.name)) {
        if (file.size > 1000000) throw new Error('Choose an Excel file no larger than 1 MB.');
        const fileBase64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = () => reject(new Error('Cannot read this file.')); reader.readAsDataURL(file); });
        const response = await api.post('/deliveries/bulk/excel-preview', { fileBase64 }, { timeout: 60000 });
        setRows(response.data.data.rows); setPreview(response.data.data);
      } else {
        if (!/\.csv$/i.test(file.name) || file.size > 500000) throw new Error('Choose an Excel (.xlsx) file up to 1 MB or CSV UTF-8 up to 500 KB.');
        const parsed = parseCsv(await file.text(), { requiredColumn: 'invoice_number', maxRows: 50, guideRows: true });
        const response = await api.post('/deliveries/bulk/preview', { rows: parsed }, { timeout: 60000 });
        setRows(parsed); setPreview(response.data.data);
      }
    } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  };
  return <Modal title="Review bulk delivery updates" onClose={onClose} closable={!busy} size="lg">
    <p>Export your filtered deliveries first. In Excel, follow the instructions at the top, choose an <strong>action</strong> and edit the amber fields. Save as .xlsx (recommended) or CSV UTF-8. Keep invoice_number and version unchanged. Maximum 50 rows per upload.</p>
    <ul>
      <li><strong>DISPATCH</strong>: enter courier and tracking. Medicines and fee must be fully paid. This dispenses stock and records the dispatch time.</li>
      <li><strong>DELIVERED</strong>: marks an already-shipped order delivered and records the time.</li>
      <li><strong>UPDATE_TRACKING</strong>: correct courier/tracking for an already-shipped order.</li>
      <li><strong>UPDATE_DETAILS</strong>: correct recipient_name, address or phone before dispatch.</li>
    </ul>
    <p>Blank action skips the row. Blank or omitted editable fields keep saved values. Required delivery details cannot be cleared. Other columns are for reference and are not applied. Use the individual controls for fee confirmation, cancellations and refunds.</p>
    <p>Example: set action to DISPATCH, courier to “Example Courier” and tracking to “TRACK123”. Do not change the exported invoice or version.</p>
    <input className="form-control" aria-label="Delivery update spreadsheet" type="file" accept=".xlsx,.csv" disabled={busy} onChange={e => { void read(e.target.files?.[0]); e.target.value = ''; }} />
    {error && <div role="alert" className="alert alert-danger mt-3">{error}</div>}
    {preview && <>
      <p className="mt-3">{preview.plans.length} update(s), {preview.errors.length} error(s). Nothing has been saved.</p>
      {preview.errors.map((item: any) => <p key={item.row} className="text-danger">Row {item.row} ({item.invoice}): {item.message}</p>)}
      <div className="table-responsive"><table className="table"><thead><tr><th>Row</th><th>Invoice</th><th>Current status</th><th>Action</th><th>Changes</th></tr></thead><tbody>
        {preview.plans.map((plan: any) => <tr key={plan.row}><td>{plan.row}</td><td>{plan.invoice}</td><td>{plan.status}</td><td>{plan.input.action}</td><td>{plan.changes.map((change: any) => <div key={change.field}>{change.field}: {String(change.before)} → {String(change.after)}</div>)}</td></tr>)}
      </tbody></table></div>
      <p>All updates are applied together. Payment, stock and saved-record checks run again at confirmation. If anything fails, no rows are applied.</p>
      {preview.previewToken && <label className="d-block"><input type="checkbox" checked={confirmed} disabled={busy} onChange={e => setConfirmed(e.target.checked)} /> I have reviewed these changes and checked any medicines being dispatched.</label>}
    </>}
    <button className="btn btn-primary mt-3" disabled={busy || !confirmed || !preview?.previewToken} onClick={async () => {
      setBusy(true); setError('');
      try { await api.post('/deliveries/bulk/confirm', { rows, previewToken: preview.previewToken }, { timeout: 120000 }); onApplied(); onClose(); }
      catch (e) { setError(errorMessage(e)); setPreview(null); setConfirmed(false); }
      finally { setBusy(false); }
    }}>{busy ? 'Please wait…' : 'Confirm and apply updates'}</button>
  </Modal>;
}
