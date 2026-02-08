import { updateProfile } from '$lib/services/auth.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('auth_token');

		if (!token) {
			return { success: false, error: 'Non authentifié' };
		}

		const formData = await request.formData();
		const profileData = {
			displayName: formData.get('displayName'),
			phone: formData.get('phone'),
			structure: formData.get('structure'),
			fonction: formData.get('fonction'),
			bio: formData.get('bio'),
			privacy: {
				showEmail: formData.get('showEmail') === 'on',
				showPhone: formData.get('showPhone') === 'on'
			}
		};

		const result = await updateProfile(token, profileData);

		return result;
	}
};
