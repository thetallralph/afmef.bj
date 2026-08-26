<script>
	import { enhance } from '$app/forms';
	import { slugify } from '$lib/cms/collections.js';
	import RichTextEditor from '$lib/components/admin/RichTextEditor.svelte';

	let { data, form } = $props();

	const base = $derived(`/gestion/contenu/${data.slug}`);
	const fields = $derived(data.definition.fields);

	let saving = $state(false);
	/** Valeurs du formulaire, indexées par nom de champ. */
	let values = $state(initialValues());
	/** Les identifiants d'URL ne se régénèrent plus dès que l'utilisateur les a touchés. */
	let slugTouched = $state(new Set());
	/** Fichiers marqués pour suppression. */
	let removals = $state(new Set());

	function initialValues() {
		/** @type {Record<string, any>} */
		const out = {};
		for (const field of data.definition.fields) {
			const current = data.record?.[field.name];
			if (field.type === 'relation' && field.multiple) {
				out[field.name] = Array.isArray(current) ? [...current] : [];
			} else if (field.type === 'date') {
				out[field.name] = toDateInput(current);
			} else if (field.type === 'bool') {
				out[field.name] = Boolean(current);
			} else {
				out[field.name] = current ?? field.default ?? '';
			}
		}
		return out;
	}

	function toDateInput(value) {
		if (!value) return '';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return '';
		return date.toISOString().slice(0, 10);
	}

	/** Met à jour un champ et propage l'identifiant d'URL qui en dérive. */
	function setValue(field, value) {
		values[field.name] = value;

		for (const other of fields) {
			if (other.slugFrom !== field.name) continue;
			if (slugTouched.has(other.name)) continue;
			if (data.record && values[other.name]) continue; // ne jamais réécrire un slug publié
			values[other.name] = slugify(value);
		}
	}

	function toggleRelation(field, id, checked) {
		const current = new Set(values[field.name] ?? []);
		if (checked) current.add(id);
		else current.delete(id);
		values[field.name] = [...current];
	}

	function toggleRemoval(name, checked) {
		const next = new Set(removals);
		if (checked) next.add(name);
		else next.delete(name);
		removals = next;
	}

	function isImage(url) {
		return /\.(jpe?g|png|webp|gif|avif)$/i.test(url || '');
	}
</script>

<svelte:head>
	<title>
		{data.isNew ? `Nouveau — ${data.definition.label}` : data.record?.title || data.record?.name || data.definition.singular}
		- Administration AFMEF
	</title>
</svelte:head>

<div class="mb-6">
	<a href={base} class="text-sm text-gray-500 hover:text-primary transition-colors">
		← {data.definition.label}
	</a>
	<h1 class="text-2xl font-bold text-gray-900 mt-2">
		{data.isNew ? `Nouvel élément — ${data.definition.singular}` : data.definition.singular}
	</h1>
</div>

{#if !data.writable}
	<div class="mb-6 px-4 py-3 rounded-xl text-sm bg-yellow-50 border border-yellow-200 text-yellow-800">
		<strong>Lecture seule.</strong> Les identifiants PocketBase du serveur ne sont pas configurés.
	</div>
{/if}

{#if form?.error}
	<div class="mb-6 px-4 py-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-700">
		{form.error}
	</div>
{:else if form?.success}
	<div class="mb-6 px-4 py-3 rounded-xl text-sm bg-green-50 border border-green-200 text-green-800">
		{form.success}
	</div>
{/if}

<form
	method="POST"
	action="?/save"
	enctype="multipart/form-data"
	use:enhance={() => {
		saving = true;
		return async ({ update }) => {
			saving = false;
			await update({ reset: false });
		};
	}}
	class="bg-white rounded-2xl shadow-sm p-6 space-y-6"
>
	{#each fields as field (field.name)}
		<div>
			<label for={field.name} class="block text-sm font-medium text-gray-700 mb-2">
				{field.label}
				{#if field.required}<span class="text-red-500">*</span>{/if}
			</label>

			{#if field.type === 'textarea'}
				<textarea
					id={field.name}
					name={field.name}
					rows="3"
					value={values[field.name]}
					oninput={(e) => setValue(field, e.currentTarget.value)}
					class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary outline-none text-sm resize-y transition-colors"
				></textarea>
			{:else if field.type === 'richtext'}
				<input type="hidden" name={field.name} value={values[field.name]} />
				<RichTextEditor
					value={values[field.name]}
					minHeight="260px"
					onChange={(html) => (values[field.name] = html)}
				/>
			{:else if field.type === 'select'}
				<select
					id={field.name}
					name={field.name}
					value={values[field.name]}
					onchange={(e) => setValue(field, e.currentTarget.value)}
					class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary outline-none text-sm bg-white transition-colors"
				>
					<option value="">—</option>
					{#each field.options as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			{:else if field.type === 'bool'}
				<label class="inline-flex items-center gap-2 text-sm text-gray-600">
					<input
						type="checkbox"
						name={field.name}
						checked={values[field.name]}
						onchange={(e) => (values[field.name] = e.currentTarget.checked)}
						class="w-4 h-4 rounded accent-[color:var(--color-primary)]"
					/>
					Activé
				</label>
			{:else if field.type === 'relation'}
				{@const options = data.options[field.name] ?? []}
				{#if options.length === 0}
					<p class="text-sm text-gray-400 italic">
						Aucune option disponible — créez-en d'abord dans la section correspondante.
					</p>
				{:else}
					<div class="flex flex-wrap gap-2">
						{#each options as option}
							{@const checked = (values[field.name] ?? []).includes(option.id)}
							<label
								class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 text-sm cursor-pointer transition-colors {checked
									? 'border-primary bg-primary/10 text-primary'
									: 'border-gray-200 text-gray-600 hover:border-gray-300'}"
							>
								<input
									type="checkbox"
									name={field.name}
									value={option.id}
									{checked}
									onchange={(e) => toggleRelation(field, option.id, e.currentTarget.checked)}
									class="hidden"
								/>
								{option.label}
							</label>
						{/each}
					</div>
				{/if}
			{:else if field.type === 'file'}
				{@const currentUrl = data.record?.[`${field.name}Url`]}
				<div class="space-y-3">
					{#if currentUrl}
						<div class="flex items-center gap-3">
							{#if isImage(currentUrl)}
								<img src={currentUrl} alt="" class="w-28 h-20 object-cover rounded-xl border border-gray-200" />
							{:else}
								<span class="px-3 py-2 bg-gray-100 rounded-xl text-xs text-gray-600">
									{data.record[field.name]}
								</span>
							{/if}
							<a href={currentUrl} target="_blank" rel="noopener" class="text-sm text-primary hover:underline">
								Ouvrir
							</a>
							<label class="inline-flex items-center gap-2 text-sm text-gray-500">
								<input
									type="checkbox"
									name="{field.name}__remove"
									checked={removals.has(field.name)}
									onchange={(e) => toggleRemoval(field.name, e.currentTarget.checked)}
									class="w-4 h-4 rounded"
								/>
								Supprimer ce fichier
							</label>
						</div>
					{/if}
					<input
						id={field.name}
						type="file"
						name={field.name}
						accept={field.accept}
						class="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
					/>
				</div>
			{:else}
				<input
					id={field.name}
					type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
					name={field.name}
					value={values[field.name]}
					oninput={(e) => {
						if (field.slugFrom) slugTouched = new Set(slugTouched).add(field.name);
						setValue(field, e.currentTarget.value);
					}}
					class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary outline-none text-sm transition-colors"
				/>
			{/if}

			{#if field.help}
				<p class="text-xs text-gray-400 mt-1.5">{field.help}</p>
			{/if}
		</div>
	{/each}

	<div class="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
		<button
			type="submit"
			disabled={saving || !data.writable}
			class="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
		>
			{saving ? 'Enregistrement…' : data.isNew ? 'Créer' : 'Enregistrer'}
		</button>

		{#if !data.isNew}
			<button
				type="submit"
				formaction="?/delete"
				disabled={!data.writable}
				onclick={(e) => {
					if (!confirm('Supprimer définitivement cet élément ?')) e.preventDefault();
				}}
				class="text-sm text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
			>
				Supprimer
			</button>
		{/if}
	</div>
</form>
