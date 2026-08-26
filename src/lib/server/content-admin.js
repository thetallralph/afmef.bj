/**
 * CRUD générique sur les collections de contenu — SERVEUR UNIQUEMENT.
 * Piloté par les définitions de $lib/cms/collections.js.
 */

import { CONTENT_COLLECTIONS, getContentCollection } from '$lib/cms/collections.js';
import { getPbAdmin, createPB, fileUrl } from './pb-admin.js';

/**
 * Échappe une valeur destinée à un filtre PocketBase.
 * @param {string} value
 */
function escapeFilter(value) {
	return value.replace(/["\\]/g, '\\$&');
}

/**
 * Transforme un enregistrement PocketBase en objet sérialisable pour le client,
 * avec les URLs publiques des fichiers.
 * @param {any} definition
 * @param {import('pocketbase').RecordModel} record
 */
function serialize(definition, record) {
	/** @type {Record<string, any>} */
	const out = { id: record.id, created: record.created, updated: record.updated };

	for (const field of definition.fields) {
		const value = record[field.name];
		if (field.type === 'file') {
			out[field.name] = value || '';
			out[`${field.name}Url`] = value ? fileUrl(record, value) : '';
		} else if (field.type === 'relation') {
			out[field.name] = field.multiple ? (Array.isArray(value) ? value : value ? [value] : []) : value || '';
		} else {
			out[field.name] = value ?? '';
		}
	}

	// Libellés des relations, pour l'affichage en liste
	if (record.expand) {
		out.expand = {};
		for (const [key, expanded] of Object.entries(record.expand)) {
			const items = Array.isArray(expanded) ? expanded : [expanded];
			out.expand[key] = items.map((item) => ({ id: item.id, label: item.name || item.title || item.id }));
		}
	}

	return out;
}

/** Champs relation à étendre pour l'affichage. */
function expandOf(definition) {
	return definition.fields
		.filter((f) => f.type === 'relation')
		.map((f) => f.name)
		.join(',');
}

/**
 * Liste paginée d'une collection.
 * @param {string} slug
 * @param {{page?: number, perPage?: number, search?: string}} options
 */
export async function listRecords(slug, { page = 1, perPage = 20, search = '' } = {}) {
	const definition = getContentCollection(slug);
	if (!definition) return { records: [], total: 0, totalPages: 0, missing: true };

	const filters = [];
	if (search && definition.searchFields?.length) {
		const safe = escapeFilter(search);
		filters.push(`(${definition.searchFields.map((f) => `${f} ~ "${safe}"`).join(' || ')})`);
	}

	try {
		const pb = await getPbAdmin();
		const expand = expandOf(definition);
		const result = await pb.collection(definition.collection).getList(page, perPage, {
			filter: filters.join(' && '),
			sort: definition.sort || '-created',
			...(expand ? { expand } : {})
		});

		return {
			records: result.items.map((item) => serialize(definition, item)),
			total: result.totalItems,
			totalPages: result.totalPages,
			missing: false
		};
	} catch (error) {
		console.error(`[content-admin] liste ${slug}:`, error?.status ?? '', error?.message ?? error);
		return { records: [], total: 0, totalPages: 0, missing: error?.status === 404 };
	}
}

/**
 * Un enregistrement, sérialisé.
 * @param {string} slug
 * @param {string} id
 */
export async function getRecord(slug, id) {
	const definition = getContentCollection(slug);
	if (!definition) return null;
	try {
		const pb = await getPbAdmin();
		const record = await pb.collection(definition.collection).getOne(id);
		return serialize(definition, record);
	} catch {
		return null;
	}
}

/**
 * Options disponibles pour chaque champ relation d'une collection.
 * Lecture publique : pas besoin du client superuser.
 * @param {string} slug
 * @returns {Promise<Record<string, {id: string, label: string}[]>>}
 */
export async function relationOptions(slug) {
	const definition = getContentCollection(slug);
	if (!definition) return {};

	/** @type {Record<string, {id: string, label: string}[]>} */
	const options = {};
	const pb = createPB();

	for (const field of definition.fields.filter((f) => f.type === 'relation')) {
		try {
			const items = await pb.collection(field.collection).getFullList({ sort: field.display || 'name' });
			options[field.name] = items.map((item) => ({
				id: item.id,
				label: item[field.display || 'name'] || item.title || item.id
			}));
		} catch {
			options[field.name] = [];
		}
	}
	return options;
}

/**
 * Construit la charge utile PocketBase à partir du formulaire.
 * @param {any} definition
 * @param {FormData} formData
 */
function buildPayload(definition, formData) {
	const payload = new FormData();

	for (const field of definition.fields) {
		const { name, type } = field;

		if (type === 'file') {
			const file = formData.get(name);
			if (file instanceof File && file.size > 0) {
				payload.append(name, file);
			} else if (formData.get(`${name}__remove`) === 'on') {
				payload.append(name, '');
			}
			continue;
		}

		if (type === 'relation' && field.multiple) {
			const selected = formData.getAll(name).filter(Boolean);
			// Une valeur vide est nécessaire pour vider une relation multiple.
			if (selected.length === 0) payload.append(name, '');
			else for (const value of selected) payload.append(name, value.toString());
			continue;
		}

		if (type === 'bool') {
			payload.append(name, formData.get(name) === 'on' ? 'true' : 'false');
			continue;
		}

		const raw = formData.get(name);
		if (raw === null) continue;
		payload.append(name, raw.toString().trim());
	}

	return payload;
}

/**
 * Vérifie les champs obligatoires avant l'appel à PocketBase.
 * @param {any} definition
 * @param {FormData} formData
 * @param {boolean} isNew
 * @returns {string|null}
 */
function validate(definition, formData, isNew) {
	for (const field of definition.fields) {
		if (!field.required) continue;

		if (field.type === 'file') {
			const file = formData.get(field.name);
			const hasNew = file instanceof File && file.size > 0;
			if (isNew && !hasNew) return `« ${field.label} » est obligatoire.`;
			continue;
		}

		const value = formData.get(field.name)?.toString().trim();
		if (!value) return `« ${field.label} » est obligatoire.`;
	}
	return null;
}

/**
 * Crée ou met à jour un enregistrement.
 * @param {string} slug
 * @param {string|null} id  null pour une création
 * @param {FormData} formData
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export async function saveRecord(slug, id, formData) {
	const definition = getContentCollection(slug);
	if (!definition) return { success: false, error: 'Collection inconnue' };

	const invalid = validate(definition, formData, !id);
	if (invalid) return { success: false, error: invalid };

	try {
		const pb = await getPbAdmin();
		const payload = buildPayload(definition, formData);
		const record = id
			? await pb.collection(definition.collection).update(id, payload)
			: await pb.collection(definition.collection).create(payload);
		return { success: true, id: record.id };
	} catch (error) {
		return { success: false, error: pbMessage(error) };
	}
}

/**
 * @param {string} slug
 * @param {string} id
 */
export async function deleteRecord(slug, id) {
	const definition = getContentCollection(slug);
	if (!definition) return { success: false, error: 'Collection inconnue' };
	try {
		const pb = await getPbAdmin();
		await pb.collection(definition.collection).delete(id);
		return { success: true };
	} catch (error) {
		return { success: false, error: pbMessage(error) };
	}
}

/**
 * Message d'erreur lisible à partir d'une erreur PocketBase.
 * @param {any} error
 */
function pbMessage(error) {
	const data = error?.response?.data;
	if (data && typeof data === 'object') {
		const details = Object.entries(data)
			.map(([field, info]) => `${field} : ${info?.message ?? 'invalide'}`)
			.join(' — ');
		if (details) return details;
	}
	return error?.response?.message || error?.message || 'Erreur inattendue';
}

/**
 * Nombre d'enregistrements par collection, pour le tableau de bord.
 * @returns {Promise<Record<string, number|null>>}
 */
export async function contentCounts() {
	const pb = await getPbAdmin();
	/** @type {Record<string, number|null>} */
	const counts = {};

	await Promise.all(
		Object.entries(CONTENT_COLLECTIONS).map(async ([slug, definition]) => {
			try {
				const result = await pb.collection(definition.collection).getList(1, 1);
				counts[slug] = result.totalItems;
			} catch {
				counts[slug] = null;
			}
		})
	);

	return counts;
}
