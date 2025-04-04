ALTER TABLE "car_listings" ADD COLUMN "status" "status" DEFAULT 'live' NOT NULL;--> statement-breakpoint
ALTER TABLE "car_listings" ADD COLUMN "transmission" "transmission" DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE "car_listings" ADD COLUMN "color" "color" DEFAULT 'black' NOT NULL;--> statement-breakpoint
ALTER TABLE "car_listings" ADD COLUMN "fuelType" "fuel_type" DEFAULT 'petrol' NOT NULL;--> statement-breakpoint
ALTER TABLE "car_listings" ADD COLUMN "bodyType" "body_type" DEFAULT 'sedan' NOT NULL;--> statement-breakpoint
ALTER TABLE "car_listings" ADD COLUMN "distanceUnit" "distance_unit" DEFAULT 'km' NOT NULL;--> statement-breakpoint
ALTER TABLE "car_listings" ADD COLUMN "currency" "currency" DEFAULT 'INR' NOT NULL;--> statement-breakpoint
ALTER TABLE "customer_lifecycle" ADD COLUMN "old_status" "customer_status";--> statement-breakpoint
ALTER TABLE "customer_lifecycle" ADD COLUMN "new_status" "customer_status";