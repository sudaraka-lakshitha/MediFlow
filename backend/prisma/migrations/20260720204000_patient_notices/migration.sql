CREATE TABLE "patient_notices" (
  "id" SERIAL NOT NULL,
  "patient_id" INTEGER NOT NULL,
  "created_by_id" INTEGER NOT NULL,
  "title" VARCHAR(150) NOT NULL,
  "message" VARCHAR(1000) NOT NULL,
  "read_at" TIMESTAMPTZ(3),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "patient_notices_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "patient_notices_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "patient_notices_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "patient_notices_patient_id_created_at_idx" ON "patient_notices"("patient_id", "created_at");
