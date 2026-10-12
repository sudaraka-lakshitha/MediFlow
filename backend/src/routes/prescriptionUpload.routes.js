import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { authorizeCashier } from '../middleware/authorizeCashier.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idParams, slipParams } from '../validators/common.validator.js';
import {
  reviewUploadSchema,
  uploadEstimateQuoteSchema,
  uploadPrescriptionSchema,
  uploadSlipSchema,
  uploadSlipReviewSchema,
  cancelUploadSchema,
} from '../validators/prescriptionUpload.validator.js';
import { prescriptionUploadController } from '../controllers/prescriptionUpload.controller.js';

export const prescriptionUploadRoutes = Router();
prescriptionUploadRoutes.use(authenticate);

// List all uploads (filtered by role in the service)
prescriptionUploadRoutes.get('/', authorize('ADMIN', 'PHARMACIST', 'CASHIER', 'PATIENT'), asyncHandler(prescriptionUploadController.list));

// Retention policy (admin only)
prescriptionUploadRoutes.get('/retention', authorize('ADMIN'), asyncHandler(prescriptionUploadController.retention));
prescriptionUploadRoutes.put('/retention', authorize('ADMIN'), validate({ body: z.object({ days: z.coerce.number().int().min(1).max(365) }) }), asyncHandler(prescriptionUploadController.setRetention));

// Patient: upload a prescription
prescriptionUploadRoutes.post('/', authorize('PATIENT'), validate({ body: uploadPrescriptionSchema }), asyncHandler(prescriptionUploadController.create));

// Patient: accept the estimate (no-prepare → prepare)
prescriptionUploadRoutes.put('/:id/accept', authorize('PATIENT'), validate({ params: idParams, body: z.object({ revision: z.coerce.number().int().nonnegative() }) }), asyncHandler(prescriptionUploadController.acceptEstimate));

// Patient / Staff: cancel or decline quotation / upload
prescriptionUploadRoutes.post('/:id/cancel', authorize('PATIENT', 'ADMIN', 'PHARMACIST'), validate({ params: idParams, body: cancelUploadSchema }), asyncHandler(prescriptionUploadController.cancel));

// Serve the prescription file
prescriptionUploadRoutes.get('/:id/file', authorize('ADMIN', 'PHARMACIST', 'CASHIER', 'PATIENT'), validate({ params: idParams }), asyncHandler(prescriptionUploadController.file));

// Pharmacist / Admin: build and save an estimate quote
prescriptionUploadRoutes.post('/:id/estimate-quote', authorize('ADMIN', 'PHARMACIST'), validate({ params: idParams, body: uploadEstimateQuoteSchema }), asyncHandler(prescriptionUploadController.estimateQuote));

// Pharmacist / Admin: save the availability review (status PENDING → AVAILABLE / PARTIALLY_AVAILABLE / etc.)
prescriptionUploadRoutes.put('/:id/review', authorize('ADMIN', 'PHARMACIST'), validate({ params: idParams, body: reviewUploadSchema }), asyncHandler(prescriptionUploadController.review));

// Pharmacist / Admin: send quotation to patient (status AVAILABLE → PAYMENT_PENDING)
prescriptionUploadRoutes.put('/:id/send-quotation', authorize('ADMIN', 'PHARMACIST'), validate({ params: idParams }), asyncHandler(prescriptionUploadController.sendQuotation));

// Admin: change deletion deadline
prescriptionUploadRoutes.put('/:id/deletion-deadline', authorize('ADMIN'), validate({ params: idParams, body: z.object({ deleteAt: z.coerce.date().refine((date) => date > new Date(), 'Deletion deadline must be in the future.') }) }), asyncHandler(prescriptionUploadController.setDeadline));

// ── Bank-transfer payment slip routes ─────────────────────────────────────────

// Patient submits a bank-transfer receipt
prescriptionUploadRoutes.post('/:id/slip', authorize('PATIENT', 'ADMIN', 'PHARMACIST'), validate({ params: idParams, body: uploadSlipSchema }), asyncHandler(prescriptionUploadController.submitSlip));

// Cashier reviews the slip (approve → READY_TO_PREPARE, reject → PAYMENT_PENDING)
prescriptionUploadRoutes.post('/:id/slips/:slipId/review', authorizeCashier, validate({ params: slipParams, body: uploadSlipReviewSchema }), asyncHandler(prescriptionUploadController.reviewSlip));

// Serve the slip file
prescriptionUploadRoutes.get('/:id/slips/:slipId/file', authorize('ADMIN', 'PHARMACIST', 'CASHIER', 'PATIENT'), validate({ params: slipParams }), asyncHandler(prescriptionUploadController.slipFile));
