<script lang="ts">
	import Header from './Header.svelte';
	import SideBar from './SideBar.svelte';
</script>

<main
	class="no-scrollbar grid h-screen w-screen overflow-y-scroll bg-background"
>
	<div class="nav">
		<SideBar />
	</div>
	<div class="header">
		<Header />
	</div>

	<div class="content">
		<slot />
	</div>
</main>

<style>
	main {
		grid-template-areas: 'nav header' 'nav content';
		grid-template-rows: 75px 1fr;
		grid-template-columns: 17rem 1fr;
	}

	.header {
		grid-area: header;
	}

	.nav {
		grid-area: nav;
	}

	.content {
		grid-area: content;
	}
</style>
