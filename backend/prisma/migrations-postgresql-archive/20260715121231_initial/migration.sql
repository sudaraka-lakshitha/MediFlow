-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'PHARMACIST', 'PATIENT');

-- CreateEnum
CREATE TYPE "public"."PrescriptionStatus" AS ENUM ('PENDING', 'VERIFIED', 'PARTIALLY_DISPENSED', 'DISPENSED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."StockMovementType" AS ENUM ('RECEIPT', 'DISPENSING', 'ADJUSTMENT', 'REVERSAL', 'EXPIRED', 'DAMAGED', 'RETURN');

-- CreateEnum
CREATE TYPE "public"."SaleStatus" AS ENUM ('PENDING', 'PAID', 'VOIDED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'CARD', 'OTHER');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(190) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(40),
    "role" "public"."Role" NOT NULL DEFAULT 'PATIENT',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."patient_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "patient_number" VARCHAR(30) NOT NULL,
    "date_of_birth" DATE,
    "address" VARCHAR(300),
    "allergies" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(300),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" SERIAL NOT NULL,
    "sku" VARCHAR(40) NOT NULL,
    "generic_name" VARCHAR(150) NOT NULL,
    "brand_name" VARCHAR(150),
    "strength" VARCHAR(80) NOT NULL,
    "dosage_form" VARCHAR(80) NOT NULL,
    "unit" VARCHAR(40) NOT NULL DEFAULT 'unit',
    "manufacturer" VARCHAR(150),
    "selling_price" DECIMAL(12,2) NOT NULL,
    "reorder_level" INTEGER NOT NULL DEFAULT 0,
    "prescription_required" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."suppliers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "contact_person" VARCHAR(150),
    "phone" VARCHAR(40),
    "email" VARCHAR(190),
    "address" VARCHAR(300),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventory_batches" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "supplier_id" INTEGER,
    "batch_number" VARCHAR(80) NOT NULL,
    "quantity_received" DECIMAL(12,3) NOT NULL,
    "quantity_available" DECIMAL(12,3) NOT NULL,
    "purchase_price" DECIMAL(12,2) NOT NULL,
    "expiry_date" DATE NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stock_movements" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "type" "public"."StockMovementType" NOT NULL,
    "quantity_change" DECIMAL(12,3) NOT NULL,
    "quantity_before" DECIMAL(12,3) NOT NULL,
    "quantity_after" DECIMAL(12,3) NOT NULL,
    "reference_type" VARCHAR(40),
    "reference_id" INTEGER,
    "reason" VARCHAR(300),
    "performed_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prescriptions" (
    "id" SERIAL NOT NULL,
    "prescription_number" VARCHAR(40) NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "prescriber_name" VARCHAR(150) NOT NULL,
    "prescriber_reference" VARCHAR(100),
    "prescription_date" DATE NOT NULL,
    "status" "public"."PrescriptionStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "rejection_reason" TEXT,
    "created_by_id" INTEGER NOT NULL,
    "verified_by_id" INTEGER,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prescription_items" (
    "id" SERIAL NOT NULL,
    "prescription_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity_per_dose" DECIMAL(12,3) NOT NULL,
    "times_per_day" INTEGER NOT NULL,
    "days_supply" INTEGER NOT NULL,
    "calculated_quantity" DECIMAL(12,3) NOT NULL,
    "prescribed_quantity" DECIMAL(12,3) NOT NULL,
    "dispensed_quantity" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "quantity_overridden" BOOLEAN NOT NULL DEFAULT false,
    "override_reason" VARCHAR(300),
    "dosage_instructions" VARCHAR(250) NOT NULL,
    "frequency" VARCHAR(100),
    "duration" VARCHAR(100),
    "notes" VARCHAR(300),

    CONSTRAINT "prescription_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dispensings" (
    "id" SERIAL NOT NULL,
    "prescription_id" INTEGER NOT NULL,
    "pharmacist_id" INTEGER NOT NULL,
    "notes" TEXT,
    "reversed" BOOLEAN NOT NULL DEFAULT false,
    "reversal_reason" TEXT,
    "dispensed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispensings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dispensing_items" (
    "id" SERIAL NOT NULL,
    "dispensing_id" INTEGER NOT NULL,
    "prescription_item_id" INTEGER NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "dispensing_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sales" (
    "id" SERIAL NOT NULL,
    "invoice_number" VARCHAR(40) NOT NULL,
    "dispensing_id" INTEGER,
    "patient_id" INTEGER,
    "pharmacist_id" INTEGER NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "amount_paid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "payment_method" "public"."PaymentMethod" NOT NULL DEFAULT 'CASH',
    "status" "public"."SaleStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sale_items" (
    "id" SERIAL NOT NULL,
    "sale_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "sale_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" VARCHAR(80) NOT NULL,
    "entity_type" VARCHAR(80),
    "entity_id" INTEGER,
    "details" JSONB,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "ip_address" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_role_active_idx" ON "public"."users"("role", "active");

-- CreateIndex
CREATE UNIQUE INDEX "patient_profiles_user_id_key" ON "public"."patient_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "patient_profiles_patient_number_key" ON "public"."patient_profiles"("patient_number");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "public"."products"("sku");

-- CreateIndex
CREATE INDEX "products_generic_name_idx" ON "public"."products"("generic_name");

-- CreateIndex
CREATE INDEX "products_category_id_active_idx" ON "public"."products"("category_id", "active");

-- CreateIndex
CREATE UNIQUE INDEX "products_generic_name_strength_dosage_form_key" ON "public"."products"("generic_name", "strength", "dosage_form");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_name_key" ON "public"."suppliers"("name");

-- CreateIndex
CREATE INDEX "inventory_batches_product_id_received_at_expiry_date_idx" ON "public"."inventory_batches"("product_id", "received_at", "expiry_date");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_batches_product_id_batch_number_key" ON "public"."inventory_batches"("product_id", "batch_number");

-- CreateIndex
CREATE INDEX "stock_movements_product_id_created_at_idx" ON "public"."stock_movements"("product_id", "created_at");

-- CreateIndex
CREATE INDEX "stock_movements_created_at_idx" ON "public"."stock_movements"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_prescription_number_key" ON "public"."prescriptions"("prescription_number");

-- CreateIndex
CREATE INDEX "prescriptions_patient_id_prescription_date_idx" ON "public"."prescriptions"("patient_id", "prescription_date");

-- CreateIndex
CREATE INDEX "prescriptions_status_idx" ON "public"."prescriptions"("status");

-- CreateIndex
CREATE INDEX "prescription_items_prescription_id_idx" ON "public"."prescription_items"("prescription_id");

-- CreateIndex
CREATE INDEX "dispensings_dispensed_at_idx" ON "public"."dispensings"("dispensed_at");

-- CreateIndex
CREATE UNIQUE INDEX "sales_invoice_number_key" ON "public"."sales"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "sales_dispensing_id_key" ON "public"."sales"("dispensing_id");

-- CreateIndex
CREATE INDEX "sales_created_at_idx" ON "public"."sales"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "public"."audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "public"."audit_logs"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "public"."patient_profiles" ADD CONSTRAINT "patient_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_batches" ADD CONSTRAINT "inventory_batches_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_batches" ADD CONSTRAINT "inventory_batches_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_movements" ADD CONSTRAINT "stock_movements_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_movements" ADD CONSTRAINT "stock_movements_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "public"."inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_movements" ADD CONSTRAINT "stock_movements_performed_by_id_fkey" FOREIGN KEY ("performed_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prescriptions" ADD CONSTRAINT "prescriptions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patient_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prescriptions" ADD CONSTRAINT "prescriptions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prescriptions" ADD CONSTRAINT "prescriptions_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prescription_items" ADD CONSTRAINT "prescription_items_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prescription_items" ADD CONSTRAINT "prescription_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dispensings" ADD CONSTRAINT "dispensings_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dispensings" ADD CONSTRAINT "dispensings_pharmacist_id_fkey" FOREIGN KEY ("pharmacist_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dispensing_items" ADD CONSTRAINT "dispensing_items_dispensing_id_fkey" FOREIGN KEY ("dispensing_id") REFERENCES "public"."dispensings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dispensing_items" ADD CONSTRAINT "dispensing_items_prescription_item_id_fkey" FOREIGN KEY ("prescription_item_id") REFERENCES "public"."prescription_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dispensing_items" ADD CONSTRAINT "dispensing_items_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "public"."inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_dispensing_id_fkey" FOREIGN KEY ("dispensing_id") REFERENCES "public"."dispensings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_pharmacist_id_fkey" FOREIGN KEY ("pharmacist_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale_items" ADD CONSTRAINT "sale_items_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale_items" ADD CONSTRAINT "sale_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale_items" ADD CONSTRAINT "sale_items_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "public"."inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
