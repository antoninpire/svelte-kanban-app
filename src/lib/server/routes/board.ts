import { db } from '$lib/db';
import { addBoardSchema } from '$lib/schemas/add-board-schema';
import { TRPCError } from '@trpc/server';
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
		}),
	getById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx: { prisma }, input }) => {
			const board = await prisma.board.findUnique({
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
									columnId: true,
									order: true,
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

			if (!board)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'The board does not exist !',
				});

			return board;
		}),
});
