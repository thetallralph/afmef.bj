<script>
	import Button from '$lib/components/ui/Button.svelte';
	import { formatDate } from '$lib/utils/validators.js';

	let { data } = $props();

	const stats = $derived(data.stats);
	const recentMembers = $derived(data.recentMembers);

	const cards = $derived([
		{
			label: 'Total membres',
			value: stats.totalMembers,
			color: 'bg-primary/10 text-primary',
			icon: 'members'
		},
		{
			label: 'Membres actifs',
			value: stats.activeMembers,
			color: 'bg-green-100 text-green-700',
			icon: 'active'
		},
		{
			label: 'Cotisations payées',
			value: stats.cotisationsPaid,
			color: 'bg-blue-100 text-blue-700',
			icon: 'paid'
		},
		{
			label: 'Cotisations en attente',
			value: stats.cotisationsPending,
			color: 'bg-yellow-100 text-yellow-700',
			icon: 'pending'
		}
	]);
</script>

<!-- Header -->
<div class="mb-8">
	<h1 class="text-2xl font-bold text-gray-900">Tableau de bord</h1>
	<p class="text-gray-500 mt-1">Vue d'ensemble de l'association</p>
</div>

<!-- Stats -->
<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
	{#each cards as card}
		<div class="bg-white rounded-xl p-5 border border-gray-200">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-10 h-10 rounded-lg flex items-center justify-center {card.color}">
					{#if card.icon === 'members'}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					{:else if card.icon === 'active'}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					{:else if card.icon === 'paid'}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					{:else if card.icon === 'pending'}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					{/if}
				</div>
				<span class="text-sm text-gray-500">{card.label}</span>
			</div>
			<p class="text-3xl font-bold text-gray-900">{card.value}</p>
		</div>
	{/each}
</div>

<!-- Quick actions + Recent members -->
<div class="grid gap-6 lg:grid-cols-3">
	<!-- Actions rapides -->
	<div class="bg-white rounded-xl border border-gray-200 p-5">
		<h2 class="font-semibold text-gray-900 mb-4">Actions rapides</h2>
		<div class="space-y-2">
			<Button href="/gestion/membres/nouveau" variant="primary" class="w-full">
				Ajouter un membre
			</Button>
			<Button href="/gestion/cotisations" variant="outline" class="w-full">
				Gérer les cotisations
			</Button>
			<Button href="/admin" variant="ghost" class="w-full">
				PocketBase Admin
			</Button>
		</div>
	</div>

	<!-- Derniers inscrits -->
	<div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
		<div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
			<h2 class="font-semibold text-gray-900">Derniers inscrits</h2>
			<a href="/gestion/membres" class="text-sm text-primary hover:underline">Voir tout</a>
		</div>

		{#if recentMembers.length > 0}
			<div class="divide-y divide-gray-100">
				{#each recentMembers as member}
					<a href="/gestion/membres/{member.id}" class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
						<div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
							<span class="text-primary font-bold text-sm">
								{member.displayName?.charAt(0).toUpperCase() || '?'}
							</span>
						</div>
						<div class="min-w-0 flex-1">
							<p class="text-sm font-medium text-gray-900 truncate">{member.displayName}</p>
							<p class="text-xs text-gray-500 truncate">{member.structure || member.email}</p>
						</div>
						<span class="text-xs text-gray-400 flex-shrink-0">{formatDate(member.created)}</span>
					</a>
				{/each}
			</div>
		{:else}
			<div class="p-8 text-center text-gray-500 text-sm">
				Aucun membre inscrit
			</div>
		{/if}
	</div>
</div>
