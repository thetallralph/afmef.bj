<script>
	import { useCms } from '$lib/cms/context.js';

	/** Bloc de texte enrichi (HTML) éditable depuis /gestion/contenu. */
	let { key, label = '', class: className = '', children } = $props();

	const cms = useCms();
	const value = $derived(cms.text[key]);
</script>

<div data-cms={key} data-cms-type="richtext" data-cms-label={label || undefined} class={className}>
	{#if value}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html value}
	{:else}
		{@render children()}
	{/if}
</div>
