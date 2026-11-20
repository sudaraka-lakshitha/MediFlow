// DELIVERY FEE BILL
// A home delivery gets its own small bill for the courier fee, separate from the medicines.
// It can only be paid by bank transfer, so it needs a fee amount and an active pharmacy bank
// account.

import crypto from 'node:crypto';
import { AppError } from './AppError.js';

// Returns the administrator's standard delivery fee, or null when it has not
// been configured with a usable amount.
export const standardDeliveryFee = async (tx) => {
  const setting = await tx.systemSetting.findUnique({ where: { key: 'standardDeliveryFee' } });
  const fee = Number(setting?.value);
  return setting && Number.isFinite(fee) && fee > 0 && fee <= 1000000 ? fee : null;
};

// Issues the separate delivery-service invoice for a medicine bill and moves
// the delivery to AWAITING_FEE. Both bills must be paid before dispatch.
// Delivery fees are paid by bank transfer only, so an active pharmacy bank
// account must exist before a fee can be issued.
// automatic: true is used when the fee is issued together with the medicine
// bill; without a configured fee it then leaves the delivery for staff to
// confirm later instead of blocking the medicine bill.
export const issueDeliveryFeeInvoice = async (tx, { delivery, bill, actorId, automatic = false }) => {
  const fee = await standardDeliveryFee(tx);
  if (fee == null) {
    if (automatic) return null;
    throw new AppError(409, 'Ask the administrator to configure a standard delivery fee first.');
  }
  const bankAccount = await tx.bankAccount.findFirst({ where: { active: true }, select: { id: true } });
  if (!bankAccount) {
    if (automatic) return null;
    throw new AppError(409, 'Ask the administrator to add an active pharmacy bank account first. Delivery fees can only be paid by bank transfer.');
  }
  const feeBill = await tx.paymentRequest.create({ data: {
    type: 'RETAIL', requestNumber: `DEL-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
    patientId: bill.patientId, pharmacistId: actorId, subtotal: fee, total: fee,
    pharmacyNote: `Home delivery service for ${bill.requestNumber}. Pay by bank transfer before dispatch. This invoice contains no medicines.`,
  } });
  await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { feePaymentRequestId: feeBill.id, status: 'AWAITING_FEE' } });
  await tx.paymentRequestEvent.create({ data: {
    paymentRequestId: bill.id, revision: bill.revision, actorId, kind: 'DELIVERY_FEE_ISSUED',
    details: { previousFeeInvoiceId: delivery.feePaymentRequestId || null, feeInvoiceId: feeBill.id, fee: String(fee), ...(automatic ? { issuedWithMedicineBill: true } : {}) },
  } });
  return feeBill;
};
