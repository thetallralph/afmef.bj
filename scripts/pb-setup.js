#!/usr/bin/env node
/**
 * Met la base PocketBase à niveau pour le site + l'espace /gestion.
 *
 * Idempotent : crée uniquement ce qui manque, ajuste les règles d'accès,
 * ne touche jamais aux données existantes.
 *
 * Usage :
 *   PB_ADMIN_PASSWORD=... node scripts/pb-setup.js [--dry-run]
 *
 * Variables d'environnement :
 *   PB_URL            (défaut : https://afmef.bj)
 *   PB_ADMIN_EMAIL    (défaut : admin@afmef.bj)
 *   PB_ADMIN_PASSWORD (obligatoire)
 *
 * Modèle d'accès retenu :
 *   - contenu public (activites, ressources, type_activites, cms_content) : lecture ouverte,
 *     écriture réservée au superuser — l'espace /gestion écrit via un client superuser serveur ;
 *   - contenu membre (documents, events, cotisations) : lecture réservée aux connectés ;
 *   - users : lecture par les connectés (annuaire), modification de sa propre fiche uniquement.
 */
import PocketBase from 'pocketbase';

const PB_URL = process.env.PB_URL || 'https://afmef.bj';
const SU_EMAIL = process.env.PB_ADMIN_EMAIL || 'admin@afmef.bj';
const SU_PASSWORD = process.env.PB_ADMIN_PASSWORD;
const DRY_RUN = process.argv.includes('--dry-run');

if (!SU_PASSWORD) {
	console.error('PB_ADMIN_PASSWORD manquant (mot de passe superuser PocketBase).');
	process.exit(1);
}

const AUTH_ONLY = '@request.auth.id != ""';
const PUBLIC = '';

/** Règles appliquées aux collections déjà existantes comme aux nouvelles. */
const RULES = {
	// L'annuaire ne doit exposer que les membres qui ont accepté d'y figurer.
	// La console /gestion, elle, passe par le client superuser côté serveur.
	users: {
		listRule: `${AUTH_ONLY} && (showInDirectory = true || id = @request.auth.id)`,
		viewRule: `${AUTH_ONLY} && (showInDirectory = true || id = @request.auth.id)`,
		createRule: PUBLIC,
		updateRule: 'id = @request.auth.id',
		deleteRule: null
	},
	type_activites: { listRule: PUBLIC, viewRule: PUBLIC, createRule: null, updateRule: null, deleteRule: null },
	activites: { listRule: PUBLIC, viewRule: PUBLIC, createRule: null, updateRule: null, deleteRule: null },
	ressources: { listRule: PUBLIC, viewRule: PUBLIC, createRule: null, updateRule: null, deleteRule: null },
	cms_content: { listRule: PUBLIC, viewRule: PUBLIC, createRule: null, updateRule: null, deleteRule: null },
	documents: { listRule: AUTH_ONLY, viewRule: AUTH_ONLY, createRule: null, updateRule: null, deleteRule: null },
	events: { listRule: AUTH_ONLY, viewRule: AUTH_ONLY, createRule: null, updateRule: null, deleteRule: null },
	cotisations: { listRule: AUTH_ONLY, viewRule: AUTH_ONLY, createRule: null, updateRule: null, deleteRule: null },
	event_registrations: {
		listRule: AUTH_ONLY,
		viewRule: AUTH_ONLY,
		createRule: AUTH_ONLY,
		updateRule: null,
		deleteRule: 'user = @request.auth.id'
	}
};

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

/**
 * Collections à créer si absentes. Format « fields » de PocketBase 0.23+
 * (options à plat, pas dans un sous-objet `options`).
 * `$rel` est remplacé par l'id réel de la collection cible au moment de la création.
 */
const COLLECTIONS = [
	{
		name: 'type_activites',
		type: 'base',
		fields: [
			{ name: 'name', type: 'text', required: true },
			{ name: 'slug', type: 'text', required: true }
		]
	},
	{
		name: 'activites',
		type: 'base',
		fields: [
			{ name: 'title', type: 'text', required: true },
			{ name: 'slug', type: 'text', required: true },
			{ name: 'content', type: 'editor' },
			{ name: 'excerpt', type: 'text' },
			{ name: 'date', type: 'date', required: true },
			{ name: 'image', type: 'file', maxSelect: 1, maxSize: 5242880, mimeTypes: IMAGE_MIMES },
			{ name: 'imageAlt', type: 'text' },
			// maxSelect > 1 : le champ est une liste (le site lit types[0].name)
			{ name: 'types', type: 'relation', $rel: 'type_activites', maxSelect: 10 }
		]
	},
	{
		name: 'ressources',
		type: 'base',
		fields: [
			{ name: 'title', type: 'text', required: true },
			{ name: 'slug', type: 'text', required: true },
			{ name: 'description', type: 'text' },
			{ name: 'date', type: 'date' },
			{ name: 'fichier', type: 'file', maxSelect: 1, maxSize: 10485760 },
			{ name: 'fichierType', type: 'text' }
		]
	},
	{
		name: 'cms_content',
		type: 'base',
		fields: [
			{ name: 'page', type: 'text', required: true },
			{ name: 'key', type: 'text', required: true },
			{ name: 'type', type: 'select', maxSelect: 1, values: ['text', 'richtext', 'image', 'gallery'] },
			{ name: 'value', type: 'text', max: 0 },
			{ name: 'image', type: 'file', maxSelect: 1, maxSize: 5242880, mimeTypes: IMAGE_MIMES },
			{ name: 'images', type: 'file', maxSelect: 50, maxSize: 5242880, mimeTypes: IMAGE_MIMES }
		],
		indexes: ['CREATE UNIQUE INDEX `idx_cms_content_page_key` ON `cms_content` (`page`, `key`)']
	},
	{
		name: 'documents',
		type: 'base',
		fields: [
			{ name: 'title', type: 'text', required: true },
			{ name: 'description', type: 'text' },
			{ name: 'file', type: 'file', required: true, maxSelect: 1, maxSize: 10485760 },
			{ name: 'category', type: 'select', maxSelect: 1, values: ['rapport', 'pv', 'formation', 'autre'] }
		]
	},
	{
		name: 'events',
		type: 'base',
		fields: [
			{ name: 'title', type: 'text', required: true },
			{ name: 'slug', type: 'text', required: true },
			{ name: 'description', type: 'editor' },
			{ name: 'date', type: 'date', required: true },
			{ name: 'endDate', type: 'date' },
			{ name: 'location', type: 'text' },
			{ name: 'image', type: 'file', maxSelect: 1, maxSize: 5242880, mimeTypes: IMAGE_MIMES },
			{ name: 'maxParticipants', type: 'number' }
		]
	},
	{
		name: 'cotisations',
		type: 'base',
		fields: [
			{ name: 'user', type: 'relation', required: true, $rel: 'users', maxSelect: 1, cascadeDelete: true },
			{ name: 'year', type: 'number', required: true },
			{ name: 'amount', type: 'number', required: true },
			{ name: 'status', type: 'select', maxSelect: 1, values: ['pending', 'paid'] },
			{ name: 'paidAt', type: 'date' },
			{ name: 'method', type: 'select', maxSelect: 1, values: ['mobile_money', 'virement', 'especes', 'kkiapay'] },
			{ name: 'transactionId', type: 'text' }
		]
	},
	{
		name: 'event_registrations',
		type: 'base',
		fields: [
			{ name: 'event', type: 'relation', required: true, $rel: 'events', maxSelect: 1, cascadeDelete: true },
			{ name: 'user', type: 'relation', required: true, $rel: 'users', maxSelect: 1, cascadeDelete: true },
			{ name: 'registeredAt', type: 'autodate', onCreate: true, onUpdate: false }
		],
		indexes: [
			'CREATE UNIQUE INDEX `idx_event_registrations_unique` ON `event_registrations` (`event`, `user`)'
		]
	}
];

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

const summary = { created: [], skipped: [], rules: [], errors: [] };

try {
	await pb.collection('_superusers').authWithPassword(SU_EMAIL, SU_PASSWORD);
	console.log(`✓ Authentifié sur ${PB_URL} en tant que ${SU_EMAIL}`);
} catch (error) {
	console.error(`✗ Authentification superuser impossible : ${message(error)}`);
	process.exit(1);
}

/** @type {Map<string, import('pocketbase').CollectionModel>} */
const byName = new Map();
for (const c of await pb.collections.getFullList()) byName.set(c.name, c);

// --- 1. Créer les collections manquantes -------------------------------------
for (const def of COLLECTIONS) {
	if (byName.has(def.name)) {
		summary.skipped.push(def.name);
		continue;
	}

	// En dry-run, les collections cibles des relations n'existent pas encore :
	// on annonce la création sans résoudre les identifiants.
	if (DRY_RUN) {
		console.log(`· [dry-run] créerait la collection « ${def.name} »`);
		summary.created.push(def.name);
		continue;
	}

	const fields = def.fields.map((field) => {
		const { $rel, ...rest } = field;
		if (!$rel) return rest;
		const target = byName.get($rel);
		if (!target) throw new Error(`Collection cible « ${$rel} » introuvable pour ${def.name}.${field.name}`);
		return { ...rest, collectionId: target.id };
	});

	const payload = { name: def.name, type: def.type, fields, ...(RULES[def.name] ?? {}) };
	if (def.indexes) payload.indexes = def.indexes;

	try {
		const created = await pb.collections.create(payload);
		byName.set(def.name, created);
		summary.created.push(def.name);
		console.log(`✓ Collection « ${def.name} » créée`);
	} catch (error) {
		summary.errors.push(`${def.name} : ${message(error)}`);
		console.error(`✗ Création de « ${def.name} » : ${message(error)}`);
	}
}

// --- 1 bis. Champs personnalisés de la collection users ----------------------
const USER_FIELDS = [
	{ name: 'phone', type: 'text' },
	{ name: 'structure', type: 'text' },
	{ name: 'fonction', type: 'text' },
	{ name: 'description', type: 'text' },
	{ name: 'showEmail', type: 'bool' },
	{ name: 'showPhone', type: 'bool' },
	{ name: 'showInDirectory', type: 'bool' },
	{ name: 'role', type: 'select', maxSelect: 1, values: ['member', 'admin'] },
	{ name: 'status', type: 'select', maxSelect: 1, values: ['active', 'inactive', 'pending'] }
];

{
	const users = byName.get('users');
	if (!users) {
		console.log('· Collection « users » introuvable, champs personnalisés ignorés');
	} else {
		const existing = new Set(users.fields.map((f) => f.name));
		const missing = USER_FIELDS.filter((f) => !existing.has(f.name));

		if (missing.length === 0) {
			console.log('· Champs personnalisés de « users » déjà présents');
		} else if (DRY_RUN) {
			console.log(`· [dry-run] ajouterait à « users » : ${missing.map((f) => f.name).join(', ')}`);
		} else {
			try {
				const updated = await pb.collections.update(users.id, {
					fields: [...users.fields, ...missing]
				});
				byName.set('users', updated);
				console.log(`✓ Champs ajoutés à « users » : ${missing.map((f) => f.name).join(', ')}`);
			} catch (error) {
				summary.errors.push(`users (champs) : ${message(error)}`);
				console.error(`✗ Champs de « users » : ${message(error)}`);
			}
		}
	}
}

// --- 2. Aligner les règles d'accès -------------------------------------------
for (const [name, rules] of Object.entries(RULES)) {
	const collection = byName.get(name);
	if (!collection) {
		console.log(`· Collection « ${name} » absente, règles ignorées`);
		continue;
	}

	const diff = Object.entries(rules).filter(([rule, value]) => collection[rule] !== value);
	if (diff.length === 0) continue;

	const detail = diff.map(([rule, value]) => `${rule}: ${format(collection[rule])} → ${format(value)}`);

	if (DRY_RUN) {
		console.log(`· [dry-run] ${name} — ${detail.join(', ')}`);
		summary.rules.push(name);
		continue;
	}

	try {
		await pb.collections.update(collection.id, rules);
		summary.rules.push(name);
		console.log(`✓ Règles mises à jour sur « ${name} » — ${detail.join(', ')}`);
	} catch (error) {
		summary.errors.push(`${name} (règles) : ${message(error)}`);
		console.error(`✗ Règles de « ${name} » : ${message(error)}`);
	}
}

// --- 3. Résumé ----------------------------------------------------------------
console.log('\n── Résumé ──────────────────────────────');
console.log(`Collections créées   : ${summary.created.length ? summary.created.join(', ') : 'aucune'}`);
console.log(`Déjà présentes       : ${summary.skipped.length ? summary.skipped.join(', ') : 'aucune'}`);
console.log(`Règles ajustées      : ${summary.rules.length ? summary.rules.join(', ') : 'aucune'}`);
if (summary.errors.length) {
	console.log(`Erreurs              : ${summary.errors.length}`);
	for (const e of summary.errors) console.log(`  - ${e}`);
	process.exit(1);
}
console.log(DRY_RUN ? '\nAucune modification appliquée (--dry-run).' : '\nBase à jour.');

/** @param {unknown} error */
function message(error) {
	if (error && typeof error === 'object') {
		const response = /** @type {any} */ (error).response;
		if (response?.message) {
			const data = response.data ? ` ${JSON.stringify(response.data)}` : '';
			return `${response.message}${data}`;
		}
	}
	return error instanceof Error ? error.message : String(error);
}

/** @param {unknown} value */
function format(value) {
	if (value === null || value === undefined) return 'superuser';
	if (value === '') return 'public';
	return `"${value}"`;
}
