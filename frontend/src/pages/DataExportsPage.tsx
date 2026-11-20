import { useState } from 'react';
import { api, errorMessage } from '../api/client';
import { Alert } from '../components/Ui';
import { BulkMasterDataModal } from '../components/BulkMasterDataModal';
import { BulkProductModal } from '../components/BulkProductModal';
import { BulkStockModal } from '../components/BulkStockModal';

const datasets = [
  { key: 'products', title: 'Products', description: 'Product reporting extract. Includes physical, reserved, expired, restricted and usable stock. Expired/restricted totals may overlap.', icon: 'box-seam' },
  { key: 'categories', title: 'Categories', description: 'Product categories and their current status.', icon: 'tags' },
  { key: 'manufacturers', title: 'Manufacturers', description: 'Manufacturer identity and contact information.', icon: 'building' },
  { key: 'suppliers', title: 'Suppliers', description: 'Supplier contacts, addresses and status.', icon: 'truck' },
  { key: 'inventory', title: 'Inventory batches', description: 'Batch quantities, purchasing cost, expiry dates and suppliers.', icon: 'boxes' },
  { key: 'stockMovements', title: 'Stock movements', description: 'Complete receipt, sale, dispensing and adjustment movement history.', icon: 'arrow-left-right' },
  { key: 'patients', title: 'Patient information', description: 'Patient identity, contacts, allergies and registration source. Handle confidentially.', icon: 'person-vcard' },
];

export function DataExportsPage() {
  const [busy, setBusy] = useState(''); const [error, setError] = useState('');
  const [editing, setEditing] = useState('');
  const download = async (dataset: string, format: 'csv' | 'xlsx' | 'pdf') => { setBusy(dataset); setError(''); try { const response = await api.get(`/admin-exports/${dataset}.${format}`, { responseType: 'blob', timeout: 130000 }); const disposition = response.headers['content-disposition'] || ''; const filename = disposition.match(/filename="?([^";]+)"?/)?.[1] || `mediflow-${dataset}.${format}`; const url = URL.createObjectURL(response.data); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); } catch (caught) { setError(errorMessage(caught)); } finally { setBusy(''); } };
  return <><div className="page-intro"><div><h2>Administrative data exports</h2><p>Download formatted Excel or CSV reports. PDF gives a colourful, print-ready snapshot (up to 1,000 rows); use Excel or CSV for the complete data or bulk editing. Historical stock movements are reporting-only. These extracts are not a full database backup.</p></div></div><Alert message={error} /><div className="alert alert-warning"><i className="bi bi-shield-lock me-2" />These exports are restricted to administrators and may contain confidential or commercially sensitive data.</div><div className="row g-3">{datasets.map((dataset) => <div className="col-md-6 col-xl-4" key={dataset.key}><div className="panel h-100 d-flex"><div className="d-flex gap-3 align-items-start flex-grow-1"><i className={`bi bi-${dataset.icon} fs-3 text-primary`} /><div className="d-flex flex-column align-self-stretch flex-grow-1"><h3 className="h5">{dataset.title}</h3><p className="text-secondary small">{dataset.description}</p><div className="export-actions mt-auto"><button className="btn btn-primary" disabled={Boolean(busy)} onClick={() => download(dataset.key, 'xlsx')}>{busy === dataset.key ? 'Preparing…' : 'Export Excel'}</button><button className="btn btn-outline-primary" disabled={Boolean(busy)} onClick={() => download(dataset.key, 'csv')}>{busy === dataset.key ? 'Preparing…' : 'Export CSV'}</button><button className="btn btn-outline-secondary" disabled={Boolean(busy)} onClick={() => download(dataset.key, 'pdf')}>{busy === dataset.key ? 'Preparing…' : 'Export PDF'}</button>{dataset.key !== 'stockMovements' && <button className="btn btn-outline-secondary" disabled={Boolean(busy)} onClick={() => setEditing(dataset.key)}>Bulk update</button>}</div></div></div></div></div>)}</div>{editing === 'products' && <BulkProductModal onClose={() => setEditing('')} onApplied={() => {}}/>}{editing === 'inventory' && <BulkStockModal onClose={() => setEditing('')} onApplied={() => {}}/>}{editing && !['products','inventory'].includes(editing) && <BulkMasterDataModal dataset={editing} title={datasets.find(d => d.key === editing)!.title} onClose={() => setEditing('')}/>}</>;
}
