<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import TagIcon from '$lib/components/icons/TagIcon.svelte';
	import Trash from '$lib/components/icons/Trash.svelte';
	import { showManageTagsModal } from '$lib/stores/modals';
	import { trpc } from '$lib/trpc';

	const deleteBoardMutation = trpc.board.delete.mutation({
		onSuccess() {
			trpc.board.getAllNames.utils.invalidate();
			goto('/kanban');
		},
	});

	function handleClickManageTags() {
		showManageTagsModal.set(true);
	}

	function handleClickDeleteBoard() {
		if (
			typeof window !== 'undefined' &&
			window.confirm('Are you sure you want to delete this board ?')
		) {
			if ($page.params.id) $deleteBoardMutation.mutate({ id: $page.params.id });
		}
	}

	$: getByIdQuery = trpc.board.getById.query(
		{ id: $page.params.id ?? '' },
		{ enabled: !!$page.params.id }
	);
</script>

<header
	class="flex h-full w-full items-center justify-between bg-[#2E313C] px-5 py-2 text-white"
>
	{#if $page.params.id}
		<div class="flex items-center gap-4">
			<div class="flex h-full items-center text-2xl font-bold">
				{$getByIdQuery.data?.name ?? 'Loading...'}
			</div>
			<div class="flex h-full items-center">
				<Button on:click={handleClickManageTags}>
					<TagIcon size="18" />
					Manage tags
				</Button>
			</div>
		</div>
		<div class="ml-4 flex h-full items-center">
			<Button variant="destructive-light" on:click={handleClickDeleteBoard}>
				<Trash size="18" />
				Delete Board
			</Button>
		</div>
	{/if}
</header>
