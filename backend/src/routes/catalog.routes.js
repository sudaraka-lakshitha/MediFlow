// API addresses for the product catalogue: products, categories, manufacturers and suppliers.
// For each address: who may use it (signed in, which role), which input checks run first, and which
// controller handles it.

import { Router } from 'express';
import { catalogController } from '../controllers/catalog.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { z } from 'zod';
import { base64WorkbookLimit } from '../utils/workbookLimits.js';
import { activeSchema, idParams } from '../validators/common.validator.js';
import { bulkProductsSchema, categorySchema, manufacturerSchema, productSchema, supplierSchema } from '../validators/catalog.validator.js';

export const catalogRoutes = Router();
catalogRoutes.use(authenticate, authorize('ADMIN', 'PHARMACIST'));
catalogRoutes.get('/categories', asyncHandler(catalogController.categories));
catalogRoutes.post('/categories', authorize('ADMIN'), validate({ body: categorySchema }), asyncHandler(catalogController.createCategory));
catalogRoutes.put('/categories/:id', authorize('ADMIN'), validate({ params: idParams, body: categorySchema }), asyncHandler(catalogController.updateCategory));
catalogRoutes.patch('/categories/:id/active', authorize('ADMIN'), validate({ params: idParams, body: activeSchema }), asyncHandler(catalogController.setCategoryActive));
catalogRoutes.delete('/categories/:id', authorize('ADMIN'), validate({ params: idParams }), asyncHandler(catalogController.deleteCategory));
catalogRoutes.get('/products', asyncHandler(catalogController.products));
catalogRoutes.get('/products/bulk-template.csv', authorize('ADMIN'), asyncHandler(catalogController.productTemplate));
catalogRoutes.get('/products/bulk-template.xlsx', authorize('ADMIN'), asyncHandler(catalogController.productTemplateExcel));
catalogRoutes.get('/products/bulk-format', authorize('ADMIN'), catalogController.bulkFormat);
catalogRoutes.get('/products/export-for-update.:format', authorize('ADMIN'), validate({ params: z.object({format:z.enum(['csv','xlsx'])}) }), asyncHandler(catalogController.exportForUpdate));
catalogRoutes.post('/products/bulk/excel-preview', authorize('ADMIN'), validate({ body: z.object({ fileBase64: z.string().min(8).max(base64WorkbookLimit('product')).regex(/^[A-Za-z0-9+/]+={0,2}$/) }) }), asyncHandler(catalogController.bulkProductsExcel));
catalogRoutes.post('/products/bulk', authorize('ADMIN'), validate({ body: bulkProductsSchema }), asyncHandler(catalogController.bulkProducts));
catalogRoutes.post('/products', authorize('ADMIN'), validate({ body: productSchema }), asyncHandler(catalogController.createProduct));
catalogRoutes.put('/products/:id', authorize('ADMIN'), validate({ params: idParams, body: productSchema }), asyncHandler(catalogController.updateProduct));
catalogRoutes.patch('/products/:id/active', authorize('ADMIN'), validate({ params: idParams, body: activeSchema }), asyncHandler(catalogController.setProductActive));
catalogRoutes.delete('/products/:id', authorize('ADMIN'), validate({ params: idParams }), asyncHandler(catalogController.deleteProduct));
catalogRoutes.get('/suppliers', asyncHandler(catalogController.suppliers));
catalogRoutes.post('/suppliers', authorize('ADMIN'), validate({ body: supplierSchema }), asyncHandler(catalogController.createSupplier));
catalogRoutes.put('/suppliers/:id', authorize('ADMIN'), validate({ params: idParams, body: supplierSchema }), asyncHandler(catalogController.updateSupplier));
catalogRoutes.patch('/suppliers/:id/active', authorize('ADMIN'), validate({ params: idParams, body: activeSchema }), asyncHandler(catalogController.setSupplierActive));
catalogRoutes.delete('/suppliers/:id', authorize('ADMIN'), validate({ params: idParams }), asyncHandler(catalogController.deleteSupplier));
catalogRoutes.get('/manufacturers', asyncHandler(catalogController.manufacturers));
catalogRoutes.post('/manufacturers', authorize('ADMIN'), validate({ body: manufacturerSchema }), asyncHandler(catalogController.createManufacturer));
catalogRoutes.put('/manufacturers/:id', authorize('ADMIN'), validate({ params: idParams, body: manufacturerSchema }), asyncHandler(catalogController.updateManufacturer));
catalogRoutes.patch('/manufacturers/:id/active', authorize('ADMIN'), validate({ params: idParams, body: activeSchema }), asyncHandler(catalogController.setManufacturerActive));
catalogRoutes.delete('/manufacturers/:id', authorize('ADMIN'), validate({ params: idParams }), asyncHandler(catalogController.deleteManufacturer));
