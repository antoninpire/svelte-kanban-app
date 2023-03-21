import { db } from '$lib/db';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const appRouter = router({
	greeting: publicProcedure
		.input(
			z.object({
				name: z.string().optional(),
			})
		)
		.query(({ input }) => {
			return `Hello, ${input.name ?? 'world'}!`;
		}),
	getAll: publicProcedure.query(async () => {
		return await db.selectFrom('Example').selectAll().execute();
	}),
	createExample: publicProcedure
		.input(z.object({ name: z.string() }))
		.mutation(async ({ input }) => {
			await db.insertInto('Example').values({ name: input.name }).execute();
		}),
});

export type AppRouter = typeof appRouter;
