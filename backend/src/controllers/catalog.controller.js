// Receives the web requests for the product catalogue: products, categories, manufacturers and
// suppliers, calls the matching service, writes the audit log entry and sends the reply.
// The real rules are in services/catalog.service.js. To trace a button: route -> this controller ->
// service.

import { catalogService } from '../services/catalog.service.js';
import { recordAudit } from '../services/audit.service.js';
import { toCsv, streamCsv } from '../utils/csv.js';
import { productBulkFields, productTemplateRows, bulkInstructions, CLEAR_VALUE } from '../utils/productBulkFormat.js';
import { productUpdateExport } from '../services/adminExport.service.js';
import { readProductWorkbook } from '../services/productWorkbook.service.js';
import { createDataWorkbook, XLSX_MIME } from '../services/spreadsheetExport.service.js';

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
    res.setHeader('Content-Disposition', 'attachment; filename="mediflow-product-bulk-template.csv"');
    res.type('text/csv').send(`\uFEFF${toCsv(productBulkFields, productTemplateRows)}`);
  },
  productTemplateExcel: async (_req, res) => {
    const {buffer}=await createDataWorkbook({title:'MediFlow product upload template',sheetName:'Products',columns:productBulkFields,rows:productTemplateRows,notes:bulkInstructions});
    res.attachment('MediFlow_Product_Bulk_Import_Template.xlsx');res.type(XLSX_MIME).send(buffer);
  },
  bulkFormat: (_req, res) => res.json({ data: { fields: productBulkFields, instructions: bulkInstructions, clearValue: CLEAR_VALUE, examples: productTemplateRows } }),
  exportForUpdate: async (req, res) => {
    res.set('Cache-Control','no-store');
    if (req.params.format === 'xlsx') {
      const { buffer, rowCount } = await createDataWorkbook({ title: 'MediFlow products for update', sheetName: 'Products', columns: productBulkFields, pages: productUpdateExport.pages(), notes: ['Upload this workbook in Products > Bulk upload. Validate, review changes, then confirm.', 'Blank cells keep existing values. Use [CLEAR] for optional details. Keep SKU and stock units unchanged.', 'Maximum 2,000 product rows per upload. Split larger exports into smaller files.'] });
      await recordAudit({ userId: req.user.id, action: 'PRODUCTS_EXPORTED_FOR_UPDATE', entityType: 'DATA_EXPORT', details: { rowCount, format: 'xlsx' }, ipAddress: req.ip });
      res.set('Cache-Control','no-store'); res.attachment('mediflow-products-for-update.xlsx'); res.type(XLSX_MIME).send(buffer); return;
    }
    res.setHeader('Content-Disposition', 'attachment; filename="mediflow-products-for-update.csv"');
    res.type('text/csv');
    const rowCount = await streamCsv(res, productBulkFields, productUpdateExport.pages());
    await recordAudit({ userId: req.user.id, action: 'PRODUCTS_EXPORTED_FOR_UPDATE', entityType: 'DATA_EXPORT', details: { rowCount }, ipAddress: req.ip });
  },
  bulkProducts: async (req, res) => {
    const result = await catalogService.bulkProducts(req.body.rows, req.body.dryRun, { previewToken: req.body.previewToken, batchId: req.body.batchId, fileName: req.body.fileName, userId: req.user.id, ipAddress: req.ip });
    res.json({ data: result, message: req.body.dryRun ? `Validation finished. ${result.errors.length} invalid rows. No products were saved.` : 'Bulk changes saved successfully.' });
  },
  bulkProductsExcel: async (req, res) => {
    const buffer = Buffer.from(req.body.fileBase64, 'base64');
    const rows = await readProductWorkbook(buffer);
    const result = await catalogService.bulkProducts(rows, true, { fileName: 'excel-import.xlsx', userId: req.user.id, ipAddress: req.ip });
    res.json({ data: { ...result, rows } });
  },
};
