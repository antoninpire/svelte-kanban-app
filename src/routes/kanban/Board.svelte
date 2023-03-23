<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { trpc } from '$lib/trpc';
	import Column from './Column.svelte';

	const getByIdQuery = trpc.board.getById.query(
		{ id: $page.params.id ?? '' },
		{ enabled: !!$page.params.id }
	);
</script>

<div class="no-scrollbar h-full w-full overflow-x-scroll py-6 text-gray-300">
	{#if $getByIdQuery.isLoading}
		<Loader />
	{:else if !$page.params.id}
		<div class="flex h-full w-full items-center justify-center text-gray-300">
			<div class="flex items-center gap-3">
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><line x1="19" y1="12" x2="5" y2="12" /><polyline
							points="12 19 5 12 12 5"
						/></svg
					>
					<p>Open a board on the left</p>
				</div>
				<p class="uppercase">or</p>
				<div class="flex items-center justify-center">
					<Button>Add a Board</Button>
				</div>
			</div>
		</div>
	{:else}
		<!-- {JSON.stringify($getByIdQuery.data)} -->
		{#each $getByIdQuery.data?.columns ?? [] as column}
			<Column {column} />
		{/each}
	{/if}
</div>
