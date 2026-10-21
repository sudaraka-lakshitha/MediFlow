import { beforeEach, expect, it, vi } from 'vitest';
const { tx, dispense } = vi.hoisted(() => {
  const model = () => ({ findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), count: vi.fn() });
  return { tx: { paymentRequest: model(), deliveryRequest: model(), systemSetting: model(), refund: model(), sale: model(), paymentRequestEvent: model() }, dispense: vi.fn() };
});
vi.mock('../src/config/prisma.js', () => ({ prisma: tx }));
vi.mock('../src/utils/serializable.js', () => ({ serializable: fn => fn(tx) }));
vi.mock('../src/utils/prescriptionDispense.js', () => ({ performPrescriptionDispense: dispense }));
vi.mock('../src/services/paymentRequest.service.js', () => ({ paymentRequestService: { cancel: vi.fn() } }));
import { deliveryService } from '../src/services/delivery.service.js';
const user = { id: 7, role: 'PATIENT' };
const staff = { id: 8, role: 'PHARMACIST' };
const dispatchInput = { action: 'DISPATCH', trackingReference: 'Courier 123', courierService: 'Test Courier' };
const bill = { id: 1, patientId: 7, prescriptionId: 3, status: 'PAID', amountPaid: 100, refundedAmount: 0, total: 100, revision: 1 };
const fee = { id: 2, patientId: 7, status: 'PAID', subtotal: 50, total: 50, amountPaid: 50, refundedAmount: 0, cashierId: 8, paymentMethod: 'BANK_TRANSFER' };
beforeEach(() => { vi.resetAllMocks(); tx.refund.count.mockResolvedValue(0); tx.paymentRequest.findUnique.mockResolvedValue(bill); });
it('limits patient delivery listing to their own invoices', () => {
  deliveryService.list(user);
  expect(tx.deliveryRequest.findMany.mock.calls[0][0].where).toEqual({ paymentRequest: { patientId: 7 } });
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
it('requires an admin-configured fee', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ status: 'REQUESTED', paymentRequest: bill });
  await expect(deliveryService.act(1, { action: 'CONFIRM' }, staff)).rejects.toMatchObject({ statusCode: 409 });
  expect(tx.paymentRequest.create).not.toHaveBeenCalled();
});
it('creates one separately payable delivery invoice', async () => {
  tx.deliveryRequest.findUnique.mockResolvedValue({ id: 4, status: 'REQUESTED', paymentRequest: bill });
  tx.systemSetting.findUnique.mockResolvedValue({ value: '250' });
  tx.paymentRequest.create.mockResolvedValue({ id: 2 });
  await deliveryService.act(1, { action: 'CONFIRM' }, staff);
  expect(tx.paymentRequest.create.mock.calls[0][0].data).toMatchObject({ patientId: 7, subtotal: 250, total: 250 });
  expect(tx.deliveryRequest.update.mock.calls[0][0].data).toEqual({ feePaymentRequestId: 2, status: 'AWAITING_FEE' });
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
it('does not allow patients or cashiers to dispatch', async () => {
  await expect(deliveryService.act(1, dispatchInput, user)).rejects.toMatchObject({ statusCode: 403 });
  await expect(deliveryService.act(1, dispatchInput, { id: 8, role: 'CASHIER' })).rejects.toMatchObject({ statusCode: 403 });
});
