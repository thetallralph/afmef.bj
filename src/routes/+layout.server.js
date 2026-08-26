import { loadCmsOverrides } from '$lib/cms/load.js';
import { pageIdFromPath } from '$lib/cms/pages.js';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ url }) {
	const pageId = pageIdFromPath(url.pathname);

	// ?cms=defaults rend la page sans aucune personnalisation : c'est ainsi que
	// l'éditeur /gestion/contenu découvre les valeurs par défaut des gabarits.
	const withoutOverrides = url.searchParams.get('cms') === 'defaults';

	return {
		cms:
			pageId && !withoutOverrides
				? await loadCmsOverrides(pageId)
				: { text: {}, image: {}, gallery: {} }
	};
}
