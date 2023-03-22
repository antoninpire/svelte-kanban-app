<script lang="ts">
	export let id: string | undefined = undefined;
	export let placeholder = '';
	export let disabled = false;
	export let required = false;
	export let value: string | number = '';
	export let type: 'text' | 'password' | 'number' | 'email' = 'text';
	export let name: string | undefined = undefined;
	export let maxlength: number = 75;
	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		value = type.match(/^(number|range)$/) ? +target?.value : target?.value;
	};
</script>

<input
	class="w-full rounded border border-gray-700 bg-transparent py-2 px-4 text-sm text-gray-300 outline-none"
	{disabled}
	{placeholder}
	{type}
	{id}
	{name}
	{maxlength}
	{value}
	{required}
	on:input={handleInput}
/>
