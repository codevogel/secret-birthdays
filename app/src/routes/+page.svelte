<script lang="ts">
	import { getDateSince } from '$lib/util/date';
	import TimeLine, { type TimeLineEvent } from '$lib/ui/TimeLine.svelte';

	let daysFromNow: number[] = $state([0, 1, 1, 500, 1000, 1000, 1005]);

	let events: TimeLineEvent[] = $derived.by(() => {
		return daysFromNow.map((days) => {
			return {
				date: getDateSince(new Date(), days),
				title: `Binary Birthday`,
				description: `You have been alive for ${days} days, which is a binary number!`
			};
		});
	});
</script>

<TimeLine {events} />
