import { z } from 'zod';

export const addColumnSchema = z.object({
	name: z.string().min(1, 'Must be at least one character'),
	order: z.number(),
	boardId: z.string(),
});
