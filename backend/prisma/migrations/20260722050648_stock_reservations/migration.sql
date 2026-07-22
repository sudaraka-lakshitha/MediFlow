-- AlterTable
ALTER TABLE `inventory_batches` ADD COLUMN `quantity_reserved` DECIMAL(12, 3) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `stock_reservations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_request_id` INTEGER NOT NULL,
    `payment_request_item_id` INTEGER NOT NULL,
    `batch_id` INTEGER NOT NULL,
    `quantity` DECIMAL(12, 3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `stock_reservations_payment_request_id_idx`(`payment_request_id`),
    INDEX `stock_reservations_batch_id_idx`(`batch_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `stock_reservations` ADD CONSTRAINT `stock_reservations_payment_request_id_fkey` FOREIGN KEY (`payment_request_id`) REFERENCES `payment_requests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_reservations` ADD CONSTRAINT `stock_reservations_payment_request_item_id_fkey` FOREIGN KEY (`payment_request_item_id`) REFERENCES `payment_request_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_reservations` ADD CONSTRAINT `stock_reservations_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `inventory_batches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
