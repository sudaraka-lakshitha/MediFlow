import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';
import { isCountableUnit } from './unitMeasure.js';
import { stockQuantity } from './stockQuantity.js';
import { isLiquidContainerUnit } from './liquidPackaging.js';

export const calculateQuantity = (unit, item, { liquid = false, packVolumeMl = null } = {}) => {
  let calculated = new Prisma.Decimal(item.quantityPerDose).mul(item.timesPerDay).mul(item.daysSupply);
  if (liquid && isCountableUnit(unit)) {
    if (!isLiquidContainerUnit(unit)) {
      throw new AppError(400, 'Liquid medicine stock must be measured in mL or supplied in a bottle, can, vial, ampoule, or sachet with its pack volume recorded.');
    }
    if (!packVolumeMl || !Number.isFinite(Number(packVolumeMl)) || Number(packVolumeMl) <= 0) {
      throw new AppError(400, 'Add the liquid container size to the medicine name or brand (for example, 100 mL) before prescribing by bottle.');
    }
    calculated = calculated.div(packVolumeMl).ceil();
  }
  // A quarter-tablet dose is a perfectly normal instruction, but the pharmacy still has to
  // hand over whole tablets, so the course total rounds up.
  const discrete = isCountableUnit(unit);
  if (discrete) calculated = calculated.ceil();
  const overridden = item.overrideQuantity != null;
  const prescribed = overridden ? new Prisma.Decimal(item.overrideQuantity) : calculated;
  if (overridden && !item.overrideReason?.trim()) throw new AppError(400, 'An override reason is required.');
  if (discrete && !prescribed.isInteger()) throw new AppError(400, `${unit} quantities must be whole numbers.`);
  stockQuantity(prescribed, unit);
  return { calculated, prescribed, overridden };
};
