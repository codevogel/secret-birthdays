<script lang="ts">
	import { page } from '$app/state';
	import { BirthdayType } from '$lib/types/BirthdayGenerator';
	import type { ChangeEventHandler } from 'svelte/elements';
	import Collapsible from './Collapsible.svelte';
	import { Cake, Option, Settings } from 'lucide-svelte';

	let form: HTMLFormElement;

	let birthdayInputString: string = $state(page.url.searchParams.get('birthday') || '');

	const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		e.currentTarget.form?.requestSubmit();
	};
</script>

<Collapsible>
   {#snippet lead()}
      <Cake/>
   {/snippet}
   {#snippet control()}
      <span>Pick birthday</span> 
   {/snippet}
	{#snippet panel()}
		<form
			data-sveltekit-keepfocus
			class="m-4 flex items-center justify-center gap-x-8"
			bind:this={form}
		>
			<div class="flex flex-col gap-2">
				<label for="birthday">Select your actual birthday:</label>
				<input
					class="text-primary-contrast-500"
					type="date"
					name="birthday"
					onchange={onChange}
					bind:value={birthdayInputString}
				/>
			</div>
			<div class="flex flex-col gap-2">
				<span>Show birthday types:</span>
				{#each Object.values(BirthdayType) as birthdayType (birthdayType)}
					<label class="flex items-center space-x-2">
						<input
							class="bg-secondary-500"
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
	{/snippet}
</Collapsible>
