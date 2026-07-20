ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'CASHIER';

CREATE TYPE "PaymentRequestStatus" AS ENUM ('AWAITING_PAYMENT', 'PAID', 'FULFILLED', 'CANCELLED');

ALTER TABLE "users" ADD COLUMN "cashier_access" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "prescriptions" ADD COLUMN "source_upload_id" INTEGER;
ALTER TABLE "sales" ADD COLUMN "cashier_id" INTEGER;
ALTER TABLE "sales" ADD COLUMN "payment_request_id" INTEGER;

CREATE TABLE "payment_requests" (
    "id" SERIAL NOT NULL,
    "request_number" VARCHAR(40) NOT NULL,
    "prescription_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "pharmacist_id" INTEGER NOT NULL,
    "cashier_id" INTEGER,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "amount_paid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "payment_method" "PaymentMethod",
    "status" "PaymentRequestStatus" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "coupon_code" VARCHAR(40),
    "pickup_pin_hash" VARCHAR(64),
    "pickup_pin_encrypted" VARCHAR(200),
    "pin_attempts" INTEGER NOT NULL DEFAULT 0,
    "paid_at" TIMESTAMP(3),
    "pin_verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payment_requests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payment_request_items" (
    "id" SERIAL NOT NULL,
    "payment_request_id" INTEGER NOT NULL,
    "prescription_item_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,
    CONSTRAINT "payment_request_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "prescriptions_source_upload_id_key" ON "prescriptions"("source_upload_id");
CREATE UNIQUE INDEX "sales_payment_request_id_key" ON "sales"("payment_request_id");
CREATE UNIQUE INDEX "payment_requests_request_number_key" ON "payment_requests"("request_number");
CREATE UNIQUE INDEX "payment_requests_prescription_id_key" ON "payment_requests"("prescription_id");
CREATE INDEX "payment_requests_status_created_at_idx" ON "payment_requests"("status", "created_at");
CREATE INDEX "payment_requests_patient_id_created_at_idx" ON "payment_requests"("patient_id", "created_at");
CREATE UNIQUE INDEX "payment_request_items_payment_request_id_prescription_item_id_key" ON "payment_request_items"("payment_request_id", "prescription_item_id");

ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_source_upload_id_fkey" FOREIGN KEY ("source_upload_id") REFERENCES "prescription_uploads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "sales" ADD CONSTRAINT "sales_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "sales" ADD CONSTRAINT "sales_payment_request_id_fkey" FOREIGN KEY ("payment_request_id") REFERENCES "payment_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_pharmacist_id_fkey" FOREIGN KEY ("pharmacist_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payment_request_items" ADD CONSTRAINT "payment_request_items_payment_request_id_fkey" FOREIGN KEY ("payment_request_id") REFERENCES "payment_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payment_request_items" ADD CONSTRAINT "payment_request_items_prescription_item_id_fkey" FOREIGN KEY ("prescription_item_id") REFERENCES "prescription_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payment_request_items" ADD CONSTRAINT "payment_request_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
