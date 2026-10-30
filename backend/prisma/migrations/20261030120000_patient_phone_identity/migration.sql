CREATE TABLE `patient_phone_identities` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `user_id` INTEGER NOT NULL,
  `phone` VARCHAR(40) NOT NULL,
  UNIQUE INDEX `patient_phone_identities_user_id_key` (`user_id`),
  UNIQUE INDEX `patient_phone_identities_phone_key` (`phone`),
  PRIMARY KEY (`id`),
  CONSTRAINT `patient_phone_identities_user_id_fkey`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Backfill only unambiguous existing patient numbers. Existing duplicates remain
-- visible to the application-level duplicate check and require admin cleanup.
INSERT INTO `patient_phone_identities` (`user_id`, `phone`)
SELECT normalized.`id`, normalized.`canonical_phone`
FROM (
  SELECT raw_phone.`id`,
    CASE
      WHEN LEFT(raw_phone.`digits`, 2) = '94' THEN CONCAT('+', raw_phone.`digits`)
      WHEN LEFT(raw_phone.`digits`, 1) = '0' THEN CONCAT('+94', SUBSTRING(raw_phone.`digits`, 2))
      ELSE CONCAT('+', raw_phone.`digits`)
    END AS `canonical_phone`
  FROM (
    SELECT `id`, REGEXP_REPLACE(`phone`, '[^0-9]', '') AS `digits`
    FROM `users`
    WHERE `role` = 'PATIENT' AND `phone` IS NOT NULL AND TRIM(`phone`) <> ''
  ) raw_phone
) normalized
JOIN `patient_profiles` p ON p.`user_id` = normalized.`id`
JOIN (
  SELECT canonical_phone
  FROM (
    SELECT CASE
      WHEN LEFT(raw_phone.`digits`, 2) = '94' THEN CONCAT('+', raw_phone.`digits`)
      WHEN LEFT(raw_phone.`digits`, 1) = '0' THEN CONCAT('+94', SUBSTRING(raw_phone.`digits`, 2))
      ELSE CONCAT('+', raw_phone.`digits`)
    END AS canonical_phone
    FROM (
      SELECT `phone`, REGEXP_REPLACE(`phone`, '[^0-9]', '') AS `digits`
      FROM `users`
      WHERE `role` = 'PATIENT' AND `phone` IS NOT NULL AND TRIM(`phone`) <> ''
    ) raw_phone
  ) canonical_numbers
  GROUP BY canonical_phone
  HAVING COUNT(*) = 1
) unique_patient_phone ON unique_patient_phone.`canonical_phone` = normalized.`canonical_phone`;
