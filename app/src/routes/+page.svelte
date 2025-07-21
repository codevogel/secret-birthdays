<script lang="ts">
	import BirthdayPickerModal from '$lib/ui/BirthdayPickerModal.svelte';

	import Calendar from '$lib/ui/Calendar.svelte';
	import type { CalendarEvent } from '$lib/types/Calendar';
	import type { BirthdayGenerationResults } from '$lib/types/BirthdayGenerator';
	import { isOnSameDay } from '$lib/util/date';
	import TimeLine from '$lib/ui/TimeLine.svelte';
	import CalendarTimeLineSwitch from '$lib/ui/CalendarTimeLineSwitch.svelte';
	import BirthdayCard from '$lib/ui/BirthdayCard.svelte';

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
					date: new Date(birthday.date),
					description: birthday.description || ''
				});
			}
		}
		return events;
	});

	let eventsOnSelectedDate: CalendarEvent[] = $derived.by(
		() => events.filter((event) => isOnSameDay(event.date, selectedDate)) || null
	);

	let mode: 'calendar' | 'timeline' = $state('calendar');
</script>

<div class="grid min-h-full grid-cols-1 items-center p-4">
	{#if birthdayGenerationResults}
		<div class="flex flex-row justify-between">
			<BirthdayPickerModal />
			<CalendarTimeLineSwitch bind:mode />
		</div>
		{#if mode === 'calendar'}
			<Calendar bind:selectedDate {events} />

			<div class="m-4 flex flex-col items-center justify-center text-left">
				<div class="flex flex-col gap-4">
					{#if eventsOnSelectedDate.length > 0}
						<strong>On this date:</strong>
						{#each eventsOnSelectedDate as event, i (i)}
							<BirthdayCard {event} />
						{/each}
					{:else}
						<p class="text-primary-500">You have no secret birthdays on this date.</p>
						<p class="text-surface-300 text-[.75rem]">
							Dates with secret birthdays are <span class="rounded-md border-1 p-1"
								>bordered</span
							>
						</p>
					{/if}
				</div>
			</div>
		{:else}
			<TimeLine {events} />
		{/if}
	{:else}
		<div class="grid max-w-md grid-cols-1 place-items-center gap-4 text-center">
			<strong class="text-xl">Discover your secret birthdays!</strong>
			<p>You’ve had more birthdays than you think.</p>
			<p>
				Sure, we celebrate our birthday every <span class="code bg-primary-500"
					>365.25 days</span
				>...<br />But what about your
				<span class="code">1,000th day</span>?<br />Or turning
				<span class="code">3 π-years</span>
				old on day
				<span class="code">314</span>?
			</p>
			<p>
				Enter your birth date to reveal fun life milestones based on primes, palindromes, binary
				numbers, and more.
			</p>
			<BirthdayPickerModal />
		</div>
	{/if}
</div>
