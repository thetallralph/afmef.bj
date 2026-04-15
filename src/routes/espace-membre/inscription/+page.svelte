<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	import { page } from '$app/stores';

	let { form } = $props();
	let loading = $state(false);
	let inscrit = $derived($page.url.searchParams.has('inscrit'));
</script>

<svelte:head>
	<title>Inscription - Espace Membre AFMEF</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-primary-bg to-white flex items-center justify-center p-4">
	<div class="w-full max-w-lg">
		<!-- Logo -->
		<div class="text-center mb-8">
			<a href="/" class="inline-block">
				<img src="/favicon.png" alt="AFMEF" class="w-16 h-16 mx-auto mb-4" />
			</a>
			<h1 class="text-2xl font-bold text-gray-900">Rejoindre l'AFMEF</h1>
			<p class="text-gray-600 mt-2">Créez votre compte membre</p>
		</div>

		<!-- Form -->
		<div class="bg-white rounded-2xl shadow-xl p-8">
			{#if form?.error}
				<div class="mb-6">
					<Alert type="error">{form.error}</Alert>
				</div>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
				class="space-y-5"
			>
				<!-- Identité -->
				<Input
					name="name"
					label="Nom complet"
					placeholder="Prénom Nom"
					value={form?.name || ''}
					required
				/>

				<Input
					name="email"
					type="email"
					label="Adresse email"
					placeholder="votre@email.com"
					value={form?.email || ''}
					autocomplete="email"
					required
				/>

				<div class="grid gap-4 sm:grid-cols-2">
					<Input
						name="password"
						type="password"
						label="Mot de passe"
						placeholder="Min. 8 caractères"
						autocomplete="new-password"
						required
					/>
					<Input
						name="passwordConfirm"
						type="password"
						label="Confirmer"
						placeholder="Même mot de passe"
						autocomplete="new-password"
						required
					/>
				</div>

				<!-- Infos pro -->
				<div class="border-t border-gray-100 pt-5">
					<p class="text-sm font-medium text-gray-700 mb-4">Informations professionnelles</p>

					<div class="space-y-4">
						<Input
							name="structure"
							label="Structure / Organisation"
							placeholder="Nom de votre organisation"
							value={form?.structure || ''}
						/>

						<div class="grid gap-4 sm:grid-cols-2">
							<Input
								name="fonction"
								label="Fonction"
								placeholder="Votre poste"
								value={form?.fonction || ''}
							/>
							<Input
								name="phone"
								type="tel"
								label="Téléphone"
								placeholder="+229 XX XX XX XX"
								value={form?.phone || ''}
							/>
						</div>
					</div>
				</div>

				<Button type="submit" class="w-full" {loading}>
					Créer mon compte
				</Button>
			</form>

			<div class="mt-6 text-center">
				<p class="text-gray-600 text-sm">
					Déjà membre ?
					<a href="/espace-membre/connexion" class="text-primary font-medium hover:underline">
						Se connecter
					</a>
				</p>
			</div>
		</div>

		<!-- Back to home -->
		<div class="text-center mt-6">
			<a href="/" class="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				Retour au site
			</a>
		</div>
	</div>
</div>
