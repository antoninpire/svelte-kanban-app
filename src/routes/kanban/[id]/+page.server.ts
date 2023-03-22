import { trpc } from '$lib/trpc';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await trpc.board.getAllNames.ssr(event);
	if (event.params.id)
		await trpc.board.getById.ssr({ id: event.params.id }, event);
};
