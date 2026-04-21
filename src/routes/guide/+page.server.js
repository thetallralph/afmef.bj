import { env } from '$env/dynamic/private';

const GUIDE_PASSWORD = env.GUIDE_PASSWORD || 'afmef2024';
const COOKIE_NAME = 'guide_access';

export function load({ cookies }) {
	const hasAccess = cookies.get(COOKIE_NAME) === 'granted';
	return { hasAccess };
}

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password')?.toString().trim();

		if (password !== GUIDE_PASSWORD) {
			return { error: 'Mot de passe incorrect' };
		}

		cookies.set(COOKIE_NAME, 'granted', {
			path: '/guide',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		});

		return { success: true };
	},

	logout: async ({ cookies }) => {
		cookies.delete(COOKIE_NAME, { path: '/guide' });
		return { success: true };
	}
};
