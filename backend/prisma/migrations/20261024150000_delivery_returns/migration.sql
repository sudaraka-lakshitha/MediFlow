ALTER TABLE `delivery_requests`
  ADD COLUMN `returned_at` DATETIME(3) NULL,
  ADD COLUMN `return_reason` VARCHAR(500) NULL,
  ADD COLUMN `shipment_attempt` INTEGER NOT NULL DEFAULT 1;
