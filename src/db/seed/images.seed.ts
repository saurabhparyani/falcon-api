import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';
import { createPngDataUri } from 'unlazy/thumbhash';

config({ path: '.dev.vars' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);
import { carListings } from '@/db/schema/carListings';
import { imageSources } from '@/config/constants';
import { faker } from '@faker-js/faker';
import { images } from '@/db/schema/images';
export async function seedImages() {
	const carListingsData = await db.select().from(carListings);

	const carListingIds = carListingsData.map((carListing) => carListing.id);

	for (const carListingId of carListingIds) {
		const image = {
			src: imageSources.carListingPlaceholder,
			alt: faker.lorem.words(2),
			carListingId: carListingId,
			blurHash: createPngDataUri('token'),
		};

		await db.insert(images).values(image);
	}
}
