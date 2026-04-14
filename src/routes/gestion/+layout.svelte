<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { logout } from '$lib/stores/auth.svelte.js';

	let { data, children } = $props();

	let sidebarOpen = $state(false);

	const nav = [
		{
			label: 'Tableau de bord',
			href: '/gestion',
			icon: 'dashboard'
		},
		{
			label: 'Membres',
			href: '/gestion/membres',
			icon: 'members'
		},
		{
			label: 'Cotisations',
			href: '/gestion/cotisations',
			icon: 'cotisations'
		}
	];

	function isActive(href) {
		if (href === '/gestion') return $page.url.pathname === '/gestion';
		return $page.url.pathname.startsWith(href);
	}

	async function handleLogout() {
		await logout();
		goto('/espace-membre/connexion');
	}
</script>

<svelte:head>
	<title>Administration - AFMEF</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex">
	<!-- Sidebar desktop -->
	<aside class="hidden lg:flex lg:flex-col lg:w-64 bg-primary-dark text-white">
		<!-- Logo -->
		<div class="p-5 border-b border-white/10">
			<a href="/gestion" class="flex items-center gap-3">
				<img src="/favicon.png" alt="AFMEF" class="w-8 h-8" />
				<div>
					<span class="font-bold text-sm">AFMEF</span>
					<span class="block text-[11px] text-white/60">Administration</span>
				</div>
			</a>
		</div>

		<!-- Nav -->
		<nav class="flex-1 p-4 space-y-1">
			{#each nav as item}
				<a
					href={item.href}
					class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
						{isActive(item.href) ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}"
				>
					{#if item.icon === 'dashboard'}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
						</svg>
					{:else if item.icon === 'members'}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					{:else if item.icon === 'cotisations'}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					{/if}
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- User + logout -->
		<div class="p-4 border-t border-white/10">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
					{data.user?.displayName?.charAt(0).toUpperCase() || 'A'}
				</div>
				<div class="min-w-0">
					<p class="text-sm font-medium truncate">{data.user?.displayName}</p>
					<p class="text-xs text-white/50 truncate">{data.user?.email}</p>
				</div>
			</div>
			<div class="flex gap-2">
				<a href="/" class="flex-1 text-center text-xs text-white/60 hover:text-white py-1.5 rounded-lg hover:bg-white/10 transition-colors">
					Voir le site
				</a>
				<button onclick={handleLogout} class="flex-1 text-xs text-white/60 hover:text-white py-1.5 rounded-lg hover:bg-white/10 transition-colors">
					Déconnexion
				</button>
			</div>
		</div>
	</aside>

	<!-- Mobile header -->
	<div class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-primary-dark text-white h-14 flex items-center px-4 gap-3">
		<button onclick={() => sidebarOpen = !sidebarOpen} class="p-1.5 rounded-lg hover:bg-white/10">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
		<img src="/favicon.png" alt="AFMEF" class="w-7 h-7" />
		<span class="font-bold text-sm">Administration</span>
	</div>

	<!-- Mobile sidebar overlay -->
	{#if sidebarOpen}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="lg:hidden fixed inset-0 z-50 bg-black/50"
			onclick={() => sidebarOpen = false}
			onkeydown={(e) => e.key === 'Escape' && (sidebarOpen = false)}
			role="presentation"
		>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="w-64 h-full bg-primary-dark text-white flex flex-col" onclick={(e) => e.stopPropagation()}>
				<div class="p-5 border-b border-white/10 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<img src="/favicon.png" alt="AFMEF" class="w-8 h-8" />
						<span class="font-bold text-sm">Administration</span>
					</div>
					<button onclick={() => sidebarOpen = false} class="p-1 rounded-lg hover:bg-white/10">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<nav class="flex-1 p-4 space-y-1">
					{#each nav as item}
						<a
							href={item.href}
							onclick={() => sidebarOpen = false}
							class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
								{isActive(item.href) ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}"
						>
							{item.label}
						</a>
					{/each}
				</nav>
			</div>
		</div>
	{/if}

	<!-- Main content -->
	<main class="flex-1 lg:pt-0 pt-14">
		<div class="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
			{@render children()}
		</div>
	</main>
</div>
