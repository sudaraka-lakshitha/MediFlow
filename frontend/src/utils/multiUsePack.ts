// MULTI-USE PACKS (tubes, drop bottles, sprays, inhalers)
// Mirror of backend/src/utils/multiUsePack.js - keep the two in step.
// A tube of cream, a bottle of drops or an inhaler lasts many doses, so its quantity is not
// "dose x times a day x days". By default 1 pack covers the whole course, and the pharmacist can
// change the number without writing a reason.
import { isDivisibleUnit } from "./unitMeasure";

type PackProduct = { unit?: string | null; dosageForm?: string | null; genericName?: string | null; brandName?: string | null } | null | undefined;

const MULTI_USE_FORM = /\b(creams?|gels?|emulgel|ointments?|pastes?|lotions?|drops?|sprays?|inhalers?|evohaler|turbuhaler|aerosols?|foams?|shampoos?|balms?|liniments?)\b/i;
const MULTI_USE_UNIT = /^(tubes?|jars?|pots?|inhalers?|puffs?)$/i;

// True when the medicine is a multi-use pack (see the note at the top).
export const isMultiUsePack = (product: PackProduct) => {
  const unit = String(product?.unit ?? "").trim();
  if (!product || isDivisibleUnit(unit)) return false;
  return MULTI_USE_UNIT.test(unit) || MULTI_USE_FORM.test(String(product.dosageForm ?? ""));
};

// The word for one pack, for example "tube", "bottle" or "inhaler".
// Inhalers are stocked with the unit "puff", but one stock item is one inhaler.
export const multiUsePackWord = (product: PackProduct) => {
  const unit = String(product?.unit ?? "").trim().toLowerCase().replace(/s$/, "");
  if (unit === "puff" || /inhaler|evohaler|turbuhaler/i.test(String(product?.dosageForm ?? ""))) return "inhaler";
  return unit || "pack";
};

// The word for one dose, for example "drop", "puff" or "spray".
// Creams, gels and ointments have no counted dose: they are applied as a thin layer, so this is null.
export const multiUseDoseWord = (product: PackProduct) => {
  const form = String(product?.dosageForm ?? "");
  if (/drop/i.test(form)) return "drop";
  if (/inhaler|evohaler|turbuhaler|aerosol/i.test(form) || /^puffs?$/i.test(String(product?.unit ?? ""))) return "puff";
  if (/spray/i.test(form)) return "spray";
  return null;
};

// A sensible route when the medicine is chosen, so the directions read correctly.
export const suggestedRoute = (product: PackProduct) => {
  const text = `${product?.dosageForm ?? ""} ${product?.genericName ?? ""} ${product?.brandName ?? ""}`;
  if (multiUseDoseWord(product) === "puff") return "Inhalation";
  if (/\beye\b|ophthalm/i.test(text)) return "Ophthalmic";
  if (/\bear\b|otic/i.test(text)) return "Otic";
  if (/nasal|\bnose\b/i.test(text)) return "Nasal";
  if (/creams?|gels?|emulgel|ointments?|pastes?|lotions?|foams?|shampoos?|balms?|liniments?/i.test(text)) return "Topical";
  return null;
};
