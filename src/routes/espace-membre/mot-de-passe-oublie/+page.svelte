<script>
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { requestPasswordReset } from '$lib/services/auth.js';
	import { isValidEmail } from '$lib/utils/validators.js';

	let email = $state('');
	let error = $state('');
	let success = $state(false);
	let loading = $state(false);

	async function handleSubmit(e) {
		e.preventDefault();
		error = '';

		if (!email.trim()) {
			error = 'Veuillez entrer votre adresse email';
			return;
		}

		if (!isValidEmail(email)) {
			error = 'Adresse email invalide';
			return;
		}

		loading = true;

		const result = await requestPasswordReset(email);

		if (result.success) {
			success = true;
		} else {
			error = result.error || 'Une erreur est survenue';
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Mot de passe oublié - AFMEF</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-primary-bg to-white flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<!-- Logo -->
		<div class="text-center mb-8">
			<a href="/" class="inline-block">
				<img src="/favicon.png" alt="AFMEF" class="w-16 h-16 mx-auto mb-4" />
			</a>
			<h1 class="text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
			<p class="text-gray-600 mt-2">
				Entrez votre email pour recevoir un lien de réinitialisation
			</p>
		</div>

		<!-- Form -->
		<div class="bg-white rounded-2xl shadow-xl p-8">
			{#if success}
				<Alert type="success" title="Email envoyé">
					Si un compte existe avec cette adresse email, vous recevrez un lien pour réinitialiser votre mot de passe.
				</Alert>

				<div class="mt-6 text-center">
					<a
						href="/espace-membre/connexion"
						class="inline-flex items-center gap-2 text-primary font-medium hover:underline"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Retour à la connexion
					</a>
				</div>
			{:else}
				{#if error}
					<div class="mb-6">
						<Alert type="error" dismissible ondismiss={() => error = ''}>
							{error}
						</Alert>
					</div>
				{/if}

				<form onsubmit={handleSubmit} class="space-y-6">
					<Input
						name="email"
						type="email"
						label="Adresse email"
						placeholder="votre@email.com"
						bind:value={email}
						autocomplete="email"
						required
					/>

					<Button type="submit" class="w-full" {loading}>
						Envoyer le lien
					</Button>
				</form>

				<div class="mt-6 text-center">
					<a
						href="/espace-membre/connexion"
						class="text-gray-600 hover:text-primary transition-colors"
					>
						Retour à la connexion
					</a>
				</div>
			{/if}
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
