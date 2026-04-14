import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/public';

/**
 * Instance singleton pour le client (navigateur)
 * Utilise PUBLIC_POCKETBASE_URL (même domaine en prod)
 */
let clientPB;

export function getClientPB() {
	if (typeof window === 'undefined') {
		throw new Error('getClientPB() ne doit être appelé que côté client');
	}
	if (!clientPB) {
		clientPB = new PocketBase(env.PUBLIC_POCKETBASE_URL);
	}
	return clientPB;
}
