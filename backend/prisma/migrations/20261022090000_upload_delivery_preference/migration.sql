ALTER TABLE `prescription_uploads`
 ADD COLUMN `delivery_requested` BOOLEAN NOT NULL DEFAULT false,
 ADD COLUMN `delivery_address` VARCHAR(500) NULL,
 ADD COLUMN `delivery_phone` VARCHAR(40) NULL;
