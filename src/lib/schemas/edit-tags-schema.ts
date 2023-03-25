import { z } from 'zod';

export const editTagsSchema = z.object({
	tags: z
		.object({
			label: z.string().min(1, 'Must be at least 1 character'),
			color: z.string(),
		})
		.array(),
});
