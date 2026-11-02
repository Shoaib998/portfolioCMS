/*
  Warnings:

  - You are about to drop the column `category` on the `blog` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `blog` DROP COLUMN `category`,
    DROP COLUMN `tags`,
    ADD COLUMN `authorId` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    MODIFY `content` TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
