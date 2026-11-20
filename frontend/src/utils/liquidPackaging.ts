// Bottle sizes for liquid medicines, so whole bottles are billed.

const LIQUID_CONTAINER_UNIT = /^(bottles?|cans?|vials?|ampoules?|sachets?)$/i;
const VOLUME_TOKEN = /(\d+(?:\.\d+)?)\s*(ml|millilitres?|milliliters?|l|litres?|liters?)\b/gi;

export const isLiquidContainerUnit = (unit?: string | null) =>
  LIQUID_CONTAINER_UNIT.test(String(unit ?? '').trim());

const volumesIn = (value?: string | null) => {
  const text = String(value ?? '');
  const volumes: number[] = [];
  for (const match of text.matchAll(VOLUME_TOKEN)) {
    const before = text.slice(0, match.index);
    if (/\b(?:mg|mcg|µg|g)\s*\/\s*$/i.test(before)) continue;
    const amount = Number(match[1]);
    if (!Number.isFinite(amount) || amount <= 0) continue;
    volumes.push(/^l/i.test(match[2]) ? amount * 1000 : amount);
  }
  return volumes;
};

export const liquidPackVolumeMl = (product?: {
  unit?: string | null;
  genericName?: string | null;
  brandName?: string | null;
  strength?: string | null;
} | null) => {
  if (!isLiquidContainerUnit(product?.unit)) return null;
  for (const value of [product?.genericName, product?.brandName]) {
    const values = volumesIn(value);
    if (values.length) return values.at(-1) ?? null;
  }
  const strength = String(product?.strength ?? '').trim();
  if (/^\d+(?:\.\d+)?\s*(?:ml|millilitres?|milliliters?|l|litres?|liters?)$/i.test(strength)) {
    return volumesIn(strength).at(-1) ?? null;
  }
  return null;
};
