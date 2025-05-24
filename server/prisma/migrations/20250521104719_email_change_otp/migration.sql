/*
  Warnings:

  - A unique constraint covering the columns `[otpStoreId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpStoreId" TEXT;

-- CreateTable
CREATE TABLE "OTPStore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OTPStore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OTPStore_userId_key" ON "OTPStore"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_otpStoreId_key" ON "User"("otpStoreId");

-- AddForeignKey
ALTER TABLE "OTPStore" ADD CONSTRAINT "OTPStore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
