-- CreateEnum
CREATE TYPE "roles" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "transaction_type" AS ENUM ('debit', 'credit');

-- CreateEnum
CREATE TYPE "transaction_status" AS ENUM ('failed', 'success');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "account_id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "balance" TEXT NOT NULL DEFAULT '0.00',
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "is_suspended" BOOLEAN NOT NULL DEFAULT false,
    "profile_img" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "roles" "roles" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "otp_code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "routing_number" TEXT,
    "narration" TEXT NOT NULL,
    "available_balance" TEXT NOT NULL,
    "type" "transaction_type" NOT NULL,
    "status" "transaction_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_account_id_key" ON "users"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "otps_user_id_key" ON "otps"("user_id");

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
