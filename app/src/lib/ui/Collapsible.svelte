<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	let value = $state(['open']);

	let { lead: inLeader, control: inControl, panel: inPanel } = $props();
</script>

<Accordion {value} onValueChange={(e) => (value = e.value)} collapsible>
	<Accordion.Item value="open">
		<!-- Control -->
		{#snippet lead()}{@render inLeader()}{/snippet}
		{#snippet control()}{@render inControl()}{/snippet}
		<!-- Panel -->
		{#snippet panel()}
			{@render inPanel()}
		{/snippet}
	</Accordion.Item>
</Accordion>
