import { auth } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	email: z.string().email('Not a valid email !'),
	password: z.string(),
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
			const key = await auth.useKey(
				'email',
				form.data.email,
				form.data.password
			);
			const session = await auth.createSession(key.userId);
			event.locals.setSession(session);
		} catch (err) {
			if (err instanceof LuciaError) {
				if (err.message === 'AUTH_INVALID_PASSWORD')
					return fail(400, {
						errorMessage: 'The password is incorrect !',
						form,
					});
				else if (err.message === 'AUTH_INVALID_KEY_ID')
					return fail(400, {
						errorMessage: "This email doesn't exist !",
						form,
					});
				else
					return fail(400, {
						errorMessage: 'Unknown error while logging in',
						form,
					});
			}

			return fail(400, { errorMessage: 'Could not login user.' });
		}
		return { form, errorMessage: undefined };
	},
};
