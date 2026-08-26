/**
 * Registre des pages éditables depuis /gestion/contenu.
 *
 * `id`    : valeur stockée dans cms_content.page, préfixe des clés de champs.
 * `path`  : URL publique que l'admin charge pour découvrir les champs `data-cms`.
 * `label` : nom affiché dans l'onglet.
 */

/** @typedef {{ id: string, path: string, label: string, group: string }} CmsPage */

/** @type {CmsPage[]} */
export const CMS_PAGES = [
	{ id: 'accueil', path: '/', label: 'Accueil', group: 'Principales' },
	{ id: 'genese', path: '/a-propos/genese', label: 'Genèse', group: 'À propos' },
	{
		id: 'vision-objectifs',
		path: '/a-propos/vision-objectifs',
		label: 'Vision & objectifs',
		group: 'À propos'
	},
	{ id: 'gouvernance', path: '/a-propos/gouvernance', label: 'Gouvernance', group: 'À propos' },
	{
		id: 'equipe-dirigeante',
		path: '/a-propos/equipe-dirigeante',
		label: 'Équipe dirigeante',
		group: 'À propos'
	},
	{ id: 'logo', path: '/a-propos/logo', label: 'Logo', group: 'À propos' },
	{ id: 'activites', path: '/activites', label: 'Activités', group: 'Principales' },
	{ id: 'ressources', path: '/ressources', label: 'Ressources', group: 'Principales' },
	{ id: 'adhesion', path: '/adhesion', label: 'Adhésion', group: 'Principales' },
	{ id: 'don', path: '/faire-un-don', label: 'Faire un don', group: 'Principales' },
	{ id: 'contact', path: '/contact', label: 'Contact', group: 'Principales' }
];

/**
 * Retourne l'identifiant de page CMS correspondant à une URL publique.
 * @param {string} pathname
 * @returns {string|null}
 */
export function pageIdFromPath(pathname) {
	const normalized = pathname.replace(/\/+$/, '') || '/';
	const match = CMS_PAGES.find((p) => p.path === normalized);
	return match?.id ?? null;
}

/**
 * @param {string} id
 * @returns {CmsPage|undefined}
 */
export function cmsPageById(id) {
	return CMS_PAGES.find((p) => p.id === id);
}
