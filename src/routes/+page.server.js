import { getActivites } from '$lib/services/wordpress';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// Fetch posts for slider and news section
	const { activites } = await getActivites({ perPage: 10, page: 1 });

	// Filter articles that have images for the slider
	const sliderArticles = activites.filter((a) => a.image?.url);

	// Use first 4 for news section
	const newsArticles = activites.slice(0, 4);

	return {
		sliderArticles,
		newsArticles
	};
}
