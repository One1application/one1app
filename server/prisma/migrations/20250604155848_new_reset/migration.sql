/*
  Warnings:

  - Added the required column `expiryDate` to the `CoursePurchasers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CoursePurchasers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoursePurchasers" ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "CourseRenewal" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "newExpiryDate" TIMESTAMP(3) NOT NULL,
    "renewalDate" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseRenewal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseRenewal" ADD CONSTRAINT "CourseRenewal_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "CoursePurchasers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
