import { getAllMembers, deleteMember, updateMember, getMemberById } from '$lib/services/auth.js';
import { sendMemberValidationEmail } from '$lib/services/email.js';
import { fail } from '@sveltejs/kit';
import { getPbAdmin } from '$lib/server/pb-admin.js';

export async function load({ url }) {
	const pb = await getPbAdmin();
	const page = parseInt(url.searchParams.get('page') || '1');
	const search = url.searchParams.get('q') || '';
	const status = url.searchParams.get('status') || '';

	const { members, total, totalPages } = await getAllMembers(pb, {
		perPage: 15,
		page,
		search,
		status
	});

	return { members, total, totalPages, currentPage: page, search, status };
}

export const actions = {
	delete: async ({ request }) => {
		const pb = await getPbAdmin();
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id) return fail(400, { error: 'ID manquant' });

		const result = await deleteMember(pb, id);
		if (!result.success) {
			return fail(400, { error: result.error });
		}

		return { success: true };
	},

	setStatus: async ({ request }) => {
		const pb = await getPbAdmin();
		const formData = await request.formData();
		const id = formData.get('id');
		const status = formData.get('status');
		const notify = formData.get('notify') === '1';

		if (!id || !['active', 'pending', 'inactive'].includes(status)) {
			return fail(400, { error: 'Paramètres invalides' });
		}

		const result = await updateMember(pb, id, { status });
		if (!result.success) {
			return fail(400, { error: result.error });
		}

		let emailResult = null;
		if (notify && status === 'active') {
			const member = await getMemberById(pb, id);
			if (member?.email) {
				emailResult = await sendMemberValidationEmail({ email: member.email, name: member.displayName });
			}
		}

		return { success: true, emailSent: emailResult?.success, emailError: emailResult?.error };
	}
};
