<script lang="ts">
	import type { CalendarEvent } from '$lib/types/Calendar';
	import Card from '$lib/ui/Card.svelte';

	let { event }: { event: CalendarEvent } = $props();
</script>

<Card>
	{#snippet header()}
      {event.title}
	{/snippet}
	{#snippet article()}
		<p class="text-surface-300 text-sm">{event.description}</p>
	{/snippet}
</Card>
