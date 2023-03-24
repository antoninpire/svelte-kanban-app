import { db } from '$lib/db';
import { addBoardSchema } from '$lib/schemas/add-board-schema';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const boardRouter = router({
	getAllNames: protectedProcedure.query(async ({ ctx }) => {
		return await db
			.selectFrom('Board')
			.select(['name', 'id'])
			.where('userId', '=', ctx.session.userId)
			.execute();
	}),
	add: protectedProcedure
		.input(addBoardSchema)
		.mutation(async ({ ctx: { session, prisma }, input }) => {
			return await prisma.board.create({
				data: {
					name: input.name,
					userId: session.userId,
					columns: {
						createMany: {
							data: input.columns
								.filter((column) => column.length !== 0)
								.map((column, index) => ({
									name: column,
									order: index,
								})),
						},
					},
				},
			});
			// const board = await db
			// 	.insertInto('Board')
			// 	.values({
			// 		name: input.name,
			// 		userId: session.userId,
			// 		updatedAt: new Date(),
			// 		id: createId(),
			// 	})
			// 	.returning('id')
			// 	.executeTakeFirst();
			// if (board)
			// 	await db
			// 		.insertInto('Column')
			// 		.values(
			// 			input.columns
			// 				.filter((column) => column.length !== 0)
			// 				.map((column, index) => ({
			// 					boardId: board.id,
			// 					name: column,
			// 					id: createId(),
			// 					updatedAt: new Date(),
			// 					order: index,
			// 				}))
			// 		)
			// 		.execute();
		}),
	getById: protectedProcedure
		.input(z.object({ id: z.string().cuid2() }))
		.query(async ({ ctx: { prisma }, input }) => {
			return await prisma.board.findUnique({
				where: { id: input.id },
				select: {
					id: true,
					name: true,
					columns: {
						select: {
							id: true,
							name: true,
							order: true,
							tasks: {
								select: {
									id: true,
									title: true,
								},
								orderBy: {
									order: 'asc',
								},
							},
						},
						orderBy: {
							order: 'asc',
						},
					},
				},
			});
		}),
});
