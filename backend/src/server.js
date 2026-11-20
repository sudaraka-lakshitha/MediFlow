// STARTS THE SERVER
// Also starts three small background clean-ups:
//   - every minute: free stock held for unpaid cash orders whose time has run out
//   - every hour: delete uploaded prescription files past their keeping period (order history is
// kept)
//   - every hour: permanently delete audit-log trash older than the keeping period
// On shutdown it closes the database connection cleanly.

import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/prisma.js';
import { prescriptionUploadService } from './services/prescriptionUpload.service.js';
import { auditService } from './services/audit.service.js';
import { cleanupExpiredCashReservations } from './utils/reservationExpiry.js';

const onListening = () => logger.info(`MediFlow API listening on port ${env.PORT}`);
const server = env.NODE_ENV === 'production'
  ? app.listen(env.PORT, onListening)
  : app.listen(env.PORT, '127.0.0.1', onListening);
let reservationCleanupRunning = false;
const cleanupReservations = async () => {
  if (reservationCleanupRunning) return;
  reservationCleanupRunning = true;
  try { await cleanupExpiredCashReservations(); }
  catch (error) { logger.error('Cash reservation cleanup failed.', { error }); }
  finally { reservationCleanupRunning = false; }
};
cleanupReservations();
const reservationCleanupTimer = setInterval(cleanupReservations, 60_000); reservationCleanupTimer.unref();
const cleanupUploads = () => prescriptionUploadService.cleanupExpired().then((count) => count && logger.info(`Removed ${count} expired prescription attachment(s); order history retained.`)).catch((error) => logger.error('Prescription upload cleanup failed.', { error }));
cleanupUploads();
const uploadCleanupTimer = setInterval(cleanupUploads, 60 * 60 * 1000); uploadCleanupTimer.unref();
const cleanupAuditTrash = () => auditService.purgeExpiredTrash().then((count) => count && logger.info(`Deleted ${count} expired audit trash record(s).`)).catch((error) => logger.error('Audit trash cleanup failed.', { error }));
cleanupAuditTrash();
const auditCleanupTimer = setInterval(cleanupAuditTrash, 60 * 60 * 1000); auditCleanupTimer.unref();

const shutdown = async (signal) => {
  logger.info(`${signal} received; shutting down.`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
