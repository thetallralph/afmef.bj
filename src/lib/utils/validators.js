/**
 * Utilitaires de validation pour les formulaires
 */

/**
 * Valide une adresse email
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Valide un numéro de téléphone béninois
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
	// Format: +229 XX XX XX XX ou 0X XX XX XX
	const phoneRegex = /^(\+229\s?)?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/;
	return phoneRegex.test(phone.replace(/\s/g, '').replace(/-/g, ''));
}

/**
 * Valide un mot de passe (minimum 8 caractères)
 * @param {string} password
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validatePassword(password) {
	const errors = [];

	if (password.length < 8) {
		errors.push('Le mot de passe doit contenir au moins 8 caractères');
	}

	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Valide un champ requis
 * @param {string} value
 * @param {string} fieldName
 * @returns {{valid: boolean, error?: string}}
 */
export function validateRequired(value, fieldName) {
	if (!value || value.trim() === '') {
		return {
			valid: false,
			error: `${fieldName} est requis`
		};
	}
	return { valid: true };
}

/**
 * Valide un formulaire de connexion
 * @param {Object} data
 * @returns {{valid: boolean, errors: Object}}
 */
export function validateLoginForm(data) {
	const errors = {};

	if (!data.email || data.email.trim() === '') {
		errors.email = 'L\'email est requis';
	} else if (!isValidEmail(data.email)) {
		errors.email = 'Email invalide';
	}

	if (!data.password || data.password.trim() === '') {
		errors.password = 'Le mot de passe est requis';
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors
	};
}

/**
 * Valide un formulaire de profil
 * @param {Object} data
 * @returns {{valid: boolean, errors: Object}}
 */
export function validateProfileForm(data) {
	const errors = {};

	if (!data.displayName || data.displayName.trim() === '') {
		errors.displayName = 'Le nom est requis';
	}

	if (data.email && !isValidEmail(data.email)) {
		errors.email = 'Email invalide';
	}

	if (data.phone && !isValidPhone(data.phone)) {
		errors.phone = 'Numéro de téléphone invalide';
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors
	};
}

/**
 * Formate un numéro de téléphone
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
	if (!phone) return '';
	const cleaned = phone.replace(/\D/g, '');
	if (cleaned.length === 8) {
		return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)}`;
	}
	if (cleaned.length === 11 && cleaned.startsWith('229')) {
		return `+229 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)}`;
	}
	return phone;
}

/**
 * Formate une date en français
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
	if (!dateString) return '';
	const date = new Date(dateString);
	return date.toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}

/**
 * Formate une date et heure en français
 * @param {string} dateString
 * @returns {string}
 */
export function formatDateTime(dateString) {
	if (!dateString) return '';
	const date = new Date(dateString);
	return date.toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}
