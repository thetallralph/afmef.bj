/**
 * Service pour l'API PocketBase - afmef.bj
 * Remplacement du service wordpress.js
 *
 * Fonctionne côté client (navigateur) et côté serveur (SSR).
 * Utilise PUBLIC_POCKETBASE_URL (disponible des deux côtés via $env/dynamic/public).
 * Côté serveur, on tente d'utiliser POCKETBASE_URL (réseau Docker interne) en priorité.
 */

import PocketBase from 'pocketbase';
import { env as publicEnv } from '$env/dynamic/public';

/** URL PocketBase */
const PB_URL = publicEnv.PUBLIC_POCKETBASE_URL || 'https://afmef.bj';

/** Singleton PocketBase */
let pbInstance;

function getPB() {
	if (!pbInstance) {
		pbInstance = new PocketBase(PB_URL);
	}
	return pbInstance;
}

/**
 * Construit l'URL publique d'un fichier PocketBase.
 * Format : {PUBLIC_PB_URL}/api/files/{collectionId}/{recordId}/{filename}
 */
function getFileUrl(record, filename) {
	if (!filename) return null;
	return `${PB_URL}/api/files/${record.collectionId}/${record.id}/${filename}`;
}

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Décode les entités HTML
 * @param {string} text
 * @returns {string}
 */
function decodeHtmlEntities(text) {
	if (!text) return '';
	return text
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
		.replace(/&#x([0-9A-Fa-f]+);/g, (_, code) =>
			String.fromCharCode(parseInt(code, 16))
		)
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&rsquo;/g, '\u2019')
		.replace(/&lsquo;/g, '\u2018')
		.replace(/&rdquo;/g, '\u201D')
		.replace(/&ldquo;/g, '\u201C')
		.replace(/&ndash;/g, '\u2013')
		.replace(/&mdash;/g, '\u2014')
		.replace(/&hellip;/g, '\u2026')
		.replace(/&nbsp;/g, ' ');
}

/**
 * Extrait un texte propre du contenu HTML pour l'aperçu
 * @param {string} html
 * @param {number} maxLength
 * @returns {string}
 */
function extractExcerpt(html, maxLength = 160) {
	if (!html) return '';

	let text = html
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
		.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	text = decodeHtmlEntities(text);

	if (text.length > maxLength) {
		text = text.substring(0, maxLength);
		const lastSpace = text.lastIndexOf(' ');
		if (lastSpace > maxLength * 0.8) {
			text = text.substring(0, lastSpace);
		}
		text += '\u2026';
	}

	return text;
}

// ─── Formatters ──────────────────────────────────────────────

/**
 * Formate un enregistrement PocketBase activite en objet identique
 * à ce que retournait le service WordPress.
 */
function formatActivite(record) {
	// Image
	let image = null;
	if (record.image) {
		const url = getFileUrl(record, record.image);
		image = {
			url,
			alt: record.imageAlt || '',
			sizes: {}
		};
	}

	// Types (relation expand)
	let types = [];
	if (record.expand?.types) {
		const expanded = Array.isArray(record.expand.types)
			? record.expand.types
			: [record.expand.types];
		types = expanded.map((t) => ({
			id: t.id,
			name: decodeHtmlEntities(t.name),
			slug: t.slug
		}));
	}

	// Excerpt : utiliser le champ excerpt de PB, sinon extraire du contenu
	const excerpt = record.excerpt
		? decodeHtmlEntities(record.excerpt)
		: extractExcerpt(record.content, 180);

	return {
		id: record.id,
		slug: record.slug,
		title: decodeHtmlEntities(record.title),
		content: record.content,
		excerpt,
		date: record.date,
		image,
		types,
		link: `/activites/${record.slug}`
	};
}

/**
 * Formate un enregistrement PocketBase ressource.
 */
function formatRessource(record) {
	let fichier = null;
	if (record.fichier) {
		const url = getFileUrl(record, record.fichier);
		fichier = {
			url,
			filename: record.fichier,
			filesize: null,
			type: record.fichierType || 'pdf'
		};
	}

	const description = record.description
		? decodeHtmlEntities(record.description)
		: '';

	return {
		id: record.id,
		slug: record.slug,
		title: decodeHtmlEntities(record.title),
		description,
		date: record.date,
		fichier,
		link: `/ressources/${record.slug}`
	};
}

// ─── Public API ──────────────────────────────────────────────

/**
 * Récupère les activités depuis PocketBase
 * @param {Object} options
 * @param {number} [options.perPage=10]
 * @param {number} [options.page=1]
 * @param {string} [options.typeActivite] - slug du type d'activité pour filtrer
 * @returns {Promise<{activites: Array, total: number, totalPages: number}>}
 */
export async function getActivites({ perPage = 10, page = 1, typeActivite } = {}) {
	try {
		const pb = getPB();

		let filter = '';
		if (typeActivite) {
			filter = `types.slug = "${typeActivite}"`;
		}

		const result = await pb.collection('activites').getList(page, perPage, {
			sort: '-date',
			expand: 'types',
			filter
		});

		const activites = result.items.map(formatActivite);

		return {
			activites,
			total: result.totalItems,
			totalPages: result.totalPages
		};
	} catch (error) {
		console.error('Erreur getActivites:', error);
		return { activites: [], total: 0, totalPages: 0 };
	}
}

/**
 * Récupère une activité par son slug
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getActiviteBySlug(slug) {
	try {
		const pb = getPB();

		const record = await pb
			.collection('activites')
			.getFirstListItem(`slug = "${slug}"`, {
				expand: 'types'
			});

		return formatActivite(record);
	} catch (error) {
		// PocketBase lance une erreur 404 si non trouvé
		if (error?.status === 404) {
			return null;
		}
		console.error('Erreur getActiviteBySlug:', error);
		return null;
	}
}

/**
 * Récupère les types d'activités
 * @returns {Promise<Array>}
 */
export async function getTypesActivites() {
	try {
		const pb = getPB();

		const records = await pb.collection('type_activites').getFullList({
			sort: 'name'
		});

		// Pour chaque type, compter le nombre d'activités
		const types = await Promise.all(
			records.map(async (type) => {
				let count = 0;
				try {
					const result = await pb.collection('activites').getList(1, 1, {
						filter: `types.id = "${type.id}"`
					});
					count = result.totalItems;
				} catch {
					// Ignorer les erreurs de comptage
				}

				return {
					id: type.id,
					name: decodeHtmlEntities(type.name),
					slug: type.slug,
					count
				};
			})
		);

		return types;
	} catch (error) {
		console.error('Erreur getTypesActivites:', error);
		return [];
	}
}

/**
 * Récupère les ressources depuis PocketBase
 * @param {Object} options
 * @param {number} [options.perPage=20]
 * @param {number} [options.page=1]
 * @returns {Promise<{ressources: Array, total: number, totalPages: number}>}
 */
export async function getRessources({ perPage = 20, page = 1 } = {}) {
	try {
		const pb = getPB();

		const result = await pb.collection('ressources').getList(page, perPage, {
			sort: '-date'
		});

		const ressources = result.items.map(formatRessource);

		return {
			ressources,
			total: result.totalItems,
			totalPages: result.totalPages
		};
	} catch (error) {
		console.error('Erreur getRessources:', error);
		return { ressources: [], total: 0, totalPages: 0 };
	}
}
