import { useEffect, useRef, useState } from 'react';
import { api, errorMessage } from '../api/client';
import { Modal } from './Modal';
import { BulkOperationStatus, type BulkProgress } from './BulkOperationStatus';
import { parseCsv } from '../utils/csv';

type Change = { field: string; label: string; before: unknown; after: unknown };
type Result = { total: number; creates: number; updates: number; unchanged: number; applied: boolean; previewToken?: string; batchId?: string; errors: { row: number; sku: string; errors: string[] }[]; preview?: { row: number; sku: string; action: string; changes: Change[] }[] };
type Format = { fields: { key: string; label: string; help: string; clearable: boolean }[]; instructions: string[] };
type ProgressState = BulkProgress;

const saveBlob = (blob: Blob, name: string) => { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); };
const display = (v: unknown) => v == null || v === '' ? 'Empty' : typeof v === 'boolean' ? v ? 'Yes' : 'No' : String(v);

export function BulkProductModal({ onClose, onApplied }: { onClose(): void; onApplied(): void }) {
  const [rows, setRows] = useState<Record<string, string>[]>([]); const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<Result | null>(null); const [format, setFormat] = useState<Format | null>(null);
  const [error, setError] = useState(''); const [busy, setBusy] = useState(''); const [confirmed, setConfirmed] = useState(false);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const generation = useRef(0); const lock = useRef(false);

  useEffect(() => {
    let active = true;
    const version = generation;
    api.get('/catalog/products/bulk-format').then((r) => { if (active) setFormat(r.data.data); }).catch((e) => { if (active) setError(errorMessage(e)); });
    return () => { active = false; version.current++; };
  }, []);

  const download = async (path: string, name: string) => {
    setError('');
    try { const r = await api.get(path, { responseType: 'blob', timeout: 130000 }); saveBlob(r.data, name); }
    catch (e) { setError(errorMessage(e)); }
  };

  const read = async (file?: File) => {
    if (!file || lock.current) return;
    const id = ++generation.current;
    setRows([]); setResult(null); setConfirmed(false); setError(''); setFileName(file.name); setBusy('Reading file…'); lock.current = true;
    try {
      if (/\.xlsx$/i.test(file.name)) {
        if (file.size > 2_000_000) throw new Error('The Excel file must be 2 MB or smaller.');
        const fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(',')[1]);
          reader.onerror = () => reject(new Error('Cannot read this file.'));
          reader.readAsDataURL(file);
        });
        const r = await api.post('/catalog/products/bulk/excel-preview', { fileBase64 }, { timeout: 130000 });
        if (generation.current === id) {
          setRows(r.data.data.rows);
          setResult(r.data.data);
        }
      } else {
        if (!/\.csv$/i.test(file.name)) throw new Error('Upload an Excel (.xlsx) workbook directly or save as CSV UTF-8.');
        if (file.size > 2_000_000) throw new Error('The CSV must be 2 MB or smaller. Split it into smaller files.');
        const parsed = parseCsv(await file.text());
        if (!parsed.length) throw new Error('The file has no product rows.');
        if (generation.current === id) setRows(parsed);
      }
    } catch (e) { if (generation.current === id) setError(errorMessage(e)); }
    finally { if (generation.current === id) setBusy(''); lock.current = false; }
  };

  const run = async (dryRun: boolean) => {
    if (lock.current || (!dryRun && (!result?.previewToken || !confirmed))) return;
    const id = generation.current;
    lock.current = true;
    setError('');

    if (dryRun) {
      setResult(null);
      setConfirmed(false);
      setBusy('Validating…');
      setProgress({ stage: 'Checking product rows against database…' });
      try {
        const r = await api.post('/catalog/products/bulk', { rows, dryRun: true, fileName: fileName.slice(0, 180) }, { timeout: 130000 });
        if (id !== generation.current) return;
        setProgress({ stage: 'Validation complete.' });
        setResult(r.data.data);
      } catch (e: any) {
        if (id !== generation.current) return;
        setError(errorMessage(e));
        if (e?.response?.data?.details?.errors) setResult(e.response.data.details);
      } finally {
        lock.current = false;
        if (id === generation.current) {
          setBusy('');
          setProgress(null);
        }
      }
      return;
    }

    // Applying changes: chunked upload for safe proxy traversal with progress UI
    const CHUNK_SIZE = 15;
    setBusy('Applying changes. Please keep this dialog open…');

    const generateBatchId = () => {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        try { return crypto.randomUUID(); } catch { /* fallback */ }
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
    };

    try {
      if (rows.length > CHUNK_SIZE) {
        const batchId = generateBatchId();
        const totalBatches = Math.ceil(rows.length / CHUNK_SIZE);
        let totalCreates = 0;
        let totalUpdates = 0;
        let totalUnchanged = 0;

        for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
          if (id !== generation.current) return;
          const chunk = rows.slice(i, i + CHUNK_SIZE);
          const batchNum = Math.floor(i / CHUNK_SIZE) + 1;
          setProgress({
            completed: i,
            total: rows.length,
            stage: `Applying batch ${batchNum} of ${totalBatches}…`,
          });

          const r = await api.post('/catalog/products/bulk', {
            rows: chunk,
            dryRun: false,
            batchId,
            previewToken: result?.previewToken,
            fileName: fileName.slice(0, 180),
          }, { timeout: 120000 });

          setProgress({ stage: `Batch ${batchNum} confirmed.`, completed: i + chunk.length, total: rows.length });
          totalCreates += r.data.data.creates || 0;
          totalUpdates += r.data.data.updates || 0;
          totalUnchanged += r.data.data.unchanged || 0;
        }

        if (id !== generation.current) return;
        setProgress({ stage: 'All product batches applied successfully!' });
        setResult({
          total: rows.length,
          creates: totalCreates,
          updates: totalUpdates,
          unchanged: totalUnchanged,
          applied: true,
          batchId,
          errors: [],
        });
        onApplied();
      } else {
        setProgress({ stage: 'Applying product records to database…' });
        const r = await api.post('/catalog/products/bulk', {
          rows,
          dryRun: false,
          fileName: fileName.slice(0, 180),
          previewToken: result?.previewToken,
        }, { timeout: 120000 });
        if (id !== generation.current) return;
        setProgress({ stage: 'Completed!' });
        setResult(r.data.data);
        onApplied();
      }
    } catch (e: any) {
      if (id !== generation.current) return;
      setError(errorMessage(e));
      setConfirmed(false);
      if (e?.response?.data?.details?.errors) setResult(e.response.data.details);
    } finally {
      lock.current = false;
      if (id === generation.current) {
        setBusy('');
        setProgress(null);
      }
    }
  };

  const downloadErrors = () => saveBlob(new Blob([result?.errors.map((e) => `Data row ${e.row} (${e.sku || 'no SKU'}): ${e.errors.join('; ')}`).join('\r\n') || ''], { type: 'text/plain;charset=utf-8' }), 'mediflow-import-errors.txt');
  const clears = result?.preview?.flatMap((r) => r.changes).filter((c) => c.after == null && c.before != null).length || 0;

  return <Modal title="Bulk create or update products" onClose={() => { if (!lock.current) onClose(); }} size="lg">
    <p>Match products by <strong>SKU</strong>. Blank cells and missing columns keep saved values. Enter <code>[CLEAR]</code> to remove an optional value. Required fields cannot be cleared.</p>
    <div className="d-flex flex-wrap gap-2 mb-3">
      <button className="btn btn-outline-primary" disabled={Boolean(busy)} onClick={() => download('/catalog/products/bulk-template.xlsx', 'MediFlow_Product_Bulk_Import_Template.xlsx')}>Excel template &amp; guide</button>
      <button className="btn btn-outline-secondary" disabled={Boolean(busy)} onClick={() => download('/catalog/products/bulk-template.csv', 'mediflow-product-template.csv')}>CSV examples</button>
      <button className="btn btn-outline-secondary" disabled={Boolean(busy)} onClick={() => download('/catalog/products/export-for-update.xlsx', 'mediflow-products-for-update.xlsx')}>Export for update (Excel)</button><button className="btn btn-outline-secondary" disabled={Boolean(busy)} onClick={() => download('/catalog/products/export-for-update.csv', 'mediflow-products-for-update.csv')}>Export for update</button>
    </div>
    <p className="small text-secondary">Replace all example rows with your own products. You can upload your <strong>.xlsx</strong> Excel template directly or save as CSV UTF-8. Up to 2,000 rows and 2 MB per file.</p>
    {format && <details className="mb-3"><summary>Instructions and column guide</summary><ol className="mt-2">{format.instructions.map((line) => <li key={line}>{line}</li>)}</ol><div className="table-responsive"><table className="table table-sm"><thead><tr><th>Column</th><th>How to fill it in</th><th>Allows [CLEAR]</th></tr></thead><tbody>{format.fields.map((f) => <tr key={f.key}><th scope="row">{f.label}<small className="d-block text-secondary">{f.key}</small></th><td>{f.help}</td><td>{f.clearable ? 'Yes' : 'No'}</td></tr>)}</tbody></table></div></details>}
    <label htmlFor="bulk-product-file" className="form-label">Choose your product spreadsheet (.xlsx or .csv)</label>
    <input id="bulk-product-file" className="form-control" type="file" accept=".xlsx,.csv,text/csv" disabled={Boolean(busy)} onChange={(e) => { void read(e.target.files?.[0]); e.target.value = ''; }} />
    {fileName && <p className="small mt-2">{fileName}{rows.length > 0 ? ` — ${rows.length} product rows loaded` : ''}</p>}
    {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}

    {progress && <BulkOperationStatus progress={progress} />}
    {!progress && busy && <p role="status" className="mt-3 text-secondary small"><span className="spinner-border spinner-border-sm me-2" role="status" />{busy}</p>}

    {result && <section className="mt-3" aria-live="polite">
      <div className={`alert ${result.errors?.length ? 'alert-danger' : 'alert-success'}`}>
        <strong>{result.applied ? 'Bulk update completed' : 'Validation finished — no changes saved'}</strong>
        <div>{result.creates} creates · {result.updates} updates · {result.unchanged || 0} unchanged · {result.errors?.length || 0} invalid rows</div>
        {result.batchId && <div className="small">Import reference: {result.batchId}</div>}
      </div>
      {result.errors?.length > 0 && <><button className="btn btn-outline-secondary mb-2" onClick={downloadErrors}>Download all errors</button><div style={{ maxHeight: 240, overflowY: 'auto' }}>{result.errors.map((e) => <p key={e.row}>Data row {e.row} ({e.sku || 'no SKU'}): {e.errors.join('; ')}</p>)}</div></>}
      {result.preview && <div style={{ maxHeight: 300, overflowY: 'auto' }}>{result.preview.map((r) => <details key={r.row}><summary>{r.sku}: {r.action} ({r.changes.length} fields)</summary><ul>{r.changes.map((c) => <li key={c.field}>{c.label}: {display(c.before)} → <strong>{display(c.after)}</strong></li>)}</ul></details>)}</div>}
      {result.previewToken && !result.applied && <div className="form-check mt-3"><input id="bulk-confirm" className="form-check-input" type="checkbox" checked={confirmed} disabled={Boolean(busy)} onChange={(e) => setConfirmed(e.target.checked)} /><label htmlFor="bulk-confirm" className="form-check-label">I reviewed these changes{clears ? `, including ${clears} cleared values` : ''}.</label></div>}
    </section>}
    <div className="d-flex flex-wrap justify-content-end gap-2 mt-3">
      <button className="btn btn-outline-secondary" disabled={Boolean(busy)} onClick={onClose}>{result?.applied ? 'Done' : 'Close'}</button>
      {!result?.applied && <><button className="btn btn-outline-primary" disabled={Boolean(busy) || !rows.length} onClick={() => run(true)}>Validate rows</button><button className="btn btn-primary" disabled={Boolean(busy) || !result?.previewToken || !confirmed || Boolean(result?.errors?.length)} onClick={() => run(false)}>Apply bulk changes</button></>}
    </div>
  </Modal>;
}
