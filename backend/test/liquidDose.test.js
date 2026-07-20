import { describe, expect, it } from 'vitest';
import { normalizeLiquidDose } from '../src/utils/liquidDose.js';

describe('strength-based liquid dosage', () => {
  it('converts a 125 mg dose from 250 mg per 5 mL to 2.5 mL', () => {
    const result = normalizeLiquidDose({ doseInputAmount: 125, doseInputUnit: 'mg', concentrationAmount: 250, concentrationUnit: 'mg', concentrationVolume: 5, quantityPerDose: 999 });
    expect(result.quantityPerDose).toBe(2.5);
  });

  it('normalizes mixed mcg and mg units', () => {
    const result = normalizeLiquidDose({ doseInputAmount: 500, doseInputUnit: 'mcg', concentrationAmount: 1, concentrationUnit: 'mg', concentrationVolume: 2, quantityPerDose: 999 });
    expect(result.quantityPerDose).toBe(1);
  });

  it('leaves direct mL doses unchanged', () => {
    const input = { doseInputAmount: 7.5, doseInputUnit: 'ml', quantityPerDose: 7.5 };
    expect(normalizeLiquidDose(input)).toBe(input);
  });
});
