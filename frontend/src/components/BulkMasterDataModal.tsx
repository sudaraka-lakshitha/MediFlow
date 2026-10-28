import { useRef, useState } from 'react';
import { api, errorMessage } from '../api/client';
import { parseCsv } from '../utils/csv';
import { Modal } from './Modal';
type Preview = { rows: Record<string, unknown>[]; errors: { row: number; message: string }[]; previewToken?: string; preview: { identifier: string; changes: { field: string; before: unknown; after: unknown }[] }[] };
export function BulkMasterDataModal({ dataset, title, onClose }: { dataset: string; title: string; onClose(): void }) {
  const [result,setResult]=useState<Preview|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[confirmed,setConfirmed]=useState(false),[search,setSearch]=useState(''),[success,setSuccess]=useState('');
  const lock=useRef(false);
  const download=async(format:'xlsx'|'csv')=>{
    if(lock.current)return;lock.current=true;setBusy(true);setError('');
    try {const r=await api.get(`/master-data/${dataset}/export.${format}`,{params:{search},responseType:'blob',timeout:130000});const url=URL.createObjectURL(r.data),a=document.createElement('a');a.href=url;a.download=`mediflow-${dataset}-for-update.${format}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
    catch(e){setError(errorMessage(e));}finally{lock.current=false;setBusy(false);}
  };
  const read=async(file?:File)=>{
    if(!file||lock.current)return;lock.current=true;setBusy(true);setError('');setSuccess('');setResult(null);setConfirmed(false);
    try {
      if(file.size>2_000_000)throw new Error('Use a file no larger than 2 MB and at most 1,000 rows.');
      let response;
      if(/\.xlsx$/i.test(file.name)) {
        const fileBase64=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('Cannot read file.'));reader.readAsDataURL(file);});
        response=await api.post(`/master-data/${dataset}/excel-preview`,{fileBase64},{timeout:130000});
      } else if(/\.csv$/i.test(file.name)) response=await api.post(`/master-data/${dataset}/preview`,{rows:parseCsv(await file.text(), { requiredColumn: dataset==='patients'?'patientnumber':'id', maxRows:1000, guideRows:false })},{timeout:130000});
      else throw new Error('Choose an Excel .xlsx or CSV UTF-8 file.');
      setResult(response.data.data);
    }catch(e){setError(errorMessage(e));}finally{lock.current=false;setBusy(false);}
  };
  const apply=async()=>{
    if(lock.current||!confirmed||!result?.previewToken)return;lock.current=true;setBusy(true);setError('');
    try {const r=await api.post(`/master-data/${dataset}/confirm`,{rows:result.rows,previewToken:result.previewToken},{timeout:130000});setSuccess(`${r.data.data.updated} records updated.`);setResult(null);setConfirmed(false);}
    catch(e){setError(`${errorMessage(e)} If the connection failed, retry with this same preview to avoid repeating changes.`);}
    finally{lock.current=false;setBusy(false);}
  };
  const changes=result?.preview.filter(r=>r.changes.length)||[];
  return <Modal title={`Bulk update ${title.toLowerCase()}`} onClose={()=>{if(!lock.current)onClose();}} size="lg">
    <p>Download saved records, edit the file, upload it, then review and confirm. Blank cells keep details. Use <code>[CLEAR]</code> to remove optional details. Keep the identifier and recordVersion unchanged.</p>
    <p className="text-secondary small">Use the normal creation or registration form to add new records. Patient email, login access and passwords cannot be changed through this file.</p>
    <label className="form-label" htmlFor="bulk-master-search">Filter export by name or patient number</label>
    <input id="bulk-master-search" className="form-control mb-2" value={search} maxLength={150} disabled={busy} onChange={e=>setSearch(e.target.value)}/>
    <div className="d-flex gap-2 flex-wrap mb-3"><button className="btn btn-outline-primary" disabled={busy} onClick={()=>download('xlsx')}>Export for update (Excel)</button><button className="btn btn-outline-secondary" disabled={busy} onClick={()=>download('csv')}>Export for update (CSV)</button></div>
    <label className="form-label" htmlFor="bulk-master-file">Upload edited Excel or CSV</label><input id="bulk-master-file" type="file" accept=".xlsx,.csv" className="form-control mb-3" disabled={busy} onChange={e=>{void read(e.target.files?.[0]);e.target.value='';}}/>
    {error&&<div role="alert" className="alert alert-danger">{error}</div>}{success&&<div role="status" className="alert alert-success">{success}</div>}
    {result&&<><p>{changes.length} records have changes. {result.errors.length} invalid rows. Nothing is saved until you confirm.</p>{result.errors.map((e,i)=><p className="text-danger" key={i}>Row {e.row}: {e.message}</p>)}
    <div className="table-responsive" style={{maxHeight:330}}><table className="table"><thead><tr><th>Record</th><th>Field</th><th>Saved value</th><th>New value</th></tr></thead><tbody>{changes.flatMap(r=>r.changes.map(c=><tr key={`${r.identifier}-${c.field}`}><td>{r.identifier}</td><td>{c.field}</td><td>{String(c.before??'Empty')}</td><td>{String(c.after??'Clear value')}</td></tr>))}</tbody></table></div>
    <label className="d-flex gap-2 my-3"><input type="checkbox" checked={confirmed} disabled={busy||!!result.errors.length} onChange={e=>setConfirmed(e.target.checked)}/>I reviewed these changes.</label><button className="btn btn-primary" disabled={busy||!confirmed||!changes.length||!!result.errors.length} onClick={apply}>{busy?'Working…':'Confirm updates'}</button></>}
  </Modal>;
}
