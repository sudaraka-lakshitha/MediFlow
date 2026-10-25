ALTER TABLE `prescription_uploads`
  ADD COLUMN `submission_key` VARCHAR(36) NULL,
  ADD COLUMN `submission_hash` VARCHAR(64) NULL;
CREATE UNIQUE INDEX `prescription_uploads_patient_id_submission_key_key`
  ON `prescription_uploads` (`patient_id`, `submission_key`);
