CREATE TABLE `auth_rate_limits` (
  `id` VARCHAR(64) NOT NULL,
  `attempts` INTEGER NOT NULL,
  `expires_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`), INDEX `auth_rate_limits_expires_at_idx` (`expires_at`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
