<script lang="ts">
	import Calendar from '$lib/ui/Calendar.svelte';
	import type { CalendarEvent } from '$lib/types/CalendarEvent';
	import type { ChangeEventHandler } from 'svelte/elements';
	import { page } from '$app/state';
	import type { BirthdayGenerationResults } from '$lib/types/BirthdayGenerator';
	import { BirthdayType } from '$lib/types/BirthdayGenerator';
	import { isOnSameDay } from '$lib/util/date';

	let { data }: { data: { birthdayGenerationResults: BirthdayGenerationResults | null } } =
		$props();

	let birthdayInputString: string = $state(page.url.searchParams.get('birthday') || '');

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

	let form: HTMLFormElement;

	const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		e.currentTarget.form?.requestSubmit();
	};

	let eventOnSelectedDate: CalendarEvent | null = $derived.by(
		() => events.find((event) => isOnSameDay(event.start, selectedDate)) || null
	);
</script>

<form
	data-sveltekit-keepfocus
	class="m-4 flex items-center justify-center gap-x-8"
	bind:this={form}
>
	<div class="flex flex-col">
		<label for="birthday">Select your birthday:</label>
		<input
			class="text-primary-500"
			type="date"
			name="birthday"
			onchange={onChange}
			bind:value={birthdayInputString}
		/>
	</div>
	<div class="flex flex-col">
		<span>Show birthday types:</span>
		{#each Object.values(BirthdayType) as birthdayType (birthdayType)}
			<label class="flex items-center space-x-2">
				<input
					class="checkbox"
					type="checkbox"
					checked
					name="type"
					value={birthdayType}
					onchange={onChange}
				/>
				<p>{birthdayType}</p>
			</label>
		{/each}
	</div>
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
