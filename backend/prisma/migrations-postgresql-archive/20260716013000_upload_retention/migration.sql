ALTER TABLE "prescription_uploads" ADD COLUMN "delete_at" TIMESTAMP(3);
CREATE INDEX "prescription_uploads_delete_at_idx" ON "prescription_uploads"("delete_at");

CREATE TABLE "system_settings" (
  "key" VARCHAR(80) NOT NULL,
  "value" VARCHAR(500) NOT NULL,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "system_settings_pkey" PRIMARY KEY ("key")
);

INSERT INTO "system_settings" ("key", "value", "updated_at") VALUES ('prescriptionUploadRetentionDays', '30', CURRENT_TIMESTAMP);
UPDATE "prescription_uploads" SET "delete_at" = "created_at" + INTERVAL '30 days' WHERE "delete_at" IS NULL;
