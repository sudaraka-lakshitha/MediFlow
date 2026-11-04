// Display recorded directions only. Never infer dosing from price, quantity or product name.
export const directionSelect = { id: true, dosageInstructions: true, specialInstructions: true };
export const invoiceDispensingInclude = {
  prescription: { select: { prescriptionNumber: true, createdBy: { select: { fullName: true } }, verifiedBy: { select: { fullName: true } } } },
  items: { include: { prescriptionItem: { select: { ...directionSelect, product: { select: { genericName: true, strength: true, unit: true, storageInstructions: true } } } } } },
};
export const patientMedicineInstructions = record => {
  if (['VOIDED', 'CANCELLED'].includes(record.status)) return [];
  if (record.medicineInstructions) return record.medicineInstructions;
  // Dispensing lines are authoritative after handover: cancelled/unissued medicines
  // must not acquire directions simply because they remain on the prescription.
  const lines = record.dispensing ? record.dispensing.items || [] : record.items || [];
  return lines.filter(line => line.prescriptionItem && Number(line.quantity) > 0).map(line => {
    const item = line.prescriptionItem; const product = item.product || line.product;
    const directions = Object.hasOwn(line, 'dosageInstructions') ? line.dosageInstructions : item.dosageInstructions;
    const special = Object.hasOwn(line, 'specialInstructions') ? line.specialInstructions : item.specialInstructions;
    return { id: line.id, name: `${product.genericName}${product.strength && product.strength !== 'N/A' ? ` ${product.strength}` : ''}`,
      quantity: line.quantity, unit: product.unit, directions: directions?.trim() || 'Directions are not recorded. Ask the pharmacist before taking this medicine.',
      specialInstructions: special || null, storageInstructions: product.storageInstructions || null };
  });
};
