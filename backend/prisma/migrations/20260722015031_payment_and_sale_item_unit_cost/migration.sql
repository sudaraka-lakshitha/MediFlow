-- AlterTable
ALTER TABLE `dispensing_items` ADD COLUMN `unit_cost` DECIMAL(12, 2) NULL;

-- AlterTable
ALTER TABLE `sale_items` ADD COLUMN `unit_cost` DECIMAL(12, 2) NULL;
