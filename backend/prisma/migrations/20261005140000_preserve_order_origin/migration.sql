ALTER TABLE `prescriptions` ADD COLUMN `is_online` BOOLEAN NOT NULL DEFAULT false;
UPDATE `prescriptions` SET `is_online` = true WHERE `source_upload_id` IS NOT NULL;
ALTER TABLE `prescription_uploads` ADD COLUMN `attachment_removed_at` DATETIME(3) NULL;
