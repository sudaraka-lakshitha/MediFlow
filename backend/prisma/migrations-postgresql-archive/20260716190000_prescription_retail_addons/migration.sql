CREATE TABLE "prescription_retail_items" (
    "id" SERIAL NOT NULL,
    "prescription_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescription_retail_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "prescription_retail_items_prescription_id_product_id_key"
ON "prescription_retail_items"("prescription_id", "product_id");

CREATE INDEX "prescription_retail_items_product_id_idx"
ON "prescription_retail_items"("product_id");

ALTER TABLE "prescription_retail_items"
ADD CONSTRAINT "prescription_retail_items_prescription_id_fkey"
FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "prescription_retail_items"
ADD CONSTRAINT "prescription_retail_items_product_id_fkey"
FOREIGN KEY ("product_id") REFERENCES "products"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
