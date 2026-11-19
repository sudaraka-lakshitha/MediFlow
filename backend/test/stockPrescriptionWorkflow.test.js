import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
import { prescriptionService } from '../src/services/prescription.service.js';
import { paymentRequestService } from '../src/services/paymentRequest.service.js';
import { prescriptionUploadService } from '../src/services/prescriptionUpload.service.js';
import { cleanupExpiredCashReservations } from '../src/utils/reservationExpiry.js';
import { verifyPickupPin } from '../src/utils/pickupPin.js';
import { cashierPaymentSchema } from '../src/controllers/paymentRequest.controller.js';

const { db, tx, release, reserve, dispense, settings } = vi.hoisted(() => {
  const model = () => ({ findUnique: vi.fn(), findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), updateMany: vi.fn(), count: vi.fn(), deleteMany: vi.fn(), createMany: vi.fn() });
  const client = () => Object.fromEntries(['prescription', 'prescriptionItem', 'prescriptionRetailItem', 'prescriptionUpload', 'patientProfile', 'product', 'paymentRequest', 'paymentRequestItem', 'paymentRequestEvent', 'salePayment', 'paymentSlip', 'stockReservation', 'auditLog', 'refund'].map((key) => [key, model()]));
  return { db: { ...client(), $transaction: vi.fn() }, tx: client(), release: vi.fn(), reserve: vi.fn(), dispense: vi.fn(), settings: vi.fn() };
});
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
vi.mock('../src/utils/stock.js', () => ({ releaseReservations: release, reserveStock: reserve, usableStockTotal: vi.fn(), consumePaymentRequestStock: vi.fn() }));
vi.mock('../src/utils/prescriptionDispense.js', () => ({ performPrescriptionDispense: dispense }));
vi.mock('../src/services/operationSettings.service.js', () => ({ operationSettingsService: { get: settings }, batchAllocationOrder: () => [] }));

const d = (n) => new Prisma.Decimal(n);
beforeEach(() => {
  vi.restoreAllMocks(); vi.resetAllMocks();
  db.$transaction.mockImplementation((callback) => callback(tx));
  settings.mockResolvedValue({ cashierCanDispenseAtPayment: true, requirePickupPin: true });
  tx.paymentRequest.updateMany.mockResolvedValue({ count: 1 });
  tx.stockReservation.count.mockResolvedValue(0);
  tx.paymentRequestItem.findMany.mockResolvedValue([]);
  tx.paymentRequest.findUnique.mockResolvedValue({ id: 9, status: 'PAID' });
  tx.paymentSlip.updateMany.mockResolvedValue({ count: 1 });
});

describe('invoice revisions preserve approvals appropriately', () => {
  const line = { prescriptionItemId: 1, productId: 2, quantity: d(1), unitPrice: d(100), lineTotal: d(100), product: { genericName: 'Medicine' } };
  const bill = () => ({ id: 9, revision: 2, acknowledgedRevision: 2, status: 'AWAITING_PAYMENT', pharmacyNote: 'Keep this note', customerNote: 'Please call', reservationDurationHours: 24, subtotal: d(100), total: d(105), tax: d(5), containerFee: d(0), discount: d(0), couponCode: null, items: [line] });
  const input = () => ({ revision: 2, items: [{ prescriptionItemId: 1, quantity: 1 }], retailItems: [], tax: 5, containerFee: 0, couponCode: null, notes: 'Keep this note', reservationHours: 24 });
  beforeEach(() => tx.prescription.findUnique.mockResolvedValue({ id: 1, items: [{ id: 1, prescribedQuantity: d(1), dispensedQuantity: d(0) }], paymentRequest: bill() }));
  it('does not reprice or mutate an unchanged invoice', async () => {
    const quote = vi.spyOn(prescriptionService, 'quoteDispensing');
    await paymentRequestService.update(1, input(), 5);
    expect(tx.paymentRequest.update).not.toHaveBeenCalled();
    expect(quote).not.toHaveBeenCalled(); expect(release).not.toHaveBeenCalled();
  });
  it('retains customer approval, notes, prices and stock on a pharmacy-note edit', async () => {
    await paymentRequestService.update(1, { ...input(), notes: 'New collection note' }, 5);
    expect(tx.paymentRequest.update.mock.calls[0][0].data).toEqual({ pharmacyNote: 'New collection note', reservationDurationHours: 24 });
    expect(tx.paymentRequestEvent.create.mock.calls[0][0].data.details.confirmationRetained).toBe(true);
    expect(release).not.toHaveBeenCalled();
  });
  it('rejects a stale edit before changing anything', async () => {
    await expect(paymentRequestService.update(1, { ...input(), revision: 1 }, 5)).rejects.toThrow('invoice changed');
    expect(tx.paymentRequest.update).not.toHaveBeenCalled();
  });
  it('keeps a renewed reservation deadline on a note-only edit', async () => {
    const deadline = new Date(Date.now() + 3600000);
    tx.prescription.findUnique.mockResolvedValue({ items: [{ id: 1, prescribedQuantity: d(1), dispensedQuantity: d(0) }], paymentRequest: { ...bill(), customerAcknowledgedAt: new Date('2026-01-01'), reservationExpiresAt: deadline } });
    await paymentRequestService.update(1, { ...input(), notes: 'New note' }, 5);
    expect(tx.paymentRequest.update.mock.calls[0][0].data).not.toHaveProperty('reservationExpiresAt');
  });
  it('extends from the active deadline instead of the original approval time', async () => {
    const deadline = new Date(Date.now() + 3600000);
    tx.prescription.findUnique.mockResolvedValue({ items: [{ id: 1, prescribedQuantity: d(1), dispensedQuantity: d(0) }], paymentRequest: { ...bill(), customerAcknowledgedAt: new Date('2026-01-01'), reservationExpiresAt: deadline } });
    await paymentRequestService.update(1, { ...input(), reservationHours: 48 }, 5);
    expect(tx.paymentRequest.update.mock.calls[0][0].data.reservationExpiresAt.getTime()).toBe(deadline.getTime() + 24 * 3600000);
  });
  it('rejects shortening a reservation already promised to the customer', async () => {
    tx.prescription.findUnique.mockResolvedValue({ items: [{ id: 1, prescribedQuantity: d(1), dispensedQuantity: d(0) }], paymentRequest: { ...bill(), reservationExpiresAt: new Date(Date.now() + 3600000) } });
    await expect(paymentRequestService.update(1, { ...input(), reservationHours: 12 }, 5)).rejects.toThrow('cannot be shortened');
    expect(tx.paymentRequest.update).not.toHaveBeenCalled();
  });
  it('requires a customer-visible reason for a financial edit', async () => {
    vi.spyOn(prescriptionService, 'quoteDispensing').mockResolvedValue({ ...bill(), items: undefined, lines: [line], total: d(110), tax: d(10) });
    await expect(paymentRequestService.update(1, { ...input(), tax: 10 }, 5)).rejects.toThrow('Explain what changed');
    expect(release).not.toHaveBeenCalled();
  });
  it('records both versions and withdraws approval only for a material edit', async () => {
    vi.spyOn(prescriptionService, 'quoteDispensing').mockResolvedValue({ ...bill(), items: undefined, lines: [line], total: d(110), tax: d(10) });
    await paymentRequestService.update(1, { ...input(), tax: 10, revisionReason: 'Corrected tax' }, 5);
    expect(release).toHaveBeenCalledWith(tx, 9);
    expect(tx.paymentRequest.update.mock.calls[0][0].data).toMatchObject({ acknowledgedRevision: null, revision: { increment: 1 } });
    expect(tx.paymentRequest.update.mock.calls[0][0].data).not.toHaveProperty('customerNote');
    expect(tx.paymentRequestEvent.create.mock.calls[0][0].data.details).toMatchObject({ reason: 'Corrected tax', previous: { total: '105.000' }, current: { total: '110.000' } });
  });
});

describe('quotation revision acceptance', () => {
  beforeEach(() => db.prescriptionUpload.findUnique.mockResolvedValue({ id: 1, patientId: 2, status: 'QUOTE_SENT', estimatedTotal: d(100), quoteRevision: 3 }));
  it('rejects an outdated quotation shown to the customer', async () => {
    await expect(prescriptionUploadService.acceptEstimate(1, 2, 2)).rejects.toThrow('quotation has changed');
    expect(db.prescriptionUpload.updateMany).not.toHaveBeenCalled();
  });
  it('claims only the exact quotation revision and owner', async () => {
    db.prescriptionUpload.updateMany.mockResolvedValue({ count: 1 });
    await prescriptionUploadService.acceptEstimate(1, 2, 3);
    expect(db.prescriptionUpload.updateMany.mock.calls[0][0].where).toEqual({ id: 1, patientId: 2, status: 'QUOTE_SENT', quoteRevision: 3 });
  });
  it('rejects a quotation revised during acceptance', async () => {
    db.prescriptionUpload.updateMany.mockResolvedValue({ count: 0 });
    await expect(prescriptionUploadService.acceptEstimate(1, 2, 3)).rejects.toThrow('quotation has changed');
  });
});

describe('patient coupon application on online invoices', () => {
  const onlineBill = () => ({
    id: 9, patientId: 2, prescriptionId: 1, status: 'AWAITING_PAYMENT', revision: 3,
    couponCode: null, containerFee: d(0), tax: d(0),
    items: [{ prescriptionItemId: 7, productId: 4, quantity: d(2) }, { prescriptionItemId: null, productId: 8, quantity: d(1) }],
  });
  it('does not allow a patient to apply a coupon to another patient’s invoice', async () => {
    db.paymentRequest.findUnique.mockResolvedValue(onlineBill());
    await expect(paymentRequestService.applyPatientCoupon(9, { revision: 3, couponCode: 'SAVE10' }, { id: 88 }))
      .rejects.toMatchObject({ statusCode: 403 });
  });
  it('copies invoice quantities from the saved bill and requires the current revision', async () => {
    db.paymentRequest.findUnique.mockResolvedValue(onlineBill());
    db.prescription.findUnique.mockResolvedValue({ isOnline: true, sourceUploadId: 5 });
    const update = vi.spyOn(paymentRequestService, 'update').mockResolvedValue({ id: 9, couponCode: 'SAVE10' });
    await paymentRequestService.applyPatientCoupon(9, { revision: 3, couponCode: 'SAVE10' }, { id: 2 });
    expect(update).toHaveBeenCalledWith(1, expect.objectContaining({
      revision: 3, couponCode: 'SAVE10', containerFee: 0, tax: 0,
      items: [{ prescriptionItemId: 7, quantity: 2 }],
      retailItems: [{ productId: 8, quantity: 1 }],
      revisionReason: 'Customer applied coupon SAVE10',
    }), 2);
  });
  it('rejects offline bills from the patient coupon endpoint', async () => {
    db.paymentRequest.findUnique.mockResolvedValue(onlineBill());
    db.prescription.findUnique.mockResolvedValue({ isOnline: false, sourceUploadId: null });
    await expect(paymentRequestService.applyPatientCoupon(9, { revision: 3, couponCode: 'SAVE10' }, { id: 2 }))
      .rejects.toMatchObject({ statusCode: 403 });
  });
});

describe('payment choice changes do not imply fresh invoice approval', () => {
  const approvedAt = new Date('2026-01-01');
  beforeEach(() => {
    tx.paymentRequest.update.mockResolvedValue({ id: 9 });
    settings.mockResolvedValue({ cashReservationHours: 24 });
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 9, patientId: 2, status: 'AWAITING_PAYMENT', revision: 3, acknowledgedRevision: 3, customerAcknowledgedAt: approvedAt, customerPaymentChoice: 'CASH', items: [] });
  });
  it('retains original acknowledgement when changing to bank transfer', async () => {
    await paymentRequestService.acknowledge(9, { revision: 3, paymentChoice: 'BANK_TRANSFER' }, { id: 2 }, true);
    expect(tx.paymentRequest.update.mock.calls[0][0].data).toMatchObject({ customerAcknowledgedAt: approvedAt, acknowledgedRevision: 3, customerPaymentChoice: 'BANK_TRANSFER', reservationExpiresAt: null });
    expect(tx.paymentRequestEvent.create.mock.calls[0][0].data.kind).toBe('PAYMENT_CHOICE_CHANGED');
  });
  it('checks stock before renewing an expired cash hold', async () => {
    await paymentRequestService.acknowledge(9, { revision: 3, paymentChoice: 'CASH' }, { id: 2 }, true);
    expect(reserve).toHaveBeenCalledWith(tx, 9, [], []);
    expect(tx.paymentRequest.update.mock.calls[0][0].data.customerAcknowledgedAt).toEqual(approvedAt);
  });
  it('does not continually extend a still-active hold', async () => {
    const deadline = new Date(Date.now() + 3600000);
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 9, patientId: 2, status: 'AWAITING_PAYMENT', revision: 3, acknowledgedRevision: 3, customerPaymentChoice: 'CASH', customerAcknowledgedAt: approvedAt, reservationExpiresAt: deadline, items: [] });
    await paymentRequestService.acknowledge(9, { revision: 3, paymentChoice: 'CASH' }, { id: 2 }, true);
    expect(tx.paymentRequest.update.mock.calls[0][0].data.reservationExpiresAt).toBe(deadline);
  });
  it.each(['PAID', 'SLIP_SUBMITTED', 'CANCELLED', 'FULFILLED'])('blocks changes to %s invoices', async (status) => {
    tx.paymentRequest.findUnique.mockResolvedValue({ patientId: 2, status });
    await expect(paymentRequestService.acknowledge(9, { revision: 3, paymentChoice: 'CASH' }, { id: 2 }, true)).rejects.toThrow('awaiting payment');
    expect(release).not.toHaveBeenCalled();
  });
});

describe('combined verification and cashier handover', () => {
  it('passes the reviewed billing values and shared transaction to bill creation', async () => {
    tx.prescription.findUnique.mockResolvedValue({ id: 1, status: 'PENDING', items: [], retailItems: [] });
    tx.prescription.updateMany.mockResolvedValue({ count: 1 });
    const create = vi.spyOn(paymentRequestService, 'create').mockResolvedValue({ id: 9 });
    const input = { items: [], tax: 10, notes: 'Collection note', couponCode: 'SAVE' };
    await prescriptionService.sendToCashier(1, 5, input);
    expect(create).toHaveBeenCalledWith(1, input, 5, tx);
    expect(db.prescription.updateMany).not.toHaveBeenCalled();
    expect(db.$transaction.mock.calls[0][1].isolationLevel).toBe('Serializable');
  });
  it('propagates billing failure out of the verification transaction', async () => {
    tx.prescription.findUnique.mockResolvedValue({ id: 1, status: 'PENDING', items: [], retailItems: [] });
    tx.prescription.updateMany.mockResolvedValue({ count: 1 });
    vi.spyOn(paymentRequestService, 'create').mockRejectedValue(new Error('Stock unavailable'));
    await expect(prescriptionService.sendToCashier(1, 5)).rejects.toThrow('Stock unavailable');
    expect(db.prescription.updateMany).not.toHaveBeenCalled();
  });
});

describe('shared refill allowance', () => {
  const original = { id: 1, status: 'DISPENSED', prescriptionNumber: 'RX-1', prescriptionDate: new Date('2026-01-01'), refillsAllowed: 1, refillsUsed: 0, items: [], retailItems: [] };
  it('uses the original allowance for a refill branch and creates an unverified linked record', async () => {
    tx.prescription.findUnique.mockResolvedValueOnce({ ...original, id: 2, originalPrescriptionId: 1, refillsAllowed: 99 })
      .mockResolvedValueOnce(original).mockResolvedValueOnce({ id: 3 });
    tx.prescription.updateMany.mockResolvedValue({ count: 1 });
    tx.prescription.create.mockResolvedValue({ id: 3 });
    await prescriptionService.refill(2, {}, 5);
    expect(tx.prescription.updateMany.mock.calls[0][0]).toEqual({ where: { id: 1, refillsUsed: 0, refillsAllowed: 1, status: 'DISPENSED' }, data: { refillsUsed: { increment: 1 } } });
    expect(tx.prescription.create.mock.calls[0][0].data).toMatchObject({ originalPrescriptionId: 1, prescriptionDate: original.prescriptionDate, status: 'PENDING', refillsAllowed: 0, refillsUsed: 0 });
    expect(db.$transaction.mock.calls[0][1].isolationLevel).toBe('Serializable');
  });
  it('rejects a branch whose original allowance is exhausted', async () => {
    tx.prescription.findUnique.mockResolvedValueOnce({ ...original, originalPrescriptionId: 1 }).mockResolvedValueOnce({ ...original, refillsUsed: 1 });
    await expect(prescriptionService.refill(2, {}, 5)).rejects.toThrow('All authorized refills');
    expect(tx.prescription.create).not.toHaveBeenCalled();
  });
  it('does not create a refill if another request consumed the allowance', async () => {
    tx.prescription.findUnique.mockResolvedValue(original);
    tx.prescription.updateMany.mockResolvedValue({ count: 0 });
    await expect(prescriptionService.refill(1, {}, 5)).rejects.toThrow('allowance changed');
    expect(tx.prescription.create).not.toHaveBeenCalled();
  });
  it('allows only one of two competing requests to consume the last refill', async () => {
    let used = 0;
    tx.prescription.findUnique.mockImplementation(async () => ({ ...original, refillsUsed: used }));
    tx.prescription.updateMany.mockImplementation(async ({ where }) => {
      if (where.refillsUsed !== used) return { count: 0 };
      used += 1;
      return { count: 1 };
    });
    tx.prescription.create.mockResolvedValue({ id: 3 });
    const results = await Promise.allSettled([prescriptionService.refill(1, {}, 5), prescriptionService.refill(1, {}, 5)]);
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    expect(tx.prescription.create).toHaveBeenCalledTimes(1);
    expect(used).toBe(1);
  });
});

describe('expiry cleanup independent of the cashier screen', () => {
  it('releases an expired hold in the same transaction as its status update', async () => {
    db.paymentRequest.findMany.mockResolvedValue([{ id: 9 }]);
    await cleanupExpiredCashReservations();
    expect(release).toHaveBeenCalledWith(tx, 9);
    expect(tx.paymentRequest.updateMany.mock.calls[0][0].where).toMatchObject({ id: 9, status: 'AWAITING_PAYMENT', reservationExpiresAt: { lte: expect.any(Date) } });
  });
  it('does not release stock if the bill was paid or renewed concurrently', async () => {
    db.paymentRequest.findMany.mockResolvedValue([{ id: 9 }]);
    tx.paymentRequest.updateMany.mockResolvedValue({ count: 0 });
    await cleanupExpiredCashReservations();
    expect(release).not.toHaveBeenCalled();
  });
});

describe('payment is separate from collection', () => {
  it('rejects bank-slip approval when a retail payment already used the reference', async () => {
    tx.paymentSlip.findFirst.mockResolvedValue({ id: 2, status: 'PENDING', declaredAmount: d(50), paymentRequest: { id: 9, status: 'SLIP_SUBMITTED', total: d(50) } });
    tx.salePayment.findFirst.mockResolvedValue({ id: 11 });
    await expect(paymentRequestService.reviewSlip(9, 2, { approved: true, verifiedAmount: 50, verifiedReference: 'BT-1' }, { id: 5, role: 'CASHIER' })).rejects.toThrow('already been used');
    expect(tx.paymentRequest.updateMany).not.toHaveBeenCalled();
    expect(reserve).not.toHaveBeenCalled();
  });
  it.each(['BANK_TRANSFER', 'OTHER'])('rejects reused bank references in manual %s payments', async method => {
    db.paymentRequest.findMany.mockResolvedValue([]);
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 9, status: 'AWAITING_PAYMENT', total: d(50) });
    tx.salePayment.findFirst.mockResolvedValue({ id: 11 });
    const extra = method === 'OTHER' ? { splitDetails: { isSplit: true, cashAmount: 20, nonCashAmount: 30, nonCashMethod: 'BANK_TRANSFER', nonCashReference: 'BT-1', cashTendered: 20, change: 0 } } : {};
    await expect(paymentRequestService.pay(9, method, 5, 'BT-1', extra)).rejects.toThrow('already been used');
    expect(tx.paymentRequest.updateMany).not.toHaveBeenCalled();
    expect(reserve).not.toHaveBeenCalled();
  });
  it('bank approval reserves stock and issues a PIN without dispensing even when the setting is enabled', async () => {
    tx.paymentSlip.findFirst.mockResolvedValue({ id: 2, status: 'PENDING', declaredAmount: d(50), reference: 'BT-1', paymentRequest: { id: 9, status: 'SLIP_SUBMITTED', total: d(50), prescriptionId: 1 } });
    const result = await paymentRequestService.reviewSlip(9, 2, { approved: true, verifiedAmount: 50, verifiedReference: 'BT-1' }, { id: 5, role: 'CASHIER' });
    expect(result.pickupPin).toMatch(/^\d{6}$/);
    expect(result.dispensed).toBeNull();
    expect(dispense).not.toHaveBeenCalled();
    expect(reserve).toHaveBeenCalledWith(tx, 9, [], []);
  });
  it.each([false, true])('counter payment dispenses only with explicit handover=%s', async (confirmHandover) => {
    db.paymentRequest.findMany.mockResolvedValue([]);
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 9, status: 'AWAITING_PAYMENT', total: d(50), prescriptionId: 1 });
    await paymentRequestService.pay(9, 'CASH', 5, null, { confirmHandover, tenderedAmount: 50, changeAmount: 0 });
    expect(dispense).toHaveBeenCalledTimes(confirmHandover ? 1 : 0);
  });
  it('requires acknowledgement for an online order even without its source attachment link', async () => {
    db.paymentRequest.findMany.mockResolvedValue([]);
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 9, status: 'AWAITING_PAYMENT', revision: 2, acknowledgedRevision: 1, prescription: { isOnline: true, sourceUploadId: null } });
    await expect(paymentRequestService.pay(9, 'CASH', 5)).rejects.toThrow('acknowledge the latest invoice');
  });
  it('defaults handover confirmation to false', () => {
    expect(cashierPaymentSchema.parse({ paymentMethod: 'CASH' }).confirmHandover).toBe(false);
  });
});

describe('administrator PIN recovery', () => {
  it('rotates the PIN with an audit event, without changing stock or payment', async () => {
    const result = await paymentRequestService.resetPickupPin(9, 'Customer identity checked', { id: 5, role: 'ADMIN' });
    const mutation = tx.paymentRequest.updateMany.mock.calls[0][0];
    expect(mutation.where).toEqual({ id: 9, status: 'PAID' });
    expect(mutation.data.pinAttempts).toBe(0);
    expect(verifyPickupPin(9, result.pickupPin, mutation.data.pickupPinHash)).toBe(true);
    expect(mutation.data).not.toHaveProperty('amountPaid');
    expect(tx.auditLog.create.mock.calls[0][0].data.details).toEqual({ reason: 'Customer identity checked' });
    expect(reserve).not.toHaveBeenCalled(); expect(release).not.toHaveBeenCalled();
  });
  it('refuses non-administrators', async () => {
    await expect(paymentRequestService.resetPickupPin(9, 'Reason', { id: 2, role: 'CASHIER' })).rejects.toThrow('Only an administrator');
    expect(tx.paymentRequest.updateMany).not.toHaveBeenCalled();
  });
  it('refuses collected or unpaid orders', async () => {
    tx.paymentRequest.updateMany.mockResolvedValue({ count: 0 });
    await expect(paymentRequestService.resetPickupPin(9, 'Reason', { id: 2, role: 'ADMIN' })).rejects.toThrow('Only paid orders');
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });
});

describe('attachment retention', () => {
  it('clears only attachments for eligible terminal records and preserves payment evidence', async () => {
    db.prescriptionUploadAttachment = { deleteMany: vi.fn() };
    db.prescriptionUpload.updateMany.mockResolvedValue({ count: 2 });
    expect(await prescriptionUploadService.cleanupExpired()).toBe(2);
    const { where, data } = db.prescriptionUpload.updateMany.mock.calls[0][0];
    expect(data.fileData.length).toBe(0);
    expect(data.attachmentRemovedAt).toBeInstanceOf(Date);
    expect(where.paymentSlips).toEqual({ none: { status: 'PENDING' } });
    expect(where.OR[1].prescription.is.status.in).toEqual(['DISPENSED', 'REJECTED', 'CANCELLED']);
    expect(data).not.toHaveProperty('paymentSlips');
    expect(db.prescriptionUploadAttachment.deleteMany).toHaveBeenCalledWith({ where: { upload: { attachmentRemovedAt: { not: null } } } });
  });
  it('reports a removed attachment without returning empty file content', async () => {
    db.prescriptionUpload.findUnique.mockResolvedValue({ id: 1, patientId: 2, fileData: Buffer.alloc(0) });
    await expect(prescriptionUploadService.file(1, { id: 2, role: 'PATIENT' })).rejects.toThrow('attachment was removed');
  });
});

describe('atomic prescription and bill creation', () => {
  it('accepts a prepared online order only when the pharmacist creates its final bill in the same step', async () => {
    db.prescriptionUpload.findUnique.mockResolvedValue({
      id: 10, patientId: 2, status: 'AVAILABLE', prepareRequested: true, quoteRevision: 1,
      acknowledgedQuoteRevision: null, estimatedTotal: d(100), attachmentRemovedAt: null, prescription: null, paymentSlips: [],
    });
    db.patientProfile.findUnique.mockResolvedValue({ userId: 2 });
    await expect(prescriptionService.create({
      patientId: 2, sourceUploadId: 10, sendToCashier: false, items: [], retailItems: [],
    }, 5)).rejects.toThrow('final invoice in the same step');
    expect(db.product.findMany).not.toHaveBeenCalled();
  });
  it('lets a quotation-only upload go straight to the final prescription and bill', async () => {
    db.prescriptionUpload.findUnique.mockResolvedValue({
      id: 10, patientId: 2, status: 'PENDING', prepareRequested: false, quoteRevision: 0,
      acknowledgedQuoteRevision: null, estimatedTotal: null, attachmentRemovedAt: null, prescription: null, paymentSlips: [],
    });
    db.patientProfile.findUnique.mockResolvedValue({ userId: 2 });
    await expect(prescriptionService.create({
      patientId: 2, sourceUploadId: 10, sendToCashier: false, items: [], retailItems: [],
    }, 5)).rejects.toThrow('final invoice in the same step');
  });
  it('creates the final invoice directly from a pending quote-only upload in one transaction', async () => {
    db.prescriptionUpload.findUnique.mockResolvedValue({
      id: 10, patientId: 2, status: 'PENDING', prepareRequested: false, quoteRevision: 0,
      acknowledgedQuoteRevision: null, estimatedTotal: null, attachmentRemovedAt: null, prescription: null, paymentSlips: [],
    });
    db.patientProfile.findUnique.mockResolvedValue({ userId: 2, dateOfBirth: new Date('1990-01-01') });
    db.product.findMany.mockResolvedValueOnce([{ id: 1, unit: 'tablet', genericName: 'Medicine' }]).mockResolvedValueOnce([]);
    tx.prescriptionUpload.updateMany.mockResolvedValue({ count: 1 });
    tx.prescription.create.mockResolvedValue({ id: 7 });
    tx.prescriptionItem.findMany.mockResolvedValue([{ id: 70, prescribedQuantity: d(1) }]);
    const createBill = vi.spyOn(paymentRequestService, 'create').mockResolvedValue({ id: 9 });

    await prescriptionService.create({
      patientId: 2, sourceUploadId: 10, orderedForSelf: true, prescriptionDate: new Date(), sendToCashier: true,
      retailItems: [], items: [{ productId: 1, quantityPerDose: 1, timesPerDay: 1, daysSupply: 1, dosageInstructions: 'Take one tablet daily' }],
    }, 5);

    expect(tx.prescriptionUpload.updateMany.mock.calls[0][0].where).toMatchObject({ id: 10, status: 'PENDING' });
    expect(tx.prescriptionUpload.updateMany.mock.calls[1][0]).toMatchObject({
      where: { id: 10, status: 'PENDING', prescription: { is: { id: 7 } } },
      data: { status: 'PAYMENT_PENDING' },
    });
    expect(tx.prescription.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ sourceUploadId: 10, status: 'VERIFIED' }) }));
    expect(createBill).toHaveBeenCalledWith(7, expect.objectContaining({ items: [{ prescriptionItemId: 70, quantity: 1 }] }), 5, tx);
  });
  it('lets an older sent quotation be finalized directly without waiting for quotation approval', async () => {
    db.prescriptionUpload.findUnique.mockResolvedValue({
      id: 11, patientId: 2, status: 'QUOTE_SENT', prepareRequested: false, quoteRevision: 2,
      acknowledgedQuoteRevision: null, estimatedTotal: d(100), attachmentRemovedAt: null, prescription: null, paymentSlips: [],
    });
    db.patientProfile.findUnique.mockResolvedValue({ userId: 2, dateOfBirth: new Date('1990-01-01') });
    db.product.findMany.mockResolvedValueOnce([{ id: 1, unit: 'tablet', genericName: 'Medicine' }]).mockResolvedValueOnce([]);
    tx.prescriptionUpload.updateMany.mockResolvedValue({ count: 1 });
    tx.prescription.create.mockResolvedValue({ id: 8 });
    tx.prescriptionItem.findMany.mockResolvedValue([{ id: 80, prescribedQuantity: d(1) }]);
    const createBill = vi.spyOn(paymentRequestService, 'create').mockResolvedValue({ id: 10 });

    await prescriptionService.create({
      patientId: 2, sourceUploadId: 11, orderedForSelf: true, prescriptionDate: new Date(), sendToCashier: true,
      retailItems: [], items: [{ productId: 1, quantityPerDose: 1, timesPerDay: 1, daysSupply: 1, dosageInstructions: 'Take one tablet daily' }],
    }, 5);

    expect(tx.prescriptionUpload.updateMany.mock.calls[0][0].where).toMatchObject({ id: 11, status: 'QUOTE_SENT' });
    expect(tx.prescriptionUpload.updateMany.mock.calls[1][0].data).toEqual({ status: 'PAYMENT_PENDING' });
    expect(createBill).toHaveBeenCalledWith(8, expect.any(Object), 5, tx);
  });
  it('creates a prepared upload invoice without a separate rough-quote acknowledgement', async () => {
    db.prescriptionUpload.findUnique.mockResolvedValue({
      id: 10, patientId: 2, status: 'AVAILABLE', prepareRequested: true, quoteRevision: 1,
      acknowledgedQuoteRevision: null, estimatedTotal: d(100), attachmentRemovedAt: null, prescription: null, paymentSlips: [],
    });
    db.patientProfile.findUnique.mockResolvedValue({ userId: 2, dateOfBirth: new Date('1990-01-01') });
    db.product.findMany.mockResolvedValueOnce([{ id: 1, unit: 'tablet', genericName: 'Medicine' }]).mockResolvedValueOnce([]);
    tx.prescriptionUpload.updateMany.mockResolvedValue({ count: 1 });
    tx.prescription.create.mockResolvedValue({ id: 7 });
    tx.prescriptionItem.findMany.mockResolvedValue([{ id: 70, prescribedQuantity: d(1) }]);
    tx.prescription.findUnique.mockResolvedValue({ id: 7 });
    const createBill = vi.spyOn(paymentRequestService, 'create').mockResolvedValue({ id: 9 });
    await prescriptionService.create({
      patientId: 2, sourceUploadId: 10, orderedForSelf: true, prescriptionDate: new Date(), sendToCashier: true,
      retailItems: [], couponCode: 'SAVE10', containerFee: 0, tax: 0,
      items: [{ productId: 1, quantityPerDose: 1, timesPerDay: 1, daysSupply: 1, dosageInstructions: 'Take one tablet daily' }],
    }, 5);
    expect(createBill).toHaveBeenCalledWith(7, expect.objectContaining({ couponCode: 'SAVE10', items: [{ prescriptionItemId: 70, quantity: 1 }] }), 5, tx);
    expect(tx.prescriptionUpload.updateMany.mock.calls[0][0].where).toMatchObject({ status: 'AVAILABLE', quoteRevision: 1 });
  });
  it('passes the same transaction into billing and propagates failure to roll back prescription creation', async () => {
    db.patientProfile.findUnique.mockResolvedValue({ userId: 2, dateOfBirth: new Date('1990-01-01') });
    db.product.findMany.mockResolvedValueOnce([{ id: 1, unit: 'tablet', genericName: 'Medicine' }]).mockResolvedValueOnce([]);
    tx.prescription.create.mockResolvedValue({ id: 1 });
    tx.prescriptionItem.findMany.mockResolvedValue([{ id: 7, prescribedQuantity: d(1) }]);
    const bill = vi.spyOn(paymentRequestService, 'create').mockRejectedValue(new Error('Stock unavailable'));
    await expect(prescriptionService.create({ patientId: 2, orderedForSelf: true, prescriptionDate: new Date(), sendToCashier: true, retailItems: [], items: [{ productId: 1, quantityPerDose: 1, timesPerDay: 1, daysSupply: 1 }] }, 5)).rejects.toThrow('Stock unavailable');
    expect(bill.mock.calls[0][3]).toBe(tx);
    expect(db.$transaction.mock.calls[0][1].isolationLevel).toBe('Serializable');
    expect(db.prescription.create).not.toHaveBeenCalled();
  });
});

describe('billing adjustments preserve money and history', () => {
  const bill = () => ({ id: 9, status: 'PAID', paidAt: new Date(), revision: 1, amountPaid: d(100), refundedAmount: d(0), subtotal: d(100), discount: d(10), tax: d(10), total: d(100), containerFee: d(0), items: [
    { id: 11, quantity: d(1), lineTotal: d(40), product: { genericName: 'First', unit: 'tablet' } },
    { id: 12, quantity: d(1), lineTotal: d(60), product: { genericName: 'Second', unit: 'tablet' } },
  ] });
  it('keeps the payment amount and records a separate refund with revised tax', async () => {
    tx.paymentRequest.findUnique.mockResolvedValue(bill());
    tx.stockReservation.findMany.mockResolvedValue([]);
    await paymentRequestService.partialCancel(9, { itemIds: [11], reason: 'No longer required', revision: 1 }, { id: 5, role: 'ADMIN' });
    const data = tx.paymentRequest.update.mock.calls[0][0].data;
    expect(data).not.toHaveProperty('amountPaid');
    expect(data.refundedAmount.increment.toString()).toBe('40');
    expect(data.tax.toString()).toBe('6');
    expect(data.total.toString()).toBe('60');
    expect(tx.paymentRequestEvent.create.mock.calls[0][0].data).toMatchObject({ kind: 'REFUND_REQUESTED', amount: 0, details: { reason: 'No longer required' } });
    expect(tx.refund.create.mock.calls[0][0].data.amount.toString()).toBe('40');
  });
  it('rejects stale partial-cancellation previews before changing stock', async () => {
    tx.paymentRequest.findUnique.mockResolvedValue(bill());
    await expect(paymentRequestService.partialCancel(9, { itemIds: [11], reason: 'No longer required', revision: 2 }, { id: 5, role: 'ADMIN' })).rejects.toThrow('invoice changed');
    expect(release).not.toHaveBeenCalled();
    expect(tx.paymentRequestItem.deleteMany).not.toHaveBeenCalled();
  });
  it('full cancellation refunds only the remaining net payment', async () => {
    tx.paymentRequest.findUnique.mockResolvedValue({ ...bill(), refundedAmount: d(40) });
    await paymentRequestService.cancel(9, 'Cancel remainder', { id: 5, role: 'ADMIN' });
    expect(tx.paymentRequestEvent.create.mock.calls[0][0].data.amount.toString()).toBe('0');
    expect(tx.refund.create.mock.calls[0][0].data.amount.toString()).toBe('60');
    expect(tx.paymentRequest.update.mock.calls[0][0].data.refundedAmount.increment.toString()).toBe('60');
  });
  it('stores customer requests separately from prior cancellation history', async () => {
    tx.paymentRequest.findUnique.mockResolvedValue({ ...bill(), patientId: 2 });
    await paymentRequestService.requestCancellation(9, 'Please cancel', { id: 2, role: 'PATIENT' });
    expect(tx.paymentRequest.update.mock.calls[0][0].data).toEqual({ customerCancellationReason: 'Please cancel' });
    expect(tx.paymentRequestEvent.create.mock.calls[0][0].data.kind).toBe('CANCELLATION_REQUESTED');
  });
  it('calculates collections from dated money movements rather than current bill status', async () => {
    db.paymentRequestEvent.findMany.mockResolvedValue([{ kind: 'PAYMENT_RECEIVED', amount: d(100) }, { kind: 'REFUND', amount: d(-40) }]);
    const result = await paymentRequestService.collectionsToday();
    expect(result.payments).toBe(1); expect(result.netCollected.toString()).toBe('60');
  });
  it('blocks legacy transfer submission after a final invoice exists', async () => {
    tx.prescription.findFirst.mockResolvedValue({ id: 1 });
    await expect(prescriptionUploadService.submitSlip(9, {}, { id: 2, role: 'PATIENT' })).rejects.toThrow('final invoice already exists');
  });
});
