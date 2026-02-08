<script>
	let mobileMenuOpen = $state(false);
	let amicaleOpen = $state(false);
	let activitesOpen = $state(false);

	const menuItems = {
		amicale: [
			{ label: 'Genèse', href: '/a-propos/genese' },
			{ label: 'Equipe dirigeante', href: '/a-propos/equipe-dirigeante' },
			{ label: 'Gouvernance', href: '/a-propos/gouvernance' },
			{ label: 'Logo', href: '/a-propos/logo' },
			{ label: 'Vision et Objectifs', href: '/a-propos/vision-objectifs' }
		],
		activites: [
			{ label: 'Toutes les activités', href: '/activites' },
			{ label: 'Célébrations', href: '/activites?type=celebrations-diverses' },
			{ label: 'Renforcement capacités', href: '/activites?type=renforcement-de-capacites' },
			{ label: 'Actions sociales', href: '/activites?type=actions-sociales' },
			{ label: 'Sensibilisation', href: '/activites?type=sensibilisation-communication' },
			{ label: 'Initiatives Diverses', href: '/activites?type=autres-initiatives' }
		]
	};

	function closeAllDropdowns() {
		amicaleOpen = false;
		activitesOpen = false;
	}
</script>

<!-- Main Header -->
<header class="bg-white sticky top-0 z-50 shadow-md">
	<div class="container mx-auto px-4">
		<div class="flex justify-between items-center py-3">
			<!-- Logo + Social Icons -->
			<div class="flex items-center gap-2">
				<a href="/" class="flex-shrink-0">
					<img src="/images/logo-afmef.png" alt="AFMEF" class="h-12 md:h-14 w-auto" />
				</a>
				<!-- Social Icons - Desktop (green icons, no background) -->
				<div class="hidden xl:flex items-center gap-2 ml-6">
					<a href="https://www.facebook.com/profile.php?id=61560847287467" target="_blank" rel="noopener" aria-label="Facebook" class="w-5 h-5 flex items-center justify-center text-primary transition-all hover:opacity-75">
						<svg class="w-5 h-5" viewBox="0 0 320 512" fill="currentColor"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
					</a>
					<a href="https://www.instagram.com/afmefbenin" target="_blank" rel="noopener" aria-label="Instagram" class="w-5 h-5 flex items-center justify-center text-primary transition-all hover:opacity-75">
						<svg class="w-5 h-5" viewBox="0 0 448 512" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
					</a>
					<a href="https://whatsapp.com/channel/0029VbBlsJGF1YlURfRdjb0h" target="_blank" rel="noopener" aria-label="WhatsApp" class="w-5 h-5 flex items-center justify-center text-primary transition-all hover:opacity-75">
						<svg class="w-5 h-5" viewBox="0 0 448 512" fill="currentColor"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
					</a>
					<a href="https://youtube.com/@afmefbenin" target="_blank" rel="noopener" aria-label="YouTube" class="w-5 h-5 flex items-center justify-center text-primary transition-all hover:opacity-75">
						<svg class="w-5 h-5" viewBox="0 0 576 512" fill="currentColor"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>
					</a>
				</div>
			</div>

			<!-- Desktop Navigation -->
			<nav class="hidden xl:flex items-center gap-1">
				<!-- L'Amicale Dropdown -->
				<div class="relative group">
					<button
						class="nav-link flex items-center gap-1.5"
						onmouseenter={() => { closeAllDropdowns(); amicaleOpen = true; }}
						onmouseleave={() => amicaleOpen = false}
					>
						L'Amicale
						<svg class="w-3 h-3 transition-transform duration-200" class:rotate-180={amicaleOpen} viewBox="0 0 320 512" fill="currentColor"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"/></svg>
					</button>
					<div
						class="dropdown-menu"
						class:dropdown-open={amicaleOpen}
						onmouseenter={() => amicaleOpen = true}
						onmouseleave={() => amicaleOpen = false}
					>
						{#each menuItems.amicale as item}
							<a href={item.href} class="dropdown-item">{item.label}</a>
						{/each}
					</div>
				</div>

				<!-- Activités Dropdown -->
				<div class="relative group">
					<a
						href="/activites"
						class="nav-link flex items-center gap-1.5"
						onmouseenter={() => { closeAllDropdowns(); activitesOpen = true; }}
						onmouseleave={() => activitesOpen = false}
					>
						Activités
						<svg class="w-3 h-3 transition-transform duration-200" class:rotate-180={activitesOpen} viewBox="0 0 320 512" fill="currentColor"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"/></svg>
					</a>
					<div
						class="dropdown-menu"
						class:dropdown-open={activitesOpen}
						onmouseenter={() => activitesOpen = true}
						onmouseleave={() => activitesOpen = false}
					>
						{#each menuItems.activites as item}
							<a href={item.href} class="dropdown-item">{item.label}</a>
						{/each}
					</div>
				</div>

				<a href="/ressources" class="nav-link">Ressources</a>
				<a href="/contact" class="nav-link">Contactez-Nous</a>
				<a href="/adhesion" class="nav-link">Adhésion</a>

				<!-- CTA Buttons -->
				<div class="flex items-center gap-2 ml-4">
					<a href="/faire-un-don" class="btn btn-primary">Faire Un Don</a>
					<a href="/espace-membre" class="btn btn-outline">Espace Membre</a>
				</div>
			</nav>

			<!-- Mobile Menu Button -->
			<button
				class="xl:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
				onclick={() => mobileMenuOpen = !mobileMenuOpen}
				aria-label="Menu Toggle"
			>
				{#if mobileMenuOpen}
					<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18"/>
						<line x1="6" y1="6" x2="18" y2="18"/>
					</svg>
				{:else}
					<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="3" y1="6" x2="21" y2="6"/>
						<line x1="3" y1="12" x2="21" y2="12"/>
						<line x1="3" y1="18" x2="21" y2="18"/>
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<nav class="xl:hidden bg-white border-t border-gray-100 animate-slide-down">
			<div class="container mx-auto px-4 py-4">
				<!-- Mobile: L'Amicale -->
				<div class="mobile-menu-section">
					<button
						class="mobile-menu-header"
						onclick={() => amicaleOpen = !amicaleOpen}
					>
						<span>L'Amicale</span>
						<svg class="w-4 h-4 transition-transform duration-200" class:rotate-180={amicaleOpen} viewBox="0 0 320 512" fill="currentColor"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"/></svg>
					</button>
					{#if amicaleOpen}
						<div class="mobile-submenu">
							{#each menuItems.amicale as item}
								<a href={item.href} class="mobile-submenu-item">{item.label}</a>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Mobile: Activités -->
				<div class="mobile-menu-section">
					<button
						class="mobile-menu-header"
						onclick={() => activitesOpen = !activitesOpen}
					>
						<span>Activités</span>
						<svg class="w-4 h-4 transition-transform duration-200" class:rotate-180={activitesOpen} viewBox="0 0 320 512" fill="currentColor"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"/></svg>
					</button>
					{#if activitesOpen}
						<div class="mobile-submenu">
							{#each menuItems.activites as item}
								<a href={item.href} class="mobile-submenu-item">{item.label}</a>
							{/each}
						</div>
					{/if}
				</div>

				<a href="/ressources" class="mobile-menu-link">Ressources</a>
				<a href="/contact" class="mobile-menu-link">Contactez-Nous</a>
				<a href="/adhesion" class="mobile-menu-link">Adhésion</a>

				<!-- Mobile CTA Buttons -->
				<div class="mt-4 pt-4 border-t border-gray-100 space-y-3">
					<a href="/faire-un-don" class="btn btn-primary btn-mobile">Faire Un Don</a>
					<a href="/espace-membre" class="btn btn-outline btn-mobile">Espace Membre</a>
				</div>
			</div>
		</nav>
	{/if}
</header>

<style>
	/* Navigation Links */
	.nav-link {
		padding: 0.5rem 0.875rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: #1c244b;
		transition: color 0.2s ease;
		position: relative;
	}
	.nav-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 0;
		height: 2px;
		background-color: var(--color-primary);
		transition: all 0.2s ease;
		transform: translateX(-50%);
	}
	.nav-link:hover {
		color: var(--color-primary);
	}
	.nav-link:hover::after {
		width: 80%;
	}

	/* Dropdown Menu */
	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		min-width: 220px;
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
		padding: 0.5rem 0;
		z-index: 50;
		opacity: 0;
		visibility: hidden;
		transform: translateY(8px);
		transition: all 0.2s ease;
	}
	.dropdown-menu.dropdown-open {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
	}
	.dropdown-item {
		display: block;
		padding: 0.625rem 1rem;
		font-size: 0.875rem;
		color: #334155;
		transition: all 0.15s ease;
		border-left: 3px solid transparent;
	}
	.dropdown-item:hover {
		background-color: var(--color-bg-light-green);
		color: var(--color-primary);
		border-left-color: var(--color-primary);
	}

	/* Button Styles - Full Rounded */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.625rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 9999px;
		transition: all 0.2s ease;
		text-decoration: none;
	}
	.btn:hover {
		transform: translateY(-2px);
	}
	.btn-primary {
		background-color: var(--color-primary);
		color: white;
		border: 2px solid var(--color-primary);
	}
	.btn-primary:hover {
		background-color: var(--color-primary-dark);
		border-color: var(--color-primary-dark);
	}
	.btn-outline {
		background-color: transparent;
		color: var(--color-primary);
		border: 2px solid var(--color-primary);
	}
	.btn-outline:hover {
		background-color: var(--color-primary);
		color: white;
	}
	.btn-mobile {
		display: block;
		width: 100%;
		padding: 0.75rem 1.5rem;
		text-align: center;
	}

	/* Mobile Menu Styles */
	.mobile-menu-section {
		border-bottom: 1px solid #f1f5f9;
	}
	.mobile-menu-header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.875rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #1c244b;
	}
	.mobile-submenu {
		padding-left: 1rem;
		padding-bottom: 0.5rem;
	}
	.mobile-submenu-item {
		display: block;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		color: #64748b;
		border-left: 2px solid #e2e8f0;
		transition: all 0.15s ease;
	}
	.mobile-submenu-item:hover {
		color: var(--color-primary);
		border-left-color: var(--color-primary);
		background-color: var(--color-bg-light-green);
	}
	.mobile-menu-link {
		display: block;
		padding: 0.875rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #1c244b;
		border-bottom: 1px solid #f1f5f9;
		transition: color 0.15s ease;
	}
	.mobile-menu-link:hover {
		color: var(--color-primary);
	}

	/* Animation */
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-slide-down {
		animation: slideDown 0.2s ease-out forwards;
	}
</style>
