// A password box with a show/hide button.

import { useId, useState } from 'react';

export function PasswordField({ value, onChange, label='Password', required=true, autoComplete='new-password' }:{ value:string; onChange(value:string):void; label?:string; required?:boolean; autoComplete?:string }) {
  const [visible,setVisible]=useState(false);
  const id=useId();
  const requirementsId=`${id}-requirements`;
  const showRequirements=autoComplete==='new-password'&&!label.toLowerCase().includes('confirm');
  const checks=[['At least 8 characters',value.length>=8],['One uppercase letter',/[A-Z]/.test(value)],['One lowercase letter',/[a-z]/.test(value)],['One number',/\d/.test(value)],['One symbol',/[^A-Za-z0-9]/.test(value)]] as const;
  return <div><label className="form-label" htmlFor={id}>{label}</label><div className="input-group"><input id={id} className="form-control" type={visible?'text':'password'} value={value} onChange={(e)=>onChange(e.target.value)} required={required} autoComplete={autoComplete} aria-describedby={showRequirements?requirementsId:undefined} minLength={showRequirements?8:undefined} maxLength={showRequirements?72:undefined} pattern={showRequirements?'(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,72}':undefined}/><button className="btn btn-outline-secondary password-toggle" type="button" title={visible?'Hide password':'Show password'} aria-label={visible?'Hide password':'Show password'} aria-pressed={visible} onClick={()=>setVisible(!visible)}><i className={`bi bi-eye${visible?'-slash':''}`}/></button></div>{showRequirements&&<div id={requirementsId} className="password-requirements mt-2" aria-live="polite"><small className="text-secondary d-block mb-1">Password must include:</small><div className="row g-1">{checks.map(([text,valid])=><small key={text} className={`col-6 ${valid?'text-success':'text-danger'}`}><i className={`bi bi-${valid?'check-circle-fill':'x-circle'} me-1`}/>{text}</small>)}</div></div>}</div>;
}
