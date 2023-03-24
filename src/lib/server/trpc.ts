import { transformer } from '$lib/trpc/transformer';
import { TRPCError, initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import { prisma } from '../db/prisma';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({
	transformer,
	errorFormatter: ({ shape, error }) => {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
						? error.cause.flatten()
						: null,
			},
		};
	},
});

export const router = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.session || !ctx.session.userId) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
	return next({
		ctx: {
			// infers the `session` as non-nullable
			session: { ...ctx.session, user: ctx.session.userId },
			prisma,
		},
	});
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
