<script lang="ts">
	import { page } from '$app/stores';
	import Popover from '$lib/components/Popover.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { showAddTaskColumnId, showAddTaskModal } from '$lib/stores/modals';
	import { trpc } from '$lib/trpc';
	import { fade } from 'svelte/transition';

	export let column: {
		id: string;
		name: string;
		order: number;
		tasks: {
			title: string;
			id: string;
		}[];
	};

	const columnNameInputId = `column-name-${column.id}`;

	const updateNameMutation = trpc.column.updateName.mutation({
		onSuccess() {},
		onError(error) {
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

	function handleClickAddTask() {
		showAddTaskModal.set(true);
		showAddTaskColumnId.set(column.id);
	}

	function handleClickRenameColumn() {
		const element = document.getElementById(
			columnNameInputId
		) as HTMLInputElement;
		if (element) {
			// element.setAttribute('disabled', 'null');
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
	}

	async function handleClickDeleteColumn() {
		await $deleteColumnMutation.mutateAsync({ id: column.id });
	}
</script>

<div
	class="no-scrollbar float-left ml-16 flex h-full w-[20rem] flex-col gap-4 overflow-y-scroll"
>
	<div class="mb-3 flex items-center justify-between">
		<input
			value={column.name}
			disabled
			class="bg-transparent text-xl font-bold text-white"
			id={columnNameInputId}
		/>
		<div class="flex items-center gap-1">
			<Tooltip label="Add a Task">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="rounded p-1 hover:cursor-pointer hover:bg-transparent/10"
					on:click={handleClickAddTask}
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
						><line x1="12" y1="5" x2="12" y2="19" /><line
							x1="5"
							y1="12"
							x2="19"
							y2="12"
						/></svg
					>
				</div>
			</Tooltip>

			<Popover>
				<div
					class="rounded p-1 hover:cursor-pointer hover:bg-transparent/10"
					slot="trigger"
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
						><circle cx="12" cy="12" r="1" /><circle
							cx="19"
							cy="12"
							r="1"
						/><circle cx="5" cy="12" r="1" /></svg
					>
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
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path
								d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
							/><path
								d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
							/></svg
						>
						<p>Rename Column</p>
					</div>
					<div
						class="flex w-full items-center gap-1 px-2 py-2.5 hover:cursor-pointer hover:bg-white/5"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><line x1="19" y1="12" x2="5" y2="12" /><polyline
								points="12 19 5 12 12 5"
							/></svg
						>
						<p>Add Column To Left</p>
					</div>
					<div
						class="flex w-full items-center gap-1 px-2 py-2.5 hover:cursor-pointer hover:bg-white/5"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><line x1="5" y1="12" x2="19" y2="12" /><polyline
								points="12 5 19 12 12 19"
							/></svg
						>
						<p>Add Column To Right</p>
					</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						on:click={handleClickDeleteColumn}
						class="flex w-full items-center gap-1 px-2 py-2.5 text-red-500 hover:cursor-pointer hover:bg-white/5"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M3 6h18" /><path
								d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
							/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg
						>
						<p>Delete Column</p>
					</div>
				</div>
			</Popover>
		</div>
	</div>
	{#each column.tasks as task}
		<div class="min-h-[10rem] w-full rounded-lg bg-white/5 p-4">
			{task.title}
		</div>
	{/each}
</div>
