import { redirect } from '@sveltejs/kit';
import { formatUser } from '$lib/services/auth.js';

export async function load({ locals, url }) {
	const isLoginPage = url.pathname === '/espace-membre/connexion';
	const isPasswordResetPage = url.pathname === '/espace-membre/mot-de-passe-oublie';
	const isRegisterPage = url.pathname === '/espace-membre/inscription';

	// Pages publiques (connexion, inscription, mot de passe oublié)
	if (isLoginPage || isPasswordResetPage || isRegisterPage) {
		if (locals.user) {
			throw redirect(302, '/espace-membre');
		}
		return { user: null, isAuthenticated: false };
	}

	// Pages protégées - vérifier l'authentification
	if (!locals.user) {
		throw redirect(302, '/espace-membre/connexion');
	}

	return {
		user: formatUser(locals.user),
		isAuthenticated: true
	};
}
