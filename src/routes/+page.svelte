<script lang="ts">
	import { trpc } from '$lib/trpc';

	const exampleQuery = trpc.getAll.query();
	const exampleMutation = trpc.createExample.mutation();

	let name: string;

	async function handleCreateMutation() {
		if (!name?.length) return;
		console.log(name);
		await $exampleMutation.mutateAsync({ name });
		$exampleQuery.refetch();
	}
</script>

<div>
	<!-- flex h-screen w-screen items-center justify-center bg-black -->
	<!-- <h1 class="text-7xl font-bold text-white">Kanban App</h1> -->
	<div>
		<input bind:value={name} type="text" name="name" placeholder="Name" />
		<button on:click={handleCreateMutation}>Create Example</button>
	</div>
	{#each $exampleQuery.data ?? [] as example}
		<p>{example.id}</p>
		<p>{example.name}</p>
	{/each}
</div>
