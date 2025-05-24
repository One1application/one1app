-- DropForeignKey
ALTER TABLE "CourseProduct" DROP CONSTRAINT "CourseProduct_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CoursePurchasers" DROP CONSTRAINT "CoursePurchasers_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Lessons" DROP CONSTRAINT "Lessons_courseId_fkey";

-- DropForeignKey
ALTER TABLE "TelegramSubscription" DROP CONSTRAINT "TelegramSubscription_boughtById_fkey";

-- DropForeignKey
ALTER TABLE "TelegramSubscription" DROP CONSTRAINT "TelegramSubscription_telegramId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Webinar" DROP CONSTRAINT "Webinar_createdById_fkey";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webinar" ADD CONSTRAINT "Webinar_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProduct" ADD CONSTRAINT "CourseProduct_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lessons" ADD CONSTRAINT "Lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePurchasers" ADD CONSTRAINT "CoursePurchasers_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramSubscription" ADD CONSTRAINT "TelegramSubscription_telegramId_fkey" FOREIGN KEY ("telegramId") REFERENCES "Telegram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramSubscription" ADD CONSTRAINT "TelegramSubscription_boughtById_fkey" FOREIGN KEY ("boughtById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
