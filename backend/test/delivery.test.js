import { beforeEach, expect, it, vi } from 'vitest';
const { tx, dispense } = vi.hoisted(() => {
  const model = () => ({ findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), count: vi.fn() });
  return { tx: { paymentRequest: model(), deliveryRequest: model(), systemSetting: model(), refund: model(), sale: model(), paymentRequestEvent: model(), bankAccount: { ...model(), findFirst: vi.fn() } }, dispense: vi.fn() };
});
vi.mock('../src/config/prisma.js', () => ({ prisma: tx }));
vi.mock('../src/utils/serializable.js', () => ({ serializable: fn => fn(tx), stockFulfillmentTransactionOptions: {} }));
vi.mock('../src/utils/prescriptionDispense.js', () => ({ performPrescriptionDispense: dispense }));
vi.mock('../src/services/paymentRequest.service.js', () => ({ paymentRequestService: { cancel: vi.fn() } }));
import { deliveryService } from '../src/services/delivery.service.js';
const user = { id: 7, role: 'PATIENT' };
const staff = { id: 8, role: 'PHARMACIST' };
const dispatchInput = { action: 'DISPATCH', trackingReference: 'Courier 123', courierService: 'Test Courier' };
const bill = { id: 1, patientId: 7, prescriptionId: 3, status: 'PAID', amountPaid: 100, refundedAmount: 0, total: 100, revision: 1 };
const fee = { id: 2, patientId: 7, status: 'PAID', subtotal: 50, total: 50, amountPaid: 50, refundedAmount: 0, cashierId: 8, paymentMethod: 'BANK_TRANSFER' };
beforeEach(() => { vi.resetAllMocks(); tx.refund.count.mockResolvedValue(0); tx.paymentRequest.findUnique.mockResolvedValue(bill); tx.bankAccount.findFirst.mockResolvedValue({ id: 1 }); });
it('limits patient delivery listing to their own invoices', async () => {
  tx.deliveryRequest.findMany.mockResolvedValue([]);
  await deliveryService.list(user);
  expect(tx.deliveryRequest.findMany.mock.calls[0][0].where).toEqual({ paymentRequest: { patientId: 7 } });
});
it('filters deliveries on the server without removing patient ownership', async () => {
  tx.deliveryRequest.findMany.mockResolvedValue([]);
  await deliveryService.list(user, { page: 2, pageSize: 20, search: 'TRACK', courier: 'Courier', dateField: 'dispatchedAt', from: '2026-10-01T00:00:00Z', to: '2026-11-01T00:00:00Z' });
  expect(tx.deliveryRequest.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 20, take: 20, where: expect.objectContaining({ paymentRequest: { patientId: 7 }, courierService: 'Courier', dispatchedAt: { gte: new Date('2026-10-01'), lt: new Date('2026-11-01') }, OR: expect.any(Array) }) }));
});
it('rejects another patient invoice', async () => {
  await expect(deliveryService.request(1, {}, { ...user, id: 9 })).rejects.toMatchObject({ statusCode: 404 });
});
it.each(['AWAITING_PAYMENT', 'SLIP_SUBMITTED', 'FULFILLED', 'CANCELLED'])('rejects delivery when medicines are %s', async status => {
  tx.paymentRequest.findUnique.mockResolvedValue({ ...bill, status });
  await expect(deliveryService.request(1, {}, user)).rejects.toMatchObject({ statusCode: 409 });
});
it('rejects duplicate requests', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4 });
  await expect(deliveryService.request(1, {}, user)).rejects.toMatchObject({ statusCode: 409 });
});
it('reopens an undispatched cancelled delivery without deleting its fee history', async () => {
  const previous = { id: 4, status: 'CANCELLED', feePaymentRequestId: 2, feePaymentRequest: { ...fee, status: 'CANCELLED' }, recipientName: 'Old Recipient', address: 'Old address', phone: '0701234567' };
  const details = { recipientName: 'New Recipient', address: 'New delivery address', phone: '+94701234567' };
  tx.deliveryRequest.findUnique.mockResolvedValue(previous);
  tx.deliveryRequest.update.mockResolvedValue({ ...previous, ...details, status: 'REQUESTED' });
  await deliveryService.request(1, details, user);
  expect(tx.deliveryRequest.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 4 }, data: { ...details, status: 'REQUESTED' } }));
  expect(tx.deliveryRequest.create).not.toHaveBeenCalled();
  expect(tx.paymentRequest.create).not.toHaveBeenCalled();
  expect(tx.paymentRequestEvent.create).toHaveBeenCalledWith({ data: expect.objectContaining({ kind: 'DELIVERY_REQUESTED_AGAIN', details: expect.objectContaining({ previousFeeInvoiceId: 2, previousAddress: 'Old address', ...details }) }) });
});
it.each(['PAID', 'AWAITING_PAYMENT', 'FULFILLED'])('blocks reopening when the previous fee is still %s', async status => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'CANCELLED', feePaymentRequest: { ...fee, status } });
  await expect(deliveryService.request(1, {}, user)).rejects.toMatchObject({ statusCode: 409 });
  expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
});
it('does not reopen a parcel with a dispatch history', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'CANCELLED', dispatchedAt: new Date() });
  await expect(deliveryService.request(1, {}, user)).rejects.toThrow('previously dispatched');
  expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
});
it('blocks a repeat delivery until previous fee and medicine refunds are resolved', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'CANCELLED', feePaymentRequestId: 2, feePaymentRequest: { ...fee, status: 'CANCELLED' } });
  tx.refund.count.mockResolvedValue(1);
  await expect(deliveryService.request(1, {}, user)).rejects.toThrow('outstanding refunds');
  expect(tx.refund.count).toHaveBeenCalledWith({ where: { paymentRequestId: { in: [1, 2] }, status: { in: ['PENDING', 'AWAITING_APPROVAL'] } } });
  expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
});
it('creates a first delivery when no previous request exists', async () => {
  tx.deliveryRequest.create.mockResolvedValue({ id: 4 });
  await deliveryService.request(1, { recipientName: 'Patient', address: 'Delivery address', phone: '0701234567' }, user);
  expect(tx.deliveryRequest.create).toHaveBeenCalled();
  expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
  // Delivery orders do not use a collection PIN; the one from payment is withdrawn.
  expect(tx.paymentRequest.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { pickupPinHash: null, pickupPinEncrypted: null, pinAttempts: 0 } });
});
it('issues a collection PIN when staff cancel a paid delivery for counter collection', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'AWAITING_FEE', paymentRequest: { ...bill, pickupPinHash: null }, feePaymentRequest: null });
  await deliveryService.act(1, { action: 'CANCEL' }, staff);
  expect(tx.deliveryRequest.update).toHaveBeenCalledWith({ where: { id: 4 }, data: { status: 'CANCELLED' } });
  expect(tx.paymentRequest.update).toHaveBeenCalledWith({ where: { id: 1 }, data: expect.objectContaining({ pickupPinHash: expect.any(String), pickupPinEncrypted: expect.any(String), pinAttempts: 0 }) });
});
it('issues no PIN when an unpaid delivery is cancelled', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'REQUESTED', paymentRequest: { ...bill, status: 'AWAITING_PAYMENT', pickupPinHash: null }, feePaymentRequest: null });
  await deliveryService.act(1, { action: 'CANCEL' }, staff);
  expect(tx.paymentRequest.update).not.toHaveBeenCalled();
});
it('requires an admin-configured fee', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ status: 'REQUESTED', paymentRequest: bill });
  await expect(deliveryService.act(1, { action: 'CONFIRM' }, staff)).rejects.toMatchObject({ statusCode: 409 });
  expect(tx.paymentRequest.create).not.toHaveBeenCalled();
});
it('lets a pharmacist request paid-fee cancellation without refunding or cancelling the invoice', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'AWAITING_FEE', paymentRequest: bill, feePaymentRequest: { ...fee, revision: 1 } });
  await deliveryService.act(1, { action: 'REQUEST_FEE_CANCELLATION', reason: 'Customer will collect instead' }, staff);
  expect(tx.paymentRequest.update).toHaveBeenCalledWith({ where: { id: 2 }, data: { customerCancellationReason: 'Customer will collect instead' } });
  expect(tx.paymentRequestEvent.create).toHaveBeenCalledWith({ data: expect.objectContaining({ paymentRequestId: 2, kind: 'CANCELLATION_REQUESTED', details: expect.objectContaining({ requestedByStaff: true, deliveryId: 4 }) }) });
  expect(tx.deliveryRequest.update.mock.calls[0][0].data).not.toHaveProperty('status');
  expect(tx.refund.create).not.toHaveBeenCalled();
  expect(dispense).not.toHaveBeenCalled();
});
it.each(['DISPATCHED', 'DELIVERED', 'RETURNED', 'CANCELLED'])('blocks fee cancellation requests for %s parcels', async status => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ status, paymentRequest: bill, feePaymentRequest: fee });
  await expect(deliveryService.act(1, { action: 'REQUEST_FEE_CANCELLATION', reason: 'Cancel please' }, staff)).rejects.toMatchObject({ statusCode: 409 });
  expect(tx.paymentRequest.update).not.toHaveBeenCalled();
});
it('does not overwrite an existing cancellation request', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ status: 'AWAITING_FEE', paymentRequest: bill, feePaymentRequest: { ...fee, customerCancellationReason: 'Original reason' } });
  await expect(deliveryService.act(1, { action: 'REQUEST_FEE_CANCELLATION', reason: 'New reason' }, staff)).rejects.toThrow('already exists');
  expect(tx.paymentRequest.update).not.toHaveBeenCalled();
});
it('blocks dispatch while paid-fee cancellation is awaiting review', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ status: 'AWAITING_FEE', paymentRequest: bill, feePaymentRequest: { ...fee, customerCancellationReason: 'Collect instead' } });
  await expect(deliveryService.act(1, dispatchInput, staff)).rejects.toMatchObject({ statusCode: 409 });
  expect(dispense).not.toHaveBeenCalled();
});
it('creates one separately payable delivery invoice', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'REQUESTED', paymentRequest: bill });
  tx.systemSetting.findUnique.mockResolvedValue({ value: '250' });
  tx.paymentRequest.create.mockResolvedValue({ id: 2 });
  await deliveryService.act(1, { action: 'CONFIRM' }, staff);
  expect(tx.paymentRequest.create.mock.calls[0][0].data).toMatchObject({ patientId: 7, subtotal: 250, total: 250 });
  expect(tx.deliveryRequest.update.mock.calls[0][0].data).toEqual({ feePaymentRequestId: 2, status: 'AWAITING_FEE' });
});
it.each(['AWAITING_PAYMENT', 'SLIP_SUBMITTED'])('issues the delivery fee before a %s medicine bill is paid', async status => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'REQUESTED', paymentRequest: { ...bill, status, amountPaid: 0 } });
  tx.systemSetting.findUnique.mockResolvedValue({ value: '250' });
  tx.paymentRequest.create.mockResolvedValue({ id: 2 });
  await deliveryService.act(1, { action: 'CONFIRM' }, staff);
  expect(tx.deliveryRequest.update.mock.calls[0][0].data).toEqual({ feePaymentRequestId: 2, status: 'AWAITING_FEE' });
});
it.each([['CANCELLED', null], ['FULFILLED', null], ['AWAITING_PAYMENT', 'Customer asked to cancel']])('does not issue a delivery fee for a %s medicine bill (cancellation: %s)', async (status, customerCancellationReason) => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'REQUESTED', paymentRequest: { ...bill, status, customerCancellationReason } });
  tx.systemSetting.findUnique.mockResolvedValue({ value: '250' });
  await expect(deliveryService.act(1, { action: 'CONFIRM' }, staff)).rejects.toMatchObject({ statusCode: 409 });
  expect(tx.paymentRequest.create).not.toHaveBeenCalled();
});
it('does not issue a delivery fee that nobody could pay by bank transfer', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'REQUESTED', paymentRequest: bill });
  tx.systemSetting.findUnique.mockResolvedValue({ value: '250' });
  tx.bankAccount.findFirst.mockResolvedValue(null);
  await expect(deliveryService.act(1, { action: 'CONFIRM' }, staff)).rejects.toThrow('bank transfer');
  expect(tx.paymentRequest.create).not.toHaveBeenCalled();
});
it('still requires a fully paid medicine bill when it is marked paid', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'REQUESTED', paymentRequest: { ...bill, amountPaid: 100, refundedAmount: 40 } });
  tx.systemSetting.findUnique.mockResolvedValue({ value: '250' });
  await expect(deliveryService.act(1, { action: 'CONFIRM' }, staff)).rejects.toMatchObject({ statusCode: 409 });
  expect(tx.paymentRequest.create).not.toHaveBeenCalled();
});
it.each(['REQUESTED', 'AWAITING_FEE'])('reissues a cancelled fee while preserving its history (%s)', async status => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status, paymentRequest: bill, feePaymentRequestId: 2, feePaymentRequest: { ...fee, status: 'CANCELLED' } });
  tx.systemSetting.findUnique.mockResolvedValue({ value: '250' });
  tx.paymentRequest.create.mockResolvedValue({ id: 3 });
  await deliveryService.act(1, { action: 'CONFIRM' }, staff);
  expect(tx.deliveryRequest.update).toHaveBeenCalledWith({ where: { id: 4 }, data: { feePaymentRequestId: 3, status: 'AWAITING_FEE' } });
  expect(tx.paymentRequestEvent.create).toHaveBeenCalledWith({ data: expect.objectContaining({ kind: 'DELIVERY_FEE_ISSUED', details: { previousFeeInvoiceId: 2, feeInvoiceId: 3, fee: '250' } }) });
});
it('does not reissue a fee before its previous refund is settled', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'REQUESTED', paymentRequest: bill, feePaymentRequestId: 2, feePaymentRequest: { ...fee, status: 'CANCELLED' } });
  tx.refund.count.mockResolvedValue(1);
  await expect(deliveryService.act(1, { action: 'CONFIRM' }, staff)).rejects.toThrow('Settle the previous');
  expect(tx.paymentRequest.create).not.toHaveBeenCalled();
});
it.each(['AWAITING_PAYMENT', 'SLIP_SUBMITTED', 'CANCELLED'])('blocks dispatch when fee is %s', async status => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ status: 'AWAITING_FEE', paymentRequest: bill, feePaymentRequest: { ...fee, status } });
  await expect(deliveryService.act(1, dispatchInput, staff)).rejects.toMatchObject({ statusCode: 409 });
  expect(dispense).not.toHaveBeenCalled();
});
it('blocks dispatch while a refund is pending', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ status: 'AWAITING_FEE', paymentRequest: bill, feePaymentRequest: fee });
  tx.refund.count.mockResolvedValue(1);
  await expect(deliveryService.act(1, dispatchInput, staff)).rejects.toMatchObject({ statusCode: 409 });
  expect(dispense).not.toHaveBeenCalled();
});
it('dispatches through stock dispensing and records the service sale', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'AWAITING_FEE', paymentRequest: bill, feePaymentRequest: fee });
  await deliveryService.act(1, dispatchInput, staff);
  expect(dispense).toHaveBeenCalledWith(tx, expect.objectContaining({ deliveryDispatch: true, paymentRequestId: 1 }));
  expect(tx.sale.create.mock.calls[0][0].data).toMatchObject({ paymentRequestId: 2, total: 50, status: 'PAID' });
  expect(tx.deliveryRequest.update.mock.calls[0][0].data).toMatchObject({ status: 'DISPATCHED', courierService: 'Test Courier', dispatchedAt: expect.any(Date) });
});
it('preserves the original dispatch timestamp when tracking is corrected', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'DISPATCHED', paymentRequest: bill, dispatchedAt: new Date() });
  await deliveryService.act(1, { ...dispatchInput, action: 'UPDATE_TRACKING' }, staff);
  expect(tx.deliveryRequest.update.mock.calls[0][0].data).not.toHaveProperty('dispatchedAt');
  expect(dispense).not.toHaveBeenCalled();
});
it('requires courier and tracking details', async () => {
  await expect(deliveryService.act(1, { action: 'DISPATCH' }, staff)).rejects.toMatchObject({ statusCode: 400 });
});
it.each(['CONFIRM', 'CANCEL', 'DELIVERED', 'DISPATCH', 'UPDATE_TRACKING', 'UPDATE_DETAILS', 'RETURNED', 'APPROVE_RESHIPMENT', 'RESHIP'])('rejects stale %s without modifying records', async action => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, updatedAt: new Date('2026-10-25T06:01:00Z'), paymentRequest: bill });
  await expect(deliveryService.act(1, { ...dispatchInput, action, expectedUpdatedAt: '2026-10-25T06:00:00.000Z' }, staff)).rejects.toThrow('Delivery details changed');
  expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
  expect(tx.paymentRequest.create).not.toHaveBeenCalled();
  expect(tx.paymentRequest.update).not.toHaveBeenCalled();
  expect(tx.paymentRequestEvent.create).not.toHaveBeenCalled();
  expect(dispense).not.toHaveBeenCalled();
});
it('does not allow patients or cashiers to dispatch', async () => {
  await expect(deliveryService.act(1, dispatchInput, user)).rejects.toMatchObject({ statusCode: 403 });
  await expect(deliveryService.act(1, dispatchInput, { id: 8, role: 'CASHIER' })).rejects.toMatchObject({ statusCode: 403 });
});
const returned = () => ({ id: 4, paymentRequestId: 1, status: 'RETURNED', shipmentAttempt: 1, paymentRequest: { ...bill, status: 'FULFILLED' }, dispatchedAt: new Date('2026-10-01'), returnedAt: new Date('2026-10-02'), trackingReference: 'OLD123', courierService: 'Old Courier' });
it('corrects mistaken delivery with an audited previous timestamp and no financial or stock changes', async () => {
  const deliveredAt = new Date('2026-10-03T12:00:00Z');
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status: 'DELIVERED', deliveredAt });
  await deliveryService.act(1, { action: 'CORRECT_DELIVERED', reason: 'Courier confirms parcel still in transit' }, staff);
  expect(tx.deliveryRequest.update).toHaveBeenCalledWith({ where: { id: 4 }, data: { status: 'DISPATCHED', deliveredAt: null } });
  expect(tx.paymentRequestEvent.create).toHaveBeenCalledWith({ data: expect.objectContaining({ kind: 'DELIVERY_CORRECT_DELIVERED', details: expect.objectContaining({ previousStatus: 'DELIVERED', previousDeliveredAt: deliveredAt.toISOString() }) }) });
  expect(dispense).not.toHaveBeenCalled();
  expect(tx.paymentRequest.update).not.toHaveBeenCalled();
  expect(tx.sale.create).not.toHaveBeenCalled();
});
it('rejects correcting delivered status without a reason', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status: 'DELIVERED' });
  await expect(deliveryService.act(1, { action: 'CORRECT_DELIVERED' }, staff)).rejects.toMatchObject({ statusCode: 400 });
  expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
});
it('blocks correcting delivered status after a product refund authorization', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status: 'DELIVERED' });
  tx.refund.count.mockResolvedValue(1);
  await expect(deliveryService.act(1, { action: 'CORRECT_DELIVERED', reason: 'Incorrect update' }, staff)).rejects.toThrow('product refund exists');
  expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
});
it.each(['DISPATCHED', 'RETURNED', 'RETURNING', 'CANCELLED'])('cannot use delivered correction for %s', async status => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status });
  await expect(deliveryService.act(1, { action: 'CORRECT_DELIVERED', reason: 'Incorrect update' }, staff)).rejects.toMatchObject({ statusCode: 409 });
  expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
});
it.each([['DISPATCHED', 'DELIVERY_FAILED', 'DELIVERY_FAILED'], ['DELIVERY_FAILED', 'RETURNING', 'RETURNING'], ['DELIVERY_FAILED', 'RETRY_DELIVERY', 'DISPATCHED']])('records %s to %s without stock or financial changes', async (status, action, target) => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status });
  await deliveryService.act(1, { action, reason: 'Courier confirmed recipient unavailable' }, staff);
  expect(tx.deliveryRequest.update).toHaveBeenCalledWith({ where: { id: 4 }, data: { status: target } });
  expect(tx.paymentRequest.update).not.toHaveBeenCalled();
  expect(tx.sale.create).not.toHaveBeenCalled();
  expect(dispense).not.toHaveBeenCalled();
  expect(tx.paymentRequestEvent.create).toHaveBeenCalledWith({ data: expect.objectContaining({ kind: `DELIVERY_${action}`, details: expect.objectContaining({ reason: 'Courier confirmed recipient unavailable' }) }) });
});
it.each(['DELIVERY_FAILED', 'RETURNING'])('requires physical return before free reshipment from %s', async status => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status });
  await expect(deliveryService.requestReshipment(1, user)).rejects.toThrow('first confirm');
  expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
});
it('blocks courier retry once a parcel is returning', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status: 'RETURNING' });
  await expect(deliveryService.act(1, { action: 'RETRY_DELIVERY', reason: 'Try again' }, staff)).rejects.toMatchObject({ statusCode: 409 });
});
it('requires a reason for failed delivery updates', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status: 'DISPATCHED' });
  await expect(deliveryService.act(1, { action: 'DELIVERY_FAILED' }, staff)).rejects.toMatchObject({ statusCode: 400 });
});
it('confirms physical receipt of a returning parcel', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status: 'RETURNING' });
  await deliveryService.act(1, { action: 'RETURNED', reason: 'Parcel received and checked' }, staff);
  expect(tx.deliveryRequest.update).toHaveBeenCalledWith({ where: { id: 4 }, data: expect.objectContaining({ status: 'RETURNED', returnedAt: expect.any(Date) }) });
  expect(dispense).not.toHaveBeenCalled();
});
const safeParcel = () => tx.sale.findUnique.mockResolvedValue({ items: [{ id: 1, quantity: 10, batch: { restricted: false, expiryDate: new Date('2099-01-01') } }] });
it('records physical returns without restoring stock or refunding the fee', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status: 'DISPATCHED' });
  await deliveryService.act(1, { action: 'RETURNED', reason: 'Recipient unavailable' }, staff);
  expect(tx.deliveryRequest.update).toHaveBeenCalledWith({ where: { id: 4 }, data: { status: 'RETURNED', returnedAt: expect.any(Date), returnReason: 'Recipient unavailable' } });
  expect(tx.paymentRequest.update).not.toHaveBeenCalled(); expect(dispense).not.toHaveBeenCalled();
});
it('lets only the owner request free reshipment of a returned parcel', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue(returned()); safeParcel();
  await expect(deliveryService.requestReshipment(1, { ...user, id: 99 })).rejects.toMatchObject({ statusCode: 404 });
  await deliveryService.requestReshipment(1, user);
  expect(tx.deliveryRequest.update).toHaveBeenCalledWith({ where: { id: 4 }, data: { status: 'RESHIP_REQUESTED' } });
  expect(tx.paymentRequest.create).not.toHaveBeenCalled();
});
it('requires explicit pharmacist inspection', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status: 'RESHIP_REQUESTED' }); safeParcel();
  await expect(deliveryService.act(1, { action: 'APPROVE_RESHIPMENT', reason: 'Checked packaging' }, staff)).rejects.toMatchObject({ statusCode: 400 });
  await deliveryService.act(1, { action: 'APPROVE_RESHIPMENT', reason: 'Checked packaging', inspectionConfirmed: true }, staff);
  expect(tx.deliveryRequest.update).toHaveBeenCalledWith({ where: { id: 4 }, data: { status: 'RESHIP_READY' } });
});
it('reships the same parcel without another stock deduction, sale or fee', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status: 'RESHIP_READY' }); safeParcel();
  await deliveryService.act(1, { action: 'RESHIP', trackingReference: 'NEW123', courierService: 'New Courier' }, staff);
  expect(dispense).not.toHaveBeenCalled(); expect(tx.sale.create).not.toHaveBeenCalled(); expect(tx.paymentRequest.create).not.toHaveBeenCalled();
  expect(tx.deliveryRequest.update).toHaveBeenCalledWith({ where: { id: 4 }, data: expect.objectContaining({ status: 'DISPATCHED', shipmentAttempt: { increment: 1 }, dispatchedAt: expect.any(Date) }) });
  expect(tx.paymentRequestEvent.create.mock.calls[0][0].data.details).toMatchObject({ previousTrackingReference: 'OLD123', previousDispatchedAt: '2026-10-01T00:00:00.000Z' });
});
it('blocks reshipment when all products have been refunded', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status: 'RESHIP_READY' });
  tx.sale.findUnique.mockResolvedValue({ items: [{ id: 1, quantity: 10 }], refunds: [{ lines: [{ saleItemId: 1, quantity: 10 }] }] });
  await expect(deliveryService.act(1, { action: 'RESHIP', trackingReference: 'NEW123', courierService: 'New Courier' }, staff)).rejects.toThrow('No unrefunded');
  expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
});
it('records only the unrefunded quantities on a partial reshipment', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status: 'RESHIP_READY' });
  tx.sale.findUnique.mockResolvedValue({ items: [{ id: 1, quantity: 10, productId: 2, batchId: 3, product: { genericName: 'Example', unit: 'tablet' }, batch: { restricted: false, expiryDate: new Date('2099-01-01'), batchNumber: 'B1' } }], refunds: [{ lines: [{ saleItemId: 1, quantity: 3 }] }] });
  await deliveryService.act(1, { action: 'RESHIP', trackingReference: 'NEW123', courierService: 'New Courier' }, staff);
  expect(tx.paymentRequestEvent.create.mock.calls[0][0].data.details.items).toEqual([expect.objectContaining({ saleItemId: 1, quantity: '7', refundedQuantity: '3' })]);
  expect(dispense).not.toHaveBeenCalled(); expect(tx.sale.create).not.toHaveBeenCalled(); expect(tx.paymentRequest.create).not.toHaveBeenCalled();
});
it.each([{ restricted: true, expiryDate: new Date('2099-01-01') }, { restricted: false, expiryDate: new Date('2020-01-01') }])('blocks unsuitable returned batches', async batch => {
  tx.deliveryRequest.findUnique.mockResolvedValue(returned()); tx.sale.findUnique.mockResolvedValue({ items: [{ id: 1, quantity: 10, batch }] });
  await expect(deliveryService.requestReshipment(1, user)).rejects.toThrow('cannot be reshipped');
});
it('allows withdrawing reshipment before dispatch, but not afterward', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status: 'RESHIP_READY' });
  await deliveryService.requestReshipment(1, user, true);
  expect(tx.deliveryRequest.update).toHaveBeenCalledWith({ where: { id: 4 }, data: { status: 'RETURNED' } });
  tx.deliveryRequest.findUnique.mockResolvedValue({ ...returned(), status: 'DISPATCHED' });
  await expect(deliveryService.requestReshipment(1, user, true)).rejects.toMatchObject({ statusCode: 409 });
});
