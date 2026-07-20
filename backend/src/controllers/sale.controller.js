import { z } from 'zod';
import { saleService } from '../services/sale.service.js';
import { recordAudit } from '../services/audit.service.js';
import { createInvoicePdf } from '../utils/invoicePdf.js';

export const paymentSchema = z.object({ amount: z.coerce.number().positive(), paymentMethod: z.enum(['CASH', 'CARD', 'OTHER']) });
export const retailSaleSchema = z.object({
  patientId: z.coerce.number().int().positive().optional().nullable(), couponCode: z.string().trim().max(40).optional().nullable(),
  tax: z.coerce.number().nonnegative().default(0), amountPaid: z.coerce.number().nonnegative().default(0), paymentMethod: z.enum(['CASH', 'CARD', 'OTHER']).default('CASH'),
  items: z.array(z.object({ productId: z.coerce.number().int().positive(), quantity: z.coerce.number().positive() })).min(1).max(100),
});

export const saleController = {
  list: async (req, res) => res.json({ data: await saleService.list(req.user) }),
  invoice: async (req, res) => {
    const sale = await saleService.getForUser(Number(req.params.id), req.user);
    const body = await createInvoicePdf(sale);
    await recordAudit({ userId: req.user.id, action: 'INVOICE_EXPORTED', entityType: 'SALE', entityId: sale.id, details: { format: 'pdf' }, ipAddress: req.ip });
    res.setHeader('Content-Disposition', `inline; filename="${sale.invoiceNumber}.pdf"`);
    res.type('application/pdf').send(body);
  },
  pay: async (req, res) => {
    const data = await saleService.pay(Number(req.params.id), req.body.amount, req.body.paymentMethod);
    await recordAudit({ userId: req.user.id, action: 'SALE_PAYMENT', entityType: 'SALE', entityId: data.id, details: req.body, ipAddress: req.ip });
    res.json({ data });
  },
  createRetail: async (req, res) => {
    const sale = await saleService.createRetail(req.body, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'RETAIL_SALE_CREATED', entityType: 'SALE', entityId: sale.id, details: { invoiceNumber: sale.invoiceNumber, itemCount: req.body.items.length }, ipAddress: req.ip });
    res.status(201).json({ data: sale });
  },
};
