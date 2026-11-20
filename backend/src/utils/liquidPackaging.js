// Bottle sizes for liquid medicines, so whole bottles are billed.

const LIQUID_CONTAINER_UNIT = /^(bottles?|cans?|vials?|ampoules?|sachets?)$/i;
const VOLUME_TOKEN = /(\d+(?:\.\d+)?)\s*(ml|millilitres?|milliliters?|l|litres?|liters?)\b/gi;

export const isLiquidContainerUnit = (unit) =>
  LIQUID_CONTAINER_UNIT.test(String(unit ?? '').trim());

const volumesIn = (value) => {
  const text = String(value ?? '');
  const volumes = [];
  for (const match of text.matchAll(VOLUME_TOKEN)) {
    const before = text.slice(0, match.index);
    // Ignore concentration denominators such as 250 mg/5 mL. A later size such
    // as "100 mL bottle" is still accepted as the actual container size.
    if (/\b(?:mg|mcg|µg|g)\s*\/\s*$/i.test(before)) continue;
    const amount = Number(match[1]);
    if (!Number.isFinite(amount) || amount <= 0) continue;
    volumes.push(/^l/i.test(match[2]) ? amount * 1000 : amount);
  }
  return volumes;
};

/**
 * Find a single-container volume from the product's printed name/brand.
 * Strength is accepted only when it is just a volume (e.g. "100 mL"), never
 * when it describes a concentration such as "120 mg/5 mL".
 */
export const liquidPackVolumeMl = (product) => {
  if (!isLiquidContainerUnit(product?.unit)) return null;
  for (const value of [product?.genericName, product?.brandName]) {
    const values = volumesIn(value);
    if (values.length) return values.at(-1);
  }
  const strength = String(product?.strength ?? '').trim();
  if (/^\d+(?:\.\d+)?\s*(?:ml|millilitres?|milliliters?|l|litres?|liters?)$/i.test(strength)) {
    return volumesIn(strength).at(-1) ?? null;
  }
  return null;
};
