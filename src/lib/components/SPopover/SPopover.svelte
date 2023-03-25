<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Content from './PopoverContent.svelte';

	let targetRef;

	const dispatch = createEventDispatcher();

	type Position =
		| 'top-start'
		| 'top-center'
		| 'top-end'
		| 'left-start'
		| 'left-center'
		| 'left-end'
		| 'right-start'
		| 'right-center'
		| 'right-end'
		| 'bottom-start'
		| 'bottom-center'
		| 'bottom-end';

	const onOpen = () => {
		dispatch('open');
	};

	export let action = 'click';
	export let zIndex = 1000;

	export let preventDefault = false;
	export let stopPropagation = false;
	export let position: Position = 'bottom-end';

	export let open = false;

	const setOpen = () => {
		open = !open;
		if (!open) {
			dispatch('close');
		}
	};
	const eventClick = (e: TouchEvent | MouseEvent) => {
		if (preventDefault) e.preventDefault();
		if (stopPropagation) e.stopPropagation();
		setOpen();
	};
	const eventMouseOut = ({ relatedTarget }: any) => {
		if (relatedTarget.id === 'overlay' && !open) {
			setOpen();
		}
	};

	const onTouchEnd = action === 'click' ? eventClick : null;
	const onClick = action === 'click' ? eventClick : null;

	const setOpenTrue = () => (open = true);

	const onMouseOver = action === 'hover' ? setOpenTrue : null;
	const onMouseOut = action === 'hover' ? eventMouseOut : null;
</script>

<div class="popover">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
	<div
		bind:this={targetRef}
		class="target"
		style={open ? `z-index: ${zIndex + 10}` : ''}
		on:click={onClick}
		on:touchend={onTouchEnd}
		on:mouseover={onMouseOver}
		on:mouseout={onMouseOut}
	>
		<slot name="target" {open} />
	</div>
	{#if open}
		<Content
			on:open={onOpen}
			on:setOpen={setOpen}
			{targetRef}
			{action}
			{preventDefault}
			{stopPropagation}
			{position}
		>
			<slot name="content" {open} />
		</Content>
	{/if}
</div>

<style>
	.target {
		display: inline-block;
		position: relative;
	}
	.popover {
		position: relative;
	}
</style>
