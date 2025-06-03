/*
  Warnings:

  - You are about to drop the column `chatId` on the `TelegramSubscription` table. All the data in the column will be lost.
  - Added the required column `chatId` to the `Telegram` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Telegram" ADD COLUMN     "botHaveAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "chatId" TEXT NOT NULL,
ADD COLUMN     "isGroupMonitored" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ownerPhone" TEXT,
ALTER COLUMN "discount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TelegramSubscription" DROP COLUMN "chatId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "telegramUserId" TEXT;
