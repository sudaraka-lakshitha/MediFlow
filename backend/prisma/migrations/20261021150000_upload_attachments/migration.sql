CREATE TABLE `prescription_upload_attachments` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `upload_id` INTEGER NOT NULL,
  `original_name` VARCHAR(180) NOT NULL,
  `mime_type` VARCHAR(80) NOT NULL,
  `file_data` LONGBLOB NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `prescription_upload_attachments_upload_id_idx` (`upload_id`),
  CONSTRAINT `prescription_upload_attachments_upload_id_fkey` FOREIGN KEY (`upload_id`) REFERENCES `prescription_uploads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
