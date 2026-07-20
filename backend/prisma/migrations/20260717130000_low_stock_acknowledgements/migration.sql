CREATE TABLE "low_stock_acknowledgements" (
    "product_id" INTEGER NOT NULL,
    "stock_level" DECIMAL(12,3) NOT NULL,
    "acknowledged_by_id" INTEGER NOT NULL,
    "acknowledged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "low_stock_acknowledgements_pkey" PRIMARY KEY ("product_id")
);

CREATE INDEX "low_stock_acknowledgements_acknowledged_by_id_acknowledged_at_idx"
ON "low_stock_acknowledgements"("acknowledged_by_id", "acknowledged_at");

ALTER TABLE "low_stock_acknowledgements"
ADD CONSTRAINT "low_stock_acknowledgements_product_id_fkey"
FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "low_stock_acknowledgements"
ADD CONSTRAINT "low_stock_acknowledgements_acknowledged_by_id_fkey"
FOREIGN KEY ("acknowledged_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
