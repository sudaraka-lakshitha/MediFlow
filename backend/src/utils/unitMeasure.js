// A pharmacy can measure out part of a volume or a weight, but it cannot hand over
// part of a countable thing - there is no such object as 2.25 tablets, 1.5 boxes or
// half a pair. Anything that is not measured out has to be rounded up to the next
// whole unit when working out how much to issue.
const DIVISIBLE_UNIT = /^(ml|millilitres?|milliliters?|l|litres?|liters?|cc|g|grams?|gm|mg|milligrams?|mcg|micrograms?|kg|kilograms?)$/i;

export const isDivisibleUnit = (unit) => DIVISIBLE_UNIT.test(String(unit ?? '').trim());

// Countable by default: an unrecognised or missing unit is far more likely to be a
// discrete item than a measured one, and rounding up is the safe direction (the
// patient gets at least the prescribed course).
export const isCountableUnit = (unit) => !isDivisibleUnit(unit);
