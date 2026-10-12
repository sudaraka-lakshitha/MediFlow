import { useEffect, useState } from 'react';
import { api, errorMessage } from '../api/client';
import { Alert } from './Ui';

type Filters = { userId:string; action:string; entityType:string; outcome:string; from:string; to:string };
type Report = { data:{id:number;time:string;staff:string;role:string;task:string;module:string;record:string;reference:string;result:string;archived:boolean}[];
  tasks:{action:string;task:string;successful:number;failed:number;total:number}[];
  meta:{page:number;pages:number;total:number;successful:number;failed:number;generatedAt:string} };
const localDate=(date:Date)=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Colombo',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
const localTime=(value:string)=>new Date(value).toLocaleString('en-GB',{timeZone:'Asia/Colombo'});
const params=(filters:Filters,page=1)=>({...Object.fromEntries(Object.entries(filters).filter(([,value])=>value!=='')),page,pageSize:50});

export function StaffActivityReport() {
  const [filters,setFilters]=useState<Filters>(()=>({userId:'',action:'',entityType:'',outcome:'',from:localDate(new Date(Date.now()-29*86400000)),to:localDate(new Date())}));
  const [applied,setApplied]=useState<Filters|null>(null);
  const [options,setOptions]=useState<{staff:{id:number;fullName:string;role:string;active:boolean}[];actions:{value:string;label:string}[];modules:{value:string;label:string}[]}|null>(null);
  const [report,setReport]=useState<Report|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [optionsAttempt,setOptionsAttempt]=useState(0);
  useEffect(()=>{let current=true;api.get('/staff-activity-report/options').then(response=>{if(current){setOptions(response.data.data);setError('');}}).catch(caught=>{if(current)setError(errorMessage(caught));});return()=>{current=false;};},[optionsAttempt]);
  const changed=!!applied && JSON.stringify(applied)!==JSON.stringify(filters);
  const invalid=!filters.from || !filters.to || filters.from>filters.to || Date.parse(filters.to)-Date.parse(filters.from)>365*86400000;
  const run=async(page=1)=>{
    setBusy(true);setError('');
    try {const response=await api.get('/staff-activity-report',{params:params(filters,page)});setReport(response.data);setApplied({...filters});}
    catch(caught){setError(errorMessage(caught));setReport(null);setApplied(null);}
    finally{setBusy(false);}
  };
  const download=async()=>{
    if(!applied || changed)return;
    setBusy(true);setError('');
    try {
      const response=await api.get('/staff-activity-report/export.csv',{params:params(applied),responseType:'blob'});
      const url=URL.createObjectURL(response.data);const link=document.createElement('a');link.href=url;link.download=`staff-activity-${applied.from}-to-${applied.to}.csv`;
      document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    } catch(caught){setError(errorMessage(caught));} finally{setBusy(false);}
  };
  const set=(key:keyof Filters,value:string)=>setFilters(current=>({...current,[key]:value}));
  return <section className="panel mb-4" aria-label="Staff activity report">
    <div className="panel-header"><div><h3>Staff activity report</h3><p className="text-secondary small mb-0">Review recorded staff actions by task and date. Administrator access only.</p></div></div>
    <Alert message={error}/>
    {!options && <button className="btn btn-outline-secondary mb-3" onClick={()=>setOptionsAttempt(value=>value+1)}>Reload staff and task filters</button>}
    <form onSubmit={event=>{event.preventDefault();if(!invalid && options)void run();}}>
      <fieldset disabled={busy || !options}>
        <div className="row g-3">
          <div className="col-md-6 col-xl-4"><label className="form-label" htmlFor="activity-staff">Staff member</label><select id="activity-staff" className="form-select" value={filters.userId} onChange={event=>set('userId',event.target.value)}><option value="">All staff</option>{options?.staff.map(person=><option key={person.id} value={person.id}>{person.fullName} — {person.role.toLowerCase()}{!person.active?' (inactive)':''}</option>)}</select></div>
          <div className="col-md-6 col-xl-4"><label className="form-label" htmlFor="activity-task">Task</label><select id="activity-task" className="form-select" value={filters.action} onChange={event=>set('action',event.target.value)}><option value="">All tasks</option>{options?.actions.map(action=><option key={action.value} value={action.value}>{action.label}</option>)}</select></div>
          <div className="col-md-6 col-xl-4"><label className="form-label" htmlFor="activity-module">Module / record type</label><select id="activity-module" className="form-select" value={filters.entityType} onChange={event=>set('entityType',event.target.value)}><option value="">All modules</option>{options?.modules.map(module=><option key={module.value} value={module.value}>{module.label}</option>)}</select></div>
          <div className="col-md-4"><label className="form-label" htmlFor="activity-from">Activity from date</label><input id="activity-from" className="form-control" type="date" required max={filters.to || undefined} value={filters.from} onChange={event=>set('from',event.target.value)}/></div>
          <div className="col-md-4"><label className="form-label" htmlFor="activity-to">Activity to date</label><input id="activity-to" className="form-control" type="date" required min={filters.from || undefined} value={filters.to} onChange={event=>set('to',event.target.value)}/></div>
          <div className="col-md-4"><label className="form-label" htmlFor="activity-outcome">Outcome</label><select id="activity-outcome" className="form-select" value={filters.outcome} onChange={event=>set('outcome',event.target.value)}><option value="">Successful and failed</option><option value="SUCCESS">Successful only</option><option value="FAILED">Failed only</option></select></div>
        </div>
        <p className="small text-secondary mt-2">Both dates are included, using Sri Lanka time. Maximum 366 days per report.</p>
        <div className="d-flex flex-wrap gap-2 mb-3"><button className="btn btn-primary" disabled={invalid}>{busy?'Working…':'Generate staff report'}</button><button type="button" className="btn btn-outline-primary" disabled={!report || changed || invalid} onClick={download}>Export all matching activity (CSV)</button></div>
      </fieldset>
    </form>
    {invalid && <p role="alert" className="text-danger">Choose a valid date range of no more than 366 days.</p>}
    {changed && <p role="status" className="text-warning">Filters changed. Generate the report again to apply them; the results below still use the previous filters.</p>}
    <p className="small text-secondary">Based on retained audit records for current staff accounts, including inactive staff and records in audit trash. Permanently deleted or unlogged activity cannot be reconstructed. Names and roles are current; action counts are not unique completed tasks or a performance score. Exports include every matching row and are regenerated at download time.</p>
    {report && applied && <div aria-busy={busy}>
      <h4 className="h6">{options?.staff.find(person=>String(person.id)===applied.userId)?.fullName || 'All staff'} · {applied.from} to {applied.to}</h4>
      <p className="small">Task: {options?.actions.find(action=>action.value===applied.action)?.label || 'All tasks'} · Module: {options?.modules.find(module=>module.value===applied.entityType)?.label || 'All modules'} · Outcome: {applied.outcome || 'All'}<br/>Generated {localTime(report.meta.generatedAt)} (Sri Lanka)</p>
      <div className="d-flex flex-wrap gap-4 mb-3"><span><strong>{report.meta.total}</strong> recorded actions</span><span className="text-success"><strong>{report.meta.successful}</strong> successful</span><span className="text-danger"><strong>{report.meta.failed}</strong> failed</span></div>
      {report.meta.total===0 ? <p role="status">No recorded activity matches these filters.</p> : <>
        <details className="mb-3" open><summary>Task summary — all matching activity</summary><div className="table-responsive" style={{maxHeight:300}}><table className="table table-sm"><thead><tr><th>Task</th><th>Successful</th><th>Failed</th><th>Total</th></tr></thead><tbody>{report.tasks.map(task=><tr key={task.action}><td>{task.task}</td><td>{task.successful}</td><td>{task.failed}</td><td>{task.total}</td></tr>)}</tbody></table></div></details>
        <div className="table-responsive"><table className="table"><caption>Staff activity details — Sri Lanka time</caption><thead><tr><th>Date & time</th><th>Staff member</th><th>Task</th><th>Related record</th><th>Outcome</th></tr></thead><tbody>{report.data.map(row=><tr key={row.id}><td>{localTime(row.time)}<small className="d-block text-secondary">Activity #{row.id}</small></td><td>{row.staff}<small className="d-block text-secondary">{row.role.toLowerCase()}</small></td><td>{row.task}{row.archived && <small className="d-block text-secondary">In audit trash</small>}</td><td>{row.reference || row.record || '—'}{row.reference && <small className="d-block">{row.record}</small>}</td><td className={row.result==='SUCCESS'?'text-success':'text-danger'}>{row.result==='SUCCESS'?'Successful':'Failed'}</td></tr>)}</tbody></table></div>
        <div className="d-flex flex-wrap align-items-center gap-3"><button className="btn btn-outline-secondary" disabled={busy || changed || report.meta.page<=1} onClick={()=>run(report.meta.page-1)}>Previous activity page</button><span>Page {report.meta.page} of {report.meta.pages} · {report.meta.total} actions</span><button className="btn btn-outline-secondary" disabled={busy || changed || report.meta.page>=report.meta.pages} onClick={()=>run(report.meta.page+1)}>Next activity page</button></div>
      </>}
    </div>}
  </section>;
}
