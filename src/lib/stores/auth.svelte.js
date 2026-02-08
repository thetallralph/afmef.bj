/**
 * Store d'authentification Svelte 5
 * Gère l'état de connexion utilisateur
 */

let user = $state(null);
let isLoading = $state(true);
let isAuthenticated = $state(false);

/**
 * Initialise l'état d'authentification depuis le serveur
 */
export async function initAuth() {
	isLoading = true;
	try {
		const response = await fetch('/api/auth/me');
		if (response.ok) {
			const data = await response.json();
			user = data.user;
			isAuthenticated = true;
		} else {
			user = null;
			isAuthenticated = false;
		}
	} catch (error) {
		console.error('Erreur initialisation auth:', error);
		user = null;
		isAuthenticated = false;
	} finally {
		isLoading = false;
	}
}

/**
 * Connecte un utilisateur
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function login(email, password) {
	isLoading = true;
	try {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const data = await response.json();

		if (response.ok) {
			user = data.user;
			isAuthenticated = true;
			return { success: true };
		} else {
			return { success: false, error: data.error || 'Erreur de connexion' };
		}
	} catch (error) {
		console.error('Erreur login:', error);
		return { success: false, error: 'Erreur réseau. Veuillez réessayer.' };
	} finally {
		isLoading = false;
	}
}

/**
 * Déconnecte l'utilisateur
 */
export async function logout() {
	isLoading = true;
	try {
		await fetch('/api/auth/logout', { method: 'POST' });
	} catch (error) {
		console.error('Erreur logout:', error);
	} finally {
		user = null;
		isAuthenticated = false;
		isLoading = false;
	}
}

/**
 * Met à jour les données utilisateur localement
 * @param {Object} userData
 */
export function updateUser(userData) {
	user = { ...user, ...userData };
}

/**
 * Getters pour accéder à l'état
 */
export function getUser() {
	return user;
}

export function getIsLoading() {
	return isLoading;
}

export function getIsAuthenticated() {
	return isAuthenticated;
}
