import { z } from 'zod';

export const addBoardSchema = z.object({
	name: z
		.string()
		.min(3, 'Must be at least 3 characters')
		.max(75, 'Must be at most 75 characters'),
	columns: z.string().array().min(1, 'Must have at least one column'),
});
