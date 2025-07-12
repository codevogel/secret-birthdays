<script lang="ts">
	import Calendar from '$lib/ui/Calendar.svelte';
	import type { CalendarEvent } from '$lib/types/CalendarEvent';
	import type { ChangeEventHandler } from 'svelte/elements';
	import type { BinaryBirthdayData } from '$lib/types/BirthdayData';
	import { isOnSameDay } from '$lib/util/date';
	import { page } from '$app/state';

	let { data } = $props();

	let birthdayInputString: string = $state(page.url.searchParams.get('birthday') || '');

	let selectedDate: Date = $state(new Date());

	let binaryBirthdayData: BinaryBirthdayData | null = $derived.by(() => {
		return data.binaryBirthdayData;
	});

	let events: CalendarEvent[] = $derived.by(() => {
		if (!binaryBirthdayData) {
			return [];
		}
		return binaryBirthdayData.birthdays.map((birthday) => {
			return {
				start: birthday,
				title: birthday.toLocaleDateString()
			};
		});
	});

	const onDateChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		e.currentTarget.form?.requestSubmit();
	};

	let eventOnSelectedDate: CalendarEvent | null = $derived.by(() => {
		if (!binaryBirthdayData) {
			return null;
		}
		return events.find((event) => isOnSameDay(event.start, selectedDate)) || null;
	});
</script>

<form data-sveltekit-keepfocus>
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

{#if eventOnSelectedDate}
	<p class="text-primary-500">
		You have a birthday on {eventOnSelectedDate.start.toLocaleDateString()}!
	</p>
{:else}
	<p class="text-primary-500">No birthdays on this date.</p>
{/if}
