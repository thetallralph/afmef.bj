<script>
	import { useCms } from '$lib/cms/context.js';

	/**
	 * Galerie d'images (carrousel, bandeau…) éditable depuis /gestion/contenu.
	 * `children` reçoit la liste d'URLs à afficher : les images personnalisées
	 * si elles existent, sinon `defaults`.
	 */
	let { key, label = '', defaults = [], class: className = '', children } = $props();

	const cms = useCms();
	const images = $derived(cms.gallery[key]?.length ? cms.gallery[key] : defaults);
</script>

<div data-cms={key} data-cms-type="gallery" data-cms-label={label || undefined} class={className}>
	{@render children(images)}
</div>
