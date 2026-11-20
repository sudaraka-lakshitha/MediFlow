// SETTINGS FROM THE .env FILE
// Every setting the server needs is checked here when it starts. If one is missing or wrong
// (for example JWT_SECRET shorter than 32 characters), the server stops at once with a clear
// message,
// instead of failing later in a confusing way.
// REPORT_TIMEZONE_OFFSET_MINUTES = 330 means Sri Lanka time (UTC + 5 hours 30 minutes).

import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  MYSQL_DATABASE_URL: z.string().optional(),
  AIVEN_PRISMA_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must contain at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('12h'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  LOG_LEVEL: z.string().default('info'),
  REPORT_TIMEZONE_OFFSET_MINUTES: z.coerce.number().int().min(-720).max(840).default(330),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_SECURE: z.string().default('true').transform((value) => value === 'true'),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.preprocess((value) => value === '' ? undefined : value, z.string().min(1).optional()),
  MAIL_FROM: z.string().email().optional(),
  PASSWORD_RESET_OTP_MINUTES: z.coerce.number().int().min(5).max(30).default(10),
  PASSWORD_RESET_RESEND_SECONDS: z.coerce.number().int().min(30).max(300).default(60),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.message).join(', ')}`);
}

export const env = parsed.data;
