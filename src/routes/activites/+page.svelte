<script>
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { getActivites, getTypesActivites } from '$lib/services/wordpress.js';

	// État de chargement
	let isLoading = $state(true);
	let activites = $state([]);
	let typesActivites = $state([]);
	let total = $state(0);
	let totalPages = $state(0);
	let currentPage = $state(1);
	let currentTypeSlug = $state(null);

	// Séparer les 3 premiers articles pour "À la une" et le reste
	let featuredActivites = $derived(activites.slice(0, 3));
	let otherActivites = $derived(activites.slice(3));

	// État pour le hero actif (style Stories)
	let activeHeroIndex = $state(0);
	let progress = $state(0);
	let isPaused = $state(false);
	let progressIntervalId = null;

	// Durée de chaque story (en ms)
	const STORY_DURATION = 6000;
	const PROGRESS_INTERVAL = 30;

	// Charger les données
	async function loadData() {
		isLoading = true;

		const urlParams = new URLSearchParams($page.url.search);
		currentPage = parseInt(urlParams.get('page') || '1');
		currentTypeSlug = urlParams.get('type');

		try {
			// Charger les types d'activités
			typesActivites = await getTypesActivites();

			// Trouver l'ID du type si un slug est spécifié
			let typeActivite = null;
			if (currentTypeSlug) {
				const type = typesActivites.find((t) => t.slug === currentTypeSlug);
				if (type) {
					typeActivite = type.id;
				}
			}

			// Charger les activités avec le filtre
			const activitesData = await getActivites({
				perPage: 12,
				page: currentPage,
				typeActivite
			});

			activites = activitesData.activites;
			total = activitesData.total;
			totalPages = activitesData.totalPages;
		} catch (error) {
			console.error('Erreur lors du chargement des activités:', error);
			activites = [];
		} finally {
			isLoading = false;
		}
	}

	// Démarrer l'auto-play
	function startAutoPlay() {
		stopAutoPlay();
		progress = 0;

		progressIntervalId = setInterval(() => {
			if (!isPaused) {
				progress += (PROGRESS_INTERVAL / STORY_DURATION) * 100;

				if (progress >= 100) {
					goToNext();
				}
			}
		}, PROGRESS_INTERVAL);
	}

	// Arrêter l'auto-play
	function stopAutoPlay() {
		if (progressIntervalId) {
			clearInterval(progressIntervalId);
			progressIntervalId = null;
		}
	}

	// Aller à la story suivante
	function goToNext() {
		if (featuredActivites.length > 0) {
			activeHeroIndex = (activeHeroIndex + 1) % featuredActivites.length;
			progress = 0;
		}
	}

	// Aller à la story précédente
	function goToPrev() {
		if (featuredActivites.length > 0) {
			activeHeroIndex = activeHeroIndex === 0 ? featuredActivites.length - 1 : activeHeroIndex - 1;
			progress = 0;
		}
	}

	// Sélectionner une story spécifique
	function goToStory(index) {
		activeHeroIndex = index;
		progress = 0;
	}

	// Pause au survol
	function handleMouseEnter() {
		isPaused = true;
	}

	function handleMouseLeave() {
		isPaused = false;
	}

	// Navigation par clic gauche/droite
	function handleHeroClick(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		const clickX = event.clientX - rect.left;
		const width = rect.width;

		if (clickX < width * 0.3) {
			goToPrev();
		} else if (clickX > width * 0.7) {
			goToNext();
		}
	}

	onMount(() => {
		loadData();
	});

	onDestroy(() => {
		stopAutoPlay();
	});

	// Recharger quand l'URL change
	$effect(() => {
		$page.url.search;
		loadData();
	});

	// Redémarrer l'autoplay quand les activités sont chargées
	$effect(() => {
		if (featuredActivites.length > 1 && !isLoading) {
			startAutoPlay();
		}
	});

	// Formater la date
	function formatDate(date) {
		return new Intl.DateTimeFormat('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(date));
	}

	// Obtenir l'URL de l'image (taille appropriée)
	function getImageUrl(image, size = 'medium_large') {
		if (!image) return null;
		return image.sizes?.[size]?.source_url || image.sizes?.medium?.source_url || image.url;
	}
</script>

<svelte:head>
	<title>Vie de l'Association - AFMEF</title>
	<meta
		name="description"
		content="Découvrez les activités et actualités de l'AFMEF : actions sociales, sensibilisation, célébrations et renforcement de capacités."
	/>
</svelte:head>

<!-- Hero Section statique -->
<section class="relative bg-primary overflow-hidden">
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<svg class="absolute -right-64 top-1/2 -translate-y-1/2 w-[900px] h-[900px]" viewBox="0 0 1838 1838" fill="none">
			<circle cx="919" cy="919" r="828.5" stroke="#FDD116" stroke-width="181" opacity="0.12"></circle>
		</svg>
	</div>

	<div class="relative container mx-auto px-4 max-w-[1300px] py-16 md:py-20">
		<div class="text-center max-w-3xl mx-auto">
			<span class="text-secondary text-sm font-semibold uppercase tracking-wider mb-4 block">Nos Activités</span>
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
				Vie de l'Association
			</h1>
			<p class="text-xl text-white/80 leading-relaxed">
				Découvrez les activités et actualités de l'AFMEF : actions sociales, sensibilisation, célébrations et renforcement de capacités.
			</p>
		</div>
	</div>
</section>

<!-- Section À la une - Stories Style -->
<section class="py-10 md:py-14 bg-gray-50">
	<div class="container mx-auto px-4 max-w-[1300px]">
		<!-- Titre de section -->
		<div class="mb-6">
			<h2 class="text-2xl md:text-3xl font-bold text-gray-900">À la une</h2>
			<div class="w-16 h-1 bg-primary mt-3 rounded-full"></div>
		</div>

		{#if isLoading}
			<!-- Skeleton pour le hero -->
			<div class="relative h-[500px] md:h-[550px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden bg-gray-200 animate-pulse">
				<div class="absolute inset-0 bg-gradient-to-t from-gray-300 via-gray-200 to-gray-200"></div>
				<div class="absolute bottom-0 left-0 right-0 p-5 md:p-8 lg:p-10">
					<div class="h-6 w-24 bg-gray-300 rounded-full mb-4"></div>
					<div class="h-10 w-3/4 bg-gray-300 rounded-lg mb-4"></div>
					<div class="h-6 w-1/2 bg-gray-300 rounded-lg mb-6"></div>
					<div class="h-12 w-40 bg-gray-300 rounded-full"></div>
				</div>
			</div>
		{:else if featuredActivites.length > 0}
			<!-- Hero Stories Container -->
			<div
				class="relative h-[500px] md:h-[550px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer select-none shadow-2xl"
				role="button"
				tabindex="0"
				onmouseenter={handleMouseEnter}
				onmouseleave={handleMouseLeave}
				onclick={handleHeroClick}
				onkeydown={(e) => e.key === 'ArrowRight' ? goToNext() : e.key === 'ArrowLeft' ? goToPrev() : null}
			>
				<!-- Progress Bars -->
				<div class="absolute top-0 left-0 right-0 z-30 px-4 pt-4 md:px-6 md:pt-5">
					<div class="flex gap-1.5 md:gap-2">
						{#each featuredActivites as _, i}
							<div class="flex-1 h-1 md:h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
								<div
									class="h-full bg-white rounded-full transition-all duration-100 ease-linear"
									style="width: {i < activeHeroIndex ? '100%' : i === activeHeroIndex ? `${progress}%` : '0%'}"
								></div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Background Images -->
				{#each featuredActivites as activite, i}
					<div
						class="absolute inset-0 transition-all duration-700 ease-out {activeHeroIndex === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}"
					>
						{#if getImageUrl(activite.image, 'large')}
							<img
								src={getImageUrl(activite.image, 'large')}
								alt=""
								class="w-full h-full object-cover"
							/>
						{/if}
						<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>
					</div>
				{/each}

				<!-- Zones de clic pour navigation -->
				<div class="absolute inset-y-0 left-0 w-1/3 z-20 cursor-w-resize" onclick={(e) => { e.stopPropagation(); goToPrev(); }}></div>
				<div class="absolute inset-y-0 right-0 w-1/3 z-20 cursor-e-resize" onclick={(e) => { e.stopPropagation(); goToNext(); }}></div>

				<!-- Contenu -->
				<div class="absolute inset-0 z-10 flex flex-col justify-end p-5 md:p-8 lg:p-10 pointer-events-none">
					<div class="absolute top-12 md:top-14 left-5 md:left-8 flex items-center gap-3">
						<span class="text-white/70 text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
							{activeHeroIndex + 1} / {featuredActivites.length}
						</span>
						{#if isPaused}
							<span class="text-white/70 text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1.5">
								<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
									<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
								</svg>
								Pause
							</span>
						{/if}
					</div>

					{#each featuredActivites as activite, i}
						<div class="transition-all duration-500 {activeHeroIndex === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 absolute pointer-events-none'}">
							{#if activeHeroIndex === i}
								<div class="flex flex-wrap items-center gap-3 mb-3 md:mb-4">
									{#if activite.types.length > 0}
										<span class="inline-block px-3 py-1 bg-secondary text-primary-darker text-xs md:text-sm font-bold rounded-full">
											{activite.types[0].name}
										</span>
									{/if}
									<time class="text-white/70 text-sm font-medium">
										{formatDate(activite.date)}
									</time>
								</div>

								<h3 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 md:mb-5 max-w-3xl">
									{activite.title}
								</h3>

								<p class="text-white/80 text-sm md:text-base lg:text-lg max-w-xl mb-5 md:mb-6 leading-relaxed line-clamp-2">
									{activite.excerpt}
								</p>

								<a
									href="/activites/{activite.slug}"
									class="pointer-events-auto group inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-darker font-bold text-sm md:text-base rounded-full hover:bg-secondary hover:scale-105 transition-all duration-300 shadow-xl"
								>
									<span>Lire l'article</span>
									<svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
									</svg>
								</a>
							{/if}
						</div>
					{/each}

					{#if featuredActivites.length > 1}
						<div class="absolute bottom-5 md:bottom-8 right-5 md:right-8 flex gap-2 pointer-events-auto">
							{#each featuredActivites as activite, i}
								<button
									onclick={(e) => { e.stopPropagation(); goToStory(i); }}
									class="group relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden transition-all duration-300 {activeHeroIndex === i ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100 hover:scale-105'}"
									aria-label="Voir l'article: {activite.title}"
								>
									{#if getImageUrl(activite.image)}
										<img src={getImageUrl(activite.image)} alt="" class="w-full h-full object-cover" />
									{:else}
										<div class="w-full h-full bg-white/20"></div>
									{/if}
									<div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="h-[300px] rounded-2xl bg-gray-100 flex items-center justify-center">
				<p class="text-gray-500">Aucune activité à la une</p>
			</div>
		{/if}
	</div>
</section>

<!-- Section Toutes les activités récentes -->
<section class="py-12 md:py-16 bg-gray-50">
	<div class="container mx-auto px-4 max-w-[1300px]">
		<div class="mb-8">
			<h2 class="text-2xl md:text-3xl font-bold text-gray-900">Toutes les activités récentes</h2>
			<div class="w-16 h-1 bg-primary mt-3 rounded-full"></div>
		</div>

		<!-- Filtres par type -->
		{#if isLoading}
			<div class="flex flex-wrap gap-2 mb-8">
				{#each Array(6) as _}
					<div class="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-wrap gap-2 mb-8">
				<a
					href="/activites"
					class="px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-300 whitespace-nowrap {!currentTypeSlug
						? 'bg-primary text-white shadow-md shadow-primary/25'
						: 'bg-white text-gray-600 hover:bg-primary/10 hover:text-primary border border-gray-200'}"
				>
					Toutes
					<span class="ml-1 text-xs opacity-70">({total})</span>
				</a>
				{#each typesActivites as type}
					<a
						href="/activites?type={type.slug}"
						class="px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-300 whitespace-nowrap {currentTypeSlug === type.slug
							? 'bg-primary text-white shadow-md shadow-primary/25'
							: 'bg-white text-gray-600 hover:bg-primary/10 hover:text-primary border border-gray-200'}"
					>
						{type.name}
						<span class="ml-1 text-xs opacity-70">({type.count})</span>
					</a>
				{/each}
			</div>
		{/if}

		<!-- Grille des activités -->
		{#if isLoading}
			<!-- Skeleton Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each Array(6) as _, i}
					<div class="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
						<div class="aspect-[4/3] bg-gray-200"></div>
						<div class="p-5">
							<div class="flex gap-2 mb-3">
								<div class="h-6 w-20 bg-gray-200 rounded-full"></div>
								<div class="h-6 w-24 bg-gray-200 rounded"></div>
							</div>
							<div class="h-6 w-full bg-gray-200 rounded mb-2"></div>
							<div class="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
							<div class="h-5 w-28 bg-gray-200 rounded"></div>
						</div>
					</div>
				{/each}
			</div>
		{:else if otherActivites.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each otherActivites as activite, i}
					<article
						class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
						style="animation: fadeInUp 0.6s ease-out {i * 80}ms backwards"
					>
						<a href="/activites/{activite.slug}" class="block">
							<div class="aspect-[4/3] overflow-hidden bg-gray-100">
								{#if getImageUrl(activite.image)}
									<img
										src={getImageUrl(activite.image)}
										alt={activite.image?.alt || activite.title}
										class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
										loading="lazy"
									/>
								{:else}
									<div class="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
										<svg class="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
									</div>
								{/if}
							</div>

							<div class="p-5">
								<div class="flex flex-wrap items-center gap-2 mb-3">
									{#if activite.types.length > 0}
										<span class="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
											{activite.types[0].name}
										</span>
									{/if}
									<time class="text-sm text-gray-500">
										{formatDate(activite.date)}
									</time>
								</div>

								<h3 class="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-3 line-clamp-2">
									{activite.title}
								</h3>

								<span class="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
									Lire la suite
									<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</span>
							</div>
						</a>
					</article>
				{/each}
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<nav class="flex justify-center items-center gap-2 mt-16" aria-label="Pagination">
					{#if currentPage > 1}
						<a
							href="/activites?page={currentPage - 1}{currentTypeSlug ? `&type=${currentTypeSlug}` : ''}"
							class="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all"
							aria-label="Page précédente"
						>
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
							</svg>
						</a>
					{/if}

					{#each Array(totalPages) as _, i}
						{@const pageNum = i + 1}
						{#if pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)}
							<a
								href="/activites?page={pageNum}{currentTypeSlug ? `&type=${currentTypeSlug}` : ''}"
								class="w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all {pageNum === currentPage
									? 'bg-primary text-white'
									: 'bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary'}"
								aria-label="Page {pageNum}"
								aria-current={pageNum === currentPage ? 'page' : undefined}
							>
								{pageNum}
							</a>
						{:else if pageNum === currentPage - 2 || pageNum === currentPage + 2}
							<span class="px-2 text-gray-400">...</span>
						{/if}
					{/each}

					{#if currentPage < totalPages}
						<a
							href="/activites?page={currentPage + 1}{currentTypeSlug ? `&type=${currentTypeSlug}` : ''}"
							class="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all"
							aria-label="Page suivante"
						>
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
						</a>
					{/if}
				</nav>
			{/if}
		{:else if activites.length <= 3 && activites.length > 0}
			<div class="text-center py-12">
				<p class="text-gray-500">
					Tous les articles récents sont affichés dans la section "À la une" ci-dessus.
				</p>
			</div>
		{:else}
			<div class="text-center py-16">
				<div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
					<svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
					</svg>
				</div>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">Aucune activité trouvée</h3>
				<p class="text-gray-500 mb-6">
					Il n'y a pas encore d'activités dans cette catégorie.
				</p>
				<a
					href="/activites"
					class="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
				>
					Voir toutes les activités
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</a>
			</div>
		{/if}
	</div>
</section>

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	:global(.bg-primary-darker) {
		background-color: #021f10;
	}

	.cursor-w-resize {
		cursor: w-resize;
	}
	.cursor-e-resize {
		cursor: e-resize;
	}
</style>
