-- AlterTable
ALTER TABLE `setting` ADD COLUMN `maintenanceMode` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `primaryColor` VARCHAR(191) NULL,
    ADD COLUMN `resume` VARCHAR(191) NULL,
    ADD COLUMN `secondaryColor` VARCHAR(191) NULL,
    MODIFY `address` TEXT NULL;
