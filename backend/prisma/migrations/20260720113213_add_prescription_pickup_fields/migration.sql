-- AlterTable
ALTER TABLE "public"."prescriptions" ADD COLUMN     "pickup_note" VARCHAR(500),
ADD COLUMN     "planned_pickup_at" TIMESTAMPTZ(3);
