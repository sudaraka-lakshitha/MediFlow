import { beforeEach, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
const { tx } = vi.hoisted(() => {
  const model = () => ({ findUnique: vi.fn(), aggregate: vi.fn(), create: vi.fn(), update: vi.fn(), updateMany: vi.fn() });
  return { tx: { paymentRequest: model(), refund: model(), paymentRequestEvent: model(), auditLog: model() } };
});
vi.mock('../src/utils/serializable.js', () => ({ serializable: fn => fn(tx) }));
import { deliveryFeeRefundService as service } from '../src/services/deliveryFeeRefund.service.js';
import { refundService } from '../src/services/refund.service.js';
const d = value => new Prisma.Decimal(value);
const requester = { id: 1, role: 'PHARMACIST' };
const approver = { id: 2, role: 'CASHIER', deliveryRefundApprovalAccess: true };
const input = { amount: 25, reason: 'Courier service failure', evidenceReference: 'CASE-123' };
const fee = () => ({ id: 10, revision: 1, status: 'FULFILLED', amountPaid: d(100), refundedAmount: d(0), deliveryFeeFor: { dispatchedAt: new Date(), status: 'RETURNED' } });
const request = () => ({ id: 20, paymentRequestId: 10, category: 'DELIVERY_FEE', status: 'AWAITING_APPROVAL', createdById: 1, amount: d(25), reason: input.reason });
beforeEach(() => {
  vi.resetAllMocks(); tx.paymentRequest.findUnique.mockResolvedValue(fee());
  tx.refund.aggregate.mockResolvedValue({ _sum: { amount: null } });
  tx.refund.create.mockResolvedValue(request()); tx.refund.findUnique.mockResolvedValue(request());
  tx.refund.updateMany.mockResolvedValue({ count: 1 });
});
it('queues an exception without payout, stock changes or fee balance changes', async () => {
  await service.request(10, input, requester);
  expect(tx.refund.create).toHaveBeenCalledWith({ data: expect.objectContaining({ category: 'DELIVERY_FEE', status: 'AWAITING_APPROVAL', createdById: 1 }) });
  expect(tx.paymentRequest.update).not.toHaveBeenCalled();
});
it.each([-1, 0, 1.001])('rejects an invalid amount %s', async amount => {
  await expect(service.request(10, { ...input, amount }, requester)).rejects.toMatchObject({ statusCode: 400 });
});
it('blocks patients, missing evidence and non-delivery invoices', async () => {
  await expect(service.request(10, input, { id: 9, role: 'PATIENT' })).rejects.toMatchObject({ statusCode: 403 });
  await expect(service.request(10, { ...input, evidenceReference: '' }, requester)).rejects.toMatchObject({ statusCode: 400 });
  tx.paymentRequest.findUnique.mockResolvedValue({ ...fee(), deliveryFeeFor: null });
  await expect(service.request(10, input, requester)).rejects.toMatchObject({ statusCode: 409 });
});
it('reserves the amount of outstanding approval requests', async () => {
  tx.refund.aggregate.mockResolvedValue({ _sum: { amount: d(80) } });
  await expect(service.request(10, input, requester)).rejects.toMatchObject({ statusCode: 409 });
});
it('blocks self approval even for administrators', async () => {
  await expect(service.decide(20, { approved: true, reason: 'Approved' }, { id: 1, role: 'ADMIN' })).rejects.toMatchObject({ statusCode: 403 });
  expect(tx.refund.updateMany).not.toHaveBeenCalled();
});
it('requires explicit permission for non-admin approvers', async () => {
  await expect(service.decide(20, { approved: true, reason: 'Approved' }, { ...approver, deliveryRefundApprovalAccess: false })).rejects.toMatchObject({ statusCode: 403 });
});
it('approval queues payout and reserves the refund amount exactly once', async () => {
  await service.decide(20, { approved: true, reason: 'Verified courier failure' }, approver);
  expect(tx.refund.updateMany).toHaveBeenCalledWith({ where: { id: 20, status: 'AWAITING_APPROVAL' }, data: expect.objectContaining({ status: 'PENDING', approvedById: 2 }) });
  expect(tx.paymentRequest.update).toHaveBeenCalledWith({ where: { id: 10 }, data: { refundedAmount: { increment: d(25) } } });
  expect(tx.paymentRequestEvent.create.mock.calls[0][0].data.kind).toBe('REFUND_REQUESTED');
});
it('rejection does not change the paid balance', async () => {
  await service.decide(20, { approved: false, reason: 'Service was provided' }, approver);
  expect(tx.refund.updateMany.mock.calls[0][0].data.status).toBe('REJECTED');
  expect(tx.paymentRequest.update).not.toHaveBeenCalled();
});
it('rejects stale decisions and excessive amounts at approval time', async () => {
  tx.refund.updateMany.mockResolvedValue({ count: 0 });
  await expect(service.decide(20, { approved: true, reason: 'Approved' }, approver)).rejects.toMatchObject({ statusCode: 409 });
  expect(tx.paymentRequest.update).not.toHaveBeenCalled();
  tx.paymentRequest.findUnique.mockResolvedValue({ ...fee(), refundedAmount: d(90) });
  await expect(service.decide(20, { approved: true, reason: 'Approved' }, approver)).rejects.toMatchObject({ statusCode: 409 });
});
it('cannot pay an unapproved or self-approved exception', async () => {
  await expect(refundService.settle(20, { payoutConfirmed: true, reference: 'CASH-123', method: 'CASH' }, approver)).rejects.toMatchObject({ statusCode: 409 });
  tx.refund.findUnique.mockResolvedValue({ ...request(), status: 'PENDING', approvedById: 1 });
  await expect(refundService.settle(20, { payoutConfirmed: true, reference: 'CASH-123', method: 'CASH' }, approver)).rejects.toMatchObject({ statusCode: 409 });
});
