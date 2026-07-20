import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must contain at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('12h'),
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
