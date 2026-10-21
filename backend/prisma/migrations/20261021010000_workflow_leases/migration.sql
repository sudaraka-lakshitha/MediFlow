CREATE TABLE `workflow_leases` (
  `resource_key` VARCHAR(80) NOT NULL,
  `token` VARCHAR(36) NOT NULL,
  `user_id` INTEGER NOT NULL,
  `session_id` VARCHAR(36) NOT NULL,
  `client_id` VARCHAR(36) NOT NULL,
  `expires_at` DATETIME(3) NOT NULL,
  `processing` BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (`resource_key`),
  INDEX `workflow_leases_expires_at_idx` (`expires_at`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
