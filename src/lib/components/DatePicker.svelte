<script lang="ts">
	import { DateInput } from 'date-picker-svelte';
	export let date: Date | null;
</script>

<DateInput bind:value={date} />
