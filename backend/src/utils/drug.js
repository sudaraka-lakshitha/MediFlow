// Makes drug names comparable (same spelling and order).

const aliases = new Map([
  // DDInter uses the USAN name; product catalogues in Sri Lanka commonly use INN.
  ['paracetamol', 'acetaminophen'],
]);

export const normalizeDrugName = (value = '') => {
  const normalized = String(value)
    .normalize('NFKD')
    .replace(/[®™]/g, '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
  return aliases.get(normalized) || normalized;
};

export const orderedPair = (firstId, secondId) => firstId < secondId ? [firstId, secondId] : [secondId, firstId];
