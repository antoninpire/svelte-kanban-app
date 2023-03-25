import { dev } from '$app/environment';
import { prisma } from '$lib/db/prisma';
import prismaAdapter from '@lucia-auth/adapter-prisma';
import lucia from 'lucia-auth';

export const auth = lucia({
	adapter: prismaAdapter(prisma),
	env: dev ? 'DEV' : 'PROD',
	transformUserData: (userData) => {
		return {
			userId: userData.id,
			email: userData.email,
		};
	},
});

export type Auth = typeof auth;
