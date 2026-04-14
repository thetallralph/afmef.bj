import { getCotisations } from '$lib/services/auth.js';

export async function load({ locals }) {
	const { cotisations, status } = await getCotisations(locals.pb);

	return {
		cotisations,
		status
	};
}
