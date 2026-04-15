/**
 * Service d'authentification - PocketBase
 */

/**
 * Formate un record PocketBase en objet utilisateur
 * @param {import('pocketbase').RecordModel} record
 * @returns {Object}
 */
export function formatUser(record) {
	if (!record) return null;
	return {
		id: record.id,
		displayName: record.name || '',
		email: record.email || '',
		slug: record.id,
		avatar: record.avatar
			? `/api/files/${record.collectionId}/${record.id}/${record.avatar}`
			: null,
		description: record.description || '',
		phone: record.phone || '',
		structure: record.structure || '',
		fonction: record.fonction || '',
		role: record.role || 'member',
		status: record.status || 'active',
		created: record.created || '',
		privacy: {
			showEmail: record.showEmail ?? true,
			showPhone: record.showPhone ?? false
		}
	};
}

/**
 * Authentifie un utilisateur via PocketBase
 * @param {import('pocketbase').default} pb - Instance PocketBase
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export async function authenticateUser(pb, email, password) {
	try {
		const authData = await pb.collection('users').authWithPassword(email, password);
		return {
			success: true,
			user: formatUser(authData.record)
		};
	} catch (error) {
		console.error('Erreur authenticateUser:', error);
		return {
			success: false,
			error: error?.response?.message || 'Identifiants incorrects'
		};
	}
}

/**
 * Récupère les informations de l'utilisateur connecté
 * @param {import('pocketbase').default} pb
 * @returns {Object|null}
 */
export function getCurrentUser(pb) {
	if (!pb.authStore.isValid || !pb.authStore.record) return null;
	return formatUser(pb.authStore.record);
}

/**
 * Met à jour le profil utilisateur
 * @param {import('pocketbase').default} pb
 * @param {Object} profileData
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export async function updateProfile(pb, profileData) {
	try {
		const record = await pb.collection('users').update(pb.authStore.record.id, profileData);
		return { success: true, user: formatUser(record) };
	} catch (error) {
		console.error('Erreur updateProfile:', error);
		return {
			success: false,
			error: error?.response?.message || 'Erreur mise à jour'
		};
	}
}

/**
 * Demande de réinitialisation du mot de passe
 * @param {import('pocketbase').default} pb
 * @param {string} email
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function requestPasswordReset(pb, email) {
	try {
		await pb.collection('users').requestPasswordReset(email);
		return {
			success: true,
			message: 'Un email de réinitialisation a été envoyé'
		};
	} catch (error) {
		console.error('Erreur requestPasswordReset:', error);
		return {
			success: false,
			error: error?.response?.message || 'Erreur lors de la demande'
		};
	}
}

/**
 * Récupère l'annuaire des membres
 * @param {import('pocketbase').default} pb
 * @param {Object} options
 * @returns {Promise<{members: Array, total: number, totalPages: number}>}
 */
export async function getMemberDirectory(pb, { perPage = 20, page = 1, search = '' } = {}) {
	try {
		let filter = 'showInDirectory = true';
		if (search) {
			filter += ` && (name ~ "${search}" || structure ~ "${search}" || fonction ~ "${search}")`;
		}

		const result = await pb.collection('users').getList(page, perPage, {
			filter,
			sort: 'name'
		});

		return {
			members: result.items.map(formatUser),
			total: result.totalItems,
			totalPages: result.totalPages
		};
	} catch (error) {
		console.error('Erreur getMemberDirectory:', error);
		return { members: [], total: 0, totalPages: 0 };
	}
}

/**
 * Récupère les événements membres
 * @param {import('pocketbase').default} pb
 * @param {Object} options
 * @returns {Promise<{events: Array, total: number, totalPages: number}>}
 */
export async function getMemberEvents(pb, { perPage = 20, page = 1, upcoming = true } = {}) {
	try {
		const now = new Date().toISOString();
		const filter = upcoming ? `date >= "${now}"` : '';
		const sort = upcoming ? 'date' : '-date';

		const result = await pb.collection('events').getList(page, perPage, {
			filter,
			sort
		});

		return {
			events: result.items,
			total: result.totalItems,
			totalPages: result.totalPages
		};
	} catch (error) {
		console.error('Erreur getMemberEvents:', error);
		return { events: [], total: 0, totalPages: 0 };
	}
}

/**
 * Récupère un événement par son slug
 * @param {import('pocketbase').default} pb
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getEventBySlug(pb, slug) {
	try {
		return await pb.collection('events').getFirstListItem(`slug = "${slug}"`);
	} catch (error) {
		console.error('Erreur getEventBySlug:', error);
		return null;
	}
}

/**
 * S'inscrire à un événement
 * @param {import('pocketbase').default} pb
 * @param {string} eventId
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function registerForEvent(pb, eventId) {
	try {
		await pb.collection('event_registrations').create({
			event: eventId,
			user: pb.authStore.record.id
		});
		return { success: true };
	} catch (error) {
		console.error('Erreur registerForEvent:', error);
		return { success: false, error: error?.response?.message || 'Erreur inscription' };
	}
}

/**
 * Récupère l'historique des cotisations
 * @param {import('pocketbase').default} pb
 * @returns {Promise<{cotisations: Array, status: Object|null}>}
 */
export async function getCotisations(pb) {
	try {
		const userId = pb.authStore.record.id;
		const result = await pb.collection('cotisations').getList(1, 50, {
			filter: `user = "${userId}"`,
			sort: '-year'
		});

		// Déterminer le statut (la cotisation la plus récente)
		const currentYear = new Date().getFullYear();
		const currentCotisation = result.items.find(c => c.year === currentYear);
		const status = currentCotisation
			? { isActive: currentCotisation.status === 'paid', year: currentYear }
			: { isActive: false, year: currentYear };

		return {
			cotisations: result.items,
			status
		};
	} catch (error) {
		console.error('Erreur getCotisations:', error);
		return { cotisations: [], status: null };
	}
}

/**
 * Récupère les documents membres
 * @param {import('pocketbase').default} pb
 * @param {Object} options
 * @returns {Promise<{documents: Array, total: number, totalPages: number}>}
 */
export async function getMemberDocuments(pb, { perPage = 20, page = 1, category = '' } = {}) {
	try {
		let filter = '';
		if (category) {
			filter = `category = "${category}"`;
		}

		const result = await pb.collection('documents').getList(page, perPage, {
			filter,
			sort: '-created'
		});

		return {
			documents: result.items,
			total: result.totalItems,
			totalPages: result.totalPages
		};
	} catch (error) {
		console.error('Erreur getMemberDocuments:', error);
		return { documents: [], total: 0, totalPages: 0 };
	}
}

/**
 * Déconnecte l'utilisateur
 * @param {import('pocketbase').default} pb
 */
export function logoutUser(pb) {
	pb.authStore.clear();
}

// =====================
// Fonctions Admin
// =====================

/**
 * Vérifie si l'utilisateur courant est admin
 * @param {import('pocketbase').RecordModel|null} user
 * @returns {boolean}
 */
export function isAdmin(user) {
	return user?.role === 'admin';
}

/**
 * Récupère tous les membres (admin)
 * @param {import('pocketbase').default} pb
 * @param {Object} options
 * @returns {Promise<{members: Array, total: number, totalPages: number}>}
 */
export async function getAllMembers(pb, { perPage = 20, page = 1, search = '', status = '', sort = '-created' } = {}) {
	try {
		const filters = [];
		if (search) {
			filters.push(`(name ~ "${search}" || email ~ "${search}" || structure ~ "${search}")`);
		}
		if (status) {
			filters.push(`status = "${status}"`);
		}

		const result = await pb.collection('users').getList(page, perPage, {
			filter: filters.join(' && '),
			sort
		});

		return {
			members: result.items.map(formatUser),
			total: result.totalItems,
			totalPages: result.totalPages
		};
	} catch (error) {
		console.error('Erreur getAllMembers:', error);
		return { members: [], total: 0, totalPages: 0 };
	}
}

/**
 * Récupère un membre par ID (admin)
 * @param {import('pocketbase').default} pb
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getMemberById(pb, id) {
	try {
		const record = await pb.collection('users').getOne(id);
		return formatUser(record);
	} catch (error) {
		console.error('Erreur getMemberById:', error);
		return null;
	}
}

/**
 * Crée un nouveau membre (admin)
 * @param {import('pocketbase').default} pb
 * @param {Object} data
 * @returns {Promise<{success: boolean, member?: Object, error?: string}>}
 */
export async function createMember(pb, data) {
	try {
		const record = await pb.collection('users').create({
			...data,
			emailVisibility: true,
			role: data.role || 'member',
			status: 'active',
			showInDirectory: true
		});
		return { success: true, member: formatUser(record) };
	} catch (error) {
		console.error('Erreur createMember:', error);
		return {
			success: false,
			error: error?.response?.message || 'Erreur lors de la création'
		};
	}
}

/**
 * Met à jour un membre (admin)
 * @param {import('pocketbase').default} pb
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<{success: boolean, member?: Object, error?: string}>}
 */
export async function updateMember(pb, id, data) {
	try {
		const record = await pb.collection('users').update(id, data);
		return { success: true, member: formatUser(record) };
	} catch (error) {
		console.error('Erreur updateMember:', error);
		return {
			success: false,
			error: error?.response?.message || 'Erreur lors de la mise à jour'
		};
	}
}

/**
 * Supprime un membre (admin)
 * @param {import('pocketbase').default} pb
 * @param {string} id
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteMember(pb, id) {
	try {
		await pb.collection('users').delete(id);
		return { success: true };
	} catch (error) {
		console.error('Erreur deleteMember:', error);
		return {
			success: false,
			error: error?.response?.message || 'Erreur lors de la suppression'
		};
	}
}

/**
 * Récupère les stats pour le dashboard admin
 * @param {import('pocketbase').default} pb
 * @returns {Promise<Object>}
 */
export async function getAdminStats(pb) {
	try {
		const currentYear = new Date().getFullYear();

		const [members, activeMembers, cotisationsPaid, cotisationsPending] = await Promise.all([
			pb.collection('users').getList(1, 1, { filter: 'id != ""' }),
			pb.collection('users').getList(1, 1, { filter: 'status = "active"' }),
			pb.collection('cotisations').getList(1, 1, { filter: `year = ${currentYear} && status = "paid"` }),
			pb.collection('cotisations').getList(1, 1, { filter: `year = ${currentYear} && status = "pending"` })
		]);

		return {
			totalMembers: members.totalItems,
			activeMembers: activeMembers.totalItems,
			cotisationsPaid: cotisationsPaid.totalItems,
			cotisationsPending: cotisationsPending.totalItems
		};
	} catch (error) {
		console.error('Erreur getAdminStats:', error);
		return { totalMembers: 0, activeMembers: 0, cotisationsPaid: 0, cotisationsPending: 0 };
	}
}

/**
 * Récupère toutes les cotisations (admin)
 * @param {import('pocketbase').default} pb
 * @param {Object} options
 * @returns {Promise<{cotisations: Array, total: number, totalPages: number}>}
 */
export async function getAllCotisations(pb, { perPage = 20, page = 1, year = '', status = '' } = {}) {
	try {
		const filters = [];
		if (year) filters.push(`year = ${year}`);
		if (status) filters.push(`status = "${status}"`);

		const result = await pb.collection('cotisations').getList(page, perPage, {
			filter: filters.join(' && '),
			sort: '-year,-created',
			expand: 'user'
		});

		return {
			cotisations: result.items.map(c => ({
				...c,
				userName: c.expand?.user?.name || 'Inconnu',
				userEmail: c.expand?.user?.email || ''
			})),
			total: result.totalItems,
			totalPages: result.totalPages
		};
	} catch (error) {
		console.error('Erreur getAllCotisations:', error);
		return { cotisations: [], total: 0, totalPages: 0 };
	}
}

/**
 * Met à jour une cotisation (admin)
 * @param {import('pocketbase').default} pb
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateCotisation(pb, id, data) {
	try {
		await pb.collection('cotisations').update(id, data);
		return { success: true };
	} catch (error) {
		console.error('Erreur updateCotisation:', error);
		return { success: false, error: error?.response?.message || 'Erreur mise à jour' };
	}
}

/**
 * Crée une cotisation (admin)
 * @param {import('pocketbase').default} pb
 * @param {Object} data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function createCotisation(pb, data) {
	try {
		await pb.collection('cotisations').create(data);
		return { success: true };
	} catch (error) {
		console.error('Erreur createCotisation:', error);
		return { success: false, error: error?.response?.message || 'Erreur création' };
	}
}
