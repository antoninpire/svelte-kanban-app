<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let action;
	export let preventDefault = false;
	export let stopPropagation = false;

	const dispatch = createEventDispatcher();

	const eventClick = (e: MouseEvent | TouchEvent) => {
		if (preventDefault) e.preventDefault();
		if (stopPropagation) e.stopPropagation();

		dispatch('setOpen', {});
	};

	const onClick = action === 'click' ? eventClick : null;
	const onTouchEnd = action === 'click' ? eventClick : null;

	const onMouseEnter = action === 'hover' ? eventClick : null;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	id="overlay"
	class="fixed top-0 left-0 z-[30] h-full w-full"
	on:mouseenter={onMouseEnter}
	on:click={onClick}
	on:touchend={onTouchEnd}
/>
