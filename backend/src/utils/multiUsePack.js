// MULTI-USE PACKS (tubes, drop bottles, sprays, inhalers)
// Most medicines are counted by the dose: 1 tablet x 3 times a day x 7 days = 21 tablets.
// That sum is wrong for a pack that is used many times, such as a tube of cream, a bottle of eye
// drops or an inhaler: "apply 3 times a day for 7 days" would ask for 21 tubes.
// For these packs the rule is simple: give 1 pack for the whole course by default. The pharmacist
// can change the number (for example 2 tubes for a large area) without writing a reason.
import { isDivisibleUnit } from './unitMeasure.js';

// Dosage forms that come in a pack used many times.
const MULTI_USE_FORM = /\b(creams?|gels?|emulgel|ointments?|pastes?|lotions?|drops?|sprays?|inhalers?|evohaler|turbuhaler|aerosols?|foams?|shampoos?|balms?|liniments?)\b/i;
// Stock units that are always a multi-use pack. "puff" is how inhalers are stocked in the
// catalogue, but the price and stock count are per inhaler.
const MULTI_USE_UNIT = /^(tubes?|jars?|pots?|inhalers?|puffs?)$/i;

// True when the medicine is a multi-use pack. Medicines stocked by mL or grams are measured
// out, so they keep the normal calculation.
export const isMultiUsePack = (product) => {
  const unit = String(product?.unit ?? '').trim();
  if (!product || isDivisibleUnit(unit)) return false;
  return MULTI_USE_UNIT.test(unit) || MULTI_USE_FORM.test(String(product.dosageForm ?? ''));
};
