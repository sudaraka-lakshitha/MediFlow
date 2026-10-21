import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/styles.css';
import { WorkflowGuard } from '../src/components/WorkflowGuard';
import { api } from '../src/api/client';
export function Fixture() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [saved, setSaved] = useState(false);
  const kind = new URLSearchParams(location.search).get('kind') || 'upload';
  return <WorkflowGuard resource={open ? `${kind}/1` : null} onCancel={() => setOpen(false)}>
    <button onClick={() => setOpen(true)}>Edit request</button>
    {open && <div><label>Draft<input value={draft} onChange={event => setDraft(event.target.value)} /></label>
      <button onClick={async () => { await api.put('/prescription-uploads/1/review', { note: draft }); setSaved(true); }}>Save draft</button>
      <button onClick={() => setOpen(false)}>Cancel editing</button></div>}
    {saved && <p>Saved once</p>}
  </WorkflowGuard>;
}
createRoot(document.getElementById('root')!).render(<Fixture />);
