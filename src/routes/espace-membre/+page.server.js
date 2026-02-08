import { redirect } from '@sveltejs/kit';

export function load() {
	// Rediriger vers l'annuaire par défaut
	throw redirect(302, '/espace-membre/annuaire');
}
