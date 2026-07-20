CREATE TYPE "UploadReviewStatus" AS ENUM ('PENDING', 'AVAILABLE', 'PARTIALLY_AVAILABLE', 'UNAVAILABLE');

CREATE TABLE "prescription_uploads" (
  "id" SERIAL NOT NULL,
  "patient_id" INTEGER NOT NULL,
  "original_name" VARCHAR(180) NOT NULL,
  "mime_type" VARCHAR(80) NOT NULL,
  "file_data" BYTEA NOT NULL,
  "patient_note" VARCHAR(500),
  "status" "UploadReviewStatus" NOT NULL DEFAULT 'PENDING',
  "availability_notes" VARCHAR(1000),
  "estimated_total" DECIMAL(12,2),
  "reviewed_by_id" INTEGER,
  "reviewed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "prescription_uploads_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "prescription_uploads_patient_id_created_at_idx" ON "prescription_uploads"("patient_id", "created_at");
CREATE INDEX "prescription_uploads_status_created_at_idx" ON "prescription_uploads"("status", "created_at");
ALTER TABLE "prescription_uploads" ADD CONSTRAINT "prescription_uploads_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "prescription_uploads" ADD CONSTRAINT "prescription_uploads_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
