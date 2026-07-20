import { Router } from 'express';
import { discountController } from '../controllers/discount.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { activeSchema, idParams } from '../validators/common.validator.js';
import { discountRuleSchema } from '../validators/discount.validator.js';

export const discountRoutes = Router();
discountRoutes.use(authenticate, authorize('ADMIN'));
discountRoutes.get('/', asyncHandler(discountController.list));
discountRoutes.post('/', validate({ body: discountRuleSchema }), asyncHandler(discountController.create));
discountRoutes.put('/:id', validate({ params: idParams, body: discountRuleSchema }), asyncHandler(discountController.update));
discountRoutes.patch('/:id/active', validate({ params: idParams, body: activeSchema }), asyncHandler(discountController.toggleActive));
discountRoutes.delete('/:id', validate({ params: idParams }), asyncHandler(discountController.remove));
