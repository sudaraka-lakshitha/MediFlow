import { useEffect, useState } from 'react';
import { api, errorMessage } from '../api/client';
export function UploadAttachmentSelector({ uploadId, onLoad }: { uploadId: number; onLoad(blob: Blob): void }) {
  const [files, setFiles] = useState<{ id: number | null; originalName: string }[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    api.get(`/prescription-uploads/${uploadId}/attachments`).then(response => { if (active) setFiles(response.data.data); }).catch(e => { if (active) setError(errorMessage(e)); });
    return () => { active = false; };
  }, [uploadId]);
  return <div className="mb-2">
    {files.length > 1 && <label className="d-block">Prescription attachment<select className="form-select" disabled={busy} onChange={async event => {
      setBusy(true); setError('');
      try { const response = await api.get(`/prescription-uploads/${uploadId}/file`, { responseType: 'blob', params: event.target.value ? { attachmentId: event.target.value } : {} }); onLoad(response.data); }
      catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
    }}>{files.map((file, index) => <option key={file.id || 'first'} value={file.id || ''}>{index + 1}. {file.originalName}</option>)}</select></label>}
    {error && <div className="text-danger" role="alert">{error}</div>}
  </div>;
}
