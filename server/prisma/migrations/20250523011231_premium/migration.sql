/*
  Warnings:

  - Added the required column `orderId` to the `PremiumContentAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `PremiumContentAccess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PremiumContentAccess" ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "paymentId" TEXT NOT NULL;
