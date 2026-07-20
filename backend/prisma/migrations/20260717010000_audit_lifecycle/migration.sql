ALTER TABLE "audit_logs"
ADD COLUMN "read_at" TIMESTAMPTZ(3),
ADD COLUMN "deleted_at" TIMESTAMPTZ(3);

CREATE INDEX "audit_logs_deleted_at_idx"
ON "audit_logs"("deleted_at");

CREATE INDEX "audit_logs_success_read_at_deleted_at_idx"
ON "audit_logs"("success", "read_at", "deleted_at");
