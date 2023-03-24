<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import X from '$lib/components/icons/X.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { addBoardSchema } from '$lib/schemas/add-board-schema';
	import { showAddBoardModal } from '$lib/stores/modals';
	import { trpc } from '$lib/trpc';
	import type { typeToFlattenedError, z } from 'zod';

	type Form = z.infer<typeof addBoardSchema>;

	let form: Form = {
		columns: [''],
		name: '',
	};

	let errors: typeToFlattenedError<Form, string> | null | undefined;

	const addBoard = trpc.board.add.mutation({
		onSuccess() {
			trpc.board.getAllNames.utils.invalidate();
			showAddBoardModal.set(false);
			form = {
				columns: [''],
				name: '',
			};
		},
		onError(error) {
			errors = error.data?.zodError;
		},
	});

	function addColumn() {
		if (form.columns.length >= 6) return;
		form.columns = [...form.columns, ''];
	}

	function removeColumnAtIndex(index: number) {
		if (index < form.columns.length)
			form.columns = form.columns.filter((_, i) => index !== i);
	}

	async function createBoard() {
		await $addBoard.mutateAsync({
			...form,
		});
	}
</script>

<Modal bind:showModal={$showAddBoardModal} className="w-[32em]">
	<h2 slot="header">Create a Board</h2>

	<div class="flex flex-col gap-5">
		<div class="text-gray-300">
			<fieldset class="flex flex-col gap-2">
				<label class="ml-1" for="board-name">Name of Board</label>
				<Input
					id="board-name"
					placeholder="XYZ Project"
					bind:value={form.name}
				/>
				{#if errors?.fieldErrors.name}
					<small class="text-red-500">{errors?.fieldErrors.name}</small>
				{/if}
			</fieldset>
		</div>

		<div class="flex flex-col gap-2">
			{#each form.columns as _, index}
				<div class="flex items-center gap-1 px-1">
					<Input
						placeholder="Work on Branding"
						bind:value={form.columns[index]}
					/>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="rounded p-1 text-white hover:cursor-pointer hover:bg-transparent/20"
						on:click={() => removeColumnAtIndex(index)}
					>
						<X />
					</div>
				</div>
			{/each}
			<div class="h-1" />
			<Button on:click={addColumn} disabled={form.columns.length >= 6}>
				Add Column
				<span class="text-sm">(max 6)</span>
			</Button>
		</div>
	</div>
	<div class="h-1" />
	<Button
		slot="footer"
		on:click={createBoard}
		disabled={$addBoard.isLoading}
		variant="light"
		size="lg">{$addBoard.isLoading ? 'Loading...' : 'Create'}</Button
	>
</Modal>
