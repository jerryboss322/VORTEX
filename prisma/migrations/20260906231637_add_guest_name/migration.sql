-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_submittedById_fkey";

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "guestName" TEXT,
ADD COLUMN     "ipHash" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'member',
ALTER COLUMN "submittedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
