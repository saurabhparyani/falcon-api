CREATE TYPE "public"."body_type" AS ENUM('sedan', 'hatchback', 'suv', 'coupe', 'mpv', 'convertible', 'crossover', 'muv');--> statement-breakpoint
CREATE TYPE "public"."color" AS ENUM('black', 'blue', 'brown', 'gold', 'green', 'grey', 'orange', 'pink', 'purple', 'red', 'silver', 'white', 'yellow');--> statement-breakpoint
CREATE TYPE "public"."currency" AS ENUM('INR', 'EUR', 'USD');--> statement-breakpoint
CREATE TYPE "public"."customer_status" AS ENUM('subscriber', 'interested', 'contacted', 'purchased', 'cold');--> statement-breakpoint
CREATE TYPE "public"."distance_unit" AS ENUM('km', 'miles');--> statement-breakpoint
CREATE TYPE "public"."fuel_type" AS ENUM('petrol', 'diesel', 'electric', 'hybrid', 'cng');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('live', 'draft', 'sold');--> statement-breakpoint
CREATE TYPE "public"."transmission" AS ENUM('manual', 'automatic', 'amt', 'dct', 'cvt');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"hashed_password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_hashed_password_unique" UNIQUE("hashed_password")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_token" varchar(255) NOT NULL,
	"userId" uuid,
	"expires" timestamp NOT NULL,
	"requires_2fa" boolean DEFAULT false NOT NULL,
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "brands_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"brand_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"model_id" uuid NOT NULL,
	"price" integer NOT NULL,
	"fuelType" "fuel_type" NOT NULL,
	"bodyType" "body_type" NOT NULL,
	"doors" integer NOT NULL,
	"seats" integer NOT NULL,
	"transmission" "transmission" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "car_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"slug" varchar(255) NOT NULL,
	"registration_number" varchar(255),
	"title" varchar(255),
	"description" text,
	"year" integer NOT NULL,
	"total_distance_travelled" bigint DEFAULT 0 NOT NULL,
	"status" "status" DEFAULT 'live' NOT NULL,
	"doors" integer DEFAULT 2 NOT NULL,
	"seats" integer DEFAULT 5 NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"transmission" "transmission" DEFAULT 'manual' NOT NULL,
	"color" "color" DEFAULT 'black' NOT NULL,
	"fuelType" "fuel_type" DEFAULT 'petrol' NOT NULL,
	"bodyType" "body_type" DEFAULT 'sedan' NOT NULL,
	"distanceUnit" "distance_unit" DEFAULT 'km' NOT NULL,
	"currency" "currency" DEFAULT 'INR' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"brand_id" uuid NOT NULL,
	"model_id" uuid NOT NULL,
	"variant_id" uuid,
	CONSTRAINT "car_listings_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path" varchar(255) NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" varchar(255),
	"user_agent" varchar(255),
	"referrer" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "customer_lifecycle" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"old_status" "customer_status",
	"new_status" "customer_status",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255),
	"booking_date" timestamp NOT NULL,
	"terms_accepted" boolean DEFAULT false NOT NULL,
	"car_listing_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alt" varchar(255) NOT NULL,
	"src" varchar(255) NOT NULL,
	"car_listing_id" uuid NOT NULL,
	"blur_hash" varchar(255) NOT NULL,
	"is_main" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_listings" ADD CONSTRAINT "car_listings_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_listings" ADD CONSTRAINT "car_listings_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_listings" ADD CONSTRAINT "car_listings_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_lifecycle" ADD CONSTRAINT "customer_lifecycle_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_car_listing_id_car_listings_id_fk" FOREIGN KEY ("car_listing_id") REFERENCES "public"."car_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_car_listing_id_car_listings_id_fk" FOREIGN KEY ("car_listing_id") REFERENCES "public"."car_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_model_brand_name" ON "models" USING btree ("brand_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_variant_model_name" ON "variants" USING btree ("model_id","name");--> statement-breakpoint
CREATE INDEX "idx_car_brand_model" ON "car_listings" USING btree ("brand_id","model_id");--> statement-breakpoint
CREATE INDEX "idx_car_price" ON "car_listings" USING btree ("price");--> statement-breakpoint
CREATE INDEX "page_path_viewedat_idx" ON "page_views" USING btree ("path","viewed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "customer_id_idx" ON "customer_lifecycle" USING btree ("customer_id");