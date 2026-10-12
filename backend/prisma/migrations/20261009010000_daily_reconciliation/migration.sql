CREATE TABLE `sale_payments` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `sale_id` INTEGER NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `method` ENUM('CASH','CARD','BANK_TRANSFER','OTHER') NOT NULL,
  `reference` VARCHAR(120) NULL,
  `cashier_id` INTEGER NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`), INDEX `sale_payments_created_at_cashier_id_idx` (`created_at`,`cashier_id`),
  CONSTRAINT `sale_payments_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `daily_balance_confirmations` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `cashier_id` INTEGER NOT NULL,
  `day` VARCHAR(10) NOT NULL,
  `fingerprint` VARCHAR(64) NOT NULL,
  `snapshot` JSON NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`), INDEX `daily_balance_confirmations_cashier_id_day_idx` (`cashier_id`,`day`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
