import { json } from '@sveltejs/kit';
import { authenticateUser, getUserInfo } from '$lib/services/auth.js';

export async function POST({ request, cookies }) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return json({ error: 'Email et mot de passe requis' }, { status: 400 });
		}

		const authResult = await authenticateUser(email, password);

		if (!authResult.success) {
			return json({ error: authResult.error }, { status: 401 });
		}

		// Récupérer les infos complètes de l'utilisateur
		const userInfo = await getUserInfo(authResult.token);

		// Stocker le token dans un cookie httpOnly
		cookies.set('auth_token', authResult.token, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7 // 7 jours
		});

		return json({
			success: true,
			user: userInfo || authResult.user
		});
	} catch (error) {
		console.error('Erreur API login:', error);
		return json({ error: 'Erreur serveur' }, { status: 500 });
	}
}
