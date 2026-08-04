/*
  Warnings:

  - You are about to drop the column `address` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `youtube` on the `profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- AlterTable
ALTER TABLE `profile` DROP COLUMN `address`,
    DROP COLUMN `city`,
    DROP COLUMN `youtube`,
    ADD COLUMN `alternatePhone` VARCHAR(191) NULL,
    ADD COLUMN `headline` VARCHAR(191) NULL,
    ADD COLUMN `location` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
