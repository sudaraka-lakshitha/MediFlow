ALTER TABLE `prescription_items`
  ADD COLUMN `cancelled_quantity` DECIMAL(12, 3) NOT NULL DEFAULT 0;

-- The former partial-cancellation path assigned the entire prescribed quantity
-- to dispensed_quantity. Recover physical supply from immutable dispensing lines
-- only for records carrying that path's marker and matching its old assignment.
UPDATE `prescription_items` AS pi
LEFT JOIN (
  SELECT `prescription_item_id`, SUM(`quantity`) AS actual_dispensed
  FROM `dispensing_items`
  GROUP BY `prescription_item_id`
) AS history ON history.prescription_item_id = pi.id
SET pi.cancelled_quantity = pi.prescribed_quantity - COALESCE(history.actual_dispensed, 0),
    pi.dispensed_quantity = COALESCE(history.actual_dispensed, 0)
WHERE pi.notes LIKE '%Cancelled from bill:%'
  AND pi.dispensed_quantity = pi.prescribed_quantity
  AND COALESCE(history.actual_dispensed, 0) < pi.prescribed_quantity;
