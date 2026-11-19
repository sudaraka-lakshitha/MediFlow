// The three upload choices must behave differently, not just read differently:
//  1. prepare for collection  -> stock held as soon as the final bill is issued
//  2. prepare for delivery    -> same hold, plus the delivery-fee bill
//  3. send me the bill first  -> nothing held until the bill is paid
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
import { paymentRequestService, stockHoldPolicy } from '../src/services/paymentRequest.service.js';
import { prescriptionService } from '../src/services/prescription.service.js';

const { db, tx, release, reserve, dispense, settings } = vi.hoisted(() => {
  const model = () => ({ findUnique: vi.fn(), findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), updateMany: vi.fn(), count: vi.fn(), deleteMany: vi.fn(), createMany: vi.fn() });
  const client = () => Object.fromEntries(['prescription', 'prescriptionUpload', 'paymentRequest', 'paymentRequestItem', 'paymentRequestEvent', 'deliveryRequest', 'systemSetting', 'stockReservation', 'salePayment'].map((key) => [key, model()]));
  return { db: { ...client(), $transaction: vi.fn() }, tx: client(), release: vi.fn(), reserve: vi.fn(), dispense: vi.fn(), settings: vi.fn() };
});
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
vi.mock('../src/utils/stock.js', () => ({ releaseReservations: release, reserveStock: reserve, usableStockTotal: vi.fn(), consumePaymentRequestStock: vi.fn() }));
vi.mock('../src/utils/prescriptionDispense.js', () => ({ performPrescriptionDispense: dispense }));
vi.mock('../src/services/operationSettings.service.js', () => ({ operationSettingsService: { get: settings }, batchAllocationOrder: () => [] }));

const d = (n) => new Prisma.Decimal(n);
const items = [{ id: 31, productId: 2, quantity: d(10) }];
const prepared = { sourceUploadId: 4, isOnline: true, sourceUpload: { prepareRequested: true } };
const reviewFirst = { sourceUploadId: 4, isOnline: true, sourceUpload: { prepareRequested: false } };
const billingHold = expect.objectContaining({ purpose: 'to hold this prepared order' });

beforeEach(() => {
  vi.restoreAllMocks(); vi.resetAllMocks();
  db.$transaction.mockImplementation((callback) => callback(tx));
  settings.mockResolvedValue({ cashReservationHours: 24, cashierCanDispenseAtPayment: true });
  tx.paymentRequest.updateMany.mockResolvedValue({ count: 1 });
  tx.paymentRequestItem.findMany.mockResolvedValue(items);
});

describe('stock-hold rule', () => {
  it('maps each upload choice to its hold rule', () => {
    expect(stockHoldPolicy({ prescription: prepared })).toBe('AT_BILLING');
    expect(stockHoldPolicy({ prescription: reviewFirst })).toBe('AFTER_PAYMENT');
    expect(stockHoldPolicy({ prescription: { sourceUploadId: null } })).toBe('CASH_CHOICE');
    expect(stockHoldPolicy({})).toBe('CASH_CHOICE');
  });
});

describe('issuing the final bill', () => {
  const issue = async (upload) => {
    vi.spyOn(prescriptionService, 'quoteDispensing').mockResolvedValue({ subtotal: 100, discount: 0, containerFee: 0, tax: 0, total: 100, lines: [] });
    tx.prescription.findUnique.mockResolvedValue({ id: 1, status: 'VERIFIED', patient: { userId: 2 }, items: [] });
    tx.paymentRequest.create.mockResolvedValue({ id: 3, patientId: 2, requestNumber: 'PAY-1', revision: 1, prescription: { sourceUploadId: 4 } });
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 3 });
    tx.prescriptionUpload.findUnique.mockResolvedValue({ deliveryRequested: false, ...upload });
    await paymentRequestService.create(1, { items: [] }, 5, tx);
  };
  it('holds stock immediately for "prepare in advance" (option 1)', async () => {
    const before = Date.now();
    await issue({ prepareRequested: true });
    expect(reserve).toHaveBeenCalledWith(tx, 3, items, [], billingHold);
    const { reservationExpiresAt } = tx.paymentRequest.update.mock.calls[0][0].data;
    expect(reservationExpiresAt.getTime()).toBeGreaterThanOrEqual(before + 24 * 3600000);
    expect(tx.prescriptionUpload.update).toHaveBeenCalledWith({ where: { id: 4 }, data: { status: 'PAYMENT_PENDING' } });
  });
  it('holds nothing for "send me the complete bill first" (option 3)', async () => {
    await issue({ prepareRequested: false });
    expect(reserve).not.toHaveBeenCalled();
    expect(tx.paymentRequest.update).not.toHaveBeenCalled();
  });
  it('does not issue a prepared bill whose stock cannot be held', async () => {
    reserve.mockRejectedValue(Object.assign(new Error('Insufficient usable stock'), { statusCode: 409 }));
    await expect(issue({ prepareRequested: true })).rejects.toMatchObject({ statusCode: 409 });
    expect(tx.prescriptionUpload.update).not.toHaveBeenCalled();
  });
});

describe('customer acknowledgement', () => {
  const bill = (prescription, extra = {}) => ({ id: 9, patientId: 2, status: 'AWAITING_PAYMENT', revision: 1, acknowledgedRevision: null, items, prescription, ...extra });
  it('keeps a prepared order\'s active hold when bank transfer is chosen', async () => {
    const deadline = new Date(Date.now() + 3600000);
    tx.paymentRequest.findUnique.mockResolvedValue(bill(prepared, { reservationExpiresAt: deadline }));
    await paymentRequestService.acknowledge(9, { revision: 1, paymentChoice: 'BANK_TRANSFER' }, { id: 2 });
    expect(release).not.toHaveBeenCalled();
    expect(reserve).not.toHaveBeenCalled();
    expect(tx.paymentRequest.updateMany.mock.calls[0][0].data.reservationExpiresAt).toBe(deadline);
  });
  it('holds a prepared order again after its earlier hold expired', async () => {
    tx.paymentRequest.findUnique.mockResolvedValue(bill(prepared, { reservationExpiresAt: null }));
    await paymentRequestService.acknowledge(9, { revision: 1, paymentChoice: 'BANK_TRANSFER' }, { id: 2 });
    expect(release).toHaveBeenCalledWith(tx, 9);
    expect(reserve).toHaveBeenCalledWith(tx, 9, items, [], billingHold);
    expect(tx.paymentRequest.updateMany.mock.calls[0][0].data.reservationExpiresAt).toBeInstanceOf(Date);
  });
  it('holds nothing for a review-first order even when cash is chosen', async () => {
    tx.paymentRequest.findUnique.mockResolvedValue(bill(reviewFirst));
    await paymentRequestService.acknowledge(9, { revision: 1, paymentChoice: 'CASH' }, { id: 2 });
    expect(reserve).not.toHaveBeenCalled();
    expect(tx.paymentRequest.updateMany.mock.calls[0][0].data.reservationExpiresAt).toBeNull();
  });
  it('keeps the cash-choice hold for bills that did not come from an upload', async () => {
    tx.paymentRequest.findUnique.mockResolvedValue(bill({ sourceUploadId: null, isOnline: false }));
    await paymentRequestService.acknowledge(9, { revision: 1, paymentChoice: 'CASH' }, { id: 2 });
    expect(reserve).toHaveBeenCalledWith(tx, 9, items, []);
  });
});

describe('revising a prepared order', () => {
  it('holds the revised quantities again', async () => {
    const line = { prescriptionItemId: 1, productId: 2, quantity: d(1), unitPrice: d(100), lineTotal: d(100), product: { genericName: 'Medicine' } };
    const existing = { id: 9, revision: 2, acknowledgedRevision: 2, status: 'AWAITING_PAYMENT', reservationDurationHours: 12, reservationExpiresAt: new Date(Date.now() + 3600000), subtotal: d(100), total: d(100), tax: d(0), containerFee: d(0), discount: d(0), couponCode: null, items: [line] };
    tx.prescription.findUnique.mockResolvedValue({ id: 1, items: [{ id: 1, prescribedQuantity: d(2), dispensedQuantity: d(0) }], sourceUpload: { prepareRequested: true }, paymentRequest: existing });
    vi.spyOn(prescriptionService, 'quoteDispensing').mockResolvedValue({ ...existing, items: undefined, lines: [{ ...line, quantity: d(2), lineTotal: d(200) }], subtotal: d(200), total: d(200) });
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 9 });
    const before = Date.now();
    await paymentRequestService.update(1, { revision: 2, items: [{ prescriptionItemId: 1, quantity: 2 }], retailItems: [], tax: 0, containerFee: 0, couponCode: null, revisionReason: 'Doctor increased the quantity', reservationHours: 12 }, 5);
    expect(release).toHaveBeenCalledWith(tx, 9);
    expect(reserve).toHaveBeenCalledWith(tx, 9, items, [], billingHold);
    const { reservationExpiresAt } = tx.paymentRequest.update.mock.calls[0][0].data;
    expect(reservationExpiresAt.getTime()).toBeGreaterThanOrEqual(before + 12 * 3600000);
  });
});

describe('cashier payment for a home-delivery order', () => {
  beforeEach(() => {
    db.paymentRequest.findMany.mockResolvedValue([]);
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 9, status: 'AWAITING_PAYMENT', total: d(50), prescriptionId: 1 });
  });
  // The medicine bill has a delivery; it is not itself a delivery-fee bill.
  const medicineBillWithDelivery = (status) => tx.deliveryRequest.findUnique.mockImplementation(({ where }) => Promise.resolve(where.paymentRequestId ? { status } : null));
  it('refuses a counter handover before changing the bill', async () => {
    medicineBillWithDelivery('AWAITING_FEE');
    await expect(paymentRequestService.pay(9, 'CASH', 5, null, { confirmHandover: true, tenderedAmount: 50, changeAmount: 0 })).rejects.toThrow('home-delivery order');
    expect(tx.paymentRequest.updateMany).not.toHaveBeenCalled();
    expect(dispense).not.toHaveBeenCalled();
  });
  it('still records an ordinary payment for a delivery order', async () => {
    medicineBillWithDelivery('AWAITING_FEE');
    tx.stockReservation.count.mockResolvedValue(1);
    await paymentRequestService.pay(9, 'CASH', 5, null, { tenderedAmount: 50, changeAmount: 0 });
    expect(tx.paymentRequest.updateMany).toHaveBeenCalled();
    expect(dispense).not.toHaveBeenCalled();
  });
  it('allows handover once the delivery was cancelled for counter collection', async () => {
    medicineBillWithDelivery('CANCELLED');
    tx.stockReservation.count.mockResolvedValue(1);
    await paymentRequestService.pay(9, 'CASH', 5, null, { confirmHandover: true, tenderedAmount: 50, changeAmount: 0 });
    expect(dispense).toHaveBeenCalledTimes(1);
  });
});

describe('delivery fees are paid by bank transfer only', () => {
  const feeBill = (where) => Promise.resolve(where.feePaymentRequestId ? { id: 6 } : null);
  beforeEach(() => {
    db.paymentRequest.findMany.mockResolvedValue([]);
    tx.deliveryRequest.findUnique.mockImplementation(({ where }) => feeBill(where));
    tx.stockReservation.count.mockResolvedValue(0);
    tx.paymentRequestItem.findMany.mockResolvedValue([]);
  });
  it.each(['CASH', 'CARD', 'OTHER'])('refuses a %s payment for a delivery fee before changing the bill', async (method) => {
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 8, status: 'AWAITING_PAYMENT', total: d(350), prescriptionId: null });
    await expect(paymentRequestService.pay(8, method, 5, 'REF-1', { tenderedAmount: 350, changeAmount: 0 })).rejects.toThrow('bank transfer');
    expect(tx.paymentRequest.updateMany).not.toHaveBeenCalled();
  });
  it('lets the patient choose only bank transfer for a delivery fee', async () => {
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 8, patientId: 2, status: 'AWAITING_PAYMENT', revision: 1, items: [], prescription: null });
    await expect(paymentRequestService.acknowledge(8, { revision: 1, paymentChoice: 'CASH' }, { id: 2 })).rejects.toThrow('bank transfer');
    expect(tx.paymentRequest.updateMany).not.toHaveBeenCalled();
    await paymentRequestService.acknowledge(8, { revision: 1, paymentChoice: 'BANK_TRANSFER' }, { id: 2 });
    expect(tx.paymentRequest.updateMany.mock.calls[0][0].data.customerPaymentChoice).toBe('BANK_TRANSFER');
  });
  it('still lets a medicine bill be paid in cash', async () => {
    tx.deliveryRequest.findUnique.mockResolvedValue(null);
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 9, status: 'AWAITING_PAYMENT', total: d(50), prescriptionId: 1 });
    await paymentRequestService.pay(9, 'CASH', 5, null, { tenderedAmount: 50, changeAmount: 0 });
    expect(tx.paymentRequest.updateMany).toHaveBeenCalled();
  });
});

describe('home-delivery orders do not use a collection PIN', () => {
  beforeEach(() => {
    db.paymentRequest.findMany.mockResolvedValue([]);
    tx.stockReservation.count.mockResolvedValue(1);
  });
  const paidData = () => tx.paymentRequest.updateMany.mock.calls[0][0].data;
  it('issues no PIN when a delivery order\'s medicine bill is paid', async () => {
    tx.deliveryRequest.findUnique.mockImplementation(({ where }) => Promise.resolve(where.paymentRequestId ? { status: 'AWAITING_FEE' } : null));
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 9, status: 'AWAITING_PAYMENT', total: d(50), prescriptionId: 1 });
    const result = await paymentRequestService.pay(9, 'CASH', 5, null, { tenderedAmount: 50, changeAmount: 0 });
    expect(result.pickupPin).toBeNull();
    expect(paidData()).toMatchObject({ pickupPinHash: null, pickupPinEncrypted: null });
  });
  it('issues no PIN for a delivery-fee bill', async () => {
    tx.deliveryRequest.findUnique.mockImplementation(({ where }) => Promise.resolve(where.feePaymentRequestId ? { id: 6 } : null));
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 8, status: 'AWAITING_PAYMENT', total: d(350), prescriptionId: null });
    tx.paymentRequestItem.findMany.mockResolvedValue([]);
    const result = await paymentRequestService.pay(8, 'BANK_TRANSFER', 5, 'BT-77', {});
    expect(result.pickupPin).toBeNull();
    expect(paidData().pickupPinHash).toBeNull();
  });
  it('still issues a PIN once the delivery was cancelled for counter collection', async () => {
    tx.deliveryRequest.findUnique.mockImplementation(({ where }) => Promise.resolve(where.paymentRequestId ? { status: 'CANCELLED' } : null));
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 9, status: 'AWAITING_PAYMENT', total: d(50), prescriptionId: 1 });
    const result = await paymentRequestService.pay(9, 'CASH', 5, null, { tenderedAmount: 50, changeAmount: 0 });
    expect(result.pickupPin).toMatch(/^\d{6}$/);
    expect(paidData().pickupPinHash).toEqual(expect.any(String));
  });
  it('refuses to reissue a PIN for a delivery order', async () => {
    tx.deliveryRequest.findUnique.mockImplementation(({ where }) => Promise.resolve(where.paymentRequestId ? { status: 'DISPATCHED' } : null));
    await expect(paymentRequestService.resetPickupPin(9, 'Customer lost receipt', { id: 1, role: 'ADMIN' })).rejects.toThrow('do not use a collection PIN');
    expect(tx.paymentRequest.updateMany).not.toHaveBeenCalled();
  });
});
