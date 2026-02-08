<script>
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	let {
		user = {},
		onsave = null,
		loading = false
	} = $props();

	let displayName = $state(user.displayName || '');
	let email = $state(user.email || '');
	let phone = $state(user.phone || '');
	let structure = $state(user.structure || '');
	let fonction = $state(user.fonction || '');
	let bio = $state(user.bio || '');
	let showEmail = $state(user.privacy?.showEmail ?? true);
	let showPhone = $state(user.privacy?.showPhone ?? false);

	let errors = $state({});
	let message = $state(null);

	async function handleSubmit(e) {
		e.preventDefault();
		errors = {};

		if (!displayName.trim()) {
			errors.displayName = 'Le nom est requis';
			return;
		}

		const profileData = {
			displayName,
			phone,
			structure,
			fonction,
			bio,
			privacy: {
				showEmail,
				showPhone
			}
		};

		if (onsave) {
			const result = await onsave(profileData);
			if (result.success) {
				message = { type: 'success', text: 'Profil mis à jour avec succès' };
			} else {
				message = { type: 'error', text: result.error || 'Erreur lors de la mise à jour' };
			}
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	{#if message}
		<Alert type={message.type} dismissible ondismiss={() => message = null}>
			{message.text}
		</Alert>
	{/if}

	<div class="grid gap-6 md:grid-cols-2">
		<Input
			name="displayName"
			label="Nom complet"
			bind:value={displayName}
			error={errors.displayName}
			required
		/>

		<Input
			name="email"
			type="email"
			label="Email"
			value={email}
			disabled
		/>

		<Input
			name="phone"
			type="tel"
			label="Téléphone"
			placeholder="+229 XX XX XX XX"
			bind:value={phone}
			error={errors.phone}
		/>

		<Input
			name="structure"
			label="Structure / Organisation"
			placeholder="Nom de votre structure"
			bind:value={structure}
		/>

		<Input
			name="fonction"
			label="Fonction"
			placeholder="Votre fonction"
			bind:value={fonction}
		/>
	</div>

	<div>
		<label for="bio" class="block text-sm font-medium text-gray-700 mb-2">
			Biographie
		</label>
		<textarea
			id="bio"
			name="bio"
			rows="4"
			bind:value={bio}
			placeholder="Quelques mots sur vous..."
			class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
		></textarea>
	</div>

	<!-- Privacy settings -->
	<div class="bg-gray-50 rounded-xl p-6">
		<h3 class="font-semibold text-gray-900 mb-4">Paramètres de confidentialité</h3>
		<p class="text-sm text-gray-600 mb-4">
			Choisissez les informations visibles par les autres membres dans l'annuaire.
		</p>

		<div class="space-y-3">
			<label class="flex items-center gap-3 cursor-pointer">
				<input
					type="checkbox"
					bind:checked={showEmail}
					class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
				/>
				<span class="text-gray-700">Afficher mon email dans l'annuaire</span>
			</label>

			<label class="flex items-center gap-3 cursor-pointer">
				<input
					type="checkbox"
					bind:checked={showPhone}
					class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
				/>
				<span class="text-gray-700">Afficher mon téléphone dans l'annuaire</span>
			</label>
		</div>
	</div>

	<div class="flex justify-end gap-4">
		<Button type="submit" {loading}>
			Enregistrer les modifications
		</Button>
	</div>
</form>
