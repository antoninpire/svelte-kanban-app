<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Overlay from './PopoverOverlay.svelte';

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

	export let targetRef: HTMLDivElement;
	export let action = 'click';

	export let preventDefault = false;
	export let stopPropagation = false;
	export let position: Position = 'bottom-end';

	let contentRef: HTMLDivElement;
	let positionStyle = ``;

	const dispatch = createEventDispatcher();

	const setOpen = () => {
		dispatch('setOpen', {});
	};

	const calculate = () => {
		const targetBound = targetRef.getBoundingClientRect();
		const contentBound = contentRef.getBoundingClientRect();

		let arrowBound = { width: 0, height: 0 };

		const xCenterStyle = targetBound.height / 2 - contentBound.height / 2;
		const rightLeftEnd = -(contentBound.height - targetBound.height);
		const topBottomEnd = -(contentBound.width - targetBound.width);
		const topBottomCenter = targetBound.width / 2 - contentBound.width / 2;

		const computeArrowW = arrowBound.width / 2;
		const computearrowH = arrowBound.height / 2;

		const leftLeftStyle = -(contentBound.width + computeArrowW);
		const topTopStyle = -(contentBound.height + arrowBound.height / 2);
		const rightLeftStyle = targetBound.width + computeArrowW;
		const bottomTopStyle = targetBound.height + computearrowH;

		const styles: Record<Position, string> = {
			'top-start': `top:${topTopStyle}px`,
			'top-center': `top:${topTopStyle}px;left:${topBottomCenter}px`,
			'top-end': `top:${topTopStyle}px;left:${topBottomEnd}px`,

			'left-start': `left:${leftLeftStyle}px`,
			'left-center': `left:${leftLeftStyle}px;top:${xCenterStyle}px`,
			'left-end': `left:${leftLeftStyle}px;top:${rightLeftEnd}px`,

			'right-start': `left:${rightLeftStyle}px`,
			'right-center': `left:${rightLeftStyle}px;top:${xCenterStyle}px`,
			'right-end': `left:${rightLeftStyle}px;top:${rightLeftEnd}px`,

			'bottom-start': `top:${bottomTopStyle}px`,
			'bottom-center': `top:${bottomTopStyle}px;left:${topBottomCenter}px`,
			'bottom-end': `top:${bottomTopStyle}px;left:${topBottomEnd}px;`,
		};

		positionStyle = styles[position];
	};

	onMount(() => {
		calculate();

		dispatch('open');
	});
</script>

<div
	bind:this={contentRef}
	class="absolute left-0 top-0 z-[40] inline-block overflow-hidden rounded"
	style={positionStyle}
>
	<slot />
</div>

<Overlay {action} on:setOpen={setOpen} {stopPropagation} {preventDefault} />
