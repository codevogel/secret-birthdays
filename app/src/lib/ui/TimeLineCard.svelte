<script lang="ts">
	let { event } = $props();
</script>

<div class="bg-surface-800 flex max-w-md flex-row rounded-3xl">
	<aside class="flex min-w-20 items-center justify-center text-3xl bg-surface-600 rounded-l-3xl">
		<span>
			<span>{event.date.toLocaleDateString('en-UK', { day: 'numeric' })}</span>
		</span>
	</aside>
	<div class="bg-surface-700 w-1 rounded-4xl"></div>
	<article class=" p-4">
		<header class="">
			<strong>{event.title}</strong>
		</header>
		<article class="">
			<p>{event.description}</p>
		</article>
	</article>
</div>
