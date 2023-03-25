<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import RightArrow from '$lib/components/icons/RightArrow.svelte';
	import Save from '$lib/components/icons/Save.svelte';
	import X from '$lib/components/icons/X.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import SideSheet from '$lib/components/SideSheet.svelte';
	import SPopover from '$lib/components/SPopover/SPopover.svelte';
	import type { editTaskSchema } from '$lib/schemas/edit-task-schema';
	import { showEditTaskSheet } from '$lib/stores/sheets';
	import { trpc } from '$lib/trpc';
	import { afterUpdate } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { typeToFlattenedError, z } from 'zod';
	import SubTask from './SubTask.svelte';

	type Form = z.infer<typeof editTaskSchema>;

	let form: Form = {
		subTasks: [],
		title: '',
		endsAt: null,
		tags: [],
	};

	let taskPopoverVisible = false;
	let errors: typeToFlattenedError<Form, string> | null | undefined;
	let previousSubTasksLength = 0;

	const updateMutation = trpc.task.update.mutation({
		onSuccess() {
			if ($page.params.id)
				trpc.board.getById.utils.invalidate({ id: $page.params.id });
			handleCloseSheet();
		},
		onError(error) {
			errors = error.data?.zodError;
		},
	});

	const parentElementId = `edit-task-parent-element`;

	function handleCloseSheet() {
		$getTaskByIdQuery.refetch();
		showEditTaskSheet.set({
			isOpen: false,
			taskId: undefined,
		});
	}

	function handleClickAddSubTask() {
		const maxOrder = form.subTasks.length
			? Math.max(...form.subTasks.map((subTask) => subTask.order))
			: 0;

		form.subTasks = [
			...form.subTasks,
			{
				achieved: false,
				name: '',
				order: maxOrder + 1,
			},
		];
	}

	function handleClickDeleteSubTask(index: number) {
		form.subTasks = form.subTasks.filter((_, i) => i !== index);
	}

	async function handleClickSave() {
		if ($showEditTaskSheet.taskId)
			await $updateMutation.mutateAsync({
				...form,
				id: $showEditTaskSheet.taskId,
			});
	}

	function handleToggleTag(tag: { label: string; color: string; id: string }) {
		const t = form.tags.find((t) => t.id === tag.id);
		if (!!t) form.tags = form.tags.filter((t) => t.id !== tag.id);
		else {
			form.tags.push(tag);
			form = form;
		}
	}

	afterUpdate(() => {
		if (previousSubTasksLength !== form.subTasks.length) {
			const parent = document.getElementById(parentElementId);
			if (parent) parent.scrollTop = parent.scrollHeight;
			const input = document.getElementById(
				`edit-task-subtask-${form.subTasks.length - 1}`
			);
			input?.focus();
		}
	});

	function handleSetForm(f: Form) {
		form = f;
	}

	$: getTaskByIdQuery = trpc.task.getById.query(
		{ id: $showEditTaskSheet.taskId ?? '' },
		{
			enabled: !!$showEditTaskSheet.taskId,
			onSuccess(data) {
				handleSetForm({
					subTasks: data?.subTasks ?? [],
					title: data?.title ?? '',
					description: data?.description ?? '',
					endsAt: data?.endsAt ?? null,
					tags:
						data?.tagsByTasks.map((tag) => ({
							color: tag.tag.color,
							id: tag.tag.id,
							label: tag.tag.label,
						})) ?? [],
				});
				previousSubTasksLength = (data?.subTasks ?? []).length;
			},
		}
	);

	$: getTagsQuery = trpc.tag.getByBoardId.query(
		{
			boardId: $page.params.id ?? '',
		},
		{
			enabled: !!$page.params.id,
		}
	);
</script>

<SideSheet bind:open={$showEditTaskSheet.isOpen}>
	<div
		class="no-scrollbar flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll px-4 py-3 text-gray-300"
	>
		{#if $getTaskByIdQuery.isLoading}
			<Loader />
		{:else}
			<div
				class="sticky top-0 flex h-[7%] w-full max-w-full items-center justify-between border-b border-b-gray-500"
			>
				<div class="flex items-center pl-3">
					<Button
						isLoading={$updateMutation.isLoading}
						on:click={handleClickSave}
						size="lg"
					>
						<Save size="18" />
						Save
					</Button>
				</div>
				<div class="flex items-center gap-1">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						on:click={handleCloseSheet}
						class="rounded p-1 hover:cursor-pointer hover:bg-transparent/10"
					>
						<RightArrow />
					</div>
				</div>
			</div>
			<div
				id={parentElementId}
				class="no-scrollbar h-[88%] overflow-x-hidden overflow-y-scroll pt-4"
			>
				<div class="px-2">
					<input
						bind:value={form.title}
						class="w-full bg-transparent text-2xl font-bold text-white"
					/>
				</div>
				<div class="flex flex-col gap-4 pt-8">
					<div class="flex items-center pr-5">
						<span class="w-[30%] font-medium text-gray-500"> Due Date </span>
						<DatePicker bind:date={form.endsAt} />
					</div>
					<div class="flex items-center pr-5">
						<div class="flex w-[30%] items-center gap-5">
							<span class="font-medium text-gray-500"> Tags </span>
							<SPopover position="bottom-start">
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
												!!form.tags.find((t) => t.id === tag.id)
													? 'bg-white/5'
													: ''
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
						<div class="flex flex-wrap items-center gap-2">
							{#each form.tags as tag}
								<div
									class="flex items-center justify-center gap-1 rounded-3xl px-4 py-1.5 text-black"
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
					</div>
					<div class="flex flex-col gap-2">
						<label
							for="edit-task-description"
							class="w-[30%] font-medium text-gray-500"
						>
							Description
						</label>
						<textarea
							id="edit-task-description"
							placeholder="XYZ Project"
							class="min-h-[8rem] w-full rounded border border-gray-700 bg-transparent py-2 px-2 text-sm text-gray-300 outline-none"
							bind:value={form.description}
						/>
					</div>
					<div class="flex flex-col gap-2">
						<span class="w-[30%] font-medium text-gray-500"> Subtasks </span>
						<div class="flex flex-col gap-2 px-8">
							{#each form.subTasks as subTask, subTaskIndex}
								<SubTask
									id={`edit-task-subtask-${subTaskIndex}`}
									bind:checked={subTask.achieved}
									bind:value={subTask.name}
									onClickDelete={() => handleClickDeleteSubTask(subTaskIndex)}
								/>
							{/each}
						</div>
						<div class="flex items-center justify-center">
							<Button on:click={handleClickAddSubTask}>
								<Plus size="20" />
								Add Subtask
							</Button>
						</div>
						<div class="flex flex-col gap-1" />
					</div>
				</div>
			</div>
			<div class="flex h-[5%] items-center">
				<div class="flex flex-col gap-1">
					<small class="text-gray-500"
						>Created {$getTaskByIdQuery.data?.createdAt.toLocaleString()}</small
					>
					<small class="text-gray-500"
						>Updated {$getTaskByIdQuery.data?.updatedAt.toLocaleString()}</small
					>
				</div>
			</div>
		{/if}
	</div>
</SideSheet>
