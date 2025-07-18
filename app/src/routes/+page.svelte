<script lang="ts">
	import Calendar from '$lib/ui/Calendar.svelte';
	import type { CalendarEvent } from '$lib/types/Calendar';
	import type { BirthdayGenerationResults } from '$lib/types/BirthdayGenerator';
	import { isOnSameDay } from '$lib/util/date';
	import BirthdayPicker from '$lib/ui/BirthdayPicker.svelte';
	import TimeLine from '$lib/ui/TimeLine.svelte';

	let { data }: { data: { birthdayGenerationResults: BirthdayGenerationResults | null } } =
		$props();


	let selectedDate: Date = $state(new Date());

	let birthdayGenerationResults: BirthdayGenerationResults | null = $derived.by(() => {
		return data.birthdayGenerationResults;
	});

	let events: CalendarEvent[] = $derived.by(() => {
		const events: CalendarEvent[] = [];
		for (const result of birthdayGenerationResults || []) {
			for (const birthday of result.birthdays) {
				events.push({
					title: birthday.title,
					start: new Date(birthday.date),
					description: birthday.description || ''
				});
			}
		}
		return events;
	});

	let eventOnSelectedDate: CalendarEvent | null = $derived.by(
		() => events.find((event) => isOnSameDay(event.start, selectedDate)) || null
	);
</script>

<BirthdayPicker/>

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

<TimeLine {events}/>
