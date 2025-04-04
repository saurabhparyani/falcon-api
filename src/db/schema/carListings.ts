import { pgTable, index } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { brands, models, variants } from '@/db/schema/taxonomy';
import {
	statusEnum,
	Status,
	transmissionEnum,
	Transmission,
	colorEnum,
	Color,
	fuelTypeEnum,
	FuelType,
	bodyTypeEnum,
	BodyType,
	distanceUnitEnum,
	DistanceUnit,
	currencyCodeEnum,
	CurrencyCode,
} from '@/utils/enum-types';
export const carListings = pgTable(
	'car_listings',
	{
		id: t.uuid().primaryKey().defaultRandom(),
		views: t.integer().default(0).notNull(),
		slug: t.varchar({ length: 255 }).unique().notNull(),
		registrationNumber: t.varchar('registration_number', { length: 255 }),
		title: t.varchar({ length: 255 }),
		description: t.text('description'),
		year: t.integer().notNull(),
		totalDistanceTravelled: t.bigint('total_distance_travelled', { mode: 'number' }).default(0).notNull(),
		status: statusEnum().default(Status.LIVE).notNull(),
		doors: t.integer().default(2).notNull(),
		seats: t.integer().default(5).notNull(),
		price: t.integer().default(0).notNull(),
		transmission: transmissionEnum().default(Transmission.MANUAL).notNull(),
		color: colorEnum().default(Color.BLACK).notNull(),
		fuelType: fuelTypeEnum().default(FuelType.PETROL).notNull(),
		bodyType: bodyTypeEnum().default(BodyType.SEDAN).notNull(),
		distanceUnit: distanceUnitEnum().default(DistanceUnit.KM).notNull(),
		currency: currencyCodeEnum().default(CurrencyCode.INR).notNull(),
		createdAt: t.timestamp('created_at').defaultNow().notNull(),
		updatedAt: t.timestamp('updated_at').notNull(),
		brandId: t
			.uuid('brand_id')
			.notNull()
			.references(() => brands.id, { onDelete: 'cascade' }),
		modelId: t
			.uuid('model_id')
			.notNull()
			.references(() => models.id, { onDelete: 'cascade' }),
		variantId: t.uuid('variant_id').references(() => variants.id),
	},
	(table) => [index('idx_car_brand_model').on(table.brandId, table.modelId), index('idx_car_price').on(table.price)]
);
