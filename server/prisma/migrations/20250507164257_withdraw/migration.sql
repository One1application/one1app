-- DropForeignKey
ALTER TABLE "Withdrawal" DROP CONSTRAINT "Withdrawal_bankDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "Withdrawal" DROP CONSTRAINT "Withdrawal_upiId_fkey";

-- AlterTable
ALTER TABLE "Withdrawal" ALTER COLUMN "bankDetailsId" DROP NOT NULL,
ALTER COLUMN "upiId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_bankDetailsId_fkey" FOREIGN KEY ("bankDetailsId") REFERENCES "BankDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_upiId_fkey" FOREIGN KEY ("upiId") REFERENCES "UPI"("id") ON DELETE SET NULL ON UPDATE CASCADE;
