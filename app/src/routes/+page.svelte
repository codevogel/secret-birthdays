<script lang="ts">
	import Calendar from '$lib/ui/Calendar.svelte';
	import type { CalendarEvent } from '$lib/types/CalendarEvent';
	import type { ChangeEventHandler } from 'svelte/elements';
	import { isOnSameDay } from '$lib/util/date';
	import { page } from '$app/state';
	import type { BirthdayGenerationResult } from '$lib/types/BirthdayGenerator.js';

	let { data } = $props();

	let birthdayInputString: string = $state(page.url.searchParams.get('birthday') || '');

	let selectedDate: Date = $state(new Date());

	let birthdayGenerationResult: BirthdayGenerationResult | null = $derived.by(() => {
		return data.birthdayGenerationResult;
	});

	let events: CalendarEvent[] = $derived.by(() => {
		if (!birthdayGenerationResult) {
			return [];
		}
		return birthdayGenerationResult.birthdays.map((birthday) => {
			return {
				start: birthday.date,
				title: birthday.title!,
				description: birthday.description
			};
		});
	});

	const onDateChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		e.currentTarget.form?.requestSubmit();
	};

	let eventOnSelectedDate: CalendarEvent | null = $derived.by(() => {
		if (!birthdayGenerationResult) {
			return null;
		}
		return events.find((event) => isOnSameDay(event.start, selectedDate)) || null;
	});
</script>

<form data-sveltekit-keepfocus class="m-4 flex items-center justify-center gap-x-8">
	<label for="birthday">Select your birthday:</label>
	<input
		class="text-primary-500"
		type="date"
		name="birthday"
		onchange={onDateChange}
		bind:value={birthdayInputString}
	/>
</form>

<Calendar bind:selectedDate {events} />

<div class="m-4 flex flex-col items-center justify-center text-left">
	<div>
		{#if eventOnSelectedDate}
			<p class="text-primary-500">
				You have a {eventOnSelectedDate.title} on {eventOnSelectedDate.start.toLocaleDateString()}!
			</p>
			<p class="text-primary-500">
				Description: {eventOnSelectedDate.description}
			</p>
		{:else}
			<p class="text-primary-500">No birthdays on this date.</p>
		{/if}
	</div>
</div>
