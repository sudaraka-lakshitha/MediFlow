ALTER TABLE prescription_uploads ADD COLUMN delivery_recipient_name VARCHAR(150) NULL;
ALTER TABLE delivery_requests ADD COLUMN recipient_name VARCHAR(150) NULL;
