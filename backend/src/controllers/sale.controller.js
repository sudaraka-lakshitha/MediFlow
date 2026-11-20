// Receives the web requests for sales (invoices) and over-the-counter sales, calls the matching
// service, writes the audit log entry and sends the reply.
// The real rules are in services/sale.service.js. To trace a button: route -> this controller ->
// service.

import { z } from 'zod';
import { saleService } from '../services/sale.service.js';
import { recordAudit } from '../services/audit.service.js';
import { createInvoicePdf } from '../utils/invoicePdf.js';
import { listPagination } from '../utils/listPagination.js';
import { billingPreview } from '../utils/billingPreview.js';

export const paymentSchema = z.object({ amount: z.coerce.number().positive(), paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'OTHER']), paymentReference: z.string().trim().max(120).optional().nullable() });
export const retailSaleSchema = z.object({
  patientId: z.coerce.number().int().positive().optional().nullable(), couponCode: z.string().trim().max(40).optional().nullable(),
  tax: z.coerce.number().nonnegative().default(0), amountPaid: z.coerce.number().nonnegative().default(0), paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'OTHER']).default('CASH'), paymentReference: z.string().trim().max(120).optional().nullable(),
  items: z.array(z.object({ productId: z.coerce.number().int().positive(), quantity: z.coerce.number().positive() })).min(1).max(100),
});
export const voidSaleSchema = z.object({ reason: z.string().trim().min(3).max(500) });

import { protectWorkflowController } from '../middleware/workflowLease.js';
import { protectRetryController } from '../utils/operationContext.js';
export const saleController = protectRetryController(protectWorkflowController({
  preview: async (req,res) => {
    const sale = await saleService.getForUser(Number(req.params.id),req.user);
    res.setHeader('Cache-Control','no-store');
    res.json({data:billingPreview(sale)});
  },
  list: async (req, res) => {
    const pagination = listPagination(req.query);
    const data = await saleService.list(req.user, pagination);
    res.json({ data, pagination: { ...pagination, hasMore: data.length === pagination.pageSize } });
  },
  invoice: async (req, res) => {
    const sale = await saleService.getForUser(Number(req.params.id), req.user);
    const body = await createInvoicePdf(sale);
    await recordAudit({ userId: req.user.id, action: 'INVOICE_EXPORTED', entityType: 'SALE', entityId: sale.id, details: { format: 'pdf' }, ipAddress: req.ip });
    res.setHeader('Content-Disposition', `inline; filename="${sale.invoiceNumber}.pdf"`);
    res.type('application/pdf').send(body);
  },
  pay: async (req, res) => {
    const data = await saleService.pay(Number(req.params.id), req.body.amount, req.body.paymentMethod, req.user.id, req.body.paymentReference);
    await recordAudit({ userId: req.user.id, action: 'SALE_PAYMENT', entityType: 'SALE', entityId: data.id, details: req.body, ipAddress: req.ip });
    res.json({ data });
  },
  createRetail: async (req, res) => {
    const sale = await saleService.createRetail(req.body, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'RETAIL_SALE_CREATED', entityType: 'SALE', entityId: sale.id, details: { invoiceNumber: sale.invoiceNumber, itemCount: req.body.items.length }, ipAddress: req.ip });
    res.status(201).json({ data: sale });
  },
  void: async (req, res) => {
    const data = await saleService.voidSale(Number(req.params.id), req.body.reason, req.user.id, req.user.role);
    await recordAudit({ userId: req.user.id, action: 'SALE_VOIDED', entityType: 'SALE', entityId: data.id, details: { invoiceNumber: data.invoiceNumber, reason: req.body.reason }, ipAddress: req.ip });
    res.json({ data });
  },
}));
