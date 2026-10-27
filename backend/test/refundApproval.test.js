import { beforeEach, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
const db = vi.hoisted(() => ({ paymentRequest: { findUnique: vi.fn(), findMany: vi.fn() }, refundApproval: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() }, auditLog: { create: vi.fn() } }));
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
vi.mock('../src/utils/serializable.js', () => ({ serializable: operation => operation(db) }));
vi.mock('../src/services/paymentRequest.service.js', () => ({ paymentRequestService: { cancel: vi.fn(), partialCancel: vi.fn() } }));
import { refundApprovalService as service } from '../src/services/refundApproval.service.js';
import { paymentRequestService } from '../src/services/paymentRequest.service.js';
const D = value => new Prisma.Decimal(value), staff = { id: 2, role: 'PHARMACIST' }, admin = { id: 3, role: 'ADMIN' };
let bill, approval;
beforeEach(() => {
  vi.clearAllMocks();
  bill = { id: 8, requestNumber: 'TEST', revision: 1, updatedAt: new Date('2026-10-01'), status: 'PAID', amountPaid: D(100), refundedAmount: D(0), subtotal: D(100), discount: D(0), tax: D(0), containerFee: D(0), total: D(100), items: [{ id: 9, quantity: D(10), lineTotal: D(100), product: { genericName: 'Test', unit: 'tablet' } }] };
  db.paymentRequest.findUnique.mockImplementation(async () => bill);
  db.refundApproval.findUnique.mockImplementation(async ({ where }) => where.id ? approval : undefined);
  db.refundApproval.create.mockImplementation(async ({ data }) => { approval = { id: 4, status: 'PENDING', ...data }; return approval; });
  db.refundApproval.update.mockImplementation(async ({ data }) => { approval = { ...approval, ...data }; return approval; });
});
const request = async (extra = {}) => {
  const input = { revision: 1, reason: 'Patient cannot collect', ...extra };
  const preview = await service.preview(8, input, staff);
  await service.request(8, { ...input, hash: preview.hash }, staff);
  return preview;
};
it('requests without changing money, then binds approval to the exact current invoice', async () => {
  expect((await request()).amount.toNumber()).toBe(100);
  expect(paymentRequestService.cancel).not.toHaveBeenCalled();
  await service.decide(8, 4, { approved: true, reason: 'Reviewed history' }, admin);
  expect(paymentRequestService.cancel).toHaveBeenCalledWith(8, 'Patient cannot collect', admin, db);
  expect(approval.decisionReason).toBe('Reviewed history');
  expect(approval.status).toBe('APPROVED');
  await expect(service.decide(8, 4, { approved: true, reason: 'Again' }, admin)).rejects.toMatchObject({ statusCode: 409 });
  expect(paymentRequestService.cancel).toHaveBeenCalledTimes(1);
});
it('uses the existing partial cancellation transaction without granting staff admin rights', async () => {
  expect((await request({ itemIds: [9], quantities: { 9: 2 } })).amount.toNumber()).toBe(20);
  await expect(service.decide(8, 4, { approved: true, reason: 'Reviewed' }, staff)).rejects.toMatchObject({ statusCode: 403 });
  await service.decide(8, 4, { approved: true, reason: 'Reviewed' }, admin);
  expect(paymentRequestService.partialCancel).toHaveBeenCalledWith(8, expect.objectContaining({ quantities: { 9: 2 } }), admin, db);
});
it('rejects approval after collection or an invoice change, but permits rejecting stale requests', async () => {
  await request(); bill.revision = 2;
  await expect(service.decide(8, 4, { approved: true, reason: 'Reviewed' }, admin)).rejects.toMatchObject({ statusCode: 409 });
  expect(paymentRequestService.cancel).not.toHaveBeenCalled();
  await service.decide(8, 4, { approved: false, reason: 'Request needs updating' }, admin);
  expect(approval.status).toBe('REJECTED');
});
it('rejects patient access and self approval', async () => {
  await expect(service.preview(8, { revision: 1 }, { id: 1, role: 'PATIENT' })).rejects.toMatchObject({ statusCode: 403 });
  await request(); approval.requestedById = admin.id;
  await expect(service.decide(8, 4, { approved: true, reason: 'Reviewed' }, admin)).rejects.toMatchObject({ statusCode: 403 });
});
it('includes a paid delivery fee when full cancellation also cancels delivery', async () => {
  bill.delivery = { status: 'AWAITING_FEE', feePaymentRequest: { status: 'PAID', amountPaid: D(15), refundedAmount: D(0) } };
  const preview = await request(); expect(preview.amount.toNumber()).toBe(115); expect(preview.includesDeliveryFee).toBe(true);
});
