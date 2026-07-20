ALTER TABLE "inventory_batches"
ADD COLUMN "restricted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "restriction_reason" VARCHAR(500),
ADD COLUMN "restricted_at" TIMESTAMPTZ(3);

CREATE INDEX "inventory_batches_restricted_idx" ON "inventory_batches"("restricted");
