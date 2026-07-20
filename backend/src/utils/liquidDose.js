const massInMg = (value, unit) => {
  if (unit.toLowerCase() === 'g') return Number(value) * 1000;
  if (['mcg', 'µg'].includes(unit.toLowerCase())) return Number(value) / 1000;
  return Number(value);
};

/** Recalculate a strength-based liquid dose on the trusted server. */
export const normalizeLiquidDose = (item) => {
  if (!item.doseInputUnit || item.doseInputUnit.toLowerCase() === 'ml') return item;
  const doseMg = massInMg(item.doseInputAmount, item.doseInputUnit);
  const concentrationMg = massInMg(item.concentrationAmount, item.concentrationUnit);
  const quantityPerDose = Number(((doseMg / concentrationMg) * Number(item.concentrationVolume)).toFixed(3));
  return { ...item, quantityPerDose };
};
