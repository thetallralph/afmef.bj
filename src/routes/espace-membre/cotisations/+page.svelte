<script>
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { formatDate } from '$lib/utils/validators.js';

	let { data } = $props();

	// Mock data - will be replaced by API
	const cotisationStatus = {
		isUpToDate: true,
		lastPayment: '2024-01-15',
		validUntil: '2024-12-31',
		amount: 25000
	};

	const cotisationHistory = [
		{
			id: 1,
			year: 2024,
			amount: 25000,
			paidAt: '2024-01-15',
			method: 'Mobile Money',
			status: 'paid'
		},
		{
			id: 2,
			year: 2023,
			amount: 25000,
			paidAt: '2023-02-20',
			method: 'Virement bancaire',
			status: 'paid'
		},
		{
			id: 3,
			year: 2022,
			amount: 20000,
			paidAt: '2022-03-10',
			method: 'Mobile Money',
			status: 'paid'
		}
	];

	function formatCurrency(amount) {
		return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
	}
</script>

<svelte:head>
	<title>Cotisations - AFMEF</title>
</svelte:head>

<!-- Header -->
<div class="mb-6">
	<h1 class="text-2xl font-bold text-gray-900">Mes cotisations</h1>
	<p class="text-gray-600 mt-1">
		Gérez vos cotisations et consultez votre historique
	</p>
</div>

<!-- Status card -->
<div class="bg-white rounded-xl p-5 border border-gray-200 mb-6">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div class="flex items-center gap-4">
			<div class="w-12 h-12 rounded-xl flex items-center justify-center
				{cotisationStatus.isUpToDate ? 'bg-green-100' : 'bg-red-100'}">
				{#if cotisationStatus.isUpToDate}
					<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				{:else}
					<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				{/if}
			</div>

			<div>
				<p class="font-semibold {cotisationStatus.isUpToDate ? 'text-green-600' : 'text-red-600'}">
					{cotisationStatus.isUpToDate ? 'Cotisation à jour' : 'Cotisation en retard'}
				</p>
				<p class="text-sm text-gray-500">
					Valide jusqu'au {formatDate(cotisationStatus.validUntil)}
				</p>
			</div>
		</div>

		{#if !cotisationStatus.isUpToDate}
			<Button size="sm">Payer maintenant</Button>
		{/if}
	</div>
</div>

<!-- Quick stats -->
<div class="grid gap-4 sm:grid-cols-3 mb-6">
	<div class="bg-white rounded-xl p-4 border border-gray-200">
		<p class="text-sm text-gray-500">Montant annuel</p>
		<p class="text-xl font-bold text-gray-900">{formatCurrency(cotisationStatus.amount)}</p>
	</div>
	<div class="bg-white rounded-xl p-4 border border-gray-200">
		<p class="text-sm text-gray-500">Dernier paiement</p>
		<p class="text-xl font-bold text-gray-900">{formatDate(cotisationStatus.lastPayment)}</p>
	</div>
	<div class="bg-white rounded-xl p-4 border border-gray-200">
		<p class="text-sm text-gray-500">Expiration</p>
		<p class="text-xl font-bold text-gray-900">{formatDate(cotisationStatus.validUntil)}</p>
	</div>
</div>

<!-- History -->
<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
	<div class="px-5 py-4 border-b border-gray-100">
		<h2 class="font-semibold text-gray-900">Historique des paiements</h2>
	</div>

	{#if cotisationHistory.length > 0}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50 text-left">
					<tr>
						<th class="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Année</th>
						<th class="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Montant</th>
						<th class="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
						<th class="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Méthode</th>
						<th class="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each cotisationHistory as payment}
						<tr>
							<td class="px-5 py-4 font-medium text-gray-900">{payment.year}</td>
							<td class="px-5 py-4 text-gray-600">{formatCurrency(payment.amount)}</td>
							<td class="px-5 py-4 text-gray-600">{formatDate(payment.paidAt)}</td>
							<td class="px-5 py-4 text-gray-600">{payment.method}</td>
							<td class="px-5 py-4">
								<span class="px-2 py-1 text-xs font-medium rounded-full
									{payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
									{payment.status === 'paid' ? 'Payé' : 'En attente'}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="p-10 text-center">
			<p class="text-gray-500">Aucun paiement enregistré</p>
		</div>
	{/if}
</div>
