<script lang="ts">
	import type { CalendarEvent } from '$lib/types/Calendar';
	import TimeLineCard from '$lib/ui/TimeLineCard.svelte';

	let { events = [] }: { events: CalendarEvent[] } = $props();

	let sortedEvents: CalendarEvent[] = $derived.by(() => {
		return events.slice().sort((a, b) => a.date.getTime() - b.date.getTime());
	});

	let years: TimeLineYear[] = $derived.by(() => {
		let yearMap: Map<number, TimeLineYear> = new Map();
		sortedEvents.forEach((event) => {
			const year = event.date.getFullYear();
			if (!yearMap.has(year)) {
				yearMap.set(year, { year, months: [] });
			}
			const timeLineYear = yearMap.get(year)!;

			const monthIndex = event.date.getMonth();
			let month = timeLineYear.months.find((m) => m.month === monthIndex);
			if (!month) {
				month = { year: timeLineYear, month: monthIndex, days: [] };
				timeLineYear.months.push(month);
			}

			const day = event.date.getDate();
			let timeLineDay = month.days.find((d) => d.day === day);
			if (!timeLineDay) {
				timeLineDay = { day, month, year: timeLineYear, events: [] };
				month.days.push(timeLineDay);
			}
			timeLineDay.events.push(event);
		});
		return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
	});

	interface TimeLineYear {
		year: number;
		months: TimeLineMonth[];
	}

	interface TimeLineMonth {
		year: TimeLineYear;
		month: number;
		days: TimeLineDay[];
	}

	interface TimeLineDay {
		day: number;
		month: TimeLineMonth;
		year: TimeLineYear;
		events: CalendarEvent[];
	}
</script>

<div class="">
	{#each years as year, i (i)}
		<h1 class="h1 text-primary-500 mt-8 underline">{year.year}</h1>
		{#each year.months as month, j (j)}
			<h2 class="h3 text-primary-300 my-4">
				{new Date(year.year, month.month).toLocaleString('default', { month: 'long' })}
			</h2>
			<div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4">
				{#each month.days as day, k (k)}
					{#each day.events as event, l (l)}
						<TimeLineCard {event} />
					{/each}
				{/each}
			</div>
		{/each}
	{/each}
</div>
