-- DropForeignKey
ALTER TABLE "CoursePurchasers" DROP CONSTRAINT "CoursePurchasers_purchaserId_fkey";

-- DropForeignKey
ALTER TABLE "PayingUp" DROP CONSTRAINT "PayingUp_createdById_fkey";

-- DropForeignKey
ALTER TABLE "PayingUpTicket" DROP CONSTRAINT "PayingUpTicket_boughtById_fkey";

-- DropForeignKey
ALTER TABLE "Telegram" DROP CONSTRAINT "Telegram_createdById_fkey";

-- DropForeignKey
ALTER TABLE "WebinarTicket" DROP CONSTRAINT "WebinarTicket_boughtById_fkey";

-- AddForeignKey
ALTER TABLE "WebinarTicket" ADD CONSTRAINT "WebinarTicket_boughtById_fkey" FOREIGN KEY ("boughtById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePurchasers" ADD CONSTRAINT "CoursePurchasers_purchaserId_fkey" FOREIGN KEY ("purchaserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayingUp" ADD CONSTRAINT "PayingUp_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayingUpTicket" ADD CONSTRAINT "PayingUpTicket_boughtById_fkey" FOREIGN KEY ("boughtById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telegram" ADD CONSTRAINT "Telegram_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
