<script lang="ts">
	import X from '$lib/components/icons/X.svelte';
	import Input from '$lib/components/Input.svelte';
	import Popover from '$lib/components/Popover.svelte';
	import { fade } from 'svelte/transition';

	export let tag: {
		label: string;
		color: string;
	};
	export let error: string | undefined = undefined;
	export let onDelete: () => void;

	let popoverVisible = false;

	const colors = [
		'#DAAFE9',
		'#C7DBF5',
		'#AAD5FB',
		'#ADE5DA',
		'#B0EDC3',
		'#FDF0A4',
		'#F8D6A2',
		'#C47ADA',
		'#90BAEE',
		'#75BAFA',
		'#72D5BF',
		'#73DE8C',
		'#FBE66E',
		'#F5B969',
		'#AE44B7',
		'#5E7ABC',
		'#5E7ABC',
		'#4DACA9',
		'#63B75A',
		'#EDBD4A',
		'#EC9740',
		'#501B87',
		'#021B6B',
		'#0C2794',
		'#337277',
		'#2F6A52',
		'#AE802F',
		'#AD6127',
	];

	function handleClickColor(color: string) {
		tag.color = color;
		tag = tag;
	}
</script>

<div class="flex items-center">
	<Popover bind:visible={popoverVisible}>
		<div
			slot="trigger"
			class="mr-4 h-4 w-4 rounded-[1rem] hover:cursor-pointer"
			style={`background-color: ${tag.color}`}
		/>
		<div
			class="flex w-[16rem] flex-wrap gap-2 bg-card p-2"
			transition:fade={{ duration: 250 }}
			slot="content"
		>
			{#each colors as color}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="h-6 w-6 rounded hover:scale-105 hover:cursor-pointer"
					style={`background-color: ${color}`}
					on:click={() => handleClickColor(color)}
				/>
			{/each}
		</div>
	</Popover>
	<Input bind:value={tag.label} placeholder="Your tag" />
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		on:click={onDelete}
		class="ml-2 flex items-center justify-center rounded p-2 hover:cursor-pointer hover:bg-transparent/5"
	>
		<X size="18" />
	</div>
</div>
{#if error}
	<small class="-mt-3 text-center text-sm text-red-500">{error}</small>
{/if}
