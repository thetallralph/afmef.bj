import { getAllMembers, deleteMember } from '$lib/services/auth.js';
import { fail } from '@sveltejs/kit';

export async function load({ locals, url }) {
	const page = parseInt(url.searchParams.get('page') || '1');
	const search = url.searchParams.get('q') || '';
	const status = url.searchParams.get('status') || '';

	const { members, total, totalPages } = await getAllMembers(locals.pb, {
		perPage: 15,
		page,
		search,
		status
	});

	return { members, total, totalPages, currentPage: page, search, status };
}

export const actions = {
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id) return fail(400, { error: 'ID manquant' });

		const result = await deleteMember(locals.pb, id);
		if (!result.success) {
			return fail(400, { error: result.error });
		}

		return { success: true };
	}
};
