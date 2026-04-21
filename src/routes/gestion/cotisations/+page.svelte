<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { formatDate } from '$lib/utils/validators.js';

	let { data } = $props();

	let yearFilter = $state(data.year || '');
	let statusFilter = $state(data.status || '');

	let notice = $state('');
	let error = $state('');
	let rowLoading = $state({});
	let globalLoading = $state(false);

	let createModal = $state(false);
	let createForm = $state({
		user: '',
		year: data.currentYear,
		amount: data.defaultAmount,
		method: '',
		status: 'pending'
	});
	let createLoading = $state(false);

	let generateModal = $state(false);
	let generateForm = $state({ year: data.currentYear, amount: data.defaultAmount });
	let generateLoading = $state(false);

	let reminderAllModal = $state(false);
	let reminderAllYear = $state(data.currentYear);
	let reminderAllLoading = $state(false);

	function formatCurrency(amount) {
		return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
	}

	function handleFilter() {
		const params = new URLSearchParams();
		if (yearFilter) params.set('year', yearFilter);
		if (statusFilter) params.set('status', statusFilter);
		goto(`/gestion/cotisations?${params.toString()}`);
	}

	async function postAction(action, formData) {
		const response = await fetch(`/gestion/cotisations?/${action}`, {
			method: 'POST',
			body: formData
		});
		return deserialize(await response.text());
	}

	function handleResult(result, fallbackError) {
		if (result.type === 'failure') {
			error = result.data?.error || fallbackError;
			return false;
		}
		notice = result.data?.message || '';
		return true;
	}

	async function markAsPaid(id) {
		rowLoading[id] = 'paid';
		error = '';
		notice = '';
		const formData = new FormData();
		formData.set('id', id);
		const result = await postAction('markPaid', formData);
		if (handleResult(result, 'Erreur marquage paiement')) await invalidateAll();
		delete rowLoading[id];
		rowLoading = { ...rowLoading };
	}

	async function sendReminder(cot) {
		rowLoading[cot.id] = 'reminder';
		error = '';
		notice = '';
		const formData = new FormData();
		formData.set('id', cot.id);
		const result = await postAction('sendReminder', formData);
		handleResult(result, 'Erreur envoi rappel');
		delete rowLoading[cot.id];
		rowLoading = { ...rowLoading };
	}

	async function submitCreate() {
		createLoading = true;
		error = '';
		notice = '';
		const formData = new FormData();
		formData.set('user', createForm.user);
		formData.set('year', String(createForm.year));
		formData.set('amount', String(createForm.amount));
		if (createForm.method) formData.set('method', createForm.method);
		formData.set('status', createForm.status);
		const result = await postAction('create', formData);
		if (handleResult(result, 'Erreur création')) {
			createModal = false;
			createForm = { user: '', year: data.currentYear, amount: data.defaultAmount, method: '', status: 'pending' };
			await invalidateAll();
		}
		createLoading = false;
	}

	async function submitGenerate() {
		generateLoading = true;
		error = '';
		notice = '';
		const formData = new FormData();
		formData.set('year', String(generateForm.year));
		formData.set('amount', String(generateForm.amount));
		const result = await postAction('generateYear', formData);
		if (handleResult(result, 'Erreur génération')) {
			generateModal = false;
			await invalidateAll();
		}
		generateLoading = false;
	}

	async function submitSendAllReminders() {
		reminderAllLoading = true;
		error = '';
		notice = '';
		const formData = new FormData();
		formData.set('year', String(reminderAllYear));
		const result = await postAction('sendAllReminders', formData);
		handleResult(result, 'Erreur envoi des rappels');
		if (result.type !== 'failure') reminderAllModal = false;
		reminderAllLoading = false;
	}

	function methodLabel(method) {
		const labels = { mobile_money: 'Mobile Money', virement: 'Virement', especes: 'Espèces', kkiapay: 'KKiaPay' };
		return labels[method] || method || '-';
	}

	const years = Array.from({ length: 5 }, (_, i) => data.currentYear - i);
</script>

<svelte:head>
	<title>Cotisations - Administration AFMEF</title>
</svelte:head>

<!-- Header -->
<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Cotisations</h1>
		<p class="text-gray-500 mt-1">{data.total} cotisation{data.total > 1 ? 's' : ''}</p>
	</div>
	<div class="flex flex-wrap gap-2">
		<Button variant="outline" size="sm" onclick={() => (reminderAllModal = true)}>
			<svg class="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
			</svg>
			Relancer les impayées
		</Button>
		<Button variant="outline" size="sm" onclick={() => (generateModal = true)}>
			<svg class="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
			</svg>
			Générer l'année
		</Button>
		<Button size="sm" onclick={() => (createModal = true)}>
			<svg class="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Nouvelle cotisation
		</Button>
	</div>
</div>

{#if notice}
	<div class="mb-4">
		<Alert type="success" dismissible ondismiss={() => (notice = '')}>{notice}</Alert>
	</div>
{/if}
{#if error}
	<div class="mb-4">
		<Alert type="error" dismissible ondismiss={() => (error = '')}>{error}</Alert>
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
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
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
							<td class="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
								{methodLabel(cot.method)}
								{#if cot.transactionId}
									<p class="text-xs text-gray-400 truncate max-w-[120px]" title={cot.transactionId}>
										Tx: {cot.transactionId}
									</p>
								{/if}
							</td>
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
									<div class="flex items-center justify-end gap-3">
										<button
											onclick={() => sendReminder(cot)}
											disabled={!!rowLoading[cot.id]}
											class="text-xs text-gray-500 hover:text-primary font-medium disabled:opacity-50"
											title="Envoyer un rappel par email"
										>
											{rowLoading[cot.id] === 'reminder' ? '…' : 'Rappeler'}
										</button>
										<button
											onclick={() => markAsPaid(cot.id)}
											disabled={!!rowLoading[cot.id]}
											class="text-xs text-primary hover:underline font-medium disabled:opacity-50"
										>
											{rowLoading[cot.id] === 'paid' ? '…' : 'Marquer payé'}
										</button>
									</div>
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
			<p class="text-gray-500 mb-4">Aucune cotisation trouvée</p>
			<Button size="sm" onclick={() => (createModal = true)}>Créer la première</Button>
		</div>
	{/if}
</div>

<!-- Modal : création cotisation -->
<Modal bind:open={createModal} title="Nouvelle cotisation" size="md">
	<div class="space-y-4">
		<div>
			<label for="cot-user" class="block text-sm font-medium text-gray-700 mb-1">Membre</label>
			<select
				id="cot-user"
				bind:value={createForm.user}
				class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
			>
				<option value="">— Sélectionner un membre —</option>
				{#each data.members as m}
					<option value={m.id}>{m.name} ({m.email})</option>
				{/each}
			</select>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<div>
				<label for="cot-year" class="block text-sm font-medium text-gray-700 mb-1">Année</label>
				<input
					id="cot-year"
					type="number"
					bind:value={createForm.year}
					min="2020"
					max="2100"
					class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
				/>
			</div>
			<div>
				<label for="cot-amount" class="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA)</label>
				<input
					id="cot-amount"
					type="number"
					bind:value={createForm.amount}
					min="0"
					step="500"
					class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
				/>
			</div>
		</div>

		<div>
			<label for="cot-status" class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
			<select
				id="cot-status"
				bind:value={createForm.status}
				class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
			>
				<option value="pending">En attente</option>
				<option value="paid">Déjà payée</option>
			</select>
		</div>

		{#if createForm.status === 'paid'}
			<div>
				<label for="cot-method" class="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement</label>
				<select
					id="cot-method"
					bind:value={createForm.method}
					class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
				>
					<option value="">— Non précisée —</option>
					<option value="especes">Espèces</option>
					<option value="virement">Virement</option>
					<option value="mobile_money">Mobile Money</option>
					<option value="kkiapay">KKiaPay</option>
				</select>
			</div>
		{/if}
	</div>

	<div class="flex justify-end gap-3 mt-6">
		<Button variant="outline" onclick={() => (createModal = false)}>Annuler</Button>
		<Button onclick={submitCreate} loading={createLoading} disabled={!createForm.user}>Créer</Button>
	</div>
</Modal>

<!-- Modal : générer pour l'année -->
<Modal bind:open={generateModal} title="Générer les cotisations de l'année" size="md">
	<p class="text-sm text-gray-600 mb-4">
		Une cotisation <strong>en attente</strong> sera créée pour chaque membre actif qui n'en a pas encore pour l'année choisie. Les membres déjà cotisés sont ignorés.
	</p>

	<div class="grid grid-cols-2 gap-3">
		<div>
			<label for="gen-year" class="block text-sm font-medium text-gray-700 mb-1">Année</label>
			<input
				id="gen-year"
				type="number"
				bind:value={generateForm.year}
				min="2020"
				max="2100"
				class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
			/>
		</div>
		<div>
			<label for="gen-amount" class="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA)</label>
			<input
				id="gen-amount"
				type="number"
				bind:value={generateForm.amount}
				min="0"
				step="500"
				class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
			/>
		</div>
	</div>

	<div class="flex justify-end gap-3 mt-6">
		<Button variant="outline" onclick={() => (generateModal = false)}>Annuler</Button>
		<Button onclick={submitGenerate} loading={generateLoading}>Générer</Button>
	</div>
</Modal>

<!-- Modal : relance groupée -->
<Modal bind:open={reminderAllModal} title="Relancer toutes les cotisations impayées" size="md">
	<p class="text-sm text-gray-600 mb-4">
		Un email de rappel sera envoyé à chaque membre dont la cotisation est <strong>en attente</strong> pour l'année choisie.
	</p>

	<div>
		<label for="rem-year" class="block text-sm font-medium text-gray-700 mb-1">Année</label>
		<input
			id="rem-year"
			type="number"
			bind:value={reminderAllYear}
			min="2020"
			max="2100"
			class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
		/>
	</div>

	<div class="flex justify-end gap-3 mt-6">
		<Button variant="outline" onclick={() => (reminderAllModal = false)}>Annuler</Button>
		<Button onclick={submitSendAllReminders} loading={reminderAllLoading}>Envoyer les rappels</Button>
	</div>
</Modal>
