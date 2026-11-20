// API addresses for stock batches: receiving, correcting, restricting and disposing of stock.
// For each address: who may use it (signed in, which role), which input checks run first, and which
// controller handles it.

import { Router } from 'express';
import { z } from 'zod';
import { inventoryController } from '../controllers/inventory.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idParams } from '../validators/common.validator.js';
import { adjustmentSchema, batchRestrictionSchema, expiredStockDispositionSchema, receiveStockSchema, updateBatchSchema, bulkStockExcelSchema, bulkStockRowsSchema } from '../validators/inventory.validator.js';

export const inventoryRoutes = Router();
inventoryRoutes.use(authenticate, authorize('ADMIN', 'PHARMACIST'));
inventoryRoutes.get('/batches/bulk/template.xlsx', asyncHandler(inventoryController.bulkTemplateXlsx));
inventoryRoutes.get('/batches/bulk/template.csv', asyncHandler(inventoryController.bulkTemplateCsv));
inventoryRoutes.get('/batches/bulk/export-for-update', validate({query:z.object({search:z.string().trim().max(150).default(''),format:z.enum(['xlsx','csv']).default('xlsx')})}), asyncHandler(inventoryController.exportStockForUpdate));
inventoryRoutes.post('/batches/bulk/excel-preview', validate({ body: bulkStockExcelSchema }), asyncHandler(inventoryController.bulkExcelPreview));
inventoryRoutes.post('/batches/bulk/preview', validate({ body: bulkStockRowsSchema }), asyncHandler(inventoryController.bulkPreview));
inventoryRoutes.post('/batches/bulk/confirm', validate({ body: bulkStockRowsSchema }), asyncHandler(inventoryController.bulkConfirm));
inventoryRoutes.get('/batches', asyncHandler(inventoryController.batches));
inventoryRoutes.get('/movements', asyncHandler(inventoryController.movements));
inventoryRoutes.get('/alerts', asyncHandler(inventoryController.alerts));
inventoryRoutes.put('/products/:id/low-stock-note', validate({ params: idParams }), asyncHandler(inventoryController.acknowledgeLowStock));
inventoryRoutes.delete('/products/:id/low-stock-note', validate({ params: idParams }), asyncHandler(inventoryController.clearLowStockAcknowledgement));
inventoryRoutes.post('/batches', validate({ body: receiveStockSchema }), asyncHandler(inventoryController.receive));
inventoryRoutes.put('/batches/:id', validate({params:idParams,body:updateBatchSchema}), asyncHandler(inventoryController.updateBatch));
inventoryRoutes.patch('/batches/:id/restriction', validate({ params: idParams, body: batchRestrictionSchema }), asyncHandler(inventoryController.setRestriction));
inventoryRoutes.post('/batches/:id/adjust', validate({ params: idParams, body: adjustmentSchema }), asyncHandler(inventoryController.adjust));
inventoryRoutes.post('/batches/:id/dispose-expired', validate({ params: idParams, body: expiredStockDispositionSchema }), asyncHandler(inventoryController.disposeExpired));
inventoryRoutes.delete('/batches/:id', authorize('ADMIN'), validate({ params: idParams }), asyncHandler(inventoryController.deleteBatch));
