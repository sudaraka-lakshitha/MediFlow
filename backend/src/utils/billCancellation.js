import { isSameLocalDay } from './localDate.js';

// Cancelling a bill covers two different real-world actions that happen to share one end
// state (CANCELLED):
//   WITHDRAW - the bill was sent to the cashier by mistake and nobody has paid yet. Whoever
//              works the prescription desk can pull it back; no money is involved.
//   REVOKE   - the customer already paid, so cash has to be handed back. That is a till
//              operation, so it needs cashier access and (except for an admin) has to happen
//              on the same day the payment was taken, while the drawer still reconciles.
// Kept as a pure function so the policy can be unit-tested without a database.
export const billCancellationPolicy = (bill, user, now = new Date()) => {
  if (!bill) return { allowed: false, statusCode: 404, message: 'Payment request not found.' };

  if (bill.status === 'CANCELLED') {
    return { allowed: false, statusCode: 409, message: 'This bill has already been cancelled.' };
  }
  if (!['AWAITING_PAYMENT', 'PAID'].includes(bill.status)) {
    return { allowed: false, statusCode: 409, message: 'This bill has already been dispensed or handed over, so it can no longer be cancelled.' };
  }

  if (bill.status === 'AWAITING_PAYMENT') return { allowed: true, mode: 'WITHDRAW' };

  const canRevokePayment = user.role === 'ADMIN'
    || user.role === 'CASHIER'
    || (user.role === 'PHARMACIST' && user.cashierAccess);
  if (!canRevokePayment) {
    return { allowed: false, statusCode: 403, message: 'Revoking a paid bill needs cashier access. Ask an administrator, or ask the cashier to revoke it.' };
  }
  if (user.role !== 'ADMIN' && (!bill.paidAt || !isSameLocalDay(bill.paidAt, now))) {
    return { allowed: false, statusCode: 409, message: 'This bill can only be revoked on the same day it was paid.' };
  }
  return { allowed: true, mode: 'REVOKE' };
};
