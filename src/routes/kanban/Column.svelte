<script lang="ts">
	import { page } from '$app/stores';
	import Edit from '$lib/components/icons/Edit.svelte';
	import LeftArrow from '$lib/components/icons/LeftArrow.svelte';
	import More from '$lib/components/icons/More.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import RightArrow from '$lib/components/icons/RightArrow.svelte';
	import Trash from '$lib/components/icons/Trash.svelte';
	import Popover from '$lib/components/Popover.svelte';
	import { showAddColumnModal, showAddTaskModal } from '$lib/stores/modals';
	import { trpc, type RouterOutputs } from '$lib/trpc';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import Task from './Task.svelte';

	type Column = RouterOutputs['board']['getById']['columns'][number];
	type Task = Column['tasks'][number];

	export let column: Column;
	let popoverVisible = false;

	const flipDurationMs = 200;

	const columnNameInputId = `column-name-${column.id}`;

	const updateNameMutation = trpc.column.updateName.mutation({
		onSuccess() {},
		onError() {
			if ($page.params.id)
				trpc.board.getById.utils.invalidate({ id: $page.params.id });
		},
	});

	const deleteColumnMutation = trpc.column.delete.mutation({
		onSuccess() {
			if ($page.params.id)
				trpc.board.getById.utils.invalidate({ id: $page.params.id });
		},
		onError(error) {
			console.error(error);
		},
	});

	const updateTaskOrderMutation = trpc.task.updateOrder.mutation();

	function handleClickAddTask() {
		showAddTaskModal.set({
			isOpen: true,
			columnId: column.id,
		});
	}

	function handleClickRenameColumn() {
		const element = document.getElementById(
			columnNameInputId
		) as HTMLInputElement;
		if (element) {
			element.disabled = false;
			element.focus();
			element.onblur = async () => {
				element.onblur = null;
				element.disabled = true;
				await $updateNameMutation.mutateAsync({
					id: column.id,
					name: element.value,
				});
			};
		}
		popoverVisible = false;
	}

	function handleClickAddToLeft() {
		showAddColumnModal.set({
			isOpen: true,
			order: column.order - 1,
		});
		popoverVisible = false;
	}

	function handleClickAddToRight() {
		showAddColumnModal.set({
			isOpen: true,
			order: column.order,
		});
		popoverVisible = false;
	}

	async function handleClickDeleteColumn() {
		await $deleteColumnMutation.mutateAsync({ id: column.id });
		popoverVisible = false;
	}

	async function updateSort(
		e: CustomEvent<DndEvent<Task>> & {
			target: EventTarget & HTMLDivElement;
		}
	) {
		const taskId = e.detail.info.id;
		const tasks = e.detail.items;

		const taskIndex = tasks.findIndex((v) => v.id === taskId);
		const order = taskIndex <= 0 ? 0 : tasks[taskIndex - 1]!.order + 1;

		if (e.detail.info.trigger === 'droppedIntoAnother') {
			// dropped in another column
		} else if (e.detail.info.trigger === 'droppedIntoZone') {
			// dropped in same column
			await $updateTaskOrderMutation.mutateAsync({
				id: taskId,
				order,
				columnId: column.id,
			});
		}

		column.tasks = e.detail.items;
		column = column;
	}
	function handleSort(
		e: CustomEvent<DndEvent<Task>> & {
			target: EventTarget & HTMLDivElement;
		}
	) {
		column.tasks = e.detail.items;
		column = column;
	}
</script>

<div
	class="no-scrollbar flex h-full w-[23rem] flex-col gap-4 overflow-y-scroll"
>
	<div class="mb-3 flex items-center justify-between px-1">
		<input
			value={column.name}
			disabled
			class="bg-transparent text-xl font-bold text-white"
			id={columnNameInputId}
		/>
		<div class="flex items-center gap-1">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="rounded p-1 hover:cursor-pointer hover:bg-transparent/10"
				on:click={handleClickAddTask}
			>
				<Plus />
			</div>

			<Popover bind:visible={popoverVisible}>
				<div
					class="rounded p-1 hover:cursor-pointer hover:bg-transparent/10"
					slot="trigger"
				>
					<More />
				</div>
				<div
					class="flex w-[12rem] flex-col bg-card text-sm text-gray-300"
					transition:fade={{ duration: 250 }}
					slot="content"
				>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						on:click={handleClickRenameColumn}
						class="flex w-full items-center gap-1 px-2 py-2.5 hover:cursor-pointer hover:bg-white/5"
					>
						<Edit />
						<p>Rename Column</p>
					</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						on:click={handleClickAddToLeft}
						class="flex w-full items-center gap-1 px-2 py-2.5 hover:cursor-pointer hover:bg-white/5"
					>
						<LeftArrow size="20" />
						<p>Add Column To Left</p>
					</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						on:click={handleClickAddToRight}
						class="flex w-full items-center gap-1 px-2 py-2.5 hover:cursor-pointer hover:bg-white/5"
					>
						<RightArrow size="20" />
						<p>Add Column To Right</p>
					</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						on:click={handleClickDeleteColumn}
						class="flex w-full items-center gap-1 px-2 py-2.5 text-red-500 hover:cursor-pointer hover:bg-white/5"
					>
						<Trash />
						<p>Delete Column</p>
					</div>
				</div>
			</Popover>
		</div>
	</div>
	<div
		use:dndzone={{
			items: column.tasks,
			flipDurationMs,
			dragDisabled: !column.tasks.length,
			type: 'card',
		}}
		on:consider={handleSort}
		on:finalize={updateSort}
		class="flex min-h-[40vh] flex-col gap-4"
	>
		{#if column.tasks.length}
			{#each column.tasks as task (task.id)}
				<div animate:flip={{ duration: flipDurationMs }}>
					<Task {task} />
				</div>
			{/each}
		{:else}
			<div
				class="flex h-[80vh] items-center justify-center font-semibold text-gray-500"
			>
				No task yet.
			</div>
		{/if}
	</div>
</div>
