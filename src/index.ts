import { neon } from '@neondatabase/serverless';
import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/neon-http';
import { products } from './db/schema';
export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
	const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(sql);

	const allProducts = await db.select().from(products);

	return c.json(allProducts);
});

export default app;
