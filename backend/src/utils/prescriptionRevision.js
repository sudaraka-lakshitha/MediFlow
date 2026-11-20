// Detects whether a change to a prescription matters, so it must be checked again by a pharmacist.

const text = (value) => value == null || value === '' ? null : String(value);
const number = (value) => value == null ? null : Number(value);
const date = (value) => value ? new Date(value).toISOString() : null;
export const prescriptionSnapshot = (record) => ({
  patientId: number(record.patientId), prescriberTitle: text(record.prescriberTitle),
  prescriberName: text(record.prescriberName), prescriberReference: text(record.prescriberReference),
  prescriptionDate: date(record.prescriptionDate), orderedForSelf: Boolean(record.orderedForSelf),
  recipientName: record.orderedForSelf ? null : text(record.recipientName),
  recipientRelationship: record.orderedForSelf ? null : text(record.recipientRelationship),
  recipientDateOfBirth: record.orderedForSelf ? null : date(record.recipientDateOfBirth),
  recipientAllergies: record.orderedForSelf ? null : text(record.recipientAllergies),
  recipientConditions: record.orderedForSelf ? null : text(record.recipientConditions),
  notes: text(record.notes), refillsAllowed: Number(record.refillsAllowed || 0),
  items: (record.items || []).map((item) => ({
    productId: number(item.productId),
    ...Object.fromEntries(['quantityPerDose', 'doseInputAmount', 'concentrationAmount', 'concentrationVolume', 'timesPerDay', 'daysSupply', 'prescribedQuantity'].map((key) => [key, number(item[key])])),
    ...Object.fromEntries(['doseInputUnit', 'concentrationUnit', 'overrideReason', 'dosageInstructions', 'frequency', 'duration', 'notes', 'administrationRoute', 'mealTiming', 'specialInstructions'].map((key) => [key, text(item[key])])),
    asNeeded: Boolean(item.asNeeded),
  })).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
  retailItems: (record.retailItems || []).map((item) => ({ productId: number(item.productId), quantity: number(item.quantity) })).sort((a,b) => a.productId - b.productId),
});

export const prescriptionMaterialChanged = (before, after) => JSON.stringify(prescriptionSnapshot(before)) !== JSON.stringify(prescriptionSnapshot(after));
