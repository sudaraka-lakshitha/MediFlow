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
