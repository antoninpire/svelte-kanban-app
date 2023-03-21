import { auth } from '$lib/server/lucia';
import { handleHooks } from '@lucia-auth/sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

export const customHandle: Handle = async ({ resolve, event }) => {
	const PUBLIC_ROUTES = ['login', 'signup'];
	const PRIVATE_ROUTES = ['kanban'];

	const session = await event.locals.validate();

	if (
		!session &&
		PRIVATE_ROUTES.some((route) => event.url.pathname.startsWith(`/${route}`))
	)
		throw redirect(303, '/login');
	// Redirect if attempt to access public route while logged in
	else if (
		!!session &&
		(event.url.pathname === '/' ||
			PUBLIC_ROUTES.some((route) => event.url.pathname.startsWith(`/${route}`)))
	)
		throw redirect(303, '/kanban');
	return resolve(event);
};

export const handle: Handle = sequence(handleHooks(auth), customHandle);
