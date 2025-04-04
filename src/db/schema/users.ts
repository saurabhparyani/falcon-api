import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: t.uuid().primaryKey().defaultRandom(),
	email: t.varchar({ length: 255 }).notNull().unique(),
	hashedPassword: t.varchar('hashed_password', { length: 255 }).unique().notNull(),
	createdAt: t.timestamp('created_at').defaultNow().notNull(),
	updatedAt: t.timestamp('updated_at').notNull(),
});
