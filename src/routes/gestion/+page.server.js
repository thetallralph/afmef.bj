import { getAdminStats, getAllMembers } from '$lib/services/auth.js';

export async function load({ locals }) {
	const [stats, recent] = await Promise.all([
		getAdminStats(locals.pb),
		getAllMembers(locals.pb, { perPage: 5, sort: '-created' })
	]);

	return { stats, recentMembers: recent.members };
}
