<script lang="ts">
	import { trpc } from '$lib/trpc';
	import Board from './Board.svelte';

	const exampleQuery = trpc.board.getAllNames.query();

	$: console.log($exampleQuery.data);
</script>

<Board />

<svelte:head>
	<title>Kanban</title>
</svelte:head>
