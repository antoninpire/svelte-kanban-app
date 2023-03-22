<script lang="ts">
	import Button from '$lib/components/Button.svelte';
</script>

<div class="gradient flex h-screen w-screen items-center justify-center">
	<div class="flex flex-col gap-6">
		<h1 class="text-7xl font-bold text-white">Kanban App</h1>
		<div class="flex items-center justify-center gap-3">
			<a href="/signup">
				<Button variant="ghost">Sign Up</Button>
			</a>
			<a href="/login">
				<Button>Login</Button>
			</a>
		</div>
	</div>
</div>

<svelte:head>
	<title>Kanban App</title>
	<description>A simple Kanban App made using SvelteKit</description>
</svelte:head>
