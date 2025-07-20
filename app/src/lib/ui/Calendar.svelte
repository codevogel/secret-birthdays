<script lang="ts">
	import type { CalendarEvent } from '$lib/types/CalendarEvent';
	import {
		ChevronLeft,
		ChevronRight,
		ChevronsLeftIcon,
		ChevronsRight,
		Clock
	} from 'lucide-svelte';
	import moment from 'moment';
	import { getStartDayOfMonth, isInSameMonth, isOnSameDay } from '$lib/util/date';

	let {
		selectedDate = $bindable(),
		events = []
	}: { selectedDate: Date; events: CalendarEvent[] } = $props();

	let dateStringsWithEvents: string[] = $derived(events.map((date) => date.date.toDateString()));

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
		let end = moment(start).add(7 * 6, 'days');
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

<div class="grid mx-4 max-w-xs grid-cols-1 py-4">
	<control class="text-primary-contrast-dark flex flex-row">
		<div class="flex grow flex-row items-center justify-start gap-x-2">
			<button class="btn-icon bg-primary-500 p-1" onclick={onPreviousYear}
				><ChevronsLeftIcon /></button
			>
			<button class="btn-icon bg-primary-500 p-1" onclick={onPreviousMonth}
				><ChevronLeft /></button
			>
			<div class="mx-2 flex w-[12ch] items-center justify-center">
				<h1 class="text-bold text-primary-500 text-xs">
					{currentMonthString}
					{currentYearString}
				</h1>
			</div>
			<button class="btn-icon bg-primary-500 p-1" onclick={onNextMonth}><ChevronRight /></button
			><button class="btn-icon bg-primary-500 p-1" onclick={onNextYear}><ChevronsRight /></button
			>
			<button
				class="btn bg-primary-500 ms-auto px-2 py-1 text-xs"
				onclick={() => {
					selectedDate = currentDate;
				}}>Now</button
			>
		</div>
	</control>
	<article class="flex flex-col">
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
               {isInSameMonth(date, selectedDate) ? '' : 'text-surface-700'} 
               {isOnSameDay(date, selectedDate) ? 'bg-primary-500' : ''}
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
