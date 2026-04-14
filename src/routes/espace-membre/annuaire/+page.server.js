import { getMemberDirectory } from '$lib/services/auth.js';

export async function load({ locals, url }) {
	const page = parseInt(url.searchParams.get('page') || '1');
	const search = url.searchParams.get('search') || '';

	const { members, total, totalPages } = await getMemberDirectory(locals.pb, {
		perPage: 20,
		page,
		search
	});

	return {
		members,
		total,
		totalPages,
		currentPage: page
	};
}
