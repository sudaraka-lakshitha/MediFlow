import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { performPrescriptionDispense } from '../src/utils/prescriptionDispense.js';
import { consumePaymentRequestStock } from '../src/utils/stock.js';

vi.mock('../src/utils/stock.js', () => ({ consumePaymentRequestStock: vi.fn() }));
vi.mock('../src/services/operationSettings.service.js', () => ({
  operationSettingsService: { get: vi.fn().mockResolvedValue({ allocationMethod: 'FEFO' }) },
  batchAllocationOrder: vi.fn().mockReturnValue([]),
}));

const d = (value) => new Prisma.Decimal(value);
const transaction = (quantity = 3) => ({
  paymentRequest: {
    findFirst: vi.fn().mockResolvedValue({ id: 9, status: 'PAID', items: [{ id: 11, prescriptionItemId: 8, productId: 1, quantity: d(quantity), unitPrice: d(10) }], subtotal: d(30), discount: d(0), containerFee: d(0), tax: d(0), total: d(30), amountPaid: d(30), paymentMethod: 'CASH' }),
    updateMany: vi.fn().mockResolvedValue({ count: 1 }),
  },
  prescription: {
    findUnique: vi.fn().mockResolvedValue({ status: 'VERIFIED', patient: { userId: 2 }, items: [{ id: 8, prescribedQuantity: d(5), dispensedQuantity: d(0), cancelledQuantity: d(2), product: { genericName: 'Medicine' } }] }),
    update: vi.fn(),
  },
  prescriptionItem: {
    update: vi.fn(),
    findMany: vi.fn().mockResolvedValue([{ prescribedQuantity: d(5), dispensedQuantity: d(3), cancelledQuantity: d(2) }]),
  },
  dispensing: { create: vi.fn().mockResolvedValue({ id: 1 }) },
  dispensingItem: { create: vi.fn() },
  lowStockAcknowledgement: { deleteMany: vi.fn() },
  stockMovement: { create: vi.fn() },
  sale: { create: vi.fn().mockResolvedValue({ id: 1, invoiceNumber: 'INV-1', status: 'PAID' }) },
});

describe('dispensing after partial cancellation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    consumePaymentRequestStock.mockResolvedValue([{ paymentRequestItemId: 11, productId: 1, batchId: 4, quantity: d(3), quantityBefore: d(10), quantityAfter: d(7), unitCost: d(5) }]);
  });

  it('completes the remaining supply while recording only physically supplied quantities', async () => {
    const tx = transaction();
    const result = await performPrescriptionDispense(tx, { prescriptionId: 1, paymentRequestId: 9, performedById: 3 });
    expect(result.prescriptionStatus).toBe('DISPENSED');
    expect(tx.prescriptionItem.update).toHaveBeenCalledWith({ where: { id: 8 }, data: { dispensedQuantity: { increment: d(3) } } });
    expect(tx.dispensingItem.create.mock.calls[0][0].data.quantity).toEqual(d(3));
  });

  it('rejects a stale bill that still includes cancelled units before consuming stock', async () => {
    const tx = transaction(5);
    await expect(performPrescriptionDispense(tx, { prescriptionId: 1, paymentRequestId: 9, performedById: 3 })).rejects.toThrow('quantity exceeds the prescribed remainder');
    expect(consumePaymentRequestStock).not.toHaveBeenCalled();
    expect(tx.prescriptionItem.update).not.toHaveBeenCalled();
  });
  it('rejects a PIN reissued after the initial collection check', async () => {
    const tx = transaction();
    await expect(performPrescriptionDispense(tx, { prescriptionId: 1, paymentRequestId: 9, performedById: 3, expectedPickupPinHash: 'old-pin-hash' })).rejects.toThrow('PIN changed or was locked');
    expect(consumePaymentRequestStock).not.toHaveBeenCalled();
    expect(tx.paymentRequest.updateMany).not.toHaveBeenCalled();
  });
});

describe('dispensing a walk-in bill issued in part', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    consumePaymentRequestStock.mockResolvedValue([{ paymentRequestItemId: 11, productId: 1, batchId: 4, quantity: d(3), quantityBefore: d(10), quantityAfter: d(7), unitCost: d(5) }]);
  });
  const partialTransaction = (issueLater) => {
    const tx = transaction();
    tx.prescription.findUnique.mockResolvedValue({ status: 'VERIFIED', patient: { userId: 2 }, items: [{ id: 8, prescribedQuantity: d(10), dispensedQuantity: d(0), cancelledQuantity: d(0), product: { genericName: 'Medicine' } }] });
    tx.paymentRequestEvent = { findMany: vi.fn().mockResolvedValue([{ kind: 'PARTIAL_SUPPLY_RECORDED', details: { lines: [{ prescriptionItemId: 8, shortQuantity: '7', reason: 'CUSTOMER_REQUEST', issueLater }] } }]) };
    tx.prescriptionItem.findUnique = vi.fn().mockResolvedValue({ id: 8, prescribedQuantity: d(10), dispensedQuantity: d(3), cancelledQuantity: d(0), notes: null });
    tx.prescriptionItem.updateMany = vi.fn().mockResolvedValue({ count: 1 });
    return tx;
  };
  it('closes the rest when the customer does not want it', async () => {
    const tx = partialTransaction(false);
    tx.prescriptionItem.findMany.mockResolvedValue([{ prescribedQuantity: d(10), dispensedQuantity: d(3), cancelledQuantity: d(7) }]);
    const result = await performPrescriptionDispense(tx, { prescriptionId: 1, paymentRequestId: 9, performedById: 3 });
    expect(tx.prescriptionItem.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ id: 8 }), data: expect.objectContaining({ cancelledQuantity: { increment: d(7) } }) }));
    expect(tx.prescriptionItem.updateMany.mock.calls[0][0].data.notes).toContain('Not issued - customer asked for less');
    expect(result.prescriptionStatus).toBe('DISPENSED');
  });
  it('keeps the rest pending when it will be issued later', async () => {
    const tx = partialTransaction(true);
    tx.prescriptionItem.findMany.mockResolvedValue([{ prescribedQuantity: d(10), dispensedQuantity: d(3), cancelledQuantity: d(0) }]);
    const result = await performPrescriptionDispense(tx, { prescriptionId: 1, paymentRequestId: 9, performedById: 3 });
    expect(tx.prescriptionItem.updateMany).not.toHaveBeenCalled();
    expect(result.prescriptionStatus).toBe('PARTIALLY_DISPENSED');
  });
});
