import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { parse } from 'csv-parse';
import fs from 'fs';
import { config } from 'dotenv';

import { brands, models, variants } from '@/db/schema/taxonomy';
import { eq } from 'drizzle-orm';
import { FuelType, BodyType, Transmission } from '@/utils/enum-types';

config({ path: '.dev.vars' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const BATCH_SIZE = 100;

type Row = {
	brand?: string | undefined;
	model: string;
	variant: string;
	price: string;
	fuelType: string;
	bodyType: string;
	doors: string;
	seats: string;
	transmission: string;
};

type BrandModelMap = {
	[brand: string]: {
		[model: string]: {
			variants: {
				[variant: string]: {
					price: string;
					fuelType: string;
					bodyType: string;
					doors: string;
					seats: string;
					transmission: string;
				};
			};
		};
	};
};

async function insertInBatches<T>(items: Promise<T>[], batchSize: number, callback: (batch: Promise<T>[]) => Promise<void>) {
	for (let i = 0; i < items.length; i += batchSize) {
		const batch = items.slice(i, i + batchSize);
		await callback(batch);
	}
}

export const seedTaxonomy = async () => {
	const rows = await new Promise<Row[]>((resolve, reject) => {
		const eachRow: Row[] = [];

		fs.createReadStream('falcon-dataset.csv')
			.pipe(parse({ columns: true, delimiter: ';' }))
			.on('data', async (row: { [index: string]: string }) => {
				eachRow.push({
					brand: row.Brand || undefined,
					model: row.Model,
					variant: row.Variant,
					price: row.Price,
					fuelType: row.FuelType,
					bodyType: row.BodyType,
					doors: row.Doors,
					seats: row.Seats,
					transmission: row.Transmission,
				});
			})
			.on('error', (err) => {
				console.log({ err });
				reject(err);
			})
			.on('end', () => {
				resolve(eachRow);
			});
	});

	const res: BrandModelMap = {};

	rows.forEach((row: Row) => {
		if (!res[row.brand || '']) {
			res[row.brand || ''] = {};
		}

		if (!res[row.brand || ''][row.model]) {
			res[row.brand || ''][row.model] = {
				variants: {},
			};
		}

		if (row.variant) {
			res[row.brand || ''][row.model].variants[row.variant] = {
				bodyType: row.bodyType,
				doors: row.doors,
				fuelType: row.fuelType,
				price: row.price,
				seats: row.seats,
				transmission: row.transmission,
			};
		}
	});

	// Brand Promises
	const brandPromises = Object.entries(res).map(async ([name]) => {
		const imageUrl = `https://vl.imgix.net/img/${name.replace(/\s+/g, '-').toLowerCase()}-logo.png?auto=format,compress`;
		const now = new Date();

		return db
			.insert(brands)
			.values({
				name,
				image: imageUrl,
				updatedAt: now,
			})
			.onConflictDoUpdate({
				target: brands.name,
				set: {
					image: imageUrl,
					updatedAt: now,
				},
			})
			.returning();
	});

	const brandsResult = await Promise.all(brandPromises);
	const brandsList = brandsResult.map((br) => br[0]);
	console.log(`Seeded db with ${brandsList.length} brands!`);

	// Model Promises
	const modelPromises = [];

	for (const brand of brandsList) {
		for (const modelName in res[brand.name]) {
			const now = new Date();

			modelPromises.push(
				db
					.insert(models)
					.values({
						name: modelName,
						brandId: brand.id,
						updatedAt: now,
					})
					.onConflictDoUpdate({
						target: [models.brandId, models.name],
						set: {
							updatedAt: now,
						},
					})
					.returning()
			);
		}
	}

	await insertInBatches(modelPromises, BATCH_SIZE, async (batch) => {
		const models = await Promise.all(batch);
		console.log(`Seeded batch of ${models.length} models 🌱`);
	});

	// Variant Promises
	const variantPromises = [];

	for (const brand of brandsList) {
		const modelsList = await db.select().from(models).where(eq(models.brandId, brand.id));

		for (const model of modelsList) {
			if (res[brand.name][model.name]?.variants) {
				for (const [variantName, variantData] of Object.entries(res[brand.name][model.name].variants)) {
					const now = new Date();

					const normalizedFuelTypeRaw = variantData.fuelType.toLowerCase();
					const validFuelType = Object.values(FuelType).includes(normalizedFuelTypeRaw as FuelType)
						? (normalizedFuelTypeRaw as FuelType)
						: FuelType.PETROL;

					const normalizedBodyType = variantData.bodyType.toLowerCase();
					const validBodyType = Object.values(BodyType).includes(normalizedBodyType as BodyType)
						? (normalizedBodyType as BodyType)
						: BodyType.SEDAN;

					const normalizedTransmission = variantData.transmission.toLowerCase();
					const validTransmission = Object.values(Transmission).includes(normalizedTransmission as Transmission)
						? (normalizedTransmission as Transmission)
						: Transmission.MANUAL;

					variantPromises.push(
						db
							.insert(variants)
							.values({
								name: variantName,
								modelId: model.id,
								price: parseInt(variantData.price) || 0,
								fuelType: validFuelType,
								bodyType: validBodyType,
								doors: parseInt(variantData.doors) || 4,
								seats: parseInt(variantData.seats) || 5,
								transmission: validTransmission,
								updatedAt: now,
							})
							.onConflictDoUpdate({
								target: [variants.modelId, variants.name],
								set: {
									price: parseInt(variantData.price) || 0,
									fuelType: validFuelType,
									bodyType: validBodyType,
									doors: parseInt(variantData.doors) || 4,
									seats: parseInt(variantData.seats) || 5,
									transmission: validTransmission,
									updatedAt: now,
								},
							})
							.returning()
					);
				}
			}
		}
	}

	await insertInBatches(variantPromises, BATCH_SIZE, async (batch) => {
		const variants = await Promise.all(batch);
		console.log(`Seeded batch of ${variants.length} variants 🌱`);
	});
};
