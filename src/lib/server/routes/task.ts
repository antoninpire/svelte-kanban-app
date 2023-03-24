import { db } from '$lib/db';
import { addTaskSchema } from '$lib/schemas/add-task-schema';
import { editTaskSchema } from '$lib/schemas/edit-task-schema';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const taskRouter = router({
	add: protectedProcedure.input(addTaskSchema).mutation(async ({ input }) => {
		const task = await db
			.insertInto('Task')
			.values({
				title: input.title,
				updatedAt: new Date(),
				id: createId(),
				description: input.description,
				columnId: input.columnId,
				endsAt: input.endsAt ?? undefined,
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
		.input(z.object({ id: z.string() }))
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
							order: true,
						},
						orderBy: {
							order: 'asc',
						},
					},
				},
			});
		}),
	update: protectedProcedure
		.input(editTaskSchema.and(z.object({ id: z.string() })))
		.mutation(async ({ ctx: { prisma }, input }) => {
			const { id, subTasks, ...rest } = input;

			const subTasksHavingId = subTasks.filter((subTask) => !!subTask.id);
			const subTasksWithoutId = subTasks.filter((subTask) => !subTask.id);

			await prisma.subTask.deleteMany({
				where: {
					id: {
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						notIn: subTasksHavingId.map((subTask) => subTask.id!),
					},
					taskId: id,
				},
			});

			return await Promise.all([
				...subTasksHavingId.map((subTask) =>
					prisma.subTask.update({
						where: {
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							id: subTask.id!,
						},
						data: {
							...subTask,
						},
					})
				),
				prisma.subTask.createMany({
					data: subTasksWithoutId.map((subTask) => ({
						...subTask,
						taskId: id,
					})),
				}),
				prisma.task.update({
					where: {
						id,
					},
					data: {
						...rest,
					},
				}),
			]);
		}),
	updateOrder: protectedProcedure
		.input(
			z.object({ id: z.string(), order: z.number(), columnId: z.string() })
		)
		.mutation(async ({ ctx: { prisma }, input }) => {
			const { id, order, columnId } = input;
			return await Promise.all([
				prisma.task.update({
					where: {
						id,
					},
					data: {
						order,
						columnId,
					},
				}),
				prisma.task.updateMany({
					where: {
						columnId,
						order: {
							gte: order,
						},
						id: {
							not: id,
						},
					},
					data: {
						order: {
							increment: 1,
						},
					},
				}),
			]);
		}),
});
