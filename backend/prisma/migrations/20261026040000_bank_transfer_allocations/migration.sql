CREATE TABLE `bank_transfers` (
 `id` INTEGER NOT NULL AUTO_INCREMENT, `bank_account_id` INTEGER NOT NULL, `patient_id` INTEGER NOT NULL,
 `reference` VARCHAR(80) NOT NULL, `paid_on` DATE NOT NULL,
 `amount` DECIMAL(12,2) NOT NULL, `available_amount` DECIMAL(12,2) NOT NULL, `verified_by_id` INTEGER NOT NULL,
 `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 PRIMARY KEY (`id`), UNIQUE INDEX `bank_transfers_bank_account_id_reference_paid_on_key` (`bank_account_id`,`reference`,`paid_on`), INDEX `bank_transfers_patient_id_idx` (`patient_id`),
 CONSTRAINT `bank_transfers_bank_account_id_fkey` FOREIGN KEY (`bank_account_id`) REFERENCES `bank_accounts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT `bank_transfers_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `bank_transfer_allocations` (
 `id` INTEGER NOT NULL AUTO_INCREMENT, `transfer_id` INTEGER NOT NULL, `payment_request_id` INTEGER NOT NULL,
 `revision` INTEGER NOT NULL, `amount` DECIMAL(12,2) NOT NULL, `allocated_by_id` INTEGER NOT NULL,
 `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), PRIMARY KEY (`id`),
 UNIQUE INDEX `bank_allocation_invoice_revision_key` (`transfer_id`,`payment_request_id`,`revision`),
 INDEX `bank_transfer_allocations_payment_request_id_idx` (`payment_request_id`),
 CONSTRAINT `bank_transfer_allocations_transfer_id_fkey` FOREIGN KEY (`transfer_id`) REFERENCES `bank_transfers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT `bank_transfer_allocations_payment_request_id_fkey` FOREIGN KEY (`payment_request_id`) REFERENCES `payment_requests` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
