<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';

	let visible = false;
	let anchor: HTMLDivElement | undefined = undefined;

	let bottom: number;
	let left: number;

	const initPosition = () =>
		({ bottom, left } = anchor?.getBoundingClientRect() ?? {
			bottom: 0,
			left: 0,
		});

	$: anchor, initPosition();
</script>

<svelte:window on:resize={initPosition} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={() => (visible = true)} bind:this={anchor}>
	<slot name="trigger" />
</div>

{#if visible}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-role-supports-aria-props -->
	<div
		role="dialog"
		aria-labelledby="Title"
		aria-describedby="Description"
		aria-orientation="vertical"
		transition:fade
		class="fixed inset-0 z-20"
		on:click|stopPropagation
		style="--popover-top: {`${bottom}px`}; --popover-left: {`${left}px`}"
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:click|stopPropagation={() => (visible = false)}
			transition:scale={{ delay: 25, duration: 150, easing: quintOut }}
			class="absolute inset-0 bg-transparent"
		/>
		<div class="wrapper">
			<slot name="content" />
		</div>
	</div>
{/if}

<style>
	.wrapper {
		position: absolute;

		top: calc(var(--popover-top) + 5px);
		left: var(--popover-left);

		width: fit-content;
		height: auto;

		overflow: hidden;

		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
</style>
