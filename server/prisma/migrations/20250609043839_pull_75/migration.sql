/*
  Warnings:

  - You are about to drop the column `botHaveAdmin` on the `Telegram` table. All the data in the column will be lost.
  - You are about to drop the column `ownerPhone` on the `Telegram` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chatId]` on the table `Telegram` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chatId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `channelLink` to the `Telegram` table without a default value. This is not possible if the table is not empty.
  - Made the column `discount` on table `Telegram` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `chatId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Telegram" DROP CONSTRAINT "Telegram_createdById_fkey";

-- AlterTable
ALTER TABLE "Telegram" DROP COLUMN "botHaveAdmin",
DROP COLUMN "ownerPhone",
ADD COLUMN     "channelLink" TEXT NOT NULL,
ALTER COLUMN "discount" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chatId" TEXT NOT NULL,
ADD COLUMN     "inviteLinks" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Telegram_chatId_key" ON "Telegram"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "User_chatId_key" ON "User"("chatId");

-- AddForeignKey
ALTER TABLE "Telegram" ADD CONSTRAINT "Telegram_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
