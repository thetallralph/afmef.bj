import { getAdminStats, getAllMembers } from '$lib/services/auth.js';
import { getPbAdmin, isPbAdminConfigured } from '$lib/server/pb-admin.js';
import { contentCounts } from '$lib/server/content-admin.js';
import { CONTENT_COLLECTION_LIST } from '$lib/cms/collections.js';

export async function load() {
	const pb = await getPbAdmin();
	const [stats, recent, counts] = await Promise.all([
		getAdminStats(pb),
		getAllMembers(pb, { perPage: 5, sort: '-created' }),
		contentCounts()
	]);

	return {
		stats,
		recentMembers: recent.members,
		writable: isPbAdminConfigured(),
		content: CONTENT_COLLECTION_LIST.map(({ slug, label }) => ({
			slug,
			label,
			count: counts[slug] ?? null
		}))
	};
}
