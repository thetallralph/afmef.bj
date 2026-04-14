<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	let { form } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Nouveau membre - AFMEF</title>
</svelte:head>

<!-- Header -->
<div class="mb-6">
	<a href="/gestion/membres" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-3">
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
		</svg>
		Retour aux membres
	</a>
	<h1 class="text-2xl font-bold text-gray-900">Ajouter un membre</h1>
</div>

{#if form?.error}
	<div class="mb-6">
		<Alert type="error">{form.error}</Alert>
	</div>
{/if}

<div class="bg-white rounded-xl border border-gray-200 p-6">
	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update();
			};
		}}
		class="space-y-6"
	>
		<!-- Informations de connexion -->
		<div>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Informations de connexion</h2>
			<div class="grid gap-4 md:grid-cols-2">
				<Input
					name="email"
					type="email"
					label="Adresse email"
					placeholder="membre@email.com"
					value={form?.email || ''}
					required
				/>
				<Input
					name="password"
					type="password"
					label="Mot de passe"
					placeholder="Minimum 8 caractères"
					required
				/>
			</div>
		</div>

		<!-- Informations personnelles -->
		<div>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
			<div class="grid gap-4 md:grid-cols-2">
				<Input
					name="name"
					label="Nom complet"
					placeholder="Prénom Nom"
					value={form?.name || ''}
					required
				/>
				<Input
					name="phone"
					type="tel"
					label="Téléphone"
					placeholder="+229 XX XX XX XX"
					value={form?.phone || ''}
				/>
				<Input
					name="structure"
					label="Structure / Organisation"
					placeholder="Nom de l'organisation"
					value={form?.structure || ''}
				/>
				<Input
					name="fonction"
					label="Fonction / Poste"
					placeholder="Titre du poste"
					value={form?.fonction || ''}
				/>
			</div>
		</div>

		<!-- Rôle -->
		<div>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Rôle</h2>
			<select
				name="role"
				class="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white w-full md:w-auto"
			>
				<option value="member" selected={form?.role !== 'admin'}>Membre</option>
				<option value="admin" selected={form?.role === 'admin'}>Administrateur</option>
			</select>
		</div>

		<!-- Actions -->
		<div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
			<Button href="/gestion/membres" variant="outline">Annuler</Button>
			<Button type="submit" {loading}>Créer le membre</Button>
		</div>
	</form>
</div>
