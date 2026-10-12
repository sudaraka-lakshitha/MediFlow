import { Modal } from './Modal';

export function ConfirmModal({ title, message, confirmLabel='Delete', danger=true, onConfirm, onClose, busy=false }:{ title:string; message:string; confirmLabel?:string; danger?:boolean; onConfirm():void; onClose():void; busy?:boolean }) {
  return <Modal title={title} onClose={onClose} size="sm"><p className="text-secondary">{message}</p>{danger&&<div className="alert alert-warning py-2 small"><i className="bi bi-exclamation-triangle me-2"/>Referenced pharmacy history is protected from deletion.</div>}<div className="modal-actions"><button type="button" className="btn btn-light" onClick={onClose}>Cancel</button><button type="button" className={`btn ${danger?'btn-danger':'btn-primary'}`} onClick={onConfirm} disabled={busy}>{busy?'Working…':confirmLabel}</button></div></Modal>;
}
