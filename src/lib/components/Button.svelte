<script lang="ts">
	export let variant: 'default' | 'ghost' = 'default';

	const classesByVariant: Record<typeof variant, string> = {
		default: 'bg-primary text-gray-700 hover:bg-primary/90',
		ghost: 'bg-transparent text-primary hover:bg-white/10',
	};

	const classes = classesByVariant[variant];
</script>

<button class={`rounded px-5 py-2 font-semibold ${classes}`} on:click>
	<slot />
</button>
