// The server log. Errors and important events are written here; look here first when something
// fails on the server.

import winston from 'winston';
import { env } from './env.js';

const transports = [new winston.transports.Console()];
if (env.NODE_ENV !== 'test') {
  transports.push(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
  transports.push(new winston.transports.File({ filename: 'logs/application.log' }));
}

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: 'mediflow-api' },
  transports,
});
