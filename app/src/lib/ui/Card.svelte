<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		base = 'card flex flex-col gap-y-2 p-4 preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 block h-fit max-w-md border-[1px]',
		baseExtension = '',
		headerBase = 'font-bold',
		headerExtension = '',
		articleBase = '',
		articleExtension = '',
		footerBase = '',
		footerExtension = '',
		header,
		article,
		footer
	}: {
		base?: string;
		baseExtension?: string;
		headerBase?: string;
		headerExtension?: string;
		articleBase?: string;
		articleExtension?: string;
		footerBase?: string;
		footerExtension?: string;
		header?: Snippet;
		article?: Snippet;
		footer?: Snippet;
	} = $props();
</script>

<div class="{base} {baseExtension}">
	{#if header}
		<header class="{headerBase} {headerExtension}">
			{@render header()}
		</header>
	{/if}
	{#if article}
		<article class="{articleBase} {articleExtension}">
			{@render article()}
		</article>
	{/if}
	{#if footer}
		<footer class="{footerBase} {footerExtension}">
			{@render footer()}
		</footer>
	{/if}
</div>
