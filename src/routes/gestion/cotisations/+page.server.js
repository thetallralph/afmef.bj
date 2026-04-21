import {
	getAllCotisations,
	updateCotisation,
	createCotisation,
	getAllMembers
} from '$lib/services/auth.js';
import { sendCotisationReminder } from '$lib/services/email.js';
import { fail } from '@sveltejs/kit';

const DEFAULT_AMOUNT = 10000;

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

	// Tous les membres actifs pour le sélecteur du formulaire de création
	const { members } = await getAllMembers(locals.pb, {
		perPage: 500,
		page: 1,
		status: 'active',
		sort: 'name'
	});

	const currentYear = new Date().getFullYear();

	return {
		cotisations,
		total,
		totalPages,
		currentPage: page,
		year,
		status,
		currentYear,
		members: members.map((m) => ({ id: m.id, name: m.displayName, email: m.email })),
		defaultAmount: DEFAULT_AMOUNT
	};
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

		if (!result.success) return fail(400, { error: result.error });
		return { success: true, message: 'Cotisation marquée comme payée' };
	},

	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = formData.get('user')?.toString();
		const year = parseInt(formData.get('year')?.toString() || '0', 10);
		const amount = parseInt(formData.get('amount')?.toString() || '0', 10);
		const method = formData.get('method')?.toString() || '';
		const markPaid = formData.get('status') === 'paid';

		if (!userId || !year || !amount) {
			return fail(400, { error: 'Membre, année et montant sont requis' });
		}

		const payload = {
			user: userId,
			year,
			amount,
			status: markPaid ? 'paid' : 'pending'
		};
		if (method) payload.method = method;
		if (markPaid) payload.paidAt = new Date().toISOString();

		const result = await createCotisation(locals.pb, payload);
		if (!result.success) return fail(400, { error: result.error });

		return { success: true, message: 'Cotisation créée' };
	},

	generateYear: async ({ request, locals }) => {
		const formData = await request.formData();
		const year = parseInt(formData.get('year')?.toString() || '0', 10);
		const amount = parseInt(formData.get('amount')?.toString() || String(DEFAULT_AMOUNT), 10);

		if (!year) return fail(400, { error: 'Année manquante' });

		// Récupérer tous les membres actifs
		const { members } = await getAllMembers(locals.pb, { perPage: 500, page: 1, status: 'active' });

		// Récupérer les cotisations existantes pour cette année
		const existing = await locals.pb.collection('cotisations').getFullList({
			filter: `year = ${year}`,
			fields: 'user'
		});
		const existingUserIds = new Set(existing.map((c) => c.user));

		let created = 0;
		let errors = 0;
		for (const member of members) {
			if (existingUserIds.has(member.id)) continue;
			const result = await createCotisation(locals.pb, {
				user: member.id,
				year,
				amount,
				status: 'pending'
			});
			if (result.success) created++;
			else errors++;
		}

		return {
			success: true,
			message: `${created} cotisation${created > 1 ? 's' : ''} générée${created > 1 ? 's' : ''} pour ${year}${errors ? ` (${errors} erreur${errors > 1 ? 's' : ''})` : ''}`
		};
	},

	sendReminder: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID manquant' });

		const cotisation = await locals.pb.collection('cotisations').getOne(id, { expand: 'user' });
		const user = cotisation.expand?.user;
		if (!user?.email) return fail(400, { error: 'Membre ou email introuvable' });

		const result = await sendCotisationReminder(
			{ name: user.name, email: user.email },
			{ year: cotisation.year, amount: cotisation.amount }
		);

		if (!result.success) return fail(500, { error: `Envoi échoué : ${result.error}` });
		return { success: true, message: `Rappel envoyé à ${user.email}` };
	},

	sendAllReminders: async ({ request, locals }) => {
		const formData = await request.formData();
		const year = parseInt(formData.get('year')?.toString() || String(new Date().getFullYear()), 10);

		const cotisations = await locals.pb.collection('cotisations').getFullList({
			filter: `year = ${year} && status = "pending"`,
			expand: 'user'
		});

		let sent = 0;
		let failed = 0;
		for (const cot of cotisations) {
			const user = cot.expand?.user;
			if (!user?.email) {
				failed++;
				continue;
			}
			const result = await sendCotisationReminder(
				{ name: user.name, email: user.email },
				{ year: cot.year, amount: cot.amount }
			);
			if (result.success) sent++;
			else failed++;
		}

		return {
			success: true,
			message: `${sent} rappel${sent > 1 ? 's' : ''} envoyé${sent > 1 ? 's' : ''}${failed ? ` — ${failed} échec${failed > 1 ? 's' : ''}` : ''}`
		};
	}
};
