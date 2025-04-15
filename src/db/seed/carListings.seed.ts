import { faker } from '@faker-js/faker';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';
import { brands, models, variants } from '@/db/schema/taxonomy';
import { eq } from 'drizzle-orm';
import slugify from 'slugify';
import { BodyType, Color, CurrencyCode, DistanceUnit, FuelType, Status, Transmission } from '@/utils/enum-types';
import { carListings } from '@/db/schema/carListings';

config({ path: '.dev.vars' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function seedCarListings() {
	const brandsData = await db.select().from(brands);

	const carListingsData = [];

	for (let i = 0; i < 25; i++) {
		const brand = faker.helpers.arrayElement(brandsData);

		const brandModels = await db.select().from(models).where(eq(models.brandId, brand.id));

		if (!brandModels.length) continue;

		const model = faker.helpers.arrayElement(brandModels);

		const modelVariants = await db.select().from(variants).where(eq(variants.modelId, model.id));

		const variant = modelVariants.length ? faker.helpers.arrayElement(modelVariants) : null;

		const year = faker.date
			.between({
				from: new Date(1925, 0, 1),
				to: new Date(),
			})
			.getFullYear();

		const title = [year, brand.name, model.name, variant?.name].filter(Boolean).join(' ');

		const registrationNumber = faker.vehicle.vrm();

		const baseSlug = slugify(`${title} - ${registrationNumber}`);

		const doors = variant?.doors || faker.number.int({ min: 2, max: 8 });

		const seats = variant?.seats || faker.number.int({ min: 2, max: 8 });

		const price = variant?.price || faker.number.int({ min: 200000, max: 8000000 });

		const transmission = variant?.transmission || faker.helpers.arrayElement(Object.values(Transmission));

		const fuelType = variant?.fuelType || faker.helpers.arrayElement(Object.values(FuelType));

		const bodyType = variant?.bodyType || faker.helpers.arrayElement(Object.values(BodyType));

		carListingsData.push({
			views: faker.number.int({ min: 100, max: 10000 }),
			slug: baseSlug,
			registrationNumber,
			title,
			description: faker.commerce.productDescription(),
			year,
			totalDistanceTravelled: faker.number.int({ min: 0, max: 200000 }),
			status: faker.helpers.arrayElement(Object.values(Status)),
			doors,
			seats,
			price,
			transmission,
			color: faker.helpers.arrayElement(Object.values(Color)),
			fuelType,
			bodyType,
			distanceUnit: faker.helpers.arrayElement(Object.values(DistanceUnit)),
			currency: faker.helpers.arrayElement(Object.values(CurrencyCode)),
			brandId: brand.id,
			modelId: model.id,
			...(variant?.id && { variantId: variant.id }),
			updatedAt: new Date(),
		});
	}

	if (carListingsData.length > 0) {
		try {
			const insertResult = await db.insert(carListings).values(carListingsData);
			console.log(`Total of ${carListingsData.length} car listings seeded 🌱`);
			return insertResult;
		} catch (error: any) {
			if (error.message?.includes('duplicate key')) {
				console.log('Handling duplicates by inserting records one by one...');

				let successCount = 0;
				for (const listing of carListingsData) {
					try {
						await db.insert(carListings).values(listing);
						successCount++;
					} catch (err: any) {
						if (!err.message?.includes('duplicate key')) {
							throw err;
						}
					}
				}

				console.log(`Total of ${successCount} car listings seeded (duplicates skipped) 🌱`);
				return { count: successCount };
			}

			throw error;
		}
	}

	return { count: 0 };
}
