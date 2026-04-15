import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim();
		const password = formData.get('password')?.toString();
		const passwordConfirm = formData.get('passwordConfirm')?.toString();
		const phone = formData.get('phone')?.toString().trim();
		const structure = formData.get('structure')?.toString().trim();
		const fonction = formData.get('fonction')?.toString().trim();

		// Validation
		if (!name || !email || !password || !passwordConfirm) {
			return fail(400, {
				error: 'Tous les champs obligatoires doivent être remplis',
				name, email, phone, structure, fonction
			});
		}

		if (password.length < 8) {
			return fail(400, {
				error: 'Le mot de passe doit contenir au moins 8 caractères',
				name, email, phone, structure, fonction
			});
		}

		if (password !== passwordConfirm) {
			return fail(400, {
				error: 'Les mots de passe ne correspondent pas',
				name, email, phone, structure, fonction
			});
		}

		try {
			// Créer le compte en attente de validation
			await locals.pb.collection('users').create({
				name,
				email,
				password,
				passwordConfirm,
				phone,
				structure,
				fonction,
				role: 'member',
				status: 'pending',
				showInDirectory: true,
				showEmail: true,
				showPhone: false,
				emailVisibility: true
			});
		} catch (error) {
			const message = error?.response?.data;
			let errorMsg = 'Erreur lors de la création du compte';

			if (message?.email?.code === 'validation_invalid_email') {
				errorMsg = 'Cette adresse email est invalide';
			} else if (message?.email?.code === 'validation_not_unique') {
				errorMsg = 'Un compte existe déjà avec cette adresse email';
			} else if (error?.response?.message) {
				errorMsg = error.response.message;
			}

			return fail(400, {
				error: errorMsg,
				name, email, phone, structure, fonction
			});
		}

		throw redirect(302, '/espace-membre/connexion?inscrit=1');
	}
};
