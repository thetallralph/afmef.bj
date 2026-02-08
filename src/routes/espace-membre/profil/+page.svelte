<script>
	import ProfileForm from '$lib/components/member/ProfileForm.svelte';

	let { data } = $props();

	let loading = $state(false);

	async function handleSave(profileData) {
		loading = true;

		try {
			const response = await fetch('/api/auth/me', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(profileData)
			});

			const result = await response.json();

			if (response.ok) {
				return { success: true };
			} else {
				return { success: false, error: result.error };
			}
		} catch (error) {
			return { success: false, error: 'Erreur réseau' };
		} finally {
			loading = false;
		}
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
	<div class="flex items-center gap-4">
		<div class="relative">
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
		</div>

		<div>
			<h2 class="text-lg font-bold text-gray-900">{data.user?.displayName || 'Membre'}</h2>
			<p class="text-gray-500 text-sm">{data.user?.email}</p>
		</div>
	</div>
</div>

<!-- Profile form -->
<div class="bg-white rounded-xl p-5 border border-gray-200">
	<h3 class="font-semibold text-gray-900 mb-5">Informations personnelles</h3>
	<ProfileForm user={data.user} onsave={handleSave} {loading} />
</div>
