import { getActiviteBySlug, getActivites } from '$lib/services/wordpress';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const activite = await getActiviteBySlug(params.slug);

	if (!activite) {
		throw error(404, {
			message: 'Activité non trouvée'
		});
	}

	// Récupérer quelques activités connexes (même type si possible)
	let activitesConnexes = [];
	if (activite.types.length > 0) {
		const { activites } = await getActivites({
			perPage: 4,
			typeActivite: activite.types[0].id
		});
		// Exclure l'activité actuelle
		activitesConnexes = activites.filter((a) => a.id !== activite.id).slice(0, 3);
	}

	// Si pas assez d'activités connexes, compléter avec des récentes
	if (activitesConnexes.length < 3) {
		const { activites } = await getActivites({ perPage: 4 });
		const additional = activites
			.filter((a) => a.id !== activite.id && !activitesConnexes.find((c) => c.id === a.id))
			.slice(0, 3 - activitesConnexes.length);
		activitesConnexes = [...activitesConnexes, ...additional];
	}

	return {
		activite,
		activitesConnexes
	};
}
