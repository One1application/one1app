/*
  Warnings:

  - You are about to drop the column `discount` on the `Telegram` table. All the data in the column will be lost.
  - You are about to drop the column `subscription` on the `Telegram` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `TelegramSubscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `TelegramSubscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telegramId,boughtById,isExpired]` on the table `TelegramSubscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subscriptionId` to the `TelegramSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TelegramSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TelegramSubscription_boughtById_key";

-- AlterTable
ALTER TABLE "Telegram" DROP COLUMN "discount",
DROP COLUMN "subscription";

-- AlterTable
ALTER TABLE "TelegramSubscription" ADD COLUMN     "expireDate" TIMESTAMP(3),
ADD COLUMN     "isExpired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLifetime" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subscriptionId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "validDays" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "plan" TEXT,
    "telegramId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "validDays" INTEGER,
    "isLifetime" BOOLEAN NOT NULL DEFAULT false,
    "telegramId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Discount_id_key" ON "Discount"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_telegramId_code_key" ON "Discount"("telegramId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_id_key" ON "Subscription"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_telegramId_type_key" ON "Subscription"("telegramId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramSubscription_paymentId_key" ON "TelegramSubscription"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramSubscription_orderId_key" ON "TelegramSubscription"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramSubscription_telegramId_boughtById_isExpired_key" ON "TelegramSubscription"("telegramId", "boughtById", "isExpired");

-- AddForeignKey
ALTER TABLE "TelegramSubscription" ADD CONSTRAINT "TelegramSubscription_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_telegramId_fkey" FOREIGN KEY ("telegramId") REFERENCES "Telegram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_telegramId_fkey" FOREIGN KEY ("telegramId") REFERENCES "Telegram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
