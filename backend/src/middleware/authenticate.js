import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { sessionService } from '../services/session.service.js';

const authenticateWith = (allowLocked) => async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new AppError(401, 'Authentication is required.');
    // Signature is always verified. Database expiry locks the session so a password
    // can restore the same in-memory form rather than forcing a page reload.
    const payload = jwt.verify(header.slice(7), env.JWT_SECRET, { ignoreExpiration: true });
    const user = await prisma.user.findFirst({
      where: { id: Number(payload.sub), active: true },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        cashierAccess: true,
        pharmacyReconciliationAccess: true,
        mustChangePassword: true,
        tokenVersion: true,
        lastLoginAt: true,
        passwordChangedAt: true,
      },
    });
    if (!user) throw new AppError(401, 'This account is unavailable.');
    if (payload.version !== user.tokenVersion) throw new AppError(401, 'This session has been revoked. Please sign in again.');
    const { session, view } = await sessionService.inspect(payload);
    req.authSession = session;
    req.sessionView = view;
    req.user = user;
    if (view.locked && !allowLocked) throw new AppError(423, 'Unlock your workspace to continue.', { code: 'SESSION_LOCKED', session: view });
    const passwordRoute = req.originalUrl.endsWith('/auth/change-password') || req.originalUrl.endsWith('/auth/me');
    if (user.mustChangePassword && !passwordRoute && !allowLocked) throw new AppError(403, 'You must change the temporary password before continuing.');
    req.user = user;
    next();
  } catch (error) {
    const tokenError = error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError || error instanceof jwt.NotBeforeError;
    // Preserve database/server failures for central logging; these are not login failures.
    next(tokenError ? new AppError(401, 'Invalid or expired authentication token.') : error);
  }
};
export const authenticate = authenticateWith(false);
export const authenticateSessionControl = authenticateWith(true);
