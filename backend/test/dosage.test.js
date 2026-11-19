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

  it('rounds a quarter-tablet course up to whole tablets', () => {
    // The instruction can be a quarter tablet; the pharmacy still hands over whole ones.
    const result = calculateQuantity('tablet', { quantityPerDose: 0.25, timesPerDay: 3, daysSupply: 10 });
    expect(result.calculated.toString()).toBe('8');
  });

  // Regression: only tablet/capsule used to round, so a pack/box/piece course could be
  // stored as a fraction - and the pharmacist's screen rounded a different set of units
  // than the server did, so the previewed total silently disagreed with the saved one.
  it.each(['pack', 'box', 'piece', 'bottle', 'can', 'pair', 'puff', 'patch', 'sachet', 'suppository'])(
    'rounds countable unit "%s" up to a whole number',
    (unit) => {
      const result = calculateQuantity(unit, { quantityPerDose: 1.5, timesPerDay: 1, daysSupply: 1 });
      expect(result.calculated.toString()).toBe('2');
    },
  );

  it('leaves measured-out units fractional', () => {
    expect(calculateQuantity('ml', { quantityPerDose: 2.5, timesPerDay: 1, daysSupply: 3 }).calculated.toString()).toBe('7.5');
    expect(calculateQuantity('g', { quantityPerDose: 0.5, timesPerDay: 1, daysSupply: 3 }).calculated.toString()).toBe('1.5');
  });

  it('converts a liquid course volume into whole 100 mL bottles', () => {
    const result = calculateQuantity('bottle', {
      quantityPerDose: 150, timesPerDay: 3, daysSupply: 3,
    }, { liquid: true, packVolumeMl: 100 });
    expect(result.calculated.toString()).toBe('14');
    expect(result.prescribed.toString()).toBe('14');
  });

  it('requires a known container volume when a liquid is stocked by bottle', () => {
    expect(() => calculateQuantity('bottle', {
      quantityPerDose: 5, timesPerDay: 3, daysSupply: 5,
    }, { liquid: true })).toThrow(/container size/);
  });

  it('treats an unknown unit as countable so nothing fractional slips through', () => {
    expect(calculateQuantity('', { quantityPerDose: 2.25, timesPerDay: 1, daysSupply: 1 }).calculated.toString()).toBe('3');
  });

  it('rejects a fractional override on a countable unit', () => {
    expect(() => calculateQuantity('box', {
      quantityPerDose: 1, timesPerDay: 1, daysSupply: 1, overrideQuantity: 2.5, overrideReason: 'partial pack',
    })).toThrow(/whole numbers/);
  });
});
