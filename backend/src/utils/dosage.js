import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';
import { isCountableUnit } from './unitMeasure.js';

export const calculateQuantity = (unit, item) => {
  let calculated = new Prisma.Decimal(item.quantityPerDose).mul(item.timesPerDay).mul(item.daysSupply);
  // A quarter-tablet dose is a perfectly normal instruction, but the pharmacy still has to
  // hand over whole tablets, so the course total rounds up.
  const discrete = isCountableUnit(unit);
  if (discrete) calculated = calculated.ceil();
  const overridden = item.overrideQuantity != null;
  const prescribed = overridden ? new Prisma.Decimal(item.overrideQuantity) : calculated;
  if (overridden && !item.overrideReason?.trim()) throw new AppError(400, 'An override reason is required.');
  if (discrete && !prescribed.isInteger()) throw new AppError(400, `${unit} quantities must be whole numbers.`);
  return { calculated, prescribed, overridden };
};
