/*
  Warnings:

  - A unique constraint covering the columns `[boughtById]` on the table `TelegramSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TelegramSubscription_boughtById_key" ON "TelegramSubscription"("boughtById");
