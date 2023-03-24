<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import { showAddColumnModal } from '$lib/stores/modals';
	import type { RouterOutputs } from '$lib/trpc';
	import Column from './Column.svelte';
	import EditTaskSheet from './EditTaskSheet.svelte';

	export let board: RouterOutputs['board']['getById'];

	function handleClickAddColunm() {
		showAddColumnModal.set({
			isOpen: true,
			order: 0,
		});
	}
</script>

<div class="">
	{#if !board.columns?.length}
		<div class="flex h-[90vh] w-full items-center justify-center text-gray-300">
			<div class="flex items-center justify-center">
				<Button on:click={handleClickAddColunm}>
					<Plus size="16" />
					Add a Column
				</Button>
			</div>
		</div>
	{:else}
		<div
			class="no-scrollbar flex h-full w-full gap-24 overflow-x-scroll py-6 text-gray-300"
		>
			<div />
			{#each board.columns as column (column.id)}
				<Column {column} />
			{/each}
		</div>
	{/if}
</div>

<!-- {#if $showEditTaskSheet.isOpen} -->
<EditTaskSheet />
<!-- {/if} -->
