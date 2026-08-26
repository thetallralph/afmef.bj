import { createPB, fileUrl } from '$lib/server/pb-admin.js';

/** @typedef {import('./context.js').CmsData} CmsData */

/** @returns {CmsData} */
function emptyData() {
	return { text: {}, image: {}, gallery: {} };
}

/**
 * @param {CmsData} data
 * @param {import('pocketbase').RecordModel} record
 */
function applyRecord(data, record) {
	const key = record.key;
	const type = record.type;
	if (!key) return;

	if (type === 'image' && record.image) {
		data.image[key] = fileUrl(record, record.image);
	} else if (type === 'gallery' && Array.isArray(record.images) && record.images.length > 0) {
		data.gallery[key] = record.images.map((f) => fileUrl(record, f));
	} else if ((type === 'text' || type === 'richtext') && record.value) {
		data.text[key] = record.value;
	}
}

/**
 * Charge les surcharges CMS d'une page.
 * Retourne des surcharges vides si la collection n'existe pas ou si PocketBase est indisponible :
 * les valeurs par défaut inscrites dans les gabarits prennent alors le relais.
 * @param {string} page
 * @returns {Promise<CmsData>}
 */
export async function loadCmsOverrides(page) {
	const data = emptyData();
	try {
		const records = await createPB()
			.collection('cms_content')
			.getFullList({ filter: `page = "${page}"` });
		for (const record of records) applyRecord(data, record);
	} catch {
		// Collection absente ou PocketBase indisponible — on garde les défauts.
	}
	return data;
}

/**
 * Charge toutes les surcharges, regroupées par page, pour l'éditeur /gestion/contenu.
 * @returns {Promise<Record<string, Record<string, {
 *   id: string, type: string, value: string, imageUrl: string, galleryUrls: string[], filenames: string[]
 * }>>>}
 */
export async function loadCmsEntriesByPage() {
	/** @type {Record<string, Record<string, any>>} */
	const byPage = {};
	try {
		const records = await createPB().collection('cms_content').getFullList({ sort: 'page,key' });
		for (const record of records) {
			if (!record.page || !record.key) continue;
			const images = Array.isArray(record.images) ? record.images : [];
			byPage[record.page] ??= {};
			byPage[record.page][record.key] = {
				id: record.id,
				type: record.type || 'text',
				value: record.value || '',
				imageUrl: record.image ? fileUrl(record, record.image) : '',
				galleryUrls: images.map((f) => fileUrl(record, f)),
				filenames: images
			};
		}
	} catch {
		// Collection absente — l'éditeur affichera les valeurs par défaut des gabarits.
	}
	return byPage;
}
