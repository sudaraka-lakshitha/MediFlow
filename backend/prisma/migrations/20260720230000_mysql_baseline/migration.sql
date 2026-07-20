-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(190) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(40) NULL,
    `role` ENUM('ADMIN', 'PHARMACIST', 'CASHIER', 'PATIENT') NOT NULL DEFAULT 'PATIENT',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `cashier_access` BOOLEAN NOT NULL DEFAULT false,
    `must_change_password` BOOLEAN NOT NULL DEFAULT false,
    `token_version` INTEGER NOT NULL DEFAULT 0,
    `last_login_at` DATETIME(3) NULL,
    `password_changed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_role_active_idx`(`role`, `active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_otps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `code_hash` VARCHAR(64) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `requested_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `used_at` DATETIME(3) NULL,

    UNIQUE INDEX `password_reset_otps_user_id_key`(`user_id`),
    INDEX `password_reset_otps_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patient_notices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patient_id` INTEGER NOT NULL,
    `created_by_id` INTEGER NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `message` VARCHAR(1000) NOT NULL,
    `read_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `patient_notices_patient_id_created_at_idx`(`patient_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patient_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `patient_number` VARCHAR(30) NOT NULL,
    `date_of_birth` DATE NULL,
    `address` VARCHAR(300) NULL,
    `allergies` VARCHAR(191) NULL,
    `chronic_conditions` VARCHAR(191) NULL,
    `registration_source` ENUM('SELF', 'PHARMACIST', 'ADMIN') NOT NULL DEFAULT 'SELF',
    `registered_by_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `patient_profiles_user_id_key`(`user_id`),
    UNIQUE INDEX `patient_profiles_patient_number_key`(`patient_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(300) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sku` VARCHAR(40) NOT NULL,
    `product_type` ENUM('MEDICINE', 'NON_MEDICINAL') NOT NULL DEFAULT 'MEDICINE',
    `generic_name` VARCHAR(150) NOT NULL,
    `brand_name` VARCHAR(150) NULL,
    `strength` VARCHAR(80) NOT NULL,
    `dosage_form` VARCHAR(80) NOT NULL,
    `unit` VARCHAR(40) NOT NULL DEFAULT 'unit',
    `manufacturer` VARCHAR(150) NULL,
    `manufacturer_id` INTEGER NULL,
    `active_ingredient` VARCHAR(180) NULL,
    `variant_group` VARCHAR(100) NULL,
    `barcode` VARCHAR(80) NULL,
    `rxnorm_cui` VARCHAR(30) NULL,
    `pubchem_cid` INTEGER NULL,
    `smiles` VARCHAR(191) NULL,
    `storage_instructions` VARCHAR(300) NULL,
    `minimum_age_years` INTEGER NULL,
    `maximum_age_years` INTEGER NULL,
    `drug_concept_id` INTEGER NULL,
    `selling_price` DECIMAL(12, 2) NOT NULL,
    `reorder_level` INTEGER NOT NULL DEFAULT 0,
    `prescription_required` BOOLEAN NOT NULL DEFAULT true,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `category_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `products_sku_key`(`sku`),
    UNIQUE INDEX `products_barcode_key`(`barcode`),
    INDEX `products_generic_name_idx`(`generic_name`),
    INDEX `products_category_id_active_idx`(`category_id`, `active`),
    INDEX `products_manufacturer_id_idx`(`manufacturer_id`),
    INDEX `products_drug_concept_id_idx`(`drug_concept_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manufacturers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `country` VARCHAR(100) NULL,
    `website` VARCHAR(250) NULL,
    `phone` VARCHAR(40) NULL,
    `email` VARCHAR(190) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `manufacturers_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `contact_person` VARCHAR(150) NULL,
    `phone` VARCHAR(40) NULL,
    `email` VARCHAR(190) NULL,
    `address` VARCHAR(300) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `suppliers_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_batches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `supplier_id` INTEGER NULL,
    `batch_number` VARCHAR(80) NOT NULL,
    `quantity_received` DECIMAL(12, 3) NOT NULL,
    `quantity_available` DECIMAL(12, 3) NOT NULL,
    `purchase_price` DECIMAL(12, 2) NOT NULL,
    `expiry_date` DATE NOT NULL,
    `received_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `restricted` BOOLEAN NOT NULL DEFAULT false,
    `restriction_reason` VARCHAR(500) NULL,
    `restricted_at` DATETIME(3) NULL,

    INDEX `inventory_batches_product_id_received_at_expiry_date_idx`(`product_id`, `received_at`, `expiry_date`),
    INDEX `inventory_batches_restricted_idx`(`restricted`),
    UNIQUE INDEX `inventory_batches_product_id_batch_number_key`(`product_id`, `batch_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_movements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `batch_id` INTEGER NOT NULL,
    `type` ENUM('RECEIPT', 'DISPENSING', 'RETAIL_SALE', 'ADJUSTMENT', 'REVERSAL', 'EXPIRED', 'DAMAGED', 'RETURN') NOT NULL,
    `quantity_change` DECIMAL(12, 3) NOT NULL,
    `quantity_before` DECIMAL(12, 3) NOT NULL,
    `quantity_after` DECIMAL(12, 3) NOT NULL,
    `reference_type` VARCHAR(40) NULL,
    `reference_id` INTEGER NULL,
    `reason` VARCHAR(300) NULL,
    `performed_by_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `stock_movements_product_id_created_at_idx`(`product_id`, `created_at`),
    INDEX `stock_movements_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `low_stock_acknowledgements` (
    `product_id` INTEGER NOT NULL,
    `stock_level` DECIMAL(12, 3) NOT NULL,
    `acknowledged_by_id` INTEGER NOT NULL,
    `acknowledged_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `low_stock_acknowledgements_acknowledged_by_id_acknowledged_a_idx`(`acknowledged_by_id`, `acknowledged_at`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prescriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prescription_number` VARCHAR(40) NOT NULL,
    `patient_id` INTEGER NOT NULL,
    `prescriber_title` VARCHAR(20) NULL,
    `prescriber_name` VARCHAR(150) NOT NULL,
    `prescriber_reference` VARCHAR(100) NULL,
    `prescription_date` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'VERIFIED', 'PARTIALLY_DISPENSED', 'DISPENSED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `ordered_for_self` BOOLEAN NOT NULL DEFAULT true,
    `recipient_name` VARCHAR(150) NULL,
    `recipient_relationship` VARCHAR(100) NULL,
    `notes` VARCHAR(191) NULL,
    `pickup_note` VARCHAR(500) NULL,
    `planned_pickup_at` DATETIME(3) NULL,
    `rejection_reason` VARCHAR(191) NULL,
    `refills_allowed` INTEGER NOT NULL DEFAULT 0,
    `refills_used` INTEGER NOT NULL DEFAULT 0,
    `original_prescription_id` INTEGER NULL,
    `created_by_id` INTEGER NOT NULL,
    `verified_by_id` INTEGER NULL,
    `verified_at` DATETIME(3) NULL,
    `source_upload_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `prescriptions_prescription_number_key`(`prescription_number`),
    UNIQUE INDEX `prescriptions_source_upload_id_key`(`source_upload_id`),
    INDEX `prescriptions_patient_id_prescription_date_idx`(`patient_id`, `prescription_date`),
    INDEX `prescriptions_status_idx`(`status`),
    INDEX `prescriptions_original_prescription_id_idx`(`original_prescription_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prescription_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prescription_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity_per_dose` DECIMAL(12, 3) NOT NULL,
    `dose_input_amount` DECIMAL(12, 3) NULL,
    `dose_input_unit` VARCHAR(20) NULL,
    `concentration_amount` DECIMAL(12, 3) NULL,
    `concentration_unit` VARCHAR(20) NULL,
    `concentration_volume` DECIMAL(12, 3) NULL,
    `times_per_day` INTEGER NOT NULL,
    `days_supply` INTEGER NOT NULL,
    `calculated_quantity` DECIMAL(12, 3) NOT NULL,
    `prescribed_quantity` DECIMAL(12, 3) NOT NULL,
    `dispensed_quantity` DECIMAL(12, 3) NOT NULL DEFAULT 0,
    `quantity_overridden` BOOLEAN NOT NULL DEFAULT false,
    `override_reason` VARCHAR(300) NULL,
    `dosage_instructions` VARCHAR(250) NOT NULL,
    `administration_route` VARCHAR(80) NOT NULL DEFAULT 'Oral',
    `meal_timing` ENUM('ANY_TIME', 'BEFORE_FOOD', 'WITH_FOOD', 'AFTER_FOOD', 'EMPTY_STOMACH') NOT NULL DEFAULT 'ANY_TIME',
    `as_needed` BOOLEAN NOT NULL DEFAULT false,
    `special_instructions` VARCHAR(500) NULL,
    `frequency` VARCHAR(100) NULL,
    `duration` VARCHAR(100) NULL,
    `notes` VARCHAR(300) NULL,

    INDEX `prescription_items_prescription_id_idx`(`prescription_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prescription_retail_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prescription_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` DECIMAL(12, 3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `prescription_retail_items_product_id_idx`(`product_id`),
    UNIQUE INDEX `prescription_retail_items_prescription_id_product_id_key`(`prescription_id`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dispensings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prescription_id` INTEGER NOT NULL,
    `pharmacist_id` INTEGER NOT NULL,
    `notes` VARCHAR(191) NULL,
    `reversed` BOOLEAN NOT NULL DEFAULT false,
    `reversal_reason` VARCHAR(191) NULL,
    `dispensed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `dispensings_dispensed_at_idx`(`dispensed_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dispensing_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dispensing_id` INTEGER NOT NULL,
    `prescription_item_id` INTEGER NOT NULL,
    `batch_id` INTEGER NOT NULL,
    `quantity` DECIMAL(12, 3) NOT NULL,
    `unit_price` DECIMAL(12, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_number` VARCHAR(40) NOT NULL,
    `dispensing_id` INTEGER NULL,
    `patient_id` INTEGER NULL,
    `pharmacist_id` INTEGER NOT NULL,
    `cashier_id` INTEGER NULL,
    `payment_request_id` INTEGER NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `container_fee` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `tax` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(12, 2) NOT NULL,
    `amount_paid` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `payment_method` ENUM('CASH', 'CARD', 'BANK_TRANSFER', 'OTHER') NOT NULL DEFAULT 'CASH',
    `status` ENUM('PENDING', 'PAID', 'VOIDED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sales_invoice_number_key`(`invoice_number`),
    UNIQUE INDEX `sales_dispensing_id_key`(`dispensing_id`),
    UNIQUE INDEX `sales_payment_request_id_key`(`payment_request_id`),
    INDEX `sales_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sale_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sale_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `batch_id` INTEGER NOT NULL,
    `quantity` DECIMAL(12, 3) NOT NULL,
    `unit_price` DECIMAL(12, 2) NOT NULL,
    `line_total` DECIMAL(12, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `action` VARCHAR(80) NOT NULL,
    `entity_type` VARCHAR(80) NULL,
    `entity_id` INTEGER NULL,
    `details` JSON NULL,
    `success` BOOLEAN NOT NULL DEFAULT true,
    `ip_address` VARCHAR(64) NULL,
    `request_id` VARCHAR(64) NULL,
    `method` VARCHAR(10) NULL,
    `path` VARCHAR(300) NULL,
    `read_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_created_at_idx`(`created_at`),
    INDEX `audit_logs_user_id_created_at_idx`(`user_id`, `created_at`),
    INDEX `audit_logs_action_created_at_idx`(`action`, `created_at`),
    INDEX `audit_logs_success_created_at_idx`(`success`, `created_at`),
    INDEX `audit_logs_deleted_at_idx`(`deleted_at`),
    INDEX `audit_logs_success_read_at_deleted_at_idx`(`success`, `read_at`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prescription_uploads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patient_id` INTEGER NOT NULL,
    `original_name` VARCHAR(180) NOT NULL,
    `mime_type` VARCHAR(80) NOT NULL,
    `file_data` LONGBLOB NOT NULL,
    `patient_note` VARCHAR(500) NULL,
    `prepare_requested` BOOLEAN NOT NULL DEFAULT true,
    `ordered_for_self` BOOLEAN NOT NULL DEFAULT true,
    `recipient_name` VARCHAR(150) NULL,
    `recipient_relationship` VARCHAR(100) NULL,
    `status` ENUM('PENDING', 'AVAILABLE', 'PARTIALLY_AVAILABLE', 'UNAVAILABLE', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `availability_notes` VARCHAR(1000) NULL,
    `estimated_total` DECIMAL(12, 2) NULL,
    `estimate_details` JSON NULL,
    `reviewed_by_id` INTEGER NULL,
    `reviewed_at` DATETIME(3) NULL,
    `delete_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `prescription_uploads_patient_id_created_at_idx`(`patient_id`, `created_at`),
    INDEX `prescription_uploads_status_created_at_idx`(`status`, `created_at`),
    INDEX `prescription_uploads_delete_at_idx`(`delete_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `request_number` VARCHAR(40) NOT NULL,
    `type` ENUM('PRESCRIPTION', 'RETAIL') NOT NULL DEFAULT 'PRESCRIPTION',
    `prescription_id` INTEGER NULL,
    `patient_id` INTEGER NULL,
    `pharmacist_id` INTEGER NOT NULL,
    `cashier_id` INTEGER NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `container_fee` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `tax` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(12, 2) NOT NULL,
    `amount_paid` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `payment_method` ENUM('CASH', 'CARD', 'BANK_TRANSFER', 'OTHER') NULL,
    `payment_reference` VARCHAR(120) NULL,
    `status` ENUM('AWAITING_PAYMENT', 'PAID', 'FULFILLED', 'CANCELLED') NOT NULL DEFAULT 'AWAITING_PAYMENT',
    `coupon_code` VARCHAR(40) NULL,
    `pickup_pin_hash` VARCHAR(64) NULL,
    `pickup_pin_encrypted` VARCHAR(200) NULL,
    `pin_attempts` INTEGER NOT NULL DEFAULT 0,
    `paid_at` DATETIME(3) NULL,
    `pin_verified_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_requests_request_number_key`(`request_number`),
    UNIQUE INDEX `payment_requests_prescription_id_key`(`prescription_id`),
    INDEX `payment_requests_status_created_at_idx`(`status`, `created_at`),
    INDEX `payment_requests_patient_id_created_at_idx`(`patient_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_request_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_request_id` INTEGER NOT NULL,
    `prescription_item_id` INTEGER NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` DECIMAL(12, 3) NOT NULL,
    `unit_price` DECIMAL(12, 2) NOT NULL,
    `line_total` DECIMAL(12, 2) NOT NULL,

    UNIQUE INDEX `payment_request_items_payment_request_id_prescription_item_i_key`(`payment_request_id`, `prescription_item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_settings` (
    `key` VARCHAR(80) NOT NULL,
    `value` VARCHAR(500) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drug_concepts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `normalized_name` VARCHAR(180) NOT NULL,
    `display_name` VARCHAR(180) NOT NULL,
    `ddinter_id` VARCHAR(30) NULL,
    `rxnorm_cui` VARCHAR(30) NULL,
    `pubchem_cid` INTEGER NULL,
    `smiles` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `drug_concepts_normalized_name_key`(`normalized_name`),
    INDEX `drug_concepts_ddinter_id_idx`(`ddinter_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drug_interactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `drug_a_id` INTEGER NOT NULL,
    `drug_b_id` INTEGER NOT NULL,
    `severity` ENUM('MAJOR', 'MODERATE', 'MINOR', 'UNKNOWN') NOT NULL,
    `description` VARCHAR(191) NULL,
    `mechanism` VARCHAR(191) NULL,
    `management` VARCHAR(191) NULL,
    `source` VARCHAR(80) NOT NULL DEFAULT 'DDInter',
    `source_url` VARCHAR(400) NULL,
    `version` VARCHAR(40) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `drug_interactions_drug_a_id_drug_b_id_idx`(`drug_a_id`, `drug_b_id`),
    INDEX `drug_interactions_severity_idx`(`severity`),
    UNIQUE INDEX `drug_interactions_drug_a_id_drug_b_id_source_key`(`drug_a_id`, `drug_b_id`, `source`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prescription_interactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prescription_id` INTEGER NOT NULL,
    `interaction_id` INTEGER NULL,
    `product_a_id` INTEGER NOT NULL,
    `product_b_id` INTEGER NOT NULL,
    `drug_a_name` VARCHAR(180) NOT NULL,
    `drug_b_name` VARCHAR(180) NOT NULL,
    `severity` ENUM('MAJOR', 'MODERATE', 'MINOR', 'UNKNOWN') NOT NULL,
    `source_type` ENUM('CURATED', 'EXPERIMENTAL') NOT NULL,
    `context` VARCHAR(40) NOT NULL DEFAULT 'CURRENT_PRESCRIPTION',
    `score` DECIMAL(6, 5) NULL,
    `summary` VARCHAR(191) NULL,
    `management` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'ACKNOWLEDGED', 'OVERRIDDEN') NOT NULL DEFAULT 'PENDING',
    `reviewed_by_id` INTEGER NULL,
    `reviewed_at` DATETIME(3) NULL,
    `override_reason` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `prescription_interactions_prescription_id_status_idx`(`prescription_id`, `status`),
    INDEX `prescription_interactions_severity_status_idx`(`severity`, `status`),
    UNIQUE INDEX `prescription_interactions_prescription_id_product_a_id_produ_key`(`prescription_id`, `product_a_id`, `product_b_id`, `source_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `discount_rules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `code` VARCHAR(40) NULL,
    `description` VARCHAR(400) NULL,
    `type` ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
    `value` DECIMAL(12, 2) NOT NULL,
    `scope` ENUM('ORDER', 'CATEGORY', 'PRODUCT') NOT NULL DEFAULT 'ORDER',
    `product_id` INTEGER NULL,
    `category_id` INTEGER NULL,
    `minimum_subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `minimum_quantity` DECIMAL(12, 3) NOT NULL DEFAULT 0,
    `maximum_discount` DECIMAL(12, 2) NULL,
    `automatic` BOOLEAN NOT NULL DEFAULT true,
    `combinable` BOOLEAN NOT NULL DEFAULT false,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `starts_at` DATETIME(3) NULL,
    `ends_at` DATETIME(3) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_by_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `discount_rules_code_key`(`code`),
    INDEX `discount_rules_active_starts_at_ends_at_idx`(`active`, `starts_at`, `ends_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `discount_applications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sale_id` INTEGER NOT NULL,
    `rule_id` INTEGER NULL,
    `rule_name` VARCHAR(150) NOT NULL,
    `rule_type` ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
    `rule_value` DECIMAL(12, 2) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `discount_applications_sale_id_idx`(`sale_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `password_reset_otps` ADD CONSTRAINT `password_reset_otps_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_notices` ADD CONSTRAINT `patient_notices_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_notices` ADD CONSTRAINT `patient_notices_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_profiles` ADD CONSTRAINT `patient_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_profiles` ADD CONSTRAINT `patient_profiles_registered_by_id_fkey` FOREIGN KEY (`registered_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_manufacturer_id_fkey` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_drug_concept_id_fkey` FOREIGN KEY (`drug_concept_id`) REFERENCES `drug_concepts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_batches` ADD CONSTRAINT `inventory_batches_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_batches` ADD CONSTRAINT `inventory_batches_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `inventory_batches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_performed_by_id_fkey` FOREIGN KEY (`performed_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `low_stock_acknowledgements` ADD CONSTRAINT `low_stock_acknowledgements_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `low_stock_acknowledgements` ADD CONSTRAINT `low_stock_acknowledgements_acknowledged_by_id_fkey` FOREIGN KEY (`acknowledged_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescriptions` ADD CONSTRAINT `prescriptions_original_prescription_id_fkey` FOREIGN KEY (`original_prescription_id`) REFERENCES `prescriptions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescriptions` ADD CONSTRAINT `prescriptions_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patient_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescriptions` ADD CONSTRAINT `prescriptions_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescriptions` ADD CONSTRAINT `prescriptions_verified_by_id_fkey` FOREIGN KEY (`verified_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescriptions` ADD CONSTRAINT `prescriptions_source_upload_id_fkey` FOREIGN KEY (`source_upload_id`) REFERENCES `prescription_uploads`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescription_items` ADD CONSTRAINT `prescription_items_prescription_id_fkey` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescription_items` ADD CONSTRAINT `prescription_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescription_retail_items` ADD CONSTRAINT `prescription_retail_items_prescription_id_fkey` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescription_retail_items` ADD CONSTRAINT `prescription_retail_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dispensings` ADD CONSTRAINT `dispensings_prescription_id_fkey` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dispensings` ADD CONSTRAINT `dispensings_pharmacist_id_fkey` FOREIGN KEY (`pharmacist_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dispensing_items` ADD CONSTRAINT `dispensing_items_dispensing_id_fkey` FOREIGN KEY (`dispensing_id`) REFERENCES `dispensings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dispensing_items` ADD CONSTRAINT `dispensing_items_prescription_item_id_fkey` FOREIGN KEY (`prescription_item_id`) REFERENCES `prescription_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dispensing_items` ADD CONSTRAINT `dispensing_items_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `inventory_batches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_dispensing_id_fkey` FOREIGN KEY (`dispensing_id`) REFERENCES `dispensings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_pharmacist_id_fkey` FOREIGN KEY (`pharmacist_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_cashier_id_fkey` FOREIGN KEY (`cashier_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_payment_request_id_fkey` FOREIGN KEY (`payment_request_id`) REFERENCES `payment_requests`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `inventory_batches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescription_uploads` ADD CONSTRAINT `prescription_uploads_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescription_uploads` ADD CONSTRAINT `prescription_uploads_reviewed_by_id_fkey` FOREIGN KEY (`reviewed_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_requests` ADD CONSTRAINT `payment_requests_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_requests` ADD CONSTRAINT `payment_requests_pharmacist_id_fkey` FOREIGN KEY (`pharmacist_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_requests` ADD CONSTRAINT `payment_requests_cashier_id_fkey` FOREIGN KEY (`cashier_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_requests` ADD CONSTRAINT `payment_requests_prescription_id_fkey` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_request_items` ADD CONSTRAINT `payment_request_items_payment_request_id_fkey` FOREIGN KEY (`payment_request_id`) REFERENCES `payment_requests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_request_items` ADD CONSTRAINT `payment_request_items_prescription_item_id_fkey` FOREIGN KEY (`prescription_item_id`) REFERENCES `prescription_items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_request_items` ADD CONSTRAINT `payment_request_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `drug_interactions` ADD CONSTRAINT `drug_interactions_drug_a_id_fkey` FOREIGN KEY (`drug_a_id`) REFERENCES `drug_concepts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `drug_interactions` ADD CONSTRAINT `drug_interactions_drug_b_id_fkey` FOREIGN KEY (`drug_b_id`) REFERENCES `drug_concepts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescription_interactions` ADD CONSTRAINT `prescription_interactions_prescription_id_fkey` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescription_interactions` ADD CONSTRAINT `prescription_interactions_interaction_id_fkey` FOREIGN KEY (`interaction_id`) REFERENCES `drug_interactions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescription_interactions` ADD CONSTRAINT `prescription_interactions_product_a_id_fkey` FOREIGN KEY (`product_a_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescription_interactions` ADD CONSTRAINT `prescription_interactions_product_b_id_fkey` FOREIGN KEY (`product_b_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescription_interactions` ADD CONSTRAINT `prescription_interactions_reviewed_by_id_fkey` FOREIGN KEY (`reviewed_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `discount_rules` ADD CONSTRAINT `discount_rules_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `discount_rules` ADD CONSTRAINT `discount_rules_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `discount_rules` ADD CONSTRAINT `discount_rules_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `discount_applications` ADD CONSTRAINT `discount_applications_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `discount_applications` ADD CONSTRAINT `discount_applications_rule_id_fkey` FOREIGN KEY (`rule_id`) REFERENCES `discount_rules`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
