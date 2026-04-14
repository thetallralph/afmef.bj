import { redirect } from '@sveltejs/kit';
import { formatUser, isAdmin } from '$lib/services/auth.js';

export async function load({ locals }) {
	if (!locals.user) {
		throw redirect(302, '/espace-membre/connexion');
	}

	if (!isAdmin(locals.user)) {
		throw redirect(302, '/espace-membre');
	}

	return {
		user: formatUser(locals.user),
		isAuthenticated: true
	};
}
