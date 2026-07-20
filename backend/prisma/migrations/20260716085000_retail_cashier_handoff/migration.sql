CREATE TYPE "PaymentRequestType" AS ENUM ('PRESCRIPTION', 'RETAIL');

ALTER TABLE "payment_requests"
ADD COLUMN "type" "PaymentRequestType" NOT NULL DEFAULT 'PRESCRIPTION';

ALTER TABLE "payment_requests" ALTER COLUMN "prescription_id" DROP NOT NULL;
ALTER TABLE "payment_requests" ALTER COLUMN "patient_id" DROP NOT NULL;
ALTER TABLE "payment_request_items" ALTER COLUMN "prescription_item_id" DROP NOT NULL;
