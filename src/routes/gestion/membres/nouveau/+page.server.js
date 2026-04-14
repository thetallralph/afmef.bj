import { fail, redirect } from '@sveltejs/kit';
import { createMember } from '$lib/services/auth.js';

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim();
		const password = formData.get('password')?.toString();
		const phone = formData.get('phone')?.toString().trim();
		const structure = formData.get('structure')?.toString().trim();
		const fonction = formData.get('fonction')?.toString().trim();
		const role = formData.get('role')?.toString() || 'member';

		if (!name || !email || !password) {
			return fail(400, {
				error: 'Nom, email et mot de passe sont requis',
				name, email, phone, structure, fonction, role
			});
		}

		if (password.length < 8) {
			return fail(400, {
				error: 'Le mot de passe doit contenir au moins 8 caractères',
				name, email, phone, structure, fonction, role
			});
		}

		const result = await createMember(locals.pb, {
			name,
			email,
			password,
			passwordConfirm: password,
			phone,
			structure,
			fonction,
			role
		});

		if (!result.success) {
			return fail(400, {
				error: result.error,
				name, email, phone, structure, fonction, role
			});
		}

		throw redirect(302, '/gestion/membres');
	}
};
