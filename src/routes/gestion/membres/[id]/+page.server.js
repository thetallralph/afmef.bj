import { error, fail, redirect } from '@sveltejs/kit';
import { getMemberById, updateMember, getCotisations, createCotisation } from '$lib/services/auth.js';

export async function load({ locals, params }) {
	const member = await getMemberById(locals.pb, params.id);

	if (!member) {
		throw error(404, 'Membre non trouvé');
	}

	// Récupérer les cotisations de ce membre
	let cotisations = [];
	try {
		const result = await locals.pb.collection('cotisations').getList(1, 50, {
			filter: `user = "${params.id}"`,
			sort: '-year'
		});
		cotisations = result.items;
	} catch {
		// Pas de cotisations
	}

	return { member, cotisations };
}

export const actions = {
	update: async ({ request, locals, params }) => {
		const formData = await request.formData();

		const data = {
			name: formData.get('name')?.toString().trim(),
			phone: formData.get('phone')?.toString().trim(),
			structure: formData.get('structure')?.toString().trim(),
			fonction: formData.get('fonction')?.toString().trim(),
			description: formData.get('description')?.toString().trim(),
			role: formData.get('role')?.toString() || 'member',
			status: formData.get('status')?.toString() || 'active',
			showInDirectory: formData.get('showInDirectory') === 'on',
			showEmail: formData.get('showEmail') === 'on',
			showPhone: formData.get('showPhone') === 'on'
		};

		if (!data.name) {
			return fail(400, { error: 'Le nom est requis' });
		}

		const result = await updateMember(locals.pb, params.id, data);

		if (!result.success) {
			return fail(400, { error: result.error });
		}

		return { success: true };
	},

	addCotisation: async ({ request, locals, params }) => {
		const formData = await request.formData();

		const data = {
			user: params.id,
			year: parseInt(formData.get('year')),
			amount: parseInt(formData.get('amount')),
			status: formData.get('cotisationStatus')?.toString() || 'pending',
			method: formData.get('method')?.toString() || '',
			paidAt: formData.get('cotisationStatus') === 'paid' ? new Date().toISOString() : null
		};

		if (!data.year || !data.amount) {
			return fail(400, { cotisationError: 'Année et montant requis' });
		}

		const result = await createCotisation(locals.pb, data);

		if (!result.success) {
			return fail(400, { cotisationError: result.error });
		}

		return { cotisationSuccess: true };
	}
};
