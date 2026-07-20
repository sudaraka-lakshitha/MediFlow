import { describe, expect, it } from 'vitest';
import { calculateQuantity } from '../src/utils/dosage.js';

describe('prescription quantity calculation', () => {
  it('calculates ml without losing decimal precision', () => {
    const result = calculateQuantity('ml', { quantityPerDose: 2.5, timesPerDay: 3, daysSupply: 5 });
    expect(result.calculated.toString()).toBe('37.5');
    expect(result.prescribed.toString()).toBe('37.5');
  });

  it('rounds discrete tablet totals up to a whole unit', () => {
    const result = calculateQuantity('tablet', { quantityPerDose: 0.5, timesPerDay: 1, daysSupply: 9 });
    expect(result.calculated.toString()).toBe('5');
  });

  it('stores a reasoned override separately from the automatic result', () => {
    const result = calculateQuantity('capsule', { quantityPerDose: 1, timesPerDay: 3, daysSupply: 5, overrideQuantity: 12, overrideReason: 'Starter pack supplied' });
    expect(result.calculated.toString()).toBe('15');
    expect(result.prescribed.toString()).toBe('12');
    expect(result.overridden).toBe(true);
  });
});
