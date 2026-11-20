// Works out how much medicine is needed from the dose, times per day and number of days.

import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';
import { isCountableUnit } from './unitMeasure.js';
import { stockQuantity } from './stockQuantity.js';
import { isLiquidContainerUnit } from './liquidPackaging.js';

export const calculateQuantity = (unit, item, { liquid = false, packVolumeMl = null, multiUse = false } = {}) => {
  // A tube, drop bottle, spray or inhaler lasts many doses: give 1 pack for the course unless the
  // pharmacist chose another whole number. No reason is needed for that choice.
  if (multiUse) {
    const calculated = new Prisma.Decimal(1);
    const prescribed = item.overrideQuantity != null ? new Prisma.Decimal(item.overrideQuantity) : calculated;
    if (!prescribed.isInteger() || prescribed.lessThan(1)) throw new AppError(400, `Enter a whole number of ${unit || 'packs'} (at least 1).`);
    stockQuantity(prescribed, unit);
    return { calculated, prescribed, overridden: !prescribed.equals(calculated) };
  }
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
