import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { recordAudit } from '../services/audit.service.js';
import { AppError } from '../utils/AppError.js';

export const notFound = (_req, _res, next) => next(new AppError(404, 'Route not found.'));

export const errorHandler = (error, req, res, _next) => {
  if (res.headersSent) { res.destroy(error); return; }
  let status = error.statusCode || 500;
  let message = error.message || 'Unexpected server error.';
  let details = error.details;

  if (error instanceof ZodError) {
    status = 400;
    message = 'Input validation failed.';
    details = error.flatten();
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      status = 409;
      message = 'A record with this unique value already exists.';
    } else if (error.code === 'P2025') {
      status = 404;
      message = 'The requested record was not found.';
    } else if (error.code === 'P2003') {
      status = 409;
      message = 'This record is referenced by pharmacy history and cannot be deleted. Deactivate it instead.';
    } else if (error.code === 'P2034') {
      status = 409;
      message = 'This item was just updated by another transaction. Please try again.';
    }
  }

  // A locked workspace rejecting a background read is expected, not an audit incident.
  // Keep failed writes, authentication failures and genuine server errors visible.
  const routineLockedRead = status === 423 && details?.code === 'SESSION_LOCKED' && ['GET', 'HEAD'].includes(req.method);
  const log = routineLockedRead ? logger.debug.bind(logger) : status >= 500 ? logger.error.bind(logger) : logger.warn.bind(logger);
  log(message, { error, requestId: req.requestId, method: req.method, path: req.originalUrl, status });
  if (req.user && !routineLockedRead) {
    void recordAudit({
      userId: req.user.id,
      action: 'REQUEST_FAILED',
      entityType: 'API_REQUEST',
      details: { message, status },
      success: false,
      ipAddress: req.ip,
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
    });
  }
  res.status(status).json({ message, details, requestId: req.requestId });
};
