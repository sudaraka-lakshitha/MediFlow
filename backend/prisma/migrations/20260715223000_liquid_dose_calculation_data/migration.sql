ALTER TABLE "prescription_items"
  ADD COLUMN "dose_input_amount" DECIMAL(12,3),
  ADD COLUMN "dose_input_unit" VARCHAR(20),
  ADD COLUMN "concentration_amount" DECIMAL(12,3),
  ADD COLUMN "concentration_unit" VARCHAR(20),
  ADD COLUMN "concentration_volume" DECIMAL(12,3);
