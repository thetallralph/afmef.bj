/**
 * Registre des collections de contenu éditables depuis /gestion/contenu/<slug>.
 *
 * Un seul jeu de routes génériques (liste + formulaire) est piloté par ces
 * définitions : ajouter une collection ne demande qu'une entrée ici.
 *
 * Types de champs : text, textarea, richtext, date, number, select, bool, file, relation.
 */

/** @typedef {{ name: string, label: string, type: string, [x: string]: any }} ContentField */

export const CONTENT_COLLECTIONS = {
	activites: {
		collection: 'activites',
		label: 'Activités',
		singular: 'Activité',
		description: "Actualités et activités publiées sur le site et la page d'accueil.",
		sort: '-date',
		publicPath: (record) => `/activites/${record.slug}`,
		searchFields: ['title', 'excerpt'],
		listColumns: [
			{ name: 'title', label: 'Titre', type: 'title' },
			{ name: 'date', label: 'Date', type: 'date' },
			{ name: 'types', label: 'Catégories', type: 'relation' }
		],
		fields: [
			{ name: 'title', label: 'Titre', type: 'text', required: true },
			{
				name: 'slug',
				label: 'Identifiant dans l’URL',
				type: 'text',
				required: true,
				slugFrom: 'title',
				help: 'Adresse publique : /activites/<identifiant>. Minuscules et tirets uniquement.'
			},
			{ name: 'date', label: 'Date de publication', type: 'date', required: true },
			{
				name: 'excerpt',
				label: 'Résumé',
				type: 'textarea',
				help: 'Texte affiché dans les listes et sur la page d’accueil.'
			},
			{ name: 'content', label: 'Contenu', type: 'richtext' },
			{
				name: 'image',
				label: 'Image de couverture',
				type: 'file',
				accept: 'image/jpeg,image/png,image/webp',
				preview: true,
				help: 'JPG, PNG ou WebP — 5 Mo maximum.'
			},
			{ name: 'imageAlt', label: 'Description de l’image', type: 'text' },
			{
				name: 'types',
				label: 'Catégories',
				type: 'relation',
				collection: 'type_activites',
				multiple: true,
				display: 'name'
			}
		]
	},

	ressources: {
		collection: 'ressources',
		label: 'Ressources',
		singular: 'Ressource',
		description: 'Documents PDF téléchargeables depuis la page Ressources.',
		sort: '-date',
		searchFields: ['title', 'description'],
		listColumns: [
			{ name: 'title', label: 'Titre', type: 'title' },
			{ name: 'date', label: 'Date', type: 'date' },
			{ name: 'fichier', label: 'Fichier', type: 'file' }
		],
		fields: [
			{ name: 'title', label: 'Titre', type: 'text', required: true },
			{
				name: 'slug',
				label: 'Identifiant dans l’URL',
				type: 'text',
				required: true,
				slugFrom: 'title'
			},
			{ name: 'description', label: 'Description', type: 'textarea' },
			{ name: 'date', label: 'Date', type: 'date' },
			{
				name: 'fichier',
				label: 'Fichier PDF',
				type: 'file',
				accept: 'application/pdf',
				help: 'PDF — 10 Mo maximum.'
			},
			{
				name: 'fichierType',
				label: 'Type de fichier',
				type: 'text',
				default: 'pdf',
				help: 'Laisser « pdf » sauf cas particulier.'
			}
		]
	},

	categories: {
		collection: 'type_activites',
		label: 'Catégories d’activités',
		singular: 'Catégorie',
		description: 'Étiquettes utilisées pour classer les activités.',
		sort: 'name',
		searchFields: ['name'],
		listColumns: [
			{ name: 'name', label: 'Nom', type: 'title' },
			{ name: 'slug', label: 'Identifiant', type: 'text' }
		],
		fields: [
			{ name: 'name', label: 'Nom', type: 'text', required: true },
			{
				name: 'slug',
				label: 'Identifiant',
				type: 'text',
				required: true,
				slugFrom: 'name',
				help: 'Utilisé dans les filtres : /activites?type=<identifiant>.'
			}
		]
	},

	documents: {
		collection: 'documents',
		label: 'Documents membres',
		singular: 'Document',
		description: 'Fichiers réservés à l’espace membre (rapports, PV, supports de formation).',
		sort: '-created',
		searchFields: ['title', 'description'],
		listColumns: [
			{ name: 'title', label: 'Titre', type: 'title' },
			{ name: 'category', label: 'Catégorie', type: 'text' },
			{ name: 'file', label: 'Fichier', type: 'file' }
		],
		fields: [
			{ name: 'title', label: 'Titre', type: 'text', required: true },
			{ name: 'description', label: 'Description', type: 'textarea' },
			{
				name: 'file',
				label: 'Fichier',
				type: 'file',
				required: true,
				help: '10 Mo maximum.'
			},
			{
				name: 'category',
				label: 'Catégorie',
				type: 'select',
				options: [
					{ value: 'rapport', label: 'Rapport' },
					{ value: 'pv', label: 'Procès-verbal' },
					{ value: 'formation', label: 'Formation' },
					{ value: 'autre', label: 'Autre' }
				]
			}
		]
	},

	evenements: {
		collection: 'events',
		label: 'Événements',
		singular: 'Événement',
		description: 'Événements annoncés dans l’espace membre.',
		sort: '-date',
		searchFields: ['title', 'location'],
		listColumns: [
			{ name: 'title', label: 'Titre', type: 'title' },
			{ name: 'date', label: 'Date', type: 'date' },
			{ name: 'location', label: 'Lieu', type: 'text' }
		],
		fields: [
			{ name: 'title', label: 'Titre', type: 'text', required: true },
			{ name: 'slug', label: 'Identifiant', type: 'text', required: true, slugFrom: 'title' },
			{ name: 'date', label: 'Début', type: 'date', required: true },
			{ name: 'endDate', label: 'Fin', type: 'date' },
			{ name: 'location', label: 'Lieu', type: 'text' },
			{ name: 'description', label: 'Description', type: 'richtext' },
			{
				name: 'image',
				label: 'Visuel',
				type: 'file',
				accept: 'image/jpeg,image/png,image/webp',
				preview: true
			},
			{ name: 'maxParticipants', label: 'Places disponibles', type: 'number' }
		]
	}
};

/** @param {string} slug */
export function getContentCollection(slug) {
	return CONTENT_COLLECTIONS[slug] ?? null;
}

/** Liste ordonnée pour la navigation. */
export const CONTENT_COLLECTION_LIST = Object.entries(CONTENT_COLLECTIONS).map(
	([slug, definition]) => ({ slug, ...definition })
);

/**
 * Normalise un titre en identifiant d'URL.
 * @param {string} value
 */
export function slugify(value) {
	return (value || '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}
