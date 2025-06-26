<script lang="ts">
	import BinaryTable from '$lib/ui/BinaryTable.svelte';
	import moment from 'moment';
	import { stringIsBinaryNumber } from '$lib/util/binary';

	let birthdaySelection: string = $state('1998-01-04');
	let birthDay: Date | null = $derived(
		birthdaySelection !== '' ? new Date(birthdaySelection) : null
	);

	let daysSinceBirthday: number = $derived(birthDay ? moment().diff(moment(birthDay), 'days') : 0);

	let todayIsBinaryBirthday: boolean = $derived(
		stringIsBinaryNumber(daysSinceBirthday.toString())
	);

	let daysSincePreviousBinaryBirthday: number = $derived.by(() => {
		let extraDays = 0;
		while (true) {
			let previousBirthday = daysSinceBirthday - extraDays;
			if (previousBirthday < 0) {
				return 0; // No previous binary birthday
			}
			if (stringIsBinaryNumber(previousBirthday.toString())) {
				return extraDays;
			}
			extraDays++;
		}
	});

	let daysToNextBinaryBirthday: number = $derived.by(() => {
		let extraDays = 0;
		while (true) {
			let nextBirthday = daysSinceBirthday + extraDays;
			if (stringIsBinaryNumber(nextBirthday.toString())) {
				return extraDays;
			}
			extraDays++;
		}
	});

	let dateOnPreviousBinaryBirthday: Date = $derived(
		moment().subtract(daysSincePreviousBinaryBirthday, 'days').toDate()
	);

	let dateOnNextBinaryBirthday: Date = $derived(
		moment().add(daysToNextBinaryBirthday, 'days').toDate()
	);

	let daysSinceOnPreviousBinaryBirthday: number = $derived(
		daysSinceBirthday - daysSincePreviousBinaryBirthday
	);

	let daysSinceOnNextBinaryBirthday: number = $derived(
		daysSinceBirthday + daysToNextBinaryBirthday
	);
</script>

<div class="grid grid-cols-[auto_1fr_auto] gap-x-8">
	<div>
		<form class="grid grid-cols-1 items-center space-y-2 space-x-4">
			<label for="date">Select your birthday:</label>
			<input type="date" id="date" bind:value={birthdaySelection} />
		</form>
	</div>
	<div>
		<div class="p-2">
			<p>
				Your birthday was <span class="text-primary-500">{daysSinceBirthday}</span> days ago.
			</p>
		</div>
		<div class="p-2">
			{#if todayIsBinaryBirthday}
				<p>That <span class="text-success-300">does</span> spells out a binary number!</p>
				<p>
					Today, according to your binary birthday, you are <span class="text-primary-500"
						>{parseInt(daysSinceBirthday.toString(), 2)}</span
					> years old
				</p>
			{:else}
				<p>
					Sadly, that does <span class="text-error-300">not</span> spell out a binary number,<br
					/> so your binary birthday is not today.
				</p>
			{/if}
		</div>
		<div class="p-2">
			<h1 class="text-secondary-200 text-lg font-extrabold">Last Binary Birthday</h1>
			<p>
				Your last binary birthday was <span class="text-primary-500">
					{daysSincePreviousBinaryBirthday}
				</span> days ago.
			</p>
			<p>
				It fell on <span class="text-primary-500">
					{dateOnPreviousBinaryBirthday.toLocaleDateString()}
				</span>.
				<br />
				You were
				<span class="text-primary-500">
					{daysSinceOnPreviousBinaryBirthday}
				</span>
				days old on that day.
			</p>
		</div>
		<div class="p-2">
			<h1 class="text-secondary-200 text-lg font-extrabold">Next Binary Birthday</h1>
			<p>
				Your next binary birthday will be in <span class="text-primary-500"
					>{daysToNextBinaryBirthday}</span
				> days.
			</p>
			<p>
				That falls on <span class="text-primary-500"
					>{dateOnNextBinaryBirthday.toLocaleDateString()}</span
				>.
				<br />
				You would be <span class="text-primary-500">{daysSinceOnNextBinaryBirthday}</span> days old
				on that day.
			</p>
		</div>
	</div>

	<BinaryTable selectedBirthday={birthDay} />
</div>
