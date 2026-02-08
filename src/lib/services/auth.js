/**
 * Service d'authentification - API WordPress JWT
 */

const WP_API_BASE = 'https://afmef.bj/wp-json';

/**
 * Authentifie un utilisateur via JWT WordPress
 * @param {string} username - Email ou username
 * @param {string} password - Mot de passe
 * @returns {Promise<{success: boolean, token?: string, user?: Object, error?: string}>}
 */
export async function authenticateUser(username, password) {
	try {
		const response = await fetch(`${WP_API_BASE}/jwt-auth/v1/token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();

		if (response.ok && data.token) {
			return {
				success: true,
				token: data.token,
				user: {
					id: data.user_id,
					email: data.user_email,
					displayName: data.user_display_name,
					nicename: data.user_nicename
				}
			};
		} else {
			return {
				success: false,
				error: data.message || 'Identifiants incorrects'
			};
		}
	} catch (error) {
		console.error('Erreur authenticateUser:', error);
		return {
			success: false,
			error: 'Erreur de connexion au serveur'
		};
	}
}

/**
 * Valide un token JWT
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export async function validateToken(token) {
	try {
		const response = await fetch(`${WP_API_BASE}/jwt-auth/v1/token/validate`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		return response.ok;
	} catch (error) {
		console.error('Erreur validateToken:', error);
		return false;
	}
}

/**
 * Récupère les informations complètes de l'utilisateur connecté
 * @param {string} token
 * @returns {Promise<Object|null>}
 */
export async function getUserInfo(token) {
	try {
		const response = await fetch(`${WP_API_BASE}/wp/v2/users/me?context=edit`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (response.ok) {
			const data = await response.json();
			// Formater les données utilisateur
			return {
				id: data.id,
				displayName: data.name,
				email: data.email || '',
				slug: data.slug,
				avatar: data.avatar_urls?.['96'] || null,
				description: data.description || '',
				// Ces champs seront disponibles avec un plugin custom
				phone: data.meta?.phone || '',
				structure: data.meta?.structure || '',
				fonction: data.meta?.fonction || '',
				privacy: {
					showEmail: data.meta?.show_email ?? true,
					showPhone: data.meta?.show_phone ?? false
				}
			};
		}
		return null;
	} catch (error) {
		console.error('Erreur getUserInfo:', error);
		return null;
	}
}

/**
 * Met à jour le profil utilisateur
 * @param {string} token
 * @param {Object} profileData
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export async function updateProfile(token, profileData) {
	try {
		const response = await fetch(`${WP_API_BASE}/afmef/v1/me`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(profileData)
		});

		const data = await response.json();

		if (response.ok) {
			return { success: true, user: data };
		} else {
			return { success: false, error: data.message || 'Erreur mise à jour' };
		}
	} catch (error) {
		console.error('Erreur updateProfile:', error);
		return { success: false, error: 'Erreur réseau' };
	}
}

/**
 * Demande de réinitialisation du mot de passe
 * @param {string} email
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function requestPasswordReset(email) {
	try {
		const response = await fetch(`${WP_API_BASE}/afmef/v1/password-reset`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email })
		});

		const data = await response.json();

		if (response.ok) {
			return { success: true, message: data.message };
		} else {
			return { success: false, error: data.message || 'Erreur' };
		}
	} catch (error) {
		console.error('Erreur requestPasswordReset:', error);
		return { success: false, error: 'Erreur réseau' };
	}
}

/**
 * Récupère les documents membres
 * @param {string} token
 * @param {Object} options
 * @returns {Promise<{documents: Array, total: number, totalPages: number}>}
 */
export async function getMemberDocuments(token, { perPage = 20, page = 1, category = '' } = {}) {
	try {
		const params = new URLSearchParams({
			per_page: perPage.toString(),
			page: page.toString()
		});
		if (category) params.append('category', category);

		const response = await fetch(`${WP_API_BASE}/afmef/v1/documents?${params}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (response.ok) {
			const documents = await response.json();
			const total = parseInt(response.headers.get('X-WP-Total') || '0');
			const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');
			return { documents, total, totalPages };
		}
		return { documents: [], total: 0, totalPages: 0 };
	} catch (error) {
		console.error('Erreur getMemberDocuments:', error);
		return { documents: [], total: 0, totalPages: 0 };
	}
}

/**
 * Récupère l'annuaire des membres
 * @param {string} token
 * @param {Object} options
 * @returns {Promise<{members: Array, total: number, totalPages: number}>}
 */
export async function getMemberDirectory(token, { perPage = 20, page = 1, search = '' } = {}) {
	try {
		const params = new URLSearchParams({
			per_page: perPage.toString(),
			page: page.toString()
		});
		if (search) params.append('search', search);

		const response = await fetch(`${WP_API_BASE}/afmef/v1/members?${params}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (response.ok) {
			const members = await response.json();
			const total = parseInt(response.headers.get('X-WP-Total') || '0');
			const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');
			return { members, total, totalPages };
		}
		return { members: [], total: 0, totalPages: 0 };
	} catch (error) {
		console.error('Erreur getMemberDirectory:', error);
		return { members: [], total: 0, totalPages: 0 };
	}
}

/**
 * Récupère les événements membres
 * @param {string} token
 * @param {Object} options
 * @returns {Promise<{events: Array, total: number, totalPages: number}>}
 */
export async function getMemberEvents(token, { perPage = 20, page = 1, upcoming = true } = {}) {
	try {
		const params = new URLSearchParams({
			per_page: perPage.toString(),
			page: page.toString(),
			upcoming: upcoming.toString()
		});

		const response = await fetch(`${WP_API_BASE}/afmef/v1/events?${params}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (response.ok) {
			const events = await response.json();
			const total = parseInt(response.headers.get('X-WP-Total') || '0');
			const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');
			return { events, total, totalPages };
		}
		return { events: [], total: 0, totalPages: 0 };
	} catch (error) {
		console.error('Erreur getMemberEvents:', error);
		return { events: [], total: 0, totalPages: 0 };
	}
}

/**
 * Récupère un événement par slug
 * @param {string} token
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getEventBySlug(token, slug) {
	try {
		const response = await fetch(`${WP_API_BASE}/afmef/v1/events/${slug}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (response.ok) {
			return await response.json();
		}
		return null;
	} catch (error) {
		console.error('Erreur getEventBySlug:', error);
		return null;
	}
}

/**
 * S'inscrire à un événement
 * @param {string} token
 * @param {number} eventId
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function registerForEvent(token, eventId) {
	try {
		const response = await fetch(`${WP_API_BASE}/afmef/v1/events/${eventId}/register`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (response.ok) {
			return { success: true };
		}
		const data = await response.json();
		return { success: false, error: data.message };
	} catch (error) {
		console.error('Erreur registerForEvent:', error);
		return { success: false, error: 'Erreur réseau' };
	}
}

/**
 * Récupère l'historique des cotisations
 * @param {string} token
 * @returns {Promise<{cotisations: Array, status: Object}>}
 */
export async function getCotisations(token) {
	try {
		const response = await fetch(`${WP_API_BASE}/afmef/v1/cotisations`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (response.ok) {
			return await response.json();
		}
		return { cotisations: [], status: null };
	} catch (error) {
		console.error('Erreur getCotisations:', error);
		return { cotisations: [], status: null };
	}
}
