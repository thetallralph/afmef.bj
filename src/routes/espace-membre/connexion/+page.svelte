<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { login } from '$lib/stores/auth.svelte.js';
	import { validateLoginForm } from '$lib/utils/validators.js';

	let email = $state('');
	let password = $state('');
	let errors = $state({});
	let globalError = $state('');
	let loading = $state(false);

	async function handleSubmit(e) {
		e.preventDefault();
		globalError = '';

		const validation = validateLoginForm({ email, password });
		if (!validation.valid) {
			errors = validation.errors;
			return;
		}

		errors = {};
		loading = true;

		const result = await login(email, password);

		if (result.success) {
			goto('/espace-membre');
		} else {
			globalError = result.error;
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Connexion - Espace Membre AFMEF</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-primary-bg to-white flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<!-- Logo -->
		<div class="text-center mb-8">
			<a href="/" class="inline-block">
				<img src="/favicon.png" alt="AFMEF" class="w-16 h-16 mx-auto mb-4" />
			</a>
			<h1 class="text-2xl font-bold text-gray-900">Espace Membre</h1>
			<p class="text-gray-600 mt-2">Connectez-vous à votre compte</p>
		</div>

		<!-- Login form -->
		<div class="bg-white rounded-2xl shadow-xl p-8">
			{#if globalError}
				<div class="mb-6">
					<Alert type="error" dismissible ondismiss={() => globalError = ''}>
						{globalError}
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
					error={errors.email}
					autocomplete="email"
					required
				/>

				<Input
					name="password"
					type="password"
					label="Mot de passe"
					placeholder="••••••••"
					bind:value={password}
					error={errors.password}
					autocomplete="current-password"
					required
				/>

				<div class="flex items-center justify-between">
					<label class="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
						/>
						<span class="text-sm text-gray-600">Se souvenir de moi</span>
					</label>

					<a
						href="/espace-membre/mot-de-passe-oublie"
						class="text-sm text-primary hover:underline"
					>
						Mot de passe oublié ?
					</a>
				</div>

				<Button type="submit" class="w-full" {loading}>
					Se connecter
				</Button>
			</form>

			<div class="mt-6 text-center">
				<p class="text-gray-600 text-sm">
					Pas encore membre ?
					<a href="/adhesion" class="text-primary font-medium hover:underline">
						Rejoignez-nous
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
