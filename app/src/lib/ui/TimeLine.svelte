<script lang="ts">
	import type { CalendarEvent } from '$lib/types/Calendar';
	import { Squircle } from 'lucide-svelte';

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

	function monthString(month: number): string {
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dev'
		];
		return months[month];
	}
</script>

<div class="grid grid-cols-1 py-4">
	{#each years as year, i (i)}
		<div class="text-primary-500 font-bold text-xl">{year.year}</div>
		<div class="bg-primary-500 ms-6 h-4 w-0.5"></div>
		<div class="grid grid-cols-1">
			{#each year.months as month, j (j)}
				<div class="ps-2.5">{monthString(month.month)}</div>
				<div class="grid grid-cols-[auto_1fr]">
					{#each month.days as day, k (k)}
						<div class="bg-primary-500 relative ms-6 h-full w-0.5">
							<Squircle
								class="fill-primary-500 text-primary-500 absolute top-[20px] right-[-5px]"
								size={12}
							/>
						</div>
						<div class="grid grid-cols-[auto_1fr]">
							<div class="text-primary-500 w-[5ch] ps-4 pt-3.5">{day.day.toString().padStart(2, '0')}</div>
							<div class="mb-4 grid grid-cols-1 gap-y-4">
								{#each day.events as event, l (l)}
									<div class="card max-w-sm bg-surface-600 flex flex-col p-4">
										<header class="font-bold text-primary-50">{event.title}</header>
                              <article>{event.description}</article>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
		{#if i !== years.length - 1}
			<div class="bg-primary-500 ms-6 h-4 w-0.5"></div>
		{/if}
	{/each}
</div>
