import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Côté serveur : utiliser l'URL interne Docker si disponible,
	// sinon fallback sur l'URL publique
	const pb = new PocketBase(POCKETBASE_URL || PUBLIC_POCKETBASE_URL);

	// Charger l'auth depuis le cookie
	const cookie = event.request.headers.get('cookie') || '';
	pb.authStore.loadFromCookie(cookie);

	// Vérifier que le token est encore valide
	if (pb.authStore.isValid) {
		try {
			await pb.collection('users').authRefresh();
		} catch {
			pb.authStore.clear();
		}
	}

	// Rendre PocketBase accessible dans les load functions
	event.locals.pb = pb;
	event.locals.user = pb.authStore.isValid ? pb.authStore.record : null;

	const response = await resolve(event);

	// Synchroniser le cookie auth avec la réponse
	response.headers.append(
		'set-cookie',
		pb.authStore.exportToCookie({ httpOnly: true, sameSite: 'lax', secure: true })
	);

	return response;
}
