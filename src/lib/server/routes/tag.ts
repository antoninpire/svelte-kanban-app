import { editTagsSchema } from '$lib/schemas/edit-tags-schema';
import { protectedProcedure, router } from '$lib/server/trpc';
import { z } from 'zod';

export const tagRouter = router({
	updateTags: protectedProcedure
		.input(editTagsSchema.and(z.object({ boardId: z.string() })))
		.mutation(async ({ ctx: { prisma, session }, input }) => {
			const { boardId, tags } = input;

			await prisma.tag.deleteMany({
				where: {
					boardId,
				},
			});

			return await prisma.tag.createMany({
				data: tags.map((tag) => ({ ...tag, boardId, userId: session.userId })),
			});
		}),
	getByBoardId: protectedProcedure
		.input(z.object({ boardId: z.string() }))
		.query(async ({ ctx: { prisma }, input }) => {
			return await prisma.tag.findMany({ where: { boardId: input.boardId } });
		}),
});
