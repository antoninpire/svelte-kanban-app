<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	export let className = '';
	export let showModal = false; // boolean

	let dialog: HTMLDialogElement; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();

	$: if (dialog && !showModal) dialog.close();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
	class={`min-w-[24em] max-w-[32em] rounded border-none bg-card p-0 outline-none ${className}`}
>
	<div on:click|stopPropagation class="p-1">
		<div
			class="flex items-center justify-center py-5 text-3xl font-semibold text-gray-300"
		>
			<slot name="header" />
		</div>
		<div class="px-4">
			<slot />
		</div>
		<!-- svelte-ignore a11y-autofocus -->
		<!-- <button autofocus on:click={() => dialog.close()}>close modal</button> -->
		<div class="flex items-center justify-center gap-2 py-5 px-4">
			<!-- svelte-ignore a11y-autofocus -->
			<Button variant="destructive" on:click={() => dialog.close()}
				>Close</Button
			>
			<slot name="footer" />
		</div>
	</div>
</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.8);
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
