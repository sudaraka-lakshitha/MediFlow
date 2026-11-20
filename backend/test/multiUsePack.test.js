import { describe, expect, it } from 'vitest';
import { calculateQuantity } from '../src/utils/dosage.js';
import { isMultiUsePack } from '../src/utils/multiUsePack.js';
import { liquidPackVolumeMl } from '../src/utils/liquidPackaging.js';

const course = { quantityPerDose: 1, timesPerDay: 3, daysSupply: 7 };

describe('multi-use packs (tubes, drop bottles, sprays, inhalers)', () => {
  it('recognises creams, gels, drops and inhalers, but not tablets or syrups', () => {
    expect(isMultiUsePack({ unit: 'tube', dosageForm: 'Cream' })).toBe(true);
    expect(isMultiUsePack({ unit: 'tube', dosageForm: 'Gel' })).toBe(true);
    expect(isMultiUsePack({ unit: 'bottle', dosageForm: 'Drops' })).toBe(true);
    expect(isMultiUsePack({ unit: 'puff', dosageForm: 'Inhaler' })).toBe(true);
    expect(isMultiUsePack({ unit: 'tablet', dosageForm: 'Tablet' })).toBe(false);
    expect(isMultiUsePack({ unit: 'bottle', dosageForm: 'Syrup' })).toBe(false);
    expect(isMultiUsePack({ unit: 'ml', dosageForm: 'Drops' })).toBe(false);
  });

  it('gives 1 tube for "apply 3 times a day for 7 days", not 21', () => {
    const result = calculateQuantity('tube', course, { multiUse: true });
    expect(Number(result.prescribed)).toBe(1);
    expect(result.overridden).toBe(false);
  });

  it('lets the pharmacist choose 2 inhalers without a reason', () => {
    const result = calculateQuantity('puff', { ...course, quantityPerDose: 2, overrideQuantity: 2 }, { multiUse: true });
    expect(Number(result.prescribed)).toBe(2);
    expect(result.overridden).toBe(true);
  });

  it('refuses part of a pack', () => {
    expect(() => calculateQuantity('bottle', { ...course, overrideQuantity: 1.5 }, { multiUse: true })).toThrow(/whole number/);
  });

  it('still needs a reason to change the total of an ordinary medicine', () => {
    expect(() => calculateQuantity('tablet', { ...course, overrideQuantity: 10 })).toThrow(/reason/);
    expect(Number(calculateQuantity('tablet', course).prescribed)).toBe(21);
  });

  it('accepts liquids stocked as "piece" when the bottle size is in the name', () => {
    const product = { unit: 'piece', genericName: 'Eryko suspension 100ml erythromycin', dosageForm: 'Oral suspension' };
    expect(liquidPackVolumeMl(product)).toBe(100);
    const result = calculateQuantity('piece', { quantityPerDose: 5, timesPerDay: 3, daysSupply: 7 }, { liquid: true, packVolumeMl: 100 });
    expect(Number(result.prescribed)).toBe(2);
  });
});
