import { describe, expect, it } from 'vitest';
import { expiredStockDispositionSchema } from '../src/validators/inventory.validator.js';
import { lowStockState } from '../src/utils/lowStock.js';

describe('expired stock disposition validation', () => {
  it('accepts a documented discard', () => {
    const result = expiredStockDispositionSchema.parse({
      action: 'DISCARDED',
      quantity: 12,
      reason: 'Transferred to the approved pharmaceutical waste container.',
    });
    expect(result.quantity).toBe(12);
  });

  it('requires a destination for returned expired stock', () => {
    const result = expiredStockDispositionSchema.safeParse({
      action: 'RETURNED_TO_SUPPLIER',
      quantity: 5,
      reason: 'Return authorized by the supplier.',
    });
    expect(result.success).toBe(false);
  });

  it('accepts a manufacturer return with its destination', () => {
    const result = expiredStockDispositionSchema.parse({
      action: 'RETURNED_TO_MANUFACTURER',
      quantity: 5,
      destinationName: 'Example Pharma Ltd',
      reason: 'Manufacturer recall and expired stock return.',
    });
    expect(result.destinationName).toBe('Example Pharma Ltd');
  });
});

describe('low-stock acknowledgement state', () => {
  const product = (stockLevel, acknowledgedLevel = null) => ({
    reorderLevel: 100,
    batches: [{ quantityAvailable: stockLevel }],
    lowStockAcknowledgement: acknowledgedLevel == null ? null : { stockLevel: acknowledgedLevel },
  });

  it('suppresses attention when the acknowledged stock level has not changed', () => {
    expect(lowStockState(product(40, 40))).toMatchObject({ lowStock: true, acknowledged: true, requiresAttention: false });
  });

  it('reactivates attention after the usable stock level changes', () => {
    expect(lowStockState(product(30, 40))).toMatchObject({ lowStock: true, acknowledged: false, requiresAttention: true });
  });

  it('does not require attention after stock exceeds the reorder level', () => {
    expect(lowStockState(product(101, 40))).toMatchObject({ lowStock: false, requiresAttention: false });
  });
});
