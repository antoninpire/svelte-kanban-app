<script lang="ts">
	import { page } from '$app/stores';
	import { trpc } from '$lib/trpc';

	const getByIdQuery = trpc.board.getById.query(
		{ id: $page.params.id ?? '' },
		{ enabled: !!$page.params.id }
	);
</script>

<header class="h-full w-full bg-white/5 px-5 py-2 text-white">
	<div class="flex h-full items-center text-2xl font-bold">
		{$getByIdQuery.data?.name}
	</div>
</header>
