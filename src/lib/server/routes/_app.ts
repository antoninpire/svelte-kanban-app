import { boardRouter } from '$lib/server/routes/board';
import { columnRouter } from '$lib/server/routes/column';
import { tagRouter } from '$lib/server/routes/tag';
import { router } from '../trpc';
import { taskRouter } from './task';

export const appRouter = router({
	board: boardRouter,
	task: taskRouter,
	column: columnRouter,
	tag: tagRouter,
});

export type AppRouter = typeof appRouter;
