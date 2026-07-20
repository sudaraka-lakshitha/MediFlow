-- DropForeignKey
ALTER TABLE "public"."payment_request_items" DROP CONSTRAINT "payment_request_items_prescription_item_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."payment_requests" DROP CONSTRAINT "payment_requests_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."payment_requests" DROP CONSTRAINT "payment_requests_prescription_id_fkey";

-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "read_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."patient_profiles" ADD COLUMN     "chronic_conditions" TEXT;

-- AlterTable
ALTER TABLE "public"."prescriptions" ADD COLUMN     "original_prescription_id" INTEGER,
ADD COLUMN     "refills_allowed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "refills_used" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "prescriptions_original_prescription_id_idx" ON "public"."prescriptions"("original_prescription_id");

-- AddForeignKey
ALTER TABLE "public"."prescriptions" ADD CONSTRAINT "prescriptions_original_prescription_id_fkey" FOREIGN KEY ("original_prescription_id") REFERENCES "public"."prescriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment_requests" ADD CONSTRAINT "payment_requests_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment_requests" ADD CONSTRAINT "payment_requests_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment_request_items" ADD CONSTRAINT "payment_request_items_prescription_item_id_fkey" FOREIGN KEY ("prescription_item_id") REFERENCES "public"."prescription_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "public"."low_stock_acknowledgements_acknowledged_by_id_acknowledged_at_i" RENAME TO "low_stock_acknowledgements_acknowledged_by_id_acknowledged__idx";

-- RenameIndex
ALTER INDEX "public"."payment_request_items_payment_request_id_prescription_item_id_k" RENAME TO "payment_request_items_payment_request_id_prescription_item__key";
