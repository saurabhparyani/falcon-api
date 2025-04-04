import { pgTable, index } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { brands, models, variants } from '@/db/schema/taxonomy';

export const transmissionEnum = t.pgEnum('transmission', ['manual', 'automatic']);

export const colorEnum = t.pgEnum('color', [
	'black',
	'blue',
	'brown',
	'gold',
	'green',
	'grey',
	'orange',
	'pink',
	'purple',
	'red',
	'silver',
	'white',
	'yellow',
]);

export const fuelTypeEnum = t.pgEnum('fuel_type', ['petrol', 'diesel', 'electric', 'hybrid']);

export const bodyTypeEnum = t.pgEnum('body_type', ['sedan', 'hatchback', 'suv', 'coupe', 'convertible', 'wagon']);

export const distanceUnitEnum = t.pgEnum('distance_unit', ['km', 'miles']);

export const currencyCodeEnum = t.pgEnum('currency', ['INR', 'EUR', 'USD']);

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

		doors: t.integer().default(2).notNull(),
		seats: t.integer().default(5).notNull(),
		price: t.integer().default(0).notNull(),
		transmission: transmissionEnum().default('manual').notNull(),
		color: colorEnum().notNull().default('black'),
		fuelType: fuelTypeEnum().notNull().default('petrol'),
		bodyType: bodyTypeEnum().notNull().default('sedan'),
		distanceUnit: distanceUnitEnum().notNull().default('km'),
		currency: currencyCodeEnum().notNull().default('INR'),
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
