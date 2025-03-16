-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Creator', 'Admin');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "socialMedia" TEXT NOT NULL,
    "goals" TEXT[],
    "heardAboutUs" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalWithdrawals" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isKycVerified" BOOLEAN NOT NULL DEFAULT false,
    "mpin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankDetails" (
    "id" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "bankDocument" TEXT,
    "upiId" TEXT[],
    "razorpayContactID" TEXT,
    "razorpayFundAccountID" TEXT,
    "userId" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UPI" (
    "id" TEXT NOT NULL,
    "upiId" TEXT NOT NULL,
    "razorpayFundAccountID" TEXT,
    "razorpayContactID" TEXT,
    "bankDetailsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UPI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kycRecords" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "socialMedia" JSONB NOT NULL,
    "aadhaarNumber" TEXT NOT NULL,
    "aadhaarFront" TEXT NOT NULL,
    "aadhaarBack" TEXT NOT NULL,
    "panCard" TEXT NOT NULL,
    "selfie" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',

    CONSTRAINT "kycRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessInfo" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "businessStructure" TEXT NOT NULL,
    "gstNumber" TEXT NOT NULL,
    "sebiNumber" TEXT NOT NULL,
    "sebiCertificate" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "modeOfPayment" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "modeOfWithdrawal" TEXT NOT NULL,
    "bankDetailsId" TEXT NOT NULL,
    "upiId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "razorpayPayoutID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webinar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "occurrence" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "paymentEnabled" BOOLEAN NOT NULL DEFAULT true,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    "venue" TEXT,
    "link" JSONB NOT NULL,
    "isPaid" BOOLEAN NOT NULL,
    "quantity" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Webinar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebinarTicket" (
    "id" TEXT NOT NULL,
    "webinarId" TEXT NOT NULL,
    "boughtById" TEXT NOT NULL,
    "paymentId" TEXT,
    "orderId" TEXT,

    CONSTRAINT "WebinarTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "validity" TEXT NOT NULL,
    "aboutThisCourse" JSONB NOT NULL,
    "testimonials" JSONB NOT NULL,
    "courseBenefits" JSONB NOT NULL,
    "faqs" JSONB NOT NULL,
    "gallery" JSONB NOT NULL,
    "coverImage" JSONB NOT NULL,
    "language" JSONB NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseProduct" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "productMetaData" JSONB NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "CourseProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lessons" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "lessonData" JSONB NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "Lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoursePurchasers" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "purchaserId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoursePurchasers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayingUp" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "paymentDetails" JSONB NOT NULL,
    "category" JSONB NOT NULL,
    "testimonials" JSONB NOT NULL,
    "faqs" JSONB NOT NULL,
    "refundPolicies" JSONB NOT NULL,
    "tacs" JSONB NOT NULL,
    "coverImage" JSONB NOT NULL,
    "files" JSONB NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "PayingUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayingUpTicket" (
    "id" TEXT NOT NULL,
    "payingUpId" TEXT NOT NULL,
    "boughtById" TEXT NOT NULL,
    "paymentId" TEXT,
    "orderId" TEXT,

    CONSTRAINT "PayingUpTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telegram" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subscription" JSONB NOT NULL,
    "genre" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Telegram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramSubscription" (
    "id" TEXT NOT NULL,
    "validDays" INTEGER NOT NULL,
    "telegramId" TEXT NOT NULL,
    "boughtById" TEXT NOT NULL,
    "paymentId" TEXT,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UPI_upiId_key" ON "UPI"("upiId");

-- CreateIndex
CREATE UNIQUE INDEX "kycRecords_userId_key" ON "kycRecords"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessInfo_gstNumber_key" ON "BusinessInfo"("gstNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessInfo_sebiNumber_key" ON "BusinessInfo"("sebiNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessInfo_userId_key" ON "BusinessInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseProduct_courseId_key" ON "CourseProduct"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Telegram_id_key" ON "Telegram"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramSubscription_id_key" ON "TelegramSubscription"("id");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDetails" ADD CONSTRAINT "BankDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UPI" ADD CONSTRAINT "UPI_bankDetailsId_fkey" FOREIGN KEY ("bankDetailsId") REFERENCES "BankDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UPI" ADD CONSTRAINT "UPI_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kycRecords" ADD CONSTRAINT "kycRecords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessInfo" ADD CONSTRAINT "BusinessInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_bankDetailsId_fkey" FOREIGN KEY ("bankDetailsId") REFERENCES "BankDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_upiId_fkey" FOREIGN KEY ("upiId") REFERENCES "UPI"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webinar" ADD CONSTRAINT "Webinar_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarTicket" ADD CONSTRAINT "WebinarTicket_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarTicket" ADD CONSTRAINT "WebinarTicket_boughtById_fkey" FOREIGN KEY ("boughtById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProduct" ADD CONSTRAINT "CourseProduct_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lessons" ADD CONSTRAINT "Lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePurchasers" ADD CONSTRAINT "CoursePurchasers_purchaserId_fkey" FOREIGN KEY ("purchaserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePurchasers" ADD CONSTRAINT "CoursePurchasers_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayingUp" ADD CONSTRAINT "PayingUp_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayingUpTicket" ADD CONSTRAINT "PayingUpTicket_payingUpId_fkey" FOREIGN KEY ("payingUpId") REFERENCES "PayingUp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayingUpTicket" ADD CONSTRAINT "PayingUpTicket_boughtById_fkey" FOREIGN KEY ("boughtById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telegram" ADD CONSTRAINT "Telegram_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramSubscription" ADD CONSTRAINT "TelegramSubscription_telegramId_fkey" FOREIGN KEY ("telegramId") REFERENCES "Telegram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramSubscription" ADD CONSTRAINT "TelegramSubscription_boughtById_fkey" FOREIGN KEY ("boughtById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
