<script lang="ts">
	import Footer from '$lib/ui/Footer.svelte';
	import NavBar from '$lib/ui/NavBar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<!-- Header -->
	<NavBar />
	<!-- Grid Columns -->
	<div class="grid grid-rows-[1fr_auto] overflow-y-scroll" id="content-container">
		<!-- Main Content -->
		<main class="space-y-4">
			{@render children()}
		</main>
		<Footer />
	</div>
	<!-- Footer -->
</div>
