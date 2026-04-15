<script>
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { formatDate } from '$lib/utils/validators.js';

	let { data } = $props();

	const cotisations = $derived(data.cotisations || []);
	const status = $derived(data.status || { isActive: false, year: new Date().getFullYear() });
	const pendingCotisations = $derived(cotisations.filter(c => c.status === 'pending'));

	let paymentModal = $state(false);
	let selectedCotisation = $state(null);
	let phone = $state('');
	let paymentLoading = $state(false);
	let paymentMessage = $state(null);

	function formatCurrency(amount) {
		return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
	}

	function openPayment(cotisation) {
		selectedCotisation = cotisation;
		phone = '';
		paymentMessage = null;
		paymentModal = true;
	}

	async function handlePayment() {
		if (!phone || phone.length < 8) {
			paymentMessage = { type: 'error', text: 'Veuillez entrer un numéro valide' };
			return;
		}

		if (!env.PUBLIC_KKIAPAY_API_KEY) {
			paymentMessage = { type: 'error', text: 'Le paiement en ligne n\'est pas encore configuré. Contactez un administrateur.' };
			return;
		}

		paymentLoading = true;
		paymentMessage = null;

		try {
			const { default: kkiapay } = await import('kkiapay');
			const k = kkiapay(env.PUBLIC_KKIAPAY_API_KEY, { sandbox: true });

			const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+229/, '');

			const res = await k.debit(cleanPhone, selectedCotisation.amount, {
				firstname: data.user?.displayName?.split(' ')[1] || '',
				lastname: data.user?.displayName?.split(' ')[0] || '',
				email: data.user?.email || ''
			});

			// Paiement réussi — vérifier côté serveur
			const verifyResponse = await fetch('/api/payment/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					cotisationId: selectedCotisation.id,
					transactionId: res.transactionId
				})
			});

			const verifyResult = await verifyResponse.json();

			if (verifyResponse.ok && verifyResult.success) {
				paymentMessage = { type: 'success', text: 'Paiement effectué avec succès !' };
				// Mettre à jour localement
				selectedCotisation.status = 'paid';
				selectedCotisation.method = 'kkiapay';
				selectedCotisation.paidAt = new Date().toISOString();
				// Rafraîchir les données
				setTimeout(() => {
					paymentModal = false;
					window.location.reload();
				}, 2000);
			} else {
				paymentMessage = { type: 'error', text: verifyResult.error || 'Erreur lors de la vérification du paiement' };
			}
		} catch (error) {
			const msg = error?.failureMessage || error?.message || 'Paiement échoué ou annulé';
			paymentMessage = { type: 'error', text: msg };
		} finally {
			paymentLoading = false;
		}
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
				{status.isActive ? 'bg-green-100' : 'bg-red-100'}">
				{#if status.isActive}
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
				<p class="font-semibold {status.isActive ? 'text-green-600' : 'text-red-600'}">
					{status.isActive ? 'Cotisation à jour' : 'Cotisation en retard'}
				</p>
				<p class="text-sm text-gray-500">
					Année {status.year}
				</p>
			</div>
		</div>

		{#if pendingCotisations.length > 0}
			<Button size="sm" onclick={() => openPayment(pendingCotisations[0])}>
				Payer maintenant
			</Button>
		{/if}
	</div>
</div>

<!-- History -->
<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
	<div class="px-5 py-4 border-b border-gray-100">
		<h2 class="font-semibold text-gray-900">Historique des paiements</h2>
	</div>

	{#if cotisations.length > 0}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50 text-left">
					<tr>
						<th class="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Année</th>
						<th class="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Montant</th>
						<th class="px-5 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
						<th class="px-5 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Méthode</th>
						<th class="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
						<th class="px-5 py-3 text-xs font-medium text-gray-500 uppercase text-right">Action</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each cotisations as payment}
						<tr>
							<td class="px-5 py-4 font-medium text-gray-900">{payment.year}</td>
							<td class="px-5 py-4 text-gray-600">{formatCurrency(payment.amount)}</td>
							<td class="px-5 py-4 text-gray-600 hidden sm:table-cell">{payment.paidAt ? formatDate(payment.paidAt) : '-'}</td>
							<td class="px-5 py-4 text-gray-600 hidden sm:table-cell">
								{#if payment.method === 'kkiapay'}
									KKiaPay
								{:else if payment.method === 'mobile_money'}
									Mobile Money
								{:else if payment.method === 'virement'}
									Virement
								{:else if payment.method === 'especes'}
									Espèces
								{:else}
									-
								{/if}
							</td>
							<td class="px-5 py-4">
								<span class="px-2 py-1 text-xs font-medium rounded-full
									{payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
									{payment.status === 'paid' ? 'Payé' : 'En attente'}
								</span>
							</td>
							<td class="px-5 py-4 text-right">
								{#if payment.status === 'pending'}
									<Button size="sm" variant="outline" onclick={() => openPayment(payment)}>
										Payer
									</Button>
								{/if}
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

<!-- Payment Modal -->
<Modal bind:open={paymentModal} title="Payer la cotisation" size="sm">
	{#if selectedCotisation}
		<div class="space-y-4">
			<div class="bg-gray-50 rounded-xl p-4">
				<div class="flex justify-between text-sm">
					<span class="text-gray-500">Année</span>
					<span class="font-medium text-gray-900">{selectedCotisation.year}</span>
				</div>
				<div class="flex justify-between text-sm mt-2">
					<span class="text-gray-500">Montant</span>
					<span class="font-bold text-gray-900">{formatCurrency(selectedCotisation.amount)}</span>
				</div>
			</div>

			{#if paymentMessage}
				<Alert type={paymentMessage.type} dismissible ondismiss={() => paymentMessage = null}>
					{paymentMessage.text}
				</Alert>
			{/if}

			{#if paymentMessage?.type !== 'success'}
				<Input
					name="phone"
					type="tel"
					label="Numéro Mobile Money"
					placeholder="Ex: 97 12 34 56"
					bind:value={phone}
				/>

				<p class="text-xs text-gray-500">
					Vous recevrez une demande de paiement sur votre téléphone. Confirmez pour valider le paiement.
				</p>

				<div class="flex justify-end gap-3">
					<Button variant="outline" onclick={() => paymentModal = false} disabled={paymentLoading}>
						Annuler
					</Button>
					<Button onclick={handlePayment} loading={paymentLoading}>
						Payer {formatCurrency(selectedCotisation.amount)}
					</Button>
				</div>
			{/if}
		</div>
	{/if}
</Modal>
