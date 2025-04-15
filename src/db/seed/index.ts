import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { seedTaxonomy } from '@/db/seed/taxonomy.seed';
import { seedCarListings } from '@/db/seed/carListings.seed';
config({ path: '.dev.vars' });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

const main = async () => {
	try {
		// await sql`TRUNCATE TABLE "brands" RESTART IDENTITY CASCADE`;
		await sql`TRUNCATE TABLE "car_listings" RESTART IDENTITY CASCADE`;
		// await sql`TRUNCATE TABLE "models" RESTART IDENTITY CASCADE`;
		// await sql`TRUNCATE TABLE "variants" RESTART IDENTITY CASCADE`;
		// await seedTaxonomy();
		await seedCarListings();
		console.log('Seed complete!');
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

main();
