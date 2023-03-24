import { z } from 'zod';

export const addTaskSchema = z.object({
	title: z
		.string()
		.min(3, 'Must be at least 3 characters')
		.max(75, 'Must be at most 75 characters'),
	subTasks: z.string().array(),
	columnId: z.string(),
	description: z.string().optional(),
	endsAt: z.date().nullable(),
});
