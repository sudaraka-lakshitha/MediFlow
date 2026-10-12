import { describe, expect, it } from 'vitest';
import { dispenseQuoteSchema, dispenseSchema, paymentRequestSchema, prescriptionSchema } from '../src/validators/prescription.validator.js';
import { createPatientSchema } from '../src/validators/patient.validator.js';

const prescriptionItems = [{ prescriptionItemId: 11, quantity: 2 }];

describe('combined prescription and retail billing validation', () => {
  it('defaults supplementary retail items to an empty list', () => {
    const result = paymentRequestSchema.parse({ items: prescriptionItems });
    expect(result.retailItems).toEqual([]);
    expect(result.containerFee).toBe(0);
    expect(result.tax).toBe(0);
  });

  it('accepts non-prescription retail items on the same cashier request', () => {
    const result = paymentRequestSchema.parse({
      items: prescriptionItems,
      retailItems: [{ productId: 41, quantity: 3 }],
    });
    expect(result.retailItems).toEqual([{ productId: 41, quantity: 3 }]);
  });

  it('rejects duplicate retail product lines', () => {
    const result = paymentRequestSchema.safeParse({
      items: prescriptionItems,
      retailItems: [
        { productId: 41, quantity: 1 },
        { productId: 41, quantity: 2 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it('preserves supplementary retail items during final PIN dispensing validation', () => {
    const result = dispenseSchema.parse({
      items: prescriptionItems,
      retailItems: [{ productId: 41, quantity: 1 }],
      paymentRequestId: 9,
      pickupPin: '123456',
    });
    expect(result.retailItems).toHaveLength(1);
    expect(result.paymentRequestId).toBe(9);
  });

  it('quotes without validating a pickup PIN', () => {
    const result = dispenseQuoteSchema.parse({
      items: prescriptionItems,
      retailItems: [{ productId: 41, quantity: 1 }],
      pickupPin: '',
    });
    expect(result.retailItems).toHaveLength(1);
    expect(result).not.toHaveProperty('pickupPin');
  });

  it('accepts persistent retail add-ons when recording a prescription', () => {
    const result = prescriptionSchema.parse({
      patientId: 2,
      prescriberName: 'Dr Example',
      prescriptionDate: new Date(),
      orderedForSelf: true,
      items: [{
        productId: 10,
        quantityPerDose: 1,
        timesPerDay: 2,
        daysSupply: 5,
        dosageInstructions: 'Take one tablet twice daily.',
      }],
      retailItems: [{ productId: 41, quantity: 2 }],
    });
    expect(result.retailItems).toEqual([{ productId: 41, quantity: 2 }]);
  });

  it('requires recipient age details for a third-party prescription', () => {
    const result = prescriptionSchema.safeParse({
      patientId: 2,
      prescriberName: 'Dr Example',
      prescriptionDate: new Date(),
      orderedForSelf: false,
      recipientName: 'Test Child',
      recipientRelationship: 'Child',
      items: [{
        productId: 10,
        quantityPerDose: 1,
        timesPerDay: 2,
        daysSupply: 5,
        dosageInstructions: 'Take one tablet twice daily.',
      }],
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'recipientDateOfBirth')).toBe(true);
  });

  it('rejects a doctor-issued prescription time in the future', () => {
    const result = prescriptionSchema.safeParse({
      patientId: 2,
      prescriberName: 'Dr Example',
      prescriptionDate: new Date(Date.now() + 60 * 60 * 1000),
      orderedForSelf: true,
      items: [{ productId: 10, quantityPerDose: 1, timesPerDay: 1, daysSupply: 1, dosageInstructions: 'Take one.' }],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'prescriptionDate')).toBe(true);
  });

  it('accepts an internal walk-in patient without an email or online password', () => {
    const result = createPatientSchema.parse({
      onlineAccess: false,
      fullName: 'Walk In Patient',
      phone: '0771234567',
      dateOfBirth: '1990-01-01',
    });
    expect(result.onlineAccess).toBe(false);
    expect(result.email).toBeUndefined();
  });
});
