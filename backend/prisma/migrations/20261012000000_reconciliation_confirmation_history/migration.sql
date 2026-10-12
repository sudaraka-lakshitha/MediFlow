-- Keep every historical approval. Duplicate requests are resolved against the
-- latest approval inside the serializable confirmation transaction; an older
-- state may legitimately be approved again after a reviewed correction.
ALTER TABLE `pharmacy_balance_confirmations`
  DROP INDEX `pharmacy_balance_confirmations_day_fingerprint_key`,
  ADD INDEX `pharmacy_balance_confirmations_day_fingerprint_idx` (`day`, `fingerprint`);
