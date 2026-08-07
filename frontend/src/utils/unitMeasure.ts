// Mirror of backend/src/utils/unitMeasure.js - keep the two in step.
//
// A pharmacy can measure out part of a volume or a weight, but it cannot hand over
// part of a countable thing: there is no such object as 2.25 tablets, 1.5 boxes or
// half a pair. Anything not measured out rounds up to the next whole unit, so the
// quantity previewed here matches the quantity the server actually records.
const DIVISIBLE_UNIT =
  /^(ml|millilitres?|milliliters?|l|litres?|liters?|cc|g|grams?|gm|mg|milligrams?|mcg|micrograms?|kg|kilograms?)$/i;

export const isDivisibleUnit = (unit?: string | null) =>
  DIVISIBLE_UNIT.test(String(unit ?? "").trim());

// Countable by default: an unrecognised or not-yet-chosen unit is far more likely to
// be a discrete item, and rounding up is the safe direction.
export const isCountableUnit = (unit?: string | null) => !isDivisibleUnit(unit);

// Course total for a medicine line, rounded the way the pharmacy will actually issue it.
export const issuableTotal = (rawTotal: number, unit?: string | null) =>
  isCountableUnit(unit) ? Math.ceil(rawTotal) : Number(rawTotal.toFixed(3));
