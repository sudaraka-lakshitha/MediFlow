import { describe, expect, it } from 'vitest';
import { prescriptionSupplySummary } from '../src/utils/prescriptionSupplySummary.js';
import { patientMedicineInstructions } from '../src/utils/patientMedicineInstructions.js';

describe('patient supply summary', () => {
  const item = { id: 8, prescribedQuantity: '18', dispensedQuantity: '3', cancelledQuantity: '15' };
  it('shows cancelled quantities as not supplied, never as active pending supply', () => {
    expect(prescriptionSupplySummary(item)).toEqual({ notSuppliedQuantity: '15', pendingQuantity: '0', cancellationReasons: [] });
    expect(prescriptionSupplySummary({ ...item, cancelledQuantity: '5' }).pendingQuantity).toBe('10');
  });
  it('uses exact decimal arithmetic and does not undo dispensing for refunds', () => {
    expect(prescriptionSupplySummary({ ...item, prescribedQuantity: '0.3', dispensedQuantity: '0.1', cancelledQuantity: '0.2' }).pendingQuantity).toBe('0');
    expect(prescriptionSupplySummary({ ...item, refundedQuantity: '3' }).notSuppliedQuantity).toBe('15');
  });
  it('matches reasons to item IDs, not ambiguous medicine names', () => {
    const events = [{ details: { removedItems: [{ prescriptionItemId: 8 }], reason: 'Customer declined' } }, { details: { removedItems: [{ prescriptionItemId: 9 }], reason: 'Other medicine' } }];
    expect(prescriptionSupplySummary(item, events).cancellationReasons).toEqual(['Customer declined']);
  });
  it('recovers older snapshot reasons and only cancellation-specific legacy notes', () => {
    const events = [{ details: { removedItems: [{ name: 'Medicine' }], previous: { items: [{ prescriptionItemId: 8, quantity: '18' }] }, current: { items: [{ prescriptionItemId: 8, quantity: '3' }] }, reason: 'Full saved reason' } }];
    expect(prescriptionSupplySummary(item, events).cancellationReasons).toEqual(['Full saved reason']);
    expect(prescriptionSupplySummary({ ...item, notes: 'Private note | Cancelled from bill: Declined' }).cancellationReasons).toEqual(['Declined']);
  });
});

describe('patient receipt medicine directions', () => {
  const line = { id: 1, quantity: 3, prescriptionItem: { dosageInstructions: 'Recorded directions', specialInstructions: 'Recorded special instruction', product: { genericName: 'Medicine', strength: '5 mg', unit: 'tablet', storageInstructions: 'Recorded storage' } } };
  it('uses actual supplied lines after dispensing, excludes unrelated cancelled lines', () => {
    const result = patientMedicineInstructions({ items: [{ ...line, id: 2 }], dispensing: { items: [line] } });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: 1, directions: 'Recorded directions', specialInstructions: 'Recorded special instruction', storageInstructions: 'Recorded storage' });
  });
  it('does not invent instructions for retail, missing instructions or cancelled bills', () => {
    expect(patientMedicineInstructions({ items: [{ quantity: 3, product: {} }] })).toEqual([]);
    expect(patientMedicineInstructions({ status: 'CANCELLED', items: [line] })).toEqual([]);
    expect(patientMedicineInstructions({ items: [{ ...line, prescriptionItem: { ...line.prescriptionItem, dosageInstructions: null } }] })[0].directions).toContain('Ask the pharmacist');
  });
});
