<script lang="ts">
	import { trpc } from '$lib/trpc';
	import { getUser } from '@lucia-auth/sveltekit/client';

	const user = getUser();
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
	<div>
		<input bind:value={name} type="text" name="name" placeholder="Name" />
		<button on:click={handleCreateMutation}>Create Example</button>
	</div>
	{#each $exampleQuery.data ?? [] as example}
		<p>{example.id}</p>
		<p>{example.name}</p>
	{/each}

	<p>User id: {$user?.userId}</p>
	<p>Username: {$user?.email}</p>

	<form method="post">
		<button
			formaction="/logout"
			type="submit"
			class="mx-3 rounded bg-red-500 p-2 text-white"
		>
			Logout
		</button>
	</form>
</div>
