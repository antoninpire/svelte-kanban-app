<script lang="ts">
	let dialog: HTMLDivElement;
	let backdrop: HTMLDivElement;

	let startX: number | null = null;
	let startY: number | null = null;
	let direction: 'vertical' | 'horizontal' | null = null;

	export let open = false;
	export let threshold = 0.3;
	export let backdropOpacity = 0.5;
	export let speed = 0.2;

	const touch = (e: TouchEvent) => (e.changedTouches ? e.changedTouches[0] : e);

	const deltaX = (e: TouchEvent, startX: number | null) =>
		(startX ?? 0) - (touch(e) as Touch)?.clientX;

	const deltaY = (e: TouchEvent, startY: number | null) =>
		(startY ?? 0) - (touch(e) as Touch)?.clientY;

	const touchStart = (e: TouchEvent) => {
		const element = touch(e);
		if (element instanceof Touch) {
			startX = element?.clientX ?? null;
			startY = element?.clientY ?? null;
		}
	};

	const touchMove = (e: TouchEvent) => {
		if (!direction) {
			direction =
				Math.abs(deltaY(e, startY)) > Math.abs(deltaX(e, startX))
					? 'vertical'
					: 'horizontal';
		}

		if (deltaX(e, startX) < 0 && direction === 'horizontal') {
			dialog.style.setProperty('--b', deltaX(e, startX) + 'px');
			backdrop.style.setProperty(
				'--o',
				`${(1 + deltaX(e, startX) / dialog.clientWidth) * backdropOpacity}`
			);
		}
	};

	const touchEnd = (e: TouchEvent) => {
		if (direction === 'horizontal') {
			open = -deltaX(e, startX) / dialog.clientWidth < threshold;
		}
		startX = null;
		direction = null;
	};

	$: if (dialog && backdrop) {
		dialog.style.setProperty('--s', speed + 's');
		backdrop.style.setProperty('--s', speed + 's');
	}

	$: if (dialog && backdrop && !direction) {
		dialog.style.setProperty('--b', open ? '0px' : -dialog.clientWidth + 'px');
		backdrop.style.setProperty('--o', `${open ? backdropOpacity : 0}`);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	bind:this={backdrop}
	class={'backdrop ' + $$props.class}
	class:smooth={!startX}
	class:open
	on:click={() => (open = false)}
/>

<div
	bind:this={dialog}
	class="root shadow"
	class:smooth={!startX}
	on:touchstart={touchStart}
	on:touchmove={touchMove}
	on:touchend={touchEnd}
>
	<slot />
</div>

<style>
	.root {
		position: fixed;
		background-color: #ffffff;
		width: 40rem;
		height: 100vh;
		overflow-y: auto;
		top: 0px;
		right: var(--b, -100%);
		z-index: 7;
	}

	.root.smooth {
		transition: right calc(var(--f, 1) * var(--s, 0s)) ease-in-out;
	}

	.backdrop {
		pointer-events: none;
		position: fixed;
		left: 0px;
		top: 0px;
		width: 100vw;
		height: 100vh;
		background-color: #212121;
		opacity: var(--o, 0);
		z-index: 6;
	}

	.backdrop.smooth {
		transition: opacity calc(var(--f, 1) * var(--s, 0s)) ease-in-out;
	}

	.backdrop.open {
		pointer-events: all;
	}

	.shadow {
		box-shadow: -2px 0px 8px #21212144, 0px 0px 2px #21212144;
	}
</style>
