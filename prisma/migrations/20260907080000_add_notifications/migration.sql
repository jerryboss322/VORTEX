-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SUBMISSION_NEW', 'SUBMISSION_APPROVED', 'SUBMISSION_REJECTED', 'TIP_CREATED', 'TIP_WON', 'TIP_LOST', 'TIP_UPDATED');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "link" TEXT,
    "bookingCode" TEXT,
    "bookmaker" TEXT,
    "imageUrl" TEXT,
    "targetId" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");
CREATE INDEX "Notification_type_idx" ON "Notification"("type");
