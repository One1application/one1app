-- CreateTable
CREATE TABLE "PremiumContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unlockPrice" DOUBLE PRECISION NOT NULL,
    "text" TEXT,
    "images" TEXT[],
    "files" TEXT[],
    "code" TEXT,
    "discountPercentage" DOUBLE PRECISION,
    "expirationDate" TEXT,
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

    CONSTRAINT "PremiumContentAccess_pkey" PRIMARY KEY ("userId","contentId")
);

-- AddForeignKey
ALTER TABLE "PremiumContent" ADD CONSTRAINT "PremiumContent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumContentAccess" ADD CONSTRAINT "PremiumContentAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumContentAccess" ADD CONSTRAINT "PremiumContentAccess_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "PremiumContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
