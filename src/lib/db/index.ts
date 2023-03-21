import { PG_CONNECTION_STRING } from '$env/static/private';
import { Kysely, PostgresDialect, sql, type RawBuilder } from 'kysely';
import { Pool } from 'pg';
import type { DB } from './schema';

export const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: PG_CONNECTION_STRING,
		}),
	}),
});

export function json<T>(obj: T): RawBuilder<T> {
	return sql`${JSON.stringify(obj)}`;
}
