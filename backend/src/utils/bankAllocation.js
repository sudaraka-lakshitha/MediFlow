import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';

// A transfer is consumed permanently. Refunding an invoice never restores its
// available balance; a refund is a separate outgoing transaction.
export async function allocateVerifiedTransfer(tx, transferId, bill, actorId) {
  const transfer = await tx.bankTransfer.findUnique({ where: { id: transferId } });
  if (!transfer || transfer.patientId !== bill.patientId) throw new AppError(409, 'Choose a verified transfer for this customer.');
  const amount = new Prisma.Decimal(bill.total);
  if (!amount.greaterThan(0)) throw new AppError(409, 'This invoice does not require a bank payment.');
  const claimed = await tx.bankTransfer.updateMany({ where: { id: transferId, availableAmount: { gte: amount } }, data: { availableAmount: { decrement: amount } } });
  if (claimed.count !== 1) throw new AppError(409, 'The transfer balance is insufficient or was allocated by another cashier. Refresh before continuing.');
  await tx.bankTransferAllocation.create({ data: { transferId, paymentRequestId: bill.id, revision: bill.revision, amount, allocatedById: actorId } });
  return { reference: `BT#${transfer.id}: ${transfer.reference}`, transfer };
}
