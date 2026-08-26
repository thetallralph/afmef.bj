<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const base = $derived(`/gestion/contenu/${data.slug}`);

	function formatDate(value) {
		if (!value) return '—';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return '—';
		return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
	}

	function relationLabels(record, column) {
		const expanded = record.expand?.[column.name];
		if (expanded?.length) return expanded.map((e) => e.label);
		const raw = record[column.name];
		return Array.isArray(raw) ? raw : raw ? [raw] : [];
	}

	function pageHref(page) {
		const params = new URLSearchParams();
		if (data.search) params.set('q', data.search);
		if (page > 1) params.set('page', String(page));
		const query = params.toString();
		return query ? `${base}?${query}` : base;
	}
</script>

<svelte:head><title>{data.definition.label} - Administration AFMEF</title></svelte:head>

<div class="flex flex-wrap items-start justify-between gap-4 mb-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">{data.definition.label}</h1>
		<p class="text-sm text-gray-500 mt-1">{data.definition.description}</p>
	</div>
	<a
		href="{base}/nouveau"
		class="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
	>
		+ {data.definition.singular}
	</a>
</div>

{#if !data.writable}
	<div class="mb-6 px-4 py-3 rounded-xl text-sm bg-yellow-50 border border-yellow-200 text-yellow-800">
		<strong>Lecture seule.</strong> Les identifiants PocketBase du serveur ne sont pas configurés :
		aucune modification ne peut être enregistrée.
	</div>
{/if}

{#if data.missing}
	<div class="mb-6 px-4 py-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-700">
		Cette collection n'existe pas encore dans PocketBase. Lancez
		<code class="bg-white/60 px-1.5 py-0.5 rounded">node scripts/pb-setup.js</code> pour la créer.
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

<form method="GET" class="mb-5 flex gap-2 max-w-md">
	<input
		type="search"
		name="q"
		value={data.search}
		placeholder="Rechercher…"
		class="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary outline-none text-sm transition-colors"
	/>
	<button type="submit" class="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors">
		Rechercher
	</button>
	{#if data.search}
		<a href={base} class="px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-800 transition-colors">
			Effacer
		</a>
	{/if}
</form>

<div class="bg-white rounded-2xl shadow-sm overflow-hidden">
	{#if data.records.length === 0}
		<div class="p-10 text-center">
			<p class="text-gray-600">
				{data.search ? 'Aucun résultat pour cette recherche.' : 'Aucun élément pour le moment.'}
			</p>
			{#if !data.search}
				<a href="{base}/nouveau" class="inline-block mt-4 text-primary font-medium hover:underline">
					Créer {data.definition.singular.toLowerCase()}
				</a>
			{/if}
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-100 bg-gray-50/70 text-left">
						{#each data.definition.listColumns as column}
							<th class="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
								{column.label}
							</th>
						{/each}
						<th class="px-5 py-3 w-px"></th>
					</tr>
				</thead>
				<tbody>
					{#each data.records as record (record.id)}
						<tr class="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
							{#each data.definition.listColumns as column}
								<td class="px-5 py-3.5 align-middle">
									{#if column.type === 'title'}
										<a href="{base}/{record.id}" class="font-medium text-gray-900 hover:text-primary transition-colors">
											{record[column.name] || 'Sans titre'}
										</a>
									{:else if column.type === 'date'}
										<span class="text-gray-500">{formatDate(record[column.name])}</span>
									{:else if column.type === 'relation'}
										<div class="flex flex-wrap gap-1">
											{#each relationLabels(record, column) as label}
												<span class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">{label}</span>
											{:else}
												<span class="text-gray-300">—</span>
											{/each}
										</div>
									{:else if column.type === 'file'}
										{#if record[column.name]}
											<span class="text-gray-500 text-xs">{record[column.name]}</span>
										{:else}
											<span class="text-gray-300">—</span>
										{/if}
									{:else}
										<span class="text-gray-500">{record[column.name] || '—'}</span>
									{/if}
								</td>
							{/each}
							<td class="px-5 py-3.5 text-right whitespace-nowrap">
								<a href="{base}/{record.id}" class="text-primary text-sm font-medium hover:underline">Modifier</a>
								<form
									method="POST"
									action="?/delete"
									class="inline"
									use:enhance={() => ({ result, update }) => update({ reset: false })}
									onsubmit={(e) => {
										if (!confirm('Supprimer définitivement cet élément ?')) e.preventDefault();
									}}
								>
									<input type="hidden" name="id" value={record.id} />
									<button
										type="submit"
										disabled={!data.writable}
										class="ml-4 text-sm text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
									>
										Supprimer
									</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

{#if data.totalPages > 1}
	<div class="flex items-center justify-between mt-5 text-sm">
		<span class="text-gray-500">{data.total} élément{data.total > 1 ? 's' : ''}</span>
		<div class="flex gap-2">
			{#if data.currentPage > 1}
				<a href={pageHref(data.currentPage - 1)} class="px-3 py-1.5 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors">
					Précédent
				</a>
			{/if}
			<span class="px-3 py-1.5 text-gray-500">{data.currentPage} / {data.totalPages}</span>
			{#if data.currentPage < data.totalPages}
				<a href={pageHref(data.currentPage + 1)} class="px-3 py-1.5 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors">
					Suivant
				</a>
			{/if}
		</div>
	</div>
{/if}
