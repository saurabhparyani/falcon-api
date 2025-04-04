import { pgTable, uniqueIndex } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const brands = pgTable('brands', {
	id: t.uuid().primaryKey().defaultRandom(),
	name: t.varchar({ length: 255 }).notNull().unique(),
	image: t.varchar({ length: 255 }).notNull(),
	createdAt: t.timestamp('created_at').defaultNow().notNull(),
	updatedAt: t.timestamp('updated_at').notNull(),
});

export const models = pgTable(
	'models',
	{
		id: t.uuid().primaryKey().defaultRandom(),
		name: t.varchar({ length: 255 }).notNull(),
		brandId: t
			.uuid('brand_id')
			.notNull()
			.references(() => brands.id, { onDelete: 'cascade' }),
		createdAt: t.timestamp('created_at').defaultNow().notNull(),
		updatedAt: t.timestamp('updated_at').notNull(),
	},
	(table) => [uniqueIndex('idx_model_brand_name').on(table.brandId, table.name)]
);

export const variants = pgTable(
	'variants',
	{
		id: t.uuid().primaryKey().defaultRandom(),
		name: t.varchar({ length: 255 }).notNull(),
		modelId: t
			.uuid('model_id')
			.notNull()
			.references(() => models.id, { onDelete: 'cascade' }),
		yearStart: t.integer('year_start').notNull(),
		yearEnd: t.integer('year_end').notNull(),
		createdAt: t.timestamp('created_at').defaultNow().notNull(),
		updatedAt: t.timestamp('updated_at').notNull(),
	},
	(table) => [uniqueIndex('idx_variant_model_year').on(table.modelId, table.name)]
);
