import { describe, expect, it } from 'vitest';
import { isLiquidContainerUnit, liquidPackVolumeMl } from '../src/utils/liquidPackaging.js';

describe('liquid package volume', () => {
  it('reads the bottle size from a medicine name', () => {
    expect(liquidPackVolumeMl({ unit: 'bottle', genericName: 'Acevita IH Syrup 100ml' })).toBe(100);
  });

  it('does not mistake a concentration denominator for the bottle size', () => {
    expect(liquidPackVolumeMl({ unit: 'bottle', genericName: 'Paracetamol 120 mg/5 mL syrup' })).toBeNull();
  });

  it('uses a later container volume after a concentration', () => {
    expect(liquidPackVolumeMl({ unit: 'bottle', genericName: 'Paracetamol 120 mg/5 mL syrup 100 mL' })).toBe(100);
  });

  it('converts litres to millilitres and supports explicit volume strength', () => {
    expect(liquidPackVolumeMl({ unit: 'can', genericName: 'Liquid supplement', brandName: '500 mL' })).toBe(500);
    expect(liquidPackVolumeMl({ unit: 'vial', strength: '0.1 L' })).toBe(100);
  });

  it('only treats actual container units as package counts', () => {
    expect(isLiquidContainerUnit('bottle')).toBe(true);
    expect(isLiquidContainerUnit('drop')).toBe(false);
    expect(liquidPackVolumeMl({ unit: 'drop', genericName: 'Eye drops 10 mL' })).toBeNull();
  });
});
