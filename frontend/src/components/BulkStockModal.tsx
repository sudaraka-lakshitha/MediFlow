import { useState } from 'react';
import axios from 'axios';
import { api, errorMessage } from '../api/client';
import { parseCsv } from '../utils/csv';
import { Modal } from './Modal';

interface BulkStockModalProps {
  onClose(): void;
  onApplied(): void;
}

export function BulkStockModal({ onClose, onApplied }: BulkStockModalProps) {
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [preview, setPreview] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [search, setSearch] = useState('');

  const saveBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      const res = await api.get(url, { responseType: 'blob' });
      saveBlob(res.data, filename);
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const read = async (file?: File) => {
    if (!file || busy) return;
    setBusy(true);
    setError('');
    setPreview(null);
    setConfirmed(false);
    setRows([]);

    try {
      if (/\.xlsx$/i.test(file.name)) {
        if (file.size > 2_000_000) throw new Error('Please select an Excel file no larger than 2 MB.');
        const fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(',')[1]);
          reader.onerror = () => reject(new Error('Cannot read this file.'));
          reader.readAsDataURL(file);
        });
        const response = await api.post('/inventory/batches/bulk/excel-preview', { fileBase64 }, { timeout: 60000 });
        setRows(response.data.data.rows);
        setPreview(response.data.data);
      } else {
        if (!/\.csv$/i.test(file.name) || file.size > 1_000_000) {
          throw new Error('Please select an Excel (.xlsx) file up to 2 MB or CSV UTF-8 up to 1 MB.');
        }
        const parsed = parseCsv(await file.text(), { requiredColumn: 'sku', maxRows: 500, guideRows: false });
        const response = await api.post('/inventory/batches/bulk/preview', { rows: parsed }, { timeout: 60000 });
        setRows(parsed);
        setPreview(response.data.data);
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirmed || !preview?.previewToken || busy) return;
    setBusy(true);
    setError('');
    try {
      await api.post('/inventory/batches/bulk/confirm', {
        rows,
        previewToken: preview.previewToken,
      }, { timeout: 120000 });
      onApplied();
      onClose();
    } catch (e) {
      setError(errorMessage(e));
      // Preserve the same preview after an uncertain network result so retrying
      // replays the recorded operation instead of receiving the stock twice.
      if (axios.isAxiosError(e) && [400, 409, 422].includes(e.response?.status || 0)) {
        setPreview(null);
        setConfirmed(false);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Bulk stock batch updates & receipts" onClose={onClose} closable={!busy} size="lg">
      <div className="mb-3">
        <p className="mb-2">
          Receive wholesale supplier shipments or update batch counts following stocktaking and audits.
          In the Excel template, fill in the <strong>amber editable columns</strong> and save as <code>.xlsx</code> (recommended) or <code>.csv</code>.
        </p>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            disabled={busy}
            onClick={() => downloadFile('/inventory/batches/bulk/template.xlsx', 'MediFlow_Stock_Import_Template.xlsx')}
          >
            <i className="bi bi-file-earmark-excel me-1" />
            Excel template &amp; guide
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            disabled={busy}
            onClick={() => downloadFile('/inventory/batches/bulk/template.csv', 'mediflow-stock-template.csv')}
          >
            <i className="bi bi-file-earmark-text me-1" />
            CSV sample
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            disabled={busy}
            onClick={() => downloadFile(`/inventory/batches/bulk/export-for-update?format=xlsx&search=${encodeURIComponent(search)}`, 'mediflow-stock-for-update.xlsx')}
          >
            <i className="bi bi-download me-1" />
            Export for update (Excel)
          </button>
        </div>
        <label htmlFor="stock-export-search" className="form-label">Filter stock export by product name, SKU or batch (up to 500 batches)</label>
        <input id="stock-export-search" className="form-control mb-2" value={search} maxLength={150} disabled={busy} onChange={e=>setSearch(e.target.value)}/>
        <button type="button" className="btn btn-outline-secondary btn-sm mb-3" disabled={busy} onClick={()=>downloadFile(`/inventory/batches/bulk/export-for-update?format=csv&search=${encodeURIComponent(search)}`, 'mediflow-stock-for-update.csv')}>Export for update (CSV)</button>

        <div className="alert alert-info py-2 small mb-3">
          <div className="fw-bold mb-1"><i className="bi bi-info-circle me-1" /> Action Guide:</div>
          <ul className="mb-0 ps-3">
            <li><strong>RECEIVE / RESTOCK</strong>: Log incoming shipments from manufacturers/distributors. Specify SKU, Batch Number, Quantity, Cost, Expiry Date, and Supplier.</li>
            <li><strong>ADJUST</strong>: Enter a signed change (for example, <code>-5</code> removes five units).</li>
            <li><strong>SET_COUNT</strong>: Enter the total physically counted. An unchanged export makes no stock movement.</li>
            <li><strong>Measured units (mL / g)</strong>: Use up to three decimal places. Tablets, capsules and other countable items require whole numbers.</li>
            <li>Blank optional fields keep existing values. Use <code>[CLEAR]</code> to remove a supplier; expiry and cost cannot be cleared.</li>
          </ul>
        </div>

        <label htmlFor="bulk-stock-file" className="form-label fw-bold">
          Upload stock spreadsheet (.xlsx or .csv)
        </label>
        <input
          id="bulk-stock-file"
          className="form-control"
          type="file"
          accept=".xlsx,.csv"
          disabled={busy}
          onChange={(e) => {
            void read(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>

      {busy && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-secondary small">Processing stock batches, please wait...</p>
        </div>
      )}

      {error && (
        <div role="alert" className="alert alert-danger mt-3">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {error}
        </div>
      )}

      {preview && (
        <div className="mt-4">
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3 p-2 bg-light rounded border">
            <div>
              <span className="badge bg-primary me-2">{preview.summary.validUpdates} valid updates</span>
              <span className="badge bg-success me-2">{preview.summary.receives} receipts</span>
              <span className="badge bg-info me-2">{preview.summary.adjusts} adjustments</span>
              {preview.summary.errorsCount > 0 && (
                <span className="badge bg-danger">{preview.summary.errorsCount} errors</span>
              )}
            </div>
            <small className="text-secondary">Validation completed — nothing saved yet.</small>
          </div>

          {preview.errors.length > 0 && (
            <div className="alert alert-warning py-2 mb-3">
              <div className="fw-bold text-danger mb-1">
                <i className="bi bi-x-circle me-1" /> Issues found in spreadsheet:
              </div>
              <ul className="mb-0 ps-3 small text-danger">
                {preview.errors.map((item: any, idx: number) => (
                  <li key={idx}>
                    Row {item.row} ({item.sku}): {item.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {preview.plans.length > 0 && (
            <div className="table-responsive border rounded mb-3" style={{ maxHeight: '360px' }}>
              <table className="table table-hover table-sm mb-0 align-middle">
                <thead className="table-light sticky-top">
                  <tr>
                    <th>Row</th>
                    <th>Product</th>
                    <th>Batch</th>
                    <th>Action</th>
                    <th>Cost</th>
                    <th>Expiry</th>
                    <th>Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.plans.map((plan: any) => (
                    <tr key={`${plan.row}-${plan.batchNumber}`}>
                      <td>{plan.row}</td>
                      <td>
                        <strong>{plan.productName}</strong>
                        <div className="text-secondary small">{plan.productCode} • {plan.unit}</div>
                      </td>
                      <td><code>{plan.batchNumber}</code></td>
                      <td>
                        <span className={`badge ${plan.action === 'RECEIVE' ? 'bg-success' : 'bg-primary'}`}>
                          {plan.action}
                        </span>
                      </td>
                      <td>{plan.purchasePrice > 0 ? `Rs. ${plan.purchasePrice.toFixed(2)}` : '—'}</td>
                      <td><small>{plan.expiryDate || '—'}</small></td>
                      <td>
                        {plan.changes.map((c: any, i: number) => (
                          <div key={i} className="small">
                            <strong>{c.label}:</strong> {c.before} → <span className="text-success fw-bold">{c.after}</span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {preview.previewToken && (
            <div className="form-check p-3 bg-light rounded border mb-3">
              <input
                id="stock-bulk-confirm"
                className="form-check-input"
                type="checkbox"
                checked={confirmed}
                disabled={busy}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <label htmlFor="stock-bulk-confirm" className="form-check-label ms-2">
                I have reviewed these stock batch updates and verified physical stocks / wholesale delivery invoices.
              </label>
            </div>
          )}

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={busy}
              onClick={onClose}
            >
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
                  Applying updates...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle me-1" />
                  Confirm and apply stock updates
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
