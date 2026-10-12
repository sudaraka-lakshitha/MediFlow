ALTER TABLE `prescription_uploads`
  MODIFY `status` ENUM('PENDING','AVAILABLE','PARTIALLY_AVAILABLE','UNAVAILABLE','REJECTED','QUOTE_SENT','QUOTE_ACCEPTED','PAYMENT_PENDING','PAYMENT_SUBMITTED','READY_TO_PREPARE') NOT NULL DEFAULT 'PENDING',
  ADD COLUMN `quote_revision` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `acknowledged_quote_revision` INTEGER NULL,
  ADD COLUMN `quote_sent_at` DATETIME(3) NULL,
  ADD COLUMN `quote_acknowledged_at` DATETIME(3) NULL;

ALTER TABLE `payment_requests`
  ADD COLUMN `revision` INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN `acknowledged_revision` INTEGER NULL,
  ADD COLUMN `customer_acknowledged_at` DATETIME(3) NULL,
  ADD COLUMN `customer_payment_choice` ENUM('CASH','CARD','BANK_TRANSFER','OTHER') NULL,
  ADD COLUMN `reservation_duration_hours` INTEGER NULL,
  ADD COLUMN `reservation_expires_at` DATETIME(3) NULL,
  ADD COLUMN `pharmacy_note` VARCHAR(500) NULL,
  ADD COLUMN `customer_note` VARCHAR(500) NULL;

CREATE INDEX `payment_requests_reservation_expires_at_idx` ON `payment_requests`(`reservation_expires_at`);
