ALTER TABLE "prescription_uploads"
ADD COLUMN "ordered_for_self" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "recipient_name" VARCHAR(150),
ADD COLUMN "recipient_relationship" VARCHAR(100);
