import { json } from '@sveltejs/kit';
import { updateCotisation } from '$lib/services/auth.js';

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json({ error: 'Non authentifié' }, { status: 401 });
	}

	const { cotisationId, transactionId } = await request.json();

	if (!cotisationId || !transactionId) {
		return json({ error: 'cotisationId et transactionId requis' }, { status: 400 });
	}

	try {
		// Vérifier que la cotisation appartient au membre
		const cotisation = await locals.pb.collection('cotisations').getOne(cotisationId);

		if (cotisation.user !== locals.user.id) {
			return json({ error: 'Non autorisé' }, { status: 403 });
		}

		if (cotisation.status === 'paid') {
			return json({ error: 'Cette cotisation est déjà payée' }, { status: 400 });
		}

		// Mettre à jour la cotisation
		const result = await updateCotisation(locals.pb, cotisationId, {
			status: 'paid',
			paidAt: new Date().toISOString(),
			method: 'kkiapay',
			transactionId
		});

		if (!result.success) {
			return json({ error: result.error }, { status: 500 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Erreur vérification paiement:', error);
		return json({ error: 'Cotisation introuvable' }, { status: 404 });
	}
}
