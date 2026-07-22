import { prisma } from '../config/prisma.js';
import { AppError } from './AppError.js';
import { ageOnDate } from './age.js';

export const findAgeUnsuitable = (products, age) =>
  products.filter((product) => (product.minimumAgeYears != null && age < product.minimumAgeYears) || (product.maximumAgeYears != null && age > product.maximumAgeYears));

// Age-restricted OTC/retail items were previously only checked on the
// prescription path — a retail sale never looked at minimumAgeYears/
// maximumAgeYears at all, so an anonymous or under-age customer could buy
// an age-restricted item at the counter with no check.
export const assertRetailAgeSuitability = async (patientId, products, referenceDate = new Date()) => {
  const restricted = products.filter((product) => product.minimumAgeYears != null || product.maximumAgeYears != null);
  if (!restricted.length) return;
  const names = restricted.map((product) => product.genericName).join(', ');
  if (!patientId) {
    throw new AppError(400, `${names} ${restricted.length === 1 ? 'has' : 'have'} an age restriction — select a patient with a date of birth on file before selling ${restricted.length === 1 ? 'it' : 'them'}.`);
  }
  const profile = await prisma.patientProfile.findUnique({ where: { userId: patientId }, select: { dateOfBirth: true } });
  if (!profile?.dateOfBirth) throw new AppError(400, "Record this patient's date of birth before selling an age-restricted item.");
  const age = ageOnDate(profile.dateOfBirth, referenceDate);
  const unsuitable = findAgeUnsuitable(restricted, age);
  if (unsuitable.length) {
    throw new AppError(400, `${unsuitable.map((product) => product.genericName).join(', ')} ${unsuitable.length === 1 ? 'is' : 'are'} outside the configured age range for this patient (${age} years).`);
  }
};
