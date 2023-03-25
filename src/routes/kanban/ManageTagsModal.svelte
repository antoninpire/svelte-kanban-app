<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { editTagsSchema } from '$lib/schemas/edit-tags-schema';
	import { showManageTagsModal } from '$lib/stores/modals';
	import { trpc } from '$lib/trpc';
	import type { typeToFlattenedError, z } from 'zod';
	import Tag from './Tag.svelte';

	type Form = z.infer<typeof editTagsSchema>;

	let form: Form = {
		tags: [],
	};
	let errors: typeToFlattenedError<Form, string> | null | undefined;

	const updateTagsMutation = trpc.tag.updateTags.mutation({
		onSuccess() {
			showManageTagsModal.set(false);
			$getByBoardId.refetch();
		},
		onError(error) {
			errors = error.data?.zodError;
		},
	});

	function handleAddTag() {
		form.tags.push({
			label: '',
			color:
				'#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0'),
		});
		form = form;
	}

	async function handleSave() {
		if (!$page.params.id) return;
		await $updateTagsMutation.mutateAsync({
			boardId: $page.params.id,
			tags: form.tags,
		});
	}

	function handleDeleteTag(tagIndex: number) {
		form.tags.splice(tagIndex, 1);
		form = form;
	}

	function handleClose() {
		$getByBoardId.refetch();
	}

	function handleSetTags(tags: { label: string; color: string }[]) {
		form.tags = tags;
	}

	$: getByBoardId = trpc.tag.getByBoardId.query(
		{ boardId: $page.params.id! },
		{
			enabled: !!$page.params.id,
			onSuccess(data) {
				handleSetTags(
					data.map((tag) => ({
						label: tag.label,
						color: tag.color,
					}))
				);
			},
		}
	);
</script>

<Modal
	bind:showModal={$showManageTagsModal}
	className="w-[27em]"
	onClose={handleClose}
>
	<h2 slot="header">Edit your tags</h2>

	<div class="flex h-full flex-col gap-4 text-gray-300">
		{#if !$getByBoardId.isLoading}
			{#each form.tags as tag, index}
				<Tag
					bind:tag
					error={errors?.fieldErrors?.tags?.[index]}
					onDelete={() => handleDeleteTag(index)}
				/>
			{/each}

			<div class="flex items-center justify-center">
				<Button on:click={handleAddTag}>
					<Plus size="18" />
					Add Tag
				</Button>
			</div>
		{:else}
			<Loader />
		{/if}
	</div>

	<Button
		slot="footer"
		variant="light"
		size="lg"
		on:click={handleSave}
		isLoading={$updateTagsMutation.isLoading}
	>
		Save
	</Button>
</Modal>
