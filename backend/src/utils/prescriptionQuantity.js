import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';

export const remainingPrescriptionQuantity = (item) => new Prisma.Decimal(item.prescribedQuantity)
  .sub(item.dispensedQuantity).sub(item.cancelledQuantity ?? 0);

// Cancelling a bill line never represents a physical supply of medicine.
export const cancelPrescriptionQuantity = async (tx, line, reason) => {
  const item = await tx.prescriptionItem.findUnique({ where: { id: line.prescriptionItemId } });
  if (!item) throw new AppError(409, 'The prescription item no longer exists. Refresh and try again.');
  const quantity = new Prisma.Decimal(line.quantity);
  if (!quantity.greaterThan(0) || quantity.greaterThan(remainingPrescriptionQuantity(item))) {
    throw new AppError(409, 'Cancelled quantity exceeds the remaining prescription quantity.');
  }
  const note = `Cancelled from bill: ${reason}`;
  const updated = await tx.prescriptionItem.updateMany({
    where: { id: item.id, dispensedQuantity: item.dispensedQuantity, cancelledQuantity: item.cancelledQuantity ?? 0 },
    data: { cancelledQuantity: { increment: quantity }, notes: (item.notes ? `${item.notes} | ${note}` : note).slice(0, 300) },
  });
  if (updated.count !== 1) throw new AppError(409, 'The prescription quantity changed. Refresh and try again.');
};
