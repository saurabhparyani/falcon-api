import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { carListings } from '@/db/schema/carListings';

export const images = pgTable('images', {
	id: t.uuid().primaryKey().defaultRandom(),
	alt: t.varchar({ length: 255 }).notNull(),
	src: t.varchar({ length: 255 }).notNull(),
	carListingId: t
		.uuid('car_listing_id')
		.notNull()
		.references(() => carListings.id, { onDelete: 'cascade' }),
	blurHash: t.varchar('blur_hash', { length: 255 }).notNull(),
	isMain: t.boolean('is_main').notNull().default(false),
});
