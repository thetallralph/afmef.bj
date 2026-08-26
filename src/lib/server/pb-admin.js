/**
 * Client PocketBase superuser — SERVEUR UNIQUEMENT.
 *
 * Les collections de contenu sont en lecture publique mais en écriture
 * réservée au superuser. L'espace /gestion passe donc par ce client pour
 * toutes les écritures, après le contrôle `role = admin` du layout.
 *
 * Ne jamais importer ce module depuis un composant client.
 */

import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

/** @type {import('pocketbase').default|null} */
let cached = null;

/** URL interne (Docker) en priorité, sinon URL publique. */
export function pbUrl() {
	return env.POCKETBASE_URL || publicEnv.PUBLIC_POCKETBASE_URL || 'http://localhost:8090';
}

/** URL publique des fichiers (le navigateur ne peut pas joindre l'URL Docker interne). */
export function pbPublicUrl() {
	return publicEnv.PUBLIC_POCKETBASE_URL || env.POCKETBASE_URL || 'http://localhost:8090';
}

/**
 * Construit l'URL publique d'un fichier PocketBase.
 * @param {{collectionId: string, id: string}} record
 * @param {string} filename
 * @returns {string}
 */
export function fileUrl(record, filename) {
	if (!filename) return '';
	return `${pbPublicUrl()}/api/files/${record.collectionId}/${record.id}/${filename}`;
}

/** Les identifiants superuser sont-ils configurés ? */
export function isPbAdminConfigured() {
	return Boolean(env.PB_ADMIN_EMAIL && env.PB_ADMIN_PASSWORD);
}

let warned = false;

/**
 * Instance PocketBase authentifiée en superuser (mise en cache, ré-auth si le token expire).
 *
 * Si les identifiants ne sont pas configurés, on renvoie un client non authentifié
 * plutôt que de lever : l'espace /gestion reste consultable et affiche une bannière
 * « lecture seule » (voir isPbAdminConfigured), au lieu de renvoyer une erreur 500.
 *
 * @returns {Promise<import('pocketbase').default>}
 */
export async function getPbAdmin() {
	if (cached?.authStore.isValid) return cached;

	const email = env.PB_ADMIN_EMAIL;
	const password = env.PB_ADMIN_PASSWORD;

	if (!email || !password) {
		if (!warned) {
			warned = true;
			console.warn(
				'[pb-admin] PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD non définis : /gestion est en lecture seule.'
			);
		}
		return createPB();
	}

	const pb = new PocketBase(pbUrl());
	pb.autoCancellation(false);
	await pb.collection('_superusers').authWithPassword(email, password);

	cached = pb;
	return pb;
}

/**
 * Comme getPbAdmin() mais renvoie null au lieu de lever, pour les `load`
 * qui doivent dégrader proprement si la configuration manque.
 * @returns {Promise<import('pocketbase').default|null>}
 */
export async function getPbAdminOrNull() {
	try {
		return await getPbAdmin();
	} catch (error) {
		console.error('[pb-admin]', error instanceof Error ? error.message : error);
		return null;
	}
}

/** Client PocketBase non authentifié (lecture publique), côté serveur. */
export function createPB() {
	const pb = new PocketBase(pbUrl());
	pb.autoCancellation(false);
	return pb;
}
