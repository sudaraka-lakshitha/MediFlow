export const patientDirections = prescription => {
  const released = prescription.status === 'DISPENSED' || ['PAID', 'FULFILLED'].includes(prescription.paymentRequest?.status);
  const fields = ['dosageInstructions', 'specialInstructions', 'frequency', 'duration', 'administrationRoute', 'mealTiming', 'timesPerDay', 'quantityPerDose', 'doseInputAmount', 'doseInputUnit', 'concentrationAmount', 'concentrationUnit', 'concentrationVolume', 'asNeeded', 'notes'];
  return prescription.items?.map(item => released ? item : { ...item, ...Object.fromEntries(fields.map(key => [key, null])) });
};
