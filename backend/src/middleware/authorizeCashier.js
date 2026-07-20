import { AppError } from '../utils/AppError.js';

export const authorizeCashier = (req, _res, next) => {
  const allowed = req.user && (
    req.user.role === 'ADMIN'
    || req.user.role === 'CASHIER'
    || (req.user.role === 'PHARMACIST' && req.user.cashierAccess)
  );
  if (!allowed) return next(new AppError(403, 'Cashier access has not been granted by an administrator.'));
  next();
};
