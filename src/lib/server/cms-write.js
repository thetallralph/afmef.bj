/**
 * Écritures sur la collection cms_content — SERVEUR UNIQUEMENT.
 * Toutes les fonctions passent par le client superuser : la collection est
 * en lecture publique mais fermée en écriture côté API.
 */

import { getPbAdmin } from './pb-admin.js';

const COLLECTION = 'cms_content';

/**
 * Retourne l'enregistrement (page, key), en le créant si nécessaire.
 * @param {import('pocketbase').default} pb
 * @param {string} page
 * @param {string} key
 * @param {string} type
 */
async function findOrCreate(pb, page, key, type) {
	try {
		return await pb.collection(COLLECTION).getFirstListItem(`page = "${page}" && key = "${key}"`);
	} catch {
		return await pb.collection(COLLECTION).create({ page, key, type, value: '' });
	}
}

/**
 * @param {string} page
 * @param {string} key
 * @returns {Promise<import('pocketbase').RecordModel|null>}
 */
export async function findOverride(page, key) {
	const pb = await getPbAdmin();
	try {
		return await pb.collection(COLLECTION).getFirstListItem(`page = "${page}" && key = "${key}"`);
	} catch {
		return null;
	}
}

/**
 * Enregistre une valeur texte / texte enrichi.
 * @param {string} page
 * @param {string} key
 * @param {string} value
 * @param {'text'|'richtext'} type
 */
export async function saveText(page, key, value, type = 'text') {
	const pb = await getPbAdmin();
	const record = await findOrCreate(pb, page, key, type);
	await pb.collection(COLLECTION).update(record.id, { value, type });
}

/**
 * Remplace l'image d'un champ image.
 * @param {string} page
 * @param {string} key
 * @param {File} file
 */
export async function saveImage(page, key, file) {
	const pb = await getPbAdmin();
	const record = await findOrCreate(pb, page, key, 'image');
	const formData = new FormData();
	formData.append('type', 'image');
	formData.append('image', file);
	await pb.collection(COLLECTION).update(record.id, formData);
}

/**
 * Ajoute des images à la fin d'une galerie.
 * @param {string} page
 * @param {string} key
 * @param {File[]} files
 */
export async function appendGalleryImages(page, key, files) {
	const pb = await getPbAdmin();
	const record = await findOrCreate(pb, page, key, 'gallery');
	const formData = new FormData();
	formData.append('type', 'gallery');
	for (const file of files) formData.append('images+', file);
	await pb.collection(COLLECTION).update(record.id, formData);
}

/**
 * Retire une image d'une galerie.
 * @param {string} page
 * @param {string} key
 * @param {string} filename
 */
export async function removeGalleryImage(page, key, filename) {
	const pb = await getPbAdmin();
	const record = await findOverride(page, key);
	if (!record) return;
	await pb.collection(COLLECTION).update(record.id, { 'images-': [filename] });
}

/**
 * Réordonne une galerie à partir de la liste complète des noms de fichiers.
 * @param {string} page
 * @param {string} key
 * @param {string[]} filenames
 */
export async function reorderGallery(page, key, filenames) {
	const pb = await getPbAdmin();
	const record = await findOverride(page, key);
	if (!record) return;
	await pb.collection(COLLECTION).update(record.id, { images: filenames });
}

/**
 * Supprime la personnalisation d'un champ : la valeur par défaut du gabarit revient.
 * @param {string} page
 * @param {string} key
 */
export async function clearOverride(page, key) {
	const pb = await getPbAdmin();
	const record = await findOverride(page, key);
	if (record) await pb.collection(COLLECTION).delete(record.id);
}
