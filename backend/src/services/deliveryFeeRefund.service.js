import { Prisma } from '@prisma/client';
import { serializable } from '../utils/serializable.js';
import { AppError } from '../utils/AppError.js';

const staff = user => {
  if (!['ADMIN', 'PHARMACIST', 'CASHIER'].includes(user.role)) throw new AppError(403, 'Only staff can request a delivery-fee exception.');
};
const amountOf = value => {
  const amount = new Prisma.Decimal(value);
  if (!amount.isFinite() || !amount.greaterThan(0) || amount.decimalPlaces() > 2) throw new AppError(400, 'Enter a positive refund amount with at most two decimal places.');
  return amount;
};
async function feeInvoice(tx, id) {
  const fee = await tx.paymentRequest.findUnique({ where: { id }, include: { deliveryFeeFor: true } });
  if (!fee?.deliveryFeeFor || fee.status !== 'FULFILLED' || !fee.deliveryFeeFor.dispatchedAt) throw new AppError(409, 'This exception is only for a paid delivery charge after dispatch. Use ordinary cancellation before dispatch.');
  return fee;
}
export const deliveryFeeRefundService = {
  async request(id, input, user) {
    staff(user);
    const amount = amountOf(input.amount);
    if (!input.reason?.trim() || !input.evidenceReference?.trim()) throw new AppError(400, 'A reason and supporting reference are required.');
    return serializable(async tx => {
      const fee = await feeInvoice(tx, id);
      const pending = await tx.refund.aggregate({ where: { paymentRequestId: id, category: 'DELIVERY_FEE', status: 'AWAITING_APPROVAL' }, _sum: { amount: true } });
      const remaining = fee.amountPaid.sub(fee.refundedAmount).sub(pending._sum.amount || 0);
      if (amount.greaterThan(remaining)) throw new AppError(409, 'This exceeds the delivery fee remaining after existing refunds and approval requests.');
      const request = await tx.refund.create({ data: { paymentRequestId: id, category: 'DELIVERY_FEE', status: 'AWAITING_APPROVAL', amount, reason: input.reason.trim(), evidenceReference: input.evidenceReference.trim(), createdById: user.id } });
      await tx.auditLog.create({ data: { userId: user.id, action: 'DELIVERY_FEE_REFUND_REQUESTED', entityType: 'REFUND', entityId: request.id, details: { paymentRequestId: id, amount: String(amount), reason: input.reason, evidenceReference: input.evidenceReference } } });
      return request;
    });
  },
  async decide(id, input, user) {
    staff(user);
    if (user.role !== 'ADMIN' && user.deliveryRefundApprovalAccess !== true) throw new AppError(403, 'Delivery-fee refund approval permission is required.');
    if (!input.reason?.trim()) throw new AppError(400, 'Record the approval or rejection reason.');
    return serializable(async tx => {
      const request = await tx.refund.findUnique({ where: { id } });
      if (!request || request.category !== 'DELIVERY_FEE' || request.status !== 'AWAITING_APPROVAL') throw new AppError(409, 'This request is no longer awaiting approval.');
      if (request.createdById === user.id) throw new AppError(403, 'Another authorized staff member must review your request.');
      const fee = await feeInvoice(tx, request.paymentRequestId);
      if (input.approved && request.amount.greaterThan(fee.amountPaid.sub(fee.refundedAmount))) throw new AppError(409, 'The remaining delivery-fee balance changed. Review before approving.');
      const changed = await tx.refund.updateMany({ where: { id, status: 'AWAITING_APPROVAL' }, data: { status: input.approved ? 'PENDING' : 'REJECTED', approvedById: user.id, approvalReason: input.reason.trim(), decidedAt: new Date() } });
      if (changed.count !== 1) throw new AppError(409, 'Another staff member already reviewed this request.');
      if (input.approved) {
        await tx.paymentRequest.update({ where: { id: fee.id }, data: { refundedAmount: { increment: request.amount } } });
        await tx.paymentRequestEvent.create({ data: { paymentRequestId: fee.id, revision: fee.revision, actorId: user.id, kind: 'REFUND_REQUESTED', details: { refundId: id, refundAmount: String(request.amount), reason: request.reason, approvalReason: input.reason, category: 'DELIVERY_FEE', settlement: 'PENDING' } } });
      }
      await tx.auditLog.create({ data: { userId: user.id, action: input.approved ? 'DELIVERY_FEE_REFUND_APPROVED' : 'DELIVERY_FEE_REFUND_REJECTED', entityType: 'REFUND', entityId: id, details: { requesterId: request.createdById, amount: String(request.amount), reason: input.reason } } });
      return tx.refund.findUnique({ where: { id } });
    });
  },
};
