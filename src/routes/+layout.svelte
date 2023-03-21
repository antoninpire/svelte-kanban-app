<script lang="ts">
	import { page } from '$app/stores';
	import { trpc } from '$lib/trpc';
	import { handleSession } from '@lucia-auth/sveltekit/client';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.css';
	import type { LayoutData } from './$types';

	handleSession(page);

	export let data: LayoutData;

	const queryClient = trpc.hydrateQueryClient(data.trpc);
</script>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
