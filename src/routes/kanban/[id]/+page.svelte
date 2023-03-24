<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import LeftArrow from '$lib/components/icons/LeftArrow.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { showAddBoardModal } from '$lib/stores/modals';
	import { trpc } from '$lib/trpc';
	import Board from '../Board.svelte';

	function handleClickAddBoard() {
		showAddBoardModal.set(true);
	}

	$: getByIdQuery = trpc.board.getById.query(
		{ id: $page.params.id ?? '' },
		{
			enabled: !!$page.params.id,
		}
	);
</script>

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
{:else if $getByIdQuery.data}
	<Board board={$getByIdQuery.data} />
{/if}

<svelte:head>
	<title>Kanban</title>
</svelte:head>
