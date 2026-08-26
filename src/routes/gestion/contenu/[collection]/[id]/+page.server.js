import { error, fail, redirect } from '@sveltejs/kit';
import { getContentCollection } from '$lib/cms/collections.js';
import { getRecord, saveRecord, deleteRecord, relationOptions } from '$lib/server/content-admin.js';
import { isPbAdminConfigured } from '$lib/server/pb-admin.js';

const NEW = 'nouveau';

export async function load({ params }) {
	const definition = getContentCollection(params.collection);
	if (!definition) throw error(404, 'Section de contenu inconnue');

	const isNew = params.id === NEW;
	const record = isNew ? null : await getRecord(params.collection, params.id);
	if (!isNew && !record) throw error(404, `${definition.singular} introuvable`);

	return {
		slug: params.collection,
		isNew,
		record,
		definition: {
			label: definition.label,
			singular: definition.singular,
			fields: definition.fields
		},
		options: await relationOptions(params.collection),
		writable: isPbAdminConfigured()
	};
}

export const actions = {
	save: async ({ request, params }) => {
		const formData = await request.formData();
		const isNew = params.id === NEW;

		const result = await saveRecord(params.collection, isNew ? null : params.id, formData);
		if (!result.success) return fail(400, { error: result.error });

		if (isNew) throw redirect(303, `/gestion/contenu/${params.collection}/${result.id}`);
		return { success: 'Modifications enregistrées' };
	},

	delete: async ({ params }) => {
		if (params.id === NEW) throw redirect(303, `/gestion/contenu/${params.collection}`);

		const result = await deleteRecord(params.collection, params.id);
		if (!result.success) return fail(400, { error: result.error });

		throw redirect(303, `/gestion/contenu/${params.collection}`);
	}
};
