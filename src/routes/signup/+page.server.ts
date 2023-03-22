import { auth } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	email: z.string().email('Email is not valid !'),
	password: z.string().min(5, 'Password must be at least 5 characters'),
});

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, schema);
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, schema);

		if (!form.valid) return fail(400, { form });

		try {
			const user = await auth.createUser({
				primaryKey: {
					providerId: 'email',
					providerUserId: form.data.email,
					password: form.data.password,
				},
				attributes: {
					email: form.data.email,
				},
			});
			const session = await auth.createSession(user.userId);
			event.locals.setSession(session);
		} catch (err) {
			// if (err instanceof LuciaError) console.error(err.message);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			if (err?.message?.includes('duplicate'))
				return fail(401, { errorMessage: 'Username already taken !', form });
			return fail(400, {
				errorMessage: 'Unknown error while signing up',
				form,
			});
		}
		return { form, errorMessage: undefined };
	},
};
