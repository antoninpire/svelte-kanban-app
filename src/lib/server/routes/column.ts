import { addColumnSchema } from '$lib/schemas/add-column-schema';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const columnRouter = router({
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx: { prisma }, input }) => {
			return await prisma.column.delete({ where: { id: input.id } });
		}),
	updateName: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1, 'At least one character'),
			})
		)
		.mutation(async ({ ctx: { prisma }, input }) => {
			const { id, name } = input;
			return await prisma.column.update({ where: { id }, data: { name } });
		}),
	add: protectedProcedure
		.input(addColumnSchema)
		.mutation(async ({ ctx: { prisma }, input }) => {
			return await Promise.all([
				prisma.column.create({
					data: {
						...input,
					},
				}),
				prisma.column.updateMany({
					where: {
						boardId: input.boardId,
						order: {
							gte: input.order,
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
