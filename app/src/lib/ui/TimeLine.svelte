<script lang="ts">
	import type { CalendarEvent } from '$lib/types/Calendar';
	import { ArrowUp, Calendar, Squircle } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { events = [] }: { events: CalendarEvent[] } = $props();

	let sortedEvents: CalendarEvent[] = $derived.by(() => {
		return events.slice().sort((a, b) => a.date.getTime() - b.date.getTime());
	});

	const today = new Date();
	const todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

	let years: TimeLineYear[] = $derived.by(() => {
		const yearMap: Map<number, TimeLineYear> = new Map();

		// Process all events
		sortedEvents.forEach((event) => {
			const year = event.date.getFullYear();
			if (!yearMap.has(year)) yearMap.set(year, { year, months: [] });
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

		// Ensure today is in the timeline
		const todayYear = today.getFullYear();
		const todayMonth = today.getMonth();
		const todayDay = today.getDate();

		let yearEntry = yearMap.get(todayYear);
		if (!yearEntry) {
			yearEntry = { year: todayYear, months: [] };
			yearMap.set(todayYear, yearEntry);
		}

		let monthEntry = yearEntry.months.find((m) => m.month === todayMonth);
		if (!monthEntry) {
			monthEntry = { year: yearEntry, month: todayMonth, days: [] };
			yearEntry.months.push(monthEntry);
		}

		let dayEntry = monthEntry.days.find((d) => d.day === todayDay);
		if (!dayEntry) {
			dayEntry = { day: todayDay, month: monthEntry, year: yearEntry, events: [] };
			monthEntry.days.push(dayEntry);
		}

		// Sort months and days
		yearMap.forEach((year) => {
			year.months.sort((a, b) => a.month - b.month);
			year.months.forEach((month) => month.days.sort((a, b) => a.day - b.day));
		});

		return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
	});

	onMount(() => {
		// Get event that's closest to today
		// Or the last event that is in the past
		scrollToToday();
	});

	function scrollToToday() {
		// First try to scroll to today's date directly
		const todayElement = document.getElementById(todayString);

		if (todayElement) {
			const container = document.querySelector<HTMLElement>('#content-container');
			if (!container) return;

			const offset = 120; // px from top of container
			const elementTop = todayElement.offsetTop; // relative to container
			container.scrollTo({
				top: elementTop - offset,
				behavior: 'smooth'
			});
			return;
		}

		// Fallback: if today's element doesn't exist for some reason,
		// find the closest past event
		const closestEvent = sortedEvents.reduce(
			(closest, event) => {
				if (event.date < today && (!closest || event.date > closest.date)) {
					return event;
				}
				return closest;
			},
			null as CalendarEvent | null
		);

		if (closestEvent) {
			const element = document.getElementById(
				`${closestEvent.date.getFullYear()}-${closestEvent.date.getMonth() + 1}-${closestEvent.date.getDate()}`
			);

			if (element) {
				const container = document.querySelector<HTMLElement>('#content-container');
				if (!container) return;

				const offset = 120; // px from top of container
				const elementTop = element.offsetTop; // relative to container
				container.scrollTo({
					top: elementTop - offset,
					behavior: 'smooth'
				});
			}
		}
	}

	function scrollToTop() {
		const container = document.querySelector<HTMLElement>('#content-container');
		if (!container) return;
		container.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

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

<div class="flex justify-center">
	<div class="grid grid-cols-1 py-4">
		{#each years as year, i (i)}
			<div class="text-primary-500 bg-surface-950 sticky top-0 z-10 w-16 text-xl font-bold">
				{year.year}
			</div>
			<div class="bg-primary-500 ms-6 h-4 w-0.5"></div>
			<div class="grid grid-cols-1">
				{#each year.months as month, j (j)}
					<div class="bg-surface-950 sticky top-8 z-10 w-16 ps-1.5 text-xl">
						{monthString(month.month)}
					</div>
					<div class="grid grid-cols-[auto_1fr]">
						{#each month.days as day, k (k)}
							{@const isToday = `${year.year}-${month.month + 1}-${day.day}` === todayString}
							<div class="bg-primary-500 relative ms-6 h-full w-0.5">
								<Squircle
									class="fill-primary-500 text-primary-500 absolute top-[20px] right-[-5px] {isToday
										? 'animate-pulse fill-white'
										: ''}"
									size={12}
								/>
							</div>
							{@const dateString = `${year.year}-${month.month + 1}-${day.day}`}
							<div class="grid grid-cols-[auto_1fr]" id={dateString}>
								<div
									class="text-primary-500 w-[5ch] ps-4 pt-3.5 {isToday
										? 'animate-pulse text-white'
										: ''}"
								>
									{day.day.toString().padStart(2, '0')}
								</div>
								<div class="mb-4 grid grid-cols-1 gap-y-4">
									{#if day.events.length === 0}
										<div
											class="card bg-surface-600/30 flex max-w-sm flex-col p-4 {isToday
												? 'border-surface-200 animate-border-pulse border-1'
												: ''}"
										>
											<article class="text-surface-300">No events</article>
										</div>
									{:else}
										{#each day.events as event, l (l)}
											<div
												class="card bg-surface-600 flex max-w-sm flex-col p-4 {isToday
													? 'border-surface-200 animate-border-pulse border-1'
													: ''}"
											>
												<header class="text-primary-50 font-bold">{event.title}</header>
												<article>{event.description}</article>
											</div>
										{/each}
									{/if}
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
	<button
		class="bg-primary-500 fixed right-4 bottom-4 h-14 w-14 rounded-2xl opacity-60"
		onclick={scrollToToday}
	>
		<Calendar class="absolute top-[6px] left-[8px] text-black" size={40} strokeWidth={1} />
		<span class="absolute top-[23px] left-[16px] text-xs text-black">Now</span>
	</button>
	<button
		class="bg-primary-500 fixed right-4 bottom-20 h-14 w-14 rounded-2xl opacity-60"
		onclick={scrollToTop}
	>
		<ArrowUp size={40} class="absolute top-2 left-[8px] text-black" strokeWidth={1} />
	</button>
</div>
