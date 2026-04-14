/**
 * Store d'authentification Svelte 5
 * Gère l'état de connexion utilisateur via PocketBase
 */

import { getClientPB } from '$lib/pocketbase.js';
import { formatUser } from '$lib/services/auth.js';

let user = $state(null);
let isLoading = $state(true);
let isAuthenticated = $state(false);

/**
 * Initialise l'état d'authentification depuis PocketBase
 */
export function initAuth() {
	const pb = getClientPB();

	if (pb.authStore.isValid && pb.authStore.record) {
		user = formatUser(pb.authStore.record);
		isAuthenticated = true;
	} else {
		user = null;
		isAuthenticated = false;
	}
	isLoading = false;

	// Écouter les changements d'auth
	pb.authStore.onChange((token, record) => {
		if (token && record) {
			user = formatUser(record);
			isAuthenticated = true;
		} else {
			user = null;
			isAuthenticated = false;
		}
	});
}

/**
 * Initialise depuis les données serveur (SSR)
 * @param {Object|null} serverUser - Données utilisateur du serveur
 */
export function initFromServer(serverUser) {
	if (serverUser) {
		user = serverUser;
		isAuthenticated = true;
	} else {
		user = null;
		isAuthenticated = false;
	}
	isLoading = false;
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
		const pb = getClientPB();
		const authData = await pb.collection('users').authWithPassword(email, password);
		user = formatUser(authData.record);
		isAuthenticated = true;
		return { success: true };
	} catch (error) {
		console.error('Erreur login:', error);
		return {
			success: false,
			error: error?.response?.message || 'Identifiants incorrects'
		};
	} finally {
		isLoading = false;
	}
}

/**
 * Déconnecte l'utilisateur
 */
export async function logout() {
	const pb = getClientPB();
	pb.authStore.clear();
	// Effacer le cookie côté serveur
	await fetch('/api/auth/logout', { method: 'POST' });
	user = null;
	isAuthenticated = false;
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
