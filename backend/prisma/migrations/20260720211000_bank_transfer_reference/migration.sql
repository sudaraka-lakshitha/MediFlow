ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'BANK_TRANSFER';
ALTER TABLE "payment_requests" ADD COLUMN "payment_reference" VARCHAR(120);
