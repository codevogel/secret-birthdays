<script lang="ts">
   import type { CalendarEvent } from '$lib/types/CalendarEvent';
	import { ChevronLeft, ChevronRight, ChevronsLeftIcon, ChevronsRight } from 'lucide-svelte';
	import moment from 'moment';
	import { getStartDayOfMonth, isInSameMonth, isOnSameDay } from '$lib/util/date';

	let {
		selectedDate = $bindable(),
		events = []
	}: { selectedDate: Date; events: CalendarEvent[] } = $props();

	let dateStringsWithEvents: string[] = $derived(events.map((date) => date.start.toDateString()));

	let currentDate: Date = $state(moment(new Date()).startOf('day').toDate());

	let locale: string = $derived('en-US');

	let currentMonthString: string = $derived(
		selectedDate.toLocaleDateString(locale, { month: 'long' })
	);
	let currentYearString: string = $derived(
		selectedDate.toLocaleDateString(locale, { year: 'numeric' })
	);

	let startDateOfMonth: Date = $derived(getStartDayOfMonth(selectedDate));

	let datesToShow: Date[] = $derived.by(() => {
		let start = moment(startDateOfMonth).subtract(startDateOfMonth.getDay(), 'days');
		let end = moment(start).add(7*6, 'days');
		let dates: Date[] = [];
		let currentMoment = moment(start);
		while (currentMoment.isBefore(end)) {
			dates.push(currentMoment.toDate());
			currentMoment.add(1, 'day');
		}
		return dates;
	});

	function hasEvent(date: Date): boolean {
		return dateStringsWithEvents.includes(date.toDateString());
	}

	function onNextMonth() {
		selectedDate = moment(selectedDate).add(1, 'month').startOf('month').toDate();
		if (isInSameMonth(selectedDate, currentDate)) {
			selectedDate = currentDate;
		}
	}

	function onPreviousMonth() {
		selectedDate = moment(selectedDate).subtract(1, 'month').endOf('month').toDate();
		if (isInSameMonth(selectedDate, currentDate)) {
			selectedDate = currentDate;
		}
	}

	function onNextYear() {
		selectedDate = moment(selectedDate).add(1, 'year').startOf('month').toDate();
		if (isInSameMonth(selectedDate, currentDate)) {
			selectedDate = currentDate;
		}
	}

	function onPreviousYear() {
		selectedDate = moment(selectedDate).subtract(1, 'year').endOf('month').toDate();
		if (isInSameMonth(selectedDate, currentDate)) {
			selectedDate = currentDate;
		}
	}
</script>

<div class="mx-auto my-8 grid max-w-3xl grid-cols-1 px-2 py-4">
	<header class="grid grid-cols-[auto_1fr] items-center sm:grid-cols-[1fr_auto_1fr]">
		<div class="hidden sm:block"></div>
		<div class="flex flex-row items-center justify-center">
			<div class="flex gap-x-2">
				<button class="bg-primary-500 rounded-xl p-1" onclick={onPreviousYear}
					><ChevronsLeftIcon /></button
				>
				<button class="bg-primary-500 rounded-xl p-1" onclick={onPreviousMonth}
					><ChevronLeft /></button
				>
			</div>
			<div class="flex w-[14ch] items-center justify-center p-1">
				<h1 class="text-bold text-sm">{currentMonthString} {currentYearString}</h1>
			</div>
			<div class="flex gap-x-2">
				<button class="bg-primary-500 rounded-xl p-1" onclick={onNextMonth}
					><ChevronRight /></button
				><button class="bg-primary-500 rounded-xl p-1" onclick={onNextYear}
					><ChevronsRight /></button
				>
			</div>
		</div>
		<div class="ps-4">
			<button
				class="bg-primary-500 rounded-xl p-2 text-xs"
				onclick={() => {
					selectedDate = currentDate;
				}}>Today</button
			>
		</div>
	</header>
	<article class="grid grid-cols-1">
		<header class="grid grid-cols-7 py-2 font-bold">
			<div class="text-center">Mon</div>
			<div class="text-center">Tue</div>
			<div class="text-center">Wed</div>
			<div class="text-center">Thu</div>
			<div class="text-center">Fri</div>
			<div class="text-center">Sat</div>
			<div class="text-center">Sun</div>
		</header>
		<article class="text-surface-500 grid grid-cols-7 gap-2">
			{#each datesToShow as date, i (i)}
				<button
					class="relative aspect-square rounded-lg
               {isInSameMonth(date, selectedDate) ? '' : 'text-surface-800'} 
               {isOnSameDay(date, selectedDate) ? 'bg-primary-500/30 text-white ' : ''}
               {hasEvent(date) ? 'underline underline-offset-6' : ''}"
					onclick={() => {
						selectedDate = date;
					}}
				>
					&nbsp;{date.toLocaleDateString(locale, { day: 'numeric' })}&nbsp;
				</button>
			{/each}
		</article>
	</article>
</div>
