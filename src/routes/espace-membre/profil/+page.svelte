<script>
	import { enhance } from '$app/forms';
	import ProfileForm from '$lib/components/member/ProfileForm.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { updateUser } from '$lib/stores/auth.svelte.js';

	let { data, form } = $props();

	let loading = $state(false);
	let avatarLoading = $state(false);
	let avatarMessage = $state(null);
	let fileInput;
	let avatarForm;

	function handleAvatarChange() {
		if (!fileInput.files?.length) return;
		avatarForm.requestSubmit();
	}

	async function handleSave(profileData) {
		loading = true;

		try {
			const response = await fetch('?/profile', {
				method: 'POST',
				body: createProfileFormData(profileData)
			});
			const result = await response.json();
			const data = result?.data;

			if (data && !Array.isArray(data)) {
				if (data.success) {
					if (data.user) updateUser(data.user);
					return { success: true };
				}
				return { success: false, error: data.error || 'Erreur lors de la mise à jour' };
			}
			return { success: false, error: 'Erreur lors de la mise à jour' };
		} catch (error) {
			return { success: false, error: 'Erreur réseau' };
		} finally {
			loading = false;
		}
	}

	function createProfileFormData(profileData) {
		const fd = new FormData();
		fd.set('displayName', profileData.displayName);
		fd.set('phone', profileData.phone);
		fd.set('structure', profileData.structure);
		fd.set('fonction', profileData.fonction);
		fd.set('bio', profileData.bio);
		if (profileData.privacy?.showEmail) fd.set('showEmail', 'on');
		if (profileData.privacy?.showPhone) fd.set('showPhone', 'on');
		return fd;
	}
</script>

<svelte:head>
	<title>Mon profil - AFMEF</title>
</svelte:head>

<!-- Header -->
<div class="mb-6">
	<h1 class="text-2xl font-bold text-gray-900">Mon profil</h1>
	<p class="text-gray-600 mt-1">
		Gérez vos informations personnelles
	</p>
</div>

<!-- Profile card -->
<div class="bg-white rounded-xl p-5 border border-gray-200 mb-6">
	{#if avatarMessage}
		<div class="mb-4">
			<Alert type={avatarMessage.type} dismissible ondismiss={() => avatarMessage = null}>
				{avatarMessage.text}
			</Alert>
		</div>
	{/if}

	<!-- Formulaire caché pour l'upload avatar -->
	<form
		bind:this={avatarForm}
		method="POST"
		action="?/avatar"
		enctype="multipart/form-data"
		use:enhance={() => {
			avatarLoading = true;
			avatarMessage = null;
			return async ({ result }) => {
				avatarLoading = false;
				if (result.type === 'success' && result.data?.avatarUpdated) {
					avatarMessage = { type: 'success', text: 'Photo mise à jour' };
				} else {
					avatarMessage = { type: 'error', text: result.data?.error || 'Erreur lors de l\'upload' };
				}
			};
		}}
		class="hidden"
	>
		<input
			bind:this={fileInput}
			name="avatar"
			type="file"
			accept="image/*"
			onchange={handleAvatarChange}
		/>
	</form>

	<div class="flex items-center gap-4">
		<div class="relative group">
			<div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
				{#if data.user?.avatar}
					<img
						src={data.user.avatar}
						alt={data.user.displayName}
						class="w-full h-full object-cover"
					/>
				{:else}
					<span class="text-primary font-bold text-2xl">
						{data.user?.displayName?.charAt(0).toUpperCase() || 'M'}
					</span>
				{/if}
			</div>
			<button
				type="button"
				onclick={() => fileInput.click()}
				disabled={avatarLoading}
				aria-label="Changer la photo de profil"
				class="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer"
			>
				<svg class="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
			</button>
		</div>

		<div>
			<h2 class="text-lg font-bold text-gray-900">{data.user?.displayName || 'Membre'}</h2>
			<p class="text-gray-500 text-sm">{data.user?.email}</p>
			<button
				type="button"
				onclick={() => fileInput.click()}
				disabled={avatarLoading}
				class="text-primary text-xs font-medium hover:underline mt-1"
			>
				{avatarLoading ? 'Upload en cours...' : 'Changer la photo'}
			</button>
		</div>
	</div>
</div>

<!-- Profile form -->
<div class="bg-white rounded-xl p-5 border border-gray-200">
	<h3 class="font-semibold text-gray-900 mb-5">Informations personnelles</h3>
	<ProfileForm user={data.user} onsave={handleSave} {loading} />
</div>
