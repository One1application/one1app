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
CREATE UNIQUE INDEX "TelegramChannelForPublic_channelLink_key" ON "TelegramChannelForPublic"("channelLink");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramChannelForPublic_userId_key" ON "TelegramChannelForPublic"("userId");

-- AddForeignKey
ALTER TABLE "TelegramChannelForPublic" ADD CONSTRAINT "TelegramChannelForPublic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
