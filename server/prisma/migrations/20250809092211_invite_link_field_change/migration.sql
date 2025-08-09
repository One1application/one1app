/*
  Warnings:

  - You are about to drop the column `inviteLink` on the `Telegram` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Telegram" DROP COLUMN "inviteLink";

-- AlterTable
ALTER TABLE "TelegramSubscription" ADD COLUMN     "inviteLink" TEXT;
