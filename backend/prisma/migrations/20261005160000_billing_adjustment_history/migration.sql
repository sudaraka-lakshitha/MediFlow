ALTER TABLE `payment_requests`
  ADD COLUMN `refunded_amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN `customer_cancellation_reason` VARCHAR(500) NULL;
CREATE TABLE `payment_request_events` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `payment_request_id` INTEGER NOT NULL,
  `kind` VARCHAR(40) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `revision` INTEGER NOT NULL,
  `actor_id` INTEGER NULL,
  `details` JSON NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `payment_request_events_created_at_kind_idx` (`created_at`, `kind`),
  INDEX `payment_request_events_payment_request_id_created_at_idx` (`payment_request_id`, `created_at`),
  CONSTRAINT `payment_request_events_payment_request_id_fkey` FOREIGN KEY (`payment_request_id`) REFERENCES `payment_requests` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Preserve only known historic amounts. Earlier overwritten partial refunds
-- cannot be reconstructed reliably and are explicitly marked as legacy data.
INSERT INTO `payment_request_events` (`payment_request_id`, `kind`, `amount`, `revision`, `actor_id`, `details`, `created_at`)
SELECT `id`, 'PAYMENT_RECEIVED', `amount_paid`, `revision`, `cashier_id`, JSON_OBJECT('legacyImported', true), `paid_at`
FROM `payment_requests` WHERE `paid_at` IS NOT NULL AND `amount_paid` > 0;
INSERT INTO `payment_request_events` (`payment_request_id`, `kind`, `amount`, `revision`, `actor_id`, `details`, `created_at`)
SELECT `id`, 'REFUND', -`amount_paid`, `revision`, `cancelled_by_id`, JSON_OBJECT('legacyImported', true), `cancelled_at`
FROM `payment_requests` WHERE `status` = 'CANCELLED' AND `cancelled_at` IS NOT NULL AND `paid_at` IS NOT NULL AND `amount_paid` > 0;
UPDATE `payment_requests` SET `refunded_amount` = `amount_paid` WHERE `status` = 'CANCELLED' AND `paid_at` IS NOT NULL;
UPDATE `payment_requests` SET `customer_cancellation_reason` = TRIM(SUBSTRING(`cancellation_reason`, LENGTH('Customer cancellation requested:') + 1))
WHERE `cancellation_reason` LIKE 'Customer cancellation requested:%';
