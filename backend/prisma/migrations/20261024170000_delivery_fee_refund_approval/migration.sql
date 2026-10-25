ALTER TABLE `users` ADD COLUMN `delivery_refund_approval_access` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `refunds`
 ADD COLUMN `category` VARCHAR(30) NOT NULL DEFAULT 'PRODUCT',
 ADD COLUMN `evidence_reference` VARCHAR(120) NULL,
 ADD COLUMN `approved_by_id` INTEGER NULL,
 ADD COLUMN `approval_reason` VARCHAR(500) NULL,
 ADD COLUMN `decided_at` DATETIME(3) NULL;
