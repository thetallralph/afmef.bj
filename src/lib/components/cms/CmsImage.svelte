<script>
	import { useCms } from '$lib/cms/context.js';

	/** Image remplaçable depuis /gestion/contenu. `src` est l'image par défaut. */
	let { key, label = '', src, alt = '', class: className = '', ...rest } = $props();

	const cms = useCms();
	const finalSrc = $derived(cms.image[key] || src);
</script>

<img data-cms={key} data-cms-type="image" data-cms-label={label || undefined} src={finalSrc} {alt} class={className} {...rest} />
