<script lang="ts">
	import Card from '$lib/ui/Card.svelte';
	import { daysDiff, toLegibleDate } from '$lib/util/date';

	let calculateFromNow: boolean = $state(true);
	let calculateInclusive: boolean = $state(false);

	let dateSelectionFromValue: string = $state('');
	let dateSelectedFrom: Date | null = $derived(
		dateSelectionFromValue !== '' ? new Date(dateSelectionFromValue) : null
	);

	let dateSelectionToValue: string = $state('');
	let dateSelectedTo: Date | null = $derived(
		dateSelectionToValue !== '' ? new Date(dateSelectionToValue) : null
	);

	let dateFrom: Date | null = $derived.by(() => {
		if (calculateFromNow) return new Date();
		return dateSelectedFrom;
	});

	let daysSinceOrTo: number = $derived.by(() => {
		if (!dateSelectedTo || !dateFrom) return NaN;

		const daysDelta = daysDiff(dateFrom, dateSelectedTo);
		return daysDelta + (calculateInclusive ? (daysDelta < 0 ? -1 : 1) : 0);
	});

	let dayOrDays: string | null = $derived.by(() => {
		if (isNaN(daysSinceOrTo)) return null;
		return Math.abs(daysSinceOrTo) === 1 ? 'day' : 'days';
	});

	let daysSinceOrToAbsolute: number = $derived.by(() => {
		if (isNaN(daysSinceOrTo)) return NaN;
		return Math.abs(daysSinceOrTo);
	});

	let hasBeenOrhaveBeenOrIsOrAre: string | null = $derived.by(() => {
		if (isNaN(daysSinceOrTo)) return null;
		if (Math.abs(daysSinceOrTo) === 1) {
			return daysSinceOrTo < 0 ? 'has been' : 'is';
		}
		return daysSinceOrTo < 0 ? 'have been' : 'are';
	});
</script>

	<Card>
		{#snippet header()}
			Day difference calculator
		{/snippet}
		{#snippet article()}
			<form class="grid grid-cols-1 gap-y-4">
				<span class="flex flex-row items-center gap-x-4">
					<label for="calculateFromNow"
						>Calculate <span class="text-primary-500">from</span> today:</label
					>
					<input type="checkbox" id="calculateFromNow" bind:checked={calculateFromNow} />
				</span>
				<span class="flex flex-row items-center gap-x-4">
					<label for="calculateFromNow">Include start day:</label>
					<input type="checkbox" id="calculateFromNow" bind:checked={calculateInclusive} />
				</span>
				{#if !calculateFromNow}
					<span class="flex flex-row items-center gap-x-4">
						<label for="selectedFromDate"
							>Select <span class="text-primary-500">from</span>
							date:</label
						>
						<input
							type="date"
							id="selectedFromDate"
							bind:value={dateSelectionFromValue}
							class="text-primary-500"
						/>
					</span>
				{/if}

				<span class="flex flex-row items-center gap-x-4">
					<label for="selectedToDate"
						>Select <span class="text-primary-500">to</span>
						date:</label
					>
					<input
						type="date"
						id="selectedToDate"
						bind:value={dateSelectionToValue}
						class="text-primary-500"
					/>
				</span>
			</form>
			{#if (calculateFromNow && dateSelectedTo) || (!calculateFromNow && dateSelectedTo && dateSelectedFrom)}
				<p>
					There {hasBeenOrhaveBeenOrIsOrAre}
					<span class="text-primary-500">{daysSinceOrToAbsolute}</span>
					{dayOrDays}
					from
					<span class="text-primary-500">
						{toLegibleDate(dateFrom!)}
					</span>
					to
					<span class="text-primary-500">
						{toLegibleDate(dateSelectedTo)}
					</span>.
				</p>
			{/if}
		{/snippet}
	</Card>
