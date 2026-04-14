import { json } from '@sveltejs/kit';
import { formatUser } from '$lib/services/auth.js';

export async function GET({ locals }) {
	if (!locals.user) {
		return json({ error: 'Non authentifié' }, { status: 401 });
	}

	return json({ user: formatUser(locals.user) });
}
