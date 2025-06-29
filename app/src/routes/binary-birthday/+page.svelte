<script lang="ts">
	import BinaryTable from '$lib/ui/BinaryTable.svelte';
	import Card from '$lib/ui/Card.svelte';
	import {
		getNextBase10WithOnlyBinaryDigits,
		getPreviousBase10WithOnlyBinaryDigits,
		stringIsBinaryNumber
	} from '$lib/util/binary';
	import { toLegibleDate, daysSince, addDays } from '$lib/util/date';
	import { onMount } from 'svelte';

	onMount(() => {});

	let birthdaySelection: string = $state('01-04-1998'); // Default date for testing
	let birthDay: Date | null = $derived(
		birthdaySelection !== '' ? new Date(birthdaySelection) : null
	);
	let daysAlive: number = $derived(birthDay ? daysSince(birthDay) : 0);

	let todayIsBinaryBirthday: boolean = $derived(stringIsBinaryNumber(daysAlive.toString()));

	// Calculate data about the previous binary birthday
	let daysSincePreviousBinaryBirthday: number = $derived(
		daysAlive - getPreviousBase10WithOnlyBinaryDigits(daysAlive)
	);
	let daysAliveOnPreviousBinaryBirthday: number = $derived(
		daysAlive - daysSincePreviousBinaryBirthday
	);
	let dateOnPreviousBinaryBirthday: Date | null = $derived(
		birthDay ? addDays(birthDay, daysAliveOnPreviousBinaryBirthday) : null
	);

	// Calculate data about the next binary birthday
	let daysToNextBinaryBirthday: number = $derived(
		getNextBase10WithOnlyBinaryDigits(daysAlive) - daysAlive
	);
	let daysAliveOnNextBinaryBirthday: number = $derived(daysAlive + daysToNextBinaryBirthday);
	let dateOnNextBinaryBirthday: Date | null = $derived(
		birthDay ? addDays(birthDay, daysAlive + daysToNextBinaryBirthday) : null
	);
</script>

<div class="grid grid-cols-1 place-items-center gap-y-4 p-4">
	<p>
		Your <span class="text-primary-500">binary birthday</span> occurs when <span class="text-secondary-100">the number of days you have been alive for spells out a binary number</span>.<br/>
		Enter your birthday below to find out when your next binary birthday occurs.
	</p>
	<form class="grid grid-cols-1 items-center space-y-2 space-x-4">
		<label for="date">Select your birthday:</label>
		<input
			class="text-primary-500 max-w-48"
			type="date"
			id="date"
			bind:value={birthdaySelection}
		/>
	</form>
	<div class="grid grid-cols-1 gap-y-4">
		{#if !birthDay}
			<div class="p-2">
				<p>Please select your birthday.</p>
			</div>
		{:else}
			<div class="p-2">
				<p>
					Your birthday was <span class="text-primary-500">{daysAlive}</span> days ago.
				</p>
				{#if todayIsBinaryBirthday}
					<p>
						That <span class="text-success-300">does</span> spells out a binary number, so today
						is your binary birthday 🥳!
					</p>
					<p>
						Today, you turned <span class="text-primary-500"
							>{parseInt(daysAlive.toString(), 2)}</span
						> years old, in binary age.
					</p>
				{:else}
					<p>
						Sadly, that does <span class="text-error-300">not</span> spell out a binary number,
						so your binary birthday is not today.
					</p>
				{/if}
			</div>
			<Card headerBase="h4 px-4 mb-2" articleBase="px-4" baseExtension="divide-none p-4">
				{#snippet header()}
					Last Binary Birthday
				{/snippet}
				{#snippet article()}
					<p>
						Your last binary birthday was <span class="text-primary-500">
							{daysSincePreviousBinaryBirthday}
						</span> days ago.
					</p>
					<p>
						It fell on <span class="text-primary-500">
							{dateOnPreviousBinaryBirthday
								? toLegibleDate(dateOnPreviousBinaryBirthday)
								: 'NULL'}
						</span>.
						<br />
						You were
						<span class="text-primary-500">
							{daysAliveOnPreviousBinaryBirthday}
						</span>
						days old on that day.
					</p>
				{/snippet}
			</Card>
			<Card headerBase="h4 px-4 mb-2" articleBase="px-4" baseExtension="divide-none p-4">
				{#snippet header()}
					Next Binary Birthday
				{/snippet}
				{#snippet article()}
					<p>
						Your next binary birthday will be in <span class="text-primary-500"
							>{daysToNextBinaryBirthday}</span
						> days.
					</p>
					<p>
						That falls on <span class="text-primary-500"
							>{dateOnNextBinaryBirthday
								? toLegibleDate(dateOnNextBinaryBirthday)
								: 'NULL'}</span
						>.
						<br />
						You would be
						<span class="text-primary-500">{daysAliveOnNextBinaryBirthday}</span>
						days old on that day.
					</p>
				{/snippet}
			</Card>
			<BinaryTable selectedBirthday={birthDay} />
		{/if}
	</div>
</div>
