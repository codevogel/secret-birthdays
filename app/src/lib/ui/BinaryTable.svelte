<script lang="ts">
	import { numToBinaryString, splitBinaryStringInZeroesAndRest } from '$lib/util/binary';
	import { daysToYears, getDateSince, toLegibleDate } from '$lib/util/date';

	let { selectedBirthday }: { selectedBirthday: Date | null } = $props();

	let table: HTMLTableElement | null;
	let scrollContainer: HTMLDivElement | null;

	const binaryData = $derived.by(() =>
		Array.from({ length: 32 + 1 }, (_, num) => {
			const binaryString = numToBinaryString(num);
			const { zeroes, rest } = splitBinaryStringInZeroesAndRest(binaryString);
			const daysAlive = Number.parseInt(binaryString, 10);
			const ageFromDaysAlive = Math.floor(daysToYears(daysAlive));
			const binaryAge = num;
			const dateOnBinaryBirthday = selectedBirthday
				? getDateSince(selectedBirthday, daysAlive)
				: null;

			return {
				stringZeroes: zeroes,
				stringRest: rest,
				daysAlive,
				ageFromDaysAlive,
				binaryAge,
				dateOnBinaryBirthday
			};
		})
	);

	const indexOfNextBinaryBirthday = $derived.by(() =>
		binaryData.findIndex(
         (data) => data.dateOnBinaryBirthday && data.dateOnBinaryBirthday > new Date() 
      )
	);

	$effect(() => {
		if (selectedBirthday && table) {
			const rows = table.querySelectorAll('tbody > tr') as NodeListOf<HTMLElement>;
			const targetRow = rows[indexOfNextBinaryBirthday];
			const scrollContainer = table.parentElement;

			if (targetRow && scrollContainer instanceof HTMLElement) {
				const rowOffsetTop = targetRow.offsetTop;
				const rowHeight = targetRow.offsetHeight;
				const containerHeight = scrollContainer.clientHeight;

				// Scroll so the row is vertically centered
				scrollContainer.scrollTo({
					top: rowOffsetTop - containerHeight / 2 + rowHeight / 2,
					behavior: 'smooth'
				});
			}
		}
	});
</script>

<div
	class="border-primary-400 h-96 table-auto overflow-scroll rounded-2xl border-1 max-w-md"
	bind:this={scrollContainer}
>
	<table class="text-s table caption-bottom" bind:this={table}>
		{#if selectedBirthday}
			<caption class="body-background-color-dark sticky bottom-0 pt-4"
				><span
					>The <span class="preset-filled-secondary-100-900">highlighted</span> row indicates your
					next binary birthday.</span
				>
			</caption>
		{/if}
		<thead class="body-background-color-dark sticky top-0 z-10">
			<tr class="text-primary-500">
				<th>Days Alive</th>
				<th>Binary Age</th>
				<th>Normal Age</th>
				{#if selectedBirthday}
					<th>Binary Birthday*</th>
				{/if}
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#each binaryData as data, index (index)}
				<tr
					class={index === indexOfNextBinaryBirthday
						? 'preset-filled-secondary-100-900'
						: ''}
				>
					<td
						><span class="text-surface-800">{data.stringZeroes}</span><span
							>{data.stringRest}</span
						></td
					>
					<td>{data.binaryAge}</td>
					<td>{data.ageFromDaysAlive}</td>
					{#if data.dateOnBinaryBirthday}
						<td>{toLegibleDate(data.dateOnBinaryBirthday)}</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
