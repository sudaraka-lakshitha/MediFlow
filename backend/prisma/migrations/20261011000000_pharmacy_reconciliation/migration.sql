ALTER TABLE `users` ADD COLUMN `pharmacy_reconciliation_access` BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE `pharmacy_balance_confirmations` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `confirmed_by_id` INTEGER NOT NULL,
  `day` VARCHAR(10) NOT NULL,
  `fingerprint` VARCHAR(64) NOT NULL,
  `snapshot` JSON NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `pharmacy_balance_confirmations_day_fingerprint_key` (`day`, `fingerprint`),
  INDEX `pharmacy_balance_confirmations_day_id_idx` (`day`, `id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
