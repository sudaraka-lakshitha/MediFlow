import { Prisma } from '@prisma/client';

// Informational totals only: never use "not supplied" to reopen a cancelled bill.
export const prescriptionSupplySummary = (item, events = []) => {
  const notSupplied = Prisma.Decimal.max(0, new Prisma.Decimal(item.prescribedQuantity).sub(item.dispensedQuantity));
  const pending = Prisma.Decimal.max(0, notSupplied.sub(item.cancelledQuantity || 0));
  const reasons = [];
  if (Number(item.cancelledQuantity) > 0) {
    for (const event of events) {
      const details = event.details || {};
      const removed = details.removedItems?.some(line => Number(line.prescriptionItemId) === item.id);
      const before = details.previous?.items?.find(line => Number(line.prescriptionItemId) === item.id);
      const after = details.current?.items?.find(line => Number(line.prescriptionItemId) === item.id);
      // Old events have no IDs in removedItems; their revision snapshots do.
      const reduced = details.removedItems && before && Number(before.quantity) > Number(after?.quantity || 0);
      if ((removed || reduced) && details.reason) reasons.push(details.reason);
    }
    // Legacy records may only retain a cancellation note. Do not expose unrelated notes.
    if (!reasons.length) {
      for (const note of (item.notes || '').split(' | ')) {
        if (note.startsWith('Cancelled from bill: ')) reasons.push(note.slice('Cancelled from bill: '.length));
      }
    }
  }
  return { notSuppliedQuantity: notSupplied.toString(), pendingQuantity: pending.toString(), cancellationReasons: [...new Set(reasons)] };
};
