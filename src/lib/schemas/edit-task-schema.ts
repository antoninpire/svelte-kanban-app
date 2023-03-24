import { z } from 'zod';

export const editTaskSchema = z.object({
	title: z
		.string()
		.min(1, 'Must be at least 1 character')
		.max(75, 'Must be at most 75 characters'),
	description: z.string().optional(),
	subTasks: z
		.object({
			id: z.string().optional(),
			name: z.string(),
			order: z.number(),
			achieved: z.boolean(),
		})
		.array(),
	endsAt: z.date().nullable(),
});
