// Receives the web requests for stock batches: receiving, correcting, restricting and disposing of
// stock, calls the matching service, writes the audit log entry and sends the reply.
// The real rules are in services/inventory.service.js. To trace a button: route -> this controller
// -> service.

import { inventoryService } from '../services/inventory.service.js';
import { recordAudit } from '../services/audit.service.js';
import { listPagination } from '../utils/listPagination.js';
import { protectRetryController } from '../utils/operationContext.js';
import { exportStockWorkbook, readStockWorkbook } from '../services/stockWorkbook.service.js';
import { stockBulkService } from '../services/stockBulk.service.js';
import { prisma } from '../config/prisma.js';
import { toCsv } from '../utils/csv.js';
import { AppError } from '../utils/AppError.js';

export const inventoryController = protectRetryController({
  batches: async (req, res) => {
    const pagination = listPagination(req.query);
    const batches = await inventoryService.listBatches(pagination);
    res.json({
      pagination: { ...pagination, hasMore: batches.length === pagination.pageSize },
      data: batches.map(({ stockMovements, ...batch }) => {
        const disposition = stockMovements[0];
        return {
          ...batch,
          quantityReceived: Number(batch.quantityReceived),
          quantityAvailable: Number(batch.quantityAvailable),
          latestDisposition: disposition ? {
            action: disposition.referenceType.replace('EXPIRED_', ''),
            quantity: Math.abs(Number(disposition.quantityChange)),
            reason: disposition.reason,
            processedAt: disposition.createdAt,
            processedBy: disposition.performedBy,
          } : null,
        };
      }),
    });
  },
  movements: async (req, res) => { const pagination = listPagination(req.query, ['RECEIPT', 'DISPENSING', 'RETAIL_SALE', 'ADJUSTMENT', 'REVERSAL', 'EXPIRED', 'DAMAGED', 'RETURN']); const data = await inventoryService.listMovements(pagination); res.json({ data, pagination: { ...pagination, hasMore: data.length === pagination.pageSize } }); },
  alerts: async (_req, res) => res.json({ data: await inventoryService.alerts() }),
  acknowledgeLowStock: async (req, res) => {
    const data = await inventoryService.acknowledgeLowStock(Number(req.params.id), req.user.id);
    await recordAudit({
      userId: req.user.id,
      action: 'LOW_STOCK_NOTED',
      entityType: 'PRODUCT',
      entityId: data.productId,
      details: { stockLevel: data.stockLevel },
      ipAddress: req.ip,
    });
    res.json({ data, message: 'Low-stock alert marked as noted.' });
  },
  clearLowStockAcknowledgement: async (req, res) => {
    const productId = Number(req.params.id);
    const data = await inventoryService.clearLowStockAcknowledgement(productId);
    if (data.cleared) {
      await recordAudit({ userId: req.user.id, action: 'LOW_STOCK_NOTE_CLEARED', entityType: 'PRODUCT', entityId: productId, ipAddress: req.ip });
    }
    res.json({ data, message: data.cleared ? 'Low-stock note cleared.' : 'Low-stock alert was already active.' });
  },
  receive: async (req, res) => {
    const batch = await inventoryService.receive(req.body, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'STOCK_RECEIVED', entityType: 'INVENTORY_BATCH', entityId: batch.id, details: req.body, ipAddress: req.ip });
    res.status(201).json({ data: batch });
  },
  updateBatch:async(req,res)=>{const batch=await inventoryService.updateBatch(Number(req.params.id),req.body);await recordAudit({userId:req.user.id,action:'STOCK_BATCH_UPDATED',entityType:'INVENTORY_BATCH',entityId:batch.id,details:req.body,ipAddress:req.ip});res.json({data:batch})},
  setRestriction: async (req, res) => {
    const batch = await inventoryService.setRestriction(Number(req.params.id), req.body);
    await recordAudit({ userId: req.user.id, action: req.body.restricted ? 'STOCK_BATCH_RESTRICTED' : 'STOCK_BATCH_UNRESTRICTED', entityType: 'INVENTORY_BATCH', entityId: batch.id, details: { batchNumber: batch.batchNumber, reason: req.body.reason || null }, ipAddress: req.ip });
    res.json({ data: batch, message: req.body.restricted ? 'Batch restricted from issuing.' : 'Batch restriction removed.' });
  },
  adjust: async (req, res) => {
    const batch = await inventoryService.adjust(Number(req.params.id), req.body, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'STOCK_ADJUSTED', entityType: 'INVENTORY_BATCH', entityId: batch.id, details: req.body, ipAddress: req.ip });
    res.json({ data: batch });
  },
  disposeExpired: async (req, res) => {
    const result = await inventoryService.disposeExpired(Number(req.params.id), req.body, req.user.id);
    await recordAudit({
      userId: req.user.id,
      action: 'EXPIRED_STOCK_DISPOSITION_RECORDED',
      entityType: 'INVENTORY_BATCH',
      entityId: result.batch.id,
      details: {
        disposition: result.action,
        quantity: req.body.quantity,
        destinationName: result.destinationName,
        reason: req.body.reason,
        remainingQuantity: result.batch.quantityAvailable,
      },
      ipAddress: req.ip,
    });
    res.json({ data: result });
  },
  deleteBatch: async (req, res) => {
    const id = Number(req.params.id);
    const batch = await inventoryService.deleteBatch(id);
    await recordAudit({
      userId: req.user.id,
      action: 'STOCK_BATCH_DELETED',
      entityType: 'INVENTORY_BATCH',
      entityId: id,
      details: { batchNumber: batch.batchNumber, productId: batch.productId },
      ipAddress: req.ip,
    });
    res.json({ message: 'Inventory batch deleted successfully.' });
  },
  bulkTemplateXlsx: async (_req, res) => {
    const buffer = await exportStockWorkbook([], { examples: true });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="MediFlow_Stock_Bulk_Update_Template.xlsx"');
    res.send(buffer);
  },
  bulkTemplateCsv: async (_req, res) => {
    const csv = [
      'action,sku,batch_number,quantity,purchase_price,expiry_date,supplier_name,reason',
      'RECEIVE,MED-PARACETAMOL-ML,PARA-2026-L1,2500,2.50,2027-12-31,State Pharmaceuticals Manufacturing Corporation (SPMC),Paediatric syrup stock receipt',
      'RECEIVE,MED-AMOX-500,AMX-2026-04,1000,8.50,2028-06-30,Hemas Pharmaceuticals (Pvt) Ltd,Wholesale antibiotic restock',
      'ADJUST,MED-AUGMENTIN-ML,AUG-2026-01,-50,6.80,2027-09-30,GlaxoSmithKline (GSK) Pharmaceuticals,Stock count adjustment (spillage write-off)',
    ].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="mediflow-stock-bulk-template.csv"');
    res.send(`\uFEFF${csv}`);
  },
  exportStockForUpdate: async (req, res) => {
    const { search = '', format = 'xlsx' } = req.validatedQuery || {};
    const batches = await prisma.inventoryBatch.findMany({
      where: { product: { active: true }, ...(search ? { OR: [{ batchNumber: { contains: search } }, { product: { sku: { contains: search } } }, { product: { genericName: { contains: search } } }] } : {}) },
      include: { product: true, supplier: true },
      orderBy: [{ product: { genericName: 'asc' } }, { expiryDate: 'asc' }, { id: 'asc' }],
      take: 501,
    });
    if (batches.length > 500) throw new AppError(413, 'Narrow the search to export at most 500 batches at a time.');
    const literal = value => typeof value === 'string' && (value === '[CLEAR]' || /^['=+\-@]/.test(value)) ? `'${value}` : value;
    const formatted = batches.map((b) => ({
      action: 'SET_COUNT',
      sku: literal(b.product.sku),
      batchNumber: literal(b.batchNumber),
      quantity: Number(b.quantityAvailable),
      purchasePrice: Number(b.purchasePrice),
      expiryDate: b.expiryDate.toISOString().split('T')[0],
      supplierName: literal(b.supplier?.name || ''),
      reason: 'Routine stock audit adjustment',
      currentStock: Number(b.quantityAvailable),
      unit: b.product.unit,
      productName: b.product.brandName ? `${b.product.genericName} (${b.product.brandName})` : b.product.genericName,
    }));
    const keys = { action:'action',sku:'sku',batchNumber:'batch_number',quantity:'quantity',purchasePrice:'purchase_price',expiryDate:'expiry_date',supplierName:'supplier_name',reason:'reason',currentStock:'current_stock',unit:'unit',productName:'product_name' };
    const buffer = format === 'csv' ? '\uFEFF' + toCsv(Object.entries(keys).map(([key,label]) => ({ key,label,numeric:['quantity','purchasePrice','currentStock'].includes(key) })), formatted) : await exportStockWorkbook(formatted);
    await recordAudit({ userId:req.user.id,action:'STOCK_EXPORTED_FOR_UPDATE',entityType:'INVENTORY_BATCH',details:{format,rowCount:formatted.length},ipAddress:req.ip });
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Content-Type', format === 'csv' ? 'text/csv; charset=utf-8' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="mediflow-stock-for-update.${format}"`);
    res.send(buffer);
  },
  bulkExcelPreview: async (req, res) => {
    const buffer = Buffer.from(req.body.fileBase64, 'base64');
    const rows = await readStockWorkbook(buffer);
    const preview = await stockBulkService.preview(rows, req.user);
    res.json({ data: { ...preview, rows } });
  },
  bulkPreview: async (req, res) => {
    const preview = await stockBulkService.preview(req.body.rows, req.user);
    res.json({ data: preview });
  },
  bulkConfirm: async (req, res) => {
    const result = await stockBulkService.apply(req.body.rows, req.body.previewToken, req.user);
    res.json({ data: result });
  },
});
