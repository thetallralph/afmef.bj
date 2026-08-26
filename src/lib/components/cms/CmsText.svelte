<script>
	import { useCms } from '$lib/cms/context.js';

	/**
	 * Texte éditable depuis /gestion/contenu.
	 * Le contenu passé en enfant sert de valeur par défaut ET de valeur affichée
	 * dans l'admin tant qu'aucune surcharge n'existe.
	 */
	let { key, label = '', tag = 'span', class: className = '', children, ...rest } = $props();

	const cms = useCms();
	const value = $derived(cms.text[key]);
</script>

<svelte:element
	this={tag}
	data-cms={key}
	data-cms-type="text"
	data-cms-label={label || undefined}
	class={className}
	{...rest}
>{#if value}{value}{:else}{@render children()}{/if}</svelte:element>
