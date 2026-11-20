// Who may confirm the pharmacy balance.

import { AppError } from './AppError.js';
export const canReconcilePharmacy = user => user.role === 'ADMIN' || (user.pharmacyReconciliationAccess === true
  && (user.role === 'CASHIER' || (user.role === 'PHARMACIST' && user.cashierAccess === true)));
export const requirePharmacyReconciliation = user => {
  if (!canReconcilePharmacy(user)) throw new AppError(403, 'An administrator must grant pharmacy-wide reconciliation access.');
};
