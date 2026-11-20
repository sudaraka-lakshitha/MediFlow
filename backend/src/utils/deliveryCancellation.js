// Keeps a delivery in step when its bill is cancelled.

import { AppError } from './AppError.js';

// Run inside the invoice cancellation transaction. No payout is performed here.
export async function synchronizeDeliveryCancellation(tx, bill, user, reason, cancelFee) {
  const delivery = bill.delivery || bill.deliveryFeeFor;
  if (!delivery) return;
  if (!['REQUESTED', 'AWAITING_FEE', 'CANCELLED'].includes(delivery.status)) {
    throw new AppError(409, 'This parcel has already been dispatched. Use the returned-parcel/refund workflow instead of cancelling its invoice.');
  }
  if (bill.delivery) {
    if (delivery.feePaymentRequestId) {
      const fee = await tx.paymentRequest.findUnique({ where: { id: delivery.feePaymentRequestId } });
      if (fee && fee.status !== 'CANCELLED') await cancelFee(fee.id, `Medicine invoice cancelled: ${reason}`, user, tx);
    }
    await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: 'CANCELLED' } });
  } else if (delivery.status !== 'CANCELLED') {
    // Keep the old fee linked until staff explicitly issue a replacement.
    // That preserves both financial history and the switch-to-collection path.
    await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: 'REQUESTED' } });
  }
  await tx.paymentRequestEvent.create({ data: {
    paymentRequestId: delivery.paymentRequestId, actorId: user.id,
    revision: bill.delivery ? bill.revision : (await tx.paymentRequest.findUnique({ where: { id: delivery.paymentRequestId }, select: { revision: true } }))?.revision,
    kind: bill.delivery ? 'DELIVERY_CANCELLED_WITH_INVOICE' : 'DELIVERY_FEE_CANCELLED',
    details: { reason, cancelledInvoiceId: bill.id, deliveryId: delivery.id, previousStatus: delivery.status },
  } });
}
