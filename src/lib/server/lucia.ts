import { dev } from '$app/environment';
import { db } from '$lib/db';
import kyselyAdapter from '@lucia-auth/adapter-kysely';
import lucia from 'lucia-auth';

export const auth = lucia({
	adapter: kyselyAdapter(db, 'pg'),
	env: dev ? 'DEV' : 'PROD',
	transformUserData: (userData) => {
		return {
			userId: userData.id,
			email: userData.email,
		};
	},
});

export type Auth = typeof auth;
