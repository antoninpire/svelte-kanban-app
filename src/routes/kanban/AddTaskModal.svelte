<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import X from '$lib/components/icons/X.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SPopover from '$lib/components/SPopover/SPopover.svelte';
	import type { addTaskSchema } from '$lib/schemas/add-task-schema';
	import { showAddTaskModal } from '$lib/stores/modals';
	import { trpc } from '$lib/trpc';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { typeToFlattenedError, z } from 'zod';

	type Form = z.infer<typeof addTaskSchema>;

	let form: Form = {
		columnId: '',
		subTasks: [],
		title: '',
		endsAt: null,
		tags: [],
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
				tags: [],
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

	function handleToggleTag(tag: { label: string; color: string; id: string }) {
		const t = form.tags.find((t) => t.id === tag.id);
		if (!!t) form.tags = form.tags.filter((t) => t.id !== tag.id);
		else {
			form.tags.push(tag);
			form = form;
		}
	}

	async function createTask() {
		if (!form.columnId) return;
		await $addTask.mutateAsync({
			...form,
			subTasks: form.subTasks.filter((subTask) => subTask.length !== 0),
		});
	}

	onDestroy(unsubscribe);

	$: getTagsQuery = trpc.tag.getByBoardId.query(
		{
			boardId: $page.params.id ?? '',
		},
		{
			enabled: !!$page.params.id,
		}
	);
</script>

<Modal bind:showModal={$showAddTaskModal.isOpen} className="w-[32em]">
	<h2 slot="header">Create a Task</h2>

	<div class="flex flex-col gap-5">
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
				<label class="ml-1" for="task-name">Name</label>
				<Input id="task-name" placeholder="UI refine" bind:value={form.title} />
			</fieldset>
			{#if errors?.fieldErrors.title}
				<small class="text-red-500">{errors?.fieldErrors.title}</small>
			{/if}
		</div>

		<div>
			<span class="ml-1 text-gray-300">Tags</span>
			<div class="flex flex-wrap items-center gap-2 px-4 py-2">
				{#each form.tags as tag}
					<div
						class="flex items-center justify-center gap-1 rounded-3xl px-3 py-1 text-black"
						style={`background-color: ${tag.color};`}
					>
						{tag.label}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="hover:cursor-pointer"
							on:click={() => handleToggleTag(tag)}
						>
							<X size="20" />
						</div>
					</div>
				{/each}
			</div>
			<div class="flex items-center justify-center">
				<SPopover position="bottom-end">
					<div slot="target">
						<Button>
							<Plus size="18" />
							Add Tag
						</Button>
					</div>
					<div
						class="flex w-[12rem] flex-col bg-background text-sm text-gray-300 brightness-110"
						transition:fade={{ duration: 250 }}
						slot="content"
					>
						{#each $getTagsQuery.data ?? [] as tag}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								on:click={() => handleToggleTag(tag)}
								class={`flex w-full items-center gap-1 px-2 py-2 hover:cursor-pointer hover:bg-white/5 ${
									!!form.tags.find((t) => t.id === tag.id) ? 'bg-white/5' : ''
								}`}
							>
								<div
									class="flex items-center justify-center rounded-3xl px-4 py-1.5 text-black"
									style={`background-color: ${tag.color};`}
								>
									{tag.label}
								</div>
							</div>
						{/each}
					</div>
				</SPopover>
			</div>
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
