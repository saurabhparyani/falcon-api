CREATE TYPE "public"."status" AS ENUM('live', 'draft', 'sold');--> statement-breakpoint
ALTER TABLE "car_listings" ADD COLUMN "status" "status" DEFAULT 'live' NOT NULL;