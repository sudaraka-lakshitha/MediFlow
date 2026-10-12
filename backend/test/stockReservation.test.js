import { Prisma } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { consumePaymentRequestStock } from '../src/utils/stock.js';

const decimal = (value) => new Prisma.Decimal(value);

const legacyTransaction = ({ available = 10, reserved = 8 } = {}) => ({
  stockReservation: {
    findMany: vi.fn().mockResolvedValue([]),
    deleteMany: vi.fn(),
  },
  inventoryBatch: {
    findMany: vi.fn().mockResolvedValue([{
      id: 31,
      productId: 7,
      quantityAvailable: decimal(available),
      quantityReserved: decimal(reserved),
      purchasePrice: decimal(20),
      expiryDate: new Date(Date.now() + 86_400_000),
      restricted: false,
    }]),
    update: vi.fn(),
  },
  product: {
    findUnique: vi.fn().mockResolvedValue({ genericName: 'Reserved medicine' }),
  },
});

describe('stock reservation safety', () => {
  it.each([
    { available: 100, otherHold: 4, quantities: [2, 3], expected: 95 },
    { available: 10, otherHold: 1, quantities: [0.25, 1.5], expected: 8.25 },
    { available: 5, otherHold: 0, quantities: [2, 3], expected: 0 },
  ])('deducts shared-batch lines cumulatively: $quantities', async ({ available, otherHold, quantities, expected }) => {
    const batch = {
      id: 31, productId: 7, quantityAvailable: decimal(available),
      quantityReserved: quantities.reduce((sum, quantity) => sum.add(quantity), decimal(otherHold)),
      purchasePrice: decimal(20), expiryDate: new Date('2099-01-01'), restricted: false,
    };
    const items = quantities.map((quantity, index) => ({ id: 91 + index, productId: 7, quantity: decimal(quantity) }));
    const reservations = items.map((item) => ({
      paymentRequestItemId: item.id, batchId: batch.id, quantity: item.quantity,
    }));
    const tx = {
      stockReservation: {
        findMany: vi.fn(async () => reservations.map((reservation) => ({ ...reservation, batch: { ...batch } }))),
        deleteMany: vi.fn(),
      },
      inventoryBatch: {
        update: vi.fn(async ({ data }) => {
          batch.quantityAvailable = data.quantityAvailable.decrement !== undefined
            ? batch.quantityAvailable.sub(data.quantityAvailable.decrement)
            : data.quantityAvailable;
          batch.quantityReserved = batch.quantityReserved.sub(data.quantityReserved.decrement);
          return { ...batch };
        }),
      },
    };
    const consumed = await consumePaymentRequestStock(tx, { id: 90, items }, [{ expiryDate: 'asc' }]);
    expect(batch.quantityAvailable.toNumber()).toBe(expected);
    expect(batch.quantityReserved.toNumber()).toBe(otherHold);
    expect(consumed).toHaveLength(items.length);
    let balance = decimal(available);
    consumed.forEach((entry, index) => {
      expect(entry.paymentRequestItemId).toBe(items[index].id);
      expect(entry.quantityBefore.equals(balance)).toBe(true);
      balance = balance.sub(items[index].quantity);
      expect(entry.quantityAfter.equals(balance)).toBe(true);
    });
    expect(tx.stockReservation.deleteMany).toHaveBeenCalledWith({ where: { paymentRequestId: 90 } });
  });

  it('does not let a legacy paid bill consume units held for another customer', async () => {
    const tx = legacyTransaction();
    await expect(consumePaymentRequestStock(tx, {
      id: 90,
      items: [{ id: 91, productId: 7, quantity: decimal(3) }],
    }, [{ expiryDate: 'asc' }])).rejects.toMatchObject({ statusCode: 409 });
    expect(tx.inventoryBatch.update).not.toHaveBeenCalled();
  });

  it('can consume only the unreserved balance and preserves the other hold', async () => {
    const tx = legacyTransaction();
    const consumed = await consumePaymentRequestStock(tx, {
      id: 90,
      items: [{ id: 91, productId: 7, quantity: decimal(2) }],
    }, [{ expiryDate: 'asc' }]);
    expect(consumed).toHaveLength(1);
    expect(consumed[0].quantityAfter.toNumber()).toBe(8);
    expect(tx.inventoryBatch.update).toHaveBeenCalledWith({
      where: { id: 31 },
      data: { quantityAvailable: expect.objectContaining({}) },
    });
  });
});
