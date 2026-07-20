import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api, errorMessage } from '../api/client';
import { useAuth } from '../auth/useAuth';
import { ActionsDropdown } from '../components/ActionsDropdown';
import { ConfirmModal } from '../components/ConfirmModal';
import { Modal, ModalActions } from '../components/Modal';
import { SearchableSelect } from '../components/SearchableSelect';
import { PredictiveSearchInput } from '../components/PredictiveSearchInput';
import { Alert, Empty, Loading, Status } from '../components/Ui';
import { parseCsv } from '../utils/csv';

type Category = { id: number; name: string; description?: string; active: boolean };
type Supplier = { id: number; name: string; contactPerson?: string; phone?: string; email?: string; address?: string; active: boolean };
type Manufacturer = { id: number; name: string; country?: string; website?: string; phone?: string; email?: string; active: boolean };
type Product = { id: number; sku: string; productType: 'MEDICINE' | 'NON_MEDICINAL'; genericName: string; brandName?: string; activeIngredient?: string; strength: string; dosageForm: string; unit: string; variantGroup?: string; barcode?: string; manufacturerId?: number; manufacturer?: Manufacturer; manufacturerName?: string; storageInstructions?: string; sellingPrice: string; reorderLevel: number; prescriptionRequired: boolean; active: boolean; categoryId: number; category: Category; rxNormCui?: string; pubchemCid?: number; smiles?: string; batches: { quantityAvailable: number }[] };
type Tab = 'products' | 'categories' | 'suppliers' | 'manufacturers';

const productEmpty = { sku: '', productType: 'MEDICINE', genericName: '', brandName: '', activeIngredient: '', strength: '', dosageForm: 'Tablet', unit: 'tablet', manufacturerId: 0, storageInstructions: 'Store below 25°C in a dry place.', sellingPrice: 0, reorderLevel: 10, prescriptionRequired: true, categoryId: 0 };
const categoryEmpty = { name: '', description: '' };
const supplierEmpty = { name: '', contactPerson: '', phone: '', email: '', address: '' };
const manufacturerEmpty = { name: '', country: '', website: '', phone: '', email: '' };
const dosageForms = ['Retail item', 'Tablet', 'Capsule', 'Oral suspension', 'Syrup', 'Solution', 'Drops', 'Cream', 'Ointment', 'Gel', 'Inhaler', 'Injection', 'Suppository', 'Powder', 'Patch'];
const units = ['piece', 'pack', 'bottle', 'can', 'pair', 'box', 'tablet', 'capsule', 'ml', 'drop', 'dose', 'puff', 'gram', 'sachet', 'vial', 'ampoule', 'suppository', 'patch'];
const bulkColumns = ['sku', 'productType', 'genericName', 'brandName', 'activeIngredient', 'strength', 'dosageForm', 'unit', 'variantGroup', 'barcode', 'manufacturerName', 'categoryName', 'sellingPrice', 'reorderLevel', 'prescriptionRequired', 'storageInstructions', 'rxNormCui', 'pubchemCid', 'smiles', 'active'];

export function CatalogPage() {
  const { user } = useAuth(); const admin = user!.role === 'ADMIN';
  const [tab, setTab] = useState<Tab>('products'); const [products, setProducts] = useState<Product[]>([]); const [categories, setCategories] = useState<Category[]>([]); const [suppliers, setSuppliers] = useState<Supplier[]>([]); const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [error, setError] = useState(''); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false); const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ kind: 'product' | 'category' | 'supplier' | 'manufacturer'; mode: 'create' | 'edit'; record?: any } | null>(null);
  const [confirm, setConfirm] = useState<{ kind: Tab; id: number; name: string } | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false); const [bulkRows, setBulkRows] = useState<Record<string, string>[]>([]); const [bulkFile, setBulkFile] = useState(''); const [bulkResult, setBulkResult] = useState<any>(null);
  const [productForm, setProductForm] = useState<any>({ ...productEmpty }); const [categoryForm, setCategoryForm] = useState({ ...categoryEmpty }); const [supplierForm, setSupplierForm] = useState({ ...supplierEmpty }); const [manufacturerForm, setManufacturerForm] = useState({ ...manufacturerEmpty });
  const [skuModified, setSkuModified] = useState(false);

  const generateSku = (productType: string, genericName: string, strength: string) => {
    const typePart = productType === 'MEDICINE' ? 'MED' : 'RET';
    const namePart = (genericName || '')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6);
    const strengthPart = productType === 'MEDICINE' && strength && strength.toUpperCase() !== 'N/A'
      ? (strength || '')
          .trim()
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '')
          .slice(0, 8)
      : '';
    return [typePart, namePart, strengthPart].filter(Boolean).join('-');
  };

  useEffect(() => {
    if (modal?.kind === 'product' && modal.mode === 'create' && !skuModified) {
      const auto = generateSku(productForm.productType, productForm.genericName, productForm.strength);
      setProductForm((prev: any) => ({ ...prev, sku: auto }));
    }
  }, [productForm.productType, productForm.genericName, productForm.strength, modal, skuModified]);

  const load = useCallback(async () => { try { const [p, c, s, m] = await Promise.all([api.get('/catalog/products', { params: { search } }), api.get('/catalog/categories'), api.get('/catalog/suppliers'), api.get('/catalog/manufacturers')]); setProducts(p.data.data); setCategories(c.data.data); setSuppliers(s.data.data); setManufacturers(m.data.data); } catch (caught) { setError(errorMessage(caught)); } finally { setLoading(false); } }, [search]);
  useEffect(() => { const timer = setTimeout(load, 180); return () => clearTimeout(timer); }, [load]);

  const open = (kind: 'product' | 'category' | 'supplier' | 'manufacturer', record?: any) => {
    if (kind === 'product') {
      setSkuModified(record ? true : false);
      setProductForm(record ? { sku: record.sku, productType: record.productType || 'MEDICINE', genericName: record.genericName, brandName: record.brandName || '', activeIngredient: record.activeIngredient || record.genericName, strength: record.strength, dosageForm: record.dosageForm, unit: record.unit, manufacturerId: record.manufacturerId || 0, storageInstructions: record.storageInstructions || '', sellingPrice: Number(record.sellingPrice), reorderLevel: record.reorderLevel, prescriptionRequired: record.prescriptionRequired, categoryId: record.categoryId } : { ...productEmpty });
    }
    if (kind === 'category') setCategoryForm(record ? { name: record.name, description: record.description || '' } : { ...categoryEmpty });
    if (kind === 'supplier') setSupplierForm(record ? { name: record.name, contactPerson: record.contactPerson || '', phone: record.phone || '', email: record.email || '', address: record.address || '' } : { ...supplierEmpty });
    if (kind === 'manufacturer') setManufacturerForm(record ? { name: record.name, country: record.country || '', website: record.website || '', phone: record.phone || '', email: record.email || '' } : { ...manufacturerEmpty });
    setModal({ kind, mode: record ? 'edit' : 'create', record });
  };
  const save = async (event: FormEvent) => { event.preventDefault(); if (!modal) return; setBusy(true); setError(''); try { const plural = `${modal.kind}s`; const body = modal.kind === 'product' ? { ...productForm, categoryId: Number(productForm.categoryId), manufacturerId: Number(productForm.manufacturerId) || null, sellingPrice: Number(productForm.sellingPrice), reorderLevel: Number(productForm.reorderLevel) } : modal.kind === 'category' ? categoryForm : modal.kind === 'supplier' ? supplierForm : manufacturerForm; if (modal.mode === 'create') await api.post(`/catalog/${plural}`, body); else await api.put(`/catalog/${plural}/${modal.record.id}`, body); setModal(null); await load(); } catch (caught) { setError(errorMessage(caught)); } finally { setBusy(false); } };
  const toggleProduct = async (product: Product) => { try { await api.patch(`/catalog/products/${product.id}/active`, { active: !product.active }); load(); } catch (caught) { setError(errorMessage(caught)); } };
  const toggleCsm = async (kind: 'categories' | 'suppliers' | 'manufacturers', id: number, active: boolean) => { try { await api.patch(`/catalog/${kind}/${id}/active`, { active }); load(); } catch (caught) { setError(errorMessage(caught)); } };
  const remove = async () => { if (!confirm) return; setBusy(true); try { await api.delete(`/catalog/${confirm.kind}/${confirm.id}`); setConfirm(null); load(); } catch (caught) { setError(errorMessage(caught)); setConfirm(null); } finally { setBusy(false); } };

  const readBulk = async (file?: File) => { if (!file) return; setBulkFile(file.name); setBulkResult(null); try { const rows = parseCsv(await file.text()); setBulkRows(rows); if (!rows.length) setError('The selected CSV contains no product rows.'); } catch (caught) { setError(errorMessage(caught)); } };
  const runBulk = async (dryRun: boolean) => { setBusy(true); setError(''); try { const response = await api.post('/catalog/products/bulk', { rows: bulkRows, dryRun }); setBulkResult(response.data.data); if (!dryRun) { await load(); setTimeout(() => { setBulkOpen(false); setBulkRows([]); setBulkResult(null); }, 900); } } catch (caught: any) { setError(errorMessage(caught)); setBulkResult(caught?.response?.data?.details || null); } finally { setBusy(false); } };
  const downloadTemplate = async () => { try { const response = await api.get('/catalog/products/bulk-template.csv', { responseType: 'blob' }); const url = URL.createObjectURL(response.data); const link = document.createElement('a'); link.href = url; link.download = 'mediflow-product-bulk-template.csv'; link.click(); URL.revokeObjectURL(url); } catch (caught) { setError(errorMessage(caught)); } };
  if (loading) return <Loading />;

  const addKind = tab === 'products' ? 'product' : tab === 'categories' ? 'category' : tab === 'suppliers' ? 'supplier' : 'manufacturer';
  return <>
    <div className="page-intro"><div><h2>Product catalogue</h2><p>Medicines, healthcare supplies, general retail items, categories, suppliers, manufacturers, and bulk updates.</p></div>{admin && <div className="d-flex gap-2">{tab === 'products' && <button className="btn btn-outline-primary" onClick={() => { setBulkOpen(true); setBulkResult(null); }}><i className="bi bi-file-earmark-arrow-up me-2" />Bulk upload</button>}<button className="btn btn-primary" onClick={() => open(addKind)}><i className="bi bi-plus-lg me-2" />Add {addKind}</button></div>}</div>
    <Alert message={error} />
    <div className="panel"><div className="panel-header"><div className="toolbar">{(['products', 'categories', 'suppliers', 'manufacturers'] as Tab[]).map((value) => <button key={value} className={`btn ${tab === value ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setTab(value)}>{value[0].toUpperCase() + value.slice(1)}</button>)}{tab === 'products' && <PredictiveSearchInput placeholder="Search product, brand or SKU" value={search} onChange={setSearch} suggestions={products.flatMap((product) => [product.genericName, product.brandName || '', product.sku, product.barcode || ''])} />}</div></div>
      {tab === 'products' && <div className="table-responsive"><table className="table"><thead><tr><th>Product / variation</th><th>Type</th><th>SKU</th><th>Manufacturer</th><th>Category</th><th>Form / unit</th><th>Stock</th><th>Price</th><th>Status</th>{admin && <th />}</tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><strong>{product.genericName}</strong><br /><small>{product.brandName || (product.productType === 'MEDICINE' ? 'Generic' : 'Unbranded')}{product.productType === 'MEDICINE' ? ` · ${product.strength}` : ''}{product.variantGroup ? ` · ${product.variantGroup}` : ''}</small></td><td><Status value={product.productType === 'MEDICINE' ? 'MEDICINE' : 'RETAIL'} /></td><td>{product.sku}</td><td>{product.manufacturer?.name || product.manufacturerName || '—'}</td><td>{product.category.name}</td><td>{product.dosageForm} / {product.unit}</td><td>{product.batches.reduce((sum, batch) => sum + Number(batch.quantityAvailable), 0)}</td><td>Rs. {Number(product.sellingPrice).toFixed(2)}</td><td><Status value={product.active ? 'ACTIVE' : 'INACTIVE'} /></td>{admin && <td><ActionsDropdown actions={[{ label: 'Edit product', icon: 'pencil', onClick: () => open('product', product) }, { label: product.active ? 'Deactivate' : 'Activate', icon: product.active ? 'archive' : 'check-circle', onClick: () => toggleProduct(product) }, { label: 'Delete product', icon: 'trash', danger: true, onClick: () => setConfirm({ kind: 'products', id: product.id, name: product.genericName }) }]} /></td>}</tr>)}</tbody></table>{!products.length && <Empty />}</div>}
      {tab === 'categories' && <SimpleTable headers={['Category', 'Description', 'Status']} rows={categories} admin={admin} cells={(category) => [<strong key="name">{category.name}</strong>, category.description || '—', <Status key="status" value={category.active ? 'ACTIVE' : 'INACTIVE'} />]} actions={(category) => [{ label: 'Edit category', icon: 'pencil', onClick: () => open('category', category) }, { label: category.active ? 'Deactivate' : 'Activate', icon: category.active ? 'archive' : 'check-circle', onClick: () => toggleCsm('categories', category.id, !category.active) }, { label: 'Delete category', icon: 'trash', danger: true, onClick: () => setConfirm({ kind: 'categories', id: category.id, name: category.name }) }]} />}
      {tab === 'suppliers' && <SimpleTable headers={['Supplier', 'Contact', 'Email', 'Phone', 'Status']} rows={suppliers} admin={admin} cells={(supplier) => [<strong key="name">{supplier.name}</strong>, supplier.contactPerson || '—', supplier.email || '—', supplier.phone || '—', <Status key="status" value={supplier.active ? 'ACTIVE' : 'INACTIVE'} />]} actions={(supplier) => [{ label: 'Edit supplier', icon: 'pencil', onClick: () => open('supplier', supplier) }, { label: supplier.active ? 'Deactivate' : 'Activate', icon: supplier.active ? 'archive' : 'check-circle', onClick: () => toggleCsm('suppliers', supplier.id, !supplier.active) }, { label: 'Delete supplier', icon: 'trash', danger: true, onClick: () => setConfirm({ kind: 'suppliers', id: supplier.id, name: supplier.name }) }]} />}
      {tab === 'manufacturers' && <SimpleTable headers={['Manufacturer', 'Country', 'Website', 'Contact', 'Status']} rows={manufacturers} admin={admin} cells={(manufacturer) => [<strong key="name">{manufacturer.name}</strong>, manufacturer.country || '—', manufacturer.website ? <a key="website" href={manufacturer.website} target="_blank" rel="noreferrer">Website</a> : '—', manufacturer.email || manufacturer.phone || '—', <Status key="status" value={manufacturer.active ? 'ACTIVE' : 'INACTIVE'} />]} actions={(manufacturer) => [{ label: 'Edit manufacturer', icon: 'pencil', onClick: () => open('manufacturer', manufacturer) }, { label: manufacturer.active ? 'Deactivate' : 'Activate', icon: manufacturer.active ? 'archive' : 'check-circle', onClick: () => toggleCsm('manufacturers', manufacturer.id, !manufacturer.active) }, { label: 'Delete manufacturer', icon: 'trash', danger: true, onClick: () => setConfirm({ kind: 'manufacturers', id: manufacturer.id, name: manufacturer.name }) }]} />}
    </div>

    {modal && <Modal title={`${modal.mode === 'create' ? 'Add' : 'Edit'} ${modal.kind}`} onClose={() => setModal(null)} size={modal.kind === 'product' ? 'lg' : 'md'}><form onSubmit={save}>
      {modal.kind === 'product' && <><div className="form-grid">
        <div>
          <TextField label="SKU" tooltip="Unique stock-keeping unit code for this product (e.g. MED-PARA-500MG). Must be unique across all products." value={productForm.sku} onChange={(sku) => { setSkuModified(true); setProductForm({ ...productForm, sku: sku.toUpperCase() }); }} required />
          {skuModified && modal?.mode === 'create' && (
            <button type="button" className="btn btn-link btn-sm p-0 mt-1" onClick={() => { setSkuModified(false); const auto = generateSku(productForm.productType, productForm.genericName, productForm.strength); setProductForm((prev: any) => ({ ...prev, sku: auto })); }}>
              Reset to auto-generated SKU
            </button>
          )}
          {productForm.sku && products.some(p => p.sku.toUpperCase() === productForm.sku.trim().toUpperCase() && p.id !== modal?.record?.id) && (
            <div className="text-danger small mt-1">⚠️ Warning: SKU is already in use by another product.</div>
          )}
        </div>
        <div>
          <label className="form-label">Product type <FieldTip text="Choose 'Medicine' for prescription or OTC drugs. Choose 'Non-medicinal' for retail items like syringes, gloves, or beverages." /></label>
          <select className="form-select" value={productForm.productType} onChange={(event) => { const productType = event.target.value; setProductForm({ ...productForm, productType, prescriptionRequired: productType === 'MEDICINE' ? productForm.prescriptionRequired : false, strength: productType === 'MEDICINE' ? productForm.strength : 'N/A', dosageForm: productType === 'MEDICINE' ? productForm.dosageForm : 'Retail item', unit: productType === 'MEDICINE' ? productForm.unit : 'piece', activeIngredient: productType === 'MEDICINE' ? productForm.activeIngredient : '' }); }}>
            <option value="MEDICINE">Medicine</option>
            <option value="NON_MEDICINAL">Non-medicinal / retail item</option>
          </select>
        </div>
        <TextField label="Generic / product name" tooltip="The international non-proprietary name (INN) of the active drug or the product name for retail items (e.g. Paracetamol, Sterile Syringe 5 mL)." value={productForm.genericName} onChange={(genericName) => setProductForm({ ...productForm, genericName, activeIngredient: productForm.activeIngredient || genericName })} list="generic-options" required />
        <TextField label="Brand name" tooltip="Optional trade or brand name as printed on the packaging (e.g. Panadol, Calpol). Leave blank for generics." value={productForm.brandName} onChange={(brandName) => setProductForm({ ...productForm, brandName })} list="brand-options" />
        <TextField label="Active ingredient" tooltip="The active pharmaceutical ingredient (API) used to identify and research the medicine. Usually the same as the generic name (e.g. Paracetamol, Ibuprofen)." value={productForm.activeIngredient} onChange={(activeIngredient) => setProductForm({ ...productForm, activeIngredient })} list="ingredient-options" required={productForm.productType === 'MEDICINE'} />
        <TextField label="Strength" tooltip="Concentration or dose per unit (e.g. 500 mg, 120 mg/5 mL, 100 mcg). Enter 'N/A' for retail items." value={productForm.strength} onChange={(strength) => setProductForm({ ...productForm, strength })} list="strength-options" required={productForm.productType === 'MEDICINE'} />
        <div>
          <label className="form-label">Dosage form <FieldTip text="The physical form of the medicine (e.g. Tablet, Capsule, Oral suspension, Inhaler). Select 'Retail item' for non-medicinal products." /></label>
          <select className="form-select" value={productForm.dosageForm} onChange={(event) => setProductForm({ ...productForm, dosageForm: event.target.value })}>
            {dosageForms.map((form) => <option key={form}>{form}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Stock unit <FieldTip text="The unit used to count and dispense this product (e.g. tablet, capsule, ml, piece). Liquid medicines should use 'ml'." /></label>
          <select className="form-select" value={productForm.unit} onChange={(event) => setProductForm({ ...productForm, unit: event.target.value })}>
            {units.map((unit) => <option key={unit}>{unit}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Manufacturer <FieldTip text="The company that manufactures this product. Add manufacturers from the Manufacturers tab first." /></label>
          <SearchableSelect options={manufacturers.filter((item) => item.active).map((item) => ({ value: item.id, label: item.name, description: item.country }))} value={productForm.manufacturerId} onChange={(manufacturerId) => setProductForm({ ...productForm, manufacturerId })} placeholder="Search manufacturer" />
        </div>
        <div>
          <label className="form-label">Category <FieldTip text="Product category for grouping and filtering (e.g. Antibiotics, Cardiovascular, Medical supplies). Add categories from the Categories tab." /></label>
          <SearchableSelect options={categories.filter((item) => item.active).map((item) => ({ value: item.id, label: item.name }))} value={productForm.categoryId} onChange={(categoryId) => setProductForm({ ...productForm, categoryId })} placeholder="Search category" required />
        </div>
        <TextField label="Storage instructions" tooltip="How to store this product (e.g. Store below 25°C in a dry place, Store refrigerated at 2–8°C). Printed on dispensing labels." value={productForm.storageInstructions} onChange={(storageInstructions) => setProductForm({ ...productForm, storageInstructions })} list="storage-options" />
        <NumberField label="Selling price (Rs.)" tooltip="Retail selling price per stock unit in Sri Lankan Rupees. Used for invoice generation and sales reports." value={productForm.sellingPrice} onChange={(sellingPrice) => setProductForm({ ...productForm, sellingPrice })} step="0.01" />
        <NumberField label="Reorder level" tooltip="Minimum stock quantity that triggers a low-stock alert on the dashboard. Set based on typical weekly dispensing volume." value={productForm.reorderLevel} onChange={(reorderLevel) => setProductForm({ ...productForm, reorderLevel })} />
      </div>
      <div className="form-check mt-3">
        <input className="form-check-input" type="checkbox" checked={productForm.prescriptionRequired} disabled={productForm.productType === 'NON_MEDICINAL'} onChange={(event) => setProductForm({ ...productForm, prescriptionRequired: event.target.checked })} />
        <label className="form-check-label">Prescription required <FieldTip text="When checked, this medicine can only be dispensed with a verified prescription. Not applicable to non-medicinal retail items." /></label>
      </div>
      <datalist id="generic-options">{[...new Set(products.map((item) => item.genericName))].map((value) => <option key={value} value={value} />)}</datalist>
      <datalist id="brand-options">{[...new Set(products.map((item) => item.brandName).filter(Boolean))].map((value) => <option key={value} value={value} />)}</datalist>
      <datalist id="ingredient-options">{[...new Set(products.map((item) => item.activeIngredient || item.genericName))].map((value) => <option key={value} value={value} />)}</datalist>
      <datalist id="storage-options"><option value="Store below 25°C in a dry place." /><option value="Store refrigerated at 2–8°C. Do not freeze." /><option value="Protect from light and moisture." /><option value="Store below 30°C. Keep container tightly closed." /><option value="After opening, refrigerate and use within the labelled period." /></datalist>
      <datalist id="strength-options">{['5 mg', '10 mg', '20 mg', '50 mg', '100 mg', '120 mg/5 ml', '250 mg', '250 mg/5 ml', '500 mg', '1 g'].map((value) => <option key={value} value={value} />)}</datalist>
      </>}
      {modal.kind === 'category' && <div className="form-grid"><TextField label="Name" value={categoryForm.name} onChange={(name) => setCategoryForm({ ...categoryForm, name })} required /><div className="full"><label className="form-label">Description</label><textarea className="form-control" value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} /></div></div>}
      {modal.kind === 'supplier' && <div className="form-grid">{(['name', 'contactPerson', 'phone', 'email', 'address'] as const).map((key) => <TextField key={key} label={{ name: 'Supplier name', contactPerson: 'Contact person', phone: 'Phone', email: 'Email', address: 'Address' }[key]} value={supplierForm[key]} onChange={(value) => setSupplierForm({ ...supplierForm, [key]: value })} required={key === 'name'} />)}</div>}
      {modal.kind === 'manufacturer' && <div className="form-grid">{(['name', 'country', 'website', 'phone', 'email'] as const).map((key) => <TextField key={key} label={{ name: 'Manufacturer name', country: 'Country', website: 'Website', phone: 'Phone', email: 'Email' }[key]} value={manufacturerForm[key]} onChange={(value) => setManufacturerForm({ ...manufacturerForm, [key]: value })} required={key === 'name'} />)}</div>}
      <ModalActions onClose={() => setModal(null)} submitLabel={modal.mode === 'create' ? `Add ${modal.kind}` : 'Save changes'} busy={busy} />
    </form></Modal>}

    {bulkOpen && <Modal title="Bulk create or update products" onClose={() => setBulkOpen(false)} size="lg"><p className="text-secondary">Each SKU is an upsert key: a new SKU creates a product; an existing SKU updates that product. Categories and manufacturers are matched by name and created when missing.</p><div className="d-flex flex-wrap gap-2 mb-3"><button className="btn btn-sm btn-outline-primary" onClick={downloadTemplate}><i className="bi bi-filetype-csv me-1" />Download CSV sample</button><a className="btn btn-sm btn-outline-secondary" href="/templates/MediFlow_Product_Bulk_Import_Template.xlsx"><i className="bi bi-file-earmark-excel me-1" />Download Excel sample</a></div><div className="table-responsive mb-3"><table className="table table-sm bulk-sample"><thead><tr>{bulkColumns.slice(0, 10).map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody><tr><td>RET-SYR-5ML</td><td>NON_MEDICINAL</td><td>Sterile syringe 5 mL</td><td>Example Brand</td><td>Paracetamol</td><td>500 mg</td><td>Tablet</td><td>tablet</td><td>Paracetamol oral</td><td>479000000001</td><td>Example Pharma</td></tr></tbody></table></div><label className="bulk-drop d-block"><i className="bi bi-cloud-arrow-up fs-2 d-block text-primary" /><strong>{bulkFile || 'Choose a CSV file'}</strong><small className="d-block text-secondary">Maximum 2,000 rows. Save the Excel template as CSV before upload.</small><input className="d-none" type="file" accept=".csv,text/csv" onChange={(event) => readBulk(event.target.files?.[0])} /></label>{bulkRows.length > 0 && <div className="mt-3"><div className="alert alert-info py-2">Loaded {bulkRows.length} rows. Validate before applying changes.</div><div className="d-flex gap-2"><button className="btn btn-outline-primary" disabled={busy} onClick={() => runBulk(true)}>Validate rows</button><button className="btn btn-primary" disabled={busy || !bulkResult || bulkResult.errors?.length} onClick={() => runBulk(false)}>Apply bulk changes</button></div></div>}{bulkResult && <div className={`alert mt-3 ${bulkResult.errors?.length ? 'alert-danger' : bulkResult.applied ? 'alert-success' : 'alert-success'}`}><strong>{bulkResult.applied ? 'Bulk update completed.' : 'Validation completed.'}</strong><div>{bulkResult.creates} creates · {bulkResult.updates} updates · {bulkResult.errors?.length || 0} invalid rows</div>{bulkResult.errors?.slice(0, 12).map((row: any) => <div className="small mt-1" key={row.row}>Row {row.row} ({row.sku || 'no SKU'}): {row.errors.join('; ')}</div>)}</div>}</Modal>}
    {confirm && <ConfirmModal title={`Delete ${confirm.name}?`} message="This record will be permanently removed only when it has no related pharmacy history. Referenced records must remain for auditability." onConfirm={remove} onClose={() => setConfirm(null)} busy={busy} />}
  </>;
}

function FieldTip({ text }: { text: string }) {
  return (
    <i
      className="bi bi-info-circle text-secondary ms-1"
      style={{ cursor: 'help', fontSize: '0.8rem' }}
      title={text}
      aria-label={text}
    />
  );
}
function TextField({ label, tooltip, value, onChange, required = false, list }: { label: string; tooltip?: string; value: string; onChange(value: string): void; required?: boolean; list?: string }) {
  return (
    <div>
      <label className="form-label">
        {label}
        {tooltip && <FieldTip text={tooltip} />}
      </label>
      <input className="form-control" value={value} onChange={(event) => onChange(event.target.value)} required={required} list={list} />
    </div>
  );
}
function NumberField({ label, tooltip, value, onChange, step = '1' }: { label: string; tooltip?: string; value: string | number; onChange(value: string): void; step?: string }) {
  return (
    <div>
      <label className="form-label">
        {label}
        {tooltip && <FieldTip text={tooltip} />}
      </label>
      <input className="form-control" type="number" min="0" step={step} value={value} onChange={(event) => onChange(event.target.value)} required />
    </div>
  );
}
function SimpleTable({ headers, rows, cells, actions, admin }: { headers: string[]; rows: any[]; cells(row: any): any[]; actions(row: any): any[]; admin: boolean }) { return <div className="table-responsive"><table className="table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}{admin && <th />}</tr></thead><tbody>{rows.map((row) => <tr key={row.id}>{cells(row).map((cell, index) => <td key={index}>{cell}</td>)}{admin && <td><ActionsDropdown actions={actions(row)} /></td>}</tr>)}</tbody></table>{!rows.length && <Empty />}</div>; }
