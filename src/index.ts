import { neon } from '@neondatabase/serverless';
import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/neon-http';
export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
	return c.json({
		message: 'Hello Hono+Cloudflare!',
	});
});

export default app;
