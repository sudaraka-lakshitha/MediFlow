import { useState } from 'react';
import { api, errorMessage } from '../api/client';
import { parseCsv } from '../utils/csv';
import { Modal } from './Modal';
import { BulkOperationStatus, type BulkProgress } from './BulkOperationStatus';

export function DeliveryBulkModal({ onClose, onApplied }: { onClose(): void; onApplied(): void }) {
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [preview, setPreview] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [progress, setProgress] = useState<BulkProgress | null>(null);

  const read = async (file?: File) => {
    if (!file || busy) return;
    setBusy(true);
    setError('');
    setPreview(null);
    setConfirmed(false);
    setRows([]);
    setProgress({ stage: 'Reading spreadsheet and checking delivery statuses against database...' });

    try {
      if (/\.xlsx$/i.test(file.name)) {
        if (file.size > 1000000) throw new Error('Choose an Excel file no larger than 1 MB.');
        const fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(',')[1]);
          reader.onerror = () => reject(new Error('Cannot read this file.'));
          reader.readAsDataURL(file);
        });
        const response = await api.post('/deliveries/bulk/excel-preview', { fileBase64 }, { timeout: 120000 });
        setRows(response.data.data.rows);
        setPreview(response.data.data);
      } else {
        if (!/\.csv$/i.test(file.name) || file.size > 500000) throw new Error('Choose an Excel (.xlsx) file up to 1 MB or CSV UTF-8 up to 500 KB.');
        const parsed = parseCsv(await file.text(), { requiredColumn: 'invoice_number', maxRows: 200, guideRows: true });
        const response = await api.post('/deliveries/bulk/preview', { rows: parsed }, { timeout: 120000 });
        setRows(parsed);
        setPreview(response.data.data);
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const handleConfirm = async () => {
    if (!confirmed || !preview?.previewToken || busy) return;
    setBusy(true);
    setError('');
    setProgress({ stage: 'Acquiring workflow leases & applying delivery updates in chunks...' });

    try {
      await api.post('/deliveries/bulk/confirm', { rows, previewToken: preview.previewToken }, { timeout: 120000 });
      setProgress({ stage: 'All deliveries updated successfully!' });
      onApplied();
      onClose();
    } catch (e) {
      setError(errorMessage(e));
      setPreview(null);
      setConfirmed(false);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  return (
    <Modal title="Review bulk delivery updates" onClose={onClose} closable={!busy} size="lg">
      <p>
        Export your filtered deliveries first. In Excel, follow the instructions at the top, choose an <strong>action</strong> and edit the amber fields.
        Save as .xlsx (recommended) or CSV UTF-8. Keep invoice_number and version unchanged. Maximum 200 rows per upload.
      </p>
      <ul>
        <li><strong>DISPATCH</strong>: enter courier and tracking. Medicines and fee must be fully paid. This dispenses stock and records the dispatch time.</li>
        <li><strong>DELIVERED</strong>: marks an already-shipped order delivered and records the time.</li>
        <li><strong>UPDATE_TRACKING</strong>: correct courier/tracking for an already-shipped order.</li>
        <li><strong>UPDATE_DETAILS</strong>: correct recipient_name, address or phone before dispatch.</li>
      </ul>
      <p className="small text-secondary">
        Blank action skips the row. Blank or omitted editable fields keep saved values. Required delivery details cannot be cleared.
      </p>
      <input
        className="form-control"
        aria-label="Delivery update spreadsheet"
        type="file"
        accept=".xlsx,.csv"
        disabled={busy}
        onChange={(e) => {
          void read(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {error && <div role="alert" className="alert alert-danger mt-3">{error}</div>}

      {progress && <BulkOperationStatus progress={progress} />}

      {preview && (
        <>
          <p className="mt-3 fw-bold">
            {preview.plans.length} update(s), {preview.errors.length} error(s). Nothing has been saved yet.
          </p>
          {preview.errors.map((item: any) => (
            <p key={item.row} className="text-danger small mb-1">
              Row {item.row} ({item.invoice}): {item.message}
            </p>
          ))}
          <div className="table-responsive border rounded my-2" style={{ maxHeight: '300px' }}>
            <table className="table table-hover table-sm mb-0">
              <thead className="table-light sticky-top">
                <tr>
                  <th>Row</th>
                  <th>Invoice</th>
                  <th>Current status</th>
                  <th>Action</th>
                  <th>Changes</th>
                </tr>
              </thead>
              <tbody>
                {preview.plans.map((plan: any) => (
                  <tr key={plan.row}>
                    <td>{plan.row}</td>
                    <td><code>{plan.invoice}</code></td>
                    <td><span className="badge bg-secondary">{plan.status}</span></td>
                    <td><span className="badge bg-primary">{plan.input.action}</span></td>
                    <td>
                      {plan.changes.map((change: any) => (
                        <div key={change.field} className="small">
                          <strong>{change.field}:</strong> {String(change.before)} → {String(change.after)}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small text-secondary">
            All updates are processed safely in transactional chunks. Payment, stock and saved-record checks run again at confirmation.
          </p>
          {preview.previewToken && (
            <div className="form-check p-2 bg-light rounded border mb-2">
              <input
                id="delivery-bulk-confirm"
                className="form-check-input"
                type="checkbox"
                checked={confirmed}
                disabled={busy}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <label htmlFor="delivery-bulk-confirm" className="form-check-label ms-2">
                I have reviewed these changes and checked any medicines being dispatched.
              </label>
            </div>
          )}
        </>
      )}

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button type="button" className="btn btn-outline-secondary" disabled={busy} onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy || !confirmed || !preview?.previewToken}
          onClick={handleConfirm}
        >
          {busy ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Applying updates…
            </>
          ) : (
            'Confirm and apply updates'
          )}
        </button>
      </div>
    </Modal>
  );
}
