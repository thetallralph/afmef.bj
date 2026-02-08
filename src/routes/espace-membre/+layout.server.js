import { redirect } from '@sveltejs/kit';
import { validateToken, getUserInfo } from '$lib/services/auth.js';
import { dev } from '$app/environment';

// Mode démo pour le développement (mettre à true pour tester sans WordPress)
const DEMO_MODE = false;

const DEMO_USER = {
	id: 1,
	displayName: 'Marie Dupont',
	email: 'marie.dupont@afmef.bj',
	phone: '+229 97 12 34 56',
	structure: 'Ministère de l\'Économie et des Finances',
	fonction: 'Directrice des Études',
	avatar: null,
	privacy: { showEmail: true, showPhone: true }
};

export async function load({ cookies, url }) {
	const token = cookies.get('auth_token');
	const isLoginPage = url.pathname === '/espace-membre/connexion';
	const isPasswordResetPage = url.pathname === '/espace-membre/mot-de-passe-oublie';

	// Pages publiques (connexion, mot de passe oublié)
	if (isLoginPage || isPasswordResetPage) {
		// Si déjà connecté, rediriger vers le dashboard
		if (token) {
			const isValid = await validateToken(token);
			if (isValid) {
				throw redirect(302, '/espace-membre');
			}
		}
		return { user: null, isAuthenticated: false };
	}

	// Mode démo activé en développement
	if (DEMO_MODE) {
		return {
			user: DEMO_USER,
			isAuthenticated: true,
			token: 'demo-token'
		};
	}

	// Pages protégées - vérifier l'authentification
	if (!token) {
		throw redirect(302, '/espace-membre/connexion');
	}

	const isValid = await validateToken(token);

	if (!isValid) {
		cookies.delete('auth_token', { path: '/' });
		throw redirect(302, '/espace-membre/connexion');
	}

	const user = await getUserInfo(token);

	if (!user) {
		cookies.delete('auth_token', { path: '/' });
		throw redirect(302, '/espace-membre/connexion');
	}

	return {
		user,
		isAuthenticated: true,
		token
	};
}
