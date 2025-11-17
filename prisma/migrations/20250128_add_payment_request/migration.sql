-- CreateTable
CREATE TABLE IF NOT EXISTS "payment_request" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "plan_id" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'TRY',
    "description" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "admin_notes" TEXT,
    "approved_by" INTEGER,
    "approved_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "payment_request_user_id_idx" ON "payment_request"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "payment_request_status_idx" ON "payment_request"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "payment_request_created_at_idx" ON "payment_request"("created_at");

-- AddForeignKey
ALTER TABLE "payment_request" ADD CONSTRAINT "payment_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

