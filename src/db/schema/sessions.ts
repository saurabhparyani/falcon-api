import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { users } from '@/db/schema/users';

export const sessions = pgTable('sessions', {
	id: t.uuid().primaryKey().defaultRandom(),
	sessionToken: t.varchar('session_token', { length: 255 }).unique().notNull(),
	userId: t.uuid().references(() => users.id, { onDelete: 'cascade' }),
	expires: t.timestamp('expires').notNull(),
	requires2FA: t.boolean('requires_2fa').notNull().default(false),
});
