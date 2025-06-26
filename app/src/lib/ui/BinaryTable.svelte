<script lang="ts">
	import { numToBinaryString } from '$lib/util/binary';
	import { daysToYears, getDateSince } from '$lib/util/date';

	let { selectedBirthday }: { selectedBirthday: Date | null } = $props();

	const binaryData = Array.from({ length: 32 }, (_, index) => {
		const binaryString = numToBinaryString(index);
		const binaryStringZeroes = binaryString.match(/0+/)?.join('') || '';
		const binaryStringRest = index === 0 ? '' : binaryString.slice(binaryString.indexOf('1'));
		const daysAlive = Number.parseInt(binaryString, 10);
		const ageFromDaysAlive = Math.floor(daysToYears(daysAlive));
		const binaryAge = index;

		return {
			binaryStringZeroes,
			binaryStringRest,
			daysAlive,
			ageFromDaysAlive,
			binaryAge
		};
	});
</script>

<div class="h-80 table-auto overflow-y-scroll font-mono">
	<table class="table caption-bottom">
		<thead class="body-background-color-dark sticky top-0 z-10">
			<tr class="text-primary-500">
				<th>Days Alive</th>
				<th>Binary Age</th>
				{#if selectedBirthday}
					<th>Binary Birthday*</th>
				{/if}
				<th>Normal Age</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#each binaryData as data, index (index)}
				<tr>
					<td
						><span class="text-surface-800">{data.binaryStringZeroes}</span><span
							>{data.binaryStringRest}</span
						></td
					>
					<td>{data.binaryAge}</td>
					{#if selectedBirthday}
						{@const dateOnBinaryBirthday = getDateSince(
							selectedBirthday,
							data.daysAlive
						).toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
						<td>{dateOnBinaryBirthday}</td>
					{/if}
					<td>{data.ageFromDaysAlive}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
