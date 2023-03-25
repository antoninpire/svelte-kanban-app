<script lang="ts">
	import X from '$lib/components/icons/X.svelte';

	export let checked = false;
	export let value: string;
	export let id: string;
	export let onClickDelete: Function;
</script>

<div class="my-1 flex items-center justify-between">
	<div class="flex w-full items-center gap-3">
		<input
			type="checkbox"
			bind:checked
			class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 ring-offset-gray-800 focus:ring-2 focus:ring-blue-600"
		/>
		<input
			{id}
			class="w-full bg-transparent text-gray-300 outline-none"
			bind:value
			placeholder="Replace the blue color with a darker one"
		/>
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		on:click={() => onClickDelete()}
		class="flex items-center justify-center rounded p-1 hover:cursor-pointer hover:bg-transparent/10"
	>
		<X size="20" />
	</div>
</div>
