ALTER TABLE `prescriptions`
  ADD COLUMN `recipient_date_of_birth` DATE NULL;

ALTER TABLE `prescription_uploads`
  ADD COLUMN `recipient_date_of_birth` DATE NULL;
