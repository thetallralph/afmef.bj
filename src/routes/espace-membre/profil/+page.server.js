import { updateProfile, formatUser } from '$lib/services/auth.js';

export const actions = {
	profile: async ({ request, locals }) => {
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
	},

	avatar: async ({ request, locals }) => {
		if (!locals.user) {
			return { success: false, error: 'Non authentifié' };
		}

		const formData = await request.formData();
		const file = formData.get('avatar');

		if (!file || file.size === 0) {
			return { success: false, error: 'Aucun fichier sélectionné' };
		}

		try {
			const pbFormData = new FormData();
			pbFormData.append('avatar', file);

			const record = await locals.pb.collection('users').update(locals.user.id, pbFormData);
			return { success: true, avatarUpdated: true, user: formatUser(record) };
		} catch (error) {
			return {
				success: false,
				error: error?.response?.message || 'Erreur lors de l\'upload'
			};
		}
	}
};
