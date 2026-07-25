import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
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

export const app = express();
app.set('trust proxy', 1);
app.use(requestContext);
app.use(auditReadAccess);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.NODE_ENV === 'production' ? false : env.FRONTEND_URL, exposedHeaders: ['Content-Disposition', 'X-Request-Id'] }));
// Bulk catalogue uploads can legitimately be larger than ordinary API requests.
app.use(express.json({ limit: '5mb' }));
app.use(morgan('combined', { stream: { write: (message) => logger.http(message.trim()) } }));
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'mediflow-api' }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/openapi.json', (_req, res) => res.json(swaggerSpec));
app.use('/api', apiRoutes);
const frontendDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend/dist');
if (existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if ((req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')) return res.sendFile(path.join(frontendDist, 'index.html'));
    return next();
  });
}
app.use(notFound);
app.use(errorHandler);
