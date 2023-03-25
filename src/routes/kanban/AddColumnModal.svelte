<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { addColumnSchema } from '$lib/schemas/add-column-schema';
	import { showAddColumnModal } from '$lib/stores/modals';
	import { trpc } from '$lib/trpc';
	import { onDestroy } from 'svelte';
	import type { typeToFlattenedError, z } from 'zod';

	const schema = addColumnSchema.omit({ boardId: true });

	type Form = z.infer<typeof schema>;

	let form: Form = {
		name: '',
		order: 0,
	};

	const unsubscribe = showAddColumnModal.subscribe((value) => {
		form.order = value.order ?? 0;
	});

	let errors: typeToFlattenedError<Form, string> | null | undefined;

	const addColumn = trpc.column.add.mutation({
		onSuccess() {
			if ($page.params.id)
				trpc.board.getById.utils.invalidate({ id: $page.params.id });
			showAddColumnModal.set({
				isOpen: false,
			});
			form = {
				name: '',
				order: 0,
			};
		},
		onError(error) {
			errors = error.data?.zodError;
		},
	});

	async function createColumn() {
		if ($page.params.id)
			await $addColumn.mutateAsync({
				name: form.name,
				order: form.order + 1,
				boardId: $page.params.id,
			});
	}

	onDestroy(unsubscribe);

	$: getByIdQuery = trpc.board.getById.query(
		{ id: $page.params.id ?? '' },
		{ enabled: !!$page.params.id }
	);
</script>

<Modal bind:showModal={$showAddColumnModal.isOpen}>
	<h2 slot="header">Create a Column</h2>

	<div class="flex flex-col gap-5">
		<div class="text-gray-300">
			<fieldset class="flex flex-col gap-2">
				<label class="ml-1" for="column-order">Order</label>
				<select
					id="column-order"
					class="w-full rounded border border-gray-700 bg-transparent py-2 px-2 text-sm text-gray-300 outline-none"
					bind:value={form.order}
				>
					<option
						value={!$getByIdQuery.data?.columns?.length
							? 0
							: Math.min(
									...$getByIdQuery.data.columns.map((column) => column.order)
							  ) - 1}>Beginning</option
					>
					{#each $getByIdQuery.data?.columns ?? [] as column}
						<option value={column.order}>After {column.name}</option>
					{/each}
				</select>
			</fieldset>
		</div>

		<div class="text-gray-300">
			<fieldset class="flex flex-col gap-2">
				<label class="ml-1" for="board-name">Name of Column</label>
				<Input id="board-name" placeholder="Backlog" bind:value={form.name} />
				{#if errors?.fieldErrors.name}
					<small class="text-red-500">{errors?.fieldErrors.name}</small>
				{/if}
			</fieldset>
		</div>
	</div>

	<Button
		slot="footer"
		on:click={createColumn}
		isLoading={$addColumn.isLoading}
		variant="light"
		size="lg"
	>
		Create
	</Button>
</Modal>
