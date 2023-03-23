import { db } from '$lib/db';
import { boardRouter } from '$lib/server/routes/board';
import { columnRouter } from '$lib/server/routes/column';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { taskRouter } from './task';

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
	board: boardRouter,
	task: taskRouter,
	column: columnRouter,
});

export type AppRouter = typeof appRouter;
