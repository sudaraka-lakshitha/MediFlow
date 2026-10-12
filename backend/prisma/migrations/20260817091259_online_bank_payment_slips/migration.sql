-- AlterTable
ALTER TABLE `payment_requests` MODIFY `status` ENUM('AWAITING_PAYMENT', 'SLIP_SUBMITTED', 'PAID', 'FULFILLED', 'CANCELLED') NOT NULL DEFAULT 'AWAITING_PAYMENT';

-- CreateTable
CREATE TABLE `bank_accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bank_name` VARCHAR(120) NOT NULL,
    `account_name` VARCHAR(150) NOT NULL,
    `account_number` VARCHAR(60) NOT NULL,
    `branch` VARCHAR(120) NULL,
    `instructions` VARCHAR(500) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_by_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `bank_accounts_active_idx`(`active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_slips` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_request_id` INTEGER NOT NULL,
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

    INDEX `payment_slips_payment_request_id_created_at_idx`(`payment_request_id`, `created_at`),
    INDEX `payment_slips_status_created_at_idx`(`status`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bank_accounts` ADD CONSTRAINT `bank_accounts_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_slips` ADD CONSTRAINT `payment_slips_payment_request_id_fkey` FOREIGN KEY (`payment_request_id`) REFERENCES `payment_requests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_slips` ADD CONSTRAINT `payment_slips_uploaded_by_id_fkey` FOREIGN KEY (`uploaded_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_slips` ADD CONSTRAINT `payment_slips_reviewed_by_id_fkey` FOREIGN KEY (`reviewed_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_slips` ADD CONSTRAINT `payment_slips_bank_account_id_fkey` FOREIGN KEY (`bank_account_id`) REFERENCES `bank_accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
