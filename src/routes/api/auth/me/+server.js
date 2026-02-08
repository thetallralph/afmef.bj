import { json } from '@sveltejs/kit';
import { validateToken, getUserInfo } from '$lib/services/auth.js';

export async function GET({ cookies }) {
	const token = cookies.get('auth_token');

	if (!token) {
		return json({ error: 'Non authentifié' }, { status: 401 });
	}

	// Valider le token
	const isValid = await validateToken(token);

	if (!isValid) {
		cookies.delete('auth_token', { path: '/' });
		return json({ error: 'Session expirée' }, { status: 401 });
	}

	// Récupérer les infos utilisateur
	const user = await getUserInfo(token);

	if (!user) {
		return json({ error: 'Utilisateur non trouvé' }, { status: 404 });
	}

	return json({ user });
}
