import { fail } from '@sveltejs/kit';
import { CMS_PAGES } from '$lib/cms/pages.js';
import { loadCmsEntriesByPage } from '$lib/cms/load.js';
import {
	saveText,
	saveImage,
	appendGalleryImages,
	removeGalleryImage,
	reorderGallery,
	clearOverride
} from '$lib/server/cms-write.js';
import { isPbAdminConfigured } from '$lib/server/pb-admin.js';

const VALID_PAGES = new Set(CMS_PAGES.map((p) => p.id));

/** @param {unknown} error */
function message(error) {
	if (error && typeof error === 'object') {
		const response = /** @type {any} */ (error).response;
		if (response?.message) return response.message;
	}
	return error instanceof Error ? error.message : 'Erreur inattendue';
}

/**
 * Valide le couple (page, clé) reçu du formulaire.
 * @param {FormData} formData
 * @returns {{ page: string, key: string }|null}
 */
function target(formData) {
	const page = formData.get('page')?.toString() ?? '';
	const key = formData.get('key')?.toString() ?? '';
	if (!VALID_PAGES.has(page) || !key) return null;
	return { page, key };
}

export async function load() {
	return {
		pages: CMS_PAGES,
		entries: await loadCmsEntriesByPage(),
		writable: isPbAdminConfigured()
	};
}

export const actions = {
	/**
	 * Enregistre en une fois tous les champs texte / texte enrichi modifiés.
	 * Un champ vidé (ou revenu à sa valeur par défaut) voit sa personnalisation supprimée.
	 */
	saveTexts: async ({ request }) => {
		const formData = await request.formData();
		const page = formData.get('page')?.toString() ?? '';
		if (!VALID_PAGES.has(page)) return fail(400, { error: 'Page inconnue' });

		let changes;
		try {
			changes = JSON.parse(formData.get('changes')?.toString() || '[]');
		} catch {
			return fail(400, { error: 'Données illisibles' });
		}
		if (!Array.isArray(changes) || changes.length === 0) {
			return fail(400, { error: 'Aucune modification à enregistrer' });
		}

		try {
			for (const change of changes) {
				const { key, type, value } = change ?? {};
				if (!key) continue;
				const clean = typeof value === 'string' ? value.trim() : '';
				if (!clean || clean === (change.defaultValue ?? '').trim()) {
					await clearOverride(page, key);
				} else {
					await saveText(page, key, value, type === 'richtext' ? 'richtext' : 'text');
				}
			}
		} catch (error) {
			return fail(500, { error: message(error) });
		}

		return { success: 'Contenu enregistré' };
	},

	saveImage: async ({ request }) => {
		const formData = await request.formData();
		const where = target(formData);
		if (!where) return fail(400, { error: 'Champ inconnu' });

		const file = formData.get('file');
		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { error: 'Aucun fichier reçu' });
		}

		try {
			await saveImage(where.page, where.key, file);
		} catch (error) {
			return fail(500, { error: message(error) });
		}
		return { success: 'Image mise à jour' };
	},

	addGalleryImages: async ({ request }) => {
		const formData = await request.formData();
		const where = target(formData);
		if (!where) return fail(400, { error: 'Champ inconnu' });

		const files = formData.getAll('files').filter((f) => f instanceof File && f.size > 0);
		if (files.length === 0) return fail(400, { error: 'Aucun fichier reçu' });

		try {
			await appendGalleryImages(where.page, where.key, /** @type {File[]} */ (files));
		} catch (error) {
			return fail(500, { error: message(error) });
		}
		return { success: `${files.length} image${files.length > 1 ? 's' : ''} ajoutée${files.length > 1 ? 's' : ''}` };
	},

	removeGalleryImage: async ({ request }) => {
		const formData = await request.formData();
		const where = target(formData);
		const filename = formData.get('filename')?.toString();
		if (!where || !filename) return fail(400, { error: 'Paramètres invalides' });

		try {
			await removeGalleryImage(where.page, where.key, filename);
		} catch (error) {
			return fail(500, { error: message(error) });
		}
		return { success: 'Image retirée' };
	},

	reorderGallery: async ({ request }) => {
		const formData = await request.formData();
		const where = target(formData);
		if (!where) return fail(400, { error: 'Champ inconnu' });

		let filenames;
		try {
			filenames = JSON.parse(formData.get('filenames')?.toString() || '[]');
		} catch {
			return fail(400, { error: 'Données illisibles' });
		}
		if (!Array.isArray(filenames)) return fail(400, { error: 'Données illisibles' });

		try {
			await reorderGallery(where.page, where.key, filenames);
		} catch (error) {
			return fail(500, { error: message(error) });
		}
		return { success: 'Ordre mis à jour' };
	},

	reset: async ({ request }) => {
		const formData = await request.formData();
		const where = target(formData);
		if (!where) return fail(400, { error: 'Champ inconnu' });

		try {
			await clearOverride(where.page, where.key);
		} catch (error) {
			return fail(500, { error: message(error) });
		}
		return { success: 'Valeur par défaut rétablie' };
	}
};
