import type { AppRouter } from '$lib/server/routes/_app';
import { httpBatchLink } from '@trpc/client';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createTRPCSvelte } from 'trpc-svelte-query';
import { ssrLink } from 'trpc-svelte-query/ssr';
import { transformer } from './transformer';

export const trpc = createTRPCSvelte<AppRouter>({
	links: [
		ssrLink(httpBatchLink)({
			url: '/api/trpc',
		}),
	],
	queryClientConfig: {
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
			},
		},
	},
	transformer,
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
