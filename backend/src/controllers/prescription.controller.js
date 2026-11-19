import { prescriptionService } from '../services/prescription.service.js';
import { recordAudit } from '../services/audit.service.js';
import { AppError } from '../utils/AppError.js';
import { listPagination } from '../utils/listPagination.js';

import { protectWorkflowController } from '../middleware/workflowLease.js';
import { protectRetryController } from '../utils/operationContext.js';
export const prescriptionController = protectRetryController(protectWorkflowController({
  list: async (req, res) => { const pagination = listPagination(req.query, ['PENDING', 'VERIFIED', 'PARTIALLY_DISPENSED', 'DISPENSED', 'REJECTED', 'CANCELLED']); const data = await prescriptionService.list(req.user,pagination); res.json({ data, pagination: { ...pagination, hasMore: data.length === pagination.pageSize } }); },
  get: async (req, res) => {
    const data = await prescriptionService.get(Number(req.params.id), req.user);
    if (!data) throw new AppError(404, 'Prescription not found.');
    res.json({ data });
  },
  create: async (req, res) => {
    const data = await prescriptionService.create(req.body, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_CREATED', entityType: 'PRESCRIPTION', entityId: data.id, details: { prescriptionNumber: data.prescriptionNumber, medicineItemCount: req.body.items.length, retailItemCount: req.body.retailItems?.length || 0 }, ipAddress: req.ip });
    res.status(201).json({ data });
  },
  update: async (req,res) => {
    const data=await prescriptionService.update(Number(req.params.id),req.body,req.user.id);
    await recordAudit({userId:req.user.id,action:'PRESCRIPTION_UPDATED',entityType:'PRESCRIPTION',entityId:data.id,details:{medicineItemCount:req.body.items.length,retailItemCount:req.body.retailItems?.length||0},ipAddress:req.ip});
    res.json({data});
  },
  remove: async (req,res) => {
    const id=Number(req.params.id);await prescriptionService.remove(id);
    await recordAudit({userId:req.user.id,action:'PRESCRIPTION_DELETED',entityType:'PRESCRIPTION',entityId:id,ipAddress:req.ip});
    res.json({message:'Pending prescription deleted successfully.'});
  },
  verify: async (req, res) => {
    const data = await prescriptionService.verify(Number(req.params.id), req.user.id);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_VERIFIED', entityType: 'PRESCRIPTION', entityId: data.id, ipAddress: req.ip });
    res.json({ data });
  },
  reject: async (req, res) => {
    const data = await prescriptionService.reject(Number(req.params.id), req.body.reason, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_REJECTED', entityType: 'PRESCRIPTION', entityId: data.id, details: { reason: req.body.reason }, ipAddress: req.ip });
    res.json({ data });
  },
  dispenseQuote: async (req, res) => res.json({ data: await prescriptionService.quoteDispensing(Number(req.params.id), req.body) }),
  dispense: async (req, res) => {
    const data = await prescriptionService.dispense(Number(req.params.id), req.body, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_DISPENSED', entityType: 'PRESCRIPTION', entityId: Number(req.params.id), details: data, ipAddress: req.ip });
    res.status(201).json({ data });
  },
  updatePickupDetails: async (req, res) => {
    const data = await prescriptionService.updatePickupDetails(Number(req.params.id), req.body, req.user);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_COLLECTION_REQUESTED', entityType: 'PRESCRIPTION', entityId: data.id, details: { plannedPickupAt: data.plannedPickupAt?.toISOString() || null }, ipAddress: req.ip });
    res.json({ data });
  },
  sendToCashier: async (req, res) => {
    const id = Number(req.params.id);
    const data = await prescriptionService.sendToCashier(id, req.user.id, req.body?.items ? req.body : undefined);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_SENT_TO_CASHIER', entityType: 'PRESCRIPTION', entityId: id, ipAddress: req.ip });
    res.json({ data });
  },
  refill: async (req, res) => {
    const id = Number(req.params.id);
    const data = await prescriptionService.refill(id, req.body, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_REFILLED', entityType: 'PRESCRIPTION', entityId: data.id, details: { originalPrescriptionId: id, prescriptionNumber: data.prescriptionNumber, refillsUsed: data.refillsUsed }, ipAddress: req.ip });
    res.status(201).json({ data });
  },
}));
