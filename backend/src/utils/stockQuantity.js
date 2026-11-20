// Checks stock quantities are sensible (whole units, or millilitres for liquids).

import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';
import { isCountableUnit } from './unitMeasure.js';

// Stock columns store Decimal(12,3). Dose instructions and money use separate rules.
export const stockQuantity = (value, unit, { signed = false } = {}) => {
  let quantity;
  try { quantity = new Prisma.Decimal(value); } catch { throw new AppError(400, 'Enter a valid stock quantity.'); }
  if (!quantity.isFinite() || quantity.isZero() || (!signed && quantity.isNegative())) {
    throw new AppError(400, signed ? 'Stock adjustment must be a non-zero quantity.' : 'Stock quantity must be greater than zero.');
  }
  if (quantity.abs().greaterThan('999999999.999') || quantity.decimalPlaces() > 3) {
    throw new AppError(400, 'Stock quantity must fit the supported range and use at most three decimal places.');
  }
  if (isCountableUnit(unit) && !quantity.isInteger()) {
    throw new AppError(400, `${String(unit || 'Item').trim()} quantities must be whole numbers.`);
  }
  return quantity;
};
