<script lang="ts">
	import { page } from '$app/stores';
	import Edit from '$lib/components/icons/Edit.svelte';
	import Trash from '$lib/components/icons/Trash.svelte';
	import { showEditTaskSheet } from '$lib/stores/sheets';
	import { trpc, type RouterOutputs } from '$lib/trpc';

	export let task: RouterOutputs['board']['getById']['columns'][number]['tasks'][number];

	const deleteMutation = trpc.task.delete.mutation({
		onSuccess() {
			if ($page.params.id)
				trpc.board.getById.utils.invalidate({ id: $page.params.id });
		},
	});

	function handleClickEdit() {
		showEditTaskSheet.set({
			isOpen: true,
			taskId: task.id,
		});
	}

	function handleClickDelete() {
		if (
			typeof window !== 'undefined' &&
			window.confirm('Are you sure you want to delete that task ?')
		)
			$deleteMutation.mutate({ id: task.id });
	}

	$: amountOfAchievedTasks = task.subTasks.filter(
		(subTask) => subTask.achieved
	).length;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="flex min-h-[10rem] w-full flex-col justify-between rounded-lg border border-transparent bg-white/5 py-2 px-4 hover:cursor-pointer hover:border-blue-400"
>
	<div class="flex flex-col">
		<div class="flex items-center justify-between">
			{task.title}
			<div class="-mr-2 flex items-center">
				<div
					on:click|stopPropagation={handleClickEdit}
					class="flex items-center justify-center rounded p-2 hover:cursor-pointer hover:bg-transparent/10"
				>
					<Edit />
				</div>
				<div
					on:click|stopPropagation={handleClickDelete}
					class="flex items-center justify-center rounded p-2 hover:cursor-pointer hover:bg-transparent/10"
				>
					<Trash />
				</div>
			</div>
		</div>
		<div class="flex flex-wrap items-center gap-1">
			{#each task.tagsByTasks as tag}
				<div
					class="flex items-center justify-center rounded-3xl px-2 py-1 text-sm text-black"
					style="background-color: {tag.tag.color};"
				>
					{tag.tag.label}
				</div>
			{/each}
		</div>
	</div>
	<div class="flex items-center justify-between">
		{#if !task.endsAt}
			<small class="text-gray-500">No due date</small>
		{:else}
			<small class="text-gray-500">{task.endsAt.toLocaleString()}</small>
		{/if}
		{#if task.subTasks.length === 0}
			<small class="text-gray-500">No subtasks</small>
		{:else}
			<small class="text-gray-500"
				>{amountOfAchievedTasks} / {task.subTasks.length} achieved</small
			>
		{/if}
	</div>
</div>
