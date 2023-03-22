import { db } from '$lib/db';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

const addSchema = z.object({
	name: z
		.string()
		.min(3, 'Must be at least 3 characters')
		.max(75, 'Must be at most 75 characters'),
	columns: z.string().array().min(1, 'Must have at least one column'),
});

export const boardRouter = router({
	getAllNames: protectedProcedure.query(async ({ ctx }) => {
		return await db
			.selectFrom('Board')
			.select(['name', 'id'])
			.where('userId', '=', ctx.session.userId)
			.execute();
	}),
	add: protectedProcedure
		.input(addSchema)
		.mutation(async ({ ctx: { session }, input }) => {
			const board = await db
				.insertInto('Board')
				.values({
					name: input.name,
					userId: session.userId,
					updatedAt: new Date(),
					id: createId(),
				})
				.returning('id')
				.executeTakeFirst();
			if (board)
				await db
					.insertInto('Column')
					.values(
						input.columns
							.filter((column) => column.length !== 0)
							.map((column, index) => ({
								boardId: board.id,
								name: column,
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
			// console.log('ID', input.id);
			// const result = await db
			// 	.selectFrom('Board')
			// 	.innerJoinLateral('Column', (cb) =>
			// 		cb.on('Column.boardId', '=', 'Board.id')
			// 	)
			// 	.innerJoinLateral('Task', (tb) =>
			// 		tb.on('Task.columnId', '=', 'Column.id')
			// 	)
			// 	.where('Board.id', '=', input.id)
			// 	.distinctOn('Board.id')
			// 	.selectAll()
			// 	.executeTakeFirst();

			// console.log('RESULT', result);
			// return result;
			return await prisma.board.findUnique({
				where: { id: input.id },
				select: {
					id: true,
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
