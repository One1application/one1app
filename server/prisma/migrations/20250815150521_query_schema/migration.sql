-- CreateTable
CREATE TABLE "RaiseQuery" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RaiseQuery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RaiseQuery" ADD CONSTRAINT "RaiseQuery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
