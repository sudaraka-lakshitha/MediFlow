-- CreateEnum
CREATE TYPE "public"."RegistrationSource" AS ENUM ('SELF', 'PHARMACIST', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."patient_profiles" ADD COLUMN     "registered_by_id" INTEGER,
ADD COLUMN     "registration_source" "public"."RegistrationSource" NOT NULL DEFAULT 'SELF';

-- AlterTable
ALTER TABLE "public"."prescriptions" ADD COLUMN     "ordered_for_self" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "recipient_name" VARCHAR(150),
ADD COLUMN     "recipient_relationship" VARCHAR(100),
ALTER COLUMN "prescription_date" SET DATA TYPE TIMESTAMPTZ(3);

-- AddForeignKey
ALTER TABLE "public"."patient_profiles" ADD CONSTRAINT "patient_profiles_registered_by_id_fkey" FOREIGN KEY ("registered_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
