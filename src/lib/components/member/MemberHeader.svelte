<script>
	import { page } from '$app/stores';

	let { user = null, onlogout = null } = $props();

	const menuItems = [
		{ href: '/espace-membre/annuaire', label: 'Annuaire' },
		{ href: '/espace-membre/cotisations', label: 'Cotisations' },
		{ href: '/espace-membre/profil', label: 'Mon profil' }
	];

	function isActive(href) {
		return $page.url.pathname.startsWith(href);
	}

	const isAdmin = $derived(user?.role === 'admin');
</script>

<div class="bg-primary-dark text-white">
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between h-12">
			<!-- Navigation -->
			<nav class="flex items-center gap-1">
				{#each menuItems as item}
					<a
						href={item.href}
						class="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors
							{isActive(item.href)
								? 'bg-white/20 text-white'
								: 'text-white/80 hover:text-white hover:bg-white/10'}"
					>
						{item.label}
					</a>
				{/each}

				{#if isAdmin}
					<a
						href="/gestion"
						class="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5
							{$page.url.pathname.startsWith('/gestion')
								? 'bg-secondary/20 text-secondary'
								: 'text-secondary/80 hover:text-secondary hover:bg-secondary/10'}"
					>
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span class="hidden sm:block">Gestion</span>
					</a>
				{/if}
			</nav>

			<!-- User info & logout -->
			<div class="flex items-center gap-3">
				<div class="flex items-center gap-2">
					<div class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
						{#if user?.avatar}
							<img src={user.avatar} alt="" class="w-7 h-7 rounded-full object-cover" />
						{:else}
							<span class="text-white text-xs font-semibold">
								{user?.displayName?.charAt(0).toUpperCase() || 'M'}
							</span>
						{/if}
					</div>
					<span class="text-sm text-white/90 hidden md:block">
						{user?.displayName || 'Membre'}
					</span>
				</div>

				<button
					onclick={onlogout}
					class="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
					<span class="hidden sm:block">Déconnexion</span>
				</button>
			</div>
		</div>
	</div>
</div>
