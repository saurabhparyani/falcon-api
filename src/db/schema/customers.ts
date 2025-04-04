import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { carListings } from '@/db/schema/carListings';

export const customerStatusEnum = t.pgEnum('customer_status', ['subscriber', 'interested', 'contacted', 'purchased', 'cold']);

export const customers = pgTable('customers', {
	id: t.uuid().primaryKey().defaultRandom(),
	firstName: t.varchar('first_name', { length: 255 }).notNull(),
	lastName: t.varchar('last_name', { length: 255 }).notNull(),
	email: t.varchar('email', { length: 255 }).notNull(),
	phone: t.varchar('phone', { length: 255 }),
	bookingDate: t.timestamp('booking_date').notNull(),
	termsAccepted: t.boolean('terms_accepted').notNull().default(false),
	status: customerStatusEnum().default('interested').notNull(),
	carListingId: t
		.uuid('car_listing_id')
		.notNull()
		.references(() => carListings.id, { onDelete: 'cascade' }),
	createdAt: t.timestamp('created_at').defaultNow().notNull(),
	updatedAt: t.timestamp('updated_at').notNull(),
});
