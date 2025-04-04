import { pgTable, uniqueIndex } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { customers } from '@/db/schema/customers';
import { customerStatusEnum } from '@/utils/enum-types';

export const customerLifecycle = pgTable(
	'customer_lifecycle',
	{
		id: t.uuid().primaryKey().defaultRandom(),
		customerId: t
			.uuid('customer_id')
			.notNull()
			.references(() => customers.id, { onDelete: 'cascade' }),
		oldStatus: customerStatusEnum('old_status'),
		newStatus: customerStatusEnum('new_status'),
		createdAt: t.timestamp('created_at').defaultNow().notNull(),
		updatedAt: t.timestamp('updated_at').notNull(),
	},
	(table) => [uniqueIndex('customer_id_idx').on(table.customerId)]
);
