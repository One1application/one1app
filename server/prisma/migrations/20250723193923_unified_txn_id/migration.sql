/*
  Warnings:

  - You are about to drop the column `phonePayTransId` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "phonePayTransId",
ADD COLUMN     "txnID" TEXT;
