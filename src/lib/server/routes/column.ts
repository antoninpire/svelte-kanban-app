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
});
