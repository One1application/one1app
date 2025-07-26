/*
  Warnings:

  - Added the required column `PaymentProvider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('Razorpay', 'PhonePay');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "PaymentProvider" "PaymentProvider" NOT NULL;
