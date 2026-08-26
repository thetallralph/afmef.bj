<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { logout } from '$lib/stores/auth.svelte.js';

	let { data, children } = $props();

	let sidebarOpen = $state(false);

	const navGroups = [
		{
			label: '',
			items: [{ label: 'Tableau de bord', href: '/gestion', icon: 'dashboard' }]
		},
		{
			label: 'Contenu du site',
			items: [
				{ label: 'Textes & images', href: '/gestion/contenu/pages', icon: 'pages' },
				{ label: 'Activités', href: '/gestion/contenu/activites', icon: 'news' },
				{ label: 'Ressources', href: '/gestion/contenu/ressources', icon: 'file' },
				{ label: 'Catégories', href: '/gestion/contenu/categories', icon: 'tag' },
				{ label: 'Documents membres', href: '/gestion/contenu/documents', icon: 'file' },
				{ label: 'Événements', href: '/gestion/contenu/evenements', icon: 'calendar' }
			]
		},
		{
			label: 'Association',
			items: [
				{ label: 'Membres', href: '/gestion/membres', icon: 'members' },
				{ label: 'Cotisations', href: '/gestion/cotisations', icon: 'cotisations' }
			]
		}
	];

	const ICONS = {
		dashboard:
			'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
		pages:
			'M4 5a2 2 0 012-2h8l6 6v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm10-1v5h5M8 13h8M8 17h5',
		news: 'M4 5a2 2 0 012-2h9a2 2 0 012 2v14a2 2 0 002-2V8h-2M4 5v14a2 2 0 002 2h11M8 8h7M8 12h7M8 16h4',
		file: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
		tag: 'M7 7h.01M7 3h5a2 2 0 011.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 10V5a2 2 0 012-2z',
		calendar:
			'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
		members:
			'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
		cotisations:
			'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
	};

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

{#snippet navLinks(onNavigate)}
	{#each navGroups as group}
		<div class="mb-4 last:mb-0">
			{#if group.label}
				<span class="block px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
					{group.label}
				</span>
			{/if}
			<div class="space-y-0.5">
				{#each group.items as item}
					<a
						href={item.href}
						onclick={onNavigate}
						class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
							{isActive(item.href)
								? 'bg-white/15 text-white'
								: 'text-white/70 hover:bg-white/10 hover:text-white'}"
					>
						<svg class="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS[item.icon]} />
						</svg>
						{item.label}
					</a>
				{/each}
			</div>
		</div>
	{/each}
{/snippet}

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
		<nav class="flex-1 p-4 overflow-y-auto">
			{@render navLinks()}
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
				<nav class="flex-1 p-4 overflow-y-auto">
					{@render navLinks(() => (sidebarOpen = false))}
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
