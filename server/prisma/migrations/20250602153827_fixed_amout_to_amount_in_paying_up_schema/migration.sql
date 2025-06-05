/*
  Warnings:

  - You are about to drop the column `amout` on the `PayingUp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PayingUp" DROP COLUMN "amout",
ADD COLUMN     "amount" DOUBLE PRECISION;
