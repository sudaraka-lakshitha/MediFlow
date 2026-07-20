ALTER TABLE "products"
ADD COLUMN "minimum_age_years" INTEGER,
ADD COLUMN "maximum_age_years" INTEGER;

ALTER TABLE "products"
ADD CONSTRAINT "products_age_limits_check"
CHECK (
  ("minimum_age_years" IS NULL OR "minimum_age_years" >= 0)
  AND ("maximum_age_years" IS NULL OR "maximum_age_years" >= 0)
  AND ("minimum_age_years" IS NULL OR "maximum_age_years" IS NULL OR "minimum_age_years" <= "maximum_age_years")
);
