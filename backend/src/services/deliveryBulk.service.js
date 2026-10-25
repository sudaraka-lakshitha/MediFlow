import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { deliveryActionSchema } from '../validators/delivery.validator.js';
import { validateDeliveryAction } from '../utils/deliveryAction.js';
import { deliveryService } from './delivery.service.js';
import { workflowLeaseService } from './workflowLease.service.js';

const columns = ['invoice_number', 'version', 'action', 'recipient_name', 'address', 'phone', 'courier', 'tracking', 'current_status', 'dispatched_at', 'delivered_at'];
export const deliveryBulkSchema = z.object({ rows: z.array(z.record(z.string(), z.string().max(1000))).min(1).max(50), previewToken: z.string().max(2000).optional() });
const digest = rows => crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex');
const staff = user => { if (!['ADMIN', 'PHARMACIST'].includes(user.role)) throw new AppError(403, 'Only administrators and pharmacists may update deliveries.'); };
const unescape = text => text?.replace(/^'(?=[=+\-@])/, '');

export async function deliveryBulkPlan(tx, rows) {
  const plans = [], errors = [], seen = new Set();
  for (const [index, row] of rows.entries()) {
    const sourceRow = /^\d+$/.test(row.__sourceRow || '') && Number(row.__sourceRow) > 0 ? Number(row.__sourceRow) : index + 2;
    try {
      if (Object.keys(row).some(key => key !== '__sourceRow' && !columns.includes(key))) throw new AppError(400, 'Unknown column. Use the exported delivery template.');
      if (!row.action?.trim()) continue; // Exported records with no requested action remain untouched.
      const invoice = row.invoice_number?.trim();
      if (!invoice || seen.has(invoice)) throw new AppError(400, 'Missing or duplicate invoice number.');
      seen.add(invoice);
      const delivery = await tx.deliveryRequest.findFirst({ where: { paymentRequest: { requestNumber: invoice } }, include: { paymentRequest: true, feePaymentRequest: true } });
      if (!delivery) throw new AppError(404, 'Delivery not found.');
      if (row.version !== delivery.updatedAt.toISOString()) throw new AppError(409, 'Delivery changed or version was edited. Export a fresh copy.');
      const action = row.action.trim().toUpperCase();
      if (!['DISPATCH', 'DELIVERED', 'UPDATE_TRACKING', 'UPDATE_DETAILS'].includes(action)) throw new AppError(400, 'Use DISPATCH, DELIVERED, UPDATE_TRACKING or UPDATE_DETAILS. Confirm fees and cancel deliveries individually.');
      const input = { action, expectedUpdatedAt: row.version };
      const fields = action === 'UPDATE_DETAILS' ? { recipient_name: 'recipientName', address: 'address', phone: 'phone' }
        : ['DISPATCH', 'UPDATE_TRACKING'].includes(action) ? { courier: 'courierService', tracking: 'trackingReference' } : {};
      for (const [column, field] of Object.entries(fields)) {
        const value = unescape(row[column]?.trim());
        if (value === '__CLEAR__') throw new AppError(400, `${column} is required for delivery and cannot be cleared.`);
        if (value) input[field] = value;
        else if (action !== 'UPDATE_DETAILS') input[field] = delivery[field] || undefined;
      }
      const parsed = deliveryActionSchema.safeParse(input);
      if (!parsed.success) throw new AppError(400, parsed.error.issues.map(issue => issue.message).join(' '));
      await validateDeliveryAction(tx, delivery, parsed.data);
      const changes = Object.entries(parsed.data).filter(([key, value]) => !['action', 'expectedUpdatedAt'].includes(key) && value !== delivery[key]).map(([field, after]) => ({ field, before: delivery[field] || '', after }));
      plans.push({ row: sourceRow, invoice, id: delivery.paymentRequestId, version: row.version, input: parsed.data, status: delivery.status, changes });
    } catch (error) {
      if (!error.isOperational) throw error;
      errors.push({ row: sourceRow, invoice: row.invoice_number, message: error.message });
    }
  }
  return { plans, errors };
}

export const deliveryBulkService = {
  async preview(rows, user) {
    staff(user);
    const result = await deliveryBulkPlan(prisma, rows);
    return { ...result, previewToken: result.errors.length || !result.plans.length ? null : jwt.sign({ purpose: 'delivery-bulk', userId: user.id, digest: digest(rows) }, env.JWT_SECRET, { expiresIn: '10m' }) };
  },
  async apply(rows, token, user, owner) {
    staff(user);
    let claim;
    try { claim = jwt.verify(token || '', env.JWT_SECRET); } catch { throw new AppError(400, 'Preview expired. Upload and review the file again.'); }
    if (claim.purpose !== 'delivery-bulk' || claim.userId !== user.id || claim.digest !== digest(rows)) throw new AppError(409, 'File or user changed since preview. Review it again.');
    const initial = await deliveryBulkPlan(prisma, rows);
    if (initial.errors.length || !initial.plans.length) throw new AppError(409, 'Delivery data changed. Review the file again.', { errors: initial.errors });
    const leases = [];
    try {
      const resources = new Set();
      for (const plan of initial.plans) resources.add(await workflowLeaseService.resource('payment', plan.id, user));
      for (const resource of [...resources].sort()) {
        for (const lease of leases) await workflowLeaseService.acquire(lease.resourceKey, owner, lease.token);
        leases.push(await workflowLeaseService.begin(resource, owner));
      }
      return await prisma.$transaction(async tx => {
        for (const lease of leases) await workflowLeaseService.pinForTransaction(tx, lease, owner);
        const { plans, errors } = await deliveryBulkPlan(tx, rows);
        if (errors.length) throw new AppError(409, 'Delivery data changed. Nothing was applied.', { errors });
        for (const plan of plans) await deliveryService.act(plan.id, plan.input, user, tx);
        await tx.auditLog.create({ data: { userId: user.id, action: 'DELIVERY_BULK_APPLIED', entityType: 'DELIVERY', details: { invoices: plans.map(plan => plan.invoice), count: plans.length } } });
        return { applied: plans.length };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 30000 });
    } finally {
      // Never report a committed batch as failed solely because lease cleanup fails.
      await Promise.allSettled(leases.map(lease => workflowLeaseService.finish(lease, owner)));
    }
  },
};
