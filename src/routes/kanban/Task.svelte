<script lang="ts">
	import Edit from '$lib/components/icons/Edit.svelte';
	import Trash from '$lib/components/icons/Trash.svelte';
	import { showEditTaskSheet } from '$lib/stores/sheets';
	import type { RouterOutputs } from '$lib/trpc';

	export let task: RouterOutputs['board']['getById']['columns'][number]['tasks'][number];

	function handleClickEdit() {
		showEditTaskSheet.set({
			isOpen: true,
			taskId: task.id,
		});
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="min-h-[10rem] w-full rounded-lg border border-transparent bg-white/5 py-2 px-4 hover:cursor-pointer hover:border-blue-400"
>
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
				class="flex items-center justify-center rounded p-2 hover:cursor-pointer hover:bg-transparent/10"
			>
				<Trash />
			</div>
		</div>
	</div>
</div>
