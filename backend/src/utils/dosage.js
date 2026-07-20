import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';

export const calculateQuantity = (unit, item) => {
  let calculated = new Prisma.Decimal(item.quantityPerDose).mul(item.timesPerDay).mul(item.daysSupply);
  const discrete = /tablet|capsule/i.test(unit);
  if (discrete) calculated = calculated.ceil();
  const overridden = item.overrideQuantity != null;
  const prescribed = overridden ? new Prisma.Decimal(item.overrideQuantity) : calculated;
  if (overridden && !item.overrideReason?.trim()) throw new AppError(400, 'An override reason is required.');
  if (discrete && !prescribed.isInteger()) throw new AppError(400, `${unit} quantities must be whole numbers.`);
  return { calculated, prescribed, overridden };
};
