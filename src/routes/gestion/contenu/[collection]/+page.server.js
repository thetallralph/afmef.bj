import { error, fail } from '@sveltejs/kit';
import { getContentCollection } from '$lib/cms/collections.js';
import { listRecords, deleteRecord } from '$lib/server/content-admin.js';
import { isPbAdminConfigured } from '$lib/server/pb-admin.js';

const PER_PAGE = 20;

export async function load({ params, url }) {
	const definition = getContentCollection(params.collection);
	if (!definition) throw error(404, 'Section de contenu inconnue');

	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
	const search = url.searchParams.get('q') || '';

	const { records, total, totalPages, missing } = await listRecords(params.collection, {
		page,
		perPage: PER_PAGE,
		search
	});

	return {
		slug: params.collection,
		definition: {
			label: definition.label,
			singular: definition.singular,
			description: definition.description,
			listColumns: definition.listColumns
		},
		records,
		total,
		totalPages,
		currentPage: page,
		search,
		missing,
		writable: isPbAdminConfigured()
	};
}

export const actions = {
	delete: async ({ request, params }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'Identifiant manquant' });

		const result = await deleteRecord(params.collection, id);
		if (!result.success) return fail(400, { error: result.error });

		return { success: 'Élément supprimé' };
	}
};
