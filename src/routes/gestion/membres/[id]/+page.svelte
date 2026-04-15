<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { formatDate } from '$lib/utils/validators.js';

	let { data, form } = $props();

	let member = $derived(data.member);
	let cotisations = $derived(data.cotisations);
	let loading = $state(false);
	let cotisationLoading = $state(false);

	const currentYear = new Date().getFullYear();

	function formatCurrency(amount) {
		return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
	}
</script>

<svelte:head>
	<title>{member.displayName} - Gestion AFMEF</title>
</svelte:head>

<!-- Header -->
<div class="mb-6">
	<a href="/gestion/membres" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-3">
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
		</svg>
		Retour aux membres
	</a>
	<div class="flex items-center gap-4">
		<div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
			<span class="text-primary font-bold text-xl">
				{member.displayName?.charAt(0).toUpperCase() || '?'}
			</span>
		</div>
		<div>
			<h1 class="text-2xl font-bold text-gray-900">{member.displayName}</h1>
			<p class="text-gray-500">{member.email}</p>
		</div>
	</div>
</div>

{#if form?.success}
	<div class="mb-6">
		<Alert type="success" dismissible>Membre mis à jour avec succès</Alert>
	</div>
{/if}
{#if form?.error}
	<div class="mb-6">
		<Alert type="error">{form.error}</Alert>
	</div>
{/if}

<div class="grid gap-6 lg:grid-cols-3">
	<!-- Formulaire principal -->
	<div class="lg:col-span-2">
		<div class="bg-white rounded-xl border border-gray-200 p-6">
			<h2 class="text-lg font-semibold text-gray-900 mb-5">Informations du membre</h2>

			<form
				method="POST"
				action="?/update"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
				class="space-y-5"
			>
				<div class="grid gap-4 md:grid-cols-2">
					<Input name="name" label="Nom complet" value={member.displayName} required />
					<Input name="phone" type="tel" label="Téléphone" value={member.phone} placeholder="+229 XX XX XX XX" />
					<Input name="structure" label="Structure" value={member.structure} />
					<Input name="fonction" label="Fonction" value={member.fonction} />
				</div>

				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
					<textarea
						name="description"
						id="description"
						rows="3"
						class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm"
					>{member.description}</textarea>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<label for="role" class="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
						<select
							name="role"
							id="role"
							class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white text-sm"
						>
							<option value="member" selected={member.role === 'member'}>Membre</option>
							<option value="admin" selected={member.role === 'admin'}>Administrateur</option>
						</select>
					</div>
					<div>
						<label for="status" class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
						<select
							name="status"
							id="status"
							class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white text-sm"
						>
							<option value="active" selected={member.status === 'active'}>Actif</option>
							<option value="pending" selected={member.status === 'pending'}>En attente de validation</option>
							<option value="inactive" selected={member.status === 'inactive'}>Inactif</option>
						</select>
					</div>
				</div>

				<!-- Paramètres annuaire -->
				<div class="bg-gray-50 rounded-xl p-4">
					<h3 class="text-sm font-semibold text-gray-700 mb-3">Visibilité dans l'annuaire</h3>
					<div class="space-y-2">
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" name="showInDirectory" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" checked={member.privacy?.showEmail !== false} />
							<span class="text-sm text-gray-600">Afficher dans l'annuaire</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" name="showEmail" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" checked={member.privacy?.showEmail} />
							<span class="text-sm text-gray-600">Afficher l'email</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" name="showPhone" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" checked={member.privacy?.showPhone} />
							<span class="text-sm text-gray-600">Afficher le téléphone</span>
						</label>
					</div>
				</div>

				<div class="flex justify-end pt-4 border-t border-gray-100">
					<Button type="submit" {loading}>Enregistrer</Button>
				</div>
			</form>
		</div>
	</div>

	<!-- Sidebar : cotisations -->
	<div class="space-y-6">
		<!-- Info rapide -->
		<div class="bg-white rounded-xl border border-gray-200 p-5">
			<h3 class="font-semibold text-gray-900 mb-3">Informations</h3>
			<dl class="space-y-2 text-sm">
				<div class="flex justify-between">
					<dt class="text-gray-500">Inscrit le</dt>
					<dd class="text-gray-900">{formatDate(member.created)}</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-gray-500">Rôle</dt>
					<dd>
						<span class="px-2 py-0.5 text-xs font-medium rounded-full {member.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}">
							{member.role === 'admin' ? 'Admin' : 'Membre'}
						</span>
					</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-gray-500">Statut</dt>
					<dd>
						<span class="px-2 py-0.5 text-xs font-medium rounded-full {member.status === 'active' ? 'bg-green-100 text-green-700' : member.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}">
							{member.status === 'active' ? 'Actif' : member.status === 'pending' ? 'En attente' : 'Inactif'}
						</span>
					</dd>
				</div>
			</dl>
		</div>

		<!-- Cotisations -->
		<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
			<div class="px-5 py-4 border-b border-gray-100">
				<h3 class="font-semibold text-gray-900">Cotisations</h3>
			</div>

			{#if cotisations.length > 0}
				<div class="divide-y divide-gray-100">
					{#each cotisations as cot}
						<div class="px-5 py-3 flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-gray-900">{cot.year}</p>
								<p class="text-xs text-gray-500">{formatCurrency(cot.amount)}</p>
							</div>
							<span class="px-2 py-0.5 text-xs font-medium rounded-full
								{cot.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
								{cot.status === 'paid' ? 'Payé' : 'En attente'}
							</span>
						</div>
					{/each}
				</div>
			{:else}
				<div class="p-5 text-center text-sm text-gray-500">
					Aucune cotisation
				</div>
			{/if}

			<!-- Ajouter une cotisation -->
			<div class="border-t border-gray-100 p-4">
				{#if form?.cotisationSuccess}
					<Alert type="success" dismissible>Cotisation ajoutée</Alert>
				{/if}
				{#if form?.cotisationError}
					<Alert type="error">{form.cotisationError}</Alert>
				{/if}

				<form
					method="POST"
					action="?/addCotisation"
					use:enhance={() => {
						cotisationLoading = true;
						return async ({ update }) => {
							cotisationLoading = false;
							await update();
						};
					}}
					class="space-y-3 mt-2"
				>
					<p class="text-sm font-medium text-gray-700">Ajouter une cotisation</p>
					<div class="grid grid-cols-2 gap-2">
						<input
							name="year"
							type="number"
							placeholder="Année"
							value={currentYear}
							class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
						/>
						<input
							name="amount"
							type="number"
							placeholder="Montant"
							value="25000"
							class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
						/>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<select name="cotisationStatus" class="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-primary outline-none">
							<option value="paid">Payé</option>
							<option value="pending">En attente</option>
						</select>
						<select name="method" class="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-primary outline-none">
							<option value="mobile_money">Mobile Money</option>
							<option value="virement">Virement</option>
							<option value="especes">Espèces</option>
						</select>
					</div>
					<Button type="submit" size="sm" class="w-full" loading={cotisationLoading}>
						Ajouter
					</Button>
				</form>
			</div>
		</div>
	</div>
</div>
