export type ActionItem={ label:string; icon:string; onClick():void; danger?:boolean; disabled?:boolean };
export function ActionsDropdown({ actions }:{ actions:ActionItem[] }) {
  return <div className="dropdown"><button className="btn btn-sm btn-light border" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Record actions"><i className="bi bi-three-dots-vertical"/></button><ul className="dropdown-menu dropdown-menu-end shadow-sm">{actions.map((action)=><li key={action.label}><button className={`dropdown-item ${action.danger?'text-danger':''}`} disabled={action.disabled} onClick={action.onClick}><i className={`bi bi-${action.icon} me-2`}/>{action.label}</button></li>)}</ul></div>;
}
