import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';

// History belongs to a prescription line, not to its current position in a form.
export const planPrescriptionItems = (existing, proposed, inputs) => {
  const used = new Set();
  const updates = [];
  const creates = [];
  for (let index = 0; index < proposed.length; index += 1) {
    const value = proposed[index];
    const candidates = existing.filter((item) => !used.has(item.id) && item.productId === value.productId);
    const previous = inputs[index].id
      ? existing.find((item) => item.id === Number(inputs[index].id) && item.productId === value.productId && !used.has(item.id))
      : candidates.length === 1 ? candidates[0] : null;
    if (inputs[index].id && !previous) throw new AppError(409, 'A prescription line changed. Refresh before editing it.');
    if (!previous && candidates.length > 1) throw new AppError(409, 'Refresh this prescription to identify its duplicate medicine lines.');
    if (previous) {
      const historical = new Prisma.Decimal(previous.cancelledQuantity || 0).add(previous.dispensedQuantity || 0);
      if (historical.greaterThan(value.prescribedQuantity)) throw new AppError(409, 'The prescribed quantity cannot be smaller than the already cancelled or dispensed quantity.');
      used.add(previous.id);
      updates.push({ id: previous.id, data: value });
    } else creates.push(value);
  }
  const removed = existing.filter((item) => !used.has(item.id));
  if (removed.some((item) => Number(item.cancelledQuantity) > 0 || Number(item.dispensedQuantity) > 0)) throw new AppError(409, 'Keep medicine lines with cancellation or dispensing history. Record any new medicine as a separate line.');
  return { updates, creates, removed: removed.map((item) => item.id) };
};
