import { json } from '@sveltejs/kit';
import { authenticateUser, formatUser } from '$lib/services/auth.js';

export async function POST({ request, locals }) {
	const { email, password } = await request.json();

	if (!email || !password) {
		return json({ error: 'Email et mot de passe requis' }, { status: 400 });
	}

	const result = await authenticateUser(locals.pb, email, password);

	if (!result.success) {
		return json({ error: result.error }, { status: 401 });
	}

	return json({
		success: true,
		user: result.user
	});
}
