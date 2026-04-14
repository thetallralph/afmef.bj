import { json } from '@sveltejs/kit';

export async function POST({ locals }) {
	locals.pb.authStore.clear();
	return json({ success: true });
}
