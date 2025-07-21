<script lang="ts">
	import { page } from '$app/state';
	import { BirthdayType } from '$lib/types/BirthdayGenerator';

	const types: BirthdayType[] = Object.values(BirthdayType);

	let { onValidationChange }: { onValidationChange?: (valid: boolean) => void } = $props();

	let birthdayInputString: string = $state(page.url.searchParams.get('birthday') || '');
	let selectedTypes: BirthdayType[] = $state(page.url.searchParams.get('types')?.split(',') as BirthdayType[] ?? types);
	let form: HTMLFormElement;

	let satisfied: boolean = $derived(validateForm());

	$effect(() => {
		onValidationChange?.(satisfied);
	});

	export function submitForm() {
		form.requestSubmit();
	}

   function validateForm(): boolean {
      return birthdayInputString !== '' && selectedTypes.length > 0;
   };

	function toggleType(type: BirthdayType) {
		const index = selectedTypes.indexOf(type);
		if (index > -1) {
			selectedTypes.splice(index, 1);
		} else {
			selectedTypes.push(type);
		}
	}
</script>

<form
	data-sveltekit-keepfocus
	class="m-4 grid grid-cols-1 items-center justify-center gap-x-8"
	bind:this={form}
>
	<div class="flex flex-col gap-2">
		<label for="birthday">Select your actual birthday:</label>
		<input
			class="text-primary-contrast-500"
			type="date"
			name="birthday"
			bind:value={birthdayInputString}
		/>
	</div>
	<div class="grid grid-cols-1 gap-2">
		<span>Show birthday types:</span>
		<div class="grid grid-flow-dense grid-cols-3 gap-2">
			{#each types as type, i (i)}
				<button
					type="button"
					class="btn {selectedTypes.includes(type)
						? 'preset-filled-primary-500'
						: 'preset-outlined-surface-500'}"
					onclick={() => toggleType(type)}>{type}</button
				>
			{/each}
		</div>
		<input type="hidden" name="types" bind:value={selectedTypes} />
	</div>
</form>
