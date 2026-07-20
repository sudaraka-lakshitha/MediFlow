import { AppError } from '../utils/AppError.js';

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return next(new AppError(403, 'You do not have permission for this action.'));
  next();
};
