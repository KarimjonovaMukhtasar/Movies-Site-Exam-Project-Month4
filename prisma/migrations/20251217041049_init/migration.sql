-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('user', 'admin', 'superadmin');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "SubsStatus" AS ENUM ('active', 'expired', 'canceled', 'pending_payment');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('card', 'paypal', 'bank_transfer', 'crypto');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('free', 'premium');

-- CreateEnum
CREATE TYPE "Quality" AS ENUM ('240p', '360p', '480p', '720p', '1080p', '4K');

-- CreateEnum
CREATE TYPE "Languages" AS ENUM ('uz', 'en', 'ru');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Roles" NOT NULL DEFAULT 'user',
    "avatar_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'active',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'active',

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "features" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "status" "Status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "SubsStatus" NOT NULL DEFAULT 'pending_payment',
    "auto_renew" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "user_subscription_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_details" JSONB NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "external_transaction_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'active',

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "release_year" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "poster_url" TEXT NOT NULL,
    "rating" DECIMAL(3,1) NOT NULL,
    "subscription_type" "SubscriptionType" NOT NULL DEFAULT 'free',
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'active',

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_categories" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "movie_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_files" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "quality" "Quality" NOT NULL,
    "language" "Languages" NOT NULL DEFAULT 'uz',
    "status" "Status" NOT NULL DEFAULT 'active',

    CONSTRAINT "movie_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watch_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "watched_duration" INTEGER NOT NULL,
    "watched_percentage" DECIMAL(5,2) NOT NULL,
    "last_watched" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watch_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_phone_key" ON "profiles"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_name_key" ON "subscription_plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "movies_slug_key" ON "movies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "movies_created_by_key" ON "movies"("created_by");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_subscription_id_fkey" FOREIGN KEY ("user_subscription_id") REFERENCES "user_subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_categories" ADD CONSTRAINT "movie_categories_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_categories" ADD CONSTRAINT "movie_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_files" ADD CONSTRAINT "movie_files_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
