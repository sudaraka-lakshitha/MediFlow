import { describe, expect, it } from 'vitest';
import { ageOnDate } from '../src/utils/age.js';

describe('ageOnDate', () => {
  it('calculates a whole age when the birthday has already passed this year', () => {
    expect(ageOnDate('2018-01-15', '2026-07-21')).toBe(8);
  });

  it('does not count the birthday until it arrives in the reference year', () => {
    expect(ageOnDate('2018-12-25', '2026-07-21')).toBe(7);
  });

  it('turns a year older on the exact birthday', () => {
    expect(ageOnDate('2018-07-21', '2026-07-21')).toBe(8);
  });

  it('returns 0 for a newborn within the first year', () => {
    expect(ageOnDate('2026-01-01', '2026-07-21')).toBe(0);
  });
});
