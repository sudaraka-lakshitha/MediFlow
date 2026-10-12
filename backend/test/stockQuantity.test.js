import { describe, expect, it } from 'vitest';
import { stockQuantity } from '../src/utils/stockQuantity.js';
import { calculateQuantity } from '../src/utils/dosage.js';
import { stockQuantityStep } from '../../frontend/src/utils/unitMeasure.ts';

describe('unit-aware stock quantities and UI increments', () => {
  it.each(['tablet', 'capsule', 'piece', 'pack', 'bottle', 'box', 'pair', 'sachet', ' CAN ', '', null])('requires whole stock units for %s', (unit) => {
    expect(stockQuantity(2, unit).toString()).toBe('2');
    expect(() => stockQuantity('0.5', unit)).toThrow(/whole numbers/);
    expect(stockQuantityStep(unit)).toBe(1);
  });
  it.each(['ml', 'ML', ' millilitres ', 'l', 'g', 'gram', 'mg', 'mcg', 'kg'])('supports measured stock for %s', (unit) => {
    expect(stockQuantity('0.125', unit).toString()).toBe('0.125');
    expect(stockQuantityStep(unit)).toBe(0.001);
  });
  it.each([0, -1, '', null, undefined, NaN, Infinity, 'NaN', 'Infinity', 'bad', '0.0001', '1.0001', '1000000000'])('rejects invalid/out-of-storage-range quantity %s', (value) => {
    expect(() => stockQuantity(value, 'ml')).toThrow();
  });
  it('allows signed adjustments, but not fractional countable adjustments or zero', () => {
    expect(stockQuantity(-2, 'piece', { signed: true }).toString()).toBe('-2');
    expect(stockQuantity('-0.125', 'ml', { signed: true }).toString()).toBe('-0.125');
    expect(() => stockQuantity('-.001', 'piece', { signed: true })).toThrow(/whole numbers/);
    expect(() => stockQuantity(0, 'ml', { signed: true })).toThrow(/non-zero/);
  });
  it('preserves fractional doses while validating final stock quantities', () => {
    expect(calculateQuantity('tablet', { quantityPerDose: .5, timesPerDay: 1, daysSupply: 3 }).prescribed.toString()).toBe('2');
    expect(calculateQuantity('ml', { quantityPerDose: .125, timesPerDay: 1, daysSupply: 3 }).prescribed.toString()).toBe('0.375');
    expect(() => calculateQuantity('ml', { quantityPerDose: .0001, timesPerDay: 1, daysSupply: 1 })).toThrow(/three decimal/);
  });
});
