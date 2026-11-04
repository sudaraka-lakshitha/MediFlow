ALTER TABLE `payment_request_items`
  ADD COLUMN `dosage_instructions` VARCHAR(250) NULL,
  ADD COLUMN `special_instructions` VARCHAR(500) NULL;

ALTER TABLE `dispensing_items`
  ADD COLUMN `dosage_instructions` VARCHAR(250) NULL,
  ADD COLUMN `special_instructions` VARCHAR(500) NULL;

UPDATE `payment_request_items` pri
JOIN `prescription_items` pi ON pi.`id` = pri.`prescription_item_id`
SET pri.`dosage_instructions` = pi.`dosage_instructions`,
    pri.`special_instructions` = pi.`special_instructions`;

UPDATE `dispensing_items` di
JOIN `prescription_items` pi ON pi.`id` = di.`prescription_item_id`
SET di.`dosage_instructions` = pi.`dosage_instructions`,
    di.`special_instructions` = pi.`special_instructions`;
