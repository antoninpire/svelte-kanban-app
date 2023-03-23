<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { showAddTaskColumnId, showAddTaskModal } from '$lib/stores/modals';
	import { trpc } from '$lib/trpc';

	let title = '';
	let columnId = $showAddTaskColumnId;
	let subTasks: string[] = [];
	let description = '';
	let endsAt: Date | undefined;

	const addTask = trpc.task.add.mutation({
		onSuccess() {
			if ($page.params.id)
				trpc.board.getById.utils.invalidate({ id: $page.params.id });
			showAddTaskModal.set(false);
			title = '';
			subTasks = [''];
			showAddTaskColumnId.set(undefined);
			columnId = undefined;
			description = '';
			endsAt = undefined;
		},
		onError(error) {
			console.error(error);
		},
	});

	const getByIdQuery = trpc.board.getById.query(
		{ id: $page.params.id ?? '' },
		{ enabled: !!$page.params.id }
	);

	function addSubTask() {
		if (subTasks.length >= 6) return;
		subTasks = [...subTasks, ''];
	}

	function removeSubTaskAtIndex(index: number) {
		if (index < subTasks.length)
			subTasks = subTasks.filter((_, i) => index !== i);
	}

	async function createTask() {
		if (columnId)
			await $addTask.mutateAsync({
				columnId,
				endsAt: endsAt ? new Date(endsAt) : undefined,
				description,
				title,
				subTasks,
			});
	}
</script>

<Modal bind:showModal={$showAddTaskModal} className="w-[32em]">
	<h2 slot="header">Create a Task</h2>

	<div class="flex flex-col gap-5">
		<div class="text-gray-300">
			<fieldset class="flex flex-col gap-2">
				<label class="ml-1" for="column-id">Column</label>
				<select
					id="column-id"
					class="w-full rounded border border-gray-700 bg-transparent py-2 px-2 text-sm text-gray-300 outline-none"
					bind:value={columnId}
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
				<Input id="task-name" placeholder="XYZ Project" bind:value={title} />
				<span class="pl-2 text-sm text-gray-300">Max. 75 chars</span>
			</fieldset>
		</div>

		<div class="text-gray-300">
			<fieldset class="flex flex-col gap-2">
				<label class="ml-1" for="task-description">Description of Task</label>
				<textarea
					id="task-description"
					placeholder="XYZ Project"
					class="min-h-[8rem] w-full rounded border border-gray-700 bg-transparent py-2 px-2 text-sm text-gray-300 outline-none"
					bind:value={description}
				/>
			</fieldset>
		</div>

		<div class="text-gray-300">
			<fieldset class="flex flex-col gap-2">
				<label class="ml-1" for="task-ends-at"
					>End of Task<span class="text-sm text-gray-400">(optional)</span
					></label
				>
				<input
					id="task-ends-at"
					type="date"
					class="w-full rounded border border-gray-700 bg-transparent py-2 px-2 text-sm text-gray-300 outline-none"
					bind:value={endsAt}
				/>
			</fieldset>
		</div>

		<div class="flex flex-col gap-2">
			{#each subTasks as _, index}
				<div class="flex items-center gap-1">
					<Input placeholder="Work on Branding" bind:value={subTasks[index]} />
					<Tooltip label="Remove Subtask">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="rounded p-1 text-white hover:cursor-pointer hover:bg-transparent/20"
							on:click={() => removeSubTaskAtIndex(index)}
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
			<Button on:click={addSubTask} disabled={subTasks.length >= 6}
				>Add Subtask
				<span class="text-sm">(max 6)</span></Button
			>
		</div>
	</div>

	<Button
		slot="footer"
		variant="light"
		on:click={createTask}
		disabled={$addTask.isLoading}
		>{$addTask.isLoading ? 'Loading...' : 'Create'}</Button
	>
</Modal>
