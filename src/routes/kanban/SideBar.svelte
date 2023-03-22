<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { showAddBoardModal } from '$lib/stores/modals';

	import { trpc } from '$lib/trpc';
	import AddBoardModal from './AddBoardModal.svelte';

	const boards = trpc.board.getAllNames.query();

	function onClickAddBoard() {
		showAddBoardModal.set(true);
	}
</script>

<nav class="h-full w-full bg-white/5 px-4 pt-8">
	<div class="flex h-full flex-col justify-between">
		<h1 class="text-3xl font-bold text-white">Kanban</h1>
		<div class="flex h-[92%] flex-col justify-between">
			<h4 class="text-lg font-light uppercase text-gray-400">
				All Boards ({$boards.data?.length ?? 0})
			</h4>
			<div
				class="no-scrollbar h-full overflow-y-scroll py-6 px-4 text-gray-300"
			>
				{#if $boards.isLoading}
					<Loader />
				{:else if $boards.data?.length}
					<div class="flex flex-col gap-2">
						{#each $boards.data ?? [] as board}
							<a
								href={`/kanban/${board.id}`}
								class={`rounded-3xl px-3 py-2 hover:cursor-pointer hover:bg-white/5 ${
									!!$page.params.id && $page.params.id === board.id
										? 'bg-white/5'
										: ''
								}`}
							>
								{board.name}
							</a>
						{/each}
					</div>
				{:else}
					<div class="text-gray-300">No board</div>
				{/if}
				<div class="mt-4 flex items-center justify-center">
					<Button variant="light" on:click={onClickAddBoard}>
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
							><line x1="12" y1="5" x2="12" y2="19" /><line
								x1="5"
								y1="12"
								x2="19"
								y2="12"
							/></svg
						>
						Add Board
					</Button>
				</div>
			</div>
			<div class="flex h-[10vh] items-center justify-center">
				<Button variant="destructive">Logout</Button>
			</div>
		</div>
	</div>
</nav>

<AddBoardModal />
