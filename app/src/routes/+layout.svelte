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
	<div class="grid grid-cols-1">
		<!-- Main Content -->
		<main class="space-y-4 p-4 flex flex-col items-center justify-center">
			{@render children()}
		</main>
	</div>
	<!-- Footer -->
	<Footer />
</div>
