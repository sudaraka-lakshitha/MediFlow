-- AlterTable
ALTER TABLE `prescription_uploads` MODIFY `status` ENUM('PENDING', 'AVAILABLE', 'PARTIALLY_AVAILABLE', 'UNAVAILABLE', 'REJECTED', 'PAYMENT_PENDING', 'PAYMENT_SUBMITTED', 'READY_TO_PREPARE') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `upload_payment_slips` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `upload_id` INTEGER NOT NULL,
    `uploaded_by_id` INTEGER NOT NULL,
    `bank_account_id` INTEGER NULL,
    `original_name` VARCHAR(180) NOT NULL,
    `mime_type` VARCHAR(80) NOT NULL,
    `file_data` LONGBLOB NOT NULL,
    `declared_amount` DECIMAL(12, 2) NOT NULL,
    `reference` VARCHAR(120) NULL,
    `paid_on` DATE NULL,
    `note` VARCHAR(500) NULL,
    `status` ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `reviewed_by_id` INTEGER NULL,
    `reviewed_at` DATETIME(3) NULL,
    `rejection_reason` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `upload_payment_slips_upload_id_created_at_idx`(`upload_id`, `created_at`),
    INDEX `upload_payment_slips_status_created_at_idx`(`status`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `upload_payment_slips` ADD CONSTRAINT `upload_payment_slips_upload_id_fkey` FOREIGN KEY (`upload_id`) REFERENCES `prescription_uploads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `upload_payment_slips` ADD CONSTRAINT `upload_payment_slips_uploaded_by_id_fkey` FOREIGN KEY (`uploaded_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `upload_payment_slips` ADD CONSTRAINT `upload_payment_slips_reviewed_by_id_fkey` FOREIGN KEY (`reviewed_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `upload_payment_slips` ADD CONSTRAINT `upload_payment_slips_bank_account_id_fkey` FOREIGN KEY (`bank_account_id`) REFERENCES `bank_accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
