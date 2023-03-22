<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { trpc } from '$lib/trpc';
	import Popover from 'svelte-easy-popover';
	import { fade } from 'svelte/transition';

	let optionsReferences: Element[] = [];

	const getByIdQuery = trpc.board.getById.query(
		{ id: $page.params.id ?? '' },
		{ enabled: !!$page.params.id }
	);
</script>

<div class="no-scrollbar h-full w-full overflow-x-scroll py-6 text-gray-300">
	{#if $getByIdQuery.isLoading}
		<Loader />
	{:else if !$page.params.id}
		<div class="flex h-full w-full items-center justify-center text-gray-300">
			<div class="flex items-center gap-3">
				<div class="flex items-center">
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
						><line x1="19" y1="12" x2="5" y2="12" /><polyline
							points="12 19 5 12 12 5"
						/></svg
					>
					<p>Open a board on the left</p>
				</div>
				<p class="uppercase">or</p>
				<div class="flex items-center justify-center">
					<Button>Add a Board</Button>
				</div>
			</div>
		</div>
	{:else}
		<!-- {JSON.stringify($getByIdQuery.data)} -->
		{#each $getByIdQuery.data.columns as column, columnIndex}
			<div
				class="no-scrollbar float-left ml-16 flex h-full w-[20rem] flex-col gap-4 overflow-y-scroll"
			>
				<div class="mb-3 flex items-center justify-between">
					<h3 class="text-xl font-bold text-white">
						{column.name}
					</h3>
					<div class="flex items-center gap-1">
						<Tooltip label="Add a Task">
							<div
								class="rounded p-1 hover:cursor-pointer hover:bg-transparent/10"
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

						<div>
							<div
								bind:this={optionsReferences[columnIndex]}
								class="rounded p-1 hover:cursor-pointer hover:bg-transparent/10"
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

							{#if optionsReferences[columnIndex]}
								<Popover
									triggerEvents={['click']}
									referenceElement={optionsReferences[columnIndex]}
									placement="bottom"
									spaceAway={10}
									spaceAlong={80}
								>
									<div
										class="flex w-[12rem] flex-col bg-card text-sm text-gray-300"
										transition:fade={{ duration: 250 }}
									>
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
											<p>Add Column To Left</p>
										</div>
										<div
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
							{/if}
						</div>
					</div>
				</div>
				{#each column.tasks as task}
					<div class="min-h-[10rem] w-full rounded-lg bg-white/5 p-4">
						{task.title}
					</div>
				{/each}
			</div>
		{/each}
	{/if}
</div>
