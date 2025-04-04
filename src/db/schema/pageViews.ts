import { pgTable, index } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const pageViews = pgTable(
	'page_views',
	{
		id: t.uuid().primaryKey().defaultRandom(),
		path: t.varchar({ length: 255 }).notNull(),
		viewedAt: t.timestamp('viewed_at').defaultNow().notNull(),
		ipAddress: t.varchar('ip_address', { length: 255 }),
		userAgent: t.varchar('user_agent', { length: 255 }),
		referrer: t.varchar({ length: 255 }),
	},
	(table) => [index('page_path_viewedat_idx').on(table.path, table.viewedAt)]
);
