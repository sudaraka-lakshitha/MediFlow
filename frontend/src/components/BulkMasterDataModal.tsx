import { useRef, useState } from 'react';
import { api, errorMessage } from '../api/client';
import { parseCsv } from '../utils/csv';
import { Modal } from './Modal';

type Preview = {
  rows: Record<string, unknown>[];
  errors: { row: number; message: string }[];
  previewToken?: string;
  preview: { identifier: string; changes: { field: string; before: unknown; after: unknown }[] }[];
};

export function BulkMasterDataModal({ dataset, title, onClose }: { dataset: string; title: string; onClose(): void }) {
  const [result, setResult] = useState<Preview | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState<{ percent: number; stage: string } | null>(null);
  const lock = useRef(false);

  const download = async (format: 'xlsx' | 'csv') => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      const r = await api.get(`/master-data/${dataset}/export.${format}`, { params: { search }, responseType: 'blob', timeout: 130000 });
      const url = URL.createObjectURL(r.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mediflow-${dataset}-for-update.${format}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };

  const read = async (file?: File) => {
    if (!file || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError('');
    setSuccess('');
    setResult(null);
    setConfirmed(false);
    setProgress({ percent: 30, stage: 'Reading file and validating master records against database...' });

    try {
      if (file.size > 2_000_000) throw new Error('Use a file no larger than 2 MB and at most 1,000 rows.');
      let response;
      if (/\.xlsx$/i.test(file.name)) {
        const fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(',')[1]);
          reader.onerror = () => reject(new Error('Cannot read file.'));
          reader.readAsDataURL(file);
        });
        response = await api.post(`/master-data/${dataset}/excel-preview`, { fileBase64 }, { timeout: 130000 });
      } else if (/\.csv$/i.test(file.name)) {
        response = await api.post(`/master-data/${dataset}/preview`, {
          rows: parseCsv(await file.text(), { requiredColumn: dataset === 'patients' ? 'patientnumber' : 'id', maxRows: 1000, guideRows: false }),
        }, { timeout: 130000 });
      } else {
        throw new Error('Choose an Excel .xlsx or CSV UTF-8 file.');
      }
      setResult(response.data.data);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      lock.current = false;
      setBusy(false);
      setProgress(null);
    }
  };

  const apply = async () => {
    if (lock.current || !confirmed || !result?.previewToken) return;
    lock.current = true;
    setBusy(true);
    setError('');
    setProgress({ percent: 50, stage: 'Applying changes in transactional chunks (25/batch)...' });

    try {
      const r = await api.post(`/master-data/${dataset}/confirm`, { rows: result.rows, previewToken: result.previewToken }, { timeout: 130000 });
      setProgress({ percent: 100, stage: 'All updates applied successfully!' });
      setSuccess(`${r.data.data.updated} records updated.`);
      setResult(null);
      setConfirmed(false);
    } catch (e) {
      setError(`${errorMessage(e)} If the connection failed, retry with this same preview to avoid repeating changes.`);
    } finally {
      lock.current = false;
      setBusy(false);
      setProgress(null);
    }
  };

  const changes = result?.preview.filter((r) => r.changes.length) || [];

  return (
    <Modal title={`Bulk update ${title.toLowerCase()}`} onClose={() => { if (!lock.current) onClose(); }} size="lg">
      <p>
        Download saved records, edit the file, upload it, then review and confirm. Blank cells keep details.
        Use <code>[CLEAR]</code> to remove optional details. Keep the identifier and recordVersion unchanged.
      </p>
      <p className="text-secondary small">
        Use the normal creation or registration form to add new records. Patient email, login access and passwords cannot be changed through this file.
      </p>
      <label className="form-label" htmlFor="bulk-master-search">Filter export by name or patient number</label>
      <input id="bulk-master-search" className="form-control mb-2" value={search} maxLength={150} disabled={busy} onChange={(e) => setSearch(e.target.value)} />
      <div className="d-flex gap-2 flex-wrap mb-3">
        <button className="btn btn-outline-primary btn-sm" disabled={busy} onClick={() => download('xlsx')}>
          Export for update (Excel)
        </button>
        <button className="btn btn-outline-secondary btn-sm" disabled={busy} onClick={() => download('csv')}>
          Export for update (CSV)
        </button>
      </div>

      <label className="form-label" htmlFor="bulk-master-file">Upload edited Excel or CSV</label>
      <input id="bulk-master-file" type="file" accept=".xlsx,.csv" className="form-control mb-3" disabled={busy} onChange={(e) => { void read(e.target.files?.[0]); e.target.value = ''; }} />

      {error && <div role="alert" className="alert alert-danger">{error}</div>}
      {success && <div role="status" className="alert alert-success">{success}</div>}

      {progress && (
        <div className="card bg-light border-primary mb-3 p-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <strong className="text-primary small">
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
              {progress.stage}
            </strong>
            <span className="badge bg-primary">{progress.percent}%</span>
          </div>
          <div className="progress" style={{ height: '10px' }} role="progressbar" aria-valuenow={progress.percent} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
              style={{ width: `${progress.percent}%`, transition: 'width 0.4s ease-in-out' }}
            />
          </div>
        </div>
      )}

      {result && (
        <>
          <p className="fw-bold">
            {changes.length} records have changes. {result.errors.length} invalid rows. Nothing is saved until you confirm.
          </p>
          {result.errors.map((e, i) => (
            <p className="text-danger small mb-1" key={i}>Row {e.row}: {e.message}</p>
          ))}
          <div className="table-responsive border rounded my-2" style={{ maxHeight: 330 }}>
            <table className="table table-hover table-sm mb-0">
              <thead className="table-light sticky-top">
                <tr>
                  <th>Record</th>
                  <th>Field</th>
                  <th>Saved value</th>
                  <th>New value</th>
                </tr>
              </thead>
              <tbody>
                {changes.flatMap((r) =>
                  r.changes.map((c) => (
                    <tr key={`${r.identifier}-${c.field}`}>
                      <td><code>{r.identifier}</code></td>
                      <td>{c.field}</td>
                      <td>{String(c.before ?? 'Empty')}</td>
                      <td><strong>{String(c.after ?? 'Clear value')}</strong></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="form-check p-2 bg-light rounded border my-3">
            <input
              id="bulk-master-confirm"
              type="checkbox"
              className="form-check-input"
              checked={confirmed}
              disabled={busy || !!result.errors.length}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <label htmlFor="bulk-master-confirm" className="form-check-label ms-2">
              I have reviewed these changes and verified the records to update.
            </label>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" disabled={busy} onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              disabled={busy || !confirmed || !changes.length || !!result.errors.length}
              onClick={apply}
            >
              {busy ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Applying updates…
                </>
              ) : (
                'Confirm updates'
              )}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
