-- CreateTable
CREATE TABLE "ai_report_usage" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "report_type" VARCHAR(50) NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "month_year" VARCHAR(7) NOT NULL,
    "report_data" JSONB NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'processing',
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_report_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_report_usage_user_id_month_year_idx" ON "ai_report_usage"("user_id", "month_year");

-- CreateIndex
CREATE INDEX "ai_report_usage_user_id_report_date_idx" ON "ai_report_usage"("user_id", "report_date");

-- CreateIndex
CREATE INDEX "ai_report_usage_status_idx" ON "ai_report_usage"("status");

-- AddForeignKey
ALTER TABLE "ai_report_usage" ADD CONSTRAINT "ai_report_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

