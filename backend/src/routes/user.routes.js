// API addresses for staff accounts.
// For each address: who may use it (signed in, which role), which input checks run first, and which
// controller handles it.

import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { resetPasswordSchema, staffSchema, staffUpdateSchema } from '../validators/auth.validator.js';
import { activeSchema, idParams } from '../validators/common.validator.js';

export const userRoutes = Router();
userRoutes.use(authenticate, authorize('ADMIN'));
userRoutes.get('/', asyncHandler(userController.list));
userRoutes.post('/', validate({ body: staffSchema }), asyncHandler(userController.create));
userRoutes.put('/:id', validate({ params: idParams, body: staffUpdateSchema }), asyncHandler(userController.update));
userRoutes.post('/:id/reset-password', validate({ params: idParams, body: resetPasswordSchema }), asyncHandler(userController.resetPassword));
userRoutes.post('/:id/revoke-sessions', validate({ params: idParams }), asyncHandler(userController.revokeSessions));
userRoutes.patch('/:id/active', validate({ params: idParams, body: activeSchema }), asyncHandler(userController.setActive));
userRoutes.delete('/:id', validate({ params: idParams }), asyncHandler(userController.remove));
