#!/usr/bin/env node
/**
 * Crée (ou promeut) un compte administrateur pour l'espace /gestion,
 * et optionnellement un superuser PocketBase (/admin).
 *
 * Usage :
 *   node scripts/create-admin.js --email client@exemple.bj --name "Prénom Nom" [--password xxx] [--superuser]
 *
 * Variables d'environnement (superuser PocketBase existant) :
 *   PB_URL            (défaut : https://afmef.bj)
 *   PB_ADMIN_EMAIL    (défaut : admin@afmef.bj)
 *   PB_ADMIN_PASSWORD (obligatoire)
 *
 * - Si le compte existe déjà dans `users`, il est promu admin / activé
 *   (et son mot de passe est remplacé uniquement si --password est fourni).
 * - Sans --password, un mot de passe aléatoire est généré et affiché.
 * - --superuser crée aussi un accès au dashboard PocketBase avec les mêmes identifiants.
 */
import PocketBase from 'pocketbase';
import { randomBytes } from 'node:crypto';

const args = parseArgs(process.argv.slice(2));
const PB_URL = process.env.PB_URL || 'https://afmef.bj';
const SU_EMAIL = process.env.PB_ADMIN_EMAIL || 'admin@afmef.bj';
const SU_PASSWORD = process.env.PB_ADMIN_PASSWORD;

if (!args.email || !args.name || args.help) {
	console.error(
		'Usage : PB_ADMIN_PASSWORD=... node scripts/create-admin.js --email <email> --name "<nom>" [--password <mdp>] [--superuser]'
	);
	process.exit(args.help ? 0 : 1);
}
if (!SU_PASSWORD) {
	console.error('PB_ADMIN_PASSWORD manquant (mot de passe superuser PocketBase).');
	process.exit(1);
}

const password = args.password || generatePassword();
if (password.length < 8) {
	console.error('Le mot de passe doit contenir au moins 8 caractères.');
	process.exit(1);
}

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

try {
	await pb.collection('_superusers').authWithPassword(SU_EMAIL, SU_PASSWORD);
} catch (e) {
	console.error(`Connexion superuser impossible sur ${PB_URL} : ${e?.response?.message || e.message}`);
	process.exit(1);
}

// --- Compte /gestion (collection users) ---
let user = await pb
	.collection('users')
	.getFirstListItem(`email = "${args.email}"`)
	.catch(() => null);

let action;
if (user) {
	const data = { role: 'admin', status: 'active', verified: true };
	if (args.password) Object.assign(data, { password, passwordConfirm: password });
	user = await pb.collection('users').update(user.id, data);
	action = args.password ? 'promu admin + mot de passe remplacé' : 'promu admin (mot de passe inchangé)';
} else {
	user = await pb.collection('users').create({
		email: args.email,
		name: args.name,
		password,
		passwordConfirm: password,
		emailVisibility: true,
		verified: true,
		role: 'admin',
		status: 'active',
		showInDirectory: true,
		showEmail: true,
		showPhone: false,
		phone: args.phone || '',
		structure: args.structure || '',
		fonction: args.fonction || ''
	});
	action = 'créé';
}

// Vérification : le compte peut réellement se connecter
const check = new PocketBase(PB_URL);
let loginOk = false;
if (!user || (action !== 'promu admin (mot de passe inchangé)')) {
	loginOk = await check
		.collection('users')
		.authWithPassword(args.email, password)
		.then(() => true)
		.catch(() => false);
}

// --- Superuser PocketBase (dashboard /admin) ---
let superuserAction = null;
if (args.superuser) {
	const existing = await pb
		.collection('_superusers')
		.getFirstListItem(`email = "${args.email}"`)
		.catch(() => null);
	if (existing) {
		await pb.collection('_superusers').update(existing.id, { password, passwordConfirm: password });
		superuserAction = 'mot de passe superuser mis à jour';
	} else {
		await pb.collection('_superusers').create({ email: args.email, password, passwordConfirm: password });
		superuserAction = 'superuser créé';
	}
}

console.log('');
console.log('=== Compte administrateur ===');
console.log(`Espace Gestion : ${PB_URL}/gestion  (compte ${action})`);
console.log(`  Connexion    : ${PB_URL}/espace-membre/connexion`);
console.log(`  Email        : ${args.email}`);
console.log(`  Mot de passe : ${action.includes('inchangé') ? '(inchangé)' : password}`);
if (action !== 'promu admin (mot de passe inchangé)') {
	console.log(`  Test connexion : ${loginOk ? 'OK' : 'ÉCHEC — vérifier manuellement'}`);
}
if (superuserAction) {
	console.log(`PocketBase     : ${PB_URL}/admin  (${superuserAction})`);
	console.log(`  Email        : ${args.email}`);
	console.log(`  Mot de passe : ${password}`);
}
console.log('');

function parseArgs(argv) {
	const out = {};
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (!a.startsWith('--')) continue;
		const key = a.slice(2);
		const next = argv[i + 1];
		if (next === undefined || next.startsWith('--')) out[key] = true;
		else {
			out[key] = next;
			i++;
		}
	}
	return out;
}

function generatePassword(length = 16) {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
	return [...randomBytes(length)].map((b) => chars[b % chars.length]).join('');
}
