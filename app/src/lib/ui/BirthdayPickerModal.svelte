<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { Cake } from 'lucide-svelte';
	import BirthdayPickerForm from '$lib/ui/BirthdayPickerForm.svelte';

	let openState = $state(false);
	let birthdayPicker: BirthdayPickerForm | undefined;
	let formValidated: boolean = $state(false);

	function modalClose(confirm: boolean) {
		openState = false;
		if (confirm) birthdayPicker?.submitForm();
	}

	function handleValidationChange(valid: boolean) {
		formValidated = valid;
	}
</script>

<Modal
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	triggerBase="btn preset-filled-primary-500"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}<Cake />Pick Birthday{/snippet}
	{#snippet content()}
		<header class="flex justify-between">
			<h2 class="h2">Pick your birthday</h2>
		</header>
		<article>
			<BirthdayPickerForm bind:this={birthdayPicker} onValidationChange={handleValidationChange} />
		</article>
		<footer class="flex justify-end gap-4">
			<button type="button" class="btn preset-tonal" onclick={() => modalClose(false)}
				>Cancel</button
			>
			<button
				type="button"
				class="btn preset-filled"
				onclick={() => modalClose(true)}
				disabled={!formValidated}>Confirm</button
			>
		</footer>
	{/snippet}
</Modal>
