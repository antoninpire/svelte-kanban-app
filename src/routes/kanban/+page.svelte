<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import LeftArrow from '$lib/components/icons/LeftArrow.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import { showAddBoardModal } from '$lib/stores/modals';

	function handleClickAddBoard() {
		showAddBoardModal.set(true);
	}
</script>

<div class="flex h-full w-full items-center justify-center text-gray-300">
	<div class="flex items-center gap-3">
		<div class="flex items-center gap-1">
			<LeftArrow />
			<p>Open a board on the left</p>
		</div>
		<p class="text-xl font-bold uppercase">or</p>
		<div class="flex items-center justify-center">
			<Button on:click={handleClickAddBoard}>
				<Plus size="16" />
				Add a Board
			</Button>
		</div>
	</div>
</div>

<svelte:head>
	<title>Kanban</title>
</svelte:head>
