import { getMemberDirectory } from '$lib/services/auth.js';

export async function load({ cookies, url }) {
	const token = cookies.get('auth_token');
	const page = parseInt(url.searchParams.get('page') || '1');
	const search = url.searchParams.get('search') || '';

	const { members, total, totalPages } = await getMemberDirectory(token, {
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
