/*
  Warnings:

  - The `status` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('COMPLETED', 'PENDING', 'FAILED');

-- DropForeignKey
ALTER TABLE "PremiumContent" DROP CONSTRAINT "PremiumContent_createdById_fkey";

-- DropForeignKey
ALTER TABLE "PremiumContentAccess" DROP CONSTRAINT "PremiumContentAccess_contentId_fkey";

-- DropForeignKey
ALTER TABLE "PremiumContentAccess" DROP CONSTRAINT "PremiumContentAccess_userId_fkey";

-- AlterTable
ALTER TABLE "PremiumContent" ADD COLUMN     "expiryDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "phonePayTransId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumContent" ADD CONSTRAINT "PremiumContent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumContentAccess" ADD CONSTRAINT "PremiumContentAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumContentAccess" ADD CONSTRAINT "PremiumContentAccess_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "PremiumContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
