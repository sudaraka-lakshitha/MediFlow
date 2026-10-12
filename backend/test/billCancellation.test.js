import { describe, expect, it } from 'vitest';
import { billCancellationPolicy } from '../src/utils/billCancellation.js';

const admin = { id: 1, role: 'ADMIN' };
const cashier = { id: 2, role: 'CASHIER' };
const pharmacist = { id: 3, role: 'PHARMACIST', cashierAccess: false };
const tillPharmacist = { id: 4, role: 'PHARMACIST', cashierAccess: true };
const now = new Date('2026-08-07T10:00:00Z');
const awaiting = { status: 'AWAITING_PAYMENT' };
const paidToday = { status: 'PAID', paidAt: new Date('2026-08-07T09:00:00Z') };
const paidYesterday = { status: 'PAID', paidAt: new Date('2026-08-06T09:00:00Z') };

describe('withdrawing a bill nobody has paid yet', () => {
  it('lets the pharmacist who sent it pull it back without cashier access', () => {
    // Regression: this used to 403, leaving a pharmacist unable to correct a wrong bill
    // and unable to edit the prescription behind it - the only escape was rejecting it.
    expect(billCancellationPolicy(awaiting, pharmacist, now)).toMatchObject({ allowed: true, mode: 'WITHDRAW' });
  });

  it('lets cashiers and admins withdraw it too', () => {
    expect(billCancellationPolicy(awaiting, cashier, now).allowed).toBe(true);
    expect(billCancellationPolicy(awaiting, admin, now).allowed).toBe(true);
  });

  it('ignores the same-day rule because no money moved', () => {
    expect(billCancellationPolicy({ status: 'AWAITING_PAYMENT', paidAt: null }, pharmacist, now).allowed).toBe(true);
  });
});

describe('revoking a bill the customer already paid', () => {
  it('needs cashier access, so a pharmacist without it is refused', () => {
    expect(billCancellationPolicy(paidToday, pharmacist, now)).toMatchObject({ allowed: false, statusCode: 403 });
  });

  it('allows a pharmacist who has been granted till access', () => {
    expect(billCancellationPolicy(paidToday, tillPharmacist, now)).toMatchObject({ allowed: true, mode: 'REVOKE' });
  });

  it('allows the cashier on the day the payment was taken', () => {
    expect(billCancellationPolicy(paidToday, cashier, now)).toMatchObject({ allowed: true, mode: 'REVOKE' });
  });

  it('stops the cashier once the till day has rolled over', () => {
    expect(billCancellationPolicy(paidYesterday, cashier, now)).toMatchObject({ allowed: false, statusCode: 409 });
  });

  it('still lets an admin revoke an older payment', () => {
    expect(billCancellationPolicy(paidYesterday, admin, now)).toMatchObject({ allowed: true, mode: 'REVOKE' });
  });
});

describe('a bill whose customer says they have paid by bank transfer', () => {
  const slipPending = { status: 'SLIP_SUBMITTED' };

  it('can still be withdrawn, because a slip is only a claim until it is checked', () => {
    expect(billCancellationPolicy(slipPending, pharmacist, now)).toMatchObject({ allowed: true, mode: 'WITHDRAW' });
  });

  it('flags that money may already be in flight', () => {
    expect(billCancellationPolicy(slipPending, cashier, now).slipPending).toBe(true);
  });
});

describe('bills that are past the point of cancelling', () => {
  it('refuses a second cancellation', () => {
    expect(billCancellationPolicy({ status: 'CANCELLED' }, admin, now)).toMatchObject({ allowed: false, statusCode: 409 });
  });

  it('refuses once the goods have been handed over', () => {
    expect(billCancellationPolicy({ status: 'FULFILLED' }, admin, now)).toMatchObject({ allowed: false, statusCode: 409 });
  });

  it('reports a missing bill as not found', () => {
    expect(billCancellationPolicy(null, admin, now)).toMatchObject({ allowed: false, statusCode: 404 });
  });
});
