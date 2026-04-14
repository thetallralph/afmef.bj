#!/usr/bin/env node

/**
 * Migration WordPress → PocketBase
 *
 * Usage: POCKETBASE_URL=http://... POCKETBASE_ADMIN_EMAIL=... POCKETBASE_ADMIN_PASSWORD=... node scripts/migrate-wp.js
 */

import PocketBase from 'pocketbase';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, basename } from 'path';
import dns from 'dns';

// Force IPv4 to avoid stale AAAA record timeouts
dns.setDefaultResultOrder('ipv4first');

const WP_API = 'https://afmef.bj/wp-json/wp/v2';
const PB_URL = process.env.POCKETBASE_URL || 'http://localhost:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
	console.error('Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD');
	process.exit(1);
}

const pb = new PocketBase(PB_URL);

// ── Helpers ──

function decodeHtmlEntities(text) {
	if (!text) return '';
	return text
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
		.replace(/&#x([0-9A-Fa-f]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
		.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"').replace(/&rsquo;/g, "'").replace(/&lsquo;/g, "'")
		.replace(/&rdquo;/g, '"').replace(/&ldquo;/g, '"')
		.replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
		.replace(/&hellip;/g, '…').replace(/&nbsp;/g, ' ');
}

function extractExcerpt(html, maxLength = 200) {
	if (!html) return '';
	let text = html
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
		.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	text = decodeHtmlEntities(text);
	if (text.length > maxLength) {
		text = text.substring(0, maxLength);
		const lastSpace = text.lastIndexOf(' ');
		if (lastSpace > maxLength * 0.8) text = text.substring(0, lastSpace);
		text += '…';
	}
	return text;
}

async function fetchJson(url) {
	const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
	if (!res.ok) throw new Error(`${res.status} ${url}`);
	const total = parseInt(res.headers.get('X-WP-Total') || '0');
	const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '0');
	const data = await res.json();
	return { data, total, totalPages };
}

async function downloadFile(url) {
	const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
	if (!res.ok) throw new Error(`Download failed: ${res.status} ${url}`);
	const buffer = Buffer.from(await res.arrayBuffer());
	const contentType = res.headers.get('content-type') || 'application/octet-stream';
	const filename = basename(new URL(url).pathname);
	return new File([buffer], filename, { type: contentType });
}

// ── Collections ──

async function createCollections() {
	console.log('\n📦 Creating PocketBase collections...');

	// Step 1: Create type_activites first
	try {
		await pb.collections.getOne('type_activites');
		console.log('  ✓ type_activites already exists');
	} catch {
		await pb.collections.create({
			name: 'type_activites',
			type: 'base',
			listRule: '',
			viewRule: '',
			fields: [
				{ name: 'name', type: 'text', required: true },
				{ name: 'slug', type: 'text', required: true },
			],
		});
		console.log('  ✓ type_activites created');
	}

	// Get type_activites ID for relation
	const typeCol = await pb.collections.getOne('type_activites');

	// Step 2: Create activites with relation to type_activites
	try {
		await pb.collections.getOne('activites');
		console.log('  ✓ activites already exists');
	} catch {
		await pb.collections.create({
			name: 'activites',
			type: 'base',
			listRule: '',
			viewRule: '',
			fields: [
				{ name: 'slug', type: 'text', required: true },
				{ name: 'title', type: 'text', required: true },
				{ name: 'content', type: 'editor' },
				{ name: 'excerpt', type: 'text' },
				{ name: 'date', type: 'date', required: true },
				{ name: 'image', type: 'file', maxSelect: 1, maxSize: 10485760 },
				{ name: 'imageAlt', type: 'text' },
				{ name: 'types', type: 'relation', collectionId: typeCol.id, maxSelect: 10 },
			],
		});
		console.log('  ✓ activites created');
	}

	// Step 3: Create ressources
	try {
		await pb.collections.getOne('ressources');
		console.log('  ✓ ressources already exists');
	} catch {
		await pb.collections.create({
			name: 'ressources',
			type: 'base',
			listRule: '',
			viewRule: '',
			fields: [
				{ name: 'slug', type: 'text', required: true },
				{ name: 'title', type: 'text', required: true },
				{ name: 'description', type: 'text' },
				{ name: 'date', type: 'date' },
				{ name: 'fichier', type: 'file', maxSelect: 1, maxSize: 52428800 },
				{ name: 'fichierType', type: 'text' },
			],
		});
		console.log('  ✓ ressources created');
	}
}

// ── Migrate Types ──

async function migrateTypes() {
	console.log('\n🏷️  Migrating activity types...');
	const { data: types } = await fetchJson(`${WP_API}/type_dactivite?per_page=100`);
	const typeMap = {}; // wp_id → pb_id

	for (const type of types) {
		const name = decodeHtmlEntities(type.name);
		const slug = type.slug;

		try {
			// Check if already exists
			const existing = await pb.collection('type_activites').getList(1, 1, { filter: `slug="${slug}"` });
			if (existing.totalItems > 0) {
				typeMap[type.id] = existing.items[0].id;
				console.log(`  ✓ ${name} (exists)`);
				continue;
			}

			const record = await pb.collection('type_activites').create({ name, slug });
			typeMap[type.id] = record.id;
			console.log(`  ✓ ${name}`);
		} catch (err) {
			console.error(`  ✗ ${name}: ${err.message}`);
		}
	}

	return typeMap;
}

// ── Migrate Activities ──

async function migrateActivities(typeMap) {
	console.log('\n📝 Migrating activities...');

	let page = 1;
	let totalPages = 1;
	let count = 0;

	while (page <= totalPages) {
		const result = await fetchJson(`${WP_API}/activite?per_page=20&page=${page}&_embed=true`);
		totalPages = result.totalPages;

		for (const raw of result.data) {
			const slug = raw.slug;
			const title = decodeHtmlEntities(raw.title.rendered);

			try {
				// Skip if exists
				const existing = await pb.collection('activites').getList(1, 1, { filter: `slug="${slug}"` });
				if (existing.totalItems > 0) {
					console.log(`  ✓ ${title} (exists)`);
					count++;
					continue;
				}

				const formData = new FormData();
				formData.append('slug', slug);
				formData.append('title', title);
				formData.append('content', raw.content.rendered || '');
				formData.append('excerpt', extractExcerpt(raw.content.rendered, 200));
				formData.append('date', raw.date);

				// Image
				const media = raw._embedded?.['wp:featuredmedia']?.[0];
				if (media?.source_url) {
					try {
						const imageFile = await downloadFile(media.source_url);
						formData.append('image', imageFile);
						formData.append('imageAlt', media.alt_text || '');
					} catch (err) {
						console.log(`    ⚠ Image failed for "${title}": ${err.message}`);
					}
				}

				// Types relation
				const wpTypes = raw._embedded?.['wp:term']?.[0] || [];
				const pbTypeIds = wpTypes
					.map(t => typeMap[t.id])
					.filter(Boolean);
				for (const id of pbTypeIds) {
					formData.append('types', id);
				}

				await pb.collection('activites').create(formData);
				count++;
				console.log(`  ✓ ${title}`);
			} catch (err) {
				console.error(`  ✗ ${title}: ${err.message}`);
			}
		}

		page++;
	}

	console.log(`  Total: ${count} activities`);
}

// ── Migrate Resources ──

async function migrateResources() {
	console.log('\n📄 Migrating resources...');

	let page = 1;
	let totalPages = 1;
	let count = 0;

	while (page <= totalPages) {
		const result = await fetchJson(`${WP_API}/ressource?per_page=20&page=${page}&_embed=true`);
		totalPages = result.totalPages;

		for (const raw of result.data) {
			const slug = raw.slug;
			const title = decodeHtmlEntities(raw.title.rendered);

			try {
				const existing = await pb.collection('ressources').getList(1, 1, { filter: `slug="${slug}"` });
				if (existing.totalItems > 0) {
					console.log(`  ✓ ${title} (exists)`);
					count++;
					continue;
				}

				const formData = new FormData();
				formData.append('slug', slug);
				formData.append('title', title);
				formData.append('description', extractExcerpt(raw.content?.rendered || raw.excerpt?.rendered || '', 200));
				formData.append('date', raw.date);

				// File attachment
				const fichier = raw.fichier || raw.acf?.fichier;
				if (fichier) {
					const fileUrl = fichier.guid || fichier.url;
					const fileType = (fichier.post_mime_type || fichier.subtype || 'pdf').split('/').pop();
					formData.append('fichierType', fileType);

					if (fileUrl) {
						try {
							const file = await downloadFile(fileUrl);
							formData.append('fichier', file);
						} catch (err) {
							console.log(`    ⚠ File failed for "${title}": ${err.message}`);
						}
					}
				}

				await pb.collection('ressources').create(formData);
				count++;
				console.log(`  ✓ ${title}`);
			} catch (err) {
				console.error(`  ✗ ${title}: ${err.message}`);
			}
		}

		page++;
	}

	console.log(`  Total: ${count} resources`);
}

// ── Download static images ──

async function downloadStaticImages() {
	console.log('\n🖼️  Downloading static page images...');

	const staticDir = join(process.cwd(), 'static', 'images', 'wp');
	if (!existsSync(staticDir)) await mkdir(staticDir, { recursive: true });

	const images = [
		// Homepage
		{ url: 'https://afmef.bj/wp-content/uploads/2025/11/5D3_0067-1024x606.jpg', name: 'activite-renforcement.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/2025/11/0R7A9304-1024x683.jpg', name: 'activite-actions-sociales.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/2025/11/031A5390-1024x683.jpg', name: 'activite-celebrations.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/2025/11/5D3_0013-copie-1024x683.jpg', name: 'activite-sensibilisation.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/2025/03/8W6A2398-2.png', name: 'activite-initiatives.png' },
		{ url: 'https://afmef.bj/wp-content/uploads/2025/03/Capture-decran-2025-03-12-092700.png', name: 'hero-fallback.png' },
		{ url: 'https://afmef.bj/wp-content/uploads/2025/03/objectif-image.png', name: 'objectif-image.png' },
		// Genese
		{ url: 'https://afmef.bj/wp-content/uploads/2025/11/hero-about-1.png', name: 'hero-about.png' },
		{ url: 'https://afmef.bj/wp-content/uploads/2025/11/R144-bis-1-1481x1536.jpg', name: 'fondatrice-alice.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/2025/11/william-hd.png', name: 'fondateur-william.png' },
		{ url: 'https://afmef.bj/wp-content/uploads/2025/11/awaou-bako-hd-.png', name: 'presidente-awaou.png' },
		{ url: 'https://afmef.bj/wp-content/uploads/2025/11/vicentia-okry-hd.png', name: 'presidente-vicentia.png' },
		// Equipe dirigeante
		{ url: 'https://afmef.bj/wp-content/uploads/2025/11/0R7A0246-683x1024.jpg', name: 'equipe-presidente.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/elementor/thumbs/R40-scaled-reyd20ae17wuhc3mqlrzhc8h5tk0uxul8vtmwl1qxs.jpg', name: 'equipe-vp1.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/elementor/thumbs/R125-scaled-reycnsy6rcgv1gqdogqxsx9q07kcjlglykxhu23wyo.jpg', name: 'equipe-sg.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/elementor/thumbs/R109-scaled-reyczi1vt4hbirqpdirstz084twsbzwcwh70u0rjj4.jpg', name: 'equipe-tresoriere.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/elementor/thumbs/R113-scaled-reycsqlon181zrkbv3jfe6fua18pye1vn089jcsiao.jpg', name: 'equipe-organisatrice.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/elementor/thumbs/R123-scaled-reycs9ol80kw6s8wlw855apjl3k43u6pkohiwdhleo.jpg', name: 'equipe-sg-adj.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/elementor/thumbs/R129-scaled-reyde2jtqofbh6kuathmhanflu3ln3qkwl7ymf5v34.jpg', name: 'equipe-org-adj1.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/elementor/thumbs/R132-scaled-reydm7tgyzks3iquqc9838n8y1y4co2u0wrgcr315s.jpg', name: 'equipe-org-adj2.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/elementor/thumbs/R26-scaled-reydfhb3zqcsw4j42ffh7xubon5f6rc33kg6jd2lr4.jpg', name: 'equipe-culture.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/elementor/thumbs/R73-scaled-reydejgx5p2ha5w9k0swq6dqars7hnlqywyp9egrz4.jpg', name: 'equipe-formation.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/elementor/thumbs/R149-scaled-reydmnsq766nkw3n515vrmm31lrcziu9r3upigfc80.jpg', name: 'equipe-juridique.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/elementor/thumbs/R130-scaled-reyctqbjuqky8y4g2iz90xfcuoco2vzofx0prvbjq8.jpg', name: 'equipe-commissaire1.jpg' },
		{ url: 'https://afmef.bj/wp-content/uploads/elementor/thumbs/R35-scaled-reydf29oyds7qd4yi8xg41my6h7jrlodpi0euxowio.jpg', name: 'equipe-commissaire2.jpg' },
		// Logo page
		{ url: 'https://afmef.bj/wp-content/uploads/2024/03/image.png', name: 'logo-histoire.png' },
	];

	let downloaded = 0;
	for (const img of images) {
		const dest = join(staticDir, img.name);
		if (existsSync(dest)) {
			console.log(`  ✓ ${img.name} (exists)`);
			downloaded++;
			continue;
		}
		try {
			const res = await fetch(img.url, { signal: AbortSignal.timeout(30000) });
			if (!res.ok) throw new Error(`${res.status}`);
			const buffer = Buffer.from(await res.arrayBuffer());
			await writeFile(dest, buffer);
			downloaded++;
			console.log(`  ✓ ${img.name} (${(buffer.length / 1024).toFixed(0)}KB)`);
		} catch (err) {
			console.error(`  ✗ ${img.name}: ${err.message}`);
		}
	}

	console.log(`  Total: ${downloaded}/${images.length} images`);
}

// ── Main ──

async function main() {
	console.log('🚀 WordPress → PocketBase Migration');
	console.log(`   PocketBase: ${PB_URL}`);
	console.log(`   WordPress:  ${WP_API}`);

	// Auth (PocketBase 0.23+ uses _superusers collection)
	await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
	console.log('✓ Authenticated as admin');

	await createCollections();
	const typeMap = await migrateTypes();
	await migrateActivities(typeMap);
	await migrateResources();
	await downloadStaticImages();

	console.log('\n✅ Migration complete!');
	console.log('Next steps:');
	console.log('  1. Replace src/lib/services/wordpress.js with PocketBase calls');
	console.log('  2. Update hardcoded image URLs in static pages to /images/wp/...');
	console.log('  3. Remove nginx /wp-json/ and /wp-content/ proxy');
}

main().catch(err => {
	console.error('❌ Migration failed:', err);
	process.exit(1);
});
