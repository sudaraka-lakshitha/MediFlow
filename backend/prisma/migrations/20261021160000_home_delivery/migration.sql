CREATE TABLE `delivery_requests` (
 `id` INTEGER NOT NULL AUTO_INCREMENT,
 `payment_request_id` INTEGER NOT NULL,
 `fee_payment_request_id` INTEGER NULL,
 `address` VARCHAR(500) NOT NULL,
 `phone` VARCHAR(40) NOT NULL,
 `status` VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
 `tracking_reference` VARCHAR(160) NULL,
 `courier_service` VARCHAR(120) NULL,
 `dispatched_at` DATETIME(3) NULL,
 `delivered_at` DATETIME(3) NULL,
 `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 `updated_at` DATETIME(3) NOT NULL,
 PRIMARY KEY (`id`),
 UNIQUE INDEX `delivery_requests_payment_request_id_key` (`payment_request_id`),
 UNIQUE INDEX `delivery_requests_fee_payment_request_id_key` (`fee_payment_request_id`),
 CONSTRAINT `delivery_requests_payment_request_id_fkey` FOREIGN KEY (`payment_request_id`) REFERENCES `payment_requests` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT `delivery_requests_fee_payment_request_id_fkey` FOREIGN KEY (`fee_payment_request_id`) REFERENCES `payment_requests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
