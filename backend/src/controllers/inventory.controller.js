import { inventoryService } from '../services/inventory.service.js';
import { recordAudit } from '../services/audit.service.js';

export const inventoryController = {
  batches: async (_req, res) => {
    const batches = await inventoryService.listBatches();
    res.json({
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
  movements: async (_req, res) => res.json({ data: await inventoryService.listMovements() }),
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
};
