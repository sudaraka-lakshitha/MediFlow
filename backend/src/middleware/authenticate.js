import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export const authenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new AppError(401, 'Authentication is required.');
    const payload = jwt.verify(header.slice(7), env.JWT_SECRET);
    const user = await prisma.user.findFirst({
      where: { id: Number(payload.sub), active: true },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        cashierAccess: true,
        mustChangePassword: true,
        tokenVersion: true,
        lastLoginAt: true,
        passwordChangedAt: true,
      },
    });
    if (!user) throw new AppError(401, 'This account is unavailable.');
    if (payload.version !== user.tokenVersion) throw new AppError(401, 'This session has been revoked. Please sign in again.');
    const passwordRoute = req.originalUrl.endsWith('/auth/change-password') || req.originalUrl.endsWith('/auth/me');
    if (user.mustChangePassword && !passwordRoute) throw new AppError(403, 'You must change the temporary password before continuing.');
    req.user = user;
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(401, 'Invalid or expired authentication token.'));
  }
};
