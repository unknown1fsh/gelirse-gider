-- AlterTable
ALTER TABLE "user" ADD COLUMN "email_verification_token" VARCHAR(255),
ADD COLUMN "email_verification_expiry" TIMESTAMP(3);

