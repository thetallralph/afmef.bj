import { updateProfile } from '$lib/services/auth.js';

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			return { success: false, error: 'Non authentifié' };
		}

		const formData = await request.formData();
		const profileData = {
			name: formData.get('displayName'),
			phone: formData.get('phone'),
			structure: formData.get('structure'),
			fonction: formData.get('fonction'),
			description: formData.get('bio'),
			showEmail: formData.get('showEmail') === 'on',
			showPhone: formData.get('showPhone') === 'on'
		};

		return await updateProfile(locals.pb, profileData);
	}
};
