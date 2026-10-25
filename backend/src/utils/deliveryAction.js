import { AppError } from './AppError.js';

export async function validateDeliveryAction(tx, delivery, input) {
  const allowed = { CORRECT_DELIVERED: ['DELIVERED'], DELIVERY_FAILED: ['DISPATCHED'], RETURNING: ['DISPATCHED', 'DELIVERY_FAILED', 'DELIVERED'], RETRY_DELIVERY: ['DELIVERY_FAILED'], REQUEST_FEE_CANCELLATION: ['REQUESTED', 'AWAITING_FEE'], CONFIRM: ['REQUESTED'], DISPATCH: ['AWAITING_FEE'], DELIVERED: ['DISPATCHED', 'DELIVERY_FAILED'], UPDATE_TRACKING: ['DISPATCHED', 'DELIVERY_FAILED', 'RETURNING'], UPDATE_DETAILS: ['REQUESTED', 'AWAITING_FEE', 'RETURNED', 'RESHIP_READY'], CANCEL: ['REQUESTED', 'AWAITING_FEE'], RETURNED: ['DISPATCHED', 'DELIVERY_FAILED', 'RETURNING', 'DELIVERED', 'RESHIP_READY'], APPROVE_RESHIPMENT: ['RESHIP_REQUESTED'], RESHIP: ['RESHIP_READY'] };
  const recoverCancelledFee = input.action === 'CONFIRM' && delivery.status === 'AWAITING_FEE' && delivery.feePaymentRequest?.status === 'CANCELLED';
  if (!recoverCancelledFee && !allowed[input.action]?.includes(delivery.status)) throw new AppError(409, `Cannot ${input.action} a ${delivery.status} delivery. Refresh and review its current status.`);
  if (input.action === 'DISPATCH') {
    for (const bill of [delivery.paymentRequest, delivery.feePaymentRequest]) {
      if (!bill || !['PAID', 'FULFILLED'].includes(bill.status) || bill.customerCancellationReason || Number(bill.amountPaid) - Number(bill.refundedAmount) < Number(bill.total)) throw new AppError(409, 'Both medicine and delivery invoices must be fully paid and verified before dispatch.');
    }
    if (delivery.paymentRequest.status !== 'PAID') throw new AppError(409, 'Medicines have already been collected.');
    if (await tx.refund.count({ where: { paymentRequestId: { in: [delivery.paymentRequestId, delivery.feePaymentRequestId] }, status: 'PENDING' } })) throw new AppError(409, 'Resolve pending refunds before dispatch.');
  }
}
