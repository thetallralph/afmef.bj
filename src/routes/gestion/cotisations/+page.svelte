<script>
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { formatDate } from '$lib/utils/validators.js';

	let { data, form } = $props();

	let yearFilter = $state(data.year || '');
	let statusFilter = $state(data.status || '');

	function formatCurrency(amount) {
		return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
	}

	function handleFilter() {
		const params = new URLSearchParams();
		if (yearFilter) params.set('year', yearFilter);
		if (statusFilter) params.set('status', statusFilter);
		goto(`/gestion/cotisations?${params.toString()}`);
	}

	async function markAsPaid(id) {
		const formData = new FormData();
		formData.set('id', id);

		await fetch('/gestion/cotisations?/markPaid', {
			method: 'POST',
			body: formData
		});

		await invalidateAll();
	}

	function methodLabel(method) {
		const labels = { mobile_money: 'Mobile Money', virement: 'Virement', especes: 'Espèces' };
		return labels[method] || method || '-';
	}

	// Années pour le filtre
	const years = Array.from({ length: 5 }, (_, i) => data.currentYear - i);
</script>

<svelte:head>
	<title>Cotisations - Administration AFMEF</title>
</svelte:head>

<!-- Header -->
<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Cotisations</h1>
		<p class="text-gray-500 mt-1">{data.total} cotisation{data.total > 1 ? 's' : ''}</p>
	</div>
</div>

{#if form?.success}
	<div class="mb-4">
		<Alert type="success" dismissible>Cotisation mise à jour</Alert>
	</div>
{/if}
{#if form?.error}
	<div class="mb-4">
		<Alert type="error" dismissible>{form.error}</Alert>
	</div>
{/if}

<!-- Filters -->
<div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
	<div class="flex flex-col sm:flex-row gap-3">
		<select
			bind:value={yearFilter}
			onchange={handleFilter}
			class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
		>
			<option value="">Toutes les années</option>
			{#each years as y}
				<option value={y}>{y}</option>
			{/each}
		</select>
		<select
			bind:value={statusFilter}
			onchange={handleFilter}
			class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
		>
			<option value="">Tous les statuts</option>
			<option value="paid">Payé</option>
			<option value="pending">En attente</option>
		</select>
	</div>
</div>

<!-- Table -->
<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
	{#if data.cotisations.length > 0}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50 text-left">
					<tr>
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Membre</th>
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Année</th>
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Montant</th>
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Méthode</th>
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">Action</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each data.cotisations as cot}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-4 py-3">
								<a href="/gestion/membres/{cot.user}" class="text-sm font-medium text-gray-900 hover:text-primary">
									{cot.userName}
								</a>
								<p class="text-xs text-gray-500">{cot.userEmail}</p>
							</td>
							<td class="px-4 py-3 text-sm font-medium text-gray-900">{cot.year}</td>
							<td class="px-4 py-3 text-sm text-gray-600">{formatCurrency(cot.amount)}</td>
							<td class="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{methodLabel(cot.method)}</td>
							<td class="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">
								{cot.paidAt ? formatDate(cot.paidAt) : '-'}
							</td>
							<td class="px-4 py-3">
								<span class="px-2 py-0.5 text-xs font-medium rounded-full
									{cot.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
									{cot.status === 'paid' ? 'Payé' : 'En attente'}
								</span>
							</td>
							<td class="px-4 py-3 text-right">
								{#if cot.status === 'pending'}
									<button
										onclick={() => markAsPaid(cot.id)}
										class="text-xs text-primary hover:underline font-medium"
									>
										Marquer payé
									</button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if data.totalPages > 1}
			<div class="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
				<p class="text-sm text-gray-500">
					Page {data.currentPage} sur {data.totalPages}
				</p>
				<div class="flex gap-2">
					{#if data.currentPage > 1}
						<Button
							size="sm"
							variant="outline"
							href="/gestion/cotisations?page={data.currentPage - 1}{data.year ? `&year=${data.year}` : ''}{data.status ? `&status=${data.status}` : ''}"
						>
							Précédent
						</Button>
					{/if}
					{#if data.currentPage < data.totalPages}
						<Button
							size="sm"
							variant="outline"
							href="/gestion/cotisations?page={data.currentPage + 1}{data.year ? `&year=${data.year}` : ''}{data.status ? `&status=${data.status}` : ''}"
						>
							Suivant
						</Button>
					{/if}
				</div>
			</div>
		{/if}
	{:else}
		<div class="p-12 text-center">
			<svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
			<p class="text-gray-500">Aucune cotisation trouvée</p>
		</div>
	{/if}
</div>
