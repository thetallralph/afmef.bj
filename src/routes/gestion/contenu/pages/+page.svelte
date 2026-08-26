<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import RichTextEditor from '$lib/components/admin/RichTextEditor.svelte';

	let { data } = $props();

	let activePage = $state(data.pages[0]);
	let loading = $state(true);
	let flash = $state(/** @type {{type:'success'|'error', text:string}|null} */ (null));

	/** Champs découverts sur la page publique, par identifiant de page. */
	let discovered = $state(/** @type {Record<string, any[]>} */ ({}));
	/** Valeurs affichées dans les champs texte, par clé. */
	let values = $state(/** @type {Record<string, string>} */ ({}));
	let dirty = $state(/** @type {Set<string>} */ (new Set()));
	let busy = $state(/** @type {Set<string>} */ (new Set()));

	const fields = $derived(discovered[activePage.id] ?? []);
	const entries = $derived(data.entries[activePage.id] ?? {});
	const groups = $derived(groupBySection(fields));
	const hasDirty = $derived(fields.some((f) => dirty.has(f.key)));

	const tabGroups = $derived(
		[...new Set(data.pages.map((p) => p.group))].map((group) => ({
			group,
			pages: data.pages.filter((p) => p.group === group)
		}))
	);

	onMount(() => selectPage(activePage));

	/**
	 * Charge la page publique en mode « sans personnalisation » et relève tous les
	 * éléments marqués data-cms : c'est la source de vérité des champs éditables.
	 * @param {{id: string, path: string}} page
	 */
	async function discoverFields(page) {
		const separator = page.path.includes('?') ? '&' : '?';
		const response = await fetch(`${page.path}${separator}cms=defaults`);
		const html = await response.text();
		const doc = new DOMParser().parseFromString(html, 'text/html');

		const seen = new Set();
		const found = [];
		for (const el of doc.querySelectorAll('[data-cms]')) {
			const key = el.getAttribute('data-cms');
			if (!key || seen.has(key)) continue;
			seen.add(key);

			const type = el.getAttribute('data-cms-type') || 'text';
			let defaultValue = '';
			if (type === 'text') defaultValue = el.textContent?.trim() ?? '';
			else if (type === 'richtext') defaultValue = el.innerHTML.trim();

			found.push({
				key,
				type,
				defaultValue,
				label: el.getAttribute('data-cms-label') || labelFromKey(key)
			});
		}
		return found;
	}

	/** @param {{id: string, path: string}} page */
	async function selectPage(page) {
		activePage = page;
		flash = null;
		dirty = new Set();

		if (!discovered[page.id]) {
			loading = true;
			try {
				discovered[page.id] = await discoverFields(page);
			} catch (error) {
				console.error(error);
				discovered[page.id] = [];
				flash = { type: 'error', text: "Impossible de lire la page publique pour détecter les champs." };
			} finally {
				loading = false;
			}
		} else {
			loading = false;
		}

		syncValues(page.id);
	}

	/** Repositionne les champs texte sur la personnalisation existante, sinon sur le défaut. */
	function syncValues(pageId) {
		const next = { ...values };
		for (const field of discovered[pageId] ?? []) {
			if (field.type !== 'text' && field.type !== 'richtext') continue;
			const override = data.entries[pageId]?.[field.key]?.value;
			next[field.key] = override || field.defaultValue;
		}
		values = next;
	}

	function markDirty(key, value) {
		values[key] = value;
		if (!dirty.has(key)) dirty = new Set(dirty).add(key);
	}

	function labelFromKey(key) {
		const last = key.split('.').pop() ?? key;
		const words = last.replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
		return words.charAt(0).toUpperCase() + words.slice(1);
	}

	function sectionFromKey(key) {
		const parts = key.split('.');
		const section = parts.length > 1 ? parts[0] : 'Général';
		return section.charAt(0).toUpperCase() + section.slice(1).replace(/[-_]/g, ' ');
	}

	function groupBySection(list) {
		const map = new Map();
		for (const field of list) {
			const section = sectionFromKey(field.key);
			if (!map.has(section)) map.set(section, []);
			map.get(section).push(field);
		}
		return [...map.entries()];
	}

	/** Charge utile envoyée à l'action saveTexts. */
	function textChanges() {
		return JSON.stringify(
			fields
				.filter((f) => (f.type === 'text' || f.type === 'richtext') && dirty.has(f.key))
				.map((f) => ({
					key: f.key,
					type: f.type,
					value: values[f.key] ?? '',
					defaultValue: f.defaultValue
				}))
		);
	}

	function setBusy(key, on) {
		const next = new Set(busy);
		if (on) next.add(key);
		else next.delete(key);
		busy = next;
	}

	/**
	 * Gestion commune des soumissions : bascule l'état d'attente, remonte le
	 * message et rafraîchit les données du serveur.
	 * @param {string} key
	 */
	function submitHandler(key) {
		return () => {
			setBusy(key, true);
			flash = null;
			return async ({ result, update }) => {
				setBusy(key, false);
				if (result.type === 'failure') {
					flash = { type: 'error', text: result.data?.error ?? 'Erreur' };
					return;
				}
				if (result.type === 'success') {
					flash = { type: 'success', text: result.data?.success ?? 'Enregistré' };
				}
				await update({ reset: false });
				syncValues(activePage.id);
			};
		};
	}

	function filenameFromUrl(url) {
		return url.split('?')[0].split('/').pop() ?? '';
	}

	function movedOrder(filenames, index, direction) {
		const target = index + direction;
		if (target < 0 || target >= filenames.length) return null;
		const next = [...filenames];
		[next[index], next[target]] = [next[target], next[index]];
		return JSON.stringify(next);
	}
</script>

<svelte:head><title>Contenu des pages - Administration AFMEF</title></svelte:head>

<div class="flex flex-wrap items-start justify-between gap-4 mb-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Contenu des pages</h1>
		<p class="text-sm text-gray-500 mt-1">
			Modifier les textes, images et galeries de chaque page publique du site.
		</p>
	</div>

	<div class="flex items-center gap-3">
		<a
			href={activePage.path}
			target="_blank"
			rel="noopener"
			class="text-sm text-gray-500 hover:text-primary transition-colors"
		>
			Voir la page ↗
		</a>
		<form method="POST" action="?/saveTexts" use:enhance={submitHandler('__texts')}>
			<input type="hidden" name="page" value={activePage.id} />
			<input type="hidden" name="changes" value={textChanges()} />
			<button
				type="submit"
				disabled={!hasDirty || busy.has('__texts') || !data.writable}
				class="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
			>
				{busy.has('__texts') ? 'Enregistrement…' : 'Enregistrer les textes'}
			</button>
		</form>
	</div>
</div>

{#if !data.writable}
	<div class="mb-6 px-4 py-3 rounded-xl text-sm bg-yellow-50 border border-yellow-200 text-yellow-800">
		<strong>Lecture seule.</strong> Les identifiants <code>PB_ADMIN_EMAIL</code> /
		<code>PB_ADMIN_PASSWORD</code> ne sont pas configurés sur le serveur : les modifications ne
		peuvent pas être enregistrées.
	</div>
{/if}

{#if flash}
	<div
		class="mb-6 px-4 py-3 rounded-xl text-sm {flash.type === 'success'
			? 'bg-green-50 border border-green-200 text-green-800'
			: 'bg-red-50 border border-red-200 text-red-700'}"
	>
		{flash.text}
	</div>
{/if}

<!-- Onglets de pages -->
<div class="flex flex-wrap gap-x-6 gap-y-3 mb-8">
	{#each tabGroups as { group, pages }}
		<div>
			<span class="block text-[11px] uppercase tracking-wider text-gray-400 mb-1.5">{group}</span>
			<div class="flex flex-wrap gap-1 bg-white rounded-xl p-1 shadow-sm w-fit">
				{#each pages as page}
					<button
						type="button"
						onclick={() => selectPage(page)}
						class="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors {activePage.id ===
						page.id
							? 'bg-primary text-white'
							: 'text-gray-600 hover:bg-gray-100'}"
					>
						{page.label}
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>

{#if loading}
	<div class="flex items-center justify-center py-20">
		<div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
	</div>
{:else if fields.length === 0}
	<div class="bg-white rounded-2xl p-8 shadow-sm text-center">
		<p class="text-gray-600">Aucun champ éditable sur cette page.</p>
		<p class="text-sm text-gray-400 mt-2">
			Les éléments deviennent éditables lorsqu'ils sont enveloppés dans un composant
			<code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs">CmsText</code>,
			<code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs">CmsRichText</code>,
			<code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs">CmsImage</code> ou
			<code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs">CmsGallery</code>.
		</p>
	</div>
{:else}
	<div class="space-y-6">
		{#each groups as [section, sectionFields]}
			<section class="bg-white rounded-2xl p-6 shadow-sm">
				<h2 class="font-semibold text-gray-900 text-lg mb-5">{section}</h2>

				<div class="space-y-6">
					{#each sectionFields as field (field.key)}
						{@const entry = entries[field.key]}
						<div>
							<div class="flex items-center gap-2 mb-2 flex-wrap">
								<span class="text-sm font-medium text-gray-700">{field.label}</span>
								<span class="text-[10px] uppercase tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
									{field.type}
								</span>
								{#if dirty.has(field.key)}
									<span class="text-[10px] uppercase tracking-wider text-amber-600">modifié</span>
								{:else if entry}
									<span class="text-[10px] uppercase tracking-wider text-primary">personnalisé</span>
								{/if}
								<span class="text-[10px] text-gray-300 font-mono ml-auto">{field.key}</span>
							</div>

							{#if field.type === 'text'}
								{#if field.defaultValue.length > 90}
									<textarea
										rows="3"
										value={values[field.key] ?? ''}
										oninput={(e) => markDirty(field.key, e.currentTarget.value)}
										class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary outline-none text-sm resize-y transition-colors"
									></textarea>
								{:else}
									<input
										type="text"
										value={values[field.key] ?? ''}
										oninput={(e) => markDirty(field.key, e.currentTarget.value)}
										class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary outline-none text-sm transition-colors"
									/>
								{/if}
							{:else if field.type === 'richtext'}
								<RichTextEditor
									value={values[field.key] ?? ''}
									onChange={(html) => markDirty(field.key, html)}
								/>
							{:else if field.type === 'image'}
								<div class="flex items-start gap-4 flex-wrap">
									<div class="w-32 h-24 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
										{#if entry?.imageUrl}
											<img src={entry.imageUrl} alt="" class="w-full h-full object-cover" />
										{:else}
											<div class="w-full h-full flex items-center justify-center text-[11px] text-gray-400 text-center px-2">
												Image d'origine
											</div>
										{/if}
									</div>

									<div class="flex items-center gap-3 flex-wrap">
										<form
											method="POST"
											action="?/saveImage"
											enctype="multipart/form-data"
											use:enhance={submitHandler(field.key)}
										>
											<input type="hidden" name="page" value={activePage.id} />
											<input type="hidden" name="key" value={field.key} />
											<label class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer">
												{busy.has(field.key)
													? 'Envoi…'
													: entry?.imageUrl
														? 'Remplacer'
														: 'Téléverser une image'}
												<input
													type="file"
													name="file"
													accept="image/*"
													class="hidden"
													disabled={!data.writable}
													onchange={(e) => e.currentTarget.form?.requestSubmit()}
												/>
											</label>
										</form>

										{#if entry?.imageUrl}
											<form method="POST" action="?/reset" use:enhance={submitHandler(field.key)}>
												<input type="hidden" name="page" value={activePage.id} />
												<input type="hidden" name="key" value={field.key} />
												<button type="submit" class="text-sm text-gray-500 hover:text-red-600 transition-colors">
													Réinitialiser
												</button>
											</form>
										{/if}

										<p class="text-xs text-gray-400 basis-full">JPG, PNG ou WebP — 5 Mo maximum.</p>
									</div>
								</div>
							{:else if field.type === 'gallery'}
								{@const urls = entry?.galleryUrls ?? []}
								{@const filenames = entry?.filenames ?? []}
								<div class="space-y-3">
									{#if urls.length > 0}
										<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
											{#each urls as url, i}
												{@const filename = filenames[i] ?? filenameFromUrl(url)}
												<div class="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
													<img src={url} alt="" class="w-full h-28 object-cover" />
													<span class="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
														{i + 1}
													</span>
													<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
														{#each [{ dir: -1, label: 'Monter', arrow: '↑' }, { dir: 1, label: 'Descendre', arrow: '↓' }] as move}
															{@const order = movedOrder(filenames, i, move.dir)}
															<form method="POST" action="?/reorderGallery" use:enhance={submitHandler(field.key)}>
																<input type="hidden" name="page" value={activePage.id} />
																<input type="hidden" name="key" value={field.key} />
																<input type="hidden" name="filenames" value={order ?? '[]'} />
																<button
																	type="submit"
																	disabled={!order}
																	aria-label={move.label}
																	title={move.label}
																	class="w-8 h-8 bg-white rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
																>
																	{move.arrow}
																</button>
															</form>
														{/each}
														<form method="POST" action="?/removeGalleryImage" use:enhance={submitHandler(field.key)}>
															<input type="hidden" name="page" value={activePage.id} />
															<input type="hidden" name="key" value={field.key} />
															<input type="hidden" name="filename" value={filename} />
															<button
																type="submit"
																aria-label="Supprimer"
																title="Supprimer"
																class="w-8 h-8 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
															>
																✕
															</button>
														</form>
													</div>
												</div>
											{/each}
										</div>
									{:else}
										<p class="text-sm text-gray-400 italic">
											Aucune image personnalisée — les images d'origine de la page s'affichent.
										</p>
									{/if}

									<div class="flex items-center gap-3 flex-wrap">
										<form
											method="POST"
											action="?/addGalleryImages"
											enctype="multipart/form-data"
											use:enhance={submitHandler(field.key)}
										>
											<input type="hidden" name="page" value={activePage.id} />
											<input type="hidden" name="key" value={field.key} />
											<label class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer">
												{busy.has(field.key) ? 'Envoi…' : 'Ajouter des images'}
												<input
													type="file"
													name="files"
													accept="image/*"
													multiple
													class="hidden"
													disabled={!data.writable}
													onchange={(e) => e.currentTarget.form?.requestSubmit()}
												/>
											</label>
										</form>

										{#if urls.length > 0}
											<form method="POST" action="?/reset" use:enhance={submitHandler(field.key)}>
												<input type="hidden" name="page" value={activePage.id} />
												<input type="hidden" name="key" value={field.key} />
												<button type="submit" class="text-sm text-gray-500 hover:text-red-600 transition-colors">
													Revenir aux images d'origine
												</button>
											</form>
										{/if}
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/each}
	</div>
{/if}
