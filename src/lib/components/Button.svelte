<script lang="ts">
	import Loader from '$lib/components/Loader.svelte';

	export let variant:
		| 'default'
		| 'ghost'
		| 'destructive'
		| 'light'
		| 'destructive-light' = 'default';
	export let size: 'default' | 'lg' = 'default';
	export let disabled = false;
	export let form: string | undefined = undefined;
	export let isLoading = false;

	const classesByVariant: Record<typeof variant, string> = {
		default: 'border border-gray-400 hover:bg-white/5 text-gray-300',
		ghost: 'bg-transparent text-primary hover:bg-white/10',
		destructive: 'bg-red-500 text-white hover:bg-red-600',
		light: 'border border-gray-400 bg-gray-200 text-black hover:bg-gray-300',
		'destructive-light':
			'bg-transparent text-red-500 hover:bg-white/5 border border-red-500',
	};

	const classBySizes: Record<typeof size, string> = {
		default: 'px-2.5 py-1.5 text-sm',
		lg: 'px-3 py-2',
	};

	const variantClass = classesByVariant[variant];
	const sizeClass = classBySizes[size];
</script>

<button
	class={`flex items-center justify-center gap-1.5 rounded font-semibold ${variantClass} ${sizeClass}`}
	on:click
	disabled={disabled || isLoading}
	{form}
>
	{#if isLoading}
		<Loader size={size === 'default' ? 12 : 16} dark={variant === 'light'} />
		<div class="w-2" />
		Loading...
	{:else}
		<slot />
	{/if}
</button>
