<script>
	import { goto } from '$app/navigation';
	import MemberCard from '$lib/components/member/MemberCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { data } = $props();

	let searchInput = $state('');

	function handleSearch(e) {
		e.preventDefault();
		const params = new URLSearchParams();
		if (searchInput) params.set('search', searchInput);
		goto(`/espace-membre/annuaire?${params.toString()}`);
	}

	function clearSearch() {
		searchInput = '';
		goto('/espace-membre/annuaire');
	}
</script>

<svelte:head>
	<title>Annuaire des membres - AFMEF</title>
</svelte:head>

<!-- Header -->
<div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Annuaire des membres</h1>
		<p class="text-gray-500 mt-1">
			{data.total} membre{data.total > 1 ? 's' : ''} dans l'annuaire
		</p>
	</div>
</div>

<!-- Search -->
<div class="bg-white rounded-xl p-4 border border-gray-200 mb-6">
	<form onsubmit={handleSearch} class="flex gap-3">
		<div class="relative flex-1">
			<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			<input
				type="text"
				placeholder="Rechercher par nom, structure ou fonction..."
				bind:value={searchInput}
				class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
			/>
		</div>
		<Button type="submit" size="sm">Rechercher</Button>
	</form>
</div>

<!-- Members grid -->
{#if data.members.length > 0}
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.members as member}
			<MemberCard {member} />
		{/each}
	</div>

	<!-- Pagination -->
	{#if data.totalPages > 1}
		<div class="mt-8 flex items-center justify-center gap-3">
			{#if data.currentPage > 1}
				<Button
					size="sm"
					variant="outline"
					href="/espace-membre/annuaire?page={data.currentPage - 1}"
				>
					Précédent
				</Button>
			{/if}

			<span class="text-sm text-gray-500">
				Page {data.currentPage} / {data.totalPages}
			</span>

			{#if data.currentPage < data.totalPages}
				<Button
					size="sm"
					variant="outline"
					href="/espace-membre/annuaire?page={data.currentPage + 1}"
				>
					Suivant
				</Button>
			{/if}
		</div>
	{/if}
{:else}
	<div class="bg-white rounded-xl p-12 border border-gray-200 text-center">
		<svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
		</svg>
		{#if searchInput}
			<p class="text-gray-500 mb-4">Aucun membre trouvé pour « {searchInput} »</p>
			<Button size="sm" variant="outline" onclick={clearSearch}>Effacer la recherche</Button>
		{:else}
			<p class="text-gray-500">Aucun membre dans l'annuaire pour le moment</p>
		{/if}
	</div>
{/if}
