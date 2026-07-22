import { catalogService, productTemplateColumns, productTemplateRows } from '../services/catalog.service.js';
import { recordAudit } from '../services/audit.service.js';
import { toCsv } from '../utils/csv.js';

const save = (entityType, action, operation) => async (req, res) => {
  const result = await operation(req);
  await recordAudit({ userId: req.user.id, action, entityType, entityId: result.id, details: req.body, ipAddress: req.ip });
  res.status(req.method === 'POST' ? 201 : 200).json({ data: result });
};

const remove = (entityType, operation) => async (req, res) => {
  const id = Number(req.params.id);
  await operation(id);
  await recordAudit({ userId: req.user.id, action: `${entityType}_DELETED`, entityType, entityId: id, ipAddress: req.ip });
  res.json({ message: `${entityType.toLowerCase()} deleted successfully.` });
};

export const catalogController = {
  categories: async (_req, res) => res.json({ data: await catalogService.listCategories() }),
  createCategory: save('CATEGORY', 'CATEGORY_CREATED', (req) => catalogService.createCategory(req.body)),
  updateCategory: save('CATEGORY', 'CATEGORY_UPDATED', (req) => catalogService.updateCategory(Number(req.params.id), req.body)),
  setCategoryActive: save('CATEGORY', 'CATEGORY_STATUS_CHANGED', (req) => catalogService.setCategoryActive(Number(req.params.id), req.body.active)),
  deleteCategory: remove('CATEGORY', catalogService.deleteCategory),
  products: async (req, res) => { const { rows, total } = await catalogService.listProducts(req.query.search || ''); res.json({ data: rows, total }); },
  createProduct: save('PRODUCT', 'PRODUCT_CREATED', (req) => catalogService.createProduct(req.body)),
  updateProduct: save('PRODUCT', 'PRODUCT_UPDATED', (req) => catalogService.updateProduct(Number(req.params.id), req.body)),
  setProductActive: save('PRODUCT', 'PRODUCT_STATUS_CHANGED', (req) => catalogService.setProductActive(Number(req.params.id), req.body.active)),
  deleteProduct: remove('PRODUCT', catalogService.deleteProduct),
  suppliers: async (_req, res) => res.json({ data: await catalogService.listSuppliers() }),
  createSupplier: save('SUPPLIER', 'SUPPLIER_CREATED', (req) => catalogService.createSupplier(req.body)),
  updateSupplier: save('SUPPLIER', 'SUPPLIER_UPDATED', (req) => catalogService.updateSupplier(Number(req.params.id), req.body)),
  setSupplierActive: save('SUPPLIER', 'SUPPLIER_STATUS_CHANGED', (req) => catalogService.setSupplierActive(Number(req.params.id), req.body.active)),
  deleteSupplier: remove('SUPPLIER', catalogService.deleteSupplier),
  manufacturers: async (_req, res) => res.json({ data: await catalogService.listManufacturers() }),
  createManufacturer: save('MANUFACTURER', 'MANUFACTURER_CREATED', (req) => catalogService.createManufacturer(req.body)),
  updateManufacturer: save('MANUFACTURER', 'MANUFACTURER_UPDATED', (req) => catalogService.updateManufacturer(Number(req.params.id), req.body)),
  setManufacturerActive: save('MANUFACTURER', 'MANUFACTURER_STATUS_CHANGED', (req) => catalogService.setManufacturerActive(Number(req.params.id), req.body.active)),
  deleteManufacturer: remove('MANUFACTURER', catalogService.deleteManufacturer),
  productTemplate: async (_req, res) => {
    const columns = productTemplateColumns.map((key) => ({ key, label: key }));
    res.setHeader('Content-Disposition', 'attachment; filename="mediflow-product-bulk-template.csv"');
    res.type('text/csv').send(toCsv(columns, productTemplateRows));
  },
  bulkProducts: async (req, res) => {
    const result = await catalogService.bulkProducts(req.body.rows, req.body.dryRun);
    await recordAudit({ userId: req.user.id, action: req.body.dryRun ? 'PRODUCT_BULK_VALIDATED' : 'PRODUCT_BULK_APPLIED', entityType: 'PRODUCT', details: { total: result.total, creates: result.creates, updates: result.updates, errorCount: result.errors.length }, ipAddress: req.ip });
    res.json({ data: result });
  },
};
