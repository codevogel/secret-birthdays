<script lang="ts">
	import moment from 'moment';
	import { toLegibleDate } from '$lib/util/date';

	let { events }: { events: TimeLineEvent[] } = $props();

	export interface TimeLineEvent {
		date: Date;
		title: string;
		description: string;
	}

	export interface TimeLineDay {
		date: Date;
		events: TimeLineEvent[];
	}

	const timeLineDays: TimeLineDay[] = $derived.by(() => {
		const days: { [key: string]: TimeLineDay } = {};
		events.forEach((event) => {
			const dateKey = moment(event.date).format('YYYY-MM-DD');
			if (!days[dateKey]) {
				days[dateKey] = { date: event.date, events: [] };
			}
			days[dateKey].events.push(event);
		});
		return Object.values(days).sort((a, b) => moment(a.date).diff(moment(b.date)));
	});

	function moreThanTimeSpan(a: Date, b: Date, int: number): boolean {
		return moment(a).diff(moment(b), 'days') > int;
	}
</script>

<div class="grid grid-cols-[1fr_auto_1fr] gap-x-8">
	{#each timeLineDays as timeLineDay, index (index)}
		{@const moreThan30Days =
			index === 0 ? false : moreThanTimeSpan(timeLineDay.date, timeLineDays[index - 1].date, 30)}
		{#if moreThan30Days}
			<div></div>
			<div class="flex flex-col gap-y-2 py-2" >
            <div class="bg-primary-500 w-1 h-2"></div>
            <div class="bg-primary-500 w-1 h-2"></div>
            <div class="bg-primary-500 w-1 h-2"></div>
            <div class="bg-primary-500 w-1 h-2"></div>
            <div class="bg-primary-500 w-1 h-2"></div>
         </div>
			<div></div>
		{/if}
		{#if index % 2 === 0}
			<div class="text-right font-bold">{toLegibleDate(timeLineDay.date)}</div>
			<div class="bg-primary-500 relative h-full w-1">
				<div class="bg-secondary-200 absolute top-[5px] right-[-4px] h-3 w-3 rounded-lg"></div>
			</div>
			<div class="flex flex-col gap-y-4 pb-8">
				{#each timeLineDay.events as event, eventIndex (eventIndex)}
					<div>
						<div class="text-primary-500">{event.title}</div>
						<div class="text-surface-400">{event.description}</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col gap-y-4 pb-8 text-right">
				{#each timeLineDay.events as event, eventIndex (eventIndex)}
					<div>
						<div class="text-primary-500">{event.title}</div>
						<div class="text-surface-400">{event.description}</div>
					</div>
				{/each}
			</div>
			<div class="bg-primary-500 relative h-full w-1">
				<div class="bg-secondary-200 absolute top-[5px] right-[-4px] h-3 w-3 rounded-lg"></div>
			</div>
			<div class="font-bold">{toLegibleDate(timeLineDay.date)}</div>
		{/if}
	{/each}
</div>
