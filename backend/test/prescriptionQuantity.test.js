import { describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
import { cancelPrescriptionQuantity, remainingPrescriptionQuantity } from '../src/utils/prescriptionQuantity.js';
import { dispenseQuoteSchema, dispenseSchema, paymentRequestSchema } from '../src/validators/prescription.validator.js';

const decimal = (value) => new Prisma.Decimal(value);

describe('cancelled prescription quantities', () => {
  it('records only the cancelled bill quantity without changing actual supply', async () => {
    const item = { id: 8, prescribedQuantity: decimal(10), dispensedQuantity: decimal(3), cancelledQuantity: decimal(2), notes: 'Original note' };
    const tx = { prescriptionItem: {
      findUnique: vi.fn().mockResolvedValue(item),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    } };
    await cancelPrescriptionQuantity(tx, { prescriptionItemId: 8, quantity: 4 }, 'Customer declined');
    const { data, where } = tx.prescriptionItem.updateMany.mock.calls[0][0];
    expect(data).not.toHaveProperty('dispensedQuantity');
    expect(Number(data.cancelledQuantity.increment)).toBe(4);
    expect(data.notes).toBe('Original note | Cancelled from bill: Customer declined');
    expect(where.dispensedQuantity).toEqual(decimal(3));
    expect(where.cancelledQuantity).toEqual(decimal(2));
    expect(Number(remainingPrescriptionQuantity({ ...item, cancelledQuantity: decimal(6) }))).toBe(1);
  });

  it.each([0, -1, 6])('rejects invalid cancellation quantity %s without writing', async (quantity) => {
    const tx = { prescriptionItem: {
      findUnique: vi.fn().mockResolvedValue({ id: 8, prescribedQuantity: decimal(10), dispensedQuantity: decimal(3), cancelledQuantity: decimal(2) }),
      updateMany: vi.fn(),
    } };
    await expect(cancelPrescriptionQuantity(tx, { prescriptionItemId: 8, quantity }, 'Declined')).rejects.toThrow('Cancelled quantity exceeds');
    expect(tx.prescriptionItem.updateMany).not.toHaveBeenCalled();
  });

  it('rejects a concurrent quantity change', async () => {
    const tx = { prescriptionItem: {
      findUnique: vi.fn().mockResolvedValue({ id: 8, prescribedQuantity: decimal(10), dispensedQuantity: decimal(0), cancelledQuantity: decimal(0) }),
      updateMany: vi.fn().mockResolvedValue({ count: 0 }),
    } };
    await expect(cancelPrescriptionQuantity(tx, { prescriptionItemId: 8, quantity: 10 }, 'Declined')).rejects.toThrow('quantity changed');
  });

  it('calculates exact fractional remainder and excludes cancelled units', () => {
    expect(remainingPrescriptionQuantity({ prescribedQuantity: '0.3', dispensedQuantity: '0.1', cancelledQuantity: '0.2' }).toString()).toBe('0');
    expect(remainingPrescriptionQuantity({ prescribedQuantity: '10', dispensedQuantity: '3', cancelledQuantity: '7' }).toString()).toBe('0');
  });

  for (const [name, schema] of Object.entries({ bill: paymentRequestSchema, quote: dispenseQuoteSchema, dispense: dispenseSchema })) {
    it(`${name} permits retained retail items after all medicine lines are cancelled`, () => {
      expect(schema.safeParse({ items: [], retailItems: [{ productId: 41, quantity: 1 }] }).success).toBe(true);
      expect(schema.safeParse({ items: [], retailItems: [] }).success).toBe(false);
    });
  }
});
