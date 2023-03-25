import { addTaskSchema } from '$lib/schemas/add-task-schema';
import { editTaskSchema } from '$lib/schemas/edit-task-schema';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const taskRouter = router({
	add: protectedProcedure.input(addTaskSchema).mutation(async ({ input }) => {
		const { columnId, endsAt, subTasks, tags, title, description } = input;

		return await prisma?.task.create({
			data: {
				columnId,
				endsAt,
				title,
				description,
				subTasks: {
					createMany: {
						data: subTasks.map((subTask) => ({
							name: subTask,
						})),
					},
				},
				tagsByTasks: {
					createMany: {
						data: tags.map((tag) => ({
							tagId: tag.id,
						})),
					},
				},
			},
		});
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
					tagsByTasks: {
						select: {
							tag: {
								select: {
									color: true,
									label: true,
									id: true,
								},
							},
						},
					},
				},
			});
		}),
	update: protectedProcedure
		.input(editTaskSchema.and(z.object({ id: z.string() })))
		.mutation(async ({ ctx: { prisma }, input }) => {
			const { id, subTasks, tags, ...rest } = input;

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

			await prisma.tagsByTask.deleteMany({
				where: {
					taskId: id,
				},
			});

			return await Promise.all([
				prisma.tagsByTask.createMany({
					data: tags.map((tag) => ({
						tagId: tag.id,
						taskId: id,
					})),
				}),
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
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx: { prisma }, input }) => {
			const { id } = input;

			return await prisma.task.delete({ where: { id } });
		}),
});
