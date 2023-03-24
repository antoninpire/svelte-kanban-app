<script lang="ts">
	export let variant: 'default' | 'ghost' | 'destructive' | 'light' = 'default';
	export let disabled = false;
	export let form: string | undefined = undefined;

	const classesByVariant: Record<typeof variant, string> = {
		default: 'bg-primary text-gray-700 hover:bg-primary/90',
		ghost: 'bg-transparent text-primary hover:bg-white/10',
		destructive: 'bg-red-500 text-white hover:bg-red-600',
		light: 'bg-primary text-gray-300 hover:bg-primary/90',
	};

	const classes = classesByVariant[variant];
</script>

<button
	class={`flex items-center justify-center gap-1 rounded px-5 py-2 font-semibold ${classes}`}
	on:click
	{disabled}
	{form}
>
	<slot />
</button>
