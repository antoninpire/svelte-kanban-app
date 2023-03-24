<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import X from '$lib/components/icons/X.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { addTaskSchema } from '$lib/schemas/add-task-schema';
	import { showAddTaskModal } from '$lib/stores/modals';
	import { trpc } from '$lib/trpc';
	import { onDestroy } from 'svelte';
	import type { typeToFlattenedError, z } from 'zod';

	type Form = z.infer<typeof addTaskSchema>;

	let form: Form = {
		columnId: '',
		subTasks: [],
		title: '',
		endsAt: null,
	};

	const unsubscribe = showAddTaskModal.subscribe((value) => {
		form.columnId = value.columnId ?? '';
	});

	let errors: typeToFlattenedError<Form, string> | null | undefined;

	const addTask = trpc.task.add.mutation({
		onSuccess() {
			if ($page.params.id)
				trpc.board.getById.utils.invalidate({ id: $page.params.id });
			form = {
				columnId: $showAddTaskModal.columnId ?? '',
				subTasks: [],
				title: '',
				endsAt: null,
			};
			showAddTaskModal.set({
				isOpen: false,
			});
		},
		onError(err) {
			errors = err.data?.zodError;
		},
	});

	const getByIdQuery = trpc.board.getById.query(
		{ id: $page.params.id ?? '' },
		{ enabled: !!$page.params.id }
	);

	function addSubTask() {
		if (form.subTasks.length >= 6) return;
		form.subTasks = [...form.subTasks, ''];
	}

	function removeSubTaskAtIndex(index: number) {
		if (index < form.subTasks.length)
			form.subTasks = form.subTasks.filter((_, i) => index !== i);
	}

	async function createTask() {
		if (!form.columnId) return;
		await $addTask.mutateAsync({
			...form,
			subTasks: form.subTasks.filter((subTask) => subTask.length !== 0),
		});
	}

	onDestroy(unsubscribe);
</script>

<Modal bind:showModal={$showAddTaskModal.isOpen} className="w-[32em]">
	<h2 slot="header">Create a Task</h2>

	<div class="flex flex-col gap-5" on:submit|preventDefault={createTask}>
		<div class="text-gray-300">
			<fieldset class="flex flex-col gap-2">
				<label class="ml-1" for="column-id">Column</label>
				<select
					id="column-id"
					class="w-full rounded border border-gray-700 bg-transparent py-2 px-2 text-sm text-gray-300 outline-none"
					bind:value={form.columnId}
				>
					{#each $getByIdQuery.data?.columns ?? [] as column}
						<option value={column.id}>{column.name}</option>
					{/each}
				</select>
			</fieldset>
		</div>

		<div class="text-gray-300">
			<fieldset class="flex flex-col gap-2">
				<label class="ml-1" for="task-name">Name of Task</label>
				<Input id="task-name" placeholder="UI refine" bind:value={form.title} />
			</fieldset>
			{#if errors?.fieldErrors.title}
				<small class="text-red-500">{errors?.fieldErrors.title}</small>
			{/if}
		</div>

		<div class="text-gray-300">
			<fieldset class="flex flex-col gap-2">
				<label class="ml-1" for="task-description">
					Description
					<span class="ml-1 text-sm text-gray-400"> (optional) </span>
				</label>
				<textarea
					id="task-description"
					placeholder="Improve the UI on the dashboard panel"
					class="min-h-[8rem] w-full rounded border border-gray-700 bg-transparent py-2 px-2 text-sm text-gray-300 outline-none"
					bind:value={form.description}
				/>
			</fieldset>
			{#if errors?.fieldErrors.description}
				<small class="text-red-500">{errors?.fieldErrors.description}</small>
			{/if}
		</div>

		<div class="text-gray-300">
			<fieldset class="flex flex-col gap-2">
				<span class="ml-1">
					Due At
					<span class="ml-1 text-sm text-gray-400">(optional)</span>
				</span>
				<DatePicker bind:date={form.endsAt} />
			</fieldset>
		</div>

		<div class="flex flex-col gap-2">
			{#each form.subTasks as _, index}
				<div class="flex items-center gap-1">
					<Input
						placeholder="Work on Branding"
						bind:value={form.subTasks[index]}
					/>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="rounded p-1 text-white hover:cursor-pointer hover:bg-transparent/20"
						on:click={() => removeSubTaskAtIndex(index)}
					>
						<X />
					</div>
				</div>
			{/each}
			<Button on:click={addSubTask} disabled={form.subTasks.length >= 6}
				>Add Subtask
				<span class="text-sm">(max 6)</span></Button
			>
		</div>
	</div>
	<Button
		slot="footer"
		variant="light"
		size="lg"
		on:click={createTask}
		isLoading={$addTask.isLoading}
	>
		Create
	</Button>
</Modal>
