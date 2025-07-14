<script lang="ts">
	import { page } from '$app/state';
	import { BirthdayType } from '$lib/types/BirthdayGenerator';
	import type { ChangeEventHandler } from 'svelte/elements';

	let form: HTMLFormElement;

	let birthdayInputString: string = $state(page.url.searchParams.get('birthday') || '');

	const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		e.currentTarget.form?.requestSubmit();
   }
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
