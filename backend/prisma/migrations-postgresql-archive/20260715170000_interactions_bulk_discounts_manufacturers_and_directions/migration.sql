CREATE TYPE "InteractionSeverity" AS ENUM ('MAJOR', 'MODERATE', 'MINOR', 'UNKNOWN');
CREATE TYPE "InteractionSourceType" AS ENUM ('CURATED', 'EXPERIMENTAL');
CREATE TYPE "InteractionReviewStatus" AS ENUM ('PENDING', 'ACKNOWLEDGED', 'OVERRIDDEN');
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');
CREATE TYPE "DiscountScope" AS ENUM ('ORDER', 'CATEGORY', 'PRODUCT');
CREATE TYPE "MealTiming" AS ENUM ('ANY_TIME', 'BEFORE_FOOD', 'WITH_FOOD', 'AFTER_FOOD', 'EMPTY_STOMACH');

DROP INDEX "products_generic_name_strength_dosage_form_key";

ALTER TABLE "prescription_items"
  ADD COLUMN "administration_route" VARCHAR(80) NOT NULL DEFAULT 'Oral',
  ADD COLUMN "as_needed" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "meal_timing" "MealTiming" NOT NULL DEFAULT 'ANY_TIME',
  ADD COLUMN "special_instructions" VARCHAR(500);

ALTER TABLE "products"
  ADD COLUMN "active_ingredient" VARCHAR(180),
  ADD COLUMN "barcode" VARCHAR(80),
  ADD COLUMN "drug_concept_id" INTEGER,
  ADD COLUMN "manufacturer_id" INTEGER,
  ADD COLUMN "pubchem_cid" INTEGER,
  ADD COLUMN "rxnorm_cui" VARCHAR(30),
  ADD COLUMN "smiles" TEXT,
  ADD COLUMN "variant_group" VARCHAR(100);

CREATE TABLE "manufacturers" (
  "id" SERIAL NOT NULL,
  "name" VARCHAR(150) NOT NULL,
  "country" VARCHAR(100),
  "website" VARCHAR(250),
  "phone" VARCHAR(40),
  "email" VARCHAR(190),
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "manufacturers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "drug_concepts" (
  "id" SERIAL NOT NULL,
  "normalized_name" VARCHAR(180) NOT NULL,
  "display_name" VARCHAR(180) NOT NULL,
  "ddinter_id" VARCHAR(30),
  "rxnorm_cui" VARCHAR(30),
  "pubchem_cid" INTEGER,
  "smiles" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "drug_concepts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "drug_interactions" (
  "id" SERIAL NOT NULL,
  "drug_a_id" INTEGER NOT NULL,
  "drug_b_id" INTEGER NOT NULL,
  "severity" "InteractionSeverity" NOT NULL,
  "description" TEXT,
  "mechanism" TEXT,
  "management" TEXT,
  "source" VARCHAR(80) NOT NULL DEFAULT 'DDInter',
  "source_url" VARCHAR(400),
  "version" VARCHAR(40),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "drug_interactions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "prescription_interactions" (
  "id" SERIAL NOT NULL,
  "prescription_id" INTEGER NOT NULL,
  "interaction_id" INTEGER,
  "product_a_id" INTEGER NOT NULL,
  "product_b_id" INTEGER NOT NULL,
  "drug_a_name" VARCHAR(180) NOT NULL,
  "drug_b_name" VARCHAR(180) NOT NULL,
  "severity" "InteractionSeverity" NOT NULL,
  "source_type" "InteractionSourceType" NOT NULL,
  "context" VARCHAR(40) NOT NULL DEFAULT 'CURRENT_PRESCRIPTION',
  "score" DECIMAL(6,5),
  "summary" TEXT,
  "management" TEXT,
  "status" "InteractionReviewStatus" NOT NULL DEFAULT 'PENDING',
  "reviewed_by_id" INTEGER,
  "reviewed_at" TIMESTAMP(3),
  "override_reason" VARCHAR(500),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "prescription_interactions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "discount_rules" (
  "id" SERIAL NOT NULL,
  "name" VARCHAR(150) NOT NULL,
  "code" VARCHAR(40),
  "description" VARCHAR(400),
  "type" "DiscountType" NOT NULL,
  "value" DECIMAL(12,2) NOT NULL,
  "scope" "DiscountScope" NOT NULL DEFAULT 'ORDER',
  "product_id" INTEGER,
  "category_id" INTEGER,
  "minimum_subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "minimum_quantity" DECIMAL(12,3) NOT NULL DEFAULT 0,
  "maximum_discount" DECIMAL(12,2),
  "automatic" BOOLEAN NOT NULL DEFAULT true,
  "combinable" BOOLEAN NOT NULL DEFAULT false,
  "priority" INTEGER NOT NULL DEFAULT 0,
  "starts_at" TIMESTAMP(3),
  "ends_at" TIMESTAMP(3),
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_by_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "discount_rules_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "discount_applications" (
  "id" SERIAL NOT NULL,
  "sale_id" INTEGER NOT NULL,
  "rule_id" INTEGER,
  "rule_name" VARCHAR(150) NOT NULL,
  "rule_type" "DiscountType" NOT NULL,
  "rule_value" DECIMAL(12,2) NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "discount_applications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "manufacturers_name_key" ON "manufacturers"("name");
CREATE UNIQUE INDEX "drug_concepts_normalized_name_key" ON "drug_concepts"("normalized_name");
CREATE INDEX "drug_concepts_ddinter_id_idx" ON "drug_concepts"("ddinter_id");
CREATE INDEX "drug_interactions_drug_a_id_drug_b_id_idx" ON "drug_interactions"("drug_a_id", "drug_b_id");
CREATE INDEX "drug_interactions_severity_idx" ON "drug_interactions"("severity");
CREATE UNIQUE INDEX "drug_interactions_drug_a_id_drug_b_id_source_key" ON "drug_interactions"("drug_a_id", "drug_b_id", "source");
CREATE INDEX "prescription_interactions_prescription_id_status_idx" ON "prescription_interactions"("prescription_id", "status");
CREATE INDEX "prescription_interactions_severity_status_idx" ON "prescription_interactions"("severity", "status");
CREATE UNIQUE INDEX "prescription_interactions_prescription_id_product_a_id_prod_key" ON "prescription_interactions"("prescription_id", "product_a_id", "product_b_id", "source_type");
CREATE UNIQUE INDEX "discount_rules_code_key" ON "discount_rules"("code");
CREATE INDEX "discount_rules_active_starts_at_ends_at_idx" ON "discount_rules"("active", "starts_at", "ends_at");
CREATE INDEX "discount_applications_sale_id_idx" ON "discount_applications"("sale_id");
CREATE UNIQUE INDEX "products_barcode_key" ON "products"("barcode");
CREATE INDEX "products_manufacturer_id_idx" ON "products"("manufacturer_id");
CREATE INDEX "products_drug_concept_id_idx" ON "products"("drug_concept_id");

ALTER TABLE "products" ADD CONSTRAINT "products_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "manufacturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_drug_concept_id_fkey" FOREIGN KEY ("drug_concept_id") REFERENCES "drug_concepts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "drug_interactions" ADD CONSTRAINT "drug_interactions_drug_a_id_fkey" FOREIGN KEY ("drug_a_id") REFERENCES "drug_concepts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "drug_interactions" ADD CONSTRAINT "drug_interactions_drug_b_id_fkey" FOREIGN KEY ("drug_b_id") REFERENCES "drug_concepts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "prescription_interactions" ADD CONSTRAINT "prescription_interactions_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "prescription_interactions" ADD CONSTRAINT "prescription_interactions_interaction_id_fkey" FOREIGN KEY ("interaction_id") REFERENCES "drug_interactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "prescription_interactions" ADD CONSTRAINT "prescription_interactions_product_a_id_fkey" FOREIGN KEY ("product_a_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "prescription_interactions" ADD CONSTRAINT "prescription_interactions_product_b_id_fkey" FOREIGN KEY ("product_b_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "prescription_interactions" ADD CONSTRAINT "prescription_interactions_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "discount_rules" ADD CONSTRAINT "discount_rules_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "discount_rules" ADD CONSTRAINT "discount_rules_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "discount_rules" ADD CONSTRAINT "discount_rules_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "discount_applications" ADD CONSTRAINT "discount_applications_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "discount_applications" ADD CONSTRAINT "discount_applications_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "discount_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
