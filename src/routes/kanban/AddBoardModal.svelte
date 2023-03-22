<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { showAddBoardModal } from '$lib/stores/modals';
	import { trpc } from '$lib/trpc';

	let name = '';
	let columns: string[] = [''];

	const addBoard = trpc.board.add.mutation({
		onSuccess() {
			trpc.board.getAllNames.utils.invalidate();
			showAddBoardModal.set(false);
			name = '';
			columns = [''];
		},
		onError(error) {
			console.error(error);
		},
	});

	function addColumn() {
		if (columns.length >= 6) return;
		columns = [...columns, ''];
	}

	function removeColumnAtIndex(index: number) {
		if (index < columns.length) columns = columns.filter((_, i) => index !== i);
	}

	async function createBoard() {
		await $addBoard.mutateAsync({
			name,
			columns,
		});
	}
</script>

<Modal bind:showModal={$showAddBoardModal}>
	<h2 slot="header">Create a Board</h2>

	<div class="flex flex-col gap-5">
		<div class="text-gray-300">
			<fieldset class="flex flex-col gap-2">
				<label class="ml-1" for="folder-name">Name of Board</label>
				<Input placeholder="XYZ Project" name="label" bind:value={name} />
				<span class="pl-2 text-sm text-gray-300">Max. 75 chars</span>
			</fieldset>
		</div>

		<div class="flex flex-col gap-2">
			{#each columns as _, index}
				<div class="flex items-center gap-1">
					<Input placeholder="Work on Branding" bind:value={columns[index]} />
					<Tooltip label="Remove column">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="rounded p-1 text-white hover:cursor-pointer hover:bg-transparent/20"
							on:click={() => removeColumnAtIndex(index)}
						>
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
								><line x1="18" y1="6" x2="6" y2="18" /><line
									x1="6"
									y1="6"
									x2="18"
									y2="18"
								/></svg
							>
						</div>
					</Tooltip>
				</div>
			{/each}
			<Button on:click={addColumn} disabled={columns.length >= 6}
				>Add Column
				<span class="text-sm">(max 6)</span></Button
			>
		</div>
	</div>

	<Button
		slot="footer"
		variant="light"
		on:click={createBoard}
		disabled={$addBoard.isLoading}
		>{$addBoard.isLoading ? 'Loading...' : 'Create'}</Button
	>
</Modal>
