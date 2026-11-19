import { Prisma } from '@prisma/client';

export const balanceItemSelect = {
  id: true, prescribedQuantity: true, dispensedQuantity: true, cancelledQuantity: true,
  product: { select: { genericName: true, strength: true, unit: true } },
};

// A walk-in bill that issues less than prescribed records, per medicine, why
// (stock or the customer's choice) and whether the rest will be issued later.
// The decision lives in the bill's event history; the latest record wins.
export const PARTIAL_SUPPLY_EVENT = 'PARTIAL_SUPPLY_RECORDED';
export const partialReasonLabels = { OUT_OF_STOCK: 'not enough stock', CANNOT_AFFORD: 'customer could not pay for all of it now', CUSTOMER_REQUEST: 'customer asked for less' };
export const latestPartialDecisions = (events = []) => {
  const latest = (events || []).filter((event) => event.kind === PARTIAL_SUPPLY_EVENT).pop();
  return new Map((latest?.details?.lines || []).map((line) => [Number(line.prescriptionItemId), line]));
};

export const medicineName = (product = {}) => `${product.genericName || 'Medicine'}${product.strength && product.strength !== 'N/A' ? ` ${product.strength}` : ''}`;

// later: prescribed quantities not on this bill and not yet supplied or closed,
// which the customer may collect on a separate bill when stock is available.
// notIssued: quantities the pharmacy recorded as not to be issued at all.
// Neither is charged on this bill. Without a bill (an invoice after dispensing)
// "later" is the prescription's current balance.
export const supplyBalance = (prescriptionItems = [], bill = null, decisions = latestPartialDecisions(bill?.events)) => {
  const later = [], notIssued = [];
  if (!prescriptionItems?.length || bill?.status === 'CANCELLED') return { later, notIssued };
  const open = bill && bill.status !== 'FULFILLED';
  for (const item of prescriptionItems) {
    const decision = decisions.get(item.id);
    const billed = open
      ? (bill.items || []).filter((line) => line.prescriptionItemId === item.id).reduce((sum, line) => sum.add(line.quantity), new Prisma.Decimal(0))
      : new Prisma.Decimal(0);
    const balance = new Prisma.Decimal(item.prescribedQuantity).sub(item.dispensedQuantity).sub(item.cancelledQuantity ?? 0).sub(billed);
    const line = (quantity) => ({
      prescriptionItemId: item.id, name: medicineName(item.product), quantity: quantity.toString(), unit: item.product?.unit || '',
      reason: decision ? partialReasonLabels[decision.reason] || null : null,
    });
    if (decision?.issueLater === false) {
      // Before dispensing it is the open shortfall; afterwards that shortfall has
      // been closed, so show the quantity recorded with the decision.
      const quantity = open ? balance : new Prisma.Decimal(decision.shortQuantity || 0);
      if (quantity.greaterThan(0)) notIssued.push(line(quantity));
    } else if (balance.greaterThan(0)) later.push(line(balance));
  }
  return { later, notIssued };
};

export const balanceToCollect = (prescriptionItems = [], bill = null) => supplyBalance(prescriptionItems, bill).later;

// Prescribed against bought, per medicine, as recorded when the bill was issued
// or last revised: "prescribed 20, bought 10 now, 10 not bought".
export const supplyRows = (events = []) => [...latestPartialDecisions(events).values()]
  .filter((line) => line.name)
  .map((line) => {
    const short = Number(line.shortQuantity || 0);
    return {
      prescriptionItemId: Number(line.prescriptionItemId), name: line.name, unit: line.unit || '',
      prescribed: String(line.prescribedQuantity), suppliedBefore: String(line.suppliedBeforeQuantity || 0),
      onThisBill: String(line.billedQuantity || 0), notBought: String(line.shortQuantity || 0),
      reason: short > 0 ? partialReasonLabels[line.reason] || null : null,
      rest: short > 0 ? (line.issueLater ? 'Collect later on a new bill' : 'Not to be issued') : null,
    };
  });
