<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { Calendar, ListOrdered } from 'lucide-svelte';

   let toggled: boolean = $state(false);

   let { mode = $bindable('calendar') }: { mode: 'calendar' | 'timeline' } = $props();

   $effect(() => {
      mode = toggled ? 'timeline' : 'calendar';
   });
</script>

<span class="text-xs flex items-center gap-2">
   Toggle view:
	<Switch
		name="mode"
		controlActive="bg-surface-200"
		checked={toggled}
		onCheckedChange={(e) => toggled = e.checked}
	>
		{#snippet inactiveChild()}<Calendar size="20" />{/snippet}
		{#snippet activeChild()}<ListOrdered size="20" />{/snippet}
	</Switch>
</span>
