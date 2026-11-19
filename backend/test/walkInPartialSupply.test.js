// Over-the-counter (walk-in) prescriptions may be supplied in part; uploaded
// orders are always billed in full. A partly supplied balance can be closed.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
import { paymentRequestService } from '../src/services/paymentRequest.service.js';
import { prescriptionService } from '../src/services/prescription.service.js';

const { db, tx, settings } = vi.hoisted(() => {
  const model = () => ({ findUnique: vi.fn(), findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), updateMany: vi.fn(), count: vi.fn(), deleteMany: vi.fn(), createMany: vi.fn() });
  const client = () => Object.fromEntries(['prescription', 'prescriptionItem', 'prescriptionUpload', 'paymentRequest', 'paymentRequestItem', 'paymentRequestEvent', 'paymentSlip', 'deliveryRequest', 'auditLog', 'stockReservation'].map((key) => [key, model()]));
  return { db: { ...client(), $transaction: vi.fn() }, tx: client(), settings: vi.fn() };
});
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
vi.mock('../src/utils/stock.js', () => ({ releaseReservations: vi.fn(), reserveStock: vi.fn(), usableStockTotal: vi.fn(), consumePaymentRequestStock: vi.fn() }));
vi.mock('../src/services/operationSettings.service.js', () => ({ operationSettingsService: { get: settings }, batchAllocationOrder: () => [] }));

const d = (n) => new Prisma.Decimal(n);
const item = (id, prescribed, dispensed = 0, cancelled = 0) => ({ id, prescribedQuantity: d(prescribed), dispensedQuantity: d(dispensed), cancelledQuantity: d(cancelled) });
const quote = { subtotal: d(50), discount: d(0), containerFee: d(0), tax: d(0), total: d(50), lines: [] };

beforeEach(() => {
  vi.restoreAllMocks(); vi.resetAllMocks();
  db.$transaction.mockImplementation((callback) => callback(tx));
  settings.mockResolvedValue({ cashReservationHours: 24 });
  vi.spyOn(prescriptionService, 'quoteDispensing').mockResolvedValue(quote);
  tx.paymentRequest.create.mockResolvedValue({ id: 9, prescription: { sourceUploadId: null } });
});

describe('billing a walk-in prescription', () => {
  const walkIn = (items) => tx.prescription.findUnique.mockResolvedValue({ id: 1, status: 'VERIFIED', sourceUploadId: null, patient: { userId: 2 }, items, paymentRequest: null });
  it('bills less than the remaining quantity when stock is short, and records why', async () => {
    walkIn([item(11, 30), item(12, 10)]);
    await paymentRequestService.create(1, { items: [{ prescriptionItemId: 11, quantity: 20 }, { prescriptionItemId: 12, quantity: 10 }], partialSupply: [{ prescriptionItemId: 11, reason: 'OUT_OF_STOCK', issueLater: true }] }, 5, tx);
    expect(tx.paymentRequest.create).toHaveBeenCalled();
    const { lines } = tx.paymentRequestEvent.create.mock.calls[0][0].data.details;
    expect(tx.paymentRequestEvent.create.mock.calls[0][0].data.kind).toBe('PARTIAL_SUPPLY_RECORDED');
    expect(lines).toEqual([
      expect.objectContaining({ prescriptionItemId: 11, prescribedQuantity: '30', suppliedBeforeQuantity: '0', billedQuantity: '20', shortQuantity: '10', reason: 'OUT_OF_STOCK', issueLater: true }),
      expect.objectContaining({ prescriptionItemId: 12, prescribedQuantity: '10', billedQuantity: '10', shortQuantity: '0' }),
    ]);
    expect(lines[1]).not.toHaveProperty('reason');
  });
  it('leaves a medicine off this bill entirely when the customer does not want it', async () => {
    walkIn([item(11, 30), item(12, 10)]);
    await paymentRequestService.create(1, { items: [{ prescriptionItemId: 11, quantity: 30 }], partialSupply: [{ prescriptionItemId: 12, reason: 'CUSTOMER_REQUEST', issueLater: false }] }, 5, tx);
    expect(tx.paymentRequestEvent.create.mock.calls[0][0].data.details.lines).toContainEqual(expect.objectContaining({ prescriptionItemId: 12, shortQuantity: '10', reason: 'CUSTOMER_REQUEST', issueLater: false }));
  });
  it('requires the reason and the later-issue choice for every short medicine', async () => {
    walkIn([item(11, 30), item(12, 10)]);
    await expect(paymentRequestService.create(1, { items: [{ prescriptionItemId: 11, quantity: 20 }, { prescriptionItemId: 12, quantity: 5 }], partialSupply: [{ prescriptionItemId: 11, reason: 'OUT_OF_STOCK', issueLater: true }] }, 5, tx)).rejects.toThrow('whether the rest will be issued later');
    expect(tx.paymentRequest.create).not.toHaveBeenCalled();
  });
  it('records nothing for a bill issued in full', async () => {
    walkIn([item(11, 30)]);
    await paymentRequestService.create(1, { items: [{ prescriptionItemId: 11, quantity: 30 }] }, 5, tx);
    expect(tx.paymentRequestEvent.create).not.toHaveBeenCalled();
  });
  it('requires at least one prescribed medicine on the bill', async () => {
    walkIn([item(11, 30)]);
    await expect(paymentRequestService.create(1, { items: [], retailItems: [{ productId: 4, quantity: 1 }] }, 5, tx)).rejects.toThrow('at least one prescribed medicine');
    expect(tx.paymentRequest.create).not.toHaveBeenCalled();
  });
  it('bills the rest of a partly supplied prescription later', async () => {
    tx.prescription.findUnique.mockResolvedValue({ id: 1, status: 'PARTIALLY_DISPENSED', sourceUploadId: null, patient: { userId: 2 }, items: [item(11, 30, 20)], paymentRequest: { id: 8, status: 'FULFILLED' } });
    tx.deliveryRequest.findUnique.mockResolvedValue(null);
    await paymentRequestService.create(1, { items: [{ prescriptionItemId: 11, quantity: 10 }] }, 5, tx);
    expect(tx.paymentRequest.create).toHaveBeenCalled();
  });
});

describe('bill shows the balance and its reason', () => {
  const rx = (dispensed = 0, cancelled = 0) => ({ ...item(11, 20, dispensed, cancelled), product: { genericName: 'Amoxicillin', strength: 'N/A', unit: 'capsule' } });
  const decision = (issueLater) => ({ kind: 'PARTIAL_SUPPLY_RECORDED', details: { lines: [{ prescriptionItemId: 11, shortQuantity: '10', reason: issueLater ? 'OUT_OF_STOCK' : 'CUSTOMER_REQUEST', issueLater }] } });
  it('lists an out-of-stock shortfall as balance to collect later', async () => {
    db.paymentRequest.findUnique.mockResolvedValue({ id: 9, patientId: 2, status: 'AWAITING_PAYMENT', items: [{ prescriptionItemId: 11, quantity: d(10) }], events: [decision(true)], prescription: { items: [rx()] } });
    const bill = await paymentRequestService.get(9, { id: 5, role: 'CASHIER' });
    expect(bill.balanceToCollect).toEqual([{ prescriptionItemId: 11, name: 'Amoxicillin', quantity: '10', unit: 'capsule', reason: 'not enough stock' }]);
    expect(bill.notToBeIssued).toEqual([]);
  });
  it('lists a shortfall the customer does not want as not to be issued, before and after dispensing', async () => {
    db.paymentRequest.findUnique.mockResolvedValue({ id: 9, patientId: 2, status: 'PAID', items: [{ prescriptionItemId: 11, quantity: d(10) }], events: [decision(false)], prescription: { items: [rx()] } });
    let bill = await paymentRequestService.get(9, { id: 5, role: 'CASHIER' });
    expect(bill.balanceToCollect).toEqual([]);
    expect(bill.notToBeIssued).toEqual([expect.objectContaining({ quantity: '10', reason: 'customer asked for less' })]);
    db.paymentRequest.findUnique.mockResolvedValue({ id: 9, patientId: 2, status: 'FULFILLED', items: [{ prescriptionItemId: 11, quantity: d(10) }], events: [decision(false)], prescription: { items: [rx(10, 10)] } });
    bill = await paymentRequestService.get(9, { id: 5, role: 'CASHIER' });
    expect(bill.notToBeIssued).toEqual([expect.objectContaining({ quantity: '10' })]);
    expect(bill.balanceToCollect).toEqual([]);
  });
});

describe('billing an uploaded order', () => {
  it('still requires the full remaining quantity', async () => {
    tx.prescription.findUnique.mockResolvedValue({ id: 1, status: 'VERIFIED', sourceUploadId: 4, patient: { userId: 2 }, items: [item(11, 30)], paymentRequest: null });
    await expect(paymentRequestService.create(1, { items: [{ prescriptionItemId: 11, quantity: 20 }] }, 5, tx)).rejects.toThrow('Every remaining prescribed item');
    expect(tx.paymentRequest.create).not.toHaveBeenCalled();
  });
});

describe('closing a remaining balance', () => {
  const partly = (extra = {}) => ({ id: 1, status: 'PARTIALLY_DISPENSED', items: [
    { ...item(11, 30, 20), notes: null, product: { genericName: 'Amoxicillin' } },
    { ...item(12, 10, 10), notes: null, product: { genericName: 'Paracetamol' } },
  ], paymentRequest: { status: 'FULFILLED' }, ...extra });
  beforeEach(() => {
    tx.prescriptionItem.findUnique.mockImplementation(({ where }) => Promise.resolve(partly().items.find((line) => line.id === where.id)));
    tx.prescriptionItem.updateMany.mockResolvedValue({ count: 1 });
    tx.prescription.updateMany.mockResolvedValue({ count: 1 });
  });
  it('records only the unsupplied quantity and closes the prescription', async () => {
    tx.prescription.findUnique.mockResolvedValue(partly());
    await prescriptionService.closeBalance(1, 'Customer will not return', 5);
    expect(tx.prescriptionItem.updateMany).toHaveBeenCalledTimes(1);
    expect(tx.prescriptionItem.updateMany.mock.calls[0][0]).toMatchObject({ where: { id: 11 }, data: { cancelledQuantity: { increment: d(10) } } });
    expect(tx.prescription.updateMany).toHaveBeenCalledWith({ where: { id: 1, status: 'PARTIALLY_DISPENSED' }, data: { status: 'DISPENSED' } });
    expect(tx.auditLog.create).toHaveBeenCalledWith({ data: expect.objectContaining({ action: 'PRESCRIPTION_BALANCE_CLOSED', details: { reason: 'Customer will not return', closed: [{ prescriptionItemId: 11, medicine: 'Amoxicillin', quantity: '10' }] } }) });
  });
  it.each(['VERIFIED', 'DISPENSED', 'CANCELLED'])('refuses a %s prescription', async (status) => {
    tx.prescription.findUnique.mockResolvedValue(partly({ status }));
    await expect(prescriptionService.closeBalance(1, 'Customer will not return', 5)).rejects.toMatchObject({ statusCode: 409 });
    expect(tx.prescriptionItem.updateMany).not.toHaveBeenCalled();
  });
  it.each(['AWAITING_PAYMENT', 'SLIP_SUBMITTED', 'PAID'])('refuses while the remainder has a %s bill', async (status) => {
    tx.prescription.findUnique.mockResolvedValue(partly({ paymentRequest: { status } }));
    await expect(prescriptionService.closeBalance(1, 'Customer will not return', 5)).rejects.toThrow('active bill');
    expect(tx.prescriptionItem.updateMany).not.toHaveBeenCalled();
  });
});
