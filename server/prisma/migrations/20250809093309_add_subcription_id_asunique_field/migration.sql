/*
  Warnings:

  - A unique constraint covering the columns `[telegramId,subscriptionId,boughtById,isExpired]` on the table `TelegramSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TelegramSubscription_telegramId_boughtById_isExpired_key";

-- CreateIndex
CREATE UNIQUE INDEX "TelegramSubscription_telegramId_subscriptionId_boughtById_i_key" ON "TelegramSubscription"("telegramId", "subscriptionId", "boughtById", "isExpired");
