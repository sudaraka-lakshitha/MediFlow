CREATE TABLE `operation_receipts` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `actor_id` INTEGER NOT NULL,
  `key` VARCHAR(36) NOT NULL,
  `payload_hash` VARCHAR(64) NOT NULL,
  `result` JSON NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `operation_receipts_actor_id_key_key` (`actor_id`, `key`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
