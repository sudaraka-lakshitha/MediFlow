import { describe, expect, it } from 'vitest';
import { prescriptionSchema, refillSchema } from '../src/validators/prescription.validator.js';
import { itemFinancials, saleFinancials, combineFinancials } from '../src/utils/reportFinancials.js';

describe('Bug fixes validation audit', () => {
  it('validates refillSchema with optional notes', () => {
    expect(refillSchema.parse({})).toEqual({});
    expect(refillSchema.parse({ notes: 'Patient requested standard monthly refill' })).toEqual({
      notes: 'Patient requested standard monthly refill',
    });
  });

  it('validates refillsAllowed in prescriptionSchema within 0 to 12', () => {
    const base = {
      patientId: 1,
      prescriberName: 'Dr. Silva',
      prescriptionDate: new Date().toISOString(),
      orderedForSelf: true,
      items: [
        {
          productId: 1,
          quantityPerDose: 1,
          timesPerDay: 2,
          daysSupply: 10,
          dosageInstructions: 'Take 1 tablet twice daily',
          administrationRoute: 'Oral',
          mealTiming: 'AFTER_FOOD',
        },
      ],
      refillsAllowed: 3,
    };
    const parsed = prescriptionSchema.parse(base);
    expect(parsed.refillsAllowed).toBe(3);

    // Rejects negative or greater than 12
    expect(() => prescriptionSchema.parse({ ...base, refillsAllowed: -1 })).toThrow();
    expect(() => prescriptionSchema.parse({ ...base, refillsAllowed: 13 })).toThrow();
  });

  it('pro-rates tax accurately in financial reports and item allocations', () => {
    const sale = {
      subtotal: 2000,
      discount: 200,
      containerFee: 0,
      tax: 300,
      items: [
        { quantity: 1, lineTotal: 1500, batch: { purchasePrice: 800 } },
        { quantity: 1, lineTotal: 500, batch: { purchasePrice: 250 } },
      ],
    };

    const fin = saleFinancials(sale);
    expect(fin.grossSales).toBe(2000);
    expect(fin.discount).toBe(200);
    expect(fin.tax).toBe(300);
    expect(fin.netRevenue).toBe(1800);

    const item1 = itemFinancials(sale.items[0], sale);
    expect(item1.grossSales).toBe(1500);
    expect(item1.discount).toBe(150);
    expect(item1.tax).toBe(225);
    expect(item1.netRevenue).toBe(1350);

    const item2 = itemFinancials(sale.items[1], sale);
    expect(item2.grossSales).toBe(500);
    expect(item2.discount).toBe(50);
    expect(item2.tax).toBe(75);
    expect(item2.netRevenue).toBe(450);

    const combined = combineFinancials([item1, item2]);
    expect(combined.grossSales).toBe(2000);
    expect(combined.tax).toBe(300);
    expect(combined.netRevenue).toBe(1800);
  });
});
