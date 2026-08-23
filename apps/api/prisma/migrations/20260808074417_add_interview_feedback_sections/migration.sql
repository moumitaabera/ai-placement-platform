-- AlterTable
ALTER TABLE "public"."InterviewFeedback" ADD COLUMN     "improvements" TEXT[],
ADD COLUMN     "recommendations" TEXT[],
ADD COLUMN     "strengths" TEXT[];
