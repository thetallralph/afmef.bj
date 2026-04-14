import { getAllCotisations, updateCotisation } from '$lib/services/auth.js';
import { fail } from '@sveltejs/kit';

export async function load({ locals, url }) {
	const page = parseInt(url.searchParams.get('page') || '1');
	const year = url.searchParams.get('year') || '';
	const status = url.searchParams.get('status') || '';

	const { cotisations, total, totalPages } = await getAllCotisations(locals.pb, {
		perPage: 20,
		page,
		year,
		status
	});

	const currentYear = new Date().getFullYear();

	return { cotisations, total, totalPages, currentPage: page, year, status, currentYear };
}

export const actions = {
	markPaid: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id) return fail(400, { error: 'ID manquant' });

		const result = await updateCotisation(locals.pb, id, {
			status: 'paid',
			paidAt: new Date().toISOString()
		});

		if (!result.success) {
			return fail(400, { error: result.error });
		}

		return { success: true };
	}
};
