/*
  Warnings:

  - You are about to drop the column `email` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `product` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `buyerId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('WEBINAR', 'COURSE', 'PAYING_UP', 'TELEGRAM');

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "email",
DROP COLUMN "phoneNumber",
DROP COLUMN "product",
ADD COLUMN     "buyerId" TEXT NOT NULL,
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "productType" "ProductType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
