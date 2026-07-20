import { Router } from 'express';
import { z } from 'zod';
import { drugInformationController } from '../controllers/drugInformation.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const drugInformationRoutes = Router();
drugInformationRoutes.use(authenticate, authorize('ADMIN', 'PHARMACIST'));
drugInformationRoutes.get('/search', validate({ query: z.object({ q: z.string().trim().min(2).max(100) }) }), asyncHandler(drugInformationController.search));
drugInformationRoutes.get('/suggestions', validate({ query: z.object({ q: z.string().trim().min(2).max(80) }) }), asyncHandler(drugInformationController.suggestions));
