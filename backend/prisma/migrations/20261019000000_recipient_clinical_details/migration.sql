-- These optional fields were previously added to the Prisma model without a
-- migration. Preserve databases where they already exist from a local db push.
SET @recipient_clinical_sql = IF(
  EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'prescriptions' AND COLUMN_NAME = 'recipient_allergies'),
  'SELECT 1',
  'ALTER TABLE `prescriptions` ADD COLUMN `recipient_allergies` VARCHAR(500) NULL'
);
PREPARE recipient_clinical_statement FROM @recipient_clinical_sql;
EXECUTE recipient_clinical_statement;
DEALLOCATE PREPARE recipient_clinical_statement;

SET @recipient_clinical_sql = IF(
  EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'prescriptions' AND COLUMN_NAME = 'recipient_conditions'),
  'SELECT 1',
  'ALTER TABLE `prescriptions` ADD COLUMN `recipient_conditions` VARCHAR(500) NULL'
);
PREPARE recipient_clinical_statement FROM @recipient_clinical_sql;
EXECUTE recipient_clinical_statement;
DEALLOCATE PREPARE recipient_clinical_statement;

SET @recipient_clinical_sql = IF(
  EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'prescription_uploads' AND COLUMN_NAME = 'recipient_allergies'),
  'SELECT 1',
  'ALTER TABLE `prescription_uploads` ADD COLUMN `recipient_allergies` VARCHAR(500) NULL'
);
PREPARE recipient_clinical_statement FROM @recipient_clinical_sql;
EXECUTE recipient_clinical_statement;
DEALLOCATE PREPARE recipient_clinical_statement;

SET @recipient_clinical_sql = IF(
  EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'prescription_uploads' AND COLUMN_NAME = 'recipient_conditions'),
  'SELECT 1',
  'ALTER TABLE `prescription_uploads` ADD COLUMN `recipient_conditions` VARCHAR(500) NULL'
);
PREPARE recipient_clinical_statement FROM @recipient_clinical_sql;
EXECUTE recipient_clinical_statement;
DEALLOCATE PREPARE recipient_clinical_statement;
