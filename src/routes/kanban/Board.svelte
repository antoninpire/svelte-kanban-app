<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import LeftArrow from '$lib/components/icons/LeftArrow.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import SideSheet from '$lib/components/SideSheet.svelte';
	import { showAddBoardModal, showAddColumnModal } from '$lib/stores/modals';
	import { trpc } from '$lib/trpc';
	import type { AfterNavigate } from '@sveltejs/kit';
	import Column from './Column.svelte';

	let getByIdQuery = trpc.board.getById.query(
		{ id: $page.params.id ?? '' },
		{ enabled: !!$page.params.id }
	);
	let open = false;

	afterNavigate(handleAfterNavigate);

	function handleClickAddBoard() {
		showAddBoardModal.set(true);
	}

	function handleAfterNavigate(navigation: AfterNavigate) {
		getByIdQuery = trpc.board.getById.query(
			{ id: navigation.to?.params?.id ?? '' },
			{ enabled: !!navigation.to?.params?.id }
		);
	}

	function handleClickAddColunm() {
		showAddColumnModal.set({
			isOpen: true,
			order: 0,
		});
	}
</script>

<div
	class="no-scrollbar flex h-full w-full gap-24 overflow-x-scroll py-6 text-gray-300"
>
	{#if $page.params.id && $getByIdQuery.isLoading}
		<Loader />
	{:else if !$page.params.id}
		<div class="flex h-full w-full items-center justify-center text-gray-300">
			<div class="flex items-center gap-3">
				<div class="flex items-center">
					<LeftArrow />
					<p>Open a board on the left</p>
				</div>
				<p class="text-xl font-bold uppercase">or</p>
				<div class="flex items-center justify-center">
					<Button on:click={handleClickAddBoard}>Add a Board</Button>
				</div>
			</div>
		</div>
	{:else if !$getByIdQuery.data?.columns?.length}
		<div class="flex h-full w-full items-center justify-center text-gray-300">
			<div class="flex items-center justify-center">
				<Button on:click={handleClickAddColunm}>Add a Column</Button>
			</div>
		</div>
	{:else}
		<Button
			on:click={() => {
				open = true;
			}}>Open</Button
		>

		<div />
		{#each $getByIdQuery.data.columns as column}
			<Column {column} />
		{/each}
	{/if}
</div>

<SideSheet bind:open />
