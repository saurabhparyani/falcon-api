import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.dev.vars' });

const sql = neon(process.env.DATABASE_URL!);

async function dropAllTables() {
	try {
		// Drop all tables in the correct order (respecting foreign key constraints)
		await sql`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        -- Disable triggers
        SET CONSTRAINTS ALL DEFERRED;
        
        -- Drop all tables
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;

        -- Drop all custom types (enums)
        FOR r IN (SELECT typname FROM pg_type 
                 JOIN pg_catalog.pg_namespace ON pg_namespace.oid = pg_type.typnamespace 
                 WHERE typtype = 'e' AND nspname = 'public') LOOP
          EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
      END $$;
    `;

		console.log('✨ Successfully dropped all tables and types!');
	} catch (error) {
		console.error('Error dropping tables:', error);
		process.exit(1);
	} finally {
		process.exit(0);
	}
}

dropAllTables();
