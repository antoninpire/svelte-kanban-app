import { db } from '$lib/db';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

const addSchema = z.object({
	title: z
		.string()
		.min(3, 'Must be at least 3 characters')
		.max(75, 'Must be at most 75 characters'),
	subTasks: z.string().array(),
	columnId: z.string().cuid2(),
	description: z.string(),
	endsAt: z.date().optional(),
});

export const taskRouter = router({
	add: protectedProcedure.input(addSchema).mutation(async ({ input }) => {
		// console.log('INPUT', input);
		const task = await db
			.insertInto('Task')
			.values({
				title: input.title,
				updatedAt: new Date(),
				id: createId(),
				description: input.description,
				columnId: input.columnId,
				endsAt: input.endsAt,
			})
			.returning('id')
			.executeTakeFirst();
		if (task && input.subTasks?.length)
			await db
				.insertInto('SubTask')
				.values(
					input.subTasks
						.filter((subTask) => subTask.length !== 0)
						.map((subTask, index) => ({
							taskId: task.id,
							name: subTask,
							id: createId(),
							updatedAt: new Date(),
							order: index,
						}))
				)
				.execute();
	}),
	getById: protectedProcedure
		.input(z.object({ id: z.string().cuid2() }))
		.query(async ({ ctx: { prisma }, input }) => {
			return await prisma.task.findUnique({
				where: { id: input.id },
				select: {
					id: true,
					title: true,
					description: true,
					columnId: true,
					endsAt: true,
					createdAt: true,
					updatedAt: true,
					subTasks: {
						select: {
							id: true,
							name: true,
							achieved: true,
						},
					},
				},
			});
		}),
});
