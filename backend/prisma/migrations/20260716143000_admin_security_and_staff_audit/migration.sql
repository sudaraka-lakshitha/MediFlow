ALTER TABLE "users"
ADD COLUMN "token_version" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "last_login_at" TIMESTAMP(3),
ADD COLUMN "password_changed_at" TIMESTAMP(3);

ALTER TABLE "audit_logs"
ADD COLUMN "request_id" VARCHAR(64),
ADD COLUMN "method" VARCHAR(10),
ADD COLUMN "path" VARCHAR(300);

CREATE INDEX "audit_logs_action_created_at_idx" ON "audit_logs"("action", "created_at");
CREATE INDEX "audit_logs_success_created_at_idx" ON "audit_logs"("success", "created_at");
