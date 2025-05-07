/*
  Warnings:

  - You are about to drop the column `razorpayContactID` on the `UPI` table. All the data in the column will be lost.
  - You are about to drop the column `razorpayFundAccountID` on the `UPI` table. All the data in the column will be lost.
  - You are about to drop the column `razorpayPayoutID` on the `Withdrawal` table. All the data in the column will be lost.
  - The `status` column on the `Withdrawal` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "UPI" DROP COLUMN "razorpayContactID",
DROP COLUMN "razorpayFundAccountID";

-- AlterTable
ALTER TABLE "Withdrawal" DROP COLUMN "razorpayPayoutID",
ADD COLUMN     "failedReason" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING';
