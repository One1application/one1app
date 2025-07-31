-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Creator', 'Admin', 'SuperAdmin');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('WEBINAR', 'COURSE', 'PAYINGUP', 'TELEGRAM', 'PREMIUMCONTENT');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('COMPLETED', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('Razorpay', 'PhonePay');

-- CreateTable
CREATE TABLE "User" (
    "chatId" TEXT,
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "socialMedia" TEXT NOT NULL,
    "goals" TEXT[],
    "heardAboutUs" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "paymentProvider" "PaymentProvider" DEFAULT 'Razorpay',
    "creatorComission" DOUBLE PRECISION DEFAULT 8,
    "inviteLinks" TEXT[],
    "otpStoreId" TEXT,
    "userImage" TEXT,
    "telegramUserId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTPStore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OTPStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "phoneCodeHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
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
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,

    CONSTRAINT "kycRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessInfo" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "businessStructure" TEXT NOT NULL,
    "gstNumber" TEXT,
    "sebiNumber" TEXT,
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
    "amountAfterFee" DOUBLE PRECISION,
    "productId" TEXT NOT NULL,
    "productType" "ProductType" NOT NULL,
    "buyerId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "modeOfPayment" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "txnID" TEXT,
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
    "bankDetailsId" TEXT,
    "upiId" TEXT,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "failedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webinar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "occurrence" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "paymentEnabled" BOOLEAN NOT NULL DEFAULT true,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    "venue" TEXT,
    "link" JSONB NOT NULL,
    "discount" JSONB,
    "isPaid" BOOLEAN NOT NULL,
    "quantity" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
    "discount" JSONB,
    "validity" TEXT NOT NULL,
    "aboutThisCourse" JSONB NOT NULL,
    "testimonials" JSONB NOT NULL,
    "courseBenefits" JSONB NOT NULL,
    "faqs" JSONB NOT NULL,
    "gallery" JSONB NOT NULL,
    "coverImage" JSONB NOT NULL,
    "language" JSONB NOT NULL,
    "amount" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
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
    "gallery" JSONB,
    "language" JSONB,
    "lessons" JSONB,
    "orderId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoursePurchasers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseRenewal" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "newExpiryDate" TIMESTAMP(3) NOT NULL,
    "renewalDate" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseRenewal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayingUp" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "discount" JSONB,
    "paymentDetails" JSONB NOT NULL,
    "category" JSONB NOT NULL,
    "testimonials" JSONB NOT NULL,
    "faqs" JSONB NOT NULL,
    "refundPolicies" JSONB NOT NULL,
    "tacs" JSONB NOT NULL,
    "amount" DOUBLE PRECISION,
    "coverImage" JSONB NOT NULL,
    "files" JSONB NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
    "coverImage" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "isGroupMonitored" BOOLEAN NOT NULL DEFAULT false,
    "genre" TEXT NOT NULL,
    "gstDetails" TEXT,
    "courseDetails" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "inviteLink" TEXT,

    CONSTRAINT "Telegram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramSubscription" (
    "id" TEXT NOT NULL,
    "telegramId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "boughtById" TEXT NOT NULL,
    "validDays" INTEGER,
    "expireDate" TIMESTAMP(3),
    "isLifetime" BOOLEAN NOT NULL DEFAULT false,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "paymentId" TEXT,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TelegramSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "plan" TEXT,
    "telegramId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "validDays" INTEGER,
    "isLifetime" BOOLEAN NOT NULL DEFAULT false,
    "telegramId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PremiumContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unlockPrice" DOUBLE PRECISION NOT NULL,
    "content" JSONB NOT NULL,
    "discount" JSONB,
    "amount" DOUBLE PRECISION,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PremiumContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PremiumContentAccess" (
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "paymentId" TEXT,
    "orderId" TEXT,

    CONSTRAINT "PremiumContentAccess_pkey" PRIMARY KEY ("userId","contentId")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isSubscribed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT,
    "userimage" TEXT,
    "role" TEXT,
    "rating" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramChannelForPublic" (
    "id" TEXT NOT NULL,
    "channelImage" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "channelLink" TEXT NOT NULL,
    "subscribers" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TelegramChannelForPublic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_chatId_key" ON "User"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_otpStoreId_key" ON "User"("otpStoreId");

-- CreateIndex
CREATE UNIQUE INDEX "OTPStore_userId_key" ON "OTPStore"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_phoneNumber_key" ON "Otp"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_accountNumber_key" ON "BankDetails"("accountNumber");

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
CREATE UNIQUE INDEX "Telegram_chatId_key" ON "Telegram"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramSubscription_id_key" ON "TelegramSubscription"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramSubscription_paymentId_key" ON "TelegramSubscription"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramSubscription_orderId_key" ON "TelegramSubscription"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramSubscription_telegramId_boughtById_isExpired_key" ON "TelegramSubscription"("telegramId", "boughtById", "isExpired");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_id_key" ON "Discount"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_telegramId_code_key" ON "Discount"("telegramId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_id_key" ON "Subscription"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_telegramId_type_key" ON "Subscription"("telegramId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_email_key" ON "Newsletter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramChannelForPublic_channelLink_key" ON "TelegramChannelForPublic"("channelLink");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramChannelForPublic_userId_key" ON "TelegramChannelForPublic"("userId");

-- AddForeignKey
ALTER TABLE "OTPStore" ADD CONSTRAINT "OTPStore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_bankDetailsId_fkey" FOREIGN KEY ("bankDetailsId") REFERENCES "BankDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_upiId_fkey" FOREIGN KEY ("upiId") REFERENCES "UPI"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webinar" ADD CONSTRAINT "Webinar_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarTicket" ADD CONSTRAINT "WebinarTicket_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarTicket" ADD CONSTRAINT "WebinarTicket_boughtById_fkey" FOREIGN KEY ("boughtById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProduct" ADD CONSTRAINT "CourseProduct_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lessons" ADD CONSTRAINT "Lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePurchasers" ADD CONSTRAINT "CoursePurchasers_purchaserId_fkey" FOREIGN KEY ("purchaserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePurchasers" ADD CONSTRAINT "CoursePurchasers_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRenewal" ADD CONSTRAINT "CourseRenewal_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "CoursePurchasers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayingUp" ADD CONSTRAINT "PayingUp_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayingUpTicket" ADD CONSTRAINT "PayingUpTicket_payingUpId_fkey" FOREIGN KEY ("payingUpId") REFERENCES "PayingUp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayingUpTicket" ADD CONSTRAINT "PayingUpTicket_boughtById_fkey" FOREIGN KEY ("boughtById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telegram" ADD CONSTRAINT "Telegram_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramSubscription" ADD CONSTRAINT "TelegramSubscription_telegramId_fkey" FOREIGN KEY ("telegramId") REFERENCES "Telegram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramSubscription" ADD CONSTRAINT "TelegramSubscription_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramSubscription" ADD CONSTRAINT "TelegramSubscription_boughtById_fkey" FOREIGN KEY ("boughtById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_telegramId_fkey" FOREIGN KEY ("telegramId") REFERENCES "Telegram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_telegramId_fkey" FOREIGN KEY ("telegramId") REFERENCES "Telegram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumContent" ADD CONSTRAINT "PremiumContent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumContentAccess" ADD CONSTRAINT "PremiumContentAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumContentAccess" ADD CONSTRAINT "PremiumContentAccess_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "PremiumContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramChannelForPublic" ADD CONSTRAINT "TelegramChannelForPublic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
