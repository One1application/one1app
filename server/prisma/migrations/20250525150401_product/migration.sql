/*
  Warnings:

  - The values [PAYING_UP,PREMIUM_CONTENT] on the enum `ProductType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductType_new" AS ENUM ('WEBINAR', 'COURSE', 'PAYINGUP', 'TELEGRAM', 'PREMIUMCONTENT');
ALTER TABLE "Transaction" ALTER COLUMN "productType" TYPE "ProductType_new" USING ("productType"::text::"ProductType_new");
ALTER TYPE "ProductType" RENAME TO "ProductType_old";
ALTER TYPE "ProductType_new" RENAME TO "ProductType";
DROP TYPE "ProductType_old";
COMMIT;

-- AlterTable
ALTER TABLE "PremiumContentAccess" ALTER COLUMN "orderId" DROP NOT NULL,
ALTER COLUMN "paymentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "amountAfterFee" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userImage" TEXT;
