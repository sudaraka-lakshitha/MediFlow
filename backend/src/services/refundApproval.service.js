// REFUND APPROVALS
// Some refunds are not allowed for normal staff (for example after the medicine has left the
// pharmacy).
// Staff can ask an administrator to approve them. The person who asked can never approve their own
// request.

import { createHash } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { serializable } from '../utils/serializable.js';
import { AppError } from '../utils/AppError.js';
import { cancellationQuote } from '../utils/cancellationQuote.js';
import { paymentRequestService } from './paymentRequest.service.js';

// Only pharmacy staff can use these actions.
const staff = user => { if (!['ADMIN', 'PHARMACIST', 'CASHIER'].includes(user.role)) throw new AppError(403, 'Staff access is required.'); };
const includes = { items: { include: { product: true }, orderBy: { id: 'asc' } }, delivery: { include: { feePaymentRequest: true } }, deliveryFeeFor: true };
// A fingerprint of the bill. If the bill changes after the preview, the request is refused and must
// be previewed again.
const snapshot = bill => createHash('sha256').update(JSON.stringify({
  revision: bill.revision, updatedAt: bill.updatedAt, status: bill.status, amountPaid: bill.amountPaid, refundedAmount: bill.refundedAmount,
  subtotal: bill.subtotal, discount: bill.discount, tax: bill.tax, containerFee: bill.containerFee, total: bill.total,
  items: bill.items.map(item => [item.id, item.quantity, item.lineTotal]), delivery: bill.delivery, deliveryFeeFor: bill.deliveryFeeFor,
})).digest('hex');
// Work out what would be refunded for the chosen lines.
async function quote(tx, id, input) {
  const bill = await tx.paymentRequest.findUnique({ where: { id }, include: includes });
  if (!bill || bill.status !== 'PAID' || bill.revision !== input.revision) throw new AppError(409, 'Only the current paid, uncollected invoice can be escalated. Refresh the invoice.');
  const delivery = bill.delivery || bill.deliveryFeeFor;
  if (delivery && !['REQUESTED', 'AWAITING_FEE', 'CANCELLED'].includes(delivery.status)) throw new AppError(409, 'Use the returned-parcel workflow after dispatch.');
  const calculation = input.itemIds?.length ? cancellationQuote(bill, input.itemIds, input.quantities) : null;
  const full = !calculation || !calculation.kept.length;
  let amount = full ? new Prisma.Decimal(bill.amountPaid).sub(bill.refundedAmount || 0) : calculation.refundAmount;
  const fee = bill.delivery?.feePaymentRequest;
  if (full && fee?.status === 'PAID') amount = amount.add(new Prisma.Decimal(fee.amountPaid).sub(fee.refundedAmount || 0));
  if (!amount.greaterThan(0)) throw new AppError(409, 'No refundable payment remains.');
  return { bill, amount, hash: snapshot(bill), full, lines: (calculation?.removed || bill.items).map(item => ({ id: item.id, name: item.product.genericName, quantity: String(item.quantity) })), includesDeliveryFee: full && fee?.status === 'PAID' };
}
export const refundApprovalService = {
  // Bills that could have a refund requested.
  async options(user, search) {
    staff(user);
    return prisma.paymentRequest.findMany({ where: { status: 'PAID', ...(search ? { OR: [{ requestNumber: { contains: search } }, { patient: { fullName: { contains: search } } }] } : {}) },
      select: { id: true, requestNumber: true, revision: true, total: true, patient: { select: { fullName: true } }, items: { select: { id: true, quantity: true, product: { select: { genericName: true, unit: true } } } } }, orderBy: { id: 'desc' }, take: 30 });
  },
  async list(user, pagination) {
    staff(user);
    return prisma.refundApproval.findMany({ where: { status: pagination.status || 'PENDING' }, orderBy: { id: 'desc' }, skip: (pagination.page - 1) * pagination.pageSize, take: pagination.pageSize });
  },
  // Show the refund amount before asking for approval.
  async preview(id, input, user) { staff(user); return serializable(async tx => { const result = await quote(tx, id, input); return { amount: result.amount, hash: result.hash, lines: result.lines, includesDeliveryFee: result.includesDeliveryFee }; }); },
  // Ask an administrator to approve a refund.
  async request(id, input, user) {
    staff(user);
    return serializable(async tx => {
      const result = await quote(tx, id, input);
      if (result.hash !== input.hash) throw new AppError(409, 'The invoice changed. Preview the request again.');
      const existing = await tx.refundApproval.findUnique({ where: { pendingPaymentRequestId: id } });
      if (existing) throw new AppError(409, 'An administrator is already reviewing a refund request for this invoice.');
      const selection = { revision: input.revision, itemIds: input.itemIds || [], quantities: input.quantities || {}, lines: result.lines, includesDeliveryFee: result.includesDeliveryFee || false };
      const approval = await tx.refundApproval.create({ data: { paymentRequestId: id, pendingPaymentRequestId: id, requestNumber: result.bill.requestNumber, amount: result.amount, snapshotHash: result.hash, selection, reason: input.reason, requestedById: user.id } });
      await tx.auditLog.create({ data: { userId: user.id, action: 'REFUND_APPROVAL_REQUESTED', entityType: 'PAYMENT_REQUEST', entityId: id, details: { approvalId: approval.id, amount: String(result.amount), reason: input.reason } } });
      return approval;
    });
  },
  // An administrator approves or rejects the request (not their own).
  async decide(id, approvalId, input, user) {
    if (user.role !== 'ADMIN') throw new AppError(403, 'Only an administrator can decide restricted refunds.');
    return serializable(async tx => {
      const approval = await tx.refundApproval.findUnique({ where: { id: approvalId } });
      if (!approval || approval.paymentRequestId !== id || approval.status !== 'PENDING') throw new AppError(409, 'This request has already been decided or is not on this invoice.');
      if (approval.requestedById === user.id) throw new AppError(403, 'Another administrator must review your request. You cannot approve your own escalation.');
      if (input.approved) {
        const current = await quote(tx, id, approval.selection);
        if (current.hash !== approval.snapshotHash || !current.amount.equals(approval.amount)) throw new AppError(409, 'The invoice or delivery changed. Reject this stale request and ask staff to preview a new one.');
        // The customer receives the request's explicitly customer-visible reason.
        // Keep the administrator's review notes in the staff approval/audit record.
        const reason = approval.reason;
        if (current.full) await paymentRequestService.cancel(id, reason, user, tx);
        else await paymentRequestService.partialCancel(id, { ...approval.selection, reason }, user, tx);
      }
      const result = await tx.refundApproval.update({ where: { id: approvalId }, data: { status: input.approved ? 'APPROVED' : 'REJECTED', pendingPaymentRequestId: null, decidedById: user.id, decisionReason: input.reason, decidedAt: new Date() } });
      await tx.auditLog.create({ data: { userId: user.id, action: input.approved ? 'REFUND_APPROVAL_GRANTED' : 'REFUND_APPROVAL_REJECTED', entityType: 'PAYMENT_REQUEST', entityId: id, details: { approvalId, requesterId: approval.requestedById, amount: String(approval.amount), reason: input.reason } } });
      return result;
    });
  },
};
