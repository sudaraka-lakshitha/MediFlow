// Stops the same bank transfer reference being used to pay twice.

import { AppError } from './AppError.js';

// Call inside the same Serializable transaction that records the payment.
// Keep historical/cancelled payments in this check: a refund does not make the
// original bank transfer available to spend again.
export async function assertUnusedBankReference(tx, reference, { registeringLedger = false } = {}) {
  const value = reference?.trim();
  if (!value) throw new AppError(400, 'Record the bank transaction reference.');
  if (!registeringLedger && tx.bankTransfer && await tx.bankTransfer.findFirst({ where: { reference: value }, select: { id: true } })) throw new AppError(409, 'This reference is in the verified bank-transfer ledger. Allocate its remaining balance from that ledger instead of recording another payment.');
  const bill = await tx.paymentRequest.findFirst({ where: {
    paymentMethod: 'BANK_TRANSFER', paymentReference: value, paidAt: { not: null },
  }, select: { id: true } });
  const retail = await tx.salePayment.findFirst({ where: {
    method: 'BANK_TRANSFER', reference: value,
  }, select: { id: true } });
  const split = await tx.paymentRequestEvent.findFirst({ where: {
    kind: 'PAYMENT_RECEIVED', AND: [
      { details: { path: '$.splitDetails.isSplit', equals: true } },
      { details: { path: '$.splitDetails.nonCashMethod', equals: 'BANK_TRANSFER' } },
      { details: { path: '$.splitDetails.nonCashReference', equals: value } },
    ],
  }, select: { id: true } });
  if (bill || retail || split) throw new AppError(409, 'This bank transaction reference has already been used for a payment.');
  return value;
}
