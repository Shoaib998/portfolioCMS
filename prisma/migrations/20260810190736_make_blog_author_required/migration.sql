/*
  Warnings:

  - Made the column `authorId` on table `blog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `blog` DROP FOREIGN KEY `Blog_authorId_fkey`;

-- DropIndex
DROP INDEX `Blog_authorId_fkey` ON `blog`;

-- AlterTable
ALTER TABLE `blog` MODIFY `authorId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
