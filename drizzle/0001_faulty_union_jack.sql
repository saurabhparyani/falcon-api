CREATE TYPE "public"."body_type" AS ENUM('sedan', 'hatchback', 'suv', 'coupe', 'convertible', 'wagon');--> statement-breakpoint
CREATE TYPE "public"."color" AS ENUM('black', 'blue', 'brown', 'gold', 'green', 'grey', 'orange', 'pink', 'purple', 'red', 'silver', 'white', 'yellow');--> statement-breakpoint
CREATE TYPE "public"."currency" AS ENUM('INR', 'EUR', 'USD');--> statement-breakpoint
CREATE TYPE "public"."distance_unit" AS ENUM('km', 'miles');--> statement-breakpoint
CREATE TYPE "public"."fuel_type" AS ENUM('petrol', 'diesel', 'electric', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."transmission" AS ENUM('manual', 'automatic');--> statement-breakpoint
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
	"year_start" integer NOT NULL,
	"year_end" integer NOT NULL,
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
ALTER TABLE "models" ADD CONSTRAINT "models_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_listings" ADD CONSTRAINT "car_listings_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_listings" ADD CONSTRAINT "car_listings_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_listings" ADD CONSTRAINT "car_listings_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_model_brand_name" ON "models" USING btree ("brand_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_variant_model_year" ON "variants" USING btree ("model_id","name");--> statement-breakpoint
CREATE INDEX "idx_car_brand_model" ON "car_listings" USING btree ("brand_id","model_id");--> statement-breakpoint
CREATE INDEX "idx_car_price" ON "car_listings" USING btree ("price");