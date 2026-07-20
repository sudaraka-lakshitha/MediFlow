import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/prisma.js';
import { prescriptionUploadService } from './services/prescriptionUpload.service.js';
import { auditService } from './services/audit.service.js';

const server = app.listen(env.PORT, () => logger.info(`MediFlow API listening on port ${env.PORT}`));
const cleanupUploads = () => prescriptionUploadService.cleanupExpired().then((count) => count && logger.info(`Deleted ${count} expired prescription upload(s).`)).catch((error) => logger.error('Prescription upload cleanup failed.', { error }));
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
