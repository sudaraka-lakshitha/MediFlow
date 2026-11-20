// THE WEB SERVER SET-UP
// Every request passes through the steps below, in this order. If something goes wrong anywhere,
// it ends up in errorHandler at the bottom, which sends a clear message back to the browser.

import './config/zodMessages.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { swaggerSpec } from './config/swagger.js';
import { requestContext } from './middleware/requestContext.js';
import { auditReadAccess } from './middleware/auditReadAccess.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiRoutes } from './routes/index.js';
import { prisma } from './config/prisma.js';

// The Express app: it receives every request from the browser.
export const app = express();
// The app runs behind Render's proxy, so read the real visitor address from it (needed for sign-in
// limits and the audit log).
app.set('trust proxy', 1);
// Give every request a reference number. It appears in the logs and in error messages, which helps
// to trace a problem.
app.use(requestContext);
// Record in the audit log when someone opens a sensitive record (a prescription file, an
// invoice...).
app.use(auditReadAccess);
// Gzip all API and static responses — reduces payload size by 30–70%
app.use(compression());
// Standard browser security settings.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
// Only our own frontend may call this API from a browser.
app.use(cors({ origin: env.NODE_ENV === 'production' ? false : env.FRONTEND_URL, exposedHeaders: ['Content-Disposition', 'X-Request-Id'] }));
// Bulk catalogue uploads can legitimately be larger than ordinary API requests.
app.use('/api/prescription-uploads', express.json({ limit: '18mb' }));
app.use(express.json({ limit: '5mb' }));
// Write one line per request to the server log.
app.use(morgan('combined', { stream: { write: (message) => logger.http(message.trim()) } }));
// Quick checks used by the hosting service to see if the app is running (/health) and can reach the
// database (/ready).
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'mediflow-api' }));
app.get('/ready', async (_req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: 'ready', service: 'mediflow-api' });
  } catch {
    // Do not expose database addresses, credentials, or driver details to probes.
    return res.status(503).json({ status: 'unavailable', service: 'mediflow-api' });
  }
});
// API documentation pages.
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/openapi.json', (_req, res) => res.json(swaggerSpec));
// All the real features live under /api (see routes/index.js).
app.use('/api', apiRoutes);
// If the built website files exist, serve them too, so one server can host both.
const frontendDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend/dist');
if (existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if ((req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')) return res.sendFile(path.join(frontendDist, 'index.html'));
    return next();
  });
}
// Anything not matched above is "not found". Then every error is turned into a clear reply.
app.use(notFound);
app.use(errorHandler);
