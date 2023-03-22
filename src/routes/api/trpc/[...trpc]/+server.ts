import { appRouter } from '$lib/server/routes/_app';
// import { createContext } from '$lib/server/context';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { RequestHandler } from './$types';

const handler: RequestHandler = async (event) => {
	const session = await event.locals.validate();
	return fetchRequestHandler({
		endpoint: '/api/trpc',
		req: event.request,
		router: appRouter,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		createContext: async () => {
			return {
				session,
			};
		},
	});
};

export const GET = handler;
export const POST = handler;
